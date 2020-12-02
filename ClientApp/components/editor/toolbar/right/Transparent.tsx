import React from "react";
import Tooltip from "@Components/shared/Tooltip";
import ToolbarBtn from "../ToolbarBtn";
import { onClickTransparent } from "@Utils";

interface IProps {
    translate: any;
    onClickTransparent: any;
    show: any;
}

const Transparent = (props: IProps) => {
    const { translate, show } = props;
    const content =  translate("transparent");
    
    return (
        <ToolbarBtn
            show={show}>
        <Tooltip
            offsetLeft={0}
            offsetTop={-10}
            content={content}
            style={{ display: show ? "block" : "none" }}
            position="top"
        >
            <button
                style={{
                    width: "32px",
                    padding: 0,
                    height: "32px",
                }}
                className="dropbtn-font-size toolbar-btn"
                onClick={onClickTransparent}
            >
                <img src={require("@Components/shared/svgs/editor/toolbar/transparent.svg")} alt={content} />
            </button>
        </Tooltip>
        </ToolbarBtn>
    );
}

export default Transparent;