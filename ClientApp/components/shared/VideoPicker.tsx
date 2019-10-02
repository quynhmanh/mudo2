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
    delay: number;
    showButton: boolean;
}

export interface IState {
  loaded: boolean;
  width: number;
}


// const Container = styled.div`
//   position: relative;
//   background-size: 300% 300%;
//   position: relative;
//   width: ${props => props.width}px;
//   animation: gradient___UgeAv 3s linear infinite;
//   height: ${props => props.loaded ? props.height : props.defaultHeight + "px"};
//   background-image: ${props => props.loaded ? 'none;' : 'linear-gradient(90deg,rgba(239,239,239,0),rgba(255, 255, 255, 0.06),rgba(236,240,242,0),rgba(0,0,0,0),rgba(0,0,0,0),rgba(6,12,13,0));'}
//   margin-bottom: 10px;
//   animation-delay: ${props => props.delay}s;
//   background-color: #00000030;
//   button {
//     visibility: hidden;
//   }
//   :hover button {
//     visibility: visible;
//   }
// `


const Container = styled.div`
  position: relative;
  background-size: 300% 300%;
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.loaded ? props.height : props.defaultHeight + "px"};
  margin-bottom: 8px;
  background-color: ${props => props.loaded ? "none" : "#00000030"};
  button {
    visibility: hidden;
  }
  background: #fff;
  opacity ${props => props.loaded ? 1 : 0.15};
  animation-name: XhtCamN749DcvC-ecDUzp;
  animation: ${props => props.loaded ? "none" : "LuuT-RWT7fXcJFhRfuaKV 1.4s infinite"};
  animation-delay: ${props => props.delay}ms;
  :hover button {
    visibility: visible;
  }
`

export default class ImagePicker extends PureComponent<IProps, IState> {
    state = {
      loaded: false, 
      width: 200,
    };

    componentDidMount() {
      const img = this.image;
      console.log('img ', img);
      console.log('img.readyState ', img.readyState);

    //   if (img && img.readyState == 0) {
          this.handleImageLoaded();
    //   }
  }

    image = null;

    handleImageLoaded() {
      const img = this.image;
      console.log('img ', img.naturalWidth);

      var ratio = img.videoWidth / img.videoHeight;

      if (!this.state.loaded) {
          console.log('image loaded');
          img.play();
          this.setState({ loaded: true, width: ratio * 160 });
      }
  } 

      render() {
        let { loaded } = this.state;
        console.log('loaded', loaded);
        // loaded = true;
        // loaded = Boolean(Math.round(Math.random() % 2));
        return (
          <Container style={{
            position: 'relative',
            backgroundSize: '300% 300%',
            width: this.state.loaded ? this.state.width + "px" : '100%',
            height: `${this.state.loaded ? this.props.height : this.props.defaultHeight + "px"}`,
            marginBottom: '8px',
            opacity: this.state.loaded ? 1 : 0.15,
            animationName: 'XhtCamN749DcvC-ecDUzp',
            animation: this.state.loaded ? "none" : "LuuT-RWT7fXcJFhRfuaKV 1.4s infinite",
            animationDelay: '100ms',
            backgroundColor: '#00000030',
            background: '#fff',
          }} delay={this.props.delay} id={this.props.id} loaded={loaded} height={this.props.height} width={this.state.loaded ? this.state.width : this.props.width} defaultHeight={this.props.defaultHeight}>
            {this.props.showButton && Globals.serviceUser && Globals.serviceUser.username && (Globals.serviceUser.username === "llaugusty@gmail.com" || Globals.serviceUser.username === "hoangson1024@gmail.com")  &&
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
            <video
                loop={true}
                muted={true}
                ref={i => this.image = i}
                className={this.props.className}
                style={loaded ? {
                    height: this.props.height + 'px',
                    width: '100%',
                    marginBottom: '10px',
                    // backgroundColor: this.props.color,
                } : {display: 'none'}}
                
                onLoadedMetadata={(e) => {
                    console.log('onLoad video picker');
                        // this.image.play();
                        // this.setState({loaded: true})
                        this.handleImageLoaded();
                    }
                }

                onCanPlay={(e) => {
                        console.log('onCanPlay');
                    }
                }

                onLoadedData={(e) => {
                        console.log('onLoadEnd');
                    }
                }

                onError={(e) => {
                    console.log('onerror');
                    }
                }

                src={this.props.src}
                onMouseDown={this.props.onPick}
            />
          </Container>
        );
      }
}
