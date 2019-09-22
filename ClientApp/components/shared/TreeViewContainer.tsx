import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import styled from 'styled-components';

import AppComponent from "@Components/shared/AppComponent";
import TreeView from '@Components/shared/TreeView';
import Loader from '@Components/shared/Loader';
import InfiniteScroll from '@Components/shared/InfiniteScroll';
import { uuid } from 'htmltoimage/utils';
import uuidv4 from "uuid/v4";

export interface IProps {
    filePath: string;
}

export interface IState {
    templates: any;
    templates2: any;
    height: number;
    height2: number;
    isLoading: boolean;
    hasMoreImage: boolean;
}

var tree = [
    {
        title: "Tờ gấp",
        path: "/templates/brochures",
        childs: [
            {
                title: "Nông nghiệp",
                path: "/templates/brochures/agriculture",
            },
            {
                title: "Ôtô & Vận tải",
                path: "/templates/brochures/automotive-transportation",
            },
            {
                title: "Sắc đẹp (beauty)",
                path: "/templates/brochures/beauty",
            },
            {
                title: "Dịch vụ kinh doanh",
                path: "/templates/brochures/business-services",
            },
            {
                title: "Chăm sóc trẻ em",
                path: "/templates/brochures/child-care",
            },
            {
                title: "Vệ sinh",
                path: "/templates/brochures/cleaning",
            },
            {
                title: "Xây dựng",
                path: "/templates/brochures/construction",
            },
            {
                title: "Sáng tạo",
                path: "/templates/brochures/creative",
            },
            {
                title: "Giáo dục & Đào tạo",
                path: "/templates/brochures/education-training",
            },
            {
                title: "Năng lượng & Môi trường",
                path: "/templates/brochures/energy-environment",
            },
            {
                title: "Sự kiện",
                path: "/templates/brochures/event",
            },
            {
                title: "Dịch vụ tài chính",
                path: "/templates/brochures/financial-services",
            },
            {
                title: "Thực phẩm",
                path: "/templates/brochures/food-beverage",
            },
            // {
            //     title: "Generic Brochures",
            //     path: "/templates/brochures/generic-brochures",
            // },
            {
                title: "Ngày lễ",
                path: "/templates/brochures/holiday",
            },
            {
                title: "Nhà cửa",
                path: "/templates/brochures/house-home",
            },
            {
                title: "Bảo hiểm",
                path: "/templates/brochures/insurance",
            },
            {
                title: "Luật",
                path: "/templates/brochures/law",
            },
            {
                title: "Làm vườn",
                path: "/templates/brochures/law-garden",
            },
            {
                title: "Thuốc & Chăm sóc sức khỏe",
                path: "/templates/brochures/medical-healthcare",
            },
            {
                title: "Âm nhạc & Nghệ thuật",
                path: "/templates/brochures/music-arts",
            },
            {
                title: "Không lợi nhuận",
                path: "/templates/brochures/non-profit",
            },
            {
                title: "Thú nuôi",
                path: "/templates/brochures/pets-animals",
            },
            {
                title: "Nhiếp ảnh",
                path: "/templates/brochures/photography",
            },
            {
                title: "Bất động sản",
                path: "/templates/brochures/real-estate",
            },
            {
                title: "Tổ chức & Tôn giáo",
                path: "/templates/brochures/religion-organization",
            },
            {
                title: "Bán lẻ",
                path: "/templates/brochures/retail",
            },
            {
                title: "Thể thao & Sức khỏe",
                path: "/templates/brochures/sports-wellness",
            },
            {
                title: "Công nghệ",
                path: "/templates/brochures/technology",
            },
            {
                title: "Du lịch",
                path: "/templates/brochures/travel-tourism",
            },
        ],
    },
    {
        title: "Danh thiếp",
        path: "/templates/business-cards",
        childs: [
            {
                title: "Nông nghiệp",
                path: "/templates/business-cards/agriculture",
            },
            {
                title: "Ôtô & Vận tải",
                path: "/templates/business-cards/automotive-transportation",
            },
            {
                title: "Sắc đẹp (beauty)",
                path: "/templates/business-cards/beauty",
            },
            {
                title: "Dịch vụ kinh doanh",
                path: "/templates/business-cards/business-services",
            },
            {
                title: "Chăm sóc trẻ em",
                path: "/templates/business-cards/child-care",
            },
            {
                title: "Vệ sinh",
                path: "/templates/business-cards/cleaning",
            },
            {
                title: "Xây dựng",
                path: "/templates/business-cards/construction",
            },
            {
                title: "Sáng tạo",
                path: "/templates/business-cards/creative",
            },
            {
                title: "Giáo dục & Đào tạo",
                path: "/templates/business-cards/education-training",
            },
            {
                title: "Năng lượng & Môi trường",
                path: "/templates/business-cards/energy-environment",
            },
            {
                title: "Sự kiện",
                path: "/templates/business-cards/event",
            },
            {
                title: "Dịch vụ tài chính",
                path: "/templates/business-cards/financial-services",
            },
            {
                title: "Thực phẩm",
                path: "/templates/business-cards/food-beverage",
            },
            // {
            //     title: "Generic Brochures",
            //     path: "/templates/business-cards/generic-brochures",
            // },
            {
                title: "Ngày lễ",
                path: "/templates/business-cards/holiday",
            },
            {
                title: "Nhà cửa",
                path: "/templates/business-cards/house-home",
            },
            {
                title: "Bảo hiểm",
                path: "/templates/business-cards/insurance",
            },
            {
                title: "Luật",
                path: "/templates/business-cards/law",
            },
            {
                title: "Làm vườn",
                path: "/templates/business-cards/law-garden",
            },
            {
                title: "Thuốc & Chăm sóc sức khỏe",
                path: "/templates/business-cards/medical-healthcare",
            },
            {
                title: "Âm nhạc & Nghệ thuật",
                path: "/templates/business-cards/music-arts",
            },
            {
                title: "Không lợi nhuận",
                path: "/templates/business-cards/non-profit",
            },
            {
                title: "Thú nuôi",
                path: "/templates/business-cards/pets-animals",
            },
            {
                title: "Nhiếp ảnh",
                path: "/templates/business-cards/photography",
            },
            {
                title: "Bất động sản",
                path: "/templates/business-cards/real-estate",
            },
            {
                title: "Tổ chức & Tôn giáo",
                path: "/templates/business-cards/religion-organization",
            },
            {
                title: "Bán lẻ",
                path: "/templates/business-cards/retail",
            },
            {
                title: "Thể thao & Sức khỏe",
                path: "/templates/business-cards/sports-wellness",
            },
            {
                title: "Công nghệ",
                path: "/templates/business-cards/technology",
            },
            {
                title: "Du lịch",
                path: "/templates/business-cards/travel-tourism",
            },
        ],
    },
    {
        title: "Áp phích",
        path: '/templates/poster',
        childs: [
            {
                title: "Nông nghiệp",
                path: "/templates/poster/agriculture",
            },
            {
                title: "Ôtô & Vận tải",
                path: "/templates/poster/automotive-transportation",
            },
            {
                title: "Sắc đẹp (beauty)",
                path: "/templates/poster/beauty",
            },
            {
                title: "Dịch vụ kinh doanh",
                path: "/templates/poster/business-services",
            },
            {
                title: "Chăm sóc trẻ em",
                path: "/templates/poster/child-care",
            },
            {
                title: "Vệ sinh",
                path: "/templates/poster/cleaning",
            },
            {
                title: "Xây dựng",
                path: "/templates/poster/construction",
            },
            {
                title: "Sáng tạo",
                path: "/templates/poster/creative",
            },
            {
                title: "Giáo dục & Đào tạo",
                path: "/templates/poster/education-training",
            },
            {
                title: "Năng lượng & Môi trường",
                path: "/templates/poster/energy-environment",
            },
            {
                title: "Sự kiện",
                path: "/templates/poster/event",
            },
            {
                title: "Dịch vụ tài chính",
                path: "/templates/poster/financial-services",
            },
            {
                title: "Thực phẩm",
                path: "/templates/poster/food-beverage",
            },
            // {
            //     title: "Generic Brochures",
            //     path: "/templates/poster/generic-brochures",
            // },
            {
                title: "Ngày lễ",
                path: "/templates/poster/holiday",
            },
            {
                title: "Nhà cửa",
                path: "/templates/poster/house-home",
            },
            {
                title: "Bảo hiểm",
                path: "/templates/poster/insurance",
            },
            {
                title: "Luật",
                path: "/templates/poster/law",
            },
            {
                title: "Làm vườn",
                path: "/templates/poster/law-garden",
            },
            {
                title: "Thuốc & Chăm sóc sức khỏe",
                path: "/templates/poster/medical-healthcare",
            },
            {
                title: "Âm nhạc & Nghệ thuật",
                path: "/templates/poster/music-arts",
            },
            {
                title: "Không lợi nhuận",
                path: "/templates/poster/non-profit",
            },
            {
                title: "Thú nuôi",
                path: "/templates/poster/pets-animals",
            },
            {
                title: "Nhiếp ảnh",
                path: "/templates/poster/photography",
            },
            {
                title: "Bất động sản",
                path: "/templates/poster/real-estate",
            },
            {
                title: "Tổ chức & Tôn giáo",
                path: "/templates/poster/religion-organization",
            },
            {
                title: "Bán lẻ",
                path: "/templates/poster/retail",
            },
            {
                title: "Thể thao & Sức khỏe",
                path: "/templates/poster/sports-wellness",
            },
            {
                title: "Công nghệ",
                path: "/templates/poster/technology",
            },
            {
                title: "Du lịch",
                path: "/templates/poster/travel-tourism",
            },
        ],
    },
    {
        title: "Tờ rơi",
        path: '/templates/flyers',
        childs: [
            {
                title: "Nông nghiệp",
                path: "/templates/flyers/agriculture",
            },
            {
                title: "Ôtô & Vận tải",
                path: "/templates/flyers/automotive-transportation",
            },
            {
                title: "Sắc đẹp (beauty)",
                path: "/templates/flyers/beauty",
            },
            {
                title: "Dịch vụ kinh doanh",
                path: "/templates/flyers/business-services",
            },
            {
                title: "Chăm sóc trẻ em",
                path: "/templates/flyers/child-care",
            },
            {
                title: "Vệ sinh",
                path: "/templates/flyers/cleaning",
            },
            {
                title: "Xây dựng",
                path: "/templates/flyers/construction",
            },
            {
                title: "Sáng tạo",
                path: "/templates/flyers/creative",
            },
            {
                title: "Giáo dục & Đào tạo",
                path: "/templates/flyers/education-training",
            },
            {
                title: "Năng lượng & Môi trường",
                path: "/templates/flyers/energy-environment",
            },
            {
                title: "Sự kiện",
                path: "/templates/flyers/event",
            },
            {
                title: "Dịch vụ tài chính",
                path: "/templates/flyers/financial-services",
            },
            {
                title: "Thực phẩm",
                path: "/templates/flyers/food-beverage",
            },
            // {
            //     title: "Generic Brochures",
            //     path: "/templates/flyers/generic-brochures",
            // },
            {
                title: "Ngày lễ",
                path: "/templates/flyers/holiday",
            },
            {
                title: "Nhà cửa",
                path: "/templates/flyers/house-home",
            },
            {
                title: "Bảo hiểm",
                path: "/templates/flyers/insurance",
            },
            {
                title: "Luật",
                path: "/templates/flyers/law",
            },
            {
                title: "Làm vườn",
                path: "/templates/flyers/law-garden",
            },
            {
                title: "Thuốc & Chăm sóc sức khỏe",
                path: "/templates/flyers/medical-healthcare",
            },
            {
                title: "Âm nhạc & Nghệ thuật",
                path: "/templates/flyers/music-arts",
            },
            {
                title: "Không lợi nhuận",
                path: "/templates/flyers/non-profit",
            },
            {
                title: "Thú nuôi",
                path: "/templates/flyers/pets-animals",
            },
            {
                title: "Nhiếp ảnh",
                path: "/templates/flyers/photography",
            },
            {
                title: "Bất động sản",
                path: "/templates/flyers/real-estate",
            },
            {
                title: "Tổ chức & Tôn giáo",
                path: "/templates/flyers/religion-organization",
            },
            {
                title: "Bán lẻ",
                path: "/templates/flyers/retail",
            },
            {
                title: "Thể thao & Sức khỏe",
                path: "/templates/flyers/sports-wellness",
            },
            {
                title: "Công nghệ",
                path: "/templates/flyers/technology",
            },
            {
                title: "Du lịch",
                path: "/templates/flyers/travel-tourism",
            },
        ],
    },
    {
        title: "Logo",
        path: '/templates/logo',
        childs: [
            {
                title: "Nông nghiệp",
                path: "/templates/logo/agriculture",
            },
            {
                title: "Ôtô & Vận tải",
                path: "/templates/logo/automotive-transportation",
            },
            {
                title: "Sắc đẹp (beauty)",
                path: "/templates/logo/beauty",
            },
            {
                title: "Dịch vụ kinh doanh",
                path: "/templates/logo/business-services",
            },
            {
                title: "Chăm sóc trẻ em",
                path: "/templates/logo/child-care",
            },
            {
                title: "Vệ sinh",
                path: "/templates/logo/cleaning",
            },
            {
                title: "Xây dựng",
                path: "/templates/logo/construction",
            },
            {
                title: "Sáng tạo",
                path: "/templates/logo/creative",
            },
            {
                title: "Giáo dục & Đào tạo",
                path: "/templates/logo/education-training",
            },
            {
                title: "Năng lượng & Môi trường",
                path: "/templates/logo/energy-environment",
            },
            {
                title: "Sự kiện",
                path: "/templates/logo/event",
            },
            {
                title: "Dịch vụ tài chính",
                path: "/templates/logo/financial-services",
            },
            {
                title: "Thực phẩm",
                path: "/templates/logo/food-beverage",
            },
            // {
            //     title: "Generic Brochures",
            //     path: "/templates/logo/generic-brochures",
            // },
            {
                title: "Ngày lễ",
                path: "/templates/logo/holiday",
            },
            {
                title: "Nhà cửa",
                path: "/templates/logo/house-home",
            },
            {
                title: "Bảo hiểm",
                path: "/templates/logo/insurance",
            },
            {
                title: "Luật",
                path: "/templates/logo/law",
            },
            {
                title: "Làm vườn",
                path: "/templates/logo/law-garden",
            },
            {
                title: "Thuốc & Chăm sóc sức khỏe",
                path: "/templates/logo/medical-healthcare",
            },
            {
                title: "Âm nhạc & Nghệ thuật",
                path: "/templates/logo/music-arts",
            },
            {
                title: "Không lợi nhuận",
                path: "/templates/logo/non-profit",
            },
            {
                title: "Thú nuôi",
                path: "/templates/logo/pets-animals",
            },
            {
                title: "Nhiếp ảnh",
                path: "/templates/logo/photography",
            },
            {
                title: "Bất động sản",
                path: "/templates/logo/real-estate",
            },
            {
                title: "Tổ chức & Tôn giáo",
                path: "/templates/logo/religion-organization",
            },
            {
                title: "Bán lẻ",
                path: "/templates/logo/retail",
            },
            {
                title: "Thể thao & Sức khỏe",
                path: "/templates/logo/sports-wellness",
            },
            {
                title: "Công nghệ",
                path: "/templates/logo/technology",
            },
            {
                title: "Du lịch",
                path: "/templates/logo/travel-tourism",
            },
        ],
    },
    {
        title: "Bưu thiếp",
        path: '/templates/postcards',
        childs: [
            {
                title: "Nông nghiệp",
                path: "/templates/postcards/agriculture",
            },
            {
                title: "Ôtô & Vận tải",
                path: "/templates/postcards/automotive-transportation",
            },
            {
                title: "Sắc đẹp (beauty)",
                path: "/templates/postcards/beauty",
            },
            {
                title: "Dịch vụ kinh doanh",
                path: "/templates/postcards/business-services",
            },
            {
                title: "Chăm sóc trẻ em",
                path: "/templates/postcards/child-care",
            },
            {
                title: "Vệ sinh",
                path: "/templates/postcards/cleaning",
            },
            {
                title: "Xây dựng",
                path: "/templates/postcards/construction",
            },
            {
                title: "Sáng tạo",
                path: "/templates/postcards/creative",
            },
            {
                title: "Giáo dục & Đào tạo",
                path: "/templates/postcards/education-training",
            },
            {
                title: "Năng lượng & Môi trường",
                path: "/templates/postcards/energy-environment",
            },
            {
                title: "Sự kiện",
                path: "/templates/postcards/event",
            },
            {
                title: "Dịch vụ tài chính",
                path: "/templates/postcards/financial-services",
            },
            {
                title: "Thực phẩm",
                path: "/templates/postcards/food-beverage",
            },
            // {
            //     title: "Generic Brochures",
            //     path: "/templates/postcards/generic-brochures",
            // },
            {
                title: "Ngày lễ",
                path: "/templates/postcards/holiday",
            },
            {
                title: "Nhà cửa",
                path: "/templates/postcards/house-home",
            },
            {
                title: "Bảo hiểm",
                path: "/templates/postcards/insurance",
            },
            {
                title: "Luật",
                path: "/templates/postcards/law",
            },
            {
                title: "Làm vườn",
                path: "/templates/postcards/law-garden",
            },
            {
                title: "Thuốc & Chăm sóc sức khỏe",
                path: "/templates/postcards/medical-healthcare",
            },
            {
                title: "Âm nhạc & Nghệ thuật",
                path: "/templates/postcards/music-arts",
            },
            {
                title: "Không lợi nhuận",
                path: "/templates/postcards/non-profit",
            },
            {
                title: "Thú nuôi",
                path: "/templates/postcards/pets-animals",
            },
            {
                title: "Nhiếp ảnh",
                path: "/templates/postcards/photography",
            },
            {
                title: "Bất động sản",
                path: "/templates/postcards/real-estate",
            },
            {
                title: "Tổ chức & Tôn giáo",
                path: "/templates/postcards/religion-organization",
            },
            {
                title: "Bán lẻ",
                path: "/templates/postcards/retail",
            },
            {
                title: "Thể thao & Sức khỏe",
                path: "/templates/postcards/sports-wellness",
            },
            {
                title: "Công nghệ",
                path: "/templates/postcards/technology",
            },
            {
                title: "Du lịch",
                path: "/templates/postcards/travel-tourism",
            },
        ],
    },
    {
        title: "Sơ yếu lý lịch",
        path: '/templates/resume',
        childs: [
            {
                title: "Nông nghiệp",
                path: "/templates/resume/agriculture",
            },
            {
                title: "Ôtô & Vận tải",
                path: "/templates/resume/automotive-transportation",
            },
            {
                title: "Sắc đẹp (beauty)",
                path: "/templates/resume/beauty",
            },
            {
                title: "Dịch vụ kinh doanh",
                path: "/templates/resume/business-services",
            },
            {
                title: "Chăm sóc trẻ em",
                path: "/templates/resume/child-care",
            },
            {
                title: "Vệ sinh",
                path: "/templates/resume/cleaning",
            },
            {
                title: "Xây dựng",
                path: "/templates/resume/construction",
            },
            {
                title: "Sáng tạo",
                path: "/templates/resume/creative",
            },
            {
                title: "Giáo dục & Đào tạo",
                path: "/templates/resume/education-training",
            },
            {
                title: "Năng lượng & Môi trường",
                path: "/templates/resume/energy-environment",
            },
            {
                title: "Sự kiện",
                path: "/templates/resume/event",
            },
            {
                title: "Dịch vụ tài chính",
                path: "/templates/resume/financial-services",
            },
            {
                title: "Thực phẩm",
                path: "/templates/resume/food-beverage",
            },
            // {
            //     title: "Generic Brochures",
            //     path: "/templates/resume/generic-brochures",
            // },
            {
                title: "Ngày lễ",
                path: "/templates/resume/holiday",
            },
            {
                title: "Nhà cửa",
                path: "/templates/resume/house-home",
            },
            {
                title: "Bảo hiểm",
                path: "/templates/resume/insurance",
            },
            {
                title: "Luật",
                path: "/templates/resume/law",
            },
            {
                title: "Làm vườn",
                path: "/templates/resume/law-garden",
            },
            {
                title: "Thuốc & Chăm sóc sức khỏe",
                path: "/templates/resume/medical-healthcare",
            },
            {
                title: "Âm nhạc & Nghệ thuật",
                path: "/templates/resume/music-arts",
            },
            {
                title: "Không lợi nhuận",
                path: "/templates/resume/non-profit",
            },
            {
                title: "Thú nuôi",
                path: "/templates/resume/pets-animals",
            },
            {
                title: "Nhiếp ảnh",
                path: "/templates/resume/photography",
            },
            {
                title: "Bất động sản",
                path: "/templates/resume/real-estate",
            },
            {
                title: "Tổ chức & Tôn giáo",
                path: "/templates/resume/religion-organization",
            },
            {
                title: "Bán lẻ",
                path: "/templates/resume/retail",
            },
            {
                title: "Thể thao & Sức khỏe",
                path: "/templates/resume/sports-wellness",
            },
            {
                title: "Công nghệ",
                path: "/templates/resume/technology",
            },
            {
                title: "Du lịch",
                path: "/templates/resume/travel-tourism",
            },
        ],
    },
]


