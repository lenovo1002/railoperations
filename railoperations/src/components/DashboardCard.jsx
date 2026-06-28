import React from 'react';
import './DashboardCard.css';

const DashboardCard = ({ title, icon, colorClass, subtitle, href }) => {
  const cardContent = (
    <>
      <div className="dashboard-card-icon">{icon}</div>
      <div className="dashboard-card-text">
        <div className="dashboard-card-title">{title}</div>
        {subtitle && <div className="dashboard-card-subtitle">{subtitle}</div>}
      </div>
    </>
  );

  if (href) {
    return (
      <a
        className={`dashboard-card ${colorClass}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {cardContent}
      </a>
    );
  }

  return <div className={`dashboard-card ${colorClass}`}>{cardContent}</div>;
};

export default DashboardCard;
