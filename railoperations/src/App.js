import { useEffect, useRef, useState } from 'react';
import './App.css';
import DashboardGrid from './components/DashboardGrid';

function App() {
  const [clockValue, setClockValue] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

    let containerWidth = 0;
    let textWidth = 0;
    let singleWidth = 0;
    let pos = 0;
    const speed = 80; // pixels per second
    let rafId = null;
    let lastTime = performance.now();
    let paused = false;

    function measure() {
      containerWidth = container.clientWidth;
      textWidth = text.scrollWidth;
      // prefer the width of a single .ticker-item if present (handles single or duplicated items)
      const firstItem = text.querySelector('.ticker-item');
      singleWidth = firstItem ? firstItem.scrollWidth : textWidth;
      if (!singleWidth) singleWidth = textWidth;
      // start just outside right edge so it appears beside controls
      pos = containerWidth;
      text.style.transform = `translateX(${pos}px)`;
    }

    function animate(now) {
      if (paused) {
        lastTime = now;
        rafId = requestAnimationFrame(animate);
        return;
      }
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      pos -= speed * dt;
      // when the entire item has moved past the left edge, reset to start at right edge
      if (pos <= -singleWidth) {
        pos = containerWidth;
      }
      text.style.transform = `translateX(${pos}px)`;
      rafId = requestAnimationFrame(animate);
    }

    function onEnter() { paused = true; }
    function onLeave() { paused = false; }

    measure();
    window.addEventListener('resize', measure);
    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', measure);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

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
          <DashboardGrid />
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
              <button type="button" className="modal-button primary">
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
