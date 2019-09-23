import React, { PureComponent } from "react";
import styled, { createGlobalStyle } from "styled-components";
import TopMenu from "@Components/editor/Sidebar";
import Globals from "@Globals";
import ImagePicker from "@Components/shared/ImagePicker";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import axios from "axios";
import uuidv4 from "uuid/v4";
import { getMostProminentColor } from "@Utils";
import { toJS } from "mobx";

export interface IProps {
  toolbarOpened: any;
  toolbarSize: any;
  mode: any;
  handleSidebarSelectorClicked: any;
  selectedTab: any;
  activePageId: string;
  rectWidth: number;
  addItem: any;
  addFontItem: any;
  rectHeight: number;
  pages: any;
  scale: number;
  idObjectSelected: string;
  childId: string;
  upperZIndex: number;
  images: any;
  typeObjectSelected: any;
  handleFontColorChange: any;
  selectFont: any;
  fontsList: any;
  fonts: any;
  subtype: any;
}

interface IState {
  query: any;
  isLoading: boolean;
  items: any;
  items2: any;
  hasMoreFonts: boolean;
  userUpload1: any;
  userUpload2: any;
  currentUserUpload1: number;
  currentUserUpload2: number;
  currentItemsHeight: any;
  currentItems2Height: any;
  cursor: any;
  hasMoreImage: any;
  error: any;
  mounted: boolean;
  backgrounds1: any;
  backgrounds2: any;
  backgrounds3: any;
  groupedTexts: any;
  groupedTexts2: any;
  templates: any;
  templates2: any;
  images: any;
  fontsList: any;
  removeImages1: any;
  removeImages2: any;
  videos: any;
  isBackgroundLoading: boolean;
  currentBackgroundHeights1: number;
  currentBackgroundHeights2: number;
  currentBackgroundHeights3: number;
  isTextTemplateLoading: boolean;
  currentGroupedTextsHeight: number;
  currentGroupedTexts2Height: number;
  hasMoreTemplate: boolean;
  isTemplateLoading: any;
  hasMoreTextTemplate: boolean;
  isUserUploadLoading: boolean;
  hasMoreUserUpload: boolean;
  isRemovedBackgroundImageLoading: boolean;
  hasMoreRemovedBackground: boolean;
  currentHeightRemoveImage1: number;
  currentHeightRemoveImage2: number;
  hasMoreBackgrounds: boolean;
  currentTemplatesHeight: number;
  currentTemplate2sHeight: number;
}

const imgWidth = 160;
const backgroundWidth = 103;

enum TemplateType {
  Template = 1,
  TextTemplate = 2,
  Heading = 3,
  Image = 4,
  Latex = 5,
  BackgroundImage = 6,
  RemovedBackgroundImage = 7,
  UserUpload = 8,
  Video = 9
}

enum SidebarTab {
  Image = 1,
  Text = 2,
  Template = 4,
  Background = 8,
  Element = 16,
  Upload = 32,
  RemovedBackgroundImage = 64,
  Video = 128,
  Font = 248,
  Color = 496,
  Emoji = 992
}

const adminEmail = "llaugusty@gmail.com";

const fontColors = [
  "rgb(246, 218, 179)",
  "rgb(201, 148, 114)",
  "rgb(89, 61, 44)",
  "rgb(74, 38, 21)",
  "rgb(37, 25, 15)",
  "rgb(115, 28, 44)",
  "rgb(186, 32, 41)",
  "rgb(226, 32, 46)",
  "rgb(241, 93, 88)",
  "rgb(246, 158, 173)",
  "rgb(252, 196, 167)",
  "rgb(249, 164, 86)",
  "rgb(243, 115, 47)",
  "rgb(206, 93, 40)",
  "rgb(90, 43, 29)",
  "rgb(67, 26, 23)",
  "rgb(168, 31, 39)",
  "rgb(239, 55, 50)",
  "rgb(245, 143, 152)",
  "rgb(247, 175, 183)",
  "rgb(255, 221, 155)",
  "rgb(253, 188, 79)",
  "rgb(248, 153, 31)",
  "rgb(217, 124, 39)",
  "rgb(129, 73, 37)",
  "rgb(72, 25, 40)",
  "rgb(170, 29, 68)",
  "rgb(235, 8, 140)",
  "rgb(239, 117, 173)",
  "rgb(246, 175, 206)",
  "rgb(254, 246, 169)",
  "rgb(255, 209, 120)",
  "rgb(246, 179, 26)",
  "rgb(249, 201, 39)",
  "rgb(192, 127, 42)",
  "rgb(64, 32, 82)",
  "rgb(106, 52, 132)",
  "rgb(119, 65, 152)",
  "rgb(161, 130, 187)",
  "rgb(177, 158, 204)",
  "rgb(254, 244, 140)",
  "rgb(252, 240, 93)",
  "rgb(252, 238, 33)",
  "rgb(206, 220, 40)",
  "rgb(154, 168, 57)",
  "rgb(33, 29, 77)",
  "rgb(84, 39, 101)",
  "rgb(80, 90, 168)",
  "rgb(127, 127, 189)",
  "rgb(158, 156, 205)",
  "rgb(215, 231, 171)",
  "rgb(200, 221, 108)",
  "rgb(153, 204, 106)",
  "rgb(136, 179, 63)",
  "rgb(110, 134, 56)",
  "rgb(31, 37, 85)",
  "rgb(19, 75, 150)",
  "rgb(6, 109, 181)",
  "rgb(39, 174, 229)",
  "rgb(138, 213, 247)",
  "rgb(176, 218, 172)",
  "rgb(84, 187, 111)",
  "rgb(1, 176, 83)",
  "rgb(1, 93, 49)",
  "rgb(13, 63, 34)",
  "rgb(0, 124, 143)",
  "rgb(0, 169, 162)",
  "rgb(54, 193, 208)",
  "rgb(129, 207, 207)",
  "rgb(151, 216, 224)",
  "rgb(255, 255, 255)",
  "rgb(137, 133, 134)",
  "rgb(102, 99, 100)",
  "rgb(84, 80, 80)",
  "rgb(58, 56, 56)",
  "rgb(52, 50, 50)",
  "rgb(36, 36, 36)",
  "rgb(31, 30, 30)",
  "rgb(16, 19, 19)",
  "rgb(0, 0, 0)"
];

