import * as React from "react";
import "@Styles/authorizedLayout.scss";
import { Route, Link } from "react-router-dom";
import Globals from "@Globals";
import { withTranslation } from "react-i18next";
import AccountService from "@Services/AccountService";
import bind from 'bind-decorator';
import {isNode} from "@Utils";
import loadable from '@loadable/component';
import { isClickOutside } from '@Functions/shared/common';
import languages from "@Locales/languages";
const LoginPopup = loadable(() => import("@Components/shared/LoginPopup"));
import uuidv4 from "uuid/v4";
import Footer from "@Components/shared/Footer";
import homePageTranslation from "@Locales/default/homePage";

interface IProps {
    children?: React.ReactNode;
}

type Props = IProps;

const Breadcrumbs = () => (
    <Route
        path="*"
        render={props => {
            let parts = props.location.pathname.split("/");
            // parts = ['home', ...parts.splice(1, parts.length-1)];
            const place = parts[parts.length - 1];
            parts = parts.slice(1, parts.length - 1);
            if (!place) {
                return null;
            }

            // parts = ["home", ...parts];
            return (
                <div style={{ padding: "20px 10px 0px 0px" }}>
                    {crumb("Home", 0, ["Home", ...parts])}
                    {parts.map(crumb)}
                    <span style={{ marginLeft: "8px", fontSize: "11px" }}>
                        {mapping[place]}
                    </span>
                </div>
            );
        }}
    />
);

const mapping = {
    Home: "Trang chủ",
    templates: "Mẫu thiết kế",
    brochures: "Tờ gấp",
    "business-cards": "Danh thiếp",
    flyers: "Tờ rơi",
    postcards: "Bưu thiếp",
    poster: "Áp phích",
    logo: "Logo",
    resume: "Sơ yếu lý lịch",
    agriculture: "Nông nghiệp",
    "automotive-transportation": "Ôtô & Vận tải",
    beauty: "Sắc đẹp",
    "business-services": "Dịch vụ kinh doanh",
    "child-care": "Chăm sóc trẻ em",
    cleaning: "Vệ sinh",
    construction: "Xây dựng",
    creative: "Sáng tạo",
    "education-training": "Giáo dục & đào tạo",
    "energy-environment": "Năng lượng môi trường",
    event: "Sự kiện",
    "financial-services": "Dịch vụ tài chính",
    "food-beverage": "Thực phẩm",
    holiday: "Ngày lễ",
    "house-home": "Nhà cửa",
    insurance: "Bảo hiểm",
    law: "Luật",
    "law-garden": "Làm vườn",
    "medical-healthcare": "Thuốc & chăm sóc sức khoẻ",
    "music-arts": "Âm nhạc & Nghệ thuật",
    "non-profit": "Không lợi nhuận",
    "pets-animals": "Thú nuôi",
    photography: "Nhiếp ảnh",
    "real-estate": "Bất động sản",
    "religion-organization": "Tổ chức & tôn giáo",
    retail: "Bán lẻ",
    "sports-wellness": "Thẻ thảo & Sức khoẻ",
    technology: "Công nghệ",
    "travel-tourism": "Du lịch",
    cart: "Giỏ hàng"
};

const crumb = (part, partIndex, parts) => {
    const path = ["", ...parts.slice(0, partIndex + 1)].join("/");
    return (
        <Link
            style={{
                color: "black",
                textDecoration: "none",
                position: "relative",
                padding: "3px 10px",
                backgroundColor: "#e9ecef",
                borderTopRightRadius: "0.5rem",
                borderBottomRightRadius: "0.5rem",
                marginLeft: "-2px",
                fontSize: "11px",
                zIndex: parts.length - partIndex
            }}
            key={path}
            to={path}
        >
            {mapping[part]}
            <span className="breadcrumbs__separator"></span>
        </Link>
    );
};

const initLocale = { "value": "en-US", "title": "English" };

class AuthorizedLayout extends React.Component<Props, {}> {

    constructor(props) {
        super(props);

        this.state = {

        }

        const locale = this.getLocale(this.props.i18n.language);
        if (Globals.locale === undefined) {
            Globals.locale = locale === undefined ? initLocale : locale;
            this.state.locale = locale === undefined ? initLocale : locale;
        }

        this.translate = this.translate.bind(this);
    }

    getLocale = (value: string) => {
        return languages.find((language) => language.value === value || language.value.startsWith(value));
    }

