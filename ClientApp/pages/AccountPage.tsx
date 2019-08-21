import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Helmet } from "react-helmet";
import logo from "@Images/logo.png";
import TreeViewContainer from "@Components/shared/TreeViewContainer";
import axios from "axios";

type Props = RouteComponentProps<{}>;

export default class AccountPage extends React.Component<Props, {orders, selectedTab}> {
    state = {
        orders: [],
        selectedTab: 1,
    }
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var self = this;
        var url = `/api/Order/Search`;
        axios.get(url).then(
            res => {
                console.log(' res  r ', res);
                self.setState({
                    orders: res.data.value.key,
                })
            }
        )
    }

    render() {
        return <div>
            <Helmet>
                <title>Home page - RCB (TypeScript)</title>
            </Helmet>
            <div className="container-content">
        <div style={{display: 'flex'}} className="container">
          <div
            style={{
                width: '100%',
                display: 'flex',
                margin: '10px',
            }}
          >
            <div
                style={{
                    marginRight: '20px',
                    width: '300px',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    minHeight: '400px',
                    borderRadius: '0.3125rem',
                    padding: '10px',
                }}
            >
                <ul className="sidebar-selector" style={{listStyle: 'none', padding: 0,}}>
                    <li><button onClick={() => {this.setState({selectedTab: 1,})}}>Thông tin tài khoản</button></li>
                    <li><button onClick={() => {this.setState({selectedTab: 2,})}}>Quản lý đơn hàng</button></li>
                    <li><button onClick={() => {this.setState({selectedTab: 3,})}}>Địa chỉ của tôi</button></li>
                    <li><button onClick={() => {this.setState({selectedTab: 4,})}}>Mã quà tặng</button></li>
                </ul>
            </div>
            <div
                style={{
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    borderRadius: '0.3125rem',
                    padding: '0 20px',
                }}
            >
                {this.state.selectedTab === 1 && 
                    <div>
                        
      <div className="jsx-2419075365">
        <div className="jsx-1038892047 user-account-settings">
          <h1 className="jsx-1038892047 title-account">Tài khoản</h1>
          <div className="jsx-4204020708 user-settigs-section">
            <div className="jsx-4204020708">
              <div className="jsx-960220893 section-action" style={{display: 'flex',}}>
                <h4 className="jsx-960220893" style={{flex: '1 1 0%'}}>Số dư</h4>
                <span className="jsx-960220893"><span style={{fontSize: '20px'}}><span className="notranslate ">0₫</span></span>
                </span>
              </div>
            </div>
            <p className="jsx-3407573289">Bạn có thể dùng số dư này để thanh toán cho những đơn hàng sau<a className="jsx-3407573289 text-no-underline text-right" href="/vn/account/giftcard">Sử dụng thẻ quà tặng</a></p>
          </div>
          <div className="jsx-4204020708 user-settigs-section">
            <div className="jsx-4204020708">
              <div className="jsx-960220893 section-action">
                <h4 className="jsx-960220893">Thông tin cá nhân</h4><span className="jsx-960220893"><span className="link-style">Sửa</span></span>
              </div>
            </div>
            <div className="">
              <div className="col-4">Họ tên</div>
              <div className="col-8 text-right text-truncate"> </div>
            </div>
            <div className="">
              <div className="col-4">Địa chỉ email</div>
              <div className="col-8 text-right text-truncate">llaugusty@gmail.com</div>
            </div>
          </div>
          <div className="jsx-4204020708 user-settigs-section">
            <div className="jsx-4204020708">
              <div className="jsx-960220893 section-action">
                <h4 className="jsx-960220893">Mật khẩu</h4><span className="jsx-960220893"><span className="link-style">Đổi mật khẩu</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
                    </div>
                }
                {this.state.selectedTab === 2 && this.state.orders.map(order => 
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '10px',
                        }}
                    >
                        <div>
                            <div>{order.fullName},{order.phoneNumber}</div>
                            <div>{order.address},{order.city}</div>
                        </div>
                        <img 
                            style={{
                                width: '150px',
                                boxShadow: '0 0.5px 0 0 #ffffff inset, 0 1px 2px 0 #B3B3B3',
                            }} 
                            src={order.representative} />
                    </div>
                )}
            </div>
          </div>
        </div>
        </div>
            </div>;
    }
}