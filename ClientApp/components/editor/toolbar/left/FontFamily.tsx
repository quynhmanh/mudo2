import React from "react";
import Tooltip from "@Components/shared/Tooltip";
import { SidebarTab } from "@Components/editor/enums";

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
            offsetTop={-10}
            content={content}
            delay={10}
            style={{ display: show ? "block" : "none" }}
            position="top"
        >
            <div
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
                    width: "177px",
                    border: '1px solid rgba(57,76,96,.15)',
                }}
            >
                <span
                    style={{
                        lineHeight: '30px',
                        textOverflow: 'ellipsis',
                        width: '150px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        fontSize: "15px",
                        fontWeight: 400,
                    }}
                >{fontName}</span>
                <img
                    src={require("@Components/shared/svgs/editor/toolbar/fontFamily.svg")}
                    alt={content}
                    style={{
                        pointerEvents: "none",
                        margin: "auto",
                    }} />
            </div>
        </Tooltip>
    );
}

export default FontFamily;