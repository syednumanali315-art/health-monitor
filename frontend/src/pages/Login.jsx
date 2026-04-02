import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      // Let the protected route or header redirect, or do it here
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="page active" id="page-login">
      <div className="auth-wrap">
        <div className="auth-box">
          <div className="auth-card">
            <div className="auth-title">Welcome Back</div>
            <div className="auth-sub">Login with your username and password</div>
            {error && <div className="alert alert-emergency">{error}</div>}
            
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input 
                  className="form-input" 
                  type="text" 
                  placeholder="Enter your username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <div className="pw-wrap">
                  <input 
                    className="form-input" 
                    type="password" 
                    placeholder="Enter password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-full">Login</button>
            </form>
            
            <div className="auth-divider">or</div>
            <div className="auth-link">New user? <a onClick={() => navigate('/register')}>Register here</a></div>
            <div className="auth-link" style={{marginTop:'6px'}}><a onClick={() => navigate('/')}>← Back to Home</a></div>
          </div>
        </div>
      </div>
    </div>
  );
}
