import React, { PureComponent } from "react";
import uuidv4 from "uuid/v4";
import Tooltip from "@Components/shared/Tooltip";
import { htmlToImage, getBoundingClientRect } from "@Utils";
import "@Styles/editor.scss";
import TopMenu from "@Components/editor/Sidebar";
import axios from "axios";
import StyledComponent from "styled-components";
import Popup from "@Components/shared/Popup";
import MediaEditPopup from "@Components/editor/MediaEditor";
import TemplateEditor from "@Components/editor/TemplateEditor";
import FontEditPopup from "@Components/editor/FontEditor";
import { object, any } from "prop-types";
import Canvas from "@Components/editor/Canvas";
import MathJax from "react-mathjax2";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import ImagePicker from "@Components/shared/ImagePicker";
import { getMostProminentColor } from "@Utils";
import PosterReview from "@Components/editor/PosterReview";
import TrifoldReview from "@Components/editor/TrifoldReview";
import FlyerReview from "@Components/editor/FlyerReview";
import BusinessCardReview from "@Components/editor/BusinessCardReview";
import CanvasReview from "@Components/editor/CanvasReview";
import Globals from "@Globals";
import { Helmet } from "react-helmet";
import ImageBackgroundRemovalEditor from "@Components/editor/ImageBackgroundRemovalEditor";
import { observable, toJS } from "mobx";
import { observer } from "mobx-react";
import LeftSide from "@Components/editor/LeftSide";
import FontSize from "@Components/editor/FontSize";

declare global {
  interface Window {
    paymentScope: any;
  }
}

const thick = 16;
const imgWidth = 161;
const backgroundWidth = 103;

enum SubType {
  BusinessCardReview = 0,
  FlyerReview = 1,
  PosterReview = 2,
  TrifoldReview = 3,
  Logo = 4,
  AnimatedSocialMedia = 5
}

enum SidebarTab {
  Image = 1,
  Text = 2,
  Template = 4,
  Background = 8,
  Element = 16,
  Upload = 32,
  Video = 64,
  RemovedBackgroundImage = 128,
  Font = 248,
  Color = 496,
  Emoji = 992
}

enum Mode {
  CreateDesign = 0,
  CreateTemplate = 1,
  CreateTextTemplate = 2,
  EditTemplate = 3,
  EditTextTemplate = 4
}

enum TemplateType {
  Template = 1,
  TextTemplate = 2,
  Heading = 3,
  Image = 4,
  Latex = 5,
  BackgroundImage = 6,
  RemovedBackgroundImage = 7,
  UserUpload = 8,
  Video = 9
}

interface IProps {
  rid: string;
  mode: string;
  match: any;
  images: any;
  firstpage: any;
  addItem: any;
  update: any;
  replaceFirstItem: any;
  fontsList: any;
  addFontItem: any;
  fonts: any;
  addFont: any;
  upperZIndex: number;
  increaseUpperzIndex: any;
  store: any;
}

interface ImageObject {
  _id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  posX: number;
  imgHeight: number;
  posY: number;
  imgWidth: number;
  src: string;
  origin_width: number;
  origin_height: number;
  type: TemplateType;
  scaleX: number;
  scaleY: number;
  zIndex: number;
  page: string;
  backgroundColor: string;
  rotateAngle: number;
  document_object: any;
  selected: boolean;
  width2: number;
  height2: number;
  ref: any;
  innerHTML: string;
  color: string;
  opacity: number;
  childId: string;
}

interface StaticGuide {
  x: any;
  y: any;
}

interface Background {
  width: number;
  height: number;
  _id: string;
  color: string;
  representative: string;
  representativeThumbnail: string;
}

interface Template {
  id: string;
  document: any;
  fontList: any;
  color: string;
  width: number;
  height: number;
  representative: string;
  representativeThumbnail: string;
}

interface GroupedText {
  id: string;
  document: any;
  fontList: any;
  color: string;
  representative: string;
  width: number;
  height: number;
}

interface UserUpload {
  id: string;
  document: any;
  fontList: any;
  color: string;
  representative: string;
  width: number;
  height: number;
}

interface RemoveImage {
  representative: string;
}

interface IState {
  subtype: SubType;
  query: string;
  error: any;
  cursor: any;
  mathjav: any;
  idObjectSelected: string;
  images: Array<object>;
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
  mode: number;
  staticGuides: any;
  deltaX: number;
  deltaY: number;
  editing: boolean;
  canRenderClientSide: boolean;
  fonts: any;
  fontsList: any;
  fontSize: number;
  currentOpacity: number;
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
  activePageId: string;
  upperZIndex: number;
  totalFonts: number;
  editingMedia: any;
  editingFont: any;
  showMediaEditPopup: boolean;
  showTemplateEditPopup: boolean;
  showFontEditPopup: boolean;
  typeObjectSelected: TemplateType;
  bleed: boolean;
  showPrintingSidebar: boolean;
  currentPrintStep: number;
  orderStatus: string;
  downloading: boolean;
  imgBackgroundColor: string;
  showImageRemovalBackgroundPopup: boolean;
  imageIdBackgroundRemoved: string;
  mounted: boolean;
  showZoomPopup: boolean;
  selectedImage: any;
}

const tex = `f(x) = \\int_{-\\infty}^\\infty\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi`;

