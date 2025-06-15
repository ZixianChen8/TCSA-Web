import React from 'react';
import styles from './SecHero2.module.css'

const SecHero2 = ({
  title = 'Welcome to Our Site',
  subtitle = 'This is a simple hero section with a title and a paragraph under it.'
}) => {
  return (
    <section className={styles.heroSection}>
      <h1 className={styles.heroTitle}>
        {title}
      </h1>
      <p className={styles.heroSubtitle}>
        {subtitle}
      </p>
    </section>
  );
};

export default SecHero2;
