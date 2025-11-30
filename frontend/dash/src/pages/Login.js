import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('school_id', data.school_id);
        
        console.log('Stored token:', localStorage.getItem('token'));
        console.log('Stored school_id:', localStorage.getItem('school_id'));
        
        // alert('Login successful! Redirecting to dashboard...');
        navigate('/dash');
      } else if (data.message) {
        alert(data.message);
      } else {
        alert('Something went wrong.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="login-container">
      <div className="brand-header">
        <Link to="/" className="home-button">
          <i className="fas fa-home"></i> Home
        </Link>
        <h2 className="brand-name">Certa<span className="highlight">.Com</span></h2>
      </div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            placeholder='email'
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            placeholder='Password'
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div className="links">
        <Link to="/forgot-password">Forgot Password?</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Login;