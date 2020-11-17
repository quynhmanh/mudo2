import React, {Component} from "react";
import LeftSide from "@Components/editor/toolbar/LeftSide";
import RightSide from "@Components/editor/toolbar/RightSide";
import { observer } from "mobx-react";
import editorStore from "@Store/EditorStore";
import { TemplateType } from "../enums";
import noUiSlider from "@Components/nouislider";
import "@Styles/nouislider.scss";
import { getImageSelected } from "@Utils";

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
            var slider = document.getElementById('slider');

            if (slider) {
                try { 
                    noUiSlider.create(slider, {
                        start: [20, 80],
                        connect: true,
                        range: {
                            'min': 0,
                            'max': 100
                        }
                    });

                    let image = getImageSelected();
                    let el = document.getElementById("video-duration");

                    slider.noUiSlider.on('update', (range)=>{
                        let dur = parseFloat(range[1]) - parseFloat(range[0]);
                        el.innerHTML = Math.floor(image.duration * dur / 100 * 10) / 10 + "s";
                    });
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
                        width: "80px",
                        display: "flex",
                        alignItems: "center",
                    }}
                    onClick={e => {
                        this.setState({croppingVideo: false})
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="7" y="5" width="3" height="14" rx="1.5" fill="currentColor"></rect><rect x="14" y="5" width="3" height="14" rx="1.5" fill="currentColor"></rect></svg>
                    <span
                        id="video-duration"
                        style={{ 
                            marginLeft: "5px",
                            lineHeight: "30px",
                        }}>
                        5.2
                    </span>
                </button>
                <div
                    style={{
                        width: "85%",
                        marginTop: "8px",
                        display: image && image.type == TemplateType.Video ? "block" : "none",
                    }}
                    >
                        <div
                            id="slider"
                        ></div>
                    </div>
                    <button
                    className="toolbar-btn dropbtn-font"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "10px",
                    }}
                    onClick={e => {
                        editorStore.croppingVideo = false;
                    }}
                >
                    <span
                        style={{ 
                            marginLeft: "5px",
                            lineHeight: "30px",
                        }}>
                        Done
                    </span>
                </button>
            </div>
        );
    }
}

export default Toolbar;