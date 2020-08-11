import React from "react";
import Tooltip from "@Components/shared/Tooltip";

interface IProps {
    show: boolean;
    translate: any;
    handleAlignBtnClick: any;
    title: string;
    iconPath: string;
    checked: boolean;
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
                    padding: "3px 3px 0px",
                    display: "inline-block",
                    cursor: "pointer",
                    color: "black",
                    height: "100%",
                    backgroundColor: props.checked ? "rgba(14, 19, 24, 0.13) " : "white",
                }}
            >
                <img src={iconPath} alt={content}/>
            </a>
        </Tooltip>
    );
}

export default Align;