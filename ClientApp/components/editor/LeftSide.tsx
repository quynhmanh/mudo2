import React, { Component } from "react";
import TopMenu from "@Components/editor/Sidebar";
import Globals from "@Globals";
import axios from "axios";
import uuidv4 from "uuid/v4";
import { getMostProminentColor } from "@Utils";
import { toJS } from "mobx";
import editorStore from "@Store/EditorStore";
import SidebarVideo from "@Components/editor/SidebarVideo";
import SidebarImage from "@Components/editor/SidebarImage";
import SidebarText from "@Components/editor/SidebarText";
import SidebarTemplate from "@Components/editor/SidebarTemplate";
import SidebarBackground from "@Components/editor/SidebarBackground";
import SidebarFont from "@Components/editor/SidebarFont";
import SidebarEffect from "@Components/editor/SidebarEffect";
import SidebarColor from "@Components/editor/SidebarColor";
import SidebarElement from "@Components/editor/SidebarElement";
import SidebarUserUpload from "@Components/editor/SidebarUserUpload";
import { SidebarTab, TemplateType } from "./enums";

import { observer } from "mobx-react";

export interface IProps {
    id: string;
    effectId: number;
    align: any;
    toolbarOpened: any;
    toolbarSize: any;
    mode: any;
    handleSidebarSelectorClicked: any;
    selectedTab: any;
    rectWidth: number;
    rectHeight: number;
    idObjectSelected: string;
    childId: string;
    typeObjectSelected: any;
    handleFontColorChange: any;
    selectFont: any;
    subtype: any;
    mounted: boolean;
    setSelectionColor: any;
    imgOnMouseDown: any;
    videoOnMouseDown: any;
    textOnMouseDown: any;
    translate: any;
    tReady: boolean;
    fontId: any;
    scale: number;
    handleEditFont: any;
    handleImageSelected: any;
    colorPickerShown: any;
    handleApplyEffect: any;
    selectedImage: any;
    pauser: any;
    backgroundOnMouseDown: any;
    templateOnMouseDown: any;
    updateImages: any;
    forceEditorUpdate: any;
    setSavingState: any;
    handleEditmedia: any;
}

interface IState {
    isLoading: boolean;
    items: any;
    items2: any;
    hasMoreFonts: boolean;
    userUpload1: any;
    userUpload2: any;
    currentUserUpload1: number;
    currentUserUpload2: number;
    currentItemsHeight: any;
    currentItems2Height: any;
    cursor: any;
    hasMoreImage: any;
    error: any;
    mounted: boolean;
    backgrounds1: any;
    backgrounds2: any;
    backgrounds3: any;
    groupedTexts: any;
    groupedTexts2: any;
    templates: any;
    templates2: any;
    images: any;
    removeImages1: any;
    removeImages2: any;
    videos: any;
    hasMoreVideos: any;
    isBackgroundLoading: boolean;
    currentBackgroundHeights1: number;
    currentBackgroundHeights2: number;
    currentBackgroundHeights3: number;
    isTextTemplateLoading: boolean;
    currentGroupedTextsHeight: number;
    currentGroupedTexts2Height: number;
    hasMoreTemplate: boolean;
    isTemplateLoading: any;
    hasMoreTextTemplate: boolean;
    isUserUploadLoading: boolean;
    hasMoreUserUpload: boolean;
    isRemovedBackgroundImageLoading: boolean;
    hasMoreRemovedBackground: boolean;
    currentHeightRemoveImage1: number;
    currentHeightRemoveImage2: number;
    hasMoreBackgrounds: boolean;
    currentTemplatesHeight: number;
    currentTemplate2sHeight: number;
    isLoadingFont: boolean;
}

const imgWidth = 162;
const backgroundWidth = 105;

const adminEmail = "llaugusty@gmail.com";

@observer
class LeftSide extends Component<IProps, IState> {
    state = {
        query: "",
        isLoading: false,
        items: [],
        items2: [],
        hasMoreFonts: true,
        isLoadingFont: false,
        userUpload1: [],
        userUpload2: [],
        currentItemsHeight: 0,
        currentItems2Height: 0,
        cursor: null,
        hasMoreImage: true,
        error: null,
        mounted: true,
        backgrounds1: [],
        backgrounds2: [],
        backgrounds3: [],
        groupedTexts: [],
        groupedTexts2: [],
        templates: [],
        templates2: [],
        images: [],
        removeImages1: [],
        removeImages2: [],
        videos: [],
        isBackgroundLoading: false,
        currentBackgroundHeights1: 0,
        currentBackgroundHeights2: 0,
        currentBackgroundHeights3: 0,
        currentGroupedTextsHeight: 0,
        currentGroupedTexts2Height: 0,
        currentTemplatesHeight: 0,
        currentTemplate2sHeight: 0,
        hasMoreTemplate: true,
        isTemplateLoading: false,
        subtype: null,
        isTextTemplateLoading: false,
        hasMoreTextTemplate: true,
        currentHeightRemoveImage1: 0,
        currentHeightRemoveImage2: 0,
        currentUserUpload1: 0,
        currentUserUpload2: 0,
        hasMoreBackgrounds: true,
        isUserUploadLoading: false,
        hasMoreUserUpload: true,
        isRemovedBackgroundImageLoading: false,
        hasMoreRemovedBackground: true,
        hasMoreVideos: true
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.forceUpdate();
    }

