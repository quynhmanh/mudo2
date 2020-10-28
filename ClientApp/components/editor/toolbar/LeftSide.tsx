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
                <button
                    className="toolbar-btn"
                    onClick={e => {
                        clearInterval(window.intervalAnimation);
                        clearTimeout(window.timeoutAnimation)
                        let curOpa = 1;

                        let ids = [];
                        let ratios = {};
                        editorStore.images2.forEach(img => {
                            if (img.type != TemplateType.BackgroundImage) {
                                ids.push(img._id);
                                let ratio = 1.0 * (img.left + 100) / (window.rectWidth + 100);
                                ratios[`id${img._id}`] = {
                                    left: img.left,
                                    top: img.top,
                                    width: img.width,
                                    height: img.height,
                                };
                            }
                        });

                        let limit = window.rectWidth;
                        let limitHeight = 0;

                        ids.forEach((id, key) => {
                            let el = document.getElementById(id + "_alo");
                            el.style.opacity = 0;
                        });

                        let marked = {};
                        window.intervalAnimation = setInterval(() => {
                            ids.forEach(id => {
                                let image = editorStore.images2.get(id);
                                let el = document.getElementById(id + "_alo") as HTMLElement;
                                let opa = parseFloat(el.style.opacity);
                                if (isNaN(opa)) opa = 0;
                                if ((image.left + image.width > limit && image.top <= limitHeight) || marked[id]) {
                                    el.style.opacity = opa + 0.025;
                                    marked[id] = true;
                                }
                            })

                            limit -= window.rectWidth / 80;
                            if (limit < 0) {
                                limit = window.rectWidth;
                                limitHeight += window.rectHeight / 10;
                            }
                        }, 5);

                        window.timeoutAnimation = setTimeout(() => {
                            clearTimeout(window.intervalAnimation);
                        }, 5000);

                        let val = `
                        function animate() {
                            ['${ids.join("','")}'].forEach((id, key) => {
                                console.log("asd", id + "_alo2");
                                let el = document.getElementById(id + "_alo2");
                                el.style.opacity = 0;
                            });
                            let marked = {};
                            setTimeout(() => {
                                let limit = window.innerWidth;
                                let limitHeight = 0;
                                let curOpa = 0;
                                let ratios = ${JSON.stringify(ratios)};
                                let interval = setInterval(() => {
                                    ['${ids.join("','")}'].forEach((id, key) => {
                                        let image= ratios["id" + id];
                                        let el = document.getElementById(id + "_alo2");
                                        let opa = parseFloat(el.style.opacity);
                                        if (isNaN(opa)) opa = 0;
                                        if ((image.left + image.width > limit && image.top <= limitHeight) || marked[id]) {
                                            el.style.opacity = opa + 0.03;
                                            marked[id] = true;
                                        }
                                    })

                                    limit -= window.innerWidth / 80;
                                    if (limit < 0) {
                                        limit = window.innerWidth;
                                        limitHeight += window.innerHeight / 10;
                                    }
                                }, 5);

                                setTimeout(() => {
                                    clearTimeout(interval);
                                }, 5000)
                            }, 300);
                        }`;

                        let scriptEl = document.getElementById('animation-script').innerHTML = val;
                    }}
                ><span>Animation</span></button>
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
                        !editorStore.cropMode && image &&
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