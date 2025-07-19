import React, { useState, useEffect } from 'react';
import CardSponsor from '../../components/CardSponsor/CardSponsor';
import styles from './PagePartnership.module.css';

import axios from 'axios';

import SecHero2 from "@/components/SecHero2/SecHero2.jsx" 
import Footer from '@/components/Footer/Footer.jsx'
import { Helmet } from 'react-helmet';

const PagePartnership = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        console.log('Fetching sponsors...');
        const response = await axios.get('/api/sponsors/');
        console.log('Sponsors data received:', response.data);
        if (Array.isArray(response.data)) {
          setPartners(response.data);
        } else {
          console.error('Received non-array data:', response.data);
          setError('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Error fetching sponsors:', err.response || err);
        setError(err.response?.data?.message || 'Failed to load sponsors');
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  if (loading) {
    return <p>Loading sponsors...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className={styles.pagePartnership}>
      <Helmet>
        <title>Our Partners - TCSA</title>
      </Helmet>
      <header>
          <SecHero2
            title="OUR PARTNERS"
            subtitle="Stronger Together - the Partners Behind Our Success"
          />
      </header>

      <div className={styles.partnersContainer}>
        {partners.map((partner, index) => (
          <CardSponsor key={index} logo={partner.logo_img} name={partner.name} description={partner.description} learnMoreLink={partner.Link} />
        ))}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PagePartnership;