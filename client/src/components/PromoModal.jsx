import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PromoModal.css';

const PROMO_KEY = 'astro_promo_dismissed';

const PromoModal = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(PROMO_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(PROMO_KEY, 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="promo-modal-overlay" onClick={e => e.target === e.currentTarget && handleClose()}>
      <div className="promo-modal-card">
        <button className="promo-close-btn" onClick={handleClose}>✕</button>

        <div className="promo-tag">LIMITED OFFER</div>
        <h2>Get Your First Peptide Vial Free</h2>
        <p>Create a free account, verify your number, and claim any peptide of your choice — completely on us. No strings attached.</p>

        <div className="promo-actions">
          <Link to="/register" className="btn-claim-free" onClick={handleClose} id="claim-free-vial-btn">
            CLAIM MY FREE VIAL
          </Link>
          <button className="btn-no-thanks" onClick={handleClose}>
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoModal;
