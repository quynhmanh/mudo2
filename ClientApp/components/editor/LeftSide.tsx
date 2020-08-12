import React, { Component } from "react";
import TopMenu from "@Components/editor/Sidebar";
import Globals from "@Globals";
import ImagePicker from "@Components/shared/ImagePicker";
import VideoPicker from "@Components/shared/VideoPicker2";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import axios from "axios";
import uuidv4 from "uuid/v4";
import { getMostProminentColor } from "@Utils";
import { toJS } from "mobx";
import editorStore from "@Store/EditorStore";
import TooltipClick from "@Components/shared/TooltipClick";
import ColorPicker from "@Components/editor/ColorPicker";
import Pickr from "@Components/pickr";
import { observer } from "mobx-react";
import Slider from "@Components/editor/Slider";

export interface IProps {
  toolbarOpened: any;
  toolbarSize: any;
  mode: any;
  handleSidebarSelectorClicked: any;
  selectedTab: any;
  rectWidth: number;
  rectHeight: number;
  idObjectSelected: string;
  childId: string;
  typeObjectSelected: any;
  handleFontColorChange: any;
  selectFont: any;
  subtype: any;
  mounted: boolean;
  setSelectionColor: any;
  imgOnMouseDown: any;
  videoOnMouseDown: any;
  textOnMouseDown: any;
  translate: any;
  tReady: boolean;
  fontId: any;
  scale: number;
  handleEditFont: any;
  handleImageSelected: any;
  colorPickerShown: any;
  handleApplyEffect: any;
  selectedImage: any;
  pauser: any;
  handleChangeOffset: any;
  handleChangeOffsetEnd: any;
  handleChangeBlur: any;
  handleChangeBlurEnd: any;
  handleChangeTextShadowTransparent: any;
  handleChangeTextShadowTransparentEnd: any;
  handleChangeIntensity: any;
  handleChangeIntensityEnd: any;
  handleChangeHollowThickness: any;
  handleChangeHollowThicknessEnd: any;
  handleChangeDirection: any;
  handleChangeDirectionEnd: any;
}

interface IState {
  isLoading: boolean;
  items: any;
  items2: any;
  hasMoreFonts: boolean;
  userUpload1: any;
  userUpload2: any;
  currentUserUpload1: number;
  currentUserUpload2: number;
  currentItemsHeight: any;
  currentItems2Height: any;
  cursor: any;
  hasMoreImage: any;
  error: any;
  mounted: boolean;
  backgrounds1: any;
  backgrounds2: any;
  backgrounds3: any;
  groupedTexts: any;
  groupedTexts2: any;
  templates: any;
  templates2: any;
  images: any;
  removeImages1: any;
  removeImages2: any;
  videos: any;
  hasMoreVideos: any;
  isBackgroundLoading: boolean;
  currentBackgroundHeights1: number;
  currentBackgroundHeights2: number;
  currentBackgroundHeights3: number;
  isTextTemplateLoading: boolean;
  currentGroupedTextsHeight: number;
  currentGroupedTexts2Height: number;
  hasMoreTemplate: boolean;
  isTemplateLoading: any;
  hasMoreTextTemplate: boolean;
  isUserUploadLoading: boolean;
  hasMoreUserUpload: boolean;
  isRemovedBackgroundImageLoading: boolean;
  hasMoreRemovedBackground: boolean;
  currentHeightRemoveImage1: number;
  currentHeightRemoveImage2: number;
  hasMoreBackgrounds: boolean;
  currentTemplatesHeight: number;
  currentTemplate2sHeight: number;
  isLoadingFont: boolean;
}

const imgWidth = 162;
const backgroundWidth = 105;

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
  Emoji = 992,
  Effect = 1984,
}

const adminEmail = "llaugusty@gmail.com";

class LeftSide extends Component<IProps, IState> {
  state = {
    query: "",
    isLoading: false,
    items: [],
    items2: [],
    hasMoreFonts: true,
    isLoadingFont: false,
    userUpload1: [],
    userUpload2: [],
    currentItemsHeight: 0,
    currentItems2Height: 0,
    cursor: null,
    hasMoreImage: true,
    error: null,
    mounted: true,
    backgrounds1: [],
    backgrounds2: [],
    backgrounds3: [],
    groupedTexts: [],
    groupedTexts2: [],
    templates: [],
    templates2: [],
    images: [],
    removeImages1: [],
    removeImages2: [],
    videos: [],
    isBackgroundLoading: false,
    currentBackgroundHeights1: 0,
    currentBackgroundHeights2: 0,
    currentBackgroundHeights3: 0,
    currentGroupedTextsHeight: 0,
    currentGroupedTexts2Height: 0,
    currentTemplatesHeight: 0,
    currentTemplate2sHeight: 0,
    hasMoreTemplate: true,
    isTemplateLoading: false,
    subtype: null,
    isTextTemplateLoading: false,
    hasMoreTextTemplate: true,
    currentHeightRemoveImage1: 0,
    currentHeightRemoveImage2: 0,
    currentUserUpload1: 0,
    currentUserUpload2: 0,
    hasMoreBackgrounds: true,
    isUserUploadLoading: false,
    hasMoreUserUpload: true,
    isRemovedBackgroundImageLoading: false,
    hasMoreRemovedBackground: true,
    hasMoreVideos: true
  };

  constructor(props) {
    super(props);
    this.handleColorPick = this.handleColorPick.bind(this);
  }

