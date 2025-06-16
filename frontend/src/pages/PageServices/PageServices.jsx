import React, { useRef, useState, useEffect } from 'react';
import SponsorCard from '@/components/CardSponsor/CardSponsor.jsx'; 
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer.jsx'
import SectionService from '@/components/SectionService/SectionService';
import emailjs from '@emailjs/browser';
import SecHero2 from "@/components/SecHero2/SecHero2.jsx"
import axios from 'axios';

import styles from './PageServices.module.css';


function PageServices() {

    const form = useRef();

    const [servicesBgImages, setServicesBgImages] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [servicesError, setServicesError] = useState(null);

    useEffect(() => {
      const fetchBgImages = async () => {
        setServicesLoading(true);
        setServicesError(null);
        try {
          const { data } = await axios.get('/api/servicesBgImages/');
          setServicesBgImages(data);
        } catch (err) {
          console.error('Error fetching service background images:', err);
          setServicesError('Failed to load background images');
        } finally {
          setServicesLoading(false);
        }
      };
      fetchBgImages();
    }, []);

    const sendEmail = (e) => {
      e.preventDefault();

      emailjs.sendForm(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        form.current,
        {
          publicKey: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS public key
        }
      )
      .then(
        () => {
          alert('Application sent successfully!');
          form.current.reset();
        },
        (error) => {
          alert('Failed to send application. Please try again later.');
          console.error('Error:', error);
        }
      );
    };

  return (
    <>
      <header>
          <SecHero2
          title="COLLABORATE WITH US"
          subtitle="Vast services. Rich experience. Real results. "
          />
      </header>

      <div className={styles.content}> 

        {/* Left-aligned text (default) */}
        <SectionService
          imageSrc={servicesBgImages[0]?.image || '/images/service-left.png'}
          subtitle="Video Production"
          title="Your Story, Perfectly Framed."
          tagline="Promotional videos, event coverage, interviews, social media content"
          paragraphs={[

          ]}
          buttonText="Learn More"
          buttonLink="/left"
          /* textAlign prop omitted → defaults to 'left' */
        />

        {/* Left-aligned text */}
        <SectionService
          imageSrc={servicesBgImages[1]?.image || '/images/service-center.png'}
          subtitle="Graphic & Brand Design"
          title="Designs That Speak Volumes"
          tagline="Custom logo creation Business card design and printing. Visual identity systems (Brand Guidelines, Typography, Color Palettes)"
          paragraphs={[
  
          ]}
          buttonText="Explore Designs"
          buttonLink="/graphic-design"
          textAlign="right"
        />

        {/* Center-aligned text */}
        <SectionService
          imageSrc={servicesBgImages[2]?.image || '/images/service-right.png'}
          subtitle="Marketing Materials Design"
          title="Captivate. Convert."
          tagline="Flyers, brochures, posters, roll-up banners. Digital and print-ready formats available"
          paragraphs={[

          ]}
          buttonText="Launch Campaign"
          buttonLink="/media-campaigns"
          textAlign="center"
        />

        {/* Left-aligned text (default) */}
        <SectionService
          imageSrc={servicesBgImages[3]?.image || '/images/service-left.png'}
          subtitle="Website Design & Development"
          title="Your Web, Simplified."
          tagline="Responsive design for mobile and desktop. SEO-friendly and easy-to-manage backends "
          paragraphs={[

          ]}
          buttonText="Learn More"
          buttonLink="/left"
          /* textAlign prop omitted → defaults to 'left' */
        />

        {/* Center-aligned text */}
        <SectionService
          imageSrc={servicesBgImages[4]?.image || '/images/service-right.png'}
          subtitle="Photography Services"
          title="Memories, Made Perfect."
          tagline="Portraits, product photography, event coverage"
          paragraphs={[

          ]}
          buttonText="Launch Campaign"
          buttonLink="/media-campaigns"
          textAlign="center"
        />

      </div>
      {/* Contact Form Section */}
      <div className={styles.contactSection}>
        <h2>Let us contact you</h2>
        <h1>And take you foward!</h1>
        <form ref={form} onSubmit={sendEmail} encType="multipart/form-data" className={styles.Form}>
            <label>Name / Organization Name:</label>
            <input type="text" name="name" required />

            <label>Email:</label>
            <input type="email" name="email" required />

            <label>Tell us about your needs!</label>
            <textarea name="needs" rows="5" required></textarea>
            <button type="submit">Submit Application</button>
        </form>
      </div>


      <Footer />

    </>
  );
}

export default PageServices;