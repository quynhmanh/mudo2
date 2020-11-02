import React, {Component} from "react";
import Position from "@Components/editor/toolbar/right/Position";
import Transparent from "@Components/editor/toolbar/right/Transparent";
import PositionDropdown from "@Components/editor/toolbar/right/PositionDropdown";
import TransparentDropdown from "@Components/editor/toolbar/right/TransparentDropdown";
import { observer } from "mobx-react";
import editorStore from "@Store/EditorStore";
import { TemplateType } from "../enums";
import { toJS } from "mobx";

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
                    <span>Group</span>
            </button>}
            {image && image.type == TemplateType.GroupedItem && !image.temporary && <button
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
                    <span>Ungroup</span>
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
            </div>
        );
    }
}
export default RightSide;