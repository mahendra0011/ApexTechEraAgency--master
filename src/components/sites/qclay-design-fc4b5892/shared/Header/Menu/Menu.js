
import {$t} from "../../../../../../lib/sites/qclay-design-fc4b5892/i18n/i18n"
import { useContext, useState } from "react";
import { ControllerContext } from "../../../../../../lib/sites/qclay-design-fc4b5892/Controller/Controller"
import { getScreen } from "../../../../../../lib/sites/qclay-design-fc4b5892/utils"
import { state } from "../../../../../../lib/sites/qclay-design-fc4b5892/Controller/utils/state"
import { CursorContext, cursorStyles } from "../../Cursor/Cursor"
import cn from "classnames";
import UnderLink from "../../UI/UnderLink/UnderLink"
import AnimateLink from "./AnimateLink"

const menuHovers = [
  {
    className: '-hovered-1',
    video: '/sites/qclay-design-fc4b5892/root-8a5edab2/video/menu/1.mp4',
    poster: '/sites/qclay-design-fc4b5892/root-8a5edab2/video/menu/1-poster.webp',
    color: "#282643"
  },
  {
    className: '-hovered-2',
    video: '/sites/qclay-design-fc4b5892/root-8a5edab2/video/menu/2.mp4',
    poster: '/sites/qclay-design-fc4b5892/root-8a5edab2/video/menu/3-poster.webp',
    color: "#E3F6F5"
  },
  {
    className: '-hovered-3',
    video: '/sites/qclay-design-fc4b5892/root-8a5edab2/video/menu/3.mp4',
    poster: '/sites/qclay-design-fc4b5892/root-8a5edab2/video/menu/3-poster.webp',
    color: "#B9E8E8"
  },
  {
    className: '-hovered-4',
    video: '/sites/qclay-design-fc4b5892/root-8a5edab2/video/menu/4.mp4',
    poster: '/sites/qclay-design-fc4b5892/root-8a5edab2/video/menu/4-poster.webp',
    color: "#2A6A8D"
  },
]

const Menu = ({isMenuShow, setIsMenuShow}) => {
  const [ hoveredIndex, setHoveredIndex ] = useState( 0 )
  const { setCursorStyle } = useContext(CursorContext)
  const { setNewActive } = useContext(ControllerContext)
  const routeToScreen = (link) => {
    const screen = getScreen(link)
    if (typeof screen === 'number') {
      setNewActive(screen)
      setTimeout(() => {
        setIsMenuShow(false)
      }, state.externalDelay)
    }
  }

  return (
    <div className={`menu ${isMenuShow ? "-show" : ""}`}>
      <div className="menu__content">
        <div className="menu__social">
          <span className="m">{$t("components.menu.social.title")}</span>
          {$t("components.menu.social.links").map((_, i) => (
            <AnimateLink 
              className="link" 
              href={_.link} 
              key={i} 
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
              onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
            >
              {_.name}
            </AnimateLink>
          ))}
        </div>
        <div className={cn("menu__img", menuHovers[hoveredIndex].className)}>
            { menuHovers.map(({ color }, i) => (
              <div key={i} className="img-crop" style={{ backgroundColor: color }}>
                {/* <Video src={_.video} poster={_.poster} width={338} height={476} /> */}
              </div>
            )) }
        </div>
        <div className="menu__folder">
          <span className="m">{$t("components.menu.nav.title")}</span>
          <div className="list">
            {$t("components.menu.nav.links").map((_, i) => (
              <AnimateLink 
                key={i} 
                onClick={() => { routeToScreen(_.link) }}
                onMouseEnter={() => { setCursorStyle(cursorStyles.HOVER_NAV); setHoveredIndex(i) }}
                onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
              >
                {_.name}
              </AnimateLink>
            ))}
          </div>
        </div>
      </div>
      <div className="menu__text">
        <div className="mail">
          <a className="mail__text" href="#">{$t("components.menu.connect.text")}</a>
          <UnderLink className="underline" href="mailto:info@qclay.design">{$t("components.menu.connect.mail")}</UnderLink>
        </div>
        <div className="menu__cp">
          <p className="menu__cp_privacy">{$t("components.menu.connect.privacy")}</p>
          <p className="menu__cp_copyright">&copy; QClay Design {new Date().getFullYear()}</p>
        </div>
        {/* <a 
          href="#" 
          className="question"
          onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
          onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
        >{$t("components.menu.connect.question")}</a> */}
      </div>
    </div>
  );
};
export default Menu;
