import { getScrollCoordsFromElement } from "../../Animator/js/coords/index"
import Tween from "../../Animator/js/tween/tween"
import { state } from "./state"
import { scroll } from "./scroll"
import { context } from "./context"

export const swipe = {
    timeout: [],
    pos: {
        TOP: 'top',
        MIDDLE: 'middle',
        BOTTOM: 'bottom',
        TOPBOTTOM: 'topbottom'
    },
    swipe(prevsecs, sections, afterComplete) {
        if ( !sections ) { return } // сработает на первый рендер на манунт, пока не инициализировано
        if ( !prevsecs ) { return } // сработает на второй ререндер сразу после маунта

        const secsToAnimate = sections.map((_, i) => {
            if ( _.pos !== prevsecs[i].pos ) {
                const move = { dir: null, from: null }

                if ( _.pos === state.classes.ACTIVE ) {
                    if ( prevsecs[i].pos === state.classes.NEXT ) {
                        move.dir = -1 // вверх
                    } else {
                        move.dir = 1
                    }
                } else
                if ( prevsecs[i].pos === state.classes.ACTIVE ) {
                    if ( _.pos === state.classes.PREV ) {
                        move.dir = -1 // вверх
                    } else {
                        move.dir = 1
                    }
                }

                if ( prevsecs[i].pos === state.classes.PREV ) {
                    move.from = -2
                } else
                if ( prevsecs[i].pos === state.classes.ACTIVE ) {
                    move.from = -1
                } else
                if ( prevsecs[i].pos === state.classes.NEXT ) {
                    move.from = 0
                }

                return {
                    ref: _.ref,
                    dir: move.dir,
                    from: move.from
                }
            }
            return null
        }).filter(_ => !!_)

        if ( secsToAnimate.length === 0 ) { return } // сработает при ререндере, но когда мы не сместились со страницы
        this.tween(secsToAnimate, afterComplete)
    },
    getInnerPos(sections) {
        const innerRef = scroll.getInnerRef(sections)
        const posFromWindowBottom = getScrollCoordsFromElement(innerRef).windowBottom.fromBottom
        const posFromWindowTop = getScrollCoordsFromElement(innerRef).windowTop.fromTop
        if ( posFromWindowBottom >= 0 && posFromWindowTop <= 0 ) { return this.pos.TOPBOTTOM }
        if ( posFromWindowTop <= 0 ) { return this.pos.TOP }
        if ( posFromWindowBottom >= 0 ) { return this.pos.BOTTOM }
        return this.pos.MIDDLE
    },
    tween(array, afterComplete) {
        array.forEach(_ => {
            const self = this
            const { ref, dir, from } = _
            const to = from + dir
            self.clearClasses( ref )
            self.addClasses( ref, from, to, 0 )

            const delay = context.externalChange ? state.externalDelay : 0
            const duration = context.externalChange ? state.externalDuration : state.duration

            Tween.to(
                from * 100, 
                to * 100,
                {
                    delay,
                    duration,
                    onChange(context) {
                        ref.style.transform = `translate3d(0, ${context.value}%, 0)`
                    },
                    onComplete() {
                        ref.style.transform = `translate3d(0, ${to * 100}%, 0)`
                        self.removeClasses( ref, from, to, 1000, self )
                        setTimeout(() => {
                            afterComplete && afterComplete()
                            setTimeout(() => {
                                context.setExternalChanging(false)
                                context.changing = false
                            }, delay)
                        }, 100) // откидываем на пару тиков вперед чтобы пересчет координат не перетерло
                    }
                }
            )
        })
    },
    addClasses( ref, from, to, delay ) {
        setTimeout(() => {
            if ( from === -2 ) {
                ref.classList.add(state.classes.FROM_NEXT)
                context.controller.classList.add(state.classes.GLOBAL_FROM_NEXT)
            } else
            if ( from === -1 ) {
                ref.classList.add(state.classes.FROM_ACTIVE)
            } else
            if ( from === 0 ) {
                ref.classList.add(state.classes.FROM_PREV)
                context.controller.classList.add(state.classes.GLOBAL_FROM_PREV)
            }
    
            setTimeout(() => {
                if ( to === -2 ) {
                    ref.classList.add(state.classes.TO_NEXT)
                } else
                if ( to === -1 ) {
                    ref.classList.add(state.classes.TO_ACTIVE)
                } else
                if ( to === 0 ) {
                    ref.classList.add(state.classes.TO_PREV)
                }
            }, 100)
        }, delay)
    },
    removeClasses( ref, from, to, delay, self ) {
        self.timeout.push(setTimeout(() => {
            if ( to === -2 ) {
                ref.classList.remove(state.classes.TO_NEXT)
            } else
            if ( to === -1 ) {
                ref.classList.remove(state.classes.TO_ACTIVE)
            } else
            if ( to === 0 ) {
                ref.classList.remove(state.classes.TO_PREV)
            }

            context.controller.classList.remove(state.classes.GLOBAL_FROM_NEXT)
            context.controller.classList.remove(state.classes.GLOBAL_FROM_PREV)
    
            setTimeout(() => {
                if ( from === -2 ) {
                    ref.classList.remove(state.classes.FROM_NEXT)
                } else
                if ( from === -1 ) {
                    ref.classList.remove(state.classes.FROM_ACTIVE)
                } else
                if ( from === 0 ) {
                    ref.classList.remove(state.classes.FROM_PREV)
                }
            }, 100)
        }, delay))
    },
    clearClasses( ref ) {
        this.timeout.forEach(t => clearTimeout(t))
        this.timeout = []
        ref.classList.remove(state.classes.TO_NEXT)
        ref.classList.remove(state.classes.TO_ACTIVE)
        ref.classList.remove(state.classes.TO_PREV)
        ref.classList.remove(state.classes.FROM_NEXT)
        ref.classList.remove(state.classes.FROM_ACTIVE)
        ref.classList.remove(state.classes.FROM_PREV)
        context.controller.classList.remove(state.classes.GLOBAL_FROM_PREV)
        context.controller.classList.remove(state.classes.GLOBAL_FROM_NEXT)
    }
}