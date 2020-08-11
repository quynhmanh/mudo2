import React from "react";

interface IProps {
    show: boolean;
    translate: any;
    handleOkBtnClick: any;
}

const OK = (props: IProps) => {
    const { show, handleOkBtnClick, translate } = props;
    const content = translate("ok");
    return (
        <button
            className="toolbar-btn dropbtn-font"
            onClick={handleOkBtnClick}
            style={{
                display: show ? "flex" : "none",
                fontFamily: "AvenirNextRoundedPro",
            }}
        >
            <img
                style={{
                    height: "100%",
                }} 
                src={require("@Components/shared/svgs/editor/toolbar/ok.svg")} 
                alt={content} />
            <span 
                style={{ 
                    marginLeft: "5px",
                    lineHeight: "30px",
                }}>
                {content}
            </span>
        </button>
    );
}

export default OK;