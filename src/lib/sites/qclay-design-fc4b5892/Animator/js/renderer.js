import { getElementCoords } from "./coords/index"

const renderer = {
    handlers: [],
    mouse: null,
    isRendering: false,

    subscribeMouse() {
        document.addEventListener('mousemove', mouseListener)
        document.addEventListener('mouseenter', mouseListener)
    },

    unsubscribeMouse() {
        document.removeEventListener('mousemove', mouseListener)
        document.removeEventListener('mouseenter', mouseListener)
    },

    stopRender() {
        this.isRendering = false
    },

    startRender() {
        this.isRendering = true
        requestAnimationFrame(function render(time) {
            if (!this.isRendering) { return }
            this.handlers.forEach((item) => item.rendering(time))
            requestAnimationFrame(render.bind(this))
        }.bind(this))
    },
}
const mouseListener = function(event) {
    this.mouse = event
    document.dispatchEvent(new CustomEvent("mouseupdate", {
        bubbles: true, 
        detail: { ...getMouseCoords() } 
    }))
}.bind(renderer)


const setToRender = function({ label, handler, props, context, delay, breakpoint, onBreakpoint }) {
    const newLabel = label || this.handlers.length
    if (!handler) { console.error(`Renderer: Handler for render is required. Handler label "${newLabel}"`); return }
    if (typeof handler !== "function") { console.error(`Renderer: Invalid type of handler, required Function. Handler label "${newLabel}"`); return }
    if (breakpoint && typeof breakpoint !== "number") { console.error(`Renderer: Invalid type of breakpoint, required Number. Handler label "${newLabel}"`); return }
    if (onBreakpoint && typeof onBreakpoint !== "function") { console.error(`Renderer: Invalid type of onBreakpoint, required Function. Handler label "${newLabel}"`); return }

    this.handlers.push({
        handler,
        context,
        props,
        label: newLabel,
        delay: delay || 0,
        startTime: performance.now(),
        breakpoint: breakpoint || 0,
        onBreakpoint,
        readyForBreakpointCallback: true,
        rendering(time) {
            if (time - this.startTime >= this.delay) {
                this.startTime = performance.now()
                if (window.innerWidth <= this.breakpoint) { 
                    if (this.readyForBreakpointCallback && this.onBreakpoint) {
                        this.onBreakpoint() 
                        this.readyForBreakpointCallback = false
                    }
                    return 
                }
                this.handler.apply(this.context, [...this.props || [], time])
                this.readyForBreakpointCallback = true
            }
        },
    })
}.bind(renderer)

const removeFromRender = function(label = 'removeLastFromRender') {
    let isRequested = 0
    if (label === 'removeLastFromRender') {this.handlers = this.handlers.slice(0, this.handlers.length - 1); return }
    this.handlers = this.handlers.filter((item) => {
        if (item.label !== label) {
            return true
        }
        isRequested++
        return false
    })
    if (isRequested === 0) { console.warn(`Renderer: No handlers with label "${label}" in rendering`) }
}.bind(renderer)

const getRendering = function() {
    return this.handlers
}.bind(renderer)

const getMouseCoords = function() {
    if (this.mouse === null) { 
        return {
            document: {
                x: null,
                y: null,
            },
            window: {
                x: null,
                y: null
            }
        }
    }
    return {
        document: {
            x: this.mouse.pageX,
            y: this.mouse.pageY
        },
        window: {
            x: this.mouse.clientX,
            y: this.mouse.clientY,
        }
    }
}.bind(renderer)

const getMouseCoordsFromElement = function(domElement) {
    const domElementCoords = getElementCoords(domElement)
    const mouseCoords = getMouseCoords().document

    if (!domElementCoords.top || !domElementCoords.bottom ||
        !domElementCoords.left || !domElementCoords.right ||
        !domElementCoords.height || !domElementCoords.width ||
        !mouseCoords.x || !mouseCoords.y) { 
        console.error("getMouseCoordsFromElement: No domElement found")
        return {
            top: {
                left: {
                    x: null,
                    y: null,
                },
                right: {
                    x: null,
                    y: null,
                }
            },
            center: {
                center: {
                    x: null,
                    y: null,
                }
            },
            bottom: {
                left: {
                    x: null,
                    y: null,
                },
                right: {
                    x: null,
                    y: null,
                }
            }
        } 
    }
    return {
        top: {
            left: {
                x: mouseCoords.x - (domElementCoords.left),
                y: mouseCoords.y - (domElementCoords.top),
            },
            right: {
                x: mouseCoords.x - (domElementCoords.left + domElementCoords.width),
                y: mouseCoords.y - (domElementCoords.top),
            }
        },
        center: {
            center: {
                x: mouseCoords.x - (domElementCoords.left + domElementCoords.width / 2),
                y: mouseCoords.y - (domElementCoords.top + domElementCoords.height / 2),
            }
        },
        bottom: {
            left: {
                x: mouseCoords.x - (domElementCoords.left),
                y: mouseCoords.y - (domElementCoords.bottom),
            },
            right: {
                x: mouseCoords.x - (domElementCoords.left + domElementCoords.width),
                y: mouseCoords.y - (domElementCoords.bottom),
            }
        }
    }
}.bind(renderer)

const isElementHovered = function(domElement, additionalRadius = 0) {
    const domElementCoords = getElementCoords(domElement)
    const mouseCoords = getMouseCoords().document
    if (!domElementCoords.top || !domElementCoords.bottom ||
        !domElementCoords.left || !domElementCoords.right ||
        !domElementCoords.height || !domElementCoords.width ||
        !mouseCoords.x || !mouseCoords.y) { 
        // console.error("isElementHovered: No domElement found")
        return false 
    }
    return (domElementCoords.top - additionalRadius < mouseCoords.y && domElementCoords.bottom + additionalRadius > mouseCoords.y && domElementCoords.left - additionalRadius < mouseCoords.x && domElementCoords.right + additionalRadius > mouseCoords.x)
}.bind(renderer)


export default renderer
export { 
    setToRender, removeFromRender, getRendering,
    getMouseCoords, 
    getMouseCoordsFromElement,
    isElementHovered
}
