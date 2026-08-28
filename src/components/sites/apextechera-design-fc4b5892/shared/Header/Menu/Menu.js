
import {$t} from "../../../../../../lib/sites/apextechera-design-fc4b5892/i18n/i18n"
import { useContext, useState } from "react";
import { ControllerContext } from "../../../../../../lib/sites/apextechera-design-fc4b5892/Controller/Controller"
import { ModalContext } from "../../../shared/Modal/Modal"
import { getScreen } from "../../../../../../lib/sites/apextechera-design-fc4b5892/utils"
import { state } from "../../../../../../lib/sites/apextechera-design-fc4b5892/Controller/utils/state"
import { CursorContext, cursorStyles } from "../../Cursor/Cursor"
import cn from "classnames";
import UnderLink from "../../UI/UnderLink/UnderLink"
import AnimateLink from "./AnimateLink"
import { Mail, Phone, X } from "lucide-react";

const InstagramIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const Menu = ({isMenuShow, setIsMenuShow}) => {
  const [ hoveredIndex, setHoveredIndex ] = useState( 0 )
  const { setCursorStyle } = useContext(CursorContext)
  const { setNewActive } = useContext(ControllerContext)
  const { setActiveForm } = useContext(ModalContext)

  const routeToScreen = (link) => {
    if (link === '#contacts') {
      const contactElem = document.getElementById('contacts') || document.querySelector('.req-form');
      if (contactElem) {
        contactElem.scrollIntoView({ behavior: 'smooth' });
      }
      setActiveForm(true);
      setIsMenuShow(false);
      return;
    }
    const screen = getScreen(link)
    if (typeof screen === 'number') {
      setNewActive(screen)
      setTimeout(() => {
        setIsMenuShow(false)
      }, state.externalDelay)
    }
  }

  return (
    <div className={`menu ${isMenuShow ? "-show" : ""}`}>
      {/* Top Right Close 'X' Button */}
      <button
        type="button"
        className="menu__close-btn"
        onClick={() => setIsMenuShow(false)}
        aria-label="Close menu"
        onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_MENU_BTN)}
        onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
      >
        <X size={22} />
      </button>

      <div className="menu__content">
        {/* Left Column: Studio Tagline, Contact Details, Social Channels & Copyright */}
        <div className="menu__left-panel">
          <div className="menu__tagline-box">
            <span className="menu__subhead">APEXTECHERA AGENCY</span>
            <p className="menu__tagline">
              Full-cycle creative & technology agency crafting high-performance web platforms, intelligent AI systems & next-gen digital experiences.
            </p>
          </div>

          <div className="menu__group">
            <span className="menu__subhead">GET IN TOUCH</span>
            <div className="menu__contact-details">
              <a 
                href="mailto:mahendrapra0077@gmail.com" 
                className="menu__contact-item"
                onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
                onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
              >
                <Mail size={16} className="menu__contact-icon" />
                <span>mahendrapra0077@gmail.com</span>
              </a>
              <a 
                href="tel:+917724822660" 
                className="menu__contact-item"
                onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
                onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
              >
                <Phone size={16} className="menu__contact-icon" />
                <span>+91 7724822660</span>
              </a>
            </div>
          </div>

          <div className="menu__group">
            <span className="menu__subhead">FOLLOW US</span>
            <div className="menu__social-row">
              <a 
                href="https://www.instagram.com/apextecheradesign" 
                target="_blank" 
                rel="noreferrer" 
                className="menu__social-btn"
                onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
                onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
              >
                <InstagramIcon size={16} />
                <span>Instagram</span>
              </a>
              <a 
                href="https://www.linkedin.com/company/apextechera" 
                target="_blank" 
                rel="noreferrer" 
                className="menu__social-btn"
                onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
                onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
              >
                <LinkedinIcon size={16} />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          <div className="menu__cp">
            <p className="menu__cp_copyright">&copy; {new Date().getFullYear()} ApexTechEra Agency. All rights reserved.</p>
          </div>
        </div>

        {/* Center: Luxury Agency Logo Card */}
        <div className="menu__img-logo-wrap" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 2.5rem',
          borderRadius: '2rem',
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(243, 244, 248, 0.85) 100%)',
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
          position: 'relative',
          overflow: 'hidden',
          width: '320px',
          height: '420px',
          boxSizing: 'border-box',
        }}>
          {/* Ambient Glowing Aura */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '260px',
            height: '260px',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 70%)',
            filter: 'blur(30px)',
            pointerEvents: 'none',
            borderRadius: '50%',
          }} />

          <img 
            src="/sites/apextechera-design-fc4b5892/root-8a5edab2/images/apextechera-logo.png" 
            alt="ApexTechEra Agency"
            style={{
              width: '100%',
              maxWidth: '240px',
              height: 'auto',
              objectFit: 'contain',
              position: 'relative',
              zIndex: 1,
              filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.08))',
            }}
          />
        </div>

        {/* Right: Navigation Links */}
        <div className="menu__folder">
          <span className="m">{$t("components.menu.nav.title")}</span>
          <div className="list">
            {$t("components.menu.nav.links").map((_, i) => (
              <AnimateLink 
                key={i} 
                onClick={() => { routeToScreen(_.link) }}
                onMouseEnter={() => { setCursorStyle(cursorStyles.HOVER_NAV); setHoveredIndex(i) }}
                onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
              >
                {_.name}
              </AnimateLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Menu;
