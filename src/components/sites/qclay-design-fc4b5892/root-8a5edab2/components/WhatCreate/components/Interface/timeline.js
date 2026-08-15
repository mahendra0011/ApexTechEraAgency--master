
const Timeline = (refs) => {
    const dist = refs.slider.getBoundingClientRect().width - window.innerWidth

    // const START = 0
    // const A = window.innerWidth
    // const B = A + 1
    // const C = A * 2
    // const D = C + 400
    // const E = C + 500
    // const F = C + 600
    // const G = C + 800
    // const H = C + dist / 4
    // const I = C + dist / 3.5
    // const END = dist
    const delta = (dist - window.innerWidth*2) / 7

    const START = 0
    const A = window.innerWidth
    const B = window.innerWidth + 1
    const C = window.innerWidth*2
    const D = window.innerWidth*2 + delta
    const E = window.innerWidth*2 + delta * 2
    const F = window.innerWidth*2 + delta * 3
    const G = window.innerWidth*2 + delta * 4
    const H = window.innerWidth*2 + delta * 5
    const I = window.innerWidth*2 + delta * 6
    const END = dist


    const desktopWidth = refs.mainInterface.getBoundingClientRect().width
    const mobileWidth = desktopWidth * 0.35169492
    const innerOffset = desktopWidth * 0.08474
    const sidebarWidth = desktopWidth * 0.05932


    // адаптивность зума на весь экран 
    const ratioX = 944 / 214
    const ratioY = 707 / 142
    const interfaceWidth = refs.mainInterface.getBoundingClientRect().width
    const interfaceHeight = refs.mainInterface.getBoundingClientRect().height
    const scX = ratioX * window.innerWidth / interfaceWidth
    const scY = ratioY * window.innerHeight / interfaceHeight
    const scaleFitToScreen = window.innerWidth > 576 ? Math.max(scX, scY) + 1 : Math.max(scX, scY) + 2

    const innerRatioX = 28 / 944
    const innerRatioY = 240 / 707
    const offsetX = innerRatioX * interfaceWidth
    const offsetY = innerRatioY * interfaceHeight
    const centerScaleFitX = ( offsetX * scaleFitToScreen - offsetX ) / -1
    const centerScaleFitY = window.innerWidth > 576 ? ( offsetY * scaleFitToScreen - offsetY ) / -1 : ( offsetY * scaleFitToScreen - offsetY ) / -1.02
    // 

    // адаптивность положения до зума
    const scCenterX = ratioX * window.innerWidth / 3 / interfaceWidth
    const scCenterY = ratioY * window.innerHeight / 3 / interfaceHeight
    const scaleToCenter = Math.max(scCenterX, scCenterY)

    const scaleToCenterScreen = 1
    const offsetCenterY = window.innerWidth > 576 ? innerRatioY * interfaceHeight / 3 : innerRatioY * interfaceHeight / 6
    const centerScaleX = window.innerWidth > 576 ? -window.innerWidth / 4 : 0
    const centerScaleY = ( offsetCenterY * scaleToCenter - offsetCenterY ) / -1
    //  
    
    const timelineInterface = {
        container: { x: 0, y: 0, scale: 0, $TIME: [START, A, C] },
        interface: { opacity: 0, $TIME: [START, A, B] },
        view: { x: 0, $TIME: [A, END] },
        stage1: { opacity: 0, $TIME: [C, E] },
        stage2: { opacity: 0, $TIME: [C, E] },
        stage3: { opacity: 0, $TIME: [G, END] },
        grid: { opacity: 0, $TIME: [C, I] },
        tagContainer: { opacity: 0, $TIME: [START, A] },
        tag1: { y: 0, opacity: 0, $TIME: [START, A, C] },
        tag2: { y: 0, opacity: 0, $TIME: [A, C, E] },
        tag3: { y: 0, opacity: 0, $TIME: [C, E, G, END] },
        desktopEl: { opacity: 0, $TIME: [G, H] },
        tag4: { y: 0, opacity: 0, $TIME: [G, END] },
        mode: { x: 0, width: 0, $TIME: [G, END] },
        toCenter: { x1: 0, x2: 0, x3: 0, y3: 0, $TIME: [G, END] },
        cursor: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            x3: 0,
            y3: 0,
            x4: 0,
            y4: 0,
            x5: 0,
            y5: 0,
            x6: 0,
            y6: 0,
            $TIME: [C, H, END]
        }
    }

    const timeline = [
        {
            $TIME: START,
            container: { x: centerScaleX, y: centerScaleY, scale: scaleToCenterScreen },
            interface: { opacity: 0 },
            tagContainer: { opacity: 0 },
            tag1: { y: 0, opacity: 0 }
        },
        // 
        {
            $TIME: A,
            container: { x: centerScaleFitX, y: centerScaleFitY, scale: scaleFitToScreen },
            interface: { opacity: 0 },
            view: { x: 0 },
            tagContainer: { opacity: 1 },
            tag1: { y: 0, opacity: 1 },
            tag2: { y: 100, opacity: 0 },
        },
        // 
        {
            $TIME: B,
            interface: { opacity: 1 },
        },
        // 
        {
            $TIME: C,
            container: { x: 0, y: 0, scale: 1 },
            stage1: { opacity: 1 },
            stage2: { opacity: 0 },
            grid: { opacity: 0 },
            tag1: { y: -100, opacity: 0 },
            tag2: { y: 0, opacity: 1 },
            tag3: { y: 100, opacity: 0 },
            cursor: {
                x1: -100,
                y1: -100,
                x2: window.innerWidth / 3,
                y2: -100,
                x3: window.innerWidth + 100,
                y3: -100,
                x4: window.innerWidth + 100,
                y4: window.innerHeight / 1.5,
                x5: window.innerWidth / 1.5,
                y5: window.innerHeight + 100,
                x6: window.innerWidth / 4,
                y6: window.innerHeight + 100
            }
        },
        // 
        {
            $TIME: D,
        },
        // 
        {
            $TIME: E,
            tag2: { y: -100, opacity: 0 },
            tag3: { y: 0, opacity: 1 },
            stage1: { opacity: 0 },
            stage2: { opacity: 1 },
        },
        // 
        {
            $TIME: F,
        },
        // 
        {
            $TIME: G,
            stage3: { opacity: 0 },
            tag3: { y: 0, opacity: 1 },
            tag4: { y: 100, opacity: 0 },
            mode: { x: 0, width: desktopWidth },
            desktopEl: { opacity: 1 },
            toCenter: {
                x1: 0,
                x2: 0,
                x3: 0,
                y3: 0
            }
        },
        // 
        {
            $TIME: H,
            cursor: {
                x1: window.innerWidth / 3,
                y1: window.innerHeight / 4,
                x2: window.innerWidth / 2,
                y2: window.innerHeight / 3,
                x3: window.innerWidth / 1.5,
                y3: window.innerHeight / 2.5,
                x4: window.innerWidth / 1.5,
                y4: window.innerHeight / 1.75,
                x5: window.innerWidth / 3,
                y5: window.innerHeight / 1.25,
                x6: window.innerWidth / 3.5,
                y6: window.innerHeight / 3.5
            },
            desktopEl: { opacity: 0 },
        },
        // 
        {
            $TIME: I,
            grid: { opacity: 1 },
        },
        // 
        {
            $TIME: END,
            view: { x: END - A },
            stage3: { opacity: 1 },
            tag3: { y: -100, opacity: 0 },
            tag4: { y: 0, opacity: 1 },
            mode: { x: -(desktopWidth - mobileWidth) / 2, width: mobileWidth },
            toCenter: {
                x1: (desktopWidth - mobileWidth) / 2 - sidebarWidth,
                x2: (desktopWidth - mobileWidth) / 2,
                x3: sidebarWidth / -2,
                y3: innerOffset
            },
            cursor: {
                x6: -100,
                y6: 0,
                x5: window.innerWidth / 3,
                y5: -100,
                x4: window.innerWidth + 100,
                y4: 0,
                x3: window.innerWidth + 100,
                y3: window.innerHeight / 1.5,
                x2: window.innerWidth / 1.5,
                y2: window.innerHeight + 100,
                x1: window.innerWidth / 4,
                y1: window.innerHeight + 100
            }
        }
    ]

    return { timeline, interface: timelineInterface  }
}

export { Timeline }