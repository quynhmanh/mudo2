import React, { Component } from 'react'
import { SidebarTab, TemplateType, SavingState, } from "./enums";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import ImagePicker from "@Components/shared/ImagePicker";
import { toJS } from "mobx";

export interface IProps {
    scale: number;
    translate: any;
    selectedTab: any;
    handleEditmedia: any;
    handleImageSelected: any;
    rectWidth: number;
    rectHeight: number;
    setSavingState: any;
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
}

const imgWidth = 162;
const backgroundWidth = 105;

export default class SidebarEffect extends Component<IProps, IState> {
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
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadMore.bind(this)(true);
        this.forceUpdate();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.selectedTab != nextProps.selectedTab
            && (nextProps.selectedTab == SidebarTab.Element || this.props.selectedTab == SidebarTab.Element)
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
        target.style.width = e.target.getBoundingClientRect().width + "px";
        target.style.backgroundColor = e.target.style.backgroundColor;
        document.body.appendChild(target);
        let self = this;
        let imgDragging = target;
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
                        type: TemplateType.ClipImage,
                        width: rec2.width / scale,
                        height: rec2.height / scale,
                        origin_width: rec2.width / scale,
                        origin_height: rec2.height / scale,
                        left: (rec2.left - rec.left) / scale,
                        top: (rec2.top - rec.top) / scale,
                        rotateAngle: 0.0,
                        // src: !img.representative.startsWith("data")
                        //     ? window.location.origin + "/" + img.representative
                        //     : img.representative,
                        src: "https://template.canva.com/EADX7bJQMIQ/1/0/800w-Ida3rjkyPN8.png",
                        srcThumnail: img.representativeThumbnail,
                        backgroundColor: target.style.backgroundColor,
                        selected: true,
                        scaleX: 1,
                        scaleY: 1,
                        clipScale: (rec2.width) / 500,
                        posX: 0,
                        posY: 0,
                        imgWidth: rec2.width / scale,
                        imgHeight: rec2.height / scale,
                        page: editorStore.pages[i],
                        zIndex: editorStore.upperZIndex + 1,
                        freeStyle: img.freeStyle
                    };

                    this.props.setSavingState(SavingState.UnsavedChanges, true);
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

    loadMore = initialload => {
        let pageId;
        let count;
        if (initialload) {
            pageId = 1;
            count = 30;
        } else {
            pageId =
                (this.state.items.length +
                    this.state.items2.length +
                    this.state.items3.length) /
                5 +
                1;
            count = 15;
        }
        this.setState({ isLoading: true, error: undefined });
        const url = `/api/Media/Search?type=${TemplateType.BackgroundImage}&page=${pageId}&perPage=${count}`;
        fetch(url)
            .then(res => res.json())
            .then(
                res => {
                    var result = res.value.key;
                    var currentItemsHeight = this.state.currentItemsHeight;
                    var currentItems2Height = this.state.currentItems2Height;
                    var currentItems3Height = this.state.currentItems3Height;
                    var res1 = [];
                    var res2 = [];
                    var res3 = [];
                    for (var i = 0; i < result.length; ++i) {
                        var currentItem = result[i];
                        if (
                            currentItemsHeight <= currentItems2Height &&
                            currentItemsHeight <= currentItems3Height
                        ) {
                            res1.push(currentItem);
                            currentItemsHeight +=
                                backgroundWidth / (currentItem.width / currentItem.height);
                        } else if (
                            currentItems2Height <= currentItemsHeight &&
                            currentItems2Height <= currentItems3Height
                        ) {
                            res2.push(currentItem);
                            currentItems2Height +=
                                backgroundWidth / (currentItem.width / currentItem.height);
                        } else {
                            res3.push(currentItem);
                            currentItems3Height +=
                                backgroundWidth / (currentItem.width / currentItem.height);
                        }
                    }
                    this.setState(state => ({
                        items: [...state.items, ...res1],
                        items2: [...state.items2, ...res2],
                        items3: [...state.items3, ...res3],
                        currentItemsHeight,
                        currentItems2Height,
                        currentItems3Height,
                        isLoading: false,
                        hasMore:
                            res.value.value >
                            state.items.length + state.items2.length + res.value.key.length
                    }));

                    this.forceUpdate();
                },
                error => {
                    this.setState({ isLoading: false, error });
                }
            );
    };

    render() {

        return (
            <div
                style={{
                    opacity: editorStore.selectedTab === SidebarTab.Element ? 1 : 0,
                    position: "absolute",
                    width: "347px",
                    color: "white",
                    overflow: "scroll",
                    transition:
                        "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                    transform:
                        editorStore.selectedTab !== SidebarTab.Element &&
                        `translate3d(0px, calc(${editorStore.selectedTab < SidebarTab.Element ? 40 : -40
                        }px), 0px)`,
                    top: "10px",
                    zIndex: editorStore.selectedTab !== SidebarTab.Element && -1,
                    height: "100%",
                    left: '19px',
                }}
            >
                <div style={{ display: "inline-block", width: "100%" }}>
                    <div
                        style={{
                            display: "flex",
                            marginTop: "10px",
                            height: "calc(100% - 35px)",
                            overflow: "scroll"
                        }}
                    >
                        <div
                            style={{
                                width: "350px",
                                marginRight: "10px"
                            }}
                        >
                            <img
                                onMouseDown={this.imgOnMouseDown.bind(this, {
                                    representative:
                                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
                                    freeStyle: true
                                })}
                                style={{
                                    width: "160px",
                                    height: imgWidth + "px",
                                    backgroundColor: "#019fb6"
                                }}
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                            />
                        </div>
                        <div
                            style={{
                                width: "350px",
                                marginRight: "10px"
                            }}
                        >
                            <img
                                onMouseDown={this.imgOnMouseDown.bind(this, {
                                    representative:
                                        "https://template.canva.com/EADX7bJQMIQ/1/0/800w-Ida3rjkyPN8.png",
                                    freeStyle: true
                                })}
                                style={{
                                    width: "160px",
                                    height: imgWidth + "px",
                                }}
                                src="https://template.canva.com/EADX7bJQMIQ/1/0/800w-Ida3rjkyPN8.png"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}