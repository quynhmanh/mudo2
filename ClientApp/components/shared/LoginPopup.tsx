import React, {PureComponent} from 'react';  
import styled, {createGlobalStyle} from 'styled-components';
import uuidv4 from "uuid/v4";
import Loader from './Loader';

export interface IProps {
    onLoginSuccess: any;
  }
  
  interface IState {
    externalProviderCompleted: boolean,
  }

class LoginPopup extends PureComponent<IProps, IState> {
    state = {
        externalProviderCompleted: false,
    }
    facebook() {
        const nonce = uuidv4();
        const url =
          "https://www.facebook.com/v4.0/dialog/oauth?" +
          "client_id=" +
          "476336289816631" +
          "&redirect_uri=" +
          window.location.origin +
          "/users/authenticate/external?provider=facebook" +
          "&scope=" +
          "email" +
          "&return_scopes=" +
          "true" +
          "&auth_type=" +
          "rerequest" +
          "&response_type=" +
          "token" +
          "&state=" +
          nonce; // todo: need store nonce somewhere and then compare it with state from response
        window.authenticationScope = {
          complete: this.externalProviderCompleted.bind(this)
        };
        window.open(url, "_blank");
      }
    
      google() {
        const nonce = uuidv4();
        const url =
          "https://accounts.google.com/o/oauth2/v2/auth?" +
          "client_id=" +
          "75521893646-ejv81aiajee0gkt0ebs3pkohhubj47k1.apps.googleusercontent.com" +
          "&response_type=token" +
          "&scope=openid email" +
          "&redirect_uri=" +
          window.location.origin +
          "/users/authenticate/external?provider=google" +
          "&state=" +
          nonce; // todo: need store nonce somewhere and then compare it with state from response
        window.authenticationScope = {
          complete: this.externalProviderCompleted.bind(this)
        };
        window.open(url, "_blank");
      }


  externalProviderCompleted(fragment) {
    if (
      fragment === null ||
      typeof fragment !== "object" ||
      !fragment.hasOwnProperty("access_token")
    ) {
      // alert("external login failed!");
      return;
    }

    const { access_token, provider } = fragment;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: access_token,
        provider,
        scope:
          provider === "facebook" ? fragment.granted_scopes : fragment.scope
      })
    };

    this.setState({externalProviderCompleted: true,})

    fetch(`/users/authenticate/external/verify`, requestOptions)
      .then(this.handleResponse)
      .then(user => {
        localStorage.setItem("user", JSON.stringify(user));
        return user;
      })
      .then(
        user => {
          this.onLoginSuccess(user);
        },
        error => {}
      );
  }

  onLoginSuccess = (user) => {
    document.getElementById("downloadPopup").style.display = "none";
    this.props.onLoginSuccess(user);
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


  render() {  
        return (  
            <PopupWrapper style={{display: 'none', zIndex: 12312312312,}} id="downloadPopup" className='popup unblurred'>
                <PopupWrapperBody />
                <div className='popup_inner unblurred' 
                  style={{
                     display: 'flex', 
                     borderRadius: '7px',
                     background: 'white',
                  }} >
                    {!this.state.externalProviderCompleted ?   
                    <div id="loginContainer" 
            style={{
                width: '350px',
                margin: 'auto'
            }}
            >
                <h1 style={{textAlign: 'center', fontFamily: 'AvenirNextRoundedPro-Medium', marginTop: 0, marginBottom: '40px',}}>Đăng nhập</h1>
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
                        width="24" height="24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z" fill="#4285F4"></path><path d="M12 21a8.6 8.6 0 0 0 5.96-2.18l-2.91-2.26a5.4 5.4 0 0 1-8.09-2.85h-3v2.33A9 9 0 0 0 12 21z" fill="#34A853"></path><path d="M6.96 13.71a5.41 5.41 0 0 1 0-3.42V7.96h-3a9 9 0 0 0 0 8.08l3-2.33z" fill="#FBBC05"></path><path d="M12 6.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59A9 9 0 0 0 3.96 7.95l3 2.34A5.36 5.36 0 0 1 12 6.58z" fill="#EA4335"></path></g></svg>
                    <span>Đăng nhập với Google</span>
                </button>
                <div style={{position: 'relative', display: 'none',}} className="jsx-3592679178 separator"><hr className="jsx-3592679178"/>
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
            </div> : <div><Loader show={true} className="" black={true} /></div>}
                </div>  
            </PopupWrapper>
        );  
    }  
}  

const PopupWrapper = styled.div`
    position: fixed;  
    top: 0;  
    left: 0;  
    right: 0;  
    bottom: 0;  
    margin: auto;  
    background-color: rgba(15, 15, 15, 0.6);

    .popup_inner {  
        position: fixed;  
        top: 0;  
        left: 0;  
        right: 0;  
        bottom: 0;  
        margin: auto;  
        background-color: black;
        width: 400px;
        height: 300px;
    }

`;

const PopupWrapperBody = createGlobalStyle`
`;



export default LoginPopup;