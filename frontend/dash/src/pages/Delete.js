import React, { useState } from 'react';
import './Delete.css';
import D1 from './D1';

function Delete() {
  const [certId, setCertId] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (certId.length !== 8 && certId.length !== 9) {
      alert('Certificate ID must be 8 or 9 characters long');
      return;
    }
    try {
      const fullToken = localStorage.getItem('token');
      if (!fullToken) throw new Error('No authentication token found');
      const token = fullToken.split('|')[1];
      if (!token) throw new Error('Invalid token format');
      const response = await fetch('http://localhost:8000/api/file/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: certId })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessData(data);
      } else {
        alert(data.message || 'Error deleting certificate.');
      }
    } catch (error) {
      alert(error.message || 'Error deleting certificate.');
    }
  };

  if (successData) {
    return <D1 data={successData} onBack={() => { setSuccessData(null); setCertId(''); setConfirm(false); }} />;
  }

  return (
    <div className="delete-container">
      <h2>Edit & Delete</h2>
      <div className="important-note">
        <strong>Important Note</strong>
        <p>
          Certificates and documents <b>cannot be edited</b> after submission. This is to maintain the integrity and authenticity of all certified documents. You may only delete certificates and re-create them if needed.
        </p>
      </div>
      <form className="delete-form" onSubmit={handleDelete}>
        <h3>Delete Certificate</h3>
        <label htmlFor="cert-id">Certificate ID</label>
        <input
          id="cert-id"
          type="text"
          placeholder="Certificate ID"
          value={certId}
          onChange={e => setCertId(e.target.value)}
        />
        <div className="checkbox-row">
          <input
            id="confirm"
            type="checkbox"
            checked={confirm}
            onChange={e => setConfirm(e.target.checked)}
          />
          <label htmlFor="confirm">
            I understand that this action <b>cannot be undone</b> and the certificate will be permanently deleted
          </label>
        </div>
        <button
          type="submit"
          className="delete-btn"
          disabled={!certId || !confirm}
        >
          Delete Certificate
        </button>
      </form>
    </div>
  );
}

export default Delete; 