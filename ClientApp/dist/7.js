exports.ids = [7];
exports.modules = {

/***/ "./ClientApp/pages/AccountPage.tsx":
/*!*****************************************!*\
  !*** ./ClientApp/pages/AccountPage.tsx ***!
  \*****************************************/
/*! exports provided: default */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-helmet */ \"./node_modules/react-helmet/lib/Helmet.js\");\n/* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_helmet__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ \"./node_modules/axios/index.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! uuid/v4 */ \"./node_modules/uuid/v4.js\");\n/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(uuid_v4__WEBPACK_IMPORTED_MODULE_3__);\nvar __extends=undefined&&undefined.__extends||function(){var extendStatics=function(d,b){extendStatics=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;}||function(d,b){for(var p in b)if(b.hasOwnProperty(p))d[p]=b[p];};return extendStatics(d,b);};return function(d,b){extendStatics(d,b);function __(){this.constructor=d;}d.prototype=b===null?Object.create(b):(__.prototype=b.prototype,new __());};}();var AccountPage=/** @class */function(_super){__extends(AccountPage,_super);function AccountPage(props){var _this=_super.call(this,props)||this;_this.state={orders:[],selectedTab:1};return _this;}AccountPage.prototype.componentDidMount=function(){var self=this;var url=\"/api/Order/Search\";axios__WEBPACK_IMPORTED_MODULE_2___default.a.get(url).then(function(res){self.setState({orders:res.data.value.key});});};AccountPage.prototype.render=function(){var _this=this;return react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",null,react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](react_helmet__WEBPACK_IMPORTED_MODULE_1__[\"Helmet\"],null,react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"title\",null,\"Home page - RCB (TypeScript)\")),react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{className:\"container-content\"},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{style:{display:'flex'},className:\"container\"},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{style:{width:'100%',display:'flex',margin:'10px'}},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{style:{marginRight:'20px',width:'300px',backgroundColor:'rgba(255, 255, 255, 0.85)',minHeight:'400px',borderRadius:'0.3125rem',padding:'10px'}},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"ul\",{className:\"sidebar-selector\",style:{listStyle:'none',padding:0}},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"li\",null,react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"button\",{onClick:function(){_this.setState({selectedTab:1});}},\"Th\\u00F4ng tin t\\u00E0i kho\\u1EA3n\")),react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"li\",null,react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"button\",{onClick:function(){_this.setState({selectedTab:2});}},\"Qu\\u1EA3n l\\u00FD \\u0111\\u01A1n h\\u00E0ng\")),react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"li\",null,react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"button\",{onClick:function(){_this.setState({selectedTab:3});}},\"\\u0110\\u1ECBa ch\\u1EC9 c\\u1EE7a t\\u00F4i\")),react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"li\",null,react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"button\",{onClick:function(){_this.setState({selectedTab:4});}},\"M\\u00E3 qu\\u00E0 t\\u1EB7ng\")))),react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{style:{width:'100%',backgroundColor:'rgba(255, 255, 255, 0.85)',borderRadius:'0.3125rem',padding:'0 20px'}},this.state.selectedTab===1&&react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",null,react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{className:\"jsx-2419075365\"},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{className:\"jsx-1038892047 user-account-settings\"},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"h1\",{className:\"jsx-1038892047 title-account\"},\"T\\u00E0i kho\\u1EA3n\"),react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{className:\"jsx-4204020708 user-settigs-section\"},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{className:\"jsx-4204020708\"},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{className:\"jsx-960220893 section-action\",style:{display:'flex'}},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"h4\",{className:\"jsx-960220893\",style:{flex:'1 1 0%'}},\"S\\u1ED1 d\\u01B0\"),react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"span\",{className:\"jsx-960220893\"},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"span\",{style:{fontSize:'20px'}},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"span\",{className:\"notranslate \"},\"0\\u20AB\"))))),react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"p\",{className:\"jsx-3407573289\"},\"B\\u1EA1n c\\u00F3 th\\u1EC3 d\\u00F9ng s\\u1ED1 d\\u01B0 n\\u00E0y \\u0111\\u1EC3 thanh to\\u00E1n cho nh\\u1EEFng \\u0111\\u01A1n h\\u00E0ng sau\",react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"a\",{className:\"jsx-3407573289 text-no-underline text-right\",href:\"/vn/account/giftcard\"},\"S\\u1EED d\\u1EE5ng th\\u1EBB qu\\u00E0 t\\u1EB7ng\"))),react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{className:\"jsx-4204020708 user-settigs-section\"},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{className:\"jsx-4204020708\"},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{className:\"jsx-960220893 section-action\"},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"h4\",{className:\"jsx-960220893\"},\"Th\\u00F4ng tin c\\u00E1 nh\\u00E2n\"),react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"span\",{className:\"jsx-960220893\"},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"span\",{className:\"link-style\"},\"S\\u1EEDa\")))),react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{className:\"\"},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{className:\"col-4\"},\"H\\u1ECD t\\u00EAn\"),react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{className:\"col-8 text-right text-truncate\"},\" \")),react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{className:\"\"},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{className:\"col-4\"},\"\\u0110\\u1ECBa ch\\u1EC9 email\"),react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{className:\"col-8 text-right text-truncate\"},\"llaugusty@gmail.com\"))),react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{className:\"jsx-4204020708 user-settigs-section\"},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{className:\"jsx-4204020708\"},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{className:\"jsx-960220893 section-action\"},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"h4\",{className:\"jsx-960220893\"},\"M\\u1EADt kh\\u1EA9u\"),react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"span\",{className:\"jsx-960220893\"},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"span\",{className:\"link-style\"},\"\\u0110\\u1ED5i m\\u1EADt kh\\u1EA9u\")))))))),this.state.selectedTab===2&&this.state.orders.map(function(order){return react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",{key:uuid_v4__WEBPACK_IMPORTED_MODULE_3___default()(),style:{display:'flex',justifyContent:'space-between',padding:'10px'}},react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",null,react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",null,order.fullName,\",\",order.phoneNumber),react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\",null,order.address,\",\",order.city)),react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"img\",{style:{width:'150px',boxShadow:'0 0.5px 0 0 #ffffff inset, 0 1px 2px 0 #B3B3B3'},src:order.representative}));}))))));};return AccountPage;}(react__WEBPACK_IMPORTED_MODULE_0__[\"Component\"]);/* harmony default export */ __webpack_exports__[\"default\"] = (AccountPage);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvcGFnZXMvQWNjb3VudFBhZ2UudHN4P2RkNTYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O21iQVVBLDhDQUF5Qyw4QkFLckMscUJBQVksS0FBWixDQUFpQixDQUFqQixVQUNJLGlCQUFNLEtBQU4sR0FBWSxJQURoQixDQUpBLFlBQVEsQ0FDSixNQUFNLENBQUUsRUFESixDQUVKLFdBQVcsQ0FBRSxDQUZULENBQVIsQyxhQU1DLENBRUQsbURBQ0ksR0FBSSxLQUFJLENBQUcsSUFBWCxDQUNBLEdBQUksSUFBRyxDQUFHLG1CQUFWLENBQ0EsNENBQUssQ0FBQyxHQUFOLENBQVUsR0FBVixFQUFlLElBQWYsQ0FDSSxhQUFHLENBQ0MsSUFBSSxDQUFDLFFBQUwsQ0FBYyxDQUNWLE1BQU0sQ0FBRSxHQUFHLENBQUMsSUFBSixDQUFTLEtBQVQsQ0FBZSxHQURiLENBQWQsRUFHSCxDQUxMLEVBT0gsQ0FWRCxDQVlBLHVEQUNJLE1BQU8sZ0VBQ0gsb0RBQUMsbURBQUQsQ0FBTyxJQUFQLENBQ0ksZ0dBREosQ0FERyxDQUlILDJEQUFLLFNBQVMsQ0FBQyxtQkFBZixFQUNKLDJEQUFLLEtBQUssQ0FBRSxDQUFDLE9BQU8sQ0FBRSxNQUFWLENBQVosQ0FBK0IsU0FBUyxDQUFDLFdBQXpDLEVBQ0UsMkRBQ0UsS0FBSyxDQUFFLENBQ0gsS0FBSyxDQUFFLE1BREosQ0FFSCxPQUFPLENBQUUsTUFGTixDQUdILE1BQU0sQ0FBRSxNQUhMLENBRFQsRUFPRSwyREFDSSxLQUFLLENBQUUsQ0FDSCxXQUFXLENBQUUsTUFEVixDQUVILEtBQUssQ0FBRSxPQUZKLENBR0gsZUFBZSxDQUFFLDJCQUhkLENBSUgsU0FBUyxDQUFFLE9BSlIsQ0FLSCxZQUFZLENBQUUsV0FMWCxDQU1ILE9BQU8sQ0FBRSxNQU5OLENBRFgsRUFVSSwwREFBSSxTQUFTLENBQUMsa0JBQWQsQ0FBaUMsS0FBSyxDQUFFLENBQUMsU0FBUyxDQUFFLE1BQVos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QVMsQ0FBQyxlQUFoQixFQUFnQyw0REFBTSxTQUFTLENBQUMsWUFBaEIsRUFBNEIsa0NBQTVCLENBQWhDLENBRDdDLENBREYsQ0FERixDQTNCRixDQURGLENBRmMsQ0FUUixDQWtESyxLQUFLLEtBQUwsQ0FBVyxXQUFYLEdBQTJCLENBQTNCLEVBQWdDLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsR0FBbEIsQ0FBc0IsZUFBSyxDQUN4RCxrRUFDSSxHQUFHLENBQUUsOENBQU0sRUFEZixDQUVJLEtBQUssQ0FBRSxDQUNILE9BQU8sQ0FBRSxNQUROLENBRUgsY0FBYyxDQUFFLGVBRmIsQ0FHSCxPQUFPLENBQUUsTUFITixDQUZYLEVBUUksK0RBQ0ksK0RBQU0sS0FBSyxDQUFDLFFBQVosQyxHQUFBLENBQXVCLEtBQUssQ0FBQyxXQUE3QixDQURKLENBRUksK0RBQU0sS0FBSyxDQUFDLE9BQVosQyxHQUFBLENBQXNCLEtBQUssQ0FBQyxJQUE1QixDQUZKLENBUkosQ0FZSSwyREFDSSxLQUFLLENBQUUsQ0FDSCxLQUFLLENBQUUsT0FESixDQUVILFNBQVMsQ0FBRSxnREFGUixDQURYLENBS0ksR0FBRyxDQUFFLEtBQUssQ0FBQyxjQUxmLEVBWkosRUFrQk0sQ0FuQnVCLENBbERyQyxDQXhCRixDQURGLENBREksQ0FKRyxDQUFQLENBMEdILENBM0dELENBNEdKLG1CQUFDLENBaklELENBQXlDLCtDQUF6QyxFIiwiZmlsZSI6Ii4vQ2xpZW50QXBwL3BhZ2VzL0FjY291bnRQYWdlLnRzeC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgUm91dGVDb21wb25lbnRQcm9wcyB9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcbmltcG9ydCB7IEhlbG1ldCB9IGZyb20gXCJyZWFjdC1oZWxtZXRcIjtcbmltcG9ydCBsb2dvIGZyb20gXCJASW1hZ2VzL2xvZ28ucG5nXCI7XG5pbXBvcnQgVHJlZVZpZXdDb250YWluZXIgZnJvbSBcIkBDb21wb25lbnRzL3NoYXJlZC9UcmVlVmlld0NvbnRhaW5lclwiO1xuaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xuaW1wb3J0IHV1aWR2NCBmcm9tIFwidXVpZC92NFwiO1xuXG50eXBlIFByb3BzID0gUm91dGVDb21wb25lbnRQcm9wczx7fT47XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjY291bnRQYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFByb3BzLCB7b3JkZXJzLCBzZWxlY3RlZFRhYn0+IHtcbiAgICBzdGF0ZSA9IHtcbiAgICAgICAgb3JkZXJzOiBbXSxcbiAgICAgICAgc2VsZWN0ZWRUYWI6IDEsXG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgdXJsID0gYC9hcGkvT3JkZXIvU2VhcmNoYDtcbiAgICAgICAgYXhpb3MuZ2V0KHVybCkudGhlbihcbiAgICAgICAgICAgIHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIG9yZGVyczogcmVzLmRhdGEudmFsdWUua2V5LFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiA8ZGl2PlxuICAgICAgICAgICAgPEhlbG1ldD5cbiAgICAgICAgICAgICAgICA8dGl0bGU+SG9tZSBwYWdlIC0gUkNCIChUeXBlU2NyaXB0KTwvdGl0bGU+XG4gICAgICAgICAgICA8L0hlbG1ldD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyLWNvbnRlbnRcIj5cbiAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6ICdmbGV4J319IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiAnMTBweCcsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBtYXJnaW5SaWdodDogJzIwcHgnLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzMwMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjg1KScsXG4gICAgICAgICAgICAgICAgICAgIG1pbkhlaWdodDogJzQwMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMC4zMTI1cmVtJyxcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzEwcHgnLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cInNpZGViYXItc2VsZWN0b3JcIiBzdHlsZT17e2xpc3RTdHlsZTogJ25vbmUnLCBwYWRkaW5nOiAwLH19PlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB7dGhpcy5zZXRTdGF0ZSh7c2VsZWN0ZWRUYWI6IDEsfSl9fT5UaMO0bmcgdGluIHTDoGkga2hv4bqjbjwvYnV0dG9uPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YnV0dG9uIG9uQ2xpY2s9eygpID0+IHt0aGlzLnNldFN0YXRlKHtzZWxlY3RlZFRhYjogMix9KX19PlF14bqjbiBsw70gxJHGoW4gaMOgbmc8L2J1dHRvbj48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB7dGhpcy5zZXRTdGF0ZSh7c2VsZWN0ZWRUYWI6IDMsfSl9fT7EkOG7i2EgY2jhu4kgY+G7p2EgdMO0aTwvYnV0dG9uPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YnV0dG9uIG9uQ2xpY2s9eygpID0+IHt0aGlzLnNldFN0YXRlKHtzZWxlY3RlZFRhYjogNCx9KX19Pk3DoyBxdcOgIHThurduZzwvYnV0dG9uPjwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC44NSknLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcwLjMxMjVyZW0nLFxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMCAyMHB4JyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHt0aGlzLnN0YXRlLnNlbGVjdGVkVGFiID09PSAxICYmIFxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImpzeC0yNDE5MDc1MzY1XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwianN4LTEwMzg4OTIwNDcgdXNlci1hY2NvdW50LXNldHRpbmdzXCI+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImpzeC0xMDM4ODkyMDQ3IHRpdGxlLWFjY291bnRcIj5Uw6BpIGtob+G6o248L2gxPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwianN4LTQyMDQwMjA3MDggdXNlci1zZXR0aWdzLXNlY3Rpb25cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwianN4LTQyMDQwMjA3MDhcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJqc3gtOTYwMjIwODkzIHNlY3Rpb24tYWN0aW9uXCIgc3R5bGU9e3tkaXNwbGF5OiAnZmxleCcsfX0+XG4gICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cImpzeC05NjAyMjA4OTNcIiBzdHlsZT17e2ZsZXg6ICcxIDEgMCUnfX0+U+G7kSBkxrA8L2g0PlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImpzeC05NjAyMjA4OTNcIj48c3BhbiBzdHlsZT17e2ZvbnRTaXplOiAnMjBweCd9fT48c3BhbiBjbGFzc05hbWU9XCJub3RyYW5zbGF0ZSBcIj4w4oKrPC9zcGFuPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJqc3gtMzQwNzU3MzI4OVwiPkLhuqFuIGPDsyB0aOG7gyBkw7luZyBz4buRIGTGsCBuw6B5IMSR4buDIHRoYW5oIHRvw6FuIGNobyBuaOG7r25nIMSRxqFuIGjDoG5nIHNhdTxhIGNsYXNzTmFtZT1cImpzeC0zNDA3NTczMjg5IHRleHQtbm8tdW5kZXJsaW5lIHRleHQtcmlnaHRcIiBocmVmPVwiL3ZuL2FjY291bnQvZ2lmdGNhcmRcIj5T4butIGThu6VuZyB0aOG6uyBxdcOgIHThurduZzwvYT48L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJqc3gtNDIwNDAyMDcwOCB1c2VyLXNldHRpZ3Mtc2VjdGlvblwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJqc3gtNDIwNDAyMDcwOFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImpzeC05NjAyMjA4OTMgc2VjdGlvbi1hY3Rpb25cIj5cbiAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwianN4LTk2MDIyMDg5M1wiPlRow7RuZyB0aW4gY8OhIG5ow6JuPC9oND48c3BhbiBjbGFzc05hbWU9XCJqc3gtOTYwMjIwODkzXCI+PHNwYW4gY2xhc3NOYW1lPVwibGluay1zdHlsZVwiPlPhu61hPC9zcGFuPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLTRcIj5I4buNIHTDqm48L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtOCB0ZXh0LXJpZ2h0IHRleHQtdHJ1bmNhdGVcIj4gPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLTRcIj7EkOG7i2EgY2jhu4kgZW1haWw8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtOCB0ZXh0LXJpZ2h0IHRleHQtdHJ1bmNhdGVcIj5sbGF1Z3VzdHlAZ21haWwuY29tPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImpzeC00MjA0MDIwNzA4IHVzZXItc2V0dGlncy1zZWN0aW9uXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImpzeC00MjA0MDIwNzA4XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwianN4LTk2MDIyMDg5MyBzZWN0aW9uLWFjdGlvblwiPlxuICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJqc3gtOTYwMjIwODkzXCI+TeG6rXQga2jhuql1PC9oND48c3BhbiBjbGFzc05hbWU9XCJqc3gtOTYwMjIwODkzXCI+PHNwYW4gY2xhc3NOYW1lPVwibGluay1zdHlsZVwiPsSQ4buVaSBt4bqtdCBraOG6qXU8L3NwYW4+PC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAge3RoaXMuc3RhdGUuc2VsZWN0ZWRUYWIgPT09IDIgJiYgdGhpcy5zdGF0ZS5vcmRlcnMubWFwKG9yZGVyID0+IFxuICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e3V1aWR2NCgpfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMTBweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+e29yZGVyLmZ1bGxOYW1lfSx7b3JkZXIucGhvbmVOdW1iZXJ9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj57b3JkZXIuYWRkcmVzc30se29yZGVyLmNpdHl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgMC41cHggMCAwICNmZmZmZmYgaW5zZXQsIDAgMXB4IDJweCAwICNCM0IzQjMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz17b3JkZXIucmVwcmVzZW50YXRpdmV9IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+O1xuICAgIH1cbn0iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./ClientApp/pages/AccountPage.tsx\n");

/***/ }),

