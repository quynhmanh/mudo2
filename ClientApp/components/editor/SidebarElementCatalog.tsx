import React, { Component } from 'react'
import { SidebarTab, TemplateType, SavingState, } from "./enums";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import InfiniteXScroll from "@Components/shared/InfiniteXScroll";
import ImagePicker from "@Components/shared/ImagePicker";
import { init } from 'i18next';

export interface IProps {
    term: string;
}

export interface IState {

}

const imgWidth = 105;
const backgroundWidth = 105;

export default class SidebarEffect extends Component<IProps, IState> {

    elements = [];

    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount() {
        this.loadMore.bind(this)(true, this.props.term);
    }

    
    loadMore = (initialload, term) => {
        let pageId;
        let count;
        if (initialload) {
            pageId = 1;
            count = 30;
        };
        this.setState({ isLoading: true, error: undefined });
        const url = `/api/Media/Search?type=${TemplateType.Element}&page=${pageId}&perPage=${count}&terms=${initialload ? term : this.state.query}`;
        console.log('loadmore ', url)
        fetch(url)
            .then(res => res.json())
            .then(
                res => {
                    var result = res.value.key;
                    if (initialload) {
                        this.elements =  result;
                    }
                    
                    this.forceUpdate();
                },
                error => {
                    this.setState({ isLoading: false, error });
                }
            );
    };
    
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


    render() {

        return (
            <div>
                <p
                    style={{
                        marginTop: "10px",
                        display: "inline-block",
                    }}
                >{this.props.term}</p>
                <button
                    onClick={e => {
                        this.setState({ query: this.props.term });
                        document.getElementById("queryInput").value = this.props.term;
                        this.props.handleQuery(this.props.term);
                    }}
                    style={{
                        float: 'right',
                        marginTop: '7px',
                        border: 'none',
                        marginRight: '12px',
                    }}
                >See all</button>
                <div
                    style={{
                        display: "flex",
                        margin: "0px 0px",
                    }}
                >
                    <div
                        style={{
                            width: "340px",
                            height: "83px",
                            position: 'relative',
                            margin: "0px 10px 0px 0px",
                        }}
                    >
                        <InfiniteXScroll
                            scroll={true}
                            throttle={1000}
                            threshold={300}
                            isLoading={false}
                            hasMore={this.state.hasMore}
                            onLoadMore={this.loadMore.bind(this, false)}
                            refId="sentinel-image2"
                            marginTop={45}
                            buttonSize={30}
                            buttonColor="transparent"
                            buttonHeight="100%"
                            svgColor="white"
                            hideBackgroundBefore={false}
                            hover={false}
                            height="100%"
                        >
                            {this.elements && this.elements.map(el =>
                                <div
                                    style={{
                                        display: "inline-flex",
                                        height: "80px",
                                        width: "80px",
                                        justifyContent: "center",
                                        marginRight: "10px",
                                        marginBottom: "10px",
                                    }}
                                >
                                    <img
                                        onMouseDown={this.frameOnMouseDownload.bind(this, el)}
                                        style={{
                                            // width: "100px",
                                            maxWidth: "100%",
                                            // height: 100 / (el.clipWidth / el.clipHeight) + "px",
                                            maxHeight: "100%",
                                            cursor: 'pointer',
                                            margin: "auto",
                                        }}
                                        src={el.representative}
                                    />
                                </div>
                            )}
                        </InfiniteXScroll>
                    </div>
                </div>
            </div>
        )
    }
}