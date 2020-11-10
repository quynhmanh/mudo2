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
}

interface IState {
    
}

@observer
class Toolbar extends Component<IProps, IState> {
    render() {
        const props = this.props;
        return (
            <div
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
            </div>
        );
    }
}

export default Toolbar;