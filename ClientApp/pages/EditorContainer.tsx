import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import Editor from "@Pages/Editor";
import { observable, action, IObservableArray } from "mobx";
import uuidv4 from "uuid/v4";
import { toJS } from "mobx";

class Images {
  @observable images: IObservableArray<any> = [] as IObservableArray;
  @observable fontsList = [];
  @observable fonts = [];
  @observable upperZIndex = 1;
  @observable idObjectSelected = null;
  @observable activePageId = uuidv4();
  @observable pages = [this.activePageId];

  @action addItem = (item, isChild) => {
    if (isChild) {
      var images = toJS(this.images);
      images = images.map(img => {
        if (img._id === this.idObjectSelected) {
          img.childId = item._id;
        }
        return img;
      }) as IObservableArray;
      images.push(item);
      this.images.replace(images);
    } else {
      this.images.push(item);
    }
  }

  @action addFont = (item) => {
    this.fonts.push(item);
  }

  @action addFontItem = (item) => {
    this.fontsList.push(item);
  }

  @action update = (images) => {
    this.images = images;
  }

  @action replaceFirstItem = (image) => {
    this.images[0] = image;
  }

  @action increaseUpperzIndex = () => {
    this.upperZIndex += 1;
  }

  @action applyTemplate = (template) => {
    var images = toJS(this.images);
    images = images.filter(image => {
      return image.page !== this.activePageId;
    }) as IObservableArray;

    images = [...images, ...template] as IObservableArray;
    this.images.replace(images);
  }
}

type Props = RouteComponentProps<{}>;

interface IProps {
    rid: any;
    mode: any;
    match: any;
}

interface IState {
  tab: string;
}


let firstpage = uuidv4();

const store = new Images();

export default class EditorContainer extends Component<IProps, IState> {
  state = {
    tab: "nd"
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <Editor
        useSuspense={false} 
        upperZIndex={store.upperZIndex}
        store={store}
        rid={this.props.rid} 
        mode={this.props.mode} 
        match={this.props.match} 
        addItem={store.addItem} 
        addFontItem={store.addFontItem}
        addFont={store.addFont}
        images={store.images}
        fontsList={store.fontsList}
        fonts={store.fonts}
        update={store.update}
        replaceFirstItem={store.replaceFirstItem}
        firstpage={firstpage} 
        increaseUpperzIndex={store.increaseUpperzIndex}
      />
    );
  }
}
