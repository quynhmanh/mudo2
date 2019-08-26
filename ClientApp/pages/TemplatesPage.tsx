import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Helmet } from "react-helmet";
import logo from "@Images/logo.png";
import TreeViewContainer from "@Components/shared/TreeViewContainer";

type Props = RouteComponentProps<{}>;

export default class TemplatesPage extends React.Component<Props, {textTemplates, templates}> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return <div>
            <Helmet>
                <title>Mẫu thiết kế</title>
            </Helmet>
            <div className="container-content">
        <div style={{display: 'flex'}} className="container">
          <div
            style={{width: '100%'}}
          >
            <TreeViewContainer filePath={this.props.location.pathname} />
          </div>
        </div>
        </div>
            </div>;
    }
}