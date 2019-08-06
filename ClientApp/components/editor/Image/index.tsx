import React, { PureComponent, FormEvent } from 'react'
import { getLength, getAngle } from '@Utils';
import StyledImage from './StyledImage'

export interface IProps {
    styles: any;
    onDragStart(e: any, id: string): void;
    onDrag(deltaX : number, deltaY : number) : void;
    onDragEnd(): void;

    selected: boolean;
    zoomable: string;
    src: string;
  }
  
  export interface IState {
    editing: boolean;
  }

export default class Rect extends PureComponent<IProps, IState> {
    $element = null;
    _isMouseDown = false;

  setElementRef = (ref) => { this.$element = ref }

  // Drag
  startDrag = (e) => {
    let { clientX: startX, clientY: startY } = e
    this.props.onDragStart && this.props.onDragStart(e, "test")
    this._isMouseDown = true
    const onMove = (e) => {
      if (!this._isMouseDown) return // patch: fix windows press win key during mouseup issue
      e.stopImmediatePropagation()
      const { clientX, clientY } = e
      const deltaX = clientX - startX
      const deltaY = clientY - startY
      this.props.onDrag(deltaX, deltaY)
      startX = clientX
      startY = clientY
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      if (!this._isMouseDown) return
      this._isMouseDown = false
      this.props.onDragEnd && this.props.onDragEnd()
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  render () {
    const {
      styles: {
        position: { centerX, centerY },
        size: { width, height },
        transform: { rotateAngle }
      },
      zoomable,
      selected,
      src,
    } = this.props

    const style = {
      width: Math.abs(width),
      height: Math.abs(height),
      transform: `rotate(${rotateAngle}deg)`,
      WebkitTransform: `rotate(${rotateAngle}deg)`,
      left: centerX - Math.abs(width) / 2,
      top: centerY - Math.abs(height) / 2,
    }

    if (selected) {
      // style.outline = "1px solid hsla(0,0%,50%,.2)"
    }

    const direction = zoomable.split(',').map(d => d.trim()).filter(d => d) // TODO: may be speed up

    return (
      <StyledImage
        ref={this.setElementRef}
        onMouseDown={this.startDrag}
        className="rect single-resizer"
        style={style}
      >
        <img crossOrigin="anonymous" src={src}/>
      </StyledImage>
    )
  }
}