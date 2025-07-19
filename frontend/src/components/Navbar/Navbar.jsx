import React, { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css'

import Logo from './Logo.jsx'


const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav ref={navRef} className={`${styles.navbar} ${scrolled && !mobileOpen ? styles.navbarScrolled : ''}`}>
      <div className={styles['navbar-toolbar']}>
        <div className={styles.hamburger} onClick={() => setMobileOpen(!mobileOpen)}>
          <div />
          <div />
          <div />
        </div>
        {/* Left Side */}
        <a href="/">
          <Logo />
        </a>


        {/* Right Side: Navigation Links */}
        <div className={`${styles['navbar-links']} ${mobileOpen ? styles.open : ''}`}>
          <a href="/" className={styles['nav-link']}>Home</a>
          <a href="/events" className={styles['nav-link']}>Events</a>
          <a href="/alumni" className={styles['nav-link']}>Alumni</a>
          <a href="/joinus" className={styles['nav-link']}>Join us</a>
          <a href="/resources" className={styles['nav-link']}>Resources</a>
          <a href="/services" className={styles['nav-link']}>Services</a>
          <a href="/partnerships" className={styles['nav-link']}>Partnerships</a>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
