import React, { Component } from 'react'
import { SidebarTab, } from "./enums";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import { toJS } from "mobx";
import Tooltip from "@Components/shared/Tooltip";
import FontPicker from "@Components/editor/FontPicker";
import Sidebar from "@Components/editor/SidebarStyled";
import styled from "styled-components";

export interface IProps {
    scale: number;
    fontId: any;
    translate: any;
    selectedTab: any;
    handleEditmedia: any;
    handleEditFont: any;
    updateImages: any;
    rem: number;
}

export interface IState {
    isLoading: boolean;
    items: any;
    error: any;
    hasMore: boolean;
    cursor: any;
    loaded: boolean;
    query: string;
}

export default class SidebarFont extends Component<IProps, IState> {
    state = {
        isLoading: false,
        items: [],
        error: null,
        hasMore: true,
        cursor: null,
        loaded: false,
        query: "",
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.selectedTab == SidebarTab.Font) {
            if (!nextState.loaded) {
                this.loadMore(true);
            }
        }
        if (this.props.selectedTab != nextProps.selectedTab
            && (nextProps.selectedTab == SidebarTab.Font || this.props.selectedTab == SidebarTab.Font)
        ) {
            return true;
        }

        if (this.props.fontId != nextProps.fontId) {
            return true;
        }

