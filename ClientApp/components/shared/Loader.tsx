import "@Styles/loader.scss";
import * as React from "react";
import { isNode } from "@Utils";
import AppComponent from "@Components/shared/AppComponent";

export interface IProps {
    show: boolean;
    black: boolean;
    className: string;
}

export default class Loader extends AppComponent<IProps, {}> {

    constructor(props) {
        super(props);
    }

    render() {

        // var css = {"display": "none"};
        var css = { "display": (this.props.show ? "block" : "none") }

        // if (!isNode()) {
        //     css = { "display": (this.props.show ? "block" : "none") }
        // }

        return <div key={this.renderKey} className={`loader-bg ${this.props.className}`} style={css}>
                   <div className={`sk-circle ${this.props.className}`}>
                       <div className={`sk-circle1 sk-child ${this.props.className} ${this.props.black ? 'sk-child-black' : 'sk-child-white'}`}></div>
                       <div className={`sk-circle2 sk-child ${this.props.className} ${this.props.black ? 'sk-child-black' : 'sk-child-white'}`}></div>
                       <div className={`sk-circle3 sk-child ${this.props.className} ${this.props.black ? 'sk-child-black' : 'sk-child-white'}`}></div>
                       <div className={`sk-circle4 sk-child ${this.props.className} ${this.props.black ? 'sk-child-black' : 'sk-child-white'}`}></div>
                       <div className={`sk-circle5 sk-child ${this.props.className} ${this.props.black ? 'sk-child-black' : 'sk-child-white'}`}></div>
                       <div className={`sk-circle6 sk-child ${this.props.className} ${this.props.black ? 'sk-child-black' : 'sk-child-white'}`}></div>
                       <div className={`sk-circle7 sk-child ${this.props.className} ${this.props.black ? 'sk-child-black' : 'sk-child-white'}`}></div>
                       <div className={`sk-circle8 sk-child ${this.props.className} ${this.props.black ? 'sk-child-black' : 'sk-child-white'}`}></div>
                       <div className={`sk-circle9 sk-child ${this.props.className} ${this.props.black ? 'sk-child-black' : 'sk-child-white'}`}></div>
                       <div className={`sk-circle10 sk-child ${this.props.className} ${this.props.black ? 'sk-child-black' : 'sk-child-white'}`}></div>
                       <div className={`sk-circle11 sk-child ${this.props.className} ${this.props.black ? 'sk-child-black' : 'sk-child-white'}`}></div>
                       <div className={`sk-circle12 sk-child ${this.props.className} ${this.props.black ? 'sk-child-black' : 'sk-child-white'}`}></div>
                   </div>
               </div>;
    }
}