import React, { useEffect, useState } from "react";
import "./profile.scss";
import { BASE_URL } from "../../utils/utils";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ContentLoader, SmallLoader } from '../../common/loader/index';

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const init = async () => {
            await fetchProfile();
            await fetchPosts();
        };
        init();
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

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/user/post/user-posts`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            
            if (response.ok) {
                setPosts(data.posts);
            } else {
                toast.error(data.message || "Error fetching posts");
            }
        } catch (error) {
            toast.error("Error fetching posts");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
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
        } finally {
            setUploadingImage(false);
        }
    };

    if (loading) {
        return <ContentLoader />;
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
                            {uploadingImage ? (
                                <div className="profile__avatar-loading">
                                    <SmallLoader />
                                </div>
                            ) : (
                                <img
                                    src={profile?.profilepic || "https://via.placeholder.com/150"}
                                    alt="profile"
                                />
                            )}
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
                                <span className="profile__stat-value">{posts.length}</span>{" "}
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
                <div className="profile__posts">
                    <div className="profile__posts-header">
                        <h3>Posts</h3>
                        <button onClick={() => navigate('/create-post')} className="create-post-btn">
                            Create Post
                        </button>
                    </div>
                    <div className="profile__posts-grid">
                        {posts.map((post) => (
                            <div key={post._id} className="profile__post">
                                <img src={post.image} alt={post.caption} />
                                <div className="post__overlay">
                                    <div className="post__stats">
                                        <span>{post.likes.length} likes</span>
                                        <span>{post.comments.length} comments</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
