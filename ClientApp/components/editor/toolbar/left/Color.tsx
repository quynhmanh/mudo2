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
    return (
        <Tooltip
            offsetLeft={0}
            offsetTop={-5}
            content={translate("color")}
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
                <svg
                    viewBox="0 0 24 24"
                    preserveAspectRatio="xMidYMid meet"
                    style={{ width: "20px", height: "20px" }}
                >
                    <path
                        d="M11 2L5.5 16h2.25l1.12-3h6.25l1.12 3h2.25L13 2h-2zm-1.38 9L12 4.67 14.38 11H9.62z"
                        fill="currentColor"
                    />
                </svg>
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