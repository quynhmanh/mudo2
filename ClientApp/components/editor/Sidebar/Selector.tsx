import React, { PureComponent, FormEvent } from "react";
import Tooltip from "@Components/shared/Tooltip";
import { SIDE_BAR_ICONS } from "@Components/editor/Sidebar/SidebarIcons";

export interface IProps {
  selected: boolean;
  prevSelected: boolean;
  nextSelected: boolean;
  content: string;
  sideBarIcon: string | Array<object>;
  onClick(e : any): void;
  disabled: boolean;
}

export interface IState {
}

export default class Selector extends PureComponent<IProps, IState> {

  render() {
    const {
        prevSelected,
        selected,
        nextSelected,
        content,
        onClick,
        sideBarIcon,
        disabled,
    } = this.props;

    return (
        <div
          className="tab-menu"
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "8px",
            backgroundColor: disabled ? '#d2d1d1' : selected ? "rgb(41, 48, 57)" : "white",
            color: selected ? "white" : null,
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 2px 0px",
            borderBottomLeftRadius: prevSelected ? "9px" : null,
            borderBottomRightRadius: nextSelected ? "9px" : null,
            textAlign: 'center',
          }}
          onClick={disabled ? null : onClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
          > 
          {(typeof sideBarIcon === "string" && <path
              fill="currentColor"
              d={sideBarIcon}
            ></path>
            )}
            {(Array.isArray(sideBarIcon) && 
            sideBarIcon.map((icon, i) => {
                return <path
                key={i}
              fill={icon["color"]}
              d={icon["path"]}
            ></path>})
            )}
          </svg>
          <span style={{ fontSize: "11px" }}>{content}</span>
        </div>
    );
  }
}
