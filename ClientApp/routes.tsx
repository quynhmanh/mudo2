import React, { Component } from 'react';
import AuthorizedLayout from '@Layouts/AuthorizedLayout';
import GuestLayout from "@Layouts/GuestLayout";
import Editorlayout from "@Layouts/EditorLayout";
import LoginPage from '@Pages/LoginPage';
import { AppRoute } from "@Components/shared/AppRoute";
import { Switch } from 'react-router-dom';
import HomePage from '@Pages/HomePage';
import ExamplePage from '@Pages/ExamplePage';
import Editor from '@Pages/Editor';
import EditorLayout from '@Layouts/EditorLayout';
import TemplatesPage from '@Pages/TemplatesPage';
import TemplatesListPage from '@Pages/TemplatesListPage';
import PrintPage from '@Pages/PrintPage';
import AboutPage from '@Pages/AboutPage';
import PricingPage from '@Pages/PricingPage';
import AccountPage from '@Pages/AccountPage';


export const routes = <Switch>
    <AppRoute authorizedRequired={true} layout={GuestLayout} exact path="/login" component={LoginPage} />
    <AppRoute authorizedRequired={false} layout={GuestLayout} exact path="/" component={HomePage} />
    <AppRoute authorizedRequired={true} layout={AuthorizedLayout} exact path="/home" component={HomePage} />
    <AppRoute authorizedRequired={true} layout={AuthorizedLayout} exact path="/example" component={ExamplePage} />
    <AppRoute authorizedRequired={true} layout={AuthorizedLayout} exact path="/editor" component={TemplatesPage}/>
    <AppRoute authorizedRequired={true} layout={EditorLayout} exact path="/editor/:template_id" component={Editor} />
    <AppRoute authorizedRequired={true} layout={EditorLayout} exact path="/editor/:subtype/:mode" component={Editor} />
    <AppRoute authorizedRequired={true} layout={Editorlayout} exact path="/editor/:width/:height/:mode" component={Editor} />
    <AppRoute authorizedRequired={true} layout={AuthorizedLayout} path="/templates" component={TemplatesPage}/>
    <AppRoute authorizedRequired={true} layout={AuthorizedLayout} exact path="/account" component={AccountPage}/>
    <AppRoute authorizedRequired={true} layout={AuthorizedLayout} path="/account/:info" component={AccountPage}/>
    <AppRoute authorizedRequired={true} layout={AuthorizedLayout} exact path="/business-cards" component={TemplatesListPage}/>
    <AppRoute authorizedRequired={true} layout={AuthorizedLayout} exact path="/print" component={PrintPage}/>
    <AppRoute authorizedRequired={true} layout={AuthorizedLayout} exact path="/about" component={AboutPage}/>
    <AppRoute authorizedRequired={true} layout={AuthorizedLayout} exact path="/cart" component={AboutPage}/>
    <AppRoute authorizedRequired={true} layout={AuthorizedLayout} exact path="/pricing/pricing" component={PricingPage}/>
</Switch>;