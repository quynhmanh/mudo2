import React, { PureComponent } from "react";
import uuidv4 from "uuid/v4";
import Tooltip from '@Components/shared/Tooltip';
import {htmlToImage, getBoundingClientRect} from '@Utils';
import "@Styles/editor.scss";
import TopMenu from '@Components/editor/Sidebar';
import axios from 'axios';
import StyledComponent from 'styled-components';
import Popup from '@Components/shared/Popup';
import MediaEditPopup from '@Components/editor/MediaEditor';
import TemplateEditor from '@Components/editor/TemplateEditor';
import FontEditPopup from '@Components/editor/FontEditor';
import { object, any } from "prop-types";
import Canvas from '@Components/editor/Canvas';
import MathJax from 'react-mathjax2'
import InfiniteScroll from '@Components/shared/InfiniteScroll';
import ImagePicker from '@Components/shared/ImagePicker';
import {getMostProminentColor} from '@Utils';
import PosterReview from '@Components/editor/PosterReview';
import TrifoldReview from '@Components/editor/TrifoldReview';
import FlyerReview from '@Components/editor/FlyerReview';
import BusinessCardReview from '@Components/editor/BusinessCardReview';
import CanvasReview from '@Components/editor/CanvasReview';
import Globals from '@Globals';
import { Helmet } from "react-helmet";

declare global {
  interface Window { paymentScope : any; }
}

const thick = 16;

enum SubType {
  BusinessCardReview = 0,
  FlyerReview = 1,
  PosterReview = 2,
  TrifoldReview = 3,
  Logo = 4,
}

enum SidebarTab {
  Image = 1,
  Text = 2,
  Template = 4,
  Background = 8,
  Element = 16,
  Upload = 32,
  Video = 64,
  Folder = 128,
  Font = 248,
  Color = 496,
  Emoji = 992,
}

enum Mode {
  CreateDesign = 0,
  CreateTemplate = 1,
  CreateTextTemplate = 2,
  EditTemplate = 3,
  EditTextTemplate = 4,
}

enum TemplateType {
  Template = 1,
  TextTemplate = 2,
  Heading = 3,
  Image = 4,
  Latex = 5,
  BackgroundImage = 6,
  Video = 7,
}

export interface IProps {
  rid: string;
  mode: string;
  match: any;
}

interface IState {
  subtype: SubType,
  query: string;
  error: any;
  items: any;
  currentItemsHeight: number,
  items2: any;
  currentItems2Height: number;
  cursor: any;
  isLoading: boolean;
  mathjav: any;
  idObjectSelected: string;
  images: Array<object>;
  images2: Array<object>;
  groupedTexts: Array<object>;
  groupedTexts2: Array<object>;
  templates: Array<object>;
  templates2: Array<object>;
  scale: number;
  fitScale: number;
  startX: number;
  startY: number;
  selectedTab: SidebarTab;
  rectWidth: number;
  rectHeight: number;
  toolbarOpened: boolean;
  toolbarSize: number;
  scrollX: number;
  scrollY: number;
  _id: string;
  resizing: boolean;
  rotating: boolean;
  dragging: boolean;
  uuid: string;
  templateType: string;
  mode: number,
  staticGuides: object;
  deltaX: number;
  deltaY: number;
  editing: boolean;
  canRenderClientSide: boolean;
  unnormalizedImages: any;
  fonts: any;
  fontsList: any;
  fontSize: number;
  fontColor: string;
  showPopup: boolean;
  showMediaEditingPopup: boolean;
  isSaving: boolean;
  fontName: string;
  fontId: string;
  childId: string;
  cropMode: boolean;
  resizingInnerImage: boolean;
  updateRect: boolean;
  numOfPages: number;
  pages: Array<string>;
  activePageId: string,
  upperZIndex: number;
  totalFonts: number;
  hasMoreFonts: boolean;
  hasMoreTextTemplate: boolean;
  hasMoreTemplate: boolean;
  currentGroupedTextsHeight: number;
  currentGroupedTexts2Height: number;
  currentTemplatesHeight: number;
  currentTemplate2sHeight: number;
  hasMoreImage: boolean;
  backgrounds1: Array<object>,
  backgrounds2: Array<object>,
  backgrounds3: Array<object>,
  currentBackgroundHeights1: number,
  currentBackgroundHeights2: number,
  currentBackgroundHeights3: number,
  editingMedia: any;
  editingFont: any;
  showMediaEditPopup: boolean;
  showTemplateEditPopup: boolean;
  showFontEditPopup: boolean;
  videos: any;
  hasMoreBackgrounds: boolean;
  typeObjectSelected: TemplateType;
  bleed: boolean;
  showPrintingSidebar: boolean;
  currentPrintStep: number;
  orderStatus: string;
  downloading: boolean;
}

let firstpage = uuidv4();

const tex = `f(x) = \\int_{-\\infty}^\\infty\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi`

