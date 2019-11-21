import React from "react";

interface IProps {
    translate: any;
    handleTransparentAdjust: any;
    currentOpacity: number;
}

const TransparentDropdown = (props: IProps) => {
    return (
        <div
            style={{
                height: "50px",
                right: "10px",
                position: "absolute",
                marginTop: "-9px",
                width: "350px",
                padding: "10px 20px",
                background: "white",
                animation: "bounce 1.2s ease-out"
            }}
            id="myTransparent"
            className="dropdown-content-font-size"
        >
            <p
                style={{
                    display: "inline-block",
                    margin: 0,
                    lineHeight: "30px",
                    width: "146px",
                    fontSize: "12px"
                }}
            >
                {/* Mức trong suốt */}
                {props.translate("transparent")}:{" "}
            </p>
            <div
                style={{
                    display: "flex",
                    height: "4px",
                    backgroundColor: "black",
                    borderRadius: "5px",
                    top: 0,
                    bottom: 0,
                    margin: "auto",
                    width: "100%"
                }}
            >
                <div
                    id="myOpacity-3"
                    style={{
                        borderRadius: "5px",
                        width: "100%"
                    }}
                >
                    <div
                        onMouseDown={props.handleTransparentAdjust}
                        id="myOpacity-3slider"
                        style={{
                            left: props.currentOpacity - 3 + "%",
                            backgroundColor: "#5c5c5f",
                            width: "10px",
                            height: "10px",
                            borderRadius: "5px",
                            top: 0,
                            bottom: 0,
                            margin: "auto",
                            position: "absolute"
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default TransparentDropdown;