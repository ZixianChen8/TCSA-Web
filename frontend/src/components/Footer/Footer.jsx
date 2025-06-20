// Footer.jsx
import React from 'react'
import styles from './Footer.module.css'
import SocialBar from './SocialBar.jsx'

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.top}>
      <ul className={styles.nav}>
        <li><a href="/">TCSA</a></li>
        <li><a href="/events">Events</a></li>
        <li><a href="/ourteam">Alumni</a></li>
        <li><a href="/joinus">Join us</a></li>
        <li><a href="/resources">Resources</a></li>
        <li><a href="/services">Services</a></li>
      </ul>
      <div className={styles.social}>
        <SocialBar />
      </div>
    </div>
    <div className={styles.bottom}>
      <p>© 2025 TCSA <span><a href="/privacy-policy">Privacy Policy</a> - Terms of Service</span></p>
    </div>
  </footer>
)

export default Footer