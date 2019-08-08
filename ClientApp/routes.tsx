import AuthorizedLayout from '@Layouts/AuthorizedLayout';
import GuestLayout from "@Layouts/GuestLayout";
import Editorlayout from "@Layouts/EditorLayout";
import LoginPage from '@Pages/LoginPage';
import { AppRoute } from "@Components/shared/AppRoute";
import * as React from 'react';
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



export const routes = <Switch>
    <AppRoute layout={GuestLayout} exact path="/login" component={LoginPage} />
    <AppRoute layout={AuthorizedLayout} exact path="/" component={HomePage} />
    <AppRoute layout={AuthorizedLayout} exact path="/home" component={HomePage} />
    <AppRoute layout={AuthorizedLayout} exact path="/example" component={ExamplePage} />
    <AppRoute layout={AuthorizedLayout} exact path="/editor" component={TemplatesPage}/>
    <AppRoute layout={EditorLayout} exact path="/editor/:template_id" component={Editor} />
    <AppRoute layout={Editorlayout} exact path="/editor/:width/:height/:mode" component={Editor} />
    <AppRoute layout={AuthorizedLayout} path="/templates" component={TemplatesPage}/>
    <AppRoute layout={AuthorizedLayout} exact path="/business-cards" component={TemplatesListPage}/>
    <AppRoute layout={AuthorizedLayout} exact path="/print" component={PrintPage}/>
    <AppRoute layout={AuthorizedLayout} exact path="/about" component={AboutPage}/>
    <AppRoute layout={AuthorizedLayout} exact path="/pricing/pricing" component={PricingPage}/>
</Switch>;