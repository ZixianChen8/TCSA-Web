import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import SecHero2 from '@/components/SecHero2/SecHero2.jsx';
import Footer from '@/components/Footer/Footer.jsx';
import styles from './PageMembershipFaq.module.css';

const FAQS = [
  ['Does membership guarantee Office Tour participation?', 'No. Membership gives priority application, not automatic admission.'],
  ['Can non-members still attend TCSA events?', 'Yes. Public calendar events stay open. Some member events have a public window after the priority period.'],
  ['How long is membership valid?', 'Validity is shown on each membership type when you apply. Typical year is September–August.'],
  ['Can membership be transferred?', 'No. Membership and member IDs are not transferable.'],
  ['How do I request a refund?', 'Contact the membership coordinator. VP Finance records refunds in the admin backend.'],
  ['How do I update personal information?', 'Email the membership coordinator. Do not send student numbers or ID scans.'],
  ['What if I forget my member ID?', 'Use the lookup form on this page with your uOttawa email.'],
  ['What if I cannot attend after registering?', 'Cancel as early as you can. Late cancellations and no-shows are recorded.'],
  ['What is a no-show?', 'Registering and not attending without notice. Staff may record it; penalties are not automatic.'],
  ['How do I contact the membership coordinator?', 'Use the contact email shown after you apply, or the site contact form.'],
];

const PageMembershipFaq = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const onLookup = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const { data } = await axios.post('/api/membership/lookup/', { email });
      setMessage(data.message);
    } catch {
      setMessage('If that email is on file, we sent a member ID reminder.');
    }
  };

  return (
    <main>
      <Helmet>
        <title>Membership FAQ - TCSA</title>
      </Helmet>
      <SecHero2 title="MEMBERSHIP FAQ" subtitle="Common questions about TCSA membership" />
      <div className={styles.wrap}>
        {FAQS.map(([q, a]) => (
          <section key={q} className={styles.item}>
            <h2>{q}</h2>
            <p>{a}</p>
          </section>
        ))}
        <section className={styles.lookup}>
          <h2>Look up my member ID</h2>
          <form onSubmit={onLookup}>
            <label>
              uOttawa email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <button type="submit">Send reminder</button>
          </form>
          {message && <p>{message}</p>}
        </section>
        <p><Link to="/membership/join">Become a member</Link> · <Link to="/membership/policies">Policies</Link></p>
      </div>
      <Footer />
    </main>
  );
};

export default PageMembershipFaq;
