import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Helmet } from "react-helmet";
import TreeViewContainer from '@Components/shared/TreeViewContainer';

type Props = RouteComponentProps<{}>;

export default class TemplatesPage extends React.Component<Props, {textTemplates, templates, navbarPositionFixed}> {
    constructor(props) {
        super(props);

        var templates = [];
        for (var i = 0; i < 6; ++i)
        {
            templates.push({ document: {
                width: 100,
                height: 150,
            }})
        }
        var textTemplates = [];
        for (var i = 0; i < 6; ++i)
        {
            textTemplates.push({ document: {
                width: 100,
                height: 150,
            }})
        }

        this.state = {
            templates,
            textTemplates,
            navbarPositionFixed: false,
        }
    }

    componentDidMount() {
      var scrollStopper = this.delayedExec(100, this.handleScroll.bind(this));

      window.addEventListener('scroll', this.handleScroll);
        var self = this;
        var url = `http://localhost:64099/api/Template/Search?type=1`;
        fetch(url, {
        mode: 'cors'
        })
        .then(response => response.text())
        .then(html => {
            var templates = JSON.parse(html).value;
            templates = templates.map(template => {
            template.document = JSON.parse(template.document)
                return template
            })
            self.setState({ templates });
        });

        url = `http://localhost:64099/api/Template/Search?type=2`;
        fetch(url, {
        mode: 'cors'
        })
        .then(response => response.text())
        .then(html => {
            var templates = JSON.parse(html).value;
            templates = templates.map(template => {
            template.document = JSON.parse(template.document)
                return template
            })
            self.setState({ textTemplates: templates });
        });
    }

   delayedExec = function(after, fn) {
      var timer;
      return function() {
          timer && clearTimeout(timer);
          timer = setTimeout(fn, after);
      };
  };

    handleScroll = () => {
        var navbarContent = document.getElementById('hero');
        const bottom = navbarContent.getBoundingClientRect().bottom;
        this.setState({navbarPositionFixed: bottom <= 0,});
    }

