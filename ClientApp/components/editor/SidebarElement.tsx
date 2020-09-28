import React, { Component } from 'react'
import { SidebarTab, TemplateType, SavingState, } from "./enums";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import ImagePicker from "@Components/shared/ImagePicker";
import SidebarElement from "@Components/editor/SidebarElementCatalog";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import Sidebar from "@Components/editor/SidebarStyled";

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
    query: string;
    total: number;
}

const imgWidth = 105;
const backgroundWidth = 105;

let elements = {};

let getRem = (rem) => Array(rem).fill(0).map(i => {
    return {
        width: imgWidth,
        height: imgWidth,
        id: "sentinel-element",
    }
});


export default class SidebarEffect extends Component<IProps, IState> {

    rem = 10;

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
        total: 10,
    }

    constructor(props) {
        super(props);

        this.state.items = getRem(props.rem);
        this.left = props.rem;

        this.handleQuery = this.handleQuery.bind(this);
    }

    componentDidMount() {
        console.log('this.state.items' , this.state.items)
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

    frameOnMouseDownload(img, e) {

        console.log('img ', img)

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
                        type: TemplateType.Element,
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

    imgOnMouseDown(img, e) {

        console.log('img ', img)

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
                        type: TemplateType.Image,
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

    loadMore = (initialload, term) => {
        let pageId = Math.round((this.state.items.length - this.left) / this.props.rem) + 1;
        const count = 15;
        this.setState({ isLoading: true, error: undefined });
        const url = `/api/Media/Search?type=${TemplateType.Element}&page=${pageId}&perPage=${this.props.rem}&terms=${initialload ? term : this.state.query}`;
        console.log('loadmore ', url)
        fetch(url)
            .then(res => res.json())
            .then(
                res => {
                    let result = res.value.key;
                    let items = this.state.items.filter(item => item.id != "sentinel-element");
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
                        hasMore,
                    }));

                    // var result = res.value.key;
                    // if (initialload) {
                    //     elements[term] =  result;
                    // }
                    // console.log('elements ', result)
                    // this.setState(state => ({
                    //     items: [...state.items, ...result],
                    //     isLoading: false,
                    //     hasMore: res.value.value > state.items.length,
                    // }));

                    this.forceUpdate();
                },
                error => {
                    this.setState({ isLoading: false, error });
                }
            );
    };

    handleQuery = term => {
        this.left = this.props.rem;
        this.setState({ query: term, items: getRem(this.left) }, () => {
            this.loadMore(false);
        });
        document.getElementById("queryInput").value = term;
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
                    style={{
                        position: "absolute",
                        zIndex: 11,
                        width: "calc(100% - 15px)",
                        marginBottom: "15px",
                        border: "none",
                        height: "37px",
                        borderRadius: "3px",
                        padding: "5px 10px",
                        fontSize: "14px",
                        boxShadow:
                            "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
                        top: "6px",
                        color: "black",
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath fill='black' d='M15.2 16.34a7.5 7.5 0 1 1 1.38-1.45l4.2 4.2a1 1 0 1 1-1.42 1.41l-4.16-4.16zm-4.7.16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z'/%3E%3C/svg%3E")`,
                        backgroundSize: '24px',
                        backgroundRepeat: 'no-repeat',
                        paddingLeft: '40px',
                        backgroundPosition: 'left 8px center',
                    }}
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            this.handleQuery(e.target.value);
                        }
                    }}
                    type="text"
                    placeholder="Search icons and shapes"
                    onChange={e => {
                        this.setState({ query: e.target.value });
                    }}
                // value={this.state.query}
                />
                <button
                    onClick={e => this.handleQuery("")}
                    className="clear"
                    style={{
                        position: 'absolute',
                        right: '15px',
                        top: '11px',
                        border: 'none',
                        zIndex: 123,
                    }}
                    type="button"><span class="TcNIhA"><span aria-hidden="true" class="NA_Img dkWypw"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="black" d="M13.06 12.15l5.02-5.03a.75.75 0 1 0-1.06-1.06L12 11.1 6.62 5.7a.75.75 0 1 0-1.06 1.06l5.38 5.38-5.23 5.23a.75.75 0 1 0 1.06 1.06L12 13.2l4.88 4.87a.75.75 0 1 0 1.06-1.06l-4.88-4.87z"></path></svg></span></span></button>
                <InfiniteScroll
                    scroll={true}
                    throttle={500}
                    threshold={300}
                    isLoading={this.state.isLoading}
                    hasMore={this.state.hasMore}
                    onLoadMore={this.loadMore.bind(this, false)}
                    marginTop={40}
                    refId="sentinel-element"
                >
                    <div
                        style={{
                            display: "inline-block",
                            width: "100%",
                            marginTop: "18px",
                        }}>
                        {!this.state.query && <div>
                            <SidebarElement
                                term="Frame"
                                handleQuery={this.handleQuery}
                                handleImageSelected={this.props.handleImageSelected}
                                scale={this.props.scale}
                            />
                            <SidebarElement
                                term="Lines"
                                handleQuery={this.handleQuery}
                                handleImageSelected={this.props.handleImageSelected}
                                scale={this.props.scale}
                            />
                            <SidebarElement
                                term="Shapes"
                                handleQuery={this.handleQuery}
                                handleImageSelected={this.props.handleImageSelected}
                                scale={this.props.scale}
                            />
                            <SidebarElement
                                term="Stickers"
                                handleQuery={this.handleQuery}
                                handleImageSelected={this.props.handleImageSelected}
                                scale={this.props.scale}
                            />
                        </div>}
                        {this.state.query && this.state.items.map((item, key) => {
                            let width, height;
                            if (item.width > item.height) {
                                width = imgWidth;
                                height = imgWidth / (item.width / item.height);
                            } else {
                                height = imgWidth;
                                width = imgWidth * (item.width / item.height);
                            }
                            console.log('item ', item)
                            return <div
                                style={{
                                    display: "inline-flex",
                                    width: imgWidth + "px",
                                    height: imgWidth + "px",
                                    justifyContent: "center",
                                    marginRight: "9px",
                                    marginBottom: "8px",
                                    position: "relative",
                                }}
                            >
                                <ImagePicker
                                    id={item.id}
                                    key={key + "1"}
                                    color={item.color}
                                    src={item.representative && item.representative.endsWith("gif") ? item.representative : item.representativeThumbnail}
                                    height={height}
                                    defaultHeight={imgWidth}
                                    width={width}
                                    className="image-picker"
                                    onPick={item.keywords && item.keywords[0] == "Frame" ? 
                                    this.frameOnMouseDownload.bind(this, item) : 
                                        this.imgOnMouseDown.bind(this, item)}
                                    onEdit={this.props.handleEditmedia.bind(this, item)}
                                    delay={0}
                                    showButton={true}
                                    backgroundColorLoaded="transparent"
                                    marginRight={0}
                                    marginAuto={true}
                                />
                            </div>
                        })}
                    </div>
                </InfiniteScroll>
            </Sidebar>
        )
    }
}