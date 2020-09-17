import React, { Component } from "react";
import styled from 'styled-components';
import editorStore from "@Store/EditorStore";
import { t } from "i18next";

export interface IProps {
    src: string;
    onPick: any;
    onEdit: any;
    className: string;
    height: number;
    defaultHeight: number;
    width: number;
    color: string;
    id: string;
    delay: number;
    showButton: boolean;
    backgroundColorLoaded: string;
    backgroundColor: string;
    transitionEnd: boolean;
    keys: any;
    startPoint: any;
}

export interface IState {
    loaded: boolean;
    width: number;
}

const Container = styled.div`
  position: relative;
  background-size: 300% 300%;
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.loaded ? props.height : props.defaultHeight + "px"};
  margin-bottom: 8px;
  background-color: ${props => props.loaded ? "none" : "#00000030"};
  button {
    visibility: hidden;
  }
  background: #fff;
  opacity ${props => props.loaded ? 1 : 0.15};
  :hover button {
    visibility: visible;
  }
`

export default class VideoPicker extends Component<IProps, IState> {
    state = {
        loaded: false,
        width: 300,
    };

    static defaultProps = {
        classNameContainer: "",
        padding: 0,
        backgroundColor: null,
        backgroundColorLoaded: "rgba(255, 255, 255, 0.07)",
    }

    shouldComponentUpdate() {
        if (this.state.loaded && this.props.transitionEnd) {
            return false;
        }

        return true;
    }

    componentDidMount() {
        const img = this.image;

        if (img && img.readyState == 4) {
            this.handleImageLoaded();
        }
    }

    image = null;

    handleImageLoaded() {
        const img = this.image;

        var ratio = img.videoWidth / img.videoHeight;

        if (!ratio || !this.state.loaded) {
            this.setState({ loaded: true, width: ratio * 160 });
        }
    }

    render() {
        let { loaded, width } = this.state;


        return (
            <Container 
                style={{
                    position: 'relative',
                    backgroundSize: '300% 300%',
                    height: `200px`,
                    width: 'auto',
                    marginBottom: '8px',
                    animationName: 'XhtCamN749DcvC-ecDUzp',
                    animation: loaded && this.props.transitionEnd ? "none" : "LuuT-RWT7fXcJFhRfuaKV 1.4s infinite",
                    animationDelay: '100ms',
                    transitionDuration: '0.4s',
                    transitionProperty: 'opacity, left, top, width',
                    backgroundColor: loaded && this.props.transitionEnd ? 'transparent' : '#797979',
                }} 
                delay={this.props.delay} 
                id={this.props.id}
                loaded={loaded}
                height={this.props.height}
                width={loaded ? width : this.props.width}
                defaultHeight={this.props.defaultHeight}
            >
                {this.props.showButton && editorStore.isAdmin &&
                    <button
                        style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            borderRadius: '13px',
                            border: 'none',
                            padding: '0 4px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                            zIndex: 123,
                            background: 'white',
                        }}
                        onClick={this.props.onEdit}
                    ><span>
                            <svg width="16" height="16" viewBox="0 0 16 16"><defs><path id="_2658783389__a" d="M3.25 9.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"></path></defs><use fill="black" xlinkHref="#_2658783389__a" fillRule="evenodd"></use></svg>
                        </span>
                    </button>
                }
                <video
                    id={`video-${this.props.keys}`}
                    autoPlay={false}
                    loop={true}
                    muted={true}
                    ref={i => this.image = i}
                    className={this.props.className}
                    style={{
                        height: '100%',
                        marginBottom: '10px',
                        pointerEvents: "all",
                        // backgroundColor: 'black',
                        opacity: loaded && this.props.transitionEnd ? 1 : 0,
                        transition: 'opacity 0.2s linear',
                    }}

                    onLoadedMetadata={e => {
                        console.log('startPOint ', this.props.startPoint)
                        this.handleImageLoaded();
                        if (this.props.startPoint == this.props.keys) {
                            this.props.loadImage(this.props.keys + 1);
                        } 
                    }}

                    // onCanPlay={(e) => {
                    //     this.handleImageLoaded();
                    // }
                    // }

                    onMouseEnter={e => {
                        this.image.play();
                    }}
                    onMouseLeave={e => {
                        this.image.pause();
                    }}

                    src={this.props.startPoint == this.props.keys ? this.props.src : ""}
                    onMouseDown={this.props.onPick}
                />
            </Container>
        );
    }
}
