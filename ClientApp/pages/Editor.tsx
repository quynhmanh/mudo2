import React, { Component } from "react";
import uuidv4 from "uuid/v4";
import "@Styles/editor.scss";
import { Helmet } from "react-helmet";
import { withTranslation } from "react-i18next";
import { SidebarTab, Mode, TemplateType, SavingState, CanvasType, } from "@Components/editor/enums";
import loadable from "@loadable/component";
import ReactDOMServer from 'react-dom/server';

import {
    catchError,
} from 'rxjs/operators';

const Canvas = loadable(() => import("@Components/editor/Canvas"));
const PreviewCanvas = loadable(() => import("@Components/editor/PreviewCanvas"));

const MediaEditPopup = loadable(() => import("@Components/editor/MediaEditor"));
const TemplateEditor = loadable(() => import("@Components/editor/TemplateEditor"));
const FontEditPopup = loadable(() => import("@Components/editor/FontEditor"));
const Popup = loadable(() => import("@Components/shared/Popup"));
const Toolbar = loadable(() => import("@Components/editor/toolbar/Toolbar"));
const LeftSide = loadable(() => import("@Components/editor/LeftSide"));
const Narbar = loadable(() => import("@Components/editor/Navbar"));
const ZoomController = loadable(() => import("@Components/editor/ZoomController"));

import {
    isNode, transformPoint, processChildren, handleBlockAnimation,
} from "@Utils";

import {
    Observable
} from "rxjs";

let rotateRect,
    rotatePoint,
    getCursorStyleWithRotateAngle,
    getCursorStyleForResizer,
    centerToTL,
    tLToCenter,
    getNewStyle,
    degToRadian,
    updatePosition,
    getLength,
    getAngle,
    transformImage,
    fromEvent,
    merge,
    NEVER,
    BehaviorSubject,
    map,
    filter,
    switchMap,
    takeUntil,
    updateXGuide,
    updateYGuide,
    getGuideOfImage,
    hideGuide,
    handleFadeAnimation,
    ungroupGroupedItem,
    groupGroupedItem,
    handleItalicBtnClick,
    handleBoldBtnClick,
    handleCropBtnClick,
    handleGridCrop,
    handleTransparentAdjust,
    handleFontSizeBtnClick,
    handleChildCrop,
    onTextChange,
    handleAlignBtnClick,
    selectFont,
    doNoObjectSelected,
    handleScroll,
    handleWheel,
    copyImage,
    removeImage,
    saveImages,
    handleResizeStart,
    handleDragStart,
    handleRotateStart,
    handleResizeInnerImageStart,
    first;

let editorStore: any = {};
let axios;
let Globals;
let toJS;
let editorTranslation;
let clone;

if (!isNode()) {
    axios = require("axios").default;
    Globals = require("@Globals").default;
    editorStore = require("@Store/EditorStore").default;
    editorTranslation = require("@Locales/default/editor").default;
    ({ clone } = require("lodash"));
    ({ toJS } = require("mobx"));

    ({
        rotateRect,
        rotatePoint,
    } = require("@Components/selection/utils"));

    ({
        getCursorStyleWithRotateAngle,
        getCursorStyleForResizer,
        centerToTL,
        tLToCenter,
        getNewStyle,
        degToRadian,
        updatePosition,
        getLength,
        getAngle,
        transformImage,
        updateXGuide,
        updateYGuide,
        getGuideOfImage,
        hideGuide,
        handleFadeAnimation,
        ungroupGroupedItem,
        groupGroupedItem,
        handleItalicBtnClick,
        handleBoldBtnClick,
        handleCropBtnClick,
        handleGridCrop,
        handleTransparentAdjust,
        handleFontSizeBtnClick,
        handleChildCrop,
        handleAlignBtnClick,
        onTextChange,
        selectFont,
        doNoObjectSelected,
        handleScroll,
        handleWheel,
        copyImage,
        removeImage,
        saveImages,
        handleResizeStart,
        handleResizeInnerImageStart,
        handleDragStart,
        handleRotateStart,
    } = require("@Utils"));

    ({
        fromEvent,
        merge,
        NEVER,
        BehaviorSubject,
    } = require("rxjs"));

    ({
        map,
        filter,
        switchMap,
        takeUntil,
        first,
    } = require("rxjs/operators"));
}

const RESIZE_OFFSET = 3;

function getBoundingClientRect(id: string) {
    if (!document.getElementById(id)) {
        return null;
    }
    return document.getElementById(id).getBoundingClientRect();
}

declare global {
    interface Window {
        paymentScope: any;
        resizingInnerImage: any;
        startX: any;
        startY: any;
        startLeft: any;
        startTop: any;
        rect: any;
        rect2: any;
        image: any;
        rotateAngle: any;
        resizing: boolean;
        rotating: boolean;
        dragging: boolean;
        dragged: boolean;
        posX: any;
        posY: any;
        imgWidth: any;
        imgHeight: any;
        prevEffectId: any;
        scale: any;
        downloading: boolean;
        imageTop: number;
        imageLeft: number;
        imageWidth: number;
        imageHeight: number;
        imageimgWidth: number;
        imageimgHeight: number;
        lineHeight: number;
        letterSpacing: number;
        scaleX: number;
        scaleY: number;
        origin_width: number;
        origin_height: number;
        opacity: number;
        document_object: any;
        cloneImages: any;
        tempImage: any;
        template: any;
        rotated: boolean;
        resized: boolean;
        selections: any;
        selectionsAngle: any;
        selectionStart: boolean;
        rs: any;
        selectionIDs: any;
        imagedragging: boolean;
        imgDragging: any;
        oldWidth: any;
        oldHeight: any;
        oldTransform: any;
        imageselected: any;
        imagesrc: any;
        pauser: any;
        rectWidth: number;
        rectHeight: number;
        grids: any;
        cancelDownload: any;
        step: any;
        videoDuration: any;
        inputFocus: any;
        current_progress: any;
        progress_interval: any;
    }
}

interface IProps {
    rid: string;
    mode: string;
    match: any;
    images: any;
    firstpage: any;
    addItem: any;
    update: any;
    replaceFirstItem: any;
    addFontItem: any;
    fonts: any;
    addFont: any;
    upperZIndex: number;
    increaseUpperzIndex: any;
    store: any;
    t: any;
    i18n: any;
    tReady: boolean;
    selectedImage: any;
}

interface IState {
    italic: boolean;
    bold: boolean;
    align: any;
    idObjectSelected: string;
    scale: number;
    fitScale: number;
    selectedTab: SidebarTab;
    rectWidth: number;
    rectHeight: number;
    toolbarOpened: boolean;
    toolbarSize: number;
    scrollX: number;
    scrollY: number;
    _id: string;
    rotating: boolean;
    templateType: string;
    mode: number;
    staticGuides: any;
    deltaX: number;
    deltaY: number;
    editing: boolean;
    canRenderClientSide: boolean;
    fontSize: number;
    currentOpacity: number;
    currentLineHeight: number;
    currentLetterSpacing: number;
    fontColor: string;
    showPopup: boolean;
    showMediaEditingPopup: boolean;
    fontName: string;
    fontId: string;
    childId: string;
    effectId: number;
    cropMode: boolean;
    editingMedia: any;
    editingFont: any;
    showMediaEditPopup: boolean;
    showTemplateEditPopup: boolean;
    showFontEditPopup: boolean;
    typeObjectSelected: TemplateType;
    bleed: boolean;
    showPrintingSidebar: boolean;
    currentPrintStep: number;
    orderStatus: string;
    downloading: boolean;
    imgBackgroundColor: string;
    showImageRemovalBackgroundPopup: boolean;
    imageIdBackgroundRemoved: string;
    mounted: boolean;
    showZoomPopup: boolean;
    selectedImage: any;
    selectedCanvas: string;
    saved: boolean;
    designId: string;
    designTitle: string;
    showPopupPreview: boolean;
}

const NAMESPACE = "editor";

