import React from 'react';
import styles from './SecHero2.module.css';

const SecHero2 = ({
  title = 'Welcome to Our Site',
  subtitle,
  image = '',
}) => {
  return (
    <section
      className={styles.heroSection}
      {...(image ? { style: { backgroundImage: `url(${image})` } } : {})}
    >
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
