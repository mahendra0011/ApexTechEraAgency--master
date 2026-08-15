
import { Children } from 'react'
import cn from 'classnames'

const Spelling = ({ className, slotName, slotProps, Slot, progress, slotClassName, children, nowrap }) => {
    const text = Children.toArray(children)[0].split('')
    return (
        <span className={cn('spelling', className)}>
            {text.map((symbol, i) => {
                if (slotName && slotName === symbol && nowrap) {
                    return (
                        <Slot key={i} className={cn('slot', progress > i  ? '-lighten' : '', slotClassName)} {...slotProps}></Slot>
                    )
                }

                if (slotName && slotName === symbol) {
                    return (
                        <span key={i} className={cn('slot', progress > i ? '-lighten' : '', slotClassName)}>
                            <Slot {...slotProps}></Slot>
                        </span>
                    )
                }

                return (
                    <span key={i} className={cn(symbol === ' ' ? 'spacer' : '', progress > i ? '-lighten' : '')}>
                        <span>{ symbol }</span>
                    </span>
                )
            })}
        </span>
    )
}

export default Spelling