class CanvaEditor extends Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            designTitle: "",
            currentLineHeight: 0,
            currentLetterSpacing: 0,
            designId: "",
            italic: false,
            bold: false,
            effectId: 0,
            align: "",
            selectedImage: null,
            showFontEditPopup: false,
            currentPrintStep: 1,
            bleed: false,
            showMediaEditPopup: false,
            childId: null,
            fontName: "",
            fontId: "",
            showPopup: false,
            showMediaEditingPopup: false,
            fontColor: "black",
            fontSize: 0,
            templateType: null,
            _id: null,
            idObjectSelected: null,
            typeObjectSelected: null,
            scale: 1,
            fitScale: 1,
            selectedTab: null,
            rectWidth: this.props.match.params.width
                ? parseInt(this.props.match.params.width)
                : 0,
            rectHeight: this.props.match.params.height
                ? parseInt(this.props.match.params.height)
                : 0,
            toolbarOpened: true,
            toolbarSize: 450,
            scrollX: 16.67,
            scrollY: 16.67,
            rotating: false,
            mode: parseInt(this.props.match.params.mode) || Mode.CreateDesign,
            staticGuides: {
                x: [],
                y: []
            },
            deltaX: 0,
            deltaY: 0,
            editing: false,
            canRenderClientSide: false,
            cropMode: false,
            editingMedia: null,
            editingFont: null,
            showTemplateEditPopup: false,
            showPrintingSidebar: false,
            orderStatus: "",
            downloading: false,
            imgBackgroundColor: "white",
            showImageRemovalBackgroundPopup: false,
            imageIdBackgroundRemoved: null,
            mounted: false,
            showZoomPopup: false,
            currentOpacity: 100,
            selectedCanvas: "",
            saved: true,
            showPopupPreview: false,
        };

        this.handleFlipBtnClick = this.handleFlipBtnClick.bind(this);
        this.handleImageBackgroundColorBtnClick = this.handleImageBackgroundColorBtnClick.bind(this);
        this.handleOkBtnClick = this.handleOkBtnClick.bind(this);
        this.forwardSelectedObject = this.forwardSelectedObject.bind(this);
        this.backwardSelectedObject = this.backwardSelectedObject.bind(this);
        this.cancelSaving = this.cancelSaving.bind(this);
        this.toggleVideo = this.toggleVideo.bind(this);
        this.updateImages = this.updateImages.bind(this);
        this.forceEditorUpdate = this.forceEditorUpdate.bind(this);
        this.removeImage2 = this.removeImage2.bind(this);
        this.setScale = this.setScale.bind(this);
    }

    $app = null;
    timer = null;
    $container = null;

    translate = (key: string) => {
        const { t, i18n } = this.props;

        if (i18n.exists && i18n.exists(NAMESPACE + ":" + key)) return t(key);

        if (
            editorTranslation !== undefined &&
            editorTranslation.hasOwnProperty(key)
        ) {
            return editorTranslation[key]; // load default translation in case failed to load translation file from server
        }

        return key;
    };

    playVideos = () => {
        this.setState({ showPopupPreview: true });
        this.forceUpdate();
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('shouldComponentUpdate')
        if (this.state.scale != nextState.scale) {
            return true;
        }
        if (!this.props.tReady && nextProps.tReady) {
            editorStore.tReady = true;
        }
        if (this.props.tReady != nextProps.tReady) {
            return true;
        }
        return false;
    }

    getImageSelected() {
        return toJS(editorStore.images2.get(editorStore.idObjectSelected));
    }

    handleFlipBtnClick = (e: any) => {
        e.preventDefault();
        this.setState({ cropMode: true });
    }

    handleImageBackgroundColorBtnClick = (e: any) => {
        e.preventDefault();
        editorStore.selectedTab = SidebarTab.Color;
    }

    canvas = null;

    /**
     * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
     * 
     * @param {String} text The text to be rendered.
     * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
     * 
     * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
     */
    getTextWidth = (text, font) => {
        // re-use canvas object for better performance
        let canvas = this.canvas || (this.canvas = document.createElement("canvas"));
        let context = canvas.getContext("2d");
        context.font = font;
        let metrics = context.measureText(text);
        return metrics.width;
    }

    handleOkBtnClick = (e: any) => {
        this.disableCropMode();
    }

    rerenderAllPages() {
        let pageKeys = editorStore.keys.map(key => key + 1);
        editorStore.keys.replace(pageKeys);
    }

    handleCancelBtnClick = (e: any) => {
        this.rerenderAllPages();
        e.preventDefault();

        editorStore.imageSelected = window.tempImage;
        editorStore.images2.set(window.tempImage._id, window.tempImage);

        this.disableCropMode();
    }

    handleOpacityChange = opacity => {
        let image = this.getImageSelected();
        if (image.type == TemplateType.Video) {
            let el = document.getElementById(editorStore.idObjectSelected + "video0alo");
            if (el) {
                el.style.opacity = (opacity / 100).toString();
            }
        } else {

            let el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
            if (el) {
                el.style.opacity = (opacity / 100).toString();
            }
        }

        window.opacity = opacity;
    };

    handleOpacityChangeEnd = () => {
        let opacity = window.opacity;
        let image = this.getImageSelected();
        image.opacity = opacity;
        editorStore.images2.set(editorStore.idObjectSelected, image);

        this.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
    }

    pauser = null;

    forceEditorUpdate = () => {
        this.forceUpdate();
    }

    async setRef() {
        let screenContainerParent = document.getElementById("screen-container-parent");
        // if (!screenContainerParent) return;
        // window.addEventListener('beforeunload', this.handleLeavePage.bind(this));
        // Creating a pauser subject to subscribe to
        let screenContainerParentRect = screenContainerParent.getBoundingClientRect();
        let doNoObjectSelected$ = fromEvent(screenContainerParent, "mouseup");

        window.pauser = new BehaviorSubject(false);
        window.pauser = window.pauser;

        const pausable = window.pauser.pipe(
            switchMap(paused => {
                return paused ? NEVER : doNoObjectSelected$;
            })
        );
        window.pauser.next(false);

        pausable.subscribe(e => {
            if ((e.target.id == "screen-container-parent" || e.target.id == "screen-container")
                && editorStore.idObjectSelected) {
                doNoObjectSelected.bind(this)();
            }
        });

        let ce = document.createElement.bind(document);
        let ca = document.createAttribute.bind(document);
        let ge = document.getElementsByTagName.bind(document);

        this.setState({
            canRenderClientSide: true,
            selectedTab: SidebarTab.Template
        });
        let self = this;
        setTimeout(() => {
            self.setState({ mounted: true });
        }, 1000);

        const { width, height } = screenContainerParentRect;
        let scaleX = (width - 100) / this.state.rectWidth;
        let scaleY = (height - 100) / this.state.rectHeight;

        let staticGuides = {
            x: [
                [0, uuidv4()],
                [this.state.rectWidth / 2, uuidv4()],
                [this.state.rectWidth, uuidv4()]
            ],
            y: [
                [0, uuidv4()],
                [this.state.rectHeight / 2, uuidv4()],
                [this.state.rectHeight, uuidv4()]
            ]
        };


        let fitScale =
            Math.min(scaleX, scaleY) === Infinity ? 1 : Math.min(scaleX, scaleY);

        editorStore.fontsList.forEach(id => {
            let style = `@font-face {
        font-family: '${id}';
        src: url('/fonts/${id}.ttf');
      }`;
            let styleEle = ce("style");
            let type = ca("type");
            type.value = "text/css";
            styleEle.attributes.setNamedItem(type);
            styleEle.innerHTML = style;
            let head = document.head || ge("head")[0];
            head.appendChild(styleEle);

            let link = ce("link");
            link.id = id;
            link.rel = "preload";
            link.href = `/fonts/${id}.ttf`;
            link.media = "all";
            link.as = "font";
            link.crossOrigin = "anonymous";
            head.appendChild(link);
            return {
                id: id
            };
        });

        editorStore.fontsList.forEach(id => {
            let style = `@font-face {
      font-family: '${id}';
      src: url('/fonts/${id}.ttf');
    }`;
            let styleEle = ce("style");
            let type = ca("type");
            type.value = "text/css";
            styleEle.attributes.setNamedItem(type);
            styleEle.innerHTML = style;
            let head = document.head || ge("head")[0];
            head.appendChild(styleEle);

            let link = ce("link");
            link.id = id;
            link.rel = "preload";
            link.href = `/fonts/${id}.ttf`;
            link.media = "all";
            link.as = "font";
            link.crossOrigin = "anonymous";
            head.appendChild(link);
            return {
                id: id
            };
        });

        editorStore.scale = fitScale;
        this.setState({
            staticGuides,
            scale: fitScale,
            fitScale
        });
        let template_id = this.props.match.params.template_id;
        let design_id = this.props.match.params.design_id;

        if (template_id) {
            let url;
            if (this.props.match.path == "/editor/template/:template_id" ||
                this.props.match.path == "/editor/admin/template/:template_id"
            ) {
                url = `/api/Template/Get?id=${template_id}`;
                editorStore.isAdmin = true;
            } else if (this.props.match.path == "/editor/design/:template_id") {
                url = `/api/Design/Get?id=${template_id}`;
            } else if (this.props.match.path == "/editor/design/:design_id/:template_id") {
                url = `/api/Design/GetDesignIfNotTemplate?design_id=${design_id}&template_id=${template_id}`;
            }

            await axios
                .get(url)
                .then(res => {
                    window.template = res.data.value;
                    if (res.data.errors.length > 0) {
                        throw new Error(res.data.errors.join("\n"));
                    }
                    let image = res.data;
                    let templateType = image.value.type;
                    let mode;
                    if (this.props.match.path == "/editor/design/:template_id") {
                        mode = Mode.EditDesign;

                        self.setState({ designId: uuidv4() });

                        if (templateType == TemplateType.TextTemplate) {
                            mode = Mode.EditTextTemplate;
                        }
                    } else if (this.props.match.path == "/editor/design/:design_id/:template_id") {
                        mode = Mode.CreateDesign;

                        self.setState({ designId: this.props.match.params.design_id });
                    } else if (templateType == TemplateType.Template) {
                        mode = Mode.EditTemplate;
                    } else if (templateType == TemplateType.TextTemplate) {
                        mode = Mode.EditTextTemplate;
                    }

                    editorStore.isVideo = image.value.isVideo;
                    editorStore.popularity = image.value.popularity;
                    editorStore.isPopular = image.value.popular;
                    editorStore.animationId = image.value.animationId;

                    let document = JSON.parse(image.value.document);
                    scaleX = (width - 100) / document.width;
                    scaleY = (height - 100) / document.height;
                    let staticGuides = {
                        x: [
                            [0, 0],
                            [document.width / 2, 0],
                            [document.width, 0]
                        ],
                        y: [
                            [0, 0],
                            [document.height / 2, 0],
                            [document.height, 0]
                        ]
                    };
                    if (image.value.fontList) {
                        image.value.fontList.forEach(id => {
                            let style = `@font-face {
                                font-family: '${id}';
                                src: url('/fonts/${id}.ttf');
                            }`;
                            let styleEle = ce("style");
                            let type = ca("type");
                            type.value = "text/css";
                            styleEle.attributes.setNamedItem(type);
                            styleEle.innerHTML = style;
                            let head = document.head || ge("head")[0];
                            head.appendChild(styleEle);

                            let link = ce("link");
                            link.id = id;
                            link.rel = "preload";
                            link.href = `/fonts/${id}.ttf`;
                            link.media = "all";
                            link.as = "font";
                            link.crossOrigin = "anonymous";
                            head.appendChild(link);
                            return {
                                id: id
                            };
                        });
                    }

                    let images = document.document_object;
                    images.forEach((image, key) => {
                        if (isNaN(image.zIndex)) image.zIndex = key;
                        editorStore.images2.set(image._id, image);
                    })

                    editorStore.fonts.replace(image.value.fontList);
                    editorStore.subtype = res.data.value.printType;
                    let scale = Math.min(scaleX, scaleY) === Infinity ? 1 : Math.min(scaleX, scaleY);
                    editorStore.scale = scale;
                    self.setState({
                        scale,
                        fitScale: scale,
                        staticGuides,
                        _id: template_id,
                        rectWidth: document.width,
                        rectHeight: document.height,
                        templateType,
                        mode,
                        designTitle: image.value.title,
                    });

                    window.rectWidth = document.width;
                    window.rectHeight = document.height;

                    editorStore.templateRatio = document.width / document.height;

                    let zIndexMax = 0;
                    images.forEach(img => {
                        zIndexMax = Math.max(zIndexMax, img.zIndex);
                    });

                    editorStore.upperZIndex = zIndexMax + 1;
                    editorStore.activePageId = res.data.value.pages[0];
                    editorStore.pages.replace(res.data.value.pages);
                    editorStore.keys.replace(Array(res.data.value.pages.length).fill(0));

                    self.forceUpdate();
                })
                .catch(e => { });
        } else {
            self.setState({
                _id: uuidv4()
            });
        }

        if (this.props.match.path == "/editor/admin/:subtype/:mode") {
            editorStore.isAdmin = true;
        }

        if (this.props.match.params.subtype) {
            editorStore.subtype = parseInt(this.props.match.params.subtype);
            let rectWidth;
            let rectHeight;

            switch (editorStore.subtype) {
                case 0:
                    rectWidth = 642;
                    rectHeight = 378;
                    break;
                case 1:
                    rectWidth = 1587.402;
                    rectHeight = 2245.04;
                    break;
                case 2:
                    rectWidth = 2245.04;
                    rectHeight = 1587.402;
                    break;
                case 3:
                    rectWidth = 3174.8;
                    rectHeight = 4490.08;
                    break;
                case 4:
                    rectWidth = 500;
                    rectHeight = 500;
                    break;
                case 5:
                    rectWidth = 794;
                    rectHeight = 1134;
                    break;
                case 6:
                    rectWidth = 1024;
                    rectHeight = 1024;
                    break;
                case 7:
                    rectWidth = 1920;
                    rectHeight = 1080;
                    break;
                case 8:
                    rectWidth = 940;
                    rectHeight = 788;
                    break;
                case 9:
                    rectWidth = 1080;
                    rectHeight = 1080;
                    break;
                case 10:
                    rectWidth = 2480;
                    rectHeight = 3508;
                    break;
                case 11: // Menu
                    rectWidth = 794;
                    rectHeight = 1123;
                    break;
                case 12: // Instagram Story
                    rectHeight = 1920;
                    rectWidth = 1080;
                    break;
                case 13: // Instagram Story
                    rectHeight = 320;
                    rectWidth = 320;
                    break;
                case 14: // Instagram Post
                    rectWidth = 1080;
                    rectHeight = 1080;
                    break;
                case 15: // Business Card
                    rectWidth = 1050;
                    rectHeight = 600;
                    break;
                case 16: // Facebook Cover
                    rectWidth = 851;
                    rectHeight = 315;
                    break;
                case 17: // Facebook Post
                    rectWidth = 940;
                    rectHeight = 788;
                    break;
                case 18: // Facebook ad
                    rectWidth = 1200;
                    rectHeight = 628;
                    break;
                case 19: // Resume
                    rectWidth = 794;
                    rectHeight = 1123;
                    break;
            }

            scaleX = (width - 100) / rectWidth;
            scaleY = (height - 100) / rectHeight;
            let fitScale = Math.min(scaleX, scaleY) === Infinity ? 1 : Math.min(scaleX, scaleY)

            staticGuides = {
                x: [
                    [0, uuidv4()],
                    [rectWidth / 2, uuidv4()],
                    [rectWidth, uuidv4()]
                ],
                y: [
                    [0, uuidv4()],
                    [rectHeight / 2, uuidv4()],
                    [rectHeight, uuidv4()]
                ]
            };

            editorStore.addItem2(
                {
                    _id: uuidv4(),
                    type: TemplateType.BackgroundImage,
                    width: rectWidth,
                    height: rectHeight,
                    origin_width: rectWidth,
                    origin_height: rectWidth,
                    left: 0,
                    top: 0,
                    rotateAngle: 0.0,
                    selected: false,
                    scaleX: 1,
                    scaleY: 1,
                    posX: 0,
                    posY: 0,
                    imgWidth: rectWidth,
                    imgHeight: rectWidth,
                    page: editorStore.activePageId,
                    zIndex: 1,
                    width2: 1,
                    height2: 1,
                    document_object: [],
                    ref: null,
                    innerHTML: null,
                    color: null,
                    opacity: 100,
                    backgroundColor: null,
                    childId: null
                }, false
            );

            window.rectWidth = rectWidth;
            window.rectHeight = rectHeight;
            editorStore.scale = fitScale;

            self.setState({
                staticGuides,
                rectWidth,
                rectHeight,
                scale: fitScale,
                fitScale,
            });

            editorStore.templateRatio = rectWidth / rectHeight;
        }

        document.addEventListener("keydown", removeImage.bind(this));
        this.$app.addEventListener("scroll", handleScroll.bind(this), { passive: true });
        document.addEventListener("wheel", handleWheel.bind(this), { passive: false });

    }

    async componentDidMount() {
        this.setState({ mounted: true });

        this.setRef();

        let self = this;

        let Selection = require("@Components/selection/selection").default;
        const selection = new Selection({

            // Class for the selection-area-element
            class: 'selection-area',

            // document object - if you want to use it within an embed document (or iframe)
            frame: document,

            // px, how many pixels the point should move before starting the selection (combined distance).
            // Or specifiy the threshold for each axis by passing an object like {x: <number>, y: <number>}.
            startThreshold: 10,

            // Disable the selection functionality for touch devices
            disableTouch: false,

            // On which point an element should be selected.
            // Available modes are cover (cover the entire element), center (touch the center) or
            // the default mode is touch (just touching it).
            mode: 'touch',

            // Behaviour on single-click
            // Available modes are 'native' (element was mouse-event target) or 
            // 'touch' (element got touched)
            tapMode: 'native',

            // Enable single-click selection (Also disables range-selection via shift + ctrl)
            singleClick: true,

            // Query selectors from elements which can be selected
            selectables: ['.hideWhenDownload'],

            // Query selectors for elements from where a selection can be start
            startareas: ['html'],

            // Query selectors for elements which will be used as boundaries for the selection
            boundaries: ['#screen-container-parent'],

            // Query selector or dom node to set up container for selection-area-element
            selectionAreaContainer: 'body',

            // On scrollable areas the number on px per frame is devided by this amount.
            // Default is 10 to provide a enjoyable scroll experience.
            scrollSpeedDivider: 10,

            // Browsers handle mouse-wheel events differently, this number will be used as 
            // numerator to calculate the mount of px while scrolling manually: manualScrollSpeed / scrollSpeedDivider
            manualScrollSpeed: 750
        });

        selection.on('beforestart', evt => {
            // evt.preventDefault();
            // Use this event to decide whether a selection should take place or not.
            // For example if the user should be able to normally interact with input-elements you 
            // may want to prevent a selection if the user clicks such a element:
            // selection.on('beforestart', ({oe}) => {
            //   return oe.target.tagName !== 'INPUT'; // Returning false prevents a selection
            // });
            window.selectionStart = false;
            if (evt.oe.target.id != "screen-container-parent" && !evt.oe.target.classList.contains('selectable')) {
                return false;
            }

            if (window.selections) {
                if (editorStore.idObjectSelected) doNoObjectSelected.bind(self)();
                window.selections.forEach(el => {
                    el.style.opacity = 0;
                });
            }

            return true;
        }).on('start', evt => {
            // evt.preventDefault();
            // A selection got initiated, you could now clear the previous selection or
            // keep it if in case of multi-selection.
            window.selectionStart = true;
        }).on('move', evt => {
            // evt.preventDefault();
            // Here you can update elements based on their state.

            // let index = editorStore.pages.findIndex(pageId => pageId == editorStore.activePageId);
            // editorStore.keys[index] = editorStore.keys[index] + 1;
        }).on('stop', evt => {
            // evt.preventDefault();
            // The last event can be used to call functions like keepSelection() in case the user wants
            // to select multiple elements.
            evt.oe.stopImmediatePropagation();
            evt.oe.preventDefault();
            window.selections = evt.selected;
            window.selectionIDs = {};
            setTimeout(() => {
                window.selectionStart = false;
            }, 300);

            if (evt.selected.length == 1) {
                let node = evt.selected[0];
                let id = node.attributes.iden.value;
                node.classList.toggle("selected");
                if (id) {
                    let item = editorStore.images2.get(id);
                    self.handleImageSelected(item._id, item.page, true, true, true);
                }
            } else {
                let top = 999999, right = 0, bottom = 0, left = 999999;
                let childIds = [];
                evt.selected.forEach(node => {
                    let id = node.attributes.iden.value;
                    if (!id) return;
                    childIds.push(id);

                    window.selectionIDs[id] = true;

                    node.style.opacity = 1;
                    node.classList.toggle('selected');

                    let b = window.rs[id];

                    let w = b.right - b.left - 4;
                    let h = b.bottom - b.top - 4;
                    let centerX = b.left + w / 2 + 2;
                    let centerY = b.top + h / 2 + 2;
                    let rotateAngle = node.attributes.angle.value / 180 * Math.PI;
                    let newL = centerX - node.attributes.width.value / 2;
                    let newR = centerX + node.attributes.width.value / 2;
                    let newT = centerY - node.attributes.height.value / 2;
                    let newB = centerY + node.attributes.height.value / 2;

                    let bb = [
                        {
                            x: (newL - centerX) * Math.cos(rotateAngle) - (newT - centerY) * Math.sin(rotateAngle) + centerX,
                            y: (newL - centerX) * Math.sin(rotateAngle) + (newT - centerY) * Math.cos(rotateAngle) + centerY,
                        },
                        {
                            x: (newR - centerX) * Math.cos(rotateAngle) - (newT - centerY) * Math.sin(rotateAngle) + centerX,
                            y: (newR - centerX) * Math.sin(rotateAngle) + (newT - centerY) * Math.cos(rotateAngle) + centerY,
                        },
                        {
                            x: (newR - centerX) * Math.cos(rotateAngle) - (newB - centerY) * Math.sin(rotateAngle) + centerX,
                            y: (newR - centerX) * Math.sin(rotateAngle) + (newB - centerY) * Math.cos(rotateAngle) + centerY,
                        },
                        {
                            x: (newL - centerX) * Math.cos(rotateAngle) - (newB - centerY) * Math.sin(rotateAngle) + centerX,
                            y: (newL - centerX) * Math.sin(rotateAngle) + (newB - centerY) * Math.cos(rotateAngle) + centerY,
                        }
                    ]

                    left = Math.min(left, bb[0].x);
                    left = Math.min(left, bb[1].x);
                    left = Math.min(left, bb[2].x);
                    left = Math.min(left, bb[3].x);
                    right = Math.max(right, bb[0].x)
                    right = Math.max(right, bb[1].x)
                    right = Math.max(right, bb[2].x)
                    right = Math.max(right, bb[3].x)
                    top = Math.min(top, bb[0].y)
                    top = Math.min(top, bb[1].y)
                    top = Math.min(top, bb[2].y)
                    top = Math.min(top, bb[3].y)
                    bottom = Math.max(bottom, bb[0].y)
                    bottom = Math.max(bottom, bb[1].y)
                    bottom = Math.max(bottom, bb[2].y)
                    bottom = Math.max(bottom, bb[3].y)
                });

                let index = editorStore.pages.findIndex(pageId => pageId == editorStore.activePageId);

                let rect = document.getElementsByClassName("alo")[index].getBoundingClientRect();
                let newTop = top - rect.top;
                let newLeft = left - rect.left;
                let width = right - left;
                let height = bottom - top;
                let scale = self.state.scale;

                let item = {
                    _id: uuidv4(),
                    childIds,
                    type: TemplateType.GroupedItem,
                    src: "",
                    width: width / scale,
                    height: height / scale,
                    origin_width: width / scale,
                    origin_height: height / scale,
                    left: newLeft / scale,
                    top: newTop / scale,
                    rotateAngle: 0.0,
                    scaleX: 1,
                    scaleY: 1,
                    posX: 0,
                    posY: 0,
                    imgWidth: width / scale,
                    imgHeight: height / scale,
                    page: editorStore.activePageId,
                    zIndex: 99999,
                    width2: 1,
                    height2: 1,
                    document_object: [],
                    ref: null,
                    innerHTML: null,
                    color: 'transparent',
                    opacity: 100,
                    backgroundColor: 'transparent',
                    childId: null,
                    selected: true,
                    hovered: true,
                    temporary: true,
                };
                let index2 = editorStore.pages.findIndex(pageId => pageId == editorStore.activePageId);
                editorStore.keys[index2] = editorStore.keys[index2] + 1;
                editorStore.addItem2(item, false);
                self.handleImageSelected(item._id, item.page, false, true, false);
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.scale !== prevState.scale) {
            handleScroll();
        }
    }

    handleEditmedia = item => {
        this.setState({ showMediaEditPopup: true, editingMedia: item });
        this.forceUpdate();
    };

    handleEditFont = item => {
        this.setState({ showFontEditPopup: true, editingFont: item });
        this.forceUpdate();
    };


    switching = false;

    canvasRect = null;
    temp = null;

    updateImages2(image, includeDownloadCanvas) {
        this.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, includeDownloadCanvas);
    }

    updateImages(id, pageId, image, includeDownloadCanvas) {
        try {
            this.canvas1[pageId].canvas[CanvasType.All][id].child.updateImage(image);
            this.canvas1[pageId].canvas[CanvasType.HoverLayer][id].child.updateImage(image);
            if (includeDownloadCanvas) this.canvas2[pageId].canvas[CanvasType.Download][id].child.updateImage(image);
        } catch (e) {
            console.log('Failed to updateImages. Exception: ', e);
        }
    }

    saving = null;
    setAppRef = ref => (this.$app = ref);
    setContainerRef = ref => (this.$container = ref);

    elementIsVisible = (element, container, partial) => {
        let contHeight = container.offsetHeight,
            elemTop = this.offset(element).top - this.offset(container).top,
            elemBottom = elemTop + element.offsetHeight;
        return (
            (elemTop >= 0 && elemBottom <= contHeight) ||
            (partial &&
                ((elemTop < 0 && elemBottom > 0) ||
                    (elemTop > 0 && elemTop <= contHeight)))
        );
    };

    isWindow = obj => {
        return obj != null && obj === obj.window;
    };

    getWindow = elem => {
        return this.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
    };

    offset = elem => {
        let docElem,
            win,
            box = { top: 0, left: 0 },
            doc = elem && elem.ownerDocument;

        docElem = doc.documentElement;

        if (typeof elem.getBoundingClientRect !== typeof undefined) {
            box = elem.getBoundingClientRect();
        }
        win = this.getWindow(doc);
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
        };
    };

    removeImage2() {
        editorStore.images2.delete(editorStore.idObjectSelected);
        doNoObjectSelected.bind(this)();
        let index = editorStore.pages.findIndex(pageId => pageId == editorStore.pageId);
        editorStore.keys[index] = editorStore.keys[index] + 1;

        this.forceUpdate();
    }

    handleImageHover = (img, event, value) => {
        if (window.selectionStart) {
            return;
        }
        if (img.type != TemplateType.BackgroundImage) {
            img.hovered = value;
            editorStore.images2.set(img._id, img);


            let index = editorStore.pages.findIndex(pageId => pageId == editorStore.activePageId);
            editorStore.keys[index] = editorStore.keys[index] + 1;
        }
    };

    handleImageHovered = (id, pageId) => {
        if (this.state.cropMode) return false;
        this.canvas1[pageId].canvas[CanvasType.HoverLayer][id].child.handleImageHovered();
        return true;
    }

    handleImageUnhovered = (id, pageId) => {
        this.canvas1[pageId].canvas[CanvasType.HoverLayer][id].child.handleImageUnhovered();
    }

    handleImageSelected = (id, pageId, updateCanvas, forceUpdate, updateImage) => {
        if (editorStore.cropMode) {
            this.disableCropMode();
        }
        let oldImage = editorStore.getImageSelected();
        let tab = editorStore.selectedTab;

        if (editorStore.idObjectSelected) {
            try {
                this.canvas1[editorStore.pageId].canvas[CanvasType.All][editorStore.idObjectSelected].child.handleImageUnselected();
                this.canvas1[editorStore.pageId].canvas[CanvasType.HoverLayer][editorStore.idObjectSelected].child.handleImageUnselected();
            } catch (e) {

            }
            doNoObjectSelected.bind(this)();
        }

        let image = editorStore.images2.get(id);
        image.selected = true;
        image.hovered = true;
        editorStore.images2.set(id, image);
        editorStore.idObjectSelected = id;
        editorStore.pageId = pageId;
        editorStore.effectId = image.effectId;
        editorStore.currentOpacity = image.opacity ? image.opacity : 100;
        editorStore.colors = image.colors;
        editorStore.colorField = null;
        if (!editorStore.childId) {
            editorStore.currentFontSize = image.fontSize * image.scaleY;
            editorStore.fontId = image.fontId;
            editorStore.fontFace = image.fontId;
            editorStore.fontText = image.fontText;
            editorStore.currentLetterSpacing = image.letterSpacing;
            editorStore.currentLineHeight = image.lineHeight;
        }

        if (oldImage && oldImage.type != image.type) {
            if (image.type == TemplateType.Heading && (tab == SidebarTab.Color || tab == SidebarTab.Effect)) {
                tab = SidebarTab.Image;
            }
        }

        editorStore.selectedTab = tab;

        if (updateCanvas) {
            try {
                this.canvas1[pageId].canvas[updateCanvas][id].child.handleImageSelected();
            } catch (e) {
                console.log('Failed to update canvas. Exception: ', e);
            }
        }

        if (updateImage) {
            this.updateImages(id, pageId, image, false);
        }

        if (forceUpdate) {
            let index = editorStore.pages.findIndex(id => id == pageId);
            editorStore.keys[index] = editorStore.keys[index] + 1;
            this.forceUpdate();
        }
    };

    removeTemplate = e => {
        let url = `/api/Template/Delete?id=${this.state._id}`;
        fetch(url, {
            method: "DELETE"
        });
    };

    toggleVideo() {
        this.canvas1[editorStore.pageId].canvas[CanvasType.All][editorStore.idObjectSelected].child.toggleVideo();
        this.canvas1[editorStore.pageId].canvas[CanvasType.HoverLayer][editorStore.idObjectSelected].child.toggleVideo();

        let el = document.getElementById(editorStore.idObjectSelected + "video0" + "alo") as HTMLVideoElement;
        let el2 = document.getElementById(editorStore.idObjectSelected + "video2" + "alo") as HTMLVideoElement;
        let image = this.getImageSelected();
        if (image.paused) {
            if (el) el.play();
            if (el2) el2.play();
            image.paused = false;
        } else {
            if (el) el.pause();
            if (el2) el2.pause();
            image.paused = true;
        }

        editorStore.images2.set(image._id, image);
    }

    handleRemoveBackground = (mediaId, e) => {
        this.setState({
            showImageRemovalBackgroundPopup: true,
            imageIdBackgroundRemoved: mediaId,
            showMediaEditPopup: false,
            showPopup: false
        });
    };

    imgDragging = null;

    onClickDropDownFontList = e => {
        e.preventDefault();
        this.setState({ selectedTab: SidebarTab.Font, toolbarOpened: true });
    };

    onClickEffectList = e => {
        e.preventDefault();
        this.setState({ selectedTab: SidebarTab.Effect, toolbarOpened: true });
    }

    getPlatformName = () => {
        let OSName = "Unknown";
        if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1)
            OSName = "Windows";
        if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1)
            OSName = "Windows";
        if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1)
            OSName = "Windows";
        if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1)
            OSName = "Windows";
        if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1)
            OSName = "Windows";
        if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1)
            OSName = "Windows";
        if (window.navigator.userAgent.indexOf("Mac") != -1) OSName = "Mac/iOS";
        if (window.navigator.userAgent.indexOf("X11") != -1) OSName = "UNIX";
        if (window.navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux";

        return OSName;
    };

    allowScroll = true;

    handleToolbarResize = e => {
        e.preventDefault();
        let self = this;
        let minimumToolbarSize = 332;
        const onMove = e => {
            e.preventDefault();
            let toolbarSize = e.pageX;
            if (e.pageX >= minimumToolbarSize) {
                self.setState({ toolbarSize });
            }
        };

        const onUp = e => {
            e.preventDefault();
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    };

    handleSidebarSelectorClicked = (selectedTab: SidebarTab, e: any) => {
        e.preventDefault();
        this.setState({
            toolbarOpened: true,
            selectedTab: selectedTab
        });
    };

    normalize2(
        image: any,
        images: any,
        scaleX: number,
        scaleY: number,
        scale: number,
        width: number,
        height: number
    ): any {

        let result = [];
        let norm = (image, parent) => {
            let res = { ...image };
            if (parent != null) {
                let img = images.filter(img => img._id === image._id)[0];
                res.top = parent.top + img.margin_top + parent.height;
            }

            result.push(res);
            if (res.childId) {
                let child = images.filter(img => img._id === res.childId)[0];

                if (child) {
                    norm(child, res);
                }
            }
        };

        norm(image, null);

        return result;
    }

    normalize(image: any, images: any): any {
        let result = [];
        let norm = (image, parent) => {
            let res = { ...image };
            if (parent != null) {
                let rec = getBoundingClientRect(parent._id + "hihi4alo");
                let rec3 = getBoundingClientRect(image._id + "hihi4alo");
                res.margin_top = (rec3.top - rec.bottom) / this.state.scale;
                res.margin_left = (rec3.left - rec.right) / this.state.scale;
            }
            result.push(res);
            if (res.childId) {
                let child = images.filter(img => img._id === res.childId)[0];
                norm(child, res);
            }
        };
        norm(image, null);

        return result;
    }

    handleGridSelected = childId => {
        let image = this.getImageSelected();
        if (image.grids[childId].src) editorStore.croppable = true;
        else editorStore.croppable = false;
        editorStore.gridIndex = childId;
        this.canvas1[editorStore.pageId].canvas[CanvasType.All][editorStore.idObjectSelected].child.handleGridSelected(childId);
        this.canvas1[editorStore.pageId].canvas[CanvasType.HoverLayer][editorStore.idObjectSelected].child.handleGridSelected(childId);
    }

    handleChildIdSelected = childId => {
        editorStore.childId = childId;
        this.canvas1[editorStore.pageId].canvas[CanvasType.All][editorStore.idObjectSelected].child.handleTextChildSelected(childId);
        this.canvas1[editorStore.pageId].canvas[CanvasType.HoverLayer][editorStore.idObjectSelected].child.handleTextChildSelected(childId);

        let align, effectId, bold, italic, fontId, fontColor, fontText;
        let currentOpacity, currentLineHeight, currentLetterSpacing;
        let fontSize;
        let image = editorStore.getImageSelected();
        image.selected = true;
        if (image.document_object) {
            image.document_object.forEach(doc => {
                if (doc._id == childId) {
                    doc.selected = true;
                    align = doc.align;
                    effectId = doc.effectId;
                    bold = doc.bold;
                    italic = doc.italic;
                    fontId = doc.fontId;
                    fontText = doc.fontText;
                    fontColor = doc.color;
                    currentLineHeight = doc.lineHeight;
                    currentOpacity = doc.opacity;
                    currentLetterSpacing = doc.letterSpacing;
                    fontSize = doc.fontSize * doc.scaleY * image.scaleY;
                }
                return doc;
            });
        }

        let fontsList = toJS(editorStore.fontsList);
        let font = fontsList.find(font => font.id === fontId);
        let text = image.document_object.find(text => text._id == childId);

        editorStore.fontId = fontId;
        editorStore.fontFace = fontId;
        editorStore.fontText = fontText;
        editorStore.currentFontSize = fontSize;
        editorStore.currentLetterSpacing = currentLetterSpacing;
        editorStore.childId = childId;
        editorStore.currentLineHeight = currentLineHeight;
        editorStore.effectId = effectId;
        editorStore.images2.set(editorStore.idObjectSelected, image);

        this.setState({
            fontColor,
            childId,
            align,
            effectId,
            bold,
            italic,
            fontId,
            currentOpacity,
            currentLineHeight,
            currentLetterSpacing,
            fontName: font ? font.representative : null,
            fontSize: Math.round(text.fontSize * image.scaleY * text.scaleY),
        });
    };

    handleFontSizeChange = fontSize => {
        this.setState({ fontSize });
    };

    handleFontColorChange = fontColor => {
        this.setState({ fontColor });
    };

    handleFontFamilyChange = fontId => {
        if (fontId) {
            let font = toJS(editorStore.fontsList).find(font => font.id === fontId);
            if (font) {
                this.setState({
                    fontName: font.representative,
                    fontId: fontId,
                });
            }
        }
    };

    enableCropMode = (id, page) => {
        this.setState({ cropMode: true });
        editorStore.cropMode = true;

        this.canvas1[page].canvas[CanvasType.All][id].child.enableCropMode();
        this.canvas1[page].canvas[CanvasType.HoverLayer][id].child.enableCropMode();
    };

    disableCropMode = () => {
        let scale = editorStore.scale;

        if (editorStore.idObjectSelected) {
            this.setState({ cropMode: false });
            editorStore.cropMode = false;
            this.canvas1[editorStore.pageId].canvas[CanvasType.All][editorStore.idObjectSelected].child.disableCropMode();
            this.canvas1[editorStore.pageId].canvas[CanvasType.HoverLayer][editorStore.idObjectSelected].child.disableCropMode();
            let index = editorStore.pages.findIndex(pageId => pageId == editorStore.pageId);
            editorStore.keys[index] = editorStore.keys[index] + 1;

            this.forceUpdate();
        }

        let image = this.getImageSelected();
        if (image.type == TemplateType.BackgroundImage && image.deleteAfterCrop) {
            let parentImage = editorStore.images2.get(image.parentImageId);
            parentImage.hovered = false;
            parentImage.selected = false;
            parentImage.grids = parentImage.grids.map((g, i) => {
                if (i == image.gridIndex) {
                    g.imgWidth = image.imgWidth;
                    g.imgHeight = image.imgHeight;
                    g.posX = image.posX;
                    g.posY = image.posY;
                }
                return g;
            });

            this.updateImages(parentImage._id, parentImage.page, parentImage, true);

            editorStore.images2.delete(editorStore.idObjectSelected);
            doNoObjectSelected.bind(this)();
            let index = editorStore.pages.findIndex(pageId => pageId == editorStore.pageId);
            editorStore.keys[index] = editorStore.keys[index] + 1;

            this.forceUpdate();
        }

        if ((image.type == TemplateType.Image ||
            image.type == TemplateType.Element ||
            image.type == TemplateType.Video || 
            image.type == TemplateType.Gradient ) && image.groupedIds) {
            let top = 999999, right = 0, bottom = 0, left = 999999;
            let childIds = [];
            image.groupedIds.forEach(id => {
                let img = editorStore.images2.get(id);
                childIds.push(id);
                let b = transformImage(img);

                let w = b.x[2] * scale - b.x[0] * scale - 4;
                let h = b.y[2] * scale - b.y[0] * scale - 4;
                let centerX = b.x[0] * scale + w / 2 + 2;
                let centerY = b.y[0] * scale + h / 2 + 2;
                let rotateAngle = img.rotateAngle / 180 * Math.PI;
                let newL = centerX - img.width * scale / 2;
                let newR = centerX + img.width * scale / 2;
                let newT = centerY - img.height * scale / 2;
                let newB = centerY + img.height * scale / 2;


                let bb = [
                    {
                        x: (newL - centerX) * Math.cos(rotateAngle) - (newT - centerY) * Math.sin(rotateAngle) + centerX,
                        y: (newL - centerX) * Math.sin(rotateAngle) + (newT - centerY) * Math.cos(rotateAngle) + centerY,
                    },
                    {
                        x: (newR - centerX) * Math.cos(rotateAngle) - (newT - centerY) * Math.sin(rotateAngle) + centerX,
                        y: (newR - centerX) * Math.sin(rotateAngle) + (newT - centerY) * Math.cos(rotateAngle) + centerY,
                    },
                    {
                        x: (newR - centerX) * Math.cos(rotateAngle) - (newB - centerY) * Math.sin(rotateAngle) + centerX,
                        y: (newR - centerX) * Math.sin(rotateAngle) + (newB - centerY) * Math.cos(rotateAngle) + centerY,
                    },
                    {
                        x: (newL - centerX) * Math.cos(rotateAngle) - (newB - centerY) * Math.sin(rotateAngle) + centerX,
                        y: (newL - centerX) * Math.sin(rotateAngle) + (newB - centerY) * Math.cos(rotateAngle) + centerY,
                    }
                ]

                left = Math.min(left, bb[0].x);
                left = Math.min(left, bb[1].x);
                left = Math.min(left, bb[2].x);
                left = Math.min(left, bb[3].x);
                right = Math.max(right, bb[0].x)
                right = Math.max(right, bb[1].x)
                right = Math.max(right, bb[2].x)
                right = Math.max(right, bb[3].x)
                top = Math.min(top, bb[0].y)
                top = Math.min(top, bb[1].y)
                top = Math.min(top, bb[2].y)
                top = Math.min(top, bb[3].y)
                bottom = Math.max(bottom, bb[0].y)
                bottom = Math.max(bottom, bb[1].y)
                bottom = Math.max(bottom, bb[2].y)
                bottom = Math.max(bottom, bb[3].y)
            });

            let index = editorStore.pages.findIndex(pageId => pageId == editorStore.activePageId);

            let newTop = top;
            let newLeft = left;
            let width = right - left;
            let height = bottom - top;

            let item = {
                _id: uuidv4(),
                childIds,
                type: TemplateType.GroupedItem,
                src: "",
                width: width / scale,
                height: height / scale,
                origin_width: width / scale,
                origin_height: height / scale,
                left: newLeft / scale,
                top: newTop / scale,
                rotateAngle: 0.0,
                scaleX: 1,
                scaleY: 1,
                posX: 0,
                posY: 0,
                imgWidth: width / scale,
                imgHeight: height / scale,
                page: editorStore.activePageId,
                zIndex: 99999,
                width2: 1,
                height2: 1,
                document_object: [],
                ref: null,
                innerHTML: null,
                color: 'transparent',
                opacity: 100,
                backgroundColor: 'transparent',
                childId: null,
                selected: true,
                hovered: true,
                temporary: true,
            };
            let index2 = editorStore.pages.findIndex(pageId => pageId == editorStore.activePageId);
            editorStore.keys[index2] = editorStore.keys[index2] + 1;
            editorStore.addItem2(item, false);
            this.handleImageSelected(item._id, item.page, false, true, false);

            if (groupGroupedItem) groupGroupedItem.bind(this)();
        }
    }

    toggleImageResizing = e => {
        // this.setState({ resizingInnerImage: !this.state.resizingInnerImage });
    };

    addAPage = (e, id) => {
        e.preventDefault();
        let pages = toJS(editorStore.pages);
        let keys = toJS(editorStore.keys);
        const index = pages.findIndex(img => img === id) + 1;
        let newPageId = uuidv4();
        pages.splice(index, 0, newPageId);
        keys.splice(index, 0, 0);

        const { rectWidth, rectHeight } = this.state;

        let item = {
            _id: uuidv4(),
            type: TemplateType.BackgroundImage,
            width: rectWidth,
            height: rectHeight,
            origin_width: rectWidth,
            origin_height: rectWidth,
            left: 0,
            top: 0,
            rotateAngle: 0.0,
            selected: false,
            scaleX: 1,
            scaleY: 1,
            posX: 0,
            posY: 0,
            imgWidth: rectWidth,
            imgHeight: rectWidth,
            page: newPageId,
            zIndex: 1,
            width2: 1,
            height2: 1,
            document_object: [],
            ref: null,
            innerHTML: null,
            color: null,
            opacity: 100,
            backgroundColor: null,
            childId: null
        };

        this.setSavingState(SavingState.UnsavedChanges, false);
        editorStore.addItem2(item, false);

        this.handleImageSelected(item._id, newPageId, false, true, false);

        editorStore.pages.replace(pages);
        editorStore.keys.replace(keys);
        setTimeout(() => {
            document.getElementById(newPageId).scrollIntoView();
        }, 100);

        this.forceUpdate();
    };

    forwardSelectedObject = id => {
        let image = this.getImageSelected();
        image.zIndex = editorStore.upperZIndex + 1;
        editorStore.images2.set(editorStore.idObjectSelected, image);
        this.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
        editorStore.increaseUpperzIndex();
    };

    backwardSelectedObject = id => {
        let image = this.getImageSelected();
        image.zIndex = 2;
        editorStore.images2.forEach((val, key) => {
            if (val.page == image.page) {
                if (key == editorStore.idObjectSelected) {
                    val.zIndex = 1;
                } else {
                    val.zIndex += 1;
                }
                val.selected = false;
                val.hovered = false;
                editorStore.images2.set(key, val);
                this.updateImages(key, editorStore.pageId, val, true);
            }
        });
        editorStore.upperZIndex += 1;
        editorStore.images2.set(editorStore.idObjectSelected, image);
        this.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);

    };

    renderCanvas(preview, index, downloading) {
        let res = [];
        let pages = toJS(editorStore.pages);
        let keys = toJS(editorStore.keys);
        for (let i = 0; i < pages.length; ++i) {
            if (index >= 0 && i != index) {
                continue;
            }

            let pageId = pages[i];
            let images = Array.from(editorStore.images2.values()).filter((img: any) => img.page === pages[i]).map(img => toJS(img));

            res.push(
                <Canvas
                    ref={ref => {
                        if (!downloading) {
                            this.canvas1[pageId] = ref;
                        } else {
                            this.canvas2[pageId] = ref;
                        }
                    }}
                    handleGridSelected={this.handleGridSelected}
                    handleCropBtnClick={handleCropBtnClick && handleCropBtnClick.bind(this)}
                    handleGridCrop={handleGridCrop && handleGridCrop.bind(this)}
                    handleChildCrop={handleChildCrop && handleChildCrop.bind(this)}
                    toggleVideo={this.toggleVideo}
                    uiKey={pages[i] + keys[i]}
                    selected={
                        editorStore.imageSelected &&
                        editorStore.imageSelected.page == pages[i] &&
                        editorStore.imageSelected.type == TemplateType.BackgroundImage}
                    id={pages[i]}
                    active={pages[i] == editorStore.activePageId}
                    translate={this.translate}
                    numberOfPages={pages.length}
                    downloading={downloading}
                    bleed={this.state.bleed}
                    key={i}
                    staticGuides={this.state.staticGuides}
                    index={i}
                    addAPage={this.addAPage}
                    images={images}
                    mode={this.state.mode}
                    rectWidth={this.state.rectWidth}
                    rectHeight={this.state.rectHeight}
                    scale={downloading ? 1 : this.state.scale}
                    childId={editorStore.childId}
                    cropMode={this.state.cropMode}
                    handleImageSelected={this.handleImageSelected}
                    handleImageHovered={this.handleImageHovered}
                    handleImageUnhovered={this.handleImageUnhovered}
                    handleImageHover={this.handleImageHover}
                    handleRotateStart={handleRotateStart && handleRotateStart.bind(this)}
                    handleResizeStart={handleResizeStart && handleResizeStart.bind(this)}
                    handleDragStart={handleDragStart && handleDragStart.bind(this)}
                    onTextChange={onTextChange && onTextChange.bind(this)}
                    handleFontSizeChange={this.handleFontSizeChange}
                    handleFontColorChange={this.handleFontColorChange}
                    handleFontFamilyChange={this.handleFontFamilyChange}
                    handleChildIdSelected={this.handleChildIdSelected}
                    disableCropMode={this.disableCropMode}
                    handleResizeInnerImageStart={handleResizeInnerImageStart && handleResizeInnerImageStart.bind(this)}
                    doNoObjectSelected={doNoObjectSelected && doNoObjectSelected.bind(this)}
                    handleDeleteThisPage={this.handleDeleteThisPage.bind(this, pages[i])}
                    showPopup={this.state.showPopup}
                    preview={preview}
                    activePageId={toJS(editorStore.activePageId)}
                />
            );
        }

        return res;
    }

    renderCanvasPreview() {
        let res = [];
        let pages = toJS(editorStore.pages);
        let keys = toJS(editorStore.keys);
        for (let i = 0; i < 1; ++i) {

            res.push(
                <PreviewCanvas
                    handleCropBtnClick={handleCropBtnClick && handleCropBtnClick.bind(this)}
                    toggleVideo={this.toggleVideo}
                    uiKey={pages[i] + keys[i]}
                    selected={
                        editorStore.imageSelected &&
                        editorStore.imageSelected.page == pages[i] &&
                        editorStore.imageSelected.type == TemplateType.BackgroundImage}
                    id={pages[i]}
                    active={pages[i] == editorStore.activePageId}
                    translate={this.translate}
                    numberOfPages={pages.length}
                    downloading={false}
                    bleed={this.state.bleed}
                    key={i}
                    staticGuides={this.state.staticGuides}
                    index={i}
                    addAPage={this.addAPage}
                    images={Array.from(editorStore.images2.values()).filter((img: any) => img.page === pages[i]).map(img => toJS(img))}
                    mode={this.state.mode}
                    rectWidth={this.state.rectWidth}
                    rectHeight={this.state.rectHeight}
                    scale={this.state.fitScale}
                    childId={editorStore.childId}
                    cropMode={this.state.cropMode}
                    handleImageSelected={this.handleImageSelected}
                    handleImageHovered={this.handleImageHovered}
                    handleImageUnhovered={this.handleImageUnhovered}
                    handleImageHover={this.handleImageHover}
                    handleRotateStart={this.handleRotateStart}
                    handleResizeStart={null}
                    handleDragStart={this.handleDragStart}
                    onTextChange={onTextChange && onTextChange.bind(this)}
                    handleFontSizeChange={this.handleFontSizeChange}
                    handleFontColorChange={this.handleFontColorChange}
                    handleFontFamilyChange={this.handleFontFamilyChange}
                    handleChildIdSelected={this.handleChildIdSelected}
                    disableCropMode={this.disableCropMode}
                    handleResizeInnerImageStart={this.handleResizeInnerImageStart}
                    doNoObjectSelected={doNoObjectSelected && doNoObjectSelected.bind(this)}
                    handleDeleteThisPage={this.handleDeleteThisPage.bind(this, pages[i])}
                    showPopup={this.state.showPopup}
                    preview={false}
                    activePageId={toJS(editorStore.activePageId)}
                />
            );
        }

        return res;
    }

    setScale = (scale) => {
        editorStore.scale = scale;
        this.setState({scale});
    }

    handleDeleteThisPage = pageId => {
        let pages = toJS(editorStore.pages);
        let tempPages = pages.filter(pId => pId !== pageId);
        editorStore.pages.replace(tempPages);
    };

    handleRemoveAllMedia = () => {
        let model;
        if (
            this.state.selectedTab === SidebarTab.Image ||
            this.state.selectedTab === SidebarTab.Background
        ) {
            model = "Media";
        } else if (this.state.selectedTab === SidebarTab.Template) {
            model = "Template";
        }
        const url = `/api/${model}/RemoveAll`;
        fetch(url);
    };

    refFullName = null;
    refAddress = null;
    refCity = null;
    refPhoneNumber = null;

    cancelSaving() {
        if (this.saving) {
            clearTimeout(this.saving);
            this.saving = null;
        }
    }

    canvas1 = {};
    canvas2 = {};

    render() {
        const { scale, rectWidth, rectHeight } = this.state;

        return (
            <div>
                <div
                    id="editor"
                    style={{ display: "flex", flexDirection: "column", height: "100%" }}
                >
                    <Helmet>
                        {/* <title>alo</title> */}
                        <title>{this.props.tReady ? this.translate("design") : "Draft"}</title>
                    </Helmet>
                    <div
                        id="editor-navbar"
                        style={{
                            background: "linear-gradient(90deg,#00c4cc,#7d2ae8)",
                            height: "55px",
                            padding: "7px",
                            display: "flex",
                            position: "relative",
                        }}
                    >
                        <Narbar
                            playVideos={this.playVideos}
                            translate={this.translate}
                            designTitle={this.state.designTitle}
                        />
                    </div>
                    <div
                        className="wrapper"
                        style={{
                            top: "55px",
                            width: `100%`,
                            height: "calc(100% - 55px)",
                            display: "flex",
                            overflow: "hidden"
                        }}
                    >
                        <div
                            style={{
                                width: "450px",
                                backgroundColor: "#293039",
                            }}
                        >
                            {editorStore.templateRatio &&
                                <LeftSide
                                    id={this.state._id}
                                    effectId={this.state.effectId}
                                    align={this.state.align}
                                    handleEditFont={this.handleEditFont}
                                    scale={this.state.scale}
                                    fontId={this.state.fontId}
                                    translate={this.translate.bind(this)}
                                    mounted={this.state.mounted}
                                    selectFont={selectFont && selectFont.bind(this)}
                                    handleFontColorChange={this.handleFontColorChange.bind(this)}
                                    typeObjectSelected={this.state.typeObjectSelected}
                                    idObjectSelected={editorStore.idObjectSelected}
                                    childId={editorStore.childId}
                                    rectWidth={this.state.rectWidth}
                                    rectHeight={this.state.rectHeight}
                                    toolbarOpened={this.state.toolbarOpened}
                                    toolbarSize={this.state.toolbarSize}
                                    mode={this.state.mode}
                                    selectedTab={this.state.selectedTab}
                                    handleSidebarSelectorClicked={this.handleSidebarSelectorClicked}
                                    handleImageSelected={this.handleImageSelected}
                                    updateImages={this.updateImages}
                                    forceEditorUpdate={this.forceEditorUpdate}
                                    setSavingState={this.setSavingState}
                                    handleEditmedia={this.handleEditmedia}
                                    saveImages={saveImages && saveImages.bind(this)}
                                />}
                        </div>
                        <div
                            style={{
                                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 2px 0px",
                                transitionDuration: "0.1s, 0.1s",
                                width: `calc(100% - ${(this.state.toolbarOpened
                                    ? this.state.toolbarSize
                                    : 80) + (this.state.showPrintingSidebar ? 330 : 0)}px)`,
                                // left: `${
                                //   this.state.toolbarOpened ? this.state.toolbarSize - 2 : 80
                                // }px`,
                                backgroundColor: "#ECF0F2",
                                position: "relative",
                                height: "100%"
                            }}
                            ref={this.setAppRef}
                            id="screens"
                            onScroll={handleScroll && handleScroll.bind(this)}
                            onWheel={handleWheel && handleWheel.bind(this)}
                        >
                            <div>
                                <div
                                    style=
                                    {{
                                        width: "100%",
                                        backgroundColor: "#dae0e7",
                                        display: "inline-flex",
                                        position: "absolute",
                                        right: 0,
                                        left: "0px",
                                        height: "46px",
                                        padding: "8px",
                                        marginBottom: "10px",
                                        zIndex: 2,
                                        background: '#fff',
                                        boxShadow: '0 1px 0 rgba(57,76,96,.15)',
                                    }}
                                >
                                    <Toolbar
                                        scale={this.state.scale}
                                        onTextChange={onTextChange && onTextChange.bind(this)}
                                        updateImages={this.updateImages}
                                        selectedCanvas={this.state.selectedCanvas}
                                        effectId={this.state.effectId}
                                        bold={this.state.bold}
                                        italic={this.state.italic}
                                        align={this.state.align}
                                        selectedTab={this.state.selectedTab}
                                        translate={this.translate}
                                        childId={editorStore.childId}
                                        fontColor={this.state.fontColor}
                                        handleItalicBtnClick={handleItalicBtnClick && handleItalicBtnClick.bind(this)}
                                        handleBoldBtnClick={handleBoldBtnClick && handleBoldBtnClick.bind(this)}
                                        onClickDropDownFontList={this.onClickDropDownFontList}
                                        onClickEffectList={this.onClickEffectList}
                                        fontName={this.state.fontName}
                                        fontId={this.state.fontId}
                                        cropMode={this.state.cropMode}
                                        handleCropBtnClick={handleCropBtnClick && handleCropBtnClick.bind(this)}
                                        handleFlipBtnClick={this.handleFlipBtnClick}
                                        imgBackgroundColor={this.state.imgBackgroundColor}
                                        handleImageBackgroundColorBtnClick={this.handleImageBackgroundColorBtnClick}
                                        fontSize={this.state.fontSize}
                                        handleFontSizeBtnClick={handleFontSizeBtnClick && handleFontSizeBtnClick.bind(this)}
                                        handleAlignBtnClick={handleAlignBtnClick && handleAlignBtnClick.bind(this)}
                                        handleOkBtnClick={this.handleOkBtnClick}
                                        handleCancelBtnClick={this.handleCancelBtnClick}
                                        idObjectSelected={editorStore.idObjectSelected}
                                        forwardSelectedObject={this.forwardSelectedObject}
                                        backwardSelectedObject={this.backwardSelectedObject}
                                        handleTransparentAdjust={handleTransparentAdjust && handleTransparentAdjust.bind(this)}
                                        currentOpacity={this.state.currentOpacity}
                                        currentLineHeight={this.state.currentLineHeight}
                                        currentLetterSpacing={this.state.currentLetterSpacing}
                                        handleOpacityChange={this.handleOpacityChange}
                                        handleOpacityChangeEnd={this.handleOpacityChangeEnd}
                                        groupGroupedItem={groupGroupedItem && groupGroupedItem.bind(this)}
                                        ungroupGroupedItem={groupGroupedItem && ungroupGroupedItem.bind(this)}
                                        removeImage={this.removeImage2}
                                        copyImage={copyImage && copyImage.bind(this)}
                                    />
                                </div>
                            </div>
                            <div
                                key={1}
                                id="screen-container-parent"
                                style={{
                                    top: "46px",
                                    overflow: "scroll",
                                    alignItems: "center",
                                    display: "flex",
                                    position: "absolute",
                                    width: "100%",
                                    height: "calc(100% - 46px)",
                                    zIndex: 1,
                                }}
                            >
                                {this.state.mounted && 
                                this.props.tReady && 
                                (this.state.rectWidth > 0) && 
                                (
                                    <div
                                        id="screen-container"
                                        className="screen-container"
                                        style={{
                                            width: rectWidth * scale + 40 + "px",
                                            height: rectHeight * scale + 40 + "px",
                                            margin: "auto",
                                            right: 0,
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            padding: "0 20px"
                                        }}
                                        ref={this.setContainerRef}
                                    >
                                        <div
                                            style={{
                                                display: "none"
                                            }}
                                        >
                                            {this.renderCanvas(false, -1, true)}
                                        </div>
                                        {this.renderCanvas(false, -1, false)}
                                    </div>
                                )}
                                <div
                                    style={{
                                        position: "fixed",
                                        bottom: "15px",
                                        right: "15px",
                                        zIndex: 99999999
                                    }}
                                >
                                    {this.props.tReady && <ZoomController
                                        setScale={this.setScale}
                                        translate={this.translate}
                                        scale={this.state.scale}
                                        fitScale={this.state.fitScale}
                                    />}

                                </div>
                            </div>
                            <div
                                id="screen-container-parent2"
                                style={{
                                    top: "46px",
                                    overflow: "scroll",
                                    alignItems: "center",
                                    display: "flex",
                                    position: "absolute",
                                    width: "100%",
                                    height: "calc(100% - 46px)"
                                }}
                            ></div>
                        </div>
                    </div>
                    {this.state.showMediaEditPopup ? (
                        <MediaEditPopup
                            item={this.state.editingMedia}
                            closePopup={() => {
                                this.setState({ showMediaEditPopup: false });
                                this.forceUpdate();
                            }}
                            handleRemoveBackground={this.handleRemoveBackground.bind(
                                this,
                                this.state.editingMedia.id
                            )}
                        />
                    ) : null}
                    {this.state.showTemplateEditPopup ? (
                        <TemplateEditor
                            item={this.state.editingMedia}
                            closePopup={() => {
                                this.setState({ showTemplateEditPopup: false });
                            }}
                        />
                    ) : null}
                    {this.state.showFontEditPopup ? (
                        <FontEditPopup
                            item={this.state.editingFont}
                            closePopup={() => {
                                this.setState({ showFontEditPopup: false });
                                this.forceUpdate();
                            }}
                        />
                    ) : null}
                </div>
                <Popup
                    showPopup={this.state.showPopup}
                    translate={this.translate}
                    closePopup={() => {
                        this.setState({ showPopup: false });
                    }}
                />
                {this.state.showPopupPreview &&
                    <div
                        key={1}
                        id="screen-container-parent"
                        style={{
                            top: "0px",
                            paddingTop: "48px",
                            overflow: "scroll",
                            alignItems: "center",
                            display: "flex",
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            zIndex: 123123131,
                            backgroundColor: "rgba(14,19,24,.95)",
                        }}
                    >
                        <button
                            id="closePreviewBtn"
                            style={{
                                position: 'absolute',
                                right: '175px',
                                top: '10px',
                                color: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                padding: '10px 30px',
                                border: 'none',
                                borderRadius: "4px",
                                fontSize: '15px',
                                lineHeight: '15px',
                            }}
                            onClick={e => {
                                this.setState({ showPopupPreview: false });
                                this.forceUpdate();
                            }}
                        >
                            {this.translate("close")}
                        </button>
                        {this.renderCanvasPreview()}
                    </div>}
            </div>
        );
    }
}

export default withTranslation(NAMESPACE)(CanvaEditor);
