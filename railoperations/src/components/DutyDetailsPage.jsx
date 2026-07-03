import React, { useEffect, useMemo, useState } from 'react';
import './DashboardGrid.css';
import './DutyDetailsPage.css';

const API_BASE_URL = '';









const DutyDetailsPage = ({ onBack, onNotify }) => {
  const [dutyNumber, setDutyNumber] = useState('');
  const [dutyData, setDutyData] = useState(null);
  const [clockValue, setClockValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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



  const getTripStatus = (startTimeStr, endTimeStr) => {
    if (!startTimeStr || !endTimeStr) return 'past';
    const startParts = startTimeStr.split(':');
    const endParts = endTimeStr.split(':');
    if (startParts.length < 2 || endParts.length < 2) return 'past';

    const startHours = parseInt(startParts[0], 10) || 0;
    const startMinutes = parseInt(startParts[1], 10) || 0;
    const endHours = parseInt(endParts[0], 10) || 0;
    const endMinutes = parseInt(endParts[1], 10) || 0;

    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    const startTotal = startHours * 60 + startMinutes;
    let endTotal = endHours * 60 + endMinutes;
    if (endTotal < startTotal) {
      // Handle overnight shift wraps around midnight
      endTotal += 24 * 60;
    }
    
    const currentTotal = currentHours * 60 + currentMinutes;

    if (currentTotal >= startTotal && currentTotal <= endTotal) {
      return 'ongoing';
    } else if (currentTotal < startTotal) {
      return 'upcoming';
    } else {
      return 'past';
    }
  };

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

  const handleSearch = async (event) => {
    event.preventDefault();
    const trimmedDutyNumber = dutyNumber.trim();

    if (!trimmedDutyNumber) {
      setDutyData(null);
      setErrorMessage('Please enter a duty number.');
      onNotify?.('Please enter a duty number.', 'error');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    onNotify?.(`Fetching duty ${trimmedDutyNumber} from the server...`, 'info');

    try {
      const response = await fetch(`${API_BASE_URL}/tripchart/${encodeURIComponent(trimmedDutyNumber)}`);
     

      if (!response.ok) {
        throw new Error('Unable to load duty details from the server.');
      }

      const payload = await response.json();
      const normalizedDutyData = {
        dutyNo: payload.dutyNo,
        signOnTime: payload.signOnTime,
        signOnLocation: payload.signOnLocation,
        signOffTime: payload.signOffTime,
        signOffLocation: payload.signOffLocation,
        totalTrips: payload.tripTime?.length ?? 0,
        dutyHours: payload.dutyHours || '',
        trainRunningHours: payload.trainRunningHours || '',
        trips: (payload.tripTime || []).map((trip) => ({
          trainNo: trip.trainId,
          tripFrom: trip.tripStartTime,
          tripTo: trip.tripEndTime,
          tripStartLocation: trip.tripStartsFrom,
          tripEndLocation: trip.tripEndsAt,
          line: payload.line || 'Line 1',
          breakTime: trip.breakTime,
        })),
      };

      setDutyData(normalizedDutyData);
      onNotify?.(`Duty ${trimmedDutyNumber} loaded successfully.`, 'success');
    } catch (error) {
      const message = error.message || 'Unable to load duty details from the server.';
      setDutyData(null);
      setErrorMessage(message);
      onNotify?.(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell" style={{ '--bg-image': 'url("/images/metro-bg.png")' }}>
      <div className="top-bar">
        <div className="top-bar-left-sec" onClick={onBack} style={{ cursor: 'pointer' }}>
          <div className="top-bar-brand">
            <span className="brand-logo">🚇</span>
            <span className="brand-name">MetroDuty</span>
          </div>
          <div className="top-bar-clock">
            <span className="clock-pulse"></span>
            <span className="clock-text">{clockValue}</span>
          </div>
        </div>

        <div className="top-bar-right">
          <button className="nav-button admin-button" aria-label="Back to Home" onClick={onBack}>
            <span className="admin-icon">🏠</span>
            <span className="admin-label">Home</span>
          </button>
        </div>
      </div>

      <div className="top-bar-ticker static-ticker" aria-hidden="true">
        <div className="ticker-text">
          <span className="ticker-item">🔍 Search duty number to view sign-on, sign-off, and trip details</span>
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
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </section>

          {errorMessage && <p role="alert" className="search-error">{errorMessage}</p>}

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
                  <span>Trip Start Time</span>
                  <span>Trip End Time</span>
                  <span>Trip Start Location</span>
                  <span>Trip End Location</span>
                  <span>Line</span>
                  <span>Break Time</span>
                </div>
                {dutyData.trips.map((trip, index) => {
                  const status = getTripStatus(trip.tripFrom, trip.tripTo);
                  const isUpcoming = status === 'upcoming';
                  const isOngoing = status === 'ongoing';
                  return (
                    <div className={`trip-table-row ${isUpcoming ? 'upcoming-trip' : isOngoing ? 'ongoing-trip' : 'past-trip'}`} key={`${trip.trainNo}-${index}`}>
                      <span>{trip.trainNo}</span>
                      <span>
                        {trip.tripFrom}
                        {isUpcoming && <span className="trip-tag upcoming-tag">Upcoming</span>}
                        {isOngoing && <span className="trip-tag ongoing-tag">Ongoing</span>}
                      </span>
                      <span>{trip.tripTo}</span>
                      <span>{trip.tripStartLocation}</span>
                      <span>{trip.tripEndLocation}</span>
                      <span>{trip.line}</span>
                      <span>{trip.breakTime}</span>
                    </div>
                  );
                })}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DutyDetailsPage;
