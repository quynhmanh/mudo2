import React from "react";
import Tooltip from "@Components/shared/Tooltip";

interface IProps {
    show: boolean;
    translate: any;
    handleAlignRightBtnClick: any;
}

const AlignRight = (props: IProps) => {
    const { show, handleAlignRightBtnClick, translate } = props;
    return (
        <Tooltip
            offsetLeft={0}
            offsetTop={-5}
            content={translate("alignRight")}
            delay={10}
            style={{ display: show ? "block" : "none" }}
            position="top"
        >
            <a
                href="#"
                className="toolbar-btn"
                onClick={handleAlignRightBtnClick}
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
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                >
                    <defs>
                        <path
                            id="_3487901159__a"
                            d="M3.75 5.25h16.5a.75.75 0 1 1 0 1.5H3.75a.75.75 0 0 1 0-1.5zm0 4h8.5a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5zm0 4h16.5a.75.75 0 1 1 0 1.5H3.75a.75.75 0 1 1 0-1.5zm0 4h8.5a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5z"
                        ></path>
                    </defs>
                    <use
                        fill="currentColor"
                        xlinkHref="#_3487901159__a"
                        fillRule="evenodd"
                    ></use>
                </svg>
            </a>
        </Tooltip>
    );
}

export default AlignRight;