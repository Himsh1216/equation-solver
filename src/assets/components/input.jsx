import React from 'react';

export const Input = ({ type = 'text', placeholder, value, onChange, className }) => {
  const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #CCCCCC',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const focusedStyle = {
    borderColor: '#1E90FF',
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = focusedStyle.borderColor;
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = inputStyle.border;
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{ ...inputStyle }}
      className={className}
    />
  );
};
