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
    keys: string;
    startPoint: number;
}

interface IState {
    transitionEnd: boolean;
    loaded: boolean;
}

const HEIGHT = 200;

export default class PopularTemplateItem extends Component<IProps, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
            transitionEnd: this.props.id != "sentinel-image2" ? true: false,
            loaded: false,
        }

        this.mediaLoaded = this.mediaLoaded.bind(this);
    }

    mediaLoaded() {
        console.log('mediaLoaded' , this.props.keys)
        // this.setState({loaded: true})
        this.cc.style.backgroundColor = "transparent";
        this.cc.style.animation = "";
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.id != nextProps.id) {
            return true;
        }
        return false;
    }

    cc = null;

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
            />
        } else {
            picker = <ImagePicker
                id={props.id}
                keys={props.keys}
                prefix="2"
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
                backgroundColor="black"
                transitionEnd={this.state.transitionEnd}
                startPoint={this.props.startPoint}
                loadImage={this.props.loadImage}
                animation={false}
                mediaLoaded={this.mediaLoaded}
            />
        }

        let width = props.width / props.height * 200;
        if (props.width == props.height && props.id != "sentinel-image2") {
            width = 199;
        }

        console.log('(this.props.keys - this.props.startPoint) * 120 + "ms" ', this.props.keys, this.props.startPoint, (this.props.keys - this.props.startPoint) * 120 + "ms")

        return (
            <CC
                ref={i => this.cc = i}
                style={{ 
                    marginRight: '24px',
                    animation: this.state.loaded && this.state.transitionEnd ? "" : "TB8Ekw 1.4s infinite",
                    backgroundColor: this.state.loaded && this.state.transitionEnd ? "transparent" : 'black',
                    animationDelay: (-1200 + (this.props.keys - this.props.startPoint) * 120) + "ms",
                    borderRadius: "4px",
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
                            overflow: 'hidden',
                        }}>
                        <div
                            onTransitionEnd={e => {
                                this.setState({transitionEnd: true});
                            }}
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
    height: ${HEIGHT}px;
    margin-right: 16px;
    transition: .3s;
`;