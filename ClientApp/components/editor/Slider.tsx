import React, { PureComponent } from 'react'

export interface IProps {
    title: string;
    currentValue: number;
}

export interface IState {
}

export default class Slider extends PureComponent<IProps, IState> {

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
        onClick={e => {
            document.execCommand('selectall', null, false);
        }}
        onKeyDown={e => {
            console.log('onKeyDown', e.nativeEvent);
            e.nativeEvent.stopImmediatePropagation();
            if (e.keyCode == 13) {
                var val = e.target.value;
                this.props.handleOpacityChange(val);
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
        }} type="number" max="100" min="0" defaultValue={this.props.currentValue} ></input>
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
            style={{
                borderRadius: "50%",
                width: "100%",
                position: "relative",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: this.props.currentValue - 3 + "%",
                    backgroundColor: "white",
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    top: 0,
                    bottom: 0,
                    margin: "auto",
                    border: "1px solid rgba(14, 19, 24, 0.2)",
                }}
            ></div>
        </div>
    </div>
</div>;
  }
}