    @bind
    async onClickSignOut(e: any) {
        e.preventDefault();

        await AccountService.logout();
        this.forceUpdate();
        this.setState({ externalProviderCompleted: false, key: this.state.key + 1 })
    }

    handleLoginSuccess = (user) => {
        this.setState({ externalProviderCompleted: true });
        window['publicSession'] = { serviceUser: user, locale: this.state.locale };
        Globals.reset();
        Globals.init({ public: window['publicSession'] });

        this.forceUpdate();
    }

    handleSelectLanguage = (locale: ILocale) => {
        this.setLocale(locale);
        this.onLanguageBtnClick();
        this.props.i18n.changeLanguage(locale.value);
    }

    setLocale = (locale: ILocale) => {
        this.setState({ locale });
        Globals.locale = locale;
    }

    handleLogin = () => {
        const logInPopup = document.getElementById("logInPopup");
        const logInPopupLeft = document.getElementById("logInPopupLeft");
        const logInPopupRight = document.getElementById("logInPopupRight");
        logInPopup.style.display = "block";
        const onDown = e => {
            if (isClickOutside(e, logInPopupLeft) && isClickOutside(e, logInPopupRight)) {
                logInPopup.style.display = "none";
                document.removeEventListener("mouseup", onDown);
            }
        };

        document.addEventListener("mouseup", onDown);
        // document.getElementById("editor").classList.add("popup");
    }

    onLanguageBtnClick = () => {
        const showLanguageDropdown = !this.state.showLanguageDropdown;
        this.setState({ showLanguageDropdown });

        if (showLanguageDropdown) {
            const onDown = e => {
                const languageDropdown = document.getElementById("language-dropdown");
                const languageBtn = document.getElementById("language-btn");
                if (isClickOutside(e, languageDropdown) && isClickOutside(e, languageBtn)) {
                    this.setState({ showLanguageDropdown: false });
                    document.removeEventListener("mouseup", onDown);
                }
            };

            document.addEventListener("mouseup", onDown);
        }
    }

    translate = (key: string) => {

        if (isNode()) return;
        
        const { t, i18n } = this.props;

        if (i18n.exists(NAMESPACE + ":" + key))
            return t(key);

        if (homePageTranslation !== undefined && homePageTranslation.hasOwnProperty(key)) {
            return homePageTranslation[key]; // load default translation in case failed to load translation file from server
        }

        return key;
    }

    handleProfilePopup = () => {
        document.getElementById("myProfilePopup").classList.toggle("show");

        const onDown = e => {
            if (!e.target.matches(".dropbtn-font-size")) {
                var dropdowns = document.getElementsByClassName(
                    "dropdown-content-font-size"
                );
                var i;
                for (i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains("show")) {
                        openDropdown.classList.remove("show");
                    }
                }

                document.removeEventListener("mouseup", onDown);
            }
        };

