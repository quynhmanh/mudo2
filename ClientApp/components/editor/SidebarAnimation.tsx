import React, { Component } from 'react'
import { SidebarTab, TemplateType, } from "./enums";
import editorStore from "@Store/EditorStore";
import Sidebar from "@Components/editor/SidebarStyled";
import { handleFadeAnimation } from "@Utils";

export interface IProps {
    selectedTab: any;
    animationId: any;
}

export interface IState {
}

export default class SidebarAnimation extends Component<IProps, IState> {
    state = {
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.selectedTab != nextProps.selectedTab
            && (nextProps.selectedTab == SidebarTab.Animation || this.props.selectedTab == SidebarTab.Animation)
        ) {
            return true;
        }

        if (this.props.animationId != nextProps.animationId) {
            return true;
        }
 
        return false;
    }

    handleFadeAnimation() {
        editorStore.animationId = 1;
        handleFadeAnimation();
    }

    render() {

        return (
            <Sidebar
                selectedTab={editorStore.selectedTab}
                sidebar={SidebarTab.Animation}
                color="black"
                style={{
                    left: 0,
                    top: 0,
                    background: "white",
                    width: "370px",
                    transition: "none",
                    transform: "none",
                }}
            >
                <div
                    style={{
                        borderBottom: "1px solid #00000026",
                        height: "47px",
                    }}
                >
                    <p
                        style={{
                            height: "100%",
                            lineHeight: "47px",
                            paddingLeft: "21px",
                            fontSize: "15px",
                        }}
                    >Animation</p>
                </div>
                <div
                    style={{
                        padding: "23px",
                    }}
                >
                    <button
                        onClick={e => {
                            e.preventDefault();
                            editorStore.animationId = 0;

                            document.getElementById('animation-script').innerHTML = "function animate() {}";
                        }}
                        style={{
                            border: editorStore.animationId == 0 ? "2px solid #00d9e1" : "1px solid rgba(57,76,96,.15)",
                            borderRadius: "4px",
                            width: "100px",
                            marginRight: "12px",
                        }}
                    >
                        <span
                            style={{
                                height: "46px",
                                lineHeight: "46px",
                            }}
                        >None</span></button>
                    <button
                        onClick={this.handleFadeAnimation}
                        style={{
                            border: editorStore.animationId == 1 ? "2px solid #00d9e1" : "1px solid rgba(57,76,96,.15)",
                            borderRadius: "4px",
                            width: "100px",
                            marginRight: "12px",
                        }}
                    >
                        <span
                            style={{
                                height: "46px",
                                lineHeight: "46px",
                            }}
                        >Fade</span></button>
                </div>
            </Sidebar>
        )
    }
}