/***/ "./node_modules/uuid/lib/bytesToUuid.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/bytesToUuid.js ***!
  \**********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

eval("/**\n * Convert array of 16 byte values to UUID string format of the form:\n * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\n */\nvar byteToHex = [];\nfor (var i = 0; i < 256; ++i) {\n  byteToHex[i] = (i + 0x100).toString(16).substr(1);\n}\n\nfunction bytesToUuid(buf, offset) {\n  var i = offset || 0;\n  var bth = byteToHex;\n  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4\n  return ([bth[buf[i++]], bth[buf[i++]], \n\tbth[buf[i++]], bth[buf[i++]], '-',\n\tbth[buf[i++]], bth[buf[i++]], '-',\n\tbth[buf[i++]], bth[buf[i++]], '-',\n\tbth[buf[i++]], bth[buf[i++]], '-',\n\tbth[buf[i++]], bth[buf[i++]],\n\tbth[buf[i++]], bth[buf[i++]],\n\tbth[buf[i++]], bth[buf[i++]]]).join('');\n}\n\nmodule.exports = bytesToUuid;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdXVpZC9saWIvYnl0ZXNUb1V1aWQuanM/MjM2NiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvdXVpZC9saWIvYnl0ZXNUb1V1aWQuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvbnZlcnQgYXJyYXkgb2YgMTYgYnl0ZSB2YWx1ZXMgdG8gVVVJRCBzdHJpbmcgZm9ybWF0IG9mIHRoZSBmb3JtOlxuICogWFhYWFhYWFgtWFhYWC1YWFhYLVhYWFgtWFhYWFhYWFhYWFhYXG4gKi9cbnZhciBieXRlVG9IZXggPSBbXTtcbmZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgYnl0ZVRvSGV4W2ldID0gKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnN1YnN0cigxKTtcbn1cblxuZnVuY3Rpb24gYnl0ZXNUb1V1aWQoYnVmLCBvZmZzZXQpIHtcbiAgdmFyIGkgPSBvZmZzZXQgfHwgMDtcbiAgdmFyIGJ0aCA9IGJ5dGVUb0hleDtcbiAgLy8gam9pbiB1c2VkIHRvIGZpeCBtZW1vcnkgaXNzdWUgY2F1c2VkIGJ5IGNvbmNhdGVuYXRpb246IGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMxNzUjYzRcbiAgcmV0dXJuIChbYnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSwgXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sICctJyxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSwgJy0nLFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLCAnLScsXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sICctJyxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXV0pLmpvaW4oJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ5dGVzVG9VdWlkO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/uuid/lib/bytesToUuid.js\n");

