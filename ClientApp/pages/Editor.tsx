﻿import React, { Component } from "react";
import uuidv4 from "uuid/v4";
import "@Styles/editor.scss";
import "@Styles/colorPicker.scss";
import { Helmet } from "react-helmet";
import { withTranslation } from "react-i18next";
import { SubType, SidebarTab, Mode, TemplateType, SavingState, CanvasType, } from "@Components/editor/enums";
import loadable from "@loadable/component";

const PosterReview = loadable(() => import("@Components/editor/PosterReview"));
const TrifoldReview = loadable(() =>import("@Components/editor/TrifoldReview"));
const FlyerReview = loadable(() => import("@Components/editor/FlyerReview"));
const BusinessCardReview = loadable(() => import("@Components/editor/BusinessCardReview"));
const CanvasReview = loadable(() => import("@Components/editor/CanvasReview"));
const Canvas = loadable(() => import("@Components/editor/Canvas"));
const MediaEditPopup = loadable(() => import("@Components/editor/MediaEditor"));
const TemplateEditor = loadable(() => import("@Components/editor/TemplateEditor"));
const FontEditPopup = loadable(() => import("@Components/editor/FontEditor"));
const Popup = loadable(() => import("@Components/shared/Popup"));
const Tooltip = loadable(() => import("@Components/shared/Tooltip"));
const Toolbar =  loadable(() => import("@Components/editor/toolbar/Toolbar"));
const LeftSide = loadable(() => import("@Components/editor/LeftSide"));
const Narbar = loadable(() => import("@Components/editor/Navbar"));

import {
    isNode,
}  from "@Utils";

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
    first;

let editorStore : any = {};
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
    ({clone} = require("lodash"));
    ({toJS} = require("mobx"));

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

