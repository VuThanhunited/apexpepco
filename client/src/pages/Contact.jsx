import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submit — replace with real API call if needed
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="contact-page">
      <div className="contact-container">

        {/* Hero */}
        <section className="contact-hero">
          <span className="contact-eyebrow">GET IN TOUCH</span>
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">
            Have a question about our compounds, orders, or research needs? Our team is here to help.
          </p>
        </section>

        <div className="contact-main-grid">

          {/* Left: Contact Info Cards */}
          <div className="contact-info-col">
            <div className="contact-info-card">
              <div className="contact-info-icon">📧</div>
              <div className="contact-info-body">
                <h3>Email Us</h3>
                <p>For general inquiries and order support</p>
                <a href="mailto:support@apexpepco.com" className="contact-info-link">
                  support@apexpepco.com
                </a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">💬</div>
              <div className="contact-info-body">
                <h3>Text / SMS</h3>
                <p>Quick questions — we respond within hours</p>
                <a href="sms:+1234567890" className="contact-info-link">
                  +1 (234) 567-8900
                </a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">✈️</div>
              <div className="contact-info-body">
                <h3>Telegram</h3>
                <p>Fast support via Telegram messenger</p>
                <a
                  href="https://t.me/apexpepco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-info-link"
                >
                  @apexpepco
                </a>
              </div>
            </div>

            <div className="contact-info-card contact-hours-card">
              <div className="contact-info-icon">🕐</div>
              <div className="contact-info-body">
                <h3>Response Time</h3>
                <p>We typically respond within <strong>1–4 business hours</strong> Mon–Fri.</p>
                <p className="contact-note">Weekend responses may be delayed.</p>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="contact-form-col">
            {submitted ? (
              <div className="contact-success-card">
                <div className="contact-success-icon">✓</div>
                <h2>Message Sent!</h2>
                <p>Thank you for reaching out. We'll get back to you within 1–4 business hours.</p>
                <button
                  className="btn-contact-reset"
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                >
                  Send Another Message
                </button>
                <Link to="/shop" className="btn-contact-shop">Browse Products</Link>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} id="contact-form">
                <h2 className="contact-form-title">Send a Message</h2>
                <p className="contact-form-desc">Fill out the form below and we'll respond as soon as possible.</p>

                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="contact-name">Full Name *</label>
                    <input
                      id="contact-name"
                      required
                      placeholder="John Doe"
                      value={form.name}
                      onChange={set('name')}
                    />
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="contact-email">Email Address *</label>
                    <input
                      id="contact-email"
                      required
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={set('email')}
                    />
                  </div>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="contact-subject">Subject *</label>
                  <select id="contact-subject" required value={form.subject} onChange={set('subject')}>
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
                  <label htmlFor="contact-message">Message *</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={6}
                    placeholder="Describe your question or concern in detail..."
                    value={form.message}
                    onChange={set('message')}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-contact-submit"
                  id="contact-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <section className="contact-cta">
          <h2>Looking for something specific?</h2>
          <p>Browse our full product catalog or check out our Shipping & Policy information.</p>
          <div className="contact-cta-buttons">
            <Link to="/shop" className="btn-contact-primary">Browse Catalog</Link>
            <Link to="/policies" className="btn-contact-outline">Shipping Info</Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Contact;