    componentDidUpdate(prevProps, prevState) {
    }

    handleMakeAsPopular = () => {
        const url = `/api/Template/MakeAsPopulate?id=${this.props.id}`;
        axios.post(url, {
            id: this.props.id
        }).then(res => {

        });
    }

    handleRemoveAllMedia = () => {
        var model;
        if (
            editorStore.selectedTab === SidebarTab.Image ||
            editorStore.selectedTab === SidebarTab.Background
        ) {
            model = "Media";
        } else if (
            editorStore.selectedTab === SidebarTab.Template ||
            editorStore.selectedTab === SidebarTab.Text
        ) {
            model = "Template";
        }
        const url = `/api/${model}/RemoveAll`;

        fetch(url);
    };

    uploadFont = e => {
        var self = this;
        var fileUploader = document.getElementById(
            "image-file"
        ) as HTMLInputElement;
        var file = fileUploader.files[0];
        var fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = () => {
            var url = `/api/Font/Add`;
            axios.post(url,
                {
                    id: (document.getElementById("fontId") as HTMLInputElement).value,
                    data: fr.result,
                    name: (document.getElementById("fontNameInp") as HTMLInputElement).value,
                }).then(() => {
                    self.setState({ hasMoreFonts: true });
                });
        };
    };

    uploadVideo = () => {
        var self = this;
        ``;
        var fileUploader = document.getElementById(
            "image-file"
        ) as HTMLInputElement;
        var file = fileUploader.files[0];
        var fr = new FileReader();
        fr.readAsDataURL(file);

        var vid = document.createElement("video");

        fr.onload = () => {
            var vid = document.createElement("video");
            let url = URL.createObjectURL(file);
            vid.src = URL.createObjectURL(file);
            vid.onloadedmetadata = () => {
                var url = `/api/Media/AddVideo`;
                axios.post(url, {
                    id: uuidv4(),
                    data: fr.result,
                    type: TemplateType.Video,
                    ext: file.name.split(".")[1],
                    width: vid.videoWidth,
                    height: vid.videoHeight,
                    duration: vid.duration,
                });
            }
        };
    };

    uploadImage = (type, removeBackground, e) => {
        var self = this;
        var fileUploader = document.getElementById(
            "image-file"
        ) as HTMLInputElement;
        var file = fileUploader.files[0];
        var fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = () => {
            var url = `/api/Media/Add`;
            if (type === TemplateType.RemovedBackgroundImage) {
                url = `/api/Media/Add2`;
            }
            var i = new Image();

            i.onload = function () {
                var prominentColor = getMostProminentColor(i);
                axios
                    .post(url, {
                        id: uuidv4(),
                        ext: file.name.split(".")[1],
                        userEmail: Globals.serviceUser.username,
                        color: `rgb(${prominentColor.r}, ${prominentColor.g}, ${prominentColor.b})`,
                        data: fr.result,
                        width: i.width,
                        height: i.height,
                        type,
                        keywords: ["123", "123"],
                        title: "Manh quynh"
                    })
                    .then((res) => {
                        if (self.state.userUpload1.length <= self.state.userUpload2.length) {
                            self.setState({
                                userUpload1: [res.data, ...self.state.userUpload1]
                            });
                        } else {
                            self.setState({
                                userUpload2: [res.data, ...self.state.userUpload1]
                            });
                        }
                    });
            };

            i.src = fr.result.toString();
        };

        this.forceUpdate();
    };


    handleQuery = e => {
        if (e.key === "Enter") {
            this.setState({ items: [], items2: [] }, () => {
                this.loadMore(true);
            });
        }
    };

    imgDragging = null;

    handleEditFont = item => {
        this.props.handleEditFont(item);
    };

    textOnMouseDown = (id, e) => {
        var doc = this.state.groupedTexts.find(doc => doc.id == id);
        if (!doc) {
            doc = this.state.groupedTexts2.find(doc => doc.id == id);
        }

        this.props.textOnMouseDown(e, doc);
    };

    handleDeleteTemplate = () => {
        var url = `/api/Template/Delete?id=${this.props.id}`;
        axios.delete(url);
    };

    handleUndeleteTemplate = () => {
        var url = `/api/Template/Undelete?id=${this.props.id}`;
        axios.delete(url);
    }

