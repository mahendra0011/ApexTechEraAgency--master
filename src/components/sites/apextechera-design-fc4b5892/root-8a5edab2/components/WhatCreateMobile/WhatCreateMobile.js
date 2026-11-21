import { useEffect, useRef, useState } from 'react'
import { memo } from 'react'
import { $t } from '../../../../../../lib/sites/apextechera-design-fc4b5892/i18n/i18n'
import './WhatCreateMobile.css'

const SERVICES = [
  { title: 'Full Stack Web Development', tags: ['Next.js', 'React', 'Node'], video: '/sites/apextechera-design-fc4b5892/root-8a5edab2/video/services/service-1-fullstack.mp4', poster: '/images/fullstackwebdevlopment.jpeg' },
  { title: 'UI / UX Design', tags: ['Figma', 'Design System', 'Wireframes'], video: '/sites/apextechera-design-fc4b5892/root-8a5edab2/video/services/service-2-uiux.mp4', poster: '/images/uianduxdesign.jpg' },
  { title: 'Android & iOS App Development', tags: ['iOS / Android', 'React Native'], video: '/sites/apextechera-design-fc4b5892/root-8a5edab2/video/services/service-3-mobileapps.mp4', poster: '/images/androidand%20iosdevelopment.jpg' },
  { title: 'AI Models, Agents & Automations', tags: ['AI Models', 'AI Agents', 'Automations'], video: '/sites/apextechera-design-fc4b5892/root-8a5edab2/video/services/service-5-aiml.mp4', poster: '/images/aimodels.jpg' },
  { title: 'Custom Software Development', tags: ['Enterprise', 'APIs', 'Backend'], video: '/sites/apextechera-design-fc4b5892/root-8a5edab2/video/services/service-4-customsoftware.mp4', poster: '/images/customsoftwaredevelopment.jpg' },
  { title: 'Cloud & DevOps Architecture', tags: ['Cloud', 'Docker', 'CI/CD'], video: '/sites/apextechera-design-fc4b5892/root-8a5edab2/video/services/service-6-clouddevops.mp4', poster: '/images/cloudanddevopsdevelopment.jpg' },
]

const WhatCreateMobile = memo(function WhatCreateMobile({ id }) {
  const cardRefs = useRef([])

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean)
    // Mobile GPUs/decoders choke with 6 simultaneous video sessions. Keep at
    // most 2 playing: the most recently visible cards win, older ones pause
    // until they become the newest visible card again.
    const MAX_PLAYING = 2
    const playing = new Map()

    const playCard = (card) => {
      const video = card.querySelector('video')
      if (!video) return
      playing.delete(video)
      playing.set(video, card)
      if (video.paused) {
        const p = video.play()
        if (p && p.catch) { p.catch(() => {}) }
      }
      while (playing.size > MAX_PLAYING) {
        const oldest = playing.keys().next().value
        playing.delete(oldest)
        oldest.pause()
      }
    }

    const pauseCard = (card) => {
      const video = card.querySelector('video')
      if (!video) return
      playing.delete(video)
      if (!video.paused) { video.pause() }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            playCard(entry.target)
          } else {
            pauseCard(entry.target)
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    )
    cards.forEach((c) => observer.observe(c))

    const onVisibility = () => {
      if (document.hidden) {
        playing.forEach((card) => {
          const video = card.querySelector('video')
          if (video && !video.paused) { video.pause() }
        })
        playing.clear()
        return
      }
      // Resume only what is actually on screen, newest first
      const visible = cards.filter((card) => {
        const rect = card.getBoundingClientRect()
        return rect.bottom > 0 && rect.top < window.innerHeight
      })
      visible.forEach(playCard)
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      playing.clear()
    }
  }, [])

  return (
    <section className="what-create-mobile" id={id || "whatcreate"}>
      <div className="wcm-header">
        <span className="wcm-eyebrow">Agency: ApexTechEra</span>
        <h2 className="wcm-title">What Services We Provide</h2>
      </div>
      <div className="wcm-grid">
        {SERVICES.map((s, i) => (
          <div
            key={s.title}
            ref={(el) => (cardRefs.current[i] = el)}
            className="wcm-card"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className="wcm-card-video">
              <video
                muted
                loop
                playsInline
                preload="none"
                poster={s.poster}
                data-gate-manual
              >
                <source src={s.video} type="video/mp4" />
              </video>
            </div>
            <div className="wcm-card-body">
              <span className="wcm-card-num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="wcm-card-title">{s.title}</h3>
              <div className="wcm-card-tags">
                {s.tags.map((t) => (
                  <span key={t} className="wcm-tag">{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
})

export default WhatCreateMobile