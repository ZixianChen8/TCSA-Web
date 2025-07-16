import React, { useState, useEffect, useRef } from "react";
import SecHero from "@/components/SecHero/SecHero.jsx"
import CardEvent from "@/components/CardEvent/CardEvent.jsx"
import TeamPyramid from "@/components/PageHome/TeamPyramid/TeamPyramid.jsx"
import CircularGallery from '@/components/PageHome/CircularGallery/CircularGallery.jsx'
import Footer from '@/components/Footer/Footer.jsx'
import Btn3 from '@/components/Btn3/Btn3.jsx'
import ChartRoadmap from '@/components/ChartRoadmap/ChartRoadmap.jsx'

import axios from 'axios';
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
  // Fetch sponsors from the backend
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


  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events/');
        if (Array.isArray(response.data)) {
          // Sort events by date and take the first 3
          const sortedEvents = response.data
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);
          setEvents(sortedEvents);
          setError(null);
        } else {
          setError('Invalid data format received from server');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
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
  
      emailjs
        .sendForm(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_CONTACTUS_TEMPLATE_ID,
          form.current,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
        .then(
          (result) => {
            alert('Message sent successfully!');
          },
          (error) => {
            console.error('EmailJS error:', error);
            alert('An error occurred, please try again. See console for details.');
          }
        );
  
      e.target.reset();
      }

  const roadmapData = [
    { year: '2023', events: 2, influenced: 3300 },
    { year: '2024', events: 10, influenced: 4527 },
    { year: '2025', events: 4, influenced: 1466 },
  ];

  return (
    <div className={styles.container}>



      {/* Hero Section with About Content */}
      <section className={styles.hero}>
        <SecHero
          title="TELFER CHINESE STUDENT ASSOCIATION"
          message={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>Welcome to TCSA</div>
              <div>TCSA supports Chinese students at the Telfer School of Management by offering academic guidance, cultural experiences, and networking opportunities to enhance their business knowledge and professional growth.</div>
            </div>
          }
          btnText="Join us"
          showBtn={true}
          heroMedia={heroMedia}
          heroLoading={heroLoading}
          heroError={heroError}
        />
      </section>

      <main>
        {/* Roadmap Chart */}
        <section className={styles.roadmapChart}>
          <h2>CLUB ROADMAP</h2>
          <ChartRoadmap data={roadmapData} height={200} />
        </section>
        


        {/* Team Pyramid */}
        <section className={styles.teamPyramid}>
          <h2>OUR TEAM STRUCTURE</h2>
          <TeamPyramid />
        </section>

        {/* Upcoming Events */}
        <section className={styles.events}>

          <div className={styles.eventsHeader}>
            <h2>UPCOMING EVENTS</h2>
            <div className={styles.moreEventsBtn}>
              <a href="/events"> <Btn3 btnText='M O R E' /> </a>
              
            </div>
            
          </div>


          <div className={styles.eventList}>
            {loading && <p className={styles.loading}>Loading events...</p>}
            {error && <p className={styles.error}>{error}</p>}
            {!loading && !error && events.length === 0 && (
              <p className={styles.noEvents}>No upcoming events at the moment.</p>
            )}
            {!loading && !error && Array.isArray(events) && events.map((event) => (
              <div key={event.id} className={styles.eventCardWrapper}>
                <CardEvent event={event} />
              </div>
            ))}
          </div>
        </section>

        {/* Gallery Section */}
        <section className={styles.Gallery}>
          <div style={{ height: '600px', position: 'relative' }}>
            <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} />
          </div>
        </section>
      

        {/* Sponsors Section */}
        <section className={styles.sponsors}>
          <h2>Our Sponsors & Partners</h2>
          <div className={styles.sponsorLogos}>
            {sponsorsLoading && <p>Loading sponsors...</p>}
            {sponsorsError && <p className={styles.error}>{sponsorsError}</p>}
            {!sponsorsLoading && !sponsorsError && Array.isArray(sponsors) && sponsors.map((sponsor) => (
              <a key={sponsor.id} href={sponsor.link || '#'} target="_blank" rel="noopener noreferrer">
                <img src={sponsor.logo_img} alt={sponsor.name} />
              </a>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className={styles.contact}>
          <h2>Contact</h2>
          <div className={styles.contactContent}>
            <div className={styles.contactInfo}>
              <h3>Get in touch with us</h3>
              {/* <p>We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, fill out the form below or send us an email. We'll get back to you as soon as possible!</p> */}
              <p>📧 tcsaofficial@outlook.com</p>
            </div>

            <form ref={form} onSubmit={sendEmail} className={styles.contactForm}>
              <input
                type="text"
                name="sender_name"
                placeholder="Enter your name"
                required
              />
              <input
                type="email"
                name="sender_email"
                placeholder="Enter your email"
                required
              />
              <textarea name="message" placeholder="Enter your message" required></textarea>
              <button type="submit" className={styles.button}>Send</button>
            </form>

          </div>
        </section>
      </main>



      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
