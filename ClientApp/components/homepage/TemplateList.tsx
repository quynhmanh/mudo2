import React, { Component } from 'react';
import uuidv4 from "uuid/v4";
import axios from "axios";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import Item from "@Components/homepage/TemplateItem";
import { isNode } from '@Utils';

export interface IProps {
    translate: any;
    type: any;
}

interface IState {
    hasMore: boolean;
    yLocation: number;
    showLeft: boolean;
    mounted: boolean;
    recentDesign: any;
    rem: number;
    startPoint: number;
}

const WIDTH = 200;

let getRem = (rem) => Array(rem).fill(0).map(i => {
    return {
        width: WIDTH,
        height: WIDTH,
        id: "sentinel-image2",
        videoRepresentative: "",
    }
});

export default class TemplateList extends Component<IProps, IState> {
    state = {
        rem: 10,
        hasMore: true,
        yLocation: 0,
        showLeft: true,
        mounted: true,
        recentDesign: getRem(10),
        startPoint: 0,
    }

    perPage = 0;
    width = 0;
    height = 0;

    constructor(props: any) {
        super(props);

        if (!isNode()) {
            this.perPage = 15;
        }

        this.state.rem = this.perPage;
        this.state.recentDesign = getRem(this.perPage);

        this.loadImage = this.loadImage.bind(this);

        let innerWidth = window.innerWidth - 116;
        console.log('innerWidth ', innerWidth)

        if (props.type == 7 || props.type == 9 || props.type == 15 || props.type == 16) {
            this.width = Math.max(innerWidth / 6, 216);
        }

        if (props.type == 16) {
            this.width = innerWidth / 3 - 30;
        }

        if (props.type == 18) {
            this.width = innerWidth / 3 - 30;
        }

        let width = 200;
        let rectWidth, rectHeight;

        switch (this.props.type) {
            case 0:
                rectWidth = 642;
                rectHeight = 378;
                break;
            case 1:
                rectWidth = 1587.402;
                rectHeight = 2245.04;
                break;
            case 2:
                rectWidth = 2245.04;
                rectHeight = 1587.402;
                break;
            case 3:
                rectWidth = 3174.8;
                rectHeight = 4490.08;
                break;
            case 4:
                rectWidth = 500;
                rectHeight = 500;
                break;
            case 5:
                rectWidth = 794;
                rectHeight = 1134;
                break;
            case 6:
                rectWidth = 1024;
                rectHeight = 1024;
                this.perPage = Math.floor(innerWidth / 216) * 3;
                break;
            case 7:
                rectWidth = 1920;
                rectHeight = 1080;
                width = this.width;
                break;
            case 8:
                rectWidth = 940;
                rectHeight = 788;
                break;
            case 9:
                rectWidth = 1080;
                rectHeight = 1080;
                width = this.width;
                break;
            case 10:
                rectWidth = 2480;
                rectHeight = 3508;
                break;
            case 11: // Menu
                rectWidth = 794;
                rectHeight = 1123;
                break;
            case 12: // Instagram Story
                rectHeight = 1920;
                rectWidth = 1080;
                break;
            case 13: // Instagram Story
                rectHeight = 320;
                rectWidth = 320;
                break;
            case 14: // Instagram Post
                rectWidth = 1080;
                rectHeight = 1080;
                break;
            case 15: // Business Card
                rectWidth = 1050;
                rectHeight = 600;
                width = this.width;
                break;
            case 16: // Facebook Cover
                rectWidth = 851;
                rectHeight = 315;
                width = this.width;
                break;
            case 17: // Facebook Post
                rectWidth = 940;
                rectHeight = 788;
                break;
            case 18: // Facebook ad
                rectWidth = 1200;
                rectHeight = 628;
                width = this.width;
                break;
        }

        let height = width / (rectWidth / rectHeight);

        this.width = width;
        this.height = height;
    }

    loadImage(counter) {
        let self = this;
        let newRecentDesign = this.state.recentDesign;
        // Break out if no more images
        if (counter==newRecentDesign.length) { return; }
        
        if (newRecentDesign[counter].isVideo) {
        // Grab an image obj
            var I = document.getElementById("video-"+counter);
        } else {
            var I = document.getElementById("image-3-"+counter);
        }
        
        if (newRecentDesign[counter].isVideo) {
            // // Monitor load or error events, moving on to next image in either case
            // I.onloadeddata = I.onerror = function() { 
            //     setTimeout(() => {
            //         self.loadImage(counter+1); 
            //     }, 100);
            // }
        } else {
            // I.onload = I.onerror = function() { 
            //     setTimeout(() => {
            //         self.loadImage(counter+1); 
            //     }, 100);
            // }
        }
        
        
        //Change source (then wait for event)
        if (newRecentDesign[counter].isVideo) {
            I.src = newRecentDesign[counter].videoRepresentative;
        } else {
            I.src = newRecentDesign[counter].representative;
        }
    }

