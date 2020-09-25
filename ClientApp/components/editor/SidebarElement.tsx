import React, { Component } from 'react'
import { SidebarTab, TemplateType, SavingState, } from "./enums";
import uuidv4 from "uuid/v4";
import editorStore from "@Store/EditorStore";
import InfiniteScroll from "@Components/shared/InfiniteScroll";
import ImagePicker from "@Components/shared/ImagePicker";
import { toJS } from "mobx";

export interface IProps {
    scale: number;
    translate: any;
    selectedTab: any;
    handleEditmedia: any;
    handleImageSelected: any;
    rectWidth: number;
    rectHeight: number;
    setSavingState: any;
}

export interface IState {
    items: any;
    items2: any;
    items3: any;
    isLoading: boolean;
    currentItemsHeight: number;
    currentItems2Height: number;
    currentItems3Height: number;
    error: any;
    hasMore: boolean;
    cursor: any;
}

const imgWidth = 162;
const backgroundWidth = 105;

const elements = [
    {
        representative: "https://template.canva.com/EADX7bJQMIQ/1/0/800w-Ida3rjkyPN8.png",
        clipId: "__id1_0",
        clipWidth: 500,
        clipHeight: 500,
        path: "M500 250.002c0 138.065-111.931 249.996-250 249.996-138.071 0-250-111.931-250-249.996C0 111.93 111.929 0 250 0s250 111.93 250 250.002z"
    },
    {
        representative:
            "https://template.canva.com/EADX7r0xmN0/1/0/800w-KJddcbuAC3c.png",
        clipId: "__id1_0",
        clipWidth: 500,
        clipHeight: 500,
        path: "M440.102 79.27c-9.778-16.932-27.509-26.405-45.749-26.418l.003-.003c-18.24-.016-35.974-9.488-45.749-26.418-14.586-25.267-46.892-33.922-72.159-19.333l-.004.003v-.016c-15.693 9.041-35.609 9.757-52.466.198A52.578 52.578 0 0 0 197.201 0c-19.551 0-36.619 10.623-45.755 26.412v-.003c-9.133 15.786-26.205 26.409-45.753 26.409-29.175 0-52.824 23.649-52.824 52.824v.006l-.016-.006c-.016 18.101-9.345 35.698-26.03 45.521a52.552 52.552 0 0 0-19.722 19.559c-9.776 16.934-9.111 37.025-.003 52.83h-.003c9.101 15.802 9.766 35.895-.01 52.827-14.585 25.264-5.931 57.57 19.336 72.159l.003.003-.01.007c15.789 9.129 26.407 26.201 26.407 45.752 0 29.175 23.649 52.824 52.823 52.824 19.552 0 36.617 10.621 45.756 26.41 9.133 15.782 26.204 26.41 45.753 26.41a52.61 52.61 0 0 0 26.777-7.284c16.853-9.557 36.774-8.841 52.466.203v-.019l.003.006c25.267 14.586 57.573 5.928 72.163-19.336 9.775-16.929 27.506-26.403 45.746-26.416l-.004-.007c18.24-.013 35.974-9.487 45.746-26.416 4.813-8.335 7.097-17.439 7.087-26.417l.007.006c.016-17.594 8.832-34.719 24.652-44.682 8.528-4.484 15.929-11.355 21.1-20.312 9.779-16.938 9.114-37.031.007-52.833h.003c-9.104-15.802-9.77-35.895.007-52.828 14.589-25.267 5.931-57.57-19.336-72.159l-.004-.004.01-.003c-15.662-9.062-26.236-25.935-26.403-45.291.092-9.134-2.185-18.404-7.078-26.882"
    },
    {
        representative:
            "https://template.canva.com/EADX7QrTMRE/1/0/800w-9JSF7RR-P-c.png",
        clipId: "__id1_10",
        clipWidth: 485,
        clipHeight: 333.5,
        path: "M485 333.5L0 291.1V0l485 42.4z"
    },
    {
        representative:
            "https://template.canva.com/EADX7Asmx5Q/1/0/698w-u9NeGBksRvE.png",
        clipId: "__id1_11",
        clipWidth: 229.6,
        clipHeight: 264.2,
        path: "M75.6 215.7h75.7l14.7 48.6h63.6L147.2 0H82.6L0 264.2h61.3l14.3-48.5zm38-128.2l20.4 70H92.9l20.7-70z"
    },
    {
        representative:
            "https://template.canva.com/EADfCquREdE/1/0/404w-eJxIhDu9uEM.png",
        clipId: "__id1_12",
        clipWidth: 206.3,
        clipHeight: 408.2,
        path: "m175.3 12.3h-21.4v4.5c0 5.1-4.2 9.3-9.3 9.3h-82.6c-5.1 0-9.3-4.2-9.3-9.3v-4.5h-21.6c-9.1 0-16.5 7.4-16.5 16.5v351c0 9.1 7.4 16.5 16.5 16.5h144.2c9.1 0 16.5-7.4 16.5-16.5v-351c0.1-9.1-7.3-16.5-16.5-16.5z",
        path2: [{
            path: "m174.2 2h-142.1c-15.4 0-27.9 12.5-27.9 27.9v348.3c0 15.4 12.5 27.9 27.9 27.9h142.1c15.4 0 27.9-12.5 27.9-27.9v-348.3c0-15.4-12.5-27.9-27.9-27.9zm-47.3 12.8c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5 1.2-2.5 2.5-2.5zm-36.9 0.8h24c0.9 0 1.7 0.7 1.7 1.7s-0.8 1.7-1.7 1.7h-24c-0.9 0-1.7-0.7-1.7-1.7s0.8-1.7 1.7-1.7zm101.9 364.2c0 9.1-7.4 16.5-16.5 16.5h-144.3c-9.1 0-16.5-7.4-16.5-16.5v-351c0-9.1 7.4-16.5 16.5-16.5h21.5v4.5c0 5.1 4.2 9.3 9.3 9.3h82.7c5.1 0 9.3-4.2 9.3-9.3v-4.5h21.4c9.1 0 16.5 7.4 16.5 16.5v351z",
            fill: "#000000",
        }],
    },
    {
        representative:
            "https://template.canva.com/EADeqIhE6gQ/1/0/800w-aHMY8cRMwKQ.png",
        clipId: "__id1_13",
        clipWidth: 588,
        clipHeight: 472.1,
        path: "M24.8 27.8H562.4V329.8H24.8z",
        path2: [
            {
                path: "m561.2 0h-534.4c-14.8 0-26.8 12-26.8 26.8v328.6h588v-328.6c0-14.8-12-26.8-26.8-26.8zm1.2 329.8h-537.6v-302h537.6v302z",
                fill: "#000000",
            },
            {
                path: "m0 383.5c0 14.8 12 26.8 26.8 26.8h534.4c14.8 0 26.8-12 26.8-26.8v-28h-588v28z",
                fill: "#e9e9e9",
            },
            {
                path: "m290.4 410.3h-63.4s-1.9 29.2-3.9 41.4c-3.5 20.9-24.9 14.2-31 18.6-0.8 0.6-0.4 1.9 0.6 1.9h202.4c1 0 1.4-1.3 0.6-1.9-6.1-4.4-27.5 2.3-31-18.6-2-12.2-3.9-41.4-3.9-41.4h-70.4z",
                fill: "#bbbbbb",
            }
        ],
    },
    {
        representative:
            "https://template.canva.com/EADeqUpyBjA/1/0/800w-QJezxdZmZ_Y.png",
        clipId: "__id1_14",
        clipWidth: 628.5,
        clipHeight: 360.5,
        path: "M75.8 21.8H552.6V320.2H75.8z",
        path2: [
            {
                path: "m550.4 1.7h-472.3c-9.8 0-17.8 8-17.8 17.8v322.9h508v-322.9c-0.1-9.8-8.1-17.8-17.9-17.8zm2.2 318.4h-476.8v-298.3h476.8v298.3z",
                fill: "#000000",
            },
            {
                path: "m570 342.4v-323.2c0-10.6-8.6-19.2-19.2-19.2h-473.2c-10.5 0-19.1 8.6-19.1 19.2v323.3h-58.5v7.7c0 4.2 3.4 7.5 7.5 7.5h613.5c4.2 0 7.5-3.4 7.5-7.5v-7.7h-58.5zm-214.1 0v0.1c0 4.2-3.4 7.5-7.5 7.5h-68.3c-4.2 0-7.5-3.4-7.5-7.5v-0.1h-212.3v-322.9c0-9.8 8-17.8 17.8-17.8h472.3c9.8 0 17.8 8 17.8 17.8v322.9h-212.3z",
                fill: "#e9e9e9"
            },
            {
                path: "m280.1 350.1h68.3c4.2 0 7.5-3.4 7.5-7.5v-0.1h-83.4v0.1c0 4.1 3.4 7.5 7.6 7.5z",
                fill: "#cccccc",
            }
        ],
    },
    {
        representative:
            "https://template.canva.com/EADisf57hnE/1/0/1584w-jB-NvxAGRnk.png",
        clipId: "__id1_15",
        clipWidth: 500,
        clipHeight: 500,
        path: "m250 2.51c-136.68 0-247.49 110.81-247.49 247.49s110.81 247.49 247.49 247.49 247.49-110.81 247.49-247.49-110.81-247.49-247.49-247.49zm0 370.19c-67.77 0-122.7-54.94-122.7-122.7s54.93-122.7 122.7-122.7 122.7 54.93 122.7 122.7-54.93 122.7-122.7 122.7z",
        path2: [
            
        ],
    },
    {
        representative:
            "https://template.canva.com/EADfUOLH5Zg/1/0/576w-P1bCiMs6To8.png",
        clipId: "__id1_16",
        clipWidth: 372.8,
        clipHeight: 516.6,
        path: "m351.4 488.8c0 4.4-3.6 8-8 8h-315.2c-4.4 0-8-3.6-8-8v-459.9c0-4.4 3.6-8 8-8h315.3c4.4 0 8 3.6 8 8v459.9z",
        path2: [
            {
                path: "m346.9 4h-322.2c-12 0-21.8 9.7-21.8 21.8v466.1c0 12.1 9.8 21.8 21.8 21.8h322.2c12.1 0 21.8-9.8 21.8-21.8v-466.1c0-12.1-9.7-21.8-21.8-21.8zm4.5 484.8c0 4.4-3.6 8-8 8h-315.2c-4.4 0-8-3.6-8-8v-459.9c0-4.4 3.6-8 8-8h315.3c4.4 0 8 3.6 8 8v459.9z",
                fill: "#010101",
            },
            {
                path: "m346.1 4.2c12.4 0 22.5 10.1 22.5 22.5v464.6c0 12.4-10.1 22.5-22.5 22.5h-320.8c-12.4 0-22.5-10.1-22.5-22.5v-464.6c0-12.4 10.1-22.5 22.5-22.5h320.8m0-2.9h-320.8c-14 0-25.3 11.4-25.3 25.4v464.6c0 14 11.3 25.3 25.3 25.3h320.8c14 0 25.3-11.3 25.3-25.3v-464.6c0-14-11.3-25.4-25.3-25.4z",
                fill: "#565656"
            },
        ],
    },
    {
        representative:
            "https://template.canva.com/EADX7V8BnC4/1/0/800w-LLG7pXtEe1U.png",
        clipId: "__id1_17",
        clipWidth: 187,
        clipHeight: 158.4,
        path: "M186.9 139.8c-.1-39.5-1.3-92.9-1.3-132.3 0-.6.1-1.2.1-1.7-.1-.1-.2-.1-.3-.2 0 0-.1.1-.1.2-.2.5-.6.5-1 .5-.5-.1-1-.6-1.6-.4-.2.1-.6-.1-.7-.3-.3-.4-.7-.4-1.1-.2-.2.1-.4 0-.6 0-.3 0-.7-.1-1-.2-.1 0-.3-.1-.4-.1-.3-.1-.6-.4-.9 0 0 0-.2 0-.3-.1-.1-.2-.2-.5-.3-.7-.2-.3-.2-.8-.5-1-.2-.1-.3-.2-.4-.4 0-.1-.2-.2-.2-.3l-.3-.3c-.1-.2-.2-.5-.4-.6-.4-.3-.5-.7-.3-1.2-.3-.1-.5-.3-.8-.3-1.2.1-2.5.3-3.7.4-.2 0-.5.1-.6.2-.8.5-1.6.1-2.4 0-.6 0-1.2-.3-1.8-.4-.7-.1-1.3 0-2-.1-.1 0-.2-.1-.3-.2-.2-.3-.6-.2-.8-.1-.3.2-.4.5-.6.8-.5.1-1.2.2-1.7.5-.4.2-.6.3-.9.1l-.1.1c.2.2.3.5.5.7-.3.1-.7.3-.9.2-.5-.1-.7.1-1.1.3-.4.3-.9.5-1.3.7-.1 0-.2 0-.3-.1-.1 0-.2-.1-.2-.1-.5.2-1 .4-1.5.2-.1 0-.1.1-.2.1-.6.2-1 .9-1.8.9-.6 0-1.2.5-1.8.5-.7.1-1.3.3-1.9.6-.2.1-.4.1-.5.1-.5-.2-.8.1-1 .4-.5.7-1.3.9-2 1.1-.9.2-1.8.3-2.7.4-.1 0-.2.3-.4.4-.1 0-.2-.1-.2-.1-.5.6-.8 1.5-1.8 1.4h-.1c-.8.5-1.6.3-2.3.1-.2 0-.5-.2-.6-.4-.3-.6-1.1-.8-1.7-.6-.5.2-1 .3-1.5.5-.8.2-1.5.3-2.3-.1s-1.4-.1-1.8.8c-.3.6-1.1.7-1.6.2-.3-.3-.5-.2-.8 0l-.6.6c-.1.1-.3.1-.4.1h-.6c-.4 0-.8-.1-1.2-.2-.5-.1-.9-.4-1.4-.5-.8-.1-1-.8-1.3-1.3-.2-.3-.6-.7-1-.6-.4.2-.8 0-1.1-.1-.1 0-.3-.1-.4-.1-.7-.2-1.2.2-1.7.7l-.4.4c-.1.1-.1.3-.2.4-.6.5-1.2.3-1.9 0-.6-.3-1.3 0-1.5.6-.1.4-.2.7-.7.9-.5.3-1.1.5-1.2 1.2 0 .1-.1.2-.2.2-.3.1-.5.2-.8.3h-.9c-.6-.1-1.2-.3-1.8-.4-.7-.1-1.3.3-2 .4l-.1.1c-.2.3-.5.2-.7 0-.4-.4-1.1-.5-1.6-.3-.6.3-1.2.5-1.8.7-.2 0-.4-.1-.5-.1-.2 0-.5-.1-.6 0-.8.6-1.6.4-2.3 0-.4-.2-1-.4-1.2-1-.1-.4-.5-.8-.8-1.1-.5-.5-1-1.2-1.9-1.2-.2 0-.4-.4-.5-.3-.4.1-.4-.1-.6-.3s-.5-.4-.7-.7c-.3-.4-.6-.9-.9-1.3s-.5-.9-.8-1.3c-.1-.1-.4-.2-.5-.1l-1.2.6c-.2.1-.3.3-.4.5l-.1-.1c.1-.3.2-.6.3-.7l-1.2-.3c-.3-.1-.8-.1-1-.1h-1.6c-.6 0-1.1-.1-1.7 0-.4.1-.7-.1-1-.3-.8-.6-1.6-1.3-2.7-1-.1 0-.3-.1-.4-.2-.3-.1-.5-.3-.9-.5 0 .3 0 .4.1.6-.2.2-.3.1-.4 0-.1.1-.2.3-.3.3-.5.2-1 .3-1.5.5-.2.1-.4.2-.5.3-.4.3-.7.8-1.4.7-.1 0-.3.2-.5.2-.2.1-.5.1-.7.2h-.2c-.6.2-1.1.4-1.7.5h-.4c-.5 0-.9-.1-1.4-.1s-1 .2-1.5.2c-.6 0-1.3 0-1.8-.4-.1-.1-.4-.1-.6 0-.7.1-1.4.2-2 .4s-.9 0-1.1-.5c-.1-.2-.3-.4-.5-.6-.3-.2-.6-.5-.9-.5-.7 0-1.1-.4-1.6-.7-.8-.5-1.5-1.1-2.5-1v-.5c.2 0 .4 0 .6-.1-.3-.2-.3-.5-.5-.7-.4-.3-.8-.4-1.2-.6-.3-.1-.7-.1-.5.4-.5.1-.9.1-1.1.3-.4.3-.8.1-1.1-.1-.2-.1-.4-.2-.6-.1-1.2.6-2.4.3-3.6.3-.2 0-.4-.1-.7-.1-.4-.1-.7-.3-1.1-.4s-.9-.2-1.3-.3h-.3c-.7 0-1.4.1-2 .1-.5 0-1-.2-1.6-.3-.1-.8-.9-.6-1.4-1-.1-.1-.3 0-.4 0-.6-.1-1 .2-1.2.7-.3.5-1.1.7-.8 1.5.1.1.3.2.4.4 0 .3-.1.5-.4.4-.1 0-.2.2-.3.3s-.1.3-.2.3c-.6.2-1 .7-1.7.6h-.2c-.6.5-1.2.4-1.9.3-.3-.1-.7 0-1.1 0-.3 0-.6 0-.9-.2-.4-.2-.8-.5-1.2-.7s-.9-.2-.9-.9c0-.1-.2-.2-.2-.3-.7.6-1.3 1.1-1.9 1.6-.3.3-.7.7-.5 1.2 0 .1-.1.2-.1.3-.1.2-.2.4-.4.5-.2.3-.4.6-.6 1l-.6.6c-.2.3-.4.6-.7.8-.7.6-1.4 1.2-2.2 1.8-.4.4-.9.7-1.3 1.1-.7.6-1.5 1.1-1.9 2 0 .1-.2.2-.3.3-.5.4-1.3.4-1.3 1.2-.8 0-1.2.6-1.6 1.1-.3.4-.6.9-1 1.2-.4.2-.9.1-1.4.1-.2 0-.4 0-.4.1-.4.4-.9.7-1.2 1.2s-.6.8-1.1.9-1 .6-1.7.3c-.6-.2-1.3 0-1.7-.4-.8.1-1.4.3-2.1.4-.8.2-1.7.1-2.4.7-.6.5-1.1 1-2 .9.1.6.2 1.1.3 1.7.2 1.6.4 3.2.5 4.8.3 2 .4 3.9.2 5.8-.2 2.7-1.1 95.1-2 97.6l-.9 2.1c-.2.5.1.8.6.9.6.1.8.5 1 1 .2.8-.1 1.6.3 2.4.2.4 0 1.1-.1 1.7-.1.8.1 1.6.4 2.3.7 1.2.8 2.6.8 3.9 0 .3.1.6.2.8.2.2.6.4 1 .5l2.4 1.2c1.1.6 2 .5 3-.2.1-.1.4-.2.5-.2.7.1 1.4.1 2 .7.7.6 1.7 1 2.5 1.5.5.3 1.1.7 1.4 1.1.2.2.4.4.6.5 1.1.4 1.7 1.4 2.4 2.2.6.7 1.4 1.1 2.3 1.2 1 .2 2 .3 3 .5.4.1.9.2 1.3.4.5.2 1 .2 1.4.5.6.5 1.2.8 2 .6.3-.1.7.1 1 .2.1 0 .2.1.3.1 1.1.1 2.1-.1 3.1-.3.4-.1.8-.2 1.2-.4 1.1-.5 2.2-1 3.2-1.6.7-.4 1.4-.8 2.2-.4h.4c.7 0 1.4-.1 2-.2.1 0 .3 0 .3-.1.3-.4.8-.4 1.3-.5.8-.1 1.6-.1 2.2-.6.6-.4 1.2-.5 1.9-.6.1 0 .3-.1.4-.1.5-.1 1-.4 1.4-.3.9.2 1.3-.1 1.9-.9.1-.2.4-.3.6-.4.5-.1 1 0 1.5-.1.3 0 .6-.3.8-.3.8.1 1.7-.2 2.4.3.1.1.3.1.5.1 1.3.1 2.4.5 3.3 1.3.3.3.7.5 1 .7s.7.2 1 .3.5.2.8.2c.5 0 .9.2 1.2.6.1.1.2.2.3.4-.1.3.5 1.1.9 1.1.7 0 1.4.2 2 .7.1.1.3.1.5 0 .3-.1.5-.1.7.2.1.1.5.1.7.1.5 0 1.1-.1 1.6 0 .9.1 1.7.2 2.6.4.2 0 .4.1.5.2.2.5.7.5 1 .6s.7.2.9.2c.1-.1.3-.2.5-.4-.4 0-.6.1-.8.1.4-.5.8-.6 1.3-.3.6.5 1.1.5 1.8 0l.6-.3v-.5c.3.1.6.3.8.3.6-.3 1.2-.6 1.7-1 .6-.4 1.1-.9 1.6-1.3.1 0 .1-.1.2-.1.7-.2 1.3-.3 2-.5.4-.1.7-.3 1.1-.4.3-.1.5-.1.8-.2h1c.2 0 .5 0 .7-.1.1-.2.3-.5.4-.5.3 0 .5.2.8.3.1 0 .1.1.1.2.4.4.7.9 1.1 1.3.5.5 1 .5 1.3.2.5-.4.9-.7 1.6-.5.1 0 .3.1.4 0 .5-.2 1.1-.4 1.6-.7.3-.1.7-.1.8-.3.3-.6.8-.9 1.3-1.3.3-.3.6-.7.9-.8.7-.2 1.2-.8 1.8-1.2.5-.3.8-.9 1.3-1 .8-.2 1.4-.7 2.1-1.2.4-.3.9-.5 1.4-.4.3.1.7 0 .9-.1.4-.2.8-.5 1.2-.7.3-.2.6-.4.9-.4 1-.1 1.8-.3 2.3-1.3.2-.4 1.2-.9 1.6-.7.7.3 1.2.1 1.6-.5.3-.3.7-.2 1 0 .2.2.4.3.6.3.7.1 1.5 0 2.2.1.6.1 1.2-.1 1.6-.5s.7-.4 1.3-.2c.5.2.9.7 1.6.6.6-.1 1.3.2 2-.1h.4c.6.2 1.2.3 1.7.8.6.5.7-3.2 1.3-2.8.9.6.7 0 1.6.5.7.3.4-.8 1.2-.6.1 0 1.3.8 1.3.7.5-.3 1-3.3 1.5-3.2 1 .3 1.9.1 2.8-.3.5-.2 1.3-.9 1.7-.6.7.5 1.4.7 2.2.8.1 0 .2.1.3.2.3.4 1.7-.7 2-.3.4.6.8 1.2 1.2 1.7.2.2.5.3.6.5.1.5.3.7.8.7.3 0 .6.1.8.3.5.3.9.6 1.3.9.5.3 1 .6 1.2 1.1.1.2.2.3.3.4.4.4.8.7 1.2 1.1.6.5 1.1 1.1 1.7 1.6.2.1.4.3.6.4.4.2.8.4 1.1.7s1.7-1.5 1.9-1.1c0 .1.1.1.2.1.6.5 1.2.3 1.8.1.2-.1.4-.2.5-.1.7.3 1.2 1 2.1 1.1 0 0 .1 0 .1.1.2.6.8.6 1.3.7.3 0 .6.1.8.2.6.3 1.2.7 1.9.9.9.3 1.8.5 2.5 1 .1 0 .2 0 .2.1.3.2.8.3 1 .6.3.6 1.1.5 1.5 1h.1c.4 0 .8.1 1.3.1.2-.1.5-.3.7-.3.9.3 1.8.3 2.4-.5.1-.1.3-.1.5-.1h.8c.9-.2 1.7-.4 2.6-.5.4-.1.9.1 1.3.2s.8.1 1.2.1c.5 0 .9-.2 1.4-.2.4-.1.9-.1 1.3-.2.9-.2 1.7-.4 2.6-.5.6-3.4.5-7.4.5-11.5z",
    },
];

