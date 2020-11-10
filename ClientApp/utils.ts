import { AppThunkActionAsync } from "@Store/index";
import { compact, isBoolean } from 'lodash';
import htmlToImageLib from './htmltoimage';
import { VisibilityProperty } from "csstype";
import React from "react";
export const htmlToImage = htmlToImageLib;
import { camelCase } from "lodash";
import editorStore from "@Store/EditorStore";
import { TemplateType, CanvasType, SidebarTab, SavingState, Mode, } from "@Components/editor/enums";
import { toJS } from "mobx";
import axios from "axios";
import uuidv4 from "uuid/v4";
import Globals from "@Globals";
import { fromEvent, merge } from "rxjs";
import { catchError, filter, first, map, takeUntil } from "rxjs/operators";
import ReactDOMServer from "react-dom/server";
import {
    rotateRect,
    rotatePoint,
} from "@Components/selection/utils";

declare var process: any;

export function clone<T>(object: T): T {
    return JSON.parse(JSON.stringify(object));
}

export function getPromiseFromAction<T, V>(asyncActionCreator: AppThunkActionAsync<T, V>): Promise<V> {
    return (asyncActionCreator as any) as Promise<V>;
}

/**
 * Is server prerendering by Node.js.
 * There can't be any DOM: window, document, etc.
 */
export function isNode(): boolean {
    return typeof process === 'object' && process.versions && !!process.versions.node;
}

export function isObjectEmpty(obj): boolean {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export function emptyForm(form: HTMLFormElement): void {
    var inputs = Array.from(form.querySelectorAll("input, select, textarea"));
    inputs.forEach(x => {
        var inputType = x.getAttribute("type");
        if (inputType === "checkbox" || inputType === "radio") {
            (x as any).checked = false;
        } else {
            (x as any).value = "";
        }
    });
}

export function trimList(list) {
    return compact(list).join(' ')
}

export function getOtherProps({ propTypes = {} }, props) {
    const propKeyList = Object.keys(propTypes)

    return Object.entries(props).reduce(
        (result, [key, val]) => (
            !propKeyList.includes(key)
                ? Object.assign(result, { [key]: val })
                : result
        ),
        {},
    )
}

export const getLength = (x, y) => Math.sqrt(x * x + y * y)


export const getAngle = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
    const dot = x1 * x2 + y1 * y2
    const det = x1 * y2 - y1 * x2
    const angle = Math.atan2(det, dot) / Math.PI * 180
    return (angle + 360) % 360
}

export const tLToCenter = ({ top, left, width, height, rotateAngle }) => ({
    position: {
        centerX: left + width / 2,
        centerY: top + height / 2
    },
    size: {
        width,
        height
    },
    transform: {
        rotateAngle
    }
})


const cursorStartMap = { n: 0, ne: 1, e: 2, se: 3, s: 4, sw: 5, w: 6, nw: 7 }
const cursorDirectionArray = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']
const cursorMap = { 0: 0, 1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 4, 7: 5, 8: 6, 9: 6, 10: 7, 11: 8 }
export const getCursor = (rotateAngle, d) => {
    const increment = cursorMap[Math.floor(rotateAngle / 30)]
    const index = cursorStartMap[d]
    const newIndex = (index + increment) % 8

    return cursorDirectionArray[newIndex]
}

export const centerToTL = ({ centerX, centerY, width, height, rotateAngle }) => ({
    top: centerY - height / 2,
    left: centerX - width / 2,
    width,
    height,
    rotateAngle
})


const setWidthAndDeltaW = (width, deltaW, minWidth) => {
    const expectedWidth = width + deltaW
    if (expectedWidth > minWidth) {
        width = expectedWidth
    } else {
        deltaW = minWidth - width
        width = minWidth
    }
    return { width, deltaW }
}

const setHeightAndDeltaH = (height, deltaH, minHeight) => {
    const expectedHeight = height + deltaH
    if (expectedHeight > minHeight) {
        height = expectedHeight
    } else {
        deltaH = minHeight - height
        height = minHeight
    }
    return { height, deltaH }
}



export const getNewStyle = (type, rect, deltaW, deltaH, ratio, minWidth, minHeight) => {
    let { width, height, centerX, centerY, rotateAngle } = rect
    const widthFlag = width < 0 ? -1 : 1
    const heightFlag = height < 0 ? -1 : 1
    width = Math.abs(width)
    height = Math.abs(height)
    switch (type) {
        case 'r': {
            const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth)
            width = widthAndDeltaW.width
            deltaW = widthAndDeltaW.deltaW
            if (ratio) {
                deltaH = deltaW / ratio
                height = width / ratio
                // 左上角固定
                centerX += deltaW / 2 * cos(rotateAngle) - deltaH / 2 * sin(rotateAngle)
                centerY += deltaW / 2 * sin(rotateAngle) + deltaH / 2 * cos(rotateAngle)
            } else {
                // 左边固定
                centerX += deltaW / 2 * cos(rotateAngle)
                centerY += deltaW / 2 * sin(rotateAngle)
            }
            break
        }
        case 'tr': {
            deltaH = -deltaH
            const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth)
            width = widthAndDeltaW.width
            deltaW = widthAndDeltaW.deltaW
            const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight)
            height = heightAndDeltaH.height
            deltaH = heightAndDeltaH.deltaH
            if (ratio) {
                deltaW = deltaH * ratio
                width = height * ratio
            }
            centerX += deltaW / 2 * cos(rotateAngle) + deltaH / 2 * sin(rotateAngle)
            centerY += deltaW / 2 * sin(rotateAngle) - deltaH / 2 * cos(rotateAngle)
            break
        }
        case 'br': {
            const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth)
            width = widthAndDeltaW.width
            deltaW = widthAndDeltaW.deltaW
            const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight)
            height = heightAndDeltaH.height
            deltaH = heightAndDeltaH.deltaH
            if (ratio) {
                deltaW = deltaH * ratio
                width = height * ratio
            }
            centerX += deltaW / 2 * cos(rotateAngle) - deltaH / 2 * sin(rotateAngle)
            centerY += deltaW / 2 * sin(rotateAngle) + deltaH / 2 * cos(rotateAngle)
            break
        }
        case 'b': {
            const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight)
            height = heightAndDeltaH.height
            deltaH = heightAndDeltaH.deltaH
            if (ratio) {
                deltaW = deltaH * ratio
                width = height * ratio
                // 左上角固定
                centerX += deltaW / 2 * cos(rotateAngle) - deltaH / 2 * sin(rotateAngle)
                centerY += deltaW / 2 * sin(rotateAngle) + deltaH / 2 * cos(rotateAngle)
            } else {
                // 上边固定
                centerX -= deltaH / 2 * sin(rotateAngle)
                centerY += deltaH / 2 * cos(rotateAngle)
            }
            break
        }
        case 'bl': {
            deltaW = -deltaW
            const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth)
            width = widthAndDeltaW.width
            deltaW = widthAndDeltaW.deltaW
            const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight)
            height = heightAndDeltaH.height
            deltaH = heightAndDeltaH.deltaH
            if (ratio) {
                height = width / ratio
                deltaH = deltaW / ratio
            }
            centerX -= deltaW / 2 * cos(rotateAngle) + deltaH / 2 * sin(rotateAngle)
            centerY -= deltaW / 2 * sin(rotateAngle) - deltaH / 2 * cos(rotateAngle)
            break
        }
        case 'l': {
            deltaW = -deltaW
            const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth)
            width = widthAndDeltaW.width
            deltaW = widthAndDeltaW.deltaW
            if (ratio) {
                height = width / ratio
                deltaH = deltaW / ratio
                // 右上角固定
                centerX -= deltaW / 2 * cos(rotateAngle) + deltaH / 2 * sin(rotateAngle)
                centerY -= deltaW / 2 * sin(rotateAngle) - deltaH / 2 * cos(rotateAngle)
            } else {
                // 右边固定
                centerX -= deltaW / 2 * cos(rotateAngle)
                centerY -= deltaW / 2 * sin(rotateAngle)
            }
            break
        }
        case 'tl': {
            deltaW = -deltaW
            deltaH = -deltaH
            const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth)
            width = widthAndDeltaW.width
            deltaW = widthAndDeltaW.deltaW
            const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight)
            height = heightAndDeltaH.height
            deltaH = heightAndDeltaH.deltaH
            if (ratio) {
                width = height * ratio
                deltaW = deltaH * ratio
            }

            centerX -= deltaW / 2 * cos(rotateAngle) - deltaH / 2 * sin(rotateAngle)
            centerY -= deltaW / 2 * sin(rotateAngle) + deltaH / 2 * cos(rotateAngle)
            break
        }
        case 't': {
            deltaH = -deltaH
            const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight)
            height = heightAndDeltaH.height
            deltaH = heightAndDeltaH.deltaH
            if (ratio) {
                width = height * ratio
                deltaW = deltaH * ratio
                // 左下角固定
                centerX += deltaW / 2 * cos(rotateAngle) + deltaH / 2 * sin(rotateAngle)
                centerY += deltaW / 2 * sin(rotateAngle) - deltaH / 2 * cos(rotateAngle)
            } else {
                centerX += deltaH / 2 * sin(rotateAngle)
                centerY -= deltaH / 2 * cos(rotateAngle)
            }
            break
        }
    }

    return {
        position: {
            centerX,
            centerY
        },
        size: {
            width: width * widthFlag,
            height: height * heightFlag
        }
    }
}

export const degToRadian = (deg) => deg * Math.PI / 180


const cos = (deg) => Math.cos(degToRadian(deg))
const sin = (deg) => Math.sin(degToRadian(deg))

const IBOT = { OPEN_MODAL_STACK: [] }

export function addModalToStack(modal) {
    return Object.assign(IBOT, { OPEN_MODAL_STACK: [modal, ...IBOT.OPEN_MODAL_STACK] })
}

export function deleteModalFromStack(modal) {
    return Object.assign(IBOT, { OPEN_MODAL_STACK: IBOT.OPEN_MODAL_STACK.filter(it => it !== modal) })
}

export function checkNoOpenModalInStack() {
    const { OPEN_MODAL_STACK } = IBOT
    return OPEN_MODAL_STACK.length === 0 || OPEN_MODAL_STACK.every(modal => !modal.state.isOpen)
}

export function checkModalIndexInStack(modal) {
    return IBOT.OPEN_MODAL_STACK.indexOf(modal)
}

export function toggleGlobalScroll(expected) {
    const $root = document.documentElement
    const $body = document.body
    const $content = document.getElementsByClassName('ContentRoot')[0] as HTMLElement

    const { innerWidth: vw, scrollX, scrollY } = window
    const is = isBoolean(expected) ? expected : $body.classList.toggle('is-content-fixed')

    if (isBoolean(expected)) {
        $body.classList[expected ? 'add' : 'remove']('is-content-fixed')
    }

    if (!$content) return is

    if (is) {
        $content.style.left = `-${scrollX}px`
        $content.style.top = `-${scrollY}px`

        window.scrollTo(
            Math.max(($root.scrollWidth - vw) / 2, 0),
            0,
        )
    } else {
        window.scrollTo(
            Math.abs(parseInt($content.style.left, 10)),
            Math.abs(parseInt($content.style.top, 10)),
        )
    }

    return is
}

export function preparePortal($root, className) {
    const $portal = Object.assign(
        document.createElement('div'),
        { className },
    )

    $root.appendChild($portal)
    return $portal
}

export function positionRotated(left: number, top: number, width: number, height: number, rotateAngle: number) {
    let centerX = left + width / 2;
    let centerY = top + height / 2;
    if (rotateAngle === 90 || rotateAngle === 270) {
        return {
            top: centerY - width / 2,
            left: centerX - height / 2,
            width: height,
            height: width,
        }
    }

    return {
        top,
        left,
        width,
        height,
    }
}

export function getBoundingClientRect(id: string) {
    if (!document.getElementById(id)) {
        return null;
    }
    return document.getElementById(id).getBoundingClientRect();
}

export function getMostProminentColor(imgEl) {
    var data = getImageData(imgEl, null, null, null);
    var rgb = null;
    rgb = getMostProminentRGBImpl(data, 6, rgb);
    rgb = getMostProminentRGBImpl(data, 4, rgb);
    rgb = getMostProminentRGBImpl(data, 2, rgb);
    rgb = getMostProminentRGBImpl(data, 0, rgb);
    return rgb;
};

