import React from 'react';
import styles from './CardResource.module.css';

const CardResource = ({ imageSrc, title, description }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {imageSrc && (
          <img src={imageSrc} alt={title} className={styles.image} />
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <button className={styles.button}>Learn More</button>
    </div>
  );
};

export default CardResource;