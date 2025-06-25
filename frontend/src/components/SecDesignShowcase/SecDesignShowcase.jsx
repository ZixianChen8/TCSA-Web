import React from 'react';
import PropTypes from 'prop-types';
import styles from './SecDesignShowcase.module.css';
import Divider from '@mui/material/Divider';

function SecDesignShowcase({ image, title, description }) {
  return (
    <div className={styles.secDesignShowcase}>
      <div className={styles.showcaseText}>
        <h2 className={styles.showcaseTitle}>{title}</h2>
        <p className={styles.showcaseDescription}>{description}</p>
      </div>
      <Divider orientation="vertical" flexItem className={styles.divider} />
      <div className={styles.showcaseImageContainer}>
        <img src={image} alt={title} className={styles.showcaseImage} />
      </div>
    </div>
  );
}

SecDesignShowcase.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default SecDesignShowcase;
