

import {$t} from "../../../../../../lib/sites/qclay-design-fc4b5892/i18n/i18n"
import { useTransform } from "../../../../../../lib/sites/qclay-design-fc4b5892/Controller/hooks/useTransform/index"
import { screens } from "../../constants"
import { getScrollCoordsFromElement } from "../../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/coords/index"
import Interface from "./components/Interface/Interface"
import { useRef } from "react"
import { memo } from 'react'

const WhatCreate = memo(function WhatCreate() {
  const view = useRef()
  const grid = useRef()

  const cursor1 = useRef()
  const cursor2 = useRef()
  const cursor3 = useRef()
  const cursor4 = useRef()
  const cursor5 = useRef()
  const cursor6 = useRef()

  const { parent, target } = useTransform('horizontalScroll', { id: screens.WHATCREATE })
  const scaleRef = useTransform({ onChange: handler, onResize: handler }, { id: screens.WHATCREATE, parent })
  function handler({ target }) {
    const distance = window.innerWidth
    const to = getScrollCoordsFromElement(target).windowRight.fromRight
    const x = Math.max(Math.min((distance - to) / distance + .2, 1), .4)
    target.style.transform = `scale(${x})`
  }

  return (
    <section ref={parent} className="what-create" id="we-create">
      <div ref={target} className="what-create__slider">
        <div ref={scaleRef.target} className="what-create__view">
          <span className="sub"><span data-text={$t("pages.whatCreate.title")}></span></span>
          <span className="sub"><span data-text={$t("pages.whatCreate.title")}></span></span>
          <span className="view-text">{ $t("pages.whatCreate.title") }</span>
          <span className="sub"><span data-text={$t("pages.whatCreate.title")}></span></span>
          <span className="sub"><span data-text={$t("pages.whatCreate.title")}></span></span>
        </div>
        <div ref={view} className="what-create__view">
          <div ref={grid} className="view-grid">
            <img src={'/sites/qclay-design-fc4b5892/root-8a5edab2/images/whatCreate/grid.webp'} width={1730} height={1120} alt="" />
          </div>
            <div className="view-position">
              <Interface 
                parent={ parent }
                parentRefs={{
                  view,
                  grid,
                  target,
                  cursor1,
                  cursor2,
                  cursor3,
                  cursor4,
                  cursor5,
                  cursor6
                }}
              />
            </div>
            <div className='what-create__cursors'>
              <div ref={cursor1} className='object'><img src={'/sites/qclay-design-fc4b5892/root-8a5edab2/images/whatCreate/1.webp'} width={68} height={42} alt="" /></div>
              <div ref={cursor2} className='object'><img src={'/sites/qclay-design-fc4b5892/root-8a5edab2/images/whatCreate/2.webp'} width={68} height={42} alt="" /></div>
              <div ref={cursor3} className='object'><img src={'/sites/qclay-design-fc4b5892/root-8a5edab2/images/whatCreate/3.webp'} width={68} height={42} alt="" /></div>
              <div ref={cursor4} className='object'><img src={'/sites/qclay-design-fc4b5892/root-8a5edab2/images/whatCreate/4.webp'} width={68} height={42} alt="" /></div>
              <div ref={cursor5} className='object'><img src={'/sites/qclay-design-fc4b5892/root-8a5edab2/images/whatCreate/5.webp'} width={68} height={42} alt="" /></div>
              <div ref={cursor6} className='object'><img src={'/sites/qclay-design-fc4b5892/root-8a5edab2/images/whatCreate/6.webp'} width={68} height={42} alt="" /></div>
            </div>
        </div>
      </div>
    </section>
  )
})

export default WhatCreate