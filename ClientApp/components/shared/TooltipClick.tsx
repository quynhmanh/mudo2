import "@Styles/tooltip.scss";
import React, {PureComponent, Fragment, isValidElement} from "react";
import {isArray, isEqual, isString, isObject} from "lodash";
import {trimList, getOtherProps} from "@Utils";
import {TYPE_ELEMENT_MAP} from "@Constants";
import Tip from "@Components/shared/Tip";

import AppComponent from "@Components/shared/AppComponent";

const EVENT_NAME_LIST: string[] = ["hover", "click"];

function parseContent(content : any, eventName : string = "hover") {
    return isString(content) || isArray(content) || isValidElement(content)
        ? content
        : EVENT_NAME_LIST.includes(eventName) && isObject(content)
            ? content[eventName] || content.hover
            : null;
}

export interface IProps {
    offsetLeft: number;
    offsetTop: number;
    children: React.ReactNode;
    content: any;
    delay: number;
    style: any;
    position: string;
}

export interface IState {
    isOpen: boolean;
    isClicked: boolean;
}

export default class Tooltip extends AppComponent<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isClicked: false
        };
    }

    ref = React.createRef();

    onMouseEnter = () => Object.assign(this, {hoverTimeout: setTimeout(() => this.setState({
            isOpen: !!parseContent(this.props.content, "hover")
        }), this.props.delay)});

    hoverTimeout = null;

    onMouseLeave = () => {
        clearTimeout(this.hoverTimeout);

        // this.setState({isOpen: false, isClicked: false});
    };

    onClick = e => {
        this.setState({
            isOpen: !!parseContent(this.props.content, "click"),
            isClicked: true
        });

        e.persist();

        document.addEventListener("mouseup", (e) => {
            this.setState({isClicked: false})
        })
    };

    render() {
        const {children, offsetTop, offsetLeft, content, position, } = this.props;

        const {isOpen, isClicked} = this.state;

        const klass = trimList([
            "Tooltip-2", isOpen
                ? "is-open"
                : "",
            isClicked
                ? "is-clicked"
                : ""
        ]);

        const eventName = isClicked
            ? "click"
            : "hover";

        return React.createElement(
        // Name:
        "span",

        // Props:
        {
            ref: this.ref,
            className: klass,
            onMouseEnter: this.onMouseEnter,
            onClick: this.onClick,
            onMouseLeave: this.onMouseLeave,
            ...this.props,
        },

        // Children:
        <Fragment>
            {children}

            <Tip backgroundColor={null}  offsetLeft={offsetLeft} offsetTop={offsetTop} content={children} $text={this.ref.current} isOpen={isClicked} position={position ? position : "top"} inflexible={true}>
                {parseContent(content, eventName)}
            </Tip>
        </Fragment>);
    }
}
