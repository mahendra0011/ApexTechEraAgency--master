import Canvas2d from "../../../../../../../lib/sites/apextechera-design-fc4b5892/Animator/js/presets/canvas2d"

class Canvas extends Canvas2d {
    frames
    framesIsLoaded
    framesLoaded = 0
    isLoaded = false
    activeFrame = -1
    lastFrame = 0
    isDestroyed = false
    constructor(parent, target, frames) {
        super(parent, target)
        this.frames = []
        this.framesIsLoaded = {}
        const self = this
        frames.forEach((fr, i) => {
            const image = new Image()
            image.decoding = 'async'
            image.src = fr.frame
            this.frames.push(image)
            image.onload = function() { 
                if (self.isDestroyed) { return }
                self.framesLoaded++
                self.isLoaded = self.framesLoaded === frames.length
                self.framesIsLoaded[i] = true
                if (i === self.lastFrame) { self.drawFrame(self.lastFrame) }
            }
        })

        this.toResize(() => {
            this.activeFrame = -1
            this.drawFrame(this.lastFrame, true)
        })

        this.drawFrame = this.drawFrame.bind(this)
    }

    drawFrame(number, force = false) {
        if (!this.frames.length) { return }
        if ( number >= this.frames.length ) { number = this.frames.length - 1 }
        if (!this.frames[number]) { return }
        this.lastFrame = number
        if (number === this.activeFrame && !force) { return }
        if (!this.framesIsLoaded[number]) { return }
        this.activeFrame = number
        this.context.clearRect(0, 0, this.width, this.height)
        this.context.drawImage(this.frames[this.activeFrame], 0, 0, this.width, this.height)
    }

    destroy() {
        this.isDestroyed = true
        this.stopRender()
        this.frames.forEach(image => {
            image.onload = null
            image.src = ''
        })
        this.frames = []
        this.framesIsLoaded = {}
        super.destroy()
    }
}

export default Canvas