import React from 'react';
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


const PopularTemplateItem = (props: IProps) => {

    let picker = null;
    picker = <ImagePicker
        id={props.id}
        key={"1"}
        color={""}
        delay={0}
        // height={160}
        onPick={(e) => {}}
        onEdit={(e) => {
            window.open(`/editor/design/${props.id}`)
        }}
        className={""}
        showButton={false}
        defaultHeight={160}
        src={props.representative}
        width={props.width}
        backgroundColor="black"
    />

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
                onClick={e => {
                    if (window.dragging) e.preventDefault();
                }}
            >
                <div className="previewWrapper___mbAh5">
                    <div 
                        style={{ 
                            paddingTop: 0, 
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

var CC = styled.li`
    position: relative;
    height: 160px;
    margin-right: 16px;
    transition: .3s;
`;

export default PopularTemplateItem;