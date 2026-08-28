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
            <div className="title">
              <span>{$t("pages.reqForm.aside.question_1")}</span>
              {isMaxWidth.mobile ? (
                <span className="letter">a</span>
              ) : (
                <div className="title_video">
                  <Video
                    src={"/sites/apextechera-design-fc4b5892/root-8a5edab2/video/contact/ch.mp4"}
                    poster={"/sites/apextechera-design-fc4b5892/root-8a5edab2/video/contact/character-poster.webp"}
                    width={75}
                    height={75}
                  ></Video>
                </div>
              )}
              <span>{$t("pages.reqForm.aside.question_2")}</span>
            </div>
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
          <div className="req-form__contacts">
            <h4 className="tr-4">{$t("pages.reqForm.aside.contact")}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "14px" }}>
              <a
                href="mailto:mahendrapra0077@gmail.com"
                className="tr-5"
                style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit" }}
                onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
                onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
              >
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "50%", background: "#f3f4f6", flexShrink: 0 }}>
                  <Mail size={15} color="#ea4335" />
                </span>
                <span style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>mahendrapra0077@gmail.com</span>
              </a>

              <a
                href="tel:+917724822660"
                className="tr-5"
                style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit" }}
                onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
                onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
              >
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "50%", background: "#f3f4f6", flexShrink: 0 }}>
                  <Phone size={15} color="#16a34a" />
                </span>
                <span style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>+91 7724822660</span>
              </a>

              <a
                href="https://wa.me/917724822660"
                target="_blank"
                rel="noreferrer"
                className="tr-5"
                style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit" }}
                onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
                onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
              >
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "50%", background: "#f3f4f6", flexShrink: 0 }}>
                  <img src="/sites/apextechera-design-fc4b5892/root-8a5edab2/images/wa.svg" alt="WhatsApp" style={{ width: "16px", height: "16px" }} />
                </span>
                <span style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>WhatsApp</span>
              </a>

              <a
                href="https://t.me/apextechera"
                target="_blank"
                rel="noreferrer"
                className="tr-5"
                style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit" }}
                onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
                onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
              >
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "50%", background: "#f3f4f6", flexShrink: 0 }}>
                  <img src="/sites/apextechera-design-fc4b5892/root-8a5edab2/images/telegram.v2.png" alt="Telegram" style={{ width: "16px", height: "16px" }} />
                </span>
                <span style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>Telegram</span>
              </a>
            </div>
          </div>
        </aside>
        <Form />
      </div>
      <div className="form-modal-footer">
        <div className="menu__text">
          <div className="mail">
            <a className="mail__text" href="#">
              {$t("components.menu.connect.text")}
            </a>
            <UnderLink className="underline" href="mailto:mahendrapra0077@gmail.com">
              {$t("components.menu.connect.mail")}
            </UnderLink>
          </div>
          <div className="menu__cp">
            <p onClick={closeForm} className="menu__cp_privacy">
              {$t("components.menu.connect.privacy")}
            </p>
            <p className="menu__cp_copyright">&copy; ApexTechEra Agency {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
      <footer className="tr-7 form-modal-desktop-footer">
        <div>
          <a
            href={$t("pages.reqForm.footer.privacy.text")}
            onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
            onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
            className="privacy"
          >
            {$t("pages.reqForm.footer.privacy.text")}
          </a>
        </div>
        <div className="">
          <a
            href="https://apextechera.online/ApextechEraCapabilitiesDeck.v3.pdf"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
            onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
          >
            Our Capabilities Deck
          </a>
          {$t("pages.reqForm.footer.right")}
        </div>
      </footer>
    </section>
  );
};

export default FormBlock;
