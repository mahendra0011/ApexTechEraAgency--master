import { useEffect, useRef, memo } from "react";
import { useTransform } from "../../../../../../lib/sites/qclay-design-fc4b5892/Controller/hooks/useTransform/index";
import { screens } from "../../constants";
import { setToRender, removeFromRender } from "../../../../../../lib/sites/qclay-design-fc4b5892/Animator/js/renderer";

const IMG = "/sites/qclay-design-fc4b5892/root-8a5edab2/images/skills";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (a, b, t) => a + (b - a) * t;

const skillPillars = [
  {
    title: "Web Development",
    desc: "Scalable websites and powerful web apps.",
    imgUrl: `${IMG}/webdev.png`,
  },
  {
    title: "Software Development",
    desc: "Custom software engineered for your unique needs.",
    imgUrl: `${IMG}/software.png`,
    imgClass: "scale-[0.85]",
  },
  {
    title: "Mobile App Development",
    desc: "Native-quality Android & iOS experiences.",
    imgUrl: `${IMG}/android.png`,
  },
  {
    title: "UI/UX Design",
    desc: "Beautiful interfaces. Seamless experiences.",
    imgUrl: `${IMG}/uiux.png`,
  },
  {
    title: "AI & ML Development",
    desc: "Intelligent solutions powered by AI and machine learning.",
    imgUrl: `${IMG}/ai.png`,
  },
];

