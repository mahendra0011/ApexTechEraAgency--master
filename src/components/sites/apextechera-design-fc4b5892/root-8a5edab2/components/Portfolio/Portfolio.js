import './Portfolio.css';
import { useEffect, useRef, useState, useContext, memo } from "react";
import { useTransform } from "../../../../../../lib/sites/apextechera-design-fc4b5892/Controller/hooks/useTransform/index";
import { screens } from "../../constants";
import Slider from "./components/Slider/Slider";
import PortfolioMarquee from "./components/InfiniteMarquee/PortfolioMarquee";
import Video from "../../../shared/UI/Video/Video";
import FewPeople from "./components/FewPeople/FewPeople";
import { getProjects } from "../../../../../../lib/sites/apextechera-design-fc4b5892/api/getProjects";
import RequestForm from "../RequestForm/RequestForm";
import { ModalContext } from "../../../shared/Modal/Modal";

const Portfolio = memo(function Portfolio() {
  const [sliderProps, setSliderProps] = useState({ index: 0, length: 0 });
  const [useMarquee, setUseMarquee] = useState(true);

  const svgRef = useRef();
  const pathRef = useRef();
  const lineRef = useRef();
  const rect = useRef();
  const armRef = useRef();
  const fewPeopleRef = useRef();
  const portfolioContainer = useRef();
  const splitContainerRef = useRef();
  const splitLeftRef = useRef();
  const splitRightRef = useRef();
  const contactRef = useRef();

  const { setActiveForm } = useContext(ModalContext);
  const { parent, target } = useTransform({ onChange }, { id: screens.PORTFOLIO });

  function initRefs() {
    const par = parent.current;
    const tar = target.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    const line = lineRef.current;
    const rec = rect.current;
    const arm = armRef.current;
    const fewPeople = fewPeopleRef.current;
    const portContainer = portfolioContainer.current;
    const splitContainer = splitContainerRef.current;
    const splitLeft = splitLeftRef.current;
    const splitRight = splitRightRef.current;
    const contact = contactRef.current;

    const mounted =
      par &&
      tar &&
      svg &&
      path &&
      line &&
      rec &&
      arm &&
      fewPeople &&
      splitContainer &&
      splitLeft &&
      splitRight &&
      contact;

    return {
      mounted,
      par,
      tar,
      svg,
      path,
      line,
      rec,
      arm,
      fewPeople,
      portContainer,
      splitContainer,
      splitLeft,
      splitRight,
      contact,
    };
  }

  function onChange({ wheel }) {
    const refs = initRefs();
    if (!refs.mounted) return;

    const vh = window.innerHeight;

    // 1. Calculate section boundaries
    const fewPeopleH = refs.fewPeople ? refs.fewPeople.offsetHeight : vh;
    const portContainerH = refs.portContainer ? refs.portContainer.offsetHeight : 2 * vh;
    const targetH = refs.tar ? refs.tar.offsetHeight : 507;

    // 2. Stage 1: Hand video scale & Curved SVG Line drawing
    // Starts as the user finishes scrolling the project cards marquee
    const svgStart = fewPeopleH + portContainerH * 0.45;
    const svgDuration = 0.85 * vh;
    const svgProgress = Math.max(0, Math.min((wheel - svgStart) / svgDuration, 1));

    // Curved SVG line strokeDashoffset: 2500 -> 0
    const svgOffset = 2500 * (1 - svgProgress);
    refs.path.style.strokeDashoffset = `${svgOffset}`;

    // Arm scale down: 1 -> 0
    const armScale = Math.max(0, 1 - svgProgress * 1.2);
    refs.arm.style.transform = `scale(${Math.max(0, Math.min(armScale, 1))})`;

    // 3. Stage 2 & 3: Single Vertical Line & Split Screen Transition
    // splitSticky starts right after target element
    const splitOffset = fewPeopleH + portContainerH + targetH * 0.4;
    const splitTotalH = refs.splitContainer ? refs.splitContainer.offsetHeight : 3 * vh;
    const splitScrollDist = Math.max(1, splitTotalH - vh);

    const splitRaw = Math.max(0, Math.min((wheel - splitOffset) / splitScrollDist, 1));

    // -------------------------------------------------------------
    // A) Vertical Line Drawing (Phase 1: splitRaw 0.0 -> 0.28)
    // -------------------------------------------------------------
    const lineP = Math.max(0, Math.min(splitRaw / 0.28, 1));
    if (refs.rec) {
      refs.rec.style.height = `${lineP * 100}%`;
    }

    // -------------------------------------------------------------
    // B) Split Curtains Parting (Phase 2: splitRaw 0.28 -> 0.75)
    // -------------------------------------------------------------
    let curtainP = 0;
    if (splitRaw > 0.28) {
      curtainP = Math.max(0, Math.min((splitRaw - 0.28) / 0.47, 1));
    }
    const easedCurtain = 1 - Math.pow(1 - curtainP, 3);
    const leftX = -100 * easedCurtain;
    const rightX = 100 * easedCurtain;

    if (refs.splitLeft) {
      refs.splitLeft.style.transform = `translate3d(${leftX}%, 0, 0)`;
      refs.splitLeft.style.visibility = curtainP >= 1 ? 'hidden' : 'visible';
    }
    if (refs.splitRight) {
      refs.splitRight.style.transform = `translate3d(${rightX}%, 0, 0)`;
      refs.splitRight.style.visibility = curtainP >= 1 ? 'hidden' : 'visible';
    }

    // Vertical line fades out as curtains split open
    if (refs.line) {
      const lineOpacity = curtainP > 0 ? Math.max(0, 1 - curtainP * 3.5) : (lineP > 0 ? 1 : 0);
      refs.line.style.opacity = lineOpacity.toString();
      refs.line.style.visibility = lineOpacity > 0 ? 'visible' : 'hidden';
    }

    // -------------------------------------------------------------
    // C) Contact Section Opacity & Usability (Phase 3: splitRaw 0.70 -> 1.0)
    // While split is happening: Opacity = 0
    // When split is complete: Opacity = 100% (fully visible & clickable)
    // -------------------------------------------------------------
    let contactP = 0;
    if (splitRaw > 0.70) {
      contactP = Math.max(0, Math.min((splitRaw - 0.70) / 0.30, 1));
    }
    const contactEased = 1 - Math.pow(1 - contactP, 2);

    if (refs.contact) {
      refs.contact.style.opacity = contactEased.toString();
      refs.contact.style.visibility = contactP > 0 ? 'visible' : 'hidden';
      refs.contact.style.pointerEvents = contactP > 0.5 ? 'auto' : 'none';
      refs.contact.style.transform = `translate3d(0, ${(1 - contactEased) * 20}px, 0)`;
    }

    const innerForm = refs.contact.querySelector('.req-form');
    if (innerForm) {
      innerForm.style.setProperty('opacity', contactEased.toString(), 'important');
      innerForm.style.setProperty('visibility', contactP > 0 ? 'visible' : 'hidden', 'important');
      innerForm.style.setProperty('pointer-events', contactP > 0.5 ? 'auto' : 'none', 'important');
      innerForm.style.setProperty('transform', `translateY(${(1 - contactEased) * 20}px)`, 'important');
    }
  }

  const splitSticky = useTransform('sticky', {
    id: screens.PORTFOLIO,
    parent: splitContainerRef,
    upperElements: [fewPeopleRef, portfolioContainer, target],
  });

  const defaultProjects = [
    { title: ["ApiFlowy", "API Workflow & Automation"], poster: "apiflowy.png", link: "https://apiflowy.onrender.com/", theme: "dark" },
    { title: ["FakeGuard AI", "AI Deepfake & Content Detection"], poster: "fakeguardai.png", link: "", theme: "dark" },
    { title: ["IronForge", "Fitness & Coaching App"], poster: "ironforge.png", link: "", theme: "dark" },
    { title: ["CloudNest", "Cloud Storage & File Sync"], poster: "cloudNest.png", link: "", theme: "dark" },
    { title: ["MCode", "Full-Stack Dev Platform"], poster: "mcode.png", link: "", theme: "dark" },
    { title: ["MCode CLI", "Developer CLI Tool"], poster: "mcode cli.png", link: "", theme: "dark" },
    { title: ["Lost & Found", "Community Discovery Hub"], poster: "lost-and-found.png", link: "", theme: "dark" },
    { title: ["Bun in a Million", "Food Delivery & Brand Platform"], poster: "buiinamillion.png", link: "", theme: "dark" },
    { title: ["MindSupport", "Mental Wellness & Therapy"], poster: "mindsupport.png", link: "", theme: "dark" },
    { title: ["iShipGreen", "Sustainable Logistics Platform"], poster: "project1.png", link: "https://ishipgreen.netlify.app/", theme: "light" },
    { title: ["MarketPro", "E-Commerce Marketplace"], poster: "maketpro.png", link: "https://marketpro-demo.vercel.app/", theme: "light" },
    { title: ["Natchkin", "Creative Studio & Brand"], poster: "natchkin.png", link: "https://natchkin.com/", theme: "light" },
    { title: ["Movix", "Movies & Entertainment Portal"], poster: "movix.png", link: "", theme: "light" },
    { title: ["StudyBuddy", "AI Study Companion"], poster: "studybuddy.png", link: "", theme: "light" },
    { title: ["TempTalk", "Anonymous Messaging App"], poster: "temptalk.png", link: "", theme: "light" },
    { title: ["RentPe", "Rental & Real Estate Portal"], poster: "rentpe.png", link: "", theme: "light" },
    { title: ["MediCore", "Healthcare & Telemedicine"], poster: "medicore.png", link: "", theme: "light" },
    { title: ["Evento", "Event Management Platform"], poster: "evento.png", link: "", theme: "light" },
    { title: ["FrontCrafter", "Frontend Component Studio"], poster: "FrontCrafter.png", link: "", theme: "light" },
    { title: ["IntegrateKit", "API Integration Suite"], poster: "IntegrateKit.png", link: "", theme: "light" },
    { title: ["Bridge", "Data & System Bridge"], poster: "Bridge.png", link: "", theme: "light" },
    { title: ["DesignDroid", "AI Design Assistant"], poster: "designdroid.png", link: "", theme: "light" },
    { title: ["ModernIcons", "Icon Customizer & SVG Library"], poster: "modernicons.png", link: "", theme: "light" },
    { title: ["Modern UI", "Design System & Component Library"], poster: "MUI.png", link: "", theme: "light" }
  ];

  const [Projects, setProjects] = useState(defaultProjects);
  useEffect(() => {
    getProjects().then((data) => {
      if (Array.isArray(data) && data.length) setProjects(data);
      else setProjects(defaultProjects);
    }).catch(() => {
      setProjects(defaultProjects);
    });
  }, []);

  const sticky = useTransform('sticky', {
    id: screens.PORTFOLIO,
    parent: portfolioContainer,
    cropMax: true,
    upperElements: [fewPeopleRef],
  });

  return (
    <section ref={parent} className="portfolio" id="portfolio">
      <div ref={fewPeopleRef}>
        <FewPeople />
      </div>

      <div ref={portfolioContainer} className="portfolio__container">
        <div ref={sticky.target} className="portfolio__sticky">
          {Projects && Projects.length > 0 && (
            useMarquee ? (
              <PortfolioMarquee slides={Projects} />
            ) : (
              <Slider className="portfolio__slider" slides={Projects} onChange={(props) => setSliderProps(props)}>
                <p className="pagination-number">
                  {sliderProps.index + 1 < 10 ? '0' + (sliderProps.index + 1) : sliderProps.index + 1} /{' '}
                  {sliderProps.length < 10 ? '0' + sliderProps.length : sliderProps.length}
                </p>
              </Slider>
            )
          )}
        </div>
      </div>

      <div ref={target} className="portfolio__animation">
        <div className="arm">
          <div ref={armRef}>
            <Video
              src={'/sites/apextechera-design-fc4b5892/root-8a5edab2/video/portfolio/hand.mp4'}
              poster={'/sites/apextechera-design-fc4b5892/root-8a5edab2/video/portfolio/hand.webp'}
              width={140}
              height={140}
            />
          </div>
        </div>
        <svg ref={svgRef} className="line" width="1728" height="507" viewBox="0 0 1728 507" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            ref={pathRef}
            d="M1636.5 -0.5C1636.67 46.5 1689.5 135.5 1442.5 74C1223.74 19.5295 1175 151.5 1232.5 117C1257.48 102.013 1263.5 63.7338 1171.5 82C1071.3 101.895 863.504 163 864.504 293V507.5"
            strokeDasharray="2500"
            strokeDashoffset="2500"
            stroke="white"
          />
        </svg>
      </div>

      {/* SINGLE UNIFIED SPLIT SCREEN SECTION */}
      <div ref={splitContainerRef} className="portfolio__split">
        <div ref={splitSticky.target} className="portfolio__split-sticky">
          {/* Layer 1: Contact Section */}
          <div ref={contactRef} className="portfolio__split-contact">
            <RequestForm />
            <button
              className="portfolio__split-mobile"
              onClick={() => setActiveForm(true)}
            >
              Have a project? Let&apos;s build it
            </button>
          </div>

          {/* Layer 2: Split Curtains (Left & Right halves) */}
          <div ref={splitLeftRef} className="portfolio__split-half -left"></div>
          <div ref={splitRightRef} className="portfolio__split-half -right"></div>

          {/* Layer 3: Single Central Vertical Line */}
          <div ref={lineRef} className="portfolio__split-line">
            <div ref={rect} className="portfolio__split-line-inner"></div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Portfolio;