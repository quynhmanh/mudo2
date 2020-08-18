import styled from 'styled-components'

export default styled.div`
  position: absolute;
  .square {
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 1px;
  }
  .resizable-handler {
    box-shadow: 0 0 5px 1px rgba(75,102,129,.15), 0 0 0 1px rgba(70,94,119,.2);
    background-color: white;
    border-radius: 50%;
    position: absolute;
    width: 10px;
    height: 10px;
    cursor: pointer;
    z-index: 1;
    &.tl,
    &.t,
    &.tr {
      top: -6px;
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
      right: -6px;
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
  .rotate {
    position: absolute;
    left: 50%;
    top: -31px;
    width: 18px;
    height: 18px;
    margin-left: -11px;
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
  p:focus {
    outline: 1px solid rgba(128, 128, 128, 0.2);
  }
`