import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useSite } from '../contexts/SiteContext';
import './Contact.css';

const Contact = () => {
  const { settings } = useSite();
  const cp = settings?.contactPage || {};

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/contact', form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Inline style helpers pulled from contactPage colors
  const pageStyle    = { backgroundColor: cp.pageBg || '#06070a' };
  const cardStyle    = { backgroundColor: cp.cardBg || '#0d1117', borderColor: cp.cardBorderColor || '#1e2533' };
  const formStyle    = { backgroundColor: cp.formBg || '#0d1117', borderColor: cp.formBorderColor || '#1e2533' };
  const inputStyle   = { backgroundColor: cp.inputBg || '#06070a', borderColor: cp.inputBorderColor || '#2a2e3b', color: cp.inputTextColor || '#ededed' };
  const submitStyle  = { backgroundColor: cp.submitBtnBg || '#c4222f', color: cp.submitBtnText2 || '#ffffff' };
  const ctaSectionStyle = { backgroundColor: cp.ctaBg || '#0b0d14' };

  return (
    <div className="contact-page" style={pageStyle}>
      <div className="contact-container">

        {/* Hero */}
        <section className="contact-hero">
          <span className="contact-eyebrow" style={{ color: cp.eyebrowColor || '#c4222f' }}>
            {cp.eyebrow || 'GET IN TOUCH'}
          </span>
          <h1 className="contact-title" style={{ color: cp.titleColor || '#ffffff' }}>
            {cp.title || 'Contact Us'}
          </h1>
          <p className="contact-subtitle" style={{ color: cp.subtitleColor || '#94a3b8' }}>
            {cp.subtitle || 'Have a question about our compounds, orders, or research needs? Our team is here to help.'}
          </p>
        </section>

        <div className="contact-main-grid">

          {/* Left: Contact Info Cards */}
          <div className="contact-info-col">

            {/* Email */}
            <div className="contact-info-card" style={cardStyle}>
              <div className="contact-info-icon">📧</div>
              <div className="contact-info-body">
                <h3 style={{ color: cp.cardTitleColor || '#ffffff' }}>
                  {cp.emailTitle || 'Email Us'}
                </h3>
                <p style={{ color: cp.cardTextColor || '#94a3b8' }}>
                  {cp.emailDesc || 'For general inquiries and order support'}
                </p>
                <a
                  href={`mailto:${cp.emailAddress || 'support@apexpepco.com'}`}
                  className="contact-info-link"
                  style={{ color: cp.linkColor || '#c4222f' }}
                >
                  {cp.emailAddress || 'support@apexpepco.com'}
                </a>
              </div>
            </div>

            {/* SMS */}
            <div className="contact-info-card" style={cardStyle}>
              <div className="contact-info-icon">💬</div>
              <div className="contact-info-body">
                <h3 style={{ color: cp.cardTitleColor || '#ffffff' }}>
                  {cp.smsTitle || 'Text / SMS'}
                </h3>
                <p style={{ color: cp.cardTextColor || '#94a3b8' }}>
                  {cp.smsDesc || 'Quick questions — we respond within hours'}
                </p>
                <a
                  href={cp.smsHref || 'sms:+12345678900'}
                  className="contact-info-link"
                  style={{ color: cp.linkColor || '#c4222f' }}
                >
                  {cp.smsNumber || '+1 (234) 567-8900'}
                </a>
              </div>
            </div>

            {/* Telegram */}
            <div className="contact-info-card" style={cardStyle}>
              <div className="contact-info-icon">✈️</div>
              <div className="contact-info-body">
                <h3 style={{ color: cp.cardTitleColor || '#ffffff' }}>
                  {cp.telegramTitle || 'Telegram'}
                </h3>
                <p style={{ color: cp.cardTextColor || '#94a3b8' }}>
                  {cp.telegramDesc || 'Fast support via Telegram messenger'}
                </p>
                <a
                  href={cp.telegramHref || 'https://t.me/apexpepco'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-info-link"
                  style={{ color: cp.linkColor || '#c4222f' }}
                >
                  {cp.telegramHandle || '@apexpepco'}
                </a>
              </div>
            </div>

            {/* Response Time */}
            <div className="contact-info-card contact-hours-card" style={cardStyle}>
              <div className="contact-info-icon">🕐</div>
              <div className="contact-info-body">
                <h3 style={{ color: cp.cardTitleColor || '#ffffff' }}>
                  {cp.responseTitle || 'Response Time'}
                </h3>
                <p style={{ color: cp.cardTextColor || '#94a3b8' }}>
                  {cp.responseText || 'We typically respond within 1–4 business hours Mon–Fri.'}
                </p>
                <p className="contact-note" style={{ color: cp.cardTextColor || '#94a3b8' }}>
                  {cp.responseNote || 'Weekend responses may be delayed.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="contact-form-col">
            {submitted ? (
              <div className="contact-success-card" style={formStyle}>
                <div className="contact-success-icon">✓</div>
                <h2 style={{ color: cp.formTitleColor || '#ffffff' }}>
                  {cp.successTitle || 'Message Sent!'}
                </h2>
                <p style={{ color: cp.cardTextColor || '#94a3b8' }}>
                  {cp.successText || "Thank you for reaching out. We'll get back to you within 1–4 business hours."}
                </p>
                <button
                  className="btn-contact-reset"
                  style={submitStyle}
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                >
                  {cp.resetBtnText || 'Send Another Message'}
                </button>
                <Link to="/shop" className="btn-contact-shop">Browse Products</Link>
              </div>
            ) : (
              <form className="contact-form" style={formStyle} onSubmit={handleSubmit} id="contact-form">
                <h2 className="contact-form-title" style={{ color: cp.formTitleColor || '#ffffff' }}>
                  {cp.formTitle || 'Send a Message'}
                </h2>
                <p className="contact-form-desc" style={{ color: cp.cardTextColor || '#94a3b8' }}>
                  {cp.formDesc || "Fill out the form below and we'll respond as soon as possible."}
                </p>

                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="contact-name" style={{ color: cp.cardTextColor || '#94a3b8' }}>Full Name *</label>
                    <input
                      id="contact-name"
                      required
                      placeholder="John Doe"
                      value={form.name}
                      onChange={set('name')}
                      style={inputStyle}
                    />
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="contact-email" style={{ color: cp.cardTextColor || '#94a3b8' }}>Email Address *</label>
                    <input
                      id="contact-email"
                      required
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={set('email')}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="contact-subject" style={{ color: cp.cardTextColor || '#94a3b8' }}>Subject *</label>
                  <select
                    id="contact-subject"
                    required
                    value={form.subject}
                    onChange={set('subject')}
                    style={inputStyle}
                  >
                    <option value="">— Select a topic —</option>
                    <option value="order">Order Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="shipping">Shipping &amp; Delivery</option>
                    <option value="wholesale">Wholesale / Bulk Orders</option>
                    <option value="payment">Payment Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="contact-message" style={{ color: cp.cardTextColor || '#94a3b8' }}>Message *</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={6}
                    placeholder="Describe your question or concern in detail..."
                    value={form.message}
                    onChange={set('message')}
                    style={inputStyle}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-contact-submit"
                  id="contact-submit-btn"
                  disabled={loading}
                  style={submitStyle}
                >
                  {loading ? 'Sending...' : (cp.submitBtnText || 'Send Message →')}
                </button>

                {error && (
                  <div className="contact-form-error">{error}</div>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <section className="contact-cta" style={ctaSectionStyle}>
          <h2 style={{ color: cp.ctaTitleColor || '#ffffff' }}>
            {cp.ctaTitle || 'Looking for something specific?'}
          </h2>
          <p style={{ color: cp.ctaTextColor || '#94a3b8' }}>
            {cp.ctaText || 'Browse our full product catalog or check out our Shipping & Policy information.'}
          </p>
          <div className="contact-cta-buttons">
            <Link to="/shop" className="btn-contact-primary" style={submitStyle}>
              {cp.ctaBrowseText || 'Browse Catalog'}
            </Link>
            <Link to="/policies" className="btn-contact-outline">
              {cp.ctaShippingText || 'Shipping Info'}
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Contact;
