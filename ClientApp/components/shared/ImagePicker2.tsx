import React, { PureComponent, Fragment, isValidElement } from "react";
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
  opacity ${props => props.loaded ? 1 : 0.15};
  animation-name: XhtCamN749DcvC-ecDUzp;
  animation: ${props => props.loaded ? "none" : "LuuT-RWT7fXcJFhRfuaKV 1.4s infinite"};
  animation-delay: ${props => props.delay}ms;
  :hover button {
    visibility: visible;
  }
`

export default class ImagePicker extends PureComponent<IProps, IState> {
    state = {
        loaded: false,
        width: 200,
    };

    static defaultProps = {
        classNameContainer: "",
        padding: 0,
        backgroundColor: null,
    }

    componentDidMount() {
        const img = this.image;
        if (img && img.complete) {
            this.handleImageLoaded();
        }
    }

    image = null;

    handleImageLoaded() {
        const img = this.image;

        var ratio = img.naturalWidth / img.naturalHeight;

        if (!this.state.loaded) {
            this.setState({ loaded: true, width: ratio * this.props.height });
        }
    }

    render() {
        let { loaded } = this.state;
        return (
            <Container
                className={this.props.classNameContainer}
                style={{
                    position: 'relative',
                    backgroundSize: '300% 300%',
                    // width: `${this.state.loaded ? this.state.width : this.props.width}px`,
                    width: `160px`,
                    marginBottom: '8px',
                    display: "flex",
                    opacity: this.state.loaded ? 1 : 0.15,
                    animationName: 'XhtCamN749DcvC-ecDUzp',
                    animation: this.state.loaded ? "none" : "LuuT-RWT7fXcJFhRfuaKV 1.4s infinite",
                    animationDelay: this.props.delay + 'ms',
                    backgroundColor: this.state.loaded ? "rgba(255, 255, 255, 0.07)" : (this.props.backgroundColor ? this.props.backgroundColor : "#fff"),
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
                    id={`image-${this.props.keys}`}
                    ref={i => this.image = i}
                    className={this.props.className}
                    style={loaded ? {
                        width: '100%',
                        margin: 'auto',
                        borderRadius: "4px",
                        boxShadow: "0 2px 12px rgba(53,71,90,.2), 0 0 0 rgba(68,92,116,.02)",
                    } : { display: 'none' }}
                    onLoad={(e) => {
                        this.handleImageLoaded();
                    }
                    }

                    onLoadedData={(e) => {
                        this.handleImageLoaded();
                    }
                    }

                    onError={(e) => {
                    }}

                    src={""}
                    onMouseDown={this.props.onPick}
                />
            </Container>
        );
    }
}
