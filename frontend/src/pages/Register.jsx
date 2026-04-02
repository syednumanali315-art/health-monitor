import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { search } = useLocation();
  const initRole = new URLSearchParams(search).get('role') || 'patient';
  
  const [role, setRole] = useState(initRole);
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', password: '', 
    age: '', gender: '', mobile: '', emergencyContact: '', address: '', history: '',
    specialization: '', experience: '', hospital: ''
  });
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (role === 'patient' && (formData.age < 0 || formData.age > 100)) {
      return setError('Age must be between 0 and 100');
    }
    
    try {
      await register({ ...formData, role });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="page active" id="page-register">
      <div className="auth-wrap">
        <div className="auth-box">
          <div className="auth-card">
            <div className="auth-title">Create Account</div>
            <div className="auth-sub">Fill in the form below to get started</div>
            
            <div className="role-toggle">
              <button type="button" className={`rt-btn ${role === 'patient' ? 'active' : ''}`} onClick={() => setRole('patient')}>🧑‍💼 Patient</button>
              <button type="button" className={`rt-btn ${role === 'doctor' ? 'active' : ''}`} onClick={() => setRole('doctor')}>👨‍⚕️ Doctor</button>
            </div>
            
            {error && <div className="alert alert-emergency">{error}</div>}

            <form onSubmit={handleRegister}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" type="text" placeholder="Your full name" required onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Username *</label>
                  <input className="form-input" type="text" placeholder="Min 3 characters" required minLength="3" onChange={e => setFormData({...formData, username: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email (optional)</label>
                <input className="form-input" type="email" placeholder="your@email.com" onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input className="form-input" type="password" placeholder="Min 6 characters" required minLength="6" onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>

              {role === 'patient' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Age *</label>
                      <input className="form-input" type="number" min="0" max="100" required onChange={e => setFormData({...formData, age: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender *</label>
                      <select className="form-input" required onChange={e => setFormData({...formData, gender: e.target.value})}>
                        <option value="">Select gender</option>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Mobile Number *</label>
                      <input className="form-input" type="tel" required onChange={e => setFormData({...formData, mobile: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Emergency Contact Number *</label>
                      <input className="form-input" type="tel" required onChange={e => setFormData({...formData, emergencyContact: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input className="form-input" type="text" onChange={e => setFormData({...formData, address: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Disease / Medical History (optional)</label>
                    <textarea className="form-input" onChange={e => setFormData({...formData, history: e.target.value})}></textarea>
                  </div>
                </>
              )}

              {role === 'doctor' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Specialization</label>
                      <input className="form-input" type="text" onChange={e => setFormData({...formData, specialization: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Experience (years)</label>
                      <input className="form-input" type="number" onChange={e => setFormData({...formData, experience: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hospital / Clinic Name</label>
                    <input className="form-input" type="text" onChange={e => setFormData({...formData, hospital: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Doctor Mobile Number</label>
                    <input className="form-input" type="tel" onChange={e => setFormData({...formData, mobile: e.target.value})} />
                  </div>
                </>
              )}

              <button type="submit" className="btn btn-primary btn-full" style={{marginTop:'4px'}}>Create Account</button>
            </form>

            <div className="auth-divider">or</div>
            <div className="auth-link">Already have an account? <a onClick={() => navigate('/login')}>Login here</a></div>
          </div>
        </div>
      </div>
    </div>
  );
}
