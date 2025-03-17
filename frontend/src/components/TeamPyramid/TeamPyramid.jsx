import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Divider } from '@mui/material';
import TeamMember from '../TeamMember/TeamMember';
import styles from './TeamPyramid.module.css';

const TeamPyramid = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/team/');
        if (Array.isArray(response.data)) {
          setMembers(response.data);
          setError(null);
        } else {
          setError('Invalid data format received from server');
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        setError('Failed to load team members');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);
  
  // Define pyramid structure - positions for each level and node
  const pyramidStructure = () => {
    // Reduce the base width to bring nodes horizontally closer
    const baseWidth = 600; // Reduced from 800
    const levelHeight = 150; // Reduced from 200 for vertical closeness
    
    // Let's create our pyramid levels with adjusted counts and spacing
    const levels = [
      { level: 0, count: 2, startY: 70 },             // Top level - 2 positions
      { level: 1, count: 3, startY: levelHeight + 70 }, // Middle level - 3 positions
      { level: 2, startY: levelHeight * 2 + 50 }      // Bottom level - All remaining members
    ];
    
    // Calculate positions for each member based on their role/level
    let positions = [];
    let memberIndex = 0;
    
    // Sort members by position importance
    const sortedMembers = [...members];
    
    // Handle the first two levels with fixed counts
    for (let levelIndex = 0; levelIndex < 2; levelIndex++) {
      const level = levels[levelIndex];
      // Reduce spacing between nodes
      const nodeSpacing = baseWidth / (level.count + 2); // Changed from level.count + 1 to level.count + 2
      
      for (let i = 0; i < level.count; i++) {
        if (memberIndex < sortedMembers.length) {
          // Calculate X position - evenly space across the row
          const x = ((i + 1.5) * nodeSpacing); // Added 0.5 to center better
          
          // Determine which side the info box should appear on
          let infoBoxPosition = 'right';
          if (x > baseWidth / 2) infoBoxPosition = 'left';
          
          positions.push({
            member: sortedMembers[memberIndex],
            position: {
              x: x,
              y: level.startY,
              level: level.level,
              infoBoxPosition
            }
          });
          
          memberIndex++;
        }
      }
    }
    
    // Handle the bottom level with all remaining members
    const bottomLevel = levels[2];
    const remainingMembers = sortedMembers.slice(memberIndex);
    const count = remainingMembers.length;
    
    if (count > 0) {
      // Increase spacing for bottom level members
      const nodeSpacing = Math.min(baseWidth / (count), 120); // Increased from 90, reduced divisor for more space
      
      // Calculate total width needed for bottom row
      const totalWidth = (count - 1) * nodeSpacing;
      
      // Center the bottom row
      const startX = (baseWidth - totalWidth) / 2;
      
      remainingMembers.forEach((member, i) => {
        const x = startX + (i * nodeSpacing);
        
        let infoBoxPosition = 'right';
        if (x > baseWidth / 2) infoBoxPosition = 'left';
        
        positions.push({
          member: member,
          position: {
            x: x,
            y: bottomLevel.startY,
            level: 2,
            infoBoxPosition
          }
        });
      });
    }
    
    return positions;
  };
  
  // Generate positions for the pyramid
  const memberPositions = members.length > 0 ? pyramidStructure() : [];

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="body1" mt={2}>Loading team members...</Typography>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box className={styles.errorContainer}>
        <Typography variant="body1" color="error">{error}</Typography>
      </Box>
    );
  }
  
  if (members.length === 0) {
    return (
      <Box className={styles.emptyContainer}>
        <Typography variant="body1">No team members found.</Typography>
      </Box>
    );
  }
  
  return (
    <Box className={styles.pyramidContainer}>
      <Typography variant="h4" className={styles.sectionTitle}>
        Our Team
      </Typography>
      
      <Box className={styles.pyramid}>
        {/* Separation lines using MUI Divider */}
        <Divider 
          sx={{
            position: 'absolute',
            width: '60%',
            left: '20%',
            top: '150px',
            borderColor: '#e0e0e0',
            zIndex: 0,
          }}
        />
        <Divider 
          sx={{
            position: 'absolute',
            width: '60%',
            left: '20%',
            top: '290px', // Moved up slightly to avoid being hidden
            borderColor: '#e0e0e0',
            zIndex: 0,
          }}
        />
        
        {memberPositions.map((item, index) => (
          <TeamMember 
            key={item.member.id || index}
            member={item.member}
            position={item.position}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TeamPyramid; 