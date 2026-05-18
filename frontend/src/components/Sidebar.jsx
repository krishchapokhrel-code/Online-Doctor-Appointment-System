import React from 'react';
import Icon from './Icon';

export function Sidebar({ user, doctorProfile, activePage, setPage, onLogout }) {
  const patientNav = [
    { id: 'home', label: 'Dashboard', icon: 'home' },
    { id: 'doctors', label: 'Find Doctors', icon: 'search' },
    { id: 'appointments', label: 'My Appointments', icon: 'calendar' },
    { id: 'chat', label: 'Messages', icon: 'message' },
    { id: 'medbot', label: 'AI Assistant', icon: 'bot' },
  ];
  const doctorNav = [
    { id: 'doc-dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'doc-appointments', label: 'Appointments', icon: 'calendar' },
    { id: 'doc-profile', label: 'My Profile', icon: 'user' },
    { id: 'doc-chat', label: 'Messages', icon: 'message' },
  ];
  const adminNav = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'admin-doctors', label: 'Doctors', icon: 'stethoscope' },
    { id: 'admin-appointments', label: 'Appointments', icon: 'calendar' },
  ];

  const navItems = user.role === 'admin' ? adminNav : user.role === 'doctor' ? doctorNav : patientNav;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-text">🏥 MedBook</div>
        <div className="logo-sub">Healthcare Platform</div>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section">
          {navItems.map(item => (
            <div key={item.id} className={`nav-item ${activePage === item.id ? 'active' : ''}`} onClick={() => setPage(item.id)}>
              <Icon name={item.icon} size={18} />
              {item.label}
            </div>
          ))}
        </div>
      </nav>
      <div className="sidebar-bottom">
        <div className="user-card">
          <div className="user-avatar">
            {doctorProfile?.profile_image
              ? <img src={`http://localhost:5000${doctorProfile.profile_image}`} alt="" />
              : (user?.name ? user.name[0].toUpperCase() : 'U')}
          </div>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.role}</div>
          </div>
          <button className="logout-btn" onClick={onLogout} title="Logout">
            <Icon name="logout" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
