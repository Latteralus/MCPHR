// client/src/components/dashboard/ModuleCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const ModuleCard = ({ title, description, icon, link, actionText }) => {
  return (
    <div className="card module-card">
      <div className="module-card-body">
        <div className="module-icon">
          <i className={`fas fa-${icon}`}></i>
        </div>
        <h4 className="module-title">{title}</h4>
        <p className="module-description">{description}</p>
        <Link to={link} className="action-link">
          {actionText}
        </Link>
      </div>
    </div>
  );
};

export default ModuleCard;