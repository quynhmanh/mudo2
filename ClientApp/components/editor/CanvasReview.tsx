import React, { PureComponent } from 'react'

export interface IProps {
  width: number;
  height: number;
}

export interface IState {
}


export default class Canvas extends PureComponent<IProps, IState> {


  render () {

    const {width, height} = this.props;

    return <div id="alo2" className="poster eNf6210Ehjw49xuxCsPpk" 
    style={{
        width: (width/2) + 'px',
        height:  (height/2) + 'px',
        position: 'relative', 
        transform: 'scale(0.9)',
        borderRadius: '5px',
        transformOrigin: '0 0',
    }}>
    <div>
        {this.props.children}
    </div>
    <div style={{
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
    }}>

    </div>
</div>    
  }
}