    handleSidebarSelectorClicked = (tab, e) => {
        editorStore.selectedTab = tab;
    };

    addText = (text, fontSize, fontFace, fontRepresentative, width, height) => {
        var item = {
            _id: uuidv4(),
            type: TemplateType.Heading,
            align: "alignLeft",
            width: width,
            origin_width: width,
            height: height * 1,
            origin_height: height,
            left: 0,
            top: 0,
            rotateAngle: 0.0,
            innerHTML: `<div class="font" style="font-size: ${fontSize}px;">${text}</div>`,
            scaleX: 1,
            scaleY: 1,
            ref: editorStore.idObjectSelected,
            page: editorStore.activePageId,
            zIndex: editorStore.upperZIndex + 1,
            color: "black",
            fontSize: fontSize,
            fontRepresentative: fontRepresentative,
            hovered: true,
            selected: true,
            fontFace: fontFace,
            effectId: 8,
            lineHeight: 1.4,
            letterSpacing: 30,
            opacity: 100,
        };

        editorStore.addItem2(item, true);
        this.props.handleImageSelected(item._id, editorStore.activePageId, null, true);

        let index = editorStore.pages.findIndex(pageId => pageId == editorStore.activePageId);
        editorStore.keys[index] = editorStore.keys[index] + 1;

        setTimeout(() => {
            let el = document.getElementById(item._id + "hihi4alo");
            let range = document.createRange();
            range.selectNodeContents(el)
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }, 100);

        editorStore.increaseUpperzIndex();
    }

