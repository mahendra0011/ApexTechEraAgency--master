import TalkButton from "../UI/TalkButton/TalkButton"
import Icon from "../UI/Icon/Icon"
import Burger from "../UI/Burger/Burger"


import {$t} from "../../../../../lib/sites/qclay-design-fc4b5892/i18n/i18n"
import Menu from "./Menu/Menu"
import { useState, useContext } from "react";
import { ControllerContext } from "../../../../../lib/sites/qclay-design-fc4b5892/Controller/Controller"
import { getScreen } from "../../../../../lib/sites/qclay-design-fc4b5892/utils"
import { CursorContext, cursorStyles } from "../Cursor/Cursor"
import { state } from "../../../../../lib/sites/qclay-design-fc4b5892/Controller/utils/state"
import AnimateLink from "./Menu/AnimateLink"

const Header = () => {
  const [isMenuShow, setIsMenuShow] = useState(false)

  const { setNewActive, active } = useContext(ControllerContext)
  const routeToScreen = (link) => {
    const screen = getScreen(link)
    typeof screen === 'number' && setNewActive(screen)
  }
  const routeToScreenAndHideMenu = (link) => {
    const screen = getScreen(link)
    if (active === screen) { return }
    if (typeof screen === 'number') {
      setNewActive(screen)
      setTimeout(() => {
        setIsMenuShow(false)
      }, state.externalDelay)
    }
  }
  
  const { setCursorStyle } = useContext(CursorContext)

  return (
    <div className="header__container">
      <header className={`header ${isMenuShow ? "-show-menu" : ""}`}>
        <Icon 
          onClick={() => routeToScreenAndHideMenu('#home')} 
          className="header__logo" 
          id="logo"
        />
        <div className={`text ${isMenuShow ? "-show-menu" : ""}`}>
          {$t("components.header.nav").map((_, i) => (
            <AnimateLink 
              onClick={() => routeToScreen(_.link)} 
              key={i}
              onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
              onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
            >
              {_.name}
            </AnimateLink>
          ))}
        </div>
        <div className="buttons">
          <TalkButton 
            isShow={isMenuShow} 
            name="black"
            onClick={() => routeToScreenAndHideMenu('#contacts')} 
            onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
            onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
          />
          <Burger 
            isShow={isMenuShow} 
            onClick={() => setIsMenuShow(!isMenuShow)}
            onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_MENU_BTN)}
            onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
          />
        </div>
      </header>
      <Menu isMenuShow={isMenuShow} setIsMenuShow={setIsMenuShow}/>
    </div>
  );
};

export default Header;
