import React from 'react';
import styled from 'styled-components';

const Logo = () => (
  <StyledWrapper>
    <span className="logo">TCSA</span>
  </StyledWrapper>
);

const StyledWrapper = styled.div`
  .logo {
    font-family: var(--font-display, 'Outfit', sans-serif);
    font-size: 1.375rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: var(--color-ink, #1c1412);
    transition: color 280ms cubic-bezier(0.32, 0.72, 0, 1);
  }

  a:hover & .logo {
    color: var(--color-accent, #8f001a);
  }
`;

export default Logo;
