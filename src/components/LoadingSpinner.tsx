import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  text = 'Loading...',
  fullScreen = false,
}) => {
  // Define sizes based on the size prop
  const sizes = {
    small: {
      width: '1.5rem',
      height: '1.5rem',
      borderWidth: '2px',
    },
    medium: {
      width: '2.5rem',
      height: '2.5rem',
      borderWidth: '3px',
    },
    large: {
      width: '3.5rem',
      height: '3.5rem',
      borderWidth: '4px',
    },
  };
  
  const currentSize = sizes[size];
  
  const spinnerStyle: React.CSSProperties = {
    width: currentSize.width,
    height: currentSize.height,
    borderRadius: '50%',
    border: `${currentSize.borderWidth} solid var(--gray-200)`,
    borderTopColor: 'var(--primary)',
    animation: 'spinner 0.8s linear infinite',
  };
  
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    ...(fullScreen && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      zIndex: 1000,
    }),
  };
  
  const textStyle: React.CSSProperties = {
    marginTop: '0.75rem',
    color: 'var(--gray-600)',
    fontSize: size === 'small' ? '0.875rem' : '1rem',
  };
  
  return (
    <div style={containerStyle}>
      <div style={spinnerStyle} />
      {text && <div style={textStyle}>{text}</div>}
      <style>
        {`
          @keyframes spinner {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;