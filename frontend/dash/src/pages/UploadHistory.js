import './UploadHistory.css';
import React, { useEffect, useState } from 'react';

function UploadHistory() {
  const [view, setView] = useState('certificates');
  const [certs, setCerts] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    if (view === 'certificates') fetchCertificates(page);
    if (view === 'documents') fetchDocuments(page);
    // eslint-disable-next-line
  }, [view, page]);

  const extractTokenAndSchoolId = () => {
    const fullToken = localStorage.getItem('token');
    let schoolId = null;
    let token = null;
    if (fullToken && fullToken.includes('|')) {
      const parts = fullToken.split('|');
      schoolId = parts[0];
      token = parts[1];
    }
    return { schoolId, token };
  };

  const fetchCertificates = async (pageNum) => {
    setLoading(true);
    setCerts([]);
    try {
      const { schoolId, token } = extractTokenAndSchoolId();
      console.log('Extracted from token:', { schoolId, token });
      if (!token || !schoolId) {
        console.error('Missing data:', { token, schoolId });
        throw new Error('Missing token or school_id');
      }
      const url = new URL('http://localhost:8000/api/uploaded-history-certificates');
      url.searchParams.append('school_id', schoolId);
      url.searchParams.append('page', pageNum);
      url.searchParams.append('per_page', perPage);
      console.log('Request URL:', url.toString());
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);
      if (res.ok) {
        if (data.data && data.data.data) {
          setCerts(data.data.data);
          setLastPage(data.data.last_page);
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        throw new Error(data.message || 'Error fetching certificate history');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert(err.message || 'Error fetching certificate history');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async (pageNum) => {
    setLoading(true);
    setDocs([]);
    try {
      const { schoolId, token } = extractTokenAndSchoolId();
      console.log('Extracted from token:', { schoolId, token });
      if (!token || !schoolId) {
        console.error('Missing data:', { token, schoolId });
        throw new Error('Missing token or school_id');
      }
      const url = new URL('http://localhost:8000/api/uploaded-history-documents');
      url.searchParams.append('school_id', schoolId);
      url.searchParams.append('page', pageNum);
      url.searchParams.append('per_page', perPage);
      console.log('Request URL:', url.toString());
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);
      if (res.ok) {
        if (data.data && data.data.data) {
          setDocs(data.data.data);
          setLastPage(data.data.last_page);
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        throw new Error(data.message || 'Error fetching document history');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert(err.message || 'Error fetching document history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="history-container">
      <h2>Upload History</h2>
      <p className="history-desc">Here you can see your download history.</p>
      <div className="history-switch">
        <button
          className={view === 'certificates' ? 'active' : ''}
          onClick={() => { setView('certificates'); setPage(1); }}
        >
          Show Certificates
        </button>
        <button
          className={view === 'documents' ? 'active' : ''}
          onClick={() => { setView('documents'); setPage(1); }}
        >
          Show Documents
        </button>
      </div>
      {view === 'documents' && (
        <div>
          {loading ? (
            <div className="loading-msg">Loading...</div>
          ) : (
            <div>
              {(() => { console.log('Docs to display:', docs); return null; })()}
              {docs.length === 0 ? (
                <div className="no-history">No document history found.</div>
              ) : (
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Document ID</th>
                      <th>Title</th>
                      <th>Operation ID</th>
                      <th>Type</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map(doc => (
                      <tr key={doc.doc_id || doc.document_id}>
                        <td>{doc.doc_id || doc.document_id}</td>
                        <td>{doc.doc_title || doc.document_title}</td>
                        <td>{doc.operation_id}</td>
                        <td>{doc.type}</td>
                        <td>{doc.date_of_operation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="history-pagination">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  Previous
                </button>
                <span>Page {page} of {lastPage}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= lastPage}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {view === 'certificates' && (
        <div>
          {loading ? (
            <div className="loading-msg">Loading...</div>
          ) : (
            <div>
              {certs.length === 0 ? (
                <div className="no-history">No certificate history found.</div>
              ) : (
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Certificate ID</th>
                      <th>Name</th>
                      <th>Last Name</th>
                      <th>Title</th>
                      <th>Operation ID</th>
                      <th>Type</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certs.map(cert => (
                      <tr key={cert.certificate_id}>
                        <td>{cert.certificate_id}</td>
                        <td>{cert.name}</td>
                        <td>{cert.lname}</td>
                        <td>{cert.certificate_title}</td>
                        <td>{cert.operation_id}</td>
                        <td>{cert.type}</td>
                        <td>{cert.date_of_operation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="history-pagination">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  Previous
                </button>
                <span>Page {page} of {lastPage}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= lastPage}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UploadHistory;