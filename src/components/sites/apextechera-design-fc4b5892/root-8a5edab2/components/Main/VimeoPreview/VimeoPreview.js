import { useEffect, useState } from 'react';
const css = { preview: "VimeoPreview_preview__BZUeA" };


const VimeoPreview = (props) => {
    const [active, setActive] = useState(true);

    useEffect(() => {
        const timerId = setTimeout(() => setActive(false), 8000);
        return () => clearTimeout(timerId);
    }, [])

    if(!active) return null;

    return (
        <div className={css.preview}>
            <picture>
                <source srcset="/sites/apextechera-design-fc4b5892/root-8a5edab2/images/main/home.webp" type="image/webp" />
                <img src="/sites/apextechera-design-fc4b5892/root-8a5edab2/images/main/home.webp" alt="preview" />
            </picture>
        </div>
    );
}

export default VimeoPreview;