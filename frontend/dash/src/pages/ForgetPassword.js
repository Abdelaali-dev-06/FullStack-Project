import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import './ForgetPassword.css';

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSend = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/forget-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(data.message || 'Failed to send request');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        }
    };

    return (
        <div className="forget-page-wrapper">
            <div className="fun-shape shape-1"></div>
            <div className="fun-shape shape-2"></div>

            <div className="forget-container">
                <div className="forget-visuals">
                    <div className="icon-animation-container">
                        <div className="main-icon"><FaEnvelope /></div>
                        <div className="icon-pulse"></div>
                    </div>
                    <h2>Support Center</h2>
                    <p>Let us help you recover your access.</p>
                </div>

                <div className="forget-form-section">
                    <div className="forget-header">
                        <h3>Forget Password?</h3>
                        <p>Enter your email to contact support</p>
                    </div>

                    <form onSubmit={handleSend} className="fun-form">
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

                        {message && <div className="success-message-fun">{message}</div>}
                        {error && <div className="error-message-fun">{error}</div>}

                        <button type="submit" className="btn-fun-primary">
                            Send to Support
                        </button>
                    </form>

                    <div className="forget-footer">
                        <button onClick={() => navigate('/login')} className="btn-fun-text">Back to Login</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;
