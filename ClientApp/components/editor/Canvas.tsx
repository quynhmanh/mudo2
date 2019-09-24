import React, { Component } from "react";
import ResizableRect from "@Components/editor/ResizableRect";
import StyledComponent from "styled-components";

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
  handleRotateStart: any;
  handleRotate: any;
  handleRotateEnd: any;
  handleResizeStart: any;
  handleResize: any;
  handleResizeEnd: any;
  handleDragStart: any;
  handleDrag: any;
  handleDragEnd: any;
  onSingleTextChange: any;
  handleFontSizeChange: any;
  handleFontColorChange: any;
  handleFontFamilyChange: any;
  handleChildIdSelected: any;
  handleImageDrag: any;
  enableCropMode: any;
  handleImageResize: any;
  startX: any;
  startY: any;
  onResizeInnerImageStart: any;
  resizingInnerImage: any;
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
    if (nextProps.dragging
      // nextProps.resizing
      ) {
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

  render() {
    console.log('rendering');
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
            Trang {index + 1} - Mặt trước
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
            className={!this.props.preview && "alo"}
            // onTransitionEnd={() => {console.log('onTransitionEnd')}}
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
                // overflow: !this.state.hoveringCanvas && "hidden",
              }}
              // onMouseEnter={(e) => {this.setState({hoveringCanvas: true,})}}
              // onMouseLeave={(e) => { this.setState({hoveringCanvas: false,})}}
              onClick={e => {
                if ((e.target as Element).id === "canvas") {
                  this.props.doNoObjectSelected();
                }
              }}
            >
              {images
                .filter(img => img.selected)
                .map(img => (
                  <ResizableRectWrapper
                    className="9876"
                    id={img._id + "_"}
                    downloading={this.props.downloading}
                    isSaving={this.props.isSaving}
                    selected={img.selected}
                    outlineWidth={Math.min(
                      2,
                      Math.min(rectHeight * scale, rectWidth * scale) / 100
                    )}
                    style={{
                      zIndex: img.selected ? 99999999 : img.zIndex,
                      // outline: img.selected ? `rgb(1, 159, 182) solid ${Math.min(2, Math.min(rectHeight * scale, rectWidth * scale) / 100)}px` : null,
                      width: img.width * scale + "px",
                      height: img.height * scale + "px",
                      left: img.left * scale + "px",
                      top: img.top * scale + "px",
                      position: "absolute",
                      transform: `rotate(${
                        img.rotateAngle ? img.rotateAngle : 0
                      }deg)`
                    }}
                  >
                    <div
                      id={img._id + "____"}
                      style={{
                        width: img.width + "px",
                        height: img.height + "px",
                        transform: `scale(${scale})`,
                        transformOrigin: "0 0"
                      }}
                      key={img._id}
                      onMouseDown={this.props.handleImageSelected.bind(
                        this,
                        img
                      )}
                    >
                      <ResizableRect
                        rotating={this.props.rotating}
                        dragging={this.props.dragging}
                        resizing={this.props.resizing}
                        id={img._id + "_1"}
                        opacity={img.opacity}
                        showImage={false}
                        hidden={true}
                        objectType={img.type}
                        selected={img.selected}
                        showController={img.selected}
                        key={img._id + "2"}
                        _id={img._id}
                        left={img.left}
                        top={img.top}
                        width={img.width}
                        height={img.height}
                        scale={scale}
                        rotateAngle={img.rotateAngle}
                        aspectRatio={img.width / img.height}
                        zoomable="n, w, s, e, nw, ne, se, sw"
                        onRotateStart={this.props.handleRotateStart}
                        onRotate={this.props.handleRotate.bind(this)}
                        onRotateEnd={this.props.handleRotateEnd}
                        onResizeStart={this.props.handleResizeStart}
                        onResize={this.props.handleResize.bind(this)}
                        onResizeEnd={this.props.handleResizeEnd}
                        onDragStart={
                          img.type === TemplateType.BackgroundImage
                            ? null
                            : this.props.handleDragStart.bind(this)
                        }
                        onDrag={this.props.handleDrag.bind(this)}
                        onDragEnd={this.props.handleDragEnd}
                        updateStartPos={img.updateStartPos}
                        src={img.src}
                        onTextChange={this.props.onSingleTextChange.bind(
                          this,
                          img
                        )}
                        innerHTML={img.innerHTML}
                        scaleX={img.scaleX}
                        scaleY={img.scaleY}
                        zIndex={img.zIndex}
                        childrens={img.document_object}
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
                        posX={img.posX}
                        posY={img.posY}
                        handleImageDrag={this.props.handleImageDrag.bind(
                          this,
                          img._id
                        )}
                        enableCropMode={this.props.enableCropMode}
                        cropMode={cropMode}
                        imgWidth={img.imgWidth}
                        imgHeight={img.imgHeight}
                        imgColor={img.color}
                        onImageResize={this.props.handleImageResize.bind(this)}
                        resizingInnerImage={this.props.resizingInnerImage}
                        onResizeInnerImageStart={this.props.onResizeInnerImageStart.bind(
                          this
                        )}
                        startX={this.props.startX}
                        startY={this.props.startY}
                        updateRect={this.props.updateRect}
                        bleed={this.props.bleed}
                        backgroundColor={img.backgroundColor}
                      />
                    </div>
                  </ResizableRectWrapper>
                ))}
            </div>
            <div
              id="canvas"
              className="canvas unblurred"
              style={{
                width: rectWidth * scale + "px",
                height: rectHeight * scale + "px",
                display: "inline-block",
                position: "absolute",
                overflow: !this.state.hoveringCanvas && "hidden",
                // overflow: 'hidden',
              }}
              onMouseEnter={(e) => { this.setState({hoveringCanvas: true,})}}
              onMouseLeave={(e) => { this.setState({hoveringCanvas: false,})}}
              onClick={e => {
                if ((e.target as Element).id === "canvas") {
                  this.props.doNoObjectSelected();
                }
              }}
            >
              {images
                .filter(img => !img.selected)
                .map(img => (
                  <ResizableRectWrapper
                    className="9876"
                    id={img._id + "_"}
                    downloading={this.props.downloading}
                    isSaving={this.props.isSaving}
                    selected={img.selected}
                    outlineWidth={Math.min(
                      2,
                      Math.min(rectHeight * scale, rectWidth * scale) / 100
                    )}
                    style={{
                      zIndex: 2,
                      // outline: img.selected ? `rgb(1, 159, 182) solid ${Math.min(2, Math.min(rectHeight * scale, rectWidth * scale) / 100)}px` : null,
                      width: img.width * scale + "px",
                      height: img.height * scale + "px",
                      left: img.left * scale + "px",
                      top: img.top * scale + "px",
                      position: "absolute",
                      transform: `rotate(${
                        img.rotateAngle ? img.rotateAngle : 0
                      }deg)`
                    }}
                  >
                    <div
                      id={img._id + "____"}
                      style={{
                        width: img.width + "px",
                        height: img.height + "px",
                        transform: `scale(${scale})`,
                        transformOrigin: "0 0"
                      }}
                      key={img._id}
                      onMouseDown={this.props.handleImageSelected.bind(
                        this,
                        img
                      )}
                    >
                      <ResizableRect
                        rotating={this.props.rotating}
                        resizing={this.props.resizing}
                        dragging={this.props.dragging}
                        id={img._id + "_1"}
                        opacity={img.opacity}
                        showImage={false}
                        hidden={true}
                        objectType={img.type}
                        selected={img.selected}
                        showController={img.selected}
                        key={img._id + "2"}
                        _id={img._id}
                        left={img.left}
                        top={img.top}
                        width={img.width}
                        height={img.height}
                        scale={scale}
                        rotateAngle={img.rotateAngle}
                        aspectRatio={img.width / img.height}
                        zoomable="n, w, s, e, nw, ne, se, sw"
                        onRotateStart={this.props.handleRotateStart}
                        onRotate={this.props.handleRotate.bind(this)}
                        onRotateEnd={this.props.handleRotateEnd}
                        onResizeStart={this.props.handleResizeStart}
                        onResize={this.props.handleResize.bind(this)}
                        onResizeEnd={this.props.handleResizeEnd}
                        onDragStart={
                          img.type === TemplateType.BackgroundImage
                            ? null
                            : this.props.handleDragStart.bind(this)
                        }
                        onDrag={this.props.handleDrag.bind(this)}
                        onDragEnd={this.props.handleDragEnd}
                        updateStartPos={img.updateStartPos}
                        src={img.src}
                        onTextChange={this.props.onSingleTextChange.bind(
                          this,
                          img
                        )}
                        innerHTML={img.innerHTML}
                        scaleX={img.scaleX}
                        scaleY={img.scaleY}
                        zIndex={img.zIndex}
                        childrens={img.document_object}
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
                        posX={img.posX}
                        posY={img.posY}
                        handleImageDrag={this.props.handleImageDrag.bind(
                          this,
                          img._id
                        )}
                        enableCropMode={this.props.enableCropMode}
                        cropMode={cropMode}
                        imgWidth={img.imgWidth}
                        imgHeight={img.imgHeight}
                        imgColor={img.color}
                        onImageResize={this.props.handleImageResize.bind(this)}
                        resizingInnerImage={this.props.resizingInnerImage}
                        onResizeInnerImageStart={this.props.onResizeInnerImageStart.bind(
                          this
                        )}
                        startX={this.props.startX}
                        startY={this.props.startY}
                        updateRect={this.props.updateRect}
                        bleed={this.props.bleed}
                        backgroundColor={img.backgroundColor}
                      />
                    </div>
                  </ResizableRectWrapper>
                ))}
            </div>
            <div
              id="canvas"
              className="canvas unblurred"
              style={{
                width: rectWidth * scale + "px",
                height: rectHeight * scale + "px",
                display: "inline-block",
                position: "relative",
                overflow: !this.props.bleed && "hidden"
              }}
              // onMouseEnter={(e) => {this.setState({hoveringCanvas: true,})}}
              // onMouseLeave={(e) => {this.setState({hoveringCanvas: false,})}}
              onClick={e => {
                if ((e.target as Element).id === "canvas") {
                  this.props.doNoObjectSelected();
                }
              }}
            >
              {images
                .filter(
                  img => !img.selected || img.type === 4 || img.type === 6
                )
                .map(img => (
                  <div>
                    <ResizableRectWrapper
                      className="9876"
                      id={img._id + "__"}
                      downloading={this.props.downloading}
                      isSaving={this.props.isSaving}
                      selected={img.selected}
                      outlineWidth={Math.min(
                        1,
                        Math.min(rectHeight * scale, rectWidth * scale) / 100
                      )}
                      style={{
                        // zIndex: img.zIndex,
                        width: img.width * scale + "px",
                        height: img.height * scale + "px",
                        left: img.left * scale + "px",
                        top: img.top * scale + "px",
                        position: "absolute",
                        transform: `rotate(${
                          img.rotateAngle ? img.rotateAngle : 0
                        }deg)`
                      }}
                    >
                      <div
                        id={img._id + "___"}
                        style={{
                          width: img.width + "px",
                          height: img.height + "px",
                          transform: `scale(${scale})`,
                          transformOrigin: "0 0"
                        }}
                        key={img._id}
                        onMouseDown={this.props.handleImageSelected.bind(
                          this,
                          img
                        )}
                      >
                        <ResizableRect
                          rotating={this.props.rotating}
                          dragging={this.props.dragging}
                          resizing={this.props.resizing}
                          id={img._id + "_2"}
                          opacity={img.opacity}
                          bleed={this.props.bleed}
                          showImage={true}
                          hidden={true}
                          objectType={img.type}
                          selected={img.selected}
                          showController={false}
                          key={img._id + "2"}
                          _id={img._id}
                          left={img.left}
                          top={img.top}
                          width={img.width}
                          height={img.height}
                          scale={scale}
                          rotateAngle={img.rotateAngle}
                          aspectRatio={img.width / img.height}
                          zoomable="n, w, s, e, nw, ne, se, sw"
                          onRotateStart={this.props.handleRotateStart}
                          onRotate={this.props.handleRotate.bind(this)}
                          onRotateEnd={this.props.handleRotateEnd}
                          onResizeStart={this.props.handleResizeStart}
                          onResize={this.props.handleResize.bind(this)}
                          onResizeEnd={this.props.handleResizeEnd}
                          onDragStart={
                            img.type === TemplateType.BackgroundImage
                              ? null
                              : this.props.handleDragStart.bind(this)
                          }
                          onDrag={this.props.handleDrag.bind(this)}
                          onDragEnd={this.props.handleDragEnd}
                          updateStartPos={img.updateStartPos}
                          src={img.src}
                          onTextChange={this.props.onSingleTextChange.bind(
                            this,
                            img
                          )}
                          innerHTML={img.innerHTML}
                          scaleX={img.scaleX}
                          scaleY={img.scaleY}
                          zIndex={1}
                          childrens={img.document_object}
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
                          posX={img.posX}
                          posY={img.posY}
                          handleImageDrag={this.props.handleImageDrag.bind(
                            this,
                            img._id
                          )}
                          enableCropMode={this.props.enableCropMode}
                          cropMode={cropMode}
                          imgWidth={img.imgWidth}
                          imgHeight={img.imgHeight}
                          imgColor={img.color}
                          onImageResize={this.props.handleImageResize.bind(
                            this
                          )}
                          resizingInnerImage={this.props.resizingInnerImage}
                          onResizeInnerImageStart={this.props.onResizeInnerImageStart.bind(
                            this
                          )}
                          startX={this.props.startX}
                          startY={this.props.startY}
                          updateRect={this.props.updateRect}
                          backgroundColor={img.backgroundColor}
                        />
                      </div>
                    </ResizableRectWrapper>
                  </div>
                ))}
            </div>
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
            Thêm 1 trang
          </a>
        )}
      </ResizableRectContainer>
    );
  }
}

const ResizableRectWrapper = StyledComponent.div`
  
`;

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
