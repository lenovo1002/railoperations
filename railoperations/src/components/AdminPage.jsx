import React, { useEffect, useState } from 'react';
import DashboardCard from './DashboardCard';
import './DashboardGrid.css';

const API_BASE_URL = '';
const locationOptions = ['RHD', 'CVC', 'PIM', 'HVPCD', 'RAM'];
const tripLocationOptions = ['CVC_UP', 'CVC_DN', 'SJO_UP', 'KHK_DN', 'PIM_UP', 'SGT_DN', 'VNZ_UP' ,'SGT_UP'];

const initialTrip = {
  trainNo: '',
  tripFrom: '',
  tripTo: '',
  breakTime: '',
  tripStartTime: '',
  tripEndTime: '',
};

const initialFormState = {
  dutyNo: '',
  line: '',
  signOnTime: '',
  signOnLocation: '',
  signOffLocation: '',
  signOffTime: '',
  dutyHours: '',
  trainRunningHours: '',
  trips: [{ ...initialTrip }],
};

const adminCards = [
  { title: 'Add Duty', icon: '➕', colorClass: 'card-indigo' },
  { title: 'Upload Documents', icon: '📁', colorClass: 'card-teal' },
  { title: 'View Issues', icon: '⚠️', colorClass: 'card-violet' },
  { title: 'Announcements', icon: '📢', colorClass: 'card-pink' },
];

