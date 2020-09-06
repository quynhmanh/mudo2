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

    render() {
        let { showController, opacity, _id, imgWidth, imgHeight, posX, posY, selected, cropMode, outlineWidth, rotateAngle, parentRotateAngle, src, srcThumnail, canvas } = this.props;
        return (
            <div
                id={_id + "1238" + canvas}
                className={_id + "1236"}
                style={{
                    transform: `translate(${posX}px, ${posY}px)`,
                    width: imgWidth + "px",
                    height: imgHeight + "px"
                }}
            >
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