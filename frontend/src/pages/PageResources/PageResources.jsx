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

  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [resourcesError, setResourcesError] = useState(null);
  const [heroImage, setHeroImage] = useState('');

  useEffect(() => {
    const fetchCarouselImages = async () => {
      setCarouselLoading(true);
      setCarouselError(null);
      try {
        const { data } = await axios.get('/api/resourceCarouselImages/');
        // assuming each item has an 'image' field with the URL
        setCarouselImages(data);
      } catch (err) {
        console.error("Error fetching carousel images:", err);
        setCarouselError("Failed to load slideshow images");
      } finally {
        setCarouselLoading(false);
      }
    };
    fetchCarouselImages();
  }, []);

  useEffect(() => {
    const fetchResources = async () => {
      setResourcesLoading(true);
      setResourcesError(null);
      try {
        const { data } = await axios.get('/api/resources/');
        setResources(data);
      } catch (err) {
        console.error("Error fetching resources:", err);
        setResourcesError("Failed to load resources");
      } finally {
        setResourcesLoading(false);
      }
    };
    fetchResources();
  }, []);

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const res = await axios.get('/api/resourceHeroImage/');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setHeroImage(res.data[0].image);
        }
      } catch (err) {
        console.error('Error fetching resource hero image:', err);
      }
    };
    fetchHeroImage();
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
          image={heroImage}
        />

      </section>

      
      
      {/* Slideshow */}
      <div className="theme-light">
        {carouselLoading && <p>Loading slideshow...</p>}
        {carouselError && <p className={styles.error}>{carouselError}</p>}
        <SimpleSlideshow options={{ loop: true }}>
          {carouselImages.map((item, idx) => (
            <a
              key={idx}
              href={item.link || '#'}
              target={item.link ? '_blank' : undefined}
              rel={item.link ? 'noopener noreferrer' : undefined}
            >
              <img
                src={item.image}
                alt={item.title || `Slide ${idx + 1}`}
              />
            </a>
          ))}
        </SimpleSlideshow>
      </div>
      
      {/* Resource section */}
      
      <Divider><h2 className={styles.ResourcesTitle}>Explore More</h2></Divider>
      {resourcesLoading && <p>Loading resources...</p>}
      {resourcesError && <p className={styles.error}>{resourcesError}</p>}
      {!resourcesLoading && !resourcesError && (
        <section className={styles.resources}>
          {resources.map((item, idx) => (
            <CardResource
              key={item.id || idx}
              imageSrc={item.thumbnail_img}
              title={item.title}
              description={item.description}
              link={item.resource_url}
            />
          ))}
        </section>
      )}
      

      {/* Footer */}
      <Footer />
    </>
  );
}

export default PageResources;