import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Helmet } from "react-helmet";
import styled from "styled-components";

type Props = RouteComponentProps<{}>;

export interface IProps {}

interface IState {
  tab: string;
}

export default class PricingPage extends React.Component<IProps, IState> {
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
        
      
        <main id="content" role="main">
        <div className="bg-light border-bottom">
          <div className="container space-top-1 space-bottom-2">
            <div className="w-lg-80 w-lg-50 text-center mx-md-auto mb-9">
              <span className="badge badge-pill btn-soft-success badge-bigger px-4 mb-2 font-weight-medium">Pricing</span>
              <h1 className="font-size-5 font-weight-bold text-lh-sm">Simple and Flexible Pricing</h1>
              <small className="font-size-1 text-secondary mb-2">Are you ready to create something awesome?</small>
            </div>
            <div className="row">
              <div id="stickyBlockStartPoint" className="col-md-5 mb-9 mb-md-0">
                <div className="position-relative bg-primary shadow-primary-lg text-white rounded z-index-2 p-7">
                  <span className="d-block">
                    <span className="align-top">$</span>
                    <span className="display-2 font-weight-semi-bold">19</span>
                    <span className="font-size-3">.95 <span className="font-size-1">/month</span></span>
                  </span>
                  <hr className="opacity-md my-4" />
                  <div className="mb-5">
                    <p className="text-light">Create an unlimited number of designs and print them <i>anywhere</i>.</p>
                  </div>
                  <a className="btn btn-white btn-pill transition-3d-hover mb-2" href="/dashboard/subscription/manage">
                    Get Started
                    <span className="fas fa-arrow-right text-primary font-size-1 ml-2" />
                  </a>
                  <p className="small text-white-70">Annual plans available.</p>
                  <div className="position-absolute bottom-0 right-0 w-100 max-width-15 z-index-n1">
                    <figure className="ie-abstract-shapes-11">
                      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 67.1 115" xmlSpace="preserve" className="injected-svg js-svg-injector rounded-bottom">
                        <style type="text/css" dangerouslySetInnerHTML={{__html: "\n\t.abstract-shapes-11-0{fill:#00DFFC;}\n\t.abstract-shapes-11-1{fill:none;stroke:#FFFFFF;}\n" }} />
                        <g>
                          <defs>
                            <rect id="abstractShapes11_1" width="67.1" height={115} />
                          </defs>
                          <clipPath id="abstractShapes11_2">
                            <use xlinkHref="#abstractShapes11_1" style={{overflow: 'visible'}} />
                          </clipPath>
                          <g clipPath="url(#abstractShapes11_2)">
                            <g>
                              <path className="abstract-shapes-11-0 fill-info" d="M89.9,31.4c-0.1,12.4-0.2,24.4,6.6,35.6c4.9,8.1,12.6,14.1,21.5,17.3c11.7,4,26.5,2.3,36,11.4     c5.1,4.8,7.4,11.8,6.3,18.8c-2.7,18.1-20.4,22.7-36.3,22.9c-18.6,0.3-38.3-3.3-52.7,11.4c-8.5,8.8-12.4,23.3-23.9,29.1     c-16.9,8.6-29.5-12-34.9-25c-4.7-11.8-9.1-23.6-11.5-36.2c-1.3-6.5-1.8-13.4,0.4-19.7c5.2-15.5,21.8-13.2,33.9-19.7     c6.4-3.5,11.1-9,13.8-15.7c4.9-12.2,4.9-25.9,5.8-38.9C55.8,10.4,65.8-4.9,80.3,1.5c6.6,2.9,9.2,9.9,9.6,16.8     C90,22.7,90,27.1,89.9,31.4z" />
                            </g>
                            <g>
                              <g>
                                <g>
                                  <g>
                                    <defs>
                                      <path id="abstractShapes11_3" d="M89.9,31.4c-0.1,12.4-0.2,24.4,6.6,35.6c4.9,8.1,12.6,14.1,21.5,17.3c11.7,4,26.5,2.3,36,11.4         c5.1,4.8,7.4,11.8,6.3,18.8c-2.7,18.1-20.4,22.7-36.3,22.9c-18.6,0.3-38.3-3.3-52.7,11.4c-8.5,8.8-12.4,23.3-23.9,29.1         c-16.9,8.6-29.5-12-34.9-25c-4.7-11.8-9.1-23.6-11.5-36.2c-1.3-6.5-1.8-13.4,0.4-19.7c5.2-15.5,21.8-13.2,33.9-19.7         c6.4-3.5,11.1-9,13.8-15.7c4.9-12.2,4.9-25.9,5.8-38.9C55.8,10.4,65.8-4.9,80.3,1.5c6.6,2.9,9.2,9.9,9.6,16.8         C90,22.7,90,27.1,89.9,31.4z" />
                                    </defs>
                                    <clipPath id="abstractShapes11_4">
                                      <use xlinkHref="#abstractShapes11_3" style={{overflow: 'visible'}} />
                                    </clipPath>
                                    <path className="abstract-shapes-11-1 fill-none stroke-white" strokeWidth={3} strokeMiterlimit={10} clipPath="url(#abstractShapes11_4)" d="M28.3,72.9c0,0-13.6,17.3,11.5,49s2.8,66.3,2.8,66.3" />
                                  </g>
                                </g>
                              </g>
                            </g>
                            <g>
                              <g>
                                <g>
                                  <g>
                                    <defs>
                                      <path id="abstractShapes11_5" d="M89.9,31.4c-0.1,12.4-0.2,24.4,6.6,35.6c4.9,8.1,12.6,14.1,21.5,17.3c11.7,4,26.5,2.3,36,11.4         c5.1,4.8,7.4,11.8,6.3,18.8c-2.7,18.1-20.4,22.7-36.3,22.9c-18.6,0.3-38.3-3.3-52.7,11.4c-8.5,8.8-12.4,23.3-23.9,29.1         c-16.9,8.6-29.5-12-34.9-25c-4.7-11.8-9.1-23.6-11.5-36.2c-1.3-6.5-1.8-13.4,0.4-19.7c5.2-15.5,21.8-13.2,33.9-19.7         c6.4-3.5,11.1-9,13.8-15.7c4.9-12.2,4.9-25.9,5.8-38.9C55.8,10.4,65.8-4.9,80.3,1.5c6.6,2.9,9.2,9.9,9.6,16.8         C90,22.7,90,27.1,89.9,31.4z" />
                                    </defs>
                                    <clipPath id="abstractShapes11_6">
                                      <use xlinkHref="#abstractShapes11_5" style={{overflow: 'visible'}} />
                                    </clipPath>
                                    <path className="abstract-shapes-11-1 fill-none stroke-white" strokeWidth={3} strokeMiterlimit={10} clipPath="url(#abstractShapes11_6)" d="M44,62.4c0,0-13.6,17.3,11.5,49s2.8,66.3,2.8,66.3" />
                                  </g>
                                </g>
                              </g>
                            </g>
                            <g>
                              <g>
                                <g>
                                  <g>
                                    <defs>
                                      <path id="abstractShapes11_7" d="M89.9,31.4c-0.1,12.4-0.2,24.4,6.6,35.6c4.9,8.1,12.6,14.1,21.5,17.3c11.7,4,26.5,2.3,36,11.4         c5.1,4.8,7.4,11.8,6.3,18.8c-2.7,18.1-20.4,22.7-36.3,22.9c-18.6,0.3-38.3-3.3-52.7,11.4c-8.5,8.8-12.4,23.3-23.9,29.1         c-16.9,8.6-29.5-12-34.9-25c-4.7-11.8-9.1-23.6-11.5-36.2c-1.3-6.5-1.8-13.4,0.4-19.7c5.2-15.5,21.8-13.2,33.9-19.7         c6.4-3.5,11.1-9,13.8-15.7c4.9-12.2,4.9-25.9,5.8-38.9C55.8,10.4,65.8-4.9,80.3,1.5c6.6,2.9,9.2,9.9,9.6,16.8         C90,22.7,90,27.1,89.9,31.4z" />
                                    </defs>
                                    <clipPath id="abstractShapes11_8">
                                      <use xlinkHref="#abstractShapes11_7" style={{overflow: 'visible'}} />
                                    </clipPath>
                                    <path className="abstract-shapes-11-1 fill-none stroke-white" strokeWidth={3} strokeMiterlimit={10} clipPath="url(#abstractShapes11_8)" d="M55,14.3c0,0-16.6,21.3,14.6,60.5c31.2,39.4,4.2,81.7,4.2,81.7" />
                                  </g>
                                </g>
                              </g>
                            </g>
                            <g>
                              <g>
                                <g>
                                  <g>
                                    <defs>
                                      <path id="abstractShapes11_9" d="M89.9,31.4c-0.1,12.4-0.2,24.4,6.6,35.6c4.9,8.1,12.6,14.1,21.5,17.3c11.7,4,26.5,2.3,36,11.4         c5.1,4.8,7.4,11.8,6.3,18.8c-2.7,18.1-20.4,22.7-36.3,22.9c-18.6,0.3-38.3-3.3-52.7,11.4c-8.5,8.8-12.4,23.3-23.9,29.1         c-16.9,8.6-29.5-12-34.9-25c-4.7-11.8-9.1-23.6-11.5-36.2c-1.3-6.5-1.8-13.4,0.4-19.7c5.2-15.5,21.8-13.2,33.9-19.7         c6.4-3.5,11.1-9,13.8-15.7c4.9-12.2,4.9-25.9,5.8-38.9C55.8,10.4,65.8-4.9,80.3,1.5c6.6,2.9,9.2,9.9,9.6,16.8         C90,22.7,90,27.1,89.9,31.4z" />
                                    </defs>
                                    <clipPath id="abstractShapes11_10">
                                      <use xlinkHref="#abstractShapes11_9" style={{overflow: 'visible'}} />
                                    </clipPath>
                                    <path className="abstract-shapes-11-1 fill-none stroke-white" strokeWidth={3} strokeMiterlimit={10} clipPath="url(#abstractShapes11_10)" d="M88.8,5.4c0,0-16.6,21.3,14.6,60.5c31.2,39.3,4.2,81.7,4.2,81.7" />
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </figure>
                  </div>
                </div>
              </div>
              <div className="col-md-7">
                <div className="pl-lg-6">
                  <div className="row">
                    <div className="col-sm-6 mb-5">
                      <h4 className="h5">
                        <span className="btn btn-xs btn-icon btn-soft-primary rounded-circle mr-1">
                          <span className="fas fa-check btn-icon__inner" />
                        </span>
                        Unlimited Projects
                      </h4>
                      <p>Quickly &amp; easily create an unlimited number of projects &amp; gain access to over 25,000 customizable templates.</p>
                    </div>
                    <div className="col-sm-6 mb-5">
                      <h4 className="h5">
                        <span className="btn btn-xs btn-icon btn-soft-primary rounded-circle mr-1">
                          <span className="fas fa-check btn-icon__inner" />
                        </span>
                        Unlimited Downloads
                      </h4>
                      <p>Download an unlimited number of high-quality print files that you can print anywhere.</p>
                    </div>
                  </div>
                  <div className="row mb-9">
                    <div className="col-sm-6 mb-5">
                      <h4 className="h5">
                        <span className="btn btn-xs btn-icon btn-soft-primary rounded-circle mr-1">
                          <span className="fas fa-check btn-icon__inner" />
                        </span>
                        Print &amp; Share Anywhere
                      </h4>
                      <p>Unlock the ability to print or share your project anywhere you want. We make it super easy!</p>
                    </div>
                    <div className="col-sm-6 mb-5">
                      <h4 className="h5">
                        <span className="btn btn-xs btn-icon btn-soft-primary rounded-circle mr-1">
                          <span className="fas fa-check btn-icon__inner" />
                        </span>
                        Cancel anytime
                      </h4>
                      <p>If its not for you, just cancel, no hidden costs or fees.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container space-top-1 space-bottom-3">
          <div className="row">
            <div className="col-lg-8 text-center mx-md-auto mb-9">
              <span className="badge badge-pill btn-soft-success badge-bigger px-4 mb-2 font-weight-medium">Help</span>
              <h2 className="h4 font-weight-medium text-primary">Frequently Asked <span className="font-weight-semi-bold">Questions</span></h2>
            </div>
          </div>
          <div className="row justify-content-lg-center">
            <div className="col-md-6 mb-7">
              <div>
                <h3 className="h5">Can I cancel at anytime</h3>
                <p className="mb-1">Yes, you can cancel your subscription in your dashboard at anytime, no questions asked.</p>
              </div>
            </div>
            <div className="col-md-6 mb-7">
              <div>
                <h3 className="h5">Can I print with you? <span className="badge badge-success font-weight-medium badge-pill ml-1"><small>Popular</small></span></h3>
                <p className="mb-1">Of course! We provide print services in the United States and Canada. <a href="/print">Learn More</a></p>
              </div>
            </div>
            <div className="col-md-6 mb-7">
              <div>
                <h3 className="h5">Do your store my projects forever?</h3>
                <p className="mb-1">Yes, we won't ever delete projects from your account, regardless if you've canceled your account or not.</p>
              </div>
            </div>
            <div className="col-md-6 mb-7">
              <div>
                <h3 className="h5">Can I make changes to my designs?</h3>
                <p className="mb-1">As long as you have an active subscription you can make as many changes to your projects as needed.</p>
              </div>
            </div>
            <div className="col-md-6 mb-7">
              <div>
                <h3 className="h5">Will my subscription auto-renew?</h3>
                <p className="mb-1">Yes, your subscription will automatically renew monthly or annually depending on your billing plan.</p>
              </div>
            </div>
            <div className="col-md-6 mb-7">
              <div>
                <h3 className="h5">How can I contact you?</h3>
                <p className="mb-1">
                  We'd love to hear from you.<br />
                  <a href="https://mycreativeshop.zendesk.com/hc/en-us/requests/new">Message us &gt;</a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="position-relative bg-light gradient-half-primary-v1">
          <div className="container space-2 position-relative z-index-2">
            <div className="row">
              <div className="col-lg-4 mb-7 mb-lg-0">
                <div className="pr-lg-4">
                  <figure className="mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="80px" height="80px" viewBox="0 0 8 8" xmlSpace="preserve">
                      <path className="fill-gray-300" d="M3,1.3C2,1.7,1.2,2.7,1.2,3.6c0,0.2,0,0.4,0.1,0.5c0.2-0.2,0.5-0.3,0.9-0.3c0.8,0,1.5,0.6,1.5,1.5c0,0.9-0.7,1.5-1.5,1.5
                            C1.4,6.9,1,6.6,0.7,6.1C0.4,5.6,0.3,4.9,0.3,4.5c0-1.6,0.8-2.9,2.5-3.7L3,1.3z M7.1,1.3c-1,0.4-1.8,1.4-1.8,2.3
                            c0,0.2,0,0.4,0.1,0.5c0.2-0.2,0.5-0.3,0.9-0.3c0.8,0,1.5,0.6,1.5,1.5c0,0.9-0.7,1.5-1.5,1.5c-0.7,0-1.1-0.3-1.4-0.8
                            C4.4,5.6,4.4,4.9,4.4,4.5c0-1.6,0.8-2.9,2.5-3.7L7.1,1.3z" />
                    </svg>
                  </figure>
                  <div className="h3 font-weight-normal mb-4 text-white">What <span className="font-weight-semi-bold">MyCreativeShop</span> users say about us.</div>
                  <div className="d-flex align-items-center">
                    <ul className="list-inline mr-3 mb-0">
                      <li className="list-inline-item text-warning">
                        <span className="fas fa-star" />
                        <span className="fas fa-star" />
                        <span className="fas fa-star" />
                        <span className="fas fa-star" />
                        <span className="fas fa-star" />
                      </li>
                    </ul>
                    <a className="text-secondary link-muted text-white hover-default" href="/reviews">See Reviews</a>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="js-slick-carousel u-slick u-slick--gutters-3 slick-initialized slick-slider" data-slides-show={2} data-autoplay="true" data-speed={5000} data-infinite="true" data-center-mode="true" data-responsive="[{
                           &quot;breakpoint&quot;: 992,
                           &quot;settings&quot;: {
                             &quot;slidesToShow&quot;: 2
                           }
                         }, {
                           &quot;breakpoint&quot;: 768,
                           &quot;settings&quot;: {
                             &quot;slidesToShow&quot;: 1
                           }
                         }]">
                  <div className="slick-list draggable" style={{padding: '0px'}}><div className="slick-track" style={{opacity: 1, width: '7360px', transform: 'translate3d(-2240px, 0px, 0px)'}}><div className="js-slide my-4 slick-slide slick-cloned" data-slick-index={-3} aria-hidden="true" style={{width: '290px'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>Love this site!!! Extremely easy to use and a lot of templates to choose from!</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Brandy Y., Elite Athletics
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide slick-cloned" data-slick-index={-2} aria-hidden="true" style={{width: '290px'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>Fantastic platform, once you get the hang of things its easy and fun, </p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Peter Q., TR4X
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide slick-cloned" data-slick-index={-1} aria-hidden="true" style={{width: '290px'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>They have just been so amazing to work with and the product is perfect just as I expected.</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Chris Schaefer
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide" data-slick-index={0} aria-hidden="true" style={{width: '290px', height: 'auto'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>Great tool that always makes me look good to my coworkers. This latest update is the best!</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                MarciaS, HOPE worldwide
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide" data-slick-index={1} aria-hidden="true" style={{width: '290px', height: 'auto'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>Amazing!  I have been a longtime customer, lots of great improvements have been made!</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Erica A., Corporate Wellness/Fitness Professional
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide" data-slick-index={2} aria-hidden="true" style={{width: '290px', height: 'auto'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>This site is amazing!  We are so thankful to have come across it.  It will be a staple in our office</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Nicole, M., Holy Name Catholic School
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide" data-slick-index={3} aria-hidden="true" style={{width: '290px', height: 'auto'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>I am AMAZED at how simple it is to work with these templates! The staff has been very responsive</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Matt P., Matt Polson Photography
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide" data-slick-index={4} aria-hidden="true" style={{width: '290px', height: 'auto'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>Its really amazing. I have zero knowledge of designing and I designed this amazing brochure.</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Lalit Sankhe
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide slick-current slick-active slick-center" data-slick-index={5} aria-hidden="false" style={{width: '290px', height: 'auto'}} tabIndex={0}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>Best app ever!  So many easy-to-use templates...makes me look like a pro!</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Laurie W.
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide slick-active" data-slick-index={6} aria-hidden="false" style={{width: '290px', height: 'auto'}} tabIndex={0}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>It's easy for school projects or assignments. Everything is there for you. Just fill it out.</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Vinuk, W., Notre Dame Catholic Secondary School
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide" data-slick-index={7} aria-hidden="true" style={{width: '290px', height: 'auto'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>Love this site!!! Extremely easy to use and a lot of templates to choose from!</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Brandy Y., Elite Athletics
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide" data-slick-index={8} aria-hidden="true" style={{width: '290px', height: 'auto'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>Fantastic platform, once you get the hang of things its easy and fun, </p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Peter Q., TR4X
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide" data-slick-index={9} aria-hidden="true" style={{width: '290px', height: 'auto'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>They have just been so amazing to work with and the product is perfect just as I expected.</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Chris Schaefer
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide slick-cloned" data-slick-index={10} aria-hidden="true" style={{width: '290px'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>Great tool that always makes me look good to my coworkers. This latest update is the best!</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                MarciaS, HOPE worldwide
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide slick-cloned" data-slick-index={11} aria-hidden="true" style={{width: '290px'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>Amazing!  I have been a longtime customer, lots of great improvements have been made!</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Erica A., Corporate Wellness/Fitness Professional
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide slick-cloned" data-slick-index={12} aria-hidden="true" style={{width: '290px'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>This site is amazing!  We are so thankful to have come across it.  It will be a staple in our office</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Nicole, M., Holy Name Catholic School
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide slick-cloned" data-slick-index={13} aria-hidden="true" style={{width: '290px'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>I am AMAZED at how simple it is to work with these templates! The staff has been very responsive</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Matt P., Matt Polson Photography
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide slick-cloned" data-slick-index={14} aria-hidden="true" style={{width: '290px'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>Its really amazing. I have zero knowledge of designing and I designed this amazing brochure.</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Lalit Sankhe
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide slick-cloned" data-slick-index={15} aria-hidden="true" style={{width: '290px'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>Best app ever!  So many easy-to-use templates...makes me look like a pro!</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Laurie W.
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide slick-cloned" data-slick-index={16} aria-hidden="true" style={{width: '290px'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>It's easy for school projects or assignments. Everything is there for you. Just fill it out.</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Vinuk, W., Notre Dame Catholic Secondary School
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide slick-cloned" data-slick-index={17} aria-hidden="true" style={{width: '290px'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>Love this site!!! Extremely easy to use and a lot of templates to choose from!</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Brandy Y., Elite Athletics
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide slick-cloned" data-slick-index={18} aria-hidden="true" style={{width: '290px'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>Fantastic platform, once you get the hang of things its easy and fun, </p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Peter Q., TR4X
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div><div className="js-slide my-4 slick-slide slick-cloned" data-slick-index={19} aria-hidden="true" style={{width: '290px'}} tabIndex={-1}>
                        <div className="card border-0 shadow-sm mb-4">
                          <div className="card-body p-6">
                            <p>They have just been so amazing to work with and the product is perfect just as I expected.</p>
                            <footer className="blockquote-footer">
                              <span className="text-muted">
                                Chris Schaefer
                              </span>
                            </footer>
                          </div>
                        </div>
                      </div></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>  </main>
        </div>
    );
  }
}
