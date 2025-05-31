import { useRef } from 'react';
import emailjs from '@emailjs/browser';
import CardJob from '@/components/CardJob/CardJob.jsx';
// import CardBenefit from '@/components/CardBenefit/CardBenefit.jsx';

import Navbar from "@/components/Navbar/Navbar.jsx"
import SecHero2 from "@/components/SecHero2/secHero2.jsx"
import Footer from '@/components/Footer/Footer.jsx'

// import { FaLock } from 'react-icons/fa';

import styles from "./PageJoinus.module.css"



const PageJoinus = () => {
    const placeholderText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.";

    // Placeholder image URLs - replace with your actual image paths or URLs
    // If images are in public folder: e.g., "/images/benefit1.png"
    // If imported: import benefit1Image from './images/benefit1.png'; and use benefit1Image
    const placeholderImage1 = "https://via.placeholder.com/400x300/E0E0E0/B0B0B0?text=Image+1";
    const placeholderImage2 = "https://via.placeholder.com/400x300/D8D8D8/A8A8A8?text=Image+2";
    const placeholderImage3 = "https://via.placeholder.com/400x300/C0C0C0/909090?text=Image+3";

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

        <main>
            <header>
                <Navbar />
                <SecHero2
                title="BECOME A MEMBER OF TCSA"
                subtitle="Join the club"
                />
            </header>

            <div className={styles.content}>
                <section className={styles.benefitsSection}>
                    {/* Benefit 1 - Image on the right */}
                    <div className={styles.benefitItem}>
                        <div className={styles.benefitTextContainer}>
                        <h2>BENEFIT 1</h2>
                        <p>{placeholderText}</p>
                        </div>
                        <div className={styles.benefitImageContainer}>
                        <img src={placeholderImage1} alt="Benefit 1 visual representation" className={styles.benefitImage} />
                        </div>
                    </div>

                    {/* Benefit 2 - Image on the left */}
                    <div className={`${styles.benefitItem} ${styles.reverseOrder}`}>
                        <div className={styles.benefitTextContainer}>
                        <h2>BENEFIT 2</h2>
                        <p>{placeholderText}</p>
                        </div>
                        <div className={styles.benefitImageContainer}>
                        <img src={placeholderImage2} alt="Benefit 2 visual representation" className={styles.benefitImage} />
                        </div>
                    </div>

                    {/* Benefit 3 - Image on the right (Assuming it's Benefit 3, as per the pattern) */}
                    <div className={styles.benefitItem}>
                        <div className={styles.benefitTextContainer}>
                        <h2>BENEFIT 3</h2>
                        <p>{placeholderText}</p>
                        </div>
                        <div className={styles.benefitImageContainer}>
                        <img src={placeholderImage3} alt="Benefit 3 visual representation" className={styles.benefitImage} />
                        </div>
                    </div>

                </section>

                <section className={styles.jobSection}>
                    <h2 className={styles.heading}>Available Positions</h2>
                    <div className={styles.jobGrid}>
                        <CardJob />
                        <CardJob />
                        <CardJob />
                        <CardJob />
                        <CardJob />
                    </div>
                </section>

                <section className={styles.howToApply}>
                    <h2>How to Apply</h2>


                    <div className={styles.applicationContent}>
                        <div className={styles.applicationDescription}>
                            <p>To apply, please enter your information and attach your resume.</p>
                        </div>

                        <form ref={form} onSubmit={sendEmail} encType="multipart/form-data" className={styles.applicationForm}>
                            <label>Name:</label>
                            <input type="text" name="applicant_name" required />

                            <label>Email:</label>
                            <input type="email" name="applicant_email" required />

                            <label>Position Applying For:</label>
                            <input type="text" name="position" required />

                            <label>Upload Resume:</label>
                            <input type="file" name="resume" required />

                            {/* <label>Anything else we should know?</label>
                            <textarea name="message" rows="5" required></textarea> */}

                            <button type="submit">Submit Application</button>
                        </form>

                    </div>

                </section>


            </div>
            {/* Footer */}
            <Footer />
        </main>

    )
};

export default PageJoinus;