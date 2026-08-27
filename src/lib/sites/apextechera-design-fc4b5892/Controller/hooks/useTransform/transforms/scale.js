import { getElementCoords } from "../../../../Animator/js/coords/index"

export const scale = ({ parent, target, min = .5, max = 1, wheel } = {}) => {
    const { height } = getElementCoords(parent)
    min = typeof min === 'function' ? min() : min
    const x = min + ( max - min ) * wheel / ( height - window.innerHeight )
    target.style.transform = `scale(${x})`
}
