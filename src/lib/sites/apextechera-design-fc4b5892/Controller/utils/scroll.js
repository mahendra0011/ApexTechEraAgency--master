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
        const maxLerp = ref.getBoundingClientRect().height - window.innerHeight
        let lerped
        if (context.snapWheelTo) {
            context.snapWheelTo = false
            lerped = Math.max(Math.min(context.wheelTo, maxLerp), 0)
        } else {
            lerped = Math.max(Math.min(this.lerp(scrolled, context.wheelTo), maxLerp), 0)
            // Fix dashboard half: WhatCreate's windows->android needs to reach
            // END (maxLerp). With ease 0.04 lerped lags ~15-20px behind wheelTo,
            // so next section triggers before full android. Snap when close.
            const isWhatCreate = context.ids && context.ids[context.active] === 'whatcreate'
            if (isWhatCreate && maxLerp > 0 && context.wheelTo >= maxLerp - 1 && maxLerp - lerped < 24) {
                lerped = maxLerp
            }
        }
        if ( needDispatch ) { document.dispatchEvent(new CustomEvent('customwheel', { detail: { wheel: lerped } })) } // для передачи в хуки
        return { ref, lerped }
    },

    calcWheelTo() {
        const ref = this.getInnerRef(context.sections)
        if (!ref) { return }
        // courses (process) section: slower wheel-to-scroll ratio so the
        // sticky card deck reads clearly instead of racing past on one flick
        const intensity = context.ids && (context.ids[context.active] === 'courses' || context.ids[context.active] === 'apextechera') ? 0.4 : this.intensity
        context.wheelTo = getScrollCoordsFromElement(ref).windowTop.fromTop + context.wheel / intensity
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
