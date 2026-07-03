import { useEffect, useRef, useState } from 'react';
import './App.css';
import DashboardGrid from './components/DashboardGrid';
import AdminPage from './components/AdminPage';
import DutyDetailsPage from './components/DutyDetailsPage';

const API_BASE_URL = '';

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
  const [developmentModal, setDevelopmentModal] = useState({ isOpen: false, featureName: '' });
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerCountdown, setDisclaimerCountdown] = useState(10);

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


  // useEffect(() => {
  //   if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  //     setNotifications((prev) => [...prev, { id: Date.now(), message: 'For the best experience, please enable \'Desktop Site\' in your browser.', type: 'info' }]);
  //   }
  // },[]) ;


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
    let pos = 0;
    const speed = 40;
    let rafId = null;
    let lastTime = performance.now();

    const measure = () => {
      const container = tickerRef.current;
      const text = tickerTextRef.current;
      if (!container || !text) return;
      const textWidth = text.scrollWidth;
      const containerWidth = container.clientWidth;
      if (textWidth === 0 || containerWidth === 0) return;
      pos = containerWidth;
      text.style.transform = `translateX(${pos}px)`;
      text.style.width = `${textWidth}px`;
    };

    const animate = (now) => {
      const container = tickerRef.current;
      const text = tickerTextRef.current;
      if (!container || !text) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      let dt = (now - lastTime) / 1000;
      if (dt > 0.1) dt = 0.1; // Safeguard against tab sleep/wake
      lastTime = now;
      pos -= speed * dt;

      const textWidth = text.scrollWidth;
      if (pos <= -textWidth) {
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

  useEffect(() => {
    const acknowledged = window.localStorage.getItem('metroDutyAcknowledged');
    if (!acknowledged) {
      setShowDisclaimer(true);
    }
  }, []);

  useEffect(() => {
    if (!showDisclaimer) return;
    if (disclaimerCountdown <= 0) return;
    const timer = window.setTimeout(() => {
      setDisclaimerCountdown((prev) => prev - 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [showDisclaimer, disclaimerCountdown]);

  const handleAcknowledgeDisclaimer = () => {
    window.localStorage.setItem('metroDutyAcknowledged', 'true');
    setShowDisclaimer(false);
  };

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
    
    <div className="app-shell" style={{ '--bg-image': 'url("/images/metro-bg.png")' }}>
      
      <div className="top-bar">
        <div className="top-bar-left-sec">
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

      <div className="top-bar-ticker" aria-hidden="true" ref={tickerRef}>
        <div className="ticker-text" ref={tickerTextRef}>
          <span className="ticker-item">⚠️ Disclaimer: This is not an official Maha Metro website. It is an independently developed educational project. For official schedules and operations, visit the official Maha Metro website.</span>
        </div>
      </div>

      <div className="app-content">
        <main className="dashboard-page">
          <div className="dashboard-wrapper">
            <div className="dashboard-hero-section">
              <h1 className="hero-title">Metro<span className="brand-accent">Duty</span> Portal</h1>
              <p className="hero-subtitle">Independent Operations Dashboard & Trip Management System</p>
              <div className="hero-banner">
                <img src="/images/metro-bg.png" alt="Maha Metro Train" className="hero-banner-image" />
              </div>
            </div>
            <DashboardGrid onSelectCard={(title) => {
              if (title === 'Get Duty Details') {
                setActivePage('duty-details');
              } else if (title === 'Compare Duties' || title === 'External Links' || title === 'Raise Issue') {
                setDevelopmentModal({ isOpen: true, featureName: title });
              }
            }} />
          </div>
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Disclaimer</h3>
              <p>
                This website is an independent project developed for informational and educational purposes only. It is <strong>not</strong> an official website of Maha Metro and is <strong>not affiliated with, endorsed by, or associated with</strong> Maha Metro or its parent organizations.
              </p>
            </div>
            <div className="footer-section">
              <h3>Information</h3>
              <p>
                All trademarks, logos, and brand names are the property of their respective owners. The developer makes every effort to provide accurate information; however, this website should not be considered an official source.
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            © 2026 Raj Shantaram Parsharam. All rights reserved.
          </div>
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

      {developmentModal.isOpen && (
        <div className="modal-overlay" role="presentation" onClick={() => setDevelopmentModal({ isOpen: false, featureName: '' })}>
          <div className="modal-backdrop" aria-hidden="true" />
          <div className="admin-modal dev-modal" role="dialog" aria-modal="true" aria-labelledby="dev-modal-title" onClick={(event) => event.stopPropagation()}>
            <h2 id="dev-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgb(226, 126, 44)' }}>
              <span>🛠️</span> Under Development
            </h2>
            <p className="dev-modal-desc" style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', margin: '12px 0 20px' }}>
              The <strong>{developmentModal.featureName}</strong> feature is currently under development. Please contact the developer for deployment timelines.
            </p>
             <div className="dev-modal-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
              <a
                href={`https://wa.me/917798254480?text=Hi!%20I%20am%20inquiring%20about%20the%20timeline%20for%20the%20%22${encodeURIComponent(developmentModal.featureName)}%22%20feature%20on%20MetroDuty.`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
              >
                💬 Contact Developer on WhatsApp
              </a>
              <button
                type="button"
                className="modal-button secondary"
                onClick={() => setDevelopmentModal({ isOpen: false, featureName: '' })}
                style={{ width: '100%', height: '42px', borderRadius: '10px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showDisclaimer && (
        <div className="modal-overlay" role="presentation">
          <div className="modal-backdrop" aria-hidden="true" />
          <div className="admin-modal disclaimer-modal" role="dialog" aria-modal="true" aria-labelledby="disclaimer-modal-title" style={{ maxWidth: '600px' }}>
            <h2 id="disclaimer-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626' }}>
              <span>⚠️</span> Important Operational Notice
            </h2>
            
            <div className="disclaimer-content" style={{ color: '#334155', fontSize: '0.92rem', lineHeight: '1.6', margin: '16px 0 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p>
                Welcome to <strong>MetroDuty Portal</strong>. Please note that this is a newly built website and the operational data entered into the system may contain inaccuracies due to human entry errors.
              </p>
              <p style={{ fontWeight: '700', color: '#1e293b' }}>
                👉 Action Required: You must physically check and cross-verify your official trip charts and duty rosters. If you identify any discrepancies or issues, please immediately report them using the "Raise Issue" portal.
              </p>
              <p style={{ fontStyle: 'italic', color: '#64748b', borderLeft: '3px solid #cbd5e1', paddingLeft: '12px' }}>
                Disclaimer: The developer shall not be held responsible or liable for any missed trips, operational delays, or scheduling conflicts resulting from reliance on the information shown on this portal.
              </p>
            </div>

            <div className="modal-actions" style={{ justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                className={`modal-button primary ${disclaimerCountdown > 0 ? 'disabled' : ''}`}
                onClick={handleAcknowledgeDisclaimer}
                disabled={disclaimerCountdown > 0}
                style={{
                  minWidth: '160px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: disclaimerCountdown > 0 ? '#cbd5e1' : 'rgb(0, 36, 80)',
                  cursor: disclaimerCountdown > 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {disclaimerCountdown > 0 ? `Acknowledge (${disclaimerCountdown}s)` : 'Acknowledge & Proceed'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
