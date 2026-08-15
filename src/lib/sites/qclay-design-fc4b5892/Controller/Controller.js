import { createContext, useState, useEffect, useRef } from "react";
import { state } from "./utils/state"
import { swipe } from "./utils/swipe"
import { scroll } from "./utils/scroll"
import { context } from "./utils/context"
import Detector from "./detector/detector"
import cn from "classnames";

import { setToRender, removeFromRender } from "../Animator/js/renderer"

// fixme
import { ModalContext } from "../../../../components/sites/qclay-design-fc4b5892/shared/Modal/Modal"
import { useContext } from "react";
import { screens } from "../../../../components/sites/qclay-design-fc4b5892/root-8a5edab2/constants"
//

export const ControllerContext = createContext();

const Controller = ({ children, duration, externalDelay, externalDuration }) => {
    const [prevSections, setPrevSections] = useState(null);
    const [sections, setSections] = useState(null);
    const [active, setActive] = useState(context.active);
    const [activeId, setActiveId] = useState(
        context.active === 6 && typeof window !== "undefined" && window.innerWidth <= 576 ? screens.REQUESTFORM : undefined
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
        console.log("wheel", wheel);
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
        context.changing = true;
        context.active = index;
        context.externalChange = externalChange;
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
