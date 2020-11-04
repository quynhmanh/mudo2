import React, { Component } from "react";
import Rect from "./Rect";
import { TemplateType } from "./enums";

export interface IProps {
  name: any;
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
  onFontSizeChange(fontSize: number): void;
  handleFontColorChange(fontColor: string): void;
  handleFontFaceChange(fontFace: string): void;
  handleChildIdSelected(childId: string): void;
  disableCropMode: any
  cropMode: boolean;
  handleResizeInnerImageStart: any;
  showImage: boolean;
  bleed: boolean;
  freeStyle: boolean;
  image: any;
  selected: boolean;
  canvas: string;
  toggleVideo: any;
  hovered: boolean;
  handleImageSelected: any;
  handleImageHovered: any;
  handleImageUnhovered: any;
  handleDragStart: any;
  doNoObjectSelected: any;
  handleCropBtnClick: any;
  handleGridCrop: any;
  handleChildCrop: any;
}

export interface IState {
  editing: boolean;
}

export default class ResizableRect extends Component<IProps, IState> {

  shouldComponentUpdate(nextProps, nextState) {
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

  child = null;

  render() {
    const {
      scale,
      parentRotateAngle,
      onResizeStart,
      onRotateStart,
      showController,
      onTextChange,
      onFontSizeChange,
      handleFontColorChange,
      handleFontFaceChange,
      handleChildIdSelected,
      childId,
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
      handleImageSelected,
      handleImageHovered,
      handleImageUnhovered,
      handleDragStart,
      doNoObjectSelected,
      handleCropBtnClick,
      disableCropMode,
      handleGridCrop,
      handleGridSelected,
      handleChildCrop,
    } = this.props;

    return (
      <Rect
        handleGridSelected={handleGridSelected}
        handleGridCrop={handleGridCrop}
        handleChildCrop={handleChildCrop}
        handleCropBtnClick={handleCropBtnClick}
        doNoObjectSelected={doNoObjectSelected}
        handleDragStart={handleDragStart}
        ref={i => this.child = i}
        handleImageSelected={handleImageSelected}
        handleImageHovered={handleImageHovered}
        handleImageUnhovered={handleImageUnhovered}
        toggleVideo={toggleVideo}
        canvas={canvas}
        name={name}
        selected={selected}
        image={image}
        id={id}
        scale={scale}
        showController={showController}
        parentRotateAngle={parentRotateAngle}
        onResizeStart={onResizeStart}
        onRotateStart={onRotateStart}
        onTextChange={onTextChange}
        onFontSizeChange={onFontSizeChange}
        handleFontColorChange={handleFontColorChange}
        handleFontFaceChange={handleFontFaceChange}
        handleChildIdSelected={handleChildIdSelected}
        disableCropMode={disableCropMode}
        childId={childId}
        cropMode={cropMode}
        handleResizeInnerImageStart={handleResizeInnerImageStart}
        showImage={showImage}
        bleed={bleed}
      />
    );
  }
}
