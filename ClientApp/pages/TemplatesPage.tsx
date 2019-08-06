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
            var templates = JSON.parse(html).value.key;
            templates = templates.map(template => {
            template.document = JSON.parse(template.document)
                return template
            })
            self.setState({ templates });
        });

        url = `http://localhost:64099/api/Template/Search?type=2&page=1&perPage=10`;
        fetch(url, {
        mode: 'cors'
        })
        .then(response => response.text())
        .then(html => {
            var templates = JSON.parse(html).value.key;
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
            <div className="container container-content">
            <h1>Templates</h1>
            <div id="image-container">
            {templates.map((design, i) => {
                var e = 150 / design.document.height;
                return  <a href={`/editor/${design.id}`}>
                <div key={i} style={{
                        display: 'inline-block',
                        "width": design.document.width * e,
                        "height": design.document.height * e,
                        transitionDuration: '0.2s',
                        marginRight: '9px',
                        marginLeft: '28px',
                        marginBottom: '30px',
                        }}>
                    <img 
                    className="is-loading"
                    style={{
                        transitionDuration: '0.2s',
                    "margin": "0 auto", 
                    "display": "block", 
                    "width": design.document.width * e,
                    "height": design.document.height * e,
                    boxShadow: 'rgba(173, 173, 173, 0.62) 0px 1px 2px',
                    // backgroundColor: 'rgba(14, 19, 24, 0.25)',
                    }} 
                    src={design.representative} />
                </div>
                </a>
            })
            }
            </div>
            <h1>Texts</h1>
            <a style={{display: 'block'}} href='/editor'>New</a>
            <div id="image-container-2">
            {textTemplates.map(design => {
                var e = 150 / design.document.height;
                return  <a href={`/editor/${design.id}`}>
                    <div style={{
                    display: 'inline-block',
                    "width": design.document.width * e,
                    "height": design.document.height * e,
                    transitionDuration: '0.2s',
                    marginRight: '9px',
                    marginLeft: '28px',
                    marginBottom: '30px',
                        }}>
                    <img 
                    className="is-loading"
                    style={{
                    transitionDuration: '0.2s',
                    "margin": "0 auto", 
                    "display": "block", 
                    "width": design.document.width * e,
                    "height": design.document.height * e,
                    boxShadow: 'rgba(173, 173, 173, 0.62) 0px 1px 2px',
                    // backgroundColor: 'rgba(14, 19, 24, 0.25)',
                    }} 
                    src={design.representative} />
                </div>
                </a>
            })
            }
        </div>
        </div>
            </div>;
    }
}