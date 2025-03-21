// client/src/components/dashboard/ActivityItem.js
import React from 'react';

const ActivityItem = ({ time, user, description }) => {
  return (
    <div className="activity-item">
      <div className="activity-badge"></div>
      <div className="activity-time">{time}</div>
      <div className="activity-description">
        <span className="activity-user">{user}</span> {description}
      </div>
    </div>
  );
};

export default ActivityItem;