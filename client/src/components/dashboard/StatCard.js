// client/src/components/dashboard/StatCard.js
import React from 'react';

const StatCard = ({ label, icon, value, trend, description }) => {
  // Determine if trend is positive or negative
  const isTrendPositive = parseFloat(trend) >= 0;
  
  return (
    <div className="card stat-card">
      <div className="card-body">
        <div className="stat-label">
          <i className={`fas fa-${icon}`}></i> {label}
        </div>
        <div className="stat-value">{value}</div>
        <div className="stat-description">
          <span className={`stat-trend ${isTrendPositive ? 'trend-up' : 'trend-down'}`}>
            <i className={`fas fa-arrow-${isTrendPositive ? 'up' : 'down'}`}></i> {Math.abs(trend)}%
          </span>
          {description}
        </div>
      </div>
    </div>
  );
};

export default StatCard;