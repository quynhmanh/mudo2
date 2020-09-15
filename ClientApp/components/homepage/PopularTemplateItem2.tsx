import React, { Component, } from 'react';
import styled from 'styled-components';
import ImagePicker from "@Components/shared/ImagePicker";
import VideoPicker from "@Components/shared/VideoPicker";

interface IProps {
    dataValue: string;
    href: string;
    pickerType: string;
    pickerSrc: string;
    pickerWidth: number;
    title: string;
    size: string;
    id: string;
    width: number;
    height: number;
    isVideo: boolean;
    videoRepresentative: string;
    representative: string;
}

interface IState {

}

const HEIGHT = 250;

export default class PopularTemplateItem extends Component<IProps, IState> {

    constructor(props: any) {
        super(props);
    }

    render() {
        const props = this.props;
        let picker = null;
        if (props.isVideo) {
            picker = <VideoPicker
                id={props.id}
                key={"1"}
                color={""}
                delay={0}
                height={props.height}
                onPick={(e) => {}}
                onEdit={(e) => {
                    window.open(`/editor/design/${props.id}`)
                }}
                className={""}
                showButton={false}
                defaultHeight={HEIGHT}
                src={props.videoRepresentative}
                width={props.width}
                backgroundColor="black"
            />
        } else {
            picker = <ImagePicker
                id={props.id}
                key={"1"}
                color={""}
                delay={0}
                height={HEIGHT}
                onPick={(e) => {}}
                onEdit={(e) => {
                    window.open(`/editor/design/${props.id}`)
                }}
                className={""}
                showButton={false}
                defaultHeight={HEIGHT}
                src={props.representative}
                width={props.width}
                backgroundColor="black"
            />
        }

        return (
            <CC 
                style={{ marginRight: '16px' }}
                className="templateWrapper___3Fitk"
                onClick={e => {
                    if (window.dragging) e.preventDefault();
                }}
            >
                <a 
                    target="_blank" 
                    data-categ="popularTemplates"
                    data-subcateg="home"  
                    data-value={props.dataValue} 
                    href={props.href}
                >
                    <div 
                        className="" 
                        style={{
                            position: 'relative',
                            borderRadius: '4px',
                            overflow: 'hidden',
                        }}>
                        <div 
                            style={{ 
                                paddingTop: 0,
                                width: `${props.width / props.height * 250}px`,
                                // animationName: 'XhtCamN749DcvC-ecDUzp',
                                // animation: "LuuT-RWT7fXcJFhRfuaKV 1.4s infinite",
                                // animationDelay: '100ms',
                                transitionDuration: '0.4s',
                                transitionProperty: 'opacity, left, top, width',
                            }}>
                            {picker}
                        </div>
                    </div>
                </a>
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

var CC = styled.li`
    position: relative;
    height: ${HEIGHT}px;
    margin-right: 16px;
    transition: .3s;
`;