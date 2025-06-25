import React from 'react';
import styles from './TeamMember.module.css';

const TeamMember = ({ name, email, quote, department, position }) => {
  return (
      <div className={styles.notification}>
        <div className={styles.notiglow} />
        <div className={styles.notiborderglow} />
        <div className={styles.notititle}>{name}</div>
        <div className={styles.notidepartment}>{department}</div>
        <div className={styles.notiposition}>{position}</div>
        <div className={styles.notiemail}>{email}</div>
        <div className={styles.notibody}>{quote}</div>
      </div>
  );
}

export default TeamMember;
