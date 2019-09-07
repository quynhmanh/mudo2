import React, { PureComponent, FormEvent } from "react";
import Selector from './Selector';
import { SIDE_BAR_ICONS } from "@Components/editor/Sidebar/SidebarIcons";

type EnumType = { [s: number]: string };

function mapEnum (enumerable: EnumType, fn: Function): any[] {
    // get all the members of the enum
    let enumMembers: any[] = Object.keys(enumerable).map(key => enumerable[key]);

    // we are only interested in the numeric identifiers as these represent the values
    let enumValues: number[] = enumMembers.filter(v => typeof v === "number");

    // now map through the enum values
    return enumValues.map((m, i) => fn(i, SidebarName[i], SIDE_BAR_ICONS[i], i > 0 ? enumValues[i - 1] : null, m, i < enumValues.length - 1 ? enumValues[i + 1] : null ));
}

enum SidebarTab {
    Image = 1,
    Text = 2,
    Template = 4,
    Background = 8,
    Element = 16,
    Upload = 32,
    RemovedBackgroundImage = 64,
  }

var SidebarName = [
    "Hình ảnh",
    "Chữ",
    "Mẫu thiết kế",
    "Hình nền",
    "Element",
    "Tải lên",
    "Ảnh xoá nền",
]


  enum Mode {
    CreateDesign = 0,
    CreateTemplate = 1,
    CreateTextTemplate = 2,
    EditTemplate = 3,
    EditTextTemplate = 4,
  }

  var allowedSelector = [
    SidebarTab.Image ^ SidebarTab.Text ^ SidebarTab.Template ^ SidebarTab.Background ^ SidebarTab.Element ^ SidebarTab.Upload ^ SidebarTab.RemovedBackgroundImage,
    SidebarTab.Image ^ SidebarTab.Text ^ SidebarTab.Background ^ SidebarTab.Element ^ SidebarTab.Upload ^ SidebarTab.RemovedBackgroundImage,
    SidebarTab.Image ^ SidebarTab.Text,
    SidebarTab.Image ^ SidebarTab.Text ^ SidebarTab.Background ^ SidebarTab.Element ^ SidebarTab.Upload ^ SidebarTab.RemovedBackgroundImage,
    SidebarTab.Image ^ SidebarTab.Text,
  ];

export interface IProps {
    toolbarSize: number;
    selectedTab: SidebarTab;
    mode: Mode;
    onClick(selectedTab : SidebarTab, e : any): void;
}

export interface IState {
}

export default class TopMenu extends PureComponent<IProps, IState> {

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
          display: "inline-flex",
          width: `80px`,
          zIndex: 1111111111,
          color: "black",
          backgroundColor: 'white',
          overflow: 'scroll',
          flexDirection: 'column',
        }}
      >
        {
            mapEnum(SidebarTab, (i, sidebarName, sideBarIcon, prevTab, currentTab, nextTab) => {
                return <Selector 
                    key={i}
                    content={sidebarName}
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
    );
  }
}
