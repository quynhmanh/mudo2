import React, { Component } from 'react';
import uuidv4 from "uuid/v4";
import axios from "axios";
import InfiniteXScroll from "@Components/shared/InfiniteXScroll";
import Item from "@Components/homepage/PopularTemplateItem3";

export interface IProps {
    translate: any;
    printType: number;
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

export default class PopularTemplate3 extends Component<IProps, IState> {
    state = {
        rem: 10,
        hasMore: true,
        yLocation: 0,
        showLeft: true,
        mounted: true,
        recentDesign: [],
        startPoint: 0,
    }

    perPage = 0;

    constructor(props: any) {
        super(props);

        if (window)
            this.perPage = Math.floor((window.innerWidth - 200) / 141) + 1;

        this.state.rem = this.perPage;
        this.state.recentDesign = this.getRem(this.perPage);

        this.loadImage = this.loadImage.bind(this);
    }

    getRem = (rem) => Array(rem).fill(0).map(i => {
        return {
            width: WIDTH,
            height: WIDTH,
            id: "sentinel-image" + this.props.printType,
            videoRepresentative: "",
        }
    });

    loadImage(counter) {
        let self = this;
        let newRecentDesign = this.state.recentDesign;
        // Break out if no more images
        if (counter==newRecentDesign.length) { return; }
        
        if (newRecentDesign[counter].isVideo) {
        // Grab an image obj
            var I = document.getElementById(`video-3${this.props.printType}-`+counter);
        } else {
            var I = document.getElementById(`image-3${this.props.printType}-`+counter);
        }
        
        //Change source (then wait for event)
        if (newRecentDesign[counter].isVideo) {
            I.src = newRecentDesign[counter].videoRepresentative;
        } else {
            I.src = newRecentDesign[counter].representative;
        }
    }

    loadMore = () => {
        const url = `/api/Template/Search?Type=1&page=${(this.state.recentDesign.length - this.state.rem) / this.perPage + 1}&perPage=${this.perPage}&printType=${this.props.printType}`;
        //https://localhost:64099/api/Template/Search?Type=1&page=1&perPage=10&printType=10
        axios
            .get(url)
            .then(res => {
                let recentDesign = res.data.value.key.map(design => {
                    design.href = `/editor/design/${uuidv4()}/${design.id}`;
                    return design;
                });
                let newRecentDesign = this.state.recentDesign.filter(doc => doc.id != ("sentinel-image" + this.props.printType));
                const startPoint = newRecentDesign.length;
                newRecentDesign = [...newRecentDesign, ...recentDesign];
                let hasMore = newRecentDesign.length < res.data.value.value;
                let rem = 10;
                if (hasMore) {
                    rem = Math.min(res.data.value.value - newRecentDesign.length, 10);
                    newRecentDesign = [...newRecentDesign, ...this.getRem(rem)];
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

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        console.log('rect', rect)
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= ((window.innerHeight || document.documentElement.clientHeight) + rect.height) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    loaded = false;

    componentDidMount() {
        if (this.isInViewport(this.ref)) {
            this.loadMore();
            this.loaded = true;
        }
    }

    componentDidUpdate() {

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

        let title = "";

        switch (this.props.printType) {
            case 0:
                break;
            case 1:
                title = "poster";
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                title = "facebookPost";
                break;
            case 7:
                break;
            case 8:
                break;
            case 9:
                title = "squareVideoPost";
                break;
            case 10:
                title = "letterHeader";
                break;
            case 11: // Menu
                title = "Menu";
                break;
            case 12: // Instagram Story
                title = "instagramStory";
                break;
            case 14:
                title = "instagramPost";
                break;
            case 15: // Business Card
                title = "businessCard";
                break;
            case 16: // Facebook Cover
                title = "facebookCover";
                break;
            case 17: // Facebook Post
                title = "facebookPost";
                break;
            case 18: // Facebook ad
                title = "facebookAd";
                break;
            case 19:
                title = "resume";
                break;
        }

        return (
            <div
                ref={i => this.ref = i}
                style={{
                    margin: "20px 100px",
                    display: this.state.mounted ? "block" : "none",
                }}
            >
                <h3
                    style={{
                        marginBottom: '20px',
                        marginTop: '0px',
                        fontWeight: 600,
                        fontSize: "23px",
                        display: "inline-block",
                    }}
                >{this.props.translate(title)}</h3>
                <a
                    href={`/templates/${this.props.printType}/`}
                    target="_blank"
                    style={{
                        float: "right",
                        color: "rgb(33, 83, 204)",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <span
                        style={{
                            marginRight: "3px",
                            color: "rgb(33, 83, 204)",
                            fontWeight: 500,
                            fontSize: "15px",
                        }}
                    >{this.props.translate("viewAll")}</span>
                    <svg
                        style={{
                            transform: "rotate(270deg)",
                            fill: "rgb(33, 83, 204)",
                        }}
                        viewBox="0 0 16 16" width="16" height="16" direction="right" ><path d="M8.60021 10.8095C8.48307 10.9313 8.32415 10.9998 8.15839 11H7.84161C7.67621 10.998 7.51793 10.9297 7.39979 10.8095L3.12329 6.3579C3.04438 6.27659 3 6.16591 3 6.05045C3 5.93499 3.04438 5.8243 3.12329 5.743L3.71517 5.12809C3.792 5.04662 3.89716 5.00072 4.00694 5.00072C4.11672 5.00072 4.22187 5.04662 4.2987 5.12809L8 8.98207L11.7013 5.12809C11.7796 5.04611 11.8861 5 11.9972 5C12.1084 5 12.2149 5.04611 12.2932 5.12809L12.8767 5.743C12.9556 5.8243 13 5.93499 13 6.05045C13 6.16591 12.9556 6.27659 12.8767 6.3579L8.60021 10.8095Z"></path></svg>
                </a>
                <div
                    style={{
                        height: "220px",
                    }}>
                    <div>
                        <div style={{ position: 'relative' }}>
                            <InfiniteXScroll
                                scroll={true}
                                throttle={1000}
                                threshold={300}
                                isLoading={false}
                                hasMore={this.state.hasMore}
                                onLoadMore={this.loadMore.bind(this, false)}
                                refId={"sentinel-image" + this.props.printType}
                                marginTop={45}
                            >
                                <ul
                                    style={{
                                        listStyle: 'none',
                                        padding: 0,
                                        position: 'relative',
                                        zIndex: 1,
                                        display: 'inline-flex',
                                        marginTop: '1px',
                                        transition: '.5s cubic-bezier(.68,-.55,.265,1.55)',
                                    }}
                                    className="templateList___2swQr"
                                >
                                    {this.state.recentDesign.map((item, index) =>
                                        <Item
                                            prefix={3}
                                            {...item}
                                            key={index}
                                            keys={index}
                                            printType={this.props.printType}
                                            loadImage={this.loadImage}
                                            startPoint={this.state.startPoint}
                                        />)}
                                </ul>
                            </InfiniteXScroll>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
