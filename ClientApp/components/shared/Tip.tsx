﻿import React, {PureComponent} from "react";
import {createPortal} from "react-dom";
import {isEqual} from "lodash";

export interface IProps {
    isOpen: boolean;
    position: string;
    $text: any;
    offsetLeft: number;
    offsetTop: number;
    content: React.ReactNode;
    inflexible: boolean;
    backgroundColor: string;
    tipbaseClass: string;
}

export interface IState {
    // offsetLeft: number;
    // offsetTop: number;
    isOpen: boolean;
    className: string;
    position: string;
    prevProps: object;
}

export default class Tip extends PureComponent<IProps, IState> {
    state = {
        className: "",
        // offsetLeft: 0,
        // offsetTop: 0,
        prevProps: this.props,
        isOpen: this.props.isOpen,
        position: this.props.position
    };

    static getDerivedStateFromProps(props, {prevProps}) {
        if (!isEqual(prevProps, props)) {
            return {prevProps: props, isOpen: props.isOpen, position: props.position};
        }
        return null;
    }

    ref;

    componentDidUpdate({isOpen: wasOpen} = {
        isOpen: true
    }) {
        const {isOpen} = this.props || {
            isOpen: false
        };
        if (!wasOpen && isOpen) {
            this.position();
        } else if (wasOpen && !isOpen) {
            if (this.$tip) {
                this.$tip.classList.remove("is-open");
            }
        }
    }

    get $tipBase(): any {
        return this.ref;
    }

    get $tip(): any {
        return this.$tipBase;
    }

    position = () => {
        const {
            $text,
            position,
            inflexible,
            children,
            content,
            offsetTop,
            offsetLeft
        } = this.props;
        const {$tipBase, $tip} = this;

        if (!$text) 
            return;
        
        const {top, right, bottom, left} = $text.getBoundingClientRect();
        const {offsetWidth: wOf$text, offsetHeight: hOf$text} = $text;

        var rec = $text.getBoundingClientRect();
        var rec2 = $tip.getBoundingClientRect();

        console.log('wOf$text',  $text, wOf$text, left, $text.getBoundingClientRect())

        const midXOf$text = left + wOf$text / 2;
        const midYOf$text = top + hOf$text / 2;

        const tipStyle = {
            position: "absolute"
        };
        const setStyleForTip = src => Object.assign(tipStyle, src);

        let topTip = position == "top" ? `${midYOf$text - hOf$text / 2 - rec2.height + offsetTop}px` : `${midYOf$text - rec2.height/2}px`;
        if (position == "bottom") {
            topTip = `${midYOf$text + hOf$text / 2 + offsetTop}px`;
        }
        let leftTip = midXOf$text - rec2.width/2 + offsetLeft;

        var screenWidth = document.body.getBoundingClientRect().width;

        if (leftTip + rec2.width > screenWidth) {
            leftTip = screenWidth - rec2.width;
        }

        setStyleForTip({
            top: topTip,
            left: `${leftTip}px`,
            textAlign: "center"
        });

        Object.assign($tip.style, tipStyle);
        $tip.classList.add("is-open");
    };

    onTransitionEnd = () => {
        const {isOpen} = this.props || {
            isOpen: false
        };

        if (isOpen) {
            this.$tip.classList.add("is-open");
        } else {
            this.setState({isOpen: false});
        }
    };

    render() {
        const {isOpen} = this.state || {
            isOpen: false
        };

        if (isOpen) {
            return createPortal(this.tip, window.document.body);
        }
        return null;
    }

    get tip() {
        const {children, backgroundColor, tipbaseClass} = this.props;
        const {isOpen} = this.state || {
            isOpen: false
        };

        return (isOpen && (<div className={"TipBase" + " " + tipbaseClass}
        style={{
            backgroundColor: backgroundColor,
        }} 
        ref={i => this.ref = i}
        >
            <div style={{
                    padding: "3px 5px"
                }} onTransitionEnd={this.onTransitionEnd}>
                <div className="content">{children}</div>
            </div>
        </div>));
    }
}
