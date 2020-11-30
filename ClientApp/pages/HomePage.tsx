import * as React from "react";
import { Route, Link } from "react-router-dom";
import Globals from "@Globals";
import AccountService from "@Services/AccountService";
import { Helmet } from "react-helmet";
import bind from 'bind-decorator';
import styled from 'styled-components';
import { withTranslation } from "react-i18next";
import languages from "@Locales/languages";
import uuidv4 from "uuid/v4";
import { ILocale } from "@Models/ILocale";
import homePageTranslation from "@Locales/default/homePage";
import loadable from '@loadable/component';
import { isClickOutside } from '@Functions/shared/common';
import axios from "axios";
import "@Styles/homePage.scss";
import SuggestedList from "@Components/homepage/SuggestedList";
import PopularTemplate from "@Components/homepage/PopularTemplate";
import PopularTemplate2 from "@Components/homepage/PopularTemplate2";
import { isNode } from "@Utils";


const PopularTemplate3 = loadable(() => import("@Components/homepage/PopularTemplate3"));
const LoginPopup = loadable(() => import("@Components/shared/LoginPopup"));

export interface IProps {
    t: any;
    tReady: boolean;
    i18n: any;
}

interface IState {
    tab: string;
    focusing: boolean;
    mounted: boolean;
    navTop: number;
    externalProviderCompleted: boolean;
    showLanguageDropdown: boolean;
    locale: ILocale;
    recentDesign: any;
    key: number;
    hasDesign: boolean;
}


const Breadcrumbs = () => <Route path="*" render={props => {
    let parts = props.location.pathname.split("/");
    const place = parts[parts.length - 1];
    parts = parts.slice(1, parts.length - 1);
    return <p>{parts.map(crumb)}/{place}</p>
}} />

const crumb = (part, partIndex, parts) => {
    const path = ['', ...parts.slice(0, partIndex + 1)].join("/");
    return <Link key={path} to={path} >{part}</Link>
}

const initLocale = { "value": "en-US", "title": "English" };

const NAMESPACE = "homePage";

class HomePage extends React.Component<IProps, IState> {

    state = {
        key: 0,
        tab: "find",
        focusing: false,
        mounted: false,
        navTop: 0,
        externalProviderCompleted: false,
        showLanguageDropdown: false,
        locale: initLocale,
        recentDesign: [],
        hasDesign: true,
    };

    getLocale = (value: string) => {
        return languages.find((language) => language.value === value || language.value.startsWith(value));
    }

    setLocale = (locale: ILocale) => {
        this.setState({ locale });
        Globals.locale = locale;
    }

    translate = (key: string) => {
        const { t, i18n } = this.props;

        if (i18n.exists(NAMESPACE + ":" + key))
            return t(key);

        if (homePageTranslation !== undefined && homePageTranslation.hasOwnProperty(key)) {
            return homePageTranslation[key]; // load default translation in case failed to load translation file from server
        }

        return key;
    }

    constructor(props) {
        super(props);
        this.onLanguageBtnClick = this.onLanguageBtnClick.bind(this);
        this.handleSelectLanguage = this.handleSelectLanguage.bind(this);
        this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
        this.translate = this.translate.bind(this);
        const locale = this.getLocale(this.props.i18n.language);
        if (Globals.locale === undefined) {
            Globals.locale = locale === undefined ? initLocale : locale;
            this.state.locale = locale === undefined ? initLocale : locale;
        }

        if (!isNode())
            document.addEventListener("scroll", this.handleScroll);
    }

    componentWillMount() {
        if (Globals.serviceUser) {
            const url = `/api/Design/SearchWithUserName?userName=${Globals.serviceUser.username}&page=1&perPage=1`;
            axios
                .get(url)
                .then(res => {
                    // this.setState({hasDesign: res.data.value.value > 0});
                    this.setState({ hasDesign: res.data.value.value > 0 })
                });
        }
    }

    handleLoginSuccess = (user) => {
        this.setState({ externalProviderCompleted: true });
        window['publicSession'] = { serviceUser: user, locale: this.state.locale };
        Globals.reset();
        Globals.init({ public: window['publicSession'] });

        this.setState({ key: this.state.key + 1 });

        if (Globals.serviceUser) {
            const url = `/api/Design/SearchWithUserName?userName=${Globals.serviceUser.username}&page=1&perPage=1`;
            axios
                .get(url)
                .then(res => {
                    this.setState({ hasDesign: res.data.value.value > 0 });
                });
        }

        this.forceUpdate();
    }

    handleSelectLanguage = (locale: ILocale) => {
        this.setLocale(locale);
        this.onLanguageBtnClick();
        this.props.i18n.changeLanguage(locale.value);
    }

