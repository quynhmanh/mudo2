import React, {Component} from "react";
import { TemplateType, SidebarTab } from "@Components/editor/enums";
import { observer } from "mobx-react";
import editorStore from "@Store/EditorStore";
import Globals from "@Globals";
import loadable from "@loadable/component";
const DownloadIcon = loadable(() => import("@Components/shared/svgs/DownloadIcon"));
const DownloadList = loadable(() => import("@Components/editor/DownloadList"));
const Home = loadable(() => import("@Components/shared/svgs/HomeIcon"));
const HomeButton = loadable(() => import("@Components/editor/HomeButton"));

interface IProps {
    translate: any;
    downloadPNG: any;
    downloadPDF: any;
    downloadVideo: any;
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
        let image = editorStore.images2.get(editorStore.idObjectSelected);
        const props = this.props;
        // const { editorStore } = props;
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
                            }}
                        >
                            {
                            <div>
                            {/* <input 
                                id="designTitle"
                                style={{
                                    height: "35px",
                                    marginRight: "20px",
                                    marginTop: "9px",
                                    backgroundColor: "transparent",
                                    color: "white",
                                    border: "1px solid white",
                                    borderRadius: "5px",
                                    padding: "7px 15px",
                                    fontWeight: "bold",
                                    fontSize: "15px",
                                }}
                                // onkeypress={this.style.width = ((this.value.length + 1) * 8) + 'px';"
                                onKeyPress={e => {
                                    const val = (e.target.value.length) * 9 + 30;
                                    e.target.style.width = val + 'px';
                                }}
                                defaultValue={this.state.designTitle}/> */}
                                {/* <label 
                                    className="input-sizer">
                                    <input 
                                        id="designTitle"
                                        type="text" 
                                        defaultValue={this.state.designTitle}
                                        // onInput="this.parentNode.dataset.value = this.value" 
                                        onInput={e => {
                                            e.target.parentNode.dataset.value = e.target.value;
                                        }}
                                        size={this.state.designTitle ? this.state.designTitle.length : 0} 
                                        />
                                </label> */}
                                </div>
                            }
                            {/* {Globals.serviceUser &&
                                Globals.serviceUser.username &&
                                (Globals.serviceUser.username === adminEmail || 
                                    Globals.serviceUser.username == "manhquynhpro123@gmail.com") && (
                                    <button
                                        className="toolbar-btn dropbtn-font"
                                        onClick={this.saveImages.bind(this, null, false)}
                                        style={{
                                            display: "flex",
                                            marginTop: "4px",
                                            fontSize: "13px"
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "14px",
                                                margin: "auto",
                                                marginRight: "5px"
                                            }}
                                        >
                                            <svg
                                                version="1.1"
                                                id="Layer_1"
                                                x="0px"
                                                y="0px"
                                                viewBox="0 0 512 512"
                                            >
                                                <path
                                                    style={{
                                                        fill: this.state.isSaving ? "red" : "black"
                                                    }}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z"
                                                />
                                            </svg>
                                        </div>
                                        <span>Lưu</span>
                                    </button>
                                )} */}
                            {/* {Globals.serviceUser &&
                            Globals.serviceUser.username &&
                            Globals.serviceUser.username === adminEmail &&
                            this.props.tReady &&
                            (
                                <button
                                    className="toolbar-btn dropbtn-font"
                                    onClick={this.saveImages.bind(this, null, true)}
                                    style={{
                                        display: "flex",
                                        marginTop: "4px",
                                        fontSize: "13px"
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "14px",
                                            margin: "auto",
                                            marginRight: "5px"
                                        }}
                                    >
                                        <svg
                                            version="1.1"
                                            id="Layer_1"
                                            x="0px"
                                            y="0px"
                                            viewBox="0 0 512 512"
                                        >
                                            <path
                                                style={{
                                                    fill: this.state.isSaving ? "red" : "black"
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z"
                                            />
                                        </svg>
                                    </div>
                                    <span>Lưu video</span>
                                </button>
                            )} */}
                            {(
                                // <Tooltip
                                //     offsetLeft={0}
                                //     offsetTop={5}
                                //     content={this.translate("download")}
                                //     delay={10}
                                //     style={{}}
                                //     position="bottom"
                                // >
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
                                            // width: "36px"
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
                                // </Tooltip>
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