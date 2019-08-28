import { AppThunkActionAsync } from "@Store/index";
import { compact, isBoolean } from 'lodash';
import htmlToImageLib from './htmltoimage';

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
  const $content = document.getElementsByClassName('ContentRoot')[0]

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