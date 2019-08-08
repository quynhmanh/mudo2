import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Helmet } from "react-helmet";
import logo from "@Images/logo.png";
import TreeViewContainer from "@Components/shared/TreeViewContainer";

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
        return <div>
            <Helmet>
                <title>Home page - RCB (TypeScript)</title>
            </Helmet>
            <div className="container container-content">
        <div style={{display: 'flex'}} className="container">
          <div
            style={{
              width: '50%',
            }}  
          >
            <TreeViewContainer />
          </div>
          <div
            style={{
              width: '50%',
            }} 
          >
            <p>Hello world!</p>
          </div>
        </div>
        </div>
            </div>;
    }
}