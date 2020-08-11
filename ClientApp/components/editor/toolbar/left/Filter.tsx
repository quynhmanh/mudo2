import React from "react";

interface IProps {
    show: boolean;
    translate: any;
    cropMode: boolean;
    handleFilterBtnClick: any;
}

const Filter = (props: IProps) => {
    const { show, cropMode, handleFilterBtnClick, translate } = props;
    const content = translate("filter");
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
                    onClick={handleFilterBtnClick}
                >
                    <span>{content}</span>
                </button>
            )}
        </div>
    );
}

export default Filter;