import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Activity, Users, PlusCircle, LogOut, Bell } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <h2>HealthCloud</h2>
      
      <nav style={{ flex: 1 }}>
        {role === 'doctor' ? (
          <>
            <NavLink to="/doctor-dashboard" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Activity size={20} />
              Doctor Dashboard
            </NavLink>
            <NavLink to="/emergencies" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Bell size={20} />
              Alerts
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Activity size={20} />
              Patient Dashboard
            </NavLink>
            <NavLink to="/vitals" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <PlusCircle size={20} />
              Add Vitals
            </NavLink>
          </>
        )}
      </nav>

      <div className="user-profile">
        <div className="user-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="user-info">
          <span className="name">{user.name || 'User'}</span>
          <span className="role">{role === 'doctor' ? 'Medical Doctor' : 'Patient'}</span>
        </div>
      </div>

      <button onClick={handleLogout} className="nav-link" style={{ background: 'transparent', border: 'none', width: '100%', marginTop: '10px' }}>
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
