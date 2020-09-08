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
import ColorPicker from "@Components/editor/ColorPicker";
import Slider from "@Components/editor/Slider";
import { observer } from "mobx-react";

export interface IProps {
  id: string;
  effectId: number;
  align: any;
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
  handleLineHeightChange: any
  handleLineHieghtChangeEnd: any;
  backgroundOnMouseDown: any;
  templateOnMouseDown: any;
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

@observer
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
    this.backgroundOnMouseDown = this.backgroundOnMouseDown.bind(this);
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

  handleMakeAsPopular = () => {
    const url = `/api/Template/MakeAsPopulate?id=${this.props.id}`;
    axios.post(url, {
      id: this.props.id
    }).then(res => {

    });
  }

  handleRemoveAllMedia = () => {
    var model;
    if (
      editorStore.selectedTab === SidebarTab.Image ||
      editorStore.selectedTab === SidebarTab.Background
    ) {
      model = "Media";
    } else if (
      editorStore.selectedTab === SidebarTab.Template ||
      editorStore.selectedTab === SidebarTab.Text
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
      axios.post(url, 
        { 
          id: (document.getElementById("fontId") as HTMLInputElement).value,
          data: fr.result, 
          name: (document.getElementById("fontNameInp") as HTMLInputElement).value,
        }).then(() => {
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
          .then((res) => {
            if (self.state.userUpload1.length <= self.state.userUpload2.length) {
              self.setState({
                userUpload1: [res.data, ...self.state.userUpload1]
              });
            } else {
              self.setState({
                userUpload2: [res.data, ...self.state.userUpload1]
              });
            }
          });
      };

      i.src = fr.result.toString();
    };

    this.forceUpdate();
  };

  loadMore = (initialLoad: Boolean) => {
    let pageId;
    const PER_PAGE = 16;
    if (initialLoad) {
      pageId = 1;
    } else {
      pageId = (this.state.items.length + this.state.items2.length) / 16 + 1;
    }
    this.setState({ isLoading: true, error: undefined });
    const url = `/api/Media/Search?type=${TemplateType.Image}&page=${pageId}&perPage=${PER_PAGE}&terms=${this.state.query}`;
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

    let image = Array.from(editorStore.images2.values()).find(image => 
    image.page == editorStore.activePageId && image.type == TemplateType.BackgroundImage);
    image = toJS(image);
    image.src = window.location.origin + "/" + item.representative;
    image.srcThumnail = item.representativeThumbnail;
    image.color = "";
    image.width = rectWidth;
    image.height = rectHeight;
    image.origin_width = rectWidth;
    image.origin_height = rectHeight;
    image.posX = -(width - rectWidth) / 2;
    image.posY = -(height - rectHeight) / 2;
    image.imgWidth = width;
    image.imgHeight = height;
    image.selected = true;
    image.zIndex = 1;

    editorStore.images2.set(image._id, image);
    this.props.handleImageSelected(image._id, editorStore.activePageId, false, true, true);
  }

  handleEditFont = item => {
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
    e.preventDefault();

    var doc = this.state.templates.find(doc => doc.id == id);
    if (!doc) {
      doc = this.state.templates2.find(doc => doc.id == id);
    }

    this.props.templateOnMouseDown(doc);
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
            if (res.value.key[i].id)
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

  handleDeleteTemplate = () => {
    var url = `/api/Template/Delete?id=${this.props.id}`;
    axios.delete(url);
  };

  handleUndeleteTemplate = () => {
    var url = `/api/Template/Undelete?id=${this.props.id}`;
    axios.delete(url);
  }

  handleSidebarSelectorClicked = (tab, e) => {
    editorStore.selectedTab = tab;
  };

  handleColorPick = (e) => {
    this.forceUpdate();
  }

  addText = (text, fontSize, fontFace, fontRepresentative, width, height) => {
    var item = {
      _id: uuidv4(),
      type: TemplateType.Heading,
      align: "alignLeft",
      width: width,
      origin_width: width,
      height: height * 1,
      origin_height: height,
      left: 0,
      top: 0,
      rotateAngle: 0.0,
      innerHTML: `<div class="font" style="font-size: ${fontSize}px;">${text}</div>`,
      scaleX: 1,
      scaleY: 1,
      ref: editorStore.idObjectSelected,
      page: editorStore.activePageId,
      zIndex: editorStore.upperZIndex + 1,
      color: "black",
      fontSize: fontSize,
      fontRepresentative: fontRepresentative,
      hovered: true,
      selected: true,
      fontFace: fontFace,
      effectId: 8,
      lineHeight: 1.4,
      letterSpacing: 30,
      opacity: 100,
    };

    editorStore.addItem2(item, true);
    this.props.handleImageSelected(item._id, editorStore.activePageId, null, true);

    let index = editorStore.pages.findIndex(pageId => pageId == editorStore.activePageId);
    editorStore.keys[index] = editorStore.keys[index] + 1;

    setTimeout(() => {
      let el = document.getElementById(item._id + "hihi4alo");
      let range = document.createRange();
      range.selectNodeContents(el)
      var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }, 100);
    
    editorStore.increaseUpperzIndex();
  }

  render() {
    let image = editorStore.images2.get(editorStore.idObjectSelected) || {};
    if (editorStore.childId && image.document_object) {
      image = image.document_object.find(text => text._id == editorStore.childId) || {};
    }
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
          <div
          style={{
            width: `80px`,
            zIndex: 1111111111,
            flexDirection: 'column',
          }}
        >
          {editorStore.tReady && 
          <TopMenu
            translate={this.props.translate}
            mounted={this.props.mounted}
            mode={this.props.mode}
            toolbarSize={this.props.toolbarSize}
            selectedTab={editorStore.selectedTab}
            onClick={this.handleSidebarSelectorClicked}
            tReady={this.props.tReady}
          />}
          </div>
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
              editorStore.selectedTab === SidebarTab.Video
                ? this.uploadVideo()
                : editorStore.selectedTab === SidebarTab.Font
                ? this.uploadFont(e)
                : this.uploadImage(
                    editorStore.selectedTab === SidebarTab.Image
                      ? TemplateType.Image
                      : editorStore.selectedTab === SidebarTab.Upload
                      ? TemplateType.UserUpload
                      : editorStore.selectedTab === SidebarTab.Background
                      ? TemplateType.BackgroundImage
                      : editorStore.selectedTab ===
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
              editorStore.selectedTab === SidebarTab.Font
                ? this.uploadFont.bind(this)
                : this.uploadImage.bind(
                    this,
                    editorStore.selectedTab === SidebarTab.Image
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
          <input id="fontNameInp" type="text"/>
          <input id="fontId" type="text"/>
          <button
            style={{
              bottom: 0,
              right: 0
            }}
            onClick={this.handleMakeAsPopular.bind(this)}
          >
            MakeAsPopular
          </button>
          <button
            style={{
              bottom: 0,
              right: 0
            }}
            onClick={this.handleDeleteTemplate.bind(this)}
          >
            Delete
          </button>
          <button
            style={{
              bottom: 0,
              right: 0
            }}
            onClick={this.handleUndeleteTemplate.bind(this)}
          >
            Undelete
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
              // backgroundColor: editorStore.selectedTab === SidebarTab.Effect ? "white" : "#293039",
            }}
          >
            <div
              style={{
                opacity: editorStore.selectedTab === SidebarTab.Image ? 1 : 0,
                position: "absolute",
                width: "347px",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  editorStore.selectedTab !== SidebarTab.Image &&
                  `translate3d(0px, calc(-${
                    editorStore.selectedTab > SidebarTab.Image ? 40 : -40
                  }px), 0px)`,
                zIndex: editorStore.selectedTab !== SidebarTab.Image && -1,
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
                          backgroundColorLoaded="transparent"
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
                              backgroundColorLoaded="transparent"
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
                          backgroundColorLoaded="transparent"
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
                opacity: editorStore.selectedTab === SidebarTab.Text ? 1 : 0,
                position: "absolute",
                width: "347px",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  editorStore.selectedTab !== SidebarTab.Text &&
                  `translate3d(0px, calc(${
                    editorStore.selectedTab < SidebarTab.Text ? 40 : -40
                  }px), 0px)`,
                top: "20px",
                zIndex: editorStore.selectedTab !== SidebarTab.Text && -1,
                height: "100%",
                left: '19px',
                overflow: "scroll",
              }}
            >
              <div style={{ color: "white" }}>
                {editorStore.tReady &&
                <div style={{ marginBottom: "10px" }}>
                  <p>
                    {this.props.translate("clickTextToAddToPage")}
                  </p>
                  <div
                    className="add-heading-btn"
                    style={{
                      fontSize: "28px",
                      cursor: "pointer",
                      background: "hsla(0,0%,100%,.07)",
                      borderRadius: "4px",
                      padding: "10px",
                      width: "95%",
                      fontFamily: "Open-Sans-Extra-Bold",
                    }}
                    onMouseDown={e => {
                      e.preventDefault();
                      const text = this.props.translate("addAHeading");
                      this.addText(text, 56, "Open-Sans-Extra-Bold", "images/font-Open Sans Extra Bold.png", 500, 78);
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
                      borderRadius: "4px",
                      padding: "10px",
                      width: "95%",
                      fontFamily: "Open-Sans-Regular",
                    }}
                    onMouseDown={e => {
                      e.preventDefault();
                      const text = this.props.translate("addASubHeading");
                      this.addText(text, 32, "Open-Sans-Regular", "images/font-Open Sans Regular.png", 300, 44);
                    }}
                  >
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
                      borderRadius: "4px",
                      padding: "10px",
                      width: "95%",
                      fontFamily: "Open-Sans-Light",
                    }}
                    onMouseDown={e => {
                      e.preventDefault();
                      const text = this.props.translate("addABodyText");
                      this.addText(text, 22, "Open-Sans-Light", "images/font-Open Sans Light.png", 300, 30);
                    }}
                  >
                    {this.props.translate("addABodyText")}
                  </div>
                </div>
                }
                {
                  <div style={{ height: "calc(100% - 221px)" }}>
                    <InfiniteScroll
                      scroll={false}
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
                              classNameContainer="text-picker-container"
                              onPick={this.textOnMouseDown.bind(this, item.id)}
                              onEdit={() => {
                                window.open(`/editor/template/${item.id}`);
                              }}
                              padding={10}
                              showButton={true}
                            />
                          ))}
                          {this.state.hasMoreTextTemplate &&
                            Array(1)
                              .fill(0)
                              .map((item, i) => (
                                <ImagePicker
                                  padding={10}
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
                              classNameContainer="text-picker-container"
                              height={imgWidth / (item.width / item.height)}
                              src={item.representative}
                              onPick={this.textOnMouseDown.bind(this, item.id)}
                              onEdit={() => {
                                window.open(`/editor/template/${item.id}`);
                              }}
                              padding={10}
                              showButton={true}
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
                opacity: editorStore.selectedTab === SidebarTab.Template ? 1 : 0,
                position: "absolute",
                width: "347px",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  editorStore.selectedTab !== SidebarTab.Template &&
                  `translate3d(0px, calc(${
                    editorStore.selectedTab < SidebarTab.Template ? 40 : -40
                  }px), 0px)`,
                top: "10px",
                zIndex: editorStore.selectedTab !== SidebarTab.Template && -1,
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
                            window.open(`/editor/template/${item.id}`);
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
                            window.open(`/editor/template/${item.id}`);
                          }}
                          showButton={true}
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
                            window.open(`/editor/template/${item.id}`);
                          }}
                          showButton={true}
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
                            window.open(`/editor/template/${item.id}`);
                          }}
                          showButton={true}
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
                  editorStore.selectedTab === SidebarTab.Background ? 1 : 0,
                position: "absolute",
                width: "347px",
                color: "white",
                overflow: "scroll",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  editorStore.selectedTab !== SidebarTab.Background &&
                  `translate3d(0px, calc(${
                    editorStore.selectedTab < SidebarTab.Background ? 40 : -40
                  }px), 0px)`,
                top: "10px",
                zIndex: editorStore.selectedTab !== SidebarTab.Background && -1,
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
                opacity: editorStore.selectedTab === SidebarTab.Font ? 1 : 0,
                position: "absolute",
                width: "370px",
                color: "white",
                overflow: "scroll",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  editorStore.selectedTab !== SidebarTab.Font &&
                  `translate3d(0px, calc(${
                    editorStore.selectedTab < SidebarTab.Font ? 40 : -40
                  }px), 0px)`,
                zIndex: editorStore.selectedTab !== SidebarTab.Font && -1,
                height: "100%",
                left: "0px",
                backgroundColor: "white",
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
                            onClick={e => {
                              this.props.selectFont(font.id, e);
                            }}
                          >
                            <img
                              style={{
                                // margin: "auto"
                              }}
                              src={font.representative}
                            />
                            {editorStore.fontId === font.id ? (
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
                                  style={{ fill: "black" }}
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
                opacity: editorStore.selectedTab === SidebarTab.Effect ? 1 : 0,
                position: "absolute",
                width: "370px",
                overflow: "scroll",
                // transition:
                //   "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                // transform:
                //   editorStore.selectedTab !== SidebarTab.Effect &&
                //   `translate3d(0px, calc(${
                //     editorStore.selectedTab < SidebarTab.Effect ? 40 : -40
                //   }px), 0px)`,
                zIndex: editorStore.selectedTab !== SidebarTab.Effect && -1,
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
                        style={{
                          boxShadow: editorStore.effectId == 8 && "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff",
                        }}
                        onClick={e => {
                          this.props.handleApplyEffect(8, null, null, null, null, null, "black");
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
                      style={{
                        boxShadow: editorStore.effectId == 1 && "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff",
                      }}
                      onClick={e => {
                        this.props.handleApplyEffect(1, 50, 12.5, 0, 40, null, null);
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
                      style={{
                        boxShadow: editorStore.effectId == 2 && "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff",
                      }}
                      onClick={e => {
                        this.props.handleApplyEffect(2, null, null, null, null, 50, "black");
                      }}
                      className="effect-btn"
                      >
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
                  { editorStore.effectId == 1 && 
                  <div style={{
                    marginBottom: "15px",
                  }}>
                    <Slider 
                      title="Offset" 
                      currentValue={image.offSet}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeOffset}
                      onChangeEnd={this.props.handleChangeOffsetEnd}
                    />
                    <Slider 
                      title="Direction" 
                      currentValue={image.direction}
                      pauser={this.props.pauser}
                      multiplier={3.6}
                      onChange={this.props.handleChangeDirection}
                      onChangeEnd={this.props.handleChangeDirectionEnd}
                    />
                    <Slider 
                      title="Blur" 
                      currentValue={image.blur}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeBlur}
                      onChangeEnd={this.props.handleChangeBlurEnd}
                    />
                    <Slider 
                      title="Transparency" 
                      currentValue={image.textShadowTransparent}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeTextShadowTransparent}
                      onChangeEnd={this.props.handleChangeTextShadowTransparentEnd}
                    />
            </div>}
            { editorStore.effectId == 2 && 
                  <div style={{
                    marginBottom: "15px",
                  }}>
                    <Slider 
                      title="Intensity" 
                      currentValue={image.intensity}
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
                        style={{
                          boxShadow: editorStore.effectId == 3 && "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff",
                        }}
                        onClick={e => {
                          this.props.handleApplyEffect(3, null, null, null, null, null, 30, "black");
                          // if (window.prevEffectId) {
                          //   document.getElementById("effect-btn-" + window.prevEffectId).style.boxShadow = "0 0 0 1px rgba(14,19,24,.15)";
                          // }
                          // document.getElementById("effect-btn-3").style.boxShadow = "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff";
                          // window.prevEffectId = 3;
                        }}
                        id="effect-btn-3"
                        className="effect-btn"
                        >
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
                      style={{
                        boxShadow: editorStore.effectId == 4 && "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff",
                      }}
                      onClick={e => {
                        this.props.handleApplyEffect(4, 50, 12.5, 0, 40, null, 30, "black");
                      }}
                      id="effect-btn-4"
                      className="effect-btn"
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
                      style={{
                        boxShadow: editorStore.effectId == 5 && "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff",
                      }}
                      onClick={e => {
                        this.props.handleApplyEffect(5, 50, 12.5, 0, 40, null, "", "black");
                      }}
                      className="effect-btn"
                      id="effect-btn-5"
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
                  { editorStore.effectId == 3 && 
                  <div style={{
                    marginBottom: "15px",
                  }}>
                    <Slider 
                      title="Thickness" 
                      currentValue={image.hollowThickness}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeHollowThickness}
                      onChangeEnd={this.props.handleChangeHollowThicknessEnd}
                    />
            </div>}
            { editorStore.effectId == 4 && 
                  <div style={{
                    marginBottom: "15px",
                  }}>
                    <Slider 
                      title="Thickness" 
                      currentValue={image.hollowThickness}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeHollowThickness}
                      onChangeEnd={this.props.handleChangeHollowThicknessEnd}
                    />
                    <Slider 
                      title="Offset" 
                      currentValue={image.offSet}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeOffset}
                      onChangeEnd={this.props.handleChangeOffsetEnd}
                    />
                    <Slider 
                      title="Direction" 
                      currentValue={image.direction}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeDirection}
                      multiplier={3.6}
                      onChangeEnd={this.props.handleChangeDirectionEnd}
                    />
            </div>}
            { editorStore.effectId == 5 && 
                  <div style={{
                    marginBottom: "15px",
                  }}>
                    <Slider 
                      title="Offset" 
                      currentValue={image.offSet}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeOffset}
                      onChangeEnd={this.props.handleChangeOffsetEnd}
                    />
                    <Slider 
                      title="Direction" 
                      currentValue={image.direction}
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
                      style={{
                        boxShadow: editorStore.effectId == 6 && "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff",
                      }}
                      onClick={e => {
                        this.props.handleApplyEffect(6, 10, 83, 0, 40, null, "", "black");
                      }}
                      className="effect-btn"
                      id="effect-btn-6"
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
                      style={{
                        boxShadow: editorStore.effectId == 7 && "0 0 0 2px #00c4cc, inset 0 0 0 2px #fff",
                      }}
                      onClick={e => {
                        this.props.handleApplyEffect(7, null, null, null, null, null, null, "white", "drop-shadow(rgb(255, 82, 188) 0px 0px 5.93333px) drop-shadow(rgba(255, 82, 188, 0.95) 0px 0px 35.6px) drop-shadow(rgba(255, 82, 188, 0.54) 0px 0px 118.667px)");
                      }}
                      className="effect-btn"
                      id="effect-btn-7"
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
                  { editorStore.effectId == 6 && 
                  <div style={{
                    marginBottom: "15px",
                  }}>
                    <Slider 
                      title="Offset" 
                      currentValue={image.offSet}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeOffset}
                      onChangeEnd={this.props.handleChangeOffsetEnd}
                    />
                    <Slider 
                      title="Direction" 
                      currentValue={image.direction}
                      pauser={this.props.pauser}
                      onChange={this.props.handleChangeDirection}
                      multiplier={3.6}
                      onChangeEnd={this.props.handleChangeDirectionEnd}
                    />
            </div>}
            { editorStore.effectId == 7 && 
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
                opacity: editorStore.selectedTab === SidebarTab.Color ? 1 : 0,
                position: "absolute",
                width: "100%",
                color: "white",
                overflow: "scroll",
                zIndex: editorStore.selectedTab !== SidebarTab.Color && -1,
                height: "100%",
                backgroundColor: "white",
              }}
            >
              <div style={{ display: "inline-block" }}>
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
                      {/* {this.props.tReady && */}
                      <ColorPicker 
                        setSelectionColor={this.props.setSelectionColor}
                        colorPickerShown={this.props.colorPickerShown}
                        handleColorPick={this.handleColorPick}
                        translate={this.props.translate}
                      />
                      {/* } */}
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
                  editorStore.selectedTab === SidebarTab.RemovedBackgroundImage
                    ? 1
                    : 0,
                position: "absolute",
                width: "347px",
                color: "white",
                overflow: "scroll",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  editorStore.selectedTab !==
                    SidebarTab.RemovedBackgroundImage &&
                  `translate3d(0px, calc(${
                    editorStore.selectedTab < SidebarTab.RemovedBackgroundImage
                      ? 40
                      : -40
                  }px), 0px)`,
                top: "10px",
                zIndex:
                  editorStore.selectedTab !==
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
                opacity: editorStore.selectedTab === SidebarTab.Element ? 1 : 0,
                position: "absolute",
                width: "347px",
                color: "white",
                overflow: "scroll",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  editorStore.selectedTab !== SidebarTab.Element &&
                  `translate3d(0px, calc(${
                    editorStore.selectedTab < SidebarTab.Element ? 40 : -40
                  }px), 0px)`,
                top: "10px",
                zIndex: editorStore.selectedTab !== SidebarTab.Element && -1,
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
                opacity: editorStore.selectedTab === SidebarTab.Video ? 1 : 0,
                position: "absolute",
                width: "347px",
                color: "white",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  editorStore.selectedTab !== SidebarTab.Video &&
                  `translate3d(0px, calc(${
                    editorStore.selectedTab < SidebarTab.Video ? 40 : -40
                  }px), 0px)`,
                top: "10px",
                zIndex: editorStore.selectedTab !== SidebarTab.Video && -1,
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
                opacity: editorStore.selectedTab === SidebarTab.Upload ? 1 : 0,
                position: "absolute",
                width: "347px",
                color: "white",
                overflow: "scroll",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  editorStore.selectedTab !== SidebarTab.Upload &&
                  `translate3d(0px, calc(${
                    editorStore.selectedTab < SidebarTab.Upload ? 40 : -40
                  }px), 0px)`,
                top: "10px",
                zIndex: editorStore.selectedTab !== SidebarTab.Upload && -1,
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
                    // overflow: "scroll",
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
