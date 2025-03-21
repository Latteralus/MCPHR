// client/src/components/common/Loading.js
import React from 'react';

const Loading = ({ size = 'medium', fullScreen = false }) => {
  // Determine spinner size
  const spinnerSize = {
    small: 20,
    medium: 30,
    large: 40
  }[size] || 30;
  
  const spinnerStyle = {
    width: `${spinnerSize}px`,
    height: `${spinnerSize}px`,
    borderWidth: `${Math.max(3, spinnerSize / 10)}px`
  };
  
  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 9999
      }}>
        <div className="loading-spinner" style={spinnerStyle}></div>
      </div>
    );
  }
  
  return <div className="loading-spinner" style={spinnerStyle}></div>;
};

export default Loading;