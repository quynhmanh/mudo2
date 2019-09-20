import React, { PureComponent, FormEvent } from "react";
import { getLength, getAngle, getCursor, tLToCenter } from "@Utils";
import StyledRect from "./StyledRect";
import SingleText from "@Components/editor/Text/SingleText";
import MathJax from 'react-mathjax2'
import { throttle } from 'lodash';

const tex = `f(x) = \\int_{-\\infty}^\\infty\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi`

const zoomableMap = {
  n: "t",
  s: "b",
  e: "r",
  w: "l",
  ne: "tr",
  nw: "tl",
  se: "br",
  sw: "bl"
};

export interface IProps {
  childId: string;
  _id: string;
  scale: number;
  styles: any;
  imgStyles: any;
  onDragStart(e: any, _id: string): void;
  onDrag(clientX: number, clientY: number): any;
  onDragEnd(): void;
  onRotateStart(): void;
  onRotate(angle: number, startAngle: number): void;
  onRotateEnd(): void;
  onResizeStart(startX: number, startY: number): void;
  onResize(
    deltaL: number,
    alpha: number,
    rect: any,
    type: string,
    isShiftKey: boolean,
    cursor: string,
    objectType: number,
    e: any,
    backgroundColor: string,
    fontSize: number,
  ): void;
  onResizeInnerImageStart(startX: number, startY: number): void;
  onImageResize(
    deltaL: number,
    alpha: number,
    rect: any,
    type: string,
    isShiftKey: boolean,
    cursor: string,
    objectType: number,
    e: any,
  ): void;
  onResizeEnd(): void;

  selected: boolean;
  zoomable: string;
  rotatable: boolean;
  parentRotateAngle: number;
  showController: boolean;
  updateStartPos: boolean;
  src: string;
  left: number;
  scaleX: number;
  scaleY: number;
  zIndex: number;
  onTextChange: any;
  innerHTML: string;
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
  cropMode: boolean;
  enableCropMode(e: any): void;
  imgWidth: number;
  imgHeight: number;
  resizingInnerImage: boolean;
  startX: number;
  startY: number;
  updateRect: boolean;
  imgColor: string;
  hidden: boolean;
  showImage: boolean;
  bleed: boolean;
  backgroundColor: string;
  opacity: number;
}

export interface IState {
  editing: boolean;
  selectionScaleX: number;
  selectionScaleY: number;
}

export default class Rect extends PureComponent<IProps, IState> {
  $element = null;
  _isMouseDown = false;
  setElementRef = ref => {
    this.$element = ref;
  };

  state = {
    editing: false,
    selectionScaleX: null,
    selectionScaleY: null,
    posX: 0,
    posY: 0,
  }

  componentDidMount() {
    if (this.props.innerHTML && this.$textEle) {
      this.$textEle.innerHTML = this.props.innerHTML;
    }

    this.startEditing = this.startEditing.bind(this);
  }

