import React from "react";
import Tooltip from "@Components/shared/Tooltip";
import Slider from "@Components/editor/Slider";

interface IProps {
    show: boolean;
    translate: any;
    handleAlignBtnClick: any;
    title: string;
    iconPath: string;
    checked: boolean;
    currentLineHeight: number;
    currentLetterSpacing: number;
    handleLineHeightChange: any;
    handleLineHeightChangeEnd: any;
    handleLetterSpacing: any;
    handleLetterSpacingEnd: any;
    pauser: any;
}

const Spacing = (props: IProps) => {
    const { show, handleAlignBtnClick, translate, title, iconPath } = props;
    const content = translate(title);
    return (
        <Tooltip
            offsetLeft={0}
            offsetTop={-5}
            content={content}
            delay={10}
            style={{ display: show ? "block" : "none" }}
            position="top"
        >
            <div style={{
                position: "relative",
            }}>
            <a
                href="#"
                className="toolbar-btn"
                onClick={e => {
                    e.preventDefault();
                    document.getElementById("mySpacingList").classList.toggle("show");

                    const onDown = e => {
                        e.preventDefault();
                        console.log('e.target ', document.getElementById("mySpacingList"), e.target)
                        if (!document.getElementById("mySpacingList").contains(e.target)) {
                            console.log('ok');
                            var dropdowns = document.getElementsByClassName(
                                "dropdown-content-font-size"
                            );
                            var i;
                            for (i = 0; i < dropdowns.length; i++) {
                                var openDropdown = dropdowns[i];
                                if (openDropdown.classList.contains("show")) {
                                    openDropdown.classList.remove("show");
                                }
                            }

                            document.removeEventListener("mouseup", onDown);
                        }
                    };

                    document.addEventListener("mouseup", onDown);
                }}
                style={{
                    borderRadius: "4px",
                    padding: "3px",
                    display: "inline-block",
                    cursor: "pointer",
                    color: "black",
                    height: "100%",
                    backgroundColor: props.checked ? "rgba(14, 19, 24, 0.13) " : "white",
                }}
            >
                <img
                    style={{
                        height: "100%",
                    }} 
                    src={require("@Components/shared/svgs/editor/toolbar/spacing.svg")} 
                    alt={content} />
            </a>
            <div
                style={{
                    left: "0px",
                    top: "39px",
                    padding: "0 20px",
                    background: "white",
                    animation: "bounce 0.8s ease-out",
                    flexDirection: "column",
                }}
                id="mySpacingList"
                className="dropdown-content-font-size"
            >
                <Slider
                    pauser={props.pauser}
                    title="Letter" 
                    currentValue={props.currentLetterSpacing}
                    onChange={props.handleLetterSpacing}
                    onChangeEnd={props.handleLetterSpacingEnd}
                    />
                <Slider 
                    pauser={props.pauser}
                    title="Line letter" 
                    currentValue={(100*props.currentLineHeight - 50)/2}
                    onChange={props.handleLineHeightChange}
                    onChangeEnd={props.handleLineHeightChangeEnd}
                    />
            </div>
            </div>
        </Tooltip>
    );
}

export default Spacing;