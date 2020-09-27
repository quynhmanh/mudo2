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
    path: string;
    clipId: string;
    clipWidth: number;
    clipHeight: number;
    path2: any;
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
            path,
            clipId,
            clipWidth,
            clipHeight,
            path2,
        } = this.props;

        src = src && src.replace("http://167.99.73.132:64099", "https://draft.vn");
        srcThumnail = srcThumnail && srcThumnail.replace("http://167.99.73.132:64099", "https://draft.vn");

        let clipScale = width / clipWidth;

        try {
            path2 = JSON.parse(path2);
            path2 = path2 ? path2.path2 : null;
        } catch (e) {
            path2 = [];
        }

        return (
            <div>
                <div>
                    {Array.isArray(path2) && path2.map(p => 
                    <svg style={{
                        overflow: 'visible',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                    }} viewBox={`0 0 ${clipWidth} ${clipHeight}`}><path d={p.path} fill={p.fill}></path></svg>)}
                </div>
                <div
                    style={{
                        clipPath: `url(#${clipId}${this.props.name})`,
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
                    {/* <svg
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
                    viewBox="0 0 500 499.998"><defs><clipPath id={"__id1_0" + this.props.name}><path d="M440.102 79.27c-9.778-16.932-27.509-26.405-45.749-26.418l.003-.003c-18.24-.016-35.974-9.488-45.749-26.418-14.586-25.267-46.892-33.922-72.159-19.333l-.004.003v-.016c-15.693 9.041-35.609 9.757-52.466.198A52.578 52.578 0 0 0 197.201 0c-19.551 0-36.619 10.623-45.755 26.412v-.003c-9.133 15.786-26.205 26.409-45.753 26.409-29.175 0-52.824 23.649-52.824 52.824v.006l-.016-.006c-.016 18.101-9.345 35.698-26.03 45.521a52.552 52.552 0 0 0-19.722 19.559c-9.776 16.934-9.111 37.025-.003 52.83h-.003c9.101 15.802 9.766 35.895-.01 52.827-14.585 25.264-5.931 57.57 19.336 72.159l.003.003-.01.007c15.789 9.129 26.407 26.201 26.407 45.752 0 29.175 23.649 52.824 52.823 52.824 19.552 0 36.617 10.621 45.756 26.41 9.133 15.782 26.204 26.41 45.753 26.41a52.61 52.61 0 0 0 26.777-7.284c16.853-9.557 36.774-8.841 52.466.203v-.019l.003.006c25.267 14.586 57.573 5.928 72.163-19.336 9.775-16.929 27.506-26.403 45.746-26.416l-.004-.007c18.24-.013 35.974-9.487 45.746-26.416 4.813-8.335 7.097-17.439 7.087-26.417l.007.006c.016-17.594 8.832-34.719 24.652-44.682 8.528-4.484 15.929-11.355 21.1-20.312 9.779-16.938 9.114-37.031.007-52.833h.003c-9.104-15.802-9.77-35.895.007-52.828 14.589-25.267 5.931-57.57-19.336-72.159l-.004-.004.01-.003c-15.662-9.062-26.236-25.935-26.403-45.291.092-9.134-2.185-18.404-7.078-26.882"></path></clipPath></defs></svg> */}
                    <svg style={{
                        overflow: 'visible',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                    }} viewBox={`0 0 ${clipWidth} ${clipHeight}`}><defs><clipPath id={clipId + this.props.name}><path d={path}></path></clipPath></defs></svg>
                    <img
                        id={_id + "1235" + canvas}
                        className={`${_id}1239`}
                        style={{
                            zIndex: 9999999,
                            width: (imgWidth / clipScale) + "px",
                            height: (imgHeight / clipScale) + "px",
                            transform: `translate(${posX / clipScale}px, ${posY / clipScale}px)`,
                            opacity: 1,
                            transformOrigin: "0 0",
                            backgroundColor: backgroundColor
                        }}
                        onDoubleClick={enableCropMode}
                        src={src}
                    />
                </div>
            </div>
        );
    }
}