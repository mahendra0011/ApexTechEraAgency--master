import { getElementCoords } from "../../../../Animator/js/coords/index"

export const horizontalScroll = ({ target, wheel, speed, minWidth = 0 } = {}) => {
    if (window.innerWidth <= minWidth) { 
        target.style.cssText = ``
        return 
    }
    const speedWithDefaults = typeof speed === 'function' ? (speed() || 1) : (speed || 1)
    const parentHeight = getElementCoords(target).width / speedWithDefaults
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
    parent.style.cssText = `
        position: relative;
        height: ${(getElementCoords(target).width / speedWithDefaults - offset)}px;
    `
}
