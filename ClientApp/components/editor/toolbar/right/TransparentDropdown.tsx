import React, {Component} from "react";
import Slider from "@Components/editor/Slider";
import { observer } from "mobx-react";
import editorStore from "@Store/EditorStore";


interface IProps {
    translate: any;
    handleTransparentAdjust: any;
    handleOpacityChange: any;
    handleOpacityChangeEnd: any;
    title: any;
    currentOpacity: any;
}

interface IState {

}

@observer
export default class TransparentDropdown extends Component<IProps, IState> {
    $input

    constructor(props: any) {
        super(props);
    }

    render () {
        return (
            <div
                style={{
                    right: "10px",
                    position: "absolute",
                    marginTop: "-1px",
                    width: "310px",
                    padding: "20px 20px 0px",
                    background: "white",
                    animation: "bounce 0.8s ease-out",
                }}
                id="myTransparent"
                className="dropdown-content-font-size"
            >
                <Slider 
                      title={this.props.translate("transparent")} 
                      currentValue={editorStore.currentOpacity}
                      onChange={this.props.handleOpacityChange}
                      onChangeEnd={this.props.handleOpacityChangeEnd}
                    />
            </div>
        );
            }
}