const allColors = [
  "rgb(158, 156, 205)",
  "rgb(141, 140, 196)",
  "rgb(127, 127, 189)",
  "rgb(112, 114, 181)",
  "rgb(80, 90, 168)",
  "rgb(47, 72, 156)",
  "rgb(31, 67, 150)",
  "rgb(34, 65, 146)",
  "rgb(39, 60, 137)",
  "rgb(40, 57, 126)",
  "rgb(41, 52, 118)",
  "rgb(41, 50, 114)",
  "rgb(40, 46, 106)",
  "rgb(37, 40, 95)",
  "rgb(34, 38, 90)",
  "rgb(31, 33, 82)",
  "rgb(27, 29, 76)",
  "rgb(26, 27, 73)",
  "rgb(33, 29, 77)",
  "rgb(35, 34, 87)",
  "rgb(38, 37, 93)",
  "rgb(48, 42, 106)",
  "rgb(53, 47, 113)",
  "rgb(43, 50, 119)",
  "rgb(62, 51, 126)",
  "rgb(64, 56, 136)",
  "rgb(70, 59, 145)",
  "rgb(61, 64, 151)",
  "rgb(73, 69, 156)",
  "rgb(100, 90, 167)",
  "rgb(177, 158, 204)",
  "rgb(169, 145, 196)",
  "rgb(161, 130, 187)",
  "rgb(153, 118, 181)",
  "rgb(133, 93, 166)",
  "rgb(119, 65, 152)",
  "rgb(102, 59, 147)",
  "rgb(116, 54, 141)",
  "rgb(106, 52, 132)",
  "rgb(101, 48, 122)",
  "rgb(96, 44, 115)",
  "rgb(90, 42, 109)",
  "rgb(84, 39, 101)",
  "rgb(64, 32, 82)",
  "rgb(59, 32, 79)",
  "rgb(50, 25, 65)",
  "rgb(36, 23, 66)",
  "rgb(45, 23, 57)",
  "rgb(53, 25, 64)",
  "rgb(69, 32, 78)",
  "rgb(75, 32, 84)",
  "rgb(92, 38, 99)",
  "rgb(103, 41, 108)",
  "rgb(110, 43, 112)",
  "rgb(118, 46, 120)",
  "rgb(126, 48, 129)",
  "rgb(137, 50, 138)",
  "rgb(141, 51, 144)",
  "rgb(159, 61, 147)",
  "rgb(167, 91, 161)",
  "rgb(221, 169, 205)",
  "rgb(216, 153, 196)",
  "rgb(213, 139, 186)",
  "rgb(205, 120, 176)",
  "rgb(198, 93, 160)",
  "rgb(192, 55, 143)",
  "rgb(160, 45, 138)",
  "rgb(143, 45, 127)",
  "rgb(129, 43, 119)",
  "rgb(118, 42, 111)",
  "rgb(113, 40, 106)",
  "rgb(98, 38, 97)",
  "rgb(80, 31, 81)",
  "rgb(73, 30, 72)",
  "rgb(57, 25, 60)",
  "rgb(51, 22, 47)",
  "rgb(54, 21, 40)",
  "rgb(66, 22, 50)",
  "rgb(86, 30, 65)",
  "rgb(96, 28, 73)",
  "rgb(102, 28, 80)",
  "rgb(110, 36, 98)",
  "rgb(133, 35, 100)",
  "rgb(149, 35, 110)",
  "rgb(174, 32, 120)",
  "rgb(202, 29, 133)",
  "rgb(208, 22, 132)",
  "rgb(216, 48, 139)",
  "rgb(222, 94, 159)",
  "rgb(232, 119, 181)",
  "rgb(246, 175, 206)",
  "rgb(245, 160, 197)",
  "rgb(243, 145, 188)",
  "rgb(239, 117, 173)",
  "rgb(239, 80, 156)",
  "rgb(236, 44, 145)",
  "rgb(235, 8, 140)",
  "rgb(221, 10, 133)",
  "rgb(192, 28, 120)",
  "rgb(162, 33, 108)",
  "rgb(141, 33, 99)",
  "rgb(129, 31, 92)",
  "rgb(108, 27, 78)",
  "rgb(100, 28, 71)",
  "rgb(89, 30, 63)",
  "rgb(68, 22, 47)",
  "rgb(55, 20, 38)",
  "rgb(54, 21, 37)",
  "rgb(69, 23, 45)",
  "rgb(91, 29, 59)",
  "rgb(104, 28, 66)",
  "rgb(114, 31, 72)",
  "rgb(129, 28, 83)",
  "rgb(148, 30, 91)",
  "rgb(167, 32, 99)",
  "rgb(194, 29, 108)",
  "rgb(221, 16, 120)",
  "rgb(236, 14, 116)",
  "rgb(238, 46, 127)",
  "rgb(240, 93, 147)",
  "rgb(247, 174, 197)",
  "rgb(245, 159, 188)",
  "rgb(244, 145, 177)",
  "rgb(242, 124, 158)",
  "rgb(240, 96, 132)",
  "rgb(238, 50, 111)",
  "rgb(236, 22, 95)",
  "rgb(224, 26, 90)",
  "rgb(197, 31, 72)",
  "rgb(170, 29, 68)",
  "rgb(153, 31, 63)",
  "rgb(132, 25, 53)",
  "rgb(125, 28, 49)",
  "rgb(109, 28, 52)",
  "rgb(97, 31, 50)",
  "rgb(72, 25, 40)",
  "rgb(53, 21, 33)",
  "rgb(51, 21, 29)",
  "rgb(70, 25, 38)",
  "rgb(98, 32, 48)",
  "rgb(113, 29, 48)",
  "rgb(127, 26, 47)",
  "rgb(138, 28, 49)",
  "rgb(159, 31, 58)",
  "rgb(176, 30, 61)",
  "rgb(202, 32, 62)",
  "rgb(224, 28, 75)",
  "rgb(238, 30, 77)",
  "rgb(238, 51, 92)",
  "rgb(241, 95, 118)",
  "rgb(247, 174, 188)",
  "rgb(246, 158, 173)",
  "rgb(244, 144, 160)",
  "rgb(242, 119, 133)",
  "rgb(241, 94, 106)",
  "rgb(238, 51, 78)",
  "rgb(236, 28, 61)",
  "rgb(224, 28, 68)",
  "rgb(202, 32, 56)",
  "rgb(178, 31, 55)",
  "rgb(159, 30, 53)",
  "rgb(140, 29, 43)",
  "rgb(127, 27, 42)",
  "rgb(115, 28, 44)",
  "rgb(98, 33, 45)",
  "rgb(69, 26, 35)",
  "rgb(48, 20, 25)",
  "rgb(47, 20, 20)",
  "rgb(68, 26, 25)",
  "rgb(99, 35, 35)",
  "rgb(115, 29, 32)",
  "rgb(130, 29, 33)",
  "rgb(146, 31, 37)",
  "rgb(168, 31, 39)",
  "rgb(186, 32, 41)",
  "rgb(205, 32, 41)",
  "rgb(226, 32, 46)",
  "rgb(236, 30, 48)",
  "rgb(238, 50, 60)",
  "rgb(241, 93, 95)",
  "rgb(247, 175, 183)",
  "rgb(246, 159, 167)",
  "rgb(245, 143, 152)",
  "rgb(243, 126, 129)",
  "rgb(241, 93, 88)",
  "rgb(239, 55, 50)",
  "rgb(236, 32, 39)",
  "rgb(227, 32, 39)",
  "rgb(186, 32, 39)",
  "rgb(170, 32, 36)",
  "rgb(151, 32, 35)",
  "rgb(130, 29, 31)",
  "rgb(115, 31, 28)",
  "rgb(99, 35, 30)",
  "rgb(67, 26, 23)",
  "rgb(45, 18, 18)",
  "rgb(47, 19, 19)",
  "rgb(66, 27, 23)",
  "rgb(99, 38, 30)",
  "rgb(115, 36, 29)",
  "rgb(134, 35, 32)",
  "rgb(154, 42, 36)",
  "rgb(172, 39, 37)",
  "rgb(188, 46, 38)",
  "rgb(213, 49, 39)",
  "rgb(231, 54, 38)",
  "rgb(239, 64, 35)",
  "rgb(241, 87, 45)",
  "rgb(244, 119, 84)",
  "rgb(247, 137, 111)",
  "rgb(252, 205, 180)",
  "rgb(252, 196, 167)",
  "rgb(251, 186, 147)",
  "rgb(249, 166, 119)",
  "rgb(246, 143, 88)",
  "rgb(243, 115, 47)",
  "rgb(241, 94, 36)",
  "rgb(230, 90, 37)",
  "rgb(213, 80, 39)",
  "rgb(189, 67, 39)",
  "rgb(184, 64, 38)",
  "rgb(164, 56, 38)",
  "rgb(136, 48, 32)",
  "rgb(107, 42, 29)",
  "rgb(94, 43, 31)",
  "rgb(64, 28, 23)",
  "rgb(47, 19, 18)",
  "rgb(47, 20, 19)",
  "rgb(63, 28, 22)",
  "rgb(90, 43, 29)",
  "rgb(107, 43, 30)",
  "rgb(139, 51, 34)",
  "rgb(170, 64, 39)",
  "rgb(185, 74, 38)",
  "rgb(206, 93, 40)",
  "rgb(221, 104, 38)",
  "rgb(236, 115, 36)",
  "rgb(244, 120, 32)",
  "rgb(247, 143, 45)",
  "rgb(249, 164, 86)",
  "rgb(246, 218, 179)",
  "rgb(207, 160, 123)",
  "rgb(201, 148, 114)",
  "rgb(193, 130, 89)",
  "rgb(152, 97, 62)",
  "rgb(172, 104, 64)",
  "rgb(148, 88, 54)",
  "rgb(119, 60, 27)",
  "rgb(98, 49, 23)",
  "rgb(87, 37, 16)",
  "rgb(153, 123, 78)",
  "rgb(122, 93, 53)",
  "rgb(76, 55, 28)",
  "rgb(74, 55, 40)",
  "rgb(55, 40, 20)",
  "rgb(55, 30, 18)",
  "rgb(43, 24, 13)",
  "rgb(37, 25, 15)",
  "rgb(52, 35, 22)",
  "rgb(74, 38, 21)",
  "rgb(70, 36, 19)",
  "rgb(89, 61, 44)",
  "rgb(139, 90, 51)",
  "rgb(145, 101, 82)",
  "rgb(194, 134, 90)",
  "rgb(192, 128, 86)",
  "rgb(222, 152, 111)",
  "rgb(215, 163, 119)",
  "rgb(235, 201, 153)",
  "rgb(249, 200, 147)",
  "rgb(255, 225, 167)",
  "rgb(255, 221, 155)",
  "rgb(255, 218, 138)",
  "rgb(255, 209, 120)",
  "rgb(253, 188, 79)",
  "rgb(251, 174, 38)",
  "rgb(248, 153, 31)",
  "rgb(241, 145, 33)",
  "rgb(224, 122, 38)",
  "rgb(209, 104, 40)",
  "rgb(195, 91, 40)",
  "rgb(167, 71, 38)",
  "rgb(135, 51, 34)",
  "rgb(101, 46, 30)",
  "rgb(83, 42, 28)",
  "rgb(65, 29, 23)",
  "rgb(47, 20, 17)",
  "rgb(68, 32, 24)",
  "rgb(79, 41, 27)",
  "rgb(94, 49, 31)",
  "rgb(123, 52, 30)",
  "rgb(167, 80, 39)",
  "rgb(202, 101, 40)",
  "rgb(217, 124, 39)",
  "rgb(232, 150, 36)",
  "rgb(246, 179, 26)",
  "rgb(248, 193, 28)",
  "rgb(249, 201, 39)",
  "rgb(252, 210, 80)",
  "rgb(247, 209, 102)",
  "rgb(254, 246, 169)",
  "rgb(253, 244, 155)",
  "rgb(254, 244, 140)",
  "rgb(253, 242, 129)",
  "rgb(252, 240, 93)",
  "rgb(252, 238, 45)",
  "rgb(252, 238, 33)",
  "rgb(248, 211, 10)",
  "rgb(237, 182, 30)",
  "rgb(229, 160, 36)",
  "rgb(192, 127, 42)",
  "rgb(164, 97, 40)",
  "rgb(129, 73, 37)",
  "rgb(91, 51, 31)",
  "rgb(78, 41, 27)",
  "rgb(68, 33, 22)",
  "rgb(46, 21, 17)",
  "rgb(52, 38, 23)",
  "rgb(75, 55, 32)",
  "rgb(87, 75, 39)",
  "rgb(94, 84, 41)",
  "rgb(112, 102, 45)",
  "rgb(141, 129, 50)",
  "rgb(142, 147, 55)",
  "rgb(154, 168, 57)",
  "rgb(185, 195, 51)",
  "rgb(206, 220, 40)",
  "rgb(221, 226, 55)",
  "rgb(223, 228, 94)",
  "rgb(229, 229, 118)",
  "rgb(215, 231, 171)",
  "rgb(206, 226, 157)",
  "rgb(210, 228, 153)",
  "rgb(205, 225, 141)",
  "rgb(200, 221, 108)",
  "rgb(191, 215, 60)",
  "rgb(168, 207, 57)",
  "rgb(136, 179, 63)",
  "rgb(127, 160, 62)",
  "rgb(124, 139, 56)",
  "rgb(122, 120, 50)",
  "rgb(112, 105, 47)",
  "rgb(94, 83, 41)",
  "rgb(61, 58, 31)",
  "rgb(43, 40, 23)",
  "rgb(39, 24, 15)",
  "rgb(31, 28, 16)",
  "rgb(35, 42, 24)",
  "rgb(46, 60, 33)",
  "rgb(71, 77, 41)",
  "rgb(76, 84, 44)",
  "rgb(89, 97, 49)",
  "rgb(100, 113, 51)",
  "rgb(110, 134, 56)",
  "rgb(104, 154, 64)",
  "rgb(100, 172, 69)",
  "rgb(96, 187, 70)",
  "rgb(125, 194, 71)",
  "rgb(153, 204, 106)",
  "rgb(168, 211, 122)",
  "rgb(176, 218, 172)",
  "rgb(162, 211, 157)",
  "rgb(151, 207, 146)",
  "rgb(140, 202, 134)",
  "rgb(120, 195, 109)",
  "rgb(82, 184, 78)",
  "rgb(33, 178, 75)",
  "rgb(71, 165, 71)",
  "rgb(74, 146, 66)",
  "rgb(69, 130, 61)",
  "rgb(67, 111, 53)",
  "rgb(62, 96, 48)",
  "rgb(61, 88, 45)",
  "rgb(54, 80, 41)",
  "rgb(32, 60, 33)",
  "rgb(27, 42, 24)",
  "rgb(22, 32, 18)",
  "rgb(17, 33, 19)",
  "rgb(25, 43, 24)",
  "rgb(24, 61, 33)",
  "rgb(30, 85, 46)",
  "rgb(16, 91, 47)",
  "rgb(19, 99, 51)",
  "rgb(20, 116, 59)",
  "rgb(6, 131, 65)",
  "rgb(0, 147, 71)",
  "rgb(0, 154, 73)",
  "rgb(10, 171, 77)",
  "rgb(1, 176, 83)",
  "rgb(84, 187, 111)",
  "rgb(153, 210, 174)",
  "rgb(136, 204, 161)",
  "rgb(116, 197, 148)",
  "rgb(81, 188, 131)",
  "rgb(53, 183, 118)",
  "rgb(0, 173, 95)",
  "rgb(1, 166, 78)",
  "rgb(0, 157, 77)",
  "rgb(0, 144, 72)",
  "rgb(1, 130, 66)",
  "rgb(0, 116, 61)",
  "rgb(5, 108, 57)",
  "rgb(1, 93, 49)",
  "rgb(0, 84, 45)",
  "rgb(13, 63, 34)",
  "rgb(18, 45, 25)",
  "rgb(17, 34, 20)",
  "rgb(12, 31, 19)",
  "rgb(15, 44, 28)",
  "rgb(14, 61, 41)",
  "rgb(6, 85, 55)",
  "rgb(0, 91, 59)",
  "rgb(0, 108, 67)",
  "rgb(1, 115, 73)",
  "rgb(0, 129, 78)",
  "rgb(0, 145, 83)",
  "rgb(0, 157, 88)",
  "rgb(0, 166, 91)",
  "rgb(0, 169, 102)",
  "rgb(0, 180, 128)",
  "rgb(152, 210, 189)",
  "rgb(134, 205, 178)",
  "rgb(110, 198, 169)",
  "rgb(75, 189, 154)",
  "rgb(0, 182, 147)",
  "rgb(0, 170, 126)",
  "rgb(0, 167, 109)",
  "rgb(0, 158, 120)",
  "rgb(3, 143, 118)",
  "rgb(0, 124, 112)",
  "rgb(0, 111, 109)",
  "rgb(1, 103, 102)",
  "rgb(2, 89, 91)",
  "rgb(5, 80, 84)",
  "rgb(13, 61, 47)",
  "rgb(14, 43, 37)",
  "rgb(12, 31, 26)",
  "rgb(16, 32, 46)",
  "rgb(15, 42, 54)",
  "rgb(16, 61, 69)",
  "rgb(6, 79, 92)",
  "rgb(2, 88, 100)",
  "rgb(3, 101, 116)",
  "rgb(4, 109, 122)",
  "rgb(0, 118, 119)",
  "rgb(4, 142, 129)",
  "rgb(0, 158, 132)",
  "rgb(0, 167, 132)",
  "rgb(0, 171, 148)",
  "rgb(4, 183, 166)",
  "rgb(151, 216, 224)",
  "rgb(129, 207, 207)",
  "rgb(106, 201, 203)",
  "rgb(54, 193, 208)",
  "rgb(0, 184, 190)",
  "rgb(0, 173, 178)",
  "rgb(0, 169, 162)",
  "rgb(0, 160, 154)",
  "rgb(0, 140, 144)",
  "rgb(0, 124, 143)",
  "rgb(0, 108, 134)",
  "rgb(0, 101, 129)",
  "rgb(0, 87, 113)",
  "rgb(12, 78, 103)",
  "rgb(17, 61, 94)",
  "rgb(19, 39, 75)",
  "rgb(16, 29, 66)",
  "rgb(24, 30, 73)",
  "rgb(26, 39, 82)",
  "rgb(22, 61, 104)",
  "rgb(14, 71, 118)",
  "rgb(2, 78, 128)",
  "rgb(0, 94, 150)",
  "rgb(0, 105, 164)",
  "rgb(0, 118, 171)",
  "rgb(4, 135, 179)",
  "rgb(2, 157, 197)",
  "rgb(0, 171, 199)",
  "rgb(0, 176, 214)",
  "rgb(0, 186, 215)",
  "rgb(152, 220, 244)",
  "rgb(138, 213, 247)",
  "rgb(107, 207, 246)",
  "rgb(79, 200, 244)",
  "rgb(20, 195, 244)",
  "rgb(39, 174, 229)",
  "rgb(44, 170, 226)",
  "rgb(28, 155, 215)",
  "rgb(24, 145, 208)",
  "rgb(15, 129, 197)",
  "rgb(6, 109, 181)",
  "rgb(0, 93, 168)",
  "rgb(5, 79, 152)",
  "rgb(23, 72, 137)",
  "rgb(33, 57, 111)",
  "rgb(30, 35, 82)",
  "rgb(26, 30, 75)",
  "rgb(30, 35, 83)",
  "rgb(34, 53, 107)",
  "rgb(29, 68, 133)",
  "rgb(3, 80, 156)",
  "rgb(0, 92, 166)",
  "rgb(3, 106, 177)",
  "rgb(1, 117, 187)",
  "rgb(10, 123, 193)",
  "rgb(9, 133, 199)",
  "rgb(21, 144, 208)",
  "rgb(24, 157, 217)",
  "rgb(16, 172, 227)",
  "rgb(27, 184, 226)",
  "rgb(155, 206, 234)",
  "rgb(141, 197, 235)",
  "rgb(120, 188, 232)",
  "rgb(82, 176, 227)",
  "rgb(61, 167, 222)",
  "rgb(6, 152, 213)",
  "rgb(10, 134, 200)",
  "rgb(12, 120, 190)",
  "rgb(0, 101, 172)",
  "rgb(0, 94, 163)",
  "rgb(0, 84, 151)",
  "rgb(6, 79, 146)",
  "rgb(19, 75, 150)",
  "rgb(35, 60, 120)",
  "rgb(36, 58, 112)",
  "rgb(36, 53, 108)",
  "rgb(33, 41, 91)",
  "rgb(31, 37, 85)",
  "rgb(34, 49, 100)",
  "rgb(34, 56, 110)",
  "rgb(30, 67, 134)",
  "rgb(21, 73, 139)",
  "rgb(9, 78, 144)",
  "rgb(0, 84, 153)",
  "rgb(0, 92, 165)",
  "rgb(4, 98, 171)",
  "rgb(8, 101, 177)",
  "rgb(6, 113, 185)",
  "rgb(21, 130, 198)",
  "rgb(32, 141, 196)",
  "rgb(168, 198, 229)",
  "rgb(152, 187, 227)",
  "rgb(124, 162, 213)",
  "rgb(94, 137, 198)",
  "rgb(62, 118, 187)",
  "rgb(14, 103, 177)",
  "rgb(10, 98, 175)",
  "rgb(0, 89, 165)",
  "rgb(0, 85, 158)",
  "rgb(11, 78, 145)",
  "rgb(22, 73, 138)",
  "rgb(27, 70, 134)",
  "rgb(38, 57, 118)",
  "rgb(35, 45, 97)",
  "rgb(34, 42, 91)",
  "rgb(30, 36, 84)",
  "rgb(29, 32, 79)",
  "rgb(34, 40, 91)",
  "rgb(37, 43, 98)",
  "rgb(38, 52, 111)",
  "rgb(39, 56, 120)",
  "rgb(38, 58, 123)",
  "rgb(39, 65, 124)",
  "rgb(36, 62, 130)",
  "rgb(32, 67, 141)",
  "rgb(28, 69, 149)",
  "rgb(13, 77, 158)",
  "rgb(28, 83, 163)",
  "rgb(41, 98, 173)",
  "rgb(49, 110, 175)",
  "rgb(129, 148, 203)",
  "rgb(98, 119, 186)",
  "rgb(71, 100, 174)",
  "rgb(49, 84, 163)",
  "rgb(33, 75, 157)",
  "rgb(33, 70, 153)",
  "rgb(33, 68, 152)",
  "rgb(35, 64, 145)",
  "rgb(37, 67, 132)",
  "rgb(41, 52, 119)",
  "rgb(41, 53, 109)",
  "rgb(39, 48, 108)",
  "rgb(37, 40, 94)",
  "rgb(34, 37, 89)",
  "rgb(29, 31, 79)",
  "rgb(24, 27, 68)"
];

