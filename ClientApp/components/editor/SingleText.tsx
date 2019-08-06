import React, { Component, FormEvent } from 'react'
import styled from 'styled-components';

export interface IProps {
  zIndex: number;
  left: number;
  top: number;
  width: number;
  height: number;
  rotateAngle: number;
  scaleX: number;
  scaleY: number;
  innerHTML: string;
  fontScale: number;
  fontSize: number;
  onTextChange(): void;
  id: string;
}

export interface IState {
}

export default class SingleText extends Component<IProps, IState> {
  _isMouseDown = false
  $element = null
  $textEle = null

  setElementRef = (ref) => { this.$element = ref }
  setTextElementRef = (ref) => { 
    this.$textEle = ref
  }

  componentDidMount() {
    this.$textEle.innerHTML = this.props.innerHTML;
  }

  endEditing() {
    this.setState({editing: false})
  }

  render () {
    const {
        left,
        top,
        width,
        height, 
        onTextChange,
        rotateAngle,
        scaleX,
        scaleY,
        zIndex,
        id,
    } = this.props

    return (
      <div 
        id={id}
        style={{
        position: 'absolute',
        top: top + 'px',
        left: left + 'px',
        width: width + 'px',
        height: height + 'px',
        transform: `rotate(${rotateAngle}deg)`,
        zIndex: zIndex,
      }}>
        <div style={{
        position: 'absolute',
        width: (width / scaleX) + 'px',
        height: (height / scaleY) + 'px',
        transform: `scaleX(${scaleX}) scaleY(${scaleY})`,
        transformOrigin: '0 0',
        zIndex: zIndex,
      }}>
        <p  
            spellCheck={false}
            onInput={onTextChange}
            contentEditable={true}
            ref={this.setTextElementRef.bind(this)}
            className="text single-text" 
            style={{
            position: 'absolute',
            display: 'block',
            width: (width / scaleX - 20) + 'px',
            margin: '0px',
            zIndex: zIndex,
            }}></p>
          </div>
      </div>
    )
  }
}