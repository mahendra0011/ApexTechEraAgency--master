const normalizeValue = (value) => {
    if (Array.isArray(value)) {
        return value.filter(Boolean).join(", ");
    }

    return value ?? "";
};

const buildFields = (formData) => ({
    name: normalizeValue(formData.name),
    email: normalizeValue(formData.email),
    interest: normalizeValue(formData.interest),
    budget: normalizeValue(formData.budget),
    message: normalizeValue(formData.message),
    referral: normalizeValue(formData.referral),
});

const buildMetadata = () => ({
    referrer: document.referrer || "",
    userAgent: navigator.userAgent || "",
    language: navigator.language || "",
});

export const sendForm = (formData, onSuccess, onError) => {
    const payload = {
        fields: buildFields(formData),
        pageUrl: 'https://qclay.design',
        metadata: buildMetadata(),
        companyWebsite: formData.companyWebsite || "",
    };

    // Demo clone: no backend — simulate a successful submit
    console.info('[qclay clone] form submit (mocked):', payload);
    setTimeout(() => {
        onSuccess && onSuccess({ ok: true });
    }, 800);
};
