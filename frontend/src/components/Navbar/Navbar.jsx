import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css'

import Logo from './Logo.jsx'


const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
      <div className={styles['navbar-toolbar']}>
        
        {/* Left Side */}
        <a href="/">
          <Logo />
        </a>


        {/* Right Side: Navigation Links */}
        <div className={styles['navbar-links']}>
          <a href="/events" className={styles['nav-link']}>Events</a>
          <a href="/services" className={styles['nav-link']}>Services</a>
          <a href="/alumni" className={styles['nav-link']}>Alumni</a>
          <a href="/joinus" className={styles['nav-link']}>Join us</a>
          <a href="/resources" className={styles['nav-link']}>Resources</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
