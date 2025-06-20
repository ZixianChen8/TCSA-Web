import React from 'react';
import styled from 'styled-components';

const TeamMember = ({ name, email, quote, department }) => {
  return (
    <StyledWrapper>
      <div className="notification">
        <div className="notiglow" />
        <div className="notiborderglow" />
        <div className="notititle">{name}</div>
        <div className="notidepartment">{department}</div>
        <div className="notiemail">{email}</div>
        <div className="notibody">{quote}</div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .notification {
    display: flex;
    flex-direction: column;
    isolation: isolate;
    position: relative;
    width: 18rem;
    height: 8rem;
    background: #29292c;
    border-radius: 1rem;
    overflow: hidden;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 12px;
    --gradient: linear-gradient(to bottom, #c1121f, #ff4d6d, #ffb3c1);
    --color: #c1121f
  }

  .notification:before {
    position: absolute;
    content: "";
    inset: 0.0625rem;
    border-radius: 0.9375rem;
    background: #18181b;
    z-index: 2
  }

  .notification:after {
    position: absolute;
    content: "";
    width: 0.25rem;
    inset: 0.65rem auto 0.65rem 0.5rem;
    border-radius: 0.125rem;
    background: var(--gradient);
    transition: transform 300ms ease;
    z-index: 4;
  }

  .notification:hover:after {
    transform: translateX(0.15rem)
  }

  .notititle {
    color: var(--color);
    padding: 0.65rem 0.25rem 0rem 1.25rem;
    font-weight: 500;
    font-size: 1.1rem;
    transition: transform 300ms ease;
    z-index: 5;
  }

  .notification:hover .notititle {
    transform: translateX(0.15rem)
  }

  .notibody {
    color: #99999d;
    padding: 0 1.25rem;
    transition: transform 300ms ease;
    z-index: 5;
  }

  .notidepartment {
    color: #99999d;
    padding: 0 1.25rem 0 1.25rem;
    font-size: 0.9rem;
    transition: transform 300ms ease;
    z-index: 5;
  }
  .notification:hover .notidepartment {
    transform: translateX(0.2rem);
  }

  .notiemail {
    color: #99999d;
    padding: 0 1.25rem;
    font-size: 0.8rem;
    transition: transform 300ms ease;
    z-index: 5;
  }
  .notification:hover .notiemail {
    transform: translateX(0.2rem);
  }

  .notification:hover .notibody {
    transform: translateX(0.25rem)
  }

  .notiglow,
  .notiborderglow {
    position: absolute;
    width: 20rem;
    height: 20rem;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle closest-side at center, white, transparent);
    opacity: 0;
    transition: opacity 300ms ease;
  }

  .notiglow {
    z-index: 3;
  }

  .notiborderglow {
    z-index: 1;
  }

  .notification:hover .notiglow {
    opacity: 0.1
  }

  .notification:hover .notiborderglow {
    opacity: 0.1
  }

  .note {
    color: var(--color);
    position: fixed;
    top: 80%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    font-size: 0.9rem;
    width: 75%;
  }`;

export default TeamMember;
