import React, { useEffect, useState } from 'react';
import './Account.css';

const Account = () => {
  const [accountData, setAccountData] = useState(null);
  const [uploads, setUploads] = useState(null);
  const [view, setView] = useState('info');
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');

  // Extract only the token part after the '|'
  const rawToken = localStorage.getItem('token');
  const token = rawToken ? rawToken.split('|')[1] : '';

  useEffect(() => {
    if (!token) return;
    fetch('http://127.0.0.1:8000/api/account', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(setAccountData);
  }, [token]);

  const handleGetUploads = () => {
    setView('uploads');
    fetch('http://localhost:8000/api/account/uploads/count', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(setUploads);
  };

  const handleChangePassword = async () => {
    const res = await fetch('http://localhost:8000/api/account/password/change', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password: current,
        new_password: newPass,
      }),
    });

    if (res.ok) {
      alert('Password changed successfully. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else {
      const data = await res.json();
      alert(data.message || 'Password change failed.');
    }
  };

  return (
    <div className="account-container">
      <h2>Account Area</h2>

      <div className="account-buttons">
        <button className={view === 'info' ? 'active-btn' : ''} 
          onClick={() => setView('info')}>Show Account Info</button>
        <button className={view === 'uploads' ? 'active-btn' : ''} 
          onClick={handleGetUploads}>Show Number of Uploads</button>
        <button className={view === 'password' ? 'active-btn' : ''} 
          onClick={() => setView('password')}>Change Password</button>
      </div>

      {view === 'info' && accountData && (
        <div className="account-section">
          <h3>Account Info</h3>
          <p><strong>School ID:</strong> {accountData.school_id}</p>
          <p><strong>School Name:</strong> {accountData.school_name}</p>
          <p><strong>Email:</strong> {accountData.email}</p>
          <p><strong>Status:</strong> {accountData.status}</p>
        </div>
      )}

      {view === 'uploads' && uploads && (
        <div className="account-section">
          <h3>Upload Count</h3>
          <p><strong>Number of Uploads:</strong> {uploads.number_of_uploads}</p>
        </div>
      )}

      {view === 'password' && (
        <div className="account-section">
          <h3>Change Password</h3>
          <input
            type="password"
            placeholder="Current Password"
            value={current}
            onChange={e => setCurrent(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
          />
          <button className="submit-btn" onClick={handleChangePassword}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default Account; 