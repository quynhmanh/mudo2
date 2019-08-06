import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Helmet } from "react-helmet";
import logo from "@Images/logo.png";

type Props = RouteComponentProps<{}>;

export default class TemplatesPage extends React.Component<Props, {textTemplates, templates}> {
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
        }
    }

    componentDidMount() {
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

    render() {
        const { templates, textTemplates } = this.state;

        return <div>
            <Helmet>
                <title>Home page - RCB (TypeScript)</title>
            </Helmet>
            <div style={{
                height: '100px',
                width: '100%',
                backgroundImage: 'linear-gradient(150deg,#019fb6,#19a0ff 85%)',
                backgroundRepeat: 'repeat-x',
                position: 'relative',
            }}>
                <h1 
                    style={{
                        textAlign: 'center', 
                        width: '100%', 
                        color: 'white', 
                        margin: 'auto', 
                        position: 'absolute', 
                        top: 0,
                        bottom: 0,
                        display: 'inline-table'
                    }}>Click a template below, customize & download or print it anywhere.
                </h1>
            </div>
            <div className="container container-content">
            <h1>All Templates</h1>
            <p>Marketing yourself in today’s environment can be costly, which is why it makes sense to use our templates to create your own business cards, flyers, brochures, postcards and other marketing materials. Our professional designers work tirelessly to create designs that help you present your business or organization in its best possible light, whether you’re operating a mom-and-pop deli on the corner or dealing with fat cats on Wall Street. Our online editor is simple and fun to use, making it easy to create professional-looking print designs with just a few mouse clicks and keyboard strokes. Once you have your designs on point, we offer premium printing services, or you can print your materials conveniently from any location.</p>
            <div>
            <div id="categories">
                <div>All Templates</div>
                <ul>
                        <li>
                            <a href="/templates/brochures">
                                Brochures
                            </a>
                        </li>
                        <li>
                            <a href="/templates/business-cards">
                                Business Cards
                            </a>
                        </li>
                        <li>
                            <a href="/templates/envelopes">
                                Envelopes
                            </a>
                        </li>
                        <li>
                            <a href="/templates/flyers">
                                Flyers
                            </a>
                        </li>
                        <li>
                            <a href="/templates/letterheads">
                                Letterheads
                            </a>
                        </li>
                        <li>
                            <a href="/templates/postcards">
                                Postcards
                            </a>
                        </li>
                        <li>
                            <a href="/templates/yardsigns">
                                Yard Signs
                            </a>
                        </li>
                </ul>
            </div>
            <div id="industries">
                                    <div>All Industries</div>
                                    <ul>
                                            <li >
                                                <a href="/templates/agriculture">
                                                    Agriculture
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/automotive-transportation">
                                                    Automotive &amp; Transportation
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/beauty">
                                                    Beauty
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/blank">
                                                    Blank Templates
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/business-services">
                                                    Business Services
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/child-care">
                                                    Child Care
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/cleaning">
                                                    Cleaning
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/construction">
                                                    Construction
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/creative">
                                                    Creative
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/education-training">
                                                    Education &amp; Training
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/energy-environment">
                                                    Energy &amp; Environment
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/event">
                                                    Event
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/financial-services">
                                                    Financial Services
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/food-beverage">
                                                    Food &amp; Beverage
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/generic">
                                                    Generic Templates
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/holiday">
                                                    Holiday
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/house-home">
                                                    House &amp; Home
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/insurance">
                                                    Insurance
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/law">
                                                    Law
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/lawn-garden">
                                                    Lawn &amp; Garden
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/medical-health-care">
                                                    Medical &amp; Health Care
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/music-arts">
                                                    Music &amp; Arts
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/non-profit">
                                                    Non Profit
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/pets-animals">
                                                    Pets &amp; Animals
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/photography">
                                                    Photography
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/real-estate">
                                                    Real Estate
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/religion-organizations">
                                                    Religion &amp; Organizations
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/retail">
                                                    Retail
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/sports-wellness">
                                                    Sports &amp; Wellness
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/technology">
                                                    Technology
                                                </a>
                                            </li>
                                            <li >
                                                <a href="/templates/travel-tourism">
                                                    Travel &amp; Tourism
                                                </a>
                                            </li>
                                    </ul>
                                </div>
            </div>
            </div>
        </div>;
    }
}