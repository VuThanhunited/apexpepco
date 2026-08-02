import { useState, useEffect } from 'react';
import { useSite } from '../contexts/SiteContext';
import './AgeGate.css';

const AGE_GATE_KEY = 'apex_age_verified';

const AgeGate = () => {
  const { settings } = useSite();
  const [show, setShow] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const verified = sessionStorage.getItem(AGE_GATE_KEY);
    if (!verified && settings?.ageGate?.isEnabled !== false) {
      setShow(true);
    }
  }, [settings]);

  const handleEnter = (e) => {
    e.preventDefault();
    if (!confirmed) return;
    sessionStorage.setItem(AGE_GATE_KEY, 'true');
    setShow(false);
  };

  const handleExit = (e) => {
    e.preventDefault();
    window.location.href = 'https://www.google.com';
  };

  if (!show) return null;

  const ag = settings?.ageGate || {};

  return (
    <div className="age-gate-overlay">
      <div className="age-gate-modal">
        <div className="age-gate-icon">🔬</div>
        <h2>{ag.title || 'AGE VERIFICATION REQUIRED'}</h2>
        <p>{ag.message || 'You must be 21 years or older to enter this site. This site sells research compounds for laboratory use only.'}</p>
        
        <div className="age-gate-confirm">
          <label className="checkbox-label" htmlFor="age-confirm-checkbox">
            <input
              type="checkbox"
              id="age-confirm-checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            <span>{ag.confirmText || 'I am 21+ and understand these products are for research use only'}</span>
          </label>
        </div>

        <div className="age-gate-buttons">
          <button
            id="enter-btn"
            type="button"
            className="btn-enter"
            disabled={!confirmed}
            onClick={handleEnter}
          >
            {ag.enterButtonText || 'Enter Site'}
          </button>
          <button type="button" className="btn-exit" onClick={handleExit}>
            {ag.exitButtonText || 'Exit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeGate;
