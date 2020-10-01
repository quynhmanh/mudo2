import React, { Component } from 'react'
import { SidebarTab, TemplateType, SavingState, } from "./enums";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import InfiniteXScroll from "@Components/shared/InfiniteXScroll";
import styled from "styled-components";
import ImagePicker from "@Components/shared/ImagePicker";

export interface IProps {
    term: string;
    selectedTab: SidebarTab;
    handleQuery: any;
    frameOnMouseDownload: any;
    imgOnMouseDown: any;
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

    constructor(props) {
        super(props);

        this.elements = getRem(this.left);

        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('nextProps.elements ', nextProps.elements)
        if (nextProps.elements.length > 0) {
            this.elements = nextProps.elements;
            console.log('this.elements ', this.elements)
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
        console.log('loadmore ', url)
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

    render() {
        return (
            <Catalog>
                <p
                    style={{
                        marginTop: "10px",
                        display: "inline-block",
                    }}
                >{this.props.term}</p>
                <button
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
                >See all</button>
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
                                return <ImageContainer
                                    onMouseDown={e => {
                                        e.preventDefault();
                                        let el = e.currentTarget.getElementsByTagName("img")[0];
                                        this.props.imgOnMouseDown(item, el, e);
                                    }}
                                >
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
                                    />
                                </ImageContainer>
                            }
                            )}
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
        font-family: AvenirNextRoundedPro-Bold;
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