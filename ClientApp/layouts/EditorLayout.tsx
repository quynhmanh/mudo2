import "@Styles/editorLayout.scss";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ToastContainer } from "react-toastify";

interface IProps {
  children: any;
}

type Props = IProps & RouteComponentProps<any>;

export default class EditorLayout extends React.Component<Props, {}> {
  public render() {
    return (
      <div id="editorLayout" className="layout">
        {this.props.children}
        <ToastContainer />
      </div>
    );
  }
}
