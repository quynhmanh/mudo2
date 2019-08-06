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
  id: string;
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
index: number;
addAPage: any;
staticGuides: any;
idObjectSelected: any;
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

  tranformImage = (image: any) => {
    var centerX = image.left + image.width / 2;
    var centerY = image.top + image.height / 2;

    if (!image.rotateAngle || image.rotateAngle === 0) {
      return {
        x: [centerX - image.width / 2, centerX, centerX + image.width / 2],
        y: [centerY - image.height / 2, centerY, centerY + image.height / 2],
      }
    } else {
      return {
        x: [centerX - image.height / 2, centerX, centerX + image.height / 2],
        y: [centerY - image.width / 2, centerY, centerY + image.width / 2],
      }
    }
  }

  render () {

        const {mode, rectWidth, rectHeight, scale, images, childId, cropMode, index, id, staticGuides, idObjectSelected} = this.props;

      return <div id={id}>
        <span style={{fontSize: '12px', display: 'block', marginBottom: '5px',}}>Trang {index + 1} - Mặt trước</span>
        <div
      style={{
        width: rectWidth * scale + 'px',
        height: rectHeight * scale + 'px',
      }}
    >

<div 
  id="guide-container" 
  className="screen-container" 
  style={{
    width: rectWidth * scale + 'px',
    height: rectHeight * scale + 'px',
    position: 'absolute',
  }}>
                {
                  staticGuides.x.map(g => g[1] !== 1 ? null :
                    <div className="guide axis-x static" style={{left: `${g[0]*scale}px`, border: g[1] === 1 ? '0.5px dashed #B14AED' : null}}></div>
                  )
                }
                {
                  staticGuides.y.map(g => g[1] !== 1 ? null :
                    <div className="guide axis-y static" style={{top: `${g[0]*scale}px`, border: g[1] === 1 ? '0.5px dashed #B14AED' : null}}></div>
                  )
                }
                {
                  images.map(g => {
                      var transformImage = this.tranformImage(g);
                      return g[0] !== 1 ? null :<div className="guide axis-x static" style={{left: `${transformImage.x[0]*scale}px`, border: g[0] === 1 ? '0.5px dashed #B14AED' : null}}></div>
                    }
                  )
                }
                {
                  images.map(g => {
                    var transformImage = this.tranformImage(g);
                    return g[1] !== 1 ? null : <div className="guide axis-x static" style={{left: `${(transformImage.x[1])*scale}px`, border: g[1] === 1 ? '0.5px dashed #B14AED' : null}}></div>
                  }
                )}
                {
                  images.map(g => {
                    var transformImage = this.tranformImage(g);
                    return g[2] !== 1 ? null : <div className="guide axis-x static" style={{left: `${(transformImage.x[2])*scale}px`, border: g[2] === 1 ? '0.5px dashed #B14AED' : null}}></div>
                  })
                }
                {
                  images.map(g => {
                    var transformImage = this.tranformImage(g);
                    return g[3] !== 1 ? null : <div className="guide axis-y static" style={{top: `${transformImage.y[0]*scale}px`, border: g[3] === 1 ? '0.5px dashed #B14AED' : null}}></div>
                  })
                }
                {
                  images.map(g => {
                    var transformImage = this.tranformImage(g);
                    return g[4] !== 1 ? null : <div className="guide axis-y static" style={{top: `${(transformImage.y[1])*scale}px`, border: g[4] === 1 ? '0.5px dashed #B14AED' : null}}></div>
                  })
                }
                {
                  images.map(g => {
                    var transformImage = this.tranformImage(g);
                    return g[5] !== 1 ? null : <div className="guide axis-y static" style={{top: `${(transformImage.y[2])*scale}px`, border: g[5] === 1 ? '0.5px dashed #B14AED' : null}}></div>
                  })
                }
              </div>
      
      <div 
                id="alo" 
                className="alo"
                style={{
                  backgroundColor: (mode == Mode.CreateTextTemplate || mode == Mode.EditTextTemplate) ? 'black' : this.props.cropMode ? 'rgba(14, 19, 24, 0.2)' : 'white',
                  width: rectWidth * scale + 'px',
                  height: rectHeight * scale + 'px',
                  position: 'relative',
                  boxShadow: "0 2px 8px rgba(14,19,24,.07)",
              }}>
                <div
                  id="canvas"
                  className="unblurred"
                  style={{
                    width: rectWidth * scale + 'px' ,
                    height: rectHeight * scale + 'px',
                    display: 'inline-block',
                    position: 'relative',
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
    // outline: img.selected ? `rgb(1, 159, 182) solid ${Math.min(2, Math.min(rectHeight * scale, rectWidth * scale) / 100)}px` : null, 
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
              <div
                  id="canvas"
                  className="unblurred"
                  style={{
                    width: rectWidth * scale + 'px' ,
                    height: rectHeight * scale + 'px',
                    display: 'inline-block',
                    position: 'absolute' as 'absolute',
                    left: 0,
                    // overflow: 'hidden',
                    // zIndex: this.props.idObjectSelected ? 123123 : 0,
                  }}
                  onClick={e => {
                    if ((e.target as Element).id === "canvas") {
                      this.props.doNoObjectSelected();
                    }
                  }}
                >
                {images.filter(img => img.selected).map(img => (

<ResizableRectWrapper
  outlineWidth={Math.min(2, Math.min(rectHeight * scale, rectWidth * scale) / 100)}
  style={{
    zIndex: img.zIndex,
    // outline: img.selected ? `rgb(1, 159, 182) solid ${Math.min(2, Math.min(rectHeight * scale, rectWidth * scale) / 100)}px` : null, 
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
              <a
                style={{
                  width: '100%',
                  display: 'block',
                  border: '1px solid #00000021',
                  textAlign: 'center',
                  marginTop: '11px',
                  textDecoration: 'none',
                  color: 'rgba(68, 62, 62, 0.52)',
                }}
                href="#" onClick={(e) => {this.props.addAPage(e, id)} }>
                Thêm 1 trang
              </a>
              </div>}
}

const ResizableRectWrapper = StyledComponent.div`
  :hover {
    outline: rgb(1, 159, 182) solid ${props => props.outlineWidth}px;
  }
`;
