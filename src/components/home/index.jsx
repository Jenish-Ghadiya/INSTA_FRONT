import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../utils/utils";
import toast from "react-hot-toast";
import "./home.scss";
import { ContentLoader } from '../../common/loader/index';

export default function Home() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchProfile(); 
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await fetch(`${BASE_URL}/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            
            if (response.ok) {
                setProfile(data.data);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

  

    const handleLogout = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/user/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.ok) {
                logout();
                toast.success('Logged out successfully');
                navigate('/login');
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to logout');
            }
        } catch (error) {
            console.error("Error logging out:", error);
            toast.error('Failed to logout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ContentLoader />;
    }

    return (
        <div className="auth-buttons">
            {(!profile || !localStorage.getItem('token')) && (
                <button onClick={() => navigate("/login")}>Login</button>
            )}
            {profile && localStorage.getItem('token') && (
                <button onClick={handleLogout}>Logout</button>
            )}
        </div>
    );
}
