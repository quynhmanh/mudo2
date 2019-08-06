import React, { Component, PureComponent } from 'react'
import styled from 'styled-components';
import ResizableRect from '@Components/editor/ResizableRect';
import uuidv4 from "uuid/v4";
import Tooltip from '@Components/shared/Tooltip';
import {htmlToImage, getBoundingClientRect} from '@Utils';
import "@Styles/editor.scss";
import TopMenu from '@Components/editor/Sidebar';
import axios from 'axios';
import StyledComponent from 'styled-components';
import Popup from '@Components/shared/Popup';
import { object } from "prop-types";
const thick = 16;

export interface IProps {
  images: any;
  mode: number;
  rectWidth: number;
  rectHeight: number;
  scale: number;
  childId: string;
  cropMode: boolean;
  handleImageSelected: any;
  handleRotateStart: any;
    handleRotate: any;
    handleRotateEnd: any;
    handleResizeStart: any;
    handleResize: any;
    handleResizeEnd: any;
    handleDragStart: any;
    handleDrag: any;
    handleDragEnd: any;
    onSingleTextChange: any;
    handleFontSizeChange: any;
handleFontColorChange: any;
handleFontFamilyChange: any;
handleChildIdSelected: any;
handleImageDrag: any;
enableCropMode: any;
handleImageResize: any;
startX: any;
startY: any;
onResizeInnerImageStart: any;
resizingInnerImage: any;
updateRect: any;
doNoObjectSelected: any;
}

export interface IState {
}


enum Mode {
    CreateDesign = 0,
    CreateTemplate = 1,
    CreateTextTemplate = 2,
    EditTemplate = 3,
    EditTextTemplate = 4,
  }

