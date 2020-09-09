import React, { Component } from "react";
import { getCursorStyleWithRotateAngle, getCursorStyleForResizer, tLToCenter, getImageResizerVisibility, } from "@Utils";
import StyledRect from "./StyledRect";
import SingleText from "@Components/editor/Text/SingleText";
import Image from "@Components/editor/Rect/Image";
import Video from "@Components/editor/Rect/Video";
import { TemplateType, CanvasType, } from "../enums";
import editorStore from "@Store/EditorStore";
import { clone } from "lodash";
import { secondToMinutes } from "@Utils";

// const tex = `f(x) = \\int_{-\\infty}^\\infty\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi`;

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

let timer = 0;
let delay = 200;
let prevent = false;

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
	enableCropMode: any;
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
}

export default class Rect extends Component<IProps, IState> {

	childrens = {};

	constructor(props) {
		super(props);

		this.state = {
			videoControllerShow: false,
			editing: false,
			selectionScaleX: null,
			selectionScaleY: null,
			image: clone(props.image),
			cropMode: false,
			paused: props.image.paused,
			max: 0,
			currentTime:0, 
		}

		this.handleImageSelected = this.handleImageSelected.bind(this);
		this.handleImageUnselected = this.handleImageUnselected.bind(this);
		this.updateImage = this.updateImage.bind(this);
		this.startEditing = this.startEditing.bind(this);
		this.enableCropMode = this.enableCropMode.bind(this);
		this.setMax = this.setMax.bind(this);
		this.setCurrentTime = this.setCurrentTime.bind(this);
	}

	componentDidMount() {
		const {
			image: {
				innerHTML,
			}
		} = this.props;
		if (innerHTML && this.$textEle) {
			this.$textEle.innerHTML = innerHTML;
		}
		if (innerHTML && this.$textEle2) {
			this.$textEle2.innerHTML = innerHTML;
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
			}
		} = this.state;