class TreeViewContainer extends AppComponent<IProps, IState> {
  
  constructor(props) {
    super(props);

    this.state = {
        templates : [],
        templates2: [],
        height: 0,
        height2: 0,
        isLoading: false,
        hasMoreImage: true,
    };
  }

  componentDidMount() {
      this.loadMore(true, this.props.filePath);
  }

    componentWillReceiveProps(nextProps) {
        if (this.props.filePath !== nextProps.filePath) {
            this.setState({templates: [], templates2: [], height: 0, height2: 0,}, () => {
                this.loadMore(true, nextProps.filePath);
            })
        }
    }

//   loadTemplate = (filePath : string) => {
//     var self = this;
//     const url = `/api/Template/SearchAngAggregate?type=1&filePath=${filePath ? filePath : this.props.filePath}`;
//     self.setState({isLoading: true,})
//     axios.get(url).
//       then(res => {
//           console.log('res ', res);
//           self.setState({templates: res.data.value.documents, isLoading: false,})
//       })
//   }

  loadMore = (initialLoad, filePath) => {
    let pageId;
    let count;
    if (initialLoad) {
      pageId = 1;
      count = 10;
    } else {
      pageId = (this.state.templates.length + this.state.templates2.length) / 5 + 1;
      count = 5;
    }

    var self = this;
    const url = `/api/Template/SearchAngAggregate?type=1&perPage=${count}&page=${pageId}&filePath=${filePath ? filePath : this.props.filePath}`;
    self.setState({isLoading: true,})
    axios.get(url).
      then(res => {
          console.log('res ', res);
            var currentHeight = this.state.height;
            var currentHeight2 = this.state.height2;
            var result = res.data.value.documents;
            var templates = this.state.templates;
            var templates2 = this.state.templates2;
            var res1 = [];
            var res2 = [];
            for (var i = 0; i < result.length; ++i) {
                var currentItem = result[i];
                if (currentHeight <= currentHeight2) {
                    res1.push(currentItem);
                    currentHeight += 150 / (currentItem.width / currentItem.height);
                } else {
                    res2.push(currentItem);
                    currentHeight2 += 150 / (currentItem.width / currentItem.height);
                }
            }
            
          self.setState({
              templates: [...templates, ...res1],
              templates2: [...templates2, ...res2],
              height: currentHeight,
              height2: currentHeight2,
              isLoading: false,
              hasMoreImage: templates.length + templates2.length + res.data.value.documents.length < res.data.value.count,
            })
      })
  }

