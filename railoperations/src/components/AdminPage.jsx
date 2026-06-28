import React, { useEffect, useState } from 'react';
import DashboardCard from './DashboardCard';
import './DashboardGrid.css';

const adminCards = [
  { title: 'Add Duty', icon: '➕', colorClass: 'card-indigo' },
  { title: 'Upload Daily Roster', icon: '⬆️', colorClass: 'card-teal' },
  { title: 'View Issues', icon: '⚠️', colorClass: 'card-violet' },
  { title: 'Add Notification', icon: '🔔', colorClass: 'card-pink' },
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
          <div className="ticker-text">
            <span className="ticker-item">Welcome to the admin panel. Use this area to manage rail operations tools.</span>
          </div>
        </div>
        <div className="top-bar-right">
          <button className="nav-button admin-button" type="button" onClick={onLogout}>
            <span className="admin-icon">🚪</span>
            <span className="admin-label">Logout</span>
          </button>
        </div>
      </div>

      <div className="app-content">
        <main className="dashboard-page">
          <section className="dashboard-grid">
            {adminCards.map((card) => (
              <DashboardCard
                key={card.title}
                title={card.title}
                icon={card.icon}
                colorClass={card.colorClass}
              />
            ))}
          </section>
        </main>

        <footer className="app-footer">
          Admin controls are available for authorized users only.
        </footer>
      </div>
    </div>
  );
};

export default AdminPage;
