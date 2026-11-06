import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const companyAddress = '65, Nandhavanam St, LIC Colony, Ayyappa Nagar, K K Nagar, Tiruchirappalli, Tamil Nadu 620021';
  const mapUrl = 'https://www.google.com/maps/place/65,+Nandhavanam+St,+LIC+Colony,+Ayyappa+Nagar,+K+K+Nagar,+Tiruchirappalli,+Tamil+Nadu+620021/@10.7626033,78.6811387,17z/data=!3m1!4b1!4m6!3m5!1s0x3baa8ac840508ddb:0xb50ce4460516bd18!8m2!3d10.7626033!4d78.6811387!16s%2Fg%2F11hp15wm5t?entry=ttu&g_ep=EgoyMDI2MTEwMy4wIKXMDSoASAFQAw%3D%3D';

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
            📍 {companyAddress}
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
