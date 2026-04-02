import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [prescriptionForm, setPrescriptionForm] = useState({ name: '', type: 'General', dose: '', timing: '', duration: '', notes: '' });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients');
      setPatients(res.data);
    } catch(err) {
      console.error(err);
    }
  };

  const selectPatient = async (p) => {
    setSelectedPatient(p);
    try {
      const res = await api.get(`/vitals/patient/${p._id}`);
      setVitals(res.data);
    } catch(err) {
      console.error(err);
    }
  };

  const addPrescription = async () => {
    if(!selectedPatient) return alert('Select patient first');
    try {
      await api.post('/prescriptions/doctor', {
        ...prescriptionForm,
        patientId: selectedPatient._id
      });
      alert('Prescription added successfully');
      setPrescriptionForm({ name: '', type: 'General', dose: '', timing: '', duration: '', notes: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page active">
      <div className="dashboard-header">
        <div>
          <div className="db-title">Doctor Dashboard</div>
          <div className="db-sub">Monitor patients, review vitals, manage prescriptions</div>
        </div>
        <div className="profile-chip" style={{borderColor:'var(--purple)'}}>
          <div className="profile-avatar" style={{background:'#a371f718', color:'var(--purple)'}}>D</div>
          <div>
            <div className="profile-name">{user?.name}</div>
            <div className="profile-meta">{user?.specialization}</div>
          </div>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-title">Assigned Patients</div>
          <div>
            {patients.map(p => (
              <div key={p._id} className={`patient-row ${selectedPatient?._id === p._id ? 'active' : ''}`} onClick={() => selectPatient(p)}>
                <div className="pr-avatar">{p.name[0]}</div>
                <div>
                  <div className="pr-name">{p.name}</div>
                  <div className="pr-meta">Age {p.age} · {p.mobile}</div>
                </div>
              </div>
            ))}
            {patients.length === 0 && <div style={{fontSize:'12px', color:'var(--text2)'}}>No patients found.</div>}
          </div>
        </div>
        
        <div className="card">
          <div className="card-title">Selected Patient / Vitals</div>
          {!selectedPatient ? (
            <div style={{fontSize:'12px', color:'var(--text2)'}}>Select a patient from the list</div>
          ) : (
            <div>
               <div style={{fontSize:'14px', fontWeight:600}}>{selectedPatient.name}</div>
               <div style={{fontSize:'12px', color:'var(--text2)', marginBottom: '10px'}}>
                 Emergency Contact: <span style={{color:'var(--red)'}}>{selectedPatient.emergencyContact}</span><br/>
                 History: {selectedPatient.history}
               </div>

               <div className="card-title" style={{marginTop:'15px'}}>Latest Vitals</div>
               {vitals.length > 0 ? (
                 <div style={{fontSize:'12px', lineHeight: 1.8}}>
                   <div>Status: <strong>{vitals[0].overallStatus}</strong></div>
                   <div>HR: {vitals[0].heartRate} bpm</div>
                   <div>BP: {vitals[0].bloodPressure} mmHg</div>
                   <div>O2: {vitals[0].oxygen}%</div>
                   <div>Temp: {vitals[0].temperature}°F</div>
                   <div style={{marginTop:'8px', color:'var(--red)'}}>Risks: {vitals[0].risks?.join(' | ')}</div>
                 </div>
               ) : (
                 <div style={{fontSize:'12px', color:'var(--text2)'}}>No vitals recorded yet.</div>
               )}
            </div>
          )}
        </div>
      </div>

      {selectedPatient && (
        <div className="card" style={{marginTop:'14px'}}>
          <div className="card-title">Add Prescription for {selectedPatient.name}</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Medicine</label>
              <input className="form-input" value={prescriptionForm.name} onChange={e=>setPrescriptionForm({...prescriptionForm, name: e.target.value})} placeholder="e.g. Paracetamol" />
            </div>
            <div className="form-group">
              <label className="form-label">Dose</label>
              <input className="form-input" value={prescriptionForm.dose} onChange={e=>setPrescriptionForm({...prescriptionForm, dose: e.target.value})} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={addPrescription}>➕ Add Prescription</button>
        </div>
      )}
    </div>
  );
}
