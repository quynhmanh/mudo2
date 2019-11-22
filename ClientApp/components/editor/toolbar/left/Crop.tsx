import React from "react";

interface IProps {
    show: boolean;
    translate: any;
    cropMode: boolean;
    handleCropBtnClick: any;
}

const Crop = (props: IProps) => {
    const { show, cropMode, handleCropBtnClick, translate } = props;
    return (
        <div
            style={{
                position: "relative",
                display: show ? "block" : "none"
            }}
        >
            {!cropMode && (
                <button
                    style={{
                        height: "26px",
                        top: 0
                    }}
                    className="dropbtn-font dropbtn-font-size toolbar-btn"
                    onClick={handleCropBtnClick}
                >
                    <span>{translate("crop")}</span>
                </button>
            )}
        </div>
    );
}

export default Crop;