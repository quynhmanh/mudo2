import React, { PureComponent, FormEvent } from 'react'
import { getLength, getAngle, tLToCenter } from '@Utils';
import StyledText from './StyledText'
import SingleText from './SingleText';
import MathJax from 'react-mathjax2'

const tex = `f(x) = \\int_{-\\infty}^\\infty\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi`

export interface IProps {
    styles: any;
    onDragStart(e: any, id: string): void;
    onDrag(deltaX: number, deltaY: number, clientX: number, clientY: number): void;
    onDragEnd(): void;

    selected: boolean;
    zoomable: string;
    onTextChange(e: any, id: string): void;
    _id: string;
    childrens: any;
    scaleX: number;
    scaleY: number;
    rotatable: boolean;
    parentRotateAngle: number;
    innerHTML: string;
    zIndex: number;
}

export interface IState {
    editing: boolean;
}

export default class Text extends PureComponent<IProps, IState> {
    $element = null;
    $textEle = null
    _isMouseDown = false;

    setElementRef = (ref) => { this.$element = ref }
    setTextElementRef = (ref) => {
        if (!this.$textEle) {
            this.$textEle = []
        }
        this.$textEle.push(ref)
    }

    // Drag
    startDrag = (e) => {
        if (e.target.classList.contains('single-resizer')) {

            let { clientX: startX, clientY: startY } = e
            this.props.onDragStart && this.props.onDragStart(e, this.props._id)
            this._isMouseDown = true
            const onMove = (e) => {
                if (!this._isMouseDown) return // patch: fix windows press win key during mouseup issue
                e.stopImmediatePropagation()
                const { clientX, clientY } = e
                const deltaX = clientX - startX
                const deltaY = clientY - startY
                this.props.onDrag(deltaX, deltaY, clientX, clientY)
                startX = clientX
                startY = clientY
            }
            const onUp = (e) => {
                e.preventDefault();
                document.removeEventListener('mousemove', onMove)
                document.removeEventListener('mouseup', onUp)
                if (!this._isMouseDown) return
                this._isMouseDown = false
                this.props.onDragEnd && this.props.onDragEnd()
            }
            document.addEventListener('mousemove', onMove)
            document.addEventListener('mouseup', onUp)
        }
    }

    componentDidMount() {

    }
    startEditing = (e) => {
        if (!this.props.selected) { e.preventDefault(); }
        this.setState({ editing: true })
    }

    endEditing() {
        this.setState({ editing: false })
    }

    render() {
        const {
            styles: {
                position: { centerX, centerY },
                size: { width, height },
                transform: { rotateAngle }
            },
            selected,
            onTextChange,
            _id,
            childrens,
            scaleX,
            scaleY,
            zIndex,
        } = this.props
        const style = {
            width: Math.abs(width),
            height: Math.abs(height),
            transform: `rotate(${rotateAngle}deg)`,
            WebkitTransform: `rotate(${rotateAngle}deg)`,
            left: centerX - Math.abs(width) / 2,
            top: centerY - Math.abs(height) / 2,
            zIndex: zIndex,
        }

        return (
            <StyledText
                ref={this.setElementRef}
                onMouseDown={this.startDrag}
                className="single-resizer"
                onClick={(e) => { if (!selected) { e.stopPropagation(); } }}
                style={style}
            >
                <div
                    style={{
                        transform: `scaleX(${scaleX}) scaleY(${scaleY})`,
                        WebkitTransform: `scaleX(${scaleX}) scaleY(${scaleY})`,
                        transformOrigin: '0 0',
                        WebkitTransformOrigin: '0 0',
                        zIndex: zIndex,
                    }}
                >
                    {childrens.map(child => {
                        const styles = tLToCenter({ top: child.top, left: child.left, width: child.width, height: child.height, rotateAngle: child.rotateAngle })
                        const {
                            position: { centerX, centerY },
                            size: { width, height },
                            transform: { rotateAngle }
                        } = styles;

                        return (<div
                            key={child._id}
                            style={{
                                transform: `scaleX(${child.scaleX}) scaleY(${child.scaleY})`,
                                WebkitTransform: `scaleX(${child.scaleX}) scaleY(${child.scaleY})`,
                                transformOrigin: '0 0',
                                WebkitTransformOrigin: '0 0',
                                zIndex: zIndex,
                            }}
                        >
                            <SingleText
                                zIndex={zIndex}
                                scaleX={child.scaleX}
                                scaleY={child.scaleY}
                                parentScaleX={null}
                                parentScaleY={null}
                                onFontSizeChange={null}
                                handleChildIdSelected={null}
                                handleFontColorChange={null}
                                handleFontFaceChange={null}
                                selectionScaleY={null}
                                childId={null}
                                width={width / child.scaleX}
                                height={height / child.scaleY}
                                centerX={centerX / child.scaleX}
                                centerY={centerY / child.scaleY}
                                rotateAngle={rotateAngle}
                                parentIndex={_id}
                                innerHTML={child.innerHTML}
                                _id={child._id}
                                selected={selected}
                                onInput={onTextChange}
                                onBlur={this.endEditing.bind(this)}
                                onMouseDown={this.startEditing.bind(this)}
                            >
                            </SingleText>
                        </div>);
                    })
                    }
                </div>
            </StyledText>
        )
    }
}