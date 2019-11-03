import React, { Component } from "react";
import uuidv4 from "uuid/v4";
import { getBoundingClientRect } from "@Utils";
import "@Styles/editor.scss";
import axios from "axios";
import Popup from "@Components/shared/Popup";
import MediaEditPopup from "@Components/editor/MediaEditor";
import TemplateEditor from "@Components/editor/TemplateEditor";
import FontEditPopup from "@Components/editor/FontEditor";
import Globals from "@Globals";
import { Helmet } from "react-helmet";
import { toJS, IObservable } from "mobx";
import { observer } from "mobx-react";
import LeftSide from "@Components/editor/LeftSide";
import FontSize from "@Components/editor/FontSize";
import { withTranslation } from "react-i18next";
import editorTranslation from "@Locales/default/editor";
import {
  centerToTL,
  tLToCenter,
  getNewStyle,
  degToRadian,
  updateTransformXY,
  updatePosition,
  updateRotate,
  isNode,
} from "@Utils";
import loadable from "@loadable/component";
import { clone } from "lodash";
import editorStore from "@Store/EditorStore";
const DownloadIcon = loadable(() =>
  import("@Components/shared/svgs/DownloadIcon")
);
import { getLength, getAngle, getCursor } from "@Utils";

var Hammer;

// if (!isNode()) {
//   Hammer = require("hammerjs");
//   console.log('hammerjs ', require("hammerjs"));
// }

import { fromEvent, merge, NEVER, Subject, BehaviorSubject, } from 'rxjs';
import { map, filter, scan, switchMap, startWith, takeUntil } from 'rxjs/operators';

const DownloadList = loadable(() => import("@Components/editor/DownloadList"));

const Home = loadable(() => import("@Components/shared/svgs/HomeIcon"));

const PosterReview = loadable(() => import("@Components/editor/PosterReview"));
const TrifoldReview = loadable(() =>
  import("@Components/editor/TrifoldReview")
);
const FlyerReview = loadable(() => import("@Components/editor/FlyerReview"));
const BusinessCardReview = loadable(() =>
  import("@Components/editor/BusinessCardReview")
);
const CanvasReview = loadable(() => import("@Components/editor/CanvasReview"));
const Canvas = loadable(() => import("@Components/editor/Canvas"));

