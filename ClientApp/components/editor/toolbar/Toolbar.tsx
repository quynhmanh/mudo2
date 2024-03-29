import React, {Component} from "react";
import LeftSide from "@Components/editor/toolbar/LeftSide";
import RightSide from "@Components/editor/toolbar/RightSide";
import { observer } from "mobx-react";
import editorStore from "@Store/EditorStore";
import { CanvasType, TemplateType } from "../enums";
import noUiSlider from "@Components/nouislider";
import "@Styles/nouislider.scss";
import { getImageSelected, toggleVideo } from "@Utils";

interface IProps {
    selectedCanvas: any;
    align: any;
    selectedTab: any;
    translate: any;
    editorStore: any;
    childId: string;
    fontColor: string;
    onClickDropDownFontList: any;
    onClickEffectList: any;
    fontName: string;
    fontId: string;
    cropMode: boolean;
    handleFilterBtnClick: any;
    handleAdjustBtnClick: any;
    handleFlipBtnClick: any;
    imgBackgroundColor: string;
    handleImageBackgroundColorBtnClick: any;
    selectedImage: any;
    fontSize: number;
    handleOkBtnClick: any;
    handleCancelBtnClick: any;
    idObjectSelected: string;
    onClickpositionList: any;
    onClickTransparent: any;
    forwardSelectedObject: any;
    backwardSelectedObject: any;
    currentOpacity: number;
    currentLineHeight: number;
    currentLetterSpacing: number;
    handleLineHeightChange: any;
    handleLineHeightChangeEnd: any;
    handleLetterSpacingEnd: any;
    handleLetterSpacing: any;
    effectId: number;
    bold: boolean;
    italic: boolean;
    updateImages: any;
    scale: any;
    groupGroupedItem: any;
    ungroupGroupedItem: any;
    removeImage: any;
    croppingVideo: boolean;
}

interface IState {
    croppingVideo: boolean;
}

@observer
class Toolbar extends Component<IProps, IState> {

    constructor(props) {
        super(props);

        this.state = {
            croppingVideo: false,
        }
    }

