import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { context } from "../../../../../../../../lib/sites/qclay-design-fc4b5892/Controller/utils/context"
import { screens } from "../../../../constants"

import MorphSlider from './MorphSlider/MorphSlider'

const VIDEOS_PATH = '/sites/qclay-design-fc4b5892/root-8a5edab2/video/create'

/* numbered order for the final white page */
export const SERVICE_SLIDES = [
  {
    num: '01',
    title: 'Full Stack Web Development',
    video: `${VIDEOS_PATH}/service-3-software.mp4`,
    tags: 'Next.js • React • Node • Full-Stack'
  },
  {
    num: '02',
    title: 'UI / UX Design',
    video: `${VIDEOS_PATH}/service-4-uiux.mp4`,
    tags: 'Figma • Design Systems • Wireframes'
  },
  {
    num: '03',
    title: 'Android & iOS App Development',
    video: `${VIDEOS_PATH}/service-2-apps.mp4`,
    tags: 'React Native • iOS/Android • Mobile',
    activeSlot: true
  },
  {
    num: '04',
    title: 'Custom Software Development',
    video: `${VIDEOS_PATH}/service-1-webdev.mp4`,
    tags: 'Enterprise • APIs • Cloud Backend'
  },
  {
    num: '05',
    title: 'Build AI / ML Models',
    video: `${VIDEOS_PATH}/service-5-aiml.mp4`,
    tags: 'Machine Learning • LLMs • Python'
  },
  {
    num: '06',
    title: 'Cloud & DevOps Architecture',
    video: `${VIDEOS_PATH}/service-6-cloud.mp4`,
    tags: 'Docker • CI/CD • AWS/GCP'
  }
]

/* slider order + captions: exactly as user specified */
const SLIDER_ORDER = [
  { video: `${VIDEOS_PATH}/service-1-webdev.mp4`, caption: 'Custom Software Development' },
  { video: `${VIDEOS_PATH}/service-2-apps.mp4`, caption: 'Android & iOS App Development' },
  { video: `${VIDEOS_PATH}/service-3-software.mp4`, caption: 'Full Stack Web Development' },
  { video: `${VIDEOS_PATH}/service-4-uiux.mp4`, caption: 'UI / UX Design' },
  { video: `${VIDEOS_PATH}/service-5-aiml.mp4`, caption: 'Build AI / ML Models' },
  { video: `${VIDEOS_PATH}/service-6-cloud.mp4`, caption: 'Cloud & DevOps Architecture' }
]

let storeState = { index: 0, overview: false }
const storeListeners = []
function setStore(patch) {
  storeState = { ...storeState, ...patch }
  storeListeners.forEach((fn) => fn(storeState))
}
function useStore() {
  const [state, setState] = useState(storeState)
  useEffect(() => {
    storeListeners.push(setState)
    return () => {
      const i = storeListeners.indexOf(setState)
      if (i > -1) { storeListeners.splice(i, 1) }
    }
  }, [])
  return state
}

const ServiceSlider = () => {
  const sliderRef = useRef(null)
  const [lastIndex, setLastIndex] = useState(0)
  const { index } = useStore()

  useEffect(() => {
    sliderRef.current?.goToIndex(index)
  }, [index])

  useEffect(() => {
    const onIndex = (e) => {
      setStore({ index: e.detail.index })
    }
    const onOverview = (e) => {
      setStore({ overview: e.detail.open })
    }
    const onWheel = () => {
      const activeId = context.ids ? context.ids[context.active] : null
      if (activeId && activeId !== screens.WHATCREATE && storeState.overview) {
        setStore({ overview: false })
      }
    }
    window.addEventListener('apex:service-index', onIndex)
    window.addEventListener('apex:service-overview', onOverview)
    document.addEventListener('customwheel', onWheel)
    return () => {
      window.removeEventListener('apex:service-index', onIndex)
      window.removeEventListener('apex:service-overview', onOverview)
      document.removeEventListener('customwheel', onWheel)
    }
  }, [])

  const handleIndexChange = (i) => {
    setLastIndex(i)
    setStore({ index: i })
  }

  const openOverview = () => setStore({ overview: true })

  return (
    <>
      <MorphSlider
        ref={sliderRef}
        items={SLIDER_ORDER}
        transition="melt"
        intensity={0.55}
        aberration={0.35}
        drift={0.4}
        scale={2.4}
        duration={0.8}
        ease="power2.inOut"
        showControls
        showIndicators
        showCaptions={false}
        loop={false}
        onIndexChange={handleIndexChange}
        onOverflow={(dir) => {
          if (dir === 'next') { openOverview() }
        }}
      />
      {lastIndex === SLIDER_ORDER.length - 1 && (
        <button type="button" className="apex-view-all-btn" onClick={openOverview}>
          View All Services
        </button>
      )}
      <ServiceOverview />
    </>
  )
}

const ServiceTag = () => {
  const { index } = useStore()
  return (
    <div className="apex-service-tag-captions">
      {SLIDER_ORDER.map((slide, i) => (
        <span key={i} className={`apex-service-tag-caption ${i === index ? 'is-active' : ''}`}>
          {slide.caption}
        </span>
      ))}
    </div>
  )
}

const ServiceOverview = () => {
  const { overview, index } = useStore()
  const [rendered, setRendered] = useState(false)
  const [visible, setVisible] = useState(false)

  const activeServiceIndex = useMemo(() => {
    const caption = SLIDER_ORDER[index]?.caption
    return Math.max(0, SERVICE_SLIDES.findIndex((s) => s.title === caption))
  }, [index])

  useEffect(() => {
    if (overview) {
      setRendered(true)
      const id = window.setTimeout(() => setVisible(true), 30)
      return () => window.clearTimeout(id)
    }
    setVisible(false)
    const id = window.setTimeout(() => setRendered(false), 600)
    return () => window.clearTimeout(id)
  }, [overview])

  useEffect(() => {
    if (!visible) { return }
    const onKey = (e) => {
      if (e.key === 'Escape') { setStore({ overview: false }) }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [visible])

  if (!rendered) { return null }

  return createPortal(
    <div className={`apex-overview ${visible ? 'is-open' : ''}`} role="dialog" aria-modal="true">
      <div className="apex-overview__inner">
        <div className="apex-overview__head">
          <div>
            <span className="apex-overview__label">Agency: ApexTechEra</span>
            <h2 className="apex-overview__title">What Services We Provide</h2>
          </div>
          <button type="button" className="apex-overview__close" onClick={() => setStore({ overview: false })} aria-label="Close">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="apex-overview__grid">
          {SERVICE_SLIDES.map((slide, i) => (
            <div key={i} className={`apex-overview__card ${i === activeServiceIndex ? 'is-active' : ''}`}>
              <div className="apex-overview__video">
                <video autoPlay muted loop playsInline preload="auto">
                  <source src={slide.video} type="video/mp4" />
                </video>
              </div>
              <div className="apex-overview__meta">
                <span className="apex-overview__num">{slide.num}</span>
                <span className="apex-overview__name">{slide.title}</span>
                {slide.activeSlot && (
                  <span className="apex-overview__badge">Active video preview slot</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="apex-overview__foot">
          <span>Scroll to explore all 6 services — everything fits right into the dashboard.</span>
        </div>
      </div>
    </div>,
    document.body
  )
}

export { ServiceSlider, ServiceTag }
export default ServiceSlider
