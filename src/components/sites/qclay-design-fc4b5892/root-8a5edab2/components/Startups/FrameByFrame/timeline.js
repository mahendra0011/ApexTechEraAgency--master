import { frames } from "./frames"

const Timeline = (refs) => {
    const dist = refs.scr.getBoundingClientRect().height - window.innerHeight
    const START = 0
    const B = 100
    const C = dist * 3/4
    const D = dist * 9/10
    const END = dist

    const timelineInterface = {
        canvas: {
            frame: 0,
            $TIME: [B, D]
        },
        parent: {
            width: 0,
            height: 0,
            y: 0,
            opacity: 0,
            $TIME: [B, C]
        },
        fill: {
            opacity: 0,
            $TIME: [B, C]
        },
        logo: {
            y: 0,
            scale: 0,
            $TIME: [C, END]
        },
        blur: {
            size: 0,
            $TIME: [D, END]
        }
    }

    const timeline = [
        {
            $TIME: B,
            canvas: {
                frame: 0,
            },
            parent: {
                width: calcCanvasWidth(),
                height: calcCanvasHeight(),
                y: calcCanvasBottom(),
                opacity: 1,
            },
            fill: {
                opacity: 0,
            },
        },
        {
            $TIME: C,
            parent: {
                width: 100,
                height: 100,
                opacity: 1,
                y: 0,
            },
            fill: {
                opacity: 1,
            },
            logo: {
                y: 0,
                scale: 1,
            }
        },
        {
            $TIME: D,
            canvas: {
                frame: frames.length - 1,
            },
            blur: {
                size: 0,
            }
        },
        {
            $TIME: END,
            logo: {
                y: 50,
                scale: 3,
            },
            blur: {
                size: calcBlurScale(),
            }
        }
    ]

    function calcCanvasWidth() {
        return window.innerWidth > 576 ? 460 * 100 / window.innerWidth : 300 * 100 / window.innerWidth
    }
    function calcCanvasHeight() {
        return window.innerWidth > 576 ? 520 * 100 / window.innerHeight : 350 * 100 / window.innerHeight
    }
    function calcCanvasBottom() {
        return window.innerWidth > 576 ? 123 * 100 / window.innerHeight : 230 * 100 / window.innerHeight
    }

    function calcBlurScale() {
        if ( window.innerWidth / window.innerHeight > 1 ) {
            return window.innerWidth * 6
        }
        return window.innerHeight * 6
    }

    return { timeline, interface: timelineInterface }
}

export { Timeline }