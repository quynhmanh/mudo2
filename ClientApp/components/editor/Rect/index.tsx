import React, { PureComponent } from "react";
import { getLength, getAngle, getCursor, tLToCenter } from "@Utils";
import StyledRect from "./StyledRect";
import SingleText from "@Components/editor/Text/SingleText";
import MathJax from "react-mathjax2";


// const tex = `f(x) = \\int_{-\\infty}^\\infty\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi`;

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

declare global {
  interface Window {
    paymentScope: any;
    resizingInnerImage: any;
    startX: any;
    startY: any;
    rect: any;
    rect2: any;
  }
}

export interface IProps {
  dragging: boolean;
  id: string;
  childId: string;
  _id: string;
  scale: number;
  styles: any;
  imgStyles: any;
  onDragStart(e: any, _id: string): void;
  onRotateStart(e): void;
  onRotate(angle: number, startAngle: number, e: any): void;
  onRotateEnd(_id: string): void;
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
    fontSize: number
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
    e: any
  ): void;
  onResizeEnd(fontSize): void;

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
  updateRect: boolean;
  imgColor: string;
  hidden: boolean;
  showImage: boolean;
  bleed: boolean;
  backgroundColor: string;
  opacity: number;
  resizing: boolean;
  rotating: boolean;
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
    posY: 0
  };

  componentDidMount() {
    if (this.props.innerHTML && this.$textEle) {
      this.$textEle.innerHTML = this.props.innerHTML;
    }
    if (this.props.innerHTML && this.$textEle2) {
      this.$textEle2.innerHTML = this.props.innerHTML;
    }

    this.startEditing = this.startEditing.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.objectType === 3 &&
      this.props.selected &&
      !prevProps.selected
    ) {
      this.$textEle2.innerHTML = this.props.innerHTML;
    }
  }

  // Drag
  startDrag = e => {
    if (this.props.cropMode) {
      this.handleImageDrag(e);
      return;
    }
    this.props.onDragStart && this.props.onDragStart(e, this.props._id);
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
    this.props.onRotateStart && this.props.onRotateStart(e);
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
      this.props.onRotate(angle, startAngle, e);
    };
    const onUp = e => {
      e.preventDefault();
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      if (!this._isMouseDown) return;
      this._isMouseDown = false;
      this.props.onRotateEnd && this.props.onRotateEnd(this.props._id);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  startResizeImage = (e, cursor, resizingInnerImage) => {
    console.log("startResizeImage ", window.resizingInnerImage);
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
    window.rect = { width, height, centerX, centerY, rotateAngle };
    window.rect2 = { imgWidth, imgHeight, imgCenterX, imgCenterY, imgRotateAngle };
    const { clientX: startX, clientY: startY } = e;
    const type = e.target.getAttribute("class").split(" ")[0];
    this.props.onResizeInnerImageStart &&
      this.props.onResizeInnerImageStart(startX, startY);
    window.resizingInnerImage = resizingInnerImage;
    this._isMouseDown = true;
    var self = this;
    // this.props.onResizeInnerImageStart(startX, startY);
    
    var eeee = document.getElementById('screen-container-parent');
    // eeee._click = events.click;
    var a = eeee.click;
    console.log('eeee ', eeee.onclick);
    eeee.onclick = null;
 
    const onMove = e => {
      e.preventDefault();
      if (!this._isMouseDown) return; // patch: fix windows press win key during mouseup issue
      e.stopImmediatePropagation();
      const { clientX, clientY } = e;
      const deltaX = clientX - window.startX;
      const deltaY = clientY - window.startY;
      const alpha = Math.atan2(deltaY, deltaX);
      const deltaL = getLength(deltaX, deltaY);
      const isShiftKey = e.shiftKey;
      if (!window.resizingInnerImage) {
        this.props.onResize(
          deltaL,
          alpha,
          window.rect,
          type,
          isShiftKey,
          cursor,
          objectType,
          e,
          this.props.backgroundColor,
          null
        );
      } else {
        this.props.onImageResize(
          deltaL,
          alpha,
          window.rect2,
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
      this.props.onResizeEnd && this.props.onResizeEnd(null);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);

    // eeee.click = a;
  };

  startResizeInnerImage = (e, cursor) => {
    console.log("startResizeInnerImage");
    e.preventDefault();
    e.stopPropagation();
    // if (e.button !== 0) return;
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
    window.rect = { width, height, centerX, centerY, rotateAngle };
    window.rect2 = {
      imgWidth,
      imgHeight,
      imgCenterX,
      imgCenterY,
      imgRotateAngle
    };
    const type = e.target.getAttribute("class").split(" ")[0];
    this.props.onResizeStart && this.props.onResizeStart(startX, startY);
    this._isMouseDown = true;
    var self = this;
    const onMove = e => {
      e.preventDefault();
      // if (!this._isMouseDown) return; // patch: fix windows press win key during mouseup issue
      e.stopImmediatePropagation();
      const { clientX, clientY } = e;
      // const deltaX = clientX - this.props.startX;
      // const deltaY = clientY - this.props.startY;
      const deltaX = clientX - window.startX;
      const deltaY = clientY - window.startY;
      const alpha = Math.atan2(deltaY, deltaX);
      const deltaL = getLength(deltaX, deltaY);
      const isShiftKey = e.shiftKey;
      if (!window.resizingInnerImage) {
        this.props.onResize(
          deltaL,
          alpha,
          window.rect,
          type,
          isShiftKey,
          cursor,
          objectType,
          e,
          this.props.backgroundColor,
          null
        );
      } else {
        this.props.onImageResize(
          deltaL,
          alpha,
          window.rect2,
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
      this.props.onResizeEnd && this.props.onResizeEnd(null);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  // Resize
  startResize = (e, cursor) => {
    console.log("startResize");
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
    if (this.props.objectType !== 4 && this.props.objectType !== 9) {
      var selectionScaleY = 1;
      if (self.state && self.state.selectionScaleY) {
        selectionScaleY = self.state.selectionScaleY;
      }

      if (this.props.childId) {
        selectionScaleY = this.props.childrens.find(
          child => child._id === this.props.childId
        ).scaleY;
      }

      var a = document.getSelection();
      if (a && a.type === "Range") {
      } else {
        var id = this.props.childId ? this.props.childId : this.props._id;
        var el = document.getElementById(id).getElementsByClassName("font")[0];
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
        var a = document.getSelection();
        size = window.getComputedStyle(el, null).getPropertyValue("font-size");
        res =
          parseInt(size.substring(0, size.length - 2)) *
          selectionScaleY *
          self.props.scaleY;
        sel.removeAllRanges();
      }

      // document.getElementById("fontSizeButton").innerText = `${res}px`;
      // self.props.onFontSizeChange(res);
    }

    const { clientX: startX, clientY: startY } = e;
    const type = e.target.getAttribute("class").split(" ")[0];
    this.props.onResizeStart && this.props.onResizeStart(startX, startY);
    this._isMouseDown = true;
    var fontSize;
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
        res
      );

      if (this.props.objectType !== 4 && this.props.objectType !== 9) {
        var scaleY = (window as any).scaleY;
        fontSize =
          parseInt(size.substring(0, size.length - 2)) *
          selectionScaleY *
          scaleY;
        document.getElementById("fontSizeButton").innerText = `${Math.round(
          fontSize * 10
        ) / 10}`;
      }
    };

    const onUp = e => {
      e.preventDefault();
      document.body.style.cursor = "auto";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      if (!this._isMouseDown) return;
      this._isMouseDown = false;
      this.props.onResizeEnd && this.props.onResizeEnd(fontSize);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  $textEle = null;
  $textEle2 = null;

  setTextElementRef = ref => {
    this.$textEle = ref;
  };

  setTextElementRef2 = ref => {
    this.$textEle2 = ref;
  };

  endEditing = e => {};

  startEditing = selectionScaleY => {
    this.setState({ selectionScaleY: 2 });
  };

  onMouseDown = () => {
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
        var el = document
          .getElementById(self.props._id)
          .getElementsByClassName("font")[0];
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
        var a = document.getSelection();
        size = window.getComputedStyle(el, null).getPropertyValue("font-size");
        fontFace = window
          .getComputedStyle(el, null)
          .getPropertyValue("font-family");
        fontColor = window.getComputedStyle(el, null).getPropertyValue("color");

        sel.removeAllRanges();
      }

      this.props.handleFontFaceChange(fontFace);
      this.props.handleFontColorChange(fontColor);

      var fontSize =
        parseInt(size.substring(0, size.length - 2)) *
        selectionScaleY *
        self.props.scaleY;
      document.getElementById("fontSizeButton").innerText = `${Math.round(
        fontSize * 10
      ) / 10}`;
    }
  };

  handleImageDrag = e => {
    console.log('handleImageDrag ');
    var self = this;
    let { clientX: startX, clientY: startY } = e;
    var { posX, posY, scale } = this.props;
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
      this.props.onDragEnd && this.props.onDragEnd();
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  innerHTML = () => {
    var parser = new DOMParser();
    var dom = parser.parseFromString(
      "<!doctype html><body>" + this.props.innerHTML,
      "text/html"
    );
    var decodedString = dom.body.textContent;
    return decodedString;
  };

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
      id,
      dragging,
      resizing,
      rotating
    } = this.props;

    var newWidth = width;
    var newHeight = height;
    var outlineWidth2 = Math.max(2, 2 / scale);
    var style = {
      width: Math.abs(newWidth),
      height: Math.abs(newHeight),
      zIndex: selected ? 101 : 100,
      cursor: selected ? "move" : null,
      outline:
        !showImage &&
        (selected
          ? `#00d9e1 ${objectType === 2 ? "dotted" : "solid"} ${2}px`
          : null)
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

    return (
      <StyledRect
        id={id}
        ref={this.setElementRef}
        className={`${_id}rect-alo ${_id}-styledrect rect single-resizer ${selected &&
          "selected"}`}
        style={style}
        dragging={dragging}
        resizing={resizing}
        rotating={rotating}
        outlineWidth={outlineWidth2}
        cropMode={cropMode}
      >
        {!cropMode && rotatable && showController && objectType !== 6 && (
          <div
            className="rotate-container"
            style={{
              width: "18px",
              height: "18px",
              left: `calc(50% - 6}px)`,
              bottom: "-35px"
            }}
            onMouseDown={this.startRotate}
          >
            <div
              className="rotate"
              style={{
                // transform: `scale(${1 / scale + 0.15})`,
                padding: "3px"
              }}
            >
              <svg
                style={{
                  transform: "scale(0.9)"
                }}
                width="14"
                height="14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.536 3.464A5 5 0 1 0 11 10l1.424 1.425a7 7 0 1 1-.475-9.374L13.659.34A.2.2 0 0 1 14 .483V5.5a.5.5 0 0 1-.5.5H8.483a.2.2 0 0 1-.142-.341l2.195-2.195z"
                  fillRule="nonzero"
                />
              </svg>
            </div>
          </div>
        )}

        {!cropMode &&
          showController &&
          objectType !== 6 &&
          imgDirections.map(d => {
            var cursor;
            var normalizedRotateAngle = rotateAngle;
            if (d == "n") {
              normalizedRotateAngle = normalizedRotateAngle + 45;
            }
            else if (d == "ne") {
              normalizedRotateAngle = normalizedRotateAngle + 90;
            }
            else if (d == "e") {
              normalizedRotateAngle = normalizedRotateAngle + 135;
            } else if (d == "es") {
              normalizedRotateAngle = normalizedRotateAngle + 180;
            } else if (d == "s") {
              normalizedRotateAngle = normalizedRotateAngle + 225;
            } else if (d == "sw") {
              normalizedRotateAngle = normalizedRotateAngle + 270;
            } else if (d == "w") {
              normalizedRotateAngle = normalizedRotateAngle + 315;
            }
            normalizedRotateAngle = normalizedRotateAngle % 180;
            if(normalizedRotateAngle >= 0 && normalizedRotateAngle < 8) {
              cursor = '-webkit-image-set(url(https://static.canva.com/web/images/7ea01757f820a9fb828312dcf38cb746.png) 1x,url(https://static.canva.com/web/images/2c4ec45151de402865dffaaa087ded3c.png) 2x) 12 12,auto';
            }
            if(normalizedRotateAngle >= 8 && normalizedRotateAngle < 23) {
              cursor = '-webkit-image-set(url(https://static.canva.com/web/images/4434684d762b5dea2ff268f549a43269.png) 1x,url(https://static.canva.com/web/images/9b8ad9e061f825e77d1b97b71ffde9a4.png) 2x) 12 12,auto';
            }
            if(normalizedRotateAngle >= 23 && normalizedRotateAngle < 38) {
              cursor = '-webkit-image-set(url(https://static.canva.com/web/images/02d2d3984af99ad512694e82a689a9a8.png) 1x,url(https://static.canva.com/web/images/d2bb4fd0691527a4fd01a55d1ebb6f87.png) 2x) 12 12,auto';
            }
            if(normalizedRotateAngle >= 38 && normalizedRotateAngle < 53) {
              cursor = '-webkit-image-set(url(https://static.canva.com/web/images/5e315937d3456710f9684f89c7860ea8.png) 1x,url(https://static.canva.com/web/images/a3609c7d7315d7301c3832d7e76e7974.png) 2x) 12 12,auto';
            }
            if(normalizedRotateAngle >= 53 && normalizedRotateAngle < 68) {
              cursor = '-webkit-image-set(url(https://static.canva.com/web/images/ba88e3ebda4fdf44251c3fa36faec38e.png) 1x,url(https://static.canva.com/web/images/13d7d7347a19703627af6dc4c7e584aa.png) 2x) 12 12,auto';
            }
            if(normalizedRotateAngle >= 68 && normalizedRotateAngle < 83) {
              cursor = '-webkit-image-set(url(https://static.canva.com/web/images/1766922605e07ad48762f0578f23cd73.png) 1x,url(https://static.canva.com/web/images/16fdd75b90535598d4379c348bc9d39e.png) 2x) 12 12,auto';
            }
            if(normalizedRotateAngle >= 83 && normalizedRotateAngle < 98) {
              cursor = '-webkit-image-set(url(https://static.canva.com/web/images/d78cdce65d153748ffd0fb1a5573ac75.png) 1x,url(https://static.canva.com/web/images/ce13b386dbba73815423332724d3030a.png) 2x) 12 12,auto';
            }
            if(normalizedRotateAngle >= 98 && normalizedRotateAngle < 113) {
              cursor = '-webkit-image-set(url(https://static.canva.com/web/images/cf19806f9578c66128338be1742c67f9.png) 1x,url(https://static.canva.com/web/images/90f8d3f4bc588410bd1d218455116b41.png) 2x) 12 12,auto';
            }
            if(normalizedRotateAngle >= 113 && normalizedRotateAngle < 128) {
              cursor = '-webkit-image-set(url(https://static.canva.com/web/images/4dba7d81ce991e1546824042615cc1ef.png) 1x,url(https://static.canva.com/web/images/aed44f2fbd5cdfa5bf5d896df50dbffa.png) 2x) 12 12,auto';
            }
            if(normalizedRotateAngle >= 128 && normalizedRotateAngle < 143) {
              cursor = '-webkit-image-set(url(https://static.canva.com/web/images/159a13980e4a0d0a470a49f8d35eb5a6.png) 1x,url(https://static.canva.com/web/images/4ecfddb1ae830056cfa9144f81c83295.png) 2x) 12 12,auto';
            }
            if(normalizedRotateAngle >= 143 && normalizedRotateAngle < 158) {
              cursor = '-webkit-image-set(url(https://static.canva.com/web/images/a9079684178c3a8c1e37c4343524330b.png) 1x,url(https://static.canva.com/web/images/7d1ef78c7ac2fd9eca288126c98dc20e.png) 2x) 12 12,auto';
            }
            if(normalizedRotateAngle >= 158 && normalizedRotateAngle < 173) {
              cursor = '-webkit-image-set(url(https://static.canva.com/web/images/7ea01757f820a9fb828312dcf38cb746.png) 1x,url(https://static.canva.com/web/images/2c4ec45151de402865dffaaa087ded3c.png) 2x) 12 12,auto';
            }
            
            return (
              <div
                id={d}
                key={d}
                style={{
                  cursor
                  // transform: `scale(${1 / scale + 0.15})`
                }}
                className={`${zoomableMap[d]} resizable-handler-container`}
                onMouseDown={e => this.startResize(e, d)}
              >
                <div
                  id={d}
                  key={d}
                  style={{ 
                    cursor
                  }}
                  className={`${zoomableMap[d]} resizable-handler`}
                  onMouseDown={e => this.startResize(e, d)}
                />
              </div>
            );
          })}
        {objectType === 3 && !selected && (
          <div
            className={_id + "scaleX-scaleY"}
            onMouseDown={e => {
              e.preventDefault();
              this.startDrag(e);
            }}
            // onMouseDown={this.onMouseDown.bind(this)}
            style={{
              // zIndex: selected && objectType !== 4 ? 1 : 0,
              zIndex: 9999999,
              transformOrigin: "0 0",
              transform: src ? null : `scaleX(${scaleX}) scaleY(${scaleY})`,
              position: "absolute",
              width: width / (src ? 1 : scaleX) + "px",
              height: height / (src ? 1 : scaleY) + "px"
              // outline: selected ? `rgb(1, 159, 182) solid ${outlineWidth / scale}px` : null,
            }}
          ></div>
        )}
        <div
          id={_id}
          className={src ? null : _id + "scaleX-scaleY"}
          onMouseDown={this.startDrag}
          style={{
            // zIndex: selected && objectType !== 4 ? 1 : 0,
            // zIndex: 999999,
            transformOrigin: "0 0",
            transform: src ? null : `scaleX(${scaleX}) scaleY(${scaleY})`,
            position: "absolute",
            width: width / (src ? 1 : scaleX) + "px",
            height: height / (src ? 1 : scaleY) + "px"
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
                      position: "absolute",
                      width: (width * child.width2) / scaleX,
                      // height: height * child.height2 / scaleY,
                      height: child.height,
                      outline:
                        selected && childId === child._id
                          ? `#00d9e1 solid ${2 / scale}px`
                          : null,
                      transform: `rotate(${rotateAngle}deg)`,
                      opacity: opacity
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
                      width={(width * child.width2) / scaleX / child.scaleX}
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
                      onFontSizeChange={(fontSize, scaleY) => {
                        onFontSizeChange(fontSize * this.props.scaleY);
                        this.startEditing(scaleY);
                      }}
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
                      position: "absolute",
                      width: (width * child.width2) / scaleX,
                      // height: height * child.height2 / scaleY,
                      height: child.height,
                      outline:
                        selected && childId === child._id
                          ? `#00d9e1 solid ${2 /
                              scale /
                              Math.min(scaleX, scaleY)}px`
                          : null,
                      transform: `rotate(${rotateAngle}deg)`,
                      opacity: opacity
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
                      width={(width * child.width2) / scaleX / child.scaleX}
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
                      onFontSizeChange={(fontSize, scaleY) => {
                        onFontSizeChange(fontSize * this.props.scaleY);
                        this.startEditing(scaleY);
                      }}
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
          {cropMode && (
            <div
              id="halo1"
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                outline:
                  cropMode && selected ? "rgb(0, 217, 225) solid 2px" : "none"
              }}
            >
              {!showImage &&
                cropMode &&
                showController &&
                objectType !== 6 &&
                imgResizeDirection.map((d, i) => {
                  const cursor = `${getCursor(
                    rotateAngle + parentRotateAngle,
                    d
                  )}-resize`;
                  return (
                    <div
                      id={_id + zoomableMap[d]}
                      key={d}
                      style={{
                        cursor,
                        // transform: `rotate(${i * 90}deg) scale(${1 / scale})`,
                        transform: `rotate(${i * 90}deg)`,
                        zIndex: 2
                      }}
                      className={`${zoomableMap[d]} resizable-handler-container cropMode`}
                      onMouseDown={e => {
                        this.startResizeImage(e, cursor, false);
                      }}
                    >
                      <svg
                        className={`${zoomableMap[d]}`}
                        width={24}
                        height={24}
                        style={{ zIndex: -1 }}
                        viewBox="0 0 24 24"
                      >
                        <defs>
                          <path
                            id="_619015639__b"
                            d="M10 18.95a2.51 2.51 0 0 1-3-2.45v-7a2.5 2.5 0 0 1 2.74-2.49L10 7h6a3 3 0 0 1 3 3h-9v8.95z"
                          ></path>
                          <filter
                            id="_619015639__a"
                            width="250%"
                            height="250%"
                            x="-75%"
                            y="-66.7%"
                            filterUnits="objectBoundingBox"
                          >
                            <feMorphology
                              in="SourceAlpha"
                              operator="dilate"
                              radius=".5"
                              result="shadowSpreadOuter1"
                            ></feMorphology>
                            <feOffset
                              in="shadowSpreadOuter1"
                              result="shadowOffsetOuter1"
                            ></feOffset>
                            <feColorMatrix
                              in="shadowOffsetOuter1"
                              result="shadowMatrixOuter1"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0"
                            ></feColorMatrix>
                            <feOffset
                              dy="1"
                              in="SourceAlpha"
                              result="shadowOffsetOuter2"
                            ></feOffset>
                            <feGaussianBlur
                              in="shadowOffsetOuter2"
                              result="shadowBlurOuter2"
                              stdDeviation="2.5"
                            ></feGaussianBlur>
                            <feColorMatrix
                              in="shadowBlurOuter2"
                              result="shadowMatrixOuter2"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                            ></feColorMatrix>
                            <feMerge>
                              <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
                              <feMergeNode in="shadowMatrixOuter2"></feMergeNode>
                            </feMerge>
                          </filter>
                        </defs>
                        <g fill="none" fillRule="evenodd">
                          <use
                            className={`${zoomableMap[d]}`}
                            style={{
                              fill: "#000",
                              filter: "url(#_619015639__a)"
                            }}
                            xlinkHref="#_619015639__a"
                          ></use>
                          <use
                            className={`${zoomableMap[d]}`}
                            style={{ fill: "#FFF" }}
                            xlinkHref="#_619015639__b"
                          ></use>
                        </g>
                      </svg>
                    </div>
                  );
                })}
            </div>
          )}
          {!showImage && cropMode && selected && (
            <div
              id={_id + "1237"}
              style={{
                transform: `translate(${this.props.posX}px, ${this.props.posY}px)`,
                width: imgWidth + "px",
                height: imgHeight + "px",
                zIndex: 999999,
                outline:
                  cropMode && selected ? "rgb(0, 217, 225) solid 2px" : "none"
              }}
            >
              {cropMode && selected
                ? imgResizeDirection.map(d => {
                    const cursor = `${getCursor(
                      rotateAngle + parentRotateAngle,
                      d
                    )}-resize`;
                    return (
                      <div
                        key={d}
                        style={{
                          cursor,
                          // transform: `scaleX(${1 / scale}) scaleY(${1 /
                          //   scale})`,
                          zIndex: 999999
                        }}
                        id={_id + zoomableMap[d] + "_"}
                        className={`${zoomableMap[d]} resizable-handler-container hehe`}
                        onMouseDown={e => this.startResizeImage(e, d, true)}
                      >
                        <div
                          key={d}
                          style={{ cursor, zIndex: 999999 }}
                          className={`${zoomableMap[d]} resizable-handler`}
                          onMouseDown={e => this.startResizeImage(e, d, true)}
                        />
                      </div>
                    );
                  })
                : null}
            </div>
          )}
          {innerHTML && showImage && (
            <div style={{}}>
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
                {selected && objectType === 5 && (
                  <div
                    id="hihi2"
                    spellCheck={false}
                    onInput={onTextChange}
                    contentEditable={selected}
                    ref={this.setTextElementRef.bind(this)}
                    onMouseDown={this.onMouseDown.bind(this)}
                    className="text single-text"
                    style={{
                      backgroundColor: "rgb(0, 0, 0)",
                      position: "absolute",
                      right: "105%",
                      display: "inline-block",
                      width: width / scaleX + "px",
                      margin: "0px",
                      wordBreak: "break-word",
                      lineHeight: 1.42857,
                      borderColor: "rgb(136, 136, 136)",
                      boxShadow: "rgba(0, 0, 0, 0.3) 0px 5px 5px",
                      color: "white",
                      padding: "5px"
                    }}
                  ></div>
                )}
                {objectType === 5 && (
                  <MathJax.Context
                    input="tex"
                    options={{
                      asciimath2jax: {
                        useMathMLspacing: true,
                        delimiters: [["$$", "$$"]],
                        preview: "none",
                        inlineMath: [["$", "$"], ["\\(", "\\)"]]
                      }
                    }}
                  >
                    <div
                      className="text2"
                      style={{ fontSize: "14px", color: imgColor }}
                    >
                      {/* <MathJax.Node>{this.innerHTML()}</MathJax.Node> */}
                      <MathJax.Text text={this.innerHTML()} />
                    </div>
                  </MathJax.Context>
                )}
                {objectType === 3 && showImage && (
                  <div
                    id="hihi3"
                    spellCheck={false}
                    onInput={onTextChange}
                    contentEditable={selected}
                    ref={this.setTextElementRef2.bind(this)}
                    onMouseDown={this.onMouseDown.bind(this)}
                    className="text single-text"
                    style={{
                      position: "absolute",
                      display: "inline-block",
                      width: width / scaleX / scale + "px",
                      margin: "0px",
                      wordBreak: "break-word",
                      opacity,
                      transform: `scale(${scale})`,
                      transformOrigin: "0 0"
                    }}
                  ></div>
                )}
              </div>
            </div>
          )}
          {innerHTML && !showImage && (
            <div style={{}}>
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
                {selected && objectType === 5 && (
                  <div
                    id="hihi2"
                    spellCheck={false}
                    onInput={onTextChange}
                    contentEditable={selected}
                    ref={this.setTextElementRef.bind(this)}
                    onMouseDown={this.onMouseDown.bind(this)}
                    className="text single-text"
                    style={{
                      backgroundColor: "rgb(0, 0, 0)",
                      position: "absolute",
                      right: "105%",
                      display: "inline-block",
                      width: width / scaleX + "px",
                      margin: "0px",
                      wordBreak: "break-word",
                      lineHeight: 1.42857,
                      borderColor: "rgb(136, 136, 136)",
                      boxShadow: "rgba(0, 0, 0, 0.3) 0px 5px 5px",
                      color: "white",
                      padding: "5px"
                    }}
                  ></div>
                )}
                {objectType === 5 && (
                  <MathJax.Context
                    input="tex"
                    options={{
                      asciimath2jax: {
                        useMathMLspacing: true,
                        delimiters: [["$$", "$$"]],
                        preview: "none",
                        inlineMath: [["$", "$"], ["\\(", "\\)"]]
                      }
                    }}
                  >
                    <div
                      className="text2"
                      style={{ fontSize: "14px", color: imgColor }}
                    >
                      {/* <MathJax.Node>{this.innerHTML()}</MathJax.Node> */}
                      <MathJax.Text text={this.innerHTML()} />
                    </div>
                  </MathJax.Context>
                )}
                {objectType === 3 && selected && (
                  <div
                    id="hihi3"
                    spellCheck={false}
                    onInput={onTextChange}
                    contentEditable={selected}
                    ref={this.setTextElementRef2.bind(this)}
                    onMouseDown={this.onMouseDown.bind(this)}
                    className="text single-text"
                    style={{
                      position: "absolute",
                      display: "inline-block",
                      width: width / scaleX / scale + "px",
                      margin: "0px",
                      wordBreak: "break-word",
                      opacity,
                      transform: `scale(${scale})`,
                      transformOrigin: "0 0"
                    }}
                  ></div>
                )}
              </div>
            </div>
          )}
        </div>
        {src && (objectType === 4 || objectType === 6 || objectType === 9) && (
          <div
            id={_id}
            className={_id + "rect-alo"}
            onMouseDown={!selected || src ? this.startDrag : null}
            style={{
              zIndex: selected && objectType !== 4 ? 1 : 0,
              transformOrigin: "0 0",
              position: "absolute",
              width: width / (src ? 1 : scaleX) + "px",
              height: height / (src ? 1 : scaleY) + "px"
            }}
          >
            <div
              id="test"
              className={_id + "rect-alo"}
              style={{
                width: width / (src ? 1 : scaleX) + "px",
                height: height / (src ? 1 : scaleY) + "px",
                position: "absolute"
              }}
            ></div>
            <div
              id={_id + "_____"}
              className={_id + "rect-alo"}
              style={{
                width: width / (src ? 1 : scaleX) + "px",
                height: height / (src ? 1 : scaleY) + "px",
                position: "absolute",
                overflow: !this.props.bleed && "hidden",
                opacity
              }}
            >
              {
                (showImage || (!showImage && cropMode)) && 
                (objectType === 4 || objectType === 6) && (
                <img
                  id={_id + "1235"}
                  className={_id + "rect-alo"}
                  style={{
                    width: imgWidth + "px",
                    height: imgHeight + "px",
                    transform: `translate(${this.props.posX}px, ${this.props.posY}px)`,
                    opacity: selected || !cropMode ? 1 : 0.5,
                    outline:
                      cropMode && selected
                        ? `#00d9e1 solid ${outlineWidth - 1}px`
                        : null,
                    transformOrigin: "0 0",
                    backgroundColor: backgroundColor
                  }}
                  onDoubleClick={enableCropMode}
                  onMouseDown={
                    cropMode ? this.handleImageDrag.bind(this) : null
                  }
                  src={src}
                />
              )}
            </div>
            <div
              id={_id + "123"}
              className={_id + "rect-alo"}
              style={{
                width: width / (src ? 1 : scaleX) + "px",
                height: height / (src ? 1 : scaleY) + "px",
                position: "absolute"
              }}
            >
              {(showImage || (!showImage && cropMode)) 
              && selected && (
                <div
                  id={_id + "1236"}
                  className={_id + "1236"}
                  style={{
                    width: this.props.imgWidth + "px",
                    height: this.props.imgHeight + "px",
                    transform: `translate(${this.props.posX}px, ${this.props.posY}px)`,
                    outline: cropMode && selected ? `#00d9e1 solid 2px` : null
                  }}
                >
                  { (objectType === 4 || objectType === 6) && cropMode &&
                  <img
                    // id={_id + "1236"}
                    className={_id + "rect-alo"}
                    style={{
                      width: this.props.imgWidth + "px",
                      height: this.props.imgHeight + "px",
                      // transform: `translate(${this.props.posX}px, ${this.props.posY}px)`,
                      opacity: 0.5,
                      outline:
                        cropMode && selected ? `#00d9e1 solid 2px` : null,
                      transformOrigin: "0 0"
                    }}
                    onDoubleClick={enableCropMode}
                    onMouseDown={
                      cropMode ? this.handleImageDrag.bind(this) : null
                    }
                    src={src}
                  />
                  }
                  { (objectType === 9) && cropMode &&
                    <video
                    // id={_id + "1236"}
                    className={_id + "rect-alo"}
                    style={{
                      width: this.props.imgWidth + "px",
                      height: this.props.imgHeight + "px",
                      // transform: `translate(${this.props.posX}px, ${this.props.posY}px)`,
                      opacity: 0.5,
                      outline:
                        cropMode && selected ? `#00d9e1 solid 2px` : null,
                      transformOrigin: "0 0"
                    }}
                    onDoubleClick={enableCropMode}
                    onMouseDown={
                      cropMode ? this.handleImageDrag.bind(this) : null
                    }
                    src={src}
                  />
                  }
                </div>
              )}
            </div>
          </div>
        )}
        {src && objectType === 9 && showImage && (
          <div
            id={_id}
            onMouseDown={!selected || src ? this.startDrag : null}
            style={{
              zIndex: selected ? 1 : 0,
              transformOrigin: "0 0",
              position: "absolute",
              width: width / (src ? 1 : scaleX) + "px",
              height: height / (src ? 1 : scaleY) + "px",
              overflow: "hidden"
            }}
          >
            <div
              id={_id + "1238"}
              className={_id + "rect-alo"}
              style={{
                transform: `translate(${this.props.posX}px, ${this.props.posY}px)`,
                width: imgWidth + "px",
                height: imgHeight + "px"
              }}
            >
              {showController &&
                cropMode &&
                selected &&
                imgResizeDirection.map(d => {
                  const cursor = `${getCursor(
                    rotateAngle + parentRotateAngle,
                    d
                  )}-resize`;
                  return (
                    <div
                      key={d}
                      style={{
                        cursor
                        // transform: `scaleX(${1 / scale}) scaleY(${1 / scale})`
                      }}
                      className={`${zoomableMap[d]} resizable-handler-container hehe`}
                      onMouseDown={e => this.startResizeImage(e, cursor, true)}
                    >
                      <div
                        key={d}
                        style={{ cursor }}
                        className={`${zoomableMap[d]} resizable-handler`}
                        onMouseDown={e => this.startResizeImage(e, cursor, true)}
                      />
                    </div>
                  );
                })}
              <video
                style={{
                  width: "100%",
                  height: "100%",
                  transformOrigin: "0 0",
                  outline: cropMode
                    ? `#00d9e1 solid ${outlineWidth - 1}px`
                    : null,
                  opacity
                }}
                muted
                loop
                autoPlay
                preload="none"
                width="560"
                height="320"
              >
                <source src={src} type="video/webm" />
              </video>
            </div>
          </div>
        )}
      </StyledRect>
    );
  }
}
