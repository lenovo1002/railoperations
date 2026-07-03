import { useEffect, useRef, useState } from 'react';
import './App.css';
import DashboardGrid from './components/DashboardGrid';
import AdminPage from './components/AdminPage';
import DutyDetailsPage from './components/DutyDetailsPage';

const API_BASE_URL = 'http://localhost:8080';

function App() {
  const [clockValue, setClockValue] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminToken, setAdminToken] = useState(() => window.localStorage.getItem('adminToken') || '');
  const [tokenExpiresAt, setTokenExpiresAt] = useState(() => Number(window.localStorage.getItem('adminTokenExpiresAt') || 0));
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => !!window.localStorage.getItem('adminToken'));
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activePage, setActivePage] = useState('home');
  const [notifications, setNotifications] = useState([]);
  const [showConsent, setShowConsent] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentEnabled, setConsentEnabled] = useState(false);

  useEffect(() => {
    if (adminToken && tokenExpiresAt > Date.now()) {
      setIsAdminLoggedIn(true);
    } else if (adminToken) {
      setAdminToken('');
      setTokenExpiresAt(0);
      setIsAdminLoggedIn(false);
      setShowAdminModal(true);
      window.localStorage.removeItem('adminToken');
      window.localStorage.removeItem('adminTokenExpiresAt');
    }
  }, [adminToken, tokenExpiresAt]);

  useEffect(() => {
    const consentAccepted = window.localStorage.getItem('tripConsentAccepted') === 'true';
    if (!consentAccepted) {
      setShowConsent(true);
      setConsentChecked(false);
      setConsentEnabled(false);
    }
  }, []);

  useEffect(() => {
    if (!showConsent) return undefined;

    const timer = window.setTimeout(() => setConsentEnabled(true), 5000);
    return () => window.clearTimeout(timer);
  }, [showConsent]);

  const handleConsentChange = (event) => {
    setConsentChecked(event.target.checked);
  };

  const acceptConsent = () => {
    if (!consentEnabled || !consentChecked) return;

    window.localStorage.setItem('tripConsentAccepted', 'true');
    setShowConsent(false);
    notify('Consent has been acknowledged. Thank you.', 'success');
  };


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

  useEffect(() => {
    if (adminToken && tokenExpiresAt > Date.now()) {
      window.localStorage.setItem('adminToken', adminToken);
      window.localStorage.setItem('adminTokenExpiresAt', String(tokenExpiresAt));
    } else {
      window.localStorage.removeItem('adminToken');
      window.localStorage.removeItem('adminTokenExpiresAt');
    }
  }, [adminToken, tokenExpiresAt]);

  useEffect(() => {
    if (!adminToken) return undefined;

    const timeoutId = window.setTimeout(() => {
      setAdminToken('');
      setTokenExpiresAt(0);
      setIsAdminLoggedIn(false);
      setShowAdminModal(true);
      notify('Admin session expired. Please log in again.', 'error');
    }, Math.max(0, tokenExpiresAt - Date.now()));

    return () => window.clearTimeout(timeoutId);
  }, [adminToken, tokenExpiresAt]);

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

  const notify = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    }, 3000);
  };
  

  const handleAdminLogin = async () => {
    const trimmedLoginId = loginId.trim();
    const trimmedPassword = password.trim();

    if (!trimmedLoginId || !trimmedPassword) {
      setLoginError('Please enter both login ID and password.');
      return;
    }

    setIsAuthenticating(true);
    setLoginError('');

    try {
      const response = await fetch(`${API_BASE_URL}/admin/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmedLoginId, password: trimmedPassword }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.token) {
        throw new Error('Invalid admin credentials.');
      }

      setAdminToken(data.token);
      setTokenExpiresAt(Date.now() + 60 * 60 * 1000);
      setIsAdminLoggedIn(true);
      setActivePage("admin");
      setShowAdminModal(false);
      setLoginId('');
      setPassword('');
      notify('Admin authenticated successfully.', 'success');
    } catch (error) {
      const message = error.message || 'Authentication failed.';
      setLoginError(message);
      notify(message, 'error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setLoginError('');
    setPassword('');
  };

   const handleAdminClick = () => {
  if (adminToken && tokenExpiresAt > Date.now()) {
    setIsAdminLoggedIn(true);
    setActivePage("admin");
  } else {
    setShowAdminModal(true);
  }
};

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminToken('');
    setTokenExpiresAt(0);

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminTokenExpiresAt");
};

  if (isAdminLoggedIn) {
    return (
      <>
        <AdminPage
   onHome={() => {
    setIsAdminLoggedIn(false);
    setActivePage("home");
}}
    onLogout={handleLogout}
    adminToken={adminToken}
    onNotify={notify}
/>
        <div className="toast-stack" aria-live="polite" aria-atomic="true">
          {notifications.map((item) => (
            <div key={item.id} className={`toast-item toast-${item.type}`}>
              {item.message}
            </div>
          ))}
        </div>
      </>
    );
  }

  if (activePage === 'duty-details') {
    return (
      <>
        <DutyDetailsPage onBack={() => setActivePage('home')} onNotify={notify} />
        <div className="toast-stack" aria-live="polite" aria-atomic="true">
          {notifications.map((item) => (
            <div key={item.id} className={`toast-item toast-${item.type}`}>
              {item.message}
            </div>
          ))}
        </div>
      </>
    );
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
            onClick={() => {handleAdminClick();}}
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

      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {notifications.map((item) => (
          <div key={item.id} className={`toast-item toast-${item.type}`}>
            {item.message}
          </div>
        ))}
      </div>

      {showAdminModal && (
        <div className="modal-overlay" role="presentation" onClick={closeAdminModal}>
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
            {loginError && <p role="alert" className="form-feedback error">{loginError}</p>}
            <div className="modal-actions">
              <button type="button" className="modal-button secondary" onClick={closeAdminModal}>
                Cancel
              </button>
              <button
                type="button"
                className="modal-button primary"
                onClick={handleAdminLogin}
                disabled={isAuthenticating}
              >
                {isAuthenticating ? 'Authenticating...' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConsent && (
        <div className="modal-overlay" role="presentation">
          <div className="modal-backdrop" aria-hidden="true" />
          <div className="admin-modal consent-modal" role="dialog" aria-modal="true" aria-labelledby="consent-modal-title" onClick={(event) => event.stopPropagation()}>
            <h2 id="consent-modal-title">Important Notice</h2>
            <p className="consent-notice">
              Trip timing data is currently under development and may contain inaccuracies. Please verify all timings against the official physical trip chart before making operational decisions. If you identify any errors, please raise a issue on the same portal so the information can be corrected.
            </p>
            <label className="consent-checkbox-group">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={handleConsentChange}
                disabled={!consentEnabled}
              />
              I acknowledge that the trip time data is provisional and that I will confirm the official timings before relying on them.
            </label>
            <p className="consent-timer-note">
              {consentEnabled ? 'The acknowledgement checkbox is now enabled.' : 'The acknowledgement checkbox will be enabled in 5 seconds.'}
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-button primary"
                onClick={acceptConsent}
                disabled={!consentEnabled || !consentChecked}
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
