import React from 'react';
import styles from './CardResource.module.css';
import Button from '@mui/material/Button';

const CardResource = ({ imageSrc, title, description, link }) => {
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
      <Button
        variant="contained"
        className={styles.button}
        component="a"
        href={link || '#'}
        target={link ? '_blank' : undefined}
        rel={link ? 'noopener noreferrer' : undefined}
      >
        Learn More
      </Button>
    </div>
  );
};

export default CardResource; 