import { useState, useEffect } from 'react';
import { useSite } from '../contexts/SiteContext';
import Logo from './Logo';
import './AgeGate.css';

const AGE_GATE_KEY = 'apex_age_verified';

const AgeGate = () => {
  const { settings } = useSite();
  const [show, setShow] = useState(false);
  const [checkAge, setCheckAge] = useState(false);
  const [checkTerms, setCheckTerms] = useState(false);

  useEffect(() => {
    const verified = sessionStorage.getItem(AGE_GATE_KEY);
    if (!verified && settings?.ageGate?.isEnabled !== false) {
      setShow(true);
    }
  }, [settings]);

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!checkAge || !checkTerms) return;
    sessionStorage.setItem(AGE_GATE_KEY, 'true');
    setShow(false);
  };

  const handleLeave = (e) => {
    e.preventDefault();
    window.location.href = 'https://www.google.com';
  };

  if (!show) return null;

  const ag = settings?.ageGate || {};
  const isFormValid = checkAge && checkTerms;

  return (
    <div className="age-gate-overlay">
      <div className="age-gate-modal">
        {/* Brand Header */}
        <div className="age-gate-brand">
          <Logo showTagline={false} className="age-gate-logo" />
          <p className="age-gate-tagline">
            {settings?.siteTagline || 'Free Yourself from Untested/Overpriced Peptides'}
          </p>
        </div>

        {/* Verification Title */}
        <h2 className="age-gate-title">{ag.title || 'Age verification'}</h2>
        <p className="age-gate-desc">
          {ag.message || 'You must be of legal age to enter. All products are for research use only.'}
        </p>

        {/* Checkboxes */}
        <div className="age-gate-checkboxes">
          <label className="age-checkbox-item">
            <input
              type="checkbox"
              checked={checkAge}
              onChange={(e) => setCheckAge(e.target.checked)}
            />
            <span className="checkbox-custom">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className="checkbox-text">
              I am {ag.minAge || 21} years of age or older
            </span>
          </label>

          <label className="age-checkbox-item">
            <input
              type="checkbox"
              checked={checkTerms}
              onChange={(e) => setCheckTerms(e.target.checked)}
            />
            <span className="checkbox-custom">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className="checkbox-text">
              I understand that all products are for research purposes only and not for human consumption
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="age-gate-actions">
          <button
            type="button"
            className="btn-age-confirm"
            disabled={!isFormValid}
            onClick={handleConfirm}
          >
            {ag.enterButtonText || 'Confirm'}
          </button>
          <button
            type="button"
            className="btn-age-leave"
            onClick={handleLeave}
          >
            {ag.exitButtonText || 'Leave'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeGate;
