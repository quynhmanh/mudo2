import styled from 'styled-components';
import { SidebarTab } from './enums';

export default styled.div`
    opacity: ${props => props.selectedTab === props.sidebar ? 1 : 0};
    position: absolute;
    width: 347px;
    color: ${props=> props.color ? props.color : 'white'};
    transition: transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out;
    transform: ${props => props.selectedTab !== props.sidebar && `translate3d(0px, calc(${props.selectedTab < props.sidebar ? 40 : -40}px), 0px)`};
    top: 10px;
    z-index: ${props => props.selectedTab !== props.sidebar ? 0 : 1};
    height: 100%;
    left: 19px;
    overflow: visible;
`;