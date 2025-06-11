import React from 'react';
import styles from './CardMember.module.css';

const CardMember = (props) => {

  const { name, position, major, email, pfp_img } = props

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{name}</h2>
      <hr className={styles.divider} />
      <img
        src={pfp_img || "/default-avatar.png"}
        alt={name}
        className={styles.avatar}
      />
      <h3 className={styles.name}>{position}</h3>
      <h4 className={styles.position}>{major}</h4>
      <p className={styles.email}>{email}</p>
    </div>
  );
};

export default CardMember;