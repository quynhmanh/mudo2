import * as React from "react";
import { withRouter } from "react-router";
import { NavLink } from "react-router-dom";
import Globals from "@Globals";
import AccountService from "@Services/AccountService";
import { Dropdown, Collapse } from "bootstrap3-native";
import bind from 'bind-decorator';
import '@Styles/topMenu.scss';

class TopMenu extends React.Component<{}, { logoutAction: boolean, show: string, menuHover: boolean, tabHover: string }> {

    constructor(props) {
        super(props);
        this.state = { logoutAction: false, show: null, menuHover: false, tabHover : null };
    }

    @bind
    async onClickSignOut(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();

        await AccountService.logout();
        this.setState({ logoutAction: true });
    }

    private elDropdown: HTMLAnchorElement;
    private elCollapseButton: HTMLButtonElement;

    componentDidMount() {
        if (this.elDropdown)
            var dropdown = new Dropdown(this.elDropdown);

        if (this.elCollapseButton)
            var collapse = new Collapse(this.elCollapseButton);
    }

    getDisplayAttribute(cond: boolean) {
        return cond === true ? "block" : "none";
    }

    componentDidUpdate() {
        if (document.getElementById('content-container')) {
            if (this.state.show || this.state.menuHover) {
                document.getElementById('content-container').style.filter = 'opacity(0.5)';
            } else {
                document.getElementById('content-container').style.filter = '';
            }
        }
    }

    timer = null

