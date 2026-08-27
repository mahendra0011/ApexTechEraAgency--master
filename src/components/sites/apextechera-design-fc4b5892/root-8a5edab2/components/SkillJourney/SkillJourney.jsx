import { useEffect, useRef, memo } from "react";
import { useTransform } from "../../../../../../lib/sites/apextechera-design-fc4b5892/Controller/hooks/useTransform/index";
import { screens } from "../../constants";
import { setToRender, removeFromRender } from "../../../../../../lib/sites/apextechera-design-fc4b5892/Animator/js/renderer";

const IMG = "/sites/apextechera-design-fc4b5892/root-8a5edab2/images/skills";

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

const ITEM_THRESHOLDS = [0.0, 0.23, 0.48, 0.70, 0.90];

const SkillJourney = memo(function SkillJourney() {
  const handLeftRef = useRef(null);
  const handRightRef = useRef(null);
  const handsJoinedRef = useRef(null);
  const glowRef = useRef(null);
  const progressRef = useRef(null);
  const itemRefs = useRef([]);

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
        0.14
      );

      const p = currentProgressRef.current;

      // Transition ranges:
      // Movement phase: p: 0 -> 0.50 (hands glide in from sides to center)
      // Meeting & Handshake: exactly at p = 0.50 (center of section)
      let leftX;
      let rightX;
      if (p <= 0.50) {
        // Move from -35vw to 0vw
        const moveRatio = p / 0.50;
        leftX = -35 + moveRatio * 35;
        rightX = 35 - moveRatio * 35;
      } else {
        leftX = 0;
        rightX = 0;
      }

      // Smooth crossfade around handshake moment (0.46 -> 0.54)
      let individualOpacity = 1;
      let joinedOpacity = 0;

      if (p < 0.46) {
        individualOpacity = 1;
        joinedOpacity = 0;
      } else if (p <= 0.54) {
        const cross = (p - 0.46) / 0.08;
        individualOpacity = 1 - cross;
        joinedOpacity = cross;
      } else {
        individualOpacity = 0;
        joinedOpacity = 1;
      }

      if (handLeftRef.current) {
        handLeftRef.current.style.transform = `translate(calc(-50% + ${leftX}vw), -60%)`;
        handLeftRef.current.style.opacity = String(individualOpacity);
      }
      if (handRightRef.current) {
        handRightRef.current.style.transform = `translate(calc(-50% + ${rightX}vw), -60%)`;
        handRightRef.current.style.opacity = String(individualOpacity);
      }
      if (handsJoinedRef.current) {
        handsJoinedRef.current.style.transform = `translate(-50%, -60%)`;
        handsJoinedRef.current.style.opacity = String(joinedOpacity);
      }

      // Glow scale & opacity: peak intensity right when hands shake in the middle
      let glowScale = 0.1;
      let glowOpacity = 0;
      if (p > 0.35) {
        if (p <= 0.50) {
          const factor = (p - 0.35) / 0.15;
          glowScale = 0.2 + factor * 1.3;
          glowOpacity = factor * 1;
        } else {
          const factor = clamp((p - 0.50) / 0.40, 0, 1);
          glowScale = 1.5 - factor * 0.35;
          glowOpacity = 1 - factor * 0.4;
        }
      }

      if (glowRef.current) {
        glowRef.current.style.opacity = String(glowOpacity);
        glowRef.current.style.transform = `translate(-50%, -60%) scale(${glowScale})`;
      }

      // Progress line:
      // At p = 0: width = 0%
      // At p = 0.50 (handshake): width = 40% (exactly at the center / middle pillar!)
      // At p = 0.92: width = 80% (reaches the final 5th pillar)
      let progressWidth = 0;
      if (p <= 0.92) {
        progressWidth = (p / 0.92) * 80;
      } else {
        progressWidth = 80;
      }

      if (progressRef.current) {
        progressRef.current.style.width = `${progressWidth}%`;
      }

      // Highlight active timeline items
      itemRefs.current.forEach((el, index) => {
        if (!el) return;
        const threshold = ITEM_THRESHOLDS[index];
        const isActive = p >= threshold;
        if (isActive) {
          el.style.opacity = "1";
          el.style.transform = "scale(1.05)";
          el.style.filter = "drop-shadow(0 0 16px rgba(168,85,247,0.6))";
        } else {
          el.style.opacity = "0.45";
          el.style.transform = "scale(0.95)";
          el.style.filter = "none";
        }
      });
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
      className="skill-journey-section relative w-full h-[220vh] bg-gradient-to-b from-[#0c0c16] via-[#180b2e] to-[#07070f] select-none z-10"
    >
      <div
        ref={target}
        className="skill-journey-sticky relative w-full h-screen bg-gradient-to-b from-[#0c0c16] via-[#180b2e] to-[#07070f] overflow-hidden flex flex-col justify-between pt-12 md:pt-16 pb-6 md:pb-10 will-change-transform select-none"
        style={{ paddingTop: "4rem", paddingBottom: "1.5rem" }}
      >
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full bg-purple-700/25 blur-[100px] pointer-events-none -z-10" />

        <h2 className="font-clash text-2xl md:text-5xl font-semibold z-10 text-white text-center flex flex-col gap-0 md:gap-2 relative z-20">
          <span>One Partner. Every Digital Solution.</span>
        </h2>

        <div className="relative w-full flex-grow h-[45vh] md:h-[50vh] mt-4 md:mt-8 flex items-center justify-center pointer-events-none">
          {/* Left Hand */}
          <div
            ref={handLeftRef}
            className="absolute left-1/2 top-1/2 w-[110vw] md:w-[105vw] max-w-[2000px] aspect-[1672/941] flex items-center justify-center z-[15] will-change-transform pointer-events-none"
            style={{ transform: "translate(-50%, -60%)", opacity: 1 }}
          >
            <img
              src={`${IMG}/left_hand_new.png`}
              alt="Left Hand"
              className="w-full h-auto object-contain"
              style={{ transform: "scale(1.12) translate(-1%, -8%)" }}
            />
          </div>

          {/* Right Hand */}
          <div
            ref={handRightRef}
            className="absolute left-1/2 top-1/2 w-[110vw] md:w-[105vw] max-w-[2000px] aspect-[1672/941] flex items-center justify-center z-[10] will-change-transform pointer-events-none"
            style={{ transform: "translate(-50%, -60%)", opacity: 1 }}
          >
            <img
              src={`${IMG}/right_hand_new.png`}
              alt="Right Hand"
              className="w-full h-auto object-contain"
              style={{ transform: "scale(1.12) translate(1%, -8%)" }}
            />
          </div>

          {/* Joined Hands (shows when they meet) */}
          <div
            ref={handsJoinedRef}
            className="absolute left-1/2 top-1/2 w-[110vw] md:w-[105vw] max-w-[2000px] aspect-[1672/941] flex items-center justify-center z-[20] will-change-transform pointer-events-none"
            style={{ transform: "translate(-50%, -60%)", opacity: 0 }}
          >
            <img
              src={`${IMG}/hands_joined_new.png`}
              alt="One Partner Solution"
              className="w-full h-auto object-contain drop-shadow-[0_0_35px_rgba(168,85,247,0.35)]"
            />
          </div>

          {/* Spark Glow */}
          <div
            ref={glowRef}
            className="absolute md:w-[220px] md:h-[220px] w-[120px] h-[120px] left-1/2 top-1/2 pointer-events-none z-20 will-change-transform"
            style={{
              opacity: 0,
              transform: "translate(-50%, -50%) scale(0.1)",
              background: `radial-gradient(
                circle,
                rgba(255, 235, 200, 0.95) 0%,
                rgba(235, 130, 255, 0.8) 25%,
                rgba(147, 51, 234, 0.55) 50%,
                rgba(79, 70, 229, 0.2) 75%,
                transparent 100%
              )`,
              filter: "blur(20px)",
            }}
          />
        </div>

        <div className="w-full block max-w-[1100px] mx-auto px-2 sm:px-6 md:px-12 z-20">
          <div className="relative flex justify-between items-start w-full">
            <div className="absolute left-[10%] right-[10%] top-6 sm:top-8 md:top-10 h-[2px] bg-neutral-800 -z-10" />
            <div
              ref={progressRef}
              className="absolute left-[10%] top-6 sm:top-8 md:top-10 h-[2px] bg-[#7200FF] shadow-[0_0_12px_#9333ea] -z-10"
              style={{ width: "0%" }}
            />
            {skillPillars.map((pillar, index) => (
              <div
                key={pillar.title}
                ref={(el) => { itemRefs.current[index] = el; }}
                className="flex flex-col items-center text-center w-1/5 px-0.5 sm:px-1 md:px-2 transition-all duration-300 ease-out"
                style={{ opacity: index === 0 ? 1 : 0.45 }}
              >
                <div className="relative w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 flex items-center justify-center transition-all duration-300 cursor-pointer">
                  <img
                    src={pillar.imgUrl}
                    className={`w-full h-full object-cover transition-all duration-300 ${pillar.imgClass || ""}`}
                    alt={pillar.title}
                  />
                </div>
                <h3 className="mt-2 sm:mt-4 font-clash text-[10px] sm:text-xs md:text-xl font-semibold text-white leading-tight">
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