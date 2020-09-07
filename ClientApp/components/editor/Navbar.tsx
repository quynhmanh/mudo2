import React, {Component} from "react";
import { TemplateType, SidebarTab } from "@Components/editor/enums";
import { observer } from "mobx-react";
import editorStore from "@Store/EditorStore";
import Globals from "@Globals";
import loadable from "@loadable/component";
const DownloadList = loadable(() => import("@Components/editor/DownloadList"));
const Home = loadable(() => import("@Components/shared/svgs/HomeIcon"));
const HomeButton = loadable(() => import("@Components/editor/HomeButton"));

import DownloadIcon from "@Components/shared/svgs/DownloadIcon";

interface IProps {
    translate: any;
    downloadPNG: any;
    downloadPDF: any;
    downloadVideo: any;
    designTitle: any;
    playVideos: any;
}

interface IState {
}

const alignList = [
    { title: "alignLeft", align: "left", iconPath: require("@Components/shared/svgs/editor/toolbar/alignLeft.svg") },
    { title: "alignCenter", align: "center",iconPath: require("@Components/shared/svgs/editor/toolbar/alignCenter.svg") },
    { title: "alignRight", align: "right",iconPath: require("@Components/shared/svgs/editor/toolbar/alignRight.svg") }
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
                                            e.target.parentNode.dataset.value = e.target.value;
                                        }}
                                        size={this.props.designTitle ? this.props.designTitle.length : 0} 
                                        />
                                </label>}
                                </div>
                            }
                            {(
                                editorStore.tReady &&
                                    <button
                                        id="download-btn"
                                        onClick={this.props.playVideos}
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
                                            height: "35px",
                                        }}
                                    >
                                       <svg 
                                        style={{
                                            fill: 'white',
                                            height: '18px',
                                            width: '27px',
                                            marginLeft: '6px',
                                        }}
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M2 24v-24l20 12-20 12z"/></svg>
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
                                            height: "35px",
                                            position: 'absolute',
                                            zIndex: 9999999999,
                                            right: '10px',
                                            margin: 'auto',
                                            top: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        {/* {" "} */}
                                        <p
                                            style={{
                                                fontSize: "15px",
                                                marginRight: "10px",
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
                                    downloadPNG={this.props.downloadPNG.bind(this)}
                                    downloadPDF={this.props.downloadPDF.bind(this)}
                                    downloadVideo={this.props.downloadVideo.bind(this)}
                                    translate={this.props.translate}
                                />
                            )}
                        </div></div>
        )
    }
}

export default LeftSide;