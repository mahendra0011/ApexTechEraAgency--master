
import {useEffect, useState} from "react";
import {$t} from "../../../../../../lib/sites/qclay-design-fc4b5892/i18n/i18n"
import Video from "../Video/Video"
import { useStickToMouse } from "../../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/react/hooks/useMouse/useStickToMouse"

const TalkButton = ({name = "", isShow = false, onMouseEnter, onMouseLeave, onClick}) => {
  const [talkText, handleTalkText] = useState($t("components.header.buttonPh"))
  const { parent, target } = useStickToMouse()

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    function handleResize() {
      if (window.innerWidth < 576) {
        handleTalkText($t("components.header.buttonPh"))
      } else {
        handleTalkText($t("components.header.buttonPc"))
      }
    }
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  switch (name) {
    case "black":
      return (
        <div
          className={`talk-button ${isShow ? "-show-menu" : ""}`}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          ref={r => target.current[0] = r}
        >
          <div className="dot"></div>
          <div className="black-text">{talkText}</div>
          <div className="avatar">
            <Video src={'/sites/qclay-design-fc4b5892/root-8a5edab2/video/contact/ch.mp4'} poster={'/sites/qclay-design-fc4b5892/root-8a5edab2/video/contact/character-poster.web'} width={75} height={75}></Video>
          </div>
          <div ref={parent} className="hover"></div>
        </div>
      );
    default:
      return <div>No button with name {name} found</div>;
  }
};

export default TalkButton;
