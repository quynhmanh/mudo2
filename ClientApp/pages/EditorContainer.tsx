import * as React from "react";
import { RouteComponentProps } from "react-router";
import Editor from "@Pages/Editor";
import { observable, action } from "mobx";
import uuidv4 from "uuid/v4";

class Images {
  @observable images = [];

  @action addItem = (item) => {
    console.log('addItem ', item);
      this.images.push(item);
  }

  @action update = (images) => {
    console.log('images ', images);
    this.images = images;
  }

  @action replaceFirstItem = (image) => {
    this.images[0] = image;
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
        rid={this.props.rid} 
        mode={this.props.mode} 
        match={this.props.match} 
        addItem={store.addItem} 
        images={store.images} 
        update={store.update}
        replaceFirstItem={store.replaceFirstItem}
        firstpage={firstpage} />
    );
  }
}
