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

const elements = [
    {
        representative: "https://template.canva.com/EADX7bJQMIQ/1/0/800w-Ida3rjkyPN8.png",
        clipId: "__id1_0",
        clipWidth: 500,
        clipHeight: 500,
        path: "M500 250.002c0 138.065-111.931 249.996-250 249.996-138.071 0-250-111.931-250-249.996C0 111.93 111.929 0 250 0s250 111.93 250 250.002z"
    },
    {
        representative:
            "https://template.canva.com/EADX7bJQMIQ/1/0/800w-Ida3rjkyPN8.png",
        clipId: "__id1_0",
        clipWidth: 500,
        clipHeight: 500,
        path: "M500 250.002c0 138.065-111.931 249.996-250 249.996-138.071 0-250-111.931-250-249.996C0 111.93 111.929 0 250 0s250 111.93 250 250.002z"
    },
    {
        representative:
            "https://template.canva.com/EADX7QrTMRE/1/0/800w-9JSF7RR-P-c.png",
        clipId: "__id1_10",
        clipWidth: 485,
        clipHeight: 333.5,
        path: "M485 333.5L0 291.1V0l485 42.4z"
    },
    {
        representative:
            "https://template.canva.com/EADX7Asmx5Q/1/0/698w-u9NeGBksRvE.png",
        clipId: "__id1_11",
        clipWidth: 229.6,
        clipHeight: 264.2,
        path: "M75.6 215.7h75.7l14.7 48.6h63.6L147.2 0H82.6L0 264.2h61.3l14.3-48.5zm38-128.2l20.4 70H92.9l20.7-70z"
    },
    {
        representative:
            "https://template.canva.com/EADfCquREdE/1/0/404w-eJxIhDu9uEM.png",
        clipId: "__id1_12",
        clipWidth: 206.3,
        clipHeight: 408.2,
        path: "m175.3 12.3h-21.4v4.5c0 5.1-4.2 9.3-9.3 9.3h-82.6c-5.1 0-9.3-4.2-9.3-9.3v-4.5h-21.6c-9.1 0-16.5 7.4-16.5 16.5v351c0 9.1 7.4 16.5 16.5 16.5h144.2c9.1 0 16.5-7.4 16.5-16.5v-351c0.1-9.1-7.3-16.5-16.5-16.5z",
        path2: [{
            path: "m174.2 2h-142.1c-15.4 0-27.9 12.5-27.9 27.9v348.3c0 15.4 12.5 27.9 27.9 27.9h142.1c15.4 0 27.9-12.5 27.9-27.9v-348.3c0-15.4-12.5-27.9-27.9-27.9zm-47.3 12.8c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5 1.2-2.5 2.5-2.5zm-36.9 0.8h24c0.9 0 1.7 0.7 1.7 1.7s-0.8 1.7-1.7 1.7h-24c-0.9 0-1.7-0.7-1.7-1.7s0.8-1.7 1.7-1.7zm101.9 364.2c0 9.1-7.4 16.5-16.5 16.5h-144.3c-9.1 0-16.5-7.4-16.5-16.5v-351c0-9.1 7.4-16.5 16.5-16.5h21.5v4.5c0 5.1 4.2 9.3 9.3 9.3h82.7c5.1 0 9.3-4.2 9.3-9.3v-4.5h21.4c9.1 0 16.5 7.4 16.5 16.5v351z",
            fill: "#000000",
        }],
    },
    {
        representative:
            "https://template.canva.com/EADeqIhE6gQ/1/0/800w-aHMY8cRMwKQ.png",
        clipId: "__id1_13",
        clipWidth: 588,
        clipHeight: 472.1,
        path: "M24.8 27.8H562.4V329.8H24.8z",
        path2: [
            {
                path: "m561.2 0h-534.4c-14.8 0-26.8 12-26.8 26.8v328.6h588v-328.6c0-14.8-12-26.8-26.8-26.8zm1.2 329.8h-537.6v-302h537.6v302z",
                fill: "#000000",
            },
            {
                path: "m0 383.5c0 14.8 12 26.8 26.8 26.8h534.4c14.8 0 26.8-12 26.8-26.8v-28h-588v28z",
                fill: "#e9e9e9",
            },
            {
                path: "m290.4 410.3h-63.4s-1.9 29.2-3.9 41.4c-3.5 20.9-24.9 14.2-31 18.6-0.8 0.6-0.4 1.9 0.6 1.9h202.4c1 0 1.4-1.3 0.6-1.9-6.1-4.4-27.5 2.3-31-18.6-2-12.2-3.9-41.4-3.9-41.4h-70.4z",
                fill: "#bbbbbb",
            }
        ],
    },
    {
        representative:
            "https://template.canva.com/EADeqUpyBjA/1/0/800w-QJezxdZmZ_Y.png",
        clipId: "__id1_14",
        clipWidth: 628.5,
        clipHeight: 360.5,
        path: "M75.8 21.8H552.6V320.2H75.8z",
        path2: [
            {
                path: "m550.4 1.7h-472.3c-9.8 0-17.8 8-17.8 17.8v322.9h508v-322.9c-0.1-9.8-8.1-17.8-17.9-17.8zm2.2 318.4h-476.8v-298.3h476.8v298.3z",
                fill: "#000000",
            },
            {
                path: "m570 342.4v-323.2c0-10.6-8.6-19.2-19.2-19.2h-473.2c-10.5 0-19.1 8.6-19.1 19.2v323.3h-58.5v7.7c0 4.2 3.4 7.5 7.5 7.5h613.5c4.2 0 7.5-3.4 7.5-7.5v-7.7h-58.5zm-214.1 0v0.1c0 4.2-3.4 7.5-7.5 7.5h-68.3c-4.2 0-7.5-3.4-7.5-7.5v-0.1h-212.3v-322.9c0-9.8 8-17.8 17.8-17.8h472.3c9.8 0 17.8 8 17.8 17.8v322.9h-212.3z",
                fill: "#e9e9e9"
            },
            {
                path: "m280.1 350.1h68.3c4.2 0 7.5-3.4 7.5-7.5v-0.1h-83.4v0.1c0 4.1 3.4 7.5 7.6 7.5z",
                fill: "#cccccc",
            }
        ],
    }
];

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
                        path2: img.path2,
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
                        {/* <div
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
                        </div> */}
                        <div
                            style={{
                                width: "350px",
                            }}
                        >
                            <img
                                onMouseDown={this.imgOnMouseDown.bind(this, {
                                    representative:
                                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
                                    freeStyle: true
                                })}
                                style={{
                                    width: "100px",
                                    height: 100 + "px",
                                    backgroundColor: "#019fb6",
                                    marginRight: "8px",
                                    marginBottom: "8px",
                                }}
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                            />
                            {elements.map(el =>
                                <img
                                    onMouseDown={this.imgOnMouseDown.bind(this, el)}
                                    style={{
                                        width: "100px",
                                        height: 100 / (el.clipWidth / el.clipHeight) + "px",
                                        marginRight: "8px",
                                        marginBottom: "8px",
                                        cursor: 'pointer',
                                    }}
                                    src={el.representative}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}