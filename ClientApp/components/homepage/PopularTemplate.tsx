import React, {PureComponent} from 'react';  
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
}

const TEMPLATE_PERPAGE = 10;

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
        if (Globals.serviceUser) {
            const url = `https://localhost:64099/api/Design/SearchWithUserName?userName=${Globals.serviceUser.username}&page=1&perPage=${TEMPLATE_PERPAGE}`;
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

    loadMore = () => {
        if (Globals.serviceUser) {
            const url = `https://localhost:64099/api/Design/SearchWithUserName?userName=${Globals.serviceUser.username}&page=${this.state.recentDesign.length / TEMPLATE_PERPAGE + 1}&perPage=${TEMPLATE_PERPAGE}`;
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
                    fontSize: "25px",
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
                        {this.state.hasMore && Array(Math.min(TEMPLATE_PERPAGE, this.state.total - this.state.recentDesign.length))
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

export default Popup;
