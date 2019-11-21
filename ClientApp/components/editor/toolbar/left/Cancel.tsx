import React from "react";

interface IProps {
    show: boolean;
    translate: any;
    handleCancelBtnClick: any;
}

const Cancel = (props: IProps) => {
    const { show, handleCancelBtnClick, translate } = props;
    return (
        <button
            className="toolbar-btn dropbtn-font"
            onClick={handleCancelBtnClick}
            style={{
                display: show ? "flex" : "none"
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
            >
                <path
                    fill="currentColor"
                    d="M13.06 12.15l5.02-5.03a.75.75 0 1 0-1.06-1.06L12 11.1 6.62 5.7a.75.75 0 1 0-1.06 1.06l5.38 5.38-5.23 5.23a.75.75 0 1 0 1.06 1.06L12 13.2l4.88 4.87a.75.75 0 1 0 1.06-1.06l-4.88-4.87z"
                ></path>
            </svg>
            <span style={{ marginLeft: "5px" }}>
                {translate("cancel")}
            </span>
        </button>
    );
}

export default Cancel;