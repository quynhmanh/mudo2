import React from "react";
import Tooltip from "@Components/shared/Tooltip";

interface IProps {
    translate: any;
    onClickpositionList: any;
}

const Position = (props: IProps) => {
    const { onClickpositionList, translate } = props;
    return (
        // <Tooltip
        //     offsetLeft={0}
        //     offsetTop={5}
        //     content={translate("position")}
        //     delay={10}
        //     style={{}}
        //     position="bottom"
        // >
            <button
                className="toolbar-btn dropbtn-font"
                onClick={onClickpositionList}
                style={{
                    display: "flex",
                    fontSize: "15px",
                    fontFamily: "AvenirNextRoundedPro-Medium",
                    height: "100%",
                    lineHeight: "30px",
                }}
            >
                {translate("position")}
            </button>
        // </Tooltip>
    );
}

export default Position;