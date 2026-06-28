import React from 'react';
import DashboardCard from './DashboardCard';
import './DashboardGrid.css';

const cards = [
  { title: 'Sign On Register', icon: '∆', colorClass: 'card-pink' },
  { title: 'Sign Off Register', icon: '📋', colorClass: 'card-purple' },
  { title: 'Get Duty Details', icon: '✔', colorClass: 'card-green' },
  { title: 'Compare Duties', icon: '⧗', colorClass: 'card-indigo' },
  { title: 'External Links', icon: '⧉', colorClass: 'card-teal' },
  { title: 'Support', icon: '⟲', colorClass: 'card-violet' },
  { title: 'Raise Issue', icon: '⟲', colorClass: 'card-violet' },
];

const DashboardGrid = () => {
  return (
    <section className="dashboard-grid">
      {cards.map((card) => (
        <DashboardCard key={card.title} {...card} />
      ))}
    </section>
  );
};

export default DashboardGrid;
