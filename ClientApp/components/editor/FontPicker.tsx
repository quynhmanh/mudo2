import React, { Component } from "react";

export interface IProps {
    src: any;
    height: number;
}

export interface IState {
    loaded: boolean;
}

export default class FontPicker extends Component<IProps, IState> {
    state = {
        loaded: false,
    };

    static defaultProps = {
    }

    shouldComponentUpdate() {
        if (this.state.loaded) {
            return false;
        }

        return true;
    }

    handleImageLoaded() {
        this.setState({ loaded: true });
    }

    render() {
        return (
            <div
                style={{
                    height: this.props.height + "px",
                    backgroundColor: this.state.loaded ? 'transparent' : '#80808026',
                    width: "200px",
                }}>
                <img
                    onLoad={(e) => {
                        this.handleImageLoaded();
                    }
                    }
                    style={{
                        height: this.props.height + "px",
                        width: "200px",
                        display: this.state.loaded ? 'block' : 'none',
                    }}
                    src={this.props.src}
                />
            </div>
        );
    }
}
