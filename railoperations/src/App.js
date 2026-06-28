import { useEffect, useRef, useState } from 'react';
import './App.css';
import DashboardGrid from './components/DashboardGrid';

function App() {
  const [clockValue, setClockValue] = useState('');

  useEffect(() => {
    const formatClock = () => {
      const now = new Date();
      const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
      const datePart = now.toLocaleDateString('en-US', options);
      const timePart = [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map((value) => String(value).padStart(2, '0'))
        .join('-');
      setClockValue(`${datePart} / ${timePart}`);
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
            <span className="ticker-item">this site is solely developed by RSP. It has no rights from offical MAHA METRO</span>
          </div>
        </div>

        <div className="top-bar-right">
          <button className="nav-button nav-button-icon" aria-label="Notifications">
            🔔
          </button>
          <button className="nav-button admin-button" aria-label="Admin Login">
            <span className="admin-icon">👤</span>
            <span className="admin-label">Admin Login</span>
          </button>
        </div>
      </div>

      <div className="app-content">
        <main className="dashboard-page">
          <DashboardGrid />
        </main>

        <footer className="app-footer">© Maha Metro 2026, All rights reserved.</footer>
      </div>
    </div>
  );
}

export default App;
