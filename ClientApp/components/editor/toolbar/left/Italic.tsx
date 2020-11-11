import React from "react";
import Tooltip from "@Components/shared/Tooltip";
import { handleItalicBtnClick } from "@Utils";

interface IProps {
    translate: any;
    show: boolean;
    checked: boolean;
}

const Italic = (props: IProps) => {
    const { show, translate } = props;
    const content = translate("italic");
    return (
        <Tooltip
            offsetLeft={0}
            offsetTop={-10}
            content={content}
            delay={10}
            style={{ display: show ? "block" : "none" }}
            position="top"
        >
            <a
                href="#"
                className="toolbar-btn"
                style={{
                    padding: "4px 4px 0px",
                    height: "32px",
                    width: "32px",
                    display: "inline-block",
                    cursor: "pointer",
                    color: "black",
                    backgroundColor: props.checked ? "#f2f5f7 " : "white",
                }}
                onClick={handleItalicBtnClick}
            >
                <img 
                    style={{
                        width: "25px",
                    }} 
                    src={require("@Components/shared/svgs/editor/toolbar/italic.svg")} alt={content} />
            </a>
        </Tooltip>
    );
}

export default Italic;