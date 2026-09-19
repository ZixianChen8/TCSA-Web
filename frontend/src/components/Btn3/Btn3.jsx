import React from 'react';
import styled from 'styled-components';

const Btn3 = ({ btnText }) => (
  <StyledWrapper>
    <button type="button" className="btn">
      <span className="text">{btnText}</span>
      <span className="iconWrap" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </button>
  </StyledWrapper>
);

const StyledWrapper = styled.div`
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.25rem 0.75rem 1.5rem;
    background: transparent;
    color: var(--color-ink, #1c1412);
    font-family: var(--font-body, 'Outfit', sans-serif);
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border: 1.5px solid var(--color-border-strong, rgba(28, 20, 18, 0.18));
    border-radius: 9999px;
    cursor: pointer;
    transition: background 280ms cubic-bezier(0.32, 0.72, 0, 1),
      color 280ms cubic-bezier(0.32, 0.72, 0, 1),
      border-color 280ms cubic-bezier(0.32, 0.72, 0, 1),
      transform 150ms cubic-bezier(0.32, 0.72, 0, 1);
  }

  .btn:hover {
    background: var(--color-accent, #8f001a);
    color: var(--color-on-accent, #fffdf8);
    border-color: var(--color-accent, #8f001a);
  }

  .btn:active {
    transform: scale(0.98);
  }

  .iconWrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    background: var(--color-accent-soft, rgba(143, 0, 26, 0.08));
    transition: background 280ms cubic-bezier(0.32, 0.72, 0, 1),
      transform 280ms cubic-bezier(0.32, 0.72, 0, 1);
  }

  .btn:hover .iconWrap {
    background: rgba(255, 253, 248, 0.2);
    transform: translateX(2px);
  }
`;

export default Btn3;