  render() {

    return (
        <div
            style={{display: 'flex'}}
        >
            <div
            style={{
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                margin: '10px',
                border: '1px solid #e7eaf3',
                borderRadius: '.3125rem',
                width: '350px',
                minHeight: '600px',
                minWidth: '200px',
            }} 
            >
                {tree.map(ele => 
                <TreeView key={uuidv4()} path={ele.path} childs={ele.childs} collapsed={this.props.filePath.indexOf(ele.path) === -1} defaultCollapsed={true} nodeLabel={ele.title} className="asd" itemClassName="asd" childrenClassName="asd" treeViewClassName="ads" onClick={null}>
                </TreeView>
                )}
            </div>
            <div
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                margin: '10px',
                width: '100%',
                border: '1px solid #e7eaf3',
                borderRadius: '.3125rem',
                padding: '20px',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                paddingBottom: '50px',
                // display: 'flex',
            }} 
            >
            <InfiniteScroll
                scroll={false}
                    throttle={500}
                    threshold={300}
                    isLoading={this.state.isLoading}
                    hasMore={this.state.hasMoreImage}
                    onLoadMore={this.loadMore.bind(this, false, this.props.filePath)}
                    height='100%'
                    loaderBlack={true}
                  >
                    <div id="image-container-picker" style={{justifyContent: 'space-around', display: 'flex', padding: '0px 5px 10px 0px',}}>
                    <div
                      style={{
                        height: "calc(100% - 170px)",
                        width: '350px',
                        marginRight: '10px',
                      }}
                    >
                      {this.state.templates.map(template => <ImgContainer key={uuidv4()} href={`/editor/design/${template.id}`} style={{marginRight: '20px', marginBottom: '20px', textDecoration: 'none', display: 'inline-block',}}>
                <img
                    style={{
                        width: '350px',
                        borderRadius: '5px',
                        boxShadow: 'rgba(0, 0, 0, 0.26) 0px 1px 3px, rgba(0, 0, 0, 0) 0px 1px 2px',
                    }} 
                    src={template.representative2} />
                <p style={{margin: 0, padding: '5px', color: 'black', fontWeight: 700,}}>{template.firstName}</p>
                      </ImgContainer>)}
                    </div>
                    <div
                      style={{
                        height: "calc(100% - 170px)",
                        width: '350px',
                      }}
                    >
                      {this.state.templates2.map(template => <ImgContainer key={uuidv4()} href={`/editor/design/${template.id}`} style={{marginRight: '20px', marginBottom: '20px', textDecoration: 'none', display: 'inline-block',}}>
                <img
                    style={{
                        width: '350px',
                        borderRadius: '5px',
                        boxShadow: 'rgba(0, 0, 0, 0.26) 0px 1px 3px, rgba(0, 0, 0, 0) 0px 1px 2px',
                    }} 
                    src={template.representative2} />
                <p style={{margin: 0, padding: '5px', color: 'black', fontWeight: 700,}}>{template.firstName}</p>
                      </ImgContainer>)}
                      </div>
                    </div>
                  </InfiniteScroll>
            {/* {this.state.isLoading ? 
            <div style={{position: 'relative', width: '100%', height: '50px',}}>
                <Loader show={true} black={true}/>
            </div>
            :
            this.state.templates.map(template => <ImgContainer href={`/editor/design/${template.id}`} style={{marginRight: '20px', marginBottom: '20px', textDecoration: 'none', display: 'inline-block',}}>
                <img
                    style={{
                        width: '350px',
                        borderRadius: '5px',
                    }} 
                    src={template.representative2} />
                <p style={{margin: 0, padding: '5px', color: 'black', fontWeight: 700,}}>{template.firstName}</p>
            </ImgContainer>)} */}
            </div>
    </div>
    );
  }
}

export default TreeViewContainer;

var ImgContainer = styled.a`
    :hover {
        filter: brightness(0.95);
    }
`;