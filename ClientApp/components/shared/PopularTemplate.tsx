import React, {PureComponent} from 'react';  
import styled, {createGlobalStyle} from 'styled-components';
import Loader from '@Components/shared/Loader';
import ImagePicker from "@Components/shared/ImagePicker";
import VideoPicker from "@Components/shared/VideoPicker";

export interface IProps {
  }
  
  interface IState {
    yLocation: number;
    showLeft: boolean;
    mounted: boolean;
  }

class Popup extends PureComponent<IProps, IState> {
    state = {
        yLocation: 0,
        showLeft: true,
        mounted: false,
    }

    componentDidMount() {
        this.setState({mounted: true,})
        this.test.addEventListener("scroll", this.handleScroll);
    }

    handleScroll = () => {
        console.log('handleCSroll');
        this.setState({yLocation: this.test.scrollLeft});

        if (this.test.offsetWidth + this.test.scrollLeft >= this.test.scrollWidth) {
            this.setState({showLeft: false,});
        } else {
            this.setState({showLeft: true,});
        }
    }

    test = null;

  render() {  
        return (<div>
            <h5 style={{
                marginTop: '35px',
                fontWeight: 'bold',
                color: 'white',
                fontFamily: 'AvenirNextRoundedPro-Medium',
                fontSize: '17px',
              }}>Thông dụng</h5>
        <div style={{position: 'relative',}}>
            { this.state.yLocation > 0 && this.state.mounted &&
          <button style={{
              position: 'absolute',
              top: '60px',
              zIndex: 100,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              left: '-21px',
              border: 'none',
          }} 
          onClick={(e) => {
              this.test.scrollLeft = this.state.yLocation - 700;
              this.setState({yLocation: this.state.yLocation - 700});
          }}
          className="arrowWrapper___rLMf7 arrowLeft___2lAV4" data-categ="popularTemplates" data-value="btn_sliderLeft">
              <svg style={{
                    transform: 'rotate(180deg)',
              }} viewBox="0 0 16 16" width="16" height="16" className="arrow___2yMKk"><path d="M12.2339 8.7917L5.35411 15.6711C4.91648 16.109 4.20692 16.109 3.7695 15.6711C3.33204 15.2337 3.33204 14.5242 3.7695 14.0868L9.85703 7.99952L3.76968 1.91249C3.33222 1.47486 3.33222 0.765428 3.76968 0.327977C4.20714 -0.109651 4.91665 -0.109651 5.35429 0.327977L12.234 7.20751C12.4528 7.42634 12.562 7.71284 12.562 7.99948C12.562 8.28627 12.4526 8.57298 12.2339 8.7917Z"></path></svg>
              </button>
            }
            {this.state.showLeft && this.state.mounted &&
              <button style={{
              position: 'absolute',
              top: '60px',
              zIndex: 100,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
                right: '-21px',
              border: 'none',
          }} 
          onClick={(e) => {
              this.test.scrollLeft = this.state.yLocation + 700;
              this.setState({yLocation: this.state.yLocation + 700});
          }}
          className="arrowWrapper___rLMf7 arrowLeft___2lAV4" data-categ="popularTemplates" data-value="btn_sliderLeft">
              <svg style={{
                    // transform: 'rotate(180deg)',
              }} viewBox="0 0 16 16" width="16" height="16" className="arrow___2yMKk"><path d="M12.2339 8.7917L5.35411 15.6711C4.91648 16.109 4.20692 16.109 3.7695 15.6711C3.33204 15.2337 3.33204 14.5242 3.7695 14.0868L9.85703 7.99952L3.76968 1.91249C3.33222 1.47486 3.33222 0.765428 3.76968 0.327977C4.20714 -0.109651 4.91665 -0.109651 5.35429 0.327977L12.234 7.20751C12.4528 7.42634 12.562 7.71284 12.562 7.99948C12.562 8.28627 12.4526 8.57298 12.2339 8.7917Z"></path></svg>
              </button>
            }
          <div
            style={{
              height: '220px',
              position: 'relative',
            }}
          >
        {/* {this.state.mounted &&  */}
          <div 
          className="renderView___1QdJs"
          ref={i => this.test = i}
          style={{
            overflow: 'scroll',
            scrollBehavior: 'smooth',
          }}>
          <ul style={{
                listStyle: 'none',
                padding: 0,
                position: 'relative',
                zIndex: 1,
                display: 'inline-flex',
                marginTop: '1px',
                transition: '.5s cubic-bezier(.68,-.55,.265,1.55)',
          }} className="templateList___2swQr">
          {/* <li className="templateWrapper___3Fitk">
            <ImagePicker
                src="https://cdn.crello.com/common/c2e83c00-e0fc-4e4a-9e57-a53b379faaca_640.jpg"
                height={160}
                defaultHeight={160}
                width={100}
            />  
              </li> */}
    <CC style={{
        marginRight: '16px',
        // overflow: 'hidden',
        // height: '160px',
    }} className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="fullHDVideoAN" data-subcateg="home" href="/editor/design/c0893ee9-ebf3-4f57-a8f3-26df818c3fc9">
            <div style={{
                        // position: 'relative',
                        // height: '160px',
                        // borderRadius: '8px',
                    }} className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                        <VideoPicker
                          id="1"
                          key={"1"}
                          color={""}
                          src={"https://draft.vn/videos/58af44c9-8a1c-4027-844d-ad7570648002.mp4"}
                          height={160}
                          defaultHeight={160}
                          width={284}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                    {/* <video style={{
                        position: 'relative',
                        height: '160px',
                        borderRadius: '8px',
                    }} src="https://cdn.crello.com/video-producer-script/42b2cbbb-f74f-49b2-83a6-aca7315824ef.mp4" poster="https://cdn.crello.com/common/6f8d2178-c251-4c68-a191-0f923e08ee30_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" /> */}
                </div>
                <svg style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                }} viewBox="0 0 16 16" width={16} height={16} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg" style={{
            opacity: 0,
        }}>
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Video Full HD</p>
            <p className="x-small___1lJKy size___1sVBg">1920x1080 px</p>
        </div>
    </CC>
    <CC style={{
        marginRight: '16px',
    }} className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="facebookSM" data-subcateg="home" href="/editor/design/c0893ee9-ebf3-4f57-a8f3-26df818c3fc9">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                <ImagePicker
                    showButton={false}
                          id="1"
                          key={"1"}
                          color={""}
                          src={"https://cdn.crello.com/common/c2e83c00-e0fc-4e4a-9e57-a53b379faaca_640.jpg"}
                          height={160}
                          defaultHeight={160}
                          width={191}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                </div>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="penciCCcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg"
        style={{
            opacity: 0,
        }}>
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Facebook Post</p>
            <p className="x-small___1lJKy size___1sVBg">940x788 px</p>
        </div>
    </CC>
    <CC style={{
        marginRight: '16px',
    }} className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="instagramVideoStoryAN" data-subcateg="home" href="/editor/design/97a157a9-79f1-4be0-85c0-a205f8522e6b">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    {/* <video src="https://cdn.crello.com/video-producer-script/5cf49544-381a-4790-903a-bc062d28ea97.mp4" poster="https://cdn.crello.com/common/edf74691-5af9-4554-8ef6-f6f4728c307d_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" /> */}
                    <VideoPicker
                          id="1"
                          key={"1"}
                          color={""}
                        //   src={"https://cdn.crello.com/video-producer-script/5cf49544-381a-4790-903a-bc062d28ea97.mp4"}
                          src={"https://draft.vn/videos/97a157a9-79f1-4be0-85c0-a205f8522e6b.mp4"}
                          height={160}
                          defaultHeight={160}
                          width={112}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                }} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="penciCCcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div 
        className="templateInfo___2YZSg"
        style={{
            opacity: 0,
        }}
        >
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Instagram Video Story</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1920 px</p>
        </div>
    </CC>
    <CC style={{
        marginRight: '16px',
    }} className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="instagramSM" data-subcateg="home" href="/editor/design/c0893ee9-ebf3-4f57-a8f3-26df818c3fc9">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    {/* <img alt="Instagram Post Real estate & Building 1080px 1080px" src="https://cdn.crello.com/common/06179643-bda5-4edd-8816-84b8fc4d44db_640.jpg" className="preview___37TNk mediaItem___106k8" /> */}
                    <ImagePicker
                          id="1"
                          key={"1"}
                          color={""}
                          src={"https://cdn.crello.com/common/06179643-bda5-4edd-8816-84b8fc4d44db_640.jpg"}
                          height={160}
                          defaultHeight={160}
                          width={160}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                </div>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div 
        className="templateInfo___2YZSg"
        style={{
            opacity: 0,
        }}>
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Instagram Post</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1080 px</p>
        </div>
    </CC>
    <CC style={{
        marginRight: '16px',
    }} className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="instagramVideoStoryAN" data-subcateg="home" href="/editor/design/c0893ee9-ebf3-4f57-a8f3-26df818c3fc9">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    {/* <video src="https://cdn.crello.com/video-producer-script/1adfb977-370f-4db0-ab86-04bcfa8ae6b9.mp4" poster="https://cdn.crello.com/common/f6238807-ceec-4eaf-9aa3-34afe8f25c30_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" /> */}
                    <VideoPicker
                          id="1"
                          key={"1"}
                          color={""}
                          src={"https://cdn.crello.com/video-producer-script/1adfb977-370f-4db0-ab86-04bcfa8ae6b9.mp4"}
                          height={160}
                          defaultHeight={160}
                          width={90}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                }} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div 
        className="templateInfo___2YZSg"
        style={{
            opacity: 0,
        }}
        >
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Instagram Video Story</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1920 px</p>
        </div>
    </CC>
    <CC style={{
        marginRight: '16px',
    }} className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="facebookADSMA" data-subcateg="home" href="/editor/design/c0893ee9-ebf3-4f57-a8f3-26df818c3fc9">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    {/* <img alt="Facebook Ad Fashion & Style 628px 1200px" src="https://cdn.crello.com/common/a7613810-fa5f-450b-b482-2a6ed4fd897d_640.jpg" className="preview___37TNk mediaItem___106k8" /> */}
                    <ImagePicker
                          id="1"
                          key={"1"}
                          color={""}
                          src={"https://cdn.crello.com/common/a7613810-fa5f-450b-b482-2a6ed4fd897d_640.jpg"}
                          height={160}
                          defaultHeight={160}
                          width={306}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                </div>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div 
        className="templateInfo___2YZSg"
        style={{
            opacity: 0,
        }}
        >
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Facebook Ad</p>
            <p className="x-small___1lJKy size___1sVBg">1200x628 px</p>
        </div>
    </CC>
    <CC style={{
        marginRight: '16px',
    }} className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="animatedPostAN" data-subcateg="home" href="/editor/design/c0893ee9-ebf3-4f57-a8f3-26df818c3fc9">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    {/* <video src="https://cdn.crello.com/video-producer-script/46a49129-6cf5-490d-8103-a34fc91cd63d.mp4" poster="https://cdn.crello.com/common/8714fed0-471e-4a67-9176-2897fc0dbc37_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" /> */}
                    <VideoPicker
                          id="1"
                          key={"1"}
                          color={""}
                          src={"https://cdn.crello.com/video-producer-script/46a49129-6cf5-490d-8103-a34fc91cd63d.mp4"}
                          height={160}
                          defaultHeight={160}
                          width={160}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                }} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div 
        className="templateInfo___2YZSg"
        style={{
            opacity: 0,
        }}
        >
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Square Video Post</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1080 px</p>
        </div>
    </CC>
    <CC style={{
        marginRight: '16px',
    }} className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="instagramStorySM" data-subcateg="home" href="/editor/design/c0893ee9-ebf3-4f57-a8f3-26df818c3fc9">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                <ImagePicker
                          id="1"
                          key={"1"}
                          color={""}
                          src={"https://cdn.crello.com/common/8d368594-f89e-4e3e-affa-7021c4120744_640.jpg"}
                          height={160}
                          defaultHeight={160}
                          width={150}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                    {/* <img alt="Instagram Story Food & Drinks 1920px 1080px" src="https://cdn.crello.com/common/8d368594-f89e-4e3e-affa-7021c4120744_640.jpg" className="preview___37TNk mediaItem___106k8" /> */}
                    </div>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div 
        className="templateInfo___2YZSg"
        style={{
            opacity: 0,
        }}
        >
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Instagram Story</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1920 px</p>
        </div>
    </CC>
    <CC style={{
        marginRight: '16px',
    }} className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="facebookADSMA" data-subcateg="home" href="/editor/design/c0893ee9-ebf3-4f57-a8f3-26df818c3fc9">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                <ImagePicker
                          id="1"
                          key={"1"}
                          color={""}
                          src={"https://cdn.crello.com/common/ca029acb-09a0-4b7f-8fa9-389ea5477ac3_640.jpg"}
                          height={160}
                          defaultHeight={160}
                          width={150}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                    {/* <img alt="Facebook Ad Sport & Extreme 628px 1200px" src="https://cdn.crello.com/common/ca029acb-09a0-4b7f-8fa9-389ea5477ac3_640.jpg" className="preview___37TNk mediaItem___106k8" /> */}
                </div>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div 
        className="templateInfo___2YZSg"
        style={{
            opacity: 0,
        }}
        >
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Facebook Ad</p>
            <p className="x-small___1lJKy size___1sVBg">1200x628 px</p>
        </div>
    </CC>
    <CC style={{
        marginRight: '16px',
    }} className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="instagramVideoStoryAN" data-subcateg="home" href="/editor/design/c0893ee9-ebf3-4f57-a8f3-26df818c3fc9">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    {/* <video src="https://cdn.crello.com/video-producer-script/b2a03204-5f88-4522-a3b2-c6a6e20e800b.mp4" poster="https://cdn.crello.com/common/23b1a253-5b1f-4ab6-949b-c71b40301b8b_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" /> */}
                    <VideoPicker
                          id="1"
                          key={"1"}
                          color={""}
                          src={"https://cdn.crello.com/video-producer-script/b2a03204-5f88-4522-a3b2-c6a6e20e800b.mp4"}
                          height={160}
                          defaultHeight={160}
                          width={150}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                }} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div 
        className="templateInfo___2YZSg"
        style={{
            opacity: 0,
        }}
        >
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Instagram Video Story</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1920 px</p>
        </div>
    </CC>
    <CC style={{
        marginRight: '16px',
    }} className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="instagramADSMA" data-subcateg="home" href="/editor/design/c0893ee9-ebf3-4f57-a8f3-26df818c3fc9">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    {/* <img alt="Instagram Ad Home stuff 1080px 1080px" src="https://cdn.crello.com/common/52f3771f-658a-4b4c-9df8-b7dceb4bd581_640.jpg" className="preview___37TNk mediaItem___106k8" /> */}
                    <ImagePicker
                          id="1"
                          key={"1"}
                          color={""}
                          src={"https://cdn.crello.com/common/52f3771f-658a-4b4c-9df8-b7dceb4bd581_640.jpg"}
                          height={160}
                          defaultHeight={160}
                          width={150}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                </div>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div 
        className="templateInfo___2YZSg"
        style={{
            opacity: 0,
        }}
        >
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Instagram Ad</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1080 px</p>
        </div>
    </CC>
    <CC style={{
        marginRight: '16px',
    }} className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="animatedPostAN" data-subcateg="home" href="/editor/design/c0893ee9-ebf3-4f57-a8f3-26df818c3fc9">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    {/* <video src="https://cdn.crello.com/video-producer-script/8714f27a-96e2-421e-bc0c-a62bb6734be4.mp4" poster="https://cdn.crello.com/common/9306da81-1cc9-4ee2-a135-970d8d62a0a2_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" /> */}
                    <VideoPicker
                          id="1"
                          key={"1"}
                          color={""}
                          src={"https://cdn.crello.com/video-producer-script/8714f27a-96e2-421e-bc0c-a62bb6734be4.mp4"}
                          height={160}
                          defaultHeight={160}
                          width={150}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                }} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div 
        className="templateInfo___2YZSg"
        style={{
            opacity: 0,
        }}
        >
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Square Video Post</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1080 px</p>
        </div>
    </CC>
    <CC style={{
        marginRight: '16px',
    }} className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="animatedPostAN" data-subcateg="home" href="/editor/design/c0893ee9-ebf3-4f57-a8f3-26df818c3fc9">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    {/* <video src="https://cdn.crello.com/video-producer-script/84f08efe-1289-4a19-ac4b-89060140dc66.mp4" poster="https://cdn.crello.com/common/534f5b80-3a47-436b-bab1-9561c122cfed_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" /> */}
                    <VideoPicker
                          id="1"
                          key={"1"}
                          color={""}
                          src={"https://cdn.crello.com/video-producer-script/84f08efe-1289-4a19-ac4b-89060140dc66.mp4"}
                          height={160}
                          defaultHeight={160}
                          width={150}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                }} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div 
        className="templateInfo___2YZSg"
        style={{
            opacity: 0,
        }}
        >
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Square Video Post</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1080 px</p>
        </div>
    </CC>
    <CC style={{
        marginRight: '16px',
    }} className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="fullHDVideoAN" data-subcateg="home" href="/editor/design/c0893ee9-ebf3-4f57-a8f3-26df818c3fc9">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    {/* <video src="https://cdn.crello.com/video-producer-script/f7bfb9ea-09e1-423e-a735-989fed4ad1e1.mp4" poster="https://cdn.crello.com/common/d1c132f6-8b1f-48a4-99b8-fd0682425ca5_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" /> */}
                    <VideoPicker
                          id="1"
                          key={"1"}
                          color={""}
                          src={"https://cdn.crello.com/video-producer-script/f7bfb9ea-09e1-423e-a735-989fed4ad1e1.mp4"}
                          height={160}
                          defaultHeight={160}
                          width={150}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                }} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div 
        className="templateInfo___2YZSg"
        style={{
            opacity: 0,
        }}
        >
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Video Full HD</p>
            <p className="x-small___1lJKy size___1sVBg">1920x1080 px</p>
        </div>
    </CC>
    <CC style={{
        marginRight: '16px',
    }} className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="instagramVideoStoryAN" data-subcateg="home" href="/editor/design/c0893ee9-ebf3-4f57-a8f3-26df818c3fc9">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    {/* <video src="https://cdn.crello.com/video-producer-script/bd52c4e4-8151-41cf-96d4-5d6cc144bcdb.mp4" poster="https://cdn.crello.com/common/9fd87f37-1194-462a-b751-110f725cacb8_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" /> */}
                    <VideoPicker
                          id="1"
                          key={"1"}
                          color={""}
                          src={"https://cdn.crello.com/video-producer-script/bd52c4e4-8151-41cf-96d4-5d6cc144bcdb.mp4"}
                          height={160}
                          defaultHeight={160}
                          width={150}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                    </div>
                <svg viewBox="0 0 16 16" width={16} height={16} style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                }} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div 
        className="templateInfo___2YZSg"
        style={{
            opacity: 0,
        }}
        >
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Instagram Video Story</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1920 px</p>
        </div>
    </CC>
    <CC style={{
        marginRight: '16px',
    }}  className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="facebookADSMA" data-subcateg="home" href="/editor/design/c0893ee9-ebf3-4f57-a8f3-26df818c3fc9">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    {/* <img alt="Facebook Ad Industry 628px 1200px" src="https://cdn.crello.com/common/04eb5b1d-cf71-4114-a9d6-71a651c5203a_640.jpg" className="preview___37TNk mediaItem___106k8" /> */}
                    <ImagePicker
                          id="1"
                          key={"1"}
                          color={""}
                          src={"https://cdn.crello.com/common/04eb5b1d-cf71-4114-a9d6-71a651c5203a_640.jpg"}
                          height={160}
                          defaultHeight={160}
                          width={150}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                </div>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div 
        className="templateInfo___2YZSg"
        style={{
            opacity: 0,
        }}
        >
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Facebook Ad</p>
            <p className="x-small___1lJKy size___1sVBg">1200x628 px</p>
        </div>
    </CC>
    <CC style={{
        marginRight: '16px',
    }}  className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="instagramVideoStoryAN" data-subcateg="home" href="/editor/design/c0893ee9-ebf3-4f57-a8f3-26df818c3fc9">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    {/* <video src="https://cdn.crello.com/video-producer-script/c604a4a4-b56f-44e7-b6cf-f5c5d1d735ac.mp4" poster="https://cdn.crello.com/common/890793ba-a8e7-4c3a-a1a0-1e9281d766bd_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" /> */}
                    <VideoPicker
                          id="1"
                          key={"1"}
                          color={""}
                          src={"https://cdn.crello.com/video-producer-script/c604a4a4-b56f-44e7-b6cf-f5c5d1d735ac.mp4"}
                          height={160}
                          defaultHeight={160}
                          width={150}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                }} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div 
        className="templateInfo___2YZSg"
        style={{
            opacity: 0,
        }}
        >
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Instagram Video Story</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1920 px</p>
        </div>
    </CC>
    <CC style={{
        marginRight: '16px',
    }}  className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="fullHDVideoAN" data-subcateg="home" href="/editor/design/c0893ee9-ebf3-4f57-a8f3-26df818c3fc9">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    {/* <video src="https://cdn.crello.com/video-producer-script/0b07ba68-96d6-4196-b462-55e1662cad0b.mp4" poster="https://cdn.crello.com/common/61785313-5b0c-4cd8-b9e7-613e40144e10_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" /> */}
                    <VideoPicker
                          id="1"
                          key={"1"}
                          color={""}
                          src={"https://cdn.crello.com/video-producer-script/0b07ba68-96d6-4196-b462-55e1662cad0b.mp4"}
                          height={160}
                          defaultHeight={160}
                          width={150}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                }} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div 
        className="templateInfo___2YZSg"
        style={{
            opacity: 0,
        }}
        >
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Video Full HD</p>
            <p className="x-small___1lJKy size___1sVBg">1920x1080 px</p>
        </div>
    </CC>
    <CC style={{
        marginRight: '16px',
    }}  className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="facebookSM" data-subcateg="home" href="/editor/design/c0893ee9-ebf3-4f57-a8f3-26df818c3fc9">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    {/* <img alt="Facebook Post Beauty 788px 940px" src="https://cdn.crello.com/common/92e717c0-ba32-4db7-b5bd-f60f07d4bb5e_640.jpg" className="preview___37TNk mediaItem___106k8" /> */}
                    <ImagePicker
                          id="1"
                          key={"1"}
                          color={""}
                          src={"https://cdn.crello.com/common/92e717c0-ba32-4db7-b5bd-f60f07d4bb5e_640.jpg"}
                          height={160}
                          defaultHeight={160}
                          width={150}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                </div>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div 
        className="templateInfo___2YZSg"
        style={{
            opacity: 0,
        }}
        >
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Facebook Post</p>
            <p className="x-small___1lJKy size___1sVBg">940x788 px</p>
        </div>
    </CC>
    <CC style={{
        marginRight: '16px',
    }}  className="templateWrapper___3Fitk">
        <a target="_blank" data-categ="popularTemplates" data-value="animatedPostAN" data-subcateg="home" href="/editor/design/c0893ee9-ebf3-4f57-a8f3-26df818c3fc9">
            <div className="previewWrapper___mbAh5">
                <div style={{paddingTop: 0}}>
                    {/* <video src="https://cdn.crello.com/video-producer-script/f55e8cd3-1970-40d3-b57c-d271d89d4a33.mp4" poster="https://cdn.crello.com/common/82356167-f8e5-4876-b15f-2930fd80f6d3_640.jpg" loop muted preload="metadata" autoPlay className="preview___37TNk mediaItem___106k8" /> */}
                    <VideoPicker
                          id="1"
                          key={"1"}
                          color={""}
                          src={"https://cdn.crello.com/video-producer-script/f55e8cd3-1970-40d3-b57c-d271d89d4a33.mp4"}
                          height={160}
                          defaultHeight={160}
                          width={150}
                          className=""
                          onPick={(e) => {}}
                          onEdit={(e) => {}}
                          delay={0}
                        />
                </div>
                <svg viewBox="0 0 16 16" width={16} height={16} style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                }} className="iconPlay___RdcjT">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />;</svg>
            </div>
            <div className="editTemplateWrapper___29oLU" style={{opacity: 0,}}>
                <div className="editTemplate___3q0zy">
                    <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                        <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                    </svg>
                </div>
            </div>
        </a>
        <div className="templateInfo___2YZSg"
        style={{
            opacity: 0,
        }}
        >
            <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">Square Video Post</p>
            <p className="x-small___1lJKy size___1sVBg">1080x1080 px</p>
        </div>
    </CC>
</ul>
          </div>
            {/* }  */}
          </div>
          </div>
          </div>
        );  
    }  
}  

const PopupWrapper = styled.div`
    position: fixed;  
    top: 0;  
    left: 0;  
    right: 0;  
    bottom: 0;  
    margin: auto;  
    background-color: rgba(15, 15, 15, 0.6);

    .popup_inner {  
        position: fixed;  
        top: 0;  
        left: 0;  
        right: 0;  
        bottom: 0;  
        margin: auto;  
        background-color: black;
        width: 200px;
        height: 200px;
    }

`;

const PopupWrapperBody = createGlobalStyle`
`;



export default Popup;

var CC = styled.li`
    position: relative;
    height: 160px;
    margin-right: 16px;
    transition: .3s;
`;
