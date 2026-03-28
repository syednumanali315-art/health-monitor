import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, Droplets, Activity, Thermometer, Pill, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${API_URL}/health/patient/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHealthData(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patient data');
        setLoading(false);
      }
    };
    if (user.id) fetchMyData();
  }, [user.id]);

  const latest = healthData[0] || {};

  if (loading) return <div>Loading your health status...</div>;

  return (
    <div className="dashboard">
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Welcome, {user.name}</h1>
        <p style={{ color: 'var(--text-muted)' }}>Keep track of your real-time health vitals</p>
      </header>

      {latest.isEmergency && (
        <div className="emergency-banner">
          <AlertCircle size={24} />
          <div>
            <strong>CRITICAL STATE DETECTED!</strong>
            <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>
              Your latest vitals are outside safe ranges. {latest.prescription && `Prescription: ${latest.prescription}`}
            </p>
          </div>
        </div>
      )}

      <div className="grid">
        <div className="glass-panel vital-card">
          <div className="vital-info">
            <p className="vital-label">Blood Pressure</p>
            <p className="vital-value">{latest.bloodPressure ? `${latest.bloodPressure.systolic}/${latest.bloodPressure.diastolic}` : '--'}</p>
            <span className={latest.bloodPressure?.systolic > 140 ? "status-critical" : "status-normal"}>
              {latest.bloodPressure?.systolic > 140 ? "High" : "Normal"}
            </span>
          </div>
          <Heart color="var(--accent-red)" size={32} />
        </div>

        <div className="glass-panel vital-card">
          <div className="vital-info">
            <p className="vital-label">Sugar Level</p>
            <p className="vital-value">{latest.sugarLevel || '--'} <span style={{fontSize: '0.8rem'}}>mg/dL</span></p>
            <span className={latest.sugarLevel > 200 ? "status-critical" : "status-normal"}>
              {latest.sugarLevel > 200 ? "High" : "Normal"}
            </span>
          </div>
          <Droplets color="var(--accent-orange)" size={32} />
        </div>

        <div className="glass-panel vital-card">
          <div className="vital-info">
            <p className="vital-label">Oxygen Level</p>
            <p className="vital-value">{latest.oxygenLevel || '--'} <span style={{fontSize: '0.8rem'}}>%</span></p>
            <span className={latest.oxygenLevel < 90 ? "status-critical" : "status-normal"}>
              {latest.oxygenLevel < 90 ? "Critical" : "Safe"}
            </span>
          </div>
          <Activity color="var(--accent-blue)" size={32} />
        </div>

        <div className="glass-panel vital-card">
          <div className="vital-info">
            <p className="vital-label">Heart Rate</p>
            <p className="vital-value">{latest.heartRate || '--'} <span style={{fontSize: '0.8rem'}}>bpm</span></p>
            <span className={latest.heartRate > 120 ? "status-critical" : "status-normal"}>
              {latest.heartRate > 120 ? "High" : "Normal"}
            </span>
          </div>
          <Activity color="var(--accent-green)" size={32} />
        </div>
      </div>

      <div className="glass-panel" style={{ marginTop: '32px' }}>
        <h2>Latest Prescriptions</h2>
        {healthData.filter(d => d.prescription).length > 0 ? (
          <div style={{ marginTop: '16px' }}>
            {healthData.filter(d => d.prescription).map(d => (
              <div key={d._id} style={{ display: 'flex', gap: '12px', padding: '12px', borderBottom: '1px solid var(--border-glass)' }}>
                <Pill size={18} color="var(--accent-blue)" />
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{d.prescription}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(d.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>No prescriptions yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