  // Drag
  startDrag = e => {
    // e.preventDefault();
    let { clientX: startX, clientY: startY } = e;
    this.props.onDragStart && this.props.onDragStart(e, this.props._id);
    this._isMouseDown = true;
    const onMove = e => {
      e.preventDefault();
      if (!this._isMouseDown) return; // patch: fix windows press win key during mouseup issue
      e.stopImmediatePropagation();
      const { clientX, clientY } = e;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;
      var update = this.props.onDrag(clientX, clientY);
      if (update && update.updateStartPosY) {
        startY = clientY;
      }
      if (update && update.updateStartPosX) {
        startX = clientX;
      }
    };
    const onUp = e => {
      e.preventDefault();
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      if (!this._isMouseDown) return;
      this._isMouseDown = false;
      this.props.onDragEnd && this.props.onDragEnd();
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  // Rotate
  startRotate = e => {
    e.preventDefault();
    if (e.button !== 0) return;
    const { clientX, clientY } = e;
    const {
      styles: {
        transform: { rotateAngle: startAngle }
      }
    } = this.props;
    const rect = this.$element.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    const startVector = {
      x: clientX - center.x,
      y: clientY - center.y
    };
    this.props.onRotateStart && this.props.onRotateStart();
    this._isMouseDown = true;
    const onMove = e => {
      e.preventDefault();
      if (!this._isMouseDown) return; // patch: fix windows press win key during mouseup issue
      e.stopImmediatePropagation();
      const { clientX, clientY } = e;
      const rotateVector = {
        x: clientX - center.x,
        y: clientY - center.y
      };
      const angle = getAngle(startVector, rotateVector);
      this.props.onRotate(angle, startAngle);
    };
    const onUp = e => {
      e.preventDefault();
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      if (!this._isMouseDown) return;
      this._isMouseDown = false;
      this.props.onRotateEnd && this.props.onRotateEnd();
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  startResizeImage = (e, cursor) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.button !== 0) return;
    document.body.style.cursor = cursor;
    const {
      styles: {
        position: { centerX, centerY },
        size: { width, height },
        transform: { rotateAngle }
      },
      imgStyles: {
        position: { centerX: imgCenterX, centerY: imgCenterY },
        size: { width: imgWidth, height: imgHeight },
        transform: { rotateAngle: imgRotateAngle }
      },
      objectType
    } = this.props;
    let rect = { width, height, centerX, centerY, rotateAngle };
    let rect2 = { imgWidth, imgHeight, imgCenterX, imgCenterY, imgRotateAngle };
    const { clientX: startX, clientY: startY } = e;
    const type = e.target.getAttribute("class").split(" ")[0];
    this.props.onResizeInnerImageStart && this.props.onResizeInnerImageStart(startX, startY);
    this._isMouseDown = true;
    var self = this;
    // this.props.onResizeInnerImageStart(startX, startY);
    const onMove = e => {
      if (this.props.updateRect) {
        let {
          styles: {
            position: { centerX, centerY },
            size: { width, height },
            transform: { rotateAngle }
          },
          imgStyles: {
            position: { centerX: imgCenterX, centerY: imgCenterY },
            size: { width: imgWidth, height: imgHeight },
            transform: { rotateAngle: imgRotateAngle }
          },
          objectType
        } = this.props;
    
        rect = { width, height, centerX, centerY, rotateAngle };
        rect2 = { imgWidth, imgHeight, imgCenterX, imgCenterY, imgRotateAngle };
      }
      e.preventDefault();
      if (!this._isMouseDown) return; // patch: fix windows press win key during mouseup issue
      e.stopImmediatePropagation();
      const { clientX, clientY } = e;
      const deltaX = clientX - this.props.startX;
      const deltaY = clientY - this.props.startY;
      const alpha = Math.atan2(deltaY, deltaX);
      const deltaL = getLength(deltaX, deltaY);
      const isShiftKey = e.shiftKey;
      if (!this.props.resizingInnerImage)
      {
        this.props.onResize(
          deltaL,
          alpha,
          rect,
          type,
          isShiftKey,
          cursor,
          objectType,
          e,
          this.props.backgroundColor,
        );
      } else {
        this.props.onImageResize(
          deltaL,
          alpha,
          rect2,
          type,
          isShiftKey,
          cursor,
          objectType,
          e,
        );
      }
    };

    const onUp = e => {
      e.preventDefault();
      document.body.style.cursor = "auto";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      if (!this._isMouseDown) return;
      this._isMouseDown = false;
      this.props.onResizeEnd && this.props.onResizeEnd();
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }
  
  startResizeInnerImage = (e, cursor) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.button !== 0) return;
    document.body.style.cursor = cursor;
    let {
      styles: {
        position: { centerX, centerY },
        size: { width, height },
        transform: { rotateAngle }
      },
      imgStyles: {
        position: { centerX: imgCenterX, centerY: imgCenterY },
        size: { width: imgWidth, height: imgHeight },
        transform: { rotateAngle: imgRotateAngle }
      },
      objectType
    } = this.props;

    const { clientX: startX, clientY: startY } = e;
    let rect = { width, height, centerX, centerY, rotateAngle };
    let rect2 = { imgWidth, imgHeight, imgCenterX, imgCenterY, imgRotateAngle };
    const type = e.target.getAttribute("class").split(" ")[0];
    this.props.onResizeStart && this.props.onResizeStart(startX, startY);
    this._isMouseDown = true;
    var self = this;
    const onMove = e => {
      if (this.props.updateRect) {
        let {
          styles: {
            position: { centerX, centerY },
            size: { width, height },
            transform: { rotateAngle }
          },
          imgStyles: {
            position: { centerX: imgCenterX, centerY: imgCenterY },
            size: { width: imgWidth, height: imgHeight },
            transform: { rotateAngle: imgRotateAngle }
          },
          objectType
        } = this.props;
    
        rect = { width, height, centerX, centerY, rotateAngle };
        rect2 = { imgWidth, imgHeight, imgCenterX, imgCenterY, imgRotateAngle };
      }
      e.preventDefault();
      if (!this._isMouseDown) return; // patch: fix windows press win key during mouseup issue
      e.stopImmediatePropagation();
      const { clientX, clientY } = e;
      const deltaX = clientX - this.props.startX;
      const deltaY = clientY - this.props.startY;
      const alpha = Math.atan2(deltaY, deltaX);
      const deltaL = getLength(deltaX, deltaY);
      const isShiftKey = e.shiftKey;
      if (!this.props.resizingInnerImage) {
        this.props.onResize(
          deltaL,
          alpha,
          rect,
          type,
          isShiftKey,
          cursor,
          objectType,
          e,
          this.props.backgroundColor,
        );
      } else {
        this.props.onImageResize(
          deltaL,
          alpha,
          rect2,
          type,
          isShiftKey,
          cursor,
          objectType,
          e
        );
      }
    };

    const onUp = e => {
      e.preventDefault();
      document.body.style.cursor = "auto";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      if (!this._isMouseDown) return;
      this._isMouseDown = false;
      this.props.onResizeEnd && this.props.onResizeEnd();
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  // Resize
  startResize = (e, cursor) => {
    var self = this;
    e.preventDefault();
    e.stopPropagation();
    if (e.button !== 0) return;
    document.body.style.cursor = cursor;
    const {
      styles: {
        position: { centerX, centerY },
        size: { width, height },
        transform: { rotateAngle }
      },
      objectType
    } = this.props;

    var res;
    var size;
      if (this.props.objectType !== 4) {

      var selectionScaleY = 1;
      if (self.state && self.state.selectionScaleY) {
        selectionScaleY = self.state.selectionScaleY;
      }

      if (this.props.childId) {
        selectionScaleY = this.props.childrens.find(child => child._id === this.props.childId).scaleY;
      }

      console.log('selectionScaleY', selectionScaleY);

      var a = document.getSelection();
        if (a && a.type === "Range") {
        } else {
          var id = this.props.childId ? this.props.childId : this.props._id;
          var el = document.getElementById(id).getElementsByClassName('font')[0];
          var sel = window.getSelection();
          var range = document.createRange();
          console.log('el id', el, id);
          range.selectNodeContents(el);
          sel.removeAllRanges();
          sel.addRange(range);
          var a = document.getSelection();
          size = window.getComputedStyle(el, null).getPropertyValue('font-size'); 
          res = parseInt(size.substring(0, size.length - 2)) * selectionScaleY * self.props.scaleY;
          sel.removeAllRanges();
      }

      // document.getElementById("fontSizeButton").innerText = `${res}px`;
      // self.props.onFontSizeChange(res);
    }

    const { clientX: startX, clientY: startY } = e;
    const type = e.target.getAttribute("class").split(" ")[0];
    this.props.onResizeStart && this.props.onResizeStart(startX, startY);
    this._isMouseDown = true;
    const onMove = e => {
      e.preventDefault();
      if (!this._isMouseDown) return; // patch: fix windows press win key during mouseup issue
      e.stopImmediatePropagation();
      const { clientX, clientY } = e;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;
      const alpha = Math.atan2(deltaY, deltaX);
      const deltaL = getLength(deltaX, deltaY);
      const isShiftKey = e.shiftKey;
      const rect = { width, height, centerX, centerY, rotateAngle };
      this.props.onResize(
        deltaL,
        alpha,
        rect,
        type,
        isShiftKey,
        cursor,
        objectType,
        e,
        this.props.backgroundColor,
        res,
      );

      if (this.props.objectType !== 4) {

          var fontSize = parseInt(size.substring(0, size.length - 2)) * selectionScaleY * self.props.scaleY;
          console.log('fontSize ', fontSize, this.props.childId);
          document.getElementById("fontSizeButton").innerText = `${Math.round(fontSize * 10) / 10}`;
      }
    };

    const onUp = e => {
      e.preventDefault();
      document.body.style.cursor = "auto";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      if (!this._isMouseDown) return;
      this._isMouseDown = false;
      this.props.onResizeEnd && this.props.onResizeEnd();
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  $textEle = null;

  setTextElementRef = ref => {
    this.$textEle = ref;
  };

  endEditing = e => {};

  startEditing = selectionScaleY => {
    console.log('selectionScaleY ', selectionScaleY);
    this.setState({selectionScaleY: 2});
  };

  onMouseDown = () => {
    console.log('onMouseDown');
    var self = this;
    var size;
    var fontFace;
    var fontColor;
    if (this.props.objectType !== 4) {

      var selectionScaleY = 1;
      if (self.state && self.state.selectionScaleY) {
        selectionScaleY = self.state.selectionScaleY;
      }

        var a = document.getSelection();
        if (a && a.type === "Range") {
        } else {
          // var el = document.getElementById(self.props._id).getElementsByClassName('font')[0];
          var el = document.getElementById(self.props._id).getElementsByClassName("font")[0];
          console.log('document.getElementById(self.props._id) ', document.getElementById(self.props._id));
          console.log('ellll ', el);
          var sel = window.getSelection();
          var range = document.createRange();
          range.selectNodeContents(el);
          sel.removeAllRanges();
          sel.addRange(range);
          var a = document.getSelection();
          size = window.getComputedStyle(el, null).getPropertyValue('font-size'); 
          fontFace = window.getComputedStyle(el, null).getPropertyValue("font-family");
          fontColor = window.getComputedStyle(el, null).getPropertyValue("color");

          sel.removeAllRanges();
      }

      console.log('fontFace ', fontFace);
      console.log('fontColor ', fontColor);

      this.props.handleFontFaceChange(fontFace);
      this.props.handleFontColorChange(fontColor);

      var fontSize = parseInt(size.substring(0, size.length - 2)) * selectionScaleY * self.props.scaleY;
      document.getElementById("fontSizeButton").innerText = `${Math.round(fontSize * 10) / 10}`;
    }
  }

  handleImageDrag = (e) => {
    // e.preventDefault();
    var self = this;
    let { clientX: startX, clientY: startY } = e;
    var { posX, posY } = this.props;
    this.props.onDragStart && this.props.onDragStart(e, this.props._id);
    this._isMouseDown = true;
    const onMove = e => {
      e.preventDefault();
      if (!this._isMouseDown) return; // patch: fix windows press win key during mouseup issue
      e.stopImmediatePropagation();
      const { clientX, clientY } = e;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;
      var newPosX = posX + deltaX;
      var newPosY = posY + deltaY;
      this.props.handleImageDrag(newPosX, newPosY);
    };
    const onUp = e => {
      e.preventDefault();
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  innerHTML = () => {
    var parser = new DOMParser;
    var dom = parser.parseFromString(
        '<!doctype html><body>' + this.props.innerHTML,
        'text/html');
    var decodedString = dom.body.textContent;
    return decodedString;
  }

  render() {
    const {
      styles: {
        position: { centerX, centerY },
        size: { width, height },
        transform: { rotateAngle }
      },
      zoomable,
      rotatable,
      parentRotateAngle,
      showController,
      selected,
      scale,
      src,
      _id,
      scaleX,
      scaleY,
      zIndex,
      onTextChange,
      innerHTML,
      childrens,
      objectType,
      outlineWidth,
      onFontSizeChange,
      handleFontColorChange,
      handleFontFaceChange,
      handleChildIdSelected,
      childId,
      cropMode,
      enableCropMode,
      imgWidth,
      imgHeight,
      imgColor,
      showImage,
      backgroundColor,
    } = this.props;

    var newWidth = width;
    var newHeight = height;
    var style = {
      width: Math.abs(newWidth),
      height: Math.abs(newHeight),
      zIndex: selected ? 101 : 100,
      cursor: selected ? 'move' : null,
      outline: !showImage ? `rgb(1, 159, 182) ${objectType === 2 ? 'dotted' : 'solid'} ${2/scale}px` : null,
    };

    var opacity = this.props.opacity ? this.props.opacity / 100 : 1;

    const direction = zoomable
      .split(",")
      .map(d => d.trim())
      .filter(d => d); // TODO: may be speed up

    const imgResizeDirection = ["nw", "ne", "se", "sw"];

    var imgDirections = imgResizeDirection;
    if (objectType === 3 || objectType === 5 || objectType === 2) {
      imgDirections = direction;
    }


    var newWidth = width;
    var newHeight = height;

    return (
      <StyledRect
        ref={this.setElementRef}
        className="rect single-resizer"
        style={style}
      >
        {!cropMode && rotatable && showController && objectType !== 6 &&  (
          <div
            className="rotate-container"
            style={{
              width: 18 / scale + "px",
              height: 18 / scale + "px",
              left: `calc(50% - ${10 / scale}px)`,
              top: `-${30 / scale}px`
            }}
            onMouseDown={this.startRotate}
          >
            <div
              className="rotate"
              style={{ 
                transform: `scale(${1 / scale})`,
                padding: '3px',
              }}
            >
              <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.536 3.464A5 5 0 1 0 11 10l1.424 1.425a7 7 0 1 1-.475-9.374L13.659.34A.2.2 0 0 1 14 .483V5.5a.5.5 0 0 1-.5.5H8.483a.2.2 0 0 1-.142-.341l2.195-2.195z"
                  fillRule="nonzero"
                />
              </svg>
            </div>
          </div>
        )}

        {!cropMode && showController && objectType !== 6 &&
          imgDirections.map(d => {
            const cursor = `${getCursor(
              0,
              d
            )}-resize`;
            return (
              <div
                key={d}
                style={{
                  cursor,
                  transform: `scale(${1 / scale})`
                }}
                className={`${zoomableMap[d]} resizable-handler-container`}
                onMouseDown={e => this.startResize(e, cursor)}
              >
                <div
                  key={d}
                  style={{ cursor }}
                  className={`${zoomableMap[d]} resizable-handler`}
                  onMouseDown={e => this.startResize(e, cursor)}
                />
              </div>
            );
          })}
        <div
          id={_id}
          onMouseDown={!selected || (src && !cropMode) ? this.startDrag : this.handleImageDrag.bind(this)}
          style={{
            // zIndex: selected && objectType !== 4 ? 1 : 0,
            zIndex: 999999,
            transformOrigin: "0 0",
            transform: src ? null : `scaleX(${scaleX}) scaleY(${scaleY})`,
            position: "absolute",
            width: width / (src ? 1 : scaleX) + "px",
            height: height / (src ? 1 : scaleY) + "px",
            // outline: selected ? `rgb(1, 159, 182) solid ${outlineWidth / scale}px` : null,
          }}
        >
          {childrens && childrens.length > 0 && showImage && (
            <div
              id="hello-3"
              style={{
                width: "100%",
                height: "100%"
              }}
            >
              {childrens.map(child => {
                const styles = tLToCenter({
                  top: child.top,
                  left: child.left,
                  width: child.width,
                  height: child.height,
                  rotateAngle: child.rotateAngle
                });
                const {
                  position: { centerX, centerY },
                  transform: { rotateAngle }
                } = styles;
                return (
                  <div
                    key={child._id}
                    style={{
                      zIndex: selected && objectType !== 4 ? 1 : 0,
                      left: child.left,
                      top: child.top,
                      position: 'absolute',
                      width: width * child.width2 / scaleX,
                      // height: height * child.height2 / scaleY,
                      height: child.height,
                      outline: selected && childId === child._id ? `rgb(1, 159, 182) solid ${2/scale}px` : null,
                      transform: `rotate(${rotateAngle}deg)`,
                      opacity: opacity,
                    }}
                    className="text-container"
                  >
                    
                    <SingleText
                      selectionScaleY={this.state.selectionScaleY}
                      zIndex={zIndex}
                      scaleX={child.scaleX}
                      scaleY={child.scaleY}
                      parentScaleX={scaleX}
                      parentScaleY={scaleY}
                      width={width * child.width2 / scaleX / child.scaleX}
                      height={child.height}
                      centerX={centerX / child.scaleX}
                      centerY={centerY / child.scaleY}
                      rotateAngle={rotateAngle}
                      parentIndex={_id}
                      innerHTML={child.innerHTML}
                      _id={child._id}
                      selected={selected}
                      onInput={onTextChange}
                      onBlur={this.endEditing.bind(this)}
                      onMouseDown={this.startEditing.bind(this)}
                      outlineWidth={outlineWidth}
                      onFontSizeChange={(fontSize, scaleY) => {console.log('onFontSizeChange'); onFontSizeChange(fontSize * this.props.scaleY); this.startEditing(scaleY)}}
                      handleFontColorChange={handleFontColorChange}
                      handleFontFaceChange={handleFontFaceChange}
                      handleChildIdSelected={handleChildIdSelected}
                      childId={childId}
                    />
                  </div>
                );
              })}{" "}
            </div>
          )}
          {childrens && childrens.length > 0 && !showImage && (
            <div
              id="hello-2"
              style={{
                width: "100%",
                height: "100%"
              }}
            >
              {childrens.map(child => {
                const styles = tLToCenter({
                  top: child.top,
                  left: child.left,
                  width: child.width,
                  height: child.height,
                  rotateAngle: child.rotateAngle
                });
                const {
                  position: { centerX, centerY },
                  transform: { rotateAngle }
                } = styles;
                return (
                  <div
                    key={child._id}
                    style={{
                      zIndex: selected && objectType !== 4 ? 1 : 0,
                      left: child.left,
                      top: child.top,
                      position: 'absolute',
                      width: width * child.width2 / scaleX,
                      // height: height * child.height2 / scaleY,
                      height: child.height,
                      outline: selected && childId === child._id ? `rgb(1, 159, 182) solid ${2/scale/Math.min(scaleX, scaleY)}px` : null,
                      transform: `rotate(${rotateAngle}deg)`,
                      opacity: opacity,
                    }}
                    className="text-container"
                  >
                    
                    <SingleText
                      zIndex={zIndex}
                      scaleX={child.scaleX}
                      scaleY={child.scaleY}
                      parentScaleX={scaleX}
                      parentScaleY={scaleY}
                      width={width * child.width2 / scaleX / child.scaleX}
                      height={child.height}
                      centerX={centerX / child.scaleX}
                      centerY={centerY / child.scaleY}
                      rotateAngle={rotateAngle}
                      parentIndex={_id}
                      innerHTML={child.innerHTML}
                      _id={child._id}
                      selected={selected}
                      onInput={onTextChange}
                      onBlur={this.endEditing.bind(this)}
                      onMouseDown={this.startEditing.bind(this)}
                      outlineWidth={outlineWidth}
                      onFontSizeChange={(fontSize, scaleY) => {console.log('onFontSizeChange'); onFontSizeChange(fontSize * this.props.scaleY); this.startEditing(scaleY)}}
                      handleFontColorChange={handleFontColorChange}
                      handleFontFaceChange={handleFontFaceChange}
                      handleChildIdSelected={handleChildIdSelected}
                      childId={childId}
                    />
                  </div>
                );
              })}{" "}
            </div>
          )}
          {cropMode && <div id="halo1" style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}>
          {!showImage && cropMode && showController && objectType !== 6 &&
          imgResizeDirection.map((d, i) => {
            const cursor = `${getCursor(
              rotateAngle + parentRotateAngle,
              d
            )}-resize`;
            return (
              <div
                key={d}
                style={{
                  cursor,
                  transform: `rotate(${i*90}deg) scale(${1 / scale})`,
                  zIndex: 2,
                }}
                className={`${zoomableMap[d]} resizable-handler-container cropMode`}
                onMouseDown={e => this.startResizeInnerImage(e, cursor)}
              >
                <svg className={`${zoomableMap[d]}`} width={24} height={24} style={{zIndex: -1}} viewBox="0 0 24 24">
    <defs>
        <path id="_619015639__b" d="M10 18.95a2.51 2.51 0 0 1-3-2.45v-7a2.5 2.5 0 0 1 2.74-2.49L10 7h6a3 3 0 0 1 3 3h-9v8.95z"></path>
        <filter id="_619015639__a" width="250%" height="250%" x="-75%" y="-66.7%" filterUnits="objectBoundingBox">
            <feMorphology in="SourceAlpha" operator="dilate" radius=".5" result="shadowSpreadOuter1"></feMorphology>
            <feOffset in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
            <feColorMatrix in="shadowOffsetOuter1" result="shadowMatrixOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0"></feColorMatrix>
            <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter2"></feOffset>
            <feGaussianBlur in="shadowOffsetOuter2" result="shadowBlurOuter2" stdDeviation="2.5"></feGaussianBlur>
            <feColorMatrix in="shadowBlurOuter2" result="shadowMatrixOuter2" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix>
            <feMerge>
                <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
                <feMergeNode in="shadowMatrixOuter2"></feMergeNode>
            </feMerge>
        </filter>
    </defs>
    <g fill="none" fill-rule="evenodd">
        <use className={`${zoomableMap[d]}`} style={{fill: "#000", filter: "url(#_619015639__a)"}} xlinkHref="#_619015639__a" ></use>
        <use className={`${zoomableMap[d]}`} style={{fill: "#FFF"}} xlinkHref="#_619015639__b"></use>
    </g>
</svg>       
              </div>
            );
          })}
        </div>}
          {!showImage && cropMode && selected &&
            <div
            style={{
              transform: `translate(${this.props.posX}px, ${this.props.posY}px)`,
              width: imgWidth + 'px',
              height: imgHeight + 'px',
              zIndex: 999999,
            }} >
                {cropMode && selected ? imgResizeDirection.map(d => {
                  const cursor = `${getCursor(
                    rotateAngle + parentRotateAngle,
                    d
                  )}-resize`;
                  return (
                    <div
                      key={d}
                      style={{
                        cursor,
                        transform: `scaleX(${1 / scale}) scaleY(${1  / scale})`,
                        zIndex: 999999,
                      }}
                      className={`${zoomableMap[d]} resizable-handler-container hehe`}
                      onMouseDown={e => this.startResizeImage(e, cursor)}
                    >
                      <div
                        key={d}
                        style={{ cursor, zIndex: 999999, }}
                        className={`${zoomableMap[d]} resizable-handler`}
                        onMouseDown={e => this.startResizeImage(e, cursor)}
                      />
                    </div>
                  );
                }) : null}
            </div>
          }
          {(innerHTML && showImage) && (
            <div
              style={
                {
                }
              }
            >
              <div
                id={_id}
                style={{
                  position: "absolute",
                  width: width / scaleX + "px",
                  height: height / scaleY + "px",
                  transformOrigin: "0 0",
                  zIndex: selected ? 1 : 0
                }}
              >
                {selected && objectType === 5 && <div
                  id="hihi2"
                  spellCheck={false}
                  onInput={onTextChange}
                  contentEditable={selected}
                  ref={this.setTextElementRef.bind(this)}
                  onMouseDown={this.onMouseDown.bind(this)}
                  className="text single-text"
                  style={{
                    backgroundColor: 'rgb(0, 0, 0)',
                    position: "absolute",
                    right: '105%',
                    display: "inline-block",
                    width: width / scaleX + "px",
                    margin: "0px",
                    wordBreak: "break-word",
                    lineHeight: 1.42857,
                    borderColor: 'rgb(136, 136, 136)',
                    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 5px 5px',
                    color: 'white',
                    padding: '5px',
                  }}
                ></div>
                }
                {objectType === 5 && 
                  <MathJax.Context 
                    input='tex'
                    options={ {
                      asciimath2jax: {
                          useMathMLspacing: true,
                          delimiters: [["$$","$$"]],
                          preview: "none",
                          inlineMath: [['$','$'], ['\\(','\\)']],
                      }
                    } }
                    >
                  <div className="text2" style={{fontSize: '14px', color: imgColor}}>
                      {/* <MathJax.Node>{this.innerHTML()}</MathJax.Node> */}
                      <MathJax.Text text={ this.innerHTML() }/>
                  </div>
                </MathJax.Context>
                }
                {objectType === 3 &&  
                <div
                  id="hihi3"
                  spellCheck={false}
                  onInput={onTextChange}
                  contentEditable={selected}
                  ref={this.setTextElementRef.bind(this)}
                  onMouseDown={this.onMouseDown.bind(this)}
                  className="text single-text"
                  style={{
                    position: "absolute",
                    display: "inline-block",
                    width: width / scaleX + "px",
                    margin: "0px",
                    wordBreak: "break-word",
                    opacity,
                  }}
                ></div>
                }
              </div>
            </div>
          )}
          {(innerHTML && !showImage) && (
            <div
              style={
                {
                }
              }
            >
              <div
                id={_id}
                style={{
                  position: "absolute",
                  width: width / scaleX + "px",
                  height: height / scaleY + "px",
                  transformOrigin: "0 0",
                  zIndex: selected ? 1 : 0
                }}
              >
                {selected && objectType === 5 && <div
                  id="hihi2"
                  spellCheck={false}
                  onInput={onTextChange}
                  contentEditable={selected}
                  ref={this.setTextElementRef.bind(this)}
                  onMouseDown={this.onMouseDown.bind(this)}
                  className="text single-text"
                  style={{
                    backgroundColor: 'rgb(0, 0, 0)',
                    position: "absolute",
                    right: '105%',
                    display: "inline-block",
                    width: width / scaleX + "px",
                    margin: "0px",
                    wordBreak: "break-word",
                    lineHeight: 1.42857,
                    borderColor: 'rgb(136, 136, 136)',
                    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 5px 5px',
                    color: 'white',
                    padding: '5px',
                  }}
                ></div>
                }
                {objectType === 5 && 
                  <MathJax.Context 
                  input='tex'
                  options={ {
                    asciimath2jax: {
                        useMathMLspacing: true,
                        delimiters: [["$$","$$"]],
                        preview: "none",
                        inlineMath: [['$','$'], ['\\(','\\)']],
                    }
                  } }
                  >
                <div className="text2" style={{fontSize: '14px', color: imgColor}}>
                    {/* <MathJax.Node>{this.innerHTML()}</MathJax.Node> */}
                    <MathJax.Text text={ this.innerHTML() }/>
                </div>
              </MathJax.Context>
                }
                {objectType === 3 &&  
                <div
                  id="hihi3"
                  spellCheck={false}
                  onInput={onTextChange}
                  contentEditable={selected}
                  ref={this.setTextElementRef.bind(this)}
                  onMouseDown={this.onMouseDown.bind(this)}
                  className="text single-text"
                  style={{
                    position: "absolute",
                    display: "inline-block",
                    width: width / scaleX + "px",
                    margin: "0px",
                    wordBreak: "break-word",
                    opacity,
                  }}
                ></div>
                }
              </div>
            </div>
          )}
        </div>
        {src && (objectType === 4 || objectType === 6) &&
        <div
          id={_id}
          onMouseDown={!selected || src ? this.startDrag : null}
          style={{
            zIndex: selected && objectType !== 4 ? 1 : 0,
            transformOrigin: "0 0",
            position: "absolute",
            width: width / (src ? 1 : scaleX) + "px",
            height: height / (src ? 1 : scaleY) + "px",
          }}
        >
          <div
            id="test"
            style={{
              width: width / (src ? 1 : scaleX) + "px",
              height: height / (src ? 1 : scaleY) + "px",
              position: 'absolute',
            }} >
          </div>
          <div
            style={{
              width: width / (src ? 1 : scaleX) + "px",
              height: height / (src ? 1 : scaleY) + "px",
              position: 'absolute',
              overflow: !this.props.bleed && 'hidden',
              opacity,
            }} >
            {showImage &&
            <img
            id="1235"
            style={{
              width: imgWidth + 'px',
              height: imgHeight + 'px',
              transform: `translate(${this.props.posX}px, ${this.props.posY}px)`,
              opacity: selected || !cropMode ? 1 : 0.5,
              outline: cropMode && selected ? `rgb(1, 159, 182) solid ${outlineWidth-1}px` : null,
              transformOrigin: '0 0',
              backgroundColor: backgroundColor,
            }}
          onDoubleClick={enableCropMode}
          onMouseDown={cropMode ? this.handleImageDrag.bind(this) : null}
          src={src} />
            }
            </div>
            <div
            style={{
              width: width / (src ? 1 : scaleX) + "px",
              height: height / (src ? 1 : scaleY) + "px",
              position: 'absolute',
            }} >
            {(!showImage && cropMode && selected) &&
            <img
            id="1236"
            style={{
              width: imgWidth + 'px',
              height: imgHeight + 'px',
              transform: `translate(${this.props.posX}px, ${this.props.posY}px)`,
              opacity: 0.7,
              outline: cropMode && selected ? `rgb(1, 159, 182) solid ${outlineWidth-1}px` : null,
              transformOrigin: '0 0',
            }}
          onDoubleClick={enableCropMode}
          onMouseDown={cropMode ? this.handleImageDrag.bind(this) : null}
          src={src} />
            }
          </div>
          <div
            style={{
              width: width / (src ? 1 : scaleX) + "px",
              height: height / (src ? 1 : scaleY) + "px",
              position: 'absolute',
              overflow: !this.props.bleed && 'hidden',
            }} >
            {(!showImage && cropMode) &&
            <img
            id="1234"
            style={{
              width: imgWidth + 'px',
              height: imgHeight + 'px',
              transform: `translate(${this.props.posX}px, ${this.props.posY}px)`,
              opacity: 1,
              outline: cropMode && selected ? `rgb(1, 159, 182) solid ${outlineWidth-1}px` : null,
              transformOrigin: '0 0',
            }}
          onDoubleClick={enableCropMode}
          onMouseDown={cropMode ? this.handleImageDrag.bind(this) : null}
          src={src} />
            }
          </div>
        </div>}
        {src && objectType === 7 &&
        <div
          id={_id}
          onMouseDown={!selected || src ? this.startDrag : null}
          style={{
            zIndex: selected ? 1 : 0,
            transformOrigin: "0 0",
            position: "absolute",
            width: width / (src ? 1 : scaleX) + "px",
            height: height / (src ? 1 : scaleY) + "px",
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              transform: `translate(${this.props.posX}px, ${this.props.posY}px)`,
              width: imgWidth + 'px',
              height: imgHeight + 'px',
            }} >
              {showController && cropMode && selected && imgResizeDirection.map(d => {
                const cursor = `${getCursor(
                  rotateAngle + parentRotateAngle,
                  d
                )}-resize`;
                return (
                  <div
                    key={d}
                    style={{
                      cursor,
                      transform: `scaleX(${1 / scale}) scaleY(${1 / scale})`
                    }}
                    className={`${zoomableMap[d]} resizable-handler-container hehe`}
                    onMouseDown={e => this.startResizeImage(e, cursor)}
                  >
                    <div
                      key={d}
                      style={{ cursor }}
                      className={`${zoomableMap[d]} resizable-handler`}
                      onMouseDown={e => this.startResizeImage(e, cursor)}
                    />
                  </div>
                );
              })}
            <video 
              style={{
                width: '100%',
                height: '100%',
                transformOrigin: '0 0',
                outline: cropMode ? `rgb(1, 159, 182) solid ${outlineWidth-1}px` : null,
                opacity,
              }}
            muted loop autoPlay preload="none" width="560" height="320"><source src={src} type="video/webm"/></video>
          </div>
        </div>}
      </StyledRect>
    );
  }
}
