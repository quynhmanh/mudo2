import React, { Component } from "react";
import { getCursorStyleWithRotateAngle, getCursorStyleForResizer, tLToCenter, getImageResizerVisibility, } from "@Utils";
import StyledRect from "./StyledRect";
import SingleText from "@Components/editor/Text/SingleText";
import Image from "@Components/editor/Rect/Image";
import Video from "@Components/editor/Rect/Video";
import { TemplateType, CanvasType, } from "../enums";
import editorStore from "@Store/EditorStore";
import { clone } from "lodash";

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

let timer = 0;
let delay = 200;
let prevent = false;

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
  id: string;
  childId: string;
  scale: number;
  onRotateStart(e): void;
  onResizeStart: any;
  handleResizeInnerImageStart: any;
  parentRotateAngle: number;
  showController: boolean;
  onTextChange: any;
  outlineWidth: number;
  onFontSizeChange(fontSize: number): void;
  handleFontColorChange(fontColor: string): void;
  handleFontFaceChange(fontFace: string): void;
  handleChildIdSelected(childId: string): void;
  cropMode: boolean;
  enableCropMode: any;
  showImage: boolean;
  bleed: boolean;
  image: any;
  name: any;
  canvas: string;
  toggleVideo: any;
  handleImageSelected: any;
  handleImageHovered: any;
  handleImageUnhovered: any;
  handleDragStart: any;
  doNoObjectSelected: any;
  handleCropBtnClick: any;
}

export interface IState {
  editing: boolean;
  selectionScaleX: number;
  selectionScaleY: number;
  paused: boolean;
  videoControllerShow: boolean;
  image: any;
  cropMode: boolean;
}

export default class Rect extends Component<IProps, IState> {

