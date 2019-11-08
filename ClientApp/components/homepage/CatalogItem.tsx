import React from 'react';
import { ICatalogSubItem } from "@Models/ICatalogSubItem";
import loadable from '@loadable/component';
import uuidv4 from "uuid/v4";

interface IProps {
    translate: any;
    name: string;
    subItems: ICatalogSubItem[];
}

const CatalogSubItem = loadable(() => import("@Components/homepage/CatalogSubItem"));

const CatalogItem = (props: IProps) => {

    const catalogSubItems = props.subItems.map (subItem =>
        <CatalogSubItem 
            key={uuidv4()}
            {...subItem}
            translate={props.translate}
        />
    );

    return (
        <React.Fragment>
            <h4>{props.translate(props.name)}</h4>
            <div className="-ePYCIKwmKaSsQTHX72YG putVYyFpLWTsqziLXPxhR">
                <div className="_3PK-lmKzpAGcI8WTdBQX4i">
                    <div className="_1sza4uX0yqDVxS7xsxMj-L" style={{transform: 'translateX(0px)', marginLeft: '-16px'}}>
                        {catalogSubItems}
                    </div>
                </div>
                <div 
                    className="_1e9RJ140GkyvDh6KOo5VX6 _3olv_1czQo3hEv28-Bjg7P" 
                    style={{display: 'none', top: 'calc(calc(50% - 20px) + -20px)', right: '-24px'}}
                >
                    <span className="_1JXn9nbOAelpkRcPCUu4Aq _3riOXmq8mfDI5UGnLrweQh _3afRAIYF_d3AMkQFT_AuCI">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width={16} 
                            height={16} 
                            viewBox="0 0 16 16"
                        >
                            <path 
                                fill="currentColor" 
                                d="M6.47 4.29l3.54 3.53c.1.1.1.26 0 .36L6.47 11.7a.75.75 0 1 0 1.06 1.06l3.54-3.53c.68-.69.68-1.8 0-2.48L7.53 3.23a.75.75 0 0 0-1.06 1.06z" />
                        </svg>
                    </span>
                </div>
            </div>
        </React.Fragment>
    );
}

export default CatalogItem;