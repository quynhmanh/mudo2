import React, { Component } from 'react'
import { CanvasType } from '../enums';

export interface IProps {
    _id: string;
    imgWidth: any;
    imgHeight: any;
    posX: any;
    posY: any;
    selected: any;
    cropMode: any;
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
    setMax: any;
    setCurrentTime: any;
    name: any;
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
        let { 
            opacity,
            _id,
            imgWidth,
            imgHeight,
            posX,
            posY,
            src,
            canvas 
        } = this.props;
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
                <canvas
                    id={_id + "video4" + canvas + this.props.name}
                    style={{
                        width: "200%",
                        height: "200%",
                        transformOrigin: "0 0",
                        opacity: 1,
                        position: "absolute",
                        transform: 'scale(0.5)',
                    }}
                />
                <video
                    id={_id + "video" + this.props.name + canvas}
                    ref={i => this.ref = i}
                    style={{
                        width: "100%",
                        height: "100%",
                        transformOrigin: "0 0",
                        opacity: this.props.name == CanvasType.HoverLayer ? 0 : opacity,
                        pointerEvents: "none",
                    }}
                    autoPlay={canvas == "alo" ? false : true}
                    muted
                    loop
                    onLoadedMetadata={e => {
                        let el = document.getElementById(_id + "progress1");
                        let video = e.target as HTMLVideoElement;
                        el.setAttribute('max', video.duration.toString());
                    }}
                    onTimeUpdate={e => {
                        let video = e.target as HTMLVideoElement;
                        if (this.props.name == CanvasType.All) {
                            let progress = document.getElementById(_id + "progress1");
                            let progressBar = document.getElementById(_id + "progress-bar1");
                            let progressBarPointer = document.getElementById(_id + "progress-bar-pointer1");
                            if (!progress.getAttribute('max')) progress.setAttribute('max', video.duration.toString());
                            progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
                            progressBarPointer.style.left = `calc(${video.currentTime / video.duration * 100}% - 7.5px)`;
                        } else {
                            video.style.opacity = opacity;
                        }
                    }}
                >
                    <source src={src.replace("http://167.99.73.132:64099", "https://draft.vn")} type="video/webm" />
                </video>
            </div>
        );
    }
}