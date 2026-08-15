import { getScrollCoordsFromElement } from "../../Animator/js/coords/index"
import { context } from "./context"
import { state } from "./state"

export const scroll = {
    ease: .04,
    easeMobile: 1,
    intensity: .1,
    class: 'section-inner',

    ready(sections) {
        if ( !sections ) { return false }
        return true
    },

    calcTranslate(sections, wheel, needDispatch = true) {
        const ref = this.getInnerRef(sections)
        if (!ref || context.wheelTo === 0) { return { ref: null, lerped: 0 } }
        const scrolled = getScrollCoordsFromElement(ref).windowTop.fromTop
        const lerped = Math.max(Math.min(this.lerp(scrolled, context.wheelTo), ref.getBoundingClientRect().height - window.innerHeight), 0)
        if ( needDispatch ) { document.dispatchEvent(new CustomEvent('customwheel', { detail: { wheel: lerped } })) } // для передачи в хуки
        return { ref, lerped }
    },

    calcWheelTo() {
        const ref = this.getInnerRef(context.sections)
        if (!ref) { return }
        context.wheelTo = getScrollCoordsFromElement(ref).windowTop.fromTop + context.wheel / this.intensity
    },

    resetWheelTo() {
        context.wheelTo = 0
    },

    renderTranslateInterpolation() {
        const { ref, lerped } = this.calcTranslate(context.sections, context.wheel)
        if (!ref) { return }
        // console.log(lerped)
        ref.style.transform = `translate3d(0, ${lerped * -1}px, 0)`
    },

    // translate(sections, wheel) {
    //     const { ref, lerped } = this.calcTranslate(sections, wheel)
    //     ref.style.transform = `translate3d(0, ${lerped * -1}px, 0)`
    // },

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
        // const ease = window.innerWidth < 576 ? this.easeMobile : this.ease
        return start + (end - start) * this.ease
    }
}