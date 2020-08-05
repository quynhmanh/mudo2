import React from "react";

interface IProps {
    show: boolean;
    translate: any;
    cropMode: boolean;
    handleCropBtnClick: any;
}

const Crop = (props: IProps) => {
    const { show, cropMode, handleCropBtnClick, translate } = props;
    const content = translate("crop");
    return (
        <div
            style={{
                position: "relative",
                display: show ? "block" : "none",
                fontFamily: "AvenirNextRoundedPro-Medium",
            }}
        >
            {!cropMode && (
                <button
                    style={{
                        height: "100%",
                        top: 0
                    }}
                    className="dropbtn-font dropbtn-font-size toolbar-btn"
                    onClick={handleCropBtnClick}
                >
                    <span>{content}</span>
                </button>
            )}
        </div>
    );
}

export default Crop;