import React, {PureComponent} from 'react';  
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
    total: number;
}

const TEMPLATE_PERPAGE = 10;
const WIDTH = 250;

class Popup extends PureComponent<IProps, IState> {
    state = {
        total: 0,
        hasMore: true,
        yLocation: 0,
        showLeft: true,
        mounted: true,
        recentDesign: [],
    }

    loadMore = () => {
        const url = `/api/Template/SearchPopularTemplates?&page=${this.state.recentDesign.length / TEMPLATE_PERPAGE + 1}&perPage=${TEMPLATE_PERPAGE}`;
        axios
            .get(url)
            .then(res => {
                let recentDesign = res.data.value.key.map(design => {
                    design.width = WIDTH;
                    design.href = `/editor/design/${uuidv4()}/${design.id}`;
                    return design;
                });
                let hasMore = res.data.value.value > this.state.recentDesign.length + recentDesign.length;
                this.setState({
                    recentDesign: [...this.state.recentDesign, ...recentDesign],
                    hasMore,
                });
            })
            .catch(error => {
                // Ui.showErrors(error.response.statusText)
            });
    }

    componentDidMount() {

        const url = `/api/Template/SearchPopularTemplates?page=1&perPage=${TEMPLATE_PERPAGE}`;
        axios
            .get(url)
            .then(res => {
            let recentDesign = res.data.value.key.map(design => {
                design.width = WIDTH;
                design.href = `/editor/design/${uuidv4()}/${design.id}`;
                return design;
            })
            this.setState({
                recentDesign, 
                total: res.data.value.value, 
                mounted: recentDesign.length > 0,
            });
            })
            .catch(error => {
                // Ui.showErrors(error.response.statusText)
            });
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
            >{this.props.translate("popular")}</h3>
            <div 
              style={{
                height: "300px",
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
                            {this.state.recentDesign.map( (item) => 
                                <Item 
                                    {...item} 
                                    key={uuidv4()}
                                />)}

                            {this.state.hasMore && 
                                Array(Math.min(TEMPLATE_PERPAGE, this.state.total - this.state.recentDesign.length))
                                .fill(0)
                                .map((item, i) => (
                                <Item
                                    id={"sentinel-image2"}
                                    width={WIDTH}
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
