import React, { Component } from 'react';
import loadable from '@loadable/component';
import uuidv4 from "uuid/v4";
import axios from "axios";
import InfiniteXScroll from "@Components/shared/InfiniteXScroll";

const Item = loadable(() => import("@Components/homepage/PopularTemplateItem2"));

export interface IProps {
    translate: any;
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

class Popup extends Component<IProps, IState> {
    state = {
        rem: 10,
        hasMore: true,
        yLocation: 0,
        showLeft: true,
        mounted: true,
        recentDesign: getRem(10),
    }

    constructor(props: any) {
        super(props);

        this.loadImage = this.loadImage.bind(this);
    }

    loadImage(counter) {
        let self = this;
        let newRecentDesign = this.state.recentDesign;
        console.log('laodImage ', counter);
        // Break out if no more images
        if (counter==newRecentDesign.length) { return; }
        
        if (newRecentDesign[counter].isVideo) {
        // Grab an image obj
            var I = document.getElementById("video-"+counter);
        } else {
            var I = document.getElementById("image-2-"+counter);
        }
        
        if (newRecentDesign[counter].isVideo) {
            // Monitor load or error events, moving on to next image in either case
            I.onloadedmetadata = I.onerror = function() { 
                setTimeout(() => {
                    self.loadImage(counter+1); 
                }, 100);
            }
        } else {
            I.onload = I.onerror = function() { 
                setTimeout(() => {
                    self.loadImage(counter+1); 
                }, 100);
            }
        }
        
        
        //Change source (then wait for event)
        if (newRecentDesign[counter].isVideo) {
            I.src = newRecentDesign[counter].videoRepresentative;
        } else {
            I.src = newRecentDesign[counter].representative;
        }
    }

    loadMore = () => {
        const url = `/api/Template/SearchPopularTemplates?&page=${(this.state.recentDesign.length - this.state.rem) / TEMPLATE_PERPAGE + 1}&perPage=${TEMPLATE_PERPAGE}`;
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

        return (
            <div
                style={{
                    padding: "20px 150px",
                    display: this.state.mounted ? "block" : "none",
                }}
            >
                <h3
                    style={{
                        marginBottom: '20px',
                        marginTop: '20px',
                        fontFamily: "AvenirNextRoundedPro",
                        fontWeight: 600,
                        fontSize: "23px",
                    }}
                >{this.props.translate("popular")}</h3>
                <div
                    style={{
                        height: "200px",
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
                                refId="sentinel-image2"
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
                                            {...item}
                                            key={index}
                                            keys={index}
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

export default Popup;
