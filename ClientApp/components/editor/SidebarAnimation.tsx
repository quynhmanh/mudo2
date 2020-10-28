import React, { Component } from 'react'
import { SidebarTab, TemplateType, } from "./enums";
import editorStore from "@Store/EditorStore";
import Sidebar from "@Components/editor/SidebarStyled";

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
        clearInterval(window.intervalAnimation);
        clearTimeout(window.timeoutAnimation)
        let curOpa = 1;

        let ids = [];
        let ratios = {};
        editorStore.images2.forEach(img => {
            if (img.type != TemplateType.BackgroundImage) {
                ids.push(img._id);
                let ratio = 1.0 * (img.left + 100) / (window.rectWidth + 100);
                ratios[`id${img._id}`] = {
                    left: img.left,
                    top: img.top,
                    width: img.width,
                    height: img.height,
                };
            }
        });

        let limit = window.rectWidth;
        let limitHeight = 0;

        ids.forEach((id, key) => {
            let el = document.getElementById(id + "_alo");
            el.style.opacity = 0;
        });

        let marked = {};
        window.intervalAnimation = setInterval(() => {
            ids.forEach(id => {
                let image = editorStore.images2.get(id);
                let el = document.getElementById(id + "_alo") as HTMLElement;
                let opa = parseFloat(el.style.opacity);
                if (isNaN(opa)) opa = 0;
                if ((image.left + image.width > limit && image.top <= limitHeight) || marked[id]) {
                    el.style.opacity = opa + 0.025;
                    marked[id] = true;
                }
            })

            limit -= window.rectWidth / 80;
            if (limit < 0) {
                limit = window.rectWidth;
                limitHeight += window.rectHeight / 10;
            }
        }, 5);

        window.timeoutAnimation = setTimeout(() => {
            clearTimeout(window.intervalAnimation);
        }, 5000);

        let val = `
                        function animate() {
                            ['${ids.join("','")}'].forEach((id, key) => {
                                console.log("asd", id + "_alo2");
                                let el = document.getElementById(id + "_alo2");
                                el.style.opacity = 0;
                            });
                            let marked = {};
                            setTimeout(() => {
                                let limit = window.innerWidth;
                                let limitHeight = 0;
                                let curOpa = 0;
                                let ratios = ${JSON.stringify(ratios)};
                                let interval = setInterval(() => {
                                    ['${ids.join("','")}'].forEach((id, key) => {
                                        let image= ratios["id" + id];
                                        let el = document.getElementById(id + "_alo2");
                                        let opa = parseFloat(el.style.opacity);
                                        if (isNaN(opa)) opa = 0;
                                        if ((image.left + image.width > limit && image.top <= limitHeight) || marked[id]) {
                                            el.style.opacity = opa + 0.03;
                                            marked[id] = true;
                                        }
                                    })

                                    limit -= window.innerWidth / 80;
                                    if (limit < 0) {
                                        limit = window.innerWidth;
                                        limitHeight += window.innerHeight / 10;
                                    }
                                }, 5);

                                setTimeout(() => {
                                    clearTimeout(interval);
                                }, 5000)
                            }, 300);
                        }`;

        document.getElementById('animation-script').innerHTML = val;
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