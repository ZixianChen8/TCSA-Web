// Example: SponsorsPage.jsx
import React from 'react';
import SponsorCard from '@/components/CardSponsor/CardSponsor.jsx'; 
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer.jsx'

import styles from './PageSponsors.module.css';

// Sample sponsor data (replace with your actual data)
const sponsors = [
  {
    id: 1,
    name: 'Access Ability',
    description: 'Access Ability at the University of Ottawa is committed to ensuring a fully accessible and inclusive campus environment. We fervently advocate for students with disabilities, promoting equal opportunity and participation in all aspects of university life through accommodations and support services. wdadaowijdaiwjdilesuhfiufhdiruhfidrhgiduhgdiruhgiduorhgdoiuhgiudrhgoidhrgldiuhrgliudrhglidhrgldiruhgldiurhldirhugi',
    logo: '/path/to/access-ability-logo.png', // Replace with actual path or URL
    socialLink: 'https://www.instagram.com/example', // Replace with actual URL
    learnMoreLink: 'https://www.example.com/access-ability', // Replace with actual URL
  },
  {
    id: 2,
    name: 'Another Partner Inc.',
    description: 'Providing innovative solutions for modern businesses.',
    logo: '/path/to/another-partner-logo.png', // Replace with actual path or URL
    socialLink: 'https://www.instagram.com/another', // Replace with actual URL
    learnMoreLink: 'https://www.anotherpartner.com', // Replace with actual URL
  },
  // Add more sponsors here
];

function PageSponsors() {
  return (
    <>
      {/* Navbar */}
      <section className={styles.navbar}>
        <Navbar />
      </section>

      <div className={styles.content}> 
        <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
            Our Sponsors & Partners
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', width: '100%' }}>
            {sponsors.map((sponsor) => (
              <SponsorCard
                key={sponsor.id}
                name={sponsor.name}
                description={sponsor.description}
                logo={sponsor.logo}
                socialLink={sponsor.socialLink}
                learnMoreLink={sponsor.learnMoreLink}
              />
            ))}
          </Box>
        </Box>
        

      </div>
      <Footer />

    </>
  );
}

export default PageSponsors;