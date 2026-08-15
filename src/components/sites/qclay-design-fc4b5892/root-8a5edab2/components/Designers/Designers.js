

import {$t} from "../../../../../../lib/sites/qclay-design-fc4b5892/i18n/i18n"
import { screens } from "../../constants"
import { useTransform } from "../../../../../../lib/sites/qclay-design-fc4b5892/Controller/hooks/useTransform/index"
import { itl } from "../../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/utils/itl"
import { Timeline } from "./timeline"
import { useRef, useContext } from "react"
import PortfolioCircle from "../../../shared/PortfolioCircle/PortfolioCircle"
import { BreakpointsContext } from "../../../../../../lib/sites/qclay-design-fc4b5892/context/breakpointsContext"
import cn from "classnames"
import { memo } from 'react'

const avatarsDesktop = [
  '/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/avatars/1.png',
  '/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/avatars/2.webp',
  '/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/avatars/3.png',
  '/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/avatars/4.webp',
  '/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/avatars/5.webp',
  '/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/avatars/6.webp',
  '/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/avatars/7.webp',
  '/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/avatars/8.webp',
  '/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/avatars/9.webp',
]

const avatarsMobile1 = [
  '/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/avatars/1.png',
  '/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/avatars/2.webp',
  '/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/avatars/3.png',
  '/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/avatars/4.webp',
]

const avatarsMobile2 = [
  '/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/avatars/5.webp',
  '/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/avatars/6.webp',
  '/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/avatars/7.webp',
  '/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/avatars/8.webp',
  '/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/avatars/9.webp',
]


const Designers = memo(function Designers() {
  const { parent, target } = useTransform('sticky', { id: screens.DESIGNERS })
  const image1Ref = useRef()
  const image2Ref = useRef()
  const image3Ref = useRef()
  const circleRef = useRef()
  const { isMaxWidth } = useContext(BreakpointsContext)
  return (
    <section ref={parent} className="designers">
      <div ref={target} className="designers__container">
        <div className="text">
          <h2>
            {
              isMaxWidth.mobile
              ? (
                <>
                  <span className="-tr-10">{$t("pages.designers.titleMobile.first")}</span>
                  <span className="-tr-11">{$t("pages.designers.titleMobile.second")}</span>
                  <span className="text__highlight -tr-12">{$t("pages.designers.titleMobile.third")}</span>
                  <span className="-tr-13">
                    {$t("pages.designers.titleMobile.fourth")}
                    <DesignersSubcontent avatars={avatarsMobile1} className={'avatars-mobile-1'} parent={parent} image1Ref={image1Ref} image2Ref={image2Ref} image3Ref={image3Ref} circleRef={circleRef} />
                  </span>
                  <span className="-tr-14">
                    <DesignersSubcontent avatars={avatarsMobile2} className={'avatars-mobile-2'} parent={parent} image1Ref={image1Ref} image2Ref={image2Ref} image3Ref={image3Ref} circleRef={circleRef} />
                    {$t("pages.designers.titleMobile.fifth")}
                  </span>
                </>
              )
              : (
                <>
                  <span className="-tr-10">{$t("pages.designers.title.first")}</span>
                  <span className="text__highlight -tr-11">{$t("pages.designers.title.second")}</span>
                  <span style={{lineHeight: 1.2}} className="-tr-12">
                    <span>{$t("pages.designers.title.third")}</span>
                    <DesignersSubcontent style={{lineHeight: 1.2}} avatars={avatarsDesktop} className={'avatars-mobile-2'} parent={parent} image1Ref={image1Ref} image2Ref={image2Ref} image3Ref={image3Ref} circleRef={circleRef} />
                    <span>{$t("pages.designers.title.fourth")}</span>
                  </span>
                </>
              )
            }
            
          </h2>
        </div>

        <div className="designers__images">
          <div className="designers__image-1">
            <img ref={image1Ref} src={'/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/large.webp'} alt="designers"/>
          </div>

          <div className="designers__image-2">
            <img ref={image2Ref} src={'/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/medium.webp'} alt="designers"/>
          </div>

          <div className="designers__image-3">
            <img ref={image3Ref} src={'/sites/qclay-design-fc4b5892/root-8a5edab2/images/designers/small.webp'} alt="designers"/>
          </div>
        </div>
        <PortfolioCircle ref={circleRef} className="designers__circle"/>
      </div>
    </section>
  )
})

const DesignersSubcontent = ({ parent, image1Ref, image2Ref, image3Ref, circleRef, avatars, className }) => {
  const avatarsRef = useRef()
  const avatarsInnerRef = useRef()
  const textRef = useRef()

  useTransform({ onChange }, { id: screens.DESIGNERS, parent })
  function onChange({ wheel }) {
    const refs = initRefs()
    if (!refs.mounted) { return }
    animate(refs, wheel)
  }

  function initRefs() {
    const avatars = avatarsRef.current
    const text = textRef.current
    const designers = parent.current
    const avatarsInner = avatarsInnerRef.current
    const image1 = image1Ref.current
    const image2 = image2Ref.current
    const image3 = image3Ref.current
    const circle = circleRef.current
    const mounted = avatars && text && avatarsInner && designers && image1 && image2 && image3 && circle
    return { avatars, text, avatarsInner, designers, mounted, image1, image2, image3, circle }
  }

  function animate(refs, wheel) {
    const timeline = Timeline(refs)
    const t = itl(timeline, wheel)
    refs.avatars.style.cssText = `max-width: ${t.avatars.width}rem; opacity: ${t.avatars.opacity};`
    refs.avatarsInner.style.cssText = `transform: translate3d(0, ${t.avatarsInner.y}px, 0) scale(${t.avatarsInner.scale}); opacity: ${t.avatarsInner.opacity};`
    refs.text.style.cssText = `transform: translate3d(0, ${t.text.y}px, 0) scale(${t.text.scale}); opacity: ${t.text.opacity};`
    refs.image1.style.cssText = `transform: translate3d(0, ${t.image.y1}px, 0) rotate(${t.image.r1}deg);`
    refs.image2.style.cssText = `transform: translate3d(0, ${t.image.y2}px, 0) rotate(${t.image.r2}deg);`
    refs.image3.style.cssText = `transform: translate3d(0, ${t.image.y3}px, 0) rotate(${t.image.r3}deg);`
    refs.circle.style.cssText = `transform: translate3d(${t.circle.x}px, 0, 0) scaleY(${t.circle.scale});`
  }

  return (
    <span>
      <span ref={avatarsRef} className={cn("designers__subcontent", className)}>
        <span ref={avatarsInnerRef} className="subcontent__avatars">
          { avatars.map((item, i) => <img key={i} src={item} width={80} height={80} alt=""></img>) }
        </span>
        <span className="subcontent__text"><span ref={textRef}>{$t("pages.designers.title.thousand")}</span></span>
      </span>
    </span>
  )
}

export default Designers