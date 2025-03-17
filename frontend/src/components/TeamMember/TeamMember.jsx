import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import MemberInfoBox from '../MemberInfoBox/MemberInfoBox';
import styles from './TeamMember.module.css';

const TeamMember = ({ member, position }) => {
  const [showInfo, setShowInfo] = useState(false);
  
  // Default avatar if no profile picture
  const defaultAvatar = 'https://via.placeholder.com/150';
  
  // Determine the level class based on position.y
  const levelClass = position.level !== undefined ? styles[`level${position.level}`] : '';
  
  return (
    <div 
      className={styles.memberNode}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px` 
      }}
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      <Avatar 
        src={member.pfp_url || defaultAvatar} 
        alt={`${member.first_name} ${member.last_name}`}
        className={`${styles.avatar} ${levelClass}`}
      />
      
      {showInfo && (
        <MemberInfoBox 
          member={member} 
          position={position.infoBoxPosition || 'right'} 
        />
      )}
    </div>
  );
};

export default TeamMember; 