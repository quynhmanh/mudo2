import React, { PureComponent } from "react";
import { getCursorStyleWithRotateAngle, getCursorStyleForResizer, getCursor, tLToCenter, getImageResizerVisibility, } from "@Utils";
import StyledRect from "./StyledRect";
import SingleText from "@Components/editor/Text/SingleText";
import Image from "@Components/editor/Rect/Image";
import { toJS } from "mobx";
import { TemplateType } from "../enums";
import editorStore from "@Store/EditorStore";

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
  selected: boolean;
  dragging: boolean;
  id: string;
  childId: string;
  scale: number;
  onRotateStart(e): void;
  onResizeStart: any;
  handleResizeInnerImageStart: any;
  zoomable: string;
  parentRotateAngle: number;
  showController: boolean;
  updateStartPos: boolean;
  src: string;
  left: number;
  onTextChange: any;
  outlineWidth: number;
  onFontSizeChange(fontSize: number): void;
  handleFontColorChange(fontColor: string): void;
  handleFontFaceChange(fontFace: string): void;
  handleChildIdSelected(childId: string): void;
  cropMode: boolean;
  enableCropMode(e: any): void;
  updateRect: boolean;
  hidden: boolean;
  showImage: boolean;
  bleed: boolean;
  resizing: boolean;
  rotating: boolean;
  hovered: boolean;
  image: any;
  srcThumnail: any;
  downloading: boolean;
  name: string;
  canvas: string;
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
    const {
      image: {
        innerHTML,
      }
    } = this.props;
    if (innerHTML && this.$textEle) {
      this.$textEle.innerHTML = innerHTML;
    }
    if (innerHTML && this.$textEle2) {
      this.$textEle2.innerHTML = innerHTML;
    }

    this.startEditing = this.startEditing.bind(this);
  }

  componentDidUpdate(prevProps) {
    const {
      selected,
      image: {
        type,
        // selected,
        innerHTML,
      }
    } = this.props;

    if (
      type === TemplateType.Heading &&
      // selected && 
      // !prevProps.image.selected &&
      selected != prevProps.image.selected &&
      this.$textEle2
    ) {
      this.$textEle2.innerHTML = innerHTML;
    }
  }

  startRotate = e => {
    this.props.onRotateStart && this.props.onRotateStart(e);
  };

  startResizeImage = (e, cursor, resizingInnerImage) => {
    e.preventDefault();
    e.stopPropagation();
    document.body.style.cursor = cursor;

    this.props.handleResizeInnerImageStart &&
      this.props.handleResizeInnerImageStart(e, cursor);
    window.resizingInnerImage = resizingInnerImage;
  };

  startResize = (e, cursor) => {
    e.preventDefault();

    var res;
    var size;
    // if (this.props.objectType !== 4 && this.props.objectType !== 9) {
    //   var selectionScaleY = 1;
    //   if (self.state && self.state.selectionScaleY) {
    //     selectionScaleY = self.state.selectionScaleY;
    //   }

    //   if (this.props.childId) {
    //     selectionScaleY = this.props.childrens.find(
    //       child => child._id === this.props.childId
    //     ).scaleY;
    //   }

    //   var a = document.getSelection();
    //   if (a && a.type === "Range") {
    //   } else {
    //     var id = this.props.childId ? this.props.childId : this.props._id;
    //     var el = document.getElementById(id).getElementsByClassName("font")[0];
    //     var sel = window.getSelection();
    //     var range = document.createRange();
    //     range.selectNodeContents(el);
    //     sel.removeAllRanges();
    //     sel.addRange(range);
    //     var a = document.getSelection();
    //     size = window.getComputedStyle(el, null).getPropertyValue("font-size");
    //     res =
    //       parseInt(size.substring(0, size.length - 2)) *
    //       selectionScaleY *
    //       self.props.scaleY;
    //     sel.removeAllRanges();
    //   }

    //   // document.getElementById("fontSizeButton").innerText = `${res}px`;
    //   // self.props.onFontSizeChange(res);
    // }

    this.props.onResizeStart && this.props.onResizeStart(e, cursor);
  };

  $textEle = null;
  $textEle2 = null;

  setTextElementRef = ref => {
    this.$textEle = ref;
  };

  setTextElementRef2 = ref => {
    this.$textEle2 = ref;
  };

  endEditing = e => { };

  startEditing = selectionScaleY => {
    this.setState({ selectionScaleY: 2 });
  };

  onMouseDown = () => {
    const {
      image: {
        type,
        _id,
        scaleY,
      }
    } = this.props;

    var self = this;
    var size;
    var fontFace;
    var fontColor;
    if (type !== 4) {
      var selectionScaleY = 1;
      if (self.state && self.state.selectionScaleY) {
        selectionScaleY = self.state.selectionScaleY;
      }

      var a = document.getSelection();
      if (a && a.type === "Range") {
      } else {
        // var el = document.getElementById(self.props._id).getElementsByClassName('font')[0];
        var el = document
          .getElementById(_id)
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
        scaleY;
      (document.getElementById("fontSizeButton") as HTMLInputElement).value = `${Math.round(fontSize)}`;
    }
  };

  innerHTML = () => {
    const {
      image: {
        innerHTML,
      }
    } = this.props;
    var parser = new DOMParser();
    var dom = parser.parseFromString(
      "<!doctype html><body>" + innerHTML,
      "text/html"
    );
    var decodedString = dom.body.textContent;
    return decodedString;
  };

  render() {
    const {
      zoomable,
      parentRotateAngle,
      showController,
      scale,
      src,
      onTextChange,
      outlineWidth,
      onFontSizeChange,
      handleFontColorChange,
      handleFontFaceChange,
      handleChildIdSelected,
      childId,
      cropMode,
      enableCropMode,
      showImage,
      id,
      dragging,
      resizing,
      rotating,
      hovered,
      selected,
      name,
      canvas,
      image: {
        selected: imageSelected,
        _id,
        scaleX,
        scaleY,
        zIndex,
        innerHTML,
        document_object: childrens,
        type: objectType,
        imgColor,
        backgroundColor,
        opacity: opacity2,
        top,
        effectId,
        width,
        height,
        fontFace,
        italic,
        align,
        bold,
        color,
        rotateAngle,
        srcThumnail,
        posX: posX2,
        posY: posY2,
        imgWidth: imgWidth2,
        imgHeight: imgHeight2,
        downloading, 
        textShadowTransparent,
        filter,
        intensity,
        offSet,
        direction: effectDirection,
        blur,
        lineHeight,
        letterSpacing,
        fontSize,
      }
    } = this.props;

    let rotatable = true;

    const imgWidth = imgWidth2 * scale;
    const imgHeight = imgHeight2 * scale;
    const posX = posX2 * scale;
    const posY = posY2 * scale;

    let style = {
      width: "100%",
      height: "100%",
      // outline: hovered && "#00d9e1 solid 2px"
    };

    let opacity = opacity2 ? opacity2 / 100 : 1;

    const direction = zoomable
      .split(",")
      .map(d => d.trim())
      .filter(d => d); // TODO: may be speed up

    const imgResizeDirection = ["nw", "ne", "se", "sw"];

    var imgDirections = imgResizeDirection;
    if (objectType === TemplateType.Heading || objectType === TemplateType.TextTemplate || objectType === TemplateType.Latex) {
      imgDirections = direction;
    }

    if (height * scale <= 30) {
      imgDirections = imgDirections.filter(d => d != "w" && d != "e")
    }

    if (width * scale <= 30) {
      imgDirections = imgDirections.filter(d => d != "n" && d != "s")
    }


    return (
      <div>
        {(hovered || selected) && !cropMode && objectType != TemplateType.BackgroundImage &&
        <div 
          className="hideWhenDownload"
          style={{
            position: "absolute",
            top: "-2px",
            left: "-2px",
            right: "-2px",
            bottom: "-2px",
            backgroundImage: 
              objectType == TemplateType.TextTemplate ? `linear-gradient(90deg,#00d9e1 60%,transparent 0),linear-gradient(180deg,#00d9e1 60%,transparent 0),linear-gradient(90deg,#00d9e1 60%,transparent 0),linear-gradient(180deg,#00d9e1 60%,transparent 0)`
              :'linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1),linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1)',
            backgroundPosition: 'top,100%,bottom,0',
            backgroundSize: '12px 2px,2px 12px,12px 2px,2px 12px',
            backgroundRepeat: 'repeat-x,repeat-y,repeat-x,repeat-y',
          }}>

        </div>}
      <StyledRect
        id={id + hovered ? "hovered" : ""}
        ref={this.setElementRef}
        className={`${_id}rect-alo ${_id}-styledrect rect single-resizer ${selected &&
          "selected"}`}
        style={style}
        dragging={dragging}
        resizing={resizing}
        rotating={rotating}
        cropMode={cropMode}
      >
        {!cropMode && rotatable && showController && objectType !== TemplateType.BackgroundImage && (
          <div
            id={_id + "rotate-container"}
            className="rotate-container"
            style={{
              width: "18px",
              height: "18px",
              left: `calc(50% - 6}px)`,
              bottom: "-35px",
              cursor: getCursorStyleWithRotateAngle(rotateAngle),
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
          objectType !== TemplateType.BackgroundImage &&
          imgDirections.map(d => {
            var cursor = getCursorStyleForResizer(rotateAngle, d);

            return (
              <div
                id={d}
                key={d}
                style={{
                  cursor
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
        {/* {objectType === 3 && !selected && (
          <div
            className={_id + "scaleX-scaleY"}
            style={{
              zIndex: 9999999,
              transformOrigin: "0 0",
              transform: src ? null : `scaleX(${scaleX}) scaleY(${scaleY})`,
              position: "absolute"
            }}
          ></div>
        )} */}
        {((!imageSelected && !selected && name != "imgHovered") ||
         (imageSelected && !selected && name == "all-images") || 
         (name=="imgSelected" && cropMode) ||
         name == "downloadImages") && src && (objectType === TemplateType.Image || objectType === TemplateType.BackgroundImage) && (
          <div
            id={_id}
            className={_id + "rect-alo"}
            style={{
              zIndex: selected && objectType !== TemplateType.Image && objectType !== TemplateType.BackgroundImage ? 1 : 0,
              transformOrigin: "0 0",
              position: "absolute",
              width: "100%",
              height: "100%"
            }}
          >
            {/* {showImage && */}
              <div
                id={_id + "hihi4"}
                className={_id + "rect-alo"}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  overflow: !this.props.bleed && "hidden",
                  opacity,
                }}
              >
                <Image 
                  canvas={canvas}
                  _id={_id}
                  imgWidth={imgWidth}
                  imgHeight={imgHeight}
                  posX={posX}
                  posY={posY}
                  selected={selected}
                  cropMode={cropMode}
                  outlineWidth={outlineWidth}
                  backgroundColor={backgroundColor}
                  src={src}
                  enableCropMode={enableCropMode}
                  srcThumnail={srcThumnail}
                  downloading={downloading}
                />
              </div>
            {imageSelected && cropMode && (
              <div
                id={_id + "123"}
                className={_id + "rect-alo"}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute"
                }}
              >
                <div
                  id={_id + "1236"}
                  className={_id + "1236" + " " + _id + "imgWidth"}
                  style={{
                    width: imgWidth + "px",
                    height: imgHeight + "px",
                    transform: `translate(${posX}px, ${posY}px)`
                  }}
                >
                  {(objectType === TemplateType.Image || objectType === TemplateType.BackgroundImage) && (
                    <img
                      className={_id + "rect-alo"}
                      style={{
                        width: "100%",
                        height: "100%",
                        opacity: 0.5,
                        transformOrigin: "0 0"
                      }}
                      onDoubleClick={enableCropMode}
                      src={src}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {((showImage && !selected) || (!showImage && selected)) && 
        (objectType === TemplateType.Image || objectType === TemplateType.BackgroundImage) &&
          <div
            id={_id + "654"}
            className={_id + "scaleX-scaleY"}
            style={{
              transformOrigin: "0 0",
              transform: src ? null : `scaleX(${scaleX}) scaleY(${scaleY})`,
              position: "absolute",
              // width: `calc(100%/${scaleX})`,
              // height: `calc(100%/${scaleY})`,
              width: '100%',
              height: '100%',
              backgroundColor: color,
            }}
          >
            {!showImage && cropMode && selected && (
              <div
                id={_id + "1237"}
                className={`${_id}imgWidth ${_id}1236`}
                style={{
                  transform: `translate(${posX}px, ${posY}px)`,
                  width: imgWidth + "px",
                  height: imgHeight + "px",
                  zIndex: 999999,
                  outline:
                    cropMode && selected ? "rgba(0, 217, 225, 0.75) solid 2px" : "none"
                }}
              >
                {cropMode && selected
                  ? imgResizeDirection
                    .map(d => {
                      let cursor = getCursorStyleForResizer(rotateAngle, d);
                      let visibility = objectType === TemplateType.BackgroundImage ? "visible" : getImageResizerVisibility(this.props.image, scale, d);
                      return (
                        <div
                          key={d}
                          style={{
                            cursor,
                            zIndex: 999999,
                            visibility,
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
          </div>
        }
        {((showImage && !selected) || (!showImage && selected)) && (objectType === TemplateType.Heading || objectType == TemplateType.TextTemplate) &&
          <div
            // className={_id + "scaleX-scaleY"}
            style={{
              transformOrigin: "0 0",
              // transform: src ? null : `scaleX(${scaleX}) scaleY(${scaleY})`,
              position: "absolute",
              width: `calc(100% + 2px)`,
              height: `calc(100% + 2px)`,
              left: "-1px",
              top: "-1px",
              // width: '100%',
              // height: '100%',
            }}
          >
            <div 
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}>
            {childrens && childrens.length > 0 && (childrens.map(child => (
              <div
                id={child._id + "b2"}
                className={_id + child._id + "b2"}
                style={{
                    left: `calc(${child.left/width * scaleX*100}% - 1px)`,
                    top: `calc(${child.top/(child.height / child.height2)*100}% - 1px)`,
                    position: "absolute",
                    width: `calc(${child.width2 * 100}% + 2px)`,
                    height: `calc(${child.height2 * 100}% + 2px)`,
                    backgroundImage: selected && childId === child._id && 'linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1),linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1)',
                    backgroundPosition: 'top,100%,bottom,0',
                    backgroundRepeat: 'repeat-x,repeat-y,repeat-x,repeat-y',
                    backgroundSize: '12px 2px,2px 12px,12px 2px,2px 12px',
                }}>
                
              </div>)))
            }
            </div>
          </div>
        }
        {((showImage && !selected) || (!showImage && selected)) && (objectType === TemplateType.Heading || objectType == TemplateType.TextTemplate) &&
          <div
            id={_id + "654"}
            className={_id + "scaleX-scaleY"}
            style={{
              transformOrigin: "0 0",
              transform: src ? null : `scaleX(${scaleX}) scaleY(${scaleY})`,
              position: "absolute",
              width: `calc(100%/${scaleX})`,
              height: `calc(100%/${scaleY})`,
              // width: '100%',
              // height: '100%',
            }}
          >
            {/* {childrens && childrens.length > 0 && showImage && (
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
                      style={{
                        WebkitTextStroke: (child.effectId == 3 || child.effectId == 4) && (`${1.0 * child.hollowThickness / 100 * 4 + 0.1}px ${(child.effectId == 3 || child.effectId == 4) ? child.color : "black"}`),
                      }}
                    >
                      <div
                        id={child._id + "text-container"}
                        key={child._id}
                        style={{
                          zIndex: selected && objectType !== TemplateType.Image ? 1 : 0,
                          left: child.left * scale,
                          top: child.top * scale,
                          position: "absolute",
                          width: (width * child.width2) / scaleX * scale,
                          height: child.height * scale,
                          transform: `rotate(${rotateAngle}deg)`,
                          opacity: opacity,
                          fontFamily: `${child.fontFace}, AvenirNextRoundedPro`,
                          color: (child.effectId == 3 || child.effectId == 4) ? "transparent" : child.color,
                          textShadow: child.effectId == 1 ? `rgba(25, 25, 25, ${1.0 * child.textShadowTransparent / 100}) ${21.0 * child.offSet / 100 * Math.sin(child.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * child.offSet / 100 * Math.cos(child.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * child.blur / 100}px` :
                          child.effectId == 2 ? `rgba(0, 0, 0, ${0.6 * child.intensity}) 0 8.9px ${66.75 * child.intensity / 100}px` :
                          child.effectId == 4 ? `rgb(128, 128, 128) ${21.0 * child.offSet / 100 * Math.sin(child.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * child.offSet / 100 * Math.cos(child.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` : 
                          child.effectId == 5  ? `rgba(0, 0, 0, 0.5) ${21.0 * child.offSet / 100 * Math.sin(child.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * child.offSet / 100 * Math.cos(child.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * child.offSet / 100 * Math.sin(child.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * child.offSet / 100 * Math.cos(child.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
                          child.effectId == 6 && `rgb(0, 255, 255) ${21.0 * child.offSet / 100 * Math.sin(child.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * child.offSet / 100 * Math.cos(child.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * child.offSet / 100 * Math.sin(child.direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * child.offSet / 100 * Math.cos(child.direction * 3.6 / 360 * 2 * Math.PI))}px 0px` ,
                          filter: child.filter,
                          lineHeight: `${child.lineHeight * fontSize}px`,
                        }}
                        className="text-container"
                      >
                        <SingleText
                          selectionScaleY={this.state.selectionScaleY}
                          zIndex={zIndex}
                          fontFace={child.fontFace}
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
                            onFontSizeChange(fontSize * scaleY);
                            this.startEditing(scaleY);
                          }}
                          handleFontColorChange={handleFontColorChange}
                          handleFontFaceChange={handleFontFaceChange}
                          handleChildIdSelected={handleChildIdSelected}
                          childId={childId}
                          scale={scale}
                        />
                      </div>
                    </div>
                  );
                })}{" "}
              </div>
            )} */}
            {childrens && childrens.length > 0 &&
            ((imageSelected && selected) || (!imageSelected && !selected) || name == "downloadImages") &&
            // && !showImage && 
            (
              <div
                id={_id}
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
                      id={_id + child._id + "text-container3"}
                      style={{
                        WebkitTextStroke: (child.effectId == 3 || child.effectId == 4) && (`${1.0 * child.hollowThickness / 100 * 4 + 0.1}px ${(child.effectId == 3 || child.effectId == 4) ? child.color : "black"}`),
                      }}
                    >
                      <div
                      id={_id + child._id + "text-container2" + canvas}
                        key={child._id}
                        style={{
                          zIndex: selected && objectType !== TemplateType.Image ? 1 : 0,
                          left: child.left * scale,
                          top: child.top * scale,
                          position: "absolute",
                          width: (width * child.width2) / scaleX * scale,
                          height: child.height * scale,
                          transform: `rotate(${rotateAngle}deg)`,
                          opacity: opacity,
                          fontFamily: `${child.fontFace}, AvenirNextRoundedPro`,
                          color: (child.effectId == 3 || child.effectId == 4) ? "transparent" : child.color,
                          textShadow: child.effectId == 1 ? `rgba(25, 25, 25, ${1.0 * child.textShadowTransparent / 100}) ${21.0 * child.offSet / 100 * Math.sin(child.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * child.offSet / 100 * Math.cos(child.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * child.blur / 100}px` :
                          child.effectId == 2 ? `rgba(0, 0, 0, ${0.6 * child.intensity}) 0 8.9px ${66.75 * child.intensity / 100}px` :
                          child.effectId == 4 ? `rgb(128, 128, 128) ${21.0 * child.offSet / 100 * Math.sin(child.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * child.offSet / 100 * Math.cos(child.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` : 
                          child.effectId == 5  ? `rgba(0, 0, 0, 0.5) ${21.0 * child.offSet / 100 * Math.sin(child.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * child.offSet / 100 * Math.cos(child.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * child.offSet / 100 * Math.sin(child.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * child.offSet / 100 * Math.cos(child.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
                          child.effectId == 6 && `rgb(0, 255, 255) ${21.0 * child.offSet / 100 * Math.sin(child.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * child.offSet / 100 * Math.cos(child.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * child.offSet / 100 * Math.sin(child.direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * child.offSet / 100 * Math.cos(child.direction * 3.6 / 360 * 2 * Math.PI))}px 0px` ,
                          filter: child.filter,
                          lineHeight: `${child.lineHeight * child.fontSize}px`,
                          fontStyle: child.italic ? "italic" : "",
                          fontWeight: child.bold ? "bold" : "normal",
                          letterSpacing: `${1.0*child.letterSpacing/100*4}px`,
                        }}
                        className="text-container"
                      >
                        <SingleText
                          textAlign={child.align}
                          fontFace={child.fontFace}
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
                          _id={_id + child._id + canvas}
                          selected={selected}
                          onInput={onTextChange}
                          onBlur={this.endEditing.bind(this)}
                          onMouseDown={this.startEditing.bind(this)}
                          outlineWidth={outlineWidth}
                          onFontSizeChange={(fontSize, scaleY) => {
                            onFontSizeChange(fontSize * scaleY);
                            this.startEditing(scaleY);
                          }}
                          handleFontColorChange={handleFontColorChange}
                          handleFontFaceChange={handleFontFaceChange}
                          handleChildIdSelected={handleChildIdSelected}
                          childId={child._id}
                          scale={scale}
                        />
                      </div>
                    </div>
                  );
                })}{" "}
              </div>
            )}
            {!showImage && cropMode && selected && (
              <div
                id={_id + "1237"}
                className={`${_id}imgWidth ${_id}1236 7`}
                style={{
                  transform: `translate(${posX}px, ${posY}px)`,
                  width: imgWidth + "px",
                  height: imgHeight + "px",
                  zIndex: 999999,
                  outline:
                    cropMode && selected ? "rgba(0, 217, 225, 0.75) solid 2px" : "none"
                }}
              >
                {cropMode && selected
                  ? imgResizeDirection.map(d => {
                    let cursor = getCursorStyleForResizer(rotateAngle, d);
                    return (
                      <div
                        key={d}
                        style={{
                          cursor,
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
            {innerHTML && (
              <div style={{}}>
                <div
                  id={_id}
                  className={_id + "hihi5"}
                  style={{
                    position: "absolute",
                    width: width * scale / scaleX + "px",
                    height: height * scale / scaleY + "px",
                    transformOrigin: "0 0",
                    zIndex: selected ? 1 : 0,
                    WebkitTextStroke: (effectId == 3 || effectId == 4) && (`${1.0 * this.props.image.hollowThickness / 100 * 4 + 0.1}px ${(effectId == 3 || effectId == 4) ? color : "black"}`),
                    // textStroke,
                  }}
                >
                  {/* {selected && objectType === 5 && (
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
                      <MathJax.Text text={this.innerHTML()} />
                    </div>
                  </MathJax.Context>
                )} */}
                  {
                  // ((_id == editorStore.idObjectSelected && selected) || (!selected && _id != editorStore.idObjectSelected)) && 
                  ((imageSelected && selected) || (!imageSelected && !selected) || name == "downloadImages" || name == "imgHovered") &&
                  objectType === TemplateType.Heading &&
                    <div
                      id={_id + "hihi4" + canvas}
                      spellCheck={false}
                      onInput={onTextChange}
                      contentEditable={selected}
                      ref={this.setTextElementRef2.bind(this)}
                      // onMouseDown={this.onMouseDown.bind(this)}
                      className={"text single-text " + _id + "hihi4" + canvas}
                      style={{
                        position: "absolute",
                        display: "inline-block",
                        width: width / scaleX + "px",
                        margin: "0px",
                        wordBreak: "break-word",
                        opacity,
                        transform: `scale(${scale})`,
                        transformOrigin: "0 0",
                        fontFamily: `${fontFace}, AvenirNextRoundedPro`,
                        fontStyle: italic ? "italic" : "",
                        fontWeight: bold ? "bold" : "normal",
                        textAlign: align,
                        color: (effectId == 3 || effectId == 4) ? "transparent" : color,
                        textShadow: effectId == 1 ? `rgba(25, 25, 25, ${1.0 * textShadowTransparent / 100}) ${21.0 * offSet / 100 * Math.sin(effectDirection * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * offSet / 100 * Math.cos(effectDirection * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * blur / 100}px` :
                        effectId == 2 ? `rgba(0, 0, 0, ${0.6 * intensity}) 0 8.9px ${66.75 * intensity / 100}px` : 
                        effectId == 4 ? `rgb(128, 128, 128) ${21.0 * offSet / 100 * Math.sin(effectDirection * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * offSet / 100 * Math.cos(effectDirection * 3.6 / 360 * 2 * Math.PI)}px 0px` : 
                        effectId == 5  ? `rgba(0, 0, 0, 0.5) ${21.0 * offSet / 100 * Math.sin(effectDirection * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * offSet / 100 * Math.cos(effectDirection * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * offSet / 100 * Math.sin(effectDirection * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * offSet / 100 * Math.cos(effectDirection * 3.6 / 360 * 2 * Math.PI)}px 0px` :
                        effectId == 6 && `rgb(0, 255, 255) ${21.0 * offSet / 100 * Math.sin(effectDirection * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * offSet / 100 * Math.cos(effectDirection * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * offSet / 100 * Math.sin(effectDirection * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * offSet / 100 * Math.cos(effectDirection * 3.6 / 360 * 2 * Math.PI))}px 0px` ,
                        filter: filter,
                        lineHeight: `${lineHeight * fontSize}px`,
                        letterSpacing: `${1.0*letterSpacing/100*4}px`,
                      }}
                    ></div>
                  }
                </div>
              </div>
            )}

          </div>
        }
        {cropMode && selected && showController && objectType !== TemplateType.BackgroundImage && (
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
            {imgResizeDirection.map((d, i) => {
              var cursor = getCursorStyleForResizer(rotateAngle, d);
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
                    this.startResizeImage(e, d, false);
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
        {src && objectType === TemplateType.Video && showImage && (
          <div
            id={_id}
            style={{
              zIndex: selected ? 1 : 0,
              transformOrigin: "0 0",
              position: "absolute",
              width: "100%",
              height: "100%",
              overflow: "hidden"
            }}
          >
            <div
              id={_id + "1238"}
              className={_id + "rect-alo" + " " + _id + "imgWidth"}
              style={{
                transform: `translate(${posX}px, ${posY}px)`,
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
                      }}
                      className={`${zoomableMap[d]} resizable-handler-container hehe`}
                      onMouseDown={e => this.startResizeImage(e, d, true)}
                    >
                      <div
                        key={d}
                        style={{ cursor }}
                        className={`${zoomableMap[d]} resizable-handler`}
                        onMouseDown={e =>
                          this.startResizeImage(e, d, true)
                        }
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
      </div>
    );
  }
}
