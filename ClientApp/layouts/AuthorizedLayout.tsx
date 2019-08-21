import TopMenu from "@Components/shared/TopMenu";
import * as React from "react";
import "@Styles/authorizedLayout.scss";
import { ToastContainer } from "react-toastify";
import Footer from "@Components/shared/Footer";
import { Route, Link } from "react-router-dom";

interface IProps {
    children?: React.ReactNode;
}

type Props = IProps;


const Breadcrumbs = () => <Route path="*" render={props => {
    let parts = props.location.pathname.split("/");
    console.log('props.location.pathname ', props.location.pathname)
    // parts = ['home', ...parts.splice(1, parts.length-1)];
    console.log('parts', parts)
    const place = parts[parts.length-1];
    parts = parts.slice(1, parts.length-1);
    if (!place) {
        return null;
    }
    console.log('place ', place)
    // parts = ["home", ...parts];
    return <div style={{padding: '10px',}}>
        {crumb('Home', 0, ['Home', ...parts])}
        {parts.map(crumb)}
        <span style={{marginLeft: '8px', fontSize: '11px',}}>{mapping[place]}</span>
    </div>}} />

    const mapping = {
        'Home' : 'Trang chủ',
        'templates': 'Mẫu thiết kế',
        'brochures': 'Tờ gấp',
        'business-cards': 'Danh thiếp',
        'flyers': 'Tờ rơi',
        'postcards': 'Bưu thiếp',
        'agriculture': 'Nông nghiệp',
        'automotive-transportation': 'Ôtô & Vận tải',
        'beauty': 'Sắc đẹp',
        'business-services': 'Dịch vụ kinh doanh',
        'child-care': 'Chăm sóc trẻ em',
        'cleaning': 'Vệ sinh',
        'construction': 'Xây dựng',
        'creative': 'Sáng tạo',
        'education-training': 'Giáo dục & đào tạo',
        'energy-environment': 'Năng lượng môi trường',
        'event': 'Sự kiện',
        'financial-services': 'Dịch vụ tài chính',
        'food-beverage': 'Thực phẩm',
        'holiday': 'Ngày lễ',
        'house-home': 'Nhà cửa',
        'insurance': 'Bảo hiểm',
        'law': 'Luật',
        'law-garden': 'Làm vườn',
        'medical-healthcare': 'Thuốc & chăm sóc sức khoẻ',
        'music-arts': 'Âm nhạc & Nghệ thuật',
        'non-profit': 'Không lợi nhuận',
        'pets-animals': 'Thú nuôi',
        'photography': 'Nhiếp ảnh',
        'real-estate': 'Bất động sản',
        'religion-organization': 'Tổ chức & tôn giáo',
        'retail': 'Bán lẻ',
        'sports-wellness': 'Thẻ thảo & Sức khoẻ',
        'technology': 'Công nghệ',
        'travel-tourism': 'Du lịch',
        'cart': 'Giỏ hàng',
    }
  
  const crumb = (part, partIndex, parts) => {
        console.log('part ', part);
        const path = ['', ...parts.slice(0, partIndex+1)].join("/");
        return <Link style={{
            color: 'black',
            textDecoration: 'none',
            position: "relative",
            padding: '3px 10px',
            backgroundColor: '#e9ecef',
            borderTopRightRadius: '0.5rem',
            borderBottomRightRadius: '0.5rem',
            marginLeft: '-2px',
            fontSize: '11px',
            zIndex: parts.length - partIndex,
        }} key={path} to={path} >{mapping[part]}<span className="breadcrumbs__separator"></span></Link>}
  

export default class AuthorizedLayout extends React.Component<Props, {}> {
    public render() {

        return <div id="authorizedLayout" className="layout">
            <TopMenu />
            <div className="container container-content">
            <Breadcrumbs />
            </div>
            <div
                style={{
                    backgroundImage: 'url(images/Kwb3ggnPi0Wzp6nRw3ov7Q.png)',
                    backgroundSize: 'cover',
                }}
                id='content-container'>
                    {this.props.children}
            </div>
            <ToastContainer />
            <Footer />
        </div>;
    }
}