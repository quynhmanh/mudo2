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
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
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
                    padding: "20px 100px",
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
                        color: "black",
                    }}
                >{this.props.translate("viewAll")}</a>
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
