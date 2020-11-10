import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { TemplateType } from '../enums';
import { getLetterSpacing, handleChildIdSelected } from "@Utils";

export interface IProps {
    selected: boolean;
    onInput(e: any, id: string): void;
    _id: string;
    parentId: string;
    scale: number;
    child: any;
    canvas: any;
    rotateAngle: number;
    parentImage: any;
}

export interface IState {
    editing: boolean;
}

export default class SingleText extends PureComponent<IProps, IState> {
    static propTypes = {
        onInput: PropTypes.func,
        onBlur: PropTypes.func,
        onMouseDown: PropTypes.func,
        selected: PropTypes.bool,
        innerHTML: PropTypes.string,
        _id: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
        rotateAngle: PropTypes.number,
        scaleX: PropTypes.number,
        scaleY: PropTypes.number,
    }

    $textEle = null;
    $element = null;

    setElementRef = (ref) => { this.$element = ref }
    setTextElementRef = (ref) => {
        this.$textEle = ref
    }

    componentDidMount() {
        this.$textEle.innerHTML = this.props.child.innerHTML;
    }


    updateInnerHTML(innerHTML) {
        if (innerHTML && this.$textEle) {
            this.$textEle.innerHTML = innerHTML;
        }
    }


    startEditing = (e) => {
        if (!this.props.selected) { e.preventDefault(); }
        this.setState({ editing: true })
    }

    endEditing() {
        this.setState({ editing: false })
    }

    onMouseDown() {
        const {
            child: {
                _id: childId,
            }
        } = this.props;
        var self = this;
        setTimeout(() => {
            handleChildIdSelected(childId);
        }, 50);
    }

    render() {
        const {
            onInput,
            scale,
            selected,
            parentId,
            canvas,
        } = this.props

        const {
            parentImage,
            child: {
                width,
                zIndex,
                scaleX,
                scaleY,
                align,
                _id,
                effectId,
                hollowThickness,
                type,
                left,
                top,
                height,
                opacity,
                fontFace,
                color,
                intensity,
                direction,
                textShadowTransparent,
                offSet,
                filter,
                lineHeight,
                fontSize,
                italic,
                bold,
                letterSpacing,
                rotateAngle,
                blur,
                textShadow,
                shadowColor,
            }
        } = this.props;

        return (
            <div
                id={parentId + _id + "text-container3"}
                style={{
                    WebkitTextStroke: (effectId == 3 || effectId == 4) && (`${1.0 * hollowThickness / 100 * 4 + 0.1}px ${(effectId == 3 || effectId == 4) ? color : "black"}`),
                    transform: `translateZ(${zIndex})`,
                }}
            >
                <div
                    id={parentId + _id + "text-container2" + canvas}
                    // className={`text-container ${_id + _id + "text-container2" + canvas}`}
                    style={{
                        zIndex: zIndex,
                        left: left * scale,
                        top: top * scale,
                        position: "absolute",
                        width: width * scale,
                        height: height * scale,
                        transform: `rotate(${rotateAngle}deg)`,
                        opacity: opacity,
                        fontFamily: `${fontFace}, AvenirNextRoundedPro`,
                        color: (effectId == 3 || effectId == 4) ? "transparent" : color,
                        textShadow: effectId == 1 ? `rgba(${shadowColor[0]}, ${shadowColor[1]}, ${shadowColor[2]}, ${1.0 * textShadowTransparent / 100}) ${21.0 * offSet / 100 * Math.sin(direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * offSet / 100 * Math.cos(direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * blur / 100}px` :
                            effectId == 2 ? `rgba(0, 0, 0, ${0.6 * intensity}) 0 8.9px ${66.75 * intensity / 100}px` :
                            effectId == 4 ? `rgb(${shadowColor[0]}, ${shadowColor[1]}, ${shadowColor[2]}) ${21.0 * offSet / 100 * Math.sin(direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * offSet / 100 * Math.cos(direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
                            effectId == 5 ? `rgba(${shadowColor[0]}, ${shadowColor[1]}, ${shadowColor[2]}, 0.5) ${21.0 * offSet / 100 * Math.sin(direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * offSet / 100 * Math.cos(direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * offSet / 100 * Math.sin(direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * offSet / 100 * Math.cos(direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
                                        effectId == 6 && `rgb(0, 255, 255) ${21.0 * offSet / 100 * Math.sin(direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * offSet / 100 * Math.cos(direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * offSet / 100 * Math.sin(direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * offSet / 100 * Math.cos(direction * 3.6 / 360 * 2 * Math.PI))}px 0px`,
                        filter: filter,
                        lineHeight: `${lineHeight * fontSize}px`,
                        fontStyle: italic ? "italic" : "",
                        fontWeight: bold ? "bold" : "normal",
                        letterSpacing: getLetterSpacing(letterSpacing),
                        fontSize: fontSize + "px",
                    }}
                >
                    <div
                        style={{
                            transform: `scaleX(${scaleX * scale}) scaleY(${scaleY * scale})`,
                            transformOrigin: '0 0',
                        }}>
                        <div
                            id={parentId + _id + canvas}
                            spellCheck={false}
                            style={{
                                width: width / scaleX + "px",
                                zIndex: zIndex,
                                cursor: 'auto',
                                margin: 0,
                                position: 'absolute' as 'absolute',
                                wordBreak: 'break-word' as 'break-word',
                                display: 'inline-block',
                                textAlign: align,
                                pointerEvents: 'auto'
                            }}
                            ref={this.setTextElementRef.bind(this)}
                            onInput={(e) => { onInput(e, _id) }}
                            className="text"
                            contentEditable={selected}
                            onMouseDown={this.onMouseDown.bind(this)}
                        >
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}