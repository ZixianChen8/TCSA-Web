import React from 'react'
import styles from './SimpleSlideshow.module.css'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'

import Autoplay from 'embla-carousel-autoplay' // Import the autoplay plugin


const SimpleSlideshow = (props) => {
  const { slides, options } = props
//   const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const autoplay = Autoplay({ delay: 3000, stopOnInteraction: false })
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [autoplay])

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <section className={styles.embla}>
      <div className={styles.embla__viewport} ref={emblaRef}>
        <div className={styles.embla__container}>
          {slides.map((slide, index) => (
            <div className={styles.embla__slide} key={index}>
              <div className={styles.embla__slide__content}>
                <img
                  className="embla__slide__img"
                  src={slide}
                  alt={`Slide ${index + 1}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.embla__controls}>
        {/* <div className={styles.embla__buttons}>
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div> */}

        <div className={styles.embla__dots}>
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={
                styles.embla__dot +
                (index === selectedIndex ? ' ' + styles['embla__dot--selected'] : '')
              }
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default SimpleSlideshow
