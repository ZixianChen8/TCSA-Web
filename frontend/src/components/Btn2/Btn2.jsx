import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Btn2 = ({ title, href = '#' }) => {
  const isExternal = href.startsWith('http');
  const content = (
    <>
      <span className="btn-title">{title}</span>
      <span className="iconWrap" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </>
  );

  return (
    <StyledWrapper>
      {isExternal ? (
        <a href={href} className="btn-content" target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        <Link to={href} className="btn-content">
          {content}
        </Link>
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .btn-content {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.5rem 0.875rem 1.75rem;
    text-decoration: none;
    font-family: var(--font-body, 'Outfit', sans-serif);
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--color-on-accent, #fffdf8);
    background: var(--color-accent, #8f001a);
    border-radius: 9999px;
    transition: background 280ms cubic-bezier(0.32, 0.72, 0, 1),
      transform 150ms cubic-bezier(0.32, 0.72, 0, 1),
      box-shadow 280ms cubic-bezier(0.32, 0.72, 0, 1);
    box-shadow: 0 4px 16px -4px rgba(143, 0, 26, 0.35);
  }

  .btn-content:hover {
    background: var(--color-accent-hover, #6d0014);
    color: var(--color-on-accent, #fffdf8);
    box-shadow: 0 8px 24px -6px rgba(143, 0, 26, 0.4);
  }

  .btn-content:active {
    transform: scale(0.98);
  }

  .iconWrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: rgba(255, 253, 248, 0.15);
    transition: transform 280ms cubic-bezier(0.32, 0.72, 0, 1);
  }

  .btn-content:hover .iconWrap {
    transform: translate(2px, -1px);
  }
`;

export default Btn2;
