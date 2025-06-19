import Icon from "@/components/Icon/Icon.jsx"; // Import reusable Icon component

import styles from './CardJob.module.css';


const CardJob = ({ title, description, postedAt }) => {
    return (
      <div className={styles.card}>

        <div className={styles.cover}>
          <div className={styles.coverTop}>
            <svg className={styles.coverIcon} xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 24 24">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
              </g>
            </svg>
            <h3>Open</h3>
          </div>

          <h2 className={styles.card__iconTitle}>{title}</h2>
        </div>

        <div className={styles.card__content}>
          <p className={styles.card__description}>

            Posted: {new Date(postedAt).toLocaleDateString()} 
            <br />
            {description}
            
          </p>
        </div>
      </div>
    );
};

export default CardJob;