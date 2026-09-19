import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SecHero from "@/components/SecHero/SecHero.jsx"
import CardEvent from "@/components/CardEvent/CardEvent.jsx"
import TeamPyramid from "@/components/PageHome/TeamPyramid/TeamPyramid.jsx"
import CircularGallery from '@/components/PageHome/CircularGallery/CircularGallery.jsx'
import Footer from '@/components/Footer/Footer.jsx'
import Btn3 from '@/components/Btn3/Btn3.jsx'
import ChartRoadmap from '@/components/ChartRoadmap/ChartRoadmap.jsx'

import axios from 'axios';
import { parseLocalDate } from '@/utils/dates.js';
import styles from "./Home.module.css";
import emailjs from '@emailjs/browser'

const Home = () => {
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sponsors, setSponsors] = useState([]);
  const [sponsorsLoading, setSponsorsLoading] = useState(true);
  const [sponsorsError, setSponsorsError] = useState(null);
  const [heroMedia, setHeroMedia] = useState(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [heroError, setHeroError] = useState(null);
  const [galleryHeight, setGalleryHeight] = useState(400);
  const [galleryBend, setGalleryBend] = useState(3);
  const [formStatus, setFormStatus] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    const updateGallery = () => {
      const narrow = window.innerWidth <= 600;
      setGalleryHeight(narrow ? 230 : 400);
      setGalleryBend(narrow ? 7 : 3);
    };
    updateGallery();
    window.addEventListener('resize', updateGallery, { passive: true });
    return () => window.removeEventListener('resize', updateGallery);
  }, []);

  useEffect(() => {
    const fetchSponsors = async () => {
      setSponsorsLoading(true);
      setSponsorsError(null);
      try {
        const response = await axios.get('/api/sponsorImages/');
        setSponsors(response.data);
      } catch (err) {
        console.error('Error fetching sponsors:', err);
        setSponsorsError('Failed to load sponsors');
      } finally {
        setSponsorsLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  useEffect(() => {
    const fetchHeroMedia = async () => {
      setHeroLoading(true);
      setHeroError(null);
      try {
        const response = await axios.get('/api/homeHeroMedia/');
        const data = response.data;
        if (Array.isArray(data) && data.length > 0) {
          setHeroMedia(data[0]);
        } else {
          setHeroMedia(null);
        }
      } catch (err) {
        console.error('Error fetching hero media:', err);
        setHeroError('Failed to load hero media');
      } finally {
        setHeroLoading(false);
      }
    };
    fetchHeroMedia();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events/');
        if (Array.isArray(response.data)) {
          const sortedEvents = response.data
            .sort((a, b) => parseLocalDate(a.start_date) - parseLocalDate(b.start_date))
            .slice(0, 3);
          setEvents(sortedEvents);
          setError(null);
        } else {
          setError('Invalid data format received from server');
        }
      } catch (fetchError) {
        console.error('Error fetching events:', fetchError);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormStatus(null);

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_CONTACTUS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setFormStatus({ type: 'success', message: 'Message sent. We will reply soon.' });
          form.current.reset();
        },
        (sendError) => {
          console.error('EmailJS error:', sendError);
          setFormStatus({ type: 'error', message: 'Could not send your message. Please try again or email us directly.' });
        }
      )
      .finally(() => setFormSubmitting(false));
  };

  const roadmapData = [
    { year: '2023', events: 2, influenced: 3300 },
    { year: '2024', events: 10, influenced: 4527 },
    { year: '2025', events: 6, influenced: 3836 },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <SecHero
          title="TELFER CHINESE STUDENT ASSOCIATION"
          message={
            <div className={styles.heroMessage}>
              <p className={styles.heroLead}>Welcome to TCSA</p>
              <p>TCSA supports Chinese students at the Telfer School of Management through academic guidance, cultural experiences, and networking opportunities.</p>
            </div>
          }
          btnText="Join us"
          showBtn={true}
          heroMedia={heroMedia}
          heroLoading={heroLoading}
          heroError={heroError}
        />
      </section>

      <main id="main-content">
        <section className={styles.section} aria-labelledby="roadmap-heading">
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Growth</p>
            <h2 id="roadmap-heading" className={styles.sectionTitle}>Club roadmap</h2>
          </div>
          <div className={styles.roadmapChart}>
            <ChartRoadmap data={roadmapData} height={200} />
          </div>
        </section>

        <section className={styles.section} aria-labelledby="team-heading">
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Leadership</p>
            <h2 id="team-heading" className={styles.sectionTitle}>Our team structure</h2>
          </div>
          <TeamPyramid />
        </section>

        <section className={styles.section} aria-labelledby="events-heading">
          <div className={styles.eventsHeader}>
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Calendar</p>
              <h2 id="events-heading" className={styles.sectionTitle}>Upcoming events</h2>
            </div>
            <Link to="/events" className={styles.moreEventsBtn}>
              <Btn3 btnText="View all" />
            </Link>
          </div>

          <div className={styles.eventScroll}>
            {loading && (
              <div className={styles.skeletonRow} aria-hidden="true">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={styles.skeletonCard} />
                ))}
              </div>
            )}
            {error && <p className={styles.error} role="alert">{error}</p>}
            {!loading && !error && events.length === 0 && (
              <p className={styles.empty}>No upcoming events at the moment.</p>
            )}
            {!loading && !error && events.map((event) => (
              <div key={event.id} className={styles.eventCardWrapper}>
                <CardEvent event={event} />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.gallerySection} aria-label="Photo gallery">
          <div
            className={styles.galleryWrap}
            style={{ height: `${galleryHeight}px` }}
          >
            <CircularGallery bend={galleryBend} textColor="#1c1412" borderRadius={0.05} />
          </div>
        </section>

        <section className={styles.section} aria-labelledby="sponsors-heading">
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Partners</p>
            <h2 id="sponsors-heading" className={styles.sectionTitle}>Sponsors and partners</h2>
          </div>
          <div className={styles.sponsorLogos}>
            {sponsorsLoading && (
              <div className={styles.skeletonRow} aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={styles.skeletonLogo} />
                ))}
              </div>
            )}
            {sponsorsError && <p className={styles.error} role="alert">{sponsorsError}</p>}
            {!sponsorsLoading && !sponsorsError && sponsors.map((sponsor) => (
              <a key={sponsor.id} href={sponsor.link || '#'} target="_blank" rel="noopener noreferrer">
                <img src={sponsor.logo_img} alt={sponsor.name} />
              </a>
            ))}
          </div>
        </section>

        <section className={styles.contact} aria-labelledby="contact-heading">
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <p className={styles.eyebrow}>Reach out</p>
              <h2 id="contact-heading" className={styles.sectionTitle}>Contact</h2>
              <p className={styles.contactLead}>Questions, feedback, or collaboration ideas — we read every message.</p>
              <p className={styles.contactEmail}>
                <a href="mailto:tcsaofficial@outlook.com">tcsaofficial@outlook.com</a>
              </p>
            </div>

            <form ref={form} onSubmit={sendEmail} className={styles.contactForm} noValidate>
              <div className={styles.field}>
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="sender_name"
                  required
                  autoComplete="name"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="sender_email"
                  required
                  autoComplete="email"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" name="message" required rows={5} />
              </div>
              {formStatus && (
                <p
                  className={formStatus.type === 'error' ? styles.formError : styles.formSuccess}
                  role="alert"
                >
                  {formStatus.message}
                </p>
              )}
              <button type="submit" className={styles.submitBtn} disabled={formSubmitting}>
                {formSubmitting ? 'Sending...' : 'Send message'}
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
