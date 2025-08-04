import React, { useContext } from 'react';
// 1. Import useNavigate from react-router-dom
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { authState, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated, user } = authState;
  const navigate = useNavigate(); // 2. Initialize the navigate function

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1 && names[1]) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // 3. Create a handler function for logging out
  const handleLogout = () => {
    logout(); // Clear the authentication state
    navigate('/login'); // Redirect to the login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">🩺 FractureAI</Link>
        
        <ul className="nav-menu">
          {isAuthenticated && <li className="nav-item"><Link to="/" className="nav-links">Dashboard</Link></li>}
          <li className="nav-item"><Link to="/about" className="nav-links">About</Link></li>
          <li className="nav-item"><Link to="/how-it-works" className="nav-links">How It Works</Link></li>
          {isAuthenticated && <li className="nav-item"><Link to="/history" className="nav-links">History</Link></li>}
        </ul>
        
        <div className="nav-controls">
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          {isAuthenticated && user ? (
            <>
              <Link to="/profile" className="user-profile-link">
                <div className="user-profile">
                  <div className="user-avatar">{getInitials(user.fullName)}</div>
                  <span>{user.fullName}</span>
                </div>
              </Link>
              {/* 4. Update the button to call the new handler */}
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </>
          ) : (
            <Link to="/login" className="login-button">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
