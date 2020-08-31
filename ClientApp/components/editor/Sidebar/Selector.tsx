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
            color: disabled ? '#a9acae' : selected ? "white" : "#a9acae",
            borderTopRightRadius: prevSelected ? "9px" : null,
            borderBottomRightRadius: nextSelected ? "9px" : null,
            backgroundColor: !selected ? '#0e1318' : 'rgb(41, 48, 57)',
          }}
          onClick={disabled ? null : onClick}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '7px',
            position: "relative",
            width: "100%",
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
            <span 
              style={{ 
                fontSize: "11px", 
                // position: "absolute", 
                top: "100%", 
                marginBottom: "10px",
              }}>{content}</span>
          </div>
        </div>
    );
  }
}
