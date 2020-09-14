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

const playIcon = <svg 
                    style={{ position: 'absolute', right: 0, bottom: 0 }} 
                    viewBox="0 0 16 16" 
                    width={16} 
                    height={16} 
                    className="iconPlay___RdcjT"
                    >
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H16V10C16 13.3137 13.3137 16 10 16H0V2Z" />
                    <path d="M9.92467 6.38276L11.6878 7.40418C11.9442 7.49994 12.1121 7.74717 12.1066 8.02078C12.1012 8.29439 11.9235 8.53471 11.6635 8.62014L9.90035 9.64156L7.79673 10.8575L6.05789 11.8546C5.47423 12.1951 5 11.9154 5 11.2466V4.75337C5 4.08458 5.47423 3.80491 6.05789 4.14538L7.79673 5.16679L9.92467 6.38276Z" fill="white" />
                </svg>
const HEIGHT = 250;

const PopularTemplateItem = (props: IProps) => {
    console.log('props', props)
    let picker = null;
    let showPlayIcon = false;
    if (props.isVideo) {
        picker = <VideoPicker
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

var CC = styled.li`
    position: relative;
    height: ${HEIGHT}px;
    margin-right: 16px;
    transition: .3s;
`;

export default PopularTemplateItem;