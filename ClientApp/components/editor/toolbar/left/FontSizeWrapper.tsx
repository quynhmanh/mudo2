import React from "react";
import Tooltip from "@Components/shared/Tooltip";
import { TemplateType } from "@Components/editor/enums";
import FontSize from "@Components/editor/FontSize";

interface IProps {
    show: boolean;
    translate: any;
    selectedImage: any;
    childId: string;
    fontSize: number;
    handleFontSizeBtnClick: any;
}

const FontSizeWrapper = (props: IProps) => {
    const { show, childId, selectedImage, handleFontSizeBtnClick, translate, fontSize } = props;
    const content = translate("fontSize");
    return (
        <Tooltip
            offsetLeft={0}
            offsetTop={-5}
            content={content}
            delay={10}
            style={{ display: show ? "block" : "none" }}
            position="top"
        >
            <div
                style={{
                    position: "relative",
                    display:
                        childId ||
                            (
                                selectedImage &&
                                selectedImage.type === TemplateType.Heading
                            )
                            ? "block"
                            : "none"
                }}
                className="toolbar-btn"
            >
                <FontSize fontSize={fontSize} content={content} handleFontSizeBtnClick={props.handleFontSizeBtnClick}/>
                <div
                    style={{
                        left: "0px",
                        top: "4px",
                        padding: "0",
                        background: "white",
                        animation: "bounce 1.2s ease-out"
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
                        <li>
                            <button
                                onClick={(e) => { handleFontSizeBtnClick(e, 6) }}
                                className="fontsize-picker"
                                style={{
                                    height: "30px",
                                    width: "100%",
                                    border: "none"
                                }}
                            >
                                6
                  </button>
                        </li>
                        <li>
                            <button
                                className="fontsize-picker"
                                onClick={(e) => { handleFontSizeBtnClick(e, 8) }}
                                style={{
                                    height: "30px",
                                    width: "100%",
                                    border: "none"
                                }}
                            >
                                8
                  </button>
                        </li>
                        <li>
                            <button
                                className="fontsize-picker"
                                onClick={(e) => { handleFontSizeBtnClick(e, 42) }}
                                style={{
                                    height: "30px",
                                    width: "100%",
                                    border: "none"
                                }}
                            >
                                42
                  </button>
                        </li>
                        <li>
                            <button
                                className="fontsize-picker"
                                onClick={(e) => { handleFontSizeBtnClick(e, 100) }}
                                style={{
                                    height: "30px",
                                    width: "100%",
                                    border: "none"
                                }}
                            >
                                100
                  </button>
                        </li>
                    </ul>
                </div>
            </div>
        </Tooltip>
    );
}

export default FontSizeWrapper;