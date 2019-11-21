import React from "react";

interface IProps {
    show: boolean;
    translate: any;
    handleOkBtnClick: any;
}

const OK = (props: IProps) => {
    const { show, handleOkBtnClick, translate } = props;
    return (
        <button
            className="toolbar-btn dropbtn-font"
            onClick={handleOkBtnClick}
            style={{
                display: show ? "flex" : "none",
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
                    d="M4.53 11.9L9 16.38 19.44 5.97a.75.75 0 0 1 1.06 1.06L9.53 17.97c-.3.29-.77.29-1.06 0l-5-5c-.7-.71.35-1.77 1.06-1.07z"
                ></path>
            </svg>
            <span style={{ marginLeft: "5px" }}>
                {translate("ok")}
            </span>
        </button>
    );
}

export default OK;