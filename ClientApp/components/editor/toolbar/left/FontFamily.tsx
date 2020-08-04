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
                    padding: "3px",
                    paddingBottom: "0px",
                    display: "inline-block",
                    cursor: "pointer",
                    color: "black",
                    position: "relative",
                    width: "216px",
                    backgroundColor: props.selectedTab === SidebarTab.Font ? "rgba(14, 19, 24, 0.15) " : "white",
                }}
            >
                <img
                    style={{ height: "21px", filter: "invert(1)" }}
                    src={fontName}
                />
                <img src={require("@Components/shared/svgs/editor/toolbar/fontFamily.svg")} alt={content} style={{ pointerEvents: "none", position: "absolute", right: "10px", top: "4px" }}/>
            </a>
        </Tooltip>
    );
}

export default FontFamily;