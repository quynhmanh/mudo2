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
  height: ${props => props.loaded ? props.height : props.defaultHeight + "px"};
  margin-bottom: 0px;
  width: auto;
  transition-duration: 0.4s;
  transition-property: opacity, left, top, width;

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
                width={width}
                delay={this.props.delay} 
                id={this.props.id}
                loaded={loaded}
                height={this.props.height}
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
                        borderRadius: '5px',
                        border: "1px solid rgba(0, 0, 0, 0.1)",
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
            </Container>
        );
    }
}
