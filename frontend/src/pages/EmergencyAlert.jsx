import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Clock, MapPin, Phone, Pill } from 'lucide-react';

const EmergencyAlert = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${API_URL}/health/emergencies`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmergencies(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching emergencies');
        setLoading(false);
      }
    };
    fetchEmergencies();

    // Poll for new emergencies
    const interval = setInterval(fetchEmergencies, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading alerts...</div>;

  return (
    <div className="emergency-alert-page">
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-red)' }}>Critical Alerts</h1>
        <p style={{ color: 'var(--text-muted)' }}>Real-time emergency monitoring</p>
      </header>
      
      <div className="alert-grid" style={{ display: 'grid', gap: '24px' }}>
        {emergencies.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '100px' }}>
            <h2 style={{ color: 'var(--accent-green)' }}>No Active Emergencies</h2>
            <p style={{ color: 'var(--text-muted)' }}>All patient vitals are stable.</p>
          </div>
        ) : (
          emergencies.map(alert => (
            <div key={alert._id} className="glass-panel" style={{ borderLeft: '6px solid var(--accent-red)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '10px', borderRadius: '12px' }}>
                    <AlertTriangle color="var(--accent-red)" size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{alert.patient.name}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Patient ID: {alert.patient._id}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Clock size={14} />
                    {new Date(alert.createdAt).toLocaleTimeString()}
                  </div>
                  <span className="status-critical" style={{ fontSize: '0.9rem', fontWeight: 700 }}>EMERGENCY</span>
                </div>
              </div>

              <div className="vital-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BP</p>
                  <p style={{ fontWeight: 700 }}>{alert.bloodPressure?.systolic}/{alert.bloodPressure?.diastolic}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sugar</p>
                  <p style={{ fontWeight: 700 }}>{alert.sugarLevel} mg/dL</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Oxygen</p>
                  <p style={{ fontWeight: 700 }}>{alert.oxygenLevel}%</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Heart Rate</p>
                  <p style={{ fontWeight: 700 }}>{alert.heartRate} bpm</p>
                </div>
              </div>

              {alert.prescription && (
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Pill size={16} color="var(--accent-blue)" />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent-blue)' }}>Automated Prescription</span>
                  </div>
                  <p style={{ fontSize: '0.95rem' }}>{alert.prescription}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Phone size={18} />
                  Call Emergency Contact ({alert.patient.emergencyContact})
                </button>
                <button className="btn btn-danger" style={{ flex: 1 }}>Dispatch Ambulance</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmergencyAlert;
