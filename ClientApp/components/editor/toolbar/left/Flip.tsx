import React from "react";

interface IProps {
    show: boolean;
    translate: any;
    cropMode: boolean;
    handleFlipBtnClick: any;
}

const Flip = (props: IProps) => {
    const { show, cropMode, handleFlipBtnClick, translate } = props;
    const content = translate("flip");
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
                    onClick={handleFlipBtnClick}
                >
                    <span>{content}</span>
                </button>
            )}
        </div>
    );
}

export default Flip;