import Result from "@Models/Result";
import Axios, { AxiosRequestConfig } from "axios";
import { transformUrl } from "domain-wait";
import jsonToUrl from "json-to-url";
import { isNode } from "@Utils";
import Globals from "@Globals";
import { IServiceUser } from "@Models/IServiceUser";

export interface IRequestOptions {
    url: string;
    data?: any;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    headers?: any;
}

export interface ISendFormDataOptions {
    url: string;
    data: FormData;
    method: "POST" | "PUT" | "PATCH";
}

/**
 * Represents base class of the isomorphic service.
 */
export abstract class ServiceBase {

    /**
     * Make request with JSON data.
     * @param opts
     */
    public static async requestJson<T>(opts: IRequestOptions): Promise<Result<T>> {

        var axiosResult = null;
        var result = null;

        opts.url = transformUrl(opts.url); // Allow requests also for the Node.

        var processQuery = (url: string, data: any): string => {
            if (data) {
                return `${url}?${jsonToUrl(data)}`;
            }
            return url;
        };

        var axiosRequestConfig : AxiosRequestConfig;

        if (isNode()) {
            // Make SSR requests 'authorized' from the NodeServices to the web server.
            axiosRequestConfig = {
                headers: {
                    Cookie: Globals.getSession().private.cookie
                }
            }
        }

        if (opts.headers) {
            axiosRequestConfig = {
                ...axiosRequestConfig,
                headers: {
                    ...opts.headers
                }
            }
        }

        try {
            switch (opts.method) {
                case "GET":
                    axiosResult = await Axios.get(processQuery(opts.url, opts.data), axiosRequestConfig);
                    break;
                case "POST":
                    axiosResult = await Axios.post(opts.url, opts.data, axiosRequestConfig);
                    break;
                case "PUT":
                    axiosResult = await Axios.put(opts.url, opts.data, axiosRequestConfig);
                    break;
                case "PATCH":
                    axiosResult = await Axios.patch(opts.url, opts.data, axiosRequestConfig);
                    break;
                case "DELETE":
                    axiosResult = await Axios.delete(processQuery(opts.url, opts.data), axiosRequestConfig);
                    break;
            }
            result = new Result(axiosResult.data.value, ...axiosResult.data.errors);
        } catch (error) {
            const response = error.response;
            if (response.status === 401 && response.headers.hasOwnProperty('token-expired')) {
                var jwtToken = Globals.serviceUser.token;
                var refreshToken = Globals.serviceUser.refreshToken;
                var refreshResponse = await this.requestJson<IServiceUser>({
                    url: "api/Token/Refresh",
                    method: "POST",
                    data: { token: jwtToken, refreshToken },
                });

                if (!refreshResponse.hasErrors) {
                    Globals.serviceUser.token = refreshResponse.value.token;
                    Globals.serviceUser.refreshToken = refreshResponse.value.refreshToken;
                    if (opts.headers.hasOwnProperty("Authorization"))
                        opts.headers.Authorization = `Bearer ${Globals.serviceUser.token}`;
                    return await this.requestJson<T>(opts);
                } else {
                    const message = refreshResponse.errors[0];
                    if (message === 'REFRESH_TOKEN_EXPIRED')
                    Globals.serviceUser = null;
                }
            }
            result = new Result(null, error.message);
        }

        if (result.hasErrors) {
            // Ui.showErrors(...result.errors);
        }

        return result;
    }

    /**
     * Allows you to send files to the server.
     * @param opts
     */
    public static async sendFormData<T>(opts: ISendFormDataOptions): Promise<Result<T>> {
        var axiosResult = null;
        var result = null;

        opts.url = transformUrl(opts.url); // Allow requests also for Node.

        var axiosOpts = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        try {
            switch (opts.method) {
                case "POST":
                    axiosResult = await Axios.post(opts.url, opts.data, axiosOpts);
                    break;
                case "PUT":
                    axiosResult = await Axios.put(opts.url, opts.data, axiosOpts);
                    break;
                case "PATCH":
                    axiosResult = await Axios.patch(opts.url, opts.data, axiosOpts);
                    break;
            }
            result = new Result(axiosResult.data.value, ...axiosResult.data.errors);
        } catch (error) {
            result = new Result(null, error.message);
        }

        if (result.hasErrors) {
            // Ui.showErrors(...result.errors);
        }

        return result;
    }
}