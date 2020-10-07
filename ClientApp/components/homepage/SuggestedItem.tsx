import React from 'react';

interface IProps {
    translate: any;
    url: string;
    src: string;
    title: string;
    size: string;
}

const SuggestedItem = (props: IProps) => {
    return (
        <li className="_3VrPWTB9VCs9Aq7gbbsrnr">
            <div>
                <a 
                    href={props.url}
                    style={{
                        color: "black",
                    }}
                    type="button" 
                    className="_2uHN4spVhhwLkZOp3_KMfh _1WAnEU6mBaV9wjYeHOx--- _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 _2V7dcFfzBz3OPZn8AM3J__ _1LZdP7ackANSqIXYWhI-b1 gfcUZM2lrsYeWQPoFQxBj"
                >
                    <div className="_2Wf-SlnxpiKP9h4IkWZoDa">
                        <span className="_2EGWQBRVP2StSe2iTvRlDw">
                            <img src={props.src} className="_3vRw2O1Xs0IY3kcnmLCS7O" />
                        </span>
                        <span className="_2bF18d7VlTkz11DmN_PXUM">
                            <div className="_1pq0UtmsEXODMd3J-_HjDh">
                                <span className="_2bXdXf_GqdFQVMmOz0A8L8">{props.translate(props.title)}</span>
                                <span className="GFAL_CbltoeGbTj3MVtfx jL5Wj998paufBlWBixiUA _3l4uYr79jSRjggcw5QCp88">{props.size}</span>
                            </div>
                        </span>
                    </div>
                </a>
            </div>
        </li>
    );
}

export default SuggestedItem;