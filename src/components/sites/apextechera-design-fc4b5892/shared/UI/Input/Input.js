
import React from "react";
import cn from "classnames";

const Input = React.forwardRef(({label, className, placeholder, ...props}, ref) => {
  return (
    <div className={cn("text-input", className)}>
      <label htmlFor={label}>{label}</label>
      <input ref={ref} {...props} type="text" placeholder={placeholder} id={label}/>
    </div>
  )
})

export default Input