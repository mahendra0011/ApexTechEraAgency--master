import { useContext, useRef, memo } from "react";
import { $t } from "../../../../../../lib/sites/apextechera-design-fc4b5892/i18n/i18n";
import RandomSpelling from "../../../shared/RandomSpelling/RandomSpelling";
import Canvas from "../Portfolio/Canvas/Canvas";
import CursorWrapper from "../../../shared/Cursor/CursorWraper";
import { useTransform } from "../../../../../../lib/sites/apextechera-design-fc4b5892/Controller/hooks/useTransform/index";
import { screens } from "../../constants";
import { BreakpointsContext } from "../../../../../../lib/sites/apextechera-design-fc4b5892/context/breakpointsContext";
import "./Following.css";

const Following = memo(function Following() {
  const { isMaxWidth } = useContext(BreakpointsContext);

  const lineRef = useRef();
  const lineFillRef = useRef();
  const splitLeftRef = useRef();
  const splitRightRef = useRef();
  const follParentRef = useRef();
  const canvasRef = useRef();
  const cubeRef = useRef();

  const { parent } = useTransform({ onChange }, { id: screens.FOLLOWED });
  const wrapSticky = useTransform("sticky", { id: screens.FOLLOWED, parent });

  function onChange({ wheel }) {
    const par = parent.current;
    const line = lineRef.current;
    const lineFill = lineFillRef.current;
    const splitLeft = splitLeftRef.current;
    const splitRight = splitRightRef.current;
    const follParent = follParentRef.current;
    const cube = cubeRef.current;
    if (!par || !line || !lineFill || !splitLeft || !splitRight || !follParent || !cube) {
      return;
    }

    const dist = par.getBoundingClientRect().height - window.innerHeight;
    if (dist <= 0) {
      return;
    }

    const progress = Math.max(0, Math.min(wheel / dist, 1));

    // Phase 1: Vertical line draws from top to bottom (0.0 -> 0.15)
    const lineP = Math.max(0, Math.min(progress / 0.15, 1));
    lineFill.style.height = `${lineP * 100}%`;

    // Phase 2: Split Curtains Parting (0.15 -> 0.40)
    let splitP = 0;
    if (progress > 0.15) {
      splitP = Math.max(0, Math.min((progress - 0.15) / 0.25, 1));
    }
    const easedSplit = 1 - Math.pow(1 - splitP, 3);
    const leftX = -100 * easedSplit;
    const rightX = 100 * easedSplit;

    splitLeft.style.transform = `translate3d(${leftX}%, 0, 0)`;
    splitLeft.style.visibility = splitP >= 1 ? "hidden" : "visible";

    splitRight.style.transform = `translate3d(${rightX}%, 0, 0)`;
    splitRight.style.visibility = splitP >= 1 ? "hidden" : "visible";

    // Line fades out as curtains open
    const lineOpacity = splitP > 0 ? Math.max(0, 1 - splitP * 3) : 1;
    line.style.opacity = lineOpacity.toString();
    line.style.visibility = lineOpacity > 0 ? "visible" : "hidden";

    // Phase 3 & 4: 3D Cube Rotation to Face 2 (0.45 -> 0.80)
    let rotateDeg = 90;
    if (progress > 0.45) {
      const rotateP = Math.max(0, Math.min((progress - 0.45) / 0.35, 1));
      const easedRotate =
        rotateP < 0.5
          ? 4 * rotateP * rotateP * rotateP
          : 1 - Math.pow(-2 * rotateP + 2, 3) / 2;
      rotateDeg = 90 - easedRotate * 90; // 90deg -> 0deg
    }

    cube.style.transform = `rotateY(${rotateDeg}deg)`;
  }

  // 9 bold, wide lines to fill the wide 3D face edge-to-edge
  const rows = Array.from({ length: 9 }, (_, i) => i);

  return (
    <section ref={parent} id={screens.FOLLOWED} className="portfolio following">
      <div ref={wrapSticky.target} className="following__sticky">
        {/* Layer 1: White 3D Scene */}
        <div ref={follParentRef} className="portfolio__following -active">
          <div className="following-sticky">
            <div ref={canvasRef} className="canvas">
              <Canvas parent={wrapSticky.target} isActive={true} />
            </div>
            <div className="following__cube">
              <div ref={cubeRef} className="cude__wrapper" style={{ transform: "rotateY(90deg)" }}>
                {/* Face 1: Wide, bold 'WE TURN IDEAS INTO REALITY' */}
                <div className="cube__center">
                  <div className="cube__center-lines">
                    {rows.map((rowIdx) => (
                      <div key={rowIdx} className="cube__center-row">
                        <RandomSpelling disable={isMaxWidth["mobile"]}>
                          WE TURN IDEAS INTO REALITY
                        </RandomSpelling>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Face 2: Wide 'ON THE WEB, ON MOBILE, IN SOFTWARE, IN DESIGN...' */}
                <div className="cube__right">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 667 538"
                    preserveAspectRatio="xMidYMid meet"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g className="cube-link">
                      <rect y="0" width="667" height="90" fill="transparent" />
                      <text
                        x="0"
                        y="75"
                        fill="#111827"
                        fontSize="75"
                        fontWeight="700"
                        letterSpacing="-1px"
                      >
                        ON THE WEB
                      </text>
                    </g>
                    <g className="cube-link">
                      <rect y="90" width="667" height="90" fill="transparent" />
                      <text
                        x="0"
                        y="165"
                        fill="#111827"
                        fontSize="75"
                        fontWeight="700"
                        letterSpacing="-1px"
                      >
                        ON MOBILE
                      </text>
                    </g>
                    <g className="cube-link">
                      <rect y="180" width="667" height="90" fill="transparent" />
                      <text
                        x="0"
                        y="255"
                        fill="#111827"
                        fontSize="75"
                        fontWeight="700"
                        letterSpacing="-1px"
                      >
                        IN SOFTWARE
                      </text>
                    </g>
                    <g className="cube-link">
                      <rect y="270" width="667" height="90" fill="transparent" />
                      <text
                        x="0"
                        y="345"
                        fill="#111827"
                        fontSize="75"
                        fontWeight="700"
                        letterSpacing="-1px"
                      >
                        IN DESIGN
                      </text>
                    </g>
                    <g className="cube-link">
                      <rect y="360" width="667" height="90" fill="transparent" />
                      <text
                        x="0"
                        y="435"
                        fill="#111827"
                        fontSize="75"
                        fontWeight="700"
                        letterSpacing="-1px"
                      >
                        IN AI &amp; ML
                      </text>
                    </g>
                    <g className="cube-link">
                      <rect y="450" width="667" height="88" fill="transparent" />
                      <text
                        x="0"
                        y="515"
                        fill="#111827"
                        fontSize="52"
                        fontWeight="700"
                        letterSpacing="-1px"
                      >
                        BUILT FOR THE FUTURE
                      </text>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            <CursorWrapper className="cursor-followed-wrapper" t={0.04}>
              <div className="cursor-followed">
                <div></div>
                <div></div>
              </div>
            </CursorWrapper>
          </div>
        </div>

        {/* Layer 2: Split Curtains (Left & Right halves) */}
        <div ref={splitLeftRef} className="following__split-half -left"></div>
        <div ref={splitRightRef} className="following__split-half -right"></div>

        {/* Layer 3: Central Vertical Line */}
        <div ref={lineRef} className="following__split-line">
          <div ref={lineFillRef} className="following__split-line-inner"></div>
        </div>
      </div>
    </section>
  );
});

export default Following;