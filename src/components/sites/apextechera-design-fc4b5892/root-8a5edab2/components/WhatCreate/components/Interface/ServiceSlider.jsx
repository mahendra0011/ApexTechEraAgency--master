import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { context } from '../../../../../../../../lib/sites/apextechera-design-fc4b5892/Controller/utils/context'

import SimpleVideoSlider from './SimpleVideoSlider'

const VIDEOS_PATH = '/sites/apextechera-design-fc4b5892/root-8a5edab2/video/services'

// The persistent fullscreen surface cycles through these 7 videos in order.
const SLIDER_ORDER = [
  { video: `${VIDEOS_PATH}/service-0-brand-intro.mp4`, caption: 'ApexTechEra Agency' },
  { video: `${VIDEOS_PATH}/service-1-fullstack.mp4`, caption: 'Full Stack Web Development' },
  { video: `${VIDEOS_PATH}/service-2-uiux.mp4`, caption: 'UI / UX Design' },
  { video: `${VIDEOS_PATH}/service-3-mobileapps.mp4`, caption: 'Android & iOS App Development' },
  { video: `${VIDEOS_PATH}/service-5-aiml.mp4`, caption: 'AI / ML Models, AI Agents, AI Automations' },
  { video: `${VIDEOS_PATH}/service-6-clouddevops.mp4`, caption: 'Cloud & DevOps Architecture' },
  { video: `${VIDEOS_PATH}/service-4-customsoftware.mp4`, caption: 'Custom Software Development' }
]