class CanvaEditor  extends PureComponent<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentPrintStep: 1,
            subtype: null,
            bleed: false,
            showMediaEditPopup: false,
            hasMoreImage: true,
            hasMoreTemplate: true,
            hasMoreTextTemplate: true,
            hasMoreFonts: true,
            hasMoreBackgrounds: true,
            totalFonts: 1000000,
            query: "",
            currentItemsHeight: 0,
            currentGroupedTextsHeight: 0,
            currentTemplatesHeight: 0,
            items: [],
            backgrounds1: [],
            backgrounds2: [],
            backgrounds3: [],
            currentItems2Height: 0,
            currentGroupedTexts2Height:0,
            currentTemplate2sHeight: 0,
            items2: [],
            error: null,
            cursor: false,
            mathjav: null,
            isLoading: false,
            upperZIndex: 1,
            activePageId: firstpage,
            pages: [firstpage],
            numOfPages: 1,
            updateRect: false,
            resizingInnerImage: false,
            childId: null,
            fontId: "pxpokApm3Ei8KUEgIAEqUg",
            fontName: "images/833bdf3b-7c22-4e79-9b0a-eece6711eacd.png",
            isSaving: false,
            showPopup: false,
            showMediaEditingPopup: false,
            fontColor: 'black',
            fontSize: 0,
            fontsList: [],
            fonts: [],
            unnormalizedImages: [],
            templateType: null,
            _id: null,
            idObjectSelected: null,
            typeObjectSelected: null,
            scale: 1,
            fitScale: 1,
            startX: 0,
            startY: 0,
            images: [],
            images2: [],
            groupedTexts: [],
            groupedTexts2: [],
            templates: [],
            templates2: [],
            selectedTab: SidebarTab.Text,
            rectWidth: this.props.match.params.width ? parseInt(this.props.match.params.width) : 0,
            rectHeight: this.props.match.params.height ? parseInt(this.props.match.params.height) : 0,
            toolbarOpened: true,
            toolbarSize: 330,
            scrollX: 16.67,
            scrollY: 16.67,
            resizing: false,
            rotating: false,
            dragging: false,
            uuid: "",
            mode: parseInt(this.props.match.params.mode) || Mode.CreateDesign,
            staticGuides: {
              x: [],
              y: [],
            },
            deltaX: 0,
            deltaY: 0,
            editing: false,
            canRenderClientSide: false,
            cropMode: false,
            currentBackgroundHeights1: 0,
            currentBackgroundHeights2: 0,
            currentBackgroundHeights3: 0,
            editingMedia: null,
            editingFont: null,
            showTemplateEditPopup: false,
            videos: [
              'https://dl5.webmfiles.org/big-buck-bunny_trailer.webm',
              'http://techslides.com/demos/sample-videos/small.webm',
              'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
            ],
            showPrintingSidebar: false,
            orderStatus: '',
            downloading: false,
        };
        this.handleResponse = this.handleResponse.bind(this);
        this.handleAddOrder = this.handleAddOrder.bind(this);
        this.externalPaymentCompleted = this.externalPaymentCompleted.bind(this);
    }

  $app = null;
  timer = null;
  $container = null;

  async componentDidMount() {

    var ce = document.createElement.bind(document);
    var ca = document.createAttribute.bind(document);
    var ge = document.getElementsByTagName.bind(document);

    this.setState({canRenderClientSide: true})

    var screenContainerParentRect = getBoundingClientRect("screen-container-parent");
    var screenContainerRect = getBoundingClientRect("screen-container");

    const { width, height } = screenContainerParentRect;
    var scaleX = (width - 100) / this.state.rectWidth;
    var scaleY = (height - 100) / this.state.rectHeight;

    var staticGuides = {
      x: [[0,0], [this.state.rectWidth / 2, 0], [this.state.rectWidth,0]], 
      y: [[0,0], [this.state.rectHeight / 2, 0], [this.state.rectHeight,0]]
    }

    var fitScale = Math.min(scaleX, scaleY) === Infinity ? 1 : Math.min(scaleX, scaleY);

    this.setState({
      staticGuides,
      scale: fitScale,
      fitScale, 
    });
    var self = this;
    var subtype;
    var template_id = this.props.match.params.template_id;
    console.log('props ', this.props)
    if (template_id) {

      var url = `/api/Template/Get?id=${template_id}`;

      await axios.get(url).then(res => {
        if (res.data.errors.length > 0) {
          throw new Error(res.data.errors.join("\n"));
        }

        console.log('res ', res);

        var image = res.data;
        var templateType = image.value.type;
        var mode;
        if (this.props.match.path == "/editor/design/:template_id") {
          console.log('/editor/design/:template_id')
          mode = Mode.CreateDesign;
        }
        else if (templateType == TemplateType.Template) {
          mode = Mode.EditTemplate;
        } else if (templateType == TemplateType.TextTemplate) {
          mode = Mode.EditTextTemplate;
        }

        var document = JSON.parse(image.value.document)
        var scaleX = (width - 100) / document.width;
        var scaleY = (height - 100) / document.height;
        var staticGuides = {
          x: [[0,0], [document.width / 2,0], [document.width,0]], 
          y: [[0,0], [document.height/ 2,0], [document.height,0]],
        }

        // document.document_object = document.document_object.map(obj => {
        //   obj.page = this.state.activePageId;
        //   return obj;
        // })

        if (image.value.fontList) {
          var fontList = image.value.fontList.forEach(id => { 
              var style = `@font-face {
                font-family: '${id}';
                src: url('/fonts/${id}.ttf');
              }`;
              var styleEle = ce("style");
              var type = ca("type");
              type.value = "text/css";
              styleEle.attributes.setNamedItem(type)
              styleEle.innerHTML = style;
              var head = document.head || ge('head')[0];
              head.appendChild(styleEle);

              var link = ce('link');
              link.id = id;
              link.rel = 'preload';
              link.href = `/fonts/${id}.ttf`
              link.media = 'all';
              link.as = "font";
              link.crossOrigin = "anonymous";
              head.appendChild(link);
            return {
            id: id,
            }
          });
        }

        console.log('document ', res);
        subtype = res.data.value.printType;
        self.setState({ 
          scale: Math.min(scaleX, scaleY) === Infinity ? 1 : Math.min(scaleX, scaleY),
          staticGuides,
          images: document.document_object, 
          _id: template_id, 
          rectWidth: document.width, 
          rectHeight: document.height, 
          templateType,
          mode,
          fonts: image.value.fontList,
          pages: res.data.value.pages, 
          activePageId:res.data.value.pages[0],
          subtype: res.data.value.printType,
        });
      }).catch(e => {
        console.log('Unexpected error occured: e', e);
      })
    } else {
      self.setState({
        _id: uuidv4(),
      })
    }

    console.log('subtype ', subtype);
    if (this.props.match.params.subtype) {
      subtype = this.props.match.params.subtype;
      var rectWidth;
      var rectHeight;
      if (subtype == 0) {
        console.log("Asdasd")
        rectWidth = 642;
        rectHeight = 378;
      } else if (subtype == 1) {
        rectWidth = 1587.402;
        rectHeight = 2245.04;
      } else if (subtype == 2) {
        rectWidth = 2245.04; 
        rectHeight = 1587.402;
      } else if (subtype == 3) {
        rectWidth = 3174.8;
        rectHeight = 4490.08;
      } else if (subtype == 4) {
        rectWidth = 500;
        rectHeight = 500;
      }
      var scaleX = (width - 100) / rectWidth;
      var scaleY = (height - 100) / rectHeight;
      console.log("Asdasd")
      self.setState({ 
        rectWidth,
        rectHeight,
        subtype,
        scale: Math.min(scaleX, scaleY) === Infinity ? 1 : Math.min(scaleX, scaleY),
      });
    }

    console.log('this.state.subtype ', subtype);

    this.loadMore.bind(this)(true);
    this.loadMoreFont(true);
    this.loadMoreTextTemplate(true);
    this.loadMoreTemplate.bind(this)(true, subtype);
    this.loadMoreBackground(true);

    document.addEventListener("keydown", this.removeImage.bind(this));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.scale !== prevState.scale) {
      this.handleScroll();
    }
  }

  handleEditmedia = (item) => {
    this.setState({showMediaEditPopup: true, editingMedia: item})
  }

  handleEditFont = (item) => {
    console.log('handleEditFont ');
    this.setState({showFontEditPopup: true, editingFont: item})
  }

  handleResizeStart = (startX: number, startY: number) => {
    this.setState({ resizing: true, resizingInnerImage: false, startX, startY });
  }

  handleResizeEnd = () => {
    setTimeout(
      function() {
        this.setState({ resizing: false });
      }.bind(this),
      300
    );
  };

  switching = false;

  // handle the crop area
  handleResize = (style, isShiftKey, type, _id, scaleX, scaleY, cursor, objectType, e) => {
    if (this.switching) {
      return;
    }
    const { scale } = this.state;
    let { top, left, width, height } = style;
    var self = this;
    var temp = this.handleImageResize;
    var images = this.state.images.map(image => {
      if (image._id === _id) {
        
        var deltaLeft = left - image.left;
        var deltaTop = top - image.top;
        var deltaWidth = width - image.width;
        var deltaHeight = height - image.height;

        var oldDeltaLeft = deltaLeft;
        var oldDeltaHeight = deltaHeight;
        
        if (this.state.cropMode) {
          
          var t5 = false;
          var t8 = false;
          if (deltaLeft < image.posX && (type == "tl" || type == "bl")) {
            t5 = true;
            deltaLeft = image.posX;
            left = image.left + deltaLeft;
            width = image.width - deltaLeft;
            deltaWidth = width - image.imgWidth;
          } 

          var t6 = false;
          var t7 = false;
          if (image.imgHeight + image.posY - height < 0 && (type == "bl" || type == "br")) {
            t6 = true;
            height = image.imgHeight + image.posY;
          }
          if (image.imgWidth + image.posX - width < 0 && (type == "br" || type == "tr")) {
            t7 = true;
            width = image.imgWidth + image.posX;
          }

          if (deltaTop < image.posY && (type == "tl" || type == "tr")) {
            t8 = true;
            deltaTop = image.posY;
            top = image.top + deltaTop;
            height = image.height - deltaTop;
            deltaHeight = height - image.imgHeight;
          } 

          if (t5 && t8 && type=="tl") {
            console.log('e.clientX e.clientY', e.clientX, e.clientY, oldDeltaLeft, oldDeltaHeight);
            self.setState({
              resizingInnerImage: !self.state.resizingInnerImage, 
              startX: e.clientX - image.posX, 
              startY: e.clientY - image.posY,
            });
            self.switching = true;
            self.handleImageResize = () => {};
          }

          if (t5 && t6 && type == "bl") {
            console.log("bl");
            self.setState({
              resizingInnerImage: !self.state.resizingInnerImage, 
              startX: e.clientX - deltaLeft, 
              startY: e.clientY - deltaHeight,
            });
            self.switching = true;
            self.handleImageResize = () => {};
          }

          if (t6 && t7 && type == "br") {
            console.log("br");
            self.setState({
              resizingInnerImage: !self.state.resizingInnerImage, 
              startX: e.clientX - deltaLeft, 
              startY: e.clientY - deltaHeight,
            });
            self.switching = true;
            self.handleImageResize = () => {};
          }

          if (t8 && t7 && type == "tr") {
            console.log("tr");
            self.setState({
              resizingInnerImage: !self.state.resizingInnerImage, 
              startX: e.clientX - deltaWidth, 
              startY: e.clientY - deltaTop,
            });
            self.switching = true;
            self.handleImageResize = () => {};
          }
        }

        if ((objectType === 4 || objectType === 7) && !this.state.cropMode) {
          var scaleWidth = image.imgWidth / image.width;
          var scaleHeight = image.imgHeight / image.height;
          var scaleLeft = image.posX / image.imgWidth;
          var scaleTop = image.posY / image.imgHeight;
          var newImgWidth = image.imgWidth + scaleWidth * deltaWidth;
          var newImgheight = image.imgHeight + scaleHeight * deltaHeight;
          var newposX = scaleLeft * image.imgWidth;
          var newposY= scaleTop * image.imgHeight;

          image.imgWidth += scaleWidth * deltaWidth;
          image.imgHeight += scaleHeight * deltaHeight;
          image.posX = scaleLeft * image.imgWidth;
          image.posY = scaleTop * image.imgHeight;
        }

        if (objectType === 4 && this.state.cropMode) {
          image.posX -= deltaLeft;
          image.posY -= deltaTop;
        }

        image.top = top;
        image.left = left
        image.width = width;
        image.height = height;

        if (cursor != "e-resize" && cursor != "w-resize") {
          image.scaleX = (image.width) / image.origin_width;
          image.scaleY = (image.height) / image.origin_height;
        } else {
          if (objectType == TemplateType.Heading) {
            // var rec = document.getElementById(_id).getElementsByClassName('text')[0].getBoundingClientRect();
            var rec = document.getElementById(_id).getElementsByClassName('text')[0].getBoundingClientRect();
            var as = Math.abs(Math.sin(image.rotateAngle / 360 * Math.PI));
            var cs = Math.abs(Math.cos(image.rotateAngle / 360 * Math.PI));
            var newHeight = (rec.height * cs - rec.width * as) / (cs^2 - as^2)
            image.height = newHeight / scale;
          } else if (objectType == TemplateType.TextTemplate) {
            var maxHeight = 0;
            var rec = document.getElementById(_id).getBoundingClientRect();
            var rec2 = document.getElementById(_id).getElementsByClassName('text');
            for (var i = 0; i < rec2.length; ++i) {
              var rec3 = rec2[i].getBoundingClientRect();
              maxHeight = Math.max(maxHeight, rec3.bottom - rec.top);
            }

            let texts = image.document_object.map(text => {
              text.height = (document.getElementById(text._id).offsetHeight) * text.scaleY;;
              return text;
            });

            var newDocumentObjects = [];
            for (var i = 0; i < texts.length; ++i) {
              var d = texts[i];
              if (d.ref === null) {
                newDocumentObjects.push(...this.normalize2(d, texts, image.scaleX, image.scaleY, scale, image.width, image.height));
              }
            }
            image.height = maxHeight / scale;
            image.document_object = newDocumentObjects;
          }
          image.origin_width = image.width / image.scaleX;
          image.origin_height = image.height / image.scaleY;
        }
      }
      return image;
    });

    this.setState({ images, updateRect: self.switching, },
      () => {
        if (self.switching) {
          self.handleImageResize = temp;
          // self.setState({updateRect: false});
          setTimeout(() => {
            self.switching = false,
            self.setState({updateRect: false});
          }, 1);
        }
      });
  };

  onResizeInnerImageStart = (startX, startY) => {
    this.setState({resizingInnerImage: true, startX, startY});
  }

  // Handle the actual miage
  handleImageResize = (style, isShiftKey, type, _id, scaleX, scaleY, cursor, objectType, e) => {
    if (this.switching) {
      return;
    }
    const { scale } = this.state;
    let { top, left, width, height } = style;

    var self = this;
    var switching = false;
    var temp = this.handleResize;
    var images = this.state.images.map(image => {
      if (image._id === _id) {

        if (image.height - top - height > 0 &&
          image.width - left - width > 0 && (type == "br")) {
            console.log(3, image.width - left - width, e.clientX);
            console.log(3, image.height - top - height, e.clientY);
            self.setState({
              resizingInnerImage: !self.state.resizingInnerImage, 
              startX: e.clientX + image.width - left - width, 
              startY: e.clientY + image.height - top - height,
            });
            switching = true;
            self.handleResize = () => {};
            height = -top + image.height;
            width = -left + image.width;
        }
        else
        if (image.height - top > height && left <= 0 && (type == "bl" || type == "br")) {
          console.log(1, image.height - top, height, left);
          self.setState({
            resizingInnerImage: !self.state.resizingInnerImage, 
            startX: e.clientX, 
            startY: e.clientY + image.height - top - height,
          });
          switching = true;
          self.handleResize = () => {};
          height = -top + image.height;
          // width = -left + image.width;
        } else 
        if (image.height - top > height && left > 0 && (type == "bl")) {
          console.log(2);
          self.setState({
            resizingInnerImage: !self.state.resizingInnerImage, 
            startX: e.clientX - left, 
            startY: e.clientY + image.height - top - height,
          });
          switching = true;
          self.handleResize = () => {};
          image.posX = -left;;
          width += left;
          left = 0;
          height = -top + image.height;
        }
        else
        // console.log('image.height - top, height', image.height - top, height);
        // console.log('image.width - left, width', image.width - left, width);

        if (image.width - left > width && top < 0 && (type == "tr" || type == "br")) {
          console.log(4);
          self.setState({
            resizingInnerImage: !self.state.resizingInnerImage, 
            startX: e.clientX, 
            startY: e.clientY + image.height - top - height,
          });
          switching = true;
          self.handleResize = () => {};
          width = -left + image.width;
        } else 
        if (image.width - left > width && top > 0 && type == "tr") {
          console.log(5);
          self.setState({
            resizingInnerImage: !self.state.resizingInnerImage, 
            startX: e.clientX - top, 
            startY: e.clientY + image.width - left - width,
          });
          switching = true;
          self.handleResize = () => {};
          image.posY = -top;
          height += top;
          top = 0;
          width = -left + image.width;
        }
        else
        if (top > 0 && left <= 0 && (type == "tl" || type == "tr")) {
          console.log(6);
          self.setState({
            resizingInnerImage: !self.state.resizingInnerImage, 
            startX: e.clientX, 
            startY: e.clientY - top
          });
          image.posY = -top;
          height += top;
          top = 0;
          switching = true;
          self.handleResize = () => {};
        } else if (left > 0 && top <= 0 && (type == "tl" || type == "bl")) {
          console.log(7);
          self.setState({
            resizingInnerImage: !self.state.resizingInnerImage, 
            startX: e.clientX - left, 
            startY: e.clientY,
          });
          image.posX = -left;;
          width += left;
          left = 0;
          switching = true;
          self.handleResize = () => {};
        } else 
        if (left > 1 && top > 1 && type == "tl") {
          console.log(8, left, top);
          self.setState({
            resizingInnerImage: !self.state.resizingInnerImage, 
            startX: e.clientX - left, 
            startY: e.clientY - top,
          });
          image.posX = -left;
          image.posY = -top;
          height += top;
          width += left;
          left = 0;
          top = 0;
          switching = true;
          self.handleResize = () => {};
        }

        image.posY = top;
        image.posX = left;
        image.imgWidth = width;
        image.imgHeight = height;
      }
      return image;
    });

    this.setState({ images, updateRect: switching, },
      () => {
        if (switching) {
          self.handleResize = temp;
          // self.setState({updateRect: false});
          setTimeout(() => {
            self.setState({updateRect: false});
          }, 1);
        }
      });
  };

  handleRotate = (rotateAngle, _id) => {
    var images = this.state.images.map(image => {
      if (image._id === _id) {
        image.rotateAngle = rotateAngle;
      }
      return image;
    });

    this.setState({ images });
  };

  handleRotateStart = () => {
    this.setState({ rotating: true });
  };

  handleRotateEnd = () => {
    setTimeout(
      function() {
        this.setState({ rotating: false });
      }.bind(this),
      300
    );
  };

  handleDragStart = (e, _id) => {
    const {scale} = this.state;
    var canvasRect = getBoundingClientRect("canvas");
    var deltaX, deltaY;
    this.state.images.forEach(image => {
      if (image._id === _id) {
        deltaX = e.clientX - canvasRect.left - image.left * scale;
        deltaY = e.clientY - canvasRect.top - image.top * scale;
      }
    })
    this.setState({ dragging: true, deltaX, deltaY});
  };

  tranformImage = (image: any) => {
    var centerX = image.left + image.width / 2;
    var centerY = image.top + image.height / 2;

    if (!image.rotateAngle || image.rotateAngle === 0) {
      return {
        x: [centerX - image.width / 2, centerX, centerX + image.width / 2],
        y: [centerY - image.height / 2, centerY, centerY + image.height / 2],
      }
    } else {
      return {
        x: [centerX - image.height / 2, centerX, centerX + image.height / 2],
        y: [centerY - image.width / 2, centerY, centerY + image.width / 2],
      }
    }
  }

  handleImageDrag = (_id, newPosX, newPosY) => {
    var images = this.state.images.map(img => {
      if (img._id === _id) {
        if (newPosX > 0) {
          newPosX = 0;
        } else if (newPosX + img.imgWidth < img.width) {
          newPosX = img.width - img.imgWidth;
        }
        if (newPosY > 0) {
          newPosY = 0;
        } else if (newPosY + img.imgHeight < img.height) {
          newPosY = img.height - img.imgHeight;
        }
        img.posX = newPosX;
        img.posY = newPosY;
      }
      return img;
    });

    this.setState({images})
  }

  handleDrag = (_id, clientX, clientY) : any => {
    const {scale, deltaX, deltaY} = this.state;
    var newLeft, newTop;
    var newLeft2, newTop2;
    var newLeft3, newTop3;
    var centerX, centerY;
    var left, top;
    var img;
    var updateStartPosX = false;
    var updateStartPosY = false;
    var canvasRect = getBoundingClientRect("canvas");
    this.state.images.forEach(image => {
      if (image._id === _id) {
        newLeft = (clientX - canvasRect.left - deltaX) / scale;
        newTop = (clientY - canvasRect.top - deltaY) / scale;
        newLeft2 = newLeft + image.width / 2;
        newLeft3 = newLeft + image.width;
        newTop2 = newTop + image.height / 2;
        newTop3 = newTop + image.height;
        img = image;

        centerX = newLeft + image.width / 2;
        centerY = newTop + image.height / 2;
        left = newLeft;
        top = newTop;
        if (image.rotateAngle === 90 || image.rotateAngle === 270) {
          newLeft = centerX - image.height / 2;
          newTop = centerY - image.width / 2;
          newLeft2 = centerX;
          newLeft3 = centerX + image.height / 2;
          newTop2 = centerY;
          newTop3 = centerY + image.width / 2;
        }
      }
    });

    let images = this.state.images.map(image => {
      if (image.page === img.page) {
        var imageTransformed = this.tranformImage(image);
        if (image._id !== _id) {
          if ((!updateStartPosX) && Math.abs(newLeft - imageTransformed.x[0]) < 5) {
            left -= newLeft - imageTransformed.x[0];
            image[0] = 1;
            updateStartPosX = true;
          } else if ((!updateStartPosX) && Math.abs(newLeft2 - imageTransformed.x[0]) < 5) {
            left -= newLeft2 - imageTransformed.x[0];
            image[0] = 1;
            updateStartPosX = true;
          } else if ((!updateStartPosX) && Math.abs(newLeft3 - imageTransformed.x[0]) < 5) {
            left -= newLeft3 - imageTransformed.x[0];
            image[0] = 1;
            updateStartPosX = true;
          }
          else {
            image[0] = 0;
          } 
          
          if ((!updateStartPosX) && Math.abs(newLeft - imageTransformed.x[1]) < 5) {
            left -= newLeft - imageTransformed.x[1];
            image[1] = 1;
            updateStartPosX = true;
          } else if ((!updateStartPosX) && Math.abs(newLeft2 - imageTransformed.x[1]) < 5) {
            left -= newLeft2 - imageTransformed.x[1];
            image[1] = 1;
            updateStartPosX = true;
          } else if ((!updateStartPosX) && Math.abs(newLeft3 - imageTransformed.x[1]) < 5) {
            left -= newLeft3 - imageTransformed.x[1];
            image[1] = 1;
            updateStartPosX = true;
          } 
          else {
            image[1] = 0;
          }
          
          if ((!updateStartPosX) && Math.abs(newLeft - imageTransformed.x[2]) < 5) {
            left -= newLeft - imageTransformed.x[2];
            image[2] = 1;
            updateStartPosX = true;
          } else if ((!updateStartPosX) && Math.abs(newLeft2 - imageTransformed.x[2]) < 5) {
            left -= newLeft2 - imageTransformed.x[2];
            image[2] = 1;
            updateStartPosX = true;
          } else if ((!updateStartPosX) && Math.abs(newLeft3 - imageTransformed.x[2]) < 5) {
            left -= newLeft3 - imageTransformed.x[2];
            image[2] = 1;
            updateStartPosX = true;
          }
          else {
            image[2] = 0;
          }

          if ((!updateStartPosY) && Math.abs(newTop - imageTransformed.y[0]) < 5) {
            top -= newTop - imageTransformed.y[0];
            image[3] = 1;
            updateStartPosY = true;
          } else if ((!updateStartPosY) && Math.abs(newTop2 - imageTransformed.y[0]) < 5) {
            top -= newTop2 - imageTransformed.y[0];
            image[3] = 1;
            updateStartPosY = true;
          } else if ((!updateStartPosY) && Math.abs(newTop3 - imageTransformed.y[0]) < 5) {
            top -= newTop3 - imageTransformed.y[0];
            image[3] = 1;
            updateStartPosY = true;
          }
          else {
            image[3] = 0;
          } 
          
          if ((!updateStartPosY) && Math.abs(newTop - imageTransformed.y[1]) < 5) {
            top -= newTop - imageTransformed.y[1];
            image[4] = 1;
            updateStartPosY = true;
          } else if ((!updateStartPosY) && Math.abs(newTop2 - imageTransformed.y[1]) < 5) {
            top -= newTop2 - imageTransformed.y[1];
            image[4] = 1;
            updateStartPosY = true;
          } else if ((!updateStartPosY) && Math.abs(newTop3 - imageTransformed.y[1]) < 5) {
            top -= newTop3 - imageTransformed.y[1];
            image[4] = 1;
            updateStartPosY = true;
          } 
          else {
            image[4] = 0;
          }
          
          if ((!updateStartPosY) && Math.abs(newTop - imageTransformed.y[2]) < 5) {
            top -= newTop - imageTransformed.y[2];
            image[5] = 1;
            updateStartPosY = true;
          } else if ((!updateStartPosY) && Math.abs(newTop2 - imageTransformed.y[2]) < 5) {
            top -= newTop2 - imageTransformed.y[2];
            image[5] = 1;
            updateStartPosY = true;
          } else if ((!updateStartPosY) && Math.abs(newTop3 - imageTransformed.y[2]) < 5) {
            top -= newTop3 - imageTransformed.y[2];
            image[5] = 1;
            updateStartPosY = true;
          }
          else {
            image[5] = 0;
          }
        }
      }
      return image;
    });

    images = this.state.images.map(image => {

      if (image._id === _id) {

        const { staticGuides } = this.state;

        var x = staticGuides.x.map((v) => {
          var e = v[0];
          if ((!updateStartPosX) && Math.abs(newLeft - e) < 5) {
            left -= newLeft - e;
            v[1] = 1;
            updateStartPosX = true;
          } else if ((!updateStartPosX) && Math.abs(newLeft3 - e) < 5) {
            left -= newLeft3 - e;
            v[1] = 1;
            updateStartPosX = true;
          } else if ((!updateStartPosX) && Math.abs(newLeft2 - e) < 5) {
            left -= newLeft2 - e;
            v[1] = 1;
            updateStartPosX = true;
          } else {
            v[1] = 0;
          }

          return v;
        })

        var y = staticGuides.y.map((v) => {
          var e = v[0];
          if ((!updateStartPosY) && Math.abs(newTop - e) < 5) {
            top -= newTop - e;
            v[1] = 1;
            updateStartPosY = true;
          } else if ((!updateStartPosY) && Math.abs(newTop3 - e) < 5) {
            top -= newTop3 - e;
            v[1] = 1;
            updateStartPosY = true;
          } else if ((!updateStartPosY) && Math.abs(newTop2 - e) < 5) {
            top -= newTop2 - e;
            v[1] = 1;
            updateStartPosY = true;
          } else {
            v[1] = 0;
          }

          return v;
        })

        this.setState({staticGuides: {x, y}});
        image.left = left;
        image.top = top;
      }

      return image;
    });

    this.setState({ images, dragging: true });

    return {updateStartPosX: !updateStartPosX, updateStartPosY: !updateStartPosY};
  };

  handleDragEnd = () => {
    let {staticGuides: {x, y} } = this.state;

    x = x.map(e => {e[1] = 0; return e});
    y = y.map(e => {e[1] = 0; return e});

    var images = this.state.images.map(image => {
      image[0] = 0;
      image[1] = 0;
      image[2] = 0;
      image[3] = 0;
      image[4] = 0;
      image[5] = 0;
      return image;
    })

    this.setState({ dragging: false, staticGuides: {x, y}, images});
  };

  setAppRef = ref => (this.$app = ref);
  setContainerRef = ref => (this.$container = ref);

  handleScroll = () => {
    const screensRect = getBoundingClientRect("screens");
    const canvasRect = getBoundingClientRect("canvas");
    const { scale } = this.state;
    const startX = (screensRect.left + thick - canvasRect.left) / scale;
    const startY = (screensRect.top + thick - canvasRect.top) / scale;



    function elementIsVisible(element, container, partial) {
      var contHeight = container.offsetHeight,
      elemTop = offset(element).top - offset(container).top,
      elemBottom = elemTop + element.offsetHeight;
      return (elemTop >= 0 && elemBottom <= contHeight) || 
      (partial && ((elemTop < 0 && elemBottom > 0 ) || (elemTop > 0 && elemTop <= contHeight)))
    }
    
    // checks window
    function isWindow( obj ) {
        return obj != null && obj === obj.window;
    }
    
    // returns corresponding window
    function getWindow( elem ) {
        return isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
    }
    
    // taken from jquery
    // @returns {{top: number, left: number}} 
    function offset( elem ) {
    
        var docElem, win,
            box = { top: 0, left: 0 },
            doc = elem && elem.ownerDocument;
    
        docElem = doc.documentElement;
    
        if ( typeof elem.getBoundingClientRect !== typeof undefined ) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow( doc );
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
        };
    };
    
    var activePageId =  this.state.pages[0];
    if (this.state.pages.length > 1) {
      var container = document.getElementById('screen-container-parent');
      for (var i = 0; i < this.state.pages.length; ++i) {
        var pageId = this.state.pages[i];
        var canvas = document.getElementById(pageId);
        if (canvas) {
          if (elementIsVisible(canvas, container, true)) {
            activePageId = pageId;
          }
        }
      }
    }

    this.setState({ startX, startY, activePageId });
  };
  handleWheel = e => {
    if (e.ctrlKey || e.metaKey) {
      const nextScale = parseFloat(
        Math.max(0.2, this.state.scale - e.deltaY / 500).toFixed(2)
      );
      this.setState({ scale: nextScale });
    }
  };

  doNoObjectSelected = () => {
    if (!this.state.rotating && !this.state.resizing) {
      let images = this.state.images.map(image => {
        image.selected = false;
        return image;
      });

      var selectedTab = this.state.selectedTab;
      if (this.state.selectedTab === SidebarTab.Font) {
        selectedTab = SidebarTab.Image;
      }

      this.setState({ selectedTab, images, idObjectSelected: null, typeObjectSelected: null, childId: null, });
    }
  };
  removeImage(e) {
    var OSNAME = this.getPlatformName();
    if (
      this.state.idObjectSelected != "undefined" &&
      !e.target.classList.contains("text") &&
      ((e.keyCode === 8 && OSNAME == "Mac/iOS") ||
        (e.keyCode === 91 && OSNAME == "Windows"))
    ) {
      let images = this.state.images.filter(
        img => img._id !== this.state.idObjectSelected
      );
      this.doNoObjectSelected();
      this.setState({ images });
    }
  }
  handleImageSelected = (img, event) => {
    console.log('handleImageSelected');
    console.log('selected image ', img._id, this.state.idObjectSelected);
    if (img._id === this.state.idObjectSelected) {
      return;
    }
    event.stopPropagation();
    var scaleY;
    let images = this.state.images.map(image => {
      if (image._id === img._id) {
        scaleY = image.scaleY;
        image.selected = true; 
        image.fuck = 1;
      } else {
        image.selected = false;
      }
      return image;
    });

    var defaultColor = 'black';
    var font;
    var fontSize;
    var el = document.getElementById(img._id);
    if (el) {
      defaultColor = window.getComputedStyle(el, null).getPropertyValue("color");
      font = window.getComputedStyle(el, null).getPropertyValue("font-family");
      fontSize = window.getComputedStyle(el, null).getPropertyValue("font-size");
      fontSize = parseInt(fontSize.substring(0, fontSize.length)) * scaleY;
    }
    this.handleFontFamilyChange(font);
    this.handleFontColorChange(defaultColor);
    this.setState({fontSize});

    this.setState({ images, idObjectSelected: img._id, typeObjectSelected: img.type, childId: null });
  };

  removeTemplate = (e) => {
    var url = `/api/Template/Delete?id=${this.state._id}`;
    fetch(url,{
      method: 'DELETE',
    });
  }

  download = async (filename, text) => {
    var blobUrl = URL.createObjectURL(text);
    var element = document.createElement('a');

    element.setAttribute('href', blobUrl);
    element.setAttribute('download', filename);
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  downloadPDF(bleed) {
    var previousScale = this.state.scale;
    var self = this;
    this.doNoObjectSelected();
    this.setState(
      { scale: 1, showPopup: true, bleed, downloading: true, },
      () => {
        var aloCloned = document.getElementsByClassName("alo");
        var canvas = [];
        for (var i = 0; i < aloCloned.length; ++i) {
          canvas.push((aloCloned[i] as HTMLElement).outerHTML);
        }

        var styles = document.getElementsByTagName("style");
        var a = Array.from(styles).filter(style => {
          return style.attributes.getNamedItem("data-styled") !== null
        });

        var template = `<html><head>
          ${a[0].outerHTML}
        </head>
        <style type="text/css">
        .mjx-chtml {display: inline-block; line-height: 0; text-indent: 0; text-align: left; text-transform: none; font-style: normal; font-weight: normal; font-size: 100%; font-size-adjust: none; letter-spacing: normal; word-wrap: normal; word-spacing: normal; white-space: nowrap; float: none; direction: ltr; max-width: none; max-height: none; min-width: 0; min-height: 0; border: 0; margin: 0; padding: 1px 0}
.MJXc-display {display: block; text-align: center; margin: 0; padding: 0}
.mjx-chtml[tabindex]:focus, body :focus .mjx-chtml[tabindex] {display: inline-table}
.mjx-full-width {text-align: center; display: table-cell!important; width: 10000em}
.mjx-math {display: inline-block; border-collapse: separate; border-spacing: 0}
.mjx-math * {display: inline-block; -webkit-box-sizing: content-box!important; -moz-box-sizing: content-box!important; box-sizing: content-box!important; text-align: left}
.mjx-numerator {display: block; text-align: center}
.mjx-denominator {display: block; text-align: center}
.MJXc-stacked {height: 0; position: relative}
.MJXc-stacked > * {position: absolute}
.MJXc-bevelled > * {display: inline-block}
.mjx-stack {display: inline-block}
.mjx-op {display: block}
.mjx-under {display: table-cell}
.mjx-over {display: block}
.mjx-over > * {padding-left: 0px!important; padding-right: 0px!important}
.mjx-under > * {padding-left: 0px!important; padding-right: 0px!important}
.mjx-stack > .mjx-sup {display: block}
.mjx-stack > .mjx-sub {display: block}
.mjx-prestack > .mjx-presup {display: block}
.mjx-prestack > .mjx-presub {display: block}
.mjx-delim-h > .mjx-char {display: inline-block}
.mjx-surd {vertical-align: top}
.mjx-mphantom * {visibility: hidden}
.mjx-merror {background-color: #FFFF88; color: #CC0000; border: 1px solid #CC0000; padding: 2px 3px; font-style: normal; font-size: 90%}
.mjx-annotation-xml {line-height: normal}
.mjx-menclose > svg {fill: none; stroke: currentColor}
.mjx-mtr {display: table-row}
.mjx-mlabeledtr {display: table-row}
.mjx-mtd {display: table-cell; text-align: center}
.mjx-label {display: table-row}
.mjx-box {display: inline-block}
.mjx-block {display: block}
.mjx-span {display: inline}
.mjx-char {display: block; white-space: pre}
.mjx-itable {display: inline-table; width: auto}
.mjx-row {display: table-row}
.mjx-cell {display: table-cell}
.mjx-table {display: table; width: 100%}
.mjx-line {display: block; height: 0}
.mjx-strut {width: 0; padding-top: 1em}
.mjx-vsize {width: 0}
.MJXc-space1 {margin-left: .167em}
.MJXc-space2 {margin-left: .222em}
.MJXc-space3 {margin-left: .278em}
.mjx-ex-box-test {position: absolute; overflow: hidden; width: 1px; height: 60ex}
.mjx-line-box-test {display: table!important}
.mjx-line-box-test span {display: table-cell!important; width: 10000em!important; min-width: 0; max-width: none; padding: 0; border: 0; margin: 0}
.MJXc-TeX-unknown-R {font-family: STIXGeneral; font-style: normal; font-weight: normal}
.MJXc-TeX-unknown-I {font-family: monospace; font-style: italic; font-weight: normal}
.MJXc-TeX-unknown-B {font-family: monospace; font-style: normal; font-weight: bold}
.MJXc-TeX-unknown-BI {font-family: monospace; font-style: italic; font-weight: bold}
.MJXc-TeX-ams-R {font-family: MJXc-TeX-ams-R,MJXc-TeX-ams-Rw}
.MJXc-TeX-cal-B {font-family: MJXc-TeX-cal-B,MJXc-TeX-cal-Bx,MJXc-TeX-cal-Bw}
.MJXc-TeX-frak-R {font-family: MJXc-TeX-frak-R,MJXc-TeX-frak-Rw}
.MJXc-TeX-frak-B {font-family: MJXc-TeX-frak-B,MJXc-TeX-frak-Bx,MJXc-TeX-frak-Bw}
.MJXc-TeX-math-BI {font-family: MJXc-TeX-math-BI,MJXc-TeX-math-BIx,MJXc-TeX-math-BIw}
.MJXc-TeX-sans-R {font-family: MJXc-TeX-sans-R,MJXc-TeX-sans-Rw}
.MJXc-TeX-sans-B {font-family: MJXc-TeX-sans-B,MJXc-TeX-sans-Bx,MJXc-TeX-sans-Bw}
.MJXc-TeX-sans-I {font-family: MJXc-TeX-sans-I,MJXc-TeX-sans-Ix,MJXc-TeX-sans-Iw}
.MJXc-TeX-script-R {font-family: MJXc-TeX-script-R,MJXc-TeX-script-Rw}
.MJXc-TeX-type-R {font-family: MJXc-TeX-type-R,MJXc-TeX-type-Rw}
.MJXc-TeX-cal-R {font-family: MJXc-TeX-cal-R,MJXc-TeX-cal-Rw}
.MJXc-TeX-main-B {font-family: MJXc-TeX-main-B,MJXc-TeX-main-Bx,MJXc-TeX-main-Bw}
.MJXc-TeX-main-I {font-family: MJXc-TeX-main-I,MJXc-TeX-main-Ix,MJXc-TeX-main-Iw}
.MJXc-TeX-main-R {font-family: MJXc-TeX-main-R,MJXc-TeX-main-Rw}
.MJXc-TeX-math-I {font-family: MJXc-TeX-math-I,MJXc-TeX-math-Ix,MJXc-TeX-math-Iw}
.MJXc-TeX-size1-R {font-family: MJXc-TeX-size1-R,MJXc-TeX-size1-Rw}
.MJXc-TeX-size2-R {font-family: MJXc-TeX-size2-R,MJXc-TeX-size2-Rw}
.MJXc-TeX-size3-R {font-family: MJXc-TeX-size3-R,MJXc-TeX-size3-Rw}
.MJXc-TeX-size4-R {font-family: MJXc-TeX-size4-R,MJXc-TeX-size4-Rw}
.MJXc-TeX-vec-R {font-family: MJXc-TeX-vec-R,MJXc-TeX-vec-Rw}
.MJXc-TeX-vec-B {font-family: MJXc-TeX-vec-B,MJXc-TeX-vec-Bx,MJXc-TeX-vec-Bw}
.MJX_Assistive_MathML {
  position: absolute!important;
  top: 0;
  left: 0;
  clip: rect(1px, 1px, 1px, 1px);
  padding: 1px 0 0 0!important;
  border: 0!important;
  height: 1px!important;
}
html {
          -webkit-print-color-adjust: exact;
        }
        @font-face {
          font-family: 'Amatic SC';
          src: url('localhost:64099/fonts/broadb.ttf')
        }
        [FONT_FACE]
        body {
          width: ${this.state.rectWidth + (bleed ? 20 : 0)}px;
          height: ${this.state.rectHeight + (bleed ? 20 : 0)}px;
          line-height: 1.42857143;
        }
        </style>
        <body style="margin: 0;">
          [CANVAS]
        </body></html>`;

        axios.post(`/api/Design/Download?width=${this.state.rectWidth + (bleed ? 20 : 0)}&height=${this.state.rectHeight + (bleed ? 20 : 0)}`, 
        {fonts: self.state.fonts,template, canvas},
        {
          headers: {
            'Content-Type': 'text/html',
          },
          responseType: 'blob',
        }).then(response =>{
            self.setState(
              { 
                scale: previousScale, 
                // showPopup: false,
                bleed: false,
                downloading: false,
              }
            );
            self.download("test.pdf", response.data);
          })
      }
    );
  }

  b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  async downloadPNG(transparent, png) {
    console.log('transparent ', transparent);
    var previousScale = this.state.scale;
    var self = this;
    this.doNoObjectSelected();
    this.setState(
      { scale: 1, showPopup: true },
      () => {
        var aloCloned = document.getElementsByClassName("alo");
        var canvas = [];
        for (var i = 0; i < aloCloned.length; ++i) {
          canvas.push((aloCloned[i] as HTMLElement).outerHTML);
        }

        var styles = document.getElementsByTagName("style");
        var a = Array.from(styles).filter(style => {
          return style.attributes.getNamedItem("data-styled") !== null
        });

        axios.post(`/api/Design/DownloadPNG?width=${this.state.rectWidth}&height=${this.state.rectHeight}&transparent=${transparent}&download=true&png=${png}`, 
        {
          fonts: self.state.fontsList.map(font=> font.id), 
          canvas, 
          additionalStyle: a[0].outerHTML, 
          transparent
        },
        {
          headers: {
            'Content-Type': 'text/html',
          },
          responseType: 'blob',
        }).then(response =>{
            self.setState(
              { scale: previousScale, showPopup: false }
            );
            console.log('response.data ', response.data);
            self.download(`test.${png ? "png" : "jpeg"}`, response.data);
          })
      }
    );
  }

  async saveImages(rep) {
    var _id;
    console.log('saveImages ');
    this.setState({isSaving: true})
    const { mode } = this.state;
    var self = this;
    this.doNoObjectSelected();

    const { rectWidth, rectHeight } = this.state;

    let images = self.state.images.map(image => {
      image.width2 = image.width / rectWidth;
      image.height2 = image.height / rectHeight;
      return image;
    })

    if (mode === Mode.CreateTextTemplate || mode === Mode.EditTextTemplate) {
      var newImages = [];
      for (var i = 0; i < images.length; ++i ) {
        var image = images[i];
        if (image.ref === null) {
          newImages.push(...this.normalize(image, images));
        }
      }
      images = newImages;
    }

    if (this.state.mode === Mode.CreateTextTemplate) {
      images = images.map(img => {
        if (img.innerHTML) {
          img.innerHTML = img.innerHTML.replace('#ffffff', 'black');
        }
        return img;
      });
    }

    await setTimeout(async function() {
      var url;
      var _id = self.state._id;
      // if (_id) {
      //   url = "/api/Template/Update";

      //   var res = JSON.stringify({
      //     "Id": _id,
      //     "CreatedAt": "2014-09-27T18:30:49-0300",
      //     "CreatedBy": 2,
      //     "UpdatedAt": "2014-09-27T18:30:49-0300",
      //     "UpdatedBy": 3,
      //     Type: self.state.templateType,
      //     Document: JSON.stringify({
      //       _id: self.state._id ? self.state._id : uuidv4(),
      //       width: self.state.rectWidth,
      //       origin_width: self.state.rectWidth,
      //       height: self.state.rectHeight,
      //       origin_height: self.state.rectHeight,
      //       left: 0,
      //       top: 0,
      //       src: "",
      //       type: self.state.templateType,
      //       scaleX: 1,
      //       scaleY: 1,
      //       document_object: images,
      //     }),
      //     "FontList": self.state.fontsList.map(font=> font.id),
      //     "Width": self.state.rectWidth,
      //     "Height": self.state.rectHeight,
      //     "Pages": self.state.pages,
      //   });

      //   axios.post(url, res, {
      //     headers: {
      //       'Content-Type': 'application/json',
      //     }
      //   })
      //   .then(res => {
      //     self.setState({isSaving: false})
      //   })
      //   .catch(res => {
      //   })

      //   var src = await self.genRepresentative(false, self.state.rectWidth, self.state.rectHeight);

      //   var formData = new FormData();
      //   formData.append('file', src);

      //   // self.download("test.png", src);

      //   var urlUploadRepresentative = `/api/Template/Upload?id=${_id}`;

      //   axios.post(urlUploadRepresentative, formData);
  
      //   return;
      // }

      if (mode == Mode.CreateDesign) {
        url = "/api/Design/Add";
      } else {
        url = "/api/Template/Add";
      }

      console.log('url ', url)

      var type;
      if (mode == Mode.CreateTextTemplate || mode == Mode.EditTextTemplate) {
        type = TemplateType.TextTemplate;
      } else if (mode == Mode.CreateTemplate || mode == Mode.EditTemplate) {
        type = TemplateType.Template;
      }

      var previousScale = self.state.scale;
      self.setState(
        { scale: 1, showPopup: true },
        () => {
          var aloCloned = document.getElementsByClassName("alo");
          var canvas = [];
          for (var i = 0; i < aloCloned.length; ++i) {
            canvas.push((aloCloned[i] as HTMLElement).outerHTML);
          }

          var aloCloned2 = document.getElementById("alo2");
          var canvas2 = [];
          if (aloCloned2) {
            canvas2 = [aloCloned2.outerHTML];
          }

          var styles = document.getElementsByTagName("style");
          var a = Array.from(styles).filter(style => {
            return style.attributes.getNamedItem("data-styled") !== null
          });

          _id = self.state._id ? self.state._id : uuidv4();

          console.log('adding ', _id);

          var res = JSON.stringify({
            "CreatedAt": "2014-09-27T18:30:49-0300",
            "CreatedBy": 2,
            "UpdatedAt": "2014-09-27T18:30:49-0300",
            "UpdatedBy": 3,
            Type: type,
            Document: JSON.stringify({
              _id,
              width: self.state.rectWidth,
              origin_width: self.state.rectWidth,
              height: self.state.rectHeight,
              origin_height: self.state.rectHeight,
              left: 0,
              top: 0,
              type: mode,
              scaleX: 1,
              scaleY: 1,
              document_object: images,
            }),
            "FontList": self.state.fontsList.map(font=> font.id),
            "Width": self.state.rectWidth,
            "Height": self.state.rectHeight,
            "Id": _id,
            "Keywords": [],
            "Canvas": canvas, 
            "Canvas2": canvas2,
            "AdditionalStyle": a[0].outerHTML,
            "FilePath": "/templates",
            "FirstName": "Untilted",
            "Pages": self.state.pages,
            "PrintType": self.state.subtype,
            "Representative": rep ? rep : `images/${uuidv4()}.png`,
            "Representative2": `images/${uuidv4()}.png`,
          });

          console.log('res ', res)

          axios.post(url, res, {
            headers: {
              'Content-Type': 'application/json',
            }
          }).then(res => {
            self.setState({isSaving: false})
          })
        }
      );
    }, 300);

    return _id;
  }

  onTextChange(parentIndex, e, key) {
    const { scale } = this.state;
    let images = this.state.images.map(image => {
      if (image._id === parentIndex) {
        var newHeight = 0;
        var changedText;
        var deltaY = 0;
        var scaleY = image.height / image.origin_height;

        let texts = image.document_object.map(text => {
          if (text._id === key) {
            changedText = { ...text };
            text.innerHTML = e.target.innerHTML;
            var rec = e.target.getBoundingClientRect();
            deltaY =
              rec.height / this.state.scale / scaleY -
              text.height;
            text.height =
              rec.height / this.state.scale / scaleY;
          }
          return text;
        });

        var text2 = [];
        for (var i = 0; i < texts.length; ++i) {
          var d = texts[i];
          if (d.ref === null) {
            text2.push(...this.normalize2(d, texts, image.scaleX, image.scaleY, scale, image.width, image.height));
          }
        }


        text2 = text2.map(text => {
          if (text._id !== key) {
            if (text.top > changedText.top) {
              text.top += deltaY;
            }
          }
          return text;
        });

        text2.forEach(text => {
          newHeight = Math.max(newHeight, (text.top + text.height) * scaleY);
        });

        image.height = newHeight;
        image.origin_height = image.height / scaleY;
        image.document_object = text2;
      }
      return image;
    });

    this.setState({ images });
  }

  onSingleTextChange(thisImage, e, childId) {
    console.log('onSingleTextChange')
    var els;
    if (childId){
      els = document.getElementById(childId).getElementsByTagName('font');
    } else {
      els = document.getElementById(this.state.idObjectSelected).getElementsByTagName('font');
    }

    var scaleChildY = 1;
    if (childId) {
      for (var i = 0; i < thisImage.document_object.length; ++i) {
        if (thisImage.document_object[i]._id === childId) {
          scaleChildY = thisImage.document_object[i].scaleY;
        }
      }
    }

    for (var i = 0; i < els.length; ++i) {
      els[i].removeAttribute("size");
      els[i].style.fontSize = this.state.fontSize / thisImage.scaleY / scaleChildY + 'px';
    }
    

    console.log('onSingleTextChange ', this.state.fontSize / thisImage.scaleY + 'px')

    e.persist();
    setTimeout(() => {
      const { scale } = this.state;
      if (!childId) {
        let images = this.state.images.map(image => {
          if (image._id === thisImage._id) {
            var centerX = image.left + image.width / 2;
            var centerY = image.top + image.height / 2;
            if (image.origin_height === 0) {
              image.scaleY = 0;
            } else {
              image.scaleY = image.height / image.origin_height;
            }
            image.width = (e.target.offsetWidth) * image.scaleX;

            var oldHeight = image.height;
            var a;
            if (thisImage.type === TemplateType.Heading) {
              a = document.getElementById(thisImage._id).getElementsByClassName("text")[0] as HTMLElement;
            } else if (thisImage.type === TemplateType.Latex){
              a = document.getElementById(thisImage._id).getElementsByClassName("text2")[0] as HTMLElement;
            }
            var newHeight = a.offsetHeight * image.scaleY;
            console.log('newHeight ', newHeight);
            image.height = newHeight;
            var tmp = newHeight/2 - oldHeight/2;
            var deltacX = tmp * Math.sin((360 - image.rotateAngle) / 180 * Math.PI);
            var deltacY = tmp * Math.cos((360 - image.rotateAngle) / 180 * Math.PI);
            var newCenterX = centerX + deltacX;
            var newCenterY = centerY + deltacY;
  
            image.left = newCenterX - image.width / 2;
            image.top = newCenterY - image.height / 2;
  
            if (image.scaleY === 0) {
              image.origin_height = 0;
            } else {
              image.origin_height = image.height / image.scaleY;
            }
  
            image.innerHTML = e.target.innerHTML;
          }
          return image;
        });
  
        this.setState({ images, editing: true });
      } else {
        let images = this.state.images.map(image => {
          if (image._id === thisImage._id) {
            var scaleY = image.height / image.origin_height;
  
            let texts = image.document_object.map(text => {
              if (text._id === childId) {
                // var fontElements = window.getSelection().anchorNode.parentNode;
                // var a = fontElements as HTMLElement
                // a.removeAttribute("size");
                // a.style.fontSize = this.state.fontSize / image.scaleY / text.scaleY + 'px';

                console.log('text ', text.innerHTML, e.target.innerHTML);
                
                text.innerHTML = e.target.innerHTML;
                text.height = e.target.offsetHeight * text.scaleY;
                console.log('newHeight', text.height)
              }
              return text;
            });
  
            var newDocumentObjects = [];
            for (var i = 0; i < texts.length; ++i) {
              var d = texts[i];
              if (d.ref === null) {
                newDocumentObjects.push(...this.normalize2(d, texts, image.scaleX, image.scaleY, scale, image.width, image.height));
              }
            }
  
            var maxHeight = 0;
            for (var i = 0; i < newDocumentObjects.length; ++i) {
              maxHeight = Math.max(maxHeight, newDocumentObjects[i].top + newDocumentObjects[i].height);
            }
  
            var centerX = image.left + image.width / 2;
            var centerY = image.top + image.height / 2;
            var oldHeight = image.height;
            var newHeight = maxHeight * scaleY;
            image.height = newHeight;
            var tmp = newHeight/2 - oldHeight/2;
            var deltacX = tmp * Math.sin((360 - (image.rotateAngle ? image.rotateAngle : 0)) / 180 * Math.PI);
            var deltacY = tmp * Math.cos((360 - (image.rotateAngle ? image.rotateAngle : 0)) / 180 * Math.PI);
            var newCenterX = centerX + deltacX;
            var newCenterY = centerY + deltacY;
  
            image.height = maxHeight * scaleY;
  
            image.left = newCenterX - image.width / 2;
            image.top = newCenterY - image.height / 2;
            image.origin_height = image.height / scaleY;
            image.document_object = newDocumentObjects;
          }
          return image;
        });
    
        this.setState({ images });
      }
    }, 50);
  }

  imgDragging = null;

  templateOnMouseDown(id, e) {
    var ce = document.createElement.bind(document);
    var ca = document.createAttribute.bind(document);
    var ge = document.getElementsByTagName.bind(document);
    e.preventDefault();

    var self = this;
    const url = `/api/Template/Get?id=${id}`;
        const { rectWidth, rectHeight } = this.state;
        var doc = this.state.templates.find(doc => doc.id == id);
        if (!doc) {
          doc = this.state.templates2.find(doc => doc.id == id);
        }
        var template = JSON.parse(doc.document)
        var scaleX = rectWidth / template.width;
        var scaleY = rectHeight / template.height;

        template.document_object = template.document_object.map(doc => {
          doc.width = doc.width * scaleX;
          doc.height = doc.height * scaleY;
          doc.top = doc.top * scaleY;
          doc.left = doc.left * scaleX;
          doc.scaleX = doc.scaleX * scaleX;
          doc.scaleY = doc.scaleY * scaleY;
          doc.page = this.state.activePageId;
          doc.imgWidth = doc.imgWidth * scaleX;
          doc.imgHeight = doc.imgHeight * scaleY;

          return doc;
        });

        console.log('template.fontList ', doc)

        if (doc.fontList) {
          var fontList = doc.fontList.forEach(id => { 
              var style = `@font-face {
                font-family: '${id}';
                src: url('/fonts/${id}.ttf');
              }`;
              var styleEle = ce("style");
              var type = ca("type");
              type.value = "text/css";
              styleEle.attributes.setNamedItem(type)
              styleEle.innerHTML = style;
              var head = document.head || ge('head')[0];
              head.appendChild(styleEle);

              var link = ce('link');
              link.id = id;
              link.rel = 'preload';
              link.href = `/fonts/${id}.ttf`
              link.media = 'all';
              link.as = "font";
              link.crossOrigin = "anonymous";
              head.appendChild(link);
            return {
            id: id,
            }
          });
        }

        var id = template.id;
        var images = this.state.images.filter(image => {
          return image.page !== this.state.activePageId;
        })
        self.setState(state => ({ 
          fonts: doc.fontList,
          images: [...images, ...template.document_object], 
          _id: id,
          idObjectSelected: null,
        }));
      // });
  }

  textOnMouseDown(id, e) {
    console.log(arguments)
    var ce = document.createElement.bind(document);
    var ca = document.createAttribute.bind(document);
    var ge = document.getElementsByTagName.bind(document);

    e.preventDefault();
    var target = e.target.cloneNode(true);
    target.style.zIndex = "11111111111";
    target.style.width = e.target.getBoundingClientRect().width + 'px';
    document.body.appendChild(target);
    var self = this;
    this.imgDragging = target;
    var posX = e.pageX - e.target.getBoundingClientRect().left;
    var dragging = true;
    var posY = e.pageY - e.target.getBoundingClientRect().top;

    const onMove = e => {
      if (dragging) {
        target.style.left = e.pageX - posX + "px";
        target.style.top = e.pageY - posY + "px";
        target.style.position = "absolute";
      }
    };

    const onUp = e => {
      dragging = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);

        var recs = document.getElementsByClassName("alo");
        var rec2 = this.imgDragging.getBoundingClientRect();
        for (var i = 0; i < recs.length; ++i) {
          var rec = recs[i].getBoundingClientRect();
          var rec3 = recs[i];
        if (
        rec.left < e.pageX &&
        e.pageX < rec.left + rec.width &&
        rec.top < e.pageY &&
        e.pageY < rec.top + rec.height
        ) {
          const url = `/api/Template/Get?id=${id}`;
          var rectTop = rec.top;
          var index = i;
          fetch(url)
            .then(
              response => response.text()
            )
            .then(html => {
              // var image = JSON.parse(html);
              // console.log('image ', image);
              // var document = JSON.parse(image.value.document)
              // console.log('document ', document);
              var doc = this.state.groupedTexts.find(doc => doc.id == id);
              if (!doc) {
                doc = this.state.groupedTexts2.find(doc => doc.id == id);
              }
              var document = JSON.parse(doc.document)
              console.log('document ', document);
              document._id = uuidv4();
              document.page = self.state.pages[index];
              document.zIndex = this.state.upperZIndex + 1;
              document.width = rec2.width / self.state.scale;
              document.height = rec2.height / self.state.scale;
              // document.width = rec2.width;
              // document.height = rec2.height;
              // document.origin_width = document.width / document.scaleX;
              // document.origin_height = document.height / document.scaleY;
              document.scaleX = document.width / document.origin_width;
              document.scaleY = document.height / document.origin_height;
              console.log('document ', document);
              document.left = (rec2.left - rec.left) / self.state.scale;
              document.top = (rec2.top - rectTop) / self.state.scale;
              // document.scaleX = rec2.width / this.state.rectWidth;
              // document.scaleY = rec2.height / this.state.rectHeight;
              // document.scaleX = 1;
              // document.scaleY = 1;
              // document.document_object = document.document.map(obj => {
              //   // obj.childId = uuidv4();
              //   // obj._id = uuidv4();
              //   return obj;
              // })

              let images = [...this.state.images, document];

              if (doc.fontList) {
                var fontList = doc.fontList.forEach(id => { 
                    var style = `@font-face {
                      font-family: '${id}';
                      src: url('/fonts/${id}.ttf');
                    }`;
                    var styleEle = ce("style");
                    var type = ca("type");
                    type.value = "text/css";
                    styleEle.attributes.setNamedItem(type)
                    styleEle.innerHTML = style;
                    var head = document.head || ge('head')[0];
                    head.appendChild(styleEle);
      
                    var link = ce('link');
                    link.id = id;
                    link.rel = 'preload';
                    link.href = `/fonts/${id}.ttf`
                    link.media = 'all';
                    link.as = "font";
                    link.crossOrigin = "anonymous";
                    head.appendChild(link);
                  return {
                  id: id,
                  }
                });
              }

              self.setState({ 
                images,
                fonts: doc.fontList,
                upperZIndex: this.state.upperZIndex + 1,
              });
            });
        }
      }

      target.remove();
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  backgroundOnMouseDown(e) {
    var rec2 = e.target.getBoundingClientRect();
    var self = this;
    let images = [...this.state.images];
    var {rectWidth, rectHeight} = this.state;
    var ratio = rectWidth / rectHeight;
    var imgRatio = rec2.width / rec2.height;
    var width = rectWidth;
    var height = rectWidth / imgRatio;
    if (height < rectHeight) {
      height = rectHeight;
      width = imgRatio * height;
    }
    images.push({
      _id: uuidv4(),
      type: TemplateType.BackgroundImage,
      width: rectWidth,
      height: rectHeight,
      origin_width: width,
      origin_height: height,
      left: 0,
      top:  0,
      rotateAngle: 0.0,
      src: e.target.src,
      selected: false,
      scaleX: 1,
      scaleY: 1,
      posX: -(width - rectWidth) / 2,
      posY: -(height - rectHeight) / 2,
      imgWidth: width,
      imgHeight: height,
      page: this.state.activePageId,
      zIndex: 1,
    });

    this.setState({ images });
  }

  videoOnMouseDown(e) {
    e.preventDefault();

    console.log('videoOnMouseDown e.target ', e.target);
    var target = e.target.cloneNode(true);

    console.log('videoOnMouseDown cloned', e.target.getElementsByTagName("source"))
    target.style.zIndex = "11111111111";
    console.log('e.target ', e.target.getElementsByTagName("source")[0].getAttribute("src"))
    target.src = e.target.getElementsByTagName("source")[0].getAttribute("src");
    target.style.width = e.target.getBoundingClientRect().width + 'px';
    console.log('e.target.getBoundingClientRect().width ', e.target.getBoundingClientRect().width);
    document.body.appendChild(target);
    var self = this;
    this.imgDragging = target;
    var posX = e.pageX - e.target.getBoundingClientRect().left;
    var dragging = true;
    var posY = e.pageY - e.target.getBoundingClientRect().top;

    var recScreenContainer = document.getElementById('screen-container-parent').getBoundingClientRect(); 
    var beingInScreenContainer = false; 

    const onMove = e => {
      if (dragging) {
        var rec2 = self.imgDragging.getBoundingClientRect();
        if (
          beingInScreenContainer === false &&
          recScreenContainer.left < rec2.left &&
          recScreenContainer.right > rec2.right &&
          recScreenContainer.top < rec2.top &&
          recScreenContainer.bottom > rec2.bottom
        ) {

          beingInScreenContainer = true;

          // target.style.width = (rec2.width * self.state.scale) + 'px';
          // target.style.height = (rec2.height * self.state.scale) + 'px';
          // target.style.transitionDuration = '0.05s';

          setTimeout(() => {
            target.style.transitionDuration = '';
          }, 50);
        }

        if (beingInScreenContainer === true &&
          !(recScreenContainer.left < rec2.left &&
            recScreenContainer.right > rec2.right &&
            recScreenContainer.top < rec2.top &&
            recScreenContainer.bottom > rec2.bottom)
        ) {
          beingInScreenContainer = false;

          // target.style.width = (rec2.width / self.state.scale) + 'px';
          // target.style.height = (rec2.height / self.state.scale) + 'px';
          // target.style.transitionDuration = '0.05s';

          setTimeout(() => {
            target.style.transitionDuration = '';
          }, 50);
        }

        target.style.left = e.pageX - posX + "px";
        target.style.top = e.pageY - posY + "px";
        target.style.position = "absolute";
      }
    };

    const onUp = e => {
      dragging = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);

      var recs = document.getElementsByClassName("alo");
      var rec2 = self.imgDragging.getBoundingClientRect();
      for (var i = 0; i < recs.length; ++i){
        var rec = recs[i].getBoundingClientRect();
        if (
          rec.left < rec2.right &&
          rec.right > rec2.left &&
          rec.top < rec2.bottom &&
          rec.bottom > rec2.top
        ) {
          let images = [...this.state.images];
          images.push({
            _id: uuidv4(),
            type: TemplateType.Video,
            width: rec2.width / self.state.scale,
            height: rec2.height / self.state.scale,
            origin_width: rec2.width / self.state.scale,
            origin_height: rec2.height / self.state.scale,
            left: (rec2.left - rec.left) / self.state.scale,
            top: (rec2.top - rec.top) / self.state.scale,
            rotateAngle: 0.0,
            src: target.src,
            selected: false,
            scaleX: 1,
            scaleY: 1,
            posX: 0,
            posY: 0,
            imgWidth: (rec2.width / self.state.scale),
            imgHeight: (rec2.height / self.state.scale),
            page: this.state.pages[i],
            zIndex: this.state.upperZIndex + 1,
          });

          self.setState({ images, upperZIndex: this.state.upperZIndex + 1, });
        }
      }

      self.imgDragging.remove();
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  imgOnMouseDown(e) {
    e.preventDefault();
    var target = e.target.cloneNode(true);
    target.style.zIndex = "11111111111";
    console.log('e.target ', e.target.getAttribute("srcset"))
    target.src = e.target.getAttribute("src");
    target.style.width = e.target.getBoundingClientRect().width + 'px';
    console.log('e.target.getBoundingClientRect().width ', e.target.getBoundingClientRect().width);
    document.body.appendChild(target);
    var self = this;
    this.imgDragging = target;
    var posX = e.pageX - e.target.getBoundingClientRect().left;
    var dragging = true;
    var posY = e.pageY - e.target.getBoundingClientRect().top;

    var recScreenContainer = document.getElementById('screen-container-parent').getBoundingClientRect(); 
    var beingInScreenContainer = false; 

    const onMove = e => {
      if (dragging) {
        var rec2 = self.imgDragging.getBoundingClientRect();
        if (
          beingInScreenContainer === false &&
          recScreenContainer.left < rec2.left &&
          recScreenContainer.right > rec2.right &&
          recScreenContainer.top < rec2.top &&
          recScreenContainer.bottom > rec2.bottom
        ) {

          beingInScreenContainer = true;

          // target.style.width = (rec2.width * self.state.scale) + 'px';
          // target.style.height = (rec2.height * self.state.scale) + 'px';
          // target.style.transitionDuration = '0.05s';

          setTimeout(() => {
            target.style.transitionDuration = '';
          }, 50);
        }

        if (beingInScreenContainer === true &&
          !(recScreenContainer.left < rec2.left &&
            recScreenContainer.right > rec2.right &&
            recScreenContainer.top < rec2.top &&
            recScreenContainer.bottom > rec2.bottom)
        ) {
          beingInScreenContainer = false;

          // target.style.width = (rec2.width / self.state.scale) + 'px';
          // target.style.height = (rec2.height / self.state.scale) + 'px';
          // target.style.transitionDuration = '0.05s';

          setTimeout(() => {
            target.style.transitionDuration = '';
          }, 50);
        }

        target.style.left = e.pageX - posX + "px";
        target.style.top = e.pageY - posY + "px";
        target.style.position = "absolute";
      }
    };

    const onUp = e => {
      dragging = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);

      var recs = document.getElementsByClassName("alo");
      var rec2 = self.imgDragging.getBoundingClientRect();
      for (var i = 0; i < recs.length; ++i){
        var rec = recs[i].getBoundingClientRect();
        if (
          rec.left < rec2.right &&
          rec.right > rec2.left &&
          rec.top < rec2.bottom &&
          rec.bottom > rec2.top
        ) {
          let images = [...this.state.images];
          images.push({
            _id: uuidv4(),
            type: TemplateType.Image,
            width: rec2.width / self.state.scale,
            height: rec2.height / self.state.scale,
            origin_width: rec2.width / self.state.scale,
            origin_height: rec2.height / self.state.scale,
            left: (rec2.left - rec.left) / self.state.scale,
            top: (rec2.top - rec.top) / self.state.scale,
            rotateAngle: 0.0,
            src: target.src,
            selected: false,
            scaleX: 1,
            scaleY: 1,
            posX: 0,
            posY: 0,
            imgWidth: (rec2.width / self.state.scale),
            imgHeight: (rec2.height / self.state.scale),
            page: this.state.pages[i],
            zIndex: this.state.upperZIndex + 1,
          });

          self.setState({ images, upperZIndex: this.state.upperZIndex + 1, });
        }
      }

      self.imgDragging.remove();
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  onClickDropDownList = e => {
    document.getElementById("myDropdown").classList.toggle("show");

    const onDown = e => {
      if (!e.target.matches(".dropbtn")) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains("show")) {
            openDropdown.classList.remove("show");
          }
        }

        document.removeEventListener("mouseup", onDown);
      }
    };

    document.addEventListener("mouseup", onDown);
  };

  onClickDropDownFontList = e => {
    e.preventDefault();
    this.setState({selectedTab: SidebarTab.Font, toolbarOpened: true,});
  };

  onClickDropDownFontSizeList = () => {
    document.getElementById("myFontSizeList").classList.toggle("show");

    const onDown = e => {
      if (!e.target.matches(".dropbtn-font-size")) {
        var dropdowns = document.getElementsByClassName(
          "dropdown-content-font-size"
        );
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains("show")) {
            openDropdown.classList.remove("show");
          }
        }

        document.removeEventListener("mouseup", onDown);
      }
    };

    document.addEventListener("mouseup", onDown);
  };

  onClickpositionList = () => {
    document.getElementById("myPositionList").classList.toggle("show");

    const onDown = e => {
      if (!e.target.matches(".dropbtn-font-size")) {
        var dropdowns = document.getElementsByClassName(
          "dropdown-content-font-size"
        );
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains("show")) {
            openDropdown.classList.remove("show");
          }
        }

        document.removeEventListener("mouseup", onDown);
      }
    };

    document.addEventListener("mouseup", onDown);
  };

  getPlatformName = () => {
    var OSName = "Unknown";
    if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1)
      OSName = "Windows";
    if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1)
      OSName = "Windows";
    if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1)
      OSName = "Windows";
    if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1)
      OSName = "Windows";
    if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1)
      OSName = "Windows";
    if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1)
      OSName = "Windows";
    if (window.navigator.userAgent.indexOf("Mac") != -1) OSName = "Mac/iOS";
    if (window.navigator.userAgent.indexOf("X11") != -1) OSName = "UNIX";
    if (window.navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux";

    return OSName;
  };

  genRepresentative(invert, width, height) {
    
    const invertcolor = (data) => {
      for (var i = 0; i < data.length; i+=4) {
        data[i] = data[i] ^ 255;
        data[i + 1] = data[i + 1] ^ 255;
        data[i + 2] = data[i + 2] ^ 255;
      }
    }

    var node = document.getElementById('alo');

    console.log('node ', node);

    return htmlToImage.toPng(node)
  }

  allowScroll = true;

