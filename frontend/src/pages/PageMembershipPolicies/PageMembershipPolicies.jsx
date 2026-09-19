import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import SecHero2 from '@/components/SecHero2/SecHero2.jsx';
import Footer from '@/components/Footer/Footer.jsx';
import styles from './PageMembershipPolicies.module.css';

const PageMembershipPolicies = () => (
  <main id="main-content">
    <Helmet>
      <title>Membership Policies - TCSA</title>
    </Helmet>
    <SecHero2 title="MEMBERSHIP POLICIES" subtitle="Terms, refunds, no-shows, and privacy" />
    <div className={styles.wrap}>
      <p className={styles.note}>TCSA can replace this placeholder copy before launch.</p>

      <section>
        <h2>Membership terms</h2>
        <p>
          Membership is individual, non-transferable, and valid only for the dates shown on your membership type.
          Member IDs are unique and are not reused after refund or cancellation.
        </p>
      </section>
      <section>
        <h2>Refund policy</h2>
        <p>
          Refund requests go to the membership coordinator. VP Finance records the refund date and amount.
          Card numbers are never stored on this site. Phase 1 payments are Interac e-transfer.
        </p>
      </section>
      <section>
        <h2>No-show policy</h2>
        <p>
          If you register and do not attend without notice, staff may record a no-show.
          The system does not automatically suspend members.
        </p>
      </section>
      <section>
        <h2>Privacy notice</h2>
        <p>
          We collect name, uOttawa email, program, and optional contact fields to run membership.
          We do not collect student numbers, SIN, passport, or full payment card numbers.
          See the site <Link to="/privacy-policy">Privacy Policy</Link>.
        </p>
      </section>
      <section>
        <h2>Code of conduct</h2>
        <p>
          Members are expected to follow TCSA and Telfer community standards at events.
        </p>
      </section>
      <section>
        <h2>Data sharing consent</h2>
        <p>
          Event leads see applicants for events they run. Finance sees payment records.
          We do not publish the member roster on the public site.
        </p>
      </section>
      <p><Link to="/membership/join">Apply for membership</Link></p>
    </div>
    <Footer />
  </main>
);

export default PageMembershipPolicies;
