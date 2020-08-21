import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Route, Link } from "react-router-dom";
import Globals from "@Globals";
import AccountService from "@Services/AccountService";
import { Helmet } from "react-helmet";
import bind from 'bind-decorator';
import LoginPopup from "@Components/shared/LoginPopup";
import styled from 'styled-components';
import { withTranslation } from "react-i18next";
import languages from "@Locales/languages";
import uuidv4 from "uuid/v4";
import { ILocale } from "@Models/ILocale";
import homePageTranslation from "@Locales/default/homePage";
import loadable from '@loadable/component';
import { isClickOutside } from '@Functions/shared/common';
import axios from "axios";

const PopularTemplate = loadable(() => import("@Components/homepage/PopularTemplate"));
const CatalogList = loadable(() => import("@Components/homepage/CatalogList"));
const SuggestedList = loadable(() => import("@Components/homepage/SuggestedList"));
const NavBar = loadable(() => import("@Components/homepage/NavBar"));

type Props = RouteComponentProps<{}>;

export interface IProps {
  t: any;
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
}


const Breadcrumbs = () => <Route path="*" render={props => {
  let parts = props.location.pathname.split("/");
  const place = parts[parts.length-1];
  parts = parts.slice(1, parts.length-1);
  return <p>{parts.map(crumb)}/{place}</p>}} />

const crumb = (part, partIndex, parts) => {
      const path = ['', ...parts.slice(0, partIndex+1)].join("/");
      return <Link key={path} to={path} >{part}</Link>}

const initLocale = { "value": "en-US", "title": "English" };

const NAMESPACE = "homePage";

class HomePage extends React.Component<IProps, IState> {

  state = {
    tab: "find",
    focusing: false,
    mounted: false,
    navTop: 0,
    externalProviderCompleted: false,
    showLanguageDropdown: false,
    locale: initLocale,
    recentDesign: [],
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
    if(Globals.locale === undefined) {
      Globals.locale = locale === undefined ? initLocale : locale;
      this.state.locale = locale === undefined ? initLocale : locale;
    }
  }

  handleLoginSuccess = (user) => { 
    this.setState({externalProviderCompleted: true});
    window['publicSession'] = { serviceUser: user, locale: this.state.locale };
    Globals.reset(); 
    Globals.init({public: window['publicSession']}); 
    this.forceUpdate();
  }

  handleSelectLanguage = (locale: ILocale) => {
    this.setLocale(locale);
    this.onLanguageBtnClick();
    this.props.i18n.changeLanguage(locale.value);
  }

  componentDidMount() {
    NavBar.load().then(() => {
        const navTop = document.getElementsByTagName("nav")[0].getBoundingClientRect().top;
        this.setState({ navTop });
    });
    this.setState({mounted: true});
    window.addEventListener('scroll', this.handleScroll);

    if (Globals.serviceUser) {
      const url = `https://localhost:64099/api/Design/SearchWithUserName?userName=${Globals.serviceUser.username}`;
      axios
        .get(url)
        .then(res => {
          this.setState({recentDesign: res.data.value.key});
        })
        .catch(error => {
            // Ui.showErrors(error.response.statusText)
        });
    }
  }

