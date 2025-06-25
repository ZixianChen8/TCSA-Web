import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Adjust the import path below to point to your SecDesignShowcase component
import SecDesignShowcase from '@/components/SecDesignShowcase/SecDesignShowcase.jsx';
import styles from './PageDesigns.module.css';

function PageDesigns() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDesigns = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get('/api/designs/');
        setDesigns(data);
      } catch (err) {
        console.error('Error fetching designs:', err);
        setError('Failed to load designs');
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading designs...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.pageDesigns}>
      {designs.map((design) => (
        <div key={design.id} className={styles.designItem}>
          <SecDesignShowcase
            image={design.image}
            title={design.title}
            description={design.description || ''}
          />
        </div>
      ))}
    </div>
  );
}

export default PageDesigns;