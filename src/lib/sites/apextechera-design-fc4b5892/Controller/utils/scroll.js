import { getScrollCoordsFromElement } from "../../Animator/js/coords/index"
import { context } from "./context"
import { state } from "./state"

export const scroll = {
    ease: .04,
    easeMobile: .5,
    intensity: .1,
    class: 'section-inner',

    ready(sections) {
        if ( !sections ) { return false }
        return true
    },

    // getBoundingClientRect() forces a synchronous layout reflow. This used
    // to run on EVERY animation frame (renderTranslateInterpolation ->
    // calcTranslate), which is a big cost on Android combined with the 3D
    // scene competing for the same thread. The height of a section only
    // actually changes on resize/orientation-change, so we cache it per
    // element and only re-measure when the window size changes.
    _maxLerpCache: new WeakMap(),
    _lastViewport: { w: 0, h: 0 },
    getMaxLerp(ref) {
        const w = window.innerWidth, h = window.innerHeight
        if (this._lastViewport.w !== w || this._lastViewport.h !== h) {
            this._lastViewport = { w, h }
            this._maxLerpCache = new WeakMap()
        }
        let cached = this._maxLerpCache.get(ref)
        if (cached === undefined) {
            cached = ref.getBoundingClientRect().height - window.innerHeight
            this._maxLerpCache.set(ref, cached)
        }
        return cached
    },

    calcTranslate(sections, wheel, needDispatch = true) {
        const ref = this.getInnerRef(sections)
        if (!ref || context.wheelTo === 0) { return { ref: null, lerped: 0 } }
        const scrolled = getScrollCoordsFromElement(ref).windowTop.fromTop
        const maxLerp = this.getMaxLerp(ref)
        let lerped
        if (context.snapWheelTo) {
            context.snapWheelTo = false
            lerped = Math.max(Math.min(context.wheelTo, maxLerp), 0)
        } else {
            lerped = Math.max(Math.min(this.lerp(scrolled, context.wheelTo), maxLerp), 0)
            const isWhatCreate = context.ids && context.ids[context.active] === 'whatcreate'
            if (isWhatCreate && maxLerp > 0 && context.wheelTo >= maxLerp - 1 && maxLerp - lerped < 24) {
                lerped = maxLerp
            }
        }
        if ( needDispatch ) { document.dispatchEvent(new CustomEvent('customwheel', { detail: { wheel: lerped } })) }
        return { ref, lerped }
    },

    calcWheelTo() {
        const ref = this.getInnerRef(context.sections)
        if (!ref) { return }
        const isWhatCreateMobile = context.ids && context.ids[context.active] === 'whatcreate' && typeof window !== 'undefined' && window.innerWidth <= 576
        const intensity = context.ids && (context.ids[context.active] === 'courses' || context.ids[context.active] === 'apextechera' || isWhatCreateMobile) ? 0.5 : this.intensity
        context.wheelTo = getScrollCoordsFromElement(ref).windowTop.fromTop + context.wheel / intensity
    },

    resetWheelTo() {
        context.wheelTo = 0
    },

    renderTranslateInterpolation() {
        const { ref, lerped } = this.calcTranslate(context.sections, context.wheel)
        if (!ref) { return }
        ref.style.transform = `translate3d(0, ${lerped * -1}px, 0)`
    },

    resetTranslate(sections) {
        if ( !context.externalChange ) { return }
        if ( !sections ) { return }
        if ( sections.length < 1 ) { return }
        this.calcTranslate(sections, 0)

        const refsPrev = sections.filter(_ => _.pos === state.classes.PREV)
        if ( refsPrev.length ) {
            refsPrev.forEach( _ => {
                const inner = _.ref.querySelector(`.${this.class}`)
                const srcolledBottom = inner.getBoundingClientRect().height - window.innerHeight
                inner.style.transform = `translate3d(0, ${srcolledBottom * -1}px, 0)`
                document.dispatchEvent(new CustomEvent('triggerwheel', { detail: { id: _.id, wheel: srcolledBottom } }))
                _.ref.style.transform = `translate3d(0, -200vh, 0)`
            } )
        }

        const refsActive = sections.filter(_ => _.pos === state.classes.ACTIVE)
        if ( refsActive.length ) {
            refsActive.forEach( _ => {
                const inner = _.ref.querySelector(`.${this.class}`)
                inner.style.transform = `translate3d(0, ${0}px, 0)`
                document.dispatchEvent(new CustomEvent('triggerwheel', { detail: { id: _.id, wheel: 0 } }))
            } )
        }
        const refsNext = sections.filter(_ => _.pos === state.classes.NEXT)
        if ( refsNext.length ) {
            refsNext.forEach( _ => {
                const inner = _.ref.querySelector(`.${this.class}`)
                inner.style.transform = `translate3d(0, ${0}px, 0)`
                document.dispatchEvent(new CustomEvent('triggerwheel', { detail: { id: _.id, wheel: 0 } }))
                _.ref.style.transform = `translate3d(0, 0vh, 0)`
            } )
        }
    },

    getInnerRef(sections) {
        const innerRef = this.getRef(sections)
        if (!innerRef) { return null }
        return innerRef.querySelector(`.${this.class}`)
    },

    getRef(sections) {
        if (!sections) { return null }
        return sections.filter(_ => _.pos === state.classes.ACTIVE)[0].ref
    },

    lerp(start, end) {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 576
        const ease = isMobile ? this.easeMobile : this.ease
        return start + (end - start) * ease
    }
}
