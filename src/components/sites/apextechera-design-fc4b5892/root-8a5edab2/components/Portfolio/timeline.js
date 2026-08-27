const Timeline = (refs) => {

    // fixme: awfull
    const prev = refs.fewPeople.getBoundingClientRect().height + refs.tar.getBoundingClientRect().height / 2 + window.innerHeight / 2

    const A = prev
    const C = refs.line.getBoundingClientRect().top + prev
    const CA = C + C / 1.05 - prev
    const D = refs.line.getBoundingClientRect().top + refs.line.getBoundingClientRect().height / 2 + prev
    const E = refs.line.getBoundingClientRect().bottom + prev

    const timelineInterface = {
        svg: {
            offset: 0,
            $TIME: [A, CA]
        },
        arm: {
            scale: 0,
            $TIME: [A, C]
        },
        line: {
            width: 0,
            height: 0,
            $TIME: [C, D, E]
        }
    }

    const timeline = [
        {
            $TIME: A,
            svg: {
                offset: 2500,
            },
            arm: {
                scale: 1,
            },
        },
        {
            $TIME: C,
            line: {
                width: window.innerWidth > 576 ? 1 : .5,
                height: 0,
            },
            arm: {
                scale: 0,
            },
        },
        {
            $TIME: CA,
            svg: {
                offset: 0,
            },
        },
        {
            $TIME: D,
            line: {
                width: 1,
                height: 100,
            }
        },
        {
            $TIME: E,
            line: {
                width: window.innerWidth,
                height: 100,
            }
        }
    ]

    return { timeline, interface: timelineInterface }
}

export { Timeline }