  constructor(props) {
    super(props);

    this.state = {
      videoControllerShow: false,
      editing: false,
      selectionScaleX: null,
      selectionScaleY: null,
      image: clone(props.image),
      cropMode: false,
      paused: props.image.paused,
    }

    this.handleImageSelected = this.handleImageSelected.bind(this);
    this.handleImageUnselected = this.handleImageUnselected.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.enableCropMode = this.enableCropMode.bind(this);
  }

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
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.scale != nextProps.scale) {
      return true;
    }
    if (this.state.image.selected || nextState.image.selected) {
      return true;
    }
    if (this.state.image.hovered || nextState.image.hovered) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps, prevState) {

    const {
      // selected,
      image: {
        type,
        selected,
        innerHTML,
      }
    } = this.state;


    if (
      type === TemplateType.Heading &&
      // selected && 
      // !prevProps.image.selected &&
      selected != prevState.image.selected &&
      this.$textEle2
    ) {
      this.$textEle2.innerHTML = innerHTML;
    }
  }

  toggleVideo = () => {
    this.setState({paused: !this.state.paused});
    this.forceUpdate();
  }

  startRotate = e => {
    e.preventDefault();
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

  pauseVideo = () => {
    let el = document.getElementById(this.props.image._id + "video" + "alo") as HTMLVideoElement;
    el.pause();
    this.setState({
      paused: true,
    })
  }

  playVideo = () => {
    let el = document.getElementById(this.props.image._id + "video" + "alo") as HTMLVideoElement;
    el.play();
    this.setState({
      paused: false,
    })
  }

  doClickAction() {
  }
  doDoubleClickAction() {
  }

  handleClick() {
    let me = this;
    timer = setTimeout(function() {
      if (!prevent) {
        me.doClickAction();
      }
      prevent = false;
    }, delay);
  }

  handleDoubleClick(){
    clearTimeout(timer);
    prevent = true;
    this.doDoubleClickAction();
  }

  handleImageSelected() {
    if (this.hideWhenDownload)
      this.hideWhenDownload.style.opacity = 1;
    let image = clone(this.state.image);
    image.selected = true;
    image.hovered = true;

    this.setState({
      image,
    });

    this.forceUpdate();
  }

  handleImageHovered() {
      if (this.hideWhenDownload)
        this.hideWhenDownload.style.opacity = 1;

    let image = clone(this.state.image);
    image.hovered = true;

    this.setState({
      image,
    });

    this.forceUpdate();
  }

  handleImageUnhovered() {
    let image = clone(this.state.image);
    image.hovered = false;

    this.setState({
      image,
    });

    this.forceUpdate();
  }

  handleImageUnselected() {
    let image = clone(this.state.image);
    image.selected = false;
    image.hovered = false;

    this.setState({
      image,
    });

    this.forceUpdate();
  }

  updateImage(image) {
    this.setState({
      image: clone(image),
    });

    this.forceUpdate();
  }

  handleTextChildSelected(id) {
    let image = clone(this.state.image);

    image.document_object = image.document_object.map(doc => {
      if (doc._id == id) {
        doc.selected = true;
      } else {
        doc.selected = false;
      }
      return doc;
    });

    this.setState({
      image,
    });

    this.forceUpdate();
  }

  enableCropMode() {
    const {
      image: {
        page,
        _id,
      }
    } = this.state;
    this.setState({cropMode: true});

    if (this.props.name == CanvasType.All)
      this.props.enableCropMode(_id, page);

    this.forceUpdate();
  }

  disableCropMode() {
    this.setState({cropMode: false});

    this.forceUpdate();
  }

  hideWhenDownload = null;

  render() {
    const {
      parentRotateAngle,
      showController,
      scale,
      onTextChange,
      outlineWidth,
      onFontSizeChange,
      handleFontColorChange,
      handleFontFaceChange,
      handleChildIdSelected,
      childId,
      // enableCropMode,
      showImage,
      id,
      // selected,
      name,
      canvas,
      image,
    } = this.props;

    const {
      cropMode,
      image: {
        page,
        hovered,
        selected: imageSelected,
        selected,
        _id,
        scaleX,
        scaleY,
        innerHTML,
        document_object: childrens,
        type: objectType,
        imgColor,
        backgroundColor,
        opacity: opacity2,
        effectId,
        width,
        height,
        fontFace,
        italic,
        align,
        bold,
        color,
        rotateAngle,
        src,
        srcThumnail,
        posX: posX2,
        posY: posY2,
        imgWidth: imgWidth2,
        imgHeight: imgHeight2,
        textShadowTransparent,
        filter,
        intensity,
        offSet,
        direction: effectDirection,
        blur,
        lineHeight,
        letterSpacing,
        fontSize,
        type,
        left,
        top,
        zIndex,
      }
    } = this.state;


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

    const imgResizeDirection = ["nw", "ne", "se", "sw", "e", "w", "s" , "n"];
    const cropImageResizeDirection = ["nw", "ne", "se", "sw"];
    const textResizeDirection = ["nw", "ne", "se", "sw", "e", "w"];
    const groupedItemResizeDirection = []; //["nw", "ne", "se", "sw"];

    var imgDirections = imgResizeDirection;
    // if (objectType === TemplateType.Heading || objectType === TemplateType.TextTemplate || objectType === TemplateType.Latex) {
    //   imgDirections = direction;
    // }

    if (objectType === TemplateType.Heading || objectType === TemplateType.TextTemplate) {
      imgDirections = textResizeDirection;
    }

    if (objectType == TemplateType.GroupedItem) {
      imgDirections = groupedItemResizeDirection;
    }

    if (height * scale <= 30) {
      imgDirections = imgDirections.filter(d => d != "w" && d != "e")
    }

    if (width * scale <= 30) {
      imgDirections = imgDirections.filter(d => d != "n" && d != "s")
    }

    let customAttr = {
      width: width * scale,
      height: height * scale,
      angle: rotateAngle,
      iden: objectType != TemplateType.BackgroundImage ? _id : "",
      page: page,
    };


    return (
      <div
        className={_id + (name == CanvasType.HoverLayer ? `__${canvas}` : "_") + " " + _id + `aaaa${canvas}`}
        id={_id + (name == CanvasType.HoverLayer ? `__${canvas}` : `_${canvas}`)}
        key={_id}
        style={{
          zIndex: ((name == CanvasType.HoverLayer && (selected || hovered)) || (name == CanvasType.All && cropMode)) ? 999999 : zIndex,
          width: width * scale + "px",
          height: height * scale + "px",
          position: "absolute",
          transform: `translate(${left * scale}px, ${top * scale}px) rotate(${rotateAngle ? rotateAngle : 0}deg)`,
          pointerEvents: (name == CanvasType.HoverLayer) ? "none" : "all",
        }}
      >
        <div
          id={_id + (name == CanvasType.HoverLayer ? "___" : "____")}
          style={{
            width: width * scale + "px",
            height: height * scale + "px",
            transformOrigin: "0 0",
            pointerEvents: (name == CanvasType.HoverLayer && !cropMode) ? "none" : "all",
          }}
          key={_id}
          onMouseDown={(e) => {
            if (type != TemplateType.BackgroundImage) {
              if (!editorStore.cropMode) {
                if (!selected) {
                  this.handleImageSelected();
                  this.props.handleImageSelected(_id, page, name == CanvasType.HoverLayer ? CanvasType.All : CanvasType.HoverLayer);
                }
                this.props.handleDragStart(e, _id);
              } else if (this.state.cropMode) {
                this.props.handleDragStart(e, _id);
              } else {
                this.props.doNoObjectSelected();
              }
            }
          }}
          onMouseUp={e => {
            if (type == TemplateType.BackgroundImage && !window.selectionStart) {
              if (!editorStore.cropMode) {
                if (!selected) {
                  this.handleImageSelected();
                  this.props.handleImageSelected(_id, page, CanvasType.HoverLayer);
                }
              } else if (this.state.cropMode) {
                this.props.handleDragStart(e, _id);
              } else {
                this.props.doNoObjectSelected();
              }
            }
          }}

          onMouseEnter={(e) => {
            if (!selected && type != TemplateType.BackgroundImage && !editorStore.cropMode && !window.selectionStart) {
              this.handleImageHovered();
              this.props.handleImageHovered(_id, page);
            }
          }}

          onMouseLeave={(e) => {
            if (hovered && !selected && type != TemplateType.BackgroundImage && !editorStore.cropMode) {
              this.handleImageUnhovered();
              this.props.handleImageUnhovered(_id, page);
            }
          }}
        >
      <div
        className={`hideWhenDownloadContainer ${name} ${hovered} ${selected}`}
      >
        {name == CanvasType.HoverLayer && <div 
          {...customAttr}
          className="hideWhenDownload"
          ref={i => this.hideWhenDownload = i}
          style={{
            position: "absolute",
            top: "-2px",
            left: "-2px",
            right: "-2px",
            bottom: "-2px",
            backgroundImage: 
              (objectType == TemplateType.TextTemplate || objectType == TemplateType.GroupedItem) ? `linear-gradient(90deg,#00d9e1 60%,transparent 0),linear-gradient(180deg,#00d9e1 60%,transparent 0),linear-gradient(90deg,#00d9e1 60%,transparent 0),linear-gradient(180deg,#00d9e1 60%,transparent 0)`
              :'linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1),linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1)',
            backgroundPosition: 'top,100%,bottom,0',
            backgroundSize: '12px 2px,2px 12px,12px 2px,2px 12px',
            backgroundRepeat: 'repeat-x,repeat-y,repeat-x,repeat-y',
            opacity: (hovered || selected) ? 1 : 0,
            pointerEvents: "none",
          }}>

        </div>}
      <StyledRect
        id={id + hovered ? "hovered" : ""}
        className={`${_id}rect-alo ${_id}-styledrect ${type == TemplateType.BackgroundImage && 'selectable'} rect single-resizer ${selected &&
          "selected"}`}
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: (name == CanvasType.HoverLayer && !cropMode) ? "none" : "all",
          backgroundColor: type == TemplateType.BackgroundImage && name != CanvasType.HoverLayer && color,
        }}
        cropMode={cropMode}
        
      >
         {!cropMode &&
          name == CanvasType.HoverLayer &&
          selected &&
          objectType !== TemplateType.BackgroundImage && (
          <div
            id={_id + "rotate-container"}
            className="rotate-container"
            style={{
              width: "18px",
              height: "18px",
              left: `calc(50% - 6}px)`,
              bottom: "-35px",
              cursor: getCursorStyleWithRotateAngle(rotateAngle),
              pointerEvents: "all",
            }}
            onMouseDown={this.startRotate}
          >
            <div
              className="rotate"
              style={{
                padding: "3px"
              }}
            >
              <svg
                width="14"
                height="14"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d='M15.25 18.48V15a.75.75 0 1 0-1.5 0v4c0 .97.78 1.75 1.75 1.75h4a.75.75 0 1 0 0-1.5h-2.6a8.75 8.75 0 0 0-2.07-15.53.75.75 0 1 0-.49 1.42 7.25 7.25 0 0 1 .91 13.34zM8.75 5.52V9a.75.75 0 0 0 1.5 0V5c0-.97-.78-1.75-1.75-1.75h-4a.75.75 0 0 0 0 1.5h2.6a8.75 8.75 0 0 0 2.18 15.57.75.75 0 0 0 .47-1.43 7.25 7.25 0 0 1-1-13.37z'
                  fillRule="nonzero"
                />
              </svg>
            </div>
          </div>
        )}

        {!cropMode &&
          name == CanvasType.HoverLayer &&
          selected &&
          objectType !== TemplateType.BackgroundImage &&
          imgDirections.map(d => {
            var cursor = getCursorStyleForResizer(rotateAngle, d);

            return (
              <div
                id={d}
                key={d}
                style={{
                  cursor,
                  pointerEvents: "all",
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
        {(name == CanvasType.All || (cropMode && name == CanvasType.HoverLayer) || name == CanvasType.Download) && src && (objectType === TemplateType.Image || objectType === TemplateType.BackgroundImage) && (
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
              <div
                id={_id + "hihi4" + canvas}
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
                  enableCropMode={this.enableCropMode}
                  srcThumnail={srcThumnail}
                />
              </div>
            {selected && cropMode && (
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
                      src={src}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {
        ((selected && name == CanvasType.HoverLayer) || (!selected && name == CanvasType.All)) &&
        (objectType === TemplateType.Video || objectType === TemplateType.Image) &&
          <div
            id={_id + "6543" + canvas}
            className={_id + "scaleX-scaleY"}
            style={{
              transformOrigin: "0 0",
              transform: src ? null : `scaleX(${scaleX}) scaleY(${scaleY})`,
              position: "absolute",
              width: '100%',
              height: '100%',
            }}
          >
            {!cropMode && objectType == TemplateType.Video && name == CanvasType.HoverLayer && 
            <div
              className="videoController"
              onClick={e => {
                this.props.toggleVideo();
              }}
              style={{
                position: "absolute",
                left: "calc(50% - 25px)",
                top: "calc(50% - 25px)",
                backgroundColor: "rgba(17,23,29,.6)",
                borderRadius: "100%",
                width: "50px",
                height: "50px",
                pointerEvents: "auto",
              }}>
                <span 
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  position: "relative",
                }}>
                  {this.state.paused ? 
                <svg 
                  style={{
                    margin: "auto",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    position: "absolute",
                    color: "white",
                  }}
                  width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M8.248 4.212l11.05 6.574c.694.412.91 1.29.483 1.961-.121.19-.287.35-.483.467l-11.05 6.574c-.694.413-1.602.204-2.03-.467A1.39 1.39 0 0 1 6 18.574V5.426C6 4.638 6.66 4 7.475 4c.273 0 .54.073.773.212z" fill="currentColor"></path></svg>
                :
                <svg 
                style={{
                  margin: "auto",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  position: "absolute",
                  color: "white",
                }}
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="7" y="5" width="3" height="14" rx="1.5" fill="currentColor"></rect><rect x="14" y="5" width="3" height="14" rx="1.5" fill="currentColor"></rect></svg>
              }
                </span>
              </div>
            }
            {cropMode && selected && (
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
                {type == TemplateType.Video && <canvas 
                  id={_id + "video3" + canvas} 
                  style={{
                    width: "100%",
                    height: "100%",
                    transformOrigin: "0 0",
                    outline: cropMode
                      ? `#00d9e1 solid ${outlineWidth - 1}px`
                      : null,
                    opacity: cropMode ? 0.5 : 0,
                  }}
                />}
                {cropMode && selected
                  ? cropImageResizeDirection
                    .map(d => {
                      let cursor = getCursorStyleForResizer(rotateAngle, d);
                      let visibility = objectType === TemplateType.BackgroundImage ? "visible" : getImageResizerVisibility(this.state.image, scale, d);
                      return (
                        <div
                          key={d}
                          style={{
                            cursor,
                            zIndex: 999999,
                            visibility,
                            pointerEvents: "all",
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
        {((selected && name == CanvasType.HoverLayer) || (!selected && name == CanvasType.All) || name == CanvasType.Download) && (objectType == TemplateType.TextTemplate) &&
          <div
            style={{
              transformOrigin: "0 0",
              position: "absolute",
              width: `calc(100% + 2px)`,
              height: `calc(100% + 2px)`,
              left: "-1px",
              top: "-1px",
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
                    backgroundImage: selected && child.selected && 'linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1),linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1)',
                    backgroundPosition: 'top,100%,bottom,0',
                    backgroundRepeat: 'repeat-x,repeat-y,repeat-x,repeat-y',
                    backgroundSize: '12px 2px,2px 12px,12px 2px,2px 12px',
                }}>
                
              </div>)))
            }
            </div>
          </div>
        }
        {(objectType === TemplateType.Heading || objectType == TemplateType.TextTemplate) &&
          <div
            id={_id + "654" + canvas}
            onClick={e => {
            }}
            className={_id + "scaleX-scaleY 2"}
            style={{
              transformOrigin: "0 0",
              transform: src ? null : `scaleX(${scaleX}) scaleY(${scaleY})`,
              position: "absolute",
              width: `calc(100%/${scaleX})`,
              height: `calc(100%/${scaleY})`,
              pointerEvents: (name == CanvasType.HoverLayer) ? "none" : "all",
            }}
          >
            
            {childrens && childrens.length > 0 &&
            ((selected && name == CanvasType.HoverLayer) || (!selected && name == CanvasType.All) || name == CanvasType.Download) &&
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
                        className={`text-container ${_id + child._id + "text-container2" + canvas}`}
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
            {cropMode && selected && (
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
                  ? cropImageResizeDirection.map(d => {
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
              <div style={{
                pointerEvents: (name == CanvasType.HoverLayer) ? "none" : "all",
              }}>
                <div
                  id={_id + "hihi5" + canvas}
                  className={_id + "hihi5"}
                  style={{
                    position: "absolute",
                    width: width * scale / scaleX + "px",
                    height: height * scale / scaleY + "px",
                    transformOrigin: "0 0",
                    zIndex: selected ? 1 : 0,
                    WebkitTextStroke: (effectId == 3 || effectId == 4) && (`${1.0 * this.props.image.hollowThickness / 100 * 4 + 0.1}px ${(effectId == 3 || effectId == 4) ? color : "black"}`),
                    pointerEvents: (name == CanvasType.HoverLayer) ? "none" : "all",
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
                  {((selected && name == CanvasType.HoverLayer) || (!selected && name == CanvasType.All) || name == CanvasType.Download) &&
                  objectType === TemplateType.Heading &&
                    <span
                      id={_id + "hihi4" + canvas}
                      spellCheck={false}
                      onInput={onTextChange}
                      contentEditable={selected}
                      ref={this.setTextElementRef2.bind(this)}
                      // onMouseDown={this.onMouseDown.bind(this)}
                      className={"text single-text " + _id + "hihi4" + canvas}
                      style={{
                        pointerEvents: "all",
                        position: "absolute",
                        display: "block",
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
                    ></span>
                  }
                </div>
              </div>
            )}

          </div>
        }
        {cropMode && (selected && name == CanvasType.HoverLayer) && objectType !== TemplateType.BackgroundImage && (
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
            {cropImageResizeDirection.map((d, i) => {
              var cursor = getCursorStyleForResizer(rotateAngle, d);
              return (
                <div
                  id={_id + zoomableMap[d]}
                  key={d}
                  style={{
                    cursor,
                    // transform: `rotate(${i * 90}deg) scale(${1 / scale})`,
                    transform: `rotate(${i * 90}deg)`,
                    zIndex: 2,
                    pointerEvents: "all",
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
        {src && objectType === TemplateType.Video && name == CanvasType.All && (
          <div
            id={_id}
            onDoubleClick={this.props.handleCropBtnClick}
            style={{
              zIndex: selected ? 1 : 0,
              transformOrigin: "0 0",
              position: "absolute",
              width: "100%",
              height: "100%",
              overflow: "hidden"
            }}
          >
            <Video
              paused={this.state.paused}
              rotateAngle={rotateAngle}
              parentRotateAngle={parentRotateAngle}
              canvas={canvas}
              _id={_id}
              showController={showController}
              imgWidth={imgWidth}
              imgHeight={imgHeight}
              posX={posX}
              posY={posY}
              selected={selected}
              cropMode={cropMode}
              outlineWidth={outlineWidth}
              backgroundColor={backgroundColor}
              src={src}
              srcThumnail={srcThumnail}
              opacity={opacity}
              startResizeImage={this.startResizeImage}
            />
          </div>
        )}
      </StyledRect>
      </div> </div> </div>
    );
  }
}
