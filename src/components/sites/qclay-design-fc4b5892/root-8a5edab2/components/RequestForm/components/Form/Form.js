import { useForm } from "react-hook-form";
import ChoiceInput from "../../../../../shared/UI/ChoiceInput/ChoiceInput";
import Input from "../../../../../shared/UI/Input/Input";
import { $t } from "../../../../../../../../lib/sites/qclay-design-fc4b5892/i18n/i18n";
import SubmitButton from "../../../../../shared/UI/SubmitButton/SubmitButton";
import React, { useContext, useState } from "react";
import { CursorContext, cursorStyles } from "../../../../../shared/Cursor/Cursor";
import cn from "classnames";
import { sendForm } from "../../../../../../../../lib/sites/qclay-design-fc4b5892/api/submit";
import { ModalContext } from "../../../../../shared/Modal/Modal";

const parseCookies = () => {
  if (typeof document === "undefined") { return {}; }
  return document.cookie.split(";").reduce((acc, pair) => {
    const [key, ...rest] = pair.trim().split("=");
    if (key) { acc[key] = decodeURIComponent(rest.join("=")); }
    return acc;
  }, {});
};

const Form = () => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm();
    const { setCursorStyle } = useContext(CursorContext);
    const { setActive } = useContext(ModalContext);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = (data) => {
        setIsLoading(true);

        const cookies = parseCookies();

        if (cookies.referral) {
            data.referral = cookies.referral;
        }

        sendForm(
            data,
            () => {
                setActive(true);
                setTimeout(() => {
                    setIsLoading(false);
                    reset();
                }, 1000);
            },
            () => {
                setTimeout(() => {
                    setIsLoading(false);
                    reset();
                }, 1000);
            }
        );
    };

    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <input
                type="text"
                {...register("companyWebsite")}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", opacity: 0 }}
            />
            <div className="form__inputs tr-1">
                <Input
                    className={errors.name ? "invalid" : ""}
                    {...register("name", { required: "Name is required" })}
                    label={$t("pages.reqForm.form.inputs.name.label")}
                    placeholder={$t("pages.reqForm.form.inputs.name.placeholder")}
                    aria-invalid={errors.name ? "true" : "false"}
                />
                <Input
                    className={errors.email ? "invalid" : ""}
                    {...register("email", { required: "Email Address is required" })}
                    label={$t("pages.reqForm.form.inputs.mail.label")}
                    placeholder={$t("pages.reqForm.form.inputs.mail.placeholder")}
                    aria-invalid={errors.email ? "true" : "false"}
                />
            </div>

            <div className="form__interested">
                <h5 className={cn("tr-2", errors.interest ? "invalid" : "")}>
                    {$t("pages.reqForm.form.interested.title")}
                </h5>
                <div className="tr-3">
                    {$t("pages.reqForm.form.interested.checkbox").map((item) => (
                        <ChoiceInput
                            {...register("interest", { required: "Interest is required" })}
                            key={item}
                            type="checkbox"
                            value={item}
                            onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
                            onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
                            aria-invalid={errors.interest ? "true" : "false"}
                        />
                    ))}
                </div>
            </div>

            <div className="form__budget">
                <h5 className={cn("tr-4", errors.budget ? "invalid" : "")}>{$t("pages.reqForm.form.budget.title")}</h5>
                <div className="tr-5">
                    {$t("pages.reqForm.form.budget.radio").map((item) => (
                        <ChoiceInput
                            {...register("budget", { required: "Budget is required" })}
                            key={item}
                            type="radio"
                            value={item}
                            name="budget"
                            onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_NAV)}
                            onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
                            aria-invalid={errors.budget ? "true" : "false"}
                        />
                    ))}
                </div>
            </div>

            <div className="form__project tr-6">
                <Input
                    className={errors.message ? "invalid" : ""}
                    {...register("message", { required: true })}
                    label={$t("pages.reqForm.form.inputs.project.label")}
                    placeholder={$t("pages.reqForm.form.inputs.project.placeholder")}
                    aria-invalid={errors.message ? "true" : "false"}
                />
            </div>
            <SubmitButton
                className={cn("tr-7", "sbmt-btn", isLoading ? "-loading" : "")}
                onMouseEnter={() => setCursorStyle(cursorStyles.HOVER_BUTTON)}
                onMouseLeave={() => setCursorStyle(cursorStyles.DEFAULT)}
            />
        </form>
    );
};

export default Form;
