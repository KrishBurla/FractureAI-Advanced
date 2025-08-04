import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;

  // Show a loading message if user data hasn't been fetched yet
  if (!user) {
    return <div className="profile-container">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>My Profile</h1>
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">Full Name</span>
            <span className="detail-value">{user.fullName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Username</span>
            <span className="detail-value">{user.username}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email Address</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Joined On</span>
            <span className="detail-value">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;