    render() {
        let image = editorStore.images2.get(editorStore.idObjectSelected) || {};
        if (editorStore.childId && image.document_object) {
            image = image.document_object.find(text => text._id == editorStore.childId) || {};
        }
        return (
            <div
                style={{
                    backgroundColor: "#293039",
                    flexDirection: "row",
                    zIndex: 11111,
                    width: this.props.toolbarOpened
                        ? `${this.props.toolbarSize}px`
                        : "80px",
                    height: "100%",
                    position: "relative",
                    display: "flex",
                    outline: "1px solid rgba(14,19,24,.15)",
                }}
            >
                <div
                    style={{
                        width: `80px`,
                        zIndex: 1111111111,
                        flexDirection: 'column',
                    }}
                >
                    {editorStore.tReady &&
                        <TopMenu
                            translate={this.props.translate}
                            mounted={this.props.mounted}
                            mode={this.props.mode}
                            toolbarSize={this.props.toolbarSize}
                            selectedTab={editorStore.selectedTab}
                            onClick={this.handleSidebarSelectorClicked}
                            tReady={this.props.tReady}
                        />}
                </div>
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        zIndex: 1111111112,
                        backgroundColor: "white",
                        width: "100%",
                        display:
                            Globals.serviceUser &&
                                Globals.serviceUser.username &&
                                Globals.serviceUser.username === adminEmail
                                ? "block"
                                : "none"
                    }}
                >
                    <input
                        id="image-file"
                        type="file"
                        onLoad={data => { }}
                        onLoadedData={data => { }}
                        onChange={e => {
                            editorStore.selectedTab === SidebarTab.Video
                                ? this.uploadVideo()
                                : editorStore.selectedTab === SidebarTab.Font
                                    ? this.uploadFont(e)
                                    : this.uploadImage(
                                        editorStore.selectedTab === SidebarTab.Image
                                            ? TemplateType.Image
                                            : editorStore.selectedTab === SidebarTab.Upload
                                                ? TemplateType.UserUpload
                                                : editorStore.selectedTab === SidebarTab.Background
                                                    ? TemplateType.BackgroundImage
                                                    : editorStore.selectedTab ===
                                                        SidebarTab.RemovedBackgroundImage
                                                        ? TemplateType.RemovedBackgroundImage
                                                        : TemplateType.RemovedBackgroundImage,
                                        false,
                                        e
                                    );
                        }}
                        style={{
                            bottom: 0
                        }}
                    />
                    <button
                        style={{
                            bottom: 0
                        }}
                        type="submit"
                        onClick={
                            editorStore.selectedTab === SidebarTab.Font
                                ? this.uploadFont.bind(this)
                                : this.uploadImage.bind(
                                    this,
                                    editorStore.selectedTab === SidebarTab.Image
                                        ? TemplateType.Image : 
                                        editorStore.selectedTab === SidebarTab.Upload ? TemplateType.UserUpload 
                                        : TemplateType.BackgroundImage,
                                    false
                                )
                        }
                    >
                        Upload
                    </button>
                    <button
                        style={{
                            bottom: 0,
                            right: 0
                        }}
                        onClick={this.handleRemoveAllMedia.bind(this)}
                    >
                        RemoveAll
                    </button>
                    <input id="fontNameInp" type="text" />
                    <input id="fontId" type="text" />
                    <button
                        style={{
                            bottom: 0,
                            right: 0
                        }}
                        onClick={this.handleMakeAsPopular.bind(this)}
                    >
                        MakeAsPopular
                    </button>
                    <button
                        style={{
                            bottom: 0,
                            right: 0
                        }}
                        onClick={this.handleDeleteTemplate.bind(this)}
                    >
                        Delete
                    </button>
                    <button
                        style={{
                            bottom: 0,
                            right: 0
                        }}
                        onClick={this.handleUndeleteTemplate.bind(this)}
                    >
                        Undelete
                    </button>
                </div>
                {this.props.mounted && this.props.toolbarOpened && (
                    <div
                        id="sidebar-content"
                        style={{
                            position: "relative",
                            height: `calc(100% - ${
                                Globals.serviceUser &&
                                    Globals.serviceUser.username &&
                                    Globals.serviceUser.username == adminEmail
                                    ? 78
                                    : 0
                                }px)`,
                            width: "370px",
                            transitionDuration: "10s, 10s",
                            // backgroundColor: editorStore.selectedTab === SidebarTab.Effect ? "white" : "#293039",
                        }}
                    >
                        <SidebarImage
                            scale={this.props.scale}
                            handleImageSelected={this.props.handleImageSelected}
                            translate={this.props.translate}
                            selectedTab={editorStore.selectedTab}
                            handleEditmedia={this.props.handleEditmedia}
                            setSavingState={this.props.setSavingState}
                        />
                        <SidebarText
                            handleEditmedia={this.props.handleEditmedia}
                            translate={this.props.translate}
                            selectedTab={editorStore.selectedTab}
                            handleImageSelected={this.props.handleImageSelected}
                            scale={this.props.scale}
                            setSavingState={this.props.setSavingState}
                        />
                        <SidebarTemplate
                            handleEditmedia={this.props.handleEditmedia}
                            scale={this.props.scale}
                            translate={this.props.translate}
                            selectedTab={editorStore.selectedTab}
                            subtype={this.props.subtype}
                            rectWidth={this.props.rectWidth}
                            rectHeight={this.props.rectHeight}
                            forceEditorUpdate={this.props.forceEditorUpdate}
                        />
                        <SidebarBackground
                            handleEditmedia={this.props.handleEditmedia}
                            scale={this.props.scale}
                            translate={this.props.translate}
                            selectedTab={editorStore.selectedTab}
                            rectWidth={this.props.rectWidth}
                            rectHeight={this.props.rectHeight}
                            handleImageSelected={this.props.handleImageSelected}
                            updateImages={this.props.updateImages}
                        />
                        <SidebarFont
                            updateImages={this.props.updateImages}
                            handleEditmedia={this.props.handleEditmedia}
                            scale={this.props.scale}
                            translate={this.props.translate}
                            selectedTab={editorStore.selectedTab}
                            handleEditFont={this.handleEditFont}
                        />

                        <SidebarEffect
                            updateImages={this.props.updateImages}
                            handleEditmedia={this.props.handleEditmedia}
                            scale={this.props.scale}
                            translate={this.props.translate}
                            selectedTab={editorStore.selectedTab}
                            pauser={this.props.pauser}
                            handleImageSelected={this.props.handleImageSelected}
                            effectId={editorStore.effectId}
                        />
                        <SidebarColor
                            updateImages={this.props.updateImages}
                            handleEditmedia={this.props.handleEditmedia}
                            scale={this.props.scale}
                            translate={this.props.translate}
                            selectedTab={editorStore.selectedTab}
                            pauser={this.props.pauser}
                            handleImageSelected={this.props.handleImageSelected}
                            effectId={editorStore.effectId}
                        />
                        <SidebarElement
                            handleEditmedia={this.props.handleEditmedia}
                            scale={this.props.scale}
                            translate={this.props.translate}
                            selectedTab={editorStore.selectedTab}
                            rectWidth={this.props.rectWidth}
                            rectHeight={this.props.rectHeight}
                            handleImageSelected={this.props.handleImageSelected}
                            setSavingState={this.props.setSavingState}
                        />
                        <SidebarVideo
                            scale={this.props.scale}
                            videoOnMouseDown={this.props.videoOnMouseDown}
                            translate={this.props.translate}
                            selectedTab={editorStore.selectedTab}
                            handleImageSelected={this.props.handleImageSelected}
                            setSavingState={this.props.setSavingState}
                            handleEditmedia={this.props.handleEditmedia}
                        />
                        <SidebarUserUpload
                            scale={this.props.scale}
                            handleImageSelected={this.props.handleImageSelected}
                            translate={this.props.translate}
                            selectedTab={editorStore.selectedTab}
                            handleEditmedia={this.props.handleEditmedia}
                            setSavingState={this.props.setSavingState}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default LeftSide;
