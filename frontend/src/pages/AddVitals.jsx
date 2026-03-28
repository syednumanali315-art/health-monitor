import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Activity, Thermometer, Droplets, Heart, Wind } from 'lucide-react';

const AddVitals = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [formData, setFormData] = useState({
    bloodPressureSys: '',
    bloodPressureDia: '',
    sugarLevel: '',
    heartRate: '',
    oxygenLevel: '',
    temperature: ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        patient: user.id,
        bloodPressure: {
          systolic: Number(formData.bloodPressureSys),
          diastolic: Number(formData.bloodPressureDia)
        },
        sugarLevel: Number(formData.sugarLevel),
        heartRate: Number(formData.heartRate),
        oxygenLevel: Number(formData.oxygenLevel),
        temperature: Number(formData.temperature)
      };
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.post(`${API_URL}/health`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.isEmergency) {
        setStatus({ type: 'error', msg: 'Emergency Alert Triggered! ' + res.data.prescription });
      } else {
        setStatus({ type: 'success', msg: 'Vitals logged successfully!' });
        setTimeout(() => navigate('/dashboard'), 2000);
      }
      
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to log vitals: ' + (err.response?.data?.error || err.message) });
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Record Vitals</h1>
        <p style={{ color: 'var(--text-muted)' }}>Enter your current health metrics for real-time monitoring</p>
      </header>

      {status.msg && (
        <div className={status.type === 'error' ? 'emergency-banner' : 'glass-panel'} style={{ marginBottom: '24px', color: status.type === 'error' ? 'var(--accent-red)' : 'var(--accent-green)' }}>
          {status.msg}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label>Blood Pressure (Systolic / Diastolic)</label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input required type="number" value={formData.bloodPressureSys} onChange={e => setFormData({...formData, bloodPressureSys: e.target.value})} placeholder="Sys (e.g. 120)" />
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <input required type="number" value={formData.bloodPressureDia} onChange={e => setFormData({...formData, bloodPressureDia: e.target.value})} placeholder="Dia (e.g. 80)" />
          </div>
        </div>
        
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} /> Heart Rate (BPM)
          </label>
          <input required type="number" value={formData.heartRate} onChange={e => setFormData({...formData, heartRate: e.target.value})} placeholder="72" />
        </div>
        
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wind size={16} /> Oxygen Level (%)
          </label>
          <input required type="number" value={formData.oxygenLevel} onChange={e => setFormData({...formData, oxygenLevel: e.target.value})} placeholder="98" />
        </div>
        
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Droplets size={16} /> Sugar Level (mg/dL)
          </label>
          <input type="number" value={formData.sugarLevel} onChange={e => setFormData({...formData, sugarLevel: e.target.value})} placeholder="100" />
        </div>
        
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Thermometer size={16} /> Temperature (°F)
          </label>
          <input type="number" step="0.1" value={formData.temperature} onChange={e => setFormData({...formData, temperature: e.target.value})} placeholder="98.6" />
        </div>
        
        <button type="submit" className="login-btn" style={{ gridColumn: 'span 2' }}>Submit Vitals</button>
      </form>
    </div>
  );
};

export default AddVitals;
