import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './post.scss';
import { AiFillHeart } from 'react-icons/ai';

const ExplorePost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/user/post/explore`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setPosts(data.posts);
      } else {
        toast.error('Error fetching posts');
      }
    } catch (error) {
      toast.error('Error fetching posts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="explore">
      <h2>Explore Posts</h2>
      {loading ? (
        <div className="content-loader">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="explore__grid">
          {posts.map((post) => (
            <div 
              key={post._id} 
              className="explore__post"
              onClick={() => navigate(`/post/${post._id}`)}
            >
              <img src={post.image} alt={post.caption} />
              <div className="post__overlay">
                <div className="post__stats">
                  <span>
                    <AiFillHeart 
                      className={post.likes.includes(currentUserId) ? 'heart-icon liked' : 'heart-icon'} 
                    />
                    {post.likes.length}
                  </span>
                  <span>{post.comments.length} comments</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorePost; 