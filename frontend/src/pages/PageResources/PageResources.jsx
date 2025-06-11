import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './PageResources.module.css';
import Navbar from '../../components/Navbar/Navbar';
import SecHero2 from "@/components/SecHero2/SecHero2.jsx"
import Footer from '@/components/Footer/Footer.jsx'
import CardResource from '@/components/CardResource/CardResource.jsx'

import SimpleSlideshow from '@/components/SimpleSlideshow/SimpleSlideshow.jsx';
import Divider from '@mui/material/Divider';


// Main Page component
function PageResources() {

  const [carouselImages, setCarouselImages] = useState([]);
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [carouselError, setCarouselError] = useState(null);

  useEffect(() => {
    const fetchCarouselImages = async () => {
      setCarouselLoading(true);
      setCarouselError(null);
      try {
        const { data } = await axios.get('http://127.0.0.1:8000/api/resourceCarouselImages/');
        // assuming each item has an 'image' field with the URL
        setCarouselImages(data.map(item => item.image));
      } catch (err) {
        console.error("Error fetching carousel images:", err);
        setCarouselError("Failed to load slideshow images");
      } finally {
        setCarouselLoading(false);
      }
    };
    fetchCarouselImages();
  }, []);

  return (
    <>
      <section className={styles.navbar}>
      </section>


      {/* Hero Section with About Content */}

      <section className={styles.hero}>
        <SecHero2
          title="USEFUL RESOURCES"
          subtitle="For your academic & career journey"
        />

      </section>

      
      
      {/* Slideshow */}
      <div className="theme-light">
        {carouselLoading && <p>Loading slideshow...</p>}
        {carouselError && <p className={styles.error}>{carouselError}</p>}
        <SimpleSlideshow
          slides={carouselImages.length > 0 ? carouselImages : []}
          options={{ loop: true }}
        />
      </div>
      
      {/* Resource section */}
      
      <Divider><h2 className={styles.ResourcesTitle}>Explore More</h2></Divider>
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