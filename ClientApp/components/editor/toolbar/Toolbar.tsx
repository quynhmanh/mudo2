import React from "react";
import LeftSide from "@Components/editor/toolbar/LeftSide";
import RightSide from "@Components/editor/toolbar/RightSide";

interface IProps {
    translate: any;
    editorStore: any;
    childId: string;
    fontColor: string;
    handleColorBtnClick: any;
    handleItalicBtnClick: any;
    handleBoldBtnClick: any;
    onClickDropDownFontList: any;
    fontName: string;
    cropMode: boolean;
    handleFilterBtnClick: any;
    handleAdjustBtnClick: any;
    handleCropBtnClick: any;
    handleFlipBtnClick: any;
    imgBackgroundColor: string;
    handleImageBackgroundColorBtnClick: any;
    selectedImage: any;
    fontSize: number;
    handleFontSizeBtnClick: any;
    handleAlignBtnClick: any;
    handleOkBtnClick: any;
    handleCancelBtnClick: any;
    idObjectSelected: string;
    onClickpositionList: any;
    onClickTransparent: any;
    forwardSelectedObject: any;
    backwardSelectedObject: any;
    handleTransparentAdjust: any;
    currentOpacity: number;
}

const Toolbar = (props: IProps) => {
    return (
        <div
            style=
            {{
                width: "100%",
                backgroundColor: "#dae0e7",
                // boxShadow: "0 1px 0 rgba(14,19,24,.15)",
                display: "inline-flex",
                position: "absolute",
                right: 0,
                left: "0px",
                height: "46px",
                padding: "10px",
                marginBottom: "10px",
                zIndex: 2,
                background: '#fff',
                boxShadow: '0 1px 0 rgba(14,19,24,.15)',
                // padding: '8px',
            }}
        >
            <LeftSide
                editorStore={props.editorStore}
                childId={props.childId}
                translate={props.translate}
                handleColorBtnClick={props.handleColorBtnClick}
                fontColor={props.fontColor}
                handleItalicBtnClick={props.handleItalicBtnClick}
                handleBoldBtnClick={props.handleBoldBtnClick}
                onClickDropDownFontList={props.onClickDropDownFontList}
                fontName={props.fontName}
                cropMode={props.cropMode}
                handleFilterBtnClick={props.handleFilterBtnClick}
                handleAdjustBtnClick={props.handleAdjustBtnClick}
                handleCropBtnClick={props.handleCropBtnClick}
                handleFlipBtnClick={props.handleFlipBtnClick}
                imgBackgroundColor={props.imgBackgroundColor}
                handleImageBackgroundColorBtnClick={props.handleImageBackgroundColorBtnClick}
                selectedImage={props.selectedImage}
                fontSize={props.fontSize}
                handleFontSizeBtnClick={props.handleFontSizeBtnClick}
                idObjectSelected={props.idObjectSelected}
                handleAlignBtnClick={props.handleAlignBtnClick}
                handleOkBtnClick={props.handleOkBtnClick}
                handleCancelBtnClick={props.handleCancelBtnClick}
            />
            <RightSide
                show=
                {
                    props.idObjectSelected !== null
                }
                translate={props.translate}
                onClickpositionList={props.onClickpositionList}
                onClickTransparent={props.onClickTransparent}
                forwardSelectedObject={props.forwardSelectedObject}
                backwardSelectedObject={props.backwardSelectedObject}
                handleTransparentAdjust={props.handleTransparentAdjust}
                currentOpacity={props.currentOpacity}
            />
        </div>
    );
}

export default Toolbar;