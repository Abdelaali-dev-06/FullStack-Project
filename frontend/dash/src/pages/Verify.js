import React, { useState } from 'react';
import './Verify.css';
import LoadingOverlay from '../components/LoadingOverlay';
import Verify1 from './Verify1';
import Verify2 from './Verify2';
import Id1 from './Id1';
import Id2 from './Id2';

function Verify() {
  const [file, setFile] = useState(null);
  const [verificationId, setVerificationId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [currentPage, setCurrentPage] = useState('main'); // 'main', 'verify1', 'verify2', 'id1', 'id2'
  const [fileError, setFileError] = useState('');

  const handleFileChange = (event) => {
    const selected = event.target.files[0];
    setVerificationData(null);
    setCurrentPage('main');
    setFileError('');
    if (selected && selected.type !== 'application/pdf') {
      setFile(null);
      setFileError('Only PDF files are allowed.');
      return;
    }
    setFile(selected);
  };

  const handleIdChange = (event) => {
    setVerificationId(event.target.value);
    setVerificationData(null);
    setCurrentPage('main');
  };

  const handleVerifyPdf = async () => {
    if (!file) {
      alert('Please select a PDF file first');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Log the request details
      console.log('Sending PDF verification request:', {
        file: file.name,
        size: file.size,
        type: file.type
      });

      const fullToken = localStorage.getItem('token');
      if (!fullToken) {
        throw new Error('No authentication token found');
      }

      // Extract the token part after the "|"
      const token = fullToken.split('|')[1];
      if (!token) {
        throw new Error('Invalid token format');
      }

      const response = await fetch('http://localhost:8000/api/file/verify/pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      // Log the response status and headers
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Get the response text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Try to parse as JSON if possible
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Server returned invalid JSON response');
      }
      
      if (response.ok) {
        setVerificationData(data);
        setCurrentPage('verify1');
      } else if (response.status === 404) {
        setVerificationData(data);
        setCurrentPage('verify2');
      } else {
        alert(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Detailed error:', error);
      if (error.message === 'No authentication token found') {
        alert('Please log in to verify documents');
      } else if (error.message === 'Invalid token format') {
        alert('Invalid token format. Please log in again.');
      } else if (error.message.includes('invalid JSON')) {
        alert('Server error: Invalid response format. Please check the server logs.');
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyId = async () => {
    if (!verificationId) {
      alert('Please enter an ID');
      return;
    }

    if (verificationId.length !== 8 && verificationId.length !== 9) {
      alert('ID must be either 8 or 9 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const fullToken = localStorage.getItem('token');
      if (!fullToken) {
        throw new Error('No authentication token found');
      }

      // Extract the token part after the "|"
      const token = fullToken.split('|')[1];
      if (!token) {
        throw new Error('Invalid token format');
      }

      const response = await fetch(`http://localhost:8000/api/file/verify/${verificationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      // Get the response text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Try to parse as JSON if possible
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Server returned invalid JSON response');
      }
      
      if (response.ok) {
        setVerificationData(data);
        setCurrentPage('id1');
      } else if (response.status === 404) {
        // Check if it's an inactive document or non-existent ID
        if (data.blockchain_data) {
          // It's an inactive document
          setVerificationData(data);
          setCurrentPage('id2');
        } else {
          // It's a non-existent ID
          alert(data.message || 'This ID is not in our system at all');
          setCurrentPage('main');
        }
      } else {
        alert(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Detailed error:', error);
      if (error.message === 'No authentication token found') {
        alert('Please log in to verify documents');
      } else if (error.message === 'Invalid token format') {
        alert('Invalid token format. Please log in again.');
      } else if (error.message.includes('invalid JSON')) {
        alert('Server error: Invalid response format. Please check the server logs.');
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentPage('main');
    setVerificationData(null);
  };

  if (currentPage === 'verify1') {
    return <Verify1 verificationData={verificationData} onBack={handleBack} />;
  }

  if (currentPage === 'verify2') {
    return <Verify2 verificationData={verificationData} onBack={handleBack} />;
  }

  if (currentPage === 'id1') {
    return <Id1 verificationData={verificationData} onBack={handleBack} />;
  }

  if (currentPage === 'id2') {
    return <Id2 verificationData={verificationData} onBack={handleBack} />;
  }

  return (
    <div className="verify-container">
      {isLoading && <LoadingOverlay />}
      
      <div className="verify-header">
        <h2>Verify & Download Area</h2>
        <p>Here you can verify and download certificates and documents issued by us</p>
      </div>
      
      <div className="verify-columns">
        <div className="verify-column">
          <h3>PDF Upload</h3>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          {file && <div className="file-name">Selected: {file.name}</div>}
          {fileError && <div className="error-msg">{fileError}</div>}
          <button
            className="verify-btn"
            onClick={handleVerifyPdf}
            disabled={!file || isLoading || !!fileError}
          >
            {isLoading ? 'Verifying...' : 'PDF Upload'}
          </button>
        </div>

        <div className="verify-column">
          <h3>ID</h3>
          <input
            type="text"
            value={verificationId}
            onChange={handleIdChange}
            placeholder="Enter 8 or 9 character ID"
            className="id-input"
            disabled={isLoading}
          />
          <button 
            onClick={handleVerifyId}
            className="verify-button"
            disabled={!verificationId || isLoading}
          >
            {isLoading ? 'Verifying...' : 'ID'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Verify; 