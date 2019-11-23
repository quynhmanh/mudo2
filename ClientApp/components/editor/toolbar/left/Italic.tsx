import React from "react";
import Tooltip from "@Components/shared/Tooltip";

interface IProps {
    translate: any;
    show: boolean;
    handleItalicBtnClick: any;
}

const Italic = (props: IProps) => {
    const { show, handleItalicBtnClick, translate } = props;
    const content = translate("italic");
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
                <img src={require("@Components/shared/svgs/editor/toolbar/italic.svg")} alt={content} />
            </a>
        </Tooltip>
    );
}

export default Italic;