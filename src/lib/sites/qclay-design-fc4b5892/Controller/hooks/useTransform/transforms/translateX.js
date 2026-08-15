import { getElementCoords } from "../../../../Animator/js/coords/index"

export const translateX = ({ parent, target, min = -100, max = 100, wheel } = {}) => {
    const { height } = getElementCoords(parent)
    const x = min + ( max - min ) * wheel / ( height - window.innerHeight )
    target.style.transform = `translate(${x}px)`
}
