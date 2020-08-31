import * as React from "react";
import { RouteComponentProps } from "react-router";
import Home from "@Components/shared/svgs/HomeIcon";

interface IProps {
    tReady: boolean;
    translate: any;
}

interface IState {
}

export default class HomeButton extends React.Component<IProps, IState> {
  state = {
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                fontSize: "15px",
                fontWeight: 600,
                height: "100%",
                position: "relative",
            }}
        >
            {
            <span>
                <Home width="24px" height="24px" />
            </span>
            }
            <span
                style={{
                    display: "block",
                    right: 0,
                    fontSize: "15px",
                }}
            >{this.props.translate("home")}</span>
            
        </div>
    );
  }
}
