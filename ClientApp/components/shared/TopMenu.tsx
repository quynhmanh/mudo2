import * as React from "react";
import { withRouter } from "react-router";
import { NavLink, Redirect } from "react-router-dom";
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
        var dropdown = new Dropdown(this.elDropdown);
        var collapse = new Collapse(this.elCollapseButton);
    }

    componentDidUpdate() {
        if (this.state.show || this.state.menuHover) {
            document.getElementById('content-container').style.filter = 'opacity(0.5)';
        } else {
            document.getElementById('content-container').style.filter = '';
        }
    }

    timer = null

    render() {
        if (this.state.logoutAction)
            return <Redirect to="/login" />;

        const {show, menuHover} = this.state;

        return <div className="navbar navbar-default">
            <div className="container container-fluid">
                <div className="navbar-header">
                    <button ref={x => this.elCollapseButton = x} type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <NavLink exact to={'/'} className="navbar-brand" href="#"><div style={{width: '70px', height:'70px', marginLeft: '6px', }}>
                    <svg viewBox="0 0 160 160" version="1.1" id="svg_null">
    <g id="root" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="group" transform="translate(20, 130)">
            <rect id="Rectangle-14" x="0" y="0" width="83" height="22"></rect>
            <text id="headerText.primary" font-family="Amiri" font-size="18" font-weight="700" letter-spacing=".81" fill="#019fb6" data-text-alignment="C" font-style="italic" style={{fontSize: 40}}>
                <tspan x="0" y="30">MUDO</tspan>
            </text>
        </g>
        <rect id="icon.primary" x="63" y="50" width="35" height="35" display="none" fill="#364f6b"></rect>
        <svg viewBox="0 0 30 30" version="1.1" fill="#364f6b" id="svg_icon.primary" x="30" y="15" width="120" height="120">
            <g id="surface1" fill="#364f6b">
                <path d="M 2.1875 2 C 0.988281 2 0 2.492188 0 4.09375 C 0 13.792969 1.085938 15.5 8.1875 15.5 C 3.085938 15.5 2.3125 19.113281 2.8125 20.3125 C 3.8125 22.8125 5.988281 25 7.6875 25 C 8.332031 25 11.71875 23.097656 13 18.90625 C 14.28125 23.097656 17.667969 25 18.3125 25 C 20.011719 25 22.1875 22.8125 23.1875 20.3125 C 23.6875 19.113281 22.914063 15.5 17.8125 15.5 C 24.914063 15.5 26 13.792969 26 4.09375 C 26 2.492188 25.011719 2 23.8125 2 C 21.242188 2 14.800781 7.496094 13 12.84375 C 11.199219 7.496094 4.757813 2 2.1875 2 Z " fill="#019fb6"></path>
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
                        <li><NavLink exact to={'/templates'} activeClassName="active">Templates</NavLink></li>
                        {/* <li><NavLink exact to={'/editor'} activeClassName="active">Learn</NavLink></li> */}
                        <li><NavLink exact to={'/pricing'} activeClassName="active">Account</NavLink></li>
                        <li><NavLink exact to={'/print'} activeClassName="active">Printing</NavLink></li>
                        <li><NavLink exact to={'/about'} activeClassName="active">About</NavLink></li>
                        <li className="dropdown">
                            <a href="#" ref={x => this.elDropdown = x} className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                {Globals.serviceUser && Globals.serviceUser.login}&nbsp;
                                <span className="caret"></span>
                            </a>
                            <ul className="dropdown-menu">
                                <li><a href="#" onClick={this.onClickSignOut}>Sign out</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div style={{padding: '0px 15px', bottom: 0, position: 'absolute', margin: 'auto', left: 0, right: 0 }} className="container container-fluid">
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
                            Printed products
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
            </div>
            {
                (show || menuHover) && 
                <div id="menu-container"
                onMouseOver={(e) => {this.setState({ menuHover:true })}}
                onMouseLeave={(e) => {this.setState({show:null}); setTimeout(() =>  {this.setState({ menuHover:false })}, 200)}}
                style={{
                    top: 'calc(100% + 1px)',
                    position: 'absolute',
                    width: '80%',
                    left: '126px',
                    backgroundColor: 'white',
                }}>
                <div id="menu" style={{width: '25%', display: 'inline-block', borderRight: '1px solid #dcdcdc', transitionDuration: '1s'}}>
                    {show === "show1" && <ul className="show1"  style={{transition: 'height 1s ease', listStyleType: 'none', padding: '13px', paddingRight: 0 }}>
                        <li
                        className={this.state.tabHover === "1" ? "hover" : null}
                        onMouseOver={(e) => {this.setState({tabHover: "1"})}}
                        style={{
                            padding: '6px',
                        }}>Business cards</li>
                        <li 
                        className={this.state.tabHover === "2" ? "hover" : null}
                        onMouseOver={(e) => {this.setState({tabHover: "2"})}}
                        style={{
                            padding: '6px',
                        }}>Square business Cards</li>
                        <li 
                        className={this.state.tabHover === "3" ? "hover" : null}
                        onMouseOver={(e) => {this.setState({tabHover: "3"})}}
                        style={{
                            padding: '6px',
                        }}>Minicards</li>
                    </ul>
                    }
                    {show === "show2" && <ul className="show1"  style={{transition: 'height 1s ease', listStyleType: 'none', padding: '13px', paddingRight: 0 }}>
                        <li 
                        onMouseOver={(e) => {this.setState({tabHover: "bc"})}}
                        style={{
                            cursor: 'pointer',
                            padding: '6px',
                        }}>Postcards</li>
                        <li 
                        onMouseOver={(e) => {this.setState({tabHover: "pp"})}}
                        style={{
                            cursor: 'pointer',
                            padding: '6px',
                        }}>Stickers</li>
                        <li 
                        onMouseOver={(e) => {this.setState({tabHover: "bc"})}}
                        style={{
                            cursor: 'pointer',
                            padding: '6px',
                        }}>Flyers</li>
                        <li 
                        onMouseOver={(e) => {this.setState({tabHover: "pp"})}}
                        style={{
                            cursor: 'pointer',
                            padding: '6px',
                        }}>Card and invitations</li>
                        <li 
                        onMouseOver={(e) => {this.setState({tabHover: "pp"})}}
                        style={{
                            cursor: 'pointer',
                            padding: '6px',
                        }}>Letterhead</li>
                        <li 
                        onMouseOver={(e) => {this.setState({tabHover: "pp"})}}
                        style={{
                            cursor: 'pointer',
                            padding: '6px',
                        }}>Menu</li>
                        <li 
                        onMouseOver={(e) => {this.setState({tabHover: "pp"})}}
                        style={{
                            cursor: 'pointer',
                            padding: '6px',
                        }}>Posters</li>
                        <li 
                        onMouseOver={(e) => {this.setState({tabHover: "pp"})}}
                        style={{
                            cursor: 'pointer',
                            padding: '6px',
                        }}>Compliment slips</li>
                    </ul>
                    }
                </div>
                <div style={{transition: 'height 1s ease', transitionDuration: '1s', width: '25%', display: 'inline-block', backgroundColor: '#ECF0F2', top: 0}}>
                    { 
                        this.state.tabHover == "1" &&
                    <ul style={{transition: 'height 1s ease', listStyleType: 'none', padding: '13px', paddingRight: 0 }}>
                    <li
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Postcards</li>
                    <li 
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Stickers</li>
                    <li 
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Flyers</li>
                    <li 
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Card and invitations</li>
                    <li 
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Letterhead</li>
                    <li 
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Menu</li>
                    <li 
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Posters</li>
                    <li 
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Compliment slips</li>
                    </ul>
                    }
                    { this.state.tabHover == "2" &&
                    <ul style={{listStyleType: 'none', padding: '13px', paddingRight: 0 }}>
                    <li 
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Postcards 2</li>
                    <li 
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Stickers 2</li>
                    <li 
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Flyers 2</li>
                    <li 
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Card and invitations 2</li>
                    <li 
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Letterhead 2</li>
                    </ul>
                    }
                    { this.state.tabHover == "3" &&
                    <ul style={{listStyleType: 'none', padding: '13px', paddingRight: 0 }}>
                    <li 
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Postcards 3</li>
                    <li 
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Stickers 3</li>
                    <li 
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Flyers 3</li>
                    <li 
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Letterhead 3</li>
                    <li 
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Menu 3</li>
                    <li 
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Posters 3</li>
                    <li 
                    style={{
                        cursor: 'pointer',
                        padding: '6px',
                    }}>Compliment slips 3</li>
                    </ul>
                    }
                    { this.state.tabHover == "4" &&
                    <ul style={{listStyleType: 'none', padding: '13px', paddingRight: 0 }}>
                    <li 
                    style={{
                        padding: '6px',
                    }}>Postcards 4</li>
                    <li 
                    style={{
                        padding: '6px',
                    }}>Stickers 4</li>
                    <li 
                    style={{
                        padding: '6px',
                    }}>Flyers 4</li>
                    <li 
                    style={{
                        padding: '6px',
                    }}>Card and invitations 4</li>
                    <li 
                    style={{
                        padding: '6px',
                    }}>Letterhead 4</li>
                    <li 
                    style={{
                        padding: '6px',
                    }}>Menu 4</li>
                    <li 
                    style={{
                        padding: '6px',
                    }}>Posters 4</li>
                    <li 
                    style={{
                        padding: '6px',
                    }}>Compliment slips 4</li>
                    </ul>
                    }
                </div>
                <div style={{width: '25%', display: 'inline-block'}}>
                    <span>Business cards</span>
                    <span>Printed products</span>
                    <span>Acessories</span>
                    <span>Inspiration</span>
                    <span>Help & FAQs</span>
                </div>
                <div style={{width: '25%', display: 'inline-block'}}>
                    <span>Business cards</span>
                    <span>Printed products</span>
                    <span>Acessories</span>
                    <span>Inspiration</span>
                    <span>Help & FAQs</span>
                </div>
            </div> 
            }
        </div>;
    }
}

export default withRouter(TopMenu as any);