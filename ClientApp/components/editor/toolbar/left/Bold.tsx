import React from "react";
import Tooltip from "@Components/shared/Tooltip";

interface IProps {
    translate: any;
    show: boolean;
    handleBoldBtnClick: any;
    checked: boolean;
}

const Bold = (props: IProps) => {
    const { show, handleBoldBtnClick, translate } = props;
    const content = translate("bold");
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
                    backgroundColor: props.checked ? "rgba(14, 19, 24, 0.13) " : "white",
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
    );
}

export default Bold;