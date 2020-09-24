import React, { Component } from 'react'
import { SidebarTab, TemplateType, SavingState, } from "./enums";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import ImagePicker from "@Components/shared/ImagePicker";

export interface IProps {
    scale: number;
    translate: any;
    selectedTab: any;
    handleEditmedia: any;
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
}

const imgWidth = 162;

export default class SidebarImage extends Component<IProps, IState> {
    state = {
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

        this.imgOnMouseDown = this.imgOnMouseDown.bind(this);
        this.loadMore = this.loadMore.bind(this);
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
        window.imagesrc = target.src;
        target.style.width = e.target.getBoundingClientRect().width + "px";
        target.style.backgroundColor = e.target.style.backgroundColor;
        document.body.appendChild(target);
        let self = this;
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

            console.log('window.imageselected', window.imageselected)

            let rec2 = imgDragging.getBoundingClientRect();
            if (window.imageselected) {
                let ratio = rec2.width / rec2.height;
                imgDragging.remove();
                image.style.opacity = 1;

                console.log('window.imageselected', window.imageselected)
                let id = window.imageselected;
                let image2 = editorStore.images2.get(id);
                image2.src = target.src;
                image2.selected = false;
                image2.hovered = false;
                if (ratio < 1) {
                    image2.imgWidth = image2.width;
                    image2.imgHeight = image2.width / ratio;
                    window.oldWidth = 500 + "px";
                    window.oldHeight = 500 / ratio + "px";
                } else {
                    image2.imgWidth = image2.height * ratio;;
                    image2.imgHeight = image2.height;
                    window.oldWidth = 500 * ratio + "px";
                    window.oldHeight = 500 + "px";
                }
                this.props.updateImages(id, image2.page, image2, true);

                return;
            }

            let recs = document.getElementsByClassName("alo");
            for (let i = 0; i < recs.length; ++i) {
                console.log('asd', rec2)
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
                        posX: 0,
                        posY: 0,
                        imgWidth: rec2.width / scale,
                        imgHeight: rec2.height / scale,
                        page: editorStore.pages[i],
                        zIndex: editorStore.upperZIndex + 1,
                        freeStyle: img.freeStyle
                    };

                    console.log('asd')
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

    loadMore = (initialLoad: Boolean) => {
        let pageId;
        const PER_PAGE = 16;
        if (initialLoad) {
            pageId = 1;
        } else {
            pageId = (this.state.items.length + this.state.items2.length) / 16 + 1;
        }
        this.setState({ isLoading: true, error: undefined, loaded: true, });
        const url = `/api/Media/Search?type=${TemplateType.Image}&page=${pageId}&perPage=${PER_PAGE}`; //&terms=${this.state.query}`;
        fetch(url)
            .then(res => res.json())
            .then(
                res => {
                    var result = res.value.key;
                    var currentItemsHeight = this.state.currentItemsHeight;
                    var currentItems2Height = this.state.currentItems2Height;
                    var res1 = [];
                    var res2 = [];
                    for (var i = 0; i < result.length; ++i) {
                        var currentItem = result[i];
                        if (currentItemsHeight <= currentItems2Height) {
                            res1.push(currentItem);
                            currentItemsHeight +=
                                imgWidth / (currentItem.width / currentItem.height);
                        } else {
                            res2.push(currentItem);
                            currentItems2Height +=
                                imgWidth / (currentItem.width / currentItem.height);
                        }
                    }
                    this.setState(state => ({
                        items: [...state.items, ...res1],
                        items2: [...state.items2, ...res2],
                        currentItemsHeight,
                        currentItems2Height,
                        cursor: res.cursor,
                        isLoading: false,
                        total: res.value.value,
                        hasMoreImage:
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

        let left = this.state.total - this.state.items.length - this.state.items2.length;
        let t = Math.round(Math.min(left/2, 8));

        if (!this.state.loaded) {
            left = 8;
            t = 4;
        }

        return (
            <div
                style={{
                    opacity: editorStore.selectedTab === SidebarTab.Image ? 1 : 0,
                    position: "absolute",
                    width: "347px",
                    transition:
                        "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                    transform:
                        editorStore.selectedTab !== SidebarTab.Image &&
                        `translate3d(0px, calc(-${
                        editorStore.selectedTab > SidebarTab.Image ? 40 : -40
                        }px), 0px)`,
                    zIndex: editorStore.selectedTab !== SidebarTab.Image && -1,
                    top: "10px",
                    height: "100%",
                    left: '19px',
                }}
            >
                <div
                    style={{
                        zIndex: 123
                    }}
                >
                    <InfiniteScroll
                        scroll={true}
                        throttle={500}
                        threshold={300}
                        isLoading={this.state.isLoading}
                        hasMore={this.state.hasMoreImage}
                        onLoadMore={this.loadMore.bind(this, false)}
                        refId="sentinel-image"
                        marginTop={45}
                    >
                        <div
                            id="image-container-picker"
                            style={{ display: "flex", padding: "16px 13px 10px 0px" }}
                        >
                            <div
                                style={{
                                    height: "calc(100% - 170px)",
                                    width: "350px",
                                }}
                            >
                                {this.state.items.map((item, key) => (
                                    <ImagePicker
                                        id=""
                                        key={key + "1"}
                                        color={item.color}
                                        src={item.representativeThumbnail}
                                        height={imgWidth / (item.width / item.height)}
                                        defaultHeight={imgWidth}
                                        width={imgWidth}
                                        className="image-picker"
                                        onPick={this.imgOnMouseDown.bind(this, item)}
                                        onEdit={this.props.handleEditmedia.bind(this, item)}
                                        delay={0}
                                        showButton={true}
                                        backgroundColorLoaded="transparent"
                                    />
                                ))}
                                {left > 0 && this.state.hasMoreImage &&
                                    Array(t)
                                        .fill(0)
                                        .map((item, i) => (
                                            <ImagePicker
                                                showButton={false}
                                                key={i + "11"}
                                                id="sentinel-image"
                                                color="black"
                                                src={""}
                                                height={imgWidth}
                                                defaultHeight={imgWidth}
                                                width={imgWidth}
                                                className=""
                                                onPick={null}
                                                onEdit={this.props.handleEditmedia.bind(this, null)}
                                                delay={0}
                                                backgroundColorLoaded="transparent"
                                            />
                                        ))}
                            </div>
                            <div
                                style={{
                                    height: "calc(100% - 170px)",
                                    width: "350px"
                                }}
                            >
                                {this.state.items2.map((item, key) => (
                                    <ImagePicker
                                        showButton={true}
                                        id=""
                                        key={key + "2"}
                                        color={item.color}
                                        src={item.representativeThumbnail}
                                        height={imgWidth / (item.width / item.height)}
                                        defaultHeight={imgWidth}
                                        width={imgWidth}
                                        className="image-picker"
                                        onPick={this.imgOnMouseDown.bind(this, item)}
                                        onEdit={this.props.handleEditmedia.bind(this, item)}
                                        delay={-1}
                                        backgroundColorLoaded="transparent"
                                    />
                                ))}
                                {left > 0 && this.state.hasMoreImage &&
                                    Array(t)
                                    .fill(0)
                                        .map((item, i) => (
                                            <ImagePicker
                                                showButton={false}
                                                key={i + "22"}
                                                id="sentinel-image"
                                                color="black"
                                                src={""}
                                                height={imgWidth}
                                                defaultHeight={imgWidth}
                                                width={imgWidth}
                                                className=""
                                                onPick={null}
                                                onEdit={this.props.handleEditmedia.bind(this, null)}
                                                delay={150}
                                            />
                                        ))}
                            </div>
                        </div>
                    </InfiniteScroll>
                    <input
                        style={{
                            zIndex: 11,
                            width: "calc(100% - 13px)",
                            marginBottom: "8px",
                            border: "none",
                            height: "37px",
                            borderRadius: "3px",
                            padding: "5px",
                            fontSize: "13px",
                            boxShadow:
                                "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
                            position: "absolute",
                            top: "6px"
                        }}
                        // onKeyDown={this.handleQuery}
                        type="text"
                        onChange={e => {
                            // this.setState({ query: e.target.value });
                        }}
                    // value={this.state.query}
                    />
                </div>
            </div>
        )
    }
}