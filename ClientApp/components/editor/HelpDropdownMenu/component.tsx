import './index.scss';
import { ReactComponent as BellIcon } from './icons/bell.svg';
import { ReactComponent as MessengerIcon } from './icons/messenger.svg';
import { ReactComponent as CaretIcon } from './icons/caret.svg';
import { ReactComponent as PlusIcon } from './icons/plus.svg';
import { ReactComponent as CogIcon } from './icons/cog.svg';
import { ReactComponent as ChevronIcon } from './icons/chevron.svg';
import { ReactComponent as ArrowIcon } from './icons/arrow.svg';
import { ReactComponent as BoltIcon } from './icons/bolt.svg';

import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

function App() {
    return (
        <Navbar>
            <NavItem icon={<CaretIcon />}>
                <DropdownMenu></DropdownMenu>
            </NavItem>
        </Navbar>
    );
}

function Navbar(props) {
    return (
        <div className="navbar">
            <ul className="navbar-nav">{props.children}</ul>
        </div>
    );
}

function NavItem(props) {
    const [open, setOpen] = useState(false);

    return (
        <li className="nav-item">
            <button className="icon-button" onClick={(e) => {
                let currentTarget = e.currentTarget.parentNode;
                if (!open) {
                    const onClickOutside = (oe) => {
                        if (!oe.target.classList.contains("menu-item") && !currentTarget.contains(oe.target)) {
                            setOpen(false);
                            document.removeEventListener("click", onClickOutside);
                        }
                    }
                    document.addEventListener("click", onClickOutside);
                }
                setOpen(!open);
            }}>
                {window.translate("help")} <span style={{ marginLeft: "8px", width: "5px",}}>{open ? " X" : " ?"}</span>
            </button>

            {open && props.children}
        </li>
    );
}

