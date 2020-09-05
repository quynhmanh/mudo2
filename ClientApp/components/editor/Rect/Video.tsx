import React, { Component } from 'react'

export interface IProps {
    _id: string;
    imgWidth: any;
    imgHeight: any;
    posX: any;
    posY: any;
    selected: any;
    cropMode: any;
    outlineWidth: any;
    backgroundColor: any;
    src: any;
    srcThumnail: any;
    canvas: string;
    showController: boolean;
    opacity: any;
    rotateAngle: any;
    parentRotateAngle: any;
    startResizeImage: any;
    paused: boolean;
}

export interface IState {
    loaded: boolean;
}

const imgResizeDirection = ["nw", "ne", "se", "sw"];

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

export default class Video extends Component<IProps, IState> {

  constructor(props: any) {
    super(props);
    this.state = {
        loaded: false,
    }
  }

  ref = null;

  componentDidUpdate(prevProps, prevState, snapshot) {
    //   console.log('componentDidUpdate ', this.props.paused);
    // if (this.props.paused) {
    //     console.log('play');
    //     this.ref.play();
    // } else {
    //     console.log('paused')
    //     this.ref.pause();
    // }
  }


  render () {
      let {showController, opacity, _id, imgWidth, imgHeight, posX, posY, selected, cropMode, outlineWidth, rotateAngle, parentRotateAngle, src, srcThumnail, canvas} = this.props;
    return (
        <div
              id={_id + "1238" + canvas}
              className={_id + "rect-alo" + " " + _id + "imgWidth " + _id + "1236"}
              style={{
                transform: `translate(${posX}px, ${posY}px)`,
                width: imgWidth + "px",
                height: imgHeight + "px"
              }}
            >
              {/* <div 
              onClick={e => {
                  if (this.ref.paused) {
                      this.ref.pause();
                  } else {
                      this.ref.play();
                  }
              }}
              style={{
                position: "absolute",
                left: "calc(50% - 25px)",
                top: "calc(50% - 25px)",
                backgroundColor: "rgba(17,23,29,.6)",
                borderRadius: "100%",
                width: "50px",
                height: "50px",
              }}>
                <span style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  position: "relative",
                }}>
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
                </span>
              </div>
               */}
              <video
                id={_id + "video" + canvas} 
                ref={i => this.ref = i}
                style={{
                  width: "100%",
                  height: "100%",
                  transformOrigin: "0 0",
                  outline: cropMode
                    ? `#00d9e1 solid ${outlineWidth - 1}px`
                    : null,
                  opacity,
                  pointerEvents: "none",
                }}
                autoPlay={canvas == "alo" ? false : true}
                muted
                loop
              >
                <source src={src} type="video/webm" />
              </video>
            </div>
    );
  }
}