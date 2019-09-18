import React, {PureComponent} from 'react';  
import styled, {createGlobalStyle} from 'styled-components';
import Loader from '@Components/shared/Loader';

export interface IProps {
    text: string;
    closePopup: any;
    handleDownloadPDF: any;
    handleDownloadPNG: any;
    handleDownloadPNGTransparent: any;
    handleDownloadPDFWithBleed: any;
    handleDownloadJPG: any;
    showPopup: boolean;
    handleDownloadVideo: any;
  }
  
  interface IState {
    
  }

class Popup extends PureComponent<IProps, IState> {
  render() {  
        return (  
            <PopupWrapper style={{display: 'none',}} id="downloadPopup" className='popup unblurred'>
                <PopupWrapperBody />
                <div className='popup_inner unblurred' 
                  style={{
                     display: 'flex', 
                     borderRadius: '13px',
                     background: 'linear-gradient(141deg, #2cb5e8 0%, #1fc8db 51%, #5affb7 75%)',
                  }} >  
                    <div className="unblurred" style={{width: '100%', position: 'relative'}}>

                    <div
   style={{
      padding: '39px 40px',
      height: '293px',
  }}
   className="unblurred"><h1 style={{textAlign: 'center', fontSize: '20px',}} className="unblurred">Đang tải</h1>
      {/* <Loader className="unblurred" show={true} black={true}/> */}
      <svg
         style={{
            width: '80px',
            height: '80px',
            margin: 'auto',
            left: 0,
            right: 0,
            position: 'absolute',
         }}
         className="unblurred" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" ><circle cx="15.5" cy="47.2279" ng-attr-r="{{config.radius}}" fill="#2c2c2e" r="8">
  <animate attributeName="cy" values="46;54;46" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="0s" repeatCount="indefinite"/>
</circle><circle cx="32.5" cy="46.1307" ng-attr-r="{{config.radius}}" fill="rgba(100%,100%,100%,0)" r="8">
  <animate attributeName="cy" values="46;54;46" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.2s" repeatCount="indefinite"/>
</circle><circle cx="49.5" cy="50.0871" ng-attr-r="{{config.radius}}" fill="#2c2c2e" r="8">
  <animate attributeName="cy" values="46;54;46" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.4s" repeatCount="indefinite"/>
</circle><circle cx="66.5" cy="53.896" ng-attr-r="{{config.radius}}" fill="rgba(100%,100%,100%,0)" r="8">
  <animate attributeName="cy" values="46;54;46" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.6s" repeatCount="indefinite"/>
</circle><circle cx="83.5" cy="52.6661" ng-attr-r="{{config.radius}}" fill="#2c2c2e" r="8">
  <animate attributeName="cy" values="46;54;46" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.8s" repeatCount="indefinite"/>
</circle></svg>
   </div>
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
    background-color: rgba(14,19,24,.3);

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

    .popup-background {
        filter: blur(5px);
    }
`;

const PopupWrapperBody = createGlobalStyle`
    #editor.popup {
        -webkit-filter: blur(5px);
        -moz-filter: blur(5px);
        -o-filter: blur(5px);
        -ms-filter: blur(5px);
        filter: blur(5px);    
    }
`;



export default Popup;