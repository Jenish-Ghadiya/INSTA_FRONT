import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './auth.scss';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [loginType, setLoginType] = useState('email');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (loading) return;

        setLoading(true);
        
        try {
            const response = await fetch('https://insta-back-kappa.vercel.app/api/v1/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: formData.password,
                    [loginType]: formData[loginType]
                }),
            });

            const data = await response.json();
            if(formData.email === '' && formData.username === ''){
                toast.error('Please enter email or username');
                return;
            }
            if(formData.password === ''){
                toast.error('Please enter password');
                return;
            }
            
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                toast.success(data.message);
                console.log(data.success);
                navigate('/', { replace: true });
            } else {
                toast.error(data);
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleLoginType = () => {
        setLoginType(loginType === 'email' ? 'username' : 'email');
        setFormData(prev => ({
            ...prev,
            email: '',
            username: ''
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        {loginType === 'email' ? (
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        ) : (
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        )}
                        <button 
                            type="button" 
                            className="toggle-login-type"
                            onClick={toggleLoginType}
                            disabled={loading}
                        >
                            Use {loginType === 'email' ? 'username' : 'email'} instead
                        </button>
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            minLength={4}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={loading ? 'loading' : ''}
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                    <div className="auth-links">
                        <Link to="/forgot-password">Forgot password?</Link>
                        <span className="divider">•</span>
                        <Link to="/email-verification">Create new account</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;