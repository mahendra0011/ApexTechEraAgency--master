import { useRef, useEffect } from "react"
import { utils } from "./utils"
import { context } from "../../utils/context"

import { scale } from "./transforms/scale"
import { horizontalScroll, horizontalScrollResize } from "./transforms/horizontalScroll"
import { sticky } from "./transforms/sticky"
import { translateX } from "./transforms/translateX"


const transforms = {
    scale: scale,
    horizontalScroll: horizontalScroll,
    sticky: sticky,
    translateX: translateX,
}

const transformsResize = {
    horizontalScroll: horizontalScrollResize
}

const useTransform = ( name = 'scale', props = {} ) => {
    const config = {
        resizable: false,
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
        ...props,
    }

    const parentref = useRef()
    const targetref = useRef()
    const parent = config.parent || parentref
    const target = config.target || targetref

    useEffect(() => {
        if ( !config.id ) { console.error('[useTransform]: section id is required'); return }
        if (typeof name === 'string' && !Object.keys(transforms).includes(name)) { console.error('[useTransform]: invalid transformation provided'); return }
        if (Object.keys(transformsResize).includes(name) || typeof name === 'object') { config.resizable = true }
        config.parent = parent.current
        config.target = target.current

        document.addEventListener('customwheel', onWheel)
        document.addEventListener('triggerwheel', triggerWheel)
        window.addEventListener('resize', onResize)
        onResize()
        setTimeout(() => {
            onResize()
        }, 300)
        const wheel = { value: 0 }
        function triggerWheel(e) {
            onWheel(e, true)
        }
        function onWheel(e, isTrigger = false) {
            if ( utils.notDom([ config.parent, config.target ]) && typeof name !== 'object' ) { return }

            if ( !isTrigger ) { 
                // вызывается когда просто скроллим
                if ( config.id === context.ids[context.active] ) { wheel.value = e.detail.wheel }
                else { wheel.value = null }
                // else if ( sectionIndex > context.active ) { wheel.value = 0 }
                // else if ( sectionIndex < context.active ) { 
                //     const ref = /*config.parent ||*/ context.sections[context.active].ref.querySelector(`.${scroll.class}`)
                //     wheel.value = ref.getBoundingClientRect().height - window.innerHeight 
                // }
            } else {
                // вызывается когда пересчитываем в scroll.js при переходе на кнопку
                if ( config.id === e.detail.id ) { wheel.value = e.detail.wheel }
                else { wheel.value = null }
                // console.log(wheel.value)
            }

            if ( wheel.value !== null ) {
                // console.log(wheel.value, 'inside')
                if ( typeof name === 'object' ) { 
                    if ( typeof name.onChange === 'function' ) {
                        name.onChange({...config, wheel: wheel.value}) 
                    }
                }
                else { 
                    transforms[name]({...config, wheel: wheel.value}) 
                }
            }
        }
        function onResize() {
            if ( utils.notDom([ config.parent, config.target ]) ) { return }
            if ( !config.resizable ) { return }
            config.width = window.innerWidth
            config.height = window.innerHeight
            if ( typeof name === 'object' ) { 
                if ( typeof name.onResize === 'function' ) {
                    name.onResize(config) 
                }
            }
            else { transformsResize[name](config) }
        }
        
        return () => {
            document.removeEventListener('customwheel', onWheel)
            document.removeEventListener('triggerwheel', triggerWheel)
            window.removeEventListener('resize', onResize)
        }
    }, [])

    return { parent, target }
}

export { useTransform }

