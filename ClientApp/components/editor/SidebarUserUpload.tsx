import React, { Component } from 'react'
import { SidebarTab, TemplateType, SavingState, } from "./enums";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import ImagePicker from "@Components/shared/ImagePicker";
import Globals from '@Globals';
import Sidebar from "@Components/editor/SidebarStyled";
import axios from "axios";
import { isClickOutside } from '@Functions/shared/common';
import loadable from '@loadable/component';
const LoginPopup = loadable(() => import("@Components/shared/LoginPopup"));
import VideoPicker from "@Components/shared/VideoPicker2";
import ReactDOMServer from 'react-dom/server';
import { camelCase } from "lodash";
import {
    handleEditmedia,
    setSavingState,
} from "@Utils";

export interface IProps {
    scale: number;
    translate: any;
    selectedTab: any;
    handleImageSelected: any;
    setSavingState: any;
    updateImages: any;
}

export interface IState {
    items: any;
    isLoading: boolean;
    error: any;
    hasMore: boolean;
    total: number;
    loaded: boolean;
    tabSelected: number;
    videos: any;
    hasMoreVideos: boolean;
}

const imgWidth = 163;
const imgHeight = 120;

let getRem = (rem) => Array(rem).fill(0).map(i => {
    return {
        width: imgWidth,
        height: imgHeight,
        id: "sentinel-userupload",
    }
});

export default class SidebarUserUpload extends Component<IProps, IState> {
    state = {
        isLoading: false,
        items: [],
        error: null,
        hasMore: true,
        total: 0,
        loaded: false,
        tabSelected: 0,
        videos: [],
        hasMoreVideos: true,
    }

    constructor(props) {
        super(props);

        this.left = 30;
        this.state.items = getRem(this.left);
        this.state.videos = getRem(this.left);

        this.loadMore = this.loadMore.bind(this);
        this.imgOnMouseDown = this.imgOnMouseDown.bind(this);
        this.gradientOnMouseDown = this.gradientOnMouseDown.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.uploadImage2 = this.uploadImage2.bind(this);
        this.videoOnMouseDown = this.videoOnMouseDown.bind(this);
    }

