import { createContext, useState, useContext } from 'react'


import CursorWrapper from "./CursorWraper"
import cn from 'classnames'

const CursorContext = createContext()

const cursorStyles = {
    DEFAULT: '',
    HOVER_NAV: '-hover-nav',
    HOVER_MENU_BTN: '-hover-menu-btn',
    HOVER_BUTTON: '-hover-button'
}

const CursorContextProvider = ({ children }) => {
    const [ cursorStyle, setCursorStyle ] = useState( cursorStyles.DEFAULT )

    const value = { cursorStyle, setCursorStyle }

    return (
        <CursorContext.Provider value={value}>
            { children }
        </CursorContext.Provider>
    )
}

const Cursor = () => {
    const { cursorStyle } = useContext(CursorContext)
    return (
        <CursorWrapper>
            <div className={cn('custom-cursor__point', cursorStyle)}></div>
        </CursorWrapper>
    )
}

export { CursorContext, CursorContextProvider, cursorStyles }
export default Cursor