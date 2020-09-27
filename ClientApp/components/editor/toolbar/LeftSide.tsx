import React, { Component } from "react";
import { TemplateType, SidebarTab } from "@Components/editor/enums";
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
import { observer } from "mobx-react";
import editorStore from "@Store/EditorStore";
import { toJS } from "mobx";

interface IProps {
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
    updateImages: any;
    onTextChange: any;
    scale: any;
}

interface IState {

}

const alignList = [
    { title: "alignLeft", align: "left", iconPath: require("@Components/shared/svgs/editor/toolbar/alignLeft.svg") },
    { title: "alignCenter", align: "center", iconPath: require("@Components/shared/svgs/editor/toolbar/alignCenter.svg") },
    { title: "alignRight", align: "right", iconPath: require("@Components/shared/svgs/editor/toolbar/alignRight.svg") }
];

@observer
class LeftSide extends Component<IProps, IState> {

    handleColorBtnClick(e) {
        e.preventDefault();
        editorStore.selectedTab = SidebarTab.Color;
    }

    onClickDropDownFontList(e) {
        e.preventDefault();
        editorStore.selectedTab = SidebarTab.Font;
    }

    render() {
        let image = toJS(editorStore.images2.get(editorStore.idObjectSelected))
        if (image && editorStore.childId && image.document_object) {
            let found = image.document_object.find(doc => doc._id == editorStore.childId);
            image = found;
        }
        const props = this.props;
        return (
            <React.Fragment>
                <FontFamily
                    show=
                    {
                        (
                            editorStore.childId !== null ||
                            (
                                image &&
                                image.type === TemplateType.Heading
                            )
                        )
                    }
                    translate={props.translate}
                    onClickDropDownFontList={this.onClickDropDownFontList}
                    fontName={editorStore.fontText}
                    selectedTab={editorStore.selectedTab}
                />
                <FontSizeWrapper
                    show=
                    {
                        (image &&
                            image.type === TemplateType.Heading) ||
                        !!editorStore.childId
                    }
                    translate={props.translate}
                    selectedImage={props.selectedImage}
                    childId={props.childId}
                    fontSize={editorStore.currentFontSize}
                    handleFontSizeBtnClick={props.handleFontSizeBtnClick}
                    selectedTab={editorStore.selectedTab}
                />
                <Color
                    show=
                    {
                        image &&
                        (
                            image.type === TemplateType.Heading ||
                            image.type === TemplateType.Latex ||
                            image.type === TemplateType.BackgroundImage ||
                            editorStore.childId !== null
                        )
                    }
                    isText={image && image.type === TemplateType.Heading}
                    translate={props.translate}
                    handleColorBtnClick={this.handleColorBtnClick}
                    fontColor={image && image.color}
                    selectedTab={editorStore.selectedTab}
                />
                <Italic
                    show=
                    {
                        (
                            editorStore.childId !== null ||
                            (
                                image &&
                                image.type === TemplateType.Heading
                            )
                        )
                    }
                    translate={props.translate}
                    handleItalicBtnClick={props.handleItalicBtnClick}
                    checked={image && image.italic}
                />
                <Bold
                    show=
                    {
                        (
                            editorStore.childId !== null ||
                            (
                                image &&
                                image.type === TemplateType.Heading
                            )
                        )
                    }
                    translate={props.translate}
                    handleBoldBtnClick={props.handleBoldBtnClick}
                    checked={image && image.bold}
                />
                {/* <Filter
                    show=
                    {
                        image &&
                        (
                            image.type === TemplateType.Image ||
                            image.type === TemplateType.Video
                        )
                    }
                    translate={props.translate}
                    cropMode={editorStore.cropMode}
                    handleFilterBtnClick={props.handleFilterBtnClick}
                />
                <Adjust
                    show=
                    {
                        image &&
                        (
                            image.type === TemplateType.Image ||
                            image.type === TemplateType.Video
                        )
                    }
                    translate={props.translate}
                    cropMode={editorStore.cropMode}
                    handleAdjustBtnClick={props.handleAdjustBtnClick}
                /> */}
                <Crop
                    show=
                    {
                        image &&
                        (
                            image.type === TemplateType.Image ||
                            image.type === TemplateType.Video ||
                            image.type === TemplateType.Element ||
                            (image.type === TemplateType.BackgroundImage &&
                                image.src)
                        )
                    }
                    translate={props.translate}
                    cropMode={editorStore.cropMode}
                    handleCropBtnClick={props.handleCropBtnClick}
                />
                {/* <Flip
                    show=
                    {
                        image &&
                        (
                            image.type === TemplateType.Image ||
                            image.type === TemplateType.Video
                        )
                    }
                    translate={props.translate}
                    cropMode={editorStore.cropMode}
                    handleFlipBtnClick={props.handleFlipBtnClick}
                /> */}
                <ImageBackgroundColor
                    show=
                    {
                        image &&
                        image.type === TemplateType.Image &&
                        image.backgroundColor
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
                                            editorStore.childId !== null ||
                                            (
                                                image &&
                                                image.type === TemplateType.Heading
                                            )
                                        )
                                    }
                                    translate={props.translate}
                                    title={item.title}
                                    iconPath={item.iconPath}
                                    handleAlignBtnClick={props.handleAlignBtnClick}
                                    checked={image && image.align == item.align}
                                />
                        )
                }
                {image && (image.type === TemplateType.Heading || props.childId) &&
                    <Spacing
                        onTextChange={this.props.onTextChange}
                        title="spacing"
                        show=
                        {
                            (image &&
                                image.type === TemplateType.Heading) ||
                            !!editorStore.childId
                        }
                        pauser={props.pauser}
                        currentLineHeight={editorStore.currentLineHeight}
                        currentLetterSpacing={editorStore.currentLetterSpacing}
                        translate={props.translate}
                        handleLineHeightChange={props.handleLineHeightChange}
                        handleLineHeightChangeEnd={props.handleLineHeightChangeEnd}
                        handleLetterSpacing={props.handleLetterSpacing}
                        handleLetterSpacingEnd={props.handleLetterSpacingEnd}
                        updateImages={this.props.updateImages}
                        scale={props.scale}
                    />}
                <Effect
                    show=
                    {
                        (image &&
                            (
                                image.type === TemplateType.Heading
                            )) || (!!editorStore.childId)
                    }
                    translate={props.translate}
                    cropMode={editorStore.cropMode}
                    handleAdjustBtnClick={e => {
                        editorStore.selectedTab = SidebarTab.Effect;
                    }}
                    selectedTab={editorStore.selectedTab}
                />
                <OK
                    show=
                    {
                        editorStore.cropMode
                    }
                    translate={props.translate}
                    handleOkBtnClick={props.handleOkBtnClick}
                />
                <Cancel
                    show=
                    {
                        editorStore.cropMode
                    }
                    translate={props.translate}
                    handleCancelBtnClick={props.handleCancelBtnClick}
                />
            </React.Fragment>
        )
    }
}

export default LeftSide;