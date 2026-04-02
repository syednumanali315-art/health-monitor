import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="page active" id="page-landing">
      <div className="hero">
        <h1>Cloud-Based <span>Emergency</span><br/>Health Monitoring</h1>
        <p>Monitor heart rate, blood pressure, oxygen, sugar and temperature in real time. Detect emergencies early, alert doctors instantly, and keep patients safe.</p>
        <div className="hero-badges">
          <div className="hero-badge">❤️ Heart Rate</div>
          <div className="hero-badge">🌡️ Temperature</div>
          <div className="hero-badge">🩸 Blood Pressure</div>
          <div className="hero-badge">🍬 Blood Sugar</div>
          <div className="hero-badge">🫁 Oxygen</div>
          <div className="hero-badge">🚨 SNS Alerts</div>
          <div className="hero-badge">🤖 AI Chatbot</div>
          <div className="hero-badge">📋 Reports</div>
        </div>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate('/register')}>Get Started — Register</button>
          <button className="btn btn-blue" onClick={() => navigate('/login')}>Login to My Account</button>
        </div>
      </div>

      <div className="feature-grid">
        <div className="feature-card"><span className="feature-icon">📊</span><div className="feature-title">Real-Time Vitals</div><div className="feature-desc">Live monitoring of all key health signs with instant status.</div></div>
        <div className="feature-card"><span className="feature-icon">⚠️</span><div className="feature-title">Risk Detection</div><div className="feature-desc">System detects dangerous values and shows possible conditions immediately.</div></div>
        <div className="feature-card"><span className="feature-icon">👨‍⚕️</span><div className="feature-title">Doctor Review</div><div className="feature-desc">Doctors see all patients, add prescriptions, and flag emergencies.</div></div>
        <div className="feature-card"><span className="feature-icon">🚑</span><div className="feature-title">Emergency Alerts</div><div className="feature-desc">Critical values trigger AWS SNS alerts to doctor and family.</div></div>
      </div>

      <div className="card" style={{margin:'20px 0'}}>
        <div className="card-title">How It Works</div>
        <div className="how-row">
          <div className="how-step"><div className="how-num">1</div><div className="how-label">Patient registers</div></div>
          <div className="how-step"><div className="how-num">2</div><div className="how-label">Login</div></div>
          <div className="how-step"><div className="how-num">3</div><div className="how-label">Enter vitals</div></div>
          <div className="how-step"><div className="how-num">4</div><div className="how-label">System analyses</div></div>
          <div className="how-step"><div className="how-num">5</div><div className="how-label">Doctor reviews</div></div>
          <div className="how-step"><div className="how-num">6</div><div className="how-label">SNS alert if critical</div></div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Choose Your Role</div>
        <div className="role-cards">
          <div className="role-card pat" onClick={() => navigate('/register?role=patient')}>
            <span className="role-icon">🧑‍💼</span>
            <div className="role-title">I am a Patient</div>
            <div className="role-desc">Register to track vitals, view conditions, manage reports and prescriptions.</div>
            <button className="btn btn-primary" style={{marginTop:'12px'}}>Register as Patient</button>
          </div>
          <div className="role-card doc" onClick={() => navigate('/register?role=doctor')}>
            <span className="role-icon">👨‍⚕️</span>
            <div className="role-title">I am a Doctor</div>
            <div className="role-desc">Register to monitor patients, review vitals, add prescriptions and respond to emergencies.</div>
            <button className="btn" style={{marginTop:'12px',borderColor:'#a371f766',color:'var(--purple)'}}>Register as Doctor</button>
          </div>
        </div>
      </div>
    </div>
  );
}
