import React, {PureComponent, Fragment, isValidElement} from "react";
import styled from 'styled-components';
import Globals from '@Globals';

export interface IProps {
    src: string;
    onPick: any;
    onEdit: any;
    className: string;
    height: number;
    defaultHeight: number;
    width: number;
    color: string;
    id: string;
}

export interface IState {
}


const Container = styled.div`
  position: relative;
  background-size: 300% 300%;
  position: relative;
  width: ${props => props.width}px;
  animation: gradient___UgeAv 3s linear infinite;
  height: ${props => props.loaded ? props.height : props.defaultHeight + "px"};
  background-image: ${props => props.loaded ? 'none;' : 'linear-gradient(90deg,#efefef00,rgba(255, 255, 255, .15),#ffffff26,rgba(0, 0, 0, 0),rgba(0, 0, 0, 0.9),#060c0d00 );'}
  margin-bottom: 10px;
  button {
    visibility: hidden;
  }
  :hover button {
    visibility: visible;
  }
`

export default class ImagePicker extends PureComponent<IProps, IState> {
    state = {loaded: false};

      render() {
        let { loaded } = this.state;
        // loaded = true;
        // loaded = Boolean(Math.round(Math.random() % 2));
        return (
          <Container id={this.props.id} loaded={loaded} height={this.props.height} width={this.props.width} defaultHeight={this.props.defaultHeight}>
            {Globals.serviceUser && Globals.serviceUser.username && (Globals.serviceUser.username === "llaugusty@gmail.com" || Globals.serviceUser.username === "hoangson1024@gmail.com")  &&
            <button
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                borderRadius: '13px',
                border: 'none',
                padding: '0 4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
              }}
              onClick={this.props.onEdit}
            ><span>
<svg width="16" height="16" viewBox="0 0 16 16"><defs><path id="_2658783389__a" d="M3.25 9.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"></path></defs><use fill="black" xlinkHref="#_2658783389__a" fill-rule="evenodd"></use></svg>
            </span>
            </button>
            }
            {/* {loaded ? null :
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
            } */}
            <img
              className={this.props.className}
              style={loaded ? {
                height: this.props.height + 'px',
                width: '100%',
                marginBottom: '10px',
                // backgroundColor: this.props.color,
                } : {display: 'none'}}
              src={this.props.src}
              onMouseDown={this.props.onPick}
              onLoad={() => {if ( true ) {
                  this.setState({loaded: true})
                }
                }
            }
            />
          </Container>
        );
      }
}
