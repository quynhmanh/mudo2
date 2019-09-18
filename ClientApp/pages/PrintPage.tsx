import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Helmet } from "react-helmet";
import styled from "styled-components";

type Props = RouteComponentProps<{}>;

export interface IProps {}

interface IState {
  tab: string;
}

export default class PrintPage extends React.Component<IProps, IState> {
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
        <div className="container space-0 space-2 space-sm-1">
        <div className="row">
          <div className="col-lg-8 text-center mx-md-auto mb-9">
            <span className="btn btn-xs btn-soft-success btn-pill mb-2">Online Print</span>
            <h2 className="font-weight-normal text-primary">How does it work?</h2>
            <p className="mb-0">We've streamlined the print process to make things easy for you!</p>
          </div>
        </div>
        <div className="row align-items-center">
          <div className="col-lg-7 col-md-6 space-bottom-2 space-bottom-md-0">
            <img className="img-fluid" src="https://res.cloudinary.com/mycreativeshop/image/upload/f_auto/public/print-products-collage" alt="Print Products Collage" />
          </div>
          <div className="col-lg-5 col-md-6">
            <ul className="list-unstyled u-indicator-vertical-dashed pr-md-4">
              <li className="media u-indicator-vertical-dashed-item">
                <span className="btn btn-xs btn-icon btn-primary rounded-circle mr-3">
                  <span className="btn-icon__inner text-white font-weight-bold">1</span>
                </span>
                <div className="media-body mt-n1">
                  <h3 className="h5 text-primary">Create your design</h3>
                  <p className="small">
                    Select a template in our catalog and customize it in our online editor. No design experience required!
                    <a href="/templates">Find a template &gt;</a>
                  </p>
                </div>
              </li>
              <li className="media u-indicator-vertical-dashed-item">
                <span className="btn btn-xs btn-icon btn-primary rounded-circle mr-3">
                  <span className="btn-icon__inner text-white font-weight-bold">2</span>
                </span>
                <div className="media-body mt-n1">
                  <h3 className="h5 text-primary">Order prints with us</h3>
                  <p className="small">
                    When you're done with your design easily select your quantity, paper type and more options using our online print checkout.
                  </p>
                </div>
              </li>
              <li className="media u-indicator-vertical-dashed-item">
                <span className="btn btn-xs btn-icon btn-primary rounded-circle mr-3">
                  <span className="btn-icon__inner text-white font-weight-bold">2</span>
                </span>
                <div className="media-body mt-n1">
                  <h3 className="h5 text-primary">Guaranteed Delivery</h3>
                  <p className="small">
                    We offer guaranteed delivery dates, so you can feel confident knowing your prints will arrive on time.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container space-1 space-md-2">
        <div id="SVGkeyFeatures" className="card-deck card-lg-gutters-2 d-block d-lg-flex" style={{}}>
          <div className="card shadow mb-3 mb-lg-0">
            <div className="card-body p-5">
              <figure className="ie-height-56 w-100 max-width-8 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 120 120" xmlSpace="preserve" className="injected-svg js-svg-injector" data-parent="#SVGkeyFeatures">
                  <style type="text/css" dangerouslySetInnerHTML={{__html: "\n\t.icon-46-0{fill:#BDC5D1;stroke:#BDC5D1;}\n\t.icon-46-1{fill:#FFFFFF;stroke:#BDC5D1;}\n\t.icon-46-2{fill:#377DFF;}\n\t.icon-46-3{fill:#FFFFFF;}\n\t.icon-46-4{fill:none;stroke:377DFF;}\n" }} />
                  <path className="icon-46-0 fill-gray-400 stroke-gray-400" opacity=".4" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M99.8,100.9c-7.4,7.8-16.6,13.9-26.9,17.6C46.2,109,27,83.6,27,53.9V28.6l45.8-15.2l45.8,15.2v25.3  c0,9.2-1.8,18-5.2,26C113.5,79.9,107.6,93.8,99.8,100.9z" />
                  <path className="icon-46-1 fill-white stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M82.4,98.9c-8.3,8.7-18.5,15.5-30,19.6c-29.6-10.5-51-38.8-51-71.9V18.3l51-16.9l51,16.9v28.2  c0,10.2-2.1,20-5.8,29C97.7,75.5,91.2,91,82.4,98.9z" />
                  <path className="icon-46-0 fill-gray-400 stroke-gray-400" opacity=".2" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M52.4,1.5L52.4,1.5v117c11.5-4.1,21.8-10.9,30-19.6c8.7-7.9,15.3-23.4,15.3-23.4c3.7-8.9,5.8-18.7,5.8-29V18.3  L52.4,1.5z" />
                  <g>
                    <defs>
                      <circle id="icon46ID_1" cx="50.8" cy="57.5" r="28.8" />
                    </defs>
                    <use className="icon-46-2 fill-primary" xlinkHref="#icon46ID_1" style={{overflow: 'visible'}} />
                    <clipPath id="icon46ID_2">
                      <use xlinkHref="#icon46ID_1" style={{overflow: 'visible'}} />
                    </clipPath>
                    <circle clipPath="url(#icon46ID_2)" className="icon-46-3 fill-white" cx="50.5" cy="86.2" r="21.7" />
                    <use className="icon-46-4 fill-none stroke-primary" strokeWidth={3} strokeMiterlimit={10} xlinkHref="#icon46ID_1" style={{overflow: 'visible'}} />
                  </g>
                  <circle className="icon-46-3 fill-white" cx="50.8" cy="46.7" r="8.3" />
                </svg>
              </figure>
              <h3 className="h5">Quality</h3>
              <p className="font-size-1">We care about the quality of your design in the editor and when it goes to print. When you order iwth us you get quality.</p>
            </div>
          </div>
          <div className="card bg-primary text-white shadow-primary-lg mb-3 mb-lg-0">
            <div className="card-body p-5">
              <figure className="ie-height-56 w-100 max-width-8 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 120 120" xmlSpace="preserve" className="injected-svg js-svg-injector" data-parent="#SVGkeyFeatures">
                  <style type="text/css" dangerouslySetInnerHTML={{__html: "\n\t.icon-white-21-0{fill:#FFFFFF;}\n\t.icon-white-21-1{fill:#377DFF;}\n\t.icon-white-21-2{fill:none;stroke:#FFFFFF;}\n" }} />
                  <path className="icon-white-21-0 fill-white" opacity=".15" d="M59.3,90.9L59.3,90.9c-4.6,4.6-12.5,1.7-13.1-4.8l0,0c-0.4-4.2-4.1-7.3-8.3-7l0,0c-6.5,0.5-10.7-6.7-7-12.1l0,0  c2.4-3.5,1.6-8.2-1.9-10.7l0,0c-5.3-3.8-3.9-12,2.4-13.7l0,0c4.1-1.1,6.5-5.3,5.4-9.4l0,0c-1.7-6.3,4.8-11.7,10.7-8.9l0,0  c3.8,1.8,8.4,0.1,10.2-3.7l0,0c2.8-5.9,11.2-5.9,13.9,0l0,0c1.8,3.8,6.4,5.5,10.2,3.7l0,0c5.9-2.7,12.3,2.7,10.7,8.9l0,0  c-1.1,4.1,1.3,8.3,5.4,9.4l0,0c6.3,1.7,7.7,10,2.4,13.7l0,0c-3.5,2.4-4.3,7.2-1.9,10.7l0,0c3.7,5.3-0.5,12.6-7,12.1l0,0  c-4.2-0.4-7.9,2.8-8.3,7l0,0c-0.6,6.5-8.5,9.3-13.1,4.8l0,0C67.1,87.9,62.3,87.9,59.3,90.9z" />
                  <path className="icon-white-21-0 fill-white" d="M54.6,79.8L54.6,79.8C50,84.4,42.1,81.5,41.5,75l0,0c-0.4-4.2-4.1-7.3-8.3-7l0,0c-6.5,0.5-10.7-6.7-7-12.1l0,0  c2.4-3.5,1.6-8.2-1.9-10.7l0,0c-5.3-3.8-3.9-12,2.4-13.7l0,0c4.1-1.1,6.5-5.3,5.4-9.4l0,0c-1.7-6.3,4.8-11.7,10.7-8.9l0,0  c3.8,1.8,8.4,0.1,10.2-3.7l0,0c2.8-5.9,11.2-5.9,13.9,0l0,0c1.8,3.8,6.3,5.5,10.2,3.7l0,0c5.9-2.7,12.3,2.7,10.7,8.9l0,0  c-1.1,4.1,1.3,8.3,5.4,9.4l0,0c6.3,1.7,7.7,10,2.4,13.7l0,0c-3.5,2.4-4.3,7.2-1.9,10.7l0,0c3.7,5.3-0.5,12.6-7,12.1l0,0  c-4.2-0.4-7.9,2.8-8.3,7l0,0c-0.6,6.5-8.5,9.3-13.1,4.8l0,0C62.4,76.8,57.6,76.8,54.6,79.8z" />
                  <circle className="icon-white-21-1 fill-primary" cx={60} cy="43.6" r="15.1" />
                  <polyline className="icon-white-21-2 fill-none stroke-white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} points="79.5,92.9 91.2,114.8 100.9,100.3 118.3,100.4 102.9,71.4 " />
                  <polyline className="icon-white-21-2 fill-none stroke-white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} points="40.5,92.9 28.8,114.8 19.1,100.3 1.7,100.4 17.1,71.4 " />
                </svg>
              </figure>
              <h3 className="h5">Guarantee</h3>
              <p className="text-white font-size-1">We guarantee that you'll love your prints &amp; if you don't due to a fault of ours we'll do whatever it takes to make it right.</p>
            </div>
          </div>
          <div className="card shadow mb-3 mb-lg-0">
            <div className="card-body p-5">
              <figure className="ie-height-56 w-100 max-width-8 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 120 120" xmlSpace="preserve" className="injected-svg js-svg-injector" data-parent="#SVGkeyFeatures">
                  <style type="text/css" dangerouslySetInnerHTML={{__html: "\n\t.icon-23-0{fill:none;stroke:#377DFF;}\n\t.icon-23-1{fill:#BDC5D1;}\n\t.icon-23-2{fill:#377DFF;}\n\t.icon-23-3{fill:none;stroke:#FFFFFF;}\n\t.icon-23-4{fill:none;stroke:#BDC5D1;}\n" }} />
                  <g>
                    <g>
                      <g>
                        <line className="icon-23-0 fill-none stroke-primary" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="6.7" y1="100.8" x2="1.3" y2="106.2" />
                      </g>
                      <line className="icon-23-0 fill-none stroke-primary" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="9.4" y1="111.2" x2={7} y2="113.5" />
                      <g>
                        <circle className="icon-23-1 fill-gray-400" opacity=".5" cx="86.2" cy="41.8" r="17.1" />
                        <circle className="icon-23-2 fill-primary" cx="84.4" cy="36.2" r="17.1" />
                        <path className="icon-23-3 fill-none stroke-white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M81.7,25.1c2-0.5,4.1-0.4,6.1,0.2" />
                        <path className="icon-23-3 fill-none stroke-white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M76.3,44.3c-4.5-4.5-4.5-11.7,0-16.2" />
                      </g>
                      <g>
                        <path className="icon-23-4 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M42.5,42.2c-9.8-1.6-20.2,1.4-27.8,9c-3,3-5.2,6.4-6.8,10c7-1.3,15.1-1.5,23.8-0.4     C34.5,54.4,38.1,48.1,42.5,42.2z" />
                        <path className="icon-23-4 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M60.4,106.4c-0.1,0.5-0.6,4-0.7,4.4c-0.1,0.6-0.2,1.3-0.3,1.9c3.6-1.6,7.1-3.8,10-6.8     c7.6-7.6,10.6-17.9,9-27.8c-6,4.4-12.2,8-18.6,10.7c0.6,4.7,0.8,9.2,0.7,13.5" />
                      </g>
                      <g>
                        <path className="icon-23-4 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M52.1,73.8c4.8,4.4,9.9,8,15.4,11.1" />
                        <path className="icon-23-4 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M35.7,53c3,5.4,6.7,10.6,11.1,15.4" />
                      </g>
                      <path className="icon-23-4 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M34,86.6L34,86.6c-1.5-1.5-1.5-3.9,0-5.4l20-20c1.5-1.5,3.9-1.5,5.4,0v0c1.5,1.5,1.5,3.9,0,5.4l-20,20    C37.9,88.1,35.5,88.1,34,86.6z" />
                      <g>
                        <path className="icon-23-4 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M46.7,79.2c4.1,3.7,8.4,6.9,12.9,9.7c10.9-4.7,21.5-11.8,30.9-21.2c19.3-19.3,29-43.9,28.1-65.8     C96.7,1,72.2,10.7,52.8,30c-9.4,9.4-16.4,20-21.2,30.9c2.8,4.5,6,8.9,9.7,12.9" />
                        <path className="icon-23-4 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M94.8,4.9c2.6,4.3,5.6,8.2,9.2,11.7c3.6,3.6,7.5,6.6,11.7,9.1" />
                      </g>
                      <path className="icon-23-0 fill-none stroke-primary" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M55.8,93.9c-3.4-2.1-6.8-4.6-10.1-7.4l-3.3,3.3c-3.1,3.1-8.2,3.1-11.3,0v0c-3.1-3.1-3.1-8.2,0-11.3l3.3-3.3    c-2.9-3.4-5.5-7-7.8-10.6c-2.9,1.6-5.8,3.7-8.4,6.4c-7.5,7.5-11,17-9.6,24.1c1.5,0.3,3.1,0.4,4.8,0.3c-1.4,4.5-1.7,8.8-0.9,12.6    c3.8,0.8,8.2,0.4,12.6-0.9c-0.1,1.7-0.1,3.3,0.3,4.8c7.1,1.5,16.6-2,24.1-9.6C52.1,99.8,54.2,96.9,55.8,93.9z" />
                      <g>
                        <line className="icon-23-0 fill-none stroke-primary" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="19.4" y1={55} x2="10.1" y2="64.3" />
                        <line className="icon-23-4 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="16.3" y1="65.8" x2="9.4" y2="72.7" />
                        <line className="icon-23-4 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="5.5" y1="68.9" x2={4} y2="70.4" />
                        <line className="icon-23-0 fill-none stroke-primary" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="65.5" y1="101.2" x2="50.7" y2="116.1" />
                        <line className="icon-23-4 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="54.8" y1="104.3" x2="47.8" y2="111.2" />
                        <line className="icon-23-4 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="43.2" y1="115.8" x2="40.9" y2="118.2" />
                      </g>
                    </g>
                  </g>
                </svg>
              </figure>
              <h3 className="h5">Speed</h3>
              <p className="font-size-1">Gone are the days of sending bulky files across the web. Simply biuld your print order and checkout. We'll handle the rest.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container space-2 border-top border-bottom">
        <div className="row align-items-center">
          <div className="col-lg-5 mb-9 mb-lg-0">
            <div className="pr-lg-4 mb-7">
              <span className="btn btn-xs btn-soft-success btn-pill mb-2">Connected</span>
              <h2 className="text-primary">
                Connecting your
                <span className="font-weight-semi-bold">design &amp; print needs</span>
              </h2>
              <p>We created an environment where your design &amp; print needs are connected like never before. Gone are the days of losing design files, forgetting what paper options you chose on your last print purchase or having to send bulky files across the web. With MyCreativeShop you can easily manage your design and print needs under one roof!</p>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <ul className="list-unstyled mb-0">
                  <li className="py-2">
                    <div className="media">
                      <span className="btn btn-sm btn-icon btn-soft-success rounded-circle mr-3">
                        <span className="fas fa-check btn-icon__inner" />
                      </span>
                      <div className="media-body">
                        File storage
                      </div>
                    </div>
                  </li>
                  <li className="py-2">
                    <div className="media">
                      <span className="btn btn-sm btn-icon btn-soft-success rounded-circle mr-3">
                        <span className="fas fa-check btn-icon__inner" />
                      </span>
                      <div className="media-body">
                        Order history
                      </div>
                    </div>
                  </li>
                  <li className="py-2">
                    <div className="media">
                      <span className="btn btn-sm btn-icon btn-soft-success rounded-circle mr-3">
                        <span className="fas fa-check btn-icon__inner" />
                      </span>
                      <div className="media-body">
                        Order tracking
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="col-sm-6">
                <ul className="list-unstyled mb-0">
                  <li className="py-2">
                    <div className="media">
                      <span className="btn btn-sm btn-icon btn-soft-success rounded-circle mr-3">
                        <span className="fas fa-check btn-icon__inner" />
                      </span>
                      <div className="media-body">
                        Online design
                      </div>
                    </div>
                  </li>
                  <li className="py-2">
                    <div className="media">
                      <span className="btn btn-sm btn-icon btn-soft-success rounded-circle mr-3">
                        <span className="fas fa-check btn-icon__inner" />
                      </span>
                      <div className="media-body">
                        Online print builder
                      </div>
                    </div>
                  </li>
                  <li className="py-2">
                    <div className="media">
                      <span className="btn btn-sm btn-icon btn-soft-success rounded-circle mr-3">
                        <span className="fas fa-check btn-icon__inner" />
                      </span>
                      <div className="media-body">
                        Much more
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <img className="img-fluid" src="https://res.cloudinary.com/mycreativeshop/image/upload/f_auto/public/print-design-connected" alt="Design Software Features" />
          </div>
        </div>
      </div>
      
