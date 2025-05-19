import React from 'react';
import styles from './PageResources.module.css';
import Navbar from '../../components/Navbar/Navbar';
import SecHero from "@/components/SecHero/SecHero.jsx"
import Footer from '@/components/Footer/Footer.jsx'
import CardResource from '@/components/CardResource/CardResource.jsx'

import SimpleSlideshow from '@/components/SimpleSlideshow/SimpleSlideshow.jsx';


// Main Page component
function PageResources() {

  const OPTIONS = { loop: true }
  const SLIDE_COUNT = 5
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

  return (
    <>
      <section className={styles.navbar}>
        <Navbar />
      </section>


      {/* Hero Section with About Content */}

      <section className={styles.hero}>
        <SecHero
          className={styles.coreHero}
          title="RESOURCES"
          message={
            <>
              <p>useful resources</p>
              <div style={{ marginTop: '1rem' }}>
              </div>
            </>
          }
          btnText="Join us"
          showBtn={false}
        />

      </section>

      
      
      {/* Slideshow */}
      <div className="theme-light">
        <SimpleSlideshow slides={SLIDES} options={OPTIONS} />
      </div>
      
      {/* Resource section */}

      <section className={styles.resources}>
        {Array.from({ length: 15 }).map((_, idx) => (
          <CardResource
            key={idx}
            imageSrc={`https://via.placeholder.com/320x180?text=Resource+${idx + 1}`}
            title={`Resource ${idx + 1}`}
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
          />
        ))}
      </section>
      

      {/* Footer */}
      <Footer />
    </>
  );
}

export default PageResources;