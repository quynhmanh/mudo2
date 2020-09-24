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
    enableCropMode: any;
    src: any;
    srcThumnail: any;
    canvas: string;
    name: any;
    clipScale: any;
    width: number;
    height: number;
}

export interface IState {
    loaded: boolean;
}

export default class Image extends Component<IProps, IState> {

    constructor(props: any) {
        super(props);
        this.state = {
            loaded: false,
        }
    }

    render() {
        let {
            _id,
            imgWidth,
            imgHeight,
            posX,
            posY,
            backgroundColor,
            enableCropMode,
            src,
            srcThumnail,
            canvas,
            width,
            height,
        } = this.props;

        src = src && src.replace("http://167.99.73.132:64099", "https://draft.vn");
        srcThumnail = srcThumnail && srcThumnail.replace("http://167.99.73.132:64099", "https://draft.vn");

        return (
            <div
                style={{
                    clipPath: `url(#__id1_0${this.props.name})`,
                }}>
                {/* {!window.downloading && !this.state.loaded && <img
                    style={{
                        visibility: "hidden",
                    }}
                    src={src}
                    onLoad={e => {
                        this.setState({
                            loaded: true,
                        })
                    }}
                />
                } */}
                {/* {this.props.name == CanvasType.All &&  */}
                <svg
                    style={{
                        overflow: 'visible',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                    }}
                    viewBox="0 0 500 499.998"><defs><clipPath id={"__id1_0" + this.props.name}><path d="M500 250.002c0 138.065-111.931 249.996-250 249.996-138.071 0-250-111.931-250-249.996C0 111.93 111.929 0 250 0s250 111.93 250 250.002z" /></clipPath></defs></svg>
                {/* } */}
                <img
                    id={_id + "1235" + canvas}
                    className={`${_id}1236`}
                    style={{
                        zIndex: 9999999,
                        width: (imgWidth / (width / 500)) + "px",
                        height: (imgHeight / (width / 500)) + "px",
                        transform: `translate(${posX}px, ${posY}px)`,
                        opacity: 1,
                        transformOrigin: "0 0",
                        backgroundColor: backgroundColor
                    }}
                    onDoubleClick={enableCropMode}
                    src={src}
                />

                <svg style={{
                    overflow: 'visible',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                }} viewBox="0 0 500 499.998"><use
                    xlinkHref={this.props.name == CanvasType.All ? `#__id1_00` : `#__id1_02`}></use></svg>
            </div>
        );
    }
}