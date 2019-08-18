import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Helmet } from "react-helmet";
import logo from "@Images/logo.png";
import TreeViewContainer from "@Components/shared/TreeViewContainer";

type Props = RouteComponentProps<{}>;

export default class AccountPage extends React.Component<Props, {textTemplates, templates}> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return <div>
            <Helmet>
                <title>Home page - RCB (TypeScript)</title>
            </Helmet>
            <div className="container-content">
        <div style={{display: 'flex'}} className="container">
          <div
            style={{
                width: '100%',
                display: 'flex',
            }}
          >
            <div
                style={{
                    marginRight: '20px',
                }}
            >
                <ul>
                    <li>Thông tin đơn hàng</li>
                    <li>Quản lý đơn hàng</li>
                    <li>Địa chỉ của tôi</li>
                    <li>Mã quà tặng</li>
                </ul>
            </div>
            <div>
                <h1>Hello wordl!</h1>
            </div>
          </div>
        </div>
        </div>
            </div>;
    }
}