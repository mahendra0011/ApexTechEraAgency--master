export const sticky = ({ parent, stick = false, target, wheel, upperElements = [], cropMax = false } = {}) => {
    const offset = { value: 0 }
    upperElements.forEach(_ => {
        if ( !_.current ) { return }
        const height = _.current.getBoundingClientRect().height
        const mt = parseInt(getComputedStyle(_.current).marginTop)
        const mb = parseInt(getComputedStyle(_.current).marginBottom)
        offset.value += height + mt + mb
    })
    const y = { value: Math.max(0, wheel - offset.value) }
    if (cropMax) {
        y.value = Math.min(y.value, parent.getBoundingClientRect().height - target.getBoundingClientRect().height)
    }

    target.style.cssText = `
        position: absolute;
        transform: translate3d(0, ${y.value}px, 0);    
    `
}

