import React, { Component } from "react";
import Editor from "@Pages/Editor";

interface IProps {
    rid: any;
    mode: any;
    match: any;
}

interface IState {
  tab: string;
}


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
        rid={this.props.rid} 
        mode={this.props.mode} 
        match={this.props.match} 
      />
    );
  }
}


{/* <Editor
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
        increaseUpperzIndex={store.increaseUpperzIndex}
      /> */}