const ASSET_ROOT = '/sites/qclay-design-fc4b5892/root-8a5edab2'
const dribble = `${ASSET_ROOT}/icons/dribble.c6e2b9e68082b9bba6386b47e7741bdb.svg`
const behance = `${ASSET_ROOT}/icons/behance.62c30ce6522c4b7ce67f292eadfce66c.svg`
const tiktok = `${ASSET_ROOT}/icons/tiktok.d17c41762a57d02f4192f06f5311dc9a.svg`
const instagram = `${ASSET_ROOT}/icons/instagram.f0d5fc1f9c39c6cb92e2d58164f68345.svg`
import { useStickToMouse } from "../../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/react/hooks/useMouse/useStickToMouse"

const SocialItem = ({theme="light", id, link, onMouseEnter, onMouseLeave}) => {
  const { parent, target } = useStickToMouse()
  const icons = {
    "1-social": dribble,
    "2-social": behance,
    "3-social": tiktok,
    "4-social": instagram,
  }

  return (
      <a ref={r => target.current[0] = r} href={link} target="_blank" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={`social social${theme==="dark" ? "_dark" : ""}`}>
        <img src={icons[id]} alt="social"/>
        <span ref={parent} className="hover"></span>
      </a>
  )
}

export default SocialItem
