import React from "react";
import Tooltip from "@Components/shared/Tooltip";

interface IProps {
    translate: any;
    show: boolean;
    handleItalicBtnClick: any;
}

const Italic = (props: IProps) => {
    const { show, handleItalicBtnClick, translate } = props;
    return (
        <Tooltip
            offsetLeft={0}
            offsetTop={-5}
            content={translate("italic")}
            delay={10}
            style={{ display: show ? "block" : "none" }}
            position="top"
        >
            <a
                href="#"
                className="toolbar-btn"
                style={{
                    padding: "3px",
                    paddingBottom: "0px",
                    display: "inline-block",
                    cursor: "pointer",
                    color: "black"
                }}
                onClick={handleItalicBtnClick}
            >
                <svg
                    viewBox="0 0 24 24"
                    preserveAspectRatio="xMidYMid meet"
                    style={{ width: "20px", height: "20px" }}
                >
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M14.73 6.5l-3.67 11H14l-.3 1.5H6l.3-1.5h2.81l3.68-11H10l.3-1.5H18l-.3 1.5h-2.97z"
                    />
                </svg>
            </a>
        </Tooltip>
    );
}

export default Italic;