import React, { Component } from 'react'
import { SidebarTab, TemplateType, } from "./enums";
import InfiniteXScroll from "@Components/shared/InfiniteXScroll";
import styled from "styled-components";
import ImagePicker from "@Components/shared/ImagePicker";
import GridPicker from '@Components/shared/GridPicker';

export interface IProps {
    term: string;
    selectedTab: SidebarTab;
    handleQuery: any;
    frameOnMouseDownload: any;
    imgOnMouseDown: any;
    gradientOnMouseDown: any;
    elements: any;
}

export interface IState {

}

const imgWidth = 80;

let getRem = (rem) => Array(rem).fill(0).map(i => {
    return {
        width: imgWidth,
        height: imgWidth,
        id: "sentinel-element",
    }
});

export default class SidebarEffect extends Component<IProps, IState> {

    elements = [];
    left = 5;
    loaded = false;

    constructor(props) {
        super(props);

        this.elements = getRem(this.left);

        this.state = {};

        this.getTextWidth = this.getTextWidth.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.elements.length > 0) {
            this.elements = nextProps.elements;
            this.loaded = true;
            return true;
        }

        if (this.props.selectedTab != nextProps.selectedTab
            && (nextProps.selectedTab == SidebarTab.Element || this.props.selectedTab == SidebarTab.Element)
        ) {
            // this.loadMore(true, nextProps.term)
            return true;
        }

