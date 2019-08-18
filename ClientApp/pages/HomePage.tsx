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
    tab: "find"
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Helmet>
          <title>Home page - RCB (TypeScript)</title>
        </Helmet>
        <div
          style={{
            height: "135px",
            width: "100%",
            backgroundImage: "linear-gradient(150deg,#019fb6,#19a0ff 85%)",
            backgroundRepeat: "repeat-x",
            position: "relative",
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '100%',
            }}
          >
              <picture>
              <img
                style={{
                  height: '400px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  position: 'relative',
                }}
              class="img-fluid" src="https://www.moo.com/dam/jcr:b67385ae-26b2-4a5c-b82d-b2f26f72be36/CRB-6346-BC-Cat-Hero-3840x700-UKUS.jpg" alt="Search Print Design Templates"/>
            </picture>
          </div>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '400px',
            }}
          >
            <div className="container" style={{height: '100%'}}>
            <header 
              style={{
                position: 'relative',
                top: '50%',
                width: '46%',
                marginTop: 'auto',
                marginBottom: 'auto',
                transform: 'translateY(-50%)',
              }}
            className="offset-header__header u-last-child-margin-bottom-0 u-textAlign-left@medium">
        <div className="h__hero u-color-inherit@medium ">
          <h1 className="h__hero u-color-inherit@medium u-display-inline" data-di-mask>Danh thiếp.</h1>
          <h4 style={{fontFamily: 'AvenirNextRoundedPro'}}>Bắt đầu ngay.</h4>
        </div>
        <div className="hero-module__body-text-wrap list-default__parent u-marginBottom-m u-last-child-margin-bottom-0">
          <h4 style={{fontFamily: 'AvenirNextRoundedPro'}}>Chất lượng giấy bắt ánh mắt người nhìn, màu sắc nổi bật và những thiết kế mẫu dễ dàng chỉnh sửa.</h4>
        </div>
      </header>
            </div>
          </div>
      <section style={{padding: '30px 0'}}>
      <div className="container">
        <div >
          <div style={{display: 'flex'}} className="tile-rack__container layout--row-spacing u-display-flex u-flexWrap-wrap u-justifyContent-center js-tile-rack-slider" role="toolbar">
            <div className="tile-rack__tile-wrap tile-rack__svg-icons-tile-wrap layout__item u-display-flex u-1/4@medium js-tile-wrap" tabIndex={-1} role="option" aria-describedby="slick-slide10" style={{}}>
              <div href="/us/about/next-day-delivery" data-ga-event-action="tile" data-ga-event-label="/us/about/next-day-delivery || Next Day Delivery!" className="tile" data-di-id="di-id-4159d409-4571d809" tabIndex={-1}>
                <div className="tile__body list-default__parent">
                  <div className="tile__media-wrap">
                    <figure className="tile__figure u-margin-0">
                      <img style={{
                        margin: '0 auto',
                        display: 'block',
                      }} src="https://www.moo.com/dam/jcr:54707c68-f16a-47e2-a6dd-33648d576e8b/home_page_OPT_stopwatch_rollover0.svg" alt="Next Day Delivery!" title="Next Day Delivery!" className="tile__image" />
                      <figcaption style={{textAlign: 'center'}} className="u-visually-hidden">Next Day Delivery!</figcaption>
                    </figure>
                  </div>
                  <div className="tile__text-wrap">
                    <div className="tile__text-wrap-inner">
                      <h3 style={{textAlign: 'center'}} className="h__block u-marginBottom-xxxs">
                        Next Day Delivery!
                      </h3>
                      <p style={{textAlign: 'center'}}>Available on selected products. Order before 2pm (EST) Mon–Fri.*</p>
                    </div>
                  </div>
                </div>
              </div>
            </div><div className="tile-rack__tile-wrap tile-rack__svg-icons-tile-wrap layout__item u-display-flex u-1/4@medium js-tile-wrap" tabIndex={-1} role="option" aria-describedby="slick-slide11" style={{}}>
              <div href="/us/about/moo-promise" data-ga-event-action="tile" data-ga-event-label="/us/about/moo-promise || The MOO promise" className="tile
                -borderless
                -link
                -link-whole-tile
            u-textAlign-center
            js-tile
                js-ga-click-track
            " data-di-id="di-id-22c4e32c-caada8f0" tabIndex={-1}>
                <div className="tile__body list-default__parent">
                  <div className="tile__media-wrap">
                    <figure className="tile__figure u-margin-0">
                      <img style={{
                        margin: '0 auto',
                        display: 'block',
                      }}
                      src="https://www.moo.com/dam/jcr:cc1583a7-545e-4cb3-9bf9-279d846d5978/home_page_OPT_diamond_rollover0.svg" alt="The MOO promise" title="The MOO promise" className="tile__image" />
                      <figcaption style={{textAlign: 'center'}} className="u-visually-hidden">The MOO promise</figcaption>
                    </figure>
                  </div>
                  <div className="tile__text-wrap">
                    <div className="tile__text-wrap-inner">
                      <h3 style={{textAlign: 'center'}} className="h__block u-marginBottom-xxxs">
                        The MOO promise
                      </h3>
                      <p style={{textAlign: 'center'}}>We move heaven and earth so you’re happy with your order!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div><div className="tile-rack__tile-wrap tile-rack__svg-icons-tile-wrap layout__item u-display-flex u-1/4@medium js-tile-wrap" tabIndex={-1} role="option" aria-describedby="slick-slide12" style={{}}>
              <div href="/us/about/printfinity" data-ga-event-action="tile" data-ga-event-label="/us/about/printfinity ||  Printfinity" className="tile
                -borderless
                -link
                -link-whole-tile
            u-textAlign-center
            js-tile
                js-ga-click-track
            " data-di-id="di-id-22c4e32c-febbbf42" tabIndex={-1}>
                <div className="tile__body list-default__parent">
                  <div className="tile__media-wrap">
                    <figure className="tile__figure u-margin-0">
                      <img style={{
                        margin: '0 auto',
                        display: 'block',
                      }}
                      src="https://www.moo.com/dam/jcr:d9a54a38-d19d-4b8c-9e83-882a33ca9868/home_page_OPT_printfinity_rollover0.svg" alt=" Printfinity" title=" Printfinity" className="tile__image" />
                      <figcaption style={{textAlign: 'center'}} className="u-visually-hidden"> Printfinity</figcaption>
                    </figure>
                  </div>
                  <div className="tile__text-wrap">
                    <div className="tile__text-wrap-inner">
                      <h3 style={{textAlign: 'center'}} className="h__block u-marginBottom-xxxs">
                        Printfinity
                      </h3>
                      <p style={{textAlign: 'center'}}>Print a different design on every card for FREE. One pack, lots of images!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div><div className="tile-rack__tile-wrap tile-rack__svg-icons-tile-wrap layout__item u-display-flex u-1/4@medium js-tile-wrap" tabIndex={-1} role="option" aria-describedby="slick-slide13" style={{}}>
              <div className="tile
                -borderless
            u-textAlign-center
            js-tile
