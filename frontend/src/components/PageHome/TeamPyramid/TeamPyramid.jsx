import React, { useState, useRef, useEffect } from 'react';
import styles from './TeamPyramid.module.css';
import axios from 'axios';
import TeamMember from '@/components/PageHome/TeamMember/TeamMember.jsx'; 
import { computePosition, offset, flip, shift } from '@floating-ui/dom';


export default function TeamPyramid() {

      // --- Test member data, to be replaced by actual database ---
      // const [advisors, setAdvisors] = useState([
      //   { id: 1, name: 'President', email: 'president@uottawa.ca', quote: 'Good design is obvious. Great design is transparent.' },
      // ]);
      // const [executives, setExecutives] = useState([
      //   { id: 2, name: 'Vice President', email: 'vp@uottawa.ca', quote: 'Success is best when it\'s shared.' }
      // ]);
      // const [departmentLeaders, setDepartmentLeaders] = useState([
      //   { id: 3, name: 'Leader 1', department: 'Media', email: 'media.leader@uottawa.ca', quote: 'Creativity takes courage.' },
      //   { id: 4, name: 'Leader 2', department: 'Human Resource', email: 'hr.leader@uottawa.ca', quote: 'People don’t leave bad jobs, they leave bad managers.' },
      //   { id: 5, name: 'Leader 3', department: 'Planning', email: 'planning.leader@uottawa.ca', quote: 'A goal without a plan is just a wish.' }
      // ]);
      // const [teamMembers, setTeamMembers] = useState([
      //   { id: 6, name: 'Member 1', leaderId: 3, email: 'member1@uottawa.ca', quote: 'Quality is not an act, it is a habit.' },
      //   { id: 7, name: 'Member 2', leaderId: 3, email: 'member2@uottawa.ca', quote: 'Teamwork divides the task and multiplies the success.' },
      //   { id: 8, name: 'Member 3', leaderId: 3, email: 'member3@uottawa.ca', quote: 'Good design is obvious. Great design is transparent.' },
      //   { id: 9, name: 'Member 4', leaderId: 4, email: 'member4@uottawa.ca', quote: 'Your most unhappy customers are your greatest source of learning.' },
      //   { id: 10, name: 'Member 5', leaderId: 4, email: 'member5@uottawa.ca', quote: 'Hire character. Train skill.' },
      //   { id: 11, name: 'Member 6', leaderId: 4, email: 'member6@uottawa.ca', quote: 'Culture eats strategy for breakfast.' },
      //   { id: 12, name: 'Member 7', leaderId: 5, email: 'member7@uottawa.ca', quote: 'By failing to prepare, you are preparing to fail.' },
      //   { id: 13, name: 'Member 8', leaderId: 5, email: 'member8@uottawa.ca', quote: 'Plans are nothing; planning is everything.' },
      //   { id: 14, name: 'Member 9', leaderId: 5, email: 'member9@uottawa.ca', quote: 'It always seems impossible until it’s done.' },
      // ]);
      
      // // --- Finance Department Constant ---
      // const financeDepartment = {
      //   executive: { id: 18, name: 'VP Finance', email: 'vp.finance@uottawa.ca', quote: 'Budgeting is telling your money where to go.' },
      //   members: [
      //     { id: 19, name: 'Finance Member', email: 'finance.member@uottawa.ca', quote: 'Accounting is the language of business.' }
      //   ]
      // };

      // --- Members ---
      const [advisors, setAdvisors] = useState([]);
      const [executives, setExecutives] = useState([]);
      const [departmentLeaders, setDepartmentLeaders] = useState([]);
      const [teamMembers, setTeamMembers] = useState([]);
      const [financeDepartment, setFinanceDepartment] = useState({ executive: null, members: [] });
      const [loading, setLoading] = useState(true); // Added loading state
      const [error, setError] = useState(null); // Added error state

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
        // Special logic for finance department: highlight only finance-related lines when hovering finance member or VP Finance
        if (
          hoveredPerson &&
          (
            hoveredPerson.id === financeDepartment.executive.id ||
            financeDepartment.members.some(m => m.id === hoveredPerson.id)
          )
        ) {
          // Highlight finance-specific lines: advisor→VP Finance and VP Finance→member
          if (
            leaderId === financeDepartment.executive.id && memberId === null ||
            leaderId === financeDepartment.executive.id &&
            memberId !== null &&
            financeDepartment.members.some(m => m.id === memberId)
          ) {
            return true;
          }
          return false;
        }

        // Highlight advisor→vice president line when hovering any non-finance leader or member
        if ((hoveredLeaderId !== null || hoveredMemberId !== null) &&
            !(hoveredPerson && (
              hoveredPerson.id === financeDepartment.executive.id ||
              financeDepartment.members.some(m => m.id === hoveredPerson.id)
            ))) {
          // topLevel[0] is the vice president
          if (leaderId === topLevel[0].id && memberId === null) {
            return true;
          }
        }

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
          // If hovering VP (executive), highlight all non-finance connections
          const isVP = executives.some(exec => exec.id === hoveredLeaderId);
          if (isVP) {
            // Don't highlight finance lines
            if (
              leaderId === financeDepartment.executive.id ||
              (memberId !== null && financeDepartment.members.some(m => m.id === memberId))
            ) {
              return false;
            }
            return true;
          }

          // Highlight all lines connected to this leader
          if (leaderId === hoveredLeaderId) {
            return true;
            // [PATCH] Additional logic for top-level leader highlight
            if (topMostLevel[0] && topLevel[0] && topLevel[0].id) {
              if (
                leaderId === topLevel[0].id &&
                memberId === null &&
                ![financeDepartment.executive.id, ...financeDepartment.members.map(m => m.id)].includes(hoveredLeaderId)
              ) {
                return true;
              }
            }
          }
          // Also highlight member lines if the member belongs to the hovered leader
          if (memberId !== null) {
            const member = teamMembers.find(m => m.id === memberId);
            if (member && member.leaderId === hoveredLeaderId) {
              return true;
              // [PATCH] Additional logic for top-level leader highlight on member line
              if (
                topMostLevel[0] && topLevel[0] && topLevel[0].id &&
                leaderId === topLevel[0].id &&
                memberId === null &&
                ![financeDepartment.executive.id, ...financeDepartment.members.map(m => m.id)].includes(member.leaderId)
              ) {
                return true;
              }
            }
            return false;
          }
        }
        
        // For top-level connections (advisor-to-exec)
        if (hoveredPerson && advisors.some(a => a.id === hoveredPerson.id)) {
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
          // Department leader
          setHoveredLeaderId(personData.data.id);
          setHoveredMemberId(null);
        } else if (personData.data.leaderId) {
          // Team member
          setHoveredMemberId(personData.data.id);
          setHoveredLeaderId(personData.data.leaderId);
        } else if (executives.some(exec => exec.id === personData.data.id)) {
          // Executive treated as leader
          setHoveredLeaderId(personData.data.id);
          setHoveredMemberId(null);
        } else {
          // Advisor or other
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
      
      // --- Data Fetching ---
      useEffect(() => {
        const fetchTeamData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/api/members/', {
                    headers: {
                        'Accept': 'application/json',
                    }
                });

                if (response.data) {
                    const membersData = response.data;

                    // --- Categorize members into advisors, executives, leaders, and team members ---
                    const loadedAdvisors = [];
                    const loadedExecutives = [];
                    const loadedDeptLeaders = [];
                    let loadedTeamMembers = [];

                    // First pass: general roles (excluding finance)
                    membersData.forEach(member => {
                      const memberObject = {
                        id: member.id,
                        name: `${member.first_name} ${member.last_name}`,
                        email: member.email,
                        quote: member.quote,
                        pfp_img: member.pfp_img,
                        position: member.position,
                        reports_to_id: member.reports_to,
                        department_name: member.department?.name || null,
                      };

                      if (memberObject.position === 'President' && !memberObject.reports_to_id) {
                        loadedAdvisors.push({
                          ...memberObject,
                          department: memberObject.position,
                        });
                      } else if (memberObject.position === 'Vice President') {
                        loadedExecutives.push({
                          ...memberObject,
                          department: memberObject.position,
                        });
                      } else if (memberObject.position && (memberObject.position.includes('Lead') || memberObject.position.includes('Manager'))) {
                        loadedDeptLeaders.push({
                          ...memberObject,
                          department: memberObject.department_name || memberObject.position.replace(/ (Lead|Manager)$/, ''),
                        });
                      } else if (memberObject.reports_to_id) {
                        loadedTeamMembers.push({
                          ...memberObject,
                          leaderId: memberObject.reports_to_id,
                          department: memberObject.department_name,
                        });
                      }
                    });

                    // --- Finance department separate categorization ---
                    const financeExecData = membersData.find(m => m.position === 'VP Finance');
                    let financeExecObj = null;
                    let financeMembersArray = [];
                    if (financeExecData) {
                      financeExecObj = {
                        id: financeExecData.id,
                        name: `${financeExecData.first_name} ${financeExecData.last_name}`,
                        email: financeExecData.email,
                        quote: financeExecData.quote,
                        pfp_img: financeExecData.pfp_img,
                        position: financeExecData.position,
                        department: financeExecData.department?.name,
                      };
                      financeMembersArray = membersData
                        .filter(m => m.reports_to === financeExecData.id)
                        .map(fm => ({
                          id: fm.id,
                          name: `${fm.first_name} ${fm.last_name}`,
                          email: fm.email,
                          quote: fm.quote,
                          pfp_img: fm.pfp_img,
                          position: fm.position,
                          leaderId: fm.reports_to,
                          department: fm.department?.name,
                        }));
                      // Remove finance exec and its members from general teamMembers to avoid duplicate rendering
                      loadedTeamMembers = loadedTeamMembers.filter(m =>
                        m.id !== financeExecData.id && m.reports_to_id !== financeExecData.id
                      );
                    }

                    // Set general state
                    setAdvisors(loadedAdvisors);
                    setExecutives(loadedExecutives);
                    setDepartmentLeaders(loadedDeptLeaders);
                    setTeamMembers(loadedTeamMembers);

                    setFinanceDepartment({ executive: financeExecObj, members: financeMembersArray });
                    setError(null);
                } else {
                   setError("No member data received");
                }
            } catch (err) {
                console.error("Error fetching team members:", err);
                setError(err.response?.data?.detail || err.response?.data?.error || err.message || "Failed to load team members.");
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, []);

    if (loading) {
        return (
            <div className={styles.pyramidContainer}>
                <p>Loading team members...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.pyramidContainer}>
                <p>Error loading team members: {error}</p>
            </div>
        );
    }

      // --- Debug logs for loaded arrays ---
      console.log('Department leaders:', departmentLeaders);
      console.log('Team members:', teamMembers);
      console.log('Finance department:', financeDepartment);
      console.log('Executives:', executives);

      // --- Component Rendering ---
      return (

        

        <div className={styles.pyramidContainer} ref={containerRef}>



          <svg viewBox="0 -5 100 60" className={styles.pyramidSvg}>
            {/* --- SVG Definitions for circular clipPaths --- */}
            <defs>
              <clipPath id="clipCircleAdvisor">
                <circle cx={4} cy={4} r={4} />
              </clipPath>
              <clipPath id="clipCircleRegular">
                <circle cx={3.5} cy={3.5} r={3.5} />
              </clipPath>
              <clipPath id="clipCircle" clipPathUnits="objectBoundingBox">
                <circle cx="0.5" cy="0.5" r="0.5" />
              </clipPath>
            </defs>
            {/* --- Lines --- */}
            {/* Line from president to vp finance (finance line)*/}
            {(() => {
              const financeLine1Highlighted = financeDepartment.executive
                ? isLineHighlighted(financeDepartment.executive.id, null)
                : false;
              // Node positions for line endpoints (center of advisor and VP Finance node)
              const advisorX = topMostLevel[0].x;
              const advisorY = topMostLevel[0].y + 4; // center of 8x8 advisor image
              const vpFinanceX = topMostLevel[0].x + 30 + 3.5; // center of 7x7 image
              const vpFinanceY = topMostLevel[0].y + 12 + 3.5;
              return (
                <line
                  x1={advisorX}
                  y1={advisorY}
                  x2={vpFinanceX}
                  y2={vpFinanceY}
                  stroke={financeLine1Highlighted ? "#3B82F6" : "#000000"}
                  strokeWidth={financeLine1Highlighted ? "0.5" : "0.3"}
                  className={financeLine1Highlighted ? `${styles.pyramidLine} ${styles.highlighted}` : styles.pyramidLine}
                />
              );
            })()}

            {/* Line from VP Finance node to the member finance  (finance line)*/}
            {(() => {
              const financeLine2Highlighted = financeDepartment.executive && financeDepartment.members && financeDepartment.members.length > 0
                ? isLineHighlighted(financeDepartment.executive.id, financeDepartment.members[0].id)
                : false;
              // VP Finance node center
              const vpFinanceX = topMostLevel[0].x + 30 + 3.5;
              const vpFinanceY = topMostLevel[0].y + 12 + 3.5;
              // Finance member node center
              const financeMemberX = topMostLevel[0].x + 38 + 3.5;
              const financeMemberY = topMostLevel[0].y + 10 + 3.5;
              return (
                <line
                  x1={vpFinanceX}
                  y1={vpFinanceY}
                  x2={financeMemberX}
                  y2={financeMemberY}
                  stroke={financeLine2Highlighted ? "#3B82F6" : "#000000"}
                  strokeWidth={financeLine2Highlighted ? "0.5" : "0.3"}
                  className={financeLine2Highlighted ? `${styles.pyramidLine} ${styles.highlighted}` : styles.pyramidLine}
                />
              );
            })()}

            {/* Line connecting president (advisor) to vice president */}
            {topLevel.length === 1 && topMostLevel.length === 1 && (() => {
              const advisorLineHighlighted = isLineHighlighted(topLevel[0].id);
              // advisor center
              const advisorX = topMostLevel[0].x;
              const advisorY = topMostLevel[0].y + 4;
              // exec center
              const execX = topLevel[0].x;
              const execY = topLevel[0].y + 3.5;
              return (
                <line
                  key={`advisor-connection-${topMostLevel[0].id}-${topLevel[0].id}`}
                  x1={advisorX} y1={advisorY}
                  x2={execX} y2={execY}
                  stroke={advisorLineHighlighted ? "#3B82F6" : "#000000"}
                  strokeWidth={advisorLineHighlighted ? "0.5" : "0.3"}
                  className={advisorLineHighlighted ? `${styles.pyramidLine} ${styles.highlighted}` : styles.pyramidLine}
                />
              );
            })()}

            {/* Lines connecting leaders to vice president */}
            {topLevel.map(exec => (
              middleLevel.map(leader => {
                const highlighted = isLineHighlighted(leader.id);
                // exec center
                const execX = exec.x;
                const execY = exec.y + 3.5;
                // leader center
                const leaderX = leader.x;
                const leaderY = leader.y + 3.5;
                return (
                  <line
                    key={`exec-leader-line-${exec.id}-${leader.id}`}
                    x1={execX} y1={execY}
                    x2={leaderX} y2={leaderY}
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
                const highlighted = isLineHighlighted(leader.id, member.id); 
                // leader center
                const leaderX = leader.x;
                const leaderY = leader.y + 3.5;
                // member center
                const memberX = memberPos.x;
                const memberY = memberPos.y + 3.5;
                return (
                  <line 
                    key={`${leader.id}-${member.id}`}
                    x1={leaderX} y1={leaderY} 
                    x2={memberX} y2={memberY} 
                    stroke={highlighted ? "#3B82F6" : "#000000"}
                    strokeWidth={highlighted ? "0.5" : "0.3"}
                    className={highlighted ? `${styles.pyramidLine} ${styles.highlighted}` : styles.pyramidLine}
                  />
                );
              });
            })}
            {/* --- Nodes --- */}

            {/* VP Finance Node */}
            {financeDepartment.executive && (
            <g
              key="vp-finance"
              onMouseEnter={(e) => handleMouseEnter({ data: financeDepartment.executive, x: topMostLevel[0].x + 26, y: topMostLevel[0].y + 6 }, e)}
              onMouseLeave={handleMouseLeave}
            >
              {financeDepartment.executive && financeDepartment.executive.pfp_img ? (
                <image
                  href={financeDepartment.executive.pfp_img}
                  x={topMostLevel[0].x + 30}
                  y={topMostLevel[0].y + 12}
                  width={7}
                  height={7}
                  clipPath="url(#clipCircle)"
                  preserveAspectRatio="xMidYMid slice"
                  className={styles.pyramidNode}
                />
              ) : (
                <rect
                  x={topMostLevel[0].x + 30}
                  y={topMostLevel[0].y + 12}
                  width={7}
                  height={7}
                  fill="#CCCCCC"
                  rx={3.5}
                  className={styles.pyramidNode}
                />
              )}
            </g>
            )}
            {/* Finance Department Member Node */}
            {financeDepartment.members && financeDepartment.members.length > 0 && (
            <g
              key="finance-member"
              onMouseEnter={(e) => handleMouseEnter({ data: financeDepartment.members[0], x: topMostLevel[0].x + 38, y: topMostLevel[0].y + 10 }, e)}
              onMouseLeave={handleMouseLeave}
            >
              {financeDepartment.members[0] && financeDepartment.members[0].pfp_img ? (
                <image
                  href={financeDepartment.members[0].pfp_img}
                  x={topMostLevel[0].x + 38}
                  y={topMostLevel[0].y + 10}
                  width={7}
                  height={7}
                  clipPath="url(#clipCircle)"
                  preserveAspectRatio="xMidYMid slice"
                  className={`${styles.pyramidNode} cursor-pointer`}
                />
              ) : (
                <rect
                  x={topMostLevel[0].x + 38}
                  y={topMostLevel[0].y + 10}
                  width={7}
                  height={7}
                  fill="#CCCCCC"
                  rx={3.5}
                  className={`${styles.pyramidNode} cursor-pointer`}
                />
              )}
            </g>
            )}
            
            {/* Top-most level (Advisor) */}
            {topMostLevel.map(advisor => (
              <g
                key={`advisor-${advisor.id}`}
                onMouseEnter={(e) => handleMouseEnter({ data: advisor, x: advisor.x, y: advisor.y }, e)}
                onMouseLeave={handleMouseLeave}
              >
                {advisor.pfp_img ? (
                  <image
                    href={advisor.pfp_img}
                    x={advisor.x - 4}
                    y={advisor.y}
                    width={8}
                    height={8}
                    clipPath="url(#clipCircle)"
                    preserveAspectRatio="xMidYMid slice"
                    className={styles.pyramidNode}
                  />
                ) : (
                  <rect
                    x={advisor.x - 4}
                    y={advisor.y}
                    width={8}
                    height={8}
                    fill="#CCCCCC"
                    rx={4}
                    className={styles.pyramidNode}
                  />
                )}
              </g>
            ))}

            {/* Executive */}
            {topLevel.map(exec => (
              <g
                key={`exec-${exec.id}`}
                onMouseEnter={(e) => handleMouseEnter({ data: exec, x: exec.x, y: exec.y }, e)}
                onMouseLeave={handleMouseLeave} 
              >
                {exec.pfp_img ? (
                  <image
                    href={exec.pfp_img}
                    x={exec.x - 3.5}
                    y={exec.y}
                    width={7}
                    height={7}
                    clipPath="url(#clipCircle)"
                    preserveAspectRatio="xMidYMid slice"
                    className={styles.pyramidNode}
                  />
                ) : (
                  <rect
                    x={exec.x - 3.5}
                    y={exec.y}
                    width={7}
                    height={7}
                    fill="#CCCCCC"
                    rx={3.5}
                    className={styles.pyramidNode}
                  />
                )}
              </g>
            ))}
            
            {middleLevel.map(leader => (
              <g
                key={`leader-${leader.id}`}
                onMouseEnter={(e) => handleMouseEnter({ data: leader, x: leader.x, y: leader.y }, e)}
                onMouseLeave={handleMouseLeave}
              >
                {leader.pfp_img ? (
                  <image
                    href={leader.pfp_img}
                    x={leader.x - 3.5}
                    y={leader.y}
                    width={7}
                    height={7}
                    clipPath="url(#clipCircle)"
                    preserveAspectRatio="xMidYMid slice"
                    className={`${styles.pyramidNode} cursor-pointer`}
                  />
                ) : (
                  <rect
                    x={leader.x - 3.5}
                    y={leader.y}
                    width={7}
                    height={7}
                    fill="#CCCCCC"
                    rx={3.5}
                    className={`${styles.pyramidNode} cursor-pointer`}
                  />
                )}
              </g>
            ))}
            
            {bottomLevel.map(member => (
              <g
                key={`member-${member.id}`}
                onMouseEnter={(e) => handleMouseEnter({ data: member, x: member.x, y: member.y }, e)}
                onMouseLeave={handleMouseLeave}
              >
                {member.pfp_img ? (
                  <image
                    href={member.pfp_img}
                    x={member.x - 3.5}
                    y={member.y}
                    width={7}
                    height={7}
                    clipPath="url(#clipCircle)"
                    preserveAspectRatio="xMidYMid slice"
                    className={`${styles.pyramidNode} cursor-pointer`}
                  />
                ) : (
                  <rect
                    x={member.x - 3.5}
                    y={member.y}
                    width={7}
                    height={7}
                    fill="#CCCCCC"
                    rx={3.5}
                    className={`${styles.pyramidNode} cursor-pointer`}
                  />
                )}
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