// Cooldown between slide transitions: 900ms allows the user to comfortably see and watch each video
const NAV_COOLDOWN_MS = 900
// Deliberate delta threshold required to switch video (prevents accidental multiple-slide skipping)
const NAV_DELTA_THRESHOLD = 50
// Accumulated scroll delta needed at sequence boundaries (0 or 6) to exit fullscreen
const NAV_BOUNDARY_DISTANCE = 160
// How much of the viewport the swelled video slot must cover before the sequence locks
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
  const handoffPassedRef = useRef(false)

  const boundaryDeltaRef = useRef(0)
  const accumulatedDeltaRef = useRef(0)
  const lastSwitchTimeRef = useRef(0)

  const [index, setIndex] = useState(0)
  const [sequenceActive, setSequenceActive] = useState(false)
  const [morphReady, setMorphReady] = useState(false)
  const [morphVisible, setMorphVisible] = useState(false)
  const [portalReady, setPortalReady] = useState(false)

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
    boundaryDeltaRef.current = 0
    accumulatedDeltaRef.current = 0
    lastSwitchTimeRef.current = 0
    // Resume the host slot's own video now that the fullscreen portal (with
    // its own copy of the current video) has closed.
    if (hostVideoRef.current && hostVideoRef.current.paused) {
      const p = hostVideoRef.current.play()
      if (p && p.catch) { p.catch(() => {}) }
    }
  }

  // While the fullscreen portal sequence is open, it plays its own copies of
  // these videos. Keeping the host slot's video ALSO playing (just hidden
  // via opacity) wastes a mobile hardware video-decoder slot and was part of
  // why every video in the fullscreen sequence failed to load on Android —
  // decoders are capped at a small number of concurrent sessions. Pause the
  // host copy as soon as the portal takes over, and only it.
  useEffect(() => {
    if (portalReady && hostVideoRef.current && !hostVideoRef.current.paused) {
      hostVideoRef.current.pause()
    }
  }, [portalReady])

  const handleNavCommit = (nextIndex) => {
    indexRef.current = nextIndex
    setIndex(nextIndex)
  }

  useEffect(() => {
    // Shared gesture processor used by BOTH mouse-wheel (desktop) and
    // touch-swipe (mobile / Android) input. `delta` follows the same sign
    // convention as a native WheelEvent.deltaY: positive = scrolling
    // forward/down, negative = scrolling backward/up.
    // `evt`, when provided and preventable, is used to stop the page's
    // native scroll only in the exact branches that need to take over
    // (entry / active-sequence) — every other scroll passes through
    // untouched, exactly like the original wheel-only behaviour.
    const processGesture = (delta, evt) => {
      const host = hostRef.current
      if (!host) { return }
      if (!delta || Math.abs(delta) < 0.5) { return }
      const direction = delta > 0 ? 1 : -1

      // ---- Fullscreen sequence ACTIVE: smooth gesture video navigation ----
      if (sequenceActiveRef.current) {
        if (evt) { evt.preventDefault(); evt.stopImmediatePropagation && evt.stopImmediatePropagation() }

        const now = Date.now()
        const atLastForward = direction > 0 && indexRef.current === SLIDER_ORDER.length - 1
        const atFirstBackward = direction < 0 && indexRef.current === 0

        // Handle clean exit at boundaries
        if (atLastForward) {
          boundaryDeltaRef.current += Math.abs(delta)
          if (boundaryDeltaRef.current >= NAV_BOUNDARY_DISTANCE) {
            boundaryDeltaRef.current = 0
            handoffPassedRef.current = true
            sequenceActiveRef.current = false
            setSequenceActive(false)
            resetExpansion()
            reentryLockedUntilRef.current = Date.now() + 1500
          }
          return
        }

        if (atFirstBackward) {
          boundaryDeltaRef.current += Math.abs(delta)
          if (boundaryDeltaRef.current >= NAV_BOUNDARY_DISTANCE) {
            boundaryDeltaRef.current = 0
            sequenceActiveRef.current = false
            setSequenceActive(false)
            resetExpansion()
            context.snapWheelTo = true
            context.wheelTo = Math.max(0, window.innerWidth - 100)
            reentryLockedUntilRef.current = Date.now() + 1000
          }
          return
        }

        // Inside sequence: reset boundary exit accumulator
        boundaryDeltaRef.current = 0

        // In cooldown from recent switch: absorb inertia events
        if (now - lastSwitchTimeRef.current < NAV_COOLDOWN_MS) {
          accumulatedDeltaRef.current = 0
          return
        }

        // Reset accumulation if swipe direction inverted
        if ((accumulatedDeltaRef.current > 0 && direction < 0) || (accumulatedDeltaRef.current < 0 && direction > 0)) {
          accumulatedDeltaRef.current = 0
        }
        accumulatedDeltaRef.current += delta

        if (Math.abs(accumulatedDeltaRef.current) >= NAV_DELTA_THRESHOLD) {
          accumulatedDeltaRef.current = 0
          lastSwitchTimeRef.current = now

          if (direction > 0) {
            sliderRef.current?.next()
          } else {
            sliderRef.current?.prev()
          }
        }
        return
      }

      // ---- Fullscreen sequence is NOT active: check for Forward or Backward Entry ----
      if (Date.now() < reentryLockedUntilRef.current) { return }

      const rect = host.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0
      if (!isVisible) { return }

      const winW = window.innerWidth
      // On mobile viewports, the notch/address bar heights can make rect.height/width slightly less than 95% of innerHeight/innerWidth.
      // We check if it covers 85% of screen height/width on mobile, and COVER_RATIO (95%) on desktop.
      const ratio = winW <= 576 ? 0.85 : COVER_RATIO
      const isCovered = rect.height >= window.innerHeight * ratio
        && rect.width >= window.innerWidth * ratio

      console.log('Mobile Check:', {
        rectWidth: rect.width,
        rectHeight: rect.height,
        winW: winW,
        winH: window.innerHeight,
        neededW: winW * ratio,
        neededH: window.innerHeight * ratio,
        isCovered
      })

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
        if (evt) { evt.preventDefault(); evt.stopImmediatePropagation && evt.stopImmediatePropagation() }
        lastSwitchTimeRef.current = Date.now()
        accumulatedDeltaRef.current = 0
        boundaryDeltaRef.current = 0
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
        if (evt) { evt.preventDefault(); evt.stopImmediatePropagation && evt.stopImmediatePropagation() }
        lastSwitchTimeRef.current = Date.now()
        accumulatedDeltaRef.current = 0
        boundaryDeltaRef.current = 0
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
        context.wheelTo = winW <= 576 ? winW + 750 : winW * 2
        return
      }
    }

    const onWheel = (e) => {
      // Support both horizontal touchpad swipes and vertical scroll
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      processGesture(delta, e)
    }

    document.addEventListener('wheel', onWheel, { capture: true, passive: false })

    // ---- Touch support (Android / mobile) ----------------------------------
    // Native touch scrolling never dispatches a `wheel` DOM event, so on
    // Android the listener above never fired and the fullscreen 7-video
    // sequence never activated. We translate touch gestures into the same
    // delta/direction shape used by processGesture() so mobile gets
    // identical forward/backward-entry + in-sequence navigation behaviour.
    // This only ADDS a parallel input path; the wheel path above (desktop)
    // is untouched, so desktop/Windows behaviour cannot change.
    let touchStartY = 0
    let lastTouchY = 0
    let touchActive = false

    const onTouchStart = (e) => {
      const t = e.touches && e.touches[0]
      if (!t) { return }
      touchStartY = t.screenY
      lastTouchY = touchStartY
      touchActive = true
    }

    const onTouchMove = (e) => {
      if (!touchActive) { return }
      const t = e.touches && e.touches[0]
      if (!t) { return }
      const currentY = t.screenY
      // Positive delta = finger moving up the screen = user scrolling
      // forward/down, matching native wheel deltaY's sign convention.
      const deltaY = lastTouchY - currentY
      lastTouchY = currentY
      if (Math.abs(deltaY) < 2) { return }
      processGesture(deltaY, e)
    }

    const onTouchEnd = () => {
      touchActive = false
    }

    document.addEventListener('touchstart', onTouchStart, { capture: true, passive: true })
    document.addEventListener('touchmove', onTouchMove, { capture: true, passive: false })
    document.addEventListener('touchend', onTouchEnd, { capture: true, passive: true })
    document.addEventListener('touchcancel', onTouchEnd, { capture: true, passive: true })

    // ---- Mobile Auto-Trigger via Scroll Position -------------------------
    // Mobile viewports suffer from touchmove events and requestAnimationFrame
    // rendering lag, preventing getBoundingClientRect() from matching the
    // zoomed state synchronously during a gesture. We register a listener
    // on customwheel (dispatched on every animation frame) to accurately
    // detect when the scroll position is at the zoom peak A (window.innerWidth)
    // and activate the fullscreen sequence.
    let lastWheel = 0
    const onCustomWheel = (e) => {
      const winW = window.innerWidth
      if (winW > 576) { return } // ONLY trigger on mobile responsive viewports
      // ONLY trigger when the active section is WhatCreate — customwheel fires
      // for every section's scroll, so without this guard the portal would
      // incorrectly activate on other sections (e.g. About Tech Era).
      if (!context.ids || context.ids[context.active] !== 'whatcreate') { return }

      const wheel = e.detail.wheel
      const direction = wheel > lastWheel ? 1 : -1
      lastWheel = wheel

      if (sequenceActiveRef.current) { return }
      if (Date.now() < reentryLockedUntilRef.current) { return }

      // Peak zoom is at A = window.innerWidth. Check if close to it.
      const isCovered = Math.abs(wheel - winW) < 15

      if (!isCovered) {
        if (Math.abs(wheel - winW) > 50) {
          handoffPassedRef.current = false
        }
        return
      }

      if (handoffPassedRef.current) {
        if (direction < 0) {
          handoffPassedRef.current = false
        } else {
          return
        }
      }

      if (direction > 0) {
        // Forward Entry
        lastSwitchTimeRef.current = Date.now()
        accumulatedDeltaRef.current = 0
        boundaryDeltaRef.current = 0
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
      } else if (direction < 0) {
        // Backward Entry
        lastSwitchTimeRef.current = Date.now()
        accumulatedDeltaRef.current = 0
        boundaryDeltaRef.current = 0
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
        context.wheelTo = winW <= 576 ? winW + 750 : winW * 2
      }
    }

    document.addEventListener('customwheel', onCustomWheel)

    return () => {
      document.removeEventListener('wheel', onWheel, { capture: true })
      document.removeEventListener('touchstart', onTouchStart, { capture: true })
      document.removeEventListener('touchmove', onTouchMove, { capture: true })
      document.removeEventListener('touchend', onTouchEnd, { capture: true })
      document.removeEventListener('touchcancel', onTouchEnd, { capture: true })
      document.removeEventListener('customwheel', onCustomWheel)
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
          <div className="apex-service-morph is-visible">
            <SimpleVideoSlider
              ref={sliderRef}
              items={SLIDER_ORDER}
              startIndex={sequenceStartRef.current}
              onIndexChange={handleNavCommit}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export { ServiceSlider }
export default ServiceSlider
