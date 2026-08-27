import { getElementCoords } from "../../../../Animator/js/coords/index"

export const horizontalScroll = ({ target, wheel, speed, minWidth = 0 } = {}) => {
    if (window.innerWidth <= minWidth) { 
        target.style.cssText = ``
        return 
    }
    const speedWithDefaults = typeof speed === 'function' ? (speed() || 1) : (speed || 1)
    // Fix: dashboard half transition (windows->android) was stuck at half
    // because cached width was stale after images loaded. Measure fresh
    // width every tick so parentHeight = dist + winH stays correct and
    // timeline reaches END (full android). Cost is negligible vs broken UI.
    const width = getElementCoords(target).width
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
