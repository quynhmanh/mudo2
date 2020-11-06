import React from "react";

const MoreList = props => (
    <div
        id="myMoreList"
        style={{
            right: "5px",
            zIndex: 9999999999,
            background: "white",
            display: "none"
        }}
        className="dropdown-content-font-size"
    >
        <div style={{ display: "flex", width: "100%" }}>
            <div
                id="myDropdownFontSize-3"
                style={{
                    borderRadius: "5px",
                    width: "100%",
                    overflow: "hidden",
                    padding: "20px",
                }}
            >
                <button
                    style={{
                        border: "none",
                    }}
                >Post to facebook</button>
            </div>
        </div>
    </div>
);

export default MoreList;