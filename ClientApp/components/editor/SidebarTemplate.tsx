import React, { Component } from 'react'
import { SidebarTab, TemplateType, } from "./enums";
import editorStore from "@Store/EditorStore";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import ImagePicker from "@Components/shared/ImagePicker";
import { toJS } from "mobx";
import VideoPicker from "@Components/shared/VideoPicker2";

export interface IProps {
    scale: number;
    translate: any;
    subtype: any;
    selectedTab: any;
    handleEditmedia: any;
    rectHeight: number;
    rectWidth: number;
    forceEditorUpdate: any;
}

export interface IState {
    items: any;
    items2: any;
    isLoading: boolean;
    currentItemsHeight: number;
    currentItems2Height: number;
    error: any;
    hasMore: boolean;
    cursor: any;
    loaded: boolean;
    total: number;
}

const imgWidth = 162;

let getRem = (rem) => Array(rem).fill(0).map(i => {
    return {
        width: imgWidth,
        height: imgWidth,
        id: "sentinel-template",
    }
});


export default class SidebarTemplate extends Component<IProps, IState> {
    state = {
        isLoading: false,
        items: getRem(10),
        items2: [],
        currentItemsHeight: 0,
        currentItems2Height: 0,
        error: null,
        hasMore: true,
        cursor: null,
        loaded: false,
        total: 100,
    }

    constructor(props) {
        super(props);

        this.loadMore = this.loadMore.bind(this);
        this.templateOnMouseDown = this.templateOnMouseDown.bind(this);
    }

    componentDidMount() {
        if (this.props.selectedTab == SidebarTab.Template) {
            if (!this.state.loaded) {
                this.loadMore(true);
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.selectedTab == SidebarTab.Template) {
            if (!nextState.loaded) {
                this.loadMore(true);
            }
        }
        if (this.props.selectedTab != nextProps.selectedTab
            && (nextProps.selectedTab == SidebarTab.Template || this.props.selectedTab == SidebarTab.Template)
        ) {
            return true;
        }
        if (this.props.subtype != nextProps.subtype) {
            return true;
        }
        return false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.subtype != this.props.subtype) {
            this.loadMore.bind(this)(true);
        }
    }


    templateOnMouseDown(id, e) {

        e.preventDefault();

        var doc = this.state.items.find(doc => doc.id == id);
        if (!doc) {
            doc = this.state.items2.find(doc => doc.id == id);
        }

        editorStore.doNoObjectSelected();
        let ce = document.createElement.bind(document);
        let ca = document.createAttribute.bind(document);
        let ge = document.getElementsByTagName.bind(document);

        const { rectWidth, rectHeight } = this.props;

        let template = JSON.parse(doc.document);
        let scaleX = rectWidth / template.width;
        let scaleY = rectHeight / template.height;

        template.document_object = template.document_object.map(doc => {
            doc.width = doc.width * scaleX;
            doc.height = doc.height * scaleY;
            doc.top = doc.top * scaleY;
            doc.left = doc.left * scaleX;
            doc.scaleX = doc.scaleX * scaleX;
            doc.scaleY = doc.scaleY * scaleY;
            doc.page = editorStore.activePageId;
            doc.imgWidth = doc.imgWidth * scaleX;
            doc.imgHeight = doc.imgHeight * scaleY;

            return doc;
        });

        if (doc.fontList) {
            doc.fontList.forEach(id => {
                let style = `@font-face {
                        font-family: '${id}';
                        src: url('/fonts/${id}.ttf');
                    }`;
                let styleEle = ce("style");
                let type = ca("type");
                type.value = "text/css";
                styleEle.attributes.setNamedItem(type);
                styleEle.innerHTML = style;
                let head = document.head || ge("head")[0];
                head.appendChild(styleEle);

                let link = ce("link");
                link.id = id;
                link.rel = "preload";
                link.href = `/fonts/${id}.ttf`;
                link.media = "all";
                link.as = "font";
                link.crossOrigin = "anonymous";
                head.appendChild(link);
                return {
                    id: id
                };
            });
        }

        console.log('template.document_object', template.document_object)

        editorStore.applyTemplate(template.document_object);

        let fonts = toJS(editorStore.fonts);
        let tempFonts = [...fonts, ...doc.fontList];
        editorStore.fonts.replace(tempFonts);

        this.props.forceEditorUpdate();
    }

