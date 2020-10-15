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
    cursor: pointer;
    position: relative;
    background-size: 300% 300%;
    position: relative;
    width: ${props => props.width}px;
    height: ${props =>
            props.loaded ? props.height : props.defaultHeight + "px"};
    margin-bottom: 8px;
    margin-right: 8px;
    button {
        visibility: hidden;
    }
    opacity ${props => (props.loaded ? 1 : 0.15)};
    display: inline-block;
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
                    height: this.props.height + "px",
                    marginBottom: "8px",
                    opacity: this.state.loaded ? 1 : 0.07,
                    animationName: "XhtCamN749DcvC-ecDUzp",
                    animation: this.state.loaded
                        ? "none"
                        : "LuuT-RWT7fXcJFhRfuaKV 1.4s infinite",
                    animationDelay: this.props.delay + 'ms',
                    backgroundColor: this.state.loaded ? "transparent" : "#fff",
                }}
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
                                marginBottom: "8px",
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
                <svg className="playIcon___2MyHG" viewBox="0 0 16 16" width="16" height="16" 
                                // style="/* transform:translateX(-6px) translateY(-6px); */position: absolute;bottom: 5px;right: 4px;width: 20px;height: 20px;"
                                style={{
                                    position: 'absolute',
                                    bottom: '5px',
                                    right: '4px',
                                    width: '20px',
                                    height: '20px',
                                    opacity: 0.7,
                                }}
                            >
                                <g opacity="0.94"><rect width="16" height="16" rx="4" fill="white"></rect><path d="M6.53 12.0438C5.86395 12.46 5 11.9812 5 11.1958V4.80425C5 4.01881 5.86395 3.53997 6.53 3.95625L11.6432 7.152C12.2699 7.54367 12.2699 8.45633 11.6432 8.848L6.53 12.0438Z" fill="#121316"></path></g></svg>
                {(this.props.showDuration && this.props.duration && this.state.loaded) ? 
                    <Duration>{secondToMinutes(this.props.duration)}</Duration> : null}
            </Container>
        );
    }
}

const Duration = styled.span`
    position: absolute;
    left: 3px;
    bottom: 3px;
    background: #0000007d;
    padding: 2px 5px;
    font-size: 10px;
    border-radius: 6px;
`;