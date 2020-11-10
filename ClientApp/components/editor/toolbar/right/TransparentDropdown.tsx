import React, {Component} from "react";
import Slider from "@Components/editor/Slider";
import { observer } from "mobx-react";
import editorStore from "@Store/EditorStore";
import { handleOpacityChange, handleOpacityChangeEnd } from "@Utils";


interface IProps {
    translate: any;
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
                      onChange={handleOpacityChange}
                      onChangeEnd={handleOpacityChangeEnd}
                    />
            </div>
        );
            }
}