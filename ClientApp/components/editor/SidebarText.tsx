import React, { Component } from 'react'
import { SidebarTab, TemplateType, SavingState, } from "./enums";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import ImagePicker from "@Components/shared/ImagePicker";
import { toJS } from "mobx";
import Sidebar from "@Components/editor/SidebarStyled";

export interface IProps {
    translate: any;
    selectedTab: any;
    handleEditmedia: any;
    handleImageSelected: any;
    scale: number;
    setSavingState: any;
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
    total: number;
    loaded: boolean;
}

const imgWidth = 162;

export default class SidebarText extends Component<IProps, IState> {
    state = {
        total: 0,
        isLoading: false,
        items: [],
        items2: [],
        currentItemsHeight: 0,
        currentItems2Height: 0,
        error: null,
        hasMore: true,
        cursor: null,
        loaded: false,
    }

    constructor(props) {
        super(props);

        this.loadMore = this.loadMore.bind(this);
    }

    componentDidMount() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.selectedTab == SidebarTab.Text) {
            if (!nextState.loaded) {
                this.loadMore(true);
            }
        }
        if (this.props.selectedTab != nextProps.selectedTab
            && (nextProps.selectedTab == SidebarTab.Text || this.props.selectedTab == SidebarTab.Text)
        ) {
            return true;
        }
        return false;
    }



    addText = (text, fontSize, fontId, fontFace, fontText, width, height) => {
        var item = {
            _id: uuidv4(),
            type: TemplateType.Heading,
            align: "alignLeft",
            width: width,
            origin_width: width,
            height: height * 1,
            origin_height: height,
            left: 0,
            top: 0,
            rotateAngle: 0.0,
            innerHTML: `<div class="font" style="font-size: ${fontSize}px;">${text}</div>`,
            scaleX: 1,
            scaleY: 1,
            ref: editorStore.idObjectSelected,
            page: editorStore.activePageId,
            zIndex: editorStore.upperZIndex + 1,
            color: "black",
            fontSize: fontSize,
            fontText,
            hovered: true,
            selected: true,
            fontFace: fontFace,
            fontId: fontFace,
            effectId: 8,
            lineHeight: 1.4,
            letterSpacing: 30,
            opacity: 100,
        };

        editorStore.addItem2(item, true);
        this.props.handleImageSelected(item._id, editorStore.activePageId, null, true);

        let index = editorStore.pages.findIndex(pageId => pageId == editorStore.activePageId);
        editorStore.keys[index] = editorStore.keys[index] + 1;

        setTimeout(() => {
            let el = document.getElementById(item._id + "hihi4alo");
            let range = document.createRange();
            range.selectNodeContents(el)
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }, 100);

        editorStore.increaseUpperzIndex();
        this.props.setSavingState(SavingState.UnsavedChanges, true);
    }


    loadMore = initalLoad => {

        let pageId;
        let count;
        if (initalLoad) {
            pageId = 1;
            count = 10;
        } else {
            pageId =
                (this.state.items.length + this.state.items2.length) / 10 + 1;
            count = 10;
        }
        this.setState({ isLoading: true, error: undefined, loaded: true, });
        const url = `/api/Template/Search?Type=${TemplateType.TextTemplate}&page=${pageId}&perPage=${count}`;
        fetch(url)
            .then(res => res.json())
            .then(
                res => {
                    var result = res.value.key;
                    var currentItemsHeight = this.state.currentItemsHeight;
                    var currentItems2Height = this.state
                        .currentItems2Height;
                    var res1 = [];
                    var res2 = [];
                    for (var i = 0; i < result.length; ++i) {
                        var currentItem = result[i];

                        if (currentItemsHeight <= currentItems2Height) {
                            res1.push(currentItem);
                            currentItemsHeight +=
                                imgWidth / (currentItem.width / currentItem.height);
                        } else {
                            res2.push(currentItem);
                            currentItems2Height +=
                                imgWidth / (currentItem.width / currentItem.height);
                        }
                    }
                    this.setState(state => ({
                        items: [...state.items, ...res1],
                        items2: [...state.items2, ...res2],
                        currentItemsHeight,
                        currentItems2Height,
                        isLoading: false,
                        total: res.value.value,
                        hasMore:
                            res.value.value >
                            state.items.length +
                            state.items2.length +
                            res.value.key.length
                    }));

                    this.forceUpdate();
                },
                error => {
                    this.setState({ isLoading: false, error });
                }
            );
    };


    textOnMouseDown = (id, e) => {
        var doc = this.state.items.find(doc => doc.id == id);
        if (!doc) {
            doc = this.state.items2.find(doc => doc.id == id);
        }

        let scale = this.props.scale;
        let ce = document.createElement.bind(document);
        let ca = document.createAttribute.bind(document);
        let ge = document.getElementsByTagName.bind(document);

        e.preventDefault();
        let target = e.target.cloneNode(true);
        target.style.zIndex = "11111111111";
        target.style.width = e.target.getBoundingClientRect().width + "px";
        document.body.appendChild(target);
        let imgDragging = target;
        let posX = e.pageX - e.target.getBoundingClientRect().left;
        let dragging = true;
        let posY = e.pageY - e.target.getBoundingClientRect().top;
        let image = e.target;

        const onMove = e => {
            image.style.opacity = 0;
            image.parentNode.style.opacity = 0;
            if (dragging) {
                target.style.left = e.pageX - posX + "px";
                target.style.top = e.pageY - posY + "px";
                target.style.position = "absolute";
            }
        };

        const onUp = e => {
            dragging = false;
            let recs = document.getElementsByClassName("alo");
            let rec2 = imgDragging.getBoundingClientRect();
            for (let i = 0; i < recs.length; ++i) {
                let rec = recs[i].getBoundingClientRect();
                let rec3 = recs[i];
                if (
                    rec.left < e.pageX &&
                    e.pageX < rec.left + rec.width &&
                    rec.top < e.pageY &&
                    e.pageY < rec.top + rec.height
                ) {
                    let rectTop = rec.top;
                    let index = i;
                    let document2 = JSON.parse(doc.document);
                    document2._id = uuidv4();
                    document2.page = editorStore.pages[index];
                    document2.zIndex = editorStore.upperZIndex + 1;
                    document2.width = rec2.width / scale;
                    document2.height = rec2.height / scale;
                    document2.scaleX = document2.width / document2.origin_width;
                    document2.scaleY = document2.height / document2.origin_height;
                    document2.left = (rec2.left - rec.left) / scale;
                    document2.top = (rec2.top - rectTop) / scale;
                    document2.selected = true;
                    document2.rotateAngle = 0;

                    document2.document_object = document2.document_object.map(doc => {
                        doc.width = (document2.width * doc.width2) / document2.scaleX / doc.scaleX;
                        return doc;
                    })

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


                    this.props.setSavingState(SavingState.UnsavedChanges, true);
                    editorStore.addItem2(document2, false);

                    this.props.handleImageSelected(document2._id, document2.page, false, true, false);

                    let index2 = editorStore.pages.findIndex(pageId => pageId == document2.page);
                    editorStore.keys[index2] = editorStore.keys[index2] + 1;

                    let fonts = toJS(editorStore.fonts);
                    let tempFonts = [...fonts, ...doc.fontList];
                    editorStore.fonts.replace(tempFonts);

                    editorStore.increaseUpperzIndex();

                    this.forceUpdate();

                }

                imgDragging.remove();

                image.style.opacity = 1;
                image.parentNode.style.opacity = 1;
            }

            target.remove();
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    }


    render() {

        let left = this.state.total - this.state.items.length - this.state.items2.length;
        let t = Math.round(Math.min(left / 2, 5));

        if (!this.state.loaded) {
            t = 3;
            left = 6;
        }

        return (
            <Sidebar
                selectedTab={editorStore.selectedTab}
                sidebar={SidebarTab.Text}
            >
                <div 
                    style={{ 
                        color: "white", 
                        height: "100%",
                        userSelect: "none",
                    }}>
                    <InfiniteScroll
                        scroll={true}
                        throttle={200}
                        threshold={300}
                        isLoading={this.state.isLoading}
                        hasMore={this.state.hasMore}
                        onLoadMore={this.loadMore.bind(this, false)}
                        refId="sentinel-texttemplate"
                        marginTop={0}
                    >
                        {editorStore.tReady &&
                            <div style={{ marginBottom: "10px" }}>
                                <p>
                                    {this.props.translate("clickTextToAddToPage")}
                                </p>
                                <div
                                    className="add-heading-btn"
                                    style={{
                                        fontSize: "28px",
                                        cursor: "pointer",
                                        background: "hsla(0,0%,100%,.07)",
                                        borderRadius: "4px",
                                        padding: "10px",
                                        width: "334px",
                                        fontFamily: "Open-Sans-Extra-Bold",
                                    }}
                                    onMouseDown={e => {
                                        e.preventDefault();
                                        const text = this.props.translate("addAHeading");
                                        this.addText(text, 56, 'Open-Sans-Extra-Bold', 'Open-Sans-Extra-Bold', "Open Sans Extra Bold", 500, 78);
                                    }}
                                >
                                    {/* Thêm tiêu đề */}
                                    {this.props.translate("addAHeading")}
                                </div>
                                <div
                                    className="add-heading-btn"
                                    style={{
                                        fontSize: "22px",
                                        cursor: "pointer",
                                        marginTop: "10px",
                                        background: "hsla(0,0%,100%,.07)",
                                        borderRadius: "4px",
                                        padding: "10px",
                                        width: "334px",
                                        fontFamily: "Open-Sans-Regular",
                                    }}
                                    onMouseDown={e => {
                                        e.preventDefault();
                                        const text = this.props.translate("addASubHeading");
                                        this.addText(text, 32, "Open-Sans-Regular", "Open-Sans-Regular", "Open Sans Regular", 300, 44);
                                    }}
                                >
                                    {this.props.translate("addASubHeading")}
                                </div>
                                <div
                                    className="add-heading-btn"
                                    style={{
                                        fontSize: "16px",
                                        cursor: "pointer",
                                        marginTop: "10px",
                                        marginBottom: "18px",
                                        background: "hsla(0,0%,100%,.07)",
                                        borderRadius: "4px",
                                        padding: "10px",
                                        width: "334px",
                                        fontFamily: "Open-Sans-Light",
                                    }}
                                    onMouseDown={e => {
                                        e.preventDefault();
                                        const text = this.props.translate("addABodyText");
                                        this.addText(text, 22, "Open-Sans-Light", "Open-Sans-Light", "Open Sans Light", 300, 30);
                                    }}
                                >
                                    {this.props.translate("addABodyText")}
                                </div>
                            </div>
                        }
                        <div
                            id="image-container-picker"
                            style={{
                                display: "flex",
                                padding: "0px 13px 10px 0px"
                            }}
                        >
                            <div
                                style={{
                                    width: "350px",
                                }}
                            >
                                {this.state.items.map((item, key) => (
                                    <ImagePicker
                                        id=""
                                        key={key}
                                        color={item.color}
                                        src={item.representative}
                                        height={imgWidth / (item.width / item.height)}
                                        defaultHeight={imgWidth}
                                        width={imgWidth}
                                        delay={0}
                                        classNameContainer="text-picker-container"
                                        onPick={this.textOnMouseDown.bind(this, item.id)}
                                        onEdit={() => {
                                            window.open(`/editor/template/${item.id}`);
                                        }}
                                        padding={10}
                                        showButton={true}
                                    />
                                ))}
                                {left > 0 && this.state.hasMore &&
                                    Array(t)
                                        .fill(0)
                                        .map((item, i) => (
                                            <ImagePicker
                                                padding={10}
                                                key={i}
                                                id="sentinel-texttemplate"
                                                color="black"
                                                src={""}
                                                height={imgWidth}
                                                width={imgWidth}
                                                defaultHeight={imgWidth}
                                                onPick={null}
                                                onEdit={this.props.handleEditmedia.bind(this, null)}
                                                delay={0}
                                                showButton={false}
                                            />
                                        ))}
                            </div>
                            <div
                                style={{
                                    width: "350px"
                                }}
                            >
                                {this.state.items2.map((item, key) => (
                                    <ImagePicker
                                        id=""
                                        defaultHeight={imgWidth}
                                        delay={0}
                                        width={imgWidth}
                                        key={key}
                                        color={item.color}
                                        classNameContainer="text-picker-container"
                                        height={imgWidth / (item.width / item.height)}
                                        src={item.representative}
                                        onPick={this.textOnMouseDown.bind(this, item.id)}
                                        onEdit={() => {
                                            window.open(`/editor/template/${item.id}`);
                                        }}
                                        padding={10}
                                        showButton={true}
                                    />
                                ))}
                                {left > 0 && this.state.hasMore &&
                                    Array(t)
                                        .fill(0)
                                        .map((item, i) => (
                                            <ImagePicker
                                                key={i}
                                                id="sentinel-texttemplate"
                                                color="black"
                                                src={""}
                                                height={imgWidth}
                                                width={imgWidth}
                                                defaultHeight={imgWidth}
                                                onPick={null}
                                                onEdit={this.props.handleEditmedia.bind(this, null)}
                                                delay={150}
                                                showButton={false}
                                            />
                                        ))}
                            </div>
                        </div>
                    </InfiniteScroll>
                </div>
            </Sidebar>
        )
    }
}