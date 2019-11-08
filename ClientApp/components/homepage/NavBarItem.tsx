import React from 'react';

interface IProps {
    translate: any;
    title: string;
}

const NavBarItem = (props: IProps) => {
    return (
        <li
            style={{
                height: '100%',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px 0px',
                transition: 'all 0.3s ease-in',
                cursor: 'pointer',
                marginRight: '20px',
            }}
        >
            <button 
                className="button-list"
                style={{
                    borderRadius: '4px',
                    border: 'none',
                    fontFamily: 'AvenirNextRoundedPro-Medium',
                    background: 'none',
                }}
            >
                {props.translate(props.title)}
            </button>
        </li>
    );
}

export default NavBarItem;