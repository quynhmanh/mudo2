import React, { Component } from 'react'
import { SidebarTab, TemplateType, SavingState, } from "./enums";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import ImagePicker from "@Components/shared/ImagePicker";
import Sidebar from "@Components/editor/SidebarStyled";
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
    items2: any;
    isLoading: boolean;
    currentItemsHeight: number;
    currentItems2Height: number;
    error: any;
    hasMoreImage: boolean;
    cursor: any;
    total: number;
    loaded: boolean;
    query: string;
}

const imgWidth = 163;
const imgHeight = 100;

let getRem = (rem) => Array(rem).fill(0).map(i => {
    return {
        width: imgWidth,
        height: imgHeight,
        id: "sentinel-image",
    }
});

export default class SidebarImage extends Component<IProps, IState> {
    state = {
        query: "",
        total: 0,
        isLoading: false,
        items: [],
        items2: [],
        currentItemsHeight: 0,
        currentItems2Height: 0,
        error: null,
        hasMoreImage: true,
        cursor: null,
        firstLoad: false,
        loaded: false,
    }

    constructor(props) {
        super(props);

        this.left = 30;
        this.state.items = getRem(this.left);

        this.imgOnMouseDown = this.imgOnMouseDown.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.handleQuery = this.handleQuery.bind(this);
    }

    componentDidMount() {
        // this.loadMore.bind(this)(true);
        // this.forceUpdate();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.selectedTab == SidebarTab.Image) {
            if (!nextState.loaded) {
                this.loadMore(true);
            }
        }
        if (this.props.selectedTab != nextProps.selectedTab
            && (nextProps.selectedTab == SidebarTab.Image || this.props.selectedTab == SidebarTab.Image)
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
        window.imagesrc = img.representative;
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
            target.style.pointerEvents = "none";
            if (dragging) {
                let rec2 = imgDragging.getBoundingClientRect();
                if (
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

                let id = window.imageselected;
                let image2 = editorStore.images2.get(id);
                if (isNaN(window.gridIndex)) {
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
                } else {
                    image2.selected = false;
                    image2.hovered = false;
                    let grid = image2.grids;
                    let g = grid[window.gridIndex];
                    let boxWidth = (image2.width - g.gapWidth) * g.width / 100;
                    let boxHeight = (image2.height - g.gapHeight) * g.height / 100;
                    let ratio = rec2.width / rec2.height;
        
                    let imgWidth = boxWidth;
                    let imgHeight = imgWidth / ratio;
                    if (imgHeight < boxHeight) {
                        imgHeight = boxHeight;
                        imgWidth = imgHeight * ratio;
                    }

                    grid[window.gridIndex].src = src;
                    grid[window.gridIndex].imgWidth = imgWidth;
                    grid[window.gridIndex].imgHeight = imgHeight;
                    grid[window.gridIndex].posX = (boxWidth - imgWidth) / 2;
                    grid[window.gridIndex].posY = (boxHeight - imgHeight) / 2;
                    grid[window.gridIndex].ratio = ratio;
                    image2.grids = grid;
                    window.gridIndex = undefined;
                }

                window.imageselected = null;
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
        };
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    }

    tmp = [];
    sum = 0;
    left = 10;

    loadMore = (initialLoad: Boolean) => {
        const PER_PAGE = 16;
        const pageId = (this.state.items.length - this.left + this.tmp.length) / 16 + 1;
        this.setState({ isLoading: true, error: undefined, loaded: true, });
        const url = `/api/Media/Search?type=${TemplateType.Image}&page=${pageId}&perPage=${PER_PAGE}&terms=${this.state.query}`;
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

                    let newItems = [...this.state.items.filter(item => item.id != "sentinel-image"), ...items];
                    let hasMore = newItems.length + this.tmp.length < res.value.value;
                    if (hasMore) {
                        newItems = [...newItems, ...getRem(this.left)];
                    }

                    this.setState(state => ({
                        items: newItems,
                        isLoading: false,
                        total: res.value.value,
                        hasMoreImage: hasMore,
                    }));

                    this.forceUpdate();
                },
                error => {
                    this.setState({ isLoading: false, error });
                }
            );
    };

    handleQuery = e => {
        if (e.key === "Enter") {
            this.setState({ items: [], items2: [] }, () => {
                this.loadMore(true);
            });
        }
    };

    render() {

        let left = this.state.total - this.state.items.length - this.state.items2.length;
        let t = Math.round(Math.min(left / 2, 8));

        if (!this.state.loaded) {
            left = 8;
            t = 4;
        }

        return (
            <Sidebar
                selectedTab={editorStore.selectedTab}
                sidebar={SidebarTab.Image}
            >
                <div
                    style={{
                        zIndex: 123
                    }}
                >
                    <InfiniteScroll
                        scroll={true}
                        throttle={200}
                        threshold={300}
                        isLoading={this.state.isLoading}
                        hasMore={this.state.hasMoreImage}
                        onLoadMore={this.loadMore.bind(this, false)}
                        refId="sentinel-image"
                        marginTop={42}
                    >
                        <div
                            id="image-container-picker"
                            style={{ display: "flex", padding: "16px 0px 10px 0px" }}
                        >
                            <div
                                style={{
                                    height: "calc(100% - 170px)",
                                    width: "calc(100% + 8px)",
                                    userSelect: "none",
                                }}
                            >
                                {this.state.items.map((item, key) => (
                                    <ImagePicker
                                        id={item.id}
                                        key={key + "1"}
                                        color={item.color}
                                        src={item.representativeThumbnail}
                                        height={item.height}
                                        defaultHeight={imgWidth}
                                        width={item.width}
                                        onPick={this.imgOnMouseDown.bind(this, item)}
                                        onEdit={handleEditmedia.bind(this, item)}
                                        delay={250 * key}
                                        showButton={true}
                                        backgroundColorLoaded="transparent"
                                    />
                                ))}
                            </div>
                        </div>
                    </InfiniteScroll>
                    <input
                        style={{
                            zIndex: 11,
                            width: "334px",
                            marginBottom: "8px",
                            border: "none",
                            height: "40px",
                            borderRadius: "5px",
                            padding: "5px",
                            fontSize: "14px",
                            boxShadow:
                                "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
                            position: "absolute",
                            top: "6px",
                            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath fill='black' d='M15.2 16.34a7.5 7.5 0 1 1 1.38-1.45l4.2 4.2a1 1 0 1 1-1.42 1.41l-4.16-4.16zm-4.7.16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z'/%3E%3C/svg%3E")`,
                            backgroundSize: '24px',
                            backgroundRepeat: 'no-repeat',
                            paddingLeft: '40px',
                            backgroundPosition: 'left 8px center',
                            color: "black",
                            fontWeight: 400,
                        }}
                        onKeyDown={this.handleQuery}
                        type="text"
                        placeholder="Search photos"
                        onChange={e => {
                            this.setState({ query: e.target.value });
                        }}
                    />
                </div>
            </Sidebar>
        )
    }
}