import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const companyAddress = 'No. 64, Nandavanam Street, Zakir Hussain Road, LIC Colony, Trichy 620021, Tamil Nadu';
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(companyAddress)}`;

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">RG</div>
          <div>
            <div className="footer-name">RG Engineering Excellence Pvt. Ltd.</div>
            <div className="footer-tagline">Structural Consultancy · Est. 1990</div>
          </div>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-contact">
          <a href={mapUrl} target="_blank" rel="noreferrer" aria-label="Open our office address in Google Maps">
            📍 No. 64, Nandavanam Street, LIC Colony, Trichy – 620021
          </a>
          <div>📞 +91-9842872691</div>
          <div>✉ gstruds@yahoo.com</div>
          <a className="footer-map-link" href={mapUrl} target="_blank" rel="noreferrer">
            View on Google Maps <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        © 2024 RG Engineering Excellence Pvt. Ltd. All rights reserved.
      </div>
    </footer>
  );
}
