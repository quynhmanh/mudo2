import React, { Component } from "react";
import Selector from './Selector';
import SIDE_BAR_ICONS from "@Components/editor/Sidebar/SidebarIcons";

import { SidebarTab } from "../enums";

type EnumType = { [s: number]: string };

function mapEnum(enumerable: EnumType, fn: Function): any[] {
    // get all the members of the enum
    let enumMembers: any[] = Object.keys(enumerable).map(key => enumerable[key]);

    // we are only interested in the numeric identifiers as these represent the values
    let enumValues: number[] = enumMembers.filter(v => typeof v === "number");

    // now map through the enum values
    return enumValues.map((m, i) => fn(i, SidebarName[i], SIDE_BAR_ICONS[i], i > 0 ? enumValues[i - 1] : null, m, i < enumValues.length - 1 ? enumValues[i + 1] : null));
}


var SidebarName = [
    "image",
    "text",
    "template",
    "background",
    "element",
    "upload",
    // "Ảnh xoá nền",
    "video",
]


enum Mode {
    CreateDesign = 0,
    CreateTemplate = 1,
    CreateTextTemplate = 2,
    EditTemplate = 3,
    EditTextTemplate = 4,
}

var allowedSelector = [
    SidebarTab.Image ^ SidebarTab.Text ^ SidebarTab.Template ^ SidebarTab.Background ^ SidebarTab.Element ^ SidebarTab.Upload ^ SidebarTab.Video,
    SidebarTab.Image ^ SidebarTab.Text ^ SidebarTab.Background ^ SidebarTab.Element ^ SidebarTab.Upload ^ SidebarTab.Video,
    SidebarTab.Image ^ SidebarTab.Text,
    SidebarTab.Image ^ SidebarTab.Text ^ SidebarTab.Background ^ SidebarTab.Element ^ SidebarTab.Upload ^ SidebarTab.Video,
    SidebarTab.Image ^ SidebarTab.Text,
    SidebarTab.Image ^ SidebarTab.Text ^ SidebarTab.Template ^ SidebarTab.Background ^ SidebarTab.Element ^ SidebarTab.Upload ^ SidebarTab.Video,
];

export interface IProps {
    toolbarSize: number;
    selectedTab: SidebarTab;
    mode: Mode;
    onClick(selectedTab: SidebarTab, e: any): void;
    mounted: boolean;
    translate: any;
    tReady: boolean;
}

export interface IState {
}

// @observable
export default class TopMenu extends Component<IProps, IState> {

    render() {
        const {
            toolbarSize,
            selectedTab,
            mode,
            onClick,
        } = this.props;

        return (
            <div
                style={{
                    height: "100%",
                    backgroundColor: "#0e1318",
                }}
            >   
                {selectedTab != SidebarTab.Font && 
                selectedTab != SidebarTab.Color &&
                selectedTab != SidebarTab.Effect &&
                <div
                    className="a12345123"
                    style={{
                        position: "absolute",
                        transform: `translate3d(0px, ${(Math.log2(selectedTab)) * 80}px, 0px)`,
                        transition: 'transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out',
                        width: "80px",
                        height: "80px",
                    }}
                >
                </div>}
                <div>
                    {
                        mapEnum(SidebarTab, (i, sidebarName, sideBarIcon, prevTab, currentTab, nextTab) => {
                            if (i > 6) return null;
                            return <Selector
                                key={i}
                                content={this.props.translate(sidebarName)}
                                // content={sidebarName}
                                sideBarIcon={sideBarIcon}
                                prevSelected={selectedTab === prevTab}
                                selected={selectedTab === currentTab}
                                disabled={(allowedSelector[mode] & currentTab) === 0}
                                nextSelected={selectedTab === nextTab}
                                onClick={(e) => {
                                    onClick(currentTab, e);
                                }}
                            />
                        })
                    }
                </div>
            </div>
        );
    }
}
