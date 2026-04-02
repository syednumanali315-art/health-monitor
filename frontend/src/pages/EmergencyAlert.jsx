import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Clock, MapPin, Phone, Pill, Share2, Activity, User } from 'lucide-react';

const EmergencyAlert = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchEmergencies();
    const interval = setInterval(fetchEmergencies, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{ padding: '40px', color: 'var(--text-muted)' }}>Monitoring emergency status...</div>;

  return (
    <div className="emergency-alert-page">
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-red)' }}>CRITICAL MONITOR</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time medical emergency tracking</p>
        </div>
        <div style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', fontWeight: 700 }}>
          {emergencies.length} ACTIVE ALERTS
        </div>
      </header>
      
      <div className="alert-grid" style={{ display: 'grid', gap: '24px' }}>
        {emergencies.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '100px' }}>
            <h2 style={{ color: 'var(--accent-green)', fontWeight: 700 }}>ALL PATIENTS STABLE</h2>
            <p style={{ color: 'var(--text-muted)' }}>No critical alerts in the last 20 records.</p>
          </div>
        ) : (
          emergencies.map(alert => (
            <div key={alert._id} className="glass-panel" style={{ borderLeft: '6px solid var(--accent-red)', position: 'relative' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '12px', borderRadius: '16px' }}>
                    <AlertTriangle color="var(--accent-red)" size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{alert.patient.name}</h3>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <span className="badge" style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-blue)' }}>ID: {alert.patient._id.slice(-6)}</span>
                      <span className="badge" style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{alert.patient.age} Yrs</span>
                      <span className="badge" style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{alert.patientType || 'Adult'}</span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>
                    <Clock size={16} />
                    {new Date(alert.createdAt).toLocaleString()}
                  </div>
                  <span className="status-critical" style={{ fontSize: '0.9rem', fontWeight: 800, padding: '4px 12px' }}>{alert.riskLevel} ALERT</span>
                </div>
              </div>

              {/* Vital Data Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <DataPoint label="BP" value={alert.bloodPressure ? `${alert.bloodPressure.systolic}/${alert.bloodPressure.diastolic}` : '—'} />
                <DataPoint label="Sugar" value={alert.sugarLevel || '—'} unit="mg/dL" />
                <DataPoint label="O₂" value={alert.oxygenLevel || '—'} unit="%" />
                <DataPoint label="Heart Rate" value={alert.heartRate || '—'} unit="bpm" />
                <DataPoint label="Temp" value={alert.temperature || '—'} unit="°F" />
              </div>

              {/* Condition Section */}
              <div style={{ marginBottom: '24px', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <Activity size={18} color="var(--accent-red)" />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Condition Analysis</span>
                </div>
                <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{alert.possibleCondition}</p>
                <p style={{ marginTop: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <strong>Suggested Response:</strong> {alert.recommendedAction}
                </p>
              </div>

              {/* SNS Notification Status */}
              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Share2 size={16} color={alert.alertSent ? '#10b981' : 'var(--text-muted)'} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: alert.alertSent ? '#10b981' : 'var(--text-muted)' }}>
                  {alert.alertSent ? `AWS SNS Alert broadcasted to emergency team` : `SNS notification not triggered`}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn" style={{ flex: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Phone size={18} />
                  Call Contact: {alert.patient.emergencyContact}
                </button>
                <button className="btn btn-danger" style={{ flex: 1, fontWeight: 800 }}>Dispatch EMS</button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

const DataPoint = ({ label, value, unit }) => (
  <div style={{ textAlign: 'center', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 700 }}>{label}</p>
    <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>{value} <span style={{ fontSize: '0.7rem', fontWeight: 400 }}>{unit}</span></p>
  </div>
);

export default EmergencyAlert;
