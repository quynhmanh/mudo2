import React from "react";
import Tooltip from "@Components/shared/Tooltip";
import { handleAlignBtnClick } from "@Utils";
import ToolbarBtn from "@Components/editor/toolbar/ToolbarBtn";

interface IProps {
    show: boolean;
    translate: any;
    title: string;
    iconPath: string;
    checked: boolean;
}

const Align = (props: IProps) => {
    const { show, translate, title, iconPath } = props;
    const content = translate(title);
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
                onClick={e => handleAlignBtnClick(e, title)}
                style={{
                    borderRadius: "4px",
                    padding: "4px 4px 0px",
                    height: "32px",
                    width: "32px",
                    display: "inline-block",
                    cursor: "pointer",
                    color: "black",
                    backgroundColor: props.checked ? "#f2f5f7 " : "white",
                }}
            >
                <img src={iconPath} alt={content}/>
            </a>
        </Tooltip>
        </ToolbarBtn>
    );
}

export default Align;