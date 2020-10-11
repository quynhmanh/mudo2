import React, { Component } from "react";
import styled from 'styled-components';
import editorStore from "@Store/EditorStore";
import uuidv4 from "uuid/v4";
import ImagePickerContainer from "@Components/shared/ImagePickerContainer";

export interface IProps {
    src: string;
    onPick: any;
    onEdit: any;
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
    backgroundColorLoaded: string;
    marginRight: number;
    marginAuto: boolean;
    showProgressBar: boolean;
}

export interface IState {
    loaded: boolean;
    width: number;
}

export default class GridPicker extends Component<IProps, IState> {
    state = {
        loaded: false,
        width: 200,
        _id: uuidv4(),
    };

    static defaultProps = {
        classNameContainer: "",
        padding: 0,
        backgroundColor: null,
        backgroundColorLoaded: "rgba(255, 255, 255, 0.07)",
        marginRight: 8,
        marginAuto: false,
        showProgressBar: false,
    }

    current_progress = 0;
    step = 0.5;

    componentDidMount() {
        const img = this.image;
        if (img && img.complete) {
            this.handleImageLoaded();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.showProgressBar) {
            let btn = document.getElementById("progress-bar-start-btn" + this.state._id);
            if (btn) btn.click();
        } else if (prevProps.showProgressBar) {
            clearInterval(this.interval);
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
        let id = this.state._id;
        console.log('grids ', this.props.item.grids)
        return (
            <div
                id={this.props.id}
                className={this.props.classNameContainer}
                loaded={this.state.loaded}
                height={this.props.height}
                width={this.props.width}
                style={{
                    width: this.props.width + "px",
                    height: this.props.height + "px",
                    padding: this.props.padding ? `${this.props.padding}px` : 0,
                    position: this.props.marginAuto ? "absolute" : "relative",
                    margin: this.props.marginAuto ? 'auto' : `0 ${this.props.marginRight}px ${this.props.marginRight}px 0px`,
                }}>
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
                            background: 'white',
                        }}
                        onClick={this.props.onEdit}
                    ><span>
                            <svg width="16" height="16" viewBox="0 0 16 16"><defs><path id="_2658783389__a" d="M3.25 9.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"></path></defs><use fill="black" xlinkHref="#_2658783389__a" fillRule="evenodd"></use></svg>
                        </span>
                    </button>
                }
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <div
                        style={{
                            gridTemplateAreas: this.props.item.gridTemplateAreas,
                            gridTemplateColumns: this.props.item.gridTemplateColumns,
                            gridTemplateRows: this.props.item.gridTemplateRows,
                            display: "grid",
                            gridGap: "2px",
                            width: "100%",
                            height: "100%"
                        }}
                        className="DRFFjQ"
                        role="button">
                        {Array.isArray(this.props.item.grids) && this.props.item.grids.map(g =>
                            <div
                                style={{
                                    gridArea: g.gridArea,
                                    backgroundImage: 'url("https://static.canva.com/web/images/87e22a62965f141aa08e93699b0b3527.jpg")',
                                    backgroundSize: "auto 100%",
                                    backgroundPosition: "50%"
                                }} />)}
                    </div>
                </div>
            </div>
        );
    }
}
