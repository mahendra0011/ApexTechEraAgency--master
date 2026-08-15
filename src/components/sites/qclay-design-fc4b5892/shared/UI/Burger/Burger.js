
import { $t } from "../../../../../../lib/sites/qclay-design-fc4b5892/i18n/i18n"
import { useStickToMouse } from "../../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/react/hooks/useMouse/useStickToMouse"
import cn from "classnames";
import { mouse } from "../../Cursor/mouse"

const Burger = ({ onClick, isShow, onMouseEnter, onMouseLeave }) => {
  const { parent, target } = useStickToMouse({ onMouseMove: onMouseMoveSticky, onMouseLeave: onMouseLeaveSticky })
  function onMouseMoveSticky() {
    if (!target.current) { return }
    mouse.fix.enabled = true
    mouse.fix.x = target.current[0].getBoundingClientRect().x + target.current[0].getBoundingClientRect().width / 2
    mouse.fix.y = target.current[0].getBoundingClientRect().y + target.current[0].getBoundingClientRect().height / 2
    onMouseEnter()
  }
  function onMouseLeaveSticky() {
    if (mouse.fix.enabled) {
      mouse.fix.enabled = false
      onMouseLeave()
    }
  }

  return (
    <button 
      onClick={onClick} 
      className={`burger button-burger ${isShow ? "-show" : ""}`}
    >
      <span className={`burger-text ${isShow ? "active" : ""}`}>
        <p>{$t("components.burger.close")}</p>
        <p>{$t("components.burger.open")}</p>
      </span>
      <span ref={r => target.current[0] = r} className="btn">
        <span className={cn('line', isShow ? "-show" : "")}></span>
        <span className={cn('line', isShow ? "-show" : "")}></span>
        <span ref={parent} className="hover"></span>
      </span>
    </button>
  );
};

export default Burger;
