
import {$t} from "../../../../../../lib/sites/qclay-design-fc4b5892/i18n/i18n"
import {useEffect, useState} from "react";
import cn from "classnames";
import { useStickToMouse } from "../../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/react/hooks/useMouse/useStickToMouse"

const SubmitButton = ({ className, onMouseLeave, onMouseEnter }) => {
  const { parent, target } = useStickToMouse()

  return (
    <div 
      ref={r => target.current[0] = r}
      className={cn("button-pulse", className)}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
          <button className="button" type="submit">
              <span className="button__word_mobile">{$t("pages.reqForm.form.button.mobile")}</span>
              <span className="text">
                <span className="button__word_one">{$t("pages.reqForm.form.button.submit")}</span>
                <span className="button__word_two">{$t("pages.reqForm.form.button.the")}</span>
                <span className="button__word_three">{$t("pages.reqForm.form.button.request")}</span>
              </span>
          <span ref={parent} className="hover"></span>
          <span className="lds-ring"><span></span><span></span><span></span><span></span></span>
          </button>
        <div className="puls">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
    </div>
  )
}

export default SubmitButton