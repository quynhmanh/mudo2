import "@Styles/tooltip.scss";
import React, {isValidElement} from "react";
import {isArray, isString, isObject} from "lodash";
import Pickr from "@Components/pickr";
import editorStore from "@Store/EditorStore";


import AppComponent from "@Components/shared/AppComponent";
import TemplatesPage from "@Pages/TemplatesPage";
import { TemplateType } from "./enums";

const EVENT_NAME_LIST: string[] = ["hover", "click"];

function parseContent(content : any, eventName : string = "hover") {
    return isString(content) || isArray(content) || isValidElement(content)
        ? content
        : EVENT_NAME_LIST.includes(eventName) && isObject(content)
            ? content[eventName] || content.hover
            : null;
}

export interface IProps {
  setSelectionColor: any;
  colorPickerShown: any;
  handleColorPick: any;
  translate: any;
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
      console.log("colorPicker ", this.props.translate, this.props.translate('save'))
      const pickr = Pickr.create({
        default: null,
        el: '.color-picker',
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
          let colorCode = color.toRGBA();
          this.props.setSelectionColor(colorCode)
          editorStore.addFontColor(colorCode.toString())
          instance.setColor(null);
        })
        .on("show", instance => {
          // this.props.colorPickerShown()
          // editorStore.toggleColorPickerVisibility();
          editorStore.setToggleColorPickerVisibility(true);
        })
        .on("change", (color, instance) => {
          let image = editorStore.imageSelected;
          if (image.type == TemplateType.Heading) {
            if (image.effectId == 3 || image.effectId == 4) {
              document.getElementById(editorStore.idObjectSelected + "hihi5alo")
                .style.webkitTextStroke = `${1.0 * image.hollowThickness / 100 * 4 + 0.1}px ${color}`;
            } else {
              document.getElementById(editorStore.idObjectSelected + "hihi4alo").style.color = color.toRGBA();
            }
          } else if (image.type == TemplateType.TextTemplate) {
            document.getElementById(editorStore.idObjectSelected + editorStore.childId + "text-container2alo").style.color = color.toRGBA();
          } else if (image.type == TemplateType.BackgroundImage) {}
          let colorCode = color.toRGBA();
          this.props.setSelectionColor(colorCode)
        })
        .on("hide", instance => {
          // let colorCode = instance.getColor().toRGBA().toString();
          setTimeout(() => {editorStore.setToggleColorPickerVisibility(false);}, 100);
          // instance.setColor(null);

          // instance._clearColor();
          // instance.setColor('transparent');
          this.props.handleColorPick();
        })
    }

    render() {
      return (
      <a
                      href="#"
                      style={{
                        display: 'inline-block',
                      }}
                      onClick={e => e.preventDefault()}
                    >
                      <li
                        style={{
                          width: "50px",
                          height: "50px",
                          float: "left",
                          marginLeft: "13px",
                          marginTop: "13px",
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
                            backgroundColor: 'currentColor',
                            borderRadius: '.15em',
                            border: 'none',
                            boxShadow: 'inset 0 0 0 1px rgba(14,19,24,.15)',
                          }}                        
                        >
                        </button>
                      </li>
      </a> )
    }
}
