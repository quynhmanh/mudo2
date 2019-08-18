import { Route, RouteProps, Redirect } from "react-router";
import * as React from "react";
import Globals from "@Globals";

export interface IProps extends RouteProps {
    layout: React.ComponentClass<any>;
    authorizedRequired: boolean;
}

export const AppRoute = ({ component: Component, layout: Layout, authorizedRequired, path: Path, ...rest }: IProps) => {

    var isLoginPath = Path === "/login";
    if (!Globals.isAuthenticated && !isLoginPath && authorizedRequired) {
        return <Redirect to="/login" />;
    }
    if (Globals.isAuthenticated && isLoginPath) {
        return <Redirect to="/" />;
    }

    return <Route {...rest} render={props => (
        <Layout>
            <Component {...props} />
        </Layout>
    )} />;
}