import * as React from "react";
import { RouteComponentProps } from "react-router";
import Editor from "@Pages/Editor";
import { observable, action, autorun } from "mobx";
import uuidv4 from "uuid/v4";

class Images {
  @observable images = [];
  @observable fontsList = [];
  @observable fonts = [];
  @observable upperZIndex = 1;

  @action addItem = (item) => {
    console.log('addItem ', item);
      this.images.push(item);
  }

  @action addFont = (item) => {
    this.fonts.push(item);
  }

  @action addFontItem = (item) => {
    console.log('addFontItem item ', item);
    this.fontsList.push(item);
  }

  @action update = (images) => {
    console.log('images ', images);
    this.images = images;
  }

  @action replaceFirstItem = (image) => {
    this.images[0] = image;
  }

  @action increaseUpperzIndex = () => {
    this.upperZIndex += 1;
    console.log('increaseUppperzIndex ', this.upperZIndex);
  }
}

autorun(() => {
  console.log('images', this.images);
})

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

export default class EditorContainer extends React.Component<IProps, IState> {
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