		if (
			type === TemplateType.Heading &&
			selected != prevState.image.selected &&
			this.$textEle2
		) {
			this.$textEle2.innerHTML = innerHTML;
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

	endEditing = e => { };

	startEditing = selectionScaleY => {
		this.setState({ selectionScaleY: 2 });
	};

	onMouseDown = () => {
		const {
			image: {
				type,
				_id,
				scaleY,
			}
		} = this.props;

		let self = this;
		let size;
		let fontFace;
		let fontColor;
		if (type !== 4) {
			let selectionScaleY = 1;
			if (self.state && self.state.selectionScaleY) {
				selectionScaleY = self.state.selectionScaleY;
			}

			let a = document.getSelection();
			if (a && a.type === "Range") {
			} else {
				let el = document
					.getElementById(_id)
					.getElementsByClassName("font")[0];
				let sel = window.getSelection();
				let range = document.createRange();
				range.selectNodeContents(el);
				sel.removeAllRanges();
				sel.addRange(range);
				let a = document.getSelection();
				size = window.getComputedStyle(el, null).getPropertyValue("font-size");
				fontFace = window
					.getComputedStyle(el, null)
					.getPropertyValue("font-family");
				fontColor = window.getComputedStyle(el, null).getPropertyValue("color");

				sel.removeAllRanges();
			}

			this.props.handleFontFaceChange(fontFace);
			this.props.handleFontColorChange(fontColor);

			let fontSize =
				parseInt(size.substring(0, size.length - 2)) *
				selectionScaleY *
				scaleY;
			(document.getElementById("fontSizeButton") as HTMLInputElement).value = `${Math.round(fontSize)}`;
		}
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

	doClickAction() {
	}
	doDoubleClickAction() {
	}

	handleClick() {
		let me = this;
		timer = setTimeout(function () {
			if (!prevent) {
				me.doClickAction();
			}
			prevent = false;
		}, delay);
	}

	handleDoubleClick() {
		clearTimeout(timer);
		prevent = true;
		this.doDoubleClickAction();
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
		image.document_object = image.document_object.map(doc => {
			if (doc._id == id) {
				doc.selected = true;
			} else {
				doc.selected = false;
			}
			return doc;
		});

		this.setState({
			image,
		});

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
		this.setState({max})
	}

	setCurrentTime(currentTime) {
		this.setState({currentTime})
	}

	hideWhenDownload = null;

	render() {
		const {
			parentRotateAngle,
			showController,
			scale,
			onTextChange,
			onFontSizeChange,
			handleFontColorChange,
			handleFontFaceChange,
			handleChildIdSelected,
			childId,
			showImage,
			id,
			name,
			canvas,
			image,
		} = this.props;

		const {
			cropMode,
			image: {
				page,
				hovered,
				selected: imageSelected,
				selected,
				_id,
				scaleX,
				scaleY,
				innerHTML,
				document_object: childrens,
				type: objectType,
				imgColor,
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
				zIndex,
				hollowThickness,
			}
		} = this.state;

		const imgWidth = imgWidth2 * scale;
		const imgHeight = imgHeight2 * scale;
		const posX = posX2 * scale;
		const posY = posY2 * scale;

		let opacity = opacity2 ? opacity2 / 100 : 1;

		const imgResizeDirection = ["nw", "ne", "se", "sw", "e", "w", "s", "n"];
		const cropImageResizeDirection = ["nw", "ne", "se", "sw"];
		const textResizeDirection = ["nw", "ne", "se", "sw", "e", "w"];
		const groupedItemResizeDirection = ["nw", "ne", "se", "sw"];

		let imgDirections = imgResizeDirection;

		if (objectType === TemplateType.Heading || objectType === TemplateType.TextTemplate) {
			imgDirections = textResizeDirection;
		}

		if (objectType == TemplateType.GroupedItem) {
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
			iden: objectType != TemplateType.BackgroundImage ? _id : "",
			page: page,
		};

		return (
			<div>
				{cropMode && name == CanvasType.HoverLayer && 
					<div
						style={{
							left: '-10000px',
							top: '-10000px',
							width: '20000px',
							height: '20000px',
							position: 'absolute',
							backgroundColor: 'rgb(0 0 0 / 30%)',
							zIndex: 999999,
							pointerEvents: "auto",
						}}
						onClick={e => {
							this.props.disableCropMode();
						}}
					>
					</div>
				}
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
						if ((type != TemplateType.BackgroundImage || (type == TemplateType.BackgroundImage && cropMode))&& 
							(name == CanvasType.All || name == CanvasType.HoverLayer)) {
							if (!editorStore.cropMode) {
								if (!selected) {
									this.handleImageSelected();
									this.props.handleImageSelected(_id, page, name == CanvasType.HoverLayer ? CanvasType.All : CanvasType.HoverLayer);
								}
								this.props.handleDragStart(e, _id);
							} else if (this.state.cropMode) {
								this.props.handleDragStart(e, _id);
							} else {
								this.props.doNoObjectSelected();
							}
						}
					}}
					onMouseUp={e => {
						if (type == TemplateType.BackgroundImage && !window.selectionStart && name == CanvasType.All && !editorStore.cropMode) {
							if (!editorStore.cropMode) {
								if (!selected) {
									this.handleImageSelected();
									this.props.handleImageSelected(_id, page, CanvasType.HoverLayer);
								}
							} else if (this.state.cropMode) {
								this.props.handleDragStart(e, _id);
							} else {
								this.props.doNoObjectSelected();
							}
						}
					}}

					onMouseEnter={(e) => {
						console.log('onMouseEnter', selected)
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
							this.props.handleCropBtnClick(_id);
						}}
						className={objectType == TemplateType.BackgroundImage && "selectable"}
						style={{
							width: "100%",
							height: "100%",
							pointerEvents: (name == CanvasType.HoverLayer && !cropMode) ? "none" : "all",
							backgroundColor: type == TemplateType.BackgroundImage && name != CanvasType.HoverLayer && color,
						}}>
						{!cropMode &&
							name == CanvasType.HoverLayer &&
							selected &&
							objectType !== TemplateType.BackgroundImage && (
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
										<svg
											width="14"
											height="14"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
										>
											<path
												d='M15.25 18.48V15a.75.75 0 1 0-1.5 0v4c0 .97.78 1.75 1.75 1.75h4a.75.75 0 1 0 0-1.5h-2.6a8.75 8.75 0 0 0-2.07-15.53.75.75 0 1 0-.49 1.42 7.25 7.25 0 0 1 .91 13.34zM8.75 5.52V9a.75.75 0 0 0 1.5 0V5c0-.97-.78-1.75-1.75-1.75h-4a.75.75 0 0 0 0 1.5h2.6a8.75 8.75 0 0 0 2.18 15.57.75.75 0 0 0 .47-1.43 7.25 7.25 0 0 1-1-13.37z'
												fillRule="nonzero"
											/>
										</svg>
									</div>
								</div>
							)}

						{!cropMode &&
							name == CanvasType.HoverLayer &&
							selected &&
							objectType !== TemplateType.BackgroundImage &&
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
							(objectType === TemplateType.Image || objectType === TemplateType.BackgroundImage) && (
								<div
									id={_id}
									style={{
										zIndex: selected && objectType !== TemplateType.Image && objectType !== TemplateType.BackgroundImage ? 1 : 0,
										transformOrigin: "0 0",
										position: "absolute",
										width: "100%",
										height: "100%",
										pointerEvents: "none",
									}}
								>
									<div
										id={_id + "hihi4" + canvas}
										style={{
											width: "100%",
											height: "100%",
											position: "absolute",
											overflow: !this.props.bleed && "hidden",
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
									</div>
									{selected && cropMode && (
										<div
											style={{
												width: "100%",
												height: "100%",
												position: "absolute"
											}}
										>
											<div
												className={`${_id}1236`}
												style={{
													width: imgWidth + "px",
													height: imgHeight + "px",
													transform: `translate(${posX}px, ${posY}px)`
												}}
											>
												{<div
													style={{
														position: "absolute",
														top: "-2px",
														left: "-2px",
														right: "-2px",
														bottom: "-2px",
														backgroundImage:
															(objectType == TemplateType.TextTemplate || objectType == TemplateType.GroupedItem) ? `linear-gradient(90deg,#00d9e1 60%,transparent 0),linear-gradient(180deg,#00d9e1 60%,transparent 0),linear-gradient(90deg,#00d9e1 60%,transparent 0),linear-gradient(180deg,#00d9e1 60%,transparent 0)`
																: 'linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1),linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1)',
														backgroundPosition: 'top,100%,bottom,0',
														backgroundSize: '12px 2px,2px 12px,12px 2px,2px 12px',
														backgroundRepeat: 'repeat-x,repeat-y,repeat-x,repeat-y',
														opacity: (hovered || selected) ? 1 : 0,
														pointerEvents: "none",
													}}>

												</div>}
												{(objectType === TemplateType.Image || objectType === TemplateType.BackgroundImage) && (
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
											</div>
										</div>
									)}
								</div>
							)}
							{
							(objectType === TemplateType.Video &&
								name != CanvasType.Preview) &&
							<div
								id={_id + "6543" + canvas}
								className={_id + "scaleX-scaleY"}
								style={{
									transformOrigin: "0 0",
									transform: src ? null : `scaleX(${scaleX}) scaleY(${scaleY})`,
									position: "absolute",
									width: '100%',
									height: '100%',
									background: objectType == TemplateType.Video && selected && name != CanvasType.Download && !cropMode &&
										'linear-gradient(0deg, rgba(0,0,0,0.7147233893557423) 0%, rgba(13,1,1,0) 34%)',
								}}
							>
								{objectType === TemplateType.Video &&
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
										overflow: "hidden",
										pointerEvents: 'auto',
										cursor: 'pointer',
									}}
									onMouseEnter={e => {
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
										tip.innerText = "123";

										let rec = (e.target as HTMLElement).getBoundingClientRect();
										let left = rec.left;
										let width  = rec.width;
										let video = document.getElementById(_id + "video0alo") as HTMLVideoElement;
										let max = video.duration;


										document.body.append(tip);

										tip.style.position = "absolute";
										tip.style.backgroundColor = "black";
										tip.style.top = rec.top - 40 + "px";
										tip.innerText = rotateAngle + "°";

										let value;

										const onMove = e => {
											tip.style.left = e.clientX - 10 + "px";
											let percent = (e.clientX - left) / width;
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
											width: this.state.currentTime + "%",
										}}
									></span>
									</div>}
								{!cropMode && selected && 
									objectType == TemplateType.Video &&
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
											left: "calc(50% - 25px)",
											top: "calc(50% - 25px)",
											backgroundColor: "rgba(17,23,29,.6)",
											borderRadius: "100%",
											width: "50px",
											height: "50px",
											pointerEvents: "auto",
										}}>
										<span
											style={{
												width: "100%",
												height: "100%",
												display: "block",
												position: "relative",
											}}>
											{this.state.paused ?
												<svg
													style={{
														margin: "auto",
														left: 0,
														right: 0,
														top: 0,
														bottom: 0,
														position: "absolute",
														color: "white",
													}}
													width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M8.248 4.212l11.05 6.574c.694.412.91 1.29.483 1.961-.121.19-.287.35-.483.467l-11.05 6.574c-.694.413-1.602.204-2.03-.467A1.39 1.39 0 0 1 6 18.574V5.426C6 4.638 6.66 4 7.475 4c.273 0 .54.073.773.212z" fill="currentColor"></path></svg>
												:
												<svg
													style={{
														margin: "auto",
														left: 0,
														right: 0,
														top: 0,
														bottom: 0,
														position: "absolute",
														color: "white",
													}}
													xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="7" y="5" width="3" height="14" rx="1.5" fill="currentColor"></rect><rect x="14" y="5" width="3" height="14" rx="1.5" fill="currentColor"></rect></svg>
											}
										</span>
									</div>
								}
								{cropMode &&
									selected && name == CanvasType.HoverLayer && (
										<div
											className={`${_id}1236`}
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
														let visibility = objectType === TemplateType.BackgroundImage ? "visible" : getImageResizerVisibility(this.state.image, scale, d);
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
						{/* {
							(cropMode &&
								(objectType === TemplateType.Image || objectType == TemplateType.BackgroundImage || objectType === TemplateType.Video)) &&
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
									background: objectType == TemplateType.Video && selected && name != CanvasType.Download && !cropMode &&
										'linear-gradient(0deg, rgba(0,0,0,0.7147233893557423) 0%, rgba(13,1,1,0) 34%)',
								}}
							>
								{cropMode &&
									selected && name == CanvasType.HoverLayer && (
										<div
											className={`${_id}1236`}
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
														let visibility = objectType === TemplateType.BackgroundImage ? "visible" : getImageResizerVisibility(this.state.image, scale, d);
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
						} */}
						{((selected && name == CanvasType.HoverLayer) ||
							(!selected && name == CanvasType.All) ||
							name == CanvasType.Download) &&
							(objectType == TemplateType.TextTemplate) &&
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
									{childrens && childrens.length > 0 && (childrens.map(child => (
										<div
											key={child._id}
											id={child._id + "b2"}
											className={_id + child._id + "b2 hideWhenDownload2"}
											style={{
												left: `calc(${child.left / width * scaleX * 100}% - 1px)`,
												top: `calc(${child.top / (child.height / child.height2) * 100}% - 1px)`,
												position: "absolute",
												width: `calc(${child.width2 * 100}% + 2px)`,
												height: `calc(${child.height2 * 100}% + 2px)`,
												backgroundImage: selected && child.selected && 'linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1),linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1)',
												backgroundPosition: 'top,100%,bottom,0',
												backgroundRepeat: 'repeat-x,repeat-y,repeat-x,repeat-y',
												backgroundSize: '12px 2px,2px 12px,12px 2px,2px 12px',
											}}>

										</div>)))
									}
								</div>
							</div>
						}
						{(objectType === TemplateType.Heading ||
							objectType == TemplateType.TextTemplate) &&
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

								{childrens && childrens.length > 0 &&
									((selected && name == CanvasType.HoverLayer) ||
										name == CanvasType.Preview ||
										(!selected && name == CanvasType.All) ||
										name == CanvasType.Download) &&
									(
										<div
											id={_id}
											style={{
												width: "100%",
												height: "100%"
											}}
										>
											{childrens.map(child => {
												const styles = tLToCenter({
													top: child.top,
													left: child.left,
													width: child.width,
													height: child.height,
													rotateAngle: child.rotateAngle
												});
												const {
													position: { centerX, centerY },
													transform: { rotateAngle }
												} = styles;
												return (
													<div
														key={child._id}
														id={_id + child._id + "text-container3"}
														style={{
															WebkitTextStroke: (child.effectId == 3 || child.effectId == 4) && (`${1.0 * child.hollowThickness / 100 * 4 + 0.1}px ${(child.effectId == 3 || child.effectId == 4) ? child.color : "black"}`),
															transform: "translateZ(0)",
														}}
													>
														<div
															id={_id + child._id + "text-container2" + canvas}
															className={`text-container ${_id + child._id + "text-container2" + canvas}`}
															key={child._id}
															style={{
																zIndex: selected && objectType !== TemplateType.Image ? 1 : 0,
																left: child.left * scale,
																top: child.top * scale,
																position: "absolute",
																width: (width * child.width2) / scaleX * scale,
																height: child.height * scale,
																transform: `rotate(${rotateAngle}deg)`,
																opacity: opacity,
																fontFamily: `${child.fontFace}, AvenirNextRoundedPro`,
																color: (child.effectId == 3 || child.effectId == 4) ? "transparent" : child.color,
																textShadow: child.effectId == 1 ? `rgba(25, 25, 25, ${1.0 * child.textShadowTransparent / 100}) ${21.0 * child.offSet / 100 * Math.sin(child.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * child.offSet / 100 * Math.cos(child.direction * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * child.blur / 100}px` :
																	child.effectId == 2 ? `rgba(0, 0, 0, ${0.6 * child.intensity}) 0 8.9px ${66.75 * child.intensity / 100}px` :
																		child.effectId == 4 ? `rgb(128, 128, 128) ${21.0 * child.offSet / 100 * Math.sin(child.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * child.offSet / 100 * Math.cos(child.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
																			child.effectId == 5 ? `rgba(0, 0, 0, 0.5) ${21.0 * child.offSet / 100 * Math.sin(child.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * child.offSet / 100 * Math.cos(child.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * child.offSet / 100 * Math.sin(child.direction * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * child.offSet / 100 * Math.cos(child.direction * 3.6 / 360 * 2 * Math.PI)}px 0px` :
																				child.effectId == 6 && `rgb(0, 255, 255) ${21.0 * child.offSet / 100 * Math.sin(child.direction * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * child.offSet / 100 * Math.cos(child.direction * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * child.offSet / 100 * Math.sin(child.direction * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * child.offSet / 100 * Math.cos(child.direction * 3.6 / 360 * 2 * Math.PI))}px 0px`,
																filter: child.filter,
																lineHeight: `${child.lineHeight * child.fontSize}px`,
																fontStyle: child.italic ? "italic" : "",
																fontWeight: child.bold ? "bold" : "normal",
																letterSpacing: `${1.0 * child.letterSpacing / 100 * 4}px`,
															}}
														>
															<SingleText
																ref={ref => {
																	this.childrens[child._id] = ref;
																}}
																textAlign={child.align}
																fontFace={child.fontFace}
																selectionScaleY={this.state.selectionScaleY}
																zIndex={zIndex}
																scaleX={child.scaleX}
																scaleY={child.scaleY}
																parentScaleX={scaleX}
																parentScaleY={scaleY}
																width={(width * child.width2) / scaleX / child.scaleX}
																height={child.height}
																centerX={centerX / child.scaleX}
																centerY={centerY / child.scaleY}
																rotateAngle={rotateAngle}
																parentIndex={_id}
																innerHTML={child.innerHTML}
																_id={_id + child._id + canvas}
																selected={child.selected}
																onInput={onTextChange}
																onBlur={this.endEditing.bind(this)}
																onMouseDown={this.startEditing.bind(this)}
																onFontSizeChange={(fontSize, scaleY) => {
																	onFontSizeChange(fontSize * scaleY);
																	this.startEditing(scaleY);
																}}
																handleFontColorChange={handleFontColorChange}
																handleFontFaceChange={handleFontFaceChange}
																handleChildIdSelected={handleChildIdSelected}
																childId={child._id}
																scale={scale}
															/>
														</div>
													</div>
												);
											})}{" "}
										</div>
									)}
								{objectType == TemplateType.Heading && (
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

											{((selected && name == CanvasType.HoverLayer) || name == CanvasType.Preview ||
												(!selected && (name == CanvasType.All)) ||
												name == CanvasType.Download) &&
												objectType === TemplateType.Heading &&
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
														textShadow: effectId == 1 ? `rgba(25, 25, 25, ${1.0 * textShadowTransparent / 100}) ${21.0 * offSet / 100 * Math.sin(effectDirection * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * offSet / 100 * Math.cos(effectDirection * 3.6 / 360 * 2 * Math.PI)}px ${30.0 * blur / 100}px` :
															effectId == 2 ? `rgba(0, 0, 0, ${0.6 * intensity}) 0 8.9px ${66.75 * intensity / 100}px` :
																effectId == 4 ? `rgb(128, 128, 128) ${21.0 * offSet / 100 * Math.sin(effectDirection * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * offSet / 100 * Math.cos(effectDirection * 3.6 / 360 * 2 * Math.PI)}px 0px` :
																	effectId == 5 ? `rgba(0, 0, 0, 0.5) ${21.0 * offSet / 100 * Math.sin(effectDirection * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * offSet / 100 * Math.cos(effectDirection * 3.6 / 360 * 2 * Math.PI)}px 0px, rgba(0, 0, 0, 0.3) ${41.0 * offSet / 100 * Math.sin(effectDirection * 3.6 / 360 * 2 * Math.PI)}px ${41.0 * offSet / 100 * Math.cos(effectDirection * 3.6 / 360 * 2 * Math.PI)}px 0px` :
																		effectId == 6 && `rgb(0, 255, 255) ${21.0 * offSet / 100 * Math.sin(effectDirection * 3.6 / 360 * 2 * Math.PI)}px ${21.0 * offSet / 100 * Math.cos(effectDirection * 3.6 / 360 * 2 * Math.PI)}px 0px, rgb(255, 0, 255) ${-(21.0 * offSet / 100 * Math.sin(effectDirection * 3.6 / 360 * 2 * Math.PI))}px ${-(21.0 * offSet / 100 * Math.cos(effectDirection * 3.6 / 360 * 2 * Math.PI))}px 0px`,
														filter: filter,
														lineHeight: `${lineHeight * fontSize}px`,
														letterSpacing: `${1.0 * letterSpacing / 100 * 4}px`,
													}}
												></span>
											}
										</div>
									</div>
								)}

							</div>
						}
						{objectType === TemplateType.Video && cropMode && name == CanvasType.HoverLayer && 
							<div
								className={`${_id}1236`}
								style={{
									transform: `translate(${posX}px, ${posY}px)`,
									width: imgWidth + "px",
									height: imgHeight + "px",
									zIndex: 0,
									position: "absolute",
								}}
							>
								{<div
									style={{
										position: "absolute",
										top: "-2px",
										left: "-2px",
										right: "-2px",
										bottom: "-2px",
										backgroundImage:
											(objectType == TemplateType.TextTemplate || objectType == TemplateType.GroupedItem) ? `linear-gradient(90deg,#00d9e1 60%,transparent 0),linear-gradient(180deg,#00d9e1 60%,transparent 0),linear-gradient(90deg,#00d9e1 60%,transparent 0),linear-gradient(180deg,#00d9e1 60%,transparent 0)`
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
								(objectType === TemplateType.Image || objectType == TemplateType.BackgroundImage || objectType === TemplateType.Video)) &&
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
									background: objectType == TemplateType.Video && selected && name != CanvasType.Download && !cropMode &&
										'linear-gradient(0deg, rgba(0,0,0,0.7147233893557423) 0%, rgba(13,1,1,0) 34%)',
								}}
							>
								{cropMode &&
									selected && name == CanvasType.HoverLayer && (
										<div
											className={`${_id}1236`}
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
														let visibility = objectType === TemplateType.BackgroundImage ? "visible" : getImageResizerVisibility(this.state.image, scale, d);
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
							objectType !== TemplateType.BackgroundImage && (
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
						{objectType === TemplateType.Video &&
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
									top: "-2px",
									left: "-2px",
									right: "-2px",
									bottom: "-2px",
									backgroundImage:
										(objectType == TemplateType.TextTemplate || objectType == TemplateType.GroupedItem) ? `linear-gradient(90deg,#00d9e1 60%,transparent 0),linear-gradient(180deg,#00d9e1 60%,transparent 0),linear-gradient(90deg,#00d9e1 60%,transparent 0),linear-gradient(180deg,#00d9e1 60%,transparent 0)`
											: 'linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1),linear-gradient(90deg,#00d9e1 0,#00d9e1),linear-gradient(180deg,#00d9e1 0,#00d9e1)',
									backgroundPosition: 'top,100%,bottom,0',
									backgroundSize: '12px 2px,2px 12px,12px 2px,2px 12px',
									backgroundRepeat: 'repeat-x,repeat-y,repeat-x,repeat-y',
									opacity: ((hovered || selected) && !cropMode) || (cropMode && objectType != TemplateType.BackgroundImage) ? 1 : 0,
									pointerEvents: "none",
								}}>

							</div>}
					</StyledRect>
			</div> </div>
			</div>
		);
	}
}
