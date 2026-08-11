import { useState } from 'react';
import './ContactWidget.css';

const ContactWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="contact-widget">
      {open && (
        <div className="contact-popup">
          <div className="contact-popup-header">
            <span>Contact Us</span>
            <button className="contact-popup-close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="contact-popup-body">
            <p>Have a question? Reach out to us directly:</p>
            <a
              href="mailto:support@apexpepco.com"
              className="contact-link contact-link-email"
            >
              📧 support@apexpepco.com
            </a>
            <a
              href="https://t.me/apexpepco"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link contact-link-telegram"
            >
              ✈️ Telegram
            </a>
            <a
              href="sms:+1234567890"
              className="contact-link contact-link-sms"
            >
              💬 Text / SMS
            </a>
          </div>
        </div>
      )}
      <button
        className="contact-fab"
        id="contact-widget-btn"
        onClick={() => setOpen(o => !o)}
        aria-label="Contact Us"
        title="Contact Us"
      >
        <span className="contact-fab-icon">{open ? '✕' : '💬'}</span>
        {!open && <span className="contact-fab-label">Contact Us</span>}
      </button>
    </div>
  );
};

export default ContactWidget;
