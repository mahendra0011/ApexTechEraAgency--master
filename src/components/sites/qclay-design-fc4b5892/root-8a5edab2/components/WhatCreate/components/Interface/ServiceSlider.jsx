import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { context } from '../../../../../../../../lib/sites/qclay-design-fc4b5892/Controller/utils/context'

import SimpleVideoSlider from './SimpleVideoSlider'

const VIDEOS_PATH = '/sites/qclay-design-fc4b5892/root-8a5edab2/video/services'

// The persistent fullscreen surface cycles through these 7 videos in order.
const SLIDER_ORDER = [
  { video: `${VIDEOS_PATH}/service-0-brand-intro.mp4`, caption: '' },
  { video: `${VIDEOS_PATH}/service-1-fullstack.mp4`, caption: 'Full Stack Web Development' },
  { video: `${VIDEOS_PATH}/service-2-uiux.mp4`, caption: 'UI / UX Design' },
  { video: `${VIDEOS_PATH}/service-3-mobileapps.mp4`, caption: 'Android & iOS App Development' },
  { video: `${VIDEOS_PATH}/service-5-aiml.mp4`, caption: 'Build AI / ML Models' },
  { video: `${VIDEOS_PATH}/service-6-clouddevops.mp4`, caption: 'Cloud & DevOps Architecture' },
  { video: `${VIDEOS_PATH}/service-4-customsoftware.mp4`, caption: 'Custom Software Development' }
]

// Accumulated scroll delta needed at sequence boundaries (0 or 6) to exit fullscreen
const NAV_WHEEL_DISTANCE = 350
// Silence duration between wheel bursts before allowing the next slide switch
const NAV_GESTURE_IDLE_MS = 180
// How much of the viewport the swelled video slot must cover before the
// sequence locks. The site's OWN timeline performs the entire entry: the
// interface container scales 1 -> ~9x across the first viewport width of
// scroll (START -> A in timeline.js), so the video arrives from the right
// and swells to fullscreen with the scroll — qclay-style. The overlay only
// intercepts at the very peak (slot covering >= 95% of the viewport) so
// there is never a detached second card.
const COVER_RATIO = 0.95

