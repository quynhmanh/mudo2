import React, {PureComponent} from 'react';  
import styled, {createGlobalStyle} from 'styled-components';


export interface IProps {
    text: string;
    closePopup: any;
  }
  
  interface IState {
    
  }

class Popup extends PureComponent<IProps, IState> {
  render() {  
        return (  
            <PopupWrapper className='popup unblurred'>
                <PopupWrapperBody />
                <div className='popup_inner unblurred' style={{borderRadius: '13px', backgroundColor: 'white'}} >  
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
	<path fill="white" d="M131.804,106.491l75.936-75.936c6.99-6.99,6.99-18.323,0-25.312   c-6.99-6.99-18.322-6.99-25.312,0l-75.937,75.937L30.554,5.242c-6.99-6.99-18.322-6.99-25.312,0c-6.989,6.99-6.989,18.323,0,25.312   l75.937,75.936L5.242,182.427c-6.989,6.99-6.989,18.323,0,25.312c6.99,6.99,18.322,6.99,25.312,0l75.937-75.937l75.937,75.937   c6.989,6.99,18.322,6.99,25.312,0c6.99-6.99,6.99-18.322,0-25.312L131.804,106.491z"/>
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
                    <div className='unblurred' style={{padding: '15px', backgroundColor: '#019fb6', color: 'white', borderRadius: '13px 13px 0 0'}}>
                        <h4 style={{margin: 0, textAlign: 'center'}} className='unblurred'>Project Options | Print & Share Anywhere</h4>
                    </div>
                    <div className='unblurred'>
                        <h1 className='unblurred'>{this.props.text}</h1>  
                        <button className='unblurred' onClick={this.props.closePopup}>close me</button>  
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
        height: 400px;
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



export default Popup;