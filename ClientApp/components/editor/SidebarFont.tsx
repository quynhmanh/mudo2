import React, { Component } from 'react'
import { SidebarTab, TemplateType, } from "./enums";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import ImagePicker from "@Components/shared/ImagePicker";
import {toJS} from "mobx";
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
        console.log('fontId ', editorStore.fontId)
        console.log('editorStore.fontsList', toJS(editorStore.fontsList))
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
                                    marginTop: "10px",
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
                                            {font.vietnameseSupport && 
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    right: '40px',
                                                }}
                                            >
                                            <Tooltip
                                offsetLeft={80}
                                offsetTop={-15}
                                content={this.props.translate("vietnameseSupport")}
                                delay={10}
                                // style={{ display: show ? "block" : "none" }}
                                position="top"
                            >
                                            <svg 
                                                style={{
                                                    height: "26px",
                                                    top: 0,
                                                    bottom: 0,
                                                    right: "40px",
                                                }}
                                            xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" xmlSpace="preserve">
<path style={{
    fill: "#FF4B55"
}} d="M400,0H112C50.144,0,0,50.144,0,112v288c0,61.856,50.144,112,112,112h288  c61.856,0,112-50.144,112-112V112C512,50.144,461.856,0,400,0z"/>
<path style={{
    fill: "#FFE15A",
}} d="M260.565,146.63l26.164,78.449l82.695,0.641c4.624,0.036,6.541,5.937,2.822,8.684l-66.525,49.125  l24.944,78.845c1.395,4.409-3.625,8.056-7.387,5.367L256,319.654l-67.278,48.088c-3.762,2.689-8.782-0.958-7.387-5.367  l24.944-78.845l-66.525-49.125c-3.72-2.747-1.802-8.648,2.822-8.684l82.695-0.641l26.164-78.449  C252.898,142.243,259.102,142.243,260.565,146.63z"/>
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
</svg></Tooltip>  
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
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 288.941 288.941" xmlSpace="preserve">
<g>
	<path id="Check" d="M285.377,46.368c-4.74-4.704-12.439-4.704-17.179,0L96.309,217.114L20.734,142.61   c-4.74-4.704-12.439-4.704-17.179,0s-4.74,12.319,0,17.011l84.2,82.997c4.692,4.644,12.499,4.644,17.191,0l180.43-179.239   C290.129,58.687,290.129,51.06,285.377,46.368C280.637,41.664,290.129,51.06,285.377,46.368z"/>
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