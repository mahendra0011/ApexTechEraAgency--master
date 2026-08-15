
import cn from "classnames"
import { useStickToMouse } from "../../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/react/hooks/useMouse/useStickToMouse"

const AnimateLink = ({ onClick, onMouseEnter, onMouseLeave, href, className, target, rel, children }) => {
    const refs = useStickToMouse()
    
    return (
        <a 
            ref={r => refs.target.current[0] = r}
            className={cn('animate-link', className)}
            href={href}
            target={target}
            rel={rel}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <span className='hidden'>{ children }</span>
            <span className='animate-link-tr'>
                <span>{ children }</span>
                <span>{ children }</span>
            </span>
            <span ref={refs.parent} className="hover"></span>
      </a>
    )
}

export default AnimateLink