import React from "react";
import Tooltip from "@Components/shared/Tooltip";
import {SidebarTab} from "@Components/editor/enums";

interface IProps {
    translate: any;
    show: boolean;
    onClickDropDownFontList: any;
    fontName: string;
    selectedTab: any;
}

const FontFamily = (props: IProps) => {
    const { show, fontName, onClickDropDownFontList, translate } = props;
    const content = translate("fontFamily");
    return (
        <Tooltip
            offsetLeft={0}
            offsetTop={-5}
            content={content}
            delay={10}
            style={{ display: show ? "block" : "none" }}
            position="top"
        >
            <a
                href="#"
                className="toolbar-btn"
                onClick={onClickDropDownFontList}
                style={{
                    borderRadius: "4px",
                    padding: "0 10px",
                    display: "flex",
                    cursor: "pointer",
                    color: "black",
                    position: "relative",
                    backgroundColor: props.selectedTab === SidebarTab.Font ? "#f2f5f7 " : "white",
                    height: "100%",
                    width: "216px",
                }}
            >
                <img
                    style={{ 
                        height: "18px", 
                        margin: "auto",
                    }}
                    src={fontName ? fontName : "images/font-AvenirNextRoundedPro.png"}
                />
                <img 
                    src={require("@Components/shared/svgs/editor/toolbar/fontFamily.svg")} 
                    alt={content} 
                    style={{ 
                        pointerEvents: "none", 
                        margin: "auto",
                    }}/>
            </a>
        </Tooltip>
    );
}

export default FontFamily;