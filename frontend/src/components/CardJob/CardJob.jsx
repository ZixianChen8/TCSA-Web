
import Icon from "@/components/Icon/Icon.jsx"; // Import reusable Icon component

import styles from './CardJob.module.css';


const CardJob = () => {
    return (
      <div className={styles.card}>
        <h2 className={styles.title}>WeChat Media Operator</h2>
        <div className={styles.cardDetail}>
            <Icon iconName="IconRadio" color="green" size="20" />
            <p className={styles.status}>Open</p>
        </div>
      </div>
    );
  };
  
  export default CardJob;