const SkillJourney = memo(function SkillJourney() {
  const handLeftRef = useRef(null);
  const handRightRef = useRef(null);
  const glowRef = useRef(null);
  const progressRef = useRef(null);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  const { parent, target } = useTransform({ onChange }, { id: screens.SKILLJOURNEY });

  function onChange({ wheel }) {
    if (typeof wheel !== "number") return;
    if (target.current) {
      target.current.style.transform = `translate3d(0, ${wheel}px, 0)`;
    }
    if (parent.current) {
      const parentH = parent.current.getBoundingClientRect().height;
      const maxScroll = Math.max(1, parentH - window.innerHeight);
      targetProgressRef.current = clamp(wheel / maxScroll, 0, 1);
    }
  }

  useEffect(() => {
    const label = `SkillJourneyAnimation_${Date.now()}`;

    // 60fps/120fps smooth lerp render loop
    const renderLoop = () => {
      currentProgressRef.current = lerp(
        currentProgressRef.current,
        targetProgressRef.current,
        0.12
      );

      const p = currentProgressRef.current;

      // Sheryians exact formulas:
      // Left hand: [0, 0.9, 1] -> [-55vw, 5vw, 5vw]
      let leftX;
      if (p <= 0.9) {
        leftX = -55 + (p / 0.9) * 60;
      } else {
        leftX = 5;
      }

      // Right hand: [0, 0.9, 1] -> [55vw, -5vw, -5vw]
      let rightX;
      if (p <= 0.9) {
        rightX = 55 - (p / 0.9) * 60;
      } else {
        rightX = -5;
      }

      if (handLeftRef.current) {
        handLeftRef.current.style.transform = `translateX(${leftX}vw) translateY(-50%)`;
      }
      if (handRightRef.current) {
        handRightRef.current.style.transform = `translateX(${rightX}vw) translateY(-50%)`;
      }

      // Glow scale & opacity: [0, 0.82, 1] -> [0.1, 0.1, 1.2] & [0, 0, 0.95]
      let glowScale = 0.1;
      let glowOpacity = 0;
      if (p > 0.82) {
        const glowFactor = clamp((p - 0.82) / 0.18, 0, 1);
        glowScale = 0.1 + glowFactor * 1.1;
        glowOpacity = glowFactor * 0.95;
      }

      if (glowRef.current) {
        glowRef.current.style.opacity = String(glowOpacity);
        glowRef.current.style.transform = `translate(-50%, -50%) scale(${glowScale})`;
      }

      // Progress line: [0, 0.63, 0.9, 1] -> [0%, 0%, 80%, 80%]
      let progressWidth = 0;
      if (p > 0.63) {
        if (p <= 0.9) {
          progressWidth = ((p - 0.63) / 0.27) * 80;
        } else {
          progressWidth = 80;
        }
      }

      if (progressRef.current) {
        progressRef.current.style.width = `${progressWidth}%`;
      }
    };

    setToRender({ label, handler: renderLoop });

    return () => {
      removeFromRender(label);
    };
  }, []);

  return (
    <section
      ref={parent}
      id="skill-journey"
      className="skill-journey-section relative w-full h-[300vh] bg-gradient-to-b from-[#0c0c16] via-[#180b2e] to-[#07070f] select-none z-10"
    >
      <div
        ref={target}
        className="skill-journey-sticky relative w-full h-screen bg-gradient-to-b from-[#0c0c16] via-[#180b2e] to-[#07070f] overflow-hidden flex flex-col justify-between pt-12 md:pt-16 pb-6 md:pb-10 will-change-transform select-none"
        style={{ paddingTop: "4rem", paddingBottom: "1.5rem" }}
      >
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full bg-purple-700/25 blur-[100px] pointer-events-none -z-10" />

        <h2 className="font-clash text-2xl md:text-5xl font-semibold z-10 text-white text-center flex flex-col gap-0 md:gap-2">
          <span>One Partner. Every Digital Solution.</span>
        </h2>

        <div className="relative w-full flex-grow h-[45vh] md:h-[50vh] mt-20 md:mt-32 flex items-center justify-center pointer-events-none" style={{ marginTop: "7rem" }}>
          <div
            ref={handLeftRef}
            className="absolute right-1/2 top-1/2 w-[60vw] md:w-[60vw] z-11 aspect-[16/9] will-change-transform pointer-events-none"
            style={{ transform: "translateX(-55vw) translateY(-50%)" }}
          >
            <img
              src={`${IMG}/hand_left_clean.png`}
              alt="Human Hand"
              className="w-full h-full object-contain"
              style={{ mixBlendMode: "screen" }}
            />
          </div>
          <div
            ref={handRightRef}
            className="absolute left-1/2 top-1/2 w-[60vw] md:w-[60vw] z-11 aspect-[16/9] will-change-transform pointer-events-none"
            style={{ transform: "translateX(55vw) translateY(-50%)" }}
          >
            <img
              src={`${IMG}/robo_hand_clean.png`}
              alt="Robot Hand"
              className="w-full h-full object-contain"
              style={{ mixBlendMode: "screen" }}
            />
          </div>
          <div
            ref={glowRef}
            className="absolute md:w-[200px] md:h-[200px] w-[100px] h-[100px] left-1/2 top-[20%] sm:top-[15%] md:top-[20%] lg:top-[25%] xl:top-[3%] pointer-events-none z-20 will-change-transform"
            style={{
              opacity: 0,
              transform: "translate(-50%, -50%) scale(0.1)",
              background: `radial-gradient(
                circle,
                rgba(255, 184, 140, 0.95) 0%,
                rgba(255, 184, 140, 0.75) 12%,
                rgba(196, 88, 255, 0.75) 35%,
                rgba(135, 40, 255, 0.45) 58%,
                rgba(85, 0, 160, 0.18) 78%,
                transparent 100%
              )`,
              filter: "blur(24px)",
            }}
          />
        </div>

        <div className="w-full hidden min-[380px]:block max-w-[1100px] mx-auto px-4 md:px-12 z-20">
          <div className="relative flex justify-between items-start w-full">
            <div className="absolute left-[10%] right-[10%] top-8 md:top-10 h-[2px] bg-neutral-800 -z-10" />
            <div
              ref={progressRef}
              className="absolute left-[10%] top-8 md:top-10 h-[2px] bg-[#7200FF] shadow-[0_0_10px_#7200FF] -z-10"
              style={{ width: "0%" }}
            />
            {skillPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="flex flex-col items-center text-center w-1/5 px-1 md:px-2"
              >
                <div className="relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center transition-all duration-500 cursor-pointer">
                  <img
                    src={pillar.imgUrl}
                    className={`w-full h-full object-cover transition-all duration-500 ${pillar.imgClass || ""}`}
                    alt={pillar.title}
                  />
                </div>
                <h3 className="mt-4 font-clash text-xs md:text-xl font-semibold text-white">
                  {pillar.title}
                </h3>
                <p className="hidden md:block mt-2 font-helvetica text-[0.85rem] text-neutral-400 leading-relaxed max-w-[180px]">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default SkillJourney;