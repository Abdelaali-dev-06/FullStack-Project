import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRocket } from 'react-icons/fa';
import './Register.css';

function Register() {
  const [schoolName, setSchoolName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Email Domain Validation
    const studentDomain = '@edu.uiz.ac.ma';
    const adminDomain = '@uiz.ac.ma';

    if (!email.endsWith(studentDomain) && !email.endsWith(adminDomain)) {
      setError(`Email must end with ${studentDomain} or ${adminDomain}`);
      return;
    }

    if (password !== verifyPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_name: schoolName,
          email: email,
          password: password,
          password_confirmation: verifyPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="register-page-wrapper">
      <div className="fun-shape shape-1"></div>
      <div className="fun-shape shape-2"></div>

      <div className="register-container-split">
        <div className="register-visuals">
          <div className="lock-animation-container">
            <div className="lock-icon"><FaRocket /></div>
            <div className="lock-pulse"></div>
          </div>
          <h2>Join the Future!</h2>
          <p>Start your secure verification journey today.</p>
        </div>

        <div className="register-form-section">
          <div className="register-header">
            <h3>Create Account</h3>
            <p>Sign up for free and get started</p>
          </div>

          <form onSubmit={handleRegister} className="fun-form">
            <div className="input-group-fun">
              <input
                type="text"
                placeholder=" "
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
              />
              <label>School / Institution Name</label>
              <span className="input-highlight"></span>
            </div>

            <div className="input-group-fun">
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Email Address</label>
              <span className="input-highlight"></span>
            </div>

            <div className="input-group-fun">
              <input
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label>Password</label>
              <span className="input-highlight"></span>
            </div>

            <div className="input-group-fun">
              <input
                type="password"
                placeholder=" "
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                required
              />
              <label>Confirm Password</label>
              <span className="input-highlight"></span>
            </div>

            {error && <div className="error-message-fun">{error}</div>}

            <button type="submit" className="btn-fun-primary">
              Get Started
            </button>
          </form>

          <div className="register-footer">
            <p>Already have an account? <span onClick={() => navigate('/login')} className="link-fun">Login here</span></p>
            <button onClick={() => navigate('/')} className="btn-fun-text">Back to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;