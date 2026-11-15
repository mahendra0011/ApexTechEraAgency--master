import { useRef, useEffect, useContext, memo } from "react"
import { setToRender, removeFromRender } from "../../../../../../../lib/sites/apextechera-design-fc4b5892/Animator/js/renderer"
import Animation from "./animation"
import { ControllerContext } from "../../../../../../../lib/sites/apextechera-design-fc4b5892/Controller/Controller"
import { screens } from "../../../constants"

const Canvas = memo(function Canvas({ parent, isActive }) {
    const canvas = useRef()
    const animationRef = useRef(null)
    const { activeId } = useContext(ControllerContext)
    const followingActive = isActive && activeId === screens.FOLLOWED

    useEffect(() => {
        if (!parent.current || !canvas.current) { return }
        const label = `followingParticles${Date.now()}`
        const animation = new Animation(parent.current, canvas.current, followingActive)
        animationRef.current = animation
        setToRender({
            label,
            handler: (t) => animation.render(t),
            delay: 10
        })
        return () => {
            removeFromRender(label)
            animation.unmount()
            animation.destroy()
            animationRef.current = null
        }
    }, [])

    useEffect(() => {
        const animation = animationRef.current
        if (!animation) { return }
        animation.isActive = followingActive
        if (canvas.current) {
            canvas.current.dispatchEvent(new CustomEvent('isActive', { detail: followingActive }))
        }
    }, [followingActive])

    return (
        <canvas ref={canvas}></canvas>
    )
})

export default Canvas