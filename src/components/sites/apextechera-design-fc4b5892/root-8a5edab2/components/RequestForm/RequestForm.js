

import { memo, useEffect } from "react";
import FormBlock from "./components/FormBlock"
import { useContext } from "react";
import { BreakpointsContext } from "../../../../../../lib/sites/apextechera-design-fc4b5892/context/breakpointsContext"
import { ModalContext } from "../../../shared/Modal/Modal"
import { ControllerContext } from "../../../../../../lib/sites/apextechera-design-fc4b5892/Controller/Controller"
import { screens } from "../../constants"

const RequestForm = memo(function RequestForm() {
  const { isMaxWidth } = useContext(BreakpointsContext)
  const { setActiveForm, activeForm } = useContext(ModalContext)
  const { activeId } = useContext(ControllerContext)

  useEffect(() => {
    if (!isMaxWidth.mobile) { return }
    if (activeId !== screens.REQUESTFORM) { return }
    if (activeForm) { return }
    setTimeout(() => {
      setActiveForm(true)
    }, 100)
  }, [ activeId ])

  return (
    <div className="rq-form-plug">
      {/* Desktop renders the form inline; mobile does too now — the split
          contact area was otherwise an empty white block. The fixed mobile
          overlay (FormBlock fixed) is still used by the header/footer CTAs. */}
      <FormBlock />
    </div>
  )
})

export default RequestForm