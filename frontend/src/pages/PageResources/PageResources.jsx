import React from 'react';
import styles from './PageResources.module.css';
import Navbar from '../../components/Navbar/Navbar';
import SecHero from "@/components/SecHero/SecHero.jsx"
import Footer from '@/components/Footer/Footer.jsx'

import SimpleSlideshow from '@/components/SimpleSlideshow/SimpleSlideshow.jsx';


// Sample data - in a real app, this might come from an API
const resourcesData = [
  {
    id: 1,
    title: "Resource title",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud"
  },
  {
    id: 2,
    title: "Resource title",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud"
  },
  {
    id: 3,
    title: "Resource title",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud"
  },
  {
    id: 4,
    title: "Resource title",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud"
  },
  {
    id: 5,
    title: "Resource title",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud"
  },
  {
    id: 6,
    title: "Resource title",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud"
  },
];

// Reusable component for a single resource item
function ResourceItem({ title, description }) {



  return (
    <div className={styles.resourceItem}>
      <h3 className={styles.resourceTitle}>{title}</h3>
      <p className={styles.resourceDescription}>
        <strong>description:</strong> {description}
      </p>
      <button className={styles.resourceButton}>More info</button>
    </div>
  );
}

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


      </section>
      <SecHero
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
      
      
      {/* Slideshow */}
      <div className="theme-light">
        <SimpleSlideshow slides={SLIDES} options={OPTIONS} />
      </div>
      
      

      <div className={styles.pageResourcesContainer}>
        {resourcesData.map(resource => (
          <ResourceItem
            key={resource.id} // Important for list rendering performance
            title={resource.title}
            description={resource.description}
          />
        ))}
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
}

export default PageResources;