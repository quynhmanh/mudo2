import React, { Component } from 'react'
import styled from "styled-components";
import { TemplateType } from '../enums';
import { getLetterSpacing, processChildren, } from "@Utils";
import Editor from '@Pages/Editor';
import editorStore from "@Store/EditorStore";

export interface IProps {
    image: any;
    canvas: any;
    scale: any;
}

export interface IState {
}

const GradientContainer = styled.div`
	z-index: 9999999;
	opacity: 1;
	transform-origin: 0 0;
	
	svg {
		width: 100%;
		height: 100%;
	}
`;

export default class Gradient extends Component<IProps, IState> {

    constructor(props: any) {
        super(props);
        this.state = {
            loaded: false,
        }
    }

    componentDidMount() {
        const {
            image: {
                type
            }
        } = this.props;

        if (type == TemplateType.Gradient ||
			type == TemplateType.Shape) {
			let el = document.getElementById(this.props.image._id + "1235" + this.props.canvas);

			if (el && this.props.image.colors) {
				for (let j = 0; j < this.props.image.colors.length; ++j) {
					let elColors = el.getElementsByClassName("color-" + (j + 1));
					for (let i = 0; i < elColors.length; ++i) {
						let ell = elColors[i] as HTMLElement;
						let field = ell.getAttribute("field");
						if (ell.tagName == "stop") {
							if (!field) field = "stopColor";
							ell.style[field] = this.props.image.colors[j];
						} else if (ell.tagName == "path" || ell.tagName == "circle" || ell.tagName == "g" || ell.tagName == "polygon") {
							if (!field) field = "fill";
							ell.style[field] = this.props.image.colors[j];
						}
					}
				}
			}
		}
    }

    render() {

        const {
            canvas,
            scale,
            image: {
                type,
                path,
                _id,
                width,
                height,
                imgWidth,
                imgHeight,
                posX,
                posY,
            }
        } = this.props;

        const regex = /\[CALC.+?]/gm;
        let ABC;
		if (type == TemplateType.Gradient || type == TemplateType.Shape) {
			let cnt = 1;
			let xml = path ? path : "";

			try {
				let res = xml.match(regex);
				if (res) {
					for (let i = 0; i < res.length; ++i) {
						let tmp = res[i].substring(6, res[i].length - 1);
						tmp = tmp.replace("VIEWBOX_WIDTH", width / 2);
						tmp = tmp.replace("VIEWBOX_HEIGHT", height / 2);
						xml = xml.replaceAll(res[i], eval(tmp));
					}
				}
			}
			catch (e) {
			}

			while (cnt < 15 && xml) {
				let newXml = xml.replaceAll('SVGID_' + cnt + '_', _id + cnt + name);
				xml = newXml;
				++cnt;
			}

			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(xml, 'text/xml');

			ABC = processChildren(Array.from(xmlDoc.childNodes), _id + "svg" + canvas, null);

        }
        
        return (
            <GradientContainer
                id={_id + "1235" + canvas}
                className={`${_id}1236` + canvas}
                style={{
                    width: imgWidth * scale + "px",
                    height: imgHeight * scale + "px",
                    transform: `translate(${posX * scale}px, ${posY * scale}px)`,
                }}
            >
                {ABC}
            </GradientContainer>)
    }
}