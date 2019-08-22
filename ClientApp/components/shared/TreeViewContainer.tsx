import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import styled from 'styled-components';

import AppComponent from "@Components/shared/AppComponent";
import TreeView from '@Components/shared/TreeView';
import Loader from '@Components/shared/Loader';
import InfiniteScroll from '@Components/shared/InfiniteScroll';

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
                title: "Blank Brochures",
                path: "/templates/brochures/bland-brochures",
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
                title: "Agriculture",
                path: "/templates/business-cards/agriculture",
            },
            {
                title: "Automotive & Transportation",
                path: "/templates/business-cards/automotive-transportation",
            },
            {
                title: "Beauty",
                path: "/templates/business-cards/beauty",
            },
            {
                title: "Blank Brochures",
                path: "/templates/business-cards/bland-brochures",
            },
            {
                title: "Business Services",
                path: "/templates/business-cards/business-services",
            },
            {
                title: "Child Care",
                path: "/templates/business-cards/child-care",
            },
            {
                title: "Cleaning",
                path: "/templates/business-cards/cleaning",
            },
            {
                title: "Construction",
                path: "/templates/business-cards/construction",
            },
            {
                title: "Creative",
                path: "/templates/business-cards/creative",
            },
            {
                title: "Education & Training",
                path: "/templates/business-cards/education-training",
            },
            {
                title: "Energy & Environment",
                path: "/templates/business-cards/energy-environment",
            },
            {
                title: "Event",
                path: "/templates/business-cards/event",
            },
            {
                title: "Financial Services",
                path: "/templates/business-cards/financial-services",
            },
            {
                title: "Food & Beverage",
                path: "/templates/business-cards/food-beverage",
            },
            {
                title: "Generic Brochures",
                path: "/templates/business-cards/generic-brochures",
            },
            {
                title: "Holiday",
                path: "/templates/business-cards/holiday",
            },
            {
                title: "House & Home",
                path: "/templates/business-cards/house-home",
            },
            {
                title: "Insurance",
                path: "/templates/business-cards/insurance",
            },
            {
                title: "Law",
                path: "/templates/business-cards/law",
            },
            {
                title: "Lawn & Garden",
                path: "/templates/business-cards/law-garden",
            },
            {
                title: "Medical & Health Care",
                path: "/templates/business-cards/medical-healthcare",
            },
            {
                title: "Music & Arts",
                path: "/templates/business-cards/music-arts",
            },
            {
                title: "Non Profit",
                path: "/templates/business-cards/non-profit",
            },
            {
                title: "Pets & Animals",
                path: "/templates/business-cards/pets-animals",
            },
            {
                title: "Photography",
                path: "/templates/business-cards/photography",
            },
            {
                title: "Real Estate",
                path: "/templates/business-cards/real-estate",
            },
            {
                title: "Religion & Organizations",
                path: "/templates/business-cards/religion-organization",
            },
            {
                title: "Retail",
                path: "/templates/business-cards/retail",
            },
            {
                title: "Sports & Wellness",
                path: "/templates/business-cards/sports-wellness",
            },
            {
                title: "Technology",
                path: "/templates/business-cards/technology",
            },
            {
                title: "Travel & Tourism",
                path: "/templates/business-cards/travel-tourism",
            },
        ],
    },
    {
        title: "Áp phích",
        path: '/templates/envelopes',
        childs: [
            {
                title: "Agriculture",
                path: "/templates/envelopes/agriculture",
            },
            {
                title: "Automotive & Transportation",
                path: "/templates/envelopes/automotive-transportation",
            },
            {
                title: "Beauty",
                path: "/templates/envelopes/beauty",
            },
            {
                title: "Blank Brochures",
                path: "/templates/envelopes/bland-brochures",
            },
            {
                title: "Business Services",
                path: "/templates/envelopes/business-services",
            },
            {
                title: "Child Care",
                path: "/templates/envelopes/child-care",
            },
            {
                title: "Cleaning",
                path: "/templates/envelopes/cleaning",
            },
            {
                title: "Construction",
                path: "/templates/envelopes/construction",
            },
            {
                title: "Creative",
                path: "/templates/envelopes/creative",
            },
            {
                title: "Education & Training",
                path: "/templates/envelopes/education-training",
            },
            {
                title: "Energy & Environment",
                path: "/templates/envelopes/energy-environment",
            },
            {
                title: "Event",
                path: "/templates/envelopes/event",
            },
            {
                title: "Financial Services",
                path: "/templates/envelopes/financial-services",
            },
            {
                title: "Food & Beverage",
                path: "/templates/envelopes/food-beverage",
            },
            {
                title: "Generic Brochures",
                path: "/templates/envelopes/generic-brochures",
            },
            {
                title: "Holiday",
                path: "/templates/envelopes/holiday",
            },
            {
                title: "House & Home",
                path: "/templates/envelopes/house-home",
            },
            {
                title: "Insurance",
                path: "/templates/envelopes/insurance",
            },
            {
                title: "Law",
                path: "/templates/envelopes/law",
            },
            {
                title: "Lawn & Garden",
                path: "/templates/envelopes/law-garden",
            },
            {
                title: "Medical & Health Care",
                path: "/templates/envelopes/medical-healthcare",
            },
            {
                title: "Music & Arts",
                path: "/templates/envelopes/music-arts",
            },
            {
                title: "Non Profit",
                path: "/templates/envelopes/non-profit",
            },
            {
                title: "Pets & Animals",
                path: "/templates/envelopes/pets-animals",
            },
            {
                title: "Photography",
                path: "/templates/envelopes/photography",
            },
            {
                title: "Real Estate",
                path: "/templates/envelopes/real-estate",
            },
            {
                title: "Religion & Organizations",
                path: "/templates/envelopes/religion-organization",
            },
            {
                title: "Retail",
                path: "/templates/envelopes/retail",
            },
            {
                title: "Sports & Wellness",
                path: "/templates/envelopes/sports-wellness",
            },
            {
                title: "Technology",
                path: "/templates/envelopes/technology",
            },
            {
                title: "Travel & Tourism",
                path: "/templates/envelopes/travel-tourism",
            },
        ],
    },
    {
        title: "Tờ rơi",
        path: '/templates/flyers',
        childs: [
            {
                title: "Agriculture",
                path: "/templates/flyers/agriculture",
            },
            {
                title: "Automotive & Transportation",
                path: "/templates/flyers/automotive-transportation",
            },
            {
                title: "Beauty",
                path: "/templates/flyers/beauty",
            },
            {
                title: "Blank Brochures",
                path: "/templates/flyers/bland-brochures",
            },
            {
                title: "Business Services",
                path: "/templates/flyers/business-services",
            },
            {
                title: "Child Care",
                path: "/templates/flyers/child-care",
            },
            {
                title: "Cleaning",
                path: "/templates/flyers/cleaning",
            },
            {
                title: "Construction",
                path: "/templates/flyers/construction",
            },
            {
                title: "Creative",
                path: "/templates/flyers/creative",
            },
            {
                title: "Education & Training",
                path: "/templates/flyers/education-training",
            },
            {
                title: "Energy & Environment",
                path: "/templates/flyers/energy-environment",
            },
            {
                title: "Event",
                path: "/templates/flyers/event",
            },
            {
                title: "Financial Services",
                path: "/templates/flyers/financial-services",
            },
            {
                title: "Food & Beverage",
                path: "/templates/flyers/food-beverage",
            },
            {
                title: "Generic Brochures",
                path: "/templates/flyers/generic-brochures",
            },
            {
                title: "Holiday",
                path: "/templates/flyers/holiday",
            },
            {
                title: "House & Home",
                path: "/templates/flyers/house-home",
            },
            {
                title: "Insurance",
                path: "/templates/flyers/insurance",
            },
            {
                title: "Law",
                path: "/templates/flyers/law",
            },
            {
                title: "Lawn & Garden",
                path: "/templates/flyers/law-garden",
            },
            {
                title: "Medical & Health Care",
                path: "/templates/flyers/medical-healthcare",
            },
            {
                title: "Music & Arts",
                path: "/templates/flyers/music-arts",
            },
            {
                title: "Non Profit",
                path: "/templates/flyers/non-profit",
            },
            {
                title: "Pets & Animals",
                path: "/templates/flyers/pets-animals",
            },
            {
                title: "Photography",
                path: "/templates/flyers/photography",
            },
            {
                title: "Real Estate",
                path: "/templates/flyers/real-estate",
            },
            {
                title: "Religion & Organizations",
                path: "/templates/flyers/religion-organization",
            },
            {
                title: "Retail",
                path: "/templates/flyers/retail",
            },
            {
                title: "Sports & Wellness",
                path: "/templates/flyers/sports-wellness",
            },
            {
                title: "Technology",
                path: "/templates/flyers/technology",
            },
            {
                title: "Travel & Tourism",
                path: "/templates/flyers/travel-tourism",
            },
        ],
    },
    // {
    //     title: "Tiêu đề thư",
    //     path: '/templates/letterheads',
    //     childs: [
    //         {
    //             title: "Agriculture",
    //             path: "/templates/letterheads/agriculture",
    //         },
    //         {
    //             title: "Automotive & Transportation",
    //             path: "/templates/letterheads/automotive-transportation",
    //         },
    //         {
    //             title: "Beauty",
    //             path: "/templates/letterheads/beauty",
    //         },
    //         {
    //             title: "Blank Brochures",
    //             path: "/templates/letterheads/bland-brochures",
    //         },
    //         {
    //             title: "Business Services",
    //             path: "/templates/letterheads/business-services",
    //         },
    //         {
    //             title: "Child Care",
    //             path: "/templates/letterheads/child-care",
    //         },
    //         {
    //             title: "Cleaning",
    //             path: "/templates/letterheads/cleaning",
    //         },
    //         {
    //             title: "Construction",
    //             path: "/templates/letterheads/construction",
    //         },
    //         {
    //             title: "Creative",
    //             path: "/templates/letterheads/creative",
    //         },
    //         {
    //             title: "Education & Training",
    //             path: "/templates/letterheads/education-training",
    //         },
    //         {
    //             title: "Energy & Environment",
    //             path: "/templates/letterheads/energy-environment",
    //         },
    //         {
    //             title: "Event",
    //             path: "/templates/letterheads/event",
    //         },
    //         {
    //             title: "Financial Services",
    //             path: "/templates/letterheads/financial-services",
    //         },
    //         {
    //             title: "Food & Beverage",
    //             path: "/templates/letterheads/food-beverage",
    //         },
    //         {
    //             title: "Generic Brochures",
    //             path: "/templates/letterheads/generic-brochures",
    //         },
    //         {
    //             title: "Holiday",
    //             path: "/templates/letterheads/holiday",
    //         },
    //         {
    //             title: "House & Home",
    //             path: "/templates/letterheads/house-home",
    //         },
    //         {
    //             title: "Insurance",
    //             path: "/templates/letterheads/insurance",
    //         },
    //         {
    //             title: "Law",
    //             path: "/templates/letterheads/law",
    //         },
    //         {
    //             title: "Lawn & Garden",
    //             path: "/templates/letterheads/law-garden",
    //         },
    //         {
    //             title: "Medical & Health Care",
    //             path: "/templates/letterheads/medical-healthcare",
    //         },
    //         {
    //             title: "Music & Arts",
    //             path: "/templates/letterheads/music-arts",
    //         },
    //         {
    //             title: "Non Profit",
    //             path: "/templates/letterheads/non-profit",
    //         },
    //         {
    //             title: "Pets & Animals",
    //             path: "/templates/letterheads/pets-animals",
    //         },
    //         {
    //             title: "Photography",
    //             path: "/templates/letterheads/photography",
    //         },
    //         {
    //             title: "Real Estate",
    //             path: "/templates/letterheads/real-estate",
    //         },
    //         {
    //             title: "Religion & Organizations",
    //             path: "/templates/letterheads/religion-organization",
    //         },
    //         {
    //             title: "Retail",
    //             path: "/templates/letterheads/retail",
    //         },
    //         {
    //             title: "Sports & Wellness",
    //             path: "/templates/letterheads/sports-wellness",
    //         },
    //         {
    //             title: "Technology",
    //             path: "/templates/letterheads/technology",
    //         },
    //         {
    //             title: "Travel & Tourism",
    //             path: "/templates/letterheads/travel-tourism",
    //         },
    //     ],
    // },
    {
        title: "Bưu thiếp",
        path: '/templates/postcards',
        childs: [
            {
                title: "Agriculture",
                path: "/templates/postcards/agriculture",
            },
            {
                title: "Automotive & Transportation",
                path: "/templates/postcards/automotive-transportation",
            },
            {
                title: "Beauty",
                path: "/templates/postcards/beauty",
            },
            {
                title: "Blank Brochures",
                path: "/templates/postcards/bland-brochures",
            },
            {
                title: "Business Services",
                path: "/templates/postcards/business-services",
            },
            {
                title: "Child Care",
                path: "/templates/postcards/child-care",
            },
            {
                title: "Cleaning",
                path: "/templates/postcards/cleaning",
            },
            {
                title: "Construction",
                path: "/templates/postcards/construction",
            },
            {
                title: "Creative",
                path: "/templates/postcards/creative",
            },
            {
                title: "Education & Training",
                path: "/templates/postcards/education-training",
            },
            {
                title: "Energy & Environment",
                path: "/templates/postcards/energy-environment",
            },
            {
                title: "Event",
                path: "/templates/postcards/event",
            },
            {
                title: "Financial Services",
                path: "/templates/postcards/financial-services",
            },
            {
                title: "Food & Beverage",
                path: "/templates/postcards/food-beverage",
            },
            {
                title: "Generic Brochures",
                path: "/templates/postcards/generic-brochures",
            },
            {
                title: "Holiday",
                path: "/templates/postcards/holiday",
            },
            {
                title: "House & Home",
                path: "/templates/postcards/house-home",
            },
            {
                title: "Insurance",
                path: "/templates/postcards/insurance",
            },
            {
                title: "Law",
                path: "/templates/postcards/law",
            },
            {
                title: "Lawn & Garden",
                path: "/templates/postcards/law-garden",
            },
            {
                title: "Medical & Health Care",
                path: "/templates/postcards/medical-healthcare",
            },
            {
                title: "Music & Arts",
                path: "/templates/postcards/music-arts",
            },
            {
                title: "Non Profit",
                path: "/templates/postcards/non-profit",
            },
            {
                title: "Pets & Animals",
                path: "/templates/postcards/pets-animals",
            },
            {
                title: "Photography",
                path: "/templates/postcards/photography",
            },
            {
                title: "Real Estate",
                path: "/templates/postcards/real-estate",
            },
            {
                title: "Religion & Organizations",
                path: "/templates/postcards/religion-organization",
            },
            {
                title: "Retail",
                path: "/templates/postcards/retail",
            },
            {
                title: "Sports & Wellness",
                path: "/templates/postcards/sports-wellness",
            },
            {
                title: "Technology",
                path: "/templates/postcards/technology",
            },
            {
                title: "Travel & Tourism",
                path: "/templates/postcards/travel-tourism",
            },
        ],
    },
    // {
    //     title: "Yard Signs",
    //     path: "/templates/yard-signs",
    //     childs: [
    //         {
    //             title: "Agriculture",
    //             path: "/templates/yard-signs/agriculture",
    //         },
    //         {
    //             title: "Automotive & Transportation",
    //             path: "/templates/yard-signs/automotive-transportation",
    //         },
    //         {
    //             title: "Beauty",
    //             path: "/templates/yard-signs/beauty",
    //         },
    //         {
    //             title: "Blank Brochures",
    //             path: "/templates/yard-signs/bland-brochures",
    //         },
    //         {
    //             title: "Business Services",
    //             path: "/templates/yard-signs/business-services",
    //         },
    //         {
    //             title: "Child Care",
    //             path: "/templates/yard-signs/child-care",
    //         },
    //         {
    //             title: "Cleaning",
    //             path: "/templates/yard-signs/cleaning",
    //         },
    //         {
    //             title: "Construction",
    //             path: "/templates/yard-signs/construction",
    //         },
    //         {
    //             title: "Creative",
    //             path: "/templates/yard-signs/creative",
    //         },
    //         {
    //             title: "Education & Training",
    //             path: "/templates/yard-signs/education-training",
    //         },
    //         {
    //             title: "Energy & Environment",
    //             path: "/templates/yard-signs/energy-environment",
    //         },
    //         {
    //             title: "Event",
    //             path: "/templates/yard-signs/event",
    //         },
    //         {
    //             title: "Financial Services",
    //             path: "/templates/yard-signs/financial-services",
    //         },
    //         {
    //             title: "Food & Beverage",
    //             path: "/templates/yard-signs/food-beverage",
    //         },
    //         {
    //             title: "Generic Brochures",
    //             path: "/templates/yard-signs/generic-brochures",
    //         },
    //         {
    //             title: "Holiday",
    //             path: "/templates/yard-signs/holiday",
    //         },
    //         {
    //             title: "House & Home",
    //             path: "/templates/yard-signs/house-home",
    //         },
    //         {
    //             title: "Insurance",
    //             path: "/templates/yard-signs/insurance",
    //         },
    //         {
    //             title: "Law",
    //             path: "/templates/yard-signs/law",
    //         },
    //         {
    //             title: "Lawn & Garden",
    //             path: "/templates/yard-signs/law-garden",
    //         },
    //         {
    //             title: "Medical & Health Care",
    //             path: "/templates/yard-signs/medical-healthcare",
    //         },
    //         {
    //             title: "Music & Arts",
    //             path: "/templates/yard-signs/music-arts",
    //         },
    //         {
    //             title: "Non Profit",
    //             path: "/templates/yard-signs/non-profit",
    //         },
    //         {
    //             title: "Pets & Animals",
    //             path: "/templates/yard-signs/pets-animals",
    //         },
    //         {
    //             title: "Photography",
    //             path: "/templates/yard-signs/photography",
    //         },
    //         {
    //             title: "Real Estate",
    //             path: "/templates/yard-signs/real-estate",
    //         },
    //         {
    //             title: "Religion & Organizations",
    //             path: "/templates/yard-signs/religion-organization",
    //         },
    //         {
    //             title: "Retail",
    //             path: "/templates/yard-signs/retail",
    //         },
    //         {
    //             title: "Sports & Wellness",
    //             path: "/templates/yard-signs/sports-wellness",
    //         },
    //         {
    //             title: "Technology",
    //             path: "/templates/yard-signs/technology",
    //         },
    //         {
    //             title: "Travel & Tourism",
    //             path: "/templates/yard-signs/travel-tourism",
    //         },
    //     ],
    // },
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
            this.setState({templates: [], templates2: []}, () => {
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
    console.log('loadMore ');
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
            
          console.log('res ', res);
          console.log('asd ', templates.length + templates2.length + res.data.value.documents.length, res.data.value.count);
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
            }} 
            >
                {tree.map(ele => 
                <TreeView path={ele.path} childs={ele.childs} collapsed={this.props.filePath.indexOf(ele.path) === -1} defaultCollapsed={true} nodeLabel={ele.title} className="asd" itemClassName="asd" childrenClassName="asd" treeViewClassName="ads" onClick={null}>
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
                  >
                    <div id="image-container-picker" style={{justifyContent: 'space-around', display: 'flex', padding: '0px 5px 10px 0px',}}>
                    <div
                      style={{
                        height: "calc(100% - 170px)",
                        width: '350px',
                        marginRight: '10px',
                      }}
                    >
                      {this.state.templates.map(template => <ImgContainer href={`/editor/design/${template.id}`} style={{marginRight: '20px', marginBottom: '20px', textDecoration: 'none', display: 'inline-block',}}>
                <img
                    style={{
                        width: '350px',
                        borderRadius: '5px',
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
                      {this.state.templates2.map(template => <ImgContainer href={`/editor/design/${template.id}`} style={{marginRight: '20px', marginBottom: '20px', textDecoration: 'none', display: 'inline-block',}}>
                <img
                    style={{
                        width: '350px',
                        borderRadius: '5px',
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