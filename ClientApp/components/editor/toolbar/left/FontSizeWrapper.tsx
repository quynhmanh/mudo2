import React from "react";
import Tooltip from "@Components/shared/Tooltip";
import { TemplateType } from "@Components/editor/enums";
import FontSize from "@Components/editor/FontSize";
import {SidebarTab} from "@Components/editor/enums";

interface IProps {
    show: boolean;
    translate: any;
    selectedImage: any;
    childId: string;
    fontSize: number;
    selectedTab: any;
}

const fontSizes = [
    6, 8, 10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 48, 56, 64, 72, 80, 88,
    96, 104, 120, 144,
];

const FontSizeWrapper = (props: IProps) => {
    const { show, childId, selectedImage, translate, fontSize } = props;

    const content = translate("fontSize");
    return (
        <Tooltip
            offsetLeft={0}
            offsetTop={-10}
            content={content}
            delay={10}
            style={{ 
                display: show ? "block" : "none",
            }}
            position="top"
        >
            <div
                style={{
                    position: "relative",
                    width: "70px",
                    border: '1px solid rgba(57,76,96,.15)',
                }}
                className="toolbar-btn"
            >
                <FontSize 
                    fontSize={fontSize} 
                    content={content} 
                />
                <div
                    style={{
                        left: "0px",
                        top: "9px",
                        padding: "0",
                        background: "white",
                        animation: "bounce 0.8s ease-out"
                    }}
                    id="myFontSizeList"
                    className="dropdown-content-font-size"
                >
                    <ul
                        style={{
                            listStyle: "none",
                            margin: 0,
                            width: "100%",
                            padding: 0
                        }}
                    >
                        {fontSizes.map((size, index) => 
                        <li
                            key={index}
                        >
                            <button
                                onClick={(e) => { handleFontSizeBtnClick(e, size) }}
                                className="fontsize-picker"
                                style={{
                                    height: "36px",
                                    width: "100%",
                                    border: "none",
                                    textAlign: "left",
                                    padding: "0 18px",
                                }}
                            >
                                {size}
                  </button>
                        </li>)}
                    </ul>
                </div>
            </div>
        </Tooltip>
    );
}

export default FontSizeWrapper;