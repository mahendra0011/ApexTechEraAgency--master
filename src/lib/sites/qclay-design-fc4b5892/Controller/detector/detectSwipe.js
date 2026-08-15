class DetectSwipe {
    #swipe_det = {
        sY: 0,
        eY: 0
    }
    prevY = 0
    #element    = null
    cb
    isRendering = false
    deltaY
    deltaYAfter
    minDelta = 30

    constructor(element, callbalck) {
        this.cb = callbalck
        this.#element = element
        this.#start()
        this.useCallback = this.useCallback.bind(this)
    }

    #start() {
        this.#element.addEventListener('touchstart', this.#touchstart.bind(this), false)
        this.#element.addEventListener('touchmove', this.#touchmove.bind(this), false)
        this.#element.addEventListener('touchend', this.#touchend.bind(this), false)
    }

    destroy() {
        this.#element.removeEventListener('touchstart', this.#touchstart, false)
        this.#element.removeEventListener('touchmove', this.#touchmove, false)
        this.#element.removeEventListener('touchend', this.#touchend, false)
    }

    #touchstart(e) {
        const t = e.touches[0]
        this.#swipe_det.sY = t.screenY
        this.prevY = this.#swipe_det.sY
        this.#swipe_det.eY = this.#swipe_det.sY
    }
    #touchmove(e) {
        this.isRendering = false
        // if (this.deltaY < this.minDelta) { return }

        const t = e.touches[0]
        this.prevY = this.#swipe_det.eY
        this.#swipe_det.eY = t.screenY


        this.deltaY = this.#swipe_det.sY - this.#swipe_det.eY
        const prevDeltaY = this.#swipe_det.sY - this.prevY

        if ( Math.abs(prevDeltaY) > Math.abs(this.deltaY) ) {
            this.#swipe_det.sY = this.prevY
        }

        Math.abs(this.deltaY) > this.minDelta && this.useCallback(this.deltaY)
    }
    #touchend(e) {
        if (Math.abs(this.deltaY) < this.minDelta) { return }
        this.deltaY = Math.min(Math.abs(this.deltaY), 200) * Math.sign(this.deltaY)

        const self = this
        self.isRendering = true
        this.deltaYAfter = this.deltaY * 5
        self.deltaY = 0

        // console.log('delta', this.deltaY, this.minDelta * 1.5)
        if (Math.abs(this.deltaY) < 300) {
            // console.log('--> AFTER')
            requestAnimationFrame(function render() {
                self.deltaYAfter = self.lerp(self.deltaYAfter, 0, 0.05)
                self.useCallback(self.deltaYAfter)
                Math.abs(self.deltaYAfter) <= 0.1 && (self.isRendering = false)
                if (self.isRendering) {
                    requestAnimationFrame(render)
                }
            })
        }
    }

    useCallback(deltaY) {
        if (typeof this.cb === 'function') { 
            if (deltaY) {
                this.cb({
                    dir: deltaY / Math.abs(deltaY),
                    wheel: deltaY / 13
                })
            }
        }
    }

    lerp(start, end, t = 0.075) {
        return start + (end - start) * t
    }
  }

  export default DetectSwipe