





import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Spelling from "../../../../../shared/Spelling/Spelling"

import cn from 'classnames';
import { memo } from 'react';


const Slider = memo(function Slider({ slides, className, onChange, children }) {
    return (
        <div className={cn('slider-container', className)}>
            <Swiper
                className='slider'
                modules={[Pagination]}
                spaceBetween={80}
                slidesPerView={'auto'}
                pagination={{ clickable: true }}
                onSlideChange={(props) => onChange && onChange({ index: props.realIndex, length: props.loopedSlides })}
                centeredSlides={true}
                loop={true}
                allowTouchMove={true}
                grabCursor={true}
                breakpoints={{
                    0: {
                        spaceBetween: 20
                    },
                    1000: {
                        spaceBetween: 80
                    }
                }}
            >
                {
                    slides.map((_, i) => (
                        <SwiperSlide key={i}>
                            <div onClick={() => window.open(_.link, '_blank')} className="slide">
                                <img src={`/sites/qclay-design-fc4b5892/root-8a5edab2/projects/${_.poster}`} width={702} height={507} alt="" />
                                <div className='text'>{_.title.map((text, i) => (<Spelling key={i}>{ text }</Spelling>))}</div>
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            { children }
        </div>
    )
})

export default Slider