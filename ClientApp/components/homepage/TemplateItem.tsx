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
    itemWidth: number;
    itemHeight: number;
}

interface IState {
    transitionEnd: boolean;
    loaded: boolean;
}

export default class TemplateItem extends Component<IProps, IState> {

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
            this.props.loadImage(this.props.keys + 1);
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
                defaultHeight={props.itemHeight}
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
                height={props.itemHeight}
                onPick={(e) => {}}
                onEdit={(e) => {
                    window.open(`/editor/design/${props.id}`)
                }}
                className={""}
                showButton={false}
                defaultHeight={props.itemHeight}
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

        // if (props.width == props.height && props.id != "sentinel-image2") {
        //     width = 199;
        // }


        return (
            <CC
                ref={i => this.cc = i}
                style={{ 
                    background: 'black',
                    borderRadius: "4px",
                    marginBottom: '35px',
                    opacity: 0.07,
                    height: this.props.itemHeight + "px",
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
                                width: `${this.props.itemWidth + 2}px`,
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

var CC = styled.div`
    position: relative;
    margin-right: 16px;
    margin-bottom: 16px;
`;