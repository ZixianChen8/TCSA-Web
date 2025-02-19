// src/components/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './Btn1.css';

const Btn1 = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    href,
    target = '_self',
  }) => {
  
  const navigate = useNavigate();

  const handleClick = (event) => {
    if (href) {
      // Prevent default anchor behavior
      event.preventDefault();
      // Use React Router to navigate
      navigate(href);
    } else if (onClick) {
      onClick(event);
    }
  };

  const classNames = `button button-${size} button-${variant} ${
    disabled ? 'button-disabled' : ''
  }`;

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={classNames}
    >
      {children}
    </button>
  );
};

Btn1.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  href: PropTypes.string,
  target: PropTypes.oneOf(['_self', '_blank', '_parent', '_top']),
};

export default Btn1;