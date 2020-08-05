import React, {Component} from "react";

interface IProps {
    translate: any;
    handleTransparentAdjust: any;
    currentOpacity: number;
    handleOpacityChange: any;
    title: any;
}

interface IState {

}

export default class TransparentDropdown extends Component<IProps, IState> {
    $input

    constructor(props: any) {
        super(props);
    }

    shouldComponentUpdate (nextProps, nextState) {
        // if (nextProps.currentOpacity === this.props.currentOpacity) {
        //     return false;
        // }

        if (this.props.translate != nextProps.translate) {
            return true;
        }

        this.$input.value = nextProps.currentOpacity;

        var el = document.getElementById("myOpacity-3slider");
        el.style.left = (nextProps.currentOpacity - 3) + "%";
        el = document.getElementById("myOpacity-4");
        el.style.width = (nextProps.currentOpacity - 3) + "%";
        return false;
    }

    render () {
        const { currentOpacity } = this.props;
        console.log('render', currentOpacity);
        return (
            <div
                style={{
                    height: "50px",
                    right: "10px",
                    position: "absolute",
                    marginTop: "-9px",
                    width: "310px",
                    padding: "10px 20px",
                    background: "white",
                    animation: "bounce 1.2s ease-out",
                    paddingRight: 0,
                }}
                id="myTransparent"
                className="dropdown-content-font-size"
            >
                <p
                    style={{
                        display: "inline-block",
                        margin: 0,
                        lineHeight: "30px",
                        // width: "65px",
                        fontSize: "12px"
                    }}
                >
                    {this.props.title}:{" "}
                </p>
                <div
                    style={{
                        display: "flex",
                        height: "2px",
                        top: 0,
                        bottom: 0,
                        margin: "auto",
                        width: "120px",
                    }}
                >
                    <div
                        id="myOpacity-3"
                        style={{
                            width: "100%",
                            backgroundColor: "#dbdcdc",
                        }}
                    >
                        <div 
                            id="myOpacity-4"
                            style={{
                                width: this.props.currentOpacity - 3 + "%",
                                height: "2px",
                                backgroundColor: "#05c4cc",
                            }}>

            </div>
                        <div
                            onMouseDown={this.props.handleTransparentAdjust}
                            id="myOpacity-3slider"
                            style={{
                                left: this.props.currentOpacity - 3 + "%",
                                backgroundColor: "white",
                                width: "15px",
                                height: "15px",
                                borderRadius: "50%",
                                top: 0,
                                bottom: 0,
                                margin: "auto",
                                position: "absolute",
                                border: "1px solid rgba(14, 19, 24, 0.2)",
                            }}
                        ></div>
                    </div>
                </div>
                <input 
                    ref={el => {this.$input = el;} }
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
                        height: "23px",
                        margin: "auto",
                    }} type="number" max="100" min="0" defaultValue={this.props.currentOpacity} ></input>
            </div>
        );
            }
}