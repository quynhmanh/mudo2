import styled from 'styled-components'

export default styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  transform: rotate(${props => props.rotateAngle}deg);
  -webkit-transform: rotate(${props => props.rotateAngle}deg);
  left: ${props => props.left}px;
  top: ${props => props.top}px;

  position: absolute;
  img {
      width: 100%;
      height: 100%;
  }
  .square {
    position: absolute;
    width: 7px;
    height: 7px;
    background: white;
    border-radius: 1px;
  }
  .resizable-handler {
    position: absolute;
    width: 14px;
    height: 14px;
    cursor: pointer;
    z-index: 1;
    &.tl,
    &.t,
    &.tr {
      top: -7px;
    }
    &.tl,
    &.l,
    &.bl {
      left: -7px;
    }
    &.bl,
    &.b,
    &.br {
      bottom: -7px;
    }
    &.br,
    &.r,
    &.tr {
      right: -7px;
    }
    &.l,
    &.r {
      margin-top: -7px;
    }
    &.t,
    &.b {
      margin-left: -7px;
    }
  }
  .rotate {
    position: absolute;
    left: 50%;
    top: -26px;
    width: 18px;
    height: 18px;
    margin-left: -9px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .t,
  .tl,
  .tr {
    top: -3px;
  }
  .b,
  .bl,
  .br {
    bottom: -3px;
  }
  .r,
  .tr,
  .br {
    right: -3px;
  }
  .tl,
  .l,
  .bl {
    left: -3px;
  }
  .l,
  .r {
    top: 50%;
    margin-top: -3px;
  }
  .t,
  .b {
    left: 50%;
    margin-left: -3px;
  }
`