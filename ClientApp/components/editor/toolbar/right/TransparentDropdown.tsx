import React, {Component} from "react";

interface IProps {
    translate: any;
    handleTransparentAdjust: any;
    currentOpacity: number;
    handleOpacityChange: any;
}

interface IState {

}

export default class Effect extends Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }
    // shouldComponentUpdate (nextProps, nextState) {
    //     console.log("shouldComponentUpdate ", this.props, nextProps);
    //     if (nextProps.currentOpacity === this.props.currentOpacity) {
    //         return false;
    //     }
    //     return true;
    // }

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
                    animation: "bounce 1.2s ease-out"
                }}
                id="myTransparent"
                className="dropdown-content-font-size"
            >
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
                    {this.props.translate("transparent")}:{" "}
                </p>
                <div
                    style={{
                        display: "flex",
                        height: "2px",
                        backgroundColor: "black",
                        borderRadius: "5px",
                        top: 0,
                        bottom: 0,
                        margin: "auto",
                        width: "120px",
                    }}
                >
                    <div
                        id="myOpacity-3"
                        style={{
                            borderRadius: "50%",
                            width: "100%"
                        }}
                    >
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