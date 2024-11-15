import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import './auth.scss';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const navigate = useNavigate();
    const { id } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://insta-back-kappa.vercel.app/api/v1/user/signup/createuser/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            
            if (response.ok) {
                toast.success('Account created successfully');
                navigate('/login');
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
                <h2>Create Account</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupForm;