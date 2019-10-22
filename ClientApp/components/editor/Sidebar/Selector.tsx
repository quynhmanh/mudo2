import React, { PureComponent } from "react";

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
            color: disabled ? '#d2d1d1' : selected ? "white" : "white",
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 2px 0px",
            borderTopRightRadius: prevSelected ? "9px" : null,
            borderBottomRightRadius: nextSelected ? "9px" : null,
            textAlign: 'center',
            backgroundColor: !selected ? '#0e1318' : 'rgb(41, 48, 57)',
            height: '70px',
          }}
          onClick={disabled ? null : onClick}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: 'auto',
          }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
        </div>
    );
  }
}