    componentDidMount() {
        // if (Globals.serviceUser) {
        //     const url = `/api/Design/SearchWithUserName?userName=${Globals.serviceUser.username}&page=1&perPage=1`;
        //     axios
        //         .get(url)
        //         .then(res => {
        //             this.setState({hasDesign: res.data.value.value > 0});
        //         });
        // }
        this.handleScroll();
    }

    @bind
    async onClickSignOut(e: any) {
        e.preventDefault();

        await AccountService.logout();
        this.forceUpdate();
        this.setState({ externalProviderCompleted: false, key: this.state.key + 1 })
    }

    onClickDropDownFontSizeList = () => {
        document.getElementById("myDownloadList").classList.toggle("show");

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
    };

    getDisplayAttribute(cond: boolean) {
        return cond === true ? "block" : "none";
    }

    onClickLogoLogin = () => {
        document.getElementById("myLogoLogin").classList.toggle("show");

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

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    handleScroll = () => {
        templates.forEach(i => {
            if (!this.templates[i].loaded) {
                if (this.isInViewport(this.templates[i].ref)) {
                    this.templates[i].loadMore();
                    this.templates[i].loaded = true;
                }
            }
        })
    }

    handleLogin = () => {
        const downloadPopup = document.getElementById("downloadPopup");
        const downloadPopupLeft = document.getElementById("downloadPopupLeft");
        const downloadPopupRight = document.getElementById("downloadPopupRight");
        downloadPopup.style.display = "block";
        const onDown = e => {
            if (isClickOutside(e, downloadPopupLeft) && isClickOutside(e, downloadPopupRight)) {
                downloadPopup.style.display = "none";
                document.removeEventListener("mouseup", onDown);
            }
        };

        document.addEventListener("mouseup", onDown);
        // document.getElementById("editor").classList.add("popup");
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

    handleUpdateCompleted = () => {
        this.setState({ externalProviderCompleted: true, })
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

    templates = {};

    render() {
        if (this.props.i18n.language === undefined)
            return null;

        const loggedIn = Globals.serviceUser && Globals.serviceUser.username !== undefined;


        const { t } = this.props;

        return (
            <div>
                <Helmet>
                    <title>{this.props.tReady ? this.translate("title-website") : "Draft"}</title>
                </Helmet>
                <div
                    style={{
                        width: "100%",
                        position: "relative",
                    }}
                >
                    <div className="">
                        <div
                            style={{
                                position: 'relative',
                                width: '100%',
                            }}
                        >
                            <div
                                style={{
                                    borderRadius: '10px',
                                    backgroundSize: 'cover',
                                }}>
                                <div
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        backgroundColor: 'rgb(201, 217, 225)',
                                    }}>
                                </div>
                                <header
                                    style={{
                                        height: "260px",
                                        position: 'relative',
                                        marginTop: 'auto',
                                        marginBottom: 'auto',
                                        padding: '20px 50px 0px',
                                        content: "",
                                        display: 'block',
                                        top: 0,
                                        left: "25px",
                                        right: "30px",
                                        width: "calc(100% - 60px)",
                                        borderRadius: "10px",
                                        bottom: 0,
                                        zIndex: 123,
                                        // opacity: .9,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'bottom',
                                        backgroundImage: 'url(/web_images/homeBackground.jpg)',
                                    }}
                                    className="offset-header__header u-last-child-margin-bottom-0 u-textAlign-left@medium">
                                    <div className="h__hero u-color-inherit@medium ">
                                        <h1
                                            style={{
                                                textAlign: "center",
                                                fontWeight: 700,
                                                fontSize: "45px",
                                                marginBottom: "20px",
                                                marginTop: "15px",
                                            }}
                                            >{this.translate("startDesign")}</h1>
                                    </div>

                                    <div className="searchWrapper___ktY0d">
                                        <div className="searchFormWrapper___2LC5i">
                                            <form className="form___1I3Xs" noValidate>
                                                <div className="sc-fzXfMy cllNNH">
                                                    <input
                                                        type="text"
                                                        autoComplete="off"
                                                        name="searchQuery"
                                                        className="sc-fzXfMz sc-fzXfMA ddkFCa proxima-regular___3FDdY"
                                                        placeholder={this.translate("searchFrom")}
                                                        onFocus={e => {
                                                            document.getElementById("homepage_list").style.display = "block";

                                                            const onUp = (e) => {
                                                                let sugEl = document.getElementById('suggested_list');
                                                                if (e.target.contains(sugEl)) {
                                                                    document.getElementById("homepage_list").style.display = "none";
                                                                }
                                                            }

                                                            document.addEventListener("mouseup", onUp);
                                                        }}
                                                    // onBlur={e => {
                                                    //     let el = document.getElementById("homepage_list").style.display = "none";
                                                    // }}
                                                    />
                                                </div>
                                                <div className="buttonsWrapper___2Ertf">
                                                    <button type="submit" className="sc-AykKD itGidr sc-AykKE ivaxgr searchBtn___3JEWS" data-categ="homeSearchForm" data-value="submit"><div className="sc-AykKF ceNsQj"><svg viewBox="0 0 24 24" width={24} height={24} className="sc-AykKK exPXfb"><path fillRule="evenodd" clipRule="evenodd" d="M17.4138 15.8368L21.8574 20.2857C22.0558 20.5064 22.046 20.8443 21.8352 21.0532L21.0575 21.8317C20.9532 21.937 20.8113 21.9962 20.6632 21.9962C20.5151 21.9962 20.3731 21.937 20.2688 21.8317L15.8252 17.3828C15.7023 17.2596 15.5907 17.1256 15.4919 16.9824L14.6587 15.8701C13.2802 16.9723 11.5682 17.5724 9.80409 17.5719C6.16878 17.5845 3.00983 15.0738 2.19744 11.5261C1.38504 7.97844 3.13601 4.34066 6.41372 2.76643C9.69143 1.1922 13.6211 2.10166 15.8763 4.95639C18.1314 7.81111 18.1102 11.8492 15.8252 14.68L16.9361 15.4475C17.1096 15.5586 17.2698 15.6892 17.4138 15.8368ZM4.24951 9.78627C4.24951 12.8576 6.73635 15.3475 9.80402 15.3475C11.2772 15.3475 12.69 14.7616 13.7317 13.7186C14.7733 12.6757 15.3585 11.2612 15.3585 9.78627C15.3585 6.7149 12.8717 4.22507 9.80402 4.22507C6.73635 4.22507 4.24951 6.7149 4.24951 9.78627Z" /></svg></div></button></div></form><div /></div><div className="popularFormatsWrapper___1PPVz"><p className="typography-subheading-s tryThis___36Zem">Try this:</p><div className="popularList___3nk_n"><a className="sc-AykKD itGidr sc-AykKE kNYgVe popularItem___EYcj6" data-categ="template" data-value="facebookSM" data-subcateg="searchSuggesting" href="/templates/6">
                                                        <div className="sc-AykKF ceNsQj">{this.translate("facebookPost")}</div>
                                                    </a>
                                                        <a className="sc-AykKD itGidr sc-AykKE kNYgVe popularItem___EYcj6" data-categ="template" data-value="socialMediaSM" data-subcateg="searchSuggesting" href="/templates/11/">
                                                            <div className="sc-AykKF ceNsQj">Menu</div>
                                                        </a>
                                                        <a className="sc-AykKD itGidr sc-AykKE kNYgVe popularItem___EYcj6" data-categ="template" data-value="animatedPostAN" data-subcateg="searchSuggesting" href="/templates/9/">
                                                            <div className="sc-AykKF ceNsQj">{this.translate("squareVideoPost")}</div>
                                                        </a>
                                                        <a className="sc-AykKD itGidr sc-AykKE kNYgVe popularItem___EYcj6" data-categ="template" data-value="instagramStorySM" data-subcateg="searchSuggesting" href="/templates/12/">
                                                            <div className="sc-AykKF ceNsQj">Instagram Story</div>
                                                        </a>
                                                        <a className="sc-AykKD itGidr sc-AykKE kNYgVe popularItem___EYcj6" data-categ="template" data-value="instagramSM" data-subcateg="searchSuggesting" href="/home/instagram/">
                                                            <div className="sc-AykKF ceNsQj">{this.translate("instagramPost")}</div>
                                                        </a>
                                                    </div></div></div>

                                    <SuggestedList
                                        translate={this.translate}
                                    />
                                </header>
                            </div>
                        </div>
                    </div>

                    {loggedIn && this.state.hasDesign &&
                        <PopularTemplate
                            key={this.state.key}
                            translate={this.translate.bind(this)}
                        />}
                    <PopularTemplate2
                        translate={this.translate.bind(this)}
                    />
                    {templates.map(i => 
                    <PopularTemplate3
                        ref={el => this.templates[i] = el}
                        translate={this.translate.bind(this)}
                        printType={i}
                    />)}
                </div>
            </div>
        );
    }
}

const templates = [10, 6, 9, 14, 15, 16];

export default withTranslation(NAMESPACE)(HomePage);
