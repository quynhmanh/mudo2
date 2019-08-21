import React, { PureComponent } from 'react'

export interface IProps {
}

export interface IState {
}


export default class Canvas extends PureComponent<IProps, IState> {


  render () {
    return <div id="alo2" className="poster eNf6210Ehjw49xuxCsPpk" 
    style={{
        width: '328px', 
        height: '218px', 
        position: 'relative', 
        transform: 'scale(0.9)',
        borderRadius: '5px',
        overflow: 'hidden',
        transformOrigin: '0 0',
    }}>
    <div>
        <div className="jPqjdkeSY9qVUI2aXLxBM" style={{width: '100%', height: '100%'}}>
            <div className="_3xuQY2WvIb4HzdBPfQLcnB" style={{width: '100%', height: '100%'}}>
                <div><img className="_2tUb2T7qqgI_btAzbEXhpy" src="https://static.canva.com/web/images/8ee043be1d250417c51df60d62dcc9e0.jpg" style={{width: '100%', height: '100%'}} /></div>
                <div className="_36NEU03UAgvptunPQ33QuJ" style={{transformOrigin: '0 0', position: 'absolute', top: 0, left: 0, transform: 'matrix3d(0.0586821, -6.48062e-17, 0, 2.08795e-18, 0, 0.058632, 0, -3.46945e-18, 0, 0, 1, 0, 117.588, 15.9619, 0, 1)'}}>
                    <div className="_3fyu-w84Dj-GvX55phR6M8" style={{width: '1587.4px', height: '2245.04px'}}>
                        <div style={{width: '1587.4px', height: '2245.04px', overflow: 'hidden'}}>
                            <div>
                                <div className="cJvigNF8nKVq8YRvhrcrK _3Tk7vFk3XB74DSjc-X114e fs-hide" style={{width: '321.26px', height: '188.976px'}}>
                                    {this.props.children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div><img src="https://static.canva.com/web/images/0b19ac5ffdb3834ed19d80c252385c43.png" className="_3ABwoP9VfcpIZ-Qr_klynj" style={{transform: 'translateZ(0)', width: '100%', height: '100%', position: 'absolute', left: 0, top: 0}} /></div>
    </div>
</div>    
  }
}