/***/ }),

/***/ "./node_modules/uuid/lib/rng.js":
/*!**************************************!*\
  !*** ./node_modules/uuid/lib/rng.js ***!
  \**************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

eval("// Unique ID creation requires a high quality random # generator.  In node.js\n// this is pretty straight-forward - we use the crypto API.\n\nvar crypto = __webpack_require__(/*! crypto */ \"crypto\");\n\nmodule.exports = function nodeRNG() {\n  return crypto.randomBytes(16);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdXVpZC9saWIvcm5nLmpzPzUzZDciXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTs7QUFFQSxhQUFhLG1CQUFPLENBQUMsc0JBQVE7O0FBRTdCO0FBQ0E7QUFDQSIsImZpbGUiOiIuL25vZGVfbW9kdWxlcy91dWlkL2xpYi9ybmcuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiAgSW4gbm9kZS5qc1xuLy8gdGhpcyBpcyBwcmV0dHkgc3RyYWlnaHQtZm9yd2FyZCAtIHdlIHVzZSB0aGUgY3J5cHRvIEFQSS5cblxudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vZGVSTkcoKSB7XG4gIHJldHVybiBjcnlwdG8ucmFuZG9tQnl0ZXMoMTYpO1xufTtcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/uuid/lib/rng.js\n");

