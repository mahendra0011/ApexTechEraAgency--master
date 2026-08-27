import {$t} from "../../../../../../lib/sites/apextechera-design-fc4b5892/i18n/i18n"
import { screens } from "../../constants"
import { useTransform } from "../../../../../../lib/sites/apextechera-design-fc4b5892/Controller/hooks/useTransform/index"
import { useContext } from "react"
import { BreakpointsContext } from "../../../../../../lib/sites/apextechera-design-fc4b5892/context/breakpointsContext"
import { memo } from 'react'

const MeetFounder = memo(function MeetFounder() {
  const { parent, target } = useTransform('sticky', { id: screens.FOUNDER })
  const { isMaxWidth } = useContext(BreakpointsContext)
  return (
    <section ref={parent} className="founder">
      <div ref={target} className="founder__container">
        <div className="text">
          <h2>
            {
              isMaxWidth.mobile
              ? (
                <>
                  <span className="-tr-10">{$t("pages.founder.titleMobile.first")}</span>
                  <span className="-tr-11">{$t("pages.founder.titleMobile.second")}</span>
                  <span className="text__highlight -tr-12">{$t("pages.founder.titleMobile.third")}</span>
                </>
              )
              : (
                <>
                  <span className="-tr-10">{$t("pages.founder.title.first")}</span>
                  <span className="text__highlight -tr-11">{$t("pages.founder.title.second")}</span>
                  <span style={{lineHeight: 1.2}} className="-tr-12">
                    {$t("pages.founder.title.third")}
                  </span>
                </>
              )
            }
          </h2>
        </div>
      </div>
    </section>
  )
})

export default MeetFounder