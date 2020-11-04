import React, { Component } from "react";
import { getCursorStyleWithRotateAngle, getCursorStyleForResizer, tLToCenter, getImageResizerVisibility, } from "@Utils";
import StyledRect from "./StyledRect";
import SingleText from "@Components/editor/Text/SingleText";
import Image from "@Components/editor/Rect/Image";
import ClipImage from "@Components/editor/Rect/ClipImage";
import Video from "@Components/editor/Rect/Video";
import { TemplateType, CanvasType, } from "../enums";
import editorStore from "@Store/EditorStore";
import { clone } from "lodash";
import { secondToMinutes, degToRadian, } from "@Utils";
import { getLetterSpacing, processChildren, } from "@Utils";
import styled from "styled-components";
import Canvas from "../Canvas";

const zoomableMap = {
	n: "t",
	s: "b",
	e: "r",
	w: "l",
	ne: "tr",
	nw: "tl",
	se: "br",
	sw: "bl"
};

declare global {
	interface Window {
		paymentScope: any;
		resizingInnerImage: any;
		startX: any;
		startY: any;
		rect: any;
		rect2: any;
	}
}

export interface IProps {
	selected: boolean;
	id: string;
	childId: string;
	scale: number;
	onRotateStart(e): void;
	onResizeStart: any;
	handleResizeInnerImageStart: any;
	parentRotateAngle: number;
	showController: boolean;
	onTextChange: any;
	onFontSizeChange(fontSize: number): void;
	handleFontColorChange(fontColor: string): void;
	handleFontFaceChange(fontFace: string): void;
	handleChildIdSelected(childId: string): void;
	disableCropMode(): void;
	cropMode: boolean;
	showImage: boolean;
	bleed: boolean;
	image: any;
	name: any;
	canvas: string;
	toggleVideo: any;
	handleImageSelected: any;
	handleImageHovered: any;
	handleImageUnhovered: any;
	handleDragStart: any;
	doNoObjectSelected: any;
	handleCropBtnClick: any;
	handleGridCrop: any;
	handleChildCrop: any;
	handleGridSelected: any;
}

export interface IState {
	editing: boolean;
	selectionScaleX: number;
	selectionScaleY: number;
	paused: boolean;
	videoControllerShow: boolean;
	image: any;
	cropMode: boolean;
	max: any;
	currentTime: any;
	gridSelected: number;
}

export default class Rect extends Component<IProps, IState> {

	childrens = {};
	cropLayer = null;

	constructor(props) {
		super(props);

		this.state = {
			videoControllerShow: false,
			editing: false,
			selectionScaleX: null,
			selectionScaleY: null,
			image: clone(props.image),
			cropMode: props.cropMode,
			paused: props.image.paused,
			max: 0,
			currentTime: 0,
		}

		this.handleImageSelected = this.handleImageSelected.bind(this);
		this.handleImageUnselected = this.handleImageUnselected.bind(this);
		this.updateImage = this.updateImage.bind(this);
		this.enableCropMode = this.enableCropMode.bind(this);
		this.setMax = this.setMax.bind(this);
		this.setCurrentTime = this.setCurrentTime.bind(this);
	}

	componentDidMount() {
		const {
			image: {
				innerHTML,
				type,
			}
		} = this.props;
		if (innerHTML && this.$textEle) {
			this.$textEle.innerHTML = innerHTML;
		}
		if (innerHTML && this.$textEle2) {
			this.$textEle2.innerHTML = innerHTML;
		}

		if (type == TemplateType.Gradient ||
			type == TemplateType.Shape) {
			let el = document.getElementById(this.props.image._id + "1235" + this.props.canvas);

			if (el && this.props.image.colors) {
				for (let j = 0; j < this.props.image.colors.length; ++j) {
					let elColors = el.getElementsByClassName("color-" + (j + 1));
					for (let i = 0; i < elColors.length; ++i) {
						let ell = elColors[i] as HTMLElement;
						let field = ell.getAttribute("field");
						if (ell.tagName == "stop") {
							if (!field) field = "stopColor";
							ell.style[field] = this.props.image.colors[j];
						} else if (ell.tagName == "path" || ell.tagName == "circle" || ell.tagName == "g" || ell.tagName == "polygon") {
							if (!field) field = "fill";
							ell.style[field] = this.props.image.colors[j];
						}
					}
				}
			}
		}

		const {
			image: {
				selected,
			},
		} = this.state;

		const cropMode = editorStore.cropMode;

		if (cropMode && selected) {
			let aloEL = document.getElementById('screen-container-parent');
			let canvas = document.getElementsByClassName('canvas-' + this.props.image.page)[0];
			if (this.cropLayer && aloEL && canvas) {
				let rectAloEL = aloEL.getBoundingClientRect();
				let rectCanvas = canvas.getBoundingClientRect();
				let left = rectAloEL.left - rectCanvas.left;
				let top = rectAloEL.top - rectCanvas.top - aloEL.scrollTop;
				let width = rectAloEL.right - rectAloEL.left;
				let height = aloEL.scrollHeight;
				this.cropLayer.style.left = left + "px";
				this.cropLayer.style.top = top + "px";
				this.cropLayer.style.width = width + "px";
				this.cropLayer.style.height = height + "px";

			}
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.scale != nextProps.scale) {
			return true;
		}
		if (this.state.image.selected || nextState.image.selected) {
			return true;
		}
		if (this.state.image.hovered || nextState.image.hovered) {
			return true;
		}
		return false;
	}

	componentDidUpdate(prevProps, prevState) {

		const {
			image: {
				type,
				selected,
				innerHTML,
			},
		} = this.state;

		const cropMode = editorStore.cropMode;

		if (
			type === TemplateType.Heading &&
			(selected != prevState.image.selected || this.props.name == CanvasType.Download) &&
			this.$textEle2
		) {
			this.$textEle2.innerHTML = innerHTML;
		}

		if (cropMode && selected) {
			let aloEL = document.getElementById('screen-container-parent');
			let canvas = document.getElementsByClassName('canvas-' + this.props.image.page)[0];
			if (this.cropLayer && aloEL && canvas) {
				let rectAloEL = aloEL.getBoundingClientRect();
				let rectCanvas = canvas.getBoundingClientRect();
				let left = rectAloEL.left - rectCanvas.left;
				let top = rectAloEL.top - rectCanvas.top - aloEL.scrollTop;
				let width = rectAloEL.right - rectAloEL.left;
				let height = aloEL.scrollHeight;
				this.cropLayer.style.left = left + "px";
				this.cropLayer.style.top = top + "px";
				this.cropLayer.style.width = width + "px";
				this.cropLayer.style.height = height + "px";

			}
		}
	}

	toggleVideo = () => {
		this.setState({ paused: !this.state.paused });
		this.forceUpdate();
	}

	startRotate = e => {
		e.preventDefault();
		this.props.onRotateStart && this.props.onRotateStart(e);
	};

	startResizeImage = (e, cursor, resizingInnerImage) => {
		e.preventDefault();
		e.stopPropagation();
		document.body.style.cursor = cursor;

		this.props.handleResizeInnerImageStart &&
			this.props.handleResizeInnerImageStart(e, cursor);
		window.resizingInnerImage = resizingInnerImage;
	};

	startResize = (e, cursor) => {
		e.preventDefault();
		this.props.onResizeStart && this.props.onResizeStart(e, cursor);
	};

	$textEle = null;
	$textEle2 = null;

	setTextElementRef = ref => {
		this.$textEle = ref;
	};

	setTextElementRef2 = ref => {
		this.$textEle2 = ref;
	};

	innerHTML = () => {
		const {
			image: {
				innerHTML,
			}
		} = this.props;
		let parser = new DOMParser();
		let dom = parser.parseFromString(
			"<!doctype html><body>" + innerHTML,
			"text/html"
		);
		let decodedString = dom.body.textContent;
		return decodedString;
	};

	pauseVideo = () => {
		let el = document.getElementById(this.props.image._id + "video" + "alo") as HTMLVideoElement;
		el.pause();
		this.setState({
			paused: true,
			currentTime: Math.floor((el.currentTime / el.duration) * 100),
		})
	}

