import React from 'react';

export const Card = ({ children, className }) => {
  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '16px',
    maxWidth: '100%',
    overflow: 'hidden',
  };

  return <div style={{ ...cardStyle }} className={className}>{children}</div>;
};

export const CardHeader = ({ children, className }) => {
  const headerStyle = {
    borderBottom: '1px solid #EEEEEE',
    paddingBottom: '12px',
    marginBottom: '16px',
  };

  return <div style={{ ...headerStyle }} className={className}>{children}</div>;
};

export const CardTitle = ({ children, className }) => {
  const titleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: '0',
  };

  return <h2 style={{ ...titleStyle }} className={className}>{children}</h2>;
};

export const CardContent = ({ children, className }) => {
  const contentStyle = {
    paddingTop: '12px',
  };

  return <div style={{ ...contentStyle }} className={className}>{children}</div>;
};
