import React from "react";
import Tooltip from "@Components/shared/Tooltip";

interface IProps {
    show: boolean;
    translate: any;
    handleAlignBtnClick: any;
    title: string;
    iconPath: string;
}

const Align = (props: IProps) => {
    const { show, handleAlignBtnClick, translate, title, iconPath } = props;
    const content = translate(title);
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
                onClick={e => handleAlignBtnClick(e, title)}
                style={{
                    borderRadius: "4px",
                    padding: "2px 3px 0px",
                    marginRight: "6px",
                    display: "inline-block",
                    cursor: "pointer",
                    color: "black"
                }}
            >
                <img src={iconPath} alt={content}/>
            </a>
        </Tooltip>
    );
}

export default Align;