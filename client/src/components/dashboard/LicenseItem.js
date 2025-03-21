// client/src/components/dashboard/LicenseItem.js
import React from 'react';

const LicenseItem = ({ employeeName, initials, licenseType, daysRemaining, status }) => {
  return (
    <div className="license-item">
      <div className="license-item-avatar">
        {initials}
      </div>
      <div className="license-item-info">
        <div className="license-item-name">{employeeName}</div>
        <div className="license-item-detail">{licenseType}</div>
      </div>
      <div className={`license-status status-${status}`}>{daysRemaining} days</div>
    </div>
  );
};

export default LicenseItem;