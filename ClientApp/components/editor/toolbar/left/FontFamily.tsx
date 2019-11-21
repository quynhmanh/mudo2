import React from "react";
import Tooltip from "@Components/shared/Tooltip";

interface IProps {
    translate: any;
    show: boolean;
    onClickDropDownFontList: any;
    fontName: string;
}

const FontFamily = (props: IProps) => {
    const { show, fontName, onClickDropDownFontList, translate } = props;
    return (
        <Tooltip
            offsetLeft={0}
            offsetTop={-5}
            content={translate("fontFamily")}
            delay={10}
            style={{ display: show ? "block" : "none" }}
            position="top"
        >
            <a
                href="#"
                className="toolbar-btn"
                onClick={onClickDropDownFontList}
                style={{
                    borderRadius: "4px",
                    padding: "3px",
                    paddingBottom: "0px",
                    display: "inline-block",
                    cursor: "pointer",
                    color: "black",
                    position: "relative"
                }}
            >
                <img
                    style={{ height: "21px", filter: "invert(1)" }}
                    src={fontName}
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    style={{
                        pointerEvents: "none",
                        position: "absolute",
                        right: "10px",
                        top: "4px"
                    }}
                >
                    <path
                        fill="currentColor"
                        d="M11.71 6.47l-3.53 3.54c-.1.1-.26.1-.36 0L4.3 6.47a.75.75 0 1 0-1.06 1.06l3.53 3.54c.69.68 1.8.68 2.48 0l3.53-3.54a.75.75 0 0 0-1.06-1.06z"
                    ></path>
                </svg>
            </a>
        </Tooltip>
    );
}

export default FontFamily;