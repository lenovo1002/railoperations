import React from 'react';
import './DashboardCard.css';

const DashboardCard = ({ title, icon, colorClass, subtitle }) => {
  return (
    <div className={`dashboard-card ${colorClass}`}>
      <div className="dashboard-card-icon">{icon}</div>
      <div className="dashboard-card-text">
        <div className="dashboard-card-title">{title}</div>
        {subtitle && <div className="dashboard-card-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};

export default DashboardCard;
