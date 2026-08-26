import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

const CATEGORIES = ['institutional', 'residential', 'commercial', 'religious', 'bungalow', 'industrial'];
const EMPTY_FORM = { title: '', category: 'institutional', architect: '', description: '', featured: false };
const SERVER = 'http://localhost:3001';

export default function Projects() {
  const [projects, setProjects]       = useState([]);
  const [architects, setArchitects]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('all');
  const [showModal, setShowModal]     = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileInputRef = useRef();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects', {
        params: filter !== 'all' ? { category: filter } : {},
      });
      setProjects(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    api.get('/architects').then((res) => setArchitects(res.data)).catch(() => {});
  }, [filter]);

  const openAdd = () => {
    setEditProject(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setError('');
    setShowModal(true);
  };

  const openEdit = (project) => {
    setEditProject(project);
    setForm({
      title: project.title,
      category: project.category,
      architect: project.architect || '',
      description: project.description || '',
      featured: !!project.featured,
    });
    setImageFile(null);
    setImagePreview(project.image_url ? `${SERVER}${project.image_url}` : null);
    setError('');
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      // Use FormData so we can send file + fields together
      const data = new FormData();
      data.append('title',       form.title);
      data.append('category',    form.category);
      data.append('architect',   form.architect);
      data.append('description', form.description);
      data.append('featured',    form.featured ? 'true' : 'false');
      if (imageFile) data.append('image', imageFile);

      if (editProject) {
        await api.put(`/projects/${editProject.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/projects', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setDeleteConfirm(null);
      fetchProjects();
    } catch {
      alert('Failed to delete project.');
    }
  };

  const categoryEmoji = {
    institutional: '🏛️', residential: '🏢', commercial: '🏬',
    religious: '🙏', bungalow: '🏡', industrial: '🏭',
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Projects</h2>
          <p className="page-sub">{projects.length} projects</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Project</button>
      </div>

      <div className="filter-bar">
        {['all', ...CATEGORIES].map((cat) => (
          <button key={cat} className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <div className="page-loading">Loading projects...</div> : (
        <div className="section-card">
          <table className="table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Title</th>
                <th>Category</th>
                <th>Architect</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.image_url ? (
                      <img src={`${SERVER}${p.image_url}`} alt={p.title}
                        style={{ width: 60, height: 44, objectFit: 'cover', borderRadius: 4 }} />
                    ) : (
                      <div style={{ width: 60, height: 44, borderRadius: 4, background: 'rgba(201,168,76,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                        {categoryEmoji[p.category] || '🏗️'}
                      </div>
                    )}
                  </td>
                  <td><strong>{p.title}</strong></td>
                  <td><span className={`badge badge-${p.category}`}>{p.category}</span></td>
                  <td>{p.architect || '—'}</td>
                  <td>{p.featured ? <span className="badge badge-gold">★ Featured</span> : '—'}</td>
                  <td className="actions">
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => setDeleteConfirm(p)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 && <div className="empty-state">No projects in this category.</div>}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editProject ? 'Edit Project' : 'Add New Project'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}

              {/* Image Upload */}
              <div className="form-group">
                <label>Project Photo</label>
                <div className="upload-area" onClick={() => fileInputRef.current.click()}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview"
                      style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 6 }} />
                  ) : (
                    <div className="upload-placeholder">
                      <div className="upload-icon">📷</div>
                      <div className="upload-text">Click to upload project photo</div>
                      <div className="upload-hint">JPG, PNG, WebP — max 5MB</div>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*"
                  style={{ display: 'none' }} onChange={handleImageChange} />
                {imagePreview && (
                  <button type="button" className="btn btn-sm btn-danger"
                    style={{ marginTop: 8 }}
                    onClick={() => { setImageFile(null); setImagePreview(null); fileInputRef.current.value = ''; }}>
                    Remove photo
                  </button>
                )}
              </div>

              <div className="form-group">
                <label>Project Title *</label>
                <input type="text" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Indoor Auditorium, St. Joseph College" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Architect / Firm</label>
                  <select value={form.architect} onChange={(e) => setForm({ ...form, architect: e.target.value })}>
                    <option value="">Select an architect...</option>
                    {form.architect && !architects.some((architect) => architect.name === form.architect) && (
                      <option value={form.architect}>{form.architect}</option>
                    )}
                    {architects.map((architect) => <option key={architect.id} value={architect.name}>{architect.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the project..." rows={3} />
              </div>

              <div className="form-check">
                <input type="checkbox" id="featured" checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                <label htmlFor="featured">Mark as Featured (shown first on public site)</label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editProject ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal modal-sm">
            <div className="modal-header"><h3>Delete Project</h3></div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>? This cannot be undone.</p>
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm.id)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
