import React from 'react';
import styles from './CardMember.module.css';

const CardMember = () => {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Media Department</h2>
      <hr className={styles.divider} />
      <img
        src={"#"}
        alt="profile pic"
        className={styles.avatar}
      />
      <h3 className={styles.name}>Jane Doe</h3>
      <h4 className={styles.position}>Media Operator</h4>
      <p className={styles.location}>Third year communication</p>
      <p className={styles.phone}>example@email.com</p>
    </div>
  );
};

export default CardMember;