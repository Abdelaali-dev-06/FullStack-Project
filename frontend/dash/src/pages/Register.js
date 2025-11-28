import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [schoolName, setSchoolName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== verifyPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          school_name: schoolName,
          email,
          password
        })
      });
      const data = await response.json();
      
      if (response.ok && data.school_id) {
        alert('Registration was successful! Click OK to go to login.');
        navigate('/login');
      } else if (data.message && data.message.toLowerCase().includes('exists')) {
        alert('Email already exists. Please login instead.');
      } else {
        alert('Something went wrong.');
      }
    } catch (error) {
      alert('Something went wrong.');
    }
  };

  return (
    <div className="register-container">
      <div className="brand-header">
        <Link to="/" className="home-button">
          <i className="fas fa-home"></i> Home
        </Link>
        <h2 className="brand-name">NGCFO<span className="highlight">.COM</span></h2>
      </div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="schoolName">School Name</label>
          <input
            type="text"
            id="schoolName"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
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
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="verifyPassword">Verify Password</label>
          <input
            type="password"
            id="verifyPassword"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <div className="links">
        <Link to="/login">Already have an account? Login here</Link>
      </div>
    </div>
  );
};

export default Register; 