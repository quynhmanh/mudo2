import React, {PureComponent} from 'react';  
import styled, {createGlobalStyle} from 'styled-components';
import axios from 'axios';

export interface IProps {
    item: any;
    closePopup: any;
  }
  
  interface IState {
    title: string;
    keywords: any;
  }

class MediaEditPopup extends PureComponent<IProps, IState> {
    static getDerivedStateFromProps(props, state) {
        if (!state) {
            return {
            title: props.item.firstName,
            keywords: props.item.keywords,
            };
        }

        return state;
    }

    handleAddNewKeyword = () => {
        var keywords = [...this.state.keywords, ""];
        this.setState({keywords});
    }

    handleSubmit = () => {
        var url = `/api/Media/Edit`;
        axios.post(url, {title: this.ref.innerHTML, id: this.props.item.id, keywords: this.state.keywords })
            .then(res => {
                if (res.status === 200) {
                    this.props.closePopup();
                }
            });
    }

    handleDeleteTemplate = () => {
        var url = `/api/Media/Delete?id=${this.props.item.id}`;
        axios.delete(url);
    }

    handleKeywordChanged = (index, e) => {
        var keywords = this.state.keywords.map((kw, id) => {
            if (id === index) {
                return e.target.value;
            }
            return kw;
        });

        this.setState({keywords});
    }

    handleRemove = (index, e) => {
        var keywords = this.state.keywords.filter((kw, id) => id !== index);
        this.setState({keywords});
    }

    ref = null;

  render() {  
        return (  
            <PopupWrapper className='popup unblurred'>
                <PopupWrapperBody />
                <div className='popup_inner unblurred' style={{padding: '20px', borderRadius: '13px', backgroundColor: 'white'}} >  
                    <span 
                    onClick={this.props.closePopup}
                    style={{
                        position: 'absolute',
                        width: '13px',
                        height: '13px',
                        right: '8px',
                        top: '8px',
                        cursor: 'pointer',
                    }} className='unblurred'>
<svg class="unblurred" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 212.982 212.982" xmlSpace="preserve">
<g id="Close">
	<path fill="black" d="M131.804,106.491l75.936-75.936c6.99-6.99,6.99-18.323,0-25.312   c-6.99-6.99-18.322-6.99-25.312,0l-75.937,75.937L30.554,5.242c-6.99-6.99-18.322-6.99-25.312,0c-6.989,6.99-6.989,18.323,0,25.312   l75.937,75.936L5.242,182.427c-6.989,6.99-6.989,18.323,0,25.312c6.99,6.99,18.322,6.99,25.312,0l75.937-75.937l75.937,75.937   c6.989,6.99,18.322,6.99,25.312,0c6.99-6.99,6.99-18.322,0-25.312L131.804,106.491z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>

                    </span>
                    <p ref={i => this.ref = i} className='unblurred' contentEditable={true}>{this.state.title}</p>
                    <p className='unblurred' >Keywords:</p>
                    {this.state.keywords.map((kw, index) => <div 
                        style={{
                            marginBottom: '10px',
                        }}
                        className='unblurred'>
                        <input onChange={this.handleKeywordChanged.bind(this, index)} className='unblurred' type="text" value={kw} />
                        <button className='unblurred' onClick={this.handleRemove.bind(this, index)}>Remove</button>
                    </div>)}
                    <div 
                        className='unblurred'
                        style={{
                        position: 'absolute',
                        bottom: '15px',
                        right: '15px',
                    }}>
                    <a className='unblurred' href={`/remove-background/${this.props.item.id}`}>Edit removed background</a>
                    <button
                        style={{
                            marginRight: '15px',
                        }}
                        className='unblurred' onClick={this.handleSubmit}>OK</button>
                    <button className='unblurred' onClick={this.handleAddNewKeyword}>Add new keyword</button>
                    <button className="unblurred" onClick={this.handleDeleteTemplate}>Delete</button>
                    </div>
                </div>  
            </PopupWrapper>
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
    background-color: rgba(0,0,0, 0.5);  

    .popup_inner {  
        position: fixed;  
        top: 0;  
        left: 0;  
        right: 0;  
        bottom: 0;  
        margin: auto;  
        background-color: black;
        width: 500px;
        height: 600px;
    }

    .popup-background {
        filter: blur(5px);
    }
`;

const PopupWrapperBody = createGlobalStyle`
    #editor :not(.unblurred) {
        -webkit-filter: blur(2px);
        -moz-filter: blur(2px);
        -o-filter: blur(2px);
        -ms-filter: blur(2px);
        filter: blur(2px);    
    }
`;



export default MediaEditPopup;