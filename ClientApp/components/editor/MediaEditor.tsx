import React, { PureComponent } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';

export interface IProps {
    item: any;
    closePopup: any;
    handleRemoveBackground: any;
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

    componentDidMount() {
        document.getElementById("clipId").value = this.props.item.clipId;
        document.getElementById("clipWidth").value = this.props.item.clipWidth;
        document.getElementById("clipHeight").value = this.props.item.clipHeight;
        document.getElementById("path").value = this.props.item.path;
        document.getElementById("path2").value = this.props.item.path2;
        document.getElementById("popularity2").value = this.props.item.popularity;
    }

    handleAddNewKeyword = () => {
        var keywords = [...this.state.keywords, ""];
        this.setState({ keywords });
    }

    handleSubmit = () => {
        const clipId = document.getElementById("clipId").value;
        const clipWidth = document.getElementById("clipWidth").value;
        const clipHeight = document.getElementById("clipHeight").value;
        const path = document.getElementById("path").value;
        const path2 = document.getElementById("path2").value;
        const popularity = document.getElementById("popularity2").value;
        console.log('popularity', popularity)
        var url = `/api/Media/Edit`;
        axios.post(url, 
        { 
            title: this.ref.innerHTML, 
            id: this.props.item.id, 
            keywords: this.state.keywords,
            clipId,
            clipWidth,
            clipHeight,
            path,
            path2,
            popularity,
        })
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

        this.setState({ keywords });
    }

    handleRemove = (index, e) => {
        var keywords = this.state.keywords.filter((kw, id) => id !== index);
        this.setState({ keywords });
    }

    ref = null;

    render() {
        return (
            <PopupWrapper className='popup unblurred'>
                <PopupWrapperBody />
                <div className='popup_inner unblurred' style={{ padding: '20px', borderRadius: '13px', backgroundColor: 'white' }} >
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
                        <svg className="unblurred" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 212.982 212.982" xmlSpace="preserve">
                            <g id="Close">
                                <path fill="black" d="M131.804,106.491l75.936-75.936c6.99-6.99,6.99-18.323,0-25.312   c-6.99-6.99-18.322-6.99-25.312,0l-75.937,75.937L30.554,5.242c-6.99-6.99-18.322-6.99-25.312,0c-6.989,6.99-6.989,18.323,0,25.312   l75.937,75.936L5.242,182.427c-6.989,6.99-6.989,18.323,0,25.312c6.99,6.99,18.322,6.99,25.312,0l75.937-75.937l75.937,75.937   c6.989,6.99,18.322,6.99,25.312,0c6.99-6.99,6.99-18.322,0-25.312L131.804,106.491z" />
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
                        key={index}
                        style={{
                            marginBottom: '10px',
                        }}
                        className='unblurred'>
                        <input onChange={this.handleKeywordChanged.bind(this, index)} className='unblurred' type="text" value={kw} />
                        <button className='unblurred' onClick={this.handleRemove.bind(this, index)} value={kw}>Remove</button>
                    </div>)}
                    <p className='unblurred'>clip id</p>
                    <input className='unblurred' id="clipId" type="text" />
                    <p className='unblurred'>clip width</p>
                    <input className='unblurred' id="clipWidth" type="text" />
                    <p className='unblurred'>clip height</p>
                    <input className='unblurred' id="clipHeight" type="text" />
                    <p className='unblurred'>path</p>
                    <input className='unblurred' id="path" type="text" />
                    <p className='unblurred'>path2</p>
                    <input className='unblurred' id="path2" type="text" />
                    <p className='unblurred'>popularity</p>
                    <input className='unblurred' id="popularity2" type="text" />
                    <div
                        className='unblurred'
                        style={{
                            position: 'absolute',
                            bottom: '15px',
                            right: '15px',
                        }}>
                        <button className='unblurred' onClick={this.props.handleRemoveBackground}>Edit removed background</button>
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