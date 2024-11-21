import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../utils/utils';
import { AiOutlineArrowLeft, AiOutlineHeart, AiFillHeart, AiOutlineComment } from 'react-icons/ai';
import { BsBookmark } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import './post.scss';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [profile, setProfile] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
    fetchProfile();

    // Cleanup function
    return () => {
      if (showFullImage) {
        document.body.style.overflow = 'auto';
      }
    };
  }, [postId]);

  useEffect(() => {
    // Handle body scroll when modal is open
    if (showFullImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showFullImage]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
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
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error('Error fetching profile');
    }
  };

  const fetchPost = async () => {
    if (!postId) {
      toast.error('Invalid post ID');
      navigate('/');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${BASE_URL}/user/post/post-detail/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const data = await response.json();

      if (response.ok) {
        const restructuredPost = {
          ...data.post,
          user: {
            _id: data.post.userId._id,
            username: data.post.userId.username,
            profilepic: data.post.profileId.profilepic
          },
          comments: data.post.comments.map(comment => ({
            ...comment,
            user: {
              _id: comment.userId._id,
              username: comment.userId.username,
              profilepic: comment.user.profilepic
            }
          }))
        };
        setPost(restructuredPost);
        setIsLiked(restructuredPost.likes.includes(localStorage.getItem('userId')));
      } else {
        throw new Error(data.message || 'Post not found');
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching post');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${BASE_URL}/user/post/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.ok) {
        setIsLiked(prev => !prev);
        setPost(prev => ({
          ...prev,
          likes: isLiked 
            ? prev.likes.filter(id => id !== localStorage.getItem('userId'))
            : [...prev.likes, localStorage.getItem('userId')]
        }));
      } else {
        throw new Error('Failed to like post');
      }
    } catch (error) {
      toast.error(error.message || 'Error liking post');
    } finally {
      setIsSubmitting(false);
    }
  };

  

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${BASE_URL}/user/post/${post._id}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: comment.trim() })
      });
      
      if (response.ok) {
        const data = await response.json();
        const newPost = data.post;
        setPost({
          ...newPost,
          user: {
            _id: newPost.userId._id,
            username: newPost.userId.username,
            profilepic: newPost.profileId.profilepic
          },
          comments: newPost.comments.map(comment => ({
            ...comment,
            user: {
              _id: comment.userId._id,
              username: comment.userId.username,
              profilepic: comment.user.profilepic
            }
          }))
        });
        setComment('');
        window.location.reload();
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      toast.error(error.message || 'Error adding comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="content-loader">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="post-detail">
      <div className="post-detail__header">
        <button onClick={() => navigate(-1)} className="back-button">
          <AiOutlineArrowLeft /> Back
        </button>
      </div>

      <div className="post-detail__content">
        <div className="post-detail__image">
          {post.image && (
            <>
              <img 
                src={post.image} 
                alt={post.caption || 'Post image'} 
                onClick={() => setShowFullImage(true)}
                style={{ cursor: 'pointer' }}
              />
              {showFullImage && (
                <div 
                  className="image-modal"
                  onClick={() => setShowFullImage(false)}
                >
                  <img 
                    src={post.image} 
                    alt={post.caption || 'Post image'} 
                    className="modal-image"
                  />
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="post-detail__info">
          <div className="post-detail__user-header">
            <Link to={`/profile/${post?.user?._id}`} className="post-detail__user">
              <img 
                src={post?.user?.profilepic || "https://via.placeholder.com/40"} 
                alt={post?.user?.username} 
                className="user-avatar"
              />
              <span>{post?.user?.username}</span>
            </Link>
          </div>

          <div className="post-detail__content-section">
            <p className="post-detail__caption">{post.caption}</p>
            <span className="post-detail__timestamp">
              {formatTimestamp(post.createdAt)}
            </span>
          </div>

          <div className="post-detail__comments-section">
            {post.comments?.map((comment) => (
              <div key={comment._id} className="post-detail__comment">
                <Link to={`/profile/${comment?.user?._id}`} className="comment-user">
                  <img 
                    src={comment?.user?.profilepic || "https://via.placeholder.com/30"} 
                    alt={comment?.user?.username}
                    className="comment-avatar"
                  />
                  <span className="comment-username">{comment?.user?.username}</span>
                </Link>
                <p className="comment-content">{comment.content}</p>
                <span className="comment-timestamp">
                  {formatTimestamp(comment.createdAt)}
                </span>
              </div>
            ))}
          </div>

          <div className="post-detail__actions">
            <div className="action-buttons">
              <button 
                className={`like-button ${isLiked ? 'liked' : ''}`}
                onClick={handleLike}
                disabled={isSubmitting}
              >
                {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
              </button>
              <button className="comment-button">
                <AiOutlineComment />
              </button>
              <button className="bookmark-button">
                <BsBookmark />
              </button>
            </div>
            
            <div className="post-detail__likes">
              {post?.likes?.length || 0} {post?.likes?.length === 1 ? 'like' : 'likes'}
            </div>

            <form onSubmit={handleComment} className="post-detail__comment-form">
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={1000}
              />
              <button 
                type="submit" 
                disabled={!comment.trim() || isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

PostDetail.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string,
    caption: PropTypes.string,
    image: PropTypes.string,
    likes: PropTypes.arrayOf(PropTypes.string),
    comments: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
      content: PropTypes.string,
      createdAt: PropTypes.string,
      user: PropTypes.shape({
        _id: PropTypes.string,
        username: PropTypes.string,
        profilepic: PropTypes.string
      })
    }))
  })
};

export default PostDetail; 