import { useState, createContext, useEffect } from "react"

const BreakpointsContext = createContext({});

const breakpoints = [
    {
        name: 'mobile',
        width: 576,
    }
];

const resizer = () => {
    const maxWidth = {}
    breakpoints.forEach(_ => maxWidth[_.name] = typeof window !== "undefined" && window.innerWidth <= _.width)
    return maxWidth;
}

const BreakpointsContextProvider = ({ children }) => {
    const [ isMaxWidth, setIsMaxWidth ] = useState(resizer())

    useEffect(() => {
        // onResize()
        setTimeout(onResize, 300);
        // window.addEventListener("load", onResize);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize)
    }, [])

    function onResize() {
        setIsMaxWidth(resizer())
    }

    const value = { isMaxWidth }

    return (
        <BreakpointsContext.Provider value={value}>
            { children }
        </BreakpointsContext.Provider>
    )
}

export default BreakpointsContextProvider
export { BreakpointsContext }