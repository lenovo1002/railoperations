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
  const [fallbackModal, setFallbackModal] = useState({ isOpen: false, timeStr: '', alarmTime: '' });

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

  const getAlarmTime = (timeStr) => {
    if (!timeStr) return { hour: 0, minute: 0 };
    const parts = timeStr.split(':');
    let hour = parseInt(parts[0], 10) || 0;
    let minute = parseInt(parts[1], 10) || 0;

    minute -= 15;
    if (minute < 0) {
      minute += 60;
      hour -= 1;
      if (hour < 0) {
        hour += 24;
      }
    }
    return { hour, minute };
  };

  const downloadIcsReminder = (timeStr, hour, minute) => {
    const now = new Date();
    const eventDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
    
    const pad = (n) => String(n).padStart(2, '0');
    const startStr = `${eventDate.getFullYear()}${pad(eventDate.getMonth() + 1)}${pad(eventDate.getDate())}T${pad(hour)}${pad(minute)}00`;
    
    const endParts = timeStr.split(':');
    const endH = parseInt(endParts[0], 10) || 0;
    const endM = parseInt(endParts[1], 10) || 0;
    const endStr = `${eventDate.getFullYear()}${pad(eventDate.getMonth() + 1)}${pad(eventDate.getDate())}T${pad(endH)}${pad(endM)}00`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MetroDuty//Reminder//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@metroduty`,
      `DTSTAMP:${startStr}Z`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:MetroDuty Trip starts in 15 mins`,
      `DESCRIPTION:Your MetroDuty train trip is scheduled to start at ${timeStr}.`,
      'BEGIN:VALARM',
      'TRIGGER:-PT0M',
      'ACTION:DISPLAY',
      'DESCRIPTION:MetroDuty Trip Reminder',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `trip_reminder_${timeStr.replace(':', '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    onNotify?.('Calendar file downloaded! Import it into your Calendar app.', 'success');
  };

  const getAlarmTimeInfo = (timeStr) => {
    const { hour, minute } = getAlarmTime(timeStr);
    const pad = (n) => String(n).padStart(2, '0');
    const formattedAlarmTime = `${pad(hour)}:${pad(minute)}`;
    const message = encodeURIComponent(`MetroDuty Trip starting at ${timeStr}`);
    const intentUri = `intent://#Intent;action=android.intent.action.SET_ALARM;i.android.intent.extra.HOUR=${hour};i.android.intent.extra.MINUTES=${minute};S.android.intent.extra.MESSAGE=${message};B.android.intent.extra.SKIP_UI=false;end`;
    return { formattedAlarmTime, intentUri, hour, minute };
  };

  const getTripStatus = (timeStr) => {
    if (!timeStr) return 'past';
    const parts = timeStr.split(':');
    if (parts.length < 2) return 'past';
    const tripHours = parseInt(parts[0], 10) || 0;
    const tripMinutes = parseInt(parts[1], 10) || 0;

    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    const tripTotal = tripHours * 60 + tripMinutes;
    const currentTotal = currentHours * 60 + currentMinutes;

    return tripTotal > currentTotal ? 'upcoming' : 'past';
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
                  <span>Status / Alarm</span>
                </div>
                {dutyData.trips.map((trip, index) => {
                  const status = getTripStatus(trip.tripFrom);
                  const isUpcoming = status === 'upcoming';
                  const { intentUri, formattedAlarmTime } = getAlarmTimeInfo(trip.tripFrom);
                  return (
                    <div className={`trip-table-row ${isUpcoming ? 'upcoming-trip' : 'past-trip'}`} key={`${trip.trainNo}-${index}`}>
                      <span>{trip.trainNo}</span>
                      <span>
                        {trip.tripFrom}
                        {isUpcoming && <span className="trip-tag upcoming-tag">Upcoming</span>}
                      </span>
                      <span>{trip.tripTo}</span>
                      <span>{trip.tripStartLocation}</span>
                      <span>{trip.tripEndLocation}</span>
                      <span>{trip.line}</span>
                      <span>{trip.breakTime}</span>
                      <span>
                        {isUpcoming ? (
                          <a
                            href={intentUri}
                            className="alarm-btn-icon"
                            title={`Set alarm for ${formattedAlarmTime} (15 mins before trip)`}
                            onClick={(e) => {
                              const isAndroid = /Android/i.test(navigator.userAgent);
                              if (!isAndroid) {
                                e.preventDefault();
                                setFallbackModal({ isOpen: true, timeStr: trip.tripFrom, alarmTime: formattedAlarmTime });
                              } else {
                                onNotify?.(`Opening system Clock app for ${formattedAlarmTime}...`, 'success');
                              }
                            }}
                          >
                            ⏰
                          </a>
                        ) : (
                          <span style={{ fontSize: '1.1rem', opacity: 0.5, paddingLeft: '6px' }} title="Trip completed">✔️</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </section>
            </>
          )}
        </main>
      </div>

      {fallbackModal.isOpen && (
        <div className="modal-overlay" role="presentation" onClick={() => setFallbackModal({ isOpen: false, timeStr: '', alarmTime: '' })}>
          <div className="modal-backdrop" aria-hidden="true" />
          <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="fallback-modal-title" onClick={(event) => event.stopPropagation()} style={{ maxWidth: '500px' }}>
            <h2 id="fallback-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgb(0, 36, 80)' }}>
              <span>⏰</span> Set Alarm Reminder
            </h2>
            <div style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', margin: '16px 0 20px' }}>
              <p style={{ marginBottom: '12px' }}>
                Direct alarm clock integration is supported on Android devices.
              </p>
              <p style={{ fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
                For iOS (Safari/Brave), macOS, or Windows devices, please choose an option:
              </p>
              <ol style={{ paddingLeft: '20px', margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Manually set an alarm in your phone's Clock app for <strong>{fallbackModal.alarmTime}</strong>.</li>
                <li>Download a Calendar reminder file (.ics) that automatically triggers an alert on your device.</li>
              </ol>
            </div>
            <div className="modal-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '24px' }}>
              <button
                type="button"
                className="modal-button primary"
                onClick={() => {
                  const { hour, minute } = getAlarmTime(fallbackModal.timeStr);
                  downloadIcsReminder(fallbackModal.timeStr, hour, minute);
                  setFallbackModal({ isOpen: false, timeStr: '', alarmTime: '' });
                }}
                style={{ width: '100%', height: '42px', borderRadius: '10px', backgroundColor: 'rgb(226, 126, 44)' }}
              >
                📅 Download Calendar Reminder (.ics)
              </button>
              <button
                type="button"
                className="modal-button secondary"
                onClick={() => setFallbackModal({ isOpen: false, timeStr: '', alarmTime: '' })}
                style={{ width: '100%', height: '42px', borderRadius: '10px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DutyDetailsPage;