    render() {
        const { templates, textTemplates, navbarPositionFixed } = this.state;

        return <div>
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
            id="hero"
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
              className="img-fluid" src="https://www.moo.com/dam/jcr:b67385ae-26b2-4a5c-b82d-b2f26f72be36/CRB-6346-BC-Cat-Hero-3840x700-UKUS.jpg" alt="Search Print Design Templates"/>
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
      </header>
            </div>

            <div 
            id="navbar-content"
            style={{
                boxShadow: this.state.navbarPositionFixed ? '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' : 'inset 0 -0.0625rem 0 #dfe3e7',
                position: this.state.navbarPositionFixed ? 'fixed' : 'relative',
                top: this.state.navbarPositionFixed ? 0 : null,
                width: '100%',
            }} className="band sticky-nav js-fnx-sticky-nav u-padding-0 is-visible" data-is-visible-small-viewport="false">
        <div className="">
          <nav className="sticky-nav__nav u-position-relative u-overflow-hidden u-textAlign-center">
            <div style={{position: 'absolute'}} className="sticky-nav__logo u-center-transform-y js-fnx-sticky-nav-moo-drop">
              <a href="#htmlBody">
                <svg style={{height: '30px'}} viewBox="0 0 48 48" className="svg-icon" role="presentation" aria-hidden="true" data-icon-id="ui--moo-drop-bold"><path d="M24 44.015a13.46 13.46 0 0 1-8.86-3.133 15.619 15.619 0 0 1-1.165-1.055 13.649 13.649 0 0 1-4.135-9.973 13.565 13.565 0 0 1 1.713-6.764c.067-.137.339-.681 11.151-19.259a1.5 1.5 0 0 1 2.592 0C36.108 22.409 36.38 22.953 36.483 23.158a13.478 13.478 0 0 1 1.677 6.7 13.65 13.65 0 0 1-4.136 9.974 13.643 13.643 0 0 1-8.5 4.129c-.519.039-1.012.054-1.524.054zm0-36.448c-7.75 13.322-9.627 16.6-9.8 16.935a10.681 10.681 0 0 0-1.359 5.352 10.612 10.612 0 0 0 3.259 7.853 12.809 12.809 0 0 0 .952.861A10.411 10.411 0 0 0 24 41.015q.651 0 1.254-.046a10.565 10.565 0 0 0 6.646-3.253 10.623 10.623 0 0 0 3.265-7.862 10.592 10.592 0 0 0-1.325-5.287c-.212-.401-2.09-3.678-9.84-17z" /></svg>                    <span className="u-visually-hidden">MOO</span>
              </a>
            </div>
            <ul style={{marginBottom: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)'}} className="sticky-nav__list u-center-transform-x js-fnx-sticky-nav-list js-scrollspy-nav">
              <li style={{display: 'inline-block', marginRight: '10px',}} className="sticky-nav__item u-display-none">
                <a style={{padding: '1rem 0.625rem', display: 'block'}} href="#01" className="sticky-nav__link js-fnx-sticky-nav-link js-ga-click-track" data-ga-event-action="sticky-nav">
                  01
                </a>                  </li>
              <li style={{display: 'inline-block', marginRight: '10px',}} className="sticky-nav__item">
                <a style={{padding: '1rem 0.625rem', display: 'block'}} href="#shopByPaper" className="sticky-nav__link js-fnx-sticky-nav-link js-ga-click-track" data-ga-event-action="sticky-nav">
                  Shop By Paper
                </a>                  </li>
              <li style={{display: 'inline-block', marginRight: '10px',}} className="sticky-nav__item">
                <a style={{padding: '1rem 0.625rem', display: 'block'}} href="#shopbysize" className="sticky-nav__link js-fnx-sticky-nav-link js-ga-click-track" data-ga-event-action="sticky-nav">
                  Shop By Size
                </a>                  </li>
              <li style={{display: 'inline-block', marginRight: '10px',}} className="sticky-nav__item">
                <a style={{padding: '1rem 0.625rem', display: 'block'}} href="#shopbyspecialfinish" className="sticky-nav__link js-fnx-sticky-nav-link js-ga-click-track" data-ga-event-action="sticky-nav">
                  Shop by Special Finish
                </a>                  </li>
              <li style={{display: 'inline-block', marginRight: '10px',}} className="sticky-nav__item u-display-none">
                <a style={{padding: '1rem 0.625rem', display: 'block'}} href="#013" className="sticky-nav__link js-fnx-sticky-nav-link js-ga-click-track" data-ga-event-action="sticky-nav">
                  013
                </a>                  </li>
              <li style={{display: 'inline-block', marginRight: '10px',}} className="sticky-nav__item">
                <a style={{padding: '1rem 0.625rem', display: 'block'}} href="#designingyourcards" className="sticky-nav__link js-fnx-sticky-nav-link js-ga-click-track" data-ga-event-action="sticky-nav">
                  Designing Your Cards
                </a>                  </li>
              <li style={{display: 'inline-block', marginRight: '10px',}} className="sticky-nav__item u-display-none">
                <a style={{padding: '1rem 0.625rem', display: 'block'}} href="#getstarted" className="sticky-nav__link js-fnx-sticky-nav-link js-ga-click-track" data-ga-event-action="sticky-nav">
                  016
                </a>                  </li>
              <li style={{display: 'inline-block', marginRight: '10px',}} className="sticky-nav__item">
                <a style={{padding: '1rem 0.625rem', display: 'block'}} href="#whymoo" className="sticky-nav__link js-fnx-sticky-nav-link js-ga-click-track" data-ga-event-action="sticky-nav">
                  Why MOO?
                </a>                  </li>
              <li style={{display: 'inline-block', marginRight: '10px',}} className="sticky-nav__item u-display-none">
                <a style={{padding: '1rem 0.625rem', display: 'block'}} href="#07" className="sticky-nav__link js-fnx-sticky-nav-link js-ga-click-track" data-ga-event-action="sticky-nav">
                  07
                </a>                  </li>
              <li style={{display: 'inline-block', marginRight: '10px',}} className="sticky-nav__item u-display-none">
                <a style={{padding: '1rem 0.625rem', display: 'block'}} href="#012" className="sticky-nav__link js-fnx-sticky-nav-link js-ga-click-track" data-ga-event-action="sticky-nav">
                  012
                </a>                  </li>
              <li style={{display: 'inline-block', marginRight: '10px',}} className="sticky-nav__item u-display-none">
                <a style={{padding: '1rem 0.625rem', display: 'block'}} href="#010" className="sticky-nav__link js-fnx-sticky-nav-link js-ga-click-track" data-ga-event-action="sticky-nav">
                  010
                </a>                  </li>
              <li style={{display: 'inline-block', marginRight: '10px',}} className="sticky-nav__item u-display-none">
                <a style={{padding: '1rem 0.625rem', display: 'block'}} href="#08" className="sticky-nav__link js-fnx-sticky-nav-link js-ga-click-track" data-ga-event-action="sticky-nav">
                  08
                </a>                  </li>
            </ul>
            <div style={{backgroundColor: 'white'}} className="sticky-nav__cta-wrap u-center-transform-y js-fnx-sticky-nav-cta">
              <a style={{padding: '1rem 0.625rem'}} href="#shopbysize" className="btn -small
js-ga-click-track" data-ga-event-action="sticky-nav" data-ga-event-label="#shopbysize || Start Making" id="stickyNavCta">
                Start Making
              </a>              </div>
          </nav>
        </div>
      </div>
          </div>
      <section style={{padding: '30px 0'}}>
      <div className="">
          
      <section id="shopByPaper" className="
    band
        -module
        u-backgroundColor-white
    
    
    js-component">
        <div className="container">
          <div className="u-textAlign-center">
            <header className="module-header list-default__parent u-last-child-margin-bottom-0 ">
              <h2 style={{textAlign: 'center'}} className="h__module">Shop Business Cards by Paper</h2>
              <p style={{textAlign: 'center'}} className="p__lead">You can’t go wrong. We start at premium and go all the way to extra fancy.</p>
            </header>
          </div>
          <div className>
            <div style={{display: 'flex'}} className="tile-rack__container layout--row-spacing u-display-flex u-flexWrap-wrap  js-tile-rack-slider" role="toolbar">
              <div style={{width: '25%', paddingLeft: '10px', display: 'table',}} className="tile-rack__tile-wrap layout__item u-display-flex u-1/4@medium js-tile-wrap" tabIndex={-1} role="option" aria-describedby="slick-slide40">
                <div className="tile
                -link
            u-textAlign-left
            js-tile
" style={{display: 'table'}}>
                  <div className="tile__body list-default__parent">
                    <div className="tile__media-wrap">
                      <a href="/us/business-cards/original" className="tile__image-link js-ga-click-track js-tile-image-link" data-ga-event-action="tile" data-ga-event-label="/us/business-cards/original || Shop Original" tabIndex={-1}>
                        <figure className="tile__figure u-margin-0">
                          <img style={{maxWidth: '100%'}} src="https://www.moo.com/dam/jcr:72d886d2-746a-4c68-a311-c55a9d80b615/paper-module-original-2-752x564.jpg" alt="Original Business Cards" title="Original Business Cards" className="tile__image" />
                          <figcaption className="u-visually-hidden">Original Business Cards - 16 PT</figcaption>
                          <div className="capsule tile__capsule">16 PT</div>
                        </figure>
                      </a>
                    </div>
                    <div className="tile__text-wrap">
                      <div className="tile__text-wrap-inner">
                        <h3 className="h__block u-marginBottom-xxxs">
                          Original Business Cards
                        </h3>
                        <p className="u-marginBottom-xs">
                          <span className="u-fontSize-s">
                            <span className="u-fontFamily-secondaryMedium">50</span>
                            cards
                            from
                          </span>
                          <span className="price__price-with-tax-wrap">
                            <span className="price__display-price">
                              <span className="u-fontFamily-secondaryMedium u-color-dark" data-price-to-display>$19.99</span>
                            </span>
                          </span>
                        </p>
                        <ul>
                          <li>Our “feel good” premium paper</li>
                          <li>Great quality and great value</li>
                          <li>Available in gloss or matte finishes</li>
                        </ul>
                      </div>
                      <a href="/us/business-cards/original" className="tile__horizontal-footer-link js-ga-click-track" data-ga-event-action="tile" data-ga-event-label="/us/business-cards/original || Shop Original" tabIndex={-1}>
                        <div className="tile__text-wrap-inner tile__horizontal-footer cta-link__wrap u-paddingTop-0">
                          <div className="cta-link -has-chevron">
                            <span className="cta-link__text">
                              <span>Shop Original</span>&nbsp;<svg style={{width: '1em',}} viewBox="0 0 48 48" className="svg-icon cta-link__chevron" role="presentation" aria-hidden="true" data-icon-id="ui--chevron-right-xxbold"><path d="M14.663 13.813l10.186 10.186-10.186 10.175 4.24 4.244 14.434-14.417L18.905 9.57l-4.242 4.243z" /></svg>
                            </span>
                          </div>      </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{width: '25%', paddingLeft: '10px', display: 'table',}} className="tile-rack__tile-wrap layout__item u-display-flex u-1/4@medium js-tile-wrap" tabIndex={-1} role="option" aria-describedby="slick-slide41">
                <div className="tile
                -link
            u-textAlign-left
            js-tile
" style={{display: 'table'}}>
                  <div className="tile__body list-default__parent">
                    <div className="tile__media-wrap">
                      <a href="/us/business-cards/cotton" className="tile__image-link js-ga-click-track js-tile-image-link" data-ga-event-action="tile" data-ga-event-label="/us/business-cards/cotton || Shop Cotton" tabIndex={-1}>
                        <figure className="tile__figure u-margin-0">
                          <img style={{maxWidth: '100%'}} src="https://www.moo.com/dam/jcr:72d886d2-746a-4c68-a311-c55a9d80b615/paper-module-original-2-752x564.jpg" alt="Cotton Business Cards" title="Cotton Business Cards" className="tile__image" />
                          <figcaption className="u-visually-hidden">Cotton Business Cards - 18 PT</figcaption>
                          <div className="capsule tile__capsule">18 PT</div>
                        </figure>
                      </a>
                    </div>
                    <div className="tile__text-wrap">
                      <div className="tile__text-wrap-inner">
                        <h3 className="h__block u-marginBottom-xxxs">
                          Cotton Business Cards
                        </h3>
                        <p className="u-marginBottom-xs">
                          <span className="u-fontSize-s">
                            <span className="u-fontFamily-secondaryMedium">50</span>
                            cards
                            from
                          </span>
                          <span className="price__price-with-tax-wrap">
                            <span className="price__display-price">
                              <span className="u-fontFamily-secondaryMedium u-color-dark" data-price-to-display>$26.99</span>
                            </span>
                          </span>
                        </p>
                        <ul>
                          <li>Made from recycled T-shirt fabric</li>
                          <li>Uncoated and naturally bright white</li>
                          <li>Lightweight yet incredibly durable</li>
                        </ul>
                      </div>
                      <a href="/us/business-cards/cotton" className="tile__horizontal-footer-link js-ga-click-track" data-ga-event-action="tile" data-ga-event-label="/us/business-cards/cotton || Shop Cotton" tabIndex={-1}>
                        <div className="tile__text-wrap-inner tile__horizontal-footer cta-link__wrap u-paddingTop-0">
                          <div className="cta-link -has-chevron">
                            <span className="cta-link__text">
                              <span>Shop Cotton</span>&nbsp;<svg style={{width: '1em',}} viewBox="0 0 48 48" className="svg-icon cta-link__chevron" role="presentation" aria-hidden="true" data-icon-id="ui--chevron-right-xxbold"><path d="M14.663 13.813l10.186 10.186-10.186 10.175 4.24 4.244 14.434-14.417L18.905 9.57l-4.242 4.243z" /></svg>
                            </span>
                          </div>      </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div><div style={{width: '25%', paddingLeft: '10px', display: 'table',}} className="tile-rack__tile-wrap layout__item u-display-flex u-1/4@medium js-tile-wrap" tabIndex={-1} role="option" aria-describedby="slick-slide42">
                <div className="tile
                -link
            u-textAlign-left
            js-tile
" style={{display: 'table'}}>
                  <div className="tile__body list-default__parent">
                    <div className="tile__media-wrap">
                      <a href="/us/business-cards/super" className="tile__image-link js-ga-click-track js-tile-image-link" data-ga-event-action="tile" data-ga-event-label="/us/business-cards/super || Shop Super" tabIndex={-1}>
                        <figure className="tile__figure u-margin-0">
                          <img style={{maxWidth: '100%'}} src="https://www.moo.com/dam/jcr:72d886d2-746a-4c68-a311-c55a9d80b615/paper-module-original-2-752x564.jpg" alt="Super Business Cards" title="Super Business Cards" className="tile__image" />
                          <figcaption className="u-visually-hidden">Super Business Cards - 19 PT</figcaption>
                          <div className="capsule tile__capsule">19 PT</div>
                        </figure>
                      </a>
                    </div>
                    <div className="tile__text-wrap">
                      <div className="tile__text-wrap-inner">
                        <h3 className="h__block u-marginBottom-xxxs">
                          Super Business Cards
                        </h3>
                        <p className="u-marginBottom-xs">
                          <span className="u-fontSize-s">
                            <span className="u-fontFamily-secondaryMedium">50</span>
                            cards
                            from
                          </span>
                          <span className="price__price-with-tax-wrap">
                            <span className="price__display-price">
                              <span className="u-fontFamily-secondaryMedium u-color-dark" data-price-to-display>$26.99</span>
                            </span>
                          </span>
                        </p>
                        <ul>
                          <li>Silky smooth, strong and durable</li>
                          <li>Available in Soft Touch or High Gloss</li>
                          <li>Customizable with special design finishes</li>
                        </ul>
                      </div>
                      <a href="/us/business-cards/super" className="tile__horizontal-footer-link js-ga-click-track" data-ga-event-action="tile" data-ga-event-label="/us/business-cards/super || Shop Super" tabIndex={-1}>
                        <div className="tile__text-wrap-inner tile__horizontal-footer cta-link__wrap u-paddingTop-0">
                          <div className="cta-link -has-chevron">
                            <span className="cta-link__text">
                              <span>Shop Super</span>&nbsp;<svg style={{width: '1em',}} viewBox="0 0 48 48" className="svg-icon cta-link__chevron" role="presentation" aria-hidden="true" data-icon-id="ui--chevron-right-xxbold"><path d="M14.663 13.813l10.186 10.186-10.186 10.175 4.24 4.244 14.434-14.417L18.905 9.57l-4.242 4.243z" /></svg>
                            </span>
                          </div>      </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div><div style={{width: '25%', paddingLeft: '10px', display: 'table',}} className="tile-rack__tile-wrap layout__item u-display-flex u-1/4@medium js-tile-wrap" tabIndex={-1} role="option" aria-describedby="slick-slide43">
                <div className="tile
                -link
            u-textAlign-left
            js-tile
" style={{display: 'table'}}>
                  <div className="tile__body list-default__parent">
                    <div className="tile__media-wrap">
                      <a href="/us/business-cards/luxe" className="tile__image-link js-ga-click-track js-tile-image-link" data-ga-event-action="tile" data-ga-event-label="/us/business-cards/luxe || Shop Luxe" tabIndex={-1}>
                        <figure className="tile__figure u-margin-0">
                          <img style={{maxWidth: '100%'}} src="https://www.moo.com/dam/jcr:72d886d2-746a-4c68-a311-c55a9d80b615/paper-module-original-2-752x564.jpg" alt="Luxe Business Cards" title="Luxe Business Cards" className="tile__image" />
                          <figcaption className="u-visually-hidden">Luxe Business Cards - 32 PT</figcaption>
                          <div className="capsule tile__capsule">32 PT</div>
                        </figure>
                      </a>
                    </div>
                    <div className="tile__text-wrap">
                      <div className="tile__text-wrap-inner">
                        <h3 className="h__block u-marginBottom-xxxs">
                          Luxe Business Cards
                        </h3>
                        <p className="u-marginBottom-xs">
                          <span className="u-fontSize-s">
                            <span className="u-fontFamily-secondaryMedium">50</span>
                            cards
                            from
                          </span>
                          <span className="price__price-with-tax-wrap">
                            <span className="price__display-price">
                              <span className="u-fontFamily-secondaryMedium u-color-dark" data-price-to-display>$34.99</span>
                            </span>
                          </span>
                        </p>
                        <ul>
                          <li>Extra-thick Mohawk Superfine® luxury paper&nbsp;</li>
                          <li>Choice of eight eye-catching color seams</li>
                          <li>Naturally textured – write on either side!</li>
                        </ul>
                      </div>
                      <a href="/us/business-cards/luxe" className="tile__horizontal-footer-link js-ga-click-track" data-ga-event-action="tile" data-ga-event-label="/us/business-cards/luxe || Shop Luxe" tabIndex={-1}>
                        <div className="tile__text-wrap-inner tile__horizontal-footer cta-link__wrap u-paddingTop-0">
                          <div className="cta-link -has-chevron">
                            <span className="cta-link__text">
                              <span>Shop Luxe</span>&nbsp;<svg style={{width: '1em',}} viewBox="0 0 48 48" className="svg-icon cta-link__chevron" role="presentation" aria-hidden="true" data-icon-id="ui--chevron-right-xxbold"><path d="M14.663 13.813l10.186 10.186-10.186 10.175 4.24 4.244 14.434-14.417L18.905 9.57l-4.242 4.243z" /></svg>
                            </span>
                          </div>      </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div></div>
          </div>
        </div>
      </section>
      
      <section style={{backgroundColor: '#f3f4f6'}} id="shopbysize" className="band -module size-module        u-backgroundColor-neutralTint
 js-size-module js-component">
        <div className="container">
          <div className="u-textAlign-center">
            <header className="module-header list-default__parent u-last-child-margin-bottom-0 ">
              <h2 style={{textAlign: 'center',}} className="h__module">Shop Business Cards by Size</h2>
              <p style={{textAlign: 'center',}} className="p__lead">From standard to mini, you’ll get a perfect fit for your business.</p>
            </header>
          </div>
        <div className="u-justifyContent-center@medium">
          <div style={{display: 'flex'}} className="u-display-flex@medium u-justifyContent-center@medium u-margin-0@medium layout--row-spacing-large js-equal-height-parent">
            <div style={{width: '25%', paddingLeft: '10px', display: 'table',}} className="layout__item size-module__layout-item u-display-flex@medium -animate  u-padding-0@medium js-size-block-wrap">
              <figure className="size-block has-link cta-link__wrap">
                <a href="/us/business-cards/standard-size" className="size-block__image-wrap js-ga-click-track" tabIndex={-1} data-ga-event-action="size-block" data-ga-event-label="/us/business-cards/standard-size || Make Standard">
                  <div className="u-overflow-hidden">
                    <img style={{maxWidth: '100%'}} src="https://www.moo.com/dam/jcr:72d886d2-746a-4c68-a311-c55a9d80b615/paper-module-original-2-752x564.jpg"  alt="US Business Card image for sizes module" className="size-block__image" />
                  </div>
                </a>
                <figcaption className="size-block__info-wrap u-textAlign-center js-equal-height-child" style={{height: 'auto'}}>
                  <div className="js-equal-height-child-2" style={{height: 'auto'}}>
                    <h3 className="h__block">Standard Business Cards</h3>
                    <p className="u-margin-0">
                      3.5" x 2.0"
                    </p>
                    <p className="u-margin-0">
                      <span className="u-fontSize-s">
                        <span className="u-fontFamily-secondaryMedium">50</span>
                        cards
                        from
                      </span>
                      <span className="price__price-with-tax-wrap" data-experiment-key="pricing_e2e_do_not_delete" data-variation-key>
                        <span className="price__display-price">
                          <span className="u-fontFamily-secondaryMedium u-color-dark" data-price-to-display>$19.99</span>
                        </span>
                      </span>
                    </p>
                  </div>
                  <a href="/us/business-cards/standard-size" className="cta-link -has-chevron u-width-100 u-paddingTop-xs
js-ga-click-track" data-ga-event-action="size-block" data-ga-event-label="/us/business-cards/standard-size || Make Standard">
                    <span className="cta-link__text">
                      <span>Make Standard</span>&nbsp;<svg style={{width: '1em',}} viewBox="0 0 48 48" className="svg-icon cta-link__chevron" role="presentation" aria-hidden="true" data-icon-id="ui--chevron-right-xxbold"><path d="M14.663 13.813l10.186 10.186-10.186 10.175 4.24 4.244 14.434-14.417L18.905 9.57l-4.242 4.243z" /></svg>
                    </span>
                  </a>  </figcaption>
              </figure>
            </div>
            <div style={{width: '25%', paddingLeft: '10px', display: 'table',}} className="layout__item size-module__layout-item u-display-flex@medium -animate  u-padding-0@medium js-size-block-wrap">
              <figure className="size-block has-link cta-link__wrap">
                <a href="/us/business-cards/moo-size" className="size-block__image-wrap js-ga-click-track" tabIndex={-1} data-ga-event-action="size-block" data-ga-event-label="/us/business-cards/moo-size || Make MOO size">
                  <div className="u-overflow-hidden">
                    <img style={{maxWidth: '100%'}} src="https://www.moo.com/dam/jcr:72d886d2-746a-4c68-a311-c55a9d80b615/paper-module-original-2-752x564.jpg"  alt="UK Business Card image for sizes module" className="size-block__image" />
                  </div>
                </a>
                <figcaption className="size-block__info-wrap u-textAlign-center js-equal-height-child" style={{height: 'auto'}}>
                  <div className="js-equal-height-child-2" style={{height: 'auto'}}>
                    <h3 className="h__block">MOO Size Business Cards</h3>
                    <p className="u-margin-0">
                      3.3" x 2.16"
                    </p>
                    <p className="u-margin-0">
                      <span className="u-fontSize-s">
                        <span className="u-fontFamily-secondaryMedium">50</span>
                        cards
                        from
                      </span>
                      <span className="price__price-with-tax-wrap">
                        <span className="price__display-price">
                          <span className="u-fontFamily-secondaryMedium u-color-dark" data-price-to-display>$19.99</span>
                        </span>
                      </span>
                    </p>
                  </div>
                  <a href="/us/business-cards/moo-size" className="cta-link -has-chevron u-width-100 u-paddingTop-xs
js-ga-click-track" data-ga-event-action="size-block" data-ga-event-label="/us/business-cards/moo-size || Make MOO size">
                    <span className="cta-link__text">
                      <span>Make MOO size</span>&nbsp;<svg style={{width: '1em',}} viewBox="0 0 48 48" className="svg-icon cta-link__chevron" role="presentation" aria-hidden="true" data-icon-id="ui--chevron-right-xxbold"><path d="M14.663 13.813l10.186 10.186-10.186 10.175 4.24 4.244 14.434-14.417L18.905 9.57l-4.242 4.243z" /></svg>
                    </span>
                  </a>  </figcaption>
              </figure>
            </div>
            <div style={{width: '25%', paddingLeft: '10px', display: 'table',}} className="layout__item size-module__layout-item u-display-flex@medium -animate  u-padding-0@medium js-size-block-wrap">
              <figure className="size-block has-link cta-link__wrap">
                <a href="/us/business-cards/square" className="size-block__image-wrap js-ga-click-track" tabIndex={-1} data-ga-event-action="size-block" data-ga-event-label="/us/business-cards/square || Make Square">
                  <div className="u-overflow-hidden">
                    <img style={{maxWidth: '100%'}} src="https://www.moo.com/dam/jcr:72d886d2-746a-4c68-a311-c55a9d80b615/paper-module-original-2-752x564.jpg"  alt="Square Business Card Size Comparison Image" className="size-block__image" />
                  </div>
                </a>
                <figcaption className="size-block__info-wrap u-textAlign-center js-equal-height-child" style={{height: 'auto'}}>
                  <div className="js-equal-height-child-2" style={{height: 'auto'}}>
                    <h3 className="h__block">Square Business Cards</h3>
                    <p className="u-margin-0">
                      2.56" x 2.56"
                    </p>
                    <p className="u-margin-0">
                      <span className="u-fontSize-s">
                        <span className="u-fontFamily-secondaryMedium">50</span>
                        cards
                        from
                      </span>
                      <span className="price__price-with-tax-wrap">
                        <span className="price__display-price">
                          <span className="u-fontFamily-secondaryMedium u-color-dark" data-price-to-display>$22.99</span>
                        </span>
                      </span>
                    </p>
                  </div>
                  <a href="/us/business-cards/square" className="cta-link -has-chevron u-width-100 u-paddingTop-xs
js-ga-click-track" data-ga-event-action="size-block" data-ga-event-label="/us/business-cards/square || Make Square">
                    <span className="cta-link__text">
                      <span>Make Square</span>&nbsp;<svg style={{width: '1em',}} viewBox="0 0 48 48" className="svg-icon cta-link__chevron" role="presentation" aria-hidden="true" data-icon-id="ui--chevron-right-xxbold"><path d="M14.663 13.813l10.186 10.186-10.186 10.175 4.24 4.244 14.434-14.417L18.905 9.57l-4.242 4.243z" /></svg>
                    </span>
                  </a>  </figcaption>
              </figure>
            </div>
            <div style={{width: '25%', paddingLeft: '10px', display: 'table',}} className="layout__item size-module__layout-item u-display-flex@medium -animate  u-padding-0@medium js-size-block-wrap">
              <figure className="size-block has-link cta-link__wrap">
                <a href="/us/business-cards/minicards" className="size-block__image-wrap js-ga-click-track" style={{backgroundImage: 'url(/dam/jcr:61a4bc22-e9fc-468c-a34d-1c3af7245f0c/size-module-rcbc-props-x5880.png)'}} tabIndex={-1} data-ga-event-action="size-block" data-ga-event-label="/us/business-cards/minicards || Make Mini">
                  <div className="u-overflow-hidden">
                    <img style={{maxWidth: '100%'}} src="https://www.moo.com/dam/jcr:72d886d2-746a-4c68-a311-c55a9d80b615/paper-module-original-2-752x564.jpg"  alt="MiniCard size comparison image" className="size-block__image" />
                  </div>
                </a>
                <figcaption className="size-block__info-wrap u-textAlign-center js-equal-height-child" style={{height: 'auto'}}>
                  <div className="js-equal-height-child-2" style={{height: 'auto'}}>
                    <h3 className="h__block">Mini Business Cards</h3>
                    <p className="u-margin-0">
                      2.75" x 1.1"
                    </p>
                    <p className="u-margin-0">
                      <span className="u-fontSize-s">
                        <span className="u-fontFamily-secondaryMedium">100</span>
                        cards
                        from
                      </span>
                      <span className="price__price-with-tax-wrap">
                        <span className="price__display-price">
                          <span className="u-fontFamily-secondaryMedium u-color-dark" data-price-to-display>$19.99</span>
                        </span>
                      </span>
                    </p>
                  </div>
                  <a href="/us/business-cards/minicards" className="cta-link -has-chevron u-width-100 u-paddingTop-xs
js-ga-click-track" data-ga-event-action="size-block" data-ga-event-label="/us/business-cards/minicards || Make Mini">
                    <span className="cta-link__text">
                      <span>Make Mini</span>&nbsp;<svg style={{width: '1em',}} viewBox="0 0 48 48" className="svg-icon cta-link__chevron" role="presentation" aria-hidden="true" data-icon-id="ui--chevron-right-xxbold"><path d="M14.663 13.813l10.186 10.186-10.186 10.175 4.24 4.244 14.434-14.417L18.905 9.57l-4.242 4.243z" /></svg>
                    </span>
                  </a>  </figcaption>
              </figure>
            </div>
          </div>
          <div className="layout u-display-flex@medium u-justifyContent-center@medium u-margin-0@medium">
            <div className="layout__item size-module__layout-item u-display-flex@medium  u-padding-0 js-size-block-wrap-measure" />
            <div className="layout__item size-module__layout-item u-display-flex@medium  u-padding-0 js-size-block-wrap-measure" />
            <div className="layout__item size-module__layout-item u-display-flex@medium  u-padding-0 js-size-block-wrap-measure" />
            <div className="layout__item size-module__layout-item u-display-flex@medium  u-padding-0 js-size-block-wrap-measure" />
          </div>
        </div>
        </div>
      </section>
      <section style={{backgroundColor: '#f3f4f6 !important'}} id="shopbysize" className="band -module size-module        u-backgroundColor-neutralTint
 js-size-module js-component">
        <div className="container">
          <div className="u-textAlign-center">
            <header className="module-header list-default__parent u-last-child-margin-bottom-0 ">
              <h2 style={{textAlign: 'center',}} className="h__module">Shop by Special Finish</h2>
              <p style={{textAlign: 'center',}} className="p__lead">Want to create Business Cards with Special Finishes? Click here!</p>
            </header>
          </div>
        <div className="u-justifyContent-center@medium">
          <div style={{display: 'flex'}} className="u-display-flex@medium u-justifyContent-center@medium u-margin-0@medium layout--row-spacing-large js-equal-height-parent">
            <div style={{width: '25%', paddingLeft: '10px', display: 'table',}} className="layout__item size-module__layout-item u-display-flex@medium -animate  u-padding-0@medium js-size-block-wrap">
              <figure className="size-block has-link cta-link__wrap">
                <a href="/us/business-cards/standard-size" className="size-block__image-wrap js-ga-click-track" tabIndex={-1} data-ga-event-action="size-block" data-ga-event-label="/us/business-cards/standard-size || Make Standard">
                  <div className="u-overflow-hidden">
                    <img style={{maxWidth: '100%'}} src="https://www.moo.com/dam/jcr:72d886d2-746a-4c68-a311-c55a9d80b615/paper-module-original-2-752x564.jpg"  alt="US Business Card image for sizes module" className="size-block__image" />
                  </div>
                </a>
                <figcaption className="size-block__info-wrap u-textAlign-center js-equal-height-child" style={{height: 'auto'}}>
                  <div className="js-equal-height-child-2" style={{height: 'auto'}}>
                    <h3 className="h__block">Standard Business Cards</h3>
                    <p className="u-margin-0">
                      3.5" x 2.0"
                    </p>
                    <p className="u-margin-0">
                      <span className="u-fontSize-s">
                        <span className="u-fontFamily-secondaryMedium">50</span>
                        cards
                        from
                      </span>
                      <span className="price__price-with-tax-wrap" data-experiment-key="pricing_e2e_do_not_delete" data-variation-key>
                        <span className="price__display-price">
                          <span className="u-fontFamily-secondaryMedium u-color-dark" data-price-to-display>$19.99</span>
                        </span>
                      </span>
                    </p>
                  </div>
                  <a href="/us/business-cards/standard-size" className="cta-link -has-chevron u-width-100 u-paddingTop-xs
js-ga-click-track" data-ga-event-action="size-block" data-ga-event-label="/us/business-cards/standard-size || Make Standard">
                    <span className="cta-link__text">
                      <span>Make Standard</span>&nbsp;<svg style={{width: '1em',}} viewBox="0 0 48 48" className="svg-icon cta-link__chevron" role="presentation" aria-hidden="true" data-icon-id="ui--chevron-right-xxbold"><path d="M14.663 13.813l10.186 10.186-10.186 10.175 4.24 4.244 14.434-14.417L18.905 9.57l-4.242 4.243z" /></svg>
                    </span>
                  </a>  </figcaption>
              </figure>
            </div>
            <div style={{width: '25%', paddingLeft: '10px', display: 'table',}} className="layout__item size-module__layout-item u-display-flex@medium -animate  u-padding-0@medium js-size-block-wrap">
              <figure className="size-block has-link cta-link__wrap">
                <a href="/us/business-cards/moo-size" className="size-block__image-wrap js-ga-click-track" tabIndex={-1} data-ga-event-action="size-block" data-ga-event-label="/us/business-cards/moo-size || Make MOO size">
                  <div className="u-overflow-hidden">
                    <img style={{maxWidth: '100%'}} src="https://www.moo.com/dam/jcr:72d886d2-746a-4c68-a311-c55a9d80b615/paper-module-original-2-752x564.jpg"  alt="UK Business Card image for sizes module" className="size-block__image" />
                  </div>
                </a>
                <figcaption className="size-block__info-wrap u-textAlign-center js-equal-height-child" style={{height: 'auto'}}>
                  <div className="js-equal-height-child-2" style={{height: 'auto'}}>
                    <h3 className="h__block">MOO Size Business Cards</h3>
                    <p className="u-margin-0">
                      3.3" x 2.16"
                    </p>
                    <p className="u-margin-0">
                      <span className="u-fontSize-s">
                        <span className="u-fontFamily-secondaryMedium">50</span>
                        cards
                        from
                      </span>
                      <span className="price__price-with-tax-wrap">
                        <span className="price__display-price">
                          <span className="u-fontFamily-secondaryMedium u-color-dark" data-price-to-display>$19.99</span>
                        </span>
                      </span>
                    </p>
                  </div>
                  <a href="/us/business-cards/moo-size" className="cta-link -has-chevron u-width-100 u-paddingTop-xs
js-ga-click-track" data-ga-event-action="size-block" data-ga-event-label="/us/business-cards/moo-size || Make MOO size">
                    <span className="cta-link__text">
                      <span>Make MOO size</span>&nbsp;<svg style={{width: '1em',}} viewBox="0 0 48 48" className="svg-icon cta-link__chevron" role="presentation" aria-hidden="true" data-icon-id="ui--chevron-right-xxbold"><path d="M14.663 13.813l10.186 10.186-10.186 10.175 4.24 4.244 14.434-14.417L18.905 9.57l-4.242 4.243z" /></svg>
                    </span>
                  </a>  </figcaption>
              </figure>
            </div>
            <div style={{width: '25%', paddingLeft: '10px', display: 'table',}} className="layout__item size-module__layout-item u-display-flex@medium -animate  u-padding-0@medium js-size-block-wrap">
              <figure className="size-block has-link cta-link__wrap">
                <a href="/us/business-cards/square" className="size-block__image-wrap js-ga-click-track" tabIndex={-1} data-ga-event-action="size-block" data-ga-event-label="/us/business-cards/square || Make Square">
                  <div className="u-overflow-hidden">
                    <img style={{maxWidth: '100%'}} src="https://www.moo.com/dam/jcr:72d886d2-746a-4c68-a311-c55a9d80b615/paper-module-original-2-752x564.jpg"  alt="Square Business Card Size Comparison Image" className="size-block__image" />
                  </div>
                </a>
                <figcaption className="size-block__info-wrap u-textAlign-center js-equal-height-child" style={{height: 'auto'}}>
                  <div className="js-equal-height-child-2" style={{height: 'auto'}}>
                    <h3 className="h__block">Square Business Cards</h3>
                    <p className="u-margin-0">
                      2.56" x 2.56"
                    </p>
                    <p className="u-margin-0">
                      <span className="u-fontSize-s">
                        <span className="u-fontFamily-secondaryMedium">50</span>
                        cards
                        from
                      </span>
                      <span className="price__price-with-tax-wrap">
                        <span className="price__display-price">
                          <span className="u-fontFamily-secondaryMedium u-color-dark" data-price-to-display>$22.99</span>
                        </span>
                      </span>
                    </p>
                  </div>
                  <a href="/us/business-cards/square" className="cta-link -has-chevron u-width-100 u-paddingTop-xs
js-ga-click-track" data-ga-event-action="size-block" data-ga-event-label="/us/business-cards/square || Make Square">
                    <span className="cta-link__text">
                      <span>Make Square</span>&nbsp;<svg style={{width: '1em',}} viewBox="0 0 48 48" className="svg-icon cta-link__chevron" role="presentation" aria-hidden="true" data-icon-id="ui--chevron-right-xxbold"><path d="M14.663 13.813l10.186 10.186-10.186 10.175 4.24 4.244 14.434-14.417L18.905 9.57l-4.242 4.243z" /></svg>
                    </span>
                  </a>  </figcaption>
              </figure>
            </div>
            <div style={{width: '25%', paddingLeft: '10px', display: 'table',}} className="layout__item size-module__layout-item u-display-flex@medium -animate  u-padding-0@medium js-size-block-wrap">
              <figure className="size-block has-link cta-link__wrap">
                <a href="/us/business-cards/minicards" className="size-block__image-wrap js-ga-click-track" style={{backgroundImage: 'url(/dam/jcr:61a4bc22-e9fc-468c-a34d-1c3af7245f0c/size-module-rcbc-props-x5880.png)'}} tabIndex={-1} data-ga-event-action="size-block" data-ga-event-label="/us/business-cards/minicards || Make Mini">
                  <div className="u-overflow-hidden">
                    <img style={{maxWidth: '100%'}} src="https://www.moo.com/dam/jcr:72d886d2-746a-4c68-a311-c55a9d80b615/paper-module-original-2-752x564.jpg"  alt="MiniCard size comparison image" className="size-block__image" />
                  </div>
                </a>
                <figcaption className="size-block__info-wrap u-textAlign-center js-equal-height-child" style={{height: 'auto'}}>
                  <div className="js-equal-height-child-2" style={{height: 'auto'}}>
                    <h3 className="h__block">Mini Business Cards</h3>
                    <p className="u-margin-0">
                      2.75" x 1.1"
                    </p>
                    <p className="u-margin-0">
                      <span className="u-fontSize-s">
                        <span className="u-fontFamily-secondaryMedium">100</span>
                        cards
                        from
                      </span>
                      <span className="price__price-with-tax-wrap">
                        <span className="price__display-price">
                          <span className="u-fontFamily-secondaryMedium u-color-dark" data-price-to-display>$19.99</span>
                        </span>
                      </span>
                    </p>
                  </div>
                  <a href="/us/business-cards/minicards" className="cta-link -has-chevron u-width-100 u-paddingTop-xs
js-ga-click-track" data-ga-event-action="size-block" data-ga-event-label="/us/business-cards/minicards || Make Mini">
                    <span className="cta-link__text">
                      <span>Make Mini</span>&nbsp;<svg style={{width: '1em',}} viewBox="0 0 48 48" className="svg-icon cta-link__chevron" role="presentation" aria-hidden="true" data-icon-id="ui--chevron-right-xxbold"><path d="M14.663 13.813l10.186 10.186-10.186 10.175 4.24 4.244 14.434-14.417L18.905 9.57l-4.242 4.243z" /></svg>
                    </span>
                  </a>  </figcaption>
              </figure>
            </div>
          </div>
          <div className="layout u-display-flex@medium u-justifyContent-center@medium u-margin-0@medium">
            <div className="layout__item size-module__layout-item u-display-flex@medium  u-padding-0 js-size-block-wrap-measure" />
            <div className="layout__item size-module__layout-item u-display-flex@medium  u-padding-0 js-size-block-wrap-measure" />
            <div className="layout__item size-module__layout-item u-display-flex@medium  u-padding-0 js-size-block-wrap-measure" />
            <div className="layout__item size-module__layout-item u-display-flex@medium  u-padding-0 js-size-block-wrap-measure" />
          </div>
        </div>
        </div>
      </section>

      <section id="designingyourcards" className="
    band
        -module
        u-backgroundColor-neutralTint
    
    
    js-component">
        <div className="container">
          <div className="u-textAlign-center">
            <header className="module-header list-default__parent u-last-child-margin-bottom-0 ">
              <h2 className="h__module">Designing Your Business Cards</h2>
              <p className="p__lead">Whether you’re a total beginner or a creative professional, we’ve design options for any skill level.</p>
            </header>
          </div>
          <div className>
            <div style={{display: 'flex'}} className="layout layout--row-spacing u-display-flex u-flexWrap-wrap">
              <div className="tile-rack__tile-wrap block__wrap-mob layout__item -animate u-display-flex u-1/3@medium">
                <div className="tile
                -link
            u-textAlign-left
            js-tile
">
                  <div className="tile__body list-default__parent">
                    <div className="tile__media-wrap">
                      <a href="/us/design-templates/business-cards/?paperType=classic&productType=businesscard_us" className="tile__image-link js-ga-click-track js-tile-image-link" data-ga-event-action="tile" data-ga-event-label="/us/design-templates/business-cards/?paperType=classic&productType=businesscard_us || See our design templates">
                        <figure className="tile__figure u-margin-0">
                          <img src="data:image/gif;base64,R0lGODlhAQABAAAAADs=" srcSet="/.imaging/scale/dam/83fea863-8244-4a54-98d4-3aa4e63ace55/category__OPT-012.jpg, /dam/jcr:9d3c369b-5f27-4589-a7c8-8240f38e7261/category__OPT-012.jpg 2x" alt="Use Our Templates" title="Use Our Templates" className="tile__image" />
                          <figcaption className="u-visually-hidden">Use Our Templates</figcaption>
                        </figure>
                      </a>
                    </div>
                    <div className="tile__text-wrap">
                      <div className="tile__text-wrap-inner">
                        <h3 className="h__block u-marginBottom-xxxs">
                          Use Our Templates
                        </h3>
                        <ul>
                          <li>Looking for inspiration</li>
                          <li>Want a professional design</li>
                          <li>Want simple, fast customisation</li>
                        </ul>
                      </div>
                      <a href="/us/design-templates/business-cards/?paperType=classic&productType=businesscard_us" className="tile__horizontal-footer-link js-ga-click-track" data-ga-event-action="tile" data-ga-event-label="/us/design-templates/business-cards/?paperType=classic&productType=businesscard_us || See our design templates">
                        <div className="tile__text-wrap-inner tile__horizontal-footer cta-link__wrap u-paddingTop-0">
                          <div className="cta-link -has-chevron">
                            <span className="cta-link__text">
                              <span>See our design templates</span>&nbsp;<svg style={{width: '1em',}}  viewBox="0 0 48 48" className="svg-icon cta-link__chevron" role="presentation" aria-hidden="true" data-icon-id="ui--chevron-right-xxbold"><path d="M14.663 13.813l10.186 10.186-10.186 10.175 4.24 4.244 14.434-14.417L18.905 9.57l-4.242 4.243z" /></svg>
                            </span>
                          </div>      </div>
                      </a>
                    </div>
                  </div>
                  <a href="/us/design-templates/business-cards/?paperType=classic&productType=businesscard_us" className=" js-ga-click-track" data-ga-event-action="tile" data-ga-event-label="/us/design-templates/business-cards/?paperType=classic&productType=businesscard_us || See our design templates">
                    <div className="tile__footer cta-link__wrap">
                      <div className="cta-link -has-chevron">
                        <span className="cta-link__text">
                          <span>See our design templates</span>&nbsp;<svg style={{width: '1em',}}  viewBox="0 0 48 48" className="svg-icon cta-link__chevron" role="presentation" aria-hidden="true" data-icon-id="ui--chevron-right-xxbold"><path d="M14.663 13.813l10.186 10.186-10.186 10.175 4.24 4.244 14.434-14.417L18.905 9.57l-4.242 4.243z" /></svg>
                        </span>
                      </div>      </div>
                  </a>
                </div>
              </div>
              <div className="tile-rack__tile-wrap block__wrap-mob layout__item -animate u-display-flex u-1/3@medium">
                <div className="tile
                -link
            u-textAlign-left
            js-tile
">
                  <div className="tile__body list-default__parent">
                    <div className="tile__media-wrap">
                      <a href="/us/business-cards/design-guidelines-dyo" className="tile__image-link js-ga-click-track js-tile-image-link" data-ga-event-action="tile" data-ga-event-label="/us/business-cards/design-guidelines-dyo || Start with a blank template">
                        <figure className="tile__figure u-margin-0">
                          <img src="data:image/gif;base64,R0lGODlhAQABAAAAADs=" srcSet="/.imaging/scale/dam/d4e87ed1-4ba1-4d7d-90e3-9b6905711c01/category__OPT-022.jpg, /dam/jcr:ea6e4737-c65d-41c0-8cfa-e88dd6be0d24/category__OPT-022.jpg 2x" alt="Design Here Online" title="Design Here Online" className="tile__image" />
                          <figcaption className="u-visually-hidden">Design Here Online</figcaption>
                        </figure>
                      </a>
                    </div>
                    <div className="tile__text-wrap">
                      <div className="tile__text-wrap-inner">
                        <h3 className="h__block u-marginBottom-xxxs">
                          Design Here Online
                        </h3>
                        <ul>
                          <li>Already have your logo</li>
                          <li>Want to create your own design easily</li>
                          <li>Want to customize every detail</li>
                        </ul>
                      </div>
                      <a href="/us/business-cards/design-guidelines-dyo" className="tile__horizontal-footer-link js-ga-click-track" data-ga-event-action="tile" data-ga-event-label="/us/business-cards/design-guidelines-dyo || Start with a blank template">
                        <div className="tile__text-wrap-inner tile__horizontal-footer cta-link__wrap u-paddingTop-0">
                          <div className="cta-link -has-chevron">
                            <span className="cta-link__text">
                              <span>Start with a blank template</span>&nbsp;<svg style={{width: '1em',}} viewBox="0 0 48 48" className="svg-icon cta-link__chevron" role="presentation" aria-hidden="true" data-icon-id="ui--chevron-right-xxbold"><path d="M14.663 13.813l10.186 10.186-10.186 10.175 4.24 4.244 14.434-14.417L18.905 9.57l-4.242 4.243z" /></svg>
                            </span>
                          </div>      </div>
                      </a>
                    </div>
                  </div>
                  <a href="/us/business-cards/design-guidelines-dyo" className=" js-ga-click-track" data-ga-event-action="tile" data-ga-event-label="/us/business-cards/design-guidelines-dyo || Start with a blank template">
                    <div className="tile__footer cta-link__wrap">
                      <div className="cta-link -has-chevron">
                        <span className="cta-link__text">
                          <span>Start with a blank template</span>&nbsp;<svg style={{width: '1em',}} viewBox="0 0 48 48" className="svg-icon cta-link__chevron" role="presentation" aria-hidden="true" data-icon-id="ui--chevron-right-xxbold"><path d="M14.663 13.813l10.186 10.186-10.186 10.175 4.24 4.244 14.434-14.417L18.905 9.57l-4.242 4.243z" /></svg>
                        </span>
                      </div>      </div>
                  </a>
                </div>
              </div>
              <div className="tile-rack__tile-wrap block__wrap-mob layout__item -animate u-display-flex u-1/3@medium">
                <div className="tile
                -link
            u-textAlign-left
            js-tile
">
                  <div className="tile__body list-default__parent">
                    <div className="tile__media-wrap">
                      <a href="/us/business-cards/design-guidelines" className="tile__image-link js-ga-click-track js-tile-image-link" data-ga-event-action="tile" data-ga-event-label="/us/business-cards/design-guidelines || Upload a complete design">
                        <figure className="tile__figure u-margin-0">
                          <img src="data:image/gif;base64,R0lGODlhAQABAAAAADs=" srcSet="/.imaging/scale/dam/9cf2ec61-7def-4cd0-9f34-dd514cc94218/category__OPT-032.jpg, /dam/jcr:c8770b1c-f65e-418c-973f-1e468b6914a2/category__OPT-032.jpg 2x" alt="Upload a Full Design" title="Upload a Full Design" className="tile__image" />
                          <figcaption className="u-visually-hidden">Upload a Full Design</figcaption>
                        </figure>
                      </a>
                    </div>
                    <div className="tile__text-wrap">
                      <div className="tile__text-wrap-inner">
                        <h3 className="h__block u-marginBottom-xxxs">
                          Upload a Full Design
                        </h3>
                        <ul>
                          <li>Already have a complete design</li>
                          <li>Have design chops or your own designer</li>
                          <li>Are confident with your layout</li>
                        </ul>
                      </div>
                      <a href="/us/business-cards/design-guidelines" className="tile__horizontal-footer-link js-ga-click-track" data-ga-event-action="tile" data-ga-event-label="/us/business-cards/design-guidelines || Upload a complete design">
                        <div className="tile__text-wrap-inner tile__horizontal-footer cta-link__wrap u-paddingTop-0">
                          <div className="cta-link -has-chevron">
                            <span className="cta-link__text">
                              <span>Upload a complete design</span>&nbsp;<svg style={{width: '1em',}} viewBox="0 0 48 48" className="svg-icon cta-link__chevron" role="presentation" aria-hidden="true" data-icon-id="ui--chevron-right-xxbold"><path d="M14.663 13.813l10.186 10.186-10.186 10.175 4.24 4.244 14.434-14.417L18.905 9.57l-4.242 4.243z" /></svg>
                            </span>
                          </div>      </div>
                      </a>
                    </div>
                  </div>
                  <a href="/us/business-cards/design-guidelines" className=" js-ga-click-track" data-ga-event-action="tile" data-ga-event-label="/us/business-cards/design-guidelines || Upload a complete design">
                    <div className="tile__footer cta-link__wrap">
                      <div className="cta-link -has-chevron">
                        <span className="cta-link__text">
                          <span>Upload a complete design</span>&nbsp;<svg style={{width: '1em',}} viewBox="0 0 48 48" className="svg-icon cta-link__chevron" role="presentation" aria-hidden="true" data-icon-id="ui--chevron-right-xxbold"><path d="M14.663 13.813l10.186 10.186-10.186 10.175 4.24 4.244 14.434-14.417L18.905 9.57l-4.242 4.243z" /></svg>
                        </span>
                      </div>      </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
      </section>
      <div className="container">
        <TreeViewContainer />
      </div>
            </div>
        </div>;
    }
}