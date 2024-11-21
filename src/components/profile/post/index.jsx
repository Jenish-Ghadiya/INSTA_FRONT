import React, { useState } from 'react';
import { BASE_URL } from '../../../utils/utils';
import toast from 'react-hot-toast';
import './post.scss';

const Post = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

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
        setCaption('');
        setImage(null);
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
            {image ? (
              <img src={URL.createObjectURL(image)} alt="Preview" />
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
          className="caption-input"
        />
        <button type="submit" className="post-button">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <span>Post</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default Post;
