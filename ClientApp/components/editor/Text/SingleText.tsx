import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import MathJax from 'react-mathjax2'

const tex = `f(x) = \\int_{-\\infty}^\\infty\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi`

export interface IProps {
    childId: string;
    width: number;
    height: number;
    rotateAngle: number;
    scaleX: number;
    scaleY: number;
    zIndex: number;
    innerHTML: string;
    selected: boolean;
    onInput(e: any, id: string): void;
    onBlur(): void;
    onMouseDown(): void;
    _id: string;
    parentIndex: string;
    centerX: number;
    centerY: number;
    onFontSizeChange(fontSize: number, scaleY: number): void;
    handleFontColorChange(fontColor: string): void;
    handleFontFaceChange(fontFace: string): void;
    parentScaleX: number;
    parentScaleY: number;
    handleChildIdSelected(childId: string): void;
    selectionScaleY: any;
    scale: number;
    fontFace: any;
    textAlign: any;
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
        parentIndex: PropTypes.string,
        _id: PropTypes.string,
        centerX: PropTypes.number,
        centerY: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number,
        rotateAngle: PropTypes.number,
        scaleX: PropTypes.number,
        scaleY: PropTypes.number,
        parentScaleX: PropTypes.number,
        parentScaleY: PropTypes.number,
    }

    $textEle = null;
    $element = null;

    setElementRef = (ref) => { this.$element = ref }
    setTextElementRef = (ref) => {
        this.$textEle = ref
    }

    componentDidMount() {
        this.$textEle.innerHTML = this.props.innerHTML;
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
        const { handleChildIdSelected, childId, } = this.props;
        var self = this;
        setTimeout(() => {
            handleChildIdSelected(childId);
        }, 50);
    }

    render() {
        const {
            selected,
            onInput,
            onBlur,
            _id,
            width,
            zIndex,
            scaleX,
            scaleY,
            scale,
            textAlign,
            childId,
        } = this.props

        return (
            <div
                style={{
                    transform: `scaleX(${scaleX * scale}) scaleY(${scaleY * scale})`,
                    transformOrigin: '0 0',
                }}>
                <div
                    id={_id}
                    spellCheck={false}
                    style={{
                        width: Math.abs(width),
                        zIndex: zIndex,
                        cursor: 'auto',
                        margin: 0,
                        position: 'absolute' as 'absolute',
                        wordBreak: 'break-word' as 'break-word',
                        display: 'inline-block',
                        textAlign,
                        pointerEvents: 'auto'
                    }}
                    ref={this.setTextElementRef.bind(this)}
                    onInput={(e) => { onInput(e, childId) }}
                    className="text"
                    contentEditable={selected}
                    onBlur={onBlur}
                    onMouseDown={this.onMouseDown.bind(this)}
                >
                </div>

            </div>
        )
    }
}