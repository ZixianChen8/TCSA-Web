import { useRef, useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import axios from 'axios';
import CardJob from '@/components/CardJob/CardJob.jsx';
// import CardBenefit from '@/components/CardBenefit/CardBenefit.jsx';

import Navbar from "@/components/Navbar/Navbar.jsx"
import SecHero2 from "@/components/SecHero2/SecHero2.jsx"
import Footer from '@/components/Footer/Footer.jsx'
import SubmitBtn from '@/components/BtnStar2/BtnStar2.jsx'

// import { FaLock } from 'react-icons/fa';

import styles from "./PageJoinus.module.css"

// Helper to parse a date string as a local date to avoid UTC shift
const parseLocalDate = (isoDate) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
};



const PageJoinus = () => {
    const [benefitImages, setBenefitImages] = useState([]);
    const [bgLoading, setBgLoading] = useState(true);
    const [bgError, setBgError] = useState(null);
    const [heroImage, setHeroImage] = useState('');
    const [positions, setPositions] = useState([]);
    const [posLoading, setPosLoading] = useState(true);
    const [posError, setPosError] = useState(null);

    useEffect(() => {
      const fetchBenefitImages = async () => {
        setBgLoading(true);
        setBgError(null);
        try {
          const { data } = await axios.get('/api/benefitBgImages/');
          setBenefitImages(data);
        } catch (err) {
          console.error("Failed to fetch benefit background images:", err);
          setBgError("Failed to load background images");
        } finally {
          setBgLoading(false);
        }
      };
      fetchBenefitImages();
    }, []);

    useEffect(() => {
      const fetchHeroImage = async () => {
        try {
          const res = await axios.get('/api/joinUsHeroImage/');
          if (Array.isArray(res.data) && res.data.length > 0) {
            setHeroImage(res.data[0].image);
          }
        } catch (err) {
          console.error('Error fetching join-us hero image:', err);
        }
      };
      fetchHeroImage();
    }, []);

    useEffect(() => {
      const fetchPositions = async () => {
        setPosLoading(true);
        setPosError(null);
        try {
          const { data } = await axios.get('/api/openPositions/');
          setPositions(data);
        } catch (err) {
          console.error('Error fetching open positions:', err);
          setPosError('Failed to load positions');
        } finally {
          setPosLoading(false);
        }
      };
      fetchPositions();
    }, []);

    const placeholderText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.";

    const image1 = benefitImages[0]?.image || "https://via.placeholder.com/400x300/E0E0E0/B0B0B0?text=Image+1";
    const image2 = benefitImages[1]?.image || "https://via.placeholder.com/400x300/D8D8D8/A8A8A8?text=Image+2";
    const image3 = benefitImages[2]?.image || "https://via.placeholder.com/400x300/C0C0C0/909090?text=Image+3";

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
                <SecHero2
                title="BECOME A MEMBER OF TCSA"
                subtitle="Join the club"
                image={heroImage}
                />
            </header>

            <div className={styles.content}>
                <section className={styles.benefitsSection}>
                    {bgLoading && <p>Loading benefits...</p>}
                    {bgError && <p className={styles.error}>{bgError}</p>}
                    {!bgLoading && !bgError && (
                      <>
                        {/* Benefit 1 */}
                        <div className={styles.benefitItem}>
                          <div className={styles.benefitTextContainer}>
                            <h2>BENEFIT 1</h2>
                            <p>{placeholderText}</p>
                          </div>
                          <div className={styles.benefitImageContainer}>
                            <img src={image1} alt="Benefit 1 visual representation" className={styles.benefitImage} />
                          </div>
                        </div>
                        {/* Benefit 2 */}
                        <div className={`${styles.benefitItem} ${styles.reverseOrder}`}>
                          <div className={styles.benefitTextContainer}>
                            <h2>BENEFIT 2</h2>
                            <p>{placeholderText}</p>
                          </div>
                          <div className={styles.benefitImageContainer}>
                            <img src={image2} alt="Benefit 2 visual representation" className={styles.benefitImage} />
                          </div>
                        </div>
                        {/* Benefit 3 */}
                        <div className={styles.benefitItem}>
                          <div className={styles.benefitTextContainer}>
                            <h2>BENEFIT 3</h2>
                            <p>{placeholderText}</p>
                          </div>
                          <div className={styles.benefitImageContainer}>
                            <img src={image3} alt="Benefit 3 visual representation" className={styles.benefitImage} />
                          </div>
                        </div>
                      </>
                    )}
                </section>

                <section className={styles.jobSection}>
                    <h2 className={styles.heading}>Available Positions</h2>
                    <div className={styles.jobGrid}>
                        {posLoading && <p>Loading positions...</p>}
                        {posError && <p className={styles.error}>{posError}</p>}
                        {!posLoading && !posError && positions.map((pos) => (
                          <CardJob
                            key={pos.id}
                            title={pos.title}
                            description={pos.description}
                            postedAt={parseLocalDate(pos.posted_at)}
                          />
                        ))}
                    </div>
                </section>

                <section className={styles.howToApply}>
                    <h2>Tell us About Yourself !</h2>


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
                            <div className={styles.submitBtn}>
                              <SubmitBtn title="Submit" />
                            </div>

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