        return false;
    }

    loadMore = (initialload, term) => {
        let pageId;
        let count;
        if (initialload) {
            pageId = 1;
            count = 30;
        };
        this.setState({ isLoading: true, error: undefined });
        const url = `/api/Media/Search?type=${TemplateType.Element}&page=${pageId}&perPage=${count}&terms=${term}`;
        fetch(url)
            .then(res => res.json())
            .then(
                res => {
                    var result = res.value.key;
                    if (initialload) {
                        this.elements = result;
                    }

                    this.forceUpdate();
                },
                error => {
                    this.setState({ isLoading: false, error });
                }
            );
    };

    canvas = null;

    getTextWidth(text, font) {
        // re-use canvas object for better performance
        var canvas = this.canvas || (this.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    }

    render() {
        console.log('this.elements ', this.elements)
        let width = this.getTextWidth(this.props.term, "bold 16pt arial");
        return (
            <Catalog>
                {this.loaded ? 
                <p
                    style={{
                        marginTop: "10px",
                        marginBottom: "8px",
                        display: "inline-block",
                    }}
                >{this.props.term}</p> : 
                <p
                    style={{
                        height: "22.73px",
                        marginTop: "10px",
                        marginBottom: "8px",
                        display: "inline-block",
                        opacity: 0.07,
                        animation: '1.4s ease 0ms infinite normal none running LuuT-RWT7fXcJFhRfuaKV',
                        backgroundColor: 'rgb(255, 255, 255)',
                        animationDelay: '0.2s',
                        borderRadius: "10px",
                    }}
                >{this.props.term}</p>}
                {this.loaded && <button
                    onClick={e => {
                        this.setState({ query: this.props.term });
                        let el = document.getElementById("queryInput") as HTMLInputElement;
                        if (el) el.value = this.props.term;
                        this.props.handleQuery(this.props.term);
                    }}
                    style={{
                        float: 'right',
                        marginTop: '14px',
                        border: 'none',
                        marginRight: '12px',
                        color: '#ccc',
                        fontSize: '13px',
                    }}
                >See all</button>}
                <div
                    style={{
                        display: "flex",
                        margin: "0px 0px",
                    }}
                >
                    <div
                        style={{
                            width: "340px",
                            height: "83px",
                            position: 'relative',
                            margin: "0px 10px 0px 0px",
                        }}
                    >
                        <InfiniteXScroll
                            scroll={true}
                            throttle={1000}
                            threshold={300}
                            isLoading={false}
                            hasMore={false}
                            onLoadMore={this.loadMore.bind(this, false)}
                            refId="sentinel-image2"
                            marginTop={45}
                            buttonSize={30}
                            buttonColor="transparent"
                            buttonHeight="100%"
                            svgColor="white"
                            hideBackgroundBefore={false}
                            hover={false}
                            height="100%"
                            svgMargin={true}
                        >
                            {this.elements && this.elements.map((item, key) => {
                                let width = 80;
                                let height = 80 / (item.width / item.height);
                                if (height > 80) {
                                    height = 80;
                                    width = 80 * (item.width / item.height);
                                }

                                if (item.keywords && item.keywords[0] == "Grids") {
                                    try {
                                        item.grids = JSON.parse(item.grids);
                                        console.log('alo', item.type)
                                    } catch (e) {
                                        console.log(e);
                                    }
                                }

                                return <ImageContainer
                                    onMouseDown={e => {
                                        e.preventDefault();
                                        let el = e.currentTarget.getElementsByTagName("img")[0];
                                        if (item.ext == "svg")
                                            this.props.gradientOnMouseDown(item, el, e);
                                        if (item.keywords && item.keywords[0] == "Grids") {
                                            el = e.currentTarget;
                                            this.props.imgOnMouseDown(item, el, e);
                                        }
                                        else 
                                            this.props.imgOnMouseDown(item, el, e);
                                    }}
                                >
                                    {(item.keywords && item.keywords[0] == "Grids") ?
                                    <GridPicker
                                    id={item.id}
                                    key={this.prefix + key}
                                    color={item.color}
                                    src={item.representative && item.representative.endsWith("gif") ? item.representative : item.representativeThumbnail}
                                    height={height}
                                    defaultHeight={imgWidth}
                                    width={width}
                                    onPick={null}
                                    onEdit={null}
                                    delay={250 * key}
                                    showButton={true}
                                    backgroundColorLoaded="transparent"
                                    marginRight={0}
                                    marginAuto={true}
                                    item={item}
                                />
                                    :
                                    <ImagePicker
                                        id={item.id}
                                        key={key + "1"}
                                        color={item.color}
                                        src={item.representative && item.representative.endsWith("gif") ? item.representative : item.representativeThumbnail}
                                        height={height}
                                        defaultHeight={imgWidth}
                                        width={width}
                                        onPick={null}
                                        onEdit={null}
                                        delay={250 * key}
                                        showButton={true}
                                        backgroundColorLoaded="transparent"
                                        marginRight={0}
                                        marginAuto={true}
                                    />}
                                </ImageContainer>
                            }
                            )}
                            <div
                                style={{
                                    height: '100%',
                                    display: 'flex',
                                    width: '80px',
                                }}
                            >
                            <SeeAllButton
                                onClick={e => {
                                    this.setState({ query: this.props.term });
                                    let el = document.getElementById("queryInput") as HTMLInputElement;
                                    if (el) el.value = this.props.term;
                                    this.props.handleQuery(this.props.term);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M17.1 13.004H5.504a.75.75 0 0 1 0-1.5H17.1l-4.377-4.377a.75.75 0 0 1 1.061-1.06l4.95 4.95a1.75 1.75 0 0 1 0 2.474l-4.95 4.95a.75.75 0 1 1-1.06-1.06l4.376-4.377z" fill="currentColor"></path></svg>
                            </SeeAllButton>
                            </div>
                        </InfiniteXScroll>
                    </div>
                </div>
            </Catalog>
        )
    }
}

const Catalog = styled.div`
    margin-bottom: 15px;
    p {
        font-family: AvenirNextRoundedPro-Medium;
        font-weight: 600;
        font-size: 16px;
    }
`;

const ImageContainer = styled.div`
    display: inline-flex;
    height: 80px;
    width: 80px;
    justify-content: center;
    margin-right: 10px;
    position: relative;
    cursor: pointer;
    user-select: none;
`;

const SeeAllButton = styled.button`
    float: right;
    color: #ccc;
    font-size: 13px;
    height: 38px;
    border: 1px solid hsla(0,0%,100%,.15);
    border-radius: 50%;
    margin: auto;

    :hover {
        border-color: white;
    }
`;