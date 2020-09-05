import React, {Component} from "react";
import LeftSide from "@Components/editor/toolbar/LeftSide";
import RightSide from "@Components/editor/toolbar/RightSide";
import { observer } from "mobx-react";
import editorStore from "@Store/EditorStore";

interface IProps {
    selectedCanvas: any;
    align: any;
    selectedTab: any;
    translate: any;
    editorStore: any;
    childId: string;
    fontColor: string;
    handleColorBtnClick: any;
    handleItalicBtnClick: any;
    handleBoldBtnClick: any;
    onClickDropDownFontList: any;
    onClickEffectList: any;
    fontName: string;
    fontId: string;
    cropMode: boolean;
    handleFilterBtnClick: any;
    handleAdjustBtnClick: any;
    handleCropBtnClick: any;
    handleFlipBtnClick: any;
    imgBackgroundColor: string;
    handleImageBackgroundColorBtnClick: any;
    selectedImage: any;
    fontSize: number;
    handleFontSizeBtnClick: any;
    handleAlignBtnClick: any;
    handleOkBtnClick: any;
    handleCancelBtnClick: any;
    idObjectSelected: string;
    onClickpositionList: any;
    onClickTransparent: any;
    forwardSelectedObject: any;
    backwardSelectedObject: any;
    handleTransparentAdjust: any;
    currentOpacity: number;
    currentLineHeight: number;
    currentLetterSpacing: number;
    handleOpacityChange: any;
    handleOpacityChangeEnd: any;
    handleLineHeightChange: any;
    handleLineHeightChangeEnd: any;
    handleLetterSpacingEnd: any;
    handleLetterSpacing: any;
    effectId: number;
    bold: boolean;
    italic: boolean;
    pauser: any;
}

interface IState {
    
}

@observer
class Toolbar extends Component<IProps, IState> {
    render() {
        const props = this.props;
        return (
            <div
                style=
                {{
                    width: "100%",
                    backgroundColor: "#dae0e7",
                    // boxShadow: "0 1px 0 rgba(14,19,24,.15)",
                    display: "inline-flex",
                    position: "absolute",
                    right: 0,
                    left: "0px",
                    height: "46px",
                    padding: "8px",
                    marginBottom: "10px",
                    zIndex: 2,
                    background: '#fff',
                    boxShadow: '0 1px 0 rgba(14,19,24,.15)',
                    // padding: '8px',
                }}
            >
                <LeftSide
                    selectedCanvas={props.selectedCanvas}
                    italic={props.italic}
                    bold={props.bold}
                    effectId={props.effectId}
                    align={props.align}
                    selectedTab={props.selectedTab}
                    editorStore={props.editorStore}
                    childId={props.childId}
                    translate={props.translate}
                    handleColorBtnClick={props.handleColorBtnClick}
                    fontColor={props.fontColor}
                    handleItalicBtnClick={props.handleItalicBtnClick}
                    handleBoldBtnClick={props.handleBoldBtnClick}
                    onClickDropDownFontList={props.onClickDropDownFontList}
                    onClickEffectList={props.onClickEffectList}
                    fontName={props.fontName}
                    fontId={props.fontId}
                    cropMode={props.cropMode}
                    handleFilterBtnClick={props.handleFilterBtnClick}
                    handleAdjustBtnClick={props.handleAdjustBtnClick}
                    handleCropBtnClick={props.handleCropBtnClick}
                    handleFlipBtnClick={props.handleFlipBtnClick}
                    imgBackgroundColor={props.imgBackgroundColor}
                    handleImageBackgroundColorBtnClick={props.handleImageBackgroundColorBtnClick}
                    selectedImage={props.selectedImage}
                    fontSize={props.fontSize}
                    handleFontSizeBtnClick={props.handleFontSizeBtnClick}
                    idObjectSelected={props.idObjectSelected}
                    handleAlignBtnClick={props.handleAlignBtnClick}
                    handleOkBtnClick={props.handleOkBtnClick}
                    handleCancelBtnClick={props.handleCancelBtnClick}
                    handleLineHeightChange={props.handleLineHeightChange}
                    handleLineHeightChangeEnd={props.handleLineHeightChangeEnd}
                    handleLetterSpacingEnd={props.handleLetterSpacingEnd}
                    handleLetterSpacing={props.handleLetterSpacing}
                    currentLineHeight={props.currentLineHeight}
                    currentLetterSpacing={props.currentLetterSpacing}
                    pauser={props.pauser}
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
                    handleTransparentAdjust={props.handleTransparentAdjust}
                    currentOpacity={props.currentOpacity}
                    handleOpacityChange={props.handleOpacityChange}
                    handleOpacityChangeEnd={props.handleOpacityChangeEnd}
                />
            </div>
        );
    }
}

export default Toolbar;