    cropVideo() {
        this.setState({croppingVideo: true,})
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.croppingVideo == false && editorStore.croppingVideo) {
            console.log('updated')
            var slider = document.getElementById('slider');

            if (slider && !window.sliderInitialized) {
                try { 
                    window.sliderInitialized = true;
                    let image = getImageSelected();

                    noUiSlider.create(slider, {
                        start: [image.timeStart ? image.timeStart * 100 : 0, image.timeEnd ? image.timeEnd * 100 : 100],
                        connect: true,
                        range: {
                            'min': 0,
                            'max': 100
                        }
                    });

                    let el = document.getElementById("video-duration");
                    let video = document.getElementById(editorStore.idObjectSelected + "video0alo");
                    let time_start = 0;
                    let time_end = 1;

                    slider.noUiSlider.on('update', (range)=>{
                        let dur = parseFloat(range[1]) - parseFloat(range[0]);
                        el.innerHTML = Math.floor(image.duration * dur / 100 * 10) / 10 + "s";

                        time_start = parseFloat(range[0]) / 100;
                        time_end = parseFloat(range[1]) / 100;
                        
                        image.timeStart = time_start;
                        image.timeEnd = time_end;

                        editorStore.images2.set(image._id, image);
                    });

                    let slider_time_pos = document.getElementById("slider_time_pos");
                    console.log('slider_time_pos', slider_time_pos);
                    slider_time_pos.addEventListener("mousedown", (e) => {
                        window.pauser.next(true);
                        let ele = e.target;
                        let last_pos = e.clientX;
                        function mup(e, ele){
                            document.onmousemove = null;
                            document.onmouseup = null;
                        }
                        function mmov(e, ele){
                            window.pauser.next(false);
                            let delta = e.clientX - last_pos;
                            last_pos = e.clientX;
                            let total_percent = (ele.offsetLeft+delta)/ele.parentElement.offsetWidth;
                            video.currentTime = video.duration * total_percent
                        }
                        document.onmousemove = (e)=>{mmov(e, ele)};
                        document.onmouseup = (e)=>{mup(e, ele)};
                    });

                    const update = () => {
                        if (video.currentTime + 0.1 < time_start * video.duration){
                            video.currentTime = time_start * video.duration;
                        }
                        if (video.currentTime > time_end * video.duration)
                            video.currentTime = time_start * video.duration;
                        
                        slider_time_pos.style.left = video.currentTime / video.duration * 100 + "%";

                        if (editorStore.croppingVideo)
                            requestAnimationFrame(update.bind(this)); // Tell browser to trigger this method again, next animation frame.
                    }
                    
                    update();
                } catch (e) {
                    console.log("Error when create slider.", e)
                }
            }
        }
    }


    render() {
        let image = editorStore.images2.get(editorStore.idObjectSelected);

        const props = this.props;
        return (
            !editorStore.croppingVideo ? <div
                style={{
                    display: "inline-flex",
                }}
            >
                <LeftSide
                    tReady={props.tReady}
                    scale={props.scale}
                    updateImages={props.updateImages}
                    selectedCanvas={props.selectedCanvas}
                    italic={props.italic}
                    bold={props.bold}
                    effectId={props.effectId}
                    align={props.align}
                    selectedTab={editorStore.selectedTab}
                    childId={props.childId}
                    translate={props.translate}
                    fontColor={props.fontColor}
                    onClickDropDownFontList={props.onClickDropDownFontList}
                    onClickEffectList={props.onClickEffectList}
                    fontName={props.fontName}
                    fontId={props.fontId}
                    cropMode={props.cropMode}
                    handleFilterBtnClick={props.handleFilterBtnClick}
                    handleAdjustBtnClick={props.handleAdjustBtnClick}
                    handleFlipBtnClick={props.handleFlipBtnClick}
                    imgBackgroundColor={props.imgBackgroundColor}
                    handleImageBackgroundColorBtnClick={props.handleImageBackgroundColorBtnClick}
                    selectedImage={props.selectedImage}
                    fontSize={props.fontSize}
                    idObjectSelected={props.idObjectSelected}
                    handleOkBtnClick={props.handleOkBtnClick}
                    handleCancelBtnClick={props.handleCancelBtnClick}
                    handleLineHeightChange={props.handleLineHeightChange}
                    handleLineHeightChangeEnd={props.handleLineHeightChangeEnd}
                    handleLetterSpacingEnd={props.handleLetterSpacingEnd}
                    handleLetterSpacing={props.handleLetterSpacing}
                    currentLineHeight={props.currentLineHeight}
                    currentLetterSpacing={props.currentLetterSpacing}
                    cropVideo={this.cropVideo}
                />
                <RightSide
                    show=
                    {
                        editorStore.idObjectSelected || editorStore.childId
                    }
                    cropMode={props.cropMode}
                    translate={props.translate}
                    onClickpositionList={props.onClickpositionList}
                    onClickTransparent={props.onClickTransparent}
                    forwardSelectedObject={props.forwardSelectedObject}
                    backwardSelectedObject={props.backwardSelectedObject}
                    currentOpacity={props.currentOpacity}
                    groupGroupedItem={props.groupGroupedItem}
                    ungroupGroupedItem={props.ungroupGroupedItem}
                    removeImage={props.removeImage}
                />
            </div> : 
            <div style={{
                display: "flex",
                width: "100%",
            }}>
                <button
                    className="toolbar-btn dropbtn-font"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: "0px",
                    }}
                    onClick={e => {
                        toggleVideo();
                    }}
                >
                    {image && !image.paused ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="7" y="5" width="3" height="14" rx="1.5" fill="currentColor"></rect><rect x="14" y="5" width="3" height="14" rx="1.5" fill="currentColor"></rect></svg>
                    : <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.248 4.212l11.05 6.574c.694.412.91 1.29.483 1.961-.121.19-.287.35-.483.467l-11.05 6.574c-.694.413-1.602.204-2.03-.467A1.39 1.39 0 0 1 6 18.574V5.426C6 4.638 6.66 4 7.475 4c.273 0 .54.073.773.212z" fill="currentColor"></path></svg>}
                </button>
                <span
                        id="video-duration"
                        style={{ 
                            marginLeft: "5px",
                            lineHeight: "32px",
                            marginRight: "15px",
                            minWidth: "40px",
                            fontWeight: 600,
                        }}>
                        5.2
                    </span>
                <div
                    style={{
                        width: "100%",
                        display: image && image.type == TemplateType.Video ? "block" : "none",
                        position: "relative",
                    }}
                    >
                        <div
                            id="slider"
                            style={{
                                backgroundImage: image && `url(${image.previewVideo})`,
                                backgroundSize: "cover",
                            }}
                        ></div>
                        <div 
                            id="slider_time_pos"
                            style={{
                                position: 'absolute',
                                width: '4px',
                                background: 'white',
                                height: '32px',
                                top: '0',
                                left: '50%',
                                cursor: 'pointer',
                                zIndex: 123,
                            }}
                            ></div>
                    </div>
                    <button
                    className="toolbar-btn dropbtn-font"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "7px",
                        marginRight: 0,
                        padding: "0 10px",
                    }}
                    onClick={e => {
                        editorStore.croppingVideo = false;
                    }}
                >
                    <span
                        style={{ 
                            lineHeight: "30px",
                        }}>
                        {this.props.translate("done")}
                    </span>
                </button>
            </div>
        );
    }
}

export default Toolbar;