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

const TEMPLATE_PERPAGE = 10;
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

    constructor(props: any) {
        super(props);

        if (!isNode()) {
            this.perPage = Math.floor((window.innerWidth - 200) / 141) + 1;
        }

        this.state.rem = this.perPage;
        this.state.recentDesign = getRem(this.perPage);

        this.loadImage = this.loadImage.bind(this);
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
        const url = `/api/Template/Search?Type=1&page=${(this.state.recentDesign.length - this.state.rem) / this.perPage + 1}&perPage=${this.perPage}&printType=${this.props.type}`;
        //https://localhost:64099/api/Template/Search?Type=1&page=1&perPage=10&printType=10
        axios
            .get(url)
            .then(res => {
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
                    rem = Math.min(res.data.value.value - newRecentDesign.length, 10);
                    newRecentDesign = [...newRecentDesign, ...getRem(rem)];
                }

                this.setState({
                    recentDesign: newRecentDesign,
                    hasMore,
                    rem,
                    startPoint,
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
                break;
            case 7:
                rectWidth = 1920;
                rectHeight = 1080;
                width = (screen.width - 200) / 2 - 200;
                break;
            case 8:
                rectWidth = 940;
                rectHeight = 788;
                break;
            case 9:
                rectWidth = 1080;
                rectHeight = 1080;
                break;
            case 10:
                rectWidth = 2480;
                rectHeight = 3508;
                break;
            case 11: // Menu
                rectWidth = 794;
                rectHeight = 1123;
                break;
        }

        let height = width / (rectWidth / rectHeight);

        console.log('width ', width)

        return (
            <div
                style={{
                    padding: "20px 100px",
                    display: this.state.mounted ? "block" : "none",
                }}
            >
                <div>
                    <div>
                        <div style={{ position: 'relative' }}>
                            <InfiniteScroll
                                scroll={true}
                                throttle={1000}
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
                                        key={0}
                                        keys={0}
                                        loadImage={this.loadImage}
                                        startPoint={this.state.startPoint}/>
                                    <Item
                                        itemWidth={width}
                                        itemHeight={0}
                                        prefix={3}
                                        key={0}
                                        keys={0}
                                        loadImage={this.loadImage}
                                        startPoint={this.state.startPoint}/>
                                    <Item
                                        itemWidth={width}
                                        itemHeight={0}
                                        prefix={3}
                                        key={0}
                                        keys={0}
                                        loadImage={this.loadImage}
                                        startPoint={this.state.startPoint}/>
                                    <Item
                                        itemWidth={width}
                                        itemHeight={0}
                                        prefix={3}
                                        key={0}
                                        keys={0}
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