export default class Canvas extends PureComponent<IProps, IState> {
  render () {

        const {mode, rectWidth, rectHeight, scale, images, childId, cropMode} = this.props;

      return <div
                style={{
                  width: rectWidth * scale + 'px',
                  height: rectHeight * scale + 'px',
                }}
              >
      <div 
                id="alo" 
                className="alo"
                style={{
                  backgroundColor: (mode == Mode.CreateTextTemplate || mode == Mode.EditTextTemplate) ? 'black' : null,
                  width: rectWidth * scale + 'px',
                  height: rectHeight * scale + 'px',
                  position: 'relative',
                  boxShadow: "0 2px 8px rgba(14,19,24,.07)",
              }}>
              {images.filter(img => img.selected).map(img => (
                <ResizableRectWrapper
                      outlineWidth={Math.min(2, Math.min(rectHeight * scale, rectWidth * scale) / 100)}
                      style={{
                        outline: `rgb(1, 159, 182) ${childId ? "dotted" : "solid"} ${Math.min(2, Math.min(rectHeight * scale, rectWidth * scale) / 100)}px`,
                        width: img.width * scale + 'px',
                        height: img.height * scale + 'px',
                        left: img.left * scale + 'px',
                        top: img.top * scale + 'px',
                        position: 'absolute',
                        transform: `rotate(${img.rotateAngle ? img.rotateAngle : 0 }deg)`,
                        zIndex: 123131323,
                      }}>
                    <div
                      style={{
                        width: img.width + 'px',
                        height: img.height + 'px',
                        transform: `scale(${scale})`,
                        transformOrigin: '0 0',
                      }}
                      key={img._id}
                      onMouseDown={this.props.handleImageSelected}
                    >
                      <ResizableRect
                        objectType={img.type}
                        selected={img.selected}
                        showController={img.selected}
                        key={img._id}
                        _id={img._id}
                        left={img.left}
                        top={img.top}
                        width={img.width}
                        height={img.height}
                        scale={scale}
                        rotateAngle={img.rotateAngle}
                        aspectRatio={img.width / img.height}
                        zoomable="n, w, s, e, nw, ne, se, sw"
                        onRotateStart={this.props.handleRotateStart}
                        onRotate={this.props.handleRotate.bind(this)}
                        onRotateEnd={this.props.handleRotateEnd}
                        onResizeStart={this.props.handleResizeStart}
                        onResize={this.props.handleResize.bind(this)}
                        onResizeEnd={this.props.handleResizeEnd}
                        onDragStart={this.props.handleDragStart.bind(this)}
                        onDrag={this.props.handleDrag.bind(this)}
                        onDragEnd={this.props.handleDragEnd}
                        updateStartPos={img.updateStartPos}
                        src={img.src}
                        onTextChange={this.props.onSingleTextChange.bind(
                          this,
                          img,
                        )}
                        innerHTML={img.innerHTML}
                        scaleX={img.scaleX}
                        scaleY={img.scaleY}
                        zIndex={1}
                        childrens={img.document_object}
                        outlineWidth={Math.min(2, Math.min(rectHeight * scale, rectWidth * scale) / 100)}
                        onFontSizeChange={this.props.handleFontSizeChange}
                        handleFontColorChange={this.props.handleFontColorChange}
                        handleFontFaceChange={this.props.handleFontFamilyChange.bind(this)}
                        handleChildIdSelected={this.props.handleChildIdSelected.bind(this)}
                        childId={this.props.childId}
                        posX={img.posX}
                        posY={img.posY}
                        handleImageDrag={this.props.handleImageDrag.bind(this, img._id)}
                        enableCropMode={this.props.enableCropMode}
                        cropMode={cropMode}
                        imgWidth={img.imgWidth}
                        imgHeight={img.imgHeight}
                        onImageResize={this.props.handleImageResize.bind(this)}
                        onResizeInnerImageStart={this.props.onResizeInnerImageStart.bind(this)}
                        resizingInnerImage={this.props.resizingInnerImage}
                        startX={this.props.startX}
                        startY={this.props.startY}
                        updateRect={this.props.updateRect}
                      />
                </div></ResizableRectWrapper>))}
                
                <div
                  id="canvas"
                  className="unblurred"
                  style={{
                    width: rectWidth * scale + 'px' ,
                    height: rectHeight * scale + 'px',
                    display: 'inline-block',
                    position: 'absolute',
                    left: 0,
                    overflow: 'hidden',
                  }}
                  onClick={e => {
                    if ((e.target as Element).id === "canvas") {
                      this.props.doNoObjectSelected();
                    }
                  }}
                >
                  {images.filter(img => !img.selected).map(img => (

                    <ResizableRectWrapper
                      outlineWidth={Math.min(2, Math.min(rectHeight * scale, rectWidth * scale) / 100)}
                      style={{
                        zIndex: img.zIndex,
                        outline: img.selected ? `rgb(1, 159, 182) solid ${Math.min(2, Math.min(rectHeight * scale, rectWidth * scale) / 100)}px` : null, 
                        width: img.width * scale + 'px',
                        height: img.height * scale + 'px',
                        left: img.left * scale + 'px',
                        top: img.top * scale + 'px',
                        position: 'absolute',
                        transform: `rotate(${img.rotateAngle ? img.rotateAngle : 0 }deg)`,
                      }}>
                    <div
                      style={{
                        width: img.width + 'px',
                        height: img.height + 'px',
                        transform: `scale(${scale})`,
                        transformOrigin: '0 0',
                      }}
                      key={img._id}
                      onMouseDown={this.props.handleImageSelected.bind(this, img._id)}
                    >
                      <ResizableRect
                        objectType={img.type}
                        selected={img.selected}
                        showController={img.selected}
                        key={img._id + "2"}
                        _id={img._id}
                        left={img.left}
                        top={img.top}
                        width={img.width}
                        height={img.height}
                        scale={scale}
                        rotateAngle={img.rotateAngle}
                        aspectRatio={img.width / img.height}
                        zoomable="n, w, s, e, nw, ne, se, sw"
                        onRotateStart={this.props.handleRotateStart}
                        onRotate={this.props.handleRotate.bind(this)}
                        onRotateEnd={this.props.handleRotateEnd}
                        onResizeStart={this.props.handleResizeStart}
                        onResize={this.props.handleResize.bind(this)}
                        onResizeEnd={this.props.handleResizeEnd}
                        onDragStart={this.props.handleDragStart.bind(this)}
                        onDrag={this.props.handleDrag.bind(this)}
                        onDragEnd={this.props.handleDragEnd}
                        updateStartPos={img.updateStartPos}
                        src={img.src}
                        onTextChange={this.props.onSingleTextChange.bind(
                          this,
                          img
                        )}
                        innerHTML={img.innerHTML}
                        scaleX={img.scaleX}
                        scaleY={img.scaleY}
                        zIndex={1}
                        childrens={img.document_object}
                        outlineWidth={Math.min(2, Math.min(rectHeight * scale, rectWidth * scale) / 100)}
                        handleFontColorChange={this.props.handleFontColorChange}
                        onFontSizeChange={this.props.handleFontSizeChange}
                        handleFontFaceChange={this.props.handleFontFamilyChange.bind(this)}
                        handleChildIdSelected={this.props.handleChildIdSelected.bind(this)}
                        childId={this.props.childId}
                        posX={img.posX}
                        posY={img.posY}
                        handleImageDrag={this.props.handleImageDrag.bind(this, img._id)}
                        enableCropMode={this.props.enableCropMode}
                        cropMode={cropMode}
                        imgWidth={img.imgWidth}
                        imgHeight={img.imgHeight}
                        onImageResize={this.props.handleImageResize.bind(this)}
                        resizingInnerImage={this.props.resizingInnerImage}
                        onResizeInnerImageStart={this.props.onResizeInnerImageStart.bind(this)}
                        startX={this.props.startX}
                        startY={this.props.startY}
                        updateRect={this.props.updateRect}
                      />
                </div></ResizableRectWrapper>))}
              </div>
              </div>
              </div>
  }
}

const ResizableRectWrapper = StyledComponent.div`
  :hover {
    outline: rgb(1, 159, 182) solid ${props => props.outlineWidth}px;
  }
`;
