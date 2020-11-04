import React, { Component } from "react";
import ResizableRect from "@Components/editor/ResizableRect";
import StyledComponent from "styled-components";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import { toJS } from "mobx";
import Tooltip from "@Components/shared/Tooltip";
import { TemplateType, CanvasType, } from "./enums";

import {
    transformImage as getTransformedImage,
} from "@Utils";


export interface IProps {
    uiKey: string;
    id: string;
    images: any;
    mode: number;
    rectWidth: number;
    rectHeight: number;
    scale: number;
    childId: string;
    cropMode: boolean;
    handleImageSelected: any;
    handleImageUnhovered: any;
    handleImageHovered: any;
    handleImageHover: any;
    handleRotateStart: any;
    handleResizeStart: any;
    handleDragStart: any;
    onTextChange: any;
    handleFontSizeChange: any;
    handleFontColorChange: any;
    handleFontFamilyChange: any;
    handleChildIdSelected: any;
    enableCropMode: any;
    disableCropMode: any;
    handleResizeInnerImageStart: any;
    doNoObjectSelected: any;
    index: number;
    addAPage: any;
    staticGuides: any;
    idObjectSelected: any;
    handleDeleteThisPage: any;
    bleed: boolean;
    showPopup: boolean;
    preview: boolean;
    downloading: boolean;
    translate: any;
    selectedImage: any;
    numberOfPages: number;
    selected: boolean;
    activePageId: string;
    active: boolean;
    toggleVideo: any;
    handleCropBtnClick: any;
}

export interface IState {
    hoveringCanvas: boolean;
}

enum Mode {
    CreateDesign = 0,
    CreateTemplate = 1,
    CreateTextTemplate = 2,
    EditTemplate = 3,
    EditTextTemplate = 4
}


export default class Canvas extends Component<IProps, IState> {

    state = {
        hoveringCanvas: false,
    }

