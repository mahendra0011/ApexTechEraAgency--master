import { useEffect, useRef } from "react"
import { setToRender, removeFromRender } from "../../../renderer"
import { isElementVisible } from "../../../coords/index"
import { isElementHovered, getMouseCoordsFromElement } from "../../../renderer"
import { Lerp } from "../../../tween/easing"

export const useStickToMouse = ({ onMouseMove, onMouseLeave, minWidth = 577 } = {}) => {
  const current = { x: 0, y: 0 }
  const parent = useRef()
  const target = useRef({})
  useEffect(() => {
    const label = 'useStickToMouse' + Date.now()
    setToRender({
      label,
      handler: () => {
        if (!parent.current) { return }
        if (!target.current) { return }
        if (!isElementVisible(parent.current).partable.y) { return }
        Object.keys(target.current).forEach((key, i) => {
          if (!target.current[key]) { return }
          animation(parent.current, target.current[key], i + 1.5)
        })
      },
      delay: 10
    })
    return () => removeFromRender(label)
  }, [])
  function animation(parent, target, i) {
    if (!parent) { return }
    if (!target) { return }
    if (window.innerWidth < minWidth) { return }
    if (isElementHovered(parent)) {
      if (typeof onMouseMove === 'function') { onMouseMove() }
      const pointer = getMouseCoordsFromElement(parent).center.center
      current.x = Lerp(current.x, pointer.x, 0.05)
      current.y = Lerp(current.y, pointer.y, 0.05)
      target.style.cssText = `transform: translate3d(${current.x / 2 / i}px, ${current.y / 2 / i}px, 0); transition: 0s;`
    } else {
      if (typeof onMouseLeave === 'function') { onMouseLeave() }
      target.style.cssText = `transition: transform .3s ease;`
      current.x = 0
      current.y = 0
    }
  }
  return { parent, target }
}