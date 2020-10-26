import React, { PureComponent } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
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

    current_progress = 0;
    step = 0.2;
    interval = null;

    render() {
        return (
            <PopupWrapper
                id="downloadPopup"
                className="popup unblurred"
                style={{
                    display: 'none',
                    zIndex: 12312312312,
                }}>
                <PopupWrapperBody />
                <div className='popup_inner unblurred'
                    style={{
                        display: 'flex',
                        borderRadius: '7px',
                        background: 'rgba(242, 241, 238, 0.99)',
                    }} >
                    <div className="unblurred" style={{ width: '100%', position: 'relative' }}>

                        <div
                            style={{
                                padding: '39px 40px',
                            }}
                            className="unblurred"><h1 style={{ textAlign: 'center', fontSize: '30px', }} className="unblurred">Đang xử lý...</h1>
                        </div>
                        <div
                            style={{
                                width: "100%",
                            }}
                            className="container">

                            <div 
                                className="progress"
                                style={{
                                    borderRadius: "10px",
                                    margin: "0 25px",
                                }}>
                                <div id={"progress-bar-download"} className="progress-bar progress-bar-striped" role="progressbar"
                                    style={{ 
                                        width: "0%", 
                                        backgroundSize: "200%",
                                        backgroundImage: "repeating-linear-gradient(90deg,#00c4cc,#a06fda,#00c4cc)",
                                    }}
                                    ariaValuenow="0" ariaValuemin="0" ariaValuemax="100"></div>
                            </div>
                            <button
                                id={"progress-bar-start-btn-download"}
                                onClick={e => {
                                    console.log('clicked')
                                    let self = this;
                                    window.progress_interval = setInterval(function () {
                                        window.current_progress += self.step;
                                        let progress = Math.round(Math.atan(window.current_progress) / (Math.PI / 2) * 100 * 1000) / 1000
                                        document.getElementById("progress-bar-download").style.width = progress + "%";
                                        if (progress >= 100) {
                                            clearInterval(window.progress_interval);
                                        } else if (progress >= 70) {
                                            this.step = 0.1
                                        }
                                    }, 100);
                                }}
                                style={{
                                    display: "none",
                                }}
                                type="button"
                                className="btn btn-light">Start</button>
                            <button
                                style={{
                                    margin: "auto",
                                    position: "absolute",
                                    left: "0",
                                    right: "0",
                                    bottom: "40px",
                                    border: "none",
                                    padding: "10px",
                                    background: "rgba(64,87,109,.07)",
                                    borderRadius: "9px",
                                }}
                            >Cancel</button>
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
    background-color: rgba(15, 15, 15, 0.6);

    .popup_inner {  
        position: fixed;  
        top: 0;  
        left: 0;  
        right: 0;  
        bottom: 0;  
        margin: auto;  
        background-color: black;
        width: 560px;
        height: 277px;
    }

`;

const PopupWrapperBody = createGlobalStyle`
`;



export default Popup;