declare global {
  interface Window {
    paymentScope: any;
    resizingInnerImage: any;
    startX: any;
    startY: any;
    startLeft: any;
    startTop: any;
    rect: any;
    rect2: any;
    image: any;
    rotateAngle: any;
    resizing: boolean;
    rotating: boolean;
    dragging: boolean;
    posX: any;
    posY: any;
    imgWidth: any;
    imgHeight: any;
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
  addFontItem: any;
  fonts: any;
  addFont: any;
  upperZIndex: number;
  increaseUpperzIndex: any;
  store: any;
  t: any;
  i18n: any;
  tReady: boolean;
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
  idObjectSelected: string;
  scale: number;
  fitScale: number;
  selectedTab: SidebarTab;
  rectWidth: number;
  rectHeight: number;
  toolbarOpened: boolean;
  toolbarSize: number;
  scrollX: number;
  scrollY: number;
  _id: string;
  rotating: boolean;
  templateType: string;
  mode: number;
  staticGuides: any;
  deltaX: number;
  deltaY: number;
  editing: boolean;
  canRenderClientSide: boolean;
  fontSize: number;
  currentOpacity: number;
  fontColor: string;
  showPopup: boolean;
  showMediaEditingPopup: boolean;
  isSaving: boolean;
  fontName: string;
  childId: string;
  cropMode: boolean;
  updateRect: boolean;
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
const NAMESPACE = "editor";

@observer
class CanvaEditor extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedImage: null,
      showFontEditPopup: false,
      currentPrintStep: 1,
      subtype: null,
      bleed: false,
      showMediaEditPopup: false,
      updateRect: false,
      childId: null,
      fontName: "images/833bdf3b-7c22-4e79-9b0a-eece6711eacd.png",
      isSaving: false,
      showPopup: false,
      showMediaEditingPopup: false,
      fontColor: "black",
      fontSize: 0,
      templateType: null,
      _id: null,
      idObjectSelected: null,
      typeObjectSelected: null,
      scale: 1,
      fitScale: 1,
      selectedTab: null,
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
      rotating: false,
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

  translate = (key: string) => {
    const { t, i18n } = this.props;

    if (i18n.exists && i18n.exists(NAMESPACE + ":" + key)) return t(key);

    if (
      editorTranslation !== undefined &&
      editorTranslation.hasOwnProperty(key)
    ) {
      return editorTranslation[key]; // load default translation in case failed to load translation file from server
    }

    return key;
  };

  pauser = null;

  async componentDidMount() {

    // Creating a pauser subject to subscribe to
    var screenContainerParent = document.getElementById("screen-container-parent");
    let doNoObjectSelected$    = fromEvent(screenContainerParent, 'mouseup').pipe(
      map(e => (e.target as HTMLElement).id)
    );
    
    this.pauser = new BehaviorSubject(false);
    const pausable = this.pauser.pipe(
      switchMap(paused => {
      return paused ? NEVER : doNoObjectSelected$; 
    }));

    this.pauser.next(false);

    pausable.subscribe(id => {
      if (id == "canvas" || id == "screen-container-parent") {
        this.doNoObjectSelected();
      }
    });
    
    var ce = document.createElement.bind(document);
    var ca = document.createAttribute.bind(document);
    var ge = document.getElementsByTagName.bind(document);

    this.setState({
      canRenderClientSide: true,
      selectedTab: SidebarTab.Template
    });
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

    editorStore.fontsList.forEach(id => {
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

    editorStore.fontsList.forEach(id => {
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
          if (res.data.errors.length > 0) {
            throw new Error(res.data.errors.join("\n"));
          }
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

          let images = document.document_object;

          editorStore.replace(images);
          editorStore.fonts.replace(image.value.fontList);

          subtype = res.data.value.printType;
          self.setState({
            scale:
              Math.min(scaleX, scaleY) === Infinity
                ? 1
                : Math.min(scaleX, scaleY),
            staticGuides,
            _id: template_id,
            rectWidth: document.width,
            rectHeight: document.height,
            templateType,
            mode,
            subtype: res.data.value.printType
          });

          var zIndexMax = 0;
          images.forEach(img => {
            zIndexMax = Math.max(zIndexMax, img.zIndex);
          });

          editorStore.upperZIndex = zIndexMax + 1;
          editorStore.activePageId = res.data.value.pages[0];
          editorStore.pages.replace(res.data.value.pages);
        })
        .catch(e => {});
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
        // Poster
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
      } else if (subtype == 7) {
        rectWidth = 1920;
        rectHeight = 1080;
      } else if (subtype == 8) {
        rectWidth = 940;
        rectHeight = 788;
      } else if (subtype == 9) {
        rectWidth = 1080;
        rectHeight = 1080;
      } else if (subtype == 10) {
        rectWidth = 2550;
        rectHeight = 3300;
      }

      var scaleX = (width - 100) / rectWidth;
      var scaleY = (height - 100) / rectHeight;
      self.setState({
        rectWidth,
        rectHeight,
        subtype,
        scale:
          Math.min(scaleX, scaleY) === Infinity ? 1 : Math.min(scaleX, scaleY),
      });
    }

    document.addEventListener("keydown", this.removeImage.bind(this));
  }

  textOnMouseDown(e, doc) {
    var scale = this.state.scale;
    var ce = document.createElement.bind(document);
    var ca = document.createAttribute.bind(document);
    var ge = document.getElementsByTagName.bind(document);

    e.preventDefault();
    var target = e.target.cloneNode(true);
    target.style.zIndex = "11111111111";
    target.style.width = e.target.getBoundingClientRect().width + "px";
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
          var rectTop = rec.top;
          var index = i;
          var document2 = JSON.parse(doc.document);
          document2._id = uuidv4();
          document2.page = editorStore.pages[index];
          document2.zIndex = this.props.upperZIndex + 1;
          document2.width = rec2.width / scale;
          document2.height = rec2.height / scale;
          document2.scaleX = document2.width / document2.origin_width;
          document2.scaleY = document2.height / document2.origin_height;
          document2.left = (rec2.left - rec.left) / scale;
          document2.top = (rec2.top - rectTop) / scale;

          // let images = [...editorStore.images, document2];

          if (doc.fontList) {
            var fontList = doc.fontList.forEach(id => {
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

          editorStore.addItem(document2, false);

          var fonts = toJS(editorStore.fonts);
          let tempFonts = [...fonts, ...doc.fontList];
          editorStore.fonts.replace(tempFonts);

          editorStore.increaseUpperzIndex();
        }
      }

      target.remove();
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  selectFont = (id, e) => {
    var fontsList = toJS(editorStore.fontsList);
    var font = fontsList.find(font => font.id === id);

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

    let images = toJS(editorStore.images);
    let tempImages = images.map(img => {
      if (img._id === this.state.idObjectSelected) {
        img.fontFace = id;
        img.fontRepresentative = font.representative;
      }
      return img;
    });

    editorStore.images.replace(tempImages);

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

    editorStore.addFont(id);
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

  displayResizers = (show: Boolean) => {
    let opacity = show ? 1 : 0;
    var resizers = document.getElementsByClassName(
      "resizable-handler-container"
    );
    for (var i = 0; i < resizers.length; ++i) {
      var cur: any = resizers[i];
      cur.style.opacity = opacity;
    }

    var rotators = document.getElementsByClassName("rotate-container");
    for (var i = 0; i < rotators.length; ++i) {
      var cur: any = rotators[i];
      cur.style.opacity = opacity;
    }
  }

  handleResizeStart = (e: any) => {
    e.stopPropagation();
    
    this.displayResizers(false);

    window.startX = e.clientX;
    window.startY = e.clientY;
    window.resizingInnerImage = false;
    window.resizing = true;
   
    this.pauser.next(true);

    var cursor = e.target.id;
    var type = e.target.getAttribute("class").split(" ")[0];
    let { scale } = this.state;
    const location$ = this.handleDragRx(e.target);

    let image = editorStore.images.find(img => img._id == this.state.idObjectSelected);
    window.image = image;
    let {
      top: top2,
      left: left2,
      width: width2,
      height: height2
    } = image;

    this.temp = location$.pipe(
        map(([x, y]) => ({
          moveElLocation: [x, y]
        }))
      )
      .subscribe(({ moveElLocation }) => {
        var deltaX = moveElLocation[0] - window.startX;
        var deltaY = moveElLocation[1] - window.startY;
        const deltaL = getLength(deltaX, deltaY);
        const alpha = Math.atan2(deltaY, deltaX);
        const beta = alpha - degToRadian(image.rotateAngle);
        const deltaW = (deltaL * Math.cos(beta)) / scale;
        const deltaH = (deltaL * Math.sin(beta)) / scale;
        let rotateAngle = image.rotateAngle;
        let ratio = image.width / image.height;

        const rect2 = tLToCenter({ top: top2, left: left2, width: width2, height: height2, rotateAngle });
        const rect = { width: rect2.size.width, height: rect2.size.height, centerX: rect2.position.centerX, centerY: rect2.position.centerY, rotateAngle: rect2.transform.rotateAngle };
        let {
          position: { centerX, centerY },
          size: { width, height }
        } = getNewStyle(
          type,
          { ...rect, rotateAngle },
          deltaW,
          deltaH,
          ratio,
          10,
          10
        );

        this.handleResize(centerToTL({ centerX, centerY, width, height, rotateAngle }), false, cursor, this.state.idObjectSelected, 1, 1, cursor, editorStore.imageSelected.type, e);
      }, null, 
      () => {
        this.displayResizers(true);
        window.resizing = false;
        this.handleResizeEnd(null);
        this.pauser.next(false);
      });
  };

  handleResizeEnd = fontSize => {
    this.temp.unsubscribe();
    let images = toJS(editorStore.images);
    let tempImages = images.map(img => {
      if (img._id === this.state.idObjectSelected) {
        img.fontSize = fontSize;
        editorStore.imageSelected = img;
      }
      return img;
    });
    editorStore.images.replace(tempImages);
    
    document.body.style.cursor = null;

    // setTimeout(
    //   function() {
    //     this.setState({ resizing: false });
    //   }.bind(this),
    //   300
    // );
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
    console.log('handleResize')
    const { scale } = this.state;
    let { top, left, width, height } = style;
    // var self = this;
    var switching = false;
    var temp = this.handleImageResize;
    // var images = editorStore.images.map(image => {
    //   if (image._id === _id) {
      let image = window.image;
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
            window.resizingInnerImage = true;
            window.startX =
              document.getElementById(_id + "tl_").getBoundingClientRect()
                .left + 10;
            window.startY =
              document.getElementById(_id + "tl_").getBoundingClientRect().top +
              10;
            switching = true;
          }

          if (t5 && t6 && type == "bl") {
            window.resizingInnerImage = true;
            window.startX =
              document.getElementById(_id + "bl_").getBoundingClientRect()
                .left + 10;
            window.startY =
              document.getElementById(_id + "bl_").getBoundingClientRect().top +
              10;
            switching = true;
          }

          if (t6 && t7 && type == "br") {
            window.resizingInnerImage = true;
            window.startX =
              document.getElementById(_id + "br_").getBoundingClientRect()
                .left + 10;
            window.startY =
              document.getElementById(_id + "br_").getBoundingClientRect().top +
              10;
            switching = true;
          }

          if (t8 && t7 && type == "tr") {
            window.resizingInnerImage = true;
            window.startX =
              document.getElementById(_id + "tr_").getBoundingClientRect()
                .left + 10;
            window.startY =
              document.getElementById(_id + "tr_").getBoundingClientRect().top +
              10;
            switching = true;
          }
        }

        if ((objectType === 4 || objectType === 9) && !this.state.cropMode) {
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

          var el = document.getElementById(_id + "1235");
          if (el) {
            el.style.width = image.imgWidth * scale + "px";
            el.style.height = image.imgHeight * scale + "px";
          }

          el = document.getElementById(_id + "1238");
          if (el) {
            el.style.width = image.imgWidth * scale + "px";
            el.style.height = image.imgHeight * scale + "px";
          }
        }

        if ((objectType === 4 || objectType == 9) && this.state.cropMode) {
          image.posX -= deltaLeft;
          image.posY -= deltaTop;
        }


        image.top = top;
        image.left = left;
        image.width = width;
        image.height = height;

        if (cursor != "e" && cursor != "w") {
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

        var a = document.getElementsByClassName(_id + "aaaa");
        for (let i = 0; i < a.length; ++i) {
          var tempEl = a[i] as HTMLElement;
          tempEl.style.width = image.width * scale + "px";
          tempEl.style.left = image.left * scale + "px";
          tempEl.style.top = image.top * scale + "px";
          tempEl.style.height = image.height * scale + "px";
        }

        a = document.getElementsByClassName(_id + "imgWidth");
        for (let i = 0; i < a.length; ++i) {
          var tempEl = a[i] as HTMLElement;
          tempEl.style.width = image.imgWidth * scale + "px";
          tempEl.style.height = image.imgHeight * scale + "px";
        }

        var b = document.getElementsByClassName(_id + "1236");
        for (let i = 0; i < b.length; ++i) {
          var tempEl = b[i] as HTMLElement;
          tempEl.style.transform = `translate(${image.posX * scale}px, ${image.posY * scale}px)`;
        }

        (window as any).scaleY = image.scaleY;

        if (switching) {
          const styles = tLToCenter({
            top: image.top,
            left: image.left,
            width: image.width,
            height: image.height,
            rotateAngle: image.rotateAngle
          });
          const imgStyles = tLToCenter({
            left: image.posX,
            top: image.posY,
            width: image.imgWidth,
            height: image.imgHeight,
            rotateAngle: 0
          });

          window.rect = {
            width: image.width,
            height: image.height,
            centerX: styles.position.centerX,
            centerY: styles.position.centerY,
            rotateAngle: image.rotateAngle
          };
          window.rect2 = {
            width: image.imgWidth,
            height: image.imgHeight,
            centerX: imgStyles.position.centerX,
            centerY: imgStyles.position.centerY,
            rotateAngle: 0
          };
        }
  };

  handleResizeInnerImageStart = (e) => {
    var resizers = document.getElementsByClassName(
      "resizable-handler-container"
    );
    for (var i = 0; i < resizers.length; ++i) {
      var cur: any = resizers[i];
      cur.style.opacity = 0;
    }

    var rotators = document.getElementsByClassName("rotate-container");
    for (var i = 0; i < rotators.length; ++i) {
      var cur: any = rotators[i];
      cur.style.opacity = 0;
    }

    window.resizingInnerImage = true;
    window.startX = e.clientX;
    window.startY = e.clientY;
    window.resizing = true;
    // this.setState({ resizing: true });
    this.pauser.next(true);

    var cursor = e.target.id;
    var type = e.target.getAttribute("class").split(" ")[0];
    let { scale } = this.state;
    const location$ = this.handleDragRx(e.target);

    let image = editorStore.images.find(img => img._id == this.state.idObjectSelected);
    window.image = image;
    let {
      top: top2,
      left: left2,
      width: width2,
      height: height2,
      imgWidth: width3,
      imgHeight: height3,
      posX: left3,
      posY: top3,
    } = image;

    const rect2 = tLToCenter({ top: top2, left: left2, width: width2, height: height2, rotateAngle: image.rotateAngle });
    const rect = { width: rect2.size.width, height: rect2.size.height, centerX: rect2.position.centerX, centerY: rect2.position.centerY, rotateAngle: rect2.transform.rotateAngle };
    
    const rect3 = tLToCenter({ top: top3, left: left3, width: width3, height: height3, rotateAngle: image.rotateAngle });
    const rect4 = { width: rect3.size.width, height: rect3.size.height, centerX: rect3.position.centerX, centerY: rect3.position.centerY, rotateAngle: rect3.transform.rotateAngle };
    

    window.rect = {
      width: image.width,
      height: image.height,
      centerX: rect2.position.centerX,
      centerY: rect2.position.centerY,
      rotateAngle: image.rotateAngle
    };
    window.rect2 = {
      width: image.imgWidth,
      height: image.imgHeight,
      centerX: rect3.position.centerX,
      centerY: rect3.position.centerY,
      rotateAngle: 0
    };

    this.temp = location$.pipe(
        map(([x, y]) => ({
          moveElLocation: [x, y]
        }))
      )
      .subscribe(({ moveElLocation }) => {
        var deltaX = moveElLocation[0] - window.startX;
        var deltaY = moveElLocation[1] - window.startY;
        const deltaL = getLength(deltaX, deltaY);
        const alpha = Math.atan2(deltaY, deltaX);
        const beta = alpha - degToRadian(image.rotateAngle);
        const deltaW = (deltaL * Math.cos(beta)) / scale;
        const deltaH = (deltaL * Math.sin(beta)) / scale;
        let rotateAngle = image.rotateAngle;

        if (!window.resizingInnerImage) {
          let {
            position: { centerX, centerY },
            size: { width, height }
          } = getNewStyle(
            type,
            { ...window.rect, rotateAngle },
            deltaW,
            deltaH,
            null,
            10,
            10
          );
            this.handleResize(centerToTL({ centerX, centerY, width, height, rotateAngle }), false, type, this.state.idObjectSelected, 1, 1, cursor, editorStore.imageSelected.type, e);
        } else {
          let ratio = image.imgWidth / image.imgHeight;
          let {
            position: { centerX, centerY },
            size: { width, height }
          } = getNewStyle(
            type,
            { ...window.rect2, rotateAngle },
            deltaW,
            deltaH,
            ratio,
            10,
            10
          );
          this.handleImageResize(centerToTL({ centerX, centerY, width, height, rotateAngle }), false, type, this.state.idObjectSelected, 1, 1, cursor, editorStore.imageSelected.type, e);
        }
      }, null, 
      () => {
        window.resizing = false;
        this.handleResizeEnd(null);
        this.pauser.next(false);
        this.displayResizers(true);
      });
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
    console.log('handleImageResize')
    const { scale } = this.state;
    let { top, left, width, height } = style;
    // top = top / scale;
    // left = left / scale;
    // width = width / scale;
    // height = height / scale;

    var self = this;
    var switching = false;
    // let tempImages = images.map(image => {
    //   if (image._id === _id) {
        let image = window.image;
        if (
          image.height - top - height > 0 &&
          image.width - left - width > 0 &&
          type == "br"
        ) {
          window.resizingInnerImage = false;
          window.startX =
            document.getElementById(_id + "br").getBoundingClientRect().left +
            10;
          window.startY =
            document.getElementById(_id + "br").getBoundingClientRect().top +
            10;
          switching = true;
          height = -top + image.height;
          width = -left + image.width;
        } else if (
          image.height - top > height &&
          left <= 0 &&
          (type == "bl" || type == "br")
        ) {
          window.resizingInnerImage = false;
          window.startX = e.clientX;
          window.startY = e.clientY + image.height - top - height;
          switching = true;
          height = -top + image.height;
          // width = -left + image.width;
        } else if (image.height - top > height && left > 0 && type == "bl") {
          window.resizingInnerImage = false;
          window.startX =
            document.getElementById(_id + "bl").getBoundingClientRect().left +
            10;
          window.startY =
            document.getElementById(_id + "bl").getBoundingClientRect().top +
            10;
          switching = true;
          image.posX = -left;
          width += left;
          left = 0;
          height = -top + image.height;
        } else if (
          image.width - left > width &&
          top < 0 &&
          (type == "tr" || type == "br")
        ) {
          window.resizingInnerImage = false;
          window.startX = e.clientX;
          window.startY = e.clientY + image.height - top - height;
          switching = true;
          width = -left + image.width;
        } else if (image.width - left > width && top > 0 && type == "tr") {
          window.resizingInnerImage = false;
          window.startX =
            document.getElementById(_id + "tr").getBoundingClientRect().left +
            10;
          window.startY =
            document.getElementById(_id + "tr").getBoundingClientRect().top +
            10;
          switching = true;
          image.posY = -top;
          height += top;
          top = 0;
          width = -left + image.width;
        } else if (top > 0 && left <= 0 && (type == "tl" || type == "tr")) {
          console.log('correct3');
          window.resizingInnerImage = false;
          window.startX = e.clientX;
          window.startY = e.clientY - top;
          image.posY = -top;
          height += top;
          top = 0;
          switching = true;
        } else if (left > 0 && top <= 0 && (type == "tl" || type == "bl")) {
          console.log('correct2');
          window.resizingInnerImage = false;
          window.startX = e.clientX - left;
          window.startY = e.clientY;
          image.posX = -left;
          width += left;
          left = 0;
          switching = true;
        } else if (left > 1 && top > 1 && type == "tl") {
          console.log('correct');
          window.resizingInnerImage = false;
          window.startX =
            document.getElementById(_id + "tl").getBoundingClientRect().left +
            10;
          window.startY =
            document.getElementById(_id + "tl").getBoundingClientRect().top +
            10;
          image.posX = -left;
          image.posY = -top;
          height += top;
          width += left;
          left = 0;
          top = 0;
          switching = true;
        }

        image.posY = top;
        image.posX = left;
        image.imgWidth = width;
        image.imgHeight = height;

        var el = document.getElementsByClassName(_id + "imgWidth");
        for (let i = 0; i < el.length; ++i) {
          var tempEl = el[i] as HTMLElement;
          tempEl.style.transform = `translate(${image.posX * scale}px, ${image.posY * scale}px)`
        }

        el = document.getElementsByClassName(_id + "1236");
        for (let i = 0; i < el.length; ++i) {
          var tempEl = el[i] as HTMLElement;
          tempEl.style.width = image.imgWidth * scale + "px";
          tempEl.style.height = image.imgHeight * scale + "px";
        } 
  };

  handleRotate = (rotateAngle, _id, e) => {
    // console.log('arguments ', arguments);
    var tip = document.getElementById("helloTip");
    if (!tip) {
      tip = document.createElement("div");
    }
    tip.id = "helloTip";
    tip.style.position = "absolute";
    // tip.style.width = "100px";
    tip.style.height = "30px";
    tip.style.backgroundColor = "black";
    tip.style.top = e.clientY + 20 + "px";
    tip.style.left = e.clientX + 20 + "px";
    tip.innerText = rotateAngle + "°";

    // var el = document.getElementById(_id + "_");
    // el.style.transform = `rotate(${rotateAngle}deg)`;

    // el = document.getElementById(_id + "__");
    // el.style.transform = `rotate(${rotateAngle}deg)`;

    updateRotate(_id + "_", rotateAngle);
    updateRotate(_id + "__", rotateAngle);

    window.rotateAngle = rotateAngle;

    // let images = toJS(editorStore.images);
    // images = images.map(image => {
    //   if (image._id === _id) {
    //     image.rotateAngle = rotateAngle;
    //   }
    //   return image;
    // });

    // editorStore.replace(images);
    // this.setState({ images });
  };

  handleRotateStart = (e: any) => {
    e.stopPropagation();
    this.displayResizers(false);

    let image = editorStore.images.find(img => img._id == this.state.idObjectSelected);
    window.image = image;

    var tip = document.getElementById("helloTip");
    if (!tip) {
      tip = document.createElement("div");
    }
    tip.id = "helloTip";
    tip.style.position = "absolute";
    // tip.style.width = "100px";
    tip.style.height = "30px";
    tip.style.backgroundColor = "black";
    tip.style.top = e.clientY + 20 + "px";
    tip.style.left = e.clientX + 20 + "px";
    tip.style.zIndex = "2147483647";
    tip.style.color = "white";
    tip.style.textAlign = "center";
    tip.style.lineHeight = "30px";
    tip.style.borderRadius = "3px";
    tip.style.padding = "0 5px";
    tip.style.fontSize = "12px";
    tip.innerText = image.rotateAngle + "°";

    document.body.append(tip);

    window.rotating = true;

    const location$ = this.handleDragRx(e.target);

    const rect = document.getElementById(this.state.idObjectSelected).getBoundingClientRect();
    console.log('rect ', rect);
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    const startVector = {
      x: e.clientX - center.x,
      y: e.clientY - center.y
    };

    this.pauser.next(true);

    this.temp = location$.pipe(
        map(([x, y]) => ({
          moveElLocation: [x, y]
        }))
      )
      .subscribe(({ moveElLocation }) => {
        const rotateVector = {
          x: moveElLocation[0] - center.x,
          y: moveElLocation[1] - center.y
        };
        const angle = getAngle(startVector, rotateVector);

        let rotateAngle = Math.round(image.rotateAngle + angle);
        if (rotateAngle >= 360) {
          rotateAngle -= 360;
        } else if (rotateAngle < 0) {
          rotateAngle += 360;
        }
        if (rotateAngle > 356 || rotateAngle < 4) {
          rotateAngle = 0;
        } else if (rotateAngle > 86 && rotateAngle < 94) {
          rotateAngle = 90;
        } else if (rotateAngle > 176 && rotateAngle < 184) {
          rotateAngle = 180;
        } else if (rotateAngle > 266 && rotateAngle < 274) {
          rotateAngle = 270;
        }
        // window.image.rotateANgle = rotateAngle;
        window.rotateAngle = rotateAngle;

        var a = document.getElementsByClassName(image._id + "aaaa");
        for (let i = 0; i < a.length; ++i) {
          var cur = a[i] as HTMLElement;
          cur.style.transform = `rotate(${rotateAngle}deg)`;
        }

        var tip = document.getElementById("helloTip");
        if (!tip) {
          tip = document.createElement("div");
        }
        tip.id = "helloTip";
        tip.style.position = "absolute";
        // tip.style.width = "100px";
        tip.style.height = "30px";
        tip.style.backgroundColor = "black";
        tip.style.top = moveElLocation[1] + 20 + "px";
        tip.style.left = moveElLocation[0] + 20 + "px";
        tip.innerText = rotateAngle + "°";
      }, null, 
      () => {
        window.rotating = false;
        this.displayResizers(true);
        this.handleRotateEnd(this.state.idObjectSelected);
        this.pauser.next(false);
      });
  };

  handleRotateEnd = (_id: string) => {
    var tip = document.getElementById("helloTip");
    if (!tip) {
      tip = document.createElement("div");
    }
    document.body.removeChild(tip);

    let images = toJS(editorStore.images);
    let tempImages = images.map(image => {
      if (image._id === _id) {
        image.rotateAngle = window.rotateAngle;
        editorStore.imageSelected = image;
      }
      return image;
    });

    editorStore.replace(tempImages);
  };

  canvasRect = null;
  temp = null;

  handleDragStart = (e, _id) => {
    window.startX = e.clientX;
    window.startY = e.clientY;
    const { scale } = this.state;
    editorStore.images.forEach(image => {
      if (image._id === _id) {
        window.startLeft = image.left * scale;
        window.startTop = image.top * scale;
        window.image = clone(image);
        window.posX = window.image.posX;
        window.posY = window.image.posY;
        window.imgWidth = window.image.imgWidth;
        window.imgHeight = window.image.imgHeight;
      }
    });

    if (_id != this.state.idObjectSelected) {
      this.handleImageSelected(window.image);
    }

    this.displayResizers(false);

    window.dragging = true;

    this.pauser.next(true);

    const location$ = this.handleDragRx(e.target);

    this.temp = location$.pipe(
        map(([x, y]) => ({
          moveElLocation: [x, y]
        }))
      )
      .subscribe(({ moveElLocation }) => {
        if (this.state.cropMode) {
          this.handleImageDrag(this.state.idObjectSelected, moveElLocation[0], moveElLocation[1])
        } else {
          this.handleDrag(this.state.idObjectSelected, moveElLocation[0], moveElLocation[1])
        }
      }, null, 
      () => {
        window.dragging = false;
        this.displayResizers(true);
        this.handleDragEnd();
        this.pauser.next(false);
      });
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

  handleImageDrag = (_id, clientX, clientY) => {
    const { scale } = this.state;

    var deltaX = (clientX - window.startX);
    var deltaY = (clientY - window.startY);

    var deg = degToRadian(window.image.rotateAngle);
    var newX = deltaY * Math.sin(deg) + deltaX * Math.cos(deg);
    var newY = deltaY * Math.cos(deg) - deltaX * Math.sin(deg);

    var newPosX = window.posX + newX / scale;
    var newPosY = window.posY + newY / scale;

    var img = window.image;
    if (newPosX > 0) {
      newPosX = 0;
    } else if (newPosX + img.imgWidth < img.width) {
      newPosX = (img.width - img.imgWidth);
    }
    if (newPosY > 0) {
      newPosY = 0;
    } else if (newPosY + img.imgHeight < img.height) {
      newPosY = (img.height - img.imgHeight);
    }
    img.posX = newPosX;
    img.posY = newPosY;

    var el = document.getElementsByClassName(_id + "imgWidth");
    for (let i = 0; i < el.length; ++i) {
      var tempEl = el[i] as HTMLElement;
      tempEl.style.transform = `translate(${newPosX * scale}px, ${newPosY * scale}px)`;
    }
  };

  /**
 * Create an observable stream to handle drag gesture
 */
drag = ({ element, pan$}) => {
  const panMove$ = pan$.pipe(
    filter((e:Event) => e.type == "mousemove")
  )

  const panEnd$ = pan$.pipe(
    filter((e:Event) => e.type == "mouseup")
  )

  return panMove$
  .pipe(
    map((e: any) => {
      e.preventDefault();
      e.stopPropagation();
      var x = e.clientX; 
      var y = e.clientY;
      return {x, y}
    }),
    takeUntil(panEnd$)
  );
};

  /**
  * Generate the drag handler for a DOM element
  */
  handleDragRx = (element) => {

    const mouseMove$    = fromEvent(document, 'mousemove');
    const mouseUp$     = fromEvent(document, 'mouseup');

    const pan$ = merge(
      mouseMove$,
      mouseUp$,
    );

    const drag$ = this.drag({
      element: element,
      pan$
    });
 
    return drag$.pipe(
      map(({ x, y }) => [x, y])
    )
  }

  handleDrag = (_id, clientX, clientY): any => {
    const { scale } = this.state;
    var newLeft, newTop;
    var newLeft2, newTop2;
    var newLeft3, newTop3;
    var centerX, centerY;
    var left, top;
    var img;
    var updateStartPosX = false;
    var updateStartPosY = false;
    let images = toJS(editorStore.images);
    var image = window.image;
    newLeft = (clientX - window.startX + window.startLeft) / scale;
    newTop = (clientY - window.startY + window.startTop) / scale;
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
    if (img.type === TemplateType.BackgroundImage) {
      return;
    }
    let tempImages = images.map(image => {
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
            var el = document.getElementById(image._id + "guide_" + ii);
            if (el) {
              if (image[ii] == 1) {
                el.style.display = "block";
              } else {
                el.style.display = "none";
              }
            }
          }
        }
      }
      return image;
    });

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

    image.left = left;
    image.top = top;
    
    updatePosition(_id + "_", left * scale, top * scale, null, null);
    updatePosition(_id + "__", left * scale, top * scale, null, null);
  };

  handleDragEnd = () => {
    this.temp.unsubscribe();

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

    var images = toJS(editorStore.images).map(image => {
      if (image._id == this.state.idObjectSelected) {
        image = window.image;
        image.selected = true;
        editorStore.imageSelected = image;
      }
      for (var ii = 0; ii < 6; ++ii) {
        image[ii] = 0;
        var el = document.getElementById(image._id + "guide_" + ii);
        if (el) {
          document.getElementById(image._id + "guide_" + ii).style.display = "none";
        }
      }
      return image;
    });

    editorStore.replace(images);
  };

  setAppRef = ref => (this.$app = ref);
  setContainerRef = ref => (this.$container = ref);

  elementIsVisible = (element, container, partial) => {
    var contHeight = container.offsetHeight,
      elemTop = this.offset(element).top - this.offset(container).top,
      elemBottom = elemTop + element.offsetHeight;
    return (
      (elemTop >= 0 && elemBottom <= contHeight) ||
      (partial &&
        ((elemTop < 0 && elemBottom > 0) ||
          (elemTop > 0 && elemTop <= contHeight)))
    );
  };

  isWindow = obj => {
    return obj != null && obj === obj.window;
  };

  getWindow = elem => {
    return this.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
  };

  offset = elem => {
    var docElem,
      win,
      box = { top: 0, left: 0 },
      doc = elem && elem.ownerDocument;

    docElem = doc.documentElement;

    if (typeof elem.getBoundingClientRect !== typeof undefined) {
      box = elem.getBoundingClientRect();
    }
    win = this.getWindow(doc);
    return {
      top: box.top + win.pageYOffset - docElem.clientTop,
      left: box.left + win.pageXOffset - docElem.clientLeft
    };
  };

  handleScroll = () => {
    const screensRect = getBoundingClientRect("screens");
    const canvasRect = getBoundingClientRect("canvas");
    if (screensRect && canvasRect) {
      const canvasRect = getBoundingClientRect("canvas");
      const { scale } = this.state;
      const startX = (screensRect.left + thick - canvasRect.left) / scale;
      const startY = (screensRect.top + thick - canvasRect.top) / scale;

      var pages = toJS(editorStore.pages);
      var activePageId = pages[0];
      if (pages.length > 1) {
        var container = document.getElementById("screen-container-parent");
        for (var i = 0; i < pages.length; ++i) {
          var pageId = pages[i];
          var canvas = document.getElementById(pageId);
          if (canvas) {
            if (this.elementIsVisible(canvas, container, true)) {
              activePageId = pageId;
            }
          }
        }
      }

      editorStore.activePageId = activePageId;
    }
  };

  handleWheel = e => {
    if (e.ctrlKey || e.metaKey) {
      const nextScale = parseFloat(
        Math.max(0.1, this.state.scale - e.deltaY / 500).toFixed(2)
      );
      this.setState({ scale: nextScale });
    }
  };

  doNoObjectSelected = () => {
    // if (!this.state.rotating && !this.state.resizing) {
      let images = editorStore.images.map(image => {
        image.selected = false;
        return image;
      });

      var selectedTab = this.state.selectedTab;
      if (this.state.selectedTab === SidebarTab.Font) {
        selectedTab = SidebarTab.Image;
      }

      editorStore.doNoObjectSelected();

      this.setState({
        cropMode: false,
        selectedTab,
        idObjectSelected: null,
        typeObjectSelected: null,
        childId: null
      });
    // }
  };
  
  removeImage(e) {
    var OSNAME = this.getPlatformName();
    if (
      this.state.idObjectSelected != "undefined" &&
      !e.target.classList.contains("text") &&
      ((e.keyCode === 8 && OSNAME == "Mac/iOS") ||
        (e.keyCode === 8 && OSNAME == "Windows"))
    ) {
      let images = editorStore.images.filter(
        img => img._id !== this.state.idObjectSelected
      );
      this.doNoObjectSelected();
      editorStore.replace(images);
    }
  }

  handleImageHover = (img, event) => {
    editorStore.idObjectHovered = img._id;
    editorStore.imageHovered = img;
  }

  handleImageSelected = (img) => {
    if (this.state.cropMode && img._id != this.state.idObjectSelected) {
      this.setState({ cropMode: false });
      this.doNoObjectSelected();
      return;
    }
    if (
      this.state.idObjectSelected &&
      img._id !== this.state.idObjectSelected
    ) {
      // document.getElementById(
      //   this.state.idObjectSelected + "_1"
      // ).style.outline = null;
      var temp = document.getElementById(this.state.idObjectSelected + "_1");
      if (temp) {
        temp.style.outline = null;
      }
    }
    if (img._id === this.state.idObjectSelected) {
      return;
    }

    if (img.backgroundColor) {
      this.setState({
        imgBackgroundColor: img.backgroundColor
      });
    }

    var scaleY;
    let images = editorStore.images.map(image => {
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

    editorStore.idObjectSelected = img._id;
    editorStore.imageSelected = img;
    editorStore.idObjectHovered = null;
    editorStore.imageHovered = null;

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
    this.setState({ showPopup: true, downloading: true }, () => {
      var aloCloned = document.getElementsByClassName("alo2");
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
            fonts: toJS(editorStore.fonts),
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
    this.setState(
      {
        // scale: 1,
        showPopup: true,
        bleed,
        downloading: true
      },
      () => {
        var aloCloned = document.getElementsByClassName("alo2");
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
            { fonts: toJS(editorStore.fonts), canvas },
            {
              headers: {
                "Content-Type": "text/html"
              },
              responseType: "blob"
            }
          )
          .then(response => {
            self.setState({
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
    this.setState({ showPopup: true, downloading: true }, () => {
      var aloCloned = document.getElementsByClassName("alo2");
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
            fonts: toJS(editorStore.fonts),
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
            // scale: previousScale,
            showPopup: false,
            downloading: false
          });
          self.download(`test.${png ? "png" : "jpeg"}`, response.data);

          document.getElementById("downloadPopup").style.display = "none";
          document.getElementById("editor").classList.remove("popup");
        });
    });
  }

  async saveImages(rep, isVideo) {
    var _id;
    this.setState({ isSaving: true });
    const { mode } = this.state;
    var self = this;
    const { rectWidth, rectHeight } = this.state;

    let images = toJS(self.props.images);
    images = images.map(image => {
      image.width2 = image.width / rectWidth;
      image.height2 = image.height / rectHeight;
      return image;
    });

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
        }
        return img;
      });
    }

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
          FontList: toJS(editorStore.fonts),
          Width: self.state.rectWidth,
          Height: self.state.rectHeight,
          Id: _id,
          Keywords: [],
          Canvas: canvas,
          Canvas2: canvas2,
          AdditionalStyle: a[0].outerHTML,
          FilePath: "/templates",
          FirstName: "Untilted",
          Pages: toJS(editorStore.pages),
          PrintType: self.state.subtype,
          Representative: rep ? rep : `images/${_id}.jpeg`,
          Representative2: `images/${_id}_2.jpeg`,
          VideoRepresentative: `videos/${_id}.mp4`,
          IsVideo: isVideo
        });

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
    const { scale } = this.state;
    let images = toJS(editorStore.images);
    let tempImages = images.map(image => {
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

    // this.setState({ images });
  }

  videoOnMouseDown(e) {
    e.preventDefault();

    var target = e.target.cloneNode(true);

    target.style.zIndex = "11111111111";
    target.src = e.target.getElementsByTagName("source")[0].getAttribute("src");
    target.style.width = e.target.getBoundingClientRect().width + "px";
    document.body.appendChild(target);
    var self = this;
    this.imgDragging = target;
    var posX = e.pageX - e.target.getBoundingClientRect().left;
    var dragging = true;
    var posY = e.pageY - e.target.getBoundingClientRect().top;

    var recScreenContainer = document
      .getElementById("screen-container-parent")
      .getBoundingClientRect();
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
            target.style.transitionDuration = "";
          }, 50);
        }

        if (
          beingInScreenContainer === true &&
          !(
            recScreenContainer.left < rec2.left &&
            recScreenContainer.right > rec2.right &&
            recScreenContainer.top < rec2.top &&
            recScreenContainer.bottom > rec2.bottom
          )
        ) {
          beingInScreenContainer = false;

          // target.style.width = (rec2.width / self.state.scale) + 'px';
          // target.style.height = (rec2.height / self.state.scale) + 'px';
          // target.style.transitionDuration = '0.05s';

          setTimeout(() => {
            target.style.transitionDuration = "";
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
      var pages = toJS(editorStore.pages);
      for (var i = 0; i < recs.length; ++i) {
        var rec = recs[i].getBoundingClientRect();
        if (
          rec.left < rec2.right &&
          rec.right > rec2.left &&
          rec.top < rec2.bottom &&
          rec.bottom > rec2.top
        ) {
          editorStore.addItem(
            {
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
              imgWidth: rec2.width / self.state.scale,
              imgHeight: rec2.height / self.state.scale,
              page: pages[i],
              zIndex: editorStore.upperZIndex + 1
            },
            false
          );

          // self.setState({ images, upperZIndex: this.state.upperZIndex + 1, });
        }
      }

      self.imgDragging.remove();
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  imgOnMouseDown(img, e) {
    e.preventDefault();
    var target = e.target.cloneNode(true);
    target.style.zIndex = "11111111111";
    target.src = img.representativeThumbnail
      ? img.representativeThumbnail
      : e.target.src;
    target.style.width = e.target.getBoundingClientRect().width + "px";
    target.style.backgroundColor = e.target.style.backgroundColor;
    document.body.appendChild(target);
    var self = this;
    this.imgDragging = target;
    var posX = e.pageX - e.target.getBoundingClientRect().left;
    var dragging = true;
    var posY = e.pageY - e.target.getBoundingClientRect().top;

    var recScreenContainer = document
      .getElementById("screen-container-parent")
      .getBoundingClientRect();
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

          setTimeout(() => {
            target.style.transitionDuration = "";
          }, 50);
        }

        if (
          beingInScreenContainer === true &&
          !(
            recScreenContainer.left < rec2.left &&
            recScreenContainer.right > rec2.right &&
            recScreenContainer.top < rec2.top &&
            recScreenContainer.bottom > rec2.bottom
          )
        ) {
          beingInScreenContainer = false;

          setTimeout(() => {
            target.style.transitionDuration = "";
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
      for (var i = 0; i < recs.length; ++i) {
        var rec = recs[i].getBoundingClientRect();
        if (
          rec.left < rec2.right &&
          rec.right > rec2.left &&
          rec.top < rec2.bottom &&
          rec.bottom > rec2.top
        ) {
          editorStore.addItem(
            {
              _id: uuidv4(),
              type: TemplateType.Image,
              width: rec2.width / self.state.scale,
              height: rec2.height / self.state.scale,
              origin_width: rec2.width / self.state.scale,
              origin_height: rec2.height / self.state.scale,
              left: (rec2.left - rec.left) / self.state.scale,
              top: (rec2.top - rec.top) / self.state.scale,
              rotateAngle: 0.0,
              src: !img.representative.startsWith("data")
                ? window.location.origin + "/" + img.representative
                : img.representative,
              backgroundColor: target.style.backgroundColor,
              selected: false,
              scaleX: 1,
              scaleY: 1,
              posX: 0,
              posY: 0,
              imgWidth: rec2.width / self.state.scale,
              imgHeight: rec2.height / self.state.scale,
              page: editorStore.pages[i],
              zIndex: editorStore.upperZIndex + 1,
              freeStyle: img.freeStyle
            },
            false
          );

          editorStore.increaseUpperzIndex();

          // self.setState({upperZIndex: this.state.upperZIndex + 1, });
        }
      }

      self.imgDragging.remove();
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  setSelectionColor = (color, e) => {
    // if (this.props.typeObjectSelected === TemplateType.Latex) {
    var images = editorStore.images.map(img => {
      if (img._id === this.state.idObjectSelected) {
        img.color = color;
        img.backgroundColor = color;
      }
      return img;
    });
    editorStore.replace(images);
    e.preventDefault();
    document.execCommand("foreColor", false, color);
    if (
      this.state.typeObjectSelected === TemplateType.Heading ||
      this.state.typeObjectSelected === TemplateType.TextTemplate
    ) {
      var a = document.getSelection();
      if (a && a.type === "Range") {
        this.handleFontColorChange(color);
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
        this.handleFontColorChange(color);
        document.execCommand("foreColor", false, color);
        sel.removeAllRanges();
      }
    }

    let images2 = toJS(editorStore.images);
    function insertAfter(newNode, referenceNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    var fonts = document.getElementsByTagName("font");
    for (var i = 0; i < fonts.length; ++i) {
      var font1: any = fonts[i];
      font1.parentNode.style.color = color;
      font1.parentNode.innerText = font1.innerText;
      font1.remove();
    }
  };

  onSingleTextChange(thisImage, e, childId) {
    // console.log('ToJS', toJS(editorStore.images));
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

    // console.log('ToJS', toJS(editorStore.images));

    e.persist();
    setTimeout(() => {
      const { scale } = this.state;
      if (!childId) {
        let images = toJS(editorStore.images);
        // console.log('images 3', images);
        let tempImages = images.map(image => {
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

        editorStore.replace(images);

        // this.setState({ images, editing: true });
      } else {
        let images = toJS(editorStore.images);
        // console.log('images ', images);
        let tempImages = images.map(image => {
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
        editorStore.replace(images);
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

  handleSidebarSelectorClicked = (selectedTab: SidebarTab, e: any) => {
    e.preventDefault();
    this.setState({
      toolbarOpened: true,
      selectedTab: selectedTab
    });
  };

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
    this.setState({ fontColor });
  };

  handleFontFamilyChange = fontId => {
    if (fontId) {
      var font = toJS(editorStore.fontsList).find(font => font.id === fontId);
      if (font) {
        this.setState({ fontName: font.representative });
      }
    }
  };

  enableCropMode = e => {
    this.setState({ cropMode: true });
  };

  toggleImageResizing = e => {
    // this.setState({ resizingInnerImage: !this.state.resizingInnerImage });
  };

  addAPage = (e, id) => {
    e.preventDefault();
    let pages = toJS(editorStore.pages);
    var newPageId = uuidv4();
    pages.splice(pages.findIndex(img => img === id) + 1, 0, newPageId);
    // this.setState({
    //   pages
    // });
    editorStore.pages.replace(pages);
    setTimeout(() => {
      document.getElementById(newPageId).scrollIntoView();
    }, 100);
  };

  forwardSelectedObject = id => {
    let images = toJS(editorStore.images);
    let tempImages = images.map(img => {
      if (img._id === this.state.idObjectSelected) {
        img.zIndex = editorStore.upperZIndex + 1;
      }
      return img;
    });

    editorStore.images.replace(tempImages);
    editorStore.increaseUpperzIndex();

    // this.setState({ upperZIndex: this.state.upperZIndex + 1 });
  };

  backwardSelectedObject = id => {
    let images = toJS(editorStore.images);
    let tempImages = images.map(img => {
      if (img._id === this.state.idObjectSelected) {
        img.zIndex = 2;
      } else {
        img.zIndex += 1;
      }
      return img;
    });

    editorStore.images.replace(tempImages);

    // this.setState({ upperZIndex: this.state.upperZIndex + 1 });
  };

  renderCanvas(preview, index, downloading) {
    var res = [];
    let pages = toJS(editorStore.pages);
    for (var i = 0; i < pages.length; ++i) {
      if (index >= 0 && i != index) {
        continue;
      }

      res.push(
        <Canvas
          id={pages[i]}
          translate={this.translate}
          rotating={this.state.rotating}
          // resizing={this.state.resizing}
          // dragging={this.state.dragging}
          isSaving={this.state.isSaving}
          downloading={downloading}
          bleed={this.state.bleed}
          key={i}
          staticGuides={this.state.staticGuides}
          index={i}
          addAPage={this.addAPage}
          images={editorStore.images.filter(img => img.page === pages[i])}
          mode={this.state.mode}
          rectWidth={this.state.rectWidth}
          rectHeight={this.state.rectHeight}
          scale={downloading ? 1 : this.state.scale}
          childId={this.state.childId}
          cropMode={this.state.cropMode}
          handleImageSelected={this.handleImageSelected}
          handleImageHover={this.handleImageHover}
          handleRotateStart={this.handleRotateStart}
          handleRotate={this.handleRotate}
          handleRotateEnd={this.handleRotateEnd}
          handleResizeStart={this.handleResizeStart}
          handleDragStart={this.handleDragStart}
          onSingleTextChange={this.onSingleTextChange.bind(this)}
          handleFontSizeChange={this.handleFontSizeChange}
          handleFontColorChange={this.handleFontColorChange}
          handleFontFamilyChange={this.handleFontFamilyChange}
          handleChildIdSelected={this.handleChildIdSelected}
          enableCropMode={this.enableCropMode}
          handleImageResize={this.handleImageResize}
          handleResizeInnerImageStart={this.handleResizeInnerImageStart}
          updateRect={this.state.updateRect}
          doNoObjectSelected={this.doNoObjectSelected}
          idObjectSelected={this.state.idObjectSelected}
          handleDeleteThisPage={this.handleDeleteThisPage.bind(this, pages[i])}
          showPopup={this.state.showPopup}
          preview={preview}
        />
      );
    }

    return res;
  }

  handleDeleteThisPage = pageId => {
    let pages = toJS(editorStore.pages);
    let tempPages = pages.filter(pId => pId !== pageId);
    editorStore.pages.replace(tempPages);
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

      this.saveImages(rep, false);

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
    let images = toJS(editorStore.images);
    let tempImages = images.map(img => {
      if (img._id === this.state.idObjectSelected) {
        img.opacity = opacity;
      }
      return img;
    });

    editorStore.images.replace(tempImages);
  };

  refFullName = null;
  refAddress = null;
  refCity = null;
  refPhoneNumber = null;

  render() {
    const {
      scale,
      rectWidth,
      rectHeight,
    } = this.state;

    const adminEmail = "llaugusty@gmail.com";

    return (
      <div>
        <div
          id="editor"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Helmet>
            <title>{this.props.tReady && this.translate("design")}</title>
          </Helmet>
          <div
            id="editor-navbar"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgb(67, 198, 172), rgb(48, 45, 111))",
              height: "55px",
              padding: "5px",
              display: "flex"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center"
              }}
            >
              {this.state.mounted && (
                <a
                  id="logo-editor"
                  style={{
                    color: "white",
                    display: "inline-block",
                    padding: "5px 8px 5px 5px",
                    borderRadius: "6px",
                    marginLeft: "5px"
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
                        fontFamily: "AvenirNextRoundedPro"
                      }}
                    >
                      <span>
                        <Home width="24px" height="24px" />
                      </span>
                      {this.props.tReady ? this.translate("home") : ""}
                    </div>
                  </span>
                </a>
              )}
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
                    onClick={this.saveImages.bind(this, null, false)}
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
              {Globals.serviceUser &&
                Globals.serviceUser.username &&
                Globals.serviceUser.username === adminEmail && (
                  <button
                    className="toolbar-btn dropbtn-font"
                    onClick={this.saveImages.bind(this, null, true)}
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
                    <span>Lưu video</span>
                  </button>
                )}
              {this.props.tReady && (
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
                    height: "35px",
                    width: "36px"
                  }}
                >
                  {/* {" "} */}
                  <DownloadIcon fill="white" width="18px" height="18px" />
                </button>
              )}
              {this.props.tReady && (
                <DownloadList
                  downloadPNG={this.downloadPNG.bind(this)}
                  downloadPDF={this.downloadPDF.bind(this)}
                  downloadVideo={this.downloadVideo.bind(this)}
                  translate={this.translate}
                />
              )}
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
              overflow: "hidden"
            }}
          >
            <LeftSide
              handleEditFont={this.handleEditFont}
              scale={this.state.scale}
              fontId={""}
              tReady={this.props.tReady}
              translate={this.translate.bind(this)}
              textOnMouseDown={this.textOnMouseDown.bind(this)}
              videoOnMouseDown={this.videoOnMouseDown.bind(this)}
              imgOnMouseDown={this.imgOnMouseDown.bind(this)}
              setSelectionColor={this.setSelectionColor.bind(this)}
              mounted={this.state.mounted}
              subtype={this.state.subtype}
              selectFont={this.selectFont.bind(this)}
              handleFontColorChange={this.handleFontColorChange.bind(this)}
              typeObjectSelected={this.state.typeObjectSelected}
              idObjectSelected={this.state.idObjectSelected}
              childId={this.state.childId}
              rectWidth={this.state.rectWidth}
              rectHeight={this.state.rectHeight}
              toolbarOpened={this.state.toolbarOpened}
              toolbarSize={this.state.toolbarSize}
              mode={this.state.mode}
              selectedTab={this.state.selectedTab}
              handleSidebarSelectorClicked={this.handleSidebarSelectorClicked}
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
                backgroundColor: "#ECF0F2",
                position: "relative",
                height: "100%"
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
                ></button>
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
                {this.state.idObjectSelected &&
                  this.state.selectedImage &&
                  (this.state.selectedImage.type === TemplateType.Heading ||
                    this.state.selectedImage.type === TemplateType.Latex ||
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
                  this.state.selectedImage.type === TemplateType.Heading) ||
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
                  this.state.selectedImage.type === TemplateType.Heading) ||
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
                  this.state.selectedImage.type === TemplateType.Heading) ||
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
                      position: "relative"
                    }}
                  >
                    <img
                      style={{ height: "21px", filter: "invert(1)" }}
                      src={this.state.fontName}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      style={{
                        pointerEvents: "none",
                        position: "absolute",
                        right: "10px",
                        top: "4px"
                      }}
                    >
                      <path
                        fill="currentColor"
                        d="M11.71 6.47l-3.53 3.54c-.1.1-.26.1-.36 0L4.3 6.47a.75.75 0 1 0-1.06 1.06l3.53 3.54c.69.68 1.8.68 2.48 0l3.53-3.54a.75.75 0 0 0-1.06-1.06z"
                      ></path>
                    </svg>
                  </a>
                )}
                {this.state.idObjectSelected &&
                  (this.state.selectedImage.type === TemplateType.Image ||
                    this.state.selectedImage.type === TemplateType.Video) && (
                    <div
                      style={{
                        position: "relative"
                      }}
                    >
                      {!this.state.cropMode && (
                        <button
                          style={{
                            // boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                            height: "26px",
                            top: 0
                          }}
                          className="dropbtn-font dropbtn-font-size"
                          onClick={e => {
                            this.setState({ cropMode: true });
                          }}
                        >
                          <span>{this.translate("crop")}</span>
                        </button>
                      )}
                    </div>
                  )}
                {this.state.selectedImage &&
                  this.state.selectedImage.type === TemplateType.Image &&
                  this.state.selectedImage.backgroundColor && (
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
                <div
                  style={{
                    position: "relative",
                    display:
                      (this.state.selectedImage &&
                        this.state.selectedImage.type ===
                          TemplateType.Heading) ||
                      this.state.childId
                        ? "block"
                        : "none"
                  }}
                >
                  <FontSize fontSize={this.state.fontSize} />
                  <div
                    style={{
                      height: "50px",
                      left: "0px",
                      top: "calc(100% + 8px)",
                      width: "100px",
                      padding: "0",
                      background: "white",
                      animation: "bounce 1.2s ease-out"
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
                  this.state.selectedImage.type === TemplateType.Heading) ||
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
                        fillRule="evenodd"
                        d="M20.25 5.25a.75.75 0 1 1 0 1.5H3.75a.75.75 0 0 1 0-1.5h16.5zm0 4a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5h8.5zm0 4a.75.75 0 1 1 0 1.5H3.75a.75.75 0 1 1 0-1.5h16.5zm0 4a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5h8.5z"
                      ></path>
                    </svg>
                  </a>
                )}
                {((this.state.idObjectSelected &&
                  this.state.selectedImage.type === TemplateType.Heading) ||
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
                        fillRule="evenodd"
                        d="M3.75 5.25h16.5a.75.75 0 1 1 0 1.5H3.75a.75.75 0 0 1 0-1.5zm4 4h8.5a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5zm-4 4h16.5a.75.75 0 1 1 0 1.5H3.75a.75.75 0 1 1 0-1.5zm4 4h8.5a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5z"
                      ></path>
                    </svg>
                  </a>
                )}
                {((this.state.idObjectSelected &&
                  this.state.selectedImage.type === TemplateType.Heading) ||
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
                        fillRule="evenodd"
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M4.53 11.9L9 16.38 19.44 5.97a.75.75 0 0 1 1.06 1.06L9.53 17.97c-.3.29-.77.29-1.06 0l-5-5c-.7-.71.35-1.77 1.06-1.07z"
                      ></path>
                    </svg>
                    <span style={{ marginLeft: "5px" }}>
                      {this.translate("ok")}
                    </span>
                  </button>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M13.06 12.15l5.02-5.03a.75.75 0 1 0-1.06-1.06L12 11.1 6.62 5.7a.75.75 0 1 0-1.06 1.06l5.38 5.38-5.23 5.23a.75.75 0 1 0 1.06 1.06L12 13.2l4.88 4.87a.75.75 0 1 0 1.06-1.06l-4.88-4.87z"
                      ></path>
                    </svg>
                    <span style={{ marginLeft: "5px" }}>
                      {this.translate("cancel")}
                    </span>
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
                      {this.translate("position")}
                    </button>
                    <button
                      style={{
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                        height: "26px",
                        width: "30px",
                        padding: 0
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
                        <g fill="currentColor" fillRule="evenodd">
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
                        animation: "bounce 1.2s ease-out"
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
                            <span style={{ lineHeight: "24px" }}>
                              {/* Lên trên */}
                              {this.translate("forward")}
                            </span>
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
                              {/* Xuống dưới */}
                              {this.translate("backward")}
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
                        animation: "bounce 1.2s ease-out"
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
                        {/* Mức trong suốt */}
                        {this.translate("transparent")}:{" "}
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
                                scale = Math.max(1, scale);
                                scale = Math.min(100, scale);

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
                id="screen-container-parent"
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
                {this.state.mounted && (
                  <div
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
                      if (
                        (e.target as Element).id === "screen-container"
                        // !this.state.dragging &&
                        // !this.state.resizing
                      ) {
                        // this.doNoObjectSelected();
                      }
                    }}
                  >
                    {this.state.downloading && (
                      <div
                        style={{
                          display: "none"
                        }}
                      >
                        {this.renderCanvas(false, -1, true)}
                      </div>
                    )}
                    {this.renderCanvas(false, -1, false)}
                  </div>
                )}
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
                            {this.translate("fit")}
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                  {this.state.mounted && (
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
                              this.setState({
                                scale: Math.max(0.1, this.state.scale - 0.15)
                              });
                            }}
                            style={{
                              border: "none",
                              background: "transparent"
                            }}
                            className="zoomMinus___1Ooi5"
                            data-test="zoomMinus"
                            data-categ="tools"
                            data-value="zoomOut"
                            data-subcateg="bottomPanel"
                          >
                            <svg
                              style={{
                                width: "25px",
                                height: "25px"
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
                                height: "40px",
                                color: "white",
                                border: "none",
                                background: "transparent",
                                width: "55px",
                                fontSize: "18px"
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
                              height: "40px"
                            }}
                            className="zoomPlus___1TbHD"
                            data-test="zoomPlus"
                            data-categ="tools"
                            data-value="zoomIn"
                            data-subcateg="bottomPanel"
                          >
                            <svg
                              style={{
                                width: "25px",
                                height: "25px"
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
                  )}
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
                          firstPage={this.renderCanvas(true, 0, false)}
                          secondPage={this.renderCanvas(true, 1, false)}
                        ></BusinessCardReview>
                      )}
                      {this.state.subtype == SubType.FlyerReview && (
                        <FlyerReview>
                          {this.renderCanvas(true, 0, false)}
                        </FlyerReview>
                      )}
                      {this.state.subtype == SubType.PosterReview && (
                        <TrifoldReview>
                          {this.renderCanvas(true, 0, false)}
                        </TrifoldReview>
                      )}

                      {this.state.subtype == SubType.TrifoldReview && (
                        <PosterReview>
                          {this.renderCanvas(true, 0, false)}
                        </PosterReview>
                      )}
                      {this.state.subtype > SubType.TrifoldReview && (
                        <CanvasReview width={500} height={500}>
                          {this.renderCanvas(true, 0, false)}
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

export default withTranslation(NAMESPACE)(CanvaEditor);
