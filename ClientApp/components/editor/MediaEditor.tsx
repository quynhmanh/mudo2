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

    constructor(props) {
        super(props);

        this.updateImageRep = this.updateImageRep.bind(this);
    }
    
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
        document.getElementById("clipWidth0").value = this.props.item.clipWidth0;
        document.getElementById("clipHeight0").value = this.props.item.clipHeight0;
        document.getElementById("path").value = this.props.item.path;
        document.getElementById("path2").value = this.props.item.path2;
        document.getElementById("popularity2").value = this.props.item.popularity;
        document.getElementById("popularity3").value = this.props.item.popularity2;
        document.getElementById("stopColor1").value = this.props.item.stopColor1;
        document.getElementById("stopColor2").value = this.props.item.stopColor2;
        document.getElementById("stopColor3").value = this.props.item.stopColor3;
        document.getElementById("stopColor4").value = this.props.item.stopColor4;
        document.getElementById("gridTemplateAreas").value = this.props.item.gridTemplateAreas;
        document.getElementById("gridTemplateColumns").value = this.props.item.gridTemplateColumns;
        document.getElementById("gridTemplateRows").value = this.props.item.gridTemplateRows;
        document.getElementById("gap").value = this.props.item.gap;
        document.getElementById("grids").value = JSON.stringify(this.props.item.grids);
    }

    handleAddNewKeyword = () => {
        var keywords = [...this.state.keywords, ""];
        this.setState({ keywords });
    }

    handleSubmit = () => {
        const clipId = document.getElementById("clipId").value;
        const clipWidth = document.getElementById("clipWidth").value;
        const clipHeight = document.getElementById("clipHeight").value;
        const clipWidth0 = document.getElementById("clipWidth0").value;
        const clipHeight0 = document.getElementById("clipHeight0").value;
        const path = document.getElementById("path").value;
        const path2 = document.getElementById("path2").value;
        const popularity = document.getElementById("popularity2").value;
        const popularity2 = document.getElementById("popularity3").value;
        const stopColor1 = document.getElementById("stopColor1").value;
        const stopColor2 = document.getElementById("stopColor2").value;
        const stopColor3 = document.getElementById("stopColor3").value;
        const stopColor4 = document.getElementById("stopColor4").value;
        const gridTemplateAreas = document.getElementById("gridTemplateAreas").value;
        const gridTemplateColumns = document.getElementById("gridTemplateColumns").value;
        const gridTemplateRows = document.getElementById("gridTemplateRows").value;
        const gap = document.getElementById("gap").value;
        const grids = document.getElementById("grids").value;
        var url = `/api/Media/Edit`;
        axios.post(url, 
        { 
            title: this.ref.innerHTML, 
            id: this.props.item.id, 
            keywords: this.state.keywords,
            clipId,
            clipWidth,
            clipHeight,
            clipWidth0,
            clipHeight0,
            path,
            path2,
            popularity,
            popularity2,
            stopColor1,
            stopColor2,
            stopColor3,
            stopColor4,
            gridTemplateAreas,
            gridTemplateColumns,
            gridTemplateRows,
            gap,
            grids,
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

    updateImageRep = () => {
        let id = this.props.item.id;
        var fileUploader = document.getElementById("image-file-update-rep") as HTMLInputElement;
        let fr = new FileReader();
        let file = fileUploader.files[0];
        fr.readAsDataURL(file);
        fr.onload = () => {
            const url = `/api/Media/UpdateRepresentative?id=${this.props.item.id}`;
            var img = new Image();
            img.src = fr.result.toString();
            img.onload = function () {
                document.body.appendChild(img);
                axios
                    .post(url, {
                        id,
                        data: fr.result,
                        ext: file.name.split(".")[1],
                        width: img.width,
                        height: img.height,
                        quality: 100,
                    });
            };
        }
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
                    <input className='unblurred' id="clipId" type="text" placeholder="clip id" />
                    <input className='unblurred' id="clipWidth" type="text" placeholder="clip width" />
                    <input className='unblurred' id="clipHeight" type="text" placeholder="clip height"/>
                    <input className='unblurred' id="clipWidth0" type="text" placeholder="clip width 0" />
                    <input className='unblurred' id="clipHeight0" type="text" placeholder="clip height 0"/>
                    <input className='unblurred' id="path" type="text" placeholder="path"/>
                    <input className='unblurred' id="path2" type="text" placeholder="path2"/>
                    <input className='unblurred' id="popularity2" type="text" placeholder="popularity2"/>
                    <input className='unblurred' id="popularity3" type="text" placeholder="popularity3"/>
                    <input className='unblurred' id="stopColor1" type="text" placeholder="stop color 1"/>
                    <input className='unblurred' id="stopColor2" type="text" placeholder="stop color 2"/>
                    <input className='unblurred' id="stopColor3" type="text" placeholder="stop color 3"/>
                    <input className='unblurred' id="stopColor4" type="text" placeholder="stop color 4"/>
                    <input className='unblurred' id="gridTemplateAreas" type="text" placeholder="Grid template areas"/>
                    <input className='unblurred' id="gridTemplateColumns" type="text" placeholder="Grid template columns"/>
                    <input className='unblurred' id="gridTemplateRows" type="text" placeholder="Grid template Rows"/>
                    <input className='unblurred' id="gap" type="text" placeholder="gap"/>
                    <input style={{width: "500px",}} className='unblurred' id="grids" type="text" placeholder="grids"/>
                    <input
                        id="image-file-update-rep"
                        type="file"
                        multiple
                        onChange={e => {
                            e.preventDefault();
                            this.updateImageRep();
                        }}
                        style={{
                            bottom: 0,
                            display: "none",
                        }}
                    />
                    
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
                        <button className="unblurred" onClick={e => {
                            document.getElementById("image-file-update-rep").click();
                        }}>Update image rep</button>
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