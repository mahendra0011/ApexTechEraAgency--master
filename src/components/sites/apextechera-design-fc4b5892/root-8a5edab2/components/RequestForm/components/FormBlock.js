import Form from "./Form/Form"
import SocialItem from "../../../../shared/UI/SocialItem/SocialItem"
import Video from "../../../../shared/UI/Video/Video"
import { $t } from "../../../../../../../lib/sites/apextechera-design-fc4b5892/i18n/i18n"
import { useContext, useEffect } from "react";
import { BreakpointsContext } from "../../../../../../../lib/sites/apextechera-design-fc4b5892/context/breakpointsContext"
import { CursorContext, cursorStyles } from "../../../../shared/Cursor/Cursor"
import UnderLink from "../../../../shared/UI/UnderLink/UnderLink"
import cn from "classnames";
import { ModalContext } from "../../../../shared/Modal/Modal"
import { ControllerContext } from "../../../../../../../lib/sites/apextechera-design-fc4b5892/Controller/Controller"
import { screens } from "../../../constants"
import Clutch from "../../../../shared/Clutch/index"
import { Mail, Phone } from "lucide-react";

const FormBlock = ({ fixed }) => {
  const { isMaxWidth } = useContext(BreakpointsContext);
  const { setCursorStyle } = useContext(CursorContext);
  const { activeForm, setActiveForm, active: modalActive } = useContext(ModalContext);
  const { activeId, active, setNewActive } = useContext(ControllerContext);

  const closeForm = () => {
    if (!isMaxWidth.mobile) {
      return;
    }
    if (activeId !== screens.REQUESTFORM) {
      return;
    }

    setTimeout(() => {
      setActiveForm(false);
      setNewActive(active - 1, true);
    }, 700);
  };

  return (
    <section
      className={cn("req-form", fixed ? "-fixed" : "", activeForm ? "-active" : "", modalActive ? "-success" : "")}
      id="contacts"
    >
      {isMaxWidth.mobile && <div onClick={closeForm} className="req-form__cross"></div>}
      <div className="req-form__content">
        <aside>
          <div className="req-form__text tr-1">
            <h2 className="title">
              Have a project or brand?
            </h2>
            <p>{$t("pages.reqForm.aside.text")}</p>
          </div>

          <div className="req-form__socials">
            <h4 className="tr-2">{$t("pages.reqForm.aside.follow")}</h4>
            <div className="tr-3">
              {$t("pages.reqForm.aside.socials").map((item) => (
                <SocialItem
                  key={item.id}
                  link={item.link}
                  id={item.id}
                  onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
                  onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
                />
              ))}
            </div>
          </div>

          {/* APEXTECHERA 3D DANCING CHARACTER */}
          <div className="contact-pure-dancer">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="contact-pure-dancer-video"
            >
              <source src="/sites/apextechera-design-fc4b5892/root-8a5edab2/video/contact/apextechera-dance_Rumba.webm" type="video/webm" />
              <source src="/sites/apextechera-design-fc4b5892/root-8a5edab2/video/contact/apextechera-dance_Rumba.mov" type="video/quicktime" />
            </video>
          </div>
        </aside>
        <Form />
      </div>

      {/* BOTTOM HORIZONTAL CONTACT BAR */}
      <div className="contact-bottom-bar tr-5">
        <div className="contact-bottom-bar__label">
          <h4>{$t("pages.reqForm.aside.contact")}</h4>
        </div>
        <div className="contact-bottom-bar__links">
          <a
            href="mailto:mahendrapra0077@gmail.com"
            className="contact-card-item"
            onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
            onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
          >
            <span className="contact-card-icon-wrap" style={{ background: "#fee2e2" }}>
              <Mail size={15} color="#dc2626" />
            </span>
            <span className="contact-card-text">mahendrapra0077@gmail.com</span>
          </a>

          <a
            href="tel:+917724822660"
            className="contact-card-item"
            onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
            onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
          >
            <span className="contact-card-icon-wrap" style={{ background: "#dcfce7" }}>
              <Phone size={15} color="#16a34a" />
            </span>
            <span className="contact-card-text">+91 7724822660</span>
          </a>

          <a
            href="https://wa.me/917724822660"
            target="_blank"
            rel="noreferrer"
            className="contact-card-item"
            onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
            onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
          >
            <span className="contact-card-icon-wrap" style={{ background: "#dcfce7" }}>
              <img src="/sites/apextechera-design-fc4b5892/root-8a5edab2/images/wa.svg" alt="WhatsApp" style={{ width: "16px", height: "16px" }} />
            </span>
            <span className="contact-card-text">WhatsApp Direct Chat</span>
          </a>

          <a
            href="https://t.me/apextechera"
            target="_blank"
            rel="noreferrer"
            className="contact-card-item"
            onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
            onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
          >
            <span className="contact-card-icon-wrap" style={{ background: "#e0f2fe" }}>
              <img src="/sites/apextechera-design-fc4b5892/root-8a5edab2/images/telegram.v2.png" alt="Telegram" style={{ width: "16px", height: "16px" }} />
            </span>
            <span className="contact-card-text">Telegram Channel</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FormBlock;
