

import { useTransform } from "../../../../../../lib/sites/apextechera-design-fc4b5892/Controller/hooks/useTransform/index"
import { screens } from "../../../root-8a5edab2/constants"
import { getElementCoords, getScrollCoordsFromElement } from "../../../../../../lib/sites/apextechera-design-fc4b5892/Animator/js/coords/index"
import Video from "../Video/Video"
import { useRef } from "react";
import cn from "classnames";
import { memo } from "react";

const Card = memo(function Card({ index, color, image, video, poster, title, text, services, screenId = screens.ABOUT }) {
  const { parent, target } = useTransform({ onChange: handler, onResize: handler }, { id: screenId })
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
      const scrollX = distance + getScrollCoordsFromElement(cardRef.current).windowRight.fromRight - 60 - window.innerWidth / window.innerHeight * 100 * (3 - index)
      const x = Math.max(Math.min(scrollX, distance), 0)
      target.style.transform = `translate3d(${x}px, 0, 0)`
    }
    function onMobile() {
      if (!cardRef.current || !parent || !target) { return }
      const parentWidth = parent.offsetWidth || parent.clientWidth || 300
      const targetWidth = target.offsetWidth || target.clientWidth || 160
      const distance = Math.max(0, parentWidth - targetWidth)
      if (distance <= 0) return

      const rect = cardRef.current.getBoundingClientRect()
      const vh = window.innerHeight
      // Card pill animation starts when card top reaches ~62% screen height and completes at ~38% screen height (exact center of focus)
      const startY = vh * 0.62
      const endY = vh * 0.38
      const rawProgress = Math.max(0, Math.min(1, (startY - rect.top) / (startY - endY)))
      // Smooth easeInOutQuad easing for a premium feel
      const easeProgress = rawProgress < 0.5 
        ? 2 * rawProgress * rawProgress 
        : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2

      const x = easeProgress * distance
      target.style.transform = `translate3d(${x}px, 0, 0)`
    }
  }

  const words = typeof title === 'string' ? title.split(' ') : [title]

  return (
    <section ref={cardRef} className={cn('card', 'card-crop')} style={{ background: color }}>
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
              {image ? (
                <img
                  src={image}
                  alt={title}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 'inherit' }}
                />
              ) : (
                <Video src={video} poster={poster} width={340} height={640} />
              )}
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