import React, { PureComponent } from "react";
import Rect from "./Rect";

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
  onRotateStart(): void;
  onResizeStart: any;
  scale: number;
  aspectRatio: number;
  minWidth: number;
  minHeight: number;
  parentRotateAngle: number;
  showController: boolean;
  updateStartPos: boolean;
  src: string;
  onTextChange: any;
  outlineWidth: number;
  onFontSizeChange(fontSize: number): void;
  handleFontColorChange(fontColor: string): void;
  handleFontFaceChange(fontFace: string): void;
  handleChildIdSelected(childId: string): void;
  posX: number;
  posY: number;
  enableCropMode(e: any): void;
  cropMode: boolean;
  handleResizeInnerImageStart: any;
  updateRect: boolean;
  hidden: boolean;
  showImage: boolean;
  bleed: boolean;
  dragging: boolean;
  resizing: boolean;
  rotating: boolean;
  freeStyle: boolean;
  hovered: boolean;
  image: any;
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
      onResizeStart,
      onRotateStart,
      showController,
      updateStartPos,
      src,
      onTextChange,
      outlineWidth,
      onFontSizeChange,
      handleFontColorChange,
      handleFontFaceChange,
      handleChildIdSelected,
      childId,
      enableCropMode,
      cropMode,
      showImage,
      handleResizeInnerImageStart,
      updateRect,
      hidden,
      bleed,
      id,
      dragging,
      resizing,
      rotating,
      image,
    } = this.props;

    return (
      <Rect
        image={image}
        hovered={this.props.hovered}
        rotating={rotating}
        resizing={resizing}
        dragging={dragging}
        id={id}
        hidden={hidden}
        updateStartPos={updateStartPos}
        scale={scale}
        showController={showController}
        zoomable={zoomable}
        parentRotateAngle={parentRotateAngle}
        onResizeStart={onResizeStart}
        onRotateStart={onRotateStart}
        src={src}
        onTextChange={onTextChange}
        left={left}
        outlineWidth={outlineWidth}
        onFontSizeChange={onFontSizeChange}
        handleFontColorChange={handleFontColorChange}
        handleFontFaceChange={handleFontFaceChange}
        handleChildIdSelected={handleChildIdSelected}
        childId={childId}
        enableCropMode={enableCropMode}
        cropMode={cropMode}
        handleResizeInnerImageStart={handleResizeInnerImageStart}
        updateRect={updateRect}
        showImage={showImage}
        bleed={bleed}
      />
    );
  }
}
