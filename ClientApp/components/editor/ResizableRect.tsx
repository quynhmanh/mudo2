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
  onRotateStart(): void;
  onRotate(rotateAngle: number, id: string, e: any): void;
  onRotateEnd(_id: string): void;
  onResizeStart: any;
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
  enableCropMode(e: any): void;
  cropMode: boolean;
  imgWidth: number;
  imgHeight: number;
  handleResizeInnerImageStart: any;
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
      onRotateStart,
      onRotateEnd,
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
      enableCropMode,
      cropMode,
      imgWidth,
      imgHeight,
      showImage,
      handleResizeInnerImageStart,
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
        onRotateStart={onRotateStart}
        onRotate={this.handleRotate}
        onRotateEnd={onRotateEnd}
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
        enableCropMode={enableCropMode}
        cropMode={cropMode}
        imgWidth={imgWidth}
        imgHeight={imgHeight}
        imgStyles={imgStyles}
        handleResizeInnerImageStart={handleResizeInnerImageStart}
        updateRect={updateRect}
        imgColor={imgColor}
        showImage={showImage}
        bleed={bleed}
        backgroundColor={backgroundColor}
      />
    );
  }
}
