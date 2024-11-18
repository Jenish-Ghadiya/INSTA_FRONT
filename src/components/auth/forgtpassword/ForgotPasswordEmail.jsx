import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft, FiLock } from 'react-icons/fi';
import '../auth.scss';

const ForgotPasswordEmail = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error('Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/user/forgot-password/sendmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            
            if (response.ok) {
                toast.success('OTP sent to your email');
                navigate(`/verify-forgot-otp/${data.otp.userId}`);
            } else {
                toast.error(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            toast.error('Failed to send OTP. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <div className="forgot-password-header">
                    <div className="lock-icon">
                        <FiLock size={32} />
                    </div>
                    <h2>Forgot Password?</h2>
                    <p>Don't worry! Enter your email and we'll send you a verification code.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        {/* <label className="input-label">Email Address</label> */}
                        <div className="input-with-icon">
                            <FiMail className="input-icon" />
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="email-input"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="submit-button"
                    >
                        {loading ? (
                            <>
                                <span className="button-text">Sending</span>
                                <span className="loading-spinner"></span>
                            </>
                        ) : (
                            <span className="button-text">Send Verification Code</span>
                        )}
                    </button>

                    <div className="form-footer">
                        <Link to="/login" className="back-to-login">
                            <FiArrowLeft />
                            <span>Back to Login</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordEmail; 