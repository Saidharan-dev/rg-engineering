import React, { useState } from 'react';
import api from '../api/axios';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', project_type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');
  const companyAddress = 'No. 64, Nandavanam Street, Zakir Hussain Road, LIC Colony, Trichy 620021, Tamil Nadu';
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(companyAddress)}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(companyAddress)}&output=embed`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/contact', form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', project_type: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ paddingTop: 72 }}>
      <section className="contact-page">
        <div className="contact-grid-bg" />
        <div className="contact-inner">
          {/* Info */}
          <div className="contact-info fade-in">
            <div className="section-label">Get In Touch</div>
            <h1 className="section-title">Start Your<br /><em>Project</em> With Us</h1>
            <div className="divider" />
            <p className="section-desc">Ready to discuss your structural engineering project? Our team will respond within 24 hours with expert guidance tailored to your requirements.</p>

            <div className="contact-details">
              {[
                { icon: '📍', label: 'Address', value: 'No. 64, Nandavanam Street, Zakir Hussain Road, LIC Colony, Trichy – 620021, Tamil Nadu' },
                { icon: '📞', label: 'Phone', value: '0431-4024691  |  +91-9842872691' },
                { icon: '✉️', label: 'Email', value: 'gstruds@yahoo.com\nganesan_struct@rediffmail.com' },
              ].map((item) => (
                <div className="contact-item" key={item.label}>
                  <div className="contact-icon">{item.icon}</div>
                  <div>
                    <div className="contact-item-label">{item.label}</div>
                    <div className="contact-item-value" style={{ whiteSpace: 'pre-line' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-wrap fade-in">
            <div className="contact-form">
              <div className="form-title">Send an Enquiry</div>
              <div className="form-subtitle">We'll get back to you within 24 hours.</div>

              {success ? (
                <div className="success-box">
                  <div style={{ fontSize: 40 }}>✅</div>
                  <h3>Thank you!</h3>
                  <p>Your enquiry has been received. We'll be in touch shortly.</p>
                  <button className="pub-btn-primary" onClick={() => setSuccess(false)} style={{ marginTop: 16 }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && <div className="pub-alert-error">{error}</div>}
                  <div className="pub-form-row">
                    <div className="pub-form-group">
                      <label>Your Name *</label>
                      <input type="text" value={form.name} placeholder="Full name"
                        onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="pub-form-group">
                      <label>Phone Number</label>
                      <input type="tel" value={form.phone} placeholder="+91 XXXXX XXXXX"
                        onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                  </div>
                  <div className="pub-form-group">
                    <label>Email Address *</label>
                    <input type="email" value={form.email} placeholder="your@email.com"
                      onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="pub-form-group">
                    <label>Project Type</label>
                    <select value={form.project_type} onChange={(e) => setForm({ ...form, project_type: e.target.value })}>
                      <option value="">Select a category...</option>
                      <option>Residential Apartment</option>
                      <option>Individual Bungalow</option>
                      <option>Commercial Building</option>
                      <option>Institutional / Educational</option>
                      <option>Industrial / Factory</option>
                      <option>Religious Structure</option>
                      <option>Government / Public Works</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="pub-form-group">
                    <label>Project Description *</label>
                    <textarea value={form.message} rows={5}
                      placeholder="Briefly describe your project — location, scale, and specific requirements..."
                      onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                  </div>
                  <button type="submit" className="pub-btn-primary pub-btn-full" disabled={loading}>
                    {loading ? 'Sending...' : 'Submit Enquiry →'}
                  </button>
                </form>
              )}
            </div>

            <a className="location-map" href={mapUrl} target="_blank" rel="noreferrer" aria-label="Open our office location in Google Maps">
              <iframe
                title="RG Structural Engineers office location"
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                tabIndex="-1"
              />
              <span className="location-map-link">Open in Google Maps <span aria-hidden="true">↗</span></span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
