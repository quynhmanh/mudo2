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
                                                    <div className="card center-card">
                                                        
      <div className="card-body" style={{display: 'inline-block', border: '1px solid rgba(0,0,0,.125)', width: '300px', height: '150px', padding: '0 20px', position: 'relative', borderRadius: '.25rem', right: '24px'}}><img src="https://avatars2.githubusercontent.com/u/9525970?s=400&u=729b463051f86ba79d9aa05c3c19b3420b162be4&v=4" className="card-img-right avatar-img" style={{height: '60px', borderRadius: '50%', position: 'absolute', right: '10px', top: '10px'}} /><h3 className="card-title">Quynh Nguyen</h3><p className="card-text text-muted">Author</p><a target="_blank" href="https://twitter.com/_nghiatran"><i className="fa fa-twitter mr-8" /></a><a target="_blank" href="https://github.com/NghiaTranUIT"><i className="fa fa-github mr-8" /></a><a target="_blank" href="https://www.linkedin.com/in/vinhnghiatran"><i className="fa fa-linkedin mr-8" /></a><a target="_blank" href="https://www.facebook.com/nghia.tran.9883"><i className="fa fa-facebook mr-8" /></a></div>
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
