import React, { Component } from 'react'
import { SidebarTab, TemplateType, } from "./enums";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import ImagePicker from "@Components/shared/ImagePicker";
import { toJS } from "mobx";
import Globals from "@Globals";
import Tooltip from "@Components/shared/Tooltip";

export interface IProps {
    scale: number;
    fontId: any;
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
                        `translate3d(0px, calc(${editorStore.selectedTab < SidebarTab.Font ? 40 : -40
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
                                        marginTop: "10px",
                                    }}
                                >
                                    {editorStore.fontsList.map((font, key) => (
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
                                                            <svg
                                                                style={{
                                                                    height: "30px",
                                                                    width: "30px",
                                                                    top: 0,
                                                                    bottom: 0,
                                                                    right: "40px",
                                                                }}
                                                                xmlns="http://www.w3.org/2000/svg" id="Capa_1" enableBackground="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512"><g><path d="m495.484 90.839h-478.968l-8.699 10.161v294.151c0 9.122 7.395 16.516 16.516 16.516h477.667l10-7.021v-297.29c0-9.123-7.395-16.517-16.516-16.517z" fill="#e5646e" /><path d="m16.516 355.097v-264.258c-9.121 0-16.516 7.394-16.516 16.516v297.29c0 9.122 7.395 16.516 16.516 16.516h478.968c9.121 0 16.516-7.395 16.516-16.516h-445.935c-27.365 0-49.549-22.183-49.549-49.548z" fill="#db4655" /><path d="m352.726 229.999h-70.292l-21.722-66.851c-1.483-4.565-7.942-4.565-9.424 0l-21.722 66.851h-70.292c-4.8 0-6.795 6.142-2.912 8.964l56.867 41.317-21.721 66.852c-1.483 4.565 3.741 8.361 7.624 5.539l56.868-41.317 56.867 41.317c3.883 2.822 9.108-.975 7.625-5.539l-21.721-66.852 56.867-41.317c3.883-2.821 1.888-8.964-2.912-8.964z" fill="#ffe07d" /></g></svg>
                                                        </Tooltip>
                                                    </div>}
                                                {editorStore.fontId === font.id ? (
                                                    <span
                                                        style={{
                                                            position: "absolute",
                                                            float: "right",
                                                            width: "20px",
                                                            height: "20px",
                                                            right: "10px",
                                                            marginRight: '20px',
                                                            margin: 'auto',
                                                            top: '0',
                                                            bottom: '0',
                                                        }}
                                                    >
                                                        <svg fill="#2c8dd6" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 288.941 288.941" xmlSpace="preserve">
                                                            <g>
                                                                <path id="Check" d="M285.377,46.368c-4.74-4.704-12.439-4.704-17.179,0L96.309,217.114L20.734,142.61   c-4.74-4.704-12.439-4.704-17.179,0s-4.74,12.319,0,17.011l84.2,82.997c4.692,4.644,12.499,4.644,17.191,0l180.43-179.239   C290.129,58.687,290.129,51.06,285.377,46.368C280.637,41.664,290.129,51.06,285.377,46.368z" />
                                                                <g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                                <g>
                                                                </g>
                                                            </g>
                                                            <g>
                                                            </g>
                                                            <g>
                                                            </g>
                                                            <g>
                                                            </g>
                                                            <g>
                                                            </g>
                                                            <g>
                                                            </g>
                                                            <g>
                                                            </g>
                                                            <g>
                                                            </g>
                                                            <g>
                                                            </g>
                                                            <g>
                                                            </g>
                                                            <g>
                                                            </g>
                                                            <g>
                                                            </g>
                                                            <g>
                                                            </g>
                                                            <g>
                                                            </g>
                                                            <g>
                                                            </g>
                                                            <g>
                                                            </g>
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