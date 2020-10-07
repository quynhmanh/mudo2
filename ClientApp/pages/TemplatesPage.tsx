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
        this.setState({ mounted: true, })
    }

    handleLogin() {

    }

    handleProfilePopup() {

    }

    translate() {

    }

    render() {

        const type = parseInt(this.props.match.params.subtype);
        let title = "";

        switch (type) {
            case 0:
                break;
            case 1:
                title = "Poster";
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                title = "Facebook Post";
                break;
            case 7:
                break;
            case 8:
                break;
            case 9:
                title = "Square Video Post";
                break;
            case 10:
                break;
            case 11: // Menu
                title = "Menu";
                break;
            case 12: // Instagram Story
                title = "Instagram Story";
                break;
            case 14:
                title = "Instagram Post";
                break;
        }

        return <div>
            <Helmet>
                <title>Mẫu thiết kế</title>
            </Helmet>
            <div className="container-content">
                <div style={{ display: 'flex' }} className="container">
                    <div
                        style={{ width: '100%' }}
                    >
                        {!isNode() &&
                            <h1
                                style={{
                                    marginTop: '30px',
                                    fontFamily: "AvenirNextRoundedPro",
                                    fontWeight: 600,
                                    fontSize: "35px",
                                    textAlign: 'center',
                                }}
                            >{title}</h1>}
                        {!isNode() &&
                            <TemplateList
                                type={parseInt(this.props.match.params.subtype)}
                                translate={null}
                            />}
                    </div>
                </div>
            </div>
        </div>;
    }
}