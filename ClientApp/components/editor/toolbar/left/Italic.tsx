import React from "react";
import Tooltip from "@Components/shared/Tooltip";

interface IProps {
    translate: any;
    show: boolean;
    handleItalicBtnClick: any;
    checked: boolean;
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
                    color: "black",
                    height: "100%",
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