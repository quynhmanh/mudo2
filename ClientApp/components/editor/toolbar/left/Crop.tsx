import { handleCropBtnClick } from "@Utils";
import React from "react";

interface IProps {
    show: boolean;
    translate: any;
    cropMode: boolean;
}

const Crop = (props: IProps) => {
    const { show, cropMode, translate } = props;
    const content = translate("crop");
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
                        height: "100%",
                        top: 0,
                        padding: "0 10px",
                    }}
                    className="dropbtn-font dropbtn-font-size toolbar-btn"
                    onClick={handleCropBtnClick}
                >
                    <span
                        style={{
                            lineHeight: "28px",
                        }}
                    >{content}</span>
                </button>
            )}
        </div>
    );
}

export default Crop;