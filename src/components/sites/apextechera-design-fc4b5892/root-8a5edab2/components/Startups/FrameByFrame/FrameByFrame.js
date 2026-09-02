import { useEffect, useRef, useState } from "react"
import { frames } from "./frames"
import { screens } from "../../../constants"
import { useTransform } from "../../../../../../../lib/sites/apextechera-design-fc4b5892/Controller/hooks/useTransform/index"
import Canvas from "./canvas"
import { itl } from "../../../../../../../lib/sites/apextechera-design-fc4b5892/Animator/js/utils/itl"
import { Timeline } from "./timeline"
import Spelling from "../../../../shared/Spelling/Spelling"
import { $t } from "../../../../../../../lib/sites/apextechera-design-fc4b5892/i18n/i18n"
import cn from "classnames"

const state = { canvas: null }

const FrameByFrame = ({ screen, fillRef, logoBlur }) => {
    const { parent, target } = useTransform({ onChange }, { id: screens.STARTUPS })
    const infinite = useRef()
    const logo = useRef()
    const title = useRef()
    const [isActive, setIsActive] = useState(false)
    // Caches screen.getBoundingClientRect().height so Timeline() (called on
    // every scroll tick) doesn't force a synchronous layout reflow each
    // time — same forced-reflow jank pattern already fixed elsewhere in
    // this codebase. Only re-measured on resize.
    const distCache = useRef(null)
    useEffect(() => {
        const measure = () => {
            if (screen.current) {
                distCache.current = screen.current.getBoundingClientRect().height - window.innerHeight
            }
        }
        measure()
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    }, [screen])
    function onChange({ wheel }) {
        const refs = initRefs()
        if (!refs.mounted || !state.canvas) { return }
        if (!state.canvas.isLoaded) { return }
        const timeline = Timeline(refs, distCache.current)
        const t = itl(timeline, wheel)
        state.canvas.drawFrame(Math.round(t.canvas.frame))
        refs.par.style.cssText = `
            transform: translate3d(0, ${-t.parent.y}%, 0);
            width: ${t.parent.width}%;
            height: ${t.parent.height}%;
            opacity: ${t.parent.opacity};
        `
        refs.fill.style.opacity = t.fill.opacity
        refs.inf.style.opacity = t.fill.opacity
        refs.log.style.cssText = `
            opacity: ${t.fill.opacity};
            transform: scale(${t.logo.scale});
            bottom: ${t.logo.y}%;
        `
        refs.blur.style.cssText = `width: ${t.blur.size}px; height: ${t.blur.size}px`
        setIsActive(t.fill.opacity >= .6)
    }

    useEffect(() => {
        if (!state.canvas) {
            const refs = initRefs()
            if (!refs.mounted) { return }
            state.canvas = new Canvas(refs.par, refs.tar, frames)
        }
    }, [])

    const initRefs = () => {
        const par = parent.current
        const tar = target.current
        const scr = screen.current
        const fill = fillRef.current
        const inf = infinite.current
        const tit = title.current
        const log = logo.current
        const blur = logoBlur.current
        const mounted = par && tar && scr && fill && inf && tit && log && blur
        return { mounted, par, tar, scr, fill, inf, tit, log, blur }
    }

    return (
        <div ref={parent} className={cn("parent", isActive ? '-p-active' : '')}>
            {/* Ambient Glowing Aura */}
            <div 
              className="canvas-ambient-glow" 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '110%',
                height: '110%',
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.22) 0%, rgba(59, 130, 246, 0.12) 45%, transparent 70%)',
                filter: 'blur(35px)',
                pointerEvents: 'none',
                borderRadius: '50%',
                zIndex: 0,
              }} 
            />

            <canvas ref={target} style={{ position: 'relative', zIndex: 1 }}></canvas>

            <div ref={infinite} className="infinite"></div>
            <div ref={title} className="parent-title">
                <Spelling>{$t('pages.startups.p_title_1')}</Spelling>
                <Spelling>{$t('pages.startups.p_title_2')}</Spelling>
            </div>
            <div ref={logo} className="logo" style={{ display: 'none' }}>
            </div>
        </div>
    )
}

export default FrameByFrame