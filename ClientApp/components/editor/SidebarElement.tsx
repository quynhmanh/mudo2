import React, { Component } from 'react'
import { SidebarTab, TemplateType, SavingState, } from "./enums";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import ImagePicker from "@Components/shared/ImagePicker";
import SidebarElement from "@Components/editor/SidebarElementCatalog";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import Sidebar from "@Components/editor/SidebarStyled";
import styled from "styled-components";
import GridPicker from '@Components/shared/GridPicker';
import {
    handleEditmedia,
    setSavingState,
} from "@Utils";

export interface IProps {
    scale: number;
    translate: any;
    selectedTab: any;
    handleImageSelected: any;
    rectWidth: number;
    rectHeight: number;
    setSavingState: any;
    rem: number;
}

export interface IState {
    items: any;
    items2: any;
    items3: any;
    isLoading: boolean;
    currentItemsHeight: number;
    currentItems2Height: number;
    currentItems3Height: number;
    error: any;
    hasMore: boolean;
    cursor: any;
    query: string;
    currentQuery: string;
    total: number;
}

const imgWidth = 105;

let getRem = (rem) => Array(rem).fill(0).map(i => {
    return {
        width: imgWidth,
        height: imgWidth,
        id: "sentinel-element",
    }
});

let elements = {
    "Frame": [],
    "Lines": [],
    "Shapes": [],
    "Stickers": [],
    "Gradients": [],
    "Animals": [],
    "Coronavirus": [],
    "Grids": [],
};

export default class SidebarEffect extends Component<IProps, IState> {

    prefix = 1;
    left = 10;

    state = {
        isLoading: false,
        items: [],
        items2: [],
        items3: [],
        currentItemsHeight: 0,
        currentItems2Height: 0,
        currentItems3Height: 0,
        error: null,
        hasMore: true,
        cursor: null,
        query: "",
        currentQuery: "",
        total: 10,
    }

    constructor(props) {
        super(props);
        this.state.items = getRem(props.rem);
        this.left = props.rem;

        this.handleQuery = this.handleQuery.bind(this);
        this.imgOnMouseDown = this.imgOnMouseDown.bind(this);
        this.frameOnMouseDownload = this.frameOnMouseDownload.bind(this);
        this.gradientOnMouseDown = this.gradientOnMouseDown.bind(this);
        this.gridOnMouseDown = this.gridOnMouseDown.bind(this);
    }

