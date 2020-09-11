import React, { Component } from 'react'
import { SidebarTab, TemplateType, SavingState, } from "./enums";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import ImagePicker from "@Components/shared/ImagePicker";
import Tooltip from "@Components/shared/Tooltip";

export interface IProps {
    translate: any;
    scale: any;
    setScale: any;
    fitScale: any;
}

export interface IState {
    showZoomPopup: boolean;
}

const imgWidth = 162;

export default class ZoomController extends Component<IProps, IState> {
    state = {
        showZoomPopup: false,
    }

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div
                className="workSpaceBottomPanel___73_jE"
                data-bubble="false"
            >
                <div className="workSpaceButtons___f6jkZ">
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            boxShadow:
                                "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                            background: "#293039",
                            borderRadius: "5px",
                            height: "34px",
                        }}
                        className="zoom___21DG8"
                    >
                        <Tooltip
                            offsetLeft={0}
                            offsetTop={-5}
                            content={this.props.translate("zoomIn")}
                            delay={10}
                            style={{}}
                            position="top"
                        >
                            <button
                                onClick={e => {
                                    let scale = Math.max(0.1, this.props.scale - 0.15);
                                    this.props.setScale(scale);
                                }}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    height: "100%",
                                }}
                                className="zoomMinus___1Ooi5"
                                data-test="zoomMinus"
                                data-categ="tools"
                                data-value="zoomOut"
                                data-subcateg="bottomPanel"
                            >
                                <svg
                                    style={{
                                        width: "20px",
                                        height: "20px"
                                    }}
                                    viewBox="0 0 18 18"
                                    width="18"
                                    height="18"
                                    className="zoomSvg___1IAZj"
                                >
                                    <path d="M17.6,16.92,14,13.37a8.05,8.05,0,1,0-.72.72l3.56,3.56a.51.51,0,1,0,.72-.72ZM1,8a7,7,0,1,1,12,5h0A7,7,0,0,1,1,8Z"></path>
                                    <path d="M11.61,7.44H4.7a.5.5,0,1,0,0,1h6.91a.5.5,0,0,0,0-1Z"></path>
                                </svg>
                            </button>
                        </Tooltip>
                        <div className="zoomPercent___3286Z">
                            <button
                                onClick={e => {
                                    let self = this;
                                    this.setState({ showZoomPopup: true });
                                    this.forceUpdate();
                                    const onDownload = () => {
                                        self.setState({ showZoomPopup: false });
                                        document.removeEventListener(
                                            "click",
                                            onDownload
                                        );
                                    };
                                    document.addEventListener("click", onDownload);
                                }}
                                style={{
                                    height: "100%",
                                    color: "white",
                                    border: "none",
                                    background: "transparent",
                                    width: "55px",
                                    fontSize: "15px"
                                }}
                                className="scaleListButton___GEm7w zoomMain___1z1vk"
                                data-zoom="true"
                                data-categ="tools"
                                data-value="zoomPanelOpen"
                                data-subcateg="bottomPanel"
                            >
                                {Math.round(this.props.scale * 100)}%
                            </button>
                        </div>
                        <Tooltip
                            offsetLeft={0}
                            offsetTop={-5}
                            content={this.props.translate("zoomOut")}
                            delay={10}
                            style={{}}
                            position="top"
                        >
                            <button
                                onClick={e => {
                                    let scale = this.props.scale + 0.15;
                                    this.props.setScale(scale);
                                }}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    height: "100%",
                                }}
                                className="zoomPlus___1TbHD"
                                data-test="zoomPlus"
                                data-categ="tools"
                                data-value="zoomIn"
                                data-subcateg="bottomPanel"
                            >
                                <svg
                                    style={{
                                        width: "20px",
                                        height: "20px"
                                    }}
                                    viewBox="0 0 18 18"
                                    width="18"
                                    height="18"
                                    className="zoomSvg___1IAZj"
                                >
                                    <path d="M17.6,16.92,14,13.37a8.05,8.05,0,1,0-.72.72l3.56,3.56a.51.51,0,1,0,.72-.72ZM13,13h0a7,7,0,1,1,2.09-5A7,7,0,0,1,13,13Z"></path>
                                    <path d="M11.61,7.44h-3v-3a.5.5,0,1,0-1,0v3h-3a.5.5,0,1,0,0,1h3v3a.5.5,0,0,0,1,0v-3h3a.5.5,0,0,0,0-1Z"></path>
                                </svg>
                            </button>
                        </Tooltip>
                    </div>
                </div>
                {this.state.showZoomPopup && (
                    <div style={{
                        position: "absolute",
                        bottom: "100%",
                        left: "25px",
                    }}>
                        <ul
                            style={{
                                borderRadius: "5px",
                                padding: "5px",
                                listStyle: "none",
                                marginBottom: "5px",
                                background: "#293039"
                            }}
                            className="zoomPercentPanel___2ZfEJ"
                        >
                            <li className="zoomPercentPanelItem___29ZfQ">
                                <button
                                    onClick={e => {
                                        this.props.setScale(3);
                                        this.setState({ showZoomPopup: false });
                                    }}
                                    style={{
                                        width: "100%",
                                        color: "white",
                                        border: "none"
                                    }}
                                    className="scaleListButton___GEm7w"
                                    data-categ="tools"
                                    data-value="scalePercent_300"
                                    data-subcateg="bottomPanel"
                                >
                                    300%
                          </button>
                            </li>
                            <li className="zoomPercentPanelItem___29ZfQ">
                                <button
                                    onClick={e => {
                                        this.props.setScale(2);
                                        this.setState({ showZoomPopup: false });
                                    }}
                                    style={{
                                        width: "100%",
                                        color: "white",
                                        border: "none"
                                    }}
                                    className="scaleListButton___GEm7w"
                                    data-categ="tools"
                                    data-value="scalePercent_200"
                                    data-subcateg="bottomPanel"
                                >
                                    200%
                          </button>
                            </li>
                            <li className="zoomPercentPanelItem___29ZfQ">
                                <button
                                    onClick={e => {
                                        this.props.setScale(1.75);
                                        this.setState({
                                            showZoomPopup: false
                                        });
                                    }}
                                    style={{
                                        width: "100%",
                                        color: "white",
                                        border: "none"
                                    }}
                                    className="scaleListButton___GEm7w"
                                    data-categ="tools"
                                    data-value="scalePercent_175"
                                    data-subcateg="bottomPanel"
                                >
                                    175%
                          </button>
                            </li>
                            <li className="zoomPercentPanelItem___29ZfQ">
                                <button
                                    onClick={e => {
                                        this.props.setScale(1.5);
                                        this.setState({
                                            showZoomPopup: false
                                        });
                                    }}
                                    style={{
                                        width: "100%",
                                        color: "white",
                                        border: "none"
                                    }}
                                    className="scaleListButton___GEm7w"
                                    data-categ="tools"
                                    data-value="scalePercent_150"
                                    data-subcateg="bottomPanel"
                                >
                                    150%
                          </button>
                            </li>
                            <li className="zoomPercentPanelItem___29ZfQ">
                                <button
                                    onClick={e => {
                                        this.props.setScale(1.25);
                                        this.setState({
                                            showZoomPopup: false
                                        });
                                    }}
                                    style={{
                                        width: "100%",
                                        color: "white",
                                        border: "none"
                                    }}
                                    className="scaleListButton___GEm7w"
                                    data-categ="tools"
                                    data-value="scalePercent_125"
                                    data-subcateg="bottomPanel"
                                >
                                    125%
                          </button>
                            </li>
                            <li className="zoomPercentPanelItem___29ZfQ">
                                <button
                                    onClick={e => {
                                        this.props.setScale(1);
                                        this.setState({ showZoomPopup: false });
                                    }}
                                    style={{
                                        width: "100%",
                                        color: "white",
                                        border: "none"
                                    }}
                                    className="scaleListButton___GEm7w"
                                    data-categ="tools"
                                    data-value="scalePercent_100"
                                    data-subcateg="bottomPanel"
                                >
                                    100%
                          </button>
                            </li>
                            <li className="zoomPercentPanelItem___29ZfQ">
                                <button
                                    onClick={e => {
                                        this.props.setScale(0.75);
                                        this.setState({
                                            showZoomPopup: false
                                        });
                                    }}
                                    style={{
                                        width: "100%",
                                        color: "white",
                                        border: "none"
                                    }}
                                    className="scaleListButton___GEm7w"
                                    data-categ="tools"
                                    data-value="scalePercent_75"
                                    data-subcateg="bottomPanel"
                                >
                                    75%
                          </button>
                            </li>
                            <li className="zoomPercentPanelItem___29ZfQ">
                                <button
                                    onClick={e => {
                                        this.props.setScale(0.5);
                                        this.setState({
                                            showZoomPopup: false
                                        });
                                    }}
                                    style={{
                                        width: "100%",
                                        color: "white",
                                        border: "none"
                                    }}
                                    className="scaleListButton___GEm7w"
                                    data-categ="tools"
                                    data-value="scalePercent_50"
                                    data-subcateg="bottomPanel"
                                >
                                    50%
                          </button>
                            </li>
                            <li className="zoomPercentPanelItem___29ZfQ">
                                <button
                                    onClick={e => {
                                        this.props.setScale(0.25);
                                        this.setState({
                                            showZoomPopup: false
                                        });
                                    }}
                                    style={{
                                        width: "100%",
                                        color: "white",
                                        border: "none"
                                    }}
                                    className="scaleListButton___GEm7w"
                                    data-categ="tools"
                                    data-value="scalePercent_25"
                                    data-subcateg="bottomPanel"
                                >
                                    25%
                          </button>
                            </li>
                            <li className="zoomPercentPanelItem___29ZfQ">
                                <button
                                    onClick={e => {
                                        this.props.setScale(0.1);
                                        this.setState({
                                            showZoomPopup: false
                                        });
                                    }}
                                    style={{
                                        width: "100%",
                                        color: "white",
                                        border: "none"
                                    }}
                                    className="scaleListButton___GEm7w"
                                    data-categ="tools"
                                    data-value="scalePercent_10"
                                    data-subcateg="bottomPanel"
                                >
                                    10%
                          </button>
                            </li>
                            <li className="zoomPercentPanelItem___29ZfQ">
                                <button
                                    onClick={e => {
                                        this.props.setScale(this.props.fitScale);
                                        this.setState({
                                            showZoomPopup: false
                                        });
                                    }}
                                    style={{
                                        width: "100%",
                                        color: "white",
                                        border: "none"
                                    }}
                                    className="scaleListButton___GEm7w scaleListButtonActive___2GxqI"
                                    data-categ="tools"
                                    data-value="scaleToFit"
                                    data-subcateg="bottomPanel"
                                >
                                    {this.props.translate("fit")}
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        )
    }
}