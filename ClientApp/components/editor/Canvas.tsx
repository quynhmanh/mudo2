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
    handleGridCrop: any;
    handleChildCrop: any;
    handleGridSelected: any;
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
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.id = "animation-script"
        s.innerHTML = "function animate() {}";
        this.refAlo.appendChild(s);
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
                    transition: "all 0.1s linear"
                }}
                key={id}
                id={!this.props.downloading ? id : ""}
            >
                <div>

                </div>
                {!this.props.preview && (
                    <span
                        style={{
                            fontSize: "13px",
                            display: "block",
                            marginBottom: "5px",
                            marginTop: "15px",
                            color: "#989899",
                        }}
                    >
                        {this.props.translate("page")} {index + 1}
                    </span>
                )}
                {(!this.props.preview || editorStore.activePageId == id) && (
                    <div
                        className="controllers"
                        style={{
                            position: "absolute",
                            right: 0,
                            display: editorStore.activePageId == id ? "inline" : "none",
                        }}
                    >
                        {numberOfPages != 1 &&
                            <Tooltip
                                offsetLeft={0}
                                offsetTop={-15}
                                content={"Delete page"}
                                delay={10}
                                // style={{ display: show ? "block" : "none" }}
                                position="top"
                            >
                                <button
                                    className="controllers-btn"
                                    onClick={() => {
                                        document.getElementById(id).style.opacity = "0";
                                        setTimeout(() => {
                                            this.props.handleDeleteThisPage(id);
                                        }, 100);
                                    }}
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M9 3.25h2c.69 0 1.25.56 1.25 1.25V5h-4.5v-.5c0-.69.56-1.25 1.25-1.25zM6.5 5v-.5A2.5 2.5 0 0 1 9 2h2a2.5 2.5 0 0 1 2.5 2.5V5h3.375a.625.625 0 1 1 0 1.25H16V15a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6.25h-.875a.625.625 0 1 1 0-1.25H6.5zm7 1.25H5.25V15c0 .966.784 1.75 1.75 1.75h6A1.75 1.75 0 0 0 14.75 15V6.25H13.5zM8.125 8h-.25v6h1.25V8h-1zm2.75 1V8h1.25v6h-1.25V9z"
                                            fill="currentColor"
                                        ></path>
                                    </svg>
                                </button>
                            </Tooltip>}
                        <Tooltip
                            offsetLeft={0}
                            offsetTop={-15}
                            content={this.props.translate("addPage")}
                            delay={10}
                            // style={{ display: show ? "block" : "none" }}
                            position="top"
                        >
                            <button
                                className="controllers-btn"
                                onClick={e => {
                                    this.props.addAPage(e, id);
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.875 10.208a.625.625 0 1 0 1.25 0v-3.75h3.75a.625.625 0 1 0 0-1.25h-3.75v-3.75a.625.625 0 1 0-1.25 0v3.75h-3.75a.625.625 0 0 0 0 1.25h3.75v3.75z" fill="currentColor"></path><path d="M6.015 3.333H5c-.92 0-1.667.746-1.667 1.667v10c0 .92.746 1.666 1.667 1.666h8.333c.92 0 1.667-.746 1.667-1.666v-2.151h-1.25v2.15c0 .23-.187.417-.417.417H5A.417.417 0 0 1 4.583 15V5c0-.23.187-.417.417-.417h1.015v-1.25z" fill="currentColor"></path></svg>
                            </button>
                        </Tooltip>
                    </div>
                )}
                <div
                    style={{
                        width: rectWidth * scale + "px",
                        height: rectHeight * scale + "px",
                        transform: this.props.preview && "scale(0.5)",
                        transformOrigin: this.props.preview && "0 0"
                    }}
                >
                    {!this.props.downloading && <div
                        id="guide-container"
                        className="screen-container"
                        style={{
                            width: rectWidth * scale + "px",
                            height: rectHeight * scale + "px",
                            position: "absolute"
                        }}
                    >
                        {staticGuides.x.map(g =>
                            // g[1] !== 1 ? null : (
                            <div
                                key={uuidv4()}
                                id={g[1] + id}
                                className="guide axis-x static"
                                style={{
                                    display: 'none',
                                    left: `${g[0] * scale}px`,
                                    borderLeft: "0.1em solid rgb(251 0 255)"
                                }}
                            ></div>
                            // )
                        )}
                        {staticGuides.y.map(g =>
                            // g[1] !== 1 ? null : (
                            <div
                                key={uuidv4()}
                                id={g[1] + id}
                                className="guide axis-y static"
                                style={{
                                    display: 'none',
                                    top: `${g[0] * scale}px`,
                                    borderTop: "0.1em solid rgb(251 0 255)"
                                }}
                            ></div>
                            // )
                        )}
                        {images.map(g => {
                            var transformImage = getTransformedImage(g);
                            return (<div
                                key={g._id + "guide_0"}
                                id={g._id + "guide_0"}
                                className="guide axis-x static"
                                style={{
                                    display: 'none',
                                    left: `${transformImage.x[0] * scale}px`,
                                    borderLeft: `0.1em ${g.type == TemplateType.BackgroundImage ? "solid" : "dashed"} rgb(251 0 255)`,
                                }}
                            ></div>
                            );
                        })}
                        {images.map(g => {
                            var transformImage = getTransformedImage(g);
                            return (<div
                                key={g._id + "guide_1"}
                                id={g._id + "guide_1"}
                                className="guide axis-x static"
                                style={{
                                    display: 'none',
                                    left: `${transformImage.x[1] * scale}px`,
                                    borderLeft: `0.1em ${g.type == TemplateType.BackgroundImage ? "solid" : "dashed"} rgb(251 0 255)`,
                                }}
                            ></div>
                            );
                        })}
                        {images.map(g => {
                            var transformImage = getTransformedImage(g);
                            return (
                                <div
                                    key={g._id + "guide_2"}
                                    id={g._id + "guide_2"}
                                    className="guide axis-x static"
                                    style={{
                                        display: 'none',
                                        left: `${transformImage.x[2] * scale}px`,
                                        borderLeft: `0.1em ${g.type == TemplateType.BackgroundImage ? "solid" : "dashed"} rgb(251 0 255)`,
                                    }}
                                ></div>
                            );
                        })}
                        {images.map(g => {
                            var transformImage = getTransformedImage(g);
                            return (
                                <div
                                    key={g._id + "guide_3"}
                                    id={g._id + "guide_3"}
                                    className="guide axis-y static"
                                    style={{
                                        display: 'none',
                                        top: `${transformImage.y[0] * scale}px`,
                                        borderTop: `0.1em ${g.type == TemplateType.BackgroundImage ? "solid" : "dashed"} rgb(251 0 255)`,
                                    }}
                                ></div>
                            );
                        })}
                        {images.map(g => {
                            var transformImage = getTransformedImage(g);
                            return (
                                <div
                                    key={g._id + "guide_4"}
                                    id={g._id + "guide_4"}
                                    className="guide axis-y static"
                                    style={{
                                        display: 'none',
                                        top: `${transformImage.y[1] * scale}px`,
                                        borderTop: `0.1em ${g.type == TemplateType.BackgroundImage ? "solid" : "dashed"} rgb(251 0 255)`,
                                    }}
                                ></div>
                            );
                        })}
                        {images.map(g => {
                            var transformImage = getTransformedImage(g);
                            return (
                                <div
                                    key={g._id + "guide_5"}
                                    id={g._id + "guide_5"}
                                    className="guide axis-y static"
                                    style={{
                                        display: 'none',
                                        top: `${transformImage.y[2] * scale}px`,
                                        borderTop: `0.1em ${g.type == TemplateType.BackgroundImage ? "solid" : "dashed"} rgb(251 0 255)`,
                                    }}
                                ></div>
                            );
                        })}
                    </div>}
                    {!this.props.downloading &&
                        <div
                            id={!this.props.downloading ? "alo-" + index : ""}
                            ref={i => this.refAlo = i}
                            className={!this.props.downloading ? `alo alo-${index}` : ""}
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
                                boxSizing: "border-box",
                                backgroundSize: "contain",
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
                            {this.props.bleed && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "10px",
                                        height: "10px",
                                        backgroundColor: "black",
                                        zIndex: 99999999
                                    }}
                                ></div>
                            )}
                            {this.props.bleed && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        width: "10px",
                                        height: "10px",
                                        backgroundColor: "black",
                                        zIndex: 99999999
                                    }}
                                ></div>
                            )}
                            {this.props.bleed && (
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        width: "10px",
                                        height: "10px",
                                        backgroundColor: "black",
                                        zIndex: 99999999
                                    }}
                                ></div>
                            )}
                            {this.props.bleed && (
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        width: "10px",
                                        height: "10px",
                                        backgroundColor: "black",
                                        zIndex: 99999999
                                    }}
                                ></div>
                            )}
                            <div
                                {...customAttr}
                                id="canvas"
                                className={`canvas unblurred canvas-${id}`}
                                style={{
                                    width: rectWidth * scale + "px",
                                    height: rectHeight * scale + "px",
                                    display: "inline-block",
                                    position: "absolute",
                                    overflow: "hidden",
                                    backgroundColor: editorStore.pageColor.get(id),
                                    backgroundImage: `url(${editorStore.pageBackgroundImage.get(id)})`,
                                }}
                            >
                                {images
                                    .map(img => (
                                        <ResizableRect
                                            handleGridSelected={this.props.handleGridSelected}
                                            handleGridCrop={this.props.handleGridCrop}
                                            handleChildCrop={this.props.handleChildCrop}
                                            handleCropBtnClick={this.props.handleCropBtnClick}
                                            doNoObjectSelected={this.props.doNoObjectSelected}
                                            handleDragStart={this.props.handleDragStart}
                                            handleImageHovered={this.props.handleImageHovered}
                                            handleImageUnhovered={this.props.handleImageUnhovered}
                                            handleImageSelected={this.props.handleImageSelected}
                                            ref={i => this.canvas[CanvasType.All][img._id] = i}
                                            canvas="alo"
                                            name={CanvasType.All}
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
                            <div
                                {...customAttr}
                                id="canvas2"
                                className="canvas unblurred hoveredcanvas"
                                style={{
                                    width: rectWidth * scale + "px",
                                    height: rectHeight * scale + "px",
                                    display: "inline-block",
                                    position: "relative",
                                    zIndex: cropMode && 9999999,
                                    pointerEvents: "none",
                                }}
                                onClick={e => {
                                    if ((e.target as HTMLElement).id == "canvas") {
                                        this.props.disableCropMode();
                                    }
                                }}
                            >
                                <div>
                                    {images
                                        .map(imgHovered =>
                                            <ResizableRect
                                                handleGridSelected={this.props.handleGridSelected}
                                                handleGridCrop={this.props.handleGridCrop}
                                                handleChildCrop={this.props.handleChildCrop}
                                                handleCropBtnClick={this.props.handleCropBtnClick}
                                                handleDragStart={this.props.handleDragStart}
                                                ref={i => this.canvas[CanvasType.HoverLayer][imgHovered._id] = i}
                                                handleImageSelected={this.props.handleImageSelected}
                                                handleImageUnhovered={this.props.handleImageUnhovered}
                                                handleImageHovered={this.props.handleImageHovered}
                                                canvas="alo"
                                                name={CanvasType.HoverLayer}
                                                selected={imgHovered.selected}
                                                hovered={imgHovered.hovered}
                                                image={imgHovered}
                                                toggleVideo={this.props.toggleVideo}
                                                freeStyle={imgHovered.freeStyle}
                                                id={imgHovered._id + "_2"}
                                                bleed={this.props.bleed}
                                                showImage={false}
                                                showController={false}
                                                key={imgHovered._id + "2"}
                                                scale={scale}
                                                rotateAngle={imgHovered.rotateAngle}
                                                onRotateStart={this.props.handleRotateStart}
                                                onResizeStart={this.props.handleResizeStart}
                                                disableCropMode={this.props.disableCropMode}
                                                onTextChange={this.props.onTextChange.bind(
                                                    this,
                                                    imgHovered
                                                )}
                                                handleFontColorChange={
                                                    this.props.handleFontColorChange
                                                }
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
                                                doNoObjectSelected={null}
                                            />
                                        )
                                    }
                                    {editorStore.cropMode && 
                                        <div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>}
                    {this.props.downloading &&
                        <div
                            id="alo"
                            ref={i => this.refAlo = i}
                            className="alo2"
                            style={{
                                backgroundColor: "white",
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
                                boxSizing: "border-box",
                                display: "none",
                            }}
                        >
                            
                            {this.props.bleed && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "10px",
                                        height: "10px",
                                        backgroundColor: "black",
                                        zIndex: 99999999
                                    }}
                                ></div>
                            )}
                            {this.props.bleed && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        width: "10px",
                                        height: "10px",
                                        backgroundColor: "black",
                                        zIndex: 99999999
                                    }}
                                ></div>
                            )}
                            {this.props.bleed && (
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        width: "10px",
                                        height: "10px",
                                        backgroundColor: "black",
                                        zIndex: 99999999
                                    }}
                                ></div>
                            )}
                            {this.props.bleed && (
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        width: "10px",
                                        height: "10px",
                                        backgroundColor: "black",
                                        zIndex: 99999999
                                    }}
                                ></div>
                            )}
                            <div
                                {...customAttr}
                                id="canvas3"
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
                                    // .filter(image => image.type != TemplateType.GroupedItem)
                                    .map(imgHovered =>
                                        <ResizableRect
                                            handleChildCrop={this.props.handleChildCrop}
                                            handleDragStart={this.props.handleDragStart}
                                            ref={i => this.canvas[CanvasType.Download][imgHovered._id] = i}
                                            handleImageSelected={this.props.handleImageSelected}
                                            handleImageUnhovered={this.props.handleImageUnhovered}
                                            handleImageHovered={this.props.handleImageHovered}
                                            canvas="alo2"
                                            name={CanvasType.Download}
                                            selected={imgHovered.selected}
                                            hovered={imgHovered.hovered}
                                            image={imgHovered}
                                            toggleVideo={this.props.toggleVideo}
                                            freeStyle={imgHovered.freeStyle}
                                            id={imgHovered._id + "_2"}
                                            bleed={this.props.bleed}
                                            showImage={false}
                                            showController={false}
                                            key={imgHovered._id + "2"}
                                            scale={1}
                                            rotateAngle={imgHovered.rotateAngle}
                                            onRotateStart={this.props.handleRotateStart}
                                            onResizeStart={this.props.handleResizeStart}
                                            onTextChange={this.props.onTextChange.bind(
                                                this,
                                                imgHovered
                                            )}
                                            disableCropMode={this.props.disableCropMode}
                                            handleFontColorChange={
                                                this.props.handleFontColorChange
                                            }
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
                                            doNoObjectSelected={null}
                                            handleCropBtnClick={null}
                                        />
                                    )
                                }
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
