import Canvas2d from "../../../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/presets/canvas2d"

class Canvas extends Canvas2d {
    frames
    framesIsLoaded
    framesLoaded = 0
    isLoaded = false
    activeFrame = 0
    constructor(parent, target, frames) {
        super(parent, target)
        this.frames = []
        this.framesIsLoaded = {}
        const self = this
        frames.forEach((fr, i) => {
            const image = new Image()
            image.src = fr.frame
            this.frames.push(image)
            image.onload = function() { 
                self.framesLoaded++
                self.isLoaded = self.framesLoaded === frames.length
                self.framesIsLoaded[i] = true
                i === self.activeFrame && self.drawFrame(self.activeFrame)
            }
        })

        this.toResize(() => {
            this.drawFrame(this.activeFrame)
        })

        this.drawFrame = this.drawFrame.bind(this)
    }

    drawFrame(number) {
        if (!this.frames.length) { return }
        if ( number >= this.frames.length ) { number = this.frames.length - 1 }
        if (!this.frames[number]) { return }
        if (!this.framesIsLoaded[number]) { return }
        this.activeFrame = number
        this.context.clearRect(0, 0, this.width, this.height)
        this.context.drawImage(this.frames[this.activeFrame], 0, 0, this.width, this.height)
    }
}

export default Canvas