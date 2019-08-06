import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Text from './Text'
import { centerToTL, tLToCenter, getNewStyle, degToRadian } from '@Utils';

export interface IProps {
    zIndex: number;
    zoomable: string;
    rotatable: boolean;
    top: number; 
    left: number;
    width: number;
    height: number;
    rotateAngle: number;
    scaleX: number;
    scaleY: number;
    innerHTML: string;
    selected: boolean;
    onDragStart(e: any, id: string): void;
    onDrag(deltaX: number, deltaY: number, id: string, clientX: number, clientY: number): void;
    onDragEnd(): void;
    _id: string;
    scale: number;
    minWidth: number;
    minHeight: number;
    parentRotateAngle: number;
    childrens: any;
    onTextChange(parentIndex: string, e: any, key: string): void;
  }
  
  export interface IState {
    editing: boolean;
  }

export default class ResizableText extends PureComponent<IProps, IState> {

  static defaultProps = {
    parentRotateAngle: 0,
    rotateAngle: 0,
    rotatable: true,
    zoomable: '',
    minWidth: 10,
    minHeight: 10
  }

  handleDrag = (deltaX, deltaY, clientX, clientY) => {
    const { _id, scale } = this.props;

    this.props.onDrag && this.props.onDrag(deltaX / scale, deltaY / scale, _id, clientX, clientY)
  }

  render () {
    const {
      top, left, width, height, rotateAngle, parentRotateAngle, zoomable, rotatable, selected, onTextChange, innerHTML,
      onDragStart, onDragEnd, _id, childrens,
      scaleX, scaleY,
      zIndex,
    } = this.props

    const styles = tLToCenter({ top, left, width, height, rotateAngle })

    return (
      <Text
        zIndex={zIndex}
        scaleX={scaleX}
        scaleY={scaleY}
        childrens={childrens}
        _id={_id}
        innerHTML={innerHTML}
        selected={selected}
        styles={styles}
        zoomable={zoomable}
        rotatable={Boolean(rotatable)}
        parentRotateAngle={parentRotateAngle}

        onDragStart={onDragStart}
        onDrag={this.handleDrag}
        onDragEnd={onDragEnd}
        onTextChange={onTextChange}
      />
    )
  }
}