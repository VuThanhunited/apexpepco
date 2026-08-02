import { useState, useEffect } from 'react';
import { useSite } from '../contexts/SiteContext';
import './AgeGate.css';

const AGE_GATE_KEY = 'apex_age_verified';

const AgeGate = () => {
  const { settings } = useSite();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const verified = sessionStorage.getItem(AGE_GATE_KEY);
    if (!verified && settings?.ageGate?.isEnabled) setShow(true);
  }, [settings]);

  const handleEnter = () => {
    sessionStorage.setItem(AGE_GATE_KEY, 'true');
    setShow(false);
  };

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!show) return null;

  const ag = settings?.ageGate || {};

  return (
    <div className="age-gate-overlay">
      <div className="age-gate-modal">
        <div className="age-gate-icon">🔬</div>
        <h2>{ag.title || 'Age Verification Required'}</h2>
        <p>{ag.message || 'You must be 21 years or older to enter this site.'}</p>
        <div className="age-gate-confirm">
          <label className="checkbox-label">
            <input type="checkbox" id="age-confirm-checkbox" onChange={e => {
              document.getElementById('enter-btn').disabled = !e.target.checked;
            }} />
            <span>{ag.confirmText || 'I am 21+ and understand these products are for research use only'}</span>
          </label>
        </div>
        <div className="age-gate-buttons">
          <button id="enter-btn" className="btn-enter" disabled onClick={handleEnter}>
            {ag.enterButtonText || 'Enter Site'}
          </button>
          <button className="btn-exit" onClick={handleExit}>
            {ag.exitButtonText || 'Exit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeGate;
