import React, { Component } from 'react';
import AuthorizedLayout from '@Layouts/AuthorizedLayout';
import GuestLayout from "@Layouts/GuestLayout";
import Editorlayout from "@Layouts/EditorLayout";
import { AppRoute } from "@Components/shared/AppRoute";
import { Switch } from 'react-router-dom';
// import HomePage from '@Pages/HomePage';
import Editor from '@Pages/Editor';
import EditorContainer from '@Pages/EditorContainer';
import EditorLayout from '@Layouts/EditorLayout';
// import TemplatesPage from '@Pages/TemplatesPage';
// import TemplatesListPage from '@Pages/TemplatesListPage';
// import PrintPage from '@Pages/PrintPage';
// import AboutPage from '@Pages/AboutPage';
// import PricingPage from '@Pages/PricingPage';
// import AccountPage from '@Pages/AccountPage';
// import ImageBackgroundRemovalEditor from '@Components/editor/ImageBackgroundRemovalEditor';
import loadable from '@loadable/component';
import "@Styles/editor.scss";

// const EditorContainer = loadable(() => import("@Pages/EditorContainer"));
const LoginPage = loadable(() => import("@Pages/LoginPage"));
const HomePage = loadable(() => import("@Pages/HomePage"));
const TemplatesPage = loadable(() => import("@Pages/TemplatesPage"));
const AccountPage = loadable(() => import("@Pages/AccountPage"));
const TemplatesListPage = loadable(() => import("@Pages/TemplatesListPage"));
const PrintPage = loadable(() => import("@Pages/PrintPage"));
const AboutPage = loadable(() => import("@Pages/AboutPage"));
const ImageBackgroundRemovalEditor = loadable(() => import("@Components/editor/ImageBackgroundRemovalEditor"));
const PricingPage = loadable(() => import("@Pages/PricingPage"));


export const routes = <Switch>
        <AppRoute authorizedRequired={false} layout={GuestLayout} exact path="/login" component={LoginPage} />
        <AppRoute authorizedRequired={false} layout={AuthorizedLayout} exact path="/" component={HomePage} />
        <AppRoute authorizedRequired={true} layout={AuthorizedLayout} exact path="/home" component={HomePage} />
        <AppRoute authorizedRequired={true} layout={AuthorizedLayout} exact path="/editor" component={TemplatesPage}/>
        <AppRoute authorizedRequired={false} layout={EditorLayout} exact path="/editor/:template_id" component={EditorContainer}/>
        <AppRoute authorizedRequired={false} layout={EditorLayout} exact path="/editor/design/:template_id" component={EditorContainer} />
        <AppRoute authorizedRequired={false} layout={EditorLayout} exact path="/editor/design/:design_id/:template_id" component={EditorContainer} />
        <AppRoute authorizedRequired={false} layout={EditorLayout} exact path="/editor/template/:template_id" component={EditorContainer} />
        <AppRoute authorizedRequired={false} layout={EditorLayout} exact path="/editor/admin/template/:template_id" component={EditorContainer} />
        <AppRoute authorizedRequired={false} layout={EditorLayout} exact path="/editor/:subtype/:mode" component={EditorContainer} />
        <AppRoute authorizedRequired={false} layout={EditorLayout} exact path="/editor/:subtype/:mode" component={EditorContainer} />
        <AppRoute authorizedRequired={false} layout={EditorLayout} exact path="/editor/admin/:subtype/:mode" component={EditorContainer} />
        <AppRoute authorizedRequired={false} layout={Editorlayout} exact path="/editor/:width/:height/:mode" component={EditorContainer} />
        <AppRoute authorizedRequired={false} layout={AuthorizedLayout} path="/templates" component={TemplatesPage}/>
        <AppRoute authorizedRequired={true} layout={AuthorizedLayout} exact path="/account" component={AccountPage}/>
        <AppRoute authorizedRequired={true} layout={AuthorizedLayout} path="/account/:info" component={AccountPage}/>
        <AppRoute authorizedRequired={true} layout={AuthorizedLayout} exact path="/business-cards" component={TemplatesListPage}/>
        <AppRoute authorizedRequired={true} layout={AuthorizedLayout} exact path="/print" component={PrintPage}/>
        <AppRoute authorizedRequired={true} layout={AuthorizedLayout} exact path="/about" component={AboutPage}/>
        <AppRoute authorizedRequired={true} layout={AuthorizedLayout} exact path="/cart" component={AboutPage}/>
        <AppRoute authorizedRequired={true} layout={AuthorizedLayout} exact path="/remove-background/:media_id" component={ImageBackgroundRemovalEditor}/>
        <AppRoute authorizedRequired={true} layout={AuthorizedLayout} exact path="/pricing/pricing" component={PricingPage}/>
    </Switch>;