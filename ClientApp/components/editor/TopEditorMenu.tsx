import * as React from "react";
import { withRouter } from "react-router";
import { NavLink, Redirect } from "react-router-dom";
import Globals from "@Globals";
import AccountService from "@Services/AccountService";
import { Dropdown, Collapse } from "bootstrap3-native";
import bind from 'bind-decorator';

class TopEditorMenu extends React.Component<{}, { logoutAction: boolean }> {

    constructor(props) {
        super(props);
        this.state = { logoutAction: false };
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
    }

    render() {
        if (this.state.logoutAction)
            return <Redirect to="/login" />;

        return <div style={{
            color: '#3e3e3e',
            border: 'none',
            borderRadius: 0,
            minHeight: '40px',
            backgroundColor: 'white',
            height: '100px',
            marginBottom: 0,
        }} className="navbar navbar-default">
            <div className="container-fluid">
                <div className="navbar-header">
                    <button ref={x => this.elCollapseButton = x} type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand" href="#"><div style={{width: '70px', height:'70px' }}>
                    <svg><g id="shape.accent" fill="#69e9f5"><polygon points="61.5 0 82 41 41 41"></polygon><path d="M61.45 81.9l-20.45 -40.9l41 0l-0.05 0.1l20.45 40.9l-41 0l0.05 -0.1z" fill-opacity=".8"></path><path d="M20.5 82l41 0l-20.5 41l-41 0l20.5 -41z"></path><polygon fill-opacity=".8" points="41 41 61.5 82 20.5 82"></polygon><path d="M122.85 122.9l0.05 0.1l-41 0l20.45 -40.9l-0.05 -0.1l41 0l-20.45 40.9z" fill-opacity=".8"></path><polygon points="122.8 41 143.3 82 102.3 82"></polygon><path d="M163.6 41l20.5 41l-41 0l-20.5 -41l41 0z" fill-opacity=".8"></path><polygon fill-opacity=".6" points="143.1 0 163.6 41 122.6 41"></polygon><polygon points="163.6 123 143.1 82 184.1 82"></polygon><polygon fill-opacity=".8" points="184.1 82 204.6 123 163.6 123"></polygon><polygon fill-opacity=".6" points="81.9 123 61.4 82 102.4 82"></polygon></g></svg>         </div></a>
                </div>
                <div id="navbar" className="navbar-collapse collapse nav navbar-nav navbar-right">
                    <ul className="nav navbar-nav">
                        <li><NavLink exact to={'/'} activeClassName="active">Home</NavLink></li>
                        <li><NavLink exact to={'/example'} activeClassName="active">File</NavLink></li>
                        <li><NavLink exact to={'/editor'} activeClassName="active">Resize</NavLink></li>
                        <li className="dropdown">
                            <a href="#" ref={x => this.elDropdown = x} className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                {Globals.serviceUser.username}&nbsp;
                                <span className="caret"></span>
                            </a>
                            <ul className="dropdown-menu">
                                <li><a href="#" onClick={this.onClickSignOut}>Sign out</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>;
    }
}

export default withRouter(TopEditorMenu as any);