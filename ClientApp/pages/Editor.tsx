import React, { Component } from "react";
import uuidv4 from "uuid/v4";
import {
    getBoundingClientRect,
    getCursorStyleWithRotateAngle,
    getCursorStyleForResizer
} from "@Utils";
import "@Styles/editor.scss";
import "@Styles/colorPicker.scss";
import axios from "axios";
import Popup from "@Components/shared/Popup";
import MediaEditPopup from "@Components/editor/MediaEditor";
import TemplateEditor from "@Components/editor/TemplateEditor";
import FontEditPopup from "@Components/editor/FontEditor";
import Globals from "@Globals";
import { Helmet } from "react-helmet";
import { toJS, IObservable, isAction } from "mobx";
import { observer } from "mobx-react";
import LeftSide from "@Components/editor/LeftSide";
import { withTranslation } from "react-i18next";
import editorTranslation from "@Locales/default/editor";
import Tooltip from "@Components/shared/Tooltip";
import { SubType, SidebarTab, Mode, TemplateType } from "@Components/editor/enums";
import Toolbar from "@Components/editor/toolbar/Toolbar";

import {
    centerToTL,
    tLToCenter,
    getNewStyle,
    degToRadian,
    updateTransformXY,
    updatePosition,
    updateRotate,
    isNode
} from "@Utils";
import loadable from "@loadable/component";
import { clone } from "lodash";
import editorStore from "@Store/EditorStore";
const DownloadIcon = loadable(() =>
    import("@Components/shared/svgs/DownloadIcon")
);
import { getLength, getAngle, getCursor } from "@Utils";

var Hammer;

// if (!isNode()) {
//   Hammer = require("hammerjs");
// }

import {
    fromEvent,
    merge,
    NEVER,
    Subject,
    BehaviorSubject,
    Observable,
    iif,
    concat,
    of,
    defer,
    async
} from "rxjs";
import {
    map,
    filter,
    scan,
    switchMap,
    startWith,
    takeUntil,
    ignoreElements,
    endWith,
    finalize,
    tap
} from "rxjs/operators";
import { render } from "react-dom";

const DownloadList = loadable(() => import("@Components/editor/DownloadList"));

const Home = loadable(() => import("@Components/shared/svgs/HomeIcon"));

const PosterReview = loadable(() => import("@Components/editor/PosterReview"));
const TrifoldReview = loadable(() =>
    import("@Components/editor/TrifoldReview")
);
const FlyerReview = loadable(() => import("@Components/editor/FlyerReview"));
const BusinessCardReview = loadable(() =>
    import("@Components/editor/BusinessCardReview")
);
const CanvasReview = loadable(() => import("@Components/editor/CanvasReview"));
const Canvas = loadable(() => import("@Components/editor/Canvas"));

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
    }
}

const thick = 16;
const imgWidth = 161;
const backgroundWidth = 103;

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

interface ImageObject {
    _id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    posX: number;
    imgHeight: number;
    posY: number;
    imgWidth: number;
    src: string;
    origin_width: number;
    origin_height: number;
    type: TemplateType;
    scaleX: number;
    scaleY: number;
    zIndex: number;
    page: string;
    backgroundColor: string;
    rotateAngle: number;
    document_object: any;
    selected: boolean;
    width2: number;
    height2: number;
    ref: any;
    innerHTML: string;
    color: string;
    opacity: number;
    childId: string;
}

interface StaticGuide {
    x: any;
    y: any;
}

interface Background {
    width: number;
    height: number;
    _id: string;
    color: string;
    representative: string;
    representativeThumbnail: string;
}

interface Template {
    id: string;
    document: any;
    fontList: any;
    color: string;
    width: number;
    height: number;
    representative: string;
    representativeThumbnail: string;
}

interface GroupedText {
    id: string;
    document: any;
    fontList: any;
    color: string;
    representative: string;
    width: number;
    height: number;
}

interface UserUpload {
    id: string;
    document: any;
    fontList: any;
    color: string;
    representative: string;
    width: number;
    height: number;
}

interface RemoveImage {
    representative: string;
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
    isSaving: boolean;
    fontName: string;
    fontId: string;
    childId: string;
    effectId: number;
    cropMode: boolean;
    updateRect: boolean;
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
}

const tex = `f(x) = \\int_{-\\infty}^\\infty\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi`;
const NAMESPACE = "editor";

