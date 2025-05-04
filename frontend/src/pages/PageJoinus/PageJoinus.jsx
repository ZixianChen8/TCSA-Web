import CardJob from '@/components/CardJob/CardJob.jsx';
import CardBenefit from '@/components/CardBenefit/CardBenefit.jsx';

import Navbar from "@/components/Navbar/Navbar.jsx"
import SecHero from "@/components/SecHero/SecHero.jsx"

import { FaLock } from 'react-icons/fa';

import styles from "./PageJoinus.module.css"



const PageJoinus = () => {
    const benefits = [
        {
            title: "Benefit 1",
            description:
                "What we offer to our members: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore...",
        },
        {
            title: "Benefit 2",
            description:
                "What we offer to our members: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore...",
        },
        {
            title: "Benefit 3",
            description:
                "What we offer to our members: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore...",
        },
        {
            title: "Benefit 4",
            description:
                "What we offer to our members: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore...",
        },
    ];
    return (

        <main>
            <header>
                <Navbar />
                <SecHero
                    title="JOIN US TODAY"
                    message="join the gang man"
                    showBtn={false}
                    btnText="Get Started"
                    btnLink="/services"
                />
            </header>

            <div className={styles.content}>
                <section className={styles.benefitsSection}>
                    <h2 className={styles.heading}>Benefits</h2>

                    <div className={styles.benefitsCards}>
                        {benefits.map(({ title, description }, index) => (
                          <CardBenefit
                            key={index}
                            className={styles.cardBenefit}
                            spotlightColor="rgba(0, 229, 255, 0.2)"
                            icon={<FaLock size={32} />}
                            title={title}
                            description={description}
                          />
                        ))}
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

            </div>

        </main>

    )
};

export default PageJoinus;