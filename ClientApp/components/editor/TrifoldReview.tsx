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
                <div><img className="_2tUb2T7qqgI_btAzbEXhpy" src="https://static.canva.com/web/images/e0e5a28a10461f40f99ab7d9609b7e67.jpg" style={{width: '100%', height: '100%'}} /></div>
                <div className="_36NEU03UAgvptunPQ33QuJ" style={{transformOrigin: '0 0', position: 'absolute', top: 0, left: 0, transform: 'matrix3d(0.206877, -7.3541e-16, 0, -5.55238e-18, -8.88178e-16, 0.207306, 0, 0, 0, 0, 1, 0, 47.888, 27.1134, 0, 1)'}}>
                    <div className="_3fyu-w84Dj-GvX55phR6M8" style={{width: '1122.52px', height: '793.701px'}}>
                        <div style={{width: '1122.52px', height: '793.701px', overflow: 'hidden'}}>
                            <div>
                                <div className="cJvigNF8nKVq8YRvhrcrK _3Tk7vFk3XB74DSjc-X114e fs-hide" style={{width: '321.26px', height: '188.976px'}}>
                                    {this.props.children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div><img src="https://static.canva.com/web/images/a62e85d9dee1f68b78bbe1474d8540ae.png" className="_3ABwoP9VfcpIZ-Qr_klynj" style={{width: '100%', height: '100%', position: 'absolute', left: 0, top: 0}} /></div>
    </div>
</div>
  }
}