// src/BenefitSection.js
import React from 'react';
import styles from './BenefitSection.module.css'; // Import CSS Module

const BenefitSection = ({ title, description, imageUrl, imageAlt, reverseOrder }) => {
  // Dynamically create class list
  const sectionClasses = [
    styles.benefitSection, // Access class name via the styles object
    reverseOrder ? styles.reverse : ''
  ].join(' ').trim(); // Join with space and trim any extra space

  return (
    <div className={sectionClasses}>
      <div className={styles.benefitImageContainer}>
        <img src={imageUrl} alt={imageAlt} className={styles.benefitImage} />
      </div>
      <div className={styles.benefitTextContainer}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default BenefitSection;