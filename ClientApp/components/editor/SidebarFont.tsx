import React, { Component } from 'react'
import { SidebarTab, TemplateType, } from "./enums";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import ImagePicker from "@Components/shared/ImagePicker";
import {toJS} from "mobx";
import Globals from "@Globals";

export interface IProps {
    scale: number;
    translate: any;
    selectedTab: any;
    handleEditmedia: any;
    handleEditFont: any;
    updateImages: any;
}

export interface IState {
    items: any;
    items2: any;
    items3: any;
    isLoading: boolean;
    currentItemsHeight: number;
    currentItems2Height: number;
    currentItems3Height: number;
    error: any;
    hasMore: boolean;
    cursor: any;
}

const imgWidth = 162;
const backgroundWidth = 105;
const adminEmail = "llaugusty@gmail.com";

export default class SidebarFont extends Component<IProps, IState> {
    state = {
        isLoading: false,
        items: [],
        items2: [],
        items3: [],
        currentItemsHeight: 0,
        currentItems2Height: 0,
        currentItems3Height: 0,
        error: null,
        hasMore: true,
        cursor: null,
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadMore.bind(this)(true);
        this.selectFont.bind(this);
        this.forceUpdate();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.selectedTab != nextProps.selectedTab
            && (nextProps.selectedTab == SidebarTab.Font || this.props.selectedTab == SidebarTab.Font)
        ) {
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
        if( el) {
            el.style.fontFamily = id;
        }

        let image = editorStore.images2.get(editorStore.idObjectSelected);
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

        editorStore.images2.set(editorStore.idObjectSelected, image);
        this.props.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);

        // this.setState({ 
        //     fontName: font.representative,
        //     fontId: font.id,
        // });

        editorStore.fontId = font.id;

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
        head.appendChild(link);

        editorStore.addFont(id);

        this.forceUpdate();
    };


    loadMore = initialLoad => {
        let pageId;
        let count;
        if (initialLoad) {
            pageId = 1;
            count = 30;
        } else {
            pageId = editorStore.fontsList.length / 30 + 1;
            count = 30;
        }
        this.setState({ isLoading: true, error: undefined });
        const url = `/api/Font/Search?page=${pageId}&perPage=${count}`;
        fetch(url)
            .then(res => res.json())
            .then(
                res => {
                    for (var i = 0; i < res.value.key.length; ++i) {
                        if (res.value.key[i].id)
                            editorStore.addFontItem(res.value.key[i]);
                    }

                    this.setState(state => ({
                        hasMore: res.value.value > editorStore.fontsList.length,
                        isLoading: false,
                    }));
                },
                error => {
                    this.setState({ isLoading: false, error })
                }
            );
    };

    render() {
        return (
            <div
            style={{
                opacity: editorStore.selectedTab === SidebarTab.Font ? 1 : 0,
                position: "absolute",
                width: "370px",
                color: "white",
                overflow: "scroll",
                transition:
                    "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                    editorStore.selectedTab !== SidebarTab.Font &&
                    `translate3d(0px, calc(${
                    editorStore.selectedTab < SidebarTab.Font ? 40 : -40
                    }px), 0px)`,
                zIndex: editorStore.selectedTab !== SidebarTab.Font && -1,
                height: "100%",
                left: "0px",
                backgroundColor: "white",
                // left: '19px',
            }}
        >
            <div>
                <div
                    style={{
                        height: "calc(100% - 10px)"
                    }}
                >
                    <InfiniteScroll
                        scroll={true}
                        throttle={500}
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
                                    // marginRight: "10px"
                                }}
                            >
                                {editorStore.fontsList.map((font, key) => (
                                    <div
                                        key={key}
                                        style={{
                                            display: 'flex',
                                        }}>
                                        {Globals.serviceUser &&
                                            Globals.serviceUser.username &&
                                            Globals.serviceUser.username == adminEmail && (
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
                                            key={uuidv4()}
                                            className="font-picker"
                                            onClick={e => {
                                                this.selectFont(font.id, e);
                                            }}
                                        >
                                            <img
                                                style={{
                                                    // margin: "auto"
                                                }}
                                                src={font.representative}
                                            />
                                            {editorStore.fontId === font.id ? (
                                                <span
                                                    style={{
                                                        position: "absolute",
                                                        float: "right",
                                                        width: "25px",
                                                        height: "25px",
                                                        right: "10px"
                                                    }}
                                                >
                                                    <svg
                                                        style={{ fill: "black" }}
                                                        version="1.1"
                                                        viewBox="0 0 44 44"
                                                        enableBackground="new 0 0 44 44"
                                                    >
                                                        <path d="m22,0c-12.2,0-22,9.8-22,22s9.8,22 22,22 22-9.8 22-22-9.8-22-22-22zm12.7,15.1l0,0-16,16.6c-0.2,0.2-0.4,0.3-0.7,0.3-0.3,0-0.6-0.1-0.7-0.3l-7.8-8.4-.2-.2c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5 0.3-0.7l1.4-1.4c0.4-0.4 1-0.4 1.4,0l.1,.1 5.5,5.9c0.2,0.2 0.5,0.2 0.7,0l13.4-13.9h0.1c0.4-0.4 1-0.4 1.4,0l1.4,1.4c0.4,0.3 0.4,0.9 0,1.3z" />
                                                    </svg>
                                                </span>
                                            ) : null}
                                        </button>
                                    </div>
                                ))}
                                {this.state.hasMore &&
                                    Array(1)
                                        .fill(0)
                                        .map((item, i) => (
                                            <ImagePicker
                                                key={i}
                                                id="sentinel-font"
                                                color="black"
                                                src={""}
                                                height={imgWidth}
                                                defaultHeight={imgWidth}
                                                width={imgWidth}
                                                className=""
                                                onPick={null}
                                                onEdit={this.props.handleEditmedia.bind(this, null)}
                                                delay={0}
                                                showButton={false}
                                            />
                                        ))}
                            </div>
                        </div>
                    </InfiniteScroll>
                </div>
            </div>
        </div>
        )
    }
}