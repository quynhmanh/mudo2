import React, {PureComponent} from 'react';  
import styled, {createGlobalStyle} from 'styled-components';
import { POPULAR_LIST } from "@Constants";
import loadable from '@loadable/component';
import uuidv4 from "uuid/v4";
import Globals from "@Globals";
import axios from "axios";
import InfiniteXScroll from "@Components/shared/InfiniteXScroll";


const Item = loadable(() => import("@Components/homepage/PopularTemplateItem"));

const popularTemplates = POPULAR_LIST.map( (item) => 
    <Item 
        {...item} 
        key={uuidv4()}
    />
);

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
  }

class Popup extends PureComponent<IProps, IState> {
    state = {
        total: 0,
        yLocation: 0,
        showLeft: true,
        mounted: false,
        recentDesign: [],
        hasMore: true,
    }

    componentDidMount() {
        // this.setState({mounted: true,})
        // this.test.addEventListener("scroll", this.handleScroll);

        if (Globals.serviceUser) {
            const url = `https://localhost:64099/api/Design/SearchWithUserName?userName=${Globals.serviceUser.username}&page=1&perPage=7`;
            axios
              .get(url)
              .then(res => {
                    console.log('res total ', res.data.value.value);
                    let recentDesign = res.data.value.key.map(design => {
                        design.width = 160;
                        design.href = `/editor/design/${design.id}`;
                        return design;
                    });

                    let hasMore = res.data.value.value > recentDesign.length;
                    this.setState({
                        recentDesign, 
                        hasMore,
                        total: res.data.value.value,
                        mounted: recentDesign.length > 0,
                    });
                })
                .catch(error => {
                    // Ui.showErrors(error.response.statusText)
                });
        }
    }

    handleScroll = () => {
        this.setState({yLocation: this.test.scrollLeft});

        if (this.test.offsetWidth + this.test.scrollLeft >= this.test.scrollWidth) {
            this.setState({showLeft: false,});
        } else {
            this.setState({showLeft: true,});
        }
    }

    test = null;

    loadMore = () => {
        if (Globals.serviceUser) {
            const url = `https://localhost:64099/api/Design/SearchWithUserName?userName=${Globals.serviceUser.username}&page=${this.state.recentDesign.length / 7 + 1}&perPage=7`;
            console.log('laodmore ', url)
            axios
              .get(url)
              .then(res => {
                let newRecentDesign = res.data.value.key.map(design => {
                    design.width = 160;
                    design.href = `/editor/design/${design.id}`;
                    return design;
                })
                let hasMore = res.data.value.value > (this.state.recentDesign.length + newRecentDesign.length);
                this.setState({
                    recentDesign: [...this.state.recentDesign, ...newRecentDesign],
                    hasMore,
                });
              })
              .catch(error => {
                  // Ui.showErrors(error.response.statusText)
              });
        }
    }

  render() {
    return (
        <div
            style={{
              padding: "20px 80px",
              display: this.state.mounted ? "block" : "none",
            }}
          >
            <h3
              style={{
                marginBottom: '20px',
                marginTop: '20px',
                fontFamily: "AvenirNextRoundedPro-Bold",
                fontSize: "30px",
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
                        {this.state.recentDesign.map( (item) => 
                            <Item 
                                {...item} 
                                key={uuidv4()}
                            />)}
                        {this.state.hasMore && Array(Math.min(7, this.state.total - this.state.recentDesign.length))
                        .fill(0)
                        .map((item, i) => (
                        <Item
                            id={"sentinel-image"}
                            width={160}
                            key={uuidv4()}
                        />
                        ))}
                    </ul>
                </InfiniteXScroll>
            </div>
        </div>
        </div>
        </div>
    );  
    }  
}  

const PopupWrapper = styled.div`
    position: fixed;  
    top: 0;  
    left: 0;  
    right: 0;  
    bottom: 0;  
    margin: auto;  
    background-color: rgba(15, 15, 15, 0.6);

    .popup_inner {  
        position: fixed;  
        top: 0;  
        left: 0;  
        right: 0;  
        bottom: 0;  
        margin: auto;  
        background-color: black;
        width: 200px;
        height: 200px;
    }

`;

const PopupWrapperBody = createGlobalStyle`
`;



export default Popup;

var CC = styled.li`
    position: relative;
    height: 160px;
    margin-right: 16px;
    transition: .3s;
`;
