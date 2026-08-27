import { useState, createContext, useEffect } from "react"

const BreakpointsContext = createContext({});

const breakpoints = [
    {
        name: 'mobile',
        width: 768,
    },
    {
        name: 'tablet',
        width: 1024,
    }
];

const resizer = () => {
    const maxWidth = {}
    breakpoints.forEach(_ => maxWidth[_.name] = typeof window !== "undefined" && window.innerWidth <= _.width)
    return maxWidth;
}

const BreakpointsContextProvider = ({ children }) => {
    // The first client render must match the server render. Reading
    // `window.innerWidth` here made small screens render mobile markup before
    // hydration while SSR had rendered desktop markup.
    const [ isMaxWidth, setIsMaxWidth ] = useState({ mobile: false })

    useEffect(() => {
        onResize()
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
