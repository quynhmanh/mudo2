import React, {PureComponent} from 'react';  
import styled, {createGlobalStyle} from 'styled-components';
import { POPULAR_LIST } from "@Constants";
import loadable from '@loadable/component';
import uuidv4 from "uuid/v4";
import Globals from "@Globals";
import axios from "axios";

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
  }

class Popup extends PureComponent<IProps, IState> {
    state = {
        yLocation: 0,
        showLeft: true,
        mounted: false,
        recentDesign: [],
    }

    componentDidMount() {
        this.setState({mounted: true,})
        this.test.addEventListener("scroll", this.handleScroll);

        if (Globals.serviceUser) {
            // const url = `https://localhost:64099/api/Template/SearchWithUserName?userName=${Globals.serviceUser.username}`;
            const url = `/api/Template/Search?Type=1&page=1&perPage=10&printType=6`;
            axios
              .get(url)
              .then(res => {
                  console.log('populartemplate2 ', res)
                let recentDesign = res.data.value.key.map(design => {
                    design.width = 160;
                    design.href = `/editor/design/${uuidv4()}/${design.id}`;
                    return design;
                })
                this.setState({recentDesign,});
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

  render() {
    return (
        <div>
            <div style={{ position: 'relative' }}>
                { this.state.yLocation > 0 && this.state.mounted &&
                    <button 
                        style={{
                            position: 'absolute',
                            top: '60px',
                            zIndex: 100,
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            left: '-21px',
                            border: 'none',
                            background: 'white',
                        }} 
                        onClick={(e) => {
                            this.test.scrollLeft = this.state.yLocation - 700;
                            this.setState({yLocation: this.state.yLocation - 700});
                        }}
                        className="arrowWrapper___rLMf7 arrowLeft___2lAV4" 
                        data-categ="popularTemplates" 
                        data-value="btn_sliderLeft"
                    >
                        <svg 
                            style={{ transform: 'rotate(180deg)' }} 
                            viewBox="0 0 16 16" 
                            width="16" 
                            height="16" 
                            className="arrow___2yMKk"
                        >
                            <path d="M12.2339 8.7917L5.35411 15.6711C4.91648 16.109 4.20692 16.109 3.7695 15.6711C3.33204 15.2337 3.33204 14.5242 3.7695 14.0868L9.85703 7.99952L3.76968 1.91249C3.33222 1.47486 3.33222 0.765428 3.76968 0.327977C4.20714 -0.109651 4.91665 -0.109651 5.35429 0.327977L12.234 7.20751C12.4528 7.42634 12.562 7.71284 12.562 7.99948C12.562 8.28627 12.4526 8.57298 12.2339 8.7917Z"></path>
                        </svg>
                    </button>
                }   
                {this.state.showLeft && this.state.mounted &&
                    <button 
                        style={{
                            position: 'absolute',
                            top: '60px',
                            zIndex: 100,
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            right: '-21px',
                            border: 'none',
                            background: 'white',
                        }} 
                        onClick={(e) => {
                            this.test.scrollLeft = this.state.yLocation + 700;
                            this.setState({yLocation: this.state.yLocation + 700});
                        }}
                        className="arrowWrapper___rLMf7 arrowLeft___2lAV4" 
                        data-categ="popularTemplates" 
                        data-value="btn_sliderLeft"
                    >
                        <svg 
                            style={{
                                // transform: 'rotate(180deg)',
                            }} 
                            viewBox="0 0 16 16" 
                            width="16" 
                            height="16" 
                            className="arrow___2yMKk"
                        >
                            <path d="M12.2339 8.7917L5.35411 15.6711C4.91648 16.109 4.20692 16.109 3.7695 15.6711C3.33204 15.2337 3.33204 14.5242 3.7695 14.0868L9.85703 7.99952L3.76968 1.91249C3.33222 1.47486 3.33222 0.765428 3.76968 0.327977C4.20714 -0.109651 4.91665 -0.109651 5.35429 0.327977L12.234 7.20751C12.4528 7.42634 12.562 7.71284 12.562 7.99948C12.562 8.28627 12.4526 8.57298 12.2339 8.7917Z"></path>
                        </svg>
                    </button>
                }
                <div
                    style={{
                        height: '220px',
                        position: 'relative',
                    }}
                >
                    {/* {this.state.mounted &&  */}
                    <div 
                        className="renderView___1QdJs"
                        ref={i => this.test = i}
                        style={{
                        overflow: 'scroll',
                        scrollBehavior: 'smooth',
                        }}
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
                        </ul>
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
