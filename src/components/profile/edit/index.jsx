import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../utils/utils';
import toast from 'react-hot-toast';
import "./edit.scss";

export default function Edit() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    profilepic: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

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
        setFormData(data.data);
      } else {
        toast.error(data.message || "Error fetching profile");
      }
    } catch (error) {
      toast.error("Error fetching profile");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const dataToSend = {
        name: formData.name,
        username: formData.username,
        ...(formData.bio?.trim() && { bio: formData.bio })
      };

      const response = await fetch(`${BASE_URL}/user/profile/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success("Profile updated successfully");
        navigate('/profile');
      } else {
        toast.error(data.message || "Error updating profile");
      }
    } catch (error) {
      toast.error(error.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className='edit-profile'>
      <div className="edit-profile__container">
        <div className="edit-profile__header">
          <h1>Edit Profile</h1>
          <p>Update your personal information</p>
        </div>

        <div  className="edit-profile__form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write something about yourself..."
              rows="4"
            />
          </div>

          <div className="edit-profile__actions">
            <button 
              type="button" 
              className="btn btn--secondary"
              onClick={() => navigate('/profile')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              type="submit" 
              className="btn btn--primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