@observer
class CanvaEditor extends PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedImage: null,
      showFontEditPopup: false,
      currentPrintStep: 1,
      subtype: null,
      bleed: false,
      showMediaEditPopup: false,
      totalFonts: 1000000,
      query: "",
      error: null,
      cursor: false,
      mathjav: null,
      upperZIndex: 1,
      activePageId: props.firstpage,
      pages: [props.firstpage],
      numOfPages: 1,
      updateRect: false,
      resizingInnerImage: false,
      childId: null,
      fontId: "O5mEMMs7UejmI1WeSKWQ",
      fontName: "images/833bdf3b-7c22-4e79-9b0a-eece6711eacd.png",
      isSaving: false,
      showPopup: false,
      showMediaEditingPopup: false,
      fontColor: "black",
      fontSize: 0,
      fontsList: [],
      fonts: ["O5mEMMs7UejmI1WeSKWQ"],
      templateType: null,
      _id: null,
      idObjectSelected: null,
      typeObjectSelected: null,
      scale: 1,
      fitScale: 1,
      startX: 0,
      startY: 0,
      images: [],
      selectedTab: SidebarTab.Template,
      rectWidth: this.props.match.params.width
        ? parseInt(this.props.match.params.width)
        : 0,
      rectHeight: this.props.match.params.height
        ? parseInt(this.props.match.params.height)
        : 0,
      toolbarOpened: true,
      toolbarSize: 450,
      scrollX: 16.67,
      scrollY: 16.67,
      resizing: false,
      rotating: false,
      dragging: false,
      uuid: "",
      mode: parseInt(this.props.match.params.mode) || Mode.CreateDesign,
      staticGuides: {
        x: [],
        y: []
      },
      deltaX: 0,
      deltaY: 0,
      editing: false,
      canRenderClientSide: false,
      cropMode: false,
      editingMedia: null,
      editingFont: null,
      showTemplateEditPopup: false,
      showPrintingSidebar: false,
      orderStatus: "",
      downloading: false,
      imgBackgroundColor: "white",
      showImageRemovalBackgroundPopup: false,
      imageIdBackgroundRemoved: null,
      mounted: false,
      showZoomPopup: false,
      currentOpacity: 100
    };
    this.handleResponse = this.handleResponse.bind(this);
    this.handleAddOrder = this.handleAddOrder.bind(this);
    this.externalPaymentCompleted = this.externalPaymentCompleted.bind(this);
  }

  $app = null;
  timer = null;
  $container = null;

  async componentDidMount() {
    console.log("this props", this.props);

    var ce = document.createElement.bind(document);
    var ca = document.createAttribute.bind(document);
    var ge = document.getElementsByTagName.bind(document);

    this.setState({ canRenderClientSide: true });
    var self = this;
    setTimeout(() => {
      self.setState({ mounted: true });
    }, 1000);

    var screenContainerParentRect = getBoundingClientRect(
      "screen-container-parent"
    );
    var screenContainerRect = getBoundingClientRect("screen-container");

    const { width, height } = screenContainerParentRect;
    var scaleX = (width - 100) / this.state.rectWidth;
    var scaleY = (height - 100) / this.state.rectHeight;

    var staticGuides = {
      x: [[0, 0], [this.state.rectWidth / 2, 0], [this.state.rectWidth, 0]],
      y: [[0, 0], [this.state.rectHeight / 2, 0], [this.state.rectHeight, 0]]
    };

    var fitScale =
      Math.min(scaleX, scaleY) === Infinity ? 1 : Math.min(scaleX, scaleY);

    this.state.fontsList.forEach(id => {
      var style = `@font-face {
        font-family: '${id}';
        src: url('/fonts/${id}.ttf');
      }`;
      var styleEle = ce("style");
      var type = ca("type");
      type.value = "text/css";
      styleEle.attributes.setNamedItem(type);
      styleEle.innerHTML = style;
      var head = document.head || ge("head")[0];
      head.appendChild(styleEle);

      var link = ce("link");
      link.id = id;
      link.rel = "preload";
      link.href = `/fonts/${id}.ttf`;
      link.media = "all";
      link.as = "font";
      link.crossOrigin = "anonymous";
      head.appendChild(link);
      return {
        id: id
      };
    });

    this.state.fontsList.forEach(id => {
      var style = `@font-face {
      font-family: '${id}';
      src: url('/fonts/${id}.ttf');
    }`;
      var styleEle = ce("style");
      var type = ca("type");
      type.value = "text/css";
      styleEle.attributes.setNamedItem(type);
      styleEle.innerHTML = style;
      var head = document.head || ge("head")[0];
      head.appendChild(styleEle);

      var link = ce("link");
      link.id = id;
      link.rel = "preload";
      link.href = `/fonts/${id}.ttf`;
      link.media = "all";
      link.as = "font";
      link.crossOrigin = "anonymous";
      head.appendChild(link);
      return {
        id: id
      };
    });

    this.setState({
      staticGuides,
      scale: fitScale,
      fitScale
    });
    var self = this;
    var subtype;
    var template_id = this.props.match.params.template_id;

    if (template_id) {
      var url = `/api/Template/Get?id=${template_id}`;

      await axios
        .get(url)
        .then(res => {
          console.log('template res', res);
          if (res.data.errors.length > 0) {
            throw new Error(res.data.errors.join("\n"));
          }
          console.log("resss ", res);
          var image = res.data;
          var templateType = image.value.type;
          var mode;
          if (this.props.match.path == "/editor/design/:template_id") {
            mode = Mode.CreateDesign;

            if (templateType == TemplateType.TextTemplate) {
              mode = Mode.EditTextTemplate;
            }
          } else if (templateType == TemplateType.Template) {
            mode = Mode.EditTemplate;
          } else if (templateType == TemplateType.TextTemplate) {
            mode = Mode.EditTextTemplate;
          }

          console.log("mode ", mode);

          var document = JSON.parse(image.value.document);
          var scaleX = (width - 100) / document.width;
          var scaleY = (height - 100) / document.height;
          var staticGuides = {
            x: [[0, 0], [document.width / 2, 0], [document.width, 0]],
            y: [[0, 0], [document.height / 2, 0], [document.height, 0]]
          };

          if (image.value.fontList) {
            var fontList = image.value.fontList.forEach(id => {
              var style = `@font-face {
                font-family: '${id}';
                src: url('/fonts/${id}.ttf');
              }`;
              var styleEle = ce("style");
              var type = ca("type");
              type.value = "text/css";
              styleEle.attributes.setNamedItem(type);
              styleEle.innerHTML = style;
              var head = document.head || ge("head")[0];
              head.appendChild(styleEle);

              var link = ce("link");
              link.id = id;
              link.rel = "preload";
              link.href = `/fonts/${id}.ttf`;
              link.media = "all";
              link.as = "font";
              link.crossOrigin = "anonymous";
              head.appendChild(link);
              return {
                id: id
              };
            });
          }

          this.props.images.replace(document.document_object);
          this.props.fonts.replace(image.value.fontList);

          subtype = res.data.value.printType;
          self.setState({
            scale:
              Math.min(scaleX, scaleY) === Infinity
                ? 1
                : Math.min(scaleX, scaleY),
            staticGuides,
            images: document.document_object,
            _id: template_id,
            rectWidth: document.width,
            rectHeight: document.height,
            templateType,
            mode,
            fonts: image.value.fontList,
            pages: res.data.value.pages,
            activePageId: res.data.value.pages[0],
            subtype: res.data.value.printType
          });
        })
        .catch(e => {
          console.log("Unexpected error occured: e", e);
        });
    } else {
      self.setState({
        _id: uuidv4()
      });
    }

    if (this.props.match.params.subtype) {
      subtype = this.props.match.params.subtype;
      var rectWidth;
      var rectHeight;
      if (subtype == 0) {
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
      } else if (subtype == 5) {
        rectWidth = 794;
        rectHeight = 1134;
      } else if (subtype == 6) {
        rectWidth = 1024;
        rectHeight = 1024;
      }

      var scaleX = (width - 100) / rectWidth;
      var scaleY = (height - 100) / rectHeight;
      self.setState({
        rectWidth,
        rectHeight,
        subtype,
        scale:
          Math.min(scaleX, scaleY) === Infinity ? 1 : Math.min(scaleX, scaleY),
        images: [
          {
            _id: "16a35aa3-469d-4ece-b3f2-6e87a9517e16",
            src:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
            top: 0,
            left: 0,
            height: rectWidth,
            width: rectHeight,
            type: TemplateType.BackgroundImage,
            imgWidth: rectWidth,
            imgHeight: rectHeight,
            origin_width: rectWidth,
            origin_height: rectHeight,
            rotateAngle: 0,
            scaleX: 1,
            scaleY: 1,
            zIndex: 1,
            page: this.props.firstpage,
            backgroundColor: "transparent",
            posX: 0,
            posY: 0,
            document_object: [],
            selected: false,
            width2: 1,
            height2: 1,
            ref: null,
            innerHTML: null,
            color: null,
            opacity: 100,
            childId: null
          }
        ]
      });
    }

    document.addEventListener("keydown", this.removeImage.bind(this));
  }

  selectFont = (id, e) => {
    console.log("selectFont Editor");
    this.setState({ fontId: id });

    var fontsList = toJS(this.props.fontsList);
    var font = fontsList.find(font => font.id === id);

    console.log("font ", id, font);
    console.log("fontList ", fontsList);

    var a = document.getSelection();
    if (a && a.type === "Range") {
      document.execCommand("FontName", false, id);
    } else {
      var childId = this.state.childId
        ? this.state.childId
        : this.state.idObjectSelected;
      var el = this.state.childId
        ? document.getElementById(childId)
        : document.getElementById(childId).getElementsByClassName("text")[0];
      var sel = window.getSelection();
      var range = document.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand("FontName", false, id);
      sel.removeAllRanges();
    }

    function insertAfter(newNode, referenceNode) {
      referenceNode.parentNode.className = "";
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    var fonts = document.getElementsByTagName("font");
    for (var i = 0; i < fonts.length; ++i) {
      var font1: any = fonts[i];
      font1.parentNode.style.fontFamily = id;
      font1.parentNode.innerText = font1.innerText;
      font1.remove();
    }

    let images = toJS(this.props.images);
    images = images.map(img => {
      if (img._id === this.state.idObjectSelected) {
        img.fontFace = id;
        img.fontRepresentative = font.representative;
      }
      return img;
    });

    this.props.images.replace(images);

    this.setState({ fontName: font.representative });

    e.preventDefault();
    var style = `@font-face {
      font-family: '${id}';
      src: url('/fonts/${id}.ttf');
    }`;
    var styleEle = document.createElement("style");
    var type = document.createAttribute("type");
    type.value = "text/css";
    styleEle.attributes.setNamedItem(type);
    styleEle.innerHTML = style;
    var head = document.head || document.getElementsByTagName("head")[0];
    head.appendChild(styleEle);

    var link = document.createElement("link");
    link.id = id;
    link.rel = "preload";
    link.href = `/fonts/${id}.ttf`;
    link.media = "all";
    link.as = "font";
    link.crossOrigin = "anonymous";
    head.appendChild(link);

    this.props.addFont(id);
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.scale !== prevState.scale) {
      this.handleScroll();
    }
  }

  handleEditmedia = item => {
    this.setState({ showMediaEditPopup: true, editingMedia: item });
  };

  handleEditFont = item => {
    this.setState({ showFontEditPopup: true, editingFont: item });
  };

  handleResizeStart = (startX: number, startY: number) => {
    var resizers = document.getElementsByClassName("resizable-handler-container");
    for (var i = 0; i < resizers.length; ++i) {
      var cur:any = resizers[i];
      cur.style.opacity = 0;
    }
    
    var rotators = document.getElementsByClassName("rotate-container");
    for (var i = 0; i < rotators.length; ++i) {
      var cur:any = rotators[i];
      cur.style.opacity = 0;
    }

    this.setState({
      resizing: true,
      resizingInnerImage: false,
      startX,
      startY
    });
  };

  handleResizeEnd = fontSize => {
    let images = toJS(this.props.images);
    images = images.map(img => {
      if (img._id === this.state.idObjectSelected) {
        img.fontSize = fontSize;
      }
      return img;
    });
    this.props.images.replace(images);

    var resizers = document.getElementsByClassName("resizable-handler-container");
    for (var i = 0; i < resizers.length; ++i) {
      var cur:any = resizers[i];
      cur.style.opacity = 1;
    }
    
    var rotators = document.getElementsByClassName("rotate-container");
    for (var i = 0; i < rotators.length; ++i) {
      var cur:any = rotators[i];
      cur.style.opacity = 1;
    }

    setTimeout(
      function() {
        this.setState({ resizing: false });
      }.bind(this),
      300
    );
  };

  switching = false;

  // handle the crop area
  handleResize = (
    style,
    isShiftKey,
    type,
    _id,
    scaleX,
    scaleY,
    cursor,
    objectType,
    e
  ) => {
    if (this.switching) {
      return;
    }
    const { scale } = this.state;
    let { top, left, width, height } = style;
    var self = this;
    var temp = this.handleImageResize;
    var images = this.props.images.map(image => {
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
          if (
            image.imgHeight + image.posY - height < 0 &&
            (type == "bl" || type == "br")
          ) {
            t6 = true;
            height = image.imgHeight + image.posY;
          }
          if (
            image.imgWidth + image.posX - width < 0 &&
            (type == "br" || type == "tr")
          ) {
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

          if (t5 && t8 && type == "tl") {
            self.setState({
              resizingInnerImage: !self.state.resizingInnerImage,
              startX: e.clientX - image.posX,
              startY: e.clientY - image.posY
            });
            self.switching = true;
            self.handleImageResize = () => {};
          }

          if (t5 && t6 && type == "bl") {
            self.setState({
              resizingInnerImage: !self.state.resizingInnerImage,
              startX: e.clientX - deltaLeft,
              startY: e.clientY - deltaHeight
            });
            self.switching = true;
            self.handleImageResize = () => {};
          }

          if (t6 && t7 && type == "br") {
            self.setState({
              resizingInnerImage: !self.state.resizingInnerImage,
              startX: e.clientX - deltaLeft,
              startY: e.clientY - deltaHeight
            });
            self.switching = true;
            self.handleImageResize = () => {};
          }

          if (t8 && t7 && type == "tr") {
            self.setState({
              resizingInnerImage: !self.state.resizingInnerImage,
              startX: e.clientX - deltaWidth,
              startY: e.clientY - deltaTop
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
          var newposY = scaleTop * image.imgHeight;

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
        image.left = left;
        image.width = width;
        image.height = height;

        if (cursor != "e-resize" && cursor != "w-resize") {
          image.scaleX = image.width / image.origin_width;
          image.scaleY = image.height / image.origin_height;

          var rectalos = document.getElementsByClassName(_id + "scaleX-scaleY");
          for (var i = 0; i < rectalos.length; ++i) {
            var cur: any = rectalos[i];
            cur.style.transform = `scaleX(${image.scaleX}) scaleY(${image.scaleY})`;
          }
        } else {
          if (objectType == TemplateType.Heading) {
            var rec = document
              .getElementById(_id)
              .getElementsByClassName("text")[0]
              .getBoundingClientRect();
            var as = Math.abs(Math.sin((image.rotateAngle / 360) * Math.PI));
            var cs = Math.abs(Math.cos((image.rotateAngle / 360) * Math.PI));
            var newHeight =
              (rec.height * cs - rec.width * as) / (cs ^ (2 - as) ^ 2);
            image.height = newHeight / scale;
          } else if (objectType == TemplateType.TextTemplate) {
            var maxHeight = 0;
            var rec = document.getElementById(_id).getBoundingClientRect();
            var rec2 = document
              .getElementById(_id)
              .getElementsByClassName("text");
            for (var i = 0; i < rec2.length; ++i) {
              var rec3 = rec2[i].getBoundingClientRect();
              maxHeight = Math.max(maxHeight, rec3.bottom - rec.top);
            }

            let texts = image.document_object.map(text => {
              text.height =
                document.getElementById(text._id).offsetHeight * text.scaleY;
              return text;
            });

            var newDocumentObjects = [];
            for (var i = 0; i < texts.length; ++i) {
              var d = texts[i];
              if (!d.ref) {
                newDocumentObjects.push(
                  ...this.normalize2(
                    d,
                    texts,
                    image.scaleX,
                    image.scaleY,
                    scale,
                    image.width,
                    image.height
                  )
                );
              }
            }
            image.height = maxHeight / scale;
            image.document_object = newDocumentObjects;
          }
          image.origin_width = image.width / image.scaleX;
          image.origin_height = image.height / image.scaleY;
        }

        (window as any).scaleY = image.scaleY;
      }
      return image;
    });

    // var el;
    // el = document.getElementById(_id + "_");
    // if (el) {
    //   el.style.top = top * scale + "px";
    //   el.style.left = left * scale + "px";
    //   el.style.width = width * scale + "px";
    //   el.style.height = height * scale + "px";
    // }

    // el = document.getElementById(_id + "__");
    // if (el) {
    //   el.style.top = top * scale + "px";
    //   el.style.left = left * scale + "px";
    //   el.style.width = width * scale + "px";
    //   el.style.height = height * scale + "px";
    // }

    // el = document.getElementById(_id + "___");
    // if (el) {
    //   el.style.width = width + "px";
    //   el.style.height = height + "px";
    // }

    // el = document.getElementById(_id + "____");
    // if (el) {
    //   el.style.width = width + "px";
    //   el.style.height = height + "px";
    // }

    // el = document.getElementById(_id + "_1");
    // if (el) {
    //   el.style.width = width + "px";
    //   el.style.height = height + "px";
    // }

    // el = document.getElementById(_id + "_2");
    // if (el) {
    //   el.style.width = width + "px";
    //   el.style.height = height + "px";
    // }

    var rectalos = document.getElementsByClassName(_id + "rect-alo");
    for (var i = 0; i < rectalos.length; ++i) {
      var cur: any = rectalos[i];
      cur.style.width = width + "px";
      cur.style.height = height + "px";
    }

    this.setState({ updateRect: self.switching }, () => {
      if (self.switching) {
        self.handleImageResize = temp;
        // self.setState({updateRect: false});
        setTimeout(() => {
          (self.switching = false), self.setState({ updateRect: false });
        }, 1);
      }
    });
    this.props.images.replace(images);
  };

  onResizeInnerImageStart = (startX, startY) => {
    this.setState({ resizingInnerImage: true, startX, startY });
  };

  // Handle the actual miage
  handleImageResize = (
    style,
    isShiftKey,
    type,
    _id,
    scaleX,
    scaleY,
    cursor,
    objectType,
    e
  ) => {
    if (this.switching) {
      return;
    }
    const { scale } = this.state;
    let { top, left, width, height } = style;

    var self = this;
    var switching = false;
    var temp = this.handleResize;
    let images = toJS(this.props.images);
    images = images.map(image => {
      if (image._id === _id) {
        if (
          image.height - top - height > 0 &&
          image.width - left - width > 0 &&
          type == "br"
        ) {
          self.setState({
            resizingInnerImage: !self.state.resizingInnerImage,
            startX: e.clientX + image.width - left - width,
            startY: e.clientY + image.height - top - height
          });
          switching = true;
          self.handleResize = () => {};
          height = -top + image.height;
          width = -left + image.width;
        } else if (
          image.height - top > height &&
          left <= 0 &&
          (type == "bl" || type == "br")
        ) {
          self.setState({
            resizingInnerImage: !self.state.resizingInnerImage,
            startX: e.clientX,
            startY: e.clientY + image.height - top - height
          });
          switching = true;
          self.handleResize = () => {};
          height = -top + image.height;
          // width = -left + image.width;
        } else if (image.height - top > height && left > 0 && type == "bl") {
          self.setState({
            resizingInnerImage: !self.state.resizingInnerImage,
            startX: e.clientX - left,
            startY: e.clientY + image.height - top - height
          });
          switching = true;
          self.handleResize = () => {};
          image.posX = -left;
          width += left;
          left = 0;
          height = -top + image.height;
        } else if (
          image.width - left > width &&
          top < 0 &&
          (type == "tr" || type == "br")
        ) {
          self.setState({
            resizingInnerImage: !self.state.resizingInnerImage,
            startX: e.clientX,
            startY: e.clientY + image.height - top - height
          });
          switching = true;
          self.handleResize = () => {};
          width = -left + image.width;
        } else if (image.width - left > width && top > 0 && type == "tr") {
          self.setState({
            resizingInnerImage: !self.state.resizingInnerImage,
            startX: e.clientX - top,
            startY: e.clientY + image.width - left - width
          });
          switching = true;
          self.handleResize = () => {};
          image.posY = -top;
          height += top;
          top = 0;
          width = -left + image.width;
        } else if (top > 0 && left <= 0 && (type == "tl" || type == "tr")) {
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
          self.setState({
            resizingInnerImage: !self.state.resizingInnerImage,
            startX: e.clientX - left,
            startY: e.clientY
          });
          image.posX = -left;
          width += left;
          left = 0;
          switching = true;
          self.handleResize = () => {};
        } else if (left > 1 && top > 1 && type == "tl") {
          self.setState({
            resizingInnerImage: !self.state.resizingInnerImage,
            startX: e.clientX - left,
            startY: e.clientY - top
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

    this.setState({ images, updateRect: switching }, () => {
      if (switching) {
        self.handleResize = temp;
        // self.setState({updateRect: false});
        setTimeout(() => {
          self.setState({ updateRect: false });
        }, 1);
      }
    });
  };

  handleRotate = (rotateAngle, _id) => {
    console.log('handleRotate ');
    let images = toJS(this.props.images);
    images = images.map(image => {
      if (image._id === _id) {
        image.rotateAngle = rotateAngle;
      }
      return image;
    });

    this.props.images.replace(images);
    // this.setState({ images });
  };

  handleRotateStart = () => {
    var resizers = document.getElementsByClassName("resizable-handler-container");
    for (var i = 0; i < resizers.length; ++i) {
      var cur:any = resizers[i];
      cur.style.opacity = 0;
    }
    
    var rotators = document.getElementsByClassName("rotate-container");
    for (var i = 0; i < rotators.length; ++i) {
      var cur:any = rotators[i];
      cur.style.opacity = 0;
    }
    this.setState({ rotating: true });
  };

  handleRotateEnd = () => {
    var resizers = document.getElementsByClassName("resizable-handler-container");
    for (var i = 0; i < resizers.length; ++i) {
      var cur:any = resizers[i];
      cur.style.opacity = 1;
    }
    
    var rotators = document.getElementsByClassName("rotate-container");
    for (var i = 0; i < rotators.length; ++i) {
      var cur:any = rotators[i];
      cur.style.opacity = 1;
    }
    setTimeout(
      function() {
        this.setState({ rotating: false });
      }.bind(this),
      300
    );
  };

  canvasRect = null;

  handleDragStart = (e, _id) => {
    console.log('handleDragStart ');
    const { scale } = this.state;
    this.canvasRect = getBoundingClientRect("canvas");
    var deltaX, deltaY;
    this.props.images.forEach(image => {
      if (image._id === _id) {
        deltaX = e.clientX - this.canvasRect.left - image.left * scale;
        deltaY = e.clientY - this.canvasRect.top - image.top * scale;
      }
    });

    console.log("deltaX", deltaX);
    console.log("deltaY", deltaY);

    var resizers = document.getElementsByClassName("resizable-handler-container");
    for (var i = 0; i < resizers.length; ++i) {
      var cur:any = resizers[i];
      cur.style.opacity = 0;
    }

    var rotators = document.getElementsByClassName("rotate-container");
    for (var i = 0; i < rotators.length; ++i) {
      var cur:any = rotators[i];
      cur.style.opacity = 0;
    }


    var rects = document.getElementsByClassName("rect");
    for (var i = 0; i < rects.length; ++i) {
      var curRect = rects[i];
      curRect.classList.remove("disable-hover");
      curRect.classList.remove("selected");

    }

    document.getElementById(_id + "_1").classList.add("selected");

    for (var i = 0; i < rects.length; ++i) {
      var curRect = rects[i];
      if (!curRect.classList.contains(_id + "-styledrect")) {
        curRect.classList.add("disable-hover");
      }
    }

    this.setState({ dragging: true, deltaX, deltaY });
  };

  tranformImage = (image: any) => {
    var centerX = image.left + image.width / 2;
    var centerY = image.top + image.height / 2;

    if (!image.rotateAngle || image.rotateAngle === 0) {
      return {
        x: [centerX - image.width / 2, centerX, centerX + image.width / 2],
        y: [centerY - image.height / 2, centerY, centerY + image.height / 2]
      };
    } else {
      return {
        x: [centerX - image.height / 2, centerX, centerX + image.height / 2],
        y: [centerY - image.width / 2, centerY, centerY + image.width / 2]
      };
    }
  };

  handleImageDrag = (_id, newPosX, newPosY) => {
    let images = toJS(this.props.images);
    images = images.map(img => {
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

    this.setState({ images });
  };

  handleDrag = (_id, clientX, clientY): any => {
    // var t0 = performance.now();
    // var t1;

    const { scale, deltaX, deltaY } = this.state;
    var newLeft, newTop;
    var newLeft2, newTop2;
    var newLeft3, newTop3;
    var centerX, centerY;
    var left, top;
    var img;
    var updateStartPosX = false;
    var updateStartPosY = false;
    var canvasRect = this.canvasRect;
    let images = toJS(this.props.images);
    images.forEach(image => {
      if (image._id === _id) {
        newLeft = (clientX - this.canvasRect.left - deltaX) / scale;
        newTop = (clientY - this.canvasRect.top - deltaY) / scale;
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
    if (img.type === TemplateType.BackgroundImage) {
      return;
    }
    images = images.map(image => {
      if (image.page === img.page) {
        var imageTransformed = this.tranformImage(image);
        if (image._id !== _id) {
          if (
            !updateStartPosX &&
            Math.abs(newLeft - imageTransformed.x[0]) < 5
          ) {
            left -= newLeft - imageTransformed.x[0];
            image[0] = 1;
            updateStartPosX = true;
          } else if (
            !updateStartPosX &&
            Math.abs(newLeft2 - imageTransformed.x[0]) < 5
          ) {
            left -= newLeft2 - imageTransformed.x[0];
            image[0] = 1;
            updateStartPosX = true;
          } else if (
            !updateStartPosX &&
            Math.abs(newLeft3 - imageTransformed.x[0]) < 5
          ) {
            left -= newLeft3 - imageTransformed.x[0];
            image[0] = 1;
            updateStartPosX = true;
          } else {
            image[0] = 0;
          }

          if (
            !updateStartPosX &&
            Math.abs(newLeft - imageTransformed.x[1]) < 5
          ) {
            left -= newLeft - imageTransformed.x[1];
            image[1] = 1;
            updateStartPosX = true;
          } else if (
            !updateStartPosX &&
            Math.abs(newLeft2 - imageTransformed.x[1]) < 5
          ) {
            left -= newLeft2 - imageTransformed.x[1];
            image[1] = 1;
            updateStartPosX = true;
          } else if (
            !updateStartPosX &&
            Math.abs(newLeft3 - imageTransformed.x[1]) < 5
          ) {
            left -= newLeft3 - imageTransformed.x[1];
            image[1] = 1;
            updateStartPosX = true;
          } else {
            image[1] = 0;
          }

          if (
            !updateStartPosX &&
            Math.abs(newLeft - imageTransformed.x[2]) < 5
          ) {
            left -= newLeft - imageTransformed.x[2];
            image[2] = 1;
            updateStartPosX = true;
          } else if (
            !updateStartPosX &&
            Math.abs(newLeft2 - imageTransformed.x[2]) < 5
          ) {
            left -= newLeft2 - imageTransformed.x[2];
            image[2] = 1;
            updateStartPosX = true;
          } else if (
            !updateStartPosX &&
            Math.abs(newLeft3 - imageTransformed.x[2]) < 5
          ) {
            left -= newLeft3 - imageTransformed.x[2];
            image[2] = 1;
            updateStartPosX = true;
          } else {
            image[2] = 0;
          }

          if (
            !updateStartPosY &&
            Math.abs(newTop - imageTransformed.y[0]) < 5
          ) {
            top -= newTop - imageTransformed.y[0];
            image[3] = 1;
            updateStartPosY = true;
          } else if (
            !updateStartPosY &&
            Math.abs(newTop2 - imageTransformed.y[0]) < 5
          ) {
            top -= newTop2 - imageTransformed.y[0];
            image[3] = 1;
            updateStartPosY = true;
          } else if (
            !updateStartPosY &&
            Math.abs(newTop3 - imageTransformed.y[0]) < 5
          ) {
            top -= newTop3 - imageTransformed.y[0];
            image[3] = 1;
            updateStartPosY = true;
          } else {
            image[3] = 0;
          }

          if (
            !updateStartPosY &&
            Math.abs(newTop - imageTransformed.y[1]) < 5
          ) {
            top -= newTop - imageTransformed.y[1];
            image[4] = 1;
            updateStartPosY = true;
          } else if (
            !updateStartPosY &&
            Math.abs(newTop2 - imageTransformed.y[1]) < 5
          ) {
            top -= newTop2 - imageTransformed.y[1];
            image[4] = 1;
            updateStartPosY = true;
          } else if (
            !updateStartPosY &&
            Math.abs(newTop3 - imageTransformed.y[1]) < 5
          ) {
            top -= newTop3 - imageTransformed.y[1];
            image[4] = 1;
            updateStartPosY = true;
          } else {
            image[4] = 0;
          }

          if (
            !updateStartPosY &&
            Math.abs(newTop - imageTransformed.y[2]) < 5
          ) {
            top -= newTop - imageTransformed.y[2];
            image[5] = 1;
            updateStartPosY = true;
          } else if (
            !updateStartPosY &&
            Math.abs(newTop2 - imageTransformed.y[2]) < 5
          ) {
            top -= newTop2 - imageTransformed.y[2];
            image[5] = 1;
            updateStartPosY = true;
          } else if (
            !updateStartPosY &&
            Math.abs(newTop3 - imageTransformed.y[2]) < 5
          ) {
            top -= newTop3 - imageTransformed.y[2];
            image[5] = 1;
            updateStartPosY = true;
          } else {
            image[5] = 0;
          }

          for (var ii = 0; ii < 6; ++ii) {
            if (image[ii] == 1) {
              document.getElementById(image._id + "guide_" + ii).style.display = "block";
            } else {
              document.getElementById(image._id + "guide_" + ii).style.display = "none";
            }
          }
        }

        // for (var ii = 0; ii < 6; ++ii) {
        //   document.getElementById(_id + "guide_" + ii).style.display = "none";
        // }
      }
      return image;
    });

    images = images.map(image => {
      if (image._id === _id) {
        const { staticGuides } = this.state;

        var x = staticGuides.x.map(v => {
          var e = v[0];
          if (!updateStartPosX && Math.abs(newLeft - e) < 5) {
            left -= newLeft - e;
            v[1] = 1;
            updateStartPosX = true;
          } else if (!updateStartPosX && Math.abs(newLeft3 - e) < 5) {
            left -= newLeft3 - e;
            v[1] = 1;
            updateStartPosX = true;
          } else if (!updateStartPosX && Math.abs(newLeft2 - e) < 5) {
            left -= newLeft2 - e;
            v[1] = 1;
            updateStartPosX = true;
          } else {
            v[1] = 0;
          }

          return v;
        });

        var y = staticGuides.y.map(v => {
          var e = v[0];
          if (!updateStartPosY && Math.abs(newTop - e) < 5) {
            top -= newTop - e;
            v[1] = 1;
            updateStartPosY = true;
          } else if (!updateStartPosY && Math.abs(newTop3 - e) < 5) {
            top -= newTop3 - e;
            v[1] = 1;
            updateStartPosY = true;
          } else if (!updateStartPosY && Math.abs(newTop2 - e) < 5) {
            top -= newTop2 - e;
            v[1] = 1;
            updateStartPosY = true;
          } else {
            v[1] = 0;
          }

          return v;
        });

        // this.setState({staticGuides: {x, y}});
        image.left = left;
        image.top = top;
      }

      return image;
    });

    // var t0 = performance.now();

    // console.log('handleDrag 1');
    this.props.images.replace(images);

    document.getElementById(_id + "_").style.top = top * scale + "px";
    document.getElementById(_id + "_").style.left = left * scale + "px";
    document.getElementById(_id + "__").style.top = top * scale + "px";
    document.getElementById(_id + "__").style.left = left * scale + "px";

    // var t1 = performance.now();
    // console.log("Call to doSomething took he " + (t1 - t0) + " milliseconds.");

    this.setState({ dragging: true });

    return {
      updateStartPosX: !updateStartPosX,
      updateStartPosY: !updateStartPosY
    };
  };

  handleDragEnd = () => {
    console.log('handleDragEnd ');
    let {
      staticGuides: { x, y }
    } = this.state;

    x = x.map(e => {
      e[1] = 0;
      return e;
    });
    y = y.map(e => {
      e[1] = 0;
      return e;
    });

    var images = this.props.images.map(image => {
      for (var ii = 0; ii < 6; ++ii) {
        image[ii] = 0;
        document.getElementById(image._id + "guide_" + ii).style.display = "none";
      }
      // image[0] = 0;
      // image[1] = 0;
      // image[2] = 0;
      // image[3] = 0;
      // image[4] = 0;
      // image[5] = 0;
      // document.getElementById(image._id + "guide_" + ii).style.display = "none";
      return image;
    });

    // var t0 = performance.now();

    // console.log('handleDrag 2');
    this.props.images.replace(images);

    // var t1 = performance.now();
    // console.log("Call to doSomething took 3 " + (t1 - t0) + " milliseconds.");

    var rects = document.getElementsByClassName("rect");
    for (var i = 0; i < rects.length; ++i) {
      var curRect = rects[i];
      curRect.classList.remove("disable-hover");
    }

    var resizers = document.getElementsByClassName("resizable-handler-container");
    for (var i = 0; i < resizers.length; ++i) {
      var cur:any = resizers[i];
      cur.style.opacity = 1;
    }
    
    var rotators = document.getElementsByClassName("rotate-container");
    for (var i = 0; i < rotators.length; ++i) {
      var cur:any = rotators[i];
      cur.style.opacity = 1;
    }

    this.setState({ dragging: false, staticGuides: { x, y }, images });
  };

  setAppRef = ref => (this.$app = ref);
  setContainerRef = ref => (this.$container = ref);

  handleScroll = () => {
    const screensRect = getBoundingClientRect("screens");
    const canvasRect = getBoundingClientRect("canvas");
    if (screensRect && canvasRect) {
      const canvasRect = getBoundingClientRect("canvas");
      const { scale } = this.state;
      const startX = (screensRect.left + thick - canvasRect.left) / scale;
      const startY = (screensRect.top + thick - canvasRect.top) / scale;

      function elementIsVisible(element, container, partial) {
        var contHeight = container.offsetHeight,
          elemTop = offset(element).top - offset(container).top,
          elemBottom = elemTop + element.offsetHeight;
        return (
          (elemTop >= 0 && elemBottom <= contHeight) ||
          (partial &&
            ((elemTop < 0 && elemBottom > 0) ||
              (elemTop > 0 && elemTop <= contHeight)))
        );
      }

      // checks window
      function isWindow(obj) {
        return obj != null && obj === obj.window;
      }

      // returns corresponding window
      function getWindow(elem) {
        return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
      }

      // taken from jquery
      // @returns {{top: number, left: number}}
      function offset(elem) {
        var docElem,
          win,
          box = { top: 0, left: 0 },
          doc = elem && elem.ownerDocument;

        docElem = doc.documentElement;

        if (typeof elem.getBoundingClientRect !== typeof undefined) {
          box = elem.getBoundingClientRect();
        }
        win = getWindow(doc);
        return {
          top: box.top + win.pageYOffset - docElem.clientTop,
          left: box.left + win.pageXOffset - docElem.clientLeft
        };
      }

      var activePageId = this.state.pages[0];
      if (this.state.pages.length > 1) {
        var container = document.getElementById("screen-container-parent");
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
  }
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
      let images = this.props.images.map(image => {
        image.selected = false;
        return image;
      });

      var selectedTab = this.state.selectedTab;
      if (this.state.selectedTab === SidebarTab.Font) {
        selectedTab = SidebarTab.Image;
      }

      this.setState({
        selectedTab,
        images,
        idObjectSelected: null,
        typeObjectSelected: null,
        childId: null
      });
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
      let images = this.props.images.filter(
        img => img._id !== this.state.idObjectSelected
      );
      this.doNoObjectSelected();
      this.props.images.replace(images);
    }
  }
  handleImageSelected = (img, event) => {
    if (this.state.idObjectSelected && img._id !== this.state.idObjectSelected) {
      document.getElementById(this.state.idObjectSelected + "_1").style.outline = null;
    }
    console.log('handleImageSelected');
    if (img._id === this.state.idObjectSelected) {
      return;
    }

    console.log("img.backgroundColor ", img.backgroundColor);

    if (img.backgroundColor) {
      console.log("img.backgroundColor 22 ", img.backgroundColor);
      this.setState({
        imgBackgroundColor: img.backgroundColor
      });
    }

    event.stopPropagation();
    var scaleY;
    let images = this.props.images.map(image => {
      if (image._id === img._id) {
        scaleY = image.scaleY;
        image.selected = true;
      } else {
        image.selected = false;
      }
      return image;
    });

    this.setState({ fontColor: img.color, fontName: img.fontRepresentative });
    document.getElementById("fontSizeButton").innerText = `${Math.round(
      img.fontSize * 10
    ) / 10}`;
    console.log("img ", img);

    this.setState({
      selectedImage: img,
      idObjectSelected: img._id,
      typeObjectSelected: img.type,
      childId: null,
      currentOpacity: img.opacity ? img.opacity : 100
    });
  };

  removeTemplate = e => {
    var url = `/api/Template/Delete?id=${this.state._id}`;
    fetch(url, {
      method: "DELETE"
    });
  };

  download = async (filename, text) => {
    var blobUrl = URL.createObjectURL(text);
    var element = document.createElement("a");

    element.setAttribute("href", blobUrl);
    element.setAttribute("download", filename);
    element.style.display = "none";

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  downloadVideo = () => {
    document.getElementById("downloadPopup").style.display = "block";
    document.getElementById("editor").classList.add("popup");

    var previousScale = this.state.scale;
    var self = this;
    this.doNoObjectSelected();
    this.setState({ scale: 1, showPopup: true, downloading: true }, () => {
      var aloCloned = document.getElementsByClassName("alo");
      var canvas = [];
      for (var i = 0; i < aloCloned.length; ++i) {
        canvas.push((aloCloned[i] as HTMLElement).outerHTML);
      }

      var styles = document.getElementsByTagName("style");
      var a = Array.from(styles).filter(style => {
        return style.attributes.getNamedItem("data-styled") !== null;
      });

      axios
        .post(
          `/api/Design/DownloadVideo?width=${this.state.rectWidth}&height=${
            this.state.rectHeight
          }&videoId=${uuidv4()}`,
          {
            fonts: self.state.fonts,
            canvas,
            additionalStyle: a[0].outerHTML
          },
          {
            headers: {
              "Content-Type": "text/html"
            },
            responseType: "blob"
          }
        )
        .then(response => {
          self.setState({
            scale: previousScale,
            showPopup: false,
            downloading: false
          });
          self.download(`test.mp4`, response.data);
          document.getElementById("downloadPopup").style.display = "none";
          document.getElementById("editor").classList.remove("popup");
        });
    });
  };

  downloadPDF(bleed) {
    document.getElementById("downloadPopup").style.display = "block";
    document.getElementById("editor").classList.add("popup");

    var previousScale = this.state.scale;
    var self = this;
    this.doNoObjectSelected();
    this.setState(
      { scale: 1, showPopup: true, bleed, downloading: true },
      () => {
        var aloCloned = document.getElementsByClassName("alo");
        var canvas = [];
        for (var i = 0; i < aloCloned.length; ++i) {
          canvas.push((aloCloned[i] as HTMLElement).outerHTML);
        }

        var styles = document.getElementsByTagName("style");
        var a = Array.from(styles).filter(style => {
          return style.attributes.getNamedItem("data-styled") !== null;
        });

        axios
          .post(
            `/api/Design/Download?width=${this.state.rectWidth +
              (bleed ? 20 : 0)}&height=${this.state.rectHeight +
              (bleed ? 20 : 0)}`,
            { fonts: toJS(self.props.fonts), canvas },
            {
              headers: {
                "Content-Type": "text/html"
              },
              responseType: "blob"
            }
          )
          .then(response => {
            self.setState({
              scale: previousScale,
              showPopup: false,
              bleed: false,
              downloading: false
            });
            self.download("test.pdf", response.data);
            document.getElementById("downloadPopup").style.display = "none";
            document.getElementById("editor").classList.remove("popup");
          });
      }
    );
  }

  b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
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

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  handleRemoveBackground = (mediaId, e) => {
    console.log("handleRemoveBackground");
    this.setState({
      showImageRemovalBackgroundPopup: true,
      imageIdBackgroundRemoved: mediaId,
      showMediaEditPopup: false,
      showPopup: false
    });
  };

  async downloadPNG(transparent, png) {
    document.getElementById("downloadPopup").style.display = "block";
    document.getElementById("editor").classList.add("popup");

    var previousScale = this.state.scale;
    var self = this;
    this.doNoObjectSelected();
    this.setState({ scale: 1, showPopup: true, downloading: true }, () => {
      var aloCloned = document.getElementsByClassName("alo");
      var canvas = [];
      for (var i = 0; i < aloCloned.length; ++i) {
        canvas.push((aloCloned[i] as HTMLElement).outerHTML);
      }

      var styles = document.getElementsByTagName("style");
      var a = Array.from(styles).filter(style => {
        return style.attributes.getNamedItem("data-styled") !== null;
      });

      axios
        .post(
          `/api/Design/DownloadPNG?width=${this.state.rectWidth}&height=${this.state.rectHeight}&transparent=${transparent}&download=true&png=${png}`,
          {
            fonts: toJS(self.props.fonts),
            canvas,
            additionalStyle: a[0].outerHTML,
            transparent
          },
          {
            headers: {
              "Content-Type": "text/html"
            },
            responseType: "blob"
          }
        )
        .then(response => {
          self.setState({
            scale: previousScale,
            showPopup: false,
            downloading: false
          });
          self.download(`test.${png ? "png" : "jpeg"}`, response.data);

          document.getElementById("downloadPopup").style.display = "none";
          document.getElementById("editor").classList.remove("popup");
        });
    });
  }

  async saveImages(rep) {
    var _id;
    this.setState({ isSaving: true });
    const { mode } = this.state;
    var self = this;
    this.doNoObjectSelected();

    const { rectWidth, rectHeight } = this.state;

    let images = toJS(self.props.images);
    images = images.map(image => {
      image.width2 = image.width / rectWidth;
      image.height2 = image.height / rectHeight;
      return image;
    });

    console.log("images ", images);

    if (mode === Mode.CreateTextTemplate || mode === Mode.EditTextTemplate) {
      var newImages = [];
      for (var i = 0; i < images.length; ++i) {
        var image = images[i];
        if (!image.ref) {
          newImages.push(...this.normalize(image, images));
        }
      }
      images = newImages;
    }

    if (
      this.state.mode === Mode.CreateTextTemplate ||
      this.state.mode == Mode.EditTextTemplate
    ) {
      images = images.map(img => {
        if (img.innerHTML) {
          img.innerHTML = img.innerHTML.replace(/#ffffff/g, "black");
          img.innerHTML = img.innerHTML.replace(
            /rgb\(255, 255, 255\)/g,
            "black"
          );

          console.log("innerHTML ", img.innerHTML);
        }
        return img;
      });
    }

    console.log("images ", images);

    await setTimeout(async function() {
      var url;
      var _id = self.state._id;

      if (mode == Mode.CreateDesign) {
        url = "/api/Template/Update";
      } else if (
        mode == Mode.CreateTemplate ||
        mode == Mode.CreateTextTemplate
      ) {
        url = "/api/Template/Add";
      } else if (mode == Mode.EditTemplate || mode == Mode.EditTextTemplate) {
        url = "/api/Template/Update";
      }

      console.log("mode ", mode);
      console.log("url ", url);

      var type;
      if (mode == Mode.CreateTextTemplate || mode == Mode.EditTextTemplate) {
        type = TemplateType.TextTemplate;
      } else if (mode == Mode.CreateTemplate || mode == Mode.EditTemplate) {
        type = TemplateType.Template;
      }

      var previousScale = self.state.scale;
      self.setState({ scale: 1, showPopup: true }, () => {
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
          return style.attributes.getNamedItem("data-styled") !== null;
        });

        _id = self.state._id ? self.state._id : uuidv4();

        var res = JSON.stringify({
          CreatedAt: "2014-09-27T18:30:49-0300",
          CreatedBy: 2,
          UpdatedAt: "2014-09-27T18:30:49-0300",
          UpdatedBy: 3,
          Type: type,
          Document: JSON.stringify({
            _id,
            width: self.state.rectWidth,
            origin_width: self.state.rectWidth,
            height: self.state.rectHeight,
            origin_height: self.state.rectHeight,
            left: 0,
            top: 0,
            type: type,
            scaleX: 1,
            scaleY: 1,
            document_object: images
          }),
          FontList: toJS(self.props.fonts),
          Width: self.state.rectWidth,
          Height: self.state.rectHeight,
          Id: _id,
          Keywords: [],
          Canvas: canvas,
          Canvas2: canvas2,
          AdditionalStyle: a[0].outerHTML,
          FilePath: "/templates",
          FirstName: "Untilted",
          Pages: self.state.pages,
          PrintType: self.state.subtype,
          Representative: rep ? rep : `images/${uuidv4()}.jpeg`,
          Representative2: `images/${uuidv4()}.jpeg`
        });

        console.log('save image ', res);

        axios
          .post(url, res, {
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(res => {
            self.setState({ isSaving: false });
          });
      });
    }, 300);

    return _id;
  }

  onTextChange(parentIndex, e, key) {
    console.log("onTextChange ");
    const { scale } = this.state;
    let images = toJS(this.props.images);
    images = images.map(image => {
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
            deltaY = rec.height / this.state.scale / scaleY - text.height;
            text.height = rec.height / this.state.scale / scaleY;
          }
          return text;
        });

        var text2 = [];
        for (var i = 0; i < texts.length; ++i) {
          var d = texts[i];
          if (d.ref === null) {
            text2.push(
              ...this.normalize2(
                d,
                texts,
                image.scaleX,
                image.scaleY,
                scale,
                image.width,
                image.height
              )
            );
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
    // console.log('ToJS', toJS(this.props.images));
    // console.log('onSingleTextChange ', arguments);
    // var els;
    // if (childId){
    //   els = document.getElementById(childId).getElementsByTagName('font');
    // } else {
    //   els = document.getElementById(this.state.idObjectSelected).getElementsByTagName('font');
    // }

    thisImage = toJS(thisImage);
    // console.log('thisImage ', thisImage);

    var scaleChildY = 1;
    if (childId) {
      for (var i = 0; i < thisImage.document_object.length; ++i) {
        if (thisImage.document_object[i]._id === childId) {
          scaleChildY = thisImage.document_object[i].scaleY;
        }
      }
    }

    // for (var i = 0; i < els.length; ++i) {
    //   els[i].removeAttribute("size");
    //   els[i].style.fontSize = this.state.fontSize / thisImage.scaleY / scaleChildY + 'px';
    // }

    // console.log('ToJS', toJS(this.props.images));

    e.persist();
    setTimeout(() => {
      const { scale } = this.state;
      if (!childId) {
        let images = toJS(this.props.images);
        // console.log('images 3', images);
        images = images.map(image => {
          if (image._id === thisImage._id) {
            var centerX = image.left + image.width / 2;
            var centerY = image.top + image.height / 2;
            if (image.origin_height === 0) {
              image.scaleY = 0;
            } else {
              image.scaleY = image.height / image.origin_height;
            }
            image.width = e.target.offsetWidth * image.scaleX;

            var oldHeight = image.height;
            var a;
            if (thisImage.type === TemplateType.Heading) {
              a = document
                .getElementById(thisImage._id)
                .getElementsByClassName("text")[0] as HTMLElement;
            } else if (thisImage.type === TemplateType.Latex) {
              a = document
                .getElementById(thisImage._id)
                .getElementsByClassName("text2")[0] as HTMLElement;
            }
            var newHeight = a.offsetHeight * image.scaleY;
            image.height = newHeight;
            var tmp = newHeight / 2 - oldHeight / 2;
            var deltacX =
              tmp * Math.sin(((360 - image.rotateAngle) / 180) * Math.PI);
            var deltacY =
              tmp * Math.cos(((360 - image.rotateAngle) / 180) * Math.PI);
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

        // console.log('images 2', images);

        this.props.images.replace(images);

        // this.setState({ images, editing: true });
      } else {
        let images = toJS(this.props.images);
        // console.log('images ', images);
        images = images.map(image => {
          if (image._id === thisImage._id) {
            var scaleY = image.height / image.origin_height;

            // console.log('image ', image);

            let texts = image.document_object.map(text => {
              if (text._id === childId) {
                text.innerHTML = e.target.innerHTML;
                text.height = e.target.offsetHeight * text.scaleY;
              }
              return text;
            });

            // console.log('texts ', texts);

            var newDocumentObjects = [];
            for (var i = 0; i < texts.length; ++i) {
              var d = texts[i];
              if (!d.ref) {
                // console.log('allo ', )
                var imgs = this.normalize2(
                  d,
                  texts,
                  image.scaleX,
                  image.scaleY,
                  this.state.scale,
                  image.width,
                  image.height
                );
                newDocumentObjects.push(...imgs);
              }
            }

            var maxHeight = 0;
            for (var i = 0; i < newDocumentObjects.length; ++i) {
              maxHeight = Math.max(
                maxHeight,
                newDocumentObjects[i].top + newDocumentObjects[i].height
              );
            }

            var centerX = image.left + image.width / 2;
            var centerY = image.top + image.height / 2;
            var oldHeight = image.height;
            var newHeight = maxHeight * scaleY;
            image.height = newHeight;
            var tmp = newHeight / 2 - oldHeight / 2;
            var deltacX =
              tmp *
              Math.sin(
                ((360 - (image.rotateAngle ? image.rotateAngle : 0)) / 180) *
                  Math.PI
              );
            var deltacY =
              tmp *
              Math.cos(
                ((360 - (image.rotateAngle ? image.rotateAngle : 0)) / 180) *
                  Math.PI
              );
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

        // console.log('images ', images);
        // console.log('onSingleTextChange 2');
        this.props.images.replace(images);
        this.setState({ images });
      }
    }, 50);
  }

  imgDragging = null;

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
    this.setState({ selectedTab: SidebarTab.Font, toolbarOpened: true });
  };

  onClickDropDownFontSizeList = () => {
    document.getElementById("myFontSizeList").classList.toggle("show");

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

  handleDownloadList = () => {
    document.getElementById("myDownloadList").classList.toggle("show");

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

  onClickTransparent = () => {
    console.log("myTransparent ");
    document.getElementById("myTransparent").classList.toggle("show");

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
    const invertcolor = data => {
      for (var i = 0; i < data.length; i += 4) {
        data[i] = data[i] ^ 255;
        data[i + 1] = data[i + 1] ^ 255;
        data[i + 2] = data[i + 2] ^ 255;
      }
    };

    var node = document.getElementById("alo");

    return htmlToImage.toPng(node);
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

  handleScroll2 = e => {
    if (this.allowScroll === false) {
      var rec1 = document
        .getElementById("screen-container")
        .getBoundingClientRect();
      var rec2 = document
        .getElementById("screen-container-parent")
        .getBoundingClientRect();

      var deltaX = rec2.left - rec1.left;
      var deltaY = rec2.top - rec1.top;

      var scrollX = (deltaX / rec1.width) * 100;
      var scrollY = (deltaY / rec1.height) * 100;

      this.setState({ scrollX, scrollY });
    }
  };

  handleScrollX = e => {
    var self = this;
    var startX = e.pageX;

    var originalScrollX = this.state.scrollX;

    var previousX = 0;
    this.allowScroll = true;

    const onMove = e => {
      var rec = document
        .getElementById("screen-container-parent")
        .getBoundingClientRect();
      var deltaX = e.pageX - startX;
      var scrollX = originalScrollX + (deltaX / rec.width) * 100;
      if (scrollX < 0 || scrollX > 33.33) {
        return;
      }
      if (deltaX !== previousX) {
        document
          .getElementById("screen-container-parent")
          .scrollBy(deltaX - previousX, 0);
        previousX = deltaX;
      }

      self.setState({
        scrollX
      });
    };

    const onUp = e => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);

      self.allowScroll = false;
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  handleScrollY = e => {
    var self = this;
    var startY = e.pageY;

    var originalScrollY = this.state.scrollY;

    var previousY = 0;
    this.allowScroll = true;

    const onMove = e => {
      var rec = document
        .getElementById("screen-container-parent")
        .getBoundingClientRect();
      var deltaY = e.pageY - startY;
      var scrollY = originalScrollY + (deltaY / rec.height) * 100;
      if (scrollY < 0 || scrollY > 33.33) {
        return;
      }

      if (deltaY !== previousY) {
        document
          .getElementById("screen-container-parent")
          .scrollBy(0, deltaY - previousY);
        previousY = deltaY;
      }

      self.setState({
        scrollY
      });
    };

    const onUp = e => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);

      self.allowScroll = false;
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  handleSidebarSelectorClicked = (selectedTab: SidebarTab, e: any) => {
    e.preventDefault();
    this.setState({
      toolbarOpened: true,
      selectedTab: selectedTab
    });
  };

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // this.getBottomOfScreenContainer();
  }

  normalize2(
    image: any,
    images: any,
    scaleX: number,
    scaleY: number,
    scale: number,
    width: number,
    height: number
  ): any {
    var result = [];
    var norm = (image, parent) => {
      var res = { ...image };
      if (parent != null) {
        var img = images.filter(img => img._id === image._id)[0];
        res.top = parent.top + img.margin_top + parent.height;
      }

      result.push(res);
      if (res.childId) {
        var child = images.filter(img => img._id === res.childId)[0];

        norm(child, res);
      }
    };

    norm(image, null);

    return result;
  }

  normalize(image: any, images: any): any {
    console.log("normalize ", image, images);
    var result = [];
    var norm = (image, parent) => {
      var res = { ...image };
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
    };
    norm(image, null);

    return result;
  }

  uploadVideo = () => {
    console.log("uploadVideo");
    var self = this;
    ``;
    var fileUploader = document.getElementById(
      "image-file"
    ) as HTMLInputElement;
    var file = fileUploader.files[0];
    var fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = () => {
      var url = `/api/Media/AddVideo`;
      axios.post(url, {
        id: uuidv4(),
        data: fr.result,
        type: TemplateType.Video
      });
    };
  };

  handleChildIdSelected = childId => {
    // var defaultColor = "black";
    // var font;
    // var fontSize;
    // // var el:HTMLElement = document.getElementById(childId).getElementsByTagName("font")[0];
    // // if (!el) {
    // //   el = document.getElementById(childId).getElementsByTagName("span")[0];
    // // }
    // // if (el) {
    // //   defaultColor = window.getComputedStyle(el, null).getPropertyValue("color");
    // //   font = window.getComputedStyle(el, null).getPropertyValue("font-family");
    // //   fontSize = window.getComputedStyle(el, null).getPropertyValue("font-size");
    // // }
    // // this.handleFontFamilyChange(font);
    // // this.handleFontColorChange(defaultColor);
    // // this.setState({childId});

    // var id = childId;
    // var a = document.getSelection();
    // if (a && a.type === "Range") {
    // } else {
    //   // var el = document.getElementById(self.props._id).getElementsByClassName('font')[0];
    //   var el = document.getElementById(id).getElementsByClassName("font")[0];
    //   console.log(
    //     "document.getElementById(self.props._id) ",
    //     document.getElementById(id)
    //   );
    //   console.log("ellll ", el);
    //   var sel = window.getSelection();
    //   var range = document.createRange();
    //   range.selectNodeContents(el);
    //   sel.removeAllRanges();
    //   sel.addRange(range);
    //   var a = document.getSelection();
    //   fontSize = window
    //     .getComputedStyle(el, null)
    //     .getPropertyValue("font-size");
    //   defaultColor = window
    //     .getComputedStyle(el, null)
    //     .getPropertyValue("color");

    //   sel.removeAllRanges();
    // }
    // this.handleFontColorChange(defaultColor);
    this.setState({ childId });
  };

  handleFontSizeChange = fontSize => {
    this.setState({ fontSize });
  };

  handleFontColorChange = fontColor => {
    console.log("handleFontColorChange ", fontColor);
    this.setState({ fontColor });
  };

  handleFontFamilyChange = fontId => {
    console.log("fontId ", fontId);
    if (fontId) {
      var font = toJS(this.props.fontsList).find(font => font.id === fontId);
      console.log("font ", font);
      if (font) {
        this.setState({ fontName: font.representative, fontId });
      }
    }
  };

  enableCropMode = e => {
    this.setState({ cropMode: true });
  };

  toggleImageResizing = e => {
    this.setState({ resizingInnerImage: !this.state.resizingInnerImage });
  };

  addAPage = (e, id) => {
    console.log('addAPage');
    e.preventDefault();
    let pages = [...this.state.pages];
    var newPageId = uuidv4();
    pages.splice(pages.findIndex(img => img === id) + 1, 0, newPageId);
    this.setState({
      pages
    });
    setTimeout(() => {
      document.getElementById(newPageId).scrollIntoView();
    }, 100);
  };

  forwardSelectedObject = id => {
    let images = toJS(this.props.images);
    images = images.map(img => {
      if (img._id === this.state.idObjectSelected) {
        img.zIndex = this.props.store.upperZIndex + 1;
      }
      return img;
    });

    console.log('images ', images);

    this.props.images.replace(images);
    this.props.increaseUpperzIndex();

    // this.setState({ upperZIndex: this.state.upperZIndex + 1 });
  };

  backwardSelectedObject = id => {
    let images = toJS(this.props.images);
    images = images.map(img => {
      if (img._id === this.state.idObjectSelected) {
        img.zIndex = 2;
      } else {
        img.zIndex += 1;
      }
      return img;
    });

    this.props.images.replace(images);

    // this.setState({ upperZIndex: this.state.upperZIndex + 1 });
  };

  renderCanvas(preview, index) {
    var res = [];
    for (var i = 0; i < this.state.pages.length; ++i) {
      if (index >= 0 && i != index) {
        continue;
      }

      res.push(
        <Canvas
          rotating={this.state.rotating}
          resizing={this.state.resizing}
          dragging={this.state.dragging}
          isSaving={this.state.isSaving}
          downloading={this.state.downloading}
          bleed={this.state.bleed}
          key={i}
          staticGuides={this.state.staticGuides}
          index={i}
          id={this.state.pages[i]}
          addAPage={this.addAPage}
          images={this.props.images.filter(
            img => img.page === this.state.pages[i]
          )}
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
          handleDeleteThisPage={this.handleDeleteThisPage.bind(
            this,
            this.state.pages[i]
          )}
          showPopup={this.state.showPopup}
          preview={preview}
        />
      );
    }

    return res;
  }

  handleDeleteThisPage = pageId => {
    var pages = this.state.pages.filter(pId => pId !== pageId);
    this.setState({ pages });
  };

  handleRemoveAllMedia = () => {
    var model;
    if (
      this.state.selectedTab === SidebarTab.Image ||
      this.state.selectedTab === SidebarTab.Background
    ) {
      model = "Media";
    } else if (this.state.selectedTab === SidebarTab.Template) {
      model = "Template";
    }
    const url = `/api/${model}/RemoveAll`;
    fetch(url);
  };

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
    if (fragment === null || typeof fragment !== "object") {
      return;
    }
    const { requestId, orderId } = fragment;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, orderId })
    };

    fetch(`/payments/momo/status`, requestOptions)
      .then(this.handleResponse)
      .then(
        responseFromMomo => {
          responseFromMomo &&
            responseFromMomo.localMessage &&
            alert(responseFromMomo.localMessage);
          if (responseFromMomo.message === "Success") {
            this.handleAddOrder();
            this.setState({ orderStatus: "success" });
          }
        },
        error => {}
      );
  }

  getMoMoPayUrl = async () => {
    const requestOptions = {
      method: "GET"
    };

    fetch(`/payments/momo`, requestOptions)
      .then(this.handleResponse)
      .then(
        responseFromMomo => {
          window.paymentScope = { complete: this.externalPaymentCompleted };
          window.open(responseFromMomo.payUrl, "_blank");
        },
        error => {}
      );
  };

  handleContinueOrder = async () => {
    if (
      this.state.currentPrintStep === 3 &&
      this.state.orderStatus !== "success"
    ) {
      await this.getMoMoPayUrl();
    }
    if (this.state.currentPrintStep < 3)
      await this.setState({
        currentPrintStep: this.state.currentPrintStep + 1
      });
  };

  handleAddOrder = async () => {
    if (this.refFullName) {
      var fullName = this.refFullName.value;
      var address = this.refAddress.value;
      var city = this.refCity.value;
      var phoneNumber = this.refPhoneNumber.value;

      var rep = `images/${uuidv4()}.png`;

      this.saveImages(rep);

      var url = `/api/Order/Add`;
      var res = {
        Id: uuidv4(),
        FullName: fullName,
        Address: address,
        City: city,
        PhoneNumber: phoneNumber,
        OrderId: this.state._id,
        Representative: rep
      };
      axios.post(url, res);
    }
  };

  handleOpacityChange = opacity => {
    let images = toJS(this.props.images);
    images = images.map(img => {
      if (img._id === this.state.idObjectSelected) {
        img.opacity = opacity;
      }
      return img;
    });

    this.props.images.replace(images);

    // this.setState({ images });
  };

  refFullName = null;
  refAddress = null;
  refCity = null;
  refPhoneNumber = null;

  render() {
    const {
      scale,
      staticGuides,
      rectWidth,
      rectHeight,
      cropMode,
      pages
    } = this.state;

    const { images } = this.props;

    const adminEmail = "llaugusty@gmail.com";

    const fontColors = [
      "rgb(246, 218, 179)",
      "rgb(201, 148, 114)",
      "rgb(89, 61, 44)",
      "rgb(74, 38, 21)",
      "rgb(37, 25, 15)",
      "rgb(115, 28, 44)",
      "rgb(186, 32, 41)",
      "rgb(226, 32, 46)",
      "rgb(241, 93, 88)",
      "rgb(246, 158, 173)",
      "rgb(252, 196, 167)",
      "rgb(249, 164, 86)",
      "rgb(243, 115, 47)",
      "rgb(206, 93, 40)",
      "rgb(90, 43, 29)",
      "rgb(67, 26, 23)",
      "rgb(168, 31, 39)",
      "rgb(239, 55, 50)",
      "rgb(245, 143, 152)",
      "rgb(247, 175, 183)",
      "rgb(255, 221, 155)",
      "rgb(253, 188, 79)",
      "rgb(248, 153, 31)",
      "rgb(217, 124, 39)",
      "rgb(129, 73, 37)",
      "rgb(72, 25, 40)",
      "rgb(170, 29, 68)",
      "rgb(235, 8, 140)",
      "rgb(239, 117, 173)",
      "rgb(246, 175, 206)",
      "rgb(254, 246, 169)",
      "rgb(255, 209, 120)",
      "rgb(246, 179, 26)",
      "rgb(249, 201, 39)",
      "rgb(192, 127, 42)",
      "rgb(64, 32, 82)",
      "rgb(106, 52, 132)",
      "rgb(119, 65, 152)",
      "rgb(161, 130, 187)",
      "rgb(177, 158, 204)",
      "rgb(254, 244, 140)",
      "rgb(252, 240, 93)",
      "rgb(252, 238, 33)",
      "rgb(206, 220, 40)",
      "rgb(154, 168, 57)",
      "rgb(33, 29, 77)",
      "rgb(84, 39, 101)",
      "rgb(80, 90, 168)",
      "rgb(127, 127, 189)",
      "rgb(158, 156, 205)",
      "rgb(215, 231, 171)",
      "rgb(200, 221, 108)",
      "rgb(153, 204, 106)",
      "rgb(136, 179, 63)",
      "rgb(110, 134, 56)",
      "rgb(31, 37, 85)",
      "rgb(19, 75, 150)",
      "rgb(6, 109, 181)",
      "rgb(39, 174, 229)",
      "rgb(138, 213, 247)",
      "rgb(176, 218, 172)",
      "rgb(84, 187, 111)",
      "rgb(1, 176, 83)",
      "rgb(1, 93, 49)",
      "rgb(13, 63, 34)",
      "rgb(0, 124, 143)",
      "rgb(0, 169, 162)",
      "rgb(54, 193, 208)",
      "rgb(129, 207, 207)",
      "rgb(151, 216, 224)",
      "rgb(255, 255, 255)",
      "rgb(137, 133, 134)",
      "rgb(102, 99, 100)",
      "rgb(84, 80, 80)",
      "rgb(58, 56, 56)",
      "rgb(52, 50, 50)",
      "rgb(36, 36, 36)",
      "rgb(31, 30, 30)",
      "rgb(16, 19, 19)",
      "rgb(0, 0, 0)"
    ];

    const allColors = [
      "rgb(158, 156, 205)",
      "rgb(141, 140, 196)",
      "rgb(127, 127, 189)",
      "rgb(112, 114, 181)",
      "rgb(80, 90, 168)",
      "rgb(47, 72, 156)",
      "rgb(31, 67, 150)",
      "rgb(34, 65, 146)",
      "rgb(39, 60, 137)",
      "rgb(40, 57, 126)",
      "rgb(41, 52, 118)",
      "rgb(41, 50, 114)",
      "rgb(40, 46, 106)",
      "rgb(37, 40, 95)",
      "rgb(34, 38, 90)",
      "rgb(31, 33, 82)",
      "rgb(27, 29, 76)",
      "rgb(26, 27, 73)",
      "rgb(33, 29, 77)",
      "rgb(35, 34, 87)",
      "rgb(38, 37, 93)",
      "rgb(48, 42, 106)",
      "rgb(53, 47, 113)",
      "rgb(43, 50, 119)",
      "rgb(62, 51, 126)",
      "rgb(64, 56, 136)",
      "rgb(70, 59, 145)",
      "rgb(61, 64, 151)",
      "rgb(73, 69, 156)",
      "rgb(100, 90, 167)",
      "rgb(177, 158, 204)",
      "rgb(169, 145, 196)",
      "rgb(161, 130, 187)",
      "rgb(153, 118, 181)",
      "rgb(133, 93, 166)",
      "rgb(119, 65, 152)",
      "rgb(102, 59, 147)",
      "rgb(116, 54, 141)",
      "rgb(106, 52, 132)",
      "rgb(101, 48, 122)",
      "rgb(96, 44, 115)",
      "rgb(90, 42, 109)",
      "rgb(84, 39, 101)",
      "rgb(64, 32, 82)",
      "rgb(59, 32, 79)",
      "rgb(50, 25, 65)",
      "rgb(36, 23, 66)",
      "rgb(45, 23, 57)",
      "rgb(53, 25, 64)",
      "rgb(69, 32, 78)",
      "rgb(75, 32, 84)",
      "rgb(92, 38, 99)",
      "rgb(103, 41, 108)",
      "rgb(110, 43, 112)",
      "rgb(118, 46, 120)",
      "rgb(126, 48, 129)",
      "rgb(137, 50, 138)",
      "rgb(141, 51, 144)",
      "rgb(159, 61, 147)",
      "rgb(167, 91, 161)",
      "rgb(221, 169, 205)",
      "rgb(216, 153, 196)",
      "rgb(213, 139, 186)",
      "rgb(205, 120, 176)",
      "rgb(198, 93, 160)",
      "rgb(192, 55, 143)",
      "rgb(160, 45, 138)",
      "rgb(143, 45, 127)",
      "rgb(129, 43, 119)",
      "rgb(118, 42, 111)",
      "rgb(113, 40, 106)",
      "rgb(98, 38, 97)",
      "rgb(80, 31, 81)",
      "rgb(73, 30, 72)",
      "rgb(57, 25, 60)",
      "rgb(51, 22, 47)",
      "rgb(54, 21, 40)",
      "rgb(66, 22, 50)",
      "rgb(86, 30, 65)",
      "rgb(96, 28, 73)",
      "rgb(102, 28, 80)",
      "rgb(110, 36, 98)",
      "rgb(133, 35, 100)",
      "rgb(149, 35, 110)",
      "rgb(174, 32, 120)",
      "rgb(202, 29, 133)",
      "rgb(208, 22, 132)",
      "rgb(216, 48, 139)",
      "rgb(222, 94, 159)",
      "rgb(232, 119, 181)",
      "rgb(246, 175, 206)",
      "rgb(245, 160, 197)",
      "rgb(243, 145, 188)",
      "rgb(239, 117, 173)",
      "rgb(239, 80, 156)",
      "rgb(236, 44, 145)",
      "rgb(235, 8, 140)",
      "rgb(221, 10, 133)",
      "rgb(192, 28, 120)",
      "rgb(162, 33, 108)",
      "rgb(141, 33, 99)",
      "rgb(129, 31, 92)",
      "rgb(108, 27, 78)",
      "rgb(100, 28, 71)",
      "rgb(89, 30, 63)",
      "rgb(68, 22, 47)",
      "rgb(55, 20, 38)",
      "rgb(54, 21, 37)",
      "rgb(69, 23, 45)",
      "rgb(91, 29, 59)",
      "rgb(104, 28, 66)",
      "rgb(114, 31, 72)",
      "rgb(129, 28, 83)",
      "rgb(148, 30, 91)",
      "rgb(167, 32, 99)",
      "rgb(194, 29, 108)",
      "rgb(221, 16, 120)",
      "rgb(236, 14, 116)",
      "rgb(238, 46, 127)",
      "rgb(240, 93, 147)",
      "rgb(247, 174, 197)",
      "rgb(245, 159, 188)",
      "rgb(244, 145, 177)",
      "rgb(242, 124, 158)",
      "rgb(240, 96, 132)",
      "rgb(238, 50, 111)",
      "rgb(236, 22, 95)",
      "rgb(224, 26, 90)",
      "rgb(197, 31, 72)",
      "rgb(170, 29, 68)",
      "rgb(153, 31, 63)",
      "rgb(132, 25, 53)",
      "rgb(125, 28, 49)",
      "rgb(109, 28, 52)",
      "rgb(97, 31, 50)",
      "rgb(72, 25, 40)",
      "rgb(53, 21, 33)",
      "rgb(51, 21, 29)",
      "rgb(70, 25, 38)",
      "rgb(98, 32, 48)",
      "rgb(113, 29, 48)",
      "rgb(127, 26, 47)",
      "rgb(138, 28, 49)",
      "rgb(159, 31, 58)",
      "rgb(176, 30, 61)",
      "rgb(202, 32, 62)",
      "rgb(224, 28, 75)",
      "rgb(238, 30, 77)",
      "rgb(238, 51, 92)",
      "rgb(241, 95, 118)",
      "rgb(247, 174, 188)",
      "rgb(246, 158, 173)",
      "rgb(244, 144, 160)",
      "rgb(242, 119, 133)",
      "rgb(241, 94, 106)",
      "rgb(238, 51, 78)",
      "rgb(236, 28, 61)",
      "rgb(224, 28, 68)",
      "rgb(202, 32, 56)",
      "rgb(178, 31, 55)",
      "rgb(159, 30, 53)",
      "rgb(140, 29, 43)",
      "rgb(127, 27, 42)",
      "rgb(115, 28, 44)",
      "rgb(98, 33, 45)",
      "rgb(69, 26, 35)",
      "rgb(48, 20, 25)",
      "rgb(47, 20, 20)",
      "rgb(68, 26, 25)",
      "rgb(99, 35, 35)",
      "rgb(115, 29, 32)",
      "rgb(130, 29, 33)",
      "rgb(146, 31, 37)",
      "rgb(168, 31, 39)",
      "rgb(186, 32, 41)",
      "rgb(205, 32, 41)",
      "rgb(226, 32, 46)",
      "rgb(236, 30, 48)",
      "rgb(238, 50, 60)",
      "rgb(241, 93, 95)",
      "rgb(247, 175, 183)",
      "rgb(246, 159, 167)",
      "rgb(245, 143, 152)",
      "rgb(243, 126, 129)",
      "rgb(241, 93, 88)",
      "rgb(239, 55, 50)",
      "rgb(236, 32, 39)",
      "rgb(227, 32, 39)",
      "rgb(186, 32, 39)",
      "rgb(170, 32, 36)",
      "rgb(151, 32, 35)",
      "rgb(130, 29, 31)",
      "rgb(115, 31, 28)",
      "rgb(99, 35, 30)",
      "rgb(67, 26, 23)",
      "rgb(45, 18, 18)",
      "rgb(47, 19, 19)",
      "rgb(66, 27, 23)",
      "rgb(99, 38, 30)",
      "rgb(115, 36, 29)",
      "rgb(134, 35, 32)",
      "rgb(154, 42, 36)",
      "rgb(172, 39, 37)",
      "rgb(188, 46, 38)",
      "rgb(213, 49, 39)",
      "rgb(231, 54, 38)",
      "rgb(239, 64, 35)",
      "rgb(241, 87, 45)",
      "rgb(244, 119, 84)",
      "rgb(247, 137, 111)",
      "rgb(252, 205, 180)",
      "rgb(252, 196, 167)",
      "rgb(251, 186, 147)",
      "rgb(249, 166, 119)",
      "rgb(246, 143, 88)",
      "rgb(243, 115, 47)",
      "rgb(241, 94, 36)",
      "rgb(230, 90, 37)",
      "rgb(213, 80, 39)",
      "rgb(189, 67, 39)",
      "rgb(184, 64, 38)",
      "rgb(164, 56, 38)",
      "rgb(136, 48, 32)",
      "rgb(107, 42, 29)",
      "rgb(94, 43, 31)",
      "rgb(64, 28, 23)",
      "rgb(47, 19, 18)",
      "rgb(47, 20, 19)",
      "rgb(63, 28, 22)",
      "rgb(90, 43, 29)",
      "rgb(107, 43, 30)",
      "rgb(139, 51, 34)",
      "rgb(170, 64, 39)",
      "rgb(185, 74, 38)",
      "rgb(206, 93, 40)",
      "rgb(221, 104, 38)",
      "rgb(236, 115, 36)",
      "rgb(244, 120, 32)",
      "rgb(247, 143, 45)",
      "rgb(249, 164, 86)",
      "rgb(246, 218, 179)",
      "rgb(207, 160, 123)",
      "rgb(201, 148, 114)",
      "rgb(193, 130, 89)",
      "rgb(152, 97, 62)",
      "rgb(172, 104, 64)",
      "rgb(148, 88, 54)",
      "rgb(119, 60, 27)",
      "rgb(98, 49, 23)",
      "rgb(87, 37, 16)",
      "rgb(153, 123, 78)",
      "rgb(122, 93, 53)",
      "rgb(76, 55, 28)",
      "rgb(74, 55, 40)",
      "rgb(55, 40, 20)",
      "rgb(55, 30, 18)",
      "rgb(43, 24, 13)",
      "rgb(37, 25, 15)",
      "rgb(52, 35, 22)",
      "rgb(74, 38, 21)",
      "rgb(70, 36, 19)",
      "rgb(89, 61, 44)",
      "rgb(139, 90, 51)",
      "rgb(145, 101, 82)",
      "rgb(194, 134, 90)",
      "rgb(192, 128, 86)",
      "rgb(222, 152, 111)",
      "rgb(215, 163, 119)",
      "rgb(235, 201, 153)",
      "rgb(249, 200, 147)",
      "rgb(255, 225, 167)",
      "rgb(255, 221, 155)",
      "rgb(255, 218, 138)",
      "rgb(255, 209, 120)",
      "rgb(253, 188, 79)",
      "rgb(251, 174, 38)",
      "rgb(248, 153, 31)",
      "rgb(241, 145, 33)",
      "rgb(224, 122, 38)",
      "rgb(209, 104, 40)",
      "rgb(195, 91, 40)",
      "rgb(167, 71, 38)",
      "rgb(135, 51, 34)",
      "rgb(101, 46, 30)",
      "rgb(83, 42, 28)",
      "rgb(65, 29, 23)",
      "rgb(47, 20, 17)",
      "rgb(68, 32, 24)",
      "rgb(79, 41, 27)",
      "rgb(94, 49, 31)",
      "rgb(123, 52, 30)",
      "rgb(167, 80, 39)",
      "rgb(202, 101, 40)",
      "rgb(217, 124, 39)",
      "rgb(232, 150, 36)",
      "rgb(246, 179, 26)",
      "rgb(248, 193, 28)",
      "rgb(249, 201, 39)",
      "rgb(252, 210, 80)",
      "rgb(247, 209, 102)",
      "rgb(254, 246, 169)",
      "rgb(253, 244, 155)",
      "rgb(254, 244, 140)",
      "rgb(253, 242, 129)",
      "rgb(252, 240, 93)",
      "rgb(252, 238, 45)",
      "rgb(252, 238, 33)",
      "rgb(248, 211, 10)",
      "rgb(237, 182, 30)",
      "rgb(229, 160, 36)",
      "rgb(192, 127, 42)",
      "rgb(164, 97, 40)",
      "rgb(129, 73, 37)",
      "rgb(91, 51, 31)",
      "rgb(78, 41, 27)",
      "rgb(68, 33, 22)",
      "rgb(46, 21, 17)",
      "rgb(52, 38, 23)",
      "rgb(75, 55, 32)",
      "rgb(87, 75, 39)",
      "rgb(94, 84, 41)",
      "rgb(112, 102, 45)",
      "rgb(141, 129, 50)",
      "rgb(142, 147, 55)",
      "rgb(154, 168, 57)",
      "rgb(185, 195, 51)",
      "rgb(206, 220, 40)",
      "rgb(221, 226, 55)",
      "rgb(223, 228, 94)",
      "rgb(229, 229, 118)",
      "rgb(215, 231, 171)",
      "rgb(206, 226, 157)",
      "rgb(210, 228, 153)",
      "rgb(205, 225, 141)",
      "rgb(200, 221, 108)",
      "rgb(191, 215, 60)",
      "rgb(168, 207, 57)",
      "rgb(136, 179, 63)",
      "rgb(127, 160, 62)",
      "rgb(124, 139, 56)",
      "rgb(122, 120, 50)",
      "rgb(112, 105, 47)",
      "rgb(94, 83, 41)",
      "rgb(61, 58, 31)",
      "rgb(43, 40, 23)",
      "rgb(39, 24, 15)",
      "rgb(31, 28, 16)",
      "rgb(35, 42, 24)",
      "rgb(46, 60, 33)",
      "rgb(71, 77, 41)",
      "rgb(76, 84, 44)",
      "rgb(89, 97, 49)",
      "rgb(100, 113, 51)",
      "rgb(110, 134, 56)",
      "rgb(104, 154, 64)",
      "rgb(100, 172, 69)",
      "rgb(96, 187, 70)",
      "rgb(125, 194, 71)",
      "rgb(153, 204, 106)",
      "rgb(168, 211, 122)",
      "rgb(176, 218, 172)",
      "rgb(162, 211, 157)",
      "rgb(151, 207, 146)",
      "rgb(140, 202, 134)",
      "rgb(120, 195, 109)",
      "rgb(82, 184, 78)",
      "rgb(33, 178, 75)",
      "rgb(71, 165, 71)",
      "rgb(74, 146, 66)",
      "rgb(69, 130, 61)",
      "rgb(67, 111, 53)",
      "rgb(62, 96, 48)",
      "rgb(61, 88, 45)",
      "rgb(54, 80, 41)",
      "rgb(32, 60, 33)",
      "rgb(27, 42, 24)",
      "rgb(22, 32, 18)",
      "rgb(17, 33, 19)",
      "rgb(25, 43, 24)",
      "rgb(24, 61, 33)",
      "rgb(30, 85, 46)",
      "rgb(16, 91, 47)",
      "rgb(19, 99, 51)",
      "rgb(20, 116, 59)",
      "rgb(6, 131, 65)",
      "rgb(0, 147, 71)",
      "rgb(0, 154, 73)",
      "rgb(10, 171, 77)",
      "rgb(1, 176, 83)",
      "rgb(84, 187, 111)",
      "rgb(153, 210, 174)",
      "rgb(136, 204, 161)",
      "rgb(116, 197, 148)",
      "rgb(81, 188, 131)",
      "rgb(53, 183, 118)",
      "rgb(0, 173, 95)",
      "rgb(1, 166, 78)",
      "rgb(0, 157, 77)",
      "rgb(0, 144, 72)",
      "rgb(1, 130, 66)",
      "rgb(0, 116, 61)",
      "rgb(5, 108, 57)",
      "rgb(1, 93, 49)",
      "rgb(0, 84, 45)",
      "rgb(13, 63, 34)",
      "rgb(18, 45, 25)",
      "rgb(17, 34, 20)",
      "rgb(12, 31, 19)",
      "rgb(15, 44, 28)",
      "rgb(14, 61, 41)",
      "rgb(6, 85, 55)",
      "rgb(0, 91, 59)",
      "rgb(0, 108, 67)",
      "rgb(1, 115, 73)",
      "rgb(0, 129, 78)",
      "rgb(0, 145, 83)",
      "rgb(0, 157, 88)",
      "rgb(0, 166, 91)",
      "rgb(0, 169, 102)",
      "rgb(0, 180, 128)",
      "rgb(152, 210, 189)",
      "rgb(134, 205, 178)",
      "rgb(110, 198, 169)",
      "rgb(75, 189, 154)",
      "rgb(0, 182, 147)",
      "rgb(0, 170, 126)",
      "rgb(0, 167, 109)",
      "rgb(0, 158, 120)",
      "rgb(3, 143, 118)",
      "rgb(0, 124, 112)",
      "rgb(0, 111, 109)",
      "rgb(1, 103, 102)",
      "rgb(2, 89, 91)",
      "rgb(5, 80, 84)",
      "rgb(13, 61, 47)",
      "rgb(14, 43, 37)",
      "rgb(12, 31, 26)",
      "rgb(16, 32, 46)",
      "rgb(15, 42, 54)",
      "rgb(16, 61, 69)",
      "rgb(6, 79, 92)",
      "rgb(2, 88, 100)",
      "rgb(3, 101, 116)",
      "rgb(4, 109, 122)",
      "rgb(0, 118, 119)",
      "rgb(4, 142, 129)",
      "rgb(0, 158, 132)",
      "rgb(0, 167, 132)",
      "rgb(0, 171, 148)",
      "rgb(4, 183, 166)",
      "rgb(151, 216, 224)",
      "rgb(129, 207, 207)",
      "rgb(106, 201, 203)",
      "rgb(54, 193, 208)",
      "rgb(0, 184, 190)",
      "rgb(0, 173, 178)",
      "rgb(0, 169, 162)",
      "rgb(0, 160, 154)",
      "rgb(0, 140, 144)",
      "rgb(0, 124, 143)",
      "rgb(0, 108, 134)",
      "rgb(0, 101, 129)",
      "rgb(0, 87, 113)",
      "rgb(12, 78, 103)",
      "rgb(17, 61, 94)",
      "rgb(19, 39, 75)",
      "rgb(16, 29, 66)",
      "rgb(24, 30, 73)",
      "rgb(26, 39, 82)",
      "rgb(22, 61, 104)",
      "rgb(14, 71, 118)",
      "rgb(2, 78, 128)",
      "rgb(0, 94, 150)",
      "rgb(0, 105, 164)",
      "rgb(0, 118, 171)",
      "rgb(4, 135, 179)",
      "rgb(2, 157, 197)",
      "rgb(0, 171, 199)",
      "rgb(0, 176, 214)",
      "rgb(0, 186, 215)",
      "rgb(152, 220, 244)",
      "rgb(138, 213, 247)",
      "rgb(107, 207, 246)",
      "rgb(79, 200, 244)",
      "rgb(20, 195, 244)",
      "rgb(39, 174, 229)",
      "rgb(44, 170, 226)",
      "rgb(28, 155, 215)",
      "rgb(24, 145, 208)",
      "rgb(15, 129, 197)",
      "rgb(6, 109, 181)",
      "rgb(0, 93, 168)",
      "rgb(5, 79, 152)",
      "rgb(23, 72, 137)",
      "rgb(33, 57, 111)",
      "rgb(30, 35, 82)",
      "rgb(26, 30, 75)",
      "rgb(30, 35, 83)",
      "rgb(34, 53, 107)",
      "rgb(29, 68, 133)",
      "rgb(3, 80, 156)",
      "rgb(0, 92, 166)",
      "rgb(3, 106, 177)",
      "rgb(1, 117, 187)",
      "rgb(10, 123, 193)",
      "rgb(9, 133, 199)",
      "rgb(21, 144, 208)",
      "rgb(24, 157, 217)",
      "rgb(16, 172, 227)",
      "rgb(27, 184, 226)",
      "rgb(155, 206, 234)",
      "rgb(141, 197, 235)",
      "rgb(120, 188, 232)",
      "rgb(82, 176, 227)",
      "rgb(61, 167, 222)",
      "rgb(6, 152, 213)",
      "rgb(10, 134, 200)",
      "rgb(12, 120, 190)",
      "rgb(0, 101, 172)",
      "rgb(0, 94, 163)",
      "rgb(0, 84, 151)",
      "rgb(6, 79, 146)",
      "rgb(19, 75, 150)",
      "rgb(35, 60, 120)",
      "rgb(36, 58, 112)",
      "rgb(36, 53, 108)",
      "rgb(33, 41, 91)",
      "rgb(31, 37, 85)",
      "rgb(34, 49, 100)",
      "rgb(34, 56, 110)",
      "rgb(30, 67, 134)",
      "rgb(21, 73, 139)",
      "rgb(9, 78, 144)",
      "rgb(0, 84, 153)",
      "rgb(0, 92, 165)",
      "rgb(4, 98, 171)",
      "rgb(8, 101, 177)",
      "rgb(6, 113, 185)",
      "rgb(21, 130, 198)",
      "rgb(32, 141, 196)",
      "rgb(168, 198, 229)",
      "rgb(152, 187, 227)",
      "rgb(124, 162, 213)",
      "rgb(94, 137, 198)",
      "rgb(62, 118, 187)",
      "rgb(14, 103, 177)",
      "rgb(10, 98, 175)",
      "rgb(0, 89, 165)",
      "rgb(0, 85, 158)",
      "rgb(11, 78, 145)",
      "rgb(22, 73, 138)",
      "rgb(27, 70, 134)",
      "rgb(38, 57, 118)",
      "rgb(35, 45, 97)",
      "rgb(34, 42, 91)",
      "rgb(30, 36, 84)",
      "rgb(29, 32, 79)",
      "rgb(34, 40, 91)",
      "rgb(37, 43, 98)",
      "rgb(38, 52, 111)",
      "rgb(39, 56, 120)",
      "rgb(38, 58, 123)",
      "rgb(39, 65, 124)",
      "rgb(36, 62, 130)",
      "rgb(32, 67, 141)",
      "rgb(28, 69, 149)",
      "rgb(13, 77, 158)",
      "rgb(28, 83, 163)",
      "rgb(41, 98, 173)",
      "rgb(49, 110, 175)",
      "rgb(129, 148, 203)",
      "rgb(98, 119, 186)",
      "rgb(71, 100, 174)",
      "rgb(49, 84, 163)",
      "rgb(33, 75, 157)",
      "rgb(33, 70, 153)",
      "rgb(33, 68, 152)",
      "rgb(35, 64, 145)",
      "rgb(37, 67, 132)",
      "rgb(41, 52, 119)",
      "rgb(41, 53, 109)",
      "rgb(39, 48, 108)",
      "rgb(37, 40, 94)",
      "rgb(34, 37, 89)",
      "rgb(29, 31, 79)",
      "rgb(24, 27, 68)"
    ];

    return (
      <div>
        <div
          id="editor"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Helmet>
            <title>Thiết kế</title>
          </Helmet>
          <div
            id="editor-navbar"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgb(67, 198, 172), rgb(48, 45, 111))",
              height: "55px",
              padding: "5px",
              display: "flex",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center"
              }}
            >
              { this.state.mounted && 
              <a
                id="logo-editor"
                style={{
                  color: "white",
                  display: "inline-block",
                  padding: "5px 8px 5px 5px",
                  // backgroundColor: 'yellowgreen',
                  borderRadius: "6px"
                }}
                href="/"
              >
                <span
                  style={{
                    alignItems: "center",
                    display: "flex"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
                      fontFamily: "AvenirNextRoundedPro-Medium"
                    }}
                  >
                    <span>
                      <svg
                        style={{ height: "24px", width: "24px" }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M15.45 17.97L9.5 12.01a.25.25 0 0 1 0-.36l5.87-5.87a.75.75 0 0 0-1.06-1.06l-5.87 5.87c-.69.68-.69 1.8 0 2.48l5.96 5.96a.75.75 0 0 0 1.06-1.06z"
                        ></path>
                      </svg>
                    </span>
                    Trang chủ
                  </div>
                </span>
              </a>}
            </div>
            <div
              style={{
                position: "absolute",
                right: 0,
                display: "flex",
                top: 0
              }}
            >
              {Globals.serviceUser &&
                Globals.serviceUser.username &&
                Globals.serviceUser.username === adminEmail && (
                  <button
                    className="toolbar-btn dropbtn-font"
                    onClick={this.saveImages.bind(this, null)}
                    style={{
                      display: "flex",
                      marginTop: "4px",
                      marginRight: "6px",
                      fontSize: "13px"
                    }}
                  >
                    <div
                      style={{
                        width: "14px",
                        margin: "auto",
                        marginRight: "5px"
                      }}
                    >
                      <svg
                        version="1.1"
                        id="Layer_1"
                        x="0px"
                        y="0px"
                        viewBox="0 0 512 512"
                      >
                        <path
                          style={{
                            fill: this.state.isSaving ? "red" : "black"
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z"
                        />
                      </svg>
                    </div>
                    <span>Lưu</span>
                  </button>
                )}
              <button
                id="download-btn"
                onClick={this.handleDownloadList}
                style={{
                  float: "right",
                  color: "white",
                  marginTop: "8px",
                  marginRight: "10px",
                  padding: "8px",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontFamily: "AvenirNextRoundedPro-Medium",
                  background: "#ebebeb0f",
                  border: "none",
                  height: '35px',
                  width: '36px',
                }}
              >
                {" "}
                <svg
                  style={{ 
                    fill: "white",
                    width: '20px',
                    height: '20px',
                  }}
                  height="25px"
                  viewBox="0 0 512 512"
                  width="25px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m409.785156 278.5-153.785156 153.785156-153.785156-153.785156 28.285156-28.285156 105.5 105.5v-355.714844h40v355.714844l105.5-105.5zm102.214844 193.5h-512v40h512zm0 0" />
                </svg>
              </button>
              <div
                id="myDownloadList"
                style={{
                  right: "5px",
                  zIndex: 9999999999,
                  background: "white",
                  display: "none"
                }}
                className="dropdown-content-font-size"
              >
                <div style={{ display: "flex", width: "100%" }}>
                  <div
                    id="myDropdownFontSize-3"
                    style={{
                      borderRadius: "5px",
                      width: "100%",
                      overflow: "hidden"
                    }}
                  >
                    <ul
                      style={{
                        padding: 0,
                        listStyle: "none",
                        width: "100%"
                      }}
                    >
                      <li 
                      style={{
                        boxShadow: 'rgba(55, 53, 47, 0.09) 0px 1px 0px',
                        marginBottom: '1px',
                      }}>
                        <button
                          onClick={this.downloadPNG.bind(this, true, true)}
                          style={{
                            width: "100%",
                            border: "none",
                            textAlign: "left",
                            padding: "5px 12px",
                            display: "flex",
                          }}
                        >
                          <svg style={{width: '35px', marginRight: '10px',}} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 58 58" xmlSpace="preserve">
<g>
	<path d="M50.95,12.187l-0.771-0.771L40.084,1.321L39.313,0.55C38.964,0.201,38.48,0,37.985,0H8.963C7.777,0,6.5,0.916,6.5,2.926V39
		v16.537V56c0,0.837,0.842,1.653,1.838,1.91c0.05,0.013,0.098,0.032,0.15,0.042C8.644,57.983,8.803,58,8.963,58h40.074
		c0.16,0,0.319-0.017,0.475-0.048c0.052-0.01,0.1-0.029,0.15-0.042C50.658,57.653,51.5,56.837,51.5,56v-0.463V39V13.978
		C51.5,13.211,51.408,12.645,50.95,12.187z M47.935,12H39.5V3.565L47.935,12z M11.5,2c0,0.552,0.448,1,1,1s1-0.448,1-1h2
		c0,0.552,0.448,1,1,1s1-0.448,1-1h2c0,0.552,0.448,1,1,1s1-0.448,1-1h2c0,0.552,0.448,1,1,1s1-0.448,1-1h2c0,0.552,0.448,1,1,1
		s1-0.448,1-1h2c0,0.552,0.448,1,1,1s1-0.448,1-1h2c0,0.552,0.448,1,1,1s1-0.448,1-1h0.058C37.525,2.126,37.5,2.256,37.5,2.391V6v4
		v4h2c0,0.552,0.448,1,1,1s1-0.448,1-1h2c0,0.552,0.448,1,1,1s1-0.448,1-1h2c0,0.552,0.448,1,1,1s1-0.448,1-1
		c0-0.02-0.01-0.037-0.011-0.057c0.003-0.001,0.007-0.001,0.01-0.002c0,0.015,0.001,0.021,0.001,0.036V14v4v4v4v0.67l-0.163-0.155
		C49.431,26.362,49.5,26.193,49.5,26c0-0.552-0.448-1-1-1c-0.211,0-0.395,0.08-0.557,0.191l-0.648-0.615
		C47.415,24.411,47.5,24.219,47.5,24c0-0.552-0.448-1-1-1c-0.238,0-0.447,0.095-0.618,0.233l-0.627-0.596
		C45.401,22.463,45.5,22.246,45.5,22c0-0.552-0.448-1-1-1c-0.264,0-0.501,0.107-0.68,0.275l-0.607-0.577
		C43.39,20.518,43.5,20.272,43.5,20c0-0.552-0.448-1-1-1c-0.291,0-0.547,0.129-0.73,0.327l-0.581-0.552
		c-0.013-0.012-0.029-0.016-0.042-0.027C41.359,18.565,41.5,18.302,41.5,18c0-0.552-0.448-1-1-1s-1,0.448-1,1
		c0,0.306,0.145,0.57,0.361,0.753c-0.031,0.027-0.071,0.042-0.099,0.073l-0.5,0.548C39.078,19.151,38.811,19,38.5,19
		c-0.552,0-1,0.448-1,1c0,0.344,0.184,0.632,0.448,0.812l-0.613,0.671C37.159,21.199,36.859,21,36.5,21c-0.552,0-1,0.448-1,1
		c0,0.39,0.23,0.72,0.556,0.884l-0.647,0.708C35.253,23.245,34.906,23,34.5,23c-0.552,0-1,0.448-1,1c0,0.44,0.288,0.802,0.683,0.936
		l-0.735,0.805C33.332,25.318,32.96,25,32.5,25c-0.552,0-1,0.448-1,1c0,0.492,0.362,0.882,0.83,0.966l-0.85,0.931
		C31.425,27.396,31.016,27,30.5,27c-0.552,0-1,0.448-1,1c0,0.544,0.436,0.982,0.976,0.995l-0.509,0.558l-4.743-4.743
		c-0.369-0.369-0.958-0.392-1.355-0.055l-6.412,5.457C17.473,30.142,17.5,30.075,17.5,30c0-0.552-0.448-1-1-1s-1,0.448-1,1
		c0,0.552,0.448,1,1,1c0.015,0,0.027-0.008,0.042-0.008l-1.063,0.904C15.425,31.395,15.015,31,14.5,31c-0.552,0-1,0.448-1,1
		c0,0.461,0.318,0.832,0.743,0.948l-0.815,0.694C13.283,33.268,12.925,33,12.5,33c-0.552,0-1,0.448-1,1
		c0,0.369,0.209,0.678,0.507,0.851l-0.697,0.593C11.129,35.183,10.842,35,10.5,35c-0.552,0-1,0.448-1,1
		c0,0.284,0.121,0.538,0.311,0.72L8.5,37.836V35c0.552,0,1-0.448,1-1c0-0.552-0.448-1-1-1v-2c0.552,0,1-0.448,1-1
		c0-0.552-0.448-1-1-1v-2c0.552,0,1-0.448,1-1c0-0.552-0.448-1-1-1v-2c0.552,0,1-0.448,1-1c0-0.552-0.448-1-1-1v-2
		c0.552,0,1-0.448,1-1c0-0.552-0.448-1-1-1v-2c0.552,0,1-0.448,1-1c0-0.552-0.448-1-1-1v-2c0.552,0,1-0.448,1-1c0-0.552-0.448-1-1-1
		V7c0.552,0,1-0.448,1-1c0-0.552-0.448-1-1-1V3c0.552,0,1-0.448,1-1H11.5z M8.963,56c-0.071,0-0.135-0.026-0.198-0.049
		C8.609,55.877,8.5,55.721,8.5,55.537V41h41v14.537c0,0.184-0.109,0.339-0.265,0.414C49.172,55.974,49.108,56,49.037,56H8.963z
		 M10.218,39l14.134-12.03C24.403,26.978,24.448,27,24.5,27c0.025,0,0.047-0.013,0.071-0.014L34.776,37.19
		c0.391,0.391,1.023,0.391,1.414,0s0.391-1.023,0-1.414l-4.807-4.807l9.168-10.041L49.5,29.43V39H10.218z"/>
	<path d="M22.042,44.744c-0.333-0.273-0.709-0.479-1.128-0.615c-0.419-0.137-0.843-0.205-1.271-0.205h-2.898V54h1.641v-3.637h1.217
		c0.528,0,1.012-0.077,1.449-0.232s0.811-0.374,1.121-0.656c0.31-0.282,0.551-0.631,0.725-1.046c0.173-0.415,0.26-0.877,0.26-1.388
		c0-0.483-0.103-0.918-0.308-1.306S22.375,45.018,22.042,44.744z M21.42,48.073c-0.101,0.278-0.232,0.494-0.396,0.649
		c-0.164,0.155-0.344,0.267-0.54,0.335c-0.196,0.068-0.395,0.103-0.595,0.103h-1.504v-3.992h1.23c0.419,0,0.756,0.066,1.012,0.198
		c0.255,0.132,0.453,0.296,0.595,0.492c0.141,0.196,0.234,0.401,0.28,0.615c0.045,0.214,0.068,0.403,0.068,0.567
		C21.57,47.451,21.52,47.795,21.42,48.073z"/>
	<polygon points="30.648,50.869 26.697,43.924 25.029,43.924 25.029,54 26.697,54 26.697,47.055 30.648,54 32.316,54 32.316,43.924 
		30.648,43.924 	"/>
	<path d="M38.824,49.926h1.709v2.488c-0.073,0.101-0.187,0.178-0.342,0.232c-0.155,0.055-0.317,0.098-0.485,0.13
		c-0.169,0.032-0.337,0.055-0.506,0.068c-0.169,0.014-0.303,0.021-0.403,0.021c-0.328,0-0.641-0.077-0.937-0.232
		c-0.296-0.155-0.561-0.392-0.793-0.711s-0.415-0.729-0.547-1.23c-0.132-0.501-0.203-1.094-0.212-1.777
		c0.009-0.702,0.082-1.294,0.219-1.777s0.326-0.877,0.567-1.183c0.241-0.306,0.515-0.521,0.82-0.649
		c0.305-0.128,0.626-0.191,0.964-0.191c0.301,0,0.592,0.06,0.875,0.178c0.282,0.118,0.533,0.31,0.752,0.574l1.135-1.012
		c-0.374-0.364-0.798-0.638-1.271-0.82c-0.474-0.183-0.984-0.273-1.531-0.273c-0.593,0-1.144,0.111-1.654,0.335
		c-0.511,0.224-0.955,0.549-1.333,0.978c-0.378,0.429-0.675,0.964-0.889,1.606c-0.214,0.643-0.321,1.388-0.321,2.235
		s0.107,1.595,0.321,2.242c0.214,0.647,0.51,1.185,0.889,1.613c0.378,0.429,0.82,0.752,1.326,0.971s1.06,0.328,1.661,0.328
		c0.301,0,0.604-0.022,0.909-0.068c0.305-0.046,0.602-0.123,0.889-0.232s0.561-0.248,0.82-0.417s0.494-0.385,0.704-0.649v-3.896
		h-3.336V49.926z"/>
	<circle cx="10.5" cy="4" r="1"/>
	<circle cx="14.5" cy="4" r="1"/>
	<circle cx="18.5" cy="4" r="1"/>
	<circle cx="22.5" cy="4" r="1"/>
	<circle cx="26.5" cy="4" r="1"/>
	<circle cx="30.5" cy="4" r="1"/>
	<circle cx="34.5" cy="4" r="1"/>
	<circle cx="36.5" cy="6" r="1"/>
	<circle cx="32.5" cy="6" r="1"/>
	<circle cx="28.5" cy="6" r="1"/>
	<circle cx="24.5" cy="6" r="1"/>
	<circle cx="20.5" cy="6" r="1"/>
	<circle cx="16.5" cy="6" r="1"/>
	<circle cx="12.5" cy="6" r="1"/>
	<circle cx="10.5" cy="8" r="1"/>
	<circle cx="14.5" cy="8" r="1"/>
	<circle cx="18.5" cy="8" r="1"/>
	<circle cx="22.5" cy="8" r="1"/>
	<circle cx="26.5" cy="8" r="1"/>
	<circle cx="30.5" cy="8" r="1"/>
	<circle cx="34.5" cy="8" r="1"/>
	<circle cx="36.5" cy="10" r="1"/>
	<circle cx="32.5" cy="10" r="1"/>
	<circle cx="28.5" cy="10" r="1"/>
	<circle cx="24.5" cy="10" r="1"/>
	<circle cx="20.5" cy="10" r="1"/>
	<circle cx="16.5" cy="10" r="1"/>
	<circle cx="12.5" cy="10" r="1"/>
	<circle cx="10.5" cy="12" r="1"/>
	<circle cx="22.5" cy="12" r="1"/>
	<circle cx="26.5" cy="12" r="1"/>
	<circle cx="30.5" cy="12" r="1"/>
	<circle cx="34.5" cy="12" r="1"/>
	<circle cx="36.5" cy="14" r="1"/>
	<circle cx="32.5" cy="14" r="1"/>
	<circle cx="28.5" cy="14" r="1"/>
	<circle cx="24.5" cy="14" r="1"/>
	<circle cx="26.5" cy="16" r="1"/>
	<circle cx="30.5" cy="16" r="1"/>
	<circle cx="34.5" cy="16" r="1"/>
	<circle cx="38.5" cy="16" r="1"/>
	<circle cx="42.5" cy="16" r="1"/>
	<circle cx="44.5" cy="18" r="1"/>
	<circle cx="48.5" cy="22" r="1"/>
	<circle cx="46.5" cy="20" r="1"/>
	<circle cx="48.5" cy="18" r="1"/>
	<circle cx="46.5" cy="16" r="1"/>
	<circle cx="36.5" cy="18" r="1"/>
	<circle cx="32.5" cy="18" r="1"/>
	<circle cx="28.5" cy="18" r="1"/>
	<circle cx="24.5" cy="18" r="1"/>
	<path d="M10.5,21c0.426,0,0.784-0.269,0.928-0.644c0.136,0.301,0.296,0.589,0.481,0.858C11.667,21.397,11.5,21.673,11.5,22
		c0,0.552,0.448,1,1,1c0.322,0,0.595-0.162,0.778-0.398c0.258,0.184,0.533,0.345,0.822,0.484C13.747,23.241,13.5,23.591,13.5,24
		c0,0.552,0.448,1,1,1s1-0.448,1-1c0-0.178-0.059-0.336-0.14-0.481c0.368,0.077,0.749,0.118,1.14,0.118s0.772-0.041,1.14-0.118
		C17.559,23.664,17.5,23.822,17.5,24c0,0.552,0.448,1,1,1s1-0.448,1-1c0-0.409-0.247-0.759-0.599-0.914
		c0.288-0.139,0.563-0.299,0.822-0.484C19.905,22.838,20.178,23,20.5,23c0.552,0,1-0.448,1-1c0-0.327-0.167-0.603-0.409-0.785
		c0.185-0.27,0.345-0.557,0.481-0.858C21.716,20.731,22.074,21,22.5,21c0.552,0,1-0.448,1-1c0-0.552-0.448-1-1-1
		c-0.205,0-0.385,0.077-0.543,0.182c0.073-0.36,0.112-0.732,0.112-1.114c0-0.441-0.057-0.868-0.154-1.28
		C22.081,16.913,22.277,17,22.5,17c0.552,0,1-0.448,1-1c0-0.552-0.448-1-1-1c-0.46,0-0.831,0.318-0.948,0.741
		c-0.148-0.321-0.326-0.625-0.53-0.909C21.303,14.654,21.5,14.356,21.5,14c0-0.552-0.448-1-1-1c-0.361,0-0.664,0.202-0.839,0.489
		c-0.298-0.207-0.617-0.385-0.954-0.531C19.156,12.86,19.5,12.479,19.5,12c0-0.552-0.448-1-1-1s-1,0.448-1,1
		c0,0.25,0.101,0.472,0.253,0.647C17.349,12.554,16.931,12.5,16.5,12.5s-0.849,0.054-1.253,0.147C15.399,12.472,15.5,12.25,15.5,12
		c0-0.552-0.448-1-1-1s-1,0.448-1,1c0,0.479,0.344,0.86,0.793,0.958c-0.337,0.146-0.655,0.324-0.954,0.531
		C13.164,13.202,12.861,13,12.5,13c-0.552,0-1,0.448-1,1c0,0.356,0.197,0.654,0.478,0.832c-0.204,0.284-0.381,0.589-0.53,0.909
		C11.331,15.318,10.96,15,10.5,15c-0.552,0-1,0.448-1,1c0,0.552,0.448,1,1,1c0.223,0,0.419-0.087,0.585-0.211
		c-0.097,0.412-0.154,0.839-0.154,1.28c0,0.381,0.039,0.754,0.112,1.114C10.885,19.077,10.705,19,10.5,19c-0.552,0-1,0.448-1,1
		C9.5,20.552,9.948,21,10.5,21z M16.5,14.5c1.968,0,3.569,1.601,3.569,3.569s-1.601,3.569-3.569,3.569s-3.569-1.601-3.569-3.569
		S14.532,14.5,16.5,14.5z"/>
	<circle cx="26.5" cy="20" r="1"/>
	<circle cx="30.5" cy="20" r="1"/>
	<circle cx="34.5" cy="20" r="1"/>
	<circle cx="32.5" cy="22" r="1"/>
	<circle cx="28.5" cy="22" r="1"/>
	<circle cx="24.5" cy="22" r="1"/>
	<circle cx="10.5" cy="24" r="1"/>
	<circle cx="22.5" cy="24" r="1"/>
	<circle cx="26.5" cy="24" r="1"/>
	<circle cx="30.5" cy="24" r="1"/>
	<circle cx="28.5" cy="26" r="1"/>
	<circle cx="20.5" cy="26" r="1"/>
	<circle cx="16.5" cy="26" r="1"/>
	<circle cx="12.5" cy="26" r="1"/>
	<circle cx="10.5" cy="28" r="1"/>
	<circle cx="14.5" cy="28" r="1"/>
	<circle cx="18.5" cy="28" r="1"/>
	<circle cx="12.5" cy="30" r="1"/>
	<circle cx="10.5" cy="32" r="1"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>

                          <div><p style={{ marginBottom: "0px" }}>PNG</p>
                          <span
                            style={{
                              fontSize: "12px"
                            }}
                          >
                            Ảnh chất lượng cao
                          </span>
                          </div>
                        </button>
                      </li>
                      <li style={{
                        boxShadow: 'rgba(55, 53, 47, 0.09) 0px 1px 0px',
                        marginBottom: '1px',
                      }}>
                        <button
                          onClick={this.downloadPNG.bind(this, false, false)}
                          style={{
                            width: "100%",
                            border: "none",
                            textAlign: "left",
                            padding: "5px 12px",
                            display: 'flex',
                          }}
                        >
                          <svg style={{width: '35px', marginRight: '10px',}} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 58 58" xmlSpace="preserve">
<g>
	<path d="M50.949,12.187l-5.818-5.818l-5.047-5.048l0,0l-0.77-0.77C38.964,0.201,38.48,0,37.985,0H8.963
		C7.777,0,6.5,0.916,6.5,2.926V39v16.537V56c0,0.837,0.842,1.653,1.838,1.91c0.05,0.013,0.098,0.032,0.15,0.042
		C8.644,57.983,8.803,58,8.963,58h40.074c0.16,0,0.319-0.017,0.475-0.048c0.052-0.01,0.101-0.029,0.152-0.043
		C50.659,57.652,51.5,56.837,51.5,56v-0.463V39V13.978C51.5,13.211,51.407,12.644,50.949,12.187z M47.935,12H39.5V3.565l4.248,4.249
		L47.935,12z M8.963,2h28.595C37.525,2.126,37.5,2.256,37.5,2.391V14h11.608c0.135,0,0.265-0.025,0.391-0.058
		c0,0.015,0.001,0.021,0.001,0.036v12.693l-8.311-7.896c-0.195-0.185-0.445-0.284-0.725-0.274c-0.269,0.01-0.521,0.127-0.703,0.325
		l-9.795,10.727l-4.743-4.743c-0.369-0.369-0.958-0.392-1.355-0.055L8.5,37.836V2.926C8.5,2.709,8.533,2,8.963,2z M8.963,56
		c-0.071,0-0.135-0.026-0.198-0.049C8.609,55.877,8.5,55.721,8.5,55.537V41h41v14.537c0,0.184-0.11,0.34-0.265,0.414
		C49.172,55.975,49.108,56,49.037,56H8.963z M10.218,39l14.245-12.124L34.776,37.19c0.391,0.391,1.023,0.391,1.414,0
		s0.391-1.023,0-1.414l-4.807-4.807l9.168-10.041l8.949,8.501V39H10.218z"/>
	<path d="M19.354,51.43c-0.019,0.446-0.171,0.764-0.458,0.95s-0.672,0.28-1.155,0.28c-0.191,0-0.396-0.022-0.615-0.068
		s-0.429-0.098-0.629-0.157c-0.201-0.06-0.385-0.123-0.554-0.191c-0.169-0.068-0.299-0.135-0.39-0.198l-0.697,1.107
		c0.182,0.137,0.405,0.26,0.67,0.369c0.264,0.109,0.54,0.207,0.827,0.294s0.565,0.15,0.834,0.191
		c0.269,0.041,0.503,0.062,0.704,0.062c0.401,0,0.791-0.039,1.169-0.116c0.378-0.077,0.713-0.214,1.005-0.41
		c0.292-0.196,0.524-0.456,0.697-0.779c0.173-0.323,0.26-0.723,0.26-1.196v-7.848h-1.668V51.43z"/>
	<path d="M28.767,44.744c-0.333-0.273-0.709-0.479-1.128-0.615c-0.419-0.137-0.843-0.205-1.271-0.205h-2.898V54h1.641v-3.637h1.217
		c0.528,0,1.012-0.077,1.449-0.232s0.811-0.374,1.121-0.656c0.31-0.282,0.551-0.631,0.725-1.046c0.173-0.415,0.26-0.877,0.26-1.388
		c0-0.483-0.103-0.918-0.308-1.306S29.099,45.018,28.767,44.744z M28.145,48.073c-0.101,0.278-0.232,0.494-0.396,0.649
		s-0.344,0.267-0.54,0.335c-0.196,0.068-0.395,0.103-0.595,0.103h-1.504v-3.992h1.23c0.419,0,0.756,0.066,1.012,0.198
		c0.255,0.132,0.453,0.296,0.595,0.492c0.141,0.196,0.234,0.401,0.28,0.615c0.045,0.214,0.068,0.403,0.068,0.567
		C28.295,47.451,28.245,47.795,28.145,48.073z"/>
	<path d="M35.76,49.926h1.709v2.488c-0.073,0.101-0.187,0.178-0.342,0.232c-0.155,0.055-0.317,0.098-0.485,0.13
		c-0.169,0.032-0.337,0.055-0.506,0.068c-0.169,0.014-0.303,0.021-0.403,0.021c-0.328,0-0.641-0.077-0.937-0.232
		c-0.296-0.155-0.561-0.392-0.793-0.711s-0.415-0.729-0.547-1.23c-0.132-0.501-0.203-1.094-0.212-1.777
		c0.009-0.702,0.082-1.294,0.219-1.777s0.326-0.877,0.567-1.183c0.241-0.306,0.515-0.521,0.82-0.649
		c0.305-0.128,0.626-0.191,0.964-0.191c0.301,0,0.592,0.06,0.875,0.178c0.282,0.118,0.533,0.31,0.752,0.574l1.135-1.012
		c-0.374-0.364-0.798-0.638-1.271-0.82c-0.474-0.183-0.984-0.273-1.531-0.273c-0.593,0-1.144,0.111-1.654,0.335
		c-0.511,0.224-0.955,0.549-1.333,0.978c-0.378,0.429-0.675,0.964-0.889,1.606c-0.214,0.643-0.321,1.388-0.321,2.235
		s0.107,1.595,0.321,2.242c0.214,0.647,0.51,1.185,0.889,1.613c0.378,0.429,0.82,0.752,1.326,0.971s1.06,0.328,1.661,0.328
		c0.301,0,0.604-0.022,0.909-0.068c0.305-0.046,0.602-0.123,0.889-0.232s0.561-0.248,0.82-0.417s0.494-0.385,0.704-0.649v-3.896
		H35.76V49.926z"/>
	<path d="M19.069,23.638c3.071,0,5.569-2.498,5.569-5.569S22.14,12.5,19.069,12.5S13.5,14.998,13.5,18.069
		S15.998,23.638,19.069,23.638z M19.069,14.5c1.968,0,3.569,1.601,3.569,3.569s-1.601,3.569-3.569,3.569S15.5,20.037,15.5,18.069
		S17.101,14.5,19.069,14.5z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
                          <div>
                          <p style={{ marginBottom: "0px" }}>JPG</p>
                          <span
                            style={{
                              fontSize: "12px"
                            }}
                          >
                            Kích thước tập tin ảnh nhỏ
                          </span>
                          </div>
                        </button>
                      </li>
                      <li style={{
                        boxShadow: 'rgba(55, 53, 47, 0.09) 0px 1px 0px',
                        marginBottom: '1px',
                      }}>
                        <button
                          onClick={this.downloadPDF.bind(this, false)}
                          style={{
                            width: "100%",
                            border: "none",
                            textAlign: "left",
                            padding: "5px 12px",
                            display: 'flex',
                          }}
                        >
                          <svg style={{width: '35px', marginRight: '10px',}} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 58 58" xmlSpace="preserve">
<g>
	<path d="M50.95,12.187l-0.771-0.771L40.084,1.321L39.313,0.55C38.964,0.201,38.48,0,37.985,0H8.963C7.777,0,6.5,0.916,6.5,2.926V39
		v16.537V56c0,0.837,0.842,1.653,1.838,1.91c0.05,0.013,0.098,0.032,0.15,0.042C8.644,57.983,8.803,58,8.963,58h40.074
		c0.16,0,0.319-0.017,0.475-0.048c0.052-0.01,0.1-0.029,0.15-0.042C50.658,57.653,51.5,56.837,51.5,56v-0.463V39V13.978
		C51.5,13.211,51.408,12.645,50.95,12.187z M47.935,12H39.5V3.565L47.935,12z M8.963,56c-0.071,0-0.135-0.026-0.198-0.049
		C8.609,55.877,8.5,55.721,8.5,55.537V41h41v14.537c0,0.184-0.109,0.339-0.265,0.414C49.172,55.974,49.108,56,49.037,56H8.963z
		 M8.5,39V2.926C8.5,2.709,8.533,2,8.963,2h28.595C37.525,2.126,37.5,2.256,37.5,2.391V14h11.609c0.135,0,0.264-0.025,0.39-0.058
		c0,0.015,0.001,0.021,0.001,0.036V39H8.5z"/>
	<path d="M22.042,44.744c-0.333-0.273-0.709-0.479-1.128-0.615c-0.419-0.137-0.843-0.205-1.271-0.205h-2.898V54h1.641v-3.637h1.217
		c0.528,0,1.012-0.077,1.449-0.232s0.811-0.374,1.121-0.656c0.31-0.282,0.551-0.631,0.725-1.046c0.173-0.415,0.26-0.877,0.26-1.388
		c0-0.483-0.103-0.918-0.308-1.306S22.375,45.018,22.042,44.744z M21.42,48.073c-0.101,0.278-0.232,0.494-0.396,0.649
		c-0.164,0.155-0.344,0.267-0.54,0.335c-0.196,0.068-0.395,0.103-0.595,0.103h-1.504v-3.992h1.23c0.419,0,0.756,0.066,1.012,0.198
		c0.255,0.132,0.453,0.296,0.595,0.492c0.141,0.196,0.234,0.401,0.28,0.615c0.045,0.214,0.068,0.403,0.068,0.567
		C21.57,47.451,21.52,47.795,21.42,48.073z"/>
	<path d="M31.954,45.4c-0.424-0.446-0.957-0.805-1.6-1.073s-1.388-0.403-2.235-0.403h-3.035V54h3.814
		c0.127,0,0.323-0.016,0.588-0.048c0.264-0.032,0.556-0.104,0.875-0.219c0.319-0.114,0.649-0.285,0.991-0.513
		s0.649-0.54,0.923-0.937s0.499-0.889,0.677-1.477s0.267-1.297,0.267-2.126c0-0.602-0.105-1.188-0.314-1.757
		C32.694,46.355,32.378,45.847,31.954,45.4z M30.758,51.73c-0.492,0.711-1.294,1.066-2.406,1.066h-1.627v-7.629h0.957
		c0.784,0,1.422,0.103,1.914,0.308s0.882,0.474,1.169,0.807s0.48,0.704,0.581,1.114c0.1,0.41,0.15,0.825,0.15,1.244
		C31.496,49.989,31.25,51.02,30.758,51.73z"/>
	<polygon points="35.598,54 37.266,54 37.266,49.461 41.477,49.461 41.477,48.34 37.266,48.34 37.266,45.168 41.9,45.168 
		41.9,43.924 35.598,43.924 	"/>
	<path d="M38.428,22.961c-0.919,0-2.047,0.12-3.358,0.358c-1.83-1.942-3.74-4.778-5.088-7.562c1.337-5.629,0.668-6.426,0.373-6.802
		c-0.314-0.4-0.757-1.049-1.261-1.049c-0.211,0-0.787,0.096-1.016,0.172c-0.576,0.192-0.886,0.636-1.134,1.215
		c-0.707,1.653,0.263,4.471,1.261,6.643c-0.853,3.393-2.284,7.454-3.788,10.75c-3.79,1.736-5.803,3.441-5.985,5.068
		c-0.066,0.592,0.074,1.461,1.115,2.242c0.285,0.213,0.619,0.326,0.967,0.326h0c0.875,0,1.759-0.67,2.782-2.107
		c0.746-1.048,1.547-2.477,2.383-4.251c2.678-1.171,5.991-2.229,8.828-2.822c1.58,1.517,2.995,2.285,4.211,2.285
		c0.896,0,1.664-0.412,2.22-1.191c0.579-0.811,0.711-1.537,0.39-2.16C40.943,23.327,39.994,22.961,38.428,22.961z M20.536,32.634
		c-0.468-0.359-0.441-0.601-0.431-0.692c0.062-0.556,0.933-1.543,3.07-2.744C21.555,32.19,20.685,32.587,20.536,32.634z
		 M28.736,9.712c0.043-0.014,1.045,1.101,0.096,3.216C27.406,11.469,28.638,9.745,28.736,9.712z M26.669,25.738
		c1.015-2.419,1.959-5.09,2.674-7.564c1.123,2.018,2.472,3.976,3.822,5.544C31.031,24.219,28.759,24.926,26.669,25.738z
		 M39.57,25.259C39.262,25.69,38.594,25.7,38.36,25.7c-0.533,0-0.732-0.317-1.547-0.944c0.672-0.086,1.306-0.108,1.811-0.108
		c0.889,0,1.052,0.131,1.175,0.197C39.777,24.916,39.719,25.05,39.57,25.259z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>

<div>
                          <p style={{ marginBottom: "0px" }}>PDF Standard</p>
                          <span
                            style={{
                              fontSize: "12px"
                            }}
                          >
                            Kích thước tập tin nhỏ, nhiều trang
                          </span>
                          </div>
                        </button>
                      </li>
                      <li style={{
                        boxShadow: 'rgba(55, 53, 47, 0.09) 0px 1px 0px',
                        marginBottom: '1px',
                      }}>
                        <button
                          onClick={this.downloadPDF.bind(this, true)}
                          style={{
                            width: "100%",
                            border: "none",
                            textAlign: "left",
                            padding: "5px 12px",
                            display: "flex",
                          }}
                        >
                          <svg style={{width: '35px', marginRight: '10px',}} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 58 58" xmlSpace="preserve">
<g>
	<path d="M50.95,12.187l-0.771-0.771L40.084,1.321L39.313,0.55C38.964,0.201,38.48,0,37.985,0H8.963C7.777,0,6.5,0.916,6.5,2.926V39
		v16.537V56c0,0.837,0.842,1.653,1.838,1.91c0.05,0.013,0.098,0.032,0.15,0.042C8.644,57.983,8.803,58,8.963,58h40.074
		c0.16,0,0.319-0.017,0.475-0.048c0.052-0.01,0.1-0.029,0.15-0.042C50.658,57.653,51.5,56.837,51.5,56v-0.463V39V13.978
		C51.5,13.211,51.408,12.645,50.95,12.187z M47.935,12H39.5V3.565L47.935,12z M8.963,56c-0.071,0-0.135-0.026-0.198-0.049
		C8.609,55.877,8.5,55.721,8.5,55.537V41h41v14.537c0,0.184-0.109,0.339-0.265,0.414C49.172,55.974,49.108,56,49.037,56H8.963z
		 M8.5,39V2.926C8.5,2.709,8.533,2,8.963,2h28.595C37.525,2.126,37.5,2.256,37.5,2.391V14h11.609c0.135,0,0.264-0.025,0.39-0.058
		c0,0.015,0.001,0.021,0.001,0.036V39H8.5z"/>
	<path d="M22.042,44.744c-0.333-0.273-0.709-0.479-1.128-0.615c-0.419-0.137-0.843-0.205-1.271-0.205h-2.898V54h1.641v-3.637h1.217
		c0.528,0,1.012-0.077,1.449-0.232s0.811-0.374,1.121-0.656c0.31-0.282,0.551-0.631,0.725-1.046c0.173-0.415,0.26-0.877,0.26-1.388
		c0-0.483-0.103-0.918-0.308-1.306S22.375,45.018,22.042,44.744z M21.42,48.073c-0.101,0.278-0.232,0.494-0.396,0.649
		c-0.164,0.155-0.344,0.267-0.54,0.335c-0.196,0.068-0.395,0.103-0.595,0.103h-1.504v-3.992h1.23c0.419,0,0.756,0.066,1.012,0.198
		c0.255,0.132,0.453,0.296,0.595,0.492c0.141,0.196,0.234,0.401,0.28,0.615c0.045,0.214,0.068,0.403,0.068,0.567
		C21.57,47.451,21.52,47.795,21.42,48.073z"/>
	<path d="M31.954,45.4c-0.424-0.446-0.957-0.805-1.6-1.073s-1.388-0.403-2.235-0.403h-3.035V54h3.814
		c0.127,0,0.323-0.016,0.588-0.048c0.264-0.032,0.556-0.104,0.875-0.219c0.319-0.114,0.649-0.285,0.991-0.513
		s0.649-0.54,0.923-0.937s0.499-0.889,0.677-1.477s0.267-1.297,0.267-2.126c0-0.602-0.105-1.188-0.314-1.757
		C32.694,46.355,32.378,45.847,31.954,45.4z M30.758,51.73c-0.492,0.711-1.294,1.066-2.406,1.066h-1.627v-7.629h0.957
		c0.784,0,1.422,0.103,1.914,0.308s0.882,0.474,1.169,0.807s0.48,0.704,0.581,1.114c0.1,0.41,0.15,0.825,0.15,1.244
		C31.496,49.989,31.25,51.02,30.758,51.73z"/>
	<polygon points="35.598,54 37.266,54 37.266,49.461 41.477,49.461 41.477,48.34 37.266,48.34 37.266,45.168 41.9,45.168 
		41.9,43.924 35.598,43.924 	"/>
	<path d="M38.428,22.961c-0.919,0-2.047,0.12-3.358,0.358c-1.83-1.942-3.74-4.778-5.088-7.562c1.337-5.629,0.668-6.426,0.373-6.802
		c-0.314-0.4-0.757-1.049-1.261-1.049c-0.211,0-0.787,0.096-1.016,0.172c-0.576,0.192-0.886,0.636-1.134,1.215
		c-0.707,1.653,0.263,4.471,1.261,6.643c-0.853,3.393-2.284,7.454-3.788,10.75c-3.79,1.736-5.803,3.441-5.985,5.068
		c-0.066,0.592,0.074,1.461,1.115,2.242c0.285,0.213,0.619,0.326,0.967,0.326h0c0.875,0,1.759-0.67,2.782-2.107
		c0.746-1.048,1.547-2.477,2.383-4.251c2.678-1.171,5.991-2.229,8.828-2.822c1.58,1.517,2.995,2.285,4.211,2.285
		c0.896,0,1.664-0.412,2.22-1.191c0.579-0.811,0.711-1.537,0.39-2.16C40.943,23.327,39.994,22.961,38.428,22.961z M20.536,32.634
		c-0.468-0.359-0.441-0.601-0.431-0.692c0.062-0.556,0.933-1.543,3.07-2.744C21.555,32.19,20.685,32.587,20.536,32.634z
		 M28.736,9.712c0.043-0.014,1.045,1.101,0.096,3.216C27.406,11.469,28.638,9.745,28.736,9.712z M26.669,25.738
		c1.015-2.419,1.959-5.09,2.674-7.564c1.123,2.018,2.472,3.976,3.822,5.544C31.031,24.219,28.759,24.926,26.669,25.738z
		 M39.57,25.259C39.262,25.69,38.594,25.7,38.36,25.7c-0.533,0-0.732-0.317-1.547-0.944c0.672-0.086,1.306-0.108,1.811-0.108
		c0.889,0,1.052,0.131,1.175,0.197C39.777,24.916,39.719,25.05,39.57,25.259z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
<div>
                          <p style={{ marginBottom: "0px" }}>PDF Print</p>
                          <span
                            style={{
                              fontSize: "12px"
                            }}
                          >
                            Chất lượng ảnh cao, nhiều trang
                          </span>
                          </div>
                        </button>
                      </li>
                      <li style={{
                        boxShadow: 'rgba(55, 53, 47, 0.09) 0px 1px 0px',
                        marginBottom: '1px',
                      }}>
                        <button
                          onClick={this.downloadVideo.bind(this)}
                          style={{
                            width: "100%",
                            border: "none",
                            textAlign: "left",
                            padding: "5px 12px",
                            display: "flex",
                          }}
                        >
                          <svg style={{width: '35px', marginRight: '10px',}} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 58 58" xmlSpace="preserve">
<g>
	<path d="M50.95,12.187l-0.77-0.77l0,0L40.084,1.321c0,0-0.001-0.001-0.002-0.001l-0.768-0.768C38.965,0.201,38.48,0,37.985,0H8.963
		C7.777,0,6.5,0.916,6.5,2.926V39v16.537V56c0,0.838,0.843,1.654,1.839,1.91c0.05,0.013,0.097,0.032,0.148,0.042
		C8.644,57.983,8.803,58,8.963,58h40.074c0.16,0,0.319-0.017,0.475-0.048c0.051-0.01,0.098-0.029,0.148-0.042
		C50.657,57.654,51.5,56.838,51.5,56v-0.463V39V13.978C51.5,13.213,51.408,12.646,50.95,12.187z M42.5,21c0,7.168-5.832,13-13,13
		s-13-5.832-13-13s5.832-13,13-13c2.898,0,5.721,0.977,8,2.76V13v1h1h1.948C41.792,16.093,42.5,18.502,42.5,21z M40.981,12H39.5
		v-1.717V3.565L47.935,12H40.981z M8.963,56c-0.071,0-0.135-0.025-0.198-0.049C8.609,55.876,8.5,55.72,8.5,55.537V41h41v14.537
		c0,0.183-0.109,0.339-0.265,0.414C49.172,55.975,49.108,56,49.037,56H8.963z M8.5,39V2.926C8.5,2.709,8.533,2,8.963,2h28.595
		C37.525,2.126,37.5,2.256,37.5,2.392v5.942C35.115,6.826,32.342,6,29.5,6c-8.271,0-15,6.729-15,15s6.729,15,15,15s15-6.729,15-15
		c0-2.465-0.607-4.849-1.749-7h6.357c0.135,0,0.264-0.025,0.39-0.058c0,0.014,0.001,0.02,0.001,0.036V39H8.5z"/>
	<polygon points="20.42,50.814 17.426,43.924 15.758,43.924 15.758,54 17.426,54 17.426,47.068 19.695,52.674 21.145,52.674 
		23.4,47.068 23.4,54 25.068,54 25.068,43.924 23.4,43.924 	"/>
	<path d="M32.868,44.744c-0.333-0.273-0.709-0.479-1.128-0.615c-0.419-0.137-0.843-0.205-1.271-0.205H27.57V54h1.641v-3.637h1.217
		c0.528,0,1.012-0.077,1.449-0.232s0.811-0.374,1.121-0.656c0.31-0.282,0.551-0.631,0.725-1.046c0.173-0.415,0.26-0.877,0.26-1.388
		c0-0.483-0.103-0.918-0.308-1.306S33.201,45.018,32.868,44.744z M32.246,48.073c-0.101,0.278-0.232,0.494-0.396,0.649
		s-0.344,0.267-0.54,0.335c-0.196,0.068-0.395,0.103-0.595,0.103h-1.504v-3.992h1.23c0.419,0,0.756,0.066,1.012,0.198
		c0.255,0.132,0.453,0.296,0.595,0.492c0.141,0.196,0.234,0.401,0.28,0.615c0.045,0.214,0.068,0.403,0.068,0.567
		C32.396,47.451,32.346,47.795,32.246,48.073z"/>
	<path d="M41.146,43.924h-1.668l-4.361,6.426v1.299h4.361V54h1.668v-2.352h1.053V50.35h-1.053V43.924z M39.479,50.35H36.58
		l2.898-4.512V50.35z"/>
	<path d="M37.037,20.156l-11-7c-0.308-0.195-0.698-0.208-1.019-0.033C24.699,13.299,24.5,13.635,24.5,14v14
		c0,0.365,0.199,0.701,0.519,0.877C25.169,28.959,25.334,29,25.5,29c0.187,0,0.374-0.053,0.537-0.156l11-7
		C37.325,21.66,37.5,21.342,37.5,21S37.325,20.34,37.037,20.156z M26.5,26.179V15.821L34.637,21L26.5,26.179z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
<div>
                          <p style={{ marginBottom: "4px" }}>Video</p>
                          <span
                            style={{
                              fontSize: "12px"
                            }}
                          >
                            MP4
                          </span>
                          </div>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {Globals.serviceUser &&
                Globals.serviceUser.username &&
                Globals.serviceUser.username === adminEmail && (
                  <a
                    onClick={e => {
                      e.preventDefault();
                      this.setState({ showPrintingSidebar: true });
                    }}
                    href="#"
                    style={{
                      float: "right",
                      color: "white",
                      backgroundColor: "#00000070",
                      marginTop: "4px",
                      marginRight: "6px",
                      padding: "5px",
                      borderRadius: "4px",
                      textDecoration: "none",
                      fontSize: "13px"
                    }}
                  >
                    {" "}
                    In ấn
                  </a>
                )}
            </div>
          </div>
          <div
            className="wrapper"
            style={{
              top: "55px",
              width: `100%`,
              height: "calc(100% - 55px)",
              display: "flex",
              overflow: 'hidden',
            }}
          >
            <LeftSide
              mounted={this.state.mounted}
              dragging={this.state.dragging}
              subtype={this.state.subtype}
              fonts={this.props.fonts}
              fontsList={this.props.fontsList}
              selectFont={this.selectFont.bind(this)}
              handleFontColorChange={this.handleFontColorChange.bind(this)}
              typeObjectSelected={this.state.typeObjectSelected}
              images={this.props.images}
              upperZIndex={this.props.store.upperZIndex}
              idObjectSelected={this.state.idObjectSelected}
              childId={this.state.childId}
              pages={this.state.pages}
              rectWidth={this.state.rectWidth}
              rectHeight={this.state.rectHeight}
              activePageId={this.state.activePageId}
              addItem={this.props.addItem}
              addFontItem={this.props.addFontItem}
              toolbarOpened={this.state.toolbarOpened}
              toolbarSize={this.state.toolbarSize}
              mode={this.state.mode}
              scale={this.state.scale}
              selectedTab={this.state.selectedTab}
              handleSidebarSelectorClicked={this.handleSidebarSelectorClicked}
              increaseUpperzIndex={this.props.increaseUpperzIndex}
            />
            <div
              style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 2px 0px",
                transitionDuration: "0.1s, 0.1s",
                width: `calc(100% - ${(this.state.toolbarOpened
                  ? this.state.toolbarSize
                  : 80) + (this.state.showPrintingSidebar ? 330 : 0)}px)`,
                // left: `${
                //   this.state.toolbarOpened ? this.state.toolbarSize - 2 : 80
                // }px`,
                backgroundColor: '#ECF0F2',
                position: 'relative',
                height: '100%',
              }}
              ref={this.setAppRef}
              id="screens"
              onScroll={this.handleScroll}
              onWheel={this.handleWheel}
            >
              {this.state.toolbarOpened && (
                <button
                  onClick={e => {
                    this.setState({ toolbarOpened: false });
                  }}
                >
                  <svg
                    viewBox="0 0 32 112"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      height: "120px",
                      zIndex: 1,
                      top: "43%",
                      position: "absolute",
                      left: "-18px"
                    }}
                  >
                    <path
                      d="M22.626 17.865l-1.94-1.131C17.684 14.981 16 12.608 16 10.133V0H0v112h16v-10.135c0-2.475 1.684-4.849 4.686-6.6l1.94-1.131C28.628 90.632 32 85.885 32 80.934v-49.87c0-4.95-3.372-9.698-9.374-13.199"
                      fill="#293039"
                    ></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={12}
                    height={12}
                    viewBox="0 0 12 12"
                    style={{
                      width: "20px",
                      fill: "#293039",
                      height: "20px",
                      stroke: "currentcolor",
                      strokeLinecap: "round",
                      strokeWidth: "1px",
                      top: "49.9%",
                      left: "-5px",
                      position: "absolute",
                      zIndex: 2
                    }}
                  >
                    <path
                      fill="#293039"
                      stroke="white"
                      strokeLinecap="round"
                      strokeWidth="1.25"
                      d="M7 3.17L4.88 5.3a1 1 0 0 0 0 1.42L7 8.83"
                      style={{ strokeWidth: "0.5px" }}
                    />
                  </svg>
                </button>
              )}

              <div
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  zIndex: 123123123,
                  boxShadow: "0 1px 0 rgba(14,19,24,.15)",
                  display: "inline-flex",
                  position: "absolute",
                  right: 0,
                  left: "1px",
                  height: "46px",
                  padding: "10px",
                  marginBottom: "10px"
                }}
              >
                {((this.state.idObjectSelected &&
                  this.props.images.find(
                    img => img._id === this.state.idObjectSelected
                  ).type === TemplateType.Heading) ||
                  (this.state.idObjectSelected &&
                    this.props.images.find(
                      img => img._id === this.state.idObjectSelected
                    ).type === TemplateType.Latex) ||
                  this.state.childId) && (
                  <a
                    href="#"
                    style={{
                      position: "relative",
                      borderRadius: "4px",
                      padding: "3px",
                      paddingBottom: "0px",
                      marginRight: "6px",
                      display: "inline-block",
                      cursor: "pointer",
                      color: "black"
                    }}
                    onClick={e => {
                      e.preventDefault();
                      this.setState({ selectedTab: SidebarTab.Color });
                    }}
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
                        backgroundColor: this.state.fontColor
                      }}
                    ></div>
                  </a>
                )}
                {((this.state.idObjectSelected &&
                  this.props.images.find(
                    img => img._id === this.state.idObjectSelected
                  ).type === TemplateType.Heading) ||
                  this.state.childId) && (
                  <a
                    href="#"
                    className="toolbar-btn"
                    style={{
                      borderRadius: "4px",
                      padding: "3px",
                      paddingBottom: "0px",
                      marginRight: "6px",
                      display: "inline-block",
                      cursor: "pointer",
                      color: "black"
                    }}
                    onClick={e => {
                      e.preventDefault();
                      var a = document.getSelection();
                      if (a && a.type === "Range") {
                        document.execCommand("italic");
                      } else {
                        var childId = this.state.childId
                          ? this.state.childId
                          : this.state.idObjectSelected;
                        var el = this.state.childId
                          ? document.getElementById(childId)
                          : document
                              .getElementById(childId)
                              .getElementsByClassName("text")[0];
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
                )}
                {((this.state.idObjectSelected &&
                  this.props.images.find(
                    img => img._id === this.state.idObjectSelected
                  ).type === TemplateType.Heading) ||
                  this.state.childId) && (
                  <a
                    href="#"
                    className="toolbar-btn"
                    style={{
                      borderRadius: "4px",
                      padding: "3px",
                      paddingBottom: "0px",
                      marginRight: "6px",
                      display: "inline-block",
                      cursor: "pointer",
                      color: "black"
                    }}
                    onClick={e => {
                      e.preventDefault();
                      var a = document.getSelection();
                      if (a && a.type === "Range") {
                        document.execCommand("bold");
                      } else {
                        var childId = this.state.childId
                          ? this.state.childId
                          : this.state.idObjectSelected;
                        var el = this.state.childId
                          ? document.getElementById(childId)
                          : document
                              .getElementById(childId)
                              .getElementsByClassName("text")[0];
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
                )}
                {((this.state.idObjectSelected &&
                  this.props.images.find(
                    img => img._id === this.state.idObjectSelected
                  ).type === TemplateType.Heading) ||
                  this.state.childId) && (
                  <a
                    href="#"
                    className="toolbar-btn"
                    onClick={this.onClickDropDownFontList}
                    style={{
                      borderRadius: "4px",
                      padding: "3px",
                      paddingBottom: "0px",
                      marginRight: "6px",
                      display: "inline-block",
                      cursor: "pointer",
                      color: "black",
                      position: 'relative',
                    }}
                  >
                    <img
                      style={{ height: "21px", filter: "invert(1)" }}
                      src={this.state.fontName}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" 
                      style={{
                        pointerEvents: 'none',
                        position: 'absolute',
                        right: '10px',
                        top: '4px',
                      }}
                      ><path fill="currentColor" d="M11.71 6.47l-3.53 3.54c-.1.1-.26.1-.36 0L4.3 6.47a.75.75 0 1 0-1.06 1.06l3.53 3.54c.69.68 1.8.68 2.48 0l3.53-3.54a.75.75 0 0 0-1.06-1.06z"></path></svg>
                  </a>
                )}
                {this.state.idObjectSelected &&
                  this.props.images.find(
                    img => img._id === this.state.idObjectSelected
                  ).type === TemplateType.Image && (
                    <div
                      style={{
                        position: "relative"
                      }}
                    >
                      {!this.state.cropMode && (
                        <button
                          style={{
                            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                            height: "26px",
                            top: 0
                          }}
                          className="dropbtn-font dropbtn-font-size"
                          onClick={e => {
                            this.setState({ cropMode: true });
                          }}
                        >
                          <svg
                            style={{ width: "15px", height: "15px" }}
                            version="1.1"
                            id="Capa_1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            x="0px"
                            y="0px"
                            width="475.078px"
                            height="475.078px"
                            viewBox="0 0 475.078 475.078"
                            xmlSpace="preserve"
                          >
                            <g>
                              <path
                                d="M465.948,328.897h-63.953V85.936l70.517-70.233c1.711-1.903,2.566-4.089,2.566-6.565c0-2.478-0.855-4.665-2.566-6.567
		C470.609,0.859,468.419,0,465.948,0c-2.478,0-4.668,0.855-6.57,2.57l-70.237,70.521H146.18V9.137c0-2.667-0.855-4.858-2.57-6.567
		C141.897,0.859,139.71,0,137.042,0H82.227c-2.665,0-4.858,0.855-6.567,2.57c-1.711,1.713-2.57,3.903-2.57,6.567v63.954H9.136
		c-2.666,0-4.856,0.854-6.567,2.568C0.859,77.372,0,79.562,0,82.226v54.818c0,2.666,0.855,4.856,2.568,6.565
		c1.714,1.711,3.905,2.57,6.567,2.57h63.954V392.86c0,2.666,0.855,4.856,2.57,6.561c1.713,1.711,3.903,2.573,6.567,2.573h246.678
		v63.953c0,2.663,0.855,4.854,2.566,6.564c1.708,1.711,3.898,2.566,6.57,2.566h54.816c2.666,0,4.856-0.855,6.563-2.566
		c1.712-1.711,2.574-3.901,2.574-6.564v-63.953h63.953c2.662,0,4.853-0.862,6.56-2.573c1.712-1.704,2.567-3.895,2.567-6.561v-54.819
		c0-2.669-0.855-4.863-2.567-6.57C470.801,329.76,468.61,328.897,465.948,328.897z M146.18,146.174h169.881L146.18,316.054V146.174z
		 M328.904,328.897H159.026l169.878-169.88V328.897z"
                              />
                            </g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                            <g></g>
                          </svg>
                          <span style={{ marginLeft: "5px" }}>Cắt</span>
                        </button>
                      )}
                    </div>
                  )}
                {this.state.selectedImage && this.state.selectedImage.type === TemplateType.Image && this.state.selectedImage.backgroundColor && (
                    <div
                      style={{
                        position: "relative"
                      }}
                    >
                      <button
                        style={{
                          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                          height: "26px",
                          top: 0,
                          width: "27px",
                          backgroundColor: this.state.imgBackgroundColor
                        }}
                        className="dropbtn-font dropbtn-font-size"
                        onClick={e => {
                          this.setState({ selectedTab: SidebarTab.Color });
                        }}
                      ></button>
                    </div>
                  )}
                {/* {((this.state.idObjectSelected && this.props.images.find(img => img._id ===this.state.idObjectSelected).type === TemplateType.Heading) ||
                this.state.childId) &&               */}
                <div
                  style={{
                    position: "relative",
                    display:
                      (this.state.idObjectSelected &&
                        this.props.images.find(
                          img => img._id === this.state.idObjectSelected
                        ).type === TemplateType.Heading) ||
                      this.state.childId
                        ? "block"
                        : "none"
                  }}
                >
                  {/* <button
                  style={{
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    height: '26px',
                  }}
                  className="dropbtn-font dropbtn-font-size"
                  onClick={this.onClickDropDownFontSizeList.bind(this)}
                >
                  {Math.round(this.state.fontSize)}px
                </button> */}
                  <FontSize fontSize={this.state.fontSize} />
                  <div
                    style={{
                      height: "50px",
                      left: "0px",
                      top: "calc(100% + 8px)",
                      width: "100px",
                      padding: "0",
                      background: "white",
                      animation: 'bounce 1.2s ease-out',
                    }}
                    id="myFontSizeList"
                    className="dropdown-content-font-size"
                  >
                    <ul
                      style={{
                        listStyle: "none",
                        margin: 0,
                        width: "100%",
                        padding: 0
                      }}
                    >
                      <li>
                        <button
                          onClick={e => {
                            function insertAfter(newNode, referenceNode) {
                              referenceNode.parentNode.insertBefore(
                                newNode,
                                referenceNode.nextSibling
                              );
                            }

                            var scale = 6;
                            var a = document.getSelection();
                            if (a && a.type === "Range") {
                              document.execCommand("FontSize", false, "7");
                            } else {
                              var id = this.state.childId
                                ? this.state.childId
                                : this.state.idObjectSelected;
                              var el = this.state.childId
                                ? document.getElementById(id)
                                : document
                                    .getElementById(id)
                                    .getElementsByClassName("text")[0];
                              var sel = window.getSelection();
                              var range = document.createRange();
                              range.selectNodeContents(el);
                              sel.removeAllRanges();
                              sel.addRange(range);
                              document.execCommand("FontSize", false, "7");
                              sel.removeAllRanges();
                            }
                            var fonts = document.getElementsByTagName("font");
                            // console.log("fonts ", fonts);
                            for (var i = 0; i < fonts.length; ++i) {
                              var font = fonts[i];
                              var div = document.createElement("div");
                              div.className = "font";
                              div.style.fontSize = font.style.fontSize;
                              div.style.color = font.style.color;
                              div.innerText = font.innerText;

                              insertAfter(div, font);

                              font.remove();
                            }

                            this.setState({ fontSize: scale });
                          }}
                          className="fontsize-picker"
                          style={{
                            height: "30px",
                            width: "100%",
                            border: "none"
                          }}
                        >
                          6
                        </button>
                      </li>
                      <li>
                        <button
                          className="fontsize-picker"
                          style={{
                            height: "30px",
                            width: "100%",
                            border: "none"
                          }}
                        >
                          8
                        </button>
                      </li>
                    </ul>
                    {/* <p
                    style={{
                      display: 'inline-block',
                      margin: 0,
                      lineHeight: '36px',
                      width: '97px',
                      fontSize: '13px',
                    }}
                  >Kích cỡ chữ: </p>
                  <div style={{
                    display: 'flex', 
                    height: '4px', 
                    backgroundColor: 'black', 
                    borderRadius: '5px',
                    top: 0,
                    bottom: 0,
                    margin: 'auto',  
                    width: '100%',
                  }}>
                  <div 
                    id="myDropdownFontSize-2"
                    style={{
                      borderRadius: '5px',
                      width: '100%',
                    }}>
                  <div 
                      onMouseDown={(e) => {

                        function insertAfter(newNode, referenceNode) {
                          referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
                      }

                        e.preventDefault();
                        var self = this;
                        var rect = document.getElementById('myDropdownFontSize-2').getBoundingClientRect();
                        var left = rect.left;
                        var width = rect.width;
                        const onMove = (e) => {
                          var t0 = performance.now();
                          e.preventDefault();
                          var slide = e.pageX - left;
                          var scale = slide / width * 170;
                          scale = Math.max(1, scale)
                          scale = Math.min(165, scale);

                          var a = document.getSelection();
                          if (a && a.type === "Range") {
                            document.execCommand("FontSize", false, "7");
                          } else {
                            var id = this.state.childId ? this.state.childId : this.state.idObjectSelected;
                            var el = this.state.childId ? document.getElementById(id) : document.getElementById(id).getElementsByClassName('text')[0];
                            var sel = window.getSelection();
                            var range = document.createRange();
                            range.selectNodeContents(el);
                            sel.removeAllRanges();
                            sel.addRange(range);
                            document.execCommand("FontSize", false, "7");
                            sel.removeAllRanges();
                          }
                          var fonts = document.getElementsByTagName("font");
                          // console.log("fonts ", fonts);
                          for (var i = 0; i < fonts.length; ++i) {
                            var font = fonts[i];
                            var div = document.createElement("div");
                            div.style.fontSize = font.style.fontSize;
                            div.style.color = font.style.color;
                            div.innerText = font.innerText;

                            insertAfter(div, font);

                            font.remove();
                          }

                          this.setState({fontSize: scale});

                          var t1 = performance.now();
                          console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
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
                        left: this.state.fontSize / 1.7 + '%',
                        backgroundColor: '#5c5c5f',
                        width: '10px',
                        height: '10px',
                        borderRadius: '5px',
                        top: 0,
                        bottom: 0,
                        margin: 'auto',
                        position: 'absolute',
                      }}></div>
                      </div>
                    </div> */}
                  </div>
                </div>
                {/* } */}
                {((this.state.idObjectSelected &&
                  this.props.images.find(
                    img => img._id === this.state.idObjectSelected
                  ).type === TemplateType.Heading) ||
                  this.state.childId) && (
                  <a
                    href="#"
                    className="toolbar-btn"
                    onClick={e => {
                      e.preventDefault();
                      var a = document.getSelection();
                      if (a && a.type === "Range") {
                        document.execCommand("JustifyLeft", false, null);
                      } else {
                        var childId = this.state.childId
                          ? this.state.childId
                          : this.state.idObjectSelected;
                        var el = this.state.childId
                          ? document.getElementById(childId)
                          : document
                              .getElementById(childId)
                              .getElementsByClassName("text")[0];
                        var sel = window.getSelection();
                        var range = document.createRange();
                        range.selectNodeContents(el);
                        sel.removeAllRanges();
                        sel.addRange(range);
                        document.execCommand("JustifyLeft", false, null);
                        sel.removeAllRanges();
                      }
                    }}
                    style={{
                      borderRadius: "4px",
                      padding: "2px 3px 0px",
                      marginRight: "6px",
                      display: "inline-block",
                      cursor: "pointer",
                      color: "black"
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        fill-rule="evenodd"
                        d="M20.25 5.25a.75.75 0 1 1 0 1.5H3.75a.75.75 0 0 1 0-1.5h16.5zm0 4a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5h8.5zm0 4a.75.75 0 1 1 0 1.5H3.75a.75.75 0 1 1 0-1.5h16.5zm0 4a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5h8.5z"
                      ></path>
                    </svg>
                  </a>
                )}
                {((this.state.idObjectSelected &&
                  this.props.images.find(
                    img => img._id === this.state.idObjectSelected
                  ).type === TemplateType.Heading) ||
                  this.state.childId) && (
                  <a
                    href="#"
                    className="toolbar-btn"
                    onClick={e => {
                      e.preventDefault();
                      var a = document.getSelection();
                      if (a && a.type === "Range") {
                        document.execCommand("JustifyCenter", false, null);
                      } else {
                        var childId = this.state.childId
                          ? this.state.childId
                          : this.state.idObjectSelected;
                        var el = this.state.childId
                          ? document.getElementById(childId)
                          : document
                              .getElementById(childId)
                              .getElementsByClassName("text")[0];
                        var sel = window.getSelection();
                        var range = document.createRange();
                        range.selectNodeContents(el);
                        sel.removeAllRanges();
                        sel.addRange(range);
                        document.execCommand("JustifyCenter", false, null);
                        sel.removeAllRanges();
                      }
                    }}
                    style={{
                      borderRadius: "4px",
                      padding: "2px 3px 0px",
                      marginRight: "6px",
                      display: "inline-block",
                      cursor: "pointer",
                      color: "black"
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        fill-rule="evenodd"
                        d="M3.75 5.25h16.5a.75.75 0 1 1 0 1.5H3.75a.75.75 0 0 1 0-1.5zm4 4h8.5a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5zm-4 4h16.5a.75.75 0 1 1 0 1.5H3.75a.75.75 0 1 1 0-1.5zm4 4h8.5a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5z"
                      ></path>
                    </svg>
                  </a>
                )}
                {((this.state.idObjectSelected &&
                  this.props.images.find(
                    img => img._id === this.state.idObjectSelected
                  ).type === TemplateType.Heading) ||
                  this.state.childId) && (
                  <a
                    href="#"
                    className="toolbar-btn"
                    onClick={e => {
                      e.preventDefault();
                      var a = document.getSelection();
                      if (a && a.type === "Range") {
                        document.execCommand("JustifyRight", false, null);
                      } else {
                        var childId = this.state.childId
                          ? this.state.childId
                          : this.state.idObjectSelected;
                        var el = this.state.childId
                          ? document.getElementById(childId)
                          : document
                              .getElementById(childId)
                              .getElementsByClassName("text")[0];
                        var sel = window.getSelection();
                        var range = document.createRange();
                        range.selectNodeContents(el);
                        sel.removeAllRanges();
                        sel.addRange(range);
                        document.execCommand("JustifyRight", false, null);
                        sel.removeAllRanges();
                      }
                    }}
                    style={{
                      borderRadius: "4px",
                      padding: "2px 3px 0px",
                      marginRight: "6px",
                      display: "inline-block",
                      cursor: "pointer",
                      color: "black"
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <defs>
                        <path
                          id="_3487901159__a"
                          d="M3.75 5.25h16.5a.75.75 0 1 1 0 1.5H3.75a.75.75 0 0 1 0-1.5zm0 4h8.5a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5zm0 4h16.5a.75.75 0 1 1 0 1.5H3.75a.75.75 0 1 1 0-1.5zm0 4h8.5a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5z"
                        ></path>
                      </defs>
                      <use
                        fill="currentColor"
                        xlinkHref="#_3487901159__a"
                        fill-rule="evenodd"
                      ></use>
                    </svg>
                  </a>
                )}
                {this.state.cropMode && (
                  <button
                    className="toolbar-btn dropbtn-font"
                    onClick={e => {
                      this.setState({ cropMode: false });
                    }}
                    style={{
                      display: "flex"
                    }}
                  >
                    Ok
                  </button>
                )}
                {this.state.cropMode && (
                  <button
                    className="toolbar-btn dropbtn-font"
                    onClick={this.downloadPDF.bind(this)}
                    style={{
                      display: "flex"
                    }}
                  >
                    Cancel
                  </button>
                )}
                {this.state.idObjectSelected && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      display: "flex"
                    }}
                  >
                    <button
                      className="toolbar-btn dropbtn-font"
                      onClick={this.onClickpositionList.bind(this)}
                      style={{
                        display: "flex",
                        fontSize: "16px"
                      }}
                    >
                      Vị trí
                    </button>
                    <button
                      style={{
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                        height: "26px",
                        width: "30px",
                        padding: 0,
                      }}
                      className="dropbtn-font dropbtn-font-size"
                      onClick={this.onClickTransparent.bind(this)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <g fill="currentColor" fill-rule="evenodd">
                          <path d="M3 2h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z"></path>
                          <path
                            d="M11 2h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z"
                            opacity=".45"
                          ></path>
                          <path
                            d="M19 2h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z"
                            opacity=".15"
                          ></path>
                          <path
                            d="M7 6h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z"
                            opacity=".7"
                          ></path>
                          <path
                            d="M15 6h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z"
                            opacity=".3"
                          ></path>
                        </g>
                      </svg>
                    </button>
                    <div
                      id="myPositionList"
                      style={{
                        right: "10px",
                        backgroundColor: "white",
                        animation: 'bounce 1.2s ease-out',
                      }}
                      className="dropdown-content-font-size"
                    >
                      <div style={{ display: "flex" }}>
                        <div
                          id="myDropdownFontSize-2"
                          style={{
                            borderRadius: "5px",
                            padding: "10px"
                          }}
                        >
                          <button
                            style={{
                              padding: "6px",
                              border: "none",
                              backgroundColor: "#eee",
                              borderRadius: "3px",
                              marginRight: "10px",
                              width: "135px"
                            }}
                            onClick={this.forwardSelectedObject}
                          >
                            <svg
                              style={{
                                marginBottom: "-8px",
                                marginRight: "6px"
                              }}
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M12.75 5.82v8.43a.75.75 0 1 1-1.5 0V5.81L8.99 8.07A.75.75 0 1 1 7.93 7l2.83-2.83a1.75 1.75 0 0 1 2.47 0L16.06 7A.75.75 0 0 1 15 8.07l-2.25-2.25zM15 10.48l6.18 3.04a1 1 0 0 1 0 1.79l-7.86 3.86a3 3 0 0 1-2.64 0l-7.86-3.86a1 1 0 0 1 0-1.8L9 10.49v1.67L4.4 14.4l6.94 3.42c.42.2.9.2 1.32 0l6.94-3.42-4.6-2.26v-1.67z"
                              ></path>
                            </svg>
                            <span style={{ lineHeight: "24px" }}>Lên trên</span>
                          </button>
                          <button
                            style={{
                              padding: "6px",
                              border: "none",
                              backgroundColor: "#eee",
                              borderRadius: "3px",
                              width: "135px"
                            }}
                            onClick={this.backwardSelectedObject}
                          >
                            <svg
                              style={{
                                marginBottom: "-8px",
                                marginRight: "6px"
                              }}
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M12.75 18.12V9.75a.75.75 0 1 0-1.5 0v8.37l-2.26-2.25a.75.75 0 0 0-1.06 1.06l2.83 2.82c.68.69 1.79.69 2.47 0l2.83-2.82A.75.75 0 0 0 15 15.87l-2.25 2.25zM15 11.85v1.67l6.18-3.04a1 1 0 0 0 0-1.79l-7.86-3.86a3 3 0 0 0-2.64 0L2.82 8.69a1 1 0 0 0 0 1.8L9 13.51v-1.67L4.4 9.6l6.94-3.42c.42-.2.9-.2 1.32 0L19.6 9.6 15 11.85z"
                              ></path>
                            </svg>
                            <span style={{ lineHeight: "24px" }}>
                              Xuống dưới
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        height: "50px",
                        right: "10px",
                        position: "absolute",
                        marginTop: "-9px",
                        width: "350px",
                        padding: "10px 20px",
                        background: "white",
                        animation: 'bounce 1.2s ease-out',
                      }}
                      id="myTransparent"
                      className="dropdown-content-font-size"
                    >
                      <p
                        style={{
                          display: "inline-block",
                          margin: 0,
                          lineHeight: "30px",
                          width: "146px",
                          fontSize: "12px"
                        }}
                      >
                        Mức trong suốt:{" "}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          height: "4px",
                          backgroundColor: "black",
                          borderRadius: "5px",
                          top: 0,
                          bottom: 0,
                          margin: "auto",
                          width: "100%"
                        }}
                      >
                        <div
                          id="myOpacity-3"
                          style={{
                            borderRadius: "5px",
                            width: "100%"
                          }}
                        >
                          <div
                            onMouseDown={e => {
                              e.preventDefault();
                              var self = this;
                              const onMove = e => {
                                e.preventDefault();
                                var rec1 = document
                                  .getElementById("myOpacity-3")
                                  .getBoundingClientRect();
                                var rec2 = document.getElementById(
                                  "myOpacity-3slider"
                                );
                                var slide = e.pageX - rec1.left;
                                var scale = (slide / rec1.width) * 100;
                                console.log("scale ", scale, slide, rec1.width);
                                scale = Math.max(1, scale);
                                scale = Math.min(100, scale);

                                console.log("scale ", scale);

                                this.setState({ currentOpacity: scale });

                                this.handleOpacityChange.bind(this)(scale);
                              };

                              const onUp = e => {
                                e.preventDefault();
                                document.removeEventListener(
                                  "mousemove",
                                  onMove
                                );
                                document.removeEventListener("mouseup", onUp);
                              };

                              document.addEventListener("mousemove", onMove);
                              document.addEventListener("mouseup", onUp);
                            }}
                            id="myOpacity-3slider"
                            style={{
                              left: this.state.currentOpacity - 3 + "%",
                              backgroundColor: "#5c5c5f",
                              width: "10px",
                              height: "10px",
                              borderRadius: "5px",
                              top: 0,
                              bottom: 0,
                              margin: "auto",
                              position: "absolute"
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div
                onScroll={this.handleScroll2.bind(this)}
                id="screen-container-parent"
                onClick={e => {
                  if (
                    !cropMode &&
                    (e.target as Element).id === "screen-container-parent"
                  ) {
                    this.doNoObjectSelected();
                    e.stopPropagation();
                  }
                }}
                style={{
                  top: "46px",
                  overflow: "scroll",
                  alignItems: "center",
                  display: "flex",
                  position: "absolute",
                  width: "100%",
                  height: "calc(100% - 46px)",
                  backgroundColor:
                    this.state.cropMode && "rgba(14, 19, 24, 0.2)"
                }}
              >
                {this.state.mounted && <div
                  id="screen-container"
                  className="screen-container"
                  style={{
                    width: rectWidth * scale + 40 + "px",
                    height: rectHeight * scale + 40 + "px",
                    margin: "auto",
                    right: 0,
                    left: 0,
                    top: 0,
                    bottom: 0,
                    padding: "0 20px"
                  }}
                  ref={this.setContainerRef}
                  onClick={e => {
                    if ((e.target as Element).id === "screen-container") {
                      this.doNoObjectSelected();
                    }
                  }}
                >
                  {this.renderCanvas(false, -1)}
                </div>}
                <div
                  style={{
                    position: "fixed",
                    bottom: "5px",
                    right: `${5 +
                      (this.state.showPrintingSidebar ? 330 : 0)}px`,
                    zIndex: 99999999
                  }}
                >
                  {this.state.showZoomPopup && (
                    <div style={{}}>
                      <ul
                        style={{
                          borderRadius: "5px",
                          padding: "5px",
                          listStyle: "none",
                          marginBottom: "5px",
                          background: "#293039"
                        }}
                        className="zoomPercentPanel___2ZfEJ"
                      >
                        <li className="zoomPercentPanelItem___29ZfQ">
                          <button
                            onClick={e => {
                              this.setState({ scale: 3, showZoomPopup: false });
                            }}
                            style={{
                              width: "100%",
                              color: "white",
                              border: "none"
                            }}
                            className="scaleListButton___GEm7w"
                            data-categ="tools"
                            data-value="scalePercent_300"
                            data-subcateg="bottomPanel"
                          >
                            300%
                          </button>
                        </li>
                        <li className="zoomPercentPanelItem___29ZfQ">
                          <button
                            onClick={e => {
                              this.setState({ scale: 2, showZoomPopup: false });
                            }}
                            style={{
                              width: "100%",
                              color: "white",
                              border: "none"
                            }}
                            className="scaleListButton___GEm7w"
                            data-categ="tools"
                            data-value="scalePercent_200"
                            data-subcateg="bottomPanel"
                          >
                            200%
                          </button>
                        </li>
                        <li className="zoomPercentPanelItem___29ZfQ">
                          <button
                            onClick={e => {
                              this.setState({
                                scale: 1.75,
                                showZoomPopup: false
                              });
                            }}
                            style={{
                              width: "100%",
                              color: "white",
                              border: "none"
                            }}
                            className="scaleListButton___GEm7w"
                            data-categ="tools"
                            data-value="scalePercent_175"
                            data-subcateg="bottomPanel"
                          >
                            175%
                          </button>
                        </li>
                        <li className="zoomPercentPanelItem___29ZfQ">
                          <button
                            onClick={e => {
                              this.setState({
                                scale: 1.5,
                                showZoomPopup: false
                              });
                            }}
                            style={{
                              width: "100%",
                              color: "white",
                              border: "none"
                            }}
                            className="scaleListButton___GEm7w"
                            data-categ="tools"
                            data-value="scalePercent_150"
                            data-subcateg="bottomPanel"
                          >
                            150%
                          </button>
                        </li>
                        <li className="zoomPercentPanelItem___29ZfQ">
                          <button
                            onClick={e => {
                              this.setState({
                                scale: 1.25,
                                showZoomPopup: false
                              });
                            }}
                            style={{
                              width: "100%",
                              color: "white",
                              border: "none"
                            }}
                            className="scaleListButton___GEm7w"
                            data-categ="tools"
                            data-value="scalePercent_125"
                            data-subcateg="bottomPanel"
                          >
                            125%
                          </button>
                        </li>
                        <li className="zoomPercentPanelItem___29ZfQ">
                          <button
                            onClick={e => {
                              this.setState({ scale: 1, showZoomPopup: false });
                            }}
                            style={{
                              width: "100%",
                              color: "white",
                              border: "none"
                            }}
                            className="scaleListButton___GEm7w"
                            data-categ="tools"
                            data-value="scalePercent_100"
                            data-subcateg="bottomPanel"
                          >
                            100%
                          </button>
                        </li>
                        <li className="zoomPercentPanelItem___29ZfQ">
                          <button
                            onClick={e => {
                              this.setState({
                                scale: 0.75,
                                showZoomPopup: false
                              });
                            }}
                            style={{
                              width: "100%",
                              color: "white",
                              border: "none"
                            }}
                            className="scaleListButton___GEm7w"
                            data-categ="tools"
                            data-value="scalePercent_75"
                            data-subcateg="bottomPanel"
                          >
                            75%
                          </button>
                        </li>
                        <li className="zoomPercentPanelItem___29ZfQ">
                          <button
                            onClick={e => {
                              this.setState({
                                scale: 0.5,
                                showZoomPopup: false
                              });
                            }}
                            style={{
                              width: "100%",
                              color: "white",
                              border: "none"
                            }}
                            className="scaleListButton___GEm7w"
                            data-categ="tools"
                            data-value="scalePercent_50"
                            data-subcateg="bottomPanel"
                          >
                            50%
                          </button>
                        </li>
                        <li className="zoomPercentPanelItem___29ZfQ">
                          <button
                            onClick={e => {
                              this.setState({
                                scale: 0.25,
                                showZoomPopup: false
                              });
                            }}
                            style={{
                              width: "100%",
                              color: "white",
                              border: "none"
                            }}
                            className="scaleListButton___GEm7w"
                            data-categ="tools"
                            data-value="scalePercent_25"
                            data-subcateg="bottomPanel"
                          >
                            25%
                          </button>
                        </li>
                        <li className="zoomPercentPanelItem___29ZfQ">
                          <button
                            onClick={e => {
                              this.setState({
                                scale: 0.1,
                                showZoomPopup: false
                              });
                            }}
                            style={{
                              width: "100%",
                              color: "white",
                              border: "none"
                            }}
                            className="scaleListButton___GEm7w"
                            data-categ="tools"
                            data-value="scalePercent_10"
                            data-subcateg="bottomPanel"
                          >
                            10%
                          </button>
                        </li>
                        <li className="zoomPercentPanelItem___29ZfQ">
                          <button
                            onClick={e => {
                              this.setState({
                                scale: this.state.fitScale,
                                showZoomPopup: false
                              });
                            }}
                            style={{
                              width: "100%",
                              color: "white",
                              border: "none"
                            }}
                            className="scaleListButton___GEm7w scaleListButtonActive___2GxqI"
                            data-categ="tools"
                            data-value="scaleToFit"
                            data-subcateg="bottomPanel"
                          >
                            Fit
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                  {
                    this.state.mounted &&
                  <div
                    className="workSpaceBottomPanel___73_jE"
                    data-bubble="false"
                  >
                    <div className="workSpaceButtons___f6jkZ">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          boxShadow:
                            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                          background: "#293039",
                          borderRadius: "5px"
                        }}
                        className="zoom___21DG8"
                      >
                        <button
                          onClick={e => {
                            if (this.state.scale - 0.15 > 0.2) {
                              this.setState({ scale: this.state.scale - 0.15 });
                            }
                          }}
                          style={{ border: "none", background: "transparent" }}
                          className="zoomMinus___1Ooi5"
                          data-test="zoomMinus"
                          data-categ="tools"
                          data-value="zoomOut"
                          data-subcateg="bottomPanel"
                        >
                          <svg
                            style={{
                              width: '25px',
                              height: '25px',
                            }}
                            viewBox="0 0 18 18"
                            width="18"
                            height="18"
                            className="zoomSvg___1IAZj"
                          >
                            <path d="M17.6,16.92,14,13.37a8.05,8.05,0,1,0-.72.72l3.56,3.56a.51.51,0,1,0,.72-.72ZM1,8a7,7,0,1,1,12,5h0A7,7,0,0,1,1,8Z"></path>
                            <path d="M11.61,7.44H4.7a.5.5,0,1,0,0,1h6.91a.5.5,0,0,0,0-1Z"></path>
                          </svg>
                        </button>
                        <div className="zoomPercent___3286Z">
                          <button
                            onClick={e => {
                              var self = this;
                              this.setState({ showZoomPopup: true });
                              const onDownload = () => {
                                self.setState({ showZoomPopup: false });
                                document.removeEventListener(
                                  "click",
                                  onDownload
                                );
                              };
                              document.addEventListener("click", onDownload);
                            }}
                            style={{
                              height: '40px',
                              color: "white",
                              border: "none",
                              background: "transparent",
                              width: "55px",
                              fontSize: "18px",
                            }}
                            className="scaleListButton___GEm7w zoomMain___1z1vk"
                            data-zoom="true"
                            data-categ="tools"
                            data-value="zoomPanelOpen"
                            data-subcateg="bottomPanel"
                          >
                            {Math.round(this.state.scale * 100)}%
                          </button>
                        </div>
                        <button
                          onClick={e => {
                            this.setState({ scale: this.state.scale + 0.15 });
                          }}
                          style={{ 
                            border: "none", 
                            background: "transparent",
                            height: '40px',
                          }}
                          className="zoomPlus___1TbHD"
                          data-test="zoomPlus"
                          data-categ="tools"
                          data-value="zoomIn"
                          data-subcateg="bottomPanel"
                        >
                          <svg
                            style={{
                              width: '25px',
                              height: '25px',
                            }}
                            viewBox="0 0 18 18"
                            width="18"
                            height="18"
                            className="zoomSvg___1IAZj"
                          >
                            <path d="M17.6,16.92,14,13.37a8.05,8.05,0,1,0-.72.72l3.56,3.56a.51.51,0,1,0,.72-.72ZM13,13h0a7,7,0,1,1,2.09-5A7,7,0,0,1,13,13Z"></path>
                            <path d="M11.61,7.44h-3v-3a.5.5,0,1,0-1,0v3h-3a.5.5,0,1,0,0,1h3v3a.5.5,0,0,0,1,0v-3h3a.5.5,0,0,0,0-1Z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  }
                </div>
              </div>
            </div>
            {this.state.showPrintingSidebar && (
              <div
                style={{
                  width: "400px",
                  height: "100%",
                  right: 0,
                  position: "absolute"
                }}
              >
                <div>
                  <div
                    style={{
                      height: "46px"
                    }}
                  >
                    <div
                      className="pStkS_qIKsPoym6eCGnye"
                      style={{
                        padding: "10px",
                        display: "flex",
                        height: "46px",
                        borderBottom: "1px solid rgba(14,19,24,.15)",
                        justifyContent: "center"
                      }}
                    >
                      <div
                        className="_3I6bflXEnh4GRlVDlnzEap"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <span
                          style={{ marginRight: "5px" }}
                          className="_2JPeE-06cfszm35uzXEvgC _1tNfXgCCl_5Qt5kGxyM8c4"
                        >
                          <span
                            className="_2EacSGMxQyBD7pSwvfkZz3 _3l4uYr79jSRjggcw5QCp88"
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              display: "flex",
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              border: "12px solid transparent",
                              backgroundColor:
                                this.state.currentPrintStep >= 1
                                  ? "#6bca2c"
                                  : "#e7e7e7"
                            }}
                          >
                            <span>1</span>
                          </span>
                        </span>
                        <span
                          style={{ marginRight: "5px" }}
                          className="_2JPeE-06cfszm35uzXEvgC _2JAh8PyNfcg1Kun3J3uV1C"
                        >
                          <span
                            className="_2EacSGMxQyBD7pSwvfkZz3 _3l4uYr79jSRjggcw5QCp88"
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              display: "flex",
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              border: "12px solid transparent",
                              backgroundColor:
                                this.state.currentPrintStep >= 2
                                  ? "#6bca2c"
                                  : "#e7e7e7"
                            }}
                          >
                            <span>2</span>
                          </span>
                        </span>
                        <span
                          style={{ marginRight: "5px" }}
                          className="_2JPeE-06cfszm35uzXEvgC _2JAh8PyNfcg1Kun3J3uV1C"
                        >
                          <span
                            className="_2EacSGMxQyBD7pSwvfkZz3 _3l4uYr79jSRjggcw5QCp88"
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              display: "flex",
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              border: "12px solid transparent",
                              backgroundColor:
                                this.state.currentPrintStep >= 3
                                  ? "#6bca2c"
                                  : "#e7e7e7"
                            }}
                          >
                            <span>3</span>
                          </span>
                        </span>
                      </div>
                      <button
                        style={{
                          position: "absolute",
                          right: 0,
                          border: "none",
                          background: "transparent"
                        }}
                        onClick={() => {
                          this.setState({ showPrintingSidebar: false });
                        }}
                        className="_2Rww-JOL60obmcYkaUOyg_ Wqfq1nAfa6if4eEOr6Mza _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _3cIMyP4YPUpE0H8WXQ_r-B Wqfq1nAfa6if4eEOr6Mza _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _3QJ_C8Lg1l0m5aoIK5piST _2kK9hFUTyqtMKr5EG4GuY4 _3SyHP4HOoHraV3-PJsORT7"
                        type="button"
                      >
                        <span className="_3WuwevpUMOqhISoQUjDiY3">
                          <span className="_3K8w6l0jetB1VHftQo2qK6 _3riOXmq8mfDI5UGnLrweQh">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M13.06 12.15l5.02-5.03a.75.75 0 1 0-1.06-1.06L12 11.1 6.62 5.7a.75.75 0 1 0-1.06 1.06l5.38 5.38-5.23 5.23a.75.75 0 1 0 1.06 1.06L12 13.2l4.88 4.87a.75.75 0 1 0 1.06-1.06l-4.88-4.87z"
                              />
                            </svg>
                          </span>
                        </span>
                      </button>
                    </div>
                  </div>

                  {this.state.currentPrintStep == 1 && (
                    <div
                      style={{
                        padding: "16px 16px 0",
                        position: "relative",
                        height: "calc(100% - 46px)"
                      }}
                    >
                      {this.state.subtype == SubType.BusinessCardReview && (
                        <BusinessCardReview
                          firstPage={this.renderCanvas(true, 0)}
                          secondPage={this.renderCanvas(true, 1)}
                        ></BusinessCardReview>
                      )}
                      {this.state.subtype == SubType.FlyerReview && (
                        <FlyerReview>{this.renderCanvas(true, 0)}</FlyerReview>
                      )}
                      {this.state.subtype == SubType.PosterReview && (
                        <TrifoldReview>
                          {this.renderCanvas(true, 0)}
                        </TrifoldReview>
                      )}

                      {this.state.subtype == SubType.TrifoldReview && (
                        <PosterReview>
                          {this.renderCanvas(true, 0)}
                        </PosterReview>
                      )}
                      {this.state.subtype > SubType.TrifoldReview && (
                        <CanvasReview width={500} height={500}>
                          {this.renderCanvas(true, 0)}
                        </CanvasReview>
                      )}

                      <div
                        className="_3w96fDCkiF-cx4xtdHq8Eb"
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label className="_1YMus4Eu0cHYhxD8BF9bKk jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">
                          Kích thước
                        </label>
                        <div style={{ zIndex: 123123 }}>
                          <button
                            style={{
                              width: "100%",
                              backgroundColor: "white",
                              border: "none"
                            }}
                            type="button"
                            className="_2rbIxUjieDPNxaKim1eUOh _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2Nsx_KfExUOh-XOcjJewEf _3VMFhjcT1YTNCBfgY43AoL"
                          >
                            <span className="_11gYYV-YiJb7npRdslKTJX">
                              {" "}
                              <div className="_16jC4NpI5ci7-HVASqeSUU">A3</div>
                              <span className="_1Lb2Q2YFMHEYBIzodSJlY8 _1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={16}
                                  height={16}
                                  viewBox="0 0 16 16"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M11.71 6.47l-3.53 3.54c-.1.1-.26.1-.36 0L4.3 6.47a.75.75 0 1 0-1.06 1.06l3.53 3.54c.69.68 1.8.68 2.48 0l3.53-3.54a.75.75 0 0 0-1.06-1.06z"
                                  />
                                </svg>
                              </span>
                            </span>
                          </button>
                        </div>
                      </div>

                      <div
                        className="_3w96fDCkiF-cx4xtdHq8Eb"
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label className="_1YMus4Eu0cHYhxD8BF9bKk jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">
                          Thông tin khác:
                        </label>
                        <div style={{ zIndex: 123123 }}>
                          <button
                            style={{
                              width: "100%",
                              backgroundColor: "white",
                              border: "none"
                            }}
                            type="button"
                            className="_2rbIxUjieDPNxaKim1eUOh _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2Nsx_KfExUOh-XOcjJewEf _3VMFhjcT1YTNCBfgY43AoL"
                          >
                            <span className="_11gYYV-YiJb7npRdslKTJX">
                              {" "}
                              <div className="_16jC4NpI5ci7-HVASqeSUU">A3</div>
                              <span className="_1Lb2Q2YFMHEYBIzodSJlY8 _1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={16}
                                  height={16}
                                  viewBox="0 0 16 16"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M11.71 6.47l-3.53 3.54c-.1.1-.26.1-.36 0L4.3 6.47a.75.75 0 1 0-1.06 1.06l3.53 3.54c.69.68 1.8.68 2.48 0l3.53-3.54a.75.75 0 0 0-1.06-1.06z"
                                  />
                                </svg>
                              </span>
                            </span>
                          </button>
                        </div>
                      </div>

                      <div
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "column"
                        }}
                        className="_3YDCW8EBZnxTRa5xT7gtHk _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88"
                      >
                        <span
                          style={{
                            margin: "auto",
                            display: "inline-block",
                            padding: "14px",
                            backgroundColor: "rgb(107, 202, 44)",
                            borderRadius: "50%",
                            marginTop: "20px",
                            marginBottom: "20px"
                          }}
                          className="_17Olod74EUtMOOpeHSF9RO _3K8w6l0jetB1VHftQo2qK6 _3riOXmq8mfDI5UGnLrweQh"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M4.53 11.9L9 16.38 19.44 5.97a.75.75 0 0 1 1.06 1.06L9.53 17.97c-.3.29-.77.29-1.06 0l-5-5c-.7-.71.35-1.77 1.06-1.07z"
                            />
                          </svg>
                        </span>
                        <div className="fe5UvoRC9ZkGGo1SwMSHH">
                          <div className="YOoVgTXLDk_wFPeE7Lehj">
                            100% Đảm bảo hài lòng
                          </div>
                          <span className="_19yfLwKwDEYdDKh0ixOgNB _1YRea3--8x2Rm7RqKumWGQ">
                            Nếu bạn không hài lòng với món hàng bạn nhận được.
                            Chúng tôi sẽ làm nó hài lòng với bạn.{" "}
                            <a
                              href="https://support.canva.com/canva-print/print-customer-service-policy/print-customer-happiness-policy/"
                              target="_blank"
                              rel="noopener"
                            >
                              More
                            </a>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {this.state.currentPrintStep == 2 && (
                    <div
                      style={{
                        padding: "16px 16px 0",
                        position: "relative"
                      }}
                    >
                      <div
                        className="_3w96fDCkiF-cx4xtdHq8Eb"
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <form autoComplete="on">
                          <div className="_2WG0n1tF-Rc7mYLaZoDpdC">
                            <p className="_3H42by719pMs1V0_zCiGTG ">
                              Địa chỉ giao hàng
                            </p>
                          </div>
                          <label className="_1lAKgn_4JnKMAytI-mxfqp">
                            <p>Họ và tên:</p>
                            <input
                              className=""
                              type="text"
                              autoComplete="name"
                              placeholder="E.g. David Bowie"
                              name="name"
                              defaultValue="Manh Quynh Nguyen"
                              style={{
                                backgroundImage: 'url("data:image/png',
                                backgroundRepeat: "no-repeat",
                                backgroundAttachment: "scroll",
                                backgroundSize: "16px 18px",
                                backgroundPosition: "98% 50%"
                              }}
                            />
                          </label>
                          <label className="_1lAKgn_4JnKMAytI-mxfqp">
                            <p>Địa chỉ</p>
                            <input
                              className=""
                              type="tel"
                              autoComplete="tel"
                              name="tel"
                            />
                          </label>
                          <label className="_1lAKgn_4JnKMAytI-mxfqp">
                            <p>Tỉnh thành phố</p>
                            <input
                              className=""
                              type="text"
                              autoComplete="address-level2"
                              placeholder="E.g. Brooklyn"
                              name="address-level2"
                              defaultValue="Singapore"
                            />
                          </label>
                          <label className="_1lAKgn_4JnKMAytI-mxfqp">
                            <p>Quận / Huyện</p>
                            <div className="_3Tk7vFk3XB74DSjc-X114e fs-hide">
                              <div>
                                <button
                                  type="button"
                                  className="_2rbIxUjieDPNxaKim1eUOh _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2Nsx_KfExUOh-XOcjJewEf"
                                >
                                  <span className="_11gYYV-YiJb7npRdslKTJX">
                                    {" "}
                                    <div className="_16jC4NpI5ci7-HVASqeSUU">
                                      Singapore
                                    </div>
                                    <span className="_1Lb2Q2YFMHEYBIzodSJlY8 _1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={16}
                                        height={16}
                                        viewBox="0 0 16 16"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M11.71 6.47l-3.53 3.54c-.1.1-.26.1-.36 0L4.3 6.47a.75.75 0 1 0-1.06 1.06l3.53 3.54c.69.68 1.8.68 2.48 0l3.53-3.54a.75.75 0 0 0-1.06-1.06z"
                                        />
                                      </svg>
                                    </span>
                                  </span>
                                </button>
                              </div>
                              <div className="_1sk78p8Erqs7Wd-2IGk6E9">
                                <input
                                  className=""
                                  type="text"
                                  autoComplete="country"
                                  name="country"
                                />
                              </div>
                            </div>
                          </label>
                          <label className="_1lAKgn_4JnKMAytI-mxfqp">
                            <p className="">Số điện thoại</p>
                            <input
                              className=""
                              type="text"
                              autoComplete="postal-code"
                              placeholder="E.g. 11217"
                              name="postal-code"
                            />
                          </label>
                        </form>
                      </div>
                    </div>
                  )}

                  {this.state.currentPrintStep == 3 && (
                    <div
                      style={{
                        padding: "16px 16px 0",
                        position: "relative",
                        height: "calc(100% - 46px)"
                      }}
                    >
                      <div
                        className="_3w96fDCkiF-cx4xtdHq8Eb"
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <form autoComplete="on">
                          <div className="_2WG0n1tF-Rc7mYLaZoDpdC">
                            <p className="_3H42by719pMs1V0_zCiGTG ">
                              Xác nhận và thanh toán
                            </p>
                          </div>
                          <label className="_1lAKgn_4JnKMAytI-mxfqp">
                            <p>Full name</p>
                            <input
                              className=""
                              ref={i => (this.refFullName = i)}
                              type="text"
                              autoComplete="name"
                              placeholder="E.g. David Bowie"
                              name="name"
                              defaultValue="Manh Quynh Nguyen"
                              style={{
                                backgroundImage: 'url("data:image/png',
                                backgroundRepeat: "no-repeat",
                                backgroundAttachment: "scroll",
                                backgroundSize: "16px 18px",
                                backgroundPosition: "98% 50%"
                              }}
                            />
                          </label>
                          <label className="_1lAKgn_4JnKMAytI-mxfqp">
                            <p>Địa chỉ</p>
                            <input
                              ref={i => (this.refAddress = i)}
                              className=""
                              type="text"
                              autoComplete="text"
                              name="address"
                            />
                          </label>
                          <label className="_1lAKgn_4JnKMAytI-mxfqp">
                            <p>Contact number</p>
                            <input
                              className=""
                              ref={i => (this.refPhoneNumber = i)}
                              type="tel"
                              autoComplete="tel"
                              name="tel"
                            />
                          </label>
                          <label className="_1lAKgn_4JnKMAytI-mxfqp">
                            <p>City</p>
                            <input
                              className=""
                              ref={i => (this.refCity = i)}
                              type="text"
                              autoComplete="address-level2"
                              placeholder="E.g. Brooklyn"
                              name="address-level2"
                              defaultValue="Singapore"
                            />
                          </label>
                          <label className="_1lAKgn_4JnKMAytI-mxfqp">
                            <p>Country</p>
                            <div className="_3Tk7vFk3XB74DSjc-X114e fs-hide">
                              <div>
                                <button
                                  type="button"
                                  className="_2rbIxUjieDPNxaKim1eUOh _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2Nsx_KfExUOh-XOcjJewEf"
                                >
                                  <span className="_11gYYV-YiJb7npRdslKTJX">
                                    {" "}
                                    <div className="_16jC4NpI5ci7-HVASqeSUU">
                                      Singapore
                                    </div>
                                    <span className="_1Lb2Q2YFMHEYBIzodSJlY8 _1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={16}
                                        height={16}
                                        viewBox="0 0 16 16"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M11.71 6.47l-3.53 3.54c-.1.1-.26.1-.36 0L4.3 6.47a.75.75 0 1 0-1.06 1.06l3.53 3.54c.69.68 1.8.68 2.48 0l3.53-3.54a.75.75 0 0 0-1.06-1.06z"
                                        />
                                      </svg>
                                    </span>
                                  </span>
                                </button>
                              </div>
                              <div className="_1sk78p8Erqs7Wd-2IGk6E9">
                                <input
                                  className=""
                                  type="text"
                                  autoComplete="country"
                                  name="country"
                                />
                              </div>
                            </div>
                          </label>
                          <label className="_1lAKgn_4JnKMAytI-mxfqp">
                            <p className="">Postal code</p>
                            <input
                              className=""
                              type="text"
                              autoComplete="postal-code"
                              placeholder="E.g. 11217"
                              name="postal-code"
                            />
                          </label>
                        </form>
                      </div>
                    </div>
                  )}

                  <div
                    className="_2UsfVIk8gJrdw8z8BGlvm1"
                    style={{
                      padding: "16px",
                      position: "absolute",
                      bottom: "0",
                      flexDirection: "column",
                      width: "100%"
                    }}
                  >
                    <div
                      className="_2RWrXWDlIFqxW5c9NTv-se _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88"
                      style={{
                        margin: "8px 0",
                        justifyContent: "space-between",
                        display: "flex"
                      }}
                    >
                      <span>Tổng cộng</span>
                      <span className="_1Pu2ailzs8h4eqVc792xOn">$10.00</span>
                    </div>
                    <div className="lLA-xJuEE5FVKeD8ezek3">
                      <div>
                        <div
                          className="_3X7RzVL6jzVBkctplBQ8Z"
                          style={{ display: "flex" }}
                        >
                          {this.state.currentPrintStep > 1 && (
                            <button
                              style={{
                                marginRight: "5px"
                              }}
                              onClick={() => {
                                this.setState({
                                  currentPrintStep:
                                    this.state.currentPrintStep - 1
                                });
                              }}
                            >
                              Back
                            </button>
                          )}
                          <button
                            className="_2Rww-JOL60obmcYkaUOyg_ Wqfq1nAfa6if4eEOr6Mza _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _28oyZ-_qfE-ERg1G1Nc2zV Wqfq1nAfa6if4eEOr6Mza _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _3QJ_C8Lg1l0m5aoIK5piST _2kK9hFUTyqtMKr5EG4GuY4 _2HxAYUsq5GZ4sKqpZqoKLF"
                            title="Continue"
                            type="button"
                            onClick={() => this.handleContinueOrder()}
                            style={{
                              color: "white",
                              height: "40px",
                              borderRadius: "4px",
                              width: "100%",
                              border: "none",
                              backgroundColor: "rgb(1, 159, 182)"
                            }}
                          >
                            <span className="wDZfRbnecQOufIqcN2_A5">
                              Tiếp tục
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {this.state.showMediaEditPopup ? (
            <MediaEditPopup
              item={this.state.editingMedia}
              closePopup={() => {
                this.setState({ showMediaEditPopup: false });
              }}
              handleRemoveBackground={this.handleRemoveBackground.bind(
                this,
                this.state.editingMedia.id
              )}
            />
          ) : null}
          {this.state.showTemplateEditPopup ? (
            <TemplateEditor
              item={this.state.editingMedia}
              closePopup={() => {
                this.setState({ showTemplateEditPopup: false });
              }}
            />
          ) : null}
          {this.state.showFontEditPopup ? (
            <FontEditPopup
              item={this.state.editingFont}
              closePopup={() => {
                this.setState({ showFontEditPopup: false });
              }}
            />
          ) : null}
          {this.state.showImageRemovalBackgroundPopup && (
            <ImageBackgroundRemovalEditor
              mediaId={this.state.imageIdBackgroundRemoved}
              closePopup={() => {
                this.setState({ showImageRemovalBackgroundPopup: false });
              }}
            />
          )}
        </div>
        <Popup
          showPopup={this.state.showPopup}
          text='Click "Close Button" to hide popup'
          handleDownloadPDF={this.downloadPDF.bind(this, false)}
          handleDownloadJPG={this.downloadPNG.bind(this, false, false)}
          handleDownloadPNGTransparent={this.downloadPNG.bind(this, true, true)}
          handleDownloadPNG={this.downloadPNG.bind(this, false, true)}
          handleDownloadPDFWithBleed={this.downloadPDF.bind(this, true)}
          handleDownloadVideo={this.downloadVideo.bind(this)}
          closePopup={() => {
            this.setState({ showPopup: false });
          }}
        />
      </div>
    );
  }
}

export default CanvaEditor;