    loadMore = (initalLoad) => {
        let pageId;
        let count;
        if (initalLoad) {
            pageId = 1;
            count = 10;
        } else {
            pageId =
                Math.round(
                    (this.state.items.length + this.state.items2.length) / 5
                ) + 1;
            count = 5;
        }
        this.setState({ isLoading: true, error: undefined, loaded: true, });
        var subtype = this.props.subtype;
        const url = `/api/Template/Search?Type=${TemplateType.Template}&page=${pageId}&perPage=${count}&printType=${subtype}`;
        if (!subtype) {
            return;
        }

        fetch(url)
            .then(res => res.json())
            .then(
                res => {
                    var result = res.value.key;
                    
                    let items = this.state.items.filter(item => item.id != "sentinel-template");
                    items = [...items, ...result];
                    if (res.value.value > items.length) {
                        let left = Math.min(10, res.value.value - items.length);
                        items = [...items, ...getRem(left)];
                    }

                    this.setState(state => ({
                        items,
                        isLoading: false,
                        total: res.value.value,
                        hasMore:
                            res.value.value >
                            state.items.length +
                            // state.items2.length +
                            res.value.key.length
                    }));

                    this.forceUpdate();
                },
                error => {
                    // this.setState({ isLoading: false, error })
                }
            );
    };

    render() {

        let left = this.state.total - this.state.items.length - this.state.items2.length;
        let t = Math.min(5, Math.round((left - 1) / 2));

        return (
            <div
                style={{
                    opacity: editorStore.selectedTab === SidebarTab.Template ? 1 : 0,
                    position: "absolute",
                    width: "347px",
                    transition:
                        "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                    transform:
                        editorStore.selectedTab !== SidebarTab.Template &&
                        `translate3d(0px, calc(${editorStore.selectedTab < SidebarTab.Template ? 40 : -40
                        }px), 0px)`,
                    top: "10px",
                    zIndex: editorStore.selectedTab !== SidebarTab.Template && -1,
                    height: "100%",
                    left: '19px',
                }}
            >
                <InfiniteScroll
                    scroll={true}
                    throttle={500}
                    threshold={300}
                    isLoading={this.state.isLoading}
                    hasMore={this.state.hasMore}
                    onLoadMore={this.loadMore.bind(this, false)}
                    marginTop={45}
                    refId="sentinel-template"
                >
                    <div
                        id="image-container-picker"
                        style={{ display: "flex", padding: "16px 0px 10px 0px" }}
                    >
                        <div
                            style={{
                                width: "350px",
                            }}
                        >
                            {this.state.items.map((item, key) =>
                                item.isVideo ? (
                                    <VideoPicker
                                        id=""
                                        defaultHeight={imgWidth / editorStore.templateRatio}
                                        delay={0}
                                        width={imgWidth}
                                        key={key}
                                        color={item.color}
                                        src={item.videoRepresentative}
                                        height={imgWidth / (item.width / item.height)}
                                        className="template-picker"
                                        onPick={this.templateOnMouseDown.bind(this, item.id)}
                                        onEdit={() => {
                                            window.open(`/editor/template/${item.id}`);
                                        }}
                                        showButton={true}
                                    />
                                ) : (
                                        <ImagePicker
                                            id=""
                                            defaultHeight={imgWidth / editorStore.templateRatio}
                                            delay={150 * key}
                                            width={imgWidth}
                                            key={key}
                                            color={item.color}
                                            src={item.representative}
                                            height={imgWidth / (item.width / item.height)}
                                            className="template-picker"
                                            onPick={this.templateOnMouseDown.bind(this, item.id)}
                                            onEdit={() => {
                                                window.open(`/editor/template/${item.id}`);
                                            }}
                                            showButton={true}
                                        />
                                    )
                            )}
                        </div>
                    </div>
                </InfiniteScroll>
                <input
                    style={{
                        zIndex: 11,
                        width: "calc(100% - 13px)",
                        marginBottom: "8px",
                        border: "none",
                        height: "37px",
                        borderRadius: "3px",
                        padding: "5px",
                        fontSize: "13px",
                        boxShadow:
                            "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
                        position: "absolute",
                        top: "6px"
                    }}
                    // onKeyDown={this.handleQuery}
                    type="text"
                    onChange={e => {
                        // this.setState({ query: e.target.value });
                    }}
                // value={this.state.query}
                />
            </div>
        )
    }
}