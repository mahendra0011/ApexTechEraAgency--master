import { useRef, useEffect, useState } from "react"
import { setToRender, removeFromRender } from "../../../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/renderer"
import Animation from "./animation"
import { useContext } from "react"
import { ControllerContext } from "../../../../../../../lib/sites/qclay-design-fc4b5892/Controller/Controller"
import { screens } from "../../../constants"
import { memo } from "react"

const Canvas = function Canvas({ parent, isActive }) {
    const [isInited, setIsInited] = useState(false)
    const { activeId } = useContext(ControllerContext)
    const canvas = useRef()
    useEffect(() => {
        const label = 'followingParticles'
        if (!isInited) {
            setIsInited(true)
            const animation = new Animation(parent.current, canvas.current, isActive && activeId === screens.PORTFOLIO)
            setToRender({
                label,
                handler: (t) => animation.render(t),
                delay: 10
            })
        }
        // return () => { removeFromRender(label); animation.unmount() }
    })

    useEffect(() => {
        if ( canvas.current ) {
            canvas.current.dispatchEvent(new CustomEvent('isActive', { detail: isActive && activeId === screens.PORTFOLIO }))
        }
    }, [ isActive ])

    return (
        <canvas ref={canvas}></canvas>
    )
}

export default Canvas