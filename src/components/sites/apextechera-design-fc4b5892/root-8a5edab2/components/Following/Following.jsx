import { memo } from "react";
import { $t } from "../../../../../../lib/sites/apextechera-design-fc4b5892/i18n/i18n";
import RandomSpelling from "../../../shared/RandomSpelling/RandomSpelling";
import Canvas from "../Portfolio/Canvas/Canvas";
import CursorWrapper from "../../../shared/Cursor/CursorWraper";
import { useTransform } from "../../../../../../lib/sites/apextechera-design-fc4b5892/Controller/hooks/useTransform/index";
import { screens } from "../../constants";
import "./Following.css";

const Following = memo(function Following() {
  const { parent, target } = useTransform("sticky", { id: screens.FOLLOWED });

  const rows = Array.from({ length: 9 }, (_, i) => i);

  return (
    <section ref={parent} id={screens.FOLLOWED} className="portfolio following">
      <div ref={target} className="following__sticky">
        <div className="portfolio__following -active">
          <div className="following-sticky">
            <div className="canvas">
              <Canvas parent={target} isActive={true} />
            </div>
            <div className="following__cube">
              <div className="cude__wrapper" style={{ transform: "rotateY(0deg)" }}>
                {/* Face 1: Wide, bold 'WE TURN IDEAS INTO REALITY' */}
                <div className="cube__center">
                  <div className="cube__center-lines">
                    {rows.map((rowIdx) => (
                      <div key={rowIdx} className="cube__center-row">
                        <RandomSpelling>
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
      </div>
    </section>
  );
});

export default Following;
