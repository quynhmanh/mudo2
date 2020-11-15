import React, { Component } from 'react'
import { CanvasType, SidebarTab, TemplateType, } from "./enums";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import ColorPicker from "@Components/editor/ColorPicker";
import Sidebar from "@Components/editor/SidebarStyled";
import axios from "axios";
import Globals from '@Globals';

export interface IProps {
    scale: number;
    translate: any;
    selectedTab: any;
    handleImageSelected: any;
    updateImages: any;
    effectId: any;
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

const imgWidth = 162;
const backgroundWidth = 105;

export default class SidebarColor extends Component<IProps, IState> {
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
    }

    componentDidMount() {
        if (Globals && Globals.serviceUser) {
            var url = `/users/getColors?username=${Globals.serviceUser.username}`;
            axios.get(url).then(res => {
                if (res.data.length > 0) {
                    editorStore.fontColors = res.data;
                }
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.selectedTab != nextProps.selectedTab
            && (nextProps.selectedTab == SidebarTab.Color || this.props.selectedTab == SidebarTab.Color)
        ) {
            return true;
        }
        if (this.props.effectId != nextProps.effectId) {
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

    handleChangeOffset = val => {
        let el;
        if (editorStore.childId) {
            el = this.getSingleTextHTMLElement();
        } else {
            el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
        }
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            image = image.document_object.find(text => text._id == editorStore.childId);
        }
        image.offSet = val;
        el.style.textShadow = image.effectId == 1 ? `rgba(25, 25, 25, ${1.0 * image.textShadowTransparent / 100}) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * image.blur / 100}px` :
            image.effectId == 2 ? `rgba(0, 0, 0, ${0.6 * image.intensity}) 0 8.9px ${66.75 * image.intensity / 100}px` :
                image.effectId == 4 ? `rgb(128, 128, 128) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
                    image.effectId == 5 ? `rgba(0, 0, 0, 0.5) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
                        image.effectId == 6 && `rgb(0, 255, 255) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI))}px 0px`;
    }

    handleChangeDirection = (val) => {
        let el;
        if (editorStore.childId) {
            el = el = this.getSingleTextHTMLElement();
        } else {
            el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
        }
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            image = image.document_object.find(text => text._id == editorStore.childId);
        }
        image.direction = val;
        el.style.textShadow = image.effectId == 1 ? `rgba(25, 25, 25, ${1.0 * image.textShadowTransparent / 100}) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * image.blur / 100}px` :
            image.effectId == 2 ? `rgba(0, 0, 0, ${0.6 * image.intensity}) 0 8.9px ${66.75 * image.intensity / 100}px` :
                image.effectId == 4 ? `rgb(128, 128, 128) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
                    image.effectId == 5 ? `rgba(0, 0, 0, 0.5) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
                        image.effectId == 6 && `rgb(0, 255, 255) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI))}px 0px`;
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
        let el;
        if (editorStore.childId) {
            el = this.getSingleTextHTMLElement();
        } else {
            el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
        }
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            image = image.document_object.find(text => text._id == editorStore.childId);
        }
        image.blur = val;
        el.style.textShadow = image.effectId == 1 ? `rgba(25, 25, 25, ${1.0 * image.textShadowTransparent / 100}) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * image.blur / 100}px` :
            image.effectId == 2 ? `rgba(0, 0, 0, ${0.6 * image.intensity}) 0 8.9px ${66.75 * image.intensity / 100}px` :
                image.effectId == 4 ? `rgb(128, 128, 128) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
                    image.effectId == 5 ? `rgba(0, 0, 0, 0.5) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
                        image.effectId == 6 && `rgb(0, 255, 255) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI))}px 0px`;
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
        let el;
        if (editorStore.childId) {
            el = this.getSingleTextHTMLElement();
        } else {
            el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
        }
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            image = image.document_object.find(text => text._id == editorStore.childId);
        }
        image.textShadowTransparent = val;
        el.style.textShadow = image.effectId == 1 ? `rgba(25, 25, 25, ${1.0 * image.textShadowTransparent / 100}) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * image.blur / 100}px` :
            image.effectId == 2 ? `rgba(0, 0, 0, ${0.6 * image.intensity}) 0 8.9px ${66.75 * image.intensity / 100}px` :
                image.effectId == 4 ? `rgb(128, 128, 128) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
                    image.effectId == 5 ? `rgba(0, 0, 0, 0.5) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
                        image.effectId == 6 && `rgb(0, 255, 255) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI))}px 0px`;
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
        let el;
        if (editorStore.childId) {
            el = this.getSingleTextHTMLElement();
        } else {
            el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
        }
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            image = image.document_object.find(text => text._id == editorStore.childId);
        }
        image.intensity = val;
        el.style.textShadow = image.effectId == 1 ? `rgba(25, 25, 25, ${1.0 * image.textShadowTransparent / 100}) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * image.blur / 100}px` :
            image.effectId == 2 ? `rgba(0, 0, 0, ${0.6 * image.intensity}) 0 8.9px ${66.75 * image.intensity / 100}px` :
                image.effectId == 4 ? `rgb(128, 128, 128) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
                    image.effectId == 5 ? `rgba(0, 0, 0, 0.5) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
                        image.effectId == 6 && `rgb(0, 255, 255) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI))}px 0px`;
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
        let el;
        if (editorStore.childId) {
            el = document.getElementById(editorStore.idObjectSelected + editorStore.childId + "text-container3");
        } else {
            el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
        }
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            image = image.document_object.find(text => text._id == editorStore.childId);
        }
        image.hollowThickness = val;
        el.style.webkitTextStroke = `${1.0 * image.hollowThickness / 100 * 4 + 0.1}px ${image.color}`;
    }

    setSelectionColor = (color, e) => {
        color = color.toString();
        if (e) {
            e.preventDefault();
        }
        let image = editorStore.getImageSelected();
        let childImage;
        if (editorStore.childId) {
            image.document_object.forEach(child => {
                if (child._id == editorStore.childId) {
                    childImage = child;
                }
            })
        }
        if (image.type == TemplateType.BackgroundImage) {
            image.color = color;
            image.src = null;

            editorStore.images2.set(image._id, image);
            this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
        }
        if (image.type == TemplateType.TextTemplate && childImage.type == TemplateType.Heading) {
            image.document_object = image.document_object.map(doc => {
                if (doc._id == editorStore.childId) {
                    doc.color = color;
                }
                return doc;   
            });
            editorStore.images2.set(image._id, image);
            this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
        } else if (image.type == TemplateType.Gradient || image.type == TemplateType.Shape || (childImage && childImage.type == TemplateType.Gradient) || (childImage && childImage.type == TemplateType.Shape)) {
            if (!editorStore.childId) {
                for (let i = 0; i <= CanvasType.Preview; ++i) {
                    let el = document.getElementById(editorStore.idObjectSelected + "1235alo" + (i == 0 ? "" : i));
                    if (el) {
                        let elColors = el.getElementsByClassName("color-" + editorStore.colorField);
                        for (let i = 0; i < elColors.length; ++i) {
                            let ell = elColors[i] as HTMLElement;
                            let field = ell.getAttribute("field");
                            if (ell.tagName == "stop") {
                                if (!field) field = "stopColor";
                                ell.style[field] = color;
                            } else if (ell.tagName == "path" || ell.tagName == "circle" || ell.tagName == "g" || ell.tagName == "polygon") {
                                if (!field) field = "fill";
                                ell.style[field] = color;
                            }
                        }
                    }
                }

                image.colors[editorStore.colorField - 1] = color;
                editorStore.colors = image.colors;
                editorStore.images2.set(image._id, image);
            } else {
                let childImage;
                image.document_object.forEach(child => {
                    if (child._id == editorStore.childId) {
                        childImage = child;
                    }
                })
                for (let i = 0; i <= CanvasType.Preview; ++i) {
                    let el = document.getElementById(editorStore.childId + "1235alo" + (i == 0 ? "" : i));
                    console.log('el ', el);
                    if (el) {
                        let elColors = el.getElementsByClassName("color-" + editorStore.colorField);
                        for (let i = 0; i < elColors.length; ++i) {
                            let ell = elColors[i] as HTMLElement;
                            let field = ell.getAttribute("field");
                            if (ell.tagName == "stop") {
                                if (!field) field = "stopColor";
                                ell.style[field] = color;
                            } else if (ell.tagName == "path" || ell.tagName == "circle" || ell.tagName == "g" || ell.tagName == "polygon") {
                                if (!field) field = "fill";
                                ell.style[field] = color;
                            }
                        }
                    }
                }

                childImage.colors[editorStore.colorField - 1] = color;
                editorStore.colors = childImage.colors;
                image.document_object = image.document_object.map(child => {
                    if (child._id == editorStore.childId) {
                        return childImage;
                    }
                    return child;
                })
                editorStore.images2.set(image._id, image);
            }
        } else if (editorStore.idObjectSelected) {
            image.color = color;
            image.backgroundColor = color;
            if (editorStore.childId) {
                let texts = image.document_object.map(d => {
                    if (d._id == editorStore.childId) {
                        d.color = color;
                    }
                    return d;
                });
                image.document_object = texts;
            }
            editorStore.images2.set(image._id, image);
            this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
        }
    };

    render() {
        let image = editorStore.getImageSelected() || {};

        return (
            <Sidebar
                selectedTab={editorStore.selectedTab}
                sidebar={SidebarTab.Color}
                style={{
                    left: 0,
                    top: 0,
                    background: "white",
                    width: "370px",
                    transition: "none",
                    transform: "none",
                }}
            >
                <div style={{ display: "inline-block" }}>
                    <ul
                        style={{
                            listStyle: "none",
                            padding: "23px 20px"
                        }}
                    >
                        {editorStore.fontColors.map(font => (
                            <div
                                key={uuidv4()}
                                onClick={e => {
                                    e.preventDefault();
                                    this.setSelectionColor(font, e);
                                }}
                                style={{
                                    display: 'inline-block',
                                    marginRight: "5px",
                                }}
                            >
                                <li
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        float: "left",
                                        borderRadius: '3px',
                                        position: 'relative',
                                    }}
                                >
                                    <button
                                        className="color-picker-block"
                                        style={{
                                            width: 'calc(100% - 10px)',
                                            height: 'calc(100% - 10px)',
                                            margin: 'auto',
                                            left: 0,
                                            right: 0,
                                            top: 0,
                                            bottom: 0,
                                            position: 'absolute',
                                            backgroundColor: 'currentColor',
                                            borderRadius: '.15em',
                                            color: font,
                                            border: 'none',
                                            boxShadow: 'inset 0 0 0 1px rgba(14,19,24,.15)',
                                        }}
                                    >
                                    </button>
                                </li>
                            </div>
                        ))}

                        <div
                            style={{
                                display: 'inline-block',
                            }}
                        >
                            <ColorPicker
                                setSelectionColor={this.setSelectionColor}
                                translate={this.props.translate}
                                forceUpdate={() => {
                                    this.forceUpdate();
                                }}
                                color={image.color}
                            />
                        </div>
                    </ul>
                </div>
            </Sidebar>

        )
    }
}