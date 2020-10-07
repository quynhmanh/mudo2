import React, { Component, } from 'react';
import styled from 'styled-components';
import ImagePicker from "@Components/shared/ImagePicker2";
import VideoPicker from "@Components/shared/VideoPicker";

interface IProps {
    dataValue: string;
    href: string;
    pickerType: string;
    pickerSrc: string;
    pickerWidth: number;
    title: string;
    size: string;
    id: string;
    width: number;
    height: number;
    isVideo: boolean;
    videoRepresentative: string;
    representative: string;
    keys: number;
    startPoint: number;
    loadImage: any;
    prefix: any;
}

interface IState {
    transitionEnd: boolean;
    loaded: boolean;
}

const HEIGHT = 200;

export default class PopularTemplateItem3 extends Component<IProps, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
            transitionEnd: this.props.id != "sentinel-image2" ? true: false,
            loaded: false,
        }

        this.mediaLoaded = this.mediaLoaded.bind(this);
    }

    mediaLoaded(loaded, transitionEnd) {
        if (loaded) this.loaded = true;
        if (transitionEnd) this.transitionEnd = true;

        if (this.loaded && this.transitionEnd && !this.transitioned) {
            this.cc.style.animation = "";
            this.cc.style.background = "transparent";
            this.cc.style.opacity = 1;
            this.picker.image.style.opacity = 1;
            this.transitioned = true;
            setTimeout(() => {
                this.props.loadImage(this.props.keys + 1);
            }, 50);
        }
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.id != nextProps.id) {
            return true;
        }
        return false;
    }

    loaded = false;
    transitionEnd = true;
    transitioned = false;
    cc = null;
    picker = null;

    render() {
        const props = this.props;
        let picker = null;
        if (props.isVideo) {
            picker = <VideoPicker
                id={props.id}
                keys={props.keys}
                key={"1"}
                color={""}
                delay={0}
                height={props.height}
                onPick={(e) => {}}
                onEdit={(e) => {
                    window.open(`/editor/design/${props.id}`)
                }}
                className={""}
                showButton={false}
                defaultHeight={HEIGHT}
                src={props.videoRepresentative}
                width={props.width}
                backgroundColor="black"
                transitionEnd={this.state.transitionEnd}
                startPoint={this.props.startPoint}
                loadImage={this.props.loadImage}
                mediaLoaded={this.mediaLoaded}
                ref={i => this.picker = i}
            />
        } else {
            picker = <ImagePicker
                id={props.id}
                keys={props.keys}
                prefix={this.props.prefix}
                key={"1"}
                color={""}
                delay={100}
                height={HEIGHT}
                onPick={(e) => {}}
                onEdit={(e) => {
                    window.open(`/editor/design/${props.id}`)
                }}
                className={""}
                showButton={false}
                defaultHeight={HEIGHT}
                src={props.representative}
                // backgroundColor="black"
                transitionEnd={this.state.transitionEnd}
                startPoint={this.props.startPoint}
                loadImage={this.props.loadImage}
                animation={false}
                mediaLoaded={this.mediaLoaded}
                ref={i => this.picker = i}
            />
        }

        let width = 141;
        // if (props.width == props.height && props.id != "sentinel-image2") {
        //     width = 199;
        // }


        return (
            <CC
                ref={i => this.cc = i}
                style={{ 
                    marginRight: '24px',
                    animation: "TB8Ekw 1.4s infinite",
                    background: 'black',
                    animationDelay: (-1200 + (this.props.keys - this.props.startPoint) * 120) + "ms",
                    opacity: 0.7,
                }}
                className="templateWrapper___3Fitk"
                onClick={e => {
                    if (window.dragging) e.preventDefault();
                }}
            >
                <a 
                    target="_blank" 
                    data-categ="popularTemplates"
                    data-subcateg="home"  
                    data-value={props.dataValue} 
                    href={props.href}
                >
                    <div 
                        className="" 
                        style={{
                            position: 'relative',
                            borderRadius: '4px',
                        }}>
                        <div
                            style={{ 
                                paddingTop: 0,
                                width: `${width}px`,
                                transitionDuration: '0.25s',
                                transitionProperty: 'opacity, width',
                            }}>
                            {picker}
                        </div>
                    </div>
                </a>
                <div 
                    className="templateInfo___2YZSg"
                >
                    <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">{props.title}</p>
                    <p className="x-small___1lJKy size___1sVBg">{props.size}</p>
                </div>
            </CC>
        );
    }
}

var CC = styled.li`
    position: relative;
    height: 100%;
    margin-right: 16px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 7px;
`;