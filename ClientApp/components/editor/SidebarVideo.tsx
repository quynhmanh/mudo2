import React, { Component } from 'react'
import { SidebarTab, TemplateType, SavingState, } from "./enums";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import { toJS } from "mobx";
import VideoPicker from "@Components/shared/VideoPicker2";
import Sidebar from "@Components/editor/SidebarStyled";
import {
    handleEditmedia,
    setSavingState,
} from "@Utils";

export interface IProps {
    videoOnMouseDown: any;
    translate: any;
    selectedTab: any;
    handleImageSelected: any;
    scale: any;
    setSavingState: any;
}

export interface IState {
    videos: any;
    loaded: boolean;
}

const imgWidth = 162;
const imgHeight = 80;
let getRem = (rem) => Array(rem).fill(0).map(i => {
    return {
        width: imgWidth,
        height: imgHeight,
        id: "sentinel-video",
    }
});


export default class SidebarVideo extends Component<IProps, IState> {
    state = {
        videos: [],
        loaded: false,
    }

    constructor(props) {
        super(props);

        this.videoOnMouseDown = this.videoOnMouseDown.bind(this);
        this.loadMoreVideo = this.loadMoreVideo.bind(this);
    }

    componentDidMount() {


    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.selectedTab == SidebarTab.Video) {
            if (!nextState.loaded) {
                this.loadMoreVideo(true);
            }
        }
        if (this.props.selectedTab != nextProps.selectedTab
            && (nextProps.selectedTab == SidebarTab.Video || this.props.selectedTab == SidebarTab.Video)
        ) {
            return true;
        }
        return false;
    }

    tmp = [];
    sum = 0;
    left = 10;

    loadMoreVideo = initialLoad => {
        let pageId;
        let count;
        if (initialLoad) {
            pageId = 1;
            count = 30;
        } else {
            pageId = editorStore.fontsList.length / 30 + 1;
            count = 30;
        }
        // this.setState({ isLoading: true, error: undefined });
        this.setState({loaded: true,})
        const url = `/api/Media/Search?page=${pageId}&perPage=${count}&type=${TemplateType.Video}`;
        fetch(url)
            .then(res => res.json())
            .then(
                res => {
                    let result = res.value.key;
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

                    let newItems = [...this.state.videos.filter(item => item.id != "sentinel-image"), ...items];
                    let hasMore = newItems.length + this.tmp.length < res.value.value;
                    if (hasMore) {
                        newItems = [...newItems, ...getRem(this.left)];
                    }
                    this.setState(state => ({
                        videos: newItems,
                        hasMoreVideos: res.value.value > state.videos.length + res.value.key.length,
                        loaded: true,
                    }));
                    this.forceUpdate();
                },
                error => {
                    // this.setState({ isLoading: false, error })
                }
            );
    };

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
            let pages = toJS(editorStore.pages);
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
                        duration: item.duration,
                        previewVideo: window.location.origin + "/" + item.previewVideo,
                    };

                    console.log('newItem', newItem);

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


    render() {

        return (
            <Sidebar
                selectedTab={editorStore.selectedTab}
                sidebar={SidebarTab.Video}
            >
                <div 
                    style={{ 
                        display: "inline-block", 
                        width: "100%", 
                        height: "100%",
                    }}>
                    <ul
                        id="object-container"
                        style={{
                            listStyle: "none",
                            padding: "0px 0px 10px 0px",
                            width: "101%",
                            marginTop: "10px",
                            overflow: "scroll",
                            height: "100%",
                        }}
                    >
                        {this.state.videos.map((item, key) => (
                            <VideoPicker
                                id=""
                                defaultHeight={imgWidth}
                                delay={0}
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
                    </ul>
                </div>
            </Sidebar>
        )
    }
}