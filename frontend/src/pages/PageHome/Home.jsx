import { React, useState, useEffect} from "react";
import SecHero from "@/components/SecHero/SecHero.jsx"
import CardEvent from "@/components/CardEvent/CardEvent.jsx"
import Navbar from "@/components/Navbar/Navbar.jsx"
import TeamPyramid from "@/components/PageHome/TeamPyramid/TeamPyramid.jsx"
import Gallery from "@/components/PageHome/Gallery/Gallery.jsx"
import axios from 'axios';
import styles from "./Home.module.css";


const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/events/');
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

  return (
    <div className={styles.container}>

      {/* Navbar */}
      <section className={styles.navbar}>
      <Navbar />
      </section>

      {/* Hero Section with About Content */}
      <SecHero
        title="TERFER CHINESE STUDENT ASSOCIATION"
        message={
          <>
            <p>Welcome to TCSA</p>
            <p><strong>Mission statement:</strong> Explain the club's goals and how we support Chinese international students.</p>
            <div style={{ marginTop: '1rem' }}>
            </div>
          </>
        }
        btnText="Join us"
        showBtn={true}
      />

      {/* Team Pyramid */}
      <section className={styles.teamPyramid}>
        <TeamPyramid />
      </section>

      {/* Upcoming Events */}
      <section className={styles.events}>
        <h2>Upcoming Events</h2>
        <div className={styles.eventList}>
          {loading && <p className={styles.loading}>Loading events...</p>}
          {error && <p className={styles.error}>{error}</p>}
          {!loading && !error && events.length === 0 && (
            <p className={styles.noEvents}>No upcoming events at the moment.</p>
          )}
          {!loading && !error && events.map((event) => (
            <div key={event.id} className={styles.eventCardWrapper}>
              <CardEvent event={event} />
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className={styles.Gallery}>
        <Gallery />
      </section>
    

      {/* Sponsors Section */}
      <section className={styles.sponsors}>
        <h2>Our Sponsors</h2>
        <div className={styles.sponsorLogos}>
          {Array(5).fill().map((_, index) => (
            <div key={index} className={styles.sponsorCircle}></div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contact}>
        <h2>Contact</h2>
        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <h3>Get in touch with us</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p>📧 example@email.com</p>
          </div>
          <form className={styles.contactForm}>
            <input type="text" placeholder="Enter your name" />
            <input type="email" placeholder="Enter your email address" />
            <textarea placeholder="Enter your message"></textarea>
            <button type="submit" className={styles.button}>Send</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <span>TCSA</span>
          <span>Events</span>
          <span>Resources</span>
          <span>Join us</span>
          <span>Our Team</span>
          <span>Contact us</span>
        </div>
        <div className={styles.footerSocial}>
          {Array(5).fill().map((_, index) => (
            <div key={index} className={styles.socialIcon}></div>
          ))}
        </div>
        <p>© XXXXXXXXX Privacy - Terms</p>
      </footer>
    </div>
  );
};

export default Home;