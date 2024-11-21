import React, { useState } from 'react';
import { AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineShareAlt } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { BASE_URL } from '../../utils/utils';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './post.scss';

const PostCard = ({ post, onLike, onComment, detailed }) => {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(detailed);
  const [isLiked, setIsLiked] = useState(post.likes.includes(localStorage.getItem('userId')));
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/user/post/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.ok) {
        setIsLiked(!isLiked);
        onLike(post._id);
      }
    } catch (error) {
      toast.error('Error liking post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/user/post/${post._id}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: comment })
      });
      
      if (response.ok) {
        onComment(post._id, comment);
        setComment('');
      }
    } catch (error) {
      toast.error('Error adding comment');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="post-card">
      <div className="post-card__header">
        <Link to={`/profile/${post.user._id}`} className="post-card__user">
          <img 
            src={post.user.profilepic || "https://via.placeholder.com/40"} 
            alt={post.user.username} 
            className="post-card__avatar"
          />
          <div className="post-card__user-info">
            <span className="post-card__username">{post.user.username}</span>
            <span className="post-card__timestamp">{formatTimestamp(post.createdAt)}</span>
          </div>
        </Link>
        <button className="post-card__more">•••</button>
      </div>

      <div className="post-card__image">
        <img src={post.image} alt={post.caption} />
      </div>

      <div className="post-card__content">
        <div className="post-card__actions">
          <div className="post-card__actions-primary">
            <button 
              className={`post-card__action ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
              <span>{post.likes.length}</span>
            </button>
            <button 
              className="post-card__action"
              onClick={() => setShowComments(!showComments)}
            >
              <AiOutlineComment />
              <span>{post.comments.length}</span>
            </button>
          </div>
          <div className="post-card__actions-secondary">
            <button className="post-card__action">
              <AiOutlineShareAlt />
            </button>
            <button className="post-card__action">
              {isSaved ? <BsBookmarkFill /> : <BsBookmark />}
            </button>
          </div>
        </div>

        <div className="post-card__caption">
          <span className="post-card__username">{post.user.username}</span>
          {post.caption}
        </div>

        {showComments && (
          <div className="post-card__comments">
            {post.comments.map((comment, index) => (
              <div key={index} className="post-card__comment">
                <span className="post-card__username">{comment.user.username}</span>
                {comment.content}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleComment} className="post-card__comment-form">
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" disabled={!comment.trim()}>Post</button>
        </form>
      </div>
    </div>
  );
};

export default PostCard; 