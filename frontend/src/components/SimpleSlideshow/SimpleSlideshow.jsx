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
  /**
   * Props:
   * - slides: Array of objects with the following structure:
   *   {
   *     image: string (URL of the slide image),
   *     link: string (URL to open when the slide is clicked),
   *     title: string (optional alt text for the image)
   *   }
   * - options: Embla carousel options object
   */
  const { slides = [], options, children } = props
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
          {(slides.length > 0
            ? slides.map((slide, index) => (
                <div className={styles.embla__slide} key={index}>
                  <div className={styles.embla__slide__content}>
                    <a
                      href={slide.link || '#'}
                      target={slide.link ? '_blank' : undefined}
                      rel={slide.link ? 'noopener noreferrer' : undefined}
                    >
                      <img
                        className="embla__slide__img"
                        src={slide.image}
                        alt={slide.title || `Slide ${index + 1}`}
                      />
                    </a>
                  </div>
                </div>
              ))
            : React.Children.map(children, (child, index) => (
                <div className={styles.embla__slide} key={index}>
                  <div className={styles.embla__slide__content}>
                    {child}
                  </div>
                </div>
              ))
          )}
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
