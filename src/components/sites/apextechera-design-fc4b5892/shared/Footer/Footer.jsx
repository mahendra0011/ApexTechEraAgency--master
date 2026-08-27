import { memo, useContext } from "react";
import { ModalContext } from "../Modal/Modal";
import { ControllerContext } from "../../../../../lib/sites/apextechera-design-fc4b5892/Controller/Controller";
import { getScreen } from "../../../../../lib/sites/apextechera-design-fc4b5892/utils";
import { 
  ArrowUpRight, 
  ArrowUp, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Sparkles
} from "lucide-react";
import "./Footer.css";

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
);

const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);

const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
);

const TwitterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
);

const NAV_LINKS = [
  { name: "Home", link: "#home" },
  { name: "About Agency", link: "#about" },
  { name: "Services", link: "#services" },
  { name: "Our Process", link: "#process" },
  { name: "Works & Projects", link: "#portfolio" },
  { name: "Contact & Inquiries", link: "#contacts" },
];

const SERVICES_LINKS = [
  { name: "Full Stack Web Apps", link: "#services" },
  { name: "Mobile Apps (iOS & Android)", link: "#services" },
  { name: "UI/UX & Product Design", link: "#services" },
  { name: "Custom Software Solutions", link: "#services" },
  { name: "AI, ML & Automation", link: "#services" },
  { name: "Cloud & DevOps Architecture", link: "#services" },
];

const INDUSTRIES_LINKS = [
  { name: "E-commerce & Retail", link: "#focus" },
  { name: "FinTech & Digital Banking", link: "#focus" },
  { name: "Healthcare & MedTech", link: "#focus" },
  { name: "EdTech & Learning Platforms", link: "#focus" },
  { name: "Real Estate & PropTech", link: "#focus" },
  { name: "Logistics & Supply Chain", link: "#focus" },
];

const SOCIAL_LINKS = [
  { name: "LinkedIn", icon: LinkedInIcon, url: "https://www.linkedin.com/company/apextechera-design/" },
  { name: "Instagram", icon: InstagramIcon, url: "https://www.instagram.com/apextecheradesign" },
  { name: "GitHub", icon: GithubIcon, url: "https://github.com" },
  { name: "X (Twitter)", icon: TwitterIcon, url: "https://twitter.com" },
];

const Footer = memo(function Footer() {
  const { setActiveForm } = useContext(ModalContext);
  const { setNewActive } = useContext(ControllerContext);

  const handleNavClick = (e, link) => {
    e.preventDefault();
    if (link === "#contacts") {
      const contactElem = document.getElementById("contacts") || document.querySelector(".req-form");
      if (contactElem) {
        contactElem.scrollIntoView({ behavior: "smooth" });
      }
      setActiveForm(true);
      return;
    }
    const screen = getScreen(link);
    if (typeof screen === "number") {
      setNewActive(screen);
    }
  };

  const scrollToTop = () => {
    setNewActive(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="agency-footer" id="agency-footer">
      {/* Background Ambient Glows */}
      <div className="footer-ambient-glow" />
      <div className="footer-ambient-glow-2" />

      {/* 1. TOP BIG CTA BANNER */}
      <div className="footer-cta-card">
        <div className="footer-cta-content">
          <div className="footer-cta-badge">
            <span className="footer-pulse-dot" />
            <span>Available For New Projects &bull; 2026</span>
          </div>
          <h2 className="footer-cta-title">
            Have an ambitious idea? <br />
            <span className="footer-cta-title-italic">Let&apos;s engineer it together.</span>
          </h2>
        </div>

        <div className="footer-cta-action">
          <button
            className="footer-cta-btn"
            onClick={() => setActiveForm(true)}
          >
            <span>Start A Project</span>
            <span className="footer-cta-btn-arrow">&#8599;</span>
          </button>
        </div>
      </div>

      {/* 2. DIRECTORY GRID */}
      <div className="footer-grid">
        {/* Column 1: Brand Info */}
        <div className="footer-col-brand">
          <div className="footer-logo-title">
            ApexTechEra <span>.</span>
          </div>
          <p className="footer-brand-desc">
            Global design & software engineering agency creating high-performance digital products for pioneering startups and industry leaders.
          </p>

          <div className="footer-contact-info">
            <a href="mailto:mahendrapra0077@gmail.com" className="footer-contact-link">
              <Mail size={15} />
              <span>mahendrapra0077@gmail.com</span>
            </a>
            <a href="tel:+917724822660" className="footer-contact-link">
              <Phone size={15} />
              <span>+91 7724822660</span>
            </a>
            <div className="footer-contact-link">
              <MapPin size={15} />
              <span>Located in India</span>
            </div>
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div className="footer-col">
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-links-list">
            {NAV_LINKS.map((item) => (
              <li key={item.name}>
                <a
                  href={item.link}
                  className="footer-link"
                  onClick={(e) => handleNavClick(e, item.link)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Services */}
        <div className="footer-col">
          <h4 className="footer-col-title">Services</h4>
          <ul className="footer-links-list">
            {SERVICES_LINKS.map((item) => (
              <li key={item.name}>
                <a
                  href={item.link}
                  className="footer-link"
                  onClick={(e) => handleNavClick(e, item.link)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Industries */}
        <div className="footer-col">
          <h4 className="footer-col-title">Industries</h4>
          <ul className="footer-links-list">
            {INDUSTRIES_LINKS.map((item) => (
              <li key={item.name}>
                <a
                  href={item.link}
                  className="footer-link"
                  onClick={(e) => handleNavClick(e, item.link)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 5: Social & Connect */}
        <div className="footer-col">
          <h4 className="footer-col-title">Connect</h4>
          <div className="footer-socials-grid">
            {SOCIAL_LINKS.map((s) => {
              const IconComp = s.icon;
              return (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                >
                  <IconComp />
                  <span>{s.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. GIANT WATERMARK */}
      <div className="footer-watermark-wrap">
        <h2 className="footer-watermark">APEXTECHERA</h2>
      </div>

      {/* 4. BOTTOM BAR */}
      <div className="footer-bottom-bar">
        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} ApexTechEra Agency. All rights reserved.
        </div>

        <div className="footer-bottom-links">
          <a href="#about" className="footer-bottom-link" onClick={(e) => handleNavClick(e, "#about")}>
            Privacy Policy
          </a>
          <a href="#about" className="footer-bottom-link" onClick={(e) => handleNavClick(e, "#about")}>
            Terms of Service
          </a>
          <button className="footer-scroll-top-btn" onClick={scrollToTop}>
            <span>BACK TO TOP</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
