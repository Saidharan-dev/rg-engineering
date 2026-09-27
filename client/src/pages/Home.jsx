import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import portrait from '../../removed bg coat ganesan.png';

const SERVER = 'http://localhost:3001';

const categoryEmoji = {
  institutional: '🏛️', residential: '🏢', commercial: '🏬',
  religious: '🙏', bungalow: '🏡', industrial: '🏭',
};

const services = [
  { num: '01', title: 'Structural Analysis & Design', desc: 'Advanced analysis of multi-storey, high-rise, industrial and residential structures using STAAD Pro.' },
  { num: '02', title: 'Seismic & Wind Engineering', desc: 'Design accounting for earthquake and wind forces, ensuring full compliance with national safety standards.' },
  { num: '03', title: 'Drawing & Documentation', desc: 'Precise structural drawings and documentation for all project types.' },
  { num: '04', title: 'Site Supervision', desc: 'On-site structural supervision ensuring construction quality matches design intent.' },
  { num: '05', title: 'Institutional & Industrial', desc: 'Specialized solutions for colleges, hospitals, factories, godowns and warehouses.' },
  { num: '06', title: 'Government Consultancy', desc: 'Trusted by Govt. of Tamil Nadu, NIT, and Airport Authority of India.' },
];

const clients = [
  'Harini & Nandalal, Chennai', 'AAD India Pvt. Ltd.', 'Diarchy Architects, Trichy',
  'OCI Architects, Chennai', 'Beavers Architects, Chennai', 'Kembhavi Architecture Foundation',
  'ETA Star Project Developers', 'City Union Bank, Kumbakonam', 'National Airport Authority',
  'Femina Hotels Pvt. Ltd.', 'Isha Homes, Chennai', 'RMK Construction & Housing',
  'Mutram Architects, Trichy', 'MS Design House, Trichy', 'Central Public Works, Bangalore',
  'Dhanalakshmi Srinivasan College',
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/projects').then((res) => {
      setFeatured(res.data.filter((p) => p.featured).slice(0, 6));
    }).catch(() => {});
  }, []);

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-eyebrow">Structural Engineering Consultancy · Est. 1990</div>
          <h1 className="hero-title">Built on <em>Precision.</em><br />Trusted by Generations.</h1>
          <p className="hero-sub">Trichy RG Engineering Excellence Pvt. Ltd.</p>
          <p className="hero-desc">Civil and structural engineering consultancy of proven experience, designing safe, stable, and enduring structures across South India since 1990.</p>
          <div className="hero-btns">
            <Link to="/projects" className="btn-primary">View Our Projects</Link>
            <Link to="/contact" className="btn-outline">Enquire Now</Link>
          </div>
        </div>
        <div className="hero-stats">
          {[
            { num: '35+', label: 'Years of Excellence' },
            { num: '200+', label: 'Projects Delivered' },
            { num: '50+', label: 'Partner Firms' },
            { num: '6', label: 'Project Categories' },
          ].map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section">
        <div className="about-visual fade-in">
          <img className="about-portrait" src={portrait} alt="R. Ganesan" />
          <div className="about-visual-title">R. Ganesan</div>
          <div className="about-visual-text">Chief Structural Consultant &amp; Director. Post Graduate in Structural Engineering from NIT Tiruchirappalli with over three decades of distinguished expertise.</div>
          <div className="about-badges">
            <span className="badge">NIT Trichy Alumni</span>
            <span className="badge">STAAD Pro</span>
            <span className="badge">Seismic Design</span>
            <span className="badge">Wind Analysis</span>
          </div>
        </div>
        <div className="fade-in">
          <div className="section-label">About Us</div>
          <h2 className="section-title">Engineering <em>Trust</em><br />Since 1990</h2>
          <div className="divider" />
          <p className="section-desc">Trichy RG Engineering Excellence is a structural engineering consultancy firm dedicated solely to structural consultancy, serving residential, commercial, educational, industrial, and institutional projects across South India.</p>
          <p className="section-desc" style={{ marginTop: 20 }}>Our philosophy: modern, architecturally beautiful structures must never compromise on structural stability and durability.</p>
          <Link to="/contact" className="btn-primary" style={{ display: 'inline-block', marginTop: 32 }}>Work With Us</Link>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services-section">
        <div className="fade-in" style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="section-label">What We Do</div>
          <h2 className="section-title">Our <em>Services</em></h2>
        </div>
        <div className="services-grid fade-in">
          {services.map((s) => (
            <div className="service-card" key={s.num}>
              <div className="service-num">{s.num}</div>
              <div className="service-title">{s.title}</div>
              <div className="service-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {featured.length > 0 && (
        <section className="featured-section">
          <div className="featured-header fade-in">
            <div>
              <div className="section-label">Portfolio</div>
              <h2 className="section-title">Featured <em>Projects</em></h2>
            </div>
            <Link to="/projects" className="btn-outline">View All Projects</Link>
          </div>
          <div className="projects-grid fade-in">
            {featured.map((p) => (
              <div className="project-card" key={p.id}>
                <div className="project-img">
                  {p.image_url ? (
                    <img src={`${SERVER}${p.image_url}`} alt={p.title} />
                  ) : (
                    <div className="project-img-placeholder">
                      {categoryEmoji[p.category] || '🏗️'}
                    </div>
                  )}
                </div>
                <div className="project-info">
                  <div className="project-cat">{p.category}</div>
                  <div className="project-name">{p.title}</div>
                  {p.architect && <div className="project-arch">{p.architect}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="clients-section">
        <div className="fade-in" style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label">Trusted By</div>
          <h2 className="section-title">Our <em>Clients & Partners</em></h2>
        </div>
        <div className="marquee-wrap fade-in">
          <div className="marquee-row">
            {[...clients, ...clients].map((c, i) => (
              <span className="client-pill" key={i}>{c}</span>
            ))}
          </div>
          <div className="marquee-row marquee-reverse">
            {[...clients.slice(8), ...clients.slice(0, 8), ...clients.slice(8), ...clients.slice(0, 8)].map((c, i) => (
              <span className="client-pill" key={i}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section fade-in">
        <div className="cta-inner">
          <h2 className="cta-title">Ready to Start Your <em>Project?</em></h2>
          <p className="cta-desc">Get in touch with our structural engineering team today. We respond within 24 hours.</p>
          <Link to="/contact" className="btn-primary">Send an Enquiry</Link>
        </div>
      </section>
    </main>
  );
}
