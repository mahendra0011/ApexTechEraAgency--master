
import { createContext, useState, useContext } from "react";
import { BreakpointsContext } from "../../../../../lib/sites/qclay-design-fc4b5892/context/breakpointsContext"
import { ControllerContext } from "../../../../../lib/sites/qclay-design-fc4b5892/Controller/Controller"
import { screens } from "../../root-8a5edab2/constants"
import cn from "classnames";
import { $t } from "../../../../../lib/sites/qclay-design-fc4b5892/i18n/i18n"

const ModalContext = createContext();

const ModalContextProvider = ({ children }) => {
    const [active, setActive] = useState(false);
    const [activeForm, setActiveForm] = useState(false);
    const value = { active, setActive, activeForm, setActiveForm };
    return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

const Modal = () => {
    const { active, setActive, setActiveForm } = useContext(ModalContext);
    const { isMaxWidth } = useContext(BreakpointsContext);
    const { activeId, active: activeScreen, setNewActive } = useContext(ControllerContext);

    const handlerClick = () => {
        if (isMaxWidth.mobile) {
            if (activeId !== screens.REQUESTFORM) {
                return;
            }
            setNewActive(activeScreen - 1, true);
            setTimeout(() => {
                setActiveForm(false);
                setActive(false);
            }, 700);
            return;
        }
        setActive(false);
    };

    return (
        <div className={cn("modal", active ? "-active" : "")}>
            <div onClick={handlerClick} className="modal__cross"></div>
            <h2 className="modal__title">{$t("components.modal.title")}</h2>
            <p className="modal__subtitle">{$t("components.modal.subtitle")}</p>
        </div>
    );
};

export default Modal;
export { ModalContextProvider, ModalContext };
