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
}  from "@Utils";


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

    console.log('canvas render')

    const customAttr = {myattribute: id};
    
    var imgSelected = editorStore.images2.get(editorStore.idObjectSelected);

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
            { this.props.selected && !this.props.cropMode &&
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
                        enableCropMode={this.props.enableCropMode}
                        cropMode={cropMode}
                        handleResizeInnerImageStart={this.props.handleResizeInnerImageStart.bind(
                          this
                        )}
                        bleed={this.props.bleed}
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
