import { Children, cloneElement } from 'react'
import { useContext, useEffect, useRef } from 'react'
import { ControllerContext } from "./Controller"
import { state } from "./utils/state"
import { scroll } from "./utils/scroll"
import cn from 'classnames'
import { context } from "./utils/context"


const Sections = ({ children }) => {
    const { active, sections, setSections, setPrevSections } = useContext(ControllerContext)
    const sectionsRef = useRef( {} )
    const childrenArray = Children.toArray(children)

    useEffect(() => {
        context.ids = childrenArray.map((child, i) => child.props.id || i)
        context.childrenArray = childrenArray
        document.body.classList.add('-loaded')
        state.resetPositions(state.getSections(childrenArray, sectionsRef, active))
        onResize()
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])
    function onResize() {
        context.externalChange = true
        scroll.resetTranslate(state.getSections(context.childrenArray, sectionsRef, context.active))
    }

    useEffect(() => { 
        setPrevSections( sections )
        setSections( state.getSections(childrenArray, sectionsRef, active) ) 
    }, [ active ])

    return (
        <div className="controller-sections">
            {Children.map(childrenArray, ( child, index ) => (
                <div 
                    ref={(ref) => sectionsRef.current[index] = ref} 
                    className={cn(
                        "section", 
                        state.className(active, index),
                        child.props?.id === "designers" && "section-black"
                    )}
                >
                    <div className={scroll.class}>
                        { cloneElement(child) }
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Sections