        document.addEventListener("mouseup", onDown);
    }

    public render() {
        const childrenWithProps = React.Children.map(this.props.children, child => {
            // checking isValidElement is the safe way and avoids a typescript error too
            if (React.isValidElement(child)) {
                return React.cloneElement(child);
            }
            return child;
        });


        const loggedIn = Globals.serviceUser && Globals.serviceUser.username !== undefined;
        return (
            <div id="authorizedLayout" className="layout">
                {/* <TopMenu /> */}
                {!isNode() && <div
                    style={{
                        boxShadow: '0 1px 8px rgba(38,49,71,.08)',
                    }}>
                    <div
                        style={{
                            width: "calc(100% - 50px)",
                            margin: "auto",
                        }}
                    >
                        <div style={{
                            height: '50px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            position: 'relative',
                        }}>
                            <div style={{
                                height: '39px',
                                textAlign: 'center',
                                lineHeight: '39px',
                                fontSize: '16px',
                                width: '200px',
                            }}>
                                {/* <a>Menu</a> */}
                            </div>
                            <a style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                width: '200px',
                                height: '100%',
                            }} id="logo" href="/">
                                <svg style={{
                                    transform: 'scale(0.4)',
                                    transformOrigin: '0 0',
                                    position: 'absolute',
                                    left: 0,
                                    top: "13px",
                                    margin: 'auto',
                                    fill: 'rgb(28 119 212)'
                                }} width="160" height="60" xmlns="http://www.w3.org/2000/svg">
                                    <metadata id="metadata190397">image/svg+xml</metadata>

                                    <g>
                                        <title>background</title>
                                        <rect fill="none" id="canvas_background" height="62" width="162" y="-1" x="-1" />
                                    </g>
                                    <g>
                                        <title>Layer 1</title>
                                        <g stroke="null" id="logo-group">
                                            <g stroke="null" fontWeight="700" fontSize="72px" fontFamily="'Brandmark1 Bold'" textAnchor="middle" id="title">
                                                <path stroke="null" transform="translate(0,365.45123291015625) " d="m4.52583,-318.85031c1.04036,2.24451 2.4275,4.29098 4.23078,6.00737c1.87264,1.71639 3.95335,3.10271 6.31149,4.02692c2.4275,0.99023 5.06306,1.45233 7.69863,1.45233c2.63557,0 5.27114,-0.46211 7.69863,-1.45233c2.35814,-0.92421 4.43885,-2.31053 6.31149,-4.02692c1.80328,-1.71639 3.19042,-3.76286 4.23078,-6.00737c1.04036,-2.31053 1.52586,-4.75308 1.52586,-7.32767l0,-32.0173l-10.40356,-3.30075l0,18.74828c-0.55486,-0.26406 -1.10971,-0.52812 -1.66457,-0.72617c-2.4275,-0.99023 -4.99371,-1.45233 -7.69863,-1.45233c-2.63557,0 -5.27114,0.46211 -7.69863,1.45233c-2.35814,0.92421 -4.43885,2.31053 -6.31149,4.02692c-1.80328,1.71639 -3.19042,3.76286 -4.23078,6.00737c-0.971,2.31053 -1.52586,4.75308 -1.52586,7.26166c0,2.57459 0.55486,5.01714 1.52586,7.32767zm18.2409,-16.2397c5.13242,0 9.3632,4.02692 9.3632,8.91203c0,4.95113 -4.23078,8.91203 -9.3632,8.91203c-5.13242,0 -9.3632,-3.9609 -9.3632,-8.91203c0,-4.88511 4.23078,-8.91203 9.3632,-8.91203z" id="path190399" />
                                                <path stroke="null" transform="translate(0,365.45123291015625) " d="m58.15835,-307.8258l0,0l0,-16.2397c0,-6.33745 5.40985,-11.55263 12.13748,-11.55263l0,-9.90226c-3.05171,0 -6.03406,0.59414 -8.80834,1.71639c-2.63557,1.05624 -5.06306,2.6406 -7.14378,4.62105c-2.08071,1.91444 -3.67592,4.22496 -4.85499,6.79955c-1.17907,2.6406 -1.73393,5.41323 -1.73393,8.3179l0,16.2397l10.40356,0z" id="path190401" />
                                                <path stroke="null" transform="translate(0,365.45123291015625) " d="m97.54557,-344.99227l0.06936,2.11248c-2.77428,-1.3203 -5.82599,-2.04647 -8.94706,-2.04647c-2.63557,0 -5.27114,0.46211 -7.69863,1.45233c-2.35814,0.99023 -4.43885,2.31053 -6.31149,4.02692c-1.80328,1.71639 -3.19042,3.76286 -4.23078,6.00737c-0.971,2.31053 -1.52586,4.8191 -1.52586,7.32767c0,2.50857 0.55486,5.01714 1.52586,7.32767c1.04036,2.24451 2.4275,4.22496 4.23078,6.00737c1.87264,1.71639 3.95335,3.03669 6.31149,4.02692c2.4275,0.92421 5.06306,1.45233 7.69863,1.45233c3.12107,0 6.17278,-0.72617 8.94706,-2.04647l-0.06936,1.51835l10.40356,0l0,-37.16648l-10.40356,0zm-4.16142,26.53805c-1.38714,0.79218 -3.05171,1.25429 -4.71628,1.25429c-5.13242,0 -9.3632,-4.02692 -9.3632,-8.91203c0,-4.88511 4.23078,-8.91203 9.3632,-8.91203c1.80328,0 3.60657,0.46211 5.06306,1.45233c1.52586,0.8582 2.70492,2.1785 3.3985,3.69684c0.62421,1.18827 0.90164,2.44256 0.90164,3.76286c0,1.58436 -0.41614,3.10271 -1.24843,4.48902c-0.83228,1.3203 -1.942,2.44256 -3.3985,3.16872z" id="path190403" />
                                                <path stroke="null" transform="translate(0,365.45123291015625) " d="m124.14507,-344.46415l0,-0.06602c0,-5.74331 4.92435,-10.49639 11.02777,-10.49639l0,-9.90226c-2.913,0 -5.75663,0.59414 -8.3922,1.65038c-2.56621,0.99023 -4.85499,2.44256 -6.79699,4.35699c-1.942,1.84842 -3.53721,4.02692 -4.57757,6.46948c-1.10971,2.50857 -1.66457,5.21519 -1.66457,7.92181l0,36.70437l10.40356,0l0,-27.39625l11.02777,0l0,-9.24211l-11.02777,0z" id="path190405" />
                                                <path stroke="null" transform="translate(0,365.45123291015625) " d="m157.99997,-335.35407l0,-9.24211l-11.02777,0l0,-11.81669l-10.40356,3.30075l0,25.61384c0,2.77263 0.55486,5.41323 1.66457,7.92181c1.04036,2.44256 2.63557,4.62105 4.57757,6.46948c1.942,1.91444 4.23078,3.36677 6.79699,4.42301c2.63557,1.05624 5.47921,1.58436 8.3922,1.58436l0,-9.90226c-6.10342,0 -11.02777,-4.68707 -11.02777,-10.49639l0,-7.85579l11.02777,0z" id="path190407" />
                                            </g>
                                            <g stroke="null" fontWeight="400" fontSize="32px" fontFamily="Montserrat" textAnchor="middle" id="tagline" />
                                        </g>
                                    </g>
                                </svg>
                            </a>
                            <div style={{
                                height: '100%',
                                textAlign: 'center',
                                lineHeight: '39px',
                                fontSize: '16px',
                                padding: '10px',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {!loggedIn ? <div style={{ display: 'flex' }}>
                                    <div
                                        style={{
                                            borderRight: '1px solid rgb(221, 221, 221)',
                                            height: '19px',
                                            marginLeft: '10px',
                                            marginRight: '10px',
                                            marginTop: '6px',
                                        }} />
                                    <button
                                        id="login-btn"
                                        style={{
                                            height: '30px',
                                            lineHeight: '30px',
                                            border: 'none',
                                            fontSize: '14px',
                                            borderRadius: '4px',
                                            color: '#555',
                                            display: 'block',
                                            padding: '0 10px',
                                        }}
                                        onClick={this.handleLogin}
                                    >{this.translate("login")}</button></div>
                                    :
                                    <div style={{ display: 'flex', position: 'relative', }}>
                                        <div
                                            style={{
                                                borderRight: '1px solid rgb(221, 221, 221)',
                                                height: '19px',
                                                marginLeft: '10px',
                                                marginRight: '10px',
                                                marginTop: '6px',
                                            }} />
                                        <button
                                            style={{
                                                height: '30px',
                                                lineHeight: '25px',
                                                border: 'none',
                                                fontSize: '13px',
                                                borderRadius: '4px',
                                                color: '#555',
                                                display: 'flex',
                                            }}
                                            className="button-list"
                                            onClick={this.handleProfilePopup}
                                        >
                                            <span style={{ marginRight: '10px', marginTop: '3px', fontSize: '13px', }}>{Globals.serviceUser.username}</span>
                                            <img style={{
                                                width: '29px',
                                                height: '29px',
                                                borderRadius: '50%',
                                            }} src="https://www.google.com/s2/photos/private/AIbEiAIAAABDCOiLwpvLu8CPRCILdmNhcmRfcGhvdG8qKGUxNjQ2YjUwNTQwNTVmNGVlZjdkMTQxNDcxYzhjNzg1YmU4OWRjODQwAQZAjaC_9irsFzfZrYEDu9rc_9V6/s100" />
                                        </button>
                                        <div id="myProfilePopup"
                                            className="dropdown-content-font-size"
                                            style={{
                                                display: 'none',
                                                position: 'absolute',
                                                textAlign: 'center',
                                                backgroundColor: 'rgb(255, 255, 255)',
                                                lineHeight: '2rem',
                                                boxShadow: 'rgba(14, 19, 24, 0.02) 0px 0px 0px 1px, rgba(14, 19, 24, 0.15) 0px 2px 8px',
                                                background: 'white',
                                                padding: '10px 0',
                                                zIndex: 999999,
                                                left: '15px',
                                                top: 'calc(100% + 20px)',
                                                width: '100%',
                                            }}>
                                            <button
                                                id="login-btn"
                                                style={{
                                                    height: '30px',
                                                    lineHeight: '30px',
                                                    border: 'none',
                                                    fontSize: '14px',
                                                    color: 'black',
                                                    display: 'block',
                                                    padding: '0 12px',
                                                    width: '100%',
                                                    textAlign: 'left',
                                                }}
                                                onClick={this.onClickSignOut}
                                            >{this.translate("logout")}</button>
                                        </div>
                                    </div>}
                                <div
                                    style={{
                                        borderRight: '1px solid rgb(221, 221, 221)',
                                        height: '19px',
                                        marginLeft: '10px',
                                        marginRight: '10px',
                                    }} />
                                <a id="language-btn" onClick={this.onLanguageBtnClick}>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M3.8 14.25h3.81a21.9 21.9 0 0 1 0-4.5h-3.8a8.5 8.5 0 0 0 0 4.5zm.57 1.5c1 2.04 2.8 3.61 4.98 4.33-.68-1.1-1.2-2.6-1.52-4.33H4.37zm15.83-1.5a8.5 8.5 0 0 0 0-4.5h-3.81a21.9 21.9 0 0 1 0 4.5h3.8zm-.57 1.5h-3.46a12.78 12.78 0 0 1-1.52 4.33 8.53 8.53 0 0 0 4.98-4.33zm-10.5-1.5h5.74a20.12 20.12 0 0 0 0-4.5H9.13a20.12 20.12 0 0 0 0 4.5zm.23 1.5c.56 2.84 1.69 4.75 2.64 4.75.95 0 2.08-1.9 2.64-4.75H9.36zm-4.99-7.5h3.46c.31-1.74.84-3.24 1.52-4.33a8.53 8.53 0 0 0-4.98 4.33zm15.26 0a8.53 8.53 0 0 0-4.98-4.33c.68 1.1 1.2 2.6 1.52 4.33h3.46zm1.64 0h.04v.1a10 10 0 1 1-.04-.1zm-11.91 0h5.28C14.08 5.41 12.95 3.5 12 3.5c-.95 0-2.08 1.9-2.64 4.75z"></path></svg>
                                    </span>
                                    <span className="language-btn-title">
                                        {this.state.locale.title}
                                    </span>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16"><path fill="currentColor" d="M11.71 6.47l-3.53 3.54c-.1.1-.26.1-.36 0L4.3 6.47a.75.75 0 1 0-1.06 1.06l3.53 3.54c.69.68 1.8.68 2.48 0l3.53-3.54a.75.75 0 0 0-1.06-1.06z"></path></svg>
                                    </span>
                                </a>
                                <div id="language-dropdown" style={{ display: this.state.showLanguageDropdown ? "block" : "none" }}>
                                    <div className="search-box-container">
                                        <input type="text" className="search-box" />
                                    </div>
                                    <div className="language-list-container">
                                        <ul className="language-list">
                                            <li className="language-list-item disabled">
                                                <div className="language-list-item-selected">
                                                    <div className="language-list-item-selected-left">
                                                        {this.state.locale.title}
                                                    </div>
                                                    <span className="language-list-item-selected-right">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M4.53 11.9L9 16.38 19.44 5.97a.75.75 0 0 1 1.06 1.06L9.53 17.97c-.3.29-.77.29-1.06 0l-5-5c-.7-.71.35-1.77 1.06-1.07z"></path></svg>
                                                    </span>
                                                </div>
                                            </li>
                                            <li className="language-list-item disabled">
                                                <div className="language-hr-container">
                                                    <hr className="language-hr" />
                                                </div>
                                            </li>
                                            {languages.filter((language) => language.value !== this.state.locale.value).map((language) => (
                                                <li className="language-list-item" key={uuidv4()} onClick={() => this.handleSelectLanguage(language)}>
                                                    <a className="language-list-item-non-selected">
                                                        <span className="language-list-item-non-selected-content">
                                                            {language.title}
                                                        </span>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}

                {!isNode() && 
                    <LoginPopup
                    translate={this.translate}
                    handleUpdateCompleted={this.handleUpdateCompleted} externalProviderCompleted={this.state.externalProviderCompleted} onLoginSuccess={this.handleLoginSuccess} />
                }

                {/* {!isNode() &&
                <div className="container container-content">
                    <Breadcrumbs />
                </div>} */}
                <div style={{}} id="main-component">



                    {childrenWithProps}
                </div>
                {/* <ToastContainer /> */}
                {!isNode() && 
                    <Footer 
                        translate={this.translate}
                    />
                }
            </div>
        );
    }
}
const NAMESPACE = "homePage";

export default withTranslation(NAMESPACE)(AuthorizedLayout);
