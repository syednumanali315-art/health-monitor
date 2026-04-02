import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('vitals');
  const [vitals, setVitals] = useState({ ageGroup: 'adult', heartRate: '', bloodPressure: '', oxygen: '', sugar: '', temperature: '' });
  const [latestVital, setLatestVital] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchVitals();
    fetchPrescriptions();
    fetchReports();
  }, []);

  const fetchVitals = async () => {
    const res = await api.get('/vitals/my-vitals');
    if(res.data.length > 0) setLatestVital(res.data[0]);
  };
  const fetchPrescriptions = async () => {
    const res = await api.get(`/prescriptions/${user.id}`);
    setPrescriptions(res.data);
  };
  const fetchReports = async () => {
    const res = await api.get(`/reports/${user.id}`);
    setReports(res.data);
  };

  const submitVitals = async () => {
    try {
      await api.post('/vitals', vitals);
      fetchVitals();
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="page active">
      <div className="dashboard-header">
        <div>
          <div className="db-title">Patient Dashboard</div>
          <div className="db-sub">Monitor your health, view reports and prescriptions</div>
        </div>
        <div className="profile-chip">
          <div className="profile-avatar">{user?.name ? user.name[0] : 'P'}</div>
          <div>
            <div className="profile-name">{user?.name}</div>
            <div className="profile-meta">Age {user?.age} · {user?.gender}</div>
          </div>
        </div>
      </div>

      <div className="tabs">
        <div className={`tab ${activeTab === 'vitals' ? 'active' : ''}`} onClick={() => setActiveTab('vitals')}>📊 Vitals</div>
        <div className={`tab ${activeTab === 'meds' ? 'active' : ''}`} onClick={() => setActiveTab('meds')}>💊 Medications</div>
        <div className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>👤 My Profile</div>
      </div>

      {activeTab === 'vitals' && (
        <div className="tab-content active">
          <div className="card" style={{marginBottom:'14px'}}>
            <div className="card-title">Enter Health Readings</div>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Heart Rate (bpm)</label>
                <input className="form-input" type="number" value={vitals.heartRate} onChange={e=>setVitals({...vitals, heartRate: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Blood Pressure (sys/dia)</label>
                <input className="form-input" type="text" value={vitals.bloodPressure} onChange={e=>setVitals({...vitals, bloodPressure: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Oxygen (SpO₂ %)</label>
                <input className="form-input" type="number" value={vitals.oxygen} onChange={e=>setVitals({...vitals, oxygen: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Blood Sugar (mg/dL)</label>
                <input className="form-input" type="number" value={vitals.sugar} onChange={e=>setVitals({...vitals, sugar: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Temperature (°F)</label>
                <input className="form-input" type="number" value={vitals.temperature} onChange={e=>setVitals({...vitals, temperature: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Age Group</label>
                <select className="form-input" value={vitals.ageGroup} onChange={e=>setVitals({...vitals, ageGroup: e.target.value})}>
                  <option value="adult">Adult</option><option value="child">Child</option>
                </select>
              </div>
            </div>
            <button className="btn btn-primary" onClick={submitVitals}>🔍 Submit & Analyse</button>
          </div>

          {latestVital && (
            <div className="card">
              <div className="card-title">Overall Health Status: {latestVital.overallStatus}</div>
              <div style={{fontSize:'12px', color:'var(--text)'}}>
                {latestVital.risks?.map((r,i) => <div key={i}>⚠️ {r}</div>)}
              </div>
               <div style={{fontSize:'12px', marginTop:'10px'}}>
                {latestVital.nextAction?.map((n,i) => <div key={i}>{n}</div>)}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'meds' && (
        <div className="tab-content active">
          <div className="card">
            <div className="card-title">My Medications</div>
            {prescriptions.map(rx => (
               <div key={rx._id} className="med-card">
                  <div className="med-icon">💊</div>
                  <div style={{flex:1}}>
                    <div className="med-name">{rx.name}</div>
                    <div className="med-detail">Dose: {rx.dose} · Time: {rx.timing} · Prescribed by: {rx.prescribedByName}</div>
                  </div>
               </div>
            ))}
            {prescriptions.length === 0 && <div style={{fontSize:'12px', color:'var(--text2)'}}>No medications prescribed.</div>}
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="tab-content active">
           <div className="card">
             <div className="card-title">Patient Profile</div>
             <pre style={{fontSize:'12px', color:'var(--text2)'}}>{JSON.stringify(user, null, 2)}</pre>
           </div>
        </div>
      )}
    </div>
  );
}
