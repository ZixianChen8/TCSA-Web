import React from 'react';
import { Link } from 'react-router-dom';

import Icon from "@/components/Icon/Icon.jsx"; // Import reusable Icon component

import styles from './CardEvent.module.css';

const CardEvent = ({ event }) => {
    // Default event data
    const defaultEvent = {
        id: 1,
        title: "No Event Title",
        description: "No description available",
        location: "Location not specified",
        date: "Date not specified",
        organizer: "Organizer not specified"
    };

    // Use provided event or default values
    const currentEvent = event || defaultEvent;

    // Format the date if it exists
    const formatDate = (dateString) => {
        if (!dateString) return "Date not specified";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            console.error('Error formatting date:', e);
            return dateString;
        }
    };

    return (
        <div className={styles.eventCard}>
            <div className={styles.eventContent}>
                <h2 className={styles.eventTitle}>{currentEvent.title}</h2>
                <div className={styles.eventDetails}>
                    <p>
                        <Icon iconName="IconLocation" color="black" size="20" />
                        {currentEvent.location}
                    </p>
                    <p>
                        <Icon iconName="IconCalendar" color="black" size="20" />
                        {formatDate(currentEvent.date)}
                    </p>
                    <p>
                        <Icon iconName="IconStar" color="black" size="20" />
                        By: {currentEvent.organizer}
                    </p>
                </div>
                <div className={styles.eventBtns}>
                    <Link to={`/events/${currentEvent.id}`}>
                        <button className={styles.detailsBtn}>Register</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default CardEvent;