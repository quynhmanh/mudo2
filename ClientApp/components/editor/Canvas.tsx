import React, { Component } from "react";
import ResizableRect from "@Components/editor/ResizableRect";
import StyledComponent from "styled-components";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import { toJS } from "mobx";
import Tooltip from "@Components/shared/Tooltip";


export interface IProps {
  uiKey: string;
  id: string;
  images: any;
  mode: number;
  rectWidth: number;
  rectHeight: number;
  scale: number;
  childId: string;
  cropMode: boolean;
  handleImageSelected: any;
  handleImageHover: any;
  handleRotateStart: any;
  handleResizeStart: any;
  handleDragStart: any;
  onSingleTextChange: any;
  handleFontSizeChange: any;
  handleFontColorChange: any;
  handleFontFamilyChange: any;
  handleChildIdSelected: any;
  enableCropMode: any;
  disableCropMode: any;
  handleResizeInnerImageStart: any;
  doNoObjectSelected: any;
  index: number;
  addAPage: any;
  staticGuides: any;
  idObjectSelected: any;
  handleDeleteThisPage: any;
  bleed: boolean;
  showPopup: boolean;
  preview: boolean;
  downloading: boolean;
  isSaving: boolean;
  translate: any;
  selectedImage: any;
  numberOfPages: number;
  selected: boolean;
  activePageId: string;
  toggleVideo: any;
  handleCropBtnClick: any;
}

export interface IState {
  hoveringCanvas: boolean;
}

enum Mode {
  CreateDesign = 0,
  CreateTemplate = 1,
  CreateTextTemplate = 2,
  EditTemplate = 3,
  EditTextTemplate = 4
}

enum TemplateType {
  Template = 1,
  TextTemplate = 2,
  Heading = 3,
  Image = 4,
  Latex = 5,
  BackgroundImage = 6,
  RemovedBackgroundImage = 7,
  UserUpload = 8,
  Video = 9
}

export default class Canvas extends Component<IProps, IState> {

  state = {
    hoveringCanvas: false,
  }