      <div className="gradient-half-warning-v3">
        <div className="container space-2 space-lg-2">
          <div className="row">
            <div className="col-lg-4 d-flex  flex-column justify-content-center">
              <div className="font-size-5 font-weight-bold text-white">High<br />Quality</div>
              <p className="text-white">From design to print, we're focused on offering you the best options.</p>
            </div>
            <div className="col-lg-8">
              <img className="img-fluid" src="https://res.cloudinary.com/mycreativeshop/image/upload/f_auto/w_800/public/high-quality-print" />
            </div>
          </div>
        </div>
      </div>

      <div className="container space-2">
        <div className="row">
          <div className="col-lg-8 text-center mx-md-auto mb-9">
            <span className="btn btn-xs btn-soft-success btn-pill mb-2">Online Print</span>
            <h2 className="font-weight-normal text-primary">Our print products</h2>
            <p className="mb-0">Select a product to view real-time pricing and delivery options.</p>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/banners">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/banner.jpg" alt="Banner printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Banners
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/bottle-tags">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/bottletag.jpg" alt="Bottle Tag printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Bottle Tags
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/brochures">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/brochure.jpg" alt="Brochure printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Brochures
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/business-cards">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/businesscard.jpg" alt="Business Card printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Business Cards
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/coasters">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/coaster.jpg" alt="Coaster printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Coasters
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/cupsleeves">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/cupsleeve.jpg" alt="Cup Sleeve printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Cup Sleeves
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/doorhangers">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/doorhanger.jpg" alt="Door Hanger printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Door Hangers
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/eddm-postcards">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/postcard-eddm.jpg" alt="EDDM Postcard printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    EDDM Postcards
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/envelopes">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/envelope.jpg" alt="Envelope printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Envelopes
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/flyers">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/flyer.jpg" alt="Flyer printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Flyers
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/gift-certificates">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/giftcertificate.jpg" alt="Gift Certificate printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Gift Certificates
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/letterheads">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/letterhead.jpg" alt="Letterhead printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Letterheads
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/loyalty-cards">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/loyaltycard.jpg" alt="Loyalty Card printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Loyalty Cards
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/menus">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/menu.jpg" alt="Menu printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Menus
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/newsletters">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/newsletter.jpg" alt="Newsletter printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Newsletters
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/pocket-folders">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/pocketfolder.jpg" alt="Pocket Folder printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Pocket Folders
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/postcards">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/postcard.jpg" alt="Postcard printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Postcards
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/posters">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/poster.jpg" alt="Poster printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Posters
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/reminder-cards">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/remindercard.jpg" alt="Reminder Card printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Reminder Cards
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/sticker">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/sticker.jpg" alt="Sticker printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Stickers
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/table-tents">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/tabletent.jpg" alt="Table Tent printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Table Tents
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/tickets">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/ticket.jpg" alt="Ticket printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Tickets
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/wristbands">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/wristband.jpg" alt="Wristband printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Wristbands
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 fadein-list-item">
            <div className="card border-0 shadow-soft mb-5 stdImageCard">
              <a href="/print/yardsigns">
                <img className="card-img-top" src="https://s3.amazonaws.com/securecdn.mycreativeshop.com/images/categories/yardsign.jpg" alt="Yard Sign printing" />
                <div className="card-footer border-0 py-4 px-5">
                  <div className="text-body font-weight-semi-bold">
                    Yard Signs
                    <small className="fas fa-arrow-right text-primary ml-2" />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container space-bottom-2">
        <div className="row justify-content-center">
          <div className="col-sm-6">
            <div className="text-center px-lg-5">
              <figure id="icon12" className="ie-height-72 max-width-10 mx-auto mb-3" style={{}}>
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 120 120" xmlSpace="preserve" className="injected-svg js-svg-injector" data-parent="#icon12">
                  <style type="text/css" dangerouslySetInnerHTML={{__html: "\n\t.icon-62-0{fill:none;stroke:#BDC5D1;}\n\t.icon-62-1{fill:none;stroke:#377DFF;}\n\t.icon-62-2{fill:#BDC5D1;}\n\t.icon-62-3{fill:#FFFFFF;stroke:#377DFF;}\n\t.icon-62-4{fill:#377DFF;stroke:#377DFF;}\n" }} />
                  <path className="icon-62-0 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M53.2,48.2c-0.7-0.8-1.8-1.3-3.1-1.3c-1.3,0-2.4,0.5-3.1,1.3" />
                  <path className="icon-62-0 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M71.9,48.2c-0.7-0.8-1.8-1.3-3.1-1.3c-1.3,0-2.4,0.5-3.1,1.3" />
                  <path className="icon-62-1 fill-none stroke-primary" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M36.2,30.4C38,18.9,47.7,10.1,59.4,10.1s21.5,8.8,23.3,20.3" />
                  <path className="icon-62-0 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M35.8,36.8" />
                  <path className="icon-62-1 fill-none stroke-primary" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M31.5,29.3C31.5,13.9,44,1.4,59.4,1.4c5,0,9.7,1.3,13.8,3.7c8.4,4.8,14.1,13.9,14.1,24.3" />
                  <path className="icon-62-0 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M50.4,25.7c1.7,10.6,17,15.1,31.4,14.3" />
                  <path className="icon-62-0 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M50.4,25.7c0,7.9-5.7,12.6-13.2,14.3" />
                  <polyline className="icon-62-1 fill-none stroke-primary" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} points="58.1,66.5 31.6,62.7 31.3,55.2 " />
                  <path className="icon-62-2 fill-gray-400" opacity=".4" d="M59.7,96.9l8.7,9.8c0.7,0.8,2,0.8,2.8,0l11.2-12.2c0.6-0.6,0.6-1.5,0.2-2.2l-5.1-8.8" />
                  <path className="icon-62-0 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M36.2,86.4L19.4,96.8c-1.6,1-3,2.3-4.1,3.8c-1.7,2.4-2.7,5.3-2.7,8.3v9.7" />
                  <path className="icon-62-0 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M83.2,86.4l17.5,10.9c4.2,2.6,6.7,7.2,6.7,12.1v1.1v8.1" />
                  <line className="icon-62-0 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="59.7" y1="111.5" x2="59.7" y2="118.6" />
                  <line className="icon-62-0 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="59.7" y1="104.3" x2="59.7" y2="105.8" />
                  <path className="icon-62-0 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M36.8,50.3" />
                  <path className="icon-62-0 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M83.1,54.1c0,0.1,0,0.1,0,0.2c-1.3,9.8-6.8,19.9-16.2,23.8c-9.2,3.8-18.9-0.2-24.7-7.8" />
                  <path className="icon-62-2 fill-gray-400" opacity=".4" d="M59.7,96.9l-8.7,9.8c-0.7,0.8-2,0.8-2.8,0L37.1,94.5c-0.6-0.6-0.6-1.5-0.2-2.2l5.1-8.8" />
                  <path className="icon-62-3 fill-white stroke-primary" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M31.2,55.2h-0.8c-3.2,0-5.8-2.6-5.8-5.8V35.1c0-3.2,2.6-5.8,5.8-5.8h0.8c3.2,0,5.8,2.6,5.8,5.8v14.3  C37,52.5,34.4,55.2,31.2,55.2z" />
                  <path className="icon-62-3 fill-white stroke-primary" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M88.5,55.2h-0.8c-3.2,0-5.8-2.6-5.8-5.8V35.1c0-3.2,2.6-5.8,5.8-5.8h0.8c3.2,0,5.8,2.6,5.8,5.8v14.2  C94.3,52.5,91.7,55.2,88.5,55.2z" />
                  <line className="icon-62-0 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="73.8" y1="73.6" x2="73.8" y2="79.6" />
                  <line className="icon-62-0 fill-none stroke-gray-400" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="46.2" y1="74.5" x2="46.2" y2={80} />
                  <polyline className="icon-62-4 fill-primary stroke-primary" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} points="59.7,90.2 69.8,101.6 83.4,86.8 77.5,76.8 " />
                  <polyline className="icon-62-4 fill-primary stroke-primary" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} points="59.7,90.2 49.7,101.6 36.1,86.8 41.9,76.8 " />
                  <line className="icon-62-4 fill-primary stroke-primary" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="77.5" y1="76.8" x2="59.7" y2="90.2" />
                  <line className="icon-62-4 fill-primary stroke-primary" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="41.9" y1="76.8" x2="59.7" y2="90.2" />
                </svg>
              </figure>
              <h3 className="h5 mt-1">Still no luck? We can help!</h3>
              <a className="btn btn-sm btn-primary rounded transition-3d-hover my-3" href="https://mycreativeshop.zendesk.com/hc/en-us/requests/new">Submit a Request</a>
              <p className="small">Contact us and we'll get back to you as soon as possible.</p>
            </div>
          </div>
        </div>
      </div>
        </div>
    );
  }
}
