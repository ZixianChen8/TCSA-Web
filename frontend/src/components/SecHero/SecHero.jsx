import React from "react";
import Btn1 from "../Btn1/Btn1.jsx"
import styles from "./SecHero.module.css"
import SplitText from "../Anim_SplitText/Anim_SplitText.jsx";

const SecHero = ({ title, message, showBtn, btnText, btnLink, className, heroMedia, heroLoading, heroError }) => {

    let backgroundElement;
    if (heroLoading) {
      backgroundElement = <div className={styles.loading}></div>;
    } else if (heroError || !heroMedia) {
      backgroundElement = <div className={styles.heroBgDefault} />;
    } else if (heroMedia.video) {
      backgroundElement = (
        <video autoPlay muted loop className={styles.heroBg}>
          <source src={heroMedia.video} type="video/mp4" />
        </video>
      );
    } else {
      backgroundElement = (
        <div
          className={styles.heroBg}
          style={{ backgroundImage: `url(${heroMedia.image})` }}
        />
      );
    }

    let displayTitle;
    if (title == "TELFER CHINESE STUDENT ASSOCIATION") {
        let words = title.split(" ");
        let firstWord = words.shift();
        let rest = words.join(" ");

        displayTitle = (
            <>
                <SplitText
                    text={firstWord}
                    className={styles.splitTitle}
                    delay={50}
                    animationFrom={{ opacity: 0, transform: 'translate3d(0,10px,0)' }}
                    animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                    easing="easeOutCubic"
                    threshold={0.2}
                    rootMargin="-50px"
                />
                <br />
                <SplitText
                    text={rest}
                    className={styles.splitTitle}
                    delay={50}
                    animationFrom={{ opacity: 0, transform: 'translate3d(0,10px,0)' }}
                    animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                    easing="easeOutCubic"
                    threshold={0.2}
                    rootMargin="-50px"
                />
            </>
        );
    } else {
        displayTitle = (
            <SplitText
                text={title}
                className={styles.splitTitle}
                delay={50}
                animationFrom={{ opacity: 0, transform: 'translate3d(0,10px,0)' }}
                animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                easing="easeOutCubic"
                threshold={0.2}
                rootMargin="-50px"
            />
        );
    }

    //If showBtn is true then display a button
    let btn = null;
    if (showBtn) {
        btn = (
            <Btn1 
            href={btnLink} 
            variant="primary" 
            size="lg"
            >
                {btnText}
            </Btn1>
        );
    }

    return (
        <section className={`${styles.hero} ${className || ''}`}>
            {backgroundElement}
            <div className={styles.heroContent}>
                <h1>{displayTitle}</h1>
                <p className={styles.welcomeMessage}>{message}</p>
                <div className={styles.btnContainer}>
                    {btn}
                </div>
            </div>
        </section>
    )
};

export default SecHero;