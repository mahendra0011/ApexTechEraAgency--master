import { useEffect, useState } from 'react'

// Same 576px breakpoint already used across this section (see the
// "MOBILE / ANDROID RESPONSIVE" media query in ApexDashboard.css and the
// winW <= 576 checks in ServiceSlider.jsx) to distinguish Android/mobile
// responsive from Windows/desktop responsive.
//
// Android's hardware video decoder chokes when several <video> elements
// try to decode concurrently (see the comments in Interface.js and
// ServiceSlider.jsx), which is what caused the "We Create" section to
// hang/freeze on phones. On mobile we swap every <video> in this section
// for a static poster <img> instead — desktop/Windows keeps the videos
// exactly as before.
const MOBILE_BREAKPOINT = 768

// Touch-aware: only treat as "mobile" on actual touch devices, so Windows
// desktop (even with a small resized window) never switches to mobile mode.
function isTouchDevice() {
  if (typeof window === 'undefined') { return false }
  return 'ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0
}

export function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(isTouchDevice() && window.innerWidth <= MOBILE_BREAKPOINT)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile
}

export default useIsMobileViewport