  constructor(props: any) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.uiKey != nextProps.uiKey) {
      return true;
    }
    if (this.props.activePageId != nextProps.activePageId) {
      return true;
    }
    if (this.props.cropMode != nextProps.cropMode) {
      return true;
    }
    if (this.props.scale != nextProps.scale) {
      return true;
    }
    if (nextProps.images.find(img => img._id == nextProps.idObjectSelected) ||
      this.props.images.find(img => img._id == this.props.idObjectSelected)) {
      return true;
    }

    return false;
  }

  tranformImage = (image: any) => {
    var centerX = image.left + image.width / 2;
    var centerY = image.top + image.height / 2;

    if (!image.rotateAngle || image.rotateAngle === 0) {
      return {
        x: [centerX - image.width / 2, centerX, centerX + image.width / 2],
        y: [centerY - image.height / 2, centerY, centerY + image.height / 2]
      };
    } else {
      return {
        x: [centerX - image.height / 2, centerX, centerX + image.height / 2],
        y: [centerY - image.width / 2, centerY, centerY + image.width / 2]
      };
    }
  };

  refAlo = null;

  render() {
    const {
      mode,
      rectWidth,
      rectHeight,
      scale,
      childId,
      cropMode,
      index,
      id,
      staticGuides,
      numberOfPages,
    } = this.props;

    const customAttr = {myattribute: id};
    
    var imgHovered = editorStore.imageHovered;
    var imgSelected = editorStore.imageSelected;

    const images = Array.from(editorStore.images2.values()).filter(img => img.page === id).map(img => toJS(img));
    return (
      <ResizableRectContainer
        // onTransitionEnd={this.props.handleDeleteThisPage}
        style={{
          position: "relative",
          transition: "all 0.1s linear"
        }}
        key={id}
        id={!this.props.downloading ? id : ""}
      >
        <div>

        </div>
        {!this.props.preview && (
          <span
            style={{ 
              fontSize: "13px", 
              display: "block", 
              marginBottom: "5px",
              marginTop: "15px",
              fontFamily: "AvenirNextRoundedPro-Medium",
              color: "#989899",
            }}
          >
            {this.props.translate("page")} {index + 1}
          </span>
        )}
        {(!this.props.preview || editorStore.activePageId == id) && (
          <div
            className="controllers"
            style={{
              position: "absolute",
              right: 0,
              display: editorStore.activePageId == id ? "inline" : "none",
            }}
          >
            {numberOfPages != 1 && 
            <Tooltip
            offsetLeft={0}
            offsetTop={-15}
            content={"Delete page"}
            delay={10}
            // style={{ display: show ? "block" : "none" }}
            position="top"
        >
            <button
              className="controllers-btn"
              onClick={() => {
                document.getElementById(id).style.opacity = "0";
                setTimeout(() => {
                  this.props.handleDeleteThisPage(id);
                }, 100);
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9 3.25h2c.69 0 1.25.56 1.25 1.25V5h-4.5v-.5c0-.69.56-1.25 1.25-1.25zM6.5 5v-.5A2.5 2.5 0 0 1 9 2h2a2.5 2.5 0 0 1 2.5 2.5V5h3.375a.625.625 0 1 1 0 1.25H16V15a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6.25h-.875a.625.625 0 1 1 0-1.25H6.5zm7 1.25H5.25V15c0 .966.784 1.75 1.75 1.75h6A1.75 1.75 0 0 0 14.75 15V6.25H13.5zM8.125 8h-.25v6h1.25V8h-1zm2.75 1V8h1.25v6h-1.25V9z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
            </Tooltip>}
            <Tooltip
            offsetLeft={0}
            offsetTop={-15}
            content={this.props.translate("addPage")}
            delay={10}
            // style={{ display: show ? "block" : "none" }}
            position="top"
        >
            <button
              className="controllers-btn"
              onClick={e => {
                this.props.addAPage(e, id);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.875 10.208a.625.625 0 1 0 1.25 0v-3.75h3.75a.625.625 0 1 0 0-1.25h-3.75v-3.75a.625.625 0 1 0-1.25 0v3.75h-3.75a.625.625 0 0 0 0 1.25h3.75v3.75z" fill="currentColor"></path><path d="M6.015 3.333H5c-.92 0-1.667.746-1.667 1.667v10c0 .92.746 1.666 1.667 1.666h8.333c.92 0 1.667-.746 1.667-1.666v-2.151h-1.25v2.15c0 .23-.187.417-.417.417H5A.417.417 0 0 1 4.583 15V5c0-.23.187-.417.417-.417h1.015v-1.25z" fill="currentColor"></path></svg>
            </button>
            </Tooltip>
          </div>
        )}
        <div
          style={{
            width: rectWidth * scale + "px",
            height: rectHeight * scale + "px",
            transform: this.props.preview && "scale(0.5)",
            transformOrigin: this.props.preview && "0 0"
          }}
        > 
          {!this.props.downloading && <div
            id="guide-container"
            className="screen-container"
            style={{
              width: rectWidth * scale + "px",
              height: rectHeight * scale + "px",
              position: "absolute"
            }}
          >
            {staticGuides.x.map(g =>
              // g[1] !== 1 ? null : (
                <div
                  key={uuidv4()}
                  id={g[1] + id}
                  className="guide axis-x static"
                  style={{
                    display: 'none',
                    left: `${g[0] * scale}px`,
                    borderLeft:"0.1em solid rgb(251 0 255)"
                  }}
                ></div>
              // )
            )}
            {staticGuides.y.map(g =>
              // g[1] !== 1 ? null : (
                <div
                  key={uuidv4()}
                  id={g[1] + id}
                  className="guide axis-y static"
                  style={{
                    display: 'none',
                    top: `${g[0] * scale}px`,
                    borderTop: "0.1em solid rgb(251 0 255)"
                  }}
                ></div>
              // )
            )}
            {images.map(g => {
              var transformImage = this.tranformImage(g);
              return (<div
                  key={g._id + "guide_0"}
                  id={g._id + "guide_0"}
                  className="guide axis-x static"
                  style={{
                    display: 'none',
                    left: `${transformImage.x[0] * scale}px`,
                    borderLeft: `0.1em ${g.type == TemplateType.BackgroundImage ? "solid" : "dashed"} rgb(251 0 255)`,
                  }}
                ></div>
              );
            })}
            {images.map(g => {
              var transformImage = this.tranformImage(g);
              return (<div
                  key={g._id + "guide_1"}
                  id={g._id + "guide_1"}
                  className="guide axis-x static"
                  style={{
                    display: 'none',
                    left: `${transformImage.x[1] * scale}px`,
                    borderLeft: `0.1em ${g.type == TemplateType.BackgroundImage ? "solid" : "dashed"} rgb(251 0 255)`,
                  }}
                ></div>
              );
            })}
            {images.map(g => {
              var transformImage = this.tranformImage(g);
              return (
                <div
                key={g._id + "guide_2"}
                id={g._id + "guide_2"}
                  className="guide axis-x static"
                  style={{
                    display: 'none',
                    left: `${transformImage.x[2] * scale}px`,
                    borderLeft: `0.1em ${g.type == TemplateType.BackgroundImage ? "solid" : "dashed"} rgb(251 0 255)`,
                  }}
                ></div>
              );
            })}
            {images.map(g => {
              var transformImage = this.tranformImage(g);
              return (
                <div
                key={g._id + "guide_3"}
                id={g._id + "guide_3"}
                  className="guide axis-y static"
                  style={{
                    display: 'none',
                    top: `${transformImage.y[0] * scale}px`,
                    borderTop: `0.1em ${g.type == TemplateType.BackgroundImage ? "solid" : "dashed"} rgb(251 0 255)`,
                  }}
                ></div>
              );
            })}
            {images.map(g => {
              var transformImage = this.tranformImage(g);
              return (
                <div
                key={g._id + "guide_4"}
                id={g._id + "guide_4"}
                  className="guide axis-y static"
                  style={{
                    display: 'none',
                    top: `${transformImage.y[1] * scale}px`,
                    borderTop: `0.1em ${g.type == TemplateType.BackgroundImage ? "solid" : "dashed"} rgb(251 0 255)`,
                  }}
                ></div>
              );
            })}
            {images.map(g => {
              var transformImage = this.tranformImage(g);
              return (
                <div
                key={g._id + "guide_5"}
                id={g._id + "guide_5"}
                  className="guide axis-y static"
                  style={{
                    display: 'none',
                    top: `${transformImage.y[2] * scale}px`,
                    borderTop: `0.1em ${g.type == TemplateType.BackgroundImage ? "solid" : "dashed"} rgb(251 0 255)`,
                  }}
                ></div>
              );
            })}
          </div>}
          {!this.props.downloading &&
          <div
            id="alo"
            ref={i => this.refAlo = i}
            className={!this.props.downloading ? "alo" : ""}
            style={{
              backgroundColor:
                !this.props.showPopup &&
                (mode == Mode.CreateTextTemplate ||
                mode == Mode.EditTextTemplate
                  ? "white"
                  : this.props.cropMode
                  ? "#ddd"
                  : "white"),
              width: this.props.preview
                ? rectWidth + "px"
                : rectWidth * scale + (this.props.bleed ? 20 : 0) + "px",
              height: this.props.preview
                ? rectHeight + "px"
                : rectHeight * scale + (this.props.bleed ? 20 : 0) + "px",
              position: "relative",
              boxShadow: "0 2px 8px rgba(14,19,24,.07)",
              padding: this.props.bleed ? "10px" : 0,
              // transition: 'all 2s linear',
              overflow: this.props.bleed && "hidden",
              boxSizing: "border-box"
            }}
          >
            { this.props.selected && !this.props.cropMode &&
            <div 
              id="alo4"
              style={{
                top: "-2px",
                left: "-2px",
                width: "calc(100% + 4px)",
                height: "calc(100% + 4px)",
                position: "absolute",
                backgroundImage: 'linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1),linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1)',
                backgroundPosition: 'top,100%,bottom,0',
                backgroundSize: '12px 2px,2px 12px,12px 2px,2px 12px',
                backgroundRepeat: 'repeat-x,repeat-y,repeat-x,repeat-y',
              }}
              ></div>}
            {this.props.bleed && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "10px",
                  height: "10px",
                  backgroundColor: "black",
                  zIndex: 99999999
                }}
              ></div>
            )}
            {this.props.bleed && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "10px",
                  height: "10px",
                  backgroundColor: "black",
                  zIndex: 99999999
                }}
              ></div>
            )}
            {this.props.bleed && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "10px",
                  height: "10px",
                  backgroundColor: "black",
                  zIndex: 99999999
                }}
              ></div>
            )}
            {this.props.bleed && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "10px",
                  height: "10px",
                  backgroundColor: "black",
                  zIndex: 99999999
                }}
              ></div>
            )}
            <div
              {...customAttr}
              id="canvas"
              className="canvas unblurred"
              style={{
                width: rectWidth * scale + "px",
                height: rectHeight * scale + "px",
                display: "inline-block",
                position: "absolute",
                overflow: "hidden",
                backgroundColor: editorStore.pageColor.get(id),
                backgroundImage: `url(${editorStore.pageBackgroundImage.get(id)})`,
              }}
              onClick={e => {
              }}
            >
              {images
                // .filter(img => img._id != this.props.idObjectSelected)
                .map(img => (
                  <div
                    key={img._id}
                    className={img._id + "_" + " " +  img._id + "aaaaalo"}
                    id={img._id + "_alo"}
                    style={{
                      // zIndex: img.selected ? 99999999 : img.zIndex,
                      zIndex: img.zIndex,
                      //  && cropMode ? 999999999 : img.zIndex,
                      width: img.width * scale + "px",
                      height: img.height * scale + "px",
                      // left: img.left * scale + "px",
                      // top: img.top * scale + "px",
                      position: "absolute",
                      // transform: `rotate(${img.rotateAngle ? img.rotateAngle : 0}deg)`
                      transform: `translate(${img.left * scale}px, ${img.top * scale}px) rotate(${img.rotateAngle ? img.rotateAngle : 0}deg)`
                    }}
                    onMouseEnter={(e) => {
                      if (!window.dragging && !window.resizing && !window.rotating && !window.rotating && !this.props.cropMode) {
                        this.props.handleImageHover(img, e);
                        this.forceUpdate();
                      }
                    }}
                    onMouseLeave={(e) => {
                      editorStore.imageHovered = null;
                      this.forceUpdate();
                    }}

                    onDoubleClick={(e) => {
                      e.preventDefault();
                      if (img.type == TemplateType.Image || img.type == TemplateType.BackgroundImage)
                        this.props.enableCropMode();
                      else if (img.type == TemplateType.Video) 
                        this.props.handleCropBtnClick(e);
                    }}
                  >
                    <div
                      id={img._id + "____"}
                      className="hover-outline"
                      style={{
                        width: "100%",
                        height: "100%",
                        // transform: `scale(${scale})`,
                        transformOrigin: "0 0"
                      }}
                      key={img._id}
                      onMouseDown={(e) => {
                        // e.stopPropagation();
                        // this.props.handleImageSelected(img, e);
                        this.props.handleDragStart(e, img._id);
                      }}
                      // onDoubleClick={e => {
                      //   this.props.enableCropMode();
                      // }}
                    >
                      <ResizableRect
                        canvas="alo"
                        name="all-images"
                        selected={false}
                        image={img}
                        hovered={false}
                        freeStyle={img.freeStyle}
                        toggleVideo={this.props.toggleVideo}
                        id={img._id + "_1"}
                        showImage={true}
                        showController={false}
                        key={img._id + "2"}
                        scale={scale}
                        rotateAngle={img.rotateAngle}
                        onRotateStart={this.props.handleRotateStart}
                        onResizeStart={this.props.handleResizeStart}
                        onTextChange={this.props.onSingleTextChange.bind(
                          this,
                          img
                        )}
                        outlineWidth={Math.min(
                          2,
                          Math.min(rectHeight * scale, rectWidth * scale) / 100
                        )}
                        handleFontColorChange={this.props.handleFontColorChange}
                        onFontSizeChange={this.props.handleFontSizeChange}
                        handleFontFaceChange={this.props.handleFontFamilyChange.bind(
                          this
                        )}
                        handleChildIdSelected={this.props.handleChildIdSelected.bind(
                          this
                        )}
                        childId={this.props.childId}
                        enableCropMode={this.props.enableCropMode}
                        cropMode={cropMode}
                        handleResizeInnerImageStart={this.props.handleResizeInnerImageStart.bind(
                          this
                        )}
                        bleed={this.props.bleed}
                      />
                    </div>
                  </div>
                ))}
            </div>
            {((editorStore.idObjectSelected && editorStore.imageSelected && editorStore.imageSelected.page == id) || 
            (editorStore.idObjectHovered && editorStore.imageHovered && editorStore.imageHovered.page == id)) &&
            <div
              {...customAttr}
              id="canvas"
              className="canvas unblurred"
              style={{
                width: rectWidth * scale + "px",
                height: rectHeight * scale + "px",
                display: "inline-block",
                position: "relative",
                zIndex: cropMode && 9999999,
              }}
              onClick={e => {
                if ((e.target as HTMLElement).id == "canvas") {
                  this.props.disableCropMode();
                }
              }}
            >
              <div>
                {(editorStore.idObjectSelected != editorStore.idObjectHovered) && imgHovered &&
                  <div
                    className={imgHovered._id + "__alo"}
                    id={imgHovered._id + "__alo"}
                    key={imgHovered._id}
                    style={{
                      zIndex: 99999999,
                      width: imgHovered.width * scale + "px",
                      height: imgHovered.height * scale + "px",
                      // left: imgHovered.left * scale + "px",
                      // top: imgHovered.top * scale + "px",
                      position: "absolute",
                      transform: `translate(${imgHovered.left * scale}px, ${imgHovered.top * scale}px) rotate(${imgHovered.rotateAngle ? imgHovered.rotateAngle : 0}deg)`,

                      pointerEvents: "none",
                    }}
                    onMouseLeave={(e) => {
                      editorStore.idObjectHovered = null;
                      editorStore.imageHovered = null;
                      this.forceUpdate();
                    }}
                    onMouseMove={(e) => {
                      var page = imgHovered.page;
                      var alo = document.getElementById(page);
                      var rect = this.refAlo.getBoundingClientRect();
                      
                      var contained = rect.left <= e.clientX && e.clientX <= rect.left + rect.width &&
                        rect.top <= e.clientY && e.clientY <= rect.top + rect.height;
                      
                      if (!contained) {
                        editorStore.idObjectHovered = null;
                        editorStore.imageHovered = null;
                        this.forceUpdate();
                      }
                    }}
                  >
                    <div
                      id={imgHovered._id + "___"}
                      style={{
                        width: imgHovered.width * scale + "px",
                        height: imgHovered.height * scale + "px",
                        // transform: `scale(${scale})`,
                        transformOrigin: "0 0"
                      }}
                      key={imgHovered._id}
                      onMouseDown={(e) => {
                        // e.stopPropagation();
                        this.props.handleImageSelected(imgHovered);
                        this.props.handleDragStart(e, imgHovered._id);
                      }}
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        if (imgHovered.type == TemplateType.Image || imgHovered.type == TemplateType.BackgroundImage)
                          this.props.enableCropMode();
                        else if (imgHovered.type == TemplateType.Video) 
                          this.props.handleCropBtnClick(e);
                      }}
                    >
                      <ResizableRect
                        canvas="alo"
                        name="imgHovered"
                        selected={false}
                        image={imgHovered}
                        hovered={true}
                        toggleVideo={this.props.toggleVideo}
                        freeStyle={imgHovered.freeStyle}
                        id={imgHovered._id + "_2"}
                        bleed={this.props.bleed}
                        showImage={false}
                        showController={false}
                        key={imgHovered._id + "2"}
                        scale={scale}
                        rotateAngle={imgHovered.rotateAngle}
                        onRotateStart={this.props.handleRotateStart}
                        onResizeStart={this.props.handleResizeStart}
                        onTextChange={this.props.onSingleTextChange.bind(
                          this,
                          imgHovered
                        )}
                        outlineWidth={Math.min(
                          2,
                          Math.min(rectHeight * scale, rectWidth * scale) /
                            100
                        )}
                        handleFontColorChange={
                          this.props.handleFontColorChange
                        }
                        onFontSizeChange={this.props.handleFontSizeChange}
                        handleFontFaceChange={this.props.handleFontFamilyChange.bind(
                          this
                        )}
                        handleChildIdSelected={this.props.handleChildIdSelected.bind(
                          this
                        )}
                        childId={this.props.childId}
                        // enableCropMode={this.props.enableCropMode}
                        cropMode={cropMode}
                        handleResizeInnerImageStart={this.props.handleResizeInnerImageStart.bind(
                          this
                        )}
                        enableCropMode={this.props.enableCropMode}
                      />
                    </div>
                  </div>
                }
                </div>
                {imgSelected && imgSelected.page === id && 
                <div
                  className={imgSelected._id + "__" + " " +  imgSelected._id + "aaaaalo"}
                  id={imgSelected._id + "__alo"}
                  key={imgSelected._id}
                  style={{
                    zIndex: imgSelected.type == TemplateType.BackgroundImage ? 1 : 99999999,
                    width: imgSelected.width * scale + "px",
                    height: imgSelected.height * scale + "px",
                    position: "absolute",
                    transform: `translate(${imgSelected.left * scale}px, ${imgSelected.top * scale}px) rotate(${imgSelected.rotateAngle ? imgSelected.rotateAngle : 0}deg)`,
                  }}
                >
                  <div
                    id={imgSelected._id + "___"}
                    style={{
                      width: "100%",
                      height: "100%",
                      // transform: `scale(${scale})`,
                      transformOrigin: "0 0"
                    }}
                    key={imgSelected._id}
                    onMouseDown={(e) => {
                      this.props.handleDragStart(e, imgSelected._id);
                    }}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      if (imgSelected.type == TemplateType.Image || imgSelected.type == TemplateType.BackgroundImage)
                        this.props.enableCropMode();
                      else if (imgSelected.type == TemplateType.Video) 
                        this.props.handleCropBtnClick(e);
                    }}
                  >
                    <ResizableRect
                      toggleVideo={this.props.toggleVideo}
                      canvas="alo"
                      name="imgSelected"
                      selected={true}
                      image={imgSelected}
                      hovered={true}
                      freeStyle={imgSelected.freeStyle}
                      id={imgSelected._id + "_2"}
                      bleed={this.props.bleed}
                      showImage={false}
                      showController={true}
                      key={imgSelected._id + "2"}
                      scale={scale}
                      onRotateStart={this.props.handleRotateStart}
                      onResizeStart={this.props.handleResizeStart}
                      onTextChange={this.props.onSingleTextChange.bind(
                        this,
                        imgSelected
                      )}
                      outlineWidth={Math.min(
                        2,
                        Math.min(rectHeight * scale, rectWidth * scale) /
                          100
                      )}
                      handleFontColorChange={
                        this.props.handleFontColorChange
                      }
                      onFontSizeChange={this.props.handleFontSizeChange}
                      handleFontFaceChange={this.props.handleFontFamilyChange.bind(
                        this
                      )}
                      handleChildIdSelected={this.props.handleChildIdSelected.bind(
                        this
                      )}
                      childId={this.props.childId}
                      enableCropMode={this.props.enableCropMode}
                      cropMode={cropMode}
                      handleResizeInnerImageStart={this.props.handleResizeInnerImageStart.bind(
                        this
                      )}
                    />
                  </div>
                </div>
                }
            </div>
            }
          </div>}
          {this.props.downloading &&
          <div
            id="alo"
            ref={i => this.refAlo = i}
            className="alo2"
            style={{
              backgroundColor: "white",
              width: this.props.preview
                ? rectWidth + "px"
                : rectWidth * scale + (this.props.bleed ? 20 : 0) + "px",
              height: this.props.preview
                ? rectHeight + "px"
                : rectHeight * scale + (this.props.bleed ? 20 : 0) + "px",
              position: "relative",
              boxShadow: "0 2px 8px rgba(14,19,24,.07)",
              padding: this.props.bleed ? "10px" : 0,
              // transition: 'all 2s linear',
              overflow: this.props.bleed && "hidden",
              boxSizing: "border-box",
              display: "none",
            }}
          >
            {this.props.bleed && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "10px",
                  height: "10px",
                  backgroundColor: "black",
                  zIndex: 99999999
                }}
              ></div>
            )}
            {this.props.bleed && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "10px",
                  height: "10px",
                  backgroundColor: "black",
                  zIndex: 99999999
                }}
              ></div>
            )}
            {this.props.bleed && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "10px",
                  height: "10px",
                  backgroundColor: "black",
                  zIndex: 99999999
                }}
              ></div>
            )}
            {this.props.bleed && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "10px",
                  height: "10px",
                  backgroundColor: "black",
                  zIndex: 99999999
                }}
              ></div>
            )}
            <div
              {...customAttr}
              id="canvas"
              className="canvas unblurred"
              style={{
                width: rectWidth * scale + "px",
                height: rectHeight * scale + "px",
                display: "inline-block",
                position: "absolute",
                overflow: "hidden",
                backgroundColor: editorStore.pageColor.get(id),
                backgroundImage: `url(${editorStore.pageBackgroundImage.get(id)})`,
              }}
              onClick={e => {
              }}
            >
              {images
                .map(img => (
                  <div
                    key={img._id}
                    className={img._id + "_" + " " +  img._id + "aaaaalo2"}
                    id={img._id + "_alo2"}
                    style={{
                      // zIndex: img.selected ? 99999999 : img.zIndex,
                      zIndex: img.zIndex,
                      width: img.width * scale + "px",
                      height: img.height * scale + "px",
                      // left: img.left * scale + "px",
                      // top: img.top * scale + "px",
                      position: "absolute",
                      // transform: `rotate(${img.rotateAngle ? img.rotateAngle : 0}deg)`
                      transform: `translate(${img.left * scale}px, ${img.top * scale}px) rotate(${img.rotateAngle ? img.rotateAngle : 0}deg)`
                    }}
                    onMouseEnter={(e) => {
                      if (!window.dragging && !window.resizing && !window.rotating && !window.rotating && !this.props.cropMode) {
                        this.props.handleImageHover(img, e);
                        this.forceUpdate();
                      }
                    }}
                    onMouseLeave={(e) => {
                      editorStore.imageHovered = null;
                      this.forceUpdate();
                    }}
                  >
                    <div
                      id={img._id + "____"}
                      className="hover-outline"
                      style={{
                        width: "100%",
                        height: "100%",
                        // transform: `scale(${scale})`,
                        transformOrigin: "0 0"
                      }}
                      key={img._id}
                      onMouseDown={(e) => {
                        // e.stopPropagation();
                        this.props.handleImageSelected(img, e);
                        this.props.handleDragStart(e, img._id);
                      }}
                    >
                      <ResizableRect
                        canvas="alo2"
                        name="downloadImages"
                        selected={false}
                        toggleVideo={this.props.toggleVideo}
                        image={img}
                        hovered={false}
                        freeStyle={img.freeStyle}
                        id={img._id + "_1"}
                        showImage={true}
                        showController={false}
                        key={img._id + "2"}
                        scale={1}
                        rotateAngle={img.rotateAngle}
                        onRotateStart={this.props.handleRotateStart}
                        onResizeStart={this.props.handleResizeStart}
                        onTextChange={this.props.onSingleTextChange.bind(
                          this,
                          img
                        )}
                        outlineWidth={Math.min(
                          2,
                          Math.min(rectHeight * scale, rectWidth * scale) / 100
                        )}
                        handleFontColorChange={this.props.handleFontColorChange}
                        onFontSizeChange={this.props.handleFontSizeChange}
                        handleFontFaceChange={this.props.handleFontFamilyChange.bind(
                          this
                        )}
                        handleChildIdSelected={this.props.handleChildIdSelected.bind(
                          this
                        )}
                        childId={this.props.childId}
                        enableCropMode={this.props.enableCropMode}
                        cropMode={false}
                        handleResizeInnerImageStart={this.props.handleResizeInnerImageStart.bind(
                          this
                        )}
                        bleed={this.props.bleed}
                      />
                    </div>
                  </div>
                ))}
            </div>
            {/* {((editorStore.idObjectSelected && editorStore.imageSelected && editorStore.imageSelected.page == id) || 
            (editorStore.idObjectHovered && editorStore.imageHovered && editorStore.imageHovered.page == id)) &&
            <div
              {...customAttr}
              id="canvas"
              className="canvas unblurred"
              style={{
                width: rectWidth * scale + "px",
                height: rectHeight * scale + "px",
                display: "inline-block",
                position: "relative",
              }}
              onClick={e => {
              }}
            >
              <div>
                {(editorStore.idObjectSelected != editorStore.idObjectHovered) && imgHovered &&
                  <div
                    className={imgHovered._id + "__"}
                    id={imgHovered._id + "__alo2"}
                    key={imgHovered._id}
                    style={{
                      zIndex: 99999999,
                      width: imgHovered.width * scale + "px",
                      height: imgHovered.height * scale + "px",
                      // left: imgHovered.left * scale + "px",
                      // top: imgHovered.top * scale + "px",
                      position: "absolute",
                      transform: `translate(${imgHovered.left * scale}px, ${imgHovered.top * scale}px) rotate(${imgHovered.rotateAngle ? imgHovered.rotateAngle : 0}deg)`,

                      pointerEvents: "none",
                    }}
                    onMouseLeave={(e) => {
                      editorStore.idObjectHovered = null;
                      editorStore.imageHovered = null;
                      this.forceUpdate();
                    }}
                    onMouseMove={(e) => {
                      var page = imgHovered.page;
                      var alo = document.getElementById(page);
                      var rect = this.refAlo.getBoundingClientRect();
                      
                      var contained = rect.left <= e.clientX && e.clientX <= rect.left + rect.width &&
                        rect.top <= e.clientY && e.clientY <= rect.top + rect.height;
                      
                      if (!contained) {
                        editorStore.idObjectHovered = null;
                        editorStore.imageHovered = null;
                        this.forceUpdate();
                      }
                    }}
                  >
                    <div
                      id={imgHovered._id + "___"}
                      style={{
                        width: imgHovered.width * scale + "px",
                        height: imgHovered.height * scale + "px",
                        // transform: `scale(${scale})`,
                        transformOrigin: "0 0"
                      }}
                      key={imgHovered._id}
                      onMouseDown={(e) => {
                        // e.stopPropagation();
                        this.props.handleImageSelected(imgHovered);
                        this.props.handleDragStart(e, imgHovered._id);
                      }}
                    >
                      <ResizableRect
                        name="imgHovered"
                        canvas="alo2"
                        selected={false}
                        image={imgHovered}
                        hovered={true}
                        freeStyle={imgHovered.freeStyle}
                        toggleVideo={this.props.toggleVideo}
                        id={imgHovered._id + "_2"}
                        bleed={this.props.bleed}
                        showImage={false}
                        showController={false}
                        key={imgHovered._id + "2"}
                        scale={scale}
                        rotateAngle={imgHovered.rotateAngle}
                        onRotateStart={this.props.handleRotateStart}
                        onResizeStart={this.props.handleResizeStart}
                        onTextChange={this.props.onSingleTextChange.bind(
                          this,
                          imgHovered
                        )}
                        outlineWidth={Math.min(
                          2,
                          Math.min(rectHeight * scale, rectWidth * scale) /
                            100
                        )}
                        handleFontColorChange={
                          this.props.handleFontColorChange
                        }
                        onFontSizeChange={this.props.handleFontSizeChange}
                        handleFontFaceChange={this.props.handleFontFamilyChange.bind(
                          this
                        )}
                        handleChildIdSelected={this.props.handleChildIdSelected.bind(
                          this
                        )}
                        childId={this.props.childId}
                        enableCropMode={this.props.enableCropMode}
                        cropMode={cropMode}
                        handleResizeInnerImageStart={this.props.handleResizeInnerImageStart.bind(
                          this
                        )}
                      />
                    </div>
                  </div>
                }
                </div>
            </div>
            } */}
          </div>}
        </div>
        {/* {!this.props.preview && (
          <a
            style={{
              width: "100%",
              display: "block",
              border: "1px solid #00000021",
              textAlign: "center",
              marginTop: "11px",
              textDecoration: "none",
              color: "rgba(68, 62, 62, 0.52)"
            }}
            href="#"
            onClick={e => {
              this.props.addAPage(e, id);
            }}
          >
            {this.props.translate("addAPage")}
          </a>
        )} */}
      </ResizableRectContainer>
    );
  }
}

const ResizableRectContainer = StyledComponent.div`
  .controllers-btn {
    border-radius: 3px;
    padding: 5px;
    color: rgba(43, 59, 74, 0.45);
  }
  .controllers-btn:hover {
    background-color: rgba(75,102,129,.15);
    color: rgb(14, 19, 24);
  }
  button {
    background: none;
    border: none;
    padding: 1px 3px;
  }
  button:focus {
    outline: none;
  }
  .controllers {
    display: none;
    top: -10px;
  }
  :hover .controllers {
    display: inline !important;
  }
`;
