import { React, useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar/Navbar.jsx"
import SecHero from "@/components/SecHero/SecHero.jsx"
import CardEvent from "@/components/CardEvent/CardEvent.jsx"
import TeamPyramid from "@/components/TeamPyramid/TeamPyramid.jsx"
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

  // Gallery images
  const galleryImages = [
    "/gallery_images/image1.jpg",
    "/gallery_images/image2.jfif",
    "/gallery_images/image3.jfif",
  ];

  const galleryRef = useRef(null);
  const [direction, setDirection] = useState("right");
  
  const scrollGallery = () => {
    if (galleryRef.current) {
      const scrollAmount = 320; // Adjust based on image width
      if (direction === "right") {
        galleryRef.current.scrollLeft += scrollAmount;
        if (
          galleryRef.current.scrollLeft + galleryRef.current.clientWidth >=
          galleryRef.current.scrollWidth
        ) {
          setDirection("left");
        }
      } else {
        galleryRef.current.scrollLeft -= scrollAmount;
        if (galleryRef.current.scrollLeft <= 0) {
          setDirection("right");
        }
      }
    }
  };

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => scrollGallery("right"), 3000); // Change every 3 seconds
    return () => clearInterval(interval);
  }, []);


  return (
    <div className={styles.container}>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with About Content */}
      <SecHero
        title="TERFER CHINESE STUDENT ASSOCIATION"
        message={
          <>
            <p>Welcome to TCSA</p>
            <p><strong>Mission statement:</strong> Explain the club's goals and how we support Chinese international students.</p>
            <div style={{ marginTop: '1rem' }}>
              <button className={styles.button}>Join us</button>
            </div>
          </>
        }
        showBtn={false}
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
      <section className={styles.gallery}>
        <h2>Gallery</h2>
        <div className={styles.galleryWrapper}>
          <button className={styles.galleryBtn} onClick={() => scrollGallery("left")}>&#9665;</button>
          <div className={styles.gallerySlider} ref={galleryRef}>
            {galleryImages.map((src, index) => (
              <div key={index} className={styles.galleryItem} style={{ backgroundImage: `url(${src})` }}></div>
            ))}
          </div>
          <button className={styles.galleryBtn} onClick={() => scrollGallery("right")}>&#9655;</button>
        </div>
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