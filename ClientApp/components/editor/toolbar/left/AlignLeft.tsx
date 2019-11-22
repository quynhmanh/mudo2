import React from "react";
import Tooltip from "@Components/shared/Tooltip";

interface IProps {
    show: boolean;
    translate: any;
    handleAlignLeftBtnClick: any;
}

const AlignLeft = (props: IProps) => {
    const { show, handleAlignLeftBtnClick, translate } = props;
    return (
        <Tooltip
            offsetLeft={0}
            offsetTop={-5}
            content={translate("alignLeft")}
            delay={10}
            style={{ display: show ? "block" : "none" }}
            position="top"
        >
            <a
                href="#"
                className="toolbar-btn"
                onClick={handleAlignLeftBtnClick}
                style={{
                    borderRadius: "4px",
                    padding: "2px 3px 0px",
                    marginRight: "6px",
                    display: "inline-block",
                    cursor: "pointer",
                    color: "black"
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
                        fillRule="evenodd"
                        d="M20.25 5.25a.75.75 0 1 1 0 1.5H3.75a.75.75 0 0 1 0-1.5h16.5zm0 4a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5h8.5zm0 4a.75.75 0 1 1 0 1.5H3.75a.75.75 0 1 1 0-1.5h16.5zm0 4a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5h8.5z"
                    ></path>
                </svg>
            </a>
        </Tooltip>
    );
}

export default AlignLeft;