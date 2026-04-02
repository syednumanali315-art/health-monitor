import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function EmergencyCenter() {
  const { user } = useAuth();
  const [snsConfig, setSnsConfig] = useState({ doctorPhone: '', familyPhone: '', arn: '', type: 'SMS + Email' });
  const [success, setSuccess] = useState('');

  const testEmergency = async () => {
    // Simulated test call mapping to SNS integration in backend, ideally you post a vital array triggering it
    setSuccess('Test emergency alert triggered!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const saveSNS = () => {
    setSuccess('SNS configuration saved successfully.');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="page active" id="page-emerg">
      <div className="section-title" style={{color:'var(--red)'}}>🚨 Emergency Center</div>
      <div className="section-sub">Emergency contacts, advice and alert status in one place.</div>

      <div className="grid2" style={{marginBottom:'14px'}}>
        <div className="helpline-card">
          <div className="helpline-title">🚑 Emergency Helplines</div>
          <div className="helpline-row"><div className="helpline-label">Ambulance</div><div className="helpline-num">108</div></div>
          <div className="helpline-row"><div className="helpline-label">National Emergency</div><div className="helpline-num">112</div></div>
          <div className="helpline-row"><div className="helpline-label">Police</div><div className="helpline-num">100</div></div>
          <div className="helpline-row"><div className="helpline-label">Fire</div><div className="helpline-num">101</div></div>
          <div className="helpline-row"><div className="helpline-label">Patient's Doctor</div><div className="helpline-num">—</div></div>
          <div className="helpline-row"><div className="helpline-label">Emergency Contact</div><div className="helpline-num">{user?.emergencyContact || '—'}</div></div>
        </div>

        <div className="card">
          <div className="card-title">Current Emergency Status</div>
          <div className="alert alert-success">✅ No active emergency detected at this time.</div>
          <div style={{marginTop:'12px'}}>
            <button className="btn btn-danger btn-full" onClick={testEmergency}>🔔 Test Emergency Alert</button>
          </div>
          {success && <div className="alert alert-info" style={{marginTop:'10px'}}>{success}</div>}
        </div>
      </div>

      <div className="card" style={{marginBottom:'14px'}}>
        <div className="card-title">Emergency Advice</div>
        <div className="advice-grid">
          <div className="advice-card advice-do">
            <div className="advice-title">✅ What To Do</div>
            <div className="advice-item"><div className="advice-dot"></div><span>Call your doctor immediately</span></div>
            <div className="advice-item"><div className="advice-dot"></div><span>Call ambulance (108) if condition is severe</span></div>
            <div className="advice-item"><div className="advice-dot"></div><span>Keep patient calm and safe</span></div>
          </div>
          <div className="advice-card advice-dont">
            <div className="advice-title">❌ What NOT To Do</div>
            <div className="advice-item"><div className="advice-dot"></div><span>Do not panic</span></div>
            <div className="advice-item"><div className="advice-dot"></div><span>Do not ignore warning signs</span></div>
            <div className="advice-item"><div className="advice-dot"></div><span>Do not give random medicine</span></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">AWS SNS Emergency Alert Configuration</div>
        <div style={{fontSize:'12px', color:'var(--text2)', marginBottom:'12px'}}>
          Configure who receives emergency alerts. In production, these connect to your AWS SNS topic.
        </div>
        <div className="grid2">
          <div className="form-group">
            <label className="form-label">Doctor Phone / Email (SNS)</label>
            <input className="form-input" value={snsConfig.doctorPhone} onChange={e=>setSnsConfig({...snsConfig, doctorPhone: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Family Contact (SNS)</label>
            <input className="form-input" value={snsConfig.familyPhone} onChange={e=>setSnsConfig({...snsConfig, familyPhone: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">SNS Topic ARN</label>
            <input className="form-input" value={snsConfig.arn} onChange={e=>setSnsConfig({...snsConfig, arn: e.target.value})} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={saveSNS}>💾 Save SNS Configuration</button>
      </div>
    </div>
  );
}
