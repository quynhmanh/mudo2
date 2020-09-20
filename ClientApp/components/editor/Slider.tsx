import React, { Component } from 'react'

export interface IProps {
    title: string;
    currentValue: number;
    pauser: any;
    onChange: any;
    onChangeEnd: any;
    multiplier: number;
    onChangeStart: any;
}

export interface IState {
    currentValue: number;
}

export default class Slider extends Component<IProps, IState> {
    $input = null;
    $leftSLide = null;
    $grabSlider = null;

    static defaultProps = {
        multiplier: 1,
        onChangeStart: null,
    }

    constructor(props: any) {
        super(props);

        this.state = {
            currentValue: props.currentValue,
        }

        this.onSlideClick = this.onSlideClick.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onUp = this.onUp.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.currentValue != nextProps.currentValue) {
            this.setState({
                currentValue: nextProps.currentValue,
            });

            this.$input.value = nextProps.currentValue * (nextProps.multiplier ? nextProps.multiplier : 1);
        }
        return true;
    }

    onSlideClick(e) {
        if (this.props.onChangeStart) {
            this.props.onChangeStart();
        }
        if (this.props.pauser) this.props.pauser.next(true);
        document.addEventListener("mousemove", this.onMove);
        document.addEventListener("mouseup", this.onUp);

        this.$grabSlider.style.boxShadow = '0 0 0 8px rgba(0,196,204,.5)';
        this.$grabSlider.style.border = '1px solid #00afb5';
    }

    onUp(e) {
        e.preventDefault();
        e.stopPropagation();
        document.removeEventListener("mousemove", this.onMove);
        document.removeEventListener("mouseup", this.onUp);
        if (this.props.pauser) this.props.pauser.next(false);
        if (this.$grabSlider) {
            this.$grabSlider.style.boxShadow = '';
            this.$grabSlider.style.border = '1px solid rgba(14, 19, 24, 0.2)';
        }

        console.log('onUp')
        var rec1 = this.$el
        .getBoundingClientRect();
            var slide = e.clientX - rec1.left;
            var scale = (slide / rec1.width) * 100;
            scale = Math.max(0, scale);
            scale = Math.min(100, scale);
        this.props.onChangeEnd(scale);
    }

    onMove(e) {
        e.preventDefault();
        e.stopPropagation();
        var rec1 = this.$el
            .getBoundingClientRect();
        var slide = e.clientX - rec1.left;
        var scale = (slide / rec1.width) * 100;
        scale = Math.max(0, scale);
        scale = Math.min(100, scale);

        window.scale = scale;

        this.$input.value = scale * (this.props.multiplier ? this.props.multiplier : 1);
        this.$leftSLide.style.width = scale + "%";
        this.$grabSlider.style.left = `calc(${scale}% - 7.5px)`;
        this.props.onChange(scale);
    }

    $el = null;

    render() {
        return <div
            style={{
                width: "100%",
                marginBottom: "15px",
                background: "white",
                position: "relative",
            }}
        >
            <div style={{
                height: "30px",
            }}>
                <p
                    style={{
                        display: "inline-block",
                        margin: 0,
                        lineHeight: "30px",
                        fontSize: "12px"
                    }}
                >
                    {/* Mức trong suốt */}
                    {this.props.title}
                </p>
                <input
                    className="slider-input"
                    ref={i => { this.$input = i; }}
                    onClick={e => {
                        document.execCommand('selectall', null);
                    }}
                    onKeyDown={e => {
                        e.nativeEvent.stopImmediatePropagation();
                        if (e.keyCode == 13) {
                            var val = parseInt((e.target as HTMLInputElement).value) / (this.props.multiplier ? this.props.multiplier : 1);
                            this.setState({ currentValue: val });

                            this.$input.value = (e.target as HTMLInputElement).value;
                            this.props.onChange(val);
                            this.props.onChangeEnd(val);
                            window.getSelection().removeAllRanges();
                        }
                    }}
                    onKeyUp={e => {
                        e.stopPropagation();
                    }}
                    style={{
                        textAlign: "center",
                        position: "absolute",
                        right: 0,
                        borderRadius: "3px",
                        border: "1px solid #dbdcdc",
                        fontSize: "13px",
                        width: "40px",
                    }} type="number" max="100" min="0" defaultValue={(this.state.currentValue * (this.props.multiplier ? this.props.multiplier : 1)).toString()} ></input>
            </div>
            <div
                className="slider-bar"
                style={{
                    height: "20px",
                    paddingTop: "10px",
                }}
                onMouseDown={e => {
                    if (this.props.pauser) this.props.pauser.next(true);
                    document.addEventListener("mousemove", this.onMove);
                    document.addEventListener("mouseup", this.onUp);

                    this.$grabSlider.style.boxShadow = '0 0 0 8px rgba(0,196,204,.5)';
                    this.$grabSlider.style.border = '1px solid #00afb5';

                    var rec1 = this.$el.getBoundingClientRect();
                    var slide = e.pageX - rec1.left;
                    var scale = (slide / rec1.width) * 100;

                    this.setState({ currentValue: scale });

                    this.$input.value = scale * (this.props.multiplier ? this.props.multiplier : 1);
                    this.$leftSLide.style.width = scale + "%";
                    this.props.onChange(scale);
                    console.log('onCHangeEnd ', scale)
                    this.props.onChangeEnd(scale);
                }}
            >
                <div
                    style={{
                        display: "flex",
                        height: "2px",
                        backgroundColor: "#dbdcdc",
                        top: 0,
                        bottom: 0,
                        margin: "auto",
                        width: "100%",
                    }}
                >
                    <div
                        ref={el => { this.$el = el; }}
                        style={{
                            width: "100%",
                            position: "relative",
                        }}
                    >
                        <div
                            ref={el => { this.$leftSLide = el; }}
                            style={{
                                width: Math.max(0, this.state.currentValue - 3) + "%",
                                height: "2px",
                                backgroundColor: "#05c4cc",
                            }}>

                        </div>
                        <div
                            ref={i => { this.$grabSlider = i; }}
                            className="slider"
                            style={{
                                position: "absolute",
                                left: this.state.currentValue - 3 + "%",
                                backgroundColor: "white",
                                width: "15px",
                                height: "15px",
                                borderRadius: "50%",
                                top: 0,
                                bottom: 0,
                                margin: "auto",
                                border: "1px solid rgba(14, 19, 24, 0.2)",
                                transition: 'box-shadow 0.1s ease-in-out 0s',
                            }}
                            onMouseDown={this.onSlideClick}
                        ></div>
                    </div>
                </div></div>
        </div>;
    }
}