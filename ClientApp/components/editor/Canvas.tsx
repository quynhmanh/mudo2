import React, { Component } from "react";
import ResizableRect from "@Components/editor/ResizableRect";
import StyledComponent from "styled-components";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";


export interface IProps {
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
  handleRotate: any;
  handleRotateEnd: any;
  handleResizeStart: any;
  handleDragStart: any;
  onSingleTextChange: any;
  handleFontSizeChange: any;
  handleFontColorChange: any;
  handleFontFamilyChange: any;
  handleChildIdSelected: any;
  enableCropMode: any;
  handleResizeInnerImageStart: any;
  updateRect: any;
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
  resizing: boolean;
  dragging: boolean;
  rotating: boolean;
  translate: any;
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

  shouldComponentUpdate(nextProps, nextState) {
    if ((nextProps.dragging ||
       nextProps.resizing || 
       nextProps.rotating) && this.props.idObjectSelected == nextProps.idObjectSelected) {
      return false;
    }
    return true;
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
      images,
      childId,
      cropMode,
      index,
      id,
      staticGuides,
      idObjectSelected
    } = this.props;
    
    var imgHovered = editorStore.imageHovered;
    var imgSelected = editorStore.imageSelected;

    return (
      <ResizableRectContainer
        // onTransitionEnd={this.props.handleDeleteThisPage}
        style={{
          position: "relative",
          transition: "all 0.1s linear"
        }}
        key={id}
        id={id}
      >
        {!this.props.preview && (
          <span
            style={{ fontSize: "12px", display: "block", marginBottom: "5px" }}
          >
            Trang {index + 1}
          </span>
        )}
        {!this.props.preview && (
          <div
            className="controllers"
            style={{
              position: "absolute",
              right: 0
            }}
          >
            <button
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
          <div
            id="guide-container"
            className="screen-container"
            style={{
              width: rectWidth * scale + "px",
              height: rectHeight * scale + "px",
              position: "absolute"
            }}
          >
            {staticGuides.x.map(g =>
              g[1] !== 1 ? null : (
                <div
                  key={uuidv4()}
                  className="guide axis-x static"
                  style={{
                    left: `${g[0] * scale}px`,
                    border: g[1] === 1 ? "0.5px dashed #B14AED" : null
                  }}
                ></div>
              )
            )}
            {staticGuides.y.map(g =>
              g[1] !== 1 ? null : (
                <div
                  key={uuidv4()}
                  className="guide axis-y static"
                  style={{
                    top: `${g[0] * scale}px`,
                    border: g[1] === 1 ? "0.5px dashed #B14AED" : null
                  }}
                ></div>
              )
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
                    border: "0.5px dashed #B14AED"
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
                    border: "0.5px dashed #B14AED",
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
                    border: "0.5px dashed #B14AED"
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
                    border: "0.5px dashed #B14AED"
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
                    border: "0.5px dashed #B14AED"
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
                    border: "0.5px dashed #B14AED"
                  }}
                ></div>
              );
            })}
          </div>
          <div
            id="alo"
            ref={i => this.refAlo = i}
            className={this.props.downloading && !this.props.preview ? "alo2" : "alo"}
            style={{
              backgroundColor:
                !this.props.showPopup &&
                (mode == Mode.CreateTextTemplate ||
                mode == Mode.EditTextTemplate
                  ? "#00000030"
                  : this.props.cropMode
                  ? "rgba(14, 19, 24, 0.2)"
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
              id="canvas"
              className="canvas unblurred"
              style={{
                width: rectWidth * scale + "px",
                height: rectHeight * scale + "px",
                display: "inline-block",
                position: "absolute",
                overflow: "hidden",
              }}
              // onClick={e => {
              //   if ((e.target as Element).id === "canvas" && 
              //     !this.props.resizing &&
              //     !this.props.dragging) {
              //     this.props.doNoObjectSelected();
              //   }
              // }}
            >
              {images
                // .filter(img => img.selected)
                .map(img => (
                  <div
                    key={img._id}
                    className={img._id + "_" + " " +  img._id + "aaaa"}
                    id={img._id + "_"}
                    style={{
                      // zIndex: img.selected ? 99999999 : img.zIndex,
                      zIndex: img.zIndex,
                      width: img.width * scale + "px",
                      height: img.height * scale + "px",
                      left: img.left * scale + "px",
                      top: img.top * scale + "px",
                      position: "absolute",
                      transform: `rotate(${
                        img.rotateAngle ? img.rotateAngle : 0
                      }deg)`
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
                      style={{
                        width: "100%",
                        height: "100%",
                        // transform: `scale(${scale})`,
                        transformOrigin: "0 0"
                      }}
                      key={img._id}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        // this.props.handleImageSelected(img, e);
                        this.props.handleDragStart(e, img._id);
                      }}
                    >
                      <ResizableRect
                        image={img}
                        hovered={false}
                        freeStyle={img.freeStyle}
                        rotating={this.props.rotating}
                        dragging={this.props.dragging}
                        resizing={this.props.resizing}
                        id={img._id + "_1"}
                        showImage={true}
                        hidden={true}
                        showController={img.selected}
                        key={img._id + "2"}
                        left={img.left * scale}
                        top={img.top * scale}
                        width={img.width * scale}
                        height={img.height * scale}
                        scale={scale}
                        rotateAngle={img.rotateAngle}
                        aspectRatio={img.width / img.height}
                        zoomable="n, w, s, e, nw, ne, se, sw"
                        onRotateStart={this.props.handleRotateStart}
                        onResizeStart={this.props.handleResizeStart}
                        updateStartPos={img.updateStartPos}
                        src={img.src}
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
                        posX={img.posX * scale}
                        posY={img.posY * scale}
                        enableCropMode={this.props.enableCropMode}
                        cropMode={cropMode}
                        imgWidth={img.imgWidth * scale}
                        imgHeight={img.imgHeight * scale}
                        imgColor={img.color}
                        handleResizeInnerImageStart={this.props.handleResizeInnerImageStart.bind(
                          this
                        )}
                        updateRect={this.props.updateRect}
                        bleed={this.props.bleed}
                      />
                    </div>
                  </div>
                ))}
            </div>
            {(editorStore.idObjectSelected || editorStore.idObjectHovered) &&
            <div
              id="canvas"
              className="canvas unblurred"
              style={{
                width: rectWidth * scale + "px",
                height: rectHeight * scale + "px",
                display: "inline-block",
                position: "relative",
              }}
              // onClick={e => {
              //   if ((e.target as Element).id === "canvas" && !this.props.dragging && !this.props.resizing) {
              //     this.props.doNoObjectSelected();
              //   }
              // }}
            >
              <div>
                {(editorStore.idObjectSelected != editorStore.idObjectHovered) && imgHovered &&
                  <div
                    className={imgHovered._id + "__"}
                    id={imgHovered._id + "__"}
                    key={imgHovered._id}
                    style={{
                      zIndex: 99999999,
                      width: imgHovered.width * scale + "px",
                      height: imgHovered.height * scale + "px",
                      left: imgHovered.left * scale + "px",
                      top: imgHovered.top * scale + "px",
                      position: "absolute",
                      transform: `rotate(${
                        imgHovered.rotateAngle ? imgHovered.rotateAngle : 0
                      }deg)`,
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
                        e.stopPropagation();
                        // this.props.handleImageSelected(imgHovered);
                        this.props.handleDragStart(e, imgHovered._id);
                      }}
                    >
                      <ResizableRect
                        image={imgHovered}
                        hovered={true}
                        freeStyle={imgHovered.freeStyle}
                        rotating={this.props.rotating}
                        dragging={this.props.dragging}
                        resizing={this.props.resizing}
                        id={imgHovered._id + "_2"}
                        bleed={this.props.bleed}
                        showImage={false}
                        hidden={true}
                        showController={false}
                        key={imgHovered._id + "2"}
                        left={imgHovered.left * scale}
                        top={imgHovered.top * scale }
                        width={imgHovered.width * scale}
                        height={imgHovered.height * scale}
                        scale={scale}
                        rotateAngle={imgHovered.rotateAngle}
                        aspectRatio={imgHovered.width / imgHovered.height}
                        zoomable="n, w, s, e, nw, ne, se, sw"
                        onRotateStart={this.props.handleRotateStart}
                        onResizeStart={this.props.handleResizeStart}
                        updateStartPos={imgHovered.updateStartPos}
                        src={imgHovered.src}
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
                        updateRect={this.props.updateRect}
                      />
                    </div>
                  </div>
                }
                </div>
                {imgSelected && imgSelected.page === id && <div
                      className={imgSelected._id + "__" + " " +  imgSelected._id + "aaaa"}
                      id={imgSelected._id + "__"}
                      key={imgSelected._id}
                      style={{
                        zIndex: 99999999,
                        width: imgSelected.width * scale + "px",
                        height: imgSelected.height * scale + "px",
                        left: imgSelected.left * scale + "px",
                        top: imgSelected.top * scale + "px",
                        position: "absolute",
                        transform: `rotate(${
                          imgSelected.rotateAngle ? imgSelected.rotateAngle : 0
                        }deg)`
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
                      >
                        <ResizableRect
                          image={imgSelected}
                          hovered={true}
                          freeStyle={imgSelected.freeStyle}
                          rotating={this.props.rotating}
                          dragging={this.props.dragging}
                          resizing={this.props.resizing}
                          id={imgSelected._id + "_2"}
                          bleed={this.props.bleed}
                          showImage={false}
                          hidden={true}
                          showController={true}
                          key={imgSelected._id + "2"}
                          left={imgSelected.left * scale}
                          top={imgSelected.top * scale}
                          width={imgSelected.width * scale}
                          height={imgSelected.height * scale}
                          scale={scale}
                          aspectRatio={imgSelected.width / imgSelected.height}
                          zoomable="n, w, s, e, nw, ne, se, sw"
                          onRotateStart={this.props.handleRotateStart}
                          onResizeStart={this.props.handleResizeStart}
                          updateStartPos={imgSelected.updateStartPos}
                          src={imgSelected.src}
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
                          posX={imgSelected.posX * scale}
                          posY={imgSelected.posY * scale}
                          enableCropMode={this.props.enableCropMode}
                          cropMode={cropMode}
                          handleResizeInnerImageStart={this.props.handleResizeInnerImageStart.bind(
                            this
                          )}
                          updateRect={this.props.updateRect}
                        />
                      </div>
                    </div>
                }
            </div>
            }
          </div>
        </div>
        {!this.props.preview && (
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
        )}
      </ResizableRectContainer>
    );
  }
}

const ResizableRectContainer = StyledComponent.div`
  .controllers {
    display: none;
    top: -2px;
    border-radius: 5px;
  }
  .controllers:hover {
    background-color: #8080801f;
  }
  button {
    background: none;
    border: none;
    padding: 1px 3px;
  }
  button:focus {
    outline: none;
  }
  :hover .controllers {
    display: inline;
  }
`;
