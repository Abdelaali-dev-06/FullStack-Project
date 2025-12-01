import React, { useState } from 'react';
import './Verify.css';
import LoadingOverlay from '../components/LoadingOverlay';

import Id1 from './Id1';
import Id2 from './Id2';

function Verify() {

  const [verificationId, setVerificationId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [currentPage, setCurrentPage] = useState('main');




  const handleIdChange = (event) => {
    setVerificationId(event.target.value);
    setVerificationData(null);
    setCurrentPage('main');
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


      const responseText = await response.text();
      console.log('Raw response:', responseText);


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

        if (data.blockchain_data) {

          setVerificationData(data);
          setCurrentPage('id2');
        } else {

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