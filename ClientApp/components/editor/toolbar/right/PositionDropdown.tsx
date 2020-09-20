import React from "react";

interface IProps {
    translate: any;
    forwardSelectedObject: any;
    backwardSelectedObject: any;
}

const PositionDropdown = (props: IProps) => {
    return (
        <div
            id="myPositionList"
            style={{
                right: "10px",
                backgroundColor: "white",
                animation: "bounce 0.8s ease-out"
            }}
            className="dropdown-content-font-size"
        >
            <div style={{ display: "flex" }}>
                <div
                    id="myDropdownFontSize-2"
                    style={{
                        borderRadius: "5px",
                        padding: "10px"
                    }}
                >
                    <button
                        className="positionBtn"
                        style={{
                            padding: "6px",
                            border: "none",
                            backgroundColor: "#eee",
                            borderRadius: "3px",
                            marginRight: "10px",
                            width: "135px",
                            display: "inline-flex",
                            justifyContent: "center",
                        }}
                        onClick={props.forwardSelectedObject}
                    >
                        <img 
                            src={require("@Components/shared/svgs/editor/toolbar/forward.svg")} 
                            alt={props.translate("forward")} 
                            style={{ marginRight: "10px" }}
                        />
                        <span 
                            style={{ 
                                lineHeight: "24px" 
                            }}
                        >
                            {props.translate("forward")}
                        </span>
                    </button>
                    <button
                        className="positionBtn"
                        style={{
                            padding: "6px",
                            border: "none",
                            backgroundColor: "#eee",
                            borderRadius: "3px",
                            width: "135px",
                            display: "inline-flex",
                            justifyContent: "center",
                        }}
                        onClick={props.backwardSelectedObject}
                    >
                        <img 
                            src={require("@Components/shared/svgs/editor/toolbar/backward.svg")} 
                            alt={props.translate("backward")} 
                            style={{ 
                                marginRight: "10px" 
                                }}/>
                        <span 
                            style={{ 
                                lineHeight: "24px" 
                        }}>
                            {props.translate("backward")}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PositionDropdown;