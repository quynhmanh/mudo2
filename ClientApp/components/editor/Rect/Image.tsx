import React, { Component } from 'react'

export interface IProps {
    _id: string;
    imgWidth: any;
    imgHeight: any;
    posX: any;
    posY: any;
    selected: any;
    cropMode: any;
    outlineWidth: any;
    backgroundColor: any;
    enableCropMode: any;
    src: any;
    srcThumnail: any;
    canvas: string;
}

export interface IState {
    loaded: boolean;
}

export default class Image extends Component<IProps, IState> {

  constructor(props: any) {
    super(props);
    this.state = {
        loaded: false,
    }
  }

  render () {
      let {_id, imgWidth, imgHeight, posX, posY, selected, cropMode, outlineWidth, backgroundColor, enableCropMode, src, srcThumnail, canvas} = this.props;
    return (
        <div>
            {!window.downloading && !this.state.loaded && <img 
                style={{
                    visibility: "hidden", 
                }} 
                src={src}
                onLoad={e => {
                    this.setState({
                        loaded: true,
                    })
                }}
            />
            }
        <img
                  id={_id + "1235" + canvas}
                  className={`${_id}rect-alo ${_id}imgWidth ${_id}1236`}
                  style={{
                    zIndex: 9999999,
                    width: imgWidth + "px",
                    height: imgHeight + "px",
                    transform: `translate(${posX}px, ${posY}px)`,
                    opacity: 1,
                    outline:
                      cropMode && selected
                        ? `#00d9e1 solid ${outlineWidth - 1}px`
                        : null,
                    transformOrigin: "0 0",
                    backgroundColor: backgroundColor
                  }}
                  onDoubleClick={enableCropMode}
                  src={(this.state.loaded || window.downloading) ? src : srcThumnail}
                />
                </div>
    );
  }
}