import { AppThunkActionAsync } from "@Store/index";
import { compact, isBoolean } from 'lodash';
import htmlToImageLib from './htmltoimage';
import { VisibilityProperty } from "csstype";

export const htmlToImage = htmlToImageLib;

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
const cursorDirectionArray = [ 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw' ]
const cursorMap = { 0: 0, 1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 4, 7: 5, 8: 6, 9: 6, 10: 7, 11: 8 }
export const getCursor = (rotateAngle, d) => {
  const increment = cursorMap[ Math.floor(rotateAngle / 30) ]
  const index = cursorStartMap[ d ]
  const newIndex = (index + increment) % 8

  return cursorDirectionArray[ newIndex ]
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
      Math.max(($root.scrollWidth - vw)/2, 0),
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

var getImageData = function(imgEl, degrade, rgbMatch, colorFactorCallback) {
  var rgb,
      canvas = document.createElement('canvas'),
      context = canvas.getContext && canvas.getContext('2d'),
      data, width, height, key,
      i = -4,
      db={},
      length,r,g,b,
      count = 0;
  
  if (!context) {
    return null;
  }
  
  height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
  width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
  
  context.drawImage(imgEl, 0, 0);
  
  try {
    data = context.getImageData(0, 0, width, height);
  } catch(e) {
    /* security error, img on diff domain */
    return null;
  }

  length = data.data.length;
  
  var factor = Math.max(1,Math.round(length/5000));
  var result = {};
  
  while ( (i += 4*factor) < length ) {
    if (data.data[i+3]>32) {
      key = (data.data[i]>>degrade) + "," + (data.data[i+1]>>degrade) + "," + (data.data[i+2]>>degrade);
      if (!result.hasOwnProperty(key)) {
        rgb = {r:data.data[i], g:data.data[i+1], b:data.data[i+2],count:1};
        rgb.weight = 0;
        // rgb.weight = this.callback(rgb.r, rgb.g, rgb.b);
        if (rgb.weight<=0) rgb.weight = 1e-10;
        result[key]=rgb;
      } else {
        rgb=result[key];
        rgb.count++;
      }
    }
  }

  return result;

};

var getMostProminentRGBImpl = function(pixels, degrade, rgbMatch) {
  
  var rgb = {r:0,g:0,b:0,count:0,d:degrade},
      db={},
      pixel,pixelKey,pixelGroupKey,
      length,r,g,b,
      count = 0;
  
  
  for (pixelKey in pixels) {
    pixel = pixels[pixelKey];
    var totalWeight = pixel.weight * pixel.count;
    ++count;
    if (doesRgbMatch(rgbMatch, pixel.r, pixel.g, pixel.b)) {
      pixelGroupKey = (pixel.r>>degrade) + "," + (pixel.g>>degrade) + "," + (pixel.b>>degrade);
      if (db.hasOwnProperty(pixelGroupKey))
        db[pixelGroupKey]+=totalWeight;
      else
        db[pixelGroupKey]=totalWeight;
    }
  }
  
  for (var i in db) {
    var data = i.split(",");
    r = data[0];
    g = data[1];
    b = data[2];
    count = db[i];
    
    if (count>rgb.count) {
      rgb.count = count;
      data = i.split(",");
      rgb.r = r;
      rgb.g = g;
      rgb.b = b;
    }
  }
  
  return rgb;
  
};

var doesRgbMatch = function(rgb,r,g,b) {
  if (rgb==null) return true;
  r = r >> rgb.d;
  g = g >> rgb.d;
  b = b >> rgb.d;
  return rgb.r == r && rgb.g == g && rgb.b == b;
}

export const updateTransformXY = function(elId, x, y: any) {
  var el1238 = document.getElementById(elId);
  if (el1238) {
    el1238.style.transform = `translate(${x}px, ${y}px)`;
  }

  var temp = document.getElementsByClassName(elId) as HTMLCollectionOf<HTMLElement>;
  for (var i = 0; i < temp.length; ++i) {
    temp[i].style.transform = `translate(${x}px, ${y}px)`;
  }
}

export const updatePosition = function(elId, image: any) {
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
    el.style.transform = `translate(${image.left * scale}px, ${image.top * scale}px) rotate(${image.rotateAngle ? image.rotateAngle : 0}deg)`;

  }
}

export const updateRotate = function(elId, rotateAngle: any) {
  var el = document.getElementById(elId);
  if (el) {
    el.style.transform = `rotate(${rotateAngle}deg)`;
  }
}

export const getCursorStyleWithRotateAngle = (rotateAngle) : string => {
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

  return cursor;
}

export const getImageResizerVisibility = (img,  scale, d): VisibilityProperty => {
  console.log('getImageResizerVisibility d', d, (img.imgWidth + img.posX - img.width) * scale);
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