    render() {
        const loggedIn = Globals.serviceUser && Globals.serviceUser.username !== undefined;

        return <div className="navbar navbar-default">
            <div className="container container-fluid">
                <div className="navbar-header" style={{marginTop: '10px',}}>
                    <button ref={x => this.elCollapseButton = x} type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <NavLink exact to={'/'} className="navbar-brand" href="#">
                        <div style={{width: '153px', height:'70px', marginLeft: '6px', }}>
                    <svg id="logo" viewBox="0 0 300 100" version="1.1">
    <g id="root" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="group" style={{transform:"translate(118px, 36px)"}}>
            <rect id="Rectangle-14" x="0" y="0" width="83" height="22"></rect>
            <text id="headerText.primary" fontFamily="AvenirNextRoundedPro-Medium" fontWeight="700" letterSpacing="10px" fill="#019fb6" data-text-alignment="C" style={{fontSize: 44}}>
                <tspan x="0" y="30">DRAFT</tspan>
            </text>
        </g>
        <rect id="icon.primary" x="63" y="50" width="35" height="35" display="none" fill="#364f6b"></rect>
        <svg viewBox="0 0 30 30" version="1.1" fill="#364f6b" id="svg_icon.primary" x="3" y="1" width="120" height="100">
            <g id="surface1" fill="#364f6b">
                <path
                    style={{
                        stroke: 'rgb(1, 159, 182)',
                        strokeWidth: '1.6px',
                        strokeLinejoin: 'round',
                        fill: 'none',
                        border: '1px solid black',
                    }}
                    d="M 2.1875 2 C 0.988281 2 0 2.492188 0 4.09375 C 0 13.792969 1.085938 15.5 8.1875 15.5 C 3.085938 15.5 2.3125 19.113281 2.8125 20.3125 C 3.8125 22.8125 5.988281 25 7.6875 25 C 8.332031 25 11.71875 23.097656 13 18.90625 C 14.28125 23.097656 17.667969 25 18.3125 25 C 20.011719 25 22.1875 22.8125 23.1875 20.3125 C 23.6875 19.113281 22.914063 15.5 17.8125 15.5 C 24.914063 15.5 26 13.792969 26 4.09375 C 26 2.492188 25.011719 2 23.8125 2 C 21.242188 2 14.800781 7.496094 13 12.84375 C 11.199219 7.496094 4.757813 2 2.1875 2 Z " fill="#019fb6"></path>
            </g>
        </svg>
    </g>
</svg>
</div>
                    </NavLink>
                </div>
                <div id="navbar" className="navbar-collapse collapse nav navbar-nav navbar-right">
                    <ul className="nav navbar-nav">
                        {/* <li><NavLink exact to={'/example'} activeClassName="active">Example</NavLink></li> */}
                        {/* <li><NavLink exact to={'/templates'} activeClassName="active">Mẫu thiết kế</NavLink></li> */}
                        {/* <li><NavLink exact to={'/editor'} activeClassName="active">Learn</NavLink></li> */}
                        {/* <li><NavLink exact to={'/cart'} activeClassName="active">Giỏ hàng</NavLink></li> */}
                        <li className="dropdown">
                            <a href="#" ref={x => this.elDropdown = x} className="dropdown-toggle" style={{display: this.getDisplayAttribute(loggedIn)}} data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                {Globals.serviceUser && Globals.serviceUser.username}&nbsp;
                                <span className="caret"></span>
                            </a>
                            <NavLink exact to={'/login'} activeClassName="active" style={{display: this.getDisplayAttribute(!loggedIn)}}>Đăng nhập</NavLink>
                            <ul className="dropdown-menu">
                                <li><NavLink exact to={'/account'} activeClassName="active">Thông tin tài khoản</NavLink></li>
                                <li><a href="#" onClick={this.onClickSignOut}>Quản lí đơn hàng</a></li>
                                <li><a href="#" onClick={this.onClickSignOut}>Địa chỉ của tôi</a></li>
                                <li><a href="#" onClick={this.onClickSignOut}>Thẻ của tôi</a></li>
                                <li><a href="#" onClick={this.onClickSignOut}>Mã quà tặng</a></li>
                                <li><a href="#" onClick={this.onClickSignOut}>Thoát</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            {/* <div style={{padding: '0px 15px', bottom: 0, position: 'absolute', margin: 'auto', left: 0, right: 0 }} className="container container-fluid">
                <div
                    onMouseOver={(e) => {clearTimeout(this.timer); this.setState({ show: "show1" })}}
                    onMouseLeave={(e) => { clearTimeout(this.timer); this.timer = setTimeout(() =>  {if (this.state.show === "show1" && !this.state.menuHover) {this.setState({ show: null })}}, 200)}}
                    className="menu" 
                    style={{
                        display: 'inline-block',
                        padding: '2px 10px 0px',
                    }}>
                    <h4
                        className={this.state.show === "show1" ?  "menu" : null}
                        style={{
                            margin: '0px',
                            display: 'inline-block',
                            lineHeight: '38px',
                            fontSize: '15px',
                            fontWeight: 400,
                        }} 
                        >
                            Danh thiếp
                    </h4>
                    <div className="border" style={{transform: (this.state.show === "show1") ? 'scaleX(1)': ''}}></div>
                </div>
                <div
                    className="menu" 
                    style={{
                        display: 'inline-block',
                        padding: '2px 10px 0px',
                    }}>
                    <h4
                        className={this.state.show === "show2" ?  "menu" : null}
                        style={{
                            margin: '0px',
                            display: 'inline-block',
                            lineHeight: '38px',
                            fontSize: '15px',
                            fontWeight: 400,
                        }} 
                        onMouseOver={(e) => {clearTimeout(this.timer); this.setState({ show: "show2" })}}
                        onMouseLeave={(e) => {clearTimeout(this.timer); this.timer = setTimeout(() =>  {if (this.state.show === "show2" && !this.state.menuHover) {this.setState({ show: null })}}, 200)}}
                        >
                            Sản phẩm in
                    </h4>
                    <div className="border" style={{transform: (this.state.show === "show2") ? 'scaleX(1)': ''}}></div>
                </div>
                <div
                    className="menu" 
                    style={{
                        display: 'inline-block',
                        padding: '2px 10px 0px',
                    }}>
                    <h4
                        className={this.state.show === "show3" ?  "menu" : this.state.menuHover ? "menu-hover" : null}
                        style={{
                            margin: '0px',
                            display: 'inline-block',
                            lineHeight: '38px',
                            fontSize: '15px',
                            fontWeight: 400,
                        }} 
                        onMouseOver={(e) => {clearTimeout(this.timer); this.setState({ show: "show3" })}}
                        onMouseLeave={(e) => {clearTimeout(this.timer); this.timer = setTimeout(() =>  {if (this.state.show === "show3" && !this.state.menuHover) {this.setState({ show: null })}}, 200)}}                        >
                            Business cards
                    </h4>
                    <div className="border" style={{transform: (this.state.show === "show3") ? 'scaleX(1)': ''}}></div>
                </div>
            </div> */}
        </div>;
    }
}

export default withRouter(TopMenu as any);