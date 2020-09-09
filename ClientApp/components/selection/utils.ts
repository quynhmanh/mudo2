/* eslint-disable prefer-rest-params */
function eventListener(method, elements, events, fn, options = {}) {

    // Normalize array
    if (elements instanceof HTMLCollection || elements instanceof NodeList) {
        elements = Array.from(elements);
    } else if (!Array.isArray(elements)) {
        elements = [elements];
    }

    if (!Array.isArray(events)) {
        events = [events];
    }

    for (const element of elements) {
        for (const event of events) {
            element[method](event, fn, {capture: false, ...options});
        }
    }

    return Array.prototype.slice.call(arguments, 1);
}

/**
 * Add event(s) to element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const on = eventListener.bind(null, 'addEventListener');

/**
 * Remove event(s) from element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const off = eventListener.bind(null, 'removeEventListener');

const unitify = (val, unit = 'px') => typeof val === 'number' ? val + unit : val;

/**
 * Add css to a DOM-Element or returns the current
 * value of a property.
 *
 * @param el The Element.
 * @param attr The attribute or a object which holds css key-properties.
 * @param val The value for a single attribute.
 * @returns {*}
 */
export function css(el, attr, val) {
    const style = el && el.style;
    if (style) {
        if (typeof attr === 'object') {

            for (const [key, value] of Object.entries(attr)) {
                style[key] = unitify(value);
            }

        } else if (val && typeof attr === 'string') {
            style[attr] = unitify(val);
        }
    }
}

function isUndefined(a) {
    return typeof a == "undefined";
}


/**
 * Helper function to determine whether there is an intersection between the two polygons described
 * by the lists of vertices. Uses the Separating Axis Theorem
 *
 * @param a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @param b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @return true if there is any intersection between the 2 polygons, false otherwise
 */
function doPolygonsIntersect (a, b) {
    var polygons = [a, b];
    var minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {

        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        var polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {

            // grab 2 vertices to create an edge
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];

            // find the line perpendicular to this edge
            var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

            minA = maxA = undefined;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (isUndefined(minA) || projected < minA) {
                    minA = projected;
                }
                if (isUndefined(maxA) || projected > maxA) {
                    maxA = projected;
                }
            }

            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            minB = maxB = undefined;
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (isUndefined(minB) || projected < minB) {
                    minB = projected;
                }
                if (isUndefined(maxB) || projected > maxB) {
                    maxB = projected;
                }
            }

            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            if (maxA < minB || maxB < minA) {
                // console.log("polygons don't intersect!");
                return false;
            }
        }
    }
    return true;
};

export function rotatePoint(point, rotateAngle, centerX, centerY) {
    rotateAngle = rotateAngle / 180 * Math.PI;
    return {
        x: (point.x - centerX) * Math.cos(rotateAngle) - (point.y - centerY) * Math.sin(rotateAngle) + centerX,
        y: (point.x - centerX) * Math.sin(rotateAngle) + (point.y - centerY) * Math.cos(rotateAngle) + centerY,
    }
}

export function rotateRect(image) {
    let top = image.top;
    let left = image.left;
    let bottom = image.top + image.height;
    let right = image.left + image.width;
    let centerX = left + image.width / 2;
    let centerY = top + image.height / 2;
    let rotateAngle = image.rotateAngle / 180 * Math.PI;

    let bb = [
        {
            x: (left - centerX) * Math.cos(rotateAngle) - (top - centerY) * Math.sin(rotateAngle) + centerX,
            y: (left - centerX) * Math.sin(rotateAngle) + (top - centerY) * Math.cos(rotateAngle) + centerY,
        },
        {
            x: (right - centerX) * Math.cos(rotateAngle) - (top - centerY) * Math.sin(rotateAngle) + centerX,
            y: (right - centerX) * Math.sin(rotateAngle) + (top - centerY) * Math.cos(rotateAngle) + centerY,
        },
        {
            x: (right - centerX) * Math.cos(rotateAngle) - (bottom - centerY) * Math.sin(rotateAngle) + centerX,
            y: (right - centerX) * Math.sin(rotateAngle) + (bottom - centerY) * Math.cos(rotateAngle) + centerY,
        },
        {
            x: (left - centerX) * Math.cos(rotateAngle) - (bottom - centerY) * Math.sin(rotateAngle) + centerX,
            y: (left - centerX) * Math.sin(rotateAngle) + (bottom - centerY) * Math.cos(rotateAngle) + centerY,
        }
    ];

    return bb;
}

