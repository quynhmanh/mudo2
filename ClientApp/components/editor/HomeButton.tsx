import * as React from "react";
import Home from "@Components/shared/svgs/HomeIcon";
import editorStore from "@Store/EditorStore";
import uuidv4 from "uuid/v4";
import styled from "styled-components";

interface IProps {
    translate: any;
}

interface IState {
    resizeSubtypeList: any;
}

const SubtypeList = [
    {
        title: "poster",
        value: 1,
        size: "1587.402px x 2245.04px"
    },
    {
        title: "facebookPost",
        value: 6,
        size: "1024px x 1024px"
    },
    {
        title: "squareVideoPost",
        value: 9,
        size: "1080px x 1080"
    },
    {
        title: "menu",
        value: 11,
        size: "794px x 1123px"
    },
    {
        title: "instagramStory",
        value: 12,
        size: "1080px x 1920px"
    },
    {
        title: "instagramPost",
        value: 13,
        size: "320px x 320px"
    },
    {
        title: "businessCard",
        value: 15,
        size: "1050px x 600px"
    },
    {
        title: "facebookCover",
        value: 16,
        size: "851px x 315px"
    },
    {
        title: "facebookPost",
        value: 17,
        size: "940px x 788px"
    },
    {
        title: "facebookAd",
        value: 18,
        size: "1200px x 628px"
    },
    {
        title: "resume",
        value: 19,
        size: "794px x 1123px"
    },
];

export default class HomeButton extends React.Component<IProps, IState> {

