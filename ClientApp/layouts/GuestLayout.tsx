import "@Styles/guestLayout.scss";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ToastContainer } from "react-toastify";
import TopMenu from '@Components/shared/TopMenu';


interface IProps {
    children: any;
}

type Props = IProps & RouteComponentProps<any> ;

export default class GuestLayout extends React.Component<Props, {}> {
    public render() {

        return <div id="guestLayout" className="layout">
                <TopMenu />
                <div className="container container-content">
                    {this.props.children}
                </div>
                <ToastContainer />
            </div>;
    }
}