import styled from 'styled-components'

export default styled.div`
  position: absolute;
  .square {
    position: absolute;
    border-radius: 1px;
    z-index: 999;
    &.tl,
    &.t,
    &.tr {
      top: -10px;
    }
    &.tl,
    &.l,
    &.bl {
      left: -6px;
    }
    &.bl,
    &.b,
    &.br {
      bottom: -6px;
    }
    &.br,
    &.r,
    &.tr {
      left: 5px;
    }
    &.l,
    &.r {
      margin-top: -9px;
    }
    &.t,
    &.b {
      margin-left: -9px;
    }
    &.t {
        border-radius: 19%;
        top: -3px;
        width: 15px;
        height: 4px;
    }
    &.r {
        border-radius: 19%;
        height: 15px;
        width: 4px;
        right: -3px;
    }
    &.b {
        border-radius: 19%;
        bottom: -3px;
        width: 15px;
        height: 4px;
    }
    &.l {
        border-radius: 19%;
        height: 15px;
        width: 4px;
        left: -3px;
    }
  }
  .resizable-handler-container {
    position: absolute;
    width: 20px;
    height: 20px;
    right: -10px;
    transform-origin: center;
    z-index: 12312313;
    transition: opacity 0.1s ease-in-out 0s;
    &.tr {
      top: -10px;
      transform-origin: center;
    }
    &.tl {
      transform-origin: center;
    }
    svg {
      
    }
  }
  .resizable-handler {
    box-shadow: 0 0 5px 1px rgba(75,102,129,.15), 0 0 0 1px rgba(70,94,119,.2);
    background-color: white;
    border-radius: 50%;
    position: absolute;
    width: 12px;
    height: 12px;
    cursor: pointer;
    z-index: 1000;
    &.tl,
    &.br,
    &.bl,
    &.t,
    &.tr,
    &.l,
    &.r,
    &.t,
    &.b {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
    }
    &.tl,
    &.l,
    &.bl {
    }
    &.bl,
    &.b,
    &.br {
    }
    &.br,
    &.r,
    &.tr {
    }
    &.l,
    &.r {
    }
    &.t,
    &.b {
    }
    &.t {
        border-radius: 19%;
        width: 15px;
        height: 4px;
    }
    &.r {
        border-radius: 19%;
        height: 15px;
        width: 4px;
    }
    &.b {
        border-radius: 19%;
        width: 15px;
        height: 4px;
    }
    &.l {
        border-radius: 19%;
        height: 15px;
        width: 4px;
    }
  }
  .rotate-container {
    position: absolute;
    left: calc(50% - 10px);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    bottom: 110%;
  }
  .rotate {
  }
  .t,
  .tl,
  .tr {
    top: -9px;
  }
  .b,
  .bl,
  .br {
    bottom: -9px;
  }
  .r,
  .tr,
  .br {
    right: -9px;
  }
  .tl,
  .l,
  .bl {
    left: -9px;
  }
  .l,
  .r {
    top: calc(50% - 10px);
  }
  .t,
  .b {
    left: calc(50% - 10px);
  }
  .l {
    left: -10px;
  }
  .r {
    right: -10px;
  }
  .t {
    top: -10px;
  }
  .b {
    bottom: -10px;
  }
`