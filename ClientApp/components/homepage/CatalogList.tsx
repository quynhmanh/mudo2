import React from 'react';
import { CATALOG_LIST } from "@Constants";
import loadable from '@loadable/component';
import uuidv4 from "uuid/v4";

interface IProps {
    translate: any;
}

const CatalogItem = loadable(() => import("@Components/homepage/CatalogItem"));

const CatalogList = (props: IProps) => {

    const catalogList = CATALOG_LIST.map( catalog => 
        <CatalogItem 
            key={uuidv4()}
            translate={props.translate}
            {...catalog}
        />    
    );

    return (
        <div id="main-container" style={{ background: '#f4f4f6' }}>
            <section className="container" style={{ padding: '30px 0' }}>
                <div>
                    <div>
                        <div className="_30p__PONPi-YqVEVlgnN_6" style={{ padding: '0px' }}>
                            {catalogList}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CatalogList;