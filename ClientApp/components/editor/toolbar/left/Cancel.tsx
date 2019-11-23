import React from "react";

interface IProps {
    show: boolean;
    translate: any;
    handleCancelBtnClick: any;
}

const Cancel = (props: IProps) => {
    const { show, handleCancelBtnClick, translate } = props;
    const content = translate("cancel");
    return (
        <button
            className="toolbar-btn dropbtn-font"
            onClick={handleCancelBtnClick}
            style={{
                display: show ? "flex" : "none"
            }}
        >
            <img src={require("@Components/shared/svgs/editor/toolbar/cancel.svg")} alt={content}/>
            <span style={{ marginLeft: "5px" }}>
                {content}
            </span>
        </button>
    );
}

export default Cancel;