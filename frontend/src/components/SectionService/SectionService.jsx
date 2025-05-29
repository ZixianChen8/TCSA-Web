import React from 'react';
import styles from './SectionService.module.css'
const SectionService = ({
  imageSrc,
  subtitle,
  title,
  tagline,
  paragraphs,
  buttonText,
  buttonLink,
  textAlign = 'left',
}) => {
    return (
        <div>
            <section className={styles.section}>
                <div className={styles.imageContainer}>
                <img
                    src={imageSrc}
                    alt={title}
                    className={styles.image}
                />
                </div>

                <div className={styles.content} style={{ textAlign }}>
                <h2 className={styles.subtitle} style={{ textAlign }}>{subtitle}</h2>
                <h1 className={styles.title} style={{ textAlign }}>{title}</h1>
                <p className={styles.tagline} style={{ textAlign }}>{tagline}</p>

                <div className={styles.text} style={{ textAlign }}>
                    {paragraphs.map((text, i) => (
                    <p key={i} style={{ textAlign }}>{text}</p>
                    ))}
                </div>

                <a href={buttonLink} className={styles.button}>
                    {buttonText} <span className={styles.arrow}>→</span>
                </a>
                </div>
            </section>


        </div>
    );
};

export default SectionService;