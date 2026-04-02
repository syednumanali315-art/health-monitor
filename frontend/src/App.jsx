import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import EmergencyCenter from './pages/EmergencyCenter';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;
  return children;
};

const Header = () => {
  const { user, logout } = useAuth();
  return (
    <header>
      <div className="logo" onClick={() => window.location.href='/'}>
        <div className="logo-icon">🏥</div>
        <div>
          <div className="logo-text">HealthMonitor Cloud</div>
          <div className="logo-sub">Emergency Health Monitoring System</div>
        </div>
      </div>
      <nav className="nav">
        {user ? (
          <>
            <span className="user-chip">
              <span className={`user-dot ${user.role === 'doctor' ? 'dot-doctor' : 'dot-patient'}`}></span>
              <span style={{ fontWeight: 500 }}>{user.name}</span>
              <span style={{ opacity: .6, fontSize: '10px' }}>({user.role})</span>
            </span>
            <button className="nav-btn" onClick={() => window.location.href = user.role === 'doctor' ? '/doctor' : '/patient'}>Dashboard</button>
            <button className="nav-btn" onClick={() => window.location.href='/emergency'}>🚨 Emergency</button>
            <button className="nav-btn btn-danger" onClick={logout} style={{ fontSize: '11px' }}>Logout</button>
          </>
        ) : (
          <>
            <button className="nav-btn" onClick={() => window.location.href='/login'}>Login</button>
            <button className="nav-btn btn-primary" onClick={() => window.location.href='/register'}>Register</button>
          </>
        )}
      </nav>
    </header>
  );
};

const AppRoutes = () => {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/patient" element={
            <ProtectedRoute allowedRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/doctor" element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } />

          <Route path="/emergency" element={
            <ProtectedRoute>
              <EmergencyCenter />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
