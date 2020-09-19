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
    picker = null;
    cc = null;

    mediaLoaded(loaded, transitionEnd) {
        if (loaded) this.loaded = true;
        if (transitionEnd) this.transitionEnd = true;

            console.log('mediaLoaded ', loaded, transitionEnd, this.loaded, this.transitionEnd);
        if (this.loaded && this.transitionEnd) {
            this.cc.style.backgroundColor = "transparent";
            this.cc.style.animation = "";
            this.picker.image.style.opacity = 1;
            this.picker.image.parentNode.style.height = "";
        }
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
            <CC
                ref={i => this.cc = i}
                style={{ marginRight: '24px', overflow: 'hidden', }}
                className="templateWrapper___3Fitk"
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
                    <div
                        style={{
                            width: '200px',
                            minHeight: '200px',
                            display: 'flex',
                        }}
                        className="previewWrapper___mbAh5">
                        <div
                            style={{
                                paddingTop: 0,
                                margin: 'auto',
                                // boxShadow: "0 2px 12px rgba(53,71,90,.2), 0 0 0 rgba(68,92,116,.02)", 
                            }}>
                            {picker}
                            {/* {showPlayIcon === true ? playIcon : null} */}
                        </div>
                    </div>
                </a>
                <div
                    className="templateInfo___2YZSg"
                // style={{ opacity: 0 }}
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
    margin-right: 16px;
    transition: .3s;
    width: 200px;
`;