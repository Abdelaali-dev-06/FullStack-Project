import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import './Create.css';
import LoadingOverlay from '../components/LoadingOverlay';

const Create = () => {
  const [view, setView] = useState('certificate');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [certForm, setCertForm] = useState({ name: '', lname: '', certificate_title: '', pdf_file: null, agree: false });
  const [docForm, setDocForm] = useState({ doc_title: '', pdf_file: null, agree: false });

  const rawToken = localStorage.getItem('token');
  const token = rawToken ? rawToken.split('|')[1] : '';

  const handleCertChange = e => {
    const { name, value, type, checked, files } = e.target;
    setCertForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleDocChange = e => {
    const { name, value, type, checked, files } = e.target;
    setDocForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleCertSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!certForm.agree) return setError('You must agree to the terms.');
    setLoading(true);
    const formData = new FormData();
    formData.append('name', certForm.name);
    formData.append('lname', certForm.lname);
    formData.append('certificate_title', certForm.certificate_title);
    formData.append('pdf_file', certForm.pdf_file);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/certificates', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess({ type: 'certificate', ...data });
      } else {
        setError(data.message || 'Error creating certificate.');
      }
    } catch (err) {
      setError('Error creating certificate.');
    } finally {
      setLoading(false);
    }
  };

  const handleDocSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!docForm.agree) return setError('You must agree to the terms.');
    setLoading(true);
    const formData = new FormData();
    formData.append('doc_title', docForm.doc_title);
    formData.append('pdf_file', docForm.pdf_file);
    try {
      const res = await fetch('http://localhost:8000/api/documents', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess({ type: 'document', ...data });
      } else {
        setError(data.message || 'Error creating document.');
      }
    } catch (err) {
      setError('Error creating document.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="success-container">
        <div className="success-card">
          <FaCheckCircle className="success-icon-large" />
          <h2 className="success-title">Success!</h2>
          <div className="success-divider"></div>
          <p className="success-message">{success.message}</p>

          {(success.certificate_id || success.doc_id) && (
            <div className="success-details-box">
              {success.certificate_id && (
                <div className="success-detail-row">
                  <span className="detail-label">Certificate ID:</span>
                  <span className="detail-value">{success.certificate_id}</span>
                </div>
              )}
              {success.doc_id && (
                <div className="success-detail-row">
                  <span className="detail-label">Document ID:</span>
                  <span className="detail-value">{success.doc_id}</span>
                </div>
              )}
            </div>
          )}

          <button className="success-back-button" onClick={() => { setSuccess(null); setError(''); }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-container">
      {loading && <LoadingOverlay />}
      <h2>Create Area</h2>
      <p>Here you can upload your certificates and documents</p>
      <div className="create-buttons">
        <button className={view === 'certificate' ? 'active-btn' : ''} onClick={() => setView('certificate')}>Create Certificate</button>
        <button className={view === 'document' ? 'active-btn' : ''} onClick={() => setView('document')}>Create Document</button>
      </div>
      {error && <div className="error-msg">{error}</div>}
      {view === 'certificate' && (
        <form className="create-section" onSubmit={handleCertSubmit}>
          <label>Name:<input type="text" name="name" value={certForm.name} onChange={handleCertChange} required /></label>
          <label>Last Name:<input type="text" name="lname" value={certForm.lname} onChange={handleCertChange} required /></label>
          <label>Certificate Title:<input type="text" name="certificate_title" value={certForm.certificate_title} onChange={handleCertChange} required /></label>
          <label>PDF File:<input type="file" name="pdf_file" accept="application/pdf" onChange={handleCertChange} required /></label>
          <label className="checkbox-label"><input type="checkbox" name="agree" checked={certForm.agree} onChange={handleCertChange} /> I agree and understand terms of use</label>
          <button className="submit-btn" type="submit" disabled={!certForm.agree || loading}>Submit</button>
        </form>
      )}
      {view === 'document' && (
        <form className="create-section" onSubmit={handleDocSubmit}>
          <label>Document Title:<input type="text" name="doc_title" value={docForm.doc_title} onChange={handleDocChange} required /></label>
          <label>PDF File:<input type="file" name="pdf_file" accept="application/pdf" onChange={handleDocChange} required /></label>
          <label className="checkbox-label"><input type="checkbox" name="agree" checked={docForm.agree} onChange={handleDocChange} /> I agree and understand terms of use</label>
          <button className="submit-btn" type="submit" disabled={!docForm.agree || loading}>Submit</button>
        </form>
      )}
    </div>
  );
};

export default Create; 