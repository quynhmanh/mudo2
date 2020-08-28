import React from "react";
import { TemplateType } from "@Components/editor/enums";
import Color from "@Components/editor/toolbar/left/Color";
import Italic from "@Components/editor/toolbar/left/Italic";
import Bold from "@Components/editor/toolbar/left/Bold";
import FontFamily from "@Components/editor/toolbar/left/FontFamily";
import Filter from "@Components/editor/toolbar/left/Filter";
import Adjust from "@Components/editor/toolbar/left/Adjust";
import Crop from "@Components/editor/toolbar/left/Crop";
import Flip from "@Components/editor/toolbar/left/Flip";
import ImageBackgroundColor from "@Components/editor/toolbar/left/ImageBackgroundColor";
import FontSizeWrapper from "@Components/editor/toolbar/left/FontSizeWrapper";
import Align from "@Components/editor/toolbar/left/Align";
import OK from "@Components/editor/toolbar/left/OK";
import Cancel from "@Components/editor/toolbar/left/Cancel";
import Effect from "@Components/editor/toolbar/left/Effect";
import Spacing from "@Components/editor/toolbar/left/Spacing";

interface IProps {
    editorStore: any;
    childId: string;
    translate: any;
    handleColorBtnClick: any;
    fontColor: string;
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
    idObjectSelected: string;
    handleAlignBtnClick: any;
    handleOkBtnClick: any;
    handleCancelBtnClick: any;
    selectedTab: any;
    align: any;
    effectId: number;
    bold: boolean;
    italic: boolean;
    handleLineHeightChange: any;
    handleLineHeightChangeEnd: any;
    handleLetterSpacing: any;
    handleLetterSpacingEnd: any;
    currentLineHeight: number;
    currentLetterSpacing: number;
    pauser: any;
    selectedCanvas: any;
}

const alignList = [
    { title: "alignLeft", align: "left", iconPath: require("@Components/shared/svgs/editor/toolbar/alignLeft.svg") },
    { title: "alignCenter", align: "center",iconPath: require("@Components/shared/svgs/editor/toolbar/alignCenter.svg") },
    { title: "alignRight", align: "right",iconPath: require("@Components/shared/svgs/editor/toolbar/alignRight.svg") }
];

