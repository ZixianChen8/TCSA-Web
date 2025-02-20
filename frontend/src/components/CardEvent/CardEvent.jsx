import Icon from "@/components/Icon/Icon.jsx"; // Import reusable Icon component

import styles from './CardEvent.module.css'

const CardEvent = () => {


    return (
        <div className={styles.eventCard}>
            <div className={styles.eventImage}>
                <img src="path/to/image.jpg" alt="Event" />
            </div>
            <div className={styles.eventContent}>
                <h2 className={styles.eventTitle}>CAREER EVENT AND SHI</h2>
                <div className={styles.eventDetails}>
                    <p>
                        <Icon iconName="IconLocation" color="black" size="20" />
                        Location, address, blah blah
                    </p>
                    <p>
                        <Icon iconName="IconCalendar" color="black" size="20" />
                        Date, time, blah, blah
                    </p>
                    <p>
                        <Icon iconName="IconStar" color="black" size="20" />
                        By: TCSA or any other organizations
                    </p>
                </div>
                <div className={styles.eventBtns}>
                    <button className={styles.reserveBtn}>Reserve</button>
                    <button className={styles.viewDetailsBtn}>View Details</button>
                </div>
            </div>
        </div>



    )
}

export default CardEvent