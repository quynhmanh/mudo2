import React, { Component, PureComponent } from 'react'
import styled from 'styled-components';
import ResizableRect from '@Components/editor/ResizableRect';
import uuidv4 from "uuid/v4";
import Tooltip from '@Components/shared/Tooltip';
import {htmlToImage, getBoundingClientRect} from '@Utils';
import "@Styles/editor.scss";
import TopMenu from '@Components/editor/Sidebar';
import axios from 'axios';
import StyledComponent from 'styled-components';
import Popup from '@Components/shared/Popup';
import { object } from "prop-types";
const thick = 16;

export interface IProps {
    fontSize: any;
    content: string;
    handleFontSizeBtnClick: any;
}

export interface IState {
}


enum Mode {
    CreateDesign = 0,
    CreateTemplate = 1,
    CreateTextTemplate = 2,
    EditTemplate = 3,
    EditTextTemplate = 4,
  }

export default class FontSize extends PureComponent<IProps, IState> {

  shouldComponentUpdate(nextProps) {
    if (this.props.fontSize != nextProps.fontSize) {
      document.getElementById("fontSizeButton").value = Math.round(nextProps.fontSize);
    }
  }

    onClickDropDownFontSizeList = () => {
        document.getElementById("myFontSizeList").classList.toggle("show");
    
        const onDown = e => {
          if (!e.target.matches(".dropbtn-font-size")) {
            var dropdowns = document.getElementsByClassName(
              "dropdown-content-font-size"
            );
            var i;
            for (i = 0; i < dropdowns.length; i++) {
              var openDropdown = dropdowns[i];
              if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
              }
            }
    
            document.removeEventListener("mouseup", onDown);
          }
        };
    
        document.addEventListener("mouseup", onDown);
      };

  render () {
    return (
        <React.Fragment>
          <img 
            src={require("@Components/shared/svgs/editor/toolbar/arrowDown.svg")} 
            alt={this.props.content} 
            style={{ 
              pointerEvents: 'none', 
              position: 'absolute', 
              top: 0,
              bottom: 0,
              right: "4px",
              margin: "auto",
            }}/> 
          <input
              id="fontSizeButton"
              style={{
                height: '100%',
                backgroundColor: "transparent",
                padding: "0 10px",
              }}
              className="dropbtn-font dropbtn-font-size"
              defaultValue={Math.round(this.props.fontSize)}
              onClick={ e=> {
                document.execCommand('selectall', null, false);
                this.onClickDropDownFontSizeList.bind(this)(e);
              }}
              onKeyDown={e => {
                console.log('onKeyDown', e.nativeEvent);
                e.nativeEvent.stopImmediatePropagation();
                if (e.keyCode == 13) {
                    var val = e.target.value;
                    this.props.handleFontSizeBtnClick(e, val);
                    window.getSelection().removeAllRanges();
                    document.getElementById("myFontSizeList").classList.toggle("show");
                }
            }}
          >
            {/* {Math.round(this.props.fontSize)} */}
          </input>
        </React.Fragment>
    );
  }
}