">
                <div className="tile__body list-default__parent">
                  <div className="tile__media-wrap">
                    <figure className="tile__figure u-margin-0">
                      <img style={{
                        margin: '0 auto',
                        display: 'block',
                      }}
                      src="https://www.moo.com/dam/jcr:ba300200-b969-4fc5-9e70-f3cf560b2cd4/home_page_OPT_trustpilot_rollover0.svg" alt="Customers trust us" title="Customers trust us" className="tile__image" />
                      <figcaption style={{textAlign: 'center'}} className="u-visually-hidden">Customers trust us</figcaption>
                    </figure>
                  </div>
                  <div className="tile__text-wrap">
                    <div className="tile__text-wrap-inner">
                      <h3 style={{textAlign: 'center'}} className="h__block u-marginBottom-xxxs">
                        Customers trust us
                      </h3>
                      <p style={{textAlign: 'center'}}>That’s why they’ve rated us 9.5&nbsp;out of 10 on Trustpilot. Excellent stuff.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div></div>
        </div>
      </div>
      </section>
          <div
            style={{
              height: "135px",
              width: "100%",
              backgroundImage: "linear-gradient(150deg,#019fb6,#19a0ff 85%)",
              backgroundRepeat: "repeat-x",
              padding: "10px",
              left: 0,
              position: "absolute"
            }}
          >
            <h1
              style={{
                textAlign: "center",
                width: "100%",
                color: "white",
                margin: "auto",
                top: 0,
                bottom: 0,
                display: "inline-table"
              }}
            >
              Find a Template – Join millions of others and start designing
            </h1>
            <a
              style={{ backgroundColor: "white" }}
              className="btn btn-sm btn-white transition-3d-hover font-weight-semi-bold ml-4"
              href="/templates"
            >
              Start Designing
            </a>
          </div>
        </div>
      </div>
    );
  }
}
