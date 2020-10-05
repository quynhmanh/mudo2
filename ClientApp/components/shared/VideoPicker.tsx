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
    mediaLoaded: any;
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
  button {
    visibility: hidden;
  }
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

    shouldComponentUpdate(nextProps) {
        if (this.props.id != nextProps.id) {
            return true;
        }
        return false;
    }

    componentDidMount() {
        // const img = this.image;

        // if (img && img.readyState == 4) {
        //     this.handleImageLoaded();
        // }
    }

    image = null;

    handleImageLoaded() {
        this.props.mediaLoaded(true);
    }

    render() {
        let { loaded, width } = this.state;

        return (
            <Container 
                style={{
                    position: 'relative',
                    backgroundSize: '300% 300%',
                    // height: `200px`,
                    width: 'auto',
                    marginBottom: '0px',
                    transitionDuration: '0.4s',
                    transitionProperty: 'opacity, left, top, width',
                    // backgroundColor: '#eee',
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
                            {/* <svg width="16" height="16" viewBox="0 0 16 16"><defs><path id="_2658783389__a" d="M3.25 9.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"></path></defs><use fill="black" xlinkHref="#_2658783389__a" fillRule="evenodd"></use></svg> */}
                            <svg className="playIcon___2MyHG" viewBox="0 0 16 16" width="16" height="16" 
                                // style="/* transform:translateX(-6px) translateY(-6px); */position: absolute;bottom: 5px;right: 4px;width: 20px;height: 20px;"
                                style={{
                                    position: 'absolute',
                                    bottom: '5px',
                                    right: '4px',
                                    width: '20px',
                                    height: '20px',
                                }}
                            >
                                <g opacity="0.94"><rect width="16" height="16" rx="4" fill="white"></rect><path d="M6.53 12.0438C5.86395 12.46 5 11.9812 5 11.1958V4.80425C5 4.01881 5.86395 3.53997 6.53 3.95625L11.6432 7.152C12.2699 7.54367 12.2699 8.45633 11.6432 8.848L6.53 12.0438Z" fill="#121316"></path></g></svg>
                        </span>
                    </button>
                }
                <video
                    ref={i => this.image = i}
                    id={`video-${this.props.keys}`}
                    autoPlay={false}
                    loop={true}
                    muted={true}
                    ref={i => this.image = i}
                    className={this.props.className}
                    style={{
                        height: '100%',
                        marginBottom: '8px',
                        pointerEvents: "all",
                        opacity: 0,
                        transition: 'opacity 0.1s linear',
                        borderRadius: '4px',
                    }}

                    onLoadedMetadata={e => {
                        this.handleImageLoaded();
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
                <svg 
                    style={{
                        position: 'absolute',
                        top: '3px',
                        left: '6px',
                        width: '26px',
                        height: '28px',
                        fill: 'white',
                    }}
                xmlns="http://www.w3.org/2000/svg" id="Capa_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512"><path d="m226 208.07v95.86l76.699-47.93z"/><path d="m75 451h362c41.353 0 75-33.647 75-75v-240c0-41.353-33.647-75-75-75h-362c-41.353 0-75 33.647-75 75v240c0 41.353 33.647 75 75 75zm121-270c0-5.449 2.959-10.474 7.734-13.125 4.717-2.637 10.591-2.505 15.22.41l120 75c4.38 2.739 7.046 7.544 7.046 12.715s-2.666 9.976-7.046 12.715l-120 75c-2.432 1.523-5.185 2.285-7.954 2.285-2.505 0-5.01-.63-7.266-1.875-4.775-2.651-7.734-7.676-7.734-13.125z"/></svg>
            </Container>
        );
    }
}
