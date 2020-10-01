import React, { Component } from 'react'
import { SidebarTab, } from "./enums";
import editorStore from "@Store/EditorStore";
import Slider from "@Components/editor/Slider";
import ColorPicker from "@Components/editor/ColorPicker";
import Sidebar from "@Components/editor/SidebarStyled";

export interface IProps {
    scale: number;
    pauser: any;
    translate: any;
    selectedTab: any;
    handleEditmedia: any;
    handleImageSelected: any;
    updateImages: any;
    effectId: any;
    idImageSelected: string;
    childIdSelected: string;
}

export interface IState {
    items: any;
    items2: any;
    items3: any;
    isLoading: boolean;
    currentItemsHeight: number;
    currentItems2Height: number;
    currentItems3Height: number;
    error: any;
    hasMore: boolean;
    cursor: any;
}

export default class SidebarEffect extends Component<IProps, IState> {
    state = {
        isLoading: false,
        items: [],
        items2: [],
        items3: [],
        currentItemsHeight: 0,
        currentItems2Height: 0,
        currentItems3Height: 0,
        error: null,
        hasMore: true,
        cursor: null,
    }

    constructor(props) {
        super(props);

        this.updateShadowColor = this.updateShadowColor.bind(this);
    }

    componentDidMount() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.selectedTab != nextProps.selectedTab
            && (nextProps.selectedTab == SidebarTab.Effect || this.props.selectedTab == SidebarTab.Effect)
        ) {
            return true;
        }
        if (this.props.effectId != nextProps.effectId) {
            return true;
        }
        if (nextProps.selectedTab == SidebarTab.Effect && this.props.idImageSelected != nextProps.idImageSelected) {
            return true;
        }
        if (nextProps.selectedTab == SidebarTab.Effect && this.props.childIdSelected != nextProps.childIdSelected) {
            return true;
        }
        return false;
    }

    handleApplyEffect = (effectId, offSet, direction, blur, textShadowTransparent, intensity, hollowThickness, color, filter) => {
        let image = editorStore.getImageSelected();
        if (!editorStore.childId) {
            image.hollowThickness = hollowThickness;
            if (color) {
                image.color = color;
            }
            image.filter = filter;
            image.effectId = effectId;
            image.offSet = offSet;
            image.direction = direction;
            image.blur = blur;
            image.textShadowTransparent = textShadowTransparent;
            image.intensity = intensity;
            if (effectId == 1) {
                image.shadowColor = [25, 25, 25];
            }
            if (effectId == 4) {
                image.shadowColor = [128, 128, 128]
            }
            if (effectId == 5) {
                image.shadowColor = [0, 0, 0]
            }
        } else {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.hollowThickness = hollowThickness;
                    if (color) {
                        text.color = color;
                    }
                    text.filter = filter;
                    text.effectId = effectId;
                    text.offSet = offSet;
                    text.direction = direction;
                    text.blur = blur;
                    text.textShadowTransparent = textShadowTransparent;
                    text.intensity = intensity;

                    if (effectId == 1) {
                        text.shadowColor = [25, 25, 25];
                    }
                    if (effectId == 4) {
                        text.shadowColor = [128, 128, 128];
                    }
                    if (effectId == 5) {
                        text.shadowColor = [0, 0, 0]
                    }
                }
                return text;
            });
            image.document_object = texts;
        }
        editorStore.images2.set(editorStore.idObjectSelected, image);
        this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
        editorStore.effectId = effectId;
    }


    handleChangeOffsetEnd = val => {
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.offSet = val;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.offSet = val;
        }
        editorStore.images2.set(editorStore.idObjectSelected, image);
        this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
    }

    getSingleTextHTMLElement() {
        return document.getElementById(editorStore.idObjectSelected + editorStore.childId + "text-container2alo");
    }

    updateText(image) {
        let el;
        if (editorStore.childId) {
            el = this.getSingleTextHTMLElement();
        } else {
            el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
        }
        
        const colors = image.shadowColor;
        el.style.textShadow = image.effectId == 1 ? `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, ${1.0 * image.textShadowTransparent / 100}) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * image.blur / 100}px` :
            image.effectId == 2 ? `rgba(0, 0, 0, ${0.6 * image.intensity}) 0 8.9px ${66.75 * image.intensity / 100}px` :
                image.effectId == 4 ? `rgb(${colors[0]}, ${colors[1]}, ${colors[2]}) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
                    image.effectId == 5 ? `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, 0.5) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
                        image.effectId == 6 && `rgb(0, 255, 255) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI))}px 0px`;

        if (editorStore.childId) {
            el = this.getSingleTextHTMLElement();
        } else {
            el = document.getElementById(editorStore.idObjectSelected + "hihi5alo");
        }

        if (image.effectId == 3 || image.effectId == 4) {
            console.log('asd', image.hollowThickness)
            el.style.WebkitTextStroke = `${1.0 * image.hollowThickness / 100 * 4 + 0.1}px ${(image.effectId == 3 || image.effectId == 4) ? image.color : "black"}`;
        }
    }

    handleChangeOffset = val => {
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            image = image.document_object.find(text => text._id == editorStore.childId);
        }
        image.offSet = val;

        this.updateText(image);
    }

    handleChangeDirection = (val) => {
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            image = image.document_object.find(text => text._id == editorStore.childId);
        }
        image.direction = val;

        this.updateText(image);
    }

    handleChangeDirectionEnd = val => {
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.direction = val;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.direction = val;
        }
        editorStore.images2.set(editorStore.idObjectSelected, image);
        this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
    }


    handleChangeBlur = (val) => {
        
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            image = image.document_object.find(text => text._id == editorStore.childId);
        }
        image.blur = val;   

        this.updateText(image);
    }

    handleChangeBlurEnd = val => {
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.blur = val;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.blur = val;
        }
        editorStore.images2.set(editorStore.idObjectSelected, image);
        this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
    }

    handleChangeTextShadowTransparentEnd = (val) => {
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.textShadowTransparent = val;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.textShadowTransparent = val;
        }
        editorStore.images2.set(editorStore.idObjectSelected, image);
        this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
    }

    handleChangeTextShadowTransparent = val => {
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            image = image.document_object.find(text => text._id == editorStore.childId);
        }
        image.textShadowTransparent = val;

        this.updateText(image);
    }


    handleChangeIntensityEnd = val => {
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.intensity = val;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.intensity = val;
        }
        this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
        editorStore.images2.set(editorStore.idObjectSelected, image);
    }

    handleChangeIntensity = val => {
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            image = image.document_object.find(text => text._id == editorStore.childId);
        }
        image.intensity = val;

        this.updateText(image);
    }

    handleChangeHollowThicknessEnd = val => {
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.hollowThickness = val;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.hollowThickness = val;
        }
        editorStore.images2.set(editorStore.idObjectSelected, image);
        this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
    }

    handleChangeHollowThickness = (val) => {

        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            image = image.document_object.find(text => text._id == editorStore.childId);
        }
        image.hollowThickness = val;
        
        this.updateText(image);
    }

    updateShadowColor = (color) => {
        let image = editorStore.getImageSelected();
        if (editorStore.childId && image.document_object) {
            image.document_object = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.shadowColor = color;
                }
                return text;
            })
        } else {
            image.shadowColor = color;
        }
        editorStore.images2.set(image._id, image);
        this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
    }

    render() {
        let image = editorStore.getImageSelected() || {};
        if (editorStore.childId && image.document_object) {
            image = image.document_object.find(doc => doc._id == editorStore.childId);
        }


        return (
            <Sidebar
                selectedTab={editorStore.selectedTab}
                sidebar={SidebarTab.Effect}
                color="black"
                style={{
                    left: 0,
                    top: 0,
                    background: "white",
                    width: "370px",
                    transition: "none",
                    transform: "none",
                }}
            >
                <div>
                    <div
                        style={{
                            height: "100%",
                            padding: "22px",
                            overflow: "scroll",
                        }}
                    >
                        <div
                            style={{
                                display: "inline-block",
                                width: "100px",
                                marginRight: "12px",
                            }}
                        >
                            <button
                                className="effect-btn"
                                id="effect-btn-8"
                                style={{
                                    boxShadow: editorStore.effectId == 8 && "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff",
                                }}
                                onClick={e => {
                                    this.handleApplyEffect(8, null, null, null, null, null, "black", null, null);
                                }}
                            >
                                <img
                                    style={{
                                        width: "100%",
                                        borderRadius: "12px",
                                    }}
                                    src="https://static.canva.com/web/images/d461ce14740df06b826ab8517b88344c.png" />
                            </button>
                            <p
                                style={{
                                    textAlign: "center",
                                }}
                            >None</p>
                        </div>
                        <div
                            style={{
                                display: "inline-block",
                                width: "100px",
                                marginRight: "12px",
                            }}
                        >
                            <button
                                id="effect-btn-1"
                                className="effect-btn"
                                style={{
                                    boxShadow: editorStore.effectId == 1 && "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff",
                                }}
                                onClick={e => {
                                    this.handleApplyEffect(1, 50, 12.5, 0, 40, null, null, null, null);
                                }}
                            >
                                <img
                                    style={{
                                        width: "100%",
                                        borderRadius: "10px",
                                    }}
                                    src="https://static.canva.com/web/images/544ebef63f65bc118af1a353d8e3456c.png" />
                            </button>
                            <p
                                style={{
                                    textAlign: "center",
                                }}
                            >Shadow</p>
                        </div>
                        <div
                            style={{
                                display: "inline-block",
                                width: "100px",
                            }}
                        >
                            <button
                                id="effect-btn-2"
                                style={{
                                    boxShadow: editorStore.effectId == 2 && "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff",
                                }}
                                onClick={e => {
                                    this.handleApplyEffect(2, null, null, null, null, 50, "black", null, null);
                                }}
                                className="effect-btn"
                            >
                                <img
                                    style={{
                                        width: "100%",
                                        borderRadius: "10px",
                                    }}
                                    src="https://static.canva.com/web/images/39e8991a556615f8130d7d36580f9276.jpg" />
                            </button>
                            <p
                                style={{
                                    textAlign: "center",
                                }}
                            >Lift</p>
                        </div>
                        {editorStore.effectId == 1 &&
                            <div style={{
                                marginBottom: "15px",
                            }}>
                                <Slider
                                    title="Offset"
                                    currentValue={image.offSet}
                                    pauser={this.props.pauser}
                                    onChange={this.handleChangeOffset}
                                    onChangeEnd={this.handleChangeOffsetEnd}
                                />
                                <Slider
                                    title="Direction"
                                    currentValue={image.direction}
                                    pauser={this.props.pauser}
                                    multiplier={3.6}
                                    onChange={this.handleChangeDirection}
                                    onChangeEnd={this.handleChangeDirectionEnd}
                                />
                                <Slider
                                    title="Blur"
                                    currentValue={image.blur}
                                    pauser={this.props.pauser}
                                    onChange={this.handleChangeBlur}
                                    onChangeEnd={this.handleChangeBlurEnd}
                                />
                                <Slider
                                    title="Transparency"
                                    currentValue={image.textShadowTransparent}
                                    pauser={this.props.pauser}
                                    onChange={this.handleChangeTextShadowTransparent}
                                    onChangeEnd={this.handleChangeTextShadowTransparentEnd}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <p>Color</p>
                                    <ColorPicker
                                        color={image.shadowColor}
                                        setSelectionColor={this.updateShadowColor}
                                        translate={this.props.translate}
                                        forceUpdate={() => {
                                            this.forceUpdate();
                                        }}
                                    />
                                </div>
                            </div>}
                        {editorStore.effectId == 2 &&
                            <div style={{
                                marginBottom: "15px",
                            }}>
                                <Slider
                                    title="Intensity"
                                    currentValue={image.intensity}
                                    pauser={this.props.pauser}
                                    onChange={this.handleChangeIntensity}
                                    onChangeEnd={this.handleChangeIntensityEnd}
                                />
                            </div>}
                        <div
                            style={{
                                display: "inline-block",
                                width: "100px",
                                marginRight: "12px",
                            }}
                        >
                            <button
                                style={{
                                    boxShadow: editorStore.effectId == 3 && "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff",
                                }}
                                onClick={e => {
                                    this.handleApplyEffect(3, null, null, null, null, null, 30, "black", null);
                                }}
                                id="effect-btn-3"
                                className="effect-btn"
                            >
                                <img
                                    style={{
                                        width: "100%",
                                        borderRadius: "10px",
                                    }}
                                    src="https://static.canva.com/web/images/014d16e44f8c5dfddf2ccdb10fb97b6b.png" />
                            </button>
                            <p
                                style={{
                                    textAlign: "center",
                                }}>Hollow</p>
                        </div>
                        <div
                            style={{
                                display: "inline-block",
                                width: "100px",
                                marginRight: "12px",
                            }}
                        >
                            <button
                                style={{
                                    boxShadow: editorStore.effectId == 4 && "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff",
                                }}
                                onClick={e => {
                                    this.handleApplyEffect(4, 50, 12.5, 0, 40, null, 30, "black", null);
                                }}
                                id="effect-btn-4"
                                className="effect-btn"
                            >
                                <img
                                    style={{
                                        width: "100%",
                                        borderRadius: "10px",
                                    }}
                                    src="https://static.canva.com/web/images/6bec5afe4433f7030024ed9287752d08.png" />
                            </button>
                            <p
                                style={{
                                    textAlign: "center",
                                }}>Splice</p>
                        </div>
                        <div
                            style={{
                                display: "inline-block",
                                width: "100px",
                            }}
                        >
                            <button
                                style={{
                                    boxShadow: editorStore.effectId == 5 && "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff",
                                }}
                                onClick={e => {
                                    this.handleApplyEffect(5, 50, 12.5, 0, 40, null, "", "black", null);
                                }}
                                className="effect-btn"
                                id="effect-btn-5"
                            >
                                <img
                                    style={{
                                        width: "100%",
                                        borderRadius: "10px",
                                    }}
                                    src="https://static.canva.com/web/images/3df11ae4feb176c0e1326a83078863d2.png" />
                            </button>
                            <p
                                style={{
                                    textAlign: "center",
                                }}>Echo</p>
                        </div>
                        {editorStore.effectId == 3 &&
                            <div style={{
                                marginBottom: "15px",
                            }}>
                                <Slider
                                    title="Thickness"
                                    currentValue={image.hollowThickness}
                                    pauser={this.props.pauser}
                                    onChange={this.handleChangeHollowThickness}
                                    onChangeEnd={this.handleChangeHollowThicknessEnd}
                                />
                            </div>}
                        {editorStore.effectId == 4 &&
                            <div style={{
                                marginBottom: "15px",
                            }}>
                                <Slider
                                    title="Thickness"
                                    currentValue={image.hollowThickness}
                                    pauser={this.props.pauser}
                                    onChange={this.handleChangeHollowThickness}
                                    onChangeEnd={this.handleChangeHollowThicknessEnd}
                                />
                                <Slider
                                    title="Offset"
                                    currentValue={image.offSet}
                                    pauser={this.props.pauser}
                                    onChange={this.handleChangeOffset}
                                    onChangeEnd={this.handleChangeOffsetEnd}
                                />
                                <Slider
                                    title="Direction"
                                    currentValue={image.direction}
                                    pauser={this.props.pauser}
                                    onChange={this.handleChangeDirection}
                                    multiplier={3.6}
                                    onChangeEnd={this.handleChangeDirectionEnd}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <p>Color</p>
                                    <ColorPicker
                                        color={image.shadowColor}
                                        setSelectionColor={this.updateShadowColor}
                                        translate={this.props.translate}
                                        forceUpdate={() => {
                                            this.forceUpdate();
                                        }}
                                    />
                                </div>
                            </div>}
                        {editorStore.effectId == 5 &&
                            <div style={{
                                marginBottom: "15px",
                            }}>
                                <Slider
                                    title="Offset"
                                    currentValue={image.offSet}
                                    pauser={this.props.pauser}
                                    onChange={this.handleChangeOffset}
                                    onChangeEnd={this.handleChangeOffsetEnd}
                                />
                                <Slider
                                    title="Direction"
                                    currentValue={image.direction}
                                    pauser={this.props.pauser}
                                    onChange={this.handleChangeDirection}
                                    multiplier={3.6}
                                    onChangeEnd={this.handleChangeDirectionEnd}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <p>Color</p>
                                    <ColorPicker
                                        color={image.shadowColor}
                                        setSelectionColor={this.updateShadowColor}
                                        translate={this.props.translate}
                                        forceUpdate={() => {
                                            this.forceUpdate();
                                        }}
                                    />
                                </div>
                            </div>}
                        <div
                            style={{
                                display: "inline-block",
                                width: "100px",
                                marginRight: "12px",
                            }}
                        >
                            <button
                                style={{
                                    boxShadow: editorStore.effectId == 6 && "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff",
                                }}
                                onClick={e => {
                                    this.handleApplyEffect(6, 10, 83, 0, 40, null, "", "black", null);
                                }}
                                className="effect-btn"
                                id="effect-btn-6"
                            >
                                <img
                                    style={{
                                        width: "100%",
                                        borderRadius: "10px",
                                    }}
                                    src="https://static.canva.com/web/images/10d3bc08aa9d6ba94ddba7a67a6ff83e.png" />
                            </button>
                            <p
                                style={{
                                    textAlign: "center",
                                }}>Glitch</p>
                        </div>
                        <div
                            style={{
                                display: "inline-block",
                                width: "100px",
                            }}
                        >
                            <button
                                style={{
                                    boxShadow: editorStore.effectId == 7 && "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff",
                                }}
                                onClick={e => {
                                    this.handleApplyEffect(7, null, null, null, null, null, null, "white", "drop-shadow(rgba(26, 24, 24, 0.95) 0px 0px 2.73317px) drop-shadow(rgba(26, 26, 26, 0.75) 0px 0px 13.6658px) drop-shadow(rgba(26, 26, 26, 0.44) 0px 0px 40.9975px)");
                                }}
                                className="effect-btn"
                                id="effect-btn-7"
                            >
                                <img
                                    style={{
                                        width: "100%",
                                        borderRadius: "10px",
                                    }}
                                    src="https://static.canva.com/web/images/2c6d9ae58209c023b5bc05b3581d3e51.jpg" />
                            </button>
                            <p
                                style={{
                                    textAlign: "center",
                                }}>Neon</p>
                        </div>
                        {editorStore.effectId == 6 &&
                            <div style={{
                                marginBottom: "15px",
                            }}>
                                <Slider
                                    title="Offset"
                                    currentValue={image.offSet}
                                    pauser={this.props.pauser}
                                    onChange={this.handleChangeOffset}
                                    onChangeEnd={this.handleChangeOffsetEnd}
                                />
                                <Slider
                                    title="Direction"
                                    currentValue={image.direction}
                                    pauser={this.props.pauser}
                                    onChange={this.handleChangeDirection}
                                    multiplier={3.6}
                                    onChangeEnd={this.handleChangeDirectionEnd}
                                />
                            </div>}
                        {editorStore.effectId == 7 &&
                            <div style={{
                                marginBottom: "15px",
                            }}>
                                <Slider
                                    title="Intensity"
                                    currentValue={50}
                                    pauser={this.props.pauser}
                                    onChange={this.handleChangeIntensity}
                                    onChangeEnd={this.handleChangeIntensityEnd}
                                />
                            </div>}
                    </div>
                </div>
            </Sidebar>
        )
    }
}