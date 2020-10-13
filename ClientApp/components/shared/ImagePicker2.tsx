import React, { Component, Fragment, isValidElement } from "react";
import styled from 'styled-components';
import Globals from '@Globals';

export interface IProps {
    src: string;
    onPick: any;
    onEdit: any;
    className: string;
    classNameContainer: string;
    height: number;
    defaultHeight: number;
    width: number;
    color: string;
    id: string;
    delay: number;
    showButton: boolean;
    padding: number;
    backgroundColor: string;
    prefix: string;
    transitionEnd: boolean;
    animation: boolean;
    mediaLoaded: any;
    keys: number;
    startPoint: number;
    hasBorder: boolean;
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
  button {
    visibility: hidden;
  }
  :hover button {
    visibility: visible;
  }
`

export default class ImagePicker extends Component<IProps, IState> {
    state = {
        loaded: false,
        width: 200,
    };

    static defaultProps = {
        classNameContainer: "",
        padding: 0,
        backgroundColor: null,
        hasBorder: true,
    }

    constructor(props) {
        super(props);

        this.handleImageLoaded = this.handleImageLoaded.bind(this);
    }

    componentDidMount() {
        // const img = this.image;
        // if (img && img.complete) {
        //     this.handleImageLoaded();
        // }
    }

    image = null;

    handleImageLoaded() {
        this.props.mediaLoaded(true);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.id != nextProps.id) {
            return true;
        }
        return false;
    }

    render() {
        let { loaded } = this.state;
        return (
            <Container
                className={this.props.classNameContainer}
                style={{
                    position: 'relative',
                    backgroundSize: '300% 300%',
                    width: this.props.width ? this.props.width + "px" : 'auto',
                    display: "flex",
                    height: this.props.defaultHeight + "px",
                    backgroundColor: this.props.backgroundColor,
                    transitionDuration: '0.4s',
                    transitionProperty: 'opacity, left, top, width',
                    padding: this.props.padding ? `${this.props.padding}px` : 0,
                }}
                delay={this.props.delay} id={this.props.id} loaded={loaded} height={this.props.height} width={this.state.loaded ? this.state.width : this.props.width} defaultHeight={this.props.defaultHeight}>
                {this.props.showButton && Globals.serviceUser && Globals.serviceUser.username && (Globals.serviceUser.username === "llaugusty@gmail.com" || Globals.serviceUser.username === "hoangson1024@gmail.com") &&
                    <button
                        style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            borderRadius: '13px',
                            border: 'none',
                            padding: '0 4px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                            background: 'white',
                        }}
                        onClick={this.props.onEdit}
                    ><span>
                            <svg width="16" height="16" viewBox="0 0 16 16"><defs><path id="_2658783389__a" d="M3.25 9.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"></path></defs><use fill="black" xlinkHref="#_2658783389__a" fillRule="evenodd"></use></svg>
                        </span>
                    </button>
                }
                <img
                    id={`image-${this.props.prefix}-${this.props.keys}`}
                    ref={i => this.image = i}
                    className={`${this.props.className} fadeInRight`}
                    style={{
                        width: '100%',
                        borderRadius: "4px",
                        opacity: loaded && this.props.transitionEnd ? 1 : 0,
                        transition: 'opacity 0.1s linear',
                        border: this.props.hasBorder ? "1px solid rgba(0, 0, 0, 0.1)" : "none",
                    }}

                    onLoad={e => {
                        this.handleImageLoaded();
                    }}

                    src={this.props.startPoint == this.props.keys ? this.props.src : ""}
                    onMouseDown={this.props.onPick}
                />
            </Container>
        );
    }
}
