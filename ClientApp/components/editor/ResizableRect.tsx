import React, { Component } from "react";
import Rect from "./Rect";

export interface IProps {
  name: string;
  id: string;
  childId: string;
  onRotateStart(): void;
  onResizeStart: any;
  scale: number;
  minWidth: number;
  minHeight: number;
  parentRotateAngle: number;
  showController: boolean;
  onTextChange: any;
  outlineWidth: number;
  onFontSizeChange(fontSize: number): void;
  handleFontColorChange(fontColor: string): void;
  handleFontFaceChange(fontFace: string): void;
  handleChildIdSelected(childId: string): void;
  enableCropMode(e: any): void;
  cropMode: boolean;
  handleResizeInnerImageStart: any;
  showImage: boolean;
  bleed: boolean;
  freeStyle: boolean;
  hovered: boolean;
  image: any;
  selected: boolean;
  canvas: string;
  toggleVideo: any;
}

export interface IState {
  editing: boolean;
}

export default class ResizableRect extends Component<IProps, IState> {

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.image.selected || nextProps.image.selected) {
      return true;
    }
    if (this.props.scale != nextProps.scale) {
      return true;
    }
    return false;
  }
  
  static defaultProps = {
    parentRotateAngle: 0,
    rotateAngle: 0,
    rotatable: true,
    minWidth: 2,
    minHeight: 2,
    downloading: true,
  };

  render() {
    const {
      scale,
      parentRotateAngle,
      onResizeStart,
      onRotateStart,
      showController,
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
      bleed,
      id,
      image,
      selected,
      name,
      canvas,
      toggleVideo,
    } = this.props;

    return (
      <Rect
        toggleVideo={toggleVideo}
        canvas={canvas}
        name={name}
        selected={selected}
        image={image}
        hovered={this.props.hovered}
        id={id}
        scale={scale}
        showController={showController}
        parentRotateAngle={parentRotateAngle}
        onResizeStart={onResizeStart}
        onRotateStart={onRotateStart}
        onTextChange={onTextChange}
        outlineWidth={outlineWidth}
        onFontSizeChange={onFontSizeChange}
        handleFontColorChange={handleFontColorChange}
        handleFontFaceChange={handleFontFaceChange}
        handleChildIdSelected={handleChildIdSelected}
        childId={childId}
        enableCropMode={enableCropMode}
        cropMode={cropMode}
        handleResizeInnerImageStart={handleResizeInnerImageStart}
        showImage={showImage}
        bleed={bleed}
      />
    );
  }
}
