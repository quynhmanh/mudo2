import styled from "styled-components";

export default  styled.div`
    cursor: pointer;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    opacity: ${props => props.loaded ? 1 : 0.1};
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    animation: ${props => props.loaded ? "none" : "LuuT-RWT7fXcJFhRfuaKV 1.4s infinite"}
    background-size: 300% 300%;
    margin-bottom: 8px;
    button {
        visibility: hidden;
    }
    display: inline-block;
    :hover button {
        visibility: visible;
    }
`