import React from 'react';
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
}

const HEIGHT = 250;

const PopularTemplateItem = (props: IProps) => {
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
                    <div style={{ paddingTop: 0,}}>
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

var CC = styled.li`
    position: relative;
    height: ${HEIGHT}px;
    margin-right: 16px;
    transition: .3s;
`;

export default PopularTemplateItem;