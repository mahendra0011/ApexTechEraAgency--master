import { getElementCoords, getScrollCoordsFromElement } from "../../Animator/js/coords/index"
import { context } from "./context"
import { state } from "./state"

export const scroll = {
    ease: .04,
    easeMobile: 1,
    intensity: .1,
    class: 'section-inner',
    // Frame-rate independent easing bookkeeping: the lerp factor is expressed
    // per 60fps frame and then converted using the real frame delta, so 90/120Hz
    // Android devices feel exactly the same as desktop instead of "snappier",
    // and a 30fps stutter doesn't make the scroll crawl.
    lastTime: 0,
    // Skip dispatching `customwheel` (which wakes EVERY useTransform handler
    // on the page) unless the value actually moved — was previously fired on
    // every frame even while perfectly still.
    lastDispatched: null,

    ready(sections) {
        if ( !sections ) { return false }
        return true
    },

    calcTranslate(sections, wheel, needDispatch = true, time) {
        const ref = this.getInnerRef(sections)
        if (!ref || context.wheelTo === 0) { return { ref: null, lerped: 0 } }
        // ONE layout read per frame (getElementCoords now uses a single
        // getBoundingClientRect internally) instead of 7+ reads before.
        const coords = getElementCoords(ref)
        const scrolled = window.scrollY - coords.top
        const maxLerp = coords.height - window.innerHeight
        let lerped
        if (context.snapWheelTo) {
            context.snapWheelTo = false
            lerped = Math.max(Math.min(context.wheelTo, maxLerp), 0)
        } else {
            lerped = Math.max(Math.min(this.lerp(scrolled, context.wheelTo, time), maxLerp), 0)
            // Fix dashboard half: WhatCreate's windows->android needs to reach
            // END (maxLerp). With ease 0.04 lerped lags ~15-20px behind wheelTo,
            // so next section triggers before full android. Snap when close.
            const isWhatCreate = context.ids && context.ids[context.active] === 'whatcreate'
            if (isWhatCreate && maxLerp > 0 && context.wheelTo >= maxLerp - 1 && maxLerp - lerped < 24) {
                lerped = maxLerp
            }
        }
        if ( needDispatch && (this.lastDispatched === null || Math.abs(lerped - this.lastDispatched) > 0.5) ) {
            this.lastDispatched = lerped
            document.dispatchEvent(new CustomEvent('customwheel', { detail: { wheel: lerped } })) // для передачи в хуки
        }
        return { ref, lerped }
    },

    calcWheelTo() {
        const ref = this.getInnerRef(context.sections)
        if (!ref) { return }
        // courses (process) & whatcreate (mobile) section: slower wheel-to-scroll ratio so the
        // transitions and cards read clearly and zoom slowly instead of racing past on one flick
        const isWhatCreateMobile = context.ids && context.ids[context.active] === 'whatcreate' && typeof window !== 'undefined' && window.innerWidth <= 576
        const intensity = context.ids && (context.ids[context.active] === 'courses' || context.ids[context.active] === 'apextechera' || isWhatCreateMobile) ? 0.5 : this.intensity
        context.wheelTo = getScrollCoordsFromElement(ref).windowTop.fromTop + context.wheel / intensity
    },

    resetWheelTo() {
        context.wheelTo = 0
        this.lastDispatched = null
    },

    renderTranslateInterpolation(time) {
        const { ref, lerped } = this.calcTranslate(context.sections, context.wheel, true, time)
        if (!ref) { return }
        // console.log(lerped)
        const transform = `translate3d(0, ${lerped * -1}px, 0)`
        if (ref.dataset.lastTransform === transform) { return } // no-op when unchanged
        ref.dataset.lastTransform = transform
        ref.style.transform = transform
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

    lerp(start, end, time) {
        // const ease = window.innerWidth < 576 ? this.easeMobile : this.ease
        // Convert the per-60fps-frame ease into a frame-rate independent factor:
        // 60Hz => identical to the old behaviour, 120Hz => same visual speed
        // (previously twice as fast), 30Hz stutter => still catches up smoothly.
        let factor = this.ease
        if (typeof time === 'number' && typeof this.lastTime === 'number' && this.lastTime) {
            const dt = Math.min(Math.max(time - this.lastTime, 8), 64) // clamp hiccups
            factor = 1 - Math.pow(1 - this.ease, dt / (1000 / 60))
        }
        if (typeof time === 'number') { this.lastTime = time }
        return start + (end - start) * factor
    }
}
