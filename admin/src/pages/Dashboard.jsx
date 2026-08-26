import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/enquiries/stats'),
      api.get('/enquiries?status=pending'),
    ]).then(([statsRes, enquiriesRes]) => {
      setStats(statsRes.data);
      setRecentEnquiries(enquiriesRes.data.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading dashboard...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
        <p className="page-sub">Welcome back. Here's what's happening.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-blue">🏗</div>
          <div>
            <div className="stat-num">{stats?.projects ?? 0}</div>
            <div className="stat-label">Total Projects</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-gold">✉</div>
          <div>
            <div className="stat-num">{stats?.total ?? 0}</div>
            <div className="stat-label">Total Enquiries</div>
          </div>
        </div>
        <div className="stat-card stat-card-alert">
          <div className="stat-icon stat-red">🔔</div>
          <div>
            <div className="stat-num">{stats?.pending ?? 0}</div>
            <div className="stat-label">Pending Replies</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-green">✅</div>
          <div>
            <div className="stat-num">{stats?.answered ?? 0}</div>
            <div className="stat-label">Answered</div>
          </div>
        </div>
      </div>

      {/* Recent Pending Enquiries */}
      <div className="section-card">
        <div className="section-card-header">
          <h3>Pending Enquiries</h3>
          <Link to="/enquiries" className="btn btn-sm btn-outline">View All</Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <div className="empty-state">No pending enquiries 🎉</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Project Type</th>
                <th>Received</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentEnquiries.map((e) => (
                <tr key={e.id}>
                  <td><strong>{e.name}</strong></td>
                  <td>{e.email}</td>
                  <td>{e.project_type || '—'}</td>
                  <td>{new Date(e.created_at).toLocaleDateString('en-IN')}</td>
                  <td>
                    <Link to="/enquiries" className="btn btn-sm btn-ghost">Reply →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
