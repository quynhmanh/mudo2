import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Route, Link } from "react-router-dom";
import Globals from "@Globals";
import AccountService from "@Services/AccountService";
import { Helmet } from "react-helmet";
import bind from 'bind-decorator';
import LoginPopup from "@Components/shared/LoginPopup";
import styled from 'styled-components';
import { element } from "prop-types";
import { withTranslation } from "react-i18next";
import languages from "@Locales/languages";
import uuidv4 from "uuid/v4";
import { ILocale } from "@Models/ILocale";
import homePageTranslation from "@Locales/default/homePage";
import loadable from '@loadable/component';

const PopularTemplate = loadable(() => import("@Components/shared/PopularTemplate"))


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
    locale: initLocale
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
    // const nav = document.querySelector('nav');
    const navTop = document.getElementsByTagName("nav")[0].getBoundingClientRect().top;
    this.setState({mounted: true, navTop});
    window.addEventListener('scroll', this.handleScroll);
  }

  @bind
  async onClickSignOut(e: React.MouseEvent<HTMLAnchorElement>) {
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
    document.getElementById("downloadPopup").style.display = "block";
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

isClickOutside = (event, element) => {
  const { clientX, clientY } = event;
  const rect = element.getBoundingClientRect();
  return (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom);
}

onLanguageBtnClick = () => {
  const showLanguageDropdown = !this.state.showLanguageDropdown;
  this.setState({ showLanguageDropdown });

  if (showLanguageDropdown) {
    const onDown = e => {
      const languageDropdown = document.getElementById("language-dropdown");
      const languageBtn = document.getElementById("language-btn");
      if (this.isClickOutside(e, languageDropdown) && this.isClickOutside(e, languageBtn)) {
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
   <g stroke="null" font-weight="700" font-size="72px" font-family="'Brandmark1 Bold'" text-anchor="middle" id="title">
    <path stroke="null" fill="#56aaff" transform="translate(0,365.45123291015625) " d="m4.52583,-318.85031c1.04036,2.24451 2.4275,4.29098 4.23078,6.00737c1.87264,1.71639 3.95335,3.10271 6.31149,4.02692c2.4275,0.99023 5.06306,1.45233 7.69863,1.45233c2.63557,0 5.27114,-0.46211 7.69863,-1.45233c2.35814,-0.92421 4.43885,-2.31053 6.31149,-4.02692c1.80328,-1.71639 3.19042,-3.76286 4.23078,-6.00737c1.04036,-2.31053 1.52586,-4.75308 1.52586,-7.32767l0,-32.0173l-10.40356,-3.30075l0,18.74828c-0.55486,-0.26406 -1.10971,-0.52812 -1.66457,-0.72617c-2.4275,-0.99023 -4.99371,-1.45233 -7.69863,-1.45233c-2.63557,0 -5.27114,0.46211 -7.69863,1.45233c-2.35814,0.92421 -4.43885,2.31053 -6.31149,4.02692c-1.80328,1.71639 -3.19042,3.76286 -4.23078,6.00737c-0.971,2.31053 -1.52586,4.75308 -1.52586,7.26166c0,2.57459 0.55486,5.01714 1.52586,7.32767zm18.2409,-16.2397c5.13242,0 9.3632,4.02692 9.3632,8.91203c0,4.95113 -4.23078,8.91203 -9.3632,8.91203c-5.13242,0 -9.3632,-3.9609 -9.3632,-8.91203c0,-4.88511 4.23078,-8.91203 9.3632,-8.91203z" id="path190399"/>
    <path stroke="null" fill="#56aaff" transform="translate(0,365.45123291015625) " d="m58.15835,-307.8258l0,0l0,-16.2397c0,-6.33745 5.40985,-11.55263 12.13748,-11.55263l0,-9.90226c-3.05171,0 -6.03406,0.59414 -8.80834,1.71639c-2.63557,1.05624 -5.06306,2.6406 -7.14378,4.62105c-2.08071,1.91444 -3.67592,4.22496 -4.85499,6.79955c-1.17907,2.6406 -1.73393,5.41323 -1.73393,8.3179l0,16.2397l10.40356,0z" id="path190401"/>
    <path stroke="null" fill="#56aaff" transform="translate(0,365.45123291015625) " d="m97.54557,-344.99227l0.06936,2.11248c-2.77428,-1.3203 -5.82599,-2.04647 -8.94706,-2.04647c-2.63557,0 -5.27114,0.46211 -7.69863,1.45233c-2.35814,0.99023 -4.43885,2.31053 -6.31149,4.02692c-1.80328,1.71639 -3.19042,3.76286 -4.23078,6.00737c-0.971,2.31053 -1.52586,4.8191 -1.52586,7.32767c0,2.50857 0.55486,5.01714 1.52586,7.32767c1.04036,2.24451 2.4275,4.22496 4.23078,6.00737c1.87264,1.71639 3.95335,3.03669 6.31149,4.02692c2.4275,0.92421 5.06306,1.45233 7.69863,1.45233c3.12107,0 6.17278,-0.72617 8.94706,-2.04647l-0.06936,1.51835l10.40356,0l0,-37.16648l-10.40356,0zm-4.16142,26.53805c-1.38714,0.79218 -3.05171,1.25429 -4.71628,1.25429c-5.13242,0 -9.3632,-4.02692 -9.3632,-8.91203c0,-4.88511 4.23078,-8.91203 9.3632,-8.91203c1.80328,0 3.60657,0.46211 5.06306,1.45233c1.52586,0.8582 2.70492,2.1785 3.3985,3.69684c0.62421,1.18827 0.90164,2.44256 0.90164,3.76286c0,1.58436 -0.41614,3.10271 -1.24843,4.48902c-0.83228,1.3203 -1.942,2.44256 -3.3985,3.16872z" id="path190403"/>
    <path stroke="null" fill="#56aaff" transform="translate(0,365.45123291015625) " d="m124.14507,-344.46415l0,-0.06602c0,-5.74331 4.92435,-10.49639 11.02777,-10.49639l0,-9.90226c-2.913,0 -5.75663,0.59414 -8.3922,1.65038c-2.56621,0.99023 -4.85499,2.44256 -6.79699,4.35699c-1.942,1.84842 -3.53721,4.02692 -4.57757,6.46948c-1.10971,2.50857 -1.66457,5.21519 -1.66457,7.92181l0,36.70437l10.40356,0l0,-27.39625l11.02777,0l0,-9.24211l-11.02777,0z" id="path190405"/>
    <path stroke="null" fill="#56aaff" transform="translate(0,365.45123291015625) " d="m157.99997,-335.35407l0,-9.24211l-11.02777,0l0,-11.81669l-10.40356,3.30075l0,25.61384c0,2.77263 0.55486,5.41323 1.66457,7.92181c1.04036,2.44256 2.63557,4.62105 4.57757,6.46948c1.942,1.91444 4.23078,3.36677 6.79699,4.42301c2.63557,1.05624 5.47921,1.58436 8.3922,1.58436l0,-9.90226c-6.10342,0 -11.02777,-4.68707 -11.02777,-10.49639l0,-7.85579l11.02777,0z" id="path190407"/>
   </g>
   <g stroke="null" font-weight="400" font-size="32px" font-family="Montserrat" text-anchor="middle" id="tagline"/>
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
        // onClick={() => {location.href='/login';}}
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
              height: '446px',
              position: 'absolute',
              width: '100%',  
              backgroundColor: 'rgb(201, 217, 225)',
            }}>
            </div>
            <header 
              style={{
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
                backgroundImage: 'url(https://images.unsplash.com/photo-1493932484895-752d1471eab5?ixlib=rb-1.2.1)',
              }}
            className="offset-header__header u-last-child-margin-bottom-0 u-textAlign-left@medium">
        <div className="h__hero u-color-inherit@medium ">
          <h2
            style={{
                color: 'white', 
                textAlign: 'center',
                fontSize: '50px',
                marginBottom: '25px',
                fontFamily: 'Lobster-Regular',
            }}
          >{this.translate("title-above-search-box")}</h2>
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
          {this.state.focusing && <div
            id="homepage_list"
            style={{
              width: '100%',
              position: 'absolute',
              left: '0',
              marginTop: '1px',
              zIndex: 99999,
            }}
          >
            
      <ul
        style={{
          listStyle: 'none',
          width: '500px',
          margin: 'auto',
          padding: 0,
          backgroundColor: 'white',
          height: '214px',
          overflow: 'scroll',
          borderRadius: '5px',
          boxShadow: '0 0 0 1px rgba(14,19,24,.02), 0 2px 8px rgba(14,19,24,.15)',
        }}
      className="_10KwohWWbzE9k3VxqiINB8 _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88">
        <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
          <ul className="_3iAhdo5irp6o991TKYLo_G _10KwohWWbzE9k3VxqiINB8 _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88" />
        </li>
        <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
          <div className="_1ERFI8bZ2yaDXttvzi0r56">
              <span style={{
                  marginLeft: '5px',
                  fontFamily: 'AvenirNextRoundedPro-Medium',
              }} className="_1ZekmJX88FhNx-izKxyhf7 jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">{this.translate("suggested")}</span>
            </div>
        </li>
        <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
          <ul style={{listStyle: 'none', padding: 0,}} className="_35hMZzDjUCiFAL0T8RAwqY _10KwohWWbzE9k3VxqiINB8 _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88">
            <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
              <div>
                <button onClick={() => {window.open('/templates/poster');}} type="button" className="_2uHN4spVhhwLkZOp3_KMfh _1WAnEU6mBaV9wjYeHOx--- _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2V7dcFfzBz3OPZn8AM3J__ _1LZdP7ackANSqIXYWhI-b1 gfcUZM2lrsYeWQPoFQxBj">
                  <div className="_2Wf-SlnxpiKP9h4IkWZoDa"><span className="_2EGWQBRVP2StSe2iTvRlDw"><img src="images/cTgIK8jqHEubjih9549hAw.svg" className="_3vRw2O1Xs0IY3kcnmLCS7O" /></span><span className="_2bF18d7VlTkz11DmN_PXUM"><div className="_1pq0UtmsEXODMd3J-_HjDh"><span className="_2bXdXf_GqdFQVMmOz0A8L8">{this.translate("poster")}</span><span className="GFAL_CbltoeGbTj3MVtfx jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">42 × 59.4 cm</span></div>
                    </span>
                  </div>
                </button>
              </div>
            </li>
            <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
              <div>
                <button onClick={() => {window.open('/templates/logo');}} type="button" className="_2uHN4spVhhwLkZOp3_KMfh _1WAnEU6mBaV9wjYeHOx--- _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2V7dcFfzBz3OPZn8AM3J__ _1LZdP7ackANSqIXYWhI-b1">
                  <div className="_2Wf-SlnxpiKP9h4IkWZoDa"><span className="_2EGWQBRVP2StSe2iTvRlDw"><img src="images/eIRfvcnuuEKn2QGfvVGOqQ.svg" className="_3vRw2O1Xs0IY3kcnmLCS7O" /></span><span className="_2bF18d7VlTkz11DmN_PXUM"><div className="_1pq0UtmsEXODMd3J-_HjDh"><span className="_2bXdXf_GqdFQVMmOz0A8L8">{this.translate("logo")}</span><span className="GFAL_CbltoeGbTj3MVtfx jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">500 × 500 px</span></div>
                    </span>
                  </div>
                </button>
              </div>
            </li>
            <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
              <div>
                <button onClick={() => {window.open('/templates/brochures');}} type="button" className="_2uHN4spVhhwLkZOp3_KMfh _1WAnEU6mBaV9wjYeHOx--- _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2V7dcFfzBz3OPZn8AM3J__ _1LZdP7ackANSqIXYWhI-b1">
                  <div className="_2Wf-SlnxpiKP9h4IkWZoDa"><span className="_2EGWQBRVP2StSe2iTvRlDw"><img src="images/owdn5oxp2UG8OjFOrxcFQ.svg" className="_3vRw2O1Xs0IY3kcnmLCS7O" /></span><span className="_2bF18d7VlTkz11DmN_PXUM"><div className="_1pq0UtmsEXODMd3J-_HjDh"><span className="_2bXdXf_GqdFQVMmOz0A8L8">{this.translate("brochures")}</span><span className="GFAL_CbltoeGbTj3MVtfx jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">1920 × 1080 px</span></div>
                    </span>
                  </div>
                </button>
              </div>
            </li>
            <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
              <div>
                <button onClick={() => {window.open('/templates/flyers');}} type="button" className="_2uHN4spVhhwLkZOp3_KMfh _1WAnEU6mBaV9wjYeHOx--- _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2V7dcFfzBz3OPZn8AM3J__ _1LZdP7ackANSqIXYWhI-b1">
                  <div className="_2Wf-SlnxpiKP9h4IkWZoDa"><span className="_2EGWQBRVP2StSe2iTvRlDw"><img src="images/2RswVAz1kORIR98Y7DdA.svg" className="_3vRw2O1Xs0IY3kcnmLCS7O" /></span><span className="_2bF18d7VlTkz11DmN_PXUM"><div className="_1pq0UtmsEXODMd3J-_HjDh"><span className="_2bXdXf_GqdFQVMmOz0A8L8">{this.translate("flyer")}</span><span className="GFAL_CbltoeGbTj3MVtfx jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">210 × 297 mm</span></div>
                    </span>
                  </div>
                </button>
              </div>
            </li>
            {/* <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
              <div>
                <button type="button" className="_2uHN4spVhhwLkZOp3_KMfh _1WAnEU6mBaV9wjYeHOx--- _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2V7dcFfzBz3OPZn8AM3J__ _1LZdP7ackANSqIXYWhI-b1">
                  <div className="_2Wf-SlnxpiKP9h4IkWZoDa"><span className="_2EGWQBRVP2StSe2iTvRlDw"><img src="https://static.canva.com/category/icons/Card.svg" className="_3vRw2O1Xs0IY3kcnmLCS7O" /></span><span className="_2bF18d7VlTkz11DmN_PXUM"><div className="_1pq0UtmsEXODMd3J-_HjDh"><span className="_2bXdXf_GqdFQVMmOz0A8L8">Thẻ</span><span className="GFAL_CbltoeGbTj3MVtfx jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">14.8 × 10.5 cm</span></div>
                    </span>
                  </div>
                </button>
              </div>
            </li>
            <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
              <div>
                <button type="button" className="_2uHN4spVhhwLkZOp3_KMfh _1WAnEU6mBaV9wjYeHOx--- _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2V7dcFfzBz3OPZn8AM3J__ _1LZdP7ackANSqIXYWhI-b1">
                  <div className="_2Wf-SlnxpiKP9h4IkWZoDa"><span className="_2EGWQBRVP2StSe2iTvRlDw"><img src="https://static.canva.com/category/icons/noun_1034191.svg" className="_3vRw2O1Xs0IY3kcnmLCS7O" /></span><span className="_2bF18d7VlTkz11DmN_PXUM"><div className="_1pq0UtmsEXODMd3J-_HjDh"><span className="_2bXdXf_GqdFQVMmOz0A8L8">A4 Tài liệu</span><span className="GFAL_CbltoeGbTj3MVtfx jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">21 × 29.7 cm</span></div>
                    </span>
                  </div>
                </button>
              </div>
            </li> */}
            {/* <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
              <div>
                <button type="button" className="_2uHN4spVhhwLkZOp3_KMfh _1WAnEU6mBaV9wjYeHOx--- _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2V7dcFfzBz3OPZn8AM3J__ _1LZdP7ackANSqIXYWhI-b1">
                  <div className="_2Wf-SlnxpiKP9h4IkWZoDa"><span className="_2EGWQBRVP2StSe2iTvRlDw"><img src="https://static.canva.com/category/icons/noun_1563397.svg" className="_3vRw2O1Xs0IY3kcnmLCS7O" /></span><span className="_2bF18d7VlTkz11DmN_PXUM"><div className="_1pq0UtmsEXODMd3J-_HjDh"><span className="_2bXdXf_GqdFQVMmOz0A8L8">Thiết kế đồ hoạ thông tin (Infographic)</span><span className="GFAL_CbltoeGbTj3MVtfx jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">800 × 2000 px</span></div>
                    </span>
                  </div>
                </button>
              </div>
            </li> */}
            <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
              <div>
                <button onClick={() => {window.open('/templates/business-cards');}} type="button" className="_2uHN4spVhhwLkZOp3_KMfh _1WAnEU6mBaV9wjYeHOx--- _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2V7dcFfzBz3OPZn8AM3J__ _1LZdP7ackANSqIXYWhI-b1">
                  <div className="_2Wf-SlnxpiKP9h4IkWZoDa"><span className="_2EGWQBRVP2StSe2iTvRlDw"><img src="images/kPsZvFiQTEGq3asTsPBNHg.svg" className="_3vRw2O1Xs0IY3kcnmLCS7O" /></span><span className="_2bF18d7VlTkz11DmN_PXUM"><div className="_1pq0UtmsEXODMd3J-_HjDh"><span className="_2bXdXf_GqdFQVMmOz0A8L8">{this.translate("business-card")}</span><span className="GFAL_CbltoeGbTj3MVtfx jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">8.5 × 5 cm</span></div>
                    </span>
                  </div>
                </button>
              </div>
            </li>
            {/* <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
              <div>
                <button type="button" className="_2uHN4spVhhwLkZOp3_KMfh _1WAnEU6mBaV9wjYeHOx--- _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2V7dcFfzBz3OPZn8AM3J__ _1LZdP7ackANSqIXYWhI-b1">
                  <div className="_2Wf-SlnxpiKP9h4IkWZoDa"><span className="_2EGWQBRVP2StSe2iTvRlDw"><img src="https://static.canva.com/category/icons/noun_1182832.svg" className="_3vRw2O1Xs0IY3kcnmLCS7O" /></span><span className="_2bF18d7VlTkz11DmN_PXUM"><div className="_1pq0UtmsEXODMd3J-_HjDh"><span className="_2bXdXf_GqdFQVMmOz0A8L8">Lý lịch cá nhân</span><span className="GFAL_CbltoeGbTj3MVtfx jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">21 × 29.7 cm</span></div>
                    </span>
                  </div>
                </button>
              </div>
            </li> */}
            <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
              <div>
                <button onClick={() => {window.open('/templates/postcards');}} type="button" className="_2uHN4spVhhwLkZOp3_KMfh _1WAnEU6mBaV9wjYeHOx--- _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2V7dcFfzBz3OPZn8AM3J__ _1LZdP7ackANSqIXYWhI-b1">
                  <div className="_2Wf-SlnxpiKP9h4IkWZoDa"><span className="_2EGWQBRVP2StSe2iTvRlDw"><img src="images/JGzOwEpLlkSGGHMaLuGagA.svg" className="_3vRw2O1Xs0IY3kcnmLCS7O" /></span><span className="_2bF18d7VlTkz11DmN_PXUM"><div className="_1pq0UtmsEXODMd3J-_HjDh"><span className="_2bXdXf_GqdFQVMmOz0A8L8">{this.translate("post-card")}</span><span className="GFAL_CbltoeGbTj3MVtfx jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">148 × 105 mm</span></div>
                    </span>
                  </div>
                </button>
              </div>
            </li>
            <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
              <div>
                <button onClick={() => {window.open('/templates/resume');}} type="button" className="_2uHN4spVhhwLkZOp3_KMfh _1WAnEU6mBaV9wjYeHOx--- _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2V7dcFfzBz3OPZn8AM3J__ _1LZdP7ackANSqIXYWhI-b1">
                  <div className="_2Wf-SlnxpiKP9h4IkWZoDa"><span className="_2EGWQBRVP2StSe2iTvRlDw"><img src="images/xZv5tdDLc0OpQkBnGLJ8ag.svg" className="_3vRw2O1Xs0IY3kcnmLCS7O" /></span><span className="_2bF18d7VlTkz11DmN_PXUM"><div className="_1pq0UtmsEXODMd3J-_HjDh"><span className="_2bXdXf_GqdFQVMmOz0A8L8">{this.translate("resume")}</span><span className="GFAL_CbltoeGbTj3MVtfx jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">148 × 105 mm</span></div>
                    </span>
                  </div>
                </button>
              </div>
            </li>
            {/* <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
              <div>
                <button type="button" className="_2uHN4spVhhwLkZOp3_KMfh _1WAnEU6mBaV9wjYeHOx--- _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2V7dcFfzBz3OPZn8AM3J__ _1LZdP7ackANSqIXYWhI-b1">
                  <div className="_2Wf-SlnxpiKP9h4IkWZoDa"><span className="_2EGWQBRVP2StSe2iTvRlDw"><span className="_3K8w6l0jetB1VHftQo2qK6 _3riOXmq8mfDI5UGnLrweQh"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2zm0 1.5a.5.5 0 0 0-.5.5v14c0 .28.22.5.5.5h14a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5H5zm5.75 10.1l3.05-4.15a2 2 0 0 1 3.22-.01L21 15.78V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-.09l3.82-5.25a2 2 0 0 1 3.22 0l.7.95zm3.6 4.9H19a.5.5 0 0 0 .5-.5v-2.72l-3.69-4.94a.5.5 0 0 0-.8 0l-3.33 4.53 2.68 3.63zm-5.51-4.96a.5.5 0 0 0-.81 0l-3.44 4.74a.5.5 0 0 0 .41.22h7.5l-3.66-4.96zM8.5 10a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" /></svg></span></span><span className="_2bF18d7VlTkz11DmN_PXUM"><div className="_1pq0UtmsEXODMd3J-_HjDh"><span className="_2bXdXf_GqdFQVMmOz0A8L8">Custom dimensions</span></div>
                    </span>
                  </div>
                </button>
              </div>
            </li> */}
          </ul>
        </li>
        <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
          <ul className="_3ojNQJCHMpm1Q_3Zp_wYzn _10KwohWWbzE9k3VxqiINB8 _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88" />
        </li>
      </ul>
          </div>}
          <PopularTemplate 
            translate={this.translate.bind(this)}
          />
          </div>
      </header>
            </div>
          </div>
          </div>
          <h2 
            style={{
                margin: 0,
                padding: '30px', 
                textAlign: 'center', 
                fontFamily: 'AvenirNextRoundedPro-Medium',
                background: '#f4f4f6',
            }}>{this.translate("create-a-design")}</h2>
          <div
          id="hello-world"
          style={{
            // boxShadow: '0 1px 8px rgba(38,49,71,.08)',
            background: '#f4f4f6',
        }}>
          <div style={{padding: 0,}} className="container">
          <nav 
            // style={{
            //     boxShadow: '0 1px 8px rgba(38,49,71,.08)',
            // }}
            className="">
          <ul style={{
            listStyle: 'none',
            display: 'flex',
            margin: 0,
            padding: 0,
            borderBottom: '1px solid #e0e2e7',
          }}>
          <li
            style={{
                height: '100%',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px 0px',
                transition: 'all 0.3s ease-in',
                cursor: 'pointer',
                marginRight: '20px',
            }}
          >
            <button 
            className="button-list"
            style={{
                borderRadius: '4px',
                border: 'none',
                fontFamily: 'AvenirNextRoundedPro-Medium',
                background: 'none',
            }}>
              {this.translate("social-network")}
              </button>
        </li>
          <li style={{
                height: '100%',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px 0px',
                transition: 'all 0.3s ease-in',
                cursor: 'pointer',
                marginRight: '20px',
            }}>
                <button 
                className="button-list"
                style={{
                    borderRadius: '4px',
                    border: 'none',
                    fontFamily: 'AvenirNextRoundedPro-Medium',
                    background: 'none',
                }}>
                    {this.translate("discount")}
                </button>
        </li>
          <li style={{
                height: '100%',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px 0px',
                transition: 'all 0.3s ease-in',
                cursor: 'pointer',
                marginRight: '20px',
            }}><button 
            className="button-list"
            style={{
                borderRadius: '4px',
                border: 'none',
                fontFamily: 'AvenirNextRoundedPro-Medium',
                background: 'none',
            }}>
                {this.translate("office")}
            </button></li>
          <li style={{
                height: '100%',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px 0px',
                transition: 'all 0.3s ease-in',
                cursor: 'pointer',
                marginRight: '20px',
            }}><button 
            className="button-list"
            style={{
                borderRadius: '4px',
                border: 'none',
                fontFamily: 'AvenirNextRoundedPro-Medium',
                background: 'none',
            }}>
                {this.translate("web")}
            </button></li>
          <li style={{
                height: '100%',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px 0px',
                transition: 'all 0.3s ease-in',
                cursor: 'pointer',
                marginRight: '20px',
            }}><button 
            className="button-list"
            style={{
                borderRadius: '4px',
                border: 'none',
                fontFamily: 'AvenirNextRoundedPro-Medium',
                background: 'none',
            }}>
                {this.translate("individual")}
            </button></li>
          <li style={{
                height: '100%',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px 0px',
                transition: 'all 0.3s ease-in',
                cursor: 'pointer',
                marginRight: '20px',
            }}><button 
            className="button-list"
            style={{
                borderRadius: '4px',
                border: 'none',
                fontFamily: 'AvenirNextRoundedPro-Medium',
                background: 'none',
            }}>
                {this.translate("video")}
            </button></li>
          </ul>
          </nav>
          </div>
          </div>
          <div id="main-container" style={{
            background: '#f4f4f6',
          }}>
      <section 
        className="container"
        style={{
          padding: '30px 0',
        }}>
      <div 
      // className="container"
      >
        <div>
        <div className="_30p__PONPi-YqVEVlgnN_6"
                style={{
                    padding: '0px',
                }}
            >
        <h4>{this.translate("fitAllSocialMedia")}</h4>

    {this.state.mounted && <div className="-ePYCIKwmKaSsQTHX72YG putVYyFpLWTsqziLXPxhR">
        <div className="_3PK-lmKzpAGcI8WTdBQX4i">
            <div className="_1sza4uX0yqDVxS7xsxMj-L" style={{transform: 'translateX(0px)', marginLeft: '-16px'}}>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPlT3nYM/3/0/thumbnail_large.jpg" alt="Mạng xã hội" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Mạng xã hội">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>{this.translate("socialMedia")}</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MAC7nvfeo9g/5/0/thumbnail_large.jpg" alt="Thuyết trình" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Presentation">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>{this.translate("presentation")}</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPpWR6AM/4/0/thumbnail_large.jpg" alt="Áp phích" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Poster">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>{this.translate("poster")}</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <div className="_1e9RJ140GkyvDh6KOo5VX6 _3olv_1czQo3hEv28-Bjg7P" style={{display: 'none', top: 'calc(calc(50% - 20px) + -20px)', right: '-24px'}}><span className="_1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh _3afRAIYF_d3AMkQFT_AuCI"><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16"><path fill="currentColor" d="M6.47 4.29l3.54 3.53c.1.1.1.26 0 .36L6.47 11.7a.75.75 0 1 0 1.06 1.06l3.54-3.53c.68-.69.68-1.8 0-2.48L7.53 3.23a.75.75 0 0 0-1.06 1.06z" /></svg></span></div>
    </div>}
    <h4>Facebook</h4>
    {this.state.mounted && <div className="-ePYCIKwmKaSsQTHX72YG putVYyFpLWTsqziLXPxhR">
        <div className="_3PK-lmKzpAGcI8WTdBQX4i">
            <div className="_1sza4uX0yqDVxS7xsxMj-L" style={{transform: 'translateX(0px)', marginLeft: '-16px'}}>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPlT3nYM/3/0/thumbnail_large.jpg" alt="Mạng xã hội" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Mạng xã hội">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>{this.translate("socialMedia")}</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MAC7nvfeo9g/5/0/thumbnail_large.jpg" alt="Thuyết trình" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Presentation">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>{this.translate("presentation")}</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPpWR6AM/4/0/thumbnail_large.jpg" alt="Áp phích" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Poster">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>{this.translate("poster")}</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <div className="_1e9RJ140GkyvDh6KOo5VX6 _3olv_1czQo3hEv28-Bjg7P" style={{display: 'none', top: 'calc(calc(50% - 20px) + -20px)', right: '-24px'}}><span className="_1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh _3afRAIYF_d3AMkQFT_AuCI"><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16"><path fill="currentColor" d="M6.47 4.29l3.54 3.53c.1.1.1.26 0 .36L6.47 11.7a.75.75 0 1 0 1.06 1.06l3.54-3.53c.68-.69.68-1.8 0-2.48L7.53 3.23a.75.75 0 0 0-1.06 1.06z" /></svg></span></div>
    </div>}
    <h4>Instagram</h4>
    {this.state.mounted && <div className="-ePYCIKwmKaSsQTHX72YG putVYyFpLWTsqziLXPxhR">
        <div className="_3PK-lmKzpAGcI8WTdBQX4i">
            <div className="_1sza4uX0yqDVxS7xsxMj-L" style={{transform: 'translateX(0px)', marginLeft: '-16px'}}>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPlT3nYM/3/0/thumbnail_large.jpg" alt="Mạng xã hội" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Mạng xã hội">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>{this.translate("socialMedia")}</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MAC7nvfeo9g/5/0/thumbnail_large.jpg" alt="Thuyết trình" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Presentation">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>{this.translate("presentation")}</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPpWR6AM/4/0/thumbnail_large.jpg" alt="Áp phích" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Poster">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>{this.translate("poster")}</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <div className="_1e9RJ140GkyvDh6KOo5VX6 _3olv_1czQo3hEv28-Bjg7P" style={{display: 'none', top: 'calc(calc(50% - 20px) + -20px)', right: '-24px'}}><span className="_1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh _3afRAIYF_d3AMkQFT_AuCI"><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16"><path fill="currentColor" d="M6.47 4.29l3.54 3.53c.1.1.1.26 0 .36L6.47 11.7a.75.75 0 1 0 1.06 1.06l3.54-3.53c.68-.69.68-1.8 0-2.48L7.53 3.23a.75.75 0 0 0-1.06 1.06z" /></svg></span></div>
    </div>}
    <h4>Twitter</h4>
    {this.state.mounted && <div className="-ePYCIKwmKaSsQTHX72YG putVYyFpLWTsqziLXPxhR">
        <div className="_3PK-lmKzpAGcI8WTdBQX4i">
            <div className="_1sza4uX0yqDVxS7xsxMj-L" style={{transform: 'translateX(0px)', marginLeft: '-16px'}}>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPlT3nYM/3/0/thumbnail_large.jpg" alt="Mạng xã hội" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Mạng xã hội">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>{this.translate("socialMedia")}</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MAC7nvfeo9g/5/0/thumbnail_large.jpg" alt="Thuyết trình" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Presentation">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>{this.translate("presentation")}</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPpWR6AM/4/0/thumbnail_large.jpg" alt="Áp phích" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Poster">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>{this.translate("poster")}</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <div className="_1e9RJ140GkyvDh6KOo5VX6 _3olv_1czQo3hEv28-Bjg7P" style={{display: 'none', top: 'calc(calc(50% - 20px) + -20px)', right: '-24px'}}><span className="_1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh _3afRAIYF_d3AMkQFT_AuCI"><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16"><path fill="currentColor" d="M6.47 4.29l3.54 3.53c.1.1.1.26 0 .36L6.47 11.7a.75.75 0 1 0 1.06 1.06l3.54-3.53c.68-.69.68-1.8 0-2.48L7.53 3.23a.75.75 0 0 0-1.06 1.06z" /></svg></span></div>
    </div>}
    <h4>{this.translate("otherSocialMedia")}</h4>
    {this.state.mounted && <div className="-ePYCIKwmKaSsQTHX72YG putVYyFpLWTsqziLXPxhR">
        <div className="_3PK-lmKzpAGcI8WTdBQX4i">
            <div className="_1sza4uX0yqDVxS7xsxMj-L" style={{transform: 'translateX(0px)', marginLeft: '-16px'}}>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPlT3nYM/3/0/thumbnail_large.jpg" alt="Mạng xã hội" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Mạng xã hội">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>{this.translate("socialMedia")}</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MAC7nvfeo9g/5/0/thumbnail_large.jpg" alt="Thuyết trình" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Presentation">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>{this.translate("presentation")}</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPpWR6AM/4/0/thumbnail_large.jpg" alt="Áp phích" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Poster">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>{this.translate("poster")}</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <div className="_1e9RJ140GkyvDh6KOo5VX6 _3olv_1czQo3hEv28-Bjg7P" style={{display: 'none', top: 'calc(calc(50% - 20px) + -20px)', right: '-24px'}}><span className="_1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh _3afRAIYF_d3AMkQFT_AuCI"><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16"><path fill="currentColor" d="M6.47 4.29l3.54 3.53c.1.1.1.26 0 .36L6.47 11.7a.75.75 0 1 0 1.06 1.06l3.54-3.53c.68-.69.68-1.8 0-2.48L7.53 3.23a.75.75 0 0 0-1.06 1.06z" /></svg></span></div>
    </div>}
    <h4>{this.translate("onlineMarketing")}</h4>
    {this.state.mounted && <div className="-ePYCIKwmKaSsQTHX72YG putVYyFpLWTsqziLXPxhR">
        <div className="_3PK-lmKzpAGcI8WTdBQX4i">
            <div className="_1sza4uX0yqDVxS7xsxMj-L" style={{transform: 'translateX(0px)', marginLeft: '-16px'}}>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPlT3nYM/3/0/thumbnail_large.jpg" alt="Mạng xã hội" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Mạng xã hội">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>{this.translate("socialMedia")}</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MAC7nvfeo9g/5/0/thumbnail_large.jpg" alt="Thuyết trình" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Presentation">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>{this.translate("presentation")}</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/editor/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" >
                            <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                                <div className="_1IeZR-KFbU_ixJO0DOAKpv"><img className="_3o3qNO09RZSy4GD3c_VsI8" crossOrigin="anonymous" src="https://media-public.canva.com/MADOPpWR6AM/4/0/thumbnail_large.jpg" alt="Áp phích" /></div>
                            </div>
                        </div>
                        <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                            <div className="_2_AI1Qtuteq5eFV-UJKpRD" title="Poster">
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>{this.translate("poster")}</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <div className="_1e9RJ140GkyvDh6KOo5VX6 _3olv_1czQo3hEv28-Bjg7P" style={{display: 'none', top: 'calc(calc(50% - 20px) + -20px)', right: '-24px'}}><span className="_1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh _3afRAIYF_d3AMkQFT_AuCI"><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16"><path fill="currentColor" d="M6.47 4.29l3.54 3.53c.1.1.1.26 0 .36L6.47 11.7a.75.75 0 1 0 1.06 1.06l3.54-3.53c.68-.69.68-1.8 0-2.48L7.53 3.23a.75.75 0 0 0-1.06 1.06z" /></svg></span></div>
    </div>}
    <div>
    </div>
        </div>
        </div>
      </div>
      </section>
      </div>
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
