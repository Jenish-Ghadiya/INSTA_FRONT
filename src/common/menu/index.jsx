import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './menu.scss';
import { 
  AiFillHome,
  AiOutlineSearch,
  AiOutlineCompass,
  AiOutlineMessage,
  AiOutlineHeart,
  AiOutlinePlusSquare,
  AiOutlineMenu 
} from 'react-icons/ai';
import { RiVideoLine } from 'react-icons/ri';

const Menu = () => {
  const location = useLocation();

  const menuItems = [
    { icon: <AiFillHome size={24} />, label: 'Home', path: '/' },
    { icon: <AiOutlineSearch size={24} />, label: 'Search', path: '/search' },
    { icon: <AiOutlineCompass size={24} />, label: 'Explore', path: '/explore' },
    { icon: <RiVideoLine size={24} />, label: 'Reels', path: '/reels' },
    { icon: <AiOutlineMessage size={24} />, label: 'Messages', path: '/messages' },
    { icon: <AiOutlineHeart size={24} />, label: 'Notifications', path: '/notifications' },
    { icon: <AiOutlinePlusSquare size={24} />, label: 'Create', path: '/create' },
    { 
      icon: <img 
        src="/path-to-profile-image.jpg" 
        alt="Profile" 
        className="profile-icon" 
      />, 
      label: 'Profile', 
      path: '/profile' 
    },
  ];

  return (
    
    <div className="menu-container">
      <Link to="/" className="logo">
        Vatu
      </Link>

      <nav className="menu-items">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="icon">
              {item.icon}
            </div>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="more-button">
        <div className="menu-item">
          <div className="icon">
            <AiOutlineMenu size={24} />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default Menu;
