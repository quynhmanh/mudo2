import React from "react";
import Tooltip from "@Components/shared/Tooltip";

interface IProps {
    translate: any;
    onClickTransparent: any;
    show: any;
}


const onClickTransparent = () => {

    document.getElementById("myTransparent").classList.toggle("show");

    const onDown = e => {
        if (!document.getElementById("myTransparent").contains(e.target)) {
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

const Transparent = (props: IProps) => {
    const { translate, show } = props;
    const content =  translate("transparent");
    
    return (
        <Tooltip
            offsetLeft={0}
            offsetTop={-10}
            content={content}
            delay={10}
            style={{ display: show ? "block" : "none" }}
            position="top"
        >
            <button
                style={{
                    width: "30px",
                    padding: 0,
                    height: "32px",
                }}
                className="dropbtn-font dropbtn-font-size toolbar-btn"
                onClick={onClickTransparent}
            >
                <img src={require("@Components/shared/svgs/editor/toolbar/transparent.svg")} alt={content} />
            </button>
        </Tooltip>
    );
}

export default Transparent;