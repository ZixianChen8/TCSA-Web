import { useState } from 'react';
import styles from './TeamPyramid.module.css';

export default function TeamPyramid() {
  // Initial data structure
  const [executives, setExecutives] = useState([
    {
      id: 1,
      name: 'President',
      email: 'president@uottawa.ca',
      quote: '别墅里面唱k'
    },
    {
      id: 2,
      name: 'Vice President',
      email: 'vp@uottawa.ca',
      quote: 'Success is best when it\'s shared.'
    }
  ]);
  
  const [departmentLeaders, setDepartmentLeaders] = useState([
    {
      id: 3,
      name: 'Leader 1',
      department: 'Media',
      email: 'media.leader@uottawa.ca',
      quote: 'Creativity takes courage.'
    },
    {
      id: 4,
      name: 'Leader 2',
      department: 'Human Resource',
      email: 'hr.leader@uottawa.ca',
      quote: 'People don’t leave bad jobs, they leave bad managers.'
    },
    {
      id: 5,
      name: 'Leader 3',
      department: 'Planning',
      email: 'planning.leader@uottawa.ca',
      quote: 'A goal without a plan is just a wish.'
    }
  ]);
  
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 6,
      name: 'Member 1',
      leaderId: 3,
      email: 'member1@uottawa.ca',
      quote: 'Quality is not an act, it is a habit.'
    },
    {
      id: 7,
      name: 'Member 2',
      leaderId: 3,
      email: 'member2@uottawa.ca',
      quote: 'Teamwork divides the task and multiplies the success.'
    },
    {
      id: 8,
      name: 'Member 3',
      leaderId: 3,
      email: 'member3@uottawa.ca',
      quote: 'Good design is obvious. Great design is transparent.'
    },
    {
      id: 9,
      name: 'Member 4',
      leaderId: 4,
      email: 'member4@uottawa.ca',
      quote: 'Your most unhappy customers are your greatest source of learning.'
    },
    {
      id: 10,
      name: 'Member 5',
      leaderId: 4,
      email: 'member5@uottawa.ca',
      quote: 'Hire character. Train skill.'
    },
    {
      id: 11,
      name: 'Member 6',
      leaderId: 4,
      email: 'member6@uottawa.ca',
      quote: 'Culture eats strategy for breakfast.'
    },
    {
      id: 12,
      name: 'Member 7',
      leaderId: 5,
      email: 'member7@uottawa.ca',
      quote: 'By failing to prepare, you are preparing to fail.'
    },
    {
      id: 13,
      name: 'Member 8',
      leaderId: 5,
      email: 'member8@uottawa.ca',
      quote: 'Plans are nothing; planning is everything.'
    },
    {
      id: 14,
      name: 'Member 9',
      leaderId: 5,
      email: 'member9@uottawa.ca',
      quote: 'It always seems impossible until it’s done.'
    }
  ]);
  
  // State for tracking hovering
  const [hoveredLeaderId, setHoveredLeaderId] = useState(null);
  const [hoveredMemberId, setHoveredMemberId] = useState(null);
  
  // Find the leader ID for a given member
  const getLeaderIdForMember = (memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    return member ? member.leaderId : null;
  };
  
  // Calculate positions for each level
  const getTopLevelPositions = () => {
    const centerX = 50;
    const spacing = 12;
    const numNodes = executives.length;
    const startX = centerX - ((numNodes - 1) * spacing) / 2;
    
    return executives.map((exec, index) => ({
      ...exec,
      x: startX + index * spacing,
      y: 10
    }));
  };
  
  const getMiddleLevelPositions = () => {
    const centerX = 50;
    const spacing = 20;
    const numNodes = departmentLeaders.length;
    const startX = centerX - ((numNodes - 1) * spacing) / 2;
    
    return departmentLeaders.map((leader, index) => ({
      ...leader,
      x: startX + index * spacing,
      y: 25
    }));
  };
  
  const getBottomLevelPositions = () => {
    const centerX = 50;
    const spacing = 10;
    const numNodes = teamMembers.length;
    const startX = centerX - ((numNodes - 1) * spacing) / 2;
    
    return teamMembers.map((member, index) => ({
      ...member,
      x: startX + index * spacing,
      y: 37
    }));
  };
  
  const topLevel = getTopLevelPositions();
  const middleLevel = getMiddleLevelPositions();
  const bottomLevel = getBottomLevelPositions();
  
  // Group members by leader
  const membersByLeader = {};
  departmentLeaders.forEach(leader => {
    membersByLeader[leader.id] = teamMembers.filter(member => member.leaderId === leader.id);
  });
  
  // Determine if a line should be highlighted
  const isLineHighlighted = (leaderId, memberId = null) => {
    if (hoveredLeaderId === leaderId) return true;
    if (memberId && hoveredMemberId === memberId) return true;
    if (hoveredMemberId && getLeaderIdForMember(hoveredMemberId) === leaderId) return true;
    return false;
  };
  
  // Rendering the visualization
  return (
    <div className={styles.pyramidContainer}>
      <svg viewBox="0 0 100 60" className={styles.pyramidSvg}>
        {/* Middle to Bottom connections */}
        {middleLevel.map(leader => {
          const members = membersByLeader[leader.id] || [];
          return members.map(member => {
            const memberPos = bottomLevel.find(m => m.id === member.id);
            const highlighted = isLineHighlighted(leader.id, member.id);
            return (
              <line 
                key={`${leader.id}-${member.id}`}
                x1={leader.x}
                y1={leader.y + 3} // Bottom of leader node
                x2={memberPos.x}
                y2={memberPos.y - 3} // Top of member node
                stroke={highlighted ? "#3B82F6" : "#000000"}
                strokeWidth={highlighted ? "0.5" : "0.3"}
                className={highlighted 
                  ? `${styles.pyramidLine} ${styles.highlighted}` 
                  : styles.pyramidLine}
              />
            );
          });
        })}
        
        {/* Leader level horizontal connection */}
        {middleLevel.length > 1 && (
          <line
            x1={middleLevel[0].x}
            y1={middleLevel[0].y - 8}
            x2={middleLevel[middleLevel.length - 1].x}
            y2={middleLevel[0].y - 8}
            stroke="#000000"
            strokeWidth="0.3"
            className={styles.pyramidLine}
          />
        )}
        
        {/* Vertical connections from horizontal line to each leader */}
        {middleLevel.map(leader => (
          <line
            key={`vert-${leader.id}`}
            x1={leader.x}
            y1={leader.y - 8}
            x2={leader.x}
            y2={leader.y - 3}
            stroke="#000000"
            strokeWidth="0.3"
            className={styles.pyramidLine}
          />
        ))}
        
        {/* Top Level (Executives) */}
        {topLevel.map(exec => (
          <g key={`exec-${exec.id}`}>
            <rect
              x={exec.x - 4}
              y={exec.y - 3}
              width={8}
              height={8}
              fill="#333333"
              rx={0}
              className={styles.pyramidNode}
            />
          </g>
        ))}
        
        {/* Middle Level (Department Leaders) */}
        {middleLevel.map(leader => (
          <g 
            key={`leader-${leader.id}`}
            onMouseEnter={() => setHoveredLeaderId(leader.id)}
            onMouseLeave={() => setHoveredLeaderId(null)}
          >
            <rect
              x={leader.x - 3.5}
              y={leader.y - 3}
              width={7}
              height={7}
              fill="#333333"
              rx={0}
              className={`${styles.pyramidNode} cursor-pointer`}
            />
          </g>
        ))}
        
        {/* Bottom Level (Team Members) */}
        {bottomLevel.map(member => (
          <g 
            key={`member-${member.id}`}
            onMouseEnter={() => setHoveredMemberId(member.id)}
            onMouseLeave={() => setHoveredMemberId(null)}
          >
            <rect
              x={member.x - 3.5}
              y={member.y - 3.2}
              width={7}
              height={7}
              fill="#333333"
              rx={0}
              className={`${styles.pyramidNode} cursor-pointer`}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}