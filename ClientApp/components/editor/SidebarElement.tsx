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
                        src: img.representative,
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
                    };

                    console.log('newImg', newImg)

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
                                    clipId: "__id1_0",
                                    clipWidth: 500,
                                    clipHeight: 500,
                                    path: "M500 250.002c0 138.065-111.931 249.996-250 249.996-138.071 0-250-111.931-250-249.996C0 111.93 111.929 0 250 0s250 111.93 250 250.002z"
                                })}
                                style={{
                                    width: "162px",
                                    height: imgWidth + "px",
                                }}
                                src="https://template.canva.com/EADX7bJQMIQ/1/0/800w-Ida3rjkyPN8.png"
                            />

                            <img
                                onMouseDown={this.imgOnMouseDown.bind(this, {
                                    representative:
                                        "https://template.canva.com/EADX7r0xmN0/1/0/800w-KJddcbuAC3c.png",
                                    clipId: "__id1_9",
                                    clipWidth: 500,
                                    clipHeight: 500,
                                    path: "M440.102 79.27c-9.778-16.932-27.509-26.405-45.749-26.418l.003-.003c-18.24-.016-35.974-9.488-45.749-26.418-14.586-25.267-46.892-33.922-72.159-19.333l-.004.003v-.016c-15.693 9.041-35.609 9.757-52.466.198A52.578 52.578 0 0 0 197.201 0c-19.551 0-36.619 10.623-45.755 26.412v-.003c-9.133 15.786-26.205 26.409-45.753 26.409-29.175 0-52.824 23.649-52.824 52.824v.006l-.016-.006c-.016 18.101-9.345 35.698-26.03 45.521a52.552 52.552 0 0 0-19.722 19.559c-9.776 16.934-9.111 37.025-.003 52.83h-.003c9.101 15.802 9.766 35.895-.01 52.827-14.585 25.264-5.931 57.57 19.336 72.159l.003.003-.01.007c15.789 9.129 26.407 26.201 26.407 45.752 0 29.175 23.649 52.824 52.823 52.824 19.552 0 36.617 10.621 45.756 26.41 9.133 15.782 26.204 26.41 45.753 26.41a52.61 52.61 0 0 0 26.777-7.284c16.853-9.557 36.774-8.841 52.466.203v-.019l.003.006c25.267 14.586 57.573 5.928 72.163-19.336 9.775-16.929 27.506-26.403 45.746-26.416l-.004-.007c18.24-.013 35.974-9.487 45.746-26.416 4.813-8.335 7.097-17.439 7.087-26.417l.007.006c.016-17.594 8.832-34.719 24.652-44.682 8.528-4.484 15.929-11.355 21.1-20.312 9.779-16.938 9.114-37.031.007-52.833h.003c-9.104-15.802-9.77-35.895.007-52.828 14.589-25.267 5.931-57.57-19.336-72.159l-.004-.004.01-.003c-15.662-9.062-26.236-25.935-26.403-45.291.092-9.134-2.185-18.404-7.078-26.882"
                                })}
                                style={{
                                    width: "162px",
                                    height: imgWidth + "px",
                                }}
                                src="https://template.canva.com/EADX7r0xmN0/1/0/800w-KJddcbuAC3c.png"
                            />

                            <img
                                onMouseDown={this.imgOnMouseDown.bind(this, {
                                    representative:
                                        "https://template.canva.com/EADX7QrTMRE/1/0/800w-9JSF7RR-P-c.png",
                                    clipId: "__id1_10",
                                    clipWidth: 485,
                                    clipHeight: 333.5,
                                    path: "M485 333.5L0 291.1V0l485 42.4z"
                                })}
                                style={{
                                    width: "162px",
                                    height: 111.3 + "px",
                                }}
                                src="https://template.canva.com/EADX7QrTMRE/1/0/800w-9JSF7RR-P-c.png"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}