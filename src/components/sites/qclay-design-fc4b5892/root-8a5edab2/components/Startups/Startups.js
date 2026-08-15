

import {$t} from "../../../../../../lib/sites/qclay-design-fc4b5892/i18n/i18n"
import { useTransform } from "../../../../../../lib/sites/qclay-design-fc4b5892/Controller/hooks/useTransform/index"
import { screens } from "../../constants"
import Spelling from "../../../shared/Spelling/Spelling"
import FrameByFrame from "./FrameByFrame/FrameByFrame"
import { useRef } from "react"
import { memo } from "react"

const Startups = function Startups() {
  const { parent, target } = useTransform('sticky', { id: screens.STARTUPS })
  const fillRef = useRef()
  const logoBlur = useRef()
  console.log('rerender')
  return (
    <section ref={parent} className="startups">
      <div ref={target} className="startups__sticky">
        <h2>
            <Spelling>{$t('pages.startups.title_1')}</Spelling>
            <Spelling>{$t('pages.startups.title_2')}</Spelling>
            <Spelling>{$t('pages.startups.title_3')}</Spelling>
        </h2>
        <div className="startups__bg">
          <svg width="1728" height="568" viewBox="0 0 1728 568" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 133.717C198.889 211.351 584.274 397.581 534.709 521.435C472.753 676.253 -116.505 397.581 899.039 265.649C1711.47 160.104 1710 38 1731 0.5" stroke="#C7C7C7"/>
          </svg>
        </div>
        <div ref={fillRef} className="startups__fill"></div>
        <div className="startups__content">
          <FrameByFrame screen={ parent } fillRef={fillRef} logoBlur={logoBlur} />
        </div>
        <div ref={logoBlur} className="blur"></div>
      </div>
    </section>
  )
}

export default Startups