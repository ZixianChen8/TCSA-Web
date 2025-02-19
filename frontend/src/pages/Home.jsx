import React from "react";
import styles from "../styles/Home.module.css";

const Home = () => {
  // Placeholder events
  const events = [
    { id: 1, title: "Tech Conference 2025", date: "March 15, 2025" },
    { id: 2, title: "AI Workshop", date: "April 10, 2025" },
    { id: 3, title: "Startup Networking Night", date: "May 5, 2025" },
  ];

  return (
    <div className={styles.container}>
          {/* Navbar */}
          <nav className={styles.navbar}>
            <div className={styles.logo}>TCSA LOGO</div>
            <ul className={styles.navLinks}>
              <li>Events</li>
              <li>Resources</li>
              <li>Join us</li>
              <li>Our Team</li>
            </ul>
          </nav>

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1>TELFER CHINESE STUDENT ASSOCIATION</h1>
            <p className={styles.welcomeMessage}>
              <strong>Welcome message:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <button className={styles.button}>View Events</button>
            
          </section>

          {/* About Section */}
          <section className={styles.about}>
            <div className={styles.aboutContent}>
              <h2>About us</h2>
              <p><strong>Mission statement:</strong> Explain the club's goals and how we support Chinese international students.</p>
              <button className={styles.button}>Join us</button>
            </div>
            <div className={styles.aboutMedia}>Video or photo media</div>
          </section>

          {/* Upcoming Events */}
          <section className={styles.events}>
            <h2>Upcoming Events</h2>
            <div className={styles.eventList}>
              {Array(3).fill().map((_, index) => (
                <div key={index} className={styles.eventCard}>
                  <div className={styles.eventImage}></div>
                  <div className={styles.eventContent}>
                    <h3>Event title</h3>
                    <p>Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <button className={styles.button}>More Info</button>
                  </div>
                </div>
              ))}
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