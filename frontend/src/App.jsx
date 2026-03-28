import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import RegisterPatient from './pages/RegisterPatient';
import AddVitals from './pages/AddVitals';
import Login from './pages/Login';
import DoctorDashboard from './pages/DoctorDashboard';
import EmergencyAlert from './pages/EmergencyAlert';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" />;

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPatient />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRole="patient">
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/vitals" element={
          <ProtectedRoute allowedRole="patient">
            <AddVitals />
          </ProtectedRoute>
        } />

        <Route path="/doctor-dashboard" element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        } />

        <Route path="/emergencies" element={
          <ProtectedRoute allowedRole="doctor">
            <EmergencyAlert />
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
