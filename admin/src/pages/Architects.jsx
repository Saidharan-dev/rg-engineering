import React, { useEffect, useRef, useState } from 'react';
import api from '../api/axios';

const SERVER = 'http://localhost:3001';
const CATEGORIES = ['institutional', 'residential', 'commercial', 'religious', 'bungalow', 'industrial'];
const EMPTY_FORM = { name: '', location: '', category: 'institutional' };

export default function Architects() {
  const [architects, setArchitects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const fetchArchitects = async () => {
    const res = await api.get('/architects');
    setArchitects(res.data);
  };

  useEffect(() => { fetchArchitects().catch(() => setError('Failed to load architects.')); }, []);

  const openAdd = () => {
    setEditing(null); setForm(EMPTY_FORM); setLogoFile(null); setLogoPreview(null);
    setError(''); setShowModal(true);
  };

  const openEdit = (architect) => {
    setEditing(architect); setForm({ name: architect.name, location: architect.location, category: architect.category });
    setLogoFile(null); setLogoPreview(architect.logo_url ? `${SERVER}${architect.logo_url}` : null);
    setError(''); setShowModal(true);
  };

  const handleSave = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try {
      const data = new FormData();
      data.append('name', form.name); data.append('location', form.location); data.append('category', form.category);
      if (logoFile) data.append('logo', logoFile);
      if (editing) await api.put(`/architects/${editing.id}`, data);
      else await api.post('/architects', data);
      setShowModal(false); await fetchArchitects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save architect.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (architect) => {
    if (!window.confirm(`Delete ${architect.name}?`)) return;
    try { await api.delete(`/architects/${architect.id}`); await fetchArchitects(); }
    catch (err) { setError(err.response?.data?.message || 'Failed to delete architect.'); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h2 className="page-title">Architects</h2><p className="page-sub">{architects.length} architect profiles</p></div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Architect</button>
      </div>
      {error && !showModal && <div className="alert alert-error">{error}</div>}
      <div className="architect-admin-grid">
        {architects.map((architect) => (
          <div className="architect-admin-card" key={architect.id}>
            <div className="architect-admin-top">
              {architect.logo_url ? <img src={`${SERVER}${architect.logo_url}`} alt="" className="architect-admin-logo" /> : <div className="architect-admin-logo architect-initials">{architect.name.slice(0, 2).toUpperCase()}</div>}
              <div><h3>{architect.name}</h3><p>{architect.location}</p><span className={`badge badge-${architect.category}`}>{architect.category}</span></div>
            </div>
            <div className="architect-projects"><strong>{architect.projects.length} projects</strong>{architect.projects.length > 0 ? <ul>{architect.projects.map((project) => <li key={project.id}>{project.title}</li>)}</ul> : <p>No projects linked yet.</p>}</div>
            <div className="actions"><button className="btn btn-sm btn-outline" onClick={() => openEdit(architect)}>Edit</button><button className="btn btn-sm btn-danger" onClick={() => handleDelete(architect)}>Delete</button></div>
          </div>
        ))}
        {architects.length === 0 && <div className="section-card empty-state">No architect profiles yet. Add the first one to feature it on the public website.</div>}
      </div>

      {showModal && <div className="modal-overlay" onClick={() => setShowModal(false)}><div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header"><h3>{editing ? 'Edit Architect' : 'Add New Architect'}</h3><button className="modal-close" onClick={() => setShowModal(false)}>✕</button></div>
        <form className="modal-body" onSubmit={handleSave}>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group"><label>Company Logo</label><div className="upload-area architect-upload" onClick={() => fileInputRef.current.click()}>{logoPreview ? <img src={logoPreview} alt="Logo preview" /> : <div className="upload-placeholder"><div className="upload-icon">▣</div><div className="upload-text">Click to upload logo</div><div className="upload-hint">JPG, PNG, WebP, SVG, max 5MB</div></div>}</div><input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml" style={{ display: 'none' }} onChange={(event) => { const file = event.target.files[0]; if (file) { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)); } }} /></div>
          <div className="form-group"><label>Architect / Company Name *</label><input value={form.name} required onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. AAD India Pvt. Ltd." /></div>
          <div className="form-group"><label>Location *</label><input value={form.location} required onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="e.g. Chennai, Tamil Nadu" /></div>
          <div className="form-group"><label>Category *</label><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{CATEGORIES.map((category) => <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>)}</select></div>
          <div className="modal-footer"><button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Architect'}</button></div>
        </form>
      </div></div>}
    </div>
  );
}
