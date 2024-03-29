import React from "react";

interface IProps {
    show: boolean;
    translate: any;
    cropMode: boolean;
    handleAdjustBtnClick: any;
}

const Adjust = (props: IProps) => {
    const { show, cropMode, handleAdjustBtnClick, translate } = props;
    return (
        <div
            style={{
                position: "relative",
                display: show ? "block" : "none",
            }}
        >
            {!cropMode && (
                <button
                    style={{
                        height: "26px",
                        top: 0
                    }}
                    className="dropbtn-font dropbtn-font-size toolbar-btn"
                    onClick={handleAdjustBtnClick}
                >
                    <span>{translate("adjust")}</span>
                </button>
            )}
        </div>
    );
}

export default Adjust;