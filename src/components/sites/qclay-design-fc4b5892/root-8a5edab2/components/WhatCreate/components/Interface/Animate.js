import { useEffect } from 'react'
import { useTransform } from "../../../../../../../../lib/sites/qclay-design-fc4b5892/Controller/hooks/useTransform/index"
import { screens } from "../../../../constants"
import { itl } from "../../../../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/utils/itl"
import { Timeline } from "./timeline"
import { isElementVisible } from "../../../../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/coords/index"

const Animate = ({ parent, target, initRefs, children }) => {
    useTransform({ onChange, onResize }, { id: screens.WHATCREATE, parent, target })
    useEffect(() => {
        const showSkeleton = () => {
            const refs = initRefs()
            if (!refs.mounted) { return }
            refs.mainInterface.classList.add('apex-skeleton-handoff')
            animate({ ...refs, wheel: window.innerWidth * 2 })
            // The service-video overlay pauses the normal controller at its
            // fullscreen point. Reset every property that normally arrives via
            // the controller so the existing Stage 1 dashboard is genuinely
            // visible when the sixth video leaves.
            const dashboardWidth = refs.mainInterface.getBoundingClientRect().width
                || refs.content.getBoundingClientRect().width
            refs.container.style.transform = 'translate3d(0, 0, 0) scale(1)'
            refs.view.style.transform = 'translate3d(0, 0, 0)'
            refs.content.style.opacity = '1'
            refs.mode.style.width = `${dashboardWidth}px`
            refs.modeTrX.style.transform = 'translate3d(0, 0, 0)'
            refs.stage1.style.cssText = 'opacity: 1; visibility: visible; pointer-events: auto;'
            refs.stage2.style.cssText = 'opacity: 0; visibility: hidden; pointer-events: none;'
            refs.stage3.style.cssText = 'opacity: 0; visibility: hidden; pointer-events: none;'
            window.setTimeout(() => refs.mainInterface.classList.remove('apex-skeleton-handoff'), 780)
        }
        document.addEventListener('apex:show-service-skeleton', showSkeleton)
        return () => document.removeEventListener('apex:show-service-skeleton', showSkeleton)
    }, [])
    function onChange({ wheel }) {
        if ( !target.current ) { return } 
        if ( !isElementVisible(target.current).partable.y ) { return }
        const refs = initRefs()
        if ( !refs.mounted ) { return }
        animate({ wheel, ...refs })
    }
    function onResize() {}

    function animate(refs) {
        const timeline = Timeline(refs)
        const t = itl(timeline, refs.wheel)
        // console.log(t)

        refs.container.style.transform = `translate3d(${t.container.x}px, ${t.container.y}px, 0) scale(${t.container.scale})`
        refs.view.style.transform = `translate3d(${t.view.x}px, 0, 0)`
        refs.content.style.opacity = t.interface.opacity
        
        refs.stage1.style.opacity = t.stage1.opacity
        refs.stage2.style.opacity = t.stage2.opacity
        refs.stage3.style.opacity = t.stage3.opacity

        refs.grid.style.opacity = t.grid.opacity

        t.tagContainer.opacity >= .85 ? (
            refs.tagContainer.style.cssText = `
                opacity: 1;
                transform: translate(-50%, 0.625rem) scale(1);
                transition: opacity .5s ease, transform .5s ease;
            `
        ) : (
            refs.tagContainer.style.cssText = `
                opacity: 0;
                transform: translate(-50%, 0.625rem) scale(.5);
                transition: opacity .5s ease, transform .5s ease;
            `
        )

        
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
        refs.slot.style.transform = `translate3d(${t.toCenter.x3}px, ${t.toCenter.y3}px, 0)`

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
