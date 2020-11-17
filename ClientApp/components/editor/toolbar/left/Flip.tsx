import { getImageSelected, updateImages } from "@Utils";
import React from "react";
import editorStore from "@Store/EditorStore";

interface IProps {
    show: boolean;
    translate: any;
    cropMode: boolean;
}

const Flip = (props: IProps) => {
    const { show, cropMode, translate } = props;
    const content = translate("flip");
    return (
        <div
            style={{
                position: "relative",
                display: show ? "block" : "none",
            }}
        >
            {!cropMode && (
                <button
                    style={{
                        height: "100%",
                        top: 0
                    }}
                    className="dropbtn-font dropbtn-font-size toolbar-btn"
                    onClick={e => {
                        document.getElementById("myFlipDropDown").classList.toggle("show");

                        const onDown = e => {
                            if (!e.target.matches(".dropbtn-font-size")) {
                                // document.getElementById("fontSizeButton").style.backgroundColor = "transparent";
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
                >
                    <span>{content}</span>
                </button>
            )}
            <div
                style={{
                    left: "0px",
                    padding: "0",
                    background: "white",
                    animation: "bounce 0.8s ease-out",
                    flexDirection: "column",
                    width: "max-content",
                }}
                id="myFlipDropDown"
                className="dropdown-content-font-size"
            >
                <button
                    style={{
                        border: "none",
                        display: "flex",
                    }}
                    onClick={e => {
                        e.preventDefault();
                        let image = getImageSelected();
                        image.flipHorizontal = !image.flipHorizontal;
                        updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
                        editorStore.images2.set(editorStore.idObjectSelected, image);
                    }}
                >
                    <svg 
                        style={{
                            margin: "5px",
                        }}
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.97 15.25h-2.72c-5.3 0-9.5-2.15-9.5-4.5s4.2-4.5 9.5-4.5c3.03 0 5.82.7 7.62 1.86a.75.75 0 1 0 .81-1.26c-2.06-1.33-5.13-2.1-8.43-2.1-6.02 0-11 2.55-11 6s4.98 6 11 6h2.8l-2.3 2.3a.75.75 0 1 0 1.07 1.05l2.83-2.82c.68-.69.68-1.8 0-2.48l-2.83-2.83a.75.75 0 0 0-1.06 1.06l2.21 2.22z"></path></svg>
                    <span
                        style={{
                            margin: "7px",
                        }}
                    >{props.translate("flipHorizontal")}</span></button>
                <button
                    style={{
                        border: "none",
                        display: "flex",
                    }}
                    onClick={e => {
                        e.preventDefault();
                        let image = getImageSelected();
                        image.flipVertical = !image.flipVertical;
                        updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
                        editorStore.images2.set(editorStore.idObjectSelected, image);
                    }}
                >
                    <svg 
                        style={{
                            margin: "5px",
                        }}
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.25 8.35v2.4c0 5.3-2.15 9.5-4.5 9.5s-4.5-4.2-4.5-9.5c0-3.03.7-5.82 1.86-7.62a.75.75 0 1 0-1.26-.81c-1.33 2.06-2.1 5.13-2.1 8.43 0 6.02 2.55 11 6 11s6-4.98 6-11V8.27l2.3 2.3A.75.75 0 1 0 20.1 9.5l-2.82-2.83a1.75 1.75 0 0 0-2.48 0L11.97 9.5a.75.75 0 1 0 1.06 1.06l2.22-2.22z"></path></svg>
                    <span
                        style={{
                            margin: "7px",
                        }}
                    >{props.translate("flipVertical")}</span></button>
            </div>
        </div>
    );
}

export default Flip;