const RESIZE_OFFSET = 10;

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
    subtype: SubType;
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
    colorPickerShown: boolean;
    selectedCanvas: string;
    saved: boolean;
    designId: string;
    designTitle: string;
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
            colorPickerShown: false,
            selectedImage: null,
            showFontEditPopup: false,
            currentPrintStep: 1,
            subtype: null,
            bleed: false,
            showMediaEditPopup: false,
            childId: null,
            fontName: "images/font-AvenirNextRoundedPro.png",
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
        };
        this.handleResponse = this.handleResponse.bind(this);
        this.handleAddOrder = this.handleAddOrder.bind(this);
        this.externalPaymentCompleted = this.externalPaymentCompleted.bind(this);
        this.handleColorBtnClick = this.handleColorBtnClick.bind(this);
        this.handleItalicBtnClick = this.handleItalicBtnClick.bind(this);
        this.handleBoldBtnClick = this.handleBoldBtnClick.bind(this);
        this.handleFilterBtnClick = this.handleFilterBtnClick.bind(this);
        this.handleAdjustBtnClick = this.handleAdjustBtnClick.bind(this);
        this.handleCropBtnClick = this.handleCropBtnClick.bind(this);
        this.handleFlipBtnClick = this.handleFlipBtnClick.bind(this);
        this.handleImageBackgroundColorBtnClick = this.handleImageBackgroundColorBtnClick.bind(this);
        this.handleFontSizeBtnClick = this.handleFontSizeBtnClick.bind(this);
        this.handleAlignBtnClick = this.handleAlignBtnClick.bind(this);
        this.handleOkBtnClick = this.handleOkBtnClick.bind(this);
        this.onClickpositionList = this.onClickpositionList.bind(this);
        this.onClickTransparent = this.onClickTransparent.bind(this);
        this.forwardSelectedObject = this.forwardSelectedObject.bind(this);
        this.backwardSelectedObject = this.backwardSelectedObject.bind(this);
        this.handleTransparentAdjust = this.handleTransparentAdjust.bind(this);
        this.handleApplyEffect = this.handleApplyEffect.bind(this);
        this.handleChangeOffset = this.handleChangeOffset.bind(this);
        this.backgroundOnMouseDown = this.backgroundOnMouseDown.bind(this);
        this.cancelSaving = this.cancelSaving.bind(this);
        this.setSavingState = this.setSavingState.bind(this);
        this.templateOnMouseDown = this.templateOnMouseDown.bind(this);
        this.toggleVideo = this.toggleVideo.bind(this);
        this.updateGuide = this.updateGuide.bind(this);
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

    handleColorBtnClick = (e: any) => {
        e.preventDefault();
        this.setState({ selectedTab: SidebarTab.Color });
    }

    handleItalicBtnClick = (e: any) => {
        e.preventDefault();
        
        let italic;
        let image = this.getImageSelected();
        if (editorStore.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.italic = !text.italic;
                    italic = text.italic;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.italic = !image.italic;
            italic = image.italic;
        }

        this.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);

        this.setState({
            italic,
        });

        editorStore.images2.set(editorStore.idObjectSelected, image);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.scale != nextState.scale) {
            return true;
        }
        if (!this.props.tReady && nextProps.tReady) {
            editorStore.tReady = true;
        }
        return false;
    }
    
    getImageSelected() {
        return editorStore.images2.get(editorStore.idObjectSelected);
    }

    handleBoldBtnClick = (e: any) => {
        e.preventDefault();
        
        let bold;
        let image = this.getImageSelected();
        if (editorStore.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.bold = !text.bold;
                    bold = text.bold;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.bold = !image.bold;
            bold = image.bold;
        }

        this.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);

        this.setState({
            bold,
        });

        editorStore.images2.set(editorStore.idObjectSelected, image);
    }

    handleFilterBtnClick = (e: any) => {
        e.preventDefault();
        this.setState({ cropMode: true });
    }

    handleAdjustBtnClick = (e: any) => {
        e.preventDefault();
        this.setState({ cropMode: true });
    }

    handleCropBtnClick = (e: any) => {

        this.enableCropMode(editorStore.idObjectSelected, editorStore.pageId);

        let image = editorStore.images2.get(editorStore.idObjectSelected);
        window.tempImage = image;

        setTimeout(() => {
            if (image.type == TemplateType.Video) {
                let el = document.getElementById(editorStore.idObjectSelected + "video" + "alo") as HTMLVideoElement;
                let el3 = document.getElementById(editorStore.idObjectSelected + "video3" + "alo") as HTMLCanvasElement;
                let el4 = document.getElementById(editorStore.idObjectSelected + "video4" + "alo") as HTMLCanvasElement;
                if (el && el3) {
                    el.pause();
                    el3.getContext('2d').drawImage(el, 0, 0, el3.width, el3.height);
                }

                image.paused = true;
                editorStore.images2.set(image._id, image);
                
                if (!image.paused) this.canvas1[image.page].canvas[CanvasType.HoverLayer][image._id].child.toggleVideo();

                image.paused = true;
            } 
        }, 100);
    }

    handleFlipBtnClick = (e: any) => {
        e.preventDefault();
        this.setState({ cropMode: true });
    }

    handleImageBackgroundColorBtnClick = (e: any) => {
        e.preventDefault();
        this.setState({ selectedTab: SidebarTab.Color });
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

    getTextHeight = (text, font) => {
        // re-use canvas object for better performance
        let canvas = this.canvas || (this.canvas = document.createElement("canvas"));
        let context = canvas.getContext("2d");
        context.font = font;
        let metrics = context.measureText(text);

        return parseInt(context.font.match(/\d+/), 10);
    }

    handleFontSizeBtnClick = (e: any, fontSize: number) => {
        console.log('fontsize ', fontSize)

        let image = this.getImageSelected();
        
        if (editorStore.childId) {
            let text = image.document_object.find(text => text._id == editorStore.childId);
            fontSize = fontSize / image.scaleY / text.scaleY;
            console.log('image.scaleY text.scaleY', fontSize, image.scaleY, text.scaleY)
        }

        let fonts;

        if (editorStore.childId) {
            fonts = document
                .getElementById(editorStore.idObjectSelected + editorStore.childId + "alo")
                .getElementsByClassName("font");
        } else {
            fonts = document
                .getElementById(editorStore.idObjectSelected + "hihi4alo")
                .getElementsByClassName("font");
        }


        let width2 = 0, height2 = 0;

        let fontSizePx = fontSize + "px";
        let fontSizePt = fontSize + "pt";

        for (let i = 0; i < fonts.length; ++i) {
            let font = fonts[i];
            (font as HTMLElement).style.fontSize = fontSizePx;

            width2 = Math.max(width2, this.getTextWidth(font.innerHTML, fontSizePt + " " + image.fontFace));
            height2 += this.getTextHeight(font.innerHTML, fontSizePt + " " + image.fontFace);
        }

        if (!editorStore.childId) {
            image.scaleX = 1;
            image.scaleY = 1;
            image.width = width2;
            image.origin_width = width2;
            image.height = height2;
            image.origin_height = height2;
            image.fontSize = fontSize;
            let hihi4 = document.getElementById(image._id + "hihi4alo");
            if (hihi4) {
                image.innerHTML = hihi4.innerHTML;
            } 
        } else {
            let el = document.getElementById(editorStore.idObjectSelected + editorStore.childId + "alo");
            if (el) {
                let texts = image.document_object.map(text => {
                    if (text._id == editorStore.childId) {
                        text.innerHTML = el.innerHTML;

                        console.log('font size ', fontSize)
                        text.fontSize = fontSize;

                        fontSize = fontSize * image.scaleY * text.scaleY;
                    }
                    return text;
                });
                image.document_object = texts;
            } 
        }  

        editorStore.images2.set(editorStore.idObjectSelected, image);
        this.updateImages2(image, true);
            
        this.setState({ fontSize: fontSize });
        
        console.log('fontsize ', fontSize)

        editorStore.currentFontSize = fontSize;

        (document.getElementById("fontSizeButton") as HTMLInputElement).value = fontSize.toString();
        if (editorStore.childId) {
            this.onSingleTextChange(image, e, editorStore.childId);
        }
    }

    handleAlignBtnClick = (e: any, type: string) => {
        e.preventDefault();
        let a = document.getSelection();
        let command;
        let align;
        switch (type) {
            case "alignLeft":
                command = "JustifyLeft";
                align = "left";
                break;
            case "alignCenter":
                command = "JustifyCenter";
                align = "center";
                break;
            case "alignRight":
                command = "JustifyRight";
                align = "right";
                break;
            default:
                return;
        }
        
        let image = this.getImageSelected();
        if (!editorStore.childId) {
            image.align = align;
        } else {
            image.document_object = image.document_object.map(doc => {
                if (doc._id == editorStore.childId) {
                    doc.align = align;
                }
                return doc;
            });
        }
        editorStore.images2.set(editorStore.idObjectSelected, image);

        this.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
        this.setState({align: type});
    }

    handleOkBtnClick = (e: any) => {
        // this.rerenderAllPages();
        // e.preventDefault();
        // this.setState({ cropMode: false });
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

    handleTransparentAdjust = (e: any) => {
        this.pauserTransparentPopup.next(true);
        this.pauser.next(true);
        (document.activeElement as HTMLElement).blur();
        e.preventDefault();
        let self = this;
        const onMove = e => {
            e.preventDefault();
            let rec1 = document
                .getElementById("myOpacity-3")
                .getBoundingClientRect();
            let rec2 = document.getElementById(
                "myOpacity-3slider"
            );
            let slide = e.pageX - rec1.left;
            let scale = (slide / rec1.width) * 100;
            scale = Math.max(1, scale);
            scale = Math.min(100, scale);

            this.setState({ currentOpacity: scale });

            this.handleOpacityChange.bind(this)(scale);
        };

        const onUp = e => {
            e.stopImmediatePropagation();
            e.preventDefault();
            document.removeEventListener(
                "mousemove",
                onMove
            );
            document.removeEventListener("mouseup", onUp);
            this.pauser.next(false);
            this.pauserTransparentPopup.next(false);
            this.handleOpacityChangeEnd();
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    }

    pauser = null;
    pauserTransparentPopup = null;

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleLeavePage.bind(this));
    }

    async handleLeavePage(e) {
        // await this.saveImages(null, false);
        // const confirmationMessage = 'Some message';
        // e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
        // return confirmationMessage;              // Gecko, WebKit, Chrome <34
    }

    async setRef() {
        let screenContainerParent = document.getElementById("screen-container-parent");
        // if (!screenContainerParent) return;
        window.addEventListener('beforeunload', this.handleLeavePage.bind(this));
        // Creating a pauser subject to subscribe to
        let screenContainerParentRect = screenContainerParent.getBoundingClientRect();
        let doNoObjectSelected$ = fromEvent(screenContainerParent, "mouseup");

        this.pauser = new BehaviorSubject(false);

        const pausable = this.pauser.pipe(
            switchMap(paused => {
                return paused ? NEVER : doNoObjectSelected$;
            })
        );
        this.pauser.next(false);

        pausable.subscribe(e => {
            if ((e.target.id == "screen-container-parent" || e.target.id == "screen-container")
            && editorStore.idObjectSelected) {
                this.doNoObjectSelected();
            }
        });

        this.pauserTransparentPopup = new BehaviorSubject(false);

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

        this.setState({
            staticGuides,
            scale: fitScale,
            fitScale
        });
        let subtype;
        let template_id = this.props.match.params.template_id;
        let design_id = this.props.match.params.design_id;

        if (template_id) {
            let url;
            if (this.props.match.path == "/editor/template/:template_id") {
                url = `/api/Template/Get?id=${template_id}`;
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

                        self.setState({designId: uuidv4()});

                        if (templateType == TemplateType.TextTemplate) {
                            mode = Mode.EditTextTemplate;
                        }
                    } else if (this.props.match.path == "/editor/design/:design_id/:template_id") {
                        mode = Mode.CreateDesign;

                        self.setState({designId: this.props.match.params.design_id});
                    } else if (templateType == TemplateType.Template) {
                        mode = Mode.EditTemplate;
                    } else if (templateType == TemplateType.TextTemplate) {
                        mode = Mode.EditTextTemplate;
                    }

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
                    images.forEach(image => {
                        editorStore.images2.set(image._id, image);
                    })

                    editorStore.fonts.replace(image.value.fontList);

                    subtype = res.data.value.printType;
                    let scale = Math.min(scaleX, scaleY) === Infinity ? 1 : Math.min(scaleX, scaleY);
                    self.setState({
                        scale,
                        fitScale: scale,
                        staticGuides,
                        _id: template_id,
                        rectWidth: document.width,
                        rectHeight: document.height,
                        templateType,
                        mode,
                        subtype: res.data.value.printType,
                        designTitle: image.value.title,
                    });

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

        if (this.props.match.params.subtype) {
            subtype = this.props.match.params.subtype;
            let rectWidth;
            let rectHeight;
            if (subtype == 0) {
                rectWidth = 642;
                rectHeight = 378;
            } else if (subtype == 1) {
                rectWidth = 1587.402;
                rectHeight = 2245.04;
            } else if (subtype == 2) {
                rectWidth = 2245.04;
                rectHeight = 1587.402;
            } else if (subtype == 3) {
                // Poster
                rectWidth = 3174.8;
                rectHeight = 4490.08;
            } else if (subtype == 4) {
                rectWidth = 500;
                rectHeight = 500;
            } else if (subtype == 5) {
                rectWidth = 794;
                rectHeight = 1134;
            } else if (subtype == 6) {
                rectWidth = 1024;
                rectHeight = 1024;
            } else if (subtype == 7) {
                rectWidth = 1920;
                rectHeight = 1080;
            } else if (subtype == 8) {
                rectWidth = 940;
                rectHeight = 788;
            } else if (subtype == 9) {
                rectWidth = 1080;
                rectHeight = 1080;
            } else if (subtype == 10) {
                rectWidth = 2550;
                rectHeight = 3300;
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
    
            self.setState({
                staticGuides,
                rectWidth,
                rectHeight,
                subtype,
                scale: fitScale,
                fitScale,
            });
        }

        document.addEventListener("keydown", this.removeImage.bind(this));
        this.$app.addEventListener("scroll", this.handleScroll.bind(this), { passive: true });
        document.addEventListener("wheel", this.handleWheel.bind(this), {passive: false});
   
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
                if (editorStore.idObjectSelected) self.doNoObjectSelected();
                window.selections.forEach(el => {
                    el.style.opacity = 0;
                });
            }

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
            // window.selections.forEach(el => {
            //     let id = el.attributes.iden.value;
            //     if (id)
            //     el.style.opacity = 1;
            //     el.classList.toggle('selected');
            // });
            // setTimeout(() => {
                window.selectionStart = false;
            // }, 300);

            let top = 999999, right = 0, bottom = 0, left = 999999;
            evt.selected.forEach(node => {
                let id = node.attributes.iden.value;
                if (!id) return;

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
            };
            let index2 = editorStore.pages.findIndex(pageId => pageId == editorStore.activePageId);
            editorStore.keys[index2] = editorStore.keys[index2] + 1;
            editorStore.addItem2(item, false);
            self.handleImageSelected(item._id, item.page, false, true, false);
        });
    }

    textOnMouseDown(e, doc) {
        let scale = this.state.scale;
        let ce = document.createElement.bind(document);
        let ca = document.createAttribute.bind(document);
        let ge = document.getElementsByTagName.bind(document);

        e.preventDefault();
        let target = e.target.cloneNode(true);
        target.style.zIndex = "11111111111";
        target.style.width = e.target.getBoundingClientRect().width + "px";
        document.body.appendChild(target);
        let self = this;
        this.imgDragging = target;
        let posX = e.pageX - e.target.getBoundingClientRect().left;
        let dragging = true;
        let posY = e.pageY - e.target.getBoundingClientRect().top;

        const onMove = e => {
            if (dragging) {
                target.style.left = e.pageX - posX + "px";
                target.style.top = e.pageY - posY + "px";
                target.style.position = "absolute";
            }
        };

        const onUp = e => {
            dragging = false;
            let recs = document.getElementsByClassName("alo");
            let rec2 = this.imgDragging.getBoundingClientRect();
            for (let i = 0; i < recs.length; ++i) {
                let rec = recs[i].getBoundingClientRect();
                let rec3 = recs[i];
                if (
                    rec.left < e.pageX &&
                    e.pageX < rec.left + rec.width &&
                    rec.top < e.pageY &&
                    e.pageY < rec.top + rec.height
                ) {
                    let rectTop = rec.top;
                    let index = i;
                    let document2 = JSON.parse(doc.document);
                    document2._id = uuidv4();
                    document2.page = editorStore.pages[index];
                    document2.zIndex = editorStore.upperZIndex + 1;
                    document2.width = rec2.width / scale;
                    document2.height = rec2.height / scale;
                    document2.scaleX = document2.width / document2.origin_width;
                    document2.scaleY = document2.height / document2.origin_height;
                    document2.left = (rec2.left - rec.left) / scale;
                    document2.top = (rec2.top - rectTop) / scale;
                    document2.selected = true;
                    document2.rotateAngle = 0;
                    document2.fontFace = "O5mEMMs7UejmI1WeSKWQ";

                    // document2.document_object = document2.document_object;

                    if (doc.fontList) {
                        let fontList = doc.fontList.forEach(id => {
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


                    this.setSavingState(SavingState.UnsavedChanges, true);
                    editorStore.addItem2(document2, false);

                    this.handleImageSelected(document2._id, document2.page, false, true, false);

                    let index2 = editorStore.pages.findIndex(pageId => pageId == document2.page);
                    editorStore.keys[index2] = editorStore.keys[index2] + 1;

                    let fonts = toJS(editorStore.fonts);
                    let tempFonts = [...fonts, ...doc.fontList];
                    editorStore.fonts.replace(tempFonts);

                    editorStore.increaseUpperzIndex();

                    this.forceUpdate();
                }
            }

            target.remove();
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    }

    selectFont = (id, e) => {
        let fontsList = toJS(editorStore.fontsList);
        let font = fontsList.find(font => font.id === id);
        let el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
        if (el) {
            el.style.fontFamily = id;
        }

        el = document.getElementById(editorStore.childId + "text-container2alo");
        if( el) {
            el.style.fontFamily = id;
        }

        let image = editorStore.images2.get(editorStore.idObjectSelected);
        if (editorStore.childId) {
            let newTexts = image.document_object.map(d => {
                if (d._id == editorStore.childId) {
                    d.fontId = id;
                    d.fontFace = id;
                    d.fontRepresentative = font.representative;
                }
                return d;
            });
            image.document_object = newTexts;
        }
        image.fontId = id;
        image.fontFace = id;
        image.fontRepresentative = font.representative;

        editorStore.images2.set(editorStore.idObjectSelected, image);
        this.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);

        this.setState({ 
            fontName: font.representative,
            fontId: font.id,
        });

        editorStore.fontId = font.id;

        e.preventDefault();
        let style = `@font-face {
      font-family: '${id}';
      src: url('/fonts/${id}.ttf');
    }`;
        let styleEle = document.createElement("style");
        let type = document.createAttribute("type");
        type.value = "text/css";
        styleEle.attributes.setNamedItem(type);
        styleEle.innerHTML = style;
        let head = document.head || document.getElementsByTagName("head")[0];
        head.appendChild(styleEle);

        let link = document.createElement("link");
        link.id = id;
        link.rel = "preload";
        link.href = `/fonts/${id}.ttf`;
        link.media = "all";
        link.as = "font";
        link.crossOrigin = "anonymous";
        head.appendChild(link);

        editorStore.addFont(id);
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.state.scale !== prevState.scale) {
            this.handleScroll();
        }
    }

    handleEditmedia = item => {
        this.setState({ showMediaEditPopup: true, editingMedia: item });
    };

    handleEditFont = item => {
        console.log('handleEditFont ', item)
        this.setState({ showFontEditPopup: true, editingFont: item });
        this.forceUpdate();
    };

    displayResizers = (show: Boolean) => {
        let opacity = show ? 1 : 0;
        let el = document.getElementById(editorStore.idObjectSelected + "__alo");
        if (el) {
            let resizers = el.getElementsByClassName("resizable-handler-container");
            for (let i = 0; i < resizers.length; ++i) {
                let cur: any = resizers[i];
                cur.style.opacity = opacity;
            }

            let rotators = el.getElementsByClassName("rotate-container");
            for (let i = 0; i < rotators.length; ++i) {
                let cur: any = rotators[i];
                cur.style.opacity = opacity;
            }
        }
    };

    popuplateImageProperties = (id) => {
        let image = toJS(editorStore.images2.get(id));
        window.image = clone(image);
        window.imageTop = image.top;
        window.imageLeft = image.left;
        window.imageWidth = image.width;
        window.imageHeight = image.height;
        window.imageimgWidth = image.imgWidth;
        window.imageimgHeight = image.imgHeight;
        window.posX = image.posX;
        window.posY = image.posY;
        window.scaleX = image.scaleX;
        window.scaleY = image.scaleY;
        window.origin_width = image.origin_width;
        window.origin_height = image.origin_height;
        window.document_object = image.document_object;
    }

    handleResizeStart = (e: any, d: any) => {

        this.cancelSaving();

        this.popuplateImageProperties(editorStore.idObjectSelected);

        e.stopPropagation();

        window.resized = false;

        window.startX = e.clientX;
        window.startY = e.clientY;
        window.resizingInnerImage = false;

        this.pauser.next(true);

        let cursor = e.target.id;
        let type = e.target.getAttribute("class").split(" ")[0];
        let { scale } = this.state;
        const location$ = this.handleDragRx(e.target);
        let { top: top2, left: left2, width: width2, height: height2 } = window.image;

        const rect2 = tLToCenter({
            top: top2,
            left: left2,
            width: width2,
            height: height2,
            rotateAngle: 0,
        });
        const rect = {
            width: rect2.size.width,
            height: rect2.size.height,
            centerX: rect2.position.centerX,
            centerY: rect2.position.centerY,
            rotateAngle: rect2.transform.rotateAngle
        };

        window.rect = rect;
        window.selectionsAngle = {};

        let cursorStyle = getCursorStyleForResizer(window.image.rotateAngle, d);
        let ell = document.getElementById("screen-container-parent2");
        ell.style.zIndex = "2";
        ell.style.cursor = cursorStyle;

        let images = [];
        Array.from(editorStore.images2.values()).forEach(image => {
            if (image.page === window.image.page && image._id != editorStore.idObjectSelected) {
                if (window.image.type != TemplateType.GroupedItem) {
                    let clonedImage = transformImage(clone(image));
                    images.push(clonedImage);
                } else if (!window.selectionIDs[image._id]) {
                    let clonedImage = transformImage(clone(image));
                    images.push(clonedImage);
                }
            }
        });

        window.cloneImages = images;

        let image = editorStore.images2.get(editorStore.idObjectSelected);

        let ratio = null;
        if (type == "t" && 
            image.type != TemplateType.Image &&
            image.type != TemplateType.Video
        ) {
            ratio = image.width / image.height;
        }
        if (type == "b" && 
            image.type != TemplateType.Image && 
            image.type != TemplateType.Video
        ) {
            ratio = image.width / image.height;
        }

        if ((image.type == TemplateType.Image || image.type == TemplateType.Video || image.type == TemplateType.GroupedItem) &&
            (type == "tl" || type == "tr" || type == "bl" || type == "br")) {
            ratio = image.width / image.height;
        } else if ((image.type == TemplateType.Heading || image.type == TemplateType.TextTemplate) &&
            (type == "tl" || type == "tr" || type == "bl" || type == "br" || type == "t" || type == "b")) {
            ratio = image.width / image.height;
        }

        first()(location$).subscribe(v => {
            window.resized = true;
            this.displayResizers(false);
            this.setSavingState(SavingState.UnsavedChanges, false);
        });

        this.temp = location$
            .pipe(
                map(([x, y, eventName]) => ({
                    moveElLocation: [x, y, eventName]
                }))
            )
            .subscribe(
                ({ moveElLocation }) => {
                    let deltaX = moveElLocation[0] - window.startX;
                    let deltaY = moveElLocation[1] - window.startY;
                    const deltaL = getLength(deltaX, deltaY);
                    const alpha = Math.atan2(deltaY, deltaX);
                    const beta = alpha - degToRadian(image.rotateAngle);
                    const deltaW = (deltaL * Math.cos(beta)) / scale;
                    const deltaH = (deltaL * Math.sin(beta)) / scale;
                    let rotateAngle = image.rotateAngle;

                    let {
                        position: { centerX, centerY },
                        size: { width, height }
                    } = getNewStyle(
                        type,
                        { ...rect, rotateAngle },
                        deltaW,
                        deltaH,
                        ratio,
                        10,
                        10
                    );

                    let style = centerToTL({ centerX, centerY, width, height, rotateAngle });

                    this.handleResize(
                        style,
                        type,
                        editorStore.idObjectSelected,
                        cursor,
                        image.type,
                        ratio,
                    );
                },
                null,
                () => {
                    this.displayResizers(true);
                    this.handleResizeEnd();
                    this.pauser.next(false);
                    this.forceUpdate();
                    ell.style.zIndex = "0";
                    ell.style.cursor = "default";

                    if (window.resized) {
                        this.saving = setTimeout(() => {
                            this.saveImages(null, false);
                        }, 5000);
                    }
                }
            );
    };

    handleResizeEnd = () => {

        if (window.cloneImages) {
            window.cloneImages.forEach(imageTransformed => {
                let el0 = document.getElementById(imageTransformed._id + "guide_0");
                let el1 = document.getElementById(imageTransformed._id + "guide_1");
                let el2 = document.getElementById(imageTransformed._id + "guide_2");
                let el3 = document.getElementById(imageTransformed._id + "guide_3");
                let el4 = document.getElementById(imageTransformed._id + "guide_4");
                let el5 = document.getElementById(imageTransformed._id + "guide_5");
                if (el0) el0.style.display = "none";
                if (el1) el1.style.display = "none";
                if (el2) el2.style.display = "none";
                if (el3) el3.style.display = "none";
                if (el4) el4.style.display = "none";
                if (el5) el5.style.display = "none";
            });
        }

        window.image.top = window.imageTop;
        window.image.left = window.imageLeft;
        window.image.width = window.imageWidth;
        window.image.height = window.imageHeight;
        window.image.imgWidth = window.imageimgWidth;
        window.image.imgHeight = window.imageimgHeight;
        window.image.posX = window.posX;
        window.image.posY = window.posY;
        window.image.scaleX = window.scaleX;
        window.image.scaleY = window.scaleY;
        window.image.origin_width = window.origin_width;
        window.image.origin_height = window.origin_height;
        window.image.document_object = window.document_object;

        if (window.image.type == TemplateType.TextTemplate) {
            window.image.document_object = window.image.document_object.map(doc => {
                if (doc._id == editorStore.childId) {
                    doc.selected = true;
                } else {
                    doc.selected = false;
                }
                return doc;
            })
        }

        editorStore.images2.set(editorStore.idObjectSelected, window.image);
        document.body.style.cursor = null;

        if (window.image.type == TemplateType.GroupedItem) {
            window.selections.forEach(sel => {
                let id = sel.attributes.iden.value;
                if (!id) return;

                let image2 = editorStore.images2.get(id);
                image2.selected = false;
                image2.left = window.selectionsAngle[id].left;
                image2.top = window.selectionsAngle[id].top;
                image2.width = window.selectionsAngle[id].width;
                image2.height = window.selectionsAngle[id].height;
                image2.imgWidth = window.selectionsAngle[id].imgWidth;
                image2.imgHeight = window.selectionsAngle[id].imgHeight;
                image2.posX = window.selectionsAngle[id].posX;
                image2.posY = window.selectionsAngle[id].posY;
                image2.scaleX = window.selectionsAngle[id].scaleX;
                image2.scaleY = window.selectionsAngle[id].scaleY;
                editorStore.images2.set(id, image2);
                this.updateGuide(image2);
                this.updateImages(id, image2.page, image2, true);
            });
        }

        this.updateImages(editorStore.idObjectSelected, editorStore.pageId, window.image, true);
        this.updateGuide(window.image);
    };

    switching = false;

    handleResize = (
        style,
        type,
        _id,
        cursor,
        objectType,
        ratio,
    ) => {
        const { 
            scale, 
            cropMode, 
            childId,
        } = this.state;
        let { top, left, width, height } = style;
        let switching = false;
        let image = window.image;
        let deltaLeft = left - image.left;
        let deltaTop = top - image.top;
        let deltaWidth = image.width - width;
        let deltaHeight = image.height - height;
        let {imgWidth, imgHeight, posX, posY} = image;
        if (ratio) {
            imgWidth -= image.imgWidth / image.width * deltaWidth;
            imgHeight -= image.imgHeight / image.height * deltaHeight;
        }

        if (cropMode) {
            let t5 = false;
            let t8 = false;
            if (deltaWidth < image.posX && (type == "tl" || type == "bl")) {
                t5 = true;
                deltaLeft = image.posX;
                left = image.left + deltaLeft;
                width = image.width - deltaLeft;
                deltaWidth = image.width - width;

                const mark = type == "tl" ? 1 : -1;

                let {
                    position: { centerX, centerY },
                    size: { width: width2, height: height2 }
                } = getNewStyle(
                    type,
                    { ...window.rect, rotateAngle: image.rotateAngle },
                    deltaWidth,
                    mark * deltaHeight,
                    null,
                    10,
                    10
                );

                let style = centerToTL({ centerX, centerY, width: width2, height: height2, rotateAngle: 0, });
                    
                top = style.top;
                left = style.left;
            }

            let t6 = false;
            let t7 = false;
            if (
                image.imgHeight + image.posY - height < 0 &&
                (type == "bl" || type == "br")
            ) {
                t6 = true;
                height = image.imgHeight + image.posY;
                deltaHeight = image.height - height;
                
                const mark = type == "bl" ? 1 : -1;

                let {
                    position: { centerX, centerY },
                    size: { width: width2, height: height2 }
                } = getNewStyle(
                    type,
                    { ...window.rect, rotateAngle: image.rotateAngle },
                    mark * deltaWidth,
                    -deltaHeight,
                    null,
                    10,
                    10
                );

                let style = centerToTL({ centerX, centerY, width: width2, height: height2, rotateAngle: 0, });
                    
                top = style.top;
                left = style.left;
            }
            if (
                image.imgWidth + image.posX - width < 0 &&
                (type == "br" || type == "tr")
            ) {
                t7 = true;
                width = image.imgWidth + image.posX;
                deltaWidth = image.width - width;

                const mark = type == "tr" ? 1 : -1;

                let {
                    position: { centerX, centerY },
                    size: { width: width2, height: height2 }
                } = getNewStyle(
                    type,
                    { ...window.rect, rotateAngle: image.rotateAngle },
                    -deltaWidth,
                    mark * deltaHeight,
                    null,
                    10,
                    10
                );

                let style = centerToTL({ centerX, centerY, width: width2, height: height2, rotateAngle: 0, });
                    
                top = style.top;
                left = style.left;
            }

            if (deltaHeight < image.posY && (type == "tl" || type == "tr")) {
                t8 = true;
                deltaTop = image.posY;
                top = image.top + deltaTop;
                height = image.height - deltaTop;
                deltaHeight = image.height - height;

                let mark = type == "tl" ? 1 : -1;

                let {
                    position: { centerX, centerY },
                    size: { width: width2, height: height2 }
                } = getNewStyle(
                    type,
                    { ...window.rect, rotateAngle: image.rotateAngle },
                    mark * deltaWidth,
                    deltaHeight,
                    null,
                    10,
                    10
                );

                let style = centerToTL({ centerX, centerY, width: width2, height: height2, rotateAngle: 0, });
                    
                top = style.top;
                left = style.left;

            }

            if (t5 && t8 && type == "tl") {
                window.resizingInnerImage = true;
                
                let element = document.getElementById(_id + "tl_");
                if (element) {
                    let bcr = element.getBoundingClientRect();
                    window.startX = bcr.left + 10;
                    window.startY = bcr.top + 10;
                }
                switching = true;
            }

            if (t5 && t6 && type == "bl") {
                window.resizingInnerImage = true;
                window.startX =
                    document.getElementById(_id + "bl_").getBoundingClientRect().left +
                    10;
                window.startY =
                    document.getElementById(_id + "bl_").getBoundingClientRect().top + 10;
                switching = true;
            }

            if (t6 && t7 && type == "br") {
                window.resizingInnerImage = true;
                window.startX = document.getElementById(_id + "br_").getBoundingClientRect().left + 10;
                window.startY = document.getElementById(_id + "br_").getBoundingClientRect().top + 10;
                switching = true;
            }

            if (t8 && t7 && type == "tr") {
                window.resizingInnerImage = true;
                window.startX = document.getElementById(_id + "tr_").getBoundingClientRect().left + 10;
                window.startY = document.getElementById(_id + "tr_").getBoundingClientRect().top + 10;
                switching = true;
            }
        }

        if (!cropMode && image.rotateAngle == 0 && window.cloneImages) {
            window.cloneImages.forEach(imageTransformed => {
                let el0 = document.getElementById(imageTransformed._id + "guide_0");
                let el1 = document.getElementById(imageTransformed._id + "guide_1");
                let el2 = document.getElementById(imageTransformed._id + "guide_2");
                let el3 = document.getElementById(imageTransformed._id + "guide_3");
                let el4 = document.getElementById(imageTransformed._id + "guide_4");
                let el5 = document.getElementById(imageTransformed._id + "guide_5");

                if (
                    (type == "tl" || type == "bl" || type == "l") && 
                    Math.abs(left - imageTransformed.x[0]) < RESIZE_OFFSET
                ) {
                    left = imageTransformed.x[0];
                    let deltaLeft = image.left - left;
                    width = image.width + deltaLeft;
                    deltaWidth = image.width - width;

                    if (type != "l")
                        imgWidth = image.imgWidth + deltaLeft / (image.width / image.imgWidth);

                    if (ratio) {
                        height = width / ratio;
                        if (type == "tl") top = image.top - deltaLeft / ratio;
                        imgHeight = imgWidth / (image.imgWidth / image.imgHeight);
                    }

                    if (el0) {
                        el0.style.display = "block";
                    }
                } 
                else if (
                    (type == "br" || type == "tr" || type == "r") && 
                    Math.abs(left + width - imageTransformed.x[0]) < RESIZE_OFFSET
                ) {
                    width = imageTransformed.x[0] - image.left;
                    deltaWidth = image.width - width;
                    if (type != "r")
                        imgWidth = image.imgWidth - deltaWidth / (image.width / image.imgWidth);
                    if (ratio) {
                        height = width / ratio;
                        imgHeight = imgWidth / (image.imgWidth / image.imgHeight);
                        if (type == "tr") top = image.top + deltaWidth / ratio;
                    }

                    if (el0) {
                        el0.style.display = "block";
                    }
                } else {
                    if (el0) {
                        el0.style.display = "none";
                    }
                }

                if (
                    (type == "tl" || type == "bl" || type == "l") && 
                    Math.abs(left - imageTransformed.x[1]) < RESIZE_OFFSET
                ) {
                    left = imageTransformed.x[1];
                    let deltaLeft = image.left - imageTransformed.x[1];
                    width = image.width + deltaLeft;
                    deltaWidth = image.width - width;
                    
                    if (type != "l")
                        imgWidth = image.imgWidth + deltaLeft / (image.width / image.imgWidth);

                    if (ratio) {
                        height = width / ratio;
                        if (type == "tl") top = image.top - deltaLeft / ratio;
                        imgHeight = imgWidth / (image.imgWidth / image.imgHeight);
                    }
                    
                    if (el1) {
                        el1.style.display = "block";
                    }
                } else if (
                    (type == "br" || type == "tr" || type == "r") && 
                    Math.abs(left + width - imageTransformed.x[1]) < RESIZE_OFFSET
                ) {
                    width = imageTransformed.x[1] - image.left;
                    deltaWidth = image.width - width;
                    if (type != "r")
                        imgWidth = image.imgWidth - deltaWidth / (image.width / image.imgWidth);
                    if (ratio) {
                        height = width / ratio;
                        imgHeight = imgWidth / (image.imgWidth / image.imgHeight);
                        if (type == "tr") top = image.top + deltaWidth / ratio;
                    }
                    
                    if (el1) {
                        el1.style.display = "block";
                    }
                } else {
                    if (el1) {
                        el1.style.display = "none";
                    }
                }

                if (
                    (type == "tl" || type == "bl" || type == "l") &&
                    Math.abs(left - imageTransformed.x[2]) < RESIZE_OFFSET
                ) {
                    left = imageTransformed.x[2];
                    let deltaLeft = image.left - imageTransformed.x[2];
                    width = image.width + deltaLeft;
                    deltaWidth = image.width - width;
                    
                    if (type != "l")
                        imgWidth = image.imgWidth + deltaLeft / (image.width / image.imgWidth);

                    if (ratio) {
                        height = width / ratio;
                        if (type == "tl") top = image.top - deltaLeft / ratio;
                        imgHeight = imgWidth / (image.imgWidth / image.imgHeight);
                    }
                    
                    if (el2) {
                        el2.style.display = "block";
                    }
                } else if (
                    (type == "tr" || type == "br" || type == "r") &&
                    Math.abs(left + width - imageTransformed.x[2]) < RESIZE_OFFSET
                ) {
                    width = imageTransformed.x[2] - image.left;
                    deltaWidth = image.width - width;
                    if (type != "r")
                        imgWidth = image.imgWidth - deltaWidth / (image.width / image.imgWidth);
                    if (ratio) {
                        height = width / ratio;
                        imgHeight = imgWidth / (image.imgWidth / image.imgHeight);
                        if (type == "tr") top = image.top + deltaWidth / ratio;
                    }
                    
                    if (el2) {
                        el2.style.display = "block";
                    }
                } else {
                    if (el2) {
                        el2.style.display = "none";
                    }
                }

                if (
                    (type == "tl" || type == "tr" || type == "t") &&
                    Math.abs(top - imageTransformed.y[0]) < RESIZE_OFFSET
                ) {
                    top = imageTransformed.y[0];
                    let deltaTop = image.top - top;
                    height = image.height + deltaTop;
                    deltaHeight = image.height - height;

                    if (type != "t")
                        imgHeight = image.imgHeight + deltaTop / (image.height / image.imgHeight);

                    if (ratio) {
                        width = height * ratio;
                        if (type == "tl") left = image.left - deltaTop * ratio;
                        imgWidth = imgHeight / (image.imgHeight / image.imgWidth);
                    }
                    
                    if (el3) {
                        el3.style.display = "block";
                    }
                } else if (
                    (type == "bl" || type == "br" || type == "b") &&
                    Math.abs(top + height - imageTransformed.y[0]) < RESIZE_OFFSET
                ) {
                    height = imageTransformed.y[0] - image.top;
                    deltaHeight = image.height - height;
                    if (type != "b")
                        imgHeight = image.imgHeight - deltaHeight / (image.height / image.imgHeight);
                    if (ratio) {
                        width = height * ratio;
                        imgWidth = imgHeight / (image.imgHeight / image.imgWidth);
                        if (type == "bl") left = image.left + deltaHeight * ratio;
                    }
                    if (el3) {
                        el3.style.display = "block";
                    }
                } else {
                    if (el3) {
                        el3.style.display = "none";
                    }
                }

                if (
                    (type == "tl" || type == "tr" || type == "t") &&
                    Math.abs(top - imageTransformed.y[1]) < RESIZE_OFFSET
                ) {
                    top = imageTransformed.y[1];
                    let deltaTop = image.top - top;
                    height = image.height + deltaTop;
                    deltaHeight = image.height - height;

                    if (type != "t")
                        imgHeight = image.imgHeight + deltaTop / (image.height / image.imgHeight);

                    if (ratio) {
                        width = height * ratio;
                        if (type == "tl") left = image.left - deltaTop * ratio;
                        imgWidth = imgHeight / (image.imgHeight / image.imgWidth);
                    }
                    
                    if (el4) {
                        el4.style.display = "block";
                    }
                } else if (
                    (type == "bl" || type == "br" || type == "b") &&
                    Math.abs(top + height - imageTransformed.y[1]) < RESIZE_OFFSET
                ) { 
                    height = imageTransformed.y[1] - image.top;
                    deltaHeight = image.height - height;
                    if (type != "b")
                        imgHeight = image.imgHeight - deltaHeight / (image.height / image.imgHeight);
                    if (ratio) {
                        width = height * ratio;
                        imgWidth = imgHeight / (image.imgHeight / image.imgWidth);
                        if (type == "bl") left = image.left + deltaHeight * ratio;
                    }

                    if (el4) {
                        el4.style.display = "block";
                    }
                } else {
                    if (el4) {
                        el4.style.display = "none";
                    }
                }

                if (
                    (type == "tl" || type == "tr" || type == "t") &&
                    Math.abs(top - imageTransformed.y[2]) < RESIZE_OFFSET
                ) {
                    top = imageTransformed.y[2];
                    let deltaTop = image.top - top;
                    height = image.height + deltaTop;
                    deltaHeight = image.height - height;

                    if (type != "t")
                        imgHeight = image.imgHeight + deltaTop / (image.height / image.imgHeight);

                    if (ratio) {
                        width = height * ratio;
                        if (type == "tl") left = image.left - deltaTop * ratio;
                        imgWidth = imgHeight / (image.imgHeight / image.imgWidth);
                    }
                    
                    if (el5) {
                        el5.style.display = "block";
                    }
                } else if (
                    (type == "bl" || type == "br" || type == "b") &&
                    Math.abs(top + height - imageTransformed.y[2]) < RESIZE_OFFSET
                ) {  
                    height = imageTransformed.y[2] - image.top;
                    deltaHeight = image.height - height;
                    if (type != "b")
                        imgHeight = image.imgHeight - deltaHeight / (image.height / image.imgHeight);
                    if (ratio) {
                        width = height * ratio;
                        imgWidth = imgHeight / (image.imgHeight / image.imgWidth);
                        if (type == "bl") left = image.left + deltaHeight * ratio;
                    }
                    if (el5) {
                        el5.style.display = "block";
                    }
                } else {
                    if (el5) {
                        el5.style.display = "none";
                    }
                }
            });
        }

        if ((objectType === TemplateType.Image || objectType === TemplateType.Video) && !cropMode) {
            const scaleLeft = image.posX / image.imgWidth;
            const scaleTop = image.posY / image.imgHeight;
            const ratio = image.imgWidth / image.imgHeight;

            if (type == "r") {
                if (width - image.posX > image.imgWidth) {
                    const newDeltaWidth = width - image.posX - image.imgWidth;
                    imgWidth = image.imgWidth + newDeltaWidth;
                    imgHeight = imgWidth / ratio;
                    let scaleHeight = imgHeight / image.imgHeight;
                    let newHeight = image.height * scaleHeight;
                    posY = image.posY / image.imgHeight * imgHeight - (newHeight - image.height) / 2;
                }
            } else if (type == "l") {
                posX = image.posX - deltaWidth;
                if (posX > 0) {
                    imgWidth = image.imgWidth + posX;
                    imgHeight = imgWidth / ratio;
                    let scaleHeight = imgHeight / image.imgHeight;
                    let newHeight = image.height * scaleHeight;
                    posY = image.posY / image.imgHeight * imgHeight - (newHeight - image.height) / 2;
                    posX = 0;
                }
            } else if (type == "t") {
                posY = image.posY - deltaHeight;
                if (posY > 0) {
                    imgHeight = image.imgHeight  + posY;
                    imgWidth = imgHeight * ratio;
                    let scaleWidth = imgWidth / image.imgWidth;
                    let newWidth = image.width * scaleWidth;
                    posX = image.posX / image.imgWidth * imgWidth - (newWidth - image.width) / 2;
                    posY = 0;
                }
            } else if (type == "b") {
                if (height - image.posY > image.imgHeight) {
                    const newDeltaHeight = height - image.posY - image.imgHeight;
                    imgHeight = image.imgHeight + newDeltaHeight;
                    imgWidth = imgHeight * ratio;
                    let scaleWidth = imgWidth / image.imgWidth;
                    let newWidth = image.width * scaleWidth;
                    posX = image.posX / image.imgWidth * imgWidth - (newWidth - image.width) / 2;
                }
            } else {
                posX = scaleLeft * imgWidth;
                posY = scaleTop * imgHeight;
            }

            let el = document.getElementById(_id + "1235alo");
            if (el) {
                el.style.width = imgWidth * scale + "px";
                el.style.height = imgHeight * scale + "px";
            }

            el = document.getElementById(_id + "1238alo");
            if (el) {
                el.style.width = imgWidth * scale + "px";
                el.style.height = imgHeight * scale + "px";
            }
        }

        if ((objectType === TemplateType.Image || objectType == TemplateType.Video) && cropMode) {
            if (type == "tl" || type == "bl") {
                posX += width - image.width;
            }
            if (type == "tl" || type == "tr") {
                posY += height - image.height;
            }
        }

        window.imageTop = top;
        window.imageLeft = left;
        window.imageWidth = width;
        window.imageHeight = height;
        window.imageimgWidth = imgWidth;
        window.imageimgHeight = imgHeight;
        window.posX = posX;
        window.posY = posY;
        window.scaleX = image.scaleX;
        window.scaleY = image.scaleY;
        window.origin_width = image.origin_width;
        window.origin_height = image.origin_height;
        window.document_object = image.document_object;

        if (cursor != "e" && cursor != "w") {

            window.scaleX = width / image.origin_width;
            window.scaleY = height / image.origin_height;

            if (objectType === TemplateType.Heading) {
                (document.getElementById("fontSizeButton") as HTMLInputElement).value = `${Math.round(image.fontSize * window.scaleY)}`;
            } else if (objectType === TemplateType.TextTemplate && childId) {
                let text = image.document_object.find(text => text._id === childId);
                (document.getElementById("fontSizeButton") as HTMLInputElement).value = `${Math.round(text.fontSize * text.scaleY * window.scaleY)}`;
            }

            if (objectType == TemplateType.Heading || objectType == TemplateType.TextTemplate) {
                let rectalos = document.getElementsByClassName(_id + "scaleX-scaleY");
                for (let i = 0; i < rectalos.length; ++i) {
                    let cur: any = rectalos[i];
                    cur.style.transform = `scaleX(${window.scaleX}) scaleY(${window.scaleY})`;
                    cur.style.width = `calc(100%/${window.scaleX})`;
                    cur.style.height = `calc(100%/${window.scaleY})`;
                }
            }
        } else {
            if (objectType == TemplateType.Heading) {
                let el = document.getElementsByClassName(_id + "hihi4alo")[0] as HTMLElement;
                let newHeight = el.offsetHeight * image.scaleY;
                height = newHeight;
                deltaHeight = image.height - newHeight;
                window.imageHeight = height;

                let {
                    position: { centerX, centerY },
                    size: { width: width2, height: height2 }
                } = getNewStyle(
                    cursor == "e" ? "br" : "bl",
                    { ...window.rect, rotateAngle: image.rotateAngle },
                    (cursor == "e" ? -1 : 1 ) * deltaWidth,
                    -deltaHeight,
                    null,
                    10,
                    10
                );

                let style = centerToTL({ centerX, centerY, width: width2, height: height2, rotateAngle: 0, });
                top = style.top;
                left = style.left;
                window.imageLeft = left;
                window.imageTop = top;

            } else if (objectType == TemplateType.TextTemplate) {
                let maxHeight = 0;
                
                image.document_object.map(text => {
                    let textContainer2 = document.getElementById(_id + text._id + "text-container2alo") as HTMLElement;
                    let textEl = textContainer2.getElementsByClassName("text")[0] as HTMLElement;
                    textContainer2.style.width = (width * text.width2) / image.scaleX * scale + "px";
                    textEl.style.width = (width * text.width2) / image.scaleX / text.scaleX + "px";
                });

                let texts = image.document_object.map(text => {
                    const h = document.getElementById(_id + text._id + "alo").offsetHeight * text.scaleY;
                    maxHeight = Math.max(maxHeight, h + text.top);
                    text.height = h;
                    return text;
                });

                texts = texts.map(text => {
                    text.height2 = text.height / maxHeight;
                    return text;
                });

                let newDocumentObjects = [];
                for (let i = 0; i < texts.length; ++i) {
                    let d = texts[i];
                    if (!d.ref) {
                        newDocumentObjects.push(
                            ...this.normalize2(
                                d,
                                texts,
                                image.scaleX,
                                image.scaleY,
                                scale,
                                image.width,
                                image.height
                            )
                        );
                    }
                }

                newDocumentObjects = newDocumentObjects.map(text => {
                    let els = document.getElementsByClassName(_id + text._id + "b2");
                    for (let i = 0; i < els.length; ++i) {
                        let el = els[i] as HTMLElement;
                        el.style.height = `calc(${text.height2 * 100}% + 2px)`
                        el.style.left = `calc(${text.left/width * image.scaleX *100}% - 1px)`;
                        el.style.top = `calc(${text.top/(text.height / text.height2)*100}% - 1px)`;
                    }

                    let childEl = document.getElementById(_id + text._id + "text-container2alo") as HTMLElement;
                    childEl.style.left = text.left * scale + "px";
                    childEl.style.top = text.top * scale + "px";
                    return text;
                });

                height = maxHeight * image.scaleY;
                image.document_object = newDocumentObjects;
                window.document_object = newDocumentObjects;
                window.imageHeight = height;

                deltaHeight = image.height - height;

                let {
                    position: { centerX, centerY },
                    size: { width: width2, height: height2 }
                } = getNewStyle(
                    cursor == "e" ? "br" : "bl",
                    { ...window.rect, rotateAngle: image.rotateAngle },
                    (cursor == "e" ? -1 : 1 ) * deltaWidth,
                    -deltaHeight,
                    null,
                    10,
                    10
                );

                let style = centerToTL({ centerX, centerY, width: width2, height: height2, rotateAngle: 0, });
                top = style.top;
                left = style.left;
                window.imageLeft = left;
                window.imageTop = top;
            }
            window.origin_width = width / window.scaleX;
            window.origin_height = height / window.scaleY;
        }

        let a = document.getElementsByClassName(_id + "aaaaalo");
        for (let i = 0; i < a.length; ++i) {
            let tempEl = a[i] as HTMLElement;
            tempEl.style.width = width * scale + "px";
            tempEl.style.height = height * scale + "px";
            tempEl.style.transform = `translate(${left * scale}px, ${top * scale}px) rotate(${image.rotateAngle ? image.rotateAngle : 0}deg)`;
        } 
        
        let b = document.getElementsByClassName(_id + "1236");
        for (let i = 0; i < b.length; ++i) {
            let tempEl = b[i] as HTMLElement;
            tempEl.style.transform = `translate(${posX * scale}px, ${posY * scale}px)`;
        }

        if (objectType === TemplateType.Heading) {
            let hihi4s = document.getElementsByClassName(_id + "hihi4alo");
            for (let i = 0; i < hihi4s.length; ++i) {
                let el = hihi4s[i] as HTMLElement;
                el.style.width = width / window.scaleX + "px";
            }
        }

        if (objectType == TemplateType.GroupedItem) {
            window.selections.forEach(sel => {
                let id = sel.attributes.iden.value;
                if (!id) return;

                let image2 = editorStore.images2.get(id);

                let centerX = image2.left + image2.width / 2;
                let centerY = image2.top + image2.height / 2;
                let rotateAngle = image2.rotateAngle / 180 * Math.PI;

                let p = 
                {
                    x: (image2.left - centerX) * Math.cos(rotateAngle) - (image2.top - centerY) * Math.sin(rotateAngle) + centerX,
                    y: (image2.left - centerX) * Math.sin(rotateAngle) + (image2.top - centerY) * Math.cos(rotateAngle) + centerY,
                }

                let deltaLeft = p.x - image.left;
                let deltaTop = p.y - image.top;
                let ratioWidth = deltaLeft / image.width;
                let ratioHeight = deltaTop / image.height
                let left1 = left + ratioWidth * width;
                let top1 = top + ratioHeight * height;

                p = 
                {
                    x: (image2.left + image2.width - centerX) * Math.cos(rotateAngle) - (image2.top - centerY) * Math.sin(rotateAngle) + centerX,
                    y: (image2.left + image2.width - centerX) * Math.sin(rotateAngle) + (image2.top - centerY) * Math.cos(rotateAngle) + centerY,
                }

                deltaLeft = p.x - image.left;
                deltaTop = p.y - image.top;
                ratioWidth = deltaLeft / image.width;
                ratioHeight = deltaTop / image.height
                let left2 = left + ratioWidth * width;
                let top2 = top + ratioHeight * height;

                p = 
                {
                    x: (image2.left + image2.width - centerX) * Math.cos(rotateAngle) - (image2.top + image2.height - centerY) * Math.sin(rotateAngle) + centerX,
                    y: (image2.left + image2.width - centerX) * Math.sin(rotateAngle) + (image2.top + image2.height - centerY) * Math.cos(rotateAngle) + centerY,
                }

                deltaLeft = p.x - image.left;
                deltaTop = p.y - image.top;
                ratioWidth = deltaLeft / image.width;
                ratioHeight = deltaTop / image.height
                let left3 = left + ratioWidth * width;
                let top3 = top + ratioHeight * height;

                p = 
                {
                    x: (image2.left - centerX) * Math.cos(rotateAngle) - (image2.top + image2.height - centerY) * Math.sin(rotateAngle) + centerX,
                    y: (image2.left - centerX) * Math.sin(rotateAngle) + (image2.top + image2.height- centerY) * Math.cos(rotateAngle) + centerY,
                }

                deltaLeft = p.x - image.left;
                deltaTop = p.y - image.top;
                ratioWidth = deltaLeft / image.width;
                ratioHeight = deltaTop / image.height
                let left4 = left + ratioWidth * width;
                let top4 = top + ratioHeight * width;

                let newWidth = image2.width / image.width * width;
                let newHeight = image2.height / image.height * height;

                let newCenterX = (left1 + left3) / 2;
                let newCenterY = (top1 + top3) / 2;
                let newLeft = newCenterX - newWidth / 2;
                let newTop = newCenterY - newHeight / 2;

                let a = document.getElementsByClassName(image2._id + "aaaaalo");
                for (let i = 0; i < a.length; ++i) {
                    let tempEl = a[i] as HTMLElement;
                    tempEl.style.width = newWidth * scale + "px";
                    tempEl.style.height = newHeight * scale + "px";
                    tempEl.style.transform = `translate(${newLeft * scale}px, ${newTop * scale}px) rotate(${image2.rotateAngle ? image2.rotateAngle : 0}deg)`;
                }

                let newImgWidth = image2.imgWidth / image.width * width;
                let newImgHeight = image2.imgHeight / image.height * height;
                let newPosX = image2.posX / image.width * width;
                let newPosY = image2.posY / image.height * height;

                let el = document.getElementById(image2._id + "1235alo");
                if (el) {
                    el.style.width = newImgWidth * scale + "px";
                    el.style.height = newImgHeight * scale + "px";
                    el.style.transform = `translate(${newPosX * scale}px, ${newPosY * scale}px)`;
                }

                let newScaleX = image2.scaleX;
                let newScaleY = image2.scaleY;
                if (image2.type == TemplateType.Heading || image2.type == TemplateType.TextTemplate) {
                    let el2 = document.getElementById(image2._id + "654alo");
                    if (el2) {

                        newScaleX = newWidth / image2.origin_width;
                        newScaleY = newHeight / image2.origin_height;

                        el2.style.width = `calc(100%/${newScaleX})`;
                        el2.style.height = `calc(100%/${newScaleY})`;
                        el2.style.transform = `scaleX(${newScaleX}) scaleY(${newScaleY})`;
                    }
                }

                window.selectionsAngle[image2._id] = {
                    left: newLeft,
                    top: newTop,
                    width: newWidth,
                    height: newHeight,
                    posX: newPosX,
                    posY: newPosY,
                    imgWidth: newImgWidth,
                    imgHeight: newImgHeight,
                    scaleX: newScaleX,
                    scaleY: newScaleY,
                }
            });
        }

        if (switching) {
            window.image.top = window.imageTop;
            window.image.left = window.imageLeft;
            window.image.width = window.imageWidth;
            window.image.height = window.imageHeight;
            window.image.imgWidth = window.imageimgWidth;
            window.image.imgHeight = window.imageimgHeight;
            window.image.posX = window.posX;
            window.image.posY = window.posY;
            window.image.scaleX = window.scaleX;
            window.image.scaleY = window.scaleY;
            window.image.origin_width = window.origin_width;
            window.image.origin_height = window.origin_height;
            window.image.document_object = window.document_object;

            const styles = tLToCenter({
                top: top,
                left: left,
                width: width,
                height: height,
                rotateAngle: image.rotateAngle
            });
            const imgStyles = tLToCenter({
                left: posX,
                top: posY,
                width: imgWidth,
                height: imgHeight,
                rotateAngle: 0
            });


            window.rect = {
                width: width,
                height: height,
                centerX: styles.position.centerX,
                centerY: styles.position.centerY,
                rotateAngle: image.rotateAngle
            };
            window.rect2 = {
                width: imgWidth,
                height: imgHeight,
                centerX: imgStyles.position.centerX,
                centerY: imgStyles.position.centerY,
                rotateAngle: 0
            };
        }
    };

    handleResizeInnerImageStart = (e, d) => {

        window.resized = false;
        this.cancelSaving();

        this.popuplateImageProperties(editorStore.idObjectSelected);

        window.resizingInnerImage = true;
        window.startX = e.clientX;
        window.startY = e.clientY;
        this.pauser.next(true);

        let cursor = e.target.id;
        let type = e.target.getAttribute("class").split(" ")[0];
        let { scale } = this.state;
        const location$ = this.handleDragRx(e.target);

        let image = editorStore.images2.get(editorStore.idObjectSelected);
        window.image = clone(image);
        let {
            top: top2,
            left: left2,
            width: width2,
            height: height2,
            imgWidth: width3,
            imgHeight: height3,
            posX: left3,
            posY: top3
        } = image;

        const rect2 = tLToCenter({
            top: top2,
            left: left2,
            width: width2,
            height: height2,
            rotateAngle: 0,
        });

        const rect3 = tLToCenter({
            top: top3,
            left: left3,
            width: width3,
            height: height3,
            rotateAngle: 0
        });

        window.rect = {
            width: image.width,
            height: image.height,
            centerX: rect2.position.centerX,
            centerY: rect2.position.centerY,
            rotateAngle: image.rotateAngle
        };
        window.rect2 = {
            width: image.imgWidth,
            height: image.imgHeight,
            centerX: rect3.position.centerX,
            centerY: rect3.position.centerY,
            rotateAngle: 0,
        };

        let cursorStyle = getCursorStyleForResizer(image.rotateAngle, d);

        let ell = document.getElementById("screen-container-parent2");
        ell.style.zIndex = "2";
        ell.style.cursor = cursorStyle;

        this.temp = location$
            .pipe(
                map(([x, y]) => ({
                    moveElLocation: [x, y]
                }))
            )
            .subscribe(
                ({ moveElLocation }) => {
                    window.resized = true;
                    this.displayResizers(false);
                    this.setSavingState(SavingState.UnsavedChanges, false);

                    let deltaX = moveElLocation[0] - window.startX;
                    let deltaY = moveElLocation[1] - window.startY;
                    const deltaL = getLength(deltaX, deltaY);
                    const alpha = Math.atan2(deltaY, deltaX);
                    const beta = alpha - degToRadian(image.rotateAngle);
                    const deltaW = (deltaL * Math.cos(beta)) / scale;
                    const deltaH = (deltaL * Math.sin(beta)) / scale;
                    let rotateAngle = image.rotateAngle;

                    if (!window.resizingInnerImage) {
                        let {
                            position: { centerX, centerY },
                            size: { width, height }
                        } = getNewStyle(
                            type,
                            { ...window.rect, rotateAngle },
                            deltaW,
                            deltaH,
                            null,
                            10,
                            10
                        );
                        let style = centerToTL({ centerX, centerY, width, height, rotateAngle });
                        this.handleResize(
                            style,
                            type,
                            editorStore.idObjectSelected,
                            cursor,
                            image.type,
                            null,
                        );
                    } else {
                        let ratio = image.imgWidth / image.imgHeight;
                        let {
                            position: { centerX, centerY },
                            size: { width, height }
                        } = getNewStyle(
                            type,
                            { ...window.rect2},
                            deltaW,
                            deltaH,
                            ratio,
                            10,
                            10
                        );
                        let style = centerToTL({ centerX, centerY, width, height, rotateAngle: 0 });

                        this.handleImageResize(
                            style,
                            type,
                            editorStore.idObjectSelected,
                        );
                    }
                },
                null,
                () => {
                    this.handleResizeEnd();
                    this.pauser.next(false);
                    this.displayResizers(true);
                    ell.style.zIndex = "0";

                    if (window.resized) {
                        this.saving = setTimeout(() => {
                            this.saveImages(null, false);
                        }, 5000);
                    }
                }
            );
    };

    // Handle the actual miage
    handleImageResize = (
        style,
        type,
        _id,
    ) => {
        let switching;
        const { scale } = this.state;
        let { left: posX, top: posY, width: imageimgWidth, height: imageimgHeight } = style;
        let image = window.image;
        const ratio = image.imgWidth / image.imgHeight;
        if (
            image.height - posY - imageimgHeight > 0 &&
            image.width - posX - imageimgWidth > 0 &&
            type == "br"
        ) {
            let el = document.getElementById(_id + type);
            if (el) {
                let rect = document.getElementById(_id + type).getBoundingClientRect();
                window.resizingInnerImage = false;
                window.startX = rect.left + 10;
                window.startY = rect.top + 10;
                switching = true;
            }
            const deltaX = image.imgWidth - image.width + image.posX;
            const deltaY = image.imgHeight - image.height + image.posY;
            if (deltaX / deltaY > ratio) {
                const delta = deltaY;
                imageimgHeight = image.imgHeight - delta / ratio;
                imageimgWidth = image.imgWidth - delta;
            } else {
                const delta = deltaX;
                imageimgHeight = image.imgHeight - delta / ratio;
                imageimgWidth = image.imgWidth - delta;
            }
        } else if (
            image.height - posY > imageimgHeight &&
            posX <= 0 &&
            (type == "bl" || type == "br")
        ) {
            let el = document.getElementById(_id + type);
            if (el) {
                let rect = document.getElementById(_id + type).getBoundingClientRect();
                window.resizingInnerImage = false;
                window.startX = rect.left + 10;
                window.startY = rect.top + 10;
                switching = true;
            }
            const deltaY = image.imgHeight - image.height + image.posY;
            imageimgWidth = image.imgWidth - deltaY * ratio;
            imageimgHeight = image.imgHeight - deltaY;
            if (type == "bl") {
                posX = image.posX + deltaY * ratio;
            }
        } else if (image.height - posY > imageimgHeight && posX > 0 && type == "bl") {
            let el = document.getElementById(_id + type);
            if (el) {
                let rect = document.getElementById(_id + type).getBoundingClientRect();
                window.resizingInnerImage = false;
                window.startX = rect.left + 10;
                window.startY = rect.top + 10;
                switching = true;
            }
            const deltaX = Math.abs(-image.posX);
            const deltaY = image.imgHeight - image.height + image.posY;
            if (deltaX / deltaY > ratio) {
                const delta = deltaY;
                imageimgHeight = image.imgHeight - delta / ratio;
                imageimgWidth = image.imgWidth - delta;
                posX = image.posX + delta * ratio;
            } else {
                const delta = deltaX;
                imageimgHeight = image.imgHeight - delta / ratio;
                imageimgWidth = image.imgWidth - delta;
                posX = 0;
            }
        } else if (
            image.width - posX > imageimgWidth &&
            posY <= 0 &&
            (type == "tr" || type == "br")
        ) {
            let el = document.getElementById(_id + type);
            if (el) {
                let rect = document.getElementById(_id + type).getBoundingClientRect();
                window.resizingInnerImage = false;
                window.startX = rect.left + 10;
                window.startY = rect.top + 10;
                switching = true;
            }

            const val = image.imgWidth - image.width + image.posX;
            imageimgWidth = image.imgWidth - val;
            imageimgHeight = image.imgHeight - val / ratio;
            if (type == "tr") {
                posY = image.posY + val / ratio;
            }
        } else if (image.width - posX > imageimgWidth && posY > 0 && type == "tr") {
            let el = document.getElementById(_id + type);
            if (el) {
                let rect = document.getElementById(_id + type).getBoundingClientRect();
                window.resizingInnerImage = false;
                window.startX = rect.left + 10;
                window.startY = rect.top + 10;
                switching = true;
            }
            const deltaX = image.imgWidth - image.width + image.posX;
            const deltaY = Math.abs(-image.posY);
            if (deltaX / deltaY > ratio) {
                const delta = deltaY;
                imageimgHeight = image.imgHeight - delta / ratio;
                imageimgWidth = image.imgWidth - delta;
                posY = 0;
            } else {
                const delta = deltaX;
                imageimgHeight = image.imgHeight - delta / ratio;
                imageimgWidth = image.imgWidth - delta;
                posY = image.posY + delta / ratio;
            }

        } else if (posY > 0 && posX <= 0 && (type == "tl" || type == "tr")) {
            let el = document.getElementById(_id + type);
            if (el) {
                let rect = document.getElementById(_id + type).getBoundingClientRect();
                window.resizingInnerImage = false;
                window.startX = rect.left + 10;
                window.startY = rect.top + 10;
                switching = true;
            }

            const deltaY = -image.posY;
            imageimgHeight = image.imgHeight - deltaY;
            imageimgWidth = image.imgWidth - deltaY * ratio;
            posY = 0;
            if (type == "tl") {
                posX = image.posX + deltaY * ratio;
            }
        } else if (posX > 0 && posY <= 0 && (type == "tl" || type == "bl")) {
            let el = document.getElementById(_id + type);
            if (el) {
                let rect = document.getElementById(_id + type).getBoundingClientRect();
                window.resizingInnerImage = false;
                window.startX = rect.left + 10;
                window.startY = rect.top + 10;
                switching = true;
            } else {

            }
            const deltaX = -image.posX;
            imageimgWidth = image.imgWidth - deltaX;
            imageimgHeight = image.imgHeight - deltaX / ratio;
            if (type == "tl") {
                posY = image.posY + deltaX / ratio;
            }
            posX = 0;
        } else if (posX > 1 && posY > 1 && type == "tl") {
            let el = document.getElementById(_id + type);
            if (el) {
                let rect = document.getElementById(_id + type).getBoundingClientRect();
                window.resizingInnerImage = false;
                window.startX = rect.left + 10;
                window.startY = rect.top + 10;
                switching = true;
            }

            const deltaX = Math.abs(-image.posX);
            const deltaY = Math.abs(-image.posY);
            if (deltaX / deltaY > ratio) {
                const delta = deltaY;
                imageimgHeight = image.imgHeight - delta;
                imageimgWidth = image.imgWidth - delta * ratio;
                posX = image.posX + delta * ratio;
                posY = 0;
            } else {
                const delta = deltaX;
                imageimgHeight = image.imgHeight - delta / ratio;
                imageimgWidth = image.imgWidth - delta;
                posX = 0;
                posY = image.posY + delta / ratio;
            }
        }

        window.posX = posX;
        window.posY = posY;
        window.imageimgWidth = imageimgWidth;
        window.imageimgHeight = imageimgHeight;
        window.imageTop = image.top;
        window.imageLeft = image.left;
        window.imageWidth = image.width;
        window.imageHeight = image.height;
        window.scaleX = image.scaleX;
        window.scaleY = image.scaleY;
        window.origin_width = image.origin_width;
        window.origin_height = image.origin_height;

        let el = document.getElementsByClassName(_id + "1236");
        for (let i = 0; i < el.length; ++i) {
            let tempEl = el[i] as HTMLElement;
            tempEl.style.transform = `translate(${posX * scale}px, ${posY * scale}px)`;
            tempEl.style.width = imageimgWidth * scale + "px";
            tempEl.style.height = imageimgHeight * scale + "px";
        }

        if (switching) {
            this.handleResizeEnd();

            const styles = tLToCenter({
                top: window.imageTop,
                left: window.imageLeft,
                width: window.imageWidth,
                height: window.imageHeight,
                rotateAngle: image.rotateAngle
            });

            const imgStyles = tLToCenter({
                left: window.posX,
                top: window.posY,
                width: window.imageimgWidth,
                height: window.imageimgHeight,
                rotateAngle: 0
            });

            window.rect = {
                width: window.imageWidth,
                height: window.imageHeight,
                centerX: styles.position.centerX,
                centerY: styles.position.centerY,
                rotateAngle: image.rotateAngle
            };

            window.rect2 = {
                width: window.imageimgWidth,
                height: window.imageimgHeight,
                centerX: imgStyles.position.centerX,
                centerY: imgStyles.position.centerY,
                rotateAngle: 0
            };
        }
    };

    handleRotateStart = (e: any) => {

        window.rotated = false;
        this.cancelSaving();

        let scale = this.state.scale;
        e.stopPropagation();

        let image = editorStore.images2.get(editorStore.idObjectSelected);
        window.image = image;
        window.rotateAngle = image.rotateAngle;

        let tip = document.getElementById("helloTip");
        if (!tip) {
            tip = document.createElement("div");
        }
        tip.id = "helloTip";
        tip.style.position = "absolute";
        tip.style.height = "30px";
        tip.style.backgroundColor = "black";
        tip.style.top = e.clientY + 20 + "px";
        tip.style.left = e.clientX + 20 + "px";
        tip.style.zIndex = "2147483647";
        tip.style.color = "white";
        tip.style.textAlign = "center";
        tip.style.lineHeight = "30px";
        tip.style.borderRadius = "3px";
        tip.style.padding = "0 5px";
        tip.style.fontSize = "12px";
        tip.innerText = image.rotateAngle + "°";

        document.body.append(tip);

        const location$ = this.handleDragRx(e.target);

        const rect = document
            .getElementById(editorStore.idObjectSelected + "_alo")
            .getBoundingClientRect();
        const center = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
        const startVector = {
            x: e.clientX - center.x,
            y: e.clientY - center.y
        };

        this.pauser.next(true);

        let ell = document.getElementById("screen-container-parent2");
        ell.style.zIndex = "2";

        window.selectionsAngle = {};


        first()(location$).subscribe(v => {
            window.rotated = true;
            this.displayResizers(false);
            this.setSavingState(SavingState.UnsavedChanges, false);
        });

        this.temp = location$
            .pipe(
                map(([x, y]) => ({
                    moveElLocation: [x, y]
                }))
            )
            .subscribe(
                ({ moveElLocation }) => {
                    const rotateVector = {
                        x: moveElLocation[0] - center.x,
                        y: moveElLocation[1] - center.y
                    };
                    const angle = getAngle(startVector, rotateVector);

                    let rotateAngle = Math.round(image.rotateAngle + angle) % 360;
                    window.rotateAngle = Math.round(image.rotateAngle + angle);

                    let centerX = image.left + image.width / 2;
                    let centerY = image.top + image.height / 2;

                    if (image.type == TemplateType.GroupedItem) {
                        window.selections.forEach(sel => {
                            const id = sel.attributes.iden.value;
                            if (!id) return;
                            let image2 = clone(editorStore.images2.get(id));
                            if (!image2) return;
                            let angle = rotateAngle - image.rotateAngle;
                            let a = rotateRect(image2);
                            a = a.map(p => rotatePoint(p, angle, centerX, centerY));
                            let cX = (a[0].x + a[2].x) / 2;
                            let cY = (a[0].y + a[2].y) / 2;
                            let newLeft = cX - image2.width / 2;
                            let newTop = cY - image2.height / 2;
                            let newAngle = 180 + Math.atan2(a[0].y - a[1].y, a[0].x - a[1].x) * 180 / Math.PI;

                            let aa = document.getElementsByClassName(image2._id + "aaaaalo");
                            for (let i = 0; i < aa.length; ++i) {
                                let cur = aa[i] as HTMLElement;
                                cur.style.transform = `translate(${newLeft * scale}px, ${newTop* scale}px) rotate(${newAngle}deg)`;
                            }

                            window.selectionsAngle[image2._id] = {
                                rotateAngle: newAngle,
                                left: newLeft,
                                top: newTop,
                            };
                        })
                    }

                    let cursorStyle = getCursorStyleWithRotateAngle(rotateAngle);
                    ell.style.cursor = cursorStyle;

                    let a = document.getElementsByClassName(image._id + "aaaaalo");
                    for (let i = 0; i < a.length; ++i) {
                        let cur = a[i] as HTMLElement;
                        cur.style.transform = `translate(${image.left * scale}px, ${image.top * scale}px) rotate(${rotateAngle}deg)`;
                    }

                    let tip = document.getElementById("helloTip");
                    if (!tip) {
                        tip = document.createElement("div");
                    }
                    tip.id = "helloTip";
                    tip.style.position = "absolute";
                    tip.style.height = "30px";
                    tip.style.backgroundColor = "black";
                    tip.style.top = moveElLocation[1] + 20 + "px";
                    tip.style.left = moveElLocation[0] + 20 + "px";
                    tip.innerText = rotateAngle + "°";
                },
                null,
                () => {
                    this.displayResizers(true);
                    this.handleRotateEnd(editorStore.idObjectSelected);
                    this.pauser.next(false);
                    ell.style.zIndex = "0";

                    if (window.rotated) {
                        this.saving = setTimeout(() => {
                            this.saveImages(null, false);
                        }, 5000);
                    }
                }
            );
    };

    handleRotateEnd = (_id: string) => {
        let tip = document.getElementById("helloTip");
        if (!tip) {
            tip = document.createElement("div");
        }
        document.body.removeChild(tip);
        window.image.rotateAngle = window.rotateAngle;

        if (window.image.type == TemplateType.TextTemplate) {
            window.image.document_object = window.image.document_object.map(doc => {
                if (doc._id == editorStore.childId) {
                    doc.selected = true;
                } else {
                    doc.selected = false;
                }
                return doc;
            })
        }

        editorStore.images2.set(editorStore.idObjectSelected, window.image);
        this.updateImages(editorStore.idObjectSelected, editorStore.pageId, window.image, true);
        
        let image = window.image;
        let newL = image.left;
        let newR = image.left + image.width;
        let newT = image.top;
        let newB = image.top + image.height;
        let centerX = image.left + image.width / 2;
        let centerY = image.top + image.height / 2;
        let rotateAngle = image.rotateAngle / 180 * Math.PI;

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

        let top = 999999, right = 0, bottom = 0, left = 999999;

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

        const {scale} = this.state;
        document.getElementById(image._id + "guide_0").style.left = `${left * scale}px`;
        document.getElementById(image._id + "guide_1").style.left = `${(left + (right - left) / 2) * scale}px`;
        document.getElementById(image._id + "guide_2").style.left = `${right * scale}px`;
        document.getElementById(image._id + "guide_3").style.top = `${top * scale}px`;
        document.getElementById(image._id + "guide_4").style.top = `${(top + (bottom - top) / 2) * scale}px`;
        document.getElementById(image._id + "guide_5").style.top = `${bottom * scale}px`;
        

        if (window.image.type == TemplateType.GroupedItem) {
            window.selections.forEach(sel => {
                const id = sel.attributes.iden.value;
                if (!id || !window.selectionsAngle[id]) return;
                let image = editorStore.images2.get(id);
                image.rotateAngle = window.selectionsAngle[id].rotateAngle;
                image.left = window.selectionsAngle[id].left;
                image.top = window.selectionsAngle[id].top;
                image.selected = false;
                editorStore.images2.set(id, image);
                this.updateGuide(image);
                this.updateImages(id, image.page, image, true);
            });
        }

        // this.refreshActivePage();
    };

    refreshActivePage() {
        let index = editorStore.pages.findIndex(pageId => pageId == editorStore.activePageId);
        editorStore.keys[index] = editorStore.keys[index] + 1;
    }

    canvasRect = null;
    temp = null;

    handleDragStart = (e, _id) => {

        this.cancelSaving();

        window.startX = e.clientX;
        window.startY = e.clientY;
        window.dragged = false;
        const { scale } = this.state;

        let image = editorStore.images2.get(_id);
        window.startLeft = image.left * scale;
        window.startTop = image.top * scale;
        window.image = clone(toJS(image));
        window.posX = window.image.posX;
        window.posY = window.image.posY;
        window.imgWidth = window.image.imgWidth;
        window.imgHeight = window.image.imgHeight;

        window.selectionsAngle = {};

        this.pauser.next(true);

        const location$ = this.handleDragRx(e.target);

        let images = [];
        Array.from(editorStore.images2.values()).forEach(image => {
            if (image.page === window.image.page) {

                if (window.image.type != TemplateType.GroupedItem) {
                    let clonedImage = transformImage(clone(image));
                    images.push(clonedImage);
                } else if (!window.selectionIDs[image._id]) {
                    let clonedImage = transformImage(clone(image));
                    images.push(clonedImage);
                }
            }
        });

        window.cloneImages = images;

        first()(location$).subscribe(v => {
            this.displayResizers(false);
            this.setSavingState(SavingState.UnsavedChanges, false);
            window.dragged = true;
        });

        this.temp = location$
            .pipe(
                map(([x, y]) => ({
                    moveElLocation: [x, y]
                }))
            )
            .subscribe(
                ({ moveElLocation }) => {
                    if (this.state.cropMode) {
                        this.handleImageDrag(
                            editorStore.idObjectSelected,
                            moveElLocation[0],
                            moveElLocation[1]
                        );
                    } else {
                        this.handleDrag(
                            editorStore.idObjectSelected,
                            moveElLocation[0],
                            moveElLocation[1]
                        );
                    }
                },
                null,
                () => {
                    this.displayResizers(true);
                    this.pauser.next(false);

                    if (window.dragged) {
                        this.handleDragEnd();
                        this.saving = setTimeout(() => {
                            this.saveImages(null, false);
                        }, 5000);
                    }
                }
            );
    };

    tranformImage = (image: any) => {
        let newL = image.left;
        let newR = image.left + image.width;
        let newT = image.top;
        let newB = image.top + image.height;
        let centerX = image.left + image.width / 2;
        let centerY = image.top + image.height / 2;
        let rotateAngle = image.rotateAngle / 180 * Math.PI;

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
        let top = 999999, right = 0, bottom = 0, left = 999999;

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

        return {
            _id: image._id,
            x: [left, left + (right - left) / 2, right],
            y: [top, top + (bottom - top) / 2, bottom]
        };
    };

    handleImageDrag = (_id, clientX, clientY) => {
        const { scale } = this.state;

        let deltaX = clientX - window.startX;
        let deltaY = clientY - window.startY;

        let deg = degToRadian(window.image.rotateAngle);
        let newX = deltaY * Math.sin(deg) + deltaX * Math.cos(deg);
        let newY = deltaY * Math.cos(deg) - deltaX * Math.sin(deg);

        let newPosX = window.posX + newX / scale;
        let newPosY = window.posY + newY / scale;

        let img = window.image;
        if (newPosX > 0) {
            newPosX = 0;
        } else if (newPosX + img.imgWidth < img.width) {
            newPosX = img.width - img.imgWidth;
        }
        if (newPosY > 0) {
            newPosY = 0;
        } else if (newPosY + img.imgHeight < img.height) {
            newPosY = img.height - img.imgHeight;
        }
        img.posX = newPosX;
        img.posY = newPosY;

        let el = document.getElementsByClassName(_id + "1236");
        for (let i = 0; i < el.length; ++i) {
            let tempEl = el[i] as HTMLElement;
            tempEl.style.transform = `translate(${newPosX * scale}px, ${newPosY *
                scale}px)`;
        }
    };

    /**
     * Create an observable stream to handle drag gesture
     */
    drag = (element: HTMLElement, pan$: Observable<Event>): Observable<any> => {
        const panMove$ = pan$.pipe(filter((e: Event) => e.type == "mousemove"));
        const panEnd$ = pan$.pipe(filter((e: Event) => e.type == "mouseup"));

        return panMove$.pipe(
            map((e: any) => {
                e.preventDefault();
                // e.stopPropagation();
                let x = e.clientX;
                let y = e.clientY;
                let eventName = e.type;
                return { x, y, eventName };
            }),
            takeUntil(panEnd$),
        );
    };

    /**
     * Generate the drag handler for a DOM element
     */
    handleDragRx = (element: HTMLElement): Observable<any> => {
        const mouseMove$ = fromEvent(document, "mousemove");
        const mouseUp$ = fromEvent(document, "mouseup");

        const pan$: Observable<Event> = merge(mouseMove$, mouseUp$);

        const drag$ = this.drag(element, pan$);

        return drag$.pipe(map(({ x, y, eventName }) => [x, y, eventName]));
    };

    handleDrag = (_id, clientX, clientY): any => {
        const { scale } = this.state;
        let newLeft, newTop;
        let newLeft2, newTop2;
        let newLeft3, newTop3;
        let centerX, centerY;
        let left, top;
        let img;
        let updateStartPosX = false;
        let updateStartPosY = false;
        let image = window.image;
        newLeft = (clientX - window.startX + window.startLeft) / scale;
        newTop = (clientY - window.startY + window.startTop) / scale;

        let newL = newLeft;
        let newR = newL + image.width;
        let newT = newTop;
        let newB = newT + image.height;
        let centerXX = newLeft + image.width / 2;
        let centerYY = newTop + image.height / 2;
        let rotateAngle = image.rotateAngle / 180 * Math.PI;

        let bb = [
            {
                x: (newL - centerXX) * Math.cos(rotateAngle) - (newT - centerYY) * Math.sin(rotateAngle) + centerXX,
                y: (newL - centerXX) * Math.sin(rotateAngle) + (newT - centerYY) * Math.cos(rotateAngle) + centerYY,
            },
            {
                x: (newR - centerXX) * Math.cos(rotateAngle) - (newT - centerYY) * Math.sin(rotateAngle) + centerXX,
                y: (newR - centerXX) * Math.sin(rotateAngle) + (newT - centerYY) * Math.cos(rotateAngle) + centerYY,
            },
            {
                x: (newR - centerXX) * Math.cos(rotateAngle) - (newB - centerYY) * Math.sin(rotateAngle) + centerXX,
                y: (newR - centerXX) * Math.sin(rotateAngle) + (newB - centerYY) * Math.cos(rotateAngle) + centerYY,
            },
            {
                x: (newL - centerXX) * Math.cos(rotateAngle) - (newB - centerYY) * Math.sin(rotateAngle) + centerXX,
                y: (newL - centerXX) * Math.sin(rotateAngle) + (newB - centerYY) * Math.cos(rotateAngle) + centerYY,
            }
        ]

        let top1 = 999999, right1 = 0, bottom1 = 0, left1 = 999999;

        left1 = Math.min(left1, bb[0].x);
        left1 = Math.min(left1, bb[1].x);
        left1 = Math.min(left1, bb[2].x);
        left1 = Math.min(left1, bb[3].x);
        right1 = Math.max(right1, bb[0].x)
        right1 = Math.max(right1, bb[1].x)
        right1 = Math.max(right1, bb[2].x)
        right1 = Math.max(right1, bb[3].x)
        top1 = Math.min(top1, bb[0].y)
        top1 = Math.min(top1, bb[1].y)
        top1 = Math.min(top1, bb[2].y)
        top1 = Math.min(top1, bb[3].y)
        bottom1 = Math.max(bottom1, bb[0].y)
        bottom1 = Math.max(bottom1, bb[1].y)
        bottom1 = Math.max(bottom1, bb[2].y)
        bottom1 = Math.max(bottom1, bb[3].y)



        newLeft2 = newLeft + image.width / 2;
        newLeft3 = newLeft + image.width;
        newTop2 = newTop + image.height / 2;
        newTop3 = newTop + image.height;
        img = image;

        centerX = newLeft + image.width / 2;
        centerY = newTop + image.height / 2;
        left = newLeft;
        top = newTop;
        // if (image.rotateAngle === 90 || image.rotateAngle === 270) {
        //     newLeft = centerX - image.height / 2;
        //     newTop = centerY - image.width / 2;
        //     newLeft2 = centerX;
        //     newLeft3 = centerX + image.height / 2;
        //     newTop2 = centerY;
        //     newTop3 = centerY + image.width / 2;
        // }
        if (img.type === TemplateType.BackgroundImage
            // || img.type == TemplateType.GroupedItem
        ) {
            return;
        }
        window.cloneImages.forEach(imageTransformed => {
            if (imageTransformed._id !== _id) {
                let el0 = document.getElementById(imageTransformed._id + "guide_0");
                let el1 = document.getElementById(imageTransformed._id + "guide_1");
                let el2 = document.getElementById(imageTransformed._id + "guide_2");
                let el3 = document.getElementById(imageTransformed._id + "guide_3");
                let el4 = document.getElementById(imageTransformed._id + "guide_4");
                let el5 = document.getElementById(imageTransformed._id + "guide_5");

                if (
                    Math.abs(left1 - imageTransformed.x[0]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosX) {
                        left -= left1 - imageTransformed.x[0];
                    }
                    if (el0) {
                        el0.style.display = "block";
                    }
                    updateStartPosX = true;
                } else if (
                    Math.abs((left1 + right1)/2 - imageTransformed.x[0]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosX) {
                        left -= (left1 + right1)/2 - imageTransformed.x[0];
                    }
                    if (el0) {
                        el0.style.display = "block";
                    }
                    updateStartPosX = true;
                } else if (
                    Math.abs(right1 - imageTransformed.x[0]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosX) {
                        left -= right1 - imageTransformed.x[0];
                        // left = imageTransformed.x[0] - image.width;
                    }
                    if (el0) {
                        el0.style.display = "block";
                    }
                    updateStartPosX = true;
                } else {
                    if (el0) {
                        el0.style.display = "none";
                    }
                }

                if (
                    Math.abs(left1 - imageTransformed.x[1]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosX) {
                        left -= left1 - imageTransformed.x[1];
                    }
                    if (el1) {
                        el1.style.display = "block";
                    }
                    updateStartPosX = true;
                } else if (
                    Math.abs((left1 + right1)/2 - imageTransformed.x[1]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosX) {
                        left -= (left1 + right1)/2 - imageTransformed.x[1];
                    }
                    if (el1) {
                        el1.style.display = "block";
                    }
                    updateStartPosX = true;
                } else if (
                    Math.abs(right1 - imageTransformed.x[1]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosX) {
                        left -= right1 - imageTransformed.x[1];
                    }
                    if (el1) {
                        el1.style.display = "block";
                    }
                    updateStartPosX = true;
                } else {
                    if (el1) {
                        el1.style.display = "none";
                    }
                }

                if (
                    Math.abs(left1 - imageTransformed.x[2]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosX) {
                        left -= left1 - imageTransformed.x[2];
                    }
                    if (el2) {
                        el2.style.display = "block";
                    }
                    updateStartPosX = true;
                } else if (
                    Math.abs((left1 + right1)/2 - imageTransformed.x[2]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosX) {
                        left -= (left1 + right1)/2 - imageTransformed.x[2];
                    }
                    if (el2) {
                        el2.style.display = "block";
                    }
                    updateStartPosX = true;
                } else if (
                    Math.abs(right1 - imageTransformed.x[2]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosX) {
                        left -= right1 - imageTransformed.x[2];
                    }
                    if (el2) {
                        el2.style.display = "block";
                    }
                    updateStartPosX = true;
                } else {
                    if (el2) {
                        el2.style.display = "none";
                    }
                }

                if (
                    Math.abs(top1 - imageTransformed.y[0]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosY) {
                        top -= top1 - imageTransformed.y[0];
                    }
                    if (el3) {
                        el3.style.display = "block";
                    }
                    updateStartPosY = true;
                } else if (
                    Math.abs((top1 + bottom1)/2 - imageTransformed.y[0]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosY) {
                        top -= (top1 + bottom1)/2 - imageTransformed.y[0];
                    }
                    if (el3) {
                        el3.style.display = "block";
                    }
                    updateStartPosY = true;
                } else if (
                    Math.abs(bottom1 - imageTransformed.y[0]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosY) {
                        top -= bottom1 - imageTransformed.y[0];
                    }
                    if (el3) {
                        el3.style.display = "block";
                    }
                    updateStartPosY = true;
                } else {
                    if (el3) {
                        el3.style.display = "none";
                    }
                }

                if (
                    Math.abs(top1 - imageTransformed.y[1]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosY) {
                        top -= top1 - imageTransformed.y[1];
                    }
                    if (el4) {
                        el4.style.display = "block";
                    }
                    updateStartPosY = true;
                } else if (
                    Math.abs((top1 + bottom1)/2 - imageTransformed.y[1]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosY) {
                        top -= newTop2 - imageTransformed.y[1];
                    }
                    if (el4) {
                        el4.style.display = "block";
                    }
                    updateStartPosY = true;
                } else if (
                    Math.abs(bottom1 - imageTransformed.y[1]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosY) {
                        top -= bottom1 - imageTransformed.y[1];
                    }
                    if (el4) {
                        el4.style.display = "block";
                    }
                    updateStartPosY = true;
                } else {
                    if (el4) {
                        el4.style.display = "none";
                    }
                }

                if (
                    Math.abs(top1 - imageTransformed.y[2]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosY) {
                        top -= top1 - imageTransformed.y[2];
                    }
                    if (el5) {
                        el5.style.display = "block";
                    }
                    updateStartPosY = true;
                } else if (
                    Math.abs((top1 + bottom1)/2 - imageTransformed.y[2]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosY) { 
                        top -= (top1 + bottom1)/2 - imageTransformed.y[2];
                    }
                    if (el5) {
                        el5.style.display = "block";
                    }
                    updateStartPosY = true;
                } else if (
                    Math.abs(bottom1 - imageTransformed.y[2]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosY) {
                        top -= bottom1 - imageTransformed.y[2];
                    }
                    if (el5) {
                        el5.style.display = "block";
                    }
                    updateStartPosY = true;
                } else {
                    if (el5) {
                        el5.style.display = "none";
                    }
                }

                // for (let ii = 0; ii < 6; ++ii) {
                //     let el = document.getElementById(image._id + "guide_" + ii);
                //     if (el) {
                //         if (image[ii] == 1) {
                //             el.style.display = "block";
                //         } else {
                //             el.style.display = "none";
                //         }
                //     }
                // }
            }
        });

        // const { staticGuides } = this.state;
        // let pageId = img.page;

        // let x = staticGuides.x.map(v => {
        //     let e = v[0];
        //     if (!updateStartPosX && Math.abs(newLeft - e) < 5) {
        //         left -= newLeft - e;
        //         // v[1] = 1;
        //         let el = document.getElementById(v[1] + pageId);
        //         if (el) {
        //             el.style.display = "block";
        //         }
        //         updateStartPosX = true;
        //     } else if (!updateStartPosX && Math.abs(newLeft3 - e) < 5) {
        //         left -= newLeft3 - e;
        //         // v[1] = 1;
        //         let el = document.getElementById(v[1] + pageId);
        //         if (el) {
        //             el.style.display = "block";
        //         }
        //         updateStartPosX = true;
        //     } else if (!updateStartPosX && Math.abs(newLeft2 - e) < 5) {
        //         left -= newLeft2 - e;
        //         // v[1] = 1;
        //         let el = document.getElementById(v[1] + pageId);
        //         if (el) {
        //             el.style.display = "block";
        //         }
        //         updateStartPosX = true;
        //     } else {
        //         let el = document.getElementById(v[1] + pageId);
        //         if (el) {
        //             el.style.display = "none";
        //         }
        //         // v[1] = 0;
        //     }

        //     return v;
        // });

        // let y = staticGuides.y.map(v => {
        //     let e = v[0];
        //     if (!updateStartPosY && Math.abs(newTop - e) < 5) {
        //         top -= newTop - e;
        //         let el = document.getElementById(v[1] + pageId);
        //         if (el) {
        //             el.style.display = "block";
        //         }
        //         updateStartPosY = true;
        //     } else if (!updateStartPosY && Math.abs(newTop3 - e) < 5) {
        //         top -= newTop3 - e;
        //         let el = document.getElementById(v[1] + pageId);
        //         if (el) {
        //             el.style.display = "block";
        //         }
        //         updateStartPosY = true;
        //     } else if (!updateStartPosY && Math.abs(newTop2 - e) < 5) {
        //         top -= newTop2 - e;
        //         let el = document.getElementById(v[1] + pageId);
        //         if (el) {
        //             el.style.display = "block";
        //         }
        //         updateStartPosY = true;
        //     } else {
        //         let el = document.getElementById(v[1] + pageId);
        //         if (el) {
        //             el.style.display = "none";
        //         }
        //     }

        //     return v;
        // });

        let deltaLeft = left - window.startLeft / scale;
        let deltaTop = top - window.startTop / scale;

        if (image.type == TemplateType.GroupedItem) {
            window.selections.forEach(sel => {
                let id = sel.attributes.iden.value;
                if (!id) return;

                let image2 = editorStore.images2.get(id);

                window.selectionsAngle[image2._id] = {
                    left: image2.left + deltaLeft,
                    top: image2.top + deltaTop,
                };

                let elId = id + "_alo";

                let el = document.getElementById(elId);
                if (el) {
                    el.style.width = image2.width * scale + "px";
                    el.style.height = image2.height * scale + "px";
                    el.style.transform = `translate(${(image2.left + deltaLeft) * scale}px, ${(image2.top + deltaTop) * scale}px) rotate(${image2.rotateAngle ? image2.rotateAngle : 0}deg)`;
                }

                let temp = document.getElementsByClassName(elId) as HTMLCollectionOf<HTMLElement>;
                for (let i = 0; i < temp.length; ++i) {
                    let el2 = temp[i];
                    el2.style.width = image2.width * scale + "px";
                    el2.style.height = image2.height * scale + "px";
                    el2.style.transform = `translate(${(image2.left + deltaLeft) * scale}px, ${(image2.top + deltaTop) * scale}px) rotate(${image2.rotateAngle ? image2.rotateAngle : 0}deg)`;

                }

                elId = id + "__alo";

                el = document.getElementById(elId);
                if (el) {
                    el.style.width = image2.width * scale + "px";
                    el.style.height = image2.height * scale + "px";
                    el.style.transform = `translate(${(image2.left + deltaLeft) * scale}px, ${(image2.top + deltaTop) * scale}px) rotate(${image2.rotateAngle ? image2.rotateAngle : 0}deg)`;
                }

                temp = document.getElementsByClassName(elId) as HTMLCollectionOf<HTMLElement>;
                for (let i = 0; i < temp.length; ++i) {
                    let el2 = temp[i];
                    el2.style.width = image2.width * scale + "px";
                    el2.style.height = image2.height * scale + "px";
                    el2.style.transform = `translate(${(image2.left + deltaLeft) * scale}px, ${(image2.top + deltaTop) * scale}px) rotate(${image2.rotateAngle ? image2.rotateAngle : 0}deg)`;

                }
            })
        }

        image.left = left;
        image.top = top;

        updatePosition.bind(this)(_id + "_alo", image);
        updatePosition.bind(this)(_id + "__alo", image);
    };

    updateImages2(image, includeDownloadCanvas) {
        this.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, includeDownloadCanvas);
    }

    updateImages(id, pageId, image, includeDownloadCanvas) {
        this.canvas1[pageId].canvas[CanvasType.All][id].child.updateImage(image);
        this.canvas1[pageId].canvas[CanvasType.HoverLayer][id].child.updateImage(image);
        if (includeDownloadCanvas) this.canvas2[pageId].canvas[CanvasType.Download][id].child.updateImage(image);
    }

    getGuider(id, num) {
        return document.getElementById(id + `guide_${num}`);
    }

    updateGuide(image) {
        const {scale} = this.state;
        const transformedimage = transformImage(image);

        let gui0 = this.getGuider(image._id, 0);
        let gui1 = this.getGuider(image._id, 1);
        let gui2 = this.getGuider(image._id, 2);
        let gui3 = this.getGuider(image._id, 3);
        let gui4 = this.getGuider(image._id, 4);
        let gui5 = this.getGuider(image._id, 5);

        if (gui0) gui0.style.left = `${transformedimage.x[0] * scale}px`;
        if (gui1) gui1.style.left = `${transformedimage.x[1] * scale}px`;
        if (gui2) gui2.style.left = `${transformedimage.x[2] * scale}px`;
        if (gui3) gui3.style.top = `${transformedimage.y[0] * scale}px`;
        if (gui4) gui4.style.top = `${transformedimage.y[1] * scale}px`;
        if (gui5) gui5.style.top = `${transformedimage.y[2] * scale}px`;
    }

    handleDragEnd = () => {

        this.temp.unsubscribe();

        if (window.image.type == TemplateType.TextTemplate) {
            window.image.document_object = window.image.document_object.map(doc => {
                if (doc._id == editorStore.childId) {
                    doc.selected = true;
                } else {
                    doc.selected = false;
                }
                return doc;
            })
        }

        editorStore.images2.set(editorStore.idObjectSelected, window.image);
        this.updateGuide(window.image);
        this.updateImages(editorStore.idObjectSelected, editorStore.pageId, window.image, true);

        window.cloneImages.forEach(imageTransformed => {
            let el0 = document.getElementById(imageTransformed._id + "guide_0");
            let el1 = document.getElementById(imageTransformed._id + "guide_1");
            let el2 = document.getElementById(imageTransformed._id + "guide_2");
            let el3 = document.getElementById(imageTransformed._id + "guide_3");
            let el4 = document.getElementById(imageTransformed._id + "guide_4");
            let el5 = document.getElementById(imageTransformed._id + "guide_5");

            if (el0) el0.style.display = "none";
            if (el1) el1.style.display = "none";
            if (el2) el2.style.display = "none";
            if (el3) el3.style.display = "none";
            if (el4) el4.style.display = "none";
            if (el5) el5.style.display = "none";
        });

        if (window.image.type == TemplateType.GroupedItem && window.selections) {
            window.selections.forEach(sel => {
                let id = sel.attributes.iden.value;
                if (!id || !window.selectionsAngle[id]) return;
                let image2 = editorStore.images2.get(id);
                image2.left = window.selectionsAngle[id].left;
                image2.top = window.selectionsAngle[id].top;
                image2.selected = false;

                editorStore.images2.set(id, image2);
                this.updateGuide(image2);
                this.updateImages(id, image2.page, image2, true);
            })
        }
    };

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

    handleScroll = () => {
        const screensRect = getBoundingClientRect("screens");
        const canvasRect = getBoundingClientRect("canvas");
        if (screensRect && canvasRect) {
            let pages = toJS(editorStore.pages);
            let activePageId = pages[0];
            if (pages.length > 1) {
                let container = document.getElementById("screen-container-parent");
                for (let i = 0; i < pages.length; ++i) {
                    let pageId = pages[i];
                    let canvas = document.getElementById(pageId);
                    if (canvas) {
                        if (this.elementIsVisible(canvas, container, false)) {
                            activePageId = pageId;
                        }
                    }
                }
            }

            // if (editorStore.activePageId != activePageId) {
            //     this.forceUpdate();
            // }
            editorStore.activePageId = activePageId;
        }
    };

    handleWheel = e => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            e.stopPropagation();
            const nextScale = parseFloat(
                Math.max(0.1, this.state.scale - e.deltaY / 500).toFixed(2)
            );
            this.setState({ scale: nextScale });
        }
    };

    templateOnMouseDown(doc) {
        editorStore.doNoObjectSelected();
        let ce = document.createElement.bind(document);
        let ca = document.createAttribute.bind(document);
        let ge = document.getElementsByTagName.bind(document);

        const { rectWidth, rectHeight } = this.state;

        let template = JSON.parse(doc.document);
        let scaleX = rectWidth / template.width;
        let scaleY = rectHeight / template.height;

        template.document_object = template.document_object.map(doc => {
            doc.width = doc.width * scaleX;
            doc.height = doc.height * scaleY;
            doc.top = doc.top * scaleY;
            doc.left = doc.left * scaleX;
            doc.scaleX = doc.scaleX * scaleX;
            doc.scaleY = doc.scaleY * scaleY;
            doc.page = editorStore.activePageId;
            doc.imgWidth = doc.imgWidth * scaleX;
            doc.imgHeight = doc.imgHeight * scaleY;

            return doc;
        });

        if (doc.fontList) {
            doc.fontList.forEach(id => {
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

        editorStore.applyTemplate(template.document_object);

        let fonts = toJS(editorStore.fonts);
        let tempFonts = [...fonts, ...doc.fontList];
        editorStore.fonts.replace(tempFonts);

        let index = editorStore.pages.findIndex(pageId => pageId == editorStore.activePageId);
        editorStore.keys[index] = editorStore.keys[index] + 1;

        this.forceUpdate();
    }

    doNoObjectSelected = () => {

        if (this.state.cropMode) {
            this.disableCropMode();
        }

        if (editorStore.idObjectSelected) {
            this.canvas1[editorStore.pageId].canvas[CanvasType.All][editorStore.idObjectSelected].child.handleImageUnselected();
            this.canvas1[editorStore.pageId].canvas[CanvasType.HoverLayer][editorStore.idObjectSelected].child.handleImageUnselected();

            let image = editorStore.images2.get(editorStore.idObjectSelected);

            if (image && image.type == TemplateType.GroupedItem) {
                editorStore.images2.delete(editorStore.idObjectSelected);
                let index = editorStore.pages.findIndex(pageId => pageId == image.page);
                editorStore.keys[index] = editorStore.keys[index] + 1;

                window.selections.forEach(el => {
                    el.style.opacity = 0;
                });

                this.forceUpdate();
            }
            editorStore.idObjectSelected = null;
            editorStore.childId = null;
        }

        if (editorStore.selectedTab === SidebarTab.Font || editorStore.selectedTab === SidebarTab.Color || editorStore.selectedTab === SidebarTab.Effect) {
            editorStore.selectedTab = SidebarTab.Image;
        }
    };

    removeImage(e) {
        let image = this.getImageSelected();
        let OSNAME = this.getPlatformName();
        if (
            editorStore.idObjectSelected != "undefined" &&
            !e.target.classList.contains("text") &&
            ((e.keyCode === 8 && OSNAME == "Mac/iOS") ||
                (e.keyCode === 8 && OSNAME == "Windows"))
        ) {
            let image = editorStore.images2.get(editorStore.idObjectSelected);
            if (image.type == TemplateType.BackgroundImage) {
                let image = this.getImageSelected();
                image.src = null;
                image.backgroundColor = "";
                image.color = "";
                editorStore.imageSelected = image;
                editorStore.images2.set(image._id, image);

                this.setState({fontColor: ""})
            } else {
                // let id = editorStore.idObjectSelected;
                // let page = editorStore.imageSelected.page;
                editorStore.images2.delete(editorStore.idObjectSelected);
                this.doNoObjectSelected();
                let index = editorStore.pages.findIndex(pageId => pageId == editorStore.pageId);
                editorStore.keys[index] = editorStore.keys[index] + 1;

                this.forceUpdate();
            }
        }
        
        if (image.type == TemplateType.GroupedItem && window.selections && 
            ((e.keyCode === 8 && OSNAME == "Mac/iOS") ||
                (e.keyCode === 8 && OSNAME == "Windows"))) {
            window.selections.forEach(sel => {
                let id = sel.attributes.iden.value;
                if (id) editorStore.images2.delete(id);
            });
            
            let index = editorStore.pages.findIndex(pageId => pageId == editorStore.activePageId);
            editorStore.keys[index] = editorStore.keys[index] + 1;

            this.forceUpdate();
        }
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

    handleApplyEffect = (effectId, offSet, direction, blur, textShadowTransparent, intensity, hollowThickness, color, filter) => {
        let image = editorStore.images2.get(editorStore.idObjectSelected);
        if (!editorStore.childId) {
            image.hollowThickness = hollowThickness;
            if (color) {
                image.color = color;
            }
            image.filter = filter;
            image.effectId = effectId;
            image.offSet = offSet;
            image.direction = direction;
            image.blur = blur;
            image.textShadowTransparent = textShadowTransparent;
            image.intensity = intensity;
        } else {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.hollowThickness = hollowThickness;
                    if (color) {
                        text.color = color;
                    }
                    text.filter = filter;
                    text.effectId = effectId;
                    text.offSet = offSet;
                    text.direction = direction;
                    text.blur = blur;
                    text.textShadowTransparent = textShadowTransparent;
                    text.intensity = intensity;
                }
                return text;
            });
            image.document_object = texts;
        }
        editorStore.images2.set(editorStore.idObjectSelected, image);
        this.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
        editorStore.effectId = effectId;
    }

    handleChangeHollowThicknessEnd = val => {
        let image = this.getImageSelected();
        if (editorStore.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.hollowThickness = val;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.hollowThickness = val;
        }
        editorStore.images2.set(editorStore.idObjectSelected, image);
        this.updateImages2(image, true);
    }

    handleChangeHollowThickness = (val) => {
        let el;
        if (editorStore.childId) {
            el = document.getElementById(editorStore.idObjectSelected + editorStore.childId + "text-container3");
        } else {
            el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
        }
        let image = this.getImageSelected();
        if (editorStore.childId) {
            image = image.document_object.find(text => text._id == editorStore.childId);
        }
        image.hollowThickness = val;
        el.style.webkitTextStroke = `${1.0 * image.hollowThickness / 100 * 4 + 0.1}px ${image.color}`;
    }

    handleChangeDirection = (val) => {
        let el;
        if (editorStore.childId) {
            el = el = this.getSingleTextHTMLElement();
        } else {
            el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
        }
        let image = this.getImageSelected();
        if (editorStore.childId) {
            image = image.document_object.find(text => text._id == editorStore.childId);
        }
        image.direction = val;
        el.style.textShadow = image.effectId == 1 ? `rgba(25, 25, 25, ${1.0 * image.textShadowTransparent / 100}) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * image.blur / 100}px` :
        image.effectId == 2 ? `rgba(0, 0, 0, ${0.6 * image.intensity}) 0 8.9px ${66.75 * image.intensity / 100}px` : 
        image.effectId == 4 ? `rgb(128, 128, 128) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` : 
        image.effectId == 5  ? `rgba(0, 0, 0, 0.5) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
        image.effectId == 6 && `rgb(0, 255, 255) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI))}px 0px`;
    }

    handleChangeOffsetEnd = val => {
        let image = this.getImageSelected();
        if (editorStore.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.offSet = val;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.offSet = val;
        }
        editorStore.images2.set(editorStore.idObjectSelected, image);
        this.updateImages2(image, true);
    }

    handleChangeOffset = val => {
        let el;
        if (editorStore.childId) {
            el = this.getSingleTextHTMLElement();
        } else {
            el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
        }
        let image = this.getImageSelected();
        if (editorStore.childId) {
            image = image.document_object.find(text => text._id == editorStore.childId);
        }
        image.offSet = val;
        el.style.textShadow = image.effectId == 1 ? `rgba(25, 25, 25, ${1.0 * image.textShadowTransparent / 100}) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * image.blur / 100}px` :
        image.effectId == 2 ? `rgba(0, 0, 0, ${0.6 * image.intensity}) 0 8.9px ${66.75 * image.intensity / 100}px` : 
        image.effectId == 4 ? `rgb(128, 128, 128) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` : 
        image.effectId == 5  ? `rgba(0, 0, 0, 0.5) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
        image.effectId == 6 && `rgb(0, 255, 255) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI))}px 0px`;
    }

    handleChangeDirectionEnd = val => {
        let image = this.getImageSelected();
        if (editorStore.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.direction = val;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.direction = val;
        }
        editorStore.images2.set(editorStore.idObjectSelected, image);
        this.updateImages2(image, true);
    }

    getSingleTextHTMLElement() {
        return document.getElementById(editorStore.idObjectSelected + editorStore.childId + "text-container2alo"); 
    }

    handleChangeBlur = (val) => {
        let el;
        if (editorStore.childId) {
            el = this.getSingleTextHTMLElement();
        } else {
            el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
        }
        let image = this.getImageSelected();
        if (editorStore.childId) {
            image = image.document_object.find(text => text._id == editorStore.childId);
        }
        image.blur = val;
        el.style.textShadow = image.effectId == 1 ? `rgba(25, 25, 25, ${1.0 * image.textShadowTransparent / 100}) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * image.blur / 100}px` :
        image.effectId == 2 ? `rgba(0, 0, 0, ${0.6 * image.intensity}) 0 8.9px ${66.75 * image.intensity / 100}px` : 
        image.effectId == 4 ? `rgb(128, 128, 128) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` : 
        image.effectId == 5  ? `rgba(0, 0, 0, 0.5) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
        image.effectId == 6 && `rgb(0, 255, 255) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI))}px 0px`;
    }

    handleChangeBlurEnd = val => {
        let image = this.getImageSelected();
        if (editorStore.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.blur = val;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.blur = val;
        }
        editorStore.images2.set(editorStore.idObjectSelected, image);
        this.updateImages2(image, true);
    }

    handleChangeTextShadowTransparentEnd = (val) => {
        let image = this.getImageSelected();
        if (editorStore.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.textShadowTransparent = val;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.textShadowTransparent = val;
        }
        editorStore.images2.set(editorStore.idObjectSelected, image);
        this.updateImages2(image, true);
    }

    handleChangeTextShadowTransparent = val => {
        let el;
        if (editorStore.childId) {
            el = this.getSingleTextHTMLElement();
        } else {
            el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
        }
        let image = this.getImageSelected();
        if (editorStore.childId) {
            image = image.document_object.find(text => text._id == editorStore.childId);
        }
        image.textShadowTransparent = val;
        el.style.textShadow = image.effectId == 1 ? `rgba(25, 25, 25, ${1.0 * image.textShadowTransparent / 100}) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * image.blur / 100}px` :
        image.effectId == 2 ? `rgba(0, 0, 0, ${0.6 * image.intensity}) 0 8.9px ${66.75 * image.intensity / 100}px` : 
        image.effectId == 4 ? `rgb(128, 128, 128) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` : 
        image.effectId == 5  ? `rgba(0, 0, 0, 0.5) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
        image.effectId == 6 && `rgb(0, 255, 255) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI))}px 0px`;
    }

    handleChangeIntensityEnd = val => {
        let image = this.getImageSelected();
        if (editorStore.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.intensity = val;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.intensity = val;
        }
        this.updateImages2(image, true);
        editorStore.images2.set(editorStore.idObjectSelected, image);
    }

    handleChangeIntensity = val => {
        let el;
        if (editorStore.childId) {
            el = this.getSingleTextHTMLElement();
        } else {
            el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
        }
        let image = this.getImageSelected();
        if (editorStore.childId) {
            image = image.document_object.find(text => text._id == editorStore.childId);
        }
        image.intensity = val;
        el.style.textShadow = image.effectId == 1 ? `rgba(25, 25, 25, ${1.0 * image.textShadowTransparent / 100}) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * image.blur / 100}px` :
        image.effectId == 2 ? `rgba(0, 0, 0, ${0.6 * image.intensity}) 0 8.9px ${66.75 * image.intensity / 100}px` : 
        image.effectId == 4 ? `rgb(128, 128, 128) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` : 
        image.effectId == 5  ? `rgba(0, 0, 0, 0.5) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
        image.effectId == 6 && `rgb(0, 255, 255) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI))}px 0px`;
    }

    handleImageHovered = (id, pageId) => {
        if (this.state.cropMode) return false;
        this.canvas1[pageId].canvas[CanvasType.HoverLayer][id].child.handleImageHovered();
        return true;
    }

    handleImageUnhovered = (id, pageId) => {
        this.canvas1[pageId].canvas[CanvasType.HoverLayer][id].child.handleImageUnhovered();
    }

    handleImageSelected = (id, pageId, updateCanvas, forceUpdate, updateImage) => {
        if (this.state.cropMode) {
            this.disableCropMode();
        }
        let oldImage = editorStore.images2.get(editorStore.idObjectSelected);
        let tab = editorStore.selectedTab;

        if (editorStore.idObjectSelected) {
            this.canvas1[editorStore.pageId].canvas[CanvasType.All][editorStore.idObjectSelected].child.handleImageUnselected();
            this.canvas1[editorStore.pageId].canvas[CanvasType.HoverLayer][editorStore.idObjectSelected].child.handleImageUnselected();
            this.doNoObjectSelected();
        }

        let image = editorStore.images2.get(id);
        image.selected = true;
        image.hovered = true;
        editorStore.images2.set(id, image);
        editorStore.idObjectSelected = id;
        editorStore.pageId = pageId;
        editorStore.effectId = image.effectId;
        editorStore.currentOpacity = image.opacity ? image.opacity : 100;
        if (!editorStore.childId) {
            console.log('asda')
            editorStore.currentFontSize = image.fontSize * image.scaleY;
            editorStore.fontId = image.fontId;
            editorStore.currentLetterSpacing = image.letterSpacing;
            editorStore.currentLineHeight = image.lineHeight;
        }

        if (oldImage && oldImage.type != image.type) {
            if (image.type == TemplateType.Heading && (tab == SidebarTab.Color || tab == SidebarTab.Effect)) {
                tab = SidebarTab.Image;
            }
        }

        editorStore.selectedTab = tab;

        // if (editorStore.imageSelected && editorStore.imageSelected.type == TemplateType.Heading && this.state.selectedTab === SidebarTab.Color) {
        //     this.setState({selectedTab: SidebarTab.Image})
        // } 

        if (updateCanvas) {
            this.canvas1[pageId].canvas[updateCanvas][id].child.handleImageSelected();
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

    download = async (filename, text) => {
        let blobUrl = URL.createObjectURL(text);
        let element = document.createElement("a");

        element.setAttribute("href", blobUrl);
        element.setAttribute("download", filename);
        element.style.display = "none";

        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    downloadVideo = () => {
        this.showPopupDownloading();

        window.downloading = true;
        this.setState({ showPopup: true, downloading: true }, () => {
            let aloCloned = document.getElementsByClassName("alo2");
            let canvas = [];
            for (let i = 0; i < aloCloned.length; ++i) {
                canvas.push((aloCloned[i] as HTMLElement).outerHTML);
            }

            let styles = document.getElementsByTagName("style");
            let a = Array.from(styles).filter(style => {
                return style.attributes.getNamedItem("data-styled") !== null;
            });

            window.downloading = false;

            axios
                .post(
                    `/api/Design/DownloadVideo?width=${this.state.rectWidth}&height=${
                    this.state.rectHeight
                    }&videoId=${uuidv4()}`,
                    {
                        fonts: toJS(editorStore.fonts),
                        canvas,
                        // additionalStyle: a[0].outerHTML
                    },
                    {
                        headers: {
                            "Content-Type": "text/html"
                        },
                        responseType: "blob"
                    }
                )
                .then(response => {
                    this.setState({
                        showPopup: false,
                        downloading: false
                    });
                    this.download(`test.mp4`, response.data);
                    this.hidePopupDownloading();
                })
                .catch(error => {
                    this.hidePopupDownloading();
                });
        });
    };
    
    toggleVideo() {
        this.canvas1[editorStore.pageId].canvas[CanvasType.All][editorStore.idObjectSelected].child.toggleVideo();
        this.canvas1[editorStore.pageId].canvas[CanvasType.HoverLayer][editorStore.idObjectSelected].child.toggleVideo();

        let el = document.getElementById(editorStore.idObjectSelected + "video" + "alo") as HTMLVideoElement;
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

    downloadPDF(bleed) {
        this.showPopupDownloading();
        window.downloading = true;

        this.setState(
            {
                // scale: 1,
                showPopup: true,
                bleed,
                downloading: true
            },
            () => {
                let aloCloned = document.getElementsByClassName("alo2");
                let canvas = [];
                for (let i = 0; i < aloCloned.length; ++i) {
                    canvas.push((aloCloned[i] as HTMLElement).outerHTML);
                }

                let styles = document.getElementsByTagName("style");
                let a = Array.from(styles).filter(style => {
                    return style.attributes.getNamedItem("data-styled") !== null;
                });

                axios
                    .post(
                        `/api/Design/Download?width=${this.state.rectWidth +
                        (bleed ? 20 : 0)}&height=${this.state.rectHeight +
                        (bleed ? 20 : 0)}`,
                        { fonts: toJS(editorStore.fonts), canvas },
                        {
                            headers: {
                                "Content-Type": "text/html"
                            },
                            responseType: "blob"
                        }
                    )
                    .then(response => {
                        this.setState({
                            showPopup: false,
                            bleed: false,
                            downloading: false
                        });
                        this.download("test.pdf", response.data);
                        this.hidePopupDownloading();
                    })
                    .catch(error => {
                        this.hidePopupDownloading();
                    });
            }
        );
    }

    b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    };

    handleRemoveBackground = (mediaId, e) => {
        this.setState({
            showImageRemovalBackgroundPopup: true,
            imageIdBackgroundRemoved: mediaId,
            showMediaEditPopup: false,
            showPopup: false
        });
    };

    showPopupDownloading = () => {
        document.getElementById("downloadPopup").style.display = "block";
        document.getElementById("editor").classList.add("popup");
    }

    hidePopupDownloading = () => {
        document.getElementById("downloadPopup").style.display = "none";
        document.getElementById("editor").classList.remove("popup");
    }

    downloadPNG(transparent, png) {
        this.showPopupDownloading();

        let self = this;
        window.downloading = true;
        this.setState({ showPopup: true, downloading: true }, () => {
            let aloCloned = document.getElementsByClassName("alo2");
            let canvas = [];
            for (let i = 0; i < aloCloned.length; ++i) {
                canvas.push((aloCloned[i] as HTMLElement).outerHTML);
            }

            let styles = document.getElementsByTagName("style");
            let a = Array.from(styles).filter(style => {
                return style.attributes.getNamedItem("data-styled") !== null;
            });

            window.downloading = false;

            axios
                .post(
                    `/api/Design/DownloadPNG?width=${this.state.rectWidth}&height=${this.state.rectHeight}&transparent=${transparent}&download=true&png=${png}`,
                    {
                        fonts: toJS(editorStore.fonts),
                        canvas,
                        additionalStyle: a[0].outerHTML,
                        transparent
                    },
                    {
                        headers: {
                            "Content-Type": "text/html"
                        },
                        responseType: "blob"
                    }
                )
                .then(response => {
                    self.setState({
                        showPopup: false,
                        downloading: false
                    });
                    self.download(`test.${png ? "png" : "jpeg"}`, response.data);
                    self.hidePopupDownloading();
                })
                .catch(error => {
                    self.hidePopupDownloading();
                });
        });
    }

    async saveImages(rep, isVideo) {
        // return;
        if (!Globals.serviceUser) {
            return;
        }

        
        let _id;
        // this.setState({ isSaving: true });
        this.setSavingState(SavingState.SavingChanges, false);
        const { mode } = this.state;
        let self = this;
        const { rectWidth, rectHeight } = this.state;

        let images = toJS(Array.from(editorStore.images2.values()).filter(image => image.type != TemplateType.GroupedItem));
        let clonedArray = JSON.parse(JSON.stringify(images))
        let tempImages = clonedArray.map(image => {
            image.width2 = image.width / rectWidth;
            image.height2 = image.height / rectHeight;
            image.selected = false;
            image.hovered = false;
            return image;
        });

        if (mode === Mode.CreateTextTemplate || mode === Mode.EditTextTemplate) {
            let newImages = [];
            for (let i = 0; i < clonedArray.length; ++i) {
                let image = clonedArray[i];
                if (!image.ref) {
                    newImages.push(...this.normalize(image, clonedArray));
                }
            }
            tempImages = newImages;
        }


        if (
            this.state.mode === Mode.CreateTextTemplate ||
            this.state.mode == Mode.EditTextTemplate
        ) {
            tempImages = tempImages.map(img => {
                if (img.innerHTML) {
                    img.innerHTML = img.innerHTML.replace(/#ffffff/g, "black");
                    img.innerHTML = img.innerHTML.replace(
                        /rgb\(255, 255, 255\)/g,
                        "black"
                    );
                }
                return img;
            });
        }


        await setTimeout(async function () {
            let url;
            let _id = self.state._id;


            if (mode == Mode.CreateDesign) {
                if (self.props.match.path == "/editor/design/:design_id/:template_id") {
                    url = "/api/Design/AddOrUpdate";
                } else {
                    if (!self.state.designId) {
                        url = "/api/Design/Add";
                        self.setState({designId: uuidv4()});
                    } else {
                        url = "/api/Design/Update";
                    }
                }
            } else if (
                mode == Mode.CreateTemplate ||
                mode == Mode.CreateTextTemplate
            ) {
                url = "/api/Template/Add";
            } else if (mode == Mode.EditTemplate || mode == Mode.EditTextTemplate) {
                url = "/api/Template/Update";
            } else if (mode == Mode.EditDesign) {
                url = "/api/Design/Update";
            }

            let type;
            if (mode == Mode.CreateTextTemplate || mode == Mode.EditTextTemplate) {
                type = TemplateType.TextTemplate;
            } else if (mode == Mode.CreateTemplate || mode == Mode.EditTemplate) {
                type = TemplateType.Template;
            }

            window.downloading = true;

            let aloCloned = document.getElementsByClassName("alo2");
            let canvas2 = [];
            for (let i = 0; i < aloCloned.length; ++i) {
                canvas2.push((aloCloned[i] as HTMLElement).outerHTML);
            }

            let styles = document.getElementsByTagName("style");
            let a = Array.from(styles).filter(style => {
                return style.attributes.getNamedItem("data-styled") !== null;
            });

            _id = self.state._id ? self.state._id : uuidv4();


            if (mode == Mode.CreateDesign) {
                _id = self.state.designId;
            }

            let elTitle = (document.getElementById("designTitle") as HTMLInputElement);
            const title = elTitle ? elTitle.value : "";


            let res = JSON.stringify({
                Title: title,
                CreatedAt: "2014-09-27T18:30:49-0300",
                CreatedBy: 2,
                UpdatedAt: "2014-09-27T18:30:49-0300",
                UpdatedBy: 3,
                Type: type,
                Document: JSON.stringify({
                    _id,
                    width: self.state.rectWidth,
                    origin_width: self.state.rectWidth,
                    height: self.state.rectHeight,
                    origin_height: self.state.rectHeight,
                    left: 0,
                    top: 0,
                    type: type,
                    scaleX: 1,
                    scaleY: 1,
                    document_object: tempImages
                }),
                FontList: toJS(editorStore.fonts),
                Width: self.state.rectWidth,
                Height: self.state.rectHeight,
                Id: _id,
                Keywords: [],
                Canvas: [],
                Canvas2: canvas2,
                AdditionalStyle: a[0].outerHTML,
                FilePath: "/templates",
                FirstName: "Untilted",
                Pages: toJS(editorStore.pages),
                PrintType: self.state.subtype,
                Representative: `images/${uuidv4()}.png`,
                Representative2: `images/${_id}_2.jpeg`,
                VideoRepresentative: `videos/${_id}.mp4`,
                IsVideo: isVideo,
                UserName: Globals.serviceUser.username,
                Popular: window.template ? window.template.popular : false,
            });

            axios
                .post(url, res, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(res => {
                    // self.setState({ 
                    //     downloading: false,
                    //     saved: true,
                    // });

                    self.setSavingState(SavingState.ChangesSaved, false);
                    // Ui.showInfo("Success");
                })
                .catch(error => {
                    // Ui.showErrors(error.response.statusText)
                });
            // });
        }, 300);

        return _id;
    }

    onTextChange(parentIndex, e, key) {
        const { scale } = this.state;
        let images = toJS(editorStore.images);
        let tempImages = images.map(image => {
            if (image._id === parentIndex) {
                let newHeight = 0;
                let changedText;
                let deltaY = 0;
                let scaleY = image.height / image.origin_height;

                let texts = image.document_object.map(text => {
                    if (text._id === key) {
                        changedText = { ...text };
                        text.innerHTML = e.target.innerHTML;
                        let rec = e.target.getBoundingClientRect();
                        deltaY = rec.height / this.state.scale / scaleY - text.height;
                        text.height = rec.height / this.state.scale / scaleY;
                    }
                    return text;
                });

                let text2 = [];
                for (let i = 0; i < texts.length; ++i) {
                    let d = texts[i];
                    if (d.ref === null) {
                        text2.push(
                            ...this.normalize2(
                                d,
                                texts,
                                image.scaleX,
                                image.scaleY,
                                scale,
                                image.width,
                                image.height
                            )
                        );
                    }
                }

                text2 = text2.map(text => {
                    if (text._id !== key) {
                        if (text.top > changedText.top) {
                            text.top += deltaY;
                        }
                    }
                    return text;
                });

                text2.forEach(text => {
                    newHeight = Math.max(newHeight, (text.top + text.height) * scaleY);
                });

                image.height = newHeight;
                image.origin_height = image.height / scaleY;
                image.document_object = text2;
            }
            return image;
        });

        // this.setState({ images });
    }

    videoOnMouseDown(e) {
        e.preventDefault();

        let target = e.target.cloneNode(true);

        target.style.zIndex = "11111111111";
        target.src = e.target.getElementsByTagName("source")[0].getAttribute("src");
        target.style.width = e.target.getBoundingClientRect().width + "px";
        document.body.appendChild(target);
        let self = this;
        this.imgDragging = target;
        let posX = e.pageX - e.target.getBoundingClientRect().left;
        let dragging = true;
        let posY = e.pageY - e.target.getBoundingClientRect().top;

        let recScreenContainer = document
            .getElementById("screen-container-parent")
            .getBoundingClientRect();
        let beingInScreenContainer = false;

        const onMove = e => {
            if (dragging) {
                let rec2 = self.imgDragging.getBoundingClientRect();
                if (
                    beingInScreenContainer === false &&
                    recScreenContainer.left < rec2.left &&
                    recScreenContainer.right > rec2.right &&
                    recScreenContainer.top < rec2.top &&
                    recScreenContainer.bottom > rec2.bottom
                ) {
                    beingInScreenContainer = true;

                    // target.style.width = (rec2.width * self.state.scale) + 'px';
                    // target.style.height = (rec2.height * self.state.scale) + 'px';
                    // target.style.transitionDuration = '0.05s';

                    setTimeout(() => {
                        target.style.transitionDuration = "";
                    }, 50);
                }

                if (
                    beingInScreenContainer === true &&
                    !(
                        recScreenContainer.left < rec2.left &&
                        recScreenContainer.right > rec2.right &&
                        recScreenContainer.top < rec2.top &&
                        recScreenContainer.bottom > rec2.bottom
                    )
                ) {
                    beingInScreenContainer = false;

                    // target.style.width = (rec2.width / self.state.scale) + 'px';
                    // target.style.height = (rec2.height / self.state.scale) + 'px';
                    // target.style.transitionDuration = '0.05s';

                    setTimeout(() => {
                        target.style.transitionDuration = "";
                    }, 50);
                }

                target.style.left = e.pageX - posX + "px";
                target.style.top = e.pageY - posY + "px";
                target.style.position = "absolute";
            }
        };

        const onUp = e => {
            dragging = false;
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);

            let recs = document.getElementsByClassName("alo");
            let rec2 = self.imgDragging.getBoundingClientRect();
            let pages = toJS(editorStore.pages);
            for (let i = 0; i < recs.length; ++i) {
                let rec = recs[i].getBoundingClientRect();
                if (
                    rec.left < rec2.right &&
                    rec.right > rec2.left &&
                    rec.top < rec2.bottom &&
                    rec.bottom > rec2.top
                ) {
                    let newItem = {
                        _id: uuidv4(),
                        type: TemplateType.Video,
                        width: rec2.width / self.state.scale,
                        height: rec2.height / self.state.scale,
                        origin_width: rec2.width / self.state.scale,
                        origin_height: rec2.height / self.state.scale,
                        left: (rec2.left - rec.left) / self.state.scale,
                        top: (rec2.top - rec.top) / self.state.scale,
                        rotateAngle: 0.0,
                        src: target.src,
                        selected: false,
                        scaleX: 1,
                        scaleY: 1,
                        posX: 0,
                        posY: 0,
                        imgWidth: rec2.width / self.state.scale,
                        imgHeight: rec2.height / self.state.scale,
                        page: pages[i],
                        zIndex: editorStore.upperZIndex + 1,
                        paused: true,
                    };

                    this.setSavingState(SavingState.UnsavedChanges, true);
                    editorStore.addItem2(newItem, false);
                    editorStore.increaseUpperzIndex();

                    this.handleImageSelected(newItem._id, newItem.page, false, true, false);

                }
            }

            self.imgDragging.remove();
        };
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    }

    imgOnMouseDown(img, e) {
        e.preventDefault();
        let target = e.target.cloneNode(true);
        target.style.zIndex = "11111111111";
        target.src = img.representativeThumbnail
            ? img.representativeThumbnail
            : e.target.src;
        target.style.width = e.target.getBoundingClientRect().width + "px";
        target.style.backgroundColor = e.target.style.backgroundColor;
        document.body.appendChild(target);
        let self = this;
        this.imgDragging = target;
        let posX = e.pageX - e.target.getBoundingClientRect().left;
        let dragging = true;
        let posY = e.pageY - e.target.getBoundingClientRect().top;
        let image = e.target;
        let recScreenContainer = document
            .getElementById("screen-container-parent")
            .getBoundingClientRect();
        let beingInScreenContainer = false;

        const onMove = e => {
            image.style.opacity = 0;
            if (dragging) {
                let rec2 = self.imgDragging.getBoundingClientRect();
                if (
                    beingInScreenContainer === false &&
                    recScreenContainer.left < rec2.left &&
                    recScreenContainer.right > rec2.right &&
                    recScreenContainer.top < rec2.top &&
                    recScreenContainer.bottom > rec2.bottom
                ) {
                    beingInScreenContainer = true;

                    setTimeout(() => {
                        target.style.transitionDuration = "";
                    }, 50);
                }

                if (
                    beingInScreenContainer === true &&
                    !(
                        recScreenContainer.left < rec2.left &&
                        recScreenContainer.right > rec2.right &&
                        recScreenContainer.top < rec2.top &&
                        recScreenContainer.bottom > rec2.bottom
                    )
                ) {
                    beingInScreenContainer = false;

                    setTimeout(() => {
                        target.style.transitionDuration = "";
                    }, 50);
                }

                target.style.left = e.pageX - posX + "px";
                target.style.top = e.pageY - posY + "px";
                target.style.position = "absolute";
            }
        };

        const onUp = evt => {
            
            dragging = false;
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);

            let recs = document.getElementsByClassName("alo");
            let rec2 = self.imgDragging.getBoundingClientRect();
            for (let i = 0; i < recs.length; ++i) {
                let rec = recs[i].getBoundingClientRect();
                if (
                    rec.left < rec2.right &&
                    rec.right > rec2.left &&
                    rec.top < rec2.bottom &&
                    rec.bottom > rec2.top
                ) {
                    let newImg = {
                        _id: uuidv4(),
                        type: TemplateType.Image,
                        width: rec2.width / self.state.scale,
                        height: rec2.height / self.state.scale,
                        origin_width: rec2.width / self.state.scale,
                        origin_height: rec2.height / self.state.scale,
                        left: (rec2.left - rec.left) / self.state.scale,
                        top: (rec2.top - rec.top) / self.state.scale,
                        rotateAngle: 0.0,
                        src: !img.representative.startsWith("data")
                            ? window.location.origin + "/" + img.representative
                            : img.representative,
                        srcThumnail: img.representativeThumbnail,
                        backgroundColor: target.style.backgroundColor,
                        selected: true,
                        scaleX: 1,
                        scaleY: 1,
                        posX: 0,
                        posY: 0,
                        imgWidth: rec2.width / self.state.scale,
                        imgHeight: rec2.height / self.state.scale,
                        page: editorStore.pages[i],
                        zIndex: editorStore.upperZIndex + 1,
                        freeStyle: img.freeStyle
                    };

                    this.setSavingState(SavingState.UnsavedChanges, true);
                    editorStore.addItem2(newImg, false);
                    editorStore.increaseUpperzIndex();

                    this.handleImageSelected(newImg._id, editorStore.pages[i], false, true, false);
                }
            }

            self.imgDragging.remove();

            image.style.opacity = 1;
        };
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    }

    setSelectionColor = (color, e) => {
        color = color.toString();
        if (e) {
            e.preventDefault();
        }
        let image = editorStore.images2.get(editorStore.idObjectSelected);
        if (image.type == TemplateType.BackgroundImage) {
            image.color = color;
            image.src = null;

            editorStore.images2.set(image._id, image);

            this.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);

            this.setState({
                fontColor: color,
            });
        }
        else if (editorStore.idObjectSelected){
            image.color = color;
            image.backgroundColor = color;
            if (editorStore.childId) {
                let texts = image.document_object.map(d => {
                    if (d._id == editorStore.childId) {
                        d.color = color;
                    }
                    return d;
                });
                image.document_object = texts;
            }
            editorStore.images2.set(image._id, image);

            this.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);

            this.setState({
                fontColor: color,
            });
        }
    };
    
    colorPickerShown = () => {
        this.setState({colorPickerShown: true})
    }

    onSingleTextChange(thisImage, e, childId) {
        thisImage = toJS(thisImage);
        let target;
        if (childId) {
            target = document.getElementById(editorStore.idObjectSelected + childId + "alo");
        } else {
            target = e.target;
        }
        if (e) {
            e.persist();
        }
        setTimeout(() => {
            const { scale } = this.state;
            if (!childId) {
                let image = editorStore.images2.get(editorStore.idObjectSelected);
                let centerX = image.left + image.width / 2;
                let centerY = image.top + image.height / 2;
                image.width = target.offsetWidth * image.scaleX;

                let oldHeight = image.height;
                let a;
                if (thisImage.type === TemplateType.Heading) {
                    a = document.getElementsByClassName(thisImage._id + "hihi4alo")[0] as HTMLElement;
                } else if (thisImage.type === TemplateType.Latex) {
                    a = document.getElementById(thisImage._id)
                        .getElementsByClassName("text2")[0] as HTMLElement;
                }
                let newHeight = a.offsetHeight * image.scaleY;
                image.height = newHeight;
                let tmp = newHeight / 2 - oldHeight / 2;
                let deltacX = tmp * Math.sin(((360 - image.rotateAngle) / 180) * Math.PI);
                let deltacY = tmp * Math.cos(((360 - image.rotateAngle) / 180) * Math.PI);
                let newCenterX = centerX + deltacX;
                let newCenterY = centerY + deltacY;

                image.left = newCenterX - image.width / 2;
                image.top = newCenterY - image.height / 2;

                if (image.scaleY === 0) {
                    image.origin_height = 0;
                } else {
                    image.origin_height = image.height / image.scaleY;
                }

                image.innerHTML = target.innerHTML;
                editorStore.images2.set(editorStore.idObjectSelected, image);
                this.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
                this.canvas2[editorStore.pageId].canvas[CanvasType.Download][editorStore.idObjectSelected].child.updateInnerHTML(image.innerHTML);
            } else {
                let image = editorStore.images2.get(editorStore.idObjectSelected);
                let centerX = image.left + image.width / 2;
                let centerY = image.top + image.height / 2;
                let texts = image.document_object.map(text => {
                    if (text._id === childId) {
                        text.innerHTML = target.innerHTML;
                        text.height = document.getElementById(editorStore.idObjectSelected + text._id + "alo").offsetHeight * text.scaleY;
                    }
                    return text;
                });

                let maxHeight = 0;
                texts.forEach(text => {
                    const h = document.getElementById(editorStore.idObjectSelected + text._id + "alo").offsetHeight * text.scaleY;
                    maxHeight = Math.max(maxHeight, h + text.top);
                });

                texts = texts.map(text => {
                    text.height2 = text.height / maxHeight;
                    return text;
                });

                let newDocumentObjects = [];
                for (let i = 0; i < texts.length; ++i) {
                    let d = texts[i];
                    if (!d.ref) {
                        let imgs = this.normalize2(
                            d,
                            texts,
                            image.scaleX,
                            image.scaleY,
                            this.state.scale,
                            image.width,
                            image.height
                        );
                        newDocumentObjects.push(...imgs);
                    }
                }

                maxHeight = 0;
                newDocumentObjects.forEach(text => {
                    maxHeight = Math.max(maxHeight, text.height + text.top);
                });

                newDocumentObjects = newDocumentObjects.map(text => {
                    text.height2 = text.height / maxHeight;
                    return text;
                });
                image.document_object = newDocumentObjects;
                let oldHeight = image.height;
                image.height = maxHeight * image.scaleY;
                image.origin_height = image.height / image.scaleY;

                let tmp = image.height / 2 - oldHeight / 2;
                let deltacX = tmp * Math.sin(((360 - image.rotateAngle) / 180) * Math.PI);
                let deltacY = tmp * Math.cos(((360 - image.rotateAngle) / 180) * Math.PI);
                let newCenterX = centerX + deltacX;
                let newCenterY = centerY + deltacY;

                image.left = newCenterX - image.width / 2;
                image.top = newCenterY - image.height / 2;

                editorStore.images2.set(editorStore.idObjectSelected, image);
                this.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
                this.canvas2[editorStore.pageId].canvas[CanvasType.Download][editorStore.idObjectSelected].child.childrens[childId].updateInnerHTML(target.innerHTML);
            }
        }, 0);
    }

    imgDragging = null;

    onClickDropDownList = e => {
        document.getElementById("myDropdown").classList.toggle("show");

        const onDown = e => {
            if (!e.target.matches(".dropbtn")) {
                let dropdowns = document.getElementsByClassName("dropdown-content");
                for (let i = 0; i < dropdowns.length; i++) {
                    let openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains("show")) {
                        openDropdown.classList.remove("show");
                    }
                }

                document.removeEventListener("mouseup", onDown);
            }
        };

        document.addEventListener("mouseup", onDown);
    };

    onClickDropDownFontList = e => {
        e.preventDefault();
        this.setState({ selectedTab: SidebarTab.Font, toolbarOpened: true });
    };

    onClickEffectList = e => {
        e.preventDefault();
        this.setState({selectedTab: SidebarTab.Effect, toolbarOpened: true});
    }

    onClickDropDownFontSizeList = () => {

        document.getElementById("myFontSizeList").classList.toggle("show");

        const onDown = e => {
            if (!e.target.matches(".dropbtn-font-size")) {
                let dropdowns = document.getElementsByClassName(
                    "dropdown-content-font-size"
                );
                for (let i = 0; i < dropdowns.length; i++) {
                    let openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains("show")) {
                        openDropdown.classList.remove("show");
                    }
                }

                document.removeEventListener("mouseup", onDown);
            }
        };

        document.addEventListener("mouseup", onDown);
    };

    handleDownloadList = () => {
        document.getElementById("myDownloadList").classList.toggle("show");

        const onDown = e => {
            if (!e.target.matches(".dropbtn-font-size")) {
                let dropdowns = document.getElementsByClassName(
                    "dropdown-content-font-size"
                );
                let i;
                for (i = 0; i < dropdowns.length; i++) {
                    let openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains("show")) {
                        openDropdown.classList.remove("show");
                    }
                }

                document.removeEventListener("mouseup", onDown);
            }
        };

        document.addEventListener("mouseup", onDown);
    };

    onDownClickTransparent = e => {
        if (!document.getElementById("myTransparent").contains(e.target)) {
            let dropdowns = document.getElementsByClassName(
                "dropdown-content-font-size"
            );
            let i;
            for (i = 0; i < dropdowns.length; i++) {
                let openDropdown = dropdowns[i];
                if (openDropdown.classList.contains("show")) {
                    openDropdown.classList.remove("show");
                }
            }
        }
    };

    onClickTransparent = () => {

        document.getElementById("myTransparent").classList.toggle("show");

        const onDown = e => {
            if (!document.getElementById("myTransparent").contains(e.target)) {
            // if (!e.target.matches(".dropbtn-font-size")) {
                let dropdowns = document.getElementsByClassName(
                    "dropdown-content-font-size"
                );
                let i;
                for (i = 0; i < dropdowns.length; i++) {
                    let openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains("show")) {
                        openDropdown.classList.remove("show");
                    }
                }

                document.removeEventListener("mouseup", onDown);
            }
        };

        document.addEventListener("mouseup", onDown);
    };

    onClickpositionList = () => {
        document.getElementById("myPositionList").classList.toggle("show");

        const onDown = e => {
            if (!document.getElementById("myPositionList").contains(e.target)) {
            // if (!e.target.matches(".dropbtn-font-size")) {
                let dropdowns = document.getElementsByClassName(
                    "dropdown-content-font-size"
                );
                let i;
                for (i = 0; i < dropdowns.length; i++) {
                    let openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains("show")) {
                        openDropdown.classList.remove("show");
                    }
                }

                document.removeEventListener("mouseup", onDown);
            }
        };

        document.addEventListener("mouseup", onDown);
    };

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

                norm(child, res);
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
                let rec = getBoundingClientRect(parent._id);
                let rec3 = getBoundingClientRect(image._id);
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

    uploadVideo = () => {
        let self = this;
        ``;
        let fileUploader = document.getElementById(
            "image-file"
        ) as HTMLInputElement;
        let file = fileUploader.files[0];
        let fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = () => {
            let url = `/api/Media/AddVideo`;
            axios.post(url, {
                id: uuidv4(),
                data: fr.result,
                type: TemplateType.Video
            });
        };
    };

    handleChildIdSelected = childId => {
        this.canvas1[editorStore.pageId].canvas[CanvasType.All][editorStore.idObjectSelected].child.handleTextChildSelected(childId);
        this.canvas1[editorStore.pageId].canvas[CanvasType.HoverLayer][editorStore.idObjectSelected].child.handleTextChildSelected(childId);

        let align, effectId, bold, italic, fontId, fontColor;
        let currentOpacity, currentLineHeight, currentLetterSpacing;
        let fontSize;
        const image = editorStore.images2.get(editorStore.idObjectSelected);
        image.selected = true;
        image.document_object.forEach(doc => {
            if (doc._id == childId) {
                doc.selected= true;
                align = doc.align;
                effectId = doc.effectId;
                bold = doc.bold;
                italic = doc.italic;
                fontId = doc.fontFace;
                fontColor = doc.color;
                currentLineHeight = doc.lineHeight;
                currentOpacity = doc.opacity;
                currentLetterSpacing = doc.letterSpacing;
                fontSize = doc.fontSize * doc.scaleY * image.scaleY;
            }
            return doc;
        });

        let fontsList = toJS(editorStore.fontsList);
        let font = fontsList.find(font => font.id === fontId);
        let text = image.document_object.find(text => text._id == childId);

        editorStore.fontId = fontId;
        editorStore.currentFontSize = fontSize;
        editorStore.currentLetterSpacing = currentLetterSpacing;
        editorStore.childId = childId;
        editorStore.currentLineHeight = currentLineHeight;
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

        this.canvas1[page].canvas[CanvasType.HoverLayer][id].child.enableCropMode();

        let el = document.getElementById("screen-container-parent");
        el.style.backgroundColor = "rgba(14, 19, 24, 0.15)";
        
        let els = document.getElementsByClassName("alo");
        for (let i = 0; i < els.length; ++i) {
            let el = els[i] as HTMLElement;
            el.style.backgroundColor = "rgba(14, 19, 24, 0.15)";
        }
    };

    disableCropMode = () => {
        if (editorStore.idObjectSelected) {
            this.setState({ cropMode: false });
            editorStore.cropMode = false;
            this.canvas1[editorStore.pageId].canvas[CanvasType.All][editorStore.idObjectSelected].child.disableCropMode();
            this.canvas1[editorStore.pageId].canvas[CanvasType.HoverLayer][editorStore.idObjectSelected].child.disableCropMode();

            let el = document.getElementById("screen-container-parent");
            el.style.backgroundColor = "";

            let els = document.getElementsByClassName("alo");
            for (let i = 0; i < els.length; ++i) {
                let el = els[i] as HTMLElement;
                el.style.backgroundColor = "white";
            }

            this.forceUpdate();
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

        const {rectWidth, rectHeight} = this.state;

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
        editorStore.imageSelected = image;
        editorStore.images2.set(editorStore.idObjectSelected, image);
        editorStore.increaseUpperzIndex();
    };

    backwardSelectedObject = id => {
        let image = this.getImageSelected();
        image.zIndex = 2;
        editorStore.imageSelected = image;
        editorStore.images2.forEach((val, key) => {
            if (key == editorStore.idObjectSelected) {
                val.zIndex = 2;
            } else {
                val.zIndex += 1;
            }
            editorStore.images2.set(key, val);
        });
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

            res.push(
                <Canvas
                    ref={ref => {
                        if (!downloading) {
                            this.canvas1[pageId] = ref;
                        } else {
                            this.canvas2[pageId] = ref;
                        }
                    }}
                    handleCropBtnClick={this.handleCropBtnClick}
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
                    images={Array.from(editorStore.images2.values()).filter(img => img.page === pages[i]).map(img => toJS(img))}
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
                    handleRotateStart={this.handleRotateStart}
                    handleResizeStart={this.handleResizeStart}
                    handleDragStart={this.handleDragStart}
                    onSingleTextChange={this.onSingleTextChange.bind(this)}
                    handleFontSizeChange={this.handleFontSizeChange}
                    handleFontColorChange={this.handleFontColorChange}
                    handleFontFamilyChange={this.handleFontFamilyChange}
                    handleChildIdSelected={this.handleChildIdSelected}
                    enableCropMode={this.enableCropMode}
                    disableCropMode={this.disableCropMode}
                    handleResizeInnerImageStart={this.handleResizeInnerImageStart}
                    doNoObjectSelected={this.doNoObjectSelected}
                    handleDeleteThisPage={this.handleDeleteThisPage.bind(this, pages[i])}
                    showPopup={this.state.showPopup}
                    preview={preview}
                    activePageId={toJS(editorStore.activePageId)}
                />
            );
        }

        return res;
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

    handleResponse(response) {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            return data;
        });
    }

    externalPaymentCompleted(fragment) {
        if (fragment === null || typeof fragment !== "object") {
            return;
        }
        const { requestId, orderId } = fragment;

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestId, orderId })
        };

        fetch(`/payments/momo/status`, requestOptions)
            .then(this.handleResponse)
            .then(
                responseFromMomo => {
                    responseFromMomo &&
                        responseFromMomo.localMessage &&
                        alert(responseFromMomo.localMessage);
                    if (responseFromMomo.message === "Success") {
                        this.handleAddOrder();
                        this.setState({ orderStatus: "success" });
                    }
                },
                error => { }
            );
    }

    getMoMoPayUrl = async () => {
        const requestOptions = {
            method: "GET"
        };

        fetch(`/payments/momo`, requestOptions)
            .then(this.handleResponse)
            .then(
                responseFromMomo => {
                    window.paymentScope = { complete: this.externalPaymentCompleted };
                    window.open(responseFromMomo.payUrl, "_blank");
                },
                error => { }
            );
    };

    handleContinueOrder = async () => {
        if (
            this.state.currentPrintStep === 3 &&
            this.state.orderStatus !== "success"
        ) {
            await this.getMoMoPayUrl();
        }
        if (this.state.currentPrintStep < 3)
            await this.setState({
                currentPrintStep: this.state.currentPrintStep + 1
            });
    };

    handleAddOrder = async () => {
        if (this.refFullName) {
            let fullName = this.refFullName.value;
            let address = this.refAddress.value;
            let city = this.refCity.value;
            let phoneNumber = this.refPhoneNumber.value;

            let rep = `images/${uuidv4()}.png`;

            this.saveImages(rep, false);

            let url = `/api/Order/Add`;
            let res = {
                Id: uuidv4(),
                FullName: fullName,
                Address: address,
                City: city,
                PhoneNumber: phoneNumber,
                OrderId: this.state._id,
                Representative: rep
            };
            axios.post(url, res);
        }
    };

    handleLetterSpacingChangeEnd = (letterSpacing) => {
        let image = this.getImageSelected();
        if (editorStore.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.letterSpacing = window.letterSpacing;
                }
                return text;
            });
            image.document_object = texts;
            editorStore.images2.set(editorStore.idObjectSelected, image);
            this.updateImages2(image, true);
        } else {
            let image = this.getImageSelected();
            image.height = window.imageHeight;
            image.letterSpacing = window.letterSpacing;
            image.origin_height = window.imageHeight / image.scaleY;

            editorStore.images2.set(editorStore.idObjectSelected, image);
            this.updateImages2(image, true);
        }
    }

    handleLetterSpacingChange = letterSpacing => {
        let image = this.getImageSelected();
        if (editorStore.childId) {
            let el = this.getSingleTextHTMLElement();
            el.style.letterSpacing = `${1.0*letterSpacing/100*4}px`;

            this.onSingleTextChange(image, null, editorStore.childId);
        } else {
            let hihi4 = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
            hihi4.style.letterSpacing = `${1.0*letterSpacing/100*4}px`;
            let height = hihi4.offsetHeight;
            let image = this.getImageSelected();

            let a = document.getElementsByClassName(editorStore.idObjectSelected + "aaaaalo");
            for (let i = 0; i < a.length; ++i) {
                let tempEl = a[i] as HTMLElement;
                tempEl.style.height = height * image.scaleY * this.state.scale + "px";
            } 

            window.imageHeight = height * image.scaleY;
        }

        window.letterSpacing = letterSpacing;
    }

    handleLineHeightChangeEnd = (val) => {

        let image = this.getImageSelected();
        if (editorStore.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.lineHeight = window.lineHeight;
                }
                return text;
            });
            image.document_object = texts;
            editorStore.images2.set(editorStore.idObjectSelected, image);
            this.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
        } else {
            let lineHeight = 1.0 * val / 100 * 2 + 0.5;
            image.lineHeight = lineHeight;
            image.height = window.imageHeight;
            image.origin_height = window.imageHeight / image.scaleY;
            editorStore.images2.set(editorStore.idObjectSelected, image);
            this.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
        }
    }

    handleLineHeightChange = val => {
        let lineHeight = 1.0 * val / 100 * 2 + 0.5;
        let image = this.getImageSelected();
        if (editorStore.childId) {
            let el = this.getSingleTextHTMLElement();
            el.style.lineHeight = lineHeight.toString();

            this.onSingleTextChange(image, null, editorStore.childId);
        } else {
            let hihi4 = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
            hihi4.style.lineHeight = lineHeight.toString();
            let image = this.getImageSelected();
            let height = hihi4.offsetHeight;
            let a = document.getElementsByClassName(editorStore.idObjectSelected + "aaaaalo");
            for (let i = 0; i < a.length; ++i) {
                let tempEl = a[i] as HTMLElement;
                tempEl.style.height = height * image.scaleY * this.state.scale + "px";
            } 
            
            window.imageHeight = height * image.scaleY;
        }

        window.lineHeight = lineHeight;
    };

    handleOpacityChangeEnd = () => {
        let opacity = window.opacity;
        let image = this.getImageSelected();
        image.opacity = opacity;
        editorStore.images2.set(editorStore.idObjectSelected, image);

        this.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
    }

    backgroundOnMouseDown(item) {
        editorStore.pageColor.delete(editorStore.activePageId);
        editorStore.pageBackgroundImage.set(editorStore.activePageId, window.location.origin + "/" + item.representative);
        this.forceUpdate();
    }

    handleOpacityChange = opacity => {
        let image = this.getImageSelected();
        if (image.type == TemplateType.Video) {
            let el = document.getElementById(editorStore.idObjectSelected + "videoalo");
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

    setSavingState(state, callSave) {
        let term;
        if (state == SavingState.UnsavedChanges) {
            term = this.translate("unsavedChanges");
        } else if (state == SavingState.SavingChanges) {
            term = this.translate("savingChanges");
        } else if (state == SavingState.ChangesSaved) {
            term = this.translate("allChangesSaved");
        }

        let el = document.getElementById("savingState") as HTMLSpanElement;
        if (el) el.innerHTML = term;

        if (callSave) {
            this.saving = setTimeout(() => {
                this.saveImages(null, false);
            }, 5000);
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
                        translate={this.translate}
                        downloadPNG={this.downloadPNG.bind(this)}
                        downloadPDF={this.downloadPDF.bind(this)}
                        downloadVideo={this.downloadVideo.bind(this)}
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
                            <LeftSide
                                templateOnMouseDown={this.templateOnMouseDown}
                                id={this.state._id}
                                effectId={this.state.effectId}
                                align={this.state.align}
                                pauser={this.pauser}
                                colorPickerShown={this.colorPickerShown}
                                handleEditFont={this.handleEditFont}
                                scale={this.state.scale}
                                fontId={this.state.fontId}
                                translate={this.translate.bind(this)}
                                textOnMouseDown={this.textOnMouseDown.bind(this)}
                                videoOnMouseDown={this.videoOnMouseDown.bind(this)}
                                imgOnMouseDown={this.imgOnMouseDown.bind(this)}
                                setSelectionColor={this.setSelectionColor.bind(this)}
                                mounted={this.state.mounted}
                                subtype={this.state.subtype}
                                selectFont={this.selectFont.bind(this)}
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
                                handleApplyEffect={this.handleApplyEffect}
                                handleChangeOffset={this.handleChangeOffset}
                                handleChangeOffsetEnd={this.handleChangeOffsetEnd}
                                handleChangeBlur={this.handleChangeBlur}
                                handleChangeBlurEnd={this.handleChangeBlurEnd}
                                handleChangeTextShadowTransparent={this.handleChangeTextShadowTransparent}
                                handleChangeTextShadowTransparentEnd={this.handleChangeTextShadowTransparentEnd}
                                handleChangeIntensity={this.handleChangeIntensity}
                                handleChangeIntensityEnd={this.handleChangeIntensityEnd}
                                handleChangeDirection={this.handleChangeDirection}
                                handleChangeDirectionEnd={this.handleChangeDirectionEnd}
                                handleChangeHollowThickness={this.handleChangeHollowThickness}
                                handleChangeHollowThicknessEnd={this.handleChangeHollowThicknessEnd}
                                handleLineHeightChange={this.handleLineHeightChange}
                                handleLineHieghtChangeEnd={this.handleLineHeightChangeEnd}
                                backgroundOnMouseDown={this.backgroundOnMouseDown}
                                handleImageSelected={this.handleImageSelected}
                            />
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
                            onScroll={this.handleScroll}
                            onWheel={this.handleWheel}
                        >
                            <div>
                            <Toolbar
                                selectedCanvas={this.state.selectedCanvas}
                                pauser={this.pauser}
                                effectId={this.state.effectId}
                                bold={this.state.bold}
                                italic={this.state.italic}
                                align={this.state.align}
                                selectedTab={this.state.selectedTab}
                                translate={this.translate}
                                editorStore={editorStore}
                                childId={editorStore.childId}
                                fontColor={this.state.fontColor}
                                handleColorBtnClick={this.handleColorBtnClick}
                                handleItalicBtnClick={this.handleItalicBtnClick}
                                handleBoldBtnClick={this.handleBoldBtnClick}
                                onClickDropDownFontList={this.onClickDropDownFontList}
                                onClickEffectList={this.onClickEffectList}
                                fontName={this.state.fontName}
                                fontId={this.state.fontId}
                                cropMode={this.state.cropMode}
                                handleFilterBtnClick={this.handleFilterBtnClick}
                                handleAdjustBtnClick={this.handleAdjustBtnClick}
                                handleCropBtnClick={this.handleCropBtnClick}
                                handleFlipBtnClick={this.handleFlipBtnClick}
                                imgBackgroundColor={this.state.imgBackgroundColor}
                                handleImageBackgroundColorBtnClick={this.handleImageBackgroundColorBtnClick}
                                fontSize={this.state.fontSize}
                                handleFontSizeBtnClick={this.handleFontSizeBtnClick}
                                handleAlignBtnClick={this.handleAlignBtnClick}
                                handleOkBtnClick={this.handleOkBtnClick}
                                handleCancelBtnClick={this.handleCancelBtnClick}
                                idObjectSelected={editorStore.idObjectSelected}
                                onClickpositionList={this.onClickpositionList}
                                onClickTransparent={this.onClickTransparent}
                                forwardSelectedObject={this.forwardSelectedObject}
                                backwardSelectedObject={this.backwardSelectedObject}
                                handleTransparentAdjust={this.handleTransparentAdjust}
                                currentOpacity={this.state.currentOpacity}
                                currentLineHeight={this.state.currentLineHeight}
                                currentLetterSpacing={this.state.currentLetterSpacing}
                                handleOpacityChange={this.handleOpacityChange}
                                handleOpacityChangeEnd={this.handleOpacityChangeEnd}
                                handleLineHeightChange={this.handleLineHeightChange}
                                handleLineHeightChangeEnd={this.handleLineHeightChangeEnd}
                                handleLetterSpacing={this.handleLetterSpacingChange}
                                handleLetterSpacingEnd={this.handleLetterSpacingChangeEnd}
                            />
                            </div>
                            {/* <div
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
                            ></div> */}
                            <div
                                key={1}
                                // ref={this.setRef.bind(this)}
                                // onLoad={this.setRef.bind(this)}
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
                                    backgroundColor:
                                        this.state.cropMode && "rgba(14, 19, 24, 0.15)"
                                }}
                            >
                                {this.state.mounted && (
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
                                        onClick={e => {
                                            if (
                                                (e.target as Element).id === "screen-container"
                                                // !this.state.dragging &&
                                                // !this.state.resizing
                                            ) {
                                                // this.doNoObjectSelected();
                                            }
                                        }}
                                    >
                                        {/* {this.state.downloading && ( */}
                                            <div
                                                style={{
                                                    display: "none"
                                                }}
                                            >
                                                {this.renderCanvas(false, -1, true)}
                                            </div>
                                        {/* )} */}
                                        {this.renderCanvas(false, -1, false)}
                                    </div>
                                )}
                                <div
                                    style={{
                                        position: "fixed",
                                        bottom: "5px",
                                        right: `${5 +
                                            (this.state.showPrintingSidebar ? 330 : 0)}px`,
                                        zIndex: 99999999
                                    }}
                                >
                                    {this.state.showZoomPopup && (
                                        <div style={{}}>
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
                                                            this.setState({ scale: 3, showZoomPopup: false });
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
                                                            this.setState({ scale: 2, showZoomPopup: false });
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
                                                            this.setState({
                                                                scale: 1.75,
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
                                                            this.setState({
                                                                scale: 1.5,
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
                                                            this.setState({
                                                                scale: 1.25,
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
                                                            this.setState({ scale: 1, showZoomPopup: false });
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
                                                            this.setState({
                                                                scale: 0.75,
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
                                                            this.setState({
                                                                scale: 0.5,
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
                                                            this.setState({
                                                                scale: 0.25,
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
                                                            this.setState({
                                                                scale: 0.1,
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
                                                            this.setState({
                                                                scale: this.state.fitScale,
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
                                                        {this.translate("fit")}
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                    {this.state.mounted && (
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
                                                        content={this.translate("zoomIn")}
                                                        delay={10}
                                                        style={{}}
                                                        position="top"
                                                    >
                                                        <button
                                                            onClick={e => {
                                                                this.setState({
                                                                    scale: Math.max(0.1, this.state.scale - 0.15)
                                                                });
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
                                                            {Math.round(this.state.scale * 100)}%
                            </button>
                                                    </div>
                                                    <Tooltip
                                                        offsetLeft={0}
                                                        offsetTop={-5}
                                                        content={this.translate("zoomOut")}
                                                        delay={10}
                                                        style={{}}
                                                        position="top"
                                                    >
                                                        <button
                                                            onClick={e => {
                                                                this.setState({
                                                                    scale: this.state.scale + 0.15
                                                                });
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
                                        </div>
                                    )}
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
                        {this.state.showPrintingSidebar && (
                            <div
                                style={{
                                    width: "400px",
                                    height: "100%",
                                    right: 0,
                                    position: "absolute"
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            height: "46px"
                                        }}
                                    >
                                        <div
                                            className="pStkS_qIKsPoym6eCGnye"
                                            style={{
                                                padding: "10px",
                                                display: "flex",
                                                height: "46px",
                                                borderBottom: "1px solid rgba(14,19,24,.15)",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <div
                                                className="_3I6bflXEnh4GRlVDlnzEap"
                                                style={{ display: "flex", alignItems: "center" }}
                                            >
                                                <span
                                                    style={{ marginRight: "5px" }}
                                                    className="_2JPeE-06cfszm35uzXEvgC _1tNfXgCCl_5Qt5kGxyM8c4"
                                                >
                                                    <span
                                                        className="_2EacSGMxQyBD7pSwvfkZz3 _3l4uYr79jSRjggcw5QCp88"
                                                        style={{
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            display: "flex",
                                                            width: "20px",
                                                            height: "20px",
                                                            borderRadius: "50%",
                                                            border: "12px solid transparent",
                                                            backgroundColor:
                                                                this.state.currentPrintStep >= 1
                                                                    ? "#6bca2c"
                                                                    : "#e7e7e7"
                                                        }}
                                                    >
                                                        <span>1</span>
                                                    </span>
                                                </span>
                                                <span
                                                    style={{ marginRight: "5px" }}
                                                    className="_2JPeE-06cfszm35uzXEvgC _2JAh8PyNfcg1Kun3J3uV1C"
                                                >
                                                    <span
                                                        className="_2EacSGMxQyBD7pSwvfkZz3 _3l4uYr79jSRjggcw5QCp88"
                                                        style={{
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            display: "flex",
                                                            width: "20px",
                                                            height: "20px",
                                                            borderRadius: "50%",
                                                            border: "12px solid transparent",
                                                            backgroundColor:
                                                                this.state.currentPrintStep >= 2
                                                                    ? "#6bca2c"
                                                                    : "#e7e7e7"
                                                        }}
                                                    >
                                                        <span>2</span>
                                                    </span>
                                                </span>
                                                <span
                                                    style={{ marginRight: "5px" }}
                                                    className="_2JPeE-06cfszm35uzXEvgC _2JAh8PyNfcg1Kun3J3uV1C"
                                                >
                                                    <span
                                                        className="_2EacSGMxQyBD7pSwvfkZz3 _3l4uYr79jSRjggcw5QCp88"
                                                        style={{
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            display: "flex",
                                                            width: "20px",
                                                            height: "20px",
                                                            borderRadius: "50%",
                                                            border: "12px solid transparent",
                                                            backgroundColor:
                                                                this.state.currentPrintStep >= 3
                                                                    ? "#6bca2c"
                                                                    : "#e7e7e7"
                                                        }}
                                                    >
                                                        <span>3</span>
                                                    </span>
                                                </span>
                                            </div>
                                            <button
                                                style={{
                                                    position: "absolute",
                                                    right: 0,
                                                    border: "none",
                                                    background: "transparent"
                                                }}
                                                onClick={() => {
                                                    this.setState({ showPrintingSidebar: false });
                                                }}
                                                className="_2Rww-JOL60obmcYkaUOyg_ Wqfq1nAfa6if4eEOr6Mza _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _3cIMyP4YPUpE0H8WXQ_r-B Wqfq1nAfa6if4eEOr6Mza _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _3QJ_C8Lg1l0m5aoIK5piST _2kK9hFUTyqtMKr5EG4GuY4 _3SyHP4HOoHraV3-PJsORT7"
                                                type="button"
                                            >
                                                <span className="_3WuwevpUMOqhISoQUjDiY3">
                                                    <span className="_3K8w6l0jetB1VHftQo2qK6 _3riOXmq8mfDI5UGnLrweQh">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width={24}
                                                            height={24}
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                fill="currentColor"
                                                                d="M13.06 12.15l5.02-5.03a.75.75 0 1 0-1.06-1.06L12 11.1 6.62 5.7a.75.75 0 1 0-1.06 1.06l5.38 5.38-5.23 5.23a.75.75 0 1 0 1.06 1.06L12 13.2l4.88 4.87a.75.75 0 1 0 1.06-1.06l-4.88-4.87z"
                                                            />
                                                        </svg>
                                                    </span>
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    {this.state.currentPrintStep == 1 && (
                                        <div
                                            style={{
                                                padding: "16px 16px 0",
                                                position: "relative",
                                                height: "calc(100% - 46px)"
                                            }}
                                        >
                                            {this.state.subtype == SubType.BusinessCardReview && (
                                                <BusinessCardReview
                                                    firstPage={this.renderCanvas(true, 0, false)}
                                                    secondPage={this.renderCanvas(true, 1, false)}
                                                ></BusinessCardReview>
                                            )}
                                            {this.state.subtype == SubType.FlyerReview && (
                                                <FlyerReview>
                                                    {this.renderCanvas(true, 0, false)}
                                                </FlyerReview>
                                            )}
                                            {this.state.subtype == SubType.PosterReview && (
                                                <TrifoldReview>
                                                    {this.renderCanvas(true, 0, false)}
                                                </TrifoldReview>
                                            )}

                                            {this.state.subtype == SubType.TrifoldReview && (
                                                <PosterReview>
                                                    {this.renderCanvas(true, 0, false)}
                                                </PosterReview>
                                            )}
                                            {this.state.subtype > SubType.TrifoldReview && (
                                                <CanvasReview width={500} height={500}>
                                                    {this.renderCanvas(true, 0, false)}
                                                </CanvasReview>
                                            )}

                                            <div
                                                className="_3w96fDCkiF-cx4xtdHq8Eb"
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <label className="_1YMus4Eu0cHYhxD8BF9bKk jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">
                                                    Kích thước
                        </label>
                                                <div style={{ zIndex: 123123 }}>
                                                    <button
                                                        style={{
                                                            width: "100%",
                                                            backgroundColor: "white",
                                                            border: "none"
                                                        }}
                                                        type="button"
                                                        className="_2rbIxUjieDPNxaKim1eUOh _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2Nsx_KfExUOh-XOcjJewEf _3VMFhjcT1YTNCBfgY43AoL"
                                                    >
                                                        <span className="_11gYYV-YiJb7npRdslKTJX">
                                                            {" "}
                                                            <div className="_16jC4NpI5ci7-HVASqeSUU">A3</div>
                                                            <span className="_1Lb2Q2YFMHEYBIzodSJlY8 _1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path
                                                                        fill="currentColor"
                                                                        d="M11.71 6.47l-3.53 3.54c-.1.1-.26.1-.36 0L4.3 6.47a.75.75 0 1 0-1.06 1.06l3.53 3.54c.69.68 1.8.68 2.48 0l3.53-3.54a.75.75 0 0 0-1.06-1.06z"
                                                                    />
                                                                </svg>
                                                            </span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div
                                                className="_3w96fDCkiF-cx4xtdHq8Eb"
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <label className="_1YMus4Eu0cHYhxD8BF9bKk jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">
                                                    Thông tin khác:
                        </label>
                                                <div style={{ zIndex: 123123 }}>
                                                    <button
                                                        style={{
                                                            width: "100%",
                                                            backgroundColor: "white",
                                                            border: "none"
                                                        }}
                                                        type="button"
                                                        className="_2rbIxUjieDPNxaKim1eUOh _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2Nsx_KfExUOh-XOcjJewEf _3VMFhjcT1YTNCBfgY43AoL"
                                                    >
                                                        <span className="_11gYYV-YiJb7npRdslKTJX">
                                                            {" "}
                                                            <div className="_16jC4NpI5ci7-HVASqeSUU">A3</div>
                                                            <span className="_1Lb2Q2YFMHEYBIzodSJlY8 _1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width={16}
                                                                    height={16}
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path
                                                                        fill="currentColor"
                                                                        d="M11.71 6.47l-3.53 3.54c-.1.1-.26.1-.36 0L4.3 6.47a.75.75 0 1 0-1.06 1.06l3.53 3.54c.69.68 1.8.68 2.48 0l3.53-3.54a.75.75 0 0 0-1.06-1.06z"
                                                                    />
                                                                </svg>
                                                            </span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div
                                                style={{
                                                    position: "relative",
                                                    display: "flex",
                                                    flexDirection: "column"
                                                }}
                                                className="_3YDCW8EBZnxTRa5xT7gtHk _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88"
                                            >
                                                <span
                                                    style={{
                                                        margin: "auto",
                                                        display: "inline-block",
                                                        padding: "14px",
                                                        backgroundColor: "rgb(107, 202, 44)",
                                                        borderRadius: "50%",
                                                        marginTop: "20px",
                                                        marginBottom: "20px"
                                                    }}
                                                    className="_17Olod74EUtMOOpeHSF9RO _3K8w6l0jetB1VHftQo2qK6 _3riOXmq8mfDI5UGnLrweQh"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={24}
                                                        height={24}
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            fill="currentColor"
                                                            d="M4.53 11.9L9 16.38 19.44 5.97a.75.75 0 0 1 1.06 1.06L9.53 17.97c-.3.29-.77.29-1.06 0l-5-5c-.7-.71.35-1.77 1.06-1.07z"
                                                        />
                                                    </svg>
                                                </span>
                                                <div className="fe5UvoRC9ZkGGo1SwMSHH">
                                                    <div className="YOoVgTXLDk_wFPeE7Lehj">
                                                        100% Đảm bảo hài lòng
                          </div>
                                                    <span className="_19yfLwKwDEYdDKh0ixOgNB _1YRea3--8x2Rm7RqKumWGQ">
                                                        Nếu bạn không hài lòng với món hàng bạn nhận được.
                            Chúng tôi sẽ làm nó hài lòng với bạn.{" "}
                                                        <a
                                                            href="https://support.canva.com/canva-print/print-customer-service-policy/print-customer-happiness-policy/"
                                                            target="_blank"
                                                            rel="noopener"
                                                        >
                                                            More
                            </a>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {this.state.currentPrintStep == 2 && (
                                        <div
                                            style={{
                                                padding: "16px 16px 0",
                                                position: "relative"
                                            }}
                                        >
                                            <div
                                                className="_3w96fDCkiF-cx4xtdHq8Eb"
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <form autoComplete="on">
                                                    <div className="_2WG0n1tF-Rc7mYLaZoDpdC">
                                                        <p className="_3H42by719pMs1V0_zCiGTG ">
                                                            Địa chỉ giao hàng
                            </p>
                                                    </div>
                                                    <label className="_1lAKgn_4JnKMAytI-mxfqp">
                                                        <p>Họ và tên:</p>
                                                        <input
                                                            className=""
                                                            type="text"
                                                            autoComplete="name"
                                                            placeholder="E.g. David Bowie"
                                                            name="name"
                                                            defaultValue="Manh Quynh Nguyen"
                                                            style={{
                                                                backgroundImage: 'url("data:image/png',
                                                                backgroundRepeat: "no-repeat",
                                                                backgroundAttachment: "scroll",
                                                                backgroundSize: "16px 18px",
                                                                backgroundPosition: "98% 50%"
                                                            }}
                                                        />
                                                    </label>
                                                    <label className="_1lAKgn_4JnKMAytI-mxfqp">
                                                        <p>Địa chỉ</p>
                                                        <input
                                                            className=""
                                                            type="tel"
                                                            autoComplete="tel"
                                                            name="tel"
                                                        />
                                                    </label>
                                                    <label className="_1lAKgn_4JnKMAytI-mxfqp">
                                                        <p>Tỉnh thành phố</p>
                                                        <input
                                                            className=""
                                                            type="text"
                                                            autoComplete="address-level2"
                                                            placeholder="E.g. Brooklyn"
                                                            name="address-level2"
                                                            defaultValue="Singapore"
                                                        />
                                                    </label>
                                                    <label className="_1lAKgn_4JnKMAytI-mxfqp">
                                                        <p>Quận / Huyện</p>
                                                        <div className="_3Tk7vFk3XB74DSjc-X114e fs-hide">
                                                            <div>
                                                                <button
                                                                    type="button"
                                                                    className="_2rbIxUjieDPNxaKim1eUOh _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2Nsx_KfExUOh-XOcjJewEf"
                                                                >
                                                                    <span className="_11gYYV-YiJb7npRdslKTJX">
                                                                        {" "}
                                                                        <div className="_16jC4NpI5ci7-HVASqeSUU">
                                                                            Singapore
                                    </div>
                                                                        <span className="_1Lb2Q2YFMHEYBIzodSJlY8 _1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh">
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width={16}
                                                                                height={16}
                                                                                viewBox="0 0 16 16"
                                                                            >
                                                                                <path
                                                                                    fill="currentColor"
                                                                                    d="M11.71 6.47l-3.53 3.54c-.1.1-.26.1-.36 0L4.3 6.47a.75.75 0 1 0-1.06 1.06l3.53 3.54c.69.68 1.8.68 2.48 0l3.53-3.54a.75.75 0 0 0-1.06-1.06z"
                                                                                />
                                                                            </svg>
                                                                        </span>
                                                                    </span>
                                                                </button>
                                                            </div>
                                                            <div className="_1sk78p8Erqs7Wd-2IGk6E9">
                                                                <input
                                                                    className=""
                                                                    type="text"
                                                                    autoComplete="country"
                                                                    name="country"
                                                                />
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="_1lAKgn_4JnKMAytI-mxfqp">
                                                        <p className="">Số điện thoại</p>
                                                        <input
                                                            className=""
                                                            type="text"
                                                            autoComplete="postal-code"
                                                            placeholder="E.g. 11217"
                                                            name="postal-code"
                                                        />
                                                    </label>
                                                </form>
                                            </div>
                                        </div>
                                    )}

                                    {this.state.currentPrintStep == 3 && (
                                        <div
                                            style={{
                                                padding: "16px 16px 0",
                                                position: "relative",
                                                height: "calc(100% - 46px)"
                                            }}
                                        >
                                            <div
                                                className="_3w96fDCkiF-cx4xtdHq8Eb"
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <form autoComplete="on">
                                                    <div className="_2WG0n1tF-Rc7mYLaZoDpdC">
                                                        <p className="_3H42by719pMs1V0_zCiGTG ">
                                                            Xác nhận và thanh toán
                            </p>
                                                    </div>
                                                    <label className="_1lAKgn_4JnKMAytI-mxfqp">
                                                        <p>Full name</p>
                                                        <input
                                                            className=""
                                                            ref={i => (this.refFullName = i)}
                                                            type="text"
                                                            autoComplete="name"
                                                            placeholder="E.g. David Bowie"
                                                            name="name"
                                                            defaultValue="Manh Quynh Nguyen"
                                                            style={{
                                                                backgroundImage: 'url("data:image/png',
                                                                backgroundRepeat: "no-repeat",
                                                                backgroundAttachment: "scroll",
                                                                backgroundSize: "16px 18px",
                                                                backgroundPosition: "98% 50%"
                                                            }}
                                                        />
                                                    </label>
                                                    <label className="_1lAKgn_4JnKMAytI-mxfqp">
                                                        <p>Địa chỉ</p>
                                                        <input
                                                            ref={i => (this.refAddress = i)}
                                                            className=""
                                                            type="text"
                                                            autoComplete="text"
                                                            name="address"
                                                        />
                                                    </label>
                                                    <label className="_1lAKgn_4JnKMAytI-mxfqp">
                                                        <p>Contact number</p>
                                                        <input
                                                            className=""
                                                            ref={i => (this.refPhoneNumber = i)}
                                                            type="tel"
                                                            autoComplete="tel"
                                                            name="tel"
                                                        />
                                                    </label>
                                                    <label className="_1lAKgn_4JnKMAytI-mxfqp">
                                                        <p>City</p>
                                                        <input
                                                            className=""
                                                            ref={i => (this.refCity = i)}
                                                            type="text"
                                                            autoComplete="address-level2"
                                                            placeholder="E.g. Brooklyn"
                                                            name="address-level2"
                                                            defaultValue="Singapore"
                                                        />
                                                    </label>
                                                    <label className="_1lAKgn_4JnKMAytI-mxfqp">
                                                        <p>Country</p>
                                                        <div className="_3Tk7vFk3XB74DSjc-X114e fs-hide">
                                                            <div>
                                                                <button
                                                                    type="button"
                                                                    className="_2rbIxUjieDPNxaKim1eUOh _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2Nsx_KfExUOh-XOcjJewEf"
                                                                >
                                                                    <span className="_11gYYV-YiJb7npRdslKTJX">
                                                                        {" "}
                                                                        <div className="_16jC4NpI5ci7-HVASqeSUU">
                                                                            Singapore
                                    </div>
                                                                        <span className="_1Lb2Q2YFMHEYBIzodSJlY8 _1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh">
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width={16}
                                                                                height={16}
                                                                                viewBox="0 0 16 16"
                                                                            >
                                                                                <path
                                                                                    fill="currentColor"
                                                                                    d="M11.71 6.47l-3.53 3.54c-.1.1-.26.1-.36 0L4.3 6.47a.75.75 0 1 0-1.06 1.06l3.53 3.54c.69.68 1.8.68 2.48 0l3.53-3.54a.75.75 0 0 0-1.06-1.06z"
                                                                                />
                                                                            </svg>
                                                                        </span>
                                                                    </span>
                                                                </button>
                                                            </div>
                                                            <div className="_1sk78p8Erqs7Wd-2IGk6E9">
                                                                <input
                                                                    className=""
                                                                    type="text"
                                                                    autoComplete="country"
                                                                    name="country"
                                                                />
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="_1lAKgn_4JnKMAytI-mxfqp">
                                                        <p className="">Postal code</p>
                                                        <input
                                                            className=""
                                                            type="text"
                                                            autoComplete="postal-code"
                                                            placeholder="E.g. 11217"
                                                            name="postal-code"
                                                        />
                                                    </label>
                                                </form>
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className="_2UsfVIk8gJrdw8z8BGlvm1"
                                        style={{
                                            padding: "16px",
                                            position: "absolute",
                                            bottom: "0",
                                            flexDirection: "column",
                                            width: "100%"
                                        }}
                                    >
                                        <div
                                            className="_2RWrXWDlIFqxW5c9NTv-se _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88"
                                            style={{
                                                margin: "8px 0",
                                                justifyContent: "space-between",
                                                display: "flex"
                                            }}
                                        >
                                            <span>Tổng cộng</span>
                                            <span className="_1Pu2ailzs8h4eqVc792xOn">$10.00</span>
                                        </div>
                                        <div className="lLA-xJuEE5FVKeD8ezek3">
                                            <div>
                                                <div
                                                    className="_3X7RzVL6jzVBkctplBQ8Z"
                                                    style={{ display: "flex" }}
                                                >
                                                    {this.state.currentPrintStep > 1 && (
                                                        <button
                                                            style={{
                                                                marginRight: "5px"
                                                            }}
                                                            onClick={() => {
                                                                this.setState({
                                                                    currentPrintStep:
                                                                        this.state.currentPrintStep - 1
                                                                });
                                                            }}
                                                        >
                                                            Back
                            </button>
                                                    )}
                                                    <button
                                                        className="_2Rww-JOL60obmcYkaUOyg_ Wqfq1nAfa6if4eEOr6Mza _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _28oyZ-_qfE-ERg1G1Nc2zV Wqfq1nAfa6if4eEOr6Mza _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _3QJ_C8Lg1l0m5aoIK5piST _2kK9hFUTyqtMKr5EG4GuY4 _2HxAYUsq5GZ4sKqpZqoKLF"
                                                        title="Continue"
                                                        type="button"
                                                        onClick={() => this.handleContinueOrder()}
                                                        style={{
                                                            color: "white",
                                                            height: "40px",
                                                            borderRadius: "4px",
                                                            width: "100%",
                                                            border: "none",
                                                            backgroundColor: "rgb(1, 159, 182)"
                                                        }}
                                                    >
                                                        <span className="wDZfRbnecQOufIqcN2_A5">
                                                            Tiếp tục
                            </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {this.state.showMediaEditPopup ? (
                        <MediaEditPopup
                            item={this.state.editingMedia}
                            closePopup={() => {
                                this.setState({ showMediaEditPopup: false });
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
                    text='Click "Close Button" to hide popup'
                    handleDownloadPDF={this.downloadPDF.bind(this, false)}
                    handleDownloadJPG={this.downloadPNG.bind(this, false, false)}
                    handleDownloadPNGTransparent={this.downloadPNG.bind(this, true, true)}
                    handleDownloadPNG={this.downloadPNG.bind(this, false, true)}
                    handleDownloadPDFWithBleed={this.downloadPDF.bind(this, true)}
                    handleDownloadVideo={this.downloadVideo.bind(this)}
                    closePopup={() => {
                        this.setState({ showPopup: false });
                    }}
                />
            </div>
        );
    }
}

export default withTranslation(NAMESPACE)(CanvaEditor);
