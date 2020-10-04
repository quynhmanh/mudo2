import "@Styles/tooltip.scss";
import React, { isValidElement } from "react";
import { isArray, isString, isObject } from "lodash";
import Pickr from "@Components/pickr";
import editorStore from "@Store/EditorStore";
import "@Styles/colorPicker.scss";

import AppComponent from "@Components/shared/AppComponent";
import TemplatesPage from "@Pages/TemplatesPage";
import { SidebarTab, TemplateType } from "./enums";

const EVENT_NAME_LIST: string[] = ["hover", "click"];

function parseContent(content: any, eventName: string = "hover") {
    return isString(content) || isArray(content) || isValidElement(content)
        ? content
        : EVENT_NAME_LIST.includes(eventName) && isObject(content)
            ? content[eventName] || content.hover
            : null;
}

export interface IProps {
    setSelectionColor: any;
    translate: any;
    forceUpdate: any;
    color: any;
}

export interface IState {
    isOpen: boolean;
    isClicked: boolean;
}

export default class Tooltip extends AppComponent<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isClicked: false
        };
    }

    componentDidMount = () => {
        const colors = this.props.color;
        const pickr = Pickr.create({
            default: colors ? `rgb(${colors[0]},${colors[1]},${colors[2]})` : null,
            el: '.color-picker',
            useAsButton: true,
            theme: 'nano', // or 'monolith', or 'nano'
            defaultRepresentation: 'HEX',
            components: {
                palette: true,
                preview: true, // Display comparison between previous state and new color
                hue: true,     // Display hue slider
                interaction: {
                    input: true,
                    clear: true,
                    save: true
                }
            },
            i18n: {
                'ui:dialog': 'color picker dialog',
                'btn:toggle': 'toggle color picker dialog',
                'btn:swatch': 'color swatch',
                'btn:last-color': 'use previous color',
                'btn:save': this.props.translate('save'),
                'btn:cancel': 'Cancel',
                'btn:clear': this.props.translate('clear'),

                // Strings used for aria-labels
                'aria:btn:save': 'save and close',
                'aria:btn:cancel': 'cancel and close',
                'aria:btn:clear': 'clear and close',
                'aria:input': 'color input field',
                'aria:palette': 'color selection area',
                'aria:hue': 'hue selection slider',
                'aria:opacity': 'selection slider'
            }
        });

        pickr
            .on("save", (color, instance) => {
                if (color) {
                    let colorCode = color.toRGBA();
                    this.props.setSelectionColor(colorCode)
                    editorStore.addFontColor(colorCode.toString())
                    instance.setColor(null);
                    this.props.forceUpdate();
                }
            })
            .on("show", instance => {
                // this.props.colorPickerShown()
                // editorStore.toggleColorPickerVisibility();
                editorStore.setToggleColorPickerVisibility(true);
            })
            .on("change", (color, instance) => {
                let image = editorStore.getImageSelected();

                if (editorStore.selectedTab == SidebarTab.Color) {
                    if (image.type == TemplateType.Heading) {
                        if (image.effectId == 3 || image.effectId == 4) {
                            document.getElementById(editorStore.idObjectSelected + "hihi5alo")
                                .style.webkitTextStroke = `${1.0 * image.hollowThickness / 100 * 4 + 0.1}px ${color}`;
                        } else {
                            document.getElementById(editorStore.idObjectSelected + "hihi4alo").style.color = color.toRGBA();
                        }
                    } else if (image.type == TemplateType.TextTemplate) {
                        document.getElementById(editorStore.idObjectSelected + editorStore.childId + "text-container2alo").style.color = color.toRGBA();
                    } else if (image.type == TemplateType.BackgroundImage) { }
                } else if (editorStore.selectedTab == SidebarTab.Effect) {
                    let el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
                    if (image.type == TemplateType.TextTemplate) {
                        el = document.getElementById(editorStore.idObjectSelected + editorStore.childId + "text-container2alo");
                        image = image.document_object.find(text => text._id == editorStore.childId) || {};
                    }
                    const colors = color.toRGBA();

                    console.log('el ', el)

                    if (editorStore.effectId == 1) {
                        el.style.textShadow = `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, ${1.0 * image.textShadowTransparent / 100}) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * image.blur / 100}px`;

                        this.props.setSelectionColor(colors)
                        return;
                    } else if (editorStore.effectId == 4) {
                        el.style.textShadow = `rgb(${colors[0]}, ${colors[1]}, ${colors[2]}) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px`;

                        this.props.setSelectionColor(colors)
                        return;
                    } else if (editorStore.effectId == 5) {
                        el.style.textShadow = `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, 0.5) ${21.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, 0.3) ${41.0 * image.offSet / 100 * Math.sin(image.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * image.offSet / 100 * Math.cos(image.direction * 3.6 / 360 * 2 * Math.PI)}px 0px`;

                        this.props.setSelectionColor(colors)
                        return;
                    }
                }

                let colorCode = color.toRGBA();
                this.props.setSelectionColor(colorCode)
            })
            .on("hide", instance => {
                // let colorCode = instance.getColor().toRGBA().toString();
                setTimeout(() => { editorStore.setToggleColorPickerVisibility(false); }, 100);
                // instance.setColor(null);

                // instance._clearColor();
                // instance.setColor('transparent');
                // this.props.handleColorPick();
            })
    }

    render() {
        const colors = this.props.color;
        if (colors) console.log(`rgb(${colors[0]},${colors[1]},${colors[2]})`);
        return (
            <a
                href="#"
                style={{
                    display: 'inline-block',
                }}
                onClick={e => e.preventDefault()}
            >
                <div
                    style={{
                        width: "50px",
                        height: "50px",
                        float: "left",
                        borderRadius: '3px',
                        position: 'relative',
                    }}
                >
                    <button
                        className="color-picker-block color-picker"
                        style={{
                            width: 'calc(100% - 10px)',
                            height: 'calc(100% - 10px)',
                            margin: 'auto',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            position: 'absolute',
                            backgroundColor: colors && `rgb(${colors[0]},${colors[1]},${colors[2]})`,
                            borderRadius: '.15em',
                            border: 'none',
                            boxShadow: 'inset 0 0 0 1px rgba(14,19,24,.15)',
                            backgroundImage: (!colors || colors.length < 3) ? 'url(web_images/test.png)' : '',
                            backgroundSize: "100% 100%",
                        }}
                    >
                    </button>
                </div>
            </a>)
    }
}
