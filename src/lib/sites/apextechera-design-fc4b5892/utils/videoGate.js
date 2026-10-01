/**
 * videoGate — one global IntersectionObserver that keeps only ON-SCREEN
 * videos playing.
 *
 * Android hardware video decoders are capped at a handful of concurrent
 * sessions; the site mounts all 16 sections at once, so every autoplay
 * video (menu dancer, contact dancer, dashboard cards, hand video, …)
 * used to decode simultaneously even while off-screen. That exhausted the
 * decoder pool → frozen/black videos, janky scroll and, on low-end phones,
 * a full browser (or device) hang.
 *
 * Behaviour:
 *  - video scrolls off-screen  → paused (marked data-gate-paused)
 *  - video scrolls on-screen   → resumed ONLY if we were the ones who
 *    paused it, or it carries data-autoplay (explicit opt-in, replaces the
 *    autoPlay attribute so nothing downloads/decodes before first paint)
 *  - hidden tab (visibilitychange) → everything pauses, resumes on return
 *
 * Components that manage playback themselves (SimpleVideoSlider,
 * ServiceSlider) opt out via data-gate-manual.
 */

const SELECTOR = "video[data-autoplay], video[data-gate-paused]";

let observer = null;
let mutationObserver = null;
let started = false;

function shouldPlay(video) {
  if (video.hasAttribute("data-gate-manual")) return false;
  return (
    video.hasAttribute("data-autoplay") ||
    video.getAttribute("data-gate-paused") === "1"
  );
}
function resume(video) {
  if (!video.paused) return;
  video.removeAttribute("data-gate-paused");
  const p = video.play();
  if (p && typeof p.catch === "function") p.catch(() => {});
}

function suspend(video) {
  if (video.paused) return;
  video.pause();
  video.setAttribute("data-gate-paused", "1");
}

function onIntersect(entries) {
  for (const entry of entries) {
    const video = entry.target;
    if (video.hasAttribute("data-gate-manual")) continue; // self-managed
    if (entry.isIntersecting) {
      if (shouldPlay(video)) resume(video);
    } else {
      suspend(video);
    }
  }
}

function watch(video) {
  if (!observer || video.dataset.gateWatched === "1") return;
  if (video.hasAttribute("data-gate-manual")) return;
  video.dataset.gateWatched = "1";
  observer.observe(video);
}

export function startVideoGate() {
  if (started || typeof document === "undefined" || typeof IntersectionObserver === "undefined") return;
  started = true;

  observer = new IntersectionObserver(onIntersect, {
    // threshold 0 => pure enter/leave semantics (a 0.25 threshold would
    // suspend a video that is still 24% visible on its way out).
    // 300px rootMargin pre-loads the next section's videos slightly early
    // so playback starts before the section is fully on screen.
    threshold: 0,
    rootMargin: "300px",
  });

  document.querySelectorAll(SELECTOR).forEach(watch);
  document.querySelectorAll("video[data-gate-manual]").forEach((v) => {
    v.dataset.gateWatched = "1"; // acknowledge: gate must never touch these
  });

  // Sections mount over time (portals, sliders, menu) — keep watching new nodes.
  mutationObserver = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.tagName === "VIDEO") watch(node);
        else if (node.querySelectorAll) node.querySelectorAll(SELECTOR).forEach(watch);
      }
    }
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });

  document.addEventListener("visibilitychange", () => {
    // Only touch videos this gate manages — self-managed sliders own their
    // play/pause state and must not be resurrected behind our back.
    document.querySelectorAll('video[data-gate-watched="1"]').forEach((video) => {
      if (document.hidden) {
        if (!video.paused) {
          video.pause();
          video.setAttribute("data-gate-paused", "1");
        }
      } else if (video.getAttribute("data-gate-paused") === "1") {
        const rect = video.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          resume(video);
        }
      }
    });
  });
}

export default startVideoGate;