  @bind
  async onClickSignOut(e: any) {
      e.preventDefault();

      await AccountService.logout();
      this.forceUpdate();
      this.setState({externalProviderCompleted: false,})
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

handleScroll = () => {
  const nav = document.getElementById("hello-world");
  const navTop = this.state.navTop;
  if (window.scrollY > navTop) {
    nav.classList.add('fixed-nav');
    // document.body.style.paddingTop = nav.offsetHeight+'px';
    document.getElementById("main-container").style.paddingTop= "43px";
  } else {
    nav.classList.remove('fixed-nav');
    document.getElementById("main-container").style.paddingTop= "0px";
  }
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
    this.setState({externalProviderCompleted: true,})
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

  render() {
    if (this.props.i18n.language === undefined)
      return null;

    const loggedIn = Globals.serviceUser && Globals.serviceUser.username !== undefined;

    const { t } = this.props;

    return (
      <div>
        <Helmet>
          <title>{this.translate("title-website")}</title>
        </Helmet>
        <div
        style={{
            boxShadow: '0 1px 8px rgba(38,49,71,.08)',
        }}>
          <div
            className="container"
            style={{
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
    transform: 'scale(0.5)',
    transformOrigin: 'center 20px',
    position: 'absolute',
    left: 0, 
    right: 0,
    margin: 'auto',
}} width="160" height="60" xmlns="http://www.w3.org/2000/svg">
 <metadata id="metadata190397">image/svg+xml</metadata>

 <g>
  <title>background</title>
  <rect fill="none" id="canvas_background" height="62" width="162" y="-1" x="-1"/>
 </g>
 <g>
  <title>Layer 1</title>
  <g stroke="null" id="logo-group">
   <g stroke="null" fontWeight="700" fontSize="72px" fontFamily="'Brandmark1 Bold'" textAnchor="middle" id="title">
    <path stroke="null" fill="#56aaff" transform="translate(0,365.45123291015625) " d="m4.52583,-318.85031c1.04036,2.24451 2.4275,4.29098 4.23078,6.00737c1.87264,1.71639 3.95335,3.10271 6.31149,4.02692c2.4275,0.99023 5.06306,1.45233 7.69863,1.45233c2.63557,0 5.27114,-0.46211 7.69863,-1.45233c2.35814,-0.92421 4.43885,-2.31053 6.31149,-4.02692c1.80328,-1.71639 3.19042,-3.76286 4.23078,-6.00737c1.04036,-2.31053 1.52586,-4.75308 1.52586,-7.32767l0,-32.0173l-10.40356,-3.30075l0,18.74828c-0.55486,-0.26406 -1.10971,-0.52812 -1.66457,-0.72617c-2.4275,-0.99023 -4.99371,-1.45233 -7.69863,-1.45233c-2.63557,0 -5.27114,0.46211 -7.69863,1.45233c-2.35814,0.92421 -4.43885,2.31053 -6.31149,4.02692c-1.80328,1.71639 -3.19042,3.76286 -4.23078,6.00737c-0.971,2.31053 -1.52586,4.75308 -1.52586,7.26166c0,2.57459 0.55486,5.01714 1.52586,7.32767zm18.2409,-16.2397c5.13242,0 9.3632,4.02692 9.3632,8.91203c0,4.95113 -4.23078,8.91203 -9.3632,8.91203c-5.13242,0 -9.3632,-3.9609 -9.3632,-8.91203c0,-4.88511 4.23078,-8.91203 9.3632,-8.91203z" id="path190399"/>
    <path stroke="null" fill="#56aaff" transform="translate(0,365.45123291015625) " d="m58.15835,-307.8258l0,0l0,-16.2397c0,-6.33745 5.40985,-11.55263 12.13748,-11.55263l0,-9.90226c-3.05171,0 -6.03406,0.59414 -8.80834,1.71639c-2.63557,1.05624 -5.06306,2.6406 -7.14378,4.62105c-2.08071,1.91444 -3.67592,4.22496 -4.85499,6.79955c-1.17907,2.6406 -1.73393,5.41323 -1.73393,8.3179l0,16.2397l10.40356,0z" id="path190401"/>
    <path stroke="null" fill="#56aaff" transform="translate(0,365.45123291015625) " d="m97.54557,-344.99227l0.06936,2.11248c-2.77428,-1.3203 -5.82599,-2.04647 -8.94706,-2.04647c-2.63557,0 -5.27114,0.46211 -7.69863,1.45233c-2.35814,0.99023 -4.43885,2.31053 -6.31149,4.02692c-1.80328,1.71639 -3.19042,3.76286 -4.23078,6.00737c-0.971,2.31053 -1.52586,4.8191 -1.52586,7.32767c0,2.50857 0.55486,5.01714 1.52586,7.32767c1.04036,2.24451 2.4275,4.22496 4.23078,6.00737c1.87264,1.71639 3.95335,3.03669 6.31149,4.02692c2.4275,0.92421 5.06306,1.45233 7.69863,1.45233c3.12107,0 6.17278,-0.72617 8.94706,-2.04647l-0.06936,1.51835l10.40356,0l0,-37.16648l-10.40356,0zm-4.16142,26.53805c-1.38714,0.79218 -3.05171,1.25429 -4.71628,1.25429c-5.13242,0 -9.3632,-4.02692 -9.3632,-8.91203c0,-4.88511 4.23078,-8.91203 9.3632,-8.91203c1.80328,0 3.60657,0.46211 5.06306,1.45233c1.52586,0.8582 2.70492,2.1785 3.3985,3.69684c0.62421,1.18827 0.90164,2.44256 0.90164,3.76286c0,1.58436 -0.41614,3.10271 -1.24843,4.48902c-0.83228,1.3203 -1.942,2.44256 -3.3985,3.16872z" id="path190403"/>
    <path stroke="null" fill="#56aaff" transform="translate(0,365.45123291015625) " d="m124.14507,-344.46415l0,-0.06602c0,-5.74331 4.92435,-10.49639 11.02777,-10.49639l0,-9.90226c-2.913,0 -5.75663,0.59414 -8.3922,1.65038c-2.56621,0.99023 -4.85499,2.44256 -6.79699,4.35699c-1.942,1.84842 -3.53721,4.02692 -4.57757,6.46948c-1.10971,2.50857 -1.66457,5.21519 -1.66457,7.92181l0,36.70437l10.40356,0l0,-27.39625l11.02777,0l0,-9.24211l-11.02777,0z" id="path190405"/>
    <path stroke="null" fill="#56aaff" transform="translate(0,365.45123291015625) " d="m157.99997,-335.35407l0,-9.24211l-11.02777,0l0,-11.81669l-10.40356,3.30075l0,25.61384c0,2.77263 0.55486,5.41323 1.66457,7.92181c1.04036,2.44256 2.63557,4.62105 4.57757,6.46948c1.942,1.91444 4.23078,3.36677 6.79699,4.42301c2.63557,1.05624 5.47921,1.58436 8.3922,1.58436l0,-9.90226c-6.10342,0 -11.02777,-4.68707 -11.02777,-10.49639l0,-7.85579l11.02777,0z" id="path190407"/>
   </g>
   <g stroke="null" fontWeight="400" fontSize="32px" fontFamily="Montserrat" textAnchor="middle" id="tagline"/>
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
    {!loggedIn ? <div style={{display: 'flex'}}>
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
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '4px',
            fontFamily: 'AvenirNextRoundedPro',
            color: '#555',
            display: 'block',
            padding: '0 10px',
        }}
        // onClick={() => {location.href='/login';}}
        onClick={this.handleLogin}
    >{this.translate("login")}</button></div>
    :
    <div style={{display: 'flex', position: 'relative',}}>
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
                fontWeight: 500,
                fontFamily: 'AvenirNextRoundedPro',
                color: '#555',
            }}
            className="button-list"
            onClick={this.handleProfilePopup}
        ><span style={{marginRight: '10px', fontSize: '13px',}}>{Globals.serviceUser.username}</span>
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
            fontFamily: 'AvenirNextRoundedPro',
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
            {languages.filter((language) => language.value !== this.state.locale.value).map( (language) => (
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
    {/* <div id="myProfilePopup"
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
    }}>
        <button
        id="login-btn"
        style={{
            height: '30px',
            lineHeight: '30px',
            border: 'none',
            fontSize: '14px',
            fontFamily: 'AvenirNextRoundedPro',
            color: 'black',
            display: 'block',
            padding: '0 12px',
            width: '100%',
            textAlign: 'left',
        }}
        // onClick={() => {location.href='/login';}}
        onClick={this.onClickSignOut}
    >{this.translate("logout")}</button>
    </div> */}
</div>
</div>
          </div>
        </div>
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
            // className="container" 
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
                height: "300px",
                position: 'relative',
                marginTop: 'auto',
                marginBottom: 'auto',
                padding: '20px 50px 0px',
                content: "",
                display: 'block',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
                // opacity: .9,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundImage: 'url(/web_images/homeBackground.jpg)',
              }}
            className="offset-header__header u-last-child-margin-bottom-0 u-textAlign-left@medium">
        <div className="h__hero u-color-inherit@medium ">
          {/* <h2
            style={{
                color: 'white', 
                textAlign: 'center',
                fontSize: '50px',
                marginBottom: '25px',
                fontFamily: 'Lobster-Regular',
            }}
          >{this.translate("title-above-search-box")}</h2> */}
          <svg style={{
            display: 'block',
            margin: '28px auto',
            fill: 'white',
          }} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="317" height="44">
    <g id="Layer1" name="Layer 1" opacity="1">
        <g id="Shape1">
            {this.state.locale.value == "vi-VN" ?
              <path id="shapePath1" d="M26.6695,44 C25.3929,44 24.2848,43.7372 23.3432,43.211 C22.4023,42.6842 21.9319,41.7672 21.9319,40.4594 C21.9319,39.63 22.1389,38.7043 22.5536,37.6838 C23.1282,38.3215 23.6624,38.768 24.1567,39.0235 C24.651,39.2789 25.1859,39.4063 25.7598,39.4063 C27.3549,39.4063 28.5434,38.5132 29.325,36.7263 C30.1066,34.9401 30.4975,32.9621 30.4975,30.793 C30.4975,26.7408 28.9819,24.715 25.9516,24.715 C25.0903,24.715 24.3564,24.7628 23.75,24.859 L19.8258,43.1865 L12.935,43.1865 L19.443,12.7515 L26.5255,11.7947 L24.2768,22.4185 L24.5635,22.4185 C25.7757,22.4185 26.9084,22.0277 27.9614,21.246 C29.0138,20.4644 29.8591,19.4751 30.4975,18.2787 C31.1358,17.0824 31.4543,15.878 31.4543,14.6658 C31.4543,13.1987 30.9361,11.9705 29.8996,10.9812 C28.8625,9.99249 27.2753,9.49749 25.1381,9.49749 C23.1919,9.49749 21.2936,9.93608 19.443,10.814 C17.593,11.6911 16.0855,13.0069 14.921,14.762 C13.7565,16.5164 13.1746,18.6377 13.1746,21.1259 C13.1746,22.3064 13.286,23.1278 13.5096,23.591 C13.7326,24.0535 13.8447,24.3162 13.8447,24.3806 C12.1534,24.3806 10.8774,24.0375 10.0161,23.3514 C9.15488,22.6653 8.72423,21.5407 8.72423,19.978 C8.72423,17.8083 9.53773,15.7506 11.1647,13.8045 C12.7917,11.8583 14.9449,10.2871 17.6249,9.09075 C20.3049,7.89439 23.1282,7.29654 26.0949,7.29654 C28.3284,7.29654 30.2101,7.64756 31.7416,8.34958 C33.273,9.05093 34.4136,9.97656 35.1634,11.1245 C35.9132,12.2731 36.2881,13.5331 36.2881,14.9053 C36.2881,16.373 35.8727,17.7923 35.0433,19.1645 C34.2139,20.5361 33.0335,21.6528 31.5027,22.5141 C33.4163,22.8651 34.8363,23.7502 35.7613,25.1695 C36.6869,26.5895 37.1494,28.2722 37.1494,30.2184 C37.1494,32.0371 36.8063,34.0151 36.1202,36.1524 C35.4341,38.2896 34.3022,40.1323 32.7229,41.6796 C31.1437,43.227 29.1259,44 26.6695,44 M56.2724,2.70223 L60.1966,2.70223 L55.794,10.0243 L53.1147,10.0243 L56.2724,2.70223 M53.4969,15.0964 C51.3915,15.0964 49.7884,14.5941 48.6876,13.5895 C47.5874,12.5843 47.0367,11.1245 47.0367,9.21085 L50.8175,9.21085 C50.8175,10.3269 51.1042,11.1888 51.6788,11.7947 C52.2528,12.4011 53.0822,12.7037 54.1671,12.7037 C55.3156,12.7037 56.3368,12.3693 57.2299,11.6991 C58.123,11.0289 58.6333,10.1995 58.7614,9.21085 L62.3982,9.21085 C62.2383,10.2951 61.736,11.2844 60.8906,12.1775 C60.0453,13.0706 58.9763,13.7806 57.6844,14.3068 C56.3925,14.8336 54.9965,15.0964 53.4969,15.0964 M44.5485,43.4738 C42.7304,43.4738 41.2149,42.8521 40.0026,41.6079 C38.7903,40.3632 38.1838,38.4177 38.1838,35.7695 C38.1838,33.4086 38.6543,30.9283 39.5958,28.328 C40.5367,25.7282 41.9408,23.5266 43.8066,21.7245 C45.6731,19.9216 47.8986,19.0206 50.4824,19.0206 C51.7903,19.0206 52.7637,19.2442 53.4013,19.6907 C54.0396,20.1373 54.3588,20.7272 54.3588,21.461 L54.3588,21.7961 L54.885,19.2601 L61.7758,19.2601 L58.3307,35.53 C58.2027,36.009 58.139,36.5193 58.139,37.0614 C58.139,38.4336 58.7932,39.119 60.101,39.119 C60.9942,39.119 61.7678,38.7043 62.4221,37.8749 C63.0757,37.0455 63.5945,35.9606 63.9774,34.6209 L65.9873,34.6209 C64.8068,38.0667 63.347,40.4036 61.6086,41.6318 C59.8695,42.86 58.123,43.4738 56.3687,43.4738 C55.0283,43.4738 53.9521,43.0989 53.1386,42.3491 C52.3251,41.5993 51.838,40.5071 51.6788,39.0713 C50.7538,40.3791 49.7247,41.4401 48.592,42.2536 C47.4594,43.0671 46.1117,43.4738 44.5485,43.4738 M47.6591,38.8324 C48.4567,38.8324 49.2463,38.4575 50.0279,37.7077 C50.8096,36.9579 51.3437,35.9287 51.631,34.6209 L53.9282,23.806 C53.9282,23.3912 53.7683,22.9845 53.4491,22.5857 C53.1306,22.1869 52.6356,21.9879 51.9661,21.9879 C50.6895,21.9879 49.5415,22.7291 48.5204,24.2127 C47.4999,25.6964 46.7023,27.4826 46.1277,29.5721 C45.5537,31.6622 45.2664,33.5042 45.2664,35.0993 C45.2664,36.6945 45.498,37.7157 45.9604,38.1622 C46.4229,38.6088 46.9889,38.8324 47.6591,38.8324 M68.4649,43.4738 C66.8379,43.4738 65.6336,42.9795 64.8519,41.9902 C64.0703,41.0015 63.6795,39.6936 63.6795,38.0667 C63.6795,37.2372 63.775,36.3913 63.9668,35.53 L67.029,21.1744 L65.4504,21.1744 L65.8333,19.2601 L67.4119,19.2601 L68.8477,12.6559 L75.9303,11.6991 C75.643,12.9114 75.4837,13.6293 75.4519,13.8523 C75.2283,14.7454 74.8454,16.5482 74.3033,19.2601 L77.1744,19.2601 L76.7916,21.1744 L73.9205,21.1744 L70.8576,35.53 C70.6983,36.232 70.6181,36.79 70.6181,37.2054 C70.6181,38.3533 71.1768,38.9279 72.2935,38.9279 C72.8674,38.9279 73.2821,38.8802 73.5376,38.784 C72.8993,40.6346 72.1495,41.8787 71.2882,42.517 C70.4269,43.1547 69.4861,43.4738 68.4649,43.4738 M106.996,35.53 C106.868,36.009 106.805,36.5193 106.805,37.0614 C106.805,37.6997 106.957,38.1543 107.259,38.4256 C107.562,38.6964 108.065,38.8324 108.767,38.8324 C109.66,38.8324 110.433,38.4495 111.088,37.6838 C111.742,36.9181 112.26,35.8969 112.643,34.6209 L114.653,34.6209 C112.707,40.3313 109.501,43.1865 105.034,43.1865 C103.726,43.1865 102.665,42.8361 101.852,42.1341 C101.038,41.4321 100.536,40.4116 100.344,39.0713 C99.515,40.3472 98.5183,41.4003 97.3538,42.2297 C96.1893,43.0591 94.8251,43.4738 93.2618,43.4738 C91.4437,43.4738 89.9282,42.8521 88.7159,41.6079 C87.5037,40.3632 86.8979,38.4177 86.8979,35.7695 C86.8979,33.4086 87.3683,30.9283 88.3092,28.328 C89.2501,25.7282 90.6541,23.5266 92.5206,21.7245 C94.3865,19.9216 96.612,19.0206 99.1958,19.0206 C100.504,19.0206 101.477,19.2442 102.115,19.6907 C102.753,20.1373 103.072,20.7272 103.072,21.461 L103.072,21.6528 L104.173,16.4367 L99.9615,16.4367 L100.584,14.044 L104.699,14.044 L105.417,10.6461 L112.499,9.68925 L111.59,14.044 L115.419,14.044 L114.701,16.4367 L111.064,16.4367 L106.996,35.53 M102.642,23.6626 C102.354,22.5459 101.701,21.9879 100.679,21.9879 C99.4035,21.9879 98.2549,22.7291 97.2337,24.2127 C96.2132,25.6964 95.4156,27.4826 94.841,29.5721 C94.2671,31.6622 93.9798,33.5042 93.9798,35.0993 C93.9798,36.6945 94.2113,37.7157 94.6738,38.1622 C95.1363,38.6088 95.703,38.8324 96.3725,38.8324 C97.1382,38.8324 97.9119,38.4814 98.6935,37.7794 C99.4752,37.0773 100.009,36.1046 100.297,34.8605 L100.297,34.6209 L102.642,23.6626 M133.124,2.75066 L136.904,2.75066 L138.149,10.6938 L135.613,10.6938 L133.124,2.75066 M130.109,7.82273 L130.971,7.82273 L133.555,15.7666 L132.215,15.7666 L129.631,12.3693 L123.027,15.7666 L121.161,15.7666 L130.109,7.82273 M118.385,43.4738 C116.567,43.4738 115.052,42.8521 113.839,41.6079 C112.627,40.3632 112.021,38.4177 112.021,35.7695 C112.021,33.4086 112.491,30.9283 113.433,28.328 C114.373,25.7282 115.778,23.5266 117.643,21.7245 C119.51,19.9216 121.735,19.0206 124.319,19.0206 C125.627,19.0206 126.6,19.2442 127.238,19.6907 C127.876,20.1373 128.196,20.7272 128.196,21.461 L128.196,21.7961 L128.722,19.2601 L135.613,19.2601 L132.167,35.53 C132.039,36.009 131.976,36.5193 131.976,37.0614 C131.976,38.4336 132.63,39.119 133.938,39.119 C134.831,39.119 135.605,38.7043 136.259,37.8749 C136.912,37.0455 137.431,35.9606 137.814,34.6209 L139.824,34.6209 C138.644,38.0667 137.184,40.4036 135.445,41.6318 C133.706,42.86 131.96,43.4738 130.205,43.4738 C128.865,43.4738 127.789,43.0989 126.975,42.3491 C126.162,41.5993 125.675,40.5071 125.516,39.0713 C124.591,40.3791 123.561,41.4401 122.429,42.2536 C121.296,43.0671 119.949,43.4738 118.385,43.4738 M121.496,38.8324 C122.293,38.8324 123.083,38.4575 123.865,37.7077 C124.646,36.9579 125.18,35.9287 125.468,34.6209 L127.765,23.806 C127.765,23.3912 127.605,22.9845 127.286,22.5857 C126.967,22.1869 126.472,21.9879 125.803,21.9879 C124.526,21.9879 123.378,22.7291 122.357,24.2127 C121.337,25.6964 120.539,27.4826 119.964,29.5721 C119.39,31.6622 119.103,33.5042 119.103,35.0993 C119.103,36.6945 119.335,37.7157 119.797,38.1622 C120.26,38.6088 120.826,38.8324 121.496,38.8324 M142.541,43.4738 C141.01,43.4738 139.774,42.9954 138.832,42.0386 C137.891,41.0811 137.421,39.6459 137.421,37.7316 C137.421,36.934 137.548,35.8969 137.804,34.6209 L141.058,19.2601 L147.948,19.2601 L144.503,35.53 C144.407,35.9128 144.359,36.3116 144.359,36.7263 C144.359,38.1304 144.838,38.8324 145.795,38.8324 C146.688,38.8324 147.454,38.4575 148.092,37.7077 C148.73,36.9579 149.24,35.9287 149.623,34.6209 L152.878,19.2601 L159.769,19.2601 L156.323,35.53 C156.195,36.009 156.132,36.5193 156.132,37.0614 C156.132,37.6997 156.283,38.1543 156.586,38.4256 C156.889,38.6964 157.392,38.8324 158.094,38.8324 C158.604,38.8324 158.979,38.7919 159.218,38.7123 C159.457,38.6327 159.609,38.5769 159.672,38.5451 C159.545,40.1721 158.987,41.4003 157.998,42.2297 C157.009,43.0591 155.797,43.4738 154.361,43.4738 C153.021,43.4738 151.944,43.075 151.131,42.2775 C150.317,41.4799 149.831,40.3632 149.672,38.9279 C148.587,40.6823 147.446,41.8787 146.25,42.517 C145.053,43.1547 143.817,43.4738 142.541,43.4738 M174.842,43.4738 C173.311,43.4738 172.074,42.9954 171.134,42.0386 C170.193,41.0811 169.722,39.6459 169.722,37.7316 C169.722,36.934 169.85,35.8969 170.104,34.6209 L172.976,21.1744 L171.397,21.1744 L171.78,19.2601 L173.359,19.2601 L174.794,12.6559 L181.877,11.6991 L180.25,19.2601 L183.121,19.2601 L182.738,21.1744 L179.867,21.1744 L176.804,35.53 C176.677,36.009 176.613,36.5193 176.613,37.0614 C176.613,37.6997 176.764,38.1543 177.068,38.4256 C177.371,38.6964 177.873,38.8324 178.575,38.8324 C179.5,38.8324 180.361,38.4416 181.159,37.6599 C181.956,36.8783 182.531,35.8651 182.881,34.6209 L184.891,34.6209 C183.711,38.0667 182.196,40.4036 180.345,41.6318 C178.495,42.86 176.661,43.4738 174.842,43.4738 M200.129,43.4738 C198.183,43.4738 196.755,42.9556 195.846,41.9185 C194.936,40.882 194.482,39.5974 194.482,38.0667 C194.482,37.3965 194.562,36.6387 194.721,35.7934 C194.881,34.948 195.048,34.1266 195.223,33.329 C195.399,32.5315 195.518,32.0212 195.582,31.7976 C195.838,30.6808 196.077,29.5801 196.3,28.4958 C196.524,27.411 196.635,26.5338 196.635,25.8636 C196.635,24.2366 196.061,23.4231 194.913,23.4231 C194.083,23.4231 193.349,23.8299 192.711,24.6433 C192.073,25.4568 191.562,26.5178 191.18,27.8257 L187.926,43.1865 L181.035,43.1865 L187.973,10.6461 L195.056,9.68925 L192.472,21.7483 C194.067,19.9614 195.933,19.0683 198.071,19.0683 C199.698,19.0683 200.99,19.5149 201.947,20.4087 C202.904,21.3018 203.383,22.6574 203.383,24.4761 C203.383,25.4011 203.271,26.4302 203.048,27.5622 C202.824,28.6949 
              202.505,30.075 202.091,31.702 C201.835,32.6907 201.604,33.6561 201.397,34.597 C201.189,35.5379 201.085,36.2798 201.085,36.8225 C201.085,37.4602 201.229,37.9545 201.516,38.3055 C201.803,38.6566 202.298,38.8324 203,38.8324 C203.957,38.8324 204.722,38.4893 205.297,37.8032 C205.871,37.1171 206.445,36.0568 207.019,34.6209 L209.029,34.6209 C207.849,38.1304 206.485,40.4833 204.938,41.6796 C203.391,42.876 201.787,43.4738 200.129,43.4738 M214.996,16.6756 C213.943,16.6756 213.05,16.3087 212.316,15.5755 C211.583,14.8416 211.216,13.9478 211.216,12.8955 C211.216,11.8424 211.583,10.9413 212.316,10.1915 C213.05,9.44175 213.943,9.06685 214.996,9.06685 C216.049,9.06685 216.95,9.44175 217.7,10.1915 C218.45,10.9413 218.824,11.8424 218.824,12.8955 C218.824,13.9478 218.45,14.8416 217.7,15.5755 C216.95,16.3087 216.049,16.6756 214.996,16.6756 M211.742,43.4738 C210.21,43.4738 208.974,42.9954 208.033,42.0386 C207.092,41.0811 206.621,39.6459 206.621,37.7316 C206.621,36.934 206.749,35.8969 207.004,34.6209 L210.258,19.2601 L217.15,19.2601 L213.704,35.53 C213.577,36.009 213.513,36.5193 213.513,37.0614 C213.513,37.6997 213.664,38.1543 213.967,38.4256 C214.27,38.6964 214.773,38.8324 215.474,38.8324 C216.049,38.8324 216.559,38.7362 217.006,38.5451 C216.878,40.1402 216.312,41.3605 215.307,42.2058 C214.302,43.0511 213.114,43.4738 211.742,43.4738 M239.621,1.07524 L243.785,1.07524 L238.664,9.06685 L235.745,9.06685 L239.621,1.07524 M232.108,7.82273 L232.97,7.82273 L235.553,15.7666 L234.214,15.7666 L231.678,12.3693 L225.026,15.7666 L223.159,15.7666 L232.108,7.82273 M223.829,43.4738 C221.469,43.4738 219.635,42.86 218.326,41.6318 C217.018,40.4036 216.364,38.4814 216.364,35.8651 C216.364,33.6641 216.795,31.2396 217.657,28.5914 C218.518,25.9432 219.921,23.6547 221.867,21.7245 C223.814,19.7942 226.286,18.8294 229.285,18.8294 C232.794,18.8294 234.549,20.3602 234.549,23.4231 C234.549,25.21 234.039,26.8529 233.017,28.3519 C231.996,29.8514 230.641,31.0557 228.95,31.9648 C227.259,32.8745 225.456,33.3927 223.542,33.5201 C223.478,34.4776 223.447,35.1153 223.447,35.4344 C223.447,36.9977 223.718,38.0587 224.26,38.6167 C224.803,39.1748 225.68,39.4541 226.892,39.4541 C228.615,39.4541 230.091,39.0553 231.319,38.2578 C232.547,37.4602 233.895,36.2479 235.362,34.6209 L236.989,34.6209 C233.448,40.5231 229.061,43.4738 223.829,43.4738 M223.925,31.2236 C225.105,31.1593 226.23,30.7446 227.299,29.9788 C228.367,29.2138 229.229,28.2404 229.883,27.0599 C230.537,25.8795 230.864,24.6354 230.864,23.3276 C230.864,22.0197 230.465,21.3655 229.668,21.3655 C228.519,21.3655 227.395,22.3707 226.294,24.3806 C225.193,26.3904 224.404,28.671 223.925,31.2236 M239.841,43.4738 C238.214,43.4738 237.01,42.9795 236.228,41.9902 C235.447,41.0015 235.056,39.6936 235.056,38.0667 C235.056,37.2372 235.151,36.3913 235.343,35.53 L238.405,21.1744 L236.826,21.1744 L237.209,19.2601 L238.788,19.2601 L240.224,12.6559 L247.306,11.6991 C247.019,12.9114 246.859,13.6293 246.828,13.8523 C246.605,14.7454 246.222,16.5482 245.679,19.2601 L248.551,19.2601 L248.168,21.1744 L245.296,21.1744 L242.234,35.53 C242.074,36.232 241.994,36.79 241.994,37.2054 C241.994,38.3533 242.553,38.9279 243.669,38.9279 C244.244,38.9279 244.658,38.8802 244.913,38.784 C244.276,40.6346 243.526,41.8787 242.665,42.517 C241.803,43.1547 240.862,43.4738 239.841,43.4738 M276.889,43.4738 C274.911,43.4738 273.411,43.0034 272.39,42.0625 C271.37,41.1209 270.859,39.7733 270.859,38.0189 C270.859,37.2532 270.955,36.4237 271.146,35.53 L271.529,33.6641 C271.657,33.1213 271.721,32.5315 271.721,31.8931 C271.721,30.3617 271.146,29.5966 269.998,29.5966 C269.487,29.5966 268.953,29.74 268.395,30.0273 C267.836,30.3139 267.191,30.7605 266.457,31.367 L263.968,43.1865 L257.077,43.1865 L264.016,10.6461 L271.098,9.68925 L267.509,26.5338 L276.745,19.2601 L281.483,19.2601 L271.912,25.9114 C272.39,25.784 272.917,25.7203 273.491,25.7203 C275.214,25.7203 276.522,26.2465 277.415,27.2995 C278.308,28.3519 278.755,29.6922 278.755,31.3192 C278.755,31.9893 278.691,32.5952 278.564,33.1373 L278.038,35.53 C277.878,36.1046 277.798,36.6149 277.798,37.0614 C277.798,38.2418 278.42,38.8324 279.664,38.8324 C280.366,38.8324 280.813,38.784 281.004,38.6884 C281.195,38.5928 281.307,38.5451 281.339,38.5451 C281.276,39.5974 280.98,40.4912 280.454,41.2251 C279.927,41.9583 279.322,42.517 278.635,42.8999 C277.949,43.2827 277.367,43.4738 276.889,43.4738 M304.112,1.07524 L308.275,1.07524 L303.154,9.06685 L300.235,9.06685 L304.112,1.07524 M296.599,7.82273 L297.46,7.82273 L300.044,15.7666 L298.704,15.7666 L296.168,12.3693 L289.516,15.7666 L287.65,15.7666 L296.599,7.82273 M288.32,43.4738 C285.959,43.4738 284.125,42.86 282.817,41.6318 C281.508,40.4036 280.855,38.4814 280.855,35.8651 C280.855,33.6641 281.286,31.2396 282.147,28.5914 C283.008,25.9432 284.412,23.6547 286.358,21.7245 C288.304,19.7942 290.776,18.8294 293.775,18.8294 C297.285,18.8294 299.039,20.3602 299.039,23.4231 C299.039,25.21 298.529,26.8529 297.508,28.3519 C296.487,29.8514 295.131,31.0557 293.44,31.9648 C291.749,32.8745 289.947,33.3927 288.033,33.5201 C287.969,34.4776 287.937,35.1153 287.937,35.4344 C287.937,36.9977 288.208,38.0587 288.75,38.6167 C289.293,39.1748 290.17,39.4541 291.383,39.4541 C293.105,39.4541 294.581,39.0553 295.809,38.2578 C297.037,37.4602 298.385,36.2479 299.853,34.6209 L301.48,34.6209 C297.938,40.5231 293.552,43.4738 288.32,43.4738 M288.415,31.2236 C289.596,31.1593 290.72,30.7446 291.789,29.9788 C292.858,29.2138 293.719,28.2404 294.373,27.0599 C295.027,25.8795 295.354,24.6354 295.354,23.3276 C295.354,22.0197 294.956,21.3655 294.158,21.3655 C293.01,21.3655 291.885,22.3707 290.784,24.3806 C289.684,26.3904 288.894,28.671 288.415,31.2236 Z"/>
              :
              <path id="shapePath1" d="M66.8376,34.0864 C65.0429,34.0864 63.4619,33.773 62.0945,33.1463 C60.7271,32.5196 59.673,31.6436 58.9324,30.5183 C58.1917,29.3931 57.8213,28.0898 57.8213,26.6084 C57.8213,25.355 58.0849,24.2155 58.6119,23.1899 C59.1389,22.1644 59.8511,21.3525 60.7484,20.7542 C61.6458,20.156 62.6357,19.8569 63.7182,19.8569 C64.7153,19.8569 65.5557,20.1061 66.2394,20.6047 C66.9231,21.1032 67.3504,21.794 67.5213,22.6771 C66.04,22.6771 64.8577,23.0688 63.9746,23.8522 C63.0915,24.6356 62.65,25.6968 62.65,27.0357 C62.65,28.2607 63.0203,29.2435 63.761,29.9842 C64.5016,30.7248 65.4845,31.0952 66.7094,31.0952 C68.2193,31.0952 69.4656,30.5895 70.4484,29.5782 C71.4312,28.5669 71.9226,27.2921 71.9226,25.7538 C71.9226,24.4149 71.5523,23.1472 70.8116,21.9507 C70.0709,20.7542 68.9599,19.3014 67.4786,17.5921 C65.9403,15.8259 64.7794,14.3089 63.996,13.0413 C63.2126,11.7736 62.8209,10.3848 62.8209,8.87496 C62.8209,7.39362 63.234,6.06183 64.0601,4.8796 C64.8862,3.69737 66.0257,2.76441 67.4786,2.08071 C68.9314,1.39701 70.5695,1.05516 72.3927,1.05516 C74.7002,1.05516 76.5447,1.59642 77.9264,2.67894 C79.308,3.76147 79.9988,5.21433 79.9988,7.03752 C79.9988,8.234 79.6997,9.20257 79.1015,9.94324 C78.5032,10.6839 77.7198,11.0543 76.7513,11.0543 C75.6687,11.0543 74.7999,10.6127 74.1447,9.72959 C74.6859,9.33076 75.1132,8.80375 75.4266,8.14853 C75.7399,7.49332 75.8966,6.80962 75.8966,6.09744 C75.8966,5.18584 75.626,4.45941 75.0847,3.91815 C74.5435,3.37689 73.8028,3.10625 72.8627,3.10625 C71.7232,3.10625 70.7903,3.5122 70.0638,4.32409 C69.3374,5.13599 68.9742,6.16866 68.9742,7.4221 C68.9742,8.5616 69.3018,9.62276 69.957,10.6056 C70.6122,11.5884 71.6378,12.849 73.0336,14.3873 C74.1731,15.6122 75.0919,16.6663 75.7898,17.5494 C76.4877,18.4325 77.086,19.4509 77.5845,20.6047 C78.083,21.7584 78.3323,23.0047 78.3323,24.3437 C78.3323,26.1668 77.8267,27.8191 76.8153,29.3005 C75.804,30.7818 74.4224,31.9498 72.6704,32.8044 C70.9184,33.659 68.9742,34.0864 66.8376,34.0864 M84.9356,33.5736 C83.5682,33.5736 82.4643,33.1463 81.6239,32.2916 C80.7836,31.437 80.3634,30.1551 80.3634,28.4458 C80.3634,27.7337 80.4773,26.8078 80.7052,25.6683 L83.2691,13.6609 L81.859,13.6609 L82.2008,11.9516 L83.6109,11.9516 L84.8929,6.05471 L91.2171,5.20008 L89.7642,11.9516 L92.3281,11.9516 L91.9863,13.6609 L89.4224,13.6609 L86.6876,26.4802 C86.5736,26.9075 86.5167,27.3633 86.5167,27.8476 C86.5167,28.4174 86.652,28.8233 86.9226,29.0654 C87.1932,29.3076 87.6419,29.4287 88.2686,29.4287 C89.0948,29.4287 89.8639,29.0797 90.5761,28.3817 C91.2883,27.6838 91.8011,26.7793 92.1144,25.6683 L93.9092,25.6683 C92.8551,28.745 91.502,30.8317 89.8497,31.9284 C88.1974,33.0252 86.5594,33.5736 84.9356,33.5736 M97.2168,33.5736 C95.593,33.5736 94.2399,33.0181 93.1574,31.9071 C92.0748,30.7961 91.5336,29.0583 91.5336,26.6939 C91.5336,24.5858 91.9538,22.3709 92.7941,20.0492 C93.6345,17.7274 94.888,15.7618 96.5545,14.1523 C98.221,12.5427 100.208,11.738 102.515,11.738 C103.683,11.738 104.552,11.9374 105.122,12.3362 C105.692,12.735 105.977,13.262 105.977,13.9172 L105.977,14.2164 L106.447,11.9516 L112.6,11.9516 L109.523,26.4802 C109.409,26.9075 109.352,27.3633 109.352,27.8476 C109.352,29.0726 109.936,29.685 111.104,29.685 C111.902,29.685 112.593,29.3147 113.177,28.574 C113.761,27.8334 114.224,26.8648 114.566,25.6683 L116.36,25.6683 C115.306,28.745 114.003,30.8317 112.45,31.9284 C110.898,33.0252 109.338,33.5736 107.771,33.5736 C106.575,33.5736 105.613,33.2389 104.887,32.5694 C104.161,31.8999 103.726,30.9243 103.584,29.6423 C102.758,30.8103 101.839,31.7575 100.828,32.4839 C99.8163,33.2104 98.6127,33.5736 97.2168,33.5736 M99.9943,29.4287 C100.707,29.4287 101.412,29.0939 102.11,28.4245 C102.807,27.755 103.285,26.8363 103.541,25.6683 L105.592,16.0111 C105.592,15.6407 105.45,15.2775 105.165,14.9214 C104.88,14.5653 104.438,14.3873 103.84,14.3873 C102.701,14.3873 101.675,15.0496 100.764,16.3743 C99.8519,17.699 99.1397,19.2943 98.6269,21.1602 C98.1142,23.0261 97.8578,24.6713 97.8578,26.0956 C97.8578,27.52 98.0643,28.4316 98.4774,28.8304 C98.8904,29.2292 99.3961,29.4287 99.9943,29.4287 M117.462,11.9516 L123.615,11.9516 L123.06,14.6009 C124.028,13.7463 124.904,13.0911 125.688,12.6353 C126.471,12.1795 127.319,11.9516 128.23,11.9516 C129.142,11.9516 129.861,12.265 130.388,12.8917 C130.915,13.5184 131.179,14.2733 131.179,15.1564 C131.179,15.9826 130.908,16.709 130.367,17.3357 C129.826,17.9625 129.071,18.2758 128.102,18.2758 C127.475,18.2758 127.055,18.1263 126.842,17.8271 C126.628,17.528 126.464,17.0936 126.35,16.5238 C126.265,16.1535 126.179,15.8829 126.094,15.712 C126.008,15.541 125.852,15.4556 125.624,15.4556 C125.025,15.4556 124.52,15.5766 124.107,15.8188 C123.694,16.0609 123.16,16.4811 122.504,17.0794 L119.086,33.3172 L112.933,33.3172 L117.462,11.9516 M134.631,33.5736 C133.178,33.5736 132.102,33.132 131.404,32.2489 C130.706,31.3658 130.358,30.1978 130.358,28.745 C130.358,28.0043 130.443,27.2494 130.614,26.4802 L133.349,13.6609 L131.939,13.6609 L132.28,11.9516 L133.691,11.9516 L134.972,6.05471 L141.297,5.20008 C141.04,6.28261 140.898,6.92357 140.869,7.12299 C140.67,7.92063 140.328,9.53018 139.844,11.9516 L142.408,11.9516 L142.066,13.6609 L139.502,13.6609 L136.767,26.4802 C136.625,27.1069 136.554,27.6055 136.554,27.9758 C136.554,29.0014 137.052,29.5141 138.049,29.5141 C138.562,29.5141 138.932,29.4714 139.16,29.3859 C138.59,31.0382 137.921,32.1492 137.152,32.719 C136.383,33.2887 135.542,33.5736 134.631,33.5736 M156.773,33.5736 C155.15,33.5736 153.796,33.0181 152.714,31.9071 C151.631,30.7961 151.09,29.0583 151.09,26.6939 C151.09,24.5858 151.51,22.3709 152.351,20.0492 C153.191,17.7274 154.445,15.7618 156.111,14.1523 C157.778,12.5427 159.765,11.738 162.072,11.738 C163.24,11.738 164.109,11.9374 164.679,12.3362 C165.248,12.735 165.533,13.262 165.533,13.9172 L165.533,14.0882 L167.627,4.26 L173.951,3.40537 L169.037,26.4802 C168.923,26.9075 168.866,27.3633 168.866,27.8476 C168.866,28.4174 169.002,28.8233 169.272,29.0654 C169.543,29.3076 169.992,29.4287 170.618,29.4287 C171.416,29.4287 172.107,29.0868 172.691,28.4031 C173.275,27.7194 173.738,26.8078 174.08,25.6683 L175.874,25.6683 C174.136,30.7676 171.273,33.3172 167.285,33.3172 C166.117,33.3172 165.17,33.0038 164.444,32.3771 C163.717,31.7504 163.269,30.8388 163.098,29.6423 C162.357,30.7818 161.467,31.7219 160.427,32.4626 C159.387,33.2033 158.169,33.5736 156.773,33.5736 M159.551,29.4287 C160.235,29.4287 160.925,29.1153 161.623,28.4886 C162.321,27.8619 162.798,26.993 163.055,25.882 L163.055,25.6683 L165.149,15.8829 C164.892,14.8858 164.308,14.3873 163.397,14.3873 C162.257,14.3873 161.232,15.0496 160.32,16.3743 C159.408,17.699 158.696,19.2943 158.184,21.1602 C157.671,23.0261 157.414,24.6713 157.414,26.0956 C157.414,27.52 157.621,28.4316 158.034,28.8304 C158.447,29.2292 158.953,29.4287 159.551,29.4287 M180.19,33.5736 C178.082,33.5736 176.444,33.0252 175.276,31.9284 C174.108,30.8317 173.524,29.1153 173.524,26.7793 C173.524,24.8137 173.909,22.6486 174.678,20.2842 C175.447,17.9197 176.7,15.8758 178.438,14.1523 C180.176,12.4288 182.384,11.567 185.061,11.567 C188.195,11.567 189.762,12.9344 189.762,15.6692 C189.762,17.2645 189.306,18.7316 188.394,20.0705 C187.483,21.4094 186.272,22.4848 184.762,23.2967 C183.252,24.1086 181.643,24.5716 179.934,24.6855 C179.877,25.5401 179.848,26.1099 179.848,26.3947 C179.848,27.7906 180.09,28.7378 180.575,29.2364 C181.059,29.7349 181.842,29.9842 182.925,29.9842 C184.463,29.9842 185.781,29.6281 186.878,28.9159 C187.974,28.2037 189.178,27.1212 190.488,25.6683 L191.941,25.6683 C188.779,30.9385 184.862,33.5736 180.19,33.5736 M180.276,22.6344 C181.33,22.5774 182.334,22.2071 183.288,21.5234 C184.242,20.8397 185.012,19.9708 185.596,18.9168 C186.18,17.8628 186.472,16.7517 186.472,15.5838 C186.472,14.4158 186.115,13.8318 185.403,13.8318 C184.378,13.8318 183.374,14.7291 182.391,16.5238 C181.408,18.3186 180.703,20.3554 180.276,22.6344 M195.342,33.5736 C193.975,33.5736 192.821,33.3101 191.881,32.7831 C190.941,32.256 190.243,31.5723 189.787,30.732 C189.331,29.8916 189.104,29.0156 189.104,28.104 C189.104,27.1639 189.324,26.3449 189.766,25.647 C190.207,24.949 190.742,24.4434 191.368,24.13 C192.479,22.1359 193.448,20.1204 194.274,18.0835 C195.1,16.0467 195.884,13.846 196.624,11.4816 L202.948,10.6269 C203.091,14.2733 203.333,18.2188 203.675,22.4635 C203.817,24.1727 203.889,25.4119 203.889,26.1811 C203.889,26.8363 203.832,27.3776 203.718,27.8049 C205.057,27.0357 206.082,26.3235 206.794,25.6683 L208.589,25.6683 C206.766,27.7764 204.586,29.5569 202.051,31.0097 C201.225,31.8928 200.207,32.5409 198.996,32.954 C197.785,33.3671 196.567,33.5736 195.342,33.5736 M193.975,30.1978 C195.029,30.1978 195.912,29.8845 196.624,29.2577 C197.336,28.631 197.693,27.6197 197.693,26.2238 C197.693,25.3692 197.607,24.1727 197.436,22.6344 C197.151,19.3868 196.966,17.2075 196.881,16.0965 C196.197,18.347 195.043,21.0391 193.419,24.1727 C194.075,24.5146 194.402,25.0131 194.402,25.6683 C194.402,26.2096 194.224,26.6939 193.868,27.1212 C193.512,27.5485 193.063,27.7621 192.522,27.7621 C191.924,27.7621 191.539,27.577 191.368,27.2066 C191.368,28.2322 191.575,28.9871 191.988,29.4714 C192.401,29.9557 193.063,30.1978 193.975,30.1978 M213.898,9.64413 C212.958,9.64413 212.161,9.31652 211.505,8.66131 C210.85,8.0061 210.523,7.20845 210.523,6.26836 C210.523,5.32828 210.85,4.52351 211.505,3.85405 C212.161,3.1846 212.958,2.84987 213.898,2.84987 C214.838,2.84987 215.643,3.1846 216.313,3.85405 C216.982,4.52351 217.317,5.32828 217.317,6.26836 C217.317,7.20845 216.982,8.0061 216.313,8.66131 C215.643,9.31652 214.838,9.64413 213.898,9.64413 M210.993,33.5736 C209.625,33.5736 208.521,33.1463 207.681,32.2916 C206.841,31.437 206.42,30.1551 206.42,28.4458 C206.42,27.7337 206.534,26.8078 206.762,25.6683 L209.668,11.9516 L215.821,11.9516 L212.745,26.4802 C212.631,26.9075 212.574,27.3633 212.574,27.8476 C212.574,28.4174 212.709,28.8233 212.98,29.0654 C213.25,29.3076 213.699,29.4287 214.326,29.4287 C215.152,29.4287 215.921,29.0797 216.633,28.3817 C217.345,27.6838 217.858,26.7793 218.171,25.6683 
              L219.966,25.6683 C218.912,28.745 217.559,30.8317 215.907,31.9284 C214.254,33.0252 212.616,33.5736 210.993,33.5736 M225.709,44 C224.342,44 223.203,43.6439 222.291,42.9317 C221.379,42.2195 220.924,41.194 220.924,39.8551 C220.924,38.2313 221.579,36.928 222.889,35.9452 C224.2,34.9623 225.866,34.1433 227.889,33.4881 L228.402,31.2234 C226.949,32.7902 225.239,33.5736 223.274,33.5736 C221.65,33.5736 220.297,33.0181 219.214,31.9071 C218.132,30.7961 217.591,29.0583 217.591,26.6939 C217.591,24.5858 218.011,22.3709 218.851,20.0492 C219.691,17.7274 220.945,15.7618 222.611,14.1523 C224.278,12.5427 226.265,11.738 228.572,11.738 C229.74,11.738 230.609,11.9374 231.179,12.3362 C231.749,12.735 232.034,13.262 232.034,13.9172 L232.034,14.1736 L232.504,11.9516 L238.657,11.9516 L234.427,31.7789 C235.794,31.3231 236.891,30.6394 237.717,29.7278 C238.543,28.8162 239.241,27.463 239.811,25.6683 L241.605,25.6683 C240.836,28.2037 239.797,30.0625 238.486,31.2447 C237.176,32.427 235.694,33.2317 234.042,33.659 L233.401,36.7357 C232.831,39.499 231.849,41.4005 230.453,42.4403 C229.057,43.4801 227.476,44 225.709,44 M226.051,29.4287 C226.707,29.4287 227.376,29.1295 228.06,28.5313 C228.743,27.9331 229.213,27.1212 229.47,26.0956 L231.649,15.9683 C231.649,15.6265 231.507,15.2775 231.222,14.9214 C230.937,14.5653 230.495,14.3873 229.897,14.3873 C228.758,14.3873 227.732,15.0496 226.82,16.3743 C225.909,17.699 225.197,19.2943 224.684,21.1602 C224.171,23.0261 223.915,24.6713 223.915,26.0956 C223.915,27.52 224.121,28.4316 224.534,28.8304 C224.947,29.2292 225.453,29.4287 226.051,29.4287 M224.727,40.667 C225.211,40.667 225.681,40.3394 226.137,39.6841 C226.593,39.0289 226.949,38.0888 227.205,36.8639 L227.461,35.6247 C224.67,36.6502 223.274,37.861 223.274,39.2568 C223.274,39.6272 223.402,39.9548 223.658,40.2397 C223.915,40.5245 224.271,40.667 224.727,40.667 M254.478,33.5736 C252.968,33.5736 251.872,33.1178 251.188,32.2062 C250.504,31.2946 250.162,30.1408 250.162,28.745 C250.162,28.1467 250.234,27.4701 250.376,26.7152 C250.518,25.9603 250.668,25.2268 250.825,24.5146 C250.981,23.8024 251.088,23.3466 251.145,23.1472 C251.373,22.1501 251.587,21.1673 251.786,20.1987 C251.986,19.2302 252.085,18.4467 252.085,17.8485 C252.085,16.3957 251.573,15.6692 250.547,15.6692 C249.806,15.6692 249.151,16.0324 248.581,16.7589 C248.012,17.4853 247.556,18.4325 247.214,19.6005 L244.308,33.3172 L238.155,33.3172 L242.684,11.9516 L248.838,11.9516 L248.368,14.1736 C249.792,12.5783 251.459,11.7807 253.367,11.7807 C254.82,11.7807 255.974,12.1795 256.828,12.9772 C257.683,13.7748 258.11,14.9855 258.11,16.6093 C258.11,17.4354 258.011,18.3542 257.811,19.3655 C257.612,20.3768 257.327,21.6089 256.957,23.0617 C256.729,23.9448 256.522,24.8066 256.337,25.647 C256.152,26.4873 256.059,27.1497 256.059,27.634 C256.059,28.2037 256.187,28.6453 256.444,28.9586 C256.7,29.272 257.142,29.4287 257.769,29.4287 C258.452,29.4287 258.922,29.3432 259.179,29.1723 C259.008,30.6251 258.488,31.7219 257.619,32.4626 C256.75,33.2033 255.703,33.5736 254.478,33.5736 Z"/>
          }
        </g>
    </g>
</svg>

          <div
            id="search-icon"
            style={{
                height: '43px',
                boxShadow: '0 0 0 1px rgba(14,19,24,.02), 0 2px 8px rgba(14,19,24,.15)',
                padding: '10px 34px',
                marginBottom: '44px',
                backgroundColor: 'white',
                borderRadius: '5px',
                width: '500px',
                margin: 'auto',
                backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath fill='currentColor' d='M15.2 16.34a7.5 7.5 0 1 1 1.38-1.45l4.2 4.2a1 1 0 1 1-1.42 1.41l-4.16-4.16zm-4.7.16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '9px 10px',
              // height: this.state.focusing && '400px',
            }}
            onFocus={() => {this.setState({focusing: true,})}}
            onBlur={
              () => {
                setTimeout(() => { this.setState({focusing: false,})}, 100);
              }
            }
            contentEditable={true}></div>
          {this.state.focusing && 
            <SuggestedList
              translate={this.translate}
            />
          }
          {/* <PopularTemplate 
            translate={this.translate.bind(this)}
          /> */}
          </div>
      </header>
            </div>
          </div>
          </div>
          <div
            style={{
              padding: "0 50px 50px",
            }}
          >
            <h2
              style={{
                marginBottom: '20px',
                marginTop: '20px',
              }}
            >Recent designs</h2>
          {this.state.recentDesign.map(design =>
          <a target="_blank" rel="noopener noreferrer" href={`/editor/design/${design.id}`}>
          <img
            style={{
              height: "200px",
              boxShadow: "0 2px 4px rgba(0,0,0,.08), 0 0 1px rgba(0,0,0,.16)",
              marginRight: "30px",
              borderRadius: "10px",
            }}
            src={design.representative}
          />
          </a> 
          )}
          </div>
          {/* {this.state.mounted && 
            <CatalogList 
              translate={this.translate}
            />
          } */}
      </div>
      <LoginPopup
        locale={this.state.locale}
        translate={this.translate}
        handleUpdateCompleted={this.handleUpdateCompleted} externalProviderCompleted={this.state.externalProviderCompleted} onLoginSuccess={this.handleLoginSuccess} />
      </div>
    );
  }
}


var CC = styled.li`
    position: relative;
    height: 160px;
    margin-right: 16px;
    transition: .3s;
`;

export default withTranslation(NAMESPACE)(HomePage);
