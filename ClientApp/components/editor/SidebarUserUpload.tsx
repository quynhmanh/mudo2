import React, { Component } from 'react'
import { SidebarTab, TemplateType, SavingState, } from "./enums";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import ImagePicker from "@Components/shared/ImagePicker";
import Globals from '@Globals';
import Sidebar from "@Components/editor/SidebarStyled";
import axios from "axios";

export interface IProps {
    scale: number;
    translate: any;
    selectedTab: any;
    handleEditmedia: any;
    handleImageSelected: any;
    setSavingState: any;
}

export interface IState {
    items: any;
    items2: any;
    isLoading: boolean;
    currentItemsHeight: number;
    currentItems2Height: number;
    error: any;
    hasMore: boolean;
    cursor: any;
    total: number;
    loaded: boolean;
}

const imgWidth = 162;

export default class SidebarUserUpload extends Component<IProps, IState> {
    state = {
        isLoading: false,
        items: [],
        items2: [],
        currentItemsHeight: 0,
        currentItems2Height: 0,
        error: null,
        hasMore: true,
        cursor: null,
        total: 0,
        loaded: false,
    }

    constructor(props) {
        super(props);

        this.loadMore = this.loadMore.bind(this);
        this.imgOnMouseDown = this.imgOnMouseDown.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    componentDidMount() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.selectedTab == SidebarTab.Upload) {
            if (!nextState.loaded) {
                this.loadMore(true);
            }
        }
        if (this.props.selectedTab != nextProps.selectedTab
            && (nextProps.selectedTab == SidebarTab.Upload || this.props.selectedTab == SidebarTab.Upload)
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
            image.style.opacity = 0;
            image.parentNode.style.opacity = 0;

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
            image.parentNode.style.opacity = 1;
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
        const url = `/api/Media/Search?type=${TemplateType.UserUpload}&page=${pageId}&perPage=${PER_PAGE}&userEmail=${Globals.serviceUser ? Globals.serviceUser.username : ""}`;
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

    uploadImage = (removeBackground, e) => {
        console.log('uploadImage')
        let type;
        switch (editorStore.selectedTab) {
            case SidebarTab.Image:
                type = TemplateType.Image;
                break;
            case SidebarTab.Upload:
                type = TemplateType.UserUpload;
                break;
            case SidebarTab.Background:
                type = TemplateType.BackgroundImage;
                break;
            case SidebarTab.Element:
                type = TemplateType.Element;
                break;
        }

        var self = this;
        var fileUploader = document.getElementById(
            "image-file2"
        ) as HTMLInputElement;
        for (let i = 0; i < fileUploader.files.length; ++i) {
            console.log('i', i)
            let file = fileUploader.files[i];
            let fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onload = () => {
                var url = `/api/Media/Add`;
                if (type === TemplateType.RemovedBackgroundImage) {
                    url = `/api/Media/Add2`;
                }
                var img = new Image();
                img.onload = function () {

                    let item = {
                        id: uuidv4(),
                        representative: fr.result,
                        width: img.width,
                        height: img.height,
                        showProgressBar: true,
                    }

                    if (self.state.items.length <= self.state.items2.length) {
                        self.setState({
                            items: [item, ...self.state.items2]
                        });
                    } else {
                        self.setState({
                            items2: [item, ...self.state.items2]
                        });
                    }

                    self.forceUpdate();
                    
                    axios
                        .post(url, {
                            id: uuidv4(),
                            ext: file.name.split(".")[1],
                            userEmail: Globals.serviceUser ? Globals.serviceUser.username : "admin@draft.vn",
                            data: fr.result,
                            width: img.width,
                            height: img.height,
                            type,
                            keywords: [(document.getElementById("keywords") as HTMLInputElement).value],
                            title: "Manh quynh"
                        })
                        .then((res) => {
                            res.data.showProgressBar = false;
                            if (self.state.items[0].id == item.id) {
                                let items = [...self.state.items];
                                items[0] = res.data;

                                self.setState({items})
                            } else {
                                let items = [...self.state.items2];
                                items[0] = res.data;

                                self.setState({items2: items})
                            }

                            self.forceUpdate();
                        });
                };

                img.src = fr.result.toString();
            };
        }

        this.forceUpdate();
    };

    render() {

        let left = this.state.total - this.state.items.length - this.state.items2.length;
        let t = Math.round(Math.min(left/2, 5));

        if (!this.state.loaded) {
            t = 5;
            left = 1;
        }

        return (
            <Sidebar
                selectedTab={editorStore.selectedTab}
                sidebar={SidebarTab.Upload}
            >
            <InfiniteScroll
                scroll={true}
                throttle={100}
                threshold={0}
                isLoading={this.state.isLoading}
                marginTop={45}
                hasMore={this.state.hasMore}
                onLoadMore={this.loadMore.bind(this, false)}
                refId="sentinel-userupload"
            >
                <div
                    style={{
                        color: "white",
                        // overflow: "scroll",
                        width: "100%"
                    }}
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
                                    className="image-picker"
                                    height={imgWidth / (item.width / item.height)}
                                    defaultHeight={imgWidth}
                                    color=""
                                    delay={0}
                                    width={imgWidth}
                                    key={key}
                                    src={item.representative}
                                    onPick={e => {
                                        this.imgOnMouseDown(item, e);
                                    }}
                                    onEdit={this.props.handleEditmedia.bind(this, item)}
                                    showButton={false}
                                    showProgressBar={item.showProgressBar}
                                />
                            ))}
                            {this.state.hasMore &&
                                Array(t)
                                    .fill(0)
                                    .map((item, i) => (
                                        <ImagePicker
                                            key={i}
                                            id="sentinel-userupload"
                                            color="black"
                                            src={""}
                                            height={imgWidth}
                                            defaultHeight={imgWidth}
                                            width={imgWidth}
                                            className=""
                                            onPick={null}
                                            onEdit={this.props.handleEditmedia.bind(this, null)}
                                            delay={0}
                                            showButton={false}
                                        />
                                    ))}
                        </div>
                        <div
                            style={{
                                width: "350px"
                            }}
                        >
                            {this.state.items2.map((item, key) => (
                                <ImagePicker
                                    id=""
                                    className="image-picker"
                                    height={imgWidth / (item.width / item.height)}
                                    defaultHeight={imgWidth}
                                    color=""
                                    width={imgWidth}
                                    delay={0}
                                    key={key}
                                    src={item.representative}
                                    onPick={this.imgOnMouseDown.bind(this, item)}
                                    onEdit={this.props.handleEditmedia.bind(this, item)}
                                    showButton={false}
                                    showProgressBar={item.showProgressBar}
                                />
                            ))}
                            {this.state.hasMore &&
                                Array(t)
                                    .fill(0)
                                    .map((item, i) => (
                                        <ImagePicker
                                            key={i}
                                            id="sentinel-userupload"
                                            color="black"
                                            src={""}
                                            height={imgWidth}
                                            defaultHeight={imgWidth}
                                            width={imgWidth}
                                            className=""
                                            onPick={this.imgOnMouseDown.bind(
                                                this,
                                                null
                                            )}
                                            onEdit={this.props.handleEditmedia.bind(this, null)}
                                            delay={-1}
                                            showButton={false}
                                        />
                                    ))}
                        </div>
                    </div>
                </div>
            </InfiniteScroll>
            <button
                style={{
                    width: "calc(100% - 13px)",
                    backgroundColor: "white",
                    border: "none",
                    color: "black",
                    padding: "10px",
                    borderRadius: "3px",
                    height: "37px",
                    marginBottom: "10px",
                    position: "absolute",
                    top: "6px",
                    boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
                    lineHeight: "15px",
                }}
                onClick={() => {
                    document.getElementById("image-file2").click();
                }}
            >
                {/* Tải lên một ảnh */}
                {this.props.translate("uploadAnImage")}
            </button>
            <input
                id="image-file2"
                type="file"
                multiple
                onLoadedData={data => { }}
                onChange={e => { this.uploadImage(false, e);
                }}
                style={{
                    bottom: 0
                }}
            />
        </Sidebar>
        )
    }
}