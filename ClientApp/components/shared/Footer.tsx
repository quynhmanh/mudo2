import * as React from "react";

export default class Footer extends React.Component<{translate}, {}> {
    constructor(props) {
        super(props);
    }
    render() {
        return <div>
            <div 
            style={{
                background: '#333',
                color: 'white',
                padding: '30px 0',
            }} className="jsx-104637934 footer-section">
                <div className="jsx-104637934 container">
                    <div className="jsx-104637934 upper">
                        <div className="jsx-104637934 row">
                            <div className="jsx-104637934 col-md-2 col-4 contact">
                                <h4 style={{marginTop: 0,}} className="jsx-104637934 title">Draft</h4>
                                <div className="jsx-104637934 body">
                                    <ul className="jsx-104637934 list-unstyled">
                                        <li className="jsx-104637934"><a href="/about-us" className="jsx-104637934">{this.props.translate("aboutUs")}</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="jsx-104637934 col-md-2 col-4 contact">
                                <h4 style={{marginTop: 0,}} className="jsx-104637934 title">{this.props.translate("contact")}</h4>
                                <div className="jsx-104637934 body">
                                    <ul className="jsx-104637934 list-unstyled">
                                        <li className="jsx-104637934"><a href="mailto:19006710" className="jsx-104637934">(+84)766145165</a></li>
                                        <li className="jsx-104637934"><a href="mailto:help@draft.vn" className="jsx-104637934">help@draft.vn</a></li>
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
                                        </a><span className="jsx-104637934 text">Copyright @ 2020 draft.vn</span></div>
                                    {/* <div className="jsx-104637934 col-md-6 address">Công ty Cổ phần Leflair - Tầng 16, Tháp A2, Tòa nhà Viettel, 285 Cách Mạng Tháng Tám, P.12, Q.10, TP.HCM</div> */}
                                </div>
                            </div>
                            {/* <div className="jsx-104637934 col-md-4">Cơ quan cấp: Sở Kế hoạch và Đầu tư Thành phố Hồ Chí Minh</div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}