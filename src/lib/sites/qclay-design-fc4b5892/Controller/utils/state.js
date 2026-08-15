import { context } from "./context"

export const state = {
    duration: 0,
    externalDuration: 0,
    externalDelay: 0,

    set({ duration, externalDuration, externalDelay }) {
        duration && (this.duration = duration || 1000)
        duration && (this.externalDuration = externalDuration || 1000)
        duration && (this.externalDelay = externalDelay || 100)
    },
    classes: {
        PREV: '-prev',
        ACTIVE: '-active',
        NEXT: '-next',
        GLOBAL: '-global-',

        GLOBAL_FROM_NEXT: '-global-from-next',
        GLOBAL_FROM_PREV: '-global-from-prev',

        TO_ACTIVE: '-to-active',
        TO_NEXT: '-to-next',
        TO_PREV: '-to-prev',

        FROM_ACTIVE: '-from-active',
        FROM_NEXT: '-from-next',
        FROM_PREV: '-from-prev',

        EXTERNAL_CHANGING: '-external-changing'
    },
    externalChangingClass(isExternalChanging) {
        return isExternalChanging ? this.classes.EXTERNAL_CHANGING : ''
    },
    globalClassName(active) {
        return context.ids && (this.classes.GLOBAL + context.ids[active]) || ''
    },
    className(active, index) {
        if ( active > index ) { return this.classes.PREV } 
        else if ( active === index ) { return this.classes.ACTIVE }
        else if ( active < index ) { return this.classes.NEXT }
    },
    validActive(newActive) {
        if ( newActive >= 0 && newActive < context.ids.length ) { return true }
        return false
    },
    resetPositions(sections) {
        if ( !sections ) { return }
        sections.forEach(_ => {
            const pos = { value: null }
            if ( _.pos === this.classes.PREV ) {
                pos.value = -2
            } else
            if ( _.pos === this.classes.ACTIVE ) {
                pos.value = -1
            } else
            if ( _.pos === this.classes.NEXT ) {
                pos.value = 0
            }
            _.ref.style.transform = `translate3d(0, ${pos.value * 100}%, 0)`
        })
    },
    getSections(childrenArray, sectionsRef, active) {
        return childrenArray.map((child, index) => ({ 
            pos: this.className(active, index), 
            ref: sectionsRef.current[index],
            id: context.ids[index]
        }))
    }
}