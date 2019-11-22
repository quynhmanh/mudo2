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

interface IProps {
    editorStore: any;
    childId: string;
    translate: any;
    handleColorBtnClick: any;
    fontColor: string;
    handleItalicBtnClick: any;
    handleBoldBtnClick: any;
    onClickDropDownFontList: any;
    fontName: string;
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
}

const alignList = [
    { title: "alignLeft", iconPath: require("@Components/shared/svgs/alignLeft.svg") },
    { title: "alignCenter", iconPath: require("@Components/shared/svgs/alignCenter.svg") },
    { title: "alignRight", iconPath: require("@Components/shared/svgs/alignCenter.svg") }
];

const LeftSide = (props: IProps) => {
    const { editorStore } = props;
    return (
        <React.Fragment>
            <Color
                show=
                {
                    editorStore.imageSelected &&
                    (
                        editorStore.imageSelected.type === TemplateType.Heading ||
                        editorStore.imageSelected.type === TemplateType.Latex ||
                        props.childId !== null
                    )
                }
                translate={props.translate}
                handleColorBtnClick={props.handleColorBtnClick}
                fontColor={props.fontColor}
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
            />
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
            />
            <Filter
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
            />
            <Crop
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
                handleCropBtnClick={props.handleCropBtnClick}
            />
            <Flip
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
            />
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
            <FontSizeWrapper
                show=
                {
                    editorStore.imageSelected &&
                    editorStore.imageSelected.type === TemplateType.Heading
                }
                translate={props.translate}
                selectedImage={props.selectedImage}
                childId={props.childId}
                fontSize={props.fontSize}
                handleFontSizeBtnClick={props.handleFontSizeBtnClick}
            />
            {
                alignList.map
                    (
                        item =>
                            <Align
                                show=
                                {
                                    (
                                        props.childId !== null ||
                                        (
                                            props.idObjectSelected &&
                                            props.selectedImage.type === TemplateType.Heading
                                        )
                                    )
                                }
                                translate={props.translate}
                                title={item.title}
                                iconPath={item.iconPath}
                                handleAlignBtnClick={props.handleAlignBtnClick}
                            />
                    )
            }
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