import React, { Component } from "react";
import { TemplateType, SidebarTab } from "@Components/editor/enums";
import { observer } from "mobx-react";
import editorStore from "@Store/EditorStore";
import Globals from "@Globals";
import loadable from "@loadable/component";
const DownloadList = loadable(() => import("@Components/editor/DownloadList"));
const MoreList = loadable(() => import("@Components/editor/MoreList"));
const Home = loadable(() => import("@Components/shared/svgs/HomeIcon"));
const HomeButton = loadable(() => import("@Components/editor/HomeButton"));

import DownloadIcon from "@Components/shared/svgs/DownloadIcon";

import {
    downloadPDF,
    downloadPNG,
    downloadVideo,
} from "@Utils";

interface IProps {
    translate: any;
    designTitle: any;
    playVideos: any;
}

interface IState {
}

const alignList = [
    { title: "alignLeft", align: "left", iconPath: require("@Components/shared/svgs/editor/toolbar/alignLeft.svg") },
    { title: "alignCenter", align: "center", iconPath: require("@Components/shared/svgs/editor/toolbar/alignCenter.svg") },
    { title: "alignRight", align: "right", iconPath: require("@Components/shared/svgs/editor/toolbar/alignRight.svg") }
];

const adminEmail = "llaugusty@gmail.com";

@observer
class LeftSide extends Component<IProps, IState> {

    handleColorBtnClick(e) {
        e.preventDefault();
        editorStore.selectedTab = SidebarTab.Color;
    }


    handleDownloadList = () => {
        document.getElementById("myDownloadList").classList.toggle("show");

        const onDown = e => {
            if (!e.target.matches(".dropbtn-font-size")) {
                var dropdowns = document.getElementsByClassName(
                    "dropdown-content-font-size"
                );
                var i;
                for (i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains("show")) {
                        openDropdown.classList.remove("show");
                    }
                }

                document.removeEventListener("mouseup", onDown);
            }
        };

        document.addEventListener("mouseup", onDown);
    };

    handleMoreList = () => {
        document.getElementById("myMoreList").classList.toggle("show");

        const onDown = e => {
            if (!e.target.matches(".dropbtn-font-size")) {
                var dropdowns = document.getElementsByClassName(
                    "dropdown-content-font-size"
                );
                var i;
                for (i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains("show")) {
                        openDropdown.classList.remove("show");
                    }
                }

                document.removeEventListener("mouseup", onDown);
            }
        };

        document.addEventListener("mouseup", onDown);
    }

    render() {
        const props = this.props;
        return (<div>
            <div
                style={{
                    alignItems: "center"
                }}>
                {editorStore.tReady &&
                    <HomeButton
                        translate={this.props.translate}
                    />
                }
            </div>
            <div
                style={{
                    position: "absolute",
                    right: 0,
                    display: "flex",
                    top: 0,
                    height: "100%",
                    paddingRight: '120px',
                }}
            >
                {
                    <div>
                        {editorStore.tReady &&
                            <label
                                className="input-sizer">
                                <input
                                    id="designTitle"
                                    type="text"
                                    defaultValue={this.props.designTitle}
                                    onInput={e => {
                                        let el = e.target as HTMLInputElement;
                                        (el.parentNode as HTMLLabelElement).dataset.value = el.value;
                                    }}
                                    size={this.props.designTitle ? this.props.designTitle.length : 0}
                                    placeholder="Untitled design"
                                />
                            </label>}
                    </div>
                }
                {(
                    editorStore.tReady &&
                    <button
                        id="download-btn"
                        onClick={e => {
                            this.props.playVideos(false)
                        }}
                        style={{
                            float: "right",
                            color: "white",
                            padding: "10px",
                            borderRadius: "4px",
                            textDecoration: "none",
                            fontSize: "13px",
                            background: "#ebebeb0f",
                            border: "none",
                            height: "40px",
                            alignItems: "center",
                            marginRight: "11px",
                        }}
                    >
                        <svg
                            style={{
                                fill: 'white',
                                height: '15px',
                                width: '27px',
                                marginLeft: '3px',
                            }}
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M2 24v-24l20 12-20 12z" /></svg>
                    </button>
                )}
                {(
                    editorStore.tReady &&
                    <button
                        id="download-btn"
                        onClick={this.handleDownloadList}
                        style={{
                            display: "flex",
                            float: "right",
                            color: "white",
                            padding: "8px",
                            borderRadius: "4px",
                            textDecoration: "none",
                            fontSize: "13px",
                            background: "#ebebeb0f",
                            border: "none",
                            height: "40px",
                            position: 'absolute',
                            zIndex: 9999999999,
                            right: '7px',
                            margin: 'auto',
                            top: 0,
                            bottom: 0,
                            alignItems: "center",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "15px",
                                margin: 0,
                                marginRight: "10px",
                                marginLeft: '5px',
                            }}>{this.props.translate("download")}</p>
                        <div
                            style={{
                                width: "18px",
                            }}>
                            <DownloadIcon fill="white" width="18px" height="18px" />
                        </div>
                    </button>
                )}
                {(
                    <DownloadList
                        downloadPNG={downloadPNG}
                        downloadPDF={downloadPDF}
                        downloadVideo={downloadVideo}
                        translate={this.props.translate}
                    />
                )}
                {/* <MoreList
                    translate={this.props.translate}
                />
                {
                    editorStore.tReady &&
                    <button
                        id="download-btn"
                        onClick={this.handleMoreList}
                        style={{
                            display: "flex",
                            float: "right",
                            color: "white",
                            padding: "0 8px",
                            borderRadius: "4px",
                            textDecoration: "none",
                            fontSize: "13px",
                            background: "#ebebeb0f",
                            border: "none",
                            height: "40px",
                            position: 'absolute',
                            zIndex: 9999999999,
                            right: '7px',
                            margin: 'auto',
                            top: 0,
                            bottom: 0,
                            alignItems: "center",
                        }}
                    >
                        <svg
                            style={{
                                margin: "auto",
                            }}
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="white" fill-rule="evenodd" d="M5 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm7 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm7 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"></path></svg>
                    </button>} */}
            </div></div>
        )
    }
}

export default LeftSide;