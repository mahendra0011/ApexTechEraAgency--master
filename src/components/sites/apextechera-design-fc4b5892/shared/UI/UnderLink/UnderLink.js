
import cn from 'classnames'

const UnderLink = ({ className, href, children }) => {
    return (
        <a 
        href={href}
        className={cn("underlink", className)}
        target="_blank"
        rel="noreferrer"
      >{ children }</a>
    )
}

export default UnderLink