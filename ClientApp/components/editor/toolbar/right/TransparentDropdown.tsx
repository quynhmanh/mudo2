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
        console.log('render TransparentDropdown')
        return (
            <div
                style={{
                    right: "10px",
                    position: "absolute",
                    marginTop: "-9px",
                    width: "310px",
                    padding: "0 20px",
                    background: "white",
                    animation: "bounce 0.8s ease-out",
                }}
                id="myTransparent"
                className="dropdown-content-font-size"
            >
                <Slider 
                      title="Offset" 
                      currentValue={editorStore.currentOpacity}
                      pauser={null}
                      onChange={this.props.handleOpacityChange}
                      onChangeEnd={this.props.handleOpacityChangeEnd}
                    />
            </div>
        );
            }
}