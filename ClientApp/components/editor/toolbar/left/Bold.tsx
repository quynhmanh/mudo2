import React from "react";
import Tooltip from "@Components/shared/Tooltip";
import { handleBoldBtnClick } from "@Utils";
import ToolbarBtn from "../ToolbarBtn";

interface IProps {
    translate: any;
    show: boolean;
    checked: boolean;
}

const Bold = (props: IProps) => {
    const { show, translate } = props;
    const content = translate("bold");
    return (
        <ToolbarBtn>
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
                onClick={handleBoldBtnClick}
            >
                <img 
                    style={{
                        width: "25px",
                    }}
                    src={require("@Components/shared/svgs/editor/toolbar/bold.svg")} alt={content}/>
            </a>
        </Tooltip>
        </ToolbarBtn>
    );
}

export default Bold;