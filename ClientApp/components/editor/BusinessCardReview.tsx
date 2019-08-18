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

export default class Canvas extends PureComponent<IProps, IState> {
  render () {
    return <div id="alo2" className="eNf6210Ehjw49xuxCsPpk" 
    style={{
        width: '328px', 
        height: '218px', 
        position: 'relative', 
        transform: 'scale(0.9)',
        borderRadius: '5px',
        overflow: 'hidden',
    }}>
    <div>
        <div className="jPqjdkeSY9qVUI2aXLxBM" style={{width: '100%', height: '100%'}}>
            <div className="_3xuQY2WvIb4HzdBPfQLcnB" style={{width: '100%', height: '100%'}}>
                <div><img className="_2tUb2T7qqgI_btAzbEXhpy" src="https://c.imge.to/2019/08/18/VKKnO.png" style={{width: '100%', height: '100%'}} /></div>
                <div className="_36NEU03UAgvptunPQ33QuJ" style={{transformOrigin: '0 0', position: 'absolute', top: 0, left: 0, transform: 'matrix3d(0.322355, 0.185808, 0, -9.50633e-06, -0.18974, 0.318912, 0, -2.2009e-05, 0, 0, 1, 0, 139.4, 11.8074, 0, 1)'}}>
                    <div className="_3fyu-w84Dj-GvX55phR6M8" style={{width: '321.26px', height: '188.976px'}}>
                        <div style={{width: '321.26px', height: '188.976px', overflow: 'hidden'}}>
                            <div>
                                <div className="cJvigNF8nKVq8YRvhrcrK _3Tk7vFk3XB74DSjc-X114e fs-hide" style={{width: '321.26px', height: '188.976px'}}>
                                    {this.props.children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div><img src="https://c.imge.to/2019/08/18/VWvj4.png" className="_3ABwoP9VfcpIZ-Qr_klynj" style={{width: '100%', height: '100%', position: 'absolute', left: 0, top: 0}} /></div>
    </div>
</div>
  }
}