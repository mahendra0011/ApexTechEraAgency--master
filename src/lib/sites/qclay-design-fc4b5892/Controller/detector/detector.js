import DetectWheel from "./detectWheel"
import DetectSwipe from "./detectSwipe"

class Detector {
  swipe
  scroll
  keyboard

  callback

  constructor(dom, callback) {
    if (!dom) { console.error('[Detector]: dom element is required'); return; }
    this.callback = callback || ( () => {} )
    this.scroll = new DetectWheel(dom, this.controlScroll.bind(this));
    this.swipe = new DetectSwipe(dom, this.controlScroll.bind(this));
  }

  controlScroll(props) {
    this.callback(props)
  }

  unmount() {
    this.scroll.unsubscribe()
    this.swipe.destroy()
  }
}

export default Detector