    state = {
        resizeSubtypeList: [],
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() { }

    render() {
        return (
            <div
                style={{
                    display: "flex",
                    height: "100%",
                }}>
                <a
                    id="logo-editor"
                    style={{
                        color: "white",
                        display: "flex",
                        padding: "5px 14px",
                        borderRadius: "3px",
                        marginLeft: "5px",
                        textDecoration: "none",
                    }}
                    href="/"
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "15px",
                            fontWeight: 500,
                            height: "100%",
                            position: "relative",
                        }}
                    >
                        <span
                            style={{
                                marginRight: "5px",
                            }}
                        >
                            <Home width="24px" height="24px" />
                        </span>
                        <span
                            style={{
                                display: "block",
                                right: 0,
                                fontSize: "15px",
                                fontWeight: 500,
                            }}
                        >{this.props.translate("home")}</span>
                    </div>
                </a>
                <a
                    id="logo-editor"
                    style={{
                        color: "white",
                        display: "flex",
                        padding: "5px 14px",
                        position: "relative",
                        borderRadius: "3px",
                        marginLeft: "5px",
                        textDecoration: "none",
                    }}
                    href="javascript:"
                        onClick={e => {
                            document.getElementById("myResizeList").classList.toggle("show");

                            const onDown = e => {
                                console.log('e. target', e.target)
                                if (!document.getElementById("myResizeList").contains(e.target)) {
                                    console.log('contain')
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
                        }}
                >
                    <div
                        style={{
                            color: "white",
                            textDecoration: "none",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                fontSize: "14px",
                                fontWeight: 600,
                                height: "100%",
                                position: "relative",
                            }}
                        >{window.translate("resize")}
                    </div>
                    </div>
                    <div
                        id="myResizeList"
                        style={{
                            left: "5px",
                            zIndex: 9999999999,
                            background: "white",
                            display: "none",
                            color: "black",
                            flexDirection: "column",
                        }}
                        className="dropdown-content-font-size dropbtn-font-size"
                    >
                        <ul>
                            {SubtypeList.map(subtype => <ResizeSubtypeButton>
                            <button
                                type="button"
                                className="ncVBXQ zipTDg fFOiLQ fP4ZCw RgBf3Q _58cEw _3phPTw"
                                onClick={e => {
                                }}
                                >
                                <div className="vH6Kyg">
                                    <span className="Sbf1Gw">
                                    <label className="_1I5x5g">
                                        <div className="ZJon7Q">
                                        <input 
                                            onChange={e => {
                                                let resizeSubtypeList = this.state.resizeSubtypeList;
                                                if (e.target.checked) {
                                                    resizeSubtypeList.push(subtype.value);
                                                } else {
                                                    resizeSubtypeList = resizeSubtypeList.filter(val => val != subtype.value);
                                                }
                                                this.setState({ resizeSubtypeList });
                                            }}
                                        type="checkbox" className="SPXzig YmnidQ" defaultValue />
                                        <span className="tdZD9A YmnidQ ioka9Q">
                                            <span aria-hidden="true" className="IbvMRg uRWxVA dkWypw">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={16}
                                                height={16}
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                fill="currentColor"
                                                d="M5.72 12.53l-3.26-3.3c-.7-.72.36-1.77 1.06-1.06l2.73 2.77 6.35-6.35a.75.75 0 0 1 1.06 1.06l-6.88 6.88a.78.78 0 0 1-.5.23.83.83 0 0 1-.56-.23z"
                                                />
                                            </svg>
                                            </span>
                                        </span>
                                        </div>
                                        <div className="GdhAcA">
                                        <div className="pp7Ewg FFnr-w _0bqX9Q fFOiLQ fP4ZCw">
                                            <div className="mSSDiA" title="Facebook Post, Poster">
                                            <span className="U1nojQ">{window.translate(subtype.title)}</span>
                                            <span
                                                style={{
                                                    fontSize: "12px",
                                                    marginLeft: "10px",
                                                    color: "gray",
                                                }}
                                            >{subtype.size}</span>
                                            </div>
                                        </div>
                                        </div>
                                    </label>
                                    </span>
                                </div>
                                </button>
                            </ResizeSubtypeButton>)}
                        </ul>
                        {/* <form style={{ margin: 0, }} action="/action_page.php">
                            <input
                                onChange={e => {
                                    let resizeSubtypeList = this.state.resizeSubtypeList;
                                    if (e.target.checked) {
                                        resizeSubtypeList.push(6);
                                    } else {
                                        resizeSubtypeList = resizeSubtypeList.filter(val => val != 6);
                                    }
                                    this.setState({ resizeSubtypeList });
                                }}
                                style={{ margin: "10px", }} type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
                            <span>Menu</span>
                            <br />
                            <input
                                onChange={e => {
                                    let resizeSubtypeList = this.state.resizeSubtypeList;
                                    if (e.target.checked) {
                                        resizeSubtypeList.push(7);
                                    } else {
                                        resizeSubtypeList = resizeSubtypeList.filter(val => val != 6);
                                    }
                                    console.log('resizeSubtypeList', resizeSubtypeList)
                                    this.setState({ resizeSubtypeList });
                                }}
                                style={{ margin: "10px", }} type="checkbox" id="vehicle2" name="vehicle2" value="Car" />
                            <span>Instagram Post</span>
                            <br />
                            <input
                                onChange={e => {
                                    let resizeSubtypeList = this.state.resizeSubtypeList;
                                    if (e.target.checked) {
                                        resizeSubtypeList.push(8);
                                    } else {
                                        resizeSubtypeList = resizeSubtypeList.filter(val => val != 6);
                                    }
                                    this.setState({ resizeSubtypeList });
                                }}
                                style={{ margin: "10px", }} type="checkbox" id="vehicle3" name="vehicle3" value="Boat" />
                            <span>Facebook Post</span>
                            <br />
                        </form> */}
                        <button
                            onClick={e => {
                                this.state.resizeSubtypeList.forEach((subtype, key) => {
                                    let images = Array.from(editorStore.images2.values());
                                    images = images.map(img => {
                                        img.selected = false;
                                        img.hovered = false;
                                        img.focused = false;
                                        return img;
                                    })
                                    let font = editorStore.fonts;

                                    localStorage.setItem("items", JSON.stringify(images));
                                    localStorage.setItem("rectWidth", window.rectWidth);
                                    localStorage.setItem("rectHeight", window.rectHeight);
                                    localStorage.setItem("fonts", JSON.stringify(font));
                                    const url = `/editor/${uuidv4()}/resize/${subtype}`;
                                    console.log('url ', url)
                                    window.open(url, "_blank");
                                });
                            }}
                            style={{
                                width: "100px",
                                border: "none",
                                background: "#80808030",
                                padding: "7px 12px",
                                borderRadius: "5px",
                                margin: "auto auto 10px",
                            }}
                        >{window.translate("resize")}  {this.state.resizeSubtypeList.length > 0 ? "(" + this.state.resizeSubtypeList.length + ")" : ""}</button>
                    </div>
                </a>
                <p
                    id="savingState"
                    style={{
                        color: "hsla(0,0%,100%,.5)",
                        fontStyle: "italic",
                        margin: "auto",
                        marginLeft: "20px",
                        fontSize: "14px",
                        fontWeight: 400,
                    }}
                >{this.props.translate("allChangesSaved")}</p>
            </div>
        );
    }
}

const ResizeSubtypeButton = styled.li`
    button {
        width: 100%;
        height: 40px;
        border: none;
        padding: 0;
        :hover {
            background: rgba(64, 87, 109, 0.07);
        }
    }

    label {
        margin: 0;
        font-weight: 400;
        font-size: 14px;
    }

    svg {
        display: none;
    }

    input {
        margin: 13px;
    }

    .GdhAcA {
        display: flex;
    }

    .fP4ZCw {
        margin: auto;
    }

    ._1I5x5g {
        height: 100%;
    }
`;