export default class SidebarEffect extends Component<IProps, IState> {
    state = {
        isLoading: false,
        items: [],
        items2: [],
        items3: [],
        currentItemsHeight: 0,
        currentItems2Height: 0,
        currentItems3Height: 0,
        error: null,
        hasMore: true,
        cursor: null,
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadMore.bind(this)(true);
        this.forceUpdate();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.selectedTab != nextProps.selectedTab
            && (nextProps.selectedTab == SidebarTab.Element || this.props.selectedTab == SidebarTab.Element)
        ) {
            return true;
        }
        return false;
    }

    imgOnMouseDown(img, e) {

        e.preventDefault();

        let scale = this.props.scale;

        let target = e.target.cloneNode(true);
        target.style.zIndex = "11111111111";
        target.src = img.representativeThumbnail
            ? img.representativeThumbnail
            : e.target.src;
        target.style.width = e.target.getBoundingClientRect().width + "px";
        target.style.backgroundColor = e.target.style.backgroundColor;
        document.body.appendChild(target);
        let self = this;
        let imgDragging = target;
        let posX = e.pageX - e.target.getBoundingClientRect().left;
        let dragging = true;
        let posY = e.pageY - e.target.getBoundingClientRect().top;
        let image = e.target;
        let recScreenContainer = document
            .getElementById("screen-container-parent")
            .getBoundingClientRect();
        let beingInScreenContainer = false;

        const onMove = e => {
            window.imagedragging = true;
            image.style.opacity = 0;
            if (dragging) {
                let rec2 = imgDragging.getBoundingClientRect();
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

        const onUp = evt => {
            window.imagedragging = false;
            dragging = false;
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);

            let recs = document.getElementsByClassName("alo");
            let rec2 = imgDragging.getBoundingClientRect();
            for (let i = 0; i < recs.length; ++i) {
                let rec = recs[i].getBoundingClientRect();
                if (
                    rec.left < rec2.right &&
                    rec.right > rec2.left &&
                    rec.top < rec2.bottom &&
                    rec.bottom > rec2.top
                ) {
                    let newImg = {
                        _id: uuidv4(),
                        type: TemplateType.ClipImage,
                        width: rec2.width / scale,
                        height: rec2.height / scale,
                        origin_width: rec2.width / scale,
                        origin_height: rec2.height / scale,
                        left: (rec2.left - rec.left) / scale,
                        top: (rec2.top - rec.top) / scale,
                        rotateAngle: 0.0,
                        // src: !img.representative.startsWith("data")
                        //     ? window.location.origin + "/" + img.representative
                        //     : img.representative,
                        src: img.representative,
                        srcThumnail: img.representativeThumbnail,
                        backgroundColor: target.style.backgroundColor,
                        selected: true,
                        scaleX: 1,
                        scaleY: 1,
                        clipScale: (rec2.width) / img.clipWidth,
                        posX: 0,
                        posY: 0,
                        imgWidth: rec2.width / scale,
                        imgHeight: rec2.height / scale,
                        page: editorStore.pages[i],
                        zIndex: editorStore.upperZIndex + 1,
                        freeStyle: img.freeStyle,
                        path: img.path,
                        clipId: img.clipId,
                        clipWidth: img.clipWidth,
                        clipHeight: img.clipHeight,
                        path2: img.path2,
                    };

                    this.props.setSavingState(SavingState.UnsavedChanges, true);
                    editorStore.addItem2(newImg, false);
                    editorStore.increaseUpperzIndex();

                    this.props.handleImageSelected(newImg._id, editorStore.pages[i], false, true, false);
                }
            }

            imgDragging.remove();

            image.style.opacity = 1;
        };
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    }

    loadMore = initialload => {
        let pageId;
        let count;
        if (initialload) {
            pageId = 1;
            count = 30;
        } else {
            pageId =
                (this.state.items.length +
                    this.state.items2.length +
                    this.state.items3.length) /
                5 +
                1;
            count = 15;
        }
        this.setState({ isLoading: true, error: undefined });
        const url = `/api/Media/Search?type=${TemplateType.BackgroundImage}&page=${pageId}&perPage=${count}`;
        fetch(url)
            .then(res => res.json())
            .then(
                res => {
                    var result = res.value.key;
                    var currentItemsHeight = this.state.currentItemsHeight;
                    var currentItems2Height = this.state.currentItems2Height;
                    var currentItems3Height = this.state.currentItems3Height;
                    var res1 = [];
                    var res2 = [];
                    var res3 = [];
                    for (var i = 0; i < result.length; ++i) {
                        var currentItem = result[i];
                        if (
                            currentItemsHeight <= currentItems2Height &&
                            currentItemsHeight <= currentItems3Height
                        ) {
                            res1.push(currentItem);
                            currentItemsHeight +=
                                backgroundWidth / (currentItem.width / currentItem.height);
                        } else if (
                            currentItems2Height <= currentItemsHeight &&
                            currentItems2Height <= currentItems3Height
                        ) {
                            res2.push(currentItem);
                            currentItems2Height +=
                                backgroundWidth / (currentItem.width / currentItem.height);
                        } else {
                            res3.push(currentItem);
                            currentItems3Height +=
                                backgroundWidth / (currentItem.width / currentItem.height);
                        }
                    }
                    this.setState(state => ({
                        items: [...state.items, ...res1],
                        items2: [...state.items2, ...res2],
                        items3: [...state.items3, ...res3],
                        currentItemsHeight,
                        currentItems2Height,
                        currentItems3Height,
                        isLoading: false,
                        hasMore:
                            res.value.value >
                            state.items.length + state.items2.length + res.value.key.length
                    }));

                    this.forceUpdate();
                },
                error => {
                    this.setState({ isLoading: false, error });
                }
            );
    };

    render() {

        return (
            <div
                style={{
                    opacity: editorStore.selectedTab === SidebarTab.Element ? 1 : 0,
                    position: "absolute",
                    width: "347px",
                    color: "white",
                    overflow: "scroll",
                    transition:
                        "transform .25s ease-in-out,opacity .25s ease-in-out,-webkit-transform .25s ease-in-out",
                    transform:
                        editorStore.selectedTab !== SidebarTab.Element &&
                        `translate3d(0px, calc(${editorStore.selectedTab < SidebarTab.Element ? 40 : -40
                        }px), 0px)`,
                    top: "10px",
                    zIndex: editorStore.selectedTab !== SidebarTab.Element && -1,
                    height: "100%",
                    left: '19px',
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
                        {/* <div
                            style={{
                                width: "350px",
                                marginRight: "10px"
                            }}
                        >
                            <img
                                onMouseDown={this.imgOnMouseDown.bind(this, {
                                    representative:
                                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
                                    freeStyle: true
                                })}
                                style={{
                                    width: "160px",
                                    height: imgWidth + "px",
                                    backgroundColor: "#019fb6"
                                }}
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                            />
                        </div> */}
                        <div
                            style={{
                                width: "350px",
                            }}
                        >
                            <div
                                    style={{
                                        display: "inline-flex",
                                        height: "100px",
                                        width: "100px",
                                        justifyContent: "center",
                                        marginRight: "10px",
                                        marginBottom: "10px",
                                    }}
                                >
                            <img
                                onMouseDown={this.imgOnMouseDown.bind(this, {
                                    representative:
                                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
                                    freeStyle: true
                                })}
                                style={{
                                    width: "100px",
                                    height: 100 + "px",
                                    backgroundColor: "#019fb6",
                                    marginRight: "8px",
                                    marginBottom: "8px",
                                }}
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                            />
                            </div>
                            {elements.map(el =>
                                <div
                                    style={{
                                        display: "inline-flex",
                                        height: "105px",
                                        width: "105px",
                                        justifyContent: "center",
                                        marginRight: "10px",
                                        marginBottom: "10px",
                                    }}
                                >
                                <img
                                    onMouseDown={this.imgOnMouseDown.bind(this, el)}
                                    style={{
                                        // width: "100px",
                                        maxWidth: "100%",
                                        // height: 100 / (el.clipWidth / el.clipHeight) + "px",
                                        maxHeight: "100%",
                                        cursor: 'pointer',
                                        objectFit: "contain"
                                    }}
                                    src={el.representative}
                                />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}