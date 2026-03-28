import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, User, AlertCircle, Clock } from 'lucide-react';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${API_URL}/patients`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patients');
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Doctor Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage and monitor all your patients</p>
      </header>

      <div className="glass-panel">
        <h2>Active Patients</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="user-avatar" style={{ width: '32px', height: '32px' }}>
                      {patient.name.charAt(0)}
                    </div>
                    {patient.name}
                  </div>
                </td>
                <td>{patient.age}</td>
                <td>{patient.contact}</td>
                <td>
                  <span className="status-normal">Stable</span>
                </td>
                <td>
                  <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>View History</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorDashboard;
