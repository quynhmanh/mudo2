import * as React from "react";
import homePageTranslation from "@Locales/default/homePage";
import { Helmet } from "react-helmet";
import { withTranslation } from "react-i18next";

const NAMESPACE = "homePage";

import "@Styles/homePage.scss";

import TemplateList from "@Components/homepage/TemplateList";
import { isNode } from "@Utils";

interface IProps {
    t: any;
    i18n: any;
};

class TemplatesPage extends React.Component<IProps, {}> {
    constructor(props) {
        super(props);

        this.state = {
            mounted: false,
        }

        this.translate = this.translate.bind(this);
    }

    componentDidMount() {
        this.setState({ mounted: true, })
    }

    handleLogin() {

    }

    handleProfilePopup() {

    }

    translate = (key: string) => {
        const { t, i18n } = this.props;

        if (i18n.exists(NAMESPACE + ":" + key))
            return t(key);

        if (homePageTranslation !== undefined && homePageTranslation.hasOwnProperty(key)) {
            return homePageTranslation[key]; // load default translation in case failed to load translation file from server
        }

        return key;
    }


    render() {

        const type = parseInt(this.props.match.params.subtype);
        let title = "";

        switch (type) {
            case 0:
                break;
            case 1:
                title = "poster";
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
                title = "facebookPost";
                break;
            case 7:
                break;
            case 8:
                break;
            case 9:
                title = "squareVideoPost";
                break;
            case 10:
                break;
            case 11: // Menu
                title = "Menu";
                break;
            case 12: // Instagram Story
                title = "instagramStory";
                break;
            case 14:
                title = "instagramPost";
                break;
            case 15: // Business Card
                title = "businessCard";
                break;
            case 16: // Facebook Cover
                title = "facebookCover";
                break;
            case 17: // Facebook Post
                title = "facebookPost";
                break;
            case 18: // Facebook ad
                title = "facebookAd";
                break;
        }

        return <div>
            {!isNode() &&
            <Helmet>
                <title>{this.translate(title)}</title>
            </Helmet>
            }
            <div className="container-content">
                <div style={{ display: 'flex' }} className="container">
                    <div
                        style={{ width: '100%' }}
                    >
                        {!isNode() &&
                            <h1
                                style={{
                                    marginTop: '30px',
                                    fontWeight: 700,
                                    fontSize: "35px",
                                    textAlign: 'center',
                                }}
                            >{this.translate(title)}</h1>}
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

export default withTranslation(NAMESPACE)(TemplatesPage);