class LeftSide extends PureComponent<IProps, IState> {
  state = {
    query: "",
    isLoading: false,
    items: [],
    items2: [],
    hasMoreFonts: true,
    userUpload1: [],
    userUpload2: [],
    currentItemsHeight: 0,
    currentItems2Height: 0,
    cursor: null,
    hasMoreImage: true,
    error: null,
    mounted: true,
    backgrounds1: [],
    backgrounds2: [],
    backgrounds3: [],
    groupedTexts: [],
    groupedTexts2: [],
    templates: [],
    templates2: [],
    images: [],
    fontsList: [],
    removeImages1: [],
    removeImages2: [],
    videos: [],
    isBackgroundLoading: false,
    currentBackgroundHeights1: 0,
    currentBackgroundHeights2: 0,
    currentBackgroundHeights3: 0,
    currentGroupedTextsHeight: 0,
    currentGroupedTexts2Height: 0,
    currentTemplatesHeight: 0,
    currentTemplate2sHeight: 0,
    hasMoreTemplate: true,
    isTemplateLoading: false,
    subtype: null,
    isTextTemplateLoading: false,
    hasMoreTextTemplate: true,
    currentHeightRemoveImage1: 0,
    currentHeightRemoveImage2:0 ,
    currentUserUpload1: 0,
    currentUserUpload2: 0,
    hasMoreBackgrounds: true,
    isUserUploadLoading: false,
    hasMoreUserUpload: true,
    isRemovedBackgroundImageLoading: false,
    hasMoreRemovedBackground: true,
  };

