import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Activity, Thermometer, Droplets, Heart, Wind, AlertCircle, User, Baby } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Heart rate ranges for display
const HR_RANGES = {
  adult:   { low: 60, high: 100, label: 'Adult' },
  newborn: { low: 70, high: 190, label: 'Newborn (0–1 mo)' },
  infant:  { low: 80, high: 160, label: 'Infant (1–12 mo)' },
  toddler: { low: 80, high: 130, label: 'Toddler (1–2 yr)' },
  child:   { low: 70, high: 120, label: 'Child (3–12 yr)' },
  teen:    { low: 60, high: 100, label: 'Teen (13–17 yr)' },
};

function getHRStatus(hr, type, ageGroup) {
  if (!hr) return null;
  const key = type === 'child' ? ageGroup : 'adult';
  const range = HR_RANGES[key] || HR_RANGES.adult;
  if (hr < range.low) return { status: 'Low', color: '#3b82f6' };
  if (hr > range.high) return { status: 'High', color: '#ef4444' };
  return { status: 'Normal', color: '#10b981' };
}

const AddVitals = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [patientType, setPatientType] = useState('adult');
  const [childAgeGroup, setChildAgeGroup] = useState('child');
  const [formData, setFormData] = useState({
    bloodPressureSys: '', bloodPressureDia: '',
    sugarLevel: '', heartRate: '', oxygenLevel: '',
    temperature: '', symptoms: '', currentMedicines: ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [result, setResult] = useState(null);

  const hrPreview = getHRStatus(Number(formData.heartRate), patientType, childAgeGroup);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        patient: user.id,
        patientType,
        childAgeGroup: patientType === 'child' ? childAgeGroup : undefined,
        bloodPressure: {
          systolic: Number(formData.bloodPressureSys),
          diastolic: Number(formData.bloodPressureDia)
        },
        sugarLevel: Number(formData.sugarLevel) || undefined,
        heartRate: Number(formData.heartRate) || undefined,
        oxygenLevel: Number(formData.oxygenLevel) || undefined,
        temperature: Number(formData.temperature) || undefined,
        symptoms: formData.symptoms,
        currentMedicines: formData.currentMedicines
      };

      const res = await axios.post(`${API_URL}/health`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setResult(res.data);
      if (res.data.isEmergency) {
        setStatus({ type: 'error', msg: '🚨 Emergency detected! Doctor has been alerted.' });
      } else {
        setStatus({ type: 'success', msg: '✅ Vitals logged successfully!' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed: ' + (err.response?.data?.error || err.message) });
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Record Vitals</h1>
        <p style={{ color: 'var(--text-muted)' }}>Enter your current health metrics for real-time monitoring</p>
      </header>

      {/* Patient Type Selector */}
      <div className="glass-panel" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Patient Type</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[{ val: 'adult', icon: <User size={18} />, label: 'Adult (18+)' },
            { val: 'child', icon: <Baby size={18} />, label: 'Child (under 18)' }].map(item => (
            <button key={item.val} onClick={() => setPatientType(item.val)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: patientType === item.val ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)',
                color: 'white', fontWeight: 600, transition: 'all 0.2s'
              }}>
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {patientType === 'child' && (
          <div style={{ marginTop: '16px' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>
              Select Child Age Group
            </label>
            <select value={childAgeGroup} onChange={e => setChildAgeGroup(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', background: 'rgba(15,23,42,0.8)', color: 'white', border: '1px solid var(--border-glass)', width: '100%' }}>
              <option value="newborn">Newborn (0–1 month)</option>
              <option value="infant">Infant (1–12 months)</option>
              <option value="toddler">Toddler (1–2 years)</option>
              <option value="child">Child (3–12 years)</option>
              <option value="teen">Teen (13–17 years)</option>
            </select>
          </div>
        )}
      </div>

      {/* Alert Banner */}
      {status.msg && (
        <div style={{
          padding: '16px', borderRadius: '12px', marginBottom: '24px',
          background: status.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
          border: `1px solid ${status.type === 'error' ? 'var(--accent-red)' : 'var(--accent-green)'}`,
          color: status.type === 'error' ? 'var(--accent-red)' : 'var(--accent-green)',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <AlertCircle size={20} /> {status.msg}
        </div>
      )}

      {/* Vitals Form */}
      <form onSubmit={handleSubmit} className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label>Blood Pressure (Systolic / Diastolic)</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input required type="number" value={formData.bloodPressureSys} onChange={e => setFormData({...formData, bloodPressureSys: e.target.value})} placeholder="Systolic (e.g. 120)" />
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <input required type="number" value={formData.bloodPressureDia} onChange={e => setFormData({...formData, bloodPressureDia: e.target.value})} placeholder="Diastolic (e.g. 80)" />
          </div>
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Heart size={16} /> Heart Rate (BPM)
            {hrPreview && (
              <span style={{ marginLeft: '8px', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: `${hrPreview.color}22`, color: hrPreview.color, fontWeight: 700 }}>
                {hrPreview.status}
              </span>
            )}
          </label>
          <input type="number" value={formData.heartRate} onChange={e => setFormData({...formData, heartRate: e.target.value})} placeholder={`Normal: ${HR_RANGES[patientType === 'child' ? childAgeGroup : 'adult'].low}–${HR_RANGES[patientType === 'child' ? childAgeGroup : 'adult'].high} bpm`} />
          <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            {patientType === 'adult' ? 'Adult range: 60–100 bpm' : `${HR_RANGES[childAgeGroup]?.label} range: ${HR_RANGES[childAgeGroup]?.low}–${HR_RANGES[childAgeGroup]?.high} bpm`}
          </small>
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wind size={16} /> Oxygen Level (%)
          </label>
          <input type="number" value={formData.oxygenLevel} onChange={e => setFormData({...formData, oxygenLevel: e.target.value})} placeholder="e.g. 98" />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Droplets size={16} /> Sugar Level (mg/dL)
          </label>
          <input type="number" value={formData.sugarLevel} onChange={e => setFormData({...formData, sugarLevel: e.target.value})} placeholder="e.g. 100" />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Thermometer size={16} /> Temperature (°F)
          </label>
          <input type="number" step="0.1" value={formData.temperature} onChange={e => setFormData({...formData, temperature: e.target.value})} placeholder="e.g. 98.6" />
        </div>

        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label>Symptoms (Optional)</label>
          <input type="text" value={formData.symptoms} onChange={e => setFormData({...formData, symptoms: e.target.value})} placeholder="e.g. headache, chest pain, dizziness" />
        </div>

        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label>Current Medicines (what you are taking now)</label>
          <input type="text" value={formData.currentMedicines} onChange={e => setFormData({...formData, currentMedicines: e.target.value})} placeholder="e.g. Amlodipine 5mg, Metformin 500mg" />
        </div>

        <button type="submit" className="login-btn" style={{ gridColumn: 'span 2' }}>Submit Vitals</button>
      </form>

      {/* Analysis Result */}
      {result && (
        <div style={{ marginTop: '32px', display: 'grid', gap: '20px' }}>
          
          {/* Heart Rate Classification Card */}
          <div className="glass-panel">
            <h3 style={{ marginBottom: '16px', fontWeight: 700 }}>💓 Heart Rate Classification</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div style={{ textAlign: 'center', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Patient Type</p>
                <p style={{ fontWeight: 700, fontSize: '1rem', textTransform: 'capitalize' }}>{result.patientType === 'child' ? `Child – ${result.childAgeGroup}` : 'Adult'}</p>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Heart Rate</p>
                <p style={{ fontWeight: 700, fontSize: '1.5rem' }}>{result.heartRate} <span style={{ fontSize: '0.8rem' }}>bpm</span></p>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</p>
                <span style={{
                  padding: '6px 16px', borderRadius: '20px', fontWeight: 700,
                  background: result.heartRateStatus === 'Normal' ? 'rgba(16,185,129,0.15)' : result.heartRateStatus === 'High' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)',
                  color: result.heartRateStatus === 'Normal' ? '#10b981' : result.heartRateStatus === 'High' ? '#ef4444' : '#3b82f6'
                }}>{result.heartRateStatus}</span>
              </div>
            </div>
          </div>

          {/* Condition Assessment */}
          <div className="glass-panel" style={{ borderLeft: `4px solid ${result.riskLevel === 'Critical' ? '#ef4444' : result.riskLevel === 'High' ? '#f59e0b' : result.riskLevel === 'Moderate' ? '#3b82f6' : '#10b981'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: 700 }}>🩺 Condition Assessment</h3>
              <span style={{
                padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700,
                background: result.riskLevel === 'Critical' ? 'rgba(239,68,68,0.2)' : result.riskLevel === 'High' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)',
                color: result.riskLevel === 'Critical' ? '#ef4444' : result.riskLevel === 'High' ? '#f59e0b' : '#10b981'
              }}>Risk: {result.riskLevel}</span>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              <InfoRow label="Possible Condition" value={result.possibleCondition} />
              <InfoRow label="Recommended Action" value={result.recommendedAction} />
              {result.currentMedicines && <InfoRow label="Current Medicines" value={result.currentMedicines} />}
            </div>
            <p style={{ marginTop: '16px', fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              ⚠️ This is for guidance only. Always consult a qualified doctor for diagnosis and treatment.
            </p>
          </div>

          {/* Prescription Suggestion */}
          <div className="glass-panel" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>💊 Suggested Medicine Response</h3>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{result.prescription}</p>
            <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <p style={{ fontSize: '0.82rem', color: '#f59e0b', fontWeight: 600 }}>
                ⚕️ Doctor Review Required — Prescription status: Pending doctor approval
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Do NOT take any medicine based on this suggestion without consulting your doctor first.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid var(--border-glass)' }}>
    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', minWidth: '160px', flexShrink: 0 }}>{label}</span>
    <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{value}</span>
  </div>
);

export default AddVitals;
