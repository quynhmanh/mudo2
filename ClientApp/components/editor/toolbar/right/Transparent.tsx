import React from "react";
import Tooltip from "@Components/shared/Tooltip";

interface IProps {
    translate: any;
    onClickTransparent: any;
    show: any;
}

const Transparent = (props: IProps) => {
    const { onClickTransparent, translate, show } = props;
    const content =  translate("transparent");
    
    return (
        <Tooltip
            offsetLeft={0}
            offsetTop={-10}
            content={content}
            delay={10}
            style={{ display: show ? "block" : "none" }}
            position="top"
        >
            <button
                style={{
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    width: "30px",
                    padding: 0,
                    height: "100%",
                }}
                className="dropbtn-font dropbtn-font-size toolbar-btn"
                onClick={onClickTransparent}
            >
                <img src={require("@Components/shared/svgs/editor/toolbar/transparent.svg")} alt={content} />
            </button>
        </Tooltip>
    );
}

export default Transparent;