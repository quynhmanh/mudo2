import { AppThunkActionAsync } from "@Store/index";
import { compact, isBoolean } from 'lodash';
import htmlToImageLib from './htmltoimage';
import { VisibilityProperty } from "csstype";
import React from "react";
export const htmlToImage = htmlToImageLib;
import { camelCase } from "lodash";
import editorStore from "@Store/EditorStore";
import { TemplateType, CanvasType, SidebarTab, } from "@Components/editor/enums";
import { toJS } from "mobx";
import axios from "axios";
import uuidv4 from "uuid/v4";

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
    let scale = this.state.scale;
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

const getImageSelected = () => {
    return toJS(editorStore.images2.get(editorStore.idObjectSelected));
}

function doNoObjectSelected() {

    if (editorStore.cropMode) {
        this.disableCropMode();
    }

    if (editorStore.idObjectSelected) {
        try { 
            this.canvas1[editorStore.pageId].canvas[CanvasType.All][editorStore.idObjectSelected].child.handleImageUnselected();
            this.canvas1[editorStore.pageId].canvas[CanvasType.HoverLayer][editorStore.idObjectSelected].child.handleImageUnselected();
        } catch (e) {

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

            this.forceUpdate();
        }
        editorStore.idObjectSelected = null;
        editorStore.childId = null;
    }

    if (editorStore.selectedTab === SidebarTab.Font || editorStore.selectedTab === SidebarTab.Color || editorStore.selectedTab === SidebarTab.Effect) {
        editorStore.selectedTab = SidebarTab.Image;
    }
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
        this.forceUpdate();
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

    let image = this.getImageSelected();
    image.temporary = false;
    editorStore.images2.set(image._id, image);
    this.updateImages2(image, false);

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

    this.forceUpdate();
}

export function handleItalicBtnClick(e: any) {
    e.preventDefault();
    let image = this.getImageSelected();
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

    this.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);

    editorStore.images2.set(editorStore.idObjectSelected, image);
}

export function handleBoldBtnClick(e: any) {
    e.preventDefault();

    let bold;
    let image = this.getImageSelected();
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

    this.updateImages(editorStore.idObjectSelected, editorStore.pageId, image, true);
    editorStore.images2.set(editorStore.idObjectSelected, image);
}

export function handleCropBtnClick(id: string) {
    let image = editorStore.getImageSelected();
    if (image.type == TemplateType.BackgroundImage && !image.src) {
        return;
    }
    if (image.type == TemplateType.Grids && editorStore.gridIndex != null) {
        this.handleGridCrop(editorStore.gridIndex);
    }
    if (image.type == TemplateType.GroupedItem || 
        image.type == TemplateType.Heading || 
        image.type == TemplateType.Grids ||
        image.type == TemplateType.Shape) {
        return;
    }

    if (image.type == TemplateType.TextTemplate) {
        this.handleChildCrop(editorStore.childId);
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

    this.enableCropMode(editorStore.idObjectSelected, editorStore.pageId);
}

export function handleGridCrop(index) {
    let image = this.getImageSelected();
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

    let image = this.getImageSelected();

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
    this.updateImages2(image, true);

    editorStore.currentFontSize = fontSize;

    (document.getElementById("fontSizeButton") as HTMLInputElement).value = fontSize.toString();
    if (editorStore.childId) {
        this.onTextChange(image, e, editorStore.childId);
    }
}

export function handleChildCrop(id) {
    let image = this.getImageSelected();
    let childImage = image.document_object.find(doc => doc._id == id);
    if (childImage.type == TemplateType.Heading) return;
    
    this.doNoObjectSelected();
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
    this.forceUpdate();
}