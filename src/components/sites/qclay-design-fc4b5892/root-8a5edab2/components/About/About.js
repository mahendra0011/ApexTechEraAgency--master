

import Card from "../../../shared/UI/Card/Card"
import {$t} from "../../../../../../lib/sites/qclay-design-fc4b5892/i18n/i18n"
import { useTransform } from "../../../../../../lib/sites/qclay-design-fc4b5892/Controller/hooks/useTransform/index"
import { screens } from "../../constants"
import { memo } from "react";

const About = memo(function About() {
  const { parent, target } = useTransform('horizontalScroll', { id: screens.ABOUT, minWidth: 576 })
  const images = {
    "1-about": { 
        poster: '/sites/qclay-design-fc4b5892/root-8a5edab2/video/about/1-poster.webp', 
        video: '/sites/qclay-design-fc4b5892/root-8a5edab2/video/about/1.mp4',
      },
    "2-about": { 
      poster: '/sites/qclay-design-fc4b5892/root-8a5edab2/video/about/2-poster.webp', 
      video: '/sites/qclay-design-fc4b5892/root-8a5edab2/video/about/2.mp4',
    },
    "3-about": { 
      poster: '/sites/qclay-design-fc4b5892/root-8a5edab2/video/about/3-poster.webp', 
      video: '/sites/qclay-design-fc4b5892/root-8a5edab2/video/about/3.mp4',
    },
    "4-about": { 
      poster: '/sites/qclay-design-fc4b5892/root-8a5edab2/video/about/1-poster.webp', 
      video: '/sites/qclay-design-fc4b5892/root-8a5edab2/video/about/1.mp4',
    }
  }

  return (
    <section ref={parent} className="about" id="about">
        <div ref={target} className="scroll">
          <h2>
            <span className="-tr-12">{ $t("pages.about.title_1") }</span>
            <span className="-tr-13">{ $t("pages.about.title_2") }</span>
          </h2>
          <div className="cards__container">
            {$t("pages.about.cards").map((_, i) => (
              <Card
                key={_.id}
                index={i + 1}
                color={_.color}
                video={images[_.id]?.video || images["1-about"].video}
                poster={images[_.id]?.poster || images["1-about"].poster}
                video2={images[_.id]?.video2}
                poster2={images[_.id]?.poster2}
                title={_.title}
                text={_.text}
                services={_.services}
                frames={images[_.id]?.frames}
              />
            ))}
          </div>
        </div>
    </section>
  )
})

export default About;