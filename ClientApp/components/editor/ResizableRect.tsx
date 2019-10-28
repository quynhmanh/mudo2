import React, { PureComponent } from "react";
import Rect from "./Rect";
import { centerToTL, tLToCenter, getNewStyle, degToRadian } from "@Utils";

export interface IProps {
  id: string;
  childId: string;
  zoomable: string;
  rotatable: boolean;
  top: number;
  left: number;
  width: number;
  height: number;
  rotateAngle: number;
  selected: boolean;
  onDragStart(e: any): void;
  onRotateStart(): void;
  onRotate(rotateAngle: number, id: string, e: any): void;
  onRotateEnd(_id: string): void;
  onResizeStart(startX: number, startY: number): void;
  onResize(
    rect: any,
    isShiftKey: boolean,
    type: string,
    id: string,
    deltaX: number,
    deltaY: number,
    cursor: string,
    objectType: number,
    e: any
  ): void;
  onResizeEnd(): void;
  _id: string;
  scale: number;
  aspectRatio: number;
  minWidth: number;
  minHeight: number;
  parentRotateAngle: number;
  showController: boolean;
  updateStartPos: boolean;
  src: string;
  onTextChange: any;
  innerHTML: any;
  scaleX: number;
  scaleY: number;
  zIndex: number;
  childrens: any;
  objectType: number;
  outlineWidth: number;
  onFontSizeChange(fontSize: number): void;
  handleFontColorChange(fontColor: string): void;
  handleFontFaceChange(fontFace: string): void;
  handleChildIdSelected(childId: string): void;
  posX: number;
  posY: number;
  handleImageDrag(newPosX: number, newPosY: number): void;
  enableCropMode(e: any): void;
  cropMode: boolean;
  imgWidth: number;
  imgHeight: number;
  onImageResize(
    rect: any,
    isShiftKey: boolean,
    type: string,
    id: string,
    deltaX: number,
    deltaY: number,
    cursor: string,
    objectType: number,
    e: any
  ): void;
  resizingInnerImage: boolean;
  onResizeInnerImageStart(startX: number, startY: number): void;
  updateRect: boolean;
  imgColor: string;
  hidden: boolean;
  showImage: boolean;
  bleed: boolean;
  backgroundColor: string;
  opacity: number;
  dragging: boolean;
  resizing: boolean;
  rotating: boolean;
  freeStyle: boolean;
  hovered: boolean;
}

export interface IState {
  editing: boolean;
}

export default class ResizableRect extends PureComponent<IProps, IState> {
  static defaultProps = {
    parentRotateAngle: 0,
    rotateAngle: 0,
    rotatable: true,
    zoomable: "",
    minWidth: 2,
    minHeight: 2
  };

  handleRotate = (angle, startAngle, e) => {
    if (!this.props.onRotate) return;
    let rotateAngle = Math.round(startAngle + angle);
    if (rotateAngle >= 360) {
      rotateAngle -= 360;
    } else if (rotateAngle < 0) {
      rotateAngle += 360;
    }
    if (rotateAngle > 356 || rotateAngle < 4) {
      rotateAngle = 0;
    } else if (rotateAngle > 86 && rotateAngle < 94) {
      rotateAngle = 90;
    } else if (rotateAngle > 176 && rotateAngle < 184) {
      rotateAngle = 180;
    } else if (rotateAngle > 266 && rotateAngle < 274) {
      rotateAngle = 270;
    }

    const { _id } = this.props;

    this.props.onRotate(rotateAngle, _id, e);
  };

  handleResize = (
    length,
    alpha,
    rect,
    type,
    isShiftKey,
    cursor,
    objectType,
    e,
  ) => {
    if (!this.props.onResize) return;
    const {
      rotateAngle,
      minWidth,
      minHeight,
      parentRotateAngle,
      scale,
      _id,
      freeStyle,
    } = this.props;
    // let scale = 1;
    const beta = alpha - degToRadian(rotateAngle + parentRotateAngle);
    const deltaW = (length * Math.cos(beta)) / scale;
    const deltaH = (length * Math.sin(beta)) / scale;
    var { aspectRatio } = this.props;

    if (this.props.cropMode || freeStyle || cursor == "e" || cursor == "w") {
      aspectRatio = null;
    }

    const ratio =
      isShiftKey && !aspectRatio ? rect.width / rect.height : aspectRatio;
    const {
      position: { centerX, centerY },
      size: { width, height }
    } = getNewStyle(
      type,
      { ...rect, rotateAngle },
      deltaW,
      deltaH,
      ratio,
      minWidth,
      minHeight
    );

    this.props.onResize(
      centerToTL({ centerX, centerY, width, height, rotateAngle }),
      isShiftKey,
      type,
      _id,
      deltaW / width,
      deltaH / height,
      cursor,
      objectType,
      e
    );
  };

