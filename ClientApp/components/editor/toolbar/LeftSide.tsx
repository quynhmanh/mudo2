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
import Flip from "./left/Flip";

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
    cropVideo: any;
}

interface IState {
    croppingVideo: boolean;
}

const alignList = [
    { title: "alignLeft", align: "left", iconPath: require("@Components/shared/svgs/editor/toolbar/alignLeft.svg") },
    { title: "alignCenter", align: "center", iconPath: require("@Components/shared/svgs/editor/toolbar/alignCenter.svg") },
    { title: "alignRight", align: "right", iconPath: require("@Components/shared/svgs/editor/toolbar/alignRight.svg") }
];

@observer
class LeftSide extends Component<IProps, IState> {

    constructor(props) {
        super(props);

        this.state = {
            croppingVideo: false,
        }
    }

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

        let duration = 0;
        if (image && image.type == TemplateType.Video) {
            let timeStart = image.timeStart ? image.timeStart : 0;
            let timeEnd = image.timeEnd ? image.timeEnd : 1;
            duration = (timeEnd - timeStart) * image.duration;
            duration = Math.floor(duration * 10) / 10;
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

        return (<React.Fragment>
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
                {!editorStore.cropMode && editorStore.idObjectSelected && editorStore.colors &&
                    <ColorContainer>
                        {editorStore.colors.map((color, key) =>
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
                                </button>
                            </ColorButton>)}
                    </ColorContainer>}
                    {image && image.type == TemplateType.Video && !editorStore.cropMode &&  <div 
                        style={{
                            display: "flex",
                            marginRight: "10px",
                        }}
                        className="toolbar-btn">
                        <button
                            onClick={e => {
                                editorStore.croppingVideo = true;
                                window.sliderInitialized = false;
                            }}
                            style={{
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                padding: "0 10px",
                            }}
                        >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.87 4.68a2.25 2.25 0 1 0-.06 4.5 2.25 2.25 0 0 0 .06-4.5zm-3.78 2.2a3.75 3.75 0 1 1 6.86 2.146l3.252 2.323-.848 1.159-3.437-2.455A3.75 3.75 0 0 1 2.09 6.88zm19.936 11.588a2 2 0 0 1-2.792.452l-8.218-5.928 1.17-1.622 9.84 7.098z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M22.026 5.532a2 2 0 0 0-2.792-.452l-8.218 5.928 1.17 1.622 9.84-7.098zM5.869 19.32a2.25 2.25 0 1 1-.06-4.5 2.25 2.25 0 0 1 .06 4.5zm-3.78-2.2a3.75 3.75 0 1 0 6.86-2.146l3.252-2.322-.848-1.16-3.436 2.455A3.75 3.75 0 0 0 2.09 17.12z" fill="currentColor"></path></svg>
                            <span 
                                style={{
                                    marginLeft: "10px",
                                }}>{duration}s</span>
                        </button>
                    </div>}
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
                <Flip
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
                />
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
                            background - color: rgba(75, 102, 129, 0.15) !important;
    }

    button {
                            width: 25px;
        height: 25px;
        border: none;
        box-shadow: inset 0 0 0 1px rgba(57,76,96,.15);
        border-radius: 2px;
    }
`;

const ColorContainer = styled.div`
    & {
                            display: flex;
    }

    &::after {
                            content: "";
        width: 1px;
        height: 24px;
        background: rgba(57,76,96,.15);
        margin: auto 7px;
    }
`;