    componentDidMount() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.selectedTab == SidebarTab.Upload) {
            if (!nextState.loaded) {
                this.loadMore(true);
            }
        }
        if (this.props.selectedTab != nextProps.selectedTab
            && (nextProps.selectedTab == SidebarTab.Upload || this.props.selectedTab == SidebarTab.Upload)
        ) {
            return true;
        }
        return false;
    }


    imgOnMouseDown(img, e) {

        e.preventDefault();

        let scale = this.props.scale;

        let target = e.target.cloneNode(true);
        target.style.zIndex = "11111111111";
        target.src = img.representativeThumbnail
            ? img.representativeThumbnail
            : e.target.src;
        window.imagesrc = target.src;
        target.style.width = e.target.getBoundingClientRect().width + "px";
        target.style.backgroundColor = e.target.style.backgroundColor;
        document.body.appendChild(target);
        let imgDragging = target;
        window.imgDragging = imgDragging;
        let posX = e.pageX - e.target.getBoundingClientRect().left;
        let dragging = true;
        let posY = e.pageY - e.target.getBoundingClientRect().top;
        let image = e.target;
        let recScreenContainer = document
            .getElementById("screen-container-parent")
            .getBoundingClientRect();
        let beingInScreenContainer = false;

        const onMove = e => {
            window.imagedragging = true;
            image.style.opacity = 0;
            image.parentNode.style.opacity = 0;
            target.style.pointerEvents = "none";

            if (dragging) {
                let rec2 = imgDragging.getBoundingClientRect();

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
            window.imagedragging = false;
            dragging = false;
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);

            let src = !img.representative.startsWith("data")
                ? window.location.origin + "/" + img.representative
                : img.representative;

            let rec2 = imgDragging.getBoundingClientRect();
            if (window.imageselected) {
                let ratio = rec2.width / rec2.height;
                imgDragging.remove();
                image.style.opacity = 1;
                image.parentNode.style.opacity = 1;

                let id = window.imageselected;
                let image2 = editorStore.images2.get(id);
                image2.src = src;
                image2.selected = false;
                image2.hovered = false;
                image2.posX = 0;
                image2.posY = 0;
                window.oldTransform = "translate(0px, 0px)";

                let clipScale = image2.width / image2.clipWidth;

                image2.imgWidth = image2.width;
                image2.imgHeight = image2.width / ratio;
                window.oldWidth = image2.imgWidth / clipScale + "px";
                window.oldHeight = image2.imgHeight / clipScale + "px";

                if (image2.imgHeight < image2.height) {
                    image2.imgWidth = image2.height * ratio;;
                    image2.imgHeight = image2.height;
                    window.oldWidth = image2.imgWidth / clipScale + "px";
                    window.oldHeight = image2.imgHeight / clipScale + "px";
                }

                this.props.updateImages(id, image2.page, image2, true);
                editorStore.images2.set(id, image2);
                return;
            }

            let recs = document.getElementsByClassName("alo");
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
                        width: rec2.width / scale,
                        height: rec2.height / scale,
                        origin_width: rec2.width / scale,
                        origin_height: rec2.height / scale,
                        left: (rec2.left - rec.left) / scale,
                        top: (rec2.top - rec.top) / scale,
                        rotateAngle: 0.0,
                        src,
                        srcThumnail: img.representativeThumbnail,
                        backgroundColor: target.style.backgroundColor,
                        selected: true,
                        scaleX: 1,
                        scaleY: 1,
                        posX: 0,
                        posY: 0,
                        imgWidth: rec2.width / scale,
                        imgHeight: rec2.height / scale,
                        page: editorStore.pages[i],
                        zIndex: editorStore.upperZIndex + 1,
                        freeStyle: img.freeStyle
                    };

                    setSavingState(SavingState.UnsavedChanges, true);
                    editorStore.addItem2(newImg, false);
                    editorStore.increaseUpperzIndex();

                    this.props.handleImageSelected(newImg._id, editorStore.pages[i], false, true, false);
                }
            }

            imgDragging.remove();

            image.style.opacity = 1;
            image.parentNode.style.opacity = 1;
        };
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    }

    tmp = [];
    videoTmp = [];
    sum = 0;
    left = 10;

    loadMore = (initialLoad: Boolean) => {
        const PER_PAGE = 25;
        const pageId = Math.floor((this.state.items.length - this.left + this.tmp.length) / PER_PAGE) + 1;
        this.setState({ isLoading: true, error: undefined, loaded: true, });
        const url = `/api/Media/Search?type=${TemplateType.UserUpload}&page=${pageId}&perPage=${PER_PAGE}&userEmail=${Globals.serviceUser ? Globals.serviceUser.username : ""}`;
        fetch(url)
            .then(res => res.json())
            .then(
                res => {
                    var result = res.value.key;
                    let items = [];

                    for (let i = 0; i < result.length; ++i) {
                        this.sum += 1.0 * result[i].width / result[i].height;
                        this.tmp.push(result[i]);
                        let height = (334 - (this.tmp.length - 1) * 8) / this.sum;
                        if (height < 160 && this.tmp.length > 1) {
                            this.sum = 0;
                            for (let j = 0; j < this.tmp.length; ++j) {
                                this.tmp[j].width = this.tmp[j].width / this.tmp[j].height * height;
                                this.tmp[j].height = height;
                            }
                            items.push(...this.tmp);
                            this.tmp = [];
                        }
                    }

                    let newItems = [...this.state.items.filter(item => item.id != "sentinel-userupload"), ...items];
                    let hasMore = newItems.length + this.tmp.length < res.value.value;
                    if (hasMore) {
                        newItems = [...newItems, ...getRem(this.left)];
                    }

                    this.setState(state => ({
                        items: newItems,
                        isLoading: false,
                        total: res.value.value,
                        hasMore: hasMore,
                    }));

                    this.forceUpdate();
                },
                error => {
                    this.setState({ isLoading: false, error });
                }
            );
    };

    uploadVideo = () => {
        console.log('uploadVideo')
        var self = this;
        ``;
        var fileUploader = document.getElementById(
            "image-file2"
        ) as HTMLInputElement;
        var file = fileUploader.files[0];
        var fr = new FileReader();
        fr.readAsDataURL(file);

        var vid = document.createElement("video");

        fr.onload = () => {
            var vid = document.createElement("video");
            vid.src = URL.createObjectURL(file);
            vid.onloadedmetadata = () => {
                var url = `/api/Media/AddVideo`;
                axios.post(url, {
                    id: uuidv4(),
                    data: fr.result,
                    type: TemplateType.UserUploadVideo,
                    ext: file.name.split(".")[1],
                    width: vid.videoWidth,
                    height: vid.videoHeight,
                    duration: vid.duration == Infinity ? 0 : vid.duration,
                    userEmail: Globals.serviceUser ? Globals.serviceUser.username : "admin@draft.vn",
                });
            }
        };
    };

    uploadImage2 = (removeBackground, e) => {
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
            "image-file2"
        ) as HTMLInputElement;
        for (let i = 0; i < fileUploader.files.length; ++i) {
            let file = fileUploader.files[i];
            let fr = new FileReader();
            let fr2 = new FileReader();
            fr.readAsDataURL(file);
            fr2.readAsText(file);
            // fr2.onload = () => {
            fr.onload = () => {
                var url = `/api/Media/Add`;
                if (type === TemplateType.RemovedBackgroundImage) {
                    url = `/api/Media/Add2`;
                }
                var img = new Image();

                img.onload = function () {
                    document.body.appendChild(img);
                    let colorsMapping = {};
                    let cnt = 1;
                    let stopColor = [];
                    function processChildren(children) {
                        return Array.from(children.length ? children : []).map(
                            (node: any, i) => {
                                // return if text node
                                if (node.nodeType == 8 || node.nodeType == 10) return null;
                                if (node.nodeType === 3) return node.nodeValue;
                                // collect all attributes
                                if (node.attributes) {
                                    let attributes = Array.from(node.attributes).reduce((attrs, attr: any) => {
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
                                                !attr.value.startsWith(`url(#SVGID_`)) {
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

                    let item = {
                        id: uuidv4(),
                        representativeThumbnail: fr.result,
                        representative: fr.result,
                        width: img.width,
                        height: img.height,
                        showProgressBar: true,
                    }

                    let newItems = [item, ...self.state.items];
                    let sum = 0;
                    let tmp = [];
                    let items = [];
                    for (let i = 0; i < newItems.length; ++i) {
                        sum += 1.0 * newItems[i].width / newItems[i].height;
                        tmp.push(newItems[i]);
                        let height = (334 - (tmp.length - 1) * 8) / sum;
                        if (height < 160 && tmp.length > 1) {
                            sum = 0;
                            for (let j = 0; j < tmp.length; ++j) {
                                tmp[j].width = tmp[j].width / tmp[j].height * height;
                                tmp[j].height = height;
                            }
                            items.push(...tmp);
                            tmp = [];
                        }
                    }


                    self.setState({
                        items,
                    });

                    self.forceUpdate();

                    const parser = new DOMParser();
                    let elXML: any = fr2.result.toString();
                    for (let i = 0; i < 26; ++i) {
                        let c = String.fromCharCode(97 + i);
                        elXML = elXML.replaceAll(`id="${c}"`, `id="SVGID_${i + 1}_"`);
                        elXML = elXML.replaceAll(`url(#${c})`, `url(#SVGID_${i + 1}_)`);
                    }
                    const xmlDoc = parser.parseFromString(elXML, 'text/xml');

                    let ABC = processChildren(Array.from(xmlDoc.childNodes));

                    let keyword = (document.getElementById("keywords") as HTMLInputElement).value;

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
                            keywords: [keyword],
                            title: "Manh quynh",
                            quality: keyword == "Grids" ? 100 : 50,
                        }).then((res) => {
                            res.data.showProgressBar = false;
                            let items = [...self.state.items];
                            res.data.width = items[0].width;
                            res.data.height = items[0].height;
                            items[0] = res.data;

                            self.setState({ items })

                            self.forceUpdate();
                        });
                };

                img.src = fr.result.toString();
            };
        }

        this.forceUpdate();
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
            "image-file2"
        ) as HTMLInputElement;
        for (let i = 0; i < fileUploader.files.length; ++i) {
            let file = fileUploader.files[i];
            let fr = new FileReader();
            let fr2 = new FileReader();
            fr.readAsDataURL(file);
            fr2.readAsText(file);
            fr.onload = () => {
                var url = `/api/Media/Add`;
                if (type === TemplateType.RemovedBackgroundImage) {
                    url = `/api/Media/Add2`;
                }
                var img = new Image();
                img.onload = function () {

                    let item = {
                        id: uuidv4(),
                        representativeThumbnail: fr.result,
                        representative: fr.result,
                        width: img.width,
                        height: img.height,
                        showProgressBar: true,
                    }

                    let newItems = [item, ...self.state.items];
                    let sum = 0;
                    let tmp = [];
                    let items = [];
                    for (let i = 0; i < newItems.length; ++i) {
                        sum += 1.0 * newItems[i].width / newItems[i].height;
                        tmp.push(newItems[i]);
                        let height = (334 - (tmp.length - 1) * 8) / sum;
                        if (height < 160 && tmp.length > 1) {
                            sum = 0;
                            for (let j = 0; j < tmp.length; ++j) {
                                tmp[j].width = tmp[j].width / tmp[j].height * height;
                                tmp[j].height = height;
                            }
                            items.push(...tmp);
                            tmp = [];
                        }
                    }


                    self.setState({
                        items,
                    });

                    self.forceUpdate();

                    axios
                        .post(url, {
                            id: uuidv4(),
                            ext: file.name.split(".")[1],
                            userEmail: Globals.serviceUser ? Globals.serviceUser.username : "admin@draft.vn",
                            data: fr.result,
                            width: img.width,
                            height: img.height,
                            type,
                            keywords: [(document.getElementById("keywords") as HTMLInputElement).value],
                            title: "Manh quynh"
                        })
                        .then((res) => {
                            res.data.showProgressBar = false;
                            let items = [...self.state.items];
                            res.data.width = items[0].width;
                            res.data.height = items[0].height;
                            items[0] = res.data;

                            self.setState({ items })

                            self.forceUpdate();
                        });
                };

                img.src = fr.result.toString();
            };
        }

        this.forceUpdate();
    };

    handleLogin = () => {
        const logInPopup = document.getElementById("logInPopup");
        const logInPopupLeft = document.getElementById("logInPopupLeft");
        const logInPopupRight = document.getElementById("logInPopupRight");
        logInPopup.style.display = "block";
        const onDown = e => {
            if (isClickOutside(e, logInPopupLeft) && isClickOutside(e, logInPopupRight)) {
                logInPopup.style.display = "none";
                document.removeEventListener("mouseup", onDown);
            }
        };

        document.addEventListener("mouseup", onDown);
        // document.getElementById("editor").classList.add("popup");
    }

    handleLoginSuccess = (user) => {
        window['publicSession'] = { serviceUser: user, locale: this.state.locale };
        Globals.reset();
        Globals.init({ public: window['publicSession'] });
        this.loadMore(true);
    }


    videoOnMouseDown(e, item) {
        const { scale } = this.props;
        e.preventDefault();

        let target = e.target.cloneNode(true);

        target.style.zIndex = "11111111111";
        target.src = e.target.getAttribute("src");
        target.style.width = e.target.getBoundingClientRect().width + "px";
        document.body.appendChild(target);
        let self = this;
        let imgDragging = target;
        let posX = e.pageX - e.target.getBoundingClientRect().left;
        let dragging = true;
        let posY = e.pageY - e.target.getBoundingClientRect().top;

        let recScreenContainer = document
            .getElementById("screen-container-parent")
            .getBoundingClientRect();
        let beingInScreenContainer = false;

        const onMove = e => {
            if (dragging) {
                let rec2 = imgDragging.getBoundingClientRect();
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
            let rec2 = imgDragging.getBoundingClientRect();
            let pages = editorStore.pages;
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
                        width: rec2.width / scale,
                        height: rec2.height / scale,
                        origin_width: rec2.width / scale,
                        origin_height: rec2.height / scale,
                        left: (rec2.left - rec.left) / scale,
                        top: (rec2.top - rec.top) / scale,
                        rotateAngle: 0.0,
                        src: window.location.origin + "/" + item.representative,
                        selected: false,
                        scaleX: 1,
                        scaleY: 1,
                        posX: 0,
                        posY: 0,
                        imgWidth: rec2.width / scale,
                        imgHeight: rec2.height / scale,
                        page: pages[i],
                        zIndex: editorStore.upperZIndex + 1,
                        paused: true,
                    };

                    setSavingState(SavingState.UnsavedChanges, true);
                    editorStore.addItem2(newItem, false);
                    editorStore.increaseUpperzIndex();

                    this.props.handleImageSelected(newItem._id, newItem.page, false, true, false);

                }
            }

            imgDragging.remove();
        };
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    }

    gradientOnMouseDown(img, el, e) {
        console.log('gradientOnMouseDown', el)
        let scale = this.props.scale;

        let target = el.cloneNode(true);
        target.style.zIndex = "11111111111";
        target.src = img.representativeThumbnail
            ? img.representativeThumbnail
            : el.src;
        target.style.width = el.getBoundingClientRect().width + "px";
        target.style.backgroundColor = el.style.backgroundColor;
        document.body.appendChild(target);
        let imgDragging = target;
        let posX = e.pageX - el.getBoundingClientRect().left;
        let dragging = true;
        let posY = e.pageY - el.getBoundingClientRect().top;
        let image = el;
        let recScreenContainer = document
            .getElementById("screen-container-parent")
            .getBoundingClientRect();
        let beingInScreenContainer = false;

        const onMove = e => {
            console.log('onMove')
            window.imagedragging = true;
            image.style.opacity = 0;
            if (dragging) {
                let rec2 = imgDragging.getBoundingClientRect();
                // if (
                //     beingInScreenContainer === false &&
                //     recScreenContainer.left < rec2.left &&
                //     recScreenContainer.right > rec2.right &&
                //     recScreenContainer.top < rec2.top &&
                //     recScreenContainer.bottom > rec2.bottom
                // ) {
                //     beingInScreenContainer = true;

                //     setTimeout(() => {
                //         target.style.transitionDuration = "";
                //     }, 50);
                // }

                // if (
                //     beingInScreenContainer === true &&
                //     !(
                //         recScreenContainer.left < rec2.left &&
                //         recScreenContainer.right > rec2.right &&
                //         recScreenContainer.top < rec2.top &&
                //         recScreenContainer.bottom > rec2.bottom
                //     )
                // ) {
                //     beingInScreenContainer = false;

                //     setTimeout(() => {
                //         target.style.transitionDuration = "";
                //     }, 50);
                // }

                target.style.left = e.pageX - posX + "px";
                target.style.top = e.pageY - posY + "px";
                target.style.position = "absolute";
            }
        };

        const onUp = evt => {
            console.log('onUp')
            window.imagedragging = false;
            dragging = false;
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);

            let recs = document.getElementsByClassName("alo");
            let rec2 = imgDragging.getBoundingClientRect();
            for (let i = 0; i < recs.length; ++i) {
                let rec = recs[i].getBoundingClientRect();
                if (
                    rec.left < rec2.right &&
                    rec.right > rec2.left &&
                    rec.top < rec2.bottom &&
                    rec.bottom > rec2.top
                ) {
                    let colors = [];
                    if (img.stopColor1) {
                        colors.push(img.stopColor1);
                    }
                    if (img.stopColor2) {
                        colors.push(img.stopColor2);
                    }
                    if (img.stopColor3) {
                        colors.push(img.stopColor3);
                    }
                    if (img.stopColor4) {
                        colors.push(img.stopColor4);
                    }
                    let newImg = {
                        _id: uuidv4(),
                        type: TemplateType.Gradient,
                        width: rec2.width / scale,
                        height: rec2.height / scale,
                        origin_width: rec2.width / scale,
                        origin_height: rec2.height / scale,
                        left: (rec2.left - rec.left) / scale,
                        top: (rec2.top - rec.top) / scale,
                        rotateAngle: 0.0,
                        src: !img.representative.startsWith("data")
                            ? window.location.origin + "/" + img.representative
                            : img.representative,
                        srcThumnail: img.representativeThumbnail,
                        backgroundColor: target.style.backgroundColor,
                        selected: true,
                        scaleX: 1,
                        scaleY: 1,
                        clipScale: (rec2.width) / img.clipWidth,
                        posX: 0,
                        posY: 0,
                        imgWidth: rec2.width / scale,
                        imgHeight: rec2.height / scale,
                        page: editorStore.pages[i],
                        zIndex: editorStore.upperZIndex + 1,
                        freeStyle: img.freeStyle,
                        path: img.path,
                        clipId: img.clipId,
                        clipWidth: img.clipWidth,
                        clipHeight: img.clipHeight,
                        clipWidth0: img.clipWidth0,
                        clipHeight0: img.clipHeight0,
                        path2: img.path2,
                        x1: img.x1,
                        y1: img.y1,
                        x2: img.x2,
                        y2: img.y2,
                        stopColor: img.stopColor,
                        stopColor1: img.stopColor1,
                        stopColor2: img.stopColor2,
                        gradientTransform: img.gradientTransform,
                        colors: img.stopColor,
                    };

                    setSavingState(SavingState.UnsavedChanges, true);
                    editorStore.addItem2(newImg, false);
                    editorStore.increaseUpperzIndex();

                    this.props.handleImageSelected(newImg._id, editorStore.pages[i], false, true, false);
                }
            }

            imgDragging.remove();

            image.style.opacity = 1;
        };
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    }

    loadMoreVideo = initialLoad => {
        const pageId = Math.floor((this.state.videos.length - this.left + this.videoTmp.length) / 30) + 1;
        this.setState({ loaded: true, })
        const url = `/api/Media/Search?page=${pageId}&perPage=${30}&type=${TemplateType.UserUploadVideo}&userEmail=${Globals.serviceUser ? Globals.serviceUser.username : ""}`;
        console.log('url ', url)
        fetch(url)
            .then(res => res.json())
            .then(
                res => {
                    console.log('res ', res, this.state.videos)
                    let result = res.value.key;
                    let items = [];

                    for (let i = 0; i < result.length; ++i) {
                        this.sum += 1.0 * result[i].width / result[i].height;
                        this.videoTmp.push(result[i]);
                        let height = (334 - (this.videoTmp.length - 1) * 8) / this.sum;
                        if (height < 160 && this.videoTmp.length > 1) {
                            this.sum = 0;
                            for (let j = 0; j < this.videoTmp.length; ++j) {
                                this.videoTmp[j].width = this.videoTmp[j].width / this.videoTmp[j].height * height;
                                this.videoTmp[j].height = height;
                            }
                            items.push(...this.videoTmp);
                            this.videoTmp = [];
                        }
                    }

                    let newItems = [...this.state.videos.filter(item => item.id != "sentinel-userupload"), ...items];
                    console.log('newItems ', newItems)
                    let hasMore = newItems.length + this.videoTmp.length < res.value.value;
                    if (hasMore) {
                        newItems = [...newItems, ...getRem(this.left)];
                    }
                    console.log('newItems ', newItems)
                    this.setState(state => ({
                        videos: newItems,
                        hasMoreVideos: hasMore,
                        loaded: true,
                    }));
                    this.forceUpdate();
                },
                error => {
                    // this.setState({ isLoading: false, error })
                }
            );
    };

    render() {

        return (
            <Sidebar
                selectedTab={editorStore.selectedTab}
                sidebar={SidebarTab.Upload}
            >
                {!Globals.serviceUser && <div>
                    <button
                        id="login-btn"
                        style={{
                            height: '40px',
                            width: '150px',
                            lineHeight: '30px',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: 500,
                            borderRadius: '4px',
                            color: '#555',
                            display: 'block',
                            padding: '0 10px',
                            backgroundColor: "white",
                            margin: 'auto',
                            marginTop: '15px',
                        }}
                        onClick={this.handleLogin}
                    >{this.props.translate("login")}</button>
                    <LoginPopup
                        translate={this.props.translate}
                        handleUpdateCompleted={this.handleUpdateCompleted} externalProviderCompleted={this.state.externalProviderCompleted} onLoginSuccess={this.handleLoginSuccess} />
                </div>}
                {Globals.serviceUser &&
                    <div>
                        <button
                            style={{
                                width: "calc(100% - 13px)",
                                backgroundColor: "white",
                                border: "none",
                                color: "black",
                                padding: "10px",
                                height: "40px",
                                borderRadius: "5px",
                                marginBottom: "10px",
                                marginTop: "6px",
                                boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
                                lineHeight: "15px",
                            }}
                            onClick={() => {
                                document.getElementById("image-file2").click();
                            }}
                        >
                            {this.state.tabSelected == 0 ? this.props.translate("uploadAnImage") : this.props.translate("uploadAVideo")}
                        </button>
                        <input
                            id="image-file2"
                            type="file"
                            multiple
                            onLoadedData={data => { }}
                            onChange={e => {
                                if (this.state.tabSelected == 0)
                                    this.uploadImage2(false, e);
                                else
                                    this.uploadVideo();
                            }}
                            style={{
                                display: "none",
                            }}
                        />
                        <button
                            onClick={e => {
                                this.setState({ tabSelected: 0, });
                                this.forceUpdate();
                            }}
                            style={{
                                border: "none",
                                width: "48%",
                                color: this.state.tabSelected == 0 ? 'white' : 'hsla(0,0%,100%,.65)',
                            }}
                        >Image</button>
                        <button
                            onClick={e => {
                                this.setState({ tabSelected: 1, });
                                // if (this.state.videos.length == 0) {
                                    this.loadMoreVideo(true);
                                // } else {
                                //     this.forceUpdate();
                                // }
                            }}
                            style={{
                                border: "none",
                                width: "48%",
                                color: this.state.tabSelected == 1 ? 'white' : 'hsla(0,0%,100%,.65)',
                            }}
                        >Video</button>
                        <div
                            style={{
                                height: '2px',
                                background: 'white',
                                width: '48%',
                                margin: '10px 0px',
                                transform: `translateX(${this.state.tabSelected == 0 ? 0 : 166}px)`,
                                transition: `transform .3s ease-in-out,-webkit-transform .3s ease-in-out`,
                            }}
                        ></div>
                        <div
                            style={{
                                opacity: this.state.tabSelected == 1 ? 1 : 0,
                                transition: 'transform .3s ease-in-out,opacity .3s ease-in-out,-webkit-transform .3s ease-in-out',
                                transform: `translateX(calc(${this.state.tabSelected == 0 ? 40 : 0}px))`,
                                position: "absolute",
                                zIndex: this.state.tabSelected == 1 ? 1 : 0,
                                height: "calc(100% - 110px)",
                                width: "100%",
                            }}
                        >
                                <InfiniteScroll
                                    scroll={true}
                                    throttle={200}
                                    threshold={0}
                                    isLoading={this.state.isLoading}
                                    marginTop={0}
                                    hasMore={this.state.hasMoreVideos}
                                    onLoadMore={this.loadMoreVideo.bind(this, false)}
                                    refId="sentinel-userupload"
                                >
                                    <div
                                        id="image-container-picker"
                                        style={{
                                            color: "white",
                                            width: "calc(100% + 8px)",
                                            padding: "0px 0px 10px 0px",
                                            userSelect: "none",
                                            height: "calc(100% - 170px)",
                                        }}
                                    >
                                        {this.state.videos.map((item, key) => (
                                            <VideoPicker
                                                id=""
                                                defaultHeight={imgWidth}
                                                delay={250 * key}
                                                width={item.width}
                                                key={key}
                                                color={item.color}
                                                src={item.representativeThumbnail}
                                                height={item.height}
                                                className="template-picker"
                                                onPick={e => {
                                                    this.videoOnMouseDown(e, item);
                                                }}
                                                onEdit={handleEditmedia.bind(this, item)}
                                                showButton={true}
                                                duration={item.duration}
                                                showDuration={true}
                                            />
                                        ))}
                                    </div>
                                </InfiniteScroll>
                        </div>
                        <div
                            style={{
                                opacity: this.state.tabSelected == 0 ? 1 : 0,
                                transition: 'transform .3s ease-in-out,opacity .3s ease-in-out,-webkit-transform .3s ease-in-out',
                                transform: `translateX(calc(${this.state.tabSelected == 1 ? -40 : 0}px))`,
                                position: "absolute",
                                zIndex: this.state.tabSelected == 0 ? 1 : 0,
                                height: "calc(100% - 110px)",
                            }}
                        >
                            <InfiniteScroll
                                scroll={true}
                                throttle={200}
                                threshold={0}
                                isLoading={this.state.isLoading}
                                marginTop={0}
                                hasMore={this.state.hasMore}
                                onLoadMore={this.loadMore.bind(this, false)}
                                refId="sentinel-userupload"
                            >
                                <div
                                    id="image-container-picker"
                                    style={{
                                        color: "white",
                                        width: "calc(100% + 8px)",
                                        padding: "0px 0px 10px 0px",
                                        userSelect: "none",
                                        height: "calc(100% - 170px)",
                                    }}
                                >
                                    {this.state.items.map((item, key) => (
                                        <ImagePicker
                                            id={item.id}
                                            height={item.height}
                                            defaultHeight={item.height}
                                            color=""
                                            delay={250 * key}
                                            width={item.width}
                                            key={key}
                                            src={item.representativeThumbnail}
                                            onPick={e => {
                                                e.preventDefault();
                                                let el = e.currentTarget;
                                                if (item.ext == "svg")
                                                    this.gradientOnMouseDown(item, el, e);
                                                else
                                                    this.imgOnMouseDown(item, e);
                                            }}
                                            onEdit={handleEditmedia.bind(this, item)}
                                            showButton={true}
                                            showProgressBar={item.showProgressBar}
                                        />
                                    ))}
                                </div>
                            </InfiniteScroll>
                        </div>
                    </div>}
            </Sidebar>
        )
    }
}