  handleImageResize = (
    length,
    alpha,
    rect,
    type,
    isShiftKey,
    cursor,
    objectType,
    e
  ) => {
    if (!this.props.onResize) return;
    const {
      rotateAngle,
      minWidth,
      minHeight,
      parentRotateAngle,
      // scale,
      _id
    } = this.props;
    let scale = 1;
    const beta = alpha - degToRadian(rotateAngle + parentRotateAngle);
    const deltaW = (length * Math.cos(beta)) / scale;
    const deltaH = (length * Math.sin(beta)) / scale;
    var { aspectRatio } = this.props;

    if (cursor == "e-resize" || cursor == "w-resize") {
      aspectRatio = null;
    }

    var rect2 = {
      centerX: rect.imgCenterX,
      centerY: rect.imgCenterY,
      height: rect.imgHeight,
      rotateAngle: rect.imgRotateAngle,
      width: rect.imgWidth
    };

    const ratio = rect2.width / rect2.height;
    const {
      position: { centerX, centerY },
      size: { width, height }
    } = getNewStyle(
      type,
      { ...rect2, rotateAngle },
      deltaW,
      deltaH,
      ratio,
      minWidth,
      minHeight
    );

    this.props.onImageResize(
      centerToTL({ centerX, centerY, width, height, rotateAngle }),
      isShiftKey,
      type,
      _id,
      deltaW / width,
      deltaH / height,
      cursor,
      objectType,
      e
    );
  };

  handleImageDrag = (newPosX: number, newPosY: number): void => {
    const { _id } = this.props;

    return (
      this.props.handleImageDrag && this.props.handleImageDrag(newPosX, newPosY)
    );
  };

  render() {
    const {
      scale,
      top,
      left,
      width,
      height,
      rotateAngle,
      parentRotateAngle,
      zoomable,
      rotatable,
      selected,
      onRotate,
      onResizeStart,
      onResizeEnd,
      onRotateStart,
      onRotateEnd,
      onDragStart,
      showController,
      updateStartPos,
      _id,
      src,
      onTextChange,
      innerHTML,
      scaleX,
      scaleY,
      zIndex,
      childrens,
      objectType,
      outlineWidth,
      onFontSizeChange,
      handleFontColorChange,
      handleFontFaceChange,
      handleChildIdSelected,
      childId,
      posX,
      posY,
      handleImageDrag,
      enableCropMode,
      cropMode,
      imgWidth,
      imgHeight,
      showImage,
      resizingInnerImage,
      onResizeInnerImageStart,
      updateRect,
      imgColor,
      hidden,
      bleed,
      backgroundColor,
      opacity,
      id,
      dragging,
      resizing,
      rotating,
    } = this.props;

    const styles = tLToCenter({ top, left, width, height, rotateAngle });
    const imgStyles = tLToCenter({
      left: posX,
      top: posY,
      width: imgWidth,
      height: imgHeight,
      rotateAngle: 0
    });

    return (
      <Rect
        hovered={this.props.hovered}
        rotating={rotating}
        resizing={resizing}
        dragging={dragging}
        id={id}
        opacity={opacity}
        hidden={hidden}
        objectType={objectType}
        childrens={childrens}
        _id={_id}
        updateStartPos={updateStartPos}
        scale={scale}
        selected={selected}
        showController={showController}
        styles={styles}
        zoomable={zoomable}
        rotatable={Boolean(rotatable && onRotate)}
        parentRotateAngle={parentRotateAngle}
        onResizeStart={onResizeStart}
        onResize={this.handleResize}
        onResizeEnd={onResizeEnd}
        onRotateStart={onRotateStart}
        onRotate={this.handleRotate}
        onRotateEnd={onRotateEnd}
        onDragStart={onDragStart}
        src={src}
        onTextChange={onTextChange}
        innerHTML={innerHTML}
        left={left}
        scaleX={scaleX}
        scaleY={scaleY}
        zIndex={zIndex}
        outlineWidth={outlineWidth}
        onFontSizeChange={onFontSizeChange}
        handleFontColorChange={handleFontColorChange}
        handleFontFaceChange={handleFontFaceChange}
        handleChildIdSelected={handleChildIdSelected}
        childId={childId}
        posX={posX}
        posY={posY}
        handleImageDrag={this.handleImageDrag}
        enableCropMode={enableCropMode}
        cropMode={cropMode}
        imgWidth={imgWidth}
        imgHeight={imgHeight}
        onImageResize={this.handleImageResize}
        imgStyles={imgStyles}
        resizingInnerImage={resizingInnerImage}
        onResizeInnerImageStart={onResizeInnerImageStart}
        updateRect={updateRect}
        imgColor={imgColor}
        showImage={showImage}
        bleed={bleed}
        backgroundColor={backgroundColor}
      />
    );
  }
}
