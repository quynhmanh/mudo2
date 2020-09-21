import React from "react";

interface IProps {
    show: boolean;
    imgBackgroundColor: string;
    handleImageBackgroundColorBtnClick: any;
}

const ImageBackgroundColor = (props: IProps) => {
    const { show, imgBackgroundColor, handleImageBackgroundColorBtnClick } = props;
    return (
        <div
            style={{
                position: "relative",
                display: show ? "block" : "none"
            }}
        >
            <button
                style={{
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    height: "26px",
                    top: 0,
                    width: "27px",
                    backgroundColor: imgBackgroundColor
                }}
                className="dropbtn-font dropbtn-font-size toolbar-btn"
                onClick={handleImageBackgroundColorBtnClick}
            >
                <div
                    style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "2px",
                        backgroundColor: 'black',
                        boxShadow: "rgba(75, 102, 129, 0.15) 0px 0px 0px 1px inset",
                    }}></div>

            </button>
        </div>
    );
}

export default ImageBackgroundColor;