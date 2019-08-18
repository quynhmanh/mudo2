import { ILoginModel } from "@Models/ILoginModel";
import Loader from "@Components/shared/Loader";
import { ApplicationState } from "@Store/index";
import { LoginStore } from "@Store/LoginStore";
import "@Styles/main.scss";;
import * as React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps, withRouter } from "react-router";
import bind from 'bind-decorator';
import { Form } from "@Components/shared/Form";
import GoogleLogin from 'react-google-login';
import uuidv4 from "uuid/v4";

declare global {
    interface Window { authenticationScope: any; }
}

class LoginPage extends React.Component<{init: any, loginRequest: any, onLoginSuccess: any, indicators: any,}, {user: any, isLoggedIn: boolean}> {

    state = {
        user: null,
        isLoggedIn: false,
    }

    constructor(props) {
        super(props);

        this.onLoginSuccess = this.onLoginSuccess.bind(this);
    }

    elLoader: Loader;
    elForm: Form;

    componentDidMount() {
        
        // this.props.init();
        
        if (this.elLoader) {
            this.elLoader.forceUpdate();
        }
    }

    @bind
    private async onClickSubmitBtn(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (this.elForm.isValid()) {
            var data = this.elForm.getData<ILoginModel>();
            this.props.loginRequest(data);
        }
    }

    responseGoogle = (response) => {
        console.log(response);
      }

      facebook() {
        const nonce = uuidv4();
        const url = "https://www.facebook.com/v4.0/dialog/oauth?"
            + "client_id=" + "476336289816631"
            + "&redirect_uri=" + "https://localhost:64099/users/authenticate/external?provider=facebook"
            + "&state=" + nonce
            + "&response_type=" + "token";
        window.authenticationScope = { complete: this.externalProviderCompleted.bind(this) };
        window.open(url, "Authenticate Account", "location=0,status=0,width=600,height=750");
    }

    google() {
        console.log('asdas d fuck fuck fucl');
        const url = "https://accounts.google.com/o/oauth2/v2/auth?"
            + "client_id=" + "75521893646-ejv81aiajee0gkt0ebs3pkohhubj47k1.apps.googleusercontent.com"
            + "&response_type=token"
            + "&scope=openid email"
            + "&redirect_uri=" + "https://localhost:64099/users/authenticate/external?provider=google"
            // + "&state=" + "..."
            /*
                TODO: Provide state variable!!!
                If you generate a random string or encode the hash of some client state (e.g., a cookie) in this state variable, 
                you can validate the response to additionally ensure that the request and response originated in the same browser.
            */
        window.authenticationScope = { complete: this.externalProviderCompleted.bind(this) };
        window.open(url, "Authenticate Account", "location=0,status=0,width=600,height=750");
        
    }

    externalProviderCompleted(fragment) {
        if (fragment === null || typeof fragment !== 'object' || !fragment.hasOwnProperty("access_token")) {
            alert("external login failed!");
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: fragment.access_token, provider: fragment.provider })
        };
        
        fetch(`/users/authenticate/external/verify`, requestOptions)
        .then(this.handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        })
        .then(
            user => { 
                console.log('user ', user);
                this.onLoginSuccess(user);
            },
            error => {
                alert(error);
            }
        );
    }

    handleResponse(response) {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                if (response.status === 401) {
                    // auto logout if 401 response returned from api
                    // logout();
                    window.location.reload(true);
                }
    
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
    
            return data;
        });
    }

    onLoginSuccess = async user => {
        var a = {
            login: user.username,
            password: "fuck fuck",
        }

        console.log(a);

        console.log('this.props ', this.props)

        await this.props.loginRequest(a);

        this.setState({
            user, 
            isLoggedIn: true,
          });
      }

    render() {

        console.log('asdasd', this.state.isLoggedIn)
        if (this.state.isLoggedIn) {
            console.log('heje', this.state);
            return <Redirect to='/' />;
        }

        console.log('heje', this.state);

        return <div id="loginPage">

            <Helmet>
                <title>Login page - RCB (TypeScript)</title>
            </Helmet>
            
            {/* <Loader ref={x => this.elLoader = x} show={this.props.indicators.operationLoading} /> */}

            <div id="loginContainer">

                <p className="text-center">Type any login and password to enter.</p>

                <Form ref={x => this.elForm = x}>
                    <div className="form-group">
                        <label htmlFor="inputLogin">Login</label>
                        <input type="text" name={nameof<ILoginModel>(x=>x.login)} data-value-type="string" className="form-control" id="inputLogin" data-val-required="true" data-msg-required="Login is required." />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputLogin">Password</label>
                        <input type="password" name={nameof<ILoginModel>(x=>x.password)} data-value-type="string" className="form-control" id="inputPassword" data-val-required="true" data-msg-required="Password is required." />
                    </div>
                    <div className="form-inline">
                        <button className="btn btn-success" onClick={this.onClickSubmitBtn}>Sign in</button>
                    </div>
                </Form>
                <button onClick={this.facebook.bind(this)} className="btn btn-primary">
                    Login with Facebook
                    </button>
                <br/>
                <button onClick={this.google.bind(this)} className="btn btn-primary">
                    Login with Google
                </button>
            </div>

        </div>;
    }
}


var component = connect(
    (state: ApplicationState) => state.login, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(LoginPage as any);

export default (withRouter(component as any) as any as typeof LoginPage)
