import * as React from "react";
import { RouteComponentProps } from "react-router";
import Home from "@Components/shared/svgs/HomeIcon";

interface IProps {
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
                height: "100%",
            }}>
            <a
                id="logo-editor"
                style={{
                    color: "white",
                    display: "flex",
                    padding: "5px 14px",
                    borderRadius: "3px",
                    marginLeft: "5px",
                }}
                href="/"
            >
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
                    <span
                        style={{
                            marginRight: "5px",
                        }}
                    >
                        <Home width="24px" height="24px" />
                    </span>
                    <span
                        style={{
                            display: "block",
                            right: 0,
                            fontSize: "15px",
                            fontWeight: 500,
                        }}
                    >{this.props.translate("home")}</span>
                    
                </div>
            </a>
            <p
                id="savingState"
                style={{
                    color: "hsla(0,0%,100%,.5)",
                    fontStyle: "italic",
                    margin: "auto",
                    marginLeft: "20px",
                    fontSize: "14px",
                    fontWeight: 400,
                }}
            >{this.props.translate("allChangesSaved")}</p>
        </div>
    );
  }
}
