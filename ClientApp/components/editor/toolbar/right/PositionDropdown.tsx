import React from "react";

interface IProps {
    translate: any;
    forwardSelectedObject: any;
    backwardSelectedObject: any;
}

const PositionDropdown = (props: IProps) => {
    return (
        <div
            id="myPositionList"
            style={{
                right: "10px",
                backgroundColor: "white",
                animation: "bounce 1.2s ease-out"
            }}
            className="dropdown-content-font-size"
        >
            <div style={{ display: "flex" }}>
                <div
                    id="myDropdownFontSize-2"
                    style={{
                        borderRadius: "5px",
                        padding: "10px"
                    }}
                >
                    <button
                        style={{
                            padding: "6px",
                            border: "none",
                            backgroundColor: "#eee",
                            borderRadius: "3px",
                            marginRight: "10px",
                            width: "135px"
                        }}
                        onClick={props.forwardSelectedObject}
                    >
                        <svg
                            style={{
                                marginBottom: "-8px",
                                marginRight: "6px"
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M12.75 5.82v8.43a.75.75 0 1 1-1.5 0V5.81L8.99 8.07A.75.75 0 1 1 7.93 7l2.83-2.83a1.75 1.75 0 0 1 2.47 0L16.06 7A.75.75 0 0 1 15 8.07l-2.25-2.25zM15 10.48l6.18 3.04a1 1 0 0 1 0 1.79l-7.86 3.86a3 3 0 0 1-2.64 0l-7.86-3.86a1 1 0 0 1 0-1.8L9 10.49v1.67L4.4 14.4l6.94 3.42c.42.2.9.2 1.32 0l6.94-3.42-4.6-2.26v-1.67z"
                            ></path>
                        </svg>
                        <span style={{ lineHeight: "24px" }}>
                            {/* Lên trên */}
                            {props.translate("forward")}
                        </span>
                    </button>
                    <button
                        style={{
                            padding: "6px",
                            border: "none",
                            backgroundColor: "#eee",
                            borderRadius: "3px",
                            width: "135px"
                        }}
                        onClick={props.backwardSelectedObject}
                    >
                        <svg
                            style={{
                                marginBottom: "-8px",
                                marginRight: "6px"
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M12.75 18.12V9.75a.75.75 0 1 0-1.5 0v8.37l-2.26-2.25a.75.75 0 0 0-1.06 1.06l2.83 2.82c.68.69 1.79.69 2.47 0l2.83-2.82A.75.75 0 0 0 15 15.87l-2.25 2.25zM15 11.85v1.67l6.18-3.04a1 1 0 0 0 0-1.79l-7.86-3.86a3 3 0 0 0-2.64 0L2.82 8.69a1 1 0 0 0 0 1.8L9 13.51v-1.67L4.4 9.6l6.94-3.42c.42-.2.9-.2 1.32 0L19.6 9.6 15 11.85z"
                            ></path>
                        </svg>
                        <span style={{ lineHeight: "24px" }}>
                            {/* Xuống dưới */}
                            {props.translate("backward")}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PositionDropdown;