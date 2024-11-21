import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../utils/utils';
import toast from 'react-hot-toast';
import './post.scss';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup preview URL when component unmounts
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/user/post/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Post created successfully');
        navigate('/profile');
      } else {
        toast.error(data.message || 'Error creating post');
      }
    } catch (error) {
      toast.error('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-create">
      <form onSubmit={handleSubmit} className="post-form">
        <div className="image-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="image-input"
            hidden
          />
          <label htmlFor="image-input" className="upload-label">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" />
            ) : (
              <div className="upload-placeholder">
                <span>Click to upload image</span>
              </div>
            )}
          </label>
        </div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write your caption here..."
          maxLength={1000}
        />
        <button 
          type="submit" 
          disabled={loading || !image}
          className={loading ? 'loading' : ''}
        >
          {loading ? 'Creating post...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost; 