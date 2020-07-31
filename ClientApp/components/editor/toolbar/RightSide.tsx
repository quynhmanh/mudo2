import React from "react";
import Position from "@Components/editor/toolbar/right/Position";
import Transparent from "@Components/editor/toolbar/right/Transparent";
import PositionDropdown from "@Components/editor/toolbar/right/PositionDropdown";
import TransparentDropdown from "@Components/editor/toolbar/right/TransparentDropdown";

interface IProps {
    show: boolean;
    translate: any;
    onClickpositionList: any;
    onClickTransparent: any;
    forwardSelectedObject: any;
    backwardSelectedObject: any;
    handleTransparentAdjust: any;
    currentOpacity: number;
}

const RightSide = (props: IProps) => {
    const { show } = props;
    return (
        <div
            style={{
                position: "absolute",
                right: 0,
                display: show ? "flex" : "none"
            }}
        >
            <Position 
                translate={props.translate}
                onClickpositionList={props.onClickpositionList}
            />
            <Transparent
                show={true}
                translate={props.translate}
                onClickTransparent={props.onClickTransparent}
            />
            <PositionDropdown
                translate={props.translate}
                forwardSelectedObject={props.forwardSelectedObject}
                backwardSelectedObject={props.backwardSelectedObject}
            />
            <TransparentDropdown
                translate={props.translate}
                handleTransparentAdjust={props.handleTransparentAdjust}
                currentOpacity={props.currentOpacity}
            />
        </div>
    );
}

export default RightSide;