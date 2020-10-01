import React, { Component } from "react";
import Tooltip from "@Components/shared/Tooltip";
import Slider from "@Components/editor/Slider";
import editorStore from "@Store/EditorStore";
import { getLetterSpacing } from "@Utils";

interface IProps {
    show: boolean;
    translate: any;
    title: string;
    currentLineHeight: number;
    currentLetterSpacing: number
    pauser: any;
    updateImages: any;
    onTextChange: any;
    scale: number;
    handleLineHeightChange: any;
    handleLineHeightChangeEnd: any;
    handleLetterSpacing: any;
    handleLetterSpacingEnd: any;
}

interface IState {

}

export default class Spacing extends Component<IProps, IState> {

    constructor(props: any) {
        super(props);

        this.onDown = this.onDown.bind(this);
    }

    getSingleTextHTMLElement() {
        return document.getElementById(editorStore.idObjectSelected + editorStore.childId + "text-container2alo");
    }

    handleLineHeightChangeEnd = (val) => {
        if (!val) return;
        let lineHeight = 1.0 * val / 100 * 2 + 0.5;
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.lineHeight = lineHeight;
                }
                return text;
            });
            image.document_object = texts;
            editorStore.images2.set(editorStore.idObjectSelected, image);
            this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
        } else {
            image.lineHeight = lineHeight;
            image.height = window.imageHeight;
            image.origin_height = window.imageHeight / image.scaleY;
            editorStore.images2.set(editorStore.idObjectSelected, image);
            this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
        }
    }

    handleLineHeightChange = val => {
        let lineHeight = 1.0 * val / 100 * 2 + 0.5;
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            let el = this.getSingleTextHTMLElement();
            el.style.lineHeight = lineHeight.toString();

            this.props.onTextChange(image, null, editorStore.childId);
        } else {
            let hihi4 = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
            hihi4.style.lineHeight = lineHeight.toString();
            let image = editorStore.getImageSelected();
            let height = hihi4.offsetHeight;
            let a = document.getElementsByClassName(editorStore.idObjectSelected + "aaaaalo");
            for (let i = 0; i < a.length; ++i) {
                let tempEl = a[i] as HTMLElement;
                tempEl.style.height = height * image.scaleY * this.props.scale + "px";
            }

            window.imageHeight = height * image.scaleY;
        }

        window.lineHeight = lineHeight;
    };

    handleLetterSpacingChangeEnd = (letterSpacing) => {
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.letterSpacing = window.letterSpacing;
                }
                return text;
            });
            image.document_object = texts;
            editorStore.images2.set(editorStore.idObjectSelected, image);
            this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
        } else {
            let image = editorStore.getImageSelected();
            image.height = window.imageHeight;
            image.letterSpacing = window.letterSpacing;
            image.origin_height = window.imageHeight / image.scaleY;

            editorStore.images2.set(editorStore.idObjectSelected, image);
            this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
        }
    }

    handleLetterSpacingChange = letterSpacing => {
        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            let el = this.getSingleTextHTMLElement();
            el.style.letterSpacing = getLetterSpacing(letterSpacing);

            this.props.onTextChange(image, null, editorStore.childId);
        } else {
            let hihi4 = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
            hihi4.style.letterSpacing = getLetterSpacing(letterSpacing);
            let height = hihi4.offsetHeight;

            let image = editorStore.getImageSelected();

            let a = document.getElementsByClassName(editorStore.idObjectSelected + "aaaaalo");
            for (let i = 0; i < a.length; ++i) {
                let tempEl = a[i] as HTMLElement;
                tempEl.style.height = height * image.scaleY * this.props.scale + "px";
            }

            window.imageHeight = height * image.scaleY;
        }

        window.letterSpacing = letterSpacing;
    }

    onDown(e) {
        e.preventDefault();
        let el = document.getElementById("mySpacingList");
        if (!el || !document.getElementById("mySpacingList").contains(e.target)) {
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


            document.removeEventListener("mouseup", this.onDown);
        }
    }

    render() {
        const { show, translate, title } = this.props;
        const content = translate(title);
        return (
            <Tooltip
                offsetLeft={0}
                offsetTop={-10}
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
                            padding: "4px 4px 0px",
                            height: "32px",
                            width: "32px",
                            display: "inline-block",
                            cursor: "pointer",
                            color: "black",
                        }}
                    >
                        <img
                            src={require("@Components/shared/svgs/editor/toolbar/spacing.svg")}
                            alt={content} />
                    </a>
                    <div
                        style={{
                            left: "0px",
                            top: "39px",
                            padding: "20px 20px 0px",
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
                            currentValue={editorStore.currentLetterSpacing}
                            onChangeStart={e => {
                                document.removeEventListener("mouseup", this.onDown);
                                window.selectionStart = true;
                            }}
                            onChange={this.handleLetterSpacingChange}
                            onChangeEnd={val => {
                                document.addEventListener("mouseup", this.onDown);
                                this.handleLetterSpacingChangeEnd(val);
                            }}
                        />
                        <Slider
                            pauser={this.props.pauser}
                            title="Line letter"
                            currentValue={(100 * (editorStore.currentLineHeight ? editorStore.currentLineHeight : 30) - 50) / 2}
                            onChangeStart={e => {
                                document.removeEventListener("mouseup", this.onDown);
                                window.selectionStart = true;
                            }}
                            onChange={this.handleLineHeightChange}
                            onChangeEnd={val => {
                                document.addEventListener("mouseup", this.onDown);
                                this.handleLineHeightChangeEnd(val);
                            }}
                        />
                    </div>
                </div>
            </Tooltip>
        );
    }
}