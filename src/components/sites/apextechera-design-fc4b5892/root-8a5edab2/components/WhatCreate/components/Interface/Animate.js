import { useRef } from 'react'
import { useTransform } from "../../../../../../../../lib/sites/apextechera-design-fc4b5892/Controller/hooks/useTransform/index"
import { screens } from "../../../../constants"
import { itl } from "../../../../../../../../lib/sites/apextechera-design-fc4b5892/Animator/js/utils/itl"
import { Timeline } from "./timeline"
import { isElementVisible } from "../../../../../../../../lib/sites/apextechera-design-fc4b5892/Animator/js/coords/index"

const Animate = ({ parent, target, initRefs, children }) => {
    // Caches slider/mainInterface measurements so the per-scroll-tick
    // Timeline() calc doesn't force a synchronous layout reflow on every
    // wheel event (getBoundingClientRect right after a style write is
    // the classic forced-reflow jank source). Invalidated on resize.
    const dimsCache = useRef(null)
    useTransform({ onChange, onResize }, { id: screens.WHATCREATE, parent, target })
    function onChange({ wheel }) {
        if ( !target.current ) { return } 
        const vis = isElementVisible(target.current)
        if ( !vis?.partable?.y ) { return }
        let refs
        try { refs = initRefs() } catch { return }
        if ( !refs?.mounted ) { return }
        // Guard: timeline may have produced NaN if dist invalid — skip frame instead of corrupting transforms
        try { animate({ wheel, ...refs }) } catch {}
    }
    function onResize() {
        dimsCache.current = null
    }

    function animate(refs) {
        if (!dimsCache.current) {
            dimsCache.current = {
                sliderWidth: refs.slider.getBoundingClientRect().width,
                interfaceWidth: refs.mainInterface.getBoundingClientRect().width,
                interfaceHeight: refs.mainInterface.getBoundingClientRect().height,
            }
        }
        const timeline = Timeline(refs, dimsCache.current)
        const t = itl(timeline, refs.wheel)
        // console.log(t)

        refs.container.style.transform = `translate3d(${t.container.x}px, ${t.container.y}px, 0) scale(${t.container.scale})`
        refs.view.style.transform = `translate3d(${t.view.x}px, 0, 0)`
        refs.content.style.opacity = t.interface.opacity
        
        refs.stage1.style.opacity = t.stage1.opacity
        refs.stage1.style.visibility = t.stage1.opacity > 0.02 ? 'visible' : 'hidden'
        refs.stage1.style.pointerEvents = t.stage1.opacity > 0.02 ? 'auto' : 'none'

        refs.stage2.style.opacity = t.stage2.opacity
        refs.stage2.style.visibility = t.stage2.opacity > 0.02 ? 'visible' : 'hidden'
        refs.stage2.style.pointerEvents = t.stage2.opacity > 0.02 ? 'auto' : 'none'

        refs.stage3.style.opacity = t.stage3.opacity
        refs.stage3.style.visibility = t.stage3.opacity > 0.02 ? 'visible' : 'hidden'
        refs.stage3.style.pointerEvents = t.stage3.opacity > 0.02 ? 'auto' : 'none'

        refs.grid.style.opacity = t.grid.opacity

        
        refs.mode.style.cssText = `width: ${t.mode.width}px`
        refs.modeTrX.style.transform = `translate3d(${t.mode.x}px, 0, 0)`

        refs.dHeader.style.opacity = t.desktopEl.opacity
        refs.sidebar.style.opacity = t.desktopEl.opacity
        refs.otherOps.style.opacity = t.desktopEl.opacity

        refs.title.style.transform = `translate3d(${t.toCenter.x1}px, 0, 0)`
        refs.row.style.transform = `translate3d(${t.toCenter.x1}px, 0, 0)`
        refs.mOps.style.transform = `translate3d(${-t.toCenter.x2}px, 0, 0)`
        refs.mHeader.style.transform = `translate3d(${-t.toCenter.x2}px, 0, 0)`
        refs.logo.style.transform = `translate3d(${t.toCenter.x2}px, 0, 0)`
        refs.tasks.style.transform = `translate3d(${t.toCenter.x3}px, ${t.toCenter.y3}px, 0)`
        if (refs.slot) refs.slot.style.transform = `translate3d(${t.toCenter.x3}px, ${t.toCenter.y3}px, 0)`

        if (refs.tagContainer && t.tagContainer) {
            refs.tagContainer.style.opacity = t.tagContainer.opacity
        }
        if (refs.tag1 && t.tag1) {
            refs.tag1.style.opacity = t.tag1.opacity
            refs.tag1.style.transform = `translate3d(0, ${t.tag1.y}px, 0)`
        }
        if (refs.tag2 && t.tag2) {
            refs.tag2.style.opacity = t.tag2.opacity
            refs.tag2.style.transform = `translate3d(0, ${t.tag2.y}px, 0)`
        }
        if (refs.tag3 && t.tag3) {
            refs.tag3.style.opacity = t.tag3.opacity
            refs.tag3.style.transform = `translate3d(0, ${t.tag3.y}px, 0)`
        }
        if (refs.tag4 && t.tag4) {
            refs.tag4.style.opacity = t.tag4.opacity
            refs.tag4.style.transform = `translate3d(0, ${t.tag4.y}px, 0)`
        }

        refs.cursor1.style.transform = `translate3d(${t.cursor.x1}px, ${t.cursor.y1}px, 0)`
        refs.cursor2.style.transform = `translate3d(${t.cursor.x2}px, ${t.cursor.y2}px, 0)`
        refs.cursor3.style.transform = `translate3d(${t.cursor.x3}px, ${t.cursor.y3}px, 0)`
        refs.cursor4.style.transform = `translate3d(${t.cursor.x4}px, ${t.cursor.y4}px, 0)`
        refs.cursor5.style.transform = `translate3d(${t.cursor.x5}px, ${t.cursor.y5}px, 0)`
        refs.cursor6.style.transform = `translate3d(${t.cursor.x6}px, ${t.cursor.y6}px, 0)`
    }

    return ( <div>{ children }</div> )
}

export default Animate