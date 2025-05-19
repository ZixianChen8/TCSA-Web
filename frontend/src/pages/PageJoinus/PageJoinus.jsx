import CardJob from '@/components/CardJob/CardJob.jsx';
// import CardBenefit from '@/components/CardBenefit/CardBenefit.jsx';

import Navbar from "@/components/Navbar/Navbar.jsx"
import SecHero from "@/components/SecHero/SecHero.jsx"
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

    return (

        <main>
            <header>
                <Navbar />
                <SecHero
                    className={styles.coreHero}
                    title="JOIN US TODAY"
                    message="join the gang man"
                    showBtn={false}
                    btnText="Get Started"
                    btnLink="/services"
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
                        <h2>Benefit 2</h2>
                        <p>{placeholderText}</p>
                        </div>
                        <div className={styles.benefitImageContainer}>
                        <img src={placeholderImage2} alt="Benefit 2 visual representation" className={styles.benefitImage} />
                        </div>
                    </div>

                    {/* Benefit 3 - Image on the right (Assuming it's Benefit 3, as per the pattern) */}
                    <div className={styles.benefitItem}>
                        <div className={styles.benefitTextContainer}>
                        <h2>Benefit 3</h2>
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
                    <p>To apply, please send an e-mail to this address: tcsaofficial@outlook.com.</p>
                    <p>Please attach a copy of your resume and specify to which position you wish to apply for.</p>
                    <p>Once received, we will contact you in X business days. Looking foward to your applications!</p>
                </section>


            </div>
            {/* Footer */}
            <Footer />
        </main>

    )
};

export default PageJoinus;