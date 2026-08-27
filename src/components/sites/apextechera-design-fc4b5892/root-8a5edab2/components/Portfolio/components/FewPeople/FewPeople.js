

import { useContext, useRef, useState } from "react";
import { $t } from "../../../../../../../../lib/sites/apextechera-design-fc4b5892/i18n/i18n"
import { BreakpointsContext } from "../../../../../../../../lib/sites/apextechera-design-fc4b5892/context/breakpointsContext"
import Spelling from "../../../../../shared/Spelling/Spelling"
import { useTransform } from "../../../../../../../../lib/sites/apextechera-design-fc4b5892/Controller/hooks/useTransform/index"
import { screens } from "../../../../constants"
import { getElementCoords, getScrollCoordsFromElement } from "../../../../../../../../lib/sites/apextechera-design-fc4b5892/Animator/js/coords/index"
import { memo } from 'react';


const Br = () => <br/>

const FewPeople = memo(function FewPeople() {
  const { isMaxWidth } = useContext(BreakpointsContext)
  const { parent, target } = useTransform('sticky', { id: screens.PORTFOLIO })

    const progressRef = useRef()

    const [ progressState, setProgressState ] = useState(0)

  useTransform({ onChange: handler, onResize: handler }, { id: screens.PORTFOLIO })
    function handler() {
        if (!progressRef.current) { return }
        if (!parent.current || !target.current) { return }
        const coords = getScrollCoordsFromElement(parent.current).windowTop.fromTop
        const distance = getElementCoords(parent.current).height - getElementCoords(target.current).height
        if (!coords) { return }

        const progress = Math.max(0, Math.min(coords / distance, 1))

        progressRef.current.style.cssText = `max-height: ${progress * 100}%`;
        setProgressState(Math.trunc(progress * 100))
    }

    return (
        <div ref={parent} className="few-people">
            <div ref={target} className='few-people__container'>
                <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 5rem)', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                    <span className='element'>,,</span>
                    {
                    isMaxWidth.mobile
                    ? (
                        $t("pages.portfolio.title.mobile").map((text, i) => (
                        <Spelling progress={progressState-5} slotName="$" Slot={Br} key={i} nowrap={true}>{ text }</Spelling>
                        ))
                    )
                    : (
                        $t("pages.portfolio.title.desktop").map((text, i) => (
                        <Spelling progress={progressState-5} slotName="$" Slot={Br} key={i} nowrap={true}>{ text }</Spelling>
                        ))
                    )
                    }
                </h2>
                <div className='few-people__scroller relative flex items-center justify-between w-full'>
                    <div className="flex items-center gap-6">
                        <div className='few-people__circles'>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <div className='few-people__progress'><div ref={progressRef}></div></div>
                        <p className='-tr-13 max-w-md'>{ $t('pages.portfolio.message') }</p>
                    </div>

                    {/* Premium 25+ Projects Badge */}
                    <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 items-center justify-center w-36 h-36 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
                        <div className="absolute inset-0 rounded-full border-t border-purple-500/50 animate-spin-slow" />
                        <div className="flex flex-col items-center justify-center text-center">
                            <span className="text-4xl font-clash font-bold text-white leading-none">25+</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mt-2 font-helvetica">Projects</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default FewPeople