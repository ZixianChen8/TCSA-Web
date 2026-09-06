import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SecHero2 from '@/components/SecHero2/SecHero2.jsx';
import Footer from '@/components/Footer/Footer.jsx';
import styles from './PageMembershipJoin.module.css';

const INDUSTRIES = [
  'Accounting',
  'Consulting',
  'Finance',
  'Marketing',
  'Technology',
  'Entrepreneurship',
  'Other',
];

const EVENT_TYPES = ['Career', 'Social', 'Office Tour', 'Volunteer', 'Workshops'];
const YEARS = ['1', '2', '3', '4', '5+', 'Graduate'];

const emptyForm = {
  legal_name: '',
  preferred_name: '',
  uottawa_email: '',
  personal_email: '',
  wechat_id: '',
  linkedin_url: '',
  program: '',
  year_of_study: '1',
  expected_graduation_year: new Date().getFullYear() + 2,
  membership_type_id: '',
  interested_industries: [],
  preferred_event_types: [],
  notify_consent: false,
  terms_agreed: false,
  privacy_agreed: false,
};

const PageMembershipJoin = () => {
  const [config, setConfig] = useState({ types: [], interac: {} });
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get('/api/membership/config/').then(({ data }) => {
      setConfig(data);
      if (data.types?.length && !form.membership_type_id) {
        setForm((prev) => ({ ...prev, membership_type_id: String(data.types[0].id) }));
      }
    }).catch(() => setError('Could not load membership types.'));
  }, []);

  const selectedType = config.types.find((t) => String(t.id) === String(form.membership_type_id));

  const toggleList = (field, value) => {
    setForm((prev) => {
      const current = prev[field];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [field]: next };
    });
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        expected_graduation_year: Number(form.expected_graduation_year),
        membership_type_id: Number(form.membership_type_id),
      };
      const { data } = await axios.post('/api/membership/apply/', payload);
      setResult(data);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.error || data?.uottawa_email?.[0] || 'Could not submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <Helmet>
        <title>Join Membership - TCSA</title>
      </Helmet>
      <SecHero2 title="JOIN MEMBERSHIP" subtitle="Apply, then send an Interac e-transfer" />
      <div className={styles.wrap}>
        {result ? (
          <section className={styles.success}>
            <h2>Application received</h2>
            <p>Status is <strong>Pending</strong> until VP Finance confirms your e-transfer.</p>
            <dl className={styles.dl}>
              <dt>Member ID (Interac memo)</dt>
              <dd>{result.member_id}</dd>
              <dt>Amount</dt>
              <dd>CAD ${result.amount}</dd>
              <dt>Type</dt>
              <dd>{result.membership_type}</dd>
              <dt>Send to</dt>
              <dd>
                {result.interac?.payee_name}
                {result.interac?.interac_email ? ` · ${result.interac.interac_email}` : ''}
                {result.interac?.interac_phone ? ` · ${result.interac.interac_phone}` : ''}
              </dd>
            </dl>
            <p>{result.interac?.instruction_text}</p>
            <p>You will receive a confirmation email with your member ID when payment is confirmed.</p>
            <Link to="/membership/events">View member events</Link>
          </section>
        ) : (
          <form className={styles.form} onSubmit={onSubmit}>
            {selectedType && (
              <p className={styles.priceNote}>
                Selected type: <strong>{selectedType.name}</strong> — CAD ${selectedType.price_cad}
                {selectedType.valid_until ? ` · valid until ${selectedType.valid_until}` : ''}
              </p>
            )}
            <p className={styles.note}>
              Refunds follow the <Link to="/membership/policies">refund policy</Link>.
              Do not send student numbers or card numbers.
            </p>
            {error && <p className={styles.error}>{error}</p>}

            <label>Legal name
              <input name="legal_name" value={form.legal_name} onChange={onChange} required />
            </label>
            <label>Preferred name
              <input name="preferred_name" value={form.preferred_name} onChange={onChange} required />
            </label>
            <label>uOttawa email
              <input type="email" name="uottawa_email" value={form.uottawa_email} onChange={onChange} required />
            </label>
            <label>Personal email (optional)
              <input type="email" name="personal_email" value={form.personal_email} onChange={onChange} />
            </label>
            <label>Program
              <input name="program" value={form.program} onChange={onChange} required />
            </label>
            <label>Year of study
              <select name="year_of_study" value={form.year_of_study} onChange={onChange}>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </label>
            <label>Expected graduation year
              <input
                type="number"
                name="expected_graduation_year"
                value={form.expected_graduation_year}
                onChange={onChange}
                required
              />
            </label>
            <label>Membership type
              <select name="membership_type_id" value={form.membership_type_id} onChange={onChange} required>
                {config.types.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} — CAD ${t.price_cad}</option>
                ))}
              </select>
            </label>
            <fieldset>
              <legend>Interested industries</legend>
              {INDUSTRIES.map((item) => (
                <label key={item} className={styles.check}>
                  <input
                    type="checkbox"
                    checked={form.interested_industries.includes(item)}
                    onChange={() => toggleList('interested_industries', item)}
                  />
                  {item}
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>Preferred event types (optional)</legend>
              {EVENT_TYPES.map((item) => (
                <label key={item} className={styles.check}>
                  <input
                    type="checkbox"
                    checked={form.preferred_event_types.includes(item)}
                    onChange={() => toggleList('preferred_event_types', item)}
                  />
                  {item}
                </label>
              ))}
            </fieldset>
            <label>WeChat ID (optional)
              <input name="wechat_id" value={form.wechat_id} onChange={onChange} />
            </label>
            <label>LinkedIn profile (optional)
              <input name="linkedin_url" value={form.linkedin_url} onChange={onChange} />
            </label>
            <label className={styles.check}>
              <input type="checkbox" name="notify_consent" checked={form.notify_consent} onChange={onChange} required />
              I consent to membership and event notifications
            </label>
            <label className={styles.check}>
              <input type="checkbox" name="terms_agreed" checked={form.terms_agreed} onChange={onChange} required />
              I agree to the <Link to="/membership/policies">membership terms and privacy policy</Link>
            </label>
            <label className={styles.check}>
              <input type="checkbox" name="privacy_agreed" checked={form.privacy_agreed} onChange={onChange} required />
              I agree to the privacy notice
            </label>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit application'}
            </button>
          </form>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default PageMembershipJoin;
