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
import {
    ungroupGroupedItem,
    groupGroupedItem,
    copyImage,
    getImageSelected,
    updateImages,
} from "@Utils";

interface IProps {
    show: boolean;
    translate: any;
    onClickpositionList: any;
    onClickTransparent: any;
    backwardSelectedObject: any;
    currentOpacity: number;
    cropMode: any;
    groupGroupedItem: any;
    ungroupGroupedItem: any;
    removeImage: any;
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
                        groupGroupedItem();
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
                        ungroupGroupedItem();
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
                    backwardSelectedObject={props.backwardSelectedObject}
                />
                <TransparentDropdown
                    currentOpacity={editorStore.currentOpacity}
                    translate={props.translate}
                    title={props.translate("transparent")}
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
                        copyImage();
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 3h8a2 2 0 0 1 2 2v.5h-1.5V5a.5.5 0 0 0-.5-.5H5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h2.5V17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm6 5.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V9a.5.5 0 0 0-.5-.5h-8zM19 7h-8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M15 11a.75.75 0 0 0-.75.75v1.5h-1.5a.75.75 0 0 0 0 1.5h1.5v1.5a.75.75 0 0 0 1.5 0v-1.5h1.5a.75.75 0 0 0 0-1.5h-1.5v-1.5A.75.75 0 0 0 15 11z" fill="currentColor"></path></svg>
                </button></Tooltip>}
                {image && !image.locked && 
                <Tooltip
                    offsetLeft={0}
                    offsetTop={-10}
                    content={this.props.translate("lock")}
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
                        let image = getImageSelected();
                        image.locked = true;
                        updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
                        editorStore.images2.set(editorStore.idObjectSelected, image);
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12.75 14.33v3.03a.75.75 0 0 1-1.5 0v-3.03c-.6-.3-1.03-.94-1.03-1.69 0-1.02.8-1.85 1.78-1.85s1.78.83 1.78 1.85c0 .75-.42 1.4-1.03 1.69zM16.5 8V6a4.5 4.5 0 0 0-8.77-1.41.75.75 0 1 1-1.43-.47A6 6 0 0 1 18 6v2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h10.5zM6 9.5a.5.5 0 0 0-.5.5v9c0 .28.22.5.5.5h12a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H6z"></path></svg>
                </button></Tooltip>}
                {image && image.locked && 
                <Tooltip
                    offsetLeft={0}
                    offsetTop={-10}
                    content={this.props.translate("unlock")}
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
                        let image = getImageSelected();
                        image.locked = false;
                        updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
                        editorStore.images2.set(editorStore.idObjectSelected, image);
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12.75 14.33v3.03a.75.75 0 0 1-1.5 0v-3.03c-.6-.3-1.03-.94-1.03-1.69 0-1.02.8-1.85 1.78-1.85s1.78.83 1.78 1.85c0 .75-.42 1.4-1.03 1.69zM6 8h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2zm0 1.5a.5.5 0 0 0-.5.5v9c0 .28.22.5.5.5h12a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H6zM7.5 8H6a6 6 0 1 1 12 0h-1.5a4.5 4.5 0 1 0-9 0z"></path></svg>
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