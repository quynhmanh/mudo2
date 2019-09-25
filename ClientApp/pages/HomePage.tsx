import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Route, Link } from "react-router-dom";
import Globals from "@Globals";
import AccountService from "@Services/AccountService";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import TopMenu from "@Components/shared/TopMenu";

type Props = RouteComponentProps<{}>;

export interface IProps {}

interface IState {
  tab: string;
  focusing: boolean;
  mounted: boolean;
  navTop: number;
}


const Breadcrumbs = () => <Route path="*" render={props => {
  let parts = props.location.pathname.split("/");
  const place = parts[parts.length-1];
  parts = parts.slice(1, parts.length-1);
  return <p>{parts.map(crumb)}/{place}</p>}} />

const crumb = (part, partIndex, parts) => {
      const path = ['', ...parts.slice(0, partIndex+1)].join("/");
      return <Link key={path} to={path} >{part}</Link>}

export default class HomePage extends React.Component<IProps, IState> {
  state = {
    tab: "find",
    focusing: false,
    mounted: false,
    navTop: 0,
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const nav = document.querySelector('nav');
    const navTop = nav.offsetTop;
    this.setState({mounted: true, navTop});
    window.addEventListener('scroll', this.handleScroll);
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
  console.log('handleScroll')
  const nav = document.querySelector('nav');
  const navTop = this.state.navTop;
  if (window.scrollY > navTop) {
    nav.classList.add('fixed-nav');
    document.body.style.paddingTop = nav.offsetHeight+'px';
  } else {
    nav.classList.remove('fixed-nav');
    document.body.style.paddingTop = "0px";
  }
}

