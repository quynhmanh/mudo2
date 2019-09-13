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

        return (<div><div style={{display: 'flex'}} id="loginPage">
            <Helmet>
                <title>Đăng nhập</title>
            </Helmet>
            
            <div id="loginContainer" style={{margin: 0}}>
                <h1 style={{textAlign: 'center', marginTop: 0, marginBottom: '10px',}}>Đăng nhập</h1>
                <button 
                    style={{
                        width: '100%',
                        marginBottom: '10px',
                        background: 'white',
                        color: 'black',
                        border: '2px solid rgba(14,19,24,.15)',
                        borderRadius: '4px',
                    }} 
                    onClick={this.facebook.bind(this)} className="btn btn-primary">
<svg 
    style={{
        marginBottom: '-6px',
        marginRight: '10px',
        color: '#3b5998'
    }}
    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.61v-6.97h-2.34V11.3h2.34v-2c0-2.33 1.42-3.6 3.5-3.6 1 0 1.84.08 2.1.12v2.43h-1.44c-1.13 0-1.35.53-1.35 1.32v1.73h2.69l-.35 2.72h-2.34V21h4.59a1 1 0 0 0 .99-1V4a1 1 0 0 0-1-1z"></path></svg>                    
                    <span>Đăng nhập với Facebook</span>
                    </button>
                <button 
                    style={{
                        width: '100%',
                        backgroundColor: 'rgb(211, 72, 54)',
                        background: 'white',
                        color: 'black',
                        border: '2px solid rgba(14,19,24,.15)',
                        borderRadius: '4px',
                    }} 
                    onClick={this.google.bind(this)} className="btn btn-primary">
                        <svg
                        style={{
                            marginBottom: '-6px',
                            marginRight: '10px',
                        }}
                        width="24" height="24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z" fill="#4285F4"></path><path d="M12 21a8.6 8.6 0 0 0 5.96-2.18l-2.91-2.26a5.4 5.4 0 0 1-8.09-2.85h-3v2.33A9 9 0 0 0 12 21z" fill="#34A853"></path><path d="M6.96 13.71a5.41 5.41 0 0 1 0-3.42V7.96h-3a9 9 0 0 0 0 8.08l3-2.33z" fill="#FBBC05"></path><path d="M12 6.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59A9 9 0 0 0 3.96 7.95l3 2.34A5.36 5.36 0 0 1 12 6.58z" fill="#EA4335"></path></g></svg>
                    <span>Đăng nhập với Google</span>
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
                {/* <p style={{}} className="text-center">Nhập tên tài khoản và mật khẩu vào ô bên dưới để đăng nhập.</p>
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
                </Form> */}
            </div>
            
            <aside style={{display: 'inline-block', width: 'calc(100% - 400px)',}} className="_1Y4htTbzPz3Jj9sPOFO_yz">
    <div className="_24XEazp9xLYxfgTQwqiv0e">
        <div className="_1YX2jPnj02AQRSo4KrULnX">
            <div className="_1B2G-KBwHr6SFoOYKrrPQv">
                <svg viewBox="0 0 2132 1314" className="_3wsGupFML5awyFGCP9STfN">
                    <image xlinkHref="https://static.canva.com/web/images/309f00f11e3bec99e08e539ea624f5c3.png" width={2132} height={1314} />
                    <image className="_1Hrk04tQbg2yOWVq56XWaH _1fyVxYks--jVn1PQzTMTmf" xlinkHref="https://static.canva.com/web/images/08de548a6f1de57f3ebe7c013dde8016.png" width={2132} height={1314} />
                    <foreignObject x={1910} y={934} width={110} height={60}>
                        <div className="_2MQRjmuqp0UnoAwXEc1g11">Spacing</div>
                    </foreignObject>
                </svg>
            </div>
        </div>
    </div>
</aside>
            </div>
            <div className="_30p__PONPi-YqVEVlgnN_6"
                style={{
                    padding: '20px',
                }}
            >
    <div className="_22sigMUdyJNIFhyyvf2MEI GBHbdnAmvUa3G4DLXk6Mj">
        <h3 className="_2lgTACDxLrI1ZOlITIhup- W9IR-ZsiAOretU6xTyjoD _2f7Wjwll8O11wJb1_gQkn1 _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _1fgQS83UQD74-sbLyIX6g2 _1kLjfztPsOUw9W-PSOI9Zu">Bạn sẽ thiết kế gì ?</h3></div>
    <div className="-ePYCIKwmKaSsQTHX72YG putVYyFpLWTsqziLXPxhR">
        <div className="_3PK-lmKzpAGcI8WTdBQX4i">
            <div className="_1sza4uX0yqDVxS7xsxMj-L" style={{transform: 'translateX(0px)', marginLeft: '-16px'}}>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPlT3nYM/3/0/thumbnail_large.jpg" alt="Social Media" draggable="false" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Social Media">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Social Media</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MAC7nvfeo9g/5/0/thumbnail_large.jpg" alt="Presentation" draggable="false" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Presentation">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Presentation</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPpWR6AM/4/0/thumbnail_large.jpg" alt="Poster" draggable="false" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Poster">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Poster</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPpJEfIY/1/0/thumbnail_large-1.jpg" alt="Facebook Cover" draggable="false" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Facebook Cover">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Facebook Cover</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPjqjKaE/1/0/thumbnail_large-1.jpg" alt="Flyer" draggable="false" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Flyer">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Flyer</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a"  target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MAC4-jLh4zI/3/0/thumbnail_large.jpg" alt="Facebook Post" draggable="false" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Facebook Post">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Facebook Post</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MACytlYGjpE/1/0/thumbnail_large-7.jpg" alt="Instagram Post" draggable="false" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Instagram Post">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Instagram Post</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADLhR9Ss1k/3/0/thumbnail_large.jpg" alt="Blog Banner" draggable="false" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Blog Banner">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Blog Banner</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPndQv8A/1/0/thumbnail_large-1.jpg" alt="Card" draggable="false" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Card">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Card</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADGeZLBv64/3/0/thumbnail_large.jpg" alt="Email Header" draggable="false" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Email Header">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Email Header</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MAC3Yq3okKs/1/0/thumbnail_large-5.jpg" alt="Twitter Post" draggable="false" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Twitter Post">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Twitter Post</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPn5AItM/3/0/thumbnail_large.jpg" alt="Pinterest Graphic" draggable="false" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Pinterest Graphic">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Pinterest Graphic</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MAC6SzsCfjk/1/0/thumbnail_large-2.jpg" alt="Facebook App Ad" draggable="false" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Facebook App Ad">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Facebook App Ad</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPuq6KoU/1/0/thumbnail_large-1.jpg" alt="Tumblr Graphic" draggable="false" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Tumblr Graphic">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Tumblr Graphic</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MACzQ_XLjmU/1/0/thumbnail_large-7.jpg" alt="US Letter Document" draggable="false" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="US Letter Document">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>US Letter Document</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPra3zWc/1/0/thumbnail_large-1.jpg" alt="A4 Document" draggable="false" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="A4 Document">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>A4 Document</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADLhfrXwUM/2/0/thumbnail_large.jpg" alt="Letterhead" draggable="false" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Letterhead">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Letterhead</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <div className="_1e9RJ140GkyvDh6KOo5VX6 _3olv_1czQo3hEv28-Bjg7P" style={{top: 'calc(calc(50% - 20px) + -20px)', right: '-24px'}}><span className="_1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh _3afRAIYF_d3AMkQFT_AuCI"><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16"><path fill="currentColor" d="M6.47 4.29l3.54 3.53c.1.1.1.26 0 .36L6.47 11.7a.75.75 0 1 0 1.06 1.06l3.54-3.53c.68-.69.68-1.8 0-2.48L7.53 3.23a.75.75 0 0 0-1.06 1.06z" /></svg></span></div>
    </div>
        </div>
            </div>);
    }
}

var component = connect(
    (state: ApplicationState) => state.login, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(LoginPage as any);

export default (withRouter(component as any) as any as typeof LoginPage)
