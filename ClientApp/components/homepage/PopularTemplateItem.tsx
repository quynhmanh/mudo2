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
                <div className="editTemplateWrapper___29oLU" style={{ opacity: 0 }}>
                    <div className="editTemplate___3q0zy">
                        <svg viewBox="0 0 16 16" width={16} height={16} className="pencilIcon___3X12E">
                            <path d="M6.32085 8.28699C6.01646 8.62207 5.94182 8.86259 5.54288 9.49294C5.80082 9.67292 6.29597 10.0884 6.63934 10.8042C7.32526 10.4103 7.64541 10.3505 8.00868 10.0445C10.3824 8.04563 16.1949 0.880451 15.995 0.673101C15.7851 0.45331 8.41094 5.99453 6.32085 8.28699ZM4.85779 10.0495C3.82685 9.867 2.80918 10.5189 2.1299 12.1478C1.44979 13.7768 0.235549 14.4287 0 14.3889C1.26732 14.8475 5.13232 16.0203 6.09277 11.5557C5.6847 10.4849 4.85779 10.0495 4.85779 10.0495Z" />
                        </svg>
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