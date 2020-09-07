import React, {Component} from "react";
import Tooltip from "@Components/shared/Tooltip";
import Slider from "@Components/editor/Slider";

interface IProps {
    show: boolean;
    translate: any;
    title: string;
    currentLineHeight: number;
    currentLetterSpacing: number;
    handleLineHeightChange: any;
    handleLineHeightChangeEnd: any;
    handleLetterSpacing: any;
    handleLetterSpacingEnd: any;
    pauser: any;
}

interface IState {

}

export default class Spacing extends Component<IProps, IState> {

    onDown(e) {
        console.log('onDown')
        e.preventDefault();
        let el = document.getElementById("mySpacingList");
        console.log('e.target ', document.getElementById("mySpacingList"), e.target)
        if (!el || !document.getElementById("mySpacingList").contains(e.target)) {
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

            console.log('asd')

            document.removeEventListener("mouseup", this.onDown);
        }
    }

    render() {
        const { show, translate, title } = this.props;
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

                        document.addEventListener("mouseup", this.onDown);
                    }}
                    style={{
                        borderRadius: "4px",
                        padding: "3px",
                        display: "inline-block",
                        cursor: "pointer",
                        color: "black",
                        height: "100%",
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
                        pauser={this.props.pauser}
                        title="Letter" 
                        currentValue={this.props.currentLetterSpacing ? this.props.currentLetterSpacing : 30 }
                        onChangeStart={e => {
                            document.removeEventListener("mouseup", this.onDown);
                            window.selectionStart = true;
                        }}
                        onChange={this.props.handleLetterSpacing}
                        onChangeEnd={val => {
                            document.addEventListener("mouseup", this.onDown);
                            this.props.handleLetterSpacingEnd(val);
                            window.selectionStart = false;
                        }}
                        />
                    <Slider 
                        pauser={this.props.pauser}
                        title="Line letter" 
                        currentValue={(100*(this.props.currentLineHeight ? this.props.currentLineHeight : 30) - 50)/2}
                        onChangeStart={e => {
                            document.removeEventListener("mouseup", this.onDown);
                            window.selectionStart = true;
                        }}
                        onChange={this.props.handleLineHeightChange}
                        onChangeEnd={val => {
                            document.addEventListener("mouseup", this.onDown);
                            this.props.handleLineHeightChangeEnd(val);
                            window.selectionStart = false;
                        }}
                        />
                </div>
                </div>
            </Tooltip>
        );
    }
}