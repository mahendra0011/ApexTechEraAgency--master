
import { Children } from 'react'
import cn from 'classnames'

const Spelling = ({ className, disable, children }) => {
    const text = Children.toArray(children)[0].split('')
    return (
        <span className={cn(disable ? 'random-spelling-disabled' : 'random-spelling', className)} style={{ whiteSpace: 'nowrap' }}>
            {text.map((symbol, i) => {
                if (symbol === '$') {
                    return <br key={i} />
                }
                return (
                    <span key={i} className={symbol === ' ' ? 'spacer' : ''}>
                        <span>{ symbol }</span>
                    </span>
                )
            })}
        </span>
    )
}

export default Spelling