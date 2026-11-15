import { createContext, useState, useEffect, useRef } from "react";
import { state } from "./utils/state"
import { swipe } from "./utils/swipe"
import { scroll } from "./utils/scroll"
import { context } from "./utils/context"
import Detector from "./detector/detector"
import cn from "classnames";

import { setToRender, removeFromRender } from "../Animator/js/renderer"

// fixme
import { ModalContext } from "../../../../components/sites/apextechera-design-fc4b5892/shared/Modal/Modal"
import { useContext } from "react";
import { screens } from "../../../../components/sites/apextechera-design-fc4b5892/root-8a5edab2/constants"
//

export const ControllerContext = createContext();

const Controller = ({ children, duration, externalDelay, externalDuration }) => {
    const [prevSections, setPrevSections] = useState(null);
    const [sections, setSections] = useState(null);
    const [active, setActive] = useState(context.active);
    const [activeId, setActiveId] = useState(
        context.active === 9 && typeof window !== "undefined" && window.innerWidth <= 576 ? screens.REQUESTFORM : undefined
    );
    const [externalChanging, setExternalChanging] = useState(false);
    const { activeForm, setActiveForm } = useContext(ModalContext);
    context.setExternalChanging = setExternalChanging;
    state.set({ duration, externalDelay, externalDuration });

    useEffect(() => {
        context.activeForm = activeForm;
    }, [activeForm]);

    const controller = useRef();
    const value = { active, setNewActive, activeId, sections, setSections, setPrevSections };

    useEffect(() => {
        const label = `ControllerScrollRender${Date.now()}`;
        const detector = new Detector(document, setActiveOnScroll);
        context.controller = controller.current;
        setToRender({
            label,
            handler: () => scroll.renderTranslateInterpolation(),
        });
        return () => {
            detector.unmount();
            removeFromRender(label);
        };
    }, []);

    function setActiveOnScroll({ dir, wheel }) {
        if (!scroll.ready(context.sections)) {
            return;
        }
        if (context.activeForm) {
            return;
        }
        // scroll.calcTranslate(context.sections, wheel) // делает диспатч wheel`а для хуков
        if (context.changing) {
            return;
        }
        const innerPos = swipe.getInnerPos(context.sections);
        const swipeDir = dir === 1 ? swipe.pos.BOTTOM : swipe.pos.TOP;
        if (innerPos === swipeDir || innerPos === swipe.pos.TOPBOTTOM) {
            // если мы проскроллили и свайпаем в нужном направлении то все гуд
            if (state.validActive(context.active + dir)) {
                context.wheel = 0;
                scroll.resetWheelTo();
                setNewActive(context.active + dir, false);
            }
            return;
        }
        context.wheel = wheel;
        scroll.calcWheelTo();
        // scroll.translate(context.sections, wheel) // теперь постоянно рендерим смещение
    }
    function setNewActive(index, externalChange = true) {
        if (index === context.active) {
            return;
        }
        context.active_before_setNewActive = context.active;
        context.changing = true;
        context.active = index;
        context.externalChange = externalChange;
        // Reset the accumulated wheel target: external navigation (header/menu
        // links) used to leave the previous section's wheelTo behind, so the
        // newly activated section visibly auto-scrolled when resetTranslate ran.
        context.wheel = 0;
        scroll.resetWheelTo();
        // When scrolling UP into a section (arriving from a later section),
        // its inner was sitting at the bottom (fully scrolled) and stayed
        // there during the transition, leaving an empty/odd frame. Reset it
        // to the top immediately so content is visible right away. Only do
        // this for upward navigation; downward navigation keeps the previous
        // section at the bottom (so scrolling back up resumes from there).
        const isScrollUp = index < context.active_before_setNewActive;
        if (isScrollUp && context.sections) {
            const prevs = context.sections.filter(_ => _.pos === state.classes.PREV);
            prevs.forEach(_ => {
                if (_.ref) {
                    const inner = _.ref.querySelector('.' + scroll.class);
                    if (inner) { inner.style.transform = 'translate3d(0, 0px, 0)'; }
                    document.dispatchEvent(new CustomEvent('triggerwheel', { detail: { id: _.id, wheel: 0 } }));
                }
            });
        }
        setActive(index);
        setActiveId(context.ids[context.active]);
        setExternalChanging(externalChange);
    }

    // sections ререндерятся от active, а переключения рендерим от sections
    useEffect(() => {
        context.prevsections = prevSections;
        context.sections = sections;
        swipe.swipe(prevSections, sections, () => scroll.resetTranslate(context.sections));
    }, [sections]);

    return (
        <ControllerContext.Provider value={value}>
            <div
                ref={controller}
                className={cn(
                    "controller",
                    state.globalClassName(active),
                    state.externalChangingClass(externalChanging)
                )}
            >
                {children}
            </div>
        </ControllerContext.Provider>
    );
};

export default Controller;
