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

    const truncate = (text, maxLength = 32) => {
      if (!text) return "";
      return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    // Format a date or date range
    const formatDateRange = (startDateString, endDateString) => {
      if (!startDateString) return "Date not specified";
      try {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const startDate = new Date(startDateString);
        const formattedStart = startDate.toLocaleDateString('en-US', options);
        if (endDateString) {
          const endDate = new Date(endDateString);
          const formattedEnd = endDate.toLocaleDateString('en-US', options);
          return `${formattedStart} – ${formattedEnd}`;
        }
        return formattedStart;
      } catch (e) {
        console.error('Error formatting date range:', e);
        return startDateString + (endDateString ? ' – ' + endDateString : '');
      }
    };

    // Format a time string (e.g., "14:30" or "14:30:00") to a human-friendly format
    const formatTime = (timeString) => {
      if (!timeString) return "Time not specified";
      try {
        const [hour, minute] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hour, minute);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      } catch (e) {
        console.error('Error formatting time:', e);
        return timeString;
      }
    };

    return (
        <div className={styles.eventCard}>
            <div className={styles.eventContent}>
                <h2 className={styles.eventTitle}>{currentEvent.title}</h2>
                <div className={styles.eventDetails}>
                    <p>
                        <Icon iconName="IconLocation" color="#8F001A" size="20" />
                        {truncate(currentEvent.location)}
                    </p>
                    <p>
                        <Icon iconName="IconCalendar" color="#8F001A" size="20" />
                        {truncate(formatDateRange(currentEvent.start_date))} {' '} {formatTime(currentEvent.start_time)}
                    </p>
                    <p>
                        <Icon iconName="IconStar" color="#8F001A" size="20" />
                        By: {truncate(currentEvent.organizer)}
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