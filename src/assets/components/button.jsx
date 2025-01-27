import React from 'react';

export const Button = ({ children, onClick, variant = 'default', size = 'md', disabled, className }) => {
  const styles = {
    base: {
      borderRadius: '8px',
      fontWeight: '500',
      outline: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'background-color 0.2s, opacity 0.2s',
    },
    variants: {
      default: {
        backgroundColor: '#1E90FF',
        color: '#FFFFFF',
        border: 'none',
        padding: '10px 20px',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '#555555',
        border: 'none',
        padding: '10px 20px',
      },
      outline: {
        backgroundColor: 'transparent',
        color: '#555555',
        border: '1px solid #CCCCCC',
        padding: '10px 20px',
      },
    },
    sizes: {
      sm: { fontSize: '12px', padding: '6px 12px' },
      md: { fontSize: '14px', padding: '10px 20px' },
      lg: { fontSize: '16px', padding: '14px 28px' },
      icon: { padding: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
    },
  };

  const combinedStyles = {
    ...styles.base,
    ...styles.variants[variant],
    ...styles.sizes[size],
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...combinedStyles }}
      className={className}
    >
      {children}
    </button>
  );
};
