// SponsorCard.jsx
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
// You might need to install icon dependencies, e.g., @mui/icons-material
// npm install @mui/icons-material
import InstagramIcon from '@mui/icons-material/Instagram'; // Example Icon

/**
 * SponsorCard Component
 * Displays information about a sponsor/partner in a card format.
 *
 * @param {object} props - The component props.
 * @param {string} props.logo - URL or path to the sponsor's logo image.
 * @param {string} props.name - The name of the sponsor.
 * @param {string} props.description - A short description of the sponsor.
 * @param {string} props.socialLink - URL to the sponsor's social media profile (e.g., Instagram).
 * @param {string} props.learnMoreLink - URL to the sponsor's website or a dedicated page.
 * @param {string} [props.showMoreText='Show more'] - Text for the 'Show more' link.
 * @param {string} [props.learnMoreText='Learn more'] - Text for the 'Learn more' button.
 */
function CardSponsor({
  logo,
  name,
  description,
  socialLink,
  learnMoreLink,
  showMoreText = 'Show more',
  learnMoreText = 'Learn more',
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleShowMoreClick = (e) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  const truncatedDescription = description.length > 150 && !isExpanded
    ? `${description.substring(0, 147)}...`
    : description;
  const needsShowMore = description.length > 150;

  return (
    <Card
      sx={{
        display: 'flex',
        width: 600, // Adjust max width as needed
        height: 'auto', // Allow height to adjust dynamically
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Subtle shadow
        borderRadius: '8px', // Slightly rounded corners
        overflow: 'hidden', // Ensure content stays within bounds
        padding: 2, // Add padding around the card content (1 = 8px theme spacing)
      }}
    >
      {/* Logo Section */}
      <CardMedia
        component="img"
        sx={{
          width: 120, // Fixed width for the logo
          height: 120, // Fixed height for the logo
          objectFit: 'contain', // Scale image nicely
          flexShrink: 0, // Prevent logo from shrinking
          alignSelf: 'start', // Center logo vertically if card is taller
          mr: 2, // Margin to the right of the logo
        }}
        image={logo}
        alt={`${name} logo`}
      />

      {/* Content Section (Name, Desc, Links, Button) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}> {/* Prevent overflow */}
        <CardContent sx={{ flex: '1 0 auto', p: 0, '&:last-child': { pb: 0 }, overflowWrap: 'break-word' }}> {/* Ensure text wraps properly */}
          <Typography component="div" variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div">
            {truncatedDescription}
            {needsShowMore && (
              <Link
                href="#"
                onClick={handleShowMoreClick}
                sx={{ ml: 0.5, color: '', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                {isExpanded ? 'Show less' : showMoreText}
              </Link>
            )}
          </Typography>
        </CardContent>

        {/* Bottom Row: Social Icon and Learn More Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          {/* Social Icon */}
          {socialLink && (
            <IconButton
              href={socialLink}
              target="_blank" // Open link in a new tab
              rel="noopener noreferrer" // Security best practice
              aria-label={`${name} Instagram`} // Accessibility
              sx={{ color: 'black' }} // Icon color
            >
              <InstagramIcon />
            </IconButton>
          )}
          {!socialLink && <Box sx={{ width: 40 }}/> /* Placeholder to maintain layout */}


          {/* Learn More Button */}
          {learnMoreLink && (
            <Button
              variant="contained"
              href={learnMoreLink}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                backgroundColor: '#212529', // Dark background
                color: 'white', // White text
                textTransform: 'none', // Prevent uppercase text
                '&:hover': {
                  backgroundColor: '#343a40', // Slightly lighter on hover
                },
              }}
            >
              {learnMoreText}
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
}

export default CardSponsor;