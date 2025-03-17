import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import styles from './MemberInfoBox.module.css';

const MemberInfoBox = ({ member, position }) => {
  // Determine the position class based on the position prop
  const positionClass = styles[position] || styles.right;
  
  return (
    <div className={`${styles.infoBox} ${positionClass}`}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" component="div">
            {member.first_name} {member.last_name}
          </Typography>
          
          {member.position && (
            <Typography variant="subtitle1" color="primary" gutterBottom>
              {member.position}
            </Typography>
          )}
          
          {member.department && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Department: {member.department}
            </Typography>
          )}
          
          {member.email && (
            <Typography variant="body2" gutterBottom>
              {member.email}
            </Typography>
          )}
          
          {member.description && (
            <Typography variant="body2" className={styles.description}>
              {member.description}
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberInfoBox; 