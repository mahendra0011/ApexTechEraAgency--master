class DetectWheel {
    element
    cb

    constructor(element, cb) {
        this.element = element
        this.cb = cb
        this.subscribe()
    }

    subscribe() {
        this.element.addEventListener('wheel', this.listener)
    }

    unsubscribe() {
        this.element.removeEventListener('wheel', this.listener)
    }

    listener(e) {
        // console.log(e.deltaY, e.wheelDeltaY)
        // if (Math.abs(e.deltaY) < 50) { return }
        if (typeof this.cb === 'function') { 
            if (e.deltaY) {
                this.cb({
                    dir: e.deltaY / Math.abs(e.deltaY),
                    wheel: e.deltaY
                })
            }
        }
        document.dispatchEvent(new CustomEvent("scroll", {
            bubbles: true, 
            detail: {
                direction: e.deltaY / Math.abs(e.deltaY),
            }
        }))
    }
    listener = this.listener.bind(this)
}

export default DetectWheel