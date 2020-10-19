import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { isNode } from "@Utils";

type Props = RouteComponentProps<{}>;

export interface IProps { }

interface IState {
    tab: string;
}

export default class PrintPage extends React.Component<IProps, IState> {
    state = {
        tab: "find"
    };
    constructor(props) {
        super(props);
    }

    componentDidMount() { }

    render() {
        return (
            <div>
                <Helmet>
                    <title>About us</title>
                </Helmet>
                {!isNode() &&
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12  col-md-12" role="main">
                                {/* Post with featured image */}
                                <article className="boxed push-down-45 post-3263 page type-page status-publish has-post-thumbnail hentry">
                                    {/* Start of the blogpost */}
                                    <div className="row">
                                        <div className="col-xs-10  col-xs-offset-1  push-down-30">
                                            <div className="post-content">
                                                <h1 style={{
                                                    // textAlign: "center",
                                                    margin: "50px 0",
                                                }} className="post-content__title  entry-title">About Us</h1>

                                                <div className="">
                                                    <div className="col-sm mb-16">
                                                        <div 
                                                            style={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                            }}
                                                            className="card center-card">

                                                            <div className="card-body" style={{ display: 'inline-block', border: '1px solid rgba(0,0,0,.125)', width: '300px', height: '130px', padding: '0 20px', position: 'relative', borderRadius: '.25rem', right: '24px' }}><img src="https://avatars2.githubusercontent.com/u/9525970?s=400&u=729b463051f86ba79d9aa05c3c19b3420b162be4&v=4" className="card-img-right avatar-img" style={{ height: '100px', borderRadius: '50%', position: 'absolute', right: '10px', top: '10px' }} />
                                                            <h3 className="card-title">Quynh Nguyen</h3>
                                                            <p className="card-text text-muted">Author</p><a target="_blank" href="https://twitter.com/_nghiatran">
                                                            <a href="https://www.linkedin.com/in/quynh-manh-110749107/"><svg style={{marginRight: "10px"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
                                                            <a href="https://www.facebook.com/quynh1996/"><svg style={{width: "24px", height: "24px"}} xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" width="60.734px" height="60.733px" viewBox="0 0 60.734 60.733" xmlSpace="preserve">
<g>
	<path d="M57.378,0.001H3.352C1.502,0.001,0,1.5,0,3.353v54.026c0,1.853,1.502,3.354,3.352,3.354h29.086V37.214h-7.914v-9.167h7.914   v-6.76c0-7.843,4.789-12.116,11.787-12.116c3.355,0,6.232,0.251,7.071,0.36v8.198l-4.854,0.002c-3.805,0-4.539,1.809-4.539,4.462   v5.851h9.078l-1.187,9.166h-7.892v23.52h15.475c1.852,0,3.355-1.503,3.355-3.351V3.351C60.731,1.5,59.23,0.001,57.378,0.001z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg></a>
                                                                <i className="fa fa-twitter mr-8" /></a><a target="_blank" href="https://github.com/NghiaTranUIT"><i className="fa fa-github mr-8" /></a><a target="_blank" href="https://www.linkedin.com/in/vinhnghiatran"><i className="fa fa-linkedin mr-8" /></a><a target="_blank" href="https://www.facebook.com/nghia.tran.9883"><i className="fa fa-facebook mr-8" /></a></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </div>}
            </div>
        );
    }
}
