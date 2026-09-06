import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SecHero2 from '@/components/SecHero2/SecHero2.jsx';
import Footer from '@/components/Footer/Footer.jsx';
import styles from './PageMembership.module.css';

const BENEFITS = [
  'Early registration for some events',
  'Priority application for Office Tour and similar events',
  'Member-only career development events',
  'Member pricing for some paid events',
  'Priority waitlist notifications',
  'Priority application for volunteer and internal projects',
];

const PageMembership = () => {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    axios.get('/api/membership/config/').then(({ data }) => {
      setTypes(data.types || []);
    }).catch(() => {});
  }, []);

  return (
    <main>
      <Helmet>
        <title>Membership - TCSA</title>
      </Helmet>
      <SecHero2
        title="MEMBERSHIP"
        subtitle="Annual membership for the 2026–2027 academic year"
      />
      <div className={styles.wrap}>
        <p className={styles.lead}>
          Members get early registration, member-only events, and partner perks.
          Membership provides priority access but does not guarantee admission
          to capacity-limited or application-based events.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primary} to="/membership/join">Become a Member</Link>
          <Link className={styles.secondary} to="/membership/events">Member Events</Link>
          <Link className={styles.secondary} to="/membership/faq">Membership FAQ</Link>
        </div>

        <h2 className={styles.h2}>Pricing</h2>
        <div className={styles.cards}>
          {types.map((t) => (
            <article key={t.id} className={styles.card}>
              <h3>{t.name}</h3>
              <p className={styles.price}>CAD ${t.price_cad}</p>
              {(t.valid_from || t.valid_until) && (
                <p className={styles.meta}>
                  Valid {t.valid_from || '—'} to {t.valid_until || '—'}
                </p>
              )}
            </article>
          ))}
        </div>

        <h2 className={styles.h2} id="benefits">Member benefits</h2>
        <ul className={styles.list}>
          {BENEFITS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className={styles.disclaimer}>
          Membership provides priority access but does not guarantee admission
          to capacity-limited or application-based events.
        </p>
        <p>
          <Link to="/membership/policies">Membership policies</Link>
          {' · '}
          <Link to="/membership/faq">FAQ</Link>
        </p>
      </div>
      <Footer />
    </main>
  );
};

export default PageMembership;
