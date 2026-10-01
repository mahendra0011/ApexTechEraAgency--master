import {$t} from "../../../../../../lib/sites/apextechera-design-fc4b5892/i18n/i18n"
import { useTransform } from "../../../../../../lib/sites/apextechera-design-fc4b5892/Controller/hooks/useTransform/index"
import { screens } from "../../constants"
import { getScrollCoordsFromElement } from "../../../../../../lib/sites/apextechera-design-fc4b5892/Animator/js/coords/index"
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

  // Shared parent ref, created up front so both useTransform hooks below
  // can bind to the same <section> no matter which one registers first.
  const parent = useRef()

  // Registered BEFORE 'horizontalScroll' on purpose. Previously this ran
  // second, so on every single scroll frame it called
  // getBoundingClientRect() (inside getScrollCoordsFromElement) right
  // after horizontalScroll had just written a new translate3d to the
  // slider in that same tick. Reading layout immediately after a write
  // forces the browser to synchronously flush and recompute it before
  // it can answer — a "layout thrashing" stall that repeated 60x/second
  // for as long as this section was active, which is what froze the
  // page while scrolling here. Registering this first means it reads
  // the previous (already-settled) frame's layout instead, so no
  // forced synchronous flush — same visual result, ~1 frame (16ms)
  // earlier in the pipeline, no jank.
  const scaleRef = useTransform({ onChange: handler, onResize: handler }, { id: screens.WHATCREATE, parent })
  const { target } = useTransform('horizontalScroll', { id: screens.WHATCREATE, parent })
  function handler({ target }) {
    if (typeof window === 'undefined' || !target) return
    const distance = window.innerWidth
    const to = getScrollCoordsFromElement(target)?.windowRight?.fromRight
    if (to == null || !isFinite(to)) return
    const x = Math.max(Math.min((distance - to) / distance + .2, 1), 0)
    target.style.transform = `scale(${x})`
  }

  return (
    <section ref={parent} className="what-create" id={screens.WHATCREATE}>
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
            <img src={'/sites/apextechera-design-fc4b5892/root-8a5edab2/images/whatCreate/grid.webp'} width={1730} height={1120} alt="" />
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
            <div ref={cursor1} className='object'><img src={'/sites/apextechera-design-fc4b5892/root-8a5edab2/images/whatCreate/1.webp'} width={68} height={42} alt="" /></div>
            <div ref={cursor2} className='object'><img src={'/sites/apextechera-design-fc4b5892/root-8a5edab2/images/whatCreate/2.webp'} width={68} height={42} alt="" /></div>
            <div ref={cursor3} className='object'><img src={'/sites/apextechera-design-fc4b5892/root-8a5edab2/images/whatCreate/3.webp'} width={68} height={42} alt="" /></div>
            <div ref={cursor4} className='object'><img src={'/sites/apextechera-design-fc4b5892/root-8a5edab2/images/whatCreate/4.webp'} width={68} height={42} alt="" /></div>
            <div ref={cursor5} className='object'><img src={'/sites/apextechera-design-fc4b5892/root-8a5edab2/images/whatCreate/5.webp'} width={68} height={42} alt="" /></div>
            <div ref={cursor6} className='object'><img src={'/sites/apextechera-design-fc4b5892/root-8a5edab2/images/whatCreate/6.webp'} width={68} height={42} alt="" /></div>
          </div>
        </div>
      </div>
    </section>
  )
})

export default WhatCreate