	playVideo = () => {
		let el = document.getElementById(this.state.image._id + "video" + "alo") as HTMLVideoElement;
		el.currentTime = 0;
		el.play();
	}

	handleImageSelected() {
		if (this.hideWhenDownload)
			this.hideWhenDownload.style.opacity = 1;
		let image = clone(this.state.image);
		image.selected = true;
		image.hovered = true;

		this.setState({
			image,
		});

		this.forceUpdate();
	}

	handleImageHovered() {
		if (this.hideWhenDownload)
			this.hideWhenDownload.style.opacity = 1;

		let image = clone(this.state.image);
		image.hovered = true;

		this.setState({
			image,
		});

		this.forceUpdate();
	}

	handleImageUnhovered() {
		let image = clone(this.state.image);
		image.hovered = false;

		this.setState({
			image,
		});

		this.forceUpdate();
	}

	handleImageUnselected() {
		let image = clone(this.state.image);
		image.selected = false;
		image.hovered = false;

		this.setState({
			image,
		});

		this.forceUpdate();
	}

	updateInnerHTML(innerHTML) {
		if (innerHTML && this.$textEle2) {
			this.$textEle2.innerHTML = innerHTML;
		}
	}

	updateImage(image) {
		this.setState({
			image: clone(image),
		});

		this.forceUpdate();
	}

	handleTextChildSelected(id) {
		let image = clone(this.state.image);
		image.selected = true;
		if (image.document_object) {
			image.document_object = image.document_object.map(doc => {
				if (doc._id == id) {
					doc.selected = true;
				} else {
					doc.selected = false;
				}
				return doc;
			});
		}

		this.setState({
			image,
		});

		this.forceUpdate();
	}

	handleGridSelected(id) {
		this.setState({ gridSelected: id });

		this.forceUpdate();
	}

	enableCropMode() {
		this.setState({ cropMode: true });
		this.forceUpdate();
	}

	disableCropMode() {
		this.setState({ cropMode: false });

		this.forceUpdate();
	}

	setMax(max) {
		this.setState({ max })
	}

	setCurrentTime(currentTime) {
		this.setState({ currentTime })
	}

	hideWhenDownload = null;

