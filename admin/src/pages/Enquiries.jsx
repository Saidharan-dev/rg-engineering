import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Enquiries() {
  const [tab, setTab] = useState('pending');
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);  // enquiry open in side panel
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sendSuccess, setSendSuccess] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/enquiries?status=${tab}`);
      setEnquiries(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
    setSelected(null);
  }, [tab]);

  const handleSendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    setSendError('');
    setSendSuccess(false);
    try {
      await api.post(`/enquiries/${selected.id}/reply`, { reply });
      setSendSuccess(true);
      setReply('');
      // Move it out of the list after a moment
      setTimeout(() => {
        setEnquiries((prev) => prev.filter((e) => e.id !== selected.id));
        setSelected(null);
        setSendSuccess(false);
      }, 1500);
    } catch (err) {
      setSendError(err.response?.data?.message || 'Failed to send reply.');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Enquiries</h2>
          <p className="page-sub">Manage customer enquiries</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${tab === 'pending' ? 'active' : ''}`}
          onClick={() => setTab('pending')}
        >
          🔔 Received / Pending
        </button>
        <button
          className={`tab ${tab === 'answered' ? 'active' : ''}`}
          onClick={() => setTab('answered')}
        >
          ✅ Answered
        </button>
      </div>

      <div className="enquiries-layout">
        {/* List panel */}
        <div className="enquiries-list">
          {loading ? (
            <div className="page-loading">Loading...</div>
          ) : enquiries.length === 0 ? (
            <div className="empty-state">
              {tab === 'pending' ? 'No pending enquiries 🎉' : 'No answered enquiries yet.'}
            </div>
          ) : (
            enquiries.map((e) => (
              <div
                key={e.id}
                className={`enquiry-item ${selected?.id === e.id ? 'selected' : ''}`}
                onClick={() => { setSelected(e); setReply(''); setSendError(''); setSendSuccess(false); }}
              >
                <div className="enquiry-item-top">
                  <strong>{e.name}</strong>
                  <span className="enquiry-date">{formatDate(e.created_at)}</span>
                </div>
                <div className="enquiry-item-email">{e.email}</div>
                {e.project_type && (
                  <span className={`badge badge-${e.project_type?.toLowerCase().split(' ')[0] || 'default'}`}>
                    {e.project_type}
                  </span>
                )}
                <p className="enquiry-preview">{e.message.slice(0, 80)}...</p>
              </div>
            ))
          )}
        </div>

        {/* Detail panel */}
        <div className="enquiry-detail">
          {!selected ? (
            <div className="enquiry-empty-panel">
              <div className="enquiry-empty-icon">✉</div>
              <p>Select an enquiry to view details</p>
            </div>
          ) : (
            <>
              <div className="detail-header">
                <div>
                  <h3 className="detail-name">{selected.name}</h3>
                  <div className="detail-meta">
                    <span>{selected.email}</span>
                    {selected.phone && <span> · {selected.phone}</span>}
                    <span> · {formatDate(selected.created_at)}</span>
                  </div>
                  {selected.project_type && (
                    <span className="badge badge-default" style={{ marginTop: 8, display: 'inline-block' }}>
                      {selected.project_type}
                    </span>
                  )}
                </div>
                <span className={`status-badge ${selected.status}`}>
                  {selected.status === 'pending' ? '🔔 Pending' : '✅ Answered'}
                </span>
              </div>

              <div className="detail-section">
                <div className="detail-label">Customer's message</div>
                <div className="detail-message">{selected.message}</div>
              </div>

              {selected.status === 'answered' && selected.admin_reply && (
                <div className="detail-section">
                  <div className="detail-label">Your reply · sent {formatDate(selected.replied_at)}</div>
                  <div className="detail-reply">{selected.admin_reply}</div>
                </div>
              )}

              {selected.status === 'pending' && (
                <div className="detail-section reply-section">
                  <div className="detail-label">Write a reply</div>
                  <textarea
                    className="reply-textarea"
                    placeholder="Type your reply here... This will be emailed to the customer and the enquiry will be marked as answered."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={6}
                  />
                  {sendError && <div className="alert alert-error">{sendError}</div>}
                  {sendSuccess && <div className="alert alert-success">✅ Reply sent! Enquiry marked as answered.</div>}
                  <div className="reply-actions">
                    <span className="reply-hint">📧 Will be emailed to {selected.email}</span>
                    <button
                      className="btn btn-primary"
                      onClick={handleSendReply}
                      disabled={sending || !reply.trim()}
                    >
                      {sending ? 'Sending...' : 'Send Reply & Mark Answered'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