const AdminPage = ({ onHome, onLogout, onNotify, adminToken }) => {
  const [clockValue, setClockValue] = useState('');
  const [showDutyModal, setShowDutyModal] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // States for Document Upload
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

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
      setSubmitError('');
      setFormData(initialFormState);
      setShowDutyModal(true);
    } else if (title === 'Upload Documents') {
      setUploadError('');
      setSelectedFile(null);
      setShowUploadModal(true);
    }
  };

  const handleUploadSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a PDF file.');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    onNotify?.('Uploading document to the server...', 'info');

    try {
      const formDataObj = new FormData();
      formDataObj.append('file', selectedFile);

      const headers = {};
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/pdf/upload`, {
        method: 'POST',
        headers,
        body: formDataObj,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Upload failed.');
        throw new Error(errorText || 'Unable to upload document.');
      }

      onNotify?.('Document uploaded successfully.', 'success');
      setShowUploadModal(false);
      setSelectedFile(null);
    } catch (error) {
      const message = error.message || 'Unable to upload document to the server.';
      setUploadError(message);
      onNotify?.(message, 'error');
    } finally {
      setIsUploading(false);
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
    setSubmitError('');
    setFormData(initialFormState);
  };

  const closeModal = () => {
    setSubmitError('');
    setShowDutyModal(false);
    setFormData(initialFormState);
  };
  

 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        dutyNo: Number(formData.dutyNo),
        signOnLocation: formData.signOnLocation,
        signOnTime: formData.signOnTime,
        signOffLocation: formData.signOffLocation,
        signOffTime: formData.signOffTime,
        dutyHours: formData.dutyHours,
        trainRunningHours: formData.trainRunningHours,
        line: formData.line,
        tripTime: formData.trips.map((trip) => ({
          trainId: Number(trip.trainNo),
          breakTime: trip.breakTime,
          tripStartTime: trip.tripStartTime,
          tripEndTime: trip.tripEndTime,
          tripStartsFrom: trip.tripFrom,
          tripEndsAt: trip.tripTo,
        })),
      };

      onNotify?.('Submitting duty to the server...', 'info');
      

      const headers = { 'Content-Type': 'application/json' };
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
        
      }

      const response = await fetch(`${API_BASE_URL}/tripchart/addtrip`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Unable to save duty to the server.');
        
      }

      onNotify?.(`Duty ${payload.dutyNo} added successfully.`, 'success');
      closeModal();
    } catch (error) {
      const message = error.message || 'Unable to save duty to the server.';
      setSubmitError(message);
      onNotify?.(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell" style={{ '--bg-image': 'url("/images/metro-bg.png")' }}>
      <div className="top-bar">
        <div className="top-bar-left-sec" onClick={onHome} style={{ cursor: 'pointer' }}>
          <div className="top-bar-brand">
            <span className="brand-logo">🚇</span>
            <span className="brand-name">MetroDuty</span>
            <span className="brand-badge admin-badge">Admin</span>
          </div>
          <div className="top-bar-clock">
            <span className="clock-pulse"></span>
            <span className="clock-text">{clockValue}</span>
          </div>
        </div>

        <div className="top-bar-right">
          <button className="nav-button admin-button" type="button" onClick={onHome}>
            <span className="admin-icon">🏠</span>
            <span className="admin-label">Home</span>
          </button>
          <button className="nav-button logout-button" type="button" onClick={onLogout}>
            <span className="admin-icon">🚪</span>
            <span className="admin-label">Logout</span>
          </button>
        </div>
      </div>

      <div className="top-bar-ticker static-ticker" aria-hidden="true">
        <div className="ticker-text">
          <span className="ticker-item">🛠️ Welcome to the admin panel. Use this area to manage rail operations tools.</span>
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
                  <input name="dutyNo" value={formData.dutyNo} onChange={handleFieldChange} placeholder="e.101" />
                </label>
                <label className="modal-field duty-field">
                  <span>Line</span>
                  <select name="line" value={formData.line} onChange={handleFieldChange}>
                    <option value ="">Select line</option>
                    <option value="Line1">Line 1</option>
                    <option value="Line2">Line 2</option>
                  </select>
                </label>
                <label className="modal-field duty-field">
                  <span>Sign On Time</span>
                  <input name="signOnTime" type="time" value={formData.signOnTime} onChange={handleFieldChange} />
                </label>
                <label className="modal-field duty-field">
                  <span>Sign On Location</span>
                  <select name="signOnLocation" value={formData.signOnLocation} onChange={handleFieldChange}>
                    <option value="">Select location</option>
                    {locationOptions.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="modal-field duty-field">
                  <span>Sign Off Time</span>
                  <input name="signOffTime" type="time" value={formData.signOffTime} onChange={handleFieldChange} />
                </label>
                <label className="modal-field duty-field">
                  <span>Sign Off Location</span>
                  <select name="signOffLocation" value={formData.signOffLocation} onChange={handleFieldChange}>
                    <option value="">Select location</option>
                    {locationOptions.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="modal-field duty-field">
                  <span>Duty Hours</span>
                  <input name="dutyHours" type="time" value={formData.dutyHours} onChange={handleFieldChange} />
                </label>
                <label className="modal-field duty-field">
                  <span>Train Running Hours</span>
                  <input name="trainRunningHours" type="time" value={formData.trainRunningHours} onChange={handleFieldChange} />
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
                        <span>Break Time</span>
                        <input name="breakTime" value={trip.breakTime} type='time' onChange={(event) => handleTripChange(index, event)} placeholder="e.g. 00:45" />
                      </label>
                      <label className="modal-field duty-field">
                        <span>Trip From</span>
                        <select name="tripFrom" value={trip.tripFrom} onChange={(event) => handleTripChange(index, event)}>
                          <option value="">Select trip point</option>
                          {tripLocationOptions.map((location) => (
                            <option key={location} value={location}>
                              {location}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="modal-field duty-field">
                        <span>Trip To</span>
                        <select name="tripTo" value={trip.tripTo} onChange={(event) => handleTripChange(index, event)}>
                          <option value="">Select trip point</option>
                          {tripLocationOptions.map((location) => (
                            <option key={location} value={location}>
                              {location}
                            </option>
                          ))}
                        </select>
                      </label>
                      
                      <label className="modal-field duty-field">
                        <span>Trip Start Time</span>
                        <input name="tripStartTime" type="time" value={trip.tripStartTime} onChange={(event) => handleTripChange(index, event)} />
                      </label>
                      <label className="modal-field duty-field">
                        <span>Trip End Time</span>
                        <input name="tripEndTime" type="time" value={trip.tripEndTime} onChange={(event) => handleTripChange(index, event)} />
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="modal-actions duty-form-actions">
                <button type="button" className="modal-button secondary" onClick={resetForm}>
                  Reset
                </button>
                <button type="submit" className="modal-button primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>

              {submitError && <p role="alert" className="form-feedback error">{submitError}</p>}
            </form>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="modal-overlay" role="presentation" onClick={() => setShowUploadModal(false)}>
          <div className="modal-backdrop" aria-hidden="true" />
          <div className="admin-modal upload-form-modal" role="dialog" aria-modal="true" aria-labelledby="upload-modal-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2 id="upload-modal-title">Upload Document</h2>
              <p>Select a PDF file to upload.</p>
            </div>

            <form className="duty-form" onSubmit={handleUploadSubmit}>

              <div className="modal-field duty-field">
                <span>PDF Document</span>
                <div
                  className={`file-dropzone ${selectedFile ? 'has-file' : ''}`}
                  onClick={() => document.getElementById('pdf-file-input').click()}
                >
                  <span className="file-dropzone-icon">{selectedFile ? '✅' : '📄'}</span>
                  <span className="file-dropzone-text">
                    {selectedFile ? selectedFile.name : 'Click to select PDF file'}
                  </span>
                  <span className="file-dropzone-subtext">Only PDF files are allowed</span>
                </div>
                <input
                  id="pdf-file-input"
                  type="file"
                  accept=".pdf"
                  className="file-input-hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
              </div>

              {uploadError && <p role="alert" className="form-feedback error">{uploadError}</p>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-button secondary"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-button primary"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
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
