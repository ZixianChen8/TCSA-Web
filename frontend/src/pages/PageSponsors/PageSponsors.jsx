// Example: SponsorsPage.jsx
import React, {useRef} from 'react';
import SponsorCard from '@/components/CardSponsor/CardSponsor.jsx'; 
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer.jsx'
import SectionService from '@/components/SectionService/SectionService';
import emailjs from '@emailjs/browser';
import SecHero2 from "@/components/SecHero2/secHero2.jsx"


import styles from './PageSponsors.module.css';


function PageSponsors() {

    const form = useRef();

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
          <Navbar />
          <SecHero2
          title="COLLABORATE WITH US"
          subtitle="Vast services. Rich experience. Real results. "
          />
      </header>

      <div className={styles.content}> 

        {/* Left-aligned text (default) */}
        <SectionService
          imageSrc="/images/service-left.png"
          subtitle="Career Orientation"
          title="You Question, We Answer."
          tagline="Unlock your true potential. With us!"
          paragraphs={[
            "Our services target our clients’ questions and possibilities beyond. Be it technology, market, operations, or strategy - we cover it all.",
            "Our holistic approach towards consultation helps us understand your business deeply & helps us focus on your advancement. Helping you achieve viable results."
          ]}
          buttonText="Learn More"
          buttonLink="/left"
          /* textAlign prop omitted → defaults to 'left' */
        />

        {/* Left-aligned text */}
        <SectionService
          imageSrc="/images/service-center.png"
          subtitle="Graphic Design"
          title="Designs That Speak Volumes"
          tagline="Turning ideas into visual impact."
          paragraphs={[
            "Our graphic design team brings your vision to life with creativity, precision, and a deep understanding of visual storytelling.",
            "From brand identity to digital media, we craft visuals that connect with your audience and elevate your message."
          ]}
          buttonText="Explore Designs"
          buttonLink="/graphic-design"
          textAlign="right"
        />

        {/* Center-aligned text */}
        <SectionService
          imageSrc="/images/service-right.png"
          subtitle="Media Campaigns"
          title="Campaigns That Make Noise"
          tagline="Delivering your message to the right audience."
          paragraphs={[
            "We design and execute targeted media campaigns that get attention and drive engagement.",
            "Whether it's social media, email marketing, or digital ads, we create a buzz that resonates with your community."
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

export default PageSponsors;