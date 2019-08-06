import React, {PureComponent, Fragment, isValidElement} from "react";

export interface IProps {
    src: string;
    onPick: any;
    className: string;
    height: number;
    color: string;
}

export interface IState {
}

export default class ImagePicker extends PureComponent<IProps, IState> {
    state = {loaded: false};

      render() {
        let { loaded } = this.state;
        // loaded = true;
        // loaded = Boolean(Math.round(Math.random() % 2));
        return (
          <div
          style={{
            position: 'relative',
          }}
            >
            <button
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
              }}
            ><span
            >Edit</span>
            </button>
            {loaded ? null :
              <img
                style={{
                    // background: 'hsl(0, 0%, 80%)',
                    paddingLeft: '100%',
                    backgroundColor: this.props.color,
                    width: '100%',
                    height: this.props.height + 'px',
                    marginBottom: '10px',
                }}
              />
            }
            <img
              className={this.props.className}
              style={loaded ? {
                height: this.props.height + 'px',
                width: '100%',
                marginBottom: '10px',
                backgroundColor: this.props.color,
                } : {display: 'none'}}
              src={this.props.src}
              onMouseDown={this.props.onPick}
              onLoad={() => {if ( true ) {
                  this.setState({loaded: true})
                }
                }
            }
            />
          </div>
        );
      }
}
