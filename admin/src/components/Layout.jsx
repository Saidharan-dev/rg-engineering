import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/',           label: 'Dashboard',  icon: '▦' },
  { to: '/projects',   label: 'Projects',   icon: '🏗' },
  { to: '/enquiries',  label: 'Enquiries',  icon: '✉' },
  { to: '/architects',  label: 'Architects',  icon: '⌂' },
];

export default function Layout({ children }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-rg">RG</span>
          <span className="brand-text">Admin Panel</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">{admin?.username?.[0]?.toUpperCase()}</div>
            <div>
              <div className="admin-name">{admin?.username}</div>
              <div className="admin-role">Administrator</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
