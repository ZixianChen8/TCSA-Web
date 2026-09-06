import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SecHero2 from '@/components/SecHero2/SecHero2.jsx';
import Footer from '@/components/Footer/Footer.jsx';
import { STATUS_LABELS } from '../PageMembershipEvents/PageMembershipEvents.jsx';
import styles from './PageMembershipEventDetails.module.css';

const PageMembershipEventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ legal_name: '', email: '', member_id: '' });
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`/api/membership/events/${id}/`)
      .then(({ data }) => setEvent(data))
      .catch(() => setError('Event not found.'));
  }, [id]);

  const canRegister = event && ['member_open', 'public_open', 'waitlist_only'].includes(event.registration_status);
  const memberRequired = event?.registration_status === 'member_open';

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await axios.post(`/api/membership/events/${id}/register/`, form);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not register.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <Helmet>
        <title>{event ? `${event.title} - TCSA` : 'Member Event - TCSA'}</title>
      </Helmet>
      <SecHero2 title={event?.title || 'MEMBER EVENT'} subtitle={event?.category || ''} />
      <div className={styles.wrap}>
        <p><Link to="/membership/events">Back to member events</Link></p>
        {event && (
          <>
            <p>{event.description}</p>
            <ul className={styles.meta}>
              <li>Date: {event.start_date}{event.end_date ? ` – ${event.end_date}` : ''}</li>
              <li>Time: {event.start_time || 'TBA'}{event.end_time ? ` – ${event.end_time}` : ''}</li>
              <li>Location: {event.location || 'TBA'}</li>
              <li>Capacity: {event.confirmed_count}/{event.total_capacity || '—'}</li>
              <li>Status: {STATUS_LABELS[event.registration_status] || event.registration_status}</li>
              {event.requires_review && <li>Manual screening is required. Membership does not guarantee a spot.</li>}
            </ul>
          </>
        )}
        {error && <p className={styles.error}>{error}</p>}
        {result && (
          <p className={styles.ok}>
            Registered. Status: <strong>{result.status.replace('_', ' ')}</strong>
          </p>
        )}
        {canRegister && !result && (
          <form className={styles.form} onSubmit={onSubmit}>
            <h2>Register</h2>
            {memberRequired && <p>Only Active members can register during the priority window. Enter your uOttawa email and member ID.</p>}
            <label>Legal name
              <input name="legal_name" value={form.legal_name} onChange={onChange} required />
            </label>
            <label>uOttawa email
              <input type="email" name="email" value={form.email} onChange={onChange} required />
            </label>
            <label>Member ID {memberRequired ? '' : '(optional for public window)'}
              <input name="member_id" value={form.member_id} onChange={onChange} required={memberRequired} placeholder="TCSA-26-0001" />
            </label>
            <button type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Register'}</button>
          </form>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default PageMembershipEventDetails;
