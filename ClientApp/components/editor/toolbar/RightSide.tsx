import React, {Component} from "react";
import Position from "@Components/editor/toolbar/right/Position";
import Transparent from "@Components/editor/toolbar/right/Transparent";
import PositionDropdown from "@Components/editor/toolbar/right/PositionDropdown";
import TransparentDropdown from "@Components/editor/toolbar/right/TransparentDropdown";
import { observer } from "mobx-react";
import editorStore from "@Store/EditorStore";

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
}

interface IState {
    
}

@observer
class RightSide extends Component<IProps, IState> {
    render() {
        console.log('render')
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
            {!editorStore.cropMode && (editorStore.idObjectSelected || editorStore.childId) &&
                <Position 
                    translate={props.translate}
                    onClickpositionList={props.onClickpositionList}
                />}
            {!editorStore.cropMode && (editorStore.idObjectSelected || editorStore.childId) && 
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