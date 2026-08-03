import { useState, useEffect } from 'react';
import { useSite } from '../contexts/SiteContext';
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
          <div className="age-gate-logo-icon">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 28C16 40 23.1634 46 32 46C40.8366 46 48 40 48 28H16Z" fill="url(#pestle-grad)" />
              <path d="M12 26C12 24.8954 12.8954 24 14 24H50C51.1046 24 52 24.8954 52 26V28H12V26Z" fill="url(#pestle-grad)" />
              <path d="M42 12L28 26" stroke="url(#pestle-grad)" strokeWidth="6" strokeLinecap="round" />
              <ellipse cx="43" cy="11" rx="4" ry="4" fill="url(#pestle-grad)" />
              <defs>
                <linearGradient id="pestle-grad" x1="12" y1="8" x2="52" y2="46" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#e07a24" />
                  <stop offset="1" stopColor="#ea580c" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="age-gate-brand-title">
            <span className="brand-red">Apex</span>
            <span className="brand-gold">Pepco</span>
          </h1>
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
