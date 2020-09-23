import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Helmet } from "react-helmet";
import loadable from '@loadable/component';

import "@Styles/homePage.scss";

import TemplateList from "@Components/homepage/TemplateList";
import { isNode } from "@Utils";

type Props = RouteComponentProps<{
}>;

export default class TemplatesPage extends React.Component<Props, { textTemplates, templates, mounted, }> {
    constructor(props) {
        super(props);

        this.state = {
            mounted: false,
        }
    }

    componentDidMount() {
        this.setState({mounted: true,})
    }

    handleLogin() {

    }

    handleProfilePopup() {

    }

    translate() {

    }

    render() {
        let loggedIn = false;

        console.log('parseInt(this.props.match.params.subtype)', this.props, this.props.match.params.subtype, parseInt(this.props.match.params.subtype))
        return <div>
            <Helmet>
                <title>Mẫu thiết kế</title>
            </Helmet>
            <div className="container-content">
                <div style={{ display: 'flex' }} className="container">
                    <div
                        style={{ width: '100%' }}
                    >
                        {/* <div id="divSmoothingFactor">
            <label for="cmbBufferSize">Buffer size:</label>
            <select id="cmbBufferSize">
                <option value="1">1 - No smoothing</option>
                <option value="4">4 - Sharp curves</option>
                <option value="8" selected="selected">8 - Smooth curves</option>
                <option value="12">12 - Very smooth curves</option>
                <option value="16">16 - Super smooth curves</option>
                <option value="20">20 - Hyper smooth curves</option>
            </select>
        </div> */}
                        {/* <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="svgElement" x="0px" y="0px" width="600px" height="400px" viewBox="0 0 600 400" enable-background="new 0 0 600 400" xmlSpace="preserve">
          <defs>
              <mask id="myCircle">
                <image style={{
                    width: "500px",
                }} href="images/RH8gcv9cEWoPIAmIBjEAg_removebackground.png" />
              </mask>
          </defs>
          <image mask="url(#myCircle)" style={{width: "500px",}} href="https://localhost:64099/images/NukXUTVSe02KwQO6G43QYA.jpg"/>
        </svg> */}

                        {/* <TreeViewContainer filePath={this.props.location.pathname} /> */}
                        {!isNode() && 
                            <TemplateList
                                type={parseInt(this.props.match.params.subtype)}
                                translate={null}
                            />}
                        {/* } */}
                    </div>
                </div>
            </div>
        </div>;
    }
}