    componentDidMount() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.selectedTab == SidebarTab.Element && elements["Frame"].length == 0) {
            this.loadInitSearch();
        }
        if (this.props.selectedTab != nextProps.selectedTab
            && (nextProps.selectedTab == SidebarTab.Element || this.props.selectedTab == SidebarTab.Element)
        ) {
            return true;
        }
        return false;
    }

    loadInitSearch() {
        const url = `/api/Media/InitSearch`;
        fetch(url)
            .then(res => res.json())
            .then(
                res => {
                    for (let i = 0; i < res.value.key.length; ++i) {
                        let doc = res.value.key[i];
                        if (doc.keywords.length > 0 && elements[doc.keywords[0]]) {
                            elements[doc.keywords[0]].push(doc);
                        }
                    }

                    this.forceUpdate();
                });
    }

    gradientOnMouseDown(img, el, e) {
        console.log('gradientOnMouseDown')
        let scale = this.props.scale;

        let target = el.cloneNode(true);
        target.style.zIndex = "11111111111";
        target.src = img.representativeThumbnail
            ? img.representativeThumbnail
            : el.src;
        target.style.width = el.getBoundingClientRect().width + "px";
        target.style.backgroundColor = el.style.backgroundColor;
        document.body.appendChild(target);
        let self = this;
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
            window.imagedragging = true;
            image.style.opacity = 0;
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

                    let type = TemplateType.Gradient;
                    if (img.keywords && img.keywords[0] == "Shapes") {
                        type = TemplateType.Shape;
                    }
                    let newImg = {
                        _id: uuidv4(),
                        type,
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

    gridOnMouseDown(img, el, e) {
        let scale = this.props.scale;

        let target = el.cloneNode(true);
        target.style.zIndex = "11111111111";
        target.src = img.ext == "gif" ? el.src : img.representativeThumbnail;
        target.style.width = el.getBoundingClientRect().width + "px";
        target.style.backgroundColor = el.style.backgroundColor;
        document.body.appendChild(target);
        let self = this;
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
            window.imagedragging = true;
            image.style.opacity = 0;
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
            let recs = document.getElementsByClassName("alo");
            let rec2 = imgDragging.getBoundingClientRect();

            window.imagedragging = false;
            dragging = false;
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);

            let grids = img.grids;

            const width = window.rectWidth;
            const height = window.rectHeight;

            grids = grids.map(g => {
                let boxWidth = (width - g.gapWidth) * g.width / 100;
                let boxHeight = (height - g.gapHeight) * g.height / 100;
                const ratio = g.ratio ? g.ratio : 1;

                let imgWidth = boxWidth;
                let imgHeight = imgWidth / ratio;
                if (imgHeight < boxHeight) {
                    imgHeight = boxHeight;
                    imgWidth = imgHeight * ratio;
                }

                g.imgWidth = imgWidth;
                g.imgHeight = imgHeight;
                return g;
            })

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
                        type: TemplateType.Grids,
                        width,
                        height,
                        origin_width: width,
                        origin_height: height,
                        left: 0,
                        top: 0,
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
                        path2: img.path2,
                        gridTemplateAreas: img.gridTemplateAreas,
                        gridTemplateColumns: img.gridTemplateColumns,
                        gridTemplateRows: img.gridTemplateRows,
                        gap: img.gap,
                        grids,
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

    frameOnMouseDownload(img, el, e) {
        let scale = this.props.scale;

        let target = el.cloneNode(true);
        target.style.zIndex = "11111111111";
        target.src = img.representativeThumbnail
            ? img.representativeThumbnail
            : el.src;
        target.style.width = el.getBoundingClientRect().width + "px";
        target.style.backgroundColor = el.style.backgroundColor;
        document.body.appendChild(target);
        let self = this;
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
            window.imagedragging = true;
            image.style.opacity = 0;
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
                    let newImg = {
                        _id: uuidv4(),
                        type: TemplateType.Element,
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
                        path2: img.path2,
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

    imgOnMouseDown(img, el, e) {
        console.log('imgOnMouseDown')
        let scale = this.props.scale;

        let target = el.cloneNode(true);
        target.style.zIndex = "11111111111";
        target.src = img.ext == "gif" ? el.src : img.representativeThumbnail;
        target.style.width = el.getBoundingClientRect().width + "px";
        target.style.backgroundColor = el.style.backgroundColor;
        document.body.appendChild(target);
        let self = this;
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
            window.imagedragging = true;
            image.style.opacity = 0;
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
                        path2: img.path2,
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

    loadMore = (initialload, term = null) => {
        console.log('this.props.rem ', this.props.rem)
        let pageId = Math.round((this.state.items.length - this.left) / this.props.rem) + 1;
        this.setState({ isLoading: true, error: undefined });
        const url = `/api/Media/Search?type=${TemplateType.Element}&page=${pageId}&perPage=${this.props.rem}&terms=${initialload ? term : this.state.query}`;
        fetch(url)
            .then(res => res.json())
            .then(
                res => {
                    let result = res.value.key;
                    let items = this.state.items.filter(item => item.id != "sentinel-element");
                    items = [...items, ...result];
                    let hasMore = res.value.value > items.length;
                    if (hasMore) {
                        let left = Math.min(this.props.rem, res.value.value - items.length);
                        this.left = left;
                        items = [...items, ...getRem(left)];
                    }

                    this.setState(state => ({
                        items,
                        isLoading: false,
                        total: res.value.value,
                        hasMore,
                    }));

                    this.forceUpdate();
                },
                error => {
                    this.setState({ isLoading: false, error });
                }
            );
    };

    handleQuery = term => {
        this.left = this.props.rem;
        this.prefix = this.prefix + 1;
        this.setState({ query: term, currentQuery: term, items: getRem(this.left) }, () => {
            this.loadMore(false);
        });
        let el = document.getElementById("queryInput") as HTMLInputElement;
        el.value = term;
        this.forceUpdate();
    };

    render() {
        return (
            <Sidebar
                selectedTab={editorStore.selectedTab}
                sidebar={SidebarTab.Element}
            >
                <input
                    id="queryInput"
                    autoComplete="off"
                    style={{
                        zIndex: 123,
                        width: "calc(100% - 14px)",
                        marginBottom: "15px",
                        border: "none",
                        height: "40px",
                        borderRadius: "5px",
                        padding: "5px 10px",
                        fontSize: "14px",
                        boxShadow:
                            "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
                        marginTop: "6px",
                        color: "black",
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath fill='black' d='M15.2 16.34a7.5 7.5 0 1 1 1.38-1.45l4.2 4.2a1 1 0 1 1-1.42 1.41l-4.16-4.16zm-4.7.16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z'/%3E%3C/svg%3E")`,
                        backgroundSize: '24px',
                        backgroundRepeat: 'no-repeat',
                        paddingLeft: '45px',
                        backgroundPosition: 'left 12px center',
                        position: "absolute",
                        fontWeight: 400,
                        lineHeight: "40px",
                    }}
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            let el = e.target as HTMLInputElement;
                            this.handleQuery(el.value);
                        }
                    }}
                    type="text"
                    placeholder="Search icons and shapes"
                    onChange={e => {
                        this.setState({ currentQuery: e.target.value });

                        let el = document.getElementById('clearBtn');
                        if (e.target.value) {
                            el.style.display = "block";
                        } else {
                            el.style.display = "none";
                        }
                    }}
                />
                <button
                    onClick={e => {
                        e.currentTarget.style.display = "none";
                        this.handleQuery("");
                    }}
                    className="clear"
                    id="clearBtn"
                    style={{
                        position: 'absolute',
                        right: '20px',
                        top: '13px',
                        border: 'none',
                        zIndex: 123,
                        display: this.state.query ? "block" : "none",
                    }}
                    type="button"><span className="TcNIhA"><span aria-hidden="true" className="NA_Img dkWypw">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M13.06 12.15l5.02-5.03a.75.75 0 1 0-1.06-1.06L12 11.1 6.62 5.7a.75.75 0 1 0-1.06 1.06l5.38 5.38-5.23 5.23a.75.75 0 1 0 1.06 1.06L12 13.2l4.88 4.87a.75.75 0 1 0 1.06-1.06l-4.88-4.87z"></path></svg></span></span></button>

                {!this.state.query &&
                    <div
                        id="object-container"
                        style={{
                            height: "calc(100% - 30px)",
                            overflowY: "scroll",
                            overflowX: "hidden",
                            marginTop: "30px",
                            paddingTop: "20px",
                        }}
                    >
                        <SidebarElement
                            elements={elements["Frame"]}
                            term="Frame"
                            handleQuery={this.handleQuery}
                            selectedTab={this.props.selectedTab}
                            imgOnMouseDown={this.frameOnMouseDownload}
                        />
                        <SidebarElement
                            elements={elements["Lines"]}
                            term="Lines"
                            handleQuery={this.handleQuery}
                            selectedTab={this.props.selectedTab}
                            imgOnMouseDown={this.imgOnMouseDown}
                            gradientOnMouseDown={this.gradientOnMouseDown}
                        />
                        <SidebarElement
                            elements={elements["Shapes"]}
                            term="Shapes"
                            handleQuery={this.handleQuery}
                            selectedTab={this.props.selectedTab}
                            imgOnMouseDown={this.imgOnMouseDown}
                            gradientOnMouseDown={this.gradientOnMouseDown}
                        />
                        {/* <SidebarElement
                                elements={elements["Shapes"]}
                                term="Shapes"
                                handleQuery={this.handleQuery}
                                selectedTab={this.props.selectedTab}
                                imgOnMouseDown={this.gradientOnMouseDown}
                            /> */}
                        <SidebarElement
                            elements={elements["Grids"]}
                            term="Grids"
                            handleQuery={this.handleQuery}
                            selectedTab={this.props.selectedTab}
                            imgOnMouseDown={this.gridOnMouseDown}
                            gradientOnMouseDown={this.gradientOnMouseDown}
                        // frameOnMouseDownload={this.frameOnMouseDownload}
                        />
                        <SidebarElement
                            elements={elements["Stickers"]}
                            term="Stickers"
                            handleQuery={this.handleQuery}
                            selectedTab={this.props.selectedTab}
                            imgOnMouseDown={this.imgOnMouseDown}
                            gradientOnMouseDown={this.gradientOnMouseDown}
                        />
                        <SidebarElement
                            elements={elements["Gradients"]}
                            term="Gradients"
                            handleQuery={this.handleQuery}
                            selectedTab={this.props.selectedTab}
                            imgOnMouseDown={this.imgOnMouseDown}
                            gradientOnMouseDown={this.gradientOnMouseDown}
                        // frameOnMouseDownload={this.frameOnMouseDownload}
                        />
                        <SidebarElement
                            elements={elements["Animals"]}
                            term="Animals"
                            handleQuery={this.handleQuery}
                            selectedTab={this.props.selectedTab}
                            imgOnMouseDown={this.imgOnMouseDown}
                            gradientOnMouseDown={this.gradientOnMouseDown}
                        // frameOnMouseDownload={this.frameOnMouseDownload}
                        />
                        <SidebarElement
                            elements={elements["Coronavirus"]}
                            term="Coronavirus"
                            handleQuery={this.handleQuery}
                            selectedTab={this.props.selectedTab}
                            imgOnMouseDown={this.imgOnMouseDown}
                            gradientOnMouseDown={this.gradientOnMouseDown}
                        // frameOnMouseDownload={this.frameOnMouseDownload}
                        />
                    </div>}
                
                    <InfiniteScroll
                        scroll={true}
                        throttle={200}
                        threshold={300}
                        isLoading={this.state.isLoading}
                        hasMore={this.state.hasMore}
                        onLoadMore={this.loadMore.bind(this, false)}
                        marginTop={42}
                        refId="sentinel-element"
                    >
                        <div
                            id="image-container-picker"
                            style={{ display: "flex", padding: "16px 0px 10px 0px" }}
                        >
                        <div
                            style={{
                                display: "inline-block",
                                width: "100%",
                                userSelect: "none",
                            }}>
                            {this.state.query && this.state.items.map((item, key) => {
                                let width, height;
                                if (item.width > item.height) {
                                    width = imgWidth;
                                    height = imgWidth / (item.width / item.height);
                                } else {
                                    height = imgWidth;
                                    width = imgWidth * (item.width / item.height);
                                }

                                if (item.keywords && item.keywords[0] == "Grids") {
                                    try {
                                        item.grids = JSON.parse(item.grids);
                                        console.log('alo', item.type)
                                    } catch (e) {
                                        console.log(e);
                                    }
                                }

                                return <ImagePickerContainer
                                    onMouseDown={e => {
                                        e.preventDefault();
                                        let el = e.currentTarget.getElementsByTagName("img")[0];
                                        if (item.keywords && item.keywords[0] == "Frame")
                                            this.frameOnMouseDownload(item, el, e);
                                        else if (item.keywords && item.keywords[0] == "Grids") {
                                            el = e.currentTarget;
                                            this.gridOnMouseDown(item, el, e);
                                        }
                                        else if (item.ext == "svg")
                                            this.gradientOnMouseDown(item, el, e);
                                        else this.imgOnMouseDown(item, el, e)
                                    }}
                                >
                                    {(item.keywords && item.keywords[0] == "Grids") ?
                                        <GridPicker
                                            id={item.id}
                                            key={this.prefix + key}
                                            color={item.color}
                                            src={item.representative && item.representative.endsWith("gif") ? item.representative : item.representativeThumbnail}
                                            height={height}
                                            defaultHeight={imgWidth}
                                            width={width}
                                            onPick={null}
                                            onEdit={handleEditmedia.bind(this, item)}
                                            delay={250 * key}
                                            showButton={true}
                                            backgroundColorLoaded="transparent"
                                            marginRight={0}
                                            marginAuto={true}
                                            item={item}
                                        />
                                        :
                                        <ImagePicker
                                            id={item.id}
                                            key={this.prefix + key}
                                            color={item.color}
                                            src={
                                                (item.representative && item.representative.endsWith("gif") || (item.keywords && item.keywords[0] == "Frame")) ? 
                                                item.representative : item.representativeThumbnail}
                                            height={height}
                                            defaultHeight={imgWidth}
                                            width={width}
                                            onPick={null}
                                            onEdit={handleEditmedia.bind(this, item)}
                                            delay={250 * key}
                                            showButton={true}
                                            backgroundColorLoaded="transparent"
                                            marginRight={0}
                                            marginAuto={true}
                                        />}
                                </ImagePickerContainer>
                            })}
                        </div>
                        </div>
                    </InfiniteScroll>
            </Sidebar>
        )
    }
}

const ImagePickerContainer = styled.div`
    width: ${imgWidth}px;
    height: ${imgWidth}px;
    display: inline-flex;
    justify-content: center;
    margin-right: 9px;
    margin-bottom: 8px;
    position: relative;
    cursor: pointer;
`;