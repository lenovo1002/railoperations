import React, { useEffect, useState } from 'react';
import DashboardCard from './DashboardCard';
import './DashboardGrid.css';

const initialTrip = {
  trainNo: '',
  tripFrom: '',
  tripTo: '',
  breakTime: '',
};

const initialFormState = {
  dutyNo: '',
  signOnTime: '',
  signOnLocation: '',
  signOffLocation: '',
  signOffTime: '',
  trips: [{ ...initialTrip }],
};

const adminCards = [
  { title: 'Add Duty', icon: '➕', colorClass: 'card-indigo' },
  { title: 'Upload Daily Roster', icon: '⬆️', colorClass: 'card-teal' },
  { title: 'View Issues', icon: '⚠️', colorClass: 'card-violet' },
  { title: 'Announcements', icon: '📢', colorClass: 'card-pink' },
];

const AdminPage = ({ onLogout }) => {
  const [clockValue, setClockValue] = useState('');
  const [showDutyModal, setShowDutyModal] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

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

  const handleCardClick = (title) => {
    if (title === 'Add Duty') {
      setFormData(initialFormState);
      setShowDutyModal(true);
    }
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTripChange = (index, event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      trips: prev.trips.map((trip, tripIndex) =>
        tripIndex === index ? { ...trip, [name]: value } : trip
      ),
    }));
  };

  const addTripEntry = () => {
    setFormData((prev) => ({ ...prev, trips: [...prev.trips, { ...initialTrip }] }));
  };

  const removeTripEntry = (index) => {
    setFormData((prev) => ({
      ...prev,
      trips: prev.trips.filter((_, tripIndex) => tripIndex !== index),
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const closeModal = () => {
    setShowDutyModal(false);
    setFormData(initialFormState);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    closeModal();
  };

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
                onClick={() => handleCardClick(card.title)}
              />
            ))}
          </section>
        </main>

        <footer className="app-footer">
          Admin controls are available for authorized users only.
        </footer>
      </div>

      {showDutyModal && (
        <div className="modal-overlay" role="presentation" onClick={closeModal}>
          <div className="modal-backdrop" aria-hidden="true" />
          <div className="admin-modal duty-form-modal" role="dialog" aria-modal="true" aria-labelledby="add-duty-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2 id="add-duty-title">Add Duty</h2>
              <p>Enter duty details and add one or more trip entries.</p>
            </div>

            <form className="duty-form" onSubmit={handleSubmit}>
              <div className="duty-form-grid">
                <label className="modal-field duty-field">
                  <span>Duty No</span>
                  <input name="dutyNo" value={formData.dutyNo} onChange={handleFieldChange} placeholder="e.g. PDC-101" />
                </label>
                <label className="modal-field duty-field">
                  <span>Sign On Time</span>
                  <input name="signOnTime" type="time" value={formData.signOnTime} onChange={handleFieldChange} />
                </label>
                <label className="modal-field duty-field">
                  <span>Sign On Location</span>
                  <input name="signOnLocation" value={formData.signOnLocation} onChange={handleFieldChange} placeholder="e.g. RHD" />
                </label>
                <label className="modal-field duty-field">
                  <span>Sign Off Location</span>
                  <input name="signOffLocation" value={formData.signOffLocation} onChange={handleFieldChange} placeholder="e.g. DHO" />
                </label>
                <label className="modal-field duty-field">
                  <span>Sign Off Time</span>
                  <input name="signOffTime" type="time" value={formData.signOffTime} onChange={handleFieldChange} />
                </label>
              </div>

              <div className="trip-section">
                <div className="trip-section-header">
                  <h3>Trip Entries</h3>
                  <button type="button" className="add-trip-button" onClick={addTripEntry}>
                    + Add Trip
                  </button>
                </div>

                {formData.trips.map((trip, index) => (
                  <div className="trip-entry" key={`${trip.trainNo || 'trip'}-${index}`}>
                    <div className="trip-entry-header">
                      <span>Trip {index + 1}</span>
                      {formData.trips.length > 1 && (
                        <button type="button" className="remove-trip-button" onClick={() => removeTripEntry(index)}>
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="duty-form-grid trip-grid">
                      <label className="modal-field duty-field">
                        <span>Train No</span>
                        <input name="trainNo" value={trip.trainNo} onChange={(event) => handleTripChange(index, event)} placeholder="e.g. 101" />
                      </label>
                      <label className="modal-field duty-field">
                        <span>Trip From</span>
                        <input name="tripFrom" value={trip.tripFrom} onChange={(event) => handleTripChange(index, event)} placeholder="e.g. RHD" />
                      </label>
                      <label className="modal-field duty-field">
                        <span>Trip To</span>
                        <input name="tripTo" value={trip.tripTo} onChange={(event) => handleTripChange(index, event)} placeholder="e.g. DHO" />
                      </label>
                      <label className="modal-field duty-field">
                        <span>Break Time</span>
                        <input name="breakTime" value={trip.breakTime} onChange={(event) => handleTripChange(index, event)} placeholder="e.g. 00:45" />
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="modal-actions duty-form-actions">
                <button type="button" className="modal-button secondary" onClick={resetForm}>
                  Reset
                </button>
                <button type="submit" className="modal-button primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
