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
    isDownload: boolean;
  }
  
  interface IState {
    
  }

class Popup extends PureComponent<IProps, IState> {
  render() {  
        return (  
            <PopupWrapper className='popup unblurred'>
                <PopupWrapperBody />
                <div className='popup_inner unblurred' 
                  style={{
                     display: 'flex', 
                     borderRadius: '13px',
                     background: 'linear-gradient(141deg, #2cb5e8 0%, #1fc8db 51%, #5affb7 75%)',
                  }} >  
                    <div className="unblurred">
                    <div className="unblurred leftInfo___1rQiJ" style={{
                        padding: '2px',
                        width: '520px',
                        color: 'white',
                        paddingRight: 0,
                    }}>
   <div className="unblurred" style={{padding: '10px', backgroundColor: '#0000008a', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px'}}>
      <h5 className="unblurred infoTitle___15NNR large___2DVhe geometria-medium___3wRqs">Tải xuống bản thiết kế của bạn dưới bất kì định dạng nào:</h5>
      <ul style={{padding: 0}} className="unblurred leftInfoList___jwVP0">
         <li style={{listStyle: 'none', display: 'flex', marginBottom: '10px',}} className="unblurred leftInfoItem___22wdL">
            <h3 style={{flex: '0 0 100px', margin: 0,}} className="unblurred leftInfoTitle___JX_9_ large___2DVhe">JPG</h3>
            <p className="unblurred x-small___1lJKy">Lưu bản thiết kế của bạn dưới định dạng JPG với dung lượng nhỏ.</p>
         </li>
         <li style={{listStyle: 'none', display: 'flex', marginBottom: '10px',}} className="unblurred leftInfoItem___22wdL">
            <h3 style={{flex: '0 0 100px', margin: 0,}} className="unblurred leftInfoTitle___JX_9_ large___2DVhe">PNG</h3>
            <p className="unblurred x-small___1lJKy">Lưu bản thiết kế của bạn dưới định dạng PNG với nền trắng.</p>
         </li>
         <li style={{listStyle: 'none', display: 'flex', marginBottom: '10px',}} className="unblurred leftInfoItem___22wdL">
            <h3 style={{flex: '0 0 100px', margin: 0,}} className="unblurred leftInfoTitle___JX_9_ large___2DVhe">
               PNG
               <p style={{fontSize: '11px'}} className="unblurred xx-small___22HAD">nền trong suốt</p>
            </h3>
            <p className="unblurred x-small___1lJKy">Lưu bản thiết kế của bạn dưới định dạng PNG với nền trong suốt.</p>
         </li>
         <li style={{listStyle: 'none', display: 'flex', marginBottom: '10px',}} className="unblurred leftInfoItem___22wdL">
            <h3 style={{flex: '0 0 100px', margin: 0,}} className="unblurred leftInfoTitle___JX_9_ large___2DVhe">
               PDF
               <p style={{fontSize: '11px'}} className="unblurred xx-small___22HAD">Standard</p>
            </h3>
            <p className="unblurred x-small___1lJKy">Tải xuống dưới dạng PDF.</p>
         </li>
      </ul>
   </div>
   {/* <div className="unblurred x-small___1lJKy leftSideLinkWrapper___BgN52"><span className="unblurred" >Visit our </span><a className="unblurred leftSideLink___1a3wo" href="https://support.crello.com" rel="external noopener noreferrer" target="_blank" data-categ="downloadModal" data-value="helpAndSupport">Help &amp; Support</a> <span className="unblurred">to get detailed answers</span></div> */}
</div>                    </div>
                    <div className="unblurred" style={{width: '100%', position: 'relative'}}>

                    {!this.props.isDownload ? <div style={{
                        padding: '2px',
                        height: '100%',
                    }} className="unblurred content___2kbkg">
                       <div className="unblurred"
                           style={{
                              backgroundColor: 'rgba(0, 0, 0, 0.54)',
                              borderTopRightRadius: '10px',
                              borderBottomRightRadius: '10px',
                              padding: '10px',
                              color: 'white',
                              height: '100%',
                           }}                       
                       >
   <h4 className="unblurred defaultTitle___37St1 large___2DVhe geometria-medium___3wRqs">Tải bản thiết kế</h4>
   <p className="unblurred small___1Vvfz chooseType___aKGtm">Chọn định dạng để tải:</p>
   <ul style={{listStyle: 'none', padding: 0,}} className="unblurred downloadTypes___AkCgx">
      <li style={{listStyle: 'none', marginBottom: '10px',}} className="unblurred downloadTypeItem___cGw_u"><button style={{width: '100%', border: 'none', borderRadius: '5px', color: 'black'}} onClick={this.props.handleDownloadJPG} className="unblurred downloadTypeBtn___3kgiq" data-test="downloadJpg" data-categ="downloadDesign" data-value="jpg">JPG</button></li>
      <li style={{listStyle: 'none', marginBottom: '10px',}} className="unblurred downloadTypeItem___cGw_u"><button style={{width: '100%', border: 'none', borderRadius: '5px', color: 'black'}} onClick={this.props.handleDownloadPNG} className="unblurred downloadTypeBtn___3kgiq" data-categ="downloadDesign" data-value="png">PNG</button></li>
      <li style={{listStyle: 'none', marginBottom: '10px',}} className="unblurred downloadTypeItem___cGw_u"><button style={{width: '100%', border: 'none', borderRadius: '5px', color: 'black'}} onClick={this.props.handleDownloadPNGTransparent} className="unblurred downloadTypeBtn___3kgiq" data-categ="downloadDesign" data-value="pngTransparent">PNG <span className="unblurred downloadTypeBtnText___2myes">Transparent</span></button></li>
      <li style={{listStyle: 'none', marginBottom: '10px',}} className="unblurred downloadTypeItem___cGw_u"><button style={{width: '100%', border: 'none', borderRadius: '5px', color: 'black'}} onClick={this.props.handleDownloadPDF} className="unblurred downloadTypeBtn___3kgiq" data-categ="downloadDesign" data-value="pdfStandart">PDF <span className="unblurred downloadTypeBtnText___2myes">Standard</span></button></li>
      <li style={{listStyle: 'none', marginBottom: '10px',}} className="unblurred downloadTypeItem___cGw_u"><button style={{width: '100%', border: 'none', borderRadius: '5px', color: 'black'}} onClick={this.props.handleDownloadPDFWithBleed} className="unblurred downloadTypeBtn___3kgiq" data-categ="downloadDesign" data-value="pdfStandart">PDF <span className="unblurred downloadTypeBtnText___2myes">with bleed</span></button></li>
   </ul>
   <div 
    className="unblurred"
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                    }}
   >
      <button 
      onClick={this.props.closePopup}
      style={{
          border: 'none',
          backgroundColor: 'transparent',
      }} className="unblurred closeButton___3_ryt closeButtonNew___3gFHf" data-test="onCloseModal" data-categ="downloadModal" data-value="closeModal">
         <svg viewBox="0 0 12 12" width={12} height={12} className="unblurred closeBtnSvg___3O3ue">
            <path d="M11.5671 12C11.4501 11.9997 11.338 11.953 11.2554 11.8701L0.1299 0.737165C0.0883095 0.698515 0.0552686 0.651589 0.0329019 0.599406C0.0105353 0.547223 -0.000661901 0.490937 3.02373e-05 0.434168C-0.000661901 0.377398 0.0105353 0.321112 0.0329019 0.268929C0.0552686 0.216746 0.0883095 0.169821 0.1299 0.131171C0.168766 0.0897632 0.215707 0.0567605 0.267826 0.0342C0.319945 0.0116395 0.376136 0 0.43293 0C0.489723 0 0.545914 0.0116395 0.598033 0.0342C0.650152 0.0567605 0.697093 0.0897632 0.735959 0.131171L11.8701 11.2555C11.953 11.3381 11.9997 11.4502 12 11.5671C11.9978 11.6813 11.9515 11.7901 11.8708 11.8708C11.79 11.9515 11.6812 11.9978 11.5671 12Z" />
            <path d="M0.432899 12C0.376124 12.0007 0.319832 11.9895 0.267643 11.9671C0.215454 11.9447 0.168524 11.9117 0.12987 11.8701C0.089096 11.8308 0.0565992 11.7837 0.0342948 11.7317C0.0119904 11.6796 0.000329744 11.6236 0 11.567C0.000286616 11.45 0.0469958 11.3379 0.12987 11.2553L11.2554 0.12807C11.2956 0.0874892 11.3435 0.0552791 11.3963 0.033298C11.449 0.0113169 11.5056 0 11.5627 0C11.6199 0 11.6765 0.0113169 11.7292 0.033298C11.782 0.0552791 11.8299 0.0874892 11.8701 0.12807C11.9117 0.16673 11.9447 0.213668 11.9671 0.265865C11.9895 0.318061 12.0007 0.374362 12 0.431146C12.0007 0.48793 11.9895 0.54423 11.9671 0.596427C11.9447 0.648624 11.9117 0.695561 11.8701 0.734221L0.735929 11.8701C0.697275 11.9117 0.650344 11.9447 0.598155 11.9671C0.545967 11.9895 0.489675 12.0007 0.432899 12Z" />
         </svg>
      </button>
   </div>
   </div>
</div>  : <div
   style={{
      padding: '39px 40px',
      height: '293px',
  }}
   className="unblurred"><h1 style={{textAlign: 'center'}} className="unblurred">Đang tải</h1>
      <Loader className="unblurred" show={true} black={true}/>
   </div>
                    }             
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
        width: 800px;
        height: 277px;
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