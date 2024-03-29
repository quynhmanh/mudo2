import "@babel/polyfill";
import "custom-event-polyfill";

import React , { Suspense } from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import configureStore from './configureStore';
import { ApplicationState }  from './store';
import * as RoutesModule from './routes';
let routes = RoutesModule.routes;

import "@Styles/main.scss";
// import 'react-toastify/dist/ReactToastify.css';
import Globals from "@Globals";
import { isNode } from '@Utils';
import { IPublicSession } from "@Models/IPublicSession";
import { IPrivateSession } from "@Models/IPrivateSession";
import { NSerializeJson } from "nserializejson";
import './i18n';
import { Helmet } from "react-helmet";

const Loader = () => 
<div style={{ position: "fixed", width: "100vw", height: "100vh", top: "50%", left: "50%" }}>
    <Helmet>
        <title>Draft</title>
    </Helmet>
    <p
        style={{
            margin: 'auto',
            textAlign: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: '100px',
            height: '20px',
        }}
    >Loading...</p>
</div>;

function setupSession() {
    if (!isNode()) {
        Globals.reset();
        Globals.init({ public: window["publicSession"] as IPublicSession, private: {} as IPrivateSession });
    }
};

function setupGlobalPlugins() {
    // Use dot notation in the name attributes of the form inputs.
    NSerializeJson.options.useDotSeparatorInPath = true;
};

function setupEvents() {
    document.addEventListener('DOMContentLoaded', () => {
        var preloader = document.getElementById("preloader");
        preloader.classList.add("hidden");
    });
};

// Create browser history to use in the Redux store.
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = (window as any).initialReduxState as ApplicationState;
const store = configureStore(history, initialState);

function renderApp() {
    // This code starts up the React app when it runs in a browser. It sets up the routing configuration
    // and injects the app into a DOM element.
    ReactDOM.hydrate(
        <AppContainer>
            <Suspense fallback={<Loader />}>
                <Provider store={ store }>
                    <ConnectedRouter history={ history } children={ routes } />
                </Provider>
            </Suspense>
        </AppContainer>,
        document.getElementById('react-app')
    );
}

setupSession();

setupGlobalPlugins();

setupEvents();

// loadableReady(() => {
    renderApp();
// })

// Allow Hot Module Replacement.
if (module.hot) {
    module.hot.accept('./routes', () => {
        routes = require<typeof RoutesModule>('./routes').routes;
        renderApp();
    });
}