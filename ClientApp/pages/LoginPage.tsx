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
import Globals from "@Globals";

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
        
      }

      facebook() {
        const nonce = uuidv4();
        const url = "https://www.facebook.com/v4.0/dialog/oauth?"
            + "client_id=" + "476336289816631"
            + "&redirect_uri=" + window.location.origin + "/users/authenticate/external?provider=facebook"
            + "&scope=" + "email"
            + "&return_scopes=" + "true"
            + "&auth_type=" + "rerequest"
            + "&response_type=" + "token"
            + "&state=" + nonce; // todo: need store nonce somewhere and then compare it with state from response
        window.authenticationScope = { complete: this.externalProviderCompleted.bind(this) };
        window.open(url, "_blank");
    }

    google() {
        const nonce = uuidv4();
        const url = "https://accounts.google.com/o/oauth2/v2/auth?"
            + "client_id=" + "75521893646-ejv81aiajee0gkt0ebs3pkohhubj47k1.apps.googleusercontent.com"
            + "&response_type=token"
            + "&scope=openid email"
            + "&redirect_uri=" + window.location.origin + "/users/authenticate/external?provider=google"
            + "&state=" + nonce; // todo: need store nonce somewhere and then compare it with state from response
        window.authenticationScope = { complete: this.externalProviderCompleted.bind(this) };
        window.open(url, "_blank");
        
    }

    externalProviderCompleted(fragment) {    
        if (fragment === null || typeof fragment !== 'object' || !fragment.hasOwnProperty("access_token")) {
            // alert("external login failed!");
            return;
        }

        const { access_token, provider } = fragment;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: access_token, provider, scope: provider === 'facebook' ? fragment.granted_scopes : fragment.scope })
        };
 
        fetch(`/users/authenticate/external/verify`, requestOptions)
        .then(this.handleResponse)
        .then(user => {
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        })
        .then(
            user => { 
                this.onLoginSuccess(user);
            },
            error => {

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
        // var a = {
        //     username: user.username,
        //     password: "fuck fuck",
        // }
        // await this.props.loginRequest(a);
        
        Globals.serviceUser = user;

        this.setState({
            user, 
            isLoggedIn: true,
          });
      }

    render() {

        if (this.state.isLoggedIn) {
            return <Redirect to='/' />;
        }

        return <div id="loginPage" style={{
            left: 0,
            right: 0,
            position: 'absolute',
        }}>

            <Helmet>
                <title>Đăng nhập</title>
            </Helmet>
            
            {/* <Loader ref={x => this.elLoader = x} show={this.props.indicators.operationLoading} /> */}
            <h1 style={{textAlign: 'center', color: 'white'}}>Đăng nhập</h1>
            <div id="loginContainer">
                <button 
                    style={{
                        width: '100%',
                        borderRadius: 0,
                        border: 'none',
                        marginBottom: '10px',
                    }} 
                    onClick={this.facebook.bind(this)} className="btn btn-primary">
                    Login with Facebook
                    </button>
                <br/>
                <button 
                    style={{
                        width: '100%',
                        backgroundColor: 'rgb(211, 72, 54)',
                        borderRadius: 0,
                        border: 'none',
                    }} 
                    onClick={this.google.bind(this)} className="btn btn-primary">
                    Login with Google
                </button>
                <div style={{position: 'relative', display: 'none',}} class="jsx-3592679178 separator"><hr className="jsx-3592679178"/>
                <span 
                    className="jsx-3592679178 text"
                    style={{
                        display: 'none',
                        position: 'absolute',
                        width: '50px',
                        left: 'calc(50% - 25px)',
                        top: '-10px',
                        textAlign: 'center',
                        backgroundColor: 'rgb(255, 255, 255)',
                        lineHeight: '2rem',
                    }}
                    >hoặc</span></div>
                <p style={{}} className="text-center">Nhập tên tài khoản và mật khẩu vào ô bên dưới để đăng nhập.</p>
                <Form style={{}} ref={x => this.elForm = x}>
                    <div style={{}} className="form-group">
                        <label htmlFor="inputLogin">Địa chỉ email</label>
                        <input type="text" name={nameof<ILoginModel>(x=>x.username)} data-value-type="string" className="form-control" id="inputLogin" data-val-required="true" data-msg-required="Login is required." />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputLogin">Mật khẩu</label>
                        <input type="password" name={nameof<ILoginModel>(x=>x.password)} data-value-type="string" className="form-control" id="inputPassword" data-val-required="true" data-msg-required="Password is required." />
                    </div>
                    <div 
                        className="form-inline"
                        >
                        <button
                            style={{
                                width: '100%',
                                borderRadius: 0,
                            }}
                            className="btn btn-success" onClick={this.onClickSubmitBtn}>Sign in</button>
                    </div>
                </Form>
            </div>

        </div>;
    }
}


var component = connect(
    (state: ApplicationState) => state.login, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(LoginPage as any);

export default (withRouter(component as any) as any as typeof LoginPage)
