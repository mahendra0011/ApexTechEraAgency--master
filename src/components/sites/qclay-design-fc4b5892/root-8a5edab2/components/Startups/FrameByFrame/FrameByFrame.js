import { useEffect, useRef, useState } from "react"
import { frames } from "./frames"
import { screens } from "../../../constants"
import { useTransform } from "../../../../../../../lib/sites/qclay-design-fc4b5892/Controller/hooks/useTransform/index"
import Canvas from "./canvas"
import { itl } from "../../../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/utils/itl"
import { Timeline } from "./timeline"
import Spelling from "../../../../shared/Spelling/Spelling"
import { $t } from "../../../../../../../lib/sites/qclay-design-fc4b5892/i18n/i18n"
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
            <canvas ref={target}></canvas>
            <div ref={infinite} className="infinite"></div>
            <div ref={title} className="parent-title">
                <Spelling>{$t('pages.startups.p_title_1')}</Spelling>
                <Spelling>{$t('pages.startups.p_title_2')}</Spelling>
            </div>
            <div ref={logo} className="logo">
                <img src='/sites/qclay-design-fc4b5892/root-8a5edab2/images/startups/logo.webp' width={100} height={100} alt="" />
            </div>
        </div>
    )
}

export default FrameByFrame