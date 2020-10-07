import React, { Component } from "react";
import ReactDOMServer from 'react-dom/server';
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
import { camelCase } from "lodash";

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
    updateImages: any;
    forceEditorUpdate: any;
    setSavingState: any;
    handleEditmedia: any;
    saveImages: any;
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
        mounted: false,
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
        hasMoreVideos: true,
    };

    constructor(props) {
        super(props);
    }

    rem = 0;
    elRem = 0;
    elRemFont = 0;

    componentDidMount() {
        let height = imgWidth / editorStore.templateRatio + 10;
        this.rem = (Math.floor((document.getElementById('sidebar-content').getBoundingClientRect().height - 50) / height) + 1) * 2;
        this.elRem = (Math.floor((document.getElementById('sidebar-content').getBoundingClientRect().height - 50) / 105) + 1) * 3;
        this.elRemFont = (Math.floor((document.getElementById('sidebar-content').getBoundingClientRect().height) / 40) + 1);

        this.setState({ mounted: true, })
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
                    duration: vid.duration == Infinity ? 0 : vid.duration,
                });
            }
        };
    };

    uploadImage = (removeBackground, e) => {
        let type;
        switch (editorStore.selectedTab) {
            case SidebarTab.Image:
                type = TemplateType.Image;
                break;
            case SidebarTab.Upload:
                type = TemplateType.UserUpload;
                break;
            case SidebarTab.Background:
                type = TemplateType.BackgroundImage;
                break;
            case SidebarTab.Element:
                type = TemplateType.Element;
                break;
        }

        var self = this;
        var fileUploader = document.getElementById(
            "image-file"
        ) as HTMLInputElement;
        for (let i = 0; i < fileUploader.files.length; ++i) {
            let file = fileUploader.files[i];
            let fr = new FileReader();
            let fr2 = new FileReader();
            fr.readAsDataURL(file);
            fr2.readAsText(file);
            // fr2.onload = () => {
            fr.onload = () => {
                console.log('uploadImage');
                var url = `/api/Media/Add`;
                if (type === TemplateType.RemovedBackgroundImage) {
                    url = `/api/Media/Add2`;
                }
                var img = new Image();

                img.onload = function () {
                    let colorsMapping = {};
                    let cnt = 1;
                    let stopColor = [];
                    function processChildren(children) {
                        return Array.from(children.length ? children : []).map(
                            (node:any, i) => {
                                // return if text node
                                if (node.nodeType == 8 || node.nodeType == 10) return null;
                                if (node.nodeType === 3) return node.nodeValue;
                                // collect all attributes
                                if (node.attributes) {
                                    let attributes = Array.from(node.attributes).reduce((attrs, attr:any) => {
                                        if (attr.name == "style") {
                                            let style = createStyleJsonFromString(attr.value);
                                            if (style.fill && style.fill != 'inherit' && node.tagName != "svg") {
                                                if (!colorsMapping[style.fill]) {
                                                    colorsMapping[style.fill] = "color-" + cnt;
                                                    ++cnt;
                                                    stopColor.push(style.fill);
                                                }
                                                attrs['class'] = colorsMapping[style.fill];
                                            }
                                            attrs[attr.name] = style;
                                        } else {
                                            if (node.tagName == "stop" && attr.name == "stop-color") {
                                                if (!colorsMapping[attr.value]) {
                                                    colorsMapping[attr.value] = "color-" + cnt;
                                                    ++cnt;
                                                    stopColor.push(attr.value);
                                                }
                                                attrs['class'] = colorsMapping[attr.value];
                                            }
                                            if (node.tagName == "path" && attr.name == "fill" && attr.value.startsWith("#")) {
                                                if (!colorsMapping[attr.value]) {
                                                    colorsMapping[attr.value] = "color-" + cnt;
                                                    ++cnt;
                                                    stopColor.push(attr.value);
                                                }
                                                attrs['class'] = colorsMapping[attr.value];
                                            }
                                            
                                            if (node.tagName == "g" && attr.name == "fill") {
                                                if (!colorsMapping[attr.value]) {
                                                    colorsMapping[attr.value] = "color-" + cnt;
                                                    ++cnt;
                                                    stopColor.push(attr.value);
                                                }
                                                attrs['class'] = colorsMapping[attr.value];
                                            }

                                            if ((node.tagName == "circle" || 
                                                node.tagName == "polygon") && 
                                                attr.name == "fill" && 
                                                !attr.value.startsWith(`url(#SVGID_`) ) {
                                                if (!colorsMapping[attr.value]) {
                                                    colorsMapping[attr.value] = "color-" + cnt;
                                                    ++cnt;
                                                    stopColor.push(attr.value);
                                                }
                                                attrs['class'] = colorsMapping[attr.value];
                                            }
                                            attrs[attr.name] = attr.value;
                                        }
                                        return attrs;
                                    }, {});
                                }

                                // create React component
                                return React.createElement(node.nodeName, {
                                    ...attributes,
                                    key: i
                                }, processChildren(node.childNodes));
                            });
                    }

                    function createStyleJsonFromString(styleString) {
                        styleString = styleString || '';
                        var styles = styleString.split(/;(?!base64)/);
                        var singleStyle, key, value, jsonStyles = {};
                        for (var i = 0; i < styles.length; ++i) {
                            singleStyle = styles[i].split(':');
                            if (singleStyle.length > 2) {
                                singleStyle[1] = singleStyle.slice(1).join(':');
                            }

                            key = singleStyle[0];
                            value = singleStyle[1];
                            if (typeof value === 'string') {
                                value = value.trim();
                            }

                            if (key != null && value != null && key.length > 0 && value.length > 0) {
                                jsonStyles[camelCase(key)] = value;
                            }
                        }

                        return jsonStyles;
                    }

                    const parser = new DOMParser();
                    let elXML: any = fr2.result.toString();
                    for (let i = 0; i < 26; ++i) {
                        let c = String.fromCharCode(97 + i);
                        elXML = elXML.replaceAll(`id="${c}"`, `id="SVGID_${i+1}_"`);
                        elXML = elXML.replaceAll(`url(#${c})`, `url(#SVGID_${i+1}_)`);
                    }
                    const xmlDoc = parser.parseFromString(elXML, 'text/xml');

                    let ABC = processChildren(Array.from(xmlDoc.childNodes));

                    axios
                        .post(url, {
                            id: uuidv4(),
                            ext: file.name.split(".")[1],
                            userEmail: Globals.serviceUser ? Globals.serviceUser.username : "admin@draft.vn",
                            // color: `rgb(${prominentColor.r}, ${prominentColor.g}, ${prominentColor.b})`,
                            stopColor,
                            path: ReactDOMServer.renderToString(ABC),
                            data: fr.result,
                            width: img.width,
                            height: img.height,
                            type,
                            keywords: [(document.getElementById("keywords") as HTMLInputElement).value],
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

                img.src = fr.result.toString();
            };
        }

        this.forceUpdate();
    };

    imgDragging = null;

    handleEditFont = item => {
        this.props.handleEditFont(item);
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

    render() {
        let image = toJS(editorStore.images2.get(editorStore.idObjectSelected)) || {};

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
                    outline: "1px solid rgba(14,19,24,.03)",
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
                            editorStore.isAdmin
                                ? "block"
                                : "none"
                    }}
                >
                    <input
                        id="image-file"
                        type="file"
                        multiple
                        onLoadedData={data => { }}
                        onChange={e => {
                            editorStore.selectedTab === SidebarTab.Video
                                ? this.uploadVideo()
                                : editorStore.selectedTab === SidebarTab.Font
                                    ? this.uploadFont(e)
                                    : this.uploadImage(false, e);
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
                        onClick={e => {
                            if (editorStore.selectedTab == SidebarTab.Font)
                                this.uploadFont(e);
                            else this.uploadImage.bind(
                                false
                            )
                        }}
                    >
                        Upload
                    </button>
                    <span>IsVideo</span>
                    <input type="checkbox" id="vehicle1" checked={editorStore.isVideo} onChange={e => {
                        editorStore.isVideo = !editorStore.isVideo;
                    }} />
                    <span>Ispopular</span>
                    <input type="checkbox" id="vehicle1" checked={editorStore.isPopular} onChange={e => {
                        editorStore.isPopular = !editorStore.isPopular;
                    }} />
                    <input id="popularity" type="text" placeholder="popularity" value={editorStore.popularity} onChange={e => {
                        editorStore.popularity = parseInt(e.target.value);
                    }} />
                    <button
                        style={{
                            bottom: 0,
                            right: 0
                        }}
                        onClick={this.handleRemoveAllMedia.bind(this)}
                    >
                        RemoveAll
                    </button>
                    <input id="fontNameInp" placeholder="fontNameInp" type="text" />
                    <input id="fontId" type="text" placeholder="fontId" />
                    <input id="keywords" type="text" placeholder="keywords" />
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
                    <button
                        onClick={e => {
                            this.props.saveImages(null, false, true)
                        }
                        }
                    >
                        Save
                        </button>
                </div>
                <div
                    id="sidebar-content"
                    style={{
                        position: "relative",
                        height: `calc(100% - ${editorStore.isAdmin
                                ? 125
                                : 0
                            }px)`,
                        width: "370px",
                    }}
                >
                    {this.state.mounted && <div>
                        <SidebarImage
                            scale={this.props.scale}
                            handleImageSelected={this.props.handleImageSelected}
                            translate={this.props.translate}
                            selectedTab={editorStore.selectedTab}
                            handleEditmedia={this.props.handleEditmedia}
                            setSavingState={this.props.setSavingState}
                            updateImages={this.props.updateImages}
                        />
                        <SidebarText
                            handleEditmedia={this.props.handleEditmedia}
                            translate={this.props.translate}
                            selectedTab={editorStore.selectedTab}
                            handleImageSelected={this.props.handleImageSelected}
                            scale={this.props.scale}
                            setSavingState={this.props.setSavingState}
                        />
                        {editorStore.templateRatio && this.state.mounted && this.props.mounted && editorStore.tReady &&
                            <SidebarTemplate
                                handleEditmedia={this.props.handleEditmedia}
                                scale={this.props.scale}
                                translate={this.props.translate}
                                selectedTab={editorStore.selectedTab}
                                subtype={editorStore.subtype}
                                rectWidth={this.props.rectWidth}
                                rectHeight={this.props.rectHeight}
                                forceEditorUpdate={this.props.forceEditorUpdate}
                                rem={this.rem}
                            />}
                        <SidebarBackground
                            handleEditmedia={this.props.handleEditmedia}
                            scale={this.props.scale}
                            translate={this.props.translate}
                            selectedTab={editorStore.selectedTab}
                            rectWidth={this.props.rectWidth}
                            rectHeight={this.props.rectHeight}
                            handleImageSelected={this.props.handleImageSelected}
                            updateImages={this.props.updateImages}
                            rem={this.elRem}
                        />
                        <SidebarFont
                            updateImages={this.props.updateImages}
                            handleEditmedia={this.props.handleEditmedia}
                            scale={this.props.scale}
                            translate={this.props.translate}
                            selectedTab={editorStore.selectedTab}
                            handleEditFont={this.handleEditFont}
                            fontId={editorStore.fontId}
                            rem={this.elRemFont}
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
                            idImageSelected={editorStore.idObjectSelected}
                            childIdSelected={editorStore.childId}
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
                            rem={this.elRem}
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
                        {Globals.serviceUser &&
                            <SidebarUserUpload
                                scale={this.props.scale}
                                handleImageSelected={this.props.handleImageSelected}
                                translate={this.props.translate}
                                selectedTab={editorStore.selectedTab}
                                handleEditmedia={this.props.handleEditmedia}
                                setSavingState={this.props.setSavingState}
                            />
                        }
                    </div>}
                </div>
            </div>
        );
    }
}

export default LeftSide;
