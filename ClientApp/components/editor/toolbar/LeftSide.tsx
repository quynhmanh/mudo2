import React, { Component } from "react";
import { TemplateType, SidebarTab } from "@Components/editor/enums";
import Color from "@Components/editor/toolbar/left/Color";
import Italic from "@Components/editor/toolbar/left/Italic";
import Bold from "@Components/editor/toolbar/left/Bold";
import FontFamily from "@Components/editor/toolbar/left/FontFamily";
import Crop from "@Components/editor/toolbar/left/Crop";
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
import styled from 'styled-components';

interface IProps {
    childId: string;
    translate: any;
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
    idObjectSelected: string;
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
    selectedCanvas: any;
    updateImages: any;
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

        let animation;
        switch (editorStore.animationId) {
            case 0:
                animation = "animation";
                break;
            case 1:
                animation = "block";
                break;
            case 2:
                animation = "fade";
                break;
        }

        return (
            <React.Fragment>
                {editorStore.tReady && !editorStore.idObjectSelected &&
                <button
                    className="toolbar-btn"
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}
                    onClick={e => {
                        e.preventDefault();
                        editorStore.selectedTab = SidebarTab.Animation;
                    }}
                >
                    {editorStore.animationId == 2 && <span
                        style={{
                            marginRight: "8px",
                        }}
                    ><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.782 8.782a7 7 0 1 0 9.436 9.436 6.953 6.953 0 0 1-2.393.734 5.5 5.5 0 0 1-7.777-7.777c.1-.855.355-1.662.734-2.393z" fill="currentColor" fill-opacity=".3"></path><circle cx="15" cy="9" r="6.25" stroke="currentColor" stroke-width="1.5"></circle><path fill-rule="evenodd" clip-rule="evenodd" d="M8.782 5.782a7 7 0 1 0 9.436 9.436 6.953 6.953 0 0 1-2.393.734 5.5 5.5 0 0 1-7.777-7.777c.1-.854.355-1.662.734-2.393z" fill="currentColor" fill-opacity=".6"></path></svg></span>}
                    <span>{this.props.translate(animation)}</span></button>
                }   
                <FontFamily
                    show=
                    {
                        (
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
                            image.type === TemplateType.Heading)
                    }
                    translate={props.translate}
                    selectedImage={props.selectedImage}
                    childId={props.childId}
                    fontSize={editorStore.currentFontSize}
                    selectedTab={editorStore.selectedTab}
                />
                <Color
                    show=
                    {
                        !editorStore.cropMode && image &&
                        (
                            image.type === TemplateType.Heading ||
                            image.type === TemplateType.Latex ||
                            image.type === TemplateType.BackgroundImage
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
                            (
                                image &&
                                image.type === TemplateType.Heading
                            )
                        )
                    }
                    translate={props.translate}
                    checked={image && image.italic}
                />
                <Bold
                    show=
                    {
                        (
                            (
                                image &&
                                image.type === TemplateType.Heading
                            )
                        )
                    }
                    translate={props.translate}
                    checked={image && image.bold}
                />
                {!editorStore.cropMode && editorStore.idObjectSelected && editorStore.colors && editorStore.colors.map((color, key) =>
                <ColorButton
                    style={{
                        backgroundColor: editorStore.colorField == key + 1 ? 'rgba(75, 102, 129, 0.15)' : null,
                    }}
                >
                    <button 
                        style={{
                            backgroundColor: color,
                        }}
                        onClick={e => {
                            editorStore.selectedTab = SidebarTab.Color;
                            editorStore.colorField = key + 1;
                        }}    
                    >

                    </button></ColorButton>)}
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
                            image.type === TemplateType.Gradient ||
                            (image.type === TemplateType.BackgroundImage &&
                                image.src) ||
                            (image.type == TemplateType.Grids && editorStore.gridIndex != null && editorStore.croppable)
                        )
                    }
                    translate={props.translate}
                    cropMode={editorStore.cropMode}
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
                                            (
                                                image &&
                                                image.type === TemplateType.Heading
                                            )
                                        )
                                    }
                                    translate={props.translate}
                                    title={item.title}
                                    iconPath={item.iconPath}
                                    checked={image && image.align == item.align}
                                />
                        )
                }
                {image && (image.type === TemplateType.Heading || props.childId) &&
                    <Spacing
                        title="spacing"
                        show=
                        {
                            (image &&
                                image.type === TemplateType.Heading)
                        }
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
                            ))
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

const ColorButton = styled.div`
    width: 33px;
    height: 33px;
    border: none;
    margin-left: 2px;
    margin-top: -2px;
    padding: 4px;
    border-radius: 5px;

    :hover { 
        background-color: rgba(75, 102, 129, 0.15) !important;
    }

    button {
        width: 25px;
        height: 25px;
        border: none;
        box-shadow: inset 0 0 0 1px rgba(57,76,96,.15); 
        border-radius: 2px; 
    }
`;