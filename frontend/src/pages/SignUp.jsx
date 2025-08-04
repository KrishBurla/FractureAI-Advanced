import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import './Login.css'; // Reusing the login styles

const SignUp = () => {
  const { register } = useContext(AuthContext); // Use the register function
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const { fullName, username, email, password } = formData;

const onChange = (e) => {
  console.log(`Typing in field: ${e.target.name}, New value: ${e.target.value}`);
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await register({ fullName, username, email, password });
    if (result.success) {
      navigate('/'); // Redirect to dashboard on success
    } else {
      setError(result.msg || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create an Account</h2>
        <p>Get started by creating your free account.</p>
        <form onSubmit={onSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" name="fullName" value={fullName} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" value={username} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" value={email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" value={password} onChange={onChange} minLength="6" required />
          </div>
          <button type="submit" className="auth-button">Sign Up</button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;