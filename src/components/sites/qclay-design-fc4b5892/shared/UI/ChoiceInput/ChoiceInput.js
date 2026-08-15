
import React from "react";
import { useStickToMouse } from "../../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/react/hooks/useMouse/useStickToMouse"

const ChoiceInput = React.forwardRef(({type, value, name = '', onMouseLeave, onMouseEnter, ...props}, ref) => {
  const { parent, target } = useStickToMouse()

  return (
    <div ref={r => target.current[0] = r} onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter} className="choice-input">
      <input ref={ref} {...props} type={type} id={value} value={value} name={name}/>
      <span className="content">
        <span className="text">
          <span className="hidden">{value}</span>
          <span className="tr-y">
            <span>{value}</span>
            <span>{value}</span>
          </span>
        </span>
      </span>
      <label htmlFor={value}></label>
      <span ref={parent} className="hover"></span>
    </div>
  )
})

export default ChoiceInput