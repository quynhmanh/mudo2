import React, { PureComponent } from "react";
import styled, { createGlobalStyle } from "styled-components";
import uuidv4 from "uuid/v4";
import Loader from "./Loader";

export interface IProps {
  onLoginSuccess: any;
  externalProviderCompleted: boolean;
  handleUpdateCompleted: any;
  translate: any;
  locale: any;
}

interface IState {}

class LoginPopup extends PureComponent<IProps, IState> {
  state = {};
  facebook() {
    this.loading();
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

  loading = () => {
    this.loginContainer.style.opacity = 0;
    this.loadder.style.opacity = 1;
  }

  google() {
    this.loading();
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

  onLoginSuccess = user => {
    document.getElementById("downloadPopup").style.display = "none";
    this.props.onLoginSuccess(user);
  };

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

  loadder = null;
  loginContainer = null;

  render() {
    return (
      <PopupWrapper
        style={{ display: "none", zIndex: 12312312312 }}
        id="downloadPopup"
        className="popup unblurred"
      >
        <PopupWrapperBody />
        <div
          className="popup_inner unblurred"
          style={{
            display: "flex",
            borderRadius: "3px",
            background: "white"
          }}
        >
          <div
            style={{
              width: "400px",
              backgroundColor: "#638efc",
              padding: "40px"
            }}
          >
            <div className="leftSide___2aU6- loginWrapper___204mQ">
              <div>
                <svg
                  style={{
                    transform: "scale(0.7)",
                    transformOrigin: "0 0"
                  }}
                  width="160"
                  height="60"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <metadata id="metadata190397">image/svg+xml</metadata>

                  <g>
                    <title>background</title>
                    <rect
                      fill="none"
                      id="canvas_background"
                      height="62"
                      width="162"
                      y="-1"
                      x="-1"
                    />
                  </g>
                  <g>
                    <title>Layer 1</title>
                    <g stroke="null" id="logo-group">
                      <g
                        stroke="null"
                        fontStyle="normal"
                        fontWeight="700"
                        fontSize="72px"
                        fontFamily="'Brandmark1 Bold'"
                        textAnchor="middle"
                        id="title"
                      >
                        <path
                          stroke="null"
                          fill="white"
                          transform="translate(0,365.45123291015625) "
                          d="m4.52583,-318.85031c1.04036,2.24451 2.4275,4.29098 4.23078,6.00737c1.87264,1.71639 3.95335,3.10271 6.31149,4.02692c2.4275,0.99023 5.06306,1.45233 7.69863,1.45233c2.63557,0 5.27114,-0.46211 7.69863,-1.45233c2.35814,-0.92421 4.43885,-2.31053 6.31149,-4.02692c1.80328,-1.71639 3.19042,-3.76286 4.23078,-6.00737c1.04036,-2.31053 1.52586,-4.75308 1.52586,-7.32767l0,-32.0173l-10.40356,-3.30075l0,18.74828c-0.55486,-0.26406 -1.10971,-0.52812 -1.66457,-0.72617c-2.4275,-0.99023 -4.99371,-1.45233 -7.69863,-1.45233c-2.63557,0 -5.27114,0.46211 -7.69863,1.45233c-2.35814,0.92421 -4.43885,2.31053 -6.31149,4.02692c-1.80328,1.71639 -3.19042,3.76286 -4.23078,6.00737c-0.971,2.31053 -1.52586,4.75308 -1.52586,7.26166c0,2.57459 0.55486,5.01714 1.52586,7.32767zm18.2409,-16.2397c5.13242,0 9.3632,4.02692 9.3632,8.91203c0,4.95113 -4.23078,8.91203 -9.3632,8.91203c-5.13242,0 -9.3632,-3.9609 -9.3632,-8.91203c0,-4.88511 4.23078,-8.91203 9.3632,-8.91203z"
                          id="path190399"
                        />
                        <path
                          stroke="null"
                          fill="white"
                          transform="translate(0,365.45123291015625) "
                          d="m58.15835,-307.8258l0,0l0,-16.2397c0,-6.33745 5.40985,-11.55263 12.13748,-11.55263l0,-9.90226c-3.05171,0 -6.03406,0.59414 -8.80834,1.71639c-2.63557,1.05624 -5.06306,2.6406 -7.14378,4.62105c-2.08071,1.91444 -3.67592,4.22496 -4.85499,6.79955c-1.17907,2.6406 -1.73393,5.41323 -1.73393,8.3179l0,16.2397l10.40356,0z"
                          id="path190401"
                        />
                        <path
                          stroke="null"
                          fill="white"
                          transform="translate(0,365.45123291015625) "
                          d="m97.54557,-344.99227l0.06936,2.11248c-2.77428,-1.3203 -5.82599,-2.04647 -8.94706,-2.04647c-2.63557,0 -5.27114,0.46211 -7.69863,1.45233c-2.35814,0.99023 -4.43885,2.31053 -6.31149,4.02692c-1.80328,1.71639 -3.19042,3.76286 -4.23078,6.00737c-0.971,2.31053 -1.52586,4.8191 -1.52586,7.32767c0,2.50857 0.55486,5.01714 1.52586,7.32767c1.04036,2.24451 2.4275,4.22496 4.23078,6.00737c1.87264,1.71639 3.95335,3.03669 6.31149,4.02692c2.4275,0.92421 5.06306,1.45233 7.69863,1.45233c3.12107,0 6.17278,-0.72617 8.94706,-2.04647l-0.06936,1.51835l10.40356,0l0,-37.16648l-10.40356,0zm-4.16142,26.53805c-1.38714,0.79218 -3.05171,1.25429 -4.71628,1.25429c-5.13242,0 -9.3632,-4.02692 -9.3632,-8.91203c0,-4.88511 4.23078,-8.91203 9.3632,-8.91203c1.80328,0 3.60657,0.46211 5.06306,1.45233c1.52586,0.8582 2.70492,2.1785 3.3985,3.69684c0.62421,1.18827 0.90164,2.44256 0.90164,3.76286c0,1.58436 -0.41614,3.10271 -1.24843,4.48902c-0.83228,1.3203 -1.942,2.44256 -3.3985,3.16872z"
                          id="path190403"
                        />
                        <path
                          stroke="null"
                          fill="white"
                          transform="translate(0,365.45123291015625) "
                          d="m124.14507,-344.46415l0,-0.06602c0,-5.74331 4.92435,-10.49639 11.02777,-10.49639l0,-9.90226c-2.913,0 -5.75663,0.59414 -8.3922,1.65038c-2.56621,0.99023 -4.85499,2.44256 -6.79699,4.35699c-1.942,1.84842 -3.53721,4.02692 -4.57757,6.46948c-1.10971,2.50857 -1.66457,5.21519 -1.66457,7.92181l0,36.70437l10.40356,0l0,-27.39625l11.02777,0l0,-9.24211l-11.02777,0z"
                          id="path190405"
                        />
                        <path
                          stroke="null"
                          fill="white"
                          transform="translate(0,365.45123291015625) "
                          d="m157.99997,-335.35407l0,-9.24211l-11.02777,0l0,-11.81669l-10.40356,3.30075l0,25.61384c0,2.77263 0.55486,5.41323 1.66457,7.92181c1.04036,2.44256 2.63557,4.62105 4.57757,6.46948c1.942,1.91444 4.23078,3.36677 6.79699,4.42301c2.63557,1.05624 5.47921,1.58436 8.3922,1.58436l0,-9.90226c-6.10342,0 -11.02777,-4.68707 -11.02777,-10.49639l0,-7.85579l11.02777,0z"
                          id="path190407"
                        />
                      </g>
                      <g
                        stroke="null"
                        fontStyle="normal"
                        fontWeight="400"
                        fontSize="32px"
                        fontFamily="Montserrat"
                        textAnchor="middle"
                        id="tagline"
                      />
                    </g>
                  </g>
                </svg>
                <p
                  style={{ color: "white" }}
                  className="subTitle___1IrLT medium___1Yh-x"
                >
                  {/* Thiết kế một cách dễ dàng nhất */}
                  {this.props.translate("designWithEase")}
                </p>
                <div className="imageWrapper___17xac">
                  <img
                    alt="loginIcon.svg"
                    src="https://static.crello.com/images/loginIcon.svg"
                    className=""
                  />
                </div>
              </div>
              <div className="logIn___R_tvz">
                <p style={{ color: "white" }} className="logInText___xkR-S">
                {this.props.translate("doNotHaveAccount")}
                </p>
                <button
                  style={{
                    border: "none",
                    background: "none",
                    padding: 0,
                    color: "white",
                    textDecoration: "underline"
                  }}
                  className="logInBtn___HgB1o"
                  data-test="changeModal"
                  data-categ="registrationModal"
                  data-value="goToLoginModal"
                >
                  {/* Miễn phí tạo ngay */}
                  {this.props.translate("createAFreeAccount")}
                </button>
              </div>
            </div>
          </div>
          <div style={{ position: "relative", width: "400px" }}>
            {/* {!this.props.externalProviderCompleted ? ( */}
              <div 
              ref={i => this.loadder = i}
              style={{
                opacity: 0,
                height: '100%',
                position: 'absolute',
                width: '100%',
              }}>
                <Loader show={true} className="" black={true} />
              </div>
              <div
                ref={i => this.loginContainer = i}
                id="loginContainer"
                style={{
                  width: "100%",
                  padding: "40px 80px",
                  opacity: 1,
                  position: 'absolute',
                }}
              >
                <button
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "10px",
                    border: "none"
                  }}
                  onClick={e => {
                    document.getElementById("downloadPopup").style.display =
                      "none";
                  }}
                  className="closeButton___3_ryt closeButtonNew___3gFHf"
                  data-test="onCloseModal"
                  data-categ="registrationModal"
                  data-value="close"
                >
                  <svg
                    viewBox="0 0 12 12"
                    width="12"
                    height="12"
                    className="closeBtnSvg___3O3ue"
                  >
                    <path d="M11.5671 12C11.4501 11.9997 11.338 11.953 11.2554 11.8701L0.1299 0.737165C0.0883095 0.698515 0.0552686 0.651589 0.0329019 0.599406C0.0105353 0.547223 -0.000661901 0.490937 3.02373e-05 0.434168C-0.000661901 0.377398 0.0105353 0.321112 0.0329019 0.268929C0.0552686 0.216746 0.0883095 0.169821 0.1299 0.131171C0.168766 0.0897632 0.215707 0.0567605 0.267826 0.0342C0.319945 0.0116395 0.376136 0 0.43293 0C0.489723 0 0.545914 0.0116395 0.598033 0.0342C0.650152 0.0567605 0.697093 0.0897632 0.735959 0.131171L11.8701 11.2555C11.953 11.3381 11.9997 11.4502 12 11.5671C11.9978 11.6813 11.9515 11.7901 11.8708 11.8708C11.79 11.9515 11.6812 11.9978 11.5671 12Z"></path>
                    <path d="M0.432899 12C0.376124 12.0007 0.319832 11.9895 0.267643 11.9671C0.215454 11.9447 0.168524 11.9117 0.12987 11.8701C0.089096 11.8308 0.0565992 11.7837 0.0342948 11.7317C0.0119904 11.6796 0.000329744 11.6236 0 11.567C0.000286616 11.45 0.0469958 11.3379 0.12987 11.2553L11.2554 0.12807C11.2956 0.0874892 11.3435 0.0552791 11.3963 0.033298C11.449 0.0113169 11.5056 0 11.5627 0C11.6199 0 11.6765 0.0113169 11.7292 0.033298C11.782 0.0552791 11.8299 0.0874892 11.8701 0.12807C11.9117 0.16673 11.9447 0.213668 11.9671 0.265865C11.9895 0.318061 12.0007 0.374362 12 0.431146C12.0007 0.48793 11.9895 0.54423 11.9671 0.596427C11.9447 0.648624 11.9117 0.695561 11.8701 0.734221L0.735929 11.8701C0.697275 11.9117 0.650344 11.9447 0.598155 11.9671C0.545967 11.9895 0.489675 12.0007 0.432899 12Z"></path>
                  </svg>
                </button>
                <h1
                  style={{
                    textAlign: "center",
                    fontFamily: "AvenirNextRoundedPro-Medium",
                    marginTop: 0,
                    marginBottom: "26px",
                    fontSize: "26px"
                  }}
                >
                  {/* Đăng nhập */}
                  {this.props.translate("login")}
                </h1>
                <button
                  style={{
                    width: "100%",
                    marginBottom: "10px",
                    background: "white",
                    color: "black",
                    border: "2px solid rgba(14,19,24,.15)",
                    borderRadius: "4px"
                  }}
                  onClick={() => {
                    this.loginContainer.style.opacity = 0;
                    this.loadder.style.opacity = 1;
                    this.facebook.bind(this)();}
                  }
                  className="btn btn-primary"
                >
                  <svg
                    style={{
                      marginBottom: "-6px",
                      marginRight: "10px",
                      color: "#3b5998"
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.61v-6.97h-2.34V11.3h2.34v-2c0-2.33 1.42-3.6 3.5-3.6 1 0 1.84.08 2.1.12v2.43h-1.44c-1.13 0-1.35.53-1.35 1.32v1.73h2.69l-.35 2.72h-2.34V21h4.59a1 1 0 0 0 .99-1V4a1 1 0 0 0-1-1z"
                    ></path>
                  </svg>
                  <span>
                    {/* Đăng nhập với Facebook */}
                    {this.props.translate("loginWithFacebook")}
                    </span>
                </button>
                <button
                  style={{
                    width: "100%",
                    backgroundColor: "rgb(211, 72, 54)",
                    background: "white",
                    color: "black",
                    border: "2px solid rgba(14,19,24,.15)",
                    borderRadius: "4px"
                  }}
                  onClick={() => {
                    this.loginContainer.style.opacity = 0;
                    this.loadder.style.opacity = 1;
                    this.google.bind(this)();}
                  }
                  className="btn btn-primary"
                >
                  <svg
                    style={{
                      marginBottom: "-6px",
                      marginRight: "10px"
                    }}
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g fill="none" fillRule="evenodd">
                      <path
                        d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z"
                        fill="#4285F4"
                      ></path>
                      <path
                        d="M12 21a8.6 8.6 0 0 0 5.96-2.18l-2.91-2.26a5.4 5.4 0 0 1-8.09-2.85h-3v2.33A9 9 0 0 0 12 21z"
                        fill="#34A853"
                      ></path>
                      <path
                        d="M6.96 13.71a5.41 5.41 0 0 1 0-3.42V7.96h-3a9 9 0 0 0 0 8.08l3-2.33z"
                        fill="#FBBC05"
                      ></path>
                      <path
                        d="M12 6.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59A9 9 0 0 0 3.96 7.95l3 2.34A5.36 5.36 0 0 1 12 6.58z"
                        fill="#EA4335"
                      ></path>
                    </g>
                  </svg>
                  <span>
                    {/* Đăng nhập với Google */}
                    {this.props.translate("loginWithGoogle")}
                    </span>
                </button>
                <div
                  style={{ position: "relative", display: "none" }}
                  className="jsx-3592679178 separator"
                >
                  <hr className="jsx-3592679178" />
                  <span
                    className="jsx-3592679178 text"
                    style={{
                      display: "none",
                      position: "absolute",
                      width: "50px",
                      left: "calc(50% - 25px)",
                      top: "-10px",
                      textAlign: "center",
                      backgroundColor: "rgb(255, 255, 255)",
                      lineHeight: "2rem"
                    }}
                  >
                    hoặc
                  </span>
                </div>
              </div>
          </div>
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
    width: 800px;
    height: 500px;
  }
`;

const PopupWrapperBody = createGlobalStyle`
`;

export default LoginPopup;
