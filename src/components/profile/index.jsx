import React, { useEffect, useState } from "react";
import "./profile.scss";
import { BASE_URL } from "../../utils/utils";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            
            if (response.ok) {
                setProfile(data.data);
            } else {
                toast.error(data.message || "Error fetching profile");
            }
        } catch (error) {
            toast.error("Error fetching profile");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profilepic", file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/user/profile/upload-image`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });
            const data = await response.json();

            if (response.ok) {
                toast.success("Profile picture updated successfully");
                fetchProfile();
            } else {
                toast.error(data.message || "Error uploading image");
            }
        } catch (error) {
            toast.error("Error uploading image");
        }
    };

    if (loading) {
        return <div className="profile">Loading...</div>;
    }

    return (
        <div className="profile">
            <div className="profile-container">
                <div className="profile__header">
                    <div className="profile__avatar">
                        <input
                            type="file"
                            id="profilePicInput"
                            hidden
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <div 
                            className="profile__avatar-upload"
                            onClick={() => document.getElementById("profilePicInput").click()}
                        >
                            <img
                                src={profile?.profilepic || "https://via.placeholder.com/150"}
                                alt="profile"
                            />
                        </div>
                    </div>
                    <div className="profile__info">
                        <div className="profile__info-header">
                            <h1 className="profile__username">
                                {profile?.username || "Loading..."}
                            </h1>
                            <div className="profile__actions">
                                <button className="btn btn--primary" onClick={() => navigate("/profile/edit")}>
                                    Edit profile
                                </button>
                            </div>
                        </div>
                        <div className="profile__stats">
                            <div className="profile__stat">
                                <span className="profile__stat-value">0</span>{" "}
                                posts
                            </div>
                            <div className="profile__stat">
                                <span className="profile__stat-value">338</span>{" "}
                                followers
                            </div>
                            <div className="profile__stat">
                                <span className="profile__stat-value">299</span>{" "}
                                following
                            </div>
                        </div>
                        <div className="profile__bio">
                            <h2 className="profile__name">{profile?.name || "Loading..."}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
