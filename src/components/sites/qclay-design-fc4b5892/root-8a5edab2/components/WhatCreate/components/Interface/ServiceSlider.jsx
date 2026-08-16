import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import SimpleVideoSlider from './SimpleVideoSlider'

const VIDEOS_PATH = '/sites/qclay-design-fc4b5892/root-8a5edab2/video/services'

// The persistent fullscreen surface cycles through these videos in order.
const SLIDER_ORDER = [
  { video: `${VIDEOS_PATH}/service-1-fullstack.mp4`, caption: 'Full Stack Web Development' },
  { video: `${VIDEOS_PATH}/service-2-uiux.mp4`, caption: 'UI / UX Design' },
  { video: `${VIDEOS_PATH}/service-3-mobileapps.mp4`, caption: 'Android & iOS App Development' },
  { video: `${VIDEOS_PATH}/service-5-aiml.mp4`, caption: 'Build AI / ML Models' },
  { video: `${VIDEOS_PATH}/service-6-clouddevops.mp4`, caption: 'Cloud & DevOps Architecture' },
  { video: `${VIDEOS_PATH}/service-4-customsoftware.mp4`, caption: 'Custom Software Development' }
]

const ServiceSlider = () => {
  const hostRef = useRef(null)
  const hostVideoRef = useRef(null)
  const portalVideoRef = useRef(null)
  const sliderRef = useRef(null)
  const wheelRef = useRef({ carry: 0, direction: 0, lockedUntil: 0 })
  const sequenceActiveRef = useRef(false)
  const sequenceExitingRef = useRef(false)
  const reentryLockedUntilRef = useRef(0)
  const sequenceStartRef = useRef(0)
  const indexRef = useRef(0)
  const [index, setIndex] = useState(0)
  const [sequenceActive, setSequenceActive] = useState(false)
  const [sequenceFrame, setSequenceFrame] = useState(null)
  const [morphReady, setMorphReady] = useState(false)
  const [morphVisible, setMorphVisible] = useState(false)
  const [sequenceLeaving, setSequenceLeaving] = useState(false)
  const [portalReady, setPortalReady] = useState(false)

  // Keep the fullscreen clone's playback position in sync with the small
  // host video it grew out of, so entry doesn't visibly restart from 0.
  const syncPortalTime = () => {
    const host = hostVideoRef.current
    const portal = portalVideoRef.current
    if (!host || !portal) { return }
    try { portal.currentTime = host.currentTime } catch (err) { /* not seekable yet */ }
  }

  useEffect(() => {
    const onWheel = (e) => {
      const host = hostRef.current
      if (!host) { return }
      const rect = host.getBoundingClientRect()
      if (sequenceExitingRef.current) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }
      // The original right-side video first grows naturally. At this point it
      // becomes a real viewport overlay and stays there for all six videos.
      const readyForFullscreen = rect.height >= window.innerHeight * 0.85
      if (!sequenceActiveRef.current && !readyForFullscreen) { return }
      // After exiting the fullscreen sequence, the underlying slot can still
      // measure as "ready" for a moment (the real page scroll hasn't moved
      // yet). Without this lock, the very next wheel tick re-enters
      // fullscreen immediately and the dashboard never becomes visible.
      if (!sequenceActiveRef.current && Date.now() < reentryLockedUntilRef.current) {
        return
      }
      if (!sequenceActiveRef.current) {
        sequenceActiveRef.current = true
        sequenceStartRef.current = indexRef.current
        wheelRef.current = { carry: 0, direction: 0, lockedUntil: Date.now() + 900 }
        setMorphReady(false)
        setMorphVisible(false)
        setSequenceLeaving(false)
        setPortalReady(false)
        setSequenceFrame({ x: rect.left, y: rect.top, width: rect.width, height: rect.height, expanded: false })
        setSequenceActive(true)
        // Give the browser one real paint at the source rectangle first; then
        // expand from that exact rectangle instead of jumping to fullscreen.
        window.setTimeout(() => {
          setSequenceFrame((frame) => frame ? { ...frame, expanded: true } : frame)
        }, 80)
        // Mount the WebGL morph only after the entry video has expanded. This
        // prevents its empty black fallback texture appearing on first entry.
        window.setTimeout(() => setMorphReady(true), 760)
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }

      const delta = e.deltaY
      if (!delta || Math.abs(delta) < 1) { return }
      const direction = delta > 0 ? 1 : -1
      if (direction !== wheelRef.current.direction) {
        wheelRef.current.direction = direction
        wheelRef.current.carry = 0
      }
      wheelRef.current.carry += Math.abs(delta)

      // At the last video, forward scrolling resumes the dashboard. At the
      // first video, backward scrolling removes fullscreen and reverses the
      // original timeline.
      const canAdvance = wheelRef.current.carry >= 700 && Date.now() >= wheelRef.current.lockedUntil
      if (canAdvance && direction > 0 && indexRef.current === SLIDER_ORDER.length - 1) {
        // Put the original pre-dashboard skeleton in place first, then reveal
        // it through the final video instead of abruptly dropping fullscreen.
        sequenceExitingRef.current = true
        setSequenceLeaving(true)
        document.dispatchEvent(new CustomEvent('apex:show-service-skeleton'))
        window.setTimeout(() => {
          sequenceActiveRef.current = false
          sequenceExitingRef.current = false
          setSequenceActive(false)
          setSequenceFrame(null)
          setMorphReady(false)
          setMorphVisible(false)
          setSequenceLeaving(false)
          reentryLockedUntilRef.current = Date.now() + 1500
        }, 720)
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }
      if (canAdvance && direction < 0 && indexRef.current === 0) {
        // Reverse the same fullscreen expansion before handing scrolling back.
        sequenceExitingRef.current = true
        setSequenceFrame((frame) => frame ? { ...frame, expanded: false } : frame)
        window.setTimeout(() => {
          sequenceActiveRef.current = false
          sequenceExitingRef.current = false
          setSequenceActive(false)
          setSequenceFrame(null)
          setMorphReady(false)
          setMorphVisible(false)
          reentryLockedUntilRef.current = Date.now() + 1500
        }, 720)
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }

      e.preventDefault()
      e.stopImmediatePropagation()
      if (!canAdvance) { return }

      wheelRef.current.carry = 0
      wheelRef.current.lockedUntil = Date.now() + 1400
      setMorphVisible(true)
      window.setTimeout(() => {
        direction > 0 ? sliderRef.current?.next() : sliderRef.current?.prev()
      }, 40)
    }
    // Capture phase runs before the site's global scroll controller, allowing
    // this section to hold the timeline in its fullscreen position.
    document.addEventListener('wheel', onWheel, { capture: true, passive: false })
    return () => {
      document.removeEventListener('wheel', onWheel, { capture: true })
    }
  }, [])

  const renderVideo = (className, videoRef, extraProps = {}) => (
    <video
        ref={videoRef}
        key={SLIDER_ORDER[index].video}
        className={className}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        {...extraProps}
      >
        <source src={SLIDER_ORDER[index].video} type="video/mp4" />
    </video>
  )

  return (
    <>
      <div ref={hostRef} className="apex-slot-slider">
        {renderVideo('apex-service-video', hostVideoRef)}
      </div>
      {sequenceActive && createPortal(
        <div
          className={`apex-service-fullscreen ${sequenceFrame?.expanded ? 'is-expanded' : ''}`}
          data-leaving={sequenceLeaving ? 'true' : 'false'}
          style={{
            '--apex-video-x': `${sequenceFrame?.x ?? 0}px`,
            '--apex-video-y': `${sequenceFrame?.y ?? 0}px`,
            '--apex-video-width': `${sequenceFrame?.width ?? window.innerWidth}px`,
            '--apex-video-height': `${sequenceFrame?.height ?? window.innerHeight}px`
          }}
          aria-label="Service video sequence"
        >
          {renderVideo(
            `apex-service-video apex-service-video--fullscreen ${morphVisible ? 'is-hidden' : ''} ${portalReady ? 'is-ready' : ''}`,
            portalVideoRef,
            {
              onLoadedMetadata: () => { syncPortalTime(); setPortalReady(true) },
              onLoadedData: () => { syncPortalTime(); setPortalReady(true) }
            }
          )}
          {morphReady && <div className={`apex-service-morph ${morphVisible ? 'is-visible' : ''}`}>
            <SimpleVideoSlider
              ref={sliderRef}
              items={SLIDER_ORDER}
              startIndex={sequenceStartRef.current}
              duration={0.8}
              onIndexChange={(nextIndex) => {
                indexRef.current = nextIndex
                setIndex(nextIndex)
              }}
            />
          </div>}
        </div>,
        document.body
      )}
    </>
  )
}

export { ServiceSlider }
export default ServiceSlider