	render() {
		const {
			parentRotateAngle,
			showController,
			scale,
			onTextChange,
			handleChildIdSelected,
			name,
			canvas,
		} = this.props;

		const cropMode = editorStore.cropMode;

		const {
			// cropMode,
			image: {
				page,
				hovered,
				selected,
				_id,
				scaleX,
				scaleY,
				document_object,
				backgroundColor,
				opacity: opacity2,
				effectId,
				width,
				height,
				fontFace,
				italic,
				align,
				bold,
				color,
				rotateAngle,
				src,
				srcThumnail,
				posX: posX2,
				posY: posY2,
				imgWidth: imgWidth2,
				imgHeight: imgHeight2,
				textShadowTransparent,
				shadowColor,
				filter,
				intensity,
				offSet,
				direction: effectDirection,
				blur,
				lineHeight,
				letterSpacing,
				fontSize,
				type,
				left,
				top,
				hollowThickness,
				clipScale,
				path,
				clipId,
				clipWidth,
				clipHeight,
				path2,
				grids,
				gridTemplateAreas,
				gridTemplateColumns,
				gridTemplateRows,
				gap,
				existImage,
			}
		} = this.state;

		let grid = grids;
		const regex = /\[CALC.+?]/gm;

		let ABC;
		if (type == TemplateType.Gradient || type == TemplateType.Shape) {
			let cnt = 1;
			let xml = path ? path : "";

			try {
				let res = xml.match(regex);
				if (res) {
					for (let i = 0; i < res.length; ++i) {
						let tmp = res[i].substring(6, res[i].length - 1);
						tmp = tmp.replace("VIEWBOX_WIDTH", width / 2);
						tmp = tmp.replace("VIEWBOX_HEIGHT", height / 2);
						xml = xml.replaceAll(res[i], eval(tmp));
					}
				}
			}
			catch (e) {
			}

			while (cnt < 15 && xml) {
				let newXml = xml.replaceAll('SVGID_' + cnt + '_', _id + cnt + name);
				xml = newXml;
				++cnt;
			}

			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(xml, 'text/xml');

			ABC = processChildren(Array.from(xmlDoc.childNodes), _id + "svg" + canvas);

		}

		let zIndex = this.state.image.zIndex;
		if (type == TemplateType.BackgroundImage) zIndex = 0;

		const imgWidth = imgWidth2 * scale;
		const imgHeight = imgHeight2 * scale;
		const posX = posX2 * scale;
		const posY = posY2 * scale;

		const opacity = opacity2 ? opacity2 / 100 : 1;

		const imgResizeDirection = ["nw", "ne", "se", "sw", "e", "w", "s", "n"];
		const cropImageResizeDirection = ["nw", "ne", "se", "sw"];
		const textResizeDirection = ["nw", "ne", "se", "sw"];
		const groupedItemResizeDirection = ["nw", "ne", "se", "sw"];

		let imgDirections = imgResizeDirection;

		if (type === TemplateType.Heading || type === TemplateType.TextTemplate) {
			imgDirections = textResizeDirection;
			if (!existImage) imgDirections = imgDirections.concat(["e", "w"]);
		}

		if (type == TemplateType.GroupedItem || type == TemplateType.Element) {
			imgDirections = groupedItemResizeDirection;
		}

		if (height * scale <= 30) {
			imgDirections = imgDirections.filter(d => d != "w" && d != "e")
		}

		if (width * scale <= 30) {
			imgDirections = imgDirections.filter(d => d != "n" && d != "s")
		}

		let customAttr = {
			width: width * scale,
			height: height * scale,
			angle: rotateAngle,
			iden: type != TemplateType.BackgroundImage ? _id : "",
			page: page,
		};


		return (
			<div>
				<div
					ref={i => this.cropLayer = i}
					style={{
						position: 'absolute',
						backgroundColor: 'rgba(53,71,90,.2)',
						zIndex: 999999,
						pointerEvents: "auto",
						display: cropMode && selected && name == CanvasType.HoverLayer ? "block" : "none",
					}}
					onClick={e => {
						this.props.disableCropMode();
					}}
				>
				</div>
				<div
					className={_id + `aaaa${canvas}`}
					id={_id + (name == CanvasType.HoverLayer ? `__${canvas}` : `_${canvas}`)}
					key={_id}
					style={{
						zIndex: ((name == CanvasType.HoverLayer && (selected || hovered)) || (name == CanvasType.All && cropMode)) ? 999999 : zIndex,
						width: width * scale + "px",
						height: height * scale + "px",
						position: "absolute",
						transform: `translate(${left * scale}px, ${top * scale}px) rotate(${rotateAngle ? rotateAngle : 0}deg)`,
						pointerEvents: (name == CanvasType.HoverLayer) ? "none" : "all",
					}}
				>
					<div
						style={{
							width: width * scale + "px",
							height: height * scale + "px",
							transformOrigin: "0 0",
							pointerEvents: (name == CanvasType.HoverLayer && !cropMode) ? "none" : "all",
						}}
						key={_id}
						onMouseDown={(e) => {
							if ((type != TemplateType.BackgroundImage || (type == TemplateType.BackgroundImage && cropMode)) &&
								(name == CanvasType.All || name == CanvasType.HoverLayer)) {
								if (!editorStore.cropMode) {
									if (!selected) {
										this.handleImageSelected();
										this.props.handleImageSelected(_id, page, name == CanvasType.HoverLayer ? CanvasType.All : CanvasType.HoverLayer);
									}
									this.props.handleDragStart(e, _id);
								} else if (cropMode) {
									this.props.handleDragStart(e, _id);
								} else {
									this.props.doNoObjectSelected();
								}
							}
						}}
						onClick={e => {
							if (type == TemplateType.BackgroundImage && !window.selectionStart && name == CanvasType.All && !editorStore.cropMode) {
								if (!cropMode) {
									if (!selected) {
										this.handleImageSelected();
										this.props.handleImageSelected(_id, page, CanvasType.HoverLayer);
									}
								} else if (cropMode) {
									this.props.handleDragStart(e, _id);
								} else {
									this.props.doNoObjectSelected();
								}
							}
						}}

						onMouseEnter={(e) => {
							if (!selected && type != TemplateType.BackgroundImage && !editorStore.cropMode && !window.selectionStart && name == CanvasType.All) {
								this.handleImageHovered();
								this.props.handleImageHovered(_id, page);
							}
						}}

						onMouseLeave={(e) => {
							if (hovered && !selected && type != TemplateType.BackgroundImage && !editorStore.cropMode && name == CanvasType.All) {
								this.handleImageUnhovered();
								this.props.handleImageUnhovered(_id, page);
							}
						}}
					>
						<StyledRect
							onDoubleClick={e => {
								e.preventDefault();
								if (!cropMode) this.props.handleCropBtnClick(_id);
							}}
							onMouseEnter={e => {
								if (window.imagedragging && type == TemplateType.Element) {
									window.imgDragging.style.opacity = 0;
									let el = document.getElementById(_id + "1235alo") as HTMLImageElement;
									el.src = window.imagesrc;
									window.imageselected = _id;

									let rec2 = window.imgDragging.getBoundingClientRect();

									let ratio = rec2.width / rec2.height;
									window.oldWidth = el.style.width;
									window.oldHeight = el.style.height;
									window.oldTransform = el.style.transform;
									el.style.transform = '';

									let clipScale = width / clipWidth;

									let imgWidth2 = width;
									let imgHeight2 = width / ratio;

									if (imgHeight2 < height) {
										imgWidth2 = height * ratio;
										imgHeight2 = height;
									}

									el.style.width = imgWidth2 / clipScale + "px";
									el.style.height = imgHeight2 / clipScale + "px";
								}
							}}
							onMouseLeave={e => {
								if (type == TemplateType.Element) {
									window.imgDragging.style.opacity = 1;
									let el = document.getElementById(_id + "1235alo") as HTMLImageElement;
									el.src = src;
									if (window.oldWidth) {
										el.style.width = window.oldWidth;
										window.oldWidth = null;
									}
									if (window.oldHeight) {
										el.style.height = window.oldHeight;
										window.oldHeight = null;
									}
									if (window.oldTransform) {
										el.style.transform = window.oldTransform;
										window.oldTransform = null;
									}
									window.imageselected = null;
								}
							}}
							className={type == TemplateType.BackgroundImage && "selectable"}
							style={{
								width: "100%",
								height: "100%",
								pointerEvents: (name == CanvasType.HoverLayer && !cropMode) ? "none" : "all",
								backgroundColor: type == TemplateType.BackgroundImage && name != CanvasType.HoverLayer && color,
							}}>
							{!cropMode &&
								name == CanvasType.HoverLayer &&
								selected &&
								type !== TemplateType.BackgroundImage && (
									<div
										id={_id + "rotate-container"}
										className="rotate-container"
										style={{
											width: "18px",
											height: "18px",
											left: `calc(50% - 6}px)`,
											bottom: "-45px",
											cursor: getCursorStyleWithRotateAngle(rotateAngle),
											pointerEvents: "all",
										}}
										onMouseDown={this.startRotate}
									>
										<div
											className="rotate"
											style={{
												padding: "3px"
											}}
										>
											<img src={require("@Components/shared/svgs/editor/toolbar/rotate.svg")} />
										</div>
									</div>
								)}

							{!cropMode &&
								name == CanvasType.HoverLayer &&
								selected &&
								type !== TemplateType.BackgroundImage &&
								imgDirections.map(d => {
									let cursor = getCursorStyleForResizer(rotateAngle, d);

									return (
										<div
											id={d}
											key={d}
											style={{
												cursor,
												pointerEvents: "all",
											}}
											className={`${zoomableMap[d]} resizable-handler-container`}
											onMouseDown={e => this.startResize(e, d)}
										>
											<div
												id={d}
												key={d}
												style={{
													cursor
												}}
												className={`${zoomableMap[d]} resizable-handler`}
												onMouseDown={e => this.startResize(e, d)}
											/>
										</div>
									);
								})}
							{(name == CanvasType.All || name == CanvasType.Preview ||
								(cropMode && name == CanvasType.HoverLayer) ||
								name == CanvasType.Download) &&
								src &&
								(type === TemplateType.Image || type === TemplateType.BackgroundImage || type == TemplateType.Element || type == TemplateType.Gradient) && (
									<div
										id={_id}
										style={{
											zIndex: selected && type !== TemplateType.Image && type !== TemplateType.BackgroundImage && type !== TemplateType.Element ? 1 : 0,
											transformOrigin: "0 0",
											position: "absolute",
											width: "100%",
											height: "100%",
											pointerEvents: "none",
										}}
									>
										{(type === TemplateType.Image || type === TemplateType.BackgroundImage) &&
											<div
												id={_id + "hihi4" + canvas}
												style={{
													width: '100%',
													height: '100%',
													position: "absolute",
													overflow: "hidden",
													opacity,
												}}
												onDoubleClick={e => {
													e.preventDefault();
													this.props.handleCropBtnClick(_id);
												}}
											>
												<Image
													canvas={canvas}
													_id={_id}
													imgWidth={imgWidth}
													imgHeight={imgHeight}
													posX={posX}
													posY={posY}
													selected={selected}
													cropMode={cropMode}
													backgroundColor={backgroundColor}
													src={src}
													enableCropMode={null}
													srcThumnail={srcThumnail}
												/>
											</div>}
										{(type === TemplateType.Element) && <div
											id={_id + "hihi4" + canvas}
											style={{
												position: "absolute",
												overflow: !this.props.bleed && "hidden",
												opacity,
												transform: `scale(${width * scale / clipWidth})`,
												transformOrigin: '0 0',
												width: `${1 / (width * scale / clipWidth) * 100}%`,
												height: `${1 / (width * scale / clipWidth) * 100}%`,
											}}
											onDoubleClick={e => {
												e.preventDefault();
												this.props.handleCropBtnClick(_id);
											}}
										>
											<ClipImage
												name={name}
												canvas={canvas}
												_id={_id}
												imgWidth={imgWidth}
												imgHeight={imgHeight}
												width={width * scale}
												height={height * scale}
												posX={posX}
												posY={posY}
												clipScale={clipScale}
												selected={selected}
												cropMode={cropMode}
												backgroundColor={backgroundColor}
												src={src}
												enableCropMode={null}
												srcThumnail={srcThumnail}
												path={path}
												clipId={clipId}
												clipWidth={clipWidth}
												clipHeight={clipHeight}
												path2={path2}
											/>
										</div>}
										{selected && cropMode && (
											<div
												style={{
													width: "100%",
													height: "100%",
													position: "absolute"
												}}
											>
												<div
													className={`${_id}1236` + canvas}
													style={{
														width: imgWidth + "px",
														height: imgHeight + "px",
														transform: `translate(${posX}px, ${posY}px)`
													}}
												>
													{<div
														className="hideWhenDownload"
														style={{
															position: "absolute",
															top: "-1px",
															left: "-1px",
															right: "-1px",
															bottom: "-1px",
															backgroundImage:
																(type == TemplateType.TextTemplate || type == TemplateType.GroupedItem) ? `linear-gradient(90deg,#00d9e1 60%,transparent 0),linear-gradient(180deg,#00d9e1 60%,transparent 0),linear-gradient(90deg,#00d9e1 60%,transparent 0),linear-gradient(180deg,#00d9e1 60%,transparent 0)`
																	: 'linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1),linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1)',
															backgroundPosition: 'top,100%,bottom,0',
															backgroundSize: '12px 2px,2px 12px,12px 2px,2px 12px',
															backgroundRepeat: 'repeat-x,repeat-y,repeat-x,repeat-y',
															opacity: (hovered || selected) ? 1 : 0,
															pointerEvents: "none",
														}}>

													</div>}
													{name == CanvasType.HoverLayer && (type === TemplateType.Image || type === TemplateType.BackgroundImage || type == TemplateType.Element) && (
														<img
															style={{
																width: "100%",
																height: "100%",
																opacity: 0.5,
																transformOrigin: "0 0"
															}}
															src={src}
														/>
													)}
													<div
														style={{
															opacity: 0.5,
														}}
													>
														{ABC}
													</div>
													{/* {name == CanvasType.HoverLayer && (type === TemplateType.Gradient) && (
														<svg
														style={{
															width: "100%",
															height: "100%",
															opacity: 0.5,
															transformOrigin: "0 0",
														}}
														xmlns="http://www.w3.org/2000/svg"
														xmlnsXlink="http://www.w3.org/1999/xlink"
														preserveAspectRatio="xMidYMidmeet"
														version="1.0"
														viewBox={`${clipWidth0} ${clipHeight0} ${clipWidth} ${clipHeight}`}
														zoomAndPan="magnify"
													>
														<defs>
															<linearGradient gradientTransform={gradientTransform} gradientUnits="userSpaceOnUse" id={_id + clipId + name} x1={x1} x2={x2} y1={y1} y2={y2}>
																<stop offset={0} style={{ stopColor: stopColor1, }} />
																<stop offset={1} style={{ stopColor: stopColor2, }} />
															</linearGradient>
														</defs>
														{ABC}
														</svg>
													)} */}
												</div>
											</div>
										)}
									</div>
								)}
							{selected && (name == CanvasType.HoverLayer) && type == TemplateType.Grids &&
								<div
									id={_id}
									className="aloalo"
									style={{
										zIndex: selected && type !== TemplateType.Image && type !== TemplateType.BackgroundImage && type !== TemplateType.Element ? 1 : 0,
										transformOrigin: "0 0",
										width: "100%",
										height: "100%",
									}}
								>
									{grid && grid.map((g, id) => {
										if (id == this.state.gridSelected) {
											let boxWidth = (width - g.gapWidth) * g.width / 100;
											let boxHeight = (height - g.gapHeight) * g.height / 100;
											let width2 = boxWidth;
											let height2 = boxHeight;
											let offsetLeft = (width * scale - g.gapLeft * scale) * g.left / 100 + g.gapLeft * scale;
											let offsetTop = (height * scale - g.gapTop * scale) * g.top / 100 + g.gapTop * scale;
											let left2 = offsetLeft / scale;
											let top2 = offsetTop / scale;

											return <div
												style={{
													zIndex: 1,
													position: "relative",
													transform: `translate(${left2 * scale}px, ${top2 * scale}px)`,
													width: width2 * scale + "px",
													height: height2 * scale + "px",
												}}
											>
												<div
													className="hide-when-resize"
													style={{
														zIndex: 1,
														position: "absolute",
														backgroundImage: 'linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1),linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1)',
														backgroundPosition: 'top,100%,bottom,0',
														backgroundSize: '12px 2px,2px 12px,12px 2px,2px 12px',
														backgroundRepeat: 'repeat-x,repeat-y,repeat-x,repeat-y',
														pointerEvents: "none",
														left: '-1px',
														bottom: '-1px',
														top: '-1px',
														right: '-1px',
													}}
												>

												</div>
											</div>;
										}
										return null;
									})}
								</div>
							}
							{(name == CanvasType.All || name == CanvasType.Download || name == CanvasType.Preview) && type == TemplateType.Grids &&
								<div
									id={_id}
									style={{
										zIndex: selected && type !== TemplateType.Image && type !== TemplateType.BackgroundImage && type !== TemplateType.Element ? 1 : 0,
										transformOrigin: "0 0",
										position: "absolute",
										width: "100%",
										height: "100%",
										overflow: (type == TemplateType.Gradient || type == TemplateType.Grids) ? 'hidden' : 'auto',
									}}
								>
									<div
										className={_id + "aaaa2" + canvas}
										style={{
											width: width + "px",
											height: height + "px",
											transform: `scale(${scale})`,
											transformOrigin: '0 0',
										}}
									>
										<div
											className={_id + "aaaa2" + canvas}
											style={{
												width: width + "px",
												height: height + "px",
											}}
										>
											<div
												style={{
													display: 'grid',
													width: `100%`,
													height: `100%`,
													gridTemplateAreas: gridTemplateAreas,
													gridTemplateColumns: gridTemplateColumns,
													gridTemplateRows: gridTemplateRows,
													gap: `${gap}px`,
												}}>
												{grid && grid.map((g, index) =>
													<div
														onMouseEnter={e => {
															if (window.imagedragging && type == TemplateType.Grids) {
																window.imageselected = _id;
																window.gridIndex = index;
																window.imgDragging.style.opacity = 0;
																let el = e.currentTarget;
																el.children[0].children[0].src = window.imagesrc;
																el.children[0].children[0].style.display = "block";

																let rec2 = window.imgDragging.getBoundingClientRect();

																let boxWidth = (width - g.gapWidth) * g.width / 100;
																let boxHeight = (height - g.gapHeight) * g.height / 100;
																let ratio = rec2.width / rec2.height;

																let imgWidth = boxWidth;
																let imgHeight = imgWidth / ratio;
																if (imgHeight < boxHeight) {
																	imgHeight = boxHeight;
																	imgWidth = imgHeight * ratio;
																}

																window.oldWidth = el.children[0].style.width;
																window.oldHeight = el.children[0].style.height;
																window.oldTransform = el.children[0].style.transform;

																el.children[0].style.width = imgWidth + "px";
																el.children[0].style.height = imgHeight + "px";
																let posX = (boxWidth - imgWidth) / 2;
																let posY = (boxHeight - imgHeight) / 2;
																el.children[0].style.transform = `translate(${posX}px, ${posY}px)`;
															}
														}}
														onMouseLeave={e => {
															if (window.imagedragging && type == TemplateType.Grids) {
																window.imgDragging.style.opacity = 1;

																let el = e.currentTarget;
																el.children[0].children[0].src = g.src;
																if (!g.src) el.children[0].children[0].style.display = "none";

																window.imageselected = null;
																window.gridIndex = undefined;


																if (window.oldWidth) {
																	el.children[0].style.width = window.oldWidth;
																	window.oldWidth = null;
																}
																if (window.oldHeight) {
																	el.children[0].style.height = window.oldHeight;
																	window.oldHeight = null;
																}
																if (window.oldTransform) {
																	el.children[0].style.transform = window.oldTransform;
																	window.oldTransform = null;
																}
															}
														}}
														onDoubleClick={e => {

															e.preventDefault();
															e.stopPropagation();
															this.props.handleGridCrop(index);
														}}
														onClick={e => {
															e.preventDefault();
															e.stopPropagation();
															this.props.handleGridSelected(index);
														}}
														style={{
															gridArea: g.gridArea,
															overflow: "hidden",
															backgroundImage: !g.src && `url(https://static.canva.com/web/images/87e22a62965f141aa08e93699b0b3527.jpg)`,
															backgroundSize: 'auto 100%',
															backgroundPosition: '50%',
														}}>
														<div
															id={_id + index + canvas + "grid"}
															style={{
																width: g.imgWidth,
																height: g.imgHeight,
																transform: `translate(${g.posX}px, ${g.posY}px)`,
																pointerEvents: "none",
															}}
														>
															<img
																style={{
																	height: "100%",
																	width: "100%",
																	display: g.src ? "block" : "none",
																}}
																id="iXmWi6SMfU6PrsUqZLRXQ" src={g.src} />
														</div>
													</div>
												)}

											</div>
										</div>
									</div>
								</div>
							}
							{(name == CanvasType.All || name == CanvasType.Download || name == CanvasType.Preview) && type == TemplateType.Gradient &&
								<div
									id={_id + "hihi4" + canvas}
									style={{
										zIndex: selected && type !== TemplateType.Image && type !== TemplateType.BackgroundImage && type !== TemplateType.Element ? 1 : 0,
										transformOrigin: "0 0",
										position: "absolute",
										width: "100%",
										height: "100%",
										pointerEvents: "none",
										opacity,
										overflow: type == TemplateType.Gradient ? 'hidden' : 'auto',
									}}
								>
									<GradientContainer
										id={_id + "1235" + canvas}
										className={`${_id}1236` + canvas}
										style={{
											width: imgWidth + "px",
											height: imgHeight + "px",
											transform: `translate(${posX}px, ${posY}px)`,
										}}
									>
										{ABC}
									</GradientContainer>
								</div>
							}
							{(name == CanvasType.All || name == CanvasType.Download || name == CanvasType.Preview) && type == TemplateType.Shape &&
								<div
									id={_id + "hihi4" + canvas}
									style={{
										zIndex: selected && type !== TemplateType.Image && type !== TemplateType.BackgroundImage && type !== TemplateType.Element ? 1 : 0,
										transformOrigin: "0 0",
										position: "absolute",
										width: "100%",
										height: "100%",
										pointerEvents: "none",
										opacity,
										overflow: type == TemplateType.Gradient ? 'hidden' : 'auto',
									}}
								>
									<div
										id={_id + "1235" + canvas}
										className={`${_id}1236` + canvas}
										style={{
											width: "100%",
											height: "100%",
										}}
									>
										{ABC}
									</div>
								</div>
							}
							{
								(type === TemplateType.Video &&
									name != CanvasType.Preview) &&
								<div
									id={_id + "video-controller" + name}
									className={_id + "scaleX-scaleY" + (name == CanvasType.HoverLayer ? " video-controller" : "")}
									style={{
										transformOrigin: "0 0",
										// transform: src ? null : `scaleX(${scaleX}) scaleY(${scaleY}) translateZ(0px)`,
										position: "absolute",
										width: '100%',
										height: '100%',
										pointerEvents: selected ? "all" : "none",
										transform: `translateZ(0px)`,
									}}
									onMouseEnter={(e) => {
										if (!selected && type != TemplateType.BackgroundImage && !editorStore.cropMode && !window.selectionStart && name == CanvasType.All) {
											this.handleImageHovered();
											this.props.handleImageHovered(_id, page);
										}
									}}

									onMouseLeave={(e) => {
										if (hovered && !selected && type != TemplateType.BackgroundImage && !editorStore.cropMode && name == CanvasType.All) {
											this.handleImageUnhovered();
											this.props.handleImageUnhovered(_id, page);
										}
									}}
								>
									{type === TemplateType.Video && name == CanvasType.HoverLayer &&
										<div
											className={name}
											id={_id + "progress" + name}
											style={{
												display: (!cropMode && selected) ? "block" : "none",
												position: 'absolute',
												bottom: '20px',
												height: '5px',
												backgroundColor: 'rgb(255 255 255 / 36%)',
												width: '90%',
												margin: 'auto',
												left: '0',
												right: '0',
												borderRadius: "5px",
												pointerEvents: 'auto',
												cursor: 'pointer',
											}}
											onMouseEnter={e => {
												if (window.dragging) return;
												let tip = document.getElementById("helloTip");
												if (!tip) {
													tip = document.createElement("div");
												}
												tip.id = "helloTip";
												tip.style.position = "absolute";
												tip.style.height = "26px";
												tip.style.backgroundColor = "black";
												tip.style.top = e.clientY + 20 + "px";
												tip.style.left = e.clientX + 20 + "px";
												tip.style.zIndex = "2147483647";
												tip.style.color = "white";
												tip.style.textAlign = "center";
												tip.style.lineHeight = "26px";
												tip.style.borderRadius = "3px";
												tip.style.padding = "0 5px";
												tip.style.fontSize = "12px";
												tip.style.pointerEvents = "none";
												tip.innerText = "123";

												let rec = (e.target as HTMLElement).getBoundingClientRect();


												let left1, top1, left2, top2;
												if (rotateAngle <= 90) {
													left1 = rec.left;
													top1 = rec.top;
													left2 = rec.right;
													top2 = rec.bottom;
												} else if (rotateAngle <= 180) {
													left1 = rec.right;
													top1 = rec.top;
													left2 = rec.left;
													top2 = rec.bottom;
												} else if (rotateAngle <= 270) {
													left1 = rec.right;
													top1 = rec.bottom;
													left2 = rec.left;
													top2 = rec.top;
												} else {
													left1 = rec.left;
													top1 = rec.bottom;
													left2 = rec.right;
													top2 = rec.top;
												}

												let video = document.getElementById(_id + "video0alo") as HTMLVideoElement;
												let max = video.duration;

												document.body.append(tip);

												tip.style.position = "absolute";
												tip.style.backgroundColor = "black";
												tip.style.top = rec.top - 40 + "px";
												tip.innerText = rotateAngle + "°";

												let value;

												const onMove = e => {

													let centerX = e.clientX;
													let centerY = e.clientY;

													let x1 = (left1 - centerX) * Math.cos(-degToRadian(rotateAngle)) - (top1 - centerY) * Math.sin(-degToRadian(rotateAngle)) + centerX;
													let x2 = (left2 - centerX) * Math.cos(degToRadian(-rotateAngle)) - (top2 - centerY) * Math.sin(degToRadian(-rotateAngle)) + centerX;

													let width2 = x2 - x1;

													let tipLeft = e.clientX - 10;
													let tipTop = e.clientY - 40;

													let x3 = (tipLeft - centerX) * Math.cos(-degToRadian(rotateAngle)) - (tipTop - centerY) * Math.sin(-degToRadian(rotateAngle)) + centerX;
													let y3 = (tipLeft - centerX) * Math.sin(-degToRadian(rotateAngle)) + (tipTop - centerY) * Math.cos(-degToRadian(rotateAngle)) + centerY;

													tip.style.left = x3 + "px";
													tip.style.top = y3 + "px";
													let percent = (centerX - x1) / width2;
													value = percent * max;
													tip.innerText = secondToMinutes(percent * max);
												}

												const onLeave = e => {
													e.target.removeEventListener("mousemove", onMove);
													e.target.removeEventListener("mousemove", onLeave);
													e.target.removeEventListener("click", onClick);

													let tip = document.getElementById("helloTip");
													if (tip)
														document.body.removeChild(tip);
												}

												const onClick = e => {
													let video = document.getElementById(_id + "video0alo") as HTMLVideoElement;
													let video1 = document.getElementById(_id + "video1alo") as HTMLVideoElement;

													if (video) video.currentTime = value;
													if (video1) video1.currentTime = value;
												}

												e.target.addEventListener("click", onClick);
												e.target.addEventListener("mousemove", onMove);
												e.target.addEventListener("mouseleave", onLeave)
											}}
										>
											<span
												id={_id + "progress-bar" + name}
												style={{
													height: "100%",
													display: "block",
													backgroundColor: "#f5f5f5",
													pointerEvents: "none",
													borderRadius: "5px",
													width: 0,
												}}
											></span>
											<div
												id={_id + "progress-bar-pointer" + name}
												style={{
													width: "15px",
													height: "15px",
													margin: 'auto',
													top: 0,
													left: 0,
													bottom: 0,
													position: 'absolute',
													background: 'white',
													borderRadius: '50%',
													boxShadow: '0 0 5px 1px rgba(14,19,24,.15), 0 0 0 1px rgba(14,19,24,.2)',
												}}
												onMouseDown={e => {
													e.stopPropagation();
													const startX = e.clientX;
													const startY = e.clientY;
													let progressBar = document.getElementById(_id + "progress1").getBoundingClientRect();
													let progressBar2 = document.getElementById(_id + "progress-bar1");
													let progressBarPointer = document.getElementById(_id + "progress-bar-pointer1");
													let width = progressBar.right - progressBar.left;
													let height = progressBar.bottom - progressBar.top;
													let video = document.getElementById(_id + "video0alo") as HTMLVideoElement;
													// let video1 = document.getElementById(_id + "video1alo") as HTMLVideoElement;
													let duration = video.duration;
													let paused = video.paused;
													let value, percent;

													progressBarPointer.style.boxShadow = '0 0 0 8px rgba(0,196,204,.5)';
													// progressBarPointer.style.border = '1px solid #00afb5';

													let controller = document.getElementById(_id + "video-controller1");
													controller.classList.toggle("hovered");
													const onMove = e => {
														window.dragging = true;
														e.stopPropagation();
														if (!paused) {
															video.pause();
														}

														if (rotateAngle < 45) {
															const deltaX = e.clientX - progressBar.left;
															percent = deltaX / width * 100;
														} else if (rotateAngle < 90) {
															const deltaY = e.clientY - progressBar.top;
															percent = deltaY / height * 100;
														} else if (rotateAngle < 135) {
															const deltaY = e.clientY - progressBar.top;
															percent = deltaY / height * 100;
														} else if (rotateAngle < 180) {
															const deltaX = e.clientX - progressBar.right;
															percent = deltaX / width * 100;
														} else if (rotateAngle < 225) {
															const deltaX = e.clientX - progressBar.right;
															percent = deltaX / width * 100;
														} else if (rotateAngle < 270) {
															const deltaY = e.clientY - progressBar.bottom;
															percent = deltaY / height * 100;
														} else if (rotateAngle < 315) {
															const deltaY = e.clientY - progressBar.bottom;
															percent = deltaY / height * 100;
														} else {
															const deltaX = e.clientX - progressBar.left;
															percent = deltaX / width * 100;
														}

														percent = Math.abs(percent);


														percent = Math.max(0, percent);
														percent = Math.min(99, percent);
														progressBarPointer.style.left = `calc(${percent}% - 7.5px)`;
														progressBar2.style.width = percent + "%";
														value = percent / 100 * duration;
														if (video) video.currentTime = value;
													}

													const onUp = e => {

														progressBarPointer.style.boxShadow = '0 0 5px 1px rgba(14,19,24,.15), 0 0 0 1px rgba(14,19,24,.2)';
														progressBarPointer.style.border = '';

														controller.classList.toggle("hovered");

														progressBarPointer.style.transform = `scale(1)`;
														window.dragging = false;
														e.stopPropagation();
														video.currentTime = value;
														if (!paused) {
															video.play();
															// video.currentTime = value;
														}
														// this.setState({currentTime: percent,})
														document.removeEventListener("mouseup", onUp);
														document.removeEventListener("mousemove", onMove);
													}

													document.addEventListener("mouseup", onUp);
													document.addEventListener("mousemove", onMove);
												}}
											></div>
										</div>}
									{!cropMode && selected &&
										type == TemplateType.Video &&
										name == CanvasType.HoverLayer &&
										<div
											className="videoController"
											onClick={e => {
												if (!this.state.paused) {
													let el = document.getElementById(this.props.image._id + "video" + CanvasType.All + "alo") as HTMLVideoElement;
													this.setState({
														currentTime: Math.floor((el.currentTime / el.duration) * 100),
													})
												}

												this.props.toggleVideo();
											}}
											style={{
												position: "absolute",
												left: "calc(50% - 22px)",
												top: "calc(50% - 22px)",
												backgroundColor: "rgba(17,23,29,.6)",
												borderRadius: "100%",
												width: "44px",
												height: "44px",
												pointerEvents: "auto",
												opacity: this.state.paused && 1,
											}}>
											<span
												style={{
													width: "100%",
													height: "100%",
													display: "block",
													position: "relative",
												}}>
												{this.state.paused ?
													<img
														style={{
															margin: "auto",
															left: 0,
															right: 0,
															top: 0,
															bottom: 0,
															position: "absolute",
														}}
														src={require("@Components/shared/svgs/editor/toolbar/pause.svg")} />
													:
													<img
														style={{
															margin: "auto",
															left: 0,
															right: 0,
															top: 0,
															bottom: 0,
															position: "absolute",
														}}
														src={require("@Components/shared/svgs/editor/toolbar/play.svg")} />
												}
											</span>
										</div>
									}
									{cropMode &&
										selected && name == CanvasType.HoverLayer && (
											<div
												className={`${_id}1236` + canvas}
												style={{
													transform: `translate(${posX}px, ${posY}px)`,
													width: imgWidth + "px",
													height: imgHeight + "px",
													zIndex: 999999,
												}}
											>
												{cropMode && selected
													? cropImageResizeDirection
														.map(d => {
															let cursor = getCursorStyleForResizer(rotateAngle, d);
															let visibility = type === TemplateType.BackgroundImage ? "visible" : getImageResizerVisibility(this.state.image, scale, d);
															return (
																<div
																	key={d}
																	style={{
																		cursor,
																		zIndex: 999999,
																		visibility,
																		pointerEvents: "all",
																	}}
																	id={_id + zoomableMap[d] + "_"}
																	className={`${zoomableMap[d]} resizable-handler-container hehe`}
																	onMouseDown={e => this.startResizeImage(e, d, true)}
																>
																	<div
																		key={d}
																		style={{ cursor, zIndex: 999999 }}
																		className={`${zoomableMap[d]} resizable-handler`}
																		onMouseDown={e => this.startResizeImage(e, d, true)}
																	/>
																</div>
															);
														})
													: null}
											</div>
										)}
								</div>
							}
							{((selected && name == CanvasType.HoverLayer) ||
								(!selected && name == CanvasType.All) ||
								name == CanvasType.Download) &&
								(type == TemplateType.TextTemplate) &&
								<div
									style={{
										transformOrigin: "0 0",
										position: "absolute",
										width: `calc(100% + 2px)`,
										height: `calc(100% + 2px)`,
										left: "-1px",
										top: "-1px",
									}}
								>
									<div
										style={{
											position: "relative",
											width: "100%",
											height: "100%",
										}}>
										{document_object && (document_object.map(child => (
											<div
												key={child._id}
												id={child._id + "b2"}
												className={_id + child._id + "b2 hideWhenDownload2"}
												style={{
													left: `calc(${child.left / width * 100 * scaleX}%)`,
													top: `calc(${child.top / height * 100 * scaleY}%)`,
													position: "absolute",
													width: `calc(${child.width2 * 100}%)`,
													height: `calc(${child.height2 * 100}%)`,
													backgroundImage: selected && child._id == editorStore.childId && 'linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1),linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1)',
													backgroundPosition: 'top,100%,bottom,0',
													backgroundRepeat: 'repeat-x,repeat-y,repeat-x,repeat-y',
													backgroundSize: '12px 2px,2px 12px,12px 2px,2px 12px',
													transform: `rotate(${child.rotateAngle}deg)`,
												}}>

											</div>)))
										}
									</div>
								</div>
							}
							{(type === TemplateType.Heading ||
								type == TemplateType.TextTemplate) &&
								<div
									id={_id + "654" + canvas}
									onClick={e => {
									}}
									className={_id + "scaleX-scaleY 2"}
									style={{
										transformOrigin: "0 0",
										transform: src ? null : `scaleX(${scaleX}) scaleY(${scaleY})`,
										position: "absolute",
										width: `calc(100%/${scaleX})`,
										height: `calc(100%/${scaleY})`,
										pointerEvents: (name == CanvasType.HoverLayer) ? "none" : "all",
									}}
								>

									{document_object &&
										((selected && name == CanvasType.HoverLayer) ||
											name == CanvasType.Preview ||
											(!selected && name == CanvasType.All) ||
											name == CanvasType.Download) &&
										(
											<div>
												{document_object.filter(child => child.type == TemplateType.Heading).map(child => {
													return (
														<SingleText
															child={child}
															ref={ref => {
																this.childrens[child._id] = ref;
															}}
															canvas={canvas}
															_id={_id + child._id + canvas}
															parentId={_id}
															rotateAngle={child.rotateAngle}
															selected={child._id == editorStore.childId}
															onInput={onTextChange}
															handleChildIdSelected={handleChildIdSelected}
															scale={scale}
														/>
													);
												})}
											</div>
										)}
									{document_object && (name == CanvasType.All || name == CanvasType.Download || name == CanvasType.Preview) &&
										(
											<div>
												{document_object.filter(child => child.type == TemplateType.Image).map(child => {
													return (
														<div
															onMouseDown={e => {
																e.preventDefault();
																setTimeout(() => {
																	handleChildIdSelected(child._id);
																}, 50);
															}}
															onDoubleClick={e => {
																e.preventDefault();
																e.stopPropagation();
																this.props.handleChildCrop(child._id)
															}}
															style={{
																zIndex: child.zIndex,
																left: child.left * scale,
																top: child.top * scale,
																position: "absolute",
																width: child.width * scale,
																height: child.height * scale,
																overflow: "hidden",
																transform: `rotate(${child.rotateAngle}deg)`,
															}}>
															<Image
																canvas={canvas}
																_id={child._id}
																imgWidth={child.imgWidth * scale}
																imgHeight={child.imgHeight * scale}
																posX={child.posX * scale}
																posY={child.posY * scale}
																selected={selected}
																cropMode={cropMode}
																backgroundColor={backgroundColor}
																src={child.src}
																enableCropMode={null}
																srcThumnail={child.srcThumnail}
															/></div>);
												})}
											</div>
										)}
									{document_object && (name == CanvasType.All || name == CanvasType.Download || name == CanvasType.Preview) &&
										(
											<div>
												{document_object.filter(child => child.type == TemplateType.Gradient || child.type == TemplateType.Shape || child.type == TemplateType.Element).map(child => {
													return (
														<div
															onMouseDown={e => {
																e.preventDefault();
																setTimeout(() => {
																	handleChildIdSelected(child._id);
																}, 50);
															}}
															style={{
																zIndex: child.zIndex,
																left: child.left * scale,
																top: child.top * scale,
																position: "absolute",
																width: child.width * scale,
																height: child.height * scale,
																overflow: "hidden",
																transform: `rotate(${child.rotateAngle}deg)`,
															}}>
															<Image
																canvas={canvas}
																_id={child._id}
																imgWidth={child.imgWidth * scale}
																imgHeight={child.imgHeight * scale}
																posX={child.posX * scale}
																posY={child.posY * scale}
																selected={selected}
																cropMode={cropMode}
																backgroundColor={backgroundColor}
																src={child.src}
																enableCropMode={null}
																srcThumnail={child.srcThumnail}
															/></div>);
												})}
											</div>
										)}
									{document_object && (name == CanvasType.All || name == CanvasType.Download || name == CanvasType.Preview) &&
										(
											<div>
												{document_object.filter(child => child.type == TemplateType.Video).map(child => {
													return (
														<div
															onMouseDown={e => {
																e.preventDefault();
																setTimeout(() => {
																	handleChildIdSelected(child._id);
																}, 50);
															}}
															style={{
																zIndex: child.zIndex,
																left: child.left * scale,
																top: child.top * scale,
																position: "absolute",
																width: child.width * scale,
																height: child.height * scale,
																overflow: "hidden",
																transform: `rotate(${child.rotateAngle}deg)`,
															}}>
															<Video
																name={name}
																paused={this.state.paused}
																rotateAngle={rotateAngle}
																parentRotateAngle={parentRotateAngle}
																canvas={canvas}
																_id={child._id}
																showController={showController}
																imgWidth={child.imgWidth * scale}
																imgHeight={child.imgHeight * scale}
																posX={child.posX * scale}
																posY={child.posY * scale}
																selected={selected}
																cropMode={cropMode}
																backgroundColor={backgroundColor}
																src={child.src}
																srcThumnail={child.srcThumnail}
																opacity={child.opacity}
																startResizeImage={this.startResizeImage}
																setMax={this.setMax}
																setCurrentTime={this.setCurrentTime}
															/> </div>
													);
												})}
											</div>
										)}
									{((selected && name == CanvasType.HoverLayer) || name == CanvasType.Preview ||
										(!selected && (name == CanvasType.All)) ||
										name == CanvasType.Download) &&
										type === TemplateType.Heading && (
											<div style={{
												pointerEvents: (name == CanvasType.HoverLayer) ? "none" : "all",
											}}>
												<div
													id={_id + "hihi5" + canvas}
													className={_id + "hihi5"}
													style={{
														position: "absolute",
														width: width * scale / scaleX + "px",
														height: height * scale / scaleY + "px",
														transformOrigin: "0 0",
														zIndex: selected ? 1 : 0,
														WebkitTextStroke: (effectId == 3 || effectId == 4) && (`${1.0 * hollowThickness / 100 * 4 + 0.1}px ${(effectId == 3 || effectId == 4) ? color : "black"}`),
														pointerEvents: (name == CanvasType.HoverLayer) ? "none" : "all",
													}}
												>

													<span
														id={_id + "hihi4" + canvas}
														spellCheck={false}
														onInput={onTextChange}
														contentEditable={selected && name != CanvasType.Preview}
														ref={this.setTextElementRef2.bind(this)}
														className={"text single-text " + _id + "hihi4" + canvas}
														style={{
															pointerEvents: "all",
															position: "absolute",
															display: "block",
															width: width / scaleX + "px",
															margin: "0px",
															wordBreak: "break-word",
															opacity,
															transform: `scale(${scale}) translateZ(0)`,
															transformOrigin: "0 0",
															fontFamily: `${fontFace}, AvenirNextRoundedPro`,
															fontStyle: italic ? "italic" : "",
															fontWeight: bold ? "bold" : "normal",
															textAlign: align,
															color: (effectId == 3 || effectId == 4) ? "transparent" : color,
															textShadow: effectId == 1 ? `rgba(${shadowColor[0]}, ${shadowColor[1]}, ${shadowColor[2]}, ${1.0 * textShadowTransparent / 100}) ${21.0 * offSet / 100 * Math.sin(effectDirection * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * offSet / 100 * Math.cos(effectDirection * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * blur / 100}px` :
																effectId == 2 ? `rgba(0, 0, 0, ${0.6 * intensity}) 0 8.9px ${66.75 * intensity / 100}px` :
																	effectId == 4 ? `rgb(${shadowColor[0]}, ${shadowColor[1]}, ${shadowColor[2]}) ${21.0 * offSet / 100 * Math.sin(effectDirection * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * offSet / 100 * Math.cos(effectDirection * 3.6 / 360 * 2 * Math.PI)}px 0px` :
																		effectId == 5 ? `rgba(${shadowColor[0]}, ${shadowColor[1]}, ${shadowColor[2]}, 0.5) ${21.0 * offSet / 100 * Math.sin(effectDirection * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * offSet / 100 * Math.cos(effectDirection * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(${shadowColor[0]}, ${shadowColor[1]}, ${shadowColor[2]}, 0.3) ${41.0 * offSet / 100 * Math.sin(effectDirection * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * offSet / 100 * Math.cos(effectDirection * 3.6 / 360 * 2 * Math.PI)}px 0px` :
																			effectId == 6 && `rgb(0, 255, 255) ${21.0 * offSet / 100 * Math.sin(effectDirection * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * offSet / 100 * Math.cos(effectDirection * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * offSet / 100 * Math.sin(effectDirection * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * offSet / 100 * Math.cos(effectDirection * 3.6 / 360 * 2 * Math.PI))}px 0px`,
															filter: filter,
															lineHeight: `${lineHeight * fontSize}px`,
															letterSpacing: getLetterSpacing(letterSpacing),
															fontSize: fontSize + "px",
														}}
													></span>
												</div>
											</div>
										)}

								</div>
							}
							{type === TemplateType.Video && name == CanvasType.HoverLayer &&
								<div
									className={`${_id}1236` + canvas}
									style={{
										transform: `translate(${posX}px, ${posY}px)`,
										width: imgWidth + "px",
										height: imgHeight + "px",
										zIndex: 0,
										position: "absolute",
									}}
								>
									{cropMode && <div
										className="hideWhenDownload"
										style={{
											position: "absolute",
											top: "-1px",
											left: "-1px",
											right: "-1px",
											bottom: "-1px",
											backgroundImage:
												(type == TemplateType.TextTemplate || type == TemplateType.GroupedItem) ? `linear-gradient(90deg,#00d9e1 60%,transparent 0),linear-gradient(180deg,#00d9e1 60%,transparent 0),linear-gradient(90deg,#00d9e1 60%,transparent 0),linear-gradient(180deg,#00d9e1 60%,transparent 0)`
													: 'linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1),linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1)',
											backgroundPosition: 'top,100%,bottom,0',
											backgroundSize: '12px 2px,2px 12px,12px 2px,2px 12px',
											backgroundRepeat: 'repeat-x,repeat-y,repeat-x,repeat-y',
											opacity: (hovered || selected) ? 1 : 0,
											pointerEvents: "none",
										}}>

									</div>}
									{type == TemplateType.Video && <canvas
										id={_id + "video3" + canvas}
										style={{
											width: "100%",
											height: "100%",
											transformOrigin: "0 0",
											opacity: cropMode ? 0.5 : 0,
										}}
									/>}
								</div>
							}
							{
								(cropMode &&
									(type === TemplateType.Image ||
										type == TemplateType.BackgroundImage ||
										type === TemplateType.Video ||
										type == TemplateType.Element ||
										type == TemplateType.Gradient)) &&
								(name != CanvasType.Preview) &&
								<div
									id={_id + "6543" + canvas}
									className={_id + "scaleX-scaleY"}
									style={{
										transformOrigin: "0 0",
										transform: src ? null : `scaleX(${scaleX}) scaleY(${scaleY})`,
										position: "absolute",
										width: '100%',
										height: '100%',
										zIndex: 1,
										background: type == TemplateType.Video && selected && name != CanvasType.Download && !cropMode &&
											'linear-gradient(0deg, rgba(0,0,0,0.7147233893557423) 0%, rgba(13,1,1,0) 34%)',
									}}
								>
									{cropMode &&
										selected && name == CanvasType.HoverLayer && (
											<div
												className={`${_id}1236` + canvas}
												style={{
													transform: `translate(${posX}px, ${posY}px)`,
													width: imgWidth + "px",
													height: imgHeight + "px",
													zIndex: 999999,
												}}
											>
												{cropMode && selected
													? cropImageResizeDirection
														.map(d => {
															let cursor = getCursorStyleForResizer(rotateAngle, d);
															let visibility = (type == TemplateType.BackgroundImage || type == TemplateType.Element) ? "visible" : getImageResizerVisibility(this.state.image, scale, d);
															return (
																<div
																	key={d}
																	style={{
																		cursor,
																		zIndex: 999999,
																		visibility,
																		pointerEvents: "all",
																	}}
																	id={_id + zoomableMap[d] + "_"}
																	className={`${zoomableMap[d]} resizable-handler-container hehe`}
																	onMouseDown={e => this.startResizeImage(e, d, true)}
																>
																	<div
																		key={d}
																		style={{ cursor, zIndex: 999999 }}
																		className={`${zoomableMap[d]} resizable-handler`}
																		onMouseDown={e => this.startResizeImage(e, d, true)}
																	/>
																</div>
															);
														})
													: null}
											</div>
										)}
								</div>
							}
							{cropMode &&
								(selected && name == CanvasType.HoverLayer) &&
								type !== TemplateType.Element &&
								type !== TemplateType.BackgroundImage && (
									<div
										style={{
											width: "100%",
											height: "100%",
											position: "absolute",
										}}
									>
										{cropImageResizeDirection.map((d, i) => {
											let cursor = getCursorStyleForResizer(rotateAngle, d);
											return (
												<div
													id={_id + zoomableMap[d]}
													key={d}
													style={{
														cursor,
														transform: `rotate(${i * 90}deg)`,
														zIndex: 2,
														pointerEvents: "all",
													}}
													className={`${zoomableMap[d]} resizable-handler-container cropMode`}
													onMouseDown={e => {
														this.startResizeImage(e, d, false);
													}}
												>
													<svg
														className={`${zoomableMap[d]}`}
														width={24}
														height={24}
														style={{ zIndex: -1 }}
														viewBox="0 0 24 24"
														xmlns="http://www.w3.org/2000/svg"
														xmlnsXlink="http://www.w3.org/1999/xlink" >
														<defs><path id="_619015639__b" d="M10 18.95a2.51 2.51 0 0 1-3-2.45v-7a2.5 2.5 0 0 1 2.74-2.49L10 7h6a3 3 0 0 1 3 3h-9v8.95z"></path><filter id="_619015639__a" width="250%" height="250%" x="-75%" y="-66.7%" filterUnits="objectBoundingBox"><feMorphology in="SourceAlpha" operator="dilate" radius=".5" result="shadowSpreadOuter1"></feMorphology><feOffset in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset><feColorMatrix in="shadowOffsetOuter1" result="shadowMatrixOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0"></feColorMatrix><feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter2"></feOffset><feGaussianBlur in="shadowOffsetOuter2" result="shadowBlurOuter2" stdDeviation="2.5"></feGaussianBlur><feColorMatrix in="shadowBlurOuter2" result="shadowMatrixOuter2" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix><feMerge><feMergeNode in="shadowMatrixOuter1"></feMergeNode><feMergeNode in="shadowMatrixOuter2"></feMergeNode></feMerge></filter></defs><g fill="none" fillRule="evenodd"><use fill="#000" filter="url(#_619015639__a)" xlinkHref="#_619015639__b"></use><use className={`${zoomableMap[d]}`} fill="#FFF" xlinkHref="#_619015639__b"></use></g></svg>
												</div>
											);
										})}
									</div>
								)}
							{type === TemplateType.Video &&
								// (name == CanvasType.All || (name == CanvasType.HoverLayer && cropMode) || name == CanvasType.Preview) && 
								(
									<div
										id={_id}
										onDoubleClick={e => {
											e.preventDefault();
											this.props.handleCropBtnClick(_id)
										}}
										style={{
											zIndex: selected ? 1 : 0,
											transformOrigin: "0 0",
											position: "absolute",
											width: "100%",
											height: "100%",
											overflow: "hidden",
											display: name == CanvasType.HoverLayer && !cropMode ? "none" : "block",
										}}
									>
										<Video
											name={name}
											paused={this.state.paused}
											rotateAngle={rotateAngle}
											parentRotateAngle={parentRotateAngle}
											canvas={canvas}
											_id={_id}
											showController={showController}
											imgWidth={imgWidth}
											imgHeight={imgHeight}
											posX={posX}
											posY={posY}
											selected={selected}
											cropMode={cropMode}
											backgroundColor={backgroundColor}
											src={src}
											srcThumnail={srcThumnail}
											opacity={opacity}
											startResizeImage={this.startResizeImage}
											setMax={this.setMax}
											setCurrentTime={this.setCurrentTime}
										/>
									</div>
								)}
							{name == CanvasType.HoverLayer && <div
								{...customAttr}
								className="hideWhenDownload"
								ref={i => this.hideWhenDownload = i}
								style={{
									position: "absolute",
									top: "-1px",
									left: "-1px",
									right: "-1px",
									bottom: "-1px",
									backgroundImage:
										(type == TemplateType.TextTemplate || type == TemplateType.GroupedItem || type == TemplateType.Grids) ? `linear-gradient(90deg,#00d9e1 60%,transparent 0),linear-gradient(180deg,#00d9e1 60%,transparent 0),linear-gradient(90deg,#00d9e1 60%,transparent 0),linear-gradient(180deg,#00d9e1 60%,transparent 0)`
											: 'linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1),linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1)',
									backgroundPosition: 'top,100%,bottom,0',
									backgroundSize: '12px 2px,2px 12px,12px 2px,2px 12px',
									backgroundRepeat: 'repeat-x,repeat-y,repeat-x,repeat-y',
									opacity: ((hovered || selected) && !cropMode) || (cropMode && selected && type != TemplateType.BackgroundImage && type != TemplateType.Element) ? 1 : 0,
									pointerEvents: "none",
								}}>

							</div>}
						</StyledRect>
					</div> </div>
			</div>
		);
	}
}

const GradientContainer = styled.div`
	z-index: 9999999;
	opacity: 1;
	transform-origin: 0 0;
	
	svg {
		width: 100%;
		height: 100%;
	}
`;