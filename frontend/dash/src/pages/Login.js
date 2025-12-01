import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        if (email.endsWith('@edu.uiz.ac.ma')) {
          navigate('/');
        } else if (email.endsWith('@uiz.ac.ma')) {
          navigate('/dash');
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="fun-shape shape-1"></div>
      <div className="fun-shape shape-2"></div>

      <div className="login-container-split">
        <div className="login-visuals">
          <div className="lock-animation-container">
            <div className="lock-icon"><FaLock /></div>
            <div className="lock-pulse"></div>
          </div>
          <h2>Welcome Back!</h2>
          <p>Unlock your wellness journey.</p>
        </div>

        <div className="login-form-section">
          <div className="login-header">
            <h3>Login</h3>
            <p>Enter your details to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="fun-form">
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

            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <span
                onClick={() => navigate('/forget-password')}
                className="link-fun"
                style={{ fontSize: '0.9rem' }}
              >
                Forgot Password?
              </span>
            </div>

            {error && <div className="error-message-fun">{error}</div>}

            <button type="submit" className="btn-fun-primary">
              Unlock Account
            </button>
          </form>

          <div className="login-footer">
            <p>Don't have an account? <span onClick={() => navigate('/register')} className="link-fun">Register here</span></p>
            <button onClick={() => navigate('/')} className="btn-fun-text">Back to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;