const ServiceSlider = () => {
  const hostRef = useRef(null)
  const hostVideoRef = useRef(null)
  const portalVideoRef = useRef(null)
  const sliderRef = useRef(null)
  const sequenceActiveRef = useRef(false)
  const reentryLockedUntilRef = useRef(0)
  const sequenceStartRef = useRef(0)
  const indexRef = useRef(0)
  // Once the 7th video hands off, the forward entry stays disabled until the
  // zoom-out has carried the slot back below the cover threshold (or the user
  // scrolls backward to reverse) — otherwise the very next wheel would re-lock
  // the sequence on top of the handoff.
  const handoffPassedRef = useRef(false)

  const navDirRef = useRef(1)
  const boundaryProgressRef = useRef(0)
  const navLastEventRef = useRef(0)
  const navConsumedRef = useRef(false)

  const [index, setIndex] = useState(0)
  const [sequenceActive, setSequenceActive] = useState(false)
  const [morphReady, setMorphReady] = useState(false)
  const [morphVisible, setMorphVisible] = useState(false)
  const [portalReady, setPortalReady] = useState(false)
  const [handoffDone, setHandoffDone] = useState(false)
  const handoffDoneRef = useRef(false)

  const syncPortalTime = () => {
    const host = hostVideoRef.current
    const portal = portalVideoRef.current
    if (!host || !portal) { return }
    try { portal.currentTime = host.currentTime } catch (err) { /* not seekable yet */ }
  }

  const resetExpansion = () => {
    setMorphReady(false)
    setMorphVisible(false)
    setPortalReady(false)
    boundaryProgressRef.current = 0
    navDirRef.current = 1
    navLastEventRef.current = 0
    navConsumedRef.current = false
  }

  const handleNavCommit = (nextIndex) => {
    indexRef.current = nextIndex
    setIndex(nextIndex)
  }

  // The dashboard frame sits at wheel >= 2 * winW on the site's own timeline
  // (C in timeline.js — the container has zoomed back to scale 1 and the
  // skeleton is fully visible). Beyond that point the slot must hide: its
  // host video (custom software) would otherwise sit on top of the
  // dashboard's own Custom Software card and duplicate it. The skeleton /
  // real-dashboard card 5 plays the SAME footage, so hiding the slot hands
  // the video over seamlessly (both card videos are synced to the host's
  // playback position the moment the slot hides).
  useEffect(() => {
    const onCustomWheel = (e) => {
      const wheel = e.detail?.wheel ?? 0
      const shouldHide = wheel >= window.innerWidth * 2
      if (shouldHide === handoffDoneRef.current) { return }
      handoffDoneRef.current = shouldHide
      setHandoffDone(shouldHide)
      if (shouldHide) {
        const hostVideo = hostVideoRef.current
        if (hostVideo && hostVideo.currentTime > 0) {
          const targets = [
            document.querySelector('.apex-skel-card:nth-child(5) video'),
            document.querySelector('.apex-grid-card:nth-child(5) video')
          ]
          targets.forEach((v) => {
            if (!v) { return }
            try { v.currentTime = hostVideo.currentTime } catch (err) { /* not seekable yet */ }
          })
        }
      }
    }
    document.addEventListener('customwheel', onCustomWheel)
    return () => document.removeEventListener('customwheel', onCustomWheel)
  }, [])

  useEffect(() => {
    const slotEl = hostRef.current?.parentElement
    if (!slotEl) { return }
    if (handoffDone) {
      slotEl.classList.add('apex-slot-dashboard-hidden')
    } else {
      slotEl.classList.remove('apex-slot-dashboard-hidden')
    }
  }, [handoffDone])

  useEffect(() => {
    const onWheel = (e) => {
      const host = hostRef.current
      if (!host) { return }

      const delta = e.deltaY
      if (!delta || Math.abs(delta) < 1) { return }
      const direction = delta > 0 ? 1 : -1

      // ---- Fullscreen sequence ACTIVE: 1 gesture = 1 GSAP video switch ----
      if (sequenceActiveRef.current) {
        const now = Date.now()
        if (direction !== navDirRef.current) {
          navDirRef.current = direction
          boundaryProgressRef.current = 0
          navLastEventRef.current = 0
          navConsumedRef.current = false
        }

        if (now - navLastEventRef.current > NAV_GESTURE_IDLE_MS || !sliderRef.current?.isAnimating()) {
          navConsumedRef.current = false
        }
        navLastEventRef.current = now

        const atLastForward = direction > 0 && indexRef.current === SLIDER_ORDER.length - 1
        const atFirstBackward = direction < 0 && indexRef.current === 0

        if (atLastForward) {
          // Forward scroll at Video 6 -> handoff back to the dashboard.
          // qclay-style: release the wheel INSTANTLY and let the site's own
          // timeline perform the zoom-out — the container scales back from
          // the fullscreen peak while the skeleton fades in around the video
          // and the real dashboard crossfades in later — all scroll-scrubbed,
          // exactly like the backward path.
          boundaryProgressRef.current = Math.min(1, boundaryProgressRef.current + Math.abs(delta) / NAV_WHEEL_DISTANCE)
          if (boundaryProgressRef.current >= 1) {
            boundaryProgressRef.current = 0
            handoffPassedRef.current = true
            sequenceActiveRef.current = false
            setSequenceActive(false)
            resetExpansion()
            reentryLockedUntilRef.current = Date.now() + 1500
          }
        } else if (atFirstBackward) {
          // Backward scroll at Video 0 -> collapse back out to previous section / top
          boundaryProgressRef.current = Math.min(1, boundaryProgressRef.current + Math.abs(delta) / NAV_WHEEL_DISTANCE)
          if (boundaryProgressRef.current >= 1) {
            boundaryProgressRef.current = 0
            sequenceActiveRef.current = false
            setSequenceActive(false)
            resetExpansion()
            context.snapWheelTo = true
            context.wheelTo = Math.max(0, window.innerWidth - 100)
            reentryLockedUntilRef.current = Date.now() + 1200
          }
        } else if (navConsumedRef.current) {
          // Gesture consumed, swallow extra ticks in this burst
        } else {
          navConsumedRef.current = true
          if (direction > 0) {
            sliderRef.current?.next()
          } else {
            sliderRef.current?.prev()
          }
        }

        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }

      // ---- Fullscreen sequence is NOT active: check for Forward or Backward Entry ----
      if (Date.now() < reentryLockedUntilRef.current) { return }

      const rect = host.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0
      if (!isVisible) { return }

      const winW = window.innerWidth

      // The site's own timeline performs the whole entry (the interface
      // container swells 1 -> ~9x across the first viewport width of scroll).
      // We only intercept when the swelled video slot actually covers the
      // viewport — the moment the video IS fullscreen — and then lock the
      // wheel there and hand over to the 7-video sequence.
      // After a dashboard visit the host is still on the last video (custom
      // software). A fresh forward entry starts the sequence from video 0, so
      // the host must be back on the brand intro BEFORE the swell — otherwise
      // the video visibly switches at the fullscreen lock. Skipped during the
      // post-handoff zoom-out (handoffPassedRef) where the custom-software
      // footage must stay put. The backward path keeps index 6, matching the
      // backward entry's first video.
      if (direction > 0 && !handoffPassedRef.current && indexRef.current !== 0) {
        indexRef.current = 0
        setIndex(0)
      }

      const isCovered = rect.height >= window.innerHeight * COVER_RATIO
        && rect.width >= window.innerWidth * COVER_RATIO

      // After a handoff the cover zone is still being traversed by the
      // zoom-out. Re-enable the entries only once the slot has dropped below
      // the cover threshold (forward) or the user scrolls back (backward).
      if (handoffPassedRef.current) {
        if (direction < 0 || !isCovered) {
          handoffPassedRef.current = false
        } else {
          return
        }
      }

      const isForwardEntry = direction > 0 && isCovered
      const isBackwardEntry = direction < 0 && isCovered

      if (isForwardEntry) {
        e.preventDefault()
        e.stopImmediatePropagation()
        sequenceStartRef.current = 0
        indexRef.current = 0
        setIndex(0)
        setPortalReady(true)
        setMorphVisible(true)
        setMorphReady(true)
        sequenceActiveRef.current = true
        setSequenceActive(true)
        context.snapWheelTo = true
        context.wheelTo = winW
        return
      }

      if (isBackwardEntry) {
        e.preventDefault()
        e.stopImmediatePropagation()
        const lastIdx = SLIDER_ORDER.length - 1
        sequenceStartRef.current = lastIdx
        indexRef.current = lastIdx
        setIndex(lastIdx)
        setPortalReady(true)
        setMorphVisible(true)
        setMorphReady(true)
        sequenceActiveRef.current = true
        setSequenceActive(true)
        context.snapWheelTo = true
        context.wheelTo = winW * 2
        return
      }
    }

    document.addEventListener('wheel', onWheel, { capture: true, passive: false })
    return () => {
      document.removeEventListener('wheel', onWheel, { capture: true })
    }
  }, [])

  const renderVideo = (className, videoRef, extraProps = {}) => (
    <video
        ref={videoRef}
        key={SLIDER_ORDER[index]?.video || SLIDER_ORDER[0].video}
        className={className}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        {...extraProps}
      >
        <source src={SLIDER_ORDER[index]?.video || SLIDER_ORDER[0].video} type="video/mp4" />
    </video>
  )

  return (
    <>
      <div ref={hostRef} className="apex-slot-slider">
        {renderVideo(`apex-service-video ${portalReady ? 'is-covered' : ''}`, hostVideoRef)}
      </div>
      {sequenceActive && createPortal(
        <div
          className="apex-service-fullscreen"
          aria-label="Service video sequence"
        >
          {renderVideo(
            `apex-service-video apex-service-video--fullscreen ${morphReady ? 'is-hidden' : ''} ${portalReady ? 'is-ready' : ''}`,
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
              onIndexChange={handleNavCommit}
              initialTime={hostVideoRef.current?.currentTime ?? 0}
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