    loadMore = () => {
        const page = Math.floor((this.state.recentDesign.length - this.state.rem) / this.perPage) + 1;
        const url = `/api/Template/Search?Type=1&page=${page}&perPage=${this.perPage}&printType=${this.props.type}`;
        axios
            .get(url)
            .then(res => {
                console.log('res.data.value.key ', res.data.value.key)
                let recentDesign = res.data.value.key.map(design => {
                    design.href = `/editor/design/${uuidv4()}/${design.id}`;
                    return design;
                });
                let newRecentDesign = this.state.recentDesign.filter(doc => doc.id != "sentinel-image2");
                const startPoint = newRecentDesign.length;
                newRecentDesign = [...newRecentDesign, ...recentDesign];
                let hasMore = newRecentDesign.length < res.data.value.value;
                let rem = 10;
                if (hasMore) {
                    rem = Math.min(res.data.value.value - newRecentDesign.length, this.perPage);
                    newRecentDesign = [...newRecentDesign, ...getRem(rem)];
                }

                this.setState({
                    recentDesign: newRecentDesign,
                    hasMore,
                    startPoint,
                    rem,
                });

            })
            .catch(error => {
                // Ui.showErrors(error.response.statusText)
            });
    }

    componentDidMount() {
        this.loadMore();
    }

    handleScroll = () => {
        this.setState({ yLocation: this.test.scrollLeft });

        if (this.test.offsetWidth + this.test.scrollLeft >= this.test.scrollWidth) {
            this.setState({ showLeft: false, });
        } else {
            this.setState({ showLeft: true, });
        }
    }

    test = null;

    render() {

        let width = this.width;
        let height = this.height;

        return (
            <div
                style={{
                    padding: "20px 0px",
                    display: this.state.mounted ? "block" : "none",
                }}
            >
                <div>
                    <div>
                        <div style={{ position: 'relative' }}>
                            <InfiniteScroll
                                scroll={true}
                                throttle={200}
                                threshold={300}
                                isLoading={false}
                                hasMore={this.state.hasMore}
                                onLoadMore={this.loadMore.bind(this, false)}
                                refId="sentinel-image2"
                                marginTop={10}
                            >
                                <div
                                    id="templateList___2swQr"
                                    style={{
                                        listStyle: 'none',
                                        padding: 0,
                                        position: 'relative',
                                        zIndex: 1,
                                        display: 'flex',
                                        marginTop: '1px',
                                        transition: '.5s cubic-bezier(.68,-.55,.265,1.55)',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-between',
                                    }}
                                    className="templateList___2swQr"
                                >
                                    {this.state.recentDesign.map((item, index) =>
                                        <Item
                                            itemWidth={width}
                                            itemHeight={height}
                                            prefix={3}
                                            {...item}
                                            key={index}
                                            keys={index}
                                            loadImage={this.loadImage}
                                            startPoint={this.state.startPoint}
                                        />)}
                                    <Item
                                        itemWidth={width}
                                        itemHeight={0}
                                        prefix={3}
                                        keys={this.state.recentDesign.length}
                                        loadImage={this.loadImage}
                                        startPoint={this.state.startPoint}/>
                                    <Item
                                        itemWidth={width}
                                        itemHeight={0}
                                        prefix={3}
                                        keys={this.state.recentDesign.length + 1}
                                        loadImage={this.loadImage}
                                        startPoint={this.state.startPoint}/>
                                    <Item
                                        itemWidth={width}
                                        itemHeight={0}
                                        prefix={3}
                                        keys={this.state.recentDesign.length + 2}
                                        loadImage={this.loadImage}
                                        startPoint={this.state.startPoint}/>
                                    <Item
                                        itemWidth={width}
                                        itemHeight={0}
                                        prefix={3}
                                        keys={this.state.recentDesign.length + 3}
                                        loadImage={this.loadImage}
                                        startPoint={this.state.startPoint}/>
                                </div>
                            </InfiniteScroll>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
