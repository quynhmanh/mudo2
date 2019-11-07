import React from 'react';
import loadable from '@loadable/component';
import uuidv4 from "uuid/v4";
import { SUGGESTED_LIST } from "@Constants";

interface IProps {
    translate: any;
}

const SuggestedItem = loadable(() => import("@Components/homepage/SuggestedItem"));

const SuggestedList = (props: IProps) => {

    const suggestedList = SUGGESTED_LIST.map( item =>
        <SuggestedItem
            key={uuidv4()}
            translate={props.translate}
            {...item}
        />
    );

    return (
        <div
            id="homepage_list"
            style={{
                width: '100%',
                position: 'absolute',
                left: '0',
                marginTop: '1px',
                zIndex: 99999
            }}
        >
            <ul
                id="suggested_list"
                style={{
                    listStyle: 'none',
                    width: '500px',
                    margin: 'auto',
                    padding: 0,
                    backgroundColor: 'white',
                    height: '214px',
                    overflow: 'scroll',
                    borderRadius: '5px',
                    boxShadow: '0 0 0 1px rgba(14,19,24,.02), 0 2px 8px rgba(14,19,24,.15)',
                }}
                className="_10KwohWWbzE9k3VxqiINB8 _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88"
            >
                <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
                    <ul className="_3iAhdo5irp6o991TKYLo_G _10KwohWWbzE9k3VxqiINB8 _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88" />
                </li>
                <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
                    <div className="_1ERFI8bZ2yaDXttvzi0r56">
                        <span 
                            style={{
                                marginLeft: '5px',
                                fontFamily: 'AvenirNextRoundedPro-Medium',
                            }} 
                            className="_1ZekmJX88FhNx-izKxyhf7 jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88"
                        >
                            {props.translate("suggested")}
                        </span>
                    </div>
                </li>
                <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
                    <ul style={{listStyle: 'none', padding: 0}} 
                        className="_35hMZzDjUCiFAL0T8RAwqY _10KwohWWbzE9k3VxqiINB8 _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88">
                        {suggestedList}
                    </ul>
                </li>
                <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
                    <ul className="_3ojNQJCHMpm1Q_3Zp_wYzn _10KwohWWbzE9k3VxqiINB8 _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88" />
                </li>
            </ul>
        </div>
    );
}

export default SuggestedList;