  render() {
    const loggedIn = Globals.serviceUser && Globals.serviceUser.username !== undefined;

    console.log('user ', Globals.serviceUser);

    return (
      <div>
        <Helmet>
          <title>Draft website thiết kế mọi thứ</title>
        </Helmet>
        <div
        style={{
          boxShadow: '0 1px 8px rgba(38,49,71,.08)',
        }}>
          <div
            className="container"
            style={{
              padding: '10px',
            }}
          >
            <h1 style={{margin: 0, fontSize: '24px',}}>draft.vn</h1>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            position: "relative",
            background: 'rgba(244, 244, 246, 0.58)',
          }}
        >
            <div className="container">
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '250px',
            }}
          >
            <div 
            // className="container" 
            style={{height: '100%',
              borderRadius: '10px',
              backgroundSize: 'cover',
            }}>
            <header 
              style={{
                position: 'relative',
                top: '35%',
                marginTop: 'auto',
                marginBottom: 'auto',
                transform: 'translateY(-50%)',
              }}
            className="offset-header__header u-last-child-margin-bottom-0 u-textAlign-left@medium">
        <div className="h__hero u-color-inherit@medium ">
          <h2
            style={{
              textAlign: 'center',
              fontSize: '55px',
              marginBottom: '25px',
              fontFamily: 'AvenirNextRoundedPro-Medium',
            }}
          >Thiết kế mọi thứ</h2>
          <div
            id="search-icon"
            style={{
              boxShadow: '0 0 0 1px rgba(14,19,24,.02), 0 2px 3px rgba(14,19,24,.15)',
              padding: '10px 34px',
              marginBottom: '44px',
              backgroundColor: 'white',
              borderRadius: '5px',
              width: '450px',
              margin: 'auto',
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
              marginLeft: '-20px',
            }}
          >
            
      <ul
        style={{
          listStyle: 'none',
          width: '450px',
          margin: 'auto',
          padding: 0,
          backgroundColor: 'white',
          height: '214px',
          overflow: 'scroll',
          borderRadius: '5px',
        }}
      className="_10KwohWWbzE9k3VxqiINB8 _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88">
        <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
          <ul className="_3iAhdo5irp6o991TKYLo_G _10KwohWWbzE9k3VxqiINB8 _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88" />
        </li>
        <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
          <div className="_1ERFI8bZ2yaDXttvzi0r56"><span className="_1ZekmJX88FhNx-izKxyhf7 jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">Gợi ý</span></div>
        </li>
        <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
          <ul style={{listStyle: 'none', padding: 0,}} className="_35hMZzDjUCiFAL0T8RAwqY _10KwohWWbzE9k3VxqiINB8 _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88">
            <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
              <div>
                <button onClick={() => {window.open('/templates/poster');}} type="button" className="_2uHN4spVhhwLkZOp3_KMfh _1WAnEU6mBaV9wjYeHOx--- _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2V7dcFfzBz3OPZn8AM3J__ _1LZdP7ackANSqIXYWhI-b1 gfcUZM2lrsYeWQPoFQxBj">
                  <div className="_2Wf-SlnxpiKP9h4IkWZoDa"><span className="_2EGWQBRVP2StSe2iTvRlDw"><img src="images/cTgIK8jqHEubjih9549hAw.svg" className="_3vRw2O1Xs0IY3kcnmLCS7O" /></span><span className="_2bF18d7VlTkz11DmN_PXUM"><div className="_1pq0UtmsEXODMd3J-_HjDh"><span className="_2bXdXf_GqdFQVMmOz0A8L8">Áp phích</span><span className="GFAL_CbltoeGbTj3MVtfx jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">42 × 59.4 cm</span></div>
                    </span>
                  </div>
                </button>
              </div>
            </li>
            <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
              <div>
                <button onClick={() => {window.open('/templates/logo');}} type="button" className="_2uHN4spVhhwLkZOp3_KMfh _1WAnEU6mBaV9wjYeHOx--- _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2V7dcFfzBz3OPZn8AM3J__ _1LZdP7ackANSqIXYWhI-b1">
                  <div className="_2Wf-SlnxpiKP9h4IkWZoDa"><span className="_2EGWQBRVP2StSe2iTvRlDw"><img src="images/eIRfvcnuuEKn2QGfvVGOqQ.svg" className="_3vRw2O1Xs0IY3kcnmLCS7O" /></span><span className="_2bF18d7VlTkz11DmN_PXUM"><div className="_1pq0UtmsEXODMd3J-_HjDh"><span className="_2bXdXf_GqdFQVMmOz0A8L8">Logo</span><span className="GFAL_CbltoeGbTj3MVtfx jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">500 × 500 px</span></div>
                    </span>
                  </div>
                </button>
              </div>
            </li>
            <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
              <div>
                <button onClick={() => {window.open('/templates/brochures');}} type="button" className="_2uHN4spVhhwLkZOp3_KMfh _1WAnEU6mBaV9wjYeHOx--- _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2V7dcFfzBz3OPZn8AM3J__ _1LZdP7ackANSqIXYWhI-b1">
                  <div className="_2Wf-SlnxpiKP9h4IkWZoDa"><span className="_2EGWQBRVP2StSe2iTvRlDw"><img src="images/owdn5oxp2UG8OjFOrxcFQ.svg" className="_3vRw2O1Xs0IY3kcnmLCS7O" /></span><span className="_2bF18d7VlTkz11DmN_PXUM"><div className="_1pq0UtmsEXODMd3J-_HjDh"><span className="_2bXdXf_GqdFQVMmOz0A8L8">Tờ gấp (brochures)</span><span className="GFAL_CbltoeGbTj3MVtfx jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">1920 × 1080 px</span></div>
                    </span>
                  </div>
                </button>
              </div>
            </li>
            <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
              <div>
                <button onClick={() => {window.open('/templates/flyers');}} type="button" className="_2uHN4spVhhwLkZOp3_KMfh _1WAnEU6mBaV9wjYeHOx--- _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2V7dcFfzBz3OPZn8AM3J__ _1LZdP7ackANSqIXYWhI-b1">
                  <div className="_2Wf-SlnxpiKP9h4IkWZoDa"><span className="_2EGWQBRVP2StSe2iTvRlDw"><img src="images/2RswVAz1kORIR98Y7DdA.svg" className="_3vRw2O1Xs0IY3kcnmLCS7O" /></span><span className="_2bF18d7VlTkz11DmN_PXUM"><div className="_1pq0UtmsEXODMd3J-_HjDh"><span className="_2bXdXf_GqdFQVMmOz0A8L8">Tờ rơi</span><span className="GFAL_CbltoeGbTj3MVtfx jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">210 × 297 mm</span></div>
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
                  <div className="_2Wf-SlnxpiKP9h4IkWZoDa"><span className="_2EGWQBRVP2StSe2iTvRlDw"><img src="images/kPsZvFiQTEGq3asTsPBNHg.svg" className="_3vRw2O1Xs0IY3kcnmLCS7O" /></span><span className="_2bF18d7VlTkz11DmN_PXUM"><div className="_1pq0UtmsEXODMd3J-_HjDh"><span className="_2bXdXf_GqdFQVMmOz0A8L8">Danh thiếp</span><span className="GFAL_CbltoeGbTj3MVtfx jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">8.5 × 5 cm</span></div>
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
                  <div className="_2Wf-SlnxpiKP9h4IkWZoDa"><span className="_2EGWQBRVP2StSe2iTvRlDw"><img src="images/JGzOwEpLlkSGGHMaLuGagA.svg" className="_3vRw2O1Xs0IY3kcnmLCS7O" /></span><span className="_2bF18d7VlTkz11DmN_PXUM"><div className="_1pq0UtmsEXODMd3J-_HjDh"><span className="_2bXdXf_GqdFQVMmOz0A8L8">Bưu thiếp</span><span className="GFAL_CbltoeGbTj3MVtfx jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">148 × 105 mm</span></div>
                    </span>
                  </div>
                </button>
              </div>
            </li>
            <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
              <div>
                <button onClick={() => {window.open('/templates/resume');}} type="button" className="_2uHN4spVhhwLkZOp3_KMfh _1WAnEU6mBaV9wjYeHOx--- _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2V7dcFfzBz3OPZn8AM3J__ _1LZdP7ackANSqIXYWhI-b1">
                  <div className="_2Wf-SlnxpiKP9h4IkWZoDa"><span className="_2EGWQBRVP2StSe2iTvRlDw"><img src="images/xZv5tdDLc0OpQkBnGLJ8ag.svg" className="_3vRw2O1Xs0IY3kcnmLCS7O" /></span><span className="_2bF18d7VlTkz11DmN_PXUM"><div className="_1pq0UtmsEXODMd3J-_HjDh"><span className="_2bXdXf_GqdFQVMmOz0A8L8">Sơ yếu lý lịch</span><span className="GFAL_CbltoeGbTj3MVtfx jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">148 × 105 mm</span></div>
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
          </div>
          }
        </div>
      </header>
            </div>
          </div>
          </div>
          <nav className="">
          <ul style={{
            borderBottom: '1px solid #ddd',
          }}>
          <li>SOCIAL MEDIA</li>
          <li>PROMOTION</li>
          <li>OFFICE</li>
          <li>WEB</li>
          <li>PERSONAL</li>
          <li>VIDEO</li>
          </ul>
          </nav>
          <div style={{
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
        <h4>Fits all social media</h4>

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
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Mạng xã hội</p>
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
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Thuyết trình</p>
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
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Áp phích</p>
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
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Mạng xã hội</p>
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
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Thuyết trình</p>
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
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Áp phích</p>
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
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Mạng xã hội</p>
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
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Thuyết trình</p>
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
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Áp phích</p>
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
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Mạng xã hội</p>
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
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Thuyết trình</p>
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
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Áp phích</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <div className="_1e9RJ140GkyvDh6KOo5VX6 _3olv_1czQo3hEv28-Bjg7P" style={{display: 'none', top: 'calc(calc(50% - 20px) + -20px)', right: '-24px'}}><span className="_1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh _3afRAIYF_d3AMkQFT_AuCI"><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16"><path fill="currentColor" d="M6.47 4.29l3.54 3.53c.1.1.1.26 0 .36L6.47 11.7a.75.75 0 1 0 1.06 1.06l3.54-3.53c.68-.69.68-1.8 0-2.48L7.53 3.23a.75.75 0 0 0-1.06 1.06z" /></svg></span></div>
    </div>}
    <h4>Other social media</h4>
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
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Mạng xã hội</p>
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
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Thuyết trình</p>
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
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Áp phích</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <div className="_1e9RJ140GkyvDh6KOo5VX6 _3olv_1czQo3hEv28-Bjg7P" style={{display: 'none', top: 'calc(calc(50% - 20px) + -20px)', right: '-24px'}}><span className="_1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh _3afRAIYF_d3AMkQFT_AuCI"><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16"><path fill="currentColor" d="M6.47 4.29l3.54 3.53c.1.1.1.26 0 .36L6.47 11.7a.75.75 0 1 0 1.06 1.06l3.54-3.53c.68-.69.68-1.8 0-2.48L7.53 3.23a.75.75 0 0 0-1.06 1.06z" /></svg></span></div>
    </div>}
    <h4>Online marketing</h4>
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
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Mạng xã hội</p>
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
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Thuyết trình</p>
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
                                <p className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}>Áp phích</p>
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
      </div>
    );
  }
}
