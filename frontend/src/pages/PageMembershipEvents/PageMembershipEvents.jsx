import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SecHero2 from '@/components/SecHero2/SecHero2.jsx';
import Footer from '@/components/Footer/Footer.jsx';
import styles from './PageMembershipEvents.module.css';

export const STATUS_LABELS = {
  coming_soon: 'Coming Soon',
  member_open: 'Member Registration Open',
  public_open: 'General Registration Open',
  waitlist_only: 'Waitlist Only',
  closed: 'Registration Closed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const PageMembershipEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/membership/events/')
      .then(({ data }) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not load member events.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main id="main-content">
      <Helmet>
        <title>Member Events - TCSA</title>
      </Helmet>
      <SecHero2 title="MEMBER EVENTS" subtitle="Priority windows, waitlists, and member-only activities" />
      <div className={styles.wrap}>
        {error && <p className={styles.error}>{error}</p>}
        {loading && <p>Loading events…</p>}
        {!loading && !error && events.length === 0 && <p>No member events published yet.</p>}
        <ul className={styles.list}>
          {events.map((event) => (
            <li key={event.id} className={styles.card}>
              <div>
                <h2>{event.title}</h2>
                <p>{event.start_date}{event.start_time ? ` · ${event.start_time}` : ''} · {event.location || 'TBA'}</p>
                <p className={styles.status}>{STATUS_LABELS[event.registration_status] || event.registration_status}</p>
              </div>
              <Link to={`/membership/events/${event.id}`}>Details</Link>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </main>
  );
};

export default PageMembershipEvents;
