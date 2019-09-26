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
            }}
          >
            <div style={{
                height: '50px',
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <div style={{
    height: '39px',
    textAlign: 'center',
    lineHeight: '39px',
    fontSize: '16px',
}}>
    <a>Menu</a>
</div>
<svg style={{
    transform: 'scale(0.65)',
    transformOrigin: 'center 10px',
}} width="160" height="60" xmlns="http://www.w3.org/2000/svg">
 <metadata id="metadata190397">image/svg+xml</metadata>

 <g>
  <title>background</title>
  <rect fill="none" id="canvas_background" height="62" width="162" y="-1" x="-1"/>
 </g>
 <g>
  <title>Layer 1</title>
  <g stroke="null" id="logo-group">
   <g stroke="null" font-style="normal" font-weight="700" font-size="72px" font-family="'Brandmark1 Bold'" text-anchor="middle" id="title">
    <path stroke="null" fill="#56aaff" transform="translate(0,365.45123291015625) " d="m4.52583,-318.85031c1.04036,2.24451 2.4275,4.29098 4.23078,6.00737c1.87264,1.71639 3.95335,3.10271 6.31149,4.02692c2.4275,0.99023 5.06306,1.45233 7.69863,1.45233c2.63557,0 5.27114,-0.46211 7.69863,-1.45233c2.35814,-0.92421 4.43885,-2.31053 6.31149,-4.02692c1.80328,-1.71639 3.19042,-3.76286 4.23078,-6.00737c1.04036,-2.31053 1.52586,-4.75308 1.52586,-7.32767l0,-32.0173l-10.40356,-3.30075l0,18.74828c-0.55486,-0.26406 -1.10971,-0.52812 -1.66457,-0.72617c-2.4275,-0.99023 -4.99371,-1.45233 -7.69863,-1.45233c-2.63557,0 -5.27114,0.46211 -7.69863,1.45233c-2.35814,0.92421 -4.43885,2.31053 -6.31149,4.02692c-1.80328,1.71639 -3.19042,3.76286 -4.23078,6.00737c-0.971,2.31053 -1.52586,4.75308 -1.52586,7.26166c0,2.57459 0.55486,5.01714 1.52586,7.32767zm18.2409,-16.2397c5.13242,0 9.3632,4.02692 9.3632,8.91203c0,4.95113 -4.23078,8.91203 -9.3632,8.91203c-5.13242,0 -9.3632,-3.9609 -9.3632,-8.91203c0,-4.88511 4.23078,-8.91203 9.3632,-8.91203z" id="path190399"/>
    <path stroke="null" fill="#56aaff" transform="translate(0,365.45123291015625) " d="m58.15835,-307.8258l0,0l0,-16.2397c0,-6.33745 5.40985,-11.55263 12.13748,-11.55263l0,-9.90226c-3.05171,0 -6.03406,0.59414 -8.80834,1.71639c-2.63557,1.05624 -5.06306,2.6406 -7.14378,4.62105c-2.08071,1.91444 -3.67592,4.22496 -4.85499,6.79955c-1.17907,2.6406 -1.73393,5.41323 -1.73393,8.3179l0,16.2397l10.40356,0z" id="path190401"/>
    <path stroke="null" fill="#56aaff" transform="translate(0,365.45123291015625) " d="m97.54557,-344.99227l0.06936,2.11248c-2.77428,-1.3203 -5.82599,-2.04647 -8.94706,-2.04647c-2.63557,0 -5.27114,0.46211 -7.69863,1.45233c-2.35814,0.99023 -4.43885,2.31053 -6.31149,4.02692c-1.80328,1.71639 -3.19042,3.76286 -4.23078,6.00737c-0.971,2.31053 -1.52586,4.8191 -1.52586,7.32767c0,2.50857 0.55486,5.01714 1.52586,7.32767c1.04036,2.24451 2.4275,4.22496 4.23078,6.00737c1.87264,1.71639 3.95335,3.03669 6.31149,4.02692c2.4275,0.92421 5.06306,1.45233 7.69863,1.45233c3.12107,0 6.17278,-0.72617 8.94706,-2.04647l-0.06936,1.51835l10.40356,0l0,-37.16648l-10.40356,0zm-4.16142,26.53805c-1.38714,0.79218 -3.05171,1.25429 -4.71628,1.25429c-5.13242,0 -9.3632,-4.02692 -9.3632,-8.91203c0,-4.88511 4.23078,-8.91203 9.3632,-8.91203c1.80328,0 3.60657,0.46211 5.06306,1.45233c1.52586,0.8582 2.70492,2.1785 3.3985,3.69684c0.62421,1.18827 0.90164,2.44256 0.90164,3.76286c0,1.58436 -0.41614,3.10271 -1.24843,4.48902c-0.83228,1.3203 -1.942,2.44256 -3.3985,3.16872z" id="path190403"/>
    <path stroke="null" fill="#56aaff" transform="translate(0,365.45123291015625) " d="m124.14507,-344.46415l0,-0.06602c0,-5.74331 4.92435,-10.49639 11.02777,-10.49639l0,-9.90226c-2.913,0 -5.75663,0.59414 -8.3922,1.65038c-2.56621,0.99023 -4.85499,2.44256 -6.79699,4.35699c-1.942,1.84842 -3.53721,4.02692 -4.57757,6.46948c-1.10971,2.50857 -1.66457,5.21519 -1.66457,7.92181l0,36.70437l10.40356,0l0,-27.39625l11.02777,0l0,-9.24211l-11.02777,0z" id="path190405"/>
    <path stroke="null" fill="#56aaff" transform="translate(0,365.45123291015625) " d="m157.99997,-335.35407l0,-9.24211l-11.02777,0l0,-11.81669l-10.40356,3.30075l0,25.61384c0,2.77263 0.55486,5.41323 1.66457,7.92181c1.04036,2.44256 2.63557,4.62105 4.57757,6.46948c1.942,1.91444 4.23078,3.36677 6.79699,4.42301c2.63557,1.05624 5.47921,1.58436 8.3922,1.58436l0,-9.90226c-6.10342,0 -11.02777,-4.68707 -11.02777,-10.49639l0,-7.85579l11.02777,0z" id="path190407"/>
   </g>
   <g stroke="null" font-style="normal" font-weight="400" font-size="32px" font-family="Montserrat" text-anchor="middle" id="tagline"/>
  </g>
 </g>
</svg>
<div style={{
    height: '39px',
    textAlign: 'center',
    lineHeight: '39px',
    fontSize: '16px',
}}>
    <a>Login</a>
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
              height: '500px',
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
                padding: '20px 50px',
                position: 'relative',
                top: '50%',
                marginTop: 'auto',
                marginBottom: 'auto',
                transform: 'translateY(-50%)',
              }}
            className="offset-header__header u-last-child-margin-bottom-0 u-textAlign-left@medium">
        <div className="h__hero u-color-inherit@medium ">
          <h2
            style={{
              textAlign: 'center',
              fontSize: '40px',
              marginBottom: '25px',
              fontFamily: 'AvenirNextRoundedPro-Medium',
            }}
          >Bắt đầu thiết kế</h2>
          <div
            id="search-icon"
            style={{
              boxShadow: '0 0 0 1px rgba(14, 19, 24, 0.11), 0 2px 3px rgba(14, 19, 24, 0.08)',
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
              zIndex: 99999,
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
          </div>}
          <h5 style={{
            marginTop: '50px',
            fontWeight: 'bold',
          }}>THÔNG DỤNG</h5>
          <div
            style={{
              height: '250px',
              position: 'relative',
            }}
          >
        {this.state.mounted && 
          <div 
          className="renderView___1QdJs"
          style={{
            overflow: 'scroll',
          }}>
          <ul className="templateList___2swQr">
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="fullHDVideoAN" data-subcateg="home" href="/artboard/?template=5d1b70ef8cba87f943f3451b">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    <video src="https://cdn.crello.com/video-producer-script/42b2cbbb-f74f-49b2-83a6-aca7315824ef.mp4" poster="https://cdn.crello.com/common/6f8d2178-c251-4c68-a191-0f923e08ee30_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Video Full HD</p>
            <p className="x-small___1lJKy size___1sVBg">1920x1080 px</p>
        </div>
    </li>
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="facebookSM" data-subcateg="home" href="/artboard/?template=5c179552133a7853929258d4">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}><img alt="Facebook Post Home stuff 788px 940px" src="https://cdn.crello.com/common/c2e83c00-e0fc-4e4a-9e57-a53b379faaca_640.jpg" className="preview___37TNk mediaItem___106k8" /></div>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Facebook Post</p>
            <p className="x-small___1lJKy size___1sVBg">940x788 px</p>
        </div>
    </li>
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="instagramVideoStoryAN" data-subcateg="home" href="/artboard/?template=5c8b8de285ea3c16f95d1481">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    <video src="https://cdn.crello.com/video-producer-script/5cf49544-381a-4790-903a-bc062d28ea97.mp4" poster="https://cdn.crello.com/common/edf74691-5af9-4554-8ef6-f6f4728c307d_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Instagram Video Story</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1920 px</p>
        </div>
    </li>
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="instagramSM" data-subcateg="home" href="/artboard/?template=5bdc5a6c9259f9ba5482c192">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}><img alt="Instagram Post Real estate & Building 1080px 1080px" src="https://cdn.crello.com/common/06179643-bda5-4edd-8816-84b8fc4d44db_640.jpg" className="preview___37TNk mediaItem___106k8" /></div>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Instagram Post</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1080 px</p>
        </div>
    </li>
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="instagramVideoStoryAN" data-subcateg="home" href="/artboard/?template=5cec02477d4459dfe1542af0">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    <video src="https://cdn.crello.com/video-producer-script/1adfb977-370f-4db0-ab86-04bcfa8ae6b9.mp4" poster="https://cdn.crello.com/common/f6238807-ceec-4eaf-9aa3-34afe8f25c30_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Instagram Video Story</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1920 px</p>
        </div>
    </li>
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="facebookADSMA" data-subcateg="home" href="/artboard/?template=5c1783f8133a785392266363">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}><img alt="Facebook Ad Fashion & Style 628px 1200px" src="https://cdn.crello.com/common/a7613810-fa5f-450b-b482-2a6ed4fd897d_640.jpg" className="preview___37TNk mediaItem___106k8" /></div>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Facebook Ad</p>
            <p className="x-small___1lJKy size___1sVBg">1200x628 px</p>
        </div>
    </li>
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="animatedPostAN" data-subcateg="home" href="/artboard/?template=5d1b2df48cba87f94364f10f">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    <video src="https://cdn.crello.com/video-producer-script/46a49129-6cf5-490d-8103-a34fc91cd63d.mp4" poster="https://cdn.crello.com/common/8714fed0-471e-4a67-9176-2897fc0dbc37_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Square Video Post</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1080 px</p>
        </div>
    </li>
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="instagramStorySM" data-subcateg="home" href="/artboard/?template=5c49ceba048d064dbc2629f0">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}><img alt="Instagram Story Food & Drinks 1920px 1080px" src="https://cdn.crello.com/common/8d368594-f89e-4e3e-affa-7021c4120744_640.jpg" className="preview___37TNk mediaItem___106k8" /></div>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Instagram Story</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1920 px</p>
        </div>
    </li>
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="facebookADSMA" data-subcateg="home" href="/artboard/?template=5a0339fed8141396fe98924f">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}><img alt="Facebook Ad Sport & Extreme 628px 1200px" src="https://cdn.crello.com/common/ca029acb-09a0-4b7f-8fa9-389ea5477ac3_640.jpg" className="preview___37TNk mediaItem___106k8" /></div>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Facebook Ad</p>
            <p className="x-small___1lJKy size___1sVBg">1200x628 px</p>
        </div>
    </li>
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="instagramVideoStoryAN" data-subcateg="home" href="/artboard/?template=5bc9c99478e1194aa6890f1c">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    <video src="https://cdn.crello.com/video-producer-script/b2a03204-5f88-4522-a3b2-c6a6e20e800b.mp4" poster="https://cdn.crello.com/common/23b1a253-5b1f-4ab6-949b-c71b40301b8b_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Instagram Video Story</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1920 px</p>
        </div>
    </li>
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="instagramADSMA" data-subcateg="home" href="/artboard/?template=5c1e1a43133a7853923e5d8a">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}><img alt="Instagram Ad Home stuff 1080px 1080px" src="https://cdn.crello.com/common/52f3771f-658a-4b4c-9df8-b7dceb4bd581_640.jpg" className="preview___37TNk mediaItem___106k8" /></div>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Instagram Ad</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1080 px</p>
        </div>
    </li>
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="animatedPostAN" data-subcateg="home" href="/artboard/?template=5d0242108cba87f94324488e">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    <video src="https://cdn.crello.com/video-producer-script/8714f27a-96e2-421e-bc0c-a62bb6734be4.mp4" poster="https://cdn.crello.com/common/9306da81-1cc9-4ee2-a135-970d8d62a0a2_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Square Video Post</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1080 px</p>
        </div>
    </li>
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="animatedPostAN" data-subcateg="home" href="/artboard/?template=5d1c50518cba87f94315e669">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    <video src="https://cdn.crello.com/video-producer-script/84f08efe-1289-4a19-ac4b-89060140dc66.mp4" poster="https://cdn.crello.com/common/534f5b80-3a47-436b-bab1-9561c122cfed_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Square Video Post</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1080 px</p>
        </div>
    </li>
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="fullHDVideoAN" data-subcateg="home" href="/artboard/?template=5d7ba5e5abc8ea6d1c28dbd5">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    <video src="https://cdn.crello.com/video-producer-script/f7bfb9ea-09e1-423e-a735-989fed4ad1e1.mp4" poster="https://cdn.crello.com/common/d1c132f6-8b1f-48a4-99b8-fd0682425ca5_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Video Full HD</p>
            <p className="x-small___1lJKy size___1sVBg">1920x1080 px</p>
        </div>
    </li>
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="instagramVideoStoryAN" data-subcateg="home" href="/artboard/?template=5bcd89f178e1194aa645c587">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    <video src="https://cdn.crello.com/video-producer-script/bd52c4e4-8151-41cf-96d4-5d6cc144bcdb.mp4" poster="https://cdn.crello.com/common/9fd87f37-1194-462a-b751-110f725cacb8_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Instagram Video Story</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1920 px</p>
        </div>
    </li>
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="facebookADSMA" data-subcateg="home" href="/artboard/?template=5ba0f40c18654940f722bbd2">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}><img alt="Facebook Ad Industry 628px 1200px" src="https://cdn.crello.com/common/04eb5b1d-cf71-4114-a9d6-71a651c5203a_640.jpg" className="preview___37TNk mediaItem___106k8" /></div>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Facebook Ad</p>
            <p className="x-small___1lJKy size___1sVBg">1200x628 px</p>
        </div>
    </li>
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="instagramVideoStoryAN" data-subcateg="home" href="/artboard/?template=5d70d851abc8ea6d1c416f6c">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    <video src="https://cdn.crello.com/video-producer-script/c604a4a4-b56f-44e7-b6cf-f5c5d1d735ac.mp4" poster="https://cdn.crello.com/common/890793ba-a8e7-4c3a-a1a0-1e9281d766bd_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Instagram Video Story</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1920 px</p>
        </div>
    </li>
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="fullHDVideoAN" data-subcateg="home" href="/artboard/?template=5d0256218cba87f943559de7">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    <video src="https://cdn.crello.com/video-producer-script/0b07ba68-96d6-4196-b462-55e1662cad0b.mp4" poster="https://cdn.crello.com/common/61785313-5b0c-4cd8-b9e7-613e40144e10_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Video Full HD</p>
            <p className="x-small___1lJKy size___1sVBg">1920x1080 px</p>
        </div>
    </li>
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="facebookSM" data-subcateg="home" href="/artboard/?template=5b51e14300f9c6103a9d6446">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}><img alt="Facebook Post Beauty 788px 940px" src="https://cdn.crello.com/common/92e717c0-ba32-4db7-b5bd-f60f07d4bb5e_640.jpg" className="preview___37TNk mediaItem___106k8" /></div>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Facebook Post</p>
            <p className="x-small___1lJKy size___1sVBg">940x788 px</p>
        </div>
    </li>
    <li className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="animatedPostAN" data-subcateg="home" href="/artboard/?template=5d00bb2e8cba87f94380a4b7">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    <video src="https://cdn.crello.com/video-producer-script/f55e8cd3-1970-40d3-b57c-d271d89d4a33.mp4" poster="https://cdn.crello.com/common/82356167-f8e5-4876-b15f-2930fd80f6d3_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU">
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg">
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Square Video Post</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1080 px</p>
        </div>
    </li>
