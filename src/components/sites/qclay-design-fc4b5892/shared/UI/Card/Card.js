
import { useTransform } from "../../../../../../lib/sites/qclay-design-fc4b5892/Controller/hooks/useTransform/index"
import { screens } from "../../../root-8a5edab2/constants"
import { getElementCoords, getScrollCoordsFromElement } from "../../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/coords/index"
import Video from "../Video/Video"
import { useRef } from "react";
import cn from "classnames";
import { memo } from "react";

const Card = memo(function Card({index, color, video, poster, title, text, services}) {
  const { parent, target } = useTransform({ onChange: handler, onResize: handler }, { id: screens.ABOUT })
  const cardRef = useRef()
  function handler({ parent, target }) {
    if (window.innerWidth > 576) {
      onDesktop()
    } else {
      onMobile()
    }
    
    function onDesktop() {
      if (!cardRef.current) { return }
      const distance = getElementCoords(parent).width - getElementCoords(target).width
      const scrollX = distance + getScrollCoordsFromElement(cardRef.current).windowRight.fromRight - 60 - window.innerWidth / window.innerHeight * 100 * (3-index)
      const x = Math.max(Math.min(scrollX, distance), 0)
      target.style.transform = `translate3d(${x}px, 0, 0)`
    }
    function onMobile() {
      if (!cardRef.current) { return }
      const distance = getElementCoords(parent).width - getElementCoords(target).width
      const coef = index === 1 ? 4*index : index === 2 ? 3*index : 20*index
      const scrollX = getScrollCoordsFromElement(cardRef.current).windowBottom.fromBottom - window.innerHeight / coef
      const x = Math.max(Math.min(scrollX, distance), 0)
      target.style.transform = `translate3d(${x}px, 0, 0)`
    }
  }

  return (
    <section ref={cardRef} className={cn('card', 'card-crop')} style={{background: color}}>
      <div ref={parent} className="image__container">
        <div className="circle__crop">
          <div className="circle__container">
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
        </div>
        <div ref={target} className="card__img">
          <div className="video-wrap">
            <div className="video-clip">
              <Video src={video} poster={poster} width={340} height={640}/>
            </div>
          </div>
        </div>
      </div>
      <div className="card__content-bottom">
        <h3>{title}</h3>
        <div className="text__container">
          <p>{text}</p>
          {services && (
            <p style={{ marginTop: '0.65rem', fontWeight: 600, color: '#16a34a', fontSize: '0.85rem' }}>
              <span style={{ color: '#52525b', fontWeight: 500 }}>Services: </span>
              {services}
            </p>
          )}
          <span className="card__index">{index < 9 ? '0' + index : index}</span>
        </div>
      </div>
    </section>
  )
})

export default Card;