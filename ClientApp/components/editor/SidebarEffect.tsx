import React, { Component } from 'react'
import { CanvasType, SidebarTab, } from "./enums";
import editorStore from "@Store/EditorStore";
import Slider from "@Components/editor/Slider";
import ColorPicker from "@Components/editor/ColorPicker";
import Sidebar from "@Components/editor/SidebarStyled";
import CircleType from "@Components/circletype/entry";
import { getImageSelected, onTextChange, onTextChange2, updateImages, updateImages2 } from '@Utils';

export interface IProps {
    scale: number;
    translate: any;
    selectedTab: any;
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
            if (image.effectId == 9) {
                image.innerHTML = image.originalHTML;
                window.editor.canvas1[image.page].canvas[CanvasType.All][image._id].child.updateInnerHTML(image.innerHTML);
                window.editor.canvas1[image.page].canvas[CanvasType.HoverLayer][image._id].child.updateInnerHTML(image.innerHTML);
            }
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
            if (effectId == 7) {
                image.shade = 0.65;
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
                    text.shade = val;
                }
                return text;
            });
            image.document_object = texts;
        } else {
            image.shade = val / 100;
        }
        this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
        editorStore.images2.set(editorStore.idObjectSelected, image);
    }

    handleChangeIntensity = val => {
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            image = image.document_object.find(text => text._id == editorStore.childId);
        }  

        console.log('val ', val)

        image.shade = val / 100;

        editorStore.images2.set(image._id, image);
        this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
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
                <div
                    style={{
                        borderBottom: "1px solid #00000026",
                        height: "47px",
                    }}
                >
                    <p
                        style={{
                            height: "100%",
                            lineHeight: "47px",
                            paddingLeft: "21px",
                            fontSize: "15px",
                        }}
                    >{this.props.translate("effect")}</p>
                </div>
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
                                    fontSize: "13px",
                                }}
                            >{this.props.translate("noneEffect")}</p>
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
                                    fontSize: "13px",
                                }}
                                >{this.props.translate("shadow")}</p>
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
                                    fontSize: "13px",
                                }}
                            >{this.props.translate("lift")}</p>
                        </div>
                        {editorStore.effectId == 1 &&
                            <div style={{
                                margin: "15px 0",
                            }}>
                                <Slider
                                    title={this.props.translate("offset")}
                                    currentValue={image.offSet}
                                    onChange={this.handleChangeOffset}
                                    onChangeEnd={this.handleChangeOffsetEnd}
                                />
                                <Slider
                                    title={this.props.translate("direction")}
                                    currentValue={image.direction}
                                    multiplier={3.6}
                                    onChange={this.handleChangeDirection}
                                    onChangeEnd={this.handleChangeDirectionEnd}
                                />
                                <Slider
                                    title={this.props.translate("blur")}
                                    currentValue={image.blur}
                                    onChange={this.handleChangeBlur}
                                    onChangeEnd={this.handleChangeBlurEnd}
                                />
                                <Slider
                                    title={this.props.translate("transparency")}
                                    currentValue={image.textShadowTransparent}
                                    onChange={this.handleChangeTextShadowTransparent}
                                    onChangeEnd={this.handleChangeTextShadowTransparentEnd}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <p
                                        style={{
                                            display: 'inline-block',
                                            margin: '0px',
                                            lineHeight: '30px',
                                            fontSize: '12px',
                                        }}
                                    >Color</p>
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
                                margin: "15px 0",
                            }}>
                                <Slider
                                    title={this.props.translate("intensity")}
                                    currentValue={image.shade * 100}
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
                                    fontSize: "13px",
                                }}>{this.props.translate("hollow")}</p>
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
                                    fontSize: "13px",
                                }}>{this.props.translate("splice")}</p>
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
                                    fontSize: "13px",
                                }}>{this.props.translate("echo")}</p>
                        </div>
                        {editorStore.effectId == 3 &&
                            <div style={{
                                margin: "15px 0",
                            }}>
                                <Slider
                                    title={this.props.translate("thickness")}
                                    currentValue={image.hollowThickness}
                                    onChange={this.handleChangeHollowThickness}
                                    onChangeEnd={this.handleChangeHollowThicknessEnd}
                                />
                            </div>}
                        {editorStore.effectId == 4 &&
                            <div style={{
                                margin: "15px 0",
                            }}>
                                <Slider
                                     title={this.props.translate("thickness")}
                                    currentValue={image.hollowThickness}
                                    onChange={this.handleChangeHollowThickness}
                                    onChangeEnd={this.handleChangeHollowThicknessEnd}
                                />
                                <Slider
                                    title={this.props.translate("offset")}
                                    currentValue={image.offSet}
                                    onChange={this.handleChangeOffset}
                                    onChangeEnd={this.handleChangeOffsetEnd}
                                />
                                <Slider
                                    title={this.props.translate("direction")}
                                    currentValue={image.direction}
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
                                    <p
                                        style={{
                                            display: 'inline-block',
                                            margin: '0px',
                                            lineHeight: '30px',
                                            fontSize: '12px',
                                        }}
                                    >Color</p>
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
                                margin: "15px 0",
                            }}>
                                <Slider
                                    title={this.props.translate("offset")}
                                    currentValue={image.offSet}
                                    onChange={this.handleChangeOffset}
                                    onChangeEnd={this.handleChangeOffsetEnd}
                                />
                                <Slider
                                    title={this.props.translate("direction")}
                                    currentValue={image.direction}
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
                                    <p
                                        style={{
                                            display: 'inline-block',
                                            margin: '0px',
                                            lineHeight: '30px',
                                            fontSize: '12px',
                                        }}
                                    >{this.props.translate("color")}</p>
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
                                    fontSize: "13px",
                                }}>{this.props.translate("glitch")}</p>
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
                                    boxShadow: editorStore.effectId == 7 && "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff",
                                }}
                                onClick={e => {
                                    this.handleApplyEffect(7, null, null, null, null, null, null, "rgb(255, 22, 22)", "");
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
                                    fontSize: "13px",
                                }}>{this.props.translate("neon")}</p>
                        </div>
                        <div
                            style={{
                                display: "inline-block",
                                width: "100px",
                            }}
                        >
                            <button
                                style={{
                                    boxShadow: editorStore.effectId == 9 && "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff",
                                }}
                                onClick={e => {
                                    let image = getImageSelected();
                                    image.effectId = 9;
                                    image.circleWidth = 0;
                                    image.circleDir = 1;
                                    image.originalHTML = image.innerHTML;
                                    editorStore.images2.set(image._id, image);
                                    editorStore.effectId = 9;
                                    let el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
                                    window.circleType = new CircleType(el);

                                    // Set the text radius and direction. Note: setter methods are chainable.
                                    window.circleType.radius(0).dir(1).forceWidth(true);

                                    
                                    setTimeout(() => {
                                        onTextChange2(el, 0, 1);

                                        image.width = el.children[0].offsetWidth * image.scaleX;
                                        image.height = el.offsetHeight * image.scaleY;
                                        image.origin_width = image.width / image.scaleX;
                                        image.origin_height = image.height / image.scaleY;

                                        image.innerHTML = el.innerHTML;
                                        editorStore.images2.set(editorStore.idObjectSelected, image);
                                        updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
                                    }, 15);
                                }}
                                className="effect-btn"
                                id="effect-btn-7"
                            >
                                <img
                                    style={{
                                        width: "100%",
                                        borderRadius: "10px",
                                    }}
                                    src="https://static.canva.com/web/images/3a09892e7e39d34e315b9224457c6ea1.jpg" />
                            </button>
                            <p
                                style={{
                                    textAlign: "center",
                                    fontSize: "13px",
                                }}>{this.props.translate("curve")}</p>
                        </div>
                        {editorStore.effectId == 6 &&
                            <div style={{
                                margin: "15px 0",
                            }}>
                                <Slider
                                    title={this.props.translate("offset")}
                                    currentValue={image.offSet}
                                    onChange={this.handleChangeOffset}
                                    onChangeEnd={this.handleChangeOffsetEnd}
                                />
                                <Slider
                                    title={this.props.translate("direction")}
                                    currentValue={image.direction}
                                    onChange={this.handleChangeDirection}
                                    multiplier={3.6}
                                    onChangeEnd={this.handleChangeDirectionEnd}
                                />
                            </div>}
                        {editorStore.effectId == 7 &&
                            <div style={{
                                margin: "15px 0",
                            }}>
                                <Slider
                                    title={this.props.translate("intensity")}
                                    currentValue={50}
                                    onChange={this.handleChangeIntensity}
                                    onChangeEnd={this.handleChangeIntensityEnd}
                                />
                            </div>}
                        {editorStore.effectId == 9 &&
                            <div style={{
                                margin: "15px 0",
                            }}>
                                <Slider
                                    title={this.props.translate("angle")}
                                    currentValue={50}
                                    onChange={(value) => {
                                        if (window.circleType) window.circleType.destroy();
                                        let el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
                                        window.circleType = new CircleType(el);
                                
                                        // Set the text radius and direction. Note: setter methods are chainable.
                                        let angle = Math.abs(value > 50 ? 100 - value : value)/50*1000+window.circleType._minRadius;
                                        window.circleType.radius(angle).dir(value > 50 ? 1 : -1).forceWidth(true);

                                        let image = getImageSelected();
                                        image.effectId = 9;
                                        image.circleWidth = angle;
                                        image.circleDir = value > 50 ? 1 : -1;
                                        editorStore.images2.set(image._id, image);

                                        setTimeout(() => {
                                            onTextChange2(el, angle, image.circleDir);

                                            image.width = el.children[0].offsetWidth * image.scaleX;
                                            console.log('image.width ', image.width)
                                            image.height = el.offsetHeight * image.scaleY;
                                            image.origin_width = image.width / image.scaleX;
                                            image.origin_height = image.height / image.scaleY;

                                            image.innerHTML = el.innerHTML;
                                            editorStore.images2.set(editorStore.idObjectSelected, image);
                                            updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
                                        }, 15);
                                    }}
                                    onChangeEnd={this.handleChangeIntensityEnd}
                                />
                            </div>}
                    </div>
                </div>
            </Sidebar>
        )
    }
}