import React, { Component } from 'react'
import { SidebarTab, TemplateType, } from "./enums";
import editorStore from "@Store/EditorStore";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import ImagePicker from "@Components/shared/ImagePicker";
import {toJS} from "mobx";
import Sidebar from "@Components/editor/SidebarStyled";

export interface IProps {
    scale: number;
    translate: any;
    selectedTab: any;
    handleEditmedia: any;
    handleImageSelected: any;
    rectWidth: number;
    rectHeight: number;
    updateImages: any;
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
    total: number;
    loaded: boolean;
}

const backgroundWidth = 105;
const imgWidth = 105;

let getRem = (rem) => Array(rem).fill(0).map(i => {
    return {
        width: imgWidth,
        height: imgWidth,
        id: "sentinel-background",
    }
});


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

    rem = 10;
    left = 10;

    constructor(props) {
        super(props);

        this.state.items = getRem(props.rem);
        this.left = props.rem;

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
                    let result = res.value.key;
                    let items = this.state.items.filter(item => item.id != "sentinel-background");
                    items = [...items, ...result];
                    let hasMore = res.value.value > items.length;
                    if (hasMore) {
                        let left = Math.min(this.rem, res.value.value - items.length);
                        this.left = left;
                        items = [...items, ...getRem(left)];
                    }

                    this.setState(state => ({
                        items,
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
        return (
            <Sidebar
                selectedTab={editorStore.selectedTab}
                sidebar={SidebarTab.Background}
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
                            padding: "10px 0px 10px 0px"
                        }}
                    >
                        <div>
                            {this.state.items.map((item, key) => (
                                <ImagePicker
                                    showButton={true}
                                    id={item.id}
                                    delay={250 * key}
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
                        </div>
                    </div>
                </InfiniteScroll>
            </Sidebar>
        )
    }
}