import React, {Component} from "react";
import {SidebarTab} from "@Components/editor/enums";

interface IProps {
    show: boolean;
    translate: any;
    cropMode: boolean;
    handleAdjustBtnClick: any;
    selectedTab: any;
}

interface IState {
}


export default class Effect extends Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }
    render () {
        const { show, cropMode, handleAdjustBtnClick, translate } = this.props;
        return (
            <div
                style={{
                    position: "relative",
                    display: show ? "block" : "none",
                }}
            >
                {!cropMode && (
                    <button
                        style={{
                            height: "32px",
                            top: 0,
                            backgroundColor: this.props.selectedTab === SidebarTab.Effect ? "#f2f5f7 " : "white",
                            padding: "0 15px",
                        }}
                        className="dropbtn-font dropbtn-font-size toolbar-btn"
                        onClick={e => {
                            handleAdjustBtnClick(e);
                            this.setState({
                                selected: true,
                            })
                        }}
                    >
                        <span>{translate("effects")}</span>
                    </button>
                )}
            </div>
        );
    }
}