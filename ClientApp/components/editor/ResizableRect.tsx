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
  onFontSizeChange(fontSize: number): void;
  handleFontColorChange(fontColor: string): void;
  handleFontFaceChange(fontFace: string): void;
  cropMode: boolean;
  showImage: boolean;
  bleed: boolean;
  freeStyle: boolean;
  image: any;
  selected: boolean;
  canvas: string;
  hovered: boolean;
  handleImageSelected: any;
  handleImageHovered: any;
  handleImageUnhovered: any;
  doNoObjectSelected: any;
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
      onFontSizeChange,
      handleFontColorChange,
      handleFontFaceChange,
      childId,
      cropMode,
      showImage,
      bleed,
      id,
      image,
      selected,
      name,
      canvas,
      handleImageSelected,
      handleImageHovered,
      handleImageUnhovered,
      doNoObjectSelected,
    } = this.props;

    return (
      <Rect
        doNoObjectSelected={doNoObjectSelected}
        ref={i => this.child = i}
        handleImageSelected={handleImageSelected}
        handleImageHovered={handleImageHovered}
        handleImageUnhovered={handleImageUnhovered}
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
        onFontSizeChange={onFontSizeChange}
        handleFontColorChange={handleFontColorChange}
        handleFontFaceChange={handleFontFaceChange}
        childId={childId}
        cropMode={cropMode}
        showImage={showImage}
        bleed={bleed}
      />
    );
  }
}