handleToolbarResize = e => {
    e.preventDefault();
    var self = this;
    var minimumToolbarSize = 332;
    const onMove = e => {
      e.preventDefault();
      var toolbarSize = e.pageX;
      if (e.pageX >= minimumToolbarSize) {
        self.setState({ toolbarSize });
      }
    };

    const onUp = e => {
      e.preventDefault();
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  handleScroll2 = (e) => {
    if (this.allowScroll === false) {
      var rec1 = document.getElementById("screen-container").getBoundingClientRect();
      var rec2 = document.getElementById("screen-container-parent").getBoundingClientRect();


      var deltaX = rec2.left - rec1.left;
      var deltaY = rec2.top - rec1.top;

      var scrollX = deltaX / rec1.width * 100;
      var scrollY = deltaY / rec1.height * 100;

      this.setState({scrollX, scrollY})
    }
  }

  handleScrollX = (e) => {
    var self = this;
    var startX = e.pageX;

    var originalScrollX = this.state.scrollX;

    var previousX = 0;
    this.allowScroll = true;

    const onMove = (e) => {
      var rec = document.getElementById("screen-container-parent").getBoundingClientRect();
      var deltaX = e.pageX - startX;
      var scrollX = originalScrollX + (deltaX) / rec.width * 100;
      if (scrollX < 0 || scrollX > 33.33) {
        return;
      }
      if (deltaX !== previousX) {
        document.getElementById('screen-container-parent').scrollBy(deltaX - previousX, 0)
        previousX = deltaX;
      }

      self.setState({
        scrollX
      })
    }

    const onUp = (e) => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);

      self.allowScroll = false;
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  handleScrollY = (e) => {
    var self = this;
    var startY = e.pageY;

    var originalScrollY = this.state.scrollY;

    var previousY = 0;
    this.allowScroll = true;

    const onMove = (e) => {
      var rec = document.getElementById("screen-container-parent").getBoundingClientRect();
      var deltaY = e.pageY - startY;
      var scrollY = originalScrollY + (deltaY) / rec.height * 100;
      if (scrollY < 0 || scrollY > 33.33) {
        return;
      }


      if (deltaY !== previousY) {
        document.getElementById('screen-container-parent').scrollBy(0, deltaY - previousY)
        previousY = deltaY;
      }

      self.setState({
        scrollY,
      })
    }

    const onUp = (e) => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);

      self.allowScroll = false;
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  handleSidebarSelectorClicked = (selectedTab : SidebarTab, e : any) => {
    e.preventDefault();
    this.setState({
      toolbarOpened: true,
      selectedTab: selectedTab,
    });
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // this.getBottomOfScreenContainer();
  }


  // getBottomOfScreenContainer = () => {
  //   const { rectHeight, scale } = this.state;
  //   var rec1 = document.getElementById("screen-container-parent").getBoundingClientRect();
  //   var res = null;
  //   if (rec1.height >= rectHeight * scale + 40) {
  //     res = '0px';
  //   }

  //   document.getElementById("screen-container").style.bottom = res;
  //   document.getElementById("guide-container").style.bottom = res;
  // }

  normalize2(image: any, images: any, scaleX: number, scaleY: number, scale: number, width: number, height: number) : any {
    var result = [];
    var norm = (image, parent) => {
      var res = {...image};
      if (parent != null) {
        var img = images.filter(img => img._id === image._id)[0];
        res.top = parent.top + img.margin_top + parent.height;
      }
       
      result.push(res);
      if (res.childId) {

        var child = images.filter(img => img._id === res.childId)[0];

        norm(child, res);
      }
    }
    
    norm(image, null);
    
    return result;
  }

  normalize(image: any, images: any) : any {
    var result = [];
    var norm = (image, parent) => {
      var res = {...image};
      if (parent != null) {
        var rec = getBoundingClientRect(parent._id);
        var rec3 = getBoundingClientRect(image._id);
        res.margin_top = (rec3.top - rec.bottom) / this.state.scale;
        res.margin_left = (rec3.left - rec.right) / this.state.scale;
      }
      result.push(res);
      if (res.childId) {
        var child = images.filter(img => img._id === res.childId)[0];
        norm(child, res);
      }
    }
    norm(image, null);
    
    return result;
  }

  uploadBackground = (e) => {
    var self = this;``
    var fileUploader = document.getElementById("background-file") as HTMLInputElement;
    var file = fileUploader.files[0];
    var fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = () => {
      console.log('fr.result ', fr.result);
      var url = `/api/Media/Add`;
      var i = new Image(); 

      i.onload = function(){
        axios.post(url, {id: uuidv4(), data: fr.result, width: i.width, height: i.height, type: TemplateType.BackgroundImage})
        .then(() => {
          // url = `/api/Font/Search`;
          // fetch(url, {
          //   mode: 'cors'
          // })
          //   .then(response => response.text())
          //   .then(html => {
          //     var fontsList = JSON.parse(html).value;
          //     self.setState({ fontsList });
          //   });
        });
      };
      

      i.src = fr.result.toString();
  }
  }

  uploadImage = (type, e) => {
    console.log('selectedTab ', this.state.selectedTab);
    var self = this;``
    var fileUploader = document.getElementById("image-file") as HTMLInputElement;
    var file = fileUploader.files[0];
    var fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = () => {
      console.log('fr.result ', fr.result);
      var url = `/api/Media/Add`;
      var i = new Image(); 

      i.onload = function(){
        var prominentColor = getMostProminentColor(i);
        axios.post(url, {id: uuidv4(), color: `rgb(${prominentColor.r}, ${prominentColor.g}, ${prominentColor.b})`, data: fr.result, width: i.width, height: i.height, type, keywords: ["123", "123"], title: 'Manh quynh'})
        .then(() => {
          // url = `/api/Font/Search`;
          // fetch(url, {
          //   mode: 'cors'
          // })
          //   .then(response => response.text())
          //   .then(html => {
          //     var fontsList = JSON.parse(html).value;
          //     self.setState({ fontsList });
          //   });
        });
      };
      

      i.src = fr.result.toString();
  }
}

  uploadFont = (e) => {
    console.log('uploadFont ');
    var self = this;``
    var fileUploader = document.getElementById("image-file") as HTMLInputElement;
    var file = fileUploader.files[0];
    var fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = () => {
      var url = `/api/Font/Add`;
      axios.post(url, {id: uuidv4(), data: fr.result})
        .then(() => {
          // url = `/api/Font/Search`;
          // fetch(url, {
          //   mode: 'cors'
          // })
          //   .then(response => response.text())
          //   .then(html => {
          //     var fontsList = JSON.parse(html).value;
          //     self.setState({ fontsList });
          //   });

          self.setState({hasMoreFonts: true,})
        });
    }
  }

  selectFont = (id, e) => {
    console.log('selectedFont');
    this.setState({fontId: id});

    var font = this.state.fontsList.find(font => font.id === id);

    var a = document.getSelection();
    if (a && a.type === "Range") {
      document.execCommand("FontName", false, id);
    } else {
      var childId = this.state.childId ? this.state.childId : this.state.idObjectSelected;
      var el = this.state.childId ? document.getElementById(childId) : document.getElementById(childId).getElementsByClassName('text')[0]; 
      var sel = window.getSelection();
      var range = document.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand('FontName', false, id);
      sel.removeAllRanges();
    }

    this.setState({fontName: font.representative});

    e.preventDefault();
    var style = `@font-face {
      font-family: '${id}';
      src: url('/fonts/${id}.ttf');
    }`;
    var styleEle = document.createElement("style");
    var type = document.createAttribute("type");
    type.value = "text/css";
    styleEle.attributes.setNamedItem(type)
    styleEle.innerHTML = style;
    var head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(styleEle);

    var link = document.createElement('link');
    link.id = id;
    link.rel = 'preload';
    link.href = `/fonts/${id}.ttf`
    link.media = 'all';
    link.as = "font";
    link.crossOrigin = "anonymous";
    head.appendChild(link);
    
    var fonts = [...this.state.fonts];
    fonts.push(id);
    this.setState({fonts});
  }

  handleChildIdSelected = (childId) => {
    console.log('handleChildIdSelected');
    this.setState({childId});
  }

  handleFontSizeChange = (fontSize) => {
    this.setState({fontSize});
  }

  handleFontColorChange = (fontColor) => {
    this.setState({fontColor});
  }

  handleFontFamilyChange = (fontId) => {
    if (fontId) {
      var font = this.state.fontsList.find(font => font.id === fontId);
      if (font) {
        this.setState({fontName: font.representative, fontId});
      }
    }
  }

  setSelectionColor = (color, e) => {
    console.log('_id ', this.state.idObjectSelected);
    console.log('type', this.state.typeObjectSelected);
    if (this.state.typeObjectSelected === TemplateType.Latex) {
      var images = this.state.images.map(img => {
        if (img._id === this.state.idObjectSelected) {
          img.color = color;
        }
        return img;
      });

      console.log('images ', images);

      this.setState({images});
    }
    e.preventDefault();
    document.execCommand('foreColor', false, color);
    var a = document.getSelection();
    if (a && a.type === "Range") {
      this.handleFontColorChange(color);
    } else {
      var childId = this.state.childId ? this.state.childId : this.state.idObjectSelected;
      console.log('childId ', childId)
      var el = this.state.childId ? document.getElementById(childId) : document.getElementById(childId).getElementsByClassName('text')[0];      console.log('el ', el);
      var sel = window.getSelection();
      var range = document.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);
      this.handleFontColorChange(color);
      document.execCommand('foreColor', false, color);
      sel.removeAllRanges();
    }
  }

  enableCropMode = (e) => {
    this.setState({cropMode: true});
  }

  toggleImageResizing = (e) => {
    this.setState({resizingInnerImage: !this.state.resizingInnerImage});
  }

  handleChangeSide = (e) => {
    this.doNoObjectSelected();
    e.preventDefault();
    this.setState({
      images: this.state.images2,
      images2: this.state.images,
    });
  }

  addAPage = (e, id) => {
    e.preventDefault();
    let pages = [...this.state.pages];
    var newPageId = uuidv4();
    pages.splice(pages.findIndex(img => img === id) + 1, 0, newPageId);
    this.setState({
      pages,
    });
    setTimeout(() => {
      document.getElementById(newPageId).scrollIntoView();
    }, 100);
  }

  forwardSelectedObject = (id) => {
    let images = this.state.images.map(img => {
      if (img._id === this.state.idObjectSelected) {
        img.zIndex = this.state.upperZIndex + 1;
      }
      return img;
    });

    this.setState({images, upperZIndex: this.state.upperZIndex + 1});
  }

  backwardSelectedObject = (id) => {
    let images = this.state.images.map(img => {
      if (img._id === this.state.idObjectSelected) {
        img.zIndex = 0;
      }
      return img;
    });

    this.setState({images, upperZIndex: this.state.upperZIndex + 1});
  }

  loadMoreFont = (initialLoad) => {
    console.log('loadmoreFont')
    let pageId;
    let count;
    if (initialLoad) {
      pageId = 1;
      count = 30;
    } else {
      pageId = (this.state.fontsList.length) / 1 + 1;
      count = 1;
    }
    // this.setState({ isLoading: true, error: undefined });
    const url = `/api/Font/Search?page=${pageId}&perPage=${count}`;
    console.log('url ', url);
    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          console.log('res ', res);
          this.setState(state => ({
            fontsList: [...state.fontsList, ...res.value.key],
            totalFonts: res.value.value,
            hasMoreFonts: res.value.value > state.fontsList.length + res.value.key.length,
          }))
        },
        error => {
          // this.setState({ isLoading: false, error })
        }
    )
  }

  loadMoreBackground = (initialload) => {
    let pageId;
    let count;
    if (initialload) {
      pageId = 1;
      count = 10;
    } else {
      pageId = (this.state.backgrounds1.length + this.state.backgrounds2.length + this.state.backgrounds3.length) / 5 + 1;
      count = 5;
    }
    this.setState({ isLoading: true, error: undefined });
    // const url = `https://api.unsplash.com/photos?page=1&&client_id=500eac178a285523539cc1ec965f8ee6da7870f7b8678ad613b4fba59d620c29&&query=${this.state.query}&&per_page=${count}&&page=${pageId}`;
    const url = `/api/Media/Search?type=${TemplateType.BackgroundImage}&page=${pageId}&perPage=${count}`;
    console.log('url loadMoreBackground ', url);
    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          var result = res.value.key;
          console.log('res loadMoreBackground', res);
          var currentBackgroundHeights1 = this.state.currentBackgroundHeights1;
          var currentBackgroundHeights2 = this.state.currentBackgroundHeights2;
          var currentBackgroundHeights3 = this.state.currentBackgroundHeights3;
          var res1 = [];
          var res2 = [];
          var res3 = [];
          for (var i = 0; i < result.length; ++i) {
            var currentItem = result[i];
            if (currentBackgroundHeights1 <= currentBackgroundHeights2 && currentBackgroundHeights1 <= currentBackgroundHeights3) {
              res1.push(currentItem);
              currentBackgroundHeights1 += 150 / (currentItem.width / currentItem.height);
            } else if (currentBackgroundHeights2 <= currentBackgroundHeights1 && currentBackgroundHeights2 <= currentBackgroundHeights3) {
              res2.push(currentItem);
              currentBackgroundHeights2 += 150 / (currentItem.width / currentItem.height);
            } else {
              res3.push(currentItem);
              currentBackgroundHeights3 += 150 / (currentItem.width / currentItem.height);
            }
          }
          console.log('res1 ', res1);
          console.log('res2 ', res2);
          console.log('this.state.items', this.state.items);
          console.log('this.state.items2', this.state.items2);
          this.setState(state => ({
            backgrounds1: [...state.backgrounds1, ...res1],
            backgrounds2: [...state.backgrounds2, ...res2],
            backgrounds3: [...state.backgrounds3, ...res3],
            currentBackgroundHeights1,
            currentBackgroundHeights2,
            currentBackgroundHeights3,
            cursor: res.cursor,
            isLoading: false,
            hasMoreBackgrounds: res.value.value > state.items.length + state.items2.length + res.value.key.length,
          }))
        },
        error => {
          this.setState({ isLoading: false, error })
        }
    )
  }

  loadMoreTemplate = (initalLoad, subtype) => {
    console.log('loadMoreTextTemplate')
    let pageId;
    let count;
    if (initalLoad) {
      pageId = 1;
      count = 5;
    } else {
      pageId = Math.round((this.state.templates.length + this.state.templates2.length) / 5) + 1;
      count = 5;
    }
    // this.setState({ isLoading: true, error: undefined });
    const url = `/api/Template/Search?Type=${TemplateType.Template}&page=${pageId}&perPage=${count}&printType=${subtype ? subtype : this.state.subtype}`;
    console.log('url ', url);
    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          console.log('res loadMoreTemplate', res);
          var result = res.value.key;
          var currentTemplatesHeight = this.state.currentTemplatesHeight;
          var currentTemplate2sHeight = this.state.currentTemplate2sHeight;
          var res1 = [];
          var res2 = [];
          for (var i = 0; i < result.length; ++i) {
            var currentItem = result[i];
            if (currentTemplatesHeight <= currentTemplate2sHeight) {
              res1.push(currentItem);
              currentTemplatesHeight += 150 / (currentItem.width / currentItem.height);
            } else {
              res2.push(currentItem);
              currentTemplate2sHeight += 150 / (currentItem.width / currentItem.height);
            }
          }
          this.setState(state => ({
            templates: [...state.templates, ...res1],
            templates2: [...state.templates2, ...res2],
            currentTemplatesHeight,
            currentTemplate2sHeight,
            hasMoreTemplate: res.value.value > state.templates.length + state.templates2.length + res.value.key.length,
          }))
        },
        error => {
          // this.setState({ isLoading: false, error })
        }
    )
  }

  loadMoreTextTemplate = (initalLoad) => {
    console.log('loadMoreTextTemplate')
    let pageId;
    let count;
    if (initalLoad) {
      pageId = 1;
      count = 10;
    } else {
      pageId = (this.state.groupedTexts.length + this.state.groupedTexts2.length) / 1 + 1;
      count = 1;
    }
    // this.setState({ isLoading: true, error: undefined });
    const url = `/api/Template/Search?Type=${TemplateType.TextTemplate}&page=${pageId}&perPage=${count}`;
    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          var result = res.value.key;
          var currentGroupedTextsHeight = this.state.currentGroupedTextsHeight;
          var currentGroupedTexts2Height = this.state.currentGroupedTexts2Height;
          var res1 = [];
          var res2 = [];
          for (var i = 0; i < result.length; ++i) {
            var currentItem = result[i];
            
            if (currentGroupedTextsHeight <= currentGroupedTexts2Height) {
              res1.push(currentItem);
              currentGroupedTextsHeight += 150 / (currentItem.width / currentItem.height);
            } else {
              res2.push(currentItem);
              currentGroupedTexts2Height += 150 / (currentItem.width / currentItem.height);
            }
          }
          this.setState(state => ({
            groupedTexts: [...state.groupedTexts, ...res1],
            groupedTexts2: [...state.groupedTexts2, ...res2],
            currentGroupedTextsHeight,
            currentGroupedTexts2Height,
            hasMoreTextTemplate: res.value.value > state.groupedTexts.length + state.groupedTexts2.length + res.value.key.length,
          }))
        },
        error => {
          // this.setState({ isLoading: false, error })
        }
    )
  }

  loadMore = (initialLoad: Boolean) => {
    let pageId;
    let count;
    if (initialLoad) {
      pageId = 1;
      count = 10;
    } else {
      pageId = (this.state.items.length + this.state.items2.length) / 5 + 1;
      count = 5;
    }
    this.setState({ isLoading: true, error: undefined });
    // const url = `https://api.unsplash.com/photos?page=1&&client_id=500eac178a285523539cc1ec965f8ee6da7870f7b8678ad613b4fba59d620c29&&query=${this.state.query}&&per_page=${count}&&page=${pageId}`;
    const url = `/api/Media/Search?type=${TemplateType.Image}&page=${pageId}&perPage=${count}&terms=${this.state.query}`;
    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          var result = res.value.key;
          var currentItemsHeight = this.state.currentItemsHeight;
          var currentItems2Height = this.state.currentItems2Height;
          var res1 = [];
          var res2 = [];
          for (var i = 0; i < result.length; ++i) {
            var currentItem = result[i];
            if (currentItemsHeight <= currentItems2Height) {
              res1.push(currentItem);
              currentItemsHeight += 150 / (currentItem.width / currentItem.height);
            } else {
              res2.push(currentItem);
              currentItems2Height += 150 / (currentItem.width / currentItem.height);
            }
          }
          this.setState(state => ({
            items: [...state.items, ...res1],
            items2: [...state.items2, ...res2],
            currentItemsHeight,
            currentItems2Height,
            cursor: res.cursor,
            isLoading: false,
            hasMoreImage: res.value.value > state.items.length + state.items2.length + res.value.key.length,
          }))
        },
        error => {
          this.setState({ isLoading: false, error })
        }
    )
  }

  handleQuery = (e) => {
    if (e.key === "Enter") {
      this.setState({query: e.target.value, items: [], items2: [],}, () => {this.loadMore(true)});
      console.log('e.target.value', e.target.value)
    }
  }

  renderCanvas(preview, index) {
    var res = [];
    for (var i = 0; i < this.state.pages.length; ++i) {
      if (index && i != index) {
        continue;
      }
      res.push(<Canvas
        isSaving={this.state.isSaving}
        downloading={this.state.downloading}
        bleed={this.state.bleed}
        key={i}
        staticGuides={this.state.staticGuides}
        index={i}
        id={this.state.pages[i]}
        addAPage={this.addAPage}
        images={this.state.images.filter(img => img.page === this.state.pages[i])}
        mode={this.state.mode}
        rectWidth={this.state.rectWidth}
        rectHeight={this.state.rectHeight}
        scale={preview ? 1 : this.state.scale}
        childId={this.state.childId}
        cropMode={this.state.cropMode}
        handleImageSelected={this.handleImageSelected}
        handleRotateStart={this.handleRotateStart}
        handleRotate={this.handleRotate}
        handleRotateEnd={this.handleRotateEnd}
        handleResizeStart={this.handleResizeStart}
        handleResize={this.handleResize}
        handleResizeEnd={this.handleResizeEnd}
        handleDragStart={this.handleDragStart}
        handleDrag={this.handleDrag}
        handleDragEnd={this.handleDragEnd}
        onSingleTextChange={this.onSingleTextChange.bind(this)}
        handleFontSizeChange={this.handleFontSizeChange}
        handleFontColorChange={this.handleFontColorChange}
        handleFontFamilyChange={this.handleFontFamilyChange}
        handleChildIdSelected={this.handleChildIdSelected}
        handleImageDrag={this.handleImageDrag}
        enableCropMode={this.enableCropMode}
        handleImageResize={this.handleImageResize}
        startX={this.state.startX}
        startY={this.state.startY}
        onResizeInnerImageStart={this.onResizeInnerImageStart}
        resizingInnerImage={this.state.resizingInnerImage}
        updateRect={this.state.updateRect}
        doNoObjectSelected={this.doNoObjectSelected}
        idObjectSelected={this.state.idObjectSelected}
        handleDeleteThisPage={this.handleDeleteThisPage.bind(this, this.state.pages[i])}
        showPopup={this.state.showPopup}
        preview={preview}
      />);
    }

    return res;
  }

  handleDeleteThisPage = (pageId) => {
    console.log('handleDeleteThisPage ', pageId);
    var pages = this.state.pages.filter(pId => pId !== pageId);
    this.setState({pages});
  }

  handleRemoveAllMedia = () => {
    var model;
    if (this.state.selectedTab === SidebarTab.Image) {
      model = "Media";
    } else if (this.state.selectedTab === SidebarTab.Template) {  
      model = "Template";
    }
    const url = `/api/${model}/RemoveAll`;
    fetch(url);
  }

  handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
  }

  externalPaymentCompleted(fragment) {
      if (fragment === null || typeof fragment !== 'object') {
          return;
      }
      const { requestId, orderId } = fragment;
      
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, orderId })
      };

      fetch(`/payments/momo/status`, requestOptions)
      .then(this.handleResponse)
      .then(
          responseFromMomo => {
            console.log(responseFromMomo)
            responseFromMomo && responseFromMomo.localMessage && alert(responseFromMomo.localMessage);
            if (responseFromMomo.message === "Success") {
                this.handleAddOrder();
                this.setState({ orderStatus: 'success' });
            }
          },
          error => {
              console.log(error);
          }
      );
  }

  getMoMoPayUrl = async () => {
      const requestOptions = {
          method: 'GET',
      };

      fetch(`/payments/momo`, requestOptions)
      .then(this.handleResponse)
      .then(
          responseFromMomo => {
              window.paymentScope = { complete: this.externalPaymentCompleted }
              window.open(responseFromMomo.payUrl, "_blank"); 
          },
          error => {
              console.log(error);
          }
      );
  }

  handleContinueOrder = async () => {
      console.log(this.state.currentPrintStep);
      console.log(this.refFullName);
    if (this.state.currentPrintStep === 3 && this.state.orderStatus !== 'success') {
        await this.getMoMoPayUrl();
    }
    if (this.state.currentPrintStep < 3)
        await this.setState({currentPrintStep: this.state.currentPrintStep + 1});
  }

  handleAddOrder = async () => {
    if (this.refFullName) {
      console.log('fullName', this.refFullName.value);
      var fullName = this.refFullName.value;
      var address = this.refAddress.value;
      var city = this.refCity.value;
      var phoneNumber = this.refPhoneNumber.value;

      var rep = `images/${uuidv4()}.png`;

      this.saveImages(rep);

      console.log('this.state._id ', this.state._id);

      var url = `/api/Order/Add`;
      var res = {
        "Id": uuidv4(),
        "FullName": fullName,
        "Address": address,
        "City": city,
        "PhoneNumber": phoneNumber,
        "OrderId": this.state._id,
        "Representative": rep,
      }
      axios.post(url, res);
    }
  }

  refFullName = null;
  refAddress = null;
  refCity = null;
  refPhoneNumber = null;

  render() {
    const { scale, staticGuides, rectWidth, rectHeight, images, cropMode, pages, } = this.state; 

    console.log('Globals.serviceUser.username', Globals.serviceUser.username);

    const adminEmail = "llaugusty@gmail.com"

    const fontColors = [
      "rgb(246, 218, 179)","rgb(201, 148, 114)","rgb(89, 61, 44)","rgb(74, 38, 21)","rgb(37, 25, 15)","rgb(115, 28, 44)","rgb(186, 32, 41)","rgb(226, 32, 46)","rgb(241, 93, 88)","rgb(246, 158, 173)","rgb(252, 196, 167)","rgb(249, 164, 86)","rgb(243, 115, 47)","rgb(206, 93, 40)","rgb(90, 43, 29)","rgb(67, 26, 23)","rgb(168, 31, 39)","rgb(239, 55, 50)","rgb(245, 143, 152)","rgb(247, 175, 183)","rgb(255, 221, 155)","rgb(253, 188, 79)","rgb(248, 153, 31)","rgb(217, 124, 39)","rgb(129, 73, 37)","rgb(72, 25, 40)","rgb(170, 29, 68)","rgb(235, 8, 140)","rgb(239, 117, 173)","rgb(246, 175, 206)","rgb(254, 246, 169)","rgb(255, 209, 120)","rgb(246, 179, 26)","rgb(249, 201, 39)","rgb(192, 127, 42)","rgb(64, 32, 82)","rgb(106, 52, 132)","rgb(119, 65, 152)","rgb(161, 130, 187)","rgb(177, 158, 204)","rgb(254, 244, 140)","rgb(252, 240, 93)","rgb(252, 238, 33)","rgb(206, 220, 40)","rgb(154, 168, 57)","rgb(33, 29, 77)","rgb(84, 39, 101)","rgb(80, 90, 168)","rgb(127, 127, 189)","rgb(158, 156, 205)","rgb(215, 231, 171)","rgb(200, 221, 108)","rgb(153, 204, 106)","rgb(136, 179, 63)","rgb(110, 134, 56)","rgb(31, 37, 85)","rgb(19, 75, 150)","rgb(6, 109, 181)","rgb(39, 174, 229)","rgb(138, 213, 247)","rgb(176, 218, 172)","rgb(84, 187, 111)","rgb(1, 176, 83)","rgb(1, 93, 49)","rgb(13, 63, 34)","rgb(0, 124, 143)","rgb(0, 169, 162)","rgb(54, 193, 208)","rgb(129, 207, 207)","rgb(151, 216, 224)","rgb(255, 255, 255)","rgb(137, 133, 134)","rgb(102, 99, 100)","rgb(84, 80, 80)","rgb(58, 56, 56)","rgb(52, 50, 50)","rgb(36, 36, 36)","rgb(31, 30, 30)","rgb(16, 19, 19)","rgb(0, 0, 0)"
    ];

    const allColors = [
    "rgb(158, 156, 205)","rgb(141, 140, 196)","rgb(127, 127, 189)","rgb(112, 114, 181)","rgb(80, 90, 168)","rgb(47, 72, 156)","rgb(31, 67, 150)","rgb(34, 65, 146)","rgb(39, 60, 137)","rgb(40, 57, 126)","rgb(41, 52, 118)","rgb(41, 50, 114)","rgb(40, 46, 106)","rgb(37, 40, 95)","rgb(34, 38, 90)","rgb(31, 33, 82)","rgb(27, 29, 76)","rgb(26, 27, 73)","rgb(33, 29, 77)","rgb(35, 34, 87)","rgb(38, 37, 93)","rgb(48, 42, 106)","rgb(53, 47, 113)","rgb(43, 50, 119)","rgb(62, 51, 126)","rgb(64, 56, 136)","rgb(70, 59, 145)","rgb(61, 64, 151)","rgb(73, 69, 156)","rgb(100, 90, 167)","rgb(177, 158, 204)","rgb(169, 145, 196)","rgb(161, 130, 187)","rgb(153, 118, 181)","rgb(133, 93, 166)","rgb(119, 65, 152)","rgb(102, 59, 147)","rgb(116, 54, 141)","rgb(106, 52, 132)","rgb(101, 48, 122)","rgb(96, 44, 115)","rgb(90, 42, 109)","rgb(84, 39, 101)","rgb(64, 32, 82)","rgb(59, 32, 79)","rgb(50, 25, 65)","rgb(36, 23, 66)","rgb(45, 23, 57)","rgb(53, 25, 64)","rgb(69, 32, 78)","rgb(75, 32, 84)","rgb(92, 38, 99)","rgb(103, 41, 108)","rgb(110, 43, 112)","rgb(118, 46, 120)","rgb(126, 48, 129)","rgb(137, 50, 138)","rgb(141, 51, 144)","rgb(159, 61, 147)","rgb(167, 91, 161)","rgb(221, 169, 205)","rgb(216, 153, 196)","rgb(213, 139, 186)","rgb(205, 120, 176)","rgb(198, 93, 160)","rgb(192, 55, 143)","rgb(160, 45, 138)","rgb(143, 45, 127)","rgb(129, 43, 119)","rgb(118, 42, 111)","rgb(113, 40, 106)","rgb(98, 38, 97)","rgb(80, 31, 81)","rgb(73, 30, 72)","rgb(57, 25, 60)","rgb(51, 22, 47)","rgb(54, 21, 40)","rgb(66, 22, 50)","rgb(86, 30, 65)","rgb(96, 28, 73)","rgb(102, 28, 80)","rgb(110, 36, 98)","rgb(133, 35, 100)","rgb(149, 35, 110)","rgb(174, 32, 120)","rgb(202, 29, 133)","rgb(208, 22, 132)","rgb(216, 48, 139)","rgb(222, 94, 159)","rgb(232, 119, 181)","rgb(246, 175, 206)","rgb(245, 160, 197)","rgb(243, 145, 188)","rgb(239, 117, 173)","rgb(239, 80, 156)","rgb(236, 44, 145)","rgb(235, 8, 140)","rgb(221, 10, 133)","rgb(192, 28, 120)","rgb(162, 33, 108)","rgb(141, 33, 99)","rgb(129, 31, 92)","rgb(108, 27, 78)","rgb(100, 28, 71)","rgb(89, 30, 63)","rgb(68, 22, 47)","rgb(55, 20, 38)","rgb(54, 21, 37)","rgb(69, 23, 45)","rgb(91, 29, 59)","rgb(104, 28, 66)","rgb(114, 31, 72)","rgb(129, 28, 83)","rgb(148, 30, 91)","rgb(167, 32, 99)","rgb(194, 29, 108)","rgb(221, 16, 120)","rgb(236, 14, 116)","rgb(238, 46, 127)","rgb(240, 93, 147)","rgb(247, 174, 197)","rgb(245, 159, 188)","rgb(244, 145, 177)","rgb(242, 124, 158)","rgb(240, 96, 132)","rgb(238, 50, 111)","rgb(236, 22, 95)","rgb(224, 26, 90)","rgb(197, 31, 72)","rgb(170, 29, 68)","rgb(153, 31, 63)","rgb(132, 25, 53)","rgb(125, 28, 49)","rgb(109, 28, 52)","rgb(97, 31, 50)","rgb(72, 25, 40)","rgb(53, 21, 33)","rgb(51, 21, 29)","rgb(70, 25, 38)","rgb(98, 32, 48)","rgb(113, 29, 48)","rgb(127, 26, 47)","rgb(138, 28, 49)","rgb(159, 31, 58)","rgb(176, 30, 61)","rgb(202, 32, 62)","rgb(224, 28, 75)","rgb(238, 30, 77)","rgb(238, 51, 92)","rgb(241, 95, 118)","rgb(247, 174, 188)","rgb(246, 158, 173)","rgb(244, 144, 160)","rgb(242, 119, 133)","rgb(241, 94, 106)","rgb(238, 51, 78)","rgb(236, 28, 61)","rgb(224, 28, 68)","rgb(202, 32, 56)","rgb(178, 31, 55)","rgb(159, 30, 53)","rgb(140, 29, 43)","rgb(127, 27, 42)","rgb(115, 28, 44)","rgb(98, 33, 45)","rgb(69, 26, 35)","rgb(48, 20, 25)","rgb(47, 20, 20)","rgb(68, 26, 25)","rgb(99, 35, 35)","rgb(115, 29, 32)","rgb(130, 29, 33)","rgb(146, 31, 37)","rgb(168, 31, 39)","rgb(186, 32, 41)","rgb(205, 32, 41)","rgb(226, 32, 46)","rgb(236, 30, 48)","rgb(238, 50, 60)","rgb(241, 93, 95)","rgb(247, 175, 183)","rgb(246, 159, 167)","rgb(245, 143, 152)","rgb(243, 126, 129)","rgb(241, 93, 88)","rgb(239, 55, 50)","rgb(236, 32, 39)","rgb(227, 32, 39)","rgb(186, 32, 39)","rgb(170, 32, 36)","rgb(151, 32, 35)","rgb(130, 29, 31)","rgb(115, 31, 28)","rgb(99, 35, 30)","rgb(67, 26, 23)","rgb(45, 18, 18)","rgb(47, 19, 19)","rgb(66, 27, 23)","rgb(99, 38, 30)","rgb(115, 36, 29)","rgb(134, 35, 32)","rgb(154, 42, 36)","rgb(172, 39, 37)","rgb(188, 46, 38)","rgb(213, 49, 39)","rgb(231, 54, 38)","rgb(239, 64, 35)","rgb(241, 87, 45)","rgb(244, 119, 84)","rgb(247, 137, 111)","rgb(252, 205, 180)","rgb(252, 196, 167)","rgb(251, 186, 147)","rgb(249, 166, 119)","rgb(246, 143, 88)","rgb(243, 115, 47)","rgb(241, 94, 36)","rgb(230, 90, 37)","rgb(213, 80, 39)","rgb(189, 67, 39)","rgb(184, 64, 38)","rgb(164, 56, 38)","rgb(136, 48, 32)","rgb(107, 42, 29)","rgb(94, 43, 31)","rgb(64, 28, 23)","rgb(47, 19, 18)","rgb(47, 20, 19)","rgb(63, 28, 22)","rgb(90, 43, 29)","rgb(107, 43, 30)","rgb(139, 51, 34)","rgb(170, 64, 39)","rgb(185, 74, 38)","rgb(206, 93, 40)","rgb(221, 104, 38)","rgb(236, 115, 36)","rgb(244, 120, 32)","rgb(247, 143, 45)","rgb(249, 164, 86)","rgb(246, 218, 179)","rgb(207, 160, 123)","rgb(201, 148, 114)","rgb(193, 130, 89)","rgb(152, 97, 62)","rgb(172, 104, 64)","rgb(148, 88, 54)","rgb(119, 60, 27)","rgb(98, 49, 23)","rgb(87, 37, 16)","rgb(153, 123, 78)","rgb(122, 93, 53)","rgb(76, 55, 28)","rgb(74, 55, 40)","rgb(55, 40, 20)","rgb(55, 30, 18)","rgb(43, 24, 13)","rgb(37, 25, 15)","rgb(52, 35, 22)","rgb(74, 38, 21)","rgb(70, 36, 19)","rgb(89, 61, 44)","rgb(139, 90, 51)","rgb(145, 101, 82)","rgb(194, 134, 90)","rgb(192, 128, 86)","rgb(222, 152, 111)","rgb(215, 163, 119)","rgb(235, 201, 153)","rgb(249, 200, 147)","rgb(255, 225, 167)","rgb(255, 221, 155)","rgb(255, 218, 138)","rgb(255, 209, 120)","rgb(253, 188, 79)","rgb(251, 174, 38)","rgb(248, 153, 31)","rgb(241, 145, 33)","rgb(224, 122, 38)","rgb(209, 104, 40)","rgb(195, 91, 40)","rgb(167, 71, 38)","rgb(135, 51, 34)","rgb(101, 46, 30)","rgb(83, 42, 28)","rgb(65, 29, 23)","rgb(47, 20, 17)","rgb(68, 32, 24)","rgb(79, 41, 27)","rgb(94, 49, 31)","rgb(123, 52, 30)","rgb(167, 80, 39)","rgb(202, 101, 40)","rgb(217, 124, 39)","rgb(232, 150, 36)","rgb(246, 179, 26)","rgb(248, 193, 28)","rgb(249, 201, 39)","rgb(252, 210, 80)","rgb(247, 209, 102)","rgb(254, 246, 169)","rgb(253, 244, 155)","rgb(254, 244, 140)","rgb(253, 242, 129)","rgb(252, 240, 93)","rgb(252, 238, 45)","rgb(252, 238, 33)","rgb(248, 211, 10)","rgb(237, 182, 30)","rgb(229, 160, 36)","rgb(192, 127, 42)","rgb(164, 97, 40)","rgb(129, 73, 37)","rgb(91, 51, 31)","rgb(78, 41, 27)","rgb(68, 33, 22)","rgb(46, 21, 17)","rgb(52, 38, 23)","rgb(75, 55, 32)","rgb(87, 75, 39)","rgb(94, 84, 41)","rgb(112, 102, 45)","rgb(141, 129, 50)","rgb(142, 147, 55)","rgb(154, 168, 57)","rgb(185, 195, 51)","rgb(206, 220, 40)","rgb(221, 226, 55)","rgb(223, 228, 94)","rgb(229, 229, 118)","rgb(215, 231, 171)","rgb(206, 226, 157)","rgb(210, 228, 153)","rgb(205, 225, 141)","rgb(200, 221, 108)","rgb(191, 215, 60)","rgb(168, 207, 57)","rgb(136, 179, 63)","rgb(127, 160, 62)","rgb(124, 139, 56)","rgb(122, 120, 50)","rgb(112, 105, 47)","rgb(94, 83, 41)","rgb(61, 58, 31)","rgb(43, 40, 23)","rgb(39, 24, 15)","rgb(31, 28, 16)","rgb(35, 42, 24)","rgb(46, 60, 33)","rgb(71, 77, 41)","rgb(76, 84, 44)","rgb(89, 97, 49)","rgb(100, 113, 51)","rgb(110, 134, 56)","rgb(104, 154, 64)","rgb(100, 172, 69)","rgb(96, 187, 70)","rgb(125, 194, 71)","rgb(153, 204, 106)","rgb(168, 211, 122)","rgb(176, 218, 172)","rgb(162, 211, 157)","rgb(151, 207, 146)","rgb(140, 202, 134)","rgb(120, 195, 109)","rgb(82, 184, 78)","rgb(33, 178, 75)","rgb(71, 165, 71)","rgb(74, 146, 66)","rgb(69, 130, 61)","rgb(67, 111, 53)","rgb(62, 96, 48)","rgb(61, 88, 45)","rgb(54, 80, 41)","rgb(32, 60, 33)","rgb(27, 42, 24)","rgb(22, 32, 18)","rgb(17, 33, 19)","rgb(25, 43, 24)","rgb(24, 61, 33)","rgb(30, 85, 46)","rgb(16, 91, 47)","rgb(19, 99, 51)","rgb(20, 116, 59)","rgb(6, 131, 65)","rgb(0, 147, 71)","rgb(0, 154, 73)","rgb(10, 171, 77)","rgb(1, 176, 83)","rgb(84, 187, 111)","rgb(153, 210, 174)","rgb(136, 204, 161)","rgb(116, 197, 148)","rgb(81, 188, 131)","rgb(53, 183, 118)","rgb(0, 173, 95)","rgb(1, 166, 78)","rgb(0, 157, 77)","rgb(0, 144, 72)","rgb(1, 130, 66)","rgb(0, 116, 61)","rgb(5, 108, 57)","rgb(1, 93, 49)","rgb(0, 84, 45)","rgb(13, 63, 34)","rgb(18, 45, 25)","rgb(17, 34, 20)","rgb(12, 31, 19)","rgb(15, 44, 28)","rgb(14, 61, 41)","rgb(6, 85, 55)","rgb(0, 91, 59)","rgb(0, 108, 67)","rgb(1, 115, 73)","rgb(0, 129, 78)","rgb(0, 145, 83)","rgb(0, 157, 88)","rgb(0, 166, 91)","rgb(0, 169, 102)","rgb(0, 180, 128)","rgb(152, 210, 189)","rgb(134, 205, 178)","rgb(110, 198, 169)","rgb(75, 189, 154)","rgb(0, 182, 147)","rgb(0, 170, 126)","rgb(0, 167, 109)","rgb(0, 158, 120)","rgb(3, 143, 118)","rgb(0, 124, 112)","rgb(0, 111, 109)","rgb(1, 103, 102)","rgb(2, 89, 91)","rgb(5, 80, 84)","rgb(13, 61, 47)","rgb(14, 43, 37)","rgb(12, 31, 26)","rgb(16, 32, 46)","rgb(15, 42, 54)","rgb(16, 61, 69)","rgb(6, 79, 92)","rgb(2, 88, 100)","rgb(3, 101, 116)","rgb(4, 109, 122)","rgb(0, 118, 119)","rgb(4, 142, 129)","rgb(0, 158, 132)","rgb(0, 167, 132)","rgb(0, 171, 148)","rgb(4, 183, 166)","rgb(151, 216, 224)","rgb(129, 207, 207)","rgb(106, 201, 203)","rgb(54, 193, 208)","rgb(0, 184, 190)","rgb(0, 173, 178)","rgb(0, 169, 162)","rgb(0, 160, 154)","rgb(0, 140, 144)","rgb(0, 124, 143)","rgb(0, 108, 134)","rgb(0, 101, 129)","rgb(0, 87, 113)","rgb(12, 78, 103)","rgb(17, 61, 94)","rgb(19, 39, 75)","rgb(16, 29, 66)","rgb(24, 30, 73)","rgb(26, 39, 82)","rgb(22, 61, 104)","rgb(14, 71, 118)","rgb(2, 78, 128)","rgb(0, 94, 150)","rgb(0, 105, 164)","rgb(0, 118, 171)","rgb(4, 135, 179)","rgb(2, 157, 197)","rgb(0, 171, 199)","rgb(0, 176, 214)","rgb(0, 186, 215)","rgb(152, 220, 244)","rgb(138, 213, 247)","rgb(107, 207, 246)","rgb(79, 200, 244)","rgb(20, 195, 244)","rgb(39, 174, 229)","rgb(44, 170, 226)","rgb(28, 155, 215)","rgb(24, 145, 208)","rgb(15, 129, 197)","rgb(6, 109, 181)","rgb(0, 93, 168)","rgb(5, 79, 152)","rgb(23, 72, 137)","rgb(33, 57, 111)","rgb(30, 35, 82)","rgb(26, 30, 75)","rgb(30, 35, 83)","rgb(34, 53, 107)","rgb(29, 68, 133)","rgb(3, 80, 156)","rgb(0, 92, 166)","rgb(3, 106, 177)","rgb(1, 117, 187)","rgb(10, 123, 193)","rgb(9, 133, 199)","rgb(21, 144, 208)","rgb(24, 157, 217)","rgb(16, 172, 227)","rgb(27, 184, 226)","rgb(155, 206, 234)","rgb(141, 197, 235)","rgb(120, 188, 232)","rgb(82, 176, 227)","rgb(61, 167, 222)","rgb(6, 152, 213)","rgb(10, 134, 200)","rgb(12, 120, 190)","rgb(0, 101, 172)","rgb(0, 94, 163)"
    ,"rgb(0, 84, 151)","rgb(6, 79, 146)","rgb(19, 75, 150)","rgb(35, 60, 120)","rgb(36, 58, 112)","rgb(36, 53, 108)","rgb(33, 41, 91)","rgb(31, 37, 85)","rgb(34, 49, 100)","rgb(34, 56, 110)","rgb(30, 67, 134)","rgb(21, 73, 139)","rgb(9, 78, 144)","rgb(0, 84, 153)","rgb(0, 92, 165)","rgb(4, 98, 171)","rgb(8, 101, 177)","rgb(6, 113, 185)","rgb(21, 130, 198)","rgb(32, 141, 196)","rgb(168, 198, 229)","rgb(152, 187, 227)","rgb(124, 162, 213)","rgb(94, 137, 198)","rgb(62, 118, 187)","rgb(14, 103, 177)","rgb(10, 98, 175)","rgb(0, 89, 165)","rgb(0, 85, 158)","rgb(11, 78, 145)","rgb(22, 73, 138)","rgb(27, 70, 134)","rgb(38, 57, 118)","rgb(35, 45, 97)","rgb(34, 42, 91)","rgb(30, 36, 84)","rgb(29, 32, 79)","rgb(34, 40, 91)","rgb(37, 43, 98)","rgb(38, 52, 111)","rgb(39, 56, 120)","rgb(38, 58, 123)","rgb(39, 65, 124)","rgb(36, 62, 130)","rgb(32, 67, 141)","rgb(28, 69, 149)","rgb(13, 77, 158)","rgb(28, 83, 163)","rgb(41, 98, 173)","rgb(49, 110, 175)","rgb(129, 148, 203)","rgb(98, 119, 186)","rgb(71, 100, 174)","rgb(49, 84, 163)","rgb(33, 75, 157)","rgb(33, 70, 153)","rgb(33, 68, 152)","rgb(35, 64, 145)","rgb(37, 67, 132)","rgb(41, 52, 119)","rgb(41, 53, 109)","rgb(39, 48, 108)","rgb(37, 40, 94)","rgb(34, 37, 89)","rgb(29, 31, 79)","rgb(24, 27, 68)"
    ];

    return (
      <div
        id="editor"
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Helmet>
            <title>Thiết kế</title>
        </Helmet>
        <div
          id='editor-navbar'
          style={{
            backgroundColor: '#019fb6',
            height: '42px',
            padding: '5px',
            display: 'flex',
          }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
            <a
              id="logo-editor"
              style={{
                color: 'white',
                display: 'inline-block',
                padding: '5px 8px 5px 5px',
                // backgroundColor: 'yellowgreen',
                borderRadius: '6px',
              }}
              href="/"
            >
            <span style={{
              alignItems: 'center',
              display: 'flex',
            }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '12px',
                }}
              >
              <span>
              <svg style={{height: '20px', width: '16px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.45 17.97L9.5 12.01a.25.25 0 0 1 0-.36l5.87-5.87a.75.75 0 0 0-1.06-1.06l-5.87 5.87c-.69.68-.69 1.8 0 2.48l5.96 5.96a.75.75 0 0 0 1.06-1.06z"></path></svg>
              </span>
              Trang chủ    
              </div>         
            </span>
            </a>
            </div>
            <div
              style={{
                position: 'absolute',
                right: 0,
                display: 'flex',
                top: 0,
              }}>
              { Globals.serviceUser && Globals.serviceUser.username && Globals.serviceUser.username === "llaugusty@gmail.com" &&
              <button
                className="toolbar-btn dropbtn-font"
                onClick={this.saveImages.bind(this, null)}
                style={{
                  display: 'flex',
                  marginTop: '4px',
                  marginRight: '6px',
                  fontSize: '13px',
                }}
              >
                <div
                  style={{
                    width: '14px',
                    margin: 'auto',
                    marginRight: '5px',
                  }}
                ><svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" >
<path style={{fill: this.state.isSaving ? "red" : "black"}} xmlns="http://www.w3.org/2000/svg" d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z"/>
</svg>
</div>
<span>Lưu</span>
              </button>
              }
          <a
            onClick={(e) => {e.preventDefault(); this.setState({showPopup: true})}}
            href="#" style={{
            float: 'right',
            color: 'white',
            backgroundColor: '#00000070',
            marginTop: '4px',
            marginRight: '6px',
            padding: '5px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '13px',
          }}> Tải về
          </a>
          <a
            onClick={(e) => {e.preventDefault(); this.setState({showPrintingSidebar: true})}}
            href="#" style={{
            float: 'right',
            color: 'white',
            backgroundColor: '#00000070',
            marginTop: '4px',
            marginRight: '6px',
            padding: '5px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '13px',
          }}> In ấn
          </a>             
          </div>       
        </div>
        <div
          style={{
            backgroundColor: "#1a2b34",
            top: '40px',
            width: `100%`,
          }}
        ></div>
        <div
          className="wrapper"
          style={{
            top: '40px',
            width: `100%`
          }}
        >
          {
            <div
              style={{
                left: "-1px",
                transitionDuration: "0.1s, 0.1s",
                backgroundColor: "#292929",
                flexDirection: "row",
                zIndex: 11111,
                width: this.state.toolbarOpened
                  ? `${this.state.toolbarSize}px`
                  : 0,
                height: "100%",
                position: "absolute",
              }}
            >
              { this.state.toolbarOpened && 
              <TopMenu
                mode={this.state.mode}
                toolbarSize={this.state.toolbarSize}
                selectedTab={this.state.selectedTab}
                onClick={this.handleSidebarSelectorClicked}
              /> }
              {Globals.serviceUser && Globals.serviceUser.username && Globals.serviceUser.username === adminEmail &&
              <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      zIndex: 12312313,
                      backgroundColor: 'white',
                      width: '100%',
                    }}
                  >
                    <input 
                      id="image-file" 
                      type="file"
                      onLoad={(data) => {console.log('data ', data)}}
                      style={{
                        bottom: 0,
                      }}
                      />
                    <button
                      style={{
                        bottom: 0,
                      }}
                      type="submit" 
                      onClick={
                        this.state.selectedTab === SidebarTab.Font ? 
                        this.uploadFont.bind(this) :
                        this.uploadImage.bind(this, this.state.selectedTab === SidebarTab.Image ? TemplateType.Image : TemplateType.BackgroundImage)}>
                        Upload
                    </button>
                    <button
                    style={{
                      bottom: 0,
                      right: 0,
                    }}
                    onClick={this.handleRemoveAllMedia.bind(this)}>
                      RemoveAll
                      </button>
                    </div>
              }
              <div
                id="sidebar-content"
                style={{
                  position: "relative",
                  height: `calc(100% - 35px)`,
                  width: '100%',
                  padding: '10px 5px 0px 10px',
                }}
              >
                {this.state.selectedTab === SidebarTab.Image && (
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 123,
                    }}>
                      <input
                      style={{
                        position: 'absolute',
                        zIndex: 11,
                        width: 'calc(100% - 10px)',
                        marginBottom: '8px',
                        border: 'none',
                        height: '30px',
                        borderRadius: '6px',
                        padding: '5px',
                        fontSize: '13px',
                        boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
                      }}
                      onKeyDown={this.handleQuery}
                      type="text"
                      onChange={(e) => {this.setState({query: e.target.value})}}
                      value={this.state.query}
                      />
                  <InfiniteScroll
                    scroll={true}
                    throttle={500}
                    threshold={300}
                    isLoading={this.state.isLoading}
                    hasMore={this.state.hasMoreImage}
                    onLoadMore={this.loadMore}
                    height='100%'
                  >
                    {/* <input
                    style={{
                      width: '100%',
                      marginBottom: '8px',
                      border: 'none',
                      height: '30px',
                      borderRadius: '6px',
                      padding: '5px',
                      fontSize: '13px',
                    }}
                    type="text" /> */}
                    <div id="image-container-picker" style={{display: 'flex', padding: '35px 5px 10px 0px',}}>
                    <div
                      style={{
                        height: "calc(100% - 170px)",
                        width: '350px',
                        marginRight: '10px',
                      }}
                    >
                      {this.state.items.map((item, key) => (
                        <ImagePicker
                          key={key}
                          color={item.color}
                          src={item.representative}
                          height={150 / (item.width / item.height)}
                          className=""
                          onPick={this.imgOnMouseDown.bind(this)}
                          onEdit={this.handleEditmedia.bind(this, item)}
                        />
                      ))}
                    </div>
                    <div
                      style={{
                        height: "calc(100% - 170px)",
                        width: '350px',
                      }}
                    >
                      {this.state.items2.map((item, key) => (
                        <ImagePicker
                          key={key}
                          color={item.color}
                          src={item.representative}
                          height={150 / (item.width / item.height)}
                          className=""
                          onPick={this.imgOnMouseDown.bind(this)}
                          onEdit={this.handleEditmedia.bind(this, item)}
                        />
                      ))}
                      </div>
                    {/* <div
                      id="image-container-picker"
                      style={{
                        // display: "flex",
                        overflow: "scroll",
                        // height: '200px',
                        height: "100%",
                        width: '350px',
                        paddingLeft: '5px',
                      }}
                    >
                      {this.state.items.map((item, key) => (
                        <ImagePicker
                          key={key}
                          className=""
                          src={item.urls.small}
                          onPick={this.imgOnMouseDown.bind(this)}
                        />
                      ))}
                    </div> */}
                    </div>
                  </InfiniteScroll>
                  </div>
                )}
                {this.state.selectedTab === SidebarTab.Text && (
                  <div style={{ color: "white" }}>
                    <div style={{marginBottom: '10px'}}>
                      <p>Nhấn để thêm chữ vào trang</p>
                      <div
                        style={{
                          fontSize: '28px',
                          width: '100%',
                          cursor: 'pointer',
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();

                          var _id = uuidv4();

                          let images = this.state.images.map(img => {
                            if (img._id === this.state.idObjectSelected) {
                              img.childId = _id;
                            }
                            return img;
                          });

                          images.push({
                            _id,
                            type: TemplateType.Latex,
                            width: 200,
                            origin_width: 200,
                            height: 40,
                            origin_height: 40,
                            left: 0,
                            top: 0,
                            rotateAngle: 0.0,
                            innerHTML: "f(x) = \\int_{-\\infty}^\\infty\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi",
                            scaleX: 1,
                            scaleY: 1,
                            selected: false,
                            ref: this.state.idObjectSelected,
                            page: this.state.activePageId,
                            zIndex: this.state.upperZIndex + 1,
                          });

                          this.setState({ images, upperZIndex: this.state.upperZIndex + 1 });
                        }}
                      >
                          Add a LaTeX
                      </div>
                      <div
                        style={{
                          fontSize: '28px',
                          width: '100%',
                          cursor: 'pointer',
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();

                          var _id = uuidv4();

                          let images = this.state.images.map(img => {
                            if (img._id === this.state.idObjectSelected) {
                              img.childId = _id;
                            }
                            return img;
                          });

                          images.push({
                            _id,
                            type: TemplateType.Heading,
                            width: 200,
                            origin_width: 200,
                            height: 40,
                            origin_height: 40,
                            left: 0,
                            top: 0,
                            rotateAngle: 0.0,
                            innerHTML: "<font face=\"EOOE13CigkmZvHPulQfzTA\" style=\"font-size: 26px\">Add a heading</font>",
                            scaleX: 1,
                            scaleY: 1,
                            selected: false,
                            ref: this.state.idObjectSelected,
                            page: this.state.activePageId,
                            zIndex: this.state.upperZIndex + 1,
                          });

                          this.setState({ images, upperZIndex: this.state.upperZIndex + 1 });
                        }}
                      >
                          Add a heading
                      </div>
                      <div
                        style={{
                          fontSize: '22px',
                          width: '100%',
                          cursor: 'pointer',
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
    
                          let images = [...this.state.images];
                          images.push({
                            _id: uuidv4(),
                            type: TemplateType.Heading,
                            width: 182,
                            origin_width: 182,
                            height: 35,
                            origin_height: 35,
                            left: 0,
                            top: 0,
                            rotateAngle: 0.0,
                            innerHTML: "<font face=\"EOOE13CigkmZvHPulQfzTA\" style=\"font-size: 22px\">Add a subheading</font>",
                            scaleX: 1,
                            scaleY: 1,
                            page: this.state.activePageId,
                            zIndex: this.state.upperZIndex + 1,
                          });

                          this.setState({ images, upperZIndex: this.state.upperZIndex + 1 });
                        }}
                      >
                      Add a subheading
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          width: '100%',
                          cursor: 'pointer',
                          marginTop: '7px',
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
    
                          let images = [...this.state.images];
                          images.push({
                            _id: uuidv4(),
                            type: TemplateType.Heading,
                            width: 190,
                            origin_width: 190,
                            height: 22,
                            origin_height: 22,
                            left: 0,
                            top: 0,
                            rotateAngle: 0.0,
                            innerHTML: "<font ace=\"EOOE13CigkmZvHPulQfzTA\" style=\"font-size: 16px\">Add a little bit of body text</font>",
                            scaleX: 1,
                            scaleY: 1,
                            page: this.state.activePageId,
                            zIndex: this.state.upperZIndex + 1,
                          });

                          this.setState({ images, upperZIndex: this.state.upperZIndex + 1 });
                        }}
                      >
                      Add a little bit of body text
                      </div>
                    </div>
                    {
                      <InfiniteScroll
                      scroll={true}
                      throttle={500}
                      threshold={300}
                      isLoading={this.state.isLoading}
                      hasMore={this.state.hasMoreTextTemplate}
                      onLoadMore={this.loadMoreTextTemplate}
                      height='calc(100% - 180px)'
                    >
                      {/* <input
                      style={{
                        width: '100%',
                        marginBottom: '8px',
                        border: 'none',
                        height: '30px',
                        borderRadius: '6px',
                        padding: '5px',
                        fontSize: '13px',
                      }}
                      type="text" /> */}
                      <div id="image-container-picker" style={{display: 'flex', padding: '0px 5px 10px 0px',}}>
                      <div
                        style={{
                          width: '350px',
                          marginRight: '10px',
                        }}
                      >
                        {this.state.groupedTexts.map((item, key) => (
                          <ImagePicker
                            key={key}
                            color={item.color}
                            src={item.representative}
                            height={150 / (item.width / item.height)}
                            className="text-picker"
                            onPick={this.textOnMouseDown.bind(this, item.id)}
                            onEdit={() => {this.setState({showTemplateEditPopup: true, editingMedia: item})}}
                          />
                        ))}
                      </div>
                      <div
                        style={{
                          width: '350px',
                        }}
                      >
                        {this.state.groupedTexts2.map((item, key) => (
                          <ImagePicker
                            key={key}
                            color={item.color}
                            className="text-picker"
                            height={150 / (item.width / item.height)}
                            src={item.representative}
                            onPick={this.textOnMouseDown.bind(this, item.id)}
                            onEdit={() => {this.setState({showTemplateEditPopup: true, editingMedia: item})}}
                          />
                        ))}
                        </div>
                        {/* <button
                          style={{
                            position: 'absolute',
                            right: 0,
                          }}
                          onClick={this.handleRemoveAllMedia.bind(this, "Template")}
                        >Remove</button> */}
                      {/* <div
                        id="image-container-picker"
                        style={{
                          // display: "flex",
                          overflow: "scroll",
                          // height: '200px',
                          height: "100%",
                          width: '350px',
                          paddingLeft: '5px',
                        }}
                      >
                        {this.state.items.map((item, key) => (
                          <ImagePicker
                            key={key}
                            className=""
                            src={item.urls.small}
                            onPick={this.imgOnMouseDown.bind(this)}
                          />
                        ))}
                      </div> */}
                      </div>
                    </InfiniteScroll>
                    }
                  </div>
                )}
                {this.state.selectedTab === SidebarTab.Template && (
                  <div
                    style={{
                      color: "white",
                      overflow: "scroll"
                    }}
                  >
                    {
                      <InfiniteScroll
                      scroll={true}
                      throttle={500}
                      threshold={300}
                      isLoading={this.state.isLoading}
                      hasMore={this.state.hasMoreTemplate}
                      onLoadMore={this.loadMoreTemplate.bind(this)}
                      height='100%'
                      onEdit={null}
                    >
                      {/* <input
                      style={{
                        width: '100%',
                        marginBottom: '8px',
                        border: 'none',
                        height: '30px',
                        borderRadius: '6px',
                        padding: '5px',
                        fontSize: '13px',
                      }}
                      type="text" /> */}
                      <div id="image-container-picker" style={{display: 'flex', padding: '0px 5px 10px 0px',}}>
                      <div
                        style={{
                          width: '350px',
                          marginRight: '10px',
                        }}
                      >
                        {this.state.templates.map((item, key) => (
                          <ImagePicker
                            key={key}
                            color={item.color}
                            src={item.representative}
                            height={150 / (item.width / item.height)}
                            className="template-picker"
                            onPick={this.templateOnMouseDown.bind(this, item.id)}
                            onEdit={() => {this.setState({showTemplateEditPopup: true, editingMedia: item})}}
                          />
                        ))}
                      </div>
                      <div
                        style={{
                          width: '350px',
                        }}
                      >
                        {this.state.templates2.map((item, key) => (
                          <ImagePicker
                            key={key}
                            color={item.color}
                            className="template-picker"
                            height={150 / (item.width / item.height)}
                            src={item.representative}
                            onPick={this.templateOnMouseDown.bind(this, item.id)}
                            onEdit={() => {this.setState({showTemplateEditPopup: true, editingMedia: item})}}
                          />
                        ))}
                        </div>
                      {/* <div
                        id="image-container-picker"
                        style={{
                          // display: "flex",
                          overflow: "scroll",
                          // height: '200px',
                          height: "100%",
                          width: '350px',
                          paddingLeft: '5px',
                        }}
                      >
                        {this.state.items.map((item, key) => (
                          <ImagePicker
                            key={key}
                            className=""
                            src={item.urls.small}
                            onPick={this.imgOnMouseDown.bind(this)}
                          />
                        ))}
                      </div> */}
                      </div>
                    </InfiniteScroll>
                    }
                  </div>
                )}
                {this.state.selectedTab === SidebarTab.Background && 
                  <InfiniteScroll
                  scroll={true}
                  throttle={100}
                  threshold={300}
                  isLoading={false}
                  hasMore={false}
                  onLoadMore={this.loadMoreBackground}
                >
                  <div
                    id="image-container-picker"
                    style={{
                      display: "flex",
                      overflow: "scroll",
                      // height: '200px',
                      height: "100%"
                    }}
                  >
                    <div
                        style={{
                          width: '350px',
                          marginRight: '10px',
                        }}
                      >
                    {this.state.backgrounds1.map((item, key) => (
                      <ImagePicker
                        key={key}
                        src={item.representative}
                        onPick={this.backgroundOnMouseDown.bind(this)}
                      />
                    ))}
                    </div>
                    <div
                        style={{
                          width: '350px',
                          marginRight: '10px',
                        }}
                      >
                    {this.state.backgrounds2.map((item, key) => (
                      <ImagePicker
                        key={key}
                        src={item.representative}
                        onPick={this.backgroundOnMouseDown.bind(this)}
                      />
                    ))}
                    </div>
                    <div
                        style={{
                          width: '350px',
                          marginRight: '10px',
                        }}
                      >
                    {this.state.backgrounds3.map((item, key) => (
                      <ImagePicker
                        key={key}
                        src={item.representative}
                        onPick={this.backgroundOnMouseDown.bind(this)}
                      />
                    ))}
                    </div>
                  </div>
                </InfiniteScroll>
                }
                {this.state.selectedTab === SidebarTab.Font && (
                  <div
                    style={{
                      color: "white",
                      overflow: "scroll",
                    }}
                  >
                    <div
                    style={{
                    }}>
                      
                    {/* {
                      this.state.fontsList.map(font => 
                        <a 
                          className="font-picker"
                          style={{
                            display: "flex",
                          }} 
                          href="#" 
                          onClick={this.selectFont.bind(this, font.id)}><img 
                          style={{
                            height: '25px',
                            margin: 'auto',
                          }} src={font.representative} />
                          {this.state.fontId === font.id ? <span style={{float: 'right', width: '25px', height: '25px', position: 'absolute', right: '10px'}}><svg style={{fill: 'white'}} version="1.1" viewBox="0 0 44 44" enable-background="new 0 0 44 44">
  <path d="m22,0c-12.2,0-22,9.8-22,22s9.8,22 22,22 22-9.8 22-22-9.8-22-22-22zm12.7,15.1l0,0-16,16.6c-0.2,0.2-0.4,0.3-0.7,0.3-0.3,0-0.6-0.1-0.7-0.3l-7.8-8.4-.2-.2c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5 0.3-0.7l1.4-1.4c0.4-0.4 1-0.4 1.4,0l.1,.1 5.5,5.9c0.2,0.2 0.5,0.2 0.7,0l13.4-13.9h0.1c0.4-0.4 1-0.4 1.4,0l1.4,1.4c0.4,0.3 0.4,0.9 0,1.3z"/>
</svg></span> : null}
                          </a>
                      )
                    } */}
                    <div
                      style={{
                        height: '100%',
                      }}
                    ><InfiniteScroll
                    scroll={true}
                    throttle={500}
                    threshold={300}
                    isLoading={false}
                    hasMore={this.state.hasMoreFonts}
                    onLoadMore={this.loadMoreFont}
                    height='100%'
                  >
                    {/* <input
                    style={{
                      width: '100%',
                      marginBottom: '8px',
                      border: 'none',
                      height: '30px',
                      borderRadius: '6px',
                      padding: '5px',
                      fontSize: '13px',
                    }}
                    type="text" /> */}
                    <div id="image-container-picker">
                    <div
                      style={{
                        // height: "calc(100% - 170px)",
                        marginRight: '10px',
                      }}
                    >
                      {this.state.fontsList.map((font, key) => (
                        <a 
                          className="font-picker"
                          style={{
                            display: "flex",
                            position: 'relative',
                          }} 
                          href="#" 
                          onClick={this.selectFont.bind(this, font.id)}>
                            { Globals.serviceUser && Globals.serviceUser.username && Globals.serviceUser.username == "llaugusty@gmail.com" &&
                            <button
                              style={{
                                position: 'absolute',
                                top: '5px',
                                left: '5px',
                                borderRadius: '13px',
                                border: 'none',
                                padding: '0 4px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                              }}
                              onClick={this.handleEditFont.bind(this, font)}
                            ><span>
                <svg width="16" height="16" viewBox="0 0 16 16"><defs><path id="_2658783389__a" d="M3.25 9.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"></path></defs><use fill="black" xlinkHref="#_2658783389__a" fill-rule="evenodd"></use></svg>
                            </span>
                            </button>
                            }
                            <img 
                              style={{
                                height: '25px',
                                margin: 'auto',
                              }} src={font.representative} />
                              {this.state.fontId === font.id ? <span style={{position: 'absolute', float: 'right', width: '25px', height: '25px', right: '10px'}}><svg style={{fill: 'white'}} version="1.1" viewBox="0 0 44 44" enable-background="new 0 0 44 44">
  <path d="m22,0c-12.2,0-22,9.8-22,22s9.8,22 22,22 22-9.8 22-22-9.8-22-22-22zm12.7,15.1l0,0-16,16.6c-0.2,0.2-0.4,0.3-0.7,0.3-0.3,0-0.6-0.1-0.7-0.3l-7.8-8.4-.2-.2c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5 0.3-0.7l1.4-1.4c0.4-0.4 1-0.4 1.4,0l.1,.1 5.5,5.9c0.2,0.2 0.5,0.2 0.7,0l13.4-13.9h0.1c0.4-0.4 1-0.4 1.4,0l1.4,1.4c0.4,0.3 0.4,0.9 0,1.3z"/>
</svg></span> : null}
                          </a>
                      ))}
                    </div>
                    {/* <div
                      style={{
                        height: "calc(100% - 170px)",
                        width: '350px',
                      }}
                    >
                      </div> */}
                    {/* <div
                      id="image-container-picker"
                      style={{
                        // display: "flex",
                        overflow: "scroll",
                        // height: '200px',
                        height: "100%",
                        width: '350px',
                        paddingLeft: '5px',
                      }}
                    >
                      {this.state.items.map((item, key) => (
                        <ImagePicker
                          key={key}
                          className=""
                          src={item.urls.small}
                          onPick={this.imgOnMouseDown.bind(this)}
                        />
                      ))}
                    </div> */}
                    </div>
                  </InfiniteScroll>
                  </div>
                    </div>
                  </div>
                )}
                {this.state.selectedTab === SidebarTab.Color && (
                  <div
                    style={{
                      color: "white",
                      overflow: "scroll",
                    }}
                  >
                    <div style={{display: 'inline-block'}}>
                    <p>Quick Picks</p>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                      }}
                    >
                      {fontColors.map(font => 
                          <a
                        href="#"
                        onClick={this.setSelectionColor.bind(this, font)}  
                      >
                      <li 
                        style={{
                          width: '25px',
                          height: '25px',
                          backgroundColor: font,
                          float: 'left',
                          marginLeft: '5px',
                          marginTop: '5px',
                        }}
                      >
                      </li>
                      </a>)}
                    </ul>
                    </div>
                    <div style={{display: 'inline-block'}}>
                    <p>All Colors</p>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                      }}
                    >
                      {allColors.map(font => 
                          <a
                        href="#"
                        onClick={this.setSelectionColor.bind(this, font)}  
                      >
                      <li 
                        style={{
                          width: '25px',
                          height: '25px',
                          backgroundColor: font,
                          float: 'left',
                          marginLeft: '5px',
                          marginTop: '5px',
                        }}
                      >
                      </li>
                      </a>)}
                    </ul>
                    </div>
                  </div>
                )}
                {this.state.selectedTab === SidebarTab.Video && (
                  <div
                    style={{
                      color: "white",
                      overflow: "scroll",
                    }}
                  >
                    <div style={{display: 'inline-block'}}>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                      }}
                    >
                      {this.state.videos.map(font => 
                          <video
                            onMouseDown={this.videoOnMouseDown.bind(this)}
                            muted autoPlay={true} preload="none" width="560" height="320"><source src={font} type="video/webm">
                          </source>
                          </video>
                      )}
                    </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          }
          <div
            style={{
              boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 2px 0px",
              transitionDuration: "0.1s, 0.1s",
              width: `calc(100% - ${
                (this.state.toolbarOpened ? this.state.toolbarSize : 0) + 
                (this.state.showPrintingSidebar ? 330 : 0)
              }px)`,
              left: `${this.state.toolbarOpened ? this.state.toolbarSize - 2 : 0}px`
            }}
            ref={this.setAppRef}
            id="screens"
            onScroll={this.handleScroll}
            onWheel={this.handleWheel}
          >
            <Tooltip
              offsetLeft={40}
              offsetTop={-10}
              content={<span style={{ fontSize: "12px" }}>Toggle sidebar</span>}
              delay={0}
              style={{
                top: "45%",
                position: 'absolute',
              }}
            >
              <div
                onClick={() => {
                  this.setState({
                    toolbarOpened: !this.state.toolbarOpened,
                    selectedTab: null
                  });
                }}
                id="sidebar-toggle"
                className="_3aXgK2zaCyBVqYpmgP0GNp"
                style={{
                  cursor: "pointer",
                  transitionDuration: "0.5s",
                  marginLeft: "7px",
                  width: "21px",
                  position: "absolute",
                  top: "45%",
                  zIndex: 2147483647,
                  transform: `rotate(${this.state.toolbarOpened ? 225 : 45}deg)`
                }}
              ></div>
              <div
                onClick={e => {
                  this.setState({
                    toolbarOpened: !this.state.toolbarOpened,
                    selectedTab: null
                  });
                }}
                id="sidebar-toggle"
                className="_3aXgK2zaCyBVqYpmgP0GNp"
                style={{
                  cursor: "pointer",
                  transitionDuration: "0.5s",
                  width: "21px",
                  position: "absolute",
                  top: "45%",
                  zIndex: 2147483647,
                  transform: `rotate(${this.state.toolbarOpened ? 225 : 45}deg)`
                }}
              ></div>
            </Tooltip>

            <div
              style={{
                width: "100%",
                backgroundColor: "#fff",
                zIndex: 123123123,
                boxShadow: "0 1px 0 rgba(14,19,24,.15)",
                display: "inline-flex",
                position: "absolute",
                right: 0,
                left: "1px",
                height: "46px",
                padding: "10px",
                marginBottom: '10px',
              }}
            >
              {((this.state.idObjectSelected && this.state.images.find(img => img._id ===this.state.idObjectSelected).type === TemplateType.Heading) ||
              (this.state.idObjectSelected && this.state.images.find(img => img._id ===this.state.idObjectSelected).type === TemplateType.Latex) ||
              this.state.childId) &&
              <a
                href="#"
                style={{
                  position: "relative",
                  borderRadius: "4px",
                  padding: "3px",
                  paddingBottom: "0px",
                  marginRight: "6px",
                  backgroundColor: "rgb(242, 242, 242)",
                  display: "inline-block",
                  cursor: "pointer",
                  color: 'black',
                }}
                onClick={(e) => {e.preventDefault(); this.setState({selectedTab: SidebarTab.Color})}}
                className="toolbar-btn"
              >
                <svg
                  viewBox="0 0 24 24"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ width: "20px", height: "20px" }}
                >
                  <g>
                    <path
                      d="M11 2L5.5 16h2.25l1.12-3h6.25l1.12 3h2.25L13 2h-2zm-1.38 9L12 4.67 14.38 11H9.62z"
                      fill="currentColor"
                    ></path>
                  </g>
                </svg>
                <div
                  style={{
                    position: "absolute",
                    bottom: "4px",
                    left: "4px",
                    borderRadius: "14px",
                    width: "72%",
                    height: "4px",
                    // background:
                    //   "repeating-linear-gradient(to right, rgb(38, 23, 77) 0%, rgb(38, 23, 77) 100%)",
                    backgroundColor: this.state.fontColor,
                  }}
                ></div>
              </a>
              }
              {((this.state.idObjectSelected && this.state.images.find(img => img._id ===this.state.idObjectSelected).type === TemplateType.Heading) ||
                this.state.childId) &&
              <a
                href="#"
                className="toolbar-btn"
                style={{
                  borderRadius: "4px",
                  padding: "3px",
                  paddingBottom: "0px",
                  marginRight: "6px",
                  backgroundColor: "rgb(242, 242, 242)",
                  display: "inline-block",
                  cursor: "pointer",
                  color: 'black',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  var a = document.getSelection();
                  if (a && a.type === "Range") {
                    document.execCommand("italic");
                  } else {
                    var childId = this.state.childId ? this.state.childId : this.state.idObjectSelected;
                    var el = this.state.childId ? document.getElementById(childId) : document.getElementById(childId).getElementsByClassName('text')[0];      console.log('el ', el);
                    var sel = window.getSelection();
                    var range = document.createRange();
                    range.selectNodeContents(el);
                    sel.removeAllRanges();
                    sel.addRange(range);
                    document.execCommand("italic");
                    sel.removeAllRanges();
                  }
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ width: "20px", height: "20px" }}
                >
                  <g>
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M14.73 6.5l-3.67 11H14l-.3 1.5H6l.3-1.5h2.81l3.68-11H10l.3-1.5H18l-.3 1.5h-2.97z"
                    ></path>
                  </g>
                </svg>
              </a>
              }
              {((this.state.idObjectSelected && this.state.images.find(img => img._id ===this.state.idObjectSelected).type === TemplateType.Heading) ||
                this.state.childId) &&
              <a
                href='#'
                className="toolbar-btn"
                style={{
                  borderRadius: "4px",
                  padding: "3px",
                  paddingBottom: "0px",
                  marginRight: "6px",
                  backgroundColor: "rgb(242, 242, 242)",
                  display: "inline-block",
                  cursor: "pointer",
                  color: 'black',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  var a = document.getSelection();
                  if (a && a.type === "Range") {
                    document.execCommand("bold");
                  } else {
                    var childId = this.state.childId ? this.state.childId : this.state.idObjectSelected;
                    var el = this.state.childId ? document.getElementById(childId) : document.getElementById(childId).getElementsByClassName('text')[0];      console.log('el ', el);
                    var sel = window.getSelection();
                    var range = document.createRange();
                    range.selectNodeContents(el);
                    sel.removeAllRanges();
                    sel.addRange(range);
                    document.execCommand("bold");
                    sel.removeAllRanges();
                  }
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ width: "20px", height: "20px" }}
                >
                  <g>
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M7.08 4.72h4.44c2.03 0 3.5.3 4.41.87.92.57 1.37 1.49 1.37 2.75 0 .85-.2 1.55-.6 2.1-.4.54-.93.87-1.6.98v.1c.91.2 1.56.58 1.96 1.13.4.56.6 1.3.6 2.2 0 1.31-.47 2.33-1.4 3.06A6.1 6.1 0 0 1 12.41 19H7.08V4.72zm3.03 5.66h1.75c.82 0 1.42-.13 1.79-.38.36-.26.55-.68.55-1.26 0-.55-.2-.94-.6-1.18a3.86 3.86 0 0 0-1.9-.36h-1.6v3.18zm0 2.4v3.72h1.97c.83 0 1.45-.16 1.84-.48.4-.32.6-.8.6-1.46 0-1.19-.85-1.78-2.54-1.78h-1.87z"
                    ></path>
                  </g>
                </svg>
              </a>
              }
              {((this.state.idObjectSelected && this.state.images.find(img => img._id ===this.state.idObjectSelected).type === TemplateType.Heading) ||
                this.state.childId) &&
                <a
                href='#'
                className="toolbar-btn"
                onClick={this.onClickDropDownFontList}
                style={{
                  borderRadius: "4px",
                  padding: "3px",
                  paddingBottom: "0px",
                  marginRight: "6px",
                  backgroundColor: "rgb(242, 242, 242)",
                  display: "inline-block",
                  cursor: "pointer",
                  color: 'black',
                }}>
                  <img style={{height: '21px', filter: 'invert(1)'}} src={this.state.fontName} />
                  </a>
              }
              {(this.state.idObjectSelected && this.state.images.find(img => img._id ===this.state.idObjectSelected).type === TemplateType.Image) &&
                <div>
                  { !this.state.cropMode &&
                  <button
                  style={{
                    boxShadow: 'rgba(0, 0, 0, 0.36) 0px 1px 2px 0px',
                    height: '26px',
                  }}
                  className="dropbtn-font dropbtn-font-size"
                  onClick={(e) => {this.setState({cropMode: true,})}}
                >
                  Crop
                </button>
                  }
                </div>
              }
              {((this.state.idObjectSelected && this.state.images.find(img => img._id ===this.state.idObjectSelected).type === TemplateType.Heading) ||
                this.state.childId) &&              
              <div>
                <button
                  style={{
                    boxShadow: 'rgba(0, 0, 0, 0.36) 0px 1px 2px 0px',
                    height: '26px',
                  }}
                  className="dropbtn-font dropbtn-font-size"
                  onClick={this.onClickDropDownFontSizeList.bind(this)}
                >
                  {Math.round(this.state.fontSize)}px
                </button>
                <div id="myFontSizeList" className="dropdown-content-font-size">
                  <div style={{display: 'flex'}}>
                  <div 
                    id="myDropdownFontSize-2"
                    style={{
                      width: '200px',
                      borderRadius: '5px',
                      right: '10px',
                    }}>
                  <div 
                      onMouseDown={(e) => {
                        e.preventDefault();
                        var self = this;
                        const onMove = (e) => {
                          e.preventDefault();
                          var rec1 = document.getElementById('myDropdownFontSize-2').getBoundingClientRect();
                          var rec2 = document.getElementById('myDropdownFontSize-2slider');
                          var slide = e.pageX - rec1.left;
                          var scale = slide / rec1.width * 170;
                          scale = Math.max(8, scale)
                          scale = Math.min(140, scale);

                          var a = document.getSelection();
                          console.log('a  ', a);
                          if (a && a.type === "Range") {
                            document.execCommand("FontSize", false, "7");
                          } else {
                            var id = this.state.childId ? this.state.childId : this.state.idObjectSelected;
                            var el = this.state.childId ? document.getElementById(id) : document.getElementById(id).getElementsByClassName('text')[0];
                            console.log('el ', el);
                            var sel = window.getSelection();
                            var range = document.createRange();
                            range.selectNodeContents(el);
                            sel.removeAllRanges();
                            sel.addRange(range);
                            document.execCommand("FontSize", false, "7");
                            sel.removeAllRanges();
                          }

                          // document.execCommand("FontSize", false, "7");
                          this.setState({fontSize: scale})
                          console.log('scale font ', scale)
                        }

                        const onUp = (e) => {
                          e.preventDefault();
                          document.removeEventListener('mousemove', onMove);
                          document.removeEventListener('mouseup', onUp);
                        }

                        document.addEventListener('mousemove', onMove);
                        document.addEventListener('mouseup', onUp);
                      }}
                      id='myDropdownFontSize-2slider'
                      style={{
                        position: 'absolute',
                        left: this.state.fontSize / 1.7 + '%',
                        backgroundColor: '#5c5c5f',
                        width: '10px',
                        height: '10px',
                        borderRadius: '5px',
                      }}></div>
                      </div>
                    </div>
                </div>
              </div>
              }
              { this.state.cropMode &&
                <button
                  className="toolbar-btn dropbtn-font"
                  onClick={(e) => {this.setState({cropMode: false})}}
                  style={{
                    display: 'flex',
                  }}
                >Ok</button>
              }
              { this.state.cropMode &&
                <button
                  className="toolbar-btn dropbtn-font"
                  onClick={this.downloadPDF.bind(this)}
                  style={{
                    display: 'flex',
                  }}
                >Cancel</button>
              }  
              <div style={{
                position: 'absolute',
                right: 0,
              }}>
                <button
                  className="toolbar-btn dropbtn-font"
                  onClick={this.onClickpositionList.bind(this)}
                  style={{
                    display: 'flex',
                    fontSize: '13px',
                  }}
                >Vị trí</button>
                <div 
                  id="myPositionList"
                  style={{
                    right: '10px',
                  }}
                  className="dropdown-content-font-size">
                  <div style={{display: 'flex'}}>
                  <div 
                    id="myDropdownFontSize-2"
                    style={{
                      borderRadius: '5px',
                      padding: '10px',
                    }}>
                      <button onClick={this.forwardSelectedObject}>Forward</button>
                      <button onClick={this.backwardSelectedObject}>Backward</button>
                      </div>
                    </div>
                </div>
              </div>
            </div>
            <div
            onScroll={this.handleScroll2.bind(this)}
            id="screen-container-parent"
            onClick={(e) => {
              if (!cropMode && (e.target as Element).id === "screen-container-parent") {
                console.log('onClick ', e.target);
                this.doNoObjectSelected();
                e.stopPropagation();
              }
            }}
            style={{
              top: '46px',
              overflow: 'scroll',
              alignItems: 'center',
              display: 'flex',
              position: 'absolute',
              width: '100%',
              height: 'calc(100% - 46px)',
              backgroundColor: this.state.cropMode && 'rgba(14, 19, 24, 0.2)',
            }}>
            <div
              id="screen-container"
              className="screen-container"
              style={{
                width: rectWidth * scale + 40 + 'px',
                height: rectHeight * scale + 40 + 'px',
                margin: 'auto',
                right: 0,
                left: 0,
                top: 0,
                bottom: 0,
                padding: '0 20px',
              }}
              ref={this.setContainerRef}
              onClick={(e) => {
                if ((e.target as Element).id === "screen-container") {
                  this.doNoObjectSelected();
                }
              }}
            >
              {this.renderCanvas()}
            </div>
            <div
              style={{
                position: "fixed",
                bottom: "10px",
                right: `${20 + (this.state.showPrintingSidebar ? 330 : 0)}px`,
                width: "70px",
                zIndex: 99999999,
              }}
            >
              <Tooltip
                offsetLeft={-60}
                offsetTop={0}
                content={<span style={{ fontSize: "12px" }}>Zoom</span>}
                delay={0}
                style={null}
              >
                <div className="dropdown">
                  <button
                    onClick={this.onClickDropDownList.bind(this)}
                    className="dropbtn"
                    style={{
                      display: 'flex',
                      borderRadius: '5px',
                      width: '81px'
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        transform: 'scale(0.7)',
                      }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill-rule="evenodd" clip-rule="evenodd">
                      <path style={{fill: 'white'}} xmlns="http://www.w3.org/2000/svg" d="M9.145 18.29c-5.042 0-9.145-4.102-9.145-9.145s4.103-9.145 9.145-9.145 9.145 4.103 9.145 9.145-4.102 9.145-9.145 9.145zm0-15.167c-3.321 0-6.022 2.702-6.022 6.022s2.702 6.022 6.022 6.022 6.023-2.702 6.023-6.022-2.702-6.022-6.023-6.022zm9.263 12.443c-.817 1.176-1.852 2.188-3.046 2.981l5.452 5.453 3.014-3.013-5.42-5.421z"/>                      
                    </svg>
                    </div>
                    <span style={{marginLeft: '5px'}}>{Math.floor(scale * 100)}%</span>
                  </button>
                  <div id="myDropdown" className="dropdown-content">
                    <div 
                    id="myDropdown-2"
                    style={{
                      margin: 'auto',
                      width: '6px',
                      height: '200px',
                      borderRadius: '5px',
                      background: `linear-gradient(to top, #fffffffc ${scale * 100 / 2}%, #019fb6 ${100 - (scale * 100 / 2)}%)`,
                    }}>
                      <div 
                      onMouseDown={(e) => {
                        e.preventDefault();
                        var self = this;
                        const onMove = (e) => {
                          e.preventDefault();
                          var rec1 = document.getElementById('myDropdown-2').getBoundingClientRect();
                          var rec2 = document.getElementById('myDropdown-2slider');
                          var slide = rec1.bottom - e.pageY;
                          console.log('slide ', slide)
                          var scale = slide / rec1.height * 2;
                          if (scale < 0.1 || scale > 1.8){
                            if (scale < 0.1) {
                              scale = 0.1;
                            } else {
                              scale = 1.8;
                            }
                          }

                          rec2.style.bottom = scale / 2 * 100 + '%';
                          self.setState({scale: scale});
                        }

                        const onUp = (e) => {
                          e.preventDefault();
                          document.removeEventListener('mousemove', onMove);
                          document.removeEventListener('mouseup', onUp);
                        }

                        document.addEventListener('mousemove', onMove);
                        document.addEventListener('mouseup', onUp);
                      }}
                      id='myDropdown-2slider'
                      style={{
                        bottom: scale * 100 / 2 + '%',
                        backgroundColor: '#5c5c5f',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: 'rgb(200, 205, 208)',
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        margin: 'auto',
                      }}></div>
                    </div>
                    <button style={{display: 'block', width: '100%', marginTop: '10px',}}>
                      Fit
                    </button>
                    <button style={{display: 'block', width: '100%', marginTop: '10px',}}>
                      Fill
                    </button>
                  </div>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
        {this.state.showPrintingSidebar && <div
          style={{
            width: '330px',
            height: '100%',
            right: 0,
            position: 'absolute',
          }}
        >
          
      <div>
        <div
          style={{
            height: '46px',
          }}
        >
                <div className="pStkS_qIKsPoym6eCGnye" style={{padding: '10px', display: 'flex', height: '46px', borderBottom: '1px solid rgba(14,19,24,.15)', justifyContent: 'center'}}>
    <div className="_3I6bflXEnh4GRlVDlnzEap" style={{display: 'flex', alignItems: 'center'}}>
      <span style={{marginRight: '5px',}} className="_2JPeE-06cfszm35uzXEvgC _1tNfXgCCl_5Qt5kGxyM8c4">
          <span className="_2EacSGMxQyBD7pSwvfkZz3 _3l4uYr79jSRjggcw5QCp88" style={{justifyContent: 'center', alignItems: 'center', display: 'flex', width: '20px', height: '20px', borderRadius: '50%', border: '12px solid transparent', backgroundColor: this.state.currentPrintStep >= 1 ? '#6bca2c' : '#e7e7e7', }}>
            <span>1</span>
        </span>
        </span><span style={{marginRight: '5px',}} className="_2JPeE-06cfszm35uzXEvgC _2JAh8PyNfcg1Kun3J3uV1C">
        <span className="_2EacSGMxQyBD7pSwvfkZz3 _3l4uYr79jSRjggcw5QCp88"  style={{justifyContent: 'center', alignItems: 'center', display: 'flex', width: '20px', height: '20px', borderRadius: '50%', border: '12px solid transparent',backgroundColor: this.state.currentPrintStep >= 2 ? '#6bca2c' : '#e7e7e7', }}>
          <span>2</span>
        </span>
        </span>
        <span style={{marginRight: '5px',}} className="_2JPeE-06cfszm35uzXEvgC _2JAh8PyNfcg1Kun3J3uV1C">
          <span className="_2EacSGMxQyBD7pSwvfkZz3 _3l4uYr79jSRjggcw5QCp88" style={{justifyContent: 'center', alignItems: 'center', display: 'flex', width: '20px', height: '20px', borderRadius: '50%', border: '12px solid transparent',backgroundColor: this.state.currentPrintStep >= 3 ? '#6bca2c' : '#e7e7e7', }}>
            <span>3</span>
          </span>
        </span>
        {/* <span style={{marginRight: '5px',}} className="_2JPeE-06cfszm35uzXEvgC _2JAh8PyNfcg1Kun3J3uV1C">
          <span className="_2EacSGMxQyBD7pSwvfkZz3 _3l4uYr79jSRjggcw5QCp88" style={{justifyContent: 'center', alignItems: 'center', display: 'flex', width: '20px', height: '20px', borderRadius: '50%', border: '12px solid transparent',backgroundColor: this.state.currentPrintStep >= 4 ? '#6bca2c' : 'rgba(14,19,24,.45)', }}>
            <span>4</span></span></span> */}
    </div>
    <button
      style={{
        position: 'absolute',
        right: 0,
        border: 'none',
        background: 'transparent',
      }}
      onClick={() => {this.setState({showPrintingSidebar: false,})}}
    className="_2Rww-JOL60obmcYkaUOyg_ Wqfq1nAfa6if4eEOr6Mza _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _3cIMyP4YPUpE0H8WXQ_r-B Wqfq1nAfa6if4eEOr6Mza _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _3QJ_C8Lg1l0m5aoIK5piST _2kK9hFUTyqtMKr5EG4GuY4 _3SyHP4HOoHraV3-PJsORT7" type="button"><span className="_3WuwevpUMOqhISoQUjDiY3"><span className="_3K8w6l0jetB1VHftQo2qK6 _3riOXmq8mfDI5UGnLrweQh"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M13.06 12.15l5.02-5.03a.75.75 0 1 0-1.06-1.06L12 11.1 6.62 5.7a.75.75 0 1 0-1.06 1.06l5.38 5.38-5.23 5.23a.75.75 0 1 0 1.06 1.06L12 13.2l4.88 4.87a.75.75 0 1 0 1.06-1.06l-4.88-4.87z" /></svg></span></span>
    </button>
</div>
        </div>

        {this.state.currentPrintStep == 1 && 
        <div
          style={{
            padding: '16px 16px 0',
            position: 'relative',
            height: 'calc(100% - 46px)'
          }}
        >

        {this.state.subtype == SubType.BusinessCardReview && 
<BusinessCardReview firstPage={this.renderCanvas(true, 0)} secondPage={this.renderCanvas(true, 1)}>
</BusinessCardReview>
        }
        {this.state.subtype == SubType.FlyerReview && 
<FlyerReview>
{ this.renderCanvas(true, 0)}
</FlyerReview>
        }
  {this.state.subtype == SubType.PosterReview && 
<TrifoldReview>
{ this.renderCanvas(true, 0)}
</TrifoldReview>
  }

{this.state.subtype == SubType.TrifoldReview && 
<PosterReview>
{ this.renderCanvas(true, 0)}
</PosterReview>
}
{this.state.subtype > SubType.TrifoldReview && 
  <CanvasReview
    width={500}
    height={500}
  >
  { this.renderCanvas(true, 0)}
  </CanvasReview>
}

<div className="_3w96fDCkiF-cx4xtdHq8Eb" style={{display: 'flex', flexDirection: 'column'}}>
        <label className="_1YMus4Eu0cHYhxD8BF9bKk jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">Kích thước</label>
        <div className>
          <button style={{width: '100%'}} type="button" className="_2rbIxUjieDPNxaKim1eUOh _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2Nsx_KfExUOh-XOcjJewEf _3VMFhjcT1YTNCBfgY43AoL"><span className="_11gYYV-YiJb7npRdslKTJX">  <div className="_16jC4NpI5ci7-HVASqeSUU">A3</div><span className="_1Lb2Q2YFMHEYBIzodSJlY8 _1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh"><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16"><path fill="currentColor" d="M11.71 6.47l-3.53 3.54c-.1.1-.26.1-.36 0L4.3 6.47a.75.75 0 1 0-1.06 1.06l3.53 3.54c.69.68 1.8.68 2.48 0l3.53-3.54a.75.75 0 0 0-1.06-1.06z" /></svg></span></span>
          </button>
        </div>
      </div>

      <div className="_3w96fDCkiF-cx4xtdHq8Eb" style={{display: 'flex', flexDirection: 'column'}}>
        <label className="_1YMus4Eu0cHYhxD8BF9bKk jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">Thông tin khác:</label>
        <div className>
          <button style={{width: '100%'}} type="button" className="_2rbIxUjieDPNxaKim1eUOh _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2Nsx_KfExUOh-XOcjJewEf _3VMFhjcT1YTNCBfgY43AoL"><span className="_11gYYV-YiJb7npRdslKTJX">  <div className="_16jC4NpI5ci7-HVASqeSUU">A3</div><span className="_1Lb2Q2YFMHEYBIzodSJlY8 _1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh"><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16"><path fill="currentColor" d="M11.71 6.47l-3.53 3.54c-.1.1-.26.1-.36 0L4.3 6.47a.75.75 0 1 0-1.06 1.06l3.53 3.54c.69.68 1.8.68 2.48 0l3.53-3.54a.75.75 0 0 0-1.06-1.06z" /></svg></span></span>
          </button>
        </div>
      </div>


      <div className="_3YDCW8EBZnxTRa5xT7gtHk _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88"><span className="_17Olod74EUtMOOpeHSF9RO _3K8w6l0jetB1VHftQo2qK6 _3riOXmq8mfDI5UGnLrweQh"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M4.53 11.9L9 16.38 19.44 5.97a.75.75 0 0 1 1.06 1.06L9.53 17.97c-.3.29-.77.29-1.06 0l-5-5c-.7-.71.35-1.77 1.06-1.07z" /></svg></span>
        <div className="fe5UvoRC9ZkGGo1SwMSHH">
          <div className="YOoVgTXLDk_wFPeE7Lehj">100% Đảm bảo hài lòng</div><span className="_19yfLwKwDEYdDKh0ixOgNB _1YRea3--8x2Rm7RqKumWGQ">Nếu bạn không hài lòng với món hàng bạn nhận được. Chúng tôi sẽ làm nó hài lòng với bạn. <a href="https://support.canva.com/canva-print/print-customer-service-policy/print-customer-happiness-policy/" target="_blank" rel="noopener">More</a></span></div>
      </div>

        </div> }

        {this.state.currentPrintStep == 2 && 
        <div
        style={{
          padding: '16px 16px 0',
          position: 'relative',

        }}
      >

<div className="_3w96fDCkiF-cx4xtdHq8Eb" style={{display: 'flex', flexDirection: 'column'}}>
<form autoComplete="on">
        <div className="_2WG0n1tF-Rc7mYLaZoDpdC">
          <p className="_3H42by719pMs1V0_zCiGTG ">Địa chỉ giao hàng</p>
        </div>
        <label className="_1lAKgn_4JnKMAytI-mxfqp">
          <p>Họ và tên:</p>
          <input className="" type="text" autoComplete="name" placeholder="E.g. David Bowie" name="name" defaultValue="Manh Quynh Nguyen" style={{backgroundImage: 'url("data:image/png', backgroundRepeat: 'no-repeat', backgroundAttachment: 'scroll', backgroundSize: '16px 18px', backgroundPosition: '98% 50%'}} />
        </label>
        <label className="_1lAKgn_4JnKMAytI-mxfqp">
          <p>Địa chỉ</p>
          <input className="" type="tel" autoComplete="tel" name="tel" />
        </label>
        <label className="_1lAKgn_4JnKMAytI-mxfqp">
          <p>Tỉnh thành phố</p>
          <input className="" type="text" autoComplete="address-level2" placeholder="E.g. Brooklyn" name="address-level2" defaultValue="Singapore" />
        </label>
        <label className="_1lAKgn_4JnKMAytI-mxfqp">
          <p>Quận / Huyện</p>
          <div className="_3Tk7vFk3XB74DSjc-X114e fs-hide">
            <div>
              <button type="button" className="_2rbIxUjieDPNxaKim1eUOh _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2Nsx_KfExUOh-XOcjJewEf"><span className="_11gYYV-YiJb7npRdslKTJX">  <div className="_16jC4NpI5ci7-HVASqeSUU">Singapore</div><span className="_1Lb2Q2YFMHEYBIzodSJlY8 _1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh"><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16"><path fill="currentColor" d="M11.71 6.47l-3.53 3.54c-.1.1-.26.1-.36 0L4.3 6.47a.75.75 0 1 0-1.06 1.06l3.53 3.54c.69.68 1.8.68 2.48 0l3.53-3.54a.75.75 0 0 0-1.06-1.06z" /></svg></span></span>
              </button>
            </div>
            <div className="_1sk78p8Erqs7Wd-2IGk6E9">
              <input className="" type="text" autoComplete="country" name="country" />
            </div>
          </div>
        </label>
        <label className="_1lAKgn_4JnKMAytI-mxfqp">
          <p className="">Số điện thoại</p>
          <input className="" type="text" autoComplete="postal-code" placeholder="E.g. 11217" name="postal-code" />
        </label>
      </form>
    </div>

      </div> 
        }

{this.state.currentPrintStep == 3 && 
        <div
        style={{
          padding: '16px 16px 0',
          position: 'relative',
          height: 'calc(100% - 46px)'
        }}
      >

<div className="_3w96fDCkiF-cx4xtdHq8Eb" style={{display: 'flex', flexDirection: 'column'}}>
<form autoComplete="on">
        <div className="_2WG0n1tF-Rc7mYLaZoDpdC">
          <p className="_3H42by719pMs1V0_zCiGTG ">Xác nhận và thanh toán</p>
        </div>
        <label className="_1lAKgn_4JnKMAytI-mxfqp">
          <p>Full name</p>
          <input className="" ref={i => this.refFullName = i} type="text" autoComplete="name" placeholder="E.g. David Bowie" name="name" defaultValue="Manh Quynh Nguyen" style={{backgroundImage: 'url("data:image/png', backgroundRepeat: 'no-repeat', backgroundAttachment: 'scroll', backgroundSize: '16px 18px', backgroundPosition: '98% 50%'}} />
        </label>
        <label className="_1lAKgn_4JnKMAytI-mxfqp">
          <p>Địa chỉ</p>
          <input ref={i => this.refAddress = i} className="" type="text" autoComplete="text" name="address" />
        </label>
        <label className="_1lAKgn_4JnKMAytI-mxfqp">
          <p>Contact number</p>
          <input className="" ref={i => this.refPhoneNumber = i} type="tel" autoComplete="tel" name="tel" />
        </label>
        <label className="_1lAKgn_4JnKMAytI-mxfqp">
          <p>City</p>
          <input className="" ref={i => this.refCity = i} type="text" autoComplete="address-level2" placeholder="E.g. Brooklyn" name="address-level2" defaultValue="Singapore" />
        </label>
        <label className="_1lAKgn_4JnKMAytI-mxfqp">
          <p>Country</p>
          <div className="_3Tk7vFk3XB74DSjc-X114e fs-hide">
            <div className>
              <button type="button" className="_2rbIxUjieDPNxaKim1eUOh _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2Nsx_KfExUOh-XOcjJewEf"><span className="_11gYYV-YiJb7npRdslKTJX">  <div className="_16jC4NpI5ci7-HVASqeSUU">Singapore</div><span className="_1Lb2Q2YFMHEYBIzodSJlY8 _1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh"><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16"><path fill="currentColor" d="M11.71 6.47l-3.53 3.54c-.1.1-.26.1-.36 0L4.3 6.47a.75.75 0 1 0-1.06 1.06l3.53 3.54c.69.68 1.8.68 2.48 0l3.53-3.54a.75.75 0 0 0-1.06-1.06z" /></svg></span></span>
              </button>
            </div>
            <div className="_1sk78p8Erqs7Wd-2IGk6E9">
              <input className="" type="text" autoComplete="country" name="country" />
            </div>
          </div>
        </label>
        <label className="_1lAKgn_4JnKMAytI-mxfqp">
          <p className="">Postal code</p>
          <input className="" type="text" autoComplete="postal-code" placeholder="E.g. 11217" name="postal-code" />
        </label>
      </form>
    </div>

      </div> 
        }

        <div className="_2UsfVIk8gJrdw8z8BGlvm1" 
          style={{
            padding: '16px',
            position: 'absolute',
            bottom: '0',
            flexDirection: 'column',
            width: '100%',
          }}>
        <div className="_2RWrXWDlIFqxW5c9NTv-se _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88" style={{margin: '8px 0', justifyContent: 'space-between', display: 'flex'}}><span>Tổng cộng</span><span className="_1Pu2ailzs8h4eqVc792xOn">$10.00</span></div>
        <div className="lLA-xJuEE5FVKeD8ezek3">
          <div>
            <div className="_3X7RzVL6jzVBkctplBQ8Z" 
            style={{display: 'flex'}}>
              {this.state.currentPrintStep > 1 &&
              <button
                style={{
                  marginRight: '5px',
                }}
                onClick={() => {this.setState({currentPrintStep: this.state.currentPrintStep - 1})}}
              >
                Back
              </button>
              }
              <button className="_2Rww-JOL60obmcYkaUOyg_ Wqfq1nAfa6if4eEOr6Mza _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _28oyZ-_qfE-ERg1G1Nc2zV Wqfq1nAfa6if4eEOr6Mza _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _3QJ_C8Lg1l0m5aoIK5piST _2kK9hFUTyqtMKr5EG4GuY4 _2HxAYUsq5GZ4sKqpZqoKLF" title="Continue" type="button" 
                onClick={() => this.handleContinueOrder()}
                style={{color: 'white', height: '40px', borderRadius: '4px', width: '100%', border: 'none', backgroundColor: 'rgb(1, 159, 182)'}}><span className="wDZfRbnecQOufIqcN2_A5">Tiếp tục</span></button>
            </div>
          </div>
        </div>
      </div>
      </div>
        </div>
        }
        </div>
        
        {this.state.showPopup ?  
              <Popup  
                        text='Click "Close Button" to hide popup'  
                        handleDownloadPDF={this.downloadPDF.bind(this, false)}
                        handleDownloadJPG={this.downloadPNG.bind(this, false, false)}
                        handleDownloadPNGTransparent={this.downloadPNG.bind(this, true, true)}
                        handleDownloadPNG={this.downloadPNG.bind(this, false, true)}
                        handleDownloadPDFWithBleed={this.downloadPDF.bind(this, true)}
                        closePopup={() => {this.setState({showPopup: false})}}  
              />  
        : null  
        }
        {this.state.showMediaEditPopup ? 
          <MediaEditPopup
          item={this.state.editingMedia}
          closePopup={() => {console.log('asd'); this.setState({showMediaEditPopup: false})}}  
          /> : null
        } 
        {this.state.showTemplateEditPopup ? 
          <TemplateEditor
          item={this.state.editingMedia}
          closePopup={() => {console.log('asd'); this.setState({showTemplateEditPopup: false})}}  
          /> : null
        }
        {this.state.showFontEditPopup ?
          <FontEditPopup
          item={this.state.editingFont}
          closePopup={() => {console.log('asd'); this.setState({showFontEditPopup: false})}}  
          /> : null
        } 
      </div>
    );
  }
}

export default CanvaEditor;