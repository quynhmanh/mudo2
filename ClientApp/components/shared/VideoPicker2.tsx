import React, { Component, } from "react";
import styled from "styled-components";
import { secondToMinutes } from "@Utils";
import editorStore from "@Store/EditorStore";

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
    duration: number;
    showDuration: boolean;
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
  height: ${props =>
        props.loaded ? props.height : props.defaultHeight + "px"};
  margin-bottom: 8px;
  button {
    visibility: hidden;
  }
  opacity ${props => (props.loaded ? 1 : 0.15)};
  animation-name: XhtCamN749DcvC-ecDUzp;
  animation: ${props =>
        props.loaded ? "none" : "LuuT-RWT7fXcJFhRfuaKV 1.4s infinite"};
  animation-delay: ${props => props.delay}ms;
  :hover button {
    visibility: visible;
  }
`;

export default class VideoPicker2 extends Component<IProps, IState> {
    state = {
        loaded: false,
        width: 300
    };

    static defaultProps = {
        duration: 0,
        showDuration: false,
    }

    shouldComponentUpdate() {
        if (this.state.loaded) {
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
        img.pause();

        var ratio = img.videoWidth / img.videoHeight;

        if (!ratio || !this.state.loaded) {
            this.setState({ loaded: true, width: ratio * 160 });
        }
    }

    render() {
        let { loaded } = this.state;
        return (
            <Container
                style={{
                    position: "relative",
                    backgroundSize: "300% 300%",
                    width: `${this.props.width}px`,
                    height: `${this.state.loaded
                            ? this.props.height
                            : this.props.defaultHeight + "px"
                        }`,
                    marginBottom: "8px",
                    opacity: this.state.loaded ? 1 : 0.15,
                    animationName: "XhtCamN749DcvC-ecDUzp",
                    animation: this.state.loaded
                        ? "none"
                        : "LuuT-RWT7fXcJFhRfuaKV 1.4s infinite",
                    animationDelay: "100ms",
                    backgroundColor: this.state.loaded ? "transparent" : "#fff",
                }}
                delay={this.props.delay}
                id={this.props.id}
                loaded={loaded}
                height={this.props.height}
                width={this.state.loaded ? this.state.width : this.props.width}
                defaultHeight={this.props.defaultHeight}
            >
                {this.props.showButton &&
                    editorStore.isAdmin && (
                        <button
                            style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                                borderRadius: "13px",
                                border: "none",
                                padding: "0 4px",
                                boxShadow:
                                    "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                                zIndex: 123,
                                background: "white",
                            }}
                            onClick={this.props.onEdit}
                        >
                            <span>
                                <svg width="16" height="16" viewBox="0 0 16 16">
                                    <defs>
                                        <path
                                            id="_2658783389__a"
                                            d="M3.25 9.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"
                                        ></path>
                                    </defs>
                                    <use
                                        fill="black"
                                        xlinkHref="#_2658783389__a"
                                        fillRule="evenodd"
                                    ></use>
                                </svg>
                            </span>
                        </button>
                    )}
                <video
                    onMouseEnter={e => {
                        this.image.play();
                    }}
                    onMouseLeave={e => {
                        this.image.pause();
                    }}
                    id="video1"
                    loop={true}
                    muted={true}
                    onEnded={(e) => { this.image.play(); }}
                    ref={i => (this.image = i)}
                    className={this.props.className}
                    style={
                        loaded
                            ? {
                                height: this.props.height + "px",
                                width: "100%",
                                marginBottom: "10px",
                                backgroundColor: 'transparent',
                            }
                            : { display: "none" }
                    }
                    onLoadStart={e => {
                        // this.handleImageLoaded();
                    }}
                    onLoadedMetadata={e => {
                        // this.image.play();
                        // this.setState({loaded: true})
                        // this.handleImageLoaded();
                    }}
                    onCanPlay={e => {
                        // console.log('onCanPlay');
                        this.handleImageLoaded();
                    }}
                    onLoadedData={e => {
                        this.image.pause();
                        // this.handleImageLoaded();
                    }}
                    onError={e => {
                    }}
                    src={this.props.src}
                    onMouseDown={this.props.onPick}
                />
                {this.props.showDuration && this.props.duration && this.state.loaded && 
                    <span
                        style={{
                            position: "absolute",
                            left: "3px",
                            bottom: "3px",
                            background: "#0000007d",
                            padding: "2px 5px",
                            fontSize: "12px",
                            borderRadius: "6px",
                        }}
                    >{secondToMinutes(this.props.duration)}</span>}
            </Container>
        );
    }
}
