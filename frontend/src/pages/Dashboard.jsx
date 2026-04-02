import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, Droplets, Activity, Thermometer, AlertCircle, Pill, ClipboardList, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

  if (loading) return <div style={{ padding: '40px', color: 'var(--text-muted)' }}>Loading your health status...</div>;

  const riskColor = {
    Critical: '#ef4444', High: '#f59e0b', Moderate: '#3b82f6', Low: '#10b981'
  }[latest.riskLevel] || '#10b981';

  return (
    <div className="dashboard">
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Welcome, {user.name}</h1>
        <p style={{ color: 'var(--text-muted)' }}>Your real-time health monitoring dashboard</p>
      </header>

      {/* Emergency Banner */}
      {latest.isEmergency && (
        <div className="emergency-banner" style={{ marginBottom: '24px' }}>
          <AlertCircle size={24} />
          <div>
            <strong>🚨 CRITICAL ALERT!</strong> Your latest vitals require immediate attention.
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
              {latest.emergencyStatus} {latest.alertSent && '— Doctor has been notified via SMS alert.'}
            </p>
          </div>
        </div>
      )}

      {/* Vital Cards */}
      <div className="grid">
        <VitalCard label="Blood Pressure" value={latest.bloodPressure ? `${latest.bloodPressure.systolic}/${latest.bloodPressure.diastolic}` : '--'} unit="mmHg" isHigh={latest.bloodPressure?.systolic > 140} icon={<Heart color="#ef4444" size={28} />} />
        <VitalCard label="Sugar Level" value={latest.sugarLevel || '--'} unit="mg/dL" isHigh={latest.sugarLevel > 200} isLow={latest.sugarLevel < 70} icon={<Droplets color="#f59e0b" size={28} />} />
        <VitalCard label="Oxygen Level" value={latest.oxygenLevel || '--'} unit="%" isLow={latest.oxygenLevel < 90} icon={<Activity color="#3b82f6" size={28} />} />
        <VitalCard label="Heart Rate" value={latest.heartRate || '--'} unit="bpm"
          statusLabel={latest.heartRateStatus}
          isHigh={latest.heartRateStatus === 'High'} isLow={latest.heartRateStatus === 'Low'}
          icon={<Activity color="#10b981" size={28} />} />
      </div>

      {/* Heart Rate Classification */}
      {latest.heartRate && (
        <div className="glass-panel" style={{ marginTop: '24px' }}>
          <h2 style={{ marginBottom: '16px', fontWeight: 700 }}>💓 Heart Rate Classification</h2>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Patient Type: </span>
              <strong style={{ textTransform: 'capitalize' }}>{latest.patientType === 'child' ? `Child – ${latest.childAgeGroup}` : 'Adult'}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Heart Rate: </span>
              <strong>{latest.heartRate} bpm</strong>
            </div>
            <span style={{
              padding: '6px 18px', borderRadius: '20px', fontWeight: 700,
              background: latest.heartRateStatus === 'Normal' ? 'rgba(16,185,129,0.15)' : latest.heartRateStatus === 'High' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)',
              color: latest.heartRateStatus === 'Normal' ? '#10b981' : latest.heartRateStatus === 'High' ? '#ef4444' : '#3b82f6'
            }}>{latest.heartRateStatus || 'Normal'}</span>
          </div>
        </div>
      )}

      {/* Condition & Risk Assessment */}
      {latest.possibleCondition && (
        <div className="glass-panel" style={{ marginTop: '24px', borderLeft: `4px solid ${riskColor}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontWeight: 700 }}>🩺 What May Be Happening Now</h2>
            <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, background: `${riskColor}22`, color: riskColor }}>
              {latest.riskLevel} Risk
            </span>
          </div>
          <div style={{ display: 'grid', gap: '10px' }}>
            <Row label="Possible Condition" value={latest.possibleCondition} />
            <Row label="Recommended Action" value={latest.recommendedAction} />
            {latest.symptoms && <Row label="Reported Symptoms" value={latest.symptoms} />}
          </div>
          <p style={{ marginTop: '16px', fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            ⚠️ This is for informational purposes only. Always consult a qualified doctor for diagnosis.
          </p>
        </div>
      )}

      {/* Medicines Section */}
      <div className="glass-panel" style={{ marginTop: '24px' }}>
        <h2 style={{ fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Pill size={22} /> Medicine Overview
        </h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          <Row label="Current Medicines (you are taking)" value={latest.currentMedicines || 'None recorded'} />
          <Row label="Doctor Prescribed Medicines" value={latest.prescribedMedicines || 'Pending doctor review'} />
          {latest.dosage && <Row label="Dosage Instructions" value={latest.dosage} />}
          {latest.medicineTimings && <Row label="Medicine Timings" value={latest.medicineTimings} />}
          <Row label="Suggested Medicine Response" value={latest.prescription || '—'} />
        </div>
        <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '10px', background: latest.doctorApproved ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${latest.doctorApproved ? '#10b981' : '#f59e0b'}33` }}>
          {latest.doctorApproved ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 600 }}>
              <CheckCircle size={16} /> Doctor has reviewed and approved this prescription
            </span>
          ) : (
            <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.9rem' }}>
              ⏳ Prescription Status: Awaiting Doctor Review — Do not self-medicate
            </span>
          )}
        </div>
        {latest.doctorNotes && (
          <div style={{ marginTop: '12px', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Doctor's Notes</p>
            <p>{latest.doctorNotes}</p>
          </div>
        )}
      </div>

      {/* History Table */}
      <div className="glass-panel" style={{ marginTop: '24px' }}>
        <h2 style={{ fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ClipboardList size={22} /> Vitals History
        </h2>
        {healthData.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No records yet. Add your first vitals.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th><th>BP</th><th>Sugar</th><th>O₂</th><th>HR</th><th>HR Status</th><th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {healthData.map(d => (
                <tr key={d._id}>
                  <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td>{d.bloodPressure ? `${d.bloodPressure.systolic}/${d.bloodPressure.diastolic}` : '—'}</td>
                  <td>{d.sugarLevel || '—'}</td>
                  <td>{d.oxygenLevel ? `${d.oxygenLevel}%` : '—'}</td>
                  <td>{d.heartRate || '—'}</td>
                  <td>
                    <span style={{
                      padding: '2px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600,
                      background: d.heartRateStatus === 'Normal' ? 'rgba(16,185,129,0.15)' : d.heartRateStatus === 'High' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)',
                      color: d.heartRateStatus === 'Normal' ? '#10b981' : d.heartRateStatus === 'High' ? '#ef4444' : '#3b82f6'
                    }}>{d.heartRateStatus || 'Normal'}</span>
                  </td>
                  <td>
                    <span style={{
                      padding: '2px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600,
                      color: { Critical: '#ef4444', High: '#f59e0b', Moderate: '#3b82f6', Low: '#10b981' }[d.riskLevel] || '#10b981'
                    }}>{d.riskLevel || 'Low'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div style={{ display: 'flex', gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--border-glass)' }}>
    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', minWidth: '220px', flexShrink: 0 }}>{label}</span>
    <span style={{ fontSize: '0.9rem' }}>{value}</span>
  </div>
);

const VitalCard = ({ label, value, unit, isHigh, isLow, statusLabel, icon }) => {
  const status = isHigh ? 'Critical' : isLow ? 'Low' : 'Normal';
  const color = isHigh ? '#ef4444' : isLow ? '#3b82f6' : '#10b981';
  return (
    <div className="glass-panel vital-card" style={{ borderTop: `3px solid ${color}` }}>
      <div>
        <p className="vital-label">{label}</p>
        <p className="vital-value">{value} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>{unit}</span></p>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color }}>{statusLabel || status}</span>
      </div>
      {icon}
    </div>
  );
};

export default Dashboard;
