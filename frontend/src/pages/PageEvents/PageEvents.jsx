import React, { useEffect, useState } from 'react'; // Import React hooks
import axios from 'axios'; // Import Axios for API requests

import CardEvent from '@/components/CardEvent/CardEvent.jsx'

import Navbar from "@/components/Navbar/Navbar.jsx"
import SecHero from "@/components/SecHero/SecHero.jsx" 
import Footer from '@/components/Footer/Footer.jsx'


import Icon from "@/components/Icon/Icon.jsx"; // Import reusable Icon component

import styles from "./PageEvents.module.css"

const PageEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                console.log('Fetching events...');
                const response = await axios.get('http://127.0.0.1:8000/api/events/');
                console.log('Raw response:', response);
                console.log('Events data received:', response.data);
                
                if (Array.isArray(response.data)) {
                    console.log('Number of events:', response.data.length);
                    setEvents(response.data);
                } else {
                    console.error('Received non-array data:', response.data);
                    setError('Invalid data format received from server');
                }
            } catch (error) {
                console.error('Error fetching events:', error.response || error);
                setError(error.response?.data?.message || 'Failed to load events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Debug logging
    useEffect(() => {
        console.log('Current events state:', events);
    }, [events]);

    return (
        <main>
            <header>
                <Navbar/>
                <SecHero
                    title="Events"
                    message="Join our upcoming events!" 
                    showBtn={false}  
                    btnText="Get Started" 
                    btnLink="/services" 
                />
            </header>
        
            <div className={styles.content}>
                {loading && <p className={styles.loading}>Loading events...</p>}
                {error && <p className={styles.error}>{error}</p>}
                {!loading && !error && events.length === 0 && (
                    <p className={styles.noEvents}>No events available at the moment.</p>
                )}
                <div className={styles.eventGrid}>
                    {!loading && !error && events.map(event => {
                        console.log('Rendering event:', event);
                        return (
                            <CardEvent 
                                key={event.id} 
                                event={{
                                    id: event.id,
                                    title: event.title,
                                    description: event.description,
                                    date: event.date,
                                    location: event.location,
                                    organizer: event.organizer,
                                    image: event.thumbnail_link || '/default-event-image.jpg'
                                }} 
                            />
                        );
                    })}
                </div>
                
                {/* Only show fallback events if there's an error */}
                {!loading && error && (
                    <div className={styles.eventGrid}>
                        <CardEvent />
                        <CardEvent />
                        <CardEvent />
                    </div>
                )}
            </div>
            {/* Footer */}
            <Footer />
        </main>
    );
}

export default PageEvents