/***/ }),

/***/ "./node_modules/uuid/v4.js":
/*!*********************************!*\
  !*** ./node_modules/uuid/v4.js ***!
  \*********************************/
/*! no static exports found */
/*! exports used: default */
/***/ (function(module, exports, __webpack_require__) {

eval("var rng = __webpack_require__(/*! ./lib/rng */ \"./node_modules/uuid/lib/rng.js\");\nvar bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ \"./node_modules/uuid/lib/bytesToUuid.js\");\n\nfunction v4(options, buf, offset) {\n  var i = buf && offset || 0;\n\n  if (typeof(options) == 'string') {\n    buf = options === 'binary' ? new Array(16) : null;\n    options = null;\n  }\n  options = options || {};\n\n  var rnds = options.random || (options.rng || rng)();\n\n  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`\n  rnds[6] = (rnds[6] & 0x0f) | 0x40;\n  rnds[8] = (rnds[8] & 0x3f) | 0x80;\n\n  // Copy bytes to buffer, if provided\n  if (buf) {\n    for (var ii = 0; ii < 16; ++ii) {\n      buf[i + ii] = rnds[ii];\n    }\n  }\n\n  return buf || bytesToUuid(rnds);\n}\n\nmodule.exports = v4;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdXVpZC92NC5qcz9jNjRlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFVBQVUsbUJBQU8sQ0FBQyxpREFBVztBQUM3QixrQkFBa0IsbUJBQU8sQ0FBQyxpRUFBbUI7O0FBRTdDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL3V1aWQvdjQuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgcm5nID0gcmVxdWlyZSgnLi9saWIvcm5nJyk7XG52YXIgYnl0ZXNUb1V1aWQgPSByZXF1aXJlKCcuL2xpYi9ieXRlc1RvVXVpZCcpO1xuXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcblxuICBpZiAodHlwZW9mKG9wdGlvbnMpID09ICdzdHJpbmcnKSB7XG4gICAgYnVmID0gb3B0aW9ucyA9PT0gJ2JpbmFyeScgPyBuZXcgQXJyYXkoMTYpIDogbnVsbDtcbiAgICBvcHRpb25zID0gbnVsbDtcbiAgfVxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB2YXIgcm5kcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBybmcpKCk7XG5cbiAgLy8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuICBybmRzWzZdID0gKHJuZHNbNl0gJiAweDBmKSB8IDB4NDA7XG4gIHJuZHNbOF0gPSAocm5kc1s4XSAmIDB4M2YpIHwgMHg4MDtcblxuICAvLyBDb3B5IGJ5dGVzIHRvIGJ1ZmZlciwgaWYgcHJvdmlkZWRcbiAgaWYgKGJ1Zikge1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCAxNjsgKytpaSkge1xuICAgICAgYnVmW2kgKyBpaV0gPSBybmRzW2lpXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmIHx8IGJ5dGVzVG9VdWlkKHJuZHMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHY0O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/uuid/v4.js\n");

/***/ })

};;