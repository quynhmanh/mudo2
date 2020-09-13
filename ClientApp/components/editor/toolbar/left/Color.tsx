import React from "react";
import Tooltip from "@Components/shared/Tooltip";
import {SidebarTab} from "@Components/editor/enums";

interface IProps {
    translate: any;
    show: boolean;
    handleColorBtnClick: any;
    fontColor: string;
    selectedTab: any;
    isText: boolean;
}

const Color = (props: IProps) => {
    const { show, fontColor, handleColorBtnClick, translate, isText, } = props;
    const content = translate("color");
    return (
        <Tooltip
            offsetLeft={0}
            offsetTop={-10}
            content={content}
            delay={10}
            style={{ display: show ? "block" : "none" }}
            position="top"
        >
            <a
                href="#"
                style={{
                    position: "relative",
                    borderRadius: "4px",
                    padding: "3px",
                    paddingBottom: "0px",
                    display: "inline-block",
                    cursor: "pointer",
                    color: "black",
                    height: "100%",
                    backgroundColor: props.selectedTab === SidebarTab.Color ? "#f2f5f7 " : "white",
                }}
                onClick={handleColorBtnClick}
                className="toolbar-btn"
            >
                {isText && 
                <img
                    style={{
                        width: "25px",
                    }} 
                    src={require("@Components/shared/svgs/editor/toolbar/colorPicker.svg")} alt={content}/>}
                {!isText && (fontColor ? <div
                    style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "2px",
                        backgroundColor: fontColor,
                        boxShadow: "rgba(75, 102, 129, 0.15) 0px 0px 0px 1px inset",
                    }}></div> :
                <img 
                    style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "2px",
                    }}
                    src="web_images/test.png"
                    />)
                }
                {isText && 
                <div
                    style={{
                        position: "absolute",
                        bottom: "3px",
                        left: "5px",
                        borderRadius: "14px",
                        width: "72%",
                        height: "4px",
                        backgroundColor: fontColor,
                        boxShadow: "inset 0 0 0 1px rgba(14,19,24,.15)"
                    }}
                    className={
                        fontColor === "black"
                            ? "font-color-btn"
                            : ""
                    }
                ></div>}
            </a>
        </Tooltip>
    );
}

export default Color;