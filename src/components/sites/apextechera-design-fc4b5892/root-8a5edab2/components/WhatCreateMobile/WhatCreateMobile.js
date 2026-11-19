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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            const video = entry.target.querySelector('video')
            if (video && video.paused) {
              const p = video.play()
              if (p && p.catch) { p.catch(() => {}) }
            }
          } else {
            const video = entry.target.querySelector('video')
            if (video && !video.paused) { video.pause() }
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    )
    cards.forEach((c) => observer.observe(c))
    return () => observer.disconnect()
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
                data-autoplay
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