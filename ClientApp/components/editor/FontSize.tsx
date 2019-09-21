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
        <button
            id="fontSizeButton"
            style={{
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            height: '26px',
            }}
            className="dropbtn-font dropbtn-font-size"
            onClick={this.onClickDropDownFontSizeList.bind(this)}
        >
        </button>
    );
  }
}