@observer
class CanvaEditor extends Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
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
            updateRect: false,
            childId: null,
            fontName: "images/font-AvenirNextRoundedPro.png",
            fontId: "",
            isSaving: false,
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
        var a = document.getSelection();
        if (a && a.type === "Range") {
            document.execCommand("italic");
        } else {
            var childId = this.state.childId
                ? this.state.childId
                : this.state.idObjectSelected;
            var el = this.state.childId
                ? document.getElementById(childId)
                : document
                    .getElementById(childId)
                    .getElementsByClassName("text")[0];
            var sel = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(el);
            sel.removeAllRanges();
            sel.addRange(range);
            document.execCommand("italic");
            sel.removeAllRanges();
        }

        let italic;
        let image = toJS(editorStore.imageSelected);
        if (this.state.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == this.state.childId) {
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

        this.setState({
            italic,
        });
        editorStore.imageSelected = image;
        editorStore.images2.set(this.state.idObjectSelected, image);
        this.setState({selectedImage: {...image}});
    }

    handleBoldBtnClick = (e: any) => {
        e.preventDefault();
        var a = document.getSelection();
        if (a && a.type === "Range") {
            document.execCommand("bold");
        } else {
            var childId = this.state.childId
                ? this.state.childId
                : this.state.idObjectSelected;
            var el = this.state.childId
                ? document.getElementById(childId)
                : document
                    .getElementById(childId)
                    .getElementsByClassName("text")[0];
            var sel = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(el);
            sel.removeAllRanges();
            sel.addRange(range);
            document.execCommand("bold");
            sel.removeAllRanges();
        }

        let bold;
        let image = toJS(editorStore.imageSelected);
        if (this.state.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == this.state.childId) {
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

        this.setState({
            bold,
        });

        editorStore.imageSelected = image;
        editorStore.images2.set(this.state.idObjectSelected, image);
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
        e.preventDefault();
        this.setState({ cropMode: true });
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
        var canvas = this.canvas || (this.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    }

    getTextHeight = (text, font) => {
        // re-use canvas object for better performance
        var canvas = this.canvas || (this.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);

        return parseInt(context.font.match(/\d+/), 10);
    }

    handleFontSizeBtnClick = (e: any, fontSize: number) => {

        let image = toJS(editorStore.imageSelected);
        
        if (this.state.childId) {
            let text = image.document_object.find(text => text._id == this.state.childId);
            fontSize = fontSize / image.scaleY / text.scaleY;
        }

        var fonts = document
          .getElementById(this.state.idObjectSelected)
          .getElementsByClassName("font");

        if (this.state.childId) {
            fonts = document.getElementById(this.state.childId).getElementsByClassName("font");
        }

        console.log('fonts ', fonts);

        var width2 = 0, height2 = 0;


        var fontSizePx = fontSize + "px";
        var fontSizePt = fontSize + "pt";

        for (var i = 0; i < fonts.length; ++i) {
            var font = fonts[i];
            (font as HTMLElement).style.fontSize = fontSizePx;

            width2 = Math.max(width2, this.getTextWidth(font.innerHTML, fontSizePt + " " + editorStore.imageSelected.fontFace));
            height2 += this.getTextHeight(font.innerHTML, fontSizePt + " " + editorStore.imageSelected.fontFace);
        }

        if (!this.state.childId) {
            image.scaleX = 1;
            image.scaleY = 1;
            image.width = width2;
            image.origin_width = width2;
            image.height = height2;
            image.origin_height = height2;
            image.fontSize = fontSize;
            let hihi4 = document.getElementById(image._id + "hihi4");
            if (hihi4) {
                image.innerHTML = hihi4.innerHTML;
            } 
        } else {
            let el = document.getElementById(this.state.childId);
            if (el) {
                let texts = image.document_object.map(text => {
                    if (text._id == this.state.childId) {
                        text.innerHTML = el.innerHTML;
                        text.fontSize = fontSize;

                        fontSize = fontSize * image.scaleY * text.scaleY;
                    }
                    return text;
                });
                image.document_object = texts;
            } 
        }  

        editorStore.imageSelected = image;
        editorStore.images2.set(this.state.idObjectSelected, image);
            // return img;
        // });

        // var hihi4 = document.getElementById(_id + "hihi4");
        // if (hihi4) {
        //     hihi4.style.width = image.width / image.scaleX + "px";
        // }

        // editorStore.replace(tempImages);

        // // this.forceUpdate();

        // var scale = 6;
        // var a = document.getSelection();
        // if (a && a.type === "Range") {
        //     document.execCommand("FontSize", false, "7");
        // } else {
        //     var id = this.state.childId
        //         ? this.state.childId
        //         : this.state.idObjectSelected;
        //     var el = this.state.childId
        //         ? document.getElementById(id)
        //         : document
        //             .getElementById(id)
        //             .getElementsByClassName("text")[0];
        //     var sel = window.getSelection();
        //     var range = document.createRange();
        //     range.selectNodeContents(el);
        //     sel.removeAllRanges();
        //     sel.addRange(range);
        //     document.execCommand("FontSize", false, "7");
        //     sel.removeAllRanges();
        // }
        // var fonts = document.getElementsByTagName("font");
        // for (var i = 0; i < fonts.length; ++i) {
        //     var font = fonts[i];
        //     var div = document.createElement("div");
        //     div.className = "font";
        //     div.style.fontSize = font.style.fontSize;
        //     div.style.color = font.style.color;
        //     div.innerText = font.innerText;

        //     insertAfter(div, font);

        //     font.remove();
        // }

        console.log('fontSize handleFontSizeBtnClick', fontSize)

        this.setState({ fontSize: fontSize });

        (document.getElementById("fontSizeButton") as HTMLInputElement).value = fontSize.toString();
        if (this.state.childId) {
            this.onSingleTextChange(image, e, this.state.childId);
        }
    }

    handleAlignBtnClick = (e: any, type: string) => {
        e.preventDefault();
        var a = document.getSelection();
        let command;
        switch (type) {
            case "alignLeft":
                command = "JustifyLeft";
                break;
            case "alignCenter":
                command = "JustifyCenter";
                break;
            case "alignRight":
                command = "JustifyRight";
                break;
            default:
                return;
        }
        if (a && a.type === "Range") {
            document.execCommand(command, false, null);
        } else {
            var childId = this.state.childId
                ? this.state.childId
                : this.state.idObjectSelected;
            var el = this.state.childId
                ? document.getElementById(childId)
                : document
                    .getElementById(childId)
                    .getElementsByClassName("text")[0];
            var sel = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(el);
            sel.removeAllRanges();
            sel.addRange(range);
            document.execCommand(command, false, null);
            sel.removeAllRanges();
        }

        let image = toJS(editorStore.imageSelected);
        if (!this.state.childId) {
            image.align = type;
        } else {
            image.document_object = image.document_object.map(doc => {
                if (doc._id == childId) {
                    doc.align = type;
                }
                return doc;
            });
        }
        editorStore.imageSelected = image;
        editorStore.images2.set(this.state.idObjectSelected, image);

        this.setState({align: type});
    }

    handleOkBtnClick = (e: any) => {
        e.preventDefault();
        this.setState({ cropMode: false });
    }

    handleCancelBtnClick = (e: any) => {
        e.preventDefault();
        this.setState({ cropMode: false });
    }

    handleTransparentAdjust = (e: any) => {
        this.pauserTransparentPopup.next(true);
        this.pauser.next(true);
        (document.activeElement as HTMLElement).blur();
        e.preventDefault();
        var self = this;
        const onMove = e => {
            e.preventDefault();
            var rec1 = document
                .getElementById("myOpacity-3")
                .getBoundingClientRect();
            var rec2 = document.getElementById(
                "myOpacity-3slider"
            );
            var slide = e.pageX - rec1.left;
            var scale = (slide / rec1.width) * 100;
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

    async componentDidMount() {
        // Creating a pauser subject to subscribe to
        var screenContainerParent = document.getElementById(
            "screen-container-parent"
        );
        let doNoObjectSelected$ = fromEvent(screenContainerParent, "mouseup");

        this.pauser = new BehaviorSubject(false);

        const pausable = this.pauser.pipe(
            switchMap(paused => {
                return paused ? NEVER : doNoObjectSelected$;
            })
        );
        this.pauser.next(false);

        pausable.subscribe(e => {
            console.log('pausable ', e.target);
            if (e.target.id == "canvas") {
                this.doNoObjectSelected();
                this.selectBackground(e);
            } else if (e.target.id == "screen-container-parent" || this.state.idObjectSelected) {
                this.doNoObjectSelected();
            }
        });

        this.pauserTransparentPopup = new BehaviorSubject(false);

        let clickOnTransparentPopup$ = fromEvent(document, "mouseup");

        var ce = document.createElement.bind(document);
        var ca = document.createAttribute.bind(document);
        var ge = document.getElementsByTagName.bind(document);

        this.setState({
            canRenderClientSide: true,
            selectedTab: SidebarTab.Template
        });
        var self = this;
        setTimeout(() => {
            self.setState({ mounted: true });
        }, 1000);

        var screenContainerParentRect = getBoundingClientRect(
            "screen-container-parent"
        );
        var screenContainerRect = getBoundingClientRect("screen-container");

        const { width, height } = screenContainerParentRect;
        var scaleX = (width - 100) / this.state.rectWidth;
        var scaleY = (height - 100) / this.state.rectHeight;

        var staticGuides = {
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


        var fitScale =
            Math.min(scaleX, scaleY) === Infinity ? 1 : Math.min(scaleX, scaleY);

        editorStore.fontsList.forEach(id => {
            var style = `@font-face {
        font-family: '${id}';
        src: url('/fonts/${id}.ttf');
      }`;
            var styleEle = ce("style");
            var type = ca("type");
            type.value = "text/css";
            styleEle.attributes.setNamedItem(type);
            styleEle.innerHTML = style;
            var head = document.head || ge("head")[0];
            head.appendChild(styleEle);

            var link = ce("link");
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
            var style = `@font-face {
      font-family: '${id}';
      src: url('/fonts/${id}.ttf');
    }`;
            var styleEle = ce("style");
            var type = ca("type");
            type.value = "text/css";
            styleEle.attributes.setNamedItem(type);
            styleEle.innerHTML = style;
            var head = document.head || ge("head")[0];
            head.appendChild(styleEle);

            var link = ce("link");
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
        var self = this;
        var subtype;
        var template_id = this.props.match.params.template_id;

        if (template_id) {
            var url = `/api/Template/Get?id=${template_id}`;

            await axios
                .get(url)
                .then(res => {
                    if (res.data.errors.length > 0) {
                        throw new Error(res.data.errors.join("\n"));
                    }
                    var image = res.data;
                    var templateType = image.value.type;
                    var mode;
                    if (this.props.match.path == "/editor/design/:template_id") {
                        mode = Mode.CreateDesign;

                        if (templateType == TemplateType.TextTemplate) {
                            mode = Mode.EditTextTemplate;
                        }
                    } else if (templateType == TemplateType.Template) {
                        mode = Mode.EditTemplate;
                    } else if (templateType == TemplateType.TextTemplate) {
                        mode = Mode.EditTextTemplate;
                    }

                    var document = JSON.parse(image.value.document);
                    var scaleX = (width - 100) / document.width;
                    var scaleY = (height - 100) / document.height;
                    var staticGuides = {
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
                        var fontList = image.value.fontList.forEach(id => {
                            var style = `@font-face {
                font-family: '${id}';
                src: url('/fonts/${id}.ttf');
              }`;
                            var styleEle = ce("style");
                            var type = ca("type");
                            type.value = "text/css";
                            styleEle.attributes.setNamedItem(type);
                            styleEle.innerHTML = style;
                            var head = document.head || ge("head")[0];
                            head.appendChild(styleEle);

                            var link = ce("link");
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

                    editorStore.replace(images);
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
                        subtype: res.data.value.printType
                    });

                    var zIndexMax = 0;
                    images.forEach(img => {
                        zIndexMax = Math.max(zIndexMax, img.zIndex);
                    });

                    editorStore.upperZIndex = zIndexMax + 1;
                    editorStore.activePageId = res.data.value.pages[0];
                    editorStore.pages.replace(res.data.value.pages);
                })
                .catch(e => { });
        } else {
            self.setState({
                _id: uuidv4()
            });
        }

        if (this.props.match.params.subtype) {
            subtype = this.props.match.params.subtype;
            var rectWidth;
            var rectHeight;
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

            var scaleX = (width - 100) / rectWidth;
            var scaleY = (height - 100) / rectHeight;
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

    textOnMouseDown(e, doc) {
        console.log('textOnMouseDown')
        var scale = this.state.scale;
        var ce = document.createElement.bind(document);
        var ca = document.createAttribute.bind(document);
        var ge = document.getElementsByTagName.bind(document);

        e.preventDefault();
        var target = e.target.cloneNode(true);
        target.style.zIndex = "11111111111";
        target.style.width = e.target.getBoundingClientRect().width + "px";
        document.body.appendChild(target);
        var self = this;
        this.imgDragging = target;
        var posX = e.pageX - e.target.getBoundingClientRect().left;
        var dragging = true;
        var posY = e.pageY - e.target.getBoundingClientRect().top;

        const onMove = e => {
            if (dragging) {
                target.style.left = e.pageX - posX + "px";
                target.style.top = e.pageY - posY + "px";
                target.style.position = "absolute";
            }
        };

        const onUp = e => {
            dragging = false;
            var recs = document.getElementsByClassName("alo");
            var rec2 = this.imgDragging.getBoundingClientRect();
            for (var i = 0; i < recs.length; ++i) {
                var rec = recs[i].getBoundingClientRect();
                var rec3 = recs[i];
                if (
                    rec.left < e.pageX &&
                    e.pageX < rec.left + rec.width &&
                    rec.top < e.pageY &&
                    e.pageY < rec.top + rec.height
                ) {
                    var rectTop = rec.top;
                    var index = i;
                    var document2 = JSON.parse(doc.document);
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

                    document2.document_object = document2.document_object.map(doc => {
                        doc.color = "black";
                        return doc;
                    });

                    // let images = [...editorStore.images, document2];

                    if (doc.fontList) {
                        var fontList = doc.fontList.forEach(id => {
                            var style = `@font-face {
                  font-family: '${id}';
                  src: url('/fonts/${id}.ttf');
                }`;
                            var styleEle = ce("style");
                            var type = ca("type");
                            type.value = "text/css";
                            styleEle.attributes.setNamedItem(type);
                            styleEle.innerHTML = style;
                            var head = document.head || ge("head")[0];
                            head.appendChild(styleEle);

                            var link = ce("link");
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


                    // editorStore.addItem(document2, false);
                    editorStore.addItem2(document2);

                    this.handleImageSelected(document2);

                    var fonts = toJS(editorStore.fonts);
                    let tempFonts = [...fonts, ...doc.fontList];
                    editorStore.fonts.replace(tempFonts);

                    editorStore.increaseUpperzIndex();
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
        var fontsList = toJS(editorStore.fontsList);
        var font = fontsList.find(font => font.id === id);

        // var a = document.getSelection();
        // if (a && a.type === "Range") {
        //   document.execCommand("FontName", false, id);
        // } else {
        //   var childId = this.state.childId
        //     ? this.state.childId
        //     : this.state.idObjectSelected;
        //   var el = this.state.childId
        //     ? document.getElementById(childId)
        //     : document.getElementById(childId).getElementsByClassName("text")[0];
        //   var sel = window.getSelection();
        //   var range = document.createRange();
        //   range.selectNodeContents(el);
        //   sel.removeAllRanges();
        //   sel.addRange(range);
        //   document.execCommand("FontName", false, id);
        //   sel.removeAllRanges();
        // }

        // function insertAfter(newNode, referenceNode) {
        //   referenceNode.parentNode.className = "";
        //   referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        // }

        // var fonts = document.getElementsByTagName("font");
        // for (var i = 0; i < fonts.length; ++i) {
        //   var font1: any = fonts[i];
        //   font1.parentNode.style.fontFamily = id;
        //   font1.parentNode.innerText = font1.innerText;
        //   font1.remove();
        // }
        let el = document.getElementById(this.state.idObjectSelected + "hihi4");
        if (el) {
            el.style.fontFamily = id;
        }

        el = document.getElementById(this.state.childId + "text-container2");
        if( el) {
            el.style.fontFamily = id;
        }

        let image = toJS(editorStore.imageSelected);
        if (this.state.childId) {
            let newTexts = image.document_object.map(d => {
                if (d._id == this.state.childId) {
                    d.fontFace = id;
                }
                return d;
            });
            image.document_object = newTexts;
        }

        // let images = toJS(editorStore.images);
        // let tempImages = images.map(img => {
        //     if (img._id === this.state.idObjectSelected) {
        image.fontFace = id;
        image.fontRepresentative = font.representative;
        //     }
        //     return img;
        // });

        editorStore.imageSelected = image;
        editorStore.images2.set(this.state.idObjectSelected, image);

        // editorStore.images.replace(tempImages);

        this.setState({ 
            fontName: font.representative,
            fontId: font.id,
        });

        e.preventDefault();
        var style = `@font-face {
      font-family: '${id}';
      src: url('/fonts/${id}.ttf');
    }`;
        var styleEle = document.createElement("style");
        var type = document.createAttribute("type");
        type.value = "text/css";
        styleEle.attributes.setNamedItem(type);
        styleEle.innerHTML = style;
        var head = document.head || document.getElementsByTagName("head")[0];
        head.appendChild(styleEle);

        var link = document.createElement("link");
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
        this.setState({ showFontEditPopup: true, editingFont: item });
    };

    displayResizers = (show: Boolean) => {
        let opacity = show ? 1 : 0;
        var el = document.getElementById(this.state.idObjectSelected + "__");
        if (el) {
            var resizers = el.getElementsByClassName("resizable-handler-container");
            for (var i = 0; i < resizers.length; ++i) {
                var cur: any = resizers[i];
                cur.style.opacity = opacity;
            }

            var rotators = el.getElementsByClassName("rotate-container");
            for (var i = 0; i < rotators.length; ++i) {
                var cur: any = rotators[i];
                cur.style.opacity = opacity;
            }
        }
    };

    popuplateImageProperties = () => {
        let image = toJS(editorStore.imageSelected);
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

        this.popuplateImageProperties();

        e.stopPropagation();

        window.startX = e.clientX;
        window.startY = e.clientY;
        window.resizingInnerImage = false;
        window.resizing = true;

        this.pauser.next(true);

        var cursor = e.target.id;
        var type = e.target.getAttribute("class").split(" ")[0];
        let { scale } = this.state;
        const location$ = this.handleDragRx(e.target);
        let image = toJS(editorStore.imageSelected);
        window.image = image
        let { top: top2, left: left2, width: width2, height: height2 } = image;

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

        this.displayResizers(false);

        var cursorStyle = getCursorStyleForResizer(window.image.rotateAngle, d);

        var ell = document.getElementById("screen-container-parent2");
        ell.style.zIndex = "2";
        ell.style.cursor = cursorStyle;

        this.temp = location$
            .pipe(
                map(([x, y, eventName]) => ({
                    moveElLocation: [x, y, eventName]
                }))
            )
            .subscribe(
                ({ moveElLocation }) => {
                    var deltaX = moveElLocation[0] - window.startX;
                    var deltaY = moveElLocation[1] - window.startY;
                    const deltaL = getLength(deltaX, deltaY);
                    const alpha = Math.atan2(deltaY, deltaX);
                    const beta = alpha - degToRadian(image.rotateAngle);
                    const deltaW = (deltaL * Math.cos(beta)) / scale;
                    const deltaH = (deltaL * Math.sin(beta)) / scale;
                    let rotateAngle = image.rotateAngle;
                    let ratio = image.width / image.height;


                    let {
                        position: { centerX, centerY },
                        size: { width, height }
                    } = getNewStyle(
                        type,
                        { ...rect, rotateAngle },
                        deltaW,
                        deltaH,
                        type == "r" || type == "l" ? null : ratio,
                        10,
                        10
                    );

                    let style = centerToTL({ centerX, centerY, width, height, rotateAngle });

                    this.handleResize(
                        style,
                        false,
                        cursor,
                        this.state.idObjectSelected,
                        1,
                        1,
                        cursor,
                        editorStore.imageSelected.type,
                        e,
                        moveElLocation[2],
                    );
                },
                null,
                () => {
                    this.displayResizers(true);
                    window.resizing = false;
                    this.handleResizeEnd();
                    this.pauser.next(false);
                    this.forceUpdate();
                    ell.style.zIndex = "0";
                    ell.style.cursor = "default";
                }
            );
    };

    handleResizeEnd = () => {
        // this.temp.unsubscribe();

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


        editorStore.imageSelected = window.image;
        editorStore.images2.set(this.state.idObjectSelected, window.image);
        document.body.style.cursor = null;
    };

    switching = false;

    handleResize = (
        style,
        isShiftKey,
        type,
        _id,
        scaleX,
        scaleY,
        cursor,
        objectType,
        e,
        moveElLocation,
    ) => {
        const { scale } = this.state;
        let { top, left, width, height } = style;
        var switching = false;
        let image = window.image;
        var deltaLeft = left - image.left;
        var deltaTop = top - image.top;
        var deltaWidth = image.width - width;
        var deltaHeight = image.height - height;


        if (this.state.cropMode) {
            var t5 = false;
            var t8 = false;
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

            var t6 = false;
            var t7 = false;
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

        let {imgWidth, imgHeight, posX, posY} = toJS(editorStore.imageSelected);
        let image2 = toJS(editorStore.imageSelected);

        if ((objectType === TemplateType.Image || objectType === TemplateType.Video) && !this.state.cropMode) {
            var scaleWidth = image2.imgWidth / image2.width;
            var scaleHeight = image2.imgHeight / image2.height;
            var scaleLeft = image2.posX / image2.imgWidth;
            var scaleTop = image2.posY / image2.imgHeight;

            imgWidth -= scaleWidth * deltaWidth;
            imgHeight -= scaleHeight * deltaHeight;
            posX = scaleLeft * imgWidth;
            posY = scaleTop * imgHeight;

            var el = document.getElementById(_id + "1235");
            if (el) {
                el.style.width = imgWidth * scale + "px";
                el.style.height = imgHeight * scale + "px";
            }

            el = document.getElementById(_id + "1238");
            if (el) {
                el.style.width = imgWidth * scale + "px";
                el.style.height = imgHeight * scale + "px";
            }
        }

        if ((objectType === TemplateType.Image || objectType == TemplateType.Video) && this.state.cropMode) {
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
            } else if (objectType === TemplateType.TextTemplate && this.state.childId) {
                let text = image.document_object.find(text => text._id === this.state.childId);
                (document.getElementById("fontSizeButton") as HTMLInputElement).value = `${Math.round(text.fontSize * text.scaleY * window.scaleY)}`;
            }

            if (objectType == TemplateType.Heading || objectType == TemplateType.TextTemplate) {
                var rectalos = document.getElementsByClassName(_id + "scaleX-scaleY");
                for (var i = 0; i < rectalos.length; ++i) {
                    var cur: any = rectalos[i];
                    cur.style.transform = `scaleX(${window.scaleX}) scaleY(${window.scaleY})`;
                    cur.style.width = `calc(100%/${window.scaleX})`;
                    cur.style.height = `calc(100%/${window.scaleY})`;
                }
            }
        } else {
            if (objectType == TemplateType.Heading) {
                var rec = document
                    .getElementById(_id)
                    .getElementsByClassName("text")[0]
                    .getBoundingClientRect();
                var as = Math.abs(Math.sin((image.rotateAngle / 360) * Math.PI));
                var cs = Math.abs(Math.cos((image.rotateAngle / 360) * Math.PI));
                // var newHeight =
                //     (rec.height * cs - rec.width * as) / (cs ^ (2 - as) ^ 2);
                // height = newHeight / scale;
                // window.imageHeight = height;
                let newHeight = document.getElementById(_id).getElementsByClassName("text")[0].offsetHeight * image.scaleY;
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
                var maxHeight = 0;
                
                image.document_object.map(text => {
                    let textContainer2 = document.getElementById(text._id + "text-container2");
                    textContainer2.style.width = (width * text.width2) / image.scaleX * scale + "px";
                    textContainer2.getElementsByClassName("text")[0].style.width = 
                        (width * text.width2) / image.scaleX / text.scaleX + "px";
                });

                let texts = image.document_object.map(text => {
                    const h = document.getElementById(text._id).offsetHeight * text.scaleY;
                    maxHeight = Math.max(maxHeight, h + text.top);
                    text.height = h;
                    return text;
                });

                texts = texts.map(text => {
                    text.height2 = text.height / maxHeight;
                    let el = document.getElementById(text._id + "b2");
                    if (el) {
                        el.style.height = text.height2 * 100 + "%";
                        el.style.left = `${text.left/width * image.scaleX *100}%`;
                        el.style.top = `${text.top/(text.height / text.height2)*100}%`;
                    }

                    return text;
                });

                var newDocumentObjects = [];
                for (var i = 0; i < texts.length; ++i) {
                    var d = texts[i];
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

        var a = document.getElementsByClassName(_id + "aaaa");
        for (let i = 0; i < a.length; ++i) {
            var tempEl = a[i] as HTMLElement;
            tempEl.style.width = width * scale + "px";
            tempEl.style.height = height * scale + "px";
            tempEl.style.transform = `translate(${left * scale}px, ${top * scale}px) rotate(${image.rotateAngle ? image.rotateAngle : 0}deg)`;
        } 
        
        var b = document.getElementsByClassName(_id + "1236");
        for (let i = 0; i < b.length; ++i) {
            var tempEl = b[i] as HTMLElement;
            tempEl.style.transform = `translate(${posX * scale}px, ${posY * scale}px)`;
        }

        if (objectType === TemplateType.Heading) {
            var hihi4 = document.getElementById(_id + "hihi4");
            if (hihi4) {
                hihi4.style.width = width / window.scaleX + "px";
            }
        }

        if (switching) {
            this.handleResizeEnd();

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
        this.popuplateImageProperties();

        this.displayResizers(false);

        window.resizingInnerImage = true;
        window.startX = e.clientX;
        window.startY = e.clientY;
        window.resizing = true;
        this.pauser.next(true);

        var cursor = e.target.id;
        var type = e.target.getAttribute("class").split(" ")[0];
        let { scale } = this.state;
        const location$ = this.handleDragRx(e.target);

        let image = toJS(editorStore.imageSelected);
        window.image = image;
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

        var cursorStyle = getCursorStyleForResizer(image.rotateAngle, d);

        var ell = document.getElementById("screen-container-parent2");
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
                    var deltaX = moveElLocation[0] - window.startX;
                    var deltaY = moveElLocation[1] - window.startY;
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
                            false,
                            type,
                            this.state.idObjectSelected,
                            1,
                            1,
                            cursor,
                            editorStore.imageSelected.type,
                            e,
                            moveElLocation[2],
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
                            false,
                            type,
                            this.state.idObjectSelected,
                            1,
                            1,
                            cursor,
                            editorStore.imageSelected.type,
                            moveElLocation,
                        );
                    }
                },
                null,
                () => {
                    window.resizing = false;
                    this.handleResizeEnd();
                    // editorStore.imageSelected = window.image;
                    // editorStore.images2.set(this.state.idObjectSelected, window.image);
                    this.pauser.next(false);
                    this.displayResizers(true);
                    this.forceUpdate();
                    ell.style.zIndex = "0";
                }
            );
    };

    // Handle the actual miage
    handleImageResize = (
        style,
        isShiftKey,
        type,
        _id,
        scaleX,
        scaleY,
        cursor,
        objectType,
        moveElLocation
    ) => {
        let switching;
        const { scale } = this.state;
        let { left: posX, top: posY, width: imageimgWidth, height: imageimgHeight } = style;
        let image = window.image;
        if (
            image.height - posY - imageimgHeight > 0 &&
            image.width - posX - imageimgWidth > 0 &&
            type == "br"
        ) {
            window.resizingInnerImage = false;
            window.startX =
                document.getElementById(_id + "br").getBoundingClientRect().left + 10;
            window.startY =
                document.getElementById(_id + "br").getBoundingClientRect().top + 10;
            switching = true;
            imageimgHeight = -posY + image.height;
            imageimgWidth = -posX + image.width;
        } else if (
            image.height - posY > imageimgHeight &&
            posX <= 0 &&
            (type == "bl" || type == "br")
        ) {
            var rect = document.getElementById(_id + type).getBoundingClientRect();
            window.resizingInnerImage = false;
            window.startX = rect.left + 10;
            window.startY = rect.top + 10;
            switching = true;
            imageimgHeight = -posY + image.height;
        } else if (image.height - posY > imageimgHeight && posX > 0 && type == "bl") {
            var rect = document.getElementById(_id + type).getBoundingClientRect();
            window.resizingInnerImage = false;
            window.startX = rect.left + 10;
            window.startY = rect.top + 10;
            switching = true;
            posX = -posX;
            imageimgWidth -= posX;
            posX = 0;
            imageimgHeight = -posY + image.height;
        } else if (
            image.width - posX > imageimgWidth &&
            posY < 0 &&
            (type == "tr" || type == "br")
        ) {
            var rect = document.getElementById(_id + type).getBoundingClientRect();
            imageimgWidth = -posX + image.width;

            window.resizingInnerImage = false;
            window.startX = rect.left + 10;
            window.startY = rect.top + 10;
            switching = true;
        } else if (image.width - posX > imageimgWidth && posY > 0 && type == "tr") {

            var rect = document.getElementById(_id + type).getBoundingClientRect();

            window.resizingInnerImage = false;
            window.startX = rect.left + 10;
            window.startY = rect.top + 10;
            switching = true;
            posY = -posY;
            imageimgHeight -= posY;
            posY = 0;
            imageimgWidth = -posX + image.width;
        } else if (posY > 0 && posX <= 0 && (type == "tl" || type == "tr")) {

            var rect = document.getElementById(_id + type).getBoundingClientRect();

            window.resizingInnerImage = false;
            window.startX = rect.left + 10;
            window.startY = rect.top + 10;
            posY = -posY;
            imageimgHeight -= posY;
            posY = 0;
            switching = true;
        } else if (posX > 0 && posY <= 0 && (type == "tl" || type == "bl")) {
            var rect = document.getElementById(_id + type).getBoundingClientRect();
            window.resizingInnerImage = false;
            window.startX = rect.left + 10;
            window.startY = rect.top + 10;
            posX = -posX;
            imageimgWidth += posX;
            posX = 0;
            switching = true;
        } else if (posX > 1 && posY > 1 && type == "tl") {
            window.resizingInnerImage = false;
            var rect = document.getElementById(_id + "tl").getBoundingClientRect();
            window.startX = rect.left + rect.width / 2;
            window.startY = rect.top + rect.height / 2;
            posX = -posX;
            posY = -posY;
            imageimgHeight -= posY;
            imageimgWidth -= posX;
            posX = 0;
            posY = 0;
            switching = true;
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

        var el = document.getElementsByClassName(_id + "imgWidth");
        for (let i = 0; i < el.length; ++i) {
            var tempEl = el[i] as HTMLElement;
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
        let scale = this.state.scale;
        e.stopPropagation();
        this.displayResizers(false);

        let image = toJS(editorStore.imageSelected);
        window.image = image;
        window.rotateAngle = image.rotateAngle;

        var tip = document.getElementById("helloTip");
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

        window.rotating = true;

        const location$ = this.handleDragRx(e.target);

        const rect = document
            .getElementById(this.state.idObjectSelected)
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

        var ell = document.getElementById("screen-container-parent2");
        ell.style.zIndex = "2";

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

                    let rotateAngle = Math.round(image.rotateAngle + angle);
                    if (rotateAngle >= 360) {
                        rotateAngle -= 360;
                    } else if (rotateAngle < 0) {
                        rotateAngle += 360;
                    }
                    if (rotateAngle > 356 || rotateAngle < 4) {
                        rotateAngle = 0;
                    } else if (rotateAngle > 86 && rotateAngle < 94) {
                        rotateAngle = 90;
                    } else if (rotateAngle > 176 && rotateAngle < 184) {
                        rotateAngle = 180;
                    } else if (rotateAngle > 266 && rotateAngle < 274) {
                        rotateAngle = 270;
                    }
                    window.rotateAngle = rotateAngle;

                    var cursorStyle = getCursorStyleWithRotateAngle(rotateAngle);
                    ell.style.cursor = cursorStyle;

                    var a = document.getElementsByClassName(image._id + "aaaa");
                    for (let i = 0; i < a.length; ++i) {
                        var cur = a[i] as HTMLElement;
                        // cur.style.transform = `rotate(${rotateAngle}deg)`;
                        cur.style.transform = `translate(${image.left * scale}px, ${image.top * scale}px) rotate(${rotateAngle}deg)`;
                    }

                    var tip = document.getElementById("helloTip");
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
                    window.rotating = false;
                    this.displayResizers(true);
                    this.handleRotateEnd(this.state.idObjectSelected);
                    this.pauser.next(false);
                    ell.style.zIndex = "0";
                }
            );
    };

    handleRotateEnd = (_id: string) => {
        var tip = document.getElementById("helloTip");
        if (!tip) {
            tip = document.createElement("div");
        }
        document.body.removeChild(tip);
        window.image.rotateAngle = window.rotateAngle;
        editorStore.imageSelected = window.image;
        editorStore.images2.set(this.state.idObjectSelected, window.image);
    };

    canvasRect = null;
    temp = null;

    handleDragStart = (e, _id) => {
        window.startX = e.clientX;
        window.startY = e.clientY;
        const { scale } = this.state;

        var image = editorStore.images2.get(_id);
        window.startLeft = image.left * scale;
        window.startTop = image.top * scale;
        window.image = clone(image);
        window.posX = window.image.posX;
        window.posY = window.image.posY;
        window.imgWidth = window.image.imgWidth;
        window.imgHeight = window.image.imgHeight;

        if (_id != this.state.idObjectSelected) {
            this.handleImageSelected(window.image);
        }

        this.displayResizers(false);

        window.dragging = true;

        this.pauser.next(true);

        const location$ = this.handleDragRx(e.target);

        let ell = document.getElementById("screen-container-parent2");
        ell.style.zIndex = "2";
        // ell.style.cursor = "move";

        this.temp = location$
            .pipe(
                map(([x, y]) => ({
                    moveElLocation: [x, y]
                }))
            )
            .subscribe(
                ({ moveElLocation }) => {
                    ell.style.cursor = "move";
                    if (this.state.cropMode) {
                        this.handleImageDrag(
                            this.state.idObjectSelected,
                            moveElLocation[0],
                            moveElLocation[1]
                        );
                    } else {
                        this.handleDrag(
                            this.state.idObjectSelected,
                            moveElLocation[0],
                            moveElLocation[1]
                        );
                    }
                },
                null,
                () => {
                    window.dragging = false;
                    this.displayResizers(true);
                    this.handleDragEnd();
                    this.pauser.next(false);
                    ell.style.zIndex = "0";
                    ell.style.cursor = "default";
                }
            );
    };

    tranformImage = (image: any) => {
        var centerX = image.left + image.width / 2;
        var centerY = image.top + image.height / 2;

        if (!image.rotateAngle || image.rotateAngle === 0) {
            return {
                x: [centerX - image.width / 2, centerX, centerX + image.width / 2],
                y: [centerY - image.height / 2, centerY, centerY + image.height / 2]
            };
        } else {
            return {
                x: [centerX - image.height / 2, centerX, centerX + image.height / 2],
                y: [centerY - image.width / 2, centerY, centerY + image.width / 2]
            };
        }
    };

    handleImageDrag = (_id, clientX, clientY) => {
        const { scale } = this.state;

        var deltaX = clientX - window.startX;
        var deltaY = clientY - window.startY;

        var deg = degToRadian(window.image.rotateAngle);
        var newX = deltaY * Math.sin(deg) + deltaX * Math.cos(deg);
        var newY = deltaY * Math.cos(deg) - deltaX * Math.sin(deg);

        var newPosX = window.posX + newX / scale;
        var newPosY = window.posY + newY / scale;

        var img = window.image;
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

        var el = document.getElementsByClassName(_id + "imgWidth");
        for (let i = 0; i < el.length; ++i) {
            var tempEl = el[i] as HTMLElement;
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
                var x = e.clientX;
                var y = e.clientY;
                var eventName = e.type;
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
        var newLeft, newTop;
        var newLeft2, newTop2;
        var newLeft3, newTop3;
        var centerX, centerY;
        var left, top;
        var img;
        var updateStartPosX = false;
        var updateStartPosY = false;
        // let images = toJS(editorStore.images);
        var image = window.image;
        newLeft = (clientX - window.startX + window.startLeft) / scale;
        newTop = (clientY - window.startY + window.startTop) / scale;
        newLeft2 = newLeft + image.width / 2;
        newLeft3 = newLeft + image.width;
        newTop2 = newTop + image.height / 2;
        newTop3 = newTop + image.height;
        img = image;

        centerX = newLeft + image.width / 2;
        centerY = newTop + image.height / 2;
        left = newLeft;
        top = newTop;
        if (image.rotateAngle === 90 || image.rotateAngle === 270) {
            newLeft = centerX - image.height / 2;
            newTop = centerY - image.width / 2;
            newLeft2 = centerX;
            newLeft3 = centerX + image.height / 2;
            newTop2 = centerY;
            newTop3 = centerY + image.width / 2;
        }
        if (img.type === TemplateType.BackgroundImage) {
            return;
        }
        Array.from(editorStore.images2.values()).forEach(image => {
            if (image.page === img.page) {
                var imageTransformed = this.tranformImage(image);
                if (image._id !== _id) {
                    if (
                        !updateStartPosX &&
                        Math.abs(newLeft - imageTransformed.x[0]) < 5
                    ) {
                        left -= newLeft - imageTransformed.x[0];
                        image[0] = 1;
                        updateStartPosX = true;
                    } else if (
                        !updateStartPosX &&
                        Math.abs(newLeft2 - imageTransformed.x[0]) < 5
                    ) {
                        left -= newLeft2 - imageTransformed.x[0];
                        image[0] = 1;
                        updateStartPosX = true;
                    } else if (
                        !updateStartPosX &&
                        Math.abs(newLeft3 - imageTransformed.x[0]) < 5
                    ) {
                        left -= newLeft3 - imageTransformed.x[0];
                        image[0] = 1;
                        updateStartPosX = true;
                    } else {
                        image[0] = 0;
                    }

                    if (
                        !updateStartPosX &&
                        Math.abs(newLeft - imageTransformed.x[1]) < 5
                    ) {
                        left -= newLeft - imageTransformed.x[1];
                        image[1] = 1;
                        updateStartPosX = true;
                    } else if (
                        !updateStartPosX &&
                        Math.abs(newLeft2 - imageTransformed.x[1]) < 5
                    ) {
                        left -= newLeft2 - imageTransformed.x[1];
                        image[1] = 1;
                        updateStartPosX = true;
                    } else if (
                        !updateStartPosX &&
                        Math.abs(newLeft3 - imageTransformed.x[1]) < 5
                    ) {
                        left -= newLeft3 - imageTransformed.x[1];
                        image[1] = 1;
                        updateStartPosX = true;
                    } else {
                        image[1] = 0;
                    }

                    if (
                        !updateStartPosX &&
                        Math.abs(newLeft - imageTransformed.x[2]) < 5
                    ) {
                        left -= newLeft - imageTransformed.x[2];
                        image[2] = 1;
                        updateStartPosX = true;
                    } else if (
                        !updateStartPosX &&
                        Math.abs(newLeft2 - imageTransformed.x[2]) < 5
                    ) {
                        left -= newLeft2 - imageTransformed.x[2];
                        image[2] = 1;
                        updateStartPosX = true;
                    } else if (
                        !updateStartPosX &&
                        Math.abs(newLeft3 - imageTransformed.x[2]) < 5
                    ) {
                        left -= newLeft3 - imageTransformed.x[2];
                        image[2] = 1;
                        updateStartPosX = true;
                    } else {
                        image[2] = 0;
                    }

                    if (
                        !updateStartPosY &&
                        Math.abs(newTop - imageTransformed.y[0]) < 5
                    ) {
                        top -= newTop - imageTransformed.y[0];
                        image[3] = 1;
                        updateStartPosY = true;
                    } else if (
                        !updateStartPosY &&
                        Math.abs(newTop2 - imageTransformed.y[0]) < 5
                    ) {
                        top -= newTop2 - imageTransformed.y[0];
                        image[3] = 1;
                        updateStartPosY = true;
                    } else if (
                        !updateStartPosY &&
                        Math.abs(newTop3 - imageTransformed.y[0]) < 5
                    ) {
                        top -= newTop3 - imageTransformed.y[0];
                        image[3] = 1;
                        updateStartPosY = true;
                    } else {
                        image[3] = 0;
                    }

                    if (
                        !updateStartPosY &&
                        Math.abs(newTop - imageTransformed.y[1]) < 5
                    ) {
                        top -= newTop - imageTransformed.y[1];
                        image[4] = 1;
                        updateStartPosY = true;
                    } else if (
                        !updateStartPosY &&
                        Math.abs(newTop2 - imageTransformed.y[1]) < 5
                    ) {
                        top -= newTop2 - imageTransformed.y[1];
                        image[4] = 1;
                        updateStartPosY = true;
                    } else if (
                        !updateStartPosY &&
                        Math.abs(newTop3 - imageTransformed.y[1]) < 5
                    ) {
                        top -= newTop3 - imageTransformed.y[1];
                        image[4] = 1;
                        updateStartPosY = true;
                    } else {
                        image[4] = 0;
                    }

                    if (
                        !updateStartPosY &&
                        Math.abs(newTop - imageTransformed.y[2]) < 5
                    ) {
                        top -= newTop - imageTransformed.y[2];
                        image[5] = 1;
                        updateStartPosY = true;
                    } else if (
                        !updateStartPosY &&
                        Math.abs(newTop2 - imageTransformed.y[2]) < 5
                    ) {
                        top -= newTop2 - imageTransformed.y[2];
                        image[5] = 1;
                        updateStartPosY = true;
                    } else if (
                        !updateStartPosY &&
                        Math.abs(newTop3 - imageTransformed.y[2]) < 5
                    ) {
                        top -= newTop3 - imageTransformed.y[2];
                        image[5] = 1;
                        updateStartPosY = true;
                    } else {
                        image[5] = 0;
                    }

                    for (var ii = 0; ii < 6; ++ii) {
                        var el = document.getElementById(image._id + "guide_" + ii);
                        if (el) {
                            if (image[ii] == 1) {
                                el.style.display = "block";
                            } else {
                                el.style.display = "none";
                            }
                        }
                    }
                }
            }
            return image;
        });

        const { staticGuides } = this.state;
        var pageId = img.page;

        var x = staticGuides.x.map(v => {
            var e = v[0];
            if (!updateStartPosX && Math.abs(newLeft - e) < 5) {
                left -= newLeft - e;
                // v[1] = 1;
                var el = document.getElementById(v[1] + pageId);
                if (el) {
                    el.style.display = "block";
                }
                updateStartPosX = true;
            } else if (!updateStartPosX && Math.abs(newLeft3 - e) < 5) {
                left -= newLeft3 - e;
                // v[1] = 1;
                var el = document.getElementById(v[1] + pageId);
                if (el) {
                    el.style.display = "block";
                }
                updateStartPosX = true;
            } else if (!updateStartPosX && Math.abs(newLeft2 - e) < 5) {
                left -= newLeft2 - e;
                // v[1] = 1;
                var el = document.getElementById(v[1] + pageId);
                if (el) {
                    el.style.display = "block";
                }
                updateStartPosX = true;
            } else {
                var el = document.getElementById(v[1] + pageId);
                if (el) {
                    el.style.display = "none";
                }
                // v[1] = 0;
            }

            return v;
        });

        var y = staticGuides.y.map(v => {
            var e = v[0];
            if (!updateStartPosY && Math.abs(newTop - e) < 5) {
                top -= newTop - e;
                var el = document.getElementById(v[1] + pageId);
                if (el) {
                    el.style.display = "block";
                }
                updateStartPosY = true;
            } else if (!updateStartPosY && Math.abs(newTop3 - e) < 5) {
                top -= newTop3 - e;
                var el = document.getElementById(v[1] + pageId);
                if (el) {
                    el.style.display = "block";
                }
                updateStartPosY = true;
            } else if (!updateStartPosY && Math.abs(newTop2 - e) < 5) {
                top -= newTop2 - e;
                var el = document.getElementById(v[1] + pageId);
                if (el) {
                    el.style.display = "block";
                }
                updateStartPosY = true;
            } else {
                var el = document.getElementById(v[1] + pageId);
                if (el) {
                    el.style.display = "none";
                }
            }

            return v;
        });

        image.left = left;
        image.top = top;

        updatePosition.bind(this)(_id + "_", image);
        updatePosition.bind(this)(_id + "__", image);
    };

    handleDragEnd = () => {
        this.temp.unsubscribe();

        // let {
        //     staticGuides: { x, y }
        // } = this.state;

        // x = x.map(e => {
        //     e[1] = 0;
        //     return e;
        // });
        // y = y.map(e => {
        //     e[1] = 0;
        //     return e;
        // });

        editorStore.images2.set(window.image._id, window.image);
        editorStore.imageSelected = window.image;

        Array.from(editorStore.images2.values()).map(image => {
            for (var ii = 0; ii < 6; ++ii) {
                image[ii] = 0;
                var el = document.getElementById(image._id + "guide_" + ii);
                if (el) {
                    document.getElementById(image._id + "guide_" + ii).style.display =
                        "none";
                }
            }
        });
    };

    setAppRef = ref => (this.$app = ref);
    setContainerRef = ref => (this.$container = ref);

    elementIsVisible = (element, container, partial) => {
        var contHeight = container.offsetHeight,
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
        var docElem,
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
            const canvasRect = getBoundingClientRect("canvas");
            const { scale } = this.state;
            const startX = (screensRect.left + thick - canvasRect.left) / scale;
            const startY = (screensRect.top + thick - canvasRect.top) / scale;

            var pages = toJS(editorStore.pages);
            var activePageId = pages[0];
            if (pages.length > 1) {
                var container = document.getElementById("screen-container-parent");
                for (var i = 0; i < pages.length; ++i) {
                    var pageId = pages[i];
                    var canvas = document.getElementById(pageId);
                    if (canvas) {
                        if (this.elementIsVisible(canvas, container, true)) {
                            activePageId = pageId;
                        }
                    }
                }
            }

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

    selectBackground = (e) => {
        console.log('selectedBackground ', e.target);
        const canvasId = e.target.getAttribute("myattribute");
        this.setState({selectedCanvas: canvasId});
        // e.target.style.border = "1px solid black";
    }

    doNoObjectSelected = () => {
        console.log('doNoObjectSelected');
        if (editorStore.colorPickerVisibility.get()) {
            return;
        }
        // if (!this.state.rotating && !this.state.resizing) {
        // let images = editorStore.images.map(image => {
        //     image.selected = false;
        //     return image;
        // });
        if (editorStore.imageSelected) {
            var imageSelected = toJS(editorStore.imageSelected);
            imageSelected.selected = false;

            editorStore.images2.set(this.state.idObjectSelected, imageSelected);
        }


        // editorStore.images2.set(this.state.idObjectSelected, imageSelected);

        var selectedTab = this.state.selectedTab;
        if (this.state.selectedTab === SidebarTab.Font || this.state.selectedTab === SidebarTab.Color || this.state.selectedTab === SidebarTab.Effect) {
            selectedTab = SidebarTab.Image;
        }

        editorStore.doNoObjectSelected();

        this.setState({
            selectedCanvas: null,
            cropMode: false,
            selectedTab,
            idObjectSelected: null,
            typeObjectSelected: null,
            childId: null,
        });
        // }
    };

    removeImage(e) {
        var OSNAME = this.getPlatformName();
        if (
            this.state.idObjectSelected != "undefined" &&
            !e.target.classList.contains("text") &&
            ((e.keyCode === 8 && OSNAME == "Mac/iOS") ||
                (e.keyCode === 8 && OSNAME == "Windows"))
        ) {
            // let images = editorStore.images.filter(
            //     img => img._id !== this.state.idObjectSelected
            // );
            var id = this.state.idObjectSelected;
            this.doNoObjectSelected();
            editorStore.images2.delete(id);
            // editorStore.images2.delete(this)
            // editorStore.replace(images);
        }
    }

    handleImageHover = (img, event) => {
        editorStore.idObjectHovered = img._id;
        editorStore.imageHovered = img;
        let el = document.getElementById(img._id + "___");
        if (el) {
            // el.style.outline = 'rgb(0, 217, 225) solid 2px';
        }
    };

    handleApplyEffect = (effectId, offSet, direction, blur, textShadowTransparent, intensity, hollowThickness, color, filter) => {
        console.log('handleApplyEffect');
        var image = toJS(editorStore.imageSelected);
        if (!this.state.childId) {
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
            console.log('handleApplyEffect');
            let texts = image.document_object.map(text => {
                if (text._id == this.state.childId) {
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
        editorStore.images2.set(this.state.idObjectSelected, image);
        editorStore.imageSelected = image;

        this.setState({
            effectId,
        })
    }

    handleChangeHollowThicknessEnd = val => {
        let image = toJS(editorStore.imageSelected);
        if (this.state.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == this.state.childId) {
                    text.hollowThickness = val;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.hollowThickness = val;
        }
        editorStore.imageSelected = image;
        editorStore.images2.set(this.state.idObjectSelected, image);
    }

    handleChangeHollowThickness = (val) => {
        let el;
        if (this.state.childId) {
            el = document.getElementById(this.state.childId + "text-container3");
        } else {
            el = document.getElementById(this.state.idObjectSelected + "hihi4");
        }
        let image = toJS(editorStore.imageSelected);
        if (this.state.childId) {
            image = image.document_object.find(text => text._id == this.state.childId);
        }
        image.hollowThickness = val;
        el.style.webkitTextStroke = `${1.0 * image.hollowThickness / 100 * 4 + 0.1}px rgb(0, 0, 0)`;
    }

    handleChangeDirection = (val) => {
        let el;
        if (this.state.childId) {
            el = document.getElementById(this.state.childId + "text-container2");
        } else {
            el = document.getElementById(this.state.idObjectSelected + "hihi4");
        }
        let image = toJS(editorStore.imageSelected);
        if (this.state.childId) {
            image = image.document_object.find(text => text._id == this.state.childId);
        }
        image.direction = val;
        el.style.textShadow = image.effectId == 1 ? `rgba(25, 25, 25, ${1.0 * image.textShadowTransparent / 100}) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * image.blur / 100}px` :
        image.effectId == 2 ? `rgba(0, 0, 0, ${0.6 * image.intensity}) 0 8.9px ${66.75 * image.intensity / 100}px` : 
        image.effectId == 4 ? `rgb(128, 128, 128) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` : 
        image.effectId == 5  ? `rgba(0, 0, 0, 0.5) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
        image.effectId == 6 && `rgb(0, 255, 255) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI))}px 0px`;
    }

    handleChangeOffsetEnd = val => {
        let image = toJS(editorStore.imageSelected);
        if (this.state.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == this.state.childId) {
                    text.offSet = val;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.offSet = val;
        }
        editorStore.imageSelected = image;
        editorStore.images2.set(this.state.idObjectSelected, image);
    }

    handleChangeOffset = val => {
        let el;
        if (this.state.childId) {
            el = document.getElementById(this.state.childId + "text-container2");
        } else {
            el = document.getElementById(this.state.idObjectSelected + "hihi4");
        }
        let image = toJS(editorStore.imageSelected);
        if (this.state.childId) {
            image = image.document_object.find(text => text._id == this.state.childId);
        }
        image.offSet = val;
        el.style.textShadow = image.effectId == 1 ? `rgba(25, 25, 25, ${1.0 * image.textShadowTransparent / 100}) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * image.blur / 100}px` :
        image.effectId == 2 ? `rgba(0, 0, 0, ${0.6 * image.intensity}) 0 8.9px ${66.75 * image.intensity / 100}px` : 
        image.effectId == 4 ? `rgb(128, 128, 128) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` : 
        image.effectId == 5  ? `rgba(0, 0, 0, 0.5) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
        image.effectId == 6 && `rgb(0, 255, 255) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI))}px 0px`;
    }

    handleChangeDirectionEnd = val => {
        let image = toJS(editorStore.imageSelected);
        if (this.state.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == this.state.childId) {
                    text.direction = val;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.direction = val;
        }
        editorStore.imageSelected = image;
        editorStore.images2.set(this.state.idObjectSelected, image);
    }

    handleChangeBlur = (val) => {
        let el;
        if (this.state.childId) {
            el = document.getElementById(this.state.childId + "text-container2");
        } else {
            el = document.getElementById(this.state.idObjectSelected + "hihi4");
        }
        let image = toJS(editorStore.imageSelected);
        if (this.state.childId) {
            image = image.document_object.find(text => text._id == this.state.childId);
        }
        image.blur = val;
        el.style.textShadow = image.effectId == 1 ? `rgba(25, 25, 25, ${1.0 * image.textShadowTransparent / 100}) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * image.blur / 100}px` :
        image.effectId == 2 ? `rgba(0, 0, 0, ${0.6 * image.intensity}) 0 8.9px ${66.75 * image.intensity / 100}px` : 
        image.effectId == 4 ? `rgb(128, 128, 128) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` : 
        image.effectId == 5  ? `rgba(0, 0, 0, 0.5) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
        image.effectId == 6 && `rgb(0, 255, 255) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI))}px 0px`;
    }

    handleChangeBlurEnd = val => {
        let image = toJS(editorStore.imageSelected);
        if (this.state.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == this.state.childId) {
                    text.blur = val;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.blur = val;
        }
        editorStore.imageSelected = image;
        editorStore.images2.set(this.state.idObjectSelected, image);
    }

    handleChangeTextShadowTransparentEnd = (val) => {
        let image = toJS(editorStore.imageSelected);
        if (this.state.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == this.state.childId) {
                    text.textShadowTransparent = val;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.textShadowTransparent = val;
        }
        editorStore.imageSelected = image;
        editorStore.images2.set(this.state.idObjectSelected, image);
    }

    handleChangeTextShadowTransparent = val => {
        let el;
        if (this.state.childId) {
            el = document.getElementById(this.state.childId + "text-container2");
        } else {
            el = document.getElementById(this.state.idObjectSelected + "hihi4");
        }
        let image = toJS(editorStore.imageSelected);
        if (this.state.childId) {
            image = image.document_object.find(text => text._id == this.state.childId);
        }
        image.textShadowTransparent = val;
        el.style.textShadow = image.effectId == 1 ? `rgba(25, 25, 25, ${1.0 * image.textShadowTransparent / 100}) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * image.blur / 100}px` :
        image.effectId == 2 ? `rgba(0, 0, 0, ${0.6 * image.intensity}) 0 8.9px ${66.75 * image.intensity / 100}px` : 
        image.effectId == 4 ? `rgb(128, 128, 128) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` : 
        image.effectId == 5  ? `rgba(0, 0, 0, 0.5) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
        image.effectId == 6 && `rgb(0, 255, 255) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI))}px 0px`;
    }

    handleChangeIntensityEnd = val => {
        let image = toJS(editorStore.imageSelected);
        if (this.state.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == this.state.childId) {
                    text.intensity = val;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.intensity = val;
        }
        editorStore.imageSelected = image;
        editorStore.images2.set(this.state.idObjectSelected, image);
    }

    handleChangeIntensity = val => {
        let el;
        if (this.state.childId) {
            el = document.getElementById(this.state.childId + "text-container2");
        } else {
            el = document.getElementById(this.state.idObjectSelected + "hihi4");
        }
        let image = toJS(editorStore.imageSelected);
        if (this.state.childId) {
            image = image.document_object.find(text => text._id == this.state.childId);
        }
        image.intensity = val;
        el.style.textShadow = image.effectId == 1 ? `rgba(25, 25, 25, ${1.0 * image.textShadowTransparent / 100}) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * image.blur / 100}px` :
        image.effectId == 2 ? `rgba(0, 0, 0, ${0.6 * image.intensity}) 0 8.9px ${66.75 * image.intensity / 100}px` : 
        image.effectId == 4 ? `rgb(128, 128, 128) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` : 
        image.effectId == 5  ? `rgba(0, 0, 0, 0.5) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
        image.effectId == 6 && `rgb(0, 255, 255) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI))}px 0px`;
    }

    handleImageSelected = img => {
        console.log('handleImageSelected ',img);
        if (this.state.cropMode && img._id != this.state.idObjectSelected) {
            this.setState({ cropMode: false });
            this.doNoObjectSelected();
            return;
        }
        if (
            this.state.idObjectSelected &&
            img._id !== this.state.idObjectSelected
        ) {
            var temp = document.getElementById(this.state.idObjectSelected + "_1");
            if (temp) {
                temp.style.outline = null;
            }
        }
        if (img._id === this.state.idObjectSelected) {
            return;
        }

        if (editorStore.imageSelected && editorStore.imageSelected.type == TemplateType.Heading && this.state.selectedTab === SidebarTab.Color) {
            this.setState({selectedTab: SidebarTab.Image})
        } 

        if (img.backgroundColor) {
            this.setState({
                imgBackgroundColor: img.backgroundColor
            });
        }

        if (this.state.idObjectSelected) {
            var imgSelected = editorStore.images2.get(this.state.idObjectSelected);
            imgSelected.selected = false;
            editorStore.images2.set(this.state.idObjectSelected, imgSelected);
        }

        editorStore.idObjectSelected = img._id;
        editorStore.imageSelected = img;
        editorStore.idObjectHovered = null;
        editorStore.imageHovered = null;

        var imgSelected2 = editorStore.images2.get(img._id);
        imgSelected2.selected = true;
        editorStore.images2.set(img._id, imgSelected2);

        this.setState({
            fontColor: img.color, fontName: img.fontRepresentative, fontSize: Math.round(img.fontSize * img.scaleY * 10) / 10
        });

        img.selected = true;

        this.setState({
            selectedCanvas: null,
            effectId: img.effectId,
            italic: img.italic,
            bold: img.bold,
            align: img.align,
            selectedImage: img,
            idObjectSelected: img._id,
            typeObjectSelected: img.type,
            childId: null,
            fontId: img.fontFace,
            currentOpacity: img.opacity ? img.opacity : 100,
            currentLineHeight: img.lineHeight,
            currentLetterSpacing: img.letterSpacing,
        });
    };

    removeTemplate = e => {
        var url = `/api/Template/Delete?id=${this.state._id}`;
        fetch(url, {
            method: "DELETE"
        });
    };

    download = async (filename, text) => {
        var blobUrl = URL.createObjectURL(text);
        var element = document.createElement("a");

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
            var aloCloned = document.getElementsByClassName("alo2");
            var canvas = [];
            for (var i = 0; i < aloCloned.length; ++i) {
                canvas.push((aloCloned[i] as HTMLElement).outerHTML);
            }

            var styles = document.getElementsByTagName("style");
            var a = Array.from(styles).filter(style => {
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
                        additionalStyle: a[0].outerHTML
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
                var aloCloned = document.getElementsByClassName("alo2");
                var canvas = [];
                for (var i = 0; i < aloCloned.length; ++i) {
                    canvas.push((aloCloned[i] as HTMLElement).outerHTML);
                }

                var styles = document.getElementsByTagName("style");
                var a = Array.from(styles).filter(style => {
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

        var self = this;
        window.downloading = true;
        this.setState({ showPopup: true, downloading: true }, () => {
            var aloCloned = document.getElementsByClassName("alo2");
            var canvas = [];
            for (var i = 0; i < aloCloned.length; ++i) {
                canvas.push((aloCloned[i] as HTMLElement).outerHTML);
            }

            var styles = document.getElementsByTagName("style");
            var a = Array.from(styles).filter(style => {
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
        var _id;
        this.setState({ isSaving: true });
        const { mode } = this.state;
        var self = this;
        const { rectWidth, rectHeight } = this.state;

        let images = toJS(Array.from(editorStore.images2.values()));
        let tempImages = images.map(image => {
            image.width2 = image.width / rectWidth;
            image.height2 = image.height / rectHeight;
            image.selected = false;
            return image;
        });

        if (mode === Mode.CreateTextTemplate || mode === Mode.EditTextTemplate) {
            var newImages = [];
            for (var i = 0; i < images.length; ++i) {
                var image = images[i];
                if (!image.ref) {
                    newImages.push(...this.normalize(image, images));
                }
            }
            tempImages = newImages;
        }

        if (
            this.state.mode === Mode.CreateTextTemplate ||
            this.state.mode == Mode.EditTextTemplate
        ) {
            tempImages = images.map(img => {
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
            var url;
            var _id = self.state._id;

            if (mode == Mode.CreateDesign) {
                url = "/api/Template/Update";
            } else if (
                mode == Mode.CreateTemplate ||
                mode == Mode.CreateTextTemplate
            ) {
                url = "/api/Template/Add";
            } else if (mode == Mode.EditTemplate || mode == Mode.EditTextTemplate) {
                url = "/api/Template/Update";
            }

            var type;
            if (mode == Mode.CreateTextTemplate || mode == Mode.EditTextTemplate) {
                type = TemplateType.TextTemplate;
            } else if (mode == Mode.CreateTemplate || mode == Mode.EditTemplate) {
                type = TemplateType.Template;
            }

            var previousScale = self.state.scale;
            self.setState({ scale: 1, showPopup: true }, () => {
                var aloCloned = document.getElementsByClassName("alo");
                var canvas = [];
                for (var i = 0; i < aloCloned.length; ++i) {
                    canvas.push((aloCloned[i] as HTMLElement).outerHTML);
                }

                var aloCloned2 = document.getElementById("alo2");
                var canvas2 = [];
                if (aloCloned2) {
                    canvas2 = [aloCloned2.outerHTML];
                }

                var styles = document.getElementsByTagName("style");
                var a = Array.from(styles).filter(style => {
                    return style.attributes.getNamedItem("data-styled") !== null;
                });

                _id = self.state._id ? self.state._id : uuidv4();

                var res = JSON.stringify({
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
                    Canvas: canvas,
                    Canvas2: canvas2,
                    AdditionalStyle: a[0].outerHTML,
                    FilePath: "/templates",
                    FirstName: "Untilted",
                    Pages: toJS(editorStore.pages),
                    PrintType: self.state.subtype,
                    Representative: rep ? rep : `images/${_id}.jpeg`,
                    Representative2: `images/${_id}_2.jpeg`,
                    VideoRepresentative: `videos/${_id}.mp4`,
                    IsVideo: isVideo
                });

                axios
                    .post(url, res, {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    .then(res => {
                        self.setState({ isSaving: false });
                        // Ui.showInfo("Success");
                    })
                    .catch(error => {
                        // Ui.showErrors(error.response.statusText)
                    });
            });
        }, 300);

        return _id;
    }

    onTextChange(parentIndex, e, key) {
        const { scale } = this.state;
        let images = toJS(editorStore.images);
        let tempImages = images.map(image => {
            if (image._id === parentIndex) {
                var newHeight = 0;
                var changedText;
                var deltaY = 0;
                var scaleY = image.height / image.origin_height;

                let texts = image.document_object.map(text => {
                    if (text._id === key) {
                        changedText = { ...text };
                        text.innerHTML = e.target.innerHTML;
                        var rec = e.target.getBoundingClientRect();
                        deltaY = rec.height / this.state.scale / scaleY - text.height;
                        text.height = rec.height / this.state.scale / scaleY;
                    }
                    return text;
                });

                var text2 = [];
                for (var i = 0; i < texts.length; ++i) {
                    var d = texts[i];
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

        var target = e.target.cloneNode(true);

        target.style.zIndex = "11111111111";
        target.src = e.target.getElementsByTagName("source")[0].getAttribute("src");
        target.style.width = e.target.getBoundingClientRect().width + "px";
        document.body.appendChild(target);
        var self = this;
        this.imgDragging = target;
        var posX = e.pageX - e.target.getBoundingClientRect().left;
        var dragging = true;
        var posY = e.pageY - e.target.getBoundingClientRect().top;

        var recScreenContainer = document
            .getElementById("screen-container-parent")
            .getBoundingClientRect();
        var beingInScreenContainer = false;

        const onMove = e => {
            if (dragging) {
                var rec2 = self.imgDragging.getBoundingClientRect();
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

            var recs = document.getElementsByClassName("alo");
            var rec2 = self.imgDragging.getBoundingClientRect();
            var pages = toJS(editorStore.pages);
            for (var i = 0; i < recs.length; ++i) {
                var rec = recs[i].getBoundingClientRect();
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
                        zIndex: editorStore.upperZIndex + 1
                    };
                    // editorStore.addItem(newItem, false);
                    editorStore.addItem2(newItem);
                    this.handleImageSelected(newItem);
                    editorStore.increaseUpperzIndex();
                }
            }

            self.imgDragging.remove();
        };
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    }

    imgOnMouseDown(img, e) {
        e.preventDefault();
        var target = e.target.cloneNode(true);
        target.style.zIndex = "11111111111";
        target.src = img.representativeThumbnail
            ? img.representativeThumbnail
            : e.target.src;
        target.style.width = e.target.getBoundingClientRect().width + "px";
        target.style.backgroundColor = e.target.style.backgroundColor;
        document.body.appendChild(target);
        var self = this;
        this.imgDragging = target;
        var posX = e.pageX - e.target.getBoundingClientRect().left;
        var dragging = true;
        var posY = e.pageY - e.target.getBoundingClientRect().top;

        var recScreenContainer = document
            .getElementById("screen-container-parent")
            .getBoundingClientRect();
        var beingInScreenContainer = false;

        const onMove = e => {
            if (dragging) {
                var rec2 = self.imgDragging.getBoundingClientRect();
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

        const onUp = e => {
            dragging = false;
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);

            var recs = document.getElementsByClassName("alo");
            var rec2 = self.imgDragging.getBoundingClientRect();
            for (var i = 0; i < recs.length; ++i) {
                var rec = recs[i].getBoundingClientRect();
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

                    editorStore.addItem(newImg, false);
                    editorStore.addItem2(newImg);
                    this.handleImageSelected(newImg);

                    editorStore.increaseUpperzIndex();

                    // self.setState({upperZIndex: this.state.upperZIndex + 1, });
                }
            }

            self.imgDragging.remove();
        };
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    }

    setSelectionColor = (color, e) => {
        color = color.toString();
        if (e) {
            e.preventDefault();
        }
        if (editorStore.idObjectSelected){
            let image = toJS(editorStore.imageSelected);
            image.color = color;
            image.backgroundColor = color;
            if (this.state.childId) {
                let texts = image.document_object.map(d => {
                    if (d._id == this.state.childId) {
                        d.color = color;
                    }
                    return d;
                });
                image.document_object = texts;
            }
            editorStore.imageSelected = image;
            editorStore.images2.set(image._id, image);

            var fonts = document.getElementsByTagName("font");
            for (var i = 0; i < fonts.length; ++i) {
                var font1: any = fonts[i];
                font1.parentNode.style.color = color;
                font1.parentNode.innerText = font1.innerText;
                font1.remove();
            }

            this.setState({
                fontColor: color,
            })
        } else if (this.state.selectedCanvas) {
            console.log('aloalo');
            editorStore.pageColor.set(this.state.selectedCanvas, color);
            this.forceUpdate();
        };
    };
    
    colorPickerShown = () => {
        this.setState({colorPickerShown: true})
    }

    onSingleTextChange(thisImage, e, childId) {

        thisImage = toJS(thisImage);

        console.log('onSingleTextChange ', thisImage, childId)
        
        let target = e.target;
        if (childId) {
            target = document.getElementById(childId);
        }

        var scaleChildY = 1;
        if (childId) {
            for (var i = 0; i < thisImage.document_object.length; ++i) {
                if (thisImage.document_object[i]._id === childId) {
                    scaleChildY = thisImage.document_object[i].scaleY;
                }
            }
        }
        if (e) {
            e.persist();
        }
        setTimeout(() => {
            const { scale } = this.state;
            if (!childId) {
                let image = toJS(editorStore.imageSelected);
                let centerX = image.left + image.width / 2;
                let centerY = image.top + image.height / 2;
                // if (image.origin_height === 0) {
                //     image.scaleY = 0;
                // } else {
                //     image.scaleY = image.height / image.origin_height;
                // }
                image.width = target.offsetWidth * image.scaleX;

                let oldHeight = image.height;
                let a;
                if (thisImage.type === TemplateType.Heading) {
                    a = document.getElementById(thisImage._id)
                        .getElementsByClassName("text")[0] as HTMLElement;
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

                editorStore.imageSelected = image;
                editorStore.images2.set(this.state.idObjectSelected, image);
            } else {
                let image = toJS(editorStore.imageSelected);
                let centerX = image.left + image.width / 2;
                let centerY = image.top + image.height / 2;
                let texts = image.document_object.map(text => {
                    if (text._id === childId) {
                        text.innerHTML = target.innerHTML;
                        text.height = document.getElementById(text._id).offsetHeight * text.scaleY;
                        // text.height2 = Math.min(1, text.height / image.origin_height * text.scaleY);
                    }
                    return text;
                });

                // var newDocumentObjects = [];
                // for (var i = 0; i < texts.length; ++i) {
                //     var d = texts[i];
                //     if (!d.ref) {
                //         var imgs = this.normalize2(
                //             d,
                //             texts,
                //             image.scaleX,
                //             image.scaleY,
                //             this.state.scale,
                //             image.width,
                //             image.height
                //         );
                //         newDocumentObjects.push(...imgs);
                //     }

                // let texts = image.document_object.map(text => {
                //     const h = document.getElementById(text._id).offsetHeight
                //     maxHeight = Math.max(maxHeight, h + text.top);
                //     text.height = h * text.scaleY;
                //     return text;
                // });


                let maxHeight = 0;
                texts.forEach(text => {
                    const h = document.getElementById(text._id).offsetHeight * text.scaleY;
                    maxHeight = Math.max(maxHeight, h + text.top);
                    // maxHeight = Math.max(maxHeight, doc.top + doc.height);
                });

                texts = texts.map(text => {
                    text.height2 = text.height / maxHeight;
                    return text;
                });
                // newDocumentObjects = newDocumentObjects.map(text => {
                //     text.height2 = text.height / maxHeight;
                //     return text;
                // });
                console.log('maxHeight ', maxHeight);
                image.document_object = texts;
                var oldHeight = image.height;
                image.height = maxHeight * image.scaleY;
                // image.scaleY = image.height / image.origin_height;
                image.origin_height = image.height / image.scaleY;

                var tmp = image.height / 2 - oldHeight / 2;
                var deltacX = tmp * Math.sin(((360 - image.rotateAngle) / 180) * Math.PI);
                var deltacY = tmp * Math.cos(((360 - image.rotateAngle) / 180) * Math.PI);
                var newCenterX = centerX + deltacX;
                var newCenterY = centerY + deltacY;

                image.left = newCenterX - image.width / 2;
                image.top = newCenterY - image.height / 2;

                editorStore.imageSelected = image;
                editorStore.images2.set(this.state.idObjectSelected, image);
            }
        }, 0);
    }

    imgDragging = null;

    onClickDropDownList = e => {
        document.getElementById("myDropdown").classList.toggle("show");

        const onDown = e => {
            if (!e.target.matches(".dropbtn")) {
                var dropdowns = document.getElementsByClassName("dropdown-content");
                for (var i = 0; i < dropdowns.length; i++) {
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

    onDownClickTransparent = e => {
        if (!document.getElementById("myTransparent").contains(e.target)) {
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
        }
    };

    onClickTransparent = () => {

        document.getElementById("myTransparent").classList.toggle("show");

    };

    onClickpositionList = () => {
        document.getElementById("myPositionList").classList.toggle("show");

        const onDown = e => {
            if (!document.getElementById("myPositionList").contains(e.target)) {
            // if (!e.target.matches(".dropbtn-font-size")) {
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

    getPlatformName = () => {
        var OSName = "Unknown";
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
        var self = this;
        var minimumToolbarSize = 332;
        const onMove = e => {
            e.preventDefault();
            var toolbarSize = e.pageX;
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
        var result = [];
        var norm = (image, parent) => {
            var res = { ...image };
            if (parent != null) {
                var img = images.filter(img => img._id === image._id)[0];
                res.top = parent.top + img.margin_top + parent.height;
            }

            result.push(res);
            if (res.childId) {
                var child = images.filter(img => img._id === res.childId)[0];

                norm(child, res);
            }
        };

        norm(image, null);

        return result;
    }

    normalize(image: any, images: any): any {
        var result = [];
        var norm = (image, parent) => {
            var res = { ...image };
            if (parent != null) {
                var rec = getBoundingClientRect(parent._id);
                var rec3 = getBoundingClientRect(image._id);
                res.margin_top = (rec3.top - rec.bottom) / this.state.scale;
                res.margin_left = (rec3.left - rec.right) / this.state.scale;
            }
            result.push(res);
            if (res.childId) {
                var child = images.filter(img => img._id === res.childId)[0];
                norm(child, res);
            }
        };
        norm(image, null);

        return result;
    }

    uploadVideo = () => {
        var self = this;
        ``;
        var fileUploader = document.getElementById(
            "image-file"
        ) as HTMLInputElement;
        var file = fileUploader.files[0];
        var fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = () => {
            var url = `/api/Media/AddVideo`;
            axios.post(url, {
                id: uuidv4(),
                data: fr.result,
                type: TemplateType.Video
            });
        };
    };

    handleChildIdSelected = childId => {
        let align, effectId, bold, italic, fontId, fontColor;
        const image = toJS(editorStore.imageSelected);
        image.document_object.forEach(doc => {
            if (doc._id == childId) {
                console.log('doc ', doc);
                align = doc.align;
                effectId = doc.effectId;
                bold = doc.bold;
                italic = doc.italic;
                fontId = doc.fontFace;
                fontColor = doc.color;
            }
        });

        var fontsList = toJS(editorStore.fontsList);
        console.log('fontId fontlist', fontId, fontsList)
        var font = fontsList.find(font => font.id === fontId);

        let text = image.document_object.find(text => text._id == childId);

        this.setState({ 
            fontColor,
            childId, 
            align, 
            effectId,
            bold,
            italic,
            fontId,
            fontName: font ? font.representative : null,
            fontSize: Math.round(text.fontSize * image.scaleY * text.scaleY),
        });
    };

    handleFontSizeChange = fontSize => {
        console.log('handleFontSizeChange');
        this.setState({ fontSize });
    };

    handleFontColorChange = fontColor => {
        this.setState({ fontColor });
    };

    handleFontFamilyChange = fontId => {
        if (fontId) {
            var font = toJS(editorStore.fontsList).find(font => font.id === fontId);
            if (font) {
                this.setState({ 
                    fontName: font.representative,
                    fontId: fontId,
                });
            }
        }
    };

    enableCropMode = e => {
        this.setState({ cropMode: true });
    };

    toggleImageResizing = e => {
        // this.setState({ resizingInnerImage: !this.state.resizingInnerImage });
    };

    addAPage = (e, id) => {
        e.preventDefault();
        let pages = toJS(editorStore.pages);
        var newPageId = uuidv4();
        pages.splice(pages.findIndex(img => img === id) + 1, 0, newPageId);
        // this.setState({
        //   pages
        // });
        editorStore.pages.replace(pages);
        setTimeout(() => {
            document.getElementById(newPageId).scrollIntoView();
        }, 100);
    };

    forwardSelectedObject = id => {
        let image = toJS(editorStore.imageSelected);
        image.zIndex = editorStore.upperZIndex + 1;
        editorStore.imageSelected = image;
        editorStore.images2.set(this.state.idObjectSelected, image);
        // let images = toJS(editorStore.images);
        // let tempImages = images.map(img => {
        //     if (img._id === this.state.idObjectSelected) {
        //         img.zIndex = editorStore.upperZIndex + 1;
        //     }
        //     return img;
        // });

        // editorStore.images.replace(tempImages);
        editorStore.increaseUpperzIndex();

        // this.setState({ upperZIndex: this.state.upperZIndex + 1 });
    };

    backwardSelectedObject = id => {
        let image = toJS(editorStore.imageSelected);
        image.zIndex = 2;
        editorStore.imageSelected = image;

        // let images = toJS(editorStore.images);
        // let tempImages = images.map(img => {
        //     if (img._id === this.state.idObjectSelected) {
        //         img.zIndex = 2;
        //     } else {
        //         img.zIndex += 1;
        //     }
        //     return img;
        // });

        editorStore.images2.forEach((val, key) => {
            if (key == this.state.idObjectSelected) {
                val.zIndex = 2;
            } else {
                val.zIndex += 1;
            }
            editorStore.images2.set(key, val);
        });

        // editorStore.images.replace(tempImages);

        // this.setState({ upperZIndex: this.state.upperZIndex + 1 });
    };

    renderCanvas(preview, index, downloading) {
        var res = [];
        let pages = toJS(editorStore.pages);
        for (var i = 0; i < pages.length; ++i) {
            if (index >= 0 && i != index) {
                continue;
            }

            res.push(
                <Canvas
                    selected={pages[i] == this.state.selectedCanvas}
                    id={pages[i]}
                    translate={this.translate}
                    rotating={this.state.rotating}
                    numberOfPages={pages.length}
                    // resizing={this.state.resizing}
                    // dragging={this.state.dragging}
                    isSaving={this.state.isSaving}
                    downloading={downloading}
                    bleed={this.state.bleed}
                    key={i}
                    staticGuides={this.state.staticGuides}
                    index={i}
                    addAPage={this.addAPage}
                    images={Array.from(editorStore.images2.values()).filter(img => img.page === pages[i])}
                    mode={this.state.mode}
                    rectWidth={this.state.rectWidth}
                    rectHeight={this.state.rectHeight}
                    scale={downloading ? 1 : this.state.scale}
                    childId={this.state.childId}
                    cropMode={this.state.cropMode}
                    handleImageSelected={this.handleImageSelected}
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
                    handleResizeInnerImageStart={this.handleResizeInnerImageStart}
                    updateRect={this.state.updateRect}
                    doNoObjectSelected={this.doNoObjectSelected}
                    idObjectSelected={this.state.idObjectSelected}
                    selectedImage={this.state.selectedImage}
                    handleDeleteThisPage={this.handleDeleteThisPage.bind(this, pages[i])}
                    showPopup={this.state.showPopup}
                    preview={preview}
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
        var model;
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
            var fullName = this.refFullName.value;
            var address = this.refAddress.value;
            var city = this.refCity.value;
            var phoneNumber = this.refPhoneNumber.value;

            var rep = `images/${uuidv4()}.png`;

            this.saveImages(rep, false);

            var url = `/api/Order/Add`;
            var res = {
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
        console.log('handleLetterSpacingChangeEnd')
        let image = toJS(editorStore.imageSelected);
        image.height = window.imageHeight;
        image.letterSpacing = window.letterSpacing;
        image.origin_height = window.imageHeight / image.scaleY;
        editorStore.imageSelected = image;
        editorStore.images2.set(this.state.idObjectSelected, image);
    }

    handleLetterSpacingChange = letterSpacing => {
        console.log('handleLetterSpacingChange ', letterSpacing);
        let el = document.getElementById(this.state.idObjectSelected + "hihi4");
        if (el) {
            el.style.letterSpacing = `${1.0*letterSpacing/100*4}px`;
        }
        let image = toJS(editorStore.imageSelected);
        let height = el.offsetHeight;

        let a = document.getElementsByClassName(this.state.idObjectSelected + "aaaa");
        for (let i = 0; i < a.length; ++i) {
            let tempEl = a[i] as HTMLElement;
            tempEl.style.height = height * image.scaleY * this.state.scale + "px";
        } 

        window.imageHeight = height;
        window.letterSpacing = letterSpacing;
    };F

    handleLineHeightChangeEnd = (val) => {
        let lineHeight = 1.0 * val / 100 * 2 + 0.5;
        console.log('handleLineHeightChangeEnd ', lineHeight);
        let image = toJS(editorStore.imageSelected);
        let el = document.getElementById(this.state.idObjectSelected + "hihi4");
        let height = el.offsetHeight;
        if (el) {
            el.style.lineHeight = lineHeight.toString();
        }

        var a = document.getElementsByClassName(this.state.idObjectSelected + "aaaa");
        for (let i = 0; i < a.length; ++i) {
            var tempEl = a[i] as HTMLElement;
            tempEl.style.height = height * image.scaleY * this.state.scale + "px";
        } 
        image.lineHeight = lineHeight;
        image.height = height;
        image.origin_height = height / image.scaleY;
        editorStore.imageSelected = image;
        editorStore.images2.set(this.state.idObjectSelected, image);
    }

    handleLineHeightChange = val => {
        let lineHeight = 1.0 * val / 100 * 2 + 0.5;
        console.log('handleLineHeightChange ', lineHeight);
        let el = document.getElementById(this.state.idObjectSelected + "hihi4");
        let height = el.offsetHeight;
        let image = toJS(editorStore.imageSelected);
        if (el) {
            el.style.lineHeight = lineHeight.toString();
        }

        var a = document.getElementsByClassName(this.state.idObjectSelected + "aaaa");
        for (let i = 0; i < a.length; ++i) {
            var tempEl = a[i] as HTMLElement;
            tempEl.style.height = height * image.scaleY * this.state.scale + "px";
        } 

        window.lineHeight = lineHeight;
        window.imageHeight = height;
    };

    handleOpacityChangeEnd = () => {
        // var el = document.getElementById(this.state.idObjectSelected + "hihi4");
        // if (el) {
        //     el.style.opacity = (opacity / 100).toString();
        // }

        let opacity = window.opacity;

        let image = toJS(editorStore.imageSelected);
        image.opacity = opacity;
        editorStore.imageSelected = image;
        editorStore.images2.set(this.state.idObjectSelected, image);

        this.setState({
            currentOpacity: opacity,
        })
    }

    handleOpacityChange = opacity => {

        var el = document.getElementById(this.state.idObjectSelected + "hihi4");
        if (el) {
            el.style.opacity = (opacity / 100).toString();
        }

        window.opacity = opacity;
    };

    refFullName = null;
    refAddress = null;
    refCity = null;
    refPhoneNumber = null;

    render() {
        const { scale, rectWidth, rectHeight } = this.state;

        const adminEmail = "llaugusty@gmail.com";

        return (
            <div>
                <div
                    id="editor"
                    style={{ display: "flex", flexDirection: "column", height: "100%" }}
                >
                    <Helmet>
                        <title>{this.props.tReady && this.translate("design")}</title>
                    </Helmet>
                    <div
                        id="editor-navbar"
                        style={{
                            backgroundColor: "turquoise",
                            height: "55px",
                            padding: "5px",
                            display: "flex"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            {this.state.mounted && (
                                <a
                                    id="logo-editor"
                                    style={{
                                        color: "white",
                                        display: "inline-block",
                                        padding: "5px 8px 5px 5px",
                                        borderRadius: "6px",
                                        marginLeft: "5px"
                                    }}
                                    href="/"
                                >
                                    <span
                                        style={{
                                            alignItems: "center",
                                            display: "flex"
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                fontSize: "14px",
                                                fontFamily: "AvenirNextRoundedPro",
                                                fontWeight: 600,
                                            }}
                                        >
                                            <span>
                                                <Home width="24px" height="24px" />
                                            </span>
                                            {this.props.tReady ? this.translate("home") : ""}
                                        </div>
                                    </span>
                                </a>
                            )}
                        </div>
                        <div
                            style={{
                                position: "absolute",
                                right: 0,
                                display: "flex",
                                top: 0
                            }}
                        >
                            {Globals.serviceUser &&
                                Globals.serviceUser.username &&
                                Globals.serviceUser.username === adminEmail && (
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
                                )}
                            {Globals.serviceUser &&
                                Globals.serviceUser.username &&
                                Globals.serviceUser.username === adminEmail && (
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
                                )}
                            {this.props.tReady && (
                                <Tooltip
                                    offsetLeft={0}
                                    offsetTop={5}
                                    content={this.translate("download")}
                                    delay={10}
                                    style={{}}
                                    position="bottom"
                                >
                                    <button
                                        id="download-btn"
                                        onClick={this.handleDownloadList}
                                        style={{
                                            display: "flex",
                                            float: "right",
                                            color: "white",
                                            marginTop: "8px",
                                            marginRight: "10px",
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
                                            }}>{this.translate("download")}</p>
                                            <div
                                                style={{
                                                    width: "18px",
                                                }}>
                                                <DownloadIcon fill="white" width="18px" height="18px" />
                                            </div>
                                    </button>
                                </Tooltip>
                            )}
                            {this.props.tReady && (
                                <DownloadList
                                    downloadPNG={this.downloadPNG.bind(this)}
                                    downloadPDF={this.downloadPDF.bind(this)}
                                    downloadVideo={this.downloadVideo.bind(this)}
                                    translate={this.translate}
                                />
                            )}
                            {Globals.serviceUser &&
                                Globals.serviceUser.username &&
                                Globals.serviceUser.username === adminEmail && (
                                    <a
                                        onClick={e => {
                                            e.preventDefault();
                                            this.setState({ showPrintingSidebar: true });
                                        }}
                                        href="#"
                                        style={{
                                            float: "right",
                                            color: "white",
                                            backgroundColor: "#00000070",
                                            marginTop: "4px",
                                            marginRight: "6px",
                                            padding: "5px",
                                            borderRadius: "4px",
                                            textDecoration: "none",
                                            fontSize: "13px"
                                        }}
                                    >
                                        {" "}
                                        In ấn
                  </a>
                                )}
                        </div>
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
                        <LeftSide
                            effectId={this.state.effectId}
                            align={this.state.align}
                            pauser={this.pauser}
                            selectedImage={toJS(editorStore.imageSelected)}
                            colorPickerShown={this.colorPickerShown}
                            handleEditFont={this.handleEditFont}
                            scale={this.state.scale}
                            fontId={this.state.fontId}
                            tReady={this.props.tReady}
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
                            idObjectSelected={this.state.idObjectSelected}
                            childId={this.state.childId}
                            rectWidth={this.state.rectWidth}
                            rectHeight={this.state.rectHeight}
                            toolbarOpened={this.state.toolbarOpened}
                            toolbarSize={this.state.toolbarSize}
                            mode={this.state.mode}
                            selectedTab={this.state.selectedTab}
                            handleSidebarSelectorClicked={this.handleSidebarSelectorClicked}
                            handleImageSelected={this.handleImageSelected}
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
                        />
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
                            {this.state.toolbarOpened && (
                                <button
                                    onClick={e => {
                                        this.setState({ toolbarOpened: false });
                                    }}
                                ></button>
                            )}

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
                                childId={this.state.childId}
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
                                selectedImage={toJS(editorStore.imageSelected)}
                                fontSize={this.state.fontSize}
                                handleFontSizeBtnClick={this.handleFontSizeBtnClick}
                                handleAlignBtnClick={this.handleAlignBtnClick}
                                handleOkBtnClick={this.handleOkBtnClick}
                                handleCancelBtnClick={this.handleCancelBtnClick}
                                idObjectSelected={this.state.idObjectSelected}
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
                            <div
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
                                        {this.state.downloading && (
                                            <div
                                                style={{
                                                    display: "none"
                                                }}
                                            >
                                                {this.renderCanvas(false, -1, true)}
                                            </div>
                                        )}
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
                                                                var self = this;
                                                                this.setState({ showZoomPopup: true });
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
