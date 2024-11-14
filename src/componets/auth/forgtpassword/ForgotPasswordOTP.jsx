import React, { useState, useEffect } from 'react';
import { useNavigate, useParams , useSearchParams} from 'react-router-dom';
import toast from 'react-hot-toast';
import '../auth.scss';

const ForgotPasswordOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isExpired, setIsExpired] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const otpQuery = searchParams.get('otp');

    useEffect(() => {
        if (otpQuery) {
            const otpArray = otpQuery.split('').slice(0, 6);
            setOtp(otpArray);
        }
    }, [otpQuery]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setIsExpired(true);
        }
    }, [timeLeft]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.value && index < 5) {
            const nextInput = element.parentElement.nextElementSibling.querySelector('input');
            nextInput.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);

            if (index > 0) {
                const prevInput = e.target.parentElement.previousElementSibling.querySelector('input');
                prevInput.focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isExpired) {
            toast.error('OTP has expired. Please request a new one.');
            return;
        }
        
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            toast.error('Please enter all digits');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/v1/user/forgot-password/verifyotp/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ otp: otpString }),
            });
            const data = await response.json();
            
            if (response.ok) {
                toast.success('OTP verified successfully');
                navigate(`/reset-password/${id}`);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Verify OTP</h2>
                <p className="otp-message">Enter the 6-digit code sent to your email</p>
                <div className="otp-input-container">
                    {otp.map((digit, index) => (
                        <div className="otp-input-box" key={index}>
                            <input
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                autoFocus={index === 0}
                            />
                        </div>
                    ))}
                </div>
                {!isExpired && (
                    <p className="timer">Time remaining: {timeLeft} seconds</p>
                )}
                {isExpired && (
                    <p className="expired">OTP has expired</p>
                )}
                <button type="submit" disabled={isExpired}>
                    Verify OTP
                </button>
            </form>
        </div>
    );
};

export default ForgotPasswordOTP; 