  componentDidMount() {
    this.loadMore.bind(this)(true);
    this.loadMoreBackground.bind(this)(true);
    this.loadMoreFont.bind(this)(true);
    this.loadMoreTextTemplate.bind(this)(true);
    this.loadMoreTemplate.bind(this)(true, this.props.subtype);
    this.loadmoreUserUpload.bind(this)(true);
    this.loadMoreVideo.bind(this)(true);
    this.forceUpdate();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.subtype !== prevProps.subtype) {
      this.loadMoreTemplate.bind(this)(true, this.state.subtype);
    }
  }

  loadMoreVideo = initialLoad => {
    let pageId;
    let count;
    if (initialLoad) {
      pageId = 1;
      count = 30;
    } else {
      pageId = editorStore.fontsList.length / 30 + 1;
      count = 30;
    }
    // this.setState({ isLoading: true, error: undefined });
    const url = `/api/Media/Search?page=${pageId}&perPage=${count}&type=${TemplateType.Video}`;
    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          this.setState(state => ({
            videos: [...state.videos, ...res.value.key],
            hasMoreVideos:
              res.value.value > state.videos.length + res.value.key.length
          }));
        },
        error => {
          // this.setState({ isLoading: false, error })
        }
      );
  };

  handleRemoveAllMedia = () => {
    var model;
    if (
      this.props.selectedTab === SidebarTab.Image ||
      this.props.selectedTab === SidebarTab.Background
    ) {
      model = "Media";
    } else if (
      this.props.selectedTab === SidebarTab.Template ||
      this.props.selectedTab === SidebarTab.Text
    ) {
      model = "Template";
    }
    const url = `/api/${model}/RemoveAll`;

    fetch(url);
  };

  uploadFont = e => {
    var self = this;
    var fileUploader = document.getElementById(
      "image-file"
    ) as HTMLInputElement;
    var file = fileUploader.files[0];
    var fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = () => {
      var url = `/api/Font/Add`;
      axios.post(url, { id: uuidv4(), data: fr.result }).then(() => {
        self.setState({ hasMoreFonts: true });
      });
    };
  };

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
        type: TemplateType.Video,
        ext: file.name.split(".")[1]
      });
    };
  };

  uploadImage = (type, removeBackground, e) => {
    var self = this;
    var fileUploader = document.getElementById(
      "image-file"
    ) as HTMLInputElement;
    var file = fileUploader.files[0];
    var fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = () => {
      var url = `/api/Media/Add`;
      if (type === TemplateType.RemovedBackgroundImage) {
        url = `/api/Media/Add2`;
      }
      var i = new Image();

      self.setState({
        userUpload1: [{ representative: fr.result }, ...self.state.userUpload1]
      });

      i.onload = function() {
        var prominentColor = getMostProminentColor(i);
        axios
          .post(url, {
            id: uuidv4(),
            ext: file.name.split(".")[1],
            userEmail: Globals.serviceUser.username,
            color: `rgb(${prominentColor.r}, ${prominentColor.g}, ${prominentColor.b})`,
            data: fr.result,
            width: i.width,
            height: i.height,
            type,
            keywords: ["123", "123"],
            title: "Manh quynh"
          })
          .then(() => {});
      };

      i.src = fr.result.toString();
    };
  };

  loadMore = (initialLoad: Boolean) => {
    let pageId;
    let count;
    if (initialLoad) {
      pageId = 1;
      count = 15;
    } else {
      pageId = (this.state.items.length + this.state.items2.length) / 15 + 1;
      count = 15;
    }
    this.setState({ isLoading: true, error: undefined });
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
              currentItemsHeight +=
                imgWidth / (currentItem.width / currentItem.height);
            } else {
              res2.push(currentItem);
              currentItems2Height +=
                imgWidth / (currentItem.width / currentItem.height);
            }
          }
          this.setState(state => ({
            items: [...state.items, ...res1],
            items2: [...state.items2, ...res2],
            currentItemsHeight,
            currentItems2Height,
            cursor: res.cursor,
            isLoading: false,
            hasMoreImage:
              res.value.value >
              state.items.length + state.items2.length + res.value.key.length
          }));

          this.forceUpdate();
        },
        error => {
          this.setState({ isLoading: false, error });
        }
      );
  };

  handleQuery = e => {
    if (e.key === "Enter") {
      this.setState({items: [], items2: [] }, () => {
        this.loadMore(true);
      });
    }
  };

  imgDragging = null;

  handleEditmedia = item => {
    // this.setState({showMediaEditPopup: true, editingMedia: item})
  };

  backgroundOnMouseDown(item, e) {
    var rec2 = e.target.getBoundingClientRect();
    var { rectWidth, rectHeight } = this.props;
    var imgRatio = rec2.width / rec2.height;
    var width = rectWidth;
    var height = rectWidth / imgRatio;
    if (height < rectHeight) {
      height = rectHeight;
      width = imgRatio * height;
    }

    editorStore.addItem(
      {
        _id: uuidv4(),
        type: TemplateType.BackgroundImage,
        width: rectWidth,
        height: rectHeight,
        origin_width: width,
        origin_height: height,
        left: 0,
        top: 0,
        rotateAngle: 0.0,
        src: window.location.origin + "/" + item.representative,
        selected: false,
        scaleX: 1,
        scaleY: 1,
        posX: -(width - rectWidth) / 2,
        posY: -(height - rectHeight) / 2,
        imgWidth: width,
        imgHeight: height,
        page: editorStore.activePageId,
        zIndex: 1,
        width2: 1,
        height2: 1,
        document_object: [],
        ref: null,
        innerHTML: null,
        color: null,
        opacity: 100,
        backgroundColor: null,
        childId: null
      },
      false
    );
  }

  handleEditFont = item => {
    // this.setState({showFontEditPopup: true, editingFont: item});
    this.props.handleEditFont(item);
  };

  textOnMouseDown = (id, e) => {
    var doc = this.state.groupedTexts.find(doc => doc.id == id);
    if (!doc) {
      doc = this.state.groupedTexts2.find(doc => doc.id == id);
    }

    this.props.textOnMouseDown(e, doc);
  };

  templateOnMouseDown(id, e) {
    editorStore.doNoObjectSelected();
    var ce = document.createElement.bind(document);
    var ca = document.createAttribute.bind(document);
    var ge = document.getElementsByTagName.bind(document);
    e.preventDefault();

    var self = this;
    const url = `/api/Template/Get?id=${id}`;
    const { rectWidth, rectHeight } = this.props;
    var doc = this.state.templates.find(doc => doc.id == id);
    if (!doc) {
      doc = this.state.templates2.find(doc => doc.id == id);
    }
    var template = JSON.parse(doc.document);
    var scaleX = rectWidth / template.width;
    var scaleY = rectHeight / template.height;

    template.document_object = template.document_object.map(doc => {
      doc.width = doc.width * scaleX;
      doc.height = doc.height * scaleY;
      doc.top = doc.top * scaleY;
      doc.left = doc.left * scaleX;
      doc.scaleX = doc.scaleX * scaleX;
      doc.scaleY = doc.scaleY * scaleY;
      doc.page = editorStore.activePageId;
      doc.imgWidth = doc.imgWidth * scaleX;
      doc.imgHeight = doc.imgHeight * scaleY;

      return doc;
    });

    if (doc.fontList) {
      doc.fontList.forEach(id => {
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

    editorStore.applyTemplate(template.document_object);

    var fonts = toJS(editorStore.fonts);
    let tempFonts = [...fonts, ...doc.fontList];
    editorStore.fonts.replace(tempFonts);
  }

  loadMoreTemplate = (initalLoad, subtype) => {
    let pageId;
    let count;
    if (initalLoad) {
      pageId = 1;
      count = 10;
    } else {
      pageId =
        Math.round(
          (this.state.templates.length + this.state.templates2.length) / 5
        ) + 1;
      count = 5;
    }
    this.setState({ isTemplateLoading: true, error: undefined });
    var subtype = subtype ? subtype : this.props.subtype;
    const url = `/api/Template/Search?Type=${TemplateType.Template}&page=${pageId}&perPage=${count}&printType=${subtype}`;

    if (!subtype) {
      return;
    }

    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          var result = res.value.key;
          var currentTemplatesHeight = this.state.currentTemplatesHeight;
          var currentTemplate2sHeight = this.state.currentTemplate2sHeight;
          var res1 = [];
          var res2 = [];
          for (var i = 0; i < result.length; ++i) {
            var currentItem = result[i];
            if (currentTemplatesHeight <= currentTemplate2sHeight) {
              res1.push(currentItem);
              currentTemplatesHeight +=
                imgWidth / (currentItem.width / currentItem.height);
            } else {
              res2.push(currentItem);
              currentTemplate2sHeight +=
                imgWidth / (currentItem.width / currentItem.height);
            }
          }
          this.setState(state => ({
            templates: [...state.templates, ...res1],
            templates2: [...state.templates2, ...res2],
            currentTemplatesHeight,
            currentTemplate2sHeight,
            isTemplateLoading: false,
            hasMoreTemplate:
              res.value.value >
              state.templates.length +
                state.templates2.length +
                res.value.key.length
          }));

          this.forceUpdate();
        },
        error => {
          // this.setState({ isLoading: false, error })
        }
      );
  };

  loadMoreBackground = initialload => {
    let pageId;
    let count;
    if (initialload) {
      pageId = 1;
      count = 30;
    } else {
      pageId =
        (this.state.backgrounds1.length +
          this.state.backgrounds2.length +
          this.state.backgrounds3.length) /
          5 +
        1;
      count = 15;
    }
    this.setState({ isBackgroundLoading: true, error: undefined });
    const url = `/api/Media/Search?type=${TemplateType.BackgroundImage}&page=${pageId}&perPage=${count}`;
    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          var result = res.value.key;
          var currentBackgroundHeights1 = this.state.currentBackgroundHeights1;
          var currentBackgroundHeights2 = this.state.currentBackgroundHeights2;
          var currentBackgroundHeights3 = this.state.currentBackgroundHeights3;
          var res1 = [];
          var res2 = [];
          var res3 = [];
          for (var i = 0; i < result.length; ++i) {
            var currentItem = result[i];
            if (
              currentBackgroundHeights1 <= currentBackgroundHeights2 &&
              currentBackgroundHeights1 <= currentBackgroundHeights3
            ) {
              res1.push(currentItem);
              currentBackgroundHeights1 +=
                backgroundWidth / (currentItem.width / currentItem.height);
            } else if (
              currentBackgroundHeights2 <= currentBackgroundHeights1 &&
              currentBackgroundHeights2 <= currentBackgroundHeights3
            ) {
              res2.push(currentItem);
              currentBackgroundHeights2 +=
                backgroundWidth / (currentItem.width / currentItem.height);
            } else {
              res3.push(currentItem);
              currentBackgroundHeights3 +=
                backgroundWidth / (currentItem.width / currentItem.height);
            }
          }
          this.setState(state => ({
            backgrounds1: [...state.backgrounds1, ...res1],
            backgrounds2: [...state.backgrounds2, ...res2],
            backgrounds3: [...state.backgrounds3, ...res3],
            currentBackgroundHeights1,
            currentBackgroundHeights2,
            currentBackgroundHeights3,
            isBackgroundLoading: false,
            hasMoreBackgrounds:
              res.value.value >
              state.items.length + state.items2.length + res.value.key.length
          }));

          this.forceUpdate();
        },
        error => {
          this.setState({ isBackgroundLoading: false, error });
        }
      );
  };

  loadMoreTextTemplate = initalLoad => {
    let pageId;
    let count;
    if (initalLoad) {
      pageId = 1;
      count = 10;
    } else {
      pageId =
        (this.state.groupedTexts.length + this.state.groupedTexts2.length) / 1 +
        1;
      count = 1;
    }
    this.setState({ isTextTemplateLoading: true, error: undefined });
    const url = `/api/Template/Search?Type=${TemplateType.TextTemplate}&page=${pageId}&perPage=${count}`;
    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          var result = res.value.key;
          var currentGroupedTextsHeight = this.state.currentGroupedTextsHeight;
          var currentGroupedTexts2Height = this.state
            .currentGroupedTexts2Height;
          var res1 = [];
          var res2 = [];
          for (var i = 0; i < result.length; ++i) {
            var currentItem = result[i];

            if (currentGroupedTextsHeight <= currentGroupedTexts2Height) {
              res1.push(currentItem);
              currentGroupedTextsHeight +=
                imgWidth / (currentItem.width / currentItem.height);
            } else {
              res2.push(currentItem);
              currentGroupedTexts2Height +=
                imgWidth / (currentItem.width / currentItem.height);
            }
          }
          this.setState(state => ({
            groupedTexts: [...state.groupedTexts, ...res1],
            groupedTexts2: [...state.groupedTexts2, ...res2],
            currentGroupedTextsHeight,
            currentGroupedTexts2Height,
            isTextTemplateLoading: false,
            hasMoreTextTemplate:
              res.value.value >
              state.groupedTexts.length +
                state.groupedTexts2.length +
                res.value.key.length
          }));

          this.forceUpdate();
        },
        error => {
          this.setState({ isTextTemplateLoading: false, error });
        }
      );
  };

  loadmoreUserUpload = initialload => {
    if (!Globals.serviceUser || !Globals.serviceUser.username) {
      this.setState(state => ({
        isUserUploadLoading: false,
        hasMoreUserUpload: false
      }));
      return;
    }
    let pageId;
    let count;
    if (initialload) {
      pageId = 1;
      count = 15;
    } else {
      pageId =
        (this.state.userUpload1.length + this.state.userUpload2.length) / 15 +
        1;
      count = 15;
    }
    this.setState({ isUserUploadLoading: true, error: undefined });
    const url = `/api/Media/Search?type=${TemplateType.UserUpload}&page=${pageId}&perPage=${count}&userEmail=${Globals.serviceUser.username}`;
    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          var result = res.value.key;
          var currentUserUpload1 = this.state.currentUserUpload1;
          var currentUserUpload2 = this.state.currentUserUpload2;
          var res1 = [];
          var res2 = [];
          for (var i = 0; i < result.length; ++i) {
            var currentItem = result[i];
            if (currentUserUpload1 <= currentUserUpload2) {
              res1.push(currentItem);
              currentUserUpload1 +=
                imgWidth / (currentItem.width / currentItem.height);
            } else {
              res2.push(currentItem);
              currentUserUpload2 +=
                imgWidth / (currentItem.width / currentItem.height);
            }
          }

          this.setState(state => ({
            userUpload1: [...state.userUpload1, ...res1],
            userUpload2: [...state.userUpload2, ...res2],
            currentUserUpload1,
            currentUserUpload2,
            isUserUploadLoading: false,
            hasMoreUserUpload:
              res.value.value >
              state.userUpload2.length +
                state.userUpload1.length +
                res.value.key.length
          }));

          this.forceUpdate();
        },
        error => {
          this.setState({ isUserUploadLoading: false, error });
        }
      );
  };

  loadMoreRemovedBackgroundImage = (initialLoad: Boolean) => {
    let pageId;
    let count;
    if (initialLoad) {
      pageId = 1;
      count = 15;
    } else {
      pageId = (this.state.items.length + this.state.items2.length) / 15 + 1;
      count = 15;
    }
    this.setState({ isRemovedBackgroundImageLoading: true, error: undefined });
    // const url = `https://api.unsplash.com/photos?page=1&&client_id=500eac178a285523539cc1ec965f8ee6da7870f7b8678ad613b4fba59d620c29&&query=${this.state.query}&&per_page=${count}&&page=${pageId}`;
    const url = `/api/Media/Search?type=${TemplateType.RemovedBackgroundImage}&page=${pageId}&perPage=${count}&terms=${this.state.query}`;
    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          var result = res.value.key;
          var currentHeightRemoveImage1 = this.state.currentHeightRemoveImage1;
          var currentHeightRemoveImage2 = this.state.currentHeightRemoveImage2;
          var res1 = [];
          var res2 = [];
          for (var i = 0; i < result.length; ++i) {
            var currentItem = result[i];
            if (currentHeightRemoveImage1 <= currentHeightRemoveImage2) {
              res1.push(currentItem);
              currentHeightRemoveImage1 +=
                imgWidth / (currentItem.width / currentItem.height);
            } else {
              res2.push(currentItem);
              currentHeightRemoveImage2 +=
                imgWidth / (currentItem.width / currentItem.height);
            }
          }
          this.setState(state => ({
            removeImages1: [...state.removeImages1, ...res1],
            removeImages2: [...state.removeImages2, ...res2],
            currentHeightRemoveImage1,
            currentHeightRemoveImage2,
            isRemovedBackgroundImageLoading: false,
            hasMoreRemovedBackground:
              res.value.value >
              state.items.length + state.items2.length + res.value.key.length
          }));

          this.forceUpdate();
        },
        error => {
          this.setState({ isRemovedBackgroundImageLoading: false, error });
        }
      );
  };

  loadMoreFont = initialLoad => {
    let pageId;
    let count;
    if (initialLoad) {
      pageId = 1;
      count = 30;
    } else {
      pageId = editorStore.fontsList.length / 30 + 1;
      count = 30;
    }
    this.setState({ isLoadingFont: true, error: undefined });
    const url = `/api/Font/Search?page=${pageId}&perPage=${count}`;
    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          for (var i = 0; i < res.value.key.length; ++i) {
            editorStore.addFontItem(res.value.key[i]);
          }

          this.setState(state => ({
            hasMoreFonts: res.value.value > editorStore.fontsList.length,
            isLoadingFont: false,
          }));
        },
        error => {
          this.setState({ isLoadingFont: false, error })
        }
      );
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.selectedImage && nextProps.selectedImage && nextProps.selectedImage.effectId != this.props.selectedImage.effectId) {
      if (window.prevEffectId) {
        var el = document.getElementById("effect-btn-" + window.prevEffectId);
        if (el) {
          el.style.boxShadow = "0 0 0 1px rgba(14,19,24,.15)";
        }
      }
      var el = document.getElementById("effect-btn-" + nextProps.selectedImage.effectId);
      if (el) {
        el.style.boxShadow = "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff";
      }
      window.prevEffectId = nextProps.selectedImage.effectId;
    }

    if (!window.prevEffectId && nextProps.selectedImage && nextProps.selectedImage.effectId) {
      var el = document.getElementById("effect-btn-" + nextProps.selectedImage.effectId);
      if (el) {
        el.style.boxShadow = "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff";
      }
      window.prevEffectId = nextProps.selectedImage.effectId;
    }

    let result = false;

    if (nextProps.selectedTab != this.props.selectedTab) {
      result = true;
    }

    if (nextProps.mounted && !this.props.mounted) {
      result = true;
    }

    if (nextProps.toolbarOpened != this.props.toolbarOpened) {
      result = true;
    }
    if (this.props.subtype !== nextProps.subtype) {
      result = true;
    }
    if (this.props.tReady !== nextProps.tReady) {
      result = true;
    }

    if (this.state.hasMoreFonts != nextState.hasMoreFonts) {
      result = true;
    }

    if (nextProps.selectedTab === SidebarTab.Effect && this.props.selectedImage && nextProps.selectedImage && 
      this.props.selectedImage.effectId != nextProps.selectedImage.effectId) {
      result = true;
    }

    if (nextProps.selectedTab === SidebarTab.Effect && (!this.props.selectedImage) && nextProps.selectedImage) {
      result = true;
    }

    if (this.props.selectedImage && nextProps.selectedImage && nextProps.selectedImage._id != this.props.selectedImage._id) {
      result = true;
    }

    if (this.props.fontId != nextProps.fontId) {
      result = true;
    }

    // if (this.props.scale != nextProps.scale) {
    //   return false;
    // }

    // if (nextProps.dragging || nextProps.resizing || nextProps.rotating) {
    //   return false;
    // }

    return result;
  }

  handleSidebarSelectorClicked = (tab, e) => {
    this.props.handleSidebarSelectorClicked(tab, e);
    this.forceUpdate();
  };

  handleColorPick = (e) => {
    this.forceUpdate();
  }

  render() {
    return (
      <div
        style={{
          backgroundColor: "#293039",
          flexDirection: "row",
          zIndex: 11111,
          width: this.props.toolbarOpened
            ? `${this.props.toolbarSize}px`
            : "80px",
          height: "100%",
          position: "relative",
          display: "flex",
          outline: "1px solid rgba(14,19,24,.15)",
        }}
      >
        {this.props.mounted && (
          <TopMenu
            translate={this.props.translate}
            mounted={this.props.mounted}
            mode={this.props.mode}
            toolbarSize={this.props.toolbarSize}
            selectedTab={this.props.selectedTab}
            onClick={this.handleSidebarSelectorClicked}
            tReady={this.props.tReady}
          />
        )}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            zIndex: 1111111112,
            backgroundColor: "white",
            width: "100%",
            display:
              Globals.serviceUser &&
              Globals.serviceUser.username &&
              Globals.serviceUser.username === adminEmail
                ? "block"
                : "none"
          }}
        >
          <input
            id="image-file"
            type="file"
            onLoad={data => {}}
            onLoadedData={data => {}}
            onChange={e => {
              this.props.selectedTab === SidebarTab.Video
                ? this.uploadVideo()
                : this.props.selectedTab === SidebarTab.Font
                ? this.uploadFont(e)
                : this.uploadImage(
                    this.props.selectedTab === SidebarTab.Image
                      ? TemplateType.Image
                      : this.props.selectedTab === SidebarTab.Upload
                      ? TemplateType.UserUpload
                      : this.props.selectedTab === SidebarTab.Background
                      ? TemplateType.BackgroundImage
                      : this.props.selectedTab ===
                        SidebarTab.RemovedBackgroundImage
                      ? TemplateType.RemovedBackgroundImage
                      : TemplateType.RemovedBackgroundImage,
                    false,
                    e
                  );
            }}
            style={{
              bottom: 0
            }}
          />
          <button
            style={{
              bottom: 0
            }}
            type="submit"
            onClick={
              this.props.selectedTab === SidebarTab.Font
                ? this.uploadFont.bind(this)
                : this.uploadImage.bind(
                    this,
                    this.props.selectedTab === SidebarTab.Image
                      ? TemplateType.Image
                      : TemplateType.BackgroundImage,
                    false
                  )
            }
          >
            Upload
          </button>
          <button
            style={{
              bottom: 0,
              right: 0
            }}
            onClick={this.handleRemoveAllMedia.bind(this)}
          >
            RemoveAll
          </button>
        </div>
        {this.props.mounted && this.props.toolbarOpened && (
          <div
            id="sidebar-content"
            style={{
              position: "relative",
              height: `calc(100% - ${
                Globals.serviceUser &&
                Globals.serviceUser.username &&
                Globals.serviceUser.username == adminEmail
                  ? 78
                  : 0
              }px)`,
              width: "370px",
              transitionDuration: "10s, 10s",
              // backgroundColor: this.props.selectedTab === SidebarTab.Effect ? "white" : "#293039",
            }}
          >
            <div
              style={{
                opacity: this.props.selectedTab === SidebarTab.Image ? 1 : 0,
                position: "absolute",
                width: "347px",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  this.props.selectedTab !== SidebarTab.Image &&
                  `translate3d(0px, calc(-${
                    this.props.selectedTab > SidebarTab.Image ? 40 : -40
                  }px), 0px)`,
                zIndex: this.props.selectedTab !== SidebarTab.Image && -1,
                top: "10px",
                height: "100%",
                left: '19px',
              }}
            >
              <div
                style={{
                  zIndex: 123
                }}
              >
                <InfiniteScroll
                  scroll={true}
                  throttle={500}
                  threshold={300}
                  isLoading={this.state.isLoading}
                  hasMore={this.state.hasMoreImage}
                  onLoadMore={this.loadMore.bind(this, false)}
                  refId="sentinel-image"
                  marginTop={45}
                >
                  <div
                    id="image-container-picker"
                    style={{ display: "flex", padding: "16px 13px 10px 0px" }}
                  >
                    <div
                      style={{
                        height: "calc(100% - 170px)",
                        width: "350px",
                        marginRight: "10px"
                      }}
                    >
                      {this.state.items.map((item, key) => (
                        <ImagePicker
                          id=""
                          key={key + "1"}
                          color={item.color}
                          src={item.representativeThumbnail}
                          height={imgWidth / (item.width / item.height)}
                          defaultHeight={imgWidth}
                          width={imgWidth}
                          className=""
                          onPick={e => {
                            this.props.imgOnMouseDown(item, e);
                          }}
                          onEdit={this.handleEditmedia.bind(this, item)}
                          delay={0}
                          showButton={false}
                        />
                      ))}
                      {this.state.mounted &&
                        this.state.hasMoreImage &&
                        Array(1)
                          .fill(0)
                          .map((item, i) => (
                            <ImagePicker
                              showButton={false}
                              key={i + "11"}
                              id="sentinel-image"
                              color="black"
                              src={""}
                              height={imgWidth}
                              defaultHeight={imgWidth}
                              width={imgWidth}
                              className=""
                              onPick={e => {
                                this.props.imgOnMouseDown(item, e);
                              }}
                              onEdit={this.handleEditmedia.bind(this, null)}
                              delay={0}
                            />
                          ))}
                      {this.state.mounted &&
                        this.state.hasMoreImage &&
                        Array(10)
                          .fill(0)
                          .map((item, i) => (
                            <ImagePicker
                              showButton={false}
                              key={i + 1 + "11"}
                              id="sentinel-image"
                              color="black"
                              src={""}
                              height={imgWidth}
                              defaultHeight={imgWidth}
                              width={imgWidth}
                              className=""
                              onPick={e => {
                                this.props.imgOnMouseDown(item, e);
                              }}
                              onEdit={this.handleEditmedia.bind(this, null)}
                              delay={0}
                            />
                          ))}
                    </div>
                    <div
                      style={{
                        height: "calc(100% - 170px)",
                        width: "350px"
                      }}
                    >
                      {this.state.items2.map((item, key) => (
                        <ImagePicker
                          showButton={false}
                          id=""
                          key={key + "2"}
                          color={item.color}
                          src={item.representativeThumbnail}
                          height={imgWidth / (item.width / item.height)}
                          defaultHeight={imgWidth}
                          width={imgWidth}
                          className=""
                          onPick={this.props.imgOnMouseDown.bind(this, item)}
                          onEdit={this.handleEditmedia.bind(this, item)}
                          delay={-1}
                        />
                      ))}
                      {this.state.mounted &&
                        this.state.hasMoreImage &&
                        Array(1)
                          .fill(0)
                          .map((item, i) => (
                            <ImagePicker
                              showButton={false}
                              key={i + "22"}
                              id="sentinel-image"
                              color="black"
                              src={""}
                              height={imgWidth}
                              defaultHeight={imgWidth}
                              width={imgWidth}
                              className=""
                              onPick={this.props.imgOnMouseDown.bind(
                                this,
                                null
                              )}
                              onEdit={this.handleEditmedia.bind(this, null)}
                              delay={150}
                            />
                          ))}
                      {this.state.mounted &&
                        this.state.hasMoreImage &&
                        Array(10)
                          .fill(0)
                          .map((item, i) => (
                            <ImagePicker
                              showButton={false}
                              key={i + "22"}
                              id="sentinel-image"
                              color="black"
                              src={""}
                              height={imgWidth}
                              defaultHeight={imgWidth}
                              width={imgWidth}
                              className=""
                              onPick={this.props.imgOnMouseDown.bind(
                                this,
                                null
                              )}
                              onEdit={this.handleEditmedia.bind(this, null)}
                              delay={150}
                            />
                          ))}
                    </div>
                  </div>
                </InfiniteScroll>
                <input
                  style={{
                    zIndex: 11,
                    width: "calc(100% - 13px)",
                    marginBottom: "8px",
                    border: "none",
                    height: "37px",
                    borderRadius: "3px",
                    padding: "5px",
                    fontSize: "13px",
                    boxShadow:
                      "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
                    position: "absolute",
                    top: "6px"
                  }}
                  onKeyDown={this.handleQuery}
                  type="text"
                  onChange={e => {
                    // this.setState({ query: e.target.value });
                  }}
                  value={this.state.query}
                />
              </div>
            </div>
            <div
              style={{
                opacity: this.props.selectedTab === SidebarTab.Text ? 1 : 0,
                position: "absolute",
                width: "347px",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  this.props.selectedTab !== SidebarTab.Text &&
                  `translate3d(0px, calc(${
                    this.props.selectedTab < SidebarTab.Text ? 40 : -40
                  }px), 0px)`,
                top: "20px",
                zIndex: this.props.selectedTab !== SidebarTab.Text && -1,
                height: "100%",
                left: '19px',
              }}
            >
              <div style={{ color: "white" }}>
                <div style={{ marginBottom: "10px" }}>
                  <p>
                    {/* Nhấn để thêm chữ vào trang */}
                    {this.props.translate("clickTextToAddToPage")}
                  </p>
                  {/* <div
              style={{
                fontSize: '28px',
                width: '100%',
                cursor: 'pointer',
              }}
              onMouseDown={(e) => {
                e.preventDefault();

                var _id = uuidv4();

                let images = this.state.images.map(img => {
                  if (img._id === this.props.idObjectSelected) {
                    img.childId = _id;
                  }
                  return img;
                });

                var scale = this.props.rectWidth / e.target.getBoundingClientRect().width;

                this.props.addItem({
                    _id,
                    type: TemplateType.Latex,
                    width: 200 * scale,
                    origin_width: 200,
                    height: 40 * scale,
                    origin_height: 40,
                    left: 0,
                    top: 0,
                    rotateAngle: 0.0,
                    innerHTML: "Phương trình: $$ f(x) = x^2 $$",
                    scaleX: scale,
                    scaleY: scale,
                    selected: false,
                    ref: this.props.idObjectSelected,
                    page: this.props.activePageId,
                    zIndex: this.state.upperZIndex + 1,
                    width2: 1,
                    height2: 1,
                    document_object: [],
                    color: null,
                    opacity: 100,
                    backgroundColor: null,
                    posX: 0,
                    posY: 0,
                    imgHeight: 0,
                    imgWidth: 0,
                    src: null,
                    childId: null,
                });

                this.setState({ upperZIndex: this.state.upperZIndex + 1 });
              }}
            >
                Thêm LaTeX
            </div> */}
                  <div
                    className="add-heading-btn"
                    style={{
                      fontSize: "28px",
                      cursor: "pointer",
                      background: "hsla(0,0%,100%,.07)",
                      borderRadius: "7px",
                      padding: "10px",
                      width: "95%",
                    }}
                    onMouseDown={e => {
                      e.preventDefault();
                      var item = {
                        _id: uuidv4(),
                        type: TemplateType.Heading,
                        width: 300 * 1,
                        origin_width: 300,
                        height: 60 * 1,
                        origin_height: 60,
                        left: 0,
                        top: 0,
                        rotateAngle: 0.0,
                        innerHTML: `<div class="font" style="text-align: left;font-size: 42px;">${this.props.translate(
                          "addAHeading"
                        )}</div>`,
                        scaleX: 1,
                        scaleY: 1,
                        ref: editorStore.idObjectSelected,
                        page: editorStore.activePageId,
                        zIndex: editorStore.upperZIndex + 1,
                        color: "black",
                        fontSize: 42,
                        fontRepresentative: "images/font-AvenirNextRoundedPro.png",
                        selected: true,
                        fontFace: "O5mEMMs7UejmI1WeSKWQ",
                        effectId: 8,
                      };

                      // editorStore.addItem(item, true);
                      editorStore.addItem2(item);
                    
                      this.props.handleImageSelected(item);
                      editorStore.increaseUpperzIndex();
                    }}
                  >
                    {/* Thêm tiêu đề */}
                    {this.props.translate("addAHeading")}
                  </div>
                  <div
                    className="add-heading-btn"
                    style={{
                      fontSize: "22px",
                      cursor: "pointer",
                      marginTop: "10px",
                      background: "hsla(0,0%,100%,.07)",
                      borderRadius: "7px",
                      padding: "10px",
                      width: "95%",
                    }}
                    onMouseDown={e => {
                      e.preventDefault();
                      var item = {
                        _id: uuidv4(),
                        type: TemplateType.Heading,
                        width: 250 * 1,
                        origin_width: 250,
                        height: 32 * 1,
                        origin_height: 32,
                        left: 0,
                        top: 0,
                        rotateAngle: 0.0,
                        innerHTML: `<div class="font" style="text-align: left;font-size: 24px; font-family: AvenirNextRoundedPro;">${this.props.translate(
                          "addASubHeading"
                        )}</div>`,
                        scaleX: 1,
                        scaleY: 1,
                        page: editorStore.activePageId,
                        zIndex: 1,
                        ref: this.props.idObjectSelected,
                        color: "black",
                        fontSize: 24,
                        fontRepresentative: "images/font-AvenirNextRoundedPro.png",
                        selected: true,
                        fontFace: "O5mEMMs7UejmI1WeSKWQ",
                      };

                      // editorStore.addItem(item, true);
                      editorStore.addItem2(item);
                      this.props.handleImageSelected(item);
                      editorStore.increaseUpperzIndex();
                    }}
                  >
                    {/* Thêm tiêu đề con */}
                    {this.props.translate("addASubHeading")}
                  </div>
                  <div
                    className="add-heading-btn"
                    style={{
                      fontSize: "16px",
                      cursor: "pointer",
                      marginTop: "10px",
                      marginBottom: "18px",
                      background: "hsla(0,0%,100%,.07)",
                      borderRadius: "7px",
                      padding: "10px",
                      width: "95%",
                    }}
                    onMouseDown={e => {
                      e.preventDefault();
                      e.preventDefault();
                      var item = {
                        _id: uuidv4(),
                        type: TemplateType.Heading,
                        width: 200 * 1,
                        origin_width: 200,
                        height: 22 * 1,
                        origin_height: 22,
                        left: 0,
                        top: 0,
                        rotateAngle: 0.0,
                        innerHTML: `<div class="font" style="text-align: left;font-size: 16px; font-family: AvenirNextRoundedPro;">${this.props.translate(
                          "addABodyText"
                        )}</div>`,
                        scaleX: 1,
                        scaleY: 1,
                        page: editorStore.activePageId,
                        zIndex: editorStore.upperZIndex + 1,
                        ref: editorStore.idObjectSelected,
                        color: "black",
                        fontSize: 16,
                        fontRepresentative: "images/font-AvenirNextRoundedPro.png",
                        selected: true,
                        fontFace: "O5mEMMs7UejmI1WeSKWQ",
                      };

                      // editorStore.addItem(item, true);
                      editorStore.addItem2(item);
                      this.props.handleImageSelected(item);
                      editorStore.increaseUpperzIndex();
                    }}
                  >
                    {/* Thêm đoạn văn */}
                    {this.props.translate("addABodyText")}
                  </div>
                </div>
                {
                  <div style={{ height: "calc(100% - 152px)" }}>
                    <InfiniteScroll
                      scroll={true}
                      throttle={500}
                      threshold={300}
                      isLoading={this.state.isTemplateLoading}
                      hasMore={this.state.hasMoreTextTemplate}
                      onLoadMore={this.loadMoreTextTemplate.bind(this, false)}
                      refId="sentinel-texttemplate"
                      marginTop={0}
                    >
                      <div
                        id="image-container-picker"
                        style={{
                          display: "flex",
                          padding: "0px 13px 10px 0px"
                        }}
                      >
                        <div
                          style={{
                            width: "350px",
                            marginRight: "10px"
                          }}
                        >
                          {this.state.groupedTexts.map((item, key) => (
                            <ImagePicker
                              id=""
                              key={key}
                              color={item.color}
                              src={item.representative}
                              height={imgWidth / (item.width / item.height)}
                              defaultHeight={imgWidth}
                              width={imgWidth}
                              delay={0}
                              className="text-picker"
                              onPick={this.textOnMouseDown.bind(this, item.id)}
                              onEdit={() => {
                                // this.setState({
                                //   showTemplateEditPopup: true,
                                //   editingMedia: item
                                // });
                              }}
                              showButton={false}
                            />
                          ))}
                          {this.state.hasMoreTextTemplate &&
                            Array(1)
                              .fill(0)
                              .map((item, i) => (
                                <ImagePicker
                                  key={i}
                                  id="sentinel-texttemplate"
                                  color="black"
                                  src={""}
                                  height={imgWidth}
                                  width={imgWidth}
                                  defaultHeight={imgWidth}
                                  className=""
                                  onPick={this.props.imgOnMouseDown.bind(
                                    this,
                                    null
                                  )}
                                  onEdit={this.handleEditmedia.bind(this, null)}
                                  delay={0}
                                  showButton={false}
                                />
                              ))}
                          {this.state.hasMoreTextTemplate &&
                            Array(10)
                              .fill(0)
                              .map((item, i) => (
                                <ImagePicker
                                  key={i}
                                  id="sentinel-texttemplate"
                                  color="black"
                                  src={""}
                                  height={imgWidth}
                                  width={imgWidth}
                                  defaultHeight={imgWidth}
                                  className=""
                                  onPick={this.props.imgOnMouseDown.bind(
                                    this,
                                    null
                                  )}
                                  onEdit={this.handleEditmedia.bind(this, null)}
                                  delay={0}
                                  showButton={false}
                                />
                              ))}
                        </div>
                        <div
                          style={{
                            width: "350px"
                          }}
                        >
                          {this.state.groupedTexts2.map((item, key) => (
                            <ImagePicker
                              id=""
                              defaultHeight={imgWidth}
                              delay={0}
                              width={imgWidth}
                              key={key}
                              color={item.color}
                              className="text-picker"
                              height={imgWidth / (item.width / item.height)}
                              src={item.representative}
                              onPick={this.textOnMouseDown.bind(this, item.id)}
                              onEdit={() => {
                                // this.setState({
                                //   showTemplateEditPopup: true,
                                //   editingMedia: item
                                // });
                              }}
                              showButton={false}
                            />
                          ))}
                          {this.state.hasMoreTextTemplate &&
                            Array(1)
                              .fill(0)
                              .map((item, i) => (
                                <ImagePicker
                                  key={i}
                                  id="sentinel-texttemplate"
                                  color="black"
                                  src={""}
                                  height={imgWidth}
                                  width={imgWidth}
                                  defaultHeight={imgWidth}
                                  className=""
                                  onPick={this.props.imgOnMouseDown.bind(
                                    this,
                                    null
                                  )}
                                  onEdit={this.handleEditmedia.bind(this, null)}
                                  delay={150}
                                  showButton={false}
                                />
                              ))}
                          {this.state.hasMoreTextTemplate &&
                            Array(10)
                              .fill(0)
                              .map((item, i) => (
                                <ImagePicker
                                  key={i}
                                  id="sentinel-texttemplate"
                                  color="black"
                                  src={""}
                                  height={imgWidth}
                                  width={imgWidth}
                                  defaultHeight={imgWidth}
                                  className=""
                                  onPick={this.props.imgOnMouseDown.bind(
                                    this,
                                    null
                                  )}
                                  onEdit={this.handleEditmedia.bind(this, null)}
                                  delay={150}
                                  showButton={false}
                                />
                              ))}
                        </div>
                      </div>
                    </InfiniteScroll>
                  </div>
                }
              </div>
            </div>
            <div
              style={{
                opacity: this.props.selectedTab === SidebarTab.Template ? 1 : 0,
                position: "absolute",
                width: "347px",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  this.props.selectedTab !== SidebarTab.Template &&
                  `translate3d(0px, calc(${
                    this.props.selectedTab < SidebarTab.Template ? 40 : -40
                  }px), 0px)`,
                top: "10px",
                zIndex: this.props.selectedTab !== SidebarTab.Template && -1,
                height: "100%",
                left: '19px',
              }}
            >
              <InfiniteScroll
                scroll={true}
                throttle={500}
                threshold={300}
                isLoading={this.state.isTemplateLoading}
                hasMore={this.state.hasMoreTemplate}
                onLoadMore={this.loadMoreTemplate.bind(this, false)}
                marginTop={45}
                refId="sentinel-template"
              >
                <div
                  id="image-container-picker"
                  style={{ display: "flex", padding: "16px 13px 10px 0px" }}
                >
                  <div
                    style={{
                      width: "350px",
                      marginRight: "10px"
                    }}
                  >
                    {this.state.templates.map((item, key) =>
                      item.isVideo ? (
                        <VideoPicker
                          id=""
                          defaultHeight={imgWidth}
                          delay={0}
                          width={imgWidth}
                          key={key}
                          color={item.color}
                          src={item.videoRepresentative}
                          height={imgWidth / (item.width / item.height)}
                          className="template-picker"
                          onPick={this.templateOnMouseDown.bind(this, item.id)}
                          onEdit={() => {
                            // this.setState({
                            //   showTemplateEditPopup: true,
                            //   editingMedia: item
                            // });
                          }}
                          showButton={false}
                        />
                      ) : (
                        <ImagePicker
                          id=""
                          defaultHeight={imgWidth}
                          delay={0}
                          width={imgWidth}
                          key={key}
                          color={item.color}
                          src={item.representative}
                          height={imgWidth / (item.width / item.height)}
                          className="template-picker"
                          onPick={this.templateOnMouseDown.bind(this, item.id)}
                          onEdit={() => {
                            // this.setState({
                            //   showTemplateEditPopup: true,
                            //   editingMedia: item
                            // });
                          }}
                          showButton={false}
                        />
                      )
                    )}
                    {this.state.hasMoreTemplate &&
                      Array(1)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            key={i}
                            id="sentinel-template"
                            color="black"
                            src={""}
                            height={imgWidth}
                            width={imgWidth}
                            defaultHeight={imgWidth}
                            className=""
                            onPick={this.props.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={0}
                            showButton={false}
                          />
                        ))}
                    {this.state.hasMoreTemplate &&
                      Array(10)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            key={i}
                            id="sentinel-template"
                            color="black"
                            src={""}
                            height={imgWidth}
                            width={imgWidth}
                            defaultHeight={imgWidth}
                            className=""
                            onPick={this.props.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={0}
                            showButton={false}
                          />
                        ))}
                  </div>
                  <div
                    style={{
                      width: "350px"
                    }}
                  >
                    {this.state.templates2.map((item, key) =>
                      item.isVideo ? (
                        <VideoPicker
                          id=""
                          defaultHeight={imgWidth}
                          delay={150}
                          width={imgWidth}
                          key={key}
                          color={item.color}
                          src={item.videoRepresentative}
                          height={imgWidth / (item.width / item.height)}
                          className="template-picker"
                          onPick={this.templateOnMouseDown.bind(this, item.id)}
                          onEdit={() => {
                            // this.setState({
                            //   showTemplateEditPopup: true,
                            //   editingMedia: item
                            // });
                          }}
                          showButton={false}
                        />
                      ) : (
                        <ImagePicker
                          id=""
                          defaultHeight={imgWidth}
                          delay={150}
                          width={imgWidth}
                          key={key}
                          color={item.color}
                          className="template-picker"
                          height={imgWidth / (item.width / item.height)}
                          src={item.representative}
                          onPick={this.templateOnMouseDown.bind(this, item.id)}
                          onEdit={() => {
                            // this.setState({
                            //   showTemplateEditPopup: true,
                            //   editingMedia: item
                            // });
                          }}
                          showButton={false}
                        />
                      )
                    )}
                    {this.state.hasMoreTemplate &&
                      Array(1)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            key={i}
                            id="sentinel-template"
                            color="black"
                            src={""}
                            height={imgWidth}
                            width={imgWidth}
                            defaultHeight={imgWidth}
                            className=""
                            onPick={this.props.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={150}
                            showButton={false}
                          />
                        ))}
                    {this.state.hasMoreTemplate &&
                      Array(10)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            key={i}
                            id="sentinel-template"
                            color="black"
                            src={""}
                            height={imgWidth}
                            width={imgWidth}
                            defaultHeight={imgWidth}
                            className=""
                            onPick={this.props.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={150}
                            showButton={false}
                          />
                        ))}
                  </div>
                </div>
              </InfiniteScroll>
              <input
                style={{
                  zIndex: 11,
                  width: "calc(100% - 13px)",
                  marginBottom: "8px",
                  border: "none",
                  height: "37px",
                  borderRadius: "3px",
                  padding: "5px",
                  fontSize: "13px",
                  boxShadow:
                    "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
                  position: "absolute",
                  top: "6px"
                }}
                onKeyDown={this.handleQuery}
                type="text"
                onChange={e => {
                  // this.setState({ query: e.target.value });
                }}
                value={this.state.query}
              />
            </div>
            <div
              style={{
                opacity:
                  this.props.selectedTab === SidebarTab.Background ? 1 : 0,
                position: "absolute",
                width: "347px",
                color: "white",
                overflow: "scroll",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  this.props.selectedTab !== SidebarTab.Background &&
                  `translate3d(0px, calc(${
                    this.props.selectedTab < SidebarTab.Background ? 40 : -40
                  }px), 0px)`,
                top: "10px",
                zIndex: this.props.selectedTab !== SidebarTab.Background && -1,
                height: "100%",
                left: '19px',
              }}
            >
              <InfiniteScroll
                scroll={true}
                throttle={100}
                threshold={0}
                isLoading={this.state.isBackgroundLoading}
                hasMore={this.state.hasMoreBackgrounds}
                onLoadMore={this.loadMoreBackground.bind(this, false)}
                refId="sentinel-background"
                marginTop={0}
              >
                <div
                  id="image-container-picker"
                  style={{
                    display: "flex",
                    padding: "10px 13px 10px 0px"
                  }}
                >
                  <div
                    style={{
                      width: "350px",
                      marginRight: "8px"
                    }}
                  >
                    {this.state.backgrounds1.map((item, key) => (
                      <ImagePicker
                        showButton={false}
                        className=""
                        id=""
                        delay={0}
                        width={backgroundWidth}
                        key={key}
                        color={item.color}
                        src={item.representativeThumbnail}
                        height={backgroundWidth / (item.width / item.height)}
                        defaultHeight={backgroundWidth}
                        onPick={this.backgroundOnMouseDown.bind(this, item)}
                        onEdit={this.handleEditmedia.bind(this, item)}
                      />
                    ))}
                    {this.state.hasMoreBackgrounds &&
                      Array(1)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            showButton={false}
                            key={i}
                            id="sentinel-background"
                            color="black"
                            src={""}
                            height={backgroundWidth}
                            width={backgroundWidth}
                            defaultHeight={backgroundWidth}
                            className=""
                            onPick={this.props.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={0}
                          />
                        ))}
                    {this.state.hasMoreBackgrounds &&
                      Array(10)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            showButton={false}
                            key={i}
                            id="sentinel-background"
                            color="black"
                            src={""}
                            height={backgroundWidth}
                            width={backgroundWidth}
                            defaultHeight={backgroundWidth}
                            className=""
                            onPick={this.props.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={0}
                          />
                        ))}
                  </div>
                  <div
                    style={{
                      width: "350px",
                      marginRight: "8px"
                    }}
                  >
                    {this.state.backgrounds2.map((item, key) => (
                      <ImagePicker
                        showButton={false}
                        className=""
                        width={backgroundWidth}
                        id=""
                        key={key}
                        color={item.color}
                        src={item.representativeThumbnail}
                        height={backgroundWidth / (item.width / item.height)}
                        defaultHeight={backgroundWidth}
                        onPick={this.backgroundOnMouseDown.bind(this, item)}
                        onEdit={this.handleEditmedia.bind(this, item)}
                        delay={150}
                      />
                    ))}
                    {this.state.hasMoreBackgrounds &&
                      Array(1)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            showButton={false}
                            key={i}
                            id="sentinel-background"
                            color="black"
                            src={""}
                            height={backgroundWidth}
                            defaultHeight={backgroundWidth}
                            className=""
                            width={backgroundWidth}
                            onPick={this.props.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={150}
                          />
                        ))}
                    {this.state.hasMoreBackgrounds &&
                      Array(10)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            showButton={false}
                            key={i}
                            id="sentinel-background"
                            color="black"
                            src={""}
                            height={backgroundWidth}
                            width={backgroundWidth}
                            defaultHeight={backgroundWidth}
                            className=""
                            onPick={this.props.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={150}
                          />
                        ))}
                  </div>
                  <div
                    style={{
                      width: "350px"
                    }}
                  >
                    {this.state.backgrounds3.map((item, key) => (
                      <ImagePicker
                        showButton={false}
                        id=""
                        className=""
                        key={key}
                        color={item.color}
                        src={item.representativeThumbnail}
                        height={backgroundWidth / (item.width / item.height)}
                        width={backgroundWidth}
                        defaultHeight={backgroundWidth}
                        onPick={this.backgroundOnMouseDown.bind(this, item)}
                        onEdit={this.handleEditmedia.bind(this, item)}
                        delay={300}
                      />
                    ))}
                    {this.state.hasMoreBackgrounds &&
                      Array(1)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            showButton={false}
                            key={i}
                            id="sentinel"
                            color="black"
                            src={""}
                            height={backgroundWidth}
                            defaultHeight={backgroundWidth}
                            width={backgroundWidth}
                            className=""
                            onPick={this.props.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={300}
                          />
                        ))}
                    {this.state.hasMoreBackgrounds &&
                      Array(10)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            showButton={false}
                            key={i}
                            id="sentinel"
                            color="black"
                            src={""}
                            height={backgroundWidth}
                            defaultHeight={backgroundWidth}
                            width={backgroundWidth}
                            className=""
                            onPick={this.props.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={300}
                          />
                        ))}
                  </div>
                </div>
              </InfiniteScroll>
            </div>
            <div
              style={{
                opacity: this.props.selectedTab === SidebarTab.Font ? 1 : 0,
                position: "absolute",
                width: "370px",
                color: "white",
                overflow: "scroll",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  this.props.selectedTab !== SidebarTab.Font &&
                  `translate3d(0px, calc(${
                    this.props.selectedTab < SidebarTab.Font ? 40 : -40
                  }px), 0px)`,
                top: "10px",
                zIndex: this.props.selectedTab !== SidebarTab.Font && -1,
                height: "100%",
                left: "0px",
                // left: '19px',
              }}
            >
              <div>
                <div
                  style={{
                    height: "calc(100% - 10px)"
                  }}
                >
                  <InfiniteScroll
                    scroll={true}
                    throttle={500}
                    threshold={300}
                    isLoading={this.state.isLoadingFont}
                    hasMore={this.state.hasMoreFonts}
                    onLoadMore={this.loadMoreFont.bind(this, false)}
                    marginTop={0}
                    refId="sentinel-font"
                  >
                    <div id="image-container-picker">
                      <div
                        style={{
                          // marginRight: "10px"
                        }}
                      >
                        {editorStore.fontsList.map((font, key) => (
                          <div 
                            key={key}
                            style={{
                              display: 'flex',
                            }}>
                            {Globals.serviceUser &&
                              Globals.serviceUser.username &&
                              Globals.serviceUser.username == adminEmail && (
                                <button
                                  style={{
                                    top: "5px",
                                    left: "5px",
                                    borderRadius: "13px",
                                    border: "none",
                                    padding: "0 4px",
                                    boxShadow:
                                      "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
                                  }}
                                  onClick={this.handleEditFont.bind(this, font)}
                                >
                                  <span>
                                    <svg
                                      width="25"
                                      height="25"
                                      viewBox="0 0 16 16"
                                    >
                                      <defs>
                                        <path
                                          id="_2658783389__a"
                                          d="M3.25 9.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"
                                        ></path>
                                      </defs>
                                      <use
                                        fill="black"
                                        xlinkHref="#_2658783389__a"
                                        fillRule="evenodd"
                                      ></use>
                                    </svg>
                                  </span>
                                </button>
                              )}
                          <button
                            key={uuidv4()}
                            className="font-picker"
                            style={{
                              display: "flex",
                              position: "relative",
                              width: "100%",
                              border: "none",
                              backgroundColor: "transparent"
                            }}
                            onClick={e => {
                              this.props.selectFont(font.id, e);
                            }}
                          >
                            <img
                              style={{
                                height: "25px",
                                margin: "auto"
                              }}
                              src={font.representative}
                            />
                            {this.props.fontId === font.id ? (
                              <span
                                style={{
                                  position: "absolute",
                                  float: "right",
                                  width: "25px",
                                  height: "25px",
                                  right: "10px"
                                }}
                              >
                                <svg
                                  style={{ fill: "white" }}
                                  version="1.1"
                                  viewBox="0 0 44 44"
                                  enableBackground="new 0 0 44 44"
                                >
                                  <path d="m22,0c-12.2,0-22,9.8-22,22s9.8,22 22,22 22-9.8 22-22-9.8-22-22-22zm12.7,15.1l0,0-16,16.6c-0.2,0.2-0.4,0.3-0.7,0.3-0.3,0-0.6-0.1-0.7-0.3l-7.8-8.4-.2-.2c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5 0.3-0.7l1.4-1.4c0.4-0.4 1-0.4 1.4,0l.1,.1 5.5,5.9c0.2,0.2 0.5,0.2 0.7,0l13.4-13.9h0.1c0.4-0.4 1-0.4 1.4,0l1.4,1.4c0.4,0.3 0.4,0.9 0,1.3z" />
                                </svg>
                              </span>
                            ) : null}
                          </button>
                          </div>
                        ))}
                        {this.state.hasMoreFonts &&
                        Array(1)
                          .fill(0)
                          .map((item, i) => (
                            <ImagePicker
                              key={i}
                              id="sentinel-font"
                              color="black"
                              src={""}
                              height={imgWidth}
                              defaultHeight={imgWidth}
                              width={imgWidth}
                              className=""
                              onPick={this.props.imgOnMouseDown.bind(
                                this,
                                null
                              )}
                              onEdit={this.handleEditmedia.bind(this, null)}
                              delay={0}
                              showButton={false}
                            />
                          ))}
                      </div>
                    </div>
                  </InfiniteScroll>
                </div>
              </div>
            </div>
            <div
              style={{
                opacity: this.props.selectedTab === SidebarTab.Effect ? 1 : 0,
                position: "absolute",
                width: "370px",
                overflow: "scroll",
                // transition:
                //   "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                // transform:
                //   this.props.selectedTab !== SidebarTab.Effect &&
                //   `translate3d(0px, calc(${
                //     this.props.selectedTab < SidebarTab.Effect ? 40 : -40
                //   }px), 0px)`,
                zIndex: this.props.selectedTab !== SidebarTab.Effect && -1,
                height: "100%",
                left: "0px",
                backgroundColor: "white",
              }}
            >
              <div>
                <div
                  style={{
                    height: "calc(100% - 10px)",
                    padding: "22px",
                  }}
                >
                  <div 
                    style={{
                      display: "inline-block",
                      width: "100px",
                      marginRight: "12px",
                    }}
                    >
                      <button
                        className="effect-btn"
                        id="effect-btn-8"
                        onClick={e => {
                          this.props.handleApplyEffect(8, null, null, null, null, null, "black");
                          if (window.prevEffectId) {
                            document.getElementById("effect-btn-" + window.prevEffectId).style.boxShadow = "0 0 0 1px rgba(14,19,24,.15)";
                          }
                          document.getElementById("effect-btn-8").style.boxShadow = "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff";
                          window.prevEffectId = 8;
                        }}
                        >
                    <img 
                      style={{
                        width: "100%",
                        borderRadius: "12px",
                      }}
                      src="https://static.canva.com/web/images/d461ce14740df06b826ab8517b88344c.png"/>
                      </button>
                      <p
                        style={{
                          textAlign: "center",
                        }}
                        >None</p>
                  </div>
                  <div 
                    style={{
                      display: "inline-block",
                      width: "100px",
                      marginRight: "12px",
                    }}
                    >
                    <button
                      id="effect-btn-1"
                      className="effect-btn"
                      // style={{
                      //   border: this.props.selectedImage && this.props.selectedImage.effectId == 1 && "2px solid #2591c7",
                      // }}
                      onClick={e => {
                        this.props.handleApplyEffect(1, 50, 12.5, 0, 40, null, "black");
                        if (window.prevEffectId) {
                          document.getElementById("effect-btn-" + window.prevEffectId).style.boxShadow = "0 0 0 1px rgba(14,19,24,.15)";
                        }
                        document.getElementById("effect-btn-1").style.boxShadow = "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff";
                        window.prevEffectId = 1;
                      }}
                      >
                    <img 
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                      }}
                      src="https://static.canva.com/web/images/544ebef63f65bc118af1a353d8e3456c.png"/>
                      </button>
                      <p
                        style={{
                          textAlign: "center",
                        }}
                        >Shadow</p>
                  </div>
                  <div 
                    style={{
                      display: "inline-block",
                      width: "100px",
                    }}
                    >
                    <button
                      id="effect-btn-2"
                      onClick={e => {
                        this.props.handleApplyEffect(2, null, null, null, null, 50, "black");
                        if (window.prevEffectId) {
                          document.getElementById("effect-btn-" + window.prevEffectId).style.boxShadow = "0 0 0 1px rgba(14,19,24,.15)";
                        }
                        document.getElementById("effect-btn-2").style.boxShadow = "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff";
                        window.prevEffectId = 2;
                      }}
                      className="effect-btn"
                      style={{
                      }}>
                    <img 
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                      }}
                      src="https://static.canva.com/web/images/39e8991a556615f8130d7d36580f9276.jpg"/>
                      </button>
                      <p
                        style={{
                          textAlign: "center",
                        }}
                        >Lift</p>
                  </div>
                  { this.props.selectedImage && this.props.selectedImage.effectId == 1 && 
                  <div style={{
                    marginBottom: "15px",
                  }}>
                    <Slider 
                      title="Offset" 
                      currentValue={this.props.selectedImage.offSet}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeOffset}
                      onChangeEnd={this.props.handleChangeOffsetEnd}
                    />
                    <Slider 
                      title="Direction" 
                      currentValue={this.props.selectedImage.direction}
                      pauser={this.props.pauser}
                      multiplier={3.6}
                      onChange={this.props.handleChangeDirection}
                      onChangeEnd={this.props.handleChangeDirectionEnd}
                    />
                    <Slider 
                      title="Blur" 
                      currentValue={this.props.selectedImage.blur}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeBlur}
                      onChangeEnd={this.props.handleChangeBlurEnd}
                    />
                    <Slider 
                      title="Transparency" 
                      currentValue={this.props.selectedImage.textShadowTransparent}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeTextShadowTransparent}
                      onChangeEnd={this.props.handleChangeTextShadowTransparentEnd}
                    />
            </div>}
            { this.props.selectedImage && this.props.selectedImage.effectId == 2 && 
                  <div style={{
                    marginBottom: "15px",
                  }}>
                    <Slider 
                      title="Intensity" 
                      currentValue={this.props.selectedImage.intensity}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeIntensity}
                      onChangeEnd={this.props.handleChangeIntensityEnd}
                    />
            </div>}
                  <div 
                    style={{
                      display: "inline-block",
                      width: "100px",
                      marginRight: "12px",
                    }}
                    >
                      <button
                        onClick={e => {
                          this.props.handleApplyEffect(3, null, null, null, null, null, 30, "black");
                          if (window.prevEffectId) {
                            document.getElementById("effect-btn-" + window.prevEffectId).style.boxShadow = "0 0 0 1px rgba(14,19,24,.15)";
                          }
                          document.getElementById("effect-btn-3").style.boxShadow = "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff";
                          window.prevEffectId = 3;
                        }}
                        id="effect-btn-3"
                        className="effect-btn"
                        style={{
                        }}>
                    <img 
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                      }}
                      src="https://static.canva.com/web/images/014d16e44f8c5dfddf2ccdb10fb97b6b.png"/>
                      </button>
                      <p
                        style={{
                          textAlign: "center",
                        }}>Hollow</p>
                  </div>
                  <div 
                    style={{
                      display: "inline-block",
                      width: "100px",
                      marginRight: "12px",
                    }}
                    >
                    <button
                      onClick={e => {
                        this.props.handleApplyEffect(4, 50, 12.5, 0, 40, null, 30, "transparent");
                        if (window.prevEffectId) {
                          document.getElementById("effect-btn-" + window.prevEffectId).style.boxShadow = "0 0 0 1px rgba(14,19,24,.15)";
                        }
                        document.getElementById("effect-btn-4").style.boxShadow = "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff";
                        window.prevEffectId = 4;
                      }}
                      id="effect-btn-4"
                      className="effect-btn"
                      style={{
                      }}
                    >
                    <img 
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                      }}
                      src="https://static.canva.com/web/images/6bec5afe4433f7030024ed9287752d08.png"/>
                      </button>
                      <p
                        style={{
                          textAlign: "center",
                        }}>Splice</p>
                  </div>
                  <div 
                    style={{
                      display: "inline-block",
                      width: "100px",
                    }}
                    >
                    <button
                      onClick={e => {
                        this.props.handleApplyEffect(5, 50, 12.5, 0, 40, null, "", "black");
                        if (window.prevEffectId) {
                          document.getElementById("effect-btn-" + window.prevEffectId).style.boxShadow = "0 0 0 1px rgba(14,19,24,.15)";
                        }
                        document.getElementById("effect-btn-5").style.boxShadow = "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff";
                        window.prevEffectId = 5;
                      }}
                      className="effect-btn"
                      id="effect-btn-5"
                      style={{
                      }}
                    >
                    <img 
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                      }}
                      src="https://static.canva.com/web/images/3df11ae4feb176c0e1326a83078863d2.png"/>
                      </button>
                      <p
                        style={{
                          textAlign: "center",
                        }}>Echo</p>
                  </div>
                  { this.props.selectedImage && this.props.selectedImage.effectId == 3 && 
                  <div style={{
                    marginBottom: "15px",
                  }}>
                    <Slider 
                      title="Thickness" 
                      currentValue={this.props.selectedImage.hollowThickness}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeHollowThickness}
                      onChangeEnd={this.props.handleChangeHollowThicknessEnd}
                    />
            </div>}
            { this.props.selectedImage && this.props.selectedImage.effectId == 4 &&
                  <div style={{
                    marginBottom: "15px",
                  }}>
                    <Slider 
                      title="Thickness" 
                      currentValue={this.props.selectedImage.hollowThickness}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeHollowThickness}
                      onChangeEnd={this.props.handleChangeTextShadowTransparentEnd}
                    />
                    <Slider 
                      title="Offset" 
                      currentValue={this.props.selectedImage.offSet}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeOffset}
                      onChangeEnd={this.props.handleChangeOffsetEnd}
                    />
                    <Slider 
                      title="Direction" 
                      currentValue={this.props.selectedImage.direction}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeDirection}
                      multiplier={3.6}
                      onChangeEnd={this.props.handleChangeDirectionEnd}
                    />
            </div>}
            { this.props.selectedImage && this.props.selectedImage.effectId == 5 &&
                  <div style={{
                    marginBottom: "15px",
                  }}>
                    <Slider 
                      title="Offset" 
                      currentValue={this.props.selectedImage.offSet}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeOffset}
                      onChangeEnd={this.props.handleChangeOffsetEnd}
                    />
                    <Slider 
                      title="Direction" 
                      currentValue={this.props.selectedImage.direction}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeDirection}
                      multiplier={3.6}
                      onChangeEnd={this.props.handleChangeDirectionEnd}
                    />
            </div>}
                  <div 
                    style={{
                      display: "inline-block",
                      width: "100px",
                      marginRight: "12px",
                    }}
                    >
                    <button
                      onClick={e => {
                        this.props.handleApplyEffect(6, 10, 83, 0, 40, null, "", "black");
                        if (window.prevEffectId) {
                          document.getElementById("effect-btn-" + window.prevEffectId).style.boxShadow = "0 0 0 1px rgba(14,19,24,.15)";
                        }
                        document.getElementById("effect-btn-6").style.boxShadow = "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff";
                        window.prevEffectId = 6;
                      }}
                      className="effect-btn"
                      id="effect-btn-6"
                      style={{
                      }}
                    >
                    <img 
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                      }}
                      src="https://static.canva.com/web/images/10d3bc08aa9d6ba94ddba7a67a6ff83e.png"/>
                      </button>
                      <p
                        style={{
                          textAlign: "center",
                        }}>Glitch</p>
                  </div>
                  <div 
                    style={{
                      display: "inline-block",
                      width: "100px",
                    }}
                    >
                    <button
                      onClick={e => {
                        this.props.handleApplyEffect(7, null, null, null, null, null, null, "white", "drop-shadow(rgb(255, 82, 188) 0px 0px 5.93333px) drop-shadow(rgba(255, 82, 188, 0.95) 0px 0px 35.6px) drop-shadow(rgba(255, 82, 188, 0.54) 0px 0px 118.667px)");
                        if (window.prevEffectId) {
                          document.getElementById("effect-btn-" + window.prevEffectId).style.boxShadow = "0 0 0 1px rgba(14,19,24,.15)";
                        }
                        document.getElementById("effect-btn-7").style.boxShadow = "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff";
                        window.prevEffectId = 7;
                      }}
                      className="effect-btn"
                      id="effect-btn-7"
                      style={{
                      }}
                    >
                    <img 
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                      }}
                      src="https://static.canva.com/web/images/2c6d9ae58209c023b5bc05b3581d3e51.jpg"/>
                      </button>
                      <p
                        style={{
                          textAlign: "center",
                        }}>Neon</p>
                  </div>
                  { this.props.selectedImage && this.props.selectedImage.effectId == 6 &&
                  <div style={{
                    marginBottom: "15px",
                  }}>
                    <Slider 
                      title="Offset" 
                      currentValue={this.props.selectedImage.offSet}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeOffset}
                      onChangeEnd={this.props.handleChangeOffsetEnd}
                    />
                    <Slider 
                      title="Direction" 
                      currentValue={this.props.selectedImage.direction}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeDirection}
                      multiplier={3.6}
                      onChangeEnd={this.props.handleChangeDirectionEnd}
                    />
            </div>}
            { this.props.selectedImage && this.props.selectedImage.effectId == 7 &&
                  <div style={{
                    marginBottom: "15px",
                  }}>
                    <Slider 
                      title="Intensity" 
                      currentValue={50}
                      pauser={this.props.pauser}
                      onChange={null}
                      onChangeEnd={this.props.handleChangeIntensityEnd}
                    />
            </div>}
                </div>
              </div>
            </div>
            <div
              style={{
                opacity: this.props.selectedTab === SidebarTab.Color ? 1 : 0,
                position: "absolute",
                width: "100%",
                color: "white",
                overflow: "scroll",
                zIndex: this.props.selectedTab !== SidebarTab.Color && -1,
                height: "100%",
                backgroundColor: "white",
              }}
            >
              <div style={{ display: "inline-block" }}>
                {/* <p style={{ margin: "5px" }}>Chọn nhanh</p> */}
                <ul
                  style={{
                    listStyle: "none",
                    padding: "0 23px"
                  }}
                >
                  {editorStore.fontColors.map(font => (
                    <div
                      key={uuidv4()}
                      onClick={e => {
                        e.preventDefault();
                        this.props.setSelectionColor(font, e);
                      }}
                      style={{
                        display: 'inline-block',
                      }}
                    >
                      <li
                        style={{
                          width: "50px",
                          height: "50px",
                          float: "left",
                          marginLeft: "13px",
                          marginTop: "13px",
                          borderRadius: '3px',
                          position: 'relative',
                        }}
                      >
                        <button
                          className="color-picker-block"
                          style={{
                            width: 'calc(100% - 10px)',
                            height: 'calc(100% - 10px)',
                            margin: 'auto',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            position: 'absolute',
                            backgroundColor: 'currentColor',
                            borderRadius: '.15em',
                            color: font,
                            border: 'none',
                            boxShadow: 'inset 0 0 0 1px rgba(14,19,24,.15)',
                          }}                        
                        >
                        </button>
                      </li>
                    </div>
                  ))}
                  {/* <TooltipClick
                    tipbaseClass="tipbase-color-picker"
                    content={<ColorPicker />}
                    offsetLeft={5}
                    offsetTop={5}
                    delay={10}
                    style={{}}
                    position="bottom"
                    children={<a
                      key={uuidv4()}
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        // this.props.setSelectionColor(font, e);
                      }}
                      style={{
                        display: 'inline-block',
                      }}
                    > */}
                      {/* <li
                        style={{
                          width: "42px",
                          height: "42px",
                          float: "left",
                          marginLeft: "13px",
                          marginTop: "13px",
                          borderRadius: '3px',
                          position: 'relative',
                        }}
                      >
                        <div
                          className="color-picker"
                          style={{
                            width: 'calc(100% - 10px)',
                            height: 'calc(100% - 10px)',
                            margin: 'auto',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            position: 'absolute',
                            color: "white",
                            backgroundColor: 'currentColor',
                            // boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.85), 0 0 0 3px currentColor',
                            borderRadius: '.15em',
                            boxShadow: 'inset 0 0 0 1px rgba(14,19,24,.15)',
                          }}                        
                        >
                          <svg style={{
                            width: '70%',
                            height: '70%',
                            color: 'black',
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            margin: 'auto',
                          }} width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M7.25 13.25a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5z"></path></svg>
                        </div>
                      </li> */}
                      <ColorPicker 
                        setSelectionColor={this.props.setSelectionColor}
                        colorPickerShown={this.props.colorPickerShown}
                        handleColorPick={this.handleColorPick}
                      />
                    {/* </a> */}
                  {/* <a
                      key={uuidv4()}
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        // this.props.setSelectionColor(font, e);
                      }}
                      style={{
                        display: 'inline-block',
                      }}
                    >
                      <li
                        style={{
                          width: "42px",
                          height: "42px",
                          backgroundColor: "pink",
                          float: "left",
                          marginLeft: "13px",
                          marginTop: "13px"
                        }}
                      ></li>
                    </a>
                    </TooltipClick> */}
                </ul>
              </div>
            </div>
            {/* <div
              style={{
                opacity:
                  this.props.selectedTab === SidebarTab.RemovedBackgroundImage
                    ? 1
                    : 0,
                position: "absolute",
                width: "347px",
                color: "white",
                overflow: "scroll",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  this.props.selectedTab !==
                    SidebarTab.RemovedBackgroundImage &&
                  `translate3d(0px, calc(${
                    this.props.selectedTab < SidebarTab.RemovedBackgroundImage
                      ? 40
                      : -40
                  }px), 0px)`,
                top: "10px",
                zIndex:
                  this.props.selectedTab !==
                    SidebarTab.RemovedBackgroundImage && -1,
                height: "100%"
              }}
            >
              <InfiniteScroll
                scroll={true}
                throttle={500}
                threshold={300}
                isLoading={this.state.isRemovedBackgroundImageLoading}
                hasMore={this.state.hasMoreRemovedBackground}
                onLoadMore={this.loadMoreRemovedBackgroundImage.bind(
                  this,
                  false
                )}
              >
                <div
                  style={{
                    color: "white",
                    overflow: "scroll",
                    width: "100%"
                  }}
                >
                  <div style={{ display: "inline-block", width: "100%" }}>
                    <button
                      style={{
                        width: "calc(100% - 13px)",
                        backgroundColor: "white",
                        border: "none",
                        color: "black",
                        padding: "10px",
                        borderRadius: "5px",
                        height: "37px"
                      }}
                      onClick={() => {
                        document.getElementById("image-file").click();
                      }}
                    >
                      Tải lên một hình ảnh
                    </button>
                    <div
                      style={{
                        display: "flex",
                        marginTop: "10px",
                        overflow: "scroll"
                      }}
                    >
                      <div
                        style={{
                          width: "350px",
                          marginRight: "10px"
                        }}
                      >
                        {this.state.removeImages1.map((item, key) => (
                          <ImagePicker
                            key={key}
                            src={item.representative}
                            onPick={this.imgOnMouseDown.bind(this, item)}
                            onEdit={this.handleEditmedia.bind(this, item)}
                          />
                        ))}
                      </div>
                      <div
                        style={{
                          width: "350px",
                          marginRight: "10px"
                        }}
                      >
                        {this.state.removeImages2.map((item, key) => (
                          <ImagePicker
                            key={key}
                            src={item.representative}
                            onPick={this.imgOnMouseDown.bind(this, item)}
                            onEdit={this.handleEditmedia.bind(this, item)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </InfiniteScroll>
            </div> */}
            <div
              style={{
                opacity: this.props.selectedTab === SidebarTab.Element ? 1 : 0,
                position: "absolute",
                width: "347px",
                color: "white",
                overflow: "scroll",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  this.props.selectedTab !== SidebarTab.Element &&
                  `translate3d(0px, calc(${
                    this.props.selectedTab < SidebarTab.Element ? 40 : -40
                  }px), 0px)`,
                top: "10px",
                zIndex: this.props.selectedTab !== SidebarTab.Element && -1,
                height: "100%",
                left: '19px',
              }}
            >
              <div style={{ display: "inline-block", width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    marginTop: "10px",
                    height: "calc(100% - 35px)",
                    overflow: "scroll"
                  }}
                >
                  <div
                    style={{
                      width: "350px",
                      marginRight: "10px"
                    }}
                  >
                    <img
                      onMouseDown={this.props.imgOnMouseDown.bind(this, {
                        representative:
                          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
                        freeStyle: true
                      })}
                      style={{
                        width: "160px",
                        height: imgWidth + "px",
                        backgroundColor: "#019fb6"
                      }}
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                    />
                  </div>
                  <div
                    style={{
                      width: "350px",
                      marginRight: "10px"
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div
              style={{
                opacity: this.props.selectedTab === SidebarTab.Video ? 1 : 0,
                position: "absolute",
                width: "347px",
                color: "white",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  this.props.selectedTab !== SidebarTab.Video &&
                  `translate3d(0px, calc(${
                    this.props.selectedTab < SidebarTab.Video ? 40 : -40
                  }px), 0px)`,
                top: "10px",
                zIndex: this.props.selectedTab !== SidebarTab.Video && -1,
                height: "100%",
                left: '19px',
              }}
            >
              <div style={{ display: "inline-block", width: "100%" }}>
                <button
                  style={{
                    width: "calc(100% - 13px)",
                    backgroundColor: "white",
                    border: "none",
                    color: "black",
                    padding: "10px",
                    borderRadius: "5px",
                    height: "37px"
                  }}
                  onClick={() => {
                    document.getElementById("image-file").click();
                  }}
                >
                  {/* Tải lên một video */}
                  {this.props.translate("uploadAVideo")}
                </button>
                <ul
                  style={{
                    listStyle: "none",
                    padding: "0px 13px 10px 0px",
                    width: "100%",
                    marginTop: "10px",
                    overflow: "scroll",
                    height: "calc(100% - 47px)"
                  }}
                >
                  {this.state.videos.map(video => (
                    <video
                      key={uuidv4()}
                      style={{
                        width: "100%",
                        marginBottom: "10px"
                      }}
                      onMouseDown={this.props.videoOnMouseDown}
                      muted
                      // autoPlay={true} preload="none"
                    >
                      <source
                        src={video.representative}
                        type="video/webm"
                      ></source>
                    </video>
                  ))}
                </ul>
              </div>
            </div>
            <div
              style={{
                opacity: this.props.selectedTab === SidebarTab.Upload ? 1 : 0,
                position: "absolute",
                width: "347px",
                color: "white",
                overflow: "scroll",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  this.props.selectedTab !== SidebarTab.Upload &&
                  `translate3d(0px, calc(${
                    this.props.selectedTab < SidebarTab.Upload ? 40 : -40
                  }px), 0px)`,
                top: "10px",
                zIndex: this.props.selectedTab !== SidebarTab.Upload && -1,
                height: "100%",
                left: '19px',
              }}
            >
              <InfiniteScroll
                scroll={true}
                throttle={100}
                threshold={0}
                isLoading={this.state.isUserUploadLoading}
                marginTop={45}
                hasMore={this.state.hasMoreUserUpload}
                onLoadMore={this.loadmoreUserUpload.bind(this, false)}
                refId="sentinel-userupload"
              >
                <div
                  style={{
                    color: "white",
                    overflow: "scroll",
                    width: "100%"
                  }}
                >
                  <div
                    id="image-container-picker"
                    style={{ display: "flex", padding: "16px 13px 10px 0px" }}
                  >
                    <div
                      style={{
                        height: "calc(100% - 170px)",
                        width: "350px",
                        marginRight: "10px"
                      }}
                    >
                      {this.state.userUpload1.map((item, key) => (
                        <ImagePicker
                          id=""
                          className=""
                          height={imgWidth / (item.width / item.height)}
                          defaultHeight={imgWidth}
                          color=""
                          delay={0}
                          width={imgWidth}
                          key={key}
                          src={item.representative}
                          onPick={e => {
                            this.props.imgOnMouseDown(item, e);
                          }}
                          onEdit={this.handleEditmedia.bind(this, item)}
                          showButton={false}
                        />
                      ))}
                      {this.state.hasMoreUserUpload &&
                        Array(1)
                          .fill(0)
                          .map((item, i) => (
                            <ImagePicker
                              key={i}
                              id="sentinel-userupload"
                              color="black"
                              src={""}
                              height={imgWidth}
                              defaultHeight={imgWidth}
                              width={imgWidth}
                              className=""
                              onPick={this.props.imgOnMouseDown.bind(
                                this,
                                null
                              )}
                              onEdit={this.handleEditmedia.bind(this, null)}
                              delay={0}
                              showButton={false}
                            />
                          ))}
                      {this.state.hasMoreUserUpload &&
                        Array(10)
                          .fill(0)
                          .map((item, i) => (
                            <ImagePicker
                              key={i}
                              id="sentinel-userupload"
                              color="black"
                              src={""}
                              height={imgWidth}
                              defaultHeight={imgWidth}
                              width={imgWidth}
                              className=""
                              onPick={this.props.imgOnMouseDown.bind(
                                this,
                                null
                              )}
                              onEdit={this.handleEditmedia.bind(this, null)}
                              delay={0}
                              showButton={false}
                            />
                          ))}
                    </div>
                    <div
                      style={{
                        width: "350px"
                      }}
                    >
                      {this.state.userUpload2.map((item, key) => (
                        <ImagePicker
                          id=""
                          className=""
                          height={imgWidth / (item.width / item.height)}
                          defaultHeight={imgWidth}
                          color=""
                          width={imgWidth}
                          delay={0}
                          key={key}
                          src={item.representative}
                          onPick={this.props.imgOnMouseDown.bind(this, item)}
                          onEdit={this.handleEditmedia.bind(this, item)}
                          showButton={false}
                        />
                      ))}
                      {this.state.hasMoreUserUpload &&
                        Array(1)
                          .fill(0)
                          .map((item, i) => (
                            <ImagePicker
                              key={i}
                              id="sentinel-userupload"
                              color="black"
                              src={""}
                              height={imgWidth}
                              defaultHeight={imgWidth}
                              width={imgWidth}
                              className=""
                              onPick={this.props.imgOnMouseDown.bind(
                                this,
                                null
                              )}
                              onEdit={this.handleEditmedia.bind(this, null)}
                              delay={-1}
                              showButton={false}
                            />
                          ))}
                      {this.state.hasMoreUserUpload &&
                        Array(10)
                          .fill(0)
                          .map((item, i) => (
                            <ImagePicker
                              key={i}
                              id="sentinel-userupload"
                              color="black"
                              src={""}
                              height={imgWidth}
                              defaultHeight={imgWidth}
                              width={imgWidth}
                              className=""
                              onPick={this.props.imgOnMouseDown.bind(
                                this,
                                null
                              )}
                              onEdit={this.handleEditmedia.bind(this, null)}
                              delay={-1}
                              showButton={false}
                            />
                          ))}
                    </div>
                  </div>
                </div>
              </InfiniteScroll>
              <button
                style={{
                  width: "calc(100% - 13px)",
                  backgroundColor: "white",
                  border: "none",
                  color: "black",
                  padding: "10px",
                  borderRadius: "3px",
                  height: "37px",
                  marginBottom: "10px",
                  position: "absolute",
                  top: "6px",
                  boxShadow:
                    "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
                }}
                onClick={() => {
                  document.getElementById("image-file").click();
                }}
              >
                {/* Tải lên một ảnh */}
                {this.props.translate("uploadAnImage")}
              </button>
            </div>
            {/* } */}
          </div>
        )}
      </div>
    );
  }
}

export default LeftSide;
