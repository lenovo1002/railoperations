import React, { useEffect, useState } from 'react';
import DashboardCard from './DashboardCard';
import './DashboardGrid.css';

const adminCards = [
  { title: 'Add Duty', icon: '➕', colorClass: 'card-pink' },
  { title: 'Upload Daily Roster', icon: '⬆', colorClass: 'card-purple' },

];

const AdminPage = ({ onLogout }) => {
  const [clockValue, setClockValue] = useState('');

  useEffect(() => {
    const formatClock = () => {
      const now = new Date();
      const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
      const datePart = now.toLocaleDateString('en-US', options);
      const timePart = [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map((value) => String(value).padStart(2, '0'))
        .join(':');
      setClockValue(`${datePart} | ${timePart}`);
    };

    formatClock();
    const interval = setInterval(formatClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-shell">
      <div className="top-bar">
        <div className="top-bar-left">{clockValue}</div>

        <div className="top-bar-ticker" aria-hidden="true">
          
        </div>

        <div className="top-bar-right">
          <button className="nav-button admin-button" aria-label="Logout" onClick={onLogout}>
            <span className="admin-icon">🚪</span>
            <span className="admin-label">Logout</span>
          </button>
        </div>
      </div>

      <div className="app-content">
        <main className="dashboard-page">
          <section className="dashboard-grid">
            {adminCards.map((card) => (
              <DashboardCard key={card.title} {...card} />
            ))}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
