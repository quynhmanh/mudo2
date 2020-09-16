import React, {Component} from 'react';  
import loadable from '@loadable/component';
import uuidv4 from "uuid/v4";
import Globals from "@Globals";
import axios from "axios";
import InfiniteXScroll from "@Components/shared/InfiniteXScroll";

const Item = loadable(() => import("@Components/homepage/PopularTemplateItem"));


export interface IProps {
    translate: any;
}
  
interface IState {
    yLocation: number;
    showLeft: boolean;
    mounted: boolean;
    recentDesign: any;
    hasMore: boolean;
    total: number;
    rem: number;
}

const TEMPLATE_PERPAGE = 10;

const WIDTH = 160;


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
        total: 0,
        yLocation: 0,
        showLeft: true,
        mounted: false,
        recentDesign: getRem(10),
        hasMore: true,
    }

    componentDidMount() {
        this.loadMore();
    }

    loadMore = () => {
        if (Globals.serviceUser) {
            const url = `/api/Design/SearchWithUserName?userName=${Globals.serviceUser.username}&page=${(this.state.recentDesign.length - this.state.rem) / TEMPLATE_PERPAGE + 1}&perPage=${TEMPLATE_PERPAGE}`;
            axios
              .get(url)
              .then(res => {
                let recentDesign = res.data.value.key.map(design => {
                    design.width = 160;
                    design.href = `/editor/design/${design.id}`;
                    return design;
                })
                console.log('res.data.value ', res.data.value)
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
                });


                function loadImage(counter) {
                    // Break out if no more images
                    if (counter==newRecentDesign.length) { return; }
                  
                    // Grab an image obj
                    var I = document.getElementById("image-"+counter) as HTMLImageElement;
                    console.log('II', I)
                  
                    // Monitor load or error events, moving on to next image in either case
                    I.onload = I.onerror = function() { 
                        console.log('onLoad ')
                        loadImage(counter+1); 
                    }
                  
                    //Change source (then wait for event)
                    I.src = newRecentDesign[counter].representative;
                    console.log('ewRecentDesign', counter, newRecentDesign)
                  }
                  
                  loadImage(startPoint);
              })
              .catch(error => {
                  // Ui.showErrors(error.response.statusText)
              });
        }
    }

  render() {
    console.log('this.state.recentDesign', this.state.recentDesign)
    return (
        <div
            style={{
                padding: "20px 150px",
            }}
          >
            <h3
                style={{
                    marginBottom: '20px',
                    marginTop: '20px',
                    fontWeight: 600,
                    fontSize: "25px",
                    fontFamily: 'AvenirNextRoundedPro',
                }}
            >{this.props.translate("recentDesign")}</h3>
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
                    refId="sentinel-image"
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
                        {this.state.recentDesign.map( (item, index) => 
                            <Item 
                                {...item} 
                                key={index}
                                keys={index}
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