    constructor(props: any) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.scale != nextProps.scale) {
            return true;
        }
        if (this.props.uiKey != nextProps.uiKey) {
            return true;
        }
        return false;
    }

    componentDidMount() {
        if (editorStore.animationId == 1) {
            clearInterval(window.intervalAnimation);
            clearTimeout(window.timeoutAnimation)
            let ids = [];
            let ratios = {};

            editorStore.images2.forEach(img => {
                if (img.type == TemplateType.Heading) {
                    ids.push(img._id);
                    ratios[`id${img._id}`] = {
                        _id: img._id,
                        left: img.left,
                        top: img.top,
                        width: img.width,
                        height: img.height,
                        color: img.color,
                        rotateAngle: img.rotateAngle ? img.rotateAngle : 0,
                        zIndex: img.zIndex,
                        type: img.type,
                    };
                }
                else if (img.type == TemplateType.TextTemplate) {
                    ids.push(img._id);
                    ratios[`id${img._id}`] = {
                        _id: img._id,
                        left: img.left,
                        top: img.top,
                        width: img.width,
                        height: img.height,
                        color: img.color,
                        rotateAngle: img.rotateAngle ? img.rotateAngle : 0,
                        zIndex: img.zIndex,
                        type: img.type,
                        document_object: img.document_object,
                    };
                } else {
                    let el = document.getElementById(img._id + "_alo3");
                    if (el) {
                        let opacity = img.opacity ? img.opacity : 100;
                        opacity = opacity / 100;
                        el.style.opacity = opacity;
                    }
                }
            });

            let scale = editorStore.scale;

            ids.forEach((id, key) => {
                let el2 = document.getElementById(id + "animation-block3");
                if (el2) el2.remove();

                let image = editorStore.images2.get(id);
                if (image && image.type == TemplateType.Heading) {
                    let el = document.getElementById(id + "_alo3");
                    if (el) {
                        el.style.opacity = "0";

                        let newNode = document.createElement("div");
                        let newNode2 = document.createElement("div");
                        newNode.appendChild(newNode2);
                        newNode.id = id + "animation-block";
                        newNode.style.position = "absolute";
                        newNode.style.pointerEvents = "none";
                        newNode.style.zIndex = image.zIndex;
                        newNode.style.width = image.width * scale + "px";
                        newNode.style.height = image.height * scale + "px";
                        newNode.style.transform = `translate(${image.left * scale}px, ${image.top * scale}px) rotate(${image.rotateAngle}deg)`;
                        newNode.style.overflow = "hidden";
                        newNode2.style.width = "100%";
                        newNode2.style.height = "100%";
                        newNode2.style.background = image.color ? image.color : "black";
                        newNode2.style.transform = `translate(-${image.width * scale + 1}px, 0px)`;
                        newNode2.style.position = "absolute";
                        el.parentNode.appendChild(newNode);
                    }
                } else if (image.type == TemplateType.TextTemplate) {
                    image.document_object.forEach(child => {
                        if (child.type == TemplateType.Heading) {
                            let el = document.getElementById(image._id + child._id + "alo3");
                            if (el) {
                                el.style.opacity = "0";
                                let newNode = document.getElementById(image._id + child._id + "animation-block3");
                                if (!newNode) {
                                    newNode = el.cloneNode(true);
                                    el.parentNode.appendChild(newNode);
                                }
                                newNode.id = image._id + child._id + "animation-block3";
                                newNode.style.background = child.color;
                                newNode.style.opacity = 1;
                                newNode.style.left = "-" + (child.width / child.scaleX + 10) + "px";
                            }
                        }
                    });
                }
            });

            let limit = window.rectWidth;
            let limitHeight = 0;
            let marked = {};
            let curPos = {};
            window.intervalAnimation = setInterval(() => {
                ids.forEach(id => {
                    let image = editorStore.images2.get(id);
                    if (image && image.type == TemplateType.Heading) {
                        if ((image.left + image.width > limit && image.top <= limitHeight) || marked[id]) {

                            if (marked[id]) {
                                if (!curPos[id]) curPos[id] = 0;
                                if (curPos[id] < image.width / 5 * scale || curPos[id] > image.width * scale * 1.8)
                                    curPos[id] += image.width / 66 * scale;
                                else
                                    curPos[id] += image.width / 15 * scale;
                            } else {
                                curPos[id] = (limitHeight - image.top) / window.rectHeight * image.width;
                                marked[id] = true;
                            }

                            let el = document.getElementById(id + "animation-block3") as HTMLElement;
                            el.children[0].style.transform = `translate(${-image.width * scale + curPos[id]}px, 0px)`;
                        }

                        let el2 = document.getElementById(id + "_alo");
                        if (el2 && -image.width * scale + curPos[id] > 0) el2.style.opacity = 1;
                    } else if (image && image.type == TemplateType.TextTemplate) {
                        image.document_object.forEach(child => {
                            let childId = id + child._id;
                            if ((image.left + child.left + child.width / child.scaleX > limit && image.top + child.top + child.height <= limitHeight) || marked[childId]) {

                                if (marked[childId]) {
                                    if (!curPos[childId]) curPos[childId] = 0;
                                    if (curPos[childId] < child.width / child.scaleX / 5 || curPos[childId] > child.width / child.scaleX * 1.8)
                                        curPos[childId] += child.width / child.scaleX / 66;
                                    else
                                        curPos[childId] += child.width / child.scaleX / 15;
                                } else {
                                    curPos[childId] = (limitHeight - image.top - child.top) / window.rectHeight * child.width / child.scaleX;
                                    marked[childId] = true;
                                }

                                let el = document.getElementById(childId + "animation-block3");
                                if (el) el.style.left = (-child.width / child.scaleX + curPos[childId]) + "px";
                            }

                            let el2 = document.getElementById(childId + "alo3");
                            if (el2 && -child.width / child.scaleX + curPos[childId] > 0) el2.style.opacity = 1;
                        });
                    }
                })

                limit -= window.rectWidth / 22;
                if (limit < 0) {
                    limit = window.rectWidth;
                    limitHeight += window.rectHeight / 7;
                }
            }, 15);

            window.timeoutAnimation = setTimeout(() => {
                ids.forEach(id => {
                    let image = editorStore.images2.get(id);
                    if (image && image.type == TemplateType.Heading) {
                        let el = document.getElementById(id + "animation-block3") as HTMLElement;
                        if (el) el.remove();
                    } else if (image && image.type == TemplateType.TextTemplate) {
                        image.document_object.forEach(child => {
                            let childId = id + child._id;
                            let el = document.getElementById(childId + "animation-block3");
                            if (el) el.remove();
                        });
                    }
                });
                clearTimeout(window.intervalAnimation);
            }, 5000);
        }

        if (editorStore.animationId == 2) {
            clearInterval(window.intervalAnimation);
            clearTimeout(window.timeoutAnimation)

            let ids = [];
            let ratios = {};
            editorStore.images2.forEach(img => {
                if (img.type != TemplateType.BackgroundImage) {
                    ids.push(img._id);
                    ratios[`id${img._id}`] = {
                        left: img.left,
                        top: img.top,
                        width: img.width,
                        height: img.height,
                    };
                }

                if (img.type == TemplateType.Heading) {
                    let el = document.getElementById(img._id + "animation-block");
                    if (el) el.remove();
                }
            });

            window.videoDuration = ids.length * 140 + 1000;

            for (let i = 0; i < ids.length; ++i)
                for (let j = 0; j < i; ++j) {
                    let imgI = editorStore.images2.get(ids[i]);
                    let imgJ = editorStore.images2.get(ids[j]);
                    if (imgI.top < imgJ.top || (imgI.top == imgJ.top && imgI.left < imgJ.left)) {
                        let tmp = ids[i];
                        ids[i] = ids[j];
                        ids[j] = tmp;
                    }
                }

            ids.forEach((id, key) => {
                let el = document.getElementById(id + "_alo3");
                if (el) el.style.opacity = 0;
            });

            let curI = 0;
            let curOpa = {};
            window.intervalAnimation = setInterval(() => {
                ids.forEach((id, key) => {
                    if (!curOpa[id]) curOpa[id] = 0;
                    if (curI / 7 >= key) curOpa[id] += 0.1;
                    let el = document.getElementById(id + "_alo3");
                    if (el) el.style.opacity = curOpa[id];
                });
                ++curI;
            }, 20);

            window.timeoutAnimation = setTimeout(() => {
                clearTimeout(window.intervalAnimation);
            }, ids.length * 140 + 1000);
        }
    }

    refAlo = null;
    canvas = {
        0: {},
        1: {},
        2: {},
    };

    render() {
        const {
            mode,
            rectWidth,
            rectHeight,
            scale,
            childId,
            cropMode,
            index,
            id,
            staticGuides,
            numberOfPages,
        } = this.props;

        if (!this.props.downloading) {
        }

        const customAttr = { myattribute: id };

        const images = Array.from(editorStore.images2.values()).filter(img => img.page === id).map(img => toJS(img));
        return (
            <ResizableRectContainer
                style={{
                    position: "relative",
                    transition: "all 0.1s linear",
                    margin: "auto",
                }}
                key={id}
                id={!this.props.downloading ? id : ""}
            >
                <div
                    style={{
                        width: rectWidth * scale + "px",
                        height: rectHeight * scale + "px",
                        transform: this.props.preview && "scale(0.5)",
                        transformOrigin: this.props.preview && "0 0"
                    }}
                >
                    {!this.props.downloading &&
                        <div
                            id="alo"
                            ref={i => this.refAlo = i}
                            className={!this.props.downloading ? "alo" : ""}
                            style={{
                                backgroundColor:
                                    !this.props.showPopup &&
                                    (mode == Mode.CreateTextTemplate ||
                                        mode == Mode.EditTextTemplate
                                        ? "white"
                                        : this.props.cropMode
                                            ? "#ddd"
                                            : "white"),
                                width: this.props.preview
                                    ? rectWidth + "px"
                                    : rectWidth * scale + (this.props.bleed ? 20 : 0) + "px",
                                height: this.props.preview
                                    ? rectHeight + "px"
                                    : rectHeight * scale + (this.props.bleed ? 20 : 0) + "px",
                                position: "relative",
                                boxShadow: "0 2px 8px rgba(14,19,24,.07)",
                                padding: this.props.bleed ? "10px" : 0,
                                // transition: 'all 2s linear',
                                overflow: this.props.bleed && "hidden",
                                boxSizing: "border-box"
                            }}
                        >
                            {this.props.selected && !this.props.cropMode &&
                                <div
                                    id="alo4"
                                    style={{
                                        top: "-2px",
                                        left: "-2px",
                                        width: "calc(100% + 4px)",
                                        height: "calc(100% + 4px)",
                                        position: "absolute",
                                        backgroundImage: 'linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1),linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1)',
                                        backgroundPosition: 'top,100%,bottom,0',
                                        backgroundSize: '12px 2px,2px 12px,12px 2px,2px 12px',
                                        backgroundRepeat: 'repeat-x,repeat-y,repeat-x,repeat-y',
                                    }}
                                ></div>}
                            <div
                                {...customAttr}
                                id="canvas"
                                className="canvas unblurred"
                                style={{
                                    width: rectWidth * scale + "px",
                                    height: rectHeight * scale + "px",
                                    display: "inline-block",
                                    position: "absolute",
                                    overflow: "hidden",
                                    backgroundColor: editorStore.pageColor.get(id),
                                    backgroundImage: `url(${editorStore.pageBackgroundImage.get(id)})`,
                                }}
                                onClick={e => {
                                }}
                            >
                                {images
                                    // .filter(img => img._id != this.props.idObjectSelected)
                                    .map(img => (
                                        <ResizableRect
                                            handleCropBtnClick={this.props.handleCropBtnClick}
                                            doNoObjectSelected={this.props.doNoObjectSelected}
                                            handleDragStart={this.props.handleDragStart}
                                            handleImageHovered={this.props.handleImageHovered}
                                            handleImageUnhovered={this.props.handleImageUnhovered}
                                            handleImageSelected={this.props.handleImageSelected}
                                            ref={i => this.canvas[CanvasType.All][img._id] = i}
                                            canvas="alo3"
                                            name={CanvasType.Preview}
                                            selected={false}
                                            image={img}
                                            hovered={img.hovered}
                                            freeStyle={img.freeStyle}
                                            toggleVideo={this.props.toggleVideo}
                                            id={img._id + "_1"}
                                            showImage={true}
                                            showController={false}
                                            key={img._id + "2"}
                                            scale={scale}
                                            rotateAngle={img.rotateAngle}
                                            onRotateStart={this.props.handleRotateStart}
                                            onResizeStart={this.props.handleResizeStart}
                                            onTextChange={this.props.onTextChange.bind(
                                                this,
                                                img
                                            )}
                                            handleFontColorChange={this.props.handleFontColorChange}
                                            onFontSizeChange={this.props.handleFontSizeChange}
                                            handleFontFaceChange={this.props.handleFontFamilyChange.bind(
                                                this
                                            )}
                                            handleChildIdSelected={this.props.handleChildIdSelected.bind(
                                                this
                                            )}
                                            childId={this.props.childId}
                                            cropMode={cropMode}
                                            handleResizeInnerImageStart={this.props.handleResizeInnerImageStart.bind(
                                                this
                                            )}
                                            bleed={this.props.bleed}
                                            disableCropMode={null}
                                        />
                                    ))}
                            </div>
                        </div>}
                </div>
            </ResizableRectContainer>
        );
    }
}

const ResizableRectContainer = StyledComponent.div`
  .controllers-btn {
    border-radius: 3px;
    padding: 5px;
    color: rgba(43, 59, 74, 0.45);
  }
  .controllers-btn:hover {
    background-color: rgba(75,102,129,.15);
    color: rgb(14, 19, 24);
  }
  button {
    background: none;
    border: none;
    padding: 1px 3px;
  }
  button:focus {
    outline: none;
  }
  .controllers {
    display: none;
    top: -10px;
  }
  :hover .controllers {
    display: inline !important;
  }
`;
