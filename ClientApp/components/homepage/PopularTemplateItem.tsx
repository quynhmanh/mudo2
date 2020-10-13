import React, { Component } from 'react';
import styled from 'styled-components';
import ImagePicker from "@Components/shared/ImagePicker2";

interface IProps {
    dataValue: string;
    href: string;
    pickerType: string;
    pickerSrc: string;
    pickerWidth: number;
    title: string;
    size: string;
    id: string;
    representative: string;
    width: number;
    keys: number;
    startPoint: number;
}

interface IState {

}

export default class PopularTemplateItem extends Component<IProps, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
            transitionEnd: this.props.id != "sentinel-image2" ? true: false,
            loaded: false,
        }

        this.mediaLoaded = this.mediaLoaded.bind(this);
    }

    loaded = false;
    transitionEnd = true;
    transitioned = false;
    picker = null;
    cc = null;

    mediaLoaded(loaded, transitionEnd) {
        if (loaded) this.loaded = true;
        if (transitionEnd) this.transitionEnd = true;

        if (this.loaded && this.transitionEnd && !this.transitioned) {
            this.cc.style.backgroundColor = "transparent";
            this.cc.style.animation = "";
            this.picker.image.style.opacity = 1;
            this.picker.image.parentNode.style.height = "";

            this.transitioned = true;
            // if (this.props.keys == this.props.startPoint) {
                setTimeout(() => {
                    this.props.loadImage(this.props.keys + 1);
                }, 100);
        }
    }
    
    shouldComponentUpdate(nextProps) {
        if (this.props.id != nextProps.id) {
            return true;
        }
        return false;
    }

    render() {
        let props = this.props;

        let picker = null;
        picker = <ImagePicker
            id={props.id}
            prefix="1"
            keys={props.keys}
            key={"1"}
            color={""}
            delay={0}
            height={160}
            onPick={(e) => { }}
            onEdit={(e) => {
                window.open(`/editor/design/${props.id}`)
            }}
            className={""}
            showButton={false}
            defaultHeight={160}
            src={props.representative}
            // backgroundColor="black"
            width={160}
            transitionEnd={true}
            startPoint={props.startPoint}
            loadImage={props.loadImage}
            animation={true}
            ref={i => this.picker = i}
            mediaLoaded={this.mediaLoaded}
            backgroundColor="rgb(0 0 0 / 4%)"
        />

        return (
            <CC>
                <div
                    style={{
                        height: "100%",
                        overflow: "hidden",
                    }}
                >
                <a
                    target="_blank"
                    data-categ="popularTemplates"
                    data-subcateg="home"
                    data-value={props.dataValue}
                    href={props.href}
                    onClick={e => {
                        if (window.dragging) e.preventDefault();
                    }}
                >
                    <PreviewWrapper>
                        <PickerContainer
                            ref={i => this.cc = i}
                            style={{
                                animationDelay: (-1200 + (this.props.keys - this.props.startPoint) * 120) + "ms",
                            }}>
                            {picker}
                        </PickerContainer>
                    </PreviewWrapper>
                </a>
                </div>
                <div
                    className="templateInfo___2YZSg"
                >
                    <p className="small___1Vvfz geometria-medium___3wRqs format___3qx4a">{props.title}</p>
                    <p className="x-small___1lJKy size___1sVBg">{props.size}</p>
                </div>
            </CC>
        );
    }
}

let CC = styled.li`
    position: relative;
    height: 200px;
    margin-right: 24px;
    transition: .3s;
    width: 200px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 3px;
`;

let PickerContainer = styled.div`
    padding-top: 0;
    margin: auto;
    box-shadow: 0 2px 12px rgba(53,71,90,.2), 0 0 0 rgba(68,92,116,.02);
    animation: TB8Ekw 1.4s infinite;
    background-color: black;
    border-radius: 5px;
`;

let PreviewWrapper = styled.div`
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    padding: 20px;
    background-color: #eee;
    width: 200px;
    min-height: 200px;
    display: flex;
    box-shadow: 0 2px 12px rgba(53,71,90,.2), 0 0 0 rgba(68,92,116,.02);
`;