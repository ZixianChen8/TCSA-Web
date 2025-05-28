import { React, useState, useEffect, useRef } from "react";
import SecHero from "@/components/SecHero/SecHero.jsx"
import CardEvent from "@/components/CardEvent/CardEvent.jsx"
import Navbar from "@/components/Navbar/Navbar.jsx"
import TeamPyramid from "@/components/PageHome/TeamPyramid/TeamPyramid.jsx"
import Gallery from "@/components/PageHome/Gallery/Gallery.jsx"
import CircularGallery from '@/components/PageHome/CircularGallery/CircularGallery.jsx'
import Footer from '@/components/Footer/Footer.jsx'
import axios from 'axios';
import styles from "./Home.module.css";
import emailjs from '@emailjs/browser'



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


    const form = useRef();
  
    const sendEmail = (e) => {
      e.preventDefault();
  
      emailjs
        .sendForm(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          form.current,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
        .then(
          (result) => {
            alert('Message sent successfully!');
          },
          (error) => {
            alert('An error occurred, please try again.');
          }
        );
  
      e.target.reset();
      }

  return (
    <div className={styles.container}>

      {/* Navbar */}
      <section className={styles.navbar}>
      <Navbar />
      </section>

      {/* Hero Section with About Content */}
      <section className={styles.hero}>
        <SecHero
          title="TELFER CHINESE STUDENT ASSOCIATION"
          message={
            <>
              <p>Welcome to TCSA</p>
              <p><strong>Description text: </strong>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel orci fermentum, dictum mauris in</p>
              <div style={{ marginTop: '1rem' }}>
              </div>
            </>
          }
          btnText="Join us"
          showBtn={true}
        />

      </section>

      <main>
        {/* Team Pyramid */}
        <section className={styles.teamPyramid}>
          <h2>OUR TEAM STRUCTURE</h2>
          <TeamPyramid />
        </section>

        {/* Upcoming Events */}
        <section className={styles.events}>
          <h2>UPCOMING EVENTS</h2>
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
          <div style={{ height: '600px', position: 'relative' }}>
            <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} />
          </div>
        </section>
      

        {/* Sponsors Section */}
        <section className={styles.sponsors}>
          <h2>Our Sponsors & Partners</h2>
          <div className={styles.sponsorLogos}>
              <img src="/sponsor_logos/logo1.png"/>
              <img src="/sponsor_logos/logo2.jpg"/>
              <img src="/sponsor_logos/logo3.jpg"/>
              <img src="/sponsor_logos/logo4.png"/>
              <img src="/sponsor_logos/logo5.png"/>
              <img src="/sponsor_logos/logo5.webp"/>
              <img src="/sponsor_logos/logo6.avif"/>
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

            <form ref={form} onSubmit={sendEmail} className={styles.contactForm}>
              <input type="text" name="sender_name" placeholder="Enter your contact information" required/>
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