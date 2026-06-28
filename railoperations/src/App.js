import { useEffect, useRef, useState } from 'react';
import './App.css';
import DashboardGrid from './components/DashboardGrid';
import AdminPage from './components/AdminPage';
import DutyDetailsPage from './components/DutyDetailsPage';

function App() {
  const [clockValue, setClockValue] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('home');

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

  // Ticker animation: start beside the right controls (bell/admin)
  const tickerRef = useRef(null);
  const tickerTextRef = useRef(null);

  useEffect(() => {
    const container = tickerRef.current;
    const text = tickerTextRef.current;
    if (!container || !text) return;

    let pos = 0;
    const speed = 70;
    let rafId = null;
    let lastTime = performance.now();

    const measure = () => {
      const textWidth = text.scrollWidth;
      const containerWidth = container.clientWidth;
      pos = containerWidth;
      text.style.transform = `translateX(${pos}px)`;
      text.style.width = `${textWidth}px`;
    };

    const animate = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      pos -= speed * dt;

      if (pos <= -text.scrollWidth) {
        pos = container.clientWidth;
      }

      text.style.transform = `translateX(${pos}px)`;
      rafId = requestAnimationFrame(animate);
    };

    measure();
    window.addEventListener('resize', measure);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', measure);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (isAdminLoggedIn) {
    return <AdminPage onLogout={() => setIsAdminLoggedIn(false)} />;
  }

  if (activePage === 'duty-details') {
    return <DutyDetailsPage onBack={() => setActivePage('home')} />;
  }

  return (
    <div className="app-shell">
      <div className="top-bar">
        <div className="top-bar-left">{clockValue}</div>

        <div className="top-bar-ticker" aria-hidden="true" ref={tickerRef}>
          <div className="ticker-text" ref={tickerTextRef}>
            <span className="ticker-item">Disclaimer: This is not an official Maha Metro website. It is an independently developed project and is not affiliated with, endorsed by, or associated with Maha Metro. For official information, please visit the official Maha Metro website.</span>
          </div>
        </div>

        <div className="top-bar-right">
          <button className="nav-button nav-button-icon" aria-label="Notifications">
            🔔
          </button>
          <button
            className="nav-button admin-button"
            aria-label="Admin Login"
            onClick={() => setShowAdminModal(true)}
          >
            <span className="admin-icon">👤</span>
            <span className="admin-label">Admin Login</span>
          </button>
        </div>
      </div>

      <div className="app-content">
        <main className="dashboard-page">
          <DashboardGrid onSelectCard={(title) => {
            if (title === 'Get Duty Details') {
              setActivePage('duty-details');
            }
          }} />
        </main>

        <footer className="app-footer">
          <strong>Disclaimer</strong><br />
          This website is an independent project developed for informational and educational purposes only. It is <strong>not</strong> an official website of Maha Metro and is <strong>not affiliated with, endorsed by, or associated with</strong> Maha Metro or its parent organizations.<br /><br />
          All trademarks, logos, and brand names are the property of their respective owners and are used only for identification and informational purposes. The developer makes every effort to provide accurate information; however, this website should not be considered an official source. For official announcements, schedules, fares, and other services, please refer to the official Maha Metro website.<br /><br />
          © 2026 Raj Shantaram Parsharam. All rights reserved.
        </footer>
      </div>

      {showAdminModal && (
        <div className="modal-overlay" role="presentation" onClick={() => setShowAdminModal(false)}>
          <div className="modal-backdrop" aria-hidden="true" />
          <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" onClick={(event) => event.stopPropagation()}>
            <h2 id="admin-modal-title">Admin Login</h2>
            <label className="modal-field" htmlFor="admin-login-id">
              <span>Login ID</span>
              <input id="admin-login-id" type="text" value={loginId} onChange={(event) => setLoginId(event.target.value)} />
            </label>
            <label className="modal-field" htmlFor="admin-password">
              <span>Password</span>
              <div className="password-input-wrapper">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </label>
            <div className="modal-actions">
              <button type="button" className="modal-button secondary" onClick={() => setShowAdminModal(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="modal-button primary"
                onClick={() => {
                  setIsAdminLoggedIn(true);
                  setShowAdminModal(false);
                }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