function DropdownMenu() {
    const [activeMenu, setActiveMenu] = useState('main');
    const [menuHeight, setMenuHeight] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setMenuHeight(dropdownRef.current?.firstChild.offsetHeight + 20)
    }, [])

    function calcHeight(el) {
        const height = el.offsetHeight;
        setMenuHeight(height + 20);
    }

    function DropdownItem(props) {
        return (
            <a className="menu-item" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
                {/* <span className="icon-button">{props.leftIcon}</span> */}
                {props.children}
                {/* <span className="icon-right">{props.rightIcon}</span> */}
                <svg 
                  style={{
                    position: 'absolute',
                    right: '10px',
                  }}
                  xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M6.47 4.29l3.54 3.53c.1.1.1.26 0 .36L6.47 11.7a.75.75 0 1 0 1.06 1.06l3.54-3.53c.68-.69.68-1.8 0-2.48L7.53 3.23a.75.75 0 0 0-1.06 1.06z"></path></svg>
            </a>
        );
    }

    return (
        <div 
            className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>

            <CSSTransition
                in={activeMenu === 'main'}
                timeout={500}
                classNames="menu-primary"
                unmountOnExit
                onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem
                        goToMenu="settings">
                        Hướng dẫn về Draft
          </DropdownItem>
                    <DropdownItem>
                        Báo cáo sự cố
          </DropdownItem>

                </div>
            </CSSTransition>

            <CSSTransition
                in={activeMenu === 'animals2'}
                timeout={500}
                classNames="menu-primary"
                unmountOnExit
                onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem
                        goToMenu="settings">
                        Hướng dẫn về Draft cac
          </DropdownItem>
                    <DropdownItem>
                        Báo cáo sự cố
          </DropdownItem>

                </div>
            </CSSTransition>

            <CSSTransition
                in={activeMenu === 'tutorial'}
                timeout={500}
                classNames="menu-primary"
                unmountOnExit
                onEnter={calcHeight}>
                <div className="menu">
                    <div
                        style={{
                            padding: "0 15px",
                            overflowY: 'scroll',
                            maxHeight: '60vh',
                        }}
                    >
                        <h3 
                            style={{
                                margin: "5px 0 15px",
                                fontWeight: 700,
                            }}
                        >Hướng dẫn: Tạo thiết kế đầu tiên của bạn</h3>
                        <p>Chào mừng bạn đến với Draft! Để bắt đầu thiết kế:</p>

                        <ol className="dywODg fFOiLQ fP4ZCw">
                            <li className="zFmx4A fFOiLQ fP4ZCw">
                                Chọn một{" "}
                                <a className="ovm4pQ" href="#" draggable="false" role="button">
                                    mẫu
              </a>
              .
            </li>
                            <li className="zFmx4A fFOiLQ fP4ZCw">
                                <a className="ovm4pQ" href="#" draggable="false" role="button">
                                    Thêm ảnh
              </a>{" "}
              hoặc{" "}
                                <a className="ovm4pQ" href="#" draggable="false" role="button">
                                    tải ảnh của chính bạn lên
              </a>
              .
            </li>
                            <li className="zFmx4A fFOiLQ fP4ZCw">
                                <a className="ovm4pQ" href="#" draggable="false" role="button">
                                    Thay thế
              </a>{" "}
              văn bản hiện có hoặc{" "}
                                <a className="ovm4pQ" href="#" draggable="false" role="button">
                                    thêm
              </a>{" "}
              thông điệp của bạn.
            </li>
                            <li className="zFmx4A fFOiLQ fP4ZCw">
                                Tải xuống hoặc in thiết kế bằng cách nhấp vào{" "}
                                <a className="ovm4pQ" href="#" draggable="false" role="button">
                                    <b>Đăng</b>
                                </a>{" "}
              hoặc{" "}
                                <a className="ovm4pQ" href="#" draggable="false" role="button">
                                    <b>Tải xuống</b>
                                </a>
              .
            </li>
                        </ol>
                    </div>
                </div>
            </CSSTransition>

            <CSSTransition
                in={activeMenu === 'saveDesign'}
                timeout={500}
                classNames="menu-primary"
                unmountOnExit
                onEnter={calcHeight}>
                <div className="menu">
                    <div
                      className="menu-content"
                        style={{
                            padding: "0 15px",
                            overflowY: 'scroll',
                            maxHeight: '60vh',
                        }}
                    >
                        <h3 
                            style={{
                                margin: "5px 0 15px",
                                fontWeight: 700,
                            }}>Lưu thiết kế </h3>
                        <p>Draft tự động lưu các thiết kế khi bạn làm việc. Xem thanh menu phía trên cùng trong trình biên tập để biết trạng thái lưu thiết kế:</p>

                        <ul><li ><b>Đang lưu...</b> - Thiết kế đang trong quá trình lưu.</li>
                        <li><b>Đã lưu mọi thay đổi</b> - Nội dung sửa gần đây đối với thiết kế đã được lưu.</li>
                        <li><b>Thay đổi chưa được lưu</b> - Nội dung sửa gần đây đối với thiết kế chưa được lưu. Bạn có thể lưu thiết kế theo cách thủ công bằng cách nhấp vào <b>Tệp</b> và chọn <b>Lưu</b>. </li>
                        <li><b>Lỗi khi lưu</b> hoặc <b>Đã tạm dừng lưu </b>- Quá trình lưu bị gián đoạn do mất kết nối Internet. Hãy kiểm tra kết nối Internet để xem kết nối có nhanh và ổn định không.</li></ul>
                        <p>Bạn có thể tìm thấy tất cả thiết kế đã lưu trong tab<b> Tất cả thiết kế </b>của trang chủ Draft.</p>
                        <p><b>Mẹo:</b> Bạn có thể xem lại và khôi phục <a class="ovm4pQ" href="#" draggable="false" role="button">các phiên bản thiết kế trước đó</a> với đăng ký <b>Draft Pro</b> hoặc <b>Draft for Enterprise</b>. Tính năng này cũng áp dụng với trạng thái tài khoản <b>Draft cho Giáo dục</b> và <b>Draft cho tổ chức phi lợi nhuận</b>.</p>
                        <p>Nếu bạn muốn lưu thiết kế vào thiết bị của mình, nhấp vào <b>biểu tượng ⤓</b> ở góc trên cùng của trình biên tập để <a class="ovm4pQ" href="#" draggable="false" role="button">tải xuống thiết kế</a>, hoặc nhấp vào <b>Đăng</b> để xem các tùy chọn đăng có sẵn.</p>
                    </div>
                </div>
            </CSSTransition>

            <CSSTransition
                in={activeMenu === 'settings'}
                timeout={500}
                classNames="menu-secondary"
                unmountOnExit
                onEnter={calcHeight}>
                <div className="menu">
                    {/* <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
            <h2>My Tutorial</h2>
          </DropdownItem> */}
                    <DropdownItem goToMenu="tutorial">Hướng dẫn tạo thiết kế đầu tiên của bạn</DropdownItem>
                    <DropdownItem goToMenu="saveDesign">Lưu thiết kế</DropdownItem>
                    <DropdownItem>Tải thiết kế xuống</DropdownItem>
                </div>
            </CSSTransition>

            <CSSTransition
                in={activeMenu === 'animals'}
                timeout={500}
                classNames="menu-secondary"
                unmountOnExit
                onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
                        <h2>Animals</h2>
                    </DropdownItem>
                    <DropdownItem leftIcon="🦘">Kangaroo</DropdownItem>
                    <DropdownItem leftIcon="🐸">Frog</DropdownItem>
                    <DropdownItem leftIcon="🦋">Horse?</DropdownItem>
                    <DropdownItem leftIcon="🦔">Hedgehog</DropdownItem>
                </div>
            </CSSTransition>

        </div>
    );
}

export default App;
