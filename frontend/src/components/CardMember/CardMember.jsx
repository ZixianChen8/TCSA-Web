import React from 'react';
import styles from './CardMember.module.css';

const CardMember = (props) => {

  const {firstName, lastName, position, description, email, pfpUrl} = props

  const baseUrl = "http://localhost:8000"
  const fullPfpUrl = `${baseUrl}${pfpUrl}`

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{position}</h2>
      <hr className={styles.divider} />
      <img
        src={"#"}
        alt="profile pic"
        className={styles.avatar}
      />
      <h3 className={styles.name}>Jane Doe</h3>
      <h4 className={styles.position}>Media Operator</h4>
      <p className={styles.desc}>Third year communication</p>
      <p className={styles.email}>example@email.com</p>
    </div>
  );
};

export default CardMember;