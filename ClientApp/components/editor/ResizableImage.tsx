import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Image from './Image'
import { centerToTL, tLToCenter, getNewStyle, degToRadian } from '@Utils';

export interface IProps {
    zoomable: string;
    rotatable: boolean;
    top: number; 
    left: number;
    width: number;
    height: number;
    rotateAngle: number;
    selected: boolean;
    onDragStart(e: any, id: string): void;
    onDrag(deltaX: number, deltaY: number): void;
    onDragEnd(): void;
    _id: string;
    scale: number;
    aspectRatio: number;
    minWidth: number;
    minHeight: number;
    parentRotateAngle: number;
    src: string;
  }
  
  export interface IState {
    editing: boolean;
  }

export default class ResizableImage extends PureComponent<IProps, IState> {

  static defaultProps = {
    parentRotateAngle: 0,
    rotateAngle: 0,
    rotatable: true,
    zoomable: '',
    minWidth: 2,
    minHeight: 2,
  }

  handleDrag = (deltaX, deltaY) => {
    this.props.onDrag && this.props.onDrag(deltaX, deltaY)
  }

  render () {
    const {
      top, left, width, height, rotateAngle, zoomable, selected, src,
        onDragStart, onDragEnd
    } = this.props

    const styles = tLToCenter({ top, left, width, height, rotateAngle })
    
    return (
      <Image
        src={src}
        selected={selected}
        styles={styles}
        zoomable={zoomable}

        onDragStart={onDragStart}
        onDrag={this.handleDrag}
        onDragEnd={onDragEnd}
      />
    )
  }
}