/**
 * Check if two DOM-Elements intersects each other.
 * @param a BoundingClientRect of the first element.
 * @param b BoundingClientRect of the second element.
 * @param mode Options are center, cover or touch.
 * @returns {boolean} If both elements intersects each other.
 */
export function intersects(a, b, mode, node) {
    switch (mode || 'touch') {
        case 'center': {
            const bxc = b.left + b.width / 2;
            const byc = b.top + b.height / 2;

            return bxc >= a.left &&
                bxc <= a.right &&
                byc >= a.top &&
                byc <= a.bottom;
        }
        case 'cover': {
            return b.left >= a.left &&
                b.top >= a.top &&
                b.right <= a.right &&
                b.bottom <= a.bottom;
        }
        case 'touch': {
            if (node) {
                let w = b.right - b.left - 4;
                let h = b.bottom - b.top - 4;
                let centerX = b.left + w / 2 + 2;
                let centerY = b.top + h / 2 + 2;
                let rotateAngle = node.attributes.angle.value / 180 * Math.PI;
                let newL = centerX - node.attributes.width.value / 2;
                let newR = centerX + node.attributes.width.value / 2;
                let newT = centerY - node.attributes.height.value / 2;
                let newB = centerY + node.attributes.height.value / 2;

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

                let aa = [
                    {
                        x: a.left,
                        y: a.top,
                    },
                    {
                        x: a.right,
                        y: a.top,
                    },
                    {
                        x: a.right,
                        y: a.bottom,
                    },
                    {
                        x: a.left,
                        y: a.bottom,
                    }
                ]

                return doPolygonsIntersect (aa, bb);
            }

            return a.right >= b.left &&
                a.left <= b.right &&
                a.bottom >= b.top &&
                a.top <= b.bottom;
        }
        default: {
            throw new Error(`Unkown intersection mode: ${mode}`);
        }
    }
}

/**
 * Takes a selector (or array of selectors) and returns the matched nodes.
 * @param selector The selector or an Array of selectors.
 * @returns {Array} Array of DOM-Nodes.
 */
export function selectAll(selector, doc = document) {
    if (!Array.isArray(selector)) {
        selector = [selector];
    }

    const nodes = [];
    for (let i = 0, l = selector.length; i < l; i++) {
        const item = selector[i];

        if (typeof item === 'string') {
            nodes.push(...doc.querySelectorAll(item));
        } else if (item instanceof doc.defaultView.HTMLElement) {
            nodes.push(item);
        }
    }

    return nodes;
}

/**
 * Polyfill for safari & firefox for the eventPath event property.
 * @param evt The event object.
 * @return [String] event path.
 */
export function eventPath(evt) {
    let path = evt.path || (evt.composedPath && evt.composedPath());

    if (path && path.length > 0) {
        return path;
    }

    let el = evt.target;
    for (path = [el]; (el = el.parentElement);) {
        path.push(el);
    }

    path.push(document, window);
    return path;
}

/**
 * Removes an element from an Array.
 */
export function removeElement(arr, el) {
    const index = arr.indexOf(el);

    if (~index) {
        arr.splice(index, 1);
    }
}

export function simplifyEvent(evt) {
    const tap = (evt.touches && evt.touches[0] || evt);
    return {
        tap,
        x: tap.clientX,
        y: tap.clientY,
        target: tap.target
    };
}