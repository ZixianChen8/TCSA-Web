import React from 'react';
import styles from './PrivacyPolicy.module.css';

import SecHero2 from "@/components/SecHero2/SecHero2.jsx"
import Footer from '@/components/Footer/Footer.jsx'



const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
    <header>
        <SecHero2
        title="Privacy Policy"
        subtitle=""
        />
    </header>
      <p className={styles.effectiveDate}>Effective Date: [Insert Date]</p>
      <p className={styles.lastUpdated}>Last Updated: [Insert Date]</p>
      <p className={styles.intro}>
        tcsaofficial.com (“we,” “our,” or “us”) is committed to protecting your privacy in accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA). This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you interact with our website or participate in our events.
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}><strong>Student email address</strong>: Collected to verify identity and confirm eligibility for student events.</li>
        </ul>
        <p className={styles.paragraph}>
          We may also collect non-personal information, including browser type, device type, IP address, and website usage data through cookies.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Purpose of Collection</h2>
        <p className={styles.paragraph}>
          Your information is collected and used to verify student status, communicate event updates, maintain participation records, improve website functionality, and ensure accuracy in registration processes.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Consent</h2>
        <p className={styles.paragraph}>
          By submitting your student email, you consent to our collection, use, and storage of that information. You may withdraw consent at any time by contacting us, which may affect your ability to register or attend events.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Use of Cookies</h2>
        <p className={styles.paragraph}>
          We may use cookies and similar tracking technologies to enhance your browsing experience and collect analytics. You can disable cookies in your browser settings, though some features may be affected.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Third-Party Services</h2>
        <p className={styles.paragraph}>
          We use EmailJS for email delivery and AWS for secure data storage. These services are selected to maintain high data protection standards.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>6. Data Storage and Security</h2>
        <p className={styles.paragraph}>
          Collected data is stored securely and accessible only by authorized personnel. We implement technical and organizational measures to protect against unauthorized access.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>7. Disclosure of Personal Information</h2>
        <p className={styles.paragraph}>
          We do not sell or rent your personal data. We may disclose information as required by law or to service providers strictly for operational purposes.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>8. Your Rights Under PIPEDA</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>Request access to your personal data</li>
          <li className={styles.listItem}>Request correction of inaccurate information</li>
          <li className={styles.listItem}>Withdraw consent to data use</li>
          <li className={styles.listItem}>File a complaint with the Office of the Privacy Commissioner of Canada</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>9. Contact Us</h2>
        <p className={styles.paragraph}>
          If you have questions regarding your personal data, please contact us at <a href="mailto:tcsaofficial@outlook.com">tcsaofficial@outlook.com</a>.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>10. Policy Updates</h2>
        <p className={styles.paragraph}>
          We may update this Privacy Policy periodically. Changes will be posted here with an updated "Last Updated" date.
        </p>
      </section>
    </div>
    
  );
};

export default PrivacyPolicy;
