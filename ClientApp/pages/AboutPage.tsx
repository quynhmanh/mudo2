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
        
      <div className="container">
        <div className="row">
          <div className="col-xs-12  col-md-12" role="main">
            <img width={1138} height={493} src="https://www.mycreativeshop.com/learn/wp-content/uploads/2018/03/authors-photo-sm-1138x493.jpg" data-lazy-type="image" data-src="https://www.mycreativeshop.com/learn/wp-content/uploads/2018/03/authors-photo-sm-1138x493.jpg" className="attachment-post-thumbnail size-post-thumbnail wp-post-image lazy-loaded" alt="About us" scale={0} /><noscript>&lt;img width="1138" height="493" src="https://www.mycreativeshop.com/learn/wp-content/uploads/2018/03/authors-photo-sm-1138x493.jpg" class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="About us" /&gt;</noscript>
            {/* Post with featured image */}
            <article className="boxed push-down-45 post-3263 page type-page status-publish has-post-thumbnail hentry">
              {/* Start of the blogpost */}
              <div className="row">
                <div className="col-xs-10  col-xs-offset-1  push-down-30">
                  <div className="post-content">
                    <h1 className="post-content__title  entry-title">About Us</h1>
                    <p>MyCreativeShop is an online design company that allows anyone to create awesome designs that can be printed and shared anywhere. Headquartered out of Fargo, North Dakota, we’ve had the privilege of working with small businesses and individuals all around the world since 2009.</p>
                    <p>At MyCreativeShop, we’re passionate about graphic design and understand how essential it is for any organization to have clear, attractive, and well-designed graphics—whether that means posters for a worldwide travel agency, brochures for a university conference, or flyers for a local fitness center. But we also realize that most small business owners (and their ever-busy employees) simply don’t have time to jump through all the hoops required to brainstorm, design, edit, proof, and print high-quality marketing materials.</p>
                    <p>That’s exactly why we started MyCreativeShop back in 2009, and it’s what we continue to do today: <strong>we make design easy so that you can focus on everything else that matters to your business.</strong></p>
                    <p>Over the last decade, MyCreativeShop customers have used our online editor to make <em>millions of designs</em>—without hiring a graphic designer, without spending tons of time figuring out obscure print specifications, and without having to worry about the final print quality.</p>
                    <p>We make it easy to turn your creative ideas into impactful, beautifully printed materials. You’re free to print them with us or take them to any other printer of your choice. They’re <em>your</em> ideas and your designs; we just help you bring them to life!</p>
                    <p><a href="https://mycreativeshop.com/templates"><img className="alignnone size-full wp-image-3454 lazy-loaded" style={{borderRadius: '25px'}} src="https://www.mycreativeshop.com/learn/wp-content/uploads/2018/11/blog-animated-graphic-bottom.gif" data-lazy-type="image" data-src="https://www.mycreativeshop.com/learn/wp-content/uploads/2018/11/blog-animated-graphic-bottom.gif" alt="Pick A Template" width={720} height={400} scale={0} /><noscript>&lt;img class="alignnone size-full wp-image-3454" style="border-radius: 25px;" src="https://www.mycreativeshop.com/learn/wp-content/uploads/2018/11/blog-animated-graphic-bottom.gif" alt="Pick A Template" width="720" height="400" /&gt;</noscript></a></p>
                    <h2>Our story</h2>
                    <p>MyCreativeShop was founded in 2009 by Jason Frueh, who was quickly joined by friend and business partner Dustin Hodgson.</p>
                    <p>Jason left his job at Microsoft to take on the challenge of owning his own business, and together Jason and Dustin have seen MyCreativeShop grow from a simple one-man operation (run out of Jason’s basement!) to a business with millions of users around the globe.</p>
                    <p>We started MyCreativeShop with a personal touch: no advertising, no venture capital, no outbound sales team. We may not be your typical tech start-up story, with millions raised before even a single dollar is made… but we like it that way! By keeping our business small and tightly focused, we’ve been able to build real relationships with our clients and use their feedback to continuously improve our services.</p>
                    <p>Today, we still operate as a close-knit team—just Jason, Dustin, and a handful of talented writers and designers from around the United States. Jason and Dustin continue to personally manage and respond to all of our customers’ support inquiries, usually within 24 hours.</p>
                    <p>Although MyCreativeShop has certainly grown, our mission has never changed: we make design easy for everyone.</p>
                    <p>Want to hear from our customers? Check out these <a href="https://www.mycreativeshop.com/reviews">customer reviews.</a></p>
                    <h2>Where are we located?</h2>
                    <p>Our business headquarters is located in Fargo, North Dakota.<br />
                      <strong><br />
                        Address:</strong><br />
                      3003 32nd Ave S<br />
                      Fargo, North Dakota 58104<br />
                      United States</p>
                    <p><span style={{fontWeight: 400}}>But we’re always reachable right here! If you have any questions about what we do or how we can help your business, just fill out our</span> <a href="https://mycreativeshop.zendesk.com/hc/en-us/requests/new">contact form</a>.</p>
                    <h2>Our Team</h2>
                    <p><span style={{fontWeight: 400}}>MyCreativeShop simplifies design for millions of business owners and individuals around the world thanks to our dedicated, hardworking team. Meet the people who work together to make design easy.</span></p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
        </div>
    );
  }
}