var getImageData = function (imgEl, degrade, rgbMatch, colorFactorCallback) {
    var rgb,
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height, key,
        i = -4,
        db = {},
        length, r, g, b,
        count = 0;

    if (!context) {
        return null;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch (e) {
        /* security error, img on diff domain */
        return null;
    }

    length = data.data.length;

    var factor = Math.max(1, Math.round(length / 5000));
    var result = {};

    while ((i += 4 * factor) < length) {
        if (data.data[i + 3] > 32) {
            key = (data.data[i] >> degrade) + "," + (data.data[i + 1] >> degrade) + "," + (data.data[i + 2] >> degrade);
            if (!result.hasOwnProperty(key)) {
                rgb = { r: data.data[i], g: data.data[i + 1], b: data.data[i + 2], count: 1 };
                rgb.weight = 0;
                // rgb.weight = this.callback(rgb.r, rgb.g, rgb.b);
                if (rgb.weight <= 0) rgb.weight = 1e-10;
                result[key] = rgb;
            } else {
                rgb = result[key];
                rgb.count++;
            }
        }
    }

    return result;

};

var getMostProminentRGBImpl = function (pixels, degrade, rgbMatch) {

    var rgb = { r: 0, g: 0, b: 0, count: 0, d: degrade },
        db = {},
        pixel, pixelKey, pixelGroupKey,
        length, r, g, b,
        count = 0;


    for (pixelKey in pixels) {
        pixel = pixels[pixelKey];
        var totalWeight = pixel.weight * pixel.count;
        ++count;
        if (doesRgbMatch(rgbMatch, pixel.r, pixel.g, pixel.b)) {
            pixelGroupKey = (pixel.r >> degrade) + "," + (pixel.g >> degrade) + "," + (pixel.b >> degrade);
            if (db.hasOwnProperty(pixelGroupKey))
                db[pixelGroupKey] += totalWeight;
            else
                db[pixelGroupKey] = totalWeight;
        }
    }

    for (var i in db) {
        var data = i.split(",");
        r = data[0];
        g = data[1];
        b = data[2];
        count = db[i];

        if (count > rgb.count) {
            rgb.count = count;
            data = i.split(",");
            rgb.r = r;
            rgb.g = g;
            rgb.b = b;
        }
    }

    return rgb;

};

var doesRgbMatch = function (rgb, r, g, b) {
    if (rgb == null) return true;
    r = r >> rgb.d;
    g = g >> rgb.d;
    b = b >> rgb.d;
    return rgb.r == r && rgb.g == g && rgb.b == b;
}

export const updateTransformXY = function (elId, x, y: any) {
    var el1238 = document.getElementById(elId);
    if (el1238) {
        el1238.style.transform = `translate(${x}px, ${y}px)`;
    }

    var temp = document.getElementsByClassName(elId) as HTMLCollectionOf<HTMLElement>;
    for (var i = 0; i < temp.length; ++i) {
        temp[i].style.transform = `translate(${x}px, ${y}px)`;
    }
}

export const updatePosition = function (elId, image: any) {
    let scale = editorStore.scale;
    let el = document.getElementById(elId);
    if (el) {
        el.style.width = image.width * scale + "px";
        el.style.height = image.height * scale + "px";
        el.style.transform = `translate(${image.left * scale}px, ${image.top * scale}px) rotate(${image.rotateAngle ? image.rotateAngle : 0}deg)`;
    }

    var temp = document.getElementsByClassName(elId) as HTMLCollectionOf<HTMLElement>;
    for (var i = 0; i < temp.length; ++i) {
        let el2 = temp[i];
        el2.style.width = image.width * scale + "px";
        el2.style.height = image.height * scale + "px";
        el2.style.transform = `translate(${image.left * scale}px, ${image.top * scale}px) rotate(${image.rotateAngle ? image.rotateAngle : 0}deg)`;

    }
}

export const updateRotate = function (elId, rotateAngle: any) {
    var el = document.getElementById(elId);
    if (el) {
        el.style.transform = `rotate(${rotateAngle}deg)`;
    }
}

export const getCursorStyleWithRotateAngle = (rotateAngle): string => {
    let rotateCursor = '-webkit-image-set(url("https://static.canva.com/web/images/4d0e991d3ba4f5fc763640a966b6171a.png") 1x, url("https://static.canva.com/web/images/c0013ec5969d2610c26794064d159d8c.png") 2x) 12 12, auto';
    if (rotateAngle >= 8) {
        rotateCursor = '-webkit-image-set(url("https://static.canva.com/web/images/226ff3adc87fd7093018e0c8a3cc931c.png") 1x, url("https://static.canva.com/web/images/aeab367bea5bbe7496f72eea9d6edae0.png") 2x) 12 12, auto';
    }
    if (rotateAngle >= 23) {
        rotateCursor = '-webkit-image-set(url("https://static.canva.com/web/images/d33c87b484f655fb60bd17688adf3e70.png") 1x, url("https://static.canva.com/web/images/2e9713fbd41bc52efff81476412ef9a1.png") 2x) 12 12, auto';
    }
    if (rotateAngle >= 34) {
        rotateCursor = '-webkit-image-set(url("https://static.canva.com/web/images/a4da5947a391c4ec3b9080ca26583bb0.png") 1x, url("https://static.canva.com/web/images/8ef78f9b8e2e93577b418aa180d5a02b.png") 2x) 12 12, auto';
    }
    if (rotateAngle >= 53) {
        rotateCursor = '-webkit-image-set(url("https://static.canva.com/web/images/263856851390cd905452bf7b5d39b725.png") 1x, url("https://static.canva.com/web/images/c60bd1d65fc56081c60fe21454cd5d5c.png") 2x) 12 12, auto';
    }
    if (rotateAngle >= 68) {
        rotateCursor = '-webkit-image-set(url("https://static.canva.com/web/images/3fd9adc7eac568ae4407a879223a7a5b.png") 1x, url("https://static.canva.com/web/images/81cd6bf75f29bf693d5ae72fc3fe4b26.png") 2x) 12 12, auto';
    }
    if (rotateAngle >= 83) {
        rotateCursor = '-webkit-image-set(url("https://static.canva.com/web/images/956c07bd1e2cf2a0e7a674681caf5be0.png") 1x, url("https://static.canva.com/web/images/5641e42456ca9302d7f5c36b3b768bdb.png") 2x) 12 12, auto';
    }
    if (rotateAngle >= 98) {
        rotateCursor = '-webkit-image-set(url("https://static.canva.com/web/images/63999399c8cf3b47236a30ea6a310a32.png") 1x, url("https://static.canva.com/web/images/7630c7c6064e9bfeb38ca5fb2d610b14.png") 2x) 12 12, auto';
    }
    if (rotateAngle >= 114) {
        rotateCursor = '-webkit-image-set(url("https://static.canva.com/web/images/aba8fc531953b668920076359565eb59.png") 1x, url("https://static.canva.com/web/images/304c5237c37c6f12b5f4723140851885.png") 2x) 12 12, auto';
    }
    if (rotateAngle >= 128) {
        rotateCursor = '-webkit-image-set(url("https://static.canva.com/web/images/33f1440c7ada5e7e8f31a706fcf722ee.png") 1x, url("https://static.canva.com/web/images/a70b4aea98ca6fb43d271c0e7bc6e971.png") 2x) 12 12, auto';
    }
    if (rotateAngle >= 158) {
        rotateCursor = '-webkit-image-set(url("https://static.canva.com/web/images/31295144b1e0601d2676be6c73dcf1b1.png") 1x, url("https://static.canva.com/web/images/8cf4a69209688d1a361b924305a03d24.png") 2x) 12 12, auto';
    }
    if (rotateAngle >= 173) {
        rotateCursor = '-webkit-image-set(url("https://static.canva.com/web/images/2e0ea326850959ffed4c15a186697a9f.png") 1x, url("https://static.canva.com/web/images/e8752eb4551722c4146c4fbc758bd06a.png") 2x) 12 12, auto';
    }
    if (rotateAngle >= 188) {
        rotateCursor = '-webkit-image-set(url(https://static.canva.com/web/images/d40ce2ba71b8a2ce6525fc7e3d845e49.png) 1x,url(https://static.canva.com/web/images/075781315af6111fb4503e9086b2efcf.png) 2x) 12 12,auto';
    }
    if (rotateAngle >= 203) {
        rotateCursor = '-webkit-image-set(url(https://static.canva.com/web/images/9a4e14bff3ccd5e318047611990c7374.png) 1x,url(https://static.canva.com/web/images/1ff3355a9b655de68e84aacfdafc25f2.png) 2x) 12 12,auto';
    }
    if (rotateAngle >= 218) {
        rotateCursor = '-webkit-image-set(url(https://static.canva.com/web/images/2b7409e26aa3f06f03f156502dacc115.png) 1x,url(https://static.canva.com/web/images/7f8c1832956230f04d4c581a77d296db.png) 2x) 12 12,auto';
    }
    if (rotateAngle >= 248) {
        rotateCursor = '-webkit-image-set(url(https://static.canva.com/web/images/7db85eed14fd1a977cf9fad576733372.png) 1x,url(https://static.canva.com/web/images/a96fa3c5cbeec044303355c288117ded.png) 2x) 12 12,auto';
    }
    if (rotateAngle >= 263) {
        rotateCursor = '-webkit-image-set(url(https://static.canva.com/web/images/713e3da1691fe19554200e5b21617b50.png) 1x,url(https://static.canva.com/web/images/568981428352da22ea90f690b357502a.png) 2x) 12 12,auto';
    }
    if (rotateAngle >= 278) {
        rotateCursor = '-webkit-image-set(url(https://static.canva.com/web/images/7d9caa2e41936cabdb1ca50870fc3186.png) 1x,url(https://static.canva.com/web/images/15e6a4536d75f31488fcb77b684602f5.png) 2x) 12 12,auto';
    }
    if (rotateAngle >= 293) {
        rotateCursor = '-webkit-image-set(url(https://static.canva.com/web/images/878b259878673d7fa8b605d6013d2078.png) 1x,url(https://static.canva.com/web/images/fda7715798b4fd045fc9541a23e53dd9.png) 2x) 12 12,auto';
    }
    if (rotateAngle >= 309) {
        rotateCursor = '-webkit-image-set(url(https://static.canva.com/web/images/345e22a8570868fae4d383ffe4ecac76.png) 1x,url(https://static.canva.com/web/images/4aace0450af6b3273e73b30548a62797.png) 2x) 12 12,auto';
    }
    if (rotateAngle >= 323) {
        rotateCursor = '-webkit-image-set(url(https://static.canva.com/web/images/1bbecc821ffe33e2147c0be478f9d607.png) 1x,url(https://static.canva.com/web/images/65f6b75e8dab165252e0cd294603f56a.png) 2x) 12 12,auto';
    }
    if (rotateAngle >= 338) {
        rotateCursor = '-webkit-image-set(url(https://static.canva.com/web/images/4661bcf5b63be067385bd9260947ef7d.png) 1x,url(https://static.canva.com/web/images/998c42bc22fea0523acd4fc5ba32115f.png) 2x) 12 12,auto';
    }
    if (rotateAngle >= 353) {
        rotateCursor = '-webkit-image-set(url(https://static.canva.com/web/images/4d0e991d3ba4f5fc763640a966b6171a.png) 1x,url(https://static.canva.com/web/images/c0013ec5969d2610c26794064d159d8c.png) 2x) 12 12,auto';
    }
    return rotateCursor;
}

export const getCursorStyleForResizer = (rotateAngle, d): string => {
    var cursor;
    var normalizedRotateAngle = rotateAngle;
    if (d == "n") {
        normalizedRotateAngle = normalizedRotateAngle + 45;
    } else if (d == "ne") {
        normalizedRotateAngle = normalizedRotateAngle + 90;
    } else if (d == "e") {
        normalizedRotateAngle = normalizedRotateAngle + 135;
    } else if (d == "es") {
        normalizedRotateAngle = normalizedRotateAngle + 180;
    } else if (d == "s") {
        normalizedRotateAngle = normalizedRotateAngle + 225;
    } else if (d == "sw") {
        normalizedRotateAngle = normalizedRotateAngle + 270;
    } else if (d == "w") {
        normalizedRotateAngle = normalizedRotateAngle + 315;
    }
    normalizedRotateAngle = normalizedRotateAngle % 180;
    if (normalizedRotateAngle >= 0 && normalizedRotateAngle < 8) {
        cursor =
            "-webkit-image-set(url(https://static.canva.com/web/images/7ea01757f820a9fb828312dcf38cb746.png) 1x,url(https://static.canva.com/web/images/2c4ec45151de402865dffaaa087ded3c.png) 2x) 12 12,auto";
    }
    if (normalizedRotateAngle >= 8 && normalizedRotateAngle < 23) {
        cursor =
            "-webkit-image-set(url(https://static.canva.com/web/images/4434684d762b5dea2ff268f549a43269.png) 1x,url(https://static.canva.com/web/images/9b8ad9e061f825e77d1b97b71ffde9a4.png) 2x) 12 12,auto";
    }
    if (normalizedRotateAngle >= 23 && normalizedRotateAngle < 38) {
        cursor =
            "-webkit-image-set(url(https://static.canva.com/web/images/02d2d3984af99ad512694e82a689a9a8.png) 1x,url(https://static.canva.com/web/images/d2bb4fd0691527a4fd01a55d1ebb6f87.png) 2x) 12 12,auto";
    }
    if (normalizedRotateAngle >= 38 && normalizedRotateAngle < 53) {
        cursor =
            "-webkit-image-set(url(https://static.canva.com/web/images/5e315937d3456710f9684f89c7860ea8.png) 1x,url(https://static.canva.com/web/images/a3609c7d7315d7301c3832d7e76e7974.png) 2x) 12 12,auto";
    }
    if (normalizedRotateAngle >= 53 && normalizedRotateAngle < 68) {
        cursor =
            "-webkit-image-set(url(https://static.canva.com/web/images/ba88e3ebda4fdf44251c3fa36faec38e.png) 1x,url(https://static.canva.com/web/images/13d7d7347a19703627af6dc4c7e584aa.png) 2x) 12 12,auto";
    }
    if (normalizedRotateAngle >= 68 && normalizedRotateAngle < 83) {
        cursor =
            "-webkit-image-set(url(https://static.canva.com/web/images/1766922605e07ad48762f0578f23cd73.png) 1x,url(https://static.canva.com/web/images/16fdd75b90535598d4379c348bc9d39e.png) 2x) 12 12,auto";
    }
    if (normalizedRotateAngle >= 83 && normalizedRotateAngle < 98) {
        cursor =
            "-webkit-image-set(url(https://static.canva.com/web/images/d78cdce65d153748ffd0fb1a5573ac75.png) 1x,url(https://static.canva.com/web/images/ce13b386dbba73815423332724d3030a.png) 2x) 12 12,auto";
    }
    if (normalizedRotateAngle >= 98 && normalizedRotateAngle < 113) {
        cursor =
            "-webkit-image-set(url(https://static.canva.com/web/images/cf19806f9578c66128338be1742c67f9.png) 1x,url(https://static.canva.com/web/images/90f8d3f4bc588410bd1d218455116b41.png) 2x) 12 12,auto";
    }
    if (normalizedRotateAngle >= 113 && normalizedRotateAngle < 128) {
        cursor =
            "-webkit-image-set(url(https://static.canva.com/web/images/4dba7d81ce991e1546824042615cc1ef.png) 1x,url(https://static.canva.com/web/images/aed44f2fbd5cdfa5bf5d896df50dbffa.png) 2x) 12 12,auto";
    }
    if (normalizedRotateAngle >= 128 && normalizedRotateAngle < 143) {
        cursor =
            "-webkit-image-set(url(https://static.canva.com/web/images/159a13980e4a0d0a470a49f8d35eb5a6.png) 1x,url(https://static.canva.com/web/images/4ecfddb1ae830056cfa9144f81c83295.png) 2x) 12 12,auto";
    }
    if (normalizedRotateAngle >= 143 && normalizedRotateAngle < 158) {
        cursor =
            "-webkit-image-set(url(https://static.canva.com/web/images/a9079684178c3a8c1e37c4343524330b.png) 1x,url(https://static.canva.com/web/images/7d1ef78c7ac2fd9eca288126c98dc20e.png) 2x) 12 12,auto";
    }
    if (normalizedRotateAngle >= 158 && normalizedRotateAngle < 173) {
        cursor =
            "-webkit-image-set(url(https://static.canva.com/web/images/7ea01757f820a9fb828312dcf38cb746.png) 1x,url(https://static.canva.com/web/images/2c4ec45151de402865dffaaa087ded3c.png) 2x) 12 12,auto";
    }
    if (normalizedRotateAngle >= 173) {
        cursor =
            "-webkit-image-set(url(https://static.canva.com/web/images/7ea01757f820a9fb828312dcf38cb746.png) 1x,url(https://static.canva.com/web/images/2c4ec45151de402865dffaaa087ded3c.png) 2x) 12 12,auto";
    }

    return cursor;
}

export const getImageResizerVisibility = (img, scale, d): VisibilityProperty => {
    let result = "visible" as VisibilityProperty;
    switch (d) {
        case "nw":
            if (img.posX * scale >= -10 && img.posY * scale >= -10) {
                result = "hidden";
            }
            break;
        case "ne":
            if ((img.imgWidth + img.posX - img.width) * scale <= 10 && img.posY * scale >= -10) {
                result = "hidden";
            }
            break;
        case "sw":
            if (img.posX * scale >= -10 && (img.imgHeight + img.posY - img.height) * scale <= 10) {
                result = "hidden";
            }
            break;
        case "se":
            if ((img.imgWidth + img.posX - img.width) * scale <= 10 && (img.imgHeight + img.posY - img.height) * scale <= 10) {
                result = "hidden";
            }
            break;
    }
    return result;
}

export const transformPoint = (x, y, rotateAngle, centerX, centerY) => {
    return {
        x: (x - centerX) * Math.cos(rotateAngle) - (y - centerY) * Math.sin(rotateAngle) + centerX,
        y: (x - centerX) * Math.sin(rotateAngle) + (y - centerY) * Math.cos(rotateAngle) + centerY,
    }
}

export const transformImage = image => {
    let newL = image.left;
    let newR = image.left + image.width;
    let newT = image.top;
    let newB = image.top + image.height;
    let centerX = image.left + image.width / 2;
    let centerY = image.top + image.height / 2;
    let rotateAngle = image.rotateAngle / 180 * Math.PI;

    let bb = [
        transformPoint(newL, newT, rotateAngle, centerX, centerY),
        transformPoint(newR, newT, rotateAngle, centerX, centerY),
        transformPoint(newR, newB, rotateAngle, centerX, centerY),
        transformPoint(newL, newB, rotateAngle, centerX, centerY),
    ]

    let top = 999999, right = 0, bottom = 0, left = 999999;

    left = Math.min(left, bb[0].x);
    left = Math.min(left, bb[1].x);
    left = Math.min(left, bb[2].x);
    left = Math.min(left, bb[3].x);
    right = Math.max(right, bb[0].x)
    right = Math.max(right, bb[1].x)
    right = Math.max(right, bb[2].x)
    right = Math.max(right, bb[3].x)
    top = Math.min(top, bb[0].y)
    top = Math.min(top, bb[1].y)
    top = Math.min(top, bb[2].y)
    top = Math.min(top, bb[3].y)
    bottom = Math.max(bottom, bb[0].y)
    bottom = Math.max(bottom, bb[1].y)
    bottom = Math.max(bottom, bb[2].y)
    bottom = Math.max(bottom, bb[3].y)

    return {
        _id: image._id,
        x: [left, left + (right - left) / 2, right],
        y: [top, top + (bottom - top) / 2, bottom]
    };
}

export const secondToMinutes = sec => {
    const min = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${min}:${s < 10 ? '0' : ''}${s}`;
}

export const updateXGuide = (top2, bot2, guideEl, scale) => {
    if (guideEl) {
        guideEl.style.display = "block";
        guideEl.style.height = (bot2 - top2) * scale + "px";
        guideEl.style.top = top2 * scale + "px";
    }
}

export const updateYGuide = (left2, right2, guideEl, scale) => {
    if (guideEl) {
        guideEl.style.display = "block";
        guideEl.style.width = (right2 - left2) * scale + "px";
        guideEl.style.left = left2 * scale + "px";
    }
}

export const getGuideOfImage = id => {
    let res = [];

    for (let i = 0; i < 6; ++i) {
        res.push(document.getElementById(id + "guide_" + i))
    }

    return res;
}

export const hideGuide = el => {
    el.style.display = "none";
}

export const getLetterSpacing = val => `${1.0 * val / 100 * 50 - 15}px`;


export const processChildren = (children, _id = "", colors) => {
    return Array.from(children.length ? children : []).map(
        (node: any, i) => {
            // return if text node
            if (node.nodeType == 8) return null;
            if (node.nodeType === 3) return node.nodeValue;

            if (node.tagName == "svg") {
                // let el = document.createAttribute("class");
                // node.appendChild(el);
                // node.attributes["class"] = "svg";
                // node.attributes["className"] = "svg";
                node.setAttribute("class", _id);
            }

            let attributes;
            // collect all attributes
            if (node.attributes) {
                attributes = Array.from(node.attributes).reduce((attrs, attr: any) => {
                    if (node.tagName == "svg" && (attr.name == "width" || attr.name == "height")) {
                        attrs[attr.name] = "100%";
                    } else if (attr.name == "style") {
                        let style = createStyleJsonFromString(attr.value);
                        attrs[attr.name] = style;
                    }
                    else {
                        attrs[attr.name] = attr.value;
                    }
                    return attrs;
                }, {});
            }

            // create React component
            return React.createElement(node.nodeName, {
                ...attributes,
                key: i
            }, processChildren(node.childNodes));
        });
}

export const createStyleJsonFromString = (styleString) => {
    styleString = styleString || '';
    var styles = styleString.split(/;(?!base64)/);
    var singleStyle, key, value, jsonStyles = {};
    for (var i = 0; i < styles.length; ++i) {
        singleStyle = styles[i].split(':');
        if (singleStyle.length > 2) {
            singleStyle[1] = singleStyle.slice(1).join(':');
        }

        key = singleStyle[0];
        value = singleStyle[1];
        if (typeof value === 'string') {
            value = value.trim();
        }

        if (key != null && value != null && key.length > 0 && value.length > 0) {
            jsonStyles[camelCase(key)] = value;
        }
    }

    return jsonStyles;
}

export const handleBlockAnimation = (injectScriptOnly = false) => {
    clearInterval(window.intervalAnimation);
    clearTimeout(window.timeoutAnimation)
    let ids = [];
    let ratios = {};

    editorStore.images2.forEach(img => {
        if (img.type == TemplateType.Heading) {
            ids.push(img._id);
            ratios[`id${img._id}`] = {
                _id: img._id,
                left: img.left,
                top: img.top,
                width: img.width,
                height: img.height,
                color: img.color,
                rotateAngle: img.rotateAngle ? img.rotateAngle : 0,
                zIndex: img.zIndex,
                type: img.type,
            };
        } 
        else if (img.type == TemplateType.TextTemplate) {
            ids.push(img._id);
            ratios[`id${img._id}`] = {
                _id: img._id,
                left: img.left,
                top: img.top,
                width: img.width,
                height: img.height,
                color: img.color,
                rotateAngle: img.rotateAngle ? img.rotateAngle : 0,
                zIndex: img.zIndex,
                type: img.type,
                document_object: img.document_object,
            };
        } else {
            let el = document.getElementById(img._id + "_alo");
            if (el) {
                let opacity = img.opacity ? img.opacity : 100;
                opacity  = opacity / 100;
                el.style.opacity = opacity;
            }
        }
    });

    if (!injectScriptOnly) {
        let scale = editorStore.scale;

        ids.forEach((id, key) => {
            let el2 = document.getElementById(id + "animation-block");
            if (el2) el2.remove();

            let image = editorStore.images2.get(id);
            if (image && image.type == TemplateType.Heading) {
                let el = document.getElementById(id + "_alo");
                if (el) {
                    el.style.opacity = "0";

                    let newNode = document.createElement("div");
                    let newNode2 = document.createElement("div");
                    newNode.appendChild(newNode2);
                    newNode.id = id + "animation-block";
                    newNode.style.position = "absolute";
                    newNode.style.pointerEvents = "none";
                    newNode.style.zIndex = image.zIndex;
                    newNode.style.width = image.width * scale + "px";
                    newNode.style.height = image.height * scale + "px";
                    newNode.style.transform = `translate(${image.left * scale}px, ${image.top * scale}px) rotate(${image.rotateAngle}deg)`;
                    newNode.style.overflow = "hidden";
                    newNode2.style.width = "100%";
                    newNode2.style.height = "100%";
                    newNode2.style.background = image.color ? image.color : "black";
                    newNode2.style.transform = `translate(-${image.width * scale + 1}px, 0px)`;
                    newNode2.style.position = "absolute";
                    el.parentNode.appendChild(newNode);
                }
            } else if (image.type == TemplateType.TextTemplate) {
                image.document_object.forEach(child => {
                    if (child.type == TemplateType.Heading) {
                        let el = document.getElementById(image._id + child._id + "alo");
                        if (el) {
                            el.style.opacity = "0";
                            let animationNode = document.getElementById(image._id + child._id + "animation-block");
                            let newNode;
                            if (!animationNode) {
                                newNode = el.cloneNode(true);
                                animationNode = document.createElement("div");
                                newNode.style.overflow = "hidden";
                                newNode.appendChild(animationNode);
                                for (let i = 0; i < newNode.children.length; ++i) {
                                    newNode.children[i].style.opacity = 0;
                                }
                                el.parentNode.appendChild(newNode);
                            } else {
                                newNode = animationNode.parentNode;
                            }
                            newNode.style.opacity = "1";
                            animationNode.id = image._id + child._id + "animation-block";
                            animationNode.style.background = child.color;
                            animationNode.style.opacity = 1;
                            animationNode.style.top = 0;
                            animationNode.style.width = child.width / child.scaleX + "px";
                            animationNode.style.bottom = 0;
                            animationNode.style.position = "absolute";
                            animationNode.style.left = "-" + (child.width / child.scaleX + 10) + "px";
                        }
                    }
                });
            }
        });

        let limit = window.rectWidth;
        let limitHeight = 0;
        let marked = {};
        let curPos = {};
        window.intervalAnimation = setInterval(() => {
            ids.forEach(id => {
                let image = editorStore.images2.get(id);
                if (image && image.type == TemplateType.Heading) {
                    if ((image.left + image.width > limit && image.top <= limitHeight) || marked[id]) {

                        if (marked[id]) {
                            if (!curPos[id]) curPos[id] = 0;
                            if (curPos[id] < image.width / 5 * scale || curPos[id] > image.width * scale * 1.8) 
                                curPos[id] += image.width / 66  * scale;
                            else 
                                curPos[id] += image.width / 15 * scale;
                        } else {
                            curPos[id] = (limitHeight - image.top) / window.rectHeight * image.width;
                            marked[id] = true;
                        }

                        let el = document.getElementById(id + "animation-block") as HTMLElement;
                        if (el) el.children[0].style.transform = `translate(${-image.width * scale + curPos[id]}px, 0px)`;
                    }

                    let el2 = document.getElementById(id + "_alo");
                    if (el2 && -image.width * scale + curPos[id] > 0) el2.style.opacity = 1;
                } else if (image && image.type == TemplateType.TextTemplate) {
                    image.document_object.forEach(child => {
                        let childId = id + child._id;
                        if ((image.left + child.left + child.width / child.scaleX > limit && image.top + child.top + child.height <= limitHeight) || marked[childId]) {

                            if (marked[childId]) {
                                if (!curPos[childId]) curPos[childId] = 0;
                                if (curPos[childId] < child.width / child.scaleX / 5 || curPos[childId] > child.width / child.scaleX * 1.8) 
                                    curPos[childId] += child.width / child.scaleX / 66 ;
                                else 
                                    curPos[childId] += child.width / child.scaleX / 15;
                            } else {
                                curPos[childId] = (limitHeight - image.top - child.top) / window.rectHeight * child.width / child.scaleX;
                                marked[childId] = true;
                            }

                            let el = document.getElementById(childId + "animation-block");
                            if (el) el.style.left = (-child.width / child.scaleX + curPos[childId]) + "px";
                        }

                        let el2 = document.getElementById(childId + "alo");
                        if (el2 && -child.width / child.scaleX + curPos[childId] > 0) el2.style.opacity = 1;
                    });
                }
            })

            limit -= window.rectWidth / 22;
            if (limit < 0) {
                limit = window.rectWidth;
                limitHeight += window.rectHeight / 7;
            }
        }, 15);

        window.timeoutAnimation = setTimeout(() => {
            ids.forEach(id => {
                let image = editorStore.images2.get(id);
                if (image && image.type == TemplateType.Heading) {
                    let el = document.getElementById(id + "animation-block") as HTMLElement;
                    if (el) el.remove();
                } else if (image && image.type == TemplateType.TextTemplate) {
                    image.document_object.forEach(child => {
                        let childId = id + child._id;
                        let el = document.getElementById(childId + "animation-block");
                        if (el) el.remove();
                    });
                }
            });
            clearTimeout(window.intervalAnimation);
        }, 5000);
    }

    let val = `
            function animate() {
                let scale = 1;
                let ids = ['${ids.join("','")}'];
                let ratios = ${JSON.stringify(ratios)};
                ids.forEach((id, key) => {
                    let image = ratios["id" + id];
                    if (image && image.type == 3) {
                        let el = document.getElementById(id + "_alo2");
                        if (el) el.style.opacity = 0;

                        if (!document.getElementById(id + "animation-block")) {
                            let newNode = document.createElement("div");
                            let newNode2 = document.createElement("div");
                            newNode.appendChild(newNode2);
                            newNode.id = id + "animation-block";
                            newNode.style.position = "absolute";
                            newNode.style.zIndex = image.zIndex;
                            newNode.style.width = image.width * scale + "px";
                            newNode.style.height = image.height * scale + "px";
                            newNode.style.transform = "translate(" + image.left * scale + "px, " + image.top * scale + "px) rotate(" + image.rotateAngle + "deg)";
                            newNode.style.overflow = "hidden";
                            newNode2.style.width = "100%";
                            newNode2.style.height = "100%";
                            newNode2.style.background = image.color ? image.color : "black";
                            newNode2.style.transform = "translate(-" + (image.width * scale + 1) + "px, 0px)";
                            newNode2.style.position = "absolute";
                            if (el) el.parentNode.appendChild(newNode);
                        }
                    } else if (image && image.type == 2) {
                        image.document_object.forEach(child => {
                            let el = document.getElementById(image._id + child._id + "alo2");
                            if (el) {
                                el.style.opacity = "0";
                                let animationNode = document.getElementById(image._id + child._id + "animation-block");
                                let newNode;
                                if (!animationNode) {
                                    newNode = el.cloneNode(true);
                                    animationNode = document.createElement("div");
                                    newNode.style.overflow = "hidden";
                                    newNode.appendChild(animationNode);
                                    for (let i = 0; i < newNode.children.length; ++i) {
                                        newNode.children[i].style.opacity = 0;
                                    }
                                    el.parentNode.appendChild(newNode);
                                } else {
                                    newNode = animationNode.parentNode;
                                }
                                newNode.style.opacity = "1";
                                animationNode.id = image._id + child._id + "animation-block";
                                animationNode.style.background = child.color;
                                animationNode.style.opacity = 1;
                                animationNode.style.top = 0;
                                animationNode.style.width = child.width / child.scaleX + "px";
                                animationNode.style.bottom = 0;
                                animationNode.style.position = "absolute";
                                animationNode.style.left = "-" + (child.width / child.scaleX + 10) + "px";
                            }
                        });
                    }
                });
                
                let curPos = {};
                let limit = window.innerWidth;
                let limitHeight = 0;
                let marked = {};
                setTimeout(() => {
                    let interval = setInterval(() => {
                        ids.forEach(id => {
                            let image= ratios["id" + id];
                            if (image && image.type == 3) {
                                if ((image.left + image.width > limit && image.top <= limitHeight) || marked[id]) {

                                    if (marked[id]) {
                                        if (!curPos[id]) curPos[id] = 0;
                                        if (curPos[id] < image.width / 5 || curPos[id] > image.width * 1.8) 
                                            curPos[id] += image.width / 66;
                                        else 
                                            curPos[id] += image.width / 15;
                                    } else {
                                        curPos[id] = (limitHeight - image.top) / window.innerHeight * image.width;
                                        marked[id] = true;
                                    }

                                    let el = document.getElementById(id + "animation-block");
                                    if (el && el.children && el.children[0])
                                        el.children[0].style.transform = "translate(" + (-image.width + curPos[id]) + "px, 0px)";
                                }

                                let el2 = document.getElementById(id + "_alo2");
                                if (el2 && -image.width + curPos[id] > 0) el2.style.opacity = 1;
                            } else if (image && image.type == 2) {
                                image.document_object.forEach(child => {
                                    let childId = id + child._id;
                                    if ((image.left + child.left + child.width / child.scaleX > limit && image.top + child.top + child.height <= limitHeight) || marked[childId]) {

                                        if (marked[childId]) {
                                            if (!curPos[childId]) curPos[childId] = 0;
                                            if (curPos[childId] < child.width / child.scaleX / 5 || curPos[childId] > child.width / child.scaleX * 1.8) 
                                                curPos[childId] += child.width / child.scaleX / 66 ;
                                            else 
                                                curPos[childId] += child.width / child.scaleX / 15;
                                        } else {
                                            curPos[childId] = (limitHeight - image.top - child.top) / window.rectHeight * child.width / child.scaleX;
                                            marked[childId] = true;
                                        }
            
                                        let el = document.getElementById(childId + "animation-block");
                                        if (el) el.style.left = (-child.width / child.scaleX + curPos[childId]) + "px";
                                    }
            
                                    let el2 = document.getElementById(childId + "alo2");
                                    if (el2 && -child.width / child.scaleX + curPos[childId] > 0) el2.style.opacity = 1;
                                });
                            }
                        })

                        limit -= window.innerWidth / 22;
                        if (limit < 0) {
                            limit = window.innerWidth;
                            limitHeight += window.innerHeight / 7;
                        }
                        
                    }, 15);

                    setTimeout(() => {
                        clearTimeout(interval);
                    }, 5000)
                }, 500);
            }`;

    document.getElementById('animation-script').innerHTML = val;
}

export const handleFadeAnimation = (injectScriptOnly = false) => {
    clearInterval(window.intervalAnimation);
    clearTimeout(window.timeoutAnimation)

    let ids = [];
    let ratios = {};
    let groupedHeading = {};

    // editorStore.images2.forEach(img => {
    //     if (img.type == TemplateType.GroupedItem) {
    //         img.childIds.forEach(id => {
    //             groupedHeading[id] = true;
    //         })
    //     }
    // });

    editorStore.images2.forEach(img => {
        if (img.type == TemplateType.GroupedItem) {
            ids.push(img._id);
            ratios[`id${img._id}`] = {
                left: img.left,
                top: img.top,
                width: img.width,
                height: img.height,
                type: img.type,
            };
        } 
        else if (img.type == TemplateType.Heading && !groupedHeading[img._id]) {
            ids.push(img._id);
            ratios[`id${img._id}`] = {
                left: img.left,
                top: img.top,
                width: img.width,
                height: img.height,
                type: img.type,
            };
        }
        else if (img.type != TemplateType.BackgroundImage && img.type != TemplateType.Heading) {
            ids.push(img._id);
            ratios[`id${img._id}`] = {
                left: img.left,
                top: img.top,
                width: img.width,
                height: img.height,
                type: img.type,
            };
        }
        

        if (img.type == TemplateType.Heading && !groupedHeading[img._id]) {
            let el = document.getElementById(img._id + "animation-block");
            if (el) el.remove();
        }
    });

    window.videoDuration = ids.length * 140 + 1000;
    
    for (let i = 0; i < ids.length; ++i)
        for (let j = 0; j < i; ++j) {
            let imgI = editorStore.images2.get(ids[i]);
            let imgJ = editorStore.images2.get(ids[j]);
            if (imgI.top < imgJ.top || (imgI.top == imgJ.top && imgI.left < imgJ.left)) {
                let tmp = ids[i];
                ids[i] = ids[j];
                ids[j] = tmp;
            }
        }

    if (!injectScriptOnly) {
        ids.forEach((id, key) => {
            if (Array.isArray(id.childIds)) {
                id.childIds.forEach(jd => {
                    let el = document.getElementById(jd + "_alo");
                    if (el) el.style.opacity = 0;
                })
            } else {
                let el = document.getElementById(id + "_alo");
                if (el) el.style.opacity = 0;
            }
        });

        let curI = 0;
        let curOpa = {};
        window.intervalAnimation = setInterval(() => {
            ids.forEach((id, key) => {
                if (Array.isArray(id.childIds)) {
                    id.childIds.forEach(jd => {
                        if (!curOpa[jd]) curOpa[jd] = 0;
                        if (curI / 7 >= key) curOpa[jd] += 0.1;
                        let el = document.getElementById(jd + "_alo");
                        if (el) el.style.opacity = curOpa[jd];
                    })
                } else {
                    if (!curOpa[id]) curOpa[id] = 0;
                    if (curI / 7 >= key) curOpa[id] += 0.1;
                    let el = document.getElementById(id + "_alo");
                    if (el) el.style.opacity = curOpa[id];
                }
            });
            ++curI;
        }, 20);

        window.timeoutAnimation = setTimeout(() => {
            clearTimeout(window.intervalAnimation);
        }, ids.length * 140 + 1000);
    }

    let val = `
            function animate() {
                let ids = ${JSON.stringify(ids)};
                ids.forEach((id, key) => {
                    let el = document.getElementById(id + "_alo2");
                    if (el) el.style.opacity = 0;
                });
                let marked = {};
                setTimeout(() => {
                    let curI = 0;
                    let curOpa = {};
                    let ratios = ${JSON.stringify(ratios)};
                    let interval = setInterval(() => {
                        ids.forEach((id, key) => {
                            if (!curOpa[id]) curOpa[id] = 0;
                            if (curI / 7 >= key) curOpa[id] += 0.1;
                            let el = document.getElementById(id + "_alo2");
                            if (el) el.style.opacity = curOpa[id];
                        });
                        ++curI;
                    }, 20);

                    setTimeout(() => {
                        clearTimeout(interval);
                    }, ids.length * 700)
                }, 300);
            }`;

    document.getElementById('animation-script').innerHTML = val;
}

const showPopupDownloading = () => {
    document.getElementById("downloadPopup").style.display = "block";

    let editorEl = document.getElementById("editor");
    editorEl.classList.add("popup");
    editorEl.style.filter = "blur(4px)";

    window.current_progress = 0;
    let btn = document.getElementById("progress-bar-start-btn-download");
    if (btn) btn.click();
}

const hidePopupDownloading = () => {
    document.getElementById("downloadPopup").style.display = "none";

    let editorEl = document.getElementById("editor");
    editorEl.classList.remove("popup");
    editorEl.style.filter = "";

    window.current_progress = 0;

    clearInterval(window.progress_interval);
    document.getElementById("progress-bar-download").style.width = "0%";
}

const download = async (filename, text) => {
    if (window.cancelDownload) return;
    let blobUrl = URL.createObjectURL(text);
    let element = document.createElement("a");

    element.setAttribute("href", blobUrl);
    element.setAttribute("download", filename);
    element.style.display = "none";

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

export const downloadPDF = (bleed) => {
    window.cancelDownload = false;
    window.step = 0.2;
    showPopupDownloading();
    window.downloading = true;

    let aloCloned = document.getElementsByClassName("alo2");
    let canvas = [];
    for (let i = 0; i < aloCloned.length; ++i) {
        canvas.push((aloCloned[i] as HTMLElement).outerHTML);
    }

    let styles = document.getElementsByTagName("style");
    let a = Array.from(styles).filter(style => {
        return style.attributes.getNamedItem("data-styled") !== null;
    });

    axios
        .post(
            `/api/Design/Download?width=${window.rectWidth +
            (bleed ? 20 : 0)}&height=${window.rectHeight +
            (bleed ? 20 : 0)}`,
            { fonts: toJS(editorStore.fonts), canvas },
            {
                headers: {
                    "Content-Type": "text/html"
                },
                responseType: "blob"
            }
        )
        .then(response => {
            let title = (document.getElementById("designTitle") as HTMLInputElement).value;
            title = title ? title : "Untitled design";

            download(title + ".pdf", response.data);
            hidePopupDownloading();
        })
        .catch(error => {
            hidePopupDownloading();
        });
}

export const downloadPNG = (transparent, png) => {
    window.cancelDownload = false;
    window.step = 0.2;
    showPopupDownloading();

    let self = this;
    window.downloading = true;
    let aloCloned = document.getElementsByClassName("alo2");
    let canvas = [];
    for (let i = 0; i < aloCloned.length; ++i) {
        canvas.push((aloCloned[i] as HTMLElement).outerHTML);
    }

    let styles = document.getElementsByTagName("style");
    let a = Array.from(styles).filter(style => {
        return style.attributes.getNamedItem("data-styled") !== null;
    });

    window.downloading = false;

    axios
        .post(
            `/api/Design/DownloadPNG?width=${window.rectWidth}&height=${window.rectHeight}&transparent=${transparent}&download=true&png=${png}`,
            {
                fonts: toJS(editorStore.fonts),
                canvas,
                additionalStyle: a[0].outerHTML,
                transparent
            },
            {
                headers: {
                    "Content-Type": "text/html"
                },
                responseType: "blob"
            }
        )
        .then(response => {
            download(`test.${png ? "png" : "jpeg"}`, response.data);
            hidePopupDownloading();
        })
        .catch(error => {
            hidePopupDownloading();
        });
}

export const downloadVideo = () => {
    if (editorStore.animationId == 1) handleBlockAnimation(true);
    if (editorStore.animationId == 2) handleFadeAnimation(true);

    window.cancelDownload = false;
    window.step = 0.1;
    showPopupDownloading();

    window.downloading = true;
    let aloCloned = document.getElementsByClassName("alo2");
    let canvas = [];
    for (let i = 0; i < aloCloned.length; ++i) {
        canvas.push((aloCloned[i] as HTMLElement).outerHTML);
    }

    let styles = document.getElementsByTagName("style");
    let a = Array.from(styles).filter(style => {
        return style.attributes.getNamedItem("data-styled") !== null;
    });

    window.downloading = false;

    let duration = 6000;
    if (editorStore.animationId == 2) {
        duration = Math.max(duration, window.videoDuration);
    }

    axios
        .post(
            `/api/Design/DownloadVideo?width=${window.rectWidth}&height=${window.rectHeight
            }&videoId=${uuidv4()}&duration=${duration}`,
            {
                fonts: toJS(editorStore.fonts),
                canvas,
            },
            {
                headers: {
                    "Content-Type": "text/html"
                },
                responseType: "blob"
            }
        )
        .then(response => {
            let title = (document.getElementById("designTitle") as HTMLInputElement).value;
                title = title ? title : "Untitled design";

            download(title + `.mp4`, response.data);
            hidePopupDownloading();
        })
        .catch(error => {
            hidePopupDownloading();
        });
};


export function ungroupGroupedItem() {
        let image = getImageSelected();
        doNoObjectSelected.bind(this)();
        editorStore.images2.delete(image._id);

        image.document_object.forEach(img => {
            if (img.type != TemplateType.BackgroundImage) {
                img._id = uuidv4();
                img.top = image.top + img.top * image.scaleX;
                img.left = image.left + img.left * image.scaleY;
                img.width = img.width * image.scaleX;
                img.height = img.height * image.scaleY;
                img.imgWidth = img.imgWidth * image.scaleX;
                img.imgHeight = img.imgHeight * image.scaleY;
                img.scaleX = img.scaleX * image.scaleX;
                img.scaleY = img.scaleY * image.scaleY;
                img.posX = img.posX * image.scaleX;
                img.posY = img.posY * image.scaleY;
                img.selected = false;
                img.hovered = false;
                img.page = image.page;
                editorStore.images2.set(img._id, img);
            }
        })

        let index2 = editorStore.pages.findIndex(pageId => pageId == editorStore.activePageId);
        editorStore.keys[index2] = editorStore.keys[index2] + 1;
        window.editor.forceUpdate();
    }

export function getImageSelected() {
    return toJS(editorStore.images2.get(editorStore.idObjectSelected));
}

export function groupGroupedItem() {
    if (window.selections) {
        window.selections.forEach(node => {
            let id = node.attributes.iden.value;
            if (!id) return;
            window.selectionIDs[id] = true;

            node.style.opacity = 0;
        });
    }

    let image = getImageSelected();
    image.temporary = false;
    editorStore.images2.set(image._id, image);
    updateImages2(image, false);

    let onlyText = true;

    let childImages = [];
    if (image.childIds) {
        image.childIds.forEach(id => {
            let childImage = editorStore.images2.get(id);
            let newChildImage = clone(toJS(childImage));
            if (newChildImage.type != TemplateType.TextTemplate) {
                newChildImage._id = uuidv4();
                newChildImage.width2 = childImage.width / image.width;
                newChildImage.height2 = childImage.height / image.height;
                newChildImage.top = childImage.top - image.top;
                newChildImage.left = childImage.left - image.left;
                newChildImage.scaleX = childImage.scaleX ? childImage.scaleX : 1;
                newChildImage.scaleY = childImage.scaleY ? childImage.scaleY : 1;
                newChildImage.selected = false;
                newChildImage.hovered = false;
                newChildImage.ref = null;
                newChildImage.rotateAngle = childImage.rotateAngle - image.rotateAngle;
                newChildImage.childId = null;
            
                childImages.push(clone(toJS(newChildImage)));
            } else {
                if (newChildImage.document_object) {
                    newChildImage.document_object.forEach(child => {
                        child._id = uuidv4();
                        child.width2 = child.width * newChildImage.scaleX / image.width;
                        child.height2 = child.height * newChildImage.scaleY / image.height;
                        child.top = child.top * newChildImage.scaleX + newChildImage.top - image.top;
                        child.left = child.left * newChildImage.scaleY + newChildImage.left - image.left;
                        child.width = child.width * newChildImage.scaleX;
                        child.height = child.height * newChildImage.scaleY;
                        child.imgWidth = child.imgWidth * newChildImage.scaleX;
                        child.imgHeight = child.imgHeight * newChildImage.scaleY;
                        child.posX = child.posX * newChildImage.scaleX;
                        child.posY = child.posY * newChildImage.scaleY;
                        child.scaleX = child.scaleX * newChildImage.scaleX;
                        child.scaleY = child.scaleY * newChildImage.scaleY;
                        childImages.push(child);
                    });
                }
            }

            if (newChildImage.type != TemplateType.Heading) onlyText = false;
        });
    }

    let newImage = {
        _id: uuidv4(),
        page: editorStore.activePageId,
        type: TemplateType.TextTemplate,
        width: image.width,
        origin_width: image.width,
        origin_height: image.height,
        height: image.height,
        top: image.top,
        left: image.left,
        scaleX: 1,
        scaleY: 1,
        rotateAngle: image.rotateAngle,
        document_object: childImages,
        existImage: !onlyText,
        zIndex: editorStore.upperZIndex + 1,
    }


    let index2 = editorStore.pages.findIndex(pageId => pageId == editorStore.activePageId);
    editorStore.keys[index2] = editorStore.keys[index2] + 1;
    editorStore.addItem2(newImage, false);
    editorStore.increaseUpperzIndex();

    this.handleImageSelected(newImage._id, newImage.page, false, true, false);


    editorStore.images2.delete(image._id);
    if (image.childIds) {
        image.childIds.forEach(id => {
            editorStore.images2.delete(id);
        });
    }

    window.editor.forceUpdate();
}

export function handleItalicBtnClick(e: any) {
    e.preventDefault();
    let image = getImageSelected();
    if (editorStore.childId) {
        let texts = image.document_object.map(text => {
            if (text._id == editorStore.childId) {
                text.italic = !text.italic;
            }
            return text;
        });
        image.document_object = texts;
    } else {
        image.italic = !image.italic;
    }

    updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);

    editorStore.images2.set(editorStore.idObjectSelected, image);
}

export function handleBoldBtnClick(e: any) {
    e.preventDefault();

    let bold;
    let image = getImageSelected();
    if (editorStore.childId) {
        let texts = image.document_object.map(text => {
            if (text._id == editorStore.childId) {
                text.bold = !text.bold;
                bold = text.bold;
            }
            return text;
        });
        image.document_object = texts;
    } else {
        image.bold = !image.bold;
        bold = image.bold;
    }

    updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
    editorStore.images2.set(editorStore.idObjectSelected, image);
}

export function handleCropBtnClick(id: string) {
    let image = editorStore.getImageSelected();
    if (image.type == TemplateType.BackgroundImage && !image.src) {
        return;
    }
    if (image.type == TemplateType.Grids && editorStore.gridIndex != null) {
        handleGridCrop.bind(this)(editorStore.gridIndex);
    }
    if (image.type == TemplateType.GroupedItem || 
        image.type == TemplateType.Heading || 
        image.type == TemplateType.Grids ||
        image.type == TemplateType.Shape) {
        return;
    }

    if (image.type == TemplateType.TextTemplate) {
        handleChildCrop.bind(this)(editorStore.childId);
        return;
    }

    window.tempImage = image;

    if (image.type == TemplateType.Video) {
        let el = document.getElementById(editorStore.idObjectSelected + "video0" + "alo") as HTMLVideoElement;
        let el3 = document.getElementById(editorStore.idObjectSelected + "video3" + "alo") as HTMLCanvasElement;
        let el4 = document.getElementById(editorStore.idObjectSelected + "video4" + "alo1") as HTMLCanvasElement;
        let ctx = el3.getContext('2d')
        // let ctx2 = el4.getContext('2d');
        var w = el.videoWidth * 1;
        var h = el.videoHeight * 1;
        el3.width = w;
        el3.height = h;
        // el4.width = w;
        // el4.height = h;
        if (el && el3) {
            el.pause();
            ctx.imageSmoothingEnabled = false;
            // ctx2.imageSmoothingEnabled = false;
            ctx.drawImage(el, 0, 0, w, h);
            // ctx2.drawImage(el, 0, 0, w, h);
        }

        if (!image.paused) this.canvas1[image.page].canvas[CanvasType.HoverLayer][image._id].child.toggleVideo();

        image.paused = true;
        editorStore.images2.set(image._id, image);
    }

    enableCropMode(editorStore.idObjectSelected, editorStore.pageId);
}

function enableCropMode(id, page) {
    window.editor.setState({ cropMode: true });
    editorStore.cropMode = true;

    window.editor.canvas1[page].canvas[CanvasType.All][id].child.enableCropMode();
    window.editor.canvas1[page].canvas[CanvasType.HoverLayer][id].child.enableCropMode();
};


export function handleGridCrop(index) {
    let image = getImageSelected();
    const scale = this.state.scale;
    let g = image.grids[index];
    if (!g.src) return;

    let boxWidth = (image.width - g.gapWidth) * g.width / 100;
    let boxHeight = (image.height - g.gapHeight) * g.height / 100;


    let offsetLeft = (image.width * scale - g.gapLeft * scale) * g.left / 100 + g.gapLeft * scale;
    let offsetTop = (image.height * scale - g.gapTop * scale) * g.top / 100 + g.gapTop * scale;
    let left = image.left + offsetLeft / scale;
    let top = image.top + offsetTop / scale;

    let newL = left;
    let newR = left + boxWidth;
    let newT = top;
    let newB = top + boxHeight;
    let centerX = image.left + image.width / 2;
    let centerY = image.top + image.height / 2;
    let rotateAngle = image.rotateAngle / 180 * Math.PI;
    let topLeft = transformPoint(newL, newT, rotateAngle, centerX, centerY);
    let bottomRight = transformPoint(newR, newB, rotateAngle, centerX, centerY);
    let centerX1 = (topLeft.x + bottomRight.x) / 2;
    let centerY1 = (topLeft.y + bottomRight.y) / 2;
    let left1 = centerX1 - boxWidth / 2;
    let top1 = centerY1 - boxHeight / 2;

    let newImg = {
        _id: uuidv4(),
        type: TemplateType.BackgroundImage,
        width: boxWidth,
        height: boxHeight,
        origin_width: boxWidth,
        origin_height: boxHeight,
        left: left1,
        top: top1,
        rotateAngle: image.rotateAngle,
        src: g.src,
        selected: true,
        scaleX: 1,
        scaleY: 1,
        posX: g.posX ? g.posX : 0,
        posY: g.posY ? g.posY : 0,
        imgWidth: g.imgWidth,
        imgHeight: g.imgHeight,
        page: image.page,
        zIndex: editorStore.upperZIndex + 1,
        deleteAfterCrop: true,
        parentImageId: image._id,
        gridIndex: index,
    };


    editorStore.addItem2(newImg, false);
    editorStore.increaseUpperzIndex();

    this.handleImageSelected(newImg._id, newImg.page, false, true, false);
    editorStore.cropMode = true;
}

export function handleTransparentAdjust(e: any) {
    window.pauser.next(true);
    (document.activeElement as HTMLElement).blur();
    e.preventDefault();
    let self = this;
    const onMove = e => {
        e.preventDefault();
        let rec1 = document
            .getElementById("myOpacity-3")
            .getBoundingClientRect();
        let rec2 = document.getElementById(
            "myOpacity-3slider"
        );
        let slide = e.pageX - rec1.left;
        let scale = (slide / rec1.width) * 100;
        scale = Math.max(1, scale);
        scale = Math.min(100, scale);

        this.setState({ currentOpacity: scale });

        this.handleOpacityChange.bind(this)(scale);
    };

    const onUp = e => {
        e.stopImmediatePropagation();
        e.preventDefault();
        document.removeEventListener(
            "mousemove",
            onMove
        );
        document.removeEventListener("mouseup", onUp);
        window.pauser.next(false);
        this.handleOpacityChangeEnd();
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
}

export function handleFontSizeBtnClick(e: any, fontSize: number) {

    let image = getImageSelected();

    if (editorStore.childId) {
        let text = image.document_object.find(text => text._id == editorStore.childId);
        fontSize = fontSize / image.scaleY / text.scaleY;
    }

    let fonts;

    if (editorStore.childId) {
        fonts = document
            .getElementById(editorStore.idObjectSelected + editorStore.childId + "alo")
            .getElementsByClassName("font");
    } else {
        fonts = document
            .getElementById(editorStore.idObjectSelected + "hihi4alo")
            .getElementsByClassName("font");
    }


    let width2 = 0, height2 = 0;

    let fontSizePx = fontSize + "px";
    let fontSizePt = fontSize + "pt";

    for (let i = 0; i < fonts.length; ++i) {
        let font = fonts[i];
        (font as HTMLElement).style.fontSize = fontSizePx;

        let lines = font.offsetHeight / (image.lineHeight * image.fontSize);


        width2 = Math.max(width2, this.getTextWidth(font.innerHTML, fontSizePt + " " + image.fontFace));
        height2 += fontSize * image.lineHeight * lines;
    }

    if (!editorStore.childId) {
        image.scaleX = 1;
        image.scaleY = 1;
        // image.width = width2;
        image.origin_width = image.width;
        image.height = height2;
        image.origin_height = height2;
        image.fontSize = fontSize;
        let hihi4 = document.getElementById(image._id + "hihi4alo");
        if (hihi4) {
            image.innerHTML = hihi4.innerHTML;
        }
    } else {
        let el = document.getElementById(editorStore.idObjectSelected + editorStore.childId + "alo");
        if (el) {
            let texts = image.document_object.map(text => {
                if (text._id == editorStore.childId) {
                    text.innerHTML = el.innerHTML;

                    text.fontSize = fontSize;

                    fontSize = fontSize * image.scaleY * text.scaleY;
                }
                return text;
            });
            image.document_object = texts;
        }
    }

    editorStore.images2.set(editorStore.idObjectSelected, image);
    updateImages2(image, true);

    editorStore.currentFontSize = fontSize;

    (document.getElementById("fontSizeButton") as HTMLInputElement).value = fontSize.toString();
    if (editorStore.childId) {
        this.onTextChange(image, e, editorStore.childId);
    }
}

export function handleChildCrop(id) {
    let image = getImageSelected();
    let childImage = image.document_object.find(doc => doc._id == id);
    if (childImage.type == TemplateType.Heading) return;
    
    doNoObjectSelected.bind(this)();
    editorStore.images2.delete(image._id);

    let newId;
    let groupedIds = [];
    image.document_object.forEach(img => {
        let newImageId = uuidv4();
        groupedIds.push(newImageId);
        if (img._id == id) newId = newImageId;
        img._id = newImageId;
        img.top = image.top + img.top * image.scaleX;
        img.left = image.left + img.left * image.scaleY;
        img.width = img.width * image.scaleX;
        img.height = img.height * image.scaleY;
        img.imgWidth = img.imgWidth * image.scaleX;
        img.imgHeight = img.imgHeight * image.scaleY;
        img.scaleX = img.scaleX * image.scaleX;
        img.scaleY = img.scaleY * image.scaleY;
        img.posX = img.posX * image.scaleX;
        img.posY = img.posY * image.scaleY;
        img.selected = false;
        img.hovered = false;
        editorStore.images2.set(img._id, img);
    });

    let newImage = editorStore.images2.get(newId);
    newImage.groupedIds = groupedIds;
    this.handleImageSelected(newImage._id, newImage.page, false, true, false);
    this.setState({ cropMode: true });
    editorStore.cropMode = true;

    let index2 = editorStore.pages.findIndex(pageId => pageId == editorStore.activePageId);
    editorStore.keys[index2] = editorStore.keys[index2] + 1;
    window.editor.forceUpdate();
}

export function onTextChange(thisImage, e, childId) {
    thisImage = toJS(thisImage);
    let target;
    if (childId) {
        target = document.getElementById(editorStore.idObjectSelected + childId + "alo");
    } else {
        target = e.target;
    }
    if (e) {
        e.persist();
    }
    setTimeout(() => {
        if (!childId) {
            let image = editorStore.getImageSelected();
            let centerX = image.left + image.width / 2;
            let centerY = image.top + image.height / 2;
            image.width = target.offsetWidth * image.scaleX;

            let oldHeight = image.height;
            let a;
            if (thisImage.type === TemplateType.Heading) {
                a = document.getElementsByClassName(thisImage._id + "hihi4alo")[0] as HTMLElement;
            } else if (thisImage.type === TemplateType.Latex) {
                a = document.getElementById(thisImage._id)
                    .getElementsByClassName("text2")[0] as HTMLElement;
            }
            let newHeight = a.offsetHeight * image.scaleY;
            image.height = newHeight;
            let tmp = newHeight / 2 - oldHeight / 2;
            let deltacX = tmp * Math.sin(((360 - image.rotateAngle) / 180) * Math.PI);
            let deltacY = tmp * Math.cos(((360 - image.rotateAngle) / 180) * Math.PI);
            let newCenterX = centerX + deltacX;
            let newCenterY = centerY + deltacY;

            image.left = newCenterX - image.width / 2;
            image.top = newCenterY - image.height / 2;

            if (image.scaleY === 0) {
                image.origin_height = 0;
            } else {
                image.origin_height = image.height / image.scaleY;
            }

            image.innerHTML = target.innerHTML;
            editorStore.images2.set(editorStore.idObjectSelected, image);
            updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
            this.canvas2[editorStore.pageId].canvas[CanvasType.Download][editorStore.idObjectSelected].child.updateInnerHTML(image.innerHTML);
        } else {
            let image = editorStore.getImageSelected();
            let centerX = image.left + image.width / 2;
            let centerY = image.top + image.height / 2;
            let texts = image.document_object.map(text => {
                if (text._id === childId) {
                    text.innerHTML = target.innerHTML;
                    text.height = document.getElementById(editorStore.idObjectSelected + text._id + "alo").offsetHeight * text.scaleY;
                }
                return text;
            });

            let maxHeight = 0;
            texts.filter(text => text.type == TemplateType.Heading).forEach(text => {
                const h = document.getElementById(editorStore.idObjectSelected + text._id + "alo").offsetHeight * text.scaleY;
                maxHeight = Math.max(maxHeight, h + text.top);
            });

            texts = texts.map(text => {
                text.height2 = text.height / maxHeight;
                return text;
            });

            let newDocumentObjects = [];
            for (let i = 0; i < texts.length; ++i) {
                let d = texts[i];
                if (!d.ref) {
                    let imgs = this.normalize2(
                        d,
                        texts,
                        image.scaleX,
                        image.scaleY,
                        this.state.scale,
                        image.width,
                        image.height
                    );
                    newDocumentObjects.push(...imgs);
                }
            }

            maxHeight = 0;
            newDocumentObjects.forEach(text => {
                maxHeight = Math.max(maxHeight, text.height + text.top);
            });

            newDocumentObjects = newDocumentObjects.map(text => {
                text.height2 = text.height / maxHeight;
                return text;
            });
            image.document_object = newDocumentObjects;
            let oldHeight = image.height;
            image.height = maxHeight * image.scaleY;
            image.origin_height = image.height / image.scaleY;

            let tmp = image.height / 2 - oldHeight / 2;
            let deltacX = tmp * Math.sin(((360 - image.rotateAngle) / 180) * Math.PI);
            let deltacY = tmp * Math.cos(((360 - image.rotateAngle) / 180) * Math.PI);
            let newCenterX = centerX + deltacX;
            let newCenterY = centerY + deltacY;

            image.left = newCenterX - image.width / 2;
            image.top = newCenterY - image.height / 2;

            editorStore.images2.set(editorStore.idObjectSelected, image);
            updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
            this.canvas2[editorStore.pageId].canvas[CanvasType.Download][editorStore.idObjectSelected].child.childrens[childId].updateInnerHTML(target.innerHTML);
        }
    }, 0);
}

export function handleAlignBtnClick(e: any, type: string) {
    e.preventDefault();
    let command;
    let align;
    switch (type) {
        case "alignLeft":
            command = "JustifyLeft";
            align = "left";
            break;
        case "alignCenter":
            command = "JustifyCenter";
            align = "center";
            break;
        case "alignRight":
            command = "JustifyRight";
            align = "right";
            break;
        default:
            return;
    }

    let image = getImageSelected();
    if (!editorStore.childId) {
        image.align = align;
    } else {
        image.document_object = image.document_object.map(doc => {
            if (doc._id == editorStore.childId) {
                doc.align = align;
            }
            return doc;
        });
    }
    editorStore.images2.set(editorStore.idObjectSelected, image);

    updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
    this.setState({ align: type });
}

export function selectFont(id, e) {
    let fontsList = toJS(editorStore.fontsList);
    let font = fontsList.find(font => font.id === id);
    let el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
    if (el) {
        el.style.fontFamily = id;
    }

    el = document.getElementById(editorStore.childId + "text-container2alo");
    if (el) {
        el.style.fontFamily = id;
    }

    let image = editorStore.getImageSelected();
    if (editorStore.childId) {
        let newTexts = image.document_object.map(d => {
            if (d._id == editorStore.childId) {
                d.fontId = id;
                d.fontFace = id;
                d.fontRepresentative = font.representative;
            }
            return d;
        });
        image.document_object = newTexts;
    }
    image.fontId = id;
    image.fontFace = id;
    image.fontRepresentative = font.representative;

    editorStore.images2.set(editorStore.idObjectSelected, image);
    updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);

    this.setState({
        fontName: font.representative,
        fontId: font.id,
    });

    editorStore.fontId = font.id;

    e.preventDefault();
    let style = `@font-face {
  font-family: '${id}';
  src: url('/fonts/${id}.ttf');
}`;
    let styleEle = document.createElement("style");
    let type = document.createAttribute("type");
    type.value = "text/css";
    styleEle.attributes.setNamedItem(type);
    styleEle.innerHTML = style;
    let head = document.head || document.getElementsByTagName("head")[0];
    head.appendChild(styleEle);

    let link = document.createElement("link");
    link.id = id;
    link.rel = "preload";
    link.href = `/fonts/${id}.ttf`;
    link.media = "all";
    link.as = "font";
    link.crossOrigin = "anonymous";
    head.appendChild(link);

    editorStore.addFont(id);
};

export function  isWindow(obj){
    return obj != null && obj === obj.window;
};

export function getWindow(elem) {
    return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
};

export function offset(elem) {
    let docElem,
            win,
            box = { top: 0, left: 0 },
            doc = elem && elem.ownerDocument;

        docElem = doc.documentElement;

        if (typeof elem.getBoundingClientRect !== typeof undefined) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow(doc);
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
        };
}

export function elementIsVisible(element, container, partial) {
    let contHeight = container.offsetHeight,
        elemTop = offset(element).top - offset(container).top,
        elemBottom = elemTop + element.offsetHeight;
    return (
        (elemTop >= 0 && elemBottom <= contHeight) ||
        (partial &&
            ((elemTop < 0 && elemBottom > 0) ||
                (elemTop > 0 && elemTop <= contHeight)))
    );
};


export function handleScroll() {
    const screensRect = getBoundingClientRect("screens");
    const canvasRect = getBoundingClientRect("canvas");
    if (screensRect && canvasRect) {
        let pages = toJS(editorStore.pages);
        let activePageId = pages[0];
        if (pages.length > 1) {
            let container = document.getElementById("screen-container-parent");
            for (let i = 0; i < pages.length; ++i) {
                let pageId = pages[i];
                let canvas = document.getElementById(pageId);
                if (canvas) {
                    if (elementIsVisible(canvas, container, false)) {
                        activePageId = pageId;
                    }
                }
            }
        }
        editorStore.activePageId = activePageId;
    }
};

export function handleWheel(e) {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        const nextScale = parseFloat(
            Math.max(0.1, this.state.scale - e.deltaY / 500).toFixed(2)
        );
        this.setState({ scale: nextScale });
        editorStore.scale = nextScale;
    }
};

export function doNoObjectSelected() {
    if (editorStore.cropMode) {
        this.disableCropMode();
    }

    if (editorStore.idObjectSelected) {
        try { 
            this.canvas1[editorStore.pageId].canvas[CanvasType.All][editorStore.idObjectSelected].child.handleImageUnselected();
            this.canvas1[editorStore.pageId].canvas[CanvasType.HoverLayer][editorStore.idObjectSelected].child.handleImageUnselected();
        } catch (e) {
            console.log('Failed doNoObjectSelected', e)
        }

        let image = editorStore.getImageSelected();
        if (image && image.type == TemplateType.GroupedItem && image.temporary) {
            editorStore.images2.delete(editorStore.idObjectSelected);
            let index = editorStore.pages.findIndex(pageId => pageId == image.page);
            editorStore.keys[index] = editorStore.keys[index] + 1;

            if (window.selections) {
                window.selections.forEach(el => {
                    el.style.opacity = 0;
                });
            }

            window.editor.forceUpdate();
        }
        editorStore.idObjectSelected = null;
        editorStore.childId = null;
    }

    if (editorStore.selectedTab === SidebarTab.Font || editorStore.selectedTab === SidebarTab.Color || editorStore.selectedTab === SidebarTab.Effect) {
        editorStore.selectedTab = SidebarTab.Image;
    }
};

export function copyImage() {
    let image = getImageSelected();

    let newImage = {...image};
    newImage._id = uuidv4();
    newImage.selected = false;
    newImage.hovered = false;
    newImage.left += 15;
    newImage.top += 15;

    if (newImage.type == TemplateType.TextTemplate) {
        newImage.document_object = newImage.document_object.map(doc => {
            doc._id = uuidv4();
            return doc;
        })
    }

    editorStore.addItem2(newImage, false);

    let index2 = editorStore.pages.findIndex(pageId => pageId == newImage.page);
    editorStore.keys[index2] = editorStore.keys[index2] + 1;
    editorStore.increaseUpperzIndex();

    handleImageSelected(newImage._id, newImage.page, false, true, false);
    window.editor.forceUpdate();
}

function getPlatformName() {
    let OSName = "Unknown";
    if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1)
        OSName = "Windows";
    if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1)
        OSName = "Windows";
    if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1)
        OSName = "Windows";
    if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1)
        OSName = "Windows";
    if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1)
        OSName = "Windows";
    if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1)
        OSName = "Windows";
    if (window.navigator.userAgent.indexOf("Mac") != -1) OSName = "Mac/iOS";
    if (window.navigator.userAgent.indexOf("X11") != -1) OSName = "UNIX";
    if (window.navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux";

    return OSName;
};

export function removeImage(e) {

    if (e.keyCode == 67 && (e.ctrlKey || e.metaKey)) {
        copyImage();
    }

    let image = getImageSelected();
    let OSNAME = getPlatformName();
    if (
        !window.inputFocus &&
        editorStore.idObjectSelected &&
        !e.target.classList.contains("text") &&
        ((e.keyCode === 8 && OSNAME == "Mac/iOS") ||
            (e.keyCode === 8 && OSNAME == "Windows"))
    ) {
        let image = editorStore.getImageSelected();
        if (image.type == TemplateType.BackgroundImage) {
            let image = getImageSelected();
            image.src = null;
            image.backgroundColor = "";
            image.color = "";
            editorStore.images2.set(image._id, image);
            updateImages2(image, true);
        } else {
            this.removeImage2();
        }
    }

    if (image && image.type == TemplateType.GroupedItem && window.selections &&
        ((e.keyCode === 8 && OSNAME == "Mac/iOS") ||
            (e.keyCode === 8 && OSNAME == "Windows"))) {
        window.selections.forEach(sel => {
            let id = sel.attributes.iden.value;
            if (id) editorStore.images2.delete(id);
        });

        let index = editorStore.pages.findIndex(pageId => pageId == editorStore.activePageId);
        editorStore.keys[index] = editorStore.keys[index] + 1;

        window.editor.forceUpdate();
    }
}

export async function saveImages(rep, isVideo, isAdmin = false) {

    if (editorStore.isAdmin && !isAdmin) return;

    isVideo = (document.getElementById('vehicle1') as HTMLInputElement).checked;

    setSavingState(SavingState.SavingChanges, false);
    const { mode } = this.state;
    let self = this;
    const { rectWidth, rectHeight } = this.state;

    let images = toJS(Array.from(editorStore.images2.values()));
    let clonedArray = JSON.parse(JSON.stringify(images))
    let tempImages = clonedArray.map(image => {
        image.width2 = image.width / rectWidth;
        image.height2 = image.height / rectHeight;
        image.selected = false;
        image.hovered = false;
        return image;
    });

    tempImages = tempImages.map(img => {
        if (img.src) img.src = img.src.replace("http://167.99.73.132:64099", "https://draft.vn");
        if (img.srcThumnail) img.srcThumnail = img.srcThumnail.replace("http://167.99.73.132:64099", "https://draft.vn");
        return img;
    })

    if (mode === Mode.CreateTextTemplate || mode === Mode.EditTextTemplate) {
        let newImages = [];
        for (let i = 0; i < clonedArray.length; ++i) {
            let image = clonedArray[i];
            if (!image.ref) {
                newImages.push(...this.normalize(image, clonedArray));
            }
        }
        tempImages = newImages;
    }

    let url;
    let _id = self.state._id;

    if (mode == Mode.CreateDesign) {
        if (self.props.match.path == "/editor/design/:design_id/:template_id") {
            url = "/api/Design/AddOrUpdate";
        } else {
            if (!self.state.designId) {
                url = "/api/Design/Add";
                self.setState({ designId: uuidv4() });
            } else {
                url = "/api/Design/Update";
            }
        }
    } else if (
        mode == Mode.CreateTemplate ||
        mode == Mode.CreateTextTemplate
    ) {
        url = "/api/Template/Add";
    } else if (mode == Mode.EditTemplate || mode == Mode.EditTextTemplate) {
        url = "/api/Template/Update";
    } else if (mode == Mode.EditDesign) {
        url = "/api/Design/Update";
    }

    let type;
    if (mode == Mode.CreateTextTemplate || mode == Mode.EditTextTemplate) {
        type = TemplateType.TextTemplate;
    } else if (mode == Mode.CreateTemplate || mode == Mode.EditTemplate) {
        type = TemplateType.Template;
    }

    window.downloading = true;

    let aloCloned = document.getElementsByClassName("alo2");
    let canvas2 = [];
    for (let i = 0; i < aloCloned.length; ++i) {
        canvas2.push((aloCloned[i] as HTMLElement).outerHTML);
    }

    let styles = document.getElementsByTagName("style");
    let a = Array.from(styles).filter(style => {
        return style.attributes.getNamedItem("data-styled") !== null;
    });

    _id = self.state._id ? self.state._id : uuidv4();


    if (mode == Mode.CreateDesign) {
        _id = self.state.designId;
    }

    let elTitle = (document.getElementById("designTitle") as HTMLInputElement);
    const title = elTitle ? elTitle.value : "";
    let popEL = (document.getElementById("popularity") as HTMLInputElement);
    const pop = popEL ? popEL.value : 0;

    let res = JSON.stringify({
        Title: title,
        CreatedAt: "2014-09-27T18:30:49-0300",
        CreatedBy: 2,
        UpdatedAt: "2014-09-27T18:30:49-0300",
        UpdatedBy: 3,
        Type: type,
        Document: JSON.stringify({
            _id,
            width: self.state.rectWidth,
            origin_width: self.state.rectWidth,
            height: self.state.rectHeight,
            origin_height: self.state.rectHeight,
            left: 0,
            top: 0,
            type: type,
            scaleX: 1,
            scaleY: 1,
            document_object: tempImages
        }),
        FontList: toJS(editorStore.fonts),
        Width: self.state.rectWidth,
        Height: self.state.rectHeight,
        Id: _id,
        Keywords: [],
        Canvas: [],
        Canvas2: canvas2,
        AdditionalStyle: a[0].outerHTML,
        FilePath: "/templates",
        FirstName: "Untilted",
        Pages: toJS(editorStore.pages),
        PrintType: editorStore.subtype,
        Representative: `images/${uuidv4()}.png`,
        Representative2: `images/${_id}_2.jpeg`,
        VideoRepresentative: `videos/${_id}.mp4`,
        IsVideo: isVideo,
        UserName: Globals.serviceUser ? Globals.serviceUser.username : "admin@draft.vn",
        Popular: editorStore.isPopular,
        Popularity: pop,
        AnimationId: editorStore.animationId,
    });

    axios
        .post(url, res, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            self.setSavingState(SavingState.ChangesSaved, false);
        })
        .catch(error => {
        });
}

export function popuplateImageProperties (id) {
    let image = toJS(editorStore.images2.get(id));
    window.image = clone(image);
    window.imageTop = image.top;
    window.imageLeft = image.left;
    window.imageWidth = image.width;
    window.imageHeight = image.height;
    window.imageimgWidth = image.imgWidth;
    window.imageimgHeight = image.imgHeight;
    window.posX = image.posX;
    window.posY = image.posY;
    window.scaleX = image.scaleX;
    window.scaleY = image.scaleY;
    window.origin_width = image.origin_width;
    window.origin_height = image.origin_height;
    window.document_object = image.document_object;
}

export function cancelSaving() {
    if (window.saving) {
        clearTimeout(window.saving);
        window.saving = null;
    }
}

function drag(element: HTMLElement, pan$: Observable<Event>): Observable<any> {
    const panMove$ = pan$.pipe(filter((e: Event) => e.type == "mousemove"));
    const panEnd$ = pan$.pipe(filter((e: Event) => e.type == "mouseup"));

    return panMove$.pipe(
        map((e: any) => {
            e.preventDefault();
            // e.stopPropagation();
            let x = e.clientX;
            let y = e.clientY;
            let eventName = e.type;
            return { x, y, eventName };
        }),
        takeUntil(panEnd$),
    );
};

export function handleDragRx(element: HTMLElement): Observable<any> {
    const mouseMove$ = fromEvent(document, "mousemove");
    const mouseUp$ = fromEvent(document, "mouseup");

    const pan$: Observable<Event> = merge(mouseMove$, mouseUp$);

    const drag$ = drag(element, pan$);

    return drag$.pipe(map(({ x, y, eventName }) => [x, y, eventName]));
};

export function displayResizers(show: Boolean) {
    let opacity = show ? 1 : 0;
    let el = document.getElementById(editorStore.idObjectSelected + "__alo");
    if (el) {
        let resizers = el.getElementsByClassName("resizable-handler-container");
        for (let i = 0; i < resizers.length; ++i) {
            let cur: any = resizers[i];
            cur.style.opacity = opacity;
        }

        let rotators = el.getElementsByClassName("rotate-container");
        for (let i = 0; i < rotators.length; ++i) {
            let cur: any = rotators[i];
            cur.style.opacity = opacity;
        }

        let hideWhenResize = el.getElementsByClassName("hide-when-resize");
        for (let i = 0; i < hideWhenResize.length; ++i) {
            let cur: any = hideWhenResize[i];
            cur.style.opacity = opacity;
        }
    }
};

export function setSavingState(state, callSave) {
    let term;
    if (this && this.translate) {
        if (state == SavingState.UnsavedChanges) {
            term = this.translate("unsavedChanges");
        } else if (state == SavingState.SavingChanges) {
            term = this.translate("savingChanges");
        } else if (state == SavingState.ChangesSaved) {
            term = this.translate("allChangesSaved");
        }
    }

    let el = document.getElementById("savingState") as HTMLSpanElement;
    if (el) el.innerHTML = term;

    if (callSave) {
        cancelSaving();
        window.saving = setTimeout(() => {
            saveImages.bind(this)(null, false);
        }, 5000);
    }
}

export function handleResizeStart(e: any, d: any) {
    let scale = editorStore.scale;
    cancelSaving.bind(this)();

    popuplateImageProperties(editorStore.idObjectSelected);

    e.stopPropagation();

    window.resized = false;

    window.startX = e.clientX;
    window.startY = e.clientY;
    window.resizingInnerImage = false;

    window.pauser.next(true);

    let cursor = e.target.id;
    let type = e.target.getAttribute("class").split(" ")[0];
    const location$ = handleDragRx(e.target);
    let { top: top2, left: left2, width: width2, height: height2 } = window.image;

    const rect2 = tLToCenter({
        top: top2,
        left: left2,
        width: width2,
        height: height2,
        rotateAngle: 0,
    });
    const rect = {
        width: rect2.size.width,
        height: rect2.size.height,
        centerX: rect2.position.centerX,
        centerY: rect2.position.centerY,
        rotateAngle: rect2.transform.rotateAngle
    };

    window.rect = rect;
    window.selectionsAngle = {};

    let cursorStyle = getCursorStyleForResizer(window.image.rotateAngle, d);
    let ell = document.getElementById("screen-container-parent2");
    ell.style.zIndex = "2";
    ell.style.cursor = cursorStyle;

    let images = [];
    Array.from(editorStore.images2.values()).forEach((image: any) => {
        if (image.page === window.image.page && image._id != editorStore.idObjectSelected) {
            if (window.image.type != TemplateType.GroupedItem) {
                let clonedImage = transformImage(clone(image));
                images.push(clonedImage);
            } else if (!window.selectionIDs[image._id]) {
                let clonedImage = transformImage(clone(image));
                images.push(clonedImage);
            }
        }
    });

    window.cloneImages = images;

    let image = editorStore.getImageSelected();
    let ratio = null;
    if (type == "t" &&
        image.type != TemplateType.Image &&
        image.type != TemplateType.Video
    ) {
        ratio = image.width / image.height;
    }
    if (type == "b" &&
        image.type != TemplateType.Image &&
        image.type != TemplateType.Video
    ) {
        ratio = image.width / image.height;
    }

    if ((image.type == TemplateType.Image || image.type == TemplateType.Video || image.type == TemplateType.GroupedItem || image.type == TemplateType.Element || image.type == TemplateType.Gradient) &&
        (type == "tl" || type == "tr" || type == "bl" || type == "br")) {
        ratio = image.width / image.height;
    } else if ((image.type == TemplateType.Heading || image.type == TemplateType.TextTemplate) &&
        (type == "tl" || type == "tr" || type == "bl" || type == "br" || type == "t" || type == "b")) {
        ratio = image.width / image.height;
    }

    location$
        .pipe(
            first(),
            catchError(_ => 'no more rotation!!!')
        ).subscribe(v => {
            window.resized = true;
            displayResizers.bind(this)(false);
            setSavingState.bind(this)(SavingState.UnsavedChanges, false);
        });

    window.temp = location$
        .pipe(
            map(([x, y, eventName]) => ({
                moveElLocation: [x, y, eventName]
            }))
        )
        .subscribe(
            ({ moveElLocation }) => {
                let deltaX = moveElLocation[0] - window.startX;
                let deltaY = moveElLocation[1] - window.startY;
                const deltaL = getLength(deltaX, deltaY);
                const alpha = Math.atan2(deltaY, deltaX);
                const beta = alpha - degToRadian(image.rotateAngle);
                const deltaW = (deltaL * Math.cos(beta)) / scale;
                const deltaH = (deltaL * Math.sin(beta)) / scale;
                let rotateAngle = image.rotateAngle;

                let {
                    position: { centerX, centerY },
                    size: { width, height }
                } = getNewStyle(
                    type,
                    { ...rect, rotateAngle },
                    deltaW,
                    deltaH,
                    ratio,
                    5,
                    5
                );

                let style = centerToTL({ centerX, centerY, width, height, rotateAngle });

                handleResize(
                    style,
                    type,
                    editorStore.idObjectSelected,
                    cursor,
                    image.type,
                    ratio,
                );
            },
            null,
            () => {
                displayResizers.bind(this)(true);
                handleResizeEnd.bind(this)();
                window.pauser.next(false);
                window.editor.forceUpdate();
                ell.style.zIndex = "0";
                ell.style.cursor = "default";

                if (window.resized) {
                    this.saving = setTimeout(() => {
                        saveImages.bind(this)(null, false);
                    }, 5000);
                }
            }
        );
};

const RESIZE_OFFSET = 3;

function handleResize(
    style,
    type,
    _id,
    cursor,
    objectType,
    ratio,
) {
    const {
        scale,
        cropMode,
        childId,
    } = editorStore;

    let { top, left, width, height } = style;
    let switching = false;
    let image = window.image;
    let deltaLeft = left - image.left;
    let deltaTop = top - image.top;
    let deltaWidth = image.width - width;
    let deltaHeight = image.height - height;
    let { imgWidth, imgHeight, posX, posY } = image;
    if (ratio) {
        imgWidth -= image.imgWidth / image.width * deltaWidth;
        imgHeight -= image.imgHeight / image.height * deltaHeight;
    }

    if (cropMode) {
        let t5 = false;
        let t8 = false;
        if (deltaWidth < image.posX && (type == "tl" || type == "bl")) {
            t5 = true;
            deltaLeft = image.posX;
            left = image.left + deltaLeft;
            width = image.width - deltaLeft;
            deltaWidth = image.width - width;

            const mark = type == "tl" ? 1 : -1;

            let {
                position: { centerX, centerY },
                size: { width: width2, height: height2 }
            } = getNewStyle(
                type,
                { ...window.rect, rotateAngle: image.rotateAngle },
                deltaWidth,
                mark * deltaHeight,
                null,
                10,
                10
            );

            let style = centerToTL({ centerX, centerY, width: width2, height: height2, rotateAngle: 0, });

            top = style.top;
            left = style.left;
        }

        let t6 = false;
        let t7 = false;
        if (
            image.imgHeight + image.posY - height < 0 &&
            (type == "bl" || type == "br")
        ) {
            t6 = true;
            height = image.imgHeight + image.posY;
            deltaHeight = image.height - height;

            const mark = type == "bl" ? 1 : -1;

            let {
                position: { centerX, centerY },
                size: { width: width2, height: height2 }
            } = getNewStyle(
                type,
                { ...window.rect, rotateAngle: image.rotateAngle },
                mark * deltaWidth,
                -deltaHeight,
                null,
                10,
                10
            );

            let style = centerToTL({ centerX, centerY, width: width2, height: height2, rotateAngle: 0, });

            top = style.top;
            left = style.left;
        }
        if (
            image.imgWidth + image.posX - width < 0 &&
            (type == "br" || type == "tr")
        ) {
            t7 = true;
            width = image.imgWidth + image.posX;
            deltaWidth = image.width - width;

            const mark = type == "tr" ? 1 : -1;

            let {
                position: { centerX, centerY },
                size: { width: width2, height: height2 }
            } = getNewStyle(
                type,
                { ...window.rect, rotateAngle: image.rotateAngle },
                -deltaWidth,
                mark * deltaHeight,
                null,
                10,
                10
            );

            let style = centerToTL({ centerX, centerY, width: width2, height: height2, rotateAngle: 0, });

            top = style.top;
            left = style.left;
        }

        if (deltaHeight < image.posY && (type == "tl" || type == "tr")) {
            t8 = true;
            deltaTop = image.posY;
            top = image.top + deltaTop;
            height = image.height - deltaTop;
            deltaHeight = image.height - height;

            let mark = type == "tl" ? 1 : -1;

            let {
                position: { centerX, centerY },
                size: { width: width2, height: height2 }
            } = getNewStyle(
                type,
                { ...window.rect, rotateAngle: image.rotateAngle },
                mark * deltaWidth,
                deltaHeight,
                null,
                10,
                10
            );

            let style = centerToTL({ centerX, centerY, width: width2, height: height2, rotateAngle: 0, });

            top = style.top;
            left = style.left;

        }

        if (t5 && t8 && type == "tl") {
            window.resizingInnerImage = true;

            let element = document.getElementById(_id + "tl_");
            if (element) {
                let bcr = element.getBoundingClientRect();
                window.startX = bcr.left + 10;
                window.startY = bcr.top + 10;
            }
            switching = true;
        }

        if (t5 && t6 && type == "bl") {
            window.resizingInnerImage = true;
            window.startX =
                document.getElementById(_id + "bl_").getBoundingClientRect().left +
                10;
            window.startY =
                document.getElementById(_id + "bl_").getBoundingClientRect().top + 10;
            switching = true;
        }

        if (t6 && t7 && type == "br") {
            window.resizingInnerImage = true;
            window.startX = document.getElementById(_id + "br_").getBoundingClientRect().left + 10;
            window.startY = document.getElementById(_id + "br_").getBoundingClientRect().top + 10;
            switching = true;
        }

        if (t8 && t7 && type == "tr") {
            window.resizingInnerImage = true;
            window.startX = document.getElementById(_id + "tr_").getBoundingClientRect().left + 10;
            window.startY = document.getElementById(_id + "tr_").getBoundingClientRect().top + 10;
            switching = true;
        }
    }

    let transformed = transformImage({
        left: left,
        top: top,
        width: width,
        height: height,
        rotateAngle: image.rotateAngle,
    });

    if (!cropMode && image.rotateAngle % 360 == 0 && window.cloneImages) {
        window.cloneImages.forEach(imageTransformed => {
            let guides = getGuideOfImage(imageTransformed._id);

            let top2 = Math.min(transformed.y[0], imageTransformed.y[0]);
            let bot2 = Math.max(transformed.y[2], imageTransformed.y[2]);
            let left2 = Math.min(transformed.x[0], imageTransformed.x[0]);
            let right2 = Math.max(transformed.x[2], imageTransformed.x[2]);

            if (
                (type == "tl" || type == "bl" || type == "l") &&
                Math.abs(left - imageTransformed.x[0]) < RESIZE_OFFSET
            ) {
                left = imageTransformed.x[0];
                let deltaLeft = image.left - left;
                width = image.width + deltaLeft;
                deltaWidth = image.width - width;

                if (type != "l")
                    imgWidth = image.imgWidth + deltaLeft / (image.width / image.imgWidth);

                if (ratio) {
                    height = width / ratio;
                    if (type == "tl") top = image.top - deltaLeft / ratio;
                    imgHeight = imgWidth / (image.imgWidth / image.imgHeight);
                }

                updateXGuide(top2, bot2, guides[0], scale);
            }
            else if (
                (type == "br" || type == "tr" || type == "r") &&
                Math.abs(left + width - imageTransformed.x[0]) < RESIZE_OFFSET
            ) {
                width = imageTransformed.x[0] - image.left;
                deltaWidth = image.width - width;

                if (type != "r")
                    imgWidth = image.imgWidth - deltaWidth / (image.width / image.imgWidth);

                if (ratio) {
                    height = width / ratio;
                    imgHeight = imgWidth / (image.imgWidth / image.imgHeight);
                    if (type == "tr") top = image.top + deltaWidth / ratio;
                }

                updateXGuide(top2, bot2, guides[0], scale);
            } else if (guides[0]) {
                hideGuide(guides[0]);
            }

            if (
                (type == "tl" || type == "bl" || type == "l") &&
                Math.abs(left - imageTransformed.x[1]) < RESIZE_OFFSET
            ) {
                left = imageTransformed.x[1];
                let deltaLeft = image.left - imageTransformed.x[1];
                width = image.width + deltaLeft;
                deltaWidth = image.width - width;

                if (type != "l")
                    imgWidth = image.imgWidth + deltaLeft / (image.width / image.imgWidth);

                if (ratio) {
                    height = width / ratio;
                    if (type == "tl") top = image.top - deltaLeft / ratio;
                    imgHeight = imgWidth / (image.imgWidth / image.imgHeight);
                }

                updateXGuide(top2, bot2, guides[1], scale);
            } else if (
                (type == "br" || type == "tr" || type == "r") &&
                Math.abs(left + width - imageTransformed.x[1]) < RESIZE_OFFSET
            ) {
                width = imageTransformed.x[1] - image.left;
                deltaWidth = image.width - width;

                if (type != "r")
                    imgWidth = image.imgWidth - deltaWidth / (image.width / image.imgWidth);

                if (ratio) {
                    height = width / ratio;
                    imgHeight = imgWidth / (image.imgWidth / image.imgHeight);
                    if (type == "tr") top = image.top + deltaWidth / ratio;
                }

                updateXGuide(top2, bot2, guides[1], scale);
            } else if (guides[1]) {
                hideGuide(guides[1]);
            }

            if (
                (type == "tl" || type == "bl" || type == "l") &&
                Math.abs(left - imageTransformed.x[2]) < RESIZE_OFFSET
            ) {
                left = imageTransformed.x[2];
                let deltaLeft = image.left - imageTransformed.x[2];
                width = image.width + deltaLeft;
                deltaWidth = image.width - width;

                if (type != "l")
                    imgWidth = image.imgWidth + deltaLeft / (image.width / image.imgWidth);

                if (ratio) {
                    height = width / ratio;
                    if (type == "tl") top = image.top - deltaLeft / ratio;
                    imgHeight = imgWidth / (image.imgWidth / image.imgHeight);
                }

                updateXGuide(top2, bot2, guides[2], scale);
            } else if (
                (type == "tr" || type == "br" || type == "r") &&
                Math.abs(left + width - imageTransformed.x[2]) < RESIZE_OFFSET
            ) {
                width = imageTransformed.x[2] - image.left;
                deltaWidth = image.width - width;

                if (type != "r")
                    imgWidth = image.imgWidth - deltaWidth / (image.width / image.imgWidth);

                if (ratio) {
                    height = width / ratio;
                    imgHeight = imgWidth / (image.imgWidth / image.imgHeight);
                    if (type == "tr") top = image.top + deltaWidth / ratio;
                }

                updateXGuide(top2, bot2, guides[2], scale);
            } else if (guides[2]) {
                hideGuide(guides[2]);
            }

            if (
                (type == "tl" || type == "tr" || type == "t") &&
                Math.abs(top - imageTransformed.y[0]) < RESIZE_OFFSET
            ) {
                top = imageTransformed.y[0];
                let deltaTop = image.top - top;
                height = image.height + deltaTop;
                deltaHeight = image.height - height;

                if (type != "t")
                    imgHeight = image.imgHeight + deltaTop / (image.height / image.imgHeight);

                if (ratio) {
                    width = height * ratio;
                    if (type == "tl") left = image.left - deltaTop * ratio;
                    imgWidth = imgHeight / (image.imgHeight / image.imgWidth);
                }

                updateYGuide(left2, right2, guides[3], scale);
            } else if (
                (type == "bl" || type == "br" || type == "b") &&
                Math.abs(top + height - imageTransformed.y[0]) < RESIZE_OFFSET
            ) {
                height = imageTransformed.y[0] - image.top;
                deltaHeight = image.height - height;

                if (type != "b")
                    imgHeight = image.imgHeight - deltaHeight / (image.height / image.imgHeight);

                if (ratio) {
                    width = height * ratio;
                    imgWidth = imgHeight / (image.imgHeight / image.imgWidth);
                    if (type == "bl") left = image.left + deltaHeight * ratio;
                }

                updateYGuide(left2, right2, guides[3], scale);
            } else if (guides[3]) {
                hideGuide(guides[3])
            }

            if (
                (type == "tl" || type == "tr" || type == "t") &&
                Math.abs(top - imageTransformed.y[1]) < RESIZE_OFFSET
            ) {
                top = imageTransformed.y[1];
                let deltaTop = image.top - top;
                height = image.height + deltaTop;
                deltaHeight = image.height - height;

                if (type != "t")
                    imgHeight = image.imgHeight + deltaTop / (image.height / image.imgHeight);

                if (ratio) {
                    width = height * ratio;
                    if (type == "tl") left = image.left - deltaTop * ratio;
                    imgWidth = imgHeight / (image.imgHeight / image.imgWidth);
                }

                updateYGuide(left2, right2, guides[4], scale);
            } else if (
                (type == "bl" || type == "br" || type == "b") &&
                Math.abs(top + height - imageTransformed.y[1]) < RESIZE_OFFSET
            ) {
                height = imageTransformed.y[1] - image.top;
                deltaHeight = image.height - height;

                if (type != "b")
                    imgHeight = image.imgHeight - deltaHeight / (image.height / image.imgHeight);

                if (ratio) {
                    width = height * ratio;
                    imgWidth = imgHeight / (image.imgHeight / image.imgWidth);
                    if (type == "bl") left = image.left + deltaHeight * ratio;
                }

                updateYGuide(left2, right2, guides[4], scale);
            } else if (guides[4]) {
                hideGuide(guides[4])
            }

            if (
                (type == "tl" || type == "tr" || type == "t") &&
                Math.abs(top - imageTransformed.y[2]) < RESIZE_OFFSET
            ) {
                top = imageTransformed.y[2];
                let deltaTop = image.top - top;
                height = image.height + deltaTop;
                deltaHeight = image.height - height;

                if (type != "t")
                    imgHeight = image.imgHeight + deltaTop / (image.height / image.imgHeight);

                if (ratio) {
                    width = height * ratio;
                    if (type == "tl") left = image.left - deltaTop * ratio;
                    imgWidth = imgHeight / (image.imgHeight / image.imgWidth);
                }

                updateYGuide(left2, right2, guides[5], scale);
            } else if (
                (type == "bl" || type == "br" || type == "b") &&
                Math.abs(top + height - imageTransformed.y[2]) < RESIZE_OFFSET
            ) {
                height = imageTransformed.y[2] - image.top;
                deltaHeight = image.height - height;

                if (type != "b")
                    imgHeight = image.imgHeight - deltaHeight / (image.height / image.imgHeight);

                if (ratio) {
                    width = height * ratio;
                    imgWidth = imgHeight / (image.imgHeight / image.imgWidth);
                    if (type == "bl") left = image.left + deltaHeight * ratio;
                }

                updateYGuide(left2, right2, guides[5], scale);
            } else if (guides[5]) {
                hideGuide(guides[5])
            }
        });
    }

    if ((objectType === TemplateType.Image || objectType === TemplateType.Video || objectType == TemplateType.Gradient) && !cropMode) {
        const scaleLeft = image.posX / image.imgWidth;
        const scaleTop = image.posY / image.imgHeight;
        const ratio = image.imgWidth / image.imgHeight;

        if (type == "r") {
            if (width - image.posX > image.imgWidth) {
                const newDeltaWidth = width - image.posX - image.imgWidth;
                imgWidth = image.imgWidth + newDeltaWidth;
                imgHeight = imgWidth / ratio;
                let scaleHeight = imgHeight / image.imgHeight;
                let newHeight = image.height * scaleHeight;
                posY = image.posY / image.imgHeight * imgHeight - (newHeight - image.height) / 2;
            }
        } else if (type == "l") {
            posX = image.posX - deltaWidth;
            if (posX > 0) {
                imgWidth = image.imgWidth + posX;
                imgHeight = imgWidth / ratio;
                let scaleHeight = imgHeight / image.imgHeight;
                let newHeight = image.height * scaleHeight;
                posY = image.posY / image.imgHeight * imgHeight - (newHeight - image.height) / 2;
                posX = 0;
            }
        } else if (type == "t") {
            posY = image.posY - deltaHeight;
            if (posY > 0) {
                imgHeight = image.imgHeight + posY;
                imgWidth = imgHeight * ratio;
                let scaleWidth = imgWidth / image.imgWidth;
                let newWidth = image.width * scaleWidth;
                posX = image.posX / image.imgWidth * imgWidth - (newWidth - image.width) / 2;
                posY = 0;
            }
        } else if (type == "b") {
            if (height - image.posY > image.imgHeight) {
                const newDeltaHeight = height - image.posY - image.imgHeight;
                imgHeight = image.imgHeight + newDeltaHeight;
                imgWidth = imgHeight * ratio;
                let scaleWidth = imgWidth / image.imgWidth;
                let newWidth = image.width * scaleWidth;
                posX = image.posX / image.imgWidth * imgWidth - (newWidth - image.width) / 2;
            }
        } else {
            posX = scaleLeft * imgWidth;
            posY = scaleTop * imgHeight;
        }

        let el = document.getElementById(_id + "1235alo");
        if (el) {
            el.style.width = imgWidth * scale + "px";
            el.style.height = imgHeight * scale + "px";
        }

        el = document.getElementById(_id + "1238alo");
        if (el) {
            el.style.width = imgWidth * scale + "px";
            el.style.height = imgHeight * scale + "px";
        }
    }

    if ((objectType === TemplateType.Image || objectType == TemplateType.Video || objectType == TemplateType.Gradient) && cropMode) {
        if (type == "tl" || type == "bl") {
            posX += width - image.width;
        }
        if (type == "tl" || type == "tr") {
            posY += height - image.height;
        }
    }

    if (objectType == TemplateType.Element) {
        let el = document.getElementById(_id + "hihi4alo");
        el.style.transform = `scale(${width * scale/image.clipWidth})`;
        el.style.width = `${1 / (width * scale / image.clipWidth) * 100}%`;
        el.style.height = `${1 / (width * scale / image.clipWidth) * 100}%`;

        if (image.posX != 0) posX = image.posX * width / image.width;
        if (image.posY != 0) posY = image.posY * width / image.width;
    }

    if (objectType == TemplateType.Grids) {
        let grids = [];
        image.grids.forEach((g, index) => {
            if (g.posX == undefined) g.posX = 0;
            if (g.posY == undefined) g.posY = 0;

            let ratioWidth = 1.0 * g.imgWidth / image.width;
            let ratioHeight = 1.0 * g.imgHeight / image.height;
            let ratio = 1.0 * g.imgWidth / g.imgHeight;

            let boxWidth = (width - g.gapWidth) * g.width / 100;
            let boxHeight = (height - g.gapHeight) * g.height / 100;

            let imgWidth = ratioWidth * width;
            let imgHeight = imgWidth / ratio;
            let posXRatio = 1.0 * g.posX / g.imgWidth;
            let posYRatio = 1.0 * g.posY / g.imgHeight;
            let posX = imgWidth * posXRatio;
            let posY = imgHeight * posYRatio;

            if (imgHeight + posY < boxHeight) {
                let delta = boxHeight - imgHeight - posY;
                imgHeight = boxHeight - posY;
                imgWidth += delta * ratio;
                // posX = imgWidth * posXRatio;
                // posY = imgHeight * posYRatio;
            }

            const el = document.getElementById(_id + index + "alo" + "grid");
            el.style.width = imgWidth + "px";
            el.style.height = imgHeight + "px";
            el.style.transform = `translate(${posX}px, ${posY}px)`;

            let newG = clone(g);
            newG.imgWidth = imgWidth;
            newG.imgHeight = imgHeight;
            newG.posX = posX;
            newG.posY = posY;
            grids.push(newG);
        });

        window.grids = grids;
    }

    window.imageTop = top;
    window.imageLeft = left;
    window.imageWidth = width;
    window.imageHeight = height;
    window.imageimgWidth = imgWidth;
    window.imageimgHeight = imgHeight;
    window.posX = posX;
    window.posY = posY;
    window.scaleX = image.scaleX;
    window.scaleY = image.scaleY;
    window.origin_width = image.origin_width;
    window.origin_height = image.origin_height;
    window.document_object = image.document_object;

    if (cursor != "e" && cursor != "w") {

        window.scaleX = width / image.origin_width;
        window.scaleY = height / image.origin_height;

        if (objectType === TemplateType.Heading) {
            (document.getElementById("fontSizeButton") as HTMLInputElement).value = `${Math.round(image.fontSize * window.scaleY)}`;
        } else if (objectType === TemplateType.TextTemplate && childId) {
            let text = image.document_object.find(text => text._id === childId);
            if (text)
                (document.getElementById("fontSizeButton") as HTMLInputElement).value = `${Math.round(text.fontSize * text.scaleY * window.scaleY)}`;
        }

        if (objectType == TemplateType.Heading || objectType == TemplateType.TextTemplate) {
            let rectalos = document.getElementsByClassName(_id + "scaleX-scaleY");
            for (let i = 0; i < rectalos.length; ++i) {
                let cur: any = rectalos[i];
                cur.style.transform = `scaleX(${window.scaleX}) scaleY(${window.scaleY})`;
                cur.style.width = `calc(100%/${window.scaleX})`;
                cur.style.height = `calc(100%/${window.scaleY})`;
            }
        }
    } else {
        if (objectType == TemplateType.Heading) {
            let el = document.getElementsByClassName(_id + "hihi4alo")[0] as HTMLElement;
            let newHeight = el.offsetHeight * image.scaleY;
            height = newHeight;
            deltaHeight = image.height - newHeight;
            window.imageHeight = height;

            let {
                position: { centerX, centerY },
                size: { width: width2, height: height2 }
            } = getNewStyle(
                cursor == "e" ? "br" : "bl",
                { ...window.rect, rotateAngle: image.rotateAngle },
                (cursor == "e" ? -1 : 1) * deltaWidth,
                -deltaHeight,
                null,
                10,
                10
            );

            let style = centerToTL({ centerX, centerY, width: width2, height: height2, rotateAngle: 0, });
            top = style.top;
            left = style.left;
            window.imageLeft = left;
            window.imageTop = top;

        } else if (objectType == TemplateType.TextTemplate) {
            let maxHeight = 0;

            image.document_object.map(text => {
                if (text.type == TemplateType.Heading) {
                    let textContainer2 = document.getElementById(_id + text._id + "text-container2alo") as HTMLElement;
                    let textEl = textContainer2.getElementsByClassName("text")[0] as HTMLElement;
                    const h = document.getElementById(_id + text._id + "alo").offsetHeight * text.scaleY;
                    textContainer2.style.width = (width * text.width2 / image.scaleX) * scale + "px";
                    textContainer2.style.height = h * scale + "px";

                    textEl.style.width = (width * text.width2 / image.scaleX) / text.scaleX + "px";
                }
            });

            let texts = image.document_object.map(text => {
                if (text.type == TemplateType.Heading) {
                    const h = document.getElementById(_id + text._id + "alo").offsetHeight * text.scaleY;
                    maxHeight = Math.max(maxHeight, h + text.top);
                    text.height = h;
                    text.width = (width * text.width2 / image.scaleX);
                } else if (text.type == TemplateType.Image || text.type == TemplateType.Gradient) {
                    maxHeight = Math.max(maxHeight, (text.height + text.top));
                }
                return text;
            });

            texts = texts.map(text => {
                if (text.type == TemplateType.Heading) {
                    text.height2 = text.height / maxHeight;
                }
                return text;
            });

            let newDocumentObjects = [];
            for (let i = 0; i < texts.length; ++i) {
                let d = texts[i];
                if (!d.ref) {
                    newDocumentObjects.push(
                        ...this.normalize2(
                            d,
                            texts,
                            image.scaleX,
                            image.scaleY,
                            scale,
                            image.width,
                            image.height
                        )
                    );
                }
            }

            height = maxHeight * image.scaleY;

            newDocumentObjects = newDocumentObjects.map(text => {
                if (text.type == TemplateType.Heading) {
                    let els = document.getElementsByClassName(_id + text._id + "b2");
                    for (let i = 0; i < els.length; ++i) {
                        let el = els[i] as HTMLElement;
                        el.style.height = `calc(${text.height2 * 100}% + 2px)`
                        el.style.left = `calc(${text.left / width * 100 * image.scaleX}% - 1px)`;
                        el.style.top = `calc(${text.top / height * 100 * image.scaleY}% - 1px)`;
                    }

                    let childEl = document.getElementById(_id + text._id + "text-container2alo") as HTMLElement;
                    childEl.style.left = text.left * scale + "px";
                    childEl.style.top = text.top * scale + "px";
                }
                return text;
            });

            image.document_object = newDocumentObjects;
            window.document_object = newDocumentObjects;
            window.imageHeight = height;

            deltaHeight = image.height - height;

            let {
                position: { centerX, centerY },
                size: { width: width2, height: height2 }
            } = getNewStyle(
                cursor == "e" ? "br" : "bl",
                { ...window.rect, rotateAngle: image.rotateAngle },
                (cursor == "e" ? -1 : 1) * deltaWidth,
                -deltaHeight,
                null,
                10,
                10
            );

            let style = centerToTL({ centerX, centerY, width: width2, height: height2, rotateAngle: 0, });
            top = style.top;
            left = style.left;
            window.imageLeft = left;
            window.imageTop = top;
        }
        window.origin_width = width / window.scaleX;
        window.origin_height = height / window.scaleY;
    }

    let a = document.getElementsByClassName(_id + "aaaaalo");
    for (let i = 0; i < a.length; ++i) {
        let tempEl = a[i] as HTMLElement;
        tempEl.style.width = width * scale + "px";
        tempEl.style.height = height * scale + "px";
        tempEl.style.transform = `translate(${left * scale}px, ${top * scale}px) rotate(${image.rotateAngle ? image.rotateAngle : 0}deg)`;
    }

    a = document.getElementsByClassName(_id + "aaaa2alo");
    for (let i = 0; i < a.length; ++i) {
        let tempEl = a[i] as HTMLElement;
        tempEl.style.width = width  + "px";
        tempEl.style.height = height  + "px";
    }

    let b = document.getElementsByClassName(_id + "1236alo");
    for (let i = 0; i < b.length; ++i) {
        let tempEl = b[i] as HTMLElement;
        tempEl.style.transform = `translate(${posX * scale}px, ${posY * scale}px)`;
    }

    if (objectType === TemplateType.Heading) {
        let hihi4s = document.getElementsByClassName(_id + "hihi4alo");
        for (let i = 0; i < hihi4s.length; ++i) {
            let el = hihi4s[i] as HTMLElement;
            el.style.width = width / window.scaleX + "px";
        }
    }

    if (objectType == TemplateType.Shape) {
        let els = document.getElementsByClassName(_id + "svgalo");

        const regex = /\[CALC.+?]/gm;
        let xml = image.path;


        for (let i = 0; i < els.length; ++i) {
            let el = els[i] as SVGElement;
            el.setAttribute('viewBox', `0 0 ${width} ${height}`);

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

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, 'text/xml');

            let ABC = processChildren(Array.from(xmlDoc.childNodes), _id + "svg" + "alo", image.colors);

            var xmlString = ReactDOMServer.renderToString(ABC);
            var doc2 = new DOMParser().parseFromString(xmlString, "text/xml");

            for (let j = 0; j < image.colors.length; ++j) {
                let elColors = (doc2.firstChild as HTMLElement).getElementsByClassName("color-" + (j + 1));
                for (let i = 0; i < elColors.length; ++i) {
                    let ell = elColors[i] as HTMLElement;
                    let field = ell.getAttribute("field");
                    if (ell.tagName == "stop") {
                        if (!field) field = "stopColor";
                        ell.style[field] = image.colors[j];
                    } else if (ell.tagName == "path" || ell.tagName == "circle" || ell.tagName == "g" || ell.tagName == "polygon") {
                        if (!field) field = "fill";
                        ell.style[field] = image.colors[j];
                    }
                }
            }

            el.replaceWith(doc2.firstChild);
        }
    }

    if (objectType == TemplateType.GroupedItem) {
        image.childIds.forEach(id => {
            let image2 = editorStore.images2.get(id);

            let centerX = image2.left + image2.width / 2;
            let centerY = image2.top + image2.height / 2;
            let rotateAngle = image2.rotateAngle / 180 * Math.PI;

            let p =
            {
                x: (image2.left - centerX) * Math.cos(rotateAngle) - (image2.top - centerY) * Math.sin(rotateAngle) + centerX,
                y: (image2.left - centerX) * Math.sin(rotateAngle) + (image2.top - centerY) * Math.cos(rotateAngle) + centerY,
            }

            let deltaLeft = p.x - image.left;
            let deltaTop = p.y - image.top;
            let ratioWidth = deltaLeft / image.width;
            let ratioHeight = deltaTop / image.height
            let left1 = left + ratioWidth * width;
            let top1 = top + ratioHeight * height;

            p =
            {
                x: (image2.left + image2.width - centerX) * Math.cos(rotateAngle) - (image2.top - centerY) * Math.sin(rotateAngle) + centerX,
                y: (image2.left + image2.width - centerX) * Math.sin(rotateAngle) + (image2.top - centerY) * Math.cos(rotateAngle) + centerY,
            }

            deltaLeft = p.x - image.left;
            deltaTop = p.y - image.top;
            ratioWidth = deltaLeft / image.width;
            ratioHeight = deltaTop / image.height
            let left2 = left + ratioWidth * width;
            let top2 = top + ratioHeight * height;

            p =
            {
                x: (image2.left + image2.width - centerX) * Math.cos(rotateAngle) - (image2.top + image2.height - centerY) * Math.sin(rotateAngle) + centerX,
                y: (image2.left + image2.width - centerX) * Math.sin(rotateAngle) + (image2.top + image2.height - centerY) * Math.cos(rotateAngle) + centerY,
            }

            deltaLeft = p.x - image.left;
            deltaTop = p.y - image.top;
            ratioWidth = deltaLeft / image.width;
            ratioHeight = deltaTop / image.height
            let left3 = left + ratioWidth * width;
            let top3 = top + ratioHeight * height;

            p =
            {
                x: (image2.left - centerX) * Math.cos(rotateAngle) - (image2.top + image2.height - centerY) * Math.sin(rotateAngle) + centerX,
                y: (image2.left - centerX) * Math.sin(rotateAngle) + (image2.top + image2.height - centerY) * Math.cos(rotateAngle) + centerY,
            }

            deltaLeft = p.x - image.left;
            deltaTop = p.y - image.top;
            ratioWidth = deltaLeft / image.width;
            ratioHeight = deltaTop / image.height
            let left4 = left + ratioWidth * width;
            let top4 = top + ratioHeight * width;

            let newWidth = image2.width / image.width * width;
            let newHeight = image2.height / image.height * height;

            let newCenterX = (left1 + left3) / 2;
            let newCenterY = (top1 + top3) / 2;
            let newLeft = newCenterX - newWidth / 2;
            let newTop = newCenterY - newHeight / 2;

            let a = document.getElementsByClassName(image2._id + "aaaaalo");
            for (let i = 0; i < a.length; ++i) {
                let tempEl = a[i] as HTMLElement;
                tempEl.style.width = newWidth * scale + "px";
                tempEl.style.height = newHeight * scale + "px";
                tempEl.style.transform = `translate(${newLeft * scale}px, ${newTop * scale}px) rotate(${image2.rotateAngle ? image2.rotateAngle : 0}deg)`;
            }

            let newImgWidth = image2.imgWidth / image.width * width;
            let newImgHeight = image2.imgHeight / image.height * height;
            let newPosX = image2.posX / image.width * width;
            let newPosY = image2.posY / image.height * height;

            if (image2.type == TemplateType.Image || image2.type == TemplateType.Gradient) {
                let el = document.getElementById(image2._id + "1235alo");
                if (el) {
                    el.style.width = newImgWidth * scale + "px";
                    el.style.height = newImgHeight * scale + "px";
                    el.style.transform = `translate(${newPosX * scale}px, ${newPosY * scale}px)`;
                }
            }

            let elVideo = document.getElementById(image2._id + "1238alo");
            if (elVideo) {
                elVideo.style.width = newImgWidth * scale + "px";
                elVideo.style.height = newImgHeight * scale + "px";
                elVideo.style.transform = `translate(${newPosX * scale}px, ${newPosY * scale}px)`;
            }

            let newScaleX = image2.scaleX;
            let newScaleY = image2.scaleY;
            if (image2.type == TemplateType.Heading || image2.type == TemplateType.TextTemplate) {
                let el2 = document.getElementById(image2._id + "654alo");
                if (el2) {

                    newScaleX = newWidth / image2.origin_width;
                    newScaleY = newHeight / image2.origin_height;

                    el2.style.width = `calc(100%/${newScaleX})`;
                    el2.style.height = `calc(100%/${newScaleY})`;
                    el2.style.transform = `scaleX(${newScaleX}) scaleY(${newScaleY})`;
                }
            }

            if (image2.type == TemplateType.Element) {
                let el = document.getElementById(image2._id + "hihi4alo");
                el.style.transform = `scale(${newWidth * scale/image2.clipWidth})`;
                el.style.width = `${1 / (newWidth * scale / image2.clipWidth) * 100}%`;
                el.style.height = `${1 / (newWidth * scale / image2.clipWidth) * 100}%`;
            }

            window.selectionsAngle[image2._id] = {
                left: newLeft,
                top: newTop,
                width: newWidth,
                height: newHeight,
                posX: newPosX,
                posY: newPosY,
                imgWidth: newImgWidth,
                imgHeight: newImgHeight,
                scaleX: newScaleX,
                scaleY: newScaleY,
            }
        });
    }

    if (switching) {
        window.image.top = window.imageTop;
        window.image.left = window.imageLeft;
        window.image.width = window.imageWidth;
        window.image.height = window.imageHeight;
        window.image.imgWidth = window.imageimgWidth;
        window.image.imgHeight = window.imageimgHeight;
        window.image.posX = window.posX;
        window.image.posY = window.posY;
        window.image.scaleX = window.scaleX;
        window.image.scaleY = window.scaleY;
        window.image.origin_width = window.origin_width;
        window.image.origin_height = window.origin_height;
        window.image.document_object = window.document_object;

        const styles = tLToCenter({
            top: top,
            left: left,
            width: width,
            height: height,
            rotateAngle: image.rotateAngle
        });
        const imgStyles = tLToCenter({
            left: posX,
            top: posY,
            width: imgWidth,
            height: imgHeight,
            rotateAngle: 0
        });


        window.rect = {
            width: width,
            height: height,
            centerX: styles.position.centerX,
            centerY: styles.position.centerY,
            rotateAngle: image.rotateAngle
        };
        window.rect2 = {
            width: imgWidth,
            height: imgHeight,
            centerX: imgStyles.position.centerX,
            centerY: imgStyles.position.centerY,
            rotateAngle: 0
        };
    }
};


function handleResizeEnd() {

    if (window.cloneImages) {
        window.cloneImages.forEach(imageTransformed => {
            let el0 = document.getElementById(imageTransformed._id + "guide_0");
            let el1 = document.getElementById(imageTransformed._id + "guide_1");
            let el2 = document.getElementById(imageTransformed._id + "guide_2");
            let el3 = document.getElementById(imageTransformed._id + "guide_3");
            let el4 = document.getElementById(imageTransformed._id + "guide_4");
            let el5 = document.getElementById(imageTransformed._id + "guide_5");
            if (el0) el0.style.display = "none";
            if (el1) el1.style.display = "none";
            if (el2) el2.style.display = "none";
            if (el3) el3.style.display = "none";
            if (el4) el4.style.display = "none";
            if (el5) el5.style.display = "none";
        });
    }

    window.image.top = window.imageTop;
    window.image.left = window.imageLeft;
    window.image.width = window.imageWidth;
    window.image.height = window.imageHeight;
    window.image.imgWidth = window.imageimgWidth;
    window.image.imgHeight = window.imageimgHeight;
    window.image.posX = window.posX;
    window.image.posY = window.posY;
    window.image.scaleX = window.scaleX;
    window.image.scaleY = window.scaleY;
    window.image.origin_width = window.origin_width;
    window.image.origin_height = window.origin_height;
    window.image.document_object = window.document_object;
    window.image.grids = window.grids;

    if (window.image.type == TemplateType.TextTemplate) {
        window.image.document_object = window.image.document_object.map(doc => {
            if (doc._id == editorStore.childId) {
                doc.selected = true;
            } else {
                doc.selected = false;
            }
            return doc;
        })
    }

    editorStore.images2.set(editorStore.idObjectSelected, window.image);
    document.body.style.cursor = null;

    if (window.image.type == TemplateType.GroupedItem) {
        window.image.childIds.forEach(id => {
            let image2 = editorStore.images2.get(id);
            image2.selected = false;
            image2.left = window.selectionsAngle[id].left;
            image2.top = window.selectionsAngle[id].top;
            image2.width = window.selectionsAngle[id].width;
            image2.height = window.selectionsAngle[id].height;
            image2.imgWidth = window.selectionsAngle[id].imgWidth;
            image2.imgHeight = window.selectionsAngle[id].imgHeight;
            image2.posX = window.selectionsAngle[id].posX;
            image2.posY = window.selectionsAngle[id].posY;
            image2.scaleX = window.selectionsAngle[id].scaleX;
            image2.scaleY = window.selectionsAngle[id].scaleY;
            editorStore.images2.set(id, image2);
            updateGuide(image2);
            updateImages(id, image2.page, image2, true);
        });
    }

    updateImages(editorStore.idObjectSelected, editorStore.pageId, window.image, true);
    updateGuide(window.image);
};


export function handleResizeInnerImageStart(e, d) {
    window.resized = false;
    cancelSaving();

    popuplateImageProperties(editorStore.idObjectSelected);

    window.resizingInnerImage = true;
    window.startX = e.clientX;
    window.startY = e.clientY;
    window.pauser.next(true);

    let cursor = e.target.id;
    let type = e.target.getAttribute("class").split(" ")[0];
    let scale = editorStore.scale;
    const location$ = handleDragRx(e.target);

    let image = editorStore.getImageSelected();
    window.image = clone(image);
    let {
        top: top2,
        left: left2,
        width: width2,
        height: height2,
        imgWidth: width3,
        imgHeight: height3,
        posX: left3,
        posY: top3
    } = image;

    const rect2 = tLToCenter({
        top: top2,
        left: left2,
        width: width2,
        height: height2,
        rotateAngle: 0,
    });

    const rect3 = tLToCenter({
        top: top3,
        left: left3,
        width: width3,
        height: height3,
        rotateAngle: 0
    });

    window.rect = {
        width: image.width,
        height: image.height,
        centerX: rect2.position.centerX,
        centerY: rect2.position.centerY,
        rotateAngle: image.rotateAngle
    };
    window.rect2 = {
        width: image.imgWidth,
        height: image.imgHeight,
        centerX: rect3.position.centerX,
        centerY: rect3.position.centerY,
        rotateAngle: 0,
    };

    let cursorStyle = getCursorStyleForResizer(image.rotateAngle, d);

    let ell = document.getElementById("screen-container-parent2");
    ell.style.zIndex = "2";
    ell.style.cursor = cursorStyle;

    location$.pipe(
        first(),
        // catchError(_ => 'no more resizing!!!')
    ).subscribe(v => {
        window.resized = true;
        displayResizers(false);
        setSavingState(SavingState.UnsavedChanges, false);
    });

    window.temp = location$
        .pipe(
            map(([x, y]) => ({
                moveElLocation: [x, y]
            }))
        )
        .subscribe(
            ({ moveElLocation }) => {
                window.resized = true;
                displayResizers(false);
                setSavingState(SavingState.UnsavedChanges, false);

                let deltaX = moveElLocation[0] - window.startX;
                let deltaY = moveElLocation[1] - window.startY;
                const deltaL = getLength(deltaX, deltaY);
                const alpha = Math.atan2(deltaY, deltaX);
                const beta = alpha - degToRadian(image.rotateAngle);
                const deltaW = (deltaL * Math.cos(beta)) / scale;
                const deltaH = (deltaL * Math.sin(beta)) / scale;
                let rotateAngle = image.rotateAngle;

                if (!window.resizingInnerImage) {
                    let {
                        position: { centerX, centerY },
                        size: { width, height }
                    } = getNewStyle(
                        type,
                        { ...window.rect, rotateAngle },
                        deltaW,
                        deltaH,
                        null,
                        5,
                        5
                    );
                    let style = centerToTL({ centerX, centerY, width, height, rotateAngle });
                    handleResize.bind(this)(
                        style,
                        type,
                        editorStore.idObjectSelected,
                        cursor,
                        image.type,
                        null,
                    );
                } else {
                    let ratio = image.imgWidth / image.imgHeight;
                    let {
                        position: { centerX, centerY },
                        size: { width, height }
                    } = getNewStyle(
                        type,
                        { ...window.rect2 },
                        deltaW,
                        deltaH,
                        ratio,
                        10,
                        10
                    );
                    let style = centerToTL({ centerX, centerY, width, height, rotateAngle: 0 });

                    handleImageResize.bind(this)(
                        style,
                        type,
                        editorStore.idObjectSelected,
                    );
                }
            },
            null,
            () => {
                handleResizeEnd.bind(this)();
                window.pauser.next(false);
                displayResizers(true);
                ell.style.zIndex = "0";

                if (window.resized) {
                    this.saving = setTimeout(() => {
                        saveImages.bind(this)(null, false);
                    }, 5000);
                }
            }
        );
};


    // Handle the actual miage
function handleImageResize(
        style,
        type,
        _id,
    ) {
        let switching;
        const { scale } = editorStore;
        let { left: posX, top: posY, width: imageimgWidth, height: imageimgHeight } = style;
        let image = window.image;
        const ratio = image.imgWidth / image.imgHeight;
        if (
            image.height - posY - imageimgHeight > 0 &&
            image.width - posX - imageimgWidth > 0 &&
            type == "br"
        ) {
            let el = document.getElementById(_id + type);
            if (el) {
                let rect = document.getElementById(_id + type).getBoundingClientRect();
                window.resizingInnerImage = false;
                window.startX = rect.left + 10;
                window.startY = rect.top + 10;
                switching = true;
            }
            const deltaX = image.imgWidth - image.width + image.posX;
            const deltaY = image.imgHeight - image.height + image.posY;
            if (deltaX / deltaY > ratio) {
                const delta = deltaY;
                imageimgHeight = image.imgHeight - delta / ratio;
                imageimgWidth = image.imgWidth - delta;
            } else {
                const delta = deltaX;
                imageimgHeight = image.imgHeight - delta / ratio;
                imageimgWidth = image.imgWidth - delta;
            }
        } else if (
            image.height - posY > imageimgHeight &&
            posX <= 0 &&
            (type == "bl" || type == "br")
        ) {
            let el = document.getElementById(_id + type);
            if (el) {
                let rect = document.getElementById(_id + type).getBoundingClientRect();
                window.resizingInnerImage = false;
                window.startX = rect.left + 10;
                window.startY = rect.top + 10;
                switching = true;
            }
            const deltaY = image.imgHeight - image.height + image.posY;
            imageimgWidth = image.imgWidth - deltaY * ratio;
            imageimgHeight = image.imgHeight - deltaY;
            if (type == "bl") {
                posX = image.posX + deltaY * ratio;
            }
        } else if (image.height - posY > imageimgHeight && posX > 0 && type == "bl") {
            let el = document.getElementById(_id + type);
            if (el) {
                let rect = document.getElementById(_id + type).getBoundingClientRect();
                window.resizingInnerImage = false;
                window.startX = rect.left + 10;
                window.startY = rect.top + 10;
                switching = true;
            }
            const deltaX = Math.abs(-image.posX);
            const deltaY = image.imgHeight - image.height + image.posY;
            if (deltaX / deltaY > ratio) {
                const delta = deltaY;
                imageimgHeight = image.imgHeight - delta / ratio;
                imageimgWidth = image.imgWidth - delta;
                posX = image.posX + delta * ratio;
            } else {
                const delta = deltaX;
                imageimgHeight = image.imgHeight - delta / ratio;
                imageimgWidth = image.imgWidth - delta;
                posX = 0;
            }
        } else if (
            image.width - posX > imageimgWidth &&
            posY <= 0 &&
            (type == "tr" || type == "br")
        ) {
            let el = document.getElementById(_id + type);
            if (el) {
                let rect = document.getElementById(_id + type).getBoundingClientRect();
                window.resizingInnerImage = false;
                window.startX = rect.left + 10;
                window.startY = rect.top + 10;
                switching = true;
            }

            const val = image.imgWidth - image.width + image.posX;
            imageimgWidth = image.imgWidth - val;
            imageimgHeight = image.imgHeight - val / ratio;
            if (type == "tr") {
                posY = image.posY + val / ratio;
            }
        } else if (image.width - posX > imageimgWidth && posY > 0 && type == "tr") {
            let el = document.getElementById(_id + type);
            if (el) {
                let rect = document.getElementById(_id + type).getBoundingClientRect();
                window.resizingInnerImage = false;
                window.startX = rect.left + 10;
                window.startY = rect.top + 10;
                switching = true;
            }
            const deltaX = image.imgWidth - image.width + image.posX;
            const deltaY = Math.abs(-image.posY);
            if (deltaX / deltaY > ratio) {
                const delta = deltaY;
                imageimgHeight = image.imgHeight - delta / ratio;
                imageimgWidth = image.imgWidth - delta;
                posY = 0;
            } else {
                const delta = deltaX;
                imageimgHeight = image.imgHeight - delta / ratio;
                imageimgWidth = image.imgWidth - delta;
                posY = image.posY + delta / ratio;
            }

        } else if (posY > 0 && posX <= 0 && (type == "tl" || type == "tr")) {
            let el = document.getElementById(_id + type);
            if (el) {
                let rect = document.getElementById(_id + type).getBoundingClientRect();
                window.resizingInnerImage = false;
                window.startX = rect.left + 10;
                window.startY = rect.top + 10;
                switching = true;
            }

            const deltaY = -image.posY;
            imageimgHeight = image.imgHeight - deltaY;
            imageimgWidth = image.imgWidth - deltaY * ratio;
            posY = 0;
            if (type == "tl") {
                posX = image.posX + deltaY * ratio;
            }
        } else if (posX > 0 && posY <= 0 && (type == "tl" || type == "bl")) {
            let el = document.getElementById(_id + type);
            if (el) {
                let rect = document.getElementById(_id + type).getBoundingClientRect();
                window.resizingInnerImage = false;
                window.startX = rect.left + 10;
                window.startY = rect.top + 10;
                switching = true;
            } else {

            }
            const deltaX = -image.posX;
            imageimgWidth = image.imgWidth - deltaX;
            imageimgHeight = image.imgHeight - deltaX / ratio;
            if (type == "tl") {
                posY = image.posY + deltaX / ratio;
            }
            posX = 0;
        } else if (posX > 1 && posY > 1 && type == "tl") {
            let el = document.getElementById(_id + type);
            if (el) {
                let rect = document.getElementById(_id + type).getBoundingClientRect();
                window.resizingInnerImage = false;
                window.startX = rect.left + 10;
                window.startY = rect.top + 10;
                switching = true;
            }

            const deltaX = Math.abs(-image.posX);
            const deltaY = Math.abs(-image.posY);
            if (deltaX / deltaY > ratio) {
                const delta = deltaY;
                imageimgHeight = image.imgHeight - delta;
                imageimgWidth = image.imgWidth - delta * ratio;
                posX = image.posX + delta * ratio;
                posY = 0;
            } else {
                const delta = deltaX;
                imageimgHeight = image.imgHeight - delta / ratio;
                imageimgWidth = image.imgWidth - delta;
                posX = 0;
                posY = image.posY + delta / ratio;
            }
        }

        window.posX = posX;
        window.posY = posY;
        window.imageimgWidth = imageimgWidth;
        window.imageimgHeight = imageimgHeight;
        window.imageTop = image.top;
        window.imageLeft = image.left;
        window.imageWidth = image.width;
        window.imageHeight = image.height;
        window.scaleX = image.scaleX;
        window.scaleY = image.scaleY;
        window.origin_width = image.origin_width;
        window.origin_height = image.origin_height;

        let el = document.getElementsByClassName(_id + "1236alo");
        for (let i = 0; i < el.length; ++i) {
            let tempEl = el[i] as HTMLElement;
            tempEl.style.transform = `translate(${posX * scale}px, ${posY * scale}px)`;
            tempEl.style.width = imageimgWidth * scale + "px";
            tempEl.style.height = imageimgHeight * scale + "px";
        }

        let els = document.getElementsByClassName(_id + "1239");
        for (let i = 0; i < els.length; ++i) {

            let tempEl = els[i] as HTMLElement;
            tempEl.style.width = imageimgWidth / (image.width / image.clipWidth) + "px";
            tempEl.style.height = imageimgHeight / (image.width / image.clipWidth) + "px";
            tempEl.style.transform =  `translate(${posX / (image.width / image.clipWidth)}px, ${posY / (image.width / image.clipWidth)}px)`;

        }

        if (switching) {
            handleResizeEnd.bind(this)();

            const styles = tLToCenter({
                top: window.imageTop,
                left: window.imageLeft,
                width: window.imageWidth,
                height: window.imageHeight,
                rotateAngle: image.rotateAngle
            });

            const imgStyles = tLToCenter({
                left: window.posX,
                top: window.posY,
                width: window.imageimgWidth,
                height: window.imageimgHeight,
                rotateAngle: 0
            });

            window.rect = {
                width: window.imageWidth,
                height: window.imageHeight,
                centerX: styles.position.centerX,
                centerY: styles.position.centerY,
                rotateAngle: image.rotateAngle
            };

            window.rect2 = {
                width: window.imageimgWidth,
                height: window.imageimgHeight,
                centerX: imgStyles.position.centerX,
                centerY: imgStyles.position.centerY,
                rotateAngle: 0
            };
        }
    };


export function handleRotateStart(e: any) {

        window.rotated = false;
        cancelSaving();

        let scale = editorStore.scale;
        e.stopPropagation();

        let image = editorStore.getImageSelected();
        window.image = image;
        window.rotateAngle = image.rotateAngle;

        let tip = document.getElementById("helloTip");
        if (!tip) {
            tip = document.createElement("div");
        }
        tip.id = "helloTip";
        tip.style.position = "absolute";
        tip.style.height = "30px";
        tip.style.backgroundColor = "black";
        tip.style.top = e.clientY + 20 + "px";
        tip.style.left = e.clientX + 20 + "px";
        tip.style.zIndex = "2147483647";
        tip.style.color = "white";
        tip.style.textAlign = "center";
        tip.style.lineHeight = "30px";
        tip.style.borderRadius = "3px";
        tip.style.padding = "0 5px";
        tip.style.fontSize = "12px";
        tip.innerText = image.rotateAngle + "°";

        document.body.append(tip);

        const location$ = handleDragRx(e.target);

        const rect = document
            .getElementById(editorStore.idObjectSelected + "_alo")
            .getBoundingClientRect();
        const center = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
        const startVector = {
            x: e.clientX - center.x,
            y: e.clientY - center.y
        };

        window.pauser.next(true);

        let ell = document.getElementById("screen-container-parent2");
        ell.style.zIndex = "2";

        window.selectionsAngle = {};

        location$.pipe(
            first(),
            // catchError(_ => 'no more rotation!!!')
        ).subscribe(v => {
            window.rotated = true;
            displayResizers(false);
            setSavingState(SavingState.UnsavedChanges, false);
        });

        window.temp = location$
            .pipe(
                map(([x, y]) => ({
                    moveElLocation: [x, y]
                }))
            )
            .subscribe(
                ({ moveElLocation }) => {
                    const rotateVector = {
                        x: moveElLocation[0] - center.x,
                        y: moveElLocation[1] - center.y
                    };
                    const angle = getAngle(startVector, rotateVector);

                    let rotateAngle = Math.round(image.rotateAngle + angle) % 360;
                    window.rotateAngle = Math.round(image.rotateAngle + angle) % 360;

                    let centerX = image.left + image.width / 2;
                    let centerY = image.top + image.height / 2;

                    if (image.type == TemplateType.GroupedItem) {
                        window.selections.forEach(sel => {
                            const id = sel.attributes.iden.value;
                            if (!id) return;
                            let image2 = clone(editorStore.images2.get(id));
                            if (!image2) return;
                            let angle = rotateAngle - image.rotateAngle;
                            let a = rotateRect(image2);
                            a = a.map(p => rotatePoint(p, angle, centerX, centerY));
                            let cX = (a[0].x + a[2].x) / 2;
                            let cY = (a[0].y + a[2].y) / 2;
                            let newLeft = cX - image2.width / 2;
                            let newTop = cY - image2.height / 2;
                            let newAngle = 180 + Math.atan2(a[0].y - a[1].y, a[0].x - a[1].x) * 180 / Math.PI;

                            let aa = document.getElementsByClassName(image2._id + "aaaaalo");
                            for (let i = 0; i < aa.length; ++i) {
                                let cur = aa[i] as HTMLElement;
                                cur.style.transform = `translate(${newLeft * scale}px, ${newTop * scale}px) rotate(${newAngle}deg)`;
                            }

                            window.selectionsAngle[image2._id] = {
                                rotateAngle: newAngle,
                                left: newLeft,
                                top: newTop,
                            };
                        })
                    }

                    let cursorStyle = getCursorStyleWithRotateAngle(rotateAngle);
                    ell.style.cursor = cursorStyle;

                    let a = document.getElementsByClassName(image._id + "aaaaalo");
                    for (let i = 0; i < a.length; ++i) {
                        let cur = a[i] as HTMLElement;
                        cur.style.transform = `translate(${image.left * scale}px, ${image.top * scale}px) rotate(${rotateAngle}deg)`;
                    }

                    let tip = document.getElementById("helloTip");
                    if (!tip) {
                        tip = document.createElement("div");
                    }
                    tip.id = "helloTip";
                    tip.style.position = "absolute";
                    tip.style.height = "30px";
                    tip.style.backgroundColor = "black";
                    tip.style.top = moveElLocation[1] + 20 + "px";
                    tip.style.left = moveElLocation[0] + 20 + "px";
                    tip.innerText = rotateAngle + "°";
                },
                null,
                () => {
                    displayResizers(true);
                    handleRotateEnd.bind(this)(editorStore.idObjectSelected);
                    window.pauser.next(false);
                    ell.style.zIndex = "0";

                    if (window.rotated) {
                        this.saving = setTimeout(() => {
                            saveImages.bind(this)(null, false);
                        }, 5000);
                    }
                }
            );
    };


function handleRotateEnd(_id: string) {
        let tip = document.getElementById("helloTip");
        if (!tip) {
            tip = document.createElement("div");
        }
        document.body.removeChild(tip);
        window.image.rotateAngle = window.rotateAngle;

        if (window.image.type == TemplateType.TextTemplate) {
            window.image.document_object = window.image.document_object.map(doc => {
                if (doc._id == editorStore.childId) {
                    doc.selected = true;
                } else {
                    doc.selected = false;
                }
                return doc;
            })
        }

        editorStore.images2.set(editorStore.idObjectSelected, window.image);
        updateImages(editorStore.idObjectSelected, editorStore.pageId, window.image, true);
        updateGuide(window.image);

        if (window.image.type == TemplateType.GroupedItem) {
            window.selections.forEach(sel => {
                const id = sel.attributes.iden.value;
                if (!id || !window.selectionsAngle[id]) return;
                let image = editorStore.images2.get(id);
                image.rotateAngle = window.selectionsAngle[id].rotateAngle;
                image.left = window.selectionsAngle[id].left;
                image.top = window.selectionsAngle[id].top;
                image.selected = false;
                editorStore.images2.set(id, image);
                updateGuide(image);
                updateImages(id, image.page, image, true);
            });
        }
    };


export function handleDragStart(e, _id) {

        cancelSaving();

        window.startX = e.clientX;
        window.startY = e.clientY;
        window.dragged = false;
        const { scale } = editorStore;

        let image = editorStore.images2.get(_id);
        window.startLeft = image.left * scale;
        window.startTop = image.top * scale;
        window.image = clone(toJS(image));
        window.posX = window.image.posX;
        window.posY = window.image.posY;
        window.imgWidth = window.image.imgWidth;
        window.imgHeight = window.image.imgHeight;

        window.selectionsAngle = {};

        window.pauser.next(true);

        const location$ = handleDragRx(e.target);

        let images = [];
        Array.from(editorStore.images2.values()).forEach((image: any) => {
            if (image.page === window.image.page) {

                if (window.image.type != TemplateType.GroupedItem) {
                    let clonedImage = transformImage(clone(image));
                    images.push(clonedImage);
                } else if (!window.selectionIDs || !window.selectionIDs[image._id]) {
                    let clonedImage = transformImage(clone(image));
                    images.push(clonedImage);
                }
            }
        });

        window.cloneImages = images;

        location$.pipe(
            first(),
        ).subscribe(v => {
            displayResizers(false);
            setSavingState(SavingState.UnsavedChanges, false);
            window.dragged = true;
        });

        window.temp = location$
            .pipe(
                map(([x, y]) => ({
                    moveElLocation: [x, y]
                }))
            )
            .subscribe(
                ({ moveElLocation }) => {
                    if (editorStore.cropMode) {
                        handleImageDrag(
                            editorStore.idObjectSelected,
                            moveElLocation[0],
                            moveElLocation[1]
                        );
                    } else {
                        handleDrag(
                            editorStore.idObjectSelected,
                            moveElLocation[0],
                            moveElLocation[1]
                        );
                    }
                },
                null,
                () => {
                    displayResizers(true);
                    window.pauser.next(false);

                    if (window.dragged) {
                        handleDragEnd.bind(this)();
                        window.saving = setTimeout(() => {
                            saveImages.bind(this)(null, false);
                        }, 5000);
                    }
                }
            );
    };

    
function handleImageDrag(_id, clientX, clientY) {
        const { scale } = editorStore;

        let deltaX = clientX - window.startX;
        let deltaY = clientY - window.startY;

        let deg = degToRadian(window.image.rotateAngle);
        let newX = deltaY * Math.sin(deg) + deltaX * Math.cos(deg);
        let newY = deltaY * Math.cos(deg) - deltaX * Math.sin(deg);

        let newPosX = window.posX + newX / scale;
        let newPosY = window.posY + newY / scale;

        let img = window.image;
        if (newPosX > 0) {
            newPosX = 0;
        } else if (newPosX + img.imgWidth < img.width) {
            newPosX = img.width - img.imgWidth;
        }
        if (newPosY > 0) {
            newPosY = 0;
        } else if (newPosY + img.imgHeight < img.height) {
            newPosY = img.height - img.imgHeight;
        }
        img.posX = newPosX;
        img.posY = newPosY;

        let el = document.getElementsByClassName(_id + "1236alo");
        for (let i = 0; i < el.length; ++i) {
            let tempEl = el[i] as HTMLElement;
            tempEl.style.transform = `translate(${newPosX * scale}px, ${newPosY *
                scale}px)`;
        }

        el = document.getElementsByClassName(_id + "1239");
        for (let i = 0; i < el.length; ++i) {
            let tempEl = el[i] as HTMLElement;
            tempEl.style.transform = `translate(${newPosX * scale / (img.width * scale/img.clipWidth)}px, ${newPosY * scale / (img.width * scale/img.clipWidth)}px)`;
        }
    };

    /**
     * Create an observable stream to handle drag gesture
     */
    drag = (element: HTMLElement, pan$: Observable<Event>): Observable<any> => {
        const panMove$ = pan$.pipe(filter((e: Event) => e.type == "mousemove"));
        const panEnd$ = pan$.pipe(filter((e: Event) => e.type == "mouseup"));

        return panMove$.pipe(
            map((e: any) => {
                e.preventDefault();
                // e.stopPropagation();
                let x = e.clientX;
                let y = e.clientY;
                let eventName = e.type;
                return { x, y, eventName };
            }),
            takeUntil(panEnd$),
        );
    };

    function handleDrag(_id, clientX, clientY) {
        const { scale } = editorStore;
        let newLeft, newTop;
        let newLeft2, newTop2;
        let newLeft3, newTop3;
        let centerX, centerY;
        let left, top;
        let img;
        let updateStartPosX = false;
        let updateStartPosY = false;
        let image = window.image;
        newLeft = (clientX - window.startX + window.startLeft) / scale;
        newTop = (clientY - window.startY + window.startTop) / scale;

        let newL = newLeft;
        let newR = newL + image.width;
        let newT = newTop;
        let newB = newT + image.height;
        let centerXX = newLeft + image.width / 2;
        let centerYY = newTop + image.height / 2;
        let rotateAngle = image.rotateAngle / 180 * Math.PI;

        let bb = [
            {
                x: (newL - centerXX) * Math.cos(rotateAngle) - (newT - centerYY) * Math.sin(rotateAngle) + centerXX,
                y: (newL - centerXX) * Math.sin(rotateAngle) + (newT - centerYY) * Math.cos(rotateAngle) + centerYY,
            },
            {
                x: (newR - centerXX) * Math.cos(rotateAngle) - (newT - centerYY) * Math.sin(rotateAngle) + centerXX,
                y: (newR - centerXX) * Math.sin(rotateAngle) + (newT - centerYY) * Math.cos(rotateAngle) + centerYY,
            },
            {
                x: (newR - centerXX) * Math.cos(rotateAngle) - (newB - centerYY) * Math.sin(rotateAngle) + centerXX,
                y: (newR - centerXX) * Math.sin(rotateAngle) + (newB - centerYY) * Math.cos(rotateAngle) + centerYY,
            },
            {
                x: (newL - centerXX) * Math.cos(rotateAngle) - (newB - centerYY) * Math.sin(rotateAngle) + centerXX,
                y: (newL - centerXX) * Math.sin(rotateAngle) + (newB - centerYY) * Math.cos(rotateAngle) + centerYY,
            }
        ]

        let top1 = 999999, right1 = 0, bottom1 = 0, left1 = 999999;

        left1 = Math.min(left1, bb[0].x);
        left1 = Math.min(left1, bb[1].x);
        left1 = Math.min(left1, bb[2].x);
        left1 = Math.min(left1, bb[3].x);
        right1 = Math.max(right1, bb[0].x)
        right1 = Math.max(right1, bb[1].x)
        right1 = Math.max(right1, bb[2].x)
        right1 = Math.max(right1, bb[3].x)
        top1 = Math.min(top1, bb[0].y)
        top1 = Math.min(top1, bb[1].y)
        top1 = Math.min(top1, bb[2].y)
        top1 = Math.min(top1, bb[3].y)
        bottom1 = Math.max(bottom1, bb[0].y)
        bottom1 = Math.max(bottom1, bb[1].y)
        bottom1 = Math.max(bottom1, bb[2].y)
        bottom1 = Math.max(bottom1, bb[3].y)



        newLeft2 = newLeft + image.width / 2;
        newLeft3 = newLeft + image.width;
        newTop2 = newTop + image.height / 2;
        newTop3 = newTop + image.height;
        img = image;

        centerX = newLeft + image.width / 2;
        centerY = newTop + image.height / 2;
        left = newLeft;
        top = newTop;
        if (img.type === TemplateType.BackgroundImage
        ) {
            return;
        }
        window.cloneImages.forEach(imageTransformed => {
            if (imageTransformed._id !== _id) {
                let el0 = document.getElementById(imageTransformed._id + "guide_0");
                let el1 = document.getElementById(imageTransformed._id + "guide_1");
                let el2 = document.getElementById(imageTransformed._id + "guide_2");
                let el3 = document.getElementById(imageTransformed._id + "guide_3");
                let el4 = document.getElementById(imageTransformed._id + "guide_4");
                let el5 = document.getElementById(imageTransformed._id + "guide_5");

                if (
                    Math.abs(left1 - imageTransformed.x[0]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosX) {
                        left -= left1 - imageTransformed.x[0];
                    }
                    if (el0) {
                        let top2 = Math.min(top1, imageTransformed.y[0]);
                        let bot2 = Math.max(bottom1, imageTransformed.y[2]);
                        el0.style.display = "block";
                        el0.style.height = (bot2 - top2) * scale + "px";
                        el0.style.top = top2 * scale + "px";
                    }
                    updateStartPosX = true;
                } else if (
                    Math.abs((left1 + right1) / 2 - imageTransformed.x[0]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosX) {
                        left -= (left1 + right1) / 2 - imageTransformed.x[0];
                    }
                    if (el0) {
                        let top2 = Math.min(top1, imageTransformed.y[0]);
                        let bot2 = Math.max(bottom1, imageTransformed.y[2]);
                        el0.style.display = "block";
                        el0.style.height = (bot2 - top2) * scale + "px";
                        el0.style.top = top2 * scale + "px";
                    }
                    updateStartPosX = true;
                } else if (
                    Math.abs(right1 - imageTransformed.x[0]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosX) {
                        left -= right1 - imageTransformed.x[0];
                        // left = imageTransformed.x[0] - image.width;
                    }
                    if (el0) {
                        let top2 = Math.min(top1, imageTransformed.y[0]);
                        let bot2 = Math.max(bottom1, imageTransformed.y[2]);
                        el0.style.display = "block";
                        el0.style.height = (bot2 - top2) * scale + "px";
                        el0.style.top = top2 * scale + "px";
                    }
                    updateStartPosX = true;
                } else {
                    if (el0) {
                        el0.style.display = "none";
                    }
                }

                if (
                    Math.abs(left1 - imageTransformed.x[1]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosX) {
                        left -= left1 - imageTransformed.x[1];
                    }
                    if (el1) {
                        let top2 = Math.min(top1, imageTransformed.y[0]);
                        let bot2 = Math.max(bottom1, imageTransformed.y[2]);
                        el1.style.display = "block";
                        el1.style.height = (bot2 - top2) * scale + "px";
                        el1.style.top = top2 * scale + "px";
                    }
                    updateStartPosX = true;
                } else if (
                    Math.abs((left1 + right1) / 2 - imageTransformed.x[1]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosX) {
                        left -= (left1 + right1) / 2 - imageTransformed.x[1];
                    }
                    if (el1) {
                        let top2 = Math.min(top1, imageTransformed.y[0]);
                        let bot2 = Math.max(bottom1, imageTransformed.y[2]);
                        el1.style.display = "block";
                        el1.style.height = (bot2 - top2) * scale + "px";
                        el1.style.top = top2 * scale + "px";
                    }
                    updateStartPosX = true;
                } else if (
                    Math.abs(right1 - imageTransformed.x[1]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosX) {
                        left -= right1 - imageTransformed.x[1];
                    }
                    if (el1) {
                        let top2 = Math.min(top1, imageTransformed.y[0]);
                        let bot2 = Math.max(bottom1, imageTransformed.y[2]);
                        el1.style.display = "block";
                        el1.style.height = (bot2 - top2) * scale + "px";
                        el1.style.top = top2 * scale + "px";
                    }
                    updateStartPosX = true;
                } else {
                    if (el1) {
                        el1.style.display = "none";
                    }
                }

                if (
                    Math.abs(left1 - imageTransformed.x[2]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosX) {
                        left -= left1 - imageTransformed.x[2];
                    }
                    if (el2) {
                        let top2 = Math.min(top1, imageTransformed.y[0]);
                        let bot2 = Math.max(bottom1, imageTransformed.y[2]);
                        el2.style.display = "block";
                        el2.style.height = (bot2 - top2) * scale + "px";
                        el2.style.top = top2 * scale + "px";
                    }
                    updateStartPosX = true;
                } else if (
                    Math.abs((left1 + right1) / 2 - imageTransformed.x[2]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosX) {
                        left -= (left1 + right1) / 2 - imageTransformed.x[2];
                    }
                    if (el2) {
                        let top2 = Math.min(top1, imageTransformed.y[0]);
                        let bot2 = Math.max(bottom1, imageTransformed.y[2]);
                        el2.style.display = "block";
                        el2.style.height = (bot2 - top2) * scale + "px";
                        el2.style.top = top2 * scale + "px";
                    }
                    updateStartPosX = true;
                } else if (
                    Math.abs(right1 - imageTransformed.x[2]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosX) {
                        left -= right1 - imageTransformed.x[2];
                    }
                    if (el2) {
                        let top2 = Math.min(top1, imageTransformed.y[0]);
                        let bot2 = Math.max(bottom1, imageTransformed.y[2]);
                        el2.style.display = "block";
                        el2.style.height = (bot2 - top2) * scale + "px";
                        el2.style.top = top2 * scale + "px";
                    }
                    updateStartPosX = true;
                } else {
                    if (el2) {
                        el2.style.display = "none";
                    }
                }

                if (
                    Math.abs(top1 - imageTransformed.y[0]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosY) {
                        top -= top1 - imageTransformed.y[0];
                    }
                    if (el3) {
                        let left2 = Math.min(left1, imageTransformed.x[0]);
                        let right2 = Math.max(right1, imageTransformed.x[2]);
                        el3.style.display = "block";
                        el3.style.width = (right2 - left2) * scale + "px";
                        el3.style.left = left2 * scale + "px";
                    }
                    updateStartPosY = true;
                } else if (
                    Math.abs((top1 + bottom1) / 2 - imageTransformed.y[0]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosY) {
                        top -= (top1 + bottom1) / 2 - imageTransformed.y[0];
                    }
                    if (el3) {
                        let left2 = Math.min(left1, imageTransformed.x[0]);
                        let right2 = Math.max(right1, imageTransformed.x[2]);
                        el3.style.display = "block";
                        el3.style.width = (right2 - left2) * scale + "px";
                        el3.style.left = left2 * scale + "px";
                    }
                    updateStartPosY = true;
                } else if (
                    Math.abs(bottom1 - imageTransformed.y[0]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosY) {
                        top -= bottom1 - imageTransformed.y[0];
                    }
                    if (el3) {
                        let left2 = Math.min(left1, imageTransformed.x[0]);
                        let right2 = Math.max(right1, imageTransformed.x[2]);
                        el3.style.display = "block";
                        el3.style.width = (right2 - left2) * scale + "px";
                        el3.style.left = left2 * scale + "px";
                    }
                    updateStartPosY = true;
                } else {
                    if (el3) {
                        el3.style.display = "none";
                    }
                }

                if (
                    Math.abs(top1 - imageTransformed.y[1]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosY) {
                        top -= top1 - imageTransformed.y[1];
                    }
                    if (el4) {
                        let left2 = Math.min(left1, imageTransformed.x[0]);
                        let right2 = Math.max(right1, imageTransformed.x[2]);
                        el4.style.display = "block";
                        el4.style.width = (right2 - left2) * scale + "px";
                        el4.style.left = left2 * scale + "px";
                    }
                    updateStartPosY = true;
                } else if (
                    Math.abs((top1 + bottom1) / 2 - imageTransformed.y[1]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosY) {
                        top -= newTop2 - imageTransformed.y[1];
                    }
                    if (el4) {
                        let left2 = Math.min(left1, imageTransformed.x[0]);
                        let right2 = Math.max(right1, imageTransformed.x[2]);
                        el4.style.display = "block";
                        el4.style.width = (right2 - left2) * scale + "px";
                        el4.style.left = left2 * scale + "px";
                    }
                    updateStartPosY = true;
                } else if (
                    Math.abs(bottom1 - imageTransformed.y[1]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosY) {
                        top -= bottom1 - imageTransformed.y[1];
                    }
                    if (el4) {
                        let left2 = Math.min(left1, imageTransformed.x[0]);
                        let right2 = Math.max(right1, imageTransformed.x[2]);
                        el4.style.display = "block";
                        el4.style.width = (right2 - left2) * scale + "px";
                        el4.style.left = left2 * scale + "px";
                    }
                    updateStartPosY = true;
                } else {
                    if (el4) {
                        el4.style.display = "none";
                    }
                }

                if (
                    Math.abs(top1 - imageTransformed.y[2]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosY) {
                        top -= top1 - imageTransformed.y[2];
                    }
                    if (el5) {
                        let left2 = Math.min(left1, imageTransformed.x[0]);
                        let right2 = Math.max(right1, imageTransformed.x[2]);
                        el5.style.display = "block";
                        el5.style.width = (right2 - left2) * scale + "px";
                        el5.style.left = left2 * scale + "px";
                    }
                    updateStartPosY = true;
                } else if (
                    Math.abs((top1 + bottom1) / 2 - imageTransformed.y[2]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosY) {
                        top -= (top1 + bottom1) / 2 - imageTransformed.y[2];
                    }
                    if (el5) {
                        let left2 = Math.min(left1, imageTransformed.x[0]);
                        let right2 = Math.max(right1, imageTransformed.x[2]);
                        el5.style.display = "block";
                        el5.style.width = (right2 - left2) * scale + "px";
                        el5.style.left = left2 * scale + "px";
                    }
                    updateStartPosY = true;
                } else if (
                    Math.abs(bottom1 - imageTransformed.y[2]) < RESIZE_OFFSET
                ) {
                    if (!updateStartPosY) {
                        top -= bottom1 - imageTransformed.y[2];
                    }
                    if (el5) {
                        let left2 = Math.min(left1, imageTransformed.x[0]);
                        let right2 = Math.max(right1, imageTransformed.x[2]);
                        el5.style.display = "block";
                        el5.style.width = (right2 - left2) * scale + "px";
                        el5.style.left = left2 * scale + "px";
                    }
                    updateStartPosY = true;
                } else {
                    if (el5) {
                        el5.style.display = "none";
                    }
                }
            }
        });

        let deltaLeft = left - window.startLeft / scale;
        let deltaTop = top - window.startTop / scale;

        if (image.type == TemplateType.GroupedItem) {
            image.childIds.forEach(id => {
                let image2 = editorStore.images2.get(id);

                window.selectionsAngle[image2._id] = {
                    left: image2.left + deltaLeft,
                    top: image2.top + deltaTop,
                };

                let elId = id + "_alo";

                let el = document.getElementById(elId);
                if (el) {
                    el.style.width = image2.width * scale + "px";
                    el.style.height = image2.height * scale + "px";
                    el.style.transform = `translate(${(image2.left + deltaLeft) * scale}px, ${(image2.top + deltaTop) * scale}px) rotate(${image2.rotateAngle ? image2.rotateAngle : 0}deg)`;
                }

                let temp = document.getElementsByClassName(elId) as HTMLCollectionOf<HTMLElement>;
                for (let i = 0; i < temp.length; ++i) {
                    let el2 = temp[i];
                    el2.style.width = image2.width * scale + "px";
                    el2.style.height = image2.height * scale + "px";
                    el2.style.transform = `translate(${(image2.left + deltaLeft) * scale}px, ${(image2.top + deltaTop) * scale}px) rotate(${image2.rotateAngle ? image2.rotateAngle : 0}deg)`;

                }

                elId = id + "__alo";

                el = document.getElementById(elId);
                if (el) {
                    el.style.width = image2.width * scale + "px";
                    el.style.height = image2.height * scale + "px";
                    el.style.transform = `translate(${(image2.left + deltaLeft) * scale}px, ${(image2.top + deltaTop) * scale}px) rotate(${image2.rotateAngle ? image2.rotateAngle : 0}deg)`;
                }

                temp = document.getElementsByClassName(elId) as HTMLCollectionOf<HTMLElement>;
                for (let i = 0; i < temp.length; ++i) {
                    let el2 = temp[i];
                    el2.style.width = image2.width * scale + "px";
                    el2.style.height = image2.height * scale + "px";
                    el2.style.transform = `translate(${(image2.left + deltaLeft) * scale}px, ${(image2.top + deltaTop) * scale}px) rotate(${image2.rotateAngle ? image2.rotateAngle : 0}deg)`;

                }
            })
        }

        image.left = left;
        image.top = top;

        updatePosition.bind(this)(_id + "_alo", image);
        updatePosition.bind(this)(_id + "__alo", image);
    };

    function updateGuide(image) {
        const { scale } = editorStore;
        const transformedimage = transformImage(image);

        let gui0 = getGuider(image._id, 0);
        let gui1 = getGuider(image._id, 1);
        let gui2 = getGuider(image._id, 2);
        let gui3 = getGuider(image._id, 3);
        let gui4 = getGuider(image._id, 4);
        let gui5 = getGuider(image._id, 5);

        if (gui0) {
            gui0.style.left = `${transformedimage.x[0] * scale}px`;
            gui0.style.top = `${transformedimage.y[0] * scale}px`;
            gui0.style.height = `${(transformedimage.y[2] - transformedimage.y[0]) * scale}px`;
        }

        if (gui1) {
            gui1.style.left = `${transformedimage.x[1] * scale}px`;
            gui1.style.top = `${transformedimage.y[0] * scale}px`;
            gui1.style.height = `${(transformedimage.y[2] - transformedimage.y[0]) * scale}px`;
        }

        if (gui2) {
            gui2.style.left = `${transformedimage.x[2] * scale}px`;
            gui2.style.top = `${transformedimage.y[0] * scale}px`;
            gui2.style.height = `${(transformedimage.y[2] - transformedimage.y[0]) * scale}px`;
        }

        if (gui3) {
            gui3.style.top = `${transformedimage.y[0] * scale}px`;
            gui3.style.left = `${transformedimage.x[0] * scale}px`;
            gui3.style.width = `${(transformedimage.x[2] - transformedimage.x[0]) * scale}px`;
        }

        if (gui4) {
            gui4.style.top = `${transformedimage.y[1] * scale}px`;
            gui4.style.left = `${transformedimage.x[0] * scale}px`;
            gui4.style.width = `${(transformedimage.x[2] - transformedimage.x[0]) * scale}px`;
        }

        if (gui5) {
            gui5.style.top = `${transformedimage.y[2] * scale}px`;
            gui5.style.left = `${transformedimage.x[0] * scale}px`;
            gui5.style.width = `${(transformedimage.x[2] - transformedimage.x[0]) * scale}px`;
        }
    }

    function getGuider(id, num) {
        return document.getElementById(id + `guide_${num}`);
    }
    
    function handleDragEnd() {

        window.temp.unsubscribe();

        if (window.image.type == TemplateType.TextTemplate) {
            window.image.document_object = window.image.document_object.map(doc => {
                if (doc._id == editorStore.childId) {
                    doc.selected = true;
                } else {
                    doc.selected = false;
                }
                return doc;
            })
        }

        editorStore.images2.set(editorStore.idObjectSelected, window.image);
        updateGuide(window.image);
        updateImages(editorStore.idObjectSelected, editorStore.pageId, window.image, true);

        window.cloneImages.forEach(imageTransformed => {
            let el0 = document.getElementById(imageTransformed._id + "guide_0");
            let el1 = document.getElementById(imageTransformed._id + "guide_1");
            let el2 = document.getElementById(imageTransformed._id + "guide_2");
            let el3 = document.getElementById(imageTransformed._id + "guide_3");
            let el4 = document.getElementById(imageTransformed._id + "guide_4");
            let el5 = document.getElementById(imageTransformed._id + "guide_5");

            if (el0) el0.style.display = "none";
            if (el1) el1.style.display = "none";
            if (el2) el2.style.display = "none";
            if (el3) el3.style.display = "none";
            if (el4) el4.style.display = "none";
            if (el5) el5.style.display = "none";
        });

        if (window.image.type == TemplateType.GroupedItem) {
            window.image.childIds.forEach(id => {
                let image2 = editorStore.images2.get(id);
                if (image2) {
                    image2.left = window.selectionsAngle[id].left;
                    image2.top = window.selectionsAngle[id].top;
                    image2.selected = false;

                    editorStore.images2.set(id, image2);
                    updateGuide(image2);
                    updateImages(id, image2.page, image2, true);
                }
            })
        }
    };

    
    export function handleOpacityChange(opacity) {
        let image = getImageSelected();
        if (image.type == TemplateType.Video) {
            let el = document.getElementById(editorStore.idObjectSelected + "video0alo");
            if (el) {
                el.style.opacity = (opacity / 100).toString();
            }
        } else {

            let el = document.getElementById(editorStore.idObjectSelected + "hihi4alo");
            if (el) {
                el.style.opacity = (opacity / 100).toString();
            }
        }

        window.opacity = opacity;
    };

    export function handleOpacityChangeEnd() {
        let opacity = window.opacity;
        let image = getImageSelected();
        image.opacity = opacity;
        editorStore.images2.set(editorStore.idObjectSelected, image);

        updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
    }

    export function handleGridSelected(childId) {
        let image = this.getImageSelected();
        if (image.grids[childId].src) editorStore.croppable = true;
        else editorStore.croppable = false;
        editorStore.gridIndex = childId;
        this.canvas1[editorStore.pageId].canvas[CanvasType.All][editorStore.idObjectSelected].child.handleGridSelected(childId);
        this.canvas1[editorStore.pageId].canvas[CanvasType.HoverLayer][editorStore.idObjectSelected].child.handleGridSelected(childId);
    }

    export function handleChildIdSelected(childId) {
        editorStore.childId = childId;
        this.canvas1[editorStore.pageId].canvas[CanvasType.All][editorStore.idObjectSelected].child.handleTextChildSelected(childId);
        this.canvas1[editorStore.pageId].canvas[CanvasType.HoverLayer][editorStore.idObjectSelected].child.handleTextChildSelected(childId);

        let align, effectId, bold, italic, fontId, fontColor, fontText;
        let currentOpacity, currentLineHeight, currentLetterSpacing;
        let fontSize;
        let image = editorStore.getImageSelected();
        image.selected = true;
        if (image.document_object) {
            image.document_object.forEach(doc => {
                if (doc._id == childId) {
                    doc.selected = true;
                    align = doc.align;
                    effectId = doc.effectId;
                    bold = doc.bold;
                    italic = doc.italic;
                    fontId = doc.fontId;
                    fontText = doc.fontText;
                    fontColor = doc.color;
                    currentLineHeight = doc.lineHeight;
                    currentOpacity = doc.opacity;
                    currentLetterSpacing = doc.letterSpacing;
                    fontSize = doc.fontSize * doc.scaleY * image.scaleY;
                }
                return doc;
            });
        }

        let fontsList = toJS(editorStore.fontsList);
        let font = fontsList.find(font => font.id === fontId);
        let text = image.document_object.find(text => text._id == childId);

        editorStore.fontId = fontId;
        editorStore.fontFace = fontId;
        editorStore.fontText = fontText;
        editorStore.currentFontSize = fontSize;
        editorStore.currentLetterSpacing = currentLetterSpacing;
        editorStore.childId = childId;
        editorStore.currentLineHeight = currentLineHeight;
        editorStore.effectId = effectId;
        editorStore.images2.set(editorStore.idObjectSelected, image);

        this.setState({
            fontColor,
            childId,
            align,
            effectId,
            bold,
            italic,
            fontId,
            currentOpacity,
            currentLineHeight,
            currentLetterSpacing,
            fontName: font ? font.representative : null,
            fontSize: Math.round(text.fontSize * image.scaleY * text.scaleY),
        });
    };

export function disableCropMode() {
    let scale = editorStore.scale;

    if (editorStore.idObjectSelected) {
        this.setState({ cropMode: false });
        editorStore.cropMode = false;
        this.canvas1[editorStore.pageId].canvas[CanvasType.All][editorStore.idObjectSelected].child.disableCropMode();
        this.canvas1[editorStore.pageId].canvas[CanvasType.HoverLayer][editorStore.idObjectSelected].child.disableCropMode();
        let index = editorStore.pages.findIndex(pageId => pageId == editorStore.pageId);
        editorStore.keys[index] = editorStore.keys[index] + 1;

        window.editor.forceUpdate();
    }

    let image = this.getImageSelected();
    if (image.type == TemplateType.BackgroundImage && image.deleteAfterCrop) {
        let parentImage = editorStore.images2.get(image.parentImageId);
        parentImage.hovered = false;
        parentImage.selected = false;
        parentImage.grids = parentImage.grids.map((g, i) => {
            if (i == image.gridIndex) {
                g.imgWidth = image.imgWidth;
                g.imgHeight = image.imgHeight;
                g.posX = image.posX;
                g.posY = image.posY;
            }
            return g;
        });

        updateImages(parentImage._id, parentImage.page, parentImage, true);

        editorStore.images2.delete(editorStore.idObjectSelected);
        doNoObjectSelected.bind(this)();
        let index = editorStore.pages.findIndex(pageId => pageId == editorStore.pageId);
        editorStore.keys[index] = editorStore.keys[index] + 1;

        window.editor.forceUpdate();
    }

    if ((image.type == TemplateType.Image ||
        image.type == TemplateType.Element ||
        image.type == TemplateType.Video || 
        image.type == TemplateType.Gradient ) && image.groupedIds) {
        let top = 999999, right = 0, bottom = 0, left = 999999;
        let childIds = [];
        image.groupedIds.forEach(id => {
            let img = editorStore.images2.get(id);
            childIds.push(id);
            let b = transformImage(img);

            let w = b.x[2] * scale - b.x[0] * scale - 4;
            let h = b.y[2] * scale - b.y[0] * scale - 4;
            let centerX = b.x[0] * scale + w / 2 + 2;
            let centerY = b.y[0] * scale + h / 2 + 2;
            let rotateAngle = img.rotateAngle / 180 * Math.PI;
            let newL = centerX - img.width * scale / 2;
            let newR = centerX + img.width * scale / 2;
            let newT = centerY - img.height * scale / 2;
            let newB = centerY + img.height * scale / 2;


            let bb = [
                {
                    x: (newL - centerX) * Math.cos(rotateAngle) - (newT - centerY) * Math.sin(rotateAngle) + centerX,
                    y: (newL - centerX) * Math.sin(rotateAngle) + (newT - centerY) * Math.cos(rotateAngle) + centerY,
                },
                {
                    x: (newR - centerX) * Math.cos(rotateAngle) - (newT - centerY) * Math.sin(rotateAngle) + centerX,
                    y: (newR - centerX) * Math.sin(rotateAngle) + (newT - centerY) * Math.cos(rotateAngle) + centerY,
                },
                {
                    x: (newR - centerX) * Math.cos(rotateAngle) - (newB - centerY) * Math.sin(rotateAngle) + centerX,
                    y: (newR - centerX) * Math.sin(rotateAngle) + (newB - centerY) * Math.cos(rotateAngle) + centerY,
                },
                {
                    x: (newL - centerX) * Math.cos(rotateAngle) - (newB - centerY) * Math.sin(rotateAngle) + centerX,
                    y: (newL - centerX) * Math.sin(rotateAngle) + (newB - centerY) * Math.cos(rotateAngle) + centerY,
                }
            ]

            left = Math.min(left, bb[0].x);
            left = Math.min(left, bb[1].x);
            left = Math.min(left, bb[2].x);
            left = Math.min(left, bb[3].x);
            right = Math.max(right, bb[0].x)
            right = Math.max(right, bb[1].x)
            right = Math.max(right, bb[2].x)
            right = Math.max(right, bb[3].x)
            top = Math.min(top, bb[0].y)
            top = Math.min(top, bb[1].y)
            top = Math.min(top, bb[2].y)
            top = Math.min(top, bb[3].y)
            bottom = Math.max(bottom, bb[0].y)
            bottom = Math.max(bottom, bb[1].y)
            bottom = Math.max(bottom, bb[2].y)
            bottom = Math.max(bottom, bb[3].y)
        });

        let index = editorStore.pages.findIndex(pageId => pageId == editorStore.activePageId);

        let newTop = top;
        let newLeft = left;
        let width = right - left;
        let height = bottom - top;

        let item = {
            _id: uuidv4(),
            childIds,
            type: TemplateType.GroupedItem,
            src: "",
            width: width / scale,
            height: height / scale,
            origin_width: width / scale,
            origin_height: height / scale,
            left: newLeft / scale,
            top: newTop / scale,
            rotateAngle: 0.0,
            scaleX: 1,
            scaleY: 1,
            posX: 0,
            posY: 0,
            imgWidth: width / scale,
            imgHeight: height / scale,
            page: editorStore.activePageId,
            zIndex: 99999,
            width2: 1,
            height2: 1,
            document_object: [],
            ref: null,
            innerHTML: null,
            color: 'transparent',
            opacity: 100,
            backgroundColor: 'transparent',
            childId: null,
            selected: true,
            hovered: true,
            temporary: true,
        };
        let index2 = editorStore.pages.findIndex(pageId => pageId == editorStore.activePageId);
        editorStore.keys[index2] = editorStore.keys[index2] + 1;
        editorStore.addItem2(item, false);
        this.handleImageSelected(item._id, item.page, false, true, false);

        if (groupGroupedItem) groupGroupedItem.bind(this)();
    }
}

export function forwardSelectedObject(id) {
    let image = getImageSelected();
    image.zIndex = editorStore.upperZIndex + 1;
    editorStore.images2.set(editorStore.idObjectSelected, image);
    updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
    editorStore.increaseUpperzIndex();
};

export function backwardSelectedObject(id) {
    let image = getImageSelected();
    image.zIndex = 2;
    editorStore.images2.forEach((val, key) => {
        if (val.page == image.page) {
            if (key == editorStore.idObjectSelected) {
                val.zIndex = 1;
            } else {
                val.zIndex += 1;
            }
            val.selected = false;
            val.hovered = false;
            editorStore.images2.set(key, val);
            updateImages(key, editorStore.pageId, val, true);
        }
    });
    editorStore.upperZIndex += 1;
    editorStore.images2.set(editorStore.idObjectSelected, image);
    updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);

};

export function toggleVideo() {
    this.canvas1[editorStore.pageId].canvas[CanvasType.All][editorStore.idObjectSelected].child.toggleVideo();
    this.canvas1[editorStore.pageId].canvas[CanvasType.HoverLayer][editorStore.idObjectSelected].child.toggleVideo();

    let el = document.getElementById(editorStore.idObjectSelected + "video0" + "alo") as HTMLVideoElement;
    let el2 = document.getElementById(editorStore.idObjectSelected + "video2" + "alo") as HTMLVideoElement;
    let image = getImageSelected();
    if (image.paused) {
        if (el) el.play();
        if (el2) el2.play();
        image.paused = false;
    } else {
        if (el) el.pause();
        if (el2) el2.pause();
        image.paused = true;
    }

    editorStore.images2.set(image._id, image);
}

export function addAPage(e, id) {
    e.preventDefault();
    let pages = toJS(editorStore.pages);
    let keys = toJS(editorStore.keys);
    const index = pages.findIndex(img => img === id) + 1;
    let newPageId = uuidv4();
    pages.splice(index, 0, newPageId);
    keys.splice(index, 0, 0);

    const { rectWidth, rectHeight } = this.state;

    let item = {
        _id: uuidv4(),
        type: TemplateType.BackgroundImage,
        width: rectWidth,
        height: rectHeight,
        origin_width: rectWidth,
        origin_height: rectWidth,
        left: 0,
        top: 0,
        rotateAngle: 0.0,
        selected: false,
        scaleX: 1,
        scaleY: 1,
        posX: 0,
        posY: 0,
        imgWidth: rectWidth,
        imgHeight: rectWidth,
        page: newPageId,
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
    };

    setSavingState(SavingState.UnsavedChanges, false);
    editorStore.addItem2(item, false);

    this.handleImageSelected(item._id, newPageId, false, true, false);

    editorStore.pages.replace(pages);
    editorStore.keys.replace(keys);
    setTimeout(() => {
        document.getElementById(newPageId).scrollIntoView();
    }, 100);

    window.editor.forceUpdate();
};


export function handleDeleteThisPage(pageId)  {
    let pages = toJS(editorStore.pages);
    let tempPages = pages.filter(pId => pId !== pageId);
    editorStore.pages.replace(tempPages);
};

export function updateImages2(image, includeDownloadCanvas) {
    updateImages(editorStore.idObjectSelected, editorStore.pageId, image, includeDownloadCanvas);
}

export function updateImages(id, pageId, image, includeDownloadCanvas) {
    try {
        window.editor.canvas1[pageId].canvas[CanvasType.All][id].child.updateImage(image);
        window.editor.canvas1[pageId].canvas[CanvasType.HoverLayer][id].child.updateImage(image);
        if (includeDownloadCanvas) window.editor.canvas2[pageId].canvas[CanvasType.Download][id].child.updateImage(image);
    } catch (e) {
        console.log('Failed to updateImages. Exception: ', e);
    }
}

export function handleEditmedia(item) {
    window.editor.setState({ showMediaEditPopup: true, editingMedia: item });
    window.editor.forceUpdate();
};

export function handleEditFont(item) {
    window.editor.setState({ showFontEditPopup: true, editingFont: item });
    window.editor.forceUpdate();
};
