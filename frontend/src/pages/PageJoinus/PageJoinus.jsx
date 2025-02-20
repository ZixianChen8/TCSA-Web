import CardJob from '@/components/CardJob/CardJob.jsx';

import Navbar from "@/components/Navbar/Navbar.jsx"
import SecHero from "@/components/SecHero/SecHero.jsx" 

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
    return(

        <main>
            <header>
                <Navbar/>
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
                    <div className={styles.benefitGrid}>
                        {benefits.map((benefit, index) => (
                        <div className={styles.benefitCard} key={index}>
                            <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                            <p className={styles.benefitDescription}>{benefit.description}</p>
                        </div>
                        ))}
                    </div>
                </section>
                <section className={styles.jobSection}>
                    <CardJob /> 
                    <CardJob /> 
                    <CardJob /> 
                    <CardJob /> 
                    <CardJob /> 

                </section>

            </div>

        </main>
        
    )
};

export default PageJoinus;