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
    onClickDropDownFontSizeList = () => {
        document.getElementById("myFontSizeList").classList.toggle("show");
    
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
        <div>
        <svg style={{
          pointerEvents: 'none',
          position: 'absolute',
          right: '10px',
          top: '4px',
        }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M11.71 6.47l-3.53 3.54c-.1.1-.26.1-.36 0L4.3 6.47a.75.75 0 1 0-1.06 1.06l3.53 3.54c.69.68 1.8.68 2.48 0l3.53-3.54a.75.75 0 0 0-1.06-1.06z"></path></svg>
        <button
            id="fontSizeButton"
            style={{
              height: '26px',
              width: '86px',
            }}
            className="dropbtn-font dropbtn-font-size"
            onClick={this.onClickDropDownFontSizeList.bind(this)}
        >
        </button>
        </div>
    );
  }
}