const Timeline = (refs) => {
    const dist = refs.designers.getBoundingClientRect().height - window.innerHeight

    const START = 0
    const START_B = dist / 12
    const B = dist / 4.5
    const C = dist - dist / 5
    const END = dist

    const timelineInterface = {
        avatars: {
            width: 0,
            opacity: 0,
            $TIME: [START, B]
        },
        avatarsInner: {
            y: 0,
            scale: 0,
            opacity: 0,
            $TIME: [B, C]
        },
        text: {
            y: 0,
            scale: 0,
            opacity: 0,
            $TIME: [B, C]
        },
        image: {
            y1: 0,
            r1: 0,
            y2: 0,
            r2: 0,
            y3: 0,
            r3: 0,
            $TIME: [B, END]
        },
        circle: {
            x: 0,
            scale: 0,
            $TIME: [C, END]
        }
    }

    function getCircleTranslate() {
        if ( window.innerWidth / window.innerHeight > 1 ) {
            return window.innerWidth * 2
        }
        return window.innerHeight * 2
    }

    const timeline = [
        {
            $TIME: START,
            avatars: {
                width: 0,
                opacity: 0,
            },
        },
        {
            $TIME: B,
            avatarsInner: {
                y: 0,
                scale: 1,
                opacity: 1,
            },
            text: {
                y: 100,
                scale: .5,
                opacity: 0,
            },
            image: {
                y1: 0,
                r1: 0,
                y2: 0,
                r2: 0,
                y3: 0,
                r3: 0,
            },
            avatars: {
                width: parseInt(getComputedStyle(refs.avatars).getPropertyValue('--width')),
                opacity: 1,
            },
        },
        {
            $TIME: C,
            avatarsInner: {
                y: window.innerWidth > 576 ? -100 : 0,
                scale: window.innerWidth > 576 ? .5 : 1,
                opacity: window.innerWidth > 576 ? 0 : 1,
            },
            text: {
                y: window.innerWidth > 576 ? 0 : 100,
                scale: window.innerWidth > 576 ? 1 : .5,
                opacity: window.innerWidth > 576 ? 1 : 0,
            },
            circle: {
                x: getCircleTranslate(),
                scale: 1
            }
        },
        {
            $TIME: END,
            image: {
                y1: -window.innerHeight * 6,
                r1: 60,
                y2: -window.innerHeight * 3,
                r2: -50,
                y3: -window.innerHeight * 3.5,
                r3: 40,
            },
            circle: {
                x: 0,
                scale: 4
            }
        }
    ]


    return { timeline, interface: timelineInterface }
}

export { Timeline }