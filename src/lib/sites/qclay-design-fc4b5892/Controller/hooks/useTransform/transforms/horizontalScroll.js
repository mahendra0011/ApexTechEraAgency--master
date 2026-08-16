import { getElementCoords } from "../../../../Animator/js/coords/index"

export const horizontalScroll = ({ target, wheel, speed, minWidth = 0 } = {}) => {
    if (window.innerWidth <= minWidth) { 
        target.style.cssText = ``
        return 
    }
    const speedWithDefaults = typeof speed === 'function' ? (speed() || 1) : (speed || 1)
    // Reading getBoundingClientRect() on every scroll tick forces a
    // synchronous layout reflow right in the middle of this frame's other
    // style writes (layout thrashing), which is what made this section's
    // entrance feel janky/stuttery. The target's width only changes on
    // window resize, so cache it there (see horizontalScrollResize) and
    // reuse it here instead of re-measuring every single tick.
    const cachedWidth = target._apexCachedWidth
    const width = typeof cachedWidth === 'number' ? cachedWidth : getElementCoords(target).width
    const parentHeight = width / speedWithDefaults
    const left = Math.min(wheel * speedWithDefaults, parentHeight)
    target.style.cssText = `
        position: absolute;
        transform: translate3d(${-1 * left}px, ${wheel}px, 0);    
    `
}

export const horizontalScrollResize = ({ parent, target, speed, minWidth = 0 }) => {
    if (window.innerWidth <= minWidth) { 
        parent.style.cssText = ``
        return 
    }
    const speedWithDefaults = typeof speed === 'function' ? (speed() || 1) : (speed || 1)
    const offset = window.innerWidth / speedWithDefaults - window.innerHeight
    const width = getElementCoords(target).width
    target._apexCachedWidth = width
    parent.style.cssText = `
        position: relative;
        height: ${(width / speedWithDefaults - offset)}px;
    `
}
