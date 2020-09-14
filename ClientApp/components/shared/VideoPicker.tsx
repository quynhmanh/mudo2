import React, {PureComponent, Fragment, isValidElement} from "react";
import styled from 'styled-components';
import editorStore from "@Store/EditorStore";

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
    backgroundColorLoaded: string;
    backgroundColor: string;
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
      width: 300,
    };

    static defaultProps = {
      classNameContainer: "",
      padding: 0,
      backgroundColor: null,
      backgroundColorLoaded: "rgba(255, 255, 255, 0.07)",
  }

    componentDidMount() {
      const img = this.image;

      if (img && img.readyState == 4) {
          this.handleImageLoaded();
      }
  }

    image = null;

    handleImageLoaded() {
      const img = this.image;

      var ratio = img.videoWidth / img.videoHeight;

      if (!ratio || !this.state.loaded) {
          // img.play();
          this.setState({ loaded: true, width: ratio * 160 });
      }
  } 

      render() {
        let { loaded } = this.state;
        // loaded = true;
        // loaded = Boolean(Math.round(Math.random() % 2));
        return (
          <Container style={{
            position: 'relative',
            backgroundSize: '300% 300%',
            width: `${this.props.width}px`,
            height: `${this.state.loaded ? this.props.height : this.props.defaultHeight + "px"}`,
            marginBottom: '8px',
            opacity: this.state.loaded ? 1 : 0.15,
            animationName: 'XhtCamN749DcvC-ecDUzp',
            animation: this.state.loaded ? "none" : "LuuT-RWT7fXcJFhRfuaKV 1.4s infinite",
            animationDelay: '100ms',
            backgroundColor: this.state.loaded ? this.props.backgroundColorLoaded : (this.props.backgroundColor ? this.props.backgroundColor : "#000"),
          }} delay={this.props.delay} id={this.props.id} loaded={loaded} height={this.props.height} width={this.state.loaded ? this.state.width : this.props.width} defaultHeight={this.props.defaultHeight}>
            {this.props.showButton && editorStore.isAdmin  &&
            <button
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                borderRadius: '13px',
                border: 'none',
                padding: '0 4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                zIndex: 123,
              }}
              onClick={this.props.onEdit}
            ><span>
<svg width="16" height="16" viewBox="0 0 16 16"><defs><path id="_2658783389__a" d="M3.25 9.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"></path></defs><use fill="black" xlinkHref="#_2658783389__a" fillRule="evenodd"></use></svg>
            </span>
            </button>
            }
            <video
              autoPlay={false}
                loop={true}
                muted={true}
                ref={i => this.image = i}
                className={this.props.className}
                style={loaded ? {
                    height: this.props.height + 'px',
                    width: '100%',
                    marginBottom: '10px',
                    pointerEvents: "all",
                    // backgroundColor: this.props.color,
                } : {display: 'none'}}
                
                onLoadedMetadata={(e) => {
                    }
                }

                onCanPlay={(e) => {
                        this.handleImageLoaded();
                    }
                }

                onLoadedData={(e) => {
                    }
                }

                onError={(e) => {
                }
                }

                onMouseEnter={e => {
                  console.log('onMouseEnter')
                  this.image.play();
                }}
                onMouseLeave={e => {
                  console.log('onMouseLeave')
                  this.image.pause();
                }}

                src={this.props.src}
                onMouseDown={this.props.onPick}
            />
          </Container>
        );
      }
}
