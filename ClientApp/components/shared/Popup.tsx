import React, { PureComponent } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

export interface IProps {
    closePopup: any;
    showPopup: boolean;
    handleDownloadVideo: any;
    translate: any;
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
                        background: 'white',
                    }} >
                    <div className="unblurred" style={{ width: '100%', position: 'relative' }}>

                        <div
                            style={{
                                padding: '30px 40px',
                            }}
                            className="unblurred"><h1 style={{ textAlign: 'center', fontSize: '30px', margin: "auto", }} className="unblurred">{this.props.translate("processing")} ...</h1>
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
                                    margin: "0 20px",
                                    background: "rgba(57,76,96,.15)",
                                    height: "15px"
                                }}>
                                <div id={"progress-bar-download"} className="progress-bar progress-bar-striped" role="progressbar"
                                    style={{
                                        width: "0%",
                                        backgroundSize: "200%",
                                        backgroundImage: "repeating-linear-gradient(90deg,#00c4cc,#a06fda,#00c4cc)",
                                    }}
                                    ariaValuemin="0" ariaValuemax="100"></div>
                            </div>
                            <button
                                id={"progress-bar-start-btn-download"}
                                onClick={e => {
                                    console.log('clicked')
                                    let self = this;
                                    window.progress_interval = setInterval(function () {
                                        window.current_progress += window.step;
                                        let progress = Math.round(Math.atan(window.current_progress) / (Math.PI / 2) * 100 * 1000) / 1000
                                        document.getElementById("progress-bar-download").style.width = progress + "%";
                                        if (progress >= 100) {
                                            clearInterval(window.progress_interval);
                                        } else if (progress >= 70) {
                                            window.step = 0.1
                                        }
                                    }, 100);
                                }}
                                style={{
                                    display: "none",
                                }}
                                type="button"
                                className="btn btn-light">Start</button>
                            <div
                                style={{
                                    fontSize: "13px",
                                }}
                            ><blockquote style={{
                                fontSize: "13px",
                                border: "none",
                                textAlign: "center",
                                marginTop: "5px",
                            }} >It always seems impossible until it's done. <strong>— Nelson Mandela</strong></blockquote></div>
                            <button
                                style={{
                                    margin: "auto",
                                    position: "absolute",
                                    left: "0",
                                    right: "0",
                                    bottom: "23px",
                                    border: "none",
                                    padding: "10px 20px",
                                    background: "rgba(64,87,109,.07)",
                                    borderRadius: "4px",
                                }}
                                onClick={e => {
                                    window.cancelDownload = true;
                                    document.getElementById("downloadPopup").style.display = "none";
                                    document.getElementById("editor").classList.remove("popup");

                                    window.current_progress = 0;

                                    clearInterval(window.progress_interval);
                                    document.getElementById("progress-bar-download").style.width = "0%";
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
        height: 230px;
    }

`;

const PopupWrapperBody = createGlobalStyle`
`;



export default Popup;