</ul>
          </div>}
          </div>
          </div>
      </header>
            </div>
          </div>
          </div>
          <nav 
            style={{
                boxShadow: '0 1px 8px rgba(38,49,71,.08)',
            }}
            className="">
          <ul style={{
            listStyle: 'none',
            display: 'flex',
            margin: 0,
            padding: 0,
          }}>
          <li
            style={{
                height: '100%',
                flex: 1,
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',
                transition: 'all 0.3s ease-in',
                cursor: 'pointer',
            }}
          >SOCIAL MEDIA</li>
          <li style={{
                height: '100%',
                flex: 1,
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',
                transition: 'all 0.3s ease-in',
                cursor: 'pointer',
            }}>PROMOTION</li>
          <li style={{
                height: '100%',
                flex: 1,
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',
                transition: 'all 0.3s ease-in',
                cursor: 'pointer',
            }}>OFFICE</li>
          <li style={{
                height: '100%',
                flex: 1,
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',
                transition: 'all 0.3s ease-in',
                cursor: 'pointer',
            }}>WEB</li>
          <li style={{
                height: '100%',
                flex: 1,
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',
                transition: 'all 0.3s ease-in',
                cursor: 'pointer',
            }}>PERSONAL</li>
          <li style={{
                height: '100%',
                flex: 1,
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',
                transition: 'all 0.3s ease-in',
                cursor: 'pointer',
            }}>VIDEO</li>
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
