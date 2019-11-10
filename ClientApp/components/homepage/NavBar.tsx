import React from 'react';
import loadable from '@loadable/component';
import uuidv4 from "uuid/v4";
import { NAVBAR_LIST } from "@Constants";

const NavBarItem = loadable(() => import("@Components/homepage/NavBarItem"));

interface IProps {
    translate: any;
}

const NavBar = (props: IProps) => {
    const navbarList = NAVBAR_LIST.map( item =>
        <NavBarItem
            key={uuidv4()}
            translate={props.translate}
            {...item}
        />
    );
    return (
        <div id="hello-world" style={{ background: '#f4f4f6' }}>
            <div style={{ padding: 0 }} className="container">
                <nav>
                    <ul 
                        style={{
                            listStyle: 'none',
                            display: 'flex',
                            margin: 0,
                            padding: 0,
                            borderBottom: '1px solid #e0e2e7',
                        }}
                    >
                        {navbarList}
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default NavBar;