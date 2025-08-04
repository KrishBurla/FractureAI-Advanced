import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PasswordValidator from '../components/PasswordValidator/PasswordValidator'; // Import the new component
import './Login.css';

const SignUp = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  // State to track password validation
  const [validations, setValidations] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const { fullName, username, email, password } = formData;

  // Effect to validate password whenever it changes
  useEffect(() => {
    setValidations({
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    });
  }, [password]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const allValid = Object.values(validations).every(Boolean);
    if (!allValid) {
      setError('Please ensure your password meets all requirements.');
      return;
    }

    const result = await register({ fullName, username, email, password });
    if (result.success) {
      navigate('/');
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
          {error && <div className="alert-message error">{error}</div>}
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
            <input type="password" name="password" value={password} onChange={onChange} required />
            {/* Render the validator component */}
            <PasswordValidator validations={validations} />
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