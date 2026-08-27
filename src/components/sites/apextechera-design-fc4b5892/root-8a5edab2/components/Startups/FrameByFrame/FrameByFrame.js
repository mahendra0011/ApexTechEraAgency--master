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
    function onChange({ wheel }) {
        const refs = initRefs()
        if (!refs.mounted || !state.canvas) { return }
        if (!state.canvas.isLoaded) { return }
        const timeline = Timeline(refs)
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

            {/* Floating Tech Chips */}
            <div className="canvas-tech-chips" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
              <div style={{
                position: 'absolute',
                top: '12%',
                left: '-8%',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08), 0 0 15px rgba(34, 197, 94, 0.2)',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                letterSpacing: '0.02em',
                animation: 'floatBadge1 4s ease-in-out infinite'
              }}>
                <span>⚡</span> Sub-Second Speed
              </div>

              <div style={{
                position: 'absolute',
                top: '16%',
                right: '-8%',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08), 0 0 15px rgba(168, 85, 247, 0.2)',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#9333ea',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                letterSpacing: '0.02em',
                animation: 'floatBadge2 4.5s ease-in-out infinite'
              }}>
                <span>🎨</span> Pixel-Perfect UI
              </div>

              <div style={{
                position: 'absolute',
                bottom: '14%',
                left: '-6%',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08), 0 0 15px rgba(59, 130, 246, 0.2)',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                letterSpacing: '0.02em',
                animation: 'floatBadge1 5s ease-in-out infinite 0.5s'
              }}>
                <span>🤖</span> AI-Native Scale
              </div>

              <div style={{
                position: 'absolute',
                bottom: '12%',
                right: '-6%',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(234, 88, 12, 0.3)',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08), 0 0 15px rgba(234, 88, 12, 0.2)',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                letterSpacing: '0.02em',
                animation: 'floatBadge2 4.2s ease-in-out infinite 0.8s'
              }}>
                <span>🛡️</span> Enterprise Grade
              </div>
            </div>

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