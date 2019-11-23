import "@Styles/tooltip.scss";
import React, {PureComponent, Fragment, isValidElement} from "react";
import {isArray, isEqual, isString, isObject} from "lodash";
import {trimList, getOtherProps} from "@Utils";
import {TYPE_ELEMENT_MAP} from "@Constants";
import Tip from "@Components/shared/Tip";
import loadable from "@loadable/component";
import Pickr from "@Components/pickr";
import editorStore from "@Store/EditorStore";


import AppComponent from "@Components/shared/AppComponent";

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
        // let colorPicker = document.getElementById("color-picker");
        // colorPicker.addEventListener("mouseup", (e) => {
        //     e.stopImmediatePropagation();
        // })

        console.log('pickr ', Pickr)

        const pickr = Pickr.create({
          default: null,
          el: '.color-picker',
          theme: 'nano', // or 'monolith', or 'nano'
    
          swatches: [
              'rgb(244, 67, 54)',
              'rgb(233, 30, 99)',
              'rgb(156, 39, 176)',
              'rgb(103, 58, 183)',
              'rgb(63, 81, 181)',
              'rgb(33, 150, 243)',
              'rgb(3, 169, 244)',
              'rgb(0, 188, 212)',
              'rgb(0, 150, 136)',
              'rgb(76, 175, 80)',
              'rgb(139, 195, 74)',
              'rgb(205, 220, 57)',
              'rgb(255, 235, 59)',
              'rgb(255, 193, 7)'
          ],
          defaultRepresentation: 'HEX',
    
          components: {
    
              // Main components
              // preview: true,
              // opacity: true,
              // hue: true,
              // palette: true,
              palette: true,
              preview: true, // Display comparison between previous state and new color
        // opacity: true, // Display opacity slider
        hue: true,     // Display hue slider
    
              // Input / output Options
              interaction: {
                  input: true,
                  clear: true,
                  save: true
              }
          }
        });

        // pickr.clear();

        console.log('pickr ', pickr);

        pickr
        .on("save", (color, instance) => {
          console.log('save', color.toRGBA(), instance)
          let colorCode = color.toRGBA();
          this.props.setSelectionColor(colorCode)
          editorStore.addFontColor(colorCode.toString())
        })
        .on("show", instance => {
          // this.props.colorPickerShown()
          console.log('pickr show');
          // editorStore.toggleColorPickerVisibility();
          editorStore.setToggleColorPickerVisibility(true);
        })
        .on("change", (color, instance) => {
          document.getElementById(editorStore.idObjectSelected + "hihi4").style.color = color.toRGBA();
          let colorCode = color.toRGBA();
          this.props.setSelectionColor(colorCode)
        })
        .on("hide", instance => {
          console.log('pickr hide');
          let colorCode = instance.getColor().toRGBA().toString();
          console.log('instance ', instance);
          console.log('colorCode ', colorCode);
          setTimeout(() => {editorStore.setToggleColorPickerVisibility(false);}, 100);
          // instance.setColor(null);

          // instance._clearColor();
          // instance.setColor('transparent');
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
      

        return <div id="color-picker" className="color-picker pcr-app visible" data-theme="nano" aria-label="color picker dialog" role="form">
        <div className="pcr-selection">
          <div className="pcr-color-preview">
            <button type="button" className="pcr-last-color" aria-label="use previous color" style={{color: 'rgb(66, 68, 90)'}} />
            <div className="pcr-current-color" style={{color: 'rgb(66, 68, 90)'}} />
          </div>
          <div className="pcr-color-palette">
            <div className="pcr-picker" style={{left: 'calc(26.6667% - 9px)', top: 'calc(64.7059% - 9px)', background: 'rgb(66, 68, 90)'}} />
            <div className="pcr-palette" tabIndex={0} aria-label="color selection area" role="listbox" style={{background: 'linear-gradient(to top, rgb(0, 0, 0), transparent), linear-gradient(to left, rgb(0, 21, 255), rgb(255, 255, 255))'}} />
          </div>
          <div className="pcr-color-chooser">
            <div className="pcr-picker" style={{left: 'calc(65.2778% - 9px)', backgroundColor: 'rgb(0, 21, 255)'}} />
            <div className="pcr-hue pcr-slider" tabIndex={0} aria-label="hue selection slider" role="slider" />
          </div>
          <div className="pcr-color-opacity">
            <div className="pcr-picker" style={{left: 'calc(100% - 9px)', background: 'rgb(0, 0, 0)'}} />
            <div className="pcr-opacity pcr-slider" tabIndex={0} aria-label="opacity selection slider" role="slider" />
          </div>
        </div>
        <div className="pcr-swatches "><button type="button" style={{color: 'rgba(244, 67, 54, 1)'}} aria-label="color swatch" /><button type="button" style={{color: 'rgba(233, 30, 99, 0.95)'}} aria-label="color swatch" /><button type="button" style={{color: 'rgba(156, 39, 176, 0.9)'}} aria-label="color swatch" /><button type="button" style={{color: 'rgba(103, 58, 183, 0.85)'}} aria-label="color swatch" /><button type="button" style={{color: 'rgba(63, 81, 181, 0.8)'}} aria-label="color swatch" /><button type="button" style={{color: 'rgba(33, 150, 243, 0.75)'}} aria-label="color swatch" /><button type="button" style={{color: 'rgba(3, 169, 244, 0.7)'}} aria-label="color swatch" /></div> 
        <div className="pcr-interaction">
          <input className="pcr-result" type="text" spellCheck="false" />
          <input className="pcr-type active" data-type="HEXA" defaultValue="HEXA" type="button" style={{display: 'none'}} hidden />
          <input className="pcr-type" data-type="RGBA" defaultValue="RGBA" type="button" style={{display: 'none'}} hidden />
          <input className="pcr-type" data-type="HSLA" defaultValue="HSLA" type="button" style={{display: 'none'}} hidden />
          <input className="pcr-type" data-type="HSVA" defaultValue="HSVA" type="button" style={{display: 'none'}} hidden />
          <input className="pcr-type" data-type="CMYK" defaultValue="CMYK" type="button" style={{display: 'none'}} hidden />
          <input className="pcr-save" defaultValue="Save" type="button" aria-label="save and exit" />
          <input className="pcr-cancel" defaultValue="Cancel" type="button" style={{display: 'none'}} hidden aria-label="cancel and exit" />
          <input className="pcr-clear" defaultValue="Clear" type="button" aria-label="clear and exit" />
        </div>
      </div>;
    }
}
