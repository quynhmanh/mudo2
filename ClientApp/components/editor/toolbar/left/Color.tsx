import React from "react";
import Tooltip from "@Components/shared/Tooltip";

interface IProps {
    translate: any;
    show: boolean;
    handleColorBtnClick: any;
    fontColor: string;
}

const Color = (props: IProps) => {
    const { show, fontColor, handleColorBtnClick, translate } = props;
    const content = translate("color");
    return (
        <Tooltip
            offsetLeft={0}
            offsetTop={-5}
            content={content}
            delay={10}
            style={{ display: show ? "block" : "none" }}
            position="top"
        >
            <a
                href="#"
                style={{
                    position: "relative",
                    borderRadius: "4px",
                    padding: "3px",
                    paddingBottom: "0px",
                    marginRight: "6px",
                    display: "inline-block",
                    cursor: "pointer",
                    color: "black",
                    height: "100%"
                }}
                onClick={handleColorBtnClick}
                className="toolbar-btn"
            >
                <img src={require("@Components/shared/svgs/editor/toolbar/colorPicker.svg")} alt={content}/>
                <div
                    style={{
                        position: "absolute",
                        bottom: "4px",
                        left: "4px",
                        borderRadius: "14px",
                        width: "72%",
                        height: "4px",
                        backgroundColor: fontColor,
                        boxShadow: "inset 0 0 0 1px rgba(14,19,24,.15)"
                    }}
                    className={
                        fontColor === "black"
                            ? "font-color-btn"
                            : ""
                    }
                ></div>
            </a>
        </Tooltip>
    );
}

export default Color;