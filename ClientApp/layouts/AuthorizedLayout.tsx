import TopMenu from "@Components/shared/TopMenu";
import * as React from "react";
import "@Styles/authorizedLayout.scss";
import { ToastContainer } from "react-toastify";
import Footer from "@Components/shared/Footer";
import { Route, Link } from "react-router-dom";

interface IProps {
    children?: React.ReactNode;
}

type Props = IProps;


const Breadcrumbs = () => <Route path="*" render={props => {
    let parts = props.location.pathname.split("/");
    console.log('props.location.pathname ', props.location.pathname)
    // parts = ['home', ...parts.splice(1, parts.length-1)];
    console.log('parts', parts)
    const place = parts[parts.length-1];
    parts = parts.slice(1, parts.length-1);
    if (!place) {
        return null;
    }
    console.log('place ', place)
    // parts = ["home", ...parts];
    return <div style={{padding: '10px',}}>
        {crumb('home', 0, ['home', ...parts])}
        {parts.map(crumb)}
        <span style={{marginLeft: '8px'}}>{place}</span>
    </div>}} />
  
  const crumb = (part, partIndex, parts) => {
        console.log('part ', part);
        const path = ['', ...parts.slice(0, partIndex+1)].join("/");
        return <Link style={{
            color: 'black',
            textDecoration: 'none',
            position: "relative",
            padding: '0.25rem 0.625rem 0.3125rem 0.75rem',
            backgroundColor: '#e9ecef',
            borderTopRightRadius: '0.5rem',
            borderBottomRightRadius: '0.5rem',
            marginLeft: '-2px',
            zIndex: parts.length - partIndex,
        }} key={path} to={path} >{part}<span className="breadcrumbs__separator"></span></Link>}
  

export default class AuthorizedLayout extends React.Component<Props, {}> {
    public render() {

        return <div id="authorizedLayout" className="layout">
            <TopMenu />
            <div className="container container-content">
            <Breadcrumbs />
            </div>
            <div id='content-container'>
                    {this.props.children}
            </div>
            <ToastContainer />
            <Footer />
        </div>;
    }
}