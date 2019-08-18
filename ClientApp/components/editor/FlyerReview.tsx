import React, { PureComponent } from 'react'

export interface IProps {
}

export interface IState {
}

export default class Canvas extends PureComponent<IProps, IState> {

  render () {
    return <div id="alo2" className="eNf6210Ehjw49xuxCsPpk" 
    style={{
        width: '328px', 
        height: '218px', 
        position: 'relative', 
        transform: 'scale(0.9)',
        borderRadius: '5px',
        overflow: 'hidden',
    }}>
    <div>
        <div className="jPqjdkeSY9qVUI2aXLxBM" style={{width: '100%', height: '100%'}}>
            <div className="_3xuQY2WvIb4HzdBPfQLcnB" style={{width: '100%', height: '100%'}}>
                <div><img className="_2tUb2T7qqgI_btAzbEXhpy" src="https://static.canva.com/web/images/1803d5d30a5f0881109e367d3268e531.png" style={{width: '100%', height: '100%'}} /></div>
                <div className="_36NEU03UAgvptunPQ33QuJ" style={{transformOrigin: '0 0', position: 'absolute', top: 0, left: 0, transform: 'matrix3d(0.17274, 1.44707e-16, 0, 3.78047e-18, 3.55271e-15, 0.172779, 0, 1.04083e-17, 0, 0, 1, 0, 95.448, 10.2768, 0, 1)'}}>
                    <div className="_3fyu-w84Dj-GvX55phR6M8" style={{width: '793.701px', height: '1122.52px'}}>
                        <div style={{width: '793.701px', height: '1122.52px', overflow: 'hidden'}}>
                            <div>
                                <div className="cJvigNF8nKVq8YRvhrcrK _3Tk7vFk3XB74DSjc-X114e fs-hide" style={{width: '321.26px', height: '188.976px'}}>
                                    {this.props.children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div><img src="https://static.canva.com/web/images/b45eaeddd0bb8ad910b151e3cded5543.png" className="_3ABwoP9VfcpIZ-Qr_klynj" style={{width: '100%', height: '100%', position: 'absolute', left: 0, top: 0}} /></div>
    </div>
</div>
  }
}