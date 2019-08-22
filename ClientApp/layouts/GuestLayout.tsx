import "@Styles/guestLayout.scss";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ToastContainer } from "react-toastify";
import TopMenu from '@Components/shared/TopMenu';


interface IProps {
    children: any;
}

type Props = IProps & RouteComponentProps<any> ;

export default class GuestLayout extends React.Component<Props, {}> {
    public render() {

        return <div id="guestLayout">
                <TopMenu />
                <div
                  id="456"
                  style={{
                    backgroundColor: '#558ca7',
                    height: '600px',
                    position: 'relative',
                  }}
                >
                  <img 
                    style={{
                      height: '100%',
                      display: 'block',
                      left: '30%',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      transform: 'translateX(-50%)',
                      maxWidth: 'none',
                      position: 'absolute',
                    }}
                    src="https://b.imge.to/2019/08/22/mACAU.jpg" />
                <div className="container container-content">
                    {this.props.children}
                </div>
                </div>
                <div
                    style={{
                        backgroundColor: 'white',
                    }}
                >
                <div
                  id="456"
                  style={{
                  }}
                  // style={{
                  //   backgroundImage: 'url(images/Kwb3ggnPi0Wzp6nRw3ov7Q.png)',
                  //   backgroundSize: '100% 100%',
                  //   backgroundRepeat: 'no-repeat',
                  // }}
                >
                <div className="container container-content">
      <div style={{
          color: 'white',
          padding: '30px 0',
          // backgroundImage: 'url(images/Kwb3ggnPi0Wzp6nRw3ov7Q.png)',
          // backgroundSize: '100% 100%',
          // backgroundRepeat: 'no-repeat',
      }} className="jsx-104637934 footer-section">
        <div className="jsx-104637934 container">
          <div className="jsx-104637934 upper">
            <div className="jsx-104637934 row">
              <div className="jsx-104637934 col-md-2 col-4 contact">
                <h4 className="jsx-104637934 title">Liên hệ</h4>
                <div className="jsx-104637934 body">
                  <ul className="jsx-104637934 list-unstyled">
                    <li className="jsx-104637934"><a href="mailto:19006710" className="jsx-104637934">0766145165</a></li>
                    <li className="jsx-104637934"><a href="mailto:help@leflair.vn" className="jsx-104637934">help@mudo.vn</a></li>
                  </ul>
                </div>
              </div>
              <div className="jsx-104637934 col-md-2 col-4 company">
                <h4 className="jsx-104637934 title">Doanh nghiệp</h4>
                <div className="jsx-104637934 body">
                  <ul className="jsx-104637934 list-unstyled">
                    <li className="jsx-104637934"><a href="https://pages.leflair.vn/about-us" className="jsx-104637934">Về MUDO</a></li>
                    <li className="jsx-104637934"><a href="https://styleguide.leflair.vn/" className="jsx-104637934">Style Guide</a></li>
                    <li className="jsx-104637934"><a href="https://pages.leflair.vn/partners" className="jsx-104637934">Hợp tác</a></li>
                    <li className="jsx-104637934"><a href="https://pages.leflair.vn/genuine-guarantee" className="jsx-104637934">Chính hãng</a></li>
                    <li className="jsx-104637934"><a href="https://careers.leflair.vn" className="jsx-104637934">Tuyển dụng</a></li>
                    <li className="jsx-104637934"><a className="jsx-104637934" href="/vn/brands">Thương hiệu</a></li>
                  </ul>
                </div>
              </div>
              <div className="jsx-104637934 col-md-4 col-4 customer-service">
                <h4 className="jsx-104637934 title">Chăm sóc khách hàng</h4>
                <div className="jsx-104637934 body">
                  <ul className="jsx-104637934 list-unstyled">
                    <li className="jsx-104637934"><a target="_blank" href="https://support.leflair.vn/hc/vi" className="jsx-104637934">Hỏi đáp</a></li>
                    <li className="jsx-104637934"><a target="_blank" href="https://support.leflair.vn/hc/vi/articles/214167448-Ch%C3%ADnh-s%C3%A1ch-tr%E1%BA%A3-h%C3%A0ng-v%C3%A0-ho%C3%A0n-ti%E1%BB%81n" className="jsx-104637934">Đổi trả</a></li>
                    <li className="jsx-104637934"><a target="_blank" href="https://support.leflair.vn/hc/vi/articles/214857097-%C4%90i%E1%BB%81u-kho%E1%BA%A3n-v%C3%A0-quy-%C4%91%E1%BB%8Bnh-chung" className="jsx-104637934">Điều khoản &amp; quy định</a></li>
                    <li className="jsx-104637934"><a target="_blank" href="https://support.leflair.vn/hc/vi/articles/214167378-Ch%C3%ADnh-s%C3%A1ch-giao-v%C3%A0-nh%E1%BA%ADn-h%C3%A0ng" className="jsx-104637934">Giao hàng</a></li>
                    <li className="jsx-104637934"><a target="_blank" href="https://support.leflair.vn/hc/vi/articles/214113678-T%C3%B4i-c%C3%B3-nh%E1%BA%ADn-%C4%91%C6%B0%E1%BB%A3c-h%C3%B3a-%C4%91%C6%A1n-GTGT-trong-b%C6%B0u-ki%E1%BB%87n-kh%C3%B4ng-" className="jsx-104637934">Thuế</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="jsx-104637934 lower">
            <div className="jsx-104637934 row">
              <div className="jsx-104637934 col-md-8">
                <div className="jsx-104637934 row">
                  <div className="jsx-104637934 col-md-6 copyright">
                    <a href="http://www.online.gov.vn/HomePage/CustomWebsiteDisplay.aspx?DocId=19306" target="_blank" rel="noreferrer" className="jsx-104637934 gov-link">
                        </a><span className="jsx-104637934 text">Copyright @ 2019 mudo.vn</span></div>
                  {/* <div className="jsx-104637934 col-md-6 address">Công ty Cổ phần Leflair - Tầng 16, Tháp A2, Tòa nhà Viettel, 285 Cách Mạng Tháng Tám, P.12, Q.10, TP.HCM</div> */}
                </div>
              </div>
              {/* <div className="jsx-104637934 col-md-4">Cơ quan cấp: Sở Kế hoạch và Đầu tư Thành phố Hồ Chí Minh</div> */}
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
      </div>
                <ToastContainer />
            </div>;
    }
}