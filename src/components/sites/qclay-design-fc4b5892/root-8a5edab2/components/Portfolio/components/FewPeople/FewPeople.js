

import { useContext, useRef, useState } from "react";
import { $t } from "../../../../../../../../lib/sites/qclay-design-fc4b5892/i18n/i18n"
import { BreakpointsContext } from "../../../../../../../../lib/sites/qclay-design-fc4b5892/context/breakpointsContext"
import Spelling from "../../../../../shared/Spelling/Spelling"
import { useTransform } from "../../../../../../../../lib/sites/qclay-design-fc4b5892/Controller/hooks/useTransform/index"
import { screens } from "../../../../constants"
import { getElementCoords, getScrollCoordsFromElement } from "../../../../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/coords/index"
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
                <h2>
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
                <div className='few-people__scroller'>
                    <div className='few-people__circles'>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div className='few-people__progress'><div ref={progressRef}></div></div>
                    <p className='-tr-13'>{ $t('pages.portfolio.message') }</p>
                </div>
            </div>
        </div>
    )
})

export default FewPeople