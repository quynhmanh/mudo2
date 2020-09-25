import React, { Component } from 'react'
import { SidebarTab, TemplateType, } from "./enums";
import editorStore from "@Store/EditorStore";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import ImagePicker from "@Components/shared/ImagePicker";
import {toJS} from "mobx";

export interface IProps {
    scale: number;
    translate: any;
    selectedTab: any;
    handleEditmedia: any;
    handleImageSelected: any;
    rectWidth: number;
    rectHeight: number;
    updateImages: any;
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
    total: number;
    loaded: boolean;
}

const backgroundWidth = 105;

export default class SidebarBackground extends Component<IProps, IState> {
    state = {
        total: 0,
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
        loaded: false,
    }

    constructor(props) {
        super(props);

        this.loadMore = this.loadMore.bind(this);
        this.backgroundOnMouseDown = this.backgroundOnMouseDown.bind(this);
    }

    componentDidMount() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.selectedTab == SidebarTab.Background) {
            if (!nextState.loaded) {
                this.loadMore(true);
            }
        }
        if (this.props.selectedTab != nextProps.selectedTab
            && (nextProps.selectedTab == SidebarTab.Background || this.props.selectedTab == SidebarTab.Background)
        ) {
            return true;
        }
        return false;
    }

    backgroundOnMouseDown(item, e) {
        var rec2 = e.target.getBoundingClientRect();
        var { rectWidth, rectHeight } = this.props;
        var imgRatio = rec2.width / rec2.height;
        var width = rectWidth;
        var height = rectWidth / imgRatio;
        if (height < rectHeight) {
            height = rectHeight;
            width = imgRatio * height;
        }

        let image = Array.from(editorStore.images2.values()).find(image =>
            image.page == editorStore.activePageId && image.type == TemplateType.BackgroundImage);
        image = toJS(image);
        image.src = window.location.origin + "/" + item.representative;
        image.srcThumnail = item.representativeThumbnail;
        image.color = "";
        image.width = rectWidth;
        image.height = rectHeight;
        image.origin_width = rectWidth;
        image.origin_height = rectHeight;
        image.posX = -(width - rectWidth) / 2;
        image.posY = -(height - rectHeight) / 2;
        image.imgWidth = width;
        image.imgHeight = height;
        image.selected = true;
        image.zIndex = 1;

        editorStore.images2.set(image._id, image);
        this.props.handleImageSelected(image._id, editorStore.activePageId, false, true, true);
        this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);

    }


    loadMore = initialload => {
        let pageId;
        let count;
        if (initialload) {
            pageId = 1;
            count = 30;
        } else {
            pageId = (this.state.items.length + this.state.items2.length + this.state.items3.length) / 30 + 1;
            count = 30;
        }
        this.setState({ isLoading: true, error: undefined, loaded: true, });
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
                        total: res.value.value,
                        hasMore: res.value.value > state.items.length + state.items2.length + state.items3.length + res.value.key.length
                    }));

                    this.forceUpdate();
                },
                error => {
                    this.setState({ isLoading: false, error });
                }
            );
    };

    render() {

        let left = this.state.total - this.state.items.length - this.state.items2.length - this.state.items3.length;
        let t = Math.round(Math.min(left/3, 5));

        if (!this.state.loaded) {
            t = 5;
            left = 1;
        }

        return (
            <div
                style={{
                    opacity:
                        editorStore.selectedTab === SidebarTab.Background ? 1 : 0,
                    position: "absolute",
                    width: "347px",
                    color: "white",
                    overflow: "scroll",
                    transition:
                        "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                    transform:
                        editorStore.selectedTab !== SidebarTab.Background &&
                        `translate3d(0px, calc(${
                        editorStore.selectedTab < SidebarTab.Background ? 40 : -40
                        }px), 0px)`,
                    top: "10px",
                    zIndex: editorStore.selectedTab !== SidebarTab.Background && -1,
                    height: "100%",
                    left: '19px',
                }}
            >
                <InfiniteScroll
                    scroll={true}
                    throttle={100}
                    threshold={0}
                    isLoading={this.state.isLoading}
                    hasMore={this.state.hasMore}
                    onLoadMore={this.loadMore.bind(this, false)}
                    refId="sentinel-background"
                    marginTop={0}
                >
                    <div
                        id="image-container-picker"
                        style={{
                            display: "flex",
                            padding: "10px 13px 10px 0px"
                        }}
                    >
                        <div
                            style={{
                                width: "350px",
                            }}
                        >
                            {this.state.items.map((item, key) => (
                                <ImagePicker
                                    showButton={true}
                                    className="image-picker"
                                    id=""
                                    delay={0}
                                    width={backgroundWidth}
                                    key={key}
                                    color={item.color}
                                    src={item.representativeThumbnail}
                                    height={backgroundWidth / (item.width / item.height)}
                                    defaultHeight={backgroundWidth}
                                    onPick={this.backgroundOnMouseDown.bind(this, item)}
                                    onEdit={this.props.handleEditmedia.bind(this, item)}
                                />
                            ))}
                            {this.state.hasMore &&
                                Array(t)
                                    .fill(0)
                                    .map((item, i) => (
                                        <ImagePicker
                                            showButton={false}
                                            key={i}
                                            id="sentinel-background"
                                            color="black"
                                            src={""}
                                            height={backgroundWidth}
                                            width={backgroundWidth}
                                            defaultHeight={backgroundWidth}
                                            className=""
                                            onPick={null}
                                            onEdit={this.props.handleEditmedia.bind(this, null)}
                                            delay={0}
                                        />
                                    ))}
                        </div>
                        <div
                            style={{
                                width: "350px",
                            }}
                        >
                            {this.state.items2.map((item, key) => (
                                <ImagePicker
                                    showButton={true}
                                    className="image-picker"
                                    width={backgroundWidth}
                                    id=""
                                    key={key}
                                    color={item.color}
                                    src={item.representativeThumbnail}
                                    height={backgroundWidth / (item.width / item.height)}
                                    defaultHeight={backgroundWidth}
                                    onPick={this.backgroundOnMouseDown.bind(this, item)}
                                    onEdit={this.props.handleEditmedia.bind(this, item)}
                                    delay={150}
                                />
                            ))}
                            {this.state.hasMore &&
                                Array(t)
                                    .fill(0)
                                    .map((item, i) => (
                                        <ImagePicker
                                            showButton={false}
                                            key={i}
                                            id="sentinel-background"
                                            color="black"
                                            src={""}
                                            height={backgroundWidth}
                                            defaultHeight={backgroundWidth}
                                            className=""
                                            width={backgroundWidth}
                                            onPick={null}
                                            onEdit={this.props.handleEditmedia.bind(this, null)}
                                            delay={150}
                                        />
                                    ))}
                        </div>
                        <div
                            style={{
                                width: "350px"
                            }}
                        >
                            {this.state.items3.map((item, key) => (
                                <ImagePicker
                                    showButton={true}
                                    id=""
                                    className="image-picker"
                                    key={key}
                                    color={item.color}
                                    src={item.representativeThumbnail}
                                    height={backgroundWidth / (item.width / item.height)}
                                    width={backgroundWidth}
                                    defaultHeight={backgroundWidth}
                                    onPick={this.backgroundOnMouseDown.bind(this, item)}
                                    onEdit={this.props.handleEditmedia.bind(this, item)}
                                    delay={300}
                                />
                            ))}
                            {this.state.hasMore &&
                                Array(t)
                                    .fill(0)
                                    .map((item, i) => (
                                        <ImagePicker
                                            showButton={false}
                                            key={i}
                                            id="sentinel"
                                            color="black"
                                            src={""}
                                            height={backgroundWidth}
                                            defaultHeight={backgroundWidth}
                                            width={backgroundWidth}
                                            className=""
                                            onPick={null}
                                            onEdit={this.props.handleEditmedia.bind(this, null)}
                                            delay={300}
                                        />
                                    ))}
                        </div>
                    </div>
                </InfiniteScroll>
            </div>
        )
    }
}