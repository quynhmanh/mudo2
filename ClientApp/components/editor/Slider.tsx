import React, { PureComponent } from 'react'

export interface IProps {
    title: string;
    currentValue: number;
    pauser: any;
    onChange: any;
}

export interface IState {
    currentValue: number;
}

export default class Slider extends PureComponent<IProps, IState> {
    $input = null;

    constructor(props: any) {
        super(props);

        this.state = {
            currentValue: props.currentValue,
        }

        this.onSlideClick = this.onSlideClick.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onUp = this.onUp.bind(this);
    }

    shouldComponentUpdate (nextProps, nextState) {
        if (this.props.currentValue != nextProps.currentValue) {
            this.setState({
                currentValue: nextProps.currentValue,
            });

            this.$input.value = nextProps.currentValue;
        }
        return true;
    }
    
    onSlideClick (e) {
        this.props.pauser.next(true);
        console.log("onSLideClick");
        document.addEventListener("mousemove", this.onMove);
        document.addEventListener("mouseup", this.onUp);
    }

    onUp (e) {
        document.removeEventListener("mousemove", this.onMove);
        document.removeEventListener("mouseup", this.onUp);
        this.props.pauser.next(false);
    }

    onMove (e) {
        e.preventDefault();
        var rec1 = this.$el
            .getBoundingClientRect();
        var slide = e.pageX - rec1.left;
        var scale = (slide / rec1.width) * 100;
        scale = Math.max(1, scale);
        scale = Math.min(100, scale);

        this.setState({ currentValue: scale });

        this.$input.value = scale;
        this.props.onChange(scale);
    }

    $el = null;

  render () {
    return <div
    style={{
        width: "100%",
        padding: "10px 0px",
        background: "white",
        // animation: "bounce 1.2s ease-out",
        position: "relative",
    }}
>
    <div style={{
        height: "40px",
    }}>
    <p
        style={{
            display: "inline-block",
            margin: 0,
            lineHeight: "30px",
            width: "65px",
            fontSize: "12px"
        }}
    >
        {/* Mức trong suốt */}
        {this.props.title}
    </p>
    <input 
        ref={i => {this.$input = i;}}
        onClick={e => {
            document.execCommand('selectall', null, false);
        }}
        onKeyDown={e => {
            console.log('onKeyDown', e.nativeEvent);
            e.nativeEvent.stopImmediatePropagation();
            if (e.keyCode == 13) {
                var val = e.target.value;
                this.setState({ currentValue: val });

                this.$input.value = val;
                this.props.onChange(val);
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
        }} type="number" max="100" min="0" defaultValue={this.state.currentValue} ></input>
        </div>
    <div
        style={{
            display: "flex",
            height: "2px",
            backgroundColor: "black",
            borderRadius: "5px",
            top: 0,
            bottom: 0,
            margin: "auto",
            width: "100%",
        }}
    >
        <div
            ref={el => {this.$el = el;}}
            style={{
                borderRadius: "50%",
                width: "100%",
                position: "relative",
            }}
        >
            <div
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
                }}
                onMouseDown={this.onSlideClick}
            ></div>
        </div>
    </div>
</div>;
  }
}