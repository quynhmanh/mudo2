import React, { Component } from "react";
import Position from "@Components/editor/toolbar/right/Position";
import Transparent from "@Components/editor/toolbar/right/Transparent";
import PositionDropdown from "@Components/editor/toolbar/right/PositionDropdown";
import TransparentDropdown from "@Components/editor/toolbar/right/TransparentDropdown";
import { observer } from "mobx-react";
import editorStore from "@Store/EditorStore";
import { TemplateType } from "../enums";
import { toJS } from "mobx";
import Tooltip from "@Components/shared/Tooltip";

interface IProps {
    show: boolean;
    translate: any;
    onClickpositionList: any;
    onClickTransparent: any;
    forwardSelectedObject: any;
    backwardSelectedObject: any;
    handleTransparentAdjust: any;
    currentOpacity: number;
    handleOpacityChange: any;
    handleOpacityChangeEnd: any;
    cropMode: any;
    groupGroupedItem: any;
    ungroupGroupedItem: any;
    removeImage: any;
    copyImage: any;
}

interface IState {

}

@observer
class RightSide extends Component<IProps, IState> {
    render() {
        let image = toJS(editorStore.images2.get(editorStore.idObjectSelected));
        const props = this.props;
        return (
            <div
                style={{
                    position: "absolute",
                    right: 0,
                    display: props.show ? "flex" : "none",
                    height: "30px",
                }}
            >
                {image && image.type == TemplateType.GroupedItem && image.temporary && <button
                    className="toolbar-btn"
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}
                    onClick={e => {
                        e.preventDefault();
                        this.props.groupGroupedItem();
                    }}
                >
                    <span>{this.props.translate("group")}</span>
                </button>}
                {image && image.type == TemplateType.TextTemplate && <button
                    className="toolbar-btn"
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}
                    onClick={e => {
                        e.preventDefault();
                        this.props.ungroupGroupedItem();
                    }}
                >
                    <span>{this.props.translate("ungroup")}</span>
                </button>}
                {!editorStore.cropMode && ((editorStore.idObjectSelected && image && image.type != TemplateType.GroupedItem)
                    || editorStore.childId) &&
                    <Position
                        translate={props.translate}
                        onClickpositionList={props.onClickpositionList}
                    />}
                {!editorStore.cropMode && ((editorStore.idObjectSelected && image && image.type != TemplateType.GroupedItem)
                    || editorStore.childId) &&
                    <Transparent
                        show={true}
                        translate={props.translate}
                        onClickTransparent={props.onClickTransparent}
                    />
                }
                <PositionDropdown
                    translate={props.translate}
                    forwardSelectedObject={props.forwardSelectedObject}
                    backwardSelectedObject={props.backwardSelectedObject}
                />
                <TransparentDropdown
                    currentOpacity={editorStore.currentOpacity}
                    translate={props.translate}
                    title={props.translate("transparent")}
                    handleTransparentAdjust={props.handleTransparentAdjust}
                    handleOpacityChange={props.handleOpacityChange}
                    handleOpacityChangeEnd={props.handleOpacityChangeEnd}
                />
                {image && image.type != TemplateType.GroupedItem && 
                <Tooltip
                    offsetLeft={0}
                    offsetTop={-10}
                    content={this.props.translate("copy")}
                    delay={10}
                    position="top"
                >
                <button
                    className="toolbar-btn"
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}
                    onClick={e => {
                        e.preventDefault();
                        this.props.copyImage();
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 3h8a2 2 0 0 1 2 2v.5h-1.5V5a.5.5 0 0 0-.5-.5H5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h2.5V17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm6 5.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V9a.5.5 0 0 0-.5-.5h-8zM19 7h-8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M15 11a.75.75 0 0 0-.75.75v1.5h-1.5a.75.75 0 0 0 0 1.5h1.5v1.5a.75.75 0 0 0 1.5 0v-1.5h1.5a.75.75 0 0 0 0-1.5h-1.5v-1.5A.75.75 0 0 0 15 11z" fill="currentColor"></path></svg>
                </button></Tooltip>}
                {image && 
                <Tooltip
                    offsetLeft={0}
                    offsetTop={-10}
                    content={this.props.translate("remove")}
                    delay={10}
                    position="top"
                >
                <button
                    className="toolbar-btn"
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}
                    onClick={e => {
                        e.preventDefault();
                        this.props.removeImage();
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3h4.25a.75.75 0 1 1 0 1.5H19V18a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V6.5H3.75a.75.75 0 0 1 0-1.5H8zM6.5 6.5V18c0 .83.67 1.5 1.5 1.5h8c.83 0 1.5-.67 1.5-1.5V6.5h-11zm3-1.5h5c0-.83-.67-1.5-1.5-1.5h-2c-.83 0-1.5.67-1.5 1.5zm-.25 4h1.5v8h-1.5V9zm4 0h1.5v8h-1.5V9z"></path></svg>
                </button></Tooltip>}
            </div>
        );
    }
}
export default RightSide;