        return false;
    }

    selectFont = (id, e) => {
        let fontsList = toJS(editorStore.fontsList);
        let font = fontsList.find(font => font.id === id);
        let el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
        if (el) {
            el.style.fontFamily = id;
        }

        el = document.getElementById(editorStore.childId + "text-container2alo");
        if (el) {
            el.style.fontFamily = id;
        }

        let image = editorStore.getImageSelected();
        if (editorStore.childId) {
            let newTexts = image.document_object.map(d => {
                if (d._id == editorStore.childId) {
                    d.fontId = id;
                    d.fontFace = id;
                    d.fontRepresentative = font.representative;
                }
                return d;
            });
            image.document_object = newTexts;
        }
        image.fontId = id;
        image.fontFace = id;
        image.fontRepresentative = font.representative;
        image.fontText = font.text;

        editorStore.images2.set(editorStore.idObjectSelected, image);
        this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
        editorStore.fontId = font.id;
        editorStore.fontText = "Loading ...";

        e.preventDefault();
        let style = `@font-face {
      font-family: '${id}';
      src: url('/fonts/${id}.ttf');
    }`;
        let styleEle = document.createElement("style");
        let type = document.createAttribute("type");
        type.value = "text/css";
        styleEle.attributes.setNamedItem(type);
        styleEle.innerHTML = style;
        let head = document.head || document.getElementsByTagName("head")[0];
        head.appendChild(styleEle);

        let link = document.createElement("link");
        link.id = id;
        link.rel = "preload";
        link.href = `/fonts/${id}.ttf`;
        link.media = "all";
        link.as = "font";
        link.crossOrigin = "anonymous";
        link.onload = () => {
            editorStore.fontText = font.text;
        }
        head.appendChild(link);

        editorStore.addFont(id);

        this.forceUpdate();
    };


    loadMore = initialLoad => {
        const count = 30;
        const pageId = Math.floor(editorStore.fontsList.length / 30) + 1;
        this.setState({ isLoading: true, error: undefined, loaded: true, });
        const url = `/api/Font/Search?page=${pageId}&perPage=${count}&term=${this.state.query}`;
        console.log('url ', url)
        fetch(url)
            .then(res => res.json())
            .then(
                res => {
                    for (var i = 0; i < res.value.key.length; ++i) {
                        editorStore.addFontItem(res.value.key[i]);
                    }

                    this.setState(state => ({
                        hasMore: res.value.value > editorStore.fontsList.length,
                        isLoading: false,
                    }));

                    this.forceUpdate();
                },
                error => {
                    this.setState({ isLoading: false, error })
                }
            );
    };

    handleQuery = term => {
        editorStore.fontsList.clear();
        this.setState({ query: term}, () => {
            this.loadMore(false);
        });
        let el = document.getElementById("queryInput") as HTMLInputElement;
        el.value = term;
        this.forceUpdate();
    };

    render() {
        return (
            <Sidebar
                selectedTab={editorStore.selectedTab}
                sidebar={SidebarTab.Font}
                style={{
                    left: 0,
                    top: 0,
                    background: "white",
                    width: "370px",
                    transition: "none",
                    transform: "none",
                }}
            >
                <div>
                    <ScrollContainer>
                    <div
                        style={{
                            display: 'flex',
                            width: '335px',
                            boxSizing: 'border-box',
                            position: 'relative',
                            height: "40px",
                            margin: "16px auto 0px",
                        }}
                    >
                        <button 
                            type="button"
                            style={{
                                color: 'rgba(30,41,51,.45)',
                                flexGrow: 0,
                                flexShrink: 0,
                                position: 'absolute',
                                width: "40px",
                                height: "40px",
                                border: "none",
                            }}>
                            <span className="c-sq0w">
                                <span aria-hidden="true" className="_1zGq3g uEuSRg AHNG3A">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="{24}" height="{24}" viewBox="0 0 24 24">
                                        <path fill="rgba(30,41,51,.45)" d="M15.45 17.97L9.5 12.01a.25.25 0 0 1 0-.36l5.87-5.87a.75.75 0 0 0-1.06-1.06l-5.87 5.87c-.69.68-.69 1.8 0 2.48l5.96 5.96a.75.75 0 0 0 1.06-1.06z" />
                                    </svg>
                                </span>
                            </span>
                        </button>
                        <input 
                            style={{
                                width: "100%",
                                border: "none",
                                boxShadow: "0 0 0 1px rgba(53,71,90,.2)",
                                borderRadius: "4px",
                                color: "black",
                                padding: "9px 37px 10px",
                            }}
                            onKeyDown={e => {
                                if (e.key === "Enter") {
                                    let el = e.target as HTMLInputElement;
                                    this.handleQuery(el.value);
                                }
                            }}
                            onFocus={e => {
                                window.inputFocus = true;
                            }}
                            onBlur={e => {
                                window.inputFocus = false;
                            }}
                            type="text" 
                            autoCorrect="off" 
                            placeholder="Try “Calligraphy” or “Open Sans”" 
                            defaultValue="Calligraphy" />
                        <button 
                            type="button"
                            style={{
                                color: 'rgba(30,41,51,.45)',
                                flexGrow: 0,
                                flexShrink: 0,
                                position: 'absolute',
                                width: "40px",
                                height: "40px",
                                right: "4px",
                                border: "none",
                            }}>
                            <span className="c-sq0w">
                                <span aria-hidden="true" className="_1zGq3g uEuSRg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="{24}" height="{24}" viewBox="0 0 24 24">
                                        <path fill="rgba(30,41,51,.45)" d="M13.06 12.15l5.02-5.03a.75.75 0 1 0-1.06-1.06L12 11.1 6.62 5.7a.75.75 0 1 0-1.06 1.06l5.38 5.38-5.23 5.23a.75.75 0 1 0 1.06 1.06L12 13.2l4.88 4.87a.75.75 0 1 0 1.06-1.06l-4.88-4.87z" />
                                    </svg>
                                </span>
                            </span>
                        </button>
                    </div>

                        <InfiniteScroll
                            scroll={true}
                            throttle={200}
                            threshold={300}
                            isLoading={this.state.isLoading}
                            hasMore={this.state.hasMore}
                            onLoadMore={this.loadMore.bind(this, false)}
                            marginTop={0}
                            refId="sentinel-font"
                        >
                            <div id="image-container-picker">
                                <div
                                    style={{
                                        marginTop: "10px",
                                    }}
                                >
                                    {editorStore.fontsList.filter(font => font.id).map((font, key) => (
                                        <div
                                            key={key}
                                            style={{
                                                display: 'flex',
                                            }}>
                                            {editorStore.isAdmin && (
                                                <button
                                                    style={{
                                                        top: "5px",
                                                        left: "5px",
                                                        borderRadius: "13px",
                                                        border: "none",
                                                        padding: "0 4px",
                                                        boxShadow:
                                                            "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
                                                    }}
                                                    onClick={this.props.handleEditFont.bind(this, font)}
                                                >
                                                    <span>
                                                        <svg
                                                            width="25"
                                                            height="25"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <defs>
                                                                <path
                                                                    id="_2658783389__a"
                                                                    d="M3.25 9.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"
                                                                ></path>
                                                            </defs>
                                                            <use
                                                                fill="black"
                                                                xlinkHref="#_2658783389__a"
                                                                fillRule="evenodd"
                                                            ></use>
                                                        </svg>
                                                    </span>
                                                </button>
                                            )}
                                            <button
                                                key={key}
                                                className="font-picker"
                                                onClick={e => {
                                                    this.selectFont(font.id, e);
                                                }}
                                            >
                                                <FontPicker
                                                    src={font.representative}
                                                    height={font.fontPickerHeight ? font.fontPickerHeight : 20}
                                                />
                                                {font.vietnameseSupport &&
                                                    <div
                                                        style={{
                                                            position: "absolute",
                                                            right: '40px',
                                                            top: '0',
                                                            bottom: '0',
                                                            margin: 'auto',
                                                            height: '30px',
                                                        }}
                                                    >
                                                        <Tooltip
                                                            offsetLeft={80}
                                                            offsetTop={-20}
                                                            content={this.props.translate("vietnameseSupport")}
                                                            delay={10}
                                                            position="top"
                                                        >
                                                            <img
                                                                style={{
                                                                    height: "30px",
                                                                    width: "30px",
                                                                    top: 0,
                                                                    bottom: 0,
                                                                    right: "44px",
                                                                }}
                                                                src={require("@Components/shared/svgs/editor/toolbar/vietnam-flag.svg")} alt={""} />
                                                        </Tooltip>
                                                    </div>}
                                                {editorStore.fontId === font.id ? (
                                                    <span
                                                        style={{
                                                            position: "absolute",
                                                            float: "right",
                                                            width: "20px",
                                                            height: "20px",
                                                            right: "14px",
                                                            marginRight: '20px',
                                                            margin: 'auto',
                                                            top: '0',
                                                            bottom: '0',
                                                        }}
                                                    >
                                                        <img
                                                            style={{
                                                                width: "25px",
                                                            }}
                                                            src={require("@Components/shared/svgs/editor/toolbar/selected.svg")} alt={""} />
                                                    </span>

                                                ) : null}
                                            </button>
                                        </div>
                                    ))}
                                    {this.state.hasMore && Array(this.props.rem)
                                        .fill(0)
                                        .map((font, key) => (
                                            <div
                                            key={key}
                                            id="sentinel-font"
                                            style={{
                                                display: 'flex',
                                            }}>
                                            <button
                                                key={uuidv4()}
                                                className="font-picker"
                                                onClick={e => {
                                                    this.selectFont(font.id, e);
                                                }}
                                            >
                                                <FontPicker
                                                    src={font.representative}
                                                    height={font.fontPickerHeight ? font.fontPickerHeight : 20}
                                                />
                                            </button>
                                        </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </InfiniteScroll>
                    </ScrollContainer>
                </div>
            </Sidebar>
        )
    }
}

const ScrollContainer = styled.div`
    height: calc(100% - 10px);
    #object-container::-webkit-scrollbar-thumb {
        background-color: #ddd;
    }

    #object-container::-webkit-scrollbar-track {
        background-color: white;
    }
`;