const LeftSide = (props: IProps) => {
    const { editorStore } = props;
    return (
        <React.Fragment>
             <FontFamily
                show=
                {
                    (
                        props.childId !== null ||
                        (
                            editorStore.imageSelected &&
                            editorStore.imageSelected.type === TemplateType.Heading
                        )
                    )
                }
                translate={props.translate}
                onClickDropDownFontList={props.onClickDropDownFontList}
                fontName={props.fontName}
                selectedTab={props.selectedTab}
            />
            <FontSizeWrapper
                show=
                {
                    (editorStore.imageSelected &&
                    editorStore.imageSelected.type === TemplateType.Heading) || 
                    !!props.childId
                }
                translate={props.translate}
                selectedImage={props.selectedImage}
                childId={props.childId}
                fontSize={props.fontSize}
                handleFontSizeBtnClick={props.handleFontSizeBtnClick}
                selectedTab={props.selectedTab}
            />
            <Color
                show=
                {
                    editorStore.imageSelected &&
                    (
                        editorStore.imageSelected.type === TemplateType.Heading ||
                        editorStore.imageSelected.type === TemplateType.Latex ||
                        editorStore.imageSelected.type === TemplateType.BackgroundImage ||
                        props.childId !== null
                    )
                }
                isText={editorStore.imageSelected && editorStore.imageSelected.type === TemplateType.Heading}
                translate={props.translate}
                handleColorBtnClick={props.handleColorBtnClick}
                fontColor={props.fontColor}
                selectedTab={props.selectedTab}
            />
            <Italic
                show=
                {
                    (
                        props.childId !== null ||
                        (
                            editorStore.imageSelected &&
                            editorStore.imageSelected.type === TemplateType.Heading
                        )
                    )
                }
                translate={props.translate}
                handleItalicBtnClick={props.handleItalicBtnClick}
                checked={props.italic}
            />
            <Bold
                show=
                {
                    (
                        props.childId !== null ||
                        (
                            editorStore.imageSelected &&
                            editorStore.imageSelected.type === TemplateType.Heading
                        )
                    )
                }
                translate={props.translate}
                handleBoldBtnClick={props.handleBoldBtnClick}
                checked={props.bold}
            />
            {/* <Filter
                show=
                {
                    editorStore.imageSelected &&
                    (
                        editorStore.imageSelected.type === TemplateType.Image ||
                        editorStore.imageSelected.type === TemplateType.Video
                    )
                }
                translate={props.translate}
                cropMode={props.cropMode}
                handleFilterBtnClick={props.handleFilterBtnClick}
            />
            <Adjust
                show=
                {
                    editorStore.imageSelected &&
                    (
                        editorStore.imageSelected.type === TemplateType.Image ||
                        editorStore.imageSelected.type === TemplateType.Video
                    )
                }
                translate={props.translate}
                cropMode={props.cropMode}
                handleAdjustBtnClick={props.handleAdjustBtnClick}
            /> */}
            <Crop
                show=
                {
                    editorStore.imageSelected &&
                    (
                        editorStore.imageSelected.type === TemplateType.Image ||
                        editorStore.imageSelected.type === TemplateType.Video ||
                        (editorStore.imageSelected.type === TemplateType.BackgroundImage && 
                            editorStore.imageSelected.src)
                    )
                }
                translate={props.translate}
                cropMode={props.cropMode}
                handleCropBtnClick={props.handleCropBtnClick}
            />
            {/* <Flip
                show=
                {
                    editorStore.imageSelected &&
                    (
                        editorStore.imageSelected.type === TemplateType.Image ||
                        editorStore.imageSelected.type === TemplateType.Video
                    )
                }
                translate={props.translate}
                cropMode={props.cropMode}
                handleFlipBtnClick={props.handleFlipBtnClick}
            /> */}
            <ImageBackgroundColor
                show=
                {
                    editorStore.imageSelected &&
                    editorStore.imageSelected.type === TemplateType.Image &&
                    editorStore.imageSelected.backgroundColor
                }
                imgBackgroundColor={props.imgBackgroundColor}
                handleImageBackgroundColorBtnClick={props.handleImageBackgroundColorBtnClick}
            />
            {
                alignList.map
                    (
                        (item, id) =>
                            <Align
                                key={id}
                                show=
                                {
                                    (
                                        props.childId !== null ||
                                        (
                                            props.idObjectSelected &&
                                            props.selectedImage &&
                                            props.selectedImage.type === TemplateType.Heading
                                        )
                                    )
                                }
                                translate={props.translate}
                                title={item.title}
                                iconPath={item.iconPath}
                                handleAlignBtnClick={props.handleAlignBtnClick}
                                checked={props.align == item.align}
                            />
                    )
            }
            {editorStore.imageSelected && (editorStore.imageSelected.type === TemplateType.Heading || props.childId) &&
            <Spacing 
                title="spacing"
                show=
                {
                    (editorStore.imageSelected &&
                    editorStore.imageSelected.type === TemplateType.Heading) || 
                    !!props.childId
                }
                pauser={props.pauser}
                currentLineHeight={props.currentLineHeight ? props.currentLineHeight : 0}
                currentLetterSpacing={props.currentLetterSpacing ? props.currentLetterSpacing : 0}
                translate={props.translate}
                handleLineHeightChange={props.handleLineHeightChange}
                handleLineHeightChangeEnd={props.handleLineHeightChangeEnd}
                handleLetterSpacing={props.handleLetterSpacing}
                handleLetterSpacingEnd={props.handleLetterSpacingEnd}
            />}
            <Effect
                show=
                {
                    (editorStore.imageSelected &&
                    (
                        editorStore.imageSelected.type === TemplateType.Heading
                    )) || (!!props.childId)
                }
                translate={props.translate}
                cropMode={props.cropMode}
                handleAdjustBtnClick={props.onClickEffectList}
                selectedTab={props.selectedTab}
            />
            <OK
                show=
                {
                    props.cropMode
                }
                translate={props.translate}
                handleOkBtnClick={props.handleOkBtnClick}
            />
            <Cancel
                show=
                {
                    props.cropMode
                }
                translate={props.translate}
                handleCancelBtnClick={props.handleCancelBtnClick}
            />
        </React.Fragment>
    )
}

export default LeftSide;