  componentDidMount() {
    this.loadMore.bind(this)(true);
    this.loadMoreBackground.bind(this)(true);
    // this.loadMoreTemplate(this)(true);
    this.loadMoreFont.bind(this)(true);
    this.loadMoreTextTemplate.bind(this)(true);
    this.loadMoreTemplate.bind(this)(true, this.props.subtype);
    this.loadmoreUserUpload.bind(this)(true);
    console.log("props", this.props);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.subtype !== prevProps.subtype) {
      this.loadMoreTemplate.bind(this)(true, this.state.subtype);
    }
  }

  handleRemoveAllMedia = () => {
    console.log("handleRemoveAllMedia");
    var model;
    if (
      this.props.selectedTab === SidebarTab.Image ||
      this.props.selectedTab === SidebarTab.Background
    ) {
      model = "Media";
    } else if (
      this.props.selectedTab === SidebarTab.Template ||
      this.props.selectedTab === SidebarTab.Text
    ) {
      model = "Template";
    }
    const url = `/api/${model}/RemoveAll`;

    console.log("url   ", url);
    fetch(url);
  };

  uploadFont = e => {
    var self = this;
    var fileUploader = document.getElementById(
      "image-file"
    ) as HTMLInputElement;
    var file = fileUploader.files[0];
    var fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = () => {
      var url = `/api/Font/Add`;
      axios.post(url, { id: uuidv4(), data: fr.result }).then(() => {
        self.setState({ hasMoreFonts: true });
      });
    };
  };

  uploadVideo = () => {
    console.log("uploadVideo");
    var self = this;
    ``;
    var fileUploader = document.getElementById(
      "image-file"
    ) as HTMLInputElement;
    var file = fileUploader.files[0];
    var fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = () => {
      var url = `/api/Media/AddVideo`;
      axios.post(url, {
        id: uuidv4(),
        data: fr.result,
        type: TemplateType.Video
      });
    };
  };

  uploadImage = (type, removeBackground, e) => {
    console.log("uploadImage ", type);
    var self = this;
    ``;
    var fileUploader = document.getElementById(
      "image-file"
    ) as HTMLInputElement;
    var file = fileUploader.files[0];
    var fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = () => {
      var url = `/api/Media/Add`;
      if (type === TemplateType.RemovedBackgroundImage) {
        url = `/api/Media/Add2`;
      }
      var i = new Image();

      console.log("url   ", type, url);

      self.setState({
        userUpload1: [{ representative: fr.result }, ...self.state.userUpload1]
      });

      i.onload = function() {
        var prominentColor = getMostProminentColor(i);
        axios
          .post(url, {
            id: uuidv4(),
            ext: file.name.split(".")[1],
            userEmail: Globals.serviceUser.username,
            color: `rgb(${prominentColor.r}, ${prominentColor.g}, ${prominentColor.b})`,
            data: fr.result,
            width: i.width,
            height: i.height,
            type,
            keywords: ["123", "123"],
            title: "Manh quynh"
          })
          .then(() => {});
      };

      i.src = fr.result.toString();
    };
  };

  loadMore = (initialLoad: Boolean) => {
    console.log("loadMore 2222 ");
    let pageId;
    let count;
    if (initialLoad) {
      pageId = 1;
      count = 15;
    } else {
      pageId = (this.state.items.length + this.state.items2.length) / 15 + 1;
      count = 15;
    }
    this.setState({ isLoading: true, error: undefined });
    const url = `/api/Media/Search?type=${TemplateType.Image}&page=${pageId}&perPage=${count}&terms=${this.state.query}`;
    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          console.log("loadMore res ", res);
          var result = res.value.key;
          var currentItemsHeight = this.state.currentItemsHeight;
          var currentItems2Height = this.state.currentItems2Height;
          var res1 = [];
          var res2 = [];
          for (var i = 0; i < result.length; ++i) {
            var currentItem = result[i];
            if (currentItemsHeight <= currentItems2Height) {
              res1.push(currentItem);
              currentItemsHeight +=
                imgWidth / (currentItem.width / currentItem.height);
            } else {
              res2.push(currentItem);
              currentItems2Height +=
                imgWidth / (currentItem.width / currentItem.height);
            }
          }
          this.setState(state => ({
            items: [...state.items, ...res1],
            items2: [...state.items2, ...res2],
            currentItemsHeight,
            currentItems2Height,
            cursor: res.cursor,
            isLoading: false,
            hasMoreImage:
              res.value.value >
              state.items.length + state.items2.length + res.value.key.length
          }));
        },
        error => {
          this.setState({ isLoading: false, error });
        }
      );
  };

  handleQuery = e => {
    if (e.key === "Enter") {
      this.setState({ query: e.target.value, items: [], items2: [] }, () => {
        this.loadMore(true);
      });
    }
  };

  imgDragging = null;

  imgOnMouseDown(img, e) {
    e.preventDefault();
    var target = e.target.cloneNode(true);
    target.style.zIndex = "11111111111";
    target.src = img.representativeThumbnail ? img.representativeThumbnail : e.target.src;
    target.style.width = e.target.getBoundingClientRect().width + "px";
    target.style.backgroundColor = e.target.style.backgroundColor;
    document.body.appendChild(target);
    var self = this;
    this.imgDragging = target;
    var posX = e.pageX - e.target.getBoundingClientRect().left;
    var dragging = true;
    var posY = e.pageY - e.target.getBoundingClientRect().top;

    var recScreenContainer = document
      .getElementById("screen-container-parent")
      .getBoundingClientRect();
    var beingInScreenContainer = false;

    const onMove = e => {
      if (dragging) {
        var rec2 = self.imgDragging.getBoundingClientRect();
        if (
          beingInScreenContainer === false &&
          recScreenContainer.left < rec2.left &&
          recScreenContainer.right > rec2.right &&
          recScreenContainer.top < rec2.top &&
          recScreenContainer.bottom > rec2.bottom
        ) {
          beingInScreenContainer = true;

          setTimeout(() => {
            target.style.transitionDuration = "";
          }, 50);
        }

        if (
          beingInScreenContainer === true &&
          !(
            recScreenContainer.left < rec2.left &&
            recScreenContainer.right > rec2.right &&
            recScreenContainer.top < rec2.top &&
            recScreenContainer.bottom > rec2.bottom
          )
        ) {
          beingInScreenContainer = false;

          setTimeout(() => {
            target.style.transitionDuration = "";
          }, 50);
        }

        target.style.left = e.pageX - posX + "px";
        target.style.top = e.pageY - posY + "px";
        target.style.position = "absolute";
      }
    };

    const onUp = e => {
      dragging = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);

      var recs = document.getElementsByClassName("alo");
      var rec2 = self.imgDragging.getBoundingClientRect();
      for (var i = 0; i < recs.length; ++i) {
        var rec = recs[i].getBoundingClientRect();
        if (
          rec.left < rec2.right &&
          rec.right > rec2.left &&
          rec.top < rec2.bottom &&
          rec.bottom > rec2.top
        ) {
          this.props.addItem({
            _id: uuidv4(),
            type: TemplateType.Image,
            width: rec2.width / self.props.scale,
            height: rec2.height / self.props.scale,
            origin_width: rec2.width / self.props.scale,
            origin_height: rec2.height / self.props.scale,
            left: (rec2.left - rec.left) / self.props.scale,
            top: (rec2.top - rec.top) / self.props.scale,
            rotateAngle: 0.0,
            src: !img.representative.startsWith("data")
              ? window.location.origin + "/" + img.representative
              : img.representative,
            backgroundColor: target.style.backgroundColor,
            selected: false,
            scaleX: 1,
            scaleY: 1,
            posX: 0,
            posY: 0,
            imgWidth: rec2.width / self.props.scale,
            imgHeight: rec2.height / self.props.scale,
            page: this.props.pages[i],
            zIndex: this.props.upperZIndex + 1
          });

          // self.setState({upperZIndex: this.state.upperZIndex + 1, });
        }
      }

      self.imgDragging.remove();
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  handleEditmedia = item => {
    // this.setState({showMediaEditPopup: true, editingMedia: item})
  };

  backgroundOnMouseDown(item, e) {
    var rec2 = e.target.getBoundingClientRect();
    var self = this;
    let images = [...this.state.images];
    var { rectWidth, rectHeight } = this.props;
    var ratio = rectWidth / rectHeight;
    var imgRatio = rec2.width / rec2.height;
    var width = rectWidth;
    var height = rectWidth / imgRatio;
    console.log("width height", width, height);
    if (height < rectHeight) {
      height = rectHeight;
      width = imgRatio * height;
    }

    this.props.addItem({
      _id: uuidv4(),
      type: TemplateType.BackgroundImage,
      width: rectWidth,
      height: rectHeight,
      origin_width: width,
      origin_height: height,
      left: 0,
      top: 0,
      rotateAngle: 0.0,
      src: window.location.origin + "/" + item.representative,
      selected: false,
      scaleX: 1,
      scaleY: 1,
      posX: -(width - rectWidth) / 2,
      posY: -(height - rectHeight) / 2,
      imgWidth: width,
      imgHeight: height,
      page: this.props.activePageId,
      zIndex: 1,
      width2: 1,
      height2: 1,
      document_object: [],
      ref: null,
      innerHTML: null,
      color: null,
      opacity: 100,
      backgroundColor: null,
      childId: null
    });

    this.setState({ images });
  }

  videoOnMouseDown(e) {
    e.preventDefault();

    var target = e.target.cloneNode(true);

    target.style.zIndex = "11111111111";
    target.src = e.target.getElementsByTagName("source")[0].getAttribute("src");
    target.style.width = e.target.getBoundingClientRect().width + "px";
    document.body.appendChild(target);
    var self = this;
    this.imgDragging = target;
    var posX = e.pageX - e.target.getBoundingClientRect().left;
    var dragging = true;
    var posY = e.pageY - e.target.getBoundingClientRect().top;

    var recScreenContainer = document
      .getElementById("screen-container-parent")
      .getBoundingClientRect();
    var beingInScreenContainer = false;

    const onMove = e => {
      if (dragging) {
        var rec2 = self.imgDragging.getBoundingClientRect();
        if (
          beingInScreenContainer === false &&
          recScreenContainer.left < rec2.left &&
          recScreenContainer.right > rec2.right &&
          recScreenContainer.top < rec2.top &&
          recScreenContainer.bottom > rec2.bottom
        ) {
          beingInScreenContainer = true;

          // target.style.width = (rec2.width * self.state.scale) + 'px';
          // target.style.height = (rec2.height * self.state.scale) + 'px';
          // target.style.transitionDuration = '0.05s';

          setTimeout(() => {
            target.style.transitionDuration = "";
          }, 50);
        }

        if (
          beingInScreenContainer === true &&
          !(
            recScreenContainer.left < rec2.left &&
            recScreenContainer.right > rec2.right &&
            recScreenContainer.top < rec2.top &&
            recScreenContainer.bottom > rec2.bottom
          )
        ) {
          beingInScreenContainer = false;

          // target.style.width = (rec2.width / self.state.scale) + 'px';
          // target.style.height = (rec2.height / self.state.scale) + 'px';
          // target.style.transitionDuration = '0.05s';

          setTimeout(() => {
            target.style.transitionDuration = "";
          }, 50);
        }

        target.style.left = e.pageX - posX + "px";
        target.style.top = e.pageY - posY + "px";
        target.style.position = "absolute";
      }
    };

    const onUp = e => {
      dragging = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);

      var recs = document.getElementsByClassName("alo");
      var rec2 = self.imgDragging.getBoundingClientRect();
      for (var i = 0; i < recs.length; ++i) {
        var rec = recs[i].getBoundingClientRect();
        if (
          rec.left < rec2.right &&
          rec.right > rec2.left &&
          rec.top < rec2.bottom &&
          rec.bottom > rec2.top
        ) {
          let images = [...this.state.images];
          images.push({
            _id: uuidv4(),
            type: TemplateType.RemovedBackgroundImage,
            width: rec2.width / self.props.scale,
            height: rec2.height / self.props.scale,
            origin_width: rec2.width / self.props.scale,
            origin_height: rec2.height / self.props.scale,
            left: (rec2.left - rec.left) / self.props.scale,
            top: (rec2.top - rec.top) / self.props.scale,
            rotateAngle: 0.0,
            src: target.src,
            selected: false,
            scaleX: 1,
            scaleY: 1,
            posX: 0,
            posY: 0,
            imgWidth: rec2.width / self.props.scale,
            imgHeight: rec2.height / self.props.scale,
            page: this.props.pages[i],
            zIndex: this.props.upperZIndex + 1
          });

          this.props.images.replace(images);

          // self.setState({ images, upperZIndex: this.state.upperZIndex + 1, });
        }
      }

      self.imgDragging.remove();
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  textOnMouseDown(id, e) {
    var ce = document.createElement.bind(document);
    var ca = document.createAttribute.bind(document);
    var ge = document.getElementsByTagName.bind(document);

    e.preventDefault();
    var target = e.target.cloneNode(true);
    target.style.zIndex = "11111111111";
    target.style.width = e.target.getBoundingClientRect().width + "px";
    document.body.appendChild(target);
    var self = this;
    this.imgDragging = target;
    var posX = e.pageX - e.target.getBoundingClientRect().left;
    var dragging = true;
    var posY = e.pageY - e.target.getBoundingClientRect().top;

    const onMove = e => {
      if (dragging) {
        target.style.left = e.pageX - posX + "px";
        target.style.top = e.pageY - posY + "px";
        target.style.position = "absolute";
      }
    };

    const onUp = e => {
      dragging = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);

      var recs = document.getElementsByClassName("alo");
      var rec2 = this.imgDragging.getBoundingClientRect();
      for (var i = 0; i < recs.length; ++i) {
        var rec = recs[i].getBoundingClientRect();
        var rec3 = recs[i];
        if (
          rec.left < e.pageX &&
          e.pageX < rec.left + rec.width &&
          rec.top < e.pageY &&
          e.pageY < rec.top + rec.height
        ) {
          const url = `/api/Template/Get?id=${id}`;
          var rectTop = rec.top;
          var index = i;
          fetch(url)
            .then(response => response.text())
            .then(html => {
              var doc = this.state.groupedTexts.find(doc => doc.id == id);
              if (!doc) {
                doc = this.state.groupedTexts2.find(doc => doc.id == id);
              }
              var document = JSON.parse(doc.document);
              document._id = uuidv4();
              document.page = self.props.pages[index];
              document.zIndex = this.props.upperZIndex + 1;
              document.width = rec2.width / self.props.scale;
              document.height = rec2.height / self.props.scale;
              // document.width = rec2.width;
              // document.height = rec2.height;
              // document.origin_width = document.width / document.scaleX;
              // document.origin_height = document.height / document.scaleY;
              document.scaleX = document.width / document.origin_width;
              document.scaleY = document.height / document.origin_height;
              document.left = (rec2.left - rec.left) / self.props.scale;
              document.top = (rec2.top - rectTop) / self.props.scale;
              // document.scaleX = rec2.width / this.state.rectWidth;
              // document.scaleY = rec2.height / this.state.rectHeight;
              // document.scaleX = 1;
              // document.scaleY = 1;
              // document.document_object = document.document.map(obj => {
              //   // obj.childId = uuidv4();
              //   // obj._id = uuidv4();
              //   return obj;
              // })

              console.log("docuemnt ", document);

              let images = [...this.props.images, document];

              if (doc.fontList) {
                var fontList = doc.fontList.forEach(id => {
                  var style = `@font-face {
                      font-family: '${id}';
                      src: url('/fonts/${id}.ttf');
                    }`;
                  var styleEle = ce("style");
                  var type = ca("type");
                  type.value = "text/css";
                  styleEle.attributes.setNamedItem(type);
                  styleEle.innerHTML = style;
                  var head = document.head || ge("head")[0];
                  head.appendChild(styleEle);

                  var link = ce("link");
                  link.id = id;
                  link.rel = "preload";
                  link.href = `/fonts/${id}.ttf`;
                  link.media = "all";
                  link.as = "font";
                  link.crossOrigin = "anonymous";
                  head.appendChild(link);
                  return {
                    id: id
                  };
                });
              }

              this.props.images.replace(images);

              var fonts = toJS(this.props.fonts);
              fonts = [...fonts, ...doc.fontList];
              this.props.fonts.replace(fonts);

              // self.setState({
              //   fonts: doc.fontList,
              //   upperZIndex: this.state.upperZIndex + 1,
              // });
            });
        }
      }

      target.remove();
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  handleEditFont = item => {
    // this.setState({showFontEditPopup: true, editingFont: item})
  };

  templateOnMouseDown(id, e) {
    console.log("templateOnMouseDown");
    var ce = document.createElement.bind(document);
    var ca = document.createAttribute.bind(document);
    var ge = document.getElementsByTagName.bind(document);
    e.preventDefault();

    var self = this;
    const url = `/api/Template/Get?id=${id}`;
    const { rectWidth, rectHeight } = this.props;
    var doc = this.state.templates.find(doc => doc.id == id);
    if (!doc) {
      doc = this.state.templates2.find(doc => doc.id == id);
    }
    var template = JSON.parse(doc.document);
    var scaleX = rectWidth / template.width;
    var scaleY = rectHeight / template.height;

    template.document_object = template.document_object.map(doc => {
      doc.width = doc.width * scaleX;
      doc.height = doc.height * scaleY;
      doc.top = doc.top * scaleY;
      doc.left = doc.left * scaleX;
      doc.scaleX = doc.scaleX * scaleX;
      doc.scaleY = doc.scaleY * scaleY;
      doc.page = this.props.activePageId;
      doc.imgWidth = doc.imgWidth * scaleX;
      doc.imgHeight = doc.imgHeight * scaleY;

      return doc;
    });

    if (doc.fontList) {
      var fontList = doc.fontList.forEach(id => {
        var style = `@font-face {
                font-family: '${id}';
                src: url('/fonts/${id}.ttf');
              }`;
        var styleEle = ce("style");
        var type = ca("type");
        type.value = "text/css";
        styleEle.attributes.setNamedItem(type);
        styleEle.innerHTML = style;
        var head = document.head || ge("head")[0];
        head.appendChild(styleEle);

        var link = ce("link");
        link.id = id;
        link.rel = "preload";
        link.href = `/fonts/${id}.ttf`;
        link.media = "all";
        link.as = "font";
        link.crossOrigin = "anonymous";
        head.appendChild(link);
        return {
          id: id
        };
      });
    }

    var id = template.id;
    var images = toJS(this.props.images);
    images = images.filter(image => {
      return image.page !== this.props.activePageId;
    });

    images = [...images, ...template.document_object];
    this.props.images.replace(images);

    var fonts = toJS(this.props.fonts);
    fonts = [...fonts, ...doc.fontList];
    this.props.fonts.replace(fonts);

    // self.setState(state => ({
    //   fonts: doc.fontList,
    //   images: [...images, ...template.document_object],
    //   _id: id,
    //   idObjectSelected: null,
    // }));
    // });
  }

  setSelectionColor = (color, e) => {
    console.log("setSelectionColor ", this.props.typeObjectSelected, color);
    // if (this.props.typeObjectSelected === TemplateType.Latex) {
    var images = this.props.images.map(img => {
      if (img._id === this.props.idObjectSelected) {
        img.color = color;
        img.backgroundColor = color;
      }
      return img;
    });
    console.log("setSelectionColor 1");
    this.props.images.replace(images);
    // } else if (this.props.typeObjectSelected === TemplateType.Image || this.props.typeObjectSelected === TemplateType.BackgroundImage) {
    //   var images = this.props.images.map(img => {
    //     if (img._id === this.props.idObjectSelected) {
    //       img.backgroundColor = color;
    //     }
    //     return img;
    //   });

    //   console.log('setSelectionColor 2');
    //   this.props.images.replace(images);
    //   // this.setState({images});
    // }
    e.preventDefault();
    document.execCommand("foreColor", false, color);
    if (
      this.props.typeObjectSelected === TemplateType.Heading ||
      this.props.typeObjectSelected === TemplateType.TextTemplate
    ) {
      var a = document.getSelection();
      if (a && a.type === "Range") {
        this.props.handleFontColorChange(color);
      } else {
        var childId = this.props.childId
          ? this.props.childId
          : this.props.idObjectSelected;
        var el = this.props.childId
          ? document.getElementById(childId)
          : document.getElementById(childId).getElementsByClassName("text")[0];
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
        this.props.handleFontColorChange(color);
        document.execCommand("foreColor", false, color);
        sel.removeAllRanges();
      }
    }

    let images2 = toJS(this.props.images);
    console.log("images 4", images2);

    function insertAfter(newNode, referenceNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    var fonts = document.getElementsByTagName("font");
    for (var i = 0; i < fonts.length; ++i) {
      var font1: any = fonts[i];
      font1.parentNode.style.color = color;
      font1.parentNode.innerText = font1.innerText;
      font1.remove();
    }
  };

  loadMoreTemplate = (initalLoad, subtype) => {
    let pageId;
    let count;
    if (initalLoad) {
      pageId = 1;
      count = 10;
    } else {
      pageId =
        Math.round(
          (this.state.templates.length + this.state.templates2.length) / 5
        ) + 1;
      count = 5;
    }
    this.setState({ isTemplateLoading: true, error: undefined });
    var subtype = subtype ? subtype : this.props.subtype;
    const url = `/api/Template/Search?Type=${
      TemplateType.Template
    }&page=${pageId}&perPage=${count}&printType=${subtype}`;

    if (!subtype) {
      return;
    }

    console.log("loadmoretemplate url ", url, subtype, this.props.subtype);
    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          console.log("loadmoretemplate res", res);
          var result = res.value.key;
          var currentTemplatesHeight = this.state.currentTemplatesHeight;
          var currentTemplate2sHeight = this.state.currentTemplate2sHeight;
          var res1 = [];
          var res2 = [];
          for (var i = 0; i < result.length; ++i) {
            var currentItem = result[i];
            if (currentTemplatesHeight <= currentTemplate2sHeight) {
              res1.push(currentItem);
              currentTemplatesHeight +=
                imgWidth / (currentItem.width / currentItem.height);
            } else {
              res2.push(currentItem);
              currentTemplate2sHeight +=
                imgWidth / (currentItem.width / currentItem.height);
            }
          }
          this.setState(state => ({
            templates: [...state.templates, ...res1],
            templates2: [...state.templates2, ...res2],
            currentTemplatesHeight,
            currentTemplate2sHeight,
            isTemplateLoading: false,
            hasMoreTemplate: res.value.value > state.templates.length + state.templates2.length + res.value.key.length,
          }))
        },
        error => {
          // this.setState({ isLoading: false, error })
        }
      );
  };

  loadMoreBackground = initialload => {
    console.log("loadmorebackground");
    let pageId;
    let count;
    if (initialload) {
      pageId = 1;
      count = 30;
    } else {
      pageId =
        (this.state.backgrounds1.length +
          this.state.backgrounds2.length +
          this.state.backgrounds3.length) /
          5 +
        1;
      count = 15;
    }
    this.setState({ isBackgroundLoading: true, error: undefined });
    // const url = `https://api.unsplash.com/photos?page=1&&client_id=500eac178a285523539cc1ec965f8ee6da7870f7b8678ad613b4fba59d620c29&&query=${this.state.query}&&per_page=${count}&&page=${pageId}`;
    const url = `/api/Media/Search?type=${TemplateType.BackgroundImage}&page=${pageId}&perPage=${count}`;
    fetch(url)  
      .then(res => res.json())
      .then(
        res => {
          console.log("loadMoreBackground ress ", res);
          var result = res.value.key;
          var currentBackgroundHeights1 = this.state.currentBackgroundHeights1;
          var currentBackgroundHeights2 = this.state.currentBackgroundHeights2;
          var currentBackgroundHeights3 = this.state.currentBackgroundHeights3;
          var res1 = [];
          var res2 = [];
          var res3 = [];
          for (var i = 0; i < result.length; ++i) {
            var currentItem = result[i];
            if (
              currentBackgroundHeights1 <= currentBackgroundHeights2 &&
              currentBackgroundHeights1 <= currentBackgroundHeights3
            ) {
              res1.push(currentItem);
              currentBackgroundHeights1 +=
                backgroundWidth / (currentItem.width / currentItem.height);
            } else if (
              currentBackgroundHeights2 <= currentBackgroundHeights1 &&
              currentBackgroundHeights2 <= currentBackgroundHeights3
            ) {
              res2.push(currentItem);
              currentBackgroundHeights2 +=
                backgroundWidth / (currentItem.width / currentItem.height);
            } else {
              res3.push(currentItem);
              currentBackgroundHeights3 +=
                backgroundWidth / (currentItem.width / currentItem.height);
            }
          }
          this.setState(state => ({
            backgrounds1: [...state.backgrounds1, ...res1],
            backgrounds2: [...state.backgrounds2, ...res2],
            backgrounds3: [...state.backgrounds3, ...res3],
            currentBackgroundHeights1,
            currentBackgroundHeights2,
            currentBackgroundHeights3,
            isBackgroundLoading: false,
            hasMoreBackgrounds: res.value.value > state.items.length + state.items2.length + res.value.key.length,
          }))
        },
        error => {
          this.setState({ isBackgroundLoading: false, error });
        }
      );
  };

  loadMoreTextTemplate = initalLoad => {
    let pageId;
    let count;
    if (initalLoad) {
      pageId = 1;
      count = 10;
    } else {
      pageId =
        (this.state.groupedTexts.length + this.state.groupedTexts2.length) / 1 +
        1;
      count = 1;
    }
    this.setState({ isTextTemplateLoading: true, error: undefined });
    const url = `/api/Template/Search?Type=${TemplateType.TextTemplate}&page=${pageId}&perPage=${count}`;
    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          console.log('loadmoretexttemplate ', res);
          var result = res.value.key;
          var currentGroupedTextsHeight = this.state.currentGroupedTextsHeight;
          var currentGroupedTexts2Height = this.state
            .currentGroupedTexts2Height;
          var res1 = [];
          var res2 = [];
          for (var i = 0; i < result.length; ++i) {
            var currentItem = result[i];

            if (currentGroupedTextsHeight <= currentGroupedTexts2Height) {
              res1.push(currentItem);
              currentGroupedTextsHeight +=
                imgWidth / (currentItem.width / currentItem.height);
            } else {
              res2.push(currentItem);
              currentGroupedTexts2Height +=
                imgWidth / (currentItem.width / currentItem.height);
            }
          }
          this.setState(state => ({
            groupedTexts: [...state.groupedTexts, ...res1],
            groupedTexts2: [...state.groupedTexts2, ...res2],
            currentGroupedTextsHeight,
            currentGroupedTexts2Height,
            isTextTemplateLoading: false,
            hasMoreTextTemplate: res.value.value > state.groupedTexts.length + state.groupedTexts2.length + res.value.key.length,
          }))
        },
        error => {
          this.setState({ isTextTemplateLoading: false, error });
        }
      );
  };

  loadmoreUserUpload = initialload => {
    if (!Globals.serviceUser || !Globals.serviceUser.username) {
      this.setState(state => ({
        isUserUploadLoading: false,
        hasMoreUserUpload: false,
      }));
      return;
    }
    let pageId;
    let count;
    if (initialload) {
      pageId = 1;
      count = 15;
    } else {
      pageId =
        (this.state.userUpload1.length + this.state.userUpload2.length) / 15 +
        1;
      count = 15;
    }
    this.setState({ isUserUploadLoading: true, error: undefined });
    // const url = `https://api.unsplash.com/photos?page=1&&client_id=500eac178a285523539cc1ec965f8ee6da7870f7b8678ad613b4fba59d620c29&&query=${this.state.query}&&per_page=${count}&&page=${pageId}`;
    const url = `/api/Media/Search?type=${TemplateType.UserUpload}&page=${pageId}&perPage=${count}&userEmail=${Globals.serviceUser.username}`;
    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          console.log('loadmoreUserUpload res ', res);
          var result = res.value.key;
          var currentUserUpload1 = this.state.currentUserUpload1;
          var currentUserUpload2 = this.state.currentUserUpload2;
          var res1 = [];
          var res2 = [];
          for (var i = 0; i < result.length; ++i) {
            var currentItem = result[i];
            if (currentUserUpload1 <= currentUserUpload2) {
              res1.push(currentItem);
              currentUserUpload1 +=
                imgWidth / (currentItem.width / currentItem.height);
            } else {
              res2.push(currentItem);
              currentUserUpload2 +=
                imgWidth / (currentItem.width / currentItem.height);
            }
          }

          this.setState(state => ({
            userUpload1: [...state.userUpload1, ...res1],
            userUpload2: [...state.userUpload2, ...res2],
            currentUserUpload1,
            currentUserUpload2,
            isUserUploadLoading: false,
            hasMoreUserUpload:
              res.value.value >
              state.userUpload2.length +
                state.userUpload1.length +
                res.value.key.length
          }));
        },
        error => {
          this.setState({ isUserUploadLoading: false, error });
        }
      );
  };

  loadMoreRemovedBackgroundImage = (initialLoad: Boolean) => {
    let pageId;
    let count;
    if (initialLoad) {
      pageId = 1;
      count = 15;
    } else {
      pageId = (this.state.items.length + this.state.items2.length) / 15 + 1;
      count = 15;
    }
    this.setState({ isRemovedBackgroundImageLoading: true, error: undefined });
    // const url = `https://api.unsplash.com/photos?page=1&&client_id=500eac178a285523539cc1ec965f8ee6da7870f7b8678ad613b4fba59d620c29&&query=${this.state.query}&&per_page=${count}&&page=${pageId}`;
    const url = `/api/Media/Search?type=${TemplateType.RemovedBackgroundImage}&page=${pageId}&perPage=${count}&terms=${this.state.query}`;
    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          console.log("loadMoreRemovedBackgroundImage res", res);
          var result = res.value.key;
          var currentHeightRemoveImage1 = this.state.currentHeightRemoveImage1;
          var currentHeightRemoveImage2 = this.state.currentHeightRemoveImage2;
          var res1 = [];
          var res2 = [];
          for (var i = 0; i < result.length; ++i) {
            var currentItem = result[i];
            if (currentHeightRemoveImage1 <= currentHeightRemoveImage2) {
              res1.push(currentItem);
              currentHeightRemoveImage1 +=
                imgWidth / (currentItem.width / currentItem.height);
            } else {
              res2.push(currentItem);
              currentHeightRemoveImage2 +=
                imgWidth / (currentItem.width / currentItem.height);
            }
          }
          this.setState(state => ({
            removeImages1: [...state.removeImages1, ...res1],
            removeImages2: [...state.removeImages2, ...res2],
            currentHeightRemoveImage1,
            currentHeightRemoveImage2,
            isRemovedBackgroundImageLoading: false,
            hasMoreRemovedBackground:
              res.value.value >
              state.items.length + state.items2.length + res.value.key.length
          }));
        },
        error => {
          this.setState({ isRemovedBackgroundImageLoading: false, error });
        }
      );
  };

  loadMoreFont = initialLoad => {
    let pageId;
    let count;
    if (initialLoad) {
      pageId = 1;
      count = 30;
    } else {
      pageId = this.props.fontsList.length / 30 + 1;
      count = 30;
    }
    // this.setState({ isLoading: true, error: undefined });
    const url = `/api/Font/Search?page=${pageId}&perPage=${count}`;
    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          // this.setState(state => ({
          //   fontsList: [...state.fontsList, ...res.value.key],
          //   totalFonts: res.value.value,
          //   hasMoreFonts: res.value.value > state.fontsList.length + res.value.key.length,
          // }));

          for (var i = 0; i < res.value.key.length; ++i) {
            this.props.addFontItem(res.value.key[i]);
          }
        },
        error => {
          // this.setState({ isLoading: false, error })
        }
      );
  };

  render() {
    return (
      <div
        style={{
          left: "-1px",
          backgroundColor: "#293039",
          flexDirection: "row",
          zIndex: 11111,
          width: this.props.toolbarOpened
            ? `${this.props.toolbarSize}px`
            : "80px",
          height: "100%",
          position: "absolute",
          display: "flex"
        }}
      >
        <TopMenu
          mode={this.props.mode}
          toolbarSize={this.props.toolbarSize}
          selectedTab={this.props.selectedTab}
          onClick={this.props.handleSidebarSelectorClicked}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            zIndex: 1111111112,
            backgroundColor: "white",
            width: "100%",
            display:
              Globals.serviceUser &&
              Globals.serviceUser.username &&
              Globals.serviceUser.username === adminEmail
                ? "block"
                : "none"
          }}
        >
          <input
            id="image-file"
            type="file"
            onLoad={data => {}}
            onLoadedData={data => {}}
            onChange={e => {
              this.props.selectedTab === SidebarTab.Video
                ? this.uploadVideo()
                : this.props.selectedTab === SidebarTab.Font
                ? this.uploadFont(e)
                : this.uploadImage(
                    this.props.selectedTab === SidebarTab.Image
                      ? TemplateType.Image
                      : this.props.selectedTab === SidebarTab.Upload
                      ? TemplateType.UserUpload
                      : this.props.selectedTab === SidebarTab.Background
                      ? TemplateType.BackgroundImage
                      : this.props.selectedTab ===
                        SidebarTab.RemovedBackgroundImage
                      ? TemplateType.RemovedBackgroundImage
                      : TemplateType.RemovedBackgroundImage,
                    false,
                    e
                  );
            }}
            style={{
              bottom: 0
            }}
          />
          <button
            style={{
              bottom: 0
            }}
            type="submit"
            onClick={
              this.props.selectedTab === SidebarTab.Font
                ? this.uploadFont.bind(this)
                : this.uploadImage.bind(
                    this,
                    this.props.selectedTab === SidebarTab.Image
                      ? TemplateType.Image
                      : TemplateType.BackgroundImage,
                    false
                  )
            }
          >
            Upload
          </button>
          <button
            style={{
              bottom: 0,
              right: 0
            }}
            onClick={this.handleRemoveAllMedia.bind(this)}
          >
            RemoveAll
          </button>
        </div>
        {this.props.toolbarOpened && (
          <div
            id="sidebar-content"
            style={{
              position: "relative",
              height: `calc(100% - ${
                Globals.serviceUser &&
                Globals.serviceUser.username &&
                Globals.serviceUser.username == adminEmail
                  ? 78
                  : 0
              }px)`,
              width: "370px",
              padding: "10px 5px 0px 18px",
              transitionDuration: "10s, 10s"
            }}
          >
            <div
              style={{
                opacity: this.props.selectedTab === SidebarTab.Image ? 1 : 0,
                position: "absolute",
                width: "347px",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  this.props.selectedTab !== SidebarTab.Image &&
                  `translate3d(0px, calc(-${
                    this.props.selectedTab > SidebarTab.Image ? 40 : -40
                  }px), 0px)`,
                zIndex: this.props.selectedTab !== SidebarTab.Image && -1,
                top: "10px",
                height: "100%"
              }}
            >
              <div
                style={{
                  zIndex: 123
                }}
              >
                <InfiniteScroll
                  scroll={true}
                  throttle={500}
                  threshold={300}
                  isLoading={this.state.isLoading}
                  hasMore={this.state.hasMoreImage}
                  onLoadMore={this.loadMore.bind(this, false)}
                  refId="sentinel"
                  marginTop={30}
                >
                  <div
                    id="image-container-picker"
                    style={{ display: "flex", padding: "16px 13px 10px 0px" }}
                  >
                    <div
                      style={{
                        height: "calc(100% - 170px)",
                        width: "350px",
                        marginRight: "10px"
                      }}
                    >
                      {this.state.items.map((item, key) => (
                        <ImagePicker
                          id=""
                          key={key}
                          color={item.color}
                          src={item.representativeThumbnail}
                          height={imgWidth / (item.width / item.height)}
                          defaultHeight={imgWidth}
                          width={imgWidth}
                          className=""
                          onPick={this.imgOnMouseDown.bind(this, item)}
                          onEdit={this.handleEditmedia.bind(this, item)}
                          delay={0}
                        />
                      ))}
                      {this.state.mounted &&
                        this.state.hasMoreImage &&
                        Array(1)
                          .fill(0)
                          .map((item, i) => (
                            <ImagePicker
                              key={i}
                              id="sentinel"
                              color="black"
                              src={""}
                              height={imgWidth}
                              defaultHeight={imgWidth}
                              width={imgWidth}
                              className=""
                              onPick={this.imgOnMouseDown.bind(this, null)}
                              onEdit={this.handleEditmedia.bind(this, null)}
                              delay={0}
                            />
                          ))}
                      {this.state.mounted &&
                        this.state.hasMoreImage &&
                        Array(10)
                          .fill(0)
                          .map((item, i) => (
                            <ImagePicker
                              key={i}
                              id="sentinel"
                              color="black"
                              src={""}
                              height={imgWidth}
                              defaultHeight={imgWidth}
                              width={imgWidth}
                              className=""
                              onPick={this.imgOnMouseDown.bind(this, null)}
                                onEdit={this.handleEditmedia.bind(this, null)}
                              delay={0}
                            />
                          ))}
                    </div>
                    <div
                      style={{
                        height: "calc(100% - 170px)",
                        width: "350px"
                      }}
                    >
                      {this.state.items2.map((item, key) => (
                        <ImagePicker
                          id=""
                          key={key}
                          color={item.color}
                          src={item.representativeThumbnail}
                          height={imgWidth / (item.width / item.height)}
                          defaultHeight={imgWidth}
                          width={imgWidth}
                          className=""
                          onPick={this.imgOnMouseDown.bind(this, item)}
                          onEdit={this.handleEditmedia.bind(this, item)}
                          delay={-1}
                        />
                      ))}
                      {this.state.mounted &&
                        this.state.hasMoreImage &&
                        Array(1)
                          .fill(0)
                          .map((item, i) => (
                            <ImagePicker
                              key={i}
                              id="sentinel"
                              color="black"
                              src={""}
                              height={imgWidth}
                              defaultHeight={imgWidth}
                              width={imgWidth}
                              className=""
                              onPick={this.imgOnMouseDown.bind(this, null)}
                              onEdit={this.handleEditmedia.bind(this, null)}
                              delay={-1}
                            />
                          ))}
                      {this.state.mounted &&
                        this.state.hasMoreImage &&
                        Array(10)
                          .fill(0)
                          .map((item, i) => (
                            <ImagePicker
                              key={i}
                              id="sentinel"
                              color="black"
                              src={""}
                              height={imgWidth}
                              defaultHeight={imgWidth}
                              width={imgWidth}
                              className=""
                              onPick={this.imgOnMouseDown.bind(this, null)}
                              onEdit={this.handleEditmedia.bind(this, null)}
                              delay={-1}
                            />
                          ))}
                    </div>
                  </div>
                </InfiniteScroll>
                <input
                  style={{
                    zIndex: 11,
                    width: "calc(100% - 13px)",
                    marginBottom: "8px",
                    border: "none",
                    height: "37px",
                    borderRadius: "3px",
                    padding: "5px",
                    fontSize: "13px",
                    boxShadow:
                      "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
                    position: "absolute",
                    top: 0
                  }}
                  onKeyDown={this.handleQuery}
                  type="text"
                  onChange={e => {
                    this.setState({ query: e.target.value });
                  }}
                  value={this.state.query}
                />
              </div>
            </div>
            <div
              style={{
                opacity: this.props.selectedTab === SidebarTab.Text ? 1 : 0,
                position: "absolute",
                width: "347px",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  this.props.selectedTab !== SidebarTab.Text &&
                  `translate3d(0px, calc(${
                    this.props.selectedTab < SidebarTab.Text ? 40 : -40
                  }px), 0px)`,
                top: "10px",
                zIndex: this.props.selectedTab !== SidebarTab.Text && -1,
                height: "100%"
              }}
            >
              <div style={{ color: "white" }}>
                <div style={{ marginBottom: "10px" }}>
                  <p>Nhấn để thêm chữ vào trang</p>
                  {/* <div
              style={{
                fontSize: '28px',
                width: '100%',
                cursor: 'pointer',
              }}
              onMouseDown={(e) => {
                e.preventDefault();

                var _id = uuidv4();

                let images = this.state.images.map(img => {
                  if (img._id === this.props.idObjectSelected) {
                    img.childId = _id;
                  }
                  return img;
                });

                var scale = this.props.rectWidth / e.target.getBoundingClientRect().width;

                this.props.addItem({
                    _id,
                    type: TemplateType.Latex,
                    width: 200 * scale,
                    origin_width: 200,
                    height: 40 * scale,
                    origin_height: 40,
                    left: 0,
                    top: 0,
                    rotateAngle: 0.0,
                    innerHTML: "Phương trình: $$ f(x) = x^2 $$",
                    scaleX: scale,
                    scaleY: scale,
                    selected: false,
                    ref: this.props.idObjectSelected,
                    page: this.props.activePageId,
                    zIndex: this.state.upperZIndex + 1,
                    width2: 1,
                    height2: 1,
                    document_object: [],
                    color: null,
                    opacity: 100,
                    backgroundColor: null,
                    posX: 0,
                    posY: 0,
                    imgHeight: 0,
                    imgWidth: 0,
                    src: null,
                    childId: null,
                });

                this.setState({ upperZIndex: this.state.upperZIndex + 1 });
              }}
            >
                Thêm LaTeX
            </div> */}
                  <div
                    style={{
                      fontSize: "28px",
                      width: "100%",
                      cursor: "pointer"
                    }}
                    onMouseDown={e => {
                      e.preventDefault();
                      var _id = uuidv4();
                      let images = this.props.images.map(img => {
                        if (img._id === this.props.idObjectSelected) {
                          img.childId = _id;
                        }
                        return img;
                      });
                      var scale =
                        this.props.rectWidth /
                        (e.target as HTMLElement).getBoundingClientRect().width;

                      images.push({
                        _id,
                        type: TemplateType.Heading,
                        width: 300 * 1,
                        origin_width: 300,
                        height: 60 * 1,
                        origin_height: 60,
                        left: 0,
                        top: 0,
                        rotateAngle: 0.0,
                        innerHTML:
                          '<div class="font" style="text-align: left;font-size: 42px; font-family: AvenirNextRoundedPro;">Thêm tiêu đề</div>',
                        scaleX: 1,
                        scaleY: 1,
                        selected: false,
                        ref: this.props.idObjectSelected,
                        page: this.props.activePageId,
                        zIndex: this.props.upperZIndex + 1,
                        color: "black",
                        fontSize: 42,
                        fontRepresentative: "images/default.png",
                      });

                      console.log("images ", images);

                      this.props.images.replace(images);

                      // this.setState({ images, upperZIndex: this.state.upperZIndex + 1 });
                    }}
                  >
                    Thêm tiêu đề
                  </div>
                  <div
                    style={{
                      fontSize: "22px",
                      width: "100%",
                      cursor: "pointer"
                    }}
                    onMouseDown={e => {
                      e.preventDefault();
                      var _id = uuidv4();
                      let images = this.props.images.map(img => {
                        if (img._id === this.props.idObjectSelected) {
                          img.childId = _id;
                        }
                        return img;
                      });
                      var scale =
                        this.props.rectWidth /
                          (e.target as HTMLElement).getBoundingClientRect().width -
                        0.3;

                      images.push({
                        _id,
                        type: TemplateType.Heading,
                        width: 200 * 1,
                        origin_width: 200,
                        height: 32 * 1,
                        origin_height: 32,
                        left: 0,
                        top: 0,
                        rotateAngle: 0.0,
                        innerHTML:
                          '<div class="font" style="text-align: left;font-size: 24px; font-family: AvenirNextRoundedPro;">Thêm tiêu đề con</div>',
                        scaleX: 1,
                        scaleY: 1,
                        page: this.props.activePageId,
                        zIndex: 1,
                        ref: this.props.idObjectSelected,
                        color: "black",
                        fontSize: 24,
                        fontRepresentative: "images/default.png",
                      });

                      this.props.images.replace(images);

                      // thi`s`.setState({ upperZIndex: this.state.upperZIndex + 1 });
                    }}
                  >
                    Thêm tiêu đề con
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      width: "100%",
                      cursor: "pointer",
                      marginTop: "7px"
                    }}
                    onMouseDown={e => {
                      e.preventDefault();
                      var _id = uuidv4();
                      let images = this.props.images.map(img => {
                        if (img._id === this.props.idObjectSelected) {
                          img.childId = _id;
                        }
                        return img;
                      });
                      var scale =
                        this.props.rectWidth /
                        (e.target as HTMLElement).getBoundingClientRect().width -
                        0.6;
                      images.push({
                        _id,
                        type: TemplateType.Heading,
                        width: 200 * 1,
                        origin_width: 200,
                        height: 22 * 1,
                        origin_height: 22,
                        left: 0,
                        top: 0,
                        rotateAngle: 0.0,
                        innerHTML:
                          '<div class="font" style="text-align: left;font-size: 16px; font-family: AvenirNextRoundedPro;">Thêm đoạn văn</div>',
                        scaleX: 1,
                        scaleY: 1,
                        page: this.props.activePageId,
                        zIndex: this.props.upperZIndex + 1,
                        ref: this.props.idObjectSelected,
                        color: "black",
                        fontSize: 16,
                        fontRepresentative: "images/default.png",
                      });

                      this.props.images.replace(images);

                      // this.setState({
                      //   upperZIndex: this.state.upperZIndex + 1
                      // });
                    }}
                  >
                    Thêm đoạn văn
                  </div>
                </div>
                {
                  <div style={{ height: "calc(100% - 152px)" }}>
                    <InfiniteScroll
                      scroll={true}
                      throttle={500}
                      threshold={300}
                      isLoading={this.state.isTemplateLoading}
                      hasMore={this.state.hasMoreTextTemplate}
                      onLoadMore={this.loadMoreTextTemplate.bind(this, false)}
                      refId="sentinel"
                      marginTop={0}
                    >
                      <div
                        id="image-container-picker"
                        style={{
                          display: "flex",
                          padding: "0px 13px 10px 0px"
                        }}
                      >
                        <div
                          style={{
                            width: "350px",
                            marginRight: "10px"
                          }}
                        >
                          {this.state.groupedTexts.map((item, key) => (
                            <ImagePicker
                              id=""
                              key={key}
                              color={item.color}
                              src={item.representative}
                              height={imgWidth / (item.width / item.height)}
                              defaultHeight={imgWidth}
                              width={imgWidth}
                              delay={0}
                              className="text-picker"
                              onPick={this.textOnMouseDown.bind(this, item.id)}
                              onEdit={() => {
                                // this.setState({
                                //   showTemplateEditPopup: true,
                                //   editingMedia: item
                                // });
                              }}
                            />
                          ))}
                          {this.state.hasMoreTextTemplate &&
                      Array(1)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            key={i}
                            id="sentinel"
                            color="black"
                            src={""}
                            height={imgWidth}
                            width={imgWidth}
                            defaultHeight={imgWidth}
                            className=""
                            onPick={this.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={0}
                          />
                        ))}
                    {this.state.hasMoreTextTemplate &&
                      Array(10)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            key={i}
                            id="sentinel"
                            color="black"
                            src={""}
                            height={imgWidth}
                            width={imgWidth}
                            defaultHeight={imgWidth}
                            className=""
                            onPick={this.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={0}
                          />
                        ))}
                        </div>
                        <div
                          style={{
                            width: "350px"
                          }}
                        >
                          {this.state.groupedTexts2.map((item, key) => (
                            <ImagePicker
                              id=""
                              defaultHeight={imgWidth}
                              delay={0}
                              width={imgWidth}
                              key={key}
                              color={item.color}
                              className="text-picker"
                              height={imgWidth / (item.width / item.height)}
                              src={item.representative}
                              onPick={this.textOnMouseDown.bind(this, item.id)}
                              onEdit={() => {
                                // this.setState({
                                //   showTemplateEditPopup: true,
                                //   editingMedia: item
                                // });
                              }}
                            />
                          ))}
                          {this.state.hasMoreTextTemplate &&
                      Array(1)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            key={i}
                            id="sentinel"
                            color="black"
                            src={""}
                            height={imgWidth}
                            width={imgWidth}
                            defaultHeight={imgWidth}
                            className=""
                            onPick={this.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={-1}
                          />
                        ))}
                    {this.state.hasMoreTextTemplate &&
                      Array(10)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            key={i}
                            id="sentinel"
                            color="black"
                            src={""}
                            height={imgWidth}
                            width={imgWidth}
                            defaultHeight={imgWidth}
                            className=""
                            onPick={this.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={-1}
                          />
                        ))}
                        </div>
                      </div>
                    </InfiniteScroll>
                  </div>
                }
              </div>
            </div>
            <div
              style={{
                opacity: this.props.selectedTab === SidebarTab.Template ? 1 : 0,
                position: "absolute",
                width: "347px",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  this.props.selectedTab !== SidebarTab.Template &&
                  `translate3d(0px, calc(${
                    this.props.selectedTab < SidebarTab.Template ? 40 : -40
                  }px), 0px)`,
                top: "10px",
                zIndex: this.props.selectedTab !== SidebarTab.Template && -1,
                height: "100%"
              }}
            >
              <InfiniteScroll
                scroll={true}
                throttle={500}
                threshold={300}
                isLoading={this.state.isTemplateLoading}
                hasMore={this.state.hasMoreTemplate}
                onLoadMore={this.loadMoreTemplate.bind(this, false)}
                marginTop={30}
                refId="sentinel"
              >
                <div
                  id="image-container-picker"
                  style={{ display: "flex", padding: "16px 13px 10px 0px" }}
                >
                  <div
                    style={{
                      width: "350px",
                      marginRight: "10px"
                    }}
                  >
                    {this.state.templates.map((item, key) => (
                      <ImagePicker
                        id=""
                        defaultHeight={imgWidth}
                        delay={0}
                        width={imgWidth}
                        key={key}
                        color={item.color}
                        src={item.representative}
                        height={imgWidth / (item.width / item.height)}
                        className="template-picker"
                        onPick={this.templateOnMouseDown.bind(this, item.id)}
                        onEdit={() => {
                          // this.setState({
                          //   showTemplateEditPopup: true,
                          //   editingMedia: item
                          // });
                        }}
                      />
                    ))}
                    {this.state.hasMoreTemplate &&
                      Array(1)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            key={i}
                            id="sentinel"
                            color="black"
                            src={""}
                            height={imgWidth}
                            width={imgWidth}
                            defaultHeight={imgWidth}
                            className=""
                            onPick={this.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={0}
                          />
                        ))}
                    {this.state.hasMoreTemplate &&
                      Array(10)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            key={i}
                            id="sentinel"
                            color="black"
                            src={""}
                            height={imgWidth}
                            width={imgWidth}
                            defaultHeight={imgWidth}
                            className=""
                            onPick={this.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={0}
                          />
                        ))}
                  </div>
                  <div
                    style={{
                      width: "350px"
                    }}
                  >
                    {this.state.templates2.map((item, key) => (
                      <ImagePicker
                        id=""
                        defaultHeight={imgWidth}
                        delay={0}
                        width={imgWidth}
                        key={key}
                        color={item.color}
                        className="template-picker"
                        height={imgWidth / (item.width / item.height)}
                        src={item.representative}
                        onPick={this.templateOnMouseDown.bind(this, item.id)}
                        onEdit={() => {
                          // this.setState({
                          //   showTemplateEditPopup: true,
                          //   editingMedia: item
                          // });
                        }}
                      />
                    ))}
                    {this.state.hasMoreTemplate &&
                      Array(1)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            key={i}
                            id="sentinel"
                            color="black"
                            src={""}
                            height={imgWidth}
                            width={imgWidth}
                            defaultHeight={imgWidth}
                            className=""
                            onPick={this.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={-1}
                          />
                        ))}
                    {this.state.hasMoreTemplate &&
                      Array(10)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            key={i}
                            id="sentinel"
                            color="black"
                            src={""}
                            height={imgWidth}
                            width={imgWidth}
                            defaultHeight={imgWidth}
                            className=""
                            onPick={this.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={-1}
                          />
                        ))}
                  </div>
                </div>
              </InfiniteScroll>
              <input
                style={{
                  zIndex: 11,
                  width: "calc(100% - 13px)",
                  marginBottom: "8px",
                  border: "none",
                  height: "37px",
                  borderRadius: "3px",
                  padding: "5px",
                  fontSize: "13px",
                  boxShadow:
                    "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
                  position: "absolute",
                  top: 0
                }}
                onKeyDown={this.handleQuery}
                type="text"
                onChange={e => {
                  this.setState({ query: e.target.value });
                }}
                value={this.state.query}
              />
            </div>
            <div
              style={{
                opacity:
                  this.props.selectedTab === SidebarTab.Background ? 1 : 0,
                position: "absolute",
                width: "347px",
                color: "white",
                overflow: "scroll",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  this.props.selectedTab !== SidebarTab.Background &&
                  `translate3d(0px, calc(${
                    this.props.selectedTab < SidebarTab.Background ? 40 : -40
                  }px), 0px)`,
                top: "10px",
                zIndex: this.props.selectedTab !== SidebarTab.Background && -1,
                height: "100%"
              }}
            >
              <InfiniteScroll
                scroll={true}
                throttle={100}
                threshold={0}
                isLoading={this.state.isBackgroundLoading}
                hasMore={this.state.hasMoreBackgrounds}
                onLoadMore={this.loadMoreBackground.bind(this, false)}
                refId="sentinel"
                marginTop={0}
              >
                <div
                  id="image-container-picker"
                  style={{
                    display: "flex",
                    padding: "0px 13px 10px 0px"
                  }}
                >
                  <div
                    style={{
                      width: "350px",
                      marginRight: "10px"
                    }}
                  >
                    {this.state.backgrounds1.map((item, key) => (
                      <ImagePicker
                        className=""
                        id=""
                        delay={0}
                        width={backgroundWidth}
                        key={key}
                        color={item.color}
                        src={item.representativeThumbnail}
                        height={backgroundWidth / (item.width / item.height)}
                        defaultHeight={backgroundWidth}
                        onPick={this.backgroundOnMouseDown.bind(this, item)}
                        onEdit={this.handleEditmedia.bind(this, item)}
                      />
                    ))}
                    {this.state.hasMoreBackgrounds &&
                      Array(1)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            key={i}
                            id="sentinel"
                            color="black"
                            src={""}
                            height={backgroundWidth}
                            width={backgroundWidth}
                            defaultHeight={backgroundWidth}
                            className=""
                            onPick={this.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={0}
                          />
                        ))}
                    {this.state.hasMoreBackgrounds &&
                      Array(10)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            key={i}
                            id="sentinel"
                            color="black"
                            src={""}
                            height={backgroundWidth}
                            width={backgroundWidth}
                            defaultHeight={backgroundWidth}
                            className=""
                            onPick={this.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={0}
                          />
                        ))}
                  </div>
                  <div
                    style={{
                      width: "350px",
                      marginRight: "10px"
                    }}
                  >
                    {this.state.backgrounds2.map((item, key) => (
                      <ImagePicker
                        className=""
                        width={backgroundWidth}
                        id=""
                        key={key}
                        color={item.color}
                        src={item.representativeThumbnail}
                        height={backgroundWidth / (item.width / item.height)}
                        defaultHeight={backgroundWidth}
                        onPick={this.backgroundOnMouseDown.bind(this, item)}
                        onEdit={this.handleEditmedia.bind(this, item)}
                        delay={-1}
                      />
                    ))}
                    {this.state.hasMoreBackgrounds &&
                      Array(1)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            key={i}
                            id="sentinel"
                            color="black"
                            src={""}
                            height={backgroundWidth}
                            defaultHeight={backgroundWidth}
                            className=""
                            width={backgroundWidth}
                            onPick={this.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={-1}
                          />
                        ))}
                    {this.state.hasMoreBackgrounds &&
                      Array(10)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            key={i}
                            id="sentinel"
                            color="black"
                            src={""}
                            height={backgroundWidth}
                            width={backgroundWidth}
                            defaultHeight={backgroundWidth}
                            className=""
                            onPick={this.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={-1}
                          />
                        ))}
                  </div>
                  <div
                    style={{
                      width: "350px"
                    }}
                  >
                    {this.state.backgrounds3.map((item, key) => (
                      <ImagePicker
                        id=""
                        className=""
                        key={key}
                        color={item.color}
                        src={item.representativeThumbnail}
                        height={backgroundWidth / (item.width / item.height)}
                        width={backgroundWidth}
                        defaultHeight={backgroundWidth}
                        onPick={this.backgroundOnMouseDown.bind(this, item)}
                        onEdit={this.handleEditmedia.bind(this, item)}
                        delay={-2}
                      />
                    ))}
                    {this.state.hasMoreBackgrounds &&
                      Array(1)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            key={i}
                            id="sentinel"
                            color="black"
                            src={""}
                            height={backgroundWidth}
                            defaultHeight={backgroundWidth}
                            width={backgroundWidth}
                            className=""
                            onPick={this.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={-2}
                          />
                        ))}
                    {this.state.hasMoreBackgrounds &&
                      Array(10)
                        .fill(0)
                        .map((item, i) => (
                          <ImagePicker
                            key={i}
                            id="sentinel"
                            color="black"
                            src={""}
                            height={backgroundWidth}
                            defaultHeight={backgroundWidth}
                            width={backgroundWidth}
                            className=""
                            onPick={this.imgOnMouseDown.bind(this, null)}
                            onEdit={this.handleEditmedia.bind(this, null)}
                            delay={-2}
                          />
                        ))}
                  </div>
                </div>
              </InfiniteScroll>
            </div>
            <div
              style={{
                opacity: this.props.selectedTab === SidebarTab.Font ? 1 : 0,
                position: "absolute",
                width: "347px",
                color: "white",
                overflow: "scroll",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  this.props.selectedTab !== SidebarTab.Font &&
                  `translate3d(0px, calc(${
                    this.props.selectedTab < SidebarTab.Font ? 40 : -40
                  }px), 0px)`,
                top: "10px",
                zIndex: this.props.selectedTab !== SidebarTab.Font && -1,
                height: "100%"
              }}
            >
              <div>
                <div
                  style={{
                    height: "100%"
                  }}
                >
                  <InfiniteScroll
                    scroll={true}
                    throttle={500}
                    threshold={300}
                    isLoading={false}
                    hasMore={this.state.hasMoreFonts}
                    onLoadMore={this.loadMoreFont.bind(this, false)}
                    refId=""
                    marginTop={0}
                  >
                    <div id="image-container-picker">
                      <div
                        style={{
                          marginRight: "10px"
                        }}
                      >
                        {this.props.fontsList.map((font, key) => (
                          <button
                            className="font-picker"
                            style={{
                              display: "flex",
                              position: "relative",
                              width: "100%",
                              border: "none",
                              backgroundColor: "transparent"
                            }}
                            onClick={e => {
                              this.props.selectFont(font.id, e);
                            }}
                          >
                            {Globals.serviceUser &&
                              Globals.serviceUser.username &&
                              Globals.serviceUser.username == adminEmail && (
                                <button
                                  style={{
                                    position: "absolute",
                                    top: "5px",
                                    left: "5px",
                                    borderRadius: "13px",
                                    border: "none",
                                    padding: "0 4px",
                                    boxShadow:
                                      "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
                                  }}
                                  onClick={this.handleEditFont.bind(this, font)}
                                >
                                  <span>
                                    <svg
                                      width="25"
                                      height="25"
                                      viewBox="0 0 16 16"
                                    >
                                      <defs>
                                        <path
                                          id="_2658783389__a"
                                          d="M3.25 9.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm4.75 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"
                                        ></path>
                                      </defs>
                                      <use
                                        fill="black"
                                        xlinkHref="#_2658783389__a"
                                        fill-rule="evenodd"
                                      ></use>
                                    </svg>
                                  </span>
                                </button>
                              )}
                            <img
                              style={{
                                height: "25px",
                                margin: "auto"
                              }}
                              src={font.representative}
                            />
                            {this.props.fontId === font.id ? (
                              <span
                                style={{
                                  position: "absolute",
                                  float: "right",
                                  width: "25px",
                                  height: "25px",
                                  right: "10px"
                                }}
                              >
                                <svg
                                  style={{ fill: "white" }}
                                  version="1.1"
                                  viewBox="0 0 44 44"
                                  enable-background="new 0 0 44 44"
                                >
                                  <path d="m22,0c-12.2,0-22,9.8-22,22s9.8,22 22,22 22-9.8 22-22-9.8-22-22-22zm12.7,15.1l0,0-16,16.6c-0.2,0.2-0.4,0.3-0.7,0.3-0.3,0-0.6-0.1-0.7-0.3l-7.8-8.4-.2-.2c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5 0.3-0.7l1.4-1.4c0.4-0.4 1-0.4 1.4,0l.1,.1 5.5,5.9c0.2,0.2 0.5,0.2 0.7,0l13.4-13.9h0.1c0.4-0.4 1-0.4 1.4,0l1.4,1.4c0.4,0.3 0.4,0.9 0,1.3z" />
                                </svg>
                              </span>
                            ) : null}
                          </button>
                        ))}
                      </div>
                    </div>
                  </InfiniteScroll>
                </div>
              </div>
            </div>
            <div
              style={{
                opacity: this.props.selectedTab === SidebarTab.Color ? 1 : 0,
                position: "absolute",
                width: "347px",
                color: "white",
                overflow: "scroll",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  this.props.selectedTab !== SidebarTab.Color &&
                  `translate3d(0px, calc(${
                    this.props.selectedTab < SidebarTab.Color ? 40 : -40
                  }px), 0px)`,
                top: "10px",
                zIndex: this.props.selectedTab !== SidebarTab.Color && -1,
                height: "98%"
              }}
            >
              <div style={{ display: "inline-block" }}>
                <p style={{ margin: "5px" }}>Chọn nhanh</p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0
                  }}
                >
                  {fontColors.map(font => (
                    <a
                      href="#"
                      onClick={this.setSelectionColor.bind(this, font)}
                    >
                      <li
                        style={{
                          width: "25px",
                          height: "25px",
                          backgroundColor: font,
                          float: "left",
                          marginLeft: "5px",
                          marginTop: "5px"
                        }}
                      ></li>
                    </a>
                  ))}
                </ul>
              </div>
              <div style={{ display: "inline-block" }}>
                <p style={{ margin: "5px" }}>Tất cả các màu</p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0
                  }}
                >
                  {allColors.map(font => (
                    <a
                      href="#"
                      onClick={this.setSelectionColor.bind(this, font)}
                    >
                      <li
                        style={{
                          width: "25px",
                          height: "25px",
                          backgroundColor: font,
                          float: "left",
                          marginLeft: "5px",
                          marginTop: "5px"
                        }}
                      ></li>
                    </a>
                  ))}
                </ul>
              </div>
            </div>
            {/* <div
              style={{
                opacity:
                  this.props.selectedTab === SidebarTab.RemovedBackgroundImage
                    ? 1
                    : 0,
                position: "absolute",
                width: "347px",
                color: "white",
                overflow: "scroll",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  this.props.selectedTab !==
                    SidebarTab.RemovedBackgroundImage &&
                  `translate3d(0px, calc(${
                    this.props.selectedTab < SidebarTab.RemovedBackgroundImage
                      ? 40
                      : -40
                  }px), 0px)`,
                top: "10px",
                zIndex:
                  this.props.selectedTab !==
                    SidebarTab.RemovedBackgroundImage && -1,
                height: "100%"
              }}
            >
              <InfiniteScroll
                scroll={true}
                throttle={500}
                threshold={300}
                isLoading={this.state.isRemovedBackgroundImageLoading}
                hasMore={this.state.hasMoreRemovedBackground}
                onLoadMore={this.loadMoreRemovedBackgroundImage.bind(
                  this,
                  false
                )}
              >
                <div
                  style={{
                    color: "white",
                    overflow: "scroll",
                    width: "100%"
                  }}
                >
                  <div style={{ display: "inline-block", width: "100%" }}>
                    <button
                      style={{
                        width: "calc(100% - 13px)",
                        backgroundColor: "white",
                        border: "none",
                        color: "black",
                        padding: "10px",
                        borderRadius: "5px",
                        height: "37px"
                      }}
                      onClick={() => {
                        document.getElementById("image-file").click();
                      }}
                    >
                      Tải lên một hình ảnh
                    </button>
                    <div
                      style={{
                        display: "flex",
                        marginTop: "10px",
                        overflow: "scroll"
                      }}
                    >
                      <div
                        style={{
                          width: "350px",
                          marginRight: "10px"
                        }}
                      >
                        {this.state.removeImages1.map((item, key) => (
                          <ImagePicker
                            key={key}
                            src={item.representative}
                            onPick={this.imgOnMouseDown.bind(this, item)}
                            onEdit={this.handleEditmedia.bind(this, item)}
                          />
                        ))}
                      </div>
                      <div
                        style={{
                          width: "350px",
                          marginRight: "10px"
                        }}
                      >
                        {this.state.removeImages2.map((item, key) => (
                          <ImagePicker
                            key={key}
                            src={item.representative}
                            onPick={this.imgOnMouseDown.bind(this, item)}
                            onEdit={this.handleEditmedia.bind(this, item)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </InfiniteScroll>
            </div> */}
            <div
              style={{
                opacity: this.props.selectedTab === SidebarTab.Element ? 1 : 0,
                position: "absolute",
                width: "347px",
                color: "white",
                overflow: "scroll",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  this.props.selectedTab !== SidebarTab.Element &&
                  `translate3d(0px, calc(${
                    this.props.selectedTab < SidebarTab.Element ? 40 : -40
                  }px), 0px)`,
                top: "10px",
                zIndex: this.props.selectedTab !== SidebarTab.Element && -1,
                height: "100%"
              }}
            >
              <div style={{ display: "inline-block", width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    marginTop: "10px",
                    height: "calc(100% - 35px)",
                    overflow: "scroll"
                  }}
                >
                  <div
                    style={{
                      width: "350px",
                      marginRight: "10px"
                    }}
                  >
                    <img
                      onMouseDown={this.imgOnMouseDown.bind(this, {
                        representative:
                          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                      })}
                      style={{
                        width: "160px",
                        height: imgWidth + "px",
                        backgroundColor: "#019fb6"
                      }}
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                    />
                  </div>
                  <div
                    style={{
                      width: "350px",
                      marginRight: "10px"
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div
              style={{
                opacity: this.props.selectedTab === SidebarTab.Video ? 1 : 0,
                position: "absolute",
                width: "347px",
                color: "white",
                overflow: "scroll",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  this.props.selectedTab !== SidebarTab.Video &&
                  `translate3d(0px, calc(${
                    this.props.selectedTab < SidebarTab.Video ? 40 : -40
                  }px), 0px)`,
                top: "10px",
                zIndex: this.props.selectedTab !== SidebarTab.Video && -1,
                height: "100%"
              }}
            >
              <div style={{ display: "inline-block", width: "100%" }}>
                <button
                  style={{
                    width: "calc(100% - 13px)",
                    backgroundColor: "white",
                    border: "none",
                    color: "black",
                    padding: "10px",
                    borderRadius: "5px",
                    height: "37px"
                  }}
                  onClick={() => {
                    document.getElementById("image-file").click();
                  }}
                >
                  Tải lên một video
                </button>
                <ul
                  style={{
                    listStyle: "none",
                    padding: "0px 13px 10px 0px",
                    width: "100%",
                    marginTop: "10px",
                    overflow: "scroll",
                    height: "calc(100% - 47px)"
                  }}
                >
                  {this.state.videos.map(video => (
                    <video
                      style={{
                        width: "100%",
                        marginBottom: "10px"
                      }}
                      onMouseDown={this.videoOnMouseDown.bind(this)}
                      muted
                      // autoPlay={true} preload="none"
                    >
                      <source
                        src={video.representative}
                        type="video/webm"
                      ></source>
                    </video>
                  ))}
                </ul>
              </div>
            </div>
            <div
              style={{
                opacity: this.props.selectedTab === SidebarTab.Upload ? 1 : 0,
                position: "absolute",
                width: "347px",
                color: "white",
                overflow: "scroll",
                transition:
                  "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                transform:
                  this.props.selectedTab !== SidebarTab.Upload &&
                  `translate3d(0px, calc(${
                    this.props.selectedTab < SidebarTab.Upload ? 40 : -40
                  }px), 0px)`,
                top: "10px",
                zIndex: this.props.selectedTab !== SidebarTab.Upload && -1,
                height: "100%"
              }}
            >
              <InfiniteScroll
                scroll={true}
                throttle={100}
                threshold={0}
                isLoading={this.state.isUserUploadLoading}
                marginTop={30}
                hasMore={this.state.hasMoreUserUpload}
                onLoadMore={this.loadmoreUserUpload.bind(this, false)}
                refId="sentinel"
              >
                <div
                  style={{
                    color: "white",
                    overflow: "scroll",
                    width: "100%"
                  }}
                >
                  <div
                    id="image-container-picker"
                    style={{ display: "flex", padding: "16px 13px 10px 0px" }}
                  >
                    <div
                      style={{
                        height: "calc(100% - 170px)",
                        width: "350px",
                        marginRight: "10px"
                      }}
                    >
                      {this.state.userUpload1.map((item, key) => (
                        <ImagePicker
                          id=""
                          className=""
                          height={imgWidth}
                          defaultHeight={imgWidth}
                          color=""
                          delay={0}
                          width={imgWidth}
                          key={key}
                          src={item.representative}
                          onPick={this.imgOnMouseDown.bind(this, item)}
                          onEdit={this.handleEditmedia.bind(this, item)}
                        />
                      ))}
                      {this.state.hasMoreUserUpload &&
                        Array(1)
                          .fill(0)
                          .map((item, i) => (
                            <ImagePicker
                              key={i}
                              id="sentinel"
                              color="black"
                              src={""}
                              height={imgWidth}
                              defaultHeight={imgWidth}
                              width={imgWidth}
                              className=""
                              onPick={this.imgOnMouseDown.bind(this, null)}
                              onEdit={this.handleEditmedia.bind(this, null)}
                              delay={0}
                            />
                          ))}
                      {this.state.hasMoreUserUpload &&
                        Array(10)
                          .fill(0)
                          .map((item, i) => (
                            <ImagePicker
                              key={i}
                              id="sentinel"
                              color="black"
                              src={""}
                              height={imgWidth}
                              defaultHeight={imgWidth}
                              width={imgWidth}
                              className=""
                              onPick={this.imgOnMouseDown.bind(this, null)}
                              onEdit={this.handleEditmedia.bind(this, null)}
                              delay={0}
                            />
                          ))}
                    </div>
                    <div
                      style={{
                        width: "350px"
                      }}
                    >
                      {this.state.userUpload2.map((item, key) => (
                        <ImagePicker
                          id=""
                          className=""
                          height={imgWidth}
                          defaultHeight={imgWidth}
                          color=""
                          width={imgWidth}
                          delay={0}
                          key={key}
                          src={item.representative}
                          onPick={this.imgOnMouseDown.bind(this, item)}
                          onEdit={this.handleEditmedia.bind(this, item)}
                        />
                      ))}
                      {this.state.hasMoreUserUpload &&
                        Array(1)
                          .fill(0)
                          .map((item, i) => (
                            <ImagePicker
                              key={i}
                              id="sentinel"
                              color="black"
                              src={""}
                              height={imgWidth}
                              defaultHeight={imgWidth}
                              width={imgWidth}
                              className=""
                              onPick={this.imgOnMouseDown.bind(this, null)}
                              onEdit={this.handleEditmedia.bind(this, null)}
                              delay={-1}
                            />
                          ))}
                      {this.state.hasMoreUserUpload &&
                        Array(10)
                          .fill(0)
                          .map((item, i) => (
                            <ImagePicker
                              key={i}
                              id="sentinel"
                              color="black"
                              src={""}
                              height={imgWidth}
                              defaultHeight={imgWidth}
                              width={imgWidth}
                              className=""
                              onPick={this.imgOnMouseDown.bind(this, null)}
                              onEdit={this.handleEditmedia.bind(this, null)}
                              delay={-1}
                            />
                          ))}
                    </div>
                  </div>
                </div>
              </InfiniteScroll>
              <button
                style={{
                  width: "calc(100% - 13px)",
                  backgroundColor: "white",
                  border: "none",
                  color: "black",
                  padding: "10px",
                  borderRadius: "3px",
                  height: "37px",
                  marginBottom: "10px",
                  position: "absolute",
                  top: 0,
                  boxShadow:
                    "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)"
                }}
                onClick={() => {
                  document.getElementById("image-file").click();
                }}
              >
                Tải lên một hình ảnh
              </button>
            </div>
            {/* } */}
          </div>
        )}
      </div>
    );
  }
}

const PopupWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background-color: rgba(0, 0, 0, 0.5);

  .popup_inner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background-color: black;
    width: 500px;
    height: 600px;
  }

  .popup-background {
    filter: blur(5px);
  }
`;

export default LeftSide;
