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
    handleFontSizeBtnClick: any;
    selectedTab: any;
}

const fontSizes = [
    6, 8, 10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 48, 56, 64, 72, 80, 88,
    96, 104, 120, 144,
];

const FontSizeWrapper = (props: IProps) => {
    const { show, childId, selectedImage, handleFontSizeBtnClick, translate, fontSize } = props;

    const content = translate("fontSize");
    return (
        <Tooltip
            offsetLeft={0}
            offsetTop={-5}
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
                    // display:
                    //     childId ||
                    //         (
                    //             selectedImage &&
                    //             selectedImage.type === TemplateType.Heading
                    //         )
                    //         ? "block"
                    //         : "none",
                    width: "80px",
                }}
                className="toolbar-btn"
            >
                <FontSize fontSize={fontSize} content={content} handleFontSizeBtnClick={props.handleFontSizeBtnClick}/>
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