import React, { useEffect, useMemo, useState } from 'react';
import './DashboardGrid.css';
import './DutyDetailsPage.css';

const testDutyData = {
  dutyNo: 'PDC',
  signOnTime: '4:15',
  signOnLocation: 'RHD',
  signOffTime: '12:00',
  signOffLocation: 'DHO',
  totalTrips: '0',
  dutyHours: '8:00',
  trainRunningHours: '5:21',
  trips: [
    { trainNo: '101', tripFrom: 'RHD', tripTo: 'DHO', tripStartLocation: 'CVC UP', tripEndLocation: 'CVC UP', line: 'Line 1', breakTime: '0:45' },
    { trainNo: '108', tripFrom: 'DHO', tripTo: 'RHD', tripStartLocation: 'CVC UP', tripEndLocation: 'CVC UP', line: 'Line 1', breakTime: '1:08' },
    { trainNo: '107', tripFrom: 'RHD', tripTo: 'DHO', tripStartLocation: 'CVC UP', tripEndLocation: 'CVC UP', line: 'Line 1', breakTime: '0:24' },
    { trainNo: '105', tripFrom: 'DHO', tripTo: 'RHD', tripStartLocation: 'CVC UP', tripEndLocation: 'CVC UP', line: 'Line 1', breakTime: '1:16' },
  ],
};

const DutyDetailsPage = ({ onBack }) => {
  const [dutyNumber, setDutyNumber] = useState('');
  const [dutyData, setDutyData] = useState(null);
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

  const summaryCards = useMemo(() => {
    if (!dutyData) return [];
    return [
      { label: 'Duty No', value: dutyData.dutyNo },
      { label: 'Sign On Time', value: dutyData.signOnTime },
      { label: 'Sign On Location', value: dutyData.signOnLocation },
      { label: 'Sign Off Time', value: dutyData.signOffTime },
      { label: 'Sign Off Location', value: dutyData.signOffLocation },
      { label: 'Total Trips', value: dutyData.totalTrips },
      { label: 'Duty Hours', value: dutyData.dutyHours },
      { label: 'Train Running Hours', value: dutyData.trainRunningHours },
    ];
  }, [dutyData]);

  const handleSearch = (event) => {
    event.preventDefault();
    setDutyData(testDutyData);
  };

  return (
    <div className="app-shell">
      <div className="top-bar">
        <div className="top-bar-left">{clockValue}</div>
        <div className="top-bar-ticker" aria-hidden="true">
          <div className="ticker-text">
            <span className="ticker-item">Search duty number to view sign-on, sign-off, and trip details</span>
          </div>
        </div>
        <div className="top-bar-right">
          <button className="nav-button admin-button" aria-label="Back to Home" onClick={onBack}>
            <span className="admin-icon">🏠</span>
            <span className="admin-label">Home</span>
          </button>
        </div>
      </div>

      <div className="app-content">
        <main className="dashboard-page">
          <section className="search-panel">
            <form className="search-row" onSubmit={handleSearch}>
              <input
                id="duty-number"
                value={dutyNumber}
                onChange={(event) => setDutyNumber(event.target.value)}
                placeholder="Enter duty number eg 101"
              />
              <button type="submit">
                Search
              </button>
            </form>
          </section>

          {dutyData && (
            <>
              <section className="summary-grid">
                {summaryCards.map((item) => (
                  <div className="summary-card" key={item.label}>
                    <div className="summary-label">{item.label}</div>
                    <div className="summary-value">{item.value}</div>
                  </div>
                ))}
              </section>

              <section className="trip-table-card">
                <div className="trip-table-header">
                  <span>Train No</span>
                  <span>Trip From</span>
                  <span>Trip To</span>
                  <span>Trip Start Location</span>
                  <span>Trip End Location</span>
                  <span>Line</span>
                  <span>Break Time</span>
                </div>
                {dutyData.trips.map((trip, index) => (
                  <div className="trip-table-row" key={`${trip.trainNo}-${index}`}>
                    <span>{trip.trainNo}</span>
                    <span>{trip.tripFrom}</span>
                    <span>{trip.tripTo}</span>
                    <span>{trip.tripStartLocation}</span>
                    <span>{trip.tripEndLocation}</span>
                    <span>{trip.line}</span>
                    <span>{trip.breakTime}</span>
                  </div>
                ))}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DutyDetailsPage;
