import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const SERVER = 'http://localhost:3001';
const CATEGORIES = ['all', 'institutional', 'residential', 'commercial', 'religious', 'bungalow', 'industrial'];

const categoryEmoji = {
  institutional: '🏛️', residential: '🏢', commercial: '🏬',
  religious: '🙏', bungalow: '🏡', industrial: '🏭',
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter]     = useState('all');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/projects', { params: filter !== 'all' ? { category: filter } : {} })
      .then((res) => setProjects(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <main style={{ paddingTop: 72 }}>
      <section className="projects-page-hero">
        <div className="section-label">Portfolio</div>
        <h1 className="section-title">Our <em>Projects</em></h1>
        <p className="section-desc">Explore our portfolio of structural engineering projects across South India.</p>
      </section>

      <section className="projects-page-body">
        {/* Filter */}
        <div className="filter-bar-pub fade-in">
          {CATEGORIES.map((cat) => (
            <button key={cat} className={`filter-pill ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}>
              {cat === 'all' ? 'All Projects' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="pub-loading">Loading projects...</div>
        ) : (
          <div className="projects-grid fade-in">
            {projects.map((p) => (
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
                  {p.description && <div className="project-desc">{p.description}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="pub-loading">No projects in this category yet.</div>
        )}
      </section>
    </main>
  );
}
