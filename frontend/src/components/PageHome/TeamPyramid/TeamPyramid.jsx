    import React, { useState, useRef, useEffect } from 'react'; // Import useRef and useEffect
    import styles from './TeamPyramid.module.css';
    // Assuming TeamMember component exists and is imported correctly
import TeamMember from '@/components/PageHome/TeamMember/TeamMember.jsx'; 
import { computePosition, offset, flip, shift } from '@floating-ui/dom';


    export default function TeamPyramid() {
      // --- State for Team Data ---
      const [advisors, setAdvisors] = useState([
        { id: 1, name: 'President', email: 'president@uottawa.ca', quote: 'Good design is obvious. Great design is transparent.' },
      ]);
      const [executives, setExecutives] = useState([
        { id: 2, name: 'Vice President', email: 'vp@uottawa.ca', quote: 'Success is best when it\'s shared.' }
      ]);
      const [departmentLeaders, setDepartmentLeaders] = useState([
        { id: 3, name: 'Leader 1', department: 'Media', email: 'media.leader@uottawa.ca', quote: 'Creativity takes courage.' },
        { id: 4, name: 'Leader 2', department: 'Human Resource', email: 'hr.leader@uottawa.ca', quote: 'People don’t leave bad jobs, they leave bad managers.' },
        { id: 5, name: 'Leader 3', department: 'Planning', email: 'planning.leader@uottawa.ca', quote: 'A goal without a plan is just a wish.' }
      ]);
      const [teamMembers, setTeamMembers] = useState([
        { id: 6, name: 'Member 1', leaderId: 3, email: 'member1@uottawa.ca', quote: 'Quality is not an act, it is a habit.' },
        { id: 7, name: 'Member 2', leaderId: 3, email: 'member2@uottawa.ca', quote: 'Teamwork divides the task and multiplies the success.' },
        { id: 8, name: 'Member 3', leaderId: 3, email: 'member3@uottawa.ca', quote: 'Good design is obvious. Great design is transparent.' },
        { id: 9, name: 'Member 4', leaderId: 4, email: 'member4@uottawa.ca', quote: 'Your most unhappy customers are your greatest source of learning.' },
        { id: 10, name: 'Member 5', leaderId: 4, email: 'member5@uottawa.ca', quote: 'Hire character. Train skill.' },
        { id: 11, name: 'Member 6', leaderId: 4, email: 'member6@uottawa.ca', quote: 'Culture eats strategy for breakfast.' },
        { id: 12, name: 'Member 7', leaderId: 5, email: 'member7@uottawa.ca', quote: 'By failing to prepare, you are preparing to fail.' },
        { id: 13, name: 'Member 8', leaderId: 5, email: 'member8@uottawa.ca', quote: 'Plans are nothing; planning is everything.' },
        { id: 14, name: 'Member 9', leaderId: 5, email: 'member9@uottawa.ca', quote: 'It always seems impossible until it’s done.' },
      ]);
      
      // --- State for Hover Effects ---
      const [hoveredLeaderId, setHoveredLeaderId] = useState(null);
      const [hoveredMemberId, setHoveredMemberId] = useState(null);
      const [hoveredPerson, setHoveredPerson] = useState(null);

      // --- Ref for Timeout ---
      const containerRef = useRef(null);
      const tooltipRef = useRef(null);
      const [isHovering, setIsHovering] = useState(false);
      const lastMouseEvent = useRef({ x: 0, y: 0 });


      // --- Helper Functions ---
      const getLeaderIdForMember = (memberId) => {
        const member = teamMembers.find(m => m.id === memberId);
        return member ? member.leaderId : null;
      };
      
      // --- Position Calculations ---
      // (Using the original calculations provided)
      const getTopMostLevelPositions = () => {
        return advisors.map((advisor) => ({
          ...advisor, x: 50, y: 0 // centered at top
        }));
      };
      const getTopLevelPositions = () => {
        const centerX = 50;
        const spacing = 12;
        const numNodes = executives.length;
        const startX = centerX - ((numNodes - 1) * spacing) / 2;
        return executives.map((exec, index) => ({
          ...exec, x: startX + index * spacing, y: 10
        }));
      };
      const getMiddleLevelPositions = () => {
        const centerX = 50;
        const spacing = 30;
        const numNodes = departmentLeaders.length;
        const startX = centerX - ((numNodes - 1) * spacing) / 2;
        return departmentLeaders.map((leader, index) => ({
          ...leader, x: startX + index * spacing, y: 25
        }));
      };
      const getBottomLevelPositions = () => {
        const centerX = 50;
        const spacing = 10;
        const numNodes = teamMembers.length;
        const startX = centerX - ((numNodes - 1) * spacing) / 2;
        return teamMembers.map((member, index) => ({
          ...member, x: startX + index * spacing, y: 37
        }));
      };
      
      const topMostLevel = getTopMostLevelPositions();
      const topLevel = getTopLevelPositions();
      const middleLevel = getMiddleLevelPositions();
      const bottomLevel = getBottomLevelPositions();
      
      // --- Group members by leader ---
      const membersByLeader = {};
      departmentLeaders.forEach(leader => {
        membersByLeader[leader.id] = teamMembers.filter(member => member.leaderId === leader.id);
      });
      
      // --- Highlight Logic ---
      const isLineHighlighted = (leaderId, memberId = null) => {



        // When hovering a specific member
        if (hoveredMemberId !== null) {
          // If we're checking a member line, only highlight if it's the hovered member
          if (memberId !== null) {
            return hoveredMemberId === memberId;
          }
          // If we're checking a leader line, highlight if it's the leader of the hovered member
          return hoveredLeaderId === leaderId;
        }
        
        // When hovering a leader
        if (hoveredLeaderId !== null) {
          // Highlight all lines connected to this leader
          if (leaderId === hoveredLeaderId) {
            return true;
          }
          // Also highlight member lines if the member belongs to the hovered leader
          if (memberId !== null) {
            const member = teamMembers.find(m => m.id === memberId);
            return member && member.leaderId === hoveredLeaderId;
          }
        }
        
        // For top-level connections (advisor-to-exec)
        if (hoveredPerson && !hoveredPerson.department && !hoveredPerson.leaderId) {
          return true;
        }
        
        return false;
      };



      // Handles mouse entering a node area
      const handleMouseEnter = (personData, event) => {
        lastMouseEvent.current = { x: event.clientX, y: event.clientY };
        setHoveredPerson(personData.data);
        setIsHovering(true);
        if (personData.data.department) {
          setHoveredLeaderId(personData.data.id);
          setHoveredMemberId(null);
        } else if (personData.data.leaderId) {
          setHoveredMemberId(personData.data.id);
          setHoveredLeaderId(personData.data.leaderId);
        } else {
          setHoveredLeaderId(null);
          setHoveredMemberId(null);
        }
      };

      // Handles mouse leaving a node area
      const handleMouseLeave = () => {
        setIsHovering(false);
        setHoveredLeaderId(null);
        setHoveredMemberId(null);
        setHoveredPerson(null);
      };

      useEffect(() => {
        if (!isHovering) return;
        const virtualEl = {
          getBoundingClientRect: () => {
            const { x, y } = lastMouseEvent.current;
            return { width: 0, height: 0, x, y, top: y, bottom: y, left: x, right: x };
          }
        };
        const onMouseMove = e => {
          lastMouseEvent.current = { x: e.clientX, y: e.clientY };
          computePosition(virtualEl, tooltipRef.current, {
            placement: 'right-start',
            middleware: [offset(5), flip(), shift()],
          }).then(({ x, y }) => {
            Object.assign(tooltipRef.current.style, {
              left: `${x}px`,
              top: `${y}px`,
              visibility: 'visible'
            });
          });
        };
        document.addEventListener('mousemove', onMouseMove);
        onMouseMove(lastMouseEvent.current);
        return () => {
          document.removeEventListener('mousemove', onMouseMove);
          if (tooltipRef.current) tooltipRef.current.style.visibility = 'hidden';
        };
      }, [isHovering]);
      
      // --- Component Rendering ---
      return (

        

        <div className={styles.pyramidContainer} ref={containerRef}>



          <svg viewBox="0 -5 100 60" className={styles.pyramidSvg}>
            {/* --- Lines --- */}
            {/* (Original line rendering logic using isLineHighlighted) */}
            {/* Optional: Advisor to Executive connecting lines */}
            {topLevel.map(exec => (
              <line
                key={`advisor-line-${exec.id}`}
                x1={topMostLevel[0].x} y1={topMostLevel[0].y + 5}
                x2={exec.x} y2={exec.y - 3}
                stroke="#000000"
                strokeWidth="0.3"
                className={styles.pyramidLine}
              />
            ))}
            {topLevel.length === 1 && topMostLevel.length === 1 && (
              <line
                key={`advisor-connection-${topMostLevel[0].id}-${topLevel[0].id}`}
                x1={topMostLevel[0].x} y1={topMostLevel[0].y + 8}
                x2={topLevel[0].x} y2={topLevel[0].y - 5}
                stroke={isHovering ? "#3B82F6" : "#000000"}
                strokeWidth={isHovering ? "0.5" : "0.3"}
                className={isHovering ? `${styles.pyramidLine} ${styles.highlighted}` : styles.pyramidLine}
              />
            )}
            {topLevel.map(exec => (
              middleLevel.map(leader => {
                const highlighted = isLineHighlighted(leader.id);
                return (
                  <line
                    key={`exec-leader-line-${exec.id}-${leader.id}`}
                    x1={exec.x} y1={exec.y + 4.5}
                    x2={leader.x} y2={leader.y - 2.5}
                    stroke={highlighted ? "#3B82F6" : "#000000"}
                    strokeWidth={highlighted ? "0.5" : "0.3"}
                    className={highlighted ? `${styles.pyramidLine} ${styles.highlighted}` : styles.pyramidLine}
                  />
                );
              })
            ))}
            {middleLevel.map(leader => {
              const members = membersByLeader[leader.id] || [];
              return members.map(member => {
                const memberPos = bottomLevel.find(m => m.id === member.id);
                // Use current state for highlighting
                const highlighted = isLineHighlighted(leader.id, member.id); 
                return (
                  <line 
                    key={`${leader.id}-${member.id}`}
                    x1={leader.x} y1={leader.y + 3.8} 
                    x2={memberPos.x} y2={memberPos.y - 3} 
                    stroke={highlighted ? "#3B82F6" : "#000000"}
                    strokeWidth={highlighted ? "0.5" : "0.3"}
                    className={highlighted ? `${styles.pyramidLine} ${styles.highlighted}` : styles.pyramidLine}
                  />
                );
              });
            })}            
            {/* --- Nodes --- */}
            {/* Top-most level (Advisor) */}
            {topMostLevel.map(advisor => (
              <g
                key={`advisor-${advisor.id}`}
                onMouseEnter={(e) => handleMouseEnter({ data: advisor, x: advisor.x, y: advisor.y }, e)}
                onMouseLeave={handleMouseLeave}
              >
                <rect x={advisor.x - 4} y={advisor.y - 3} width={8} height={8} fill="#333333" rx={0} className={styles.pyramidNode} />
              </g>
            ))}
            {/* Executives */}
            {topLevel.map(exec => (
              <g
                key={`exec-${exec.id}`}
                // Use the new handlers
                onMouseEnter={(e) => handleMouseEnter({ data: exec, x: exec.x, y: exec.y }, e)}
                onMouseLeave={handleMouseLeave} 
              >
                <rect x={exec.x - 4} y={exec.y - 3} width={8} height={8} fill="#333333" rx={0} className={styles.pyramidNode} />
              </g>
            ))}
            
            {middleLevel.map(leader => (
              <g
                key={`leader-${leader.id}`}
                // Use the new handlers
                onMouseEnter={(e) => handleMouseEnter({ data: leader, x: leader.x, y: leader.y }, e)}
                onMouseLeave={handleMouseLeave}
              >
                <rect x={leader.x - 3.5} y={leader.y - 3} width={7} height={7} fill="#333333" rx={0} className={`${styles.pyramidNode} cursor-pointer`} />
              </g>
            ))}
            
            {bottomLevel.map(member => (
              <g
                key={`member-${member.id}`}
                // Use the new handlers
                onMouseEnter={(e) => handleMouseEnter({ data: member, x: member.x, y: member.y }, e)}
                onMouseLeave={handleMouseLeave}
              >
                <rect x={member.x - 3.5} y={member.y - 3.2} width={7} height={7} fill="#333333" rx={0} className={`${styles.pyramidNode} cursor-pointer`} />
              </g>
            ))}
          </svg>

          {/* --- Tooltip Popup --- */}
          <div
            ref={tooltipRef}
            className={styles.popcardContainer}
            style={{ position: 'absolute', visibility: 'hidden' }}
          >
            {hoveredPerson && (
              <TeamMember
                name={hoveredPerson.name}
                email={hoveredPerson.email}
                quote={hoveredPerson.quote}
                department={hoveredPerson.department}
              />
            )}
          </div>
        </div>
      );
    }