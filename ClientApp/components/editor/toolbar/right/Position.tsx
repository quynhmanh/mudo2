import React from "react";
import Tooltip from "@Components/shared/Tooltip";

interface IProps {
    translate: any;
    onClickpositionList: any;
}


const onClickpositionList = () => {
    document.getElementById("myPositionList").classList.toggle("show");

    const onDown = e => {
        if (!document.getElementById("myPositionList").contains(e.target)) {
            // if (!e.target.matches(".dropbtn-font-size")) {
            let dropdowns = document.getElementsByClassName(
                "dropdown-content-font-size"
            );
            let i;
            for (i = 0; i < dropdowns.length; i++) {
                let openDropdown = dropdowns[i];
                if (openDropdown.classList.contains("show")) {
                    openDropdown.classList.remove("show");
                }
            }

            document.removeEventListener("mouseup", onDown);
        }
    };

    document.addEventListener("mouseup", onDown);
};


const Position = (props: IProps) => {
    const { translate } = props;
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
                    height: "32px",
                    lineHeight: "30px",
                }}
            >
                {translate("position")}
            </button>
        // </Tooltip>
    );
}

export default Position;