import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Route, Link } from "react-router-dom";

import { Helmet } from "react-helmet";
import styled from "styled-components";
import TopMenu from "@Components/shared/TopMenu";

type Props = RouteComponentProps<{}>;

export interface IProps {}

interface IState {
  tab: string;
  focusing: boolean;
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
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Helmet>
          <title>Draft website thiết kế mọi thứ</title>
        </Helmet>
        <div
          style={{
            width: "100%",
            position: "relative",
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '100%',
            }}
          >
          </div>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '300px',
            }}
          >
            <div className="container" 
            style={{height: '100%',
              borderRadius: '10px',
              backgroundImage: "url('https://b.imge.to/2019/09/13/v3d8GY.jpg')",
              backgroundSize: 'cover',
            }}>
            <header 
              style={{
                position: 'relative',
                top: '40%',
                marginTop: 'auto',
                marginBottom: 'auto',
                transform: 'translateY(-50%)',
              }}
            className="offset-header__header u-last-child-margin-bottom-0 u-textAlign-left@medium">
        <div className="h__hero u-color-inherit@medium ">
          <h2
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: '40px',
              marginBottom: '20px',
              fontFamily: 'AvenirNextRoundedPro-Bold',
            }}
          >Thiết kế mọi thứ</h2>
          <div
            id="search-icon"
            style={{
              boxShadow: '0 0 0 1px rgba(14,19,24,.02), 0 2px 8px rgba(14,19,24,.15)',
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
            style={{
              width: '100%',
              position: 'absolute',
              marginTop: '-5px',
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
      <section style={{padding: '30px 0'}}>
      <div className="container">
        <div>
        <div className="_30p__PONPi-YqVEVlgnN_6"
                style={{
                    padding: '20px',
                }}
            >
    <div className="_22sigMUdyJNIFhyyvf2MEI GBHbdnAmvUa3G4DLXk6Mj">
        <h3 className="_2lgTACDxLrI1ZOlITIhup- W9IR-ZsiAOretU6xTyjoD _2f7Wjwll8O11wJb1_gQkn1 _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _1fgQS83UQD74-sbLyIX6g2 _1kLjfztPsOUw9W-PSOI9Zu">Thiết kế ngay</h3></div>
    <div className="-ePYCIKwmKaSsQTHX72YG putVYyFpLWTsqziLXPxhR">
        <div className="_3PK-lmKzpAGcI8WTdBQX4i">
            <div className="_1sza4uX0yqDVxS7xsxMj-L" style={{transform: 'translateX(0px)', marginLeft: '-16px'}}>
                <div className="_1sXEXOyAuGxKeBcoq3FFet" style={{width: '260px', padding: '0px 16px'}}>
                    <a href="/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" style={{maxHeight: '192px'}}>
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
                    <a href="/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" style={{maxHeight: '192px'}}>
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
                    <a href="/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" style={{maxHeight: '192px'}}>
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
                    <a href="/design/0adbe687-162d-41e6-9269-8949eee2795a"target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" style={{maxHeight: '192px'}}>
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
                    <a href="/design/0adbe687-162d-41e6-9269-8949eee2795a"target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" style={{maxHeight: '192px'}}>
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
                    <a href="/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" style={{maxHeight: '192px'}}>
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
                    <a href="/design/0adbe687-162d-41e6-9269-8949eee2795a"target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" style={{maxHeight: '192px'}}>
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
                    <a href="/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" style={{maxHeight: '192px'}}>
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
                    <a href="/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" style={{maxHeight: '192px'}}>
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
                    <a href="/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" style={{maxHeight: '192px'}}>
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
                    <a href="/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" style={{maxHeight: '192px'}}>
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
                    <a href="/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" style={{maxHeight: '192px'}}>
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
                    <a href="/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" style={{maxHeight: '192px'}}>
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
                    <a href="/design/0adbe687-162d-41e6-9269-8949eee2795a"target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" style={{maxHeight: '192px'}}>
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
                    <a href="/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" style={{maxHeight: '192px'}}>
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
                    <a href="/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" style={{maxHeight: '192px'}}>
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
                    <a href="/design/0adbe687-162d-41e6-9269-8949eee2795a" target="_blank" draggable="false" rel="noopener" className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX">
                        <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe" style={{maxHeight: '192px'}}>
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
        </div>
      </div>
      </section>
{/*           
      <div className="jsx-104637934 footer-section">
        <div className="jsx-104637934 container">
          <div className="jsx-104637934 upper">
            <div className="jsx-104637934 row">
              <div className="jsx-104637934 col-md-2 col-4 contact">
                <h4 className="jsx-104637934 title">Liên hệ</h4>
                <div className="jsx-104637934 body">
                  <ul className="jsx-104637934 list-unstyled">
                    <li className="jsx-104637934"><a href="mailto:19006710" className="jsx-104637934">19006710</a></li>
                    <li className="jsx-104637934"><a href="mailto:help@mudo.vn" className="jsx-104637934">help@mudo.vn</a></li>
                  </ul>
                </div>
              </div>
              <div className="jsx-104637934 col-md-2 col-4 company">
                <h4 className="jsx-104637934 title">Doanh nghiệp</h4>
                <div className="jsx-104637934 body">
                  <ul className="jsx-104637934 list-unstyled">
                    <li className="jsx-104637934"><a href="https://pages.mudo.vn/about-us" className="jsx-104637934">Về Leflair</a></li>
                    <li className="jsx-104637934"><a href="https://styleguide.mudo.vn/" className="jsx-104637934">Style Guide</a></li>
                    <li className="jsx-104637934"><a href="https://pages.mudo.vn/partners" className="jsx-104637934">Hợp tác</a></li>
                    <li className="jsx-104637934"><a href="https://pages.mudo.vn/genuine-guarantee" className="jsx-104637934">Chính hãng</a></li>
                    <li className="jsx-104637934"><a href="https://careers.mudo.vn" className="jsx-104637934">Tuyển dụng</a></li>
                    <li className="jsx-104637934"><a className="jsx-104637934" href="/vn/brands">Thương hiệu</a></li>
                  </ul>
                </div>
              </div>
              <div className="jsx-104637934 col-md-2 col-4 customer-service">
                <h4 className="jsx-104637934 title">Chăm sóc khách hàng</h4>
                <div className="jsx-104637934 body">
                  <ul className="jsx-104637934 list-unstyled">
                    <li className="jsx-104637934"><a target="_blank" href="https://support.mudo.vn/hc/vi" className="jsx-104637934">Hỏi đáp</a></li>
                    <li className="jsx-104637934"><a target="_blank" href="https://support.mudo.vn/hc/vi/articles/214167448-Ch%C3%ADnh-s%C3%A1ch-tr%E1%BA%A3-h%C3%A0ng-v%C3%A0-ho%C3%A0n-ti%E1%BB%81n" className="jsx-104637934">Đổi trả</a></li>
                    <li className="jsx-104637934"><a target="_blank" href="https://support.mudo.vn/hc/vi/articles/214857097-%C4%90i%E1%BB%81u-kho%E1%BA%A3n-v%C3%A0-quy-%C4%91%E1%BB%8Bnh-chung" className="jsx-104637934">Điều khoản &amp; quy định</a></li>
                    <li className="jsx-104637934"><a target="_blank" href="https://support.mudo.vn/hc/vi/articles/214167378-Ch%C3%ADnh-s%C3%A1ch-giao-v%C3%A0-nh%E1%BA%ADn-h%C3%A0ng" className="jsx-104637934">Giao hàng</a></li>
                    <li className="jsx-104637934"><a target="_blank" href="https://support.mudo.vn/hc/vi/articles/214113678-T%C3%B4i-c%C3%B3-nh%E1%BA%ADn-%C4%91%C6%B0%E1%BB%A3c-h%C3%B3a-%C4%91%C6%A1n-GTGT-trong-b%C6%B0u-ki%E1%BB%87n-kh%C3%B4ng-" className="jsx-104637934">Thuế</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="jsx-104637934 lower">
            <div className="jsx-104637934 row">
              <div className="jsx-104637934 col-md-8">
                <div className="jsx-104637934 row">
                  <div className="jsx-104637934 col-md-6 copyright">
                    <a href="http://www.online.gov.vn/HomePage/CustomWebsiteDisplay.aspx?DocId=19306" target="_blank" rel="noreferrer" className="jsx-104637934 gov-link"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABLCAMAAAACojjaAAABWVBMVEVHcEz////////////////////k7/kAgc7///////////////////8Ags3///////////////////////////////91rdX///////8Ags7///8Ags4AhNL///8Ag8////8Ag9D///8Ags0Ag9AAgs7d7/mKyOj///8aj9PU6vcAfMwNiNAAecvS6Paez+2j0e1Sqt5oteJWrN8vmNfl8vpstuOQyOq83fLP5/b///8Af80AfcwAgM0GhM8Agc4QidEAgs4JhtAAfs32+v0Ti9KNxulMp915veUWjNKTyurG4vQqltYiktTa7fjB4POu1+80m9g+oNq32/EZjtNfsOAAh9Wy2fCZzOuAwOfY6/f7/f+o1O74/P45ntnz+f1HpNyFw+hbrt9Cotvf7/kllNXd7vkDg87K5PXw+PwAg9FyueQfkNQAhtSJxeni8PpjsuHp9Pvn8/rt9vz3DzTLAAAAKHRSTlMA6vW2p1IOWcD9NQceyOF0lBcrgkHVBtljwIkw82itbIBb50xi42/IiaMvjgAADoRJREFUeF7U1VduwkAUBVDb2IgxiBJCCQkJfESs4c2MC733Tnrvdf8lioTMOCSEP8ZnB1f3XT1hNa9vOx2OIQDJlVTUkOBIXjUgxySwICRmgopPcBg1EUHwAwIEoivuoGLcaQ+CP4lB1SE3lYzAapLshChKBv4nBXkfi0+G9fjjfNfhh7XJ/K4+Gkaw5PSjOW2+fs5gSYzXpbhlsLtvFS9OnoysljX69VK5fQU2SEoLPAp5gJXvDRo6IZjq3ygmJGdcVm1ZEDrgMUcGGO/FOiXUtNMJKbzdAQMF+Lsrto98tUGw+RtKtMGUTRLn7Quy+2h12DKWajHOj8EiKQJXEmCZTbQcUwHWTUqITjHTSpcpRdwSOKKgxTpKRGdyVLoF3J88atddpiRSGYHlcGeT9lO77D9f/MGbDjHnctikjdrRGI+K7fJZLdvr4Nt5RqyNwfLy8Lw5w+FeKmoFkb+INdPm1JErDFcqVUkqU1kmmUryYTJZKlXBkjAYsKEXtTYEYl8HzL4J4YGY7f8vOdplwL53UlM35wMWpxf106fP2y1h5FvN9DkYS6UwOfTMeWVgJNuV+rYsqvqMw26kaCloM56o8v/Rfvj+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" alt="copyright" className="jsx-104637934 image" /></a><span className="jsx-104637934 text">Copyright @ 2019 mudo.vn</span></div>
                  <div className="jsx-104637934 col-md-6 address">Công ty Cổ phần Leflair - Tầng 16, Tháp A2, Tòa nhà Viettel, 285 Cách Mạng Tháng Tám, P.12, Q.10, TP.HCM</div>
                </div>
              </div>
              <div className="jsx-104637934 col-md-4">Cơ quan cấp: Sở Kế hoạch và Đầu tư Thành phố Hồ Chí Minh</div>
            </div>
          </div>
        </div>
      </div> */}
        </div>
      </div>
    );
  }
}
