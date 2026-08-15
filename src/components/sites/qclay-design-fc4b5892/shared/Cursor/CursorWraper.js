import { useEffect, useRef, useState } from 'react'
import { setToRender, removeFromRender } from "../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/renderer"
import { getMouseCoords } from "../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/renderer"
import { Lerp } from "../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/tween/easing"
import cn from 'classnames'
import { mouse } from "./mouse"

const CursorWrapper = ({ className, t, children }) => {
    const cursor = useRef()
    const [ mouseLocale, setMouseLocale ] = useState({ x: -100, y: -100 })
    useEffect(() => {
        const label = `customCursor${Date.now()}`
        setToRender({
            label,
            handler: () => {
                if (!cursor.current) { return }
                const ease = t || 0.1  
                const m = !!t ? mouseLocale : { x: mouse.x, y: mouse.y }

                const { x, y } = getMouseCoords().window

                if (!mouse.fix.enabled) {
                    m.x = Lerp(m.x, x, ease)
                    m.y = Lerp(m.y, y, ease)
                } else if (!t) {
                    m.x = Lerp(mouse.x, mouse.fix.x, ease)
                    m.y = Lerp(mouse.y, mouse.fix.y, ease)
                } else {
                    return
                }

                if (t) { setMouseLocale(m) }
                else {
                    mouse.x = m.x
                    mouse.y = m.y
                }
                
                cursor.current.style.transform = `translate3d(${m.x}px, ${m.y}px, 100px)`
            },
        })
        return () => removeFromRender(label)
    }, [])

    return (
        <div ref={cursor} className={cn("custom-cursor", className)}>
            { children }
        </div>
    )
}

export default CursorWrapper