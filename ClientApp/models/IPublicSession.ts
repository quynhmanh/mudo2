import { IServiceUser } from "@Models/IServiceUser";
import { ILocale } from "@Models/ILocale";

/**
 * Isomorphic application session data.
 */
export interface IPublicSession {
    serviceUser?: IServiceUser;
    locale?: ILocale;
}