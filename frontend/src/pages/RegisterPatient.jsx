import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    age: '',
    contact: '',
    emergencyContact: '',
    medicalHistory: '',
    specialization: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.post(`${API_URL}/auth/register`, formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error registering');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '600px' }}>
        <h2>Create Account</h2>
        <p>Join the Cloud Health Network</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>{success}</div>}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Register As</label>
            <div className="role-switch">
              <button 
                type="button" 
                className={formData.role === 'patient' ? 'active' : ''} 
                onClick={() => setFormData({...formData, role: 'patient'})}
              > Patient </button>
              <button 
                type="button" 
                className={formData.role === 'doctor' ? 'active' : ''} 
                onClick={() => setFormData({...formData, role: 'doctor'})}
              > Doctor </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={onChange} required placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={onChange} required placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={onChange} required placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input type="text" name="contact" value={formData.contact} onChange={onChange} required placeholder="+1 234 567 890" />
            </div>

            {formData.role === 'patient' && (
              <>
                <div className="form-group">
                  <label>Age</label>
                  <input type="number" name="age" value={formData.age} onChange={onChange} required placeholder="e.g. 65" />
                </div>
                <div className="form-group">
                  <label>Emergency Contact</label>
                  <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={onChange} required placeholder="Name & Ph No." />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Medical History</label>
                  <input type="text" name="medicalHistory" value={formData.medicalHistory} onChange={onChange} placeholder="Any pre-existing conditions" />
                </div>
              </>
            )}

            {formData.role === 'doctor' && (
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Specialization</label>
                <input type="text" name="specialization" value={formData.specialization} onChange={onChange} required placeholder="e.g. Cardiologist" />
              </div>
            )}
          </div>

          <button type="submit" className="login-btn">Register</button>
        </form>
        
        <p className="register-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
